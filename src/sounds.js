// sounds.js — Trivia Battle — Web Audio API, sin dependencias externas
// Música de batalla épica generativa con arpegio rítmico, bajo, percusión y melodía

let ctx=null, masterFx=null, masterBg=null
let bgRunning=false, bgNodes=[], bgTimers=[], bgVol=0.15

function ac() {
  if(!ctx) {
    ctx = new (window.AudioContext||window.webkitAudioContext)()
    masterFx = ctx.createGain(); masterFx.gain.value = 0.38; masterFx.connect(ctx.destination)
    masterBg = ctx.createGain(); masterBg.gain.value = 0;    masterBg.connect(ctx.destination)
  }
  if(ctx.state==='suspended') ctx.resume()
  return ctx
}

// Reverb sintético
function mkReverb(dur=1.8) {
  const c=ac(), conv=c.createConvolver()
  const len=c.sampleRate*dur, buf=c.createBuffer(2,len,c.sampleRate)
  for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.4)}
  conv.buffer=buf; conv.connect(masterBg); return conv
}

// Compresor para mezcla limpia
function mkComp() {
  const c=ac(), comp=c.createDynamicsCompressor()
  comp.threshold.value=-18; comp.knee.value=12; comp.ratio.value=6
  comp.attack.value=0.003; comp.release.value=0.2
  comp.connect(masterBg); return comp
}

function osc(freq,type,vol,atk,rel,dest,delay=0) {
  const c=ac(),o=c.createOscillator(),g=c.createGain()
  o.type=type; o.frequency.value=freq; o.connect(g); g.connect(dest??masterFx)
  const t=c.currentTime+delay
  g.gain.setValueAtTime(0,t)
  g.gain.linearRampToValueAtTime(vol,t+atk)
  g.gain.exponentialRampToValueAtTime(.0001,t+atk+rel)
  o.start(t); o.stop(t+atk+rel+.05)
}

function noise(vol,dur,delay=0,freq=1200) {
  const c=ac(),buf=c.createBuffer(1,c.sampleRate*dur,c.sampleRate),d=buf.getChannelData(0)
  for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1
  const src=c.createBufferSource(); src.buffer=buf
  const g=c.createGain(),filt=c.createBiquadFilter()
  filt.type='bandpass'; filt.frequency.value=freq; filt.Q.value=2
  src.connect(filt); filt.connect(g); g.connect(masterFx)
  const t=c.currentTime+delay
  g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+dur)
  src.start(t); src.stop(t+dur)
}

function vib(pat) { if(navigator.vibrate) navigator.vibrate(pat) }

// ═══════════════════════ EFECTOS DE SONIDO ═══════════════════════════════════
export const sfx = {
  click:      ()=>{ osc(900,'sine',.12,.01,.07); osc(1400,'sine',.07,.01,.05,undefined,.03) },
  correct:    ()=>{ [523,659,784,1046].forEach((f,i)=>osc(f,'sine',.24,.01,.35,undefined,i*.06)); vib([20,10,20]) },
  wrong:      ()=>{ osc(300,'sawtooth',.22,.01,.2); osc(220,'sawtooth',.18,.01,.28,undefined,.09); osc(110,'square',.14,.01,.45,undefined,.2); vib([80,30,80]) },
  attack:     ()=>{ noise(.35,.14,0,900); osc(180,'sawtooth',.2,.005,.2); osc(240,'sawtooth',.14,.005,.17,undefined,.05); vib([40,10,25]) },
  hit:        ()=>{ noise(.45,.1,0,600); osc(100,'square',.28,.005,.3); osc(70,'square',.22,.005,.4,undefined,.04); vib([110,20,70]) },
  defend:     ()=>{ osc(440,'sine',.18,.01,.08); osc(660,'sine',.14,.01,.1,undefined,.04); osc(880,'sine',.1,.01,.12,undefined,.08); vib([15,10,15]) },
  roundStart: ()=>{ [349,440,523,698].forEach((f,i)=>osc(f,'sine',.2,.01,.28,undefined,i*.1)); vib([30,20,60]) },
  winTeam:    ()=>{ [523,659,784,1046,1318].forEach((f,i)=>osc(f,'sine',.28,.01,.55,undefined,i*.11)); osc(1046,'sine',.2,.01,.9,undefined,.65); vib([100,50,100,50,220]) },
  lose:       ()=>{ [196,185,165,140,110].forEach((f,i)=>osc(f,'sawtooth',.22,.01,.55,undefined,i*.17)); vib([200,100,300]) },
  question:   ()=>{ osc(440,'sine',.1,.01,.08); osc(660,'sine',.08,.01,.1,undefined,.06) },
  tick:       ()=>{ osc(880,'square',.08,.005,.04); vib(8) },
  tickFinal:  ()=>{ osc(1200,'square',.12,.005,.06); vib(18) },
  join:       ()=>{ osc(440,'sine',.12,.01,.1); osc(554,'sine',.09,.01,.12,undefined,.08) },
  ready:      ()=>{ [523,659,784].forEach((f,i)=>osc(f,'sine',.18,.01,.2,undefined,i*.09)) },
  danger:     ()=>{ osc(200,'square',.13,.01,.09); osc(196,'square',.1,.01,.09,undefined,.14); vib([25,15,25,15,25]) },
}

// ═══════════════════════ MÚSICA DE BATALLA ÉPICA ═════════════════════════════
// Escala menor armónica de La — tensa, épica, RPG
// Am: A B C D E F G# A
const AM_SCALE = [
  110, 123.47, 130.81, 146.83, 164.81, 174.61, 207.65,   // La2-Sol#2
  220, 246.94, 261.63, 293.66, 329.63, 349.23, 415.30,   // La3-Sol#3
  440, 493.88, 523.25, 587.33, 659.26, 698.46, 830.61,   // La4-Sol#4
]
// Arpegios de La menor: i, III, iv, VII
const CHORD_ARPS = [
  [110, 130.81, 164.81, 220],    // Am
  [130.81, 164.81, 196, 261.63], // C
  [146.83, 174.61, 220, 293.66], // Dm
  [123.47, 164.81, 207.65, 246.94], // G# dim
]

// Nota para música de fondo
function bgNote(freq, type, vol, atk, rel, dest) {
  const c=ac(), o=c.createOscillator(), g=c.createGain()
  const filt=c.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=1800
  o.type=type; o.frequency.value=freq
  o.detune.value=(Math.random()-.5)*5
  o.connect(filt); filt.connect(g); g.connect(dest)
  const t=c.currentTime
  g.gain.setValueAtTime(0,t)
  g.gain.linearRampToValueAtTime(vol,t+atk)
  g.gain.exponentialRampToValueAtTime(.0001,t+atk+rel)
  o.start(t); o.stop(t+atk+rel+.1)
  bgNodes.push(o)
}

// Percusión sintética: kick, snare, hihat
function kick(dest) {
  const c=ac()
  const o=c.createOscillator(), g=c.createGain()
  o.type='sine'; o.frequency.setValueAtTime(160,c.currentTime); o.frequency.exponentialRampToValueAtTime(40,c.currentTime+.12)
  o.connect(g); g.connect(dest)
  g.gain.setValueAtTime(.6,c.currentTime); g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.18)
  o.start(c.currentTime); o.stop(c.currentTime+.2)
  bgNodes.push(o)
}

function snare(dest) {
  const c=ac()
  // Noise burst
  const buf=c.createBuffer(1,c.sampleRate*.12,c.sampleRate), d=buf.getChannelData(0)
  for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1
  const src=c.createBufferSource(); src.buffer=buf
  const filt=c.createBiquadFilter(); filt.type='highpass'; filt.frequency.value=2000
  const g=c.createGain()
  src.connect(filt); filt.connect(g); g.connect(dest)
  g.gain.setValueAtTime(.22,c.currentTime); g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.12)
  src.start(c.currentTime); src.stop(c.currentTime+.14)
  bgNodes.push(src)
  // Tone snap
  const o=c.createOscillator(), g2=c.createGain()
  o.type='triangle'; o.frequency.value=200
  o.connect(g2); g2.connect(dest)
  g2.gain.setValueAtTime(.12,c.currentTime); g2.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.06)
  o.start(c.currentTime); o.stop(c.currentTime+.07)
  bgNodes.push(o)
}

function hihat(dest, vol=.06) {
  const c=ac()
  const buf=c.createBuffer(1,c.sampleRate*.04,c.sampleRate), d=buf.getChannelData(0)
  for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1
  const src=c.createBufferSource(); src.buffer=buf
  const filt=c.createBiquadFilter(); filt.type='highpass'; filt.frequency.value=8000
  const g=c.createGain()
  src.connect(filt); filt.connect(g); g.connect(dest)
  g.gain.setValueAtTime(vol,c.currentTime); g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.04)
  src.start(c.currentTime); src.stop(c.currentTime+.05)
  bgNodes.push(src)
}

// ── Secuenciador rítmico (BPM 128) ──────────────────────────────────────────
const BPM = 128
const BEAT = 60/BPM             // 0.469s
const BAR  = BEAT * 4            // 1.875s

let chordIdx = 0
let beatCount = 0

function scheduleBar(comp, rev) {
  if(!bgRunning) return
  const chord = CHORD_ARPS[chordIdx % CHORD_ARPS.length]
  chordIdx++

  // Kick: beats 1 & 3
  kick(comp)
  setTimeout(()=>kick(comp),  BEAT*2*1000)

  // Snare: beats 2 & 4
  setTimeout(()=>snare(comp), BEAT*1*1000)
  setTimeout(()=>snare(comp), BEAT*3*1000)

  // Hihat: cada corchea
  for(let i=0;i<8;i++) {
    setTimeout(()=>hihat(comp, i%2===0?.09:.05), i*BEAT*500)
  }

  // Arpegio: 8 notas por compás, 2 octavas
  chord.forEach((note,ni) => {
    ;[1,2].forEach(oct => {
      setTimeout(()=>bgNote(note*oct,'square',.032,.005,.18,comp), (ni + oct*4 - 4)*BEAT*250)
    })
  })

  // Bajo: nota raíz cada tiempo fuerte
  const root = chord[0]
  bgNote(root/2, 'sawtooth', .07, .01, BEAT*.8, comp)
  setTimeout(()=>bgNote(root/2,'sawtooth',.06,.01,BEAT*.8,comp), BEAT*2*1000)

  // Melodía esporádica (cada 2 compases)
  if(chordIdx % 2 === 0) {
    const melody = AM_SCALE.slice(7,14)
    const mel1 = melody[Math.floor(Math.random()*melody.length)]
    const mel2 = melody[Math.floor(Math.random()*melody.length)]
    bgNote(mel1,'sine',.04,.02,.4,rev)
    setTimeout(()=>bgNote(mel2,'sine',.035,.02,.35,rev), BEAT*1.5*1000)
  }

  // Pad de acordes con reverb (color armónico suave)
  chord.slice(0,3).forEach(f=>bgNote(f,'sine',.018,BAR*.3,BAR*.5,rev))

  // Programar siguiente compás
  bgTimers.push(setTimeout(()=>scheduleBar(comp,rev), BAR*1000))
}

export function startMusic() {
  if(bgRunning) return
  bgRunning=true; chordIdx=0; beatCount=0
  ac()
  const comp=mkComp(), rev=mkReverb(1.4)

  masterBg.gain.setValueAtTime(0, ctx.currentTime)
  masterBg.gain.linearRampToValueAtTime(bgVol, ctx.currentTime+2)

  scheduleBar(comp, rev)
}

export function stopMusic() {
  if(!bgRunning||!ctx) return
  bgRunning=false
  masterBg.gain.linearRampToValueAtTime(0, ctx.currentTime+1.8)
  bgTimers.forEach(clearTimeout); bgTimers=[]
  setTimeout(()=>{ bgNodes.forEach(n=>{try{n.stop()}catch{}}); bgNodes=[] }, 2500)
}

export function setMusicVol(v) {
  bgVol=v
  if(masterBg&&ctx) masterBg.gain.setTargetAtTime(v, ctx.currentTime, .3)
}

export function isMusicOn() { return bgRunning }

// Aliases
export const soundClick=()=>sfx.click()
export const soundCorrect=()=>sfx.correct()
export const soundWrong=()=>sfx.wrong()
export const soundAttack=()=>sfx.attack()
export const soundHit=()=>sfx.hit()
export const soundDefend=()=>sfx.defend()
export const soundRoundStart=()=>sfx.roundStart()
export const soundWinTeam=()=>sfx.winTeam()
export const soundLose=()=>sfx.lose()
export const soundQuestion=()=>sfx.question()
export const soundTick=()=>sfx.tick()
export const soundJoin=()=>sfx.join()
export const soundReady=()=>sfx.ready()
export const soundDanger=()=>sfx.danger()
