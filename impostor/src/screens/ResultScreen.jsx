import { useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedBg from '../AnimatedBg'
import { sfx } from '../sounds'
import s from './ResultScreen.module.css'

function fireConfetti(win) {
  import('canvas-confetti').then(({ default: c }) => {
    if (win) {
      c({ particleCount:130,spread:85,origin:{y:.5},colors:['#3dffc0','#f0e040','#7b5cff','#fff'] })
      setTimeout(()=>c({ particleCount:90,spread:65,origin:{x:.15,y:.6},colors:['#3dffc0','#f0e040'] }),320)
      setTimeout(()=>c({ particleCount:90,spread:65,origin:{x:.85,y:.6},colors:['#7b5cff','#f0e040'] }),580)
    } else {
      c({ particleCount:70,spread:130,origin:{y:.35},colors:['#ff3d5a','#cc1133','#880022'],gravity:.38,scalar:1.2 })
    }
  }).catch(()=>{})
}

export default function ResultScreen({ game, onGlossary, onRestart, isHost=true }) {
  const { players, assignments, impostorId, outcome, history } = game
  const imp = players.find(p=>p.id===impostorId)
  const win = outcome !== 'impostor_wins' // jugadores ganan
  const col = win ? '#3dffc0' : '#ff3d5a'

  useEffect(() => {
    const t = setTimeout(() => { win?sfx.winTeam():sfx.winImpostor(); fireConfetti(win) }, 450)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={s.root}>
      <AnimatedBg theme="result"/>
      <div className={s.inner}>

        {/* Card resultado */}
        <motion.div className={s.outcomeCard} style={{ borderColor:col }}
          initial={{ scale:.82,opacity:0 }}
          animate={{ scale:1,opacity:1 }}
          transition={{ type:'spring',stiffness:190,damping:17,delay:.12 }}>
          <motion.div className={s.emoji}
            animate={{ rotate:[0,-8,8,-4,4,0],scale:[1,1.18,1] }}
            transition={{ duration:.8,delay:.55 }}>
            {win?'🕵️':'🎭'}
          </motion.div>
          <motion.div className={s.outcomeTitle} style={{ color:col }}
            initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ delay:.3 }}>
            <span className="glitch" data-g={win?'¡Impostor descubierto!':'¡El impostor sobrevivió!'}>
              {win?'¡Impostor descubierto!':'¡El impostor sobrevivió!'}
            </span>
          </motion.div>
          <motion.p className={s.outcomeDesc}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.45 }}>
            {win?`El grupo detectó a ${imp?.name}. ¡Bien jugado! 🎉`:`${imp?.name} logró engañar al grupo. 🎉`}
          </motion.p>
        </motion.div>

        {/* Impostor */}
        <motion.div className={s.section}
          initial={{ opacity:0,x:-22 }} animate={{ opacity:1,x:0 }} transition={{ delay:.52 }}>
          <div className={s.secTitle}>El impostor era</div>
          <div className={s.impReveal} style={{ borderColor:imp?.color.bg }}>
            <div className={s.impAv} style={{ background:imp?.color.bg }}>{imp?.name[0].toUpperCase()}</div>
            <div className={`${s.impName} glitch`} data-g={imp?.name} style={{ color:imp?.color.bg }}>{imp?.name}</div>
            <span className="tag tag-red">Impostor</span>
          </div>
        </motion.div>

        {/* Conceptos */}
        <motion.div className={s.section}
          initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ delay:.65 }}>
          <div className={s.secTitle}>Conceptos de esta partida</div>
          <div className={s.concepts}>
            {players.map((p,i)=>(
              <motion.div key={p.id} className={`${s.conceptItem} ${p.id===impostorId?s.cFake:''}`}
                style={{ borderLeftColor:p.color.bg }}
                initial={{ opacity:0,x:-14 }} animate={{ opacity:1,x:0 }}
                transition={{ delay:.7+i*.07 }}>
                <div className={s.conceptHdr}>
                  <div className={s.conceptChip} style={{ background:p.color.light,color:p.color.bg }}>{p.name}</div>
                  {p.id===impostorId&&<span className="tag tag-red">FALSO</span>}
                </div>
                <div className={s.conceptName}>{assignments[p.id]?.name}</div>
                <div className={s.conceptDef}>{assignments[p.id]?.definition}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Historial */}
        <motion.div className={s.section}
          initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ delay:.8 }}>
          <div className={s.secTitle}>Historial de votaciones</div>
          <div className={s.history}>
            {history.map((h,i)=>(
              <div key={i} className={s.hRow}>
                <div className={s.hRound}>Ronda {i+1}</div>
                <div>{h.impostorEliminated
                  ?<span style={{ color:'#3dffc0' }}>✓ Eliminado</span>
                  :<span style={{ color:'#ff3d5a' }}>✗ Sobrevivió</span>}</div>
                <div className={s.hTally}>
                  {Object.entries(h.tally).map(([id,v])=>{
                    const pl=players.find(x=>x.id===id)
                    return v>0?<span key={id} style={{ color:pl?.color.bg }}>{pl?.name}:{v}</span>:null
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Acciones */}
        <motion.div className={s.actions}
          initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:.9 }}>
          <motion.button className="btn btn-primary btn-lg" style={{ flex:1 }}
            onClick={onGlossary} whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
            📚 Ver glosario
          </motion.button>
          <motion.button className="btn btn-ghost" style={{ flex:1 }}
            onClick={onRestart} whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}>
            ↺ {isHost?'Jugar de nuevo':'Salir'}
          </motion.button>
        </motion.div>

      </div>
    </div>
  )
}
