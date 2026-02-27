import styles from './GlossaryScreen.module.css'

export default function GlossaryScreen({ chapter, onRestart }) {
  return (
    <div className={styles.root}>
      <div className={styles.bg}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <span className="tag tag-purple">📚 Trasfondo académico</span>
          <h2 className={styles.title}>
            Lo que aprendimos
          </h2>
          <p className={styles.subtitle}>
            Todos los conceptos vistos en <strong>{chapter.name}</strong>, 
            explicados de forma sencilla con ejemplos reales.
          </p>
        </div>

        {/* Conceptos de las rondas */}
        {chapter.rounds.map((round, ri) => (
          <div key={round.id} className={styles.roundSection}>
            <div className={styles.roundHeader}>
              <div className={styles.roundNum}>Ronda {ri + 1}</div>
              <div className={styles.roundTopic}>{round.topic}</div>
            </div>

            <div className={styles.conceptsGrid}>
              {round.concepts.map(c => (
                <div key={c.id}
                  className={`${styles.conceptCard} ${c.fake ? styles.fakeCard : ''}`}>
                  {c.fake && (
                    <div className={styles.fakeBanner}>
                      🎭 Este era el concepto INFILTRADO
                    </div>
                  )}
                  <div className={styles.conceptName}>
                    {c.name}
                    {c.fake && <span className={styles.fakeBadge}>FALSO</span>}
                  </div>
                  <div className={styles.conceptDef}>{c.definition}</div>
                  {c.fake && (
                    <div className={styles.whyFake}>
                      <span>⚠️</span>
                      <span>Este concepto no existe en la literatura académica real.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Glosario profundo */}
        <div className={styles.glossarySection}>
          <div className={styles.glossaryHeader}>
            <div className={styles.glossaryLine} />
            <span>Glosario del capítulo</span>
            <div className={styles.glossaryLine} />
          </div>

          <div className={styles.glossaryGrid}>
            {chapter.glossary.map((item, i) => (
              <div key={i} className={styles.glossaryCard}
                style={{ animationDelay: `${i * 0.06}s` }}>
                <div className={styles.glossaryNum}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className={styles.glossaryTerm}>{item.term}</div>
                <div className={styles.glossaryDef}>{item.definition}</div>
                <div className={styles.glossaryExample}>
                  <div className={styles.exampleLabel}>💡 Ejemplo</div>
                  <div className={styles.exampleText}>{item.example}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.sourceNote}>
            <span className={styles.sourceIcon}>📖</span>
            <span>
              Basado en: Valencia, Marulanda & López (2016). <em>Gobierno y Gestión de Riesgos de TI</em>. 
              + Libro de Aseguramiento y Auditoría de TIC.
            </span>
          </div>
          <div className={styles.footerActions}>
            <button className="btn btn-primary btn-lg" onClick={onRestart}>
              ↺ Jugar otra partida
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
