// abilities.js — Sistema de habilidades por personaje v2
// Cada jugador tiene ABILITY_CHARGES cargas totales por partida
// Se pueden usar durante el turno activo antes de responder

export const ABILITY_CHARGES = 3

export const ABILITIES = {
  fiftyFifty: {
    id:      'fiftyFifty',
    name:    '50/50',
    icon:    '⚡',
    color:   '#f0e040',
    desc:    'Elimina 2 opciones incorrectas',
    effect:  'fifty',
    target:  'question',
  },
  doubleDown: {
    id:      'doubleDown',
    name:    'Doble Apuesta',
    icon:    '🎯',
    color:   '#ff8c42',
    desc:    'Acierto: +20 pts extra | Fallo: -10 HP extra',
    effect:  'double',
    target:  'self',
  },
  shield: {
    id:      'shield',
    name:    'Escudo',
    icon:    '🛡',
    color:   '#3dffc0',
    desc:    'Cancela el daño si fallas esta pregunta',
    effect:  'shield',
    target:  'self',
  },
  callTeammate: {
    id:      'callTeammate',
    name:    'Llamar Aliado',
    icon:    '🤝',
    color:   '#4a90d9',
    desc:    'Un compañero de equipo responde por ti (solo local)',
    effect:  'teamup',
    target:  'teammate',
  },
  sabotage: {
    id:      'sabotage',
    name:    'Sabotaje',
    icon:    '💀',
    color:   '#ff3d5a',
    desc:    'Si el rival falla, recibe 10 HP extra de daño',
    effect:  'sabotage',
    target:  'enemy',
  },
  reveal: {
    id:      'reveal',
    name:    'Revelar',
    icon:    '🔍',
    color:   '#cc55ff',
    desc:    'Muestra cuál es la respuesta correcta por 2s',
    effect:  'reveal',
    target:  'question',
  },
}

// Habilidades disponibles por clase
export const SPRITE_ABILITIES = {
  knight:  ['fiftyFifty', 'shield',        'doubleDown'],
  mage:    ['fiftyFifty', 'reveal',         'sabotage'],
  rogue:   ['fiftyFifty', 'doubleDown',    'sabotage'],
  ranger:  ['fiftyFifty', 'shield',        'reveal'],
  paladin: ['fiftyFifty', 'shield',        'callTeammate'],
  warlock: ['sabotage',   'doubleDown',    'reveal'],
}

export function getPlayerAbilities(spriteId) {
  const ids = SPRITE_ABILITIES[spriteId] ?? ['fiftyFifty', 'shield', 'doubleDown']
  return ids.map(id => ABILITIES[id])
}

// Inicializar cargas de habilidades para todos los jugadores
export function initAbilityCharges(players) {
  return Object.fromEntries(players.map(p => [p.id, ABILITY_CHARGES]))
}
