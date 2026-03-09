// sprites.jsx — Pixel-art RPG characters v3
// Proyectiles y animaciones únicas por clase
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const SPRITE_DEFS = [
  { id: 'knight',  label: 'Knight',  color: '#4a90d9', accent: '#d8e0f8', secondary: '#f0e040' },
  { id: 'mage',    label: 'Mage',    color: '#9b59b6', accent: '#66ffcc', secondary: '#cc55ff' },
  { id: 'rogue',   label: 'Rogue',   color: '#e74c3c', accent: '#ff8c42', secondary: '#d8dde8' },
  { id: 'ranger',  label: 'Ranger',  color: '#27ae60', accent: '#f0c840', secondary: '#8be88b' },
  { id: 'paladin', label: 'Paladin', color: '#f39c12', accent: '#ffffff', secondary: '#fff8a0' },
  { id: 'warlock', label: 'Warlock', color: '#7b2fbe', accent: '#dd22ff', secondary: '#ff44cc' },
]

const PIXELS = {
  knight: {
    idle: [
      '......hhhh......','.....hfffhh.....', '.....hffefh.....','......hfffh.....',
      '....aaAAAAAa....','...aAxxxxxxxAa..', '...AxxXXXXxxAA..','..AABBxxxxxxBBAA',
      '..AABBxxkkxxBBAA','..AABBxxkkxxBBAA', '...AAccxxxxccAA.','...lllxxxxrrrrr.',
      '...lllxxxxrrrrr.','...lll....rrrrr.', '...lll....rrrrr.','...lLL....rRRrr.',
      '...lLL....rRRrr.','....SW..........', '....ss..........','....ss..........',
    ],
    attack: [
      '......hhhh......','.....hfffhh.....', '.....hffefh.....','......hfffh.....',
      '....aaAAAAAa....','...aAxxxxxxxAa..', '...AxxXXXXxxAA..','..AABBxxxxxxBBAA',
      '..AABBxxkkxxBBAA','..AABBxxkkxxBBAA', '...AAccxxxxccAA.','...lllxxxxrrrrr.',
      '...lllxxxxrrrrr.','...lll....rrrrr.', '...lll....rrrrr.','...lLL....rRRrr.',
      '...lLL....rRRrr.','..SSSSSSSSSSSS..', '...sssssssssss..','................',
    ],
    palette: {
      h:'#6b3a1f',f:'#ffd5a0',e:'#3a7acc',a:'#a0b0c8',A:'#8090a8',
      x:'#5a7090',X:'#6a80a0',B:'#4a6080',k:'#708090',c:'#3a5070',
      l:'#3a78c0',L:'#1a58a0',r:'#3a78c0',R:'#1a58a0',
      S:'#d8e0f8',s:'#a0a8c0',W:'#8b7040','.':'transparent',
    },
  },
  mage: {
    idle: [
      '......pppp......','.....pfffpp.....', '.....pffefp.....','......pfffp.....',
      '....HPPPPPPH....','...HHPPPPPPPHh..', '...HPPPPPPPPHh..','..HHRRpppppRRHH.',
      '..HHRRpppppRRHH.','..HHRRpppppRRHH.', '...HHRppppRHHH..','...HpppppppppH..',
      '...HRRpppRRRpH..','...HRRpppRRRpH..', '...HRRpppRRRpH..','...HSSpppSSSH...',
      '...HSSpppSSSH...','....WW....WW....', '....WW....WW....','....Wg..........',
    ],
    attack: [
      '......pppp......','.....pfffpp.....', '.....pffEp......','......pfffp.....',
      '....HPPPPPPH....','...HHPPPPPPPHh..', '...HPPPPPPPPHh..','..HHRRpppppRRHH.',
      '..HHRRpppppRRHH.','..HHRRpppppRRHH.', '...HHRppppRHHH..','...HpppppppppH..',
      '...HRRpppRRRpH..','...HRRpppRRRpH..', '...HRRpppRRRpH..','...HSSpppSSSH...',
      '...HSSpppSSSH...','....WW.gggggggg.', '....WW.ggGggggg.','....Wg.gggggggg.',
    ],
    palette: {
      p:'#5b1fa0',f:'#ffd5a0',e:'#cc55ff',E:'#ffffff',H:'#3d0070',P:'#8833cc',
      R:'#7b2fbe',S:'#2a0050',W:'#c8a060',g:'#66ffcc',G:'#ffffff','.':'transparent',
    },
  },
  rogue: {
    idle: [
      '......dddd......','.....dfffdd.....', '.....dffedd.....','......dfffd.....',
      '....mmmmmmmm....','...mmmmmmmmmmm..', '...dmmmmmmmmmd..','..ddLLdddddLLdd.',
      '..ddLLdddddLLdd.','..ddLLdddddLLdd.', '...ddLdddLdddd..','...ddddddddddd..',
      '...dDDdddDDddd..','...dDDdddDDddd..', '...dDDdddDDddd..','...dBBd..dBBdd..',
      '...dBBd..dBBdd..','....KK..........', '....KK..........','....Kk..........',
    ],
    attack: [
      '......dddd......','.....dfffdd.....', '.....dffedd.....','......dfffd.....',
      '....mmmmmmmm....','...mmmmmmmmmmm..', '...dmmmmmmmmmd..','..ddLLdddddLLdd.',
      '..ddLLdddddLLdd.','..ddLLdddddLLdd.', '...ddLdddLdddd..','...ddddddddddd..',
      '...dDDdddDDddd..','...dDDdddDDddd..', '...dDDdddDDddd..','...dBBd..dBBdd..',
      '...dBBd..dBBdd..','..KKKKKKKKKk....', '...KKKKKKKKk....','................',
    ],
    palette: {
      d:'#222233',f:'#ffd5a0',e:'#cc2233',m:'#111120',L:'#dd3311',
      D:'#333344',B:'#111120',K:'#d8dde8',k:'#aab0c0','.':'transparent',
    },
  },
  ranger: {
    idle: [
      '......gggg......','.....gfffgg.....', '.....gffeg......','......gfffg.....',
      '....vvvvvvvv....','...vvvvvvvvvv...', '...gvvvvvvvvvg..','..ggFFgggggFFgg.',
      '..ggFFgggggFFgg.','..ggFFgggggFFgg.', '...ggFgggFFgggg.','...ggggggggggg..',
      '...gGGgggGGggg..','...gGGgggGGggg..', '...gGGgggGGggg..','...gBBg..gBBgg..',
      '...gBBg..gBBgg..','b...Ab..........', 'b...Ab..........','b...Ab..........',
    ],
    attack: [
      '......gggg......','.....gfffgg.....', '.....gffeg......','......gfffg.....',
      '....vvvvvvvv....','...vvvvvvvvvv...', '...gvvvvvvvvvg..','..ggFFgggggFFgg.',
      '..ggFFgggggFFgg.','..ggFFgggggFFgg.', '...ggFgggFFgggg.','...ggggggggggg..',
      '...gGGgggGGggg..','...gGGgggGGggg..', '...gGGgggGGggg..','...gBBg..gBBgg..',
      '...gBBg..gBBgg..','b...Ab.aaaaaaaaaa', 'b...Ab..........','b...Ab..........',
    ],
    palette: {
      g:'#1a7035',f:'#ffd5a0',e:'#228855',v:'#145228',F:'#8b6914',
      G:'#2a8040',B:'#0a3018',b:'#6b4a10',A:'#9b7030',a:'#f0c840','.':'transparent',
    },
  },
  paladin: {
    idle: [
      '......yyyy......','.....yffyyy.....', '.....yffeyy.....','......yffyy.....',
      '....YYYYYYYY....','...YYYhhhYYYY...', '...YYYhhhYYYYY..','..YYWWyyyyWWYYY.',
      '..YYWWyyyyWWYYY.','..YYCCyyyyCCYYY.', '...YYCyyyyCCYYY.','...YYYYYYYYYYY..',
      '...YHHyyyYHHYY..','...YHHyyyYHHYY..', '...YHHyyyYHHYY..','...YBBy..yBByy..',
      '...YBBy..yBByy..','..Hhy....Hyyy...', '..HHH....HHH....', '.HHHHH..HHHHH...',
    ],
    attack: [
      '......yyyy......','.....yffyyy.....', '.....yffeyy.....','......yffyy.....',
      '....YYYYYYYY....','...YYYhhhYYYY...', '...YYYhhhYYYYY..','..YYWWyyyyWWYYY.',
      '..YYWWyyyyWWYYY.','..YYCCyyyyCCYYY.', '...YYCyyyyCCYYY.','...YYYYYYYYYYY..',
      '...YHHyyyYHHYY..','...YHHyyyYHHYY..', '...YHHyyyYHHYY..','...YBBy..yBByy..',
      '...YBBy..yBByy..','HHHHHHHHHHH.....', '.HHHHHHHHHH.....','..HHHHHHHHH.....',
    ],
    palette: {
      y:'#c8780a',f:'#ffd5a0',e:'#e8a020',Y:'#f0b030',h:'#fff8e0',
      W:'#ffffff',C:'#f0d060',H:'#7a5008',B:'#6a4004','.':'transparent',
    },
  },
  warlock: {
    idle: [
      '......cccc......','.....cfffcc.....', '.....cffec......','......cfffc.....',
      '....DDDrDDDD....','...DDDrrrDDDDD..', '...cDDrrrDDDcc..','..ccPPcccccPPcc.',
      '..ccPPcccccPPcc.','..ccPPcccccPPcc.', '...ccPcccPccccc.','...ccccccccccc..',
      '...cOOcccOOccc..','...cOOcccOOccc..', '...cOOcccOOccc..','...cRRc..cRRcc..',
      '...cRRc..cRRcc..','....Sc....Scc...', '....SS....Scc...','....So..........',
    ],
    attack: [
      '......cccc......','.....cfffcc.....', '.....cffOc......','......cfffc.....',
      '....DDDrDDDD....','...DDDrrrDDDDD..', '...cDDrrrDDDcc..','..ccPPcccccPPcc.',
      '..ccPPcccccPPcc.','..ccPPcccccPPcc.', '...ccPcccPccccc.','...ccccccccccc..',
      '...cOOcccOOccc..','...cOOcccOOccc..', '...cOOcccOOccc..','...cRRc..cRRcc..',
      '...cRRc..cRRcc..','....Sc.oooooooo.', '....SS.oooooooo.','....So.oooooooo.',
    ],
    palette: {
      c:'#1a0a30',f:'#c8a0b0',e:'#ff44cc',O:'#ff00ff',D:'#2c1450',P:'#6a1fa0',
      o:'#dd22ff',r:'#ff3d5a',R:'#ff3d5a',S:'#8050d0','.':'transparent',
    },
  },
  // ── Monstruo de mazmorra ──────────────────────────────────────────────────
  dragon: {
    idle: [
      '................','...GGG....GGG...','.GGgggGGGgggGG..','GGggWWWGGWWWggG.',
      'GgWWREERWWREEWgG','GgWWREERWWREEWgG','GgGGWWWGGWWWGGgG','.GGGGGGGGGGGGgG.',
      '..GGGMMMMMMGGG..','...GGMMMMMMMgg..','.gGGGMMMMMMGGg..','gGGGGMMMMMGGGGg.',
      'gGGGGMMMMMGGGGg.','gGGGGMMMMMGGGGg.','.gGGGGGGGGGGGg..','..gGGGGGGGGGg...',
      '...TTTTTTTTT....','...TtTtTtTtTt...','...tttttttttt...','................',
    ],
    attack: [
      '................','...GGG....GGG...','.GGgggGGGgggGG..','GGggWWWGGWWWggG.',
      'GgWWREERWWREEWgG','GgWWREERWWREEWgG','GgGGWWWGGWWWGGgG','.GGGGGGGGGGGGgG.',
      '..GGGMMMMMMGGG..','...GGMMMMMMMgg..','.gGGGMMMMMMGGg..','gGGGGMMMMMGGGGg.',
      'gGGGGMMMMMGGGGg.','gGGGGFFFFFGGGGg.','.gGGGFFFFFGGGg..','..FFFFFFFFFFFFFF',
      '...TTTTTTTTT....','...TtTtTtTtTt...','...tttttttttt...','................',
    ],
    palette: {
      G:'#2d5a1b',g:'#3a7a24',W:'#8b6914',R:'#ff2200',E:'#ffff00',
      M:'#5a2a10',m:'#7a3a18',F:'#ff6600',T:'#6b4a10',t:'#4a3010','.':'transparent',
    },
  },
  slime: {
    idle: [
      '................','....BBBBBBBB....','..BBbbbbbbbbBB..','..BbbbbbbbbbBb..',
      '..BbbbEEbbEbbB..','..BbbbEEbbEbbB..','..BbbbbbbbbbBb..','..BBbbbbbbbbBB..',
      '...BBBbbbbBBB...','....BBBBBBBB....','...BbbbbbbbbB...','..Bbbbbbbbbbb...',
      '..BbbbbbbbbbB...','...Bbbbbbbbb....','....BBbbbbBB....','......BBBB......',
      '................','................','................','................',
    ],
    attack: [
      '....OOOOOO......','...OooooooO.....','..OoooooooooO...','.OooooooooooO...',
      'Ooooo....OooOO..','OoooO...Ooooo...','OoooO...Ooooo...','OoooOOOOooooo...',
      '.OooooooooooO...','..OoooooooooO...','...OooooooooO...','....OooooooO....',
      '....BBBBBBBB....','...BbbbbbbbbB...','..BbbbbbbbbbbB..','..BbbbEEbbEbbB..',
      '..BbbbbbbbbbBb..','..BBbbbbbbbbBB..','....BBBBBBBB....','................',
    ],
    palette: {
      B:'#2a8a2a',b:'#44cc44',E:'#ffffff',O:'#88ff88',o:'#aaffaa','.':'transparent',
    },
  },
  golem: {
    idle: [
      '....SSSSSSSS....','..SSssssssssSSS.','..SssRRssRRssS..','..SssRRssRRssS..',
      '..SSSSssssSSSSS.','..SSSssssssSSS..','..SSSSSssSSSSSS.','..SSSSSssSSSSSS.',
      '..SSSSSSSSSSSS..','..SSSSSSSSSSSS..','...SSSSSSSSSS...','..SSSS.SS.SSSS..',
      '..SSSS.SS.SSSS..','..SSSS.SS.SSSS..','..SSSS.SS.SSSS..','..SSSS.SS.SSSS..',
      '..BSSS.SS.SSSB..','..BSSSS..SSSSB..','...BSSSSSSSB....','....BBSSSSBB....',
    ],
    attack: [
      '....SSSSSSSS....','..SSssssssssSSS.','..SssRRssRRssS..','..SssRRssRRssS..',
      'SSSSSSSSSSSSSSS.','SSSSSSSSSSSSSSS.','..SSSSSssSSSSSS.','..SSSSSssSSSSSS.',
      '..SSSSSSSSSSSS..','..SSSSSSSSSSSS..','...SSSSSSSSSS...','..SSSS.SS.SSSS..',
      '..SSSS.SS.SSSS..','..SSSS.SS.SSSS..','..SSSS.SS.SSSS..','..SSSS.SS.SSSS..',
      '..BSSS.SS.SSSB..','..BSSSS..SSSSB..','...BSSSSSSSB....','....BBSSSSBB....',
    ],
    palette: {
      S:'#7a7a8a',s:'#5a5a6a',R:'#ff3333',B:'#4a4a5a','.':'transparent',
    },
  },
}

// ── PixelGrid renderer ────────────────────────────────────────────────────────
function PixelGrid({ grid, palette, size = 3 }) {
  const rows = grid.length
  const cols = Math.max(...grid.map(r => r.length))
  return (
    <svg width={cols * size} height={rows * size}
      style={{ imageRendering:'pixelated', display:'block' }}
      viewBox={`0 0 ${cols} ${rows}`}>
      {grid.map((row, y) =>
        [...row].map((ch, x) => {
          const fill = palette[ch]
          if (!fill || fill === 'transparent') return null
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
        })
      )}
    </svg>
  )
}

// ── Proyectiles únicos ────────────────────────────────────────────────────────
function KnightProjectile({ flip, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 480); return () => clearTimeout(t) }, [])
  return (
    <motion.div style={{ position:'absolute', top:'25%', left: flip?'-5%':'105%', pointerEvents:'none', zIndex:20, display:'flex', gap:4 }}
      initial={{x:0,opacity:1}} animate={{x:flip?200:-200,opacity:[1,1,0]}} transition={{duration:.45,ease:'easeIn'}}>
      {['⚔','✦'].map((e,i)=>(
        <motion.span key={i} style={{ fontSize:16, filter:'drop-shadow(0 0 8px #d8e0f8)', display:'block' }}
          animate={{rotate:flip?360:-360}} transition={{duration:.45,ease:'linear'}}>{e}</motion.span>
      ))}
    </motion.div>
  )
}

function MageProjectile({ flip, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 600); return () => clearTimeout(t) }, [])
  return (
    <motion.div style={{ position:'absolute', top:'15%', left: flip?'-5%':'105%', pointerEvents:'none', zIndex:20 }}
      initial={{x:0,opacity:1,scale:.5}} animate={{x:flip?210:-210,opacity:[1,1,.5,0],scale:[.5,1.4,1.8,.4]}} transition={{duration:.58,ease:'easeOut'}}>
      <div style={{position:'relative'}}>
        {[0,1,2].map(i=>(
          <motion.div key={i} style={{
            position:i===0?'relative':'absolute', top:i===1?-10:i===2?10:0, left:0,
            fontSize:i===0?24:14, filter:`drop-shadow(0 0 ${10+i*4}px #66ffcc)`,
          }} animate={{rotate:flip?(i%2?180:-180):(i%2?-180:180),scale:[1,1.3,.8,1.2]}} transition={{duration:.6,ease:'linear'}}>
            {i===0?'◉':i===1?'✦':'✧'}
          </motion.div>
        ))}
        {Array.from({length:6}).map((_,i)=>(
          <motion.div key={`p${i}`} style={{
            position:'absolute',top:(i-3)*5,left:flip?i*10:-i*10,
            width:4,height:4,borderRadius:'50%',background:'#66ffcc',boxShadow:'0 0 6px #66ffcc',
          }} animate={{opacity:[0,1,0],scale:[0,1,0]}} transition={{delay:i*.05,duration:.3}}/>
        ))}
      </div>
    </motion.div>
  )
}

function RogueProjectile({ flip, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 380); return () => clearTimeout(t) }, [])
  return (
    <motion.div style={{ position:'absolute', top:'32%', left:flip?'0%':'100%', pointerEvents:'none', zIndex:20 }}
      initial={{x:0,opacity:1,rotate:flip?45:-45}} animate={{x:flip?180:-180,y:[-2,4,-2],opacity:[1,1,1,0]}} transition={{duration:.36,ease:'easeIn'}}>
      <span style={{fontSize:14,filter:'drop-shadow(0 0 4px #ff8c42)',display:'block'}}>🗡</span>
      <motion.span style={{position:'absolute',top:-8,left:8,fontSize:11,filter:'drop-shadow(0 0 3px #ff8c42)',display:'block',opacity:.7}}
        initial={{opacity:0}} animate={{opacity:[0,.7,0]}} transition={{delay:.08,duration:.28}}>🗡</motion.span>
    </motion.div>
  )
}

function RangerProjectile({ flip, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 320); return () => clearTimeout(t) }, [])
  return (
    <motion.div style={{ position:'absolute', top:'28%', left:flip?'10%':'90%', pointerEvents:'none', zIndex:20 }}
      initial={{x:0,opacity:1}} animate={{x:flip?190:-190,opacity:[1,1,0]}} transition={{duration:.3,ease:'easeIn'}}>
      <svg width={flip?-44:44} height={8} viewBox="0 0 44 8" style={{display:'block'}}>
        <line x1="0" y1="4" x2="38" y2="4" stroke="#f0c840" strokeWidth="2.5"/>
        <polygon points={flip?"6,0 6,8 0,4":"38,0 38,8 44,4"} fill="#f0c840"/>
        <line x1="0" y1="4" x2="38" y2="4" stroke="rgba(240,200,64,.4)" strokeWidth="5"/>
      </svg>
      <motion.div style={{position:'absolute',top:-1,left:flip?0:38,width:6,height:6,borderRadius:'50%',background:'#fff8e0',boxShadow:'0 0 10px #f0c840'}}
        animate={{scale:[1,2,0]}} transition={{duration:.3}}/>
    </motion.div>
  )
}

function PaladinProjectile({ flip, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 520); return () => clearTimeout(t) }, [])
  return (
    <motion.div style={{ position:'absolute', top:'12%', left:flip?'-10%':'110%', pointerEvents:'none', zIndex:20 }}
      initial={{x:0,opacity:0,scale:0}} animate={{x:flip?215:-215,opacity:[0,1,1,0],scale:[0,1.5,1,.5]}} transition={{duration:.5,ease:'easeOut'}}>
      <div style={{position:'relative',width:30,height:30}}>
        <div style={{position:'absolute',top:'50%',left:0,right:0,height:4,background:'#fff8a0',boxShadow:'0 0 14px #ffffff',transform:'translateY(-50%)'}}/>
        <div style={{position:'absolute',left:'50%',top:0,bottom:0,width:4,background:'#fff8a0',boxShadow:'0 0 14px #ffffff',transform:'translateX(-50%)'}}/>
        {[0,1,2,3].map(i=>(
          <motion.div key={i} style={{position:'absolute',top:'50%',left:'50%',width:18,height:18,borderRadius:'50%',background:'rgba(255,248,160,.4)',transform:'translate(-50%,-50%)'}}
            animate={{scale:[1,2.8],opacity:[.8,0]}} transition={{delay:i*.08,duration:.42}}/>
        ))}
      </div>
    </motion.div>
  )
}

function WarlockProjectile({ flip, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 580); return () => clearTimeout(t) }, [])
  return (
    <motion.div style={{ position:'absolute', top:'18%', left:flip?'-5%':'105%', pointerEvents:'none', zIndex:20 }}
      initial={{x:0,opacity:1}} animate={{x:flip?210:-210,opacity:[1,1,.5,0]}} transition={{duration:.54,ease:'easeIn'}}>
      <div style={{position:'relative'}}>
        <motion.div style={{fontSize:24,filter:'drop-shadow(0 0 14px #dd22ff)'}}
          animate={{rotate:[0,360],scale:[1,1.4,.8,1.2]}} transition={{duration:.54,ease:'linear'}}>◉</motion.div>
        {Array.from({length:6}).map((_,i)=>(
          <motion.div key={i} style={{
            position:'absolute',top:'50%',left:'50%',
            width:3+i,height:3+i,borderRadius:'50%',
            background:`hsl(${280+i*20},100%,${60+i*5}%)`,
            boxShadow:`0 0 8px hsl(${280+i*20},100%,60%)`,
          }}
            initial={{x:0,y:0,opacity:0}}
            animate={{x:Math.cos(i*(Math.PI*2/6))*15,y:Math.sin(i*(Math.PI*2/6))*15,opacity:[0,1,0],rotate:360}}
            transition={{delay:i*.03,duration:.54,ease:'easeOut'}}/>
        ))}
      </div>
    </motion.div>
  )
}

const PROJECTILE_MAP = {
  knight:KnightProjectile,mage:MageProjectile,rogue:RogueProjectile,
  ranger:RangerProjectile,paladin:PaladinProjectile,warlock:WarlockProjectile,
}

// ── Impactos únicos ───────────────────────────────────────────────────────────
function ImpactBurst({ spriteId, accentColor }) {
  const base = (
    <>
      <motion.div style={{position:'absolute',top:'18%',left:'10%',width:72,height:72,
        borderRadius:'50%',border:`3px solid ${accentColor}`,boxShadow:`0 0 20px ${accentColor}`}}
        initial={{scale:0,opacity:1}} animate={{scale:2.5,opacity:0}} transition={{duration:.42}}/>
    </>
  )
  const specifics = {
    knight: Array.from({length:8}).map((_,i)=>{
      const a=(i/8)*360
      return <motion.div key={i} style={{position:'absolute',top:'40%',left:'42%',width:3+Math.random()*5,height:3,borderRadius:2,background:accentColor,transformOrigin:'left center',transform:`rotate(${a}deg)`}}
        initial={{scaleX:0,opacity:1}} animate={{scaleX:[0,1,0],opacity:[1,1,0],x:Math.cos(a*Math.PI/180)*20,y:Math.sin(a*Math.PI/180)*20}} transition={{duration:.4,ease:'easeOut'}}/>
    }),
    mage: Array.from({length:12}).map((_,i)=>{
      const a=(i/12)*360
      return <motion.div key={i} style={{position:'absolute',top:'40%',left:'45%',fontSize:8+(i%3)*4,filter:`drop-shadow(0 0 6px ${accentColor})`}}
        initial={{x:0,y:0,opacity:1,scale:0}}
        animate={{x:Math.cos(a*Math.PI/180)*(16+Math.random()*20),y:Math.sin(a*Math.PI/180)*(16+Math.random()*20),opacity:[0,1,0],scale:[0,1.5,0],rotate:[0,180*((i%2)?1:-1)]}}
        transition={{duration:.5,ease:'easeOut',delay:i*.02}}>
        {['✦','✧','◈','◆'][i%4]}
      </motion.div>
    }),
    rogue: Array.from({length:6}).map((_,i)=>(
      <motion.div key={i} style={{position:'absolute',top:`${30+i*8}%`,left:'30%',width:20+i*5,height:2,background:'#ff8c42',borderRadius:1,transformOrigin:'left center'}}
        initial={{scaleX:0,opacity:1,rotate:(i-3)*10}} animate={{scaleX:[0,1,0],opacity:[1,.8,0],x:[-10+i*4,20+i*8]}} transition={{duration:.3,delay:i*.04,ease:'easeOut'}}/>
    )),
    paladin: [
      ...Array.from({length:8}).map((_,i)=>{
        const a=(i/8)*360
        return <motion.div key={i} style={{position:'absolute',top:'35%',left:'40%',width:4,height:4,borderRadius:'50%',background:'#ffffff',boxShadow:'0 0 10px #fff8a0'}}
          initial={{x:0,y:0,opacity:1,scale:0}} animate={{x:Math.cos(a*Math.PI/180)*25,y:Math.sin(a*Math.PI/180)*25,opacity:[0,1,0],scale:[0,2,0]}} transition={{duration:.55,ease:'easeOut',delay:i*.03}}/>
      }),
      <motion.div key="glow" style={{position:'absolute',top:'5%',left:'-5%',width:90,height:90,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,248,160,.4) 0%,transparent 70%)',boxShadow:'0 0 40px rgba(255,248,160,.8)'}}
        initial={{scale:0,opacity:1}} animate={{scale:2,opacity:0}} transition={{duration:.6}}/>,
    ],
    warlock: Array.from({length:10}).map((_,i)=>{
      const a=(i/10)*360
      return <motion.div key={i} style={{position:'absolute',top:'38%',left:'42%',fontSize:10,filter:`drop-shadow(0 0 8px #dd22ff)`}}
        initial={{x:0,y:0,opacity:0,scale:0}}
        animate={{x:Math.cos(a*Math.PI/180)*(18+Math.random()*14),y:Math.sin(a*Math.PI/180)*(18+Math.random()*14),opacity:[0,1,0],scale:[0,1.8,0],rotate:[0,720]}}
        transition={{duration:.5,ease:'easeOut',delay:i*.025}}>◉</motion.div>
    }),
  }
  return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:25,overflow:'visible'}}>
      {base}{specifics[spriteId] ?? specifics.knight}
    </div>
  )
}

// ── Escudo ────────────────────────────────────────────────────────────────────
function ShieldAnim({ accentColor, flip }) {
  return (
    <motion.div style={{position:'absolute',top:'5%',[flip?'left':'right']:-38,zIndex:22}}
      initial={{scale:0,rotate:flip?20:-20,opacity:0}}
      animate={{scale:[0,1.8,1.2,1],rotate:0,opacity:1}}
      exit={{scale:0,opacity:0}}
      transition={{duration:.4,ease:[.16,1,.3,1]}}>
      <div style={{fontSize:34,filter:`drop-shadow(0 0 16px ${accentColor})`}}>🛡</div>
      <motion.div style={{position:'absolute',inset:-8,borderRadius:'50%',border:`2px solid ${accentColor}`,boxShadow:`0 0 12px ${accentColor}`}}
        animate={{scale:[1,1.4,1],opacity:[.8,.2,.8]}} transition={{duration:.6,repeat:Infinity}}/>
    </motion.div>
  )
}

// ── AbilityEffect — efectos visuales de habilidades ───────────────────────────
export function AbilityEffect({ type, color = '#3dffc0', onDone }) {
  useEffect(() => {
    const dur = type==='heal'?1200:type==='shield'?900:type==='fifty'?800:type==='teamup'?1000:800
    const t = setTimeout(onDone, dur)
    return () => clearTimeout(t)
  }, [])

  if (type === 'heal') return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:30}}>
      {Array.from({length:8}).map((_,i) => (
        <motion.div key={i} style={{position:'absolute',left:`${18+i*8}%`,bottom:'10%',fontSize:16,filter:'drop-shadow(0 0 8px #3dffc0)'}}
          initial={{y:0,opacity:0}} animate={{y:-60-i*10,opacity:[0,1,1,0]}} transition={{delay:i*.09,duration:.9}}>✚</motion.div>
      ))}
      <motion.div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center,rgba(61,255,192,.18) 0%,transparent 70%)'}}
        initial={{opacity:0}} animate={{opacity:[0,1,0]}} transition={{duration:1.2}}/>
    </div>
  )

  if (type === 'shield') return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:30}}>
      <motion.div style={{position:'absolute',inset:-10,border:`3px solid ${color}`,borderRadius:8,boxShadow:`0 0 20px ${color},inset 0 0 20px ${color}22`}}
        initial={{opacity:0,scale:1.2}} animate={{opacity:[0,1,.6,.8,0],scale:[1.2,1,1,1,.9]}} transition={{duration:.9}}/>
    </div>
  )

  if (type === 'fifty') return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:30,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <motion.div style={{fontFamily:'var(--pixel)',fontSize:26,color:'#f0e040',textShadow:'0 0 20px #f0e040',whiteSpace:'nowrap'}}
        initial={{scale:0,rotate:-10}} animate={{scale:[0,1.4,1,1.2,1],rotate:[-10,2,-1,0]}} transition={{duration:.7,type:'spring'}}>
        50 / 50
      </motion.div>
    </div>
  )

  if (type === 'teamup') return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:30,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <motion.div style={{fontFamily:'var(--pixel)',fontSize:18,color:'#4a90d9',textShadow:'0 0 16px #4a90d9'}}
        initial={{scale:0,y:20}} animate={{scale:[0,1.3,1],y:[20,0,-4,0]}} transition={{duration:.8,type:'spring'}}>
        ¡LLAMANDO AL EQUIPO!
      </motion.div>
    </div>
  )

  return null
}

// ── Idle float ────────────────────────────────────────────────────────────────
function IdleFloat({ children, delay = 0 }) {
  return (
    <motion.div animate={{y:[0,-5,0]}} transition={{duration:2.6,repeat:Infinity,ease:'easeInOut',delay}}>
      {children}
    </motion.div>
  )
}

function Shadow({ size }) {
  return (
    <div style={{width:size*8,height:4,borderRadius:'50%',background:'rgba(0,0,0,.3)',margin:'2px auto 0',filter:'blur(3px)'}}/>
  )
}

// ── AnimatedSprite — componente principal ─────────────────────────────────────
export function AnimatedSprite({
  id, size=3, flip=false,
  isAttacking=false, isTakingHit=false, isDefending=false,
  idleDelay=0,
}) {
  const def        = PIXELS[id] ?? PIXELS.knight
  const spriteDef  = SPRITE_DEFS.find(s=>s.id===id)
  const accentColor = spriteDef?.accent ?? '#f0e040'

  const [showProj,   setShowProj]   = useState(false)
  const [showImpact, setShowImpact] = useState(false)
  const [showShield, setShowShield] = useState(false)
  const prevAtk = useRef(false), prevDef = useRef(false), prevHit = useRef(false)

  useEffect(() => {
    if (isAttacking && !prevAtk.current) setShowProj(true)
    prevAtk.current = isAttacking
  }, [isAttacking])

  useEffect(() => {
    if (isDefending && !prevDef.current) {
      setShowShield(true)
      const t = setTimeout(() => setShowShield(false), 950)
      return () => clearTimeout(t)
    }
    prevDef.current = isDefending
  }, [isDefending])

  useEffect(() => {
    if (isTakingHit && !prevHit.current) {
      setShowImpact(true)
      const t = setTimeout(() => setShowImpact(false), 560)
      return () => clearTimeout(t)
    }
    prevHit.current = isTakingHit
  }, [isTakingHit])

  const grid = (isAttacking && def.attack) ? def.attack : def.idle ?? def.attack ?? []

  const getBodyAnim = () => {
    if (isTakingHit) return { x:[0,flip?18:-18,flip?-13:13,flip?7:-7,flip?-4:4,0], y:[0,0,-4,0] }
    if (isDefending) return { x:[0,flip?12:-12,flip?-7:7,0], scale:[1,1.08,1] }
    if (isAttacking) {
      const moves = {
        knight:  { x:flip?[-60,0]:[60,0], y:[0,-8,0] },
        mage:    { rotate:flip?[0,15,0]:[0,-15,0], scale:[1,1.15,1] },
        rogue:   { x:flip?[-50,0]:[50,0], y:[0,-12,-4,0] },
        ranger:  { y:[0,-6,0], rotate:flip?[0,-10,0]:[0,10,0] },
        paladin: { x:flip?[-45,0]:[45,0], scale:[1,1.2,1] },
        warlock: { rotate:flip?[0,20,-10,0]:[0,-20,10,0], scale:[1,1.1,.9,1] },
      }
      return moves[id] ?? { x:flip?[-55,0]:[55,0] }
    }
    return {}
  }

  const filterStyle = isTakingHit
    ? 'brightness(6) saturate(0)'
    : isAttacking
    ? `brightness(1.8) saturate(1.8) drop-shadow(0 0 6px ${accentColor})`
    : isDefending
    ? 'brightness(1.4) saturate(1.3)'
    : 'brightness(1)'

  const ProjComp = PROJECTILE_MAP[id] ?? KnightProjectile

  return (
    <div style={{position:'relative',display:'inline-block'}}>
      <motion.div
        animate={getBodyAnim()}
        transition={{duration:isAttacking?.44:isTakingHit?.36:.28,type:'spring',stiffness:300,damping:18}}
        style={{display:'inline-block'}}>
        <IdleFloat delay={idleDelay}>
          <div style={{imageRendering:'pixelated',position:'relative',filter:filterStyle,transition:'filter .06s',transform:flip?'scaleX(-1)':undefined}}>
            <PixelGrid grid={grid} palette={def.palette} size={size}/>
          </div>
        </IdleFloat>
      </motion.div>
      <Shadow size={size}/>

      <AnimatePresence>
        {isAttacking && (
          <motion.div key="aura" style={{position:'absolute',inset:-12,borderRadius:10,zIndex:-1,background:`radial-gradient(circle,${accentColor}66 0%,transparent 70%)`}}
            initial={{opacity:0,scale:.6}} animate={{opacity:[0,1,.5,0],scale:[.6,1.5,1.3]}} transition={{duration:.5}}/>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProj && <ProjComp key="proj" flip={flip} onDone={() => setShowProj(false)}/>}
      </AnimatePresence>

      <AnimatePresence>
        {showImpact && <ImpactBurst key="impact" spriteId={id} accentColor={accentColor}/>}
      </AnimatePresence>

      <AnimatePresence>
        {showShield && <ShieldAnim key="shield" accentColor={accentColor} flip={flip}/>}
      </AnimatePresence>
    </div>
  )
}

export function AttackSprite(props) { return <AnimatedSprite {...props}/> }

export function Sprite({ id, size=3, flip=false, style={} }) {
  const def  = PIXELS[id] ?? PIXELS.knight
  const grid = def.idle ?? def.attack ?? []
  return (
    <div style={{display:'inline-block',imageRendering:'pixelated',...style,transform:flip?'scaleX(-1)':undefined}}>
      <PixelGrid grid={grid} palette={def.palette} size={size}/>
    </div>
  )
}
