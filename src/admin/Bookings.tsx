import { useState } from 'react'
import { Check, X, MessageCircle, Pencil, Search } from 'lucide-react'
import { useAdmin, Card, PageTitle, StatusBadge, Empty, villaLabel, fmtRange, timeAgo, waGuest, confirmText, btn, field } from './shared'
import { db, BookingStatus } from '@/lib/db'
import { nightsBetween } from '@/lib/site'
import { cn } from '@/lib/utils'

const TABS: (BookingStatus | 'all')[] = ['pending', 'confirmed', 'blocked', 'cancelled', 'all']

export default function Bookings() {
  const { bookings, run, editBooking } = useAdmin()
  const [tab, setTab] = useState<BookingStatus | 'all'>('pending')
  const [q, setQ] = useState('')

  const count = (t: BookingStatus | 'all') => (t === 'all' ? bookings.length : bookings.filter(b => b.status === t).length)
  const rows = bookings
    .filter(b => tab === 'all' || b.status === tab)
    .filter(b => !q || `${b.name} ${b.email ?? ''} ${b.phone}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (tab === 'pending' ? b.created_at.localeCompare(a.created_at) : a.checkin.localeCompare(b.checkin)))

  const setStatus = (id: string, status: BookingStatus) => run(() => db.update('bookings', id, { status }))

  return (
    <>
      <PageTitle title="Bookings" sub="Requests from the website land here as pending." />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex gap-1 bg-white border border-ocean-500/10 rounded-lg p-1 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn('px-3.5 py-1.5 rounded-md text-sm capitalize whitespace-nowrap cursor-pointer transition-colors', tab === t ? 'bg-ocean-500 text-white' : 'text-ocean-400 hover:text-ocean-500')}
            >
              {t} <span className="opacity-60 ml-1">{count(t)}</span>
            </button>
          ))}
        </div>
        <label className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300" />
          <input className={cn(field, 'pl-9')} placeholder="Search guest, email, phone" value={q} onChange={e => setQ(e.target.value)} />
        </label>
      </div>

      <Card className="overflow-x-auto">
        {rows.length === 0 ? <Empty>No {tab === 'all' ? '' : tab} bookings.</Empty> : (
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-ocean-300 border-b border-ocean-500/10">
                <th className="font-medium px-5 py-3">Guest</th>
                <th className="font-medium px-3 py-3">Villa</th>
                <th className="font-medium px-3 py-3">Dates</th>
                <th className="font-medium px-3 py-3">Guests</th>
                <th className="font-medium px-3 py-3">Source</th>
                <th className="font-medium px-3 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-500/10">
              {rows.map(b => (
                <tr key={b.id} className="hover:bg-sand-50/60 align-top">
                  <td className="px-5 py-4">
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-ocean-300">{[b.phone, b.email].filter(Boolean).join(' · ') || '—'}</p>
                    {b.requests && <p className="text-xs text-ocean-400 mt-1.5 max-w-xs italic">“{b.requests}”</p>}
                    {b.notes && <p className="text-xs text-gold mt-1 max-w-xs">Note: {b.notes}</p>}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">{villaLabel(b.villa)}</td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {fmtRange(b.checkin, b.checkout)}
                    <p className="text-xs text-ocean-300">{nightsBetween(b.checkin, b.checkout)} nights</p>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">{b.adults}{b.children ? ` + ${b.children}` : ''}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-ocean-400">
                    {b.source}
                    <p className="text-xs text-ocean-300">{timeAgo(b.created_at)}</p>
                  </td>
                  <td className="px-3 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1.5">
                      {b.status === 'pending' && (
                        <>
                          <button
                            className={cn(btn.accent, 'py-2 px-3')}
                            onClick={async () => {
                              await setStatus(b.id, 'confirmed')
                              if (b.phone && confirm('Booking confirmed. Send the guest a confirmation on WhatsApp?')) {
                                window.open(waGuest(b.phone, confirmText(b)), '_blank', 'noopener')
                              }
                            }}
                          >
                            <Check size={14} /> Confirm
                          </button>
                          <button className={btn.icon} title="Decline" onClick={() => setStatus(b.id, 'cancelled')}><X size={15} /></button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <button className={btn.icon} title="Cancel booking" onClick={() => confirm('Cancel this booking?') && setStatus(b.id, 'cancelled')}><X size={15} /></button>
                      )}
                      {b.status === 'cancelled' && (
                        <button className={cn(btn.ghost, 'py-2 px-3')} onClick={() => setStatus(b.id, 'pending')}>Restore</button>
                      )}
                      {b.phone && (
                        <a className={btn.icon} title="WhatsApp guest" href={waGuest(b.phone, `Hello ${b.name.split(' ')[0]}, this is DreamCatcher Homes about your stay (${fmtRange(b.checkin, b.checkout)}).`)} target="_blank" rel="noopener noreferrer">
                          <MessageCircle size={15} />
                        </a>
                      )}
                      <button className={btn.icon} title="Edit" onClick={() => editBooking(b)}><Pencil size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  )
}
