// DungeonScreen.jsx — Modo Mazmorra
// Todos los jugadores cooperan para derrotar a un monstruo.
// Cada respuesta correcta quita HP al monstruo.
// Si el tiempo (turnos) se agota y el monstruo sigue vivo → todos pierden.
// El monstruo también tiene un ataque que se activa cada N rondas.
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BattleBg } from '../components/BattleBg'
import { AnimatedSprite, Sprite } from '../components/sprites'
import { sfx } from '../sounds'
import { getPlayerAbilities, ABILITY_CHARGES } from '../abilities'

const TIMER_MAX    = 30
const RESULT_SHOW  = 2200
const MONSTER_DMG  = 15    // daño por turno si nadie responde bien
const MONSTER_ATK_EVERY = 4  // el monstruo ataca al equipo cada N rondas

// Monstruos disponibles
export const MONSTERS = {
  dragon: {
    id:      'dragon',
    name:    'Dragón Antiguo',
    icon:    '🐉',
    color:   '#ff4400',
    hp:      { easy:200, normal:350, hard:500 },
    dmg:     { easy:10,  normal:15,  hard:25  },
    atkEvery:{ easy:5,   normal:4,   hard:3   },
    desc:    'Maestro del fuego. Ataca al equipo si no aciertan.',
  },
  slime: {
    id:      'slime',
    name:    'Rey Slime',
    icon:    '🟢',
    color:   '#44cc44',
    hp:      { easy:120, normal:200, hard:320 },
    dmg:     { easy:8,   normal:12,  hard:20  },
    atkEvery:{ easy:6,   normal:5,   hard:3   },
    desc:    'Se divide y multiplica. Fácil al principio, peligroso al final.',
  },
  golem: {
    id:      'golem',
    name:    'Gólem de Piedra',
    icon:    '🪨',
    color:   '#8888aa',
    hp:      { easy:300, normal:500, hard:800 },
    dmg:     { easy:6,   normal:10,  hard:18  },
    atkEvery:{ easy:7,   normal:5,   hard:4   },
    desc:    'Resistencia infinita. Necesita constancia para derrotarlo.',
  },
}

// ── Barra de HP del monstruo ──────────────────────────────────────────────────
function MonsterHPBar({ hp, maxHp, color }) {
  const pct = Math.max(0, (hp / maxHp) * 100)
  const barColor = pct > 50 ? color : pct > 25 ? '#f0c040' : '#ff3d5a'
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontFamily:'var(--pixel)', fontSize:8, color }}>MONSTRUO HP</span>
        <motion.span style={{ fontFamily:'var(--pixel)', fontSize:8, color:barColor }}
          animate={pct < 25 ? { opacity:[1,.4,1] } : { opacity:1 }}
          transition={{ duration:.5, repeat:pct<25?Infinity:0 }}>
          {Math.ceil(hp)}/{maxHp}
        </motion.span>
      </div>
      <div style={{ height:14, background:'rgba(0,0,0,.4)', borderRadius:7, overflow:'hidden', border:`1px solid ${color}44` }}>
        <motion.div
          animate={{ width:`${pct}%`, background:barColor }}
          transition={{ duration:.6, ease:[.16,1,.3,1] }}
          style={{ height:'100%', borderRadius:7, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)', animation:'shimmerHP 2s linear infinite' }}/>
        </motion.div>
      </div>
    </div>
  )
}

// ── HP del equipo (shared) ────────────────────────────────────────────────────
function TeamHPBar({ hp, maxHp = 100 }) {
  const pct = Math.max(0, (hp / maxHp) * 100)
  const color = pct > 50 ? '#3dffc0' : pct > 25 ? '#f0c040' : '#ff3d5a'
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)' }}>EQUIPO HP</span>
        <span style={{ fontFamily:'var(--pixel)', fontSize:7, color }}>{Math.ceil(hp)}/{maxHp}</span>
      </div>
      <div style={{ height:10, background:'rgba(0,0,0,.4)', borderRadius:5, overflow:'hidden' }}>
        <motion.div animate={{ width:`${pct}%`, background:color }} transition={{ duration:.5 }}
          style={{ height:'100%', borderRadius:5 }}/>
      </div>
    </div>
  )
}

// ── Sprite del monstruo ───────────────────────────────────────────────────────
function MonsterSprite({ monsterId, isAttacking, isTakingHit, size = 5 }) {
  const colors = {
    dragon: '#ff4400', slime: '#44cc44', golem: '#8888aa',
  }
  const color = colors[monsterId] ?? '#ff4400'

  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      <motion.div
        animate={
          isTakingHit ? { x:[0,-8,12,-8,4,-4,0], y:[0,-4,0], filter:['none','brightness(6)','none'] }
          : isAttacking ? { x:[0,20,0], scale:[1,1.2,1] }
          : { y:[0,-4,0] }
        }
        transition={
          isTakingHit ? { duration:.4, type:'tween' }
          : isAttacking ? { duration:.35, type:'spring' }
          : { duration:2, repeat:Infinity, ease:'easeInOut' }
        }>
        <Sprite id={monsterId === 'slime' ? 'slime' : monsterId === 'golem' ? 'golem' : 'dragon'} size={size}/>
      </motion.div>
      {/* Aura de ataque */}
      <AnimatePresence>
        {isAttacking && (
          <motion.div key="aura" style={{
            position:'absolute', inset:-16, borderRadius:12, zIndex:-1,
            background:`radial-gradient(circle,${color}55 0%,transparent 70%)`,
          }}
            initial={{opacity:0,scale:.7}} animate={{opacity:[0,1,0],scale:[.7,1.5,1.2]}} exit={{opacity:0}}
            transition={{duration:.5}}/>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Overlay de resultado en mazmorra ─────────────────────────────────────────
function DungeonResultOverlay({ result, players, monsterColor }) {
  if (!result) return null
  const { correct, answeredBy, dmg, dmgTeam, monsterAttacked, monsterId } = result
  const pl = players.find(p => p.id === answeredBy)

  return (
    <motion.div
      initial={{opacity:0,scale:.7,y:-20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.8}}
      transition={{type:'spring',stiffness:280,damping:18}}
      style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, pointerEvents:'none' }}>
      <div style={{
        padding:'24px 36px', textAlign:'center', borderRadius:8,
        background: correct ? 'rgba(5,25,15,.97)' : 'rgba(28,8,12,.97)',
        border:`3px solid ${correct ? 'var(--green)' : 'var(--red)'}`,
        boxShadow:`0 0 40px ${correct ? 'rgba(61,255,192,.4)' : 'rgba(255,61,90,.4)'}`,
        maxWidth:300,
      }}>
        <motion.p style={{ fontSize:32, marginBottom:8 }}
          animate={{scale:[1,1.2,1]}} transition={{duration:.4}}>
          {correct ? '⚔' : '💥'}
        </motion.p>
        {pl && <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', marginBottom:4 }}>{pl.name}</p>}
        <p style={{ fontFamily:'var(--pixel)', fontSize:11, color:correct?'var(--green)':'var(--red)', marginBottom:8 }}>
          {correct ? '¡GOLPE AL MONSTRUO!' : '¡FALLASTE!'}
        </p>
        {correct && dmg > 0 && (
          <motion.p style={{ fontFamily:'var(--pixel)', fontSize:9, color:monsterColor }}
            initial={{y:-8,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.1}}>
            -{dmg} HP al monstruo
          </motion.p>
        )}
        {!correct && dmgTeam > 0 && (
          <motion.p style={{ fontFamily:'var(--pixel)', fontSize:9, color:'var(--red)' }}
            initial={{y:-8,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.1}}>
            -{dmgTeam} HP al equipo
          </motion.p>
        )}
        {monsterAttacked && (
          <motion.p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'#ff8c42', marginTop:6 }}
            initial={{x:-8,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:.2}}>
            💥 ¡ATAQUE DEL MONSTRUO!
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

// ── Panel de habilidades compacto ─────────────────────────────────────────────
function DungeonAbilityBar({ player, charges, onUse, disabled }) {
  if (!player) return null
  const abilities = getPlayerAbilities(player.spriteId)
  const remaining = charges?.[player.id] ?? ABILITY_CHARGES
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ display:'flex', gap:2, marginRight:4 }}>
        {Array.from({length:ABILITY_CHARGES}).map((_,i) => (
          <div key={i} style={{ width:6,height:6,borderRadius:'50%',
            background:i<remaining?'#f0e040':'rgba(255,255,255,.1)',
            boxShadow:i<remaining?'0 0 5px #f0e040':'none', transition:'all .3s' }}/>
        ))}
      </div>
      {abilities.map(ab => {
        const canUse = !disabled && remaining > 0
        return (
          <motion.button key={ab.id}
            whileHover={canUse?{scale:1.1,y:-2}:{}} whileTap={canUse?{scale:.92}:{}}
            onClick={() => canUse && onUse(ab)}
            title={`${ab.name}: ${ab.desc}`}
            style={{
              width:32,height:32,borderRadius:4,border:`2px solid ${canUse?ab.color+'66':'rgba(255,255,255,.08)'}`,
              background:canUse?`${ab.color}11`:'transparent',
              cursor:canUse?'pointer':'not-allowed',
              display:'flex',alignItems:'center',justifyContent:'center',
              opacity:canUse?1:.3, transition:'all .2s',
            }}>
            <span style={{ fontSize:14 }}>{ab.icon}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

// ── DungeonScreen principal ───────────────────────────────────────────────────
export default function DungeonScreen({
  game, players,
  myPlayerId,   // null en local (hot-seat)
  isHost,
  isOnline,
  onAnswer,
  onNextQuestion,
}) {
  const {
    currentQ, monsterHp, maxMonsterHp, teamHp = 100, lastResult,
    round, totalRounds, winner, monsterId = 'dragon', monsterDef,
    currentFighter,   // quién responde ahora (rotando entre todos)
    history = [],
    roundAnswers,
  } = game ?? {}

  const monster   = MONSTERS[monsterId] ?? MONSTERS.dragon
  const monColor  = monster.color

  const [timeLeft,       setTimeLeft]       = useState(TIMER_MAX)
  const [answered,       setAnswered]       = useState(false)
  const [showResult,     setShowResult]     = useState(false)
  const [monsterHit,     setMonsterHit]     = useState(false)   // monstruo recibe daño
  const [monsterAtks,    setMonsterAtks]    = useState(false)   // monstruo ataca
  const [playerHit,      setPlayerHit]      = useState(null)    // playerId golpeado
  const [hiddenOptions,  setHiddenOptions]  = useState([])
  const [revealCorrect,  setRevealCorrect]  = useState(false)
  const [shieldActive,   setShieldActive]   = useState(false)
  const [doubleActive,   setDoubleActive]   = useState(false)
  const [localCharges,   setLocalCharges]   = useState({})

  const timerRef       = useRef(null)
  const currentQIdRef  = useRef(null)
  const resultShownRef = useRef(null)

  // Inicializar cargas
  useEffect(() => {
    if (players.length > 0 && Object.keys(localCharges).length === 0) {
      setLocalCharges(Object.fromEntries(players.map(p => [p.id, ABILITY_CHARGES])))
    }
  }, [players])

  // ── Determinar quien puede responder ─────────────────────────────────────
  const iAlreadyAnswered = isOnline
    ? roundAnswers !== null && roundAnswers !== undefined
    : answered
  const myFighter = !isOnline ? null : players.find(p => p.id === myPlayerId)
  const canAnswer = !answered && !showResult && (
    isOnline
      ? myPlayerId === currentFighter && !iAlreadyAnswered
      : myPlayerId === null || myPlayerId === currentFighter
  )

  // ── Reset por nueva pregunta ──────────────────────────────────────────────
  useEffect(() => {
    if (!currentQ?.id) return
    if (currentQ.id === currentQIdRef.current) return
    currentQIdRef.current = currentQ.id
    setAnswered(false)
    setShowResult(false)
    setTimeLeft(TIMER_MAX)
    setHiddenOptions([])
    setRevealCorrect(false)
    setShieldActive(false)
    setDoubleActive(false)
  }, [currentQ?.id])

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (showResult || winner || iAlreadyAnswered) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          if (canAnswer) { setAnswered(true); onAnswer(false, {}) }
          return 0
        }
        if (t <= 5) sfx.tickFinal?.()
        else if (t <= 10) sfx.tick?.()
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ?.id, showResult, iAlreadyAnswered, winner])

  // ── Detectar lastResult ───────────────────────────────────────────────────
  const resultKey = lastResult ? `${round}-${currentQ?.id}` : null
  useEffect(() => {
    if (!lastResult || !resultKey) return
    if (resultKey === resultShownRef.current) return
    resultShownRef.current = resultKey
    triggerResultAnim(lastResult)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultKey])

  // ── Usar habilidad ────────────────────────────────────────────────────────
  const handleUseAbility = useCallback((ability) => {
    const pid = myPlayerId ?? currentFighter
    if ((localCharges[pid] ?? 0) <= 0) return
    setLocalCharges(c => ({ ...c, [pid]: Math.max(0, (c[pid]??0) - 1) }))
    switch(ability.effect) {
      case 'fifty': {
        const wrongs = currentQ.options.map((o,i)=>o.correct?-1:i).filter(i=>i>=0)
        setHiddenOptions(wrongs.sort(()=>Math.random()-.5).slice(0,2))
        sfx.correct?.()
        break
      }
      case 'shield': setShieldActive(true); sfx.defend?.(); break
      case 'double': setDoubleActive(true); sfx.roundStart?.(); break
      case 'reveal':
        setRevealCorrect(true)
        setTimeout(()=>setRevealCorrect(false), 3000)
        sfx.question?.()
        break
    }
  }, [currentQ, localCharges, myPlayerId, currentFighter])

  // ── Responder ─────────────────────────────────────────────────────────────
  const handleAnswer = useCallback((correct) => {
    if (!canAnswer) return
    clearInterval(timerRef.current)
    setAnswered(true)
    correct ? sfx.correct?.() : sfx.wrong?.()
    onAnswer(correct, { shield: shieldActive, double: doubleActive })
  }, [canAnswer, onAnswer, shieldActive, doubleActive])

  // ── Animar resultado ──────────────────────────────────────────────────────
  function triggerResultAnim(result) {
    if (!result) return
    setShowResult(true)
    clearInterval(timerRef.current)

    if (result.correct) {
      // Jugador golpea al monstruo
      setMonsterHit(true)
      sfx.attack?.()
      setTimeout(() => { sfx.hit?.() }, 400)
      setTimeout(() => setMonsterHit(false), 700)
    } else if (result.monsterAttacked) {
      // Monstruo contraataca
      setMonsterAtks(true)
      sfx.attack?.()
      setTimeout(() => {
        setPlayerHit(result.answeredBy)
        sfx.hit?.()
      }, 350)
      setTimeout(() => { setMonsterAtks(false); setPlayerHit(null) }, 800)
    }

    if (isHost || !isOnline) {
      setTimeout(() => { setShowResult(false); onNextQuestion() }, RESULT_SHOW)
    }
  }

  if (!currentQ) return null

  const monHpPct = Math.max(0, (monsterHp / maxMonsterHp) * 100)
  const fighter  = players.find(p => p.id === currentFighter)

  // Compactar jugadores para el panel lateral
  const leftPlayers  = players.filter((_,i) => i % 2 === 0)
  const rightPlayers = players.filter((_,i) => i % 2 === 1)

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', position:'relative' }}>
      <BattleBg variant="battle"/>

      {/* Overlay oscuro */}
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', pointerEvents:'none' }}/>

      <div style={{ position:'relative', zIndex:1, flex:1, display:'flex', flexDirection:'column', padding:'14px 18px', gap:10, maxWidth:840, margin:'0 auto', width:'100%' }}>

        {/* Header: HP del monstruo */}
        <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}}
          className="card" style={{ padding:'12px 16px', border:`2px solid ${monColor}44` }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
            <span style={{ fontSize:24 }}>{monster.icon}</span>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:'var(--pixel)', fontSize:9, color:monColor, marginBottom:4 }}>{monster.name}</p>
              <MonsterHPBar hp={monsterHp ?? 0} maxHp={maxMonsterHp ?? 100} color={monColor}/>
            </div>
            <div style={{ textAlign:'right' }}>
              <span className="tag tag-red">R{round}/{totalRounds}</span>
            </div>
          </div>
          <TeamHPBar hp={teamHp} maxHp={100}/>
        </motion.div>

        {/* Arena principal */}
        <div style={{ display:'flex', gap:12, alignItems:'flex-end', minHeight:140 }}>
          {/* Jugadores izquierda */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {leftPlayers.map(p => (
              <div key={p.id} style={{ textAlign:'center', opacity:p.id===currentFighter?1:.5, transition:'opacity .3s' }}>
                <AnimatedSprite
                  id={p.spriteId ?? 'knight'} size={4}
                  isAttacking={monsterHit && p.id === currentFighter}
                  isTakingHit={playerHit === p.id}
                  idleDelay={0.3}
                />
                <p style={{ fontFamily:'var(--pixel)', fontSize:6, color:'var(--gray)', marginTop:4 }}>
                  {p.name}
                </p>
                {p.id === currentFighter && (
                  <motion.span className="tag tag-blue" style={{ fontSize:5, display:'block', marginTop:2 }}
                    animate={{ opacity:[1,.6,1] }} transition={{ duration:.8, repeat:Infinity }}>▶</motion.span>
                )}
              </div>
            ))}
          </div>

          {/* Monstruo central */}
          <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'flex-end' }}>
            <div style={{ textAlign:'center' }}>
              <MonsterSprite monsterId={monsterId} isAttacking={monsterAtks} isTakingHit={monsterHit} size={6}/>
              {/* Partículas de daño */}
              <AnimatePresence>
                {monsterHit && (
                  <motion.div key="dmg" style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)',
                    fontFamily:'var(--pixel)', fontSize:14, color:monColor,
                    textShadow:`0 0 12px ${monColor}`, pointerEvents:'none', zIndex:30, whiteSpace:'nowrap' }}
                    initial={{y:0,opacity:1,scale:1}} animate={{y:-40,opacity:0,scale:1.5}}
                    exit={{opacity:0}} transition={{duration:.7}}>
                    -{lastResult?.dmg ?? '??'} HP
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Jugadores derecha */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {rightPlayers.map(p => (
              <div key={p.id} style={{ textAlign:'center', opacity:p.id===currentFighter?1:.5, transition:'opacity .3s' }}>
                <AnimatedSprite
                  id={p.spriteId ?? 'knight'} size={4} flip
                  isAttacking={monsterHit && p.id === currentFighter}
                  isTakingHit={playerHit === p.id}
                  idleDelay={0.5}
                />
                <p style={{ fontFamily:'var(--pixel)', fontSize:6, color:'var(--gray)', marginTop:4 }}>
                  {p.name}
                </p>
                {p.id === currentFighter && (
                  <motion.span className="tag tag-blue" style={{ fontSize:5, display:'block', marginTop:2 }}
                    animate={{ opacity:[1,.6,1] }} transition={{ duration:.8, repeat:Infinity }}>▶</motion.span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Habilidades del jugador activo */}
        {canAnswer && fighter && (
          <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
            className="card" style={{ padding:'8px 12px', display:'flex', alignItems:'center', gap:12 }}>
            <Sprite id={fighter.spriteId ?? 'knight'} size={2}/>
            <span style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', flex:1 }}>
              {fighter.name}
            </span>
            <DungeonAbilityBar
              player={fighter} charges={localCharges}
              onUse={handleUseAbility}
              disabled={answered || showResult}
            />
          </motion.div>
        )}

        {/* Pregunta */}
        <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--blue)', textAlign:'center' }}>
          📚 {currentQ.topic}
        </p>

        <motion.div key={currentQ.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
          className="card" style={{ padding:'14px 16px', flex:1, position:'relative' }}>

          <div style={{ marginBottom:8, textAlign:'center' }}>
            {fighter ? (
              <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--green)' }}>
                ⚔ {fighter.name} ataca al monstruo
                {doubleActive && <span style={{ color:'#f0e040' }}> — DOBLE</span>}
              </p>
            ) : (
              <motion.p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)' }}
                animate={{ opacity:[.5,1,.5] }} transition={{ duration:1, repeat:Infinity }}>
                ⌛ Esperando…
              </motion.p>
            )}
          </div>

          <p style={{ fontFamily:'var(--ui)', fontSize:14, color:'var(--light)', lineHeight:1.72, marginBottom:14 }}>
            {currentQ.question}
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:9 }}>
            {currentQ.options.map((opt, i) => {
              const hidden    = hiddenOptions.includes(i)
              const revealed  = showResult || (revealCorrect && opt.correct)
              const clickable = canAnswer && !hidden && !showResult
              let bg     = 'rgba(255,255,255,.04)'
              let border = '2px solid rgba(255,255,255,.08)'
              let txtCol = 'var(--light)'
              if (hidden) { bg='rgba(255,255,255,.01)'; border='2px solid rgba(255,255,255,.03)'; txtCol='transparent' }
              else if (revealCorrect && opt.correct) { bg='rgba(255,200,0,.1)'; border='2px solid #f0e040'; txtCol='#f0e040' }
              else if (revealed) {
                if (opt.correct) { bg='rgba(61,255,192,.16)'; border='2px solid var(--green)'; txtCol='var(--green)' }
                else             { bg='rgba(255,61,90,.09)';  border='2px solid rgba(255,61,90,.22)'; txtCol='var(--gray)' }
              }
              return (
                <motion.button key={i}
                  initial={{opacity:0,y:8}} animate={{opacity:hidden?.2:1,y:0}} transition={{delay:i*.06}}
                  whileHover={clickable?{scale:1.025,background:'rgba(74,144,217,.18)',borderColor:'var(--blue)'}:{}}
                  whileTap={clickable?{scale:.96}:{}}
                  onClick={() => clickable && handleAnswer(opt.correct)}
                  style={{
                    background:bg,border,borderRadius:4,padding:'11px 13px',
                    cursor:clickable?'pointer':'default',textAlign:'left',color:txtCol,
                    fontFamily:'var(--ui)',fontSize:13,lineHeight:1.4,
                    transition:'all .18s',position:'relative',overflow:'hidden',
                    opacity:(!canAnswer&&!revealed&&!iAlreadyAnswered)?.5:undefined,
                    pointerEvents:hidden?'none':undefined,
                  }}>
                  <span style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', display:'block', marginBottom:4 }}>
                    {String.fromCharCode(65+i)}
                  </span>
                  {hidden?'—':opt.text}
                  {revealed && opt.correct && (
                    <motion.div style={{ position:'absolute',inset:0,borderRadius:4,background:'rgba(61,255,192,.08)' }}
                      animate={{ opacity:[0,1,0] }} transition={{ duration:.6,repeat:2 }}/>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Overlay resultado */}
        <AnimatePresence>
          {showResult && lastResult && (
            <DungeonResultOverlay key="res" result={lastResult} players={players} monsterColor={monColor}/>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
