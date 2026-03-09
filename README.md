# ⚔ Trivia Battle — Aseguramiento & Auditoría de TI

Juego de trivia por equipos con estética pixel-art RPG, basado en conceptos académicos reales de Aseguramiento y Auditoría de Tecnologías de Información.

## Mecánica

- **2 equipos** de hasta 3 jugadores cada uno
- **Barra de HP compartida** por equipo (100 HP)
- Cada turno, un jugador de cada equipo se enfrenta con una pregunta de trivia
- Si **fallas** → el rival ataca → **-20 HP** a tu equipo
- Si **aciertas** → +10 puntos personales
- Gana el equipo que deje al rival en **0 HP**

## Stack

| Tecnología       | Uso                            |
|------------------|-------------------------------|
| React 18 + Vite  | SPA + bundler                 |
| Framer Motion    | Animaciones de batalla         |
| Firebase RTDB    | Multijugador online en tiempo real |
| Web Audio API    | Motor de sonido (sin deps)    |
| CSS Modules      | Estilos encapsulados           |
| canvas-confetti  | Efectos de victoria            |
| SVG pixel art    | Personajes (sin assets externos)|

## Instalación

```bash
git clone <repo>
cd trivia-battle
npm install
cp .env.example .env
# Rellena .env con tus credenciales de Firebase
npm run dev
```

## Firebase Setup

1. Ir a [console.firebase.google.com](https://console.firebase.google.com)
2. Crear proyecto → Realtime Database → Crear base de datos
3. Reglas (desarrollo): `{ "rules": { ".read": true, ".write": true } }`
4. Copiar configuración en `.env`

## Despliegue en Vercel

```bash
# Conectar repo en vercel.com
# Agregar variables de entorno (las mismas del .env)
# Build command: npm run build
# Output dir: dist
```

## Estructura

```
src/
├── App.jsx                  # Orquestador principal
├── main.jsx                 # Punto de entrada
├── index.css                # Sistema de diseño pixel RPG
├── sounds.js                # Motor Web Audio API
├── firebase.js              # Firebase helpers
├── useRoom.js               # Hook modo online
├── triviaEngine.js          # Generador de preguntas
├── gameData.js              # 54+ conceptos académicos
├── MusicBtn.jsx             # Control de música
├── components/
│   ├── sprites.jsx          # Pixel art SVG personajes
│   └── BattleBg.jsx         # Fondo animado
└── screens/
    ├── HomeScreen.jsx
    ├── LobbyScreen.jsx
    ├── BattleScreen.jsx
    ├── ResultScreen.jsx
    ├── OnlineSetupScreen.jsx
    └── OnlineLobbyScreen.jsx
```

## Equipo

Ricardo · Brayan · Santiago — Universidad 2024
