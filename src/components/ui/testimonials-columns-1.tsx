import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface Testimonial {
  text: string
  image: string
  name: string
  role: string
}

interface TestimonialsColumnProps {
  testimonials: Testimonial[]
  className?: string
  duration?: number
}

export function TestimonialsColumn({ testimonials, className, duration = 15 }: TestimonialsColumnProps) {
  const doubled = [...testimonials, ...testimonials]

  return (
    <div className={cn('flex flex-col gap-4 overflow-hidden', className)}>
      <motion.div
        animate={{ y: ['0%', '-50%'] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-4"
      >
        {doubled.map((t, i) => (
          <div
            key={i}
            className="bg-white dark:bg-ocean-800 border border-sand-100 dark:border-white/5 rounded-2xl p-5 shadow-sm max-w-[280px]"
          >
            <p className="text-ocean-500 dark:text-sand-200 text-sm leading-relaxed font-body mb-4">
              "{t.text}"
            </p>
            <div className="flex items-center gap-3">
              <img
                src={t.image}
                alt={t.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-gold/30"
                loading="lazy"
              />
              <div>
                <p className="font-heading text-sm font-semibold text-ocean-500 dark:text-sand-100 leading-tight">
                  {t.name}
                </p>
                <p className="font-body text-xs text-ocean-400 dark:text-sand-300 opacity-70 mt-0.5">
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
