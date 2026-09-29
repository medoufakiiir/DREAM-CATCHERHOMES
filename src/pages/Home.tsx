import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { ArrowRight, ArrowLeft, Plus, Star } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'
import SearchBar from '@/components/SearchBar'
import Seo from '@/components/Seo'
import { useApp } from '@/context/AppContext'
import { testimonials as fallbackReviews } from '@/i18n/translations'
import { photo, VILLAS, waLink } from '@/lib/site'
import { cn } from '@/lib/utils'

/* ─────────────────────────── shared bits ─────────────────────────── */

function Eyebrow({ children, light = false, className = '' }: { children: React.ReactNode; light?: boolean; className?: string }) {
  return (
    <p className={cn('eyebrow flex items-center gap-3', light ? 'text-white/80' : 'text-gold', className)}>
      <span className={cn('h-px w-8', light ? 'bg-white/60' : 'bg-gold')} />
      {children}
    </p>
  )
}

function TextLink({ to, children, light = false }: { to: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.22em] font-semibold pb-1.5 border-b transition-colors',
        light ? 'text-white border-white/40 hover:border-white' : 'text-ocean-500 dark:text-sand-100 border-ocean-500/25 dark:border-white/25 hover:border-gold hover:text-gold'
      )}
    >
      {children}
      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  )
}

/* ─────────────────────────── sections ─────────────────────────── */

function Hero() {
  const { tr } = useApp()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <section ref={ref} className="relative min-h-[100svh] lg:min-h-[720px] overflow-hidden bg-ocean-900 grain flex">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={photo(10)} alt="Private pool overlooking the Atlantic at DreamCatcher Homes, Mirleft" className="w-full h-full object-cover kenburns" fetchPriority="high" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/90 via-ocean-900/25 to-ocean-900/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/50 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pt-32 pb-10 sm:pb-14">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <Eyebrow light>{tr.x.h_eyebrow}</Eyebrow>
          <h1 className="font-heading text-white text-[3.4rem] leading-[0.95] sm:text-7xl lg:text-[7.5rem] mt-6 max-w-5xl">
            {tr.x.h_title_1}<br />
            <em className="font-normal text-sand-100">{tr.x.h_title_2}</em>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        >
          <p className="font-body text-sm sm:text-base text-white/80 max-w-md leading-relaxed">{tr.x.h_sub}</p>
          <div className="hidden sm:flex items-center gap-3 text-white/90">
            <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" className="text-sand-200" />)}</div>
            <span className="font-body text-xs tracking-wide"><b className="font-semibold">9.3</b> · {tr.home.stats_reviews}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mt-8">
          <SearchBar />
        </motion.div>
      </div>
    </section>
  )
}

function Intro() {
  const { tr, dark } = useApp()
  const stats = [
    ['9.3', tr.x.s_rating],
    ['246', tr.x.s_reviews],
    ['50 m', tr.x.s_beach],
    ['2', tr.x.s_villas],
  ]
  return (
    <section className={cn('py-24 sm:py-32', dark ? 'bg-ocean-900' : 'bg-sand-50')}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Eyebrow>{tr.x.i_eyebrow}</Eyebrow>
            <h2 className={cn('font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mt-6', dark ? 'text-sand-100' : 'text-ocean-500')}>
              {tr.x.i_title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:pt-14">
            <p className={cn('font-body text-base leading-[1.85]', dark ? 'text-sand-300/80' : 'text-ocean-400')}>{tr.x.i_body}</p>
            <div className="mt-8"><TextLink to="/location">{tr.nav.location}</TextLink></div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <dl className={cn('mt-20 grid grid-cols-2 lg:grid-cols-4 border-t', dark ? 'border-white/10' : 'border-ocean-500/15')}>
            {stats.map(([n, l], i) => (
              <div key={l} className={cn('pt-8 pb-2 pr-6', i > 0 && 'lg:border-l lg:pl-8', i === 2 && 'max-lg:pt-10', i === 3 && 'max-lg:pt-10', dark ? 'border-white/10' : 'border-ocean-500/15')}>
                <dd className={cn('font-heading text-5xl sm:text-6xl', dark ? 'text-sand-100' : 'text-ocean-500')}>{n}</dd>
                <dt className={cn('eyebrow mt-2', dark ? 'text-sand-400' : 'text-ocean-300')}>{l}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

function Villas() {
  const { tr, dark } = useApp()
  const items = [
    { v: VILLAS[0], name: tr.villas.v1_name, badge: tr.villas.v1_badge, desc: tr.villas.v1_desc },
    { v: VILLAS[1], name: tr.villas.v2_name, badge: tr.villas.v2_badge, desc: tr.villas.v2_desc },
  ]
  return (
    <section className={cn('py-24 sm:py-32', dark ? 'bg-ocean-800' : 'bg-white')}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <Eyebrow>{tr.x.v_eyebrow}</Eyebrow>
            <h2 className={cn('font-heading text-4xl sm:text-6xl mt-5', dark ? 'text-sand-100' : 'text-ocean-500')}>{tr.x.v_title}</h2>
          </div>
          <p className={cn('font-body text-sm max-w-sm leading-relaxed', dark ? 'text-sand-300/70' : 'text-ocean-400')}>{tr.home.villas_sub}</p>
        </Reveal>

        <div className="space-y-24 sm:space-y-32">
          {items.map(({ v, name, badge, desc }, i) => (
            <div key={v.id} className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <Reveal className={cn('lg:col-span-7 relative', i % 2 && 'lg:order-2')}>
                <Link to={`/villas#${v.id}`} className="group block relative overflow-hidden aspect-[4/3] sm:aspect-[16/11]">
                  <img src={v.photos[0]} alt={name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
                </Link>
                <Link to={`/villas#${v.id}`} className={cn('hidden sm:block absolute -bottom-10 w-44 lg:w-56 aspect-[3/4] overflow-hidden border-[6px]', i % 2 ? '-left-6' : '-right-6', dark ? 'border-ocean-800' : 'border-white')}>
                  <img src={v.photos[1]} alt="" loading="lazy" className="w-full h-full object-cover" />
                </Link>
              </Reveal>
              <Reveal delay={0.1} className={cn('lg:col-span-5', i % 2 && 'lg:order-1')}>
                <p className="font-heading italic text-gold text-2xl">0{i + 1}</p>
                <p className={cn('eyebrow mt-4', dark ? 'text-sand-400' : 'text-ocean-300')}>{badge}</p>
                <h3 className={cn('font-heading text-4xl sm:text-5xl mt-2 mb-6', dark ? 'text-sand-100' : 'text-ocean-500')}>{name}</h3>
                <p className={cn('font-body text-base leading-[1.85] mb-8', dark ? 'text-sand-300/80' : 'text-ocean-400')}>{desc}</p>
                <dl className={cn('grid grid-cols-3 border-y py-5 mb-9', dark ? 'border-white/10' : 'border-ocean-500/15')}>
                  {[['4', tr.villas.guests], ['2', tr.villas.beds], ['120', tr.villas.sqm]].map(([n, l]) => (
                    <div key={l}>
                      <dd className={cn('font-heading text-3xl', dark ? 'text-sand-100' : 'text-ocean-500')}>{n}</dd>
                      <dt className={cn('eyebrow !tracking-[0.18em] mt-1', dark ? 'text-sand-400' : 'text-ocean-300')}>{l}</dt>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap items-center gap-8">
                  <Link to={`/booking?villa=${v.id}`} className="inline-flex items-center gap-3 bg-ocean-500 dark:bg-gold hover:bg-gold text-white font-body text-[11px] uppercase tracking-[0.22em] font-semibold px-7 py-4 transition-colors">
                    {tr.x.reserve} <ArrowRight size={14} />
                  </Link>
                  <TextLink to={`/villas#${v.id}`}>{tr.x.discover}</TextLink>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuoteBand() {
  const { tr } = useApp()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  return (
    <section ref={ref} className="relative py-36 sm:py-48 overflow-hidden grain">
      <motion.img style={{ y }} src={photo(17)} alt="" aria-hidden="true" className="absolute inset-0 w-full h-[125%] -top-[12%] object-cover" />
      <div className="absolute inset-0 bg-ocean-900/60" />
      <Reveal className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center text-white">
        <p className="font-heading text-8xl leading-none text-sand-200/60 h-12">“</p>
        <blockquote className="font-heading italic text-3xl sm:text-5xl leading-[1.2]">{tr.x.q_text}</blockquote>
        <p className="eyebrow text-white/70 mt-10">{tr.x.q_author}</p>
      </Reveal>
    </section>
  )
}

function Days() {
  const { tr, dark } = useApp()
  const imgs = [photo(1), photo(11), photo(14), photo(36)]
  return (
    <section className={cn('py-24 sm:py-32', dark ? 'bg-ocean-900' : 'bg-sand-50')}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="mb-14">
          <Eyebrow>{tr.x.d_eyebrow}</Eyebrow>
          <h2 className={cn('font-heading text-4xl sm:text-6xl mt-5', dark ? 'text-sand-100' : 'text-ocean-500')}>{tr.x.d_title}</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
          {tr.x.d_items.map(([title, text, to], i) => (
            <Reveal key={title} delay={i * 0.08}>
              <Link to={to} className="group block">
                <div className={cn('overflow-hidden aspect-[3/4]', i % 2 && 'lg:mt-12')}>
                  <img src={imgs[i]} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
                </div>
                <div className="pt-6">
                  <p className="font-heading italic text-gold text-lg">0{i + 1}</p>
                  <h3 className={cn('font-heading text-2xl sm:text-3xl mt-1 mb-3 group-hover:text-gold transition-colors', dark ? 'text-sand-100' : 'text-ocean-500')}>{title}</h3>
                  <p className={cn('font-body text-sm leading-relaxed', dark ? 'text-sand-300/75' : 'text-ocean-400')}>{text}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  const { tr, dark } = useApp()
  const [i, setI] = useState(0)
  const [testimonials, setReviews] = useState(fallbackReviews)
  useEffect(() => {
    // Loaded lazily so the database client stays out of the initial bundle
    import('@/lib/db')
      .then(({ db }) => db.publishedReviews())
      .then(r => { if (r.length) setReviews(r.map(x => ({ text: x.text, name: x.name, role: x.country }))) })
      .catch(() => {})
  }, [])
  const n = testimonials.length
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % n), 7000)
    return () => clearInterval(t)
  }, [i, n])
  const t = testimonials[i % n]
  const btn = cn('w-12 h-12 border flex items-center justify-center transition-colors cursor-pointer', dark ? 'border-white/15 text-sand-100 hover:border-gold hover:text-gold' : 'border-ocean-500/20 text-ocean-500 hover:border-gold hover:text-gold')

  return (
    <section className={cn('py-24 sm:py-32', dark ? 'bg-ocean-800' : 'bg-white')}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-4">
          <Eyebrow>{tr.x.r_eyebrow}</Eyebrow>
          <h2 className={cn('font-heading text-4xl sm:text-5xl mt-5 leading-[1.1]', dark ? 'text-sand-100' : 'text-ocean-500')}>{tr.x.r_title}</h2>
          <div className="flex items-center gap-4 mt-8">
            <span className="font-heading text-6xl text-gold">9.3</span>
            <div>
              <div className="flex gap-0.5">{[...Array(5)].map((_, k) => <Star key={k} size={13} fill="currentColor" className="text-gold" />)}</div>
              <p className={cn('font-body text-xs mt-1.5', dark ? 'text-sand-400' : 'text-ocean-300')}>{tr.x.r_source}</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
          <div className="min-h-[260px] sm:min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.figure key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }}>
                <blockquote className={cn('font-heading text-2xl sm:text-4xl leading-[1.3]', dark ? 'text-sand-100' : 'text-ocean-500')}>“{t.text}”</blockquote>
                <figcaption className={cn('eyebrow mt-8', dark ? 'text-sand-400' : 'text-ocean-300')}>{t.name} · {t.role}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3 mt-10">
            <button className={btn} onClick={() => setI((i - 1 + n) % n)} aria-label="Previous review"><ArrowLeft size={16} /></button>
            <button className={btn} onClick={() => setI((i + 1) % n)} aria-label="Next review"><ArrowRight size={16} /></button>
            <span className={cn('font-body text-xs ml-3 tabular-nums', dark ? 'text-sand-400' : 'text-ocean-300')}>{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Gallery() {
  const { tr, dark } = useApp()
  const g = [26, 3, 34, 29, 41].map(photo)
  return (
    <section className={cn('py-24 sm:py-32', dark ? 'bg-ocean-900' : 'bg-sand-50')}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <Eyebrow>{tr.x.g_eyebrow}</Eyebrow>
            <h2 className={cn('font-heading text-4xl sm:text-6xl mt-5', dark ? 'text-sand-100' : 'text-ocean-500')}>{tr.x.g_title}</h2>
          </div>
          <TextLink to="/gallery">{tr.x.view_photos} (42)</TextLink>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:h-[620px]">
          {g.map((src, k) => (
            <Reveal key={src} delay={k * 0.05} className={cn('overflow-hidden', k === 0 && 'col-span-2 md:row-span-2')}>
              <Link to="/gallery" className="group block h-full">
                <img src={src} alt="" loading="lazy" className={cn('w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105', k === 0 ? 'aspect-[4/3] md:aspect-auto' : 'aspect-square md:aspect-auto')} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const { tr, dark } = useApp()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className={cn('py-24 sm:py-32', dark ? 'bg-ocean-800' : 'bg-white')}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-4">
          <Eyebrow>{tr.x.faq_label}</Eyebrow>
          <h2 className={cn('font-heading text-4xl sm:text-5xl mt-5', dark ? 'text-sand-100' : 'text-ocean-500')}>{tr.x.faq_title}</h2>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className={cn('inline-block font-body text-sm mt-6 underline underline-offset-4 decoration-gold/50 hover:text-gold', dark ? 'text-sand-300' : 'text-ocean-400')}>
            {tr.home.cta_wa} →
          </a>
        </Reveal>
        <div className={cn('lg:col-span-7 lg:col-start-6 border-t', dark ? 'border-white/10' : 'border-ocean-500/15')}>
          {tr.x.faq.map(([q, a], k) => (
            <div key={q} className={cn('border-b', dark ? 'border-white/10' : 'border-ocean-500/15')}>
              <button onClick={() => setOpen(open === k ? null : k)} aria-expanded={open === k} className="w-full flex items-center justify-between gap-6 py-6 text-left cursor-pointer group">
                <span className={cn('font-heading text-xl sm:text-2xl group-hover:text-gold transition-colors', dark ? 'text-sand-100' : 'text-ocean-500')}>{q}</span>
                <Plus size={18} className={cn('text-gold shrink-0 transition-transform duration-300', open === k && 'rotate-45')} />
              </button>
              <AnimatePresence initial={false}>
                {open === k && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                    <p className={cn('font-body text-sm leading-relaxed pb-6 pr-10', dark ? 'text-sand-300/80' : 'text-ocean-400')}>{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  const { tr } = useApp()
  return (
    <section className="relative overflow-hidden grain">
      <img src={photo(26)} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-ocean-900/65" />
      <Reveal className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-32 sm:py-44">
        <Eyebrow light>{tr.home.cta_label}</Eyebrow>
        <h2 className="font-heading text-white text-5xl sm:text-7xl leading-[1.02] mt-6 max-w-3xl">{tr.x.c_title}</h2>
        <p className="font-body text-white/75 max-w-md mt-6 leading-relaxed">{tr.x.c_sub}</p>
        <div className="flex flex-wrap items-center gap-8 mt-10">
          <Link to="/booking" className="inline-flex items-center gap-3 bg-white text-ocean-500 hover:bg-gold hover:text-white font-body text-[11px] uppercase tracking-[0.22em] font-semibold px-8 py-4 transition-colors">
            {tr.home.cta_btn} <ArrowRight size={14} />
          </Link>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="font-body text-[11px] uppercase tracking-[0.22em] font-semibold text-white pb-1.5 border-b border-white/40 hover:border-white transition-colors">
            {tr.home.cta_wa}
          </a>
        </div>
      </Reveal>
    </section>
  )
}

export default function Home() {
  const { tr } = useApp()
  return (
    <div>
      <Seo title="DreamCatcher Homes — Luxury Beachfront Villas in Mirleft, Morocco" description={tr.x.h_sub} />
      <Hero />
      <Intro />
      <Villas />
      <QuoteBand />
      <Days />
      <Reviews />
      <Gallery />
      <Faq />
      <FinalCta />
    </div>
  )
}
