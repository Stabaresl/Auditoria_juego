import styles from './HomeScreen.module.css'

export default function HomeScreen({ chapters, onSelect, onOnline }) {
  return (
    <div className={styles.root}>
      {/* Fondo decorativo */}
      <div className={styles.bg}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.badge}>
          <span className={styles.dot} />
          <span>Juego académico interactivo</span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.titleLine1}>El Concepto</span>
          <span className={styles.titleLine2}>
            <span className={styles.titleAccent}>Infiltrado</span>
            <svg className={styles.underline} viewBox="0 0 300 12" fill="none">
              <path d="M2 9 Q75 2 150 9 Q225 16 298 9" stroke="currentColor"
                strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </span>
        </h1>

        <p className={styles.subtitle}>
          Uno de los conceptos es falso. Solo el <strong>impostor</strong> lo sabe.
          Los demás deben descubrirlo antes de que se agoten las 3 rondas.
        </p>

        {/* Instrucciones rápidas */}
        <div className={styles.steps}>
          {[
            { icon: '👥', label: '2–6 jugadores',  desc: 'Cada uno recibe un concepto en secreto' },
            { icon: '🎭', label: 'Hay un impostor', desc: 'Su concepto es inventado — no lo sabe nadie más' },
            { icon: '🗣️', label: 'Debatid 3 rondas', desc: 'Defended vuestro concepto sin revelar nada' },
            { icon: '🗳️', label: 'Votad',           desc: '¿Quién es el infiltrado? Si acertáis, ganáis' },
          ].map((s, i) => (
            <div className={styles.step} key={i} style={{ animationDelay: `${i * 0.07}s` }}>
              <span className={styles.stepIcon}>{s.icon}</span>
              <div>
                <div className={styles.stepLabel}>{s.label}</div>
                <div className={styles.stepDesc}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Selector de modo ── */}
        <div className={styles.modeRow}>
          <div className={styles.modeCard} onClick={onOnline}>
            <div className={styles.modeIcon}>🌐</div>
            <div className={styles.modeInfo}>
              <div className={styles.modeTitle}>Modo online</div>
              <div className={styles.modeDesc}>Cada jugador en su propio dispositivo</div>
            </div>
            <div className={styles.modeArrow}>→</div>
          </div>
        </div>

        {/* Capítulos — modo local */}
        <div className={styles.chaptersTitle}>
          <span className={styles.line} />
          <span>Jugar local — elige capítulo</span>
          <span className={styles.line} />
        </div>

        <div className={styles.chapters}>
          {chapters.map((ch, i) => (
            <button key={ch.id} className={styles.chapterCard}
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              onClick={() => onSelect(ch)}>
              <div className={styles.chNum} style={{ color: i === 0 ? '#f0e040' : '#7b5cff' }}>
                CAP. {ch.num}
              </div>
              <div className={styles.chName}>{ch.name}</div>
              <div className={styles.chDesc}>{ch.description}</div>
              <div className={styles.chMeta}>
                {ch.rounds.length} rondas · {ch.rounds[0].concepts.length} conceptos por ronda
              </div>
              <div className={styles.chArrow}>→</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
