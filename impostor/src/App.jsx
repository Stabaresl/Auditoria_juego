import { useState, useEffect } from 'react'
import HomeScreen         from './screens/HomeScreen'
import LobbyScreen        from './screens/LobbyScreen'
import SecretScreen       from './screens/SecretScreen'
import DiscussScreen      from './screens/DiscussScreen'
import VoteScreen         from './screens/VoteScreen'
import ResultScreen       from './screens/ResultScreen'
import GlossaryScreen     from './screens/GlossaryScreen'
import OnlineSetupScreen  from './screens/OnlineSetupScreen'
import OnlineLobbyScreen  from './screens/OnlineLobbyScreen'
import { CHAPTERS }       from './gameData'
import { useRoom, PLAYER_COLORS } from './useRoom'

// ─── Estado inicial del modo LOCAL (sin cambios) ──────────────
const INITIAL_LOCAL = {
  screen:         'home',
  chapter:        null,
  players:        [],
  assignments:    {},
  impostorId:     null,
  round:          0,
  votes:          {},
  history:        [],
  totalRounds:    3,
  availableReals: [],
  availableFakes: [],
  usedConceptIds: new Set(),
}

// ── Helpers de pool (modo local) ──────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function buildPools(chapter) {
  const allReals = [], allFakes = []
  chapter.rounds.forEach(r =>
    r.concepts.forEach(c => (c.fake ? allFakes : allReals).push(c))
  )
  return { availableReals: shuffle(allReals), availableFakes: shuffle(allFakes), usedConceptIds: new Set() }
}
function pickFromPool(pool, usedIds, n) {
  let available = pool.filter(c => !usedIds.has(c.id))
  if (available.length < n) {
    available = shuffle(pool)
    pool.forEach(c => usedIds.delete(c.id))
    available = pool.filter(c => !usedIds.has(c.id))
  }
  const picked  = available.slice(0, n)
  const newPool = available.slice(n)
  picked.forEach(c => usedIds.add(c.id))
  return { picked, newPool }
}
function assignRound(players, impostorId, availableReals, availableFakes, usedConceptIds) {
  const usedCopy = new Set(usedConceptIds)
  const { picked: [fakeConcept], newPool: newFakes } = pickFromPool(availableFakes, usedCopy, 1)
  const { picked: realPicked,   newPool: newReals  } = pickFromPool(availableReals, usedCopy, players.length - 1)
  const assignments = {}
  let ri = 0
  players.forEach(p => { assignments[p.id] = p.id === impostorId ? fakeConcept : realPicked[ri++] })
  return { assignments, availableReals: newReals, availableFakes: newFakes, usedConceptIds: usedCopy }
}

// ─────────────────────────────────────────────────────────────
export default function App() {
  // ── Modo: 'local' | 'online-setup' | 'online' ────────────
  const [appMode,       setAppMode]       = useState('local')
  const [local,         setLocal]         = useState(INITIAL_LOCAL)
  const [localViewer,   setLocalViewer]   = useState(null)

  // ── Hook online ───────────────────────────────────────────
  const room = useRoom()

  // ─── helpers locales ──────────────────────────────────────
  const goLocal = (screen, extra = {}) =>
    setLocal(g => ({ ...g, screen, ...extra }))

  // ══════════════════════════════════════════════════════════
  //  MODO LOCAL — igual que antes
  // ══════════════════════════════════════════════════════════
  const local_selectChapter = (chapter) =>
    goLocal('lobby', { chapter, players: [], assignments: {}, impostorId: null,
                       round: 0, votes: {}, history: [],
                       availableReals: [], availableFakes: [], usedConceptIds: new Set() })

  const local_startGame = (players) => {
    const { availableReals, availableFakes, usedConceptIds } = buildPools(local.chapter)
    const impostorId = players[Math.floor(Math.random() * players.length)].id
    const result = assignRound(players, impostorId, availableReals, availableFakes, usedConceptIds)
    setLocal(g => ({ ...g, screen: 'secret', players, impostorId, ...result, round: 0 }))
    setLocalViewer(players[0].id)
  }

  const local_viewerDone = () => {
    const idx = local.players.findIndex(p => p.id === localViewer)
    if (idx < local.players.length - 1) setLocalViewer(local.players[idx + 1].id)
    else goLocal('discuss')
  }

  const local_voteSubmit = (votes) => {
    const tally = {}
    local.players.forEach(p => { tally[p.id] = 0 })
    Object.values(votes).forEach(id => { if (tally[id] !== undefined) tally[id]++ })
    const maxVotes  = Math.max(...Object.values(tally))
    const mostVoted = Object.entries(tally).filter(([,v]) => v === maxVotes).map(([id]) => id)
    const impostorEliminated = mostVoted.length === 1 && mostVoted[0] === local.impostorId
    const newRound   = local.round + 1
    const newHistory = [...local.history, { round: local.round, tally, impostorEliminated, mostVoted }]

    if (impostorEliminated) {
      goLocal('result', { votes, history: newHistory, outcome: 'players_win' }); return
    }
    if (newRound >= local.totalRounds) {
      goLocal('result', { votes, history: newHistory, outcome: 'impostor_wins' }); return
    }
    const result = assignRound(local.players, local.impostorId, local.availableReals, local.availableFakes, local.usedConceptIds)
    setLocal(g => ({ ...g, screen: 'secret', round: newRound, ...result, votes: {}, history: newHistory }))
    setLocalViewer(local.players[0].id)
  }

  const local_restart = () => { setLocal(INITIAL_LOCAL); setLocalViewer(null) }

  // ── Sincronizar appMode cuando useRoom conecta/desconecta ─
  useEffect(() => {
    if (room.mode === 'online') setAppMode('online')
    if (room.mode === 'idle')   setAppMode('local')
  }, [room.mode])

  // ══════════════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════════════

  // ── HOME: elige modo ──────────────────────────────────────
  if (local.screen === 'home' && appMode === 'local') {
    return (
      <HomeScreen
        chapters={CHAPTERS}
        onSelect={local_selectChapter}
        onOnline={() => setAppMode('online-setup')}
      />
    )
  }

  // ── ONLINE SETUP: crear/unirse ────────────────────────────
  if (appMode === 'online-setup') {
    return (
      <OnlineSetupScreen
        onBack={() => setAppMode('local')}
        onCreateRoom={room.handleCreateRoom}
        onJoinRoom={room.handleJoinRoom}
        loading={room.loading}
        error={room.error}
      />
    )
  }

  // ── ONLINE: sala en tiempo real ───────────────────────────
  if (appMode === 'online') {

    const g = room.game // estado del juego desde Firebase

    // Lobby online (esperando jugadores)
    if (!g || g.screen === 'home') {
      const chapter = CHAPTERS.find(c => c.id === room.roomData?.chapterId)
      return (
        <OnlineLobbyScreen
          roomCode={room.roomCode}
          players={room.players}
          myPlayerId={room.myPlayerId}
          isHost={room.isHost}
          chapterName={chapter?.name ?? '—'}
          onStart={room.handleStartOnlineGame}
          onLeave={async () => { await room.handleRestart(); setAppMode('local') }}
          onReady={room.setPlayerReady}
          loading={room.loading}
        />
      )
    }

    // -- Pantallas del juego sincronizadas ----------------------
    // g.screen es la fuente de verdad (viene de Firebase).
    // En SecretScreen cada jugador ve su propia tarjeta y confirma
    // individualmente; cuando todos confirmaron el host avanza.

    if (g.screen === 'secret') {
      if (room.iHaveViewed) {
        const pending = g.players
          .filter(p => !(g.viewedBy ?? []).includes(p.id))
          .map(p => p.name)
        return <WaitingScreen pendingNames={pending} total={g.players.length} viewed={room.viewedCount} />
      }
      return (
        <SecretScreen
          players={g.players}
          assignments={g.assignments}
          currentViewer={room.myPlayerId}
          round={g.round}
          totalRounds={g.totalRounds}
          chapter={g.chapter}
          onDone={() => room.handleViewerDone(room.myPlayerId)}
        />
      )
    }
    if (g.screen === 'discuss') {
      return (
        <DiscussScreen
          players={g.players}
          round={g.round}
          totalRounds={g.totalRounds}
          chapter={g.chapter}
          onVote={room.isHost ? room.handleGoVote : undefined}
          isHost={room.isHost}
        />
      )
    }

    if (g.screen === 'vote') {
      return (
        <VoteScreen
          players={g.players}
          onSubmit={room.isHost ? room.handleVoteSubmit : undefined}
          isHost={room.isHost}
          myPlayerId={room.myPlayerId}
          onlineMode
        />
      )
    }

    if (g.screen === 'result') {
      return (
        <ResultScreen
          game={{ ...g }}
          onGlossary={room.isHost ? room.handleSeeGlossary : undefined}
          onRestart={async () => { await room.handleRestart(); setAppMode('local') }}
          isHost={room.isHost}
        />
      )
    }

    if (g.screen === 'glossary') {
      return (
        <GlossaryScreen
          chapter={g.chapter}
          onRestart={async () => { await room.handleRestart(); setAppMode('local') }}
        />
      )
    }
  }

  // ══════════════════════════════════════════════════════════
  //  MODO LOCAL — flujo original
  // ══════════════════════════════════════════════════════════
  const localScreens = {
    lobby:    <LobbyScreen    chapter={local.chapter} colors={PLAYER_COLORS}
                              onStart={local_startGame} onBack={() => goLocal('home')} />,
    secret:   <SecretScreen   players={local.players} assignments={local.assignments}
                              currentViewer={localViewer} round={local.round}
                              totalRounds={local.totalRounds} chapter={local.chapter}
                              onDone={local_viewerDone} />,
    discuss:  <DiscussScreen  players={local.players} round={local.round}
                              totalRounds={local.totalRounds} chapter={local.chapter}
                              onVote={() => goLocal('vote', { votes: {} })} />,
    vote:     <VoteScreen     players={local.players} onSubmit={local_voteSubmit} />,
    result:   <ResultScreen   game={local} onGlossary={() => goLocal('glossary')}
                              onRestart={local_restart} />,
    glossary: <GlossaryScreen chapter={local.chapter} onRestart={local_restart} />,
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {localScreens[local.screen] ?? localScreens.lobby}
    </div>
  )
}

// ── Pantalla de espera mientras otro jugador ve su tarjeta ────
function WaitingScreen({ pendingNames = [], total = 0, viewed = 0 }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1.4rem',
      background: '#080810', color: '#eeeef5', textAlign: 'center', padding: '2rem',
    }}>
      <div style={{ fontSize: '3rem' }}>✅</div>
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: '0.05em' }}>
        ¡Listo!
      </div>
      <div style={{
        background: 'rgba(61,255,192,0.06)', border: '1px solid rgba(61,255,192,0.2)',
        borderRadius: '12px', padding: '0.8rem 1.4rem',
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#3dffc0',
      }}>
        {viewed} / {total} jugadores han visto su tarjeta
      </div>
      {pendingNames.length > 0 && (
        <div style={{ color: '#9999b5', fontSize: '0.85rem', lineHeight: 1.7 }}>
          Esperando a:<br />
          {pendingNames.map(n => (
            <span key={n} style={{
              display: 'inline-block', margin: '0.2rem 0.3rem',
              background: 'rgba(255,255,255,0.06)', borderRadius: '6px',
              padding: '0.1rem 0.6rem', color: '#eeeef5', fontWeight: 600,
            }}>{n}</span>
          ))}
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  )
}