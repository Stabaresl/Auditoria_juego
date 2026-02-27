import { useState, useEffect, useRef, useCallback } from 'react'
import {
  createRoom, joinRoom, subscribeRoom,
  pushGameState, setPlayerReady, deleteRoom, leaveRoom,
} from './firebase'
import { CHAPTERS } from './gameData'

export const PLAYER_COLORS = [
  { bg: '#ff3d5a', light: 'rgba(255,61,90,0.15)'  },
  { bg: '#3dffc0', light: 'rgba(61,255,192,0.15)' },
  { bg: '#f0e040', light: 'rgba(240,224,64,0.15)' },
  { bg: '#7b5cff', light: 'rgba(123,92,255,0.15)' },
  { bg: '#ff8c42', light: 'rgba(255,140,66,0.15)' },
  { bg: '#40c4ff', light: 'rgba(64,196,255,0.15)' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildPools(chapter) {
  const allReals = [], allFakes = []
  chapter.rounds.forEach(round =>
    round.concepts.forEach(c => (c.fake ? allFakes : allReals).push(c))
  )
  return {
    availableReals: shuffle(allReals),
    availableFakes: shuffle(allFakes),
    usedConceptIds: [],
  }
}

function pickFromPool(pool, usedIds, n) {
  let available = pool.filter(c => !usedIds.includes(c.id))
  if (available.length < n) {
    available = shuffle(pool)
    available = pool.filter(c => !usedIds.includes(c.id))
  }
  const picked  = available.slice(0, n)
  const newPool = available.slice(n)
  const newUsed = [...usedIds, ...picked.map(c => c.id)]
  return { picked, newPool, newUsed }
}

function assignRound(players, impostorId, availableReals, availableFakes, usedConceptIds) {
  const { picked: [fakeConcept], newPool: newFakes, newUsed: u1 } =
    pickFromPool(availableFakes, usedConceptIds, 1)
  const { picked: realPicked, newPool: newReals, newUsed: finalUsed } =
    pickFromPool(availableReals, u1, players.length - 1)

  const assignments = {}
  let ri = 0
  players.forEach(p => {
    assignments[p.id] = p.id === impostorId ? fakeConcept : realPicked[ri++]
  })

  return {
    assignments,
    availableReals: newReals,
    availableFakes: newFakes,
    usedConceptIds: finalUsed,
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

  useEffect(() => { isHostRef.current   = isHost   }, [isHost])
  useEffect(() => { roomCodeRef.current = roomCode }, [roomCode])
  useEffect(() => () => { unsubRef.current?.() }, [])

  const subscribe = useCallback((code) => {
    unsubRef.current?.()
    unsubRef.current = subscribeRoom(code, data => setRoomData(data))
  }, [])

  // CREAR SALA
  const handleCreateRoom = useCallback(async (hostName, chapterId) => {
    setLoading(true); setError('')
    try {
      const code = await createRoom(hostName, chapterId)
      setRoomCode(code)
      setMyPlayerId('p0')
      setIsHost(true)
      setMode('online')
      subscribe(code)
    } catch (e) {
      setError('No se pudo crear la sala. Revisa tu conexion.')
    } finally {
      setLoading(false)
    }
  }, [subscribe])

  // UNIRSE A SALA
  const handleJoinRoom = useCallback(async (code, playerName) => {
    setLoading(true); setError('')
    try {
      const result = await joinRoom(code.toUpperCase(), playerName)
      if (!result.ok) { setError(result.error); setLoading(false); return false }
      setRoomCode(code.toUpperCase())
      setMyPlayerId(result.playerId)
      setIsHost(false)
      setMode('online')
      subscribe(code.toUpperCase())
      return true
    } catch (e) {
      setError('No se pudo unir a la sala. Revisa el codigo.')
      return false
    } finally {
      setLoading(false)
    }
  }, [subscribe])

  // INICIAR JUEGO (solo host)
  const handleStartOnlineGame = useCallback(async () => {
    if (!isHostRef.current || !roomData) return
    const players = Object.values(roomData.players ?? {})
      .map(p => ({ ...p, color: PLAYER_COLORS[p.colorIdx] }))
    const chapter = CHAPTERS.find(c => c.id === roomData.chapterId)
    if (!chapter || players.length < 2) return

    const { availableReals, availableFakes, usedConceptIds } = buildPools(chapter)
    const impostorId = players[Math.floor(Math.random() * players.length)].id
    const result = assignRound(players, impostorId, availableReals, availableFakes, usedConceptIds)

    await pushGameState(roomCodeRef.current, {
      screen:         'secret',
      chapter,
      players,
      impostorId,
      assignments:    result.assignments,
      availableReals: result.availableReals,
      availableFakes: result.availableFakes,
      usedConceptIds: result.usedConceptIds,
      round:          0,
      totalRounds:    3,
      votes:          {},
      history:        [],
      viewedBy:       [],
    })
  }, [roomData])

  // CONFIRMAR QUE VI MI TARJETA (cualquier jugador)
  // Cada jugador llama esto al pulsar continuar en SecretScreen.
  // Cuando todos han confirmado, el host avanza a 'discuss'.
  const handleViewerDone = useCallback(async (myId) => {
    if (!roomData?.game) return
    const g = roomData.game

    const viewedBy = Array.isArray(g.viewedBy) ? g.viewedBy : []
    if (viewedBy.includes(myId)) return

    const newViewedBy = [...viewedBy, myId]
    const allSeen = g.players.every(p => newViewedBy.includes(p.id))

    // Cualquier jugador puede escribir el avance cuando todos terminaron.
    // No se limita al host para evitar que se quede bloqueado si el ultimo
    // en confirmar no es el host.
    if (allSeen) {
      await pushGameState(roomCodeRef.current, {
        ...g, screen: 'discuss', viewedBy: [],
      })
    } else {
      await pushGameState(roomCodeRef.current, { ...g, viewedBy: newViewedBy })
    }
  }, [roomData])

  // IR A VOTACION (solo host)
  const handleGoVote = useCallback(async () => {
    if (!isHostRef.current || !roomData?.game) return
    await pushGameState(roomCodeRef.current, {
      ...roomData.game, screen: 'vote', votes: {},
    })
  }, [roomData])

  // PROCESAR VOTOS (solo host calcula resultado)
  const handleVoteSubmit = useCallback(async (votes) => {
    if (!isHostRef.current || !roomData?.game) return
    const g = roomData.game

    const tally = {}
    g.players.forEach(p => { tally[p.id] = 0 })
    Object.values(votes).forEach(id => { if (tally[id] !== undefined) tally[id]++ })

    const maxVotes  = Math.max(...Object.values(tally))
    const mostVoted = Object.entries(tally)
      .filter(([, v]) => v === maxVotes).map(([id]) => id)
    const impostorEliminated =
      mostVoted.length === 1 && mostVoted[0] === g.impostorId

    const newRound   = g.round + 1
    const newHistory = [
      ...(g.history ?? []),
      { round: g.round, tally, impostorEliminated, mostVoted },
    ]

    if (impostorEliminated) {
      await pushGameState(roomCodeRef.current, {
        ...g, screen: 'result', votes, history: newHistory, outcome: 'players_win',
      })
      return
    }
    if (newRound >= g.totalRounds) {
      await pushGameState(roomCodeRef.current, {
        ...g, screen: 'result', votes, history: newHistory, outcome: 'impostor_wins',
      })
      return
    }

    const result = assignRound(
      g.players, g.impostorId,
      g.availableReals, g.availableFakes, g.usedConceptIds,
    )
    await pushGameState(roomCodeRef.current, {
      ...g,
      screen:         'secret',
      round:          newRound,
      assignments:    result.assignments,
      availableReals: result.availableReals,
      availableFakes: result.availableFakes,
      usedConceptIds: result.usedConceptIds,
      votes:          {},
      history:        newHistory,
      viewedBy:       [],
    })
  }, [roomData])

  // VER GLOSARIO (solo host)
  const handleSeeGlossary = useCallback(async () => {
    if (!isHostRef.current || !roomData?.game) return
    await pushGameState(roomCodeRef.current, {
      ...roomData.game, screen: 'glossary',
    })
  }, [roomData])

  // REINICIAR O SALIR
  const handleRestart = useCallback(async () => {
    if (isHostRef.current) {
      await deleteRoom(roomCodeRef.current)
    } else {
      await leaveRoom(roomCodeRef.current, myPlayerId)
    }
    unsubRef.current?.()
    setMode('idle'); setRoomCode(''); setMyPlayerId(null)
    setIsHost(false); setRoomData(null); setError('')
  }, [myPlayerId])

  const game    = roomData?.game ?? null
  const players = roomData
    ? Object.values(roomData.players ?? {})
        .map(p => ({ ...p, color: PLAYER_COLORS[p.colorIdx] }))
    : []

  const viewedCount = Array.isArray(game?.viewedBy) ? game.viewedBy.length : 0
  const iHaveViewed = myPlayerId && Array.isArray(game?.viewedBy)
    ? game.viewedBy.includes(myPlayerId)
    : false

  return {
    mode, roomCode, myPlayerId, isHost,
    roomData, game, players, error, loading,
    viewedCount, iHaveViewed,
    handleCreateRoom,
    handleJoinRoom,
    handleStartOnlineGame,
    handleViewerDone,
    handleGoVote,
    handleVoteSubmit,
    handleSeeGlossary,
    handleRestart,
    setError,
    setPlayerReady: (ready) => setPlayerReady(roomCodeRef.current, myPlayerId, ready),
  }
}