import { useState } from 'react'
import { motion } from 'framer-motion'
import { BattleBg } from '../components/BattleBg'
import { sfx } from '../sounds'

export default function OnlineSetupScreen({
  chapterId, chapterName, onBack,
  onCreateRoom, onJoinRoom, loading, error,
}) {
  const [tab,  setTab]  = useState('create')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  const create = () => {
    if (name.trim().length < 2) return
    sfx.ready()
    onCreateRoom(name.trim(), chapterId)
  }
  const join = () => {
    if (name.trim().length < 2 || code.length < 6) return
    sfx.ready()
    onJoinRoom(code.toUpperCase(), name.trim())
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative' }}>
      <BattleBg variant="lobby" />
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:440 }}>

        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} style={{ textAlign:'center', marginBottom:28 }}>
          <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--gray)', marginBottom:6 }}>{chapterName}</p>
          <h2 style={{ fontFamily:'var(--pixel)', fontSize:13, color:'var(--gold)' }}>MODO ONLINE</h2>
        </motion.div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:20 }}>
          {['create','join'].map(t => (
            <button key={t} onClick={() => { setTab(t); sfx.click() }}
              className={`btn ${tab===t ? 'btn-blue' : 'btn-ghost'}`}
              style={{ flex:1 }}>
              {t==='create' ? '⚔ CREAR SALA' : '🔗 UNIRSE'}
            </button>
          ))}
        </div>

        <motion.div className="card" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.15}}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--light)', display:'block', marginBottom:8 }}>
              TU NOMBRE
            </label>
            <input className="pixel-input" placeholder="Nombre del jugador" value={name}
              onChange={e=>setName(e.target.value)} maxLength={14}
              onKeyDown={e=>e.key==='Enter' && (tab==='create' ? create() : join())} />
          </div>

          {tab === 'join' && (
            <div style={{ marginBottom:14 }}>
              <label style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--light)', display:'block', marginBottom:8 }}>
                CÓDIGO DE SALA
              </label>
              <input className="pixel-input" placeholder="XXXXXX" value={code} maxLength={6}
                onChange={e=>setCode(e.target.value.toUpperCase())}
                style={{ textTransform:'uppercase', letterSpacing:6, fontSize:18, textAlign:'center' }}
                onKeyDown={e=>e.key==='Enter' && join()} />
            </div>
          )}

          {error && (
            <p style={{ fontFamily:'var(--pixel)', fontSize:8, color:'var(--red)', marginBottom:12 }}>{error}</p>
          )}

          <button className="btn btn-blue" disabled={loading}
            onClick={tab==='create' ? create : join}
            style={{ width:'100%', opacity: loading ? .5 : 1 }}>
            {loading ? '...' : tab==='create' ? '⚔ CREAR' : '🔗 UNIRSE'}
          </button>
        </motion.div>

        <button className="btn btn-ghost" onClick={onBack} style={{ width:'100%', marginTop:12 }}>
          ← VOLVER
        </button>
      </div>
    </div>
  )
}
