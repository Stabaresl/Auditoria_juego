import { useState, useEffect, useRef } from 'react'
import styles from './DiscussScreen.module.css'

const DISCUSS_TIME = 120 // segundos

export default function DiscussScreen({ players, round, totalRounds, chapter, onVote }) {
  const [timeLeft, setTimeLeft] = useState(DISCUSS_TIME)
  const [started, setStarted]   = useState(false)
  const intervalRef = useRef(null)
  const roundDef = chapter.rounds[round % chapter.rounds.length]

  useEffect(() => {
    if (!started) return
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(intervalRef.current); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [started])

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')
  const pct  = (timeLeft / DISCUSS_TIME) * 100
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (pct / 100) * circumference

  const urgent = timeLeft <= 30

  return (
    <div className={styles.root}>
      <div className={styles.bg}>
        <div className={styles.orb} style={urgent ? { background: 'radial-gradient(circle, rgba(255,61,90,0.08) 0%, transparent 70%)' } : {}} />
      </div>

      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <span className="tag tag-yellow">Ronda {round + 1} / {totalRounds}</span>
          <span className="tag tag-purple">{roundDef.topic}</span>
        </div>

        <h2 className={styles.title}>Tiempo de debate</h2>
        <p className={styles.subtitle}>
          Cada jugador defiende su concepto. Sin revelar el nombre exacto. 
          Observa quién parece inseguro o usa términos inventados.
        </p>

        {/* Timer */}
        <div className={styles.timerWrap}>
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="54" fill="none"
              stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
            <circle cx="64" cy="64" r="54" fill="none"
              stroke={urgent ? '#ff3d5a' : '#f0e040'} strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 64 64)"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          </svg>
          <div className={styles.timerInner}>
            <div className={styles.timerTime}
              style={{ color: urgent ? '#ff3d5a' : '#f0e040' }}>
              {mins}:{secs}
            </div>
            <div className={styles.timerLabel}>
              {!started ? 'listo' : urgent ? '¡apura!' : 'debate'}
            </div>
          </div>
        </div>

        {/* Jugadores */}
        <div className={styles.playerChips}>
          {players.map(p => (
            <div key={p.id} className={styles.chip}>
              <div className={styles.chipDot} style={{ background: p.color.bg }} />
              <span>{p.name}</span>
            </div>
          ))}
        </div>

        {/* Pistas */}
        <div className={styles.tips}>
          <div className={styles.tipTitle}>💡 Pistas para detectar al impostor</div>
          <ul className={styles.tipList}>
            <li>Usa términos vagos o demasiado generales</li>
            <li>No puede dar un ejemplo concreto</li>
            <li>Cambia el tema cuando le preguntan directamente</li>
            <li>Se contradice entre rondas</li>
          </ul>
        </div>

        {/* Botones */}
        <div className={styles.actions}>
          {!started ? (
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }}
              onClick={() => setStarted(true)}>
              ▶ Iniciar debate ({mins}:{secs})
            </button>
          ) : (
            <button className="btn btn-danger btn-lg" style={{ width: '100%' }}
              onClick={() => { clearInterval(intervalRef.current); onVote() }}>
              🗳️ {timeLeft === 0 ? 'Se acabó el tiempo — ' : ''}Pasar a votación
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
