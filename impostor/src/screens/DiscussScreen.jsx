import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBg from '../AnimatedBg'
import { sfx } from '../sounds'
import s from './DiscussScreen.module.css'

const T = 120

export default function DiscussScreen({ players,round,totalRounds,chapter,onVote,onStart,isHost=true,debateStarted:dbProp }) {
  const isOnline = dbProp !== undefined
  const [localOn, setLocalOn] = useState(false)
  const started = isOnline ? dbProp : localOn
  const [t, setT] = useState(T)
  const ref = useRef()
  const rd = chapter.rounds[round % chapter.rounds.length]
  const urgent   = t <= 30 && started
  const critical = t <= 10 && started

  useEffect(() => {
    if (!started) { clearInterval(ref.current); setT(T); return }
    ref.current = setInterval(() => {
      setT(v => {
        if (v <= 1) { clearInterval(ref.current); return 0 }
        if (v <= 10) sfx.tick()
        return v - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [started])

  const mins = String(Math.floor(t/60)).padStart(2,'0')
  const secs = String(t%60).padStart(2,'0')
  const circ = 2*Math.PI*58
  const offset = circ - (t/T)*circ
  const timerCol = critical?'#ff3d5a':urgent?'#ff8c42':'#f0e040'

  const doStart = () => {
    sfx.debateStart()
    isOnline ? onStart?.() : setLocalOn(true)
  }

  return (
    <div className={s.root}>
      <AnimatedBg theme="discuss"/>
      <div className={s.inner}>

        <motion.div className={s.tags} initial={{ opacity:0,y:-14 }} animate={{ opacity:1,y:0 }}>
          <span className="tag tag-yellow">Ronda {round+1}/{totalRounds}</span>
          <span className="tag tag-purple">{rd.topic}</span>
          {isOnline&&!isHost&&<span className="tag tag-purple">👁 Solo lectura</span>}
        </motion.div>

        <motion.h2 className={`${s.title} glitch`} data-g="Tiempo de debate"
          initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:.1 }}>
          Tiempo de debate
        </motion.h2>

        <motion.p className={s.sub}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.18 }}>
          Defended vuestros conceptos sin revelar el nombre exacto.<br/>
          Observad quién parece inseguro o usa términos inventados.
        </motion.p>

        {/* Timer */}
        <motion.div className={s.timerWrap}
          initial={{ scale:.8,opacity:0 }} animate={{ scale:1,opacity:1 }}
          transition={{ delay:.14,type:'spring',stiffness:200 }}>
          <svg width={140} height={140} viewBox="0 0 140 140">
            <circle cx={70} cy={70} r={58} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth={6}/>
            <circle cx={70} cy={70} r={58} fill="none"
              stroke={timerCol} strokeWidth={6} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset}
              transform="rotate(-90 70 70)"
              style={{ transition:'stroke-dashoffset 1s linear,stroke .5s' }}/>
            {started && (
              <motion.circle
                cx={70+58*Math.cos(((-90+(1-t/T)*360)*Math.PI)/180)}
                cy={70+58*Math.sin(((-90+(1-t/T)*360)*Math.PI)/180)}
                r={5} fill={timerCol}
                animate={critical?{r:[5,7,5]}:{r:5}}
                transition={{ duration:.5,repeat:critical?Infinity:0 }}/>
            )}
          </svg>
          <div className={s.timerInner}>
            <motion.div className={s.timerTime} style={{ color:timerCol }}
              animate={critical?{scale:[1,1.1,1]}:{scale:1}}
              transition={{ duration:.5,repeat:critical?Infinity:0 }}>
              {mins}:{secs}
            </motion.div>
            <div className={s.timerLabel}>{!started?'LISTO':critical?'¡APURA!':urgent?'¡VOTA YA!':'DEBATE'}</div>
          </div>
        </motion.div>

        {/* Jugadores */}
        <div className={s.chips}>
          {players.map((p,i)=>(
            <motion.div key={p.id} className={s.chip}
              initial={{ opacity:0,scale:.8 }} animate={{ opacity:1,scale:1 }}
              transition={{ delay:.3+i*.05 }}>
              <div className={s.chipDot} style={{ background:p.color.bg }}/>
              <span>{p.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Pistas */}
        <motion.div className={s.tips}
          initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:.38 }}>
          <div className={s.tipsTitle}>💡 Pistas para detectar al impostor</div>
          <ul className={s.tipsList}>
            {['Usa términos vagos o demasiado generales',
              'No puede dar un ejemplo concreto',
              'Cambia el tema cuando le preguntan directamente',
              'Se contradice entre rondas'].map((tip,i)=>(
              <motion.li key={i} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }}
                transition={{ delay:.42+i*.06 }}>{tip}</motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Controles host */}
        {isHost && (
          <motion.div style={{ width:'100%' }}
            initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:.48 }}>
            {!started ? (
              <motion.button className="btn btn-primary btn-lg" style={{ width:'100%' }}
                onClick={doStart} whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}>
                ▶ Iniciar debate ({mins}:{secs})
              </motion.button>
            ) : (
              <motion.button className="btn btn-danger btn-lg" style={{ width:'100%' }}
                onClick={()=>{clearInterval(ref.current);sfx.click();onVote?.()}}
                whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}
                animate={urgent?{boxShadow:['0 4px 0 #8a0018','0 4px 24px rgba(255,61,90,.45)','0 4px 0 #8a0018']}:{}}
                transition={{ duration:1.2,repeat:urgent?Infinity:0 }}>
                🗳 {t===0?'Tiempo agotado — ':''}Pasar a votación
              </motion.button>
            )}
          </motion.div>
        )}

        {isOnline&&!isHost&&(
          <motion.div className={s.guestNote}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.48 }}>
            {started?'👑 El anfitrión pasará a votación cuando termine.':'⏳ Esperando que el anfitrión inicie el debate...'}
          </motion.div>
        )}
      </div>
    </div>
  )
}
