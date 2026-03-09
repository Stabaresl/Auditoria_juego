import { useState } from 'react'
import { motion } from 'framer-motion'
import { BattleBg } from '../components/BattleBg'
import { CHAPTERS } from '../gameData'
import { sfx } from '../sounds'

export default function HomeScreen({ onStartLocal, onStartOnline, onStartDungeon }) {
  const [selected, setSelected] = useState(null)

  const pick = ch => { sfx.click(); setSelected(ch) }

  const goLocal  = () => { if (!selected) return; sfx.ready(); onStartLocal(selected.id) }
  const goOnline = () => { if (!selected) return; sfx.ready(); onStartOnline(selected.id) }
  const goDungeon= () => { if (!selected) return; sfx.ready(); onStartDungeon(selected.id) }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative' }}>
      <BattleBg variant="home" />
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:700 }}>

        {/* Title */}
        <motion.div initial={{opacity:0,y:-30}} animate={{opacity:1,y:0}} transition={{duration:.6}}
          style={{ textAlign:'center', marginBottom:40 }}>
          <h1 style={{
            fontFamily:'var(--pixel)', fontSize:'clamp(16px,4vw,28px)',
            color:'var(--gold)', textShadow:'0 0 20px rgba(240,224,64,.5)',
            lineHeight:1.6, marginBottom:12,
            animation:'pixelGlitch 4s ease infinite',
          }}>
            TRIVIA<br/>BATTLE
          </h1>
          <p style={{ fontFamily:'var(--pixel)', fontSize:9, color:'var(--blue)', letterSpacing:2 }}>
            ⚔ ASEGURAMIENTO &amp; AUDITORÍA DE TI ⚔
          </p>
        </motion.div>

        {/* How to play */}
        <motion.div className="card-dark" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}}
          style={{ marginBottom:32, padding:'16px 20px' }}>
          <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gold)', marginBottom:12 }}>
            ¿CÓMO JUGAR?
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              ['👥 EQUIPOS','2 equipos de hasta 3 jugadores'],
              ['❤ VIDA COMPARTIDA','El equipo comparte una barra de HP'],
              ['❓ TRIVIA','Responde conceptos de la materia'],
              ['⚔ ATAQUE','Si fallas, el rival ataca tu equipo'],
            ].map(([t,d]) => (
              <div key={t} style={{ padding:'10px 12px', background:'rgba(74,144,217,.07)', borderRadius:3, borderLeft:'2px solid var(--blue)' }}>
                <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--blue)', marginBottom:4 }}>{t}</p>
                <p style={{ fontFamily:'var(--ui)', fontSize:12, color:'var(--light)', opacity:.8 }}>{d}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Chapter select */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.3}}>
          <p style={{ fontFamily:'var(--pixel)', fontSize:9, color:'var(--light)', marginBottom:14, textAlign:'center' }}>
            SELECCIONA CAPÍTULO
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
            {CHAPTERS.map((ch, i) => (
              <motion.button key={ch.id} whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
                onClick={() => pick(ch)}
                style={{
                  background: selected?.id===ch.id ? 'rgba(74,144,217,.2)' : 'rgba(255,255,255,.03)',
                  border: selected?.id===ch.id ? '2px solid var(--blue)' : '2px solid rgba(255,255,255,.08)',
                  borderRadius:4, padding:'14px 18px', cursor:'pointer',
                  textAlign:'left', color:'var(--white)', transition:'all .2s',
                  boxShadow: selected?.id===ch.id ? '0 0 16px rgba(74,144,217,.3)' : 'none',
                }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontFamily:'var(--pixel)', fontSize:18, color: selected?.id===ch.id ? 'var(--gold)' : 'var(--gray)' }}>
                    {String(i+1).padStart(2,'0')}
                  </span>
                  <div>
                    <p style={{ fontFamily:'var(--pixel)', fontSize:9, color: selected?.id===ch.id ? 'var(--gold)' : 'var(--light)', marginBottom:4 }}>
                      {ch.name}
                    </p>
                    <p style={{ fontFamily:'var(--ui)', fontSize:12, color:'var(--gray)' }}>{ch.description}</p>
                  </div>
                  {selected?.id===ch.id && (
                    <span style={{ marginLeft:'auto', fontFamily:'var(--pixel)', fontSize:10, color:'var(--blue)' }}>▶</span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Mode buttons */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <motion.button className={`btn ${selected ? 'btn-blue' : ''}`} whileTap={{ scale:.95 }}
              onClick={goLocal} disabled={!selected}
              style={{ flex:1, minWidth:100, opacity: selected ? 1 : .4, cursor: selected ? 'pointer' : 'not-allowed' }}>
              ⚔ LOCAL
            </motion.button>
            <motion.button className={`btn ${selected ? 'btn-gold' : ''}`} whileTap={{ scale:.95 }}
              onClick={goOnline} disabled={!selected}
              style={{ flex:1, minWidth:100, opacity: selected ? 1 : .4, cursor: selected ? 'pointer' : 'not-allowed', color: selected ? '#1a1a1a' : undefined }}>
              🌐 ONLINE
            </motion.button>
            <motion.button className={`btn ${selected ? 'btn-red' : ''}`} whileTap={{ scale:.95 }}
              onClick={goDungeon} disabled={!selected}
              style={{ flex:'0 0 100%', opacity: selected ? 1 : .4, cursor: selected ? 'pointer' : 'not-allowed' }}>
              🐉 MAZMORRA — Cooperativo vs Monstruo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
