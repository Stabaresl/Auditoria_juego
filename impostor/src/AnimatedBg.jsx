// AnimatedBg.jsx — fondo animado reutilizable para todas las pantallas
// theme: 'home'|'lobby'|'secret'|'discuss'|'vote'|'result'|'glossary'
// accentColor: string hex opcional (para colorear según jugador)

import { useEffect, useState, memo } from 'react'
import { motion } from 'framer-motion'

const PALETTES = {
  home:    { a:'rgba(123,92,255,.13)', b:'rgba(61,255,192,.07)',  c:'rgba(240,224,64,.05)',  pts:['#7b5cff','#3dffc0','#f0e040','#ff3d5a'] },
  lobby:   { a:'rgba(240,224,64,.11)', b:'rgba(123,92,255,.07)',  c:'rgba(61,255,192,.04)',  pts:['#f0e040','#7b5cff','#3dffc0'] },
  secret:  { a:'rgba(61,255,192,.09)', b:'rgba(123,92,255,.06)',  c:'rgba(240,224,64,.04)',  pts:['#3dffc0','#7b5cff','#f0e040'] },
  discuss: { a:'rgba(240,224,64,.08)', b:'rgba(123,92,255,.05)',  c:'rgba(61,255,192,.03)',  pts:['#f0e040','#7b5cff'] },
  vote:    { a:'rgba(255,61,90,.1)',   b:'rgba(123,92,255,.06)',  c:'rgba(255,61,90,.04)',   pts:['#ff3d5a','#7b5cff','#f0e040'] },
  result:  { a:'rgba(61,255,192,.11)', b:'rgba(240,224,64,.07)',  c:'rgba(123,92,255,.05)',  pts:['#3dffc0','#f0e040','#7b5cff','#fff'] },
  glossary:{ a:'rgba(123,92,255,.1)',  b:'rgba(61,255,192,.06)',  c:'rgba(240,224,64,.04)',  pts:['#7b5cff','#3dffc0','#f0e040'] },
}

export default memo(function AnimatedBg({ theme = 'home', accentColor }) {
  const pal = PALETTES[theme] ?? PALETTES.home
  const [pts, setPts] = useState([])

  useEffect(() => {
    setPts(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 15 + Math.random() * 70,
      size: 1.5 + Math.random() * 3.5,
      color: accentColor ?? pal.pts[i % pal.pts.length],
      delay: Math.random() * 9,
      dur: 7 + Math.random() * 9,
      shape: i % 5 === 0 ? 'diamond' : 'circle',
    })))
  }, [theme, accentColor])

  const orb1 = accentColor ? `${accentColor}22` : pal.a
  const orb2 = accentColor ? `${accentColor}11` : pal.b

  return (
    <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>

      {/* Orbe principal — drifting */}
      <motion.div style={{
        position:'absolute', width:700, height:700, borderRadius:'50%',
        background:`radial-gradient(circle, ${orb1} 0%, transparent 68%)`,
        left:'55%', top:'25%', transform:'translate(-50%,-50%)',
      }}
        animate={{ x:[0,30,-20,0], y:[0,-20,15,0], scale:[1,1.12,.95,1] }}
        transition={{ duration:10, repeat:Infinity, ease:'easeInOut' }}
      />

      {/* Orbe secundario */}
      <motion.div style={{
        position:'absolute', width:500, height:500, borderRadius:'50%',
        background:`radial-gradient(circle, ${orb2} 0%, transparent 68%)`,
        left:'20%', top:'65%', transform:'translate(-50%,-50%)',
      }}
        animate={{ x:[0,-25,15,0], y:[0,15,-20,0], scale:[1,.92,1.08,1] }}
        transition={{ duration:13, repeat:Infinity, ease:'easeInOut', delay:3 }}
      />

      {/* Orbe terciario */}
      <motion.div style={{
        position:'absolute', width:320, height:320, borderRadius:'50%',
        background:`radial-gradient(circle, ${pal.c} 0%, transparent 68%)`,
        left:'82%', top:'72%', transform:'translate(-50%,-50%)',
      }}
        animate={{ x:[0,20,-15,0], y:[0,-15,20,0], scale:[1,1.1,.9,1] }}
        transition={{ duration:9, repeat:Infinity, ease:'easeInOut', delay:6 }}
      />

      {/* Grid animado */}
      <motion.div style={{
        position:'absolute', inset:0,
        backgroundImage:`linear-gradient(rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.016) 1px,transparent 1px)`,
        backgroundSize:'56px 56px',
      }}
        animate={{ backgroundPosition:['0px 0px','56px 56px'] }}
        transition={{ duration:22, repeat:Infinity, ease:'linear' }}
      />

      {/* Líneas diagonales fijas */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.02 }}>
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={i} x1={`${i*15-5}%`} y1="0%" x2={`${i*15+45}%`} y2="100%"
            stroke="white" strokeWidth="1"/>
        ))}
      </svg>

      {/* Partículas */}
      {pts.map(p => (
        <motion.div key={p.id} style={{
          position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
          width:p.size, height:p.size,
          borderRadius: p.shape === 'diamond' ? '2px' : '50%',
          background:p.color,
          rotate: p.shape === 'diamond' ? 45 : 0,
        }}
          animate={{
            y:[0, -(28 + Math.random()*32), 0],
            x:[0,(Math.random()-.5)*24,0],
            opacity:[0,.55,0],
            scale:[.4,1,.4],
          }}
          transition={{ duration:p.dur, delay:p.delay, repeat:Infinity, ease:'easeInOut' }}
        />
      ))}

      {/* Scanline viajera */}
      <motion.div style={{
        position:'absolute', left:0, right:0, height:2,
        background:'linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)',
      }}
        animate={{ top:['0%','100%'] }}
        transition={{ duration:9, repeat:Infinity, ease:'linear' }}
      />
    </div>
  )
})
