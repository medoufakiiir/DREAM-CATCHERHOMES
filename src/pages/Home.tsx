import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { Star, Waves, ChevronDown, CalendarDays, Award, CreditCard, BadgeCheck } from 'lucide-react'
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1'
import { useApp } from '@/context/AppContext'
import { testimonials } from '@/i18n/translations'
import { cn } from '@/lib/utils'

const photos = Array.from({ length: 42 }, (_, i) => `/photo${String(i + 1).padStart(2, '0')}.jpg`)

function Reveal({ children, delay = 0, y = 32, className = '' }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const firstColumn  = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn  = testimonials.slice(6, 9)

export default function Home() {
  const { tr, dark } = useApp()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY   = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const bgOp  = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-white'}>

      {/* ═══════════ HERO ═══════════ */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
          <img
            src={photos[16]}
            alt="DreamCatcher Homes — Mirleft Morocco beachfront villa"
            className="w-full h-[115%] object-cover object-top"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/30 via-ocean-900/20 to-ocean-900/80" />
        </motion.div>

        <motion.div
          style={{ opacity: bgOp }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-white px-5 text-center"
        >
          <Reveal delay={0.05}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-body text-xs tracking-widest uppercase">{tr.home.badge}</span>
            </div>
          </Reveal>

          <Reveal delay={0.15} y={48}>
            <h1 className="font-heading font-bold leading-none tracking-tight">
              <span className="block text-xl sm:text-2xl italic text-gold/90 mb-2 font-normal">{tr.home.headline_1}</span>
              <span className="block text-7xl sm:text-8xl md:text-9xl lg:text-[10rem]">{tr.home.headline_2}</span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="font-body text-base sm:text-lg text-white/75 max-w-xl leading-relaxed mt-6 mb-10">
              {tr.home.sub}
            </p>
          </Reveal>

          <Reveal delay={0.42}>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-white font-body font-medium px-8 py-3.5 rounded-full transition-colors duration-200 cursor-pointer shadow-xl shadow-gold/30 text-sm"
              >
                <CalendarDays size={16} />
                {tr.home.cta_book}
              </Link>
              <Link
                to="/villas"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/70 text-white font-body text-sm px-8 py-3.5 rounded-full backdrop-blur-sm transition-colors duration-200 cursor-pointer"
              >
                {tr.home.cta_villas}
              </Link>
            </div>
          </Reveal>

          {/* Rating pill */}
          <Reveal delay={0.55} className="mt-10">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#C9A84C" className="text-gold" />)}
              </div>
              <span className="font-body text-xs font-semibold text-white">{tr.home.stats_rating}</span>
              <span className="text-white/30 text-xs">·</span>
              <span className="font-body text-xs text-white/70">{tr.home.stats_reviews}</span>
            </div>
          </Reveal>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50 cursor-default"
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          <span className="font-body text-[9px] tracking-widest uppercase">{tr.home.scroll}</span>
          <ChevronDown size={16} />
        </motion.div>
      </section>

      {/* ═══════════ STATS STRIP ═══════════ */}
      <section className="bg-gold">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white font-body text-sm">
            {[
              { label: tr.home.stats_rating, bold: true },
              { label: tr.home.stats_reviews },
              { label: tr.home.stats_beach, icon: <Waves size={13} /> },
              { label: tr.home.stats_choice, icon: <Award size={13} /> },
            ].map(({ label, bold, icon }, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {i !== 0 && <span className="hidden sm:block w-px h-3 bg-white/30" />}
                {icon}
                <span className={bold ? 'font-semibold' : 'opacity-85'}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ VILLAS PREVIEW ═══════════ */}
      <section className={`py-24 ${dark ? 'bg-ocean-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal className="text-center mb-16">
            <p className="font-body text-xs uppercase tracking-widest text-gold mb-3">{tr.home.villas_label}</p>
            <h2 className={`font-heading text-4xl sm:text-5xl mb-4 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>
              {tr.home.villas_title}
            </h2>
            <p className={`font-body text-base max-w-lg mx-auto ${dark ? 'text-sand-300/70' : 'text-ocean-400'}`}>
              {tr.home.villas_sub}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { photo: photos[1], name: tr.villas.v1_name, badge: tr.villas.v1_badge, slug: 'Two-Bedroom', delay: 0 },
              { photo: photos[7], name: tr.villas.v2_name, badge: tr.villas.v2_badge, slug: 'Deluxe', delay: 0.1 },
            ].map(({ photo, name, badge, delay }) => (
              <Reveal key={name} delay={delay}>
                <Link to="/villas" className="group block cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                    <img
                      src={photo}
                      alt={name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/80 via-ocean-900/20 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-gold text-white font-body text-xs font-semibold px-3 py-1 rounded-full">
                      {badge}
                    </div>

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="font-heading text-2xl font-semibold text-white mb-1">{name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white/70 font-body text-xs">
                          <span>4 {tr.villas.guests}</span>
                          <span>·</span>
                          <span>120 {tr.villas.sqm}</span>
                          <span>·</span>
                          <span>{tr.villas.pool}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="text-center mt-10">
            <Link
              to="/villas"
              className={`inline-flex items-center gap-2 font-body text-sm px-6 py-3 rounded-full border transition-colors cursor-pointer ${
                dark ? 'border-white/15 text-sand-200 hover:border-gold hover:text-gold' : 'border-sand-200 text-ocean-400 hover:border-gold hover:text-gold'
              }`}
            >
              View full villa details →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ DINING TEASER ═══════════ */}
      <section className={dark ? 'bg-ocean-800' : 'bg-sand-50'}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <Reveal>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                  <img src={photos[13]} alt="Ocean Dunes restaurant" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4] mt-8">
                  <img src={photos[19]} alt="Dunes Beach Bar" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="font-body text-xs uppercase tracking-widest text-gold mb-4">{tr.home.dining_label}</p>
              <h2 className={`font-heading text-4xl sm:text-5xl mb-5 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>
                {tr.home.dining_title}
              </h2>
              <div className="w-10 h-0.5 bg-gold mb-6" />
              <p className={`font-body text-base leading-relaxed mb-8 ${dark ? 'text-sand-300/70' : 'text-ocean-400'}`}>
                {tr.home.dining_sub}
              </p>
              <div className="space-y-4 mb-10">
                {[
                  { name: tr.dining.r1_name, desc: tr.dining.r1_tagline },
                  { name: tr.dining.r2_name, desc: tr.dining.r2_tagline },
                ].map(({ name, desc }) => (
                  <div key={name} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <div>
                      <p className={`font-heading text-base font-medium ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>{name}</p>
                      <p className={`font-body text-sm ${dark ? 'text-sand-300/60' : 'text-ocean-300'}`}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/dining"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-white font-body text-sm font-medium px-6 py-3 rounded-full transition-colors cursor-pointer"
              >
                Explore Dining →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ PHOTO STRIP ═══════════ */}
      <div className="grid grid-cols-4 sm:grid-cols-8 h-28 sm:h-40 overflow-hidden">
        {[photos[4], photos[9], photos[14], photos[20], photos[25], photos[30], photos[35], photos[39]].map((src, i) => (
          <div key={i} className="overflow-hidden">
            <img src={src} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>

      {/* ═══════════ TRUST BADGES ═══════════ */}
      <section className={`py-14 ${dark ? 'bg-ocean-900' : 'bg-white'}`}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: BadgeCheck, title: tr.home.trust_cancel, sub: 'No fees, no risk' },
              { icon: CreditCard, title: tr.home.trust_prepay, sub: 'Pay at property' },
              { icon: Award, title: tr.home.trust_choice, sub: 'Booking.com 2024' },
              { icon: Star, title: tr.home.trust_rating, sub: '246 verified reviews', fill: true },
            ].map(({ icon: Icon, title, sub, fill }) => (
              <Reveal key={title}>
                <div className={cn(
                  'flex flex-col items-center text-center p-5 rounded-2xl',
                  dark ? 'bg-ocean-800' : 'bg-sand-50'
                )}>
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-gold" fill={fill ? '#C9A84C' : 'none'} />
                  </div>
                  <p className={`font-heading text-sm font-semibold mb-1 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>{title}</p>
                  <p className={`font-body text-xs ${dark ? 'text-sand-400' : 'text-ocean-300'}`}>{sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className={`py-20 relative overflow-hidden ${dark ? 'bg-ocean-800' : 'bg-sand-50'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-12 text-center">
            <div className={`border rounded-lg py-1 px-4 font-body text-xs ${dark ? 'border-white/10 text-sand-300' : 'border-sand-200 text-ocean-400'}`}>
              {tr.home.reviews_label}
            </div>
            <h2 className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-5 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>
              {tr.home.reviews_title}
            </h2>
            <p className={`mt-4 font-body text-sm ${dark ? 'text-sand-300/70' : 'text-ocean-400'}`}>
              {tr.home.reviews_sub}
            </p>
          </Reveal>

          <div className="flex justify-center gap-5 mt-8 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:flex" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:flex" duration={17} />
          </div>
        </div>
      </section>

      {/* ═══════════ GALLERY PREVIEW ═══════════ */}
      <section className={`py-24 ${dark ? 'bg-ocean-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal className="text-center mb-12">
            <p className="font-body text-xs uppercase tracking-widest text-gold mb-3">Gallery</p>
            <h2 className={`font-heading text-4xl ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>Life at DreamCatcher</h2>
          </Reveal>

          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <Reveal className="col-span-2 row-span-2">
              <Link to="/gallery" className="block h-full cursor-pointer">
                <div className="relative h-64 md:h-96 overflow-hidden rounded-2xl group">
                  <img src={photos[2]} alt="DreamCatcher Homes" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-ocean-900/0 group-hover:bg-ocean-900/20 transition-colors duration-300" />
                </div>
              </Link>
            </Reveal>
            {[photos[5], photos[11], photos[17], photos[23]].map((src, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <Link to="/gallery" className="block cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl group aspect-square">
                    <img src={src} alt="DreamCatcher Homes" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-ocean-900/0 group-hover:bg-ocean-900/20 transition-colors" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="text-center mt-9">
            <Link to="/gallery" className={`inline-flex items-center gap-2 font-body text-sm px-6 py-3 rounded-full border transition-colors cursor-pointer ${dark ? 'border-white/15 text-sand-200 hover:border-gold hover:text-gold' : 'border-sand-200 text-ocean-400 hover:border-gold hover:text-gold'}`}>
              View all 42 photos →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={photos[9]} alt="" className="w-full h-full object-cover object-center" aria-hidden="true" />
          <div className="absolute inset-0 bg-ocean-900/75" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center text-white">
          <Reveal>
            <p className="font-body text-xs uppercase tracking-widest text-gold mb-4">{tr.home.cta_label}</p>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {tr.home.cta_title}
            </h2>
            <p className="font-body text-base text-white/70 max-w-lg mx-auto mb-10 leading-relaxed">
              {tr.home.cta_sub}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-white font-body font-medium px-8 py-4 rounded-full transition-colors cursor-pointer shadow-xl shadow-gold/30 text-sm"
              >
                <CalendarDays size={16} />
                {tr.home.cta_btn}
              </Link>
              <a
                href="https://wa.me/212671779770"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/25 hover:border-white/60 text-white font-body text-sm px-8 py-4 rounded-full transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.114 1.528 5.836L0 24l6.335-1.51A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 01-5.031-1.387l-.361-.214-3.762.897.939-3.65-.235-.374A9.808 9.808 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                {tr.home.cta_wa}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
