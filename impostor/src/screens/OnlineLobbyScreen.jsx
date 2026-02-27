// OnlineLobbyScreen.jsx
// Sala de espera online: muestra código, lista de jugadores en tiempo real
import { useState } from 'react'
import styles from './OnlineLobbyScreen.module.css'

export default function OnlineLobbyScreen({
  roomCode, players, myPlayerId, isHost,
  chapterName, onStart, onLeave, onReady, loading,
}) {
  const [copied, setCopied] = useState(false)
  const myPlayer    = players.find(p => p.id === myPlayerId)
  const canStart    = isHost && players.length >= 2
  const allReady    = players.filter(p => p.id !== myPlayerId).every(p => p.ready)
  const iAmReady    = myPlayer?.ready

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={styles.root}>
      <div className={styles.bg}><div className={styles.orb} /></div>

      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <span className="tag tag-purple">🌐 Sala en línea</span>
          <h2 className={styles.title}>Sala de espera</h2>
          <p className={styles.subtitle}>
            Comparte el código con los demás jugadores. <br />
            Capítulo: <strong>{chapterName}</strong>
          </p>
        </div>

        {/* Código grande */}
        <div className={styles.codeCard}>
          <div className={styles.codeLabel}>Código de sala</div>
          <div className={styles.codeDisplay}>
            {roomCode.split('').map((ch, i) => (
              <span key={i} className={styles.codeLetter}>{ch}</span>
            ))}
          </div>
          <button className={`btn btn-ghost btn-sm ${styles.copyBtn}`} onClick={copyCode}>
            {copied ? '✓ Copiado' : '📋 Copiar código'}
          </button>
        </div>

        {/* Jugadores */}
        <div className={styles.playersSection}>
          <div className={styles.sectionLabel}>
            Jugadores ({players.length}/6)
            <span className={styles.waiting}>
              {players.length < 2 ? '— esperando más jugadores...' : ''}
            </span>
          </div>

          <div className={styles.playerList}>
            {players.map(p => (
              <div key={p.id}
                className={`${styles.playerRow} ${p.id === myPlayerId ? styles.myRow : ''}`}>
                <div className={styles.avatar}
                  style={{ background: p.color?.bg ?? '#7b5cff' }}>
                  {p.name[0].toUpperCase()}
                </div>
                <span className={styles.playerName}>{p.name}</span>
                <div className={styles.badges}>
                  {p.id === myPlayerId && (
                    <span className="tag tag-yellow">Tú</span>
                  )}
                  {p.id === players[0]?.id && (
                    <span className="tag tag-purple">👑 Anfitrión</span>
                  )}
                  {p.ready && p.id !== myPlayerId && (
                    <span className="tag tag-green">✓ Listo</span>
                  )}
                </div>
              </div>
            ))}

            {/* Slots vacíos */}
            {Array.from({ length: 6 - players.length }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.emptyRow}>
                <div className={styles.emptyAvatar}>?</div>
                <span className={styles.emptyName}>Esperando jugador...</span>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className={styles.actions}>
          {isHost ? (
            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={!canStart || loading}
              onClick={onStart}>
              {loading
                ? '⏳ Iniciando...'
                : players.length < 2
                  ? `Esperando jugadores (${players.length}/2 mín.)`
                  : `▶ Iniciar juego con ${players.length} jugadores`
              }
            </button>
          ) : (
            <button
              className={`btn btn-lg ${iAmReady ? 'btn-ghost' : 'btn-primary'}`}
              style={{ width: '100%' }}
              onClick={() => onReady(!iAmReady)}>
              {iAmReady ? '↩ No estoy listo' : '✓ Estoy listo'}
            </button>
          )}

          <button className="btn btn-ghost" style={{ width: '100%' }} onClick={onLeave}>
            ✕ {isHost ? 'Cerrar sala' : 'Salir de la sala'}
          </button>
        </div>

        {/* Hint anfitrión */}
        {isHost && players.length >= 2 && (
          <div className={styles.hostHint}>
            Cuando todos estén conectados, pulsa <strong>Iniciar juego</strong>. <br />
            Solo el anfitrión controla el flujo de la partida.
          </div>
        )}
      </div>
    </div>
  )
}
