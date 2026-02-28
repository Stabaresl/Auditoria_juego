import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedBg from '../AnimatedBg'
import s from './HomeScreen.module.css'

const STEPS = [
  { icon:'👥', label:'2 – 6 jugadores', desc:'Cada uno recibe un concepto distinto en secreto' },
  { icon:'🎭', label:'Un impostor oculto', desc:'Su concepto es inventado — nadie más lo sabe' },
  { icon:'🗣️', label:'3 rondas de debate', desc:'Defended vuestro concepto sin revelar el nombre' },
  { icon:'🗳️', label:'Votad al infiltrado', desc:'Si acertáis ganáis; si falla el impostor sobrevive' },
]

export default function HomeScreen({ chapters, onSelect, onOnline }) {
  return (
    <div className={s.root}>
      <AnimatedBg theme="home" />
      <div className={s.inner}>

        {/* Badge live */}
        <motion.div className={s.badge}
          initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}>
          <motion.span className={s.dot} animate={{ opacity:[1,.2,1] }} transition={{ duration:1.4, repeat:Infinity }}/>
          Juego académico interactivo
        </motion.div>

        {/* Título con glitch cada 3s */}
        <motion.div initial={{ opacity:0, y:36 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:.22, duration:.65, ease:[.16,1,.3,1] }}>
          <div className={s.titleLine1}>El Concepto</div>
          <div className={s.titleLine2}>
            <span className={`${s.accent} glitch`} data-g="Infiltrado">Infiltrado</span>
          </div>
        </motion.div>

        <motion.p className={s.sub}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.42 }}>
          Uno de los conceptos es <strong>falso</strong>. Solo el impostor lo sabe.
          Descúbrelo antes de que sobreviva las 3 rondas.
        </motion.p>

        {/* Steps */}
        <div className={s.steps}>
          {STEPS.map((st, i) => (
            <motion.div key={i} className={s.step}
              initial={{ opacity:0, x:-22 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:.5+i*.07, ease:[.16,1,.3,1] }}
              whileHover={{ x:5, transition:{ duration:.18 } }}>
              <span className={s.stepIcon}>{st.icon}</span>
              <div>
                <div className={s.stepLabel}>{st.label}</div>
                <div className={s.stepDesc}>{st.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divisor */}
        <motion.div className={s.divider} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.75 }}>
          <span className={s.divLine}/><span>Elige un capítulo</span><span className={s.divLine}/>
        </motion.div>

        {/* Capítulos */}
        <div className={s.cards}>
          {chapters.map((ch, i) => {
            const col = i===0 ? '#f0e040' : '#7b5cff'
            return (
              <motion.button key={ch.id} className={s.card}
                initial={{ opacity:0, y:26 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:.85+i*.1, ease:[.16,1,.3,1] }}
                whileHover={{ y:-5, transition:{ duration:.22 } }}
                whileTap={{ scale:.97 }}
                onClick={() => onSelect(ch)}>
                {/* Número grande decorativo */}
                <div className={s.cardBigNum} style={{ color:`${col}09` }}>{ch.num}</div>
                <div className={s.cardBody}>
                  <span className={s.cardTag} style={{ color:col, borderColor:`${col}44` }}>CAP. {ch.num}</span>
                  <div className={`${s.cardTitle} glitch`} data-g={ch.name}>{ch.name}</div>
                  <div className={s.cardDesc}>{ch.description}</div>
                  <div className={s.cardMeta}>
                    📚 {ch.rounds.length} rondas · {ch.rounds[0].concepts.length} conceptos/ronda
                  </div>
                </div>
                <motion.span className={s.cardArrow} style={{ color:col }}
                  animate={{ x:[0,6,0] }} transition={{ duration:1.8, repeat:Infinity }}>→</motion.span>
                <div className={s.cardSheen}
                  style={{ background:`linear-gradient(135deg,${col}08,transparent)` }}/>
              </motion.button>
            )
          })}

          {/* Online */}
          {onOnline && (
            <motion.button className={`${s.card} ${s.cardOnline}`}
              initial={{ opacity:0, y:26 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:.85+chapters.length*.1, ease:[.16,1,.3,1] }}
              whileHover={{ y:-5 }} whileTap={{ scale:.97 }}
              onClick={onOnline}>
              <div className={s.cardBigNum} style={{ color:'#3dffc008', fontSize:'3rem' }}>⬡</div>
              <div className={s.cardBody}>
                <span className={s.cardTag} style={{ color:'#3dffc0', borderColor:'#3dffc044' }}>ONLINE</span>
                <div className={`${s.cardTitle} glitch`} data-g="Multijugador">Multijugador</div>
                <div className={s.cardDesc}>Cada jugador en su propio dispositivo, en tiempo real</div>
                <div className={s.cardMeta}>📡 Tiempo real · hasta 6 jugadores</div>
              </div>
              <motion.span className={s.cardArrow} style={{ color:'#3dffc0' }}
                animate={{ x:[0,6,0] }} transition={{ duration:1.8, repeat:Infinity }}>→</motion.span>
              <div className={s.cardSheen} style={{ background:'linear-gradient(135deg,#3dffc00a,transparent)' }}/>
              <motion.div className={s.onlinePing}
                animate={{ scale:[1,2.8,1], opacity:[.5,0,.5] }}
                transition={{ duration:2.2, repeat:Infinity }}/>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
