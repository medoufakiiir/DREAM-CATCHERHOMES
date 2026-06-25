import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Bed, Bath, Users, Check, Star, Waves, Wifi, Car, ChevronRight } from 'lucide-react'
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

interface VillaProps {
  name: string
  badge: string
  badgeColor: string
  desc: string
  beds: { label: string }[]
  photos: string[]
  delay: number
}

function VillaCard({ name, badge, badgeColor, desc, beds, photos: vPhotos, delay }: VillaProps) {
  const { tr, dark } = useApp()
  const features = [tr.villas.pool, tr.villas.sea_view, tr.villas.kitchen, tr.villas.balcony, tr.villas.wifi]

  return (
    <Reveal delay={delay}>
      <div className={cn('rounded-3xl overflow-hidden shadow-xl', dark ? 'bg-ocean-800' : 'bg-white border border-sand-100')}>
        {/* Photo grid */}
        <div className="grid grid-cols-3 gap-1 h-72 md:h-96">
          <div className="col-span-2 relative overflow-hidden group">
            <img src={vPhotos[0]} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className={`absolute top-4 left-4 text-xs font-semibold font-body px-3 py-1 rounded-full ${badgeColor}`}>
              {badge}
            </span>
          </div>
          <div className="grid grid-rows-2 gap-1">
            {vPhotos.slice(1, 3).map((src, i) => (
              <div key={i} className="overflow-hidden group">
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
                <div>
                  <h2 className={`font-heading text-3xl font-bold mb-1 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>{name}</h2>
                  <div className="flex items-center gap-1.5 text-gold font-body text-sm">
                    <Waves size={13} />
                    <span>50m from Tamelalt Beach · Club Evasion Resort</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-gold/10 px-3 py-1.5 rounded-full">
                  <Star size={13} fill="#C9A84C" className="text-gold" />
                  <span className="font-body text-sm font-bold text-gold">9.3</span>
                  <span className={`font-body text-xs ${dark ? 'text-sand-300' : 'text-ocean-300'}`}>Superb</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  { icon: Users, val: `4 ${tr.villas.guests}` },
                  { icon: Bed, val: `2 ${tr.villas.beds}` },
                  { icon: Bath, val: `1 ${tr.villas.sqm === 'm²' ? 'bathroom' : 'salle de bain'}` },
                  { icon: Waves, val: `120 ${tr.villas.sqm}` },
                ].map(({ icon: Icon, val }) => (
                  <span key={val} className={cn('flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-body text-sm', dark ? 'bg-ocean-700 text-sand-200' : 'bg-sand-50 text-ocean-500')}>
                    <Icon size={13} className="text-gold" />
                    {val}
                  </span>
                ))}
              </div>

              <p className={`font-body text-base leading-relaxed mb-7 ${dark ? 'text-sand-300/80' : 'text-ocean-400'}`}>{desc}</p>

              {/* Beds */}
              <div className="mb-7">
                <h4 className={`font-heading text-sm uppercase tracking-widest mb-3 ${dark ? 'text-sand-400' : 'text-ocean-300'}`}>Sleeping Arrangements</h4>
                <div className="space-y-2">
                  {beds.map(({ label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <Bed size={14} className="text-gold shrink-0" />
                      <span className={`font-body text-sm ${dark ? 'text-sand-200' : 'text-ocean-400'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <Check size={13} className="text-gold shrink-0" />
                    <span className={`font-body text-sm ${dark ? 'text-sand-200' : 'text-ocean-400'}`}>{f}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Wifi size={13} className="text-gold shrink-0" />
                  <span className={`font-body text-sm ${dark ? 'text-sand-200' : 'text-ocean-400'}`}>{tr.villas.wifi}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car size={13} className="text-gold shrink-0" />
                  <span className={`font-body text-sm ${dark ? 'text-sand-200' : 'text-ocean-400'}`}>Free parking</span>
                </div>
              </div>
            </div>

            {/* Right: pricing widget */}
            <div>
              <div className={cn('rounded-2xl p-6 sticky top-24', dark ? 'bg-ocean-700' : 'bg-sand-50')}>

                <div className={cn('space-y-2 text-xs font-body mb-6 pb-5 border-b', dark ? 'text-sand-300 border-white/10' : 'text-ocean-400 border-sand-200')}>
                  {[
                    { icon: Check, text: tr.villas.free_cancel },
                    { icon: Check, text: tr.villas.no_prepay },
                    { icon: Check, text: tr.villas.pay_property },
                    { icon: Check, text: tr.villas.checkin },
                    { icon: Check, text: tr.villas.checkout },
                  ].map(({ icon: Icon, text }) => (
                    <p key={text} className="flex items-center gap-1.5">
                      <Icon size={11} className="text-green-500 shrink-0" />
                      {text}
                    </p>
                  ))}
                </div>

                <p className={`font-body text-xs text-center mb-3 ${dark ? 'text-sand-400' : 'text-ocean-300'}`}>{tr.villas.payment}</p>

                <div className="space-y-2">
                  <Link
                    to="/booking"
                    className="w-full flex justify-center items-center gap-1.5 bg-gold hover:bg-gold-600 text-white font-body text-sm font-medium py-3.5 rounded-xl transition-colors cursor-pointer"
                  >
                    {tr.villas.book_btn} <ChevronRight size={14} />
                  </Link>
                  <a
                    href="https://wa.me/212671779770"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn('w-full flex justify-center items-center gap-1.5 font-body text-sm py-3.5 rounded-xl border transition-colors cursor-pointer', dark ? 'border-white/10 text-sand-200 hover:border-gold/50' : 'border-sand-200 text-ocean-500 hover:border-gold')}
                  >
                    {tr.villas.wa_btn}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export default function Villas() {
  const { tr, dark } = useApp()

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-white'}>
      {/* Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img src={photos[0]} alt="DreamCatcher Homes villas" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/30 to-ocean-900/80" />
        <div className="absolute inset-0 flex items-end pb-12 justify-center text-center px-5">
          <div className="text-white">
            <p className="font-body text-xs uppercase tracking-widest text-gold mb-2">{tr.villas.page_label}</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold">{tr.villas.page_title}</h1>
            <p className="font-body text-base mt-2 opacity-75">{tr.villas.page_sub}</p>
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-14">
          <VillaCard
            name={tr.villas.v1_name}
            badge={tr.villas.v1_badge}
            badgeColor="bg-gold text-white"
            desc={tr.villas.v1_desc}
            beds={[{ label: tr.villas.v1_bed1 }, { label: tr.villas.v1_bed2 }, { label: tr.villas.v1_living }]}
            photos={[photos[1], photos[5], photos[9]]}
            delay={0}
          />
          <VillaCard
            name={tr.villas.v2_name}
            badge={tr.villas.v2_badge}
            badgeColor="bg-ocean-500 text-white"
            desc={tr.villas.v2_desc}
            beds={[{ label: tr.villas.v2_bed1 }, { label: tr.villas.v2_bed2 }]}
            photos={[photos[7], photos[12], photos[17]]}
            delay={0.1}
          />
        </div>
      </section>
    </div>
  )
}
