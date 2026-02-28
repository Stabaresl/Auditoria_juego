// sounds.js — Web Audio API, sin dependencias externas

let ctx = null
let masterFx = null   // efectos de sonido
let masterBg = null   // música de fondo
let bgRunning = false
let bgNodes = []
let bgTimers = []
let bgVol = 0.14

function ac() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    masterFx = ctx.createGain(); masterFx.gain.value = 0.4; masterFx.connect(ctx.destination)
    masterBg = ctx.createGain(); masterBg.gain.value = 0;  masterBg.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Reverb sintético
function mkReverb(dur = 2.5) {
  const c = ac(), conv = c.createConvolver()
  const len = c.sampleRate * dur
  const buf = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/len, 2.2)
  }
  conv.buffer = buf
  conv.connect(masterBg)
  return conv
}

// Oscilador con envelope
function osc(freq, type, vol, atk, rel, dest, delay = 0) {
  const c = ac()
  const o = c.createOscillator(), g = c.createGain()
  o.type = type; o.frequency.value = freq
  o.connect(g); g.connect(dest ?? masterFx)
  const t = c.currentTime + delay
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(vol, t + atk)
  g.gain.exponentialRampToValueAtTime(.0001, t + atk + rel)
  o.start(t); o.stop(t + atk + rel + .05)
}

function vib(pat) { if (navigator.vibrate) navigator.vibrate(pat) }

// ── FX ─────────────────────────────────────────────────────
export const sfx = {
  click:      () => { osc(900,'sine',.12,.01,.07); osc(1400,'sine',.07,.01,.05,undefined,.03) },
  reveal:     () => { [261,329,392].forEach((f,i) => osc(f,'sine',.18,.01,.22,undefined,i*.07)); vib(30) },
  impostor:   () => {
    osc(200,'sawtooth',.18,.01,.18); osc(188,'sawtooth',.15,.01,.25,undefined,.06)
    osc(140,'square',.12,.01,.35,undefined,.22); osc(75,'sawtooth',.1,.01,.5,undefined,.42)
    vib([55,30,90,30,55])
  },
  ready:      () => { [523,659,784].forEach((f,i) => osc(f,'sine',.18,.01,.18,undefined,i*.09)); vib(40) },
  vote:       () => { osc(210,'triangle',.18,.01,.45); osc(197,'triangle',.12,.01,.4,undefined,.12); vib(60) },
  voteConfirm:() => { osc(440,'sine',.15,.01,.1); osc(880,'sine',.1,.01,.12,undefined,.07); vib([20,10,20]) },
  winTeam:    () => { [523,659,784,1046].forEach((f,i)=>osc(f,'sine',.25,.01,.35,undefined,i*.1)); osc(1046,'sine',.2,.01,.7,undefined,.5); vib([100,50,100,50,200]) },
  winImpostor:() => { [196,185,165,110].forEach((f,i)=>osc(f,'sawtooth',.2,.01,.45,undefined,i*.18)); vib([200,100,300]) },
  tick:       () => { osc(920,'square',.08,.005,.04); vib(10) },
  debateStart:() => { [349,440,523].forEach((f,i)=>osc(f,'sine',.15,.01,.2,undefined,i*.1)); vib([30,20,60]) },
  join:       () => { osc(440,'sine',.12,.01,.1); osc(554,'sine',.09,.01,.12,undefined,.08); vib(25) },
}

// ── MÚSICA AMBIENTAL ────────────────────────────────────────
// Escala pentatónica menor de Do — relajante, no intrusiva
const PENTA = [65.41,77.78,87.31,98,116.54, 130.81,155.56,174.61,196,233.08, 261.63,311.13,349.23,392,466.16, 523.25,622.25,698.46]

const CHORDS = [
  [130.81,155.56,196],   // Cm
  [155.56,196,233.08],   // Eb
  [130.81,174.61,233.08],// Fm
  [98,130.81,155.56],    // Gm
]

function bgNote(freq, vol, atk, rel, dest) {
  const c = ac()
  const o = c.createOscillator(), g = c.createGain()
  const filt = c.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=900
  o.type = 'sine'; o.frequency.value = freq
  o.detune.value = (Math.random()-.5)*6
  o.connect(filt); filt.connect(g); g.connect(dest)
  const t = c.currentTime
  g.gain.setValueAtTime(0,t)
  g.gain.linearRampToValueAtTime(vol, t+atk)
  g.gain.exponentialRampToValueAtTime(.0001, t+atk+rel)
  o.start(t); o.stop(t+atk+rel+.1)
  bgNodes.push(o)
}

function scheduleMelody(rev) {
  if (!bgRunning) return
  const freq = PENTA[5 + Math.floor(Math.random()*9)]
  bgNote(freq, .038, .35, 2.5+Math.random()*2, rev)
  const next = 2200 + Math.random()*3200
  bgTimers.push(setTimeout(() => scheduleMelody(rev), next))
}

function schedulePad(rev) {
  if (!bgRunning) return
  const chord = CHORDS[Math.floor(Math.random()*CHORDS.length)]
  chord.forEach(f => bgNote(f, .022, 1.8, 7, rev))
  bgTimers.push(setTimeout(() => schedulePad(rev), 8500))
}

function startDrones(rev) {
  [[65.41,'sine',.1],[98,'sine',.065],[130.81,'triangle',.04,4]].forEach(([f,t,v,d=0])=>{
    const c = ac(), o = c.createOscillator(), g = c.createGain()
    o.type = t; o.frequency.value = f; o.detune.value = d
    o.connect(g); g.connect(masterBg); g.connect(rev)
    g.gain.value = v; o.start()
    bgNodes.push(o)
  })
}

export function startMusic() {
  if (bgRunning) return
  bgRunning = true
  ac()
  const rev = mkReverb(3)
  masterBg.gain.setValueAtTime(0, ctx.currentTime)
  masterBg.gain.linearRampToValueAtTime(bgVol, ctx.currentTime + 4)
  startDrones(rev)
  schedulePad(rev)
  bgTimers.push(setTimeout(() => scheduleMelody(rev), 2000))
}

export function stopMusic() {
  if (!bgRunning || !ctx) return
  bgRunning = false
  masterBg.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5)
  bgTimers.forEach(clearTimeout); bgTimers = []
  setTimeout(() => { bgNodes.forEach(n => { try { n.stop() } catch {} }); bgNodes = [] }, 3000)
}

export function setMusicVol(v) {
  bgVol = v
  if (masterBg && ctx) masterBg.gain.setTargetAtTime(v, ctx.currentTime, .4)
}

export function isMusicOn() { return bgRunning }

// ── EXPORTS INDIVIDUALES (alias de sfx) ────────────────────
// Permiten importar por nombre: import { soundClick } from './sounds'
export const soundClick       = () => sfx.click()
export const soundDebateStart = () => sfx.debateStart()
export const soundWinPlayers  = () => sfx.winTeam()
export const soundWinImpostor = () => sfx.winImpostor()
export const soundPlayerJoin  = () => sfx.join()
export const soundReveal      = () => sfx.reveal()
export const soundImpostor    = () => sfx.impostor()
export const soundReady       = () => sfx.ready()
export const soundVote        = () => sfx.vote()
export const soundVoteConfirm = () => sfx.voteConfirm()
export const soundTick        = () => sfx.tick()