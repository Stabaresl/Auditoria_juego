// triviaEngine.js
// Generates multiple-choice trivia questions from CHAPTERS data
// Each concept becomes a question: "What is [concept]?" with 1 correct + 3 wrong answers

import { CHAPTERS } from './gameData.js'

// Flatten all REAL concepts from all chapters/rounds
function getAllRealConcepts() {
  const all = []
  CHAPTERS.forEach(ch => {
    ch.rounds.forEach(r => {
      r.concepts.forEach(c => {
        if (!c.fake) all.push({ ...c, topic: r.topic, chapterName: ch.name })
      })
    })
  })
  return all
}

// Shuffle helper
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Generate a question from one concept
// Correct answer = concept name
// Wrong answers = 3 other concept names from different topics
function makeQuestion(concept, allConcepts) {
  const distractors = shuffle(
    allConcepts.filter(c => c.id !== concept.id && c.topic !== concept.topic)
  ).slice(0, 3)

  const options = shuffle([
    { text: concept.name, correct: true },
    ...distractors.map(d => ({ text: d.name, correct: false })),
  ])

  return {
    id: concept.id,
    question: `¿Cuál de los siguientes conceptos se define como:\n"${concept.definition}"`,
    shortDef: concept.definition,
    topic: concept.topic,
    chapterName: concept.chapterName,
    correctName: concept.name,
    options,
  }
}

// Build a shuffled bank of N questions
export function buildQuestionBank(n = 40) {
  const all = getAllRealConcepts()
  const shuffled = shuffle(all)
  return shuffled.slice(0, Math.min(n, shuffled.length)).map(c => makeQuestion(c, all))
}

// Get next question from bank, cycling if needed
export function getQuestion(bank, usedIds) {
  const available = bank.filter(q => !usedIds.includes(q.id))
  if (available.length === 0) return bank[Math.floor(Math.random() * bank.length)]
  return available[Math.floor(Math.random() * available.length)]
}
