import { useState } from 'react'
import styles from './SecretScreen.module.css'

export default function SecretScreen({
  players, assignments, currentViewer,
  round, totalRounds, chapter, onDone
}) {
  const [revealed, setRevealed] = useState(false)

  const player = players.find(p => p.id === currentViewer)
  const concept = assignments[currentViewer]
  const viewerIdx = players.findIndex(p => p.id === currentViewer)
  const isLast = viewerIdx === players.length - 1
  const roundDef = chapter.rounds[round % chapter.rounds.length]

  const handleReveal = () => setRevealed(true)
  const handleNext = () => {
    setRevealed(false)
    onDone()
  }

  return (
    <div className={styles.root}>
      <div className={styles.bg}>
        <div className={styles.orb}
          style={{ background: `radial-gradient(circle, ${player?.color.light ?? 'rgba(240,224,64,0.08)'} 0%, transparent 70%)` }}
        />
      </div>

      <div className={styles.inner}>
        {/* Progreso */}
        <div className={styles.progress}>
          <span className={`tag tag-yellow`}>
            Ronda {round + 1} / {totalRounds}
          </span>
          <span className={styles.progressDots}>
            {players.map((p, i) => (
              <span key={p.id} className={`${styles.dot} ${i < viewerIdx ? styles.dotDone : ''} ${i === viewerIdx ? styles.dotActive : ''}`}
                style={i === viewerIdx ? { background: player?.color.bg } : {}} />
            ))}
          </span>
        </div>

        {/* Instrucción */}
        <div className={styles.instruction}>
          <div className={styles.handOff}>📱 Pasa el dispositivo a</div>
          <div className={styles.playerName}
            style={{ color: player?.color.bg }}>
            {player?.name}
          </div>
          <div className={styles.topic}>
            Tema: <strong>{roundDef.topic}</strong>
          </div>
        </div>

        {/* Tarjeta secreta */}
        {!revealed ? (
          <div className={styles.hiddenCard}>
            <div className={styles.hiddenIcon}>🔒</div>
            <div className={styles.hiddenTitle}>Tu concepto es secreto</div>
            <div className={styles.hiddenDesc}>
              Asegúrate de que nadie más vea la pantalla antes de revelar.
            </div>
            <button className={`btn btn-primary btn-lg ${styles.revealBtn}`}
              onClick={handleReveal}>
              Revelar mi concepto
            </button>
          </div>
        ) : (
          <div className={`${styles.conceptCard} ${concept?.fake ? styles.impostorCard : ''}`}
            style={{ borderColor: concept?.fake ? '#ff3d5a' : player?.color.bg }}>

            {concept?.fake && (
              <div className={styles.impostorBanner}>
                <span>⚠️</span>
                <span>ERES EL IMPOSTOR — este concepto es FALSO</span>
              </div>
            )}

            <div className={styles.conceptLabel}
              style={{ color: concept?.fake ? '#ff3d5a' : player?.color.bg }}>
              {concept?.fake ? '🎭 Tu rol: Impostor' : '✦ Tu concepto real'}
            </div>

            <div className={styles.conceptName}>{concept?.name}</div>
            <div className={styles.conceptDef}>{concept?.definition}</div>

            {concept?.fake && (
              <div className={styles.impostorTip}>
                <strong>Tu objetivo:</strong> Sobrevivir las 3 rondas sin que te descubran.
                Habla con seguridad, usa términos técnicos vagos y desvía sospechas.
              </div>
            )}
            {!concept?.fake && (
              <div className={styles.realTip}>
                <strong>Recuerda:</strong> Defiende tu concepto sin revelarlo completo.
                Detecta al jugador que parece no saber de qué habla.
              </div>
            )}

            <button className={`btn btn-primary ${styles.nextBtn}`}
              style={concept?.fake ? {} : { background: player?.color.bg }}
              onClick={handleNext}>
              {isLast ? '✓ Todos listos — Empezar debate' : `→ Pasar a ${players[viewerIdx + 1]?.name}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
