import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BattleBg } from '../components/BattleBg'
import { Sprite } from '../components/sprites'
import { sfx } from '../sounds'
import { TEAM_COLORS } from '../useRoom'

const SPRITES = ['knight','mage','rogue','ranger','paladin','warlock']

export default function OnlineLobbyScreen({
  roomCode, players, myPlayerId, isHost,
  onStart, onLeave, setPlayerReady, onStartDungeon,
}) {
  const [copied, setCopied] = useState(false)
  const me = players.find(p=>p.id===myPlayerId)
  const allReady = players.length >= 2 && players.every(p=>p.ready || p.id===myPlayerId)

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode).catch(()=>{})
    setCopied(true); sfx.click()
    setTimeout(() => setCopied(false), 2000)
  }

  const markReady = () => {
    sfx.ready()
    setPlayerReady(true)
  }

  const teamA = players.filter(p=>p.team===0)
  const teamB = players.filter(p=>p.team===1)

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative' }}>
      <BattleBg variant="lobby" />
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:560 }}>

        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} style={{ textAlign:'center', marginBottom:24 }}>
          <h2 style={{ fontFamily:'var(--pixel)', fontSize:13, color:'var(--gold)', marginBottom:12 }}>
            SALA DE BATALLA
          </h2>
          {/* Room code */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:12,
            background:'rgba(74,144,217,.1)', border:'2px solid var(--blue)',
            borderRadius:4, padding:'10px 20px', cursor:'pointer' }}
            onClick={copyCode}>
            <span style={{ fontFamily:'var(--pixel)', fontSize:20, color:'var(--blue)', letterSpacing:6 }}>
              {roomCode}
            </span>
            <span style={{ fontFamily:'var(--pixel)', fontSize:8, color: copied ? 'var(--green)' : 'var(--gray)' }}>
              {copied ? '✓ COPIADO' : '📋 COPIAR'}
            </span>
          </div>
          <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', marginTop:8 }}>
            Comparte este código para unirte
          </p>
        </motion.div>

        {/* Teams */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
          {[0,1].map(team => {
            const tc = TEAM_COLORS[team]
            const tp = team===0 ? teamA : teamB
            return (
              <div key={team} style={{
                background:'rgba(0,0,0,.3)', border:`2px solid ${tc.main}44`,
                borderRadius:4, padding:14, minHeight:100,
              }}>
                <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:tc.main, marginBottom:12 }}>
                  {tc.name}
                </p>
                <AnimatePresence>
                  {tp.map((p,i) => (
                    <motion.div key={p.id}
                      initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0}}
                      style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                      <Sprite id={SPRITES[p.colorIdx % SPRITES.length]} size={3} />
                      <div style={{ flex:1 }}>
                        <p style={{ fontFamily:'var(--pixel)', fontSize:8, color: p.id===myPlayerId ? tc.main : 'var(--light)' }}>
                          {p.name}
                          {p.id===myPlayerId && ' (tú)'}
                        </p>
                        {isHost && p.id===players[0]?.id && (
                          <span style={{ fontFamily:'var(--pixel)', fontSize:6, color:'var(--gold)' }}>HOST</span>
                        )}
                      </div>
                      <span style={{ fontSize:10 }}>{p.ready ? '✅' : '⏳'}</span>
                    </motion.div>
                  ))}
                  {tp.length === 0 && (
                    <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)' }}>
                      Esperando...
                    </p>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', textAlign:'center', marginBottom:16 }}>
          {players.length}/6 jugadores  •  mínimo 2 (1 por equipo)
        </p>

        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost" onClick={onLeave} style={{ flex:1 }}>← SALIR</button>
          {!me?.ready && !isHost && (
            <button className="btn btn-gold" onClick={markReady} style={{ flex:2, color:'#1a1a1a' }}>
              ✓ LISTO
            </button>
          )}
          {isHost && (
            <div style={{ display:'flex', gap:8, flex:2 }}>
              <button className={`btn ${players.length>=2 ? 'btn-blue' : ''}`}
                onClick={onStart} style={{ flex:2, opacity: players.length>=2 ? 1 : .4 }}
                disabled={players.length < 2}>
                ⚔ INICIAR BATALLA
              </button>
              <button className={`btn btn-red`}
                onClick={onStartDungeon} style={{ flex:1, opacity: players.length>=1 ? 1 : .4 }}
                disabled={players.length < 1}
                title="Modo Mazmorra cooperativo online">
                🐉 MAZMORRA
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
