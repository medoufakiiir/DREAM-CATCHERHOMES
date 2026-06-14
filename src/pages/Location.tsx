import { motion } from 'motion/react'
import { MapPin, Plane, Car, Navigation } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

const photos = Array.from({ length: 42 }, (_, i) => `/photo${String(i + 1).padStart(2, '0')}.jpg`)

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const distances = [
  { label: 'Tamelalt Beach', value: '50 m' },
  { label: 'Sand Dunes', value: '350 m' },
  { label: 'Café de Rego', value: '17 km' },
  { label: 'Zanzan Coffee', value: '18 km' },
  { label: 'Agadir Al-Massira Airport', value: '99 km' },
  { label: 'Goulimime Airport', value: '105 km' },
]

export default function Location() {
  const { tr, dark } = useApp()

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-white'}>
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={photos[5]} alt="Mirleft Morocco location" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/30 to-ocean-900/80" />
        <div className="absolute inset-0 flex items-end pb-12 justify-center text-center px-5">
          <div className="text-white">
            <p className="font-body text-xs uppercase tracking-widest text-gold mb-2">{tr.location.page_label}</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold">{tr.location.page_title}</h1>
            <p className="font-body text-base mt-2 opacity-75">{tr.location.page_sub}</p>
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: distances + getting here */}
            <div>
              <Reveal>
                <p className="font-body text-xs uppercase tracking-widest text-gold mb-4">{tr.location.distances_title}</p>
                <h2 className={`font-heading text-3xl sm:text-4xl mb-8 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>
                  {tr.location.distances_title}
                </h2>
                <div className={cn('rounded-2xl overflow-hidden', dark ? 'bg-ocean-800' : 'bg-sand-50')}>
                  {distances.map(({ label, value }, i) => (
                    <div
                      key={label}
                      className={cn(
                        'flex items-center justify-between px-6 py-4 font-body text-sm',
                        i !== distances.length - 1 && (dark ? 'border-b border-white/5' : 'border-b border-sand-200'),
                        i === 0 && 'bg-gold/5'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin size={13} className={i === 0 ? 'text-gold' : dark ? 'text-sand-400' : 'text-ocean-300'} />
                        <span className={dark ? 'text-sand-200' : 'text-ocean-500'}>{label}</span>
                      </div>
                      <span className={cn('font-semibold', i === 0 ? 'text-gold' : dark ? 'text-sand-300' : 'text-ocean-400')}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Getting here */}
              <Reveal delay={0.15} className="mt-12">
                <h3 className={`font-heading text-2xl mb-6 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>
                  {tr.location.getting_here}
                </h3>
                <div className="space-y-6">
                  {[
                    { icon: Plane, title: tr.location.fly, body: tr.location.fly_body },
                    { icon: Car, title: tr.location.drive, body: tr.location.drive_body },
                  ].map(({ icon: Icon, title, body }) => (
                    <div key={title} className={cn('rounded-xl p-5 flex gap-4', dark ? 'bg-ocean-800' : 'bg-sand-50')}>
                      <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={16} className="text-gold" />
                      </div>
                      <div>
                        <p className={`font-heading text-base font-medium mb-1.5 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>{title}</p>
                        <p className={`font-body text-sm leading-relaxed ${dark ? 'text-sand-300/70' : 'text-ocean-400'}`}>{body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div className={cn('mt-6 rounded-xl p-5 flex gap-4', dark ? 'bg-ocean-800' : 'bg-sand-50')}>
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <Navigation size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className={`font-heading text-base font-medium mb-1 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>Address</p>
                    <p className={`font-body text-sm ${dark ? 'text-sand-300/70' : 'text-ocean-400'}`}>{tr.location.address}</p>
                    <p className={`font-body text-xs mt-1 ${dark ? 'text-sand-400' : 'text-ocean-300'}`}>{tr.location.coords}</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: Map */}
            <Reveal delay={0.2}>
              <div className="sticky top-24 space-y-5">
                <div className="rounded-2xl overflow-hidden shadow-xl h-[420px]">
                  <iframe
                    title="DreamCatcher Homes — Mirleft Morocco"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3407.4399!2d-9.9519!3d29.7052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDQyJzE5LjAiTiA5wrA1NicyNi40Ilc!5e0!3m2!1sen!2sma!4v1"
                    className="border-0 w-full h-full"
                    allowFullScreen
                  />
                </div>

                {/* Photo collage */}
                <div className="grid grid-cols-3 gap-2">
                  {[photos[6], photos[10], photos[16]].map((src, i) => (
                    <div key={i} className="rounded-xl overflow-hidden aspect-square">
                      <img src={src} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
