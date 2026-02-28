import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBg from '../AnimatedBg'
import { sfx } from '../sounds'
import s from './LobbyScreen.module.css'

export default function LobbyScreen({ chapter, colors, onStart, onBack }) {
  const [names, setNames] = useState(['',''])
  const [error, setError] = useState('')

  const add = () => { if (names.length < 6) { setNames(n=>[...n,'']); sfx.join() } }
  const remove = i => { if (names.length > 2) setNames(n=>n.filter((_,j)=>j!==i)) }
  const update = (i,v) => setNames(n=>n.map((x,j)=>j===i?v:x))

  const start = () => {
    const t = names.map(n=>n.trim())
    if (t.some(n=>!n)) { setError('Todos los jugadores deben tener un nombre.'); return }
    if (new Set(t).size !== t.length) { setError('Los nombres deben ser únicos.'); return }
    setError('')
    sfx.click()
    onStart(t.map((name,i)=>({ id:`p${i}`, name, color:colors[i] })))
  }

  return (
    <div className={s.root}>
      <AnimatedBg theme="lobby" />
      <div className={s.inner}>

        <motion.button className="btn btn-ghost btn-sm" style={{ alignSelf:'flex-start' }}
          onClick={onBack} initial={{ opacity:0,x:-14 }} animate={{ opacity:1,x:0 }}
          whileHover={{ x:-3 }}>← Volver</motion.button>

        <motion.div className={s.header}
          initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }}
          transition={{ delay:.1,ease:[.16,1,.3,1] }}>
          <span className="tag tag-yellow">● Cap. {chapter.num} — {chapter.name}</span>
          <h2 className={`${s.title} glitch`} data-g="Sala de espera">Sala de espera</h2>
          <p className={s.sub}>Añade entre 2 y 6 jugadores. El impostor será asignado automáticamente.</p>
        </motion.div>

        <div className={s.list}>
          <AnimatePresence mode="popLayout">
            {names.map((name,i) => (
              <motion.div key={i} className={s.row} layout
                initial={{ opacity:0,x:-24,scale:.95 }}
                animate={{ opacity:1,x:0,scale:1 }}
                exit={{ opacity:0,x:20,scale:.9 }}
                transition={{ duration:.32,ease:[.16,1,.3,1] }}>
                <motion.div className={s.avatar} style={{ background:colors[i].bg }}
                  whileHover={{ scale:1.1,rotate:6 }}>
                  {name ? name[0].toUpperCase() : i+1}
                </motion.div>
                <input className={s.input}
                  placeholder={`Jugador ${i+1}`} value={name} maxLength={18}
                  style={{ borderColor: name?`${colors[i].bg}50`:undefined }}
                  onChange={e=>update(i,e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&i<5&&add()} />
                {names.length > 2 && (
                  <motion.button className={s.rmBtn} onClick={()=>remove(i)}
                    whileHover={{ scale:1.2,rotate:90,color:'#ff3d5a' }}
                    whileTap={{ scale:.8 }}>✕</motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {names.length < 6 && (
          <motion.button className="btn btn-ghost" style={{ width:'100%' }}
            onClick={add} whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}>
            + Añadir jugador ({names.length}/6)
          </motion.button>
        )}

        <AnimatePresence>
          {error && (
            <motion.div className={s.error}
              initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0,x:[0,-6,6,-3,3,0] }}
              exit={{ opacity:0 }} transition={{ duration:.4 }}>
              ⚠ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className={s.info}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}>
          {[['Rondas','3'],['Tema inicial',chapter.rounds[0].topic],['El impostor','1 jugador aleatorio']].map(([k,v],i)=>(
            <motion.div key={i} className={s.infoRow}
              initial={{ opacity:0,x:14 }} animate={{ opacity:1,x:0 }}
              transition={{ delay:.35+i*.07 }}>
              <span className={s.infoK}>{k}</span>
              <span className={s.infoV}>{v}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.button className="btn btn-primary btn-lg" style={{ width:'100%' }}
          onClick={start} disabled={names.some(n=>!n.trim())}
          initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:.45 }}
          whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
          Comenzar juego →
        </motion.button>

      </div>
    </div>
  )
}
