import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import HomeScreen        from './screens/HomeScreen'
import LobbyScreen       from './screens/LobbyScreen'
import BattleScreen      from './screens/BattleScreen'
import ResultScreen      from './screens/ResultScreen'
import OnlineSetupScreen from './screens/OnlineSetupScreen'
import OnlineLobbyScreen from './screens/OnlineLobbyScreen'
import MusicBtn          from './MusicBtn'
import { useRoom, TEAM_COLORS } from './useRoom'
import { buildQuestionBank, getQuestion } from './triviaEngine'
import { CHAPTERS } from './gameData'
import { sfx } from './sounds'
import { useDungeon } from './useDungeon'
import DungeonScreen      from './screens/DungeonScreen'
import DungeonSetupScreen from './screens/DungeonSetupScreen'

const MAX_HP  = 100
const DMG     = 20
const TRANSITION = { type:'tween', ease:'easeInOut', duration:.3 }

// ── Cuántas rondas: cada fighter de cada equipo juega N veces ─────────────────
function calcTotalRounds(players) {
  const a = players.filter(p => p.team === 0).length
  const b = players.filter(p => p.team === 1).length
  // 1 ronda = equipo A responde + equipo B responde (2 preguntas)
  // Queremos que cada jugador responda ~4 veces
  return Math.max(6, Math.max(a, b) * 4)
}

// ── Construir juego local ─────────────────────────────────────────────────────
function buildLocalGame(players, chapterId) {
  const chapter = CHAPTERS.find(c => c.id === chapterId) ?? CHAPTERS[0]
  const bank    = buildQuestionBank(50)
  const firstQ  = getQuestion(bank, [])
  const teamA   = players.filter(p => p.team === 0)
  const teamB   = players.filter(p => p.team === 1)

  return {
    chapter, players, bank,
    usedQIds:        [firstQ.id],
    currentQ:        firstQ,
    // currentTurn: 0 = equipo A responde esta pregunta
    //              1 = equipo B responde esta pregunta
    currentTurn:     0,
    currentFighters: { teamA: teamA[0]?.id ?? null, teamB: teamB[0]?.id ?? null },
    fighterIdxA:     0,
    fighterIdxB:     0,
    hp:              { 0: MAX_HP, 1: MAX_HP },
    scores:          Object.fromEntries(players.map(p => [p.id, 0])),
    lastResult:      null,
    round:           1,            // 1 ronda = A+B responden = 2 preguntas
    totalRounds:     calcTotalRounds(players),
    winner:          null,         // null | 0 | 1 | 'draw'
    isSuddenDeath:   false,
    history:         [],
  }
}

export default function App() {
  const [screen,       setScreen]       = useState('home')
  const [chapterId,    setChapterId]    = useState(null)
  const [localGame,    setLocalGame]    = useState(null)
  const [localPlayers, setLocalPlayers] = useState([])
  const screenRef = useRef('home')

  const room = useRoom()
  const dungeon = useDungeon()

  // Mantener ref sincronizada con screen para usar en callbacks
  useEffect(() => { screenRef.current = screen }, [screen])

  // ── Detectar winner/roundsOver en juego local y cambiar pantalla ───────────
  // Usamos useEffect en lugar de lógica inline para evitar setState-dentro-de-setState
  useEffect(() => {
    if (!localGame) return
    const s = screenRef.current

    if (localGame.winner !== null && localGame.winner !== undefined && s === 'battle') {
      const t = setTimeout(() => setScreen('result'), 2600)
      return () => clearTimeout(t)
    }
    if (localGame._goToDraw && s === 'battle') {
      setLocalGame(g => g ? { ...g, _goToDraw: false } : g)
      setScreen('draw')
    }
  }, [localGame])

  // ── LOCAL: iniciar juego ───────────────────────────────────────────────────
  const handleStartLocalGame = useCallback((players) => {
    setLocalPlayers(players)
    setLocalGame(buildLocalGame(players, chapterId))
    setScreen('battle')
    sfx.roundStart()
  }, [chapterId])

  // ── LOCAL: responder pregunta ──────────────────────────────────────────────
  // turno 0: equipo A responde → si falla, A recibe daño
  // turno 1: equipo B responde → si falla, B recibe daño
  // Al terminar los 2 turnos de una ronda → round++
  // Si round > totalRounds y no hay ganador → _goToDraw = true
  const handleLocalAnswer = useCallback((correct) => {
    setLocalGame(g => {
      if (!g || g.winner !== null) return g

      const turn         = g.currentTurn ?? 0
      const answererTeam = turn   // equipo 0 o 1

      // Fighter que está respondiendo esta pregunta
      const fighterId = turn === 0 ? g.currentFighters?.teamA : g.currentFighters?.teamB
      const answerer  = g.players.find(p => p.id === fighterId)

      // Calcular daño: si fallas recibes daño del rival
      const newHp = { ...g.hp }
      let dmg = 0
      if (!correct) {
        dmg = DMG
        newHp[answererTeam] = Math.max(0, (newHp[answererTeam] ?? MAX_HP) - DMG)
      }

      // Ganador por HP
      let winner = null
      if (newHp[0] <= 0 && newHp[1] <= 0) winner = 'draw'
      else if (newHp[0] <= 0) winner = 1
      else if (newHp[1] <= 0) winner = 0

      // Scores
      const newScores = { ...g.scores }
      if (correct && answerer) newScores[answerer.id] = (newScores[answerer.id] ?? 0) + 10

      // Historial
      const newHistory = [...(g.history ?? []), {
        round: g.round, turn,
        answeredBy:   answerer?.id,
        answererName: answerer?.name ?? '',
        correct, dmg,
        pts:          correct ? 10 : 0,
        questionText: g.currentQ?.question ?? '',
        topic:        g.currentQ?.topic ?? '',
      }]

      // lastResult para animaciones
      const lastResult = {
        correct,
        answererTeam,
        // El que "ataca" es el rival del que respondió (cuando el respondedor falla)
        attackerTeam: correct ? null : (answererTeam === 0 ? 1 : 0),
        defenderTeam: answererTeam,
        dmg,
      }

      // Si ya hay ganador, guardar y salir (el useEffect navega a result)
      if (winner !== null) {
        return { ...g, hp: newHp, scores: newScores, lastResult, winner, history: newHistory }
      }

      // Calcular siguiente turno/ronda
      const isLastTurnOfRound = turn === 1   // B acaba de responder → ronda completa
      const newTurn    = isLastTurnOfRound ? 0 : 1
      const newRound   = isLastTurnOfRound ? g.round + 1 : g.round

      // ¿Se agotaron las rondas?
      const roundsOver = isLastTurnOfRound && newRound > g.totalRounds && !g.isSuddenDeath

      // Rotar fighters solo al iniciar nueva ronda (cuando completamos A+B)
      let newFighterIdxA = g.fighterIdxA
      let newFighterIdxB = g.fighterIdxB
      let newFighters    = g.currentFighters
      if (isLastTurnOfRound) {
        const teamA = g.players.filter(p => p.team === 0)
        const teamB = g.players.filter(p => p.team === 1)
        newFighterIdxA = (g.fighterIdxA + 1) % Math.max(teamA.length, 1)
        newFighterIdxB = (g.fighterIdxB + 1) % Math.max(teamB.length, 1)
        newFighters = {
          teamA: teamA[newFighterIdxA]?.id ?? teamA[0]?.id ?? null,
          teamB: teamB[newFighterIdxB]?.id ?? teamB[0]?.id ?? null,
        }
      }

      // Nueva pregunta
      const newUsed = [...(g.usedQIds ?? []), g.currentQ.id]
      const nextQ   = getQuestion(g.bank, newUsed)

      return {
        ...g,
        hp:          newHp,
        scores:      newScores,
        lastResult,
        history:     newHistory,
        winner:      null,
        // Estado actual (para mostrar animación de resultado)
        // El BattleScreen usará _pendingNext cuando llame onNextQuestion
        _pendingNext: {
          currentQ:        nextQ,
          usedQIds:        [...newUsed, nextQ.id],
          round:           newRound,
          currentTurn:     newTurn,
          currentFighters: newFighters,
          fighterIdxA:     newFighterIdxA,
          fighterIdxB:     newFighterIdxB,
        },
        _goToDraw: roundsOver,   // ← señal para useEffect, no setState aquí
      }
    })
  }, [])

  // ── LOCAL: avanzar a siguiente pregunta (llamado desde BattleScreen) ───────
  const handleLocalNext = useCallback(() => {
    setLocalGame(g => {
      if (!g?._pendingNext) return g
      if (g.winner !== null) return g   // el useEffect ya manejará la nav
      if (g._goToDraw) return g         // el useEffect ya manejará la nav

      const p = g._pendingNext
      return {
        ...g,
        currentQ:        p.currentQ,
        usedQIds:        p.usedQIds,
        round:           p.round,
        currentTurn:     p.currentTurn,
        currentFighters: p.currentFighters,
        fighterIdxA:     p.fighterIdxA,
        fighterIdxB:     p.fighterIdxB,
        lastResult:      null,
        _pendingNext:    null,
        // _goToDraw se mantiene tal cual para que useEffect lo procese
      }
    })
  }, [])

  // ── LOCAL: decisión de empate ──────────────────────────────────────────────
  const handleDrawChoice = useCallback((choice) => {
    if (choice === 'draw') {
      setLocalGame(g => ({ ...g, winner: 'draw', _goToDraw: false }))
      setScreen('result')
    } else {
      // Muerte súbita: continuar sin límite de rondas
      setLocalGame(g => {
        if (!g) return g
        const p = g._pendingNext
        return {
          ...g,
          isSuddenDeath:   true,
          totalRounds:     9999,
          _goToDraw:       false,
          // Aplicar la siguiente pregunta que ya estaba pendiente
          ...(p ? {
            currentQ:        p.currentQ,
            usedQIds:        p.usedQIds,
            round:           p.round,
            currentTurn:     p.currentTurn,
            currentFighters: p.currentFighters,
            fighterIdxA:     p.fighterIdxA,
            fighterIdxB:     p.fighterIdxB,
            lastResult:      null,
            _pendingNext:    null,
          } : {}),
        }
      })
      setScreen('battle')
      sfx.roundStart()
    }
  }, [])

  const handleRestart = useCallback(() => {
    room.handleRestart()
    dungeon.resetDungeon()
    setLocalGame(null)
    setLocalPlayers([])
    setChapterId(null)
    setScreen('home')
    sfx.click()
  }, [room, dungeon])

  // ── Dungeon: iniciar ──────────────────────────────────────────────────────
  const handleStartDungeon = useCallback((players, monsterId, difficulty) => {
    dungeon.startDungeon(players, monsterId, difficulty, chapterId)
    setScreen('dungeon')
    sfx.roundStart()
  }, [dungeon, chapterId])

  // ── Dungeon: detectar fin (local) ─────────────────────────────────────────
  useEffect(() => {
    if (!dungeon.dungeonGame) return
    if (dungeon.dungeonGame._goToResult && screen === 'dungeon') {
      const t = setTimeout(() => setScreen('result'), 2600)
      return () => clearTimeout(t)
    }
  }, [dungeon.dungeonGame, screen])

  const handleGoLocal    = (chapId) => { sfx.click(); setChapterId(chapId); setScreen('lobby') }
  const handleGoOnline   = (chapId) => { sfx.click(); setChapterId(chapId); setScreen('online-setup') }
  const handleGoDungeon  = (chapId) => { sfx.click(); setChapterId(chapId); setScreen('dungeon-setup') }

  const chapter  = CHAPTERS.find(c => c.id === chapterId)

  // ── Detectar modo de juego actual ─────────────────────────────────────────
  const isOnlineDungeon = room.mode === 'online' && room.game?.gameMode === 'dungeon'
  const isLocalDungeon  = (screen === 'dungeon' || screen === 'dungeon-setup') && room.mode !== 'online'
  const isDungeon = isLocalDungeon || isOnlineDungeon
  const isOnline  = !isLocalDungeon && (screen.startsWith('online') || room.mode === 'online')

  const game    = isOnlineDungeon ? room.game
                : isLocalDungeon  ? dungeon.dungeonGame
                : isOnline        ? room.game
                : localGame
  const players = isOnlineDungeon ? room.players
                : isLocalDungeon  ? dungeon.dungeonPlayers
                : isOnline        ? room.players
                : localPlayers

  // ── Online: sincronizar pantallas (incluye dungeon) ───────────────────────
  const onlineScreen = room.game?.screen
  useEffect(() => {
    if (room.mode !== 'online') return
    if (onlineScreen === 'battle' && screenRef.current !== 'battle' && screenRef.current !== 'result' && screenRef.current !== 'draw') {
      setScreen('battle')
    }
    if (onlineScreen === 'dungeon' && screenRef.current !== 'dungeon' && screenRef.current !== 'result') {
      setScreen('dungeon')
    }
    if (onlineScreen === 'draw' && screenRef.current !== 'draw') {
      setScreen('draw')
    }
  }, [onlineScreen, room.mode])

  useEffect(() => {
    if (room.mode !== 'online') return
    const w = room.game?.winner
    if (w !== null && w !== undefined && screenRef.current !== 'result') {
      const delay = room.game?.gameMode === 'dungeon' ? 2600 : 0
      const t = setTimeout(() => setScreen('result'), delay)
      return () => clearTimeout(t)
    }
  }, [room.game?.winner, room.mode])

  return (
    <>
      <AnimatePresence mode="wait">

        {screen === 'home' && (
          <motion.div key="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={TRANSITION}>
            <HomeScreen onStartLocal={handleGoLocal} onStartOnline={handleGoOnline} onStartDungeon={handleGoDungeon} />
          </motion.div>
        )}

        {screen === 'lobby' && (
          <motion.div key="lobby" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}} transition={TRANSITION}>
            <LobbyScreen
              chapterId={chapterId} chapterName={chapter?.name}
              onStartGame={handleStartLocalGame} onBack={() => setScreen('home')}
            />
          </motion.div>
        )}

        {screen === 'online-setup' && !room.roomCode && (
          <motion.div key="osetup" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={TRANSITION}>
            <OnlineSetupScreen
              chapterId={chapterId} chapterName={chapter?.name}
              onBack={() => setScreen('home')}
              onCreateRoom={room.handleCreateRoom} onJoinRoom={room.handleJoinRoom}
              loading={room.loading} error={room.error}
            />
          </motion.div>
        )}

        {/* Lobby online — cualquier jugador una vez que existe roomCode y no hay partida */}
        {room.mode === 'online' && room.roomCode && !room.game && (
          <motion.div key="olobby" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={TRANSITION}>
            <OnlineLobbyScreen
              roomCode={room.roomCode} players={room.players}
              myPlayerId={room.myPlayerId} isHost={room.isHost}
              onStart={room.handleStartGame} onLeave={handleRestart}
              setPlayerReady={room.setPlayerReady}
              onStartDungeon={() => setScreen('dungeon-setup')}
            />
          </motion.div>
        )}

        {screen === 'battle' && game && (
          <motion.div key="battle" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={TRANSITION}>
            <BattleScreen
              game={game} players={players}
              myPlayerId={isOnline ? room.myPlayerId : null}
              isHost={isOnline ? room.isHost : true}
              isOnline={isOnline}
              onAnswer={isOnline ? room.handleAnswer : handleLocalAnswer}
              onNextQuestion={isOnline ? room.handleNextQuestion : handleLocalNext}
            />
          </motion.div>
        )}

        {screen === 'draw' && game && (
          <motion.div key="draw" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={TRANSITION}>
            <DrawScreen
              game={game} players={players}
              isHost={isOnline ? room.isHost : true}
              onChoice={isOnline ? room.handleDrawChoice : handleDrawChoice}
            />
          </motion.div>
        )}

        {screen === 'dungeon-setup' && (
          <motion.div key="dsetup" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={TRANSITION}>
            <DungeonSetupScreen
              chapterName={chapter?.name}
              onStart={isOnline ? (players, monsterId, diff) => { room.handleStartDungeonOnline(monsterId, diff); sfx.roundStart() } : handleStartDungeon}
              onBack={() => setScreen('home')}
              isOnline={isOnline && room.roomCode && !room.game}
            />
          </motion.div>
        )}

        {screen === 'dungeon' && (isOnlineDungeon ? room.game : dungeon.dungeonGame) && (
          <motion.div key="dungeon" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={TRANSITION}>
            <DungeonScreen
              game={isOnlineDungeon ? room.game : dungeon.dungeonGame}
              players={isOnlineDungeon ? room.players : dungeon.dungeonPlayers}
              myPlayerId={isOnlineDungeon ? room.myPlayerId : null}
              isHost={isOnlineDungeon ? room.isHost : true}
              isOnline={isOnlineDungeon}
              onAnswer={isOnlineDungeon ? room.handleDungeonAnswerOnline : dungeon.handleDungeonAnswer}
              onNextQuestion={isOnlineDungeon ? room.handleDungeonNextOnline : dungeon.handleDungeonNext}
            />
          </motion.div>
        )}

        {screen === 'result' && (
          <motion.div key="result" initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={TRANSITION}>
            <ResultScreen
              game={game}
              players={players}
              onRestart={handleRestart}
            />
          </motion.div>
        )}

      </AnimatePresence>
      <MusicBtn />
    </>
  )
}

// ── Pantalla de empate / fin de rondas ────────────────────────────────────────
function DrawScreen({ game, players, isHost, onChoice }) {
  const { scores, hp, totalRounds, isSuddenDeath } = game ?? {}
  const tc0 = TEAM_COLORS[0], tc1 = TEAM_COLORS[1]

  const teamAPlayers = players.filter(p => p.team === 0)
  const teamBPlayers = players.filter(p => p.team === 1)
  const scoreA = teamAPlayers.reduce((s, p) => s + (scores?.[p.id] ?? 0), 0)
  const scoreB = teamBPlayers.reduce((s, p) => s + (scores?.[p.id] ?? 0), 0)

  const leader = scoreA > scoreB ? tc0.name : scoreB > scoreA ? tc1.name : null

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, position:'relative', background:'var(--bg)' }}>
      {/* Glow fondo */}
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(240,224,64,.05) 0%, transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:520, display:'flex', flexDirection:'column', gap:20, alignItems:'center', textAlign:'center' }}>

        <motion.div initial={{opacity:0,y:-24}} animate={{opacity:1,y:0}}>
          <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gray)', marginBottom:10 }}>
            ⚔ {isSuddenDeath ? 'MUERTE SÚBITA' : `${totalRounds} RONDAS`} COMPLETADAS ⚔
          </p>
          <h2 style={{ fontFamily:'var(--pixel)', fontSize:'clamp(14px,3.5vw,22px)', color:'var(--gold)', textShadow:'0 0 20px rgba(240,224,64,.5)', lineHeight:1.6 }}>
            EMPATE
          </h2>
          <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gray)', marginTop:8 }}>
            Ningún equipo perdió todos sus HP
          </p>
        </motion.div>

        {/* Marcador */}
        <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{delay:.15}}
          className="card" style={{ width:'100%', padding:'20px 24px' }}>
          <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gray)', marginBottom:14 }}>PUNTUACIÓN FINAL</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:12, alignItems:'start' }}>
            {/* Equipo A */}
            <div>
              <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:tc0.main, marginBottom:6 }}>{tc0.name}</p>
              <p style={{ fontFamily:'var(--pixel)', fontSize:'clamp(22px,5vw,34px)', color:tc0.main }}>{scoreA}</p>
              <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', marginTop:3 }}>❤ {Math.ceil(hp?.[0] ?? 0)}</p>
              <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:4 }}>
                {teamAPlayers.map(p => (
                  <p key={p.id} style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--light)' }}>
                    {p.name}: <span style={{ color:tc0.main }}>{scores?.[p.id] ?? 0}</span>
                  </p>
                ))}
              </div>
            </div>

            <p style={{ fontFamily:'var(--pixel)', fontSize:12, color:'var(--gray)', marginTop:8 }}>VS</p>

            {/* Equipo B */}
            <div>
              <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:tc1.main, marginBottom:6 }}>{tc1.name}</p>
              <p style={{ fontFamily:'var(--pixel)', fontSize:'clamp(22px,5vw,34px)', color:tc1.main }}>{scoreB}</p>
              <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', marginTop:3 }}>❤ {Math.ceil(hp?.[1] ?? 0)}</p>
              <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:4 }}>
                {teamBPlayers.map(p => (
                  <p key={p.id} style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--light)' }}>
                    {p.name}: <span style={{ color:tc1.main }}>{scores?.[p.id] ?? 0}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {leader && (
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.4}}
              style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gold)', marginTop:14, padding:'6px', background:'rgba(240,224,64,.08)', borderRadius:4 }}>
              ⭐ {leader} lidera en puntos
            </motion.p>
          )}
        </motion.div>

        {/* Botones de decisión */}
        {isHost ? (
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.3}}
            style={{ width:'100%', display:'flex', flexDirection:'column', gap:10 }}>
            <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--light)' }}>
              ¿Qué decides?
            </p>
            <motion.button className="btn btn-gold" style={{ width:'100%', padding:'14px' }}
              whileHover={{scale:1.03}} whileTap={{scale:.97}}
              onClick={() => onChoice('draw')}>
              🤝 ACEPTAR EMPATE
            </motion.button>
            <motion.button className="btn btn-red" style={{ width:'100%', padding:'14px' }}
              whileHover={{scale:1.03}} whileTap={{scale:.97}}
              onClick={() => onChoice('sudden_death')}>
              💀 MUERTE SÚBITA — Siguiente pregunta gana
            </motion.button>
          </motion.div>
        ) : (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}
            className="card" style={{ padding:'16px 20px' }}>
            <motion.p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gray)' }}
              animate={{ opacity:[.5,1,.5] }} transition={{ duration:1.5, repeat:Infinity }}>
              ⌛ Esperando decisión del anfitrión…
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
