import { memo } from 'react'

const PALETTES = {
  battle: { orb1:'#4a90d9', orb2:'#ff3d5a', orb3:'#9b59b6', grid:'rgba(74,144,217,0.045)', floor:'#4a90d9' },
  home:   { orb1:'#4a90d9', orb2:'#3dffc0', orb3:'#f0e040', grid:'rgba(61,255,192,0.04)',  floor:'#3dffc0' },
  result: { orb1:'#f0e040', orb2:'#ff3d5a', orb3:'#4a90d9', grid:'rgba(240,224,64,0.05)',  floor:'#f0e040' },
  lobby:  { orb1:'#9b59b6', orb2:'#4a90d9', orb3:'#3dffc0', grid:'rgba(155,89,182,0.04)',  floor:'#9b59b6' },
}

export const BattleBg = memo(({ variant = 'battle' }) => {
  const p = PALETTES[variant] ?? PALETTES.battle
  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>

      {/* Scrolling grid */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:`
          linear-gradient(${p.grid} 1px, transparent 1px),
          linear-gradient(90deg, ${p.grid} 1px, transparent 1px)
        `,
        backgroundSize:'60px 60px',
        animation:'gridScroll 10s linear infinite',
      }} />

      {/* Radial vignette */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(5,5,18,.7) 100%)',
      }} />

      {/* Ambient orbs — larger and more spread */}
      {[
        { c:p.orb1, x:'8%',  y:'15%', s:380, d:'0s',   dur:14 },
        { c:p.orb2, x:'85%', y:'65%', s:320, d:'3s',    dur:17 },
        { c:p.orb3, x:'48%', y:'85%', s:240, d:'6s',    dur:12 },
        { c:p.orb1, x:'72%', y:'18%', s:200, d:'9s',    dur:19 },
      ].map(({ c, x, y, s, d, dur }, i) => (
        <div key={i} style={{
          position:'absolute', left:x, top:y,
          width:s, height:s,
          background:`radial-gradient(circle, ${c}1c 0%, ${c}0a 40%, transparent 70%)`,
          borderRadius:'50%',
          transform:'translate(-50%,-50%)',
          animation:`orbFloat ${dur}s ease-in-out ${d} infinite`,
        }} />
      ))}

      {/* Corner pixel brackets */}
      {[
        { top:0, left:0 },
        { top:0, right:0 },
        { bottom:0, left:0 },
        { bottom:0, right:0 },
      ].map((pos, i) => (
        <div key={i} style={{
          position:'absolute', ...pos, width:48, height:48,
          borderTop:    pos.top    !== undefined ? `2px solid ${p.orb1}55` : 'none',
          borderBottom: pos.bottom !== undefined ? `2px solid ${p.orb1}55` : 'none',
          borderLeft:   pos.left   !== undefined ? `2px solid ${p.orb1}55` : 'none',
          borderRight:  pos.right  !== undefined ? `2px solid ${p.orb1}55` : 'none',
        }} />
      ))}

      {/* Pixel terrain — 2 layers for depth */}
      <svg style={{ position:'absolute', bottom:0, left:0, width:'100%', height:90, opacity:.14 }}
        viewBox="0 0 1200 90" preserveAspectRatio="none">
        {/* Back layer — slightly lighter */}
        <polygon
          points="0,90 0,55 60,55 60,38 120,38 120,55 180,55 180,28 240,28 240,55 300,55 300,42 360,42 360,55 420,55 420,18 480,18 480,55 540,55 600,55 600,38 660,38 660,55 720,55 720,25 780,25 780,55 840,55 840,42 900,42 900,55 960,55 960,22 1020,22 1020,55 1080,55 1140,55 1140,38 1200,38 1200,90"
          fill={p.orb3} opacity="0.6" />
        {/* Front layer — main */}
        <polygon
          points="0,90 0,62 40,62 40,45 80,45 80,62 120,62 120,32 160,32 160,62 200,62 200,50 240,50 240,62 280,62 280,22 320,22 320,62 400,62 400,48 440,48 440,62 500,62 560,62 600,62 640,62 640,38 680,38 680,62 740,62 740,28 780,28 780,62 820,62 860,62 860,52 900,52 900,62 940,62 980,62 980,28 1020,28 1020,62 1060,62 1100,62 1140,62 1140,42 1200,42 1200,90"
          fill={p.floor} />
      </svg>

      {/* Battle arena glow strip on floor */}
      {variant === 'battle' && (
        <div style={{
          position:'absolute', bottom:88, left:'20%', right:'20%',
          height:2,
          background:`linear-gradient(90deg, transparent, ${p.orb1}66, transparent)`,
          animation:'arenaGlow 2.5s ease-in-out infinite',
        }} />
      )}

      {/* Scanlines */}
      <div style={{
        position:'absolute', inset:0,
        background:'repeating-linear-gradient(0deg, rgba(0,0,0,.04) 0px, rgba(0,0,0,.04) 1px, transparent 1px, transparent 3px)',
        pointerEvents:'none',
      }} />
    </div>
  )
})
