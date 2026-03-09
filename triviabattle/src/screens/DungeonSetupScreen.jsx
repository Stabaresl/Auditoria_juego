// DungeonSetupScreen — elegir monstruo, dificultad y jugadores
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BattleBg } from '../components/BattleBg'
import { Sprite } from '../components/sprites'
import { MONSTERS } from './DungeonScreen'
import { sfx } from '../sounds'

const DIFFICULTIES = [
  { id:'easy',   label:'FÁCIL',   color:'#3dffc0', desc:'Más HP para el equipo, monstruo débil' },
  { id:'normal', label:'NORMAL',  color:'#f0e040', desc:'Equilibrio desafiante' },
  { id:'hard',   label:'DIFÍCIL', color:'#ff3d5a', desc:'El monstruo ataca más y más fuerte' },
]

const SPRITES = ['knight','mage','rogue','ranger','paladin','warlock']

export default function DungeonSetupScreen({ chapterName, onStart, onBack, isOnline = false }) {
  const [selectedMonster, setSelectedMonster] = useState('dragon')
  const [difficulty,      setDifficulty]      = useState('normal')
  const [players, setPlayers] = useState([
    { id:'p0', name:'', spriteId:'knight', colorIdx:0 },
    { id:'p1', name:'', spriteId:'mage',   colorIdx:1 },
  ])
  const [error, setError] = useState('')

  const addPlayer = () => {
    if (players.length >= 6) return
    sfx.join?.()
    const idx = players.length
    setPlayers(p => [...p, { id:`p${idx}`, name:'', spriteId:SPRITES[idx%SPRITES.length], colorIdx:idx }])
  }

  const removePlayer = idx => {
    if (players.length <= 1) return
    sfx.click?.()
    setPlayers(p => p.filter((_,i)=>i!==idx).map((pl,i)=>({...pl,id:`p${i}`,colorIdx:i})))
  }

  const start = () => {
    if (isOnline) {
      sfx.roundStart?.()
      onStart([], selectedMonster, difficulty)
      return
    }
    const names = players.map(p=>p.name.trim())
    if (names.some(n=>!n)) { setError('Todos los jugadores necesitan nombre.'); return }
    const unique = new Set(names.map(n=>n.toLowerCase()))
    if (unique.size < names.length) { setError('Los nombres deben ser únicos.'); return }
    sfx.roundStart?.()
    onStart(
      players.map((p,i)=>({...p,name:p.name.trim(),team:0})),  // todos mismo equipo
      selectedMonster, difficulty
    )
  }

  const monsterDef = MONSTERS[selectedMonster]

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative' }}>
      <BattleBg variant="lobby"/>
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:640 }}>

        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} style={{ textAlign:'center', marginBottom:28 }}>
          <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gray)', marginBottom:6 }}>{chapterName}</p>
          <h2 style={{ fontFamily:'var(--pixel)', fontSize:16, color:'var(--red)' }}>⚔ MODO MAZMORRA</h2>
          <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', marginTop:6 }}>
            {isOnline ? '🌐 Online — jugadores de la sala vs el monstruo' : 'Cooperativo — todos contra el monstruo'}
          </p>
          {isOnline && (
            <motion.span className="tag tag-blue" style={{ marginTop:8, display:'inline-block' }}
              animate={{ opacity:[1,.7,1] }} transition={{ duration:1.5, repeat:Infinity }}>
              ⚡ MODO ONLINE
            </motion.span>
          )}
        </motion.div>

        {/* Selección monstruo */}
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:.1}}
          className="card" style={{ marginBottom:16, padding:'16px' }}>
          <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gold)', marginBottom:12 }}>ELIGE TU ENEMIGO</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {Object.values(MONSTERS).map(m => (
              <motion.button key={m.id}
                whileHover={{scale:1.04}} whileTap={{scale:.96}}
                onClick={() => { sfx.click?.(); setSelectedMonster(m.id) }}
                style={{
                  padding:'12px 8px', borderRadius:4, textAlign:'center', cursor:'pointer',
                  border:`2px solid ${selectedMonster===m.id?m.color:'rgba(255,255,255,.08)'}`,
                  background:selectedMonster===m.id?`${m.color}18`:'rgba(255,255,255,.03)',
                  boxShadow:selectedMonster===m.id?`0 0 12px ${m.color}44`:'none',
                  transition:'all .2s',
                }}>
                <p style={{ fontSize:28, marginBottom:4 }}>{m.icon}</p>
                <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:selectedMonster===m.id?m.color:'var(--gray)' }}>{m.name}</p>
                <p style={{ fontFamily:'var(--ui)', fontSize:11, color:'var(--gray)', marginTop:4, lineHeight:1.3 }}>{m.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Dificultad */}
        <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:.15}}
          className="card" style={{ marginBottom:16, padding:'16px' }}>
          <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gold)', marginBottom:12 }}>DIFICULTAD</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {DIFFICULTIES.map(d => (
              <motion.button key={d.id}
                whileHover={{scale:1.04}} whileTap={{scale:.96}}
                onClick={() => { sfx.click?.(); setDifficulty(d.id) }}
                style={{
                  padding:'12px 8px', borderRadius:4, cursor:'pointer', textAlign:'center',
                  border:`2px solid ${difficulty===d.id?d.color:'rgba(255,255,255,.08)'}`,
                  background:difficulty===d.id?`${d.color}18`:'rgba(255,255,255,.03)',
                  transition:'all .2s',
                }}>
                <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:difficulty===d.id?d.color:'var(--gray)' }}>{d.label}</p>
                <p style={{ fontFamily:'var(--ui)', fontSize:11, color:'var(--gray)', marginTop:4, lineHeight:1.3 }}>{d.desc}</p>
                <p style={{ fontFamily:'var(--pixel)', fontSize:6, color:d.color, marginTop:6 }}>
                  {monsterDef.hp[d.id]} HP
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Jugadores — solo en modo local */}
        {!isOnline && (
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.2}}
          className="card" style={{ marginBottom:16, padding:'16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gold)' }}>HÉROES ({players.length}/6)</p>
            {players.length < 6 && (
              <motion.button className="btn btn-blue" style={{ padding:'6px 12px', fontSize:10 }}
                whileHover={{scale:1.05}} onClick={addPlayer}>+ Héroe</motion.button>
            )}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
            {players.map((pl,idx) => (
              <div key={pl.id} style={{ background:'rgba(255,255,255,.04)', borderRadius:4, padding:'10px', border:'1px solid rgba(255,255,255,.08)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <Sprite id={pl.spriteId} size={3}/>
                  {players.length > 1 && (
                    <button onClick={() => removePlayer(idx)}
                      style={{ background:'transparent', border:'none', color:'var(--gray)', cursor:'pointer', fontSize:14 }}>✕</button>
                  )}
                </div>
                <input
                  placeholder={`Héroe ${idx+1}`}
                  value={pl.name}
                  onChange={e => { setPlayers(p=>p.map((pl2,i)=>i===idx?{...pl2,name:e.target.value}:pl2)); setError('') }}
                  style={{ width:'100%', background:'transparent', border:'1px solid rgba(255,255,255,.15)', borderRadius:3,
                    padding:'6px 8px', color:'var(--light)', fontFamily:'var(--ui)', fontSize:12, marginBottom:6, boxSizing:'border-box' }}/>
                <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                  {SPRITES.map(s => (
                    <motion.button key={s} whileTap={{scale:.9}}
                      onClick={() => { sfx.click?.(); setPlayers(p=>p.map((pl2,i)=>i===idx?{...pl2,spriteId:s}:pl2)) }}
                      style={{ width:24,height:24, padding:0, background:pl.spriteId===s?'rgba(74,144,217,.25)':'transparent',
                        border:`1px solid ${pl.spriteId===s?'var(--blue)':'rgba(255,255,255,.08)'}`, borderRadius:3, cursor:'pointer', overflow:'hidden' }}>
                      <Sprite id={s} size={1}/>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {error && <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--red)', marginTop:10 }}>{error}</p>}
        </motion.div>
        )}

        <div style={{ display:'flex', gap:10 }}>
          <motion.button className="btn" style={{ flex:1, padding:'12px' }}
            whileHover={{scale:1.02}} onClick={onBack}>← Volver</motion.button>
          <motion.button className="btn btn-red" style={{ flex:2, padding:'12px' }}
            whileHover={{scale:1.02}} whileTap={{scale:.98}} onClick={start}>
            ⚔ ¡INICIAR MAZMORRA!
          </motion.button>
        </div>
      </div>
    </div>
  )
}
