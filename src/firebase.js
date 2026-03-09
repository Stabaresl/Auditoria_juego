// firebase.js — Trivia Battle
import { initializeApp }          from 'firebase/app'
import {
  getDatabase, ref, set, get,
  update, onValue, off, remove,
  serverTimestamp,
} from 'firebase/database'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db  = getDatabase(app)

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

const roomRef = code => ref(db, `rooms/${code}`)

export async function createRoom(hostName, chapterId) {
  const code = generateRoomCode()
  await set(roomRef(code), {
    code, chapterId, status: 'lobby', hostId: 'p0',
    createdAt: serverTimestamp(),
    players: {
      p0: { id: 'p0', name: hostName, colorIdx: 0, team: 0, spriteId: 'knight', ready: false }
    },
    game: null,
  })
  return code
}

export async function joinRoom(code, playerName) {
  const snap = await get(roomRef(code))
  if (!snap.exists()) return { ok: false, error: 'Sala no encontrada.' }
  const room = snap.val()
  if (room.status !== 'lobby') return { ok: false, error: 'La partida ya comenzó.' }
  const players = room.players ?? {}
  const count = Object.keys(players).length
  if (count >= 6) return { ok: false, error: 'La sala está llena (máx. 6 jugadores).' }
  const nameTaken = Object.values(players).some(
    p => p.name.trim().toLowerCase() === playerName.trim().toLowerCase()
  )
  if (nameTaken) return { ok: false, error: 'Ese nombre ya está en uso.' }
  const playerId = `p${count}`
  const team = count % 2
  const sprites = ['knight','mage','rogue','ranger','paladin','warlock']
  await update(ref(db, `rooms/${code}/players/${playerId}`), {
    id: playerId, name: playerName, colorIdx: count,
    team, spriteId: sprites[count % sprites.length], ready: false,
  })
  return { ok: true, playerId }
}

export function subscribeRoom(code, callback) {
  const r = roomRef(code)
  onValue(r, snap => callback(snap.exists() ? snap.val() : null))
  return () => off(r)
}

export async function pushGameState(code, gameState) {
  await update(roomRef(code), {
    game: gameState,
    status: ['home','lobby'].includes(gameState?.screen) ? 'lobby' : 'playing'
  })
}

export async function setPlayerReady(code, playerId, ready = true) {
  await update(ref(db, `rooms/${code}/players/${playerId}`), { ready })
}

export async function deleteRoom(code) { await remove(roomRef(code)) }
export async function leaveRoom(code, playerId) {
  await remove(ref(db, `rooms/${code}/players/${playerId}`))
}
