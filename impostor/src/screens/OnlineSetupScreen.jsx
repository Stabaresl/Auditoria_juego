// OnlineSetupScreen.jsx
// Pantalla inicial online: crear sala O unirse con código
import { useState } from 'react'
import styles from './OnlineSetupScreen.module.css'
import { CHAPTERS } from '../gameData'

export default function OnlineSetupScreen({ onBack, onCreateRoom, onJoinRoom, loading, error }) {
  const [tab,         setTab]         = useState('join')   // 'create' | 'join'
  const [playerName,  setPlayerName]  = useState('')
  const [roomCode,    setRoomCode]    = useState('')
  const [chapterId,   setChapterId]   = useState(CHAPTERS[0].id)

  const canCreate = playerName.trim().length >= 2 && chapterId
  const canJoin   = playerName.trim().length >= 2 && roomCode.trim().length === 6

  return (
    <div className={styles.root}>
      <div className={styles.bg}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.inner}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ alignSelf: 'flex-start' }}>
          ← Volver
        </button>

        <div className={styles.header}>
          <span className="tag tag-purple">🌐 Modo online</span>
          <h2 className={styles.title}>Juego en red</h2>
          <p className={styles.subtitle}>
            Cada jugador entra desde su propio dispositivo.
            El anfitrión crea la sala y comparte el código.
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'join' ? styles.tabActive : ''}`}
            onClick={() => setTab('join')}>
            🔗 Unirme a sala
          </button>
          <button
            className={`${styles.tab} ${tab === 'create' ? styles.tabActive : ''}`}
            onClick={() => setTab('create')}>
            ✦ Crear sala
          </button>
        </div>

        {/* Campo nombre (siempre visible) */}
        <div className={styles.field}>
          <label className={styles.label}>Tu nombre en el juego</label>
          <input
            className={styles.input}
            placeholder="Escribe tu nombre..."
            value={playerName}
            maxLength={18}
            onChange={e => setPlayerName(e.target.value)}
          />
        </div>

        {/* ── TAB: UNIRSE ── */}
        {tab === 'join' && (
          <div className={styles.section}>
            <div className={styles.field}>
              <label className={styles.label}>Código de sala</label>
              <input
                className={`${styles.input} ${styles.codeInput}`}
                placeholder="XXXXXX"
                value={roomCode}
                maxLength={6}
                onChange={e => setRoomCode(e.target.value.toUpperCase())}
              />
              <span className={styles.hint}>6 caracteres, sin espacios</span>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={!canJoin || loading}
              onClick={() => onJoinRoom(roomCode, playerName.trim())}>
              {loading ? '⏳ Conectando...' : '→ Unirme a la partida'}
            </button>
          </div>
        )}

        {/* ── TAB: CREAR ── */}
        {tab === 'create' && (
          <div className={styles.section}>
            <div className={styles.field}>
              <label className={styles.label}>Capítulo a jugar</label>
              <div className={styles.chapterList}>
                {CHAPTERS.map((ch, i) => (
                  <button
                    key={ch.id}
                    className={`${styles.chapterBtn} ${chapterId === ch.id ? styles.chapterBtnActive : ''}`}
                    onClick={() => setChapterId(ch.id)}>
                    <span className={styles.chBtnNum}
                      style={{ color: i === 0 ? '#f0e040' : '#7b5cff' }}>
                      CAP. {ch.num}
                    </span>
                    <span className={styles.chBtnName}>{ch.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={!canCreate || loading}
              onClick={() => onCreateRoom(playerName.trim(), chapterId)}>
              {loading ? '⏳ Creando sala...' : '✦ Crear sala'}
            </button>
          </div>
        )}

        {/* Info */}
        <div className={styles.infoBox}>
          <div className={styles.infoRow}>
            <span>👥</span><span>2 – 6 jugadores por sala</span>
          </div>
          <div className={styles.infoRow}>
            <span>📱</span><span>Cada jugador usa su propio dispositivo</span>
          </div>
          <div className={styles.infoRow}>
            <span>🔒</span><span>La sala se borra al terminar la partida</span>
          </div>
        </div>
      </div>
    </div>
  )
}
