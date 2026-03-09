import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BattleBg } from '../components/BattleBg'
import { AnimatedSprite, AbilityEffect } from '../components/sprites'
import { sfx } from '../sounds'
import { TEAM_COLORS } from '../useRoom'
import { getPlayerAbilities, ABILITY_CHARGES } from '../abilities'

const MAX_HP      = 100
const TIMER_MAX   = 35
const RESULT_SHOW = 2800

// ── HP Bar ────────────────────────────────────────────────────────────────────
function HPBar({ hp, team, maxHp = MAX_HP }) {
  const pct   = Math.max(0, (hp / maxHp) * 100)
  const color = pct > 55 ? TEAM_COLORS[team].main : pct > 25 ? '#f0c040' : '#ff3d5a'
  const low   = pct <= 25
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontFamily:'var(--pixel)', fontSize:7, color:TEAM_COLORS[team].main }}>
          {TEAM_COLORS[team].name.toUpperCase()}
        </span>
        <motion.span style={{ fontFamily:'var(--pixel)', fontSize:7, color }}
          animate={low ? { opacity:[1,.4,1] } : { opacity:1 }}
          transition={{ duration:.6, repeat:low ? Infinity : 0 }}>
          {Math.ceil(hp)}/{maxHp}
        </motion.span>
      </div>
      <div className="hp-bar-wrap" style={{ position:'relative' }}>
        <motion.div className="hp-bar-fill"
          animate={{ width:`${pct}%`, background:color }}
          transition={{ duration:.5, ease:[.16,1,.3,1] }}
          style={{ width:`${pct}%`, background:color, position:'relative', overflow:'hidden' }}>
          {pct > 5 && (
            <div style={{
              position:'absolute', inset:0,
              background:'linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent)',
              animation:'shimmerHP 2s linear infinite',
            }}/>
          )}
        </motion.div>
        {low && (
          <motion.div style={{ position:'absolute', inset:0, borderRadius:3, boxShadow:`0 0 14px ${color}` }}
            animate={{ opacity:[.3,1,.3] }} transition={{ duration:.6, repeat:Infinity }}/>
        )}
      </div>
    </div>
  )
}

// ── Timer circular ────────────────────────────────────────────────────────────
function CircleTimer({ t, max }) {
  const r    = 24
  const circ = 2 * Math.PI * r
  const offset = circ - (t / max) * circ
  const color  = t > max * .5 ? '#3dffc0' : t > max * .25 ? '#f0c040' : '#ff3d5a'
  const crit   = t <= 8
  return (
    <motion.div style={{ position:'relative', width:64, height:64 }}
      animate={crit ? { scale:[1,1.07,1] } : { scale:1 }}
      transition={{ duration:.5, repeat:crit ? Infinity : 0 }}>
      <svg width={64} height={64} viewBox="0 0 64 64" style={{ transform:'rotate(-90deg)' }}>
        <circle cx={32} cy={32} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={5}/>
        <circle cx={32} cy={32} r={r} fill="none"
          stroke={color} strokeWidth={5} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition:'stroke-dashoffset 1s linear, stroke .4s' }}/>
      </svg>
      <div style={{
        position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'var(--pixel)', fontSize: t >= 10 ? 10 : 12, color, transition:'color .4s',
      }}>
        {t}
      </div>
    </motion.div>
  )
}

// ── Panel de habilidades ──────────────────────────────────────────────────────
function AbilityPanel({ player, charges, activeAbility, onUse, disabled }) {
  if (!player) return null
  const abilities = getPlayerAbilities(player.spriteId)
  const remaining = charges?.[player.id] ?? ABILITY_CHARGES

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
        <span style={{ fontFamily:'var(--pixel)', fontSize:6, color:'var(--gray)' }}>HABILIDADES</span>
        <div style={{ display:'flex', gap:3 }}>
          {Array.from({length:ABILITY_CHARGES}).map((_,i) => (
            <div key={i} style={{
              width:7, height:7, borderRadius:'50%',
              background: i < remaining ? '#f0e040' : 'rgba(255,255,255,.12)',
              boxShadow: i < remaining ? '0 0 6px #f0e040' : 'none',
              transition:'all .3s',
            }}/>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:5 }}>
        {abilities.map(ab => {
          const isActive  = activeAbility === ab.id
          const canUse    = !disabled && remaining > 0 && !activeAbility
          return (
            <motion.button key={ab.id}
              whileHover={canUse ? { scale:1.08, y:-2 } : {}}
              whileTap={canUse ? { scale:.94 } : {}}
              onClick={() => canUse && onUse(ab)}
              title={`${ab.name}: ${ab.desc}`}
              style={{
                width:36, height:36, borderRadius:4, border:`2px solid ${isActive ? ab.color : 'rgba(255,255,255,.12)'}`,
                background: isActive ? `${ab.color}22` : 'rgba(255,255,255,.04)',
                cursor: canUse ? 'pointer' : 'not-allowed',
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                opacity: canUse || isActive ? 1 : .38,
                boxShadow: isActive ? `0 0 12px ${ab.color}88` : 'none',
                transition:'all .2s', position:'relative', overflow:'visible',
              }}>
              <span style={{ fontSize:14 }}>{ab.icon}</span>
              {isActive && (
                <motion.div style={{
                  position:'absolute', inset:-4, borderRadius:6, border:`2px solid ${ab.color}`,
                  boxShadow:`0 0 16px ${ab.color}`,
                }}
                  animate={{ opacity:[.6,1,.6] }} transition={{ duration:.6, repeat:Infinity }}/>
              )}
            </motion.button>
          )
        })}
      </div>
      {/* Tooltip de habilidad activa */}
      <AnimatePresence>
        {activeAbility && (
          <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:4}}
            style={{
              padding:'6px 10px', borderRadius:4,
              background:'rgba(0,0,0,.8)', border:`1px solid ${abilities.find(a=>a.id===activeAbility)?.color ?? 'var(--gray)'}44`,
            }}>
            <p style={{ fontFamily:'var(--pixel)', fontSize:6, color:'var(--gold)' }}>
              {abilities.find(a=>a.id===activeAbility)?.name} ACTIVA
            </p>
            <p style={{ fontFamily:'var(--ui)', fontSize:11, color:'var(--gray)', marginTop:2 }}>
              {abilities.find(a=>a.id===activeAbility)?.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Tarjeta de fighter ────────────────────────────────────────────────────────
function FighterCard({ player, team, isActive, isAttacking, isTakingHit, isDefending, onlineAnswered, onlineCorrect, abilityEffect, onAbilityDone }) {
  const tc = TEAM_COLORS[team]
  return (
    <div style={{ textAlign:'center', opacity:isActive ? 1 : .42, position:'relative', transition:'opacity .3s' }}>
      <div style={{ position:'relative', display:'inline-block' }}>
        <AnimatedSprite
          id={player?.spriteId ?? 'knight'} size={6} flip={team === 1}
          isAttacking={isAttacking} isTakingHit={isTakingHit}
          isDefending={isDefending} idleDelay={team * .6}
        />
        {/* Efecto de habilidad */}
        <AnimatePresence>
          {abilityEffect && <AbilityEffect key={abilityEffect} type={abilityEffect} color={tc.main} onDone={onAbilityDone ?? (() => {})} />}
        </AnimatePresence>
      </div>

      {/* Badge online */}
      {onlineAnswered !== undefined && (
        <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
          style={{
            position:'absolute', top:-6, right:-8,
            width:20, height:20, borderRadius:'50%',
            background: onlineAnswered ? (onlineCorrect ? '#3dffc0' : '#ff3d5a') : 'rgba(255,255,255,.12)',
            border:'2px solid rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'var(--pixel)', fontSize:8,
          }}>
          {onlineAnswered ? (onlineCorrect ? '✓' : '✗') : '·'}
        </motion.div>
      )}

      <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:isActive ? tc.main : 'var(--gray)', marginTop:6 }}>
        {player?.name ?? '???'}
      </p>
      <AnimatePresence>
        {isActive && (
          <motion.span className="tag tag-blue"
            style={{ marginTop:4, fontSize:6, background:`${tc.main}22`, color:tc.main, borderColor:tc.main, display:'inline-block' }}
            initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            ▶ TURNO
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Overlay de resultado ──────────────────────────────────────────────────────
function ResultOverlay({ result, isOnline, players }) {
  if (!result) return null

  if (isOnline) {
    const { correctA, correctB, dmgA, dmgB, bothCorrect, ptsA = 0, ptsB = 0 } = result
    return (
      <motion.div
        initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.8}}
        transition={{type:'spring',stiffness:280,damping:18}}
        style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, pointerEvents:'none' }}>
        <div className="card" style={{
          padding:'22px 32px', textAlign:'center', maxWidth:320,
          background: bothCorrect ? 'rgba(5,25,15,.97)' : 'rgba(8,8,24,.97)',
          border:`3px solid ${bothCorrect ? 'var(--green)' : 'rgba(255,255,255,.18)'}`,
          boxShadow: bothCorrect ? '0 0 30px rgba(61,255,192,.3)' : '0 0 30px rgba(0,0,0,.7)',
        }}>
          <motion.p style={{ fontSize:30, marginBottom:10 }}
            animate={{ scale:[1,1.2,1] }} transition={{ duration:.4 }}>
            {bothCorrect ? '🛡🛡' : result.bothWrong ? '💥💥' : '⚔'}
          </motion.p>
          <p style={{ fontFamily:'var(--pixel)', fontSize:9, color: bothCorrect ? 'var(--green)' : 'var(--light)', marginBottom:14 }}>
            {bothCorrect ? '¡AMBOS CORRECTOS!' : result.bothWrong ? 'AMBOS FALLAN' : '¡RESULTADOS!'}
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[
              { label:TEAM_COLORS[0].name, correct:correctA, dmg:dmgA, pts:ptsA, col:TEAM_COLORS[0].main },
              { label:TEAM_COLORS[1].name, correct:correctB, dmg:dmgB, pts:ptsB, col:TEAM_COLORS[1].main },
            ].map((t, i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <p style={{ fontFamily:'var(--pixel)', fontSize:6, color:t.col, marginBottom:4 }}>{t.label}</p>
                <p style={{ fontSize:22 }}>{t.correct ? '✅' : '❌'}</p>
                {t.dmg > 0 && (
                  <motion.p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--red)', marginTop:4 }}
                    initial={{y:-8,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.1+i*.1}}>
                    -{t.dmg} HP
                  </motion.p>
                )}
                {t.pts > 0 && (
                  <motion.p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--green)', marginTop:2 }}
                    initial={{y:-6,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.15+i*.1}}>
                    +{t.pts} pts
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  const ok = result.correct
  const playerName = players?.find(p => p.id === result.answeredBy)?.name ?? ''
  return (
    <motion.div
      initial={{opacity:0,scale:.7,y:-20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.8,y:20}}
      transition={{type:'spring',stiffness:280,damping:18}}
      style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, pointerEvents:'none' }}>
      <div style={{
        padding:'28px 40px', textAlign:'center', borderRadius:8,
        background: ok ? 'rgba(5,25,15,.97)' : 'rgba(28,8,12,.97)',
        border:`3px solid ${ok ? 'var(--green)' : 'var(--red)'}`,
        boxShadow:`0 0 40px ${ok ? 'rgba(61,255,192,.35)' : 'rgba(255,61,90,.35)'}`,
      }}>
        <motion.p style={{ fontSize:36, marginBottom:10 }}
          animate={{rotate:[-5,5,-3,3,0], scale:[1,1.2,1]}} transition={{duration:.5}}>
          {ok ? '✅' : '❌'}
        </motion.p>
        {playerName && <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', marginBottom:6 }}>{playerName}</p>}
        <p style={{ fontFamily:'var(--pixel)', fontSize:13, color:ok ? 'var(--green)' : 'var(--red)', marginBottom:ok?0:10 }}>
          {ok ? '¡CORRECTO!' : '¡INCORRECTO!'}
        </p>
        {ok && result.pts > 0 && (
          <motion.p style={{ fontFamily:'var(--pixel)', fontSize:9, color:'var(--gold)' }}
            initial={{scale:0}} animate={{scale:[0,1.3,1]}}>+{result.pts} PTS</motion.p>
        )}
        {!ok && result.dmg > 0 && (
          <motion.p style={{ fontFamily:'var(--pixel)', fontSize:9, color:'var(--red)' }}
            initial={{x:-10,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:.15}}>
            -{result.dmg} HP → {TEAM_COLORS[result.defenderTeam]?.name}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

// ── BattleScreen principal ────────────────────────────────────────────────────
export default function BattleScreen({
  game, players, myPlayerId, isHost, isOnline,
  onAnswer, onNextQuestion,
}) {
  const {
    currentQ, hp, lastResult, currentFighters,
    round, totalRounds, winner,
    currentTurn,
    roundAnswers,
    isSuddenDeath,
    abilityCharges: remoteCharges,  // online: cargas sincronizadas
  } = game ?? {}

  // UI state
  const [timeLeft,      setTimeLeft]      = useState(TIMER_MAX)
  const [answered,      setAnswered]      = useState(false)
  const [showResult,    setShowResult]    = useState(false)
  const [attackingTeam, setAttackingTeam] = useState(null)
  const [hittingTeam,   setHittingTeam]   = useState(null)
  const [defendingTeam, setDefendingTeam] = useState(null)

  // Habilidades — estado local del jugador actual
  const [localCharges,   setLocalCharges]   = useState({})  // { [playerId]: número }
  const [activeAbility,  setActiveAbility]  = useState(null) // id de habilidad seleccionada
  const [hiddenOptions,  setHiddenOptions]  = useState([])   // índices de opciones ocultas (50/50)
  const [revealCorrect,  setRevealCorrect]  = useState(false) // revelar respuesta
  const [shieldActive,   setShieldActive]   = useState(false) // escudo activo
  const [doubleActive,   setDoubleActive]   = useState(false) // doble apuesta activa
  const [sabotageActive, setSabotageActive] = useState(false) // sabotaje activo
  const [abilityFxTeamA, setAbilityFxTeamA] = useState(null)  // efecto visual team A
  const [abilityFxTeamB, setAbilityFxTeamB] = useState(null)  // efecto visual team B

  const timerRef       = useRef(null)
  const currentQIdRef  = useRef(null)
  const resultShownRef = useRef(null)
  const teamCallRef    = useRef(false)  // para "llamar aliado"

  // Inicializar cargas locales cuando entran jugadores
  useEffect(() => {
    if (players.length > 0 && Object.keys(localCharges).length === 0) {
      const init = Object.fromEntries(players.map(p => [p.id, ABILITY_CHARGES]))
      setLocalCharges(init)
    }
  }, [players])

  const charges = isOnline ? (remoteCharges ?? {}) : localCharges

  // ── Determinar si YO puedo responder ──────────────────────────────────────
  const me     = players.find(p => p.id === myPlayerId)
  const myTeam = me?.team ?? null
  const mySide = myTeam === 0 ? 'teamA' : 'teamB'

  const localActiveFighterId = currentTurn === 1 ? currentFighters?.teamB : currentFighters?.teamA
  const myActiveFighterId    = myTeam === 0 ? currentFighters?.teamA : currentFighters?.teamB
  const iAmActiveFighter     = myPlayerId === myActiveFighterId

  const iAlreadyAnswered = isOnline
    ? roundAnswers?.[mySide] !== null && roundAnswers?.[mySide] !== undefined
    : answered

  const canAnswer = !answered && !showResult && (
    isOnline
      ? iAmActiveFighter && !iAlreadyAnswered
      : myPlayerId === null || myPlayerId === localActiveFighterId
  )

  // ── Reiniciar UI por nueva pregunta ───────────────────────────────────────
  useEffect(() => {
    if (!currentQ?.id) return
    if (currentQ.id === currentQIdRef.current) return
    currentQIdRef.current = currentQ.id
    setAnswered(false)
    setShowResult(false)
    setTimeLeft(TIMER_MAX)
    setHiddenOptions([])
    setRevealCorrect(false)
    setActiveAbility(null)
    setShieldActive(false)
    setDoubleActive(false)
    setSabotageActive(false)
    teamCallRef.current = false
  }, [currentQ?.id])

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (showResult || winner || iAlreadyAnswered) {
      clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          if (canAnswer) {
            setAnswered(true)
            // Si escudo activo al timeout: no recibe daño
            onAnswer(false, { shield: shieldActive, double: doubleActive, sabotage: sabotageActive })
          }
          return 0
        }
        if (t <= 5)  sfx.tickFinal?.()
        else if (t <= 10) sfx.tick?.()
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ?.id, showResult, iAlreadyAnswered, winner])

  // ── Detectar lastResult nuevo ─────────────────────────────────────────────
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
    if (!canAnswer && ability.effect !== 'sabotage') return

    const pid = myPlayerId ?? localActiveFighterId
    if ((charges[pid] ?? 0) <= 0) return

    // Descontar carga
    if (isOnline) {
      // En online se pasaría al servidor; por ahora solo local para el jugador
      // onUseAbility(ability) — TODO online
    } else {
      setLocalCharges(c => ({ ...c, [pid]: Math.max(0, (c[pid] ?? 0) - 1) }))
    }

    setActiveAbility(ability.id)

    switch(ability.effect) {
      case 'fifty': {
        const wrongs = currentQ.options.map((o,i) => o.correct ? -1 : i).filter(i => i >= 0)
        const toHide = wrongs.sort(() => Math.random()-.5).slice(0, 2)
        setHiddenOptions(toHide)
        // Efecto visual — se limpia automáticamente via onDone en AbilityEffect
        const teamIdx = myTeam ?? 0
        teamIdx === 0 ? setAbilityFxTeamA('fifty') : setAbilityFxTeamB('fifty')
        sfx.correct?.()
        break
      }
      case 'shield': {
        setShieldActive(true)
        const teamIdx = myTeam ?? 0
        teamIdx === 0 ? setAbilityFxTeamA('shield') : setAbilityFxTeamB('shield')
        sfx.defend?.()
        break
      }
      case 'double': {
        setDoubleActive(true)
        sfx.roundStart?.()
        break
      }
      case 'reveal': {
        setRevealCorrect(true)
        setTimeout(() => setRevealCorrect(false), 3000)
        sfx.question?.()
        break
      }
      case 'sabotage': {
        setSabotageActive(true)
        const teamIdx = myTeam ?? 0
        const enemyTeam = teamIdx === 0 ? 1 : 0
        enemyTeam === 0 ? setAbilityFxTeamA('shield') : setAbilityFxTeamB('shield')
        sfx.attack?.()
        break
      }
      case 'teamup': {
        // "Llamar aliado": pasar el turno al siguiente compañero
        teamCallRef.current = true
        const teamPlayers = players.filter(p => p.team === (myTeam ?? 0) && p.id !== pid)
        if (teamPlayers.length > 0) {
          const teamIdx = myTeam ?? 0
          teamIdx === 0 ? setAbilityFxTeamA('teamup') : setAbilityFxTeamB('teamup')
          sfx.join?.()
          // En local simplemente se resetea el answered para que responda el compañero
          // (lógica simplificada: el jugador aliado pasa a ser el activo temporalmente)
        }
        break
      }
    }
  }, [canAnswer, currentQ, charges, myPlayerId, localActiveFighterId, myTeam, isOnline, players])

  // ── Responder ─────────────────────────────────────────────────────────────
  const handleAnswer = useCallback((correct) => {
    if (!canAnswer) return
    clearInterval(timerRef.current)
    setAnswered(true)
    correct ? sfx.correct?.() : sfx.wrong?.()
    onAnswer(correct, { shield: shieldActive, double: doubleActive, sabotage: sabotageActive })
  }, [canAnswer, onAnswer, shieldActive, doubleActive, sabotageActive])

  // ── Animación de resultado ────────────────────────────────────────────────
  function triggerResultAnim(result) {
    if (!result) return
    setShowResult(true)
    clearInterval(timerRef.current)

    const atkTeam = result.attackerTeam ?? null
    if (atkTeam !== null && atkTeam !== undefined) {
      setAttackingTeam(atkTeam)
      sfx.attack?.()
      setTimeout(() => {
        setHittingTeam(atkTeam === 0 ? 1 : 0)
        sfx.hit?.()
      }, 500)
      setTimeout(() => { setAttackingTeam(null); setHittingTeam(null) }, 920)
    }

    if (isOnline) {
      if (result.correctA) { setDefendingTeam(0); setTimeout(() => setDefendingTeam(null), 960) }
      if (result.correctB) { setDefendingTeam(1); setTimeout(() => setDefendingTeam(null), 960) }
    } else if (result.correct) {
      setDefendingTeam(result.defenderTeam ?? (result.answererTeam === 0 ? 1 : 0))
      setTimeout(() => setDefendingTeam(null), 960)
    }

    if (isHost || !isOnline) {
      setTimeout(() => {
        setShowResult(false)
        onNextQuestion()
      }, RESULT_SHOW)
    }
  }

  if (!currentQ) return null

  const hpA = hp?.[0] ?? MAX_HP
  const hpB = hp?.[1] ?? MAX_HP

  const onlineAAnswered = roundAnswers?.teamA !== null && roundAnswers?.teamA !== undefined
  const onlineBAnswered = roundAnswers?.teamB !== null && roundAnswers?.teamB !== undefined
  const waitingForTeam  = isOnline && !showResult
    ? (onlineAAnswered && !onlineBAnswered) ? TEAM_COLORS[1].name
    : (!onlineAAnswered && onlineBAnswered) ? TEAM_COLORS[0].name
    : null
    : null

  const localTurnTeam = currentTurn === 1 ? 1 : 0

  // Fighter activo local (el que tiene el turno ahora)
  const localActiveFighter = players.find(p => p.id === localActiveFighterId)

  // Jugador del panel de habilidades (local: quien tiene el turno; online: yo mismo)
  const abilityPlayer = isOnline ? me : localActiveFighter

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', position:'relative' }}>
      <BattleBg variant="battle"/>

      <div style={{
        position:'relative', zIndex:1, flex:1, display:'flex', flexDirection:'column',
        padding:'14px 18px', gap:10, maxWidth:760, margin:'0 auto', width:'100%',
      }}>

        {/* HP bars */}
        <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}}
          style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:14, alignItems:'center' }}>
          <HPBar hp={hpA} team={0}/>
          <span style={{ fontFamily:'var(--pixel)', fontSize:9, color:'var(--gray)' }}>VS</span>
          <HPBar hp={hpB} team={1}/>
        </motion.div>

        {/* Badges */}
        <div style={{ textAlign:'center', display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
          <span className="tag tag-gold">RONDA {round} / {isSuddenDeath ? '∞' : totalRounds}</span>
          {isSuddenDeath && (
            <motion.span className="tag tag-red"
              animate={{ opacity:[1,.6,1] }} transition={{ duration:.8, repeat:Infinity }}>
              💀 MUERTE SÚBITA
            </motion.span>
          )}
          {!isOnline && (
            <span className={`tag ${localTurnTeam === 0 ? 'tag-blue' : 'tag-red'}`}>
              ⚔ TURNO: {TEAM_COLORS[localTurnTeam].name.toUpperCase()}
            </span>
          )}
          {isOnline && <span className="tag tag-purple">⚡ RESPUESTA SIMULTÁNEA</span>}
          {sabotageActive && (
            <motion.span className="tag tag-red" animate={{ opacity:[1,.7,1] }} transition={{ duration:.5, repeat:Infinity }}>
              💀 SABOTAJE ACTIVO
            </motion.span>
          )}
          {doubleActive && (
            <motion.span className="tag tag-gold" animate={{ opacity:[1,.7,1] }} transition={{ duration:.6, repeat:Infinity }}>
              🎯 DOBLE APUESTA
            </motion.span>
          )}
        </div>

        {/* Arena */}
        <div style={{ display:'flex', justifyContent:'space-around', alignItems:'flex-end', minHeight:155, position:'relative' }}>
          <div style={{ position:'absolute', bottom:0, left:'5%', right:'5%', height:3,
            background:'linear-gradient(90deg,transparent,rgba(74,144,217,.3),transparent)' }}/>

          {/* Team A */}
          <div style={{ display:'flex', gap:8 }}>
            {players.filter(p=>p.team===0).map((p,i) => (
              <FighterCard key={p.id} player={p} team={0}
                isActive={p.id === currentFighters?.teamA}
                isAttacking={attackingTeam === 0 && p.id === currentFighters?.teamA}
                isTakingHit={hittingTeam === 0 && p.id === currentFighters?.teamA}
                isDefending={defendingTeam === 0 && p.id === currentFighters?.teamA}
                onlineAnswered={isOnline ? onlineAAnswered : undefined}
                onlineCorrect={isOnline ? roundAnswers?.teamA : undefined}
                abilityEffect={abilityFxTeamA && p.id === currentFighters?.teamA ? abilityFxTeamA : null}
                onAbilityDone={() => setAbilityFxTeamA(null)}
              />
            ))}
          </div>

          {/* Timer central */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}>
            <CircleTimer t={timeLeft} max={TIMER_MAX}/>
          </div>

          {/* Team B */}
          <div style={{ display:'flex', gap:8 }}>
            {players.filter(p=>p.team===1).map((p,i) => (
              <FighterCard key={p.id} player={p} team={1}
                isActive={p.id === currentFighters?.teamB}
                isAttacking={attackingTeam === 1 && p.id === currentFighters?.teamB}
                isTakingHit={hittingTeam === 1 && p.id === currentFighters?.teamB}
                isDefending={defendingTeam === 1 && p.id === currentFighters?.teamB}
                onlineAnswered={isOnline ? onlineBAnswered : undefined}
                onlineCorrect={isOnline ? roundAnswers?.teamB : undefined}
                abilityEffect={abilityFxTeamB && p.id === currentFighters?.teamB ? abilityFxTeamB : null}
                onAbilityDone={() => setAbilityFxTeamB(null)}
              />
            ))}
          </div>
        </div>

        {/* Panel de habilidades */}
        {(canAnswer || (isOnline && iAmActiveFighter)) && abilityPlayer && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="card"
            style={{ padding:'10px 14px', background:'rgba(0,0,0,.45)' }}>
            <AbilityPanel
              player={abilityPlayer}
              charges={charges}
              activeAbility={activeAbility}
              onUse={handleUseAbility}
              disabled={!canAnswer || answered || showResult}
            />
          </motion.div>
        )}

        {/* Pregunta */}
        <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--blue)', textAlign:'center' }}>
          📚 {currentQ.topic}
        </p>

        <motion.div key={currentQ.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
          className="card" style={{ padding:'16px 18px', flex:1, position:'relative' }}>

          {/* Estado */}
          <div style={{ marginBottom:10, textAlign:'center' }}>
            {isOnline ? (
              !iAmActiveFighter ? (
                <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)' }}>
                  👁 No eres el fighter activo este turno
                </p>
              ) : iAlreadyAnswered ? (
                <motion.p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gold)' }}
                  animate={{ opacity:[1,.5,1] }} transition={{ duration:1, repeat:Infinity }}>
                  ✓ Respondido — {waitingForTeam ? `Esperando a ${waitingForTeam}…` : '¡Procesando!'}
                </motion.p>
              ) : (
                <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--green)' }}>
                  ⚡ ¡Responde ahora! — simultáneo con el rival
                </p>
              )
            ) : (
              <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:TEAM_COLORS[localTurnTeam].main }}>
                🎯 Responde: <b>{localActiveFighter?.name ?? TEAM_COLORS[localTurnTeam].name}</b>
                {doubleActive && <span style={{ color:'#f0e040' }}> — 🎯 DOBLE</span>}
              </p>
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
              if (hidden) { bg = 'rgba(255,255,255,.01)'; border = '2px solid rgba(255,255,255,.03)'; txtCol = 'transparent' }
              else if (revealCorrect && opt.correct) { bg='rgba(255,200,0,.1)'; border='2px solid #f0e040'; txtCol='#f0e040' }
              else if (revealed) {
                if (opt.correct) { bg='rgba(61,255,192,.16)'; border='2px solid var(--green)'; txtCol='var(--green)' }
                else             { bg='rgba(255,61,90,.09)';  border='2px solid rgba(255,61,90,.22)'; txtCol='var(--gray)' }
              }
              return (
                <motion.button key={i}
                  initial={{opacity:0,y:8}} animate={{opacity:hidden ? .2 : 1, y:0}} transition={{delay:i*.06}}
                  whileHover={clickable ? {scale:1.025,background:'rgba(74,144,217,.18)',borderColor:'var(--blue)'} : {}}
                  whileTap={clickable ? {scale:.96} : {}}
                  onClick={() => clickable && handleAnswer(opt.correct)}
                  style={{
                    background:bg, border, borderRadius:4, padding:'11px 13px',
                    cursor:clickable?'pointer':'default', textAlign:'left', color:txtCol,
                    fontFamily:'var(--ui)', fontSize:13, lineHeight:1.4,
                    transition:'all .18s', position:'relative', overflow:'hidden',
                    opacity: (!canAnswer && !revealed && !iAlreadyAnswered) ? .5 : undefined,
                    pointerEvents: hidden ? 'none' : undefined,
                  }}>
                  <span style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--gray)', display:'block', marginBottom:4 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {hidden ? '—' : opt.text}
                  {revealed && opt.correct && (
                    <motion.div style={{ position:'absolute', inset:0, borderRadius:4, background:'rgba(61,255,192,.08)' }}
                      animate={{ opacity:[0,1,0] }} transition={{ duration:.6, repeat:2 }}/>
                  )}
                </motion.button>
              )
            })}
          </div>

          {isOnline && iAlreadyAnswered && !showResult && waitingForTeam && (
            <motion.div style={{ marginTop:12, padding:'10px 14px', borderRadius:4,
              background:'rgba(74,144,217,.07)', border:'1px solid rgba(74,144,217,.2)' }}
              animate={{ opacity:[.7,1,.7] }} transition={{ duration:1.5, repeat:Infinity }}>
              <p style={{ fontFamily:'var(--pixel)', fontSize:7, color:'var(--blue)', textAlign:'center' }}>
                ⌛ Esperando respuesta de {waitingForTeam}…
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Overlay resultado */}
        <AnimatePresence>
          {showResult && lastResult && (
            <ResultOverlay key="res" result={lastResult} isOnline={isOnline} players={players}/>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
