import styles from './ResultScreen.module.css'

export default function ResultScreen({ game, onGlossary, onRestart }) {
  const { players, assignments, impostorId, outcome, history } = game
  const impostor = players.find(p => p.id === impostorId)
  const impostorConcepts = history.map((h, i) => {
    const roundDef = game.chapter.rounds[i % game.chapter.rounds.length]
    return roundDef.concepts.find(c => c.fake)
  })

  const isImpostorWin = outcome === 'impostor_wins'

  return (
    <div className={styles.root}>
      <div className={styles.bg}>
        <div className={styles.orb}
          style={{ background: isImpostorWin
            ? 'radial-gradient(circle, rgba(255,61,90,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(61,255,192,0.1) 0%, transparent 70%)' }}
        />
      </div>

      <div className={styles.inner}>
        {/* Resultado principal */}
        <div className={styles.outcomeCard}
          style={{ borderColor: isImpostorWin ? '#ff3d5a' : '#3dffc0' }}>
          <div className={styles.outcomeEmoji}>
            {isImpostorWin ? '🎭' : '🕵️'}
          </div>
          <div className={styles.outcomeTitle}
            style={{ color: isImpostorWin ? '#ff3d5a' : '#3dffc0' }}>
            {isImpostorWin ? '¡El impostor sobrevivió!' : '¡El impostor fue descubierto!'}
          </div>
          <div className={styles.outcomeDesc}>
            {isImpostorWin
              ? `${impostor?.name} logró engañar al grupo durante las 3 rondas. 🎉`
              : `El grupo detectó a ${impostor?.name} como el infiltrado. ¡Bien jugado! 🎉`
            }
          </div>
        </div>

        {/* Quién era el impostor */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>El impostor era</div>
          <div className={styles.impostorReveal}
            style={{ borderColor: impostor?.color.bg }}>
            <div className={styles.impostorAv}
              style={{ background: impostor?.color.bg }}>
              {impostor?.name[0].toUpperCase()}
            </div>
            <div className={styles.impostorName}
              style={{ color: impostor?.color.bg }}>
              {impostor?.name}
            </div>
            <span className="tag tag-red">Impostor</span>
          </div>
        </div>

        {/* Todos los conceptos de la partida */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Conceptos de esta partida</div>
          <div className={styles.conceptsList}>
            {players.map(p => {
              // Mostramos el concepto de la última ronda jugada
              const lastRoundIdx = (history.length - 1) % game.chapter.rounds.length
              const roundDef = game.chapter.rounds[lastRoundIdx]
              const fakeConcept = roundDef.concepts.find(c => c.fake)
              const assignment = p.id === impostorId
                ? fakeConcept
                : assignments[p.id]

              return (
                <div key={p.id}
                  className={`${styles.conceptItem} ${p.id === impostorId ? styles.conceptFake : ''}`}
                  style={{ borderLeftColor: p.color.bg }}>
                  <div className={styles.conceptItemHeader}>
                    <div className={styles.playerChip}
                      style={{ background: p.color.light, color: p.color.bg }}>
                      {p.name}
                    </div>
                    {p.id === impostorId && <span className="tag tag-red">FALSO</span>}
                  </div>
                  <div className={styles.conceptItemName}>{assignment?.name}</div>
                  <div className={styles.conceptItemDef}>{assignment?.definition}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Historial de rondas */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Historial de votaciones</div>
          <div className={styles.roundHistory}>
            {history.map((h, i) => (
              <div key={i} className={styles.roundItem}>
                <div className={styles.roundNum}>Ronda {i + 1}</div>
                <div className={styles.roundResult}>
                  {h.impostorEliminated
                    ? <span style={{ color: '#3dffc0' }}>✓ Impostor eliminado</span>
                    : <span style={{ color: '#ff3d5a' }}>✗ Impostor sobrevivió</span>
                  }
                </div>
                <div className={styles.roundTally}>
                  {Object.entries(h.tally).map(([id, v]) => {
                    const p = players.find(x => x.id === id)
                    return v > 0 ? (
                      <span key={id} className={styles.tallyItem}
                        style={{ color: p?.color.bg }}>
                        {p?.name}: {v}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className={styles.actions}>
          <button className="btn btn-primary btn-lg" style={{ flex: 1 }}
            onClick={onGlossary}>
            📚 Ver glosario del capítulo
          </button>
          <button className="btn btn-ghost" style={{ flex: 1 }}
            onClick={onRestart}>
            ↺ Jugar de nuevo
          </button>
        </div>
      </div>
    </div>
  )
}
