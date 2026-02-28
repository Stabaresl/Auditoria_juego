import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { startMusic, stopMusic, setMusicVol, isMusicOn } from './sounds'

export default function MusicBtn() {
  const [on, setOn] = useState(false)
  const [vol, setVol] = useState(0.14)
  const [open, setOpen] = useState(false)

  const toggle = () => {
    if (!on) { startMusic(); setOn(true) }
    else      { stopMusic(); setOn(false) }
  }

  const changeVol = v => { setVol(v); setMusicVol(v) }

  return (
    <motion.div style={{
      position:'fixed', bottom:'1.4rem', right:'1.4rem', zIndex:9990,
      display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'.5rem',
    }} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.2 }}>

      {/* Panel volumen */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:8, scale:.9 }} animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:8, scale:.9 }} transition={{ duration:.2 }}
            style={{
              background:'rgba(8,8,24,.96)', border:'1px solid rgba(255,255,255,.1)',
              borderRadius:12, padding:'.8rem 1rem',
              display:'flex', flexDirection:'column', gap:'.5rem',
              backdropFilter:'blur(16px)', boxShadow:'0 8px 32px rgba(0,0,0,.55)',
            }}>
            <span style={{ fontSize:'.6rem', color:'#8888aa', fontFamily:'JetBrains Mono,monospace',
              letterSpacing:'.1em', textTransform:'uppercase' }}>
              Ambient vol
            </span>
            <input type="range" min="0" max=".35" step=".01" value={vol}
              onChange={e => changeVol(+e.target.value)}
              style={{ width:110, accentColor:'#f0e040', cursor:'pointer' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display:'flex', gap:'.4rem' }}>
        <motion.button onClick={() => setOpen(o=>!o)}
          whileHover={{ scale:1.1 }} whileTap={{ scale:.9 }}
          style={{ width:34, height:34, borderRadius:9, border:'none',
            background:'rgba(255,255,255,.06)', color:'#8888aa',
            fontSize:'.8rem', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
          ⚙
        </motion.button>

        <motion.button onClick={toggle}
          whileHover={{ scale:1.08 }} whileTap={{ scale:.92 }}
          style={{
            width:44, height:44, borderRadius:11, border:'none', cursor:'pointer',
            background: on ? 'linear-gradient(135deg,#f0e040,#c8b800)' : 'rgba(255,255,255,.07)',
            color: on ? '#04040e' : '#8888aa', fontSize:'1rem',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: on ? '0 4px 20px rgba(240,224,64,.3)' : 'none',
            transition:'background .3s, box-shadow .3s',
          }}>
          {on ? (
            <div style={{ display:'flex', gap:2, alignItems:'flex-end', height:16 }}>
              {[.9,.4,.7,.2,.85].map((h,i) => (
                <motion.div key={i} style={{ width:3, background:'#04040e', borderRadius:2 }}
                  animate={{ height:[`${h*14}px`,`${2+Math.random()*12}px`,`${h*14}px`] }}
                  transition={{ duration:.45+i*.08, repeat:Infinity, ease:'easeInOut' }} />
              ))}
            </div>
          ) : '♪'}
        </motion.button>
      </div>
    </motion.div>
  )
}
