import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import Seo from '@/components/Seo'
import { SITE, waLink } from '@/lib/site'
import { cn } from '@/lib/utils'

type Section = { h: string; p?: string; ul?: string[]; after?: string }

const PRIVACY: Section[] = [
  { h: '1. Information We Collect', p: 'We may collect the following information:', ul: [
    'Name, email address, and phone number submitted via our booking or contact forms',
    'Booking dates and villa preferences',
    'Communication history via WhatsApp or email',
    'IP address and browser type for security purposes',
  ] },
  { h: '2. How We Use Your Information', p: 'Your information is used solely to:', ul: [
    'Respond to your booking enquiry or question',
    'Process and manage your reservation',
    'Send relevant updates about your stay',
    'Improve our website and services',
    'Comply with legal obligations',
  ], after: 'We do not sell, trade, or rent your personal information to third parties.' },
  { h: '3. Third-Party Services', p: 'We use the following third-party services, each with their own privacy policies:', ul: [
    'Booking.com — for online reservations.',
    'WhatsApp (Meta) — booking and contact forms open WhatsApp with your message pre-filled; nothing is sent until you press send.',
    'Google Maps — for the embedded location map.',
    'Google Fonts — for typography.',
  ] },
  { h: '4. Cookies & Local Storage', p: 'We do not use advertising or tracking cookies. Your browser stores your language and light/dark theme preference locally so the site remembers them on your next visit.' },
  { h: '5. Data Retention', p: 'Enquiry data is retained for up to 2 years after your last contact or stay, unless you request earlier deletion. Booking records may be kept for up to 7 years for accounting and legal compliance.' },
  { h: '6. Your Rights', p: 'You have the right to:', ul: [
    'Access the personal data we hold about you',
    'Request correction of inaccurate data',
    'Request deletion of your data',
    'Withdraw consent for marketing communications at any time',
    'Lodge a complaint with your national data protection authority',
  ] },
  { h: '7. Data Security', p: 'We take reasonable precautions to protect your personal information. Our website uses HTTPS encryption. However, no method of internet transmission is 100% secure.' },
  { h: "8. Children's Privacy", p: 'Our website is not directed at children under the age of 16. We do not knowingly collect personal information from children.' },
  { h: '9. Changes to This Policy', p: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.' },
]

const TERMS: Section[] = [
  { h: '1. Reservations & Payment', ul: [
    'All bookings made via Booking.com are subject to their terms and payment policies.',
    'Direct bookings are confirmed by our team via WhatsApp or email. No prepayment is required; payment is made at the property (cash, Visa, Mastercard).',
    'A refundable security deposit may be requested upon arrival and returned after check-out, subject to an inspection.',
  ] },
  { h: '2. Cancellation Policy', ul: [
    'Cancellation terms are confirmed with your booking. Booking.com reservations follow the policy shown at the time of booking.',
    'In exceptional circumstances (force majeure, natural disaster, travel restrictions), we will work with guests to offer postponement or credit.',
    'We recommend purchasing travel insurance that includes accommodation cancellation cover.',
  ] },
  { h: '3. Check-in & Check-out', ul: [
    'Check-in: from 3:00 PM local time',
    'Check-out: by 11:00 AM local time',
    'Early check-in or late check-out may be available on request',
    'Guests must present a valid passport or national ID on arrival as required by Moroccan law',
  ] },
  { h: '4. Occupancy & Use', ul: [
    'Villas must not be occupied by more than the number of guests specified at booking',
    'Parties and events are not permitted without prior written consent',
    'Guests are expected to respect the property, neighbours, and local community',
    'Smoking is not permitted inside the villas',
    'Pets are not permitted unless explicitly agreed in writing',
  ] },
  { h: '5. Pool & Facilities', ul: [
    'Children under 12 must be supervised by an adult at the pool at all times',
    'Glass is not permitted in the pool area',
  ] },
  { h: '6. Damage & Liability', ul: [
    'Guests are responsible for any damage to the villa or its contents caused during their stay',
    'DreamCatcher Homes accepts no liability for loss or theft of personal belongings',
    'We are not liable for events beyond our control including utility outages, extreme weather, or local disruptions',
  ] },
  { h: '7. Activities & Experiences', ul: [
    'Activities such as surfing, horse riding, and fishing are provided by third-party operators',
    'All outdoor activities are undertaken at the guest\'s own risk',
  ] },
  { h: '8. Governing Law', p: 'These Terms are governed by the laws of the Kingdom of Morocco. Any disputes shall be subject to the exclusive jurisdiction of the courts of Tiznit, Morocco.' },
  { h: '9. Amendments', p: 'We reserve the right to amend these Terms at any time. Bookings made prior to any change will be honoured under the terms in effect at the time of booking.' },
]

export default function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const { tr, dark } = useApp()
  const title = kind === 'privacy' ? tr.footer.privacy : tr.footer.terms
  const sections = kind === 'privacy' ? PRIVACY : TERMS
  const text = dark ? 'text-sand-300/85' : 'text-ocean-400'
  const head = dark ? 'text-sand-100' : 'text-ocean-500'

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-white'}>
      <Seo title={title} />
      <div className="bg-ocean-500 pt-36 pb-14 text-center px-5">
        <p className="font-body text-xs uppercase tracking-widest text-gold mb-2">{tr.footer.legal}</p>
        <h1 className="font-heading text-4xl sm:text-5xl text-white font-bold">{title}</h1>
      </div>
      <article className="max-w-3xl mx-auto px-5 sm:px-8 py-16 font-body text-sm leading-relaxed">
        <p className={cn('text-xs mb-8', text)}>Last updated: September 2026</p>
        {sections.map(s => (
          <section key={s.h} className="mb-8">
            <h2 className={cn('font-heading text-xl mb-3', head)}>{s.h}</h2>
            {s.p && <p className={cn('mb-3', text)}>{s.p}</p>}
            {s.ul && (
              <ul className={cn('list-disc pl-5 space-y-1.5 marker:text-gold', text)}>
                {s.ul.map(li => <li key={li}>{li}</li>)}
              </ul>
            )}
            {s.after && <p className={cn('mt-3', text)}>{s.after}</p>}
          </section>
        ))}
        <section className="mb-8">
          <h2 className={cn('font-heading text-xl mb-3', head)}>Contact</h2>
          <ul className={cn('space-y-1.5', text)}>
            <li>Email: <a className="text-gold hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li>WhatsApp: <a className="text-gold hover:underline" href={waLink()} target="_blank" rel="noopener noreferrer">{SITE.phoneDisplay}</a></li>
            <li>Address: {SITE.address}</li>
          </ul>
        </section>
        <Link to="/" className="inline-block mt-4 text-gold hover:underline">← {tr.x.back_home}</Link>
      </article>
    </div>
  )
}
