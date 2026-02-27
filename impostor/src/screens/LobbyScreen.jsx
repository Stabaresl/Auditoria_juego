import { useState } from 'react'
import styles from './LobbyScreen.module.css'

export default function LobbyScreen({ chapter, colors, onStart, onBack }) {
  const [names, setNames]   = useState(['', ''])
  const [error, setError]   = useState('')

  const addPlayer = () => {
    if (names.length < 6) setNames(n => [...n, ''])
  }
  const removePlayer = (i) => {
    if (names.length > 2) setNames(n => n.filter((_, idx) => idx !== i))
  }
  const updateName = (i, val) => {
    setNames(n => n.map((name, idx) => idx === i ? val : name))
  }

  const handleStart = () => {
    const trimmed = names.map(n => n.trim())
    if (trimmed.some(n => !n)) {
      setError('Todos los jugadores deben tener un nombre.')
      return
    }
    const unique = new Set(trimmed)
    if (unique.size !== trimmed.length) {
      setError('Los nombres deben ser únicos.')
      return
    }
    setError('')
    const players = trimmed.map((name, i) => ({
      id: `p${i}`,
      name,
      color: colors[i],
    }))
    onStart(players)
  }

  return (
    <div className={styles.root}>
      <div className={styles.bg}>
        <div className={styles.orb} />
      </div>

      <div className={styles.inner}>
        <button className={`btn btn-ghost btn-sm ${styles.back}`} onClick={onBack}>
          ← Volver
        </button>

        <div className={styles.header}>
          <div className={`tag tag-yellow ${styles.tag}`}>
            <span>●</span> {chapter.num} — {chapter.name}
          </div>
          <h2 className={styles.title}>Sala de espera</h2>
          <p className={styles.subtitle}>
            Añade entre 2 y 6 jugadores. El impostor será asignado automáticamente.
          </p>
        </div>

        {/* Lista de jugadores */}
        <div className={styles.playerList}>
          {names.map((name, i) => (
            <div className={styles.playerRow} key={i}
              style={{ animationDelay: `${i * 0.06}s` }}>
              <div className={styles.playerAvatar}
                style={{ background: colors[i].bg }}>
                {name ? name[0].toUpperCase() : (i + 1)}
              </div>
              <input
                className={styles.playerInput}
                placeholder={`Jugador ${i + 1}`}
                value={name}
                maxLength={18}
                onChange={e => updateName(i, e.target.value)}
                onKeyDown={e => e.key === 'Enter' && i < 5 && addPlayer()}
              />
              {names.length > 2 && (
                <button className={styles.removeBtn} onClick={() => removePlayer(i)}
                  title="Eliminar">
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Añadir jugador */}
        {names.length < 6 && (
          <button className={`btn btn-ghost ${styles.addBtn}`} onClick={addPlayer}>
            + Añadir jugador ({names.length}/6)
          </button>
        )}

        {error && <div className={styles.error}>{error}</div>}

        {/* Info del capítulo */}
        <div className={styles.chapterInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Rondas</span>
            <span className={styles.infoValue}>3</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Tema inicial</span>
            <span className={styles.infoValue}>{chapter.rounds[0].topic}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>El impostor</span>
            <span className={styles.infoValue}>1 jugador aleatorio</span>
          </div>
        </div>

        <button className={`btn btn-primary btn-lg ${styles.startBtn}`}
          onClick={handleStart}
          disabled={names.some(n => !n.trim())}>
          Comenzar juego →
        </button>
      </div>
    </div>
  )
}
