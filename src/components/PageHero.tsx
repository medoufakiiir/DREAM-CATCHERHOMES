import { motion } from 'motion/react'

export default function PageHero({ image, label, title, sub, short = false }: { image: string; label: string; title: string; sub?: string; short?: boolean }) {
  return (
    <section className={`relative ${short ? 'h-[46vh] min-h-[380px]' : 'h-[64vh] min-h-[460px]'} overflow-hidden bg-ocean-900 grain`}>
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover kenburns" />
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/85 via-ocean-900/20 to-ocean-900/45" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-12 sm:pb-16"
      >
        <p className="eyebrow flex items-center gap-3 text-white/80">
          <span className="h-px w-8 bg-white/60" />
          {label}
        </p>
        <h1 className="font-heading text-white text-5xl sm:text-7xl leading-[1] mt-5 max-w-4xl">{title}</h1>
        {sub && <p className="font-body text-sm sm:text-base text-white/75 mt-5 max-w-xl leading-relaxed">{sub}</p>}
      </motion.div>
    </section>
  )
}
