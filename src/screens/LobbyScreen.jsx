import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BattleBg } from '../components/BattleBg'
import { Sprite, SPRITE_DEFS } from '../components/sprites'
import { sfx } from '../sounds'
import { TEAM_COLORS } from '../useRoom'

const PLAYER_COLORS = [
  '#4a90d9','#ff3d5a','#3dffc0','#f0e040','#ff8c42','#9b59b6'
]
const SPRITES = ['knight','mage','rogue','ranger','paladin','warlock']

export default function LobbyScreen({ chapterId, chapterName, onStartGame, onBack }) {
  const [players, setPlayers] = useState([
    { id:'p0', name:'', team:0, spriteId:'knight', colorIdx:0 },
    { id:'p1', name:'', team:1, spriteId:'rogue',  colorIdx:1 },
  ])
  const [error, setError] = useState('')

  const addPlayer = () => {
    if (players.length >= 6) return
    sfx.join()
    const idx = players.length
    setPlayers(p => [...p, {
      id:`p${idx}`, name:'', team: idx % 2, spriteId: SPRITES[idx % SPRITES.length], colorIdx: idx
    }])
  }

  const removePlayer = idx => {
    if (players.length <= 2) return
    sfx.click()
    setPlayers(p => p.filter((_,i) => i !== idx).map((pl,i) => ({ ...pl, id:`p${i}`, colorIdx:i, team: i%2 })))
  }

  const updateName = (idx, name) => {
    setPlayers(p => p.map((pl,i) => i===idx ? { ...pl, name } : pl))
    setError('')
  }

  const updateSprite = (idx, spriteId) => {
    sfx.click()
    setPlayers(p => p.map((pl,i) => i===idx ? { ...pl, spriteId } : pl))
  }

  const start = () => {
    const names = players.map(p => p.name.trim())
    if (names.some(n => !n)) { setError('Todos los jugadores necesitan un nombre.'); return }
    const unique = new Set(names.map(n=>n.toLowerCase()))
    if (unique.size < names.length) { setError('Los nombres deben ser únicos.'); return }
    const teamA = players.filter(p=>p.team===0)
    const teamB = players.filter(p=>p.team===1)
    if (!teamA.length || !teamB.length) { setError('Cada equipo debe tener al menos 1 jugador.'); return }
    sfx.roundStart()
    onStartGame(players.map(p => ({ ...p, name: p.name.trim(), color: { bg: PLAYER_COLORS[p.colorIdx] } })))
  }

  const teamA = players.filter(p=>p.team===0)
  const teamB = players.filter(p=>p.team===1)

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative' }}>
      <BattleBg variant="lobby" />
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:680 }}>

        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} style={{ textAlign:'center', marginBottom:28 }}>
          <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gray)', marginBottom:8 }}>{chapterName}</p>
          <h2 style={{ fontFamily:'var(--pixel)', fontSize:14, color:'var(--gold)' }}>CONFIGURAR BATALLA</h2>
        </motion.div>

        {/* Team columns */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
          {[0,1].map(team => {
            const tc = TEAM_COLORS[team]
            const teamPlayers = players.filter(p=>p.team===team)
            return (
              <div key={team} style={{
                background:`rgba(0,0,0,.3)`, border:`2px solid ${tc.main}44`,
                borderRadius:4, padding:16,
              }}>
                <p style={{ fontFamily:'var(--pixel)', fontSize:9, color:tc.main, marginBottom:14, textAlign:'center' }}>
                  {tc.name}
                </p>
                <AnimatePresence>
                  {teamPlayers.map(pl => {
                    const globalIdx = players.findIndex(p=>p.id===pl.id)
                    return (
                      <motion.div key={pl.id}
                        initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:10}}
                        style={{ marginBottom:12 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                          <Sprite id={pl.spriteId} size={3} />
                          <input className="pixel-input" placeholder={`Jugador ${globalIdx+1}`}
                            value={pl.name} onChange={e=>updateName(globalIdx,e.target.value)}
                            style={{ fontSize:13, flex:1 }} maxLength={14}
                          />
                          {players.length > 2 && (
                            <button onClick={()=>removePlayer(globalIdx)}
                              style={{ background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:16, lineHeight:1 }}>×</button>
                          )}
                        </div>
                        {/* Sprite picker */}
                        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                          {SPRITES.map(sid => (
                            <button key={sid} onClick={()=>updateSprite(globalIdx,sid)}
                              style={{ background: pl.spriteId===sid ? `${tc.main}33` : 'transparent',
                                border: pl.spriteId===sid ? `1px solid ${tc.main}` : '1px solid #333',
                                borderRadius:2, cursor:'pointer', padding:2 }}>
                              <Sprite id={sid} size={2} />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {error && <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--red)', textAlign:'center', marginBottom:12 }}>{error}</p>}

        <div style={{ display:'flex', gap:12 }}>
          <button className="btn btn-ghost" onClick={onBack} style={{ flex:1 }}>← VOLVER</button>
          {players.length < 6 && (
            <button className="btn btn-gold" onClick={addPlayer} style={{ flex:1, color:'#1a1a1a' }}>
              + JUGADOR
            </button>
          )}
          <button className="btn btn-blue" onClick={start} style={{ flex:1 }}>⚔ BATALLA</button>
        </div>

        <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', textAlign:'center', marginTop:14 }}>
          2–6 jugadores  •  equipos alternados automáticamente
        </p>
      </div>
    </div>
  )
}
