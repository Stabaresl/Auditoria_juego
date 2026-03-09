import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { startMusic, stopMusic, setMusicVol, isMusicOn } from './sounds'

export default function MusicBtn() {
  const [on, setOn]   = useState(false)
  const [vol, setVol] = useState(0.15)
  const [open, setOpen] = useState(false)

  const toggle = () => {
    if (on) { stopMusic(); setOn(false) }
    else     { startMusic(); setOn(true) }
  }

  const changeVol = v => { setVol(v); setMusicVol(v) }

  return (
    <motion.div
      style={{ position:'fixed', bottom:18, right:18, zIndex:1000, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.2 }}>

      {/* Volume panel */}
      <AnimatePresence>
        {open && (
          <motion.div className="card" style={{ padding:'12px 16px', minWidth:170 }}
            initial={{ opacity:0, scale:.88, y:8 }} animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:.88, y:8 }} transition={{ duration:.2 }}>
            <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gold)', marginBottom:10 }}>
              ♪ BATALLA ÉPICA
            </p>
            <p style={{ fontFamily:'var(--pixel)', fontSize:6, color:'var(--gray)', marginBottom:8, lineHeight:1.8 }}>
              {on ? 'Arpegio Am · 128 BPM' : 'Pulsa ON para activar'}
            </p>
            <input type="range" min={0} max={0.35} step={0.01} value={vol}
              onChange={e => changeVol(+e.target.value)}
              style={{ width:'100%', accentColor:'var(--gold)' }} />
            <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', marginTop:6, textAlign:'right' }}>
              {Math.round(vol/0.35*100)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <motion.button className="btn btn-ghost" style={{ fontSize:9, padding:'6px 10px' }}
          onClick={() => setOpen(o=>!o)} whileHover={{ scale:1.08 }} whileTap={{ scale:.92 }}>
          ⚙
        </motion.button>

        <motion.button onClick={toggle}
          whileHover={{ scale:1.06 }} whileTap={{ scale:.94 }}
          style={{
            background: on ? 'var(--gold)' : '#1a1a2a',
            color: on ? '#1a1a1a' : 'var(--gray)',
            border: on ? 'none' : '2px solid rgba(255,255,255,.15)',
            padding:'8px 14px', borderRadius:4, cursor:'pointer',
            display:'flex', alignItems:'center', gap:8,
            fontFamily:'var(--pixel)', fontSize:9,
            boxShadow: on ? '0 4px 0 #a08000, 0 0 20px rgba(240,224,64,.25)' : '0 2px 0 #111',
            transition:'background .25s, box-shadow .25s',
          }}>
          {/* Equalizer bars */}
          <div style={{ display:'flex', alignItems:'flex-end', gap:2, height:16 }}>
            {[.5,.9,.4,.8,.6,.95,.35,.7].map((h,i) => (
              <motion.div key={i} style={{
                width:3, borderRadius:1,
                background: on ? '#1a1a1a' : 'var(--gray)',
              }}
                animate={on ? { height:[`${h*14}px`, `${2+Math.random()*12}px`, `${h*14}px`] } : { height:'3px' }}
                transition={on ? { duration:.35+i*.06, repeat:Infinity, ease:'easeInOut', delay:i*.04 } : {}}
              />
            ))}
          </div>
          {on ? 'ON' : 'OFF'}
        </motion.button>
      </div>
    </motion.div>
  )
}
