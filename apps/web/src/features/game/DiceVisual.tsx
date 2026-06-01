import { motion } from 'framer-motion'

export function DiceVisual({ value, isRolling = false }: { value?: number | bigint; isRolling?: boolean }) {
  return (
    <motion.div
      className="inline-flex h-16 w-16 items-center justify-center rounded-sm border border-slate-300 bg-white text-2xl font-black"
      animate={
        isRolling
          ? {
              rotate: [0, -10, 10, -6, 6, 0],
              scale: [1, 1.07, 0.96, 1.05, 1],
            }
          : {
              rotate: 0,
              scale: 1,
            }
      }
      transition={
        isRolling
          ? {
              duration: 0.75,
              ease: 'easeInOut',
              repeat: Infinity,
            }
          : {
              duration: 0.25,
              ease: 'easeOut',
            }
      }
    >
      🍪{value ? `#${value.toString()}` : ''}
    </motion.div>
  )
}
