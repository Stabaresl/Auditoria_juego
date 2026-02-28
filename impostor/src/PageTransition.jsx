// PageTransition.jsx
// Wrapper que anima la entrada/salida de cada pantalla.
// Requiere: npm install framer-motion

import { motion, AnimatePresence } from 'framer-motion'

const variants = {
  initial:  { opacity: 0, y: 30, scale: 0.98, filter: 'blur(4px)' },
  animate:  { opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)',
               transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:     { opacity: 0, y: -20, scale: 1.01, filter: 'blur(3px)',
               transition: { duration: 0.25, ease: 'easeIn' } },
}

export function PageTransition({ children, keyId }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyId}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ minHeight: '100vh', width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Variante para elementos que aparecen en cascada (stagger)
export function StaggerChild({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Animación de entrada para cards individuales
export function CardReveal({ children, delay = 0, flip = false }) {
  return (
    <motion.div
      initial={flip
        ? { rotateY: 90, opacity: 0, scale: 0.9 }
        : { opacity: 0, scale: 0.92, y: 16 }
      }
      animate={flip
        ? { rotateY: 0, opacity: 1, scale: 1 }
        : { opacity: 1, scale: 1, y: 0 }
      }
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: '1000px' }}
    >
      {children}
    </motion.div>
  )
}

// Shake para el impostor
export function ShakeReveal({ children, active }) {
  return (
    <motion.div
      animate={active ? {
        x: [0, -12, 12, -8, 8, -4, 4, 0],
        rotate: [0, -2, 2, -1, 1, 0],
      } : {}}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

// Número animado que cuenta hacia abajo (countdown)
export function AnimatedNumber({ value, color }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: -20, opacity: 0, scale: 1.3 }}
        animate={{ y: 0,   opacity: 1, scale: 1 }}
        exit={{    y:  20, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}
        style={{ display: 'inline-block', color }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )
}
