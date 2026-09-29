import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck, Clock, Mail, Percent, LogIn, LogOut } from 'lucide-react'
import { useAdmin, Card, PageTitle, Empty, villaLabel, fmt, fmtRange, timeAgo, VILLA_DOT } from './shared'
import { nightsBetween, isoDate, addDays } from '@/lib/site'
import { cn } from '@/lib/utils'

export default function Overview() {
  const { bookings, messages, reviews, loading, editBooking } = useAdmin()
  const today = isoDate(new Date())
  const week = addDays(today, 7)
  const live = bookings.filter(b => b.status === 'confirmed')

  // Occupancy this calendar month across both villas
  const d = new Date()
  const monthStart = isoDate(new Date(d.getFullYear(), d.getMonth(), 1))
  const monthEnd = isoDate(new Date(d.getFullYear(), d.getMonth() + 1, 1))
  const daysInMonth = nightsBetween(monthStart, monthEnd)
  const bookedNights = live.reduce((n, b) => {
    const a = b.checkin > monthStart ? b.checkin : monthStart
    const z = b.checkout < monthEnd ? b.checkout : monthEnd
    return n + nightsBetween(a, z)
  }, 0)
  const occupancy = Math.round((bookedNights / (daysInMonth * 2)) * 100)

  const pending = bookings.filter(b => b.status === 'pending')
  const arrivals = live.filter(b => b.checkin >= today && b.checkin <= week).sort((a, b) => a.checkin.localeCompare(b.checkin))
  const departures = live.filter(b => b.checkout >= today && b.checkout <= week).sort((a, b) => a.checkout.localeCompare(b.checkout))
  const inHouse = live.filter(b => b.checkin <= today && b.checkout > today)
  const unread = messages.filter(m => !m.read)

  const stats = [
    { icon: Clock, label: 'Pending requests', value: pending.length, to: '/admin/bookings', tone: pending.length ? 'text-amber-600' : '' },
    { icon: CalendarCheck, label: 'Arrivals next 7 days', value: arrivals.length, to: '/admin/calendar' },
    { icon: Percent, label: `Occupancy · ${d.toLocaleDateString('en-GB', { month: 'long' })}`, value: `${occupancy}%`, to: '/admin/calendar' },
    { icon: Mail, label: 'Unread messages', value: unread.length, to: '/admin/messages', tone: unread.length ? 'text-gold' : '' },
  ]

  if (loading) return <Empty>Loading…</Empty>

  return (
    <>
      <PageTitle title="Overview" sub={inHouse.length ? `${inHouse.length} villa${inHouse.length > 1 ? 's' : ''} occupied tonight` : 'Both villas are free tonight'} />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, to, tone }) => (
          <Link key={label} to={to} className="group">
            <Card className="p-5 h-full group-hover:border-gold/50 transition-colors">
              <Icon size={18} className="text-gold mb-4" />
              <p className={cn('font-heading text-5xl leading-none', tone || 'text-ocean-500')}>{value}</p>
              <p className="text-xs text-ocean-300 mt-2">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Pending requests */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ocean-500/10">
            <h2 className="font-heading text-2xl">New requests</h2>
            <Link to="/admin/bookings" className="text-xs text-ocean-300 hover:text-gold inline-flex items-center gap-1">All bookings <ArrowRight size={12} /></Link>
          </div>
          {pending.length === 0 ? <Empty>No pending requests — you're all caught up.</Empty> : (
            <ul className="divide-y divide-ocean-500/10">
              {pending.slice(0, 6).map(b => (
                <li key={b.id}>
                  <button onClick={() => editBooking(b)} className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-sand-50 cursor-pointer">
                    <span className={cn('w-2 h-2 rounded-full shrink-0', b.villa ? VILLA_DOT[b.villa] : 'bg-ocean-200')} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{b.name}</p>
                      <p className="text-xs text-ocean-300">{villaLabel(b.villa)} · {fmtRange(b.checkin, b.checkout)} · {b.adults + b.children} guests</p>
                    </div>
                    <span className="text-xs text-ocean-300 shrink-0">{timeAgo(b.created_at)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* This week */}
        <Card>
          <div className="px-5 py-4 border-b border-ocean-500/10"><h2 className="font-heading text-2xl">This week</h2></div>
          <div className="p-5 space-y-5">
            {[{ title: 'Arrivals', icon: LogIn, rows: arrivals, date: 'checkin' as const }, { title: 'Departures', icon: LogOut, rows: departures, date: 'checkout' as const }].map(({ title, icon: Icon, rows, date }) => (
              <div key={title}>
                <p className="text-[11px] uppercase tracking-[0.14em] text-ocean-300 mb-2 flex items-center gap-1.5"><Icon size={12} /> {title}</p>
                {rows.length === 0 ? <p className="text-sm text-ocean-300">None</p> : rows.map(b => (
                  <button key={b.id} onClick={() => editBooking(b)} className="w-full flex items-center justify-between gap-3 py-1.5 text-sm hover:text-gold cursor-pointer">
                    <span className="flex items-center gap-2 min-w-0"><span className={cn('w-2 h-2 rounded-full shrink-0', b.villa ? VILLA_DOT[b.villa] : 'bg-ocean-200')} /><span className="truncate">{b.name}</span></span>
                    <span className="text-xs text-ocean-300 shrink-0">{b[date] === today ? 'Today' : fmt(b[date], { weekday: 'short', day: 'numeric' })}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </Card>

        {/* Messages */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ocean-500/10">
            <h2 className="font-heading text-2xl">Latest messages</h2>
            <Link to="/admin/messages" className="text-xs text-ocean-300 hover:text-gold inline-flex items-center gap-1">Inbox <ArrowRight size={12} /></Link>
          </div>
          {messages.length === 0 ? <Empty>No messages yet.</Empty> : (
            <ul className="divide-y divide-ocean-500/10">
              {messages.slice(0, 4).map(m => (
                <li key={m.id}>
                  <Link to={`/admin/messages?id=${m.id}`} className="px-5 py-4 flex gap-4 hover:bg-sand-50">
                    <span className={cn('w-2 h-2 rounded-full shrink-0 mt-1.5', m.read ? 'bg-transparent' : 'bg-gold')} />
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm truncate', !m.read && 'font-semibold')}>{m.name} {m.subject && <span className="text-ocean-300 font-normal">· {m.subject}</span>}</p>
                      <p className="text-xs text-ocean-300 truncate">{m.message}</p>
                    </div>
                    <span className="text-xs text-ocean-300 shrink-0">{timeAgo(m.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* In house */}
        <Card>
          <div className="px-5 py-4 border-b border-ocean-500/10"><h2 className="font-heading text-2xl">In house</h2></div>
          <div className="p-5 space-y-3">
            {inHouse.length === 0 ? <p className="text-sm text-ocean-300">No guests tonight.</p> : inHouse.map(b => (
              <button key={b.id} onClick={() => editBooking(b)} className="w-full text-left cursor-pointer group">
                <p className="text-sm font-medium group-hover:text-gold">{b.name}</p>
                <p className="text-xs text-ocean-300">{villaLabel(b.villa)} · until {fmt(b.checkout)}</p>
              </button>
            ))}
            <div className="pt-3 border-t border-ocean-500/10 flex items-center justify-between text-xs text-ocean-300">
              <span>Published reviews</span>
              <Link to="/admin/reviews" className="font-semibold text-ocean-500 hover:text-gold">{reviews.filter(r => r.published).length}</Link>
            </div>
            <div className="flex items-center justify-between text-xs text-ocean-300">
              <span>Confirmed stays</span>
              <span className="font-semibold text-ocean-500">{live.length}</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
