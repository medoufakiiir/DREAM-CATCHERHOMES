import { useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export default function Booking() {
  const { dark } = useApp()

  const [form, setForm] = useState({
    villa: '',
    checkin: '',
    checkout: '',
    guests: '',
    name: '',
    phone: '',
    email: '',
    requests: '',
  })
  const [sent, setSent] = useState(false)

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = [
      '🌊 *DreamCatcher Homes – Booking Request*',
      '',
      `🏠 Villa: ${form.villa || 'Not specified'}`,
      `📅 Check-in: ${form.checkin}`,
      `📅 Check-out: ${form.checkout}`,
      `👥 Guests: ${form.guests}`,
      `👤 Name: ${form.name}`,
      `📞 Phone: ${form.phone}`,
      `📧 Email: ${form.email}`,
      form.requests ? `📝 Requests: ${form.requests}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    window.open(`https://wa.me/212671779770?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
  }

  const fieldCls = cn(
    'w-full px-4 py-3 rounded-xl border font-body text-sm outline-none transition-all duration-200',
    'focus:border-gold focus:ring-2 focus:ring-gold/20',
    dark
      ? 'bg-ocean-800 border-white/10 text-sand-100 placeholder-white/25'
      : 'bg-white border-sand-200 text-ocean-600 placeholder-ocean-300'
  )

  const labelCls = cn(
    'block font-body text-xs uppercase tracking-wider mb-1.5',
    dark ? 'text-sand-400' : 'text-ocean-400'
  )

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-sand-50'}>
      {/* Hero */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img src="/photo04.jpg" alt="Book your stay" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ocean-900/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-2">Reservations</p>
          <h1 className="font-heading text-4xl sm:text-5xl text-white font-bold">Book Your Stay</h1>
          <p className="font-body text-sm text-white/60 mt-2">Fill in the form — we'll confirm via WhatsApp</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">

          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center py-20"
            >
              <CheckCircle size={56} className="text-[#25D366] mb-5" />
              <h2 className={`font-heading text-3xl mb-3 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>
                Request Sent!
              </h2>
              <p className={`font-body text-sm max-w-sm mb-8 ${dark ? 'text-sand-300' : 'text-ocean-400'}`}>
                Your booking request has been sent to our team on WhatsApp. We'll get back to you within a few hours to confirm.
              </p>
              <button
                onClick={() => setSent(false)}
                className="font-body text-sm text-gold hover:underline cursor-pointer"
              >
                ← Send another request
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-3xl p-8 md:p-10 shadow-sm', dark ? 'bg-ocean-800' : 'bg-white')}
            >
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Villa */}
                <div>
                  <label className={labelCls}>Which villa?</label>
                  <select name="villa" value={form.villa} onChange={change} className={fieldCls}>
                    <option value="">Select a villa…</option>
                    <option>Two-Bedroom Villa — from MAD 1,584 / 2 nights</option>
                    <option>Deluxe Villa — from MAD 11,590 / 2 nights</option>
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Check-in date</label>
                    <input
                      type="text"
                      name="checkin"
                      placeholder="e.g. 20 July 2025"
                      value={form.checkin}
                      onChange={change}
                      required
                      className={fieldCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Check-out date</label>
                    <input
                      type="text"
                      name="checkout"
                      placeholder="e.g. 27 July 2025"
                      value={form.checkout}
                      onChange={change}
                      required
                      className={fieldCls}
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className={labelCls}>Number of guests</label>
                  <input
                    type="text"
                    name="guests"
                    placeholder="e.g. 2 adults, 1 child"
                    value={form.guests}
                    onChange={change}
                    required
                    className={fieldCls}
                  />
                </div>

                <div className={cn('h-px', dark ? 'bg-white/8' : 'bg-sand-100')} />

                {/* Contact */}
                <div>
                  <label className={labelCls}>Your name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={form.name}
                    onChange={change}
                    required
                    autoComplete="name"
                    className={fieldCls}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Phone / WhatsApp</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+44 7700 900 000"
                      value={form.phone}
                      onChange={change}
                      required
                      autoComplete="tel"
                      className={fieldCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={change}
                      autoComplete="email"
                      className={fieldCls}
                    />
                  </div>
                </div>

                {/* Requests */}
                <div>
                  <label className={labelCls}>Special requests (optional)</label>
                  <textarea
                    name="requests"
                    rows={3}
                    placeholder="Early check-in, dietary needs, airport pickup…"
                    value={form.requests}
                    onChange={change}
                    className={cn(fieldCls, 'resize-none')}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-green-600 text-white font-body font-semibold py-4 rounded-xl transition-colors cursor-pointer text-sm"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.114 1.528 5.836L0 24l6.335-1.51A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 01-5.031-1.387l-.361-.214-3.762.897.939-3.65-.235-.374A9.808 9.808 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                  </svg>
                  Send Request on WhatsApp
                </button>

                <p className={`font-body text-xs text-center ${dark ? 'text-sand-500' : 'text-ocean-300'}`}>
                  Opens WhatsApp with your details pre-filled · +212 671-779770
                </p>
              </form>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
