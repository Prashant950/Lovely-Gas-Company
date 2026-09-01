import { motion } from 'framer-motion'

/**
 * Lightweight scroll-reveal wrapper built on Framer Motion.
 * Fades + slides its children up when they enter the viewport.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
  once = true,
  as: Tag = motion.div,
}) {
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Tag>
  )
}
