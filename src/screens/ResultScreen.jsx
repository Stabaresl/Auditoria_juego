import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BattleBg } from '../components/BattleBg'
import { Sprite } from '../components/sprites'
import { sfx } from '../sounds'
import { TEAM_COLORS } from '../useRoom'

export default function ResultScreen({ game, players, onRestart }) {
  const { winner, hp, scores, history, gameMode } = game ?? {}
  const isDungeon  = gameMode === 'dungeon'
  const isDraw     = !isDungeon && (winner === 'draw' || winner === null)
  const winTeam    = isDraw ? null : TEAM_COLORS[winner]

  const winPlayers  = isDraw ? [] : players.filter(p => p.team === winner)

  useEffect(() => {
    if (isDraw) {
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount:80, spread:100, origin:{x:.5,y:.4}, colors:['#f0e040','#3dffc0','#4a90d9','#ff3d5a'] })
      }).catch(() => {})
      return
    }
    if (winner !== null && winner !== undefined) {
      sfx.winTeam?.()
      import('canvas-confetti').then(({ default: confetti }) => {
        const color = winner === 0 ? ['#4a90d9','#3dffc0'] : isDungeon ? ['#3dffc0','#f0e040'] : ['#ff3d5a','#f0e040']
        confetti({ particleCount:120, spread:80, origin:{x:.5,y:.4}, colors:color })
        setTimeout(() => confetti({ particleCount:60, spread:60, origin:{x:.3,y:.5}, colors:color }), 300)
        setTimeout(() => confetti({ particleCount:60, spread:60, origin:{x:.7,y:.5}, colors:color }), 500)
      }).catch(() => {})
    }
  }, [winner])

  const sortedPlayers = [...players].sort((a,b) => (scores?.[b.id]??0) - (scores?.[a.id]??0))

  return (
    <div style={{ minHeight:'100vh', position:'relative', padding:24, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <BattleBg variant="result"/>
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:600 }}>

        {/* Banner */}
        <motion.div initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}}
          transition={{type:'spring',stiffness:300,damping:20}}
          style={{ textAlign:'center', marginBottom:28 }}>
          <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gray)', marginBottom:8 }}>
            {isDungeon ? '⚔ ¡FIN DE LA MAZMORRA!' : '¡FIN DE LA BATALLA!'}
          </p>

          {isDungeon ? (
            <h2 style={{ fontFamily:'var(--pixel)', fontSize:'clamp(12px,3vw,20px)',
              color: winner === 'victory' ? 'var(--green)' : 'var(--red)',
              textShadow:`0 0 24px ${winner==='victory'?'rgba(61,255,192,.5)':'rgba(255,61,90,.5)'}`, lineHeight:1.6, marginBottom:16 }}>
              {winner === 'victory' ? '🏆 ¡MONSTRUO DERROTADO!' : '💀 EL MONSTRUO GANÓ'}
            </h2>
          ) : isDraw ? (
            <>
              <h2 style={{ fontFamily:'var(--pixel)', fontSize:'clamp(12px,3vw,22px)', color:'var(--gold)',
                textShadow:'0 0 24px rgba(240,224,64,.5)', lineHeight:1.6, marginBottom:16 }}>
                🤝 EMPATE
              </h2>
              <div style={{ display:'flex', justifyContent:'center', gap:24, marginBottom:20 }}>
                {[0,1].map(team => {
                  const tc = TEAM_COLORS[team]
                  const teamPlayers = players.filter(p => p.team === team)
                  const teamScore   = teamPlayers.reduce((s,p) => s+(scores?.[p.id]??0), 0)
                  return (
                    <div key={team} style={{ textAlign:'center' }}>
                      <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:tc.main, marginBottom:8 }}>{tc.name}</p>
                      <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
                        {teamPlayers.map((p,i) => (
                          <motion.div key={p.id} animate={{ y:[0,-5,0] }} transition={{ duration:1.6,repeat:Infinity,ease:'easeInOut',delay:i*.2 }}>
                            <Sprite id={p.spriteId ?? 'knight'} size={5}/>
                          </motion.div>
                        ))}
                      </div>
                      <p style={{ fontFamily:'var(--pixel)', fontSize:10, color:tc.main, marginTop:8 }}>{teamScore} pts</p>
                      <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', marginTop:2 }}>❤ {Math.ceil(hp?.[team]??0)}</p>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily:'var(--pixel)', fontSize:'clamp(12px,3vw,20px)',
                color:winTeam?.main, textShadow:`0 0 24px ${winTeam?.main}80`, lineHeight:1.6, marginBottom:16 }}>
                🏆 {winTeam?.name}<br/>VICTORIOSO
              </h2>
              <div style={{ display:'flex', justifyContent:'center', gap:20, marginBottom:20 }}>
                {winPlayers.map((p,i) => (
                  <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                    transition={{delay:i*.1}} style={{ textAlign:'center' }}>
                    <motion.div animate={{ y:[0,-6,0] }} transition={{ duration:1.5,repeat:Infinity,ease:'easeInOut',delay:i*.2 }}>
                      <Sprite id={p.spriteId ?? 'knight'} size={6}/>
                    </motion.div>
                    <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:winTeam?.main, marginTop:6 }}>{p.name}</p>
                  </motion.div>
                ))}
              </div>
              <div style={{ display:'inline-flex', gap:8, alignItems:'center', padding:'8px 16px',
                background:`${winTeam?.main}20`, border:`2px solid ${winTeam?.main}`, borderRadius:4 }}>
                <span style={{ fontFamily:'var(--pixel)', fontSize:8, color:winTeam?.main }}>
                  ❤ {Math.ceil(hp?.[winner] ?? 0)} HP RESTANTE
                </span>
              </div>
            </>
          )}
        </motion.div>

        {/* Scoreboard */}
        <motion.div className="card" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.3}}
          style={{ marginBottom:20 }}>
          <p style={{ fontFamily:'var(--pixel)', fontSize:9, color:'var(--gold)', marginBottom:14 }}>PUNTUACIONES</p>
          {sortedPlayers.map((p, i) => {
            const tc    = TEAM_COLORS[p.team] ?? TEAM_COLORS[0]
            const score = scores?.[p.id] ?? 0
            const maxScore = Math.max(...sortedPlayers.map(pl => scores?.[pl.id] ?? 0), 1)
            return (
              <motion.div key={p.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}
                transition={{delay:.4+i*.06}}
                style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                <span style={{ fontFamily:'var(--pixel)', fontSize:10, color:'var(--gray)', width:20 }}>
                  {i===0 ? '👑' : `#${i+1}`}
                </span>
                <Sprite id={p.spriteId ?? 'knight'} size={3}/>
                <span style={{ fontFamily:'var(--pixel)', fontSize:8, color:tc.main, flex:1 }}>{p.name}</span>
                <div style={{ flex:2, height:10, background:'#1a1a2a', borderRadius:2, overflow:'hidden' }}>
                  <motion.div initial={{width:0}} animate={{width:`${(score/maxScore)*100}%`}}
                    transition={{delay:.6+i*.06,duration:.5}}
                    style={{ height:'100%', background:tc.main, borderRadius:2 }}/>
                </div>
                <span style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gold)', width:40, textAlign:'right' }}>
                  {score}pts
                </span>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Historial — compatible con formato local y online */}
        {history?.length > 0 && (
          <motion.div className="card-dark" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}}
            style={{ marginBottom:20, maxHeight:220, overflowY:'auto' }}>
            <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gray)', marginBottom:10 }}>
              HISTORIAL DE PREGUNTAS
            </p>
            {[...history].reverse().map((h, i) => {
              // Compatibilidad local/online
              const isOnlineEntry = h.answeredByA !== undefined
              if (isOnlineEntry) {
                const pA = players.find(p => p.id === h.answeredByA)
                const pB = players.find(p => p.id === h.answeredByB)
                return (
                  <div key={i} style={{ marginBottom:8, padding:'6px 8px',
                    background:'rgba(255,255,255,.03)', borderRadius:3 }}>
                    <p style={{ fontFamily:'var(--pixel)', fontSize:6, color:'var(--gray)', marginBottom:3 }}>
                      R{h.round} — {h.topic ?? ''}
                    </p>
                    <p style={{ fontFamily:'var(--ui)', fontSize:11, color:'var(--light)', marginBottom:4, lineHeight:1.3 }}>
                      {h.questionText?.slice(0,70)}{(h.questionText?.length??0)>70?'…':''}
                    </p>
                    <div style={{ display:'flex', gap:12 }}>
                      {pA && (
                        <span style={{ fontFamily:'var(--pixel)', fontSize:6, color: h.answerA ? 'var(--green)' : 'var(--red)' }}>
                          {h.answerA ? '✓' : '✗'} {pA.name} {h.dmgA > 0 ? `−${h.dmgA}HP` : h.ptsA > 0 ? `+${h.ptsA}pts` : ''}
                        </span>
                      )}
                      {pB && (
                        <span style={{ fontFamily:'var(--pixel)', fontSize:6, color: h.answerB ? 'var(--green)' : 'var(--red)' }}>
                          {h.answerB ? '✓' : '✗'} {pB.name} {h.dmgB > 0 ? `−${h.dmgB}HP` : h.ptsB > 0 ? `+${h.ptsB}pts` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                )
              } else {
                // Formato local
                const pl = players.find(p => p.id === h.answeredBy)
                return (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:6,
                    padding:'6px 8px', background:'rgba(255,255,255,.03)', borderRadius:3 }}>
                    <span style={{ fontSize:12, marginTop:2 }}>{h.correct ? '✓' : '✗'}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:2 }}>
                        <span style={{ fontFamily:'var(--pixel)', fontSize:6,
                          color: h.correct ? 'var(--green)' : 'var(--red)' }}>
                          {pl?.name ?? h.answererName ?? '?'}
                        </span>
                        {h.pts > 0 && <span style={{ fontFamily:'var(--pixel)', fontSize:6, color:'var(--gold)' }}>+{h.pts}pts</span>}
                        {h.dmg > 0 && <span style={{ fontFamily:'var(--pixel)', fontSize:6, color:'var(--red)' }}>−{h.dmg}HP</span>}
                        <span style={{ fontFamily:'var(--pixel)', fontSize:5, color:'var(--gray)' }}>R{h.round}</span>
                      </div>
                      <p style={{ fontFamily:'var(--ui)', fontSize:11, color:'var(--gray)', lineHeight:1.3 }}>
                        {h.questionText?.slice(0,70)}{(h.questionText?.length??0)>70?'…':''}
                      </p>
                    </div>
                  </div>
                )
              }
            })}
          </motion.div>
        )}

        <motion.button className="btn btn-blue" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.6}}
          onClick={onRestart} style={{ width:'100%', padding:'14px' }}>
          ⟳ NUEVA BATALLA
        </motion.button>
      </div>
    </div>
  )
}
