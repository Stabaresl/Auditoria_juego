// useRoom.js — Trivia Battle
// ONLINE: ambos fighters responden simultáneamente.
// Cuando ambos responden → host resuelve → aplica daño → avanza pregunta.
// Si A falla → A recibe daño. Si B falla → B recibe daño. Independientes.
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  createRoom, joinRoom, subscribeRoom,
  pushGameState, setPlayerReady, deleteRoom, leaveRoom,
} from './firebase'
import { buildQuestionBank, getQuestion } from './triviaEngine'
import { CHAPTERS } from './gameData'

export const PLAYER_COLORS = [
  { bg: '#4a90d9', light: 'rgba(74,144,217,0.15)' },
  { bg: '#ff3d5a', light: 'rgba(255,61,90,0.15)'  },
  { bg: '#3dffc0', light: 'rgba(61,255,192,0.15)' },
  { bg: '#f0e040', light: 'rgba(240,224,64,0.15)' },
  { bg: '#ff8c42', light: 'rgba(255,140,66,0.15)' },
  { bg: '#9b59b6', light: 'rgba(155,89,182,0.15)' },
]

export const TEAM_COLORS = {
  0: { main: '#4a90d9', dark: '#1a5fa8', name: 'Equipo Azul' },
  1: { main: '#ff3d5a', dark: '#a01030', name: 'Equipo Rojo' },
}

const MAX_HP = 100
const DMG    = 20

function calcTotalRounds(players) {
  const a = players.filter(p => p.team === 0).length
  const b = players.filter(p => p.team === 1).length
  return Math.max(6, Math.max(a, b) * 4)
}

// ── Estado inicial del juego online ──────────────────────────────────────────
// roundAnswers: { teamA: null|true|false, teamB: null|true|false }
// null = no ha respondido, true/false = respondió correcto/incorrecto
function buildInitialGame(players, chapterId) {
  const chapter = CHAPTERS.find(c => c.id === chapterId) ?? CHAPTERS[0]
  const bank    = buildQuestionBank(50)
  const teamA   = players.filter(p => p.team === 0)
  const teamB   = players.filter(p => p.team === 1)
  const firstQ  = getQuestion(bank, [])

  return {
    screen:       'battle',
    chapter, players, bank,
    usedQIds:     [firstQ.id],
    currentQ:     firstQ,
    currentFighters: {
      teamA: teamA[0]?.id ?? null,
      teamB: teamB[0]?.id ?? null,
    },
    fighterIdxA:  0,
    fighterIdxB:  0,
    hp:           { 0: MAX_HP, 1: MAX_HP },
    scores:       Object.fromEntries(players.map(p => [p.id, 0])),
    // Respuestas de la ronda actual (simultáneas)
    roundAnswers: { teamA: null, teamB: null },
    lastResult:   null,
    round:        1,
    totalRounds:  calcTotalRounds(players),
    winner:       null,
    isSuddenDeath: false,
    history:      [],
    pendingNextQ: null,
    resolving:    false,  // lock para evitar double-resolve
  }
}

// ── Resolver la ronda cuando ambos respondieron ──────────────────────────────
// cA: respuesta del equipo A (true=correcto, false=incorrecto/timeout)
// cB: respuesta del equipo B
// optsA/optsB: { shield, double, sabotage } — habilidades usadas
function resolveRound(g, cA, cB, optsA = {}, optsB = {}) {
  const newHp     = { ...g.hp }
  const newScores = { ...g.scores }

  const fighterA = g.players.find(p => p.id === g.currentFighters?.teamA)
  const fighterB = g.players.find(p => p.id === g.currentFighters?.teamB)

  // Daño base
  let dmgA = cA ? 0 : DMG
  let dmgB = cB ? 0 : DMG

  // Escudo: anula daño propio si falló
  if (!cA && optsA.shield) dmgA = 0
  if (!cB && optsB.shield) dmgB = 0

  // Sabotaje: si el rival falla, recibe 10 HP extra
  if (!cA && optsB.sabotage) dmgA += 10
  if (!cB && optsA.sabotage) dmgB += 10

  if (dmgA > 0) newHp[0] = Math.max(0, (newHp[0] ?? MAX_HP) - dmgA)
  if (dmgB > 0) newHp[1] = Math.max(0, (newHp[1] ?? MAX_HP) - dmgB)

  // Puntos — doble apuesta: +20 pts extra si acertó, -10 HP extra si falló
  const ptsA = cA ? (10 + (optsA.double ? 20 : 0)) : 0
  const ptsB = cB ? (10 + (optsB.double ? 20 : 0)) : 0
  if (!cA && optsA.double && dmgA > 0) newHp[0] = Math.max(0, newHp[0] - 10)
  if (!cB && optsB.double && dmgB > 0) newHp[1] = Math.max(0, newHp[1] - 10)

  if (ptsA > 0 && fighterA) newScores[fighterA.id] = (newScores[fighterA.id] ?? 0) + ptsA
  if (ptsB > 0 && fighterB) newScores[fighterB.id] = (newScores[fighterB.id] ?? 0) + ptsB

  // Ganador
  let winner = null
  if (newHp[0] <= 0 && newHp[1] <= 0) winner = 'draw'
  else if (newHp[0] <= 0) winner = 1
  else if (newHp[1] <= 0) winner = 0

  // lastResult para animaciones en BattleScreen
  // Si solo A falló: B ataca a A. Si solo B falló: A ataca a B. Ambos fallaron: dos ataques.
  const lastResult = {
    correctA: cA, correctB: cB,
    dmgA, dmgB,
    // Para la animación principal tomamos el primer daño
    attackerTeam: !cA ? 1 : (!cB ? 0 : null),
    defenderTeam: !cA ? 0 : (!cB ? 1 : null),
    bothCorrect:  cA && cB,
    bothWrong:    !cA && !cB,
  }

  // Historial — guardar campos que ResultScreen necesita
  const newHistory = [...(g.history ?? []), {
    round:        g.round,
    fighters:     g.currentFighters,
    answeredByA:  g.currentFighters?.teamA,
    answeredByB:  g.currentFighters?.teamB,
    answerA:      cA, answerB: cB,
    dmgA, dmgB,
    ptsA, ptsB,
    questionText: g.currentQ?.question ?? '',
    topic:        g.currentQ?.topic ?? '',
  }]

  // Preparar siguiente pregunta
  const newUsed = [...(g.usedQIds ?? []), g.currentQ.id]
  const nextQ   = getQuestion(g.bank, newUsed)
  const teamA   = g.players.filter(p => p.team === 0)
  const teamB   = g.players.filter(p => p.team === 1)
  const niA     = ((g.fighterIdxA ?? 0) + 1) % Math.max(teamA.length, 1)
  const niB     = ((g.fighterIdxB ?? 0) + 1) % Math.max(teamB.length, 1)
  const newRound = (g.round ?? 1) + 1
  const roundsOver = winner === null && newRound > (g.totalRounds ?? 9999) && !g.isSuddenDeath

  return {
    newHp, newScores, winner, lastResult, newHistory,
    pendingNextQ: {
      q:           nextQ,
      usedQIds:    [...newUsed, nextQ.id],
      round:       newRound,
      fighterIdxA: niA, fighterIdxB: niB,
      currentFighters: {
        teamA: teamA[niA]?.id ?? teamA[0]?.id ?? null,
        teamB: teamB[niB]?.id ?? teamB[0]?.id ?? null,
      },
      roundsOver,
    }
  }
}

export function useRoom() {
  const [mode,       setMode]       = useState('idle')
  const [roomCode,   setRoomCode]   = useState('')
  const [myPlayerId, setMyPlayerId] = useState(null)
  const [isHost,     setIsHost]     = useState(false)
  const [roomData,   setRoomData]   = useState(null)
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)

  const unsubRef    = useRef(null)
  const isHostRef   = useRef(false)
  const roomCodeRef = useRef('')
  const myPlayerIdRef = useRef(null)

  useEffect(() => { isHostRef.current    = isHost    }, [isHost])
  useEffect(() => { roomCodeRef.current  = roomCode  }, [roomCode])
  useEffect(() => { myPlayerIdRef.current = myPlayerId }, [myPlayerId])
  useEffect(() => () => unsubRef.current?.(), [])

  const subscribe = useCallback(code => {
    unsubRef.current?.()
    unsubRef.current = subscribeRoom(code, data => setRoomData(data))
  }, [])

  const handleCreateRoom = useCallback(async (hostName, chapterId) => {
    setLoading(true); setError('')
    try {
      const code = await createRoom(hostName, chapterId)
      setRoomCode(code); setMyPlayerId('p0'); setIsHost(true); setMode('online')
      subscribe(code)
    } catch { setError('No se pudo crear la sala.') }
    finally  { setLoading(false) }
  }, [subscribe])

  const handleJoinRoom = useCallback(async (code, playerName) => {
    setLoading(true); setError('')
    try {
      const result = await joinRoom(code.toUpperCase(), playerName)
      if (!result.ok) { setError(result.error); setLoading(false); return false }
      setRoomCode(code.toUpperCase()); setMyPlayerId(result.playerId)
      setIsHost(false); setMode('online')
      subscribe(code.toUpperCase())
      return true
    } catch { setError('No se pudo unir a la sala.'); return false }
    finally  { setLoading(false) }
  }, [subscribe])

  const handleStartGame = useCallback(async () => {
    if (!isHostRef.current || !roomData) return
    const players = Object.values(roomData.players ?? {})
      .map(p => ({ ...p, color: PLAYER_COLORS[p.colorIdx] }))
    if (players.length < 2) return
    const game = buildInitialGame(players, roomData.chapterId)
    await pushGameState(roomCodeRef.current, game)
  }, [roomData])

  // ── Responder pregunta ─────────────────────────────────────────────────────
  // Cada jugador solo registra su respuesta en Firebase.
  // El host observa y resuelve cuando ve ambas respuestas (useEffect abajo).
  const handleAnswer = useCallback(async (correct, opts = {}) => {
    if (!roomData?.game) return
    const g = roomData.game
    if (g.winner !== null && g.winner !== undefined) return
    if (g.pendingNextQ) return   // ya se resolvió esta ronda, esperando avance

    const pid    = myPlayerIdRef.current
    const myP    = g.players.find(p => p.id === pid)
    const myTeam = myP?.team ?? 0
    const side   = myTeam === 0 ? 'teamA' : 'teamB'

    // Solo el fighter activo de mi equipo responde
    const activeFighter = myTeam === 0 ? g.currentFighters?.teamA : g.currentFighters?.teamB
    if (pid !== activeFighter) return

    // ¿Ya respondí esta ronda?
    const prev = g.roundAnswers?.[side]
    if (prev !== null && prev !== undefined) return

    // Solo escribir mi respuesta + opciones de habilidad — el host las detectará y resolverá
    await pushGameState(roomCodeRef.current, {
      ...g,
      roundAnswers: {
        teamA: g.roundAnswers?.teamA ?? null,
        teamB: g.roundAnswers?.teamB ?? null,
        [side]: correct,
      },
      // Guardar opciones de habilidad por equipo para que el host las use al resolver
      abilityOpts: {
        ...(g.abilityOpts ?? {}),
        [side]: { shield: opts.shield ?? false, double: opts.double ?? false, sabotage: opts.sabotage ?? false },
      },
    })
  }, [roomData])

  // ── El host resuelve cuando ambas respuestas están listas ─────────────────
  // Este es el ÚNICO lugar donde se resuelve una ronda online.
  // Se dispara cada vez que roomData cambia, el host verifica si puede resolver.
  useEffect(() => {
    if (!isHostRef.current || !roomData?.game) return
    const g = roomData.game
    if (g.winner !== null && g.winner !== undefined) return
    if (g.pendingNextQ) return   // ya está resuelta, esperando avance

    const ra = g.roundAnswers
    const aReady = ra?.teamA !== null && ra?.teamA !== undefined
    const bReady = ra?.teamB !== null && ra?.teamB !== undefined
    if (!aReady || !bReady) return   // aún falta alguna respuesta

    const optsA = g.abilityOpts?.teamA ?? {}
    const optsB = g.abilityOpts?.teamB ?? {}
    const resolved = resolveRound(g, ra.teamA, ra.teamB, optsA, optsB)
    const isGameOver = resolved.winner !== null && resolved.winner !== undefined

    pushGameState(roomCodeRef.current, {
      ...g,
      hp:           resolved.newHp,
      scores:       resolved.newScores,
      winner:       resolved.winner ?? null,
      lastResult:   resolved.lastResult,
      history:      resolved.newHistory,
      roundAnswers: ra,
      abilityOpts:  null,   // limpiar para la siguiente ronda
      pendingNextQ: resolved.pendingNextQ,
      resolving:    false,
      screen:       isGameOver ? 'result' : 'battle',
    })
  }, [roomData])

  // ── Avanzar a siguiente pregunta ──────────────────────────────────────────
  const handleNextQuestion = useCallback(async () => {
    if (!isHostRef.current || !roomData?.game) return
    const g = roomData.game
    if (!g.pendingNextQ) return
    const p = g.pendingNextQ

    if (p.roundsOver) {
      await pushGameState(roomCodeRef.current, {
        ...g,
        screen:       'draw',
        pendingNextQ: null,
      })
      return
    }

    await pushGameState(roomCodeRef.current, {
      ...g,
      currentQ:        p.q,
      usedQIds:        p.usedQIds,
      round:           p.round,
      fighterIdxA:     p.fighterIdxA,
      fighterIdxB:     p.fighterIdxB,
      currentFighters: p.currentFighters,
      roundAnswers:    { teamA: null, teamB: null },
      abilityOpts:     null,
      lastResult:      null,
      pendingNextQ:    null,
      resolving:       false,
      screen:          'battle',
    })
  }, [roomData])

  // ── Decisión de empate ────────────────────────────────────────────────────
  const handleDrawChoice = useCallback(async (choice) => {
    if (!isHostRef.current || !roomData?.game) return
    const g = roomData.game

    if (choice === 'draw') {
      await pushGameState(roomCodeRef.current, {
        ...g, winner: 'draw', screen: 'result',
      })
    } else {
      // Muerte súbita: continuar sin límite, usar siguiente pregunta pendiente
      const p = g.pendingNextQ ?? {}
      await pushGameState(roomCodeRef.current, {
        ...g,
        isSuddenDeath:   true,
        totalRounds:     9999,
        currentQ:        p.q ?? g.currentQ,
        usedQIds:        p.usedQIds ?? g.usedQIds,
        round:           p.round ?? g.round,
        fighterIdxA:     p.fighterIdxA ?? g.fighterIdxA,
        fighterIdxB:     p.fighterIdxB ?? g.fighterIdxB,
        currentFighters: p.currentFighters ?? g.currentFighters,
        roundAnswers:    { teamA: null, teamB: null },
        lastResult:      null,
        pendingNextQ:    null,
        resolving:       false,
        screen:          'battle',
      })
    }
  }, [roomData])

  const handleRestart = useCallback(async () => {
    if (isHostRef.current) await deleteRoom(roomCodeRef.current)
    else await leaveRoom(roomCodeRef.current, myPlayerIdRef.current)
    unsubRef.current?.()
    setMode('idle'); setRoomCode(''); setMyPlayerId(null)
    setIsHost(false); setRoomData(null); setError('')
  }, [])

  // ── Dungeon Online: iniciar mazmorra ──────────────────────────────────────
  const handleStartDungeonOnline = useCallback(async (monsterId, difficulty) => {
    if (!isHostRef.current || !roomData) return
    const players = Object.values(roomData.players ?? {})
      .map(p => ({ ...p, color: PLAYER_COLORS[p.colorIdx], team: 0 }))
    if (players.length < 1) return

    const { buildQuestionBank: bqb, getQuestion: gq } = await import('./triviaEngine')
    const { MONSTERS } = await import('./screens/DungeonScreen')
    const { CHAPTERS: CH } = await import('./gameData')

    const monDef   = MONSTERS[monsterId]
    const maxHp    = monDef.hp[difficulty]
    const atkEvery = monDef.atkEvery[difficulty]
    const bank     = bqb(60)
    const firstQ   = gq(bank, [])

    const TOTAL_ROUNDS = { easy:20, normal:16, hard:12 }

    const game = {
      screen:        'dungeon',
      gameMode:      'dungeon',
      monsterId, difficulty, monsterDef: monDef,
      players, bank,
      usedQIds:      [firstQ.id],
      currentQ:      firstQ,
      monsterHp:     maxHp,
      maxMonsterHp:  maxHp,
      teamHp:        100,
      scores:        Object.fromEntries(players.map(p => [p.id, 0])),
      round:         1,
      totalRounds:   TOTAL_ROUNDS[difficulty],
      fighterIdx:    0,
      currentFighter: players[0]?.id ?? null,
      atkEvery,
      lastResult:    null,
      winner:        null,
      history:       [],
      _pendingNext:  null,
      dungeonAnswers: null,   // { [playerId]: true|false|null }
    }
    await pushGameState(roomCodeRef.current, game)
  }, [roomData])

  // ── Dungeon Online: responder (cualquier jugador en su turno) ─────────────
  const handleDungeonAnswerOnline = useCallback(async (correct, opts = {}) => {
    if (!roomData?.game) return
    const g = roomData.game
    if (g.gameMode !== 'dungeon') return
    if (g.winner) return
    if (g._pendingNext) return

    const pid = myPlayerIdRef.current
    if (pid !== g.currentFighter) return   // solo el fighter activo responde

    await pushGameState(roomCodeRef.current, {
      ...g,
      dungeonAnswers: { answer: correct, shield: opts.shield ?? false, double: opts.double ?? false, playerId: pid },
    })
  }, [roomData])

  // ── El host resuelve la ronda de dungeon ──────────────────────────────────
  useEffect(() => {
    if (!isHostRef.current || !roomData?.game) return
    const g = roomData.game
    if (g.gameMode !== 'dungeon') return
    if (g.winner) return
    if (g._pendingNext) return
    if (!g.dungeonAnswers?.playerId) return
    if (g.dungeonAnswers.playerId !== g.currentFighter) return

    const { answer: correct, shield = false, double: dbl = false } = g.dungeonAnswers
    const MONSTER_DMG_MAP = { easy:10, normal:15, hard:25 }
    const PLAYER_DMG_MAP  = { easy:25, normal:35, hard:50 }
    const DOUBLE_BONUS    = { pts:20, dmg:10 }

    const monDmg = MONSTER_DMG_MAP[g.difficulty]
    const plDmg  = PLAYER_DMG_MAP[g.difficulty] + (dbl ? DOUBLE_BONUS.dmg : 0)
    const pts    = correct ? (10 + (dbl ? DOUBLE_BONUS.pts : 0)) : 0

    let newMonsterHp = g.monsterHp
    let newTeamHp    = g.teamHp
    let dmg = 0, dmgTeam = 0

    if (correct) {
      dmg = plDmg
      newMonsterHp = Math.max(0, g.monsterHp - dmg)
    } else if (!shield) {
      dmgTeam = monDmg
      newTeamHp = Math.max(0, g.teamHp - dmgTeam)
    }

    // Ataque especial del monstruo cada N rondas
    if (g.round % g.atkEvery === 0 && !correct) {
      const bonusDmg = Math.floor(monDmg * .5)
      newTeamHp = Math.max(0, newTeamHp - bonusDmg)
      dmgTeam  += bonusDmg
    }

    const fighter   = g.players.find(p => p.id === g.currentFighter)
    const newScores = { ...g.scores }
    if (fighter && pts > 0) newScores[fighter.id] = (newScores[fighter.id] ?? 0) + pts

    const lastResult = { correct, answeredBy: fighter?.id, dmg, dmgTeam, pts,
      questionText: g.currentQ?.question ?? '', topic: g.currentQ?.topic ?? '' }
    const newHistory = [...(g.history ?? []), {
      round: g.round, answeredBy: fighter?.id, answererName: fighter?.name ?? '',
      correct, dmg, dmgTeam, pts, questionText: g.currentQ?.question ?? '',
    }]

    const winner = newMonsterHp <= 0 ? 'victory'
                 : newTeamHp <= 0   ? 'defeat'
                 : g.round + 1 > g.totalRounds ? 'defeat'
                 : null

    const nextIdx     = (g.fighterIdx + 1) % g.players.length
    const nextFighter = g.players[nextIdx]?.id ?? g.players[0]?.id
    const newUsed     = [...(g.usedQIds ?? []), g.currentQ.id]

    // Import getQuestion dynamically to get next Q
    import('./triviaEngine').then(({ getQuestion: gq }) => {
      const nextQ = gq(g.bank, newUsed)
      pushGameState(roomCodeRef.current, {
        ...g,
        monsterHp:    newMonsterHp,
        teamHp:       newTeamHp,
        scores:       newScores,
        lastResult,
        history:      newHistory,
        winner:       winner ?? null,
        dungeonAnswers: null,
        screen:       winner ? 'result' : 'dungeon',
        _goToResult:  winner !== null,
        _pendingNext: winner ? null : {
          currentQ:      nextQ,
          usedQIds:      [...newUsed, nextQ.id],
          round:         g.round + 1,
          fighterIdx:    nextIdx,
          currentFighter: nextFighter,
        },
      })
    })
  }, [roomData])

  // ── Dungeon Online: avanzar a siguiente pregunta ──────────────────────────
  const handleDungeonNextOnline = useCallback(async () => {
    if (!isHostRef.current || !roomData?.game) return
    const g = roomData.game
    if (g.gameMode !== 'dungeon' || !g._pendingNext || g.winner) return
    const p = g._pendingNext
    await pushGameState(roomCodeRef.current, {
      ...g,
      currentQ:       p.currentQ,
      usedQIds:       p.usedQIds,
      round:          p.round,
      fighterIdx:     p.fighterIdx,
      currentFighter: p.currentFighter,
      lastResult:     null,
      _pendingNext:   null,
      _goToResult:    false,
      screen:         'dungeon',
    })
  }, [roomData])

  const game    = roomData?.game ?? null
  const players = roomData
    ? Object.values(roomData.players ?? {}).map(p => ({ ...p, color: PLAYER_COLORS[p.colorIdx] }))
    : []

  return {
    mode, roomCode, myPlayerId, isHost,
    roomData, game, players, error, loading,
    handleCreateRoom, handleJoinRoom, handleStartGame,
    handleAnswer, handleNextQuestion, handleRestart, handleDrawChoice,
    handleStartDungeonOnline, handleDungeonAnswerOnline, handleDungeonNextOnline,
    setError,
    setPlayerReady: ready => setPlayerReady(roomCodeRef.current, myPlayerId, ready),
  }
}
