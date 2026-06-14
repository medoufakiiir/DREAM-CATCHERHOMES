import { useState } from 'react'
import { motion } from 'motion/react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
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

export default function Contact() {
  const { tr, dark } = useApp()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1000)
  }

  const inputCls = cn(
    'w-full px-4 py-3.5 rounded-xl border font-body text-sm outline-none transition-all duration-200',
    'focus:border-gold focus:ring-1 focus:ring-gold/20',
    dark
      ? 'bg-ocean-800 border-white/8 text-sand-100 placeholder-white/25'
      : 'bg-white border-sand-200 text-ocean-500 placeholder-ocean-300'
  )

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-white'}>
      {/* Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img src={photos[32]} alt="Contact DreamCatcher Homes" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/30 to-ocean-900/80" />
        <div className="absolute inset-0 flex items-end pb-12 justify-center text-center px-5">
          <div className="text-white">
            <p className="font-body text-xs uppercase tracking-widest text-gold mb-2">{tr.contact.page_label}</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold">{tr.contact.page_title}</h1>
            <p className="font-body text-base mt-2 opacity-75">{tr.contact.page_sub}</p>
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Info panel */}
            <Reveal>
              <div>
                <p className="font-body text-xs uppercase tracking-widest text-gold mb-4">DreamCatcher Homes</p>
                <h2 className={`font-heading text-3xl sm:text-4xl mb-3 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>
                  Let's Talk
                </h2>
                <div className="w-10 h-0.5 bg-gold mb-8" />

                <div className="space-y-5 mb-10">
                  {[
                    { icon: MapPin, label: 'Address', value: "Route d'Aglou, 85000 Mirleft, Tamelalt, Morocco", href: undefined },
                    { icon: Phone, label: 'Phone / WhatsApp', value: '+212 671-779770', href: 'tel:+212671779770' },
                    { icon: Mail, label: 'Email', value: 'contact@dreamcatcherhomes.com', href: 'mailto:contact@dreamcatcherhomes.com' },
                    { icon: Clock, label: 'Availability', value: '24 / 7 — we reply fast on WhatsApp', href: undefined },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                        <Icon size={15} className="text-gold" />
                      </div>
                      <div>
                        <p className={`font-body text-xs uppercase tracking-widest mb-0.5 ${dark ? 'text-sand-400' : 'text-ocean-300'}`}>{label}</p>
                        {href ? (
                          <a href={href} className={`font-body text-sm hover:text-gold transition-colors cursor-pointer ${dark ? 'text-sand-200' : 'text-ocean-500'}`}>{value}</a>
                        ) : (
                          <p className={`font-body text-sm ${dark ? 'text-sand-200' : 'text-ocean-500'}`}>{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/212671779770"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-green-600 text-white font-body font-medium px-6 py-3.5 rounded-full transition-colors cursor-pointer mb-10"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.114 1.528 5.836L0 24l6.335-1.51A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 01-5.031-1.387l-.361-.214-3.762.897.939-3.65-.235-.374A9.808 9.808 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                  Chat on WhatsApp
                </a>

                {/* Mini map */}
                <div className="rounded-2xl overflow-hidden h-52 shadow-lg">
                  <iframe
                    title="DreamCatcher location"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3407.4399!2d-9.9519!3d29.7052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDQyJzE5LjAiTiA5wrA1NicyNi40Ilc!5e0!3m2!1sen!2sma!4v1"
                    className="border-0 w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={0.15}>
              <div className={cn('rounded-3xl p-8 md:p-10', dark ? 'bg-ocean-800' : 'bg-sand-50')}>
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <CheckCircle size={52} className="text-green-500 mb-5" />
                    <h3 className={`font-heading text-2xl mb-2 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>{tr.contact.sent_title}</h3>
                    <p className={`font-body text-sm max-w-xs ${dark ? 'text-sand-300' : 'text-ocean-400'}`}>{tr.contact.sent_sub}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 className={`font-heading text-2xl mb-7 ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>Send a Message</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cn-name" className={`block font-body text-xs mb-1.5 ${dark ? 'text-sand-400' : 'text-ocean-400'}`}>{tr.contact.name} *</label>
                          <input id="cn-name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Jane Smith" className={inputCls} autoComplete="name" />
                        </div>
                        <div>
                          <label htmlFor="cn-email" className={`block font-body text-xs mb-1.5 ${dark ? 'text-sand-400' : 'text-ocean-400'}`}>{tr.contact.email} *</label>
                          <input id="cn-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="jane@example.com" className={inputCls} autoComplete="email" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cn-phone" className={`block font-body text-xs mb-1.5 ${dark ? 'text-sand-400' : 'text-ocean-400'}`}>{tr.contact.phone}</label>
                          <input id="cn-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+44 7700 900000" className={inputCls} autoComplete="tel" />
                        </div>
                        <div>
                          <label htmlFor="cn-subject" className={`block font-body text-xs mb-1.5 ${dark ? 'text-sand-400' : 'text-ocean-400'}`}>{tr.contact.subject}</label>
                          <input id="cn-subject" name="subject" type="text" value={form.subject} onChange={handleChange} placeholder="Booking enquiry" className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="cn-msg" className={`block font-body text-xs mb-1.5 ${dark ? 'text-sand-400' : 'text-ocean-400'}`}>{tr.contact.message} *</label>
                        <textarea id="cn-msg" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Tell us about your stay..." className={cn(inputCls, 'resize-none')} />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-600 disabled:opacity-60 text-white font-body font-medium py-4 rounded-xl transition-colors cursor-pointer"
                      >
                        {loading ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        ) : (
                          <><Send size={15} /> {tr.contact.send}</>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
