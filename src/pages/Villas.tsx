import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bed, Check, Star, ArrowRight, Images } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import Reveal from '@/components/ui/Reveal'
import Lightbox from '@/components/ui/Lightbox'
import Seo from '@/components/Seo'
import PageHero from '@/components/PageHero'
import { VILLAS, VillaId, waLink } from '@/lib/site'
import { cn } from '@/lib/utils'

interface VillaProps {
  id: VillaId
  index: number
  name: string
  badge: string
  desc: string
  beds: string[]
}

function Villa({ id, index, name, badge, desc, beds }: VillaProps) {
  const { tr, dark, lang } = useApp()
  const [lb, setLb] = useState<number | null>(null)
  const vPhotos = VILLAS.find(v => v.id === id)!.photos
  const images = vPhotos.map((src, i) => ({ src, alt: `${name} — photo ${i + 1}` }))
  const features = [
    tr.villas.pool, tr.villas.sea_view, tr.villas.kitchen, tr.villas.balcony, tr.villas.wifi,
    lang === 'fr' ? 'Parking gratuit' : 'Free parking',
    lang === 'fr' ? 'TV écran plat & satellite' : 'Flat-screen TV & satellite',
    lang === 'fr' ? '1 salle de bain' : '1 bathroom',
  ]
  const head = dark ? 'text-sand-100' : 'text-ocean-500'
  const body = dark ? 'text-sand-300/80' : 'text-ocean-400'
  const muted = dark ? 'text-sand-400' : 'text-ocean-300'
  const rule = dark ? 'border-white/10' : 'border-ocean-500/15'

  return (
    <article id={id} className="scroll-mt-24">
      <Lightbox images={images} index={lb} onChange={setLb} />

      {/* Photo mosaic */}
      <Reveal>
        <div className="relative grid grid-cols-4 grid-rows-2 gap-2 h-[320px] sm:h-[460px] lg:h-[560px]">
          {vPhotos.slice(0, 5).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setLb(i)}
              className={cn('group overflow-hidden cursor-pointer', i === 0 ? 'col-span-4 sm:col-span-2 row-span-2' : 'hidden sm:block')}
              aria-label={`${name} — photo ${i + 1}`}
            >
              <img src={src} alt="" loading={index === 0 && i === 0 ? 'eager' : 'lazy'} className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setLb(0)}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-sand-50 hover:bg-white text-ocean-500 font-body text-[11px] uppercase tracking-[0.18em] font-semibold px-4 py-3 shadow-lg cursor-pointer transition-colors"
          >
            <Images size={14} /> {tr.x.view_photos} ({vPhotos.length})
          </button>
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 mt-12">
        {/* Info */}
        <Reveal className="lg:col-span-7">
          <div className="flex items-baseline gap-4">
            <span className="font-heading italic text-gold text-2xl">0{index + 1}</span>
            <span className={cn('eyebrow', muted)}>{badge}</span>
          </div>
          <h2 className={cn('font-heading text-5xl sm:text-6xl mt-3 mb-4', head)}>{name}</h2>
          <p className={cn('flex items-center gap-2 font-body text-sm mb-8', muted)}>
            <Star size={13} fill="currentColor" className="text-gold" />
            <b className={head}>9.3</b> · {tr.home.stats_beach} · Club Evasion
          </p>
          <p className={cn('font-body text-base leading-[1.85] mb-10', body)}>{desc}</p>

          <dl className={cn('grid grid-cols-3 border-y py-6 mb-10', rule)}>
            {[['4', tr.villas.guests], ['2', tr.villas.beds], ['120', tr.villas.sqm]].map(([n, l]) => (
              <div key={l}>
                <dd className={cn('font-heading text-4xl', head)}>{n}</dd>
                <dt className={cn('eyebrow !tracking-[0.18em] mt-1', muted)}>{l}</dt>
              </div>
            ))}
          </dl>

          <div className="grid sm:grid-cols-2 gap-10">
            <div>
              <h3 className={cn('eyebrow mb-4', muted)}>{lang === 'fr' ? 'Couchages' : 'Sleeping arrangements'}</h3>
              <ul className="space-y-3">
                {beds.map(b => (
                  <li key={b} className={cn('flex items-start gap-3 font-body text-sm', body)}>
                    <Bed size={15} className="text-gold shrink-0 mt-0.5" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={cn('eyebrow mb-4', muted)}>{lang === 'fr' ? 'Dans la villa' : 'In the villa'}</h3>
              <ul className="space-y-3">
                {features.map(f => (
                  <li key={f} className={cn('flex items-center gap-3 font-body text-sm', body)}>
                    <Check size={14} className="text-gold shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Booking card */}
        <aside className="lg:col-span-5 lg:self-start lg:sticky lg:top-28">
          <Reveal delay={0.1}>
            <div className={cn('p-8', dark ? 'bg-ocean-800' : 'bg-sand-50')}>
              <p className={cn('eyebrow mb-2', muted)}>{tr.x.your_stay}</p>
              <p className={cn('font-heading text-3xl mb-6', head)}>{name}</p>
              <ul className={cn('space-y-2.5 font-body text-sm border-t pt-6 mb-8', body, rule)}>
                {[tr.villas.free_cancel, tr.villas.no_prepay, tr.villas.pay_property, tr.villas.checkin, tr.villas.checkout].map(t => (
                  <li key={t} className="flex items-center gap-3"><Check size={14} className="text-gold shrink-0" /> {t}</li>
                ))}
              </ul>
              <Link
                to={`/booking?villa=${id}`}
                className="w-full inline-flex items-center justify-center gap-3 bg-gold hover:bg-gold-600 text-white font-body text-[11px] uppercase tracking-[0.22em] font-semibold py-4 transition-colors"
              >
                {tr.villas.book_btn} <ArrowRight size={14} />
              </Link>
              <a
                href={waLink(`Hello, I'm interested in the ${name} at DreamCatcher Homes.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn('w-full mt-3 inline-flex items-center justify-center font-body text-[11px] uppercase tracking-[0.22em] font-semibold py-4 border transition-colors', dark ? 'border-white/15 text-sand-100 hover:border-gold' : 'border-ocean-500/20 text-ocean-500 hover:border-gold hover:text-gold')}
              >
                {tr.villas.wa_btn}
              </a>
              <p className={cn('font-body text-xs text-center mt-5', muted)}>{tr.villas.payment}</p>
            </div>
          </Reveal>
        </aside>
      </div>
    </article>
  )
}

export default function Villas() {
  const { tr, dark } = useApp()

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-white'}>
      <Seo title={tr.villas.page_title} description={tr.villas.page_sub} />
      <PageHero image="/photo15.jpg" label={tr.villas.page_label} title={tr.villas.page_title} sub={tr.villas.page_sub} />

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-28 md:space-y-40">
          <Villa
            id="two-bedroom"
            index={0}
            name={tr.villas.v1_name}
            badge={tr.villas.v1_badge}
            desc={tr.villas.v1_desc}
            beds={[tr.villas.v1_bed1, tr.villas.v1_bed2, tr.villas.v1_living]}
          />
          <Villa
            id="deluxe"
            index={1}
            name={tr.villas.v2_name}
            badge={tr.villas.v2_badge}
            desc={tr.villas.v2_desc}
            beds={[tr.villas.v2_bed1, tr.villas.v2_bed2]}
          />
        </div>
      </section>
    </div>
  )
}
