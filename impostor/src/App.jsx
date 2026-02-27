import { useState } from 'react'
import HomeScreen    from './screens/HomeScreen'
import LobbyScreen   from './screens/LobbyScreen'
import SecretScreen  from './screens/SecretScreen'
import DiscussScreen from './screens/DiscussScreen'
import VoteScreen    from './screens/VoteScreen'
import ResultScreen  from './screens/ResultScreen'
import GlossaryScreen from './screens/GlossaryScreen'
import { CHAPTERS }  from './gameData'

// ─── Estado inicial ───────────────────────────────────────
const INITIAL_STATE = {
  screen: 'home',        // home | lobby | secret | discuss | vote | result | glossary
  chapter: null,
  players: [],           // [{ id, name, color }]
  assignments: {},       // { playerId: conceptObj }
  impostorId: null,
  round: 0,             // 0-based
  votes: {},            // { voterId: targetId }
  history: [],          // resultados de cada ronda
  totalRounds: 3,
}

const PLAYER_COLORS = [
  { bg: '#ff3d5a', light: 'rgba(255,61,90,0.15)'   },
  { bg: '#3dffc0', light: 'rgba(61,255,192,0.15)'  },
  { bg: '#f0e040', light: 'rgba(240,224,64,0.15)'  },
  { bg: '#7b5cff', light: 'rgba(123,92,255,0.15)'  },
  { bg: '#ff8c42', light: 'rgba(255,140,66,0.15)'  },
  { bg: '#40c4ff', light: 'rgba(64,196,255,0.15)'  },
]

export default function App() {
  const [game, setGame] = useState(INITIAL_STATE)
  // quién está viendo la pantalla en este momento (para el flujo "pasa el dispositivo")
  const [currentViewer, setCurrentViewer] = useState(null)

  // ── helpers ──────────────────────────────────────────────
  const go = (screen, extra = {}) =>
    setGame(g => ({ ...g, screen, ...extra }))

  // ── INICIO: elige capítulo ────────────────────────────────
  const handleSelectChapter = (chapter) => {
    go('lobby', { chapter, players: [], assignments: {}, impostorId: null,
                  round: 0, votes: {}, history: [] })
  }

  // ── LOBBY: configura jugadores ────────────────────────────
  const handleStartGame = (players) => {
    const chapter  = game.chapter
    const round    = game.round
    const roundDef = chapter.rounds[round % chapter.rounds.length]
    const concepts = roundDef.concepts

    // Seleccionar conceptos: 1 falso + (N-1) reales distintos
    const fakeConcept  = concepts.find(c => c.fake)
    const realConcepts = concepts.filter(c => !c.fake)

    // Barajar reales y tomar N-1
    const shuffledReals = [...realConcepts].sort(() => Math.random() - 0.5)
    const selected = shuffledReals.slice(0, players.length - 1)

    // Elegir impostor al azar
    const impostorIdx = Math.floor(Math.random() * players.length)
    const impostorId  = players[impostorIdx].id

    // Asignar conceptos
    const assignments = {}
    let realIdx = 0
    players.forEach(p => {
      if (p.id === impostorId) {
        assignments[p.id] = fakeConcept
      } else {
        assignments[p.id] = selected[realIdx++]
      }
    })

    setGame(g => ({ ...g, screen: 'secret', players, assignments, impostorId }))
    setCurrentViewer(players[0].id) // empieza el primer jugador
  }

  // ── SECRET: jugador vio su tarjeta, siguiente ─────────────
  const handleViewerDone = () => {
    const idx = game.players.findIndex(p => p.id === currentViewer)
    if (idx < game.players.length - 1) {
      setCurrentViewer(game.players[idx + 1].id)
    } else {
      // Todos vieron → ir a discusión
      go('discuss')
    }
  }

  // ── DISCUSS: tiempo de debate → votar ────────────────────
  const handleGoVote = () => go('vote', { votes: {} })

  // ── VOTE: registrar votos ─────────────────────────────────
  const handleVoteSubmit = (votes) => {
    // Contar votos
    const tally = {}
    game.players.forEach(p => { tally[p.id] = 0 })
    Object.values(votes).forEach(targetId => {
      if (tally[targetId] !== undefined) tally[targetId]++
    })

    // Jugador más votado
    const maxVotes = Math.max(...Object.values(tally))
    const mostVoted = Object.entries(tally)
      .filter(([, v]) => v === maxVotes)
      .map(([id]) => id)

    // Empate o no se votó al impostor
    const impostorEliminated =
      mostVoted.length === 1 && mostVoted[0] === game.impostorId

    const newRound = game.round + 1
    const roundResult = {
      round: game.round,
      tally,
      impostorEliminated,
      mostVoted,
    }
    const newHistory = [...game.history, roundResult]

    if (impostorEliminated) {
      // ¡Ganaron los jugadores!
      setGame(g => ({
        ...g, screen: 'result', votes,
        history: newHistory,
        outcome: 'players_win',
      }))
    } else if (newRound >= game.totalRounds) {
      // Sobrevivió 3 rondas → gana el impostor
      setGame(g => ({
        ...g, screen: 'result', votes,
        history: newHistory,
        outcome: 'impostor_wins',
      }))
    } else {
      // Siguiente ronda
      const chapter   = game.chapter
      const roundDef  = chapter.rounds[newRound % chapter.rounds.length]
      const concepts  = roundDef.concepts
      const fakeConcept  = concepts.find(c => c.fake)
      const realConcepts = concepts.filter(c => !c.fake)
      const shuffledReals = [...realConcepts].sort(() => Math.random() - 0.5)
      const selected = shuffledReals.slice(0, game.players.length - 1)

      // El impostor es el mismo pero ahora tiene nuevo concepto falso
      const assignments = {}
      let realIdx = 0
      game.players.forEach(p => {
        if (p.id === game.impostorId) {
          assignments[p.id] = fakeConcept
        } else {
          assignments[p.id] = selected[realIdx++]
        }
      })

      setGame(g => ({
        ...g, screen: 'secret',
        round: newRound,
        assignments,
        votes: {},
        history: newHistory,
      }))
      setCurrentViewer(game.players[0].id)
    }
  }

  // ── RESULT → GLOSSARY ────────────────────────────────────
  const handleSeeGlossary = () => go('glossary')

  // ── VOLVER AL INICIO ──────────────────────────────────────
  const handleRestart = () => {
    setGame(INITIAL_STATE)
    setCurrentViewer(null)
  }

  // ── RENDER ───────────────────────────────────────────────
  const screens = {
    home:     <HomeScreen     chapters={CHAPTERS} onSelect={handleSelectChapter} />,
    lobby:    <LobbyScreen    chapter={game.chapter} colors={PLAYER_COLORS}
                              onStart={handleStartGame} onBack={() => go('home')} />,
    secret:   <SecretScreen   players={game.players}  assignments={game.assignments}
                              currentViewer={currentViewer} round={game.round}
                              totalRounds={game.totalRounds} chapter={game.chapter}
                              onDone={handleViewerDone} />,
    discuss:  <DiscussScreen  players={game.players}  round={game.round}
                              totalRounds={game.totalRounds} chapter={game.chapter}
                              onVote={handleGoVote} />,
    vote:     <VoteScreen     players={game.players}  onSubmit={handleVoteSubmit} />,
    result:   <ResultScreen   game={game} onGlossary={handleSeeGlossary}
                              onRestart={handleRestart} />,
    glossary: <GlossaryScreen chapter={game.chapter}  onRestart={handleRestart} />,
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {screens[game.screen] ?? screens.home}
    </div>
  )
}