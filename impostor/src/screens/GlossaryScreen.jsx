import { motion } from 'framer-motion'
import AnimatedBg from '../AnimatedBg'
import s from './GlossaryScreen.module.css'

export default function GlossaryScreen({ chapter, onRestart, playedConcepts }) {
  const sections = playedConcepts ?? chapter.rounds.map((r,i)=>({
    roundNum:i+1, topic:r.topic, concepts:r.concepts,
  }))

  return (
    <div className={s.root}>
      <AnimatedBg theme="glossary"/>
      <div className={s.inner}>

        {/* Header */}
        <motion.div className={s.header}
          initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }}
          transition={{ ease:[.16,1,.3,1] }}>
          <span className="tag tag-purple">📚 Trasfondo académico</span>
          <h2 className={`${s.title} glitch`} data-g="Lo que aprendimos">Lo que aprendimos</h2>
          <p className={s.sub}>
            Conceptos de <strong>{chapter.name}</strong> vistos en esta partida,
            incluyendo el concepto infiltrado de cada ronda.
          </p>
        </motion.div>

        {/* Rondas */}
        {sections.map((sec,ri)=>(
          <motion.div key={ri} className={s.roundSec}
            initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
            transition={{ delay:.1+ri*.08,ease:[.16,1,.3,1] }}>
            <div className={s.roundHdr}>
              <div className={s.roundTag}>Ronda {sec.roundNum}</div>
              <div className={s.roundTopic}>{sec.topic}</div>
            </div>
            <div className={s.conceptGrid}>
              {sec.concepts.map((c,ci)=>(
                <motion.div key={c.id}
                  className={`${s.conceptCard} ${c.fake?s.fakeCard:''}`}
                  initial={{ opacity:0,scale:.92 }} animate={{ opacity:1,scale:1 }}
                  transition={{ delay:.15+ri*.08+ci*.05 }}
                  whileHover={{ y:-4,transition:{ duration:.2 } }}>
                  {/* Esquinas carta */}
                  <span className={s.corner} style={{ top:8,left:10,color:c.fake?'#ff3d5a':'rgba(255,255,255,.2)' }}>◆</span>
                  <span className={s.corner} style={{ bottom:8,right:10,color:c.fake?'#ff3d5a':'rgba(255,255,255,.2)',transform:'rotate(180deg)' }}>◆</span>
                  {c.fake&&(
                    <div className={s.fakeBanner}>🎭 Concepto INFILTRADO</div>
                  )}
                  <div className={s.cName}>
                    <span className={c.fake?`glitch ${s.cNameAccent}`:''}
                      data-g={c.fake?c.name:undefined} style={c.fake?{color:'#ff3d5a'}:{}}>
                      {c.name}
                    </span>
                    {c.fake&&<span className="tag tag-red" style={{ fontSize:'.55rem' }}>FALSO</span>}
                  </div>
                  <div className={s.cDivider}>
                    <div className={s.cDLine} style={{ background:c.fake?'#ff3d5a':'rgba(255,255,255,.1)' }}/>
                    <span style={{ color:c.fake?'#ff3d5a':'rgba(255,255,255,.15)',fontSize:'.45rem' }}>◆</span>
                    <div className={s.cDLine} style={{ background:c.fake?'#ff3d5a':'rgba(255,255,255,.1)' }}/>
                  </div>
                  <div className={s.cDef}>{c.definition}</div>
                  {c.fake&&(
                    <div className={s.whyFake}>
                      <span>⚠️</span>
                      <span>Este concepto no existe en la literatura académica real.</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Glosario del capítulo */}
        {chapter.glossary?.length > 0 && (
          <motion.div className={s.glossarySec}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.5 }}>
            <div className={s.glossaryHdr}>
              <div className={s.gLine}/><span>Glosario del capítulo</span><div className={s.gLine}/>
            </div>
            <div className={s.glossaryGrid}>
              {chapter.glossary.map((item,i)=>(
                <motion.div key={i} className={s.glossaryCard}
                  initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }}
                  transition={{ delay:.55+i*.05 }}
                  whileHover={{ y:-3,borderColor:'rgba(123,92,255,.35)',transition:{ duration:.2 } }}>
                  <div className={s.gNum}>{String(i+1).padStart(2,'0')}</div>
                  <div className={`${s.gTerm} glitch`} data-g={item.term}>{item.term}</div>
                  <div className={s.gDef}>{item.definition}</div>
                  {item.example&&(
                    <div className={s.gExample}>
                      <div className={s.gExLbl}>💡 Ejemplo</div>
                      <div className={s.gExText}>{item.example}</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div className={s.footer}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.6 }}>
          <div className={s.sourceNote}>
            <span>📖</span>
            <span>Basado en: Valencia, Marulanda & López (2016). <em>Gobierno y Gestión de Riesgos de TI</em>. + Libro de Aseguramiento y Auditoría de TIC.</span>
          </div>
          <motion.button className="btn btn-primary btn-lg" onClick={onRestart}
            whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
            ↺ Jugar otra partida
          </motion.button>
        </motion.div>

      </div>
    </div>
  )
}
