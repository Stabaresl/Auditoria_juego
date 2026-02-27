// ═══════════════════════════════════════════════════════════════
//  firebase.js  —  Configuración y helpers de sala en tiempo real
//
//  SETUP (una sola vez):
//  1. Ve a https://console.firebase.google.com
//  2. Crea un proyecto → Realtime Database → Crear base de datos
//  3. Reglas de seguridad (para desarrollo):
//       { "rules": { ".read": true, ".write": true } }
//  4. Copia tu configuración en las variables de entorno:
//       VITE_FIREBASE_API_KEY=...
//       VITE_FIREBASE_AUTH_DOMAIN=...
//       VITE_FIREBASE_DATABASE_URL=...
//       VITE_FIREBASE_PROJECT_ID=...
//       VITE_FIREBASE_APP_ID=...
//  5. En Vercel/Netlify agrega esas mismas env vars
// ═══════════════════════════════════════════════════════════════

import { initializeApp }          from 'firebase/app'
import {
  getDatabase, ref, set, get,
  update, onValue, off, remove,
  serverTimestamp,
}                                  from 'firebase/database'

// ── Configuración desde variables de entorno ──────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db  = getDatabase(app)

// ── Generador de código de sala (6 letras/números legibles) ───
export function generateRoomCode() {
  // Sin caracteres confusos: sin 0/O, 1/I, etc.
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

// ── Referencia a una sala ─────────────────────────────────────
const roomRef = (code) => ref(db, `rooms/${code}`)

// ─────────────────────────────────────────────────────────────
//  CREAR sala (host)
//  Devuelve el código generado
// ─────────────────────────────────────────────────────────────
export async function createRoom(hostName, chapterId) {
  const code = generateRoomCode()
  await set(roomRef(code), {
    code,
    chapterId,
    status:    'lobby',          // lobby | playing | finished
    hostId:    `p0`,
    createdAt: serverTimestamp(),
    players: {
      p0: { id: 'p0', name: hostName, colorIdx: 0, ready: false }
    },
    // El estado del juego se escribe aquí cuando empiece
    game: null,
  })
  return code
}

// ─────────────────────────────────────────────────────────────
//  UNIRSE a sala (guest)
//  Devuelve { ok, playerId, error }
// ─────────────────────────────────────────────────────────────
export async function joinRoom(code, playerName) {
  const snap = await get(roomRef(code))
  if (!snap.exists())      return { ok: false, error: 'Sala no encontrada.' }

  const room    = snap.val()
  if (room.status !== 'lobby')
    return { ok: false, error: 'La partida ya comenzó.' }

  const players = room.players ?? {}
  const count   = Object.keys(players).length
  if (count >= 6)
    return { ok: false, error: 'La sala está llena (máx. 6 jugadores).' }

  // Verificar nombre duplicado
  const nameTaken = Object.values(players).some(
    p => p.name.trim().toLowerCase() === playerName.trim().toLowerCase()
  )
  if (nameTaken) return { ok: false, error: 'Ese nombre ya está en uso.' }

  const playerId = `p${count}`
  await update(ref(db, `rooms/${code}/players/${playerId}`), {
    id: playerId, name: playerName, colorIdx: count, ready: false,
  })
  return { ok: true, playerId }
}

// ─────────────────────────────────────────────────────────────
//  SUSCRIBIRSE a cambios de sala (en tiempo real)
//  Devuelve función para desuscribirse
// ─────────────────────────────────────────────────────────────
export function subscribeRoom(code, callback) {
  const r = roomRef(code)
  onValue(r, snap => {
    callback(snap.exists() ? snap.val() : null)
  })
  return () => off(r)
}

// ─────────────────────────────────────────────────────────────
//  ESCRIBIR estado del juego (solo el host lo hace)
// ─────────────────────────────────────────────────────────────
export async function pushGameState(code, gameState) {
  // Convertimos Sets a arrays para que Firebase los acepte
  const serialized = {
    ...gameState,
    usedConceptIds: [...(gameState.usedConceptIds ?? [])],
  }
  await update(roomRef(code), { game: serialized, status: gameState.screen === 'home' ? 'lobby' : 'playing' })
}

// ─────────────────────────────────────────────────────────────
//  MARCAR JUGADOR LISTO (usado en lobby online)
// ─────────────────────────────────────────────────────────────
export async function setPlayerReady(code, playerId, ready = true) {
  await update(ref(db, `rooms/${code}/players/${playerId}`), { ready })
}

// ─────────────────────────────────────────────────────────────
//  ELIMINAR sala (cuando termina el juego)
// ─────────────────────────────────────────────────────────────
export async function deleteRoom(code) {
  await remove(roomRef(code))
}

// ─────────────────────────────────────────────────────────────
//  SALIR de sala (guest abandona)
// ─────────────────────────────────────────────────────────────
export async function leaveRoom(code, playerId) {
  await remove(ref(db, `rooms/${code}/players/${playerId}`))
}
