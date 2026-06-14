import { motion } from 'motion/react'
import { Clock, Utensils, Leaf, Sun } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

const photos = Array.from({ length: 42 }, (_, i) => `/photo${String(i + 1).padStart(2, '0')}.jpg`)

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function DietBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-body px-2.5 py-1 rounded-full border border-green-500/20">
      <Leaf size={10} />
      {label}
    </span>
  )
}

export default function Dining() {
  const { tr, dark } = useApp()

  const restaurants = [
    {
      key: 'r1',
      name: tr.dining.r1_name,
      tagline: tr.dining.r1_tagline,
      desc: tr.dining.r1_desc,
      hours: tr.dining.r1_hours,
      mood: tr.dining.r1_mood,
      accentPhoto: photos[13],
      gridPhotos: [photos[18], photos[22], photos[27]],
      cuisines: ['Chinese', 'French', 'Mediterranean', 'Middle Eastern', 'Moroccan', 'Pizza', 'Seafood', 'BBQ'],
      highlight: null,
    },
    {
      key: 'r2',
      name: tr.dining.r2_name,
      tagline: tr.dining.r2_tagline,
      desc: tr.dining.r2_desc,
      hours: tr.dining.r2_hours,
      mood: tr.dining.r2_mood,
      accentPhoto: photos[19],
      gridPhotos: [photos[24], photos[29], photos[33]],
      cuisines: ['American', 'French', 'Indian', 'Italian', 'Moroccan'],
      highlight: tr.dining.r2_breakfast,
    },
  ]

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-white'}>
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={photos[13]} alt="Dining at DreamCatcher Homes" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/30 to-ocean-900/85" />
        <div className="absolute inset-0 flex items-end pb-12 justify-center text-center px-5">
          <div className="text-white">
            <p className="font-body text-xs uppercase tracking-widest text-gold mb-2">{tr.dining.page_label}</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold">{tr.dining.page_title}</h1>
            <p className="font-body text-base mt-2 opacity-75">{tr.dining.page_sub}</p>
          </div>
        </div>
      </div>

      {/* Restaurants */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-24">
          {restaurants.map((r, ri) => (
            <div key={r.key} className={cn('grid grid-cols-1 lg:grid-cols-2 gap-14 items-start', ri % 2 === 1 && 'lg:[direction:rtl] *:[direction:ltr]')}>
              {/* Photos */}
              <Reveal delay={0}>
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden aspect-[16/10] group">
                    <img src={r.accentPhoto} alt={r.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {r.gridPhotos.map((src, i) => (
                      <div key={i} className="rounded-xl overflow-hidden aspect-square group">
                        <img src={src} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Info */}
              <Reveal delay={0.15}>
                <div>
                  <p className="font-body text-xs uppercase tracking-widest text-gold mb-3">
                    {ri === 0 ? 'Fine Dining' : 'Casual Dining'}
                  </p>
                  <h2 className={`font-heading text-4xl sm:text-5xl font-bold mb-2 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>
                    {r.name}
                  </h2>
                  <p className={`font-body text-sm mb-6 ${dark ? 'text-sand-300/60' : 'text-ocean-300'}`}>{r.tagline}</p>
                  <div className="w-10 h-0.5 bg-gold mb-7" />

                  <p className={`font-body text-base leading-relaxed mb-8 ${dark ? 'text-sand-300/80' : 'text-ocean-400'}`}>
                    {r.desc}
                  </p>

                  {/* Highlight badge */}
                  {r.highlight && (
                    <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold font-body text-sm font-semibold px-4 py-2 rounded-full mb-6">
                      <Sun size={14} />
                      {r.highlight}
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <Clock size={15} className="text-gold mt-0.5 shrink-0" />
                      <div>
                        <p className={`font-body text-xs uppercase tracking-widest mb-1 ${dark ? 'text-sand-400' : 'text-ocean-300'}`}>Hours</p>
                        <p className={`font-body text-sm ${dark ? 'text-sand-200' : 'text-ocean-500'}`}>{r.hours}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Utensils size={15} className="text-gold mt-0.5 shrink-0" />
                      <div>
                        <p className={`font-body text-xs uppercase tracking-widest mb-2 ${dark ? 'text-sand-400' : 'text-ocean-300'}`}>Cuisines</p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.cuisines.map(c => (
                            <span key={c} className={cn('font-body text-xs px-2.5 py-1 rounded-full', dark ? 'bg-ocean-700 text-sand-200' : 'bg-sand-100 text-ocean-500')}>
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dietary */}
                  <div>
                    <p className={`font-body text-xs uppercase tracking-widest mb-3 ${dark ? 'text-sand-400' : 'text-ocean-300'}`}>
                      {tr.dining.dietary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[tr.dining.halal, tr.dining.vegetarian, tr.dining.vegan, tr.dining.gluten, tr.dining.dairy].map(d => (
                        <DietBadge key={d} label={d} />
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Ambiance strip */}
      <div className={`py-14 ${dark ? 'bg-ocean-800' : 'bg-sand-50'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[photos[35], photos[37], photos[39], photos[41]].map((src, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="rounded-xl overflow-hidden aspect-square">
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
