// useDungeon.js — Lógica del modo mazmorra (local hot-seat)
// Cooperativo: todos los jugadores contra el monstruo.
// Cada jugador responde por turno (rotando). Correcta → daña monstruo. Incorrecta → monstruo daña al equipo.
// Cada MONSTER_ATK_EVERY rondas el monstruo hace un ataque especial.
import { useState, useCallback, useEffect, useRef } from 'react'
import { buildQuestionBank, getQuestion } from './triviaEngine'
import { MONSTERS } from './screens/DungeonScreen'

const TEAM_MAX_HP  = 100
const MONSTER_DMG  = { easy:10, normal:15, hard:25 }
const PLAYER_DMG   = { easy:25, normal:35, hard:50 }  // daño al monstruo por acierto
const DOUBLE_BONUS = { pts:20, dmg:10 }
const TOTAL_ROUNDS = { easy:20, normal:16, hard:12 }

function buildDungeonGame(players, monsterId, difficulty, chapterId) {
  const monDef   = MONSTERS[monsterId]
  const maxHp    = monDef.hp[difficulty]
  const atkEvery = monDef.atkEvery[difficulty]
  const bank     = buildQuestionBank(60)
  const firstQ   = getQuestion(bank, [])

  return {
    gameMode:     'dungeon',
    monsterId,    difficulty, monsterDef: monDef,
    players,      bank,
    usedQIds:     [firstQ.id],
    currentQ:     firstQ,
    monsterHp:    maxHp,
    maxMonsterHp: maxHp,
    teamHp:       TEAM_MAX_HP,
    scores:       Object.fromEntries(players.map(p => [p.id, 0])),
    round:        1,
    totalRounds:  TOTAL_ROUNDS[difficulty],
    fighterIdx:   0,          // índice del jugador activo (rota cada pregunta)
    currentFighter: players[0]?.id ?? null,
    atkEvery,
    lastResult:   null,
    winner:       null,       // null | 'victory' | 'defeat'
    history:      [],
    _pendingNext: null,
    _goToResult:  false,
  }
}

export function useDungeon() {
  const [dungeonGame, setDungeonGame] = useState(null)
  const [dungeonPlayers, setDungeonPlayers] = useState([])
  const screenRef = useRef('home')

  const startDungeon = useCallback((players, monsterId, difficulty, chapterId) => {
    setDungeonPlayers(players)
    setDungeonGame(buildDungeonGame(players, monsterId, difficulty, chapterId ?? 'cap1'))
  }, [])

  // Detectar winner
  const checkWinner = useCallback((g) => {
    if (g.monsterHp <= 0) return 'victory'
    if (g.teamHp <= 0)    return 'defeat'
    if (g.round > g.totalRounds && g.monsterHp > 0) return 'defeat'
    return null
  }, [])

  const handleDungeonAnswer = useCallback((correct, opts = {}) => {
    setDungeonGame(g => {
      if (!g || g.winner) return g

      const { shield = false, double = false } = opts
      const monDef   = MONSTERS[g.monsterId]
      const fighter  = g.players.find(p => p.id === g.currentFighter)
      const monDmg   = MONSTER_DMG[g.difficulty]
      const plDmg    = PLAYER_DMG[g.difficulty] + (double ? DOUBLE_BONUS.dmg : 0)
      const pts      = correct ? (10 + (double ? DOUBLE_BONUS.pts : 0)) : 0

      let newMonsterHp = g.monsterHp
      let newTeamHp    = g.teamHp
      let monsterAttacked = false
      let dmg = 0, dmgTeam = 0

      if (correct) {
        dmg = plDmg
        newMonsterHp = Math.max(0, g.monsterHp - dmg)
      } else {
        if (!shield) {
          dmgTeam = monDmg
          newTeamHp = Math.max(0, g.teamHp - dmgTeam)
        }
      }

      // Ataque especial del monstruo cada N rondas (si ya respondió incorrectamente suma)
      if (g.round % g.atkEvery === 0 && !correct) {
        monsterAttacked = true
        const bonusDmg = Math.floor(monDmg * .5)
        newTeamHp = Math.max(0, newTeamHp - bonusDmg)
        dmgTeam += bonusDmg
      }

      const newScores = { ...g.scores }
      if (fighter && pts > 0) newScores[fighter.id] = (newScores[fighter.id] ?? 0) + pts

      const lastResult = {
        correct, answeredBy: fighter?.id,
        dmg, dmgTeam, pts,
        monsterAttacked,
        questionText: g.currentQ?.question ?? '',
        topic:        g.currentQ?.topic ?? '',
      }

      const newHistory = [...(g.history ?? []), {
        round: g.round, answeredBy: fighter?.id,
        answererName: fighter?.name ?? '',
        correct, dmg, dmgTeam, pts, monsterAttacked,
        questionText: g.currentQ?.question ?? '',
        topic:        g.currentQ?.topic ?? '',
      }]

      // Calcular winner
      const tmpGame = { ...g, monsterHp:newMonsterHp, teamHp:newTeamHp, round:g.round+1 }
      const winner  = newMonsterHp <= 0 ? 'victory'
                    : newTeamHp <= 0 ? 'defeat'
                    : g.round + 1 > g.totalRounds ? 'defeat'
                    : null

      // Siguiente fighter (rota entre todos)
      const nextIdx  = (g.fighterIdx + 1) % g.players.length
      const nextFighter = g.players[nextIdx]?.id ?? g.players[0]?.id

      // Siguiente pregunta
      const newUsed = [...(g.usedQIds ?? []), g.currentQ.id]
      const nextQ   = getQuestion(g.bank, newUsed)

      return {
        ...g,
        monsterHp:    newMonsterHp,
        teamHp:       newTeamHp,
        scores:       newScores,
        lastResult,
        history:      newHistory,
        winner,
        _goToResult:  winner !== null,
        _pendingNext: winner ? null : {
          currentQ:      nextQ,
          usedQIds:      [...newUsed, nextQ.id],
          round:         g.round + 1,
          fighterIdx:    nextIdx,
          currentFighter: nextFighter,
        },
      }
    })
  }, [])

  const handleDungeonNext = useCallback(() => {
    setDungeonGame(g => {
      if (!g?._pendingNext || g.winner) return g
      const p = g._pendingNext
      return {
        ...g,
        currentQ:       p.currentQ,
        usedQIds:       p.usedQIds,
        round:          p.round,
        fighterIdx:     p.fighterIdx,
        currentFighter: p.currentFighter,
        lastResult:     null,
        _pendingNext:   null,
        _goToResult:    false,
      }
    })
  }, [])

  const resetDungeon = useCallback(() => {
    setDungeonGame(null)
    setDungeonPlayers([])
  }, [])

  return {
    dungeonGame, dungeonPlayers,
    startDungeon, handleDungeonAnswer, handleDungeonNext, resetDungeon,
  }
}
