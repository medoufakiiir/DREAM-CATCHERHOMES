import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { CheckCircle, Check, Minus, Plus, CalendarDays, Users, Moon, Mail, AlertCircle } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import Seo from '@/components/Seo'
import PageHero from '@/components/PageHero'
import { SITE, VILLAS, VillaId, waLink, isoDate, addDays, nightsBetween, photo } from '@/lib/site'
import { db, overlaps, BookedRange } from '@/lib/db'
import { cn } from '@/lib/utils'

const fmtDate = (iso: string, lang: string) =>
  iso ? new Date(iso + 'T00:00:00').toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'

function Stepper({ label, sub, value, min, max, onChange, dark }: {
  label: string; sub: string; value: number; min: number; max: number; onChange: (n: number) => void; dark: boolean
}) {
  const btn = cn(
    'w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed',
    dark ? 'border-white/15 text-sand-200 hover:border-gold' : 'border-sand-200 text-ocean-500 hover:border-gold'
  )
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className={cn('font-body text-sm font-medium', dark ? 'text-sand-100' : 'text-ocean-500')}>{label}</p>
        <p className={cn('font-body text-xs', dark ? 'text-sand-400' : 'text-ocean-300')}>{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className={btn} disabled={value <= min} onClick={() => onChange(value - 1)} aria-label={`- ${label}`}><Minus size={14} /></button>
        <span className={cn('w-5 text-center font-body text-sm font-semibold', dark ? 'text-sand-100' : 'text-ocean-500')} aria-live="polite">{value}</span>
        <button type="button" className={btn} disabled={value >= max} onClick={() => onChange(value + 1)} aria-label={`+ ${label}`}><Plus size={14} /></button>
      </div>
    </div>
  )
}

export default function Booking() {
  const { dark, tr, lang } = useApp()
  const [params] = useSearchParams()
  const today = isoDate(new Date())

  const initVilla = params.get('villa')
  const [villa, setVilla] = useState<VillaId | ''>(VILLAS.some(v => v.id === initVilla) ? (initVilla as VillaId) : '')
  const [checkin, setCheckin] = useState(() => {
    const c = params.get('checkin') ?? ''
    return c >= today ? c : ''
  })
  const [checkout, setCheckout] = useState(params.get('checkout') ?? '')
  const [adults, setAdults] = useState(() => Math.min(6, Math.max(1, Number(params.get('adults')) || 2)))
  const [children, setChildren] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', email: '', requests: '' })
  const [sent, setSent] = useState(false)

  const [ranges, setRanges] = useState<BookedRange[]>([])
  useEffect(() => { db.bookedRanges().then(setRanges).catch(() => {}) }, [])

  const nights = nightsBetween(checkin, checkout)
  const taken = (v: VillaId) => nights > 0 && ranges.some(r => (r.villa === v || !r.villa) && overlaps(checkin, checkout, r.checkin, r.checkout))
  const unavailable = villa ? taken(villa) : nights > 0 && VILLAS.every(v => taken(v.id))
  const datesInvalid = !!checkin && !!checkout && nights === 0
  const guests = adults + children
  const maxGuests = villa ? VILLAS.find(v => v.id === villa)!.maxGuests : 4
  const overCapacity = guests > maxGuests

  const villaName = (id: VillaId | '') =>
    id === 'two-bedroom' ? tr.villas.v1_name : id === 'deluxe' ? tr.villas.v2_name : tr.x.search_any

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const message = [
    'DreamCatcher Homes – Booking Request',
    '',
    `Villa: ${villaName(villa)}`,
    `Check-in: ${fmtDate(checkin, 'en')}`,
    `Check-out: ${fmtDate(checkout, 'en')}`,
    `Nights: ${nights}`,
    `Guests: ${adults} adult(s)${children ? `, ${children} child(ren)` : ''}`,
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    form.email ? `Email: ${form.email}` : '',
    form.requests ? `Requests: ${form.requests}` : '',
  ].filter(Boolean).join('\n')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (datesInvalid || nights === 0 || unavailable) return
    window.open(waLink(message), '_blank', 'noopener')
    // Also store the request for the admin panel (never blocks the guest)
    db.createBooking({
      villa: villa || null, checkin, checkout, adults, children,
      name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim() || null, requests: form.requests.trim() || null,
    }).catch(() => {})
    setSent(true)
  }

  const mailHref = `mailto:${SITE.email}?subject=${encodeURIComponent('Booking request – DreamCatcher Homes')}&body=${encodeURIComponent(message)}`

  const fieldCls = cn(
    'w-full px-4 py-3 rounded-xl border font-body text-sm outline-none transition-all duration-200',
    'focus:border-gold focus:ring-2 focus:ring-gold/20',
    dark ? 'bg-ocean-900 border-white/10 text-sand-100 placeholder-white/25 [color-scheme:dark]' : 'bg-white border-sand-200 text-ocean-600 placeholder-ocean-300'
  )
  const labelCls = cn('block font-body text-xs uppercase tracking-wider mb-1.5', dark ? 'text-sand-400' : 'text-ocean-400')
  const card = cn('rounded-3xl p-6 md:p-8', dark ? 'bg-ocean-800' : 'bg-white shadow-sm')
  const heading = cn('font-heading text-xl mb-5', dark ? 'text-sand-100' : 'text-ocean-500')

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-sand-50'}>
      <Seo title={tr.booking.page_title} description={tr.booking.page_sub} />
      <PageHero image="/photo30.jpg" label={tr.booking.page_label} title={tr.booking.page_title} sub={tr.booking.page_sub} short />

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          {sent ? (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={cn(card, 'max-w-xl mx-auto flex flex-col items-center text-center py-16')}>
              <CheckCircle size={56} className="text-[#25D366] mb-5" />
              <h2 className={cn('font-heading text-3xl mb-3', dark ? 'text-sand-100' : 'text-ocean-500')}>{tr.booking.submitted_title}</h2>
              <p className={cn('font-body text-sm max-w-sm mb-6', dark ? 'text-sand-300' : 'text-ocean-400')}>{tr.booking.submitted_sub}</p>
              <a href={mailHref} className="inline-flex items-center gap-2 font-body text-sm text-gold hover:underline mb-4">
                <Mail size={14} /> {tr.x.send_email}
              </a>
              <button onClick={() => setSent(false)} className="font-body text-sm text-gold hover:underline cursor-pointer">
                {tr.booking.another}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
              <div className="space-y-6">
                {/* Step 1 */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={card}>
                  <h2 className={heading}>{tr.x.step_stay}</h2>

                  <p className={labelCls}>{tr.booking.villa_label}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {VILLAS.map(v => {
                      const active = villa === v.id
                      return (
                        <button
                          type="button"
                          key={v.id}
                          onClick={() => setVilla(active ? '' : v.id)}
                          aria-pressed={active}
                          className={cn(
                            'relative flex items-center gap-3 p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer',
                            active ? 'border-gold bg-gold/5' : dark ? 'border-white/10 hover:border-white/25' : 'border-sand-100 hover:border-sand-300'
                          )}
                        >
                          <img src={v.photos[0]} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0" />
                          <div>
                            <p className={cn('font-heading text-base font-semibold', dark ? 'text-sand-100' : 'text-ocean-500')}>{villaName(v.id)}</p>
                            <p className={cn('font-body text-xs', dark ? 'text-sand-400' : 'text-ocean-300')}>
                              {tr.villas.pool} · {v.maxGuests} {tr.villas.guests}
                            </p>
                            {taken(v.id) && <p className="font-body text-[11px] font-semibold text-red-500 mt-0.5">{tr.x.villa_taken}</p>}
                          </div>
                          {active && <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center"><Check size={12} className="text-white" /></span>}
                        </button>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <label htmlFor="bk-in" className={labelCls}>{tr.booking.checkin_label}</label>
                      <input
                        id="bk-in" type="date" required min={today} value={checkin}
                        onChange={e => {
                          setCheckin(e.target.value)
                          if (!checkout || checkout <= e.target.value) setCheckout(addDays(e.target.value, 3))
                        }}
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="bk-out" className={labelCls}>{tr.booking.checkout_label}</label>
                      <input
                        id="bk-out" type="date" required min={checkin ? addDays(checkin, 1) : addDays(today, 1)} value={checkout}
                        onChange={e => setCheckout(e.target.value)}
                        className={fieldCls}
                      />
                    </div>
                  </div>
                  {unavailable && (
                    <p className="flex items-center gap-1.5 font-body text-xs text-red-500 mb-2"><AlertCircle size={13} /> {tr.x.unavailable}</p>
                  )}
                  {datesInvalid && (
                    <p className="flex items-center gap-1.5 font-body text-xs text-red-500 mb-2"><AlertCircle size={13} /> {tr.x.dates_error}</p>
                  )}

                  <div className={cn('mt-4 pt-3 border-t', dark ? 'border-white/10' : 'border-sand-100')}>
                    <Stepper label={tr.x.adults} sub={tr.x.adults_sub} value={adults} min={1} max={6} onChange={setAdults} dark={dark} />
                    <Stepper label={tr.x.children} sub={tr.x.children_sub} value={children} min={0} max={4} onChange={setChildren} dark={dark} />
                    {overCapacity && (
                      <p className="flex items-center gap-1.5 font-body text-xs text-amber-600 mt-1">
                        <AlertCircle size={13} /> {tr.x.capacity_note.replace('{n}', String(maxGuests))}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className={card}>
                  <h2 className={heading}>{tr.x.step_details}</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="bk-name" className={labelCls}>{tr.booking.name_label}</label>
                      <input id="bk-name" type="text" name="name" placeholder={tr.x.name_ph} value={form.name} onChange={change} required autoComplete="name" className={fieldCls} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bk-phone" className={labelCls}>{tr.booking.phone_label}</label>
                        <input id="bk-phone" type="tel" name="phone" placeholder="+44 7700 900 000" value={form.phone} onChange={change} required autoComplete="tel" className={fieldCls} />
                      </div>
                      <div>
                        <label htmlFor="bk-email" className={labelCls}>{tr.booking.email_label} <span className="normal-case opacity-60">({tr.x.optional})</span></label>
                        <input id="bk-email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={change} autoComplete="email" className={fieldCls} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="bk-req" className={labelCls}>{tr.booking.requests_label} <span className="normal-case opacity-60">({tr.x.optional})</span></label>
                      <textarea id="bk-req" name="requests" rows={3} placeholder={tr.x.requests_ph} value={form.requests} onChange={change} className={cn(fieldCls, 'resize-none')} />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Summary */}
              <motion.aside initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className={cn(card, 'lg:sticky lg:top-28 !p-0 overflow-hidden')}>
                <div className="relative h-36">
                  <img src={villa ? VILLAS.find(v => v.id === villa)!.photos[0] : photo(17)} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/80 to-transparent" />
                  <div className="absolute bottom-3 left-5 text-white">
                    <p className="font-body text-[10px] uppercase tracking-widest text-gold">{tr.x.your_stay}</p>
                    <p className="font-heading text-xl font-semibold">{villaName(villa)}</p>
                  </div>
                </div>
                <div className="p-6">
                  <dl className={cn('space-y-3 font-body text-sm mb-5', dark ? 'text-sand-200' : 'text-ocean-500')}>
                    <div className="flex items-center gap-3"><CalendarDays size={15} className="text-gold shrink-0" /><dt className="sr-only">{tr.booking.checkin_label}</dt><dd>{fmtDate(checkin, lang)}</dd></div>
                    <div className="flex items-center gap-3"><CalendarDays size={15} className="text-gold shrink-0" /><dt className="sr-only">{tr.booking.checkout_label}</dt><dd>{fmtDate(checkout, lang)}</dd></div>
                    <div className="flex items-center gap-3"><Moon size={15} className="text-gold shrink-0" /><dd>{nights} {nights === 1 ? tr.x.night_one : tr.x.night_many}</dd></div>
                    <div className="flex items-center gap-3"><Users size={15} className="text-gold shrink-0" /><dd>{guests} {guests === 1 ? tr.x.guest_one : tr.x.guest_many}</dd></div>
                  </dl>

                  <div className={cn('pt-4 mb-5 border-t space-y-2', dark ? 'border-white/10' : 'border-sand-100')}>
                    <p className={cn('font-body text-[10px] uppercase tracking-widest mb-2', dark ? 'text-sand-400' : 'text-ocean-300')}>{tr.x.included}</p>
                    {[tr.x.inc_1, tr.x.inc_2, tr.x.inc_3, tr.x.inc_4, tr.x.inc_5].map(t => (
                      <p key={t} className={cn('flex items-center gap-2 font-body text-xs', dark ? 'text-sand-300' : 'text-ocean-400')}>
                        <Check size={12} className="text-green-500 shrink-0" /> {t}
                      </p>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={datesInvalid || unavailable}
                    className="w-full flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body text-[11px] uppercase tracking-[0.18em] font-semibold py-4 transition-colors cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.114 1.528 5.836L0 24l6.335-1.51A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                    {tr.x.send_wa}
                  </button>
                  <p className={cn('font-body text-xs text-center mt-3', dark ? 'text-sand-500' : 'text-ocean-300')}>
                    {tr.x.reply_fast} · {SITE.phoneDisplay}
                  </p>
                </div>
              </motion.aside>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
