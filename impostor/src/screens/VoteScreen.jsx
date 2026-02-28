import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBg from '../AnimatedBg'
import { sfx } from '../sounds'
import s from './VoteScreen.module.css'

export default function VoteScreen({ players, onSubmit }) {
  const [votes, setVotes] = useState(() => Object.fromEntries(players.map(p=>[p.id,null])))
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState('waiting')
  const [sel, setSel] = useState(null)
  const voter = players[idx]

  const startVoting = () => { sfx.vote(); setPhase('voting') }
  const select = id => { if (id===voter.id) return; setSel(id) }
  const confirm = () => {
    if (!sel) return
    sfx.voteConfirm()
    const nv = { ...votes, [voter.id]: sel }
    setVotes(nv); setSel(null)
    if (idx < players.length-1) { setIdx(i=>i+1); setPhase('waiting') }
    else onSubmit(nv)
  }

  return (
    <div className={s.root}>
      <AnimatedBg theme="vote"/>
      <div className={s.inner}>

        {/* Header */}
        <motion.div className={s.header} initial={{ opacity:0,y:-14 }} animate={{ opacity:1,y:0 }}>
          <span className="tag tag-red">🗳️ Votación</span>
          <div className={s.flow}>
            {players.map((p,i)=>(
              <motion.div key={p.id}
                className={`${s.flowDot} ${i<idx?s.done:''} ${i===idx?s.active:''}`}
                style={i===idx?{borderColor:p.color.bg,background:`${p.color.bg}22`}:{}}
                animate={i===idx?{scale:[1,1.15,1]}:{}} transition={{ duration:1.2,repeat:Infinity }}>
                {i<idx?'✓':i+1}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.h2 className={`${s.title} glitch`} data-g="¿Quién es el impostor?"
          initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:.1 }}>
          ¿Quién es el <span style={{ color:'#ff3d5a' }}>impostor?</span>
        </motion.h2>

        {/* Carta del votante */}
        <AnimatePresence mode="wait">
          <motion.div key={idx} className={s.voterCard} style={{ borderColor:voter?.color.bg }}
            initial={{ opacity:0,x:55,scale:.92 }}
            animate={{ opacity:1,x:0,scale:1 }}
            exit={{ opacity:0,x:-55,scale:.92 }}
            transition={{ duration:.4,ease:[.16,1,.3,1] }}>
            <span className={s.corner} style={{ top:8,left:10,color:voter?.color.bg }}>◆</span>
            <div className={s.voterLbl}>Está votando</div>
            <motion.div className={s.voterAv} style={{ background:voter?.color.bg }}
              animate={{ boxShadow:[`0 0 0 ${voter?.color.bg}00`,`0 0 28px ${voter?.color.bg}88`,`0 0 0 ${voter?.color.bg}00`] }}
              transition={{ duration:2,repeat:Infinity }}>
              {voter?.name[0].toUpperCase()}
            </motion.div>
            <div className={`${s.voterName} glitch`} data-g={voter?.name} style={{ color:voter?.color.bg }}>
              {voter?.name}
            </div>
            <span className={s.corner} style={{ bottom:8,right:10,color:voter?.color.bg,transform:'rotate(180deg)' }}>◆</span>
          </motion.div>
        </AnimatePresence>

        {/* Fase */}
        <AnimatePresence mode="wait">
          {phase === 'waiting' ? (
            <motion.button key="w" className="btn btn-primary btn-lg" style={{ width:'100%' }}
              onClick={startVoting}
              initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
              Soy {voter?.name} — Votar ahora
            </motion.button>
          ) : (
            <motion.div key="v" className={s.voteSec}
              initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
              <div className={s.selLbl}>Selecciona al sospechoso:</div>

              <div className={s.candidates}>
                {players.filter(p=>p.id!==voter.id).map((p,i)=>(
                  <motion.button key={p.id}
                    className={`${s.cand} ${sel===p.id?s.candSel:''}`}
                    style={sel===p.id
                      ?{borderColor:'#ff3d5a',background:'rgba(255,61,90,.08)',boxShadow:'0 0 18px rgba(255,61,90,.22)'}
                      :{borderColor:`${p.color.bg}33`}}
                    onClick={()=>select(p.id)}
                    initial={{ opacity:0,x:-18 }} animate={{ opacity:1,x:0 }}
                    transition={{ delay:i*.06 }}
                    whileHover={{ x:4,borderColor:'#ff3d5a99' }}
                    whileTap={{ scale:.98 }}>
                    <span className={s.cCorner} style={{ color:p.color.bg }}>◆</span>
                    <div className={s.cAv} style={{ background:p.color.bg }}>{p.name[0].toUpperCase()}</div>
                    <div className={`${s.cName} glitch`} data-g={p.name}>{p.name}</div>
                    <AnimatePresence>
                      {sel===p.id && (
                        <motion.span className={s.cCheck}
                          initial={{ scale:0,rotate:-30 }} animate={{ scale:1,rotate:0 }} exit={{ scale:0 }}>
                          ☑
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>

              <motion.button className="btn btn-danger btn-lg" style={{ width:'100%' }}
                disabled={!sel} onClick={confirm}
                animate={sel?{boxShadow:['0 4px 0 #8a0018','0 4px 22px rgba(255,61,90,.4)','0 4px 0 #8a0018']}:{}}
                transition={{ duration:1.2,repeat:sel?Infinity:0 }}
                whileHover={sel?{scale:1.03}:{}} whileTap={sel?{scale:.97}:{}}>
                {sel?`Votar contra ${players.find(p=>p.id===sel)?.name} →`:'Selecciona un sospechoso'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
