import { useState } from 'react'
import styles from './VoteScreen.module.css'

export default function VoteScreen({ players, onSubmit }) {
  // votes: { voterId: targetId | null }
  const [votes, setVotes]         = useState(() =>
    Object.fromEntries(players.map(p => [p.id, null]))
  )
  const [currentVoterIdx, setCurrentVoterIdx] = useState(0)
  const [phase, setPhase]  = useState('waiting') // waiting | voting | done
  const [selected, setSelected] = useState(null)

  const currentVoter = players[currentVoterIdx]
  const allVoted = Object.values(votes).every(v => v !== null)

  const handleSelectTarget = (targetId) => {
    if (targetId === currentVoter.id) return // no puedes votarte
    setSelected(targetId)
  }

  const handleConfirmVote = () => {
    if (!selected) return
    const newVotes = { ...votes, [currentVoter.id]: selected }
    setVotes(newVotes)
    setSelected(null)

    if (currentVoterIdx < players.length - 1) {
      setCurrentVoterIdx(i => i + 1)
      setPhase('waiting')
    } else {
      onSubmit(newVotes)
    }
  }

  const handleStartVoting = () => setPhase('voting')

  return (
    <div className={styles.root}>
      <div className={styles.bg} />

      <div className={styles.inner}>
        <div className={styles.header}>
          <span className="tag tag-red">🗳️ Votación</span>
          <div className={styles.voterFlow}>
            {players.map((p, i) => (
              <div key={p.id} className={`${styles.voterDot}
                ${i < currentVoterIdx ? styles.dotDone : ''}
                ${i === currentVoterIdx ? styles.dotActive : ''}`}
                style={i === currentVoterIdx ? { borderColor: p.color.bg } : {}}>
                {i < currentVoterIdx ? '✓' : i + 1}
              </div>
            ))}
          </div>
        </div>

        <h2 className={styles.title}>
          ¿Quién es el<br />
          <span className={styles.titleAccent}>impostor?</span>
        </h2>

        {/* Turno de votación */}
        <div className={styles.voterCard}
          style={{ borderColor: currentVoter?.color.bg }}>
          <div className={styles.voterLabel}>Está votando</div>
          <div className={styles.voterAvatar}
            style={{ background: currentVoter?.color.bg }}>
            {currentVoter?.name[0].toUpperCase()}
          </div>
          <div className={styles.voterName}
            style={{ color: currentVoter?.color.bg }}>
            {currentVoter?.name}
          </div>
        </div>

        {phase === 'waiting' ? (
          <button className="btn btn-primary btn-lg" style={{ width: '100%' }}
            onClick={handleStartVoting}>
            Soy {currentVoter?.name} — Votar
          </button>
        ) : (
          <>
            <div className={styles.selectLabel}>
              Selecciona al sospechoso ({currentVoter?.name}):
            </div>
            <div className={styles.candidates}>
              {players.filter(p => p.id !== currentVoter.id).map(p => (
                <button key={p.id}
                  className={`${styles.candidateBtn} ${selected === p.id ? styles.candidateSelected : ''}`}
                  style={selected === p.id ? { borderColor: '#ff3d5a', background: 'rgba(255,61,90,0.1)' } : {}}
                  onClick={() => handleSelectTarget(p.id)}>
                  <div className={styles.candAvatar} style={{ background: p.color.bg }}>
                    {p.name[0].toUpperCase()}
                  </div>
                  <span className={styles.candName}>{p.name}</span>
                  {selected === p.id && <span className={styles.candCheck}>☑</span>}
                </button>
              ))}
            </div>

            <button className="btn btn-danger btn-lg" style={{ width: '100%' }}
              disabled={!selected} onClick={handleConfirmVote}>
              Confirmar voto contra {selected ? players.find(p => p.id === selected)?.name : '...'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
