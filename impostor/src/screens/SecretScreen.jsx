import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBg from '../AnimatedBg'
import { sfx } from '../sounds'
import s from './SecretScreen.module.css'

export default function SecretScreen({ players, assignments, currentViewer, round, totalRounds, chapter, onDone }) {
  const [phase, setPhase] = useState('hidden')
  const player   = players.find(p => p.id === currentViewer)
  const concept  = assignments?.[currentViewer]
  const isImp    = concept?.fake
  const idx      = players.findIndex(p => p.id === currentViewer)
  const isLast   = idx === players.length - 1
  const roundDef = chapter.rounds[round % chapter.rounds.length]
  const col      = player?.color?.bg ?? '#f0e040'

  const reveal = () => {
    setPhase('flip')
    setTimeout(() => {
      setPhase('revealed')
      isImp ? sfx.impostor() : sfx.reveal()
    }, 320)
  }
  const done = () => { sfx.ready(); setPhase('hidden'); onDone() }

  return (
    <div className={s.root}>
      <AnimatedBg theme="secret" accentColor={col} />
      <div className={s.inner}>

        {/* Progreso */}
        <motion.div className={s.progress} initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }}>
          <span className="tag tag-yellow">Ronda {round+1}/{totalRounds}</span>
          <div className={s.dots}>
            {players.map((p,i) => (
              <motion.span key={p.id} className={`${s.dot} ${i<idx?s.dotDone:''} ${i===idx?s.dotActive:''}`}
                style={i===idx?{background:col}:{}}
                animate={i===idx?{scale:[1,1.3,1]}:{}} transition={{ duration:1.1,repeat:Infinity }}/>
            ))}
          </div>
        </motion.div>

        {/* Instrucción */}
        <motion.div className={s.instr} key={currentViewer}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ ease:[.16,1,.3,1] }}>
          <div className={s.passLabel}>📱 Pasa el dispositivo a</div>
          <div className={`${s.playerName} glitch`} data-g={player?.name} style={{ color:col }}>
            {player?.name}
          </div>
          <div className={s.topic}>Tema: <strong>{roundDef.topic}</strong></div>
        </motion.div>

        {/* CARTA */}
        <div className={s.scene}>
          <AnimatePresence mode="wait">

            {/* DORSO */}
            {phase === 'hidden' && (
              <motion.div className={s.cardBack} style={{ borderColor:col }}
                key="back"
                initial={{ opacity:0, scale:.88, rotateY:0 }}
                animate={{ opacity:1, scale:1, rotateY:0 }}
                exit={{ rotateY:90, opacity:0 }}
                transition={{ duration:.32, ease:[.16,1,.3,1] }}>
                {/* Patrón de rombos */}
                <div className={s.backPattern}>
                  {Array.from({length:30}).map((_,i)=>(
                    <span key={i} className={s.diamond} style={{ opacity:.04+(i%5)*.025, color:col }}>◆</span>
                  ))}
                </div>
                <div className={s.backContent}>
                  <motion.div className={s.lockIcon}
                    animate={{ rotate:[0,-5,5,0], scale:[1,1.05,1] }}
                    transition={{ duration:2.5, repeat:Infinity }}>🔒</motion.div>
                  <div className={s.backTitle}>Tu concepto es secreto</div>
                  <div className={s.backDesc}>Asegúrate de que nadie más vea la pantalla antes de revelar.</div>
                  <motion.button className="btn btn-primary btn-lg" style={{ width:'100%', background:col, color:'#04040e', boxShadow:`0 4px 0 rgba(0,0,0,.4)` }}
                    onClick={reveal} whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
                    Revelar mi concepto
                  </motion.button>
                </div>
                <span className={s.corner} style={{ top:10, left:12, color:col }}>◆</span>
                <span className={s.corner} style={{ bottom:10, right:12, color:col, transform:'rotate(180deg)' }}>◆</span>
              </motion.div>
            )}

            {/* FRENTE */}
            {phase === 'revealed' && (
              <motion.div className={`${s.cardFront} ${isImp?s.cardImp:''}`}
                style={{ borderColor: isImp?'#ff3d5a':col }}
                key="front"
                initial={{ rotateY:-90, opacity:0, scale:.9 }}
                animate={{ rotateY:0, opacity:1, scale:1 }}
                transition={{ duration:.5, ease:[.16,1,.3,1] }}>

                {/* Glow impostor */}
                {isImp && <motion.div className={s.impGlow}
                  animate={{ opacity:[.3,.7,.3] }} transition={{ duration:1.6, repeat:Infinity }}/>}

                {/* Banner impostor */}
                {isImp && (
                  <motion.div className={s.impBanner}
                    initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:.35 }}>
                    ⚠️ ERES EL IMPOSTOR — concepto FALSO
                  </motion.div>
                )}

                <div className={s.frontHeader}>
                  <span className={s.suit} style={{ color:isImp?'#ff3d5a':col }}>{isImp?'🎭':'✦'}</span>
                  <span className={s.roleLabel} style={{ color:isImp?'#ff3d5a':col }}>
                    {isImp?'Tu rol: Impostor':'Tu concepto real'}
                  </span>
                </div>

                <motion.div className={`${s.conceptName} glitch`} data-g={concept?.name}
                  initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}>
                  {concept?.name}
                </motion.div>

                <div className={s.divider}>
                  <div className={s.dLine} style={{ background:isImp?'#ff3d5a':col }}/>
                  <span style={{ color:isImp?'#ff3d5a':col, fontSize:'.5rem' }}>◆</span>
                  <div className={s.dLine} style={{ background:isImp?'#ff3d5a':col }}/>
                </div>

                <motion.div className={s.def} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.32 }}>
                  {concept?.definition}
                </motion.div>

                <motion.div className={isImp?s.tipImp:s.tipReal}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.42 }}>
                  {isImp
                    ? <><strong>Objetivo:</strong> Sobrevive 3 rondas. Habla con seguridad y desvía sospechas.</>
                    : <><strong>Recuerda:</strong> Defiende tu concepto sin revelarlo. Detecta al que parece no saber.</>}
                </motion.div>

                <span className={s.corner} style={{ top:10, left:12, color:isImp?'#ff3d5a':col }}>◆</span>
                <span className={s.corner} style={{ bottom:10, right:12, color:isImp?'#ff3d5a':col, transform:'rotate(180deg)' }}>◆</span>

                <motion.button
                  className="btn btn-lg"
                  style={{ width:'calc(100% - 2.4rem)', margin:'1rem 1.2rem 0',
                    background:isImp?'#ff3d5a':col, color:'#04040e',
                    boxShadow:`0 4px 0 ${isImp?'#8a0018':'rgba(0,0,0,.4)'}` }}
                  onClick={done}
                  initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.52 }}
                  whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
                  {isLast?'✓ Todos listos — Empezar debate':`→ Pasar a ${players[idx+1]?.name}`}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
