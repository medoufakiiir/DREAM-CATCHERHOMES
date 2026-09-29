import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAdmin, Card, PageTitle, StatusBadge, Empty, VILLA_LABEL, fmtRange, btn } from './shared'
import { Booking } from '@/lib/db'
import { VillaId, isoDate, addDays, nightsBetween } from '@/lib/site'
import { cn } from '@/lib/utils'

const VILLAS: VillaId[] = ['two-bedroom', 'deluxe']

const BAR: Record<string, string> = {
  'confirmed-two-bedroom': 'bg-gold text-white',
  'confirmed-deluxe': 'bg-majorelle text-white',
  pending: 'bg-amber-100 text-amber-900 border border-dashed border-amber-400',
  blocked: 'bg-ocean-200 text-ocean-500 bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgba(0,0,0,.06)_6px_12px)]',
}

export default function CalendarView() {
  const { bookings, editBooking } = useAdmin()
  const now = new Date()
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const start = isoDate(new Date(ym.y, ym.m, 1))
  const end = isoDate(new Date(ym.y, ym.m + 1, 1))
  const n = nightsBetween(start, end)
  const days = Array.from({ length: n }, (_, i) => addDays(start, i))
  const today = isoDate(now)
  const shift = (k: number) => setYm(({ y, m }) => { const d = new Date(y, m + k, 1); return { y: d.getFullYear(), m: d.getMonth() } })

  const inMonth = bookings.filter(b => b.status !== 'cancelled' && b.checkin < end && b.checkout > start)
  const rows: { key: string; label: string; villa: VillaId | null }[] = [
    ...VILLAS.map(v => ({ key: v, label: VILLA_LABEL[v], villa: v })),
    ...(inMonth.some(b => !b.villa) ? [{ key: 'none', label: 'Unassigned', villa: null }] : []),
  ]

  // Each villa has two lanes: confirmed/blocked on top, pending requests below
  const lane = (b: Booking) => (b.status === 'pending' ? 1 : 0)
  const col = (iso: string) => (iso <= start ? 0 : iso >= end ? n : nightsBetween(start, iso))

  const occ = (v: VillaId) => {
    const nights = inMonth.filter(b => b.villa === v && b.status === 'confirmed').reduce((s, b) => s + nightsBetween(b.checkin > start ? b.checkin : start, b.checkout < end ? b.checkout : end), 0)
    return Math.round((nights / n) * 100)
  }

  const monthLabel = new Date(ym.y, ym.m, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <>
      <PageTitle
        title="Calendar"
        sub="Click an empty day to add a booking or block dates. Click a bar to edit."
        action={
          <div className="flex items-center gap-2">
            <button className={btn.icon} onClick={() => shift(-1)} aria-label="Previous month"><ChevronLeft size={16} /></button>
            <span className="font-heading text-2xl w-48 text-center">{monthLabel}</span>
            <button className={btn.icon} onClick={() => shift(1)} aria-label="Next month"><ChevronRight size={16} /></button>
            <button className={cn(btn.ghost, 'ml-2 py-2')} onClick={() => setYm({ y: now.getFullYear(), m: now.getMonth() })}>Today</button>
          </div>
        }
      />

      <Card className="overflow-x-auto">
        <div
          className="grid min-w-[900px]"
          style={{ gridTemplateColumns: `130px repeat(${n}, minmax(0, 1fr))` }}
        >
          {/* Header */}
          <div className="sticky left-0 bg-white z-10 border-b border-ocean-500/10" style={{ gridRow: 1, gridColumn: 1 }} />
          {days.map((d, i) => {
            const dt = new Date(d + 'T00:00:00')
            const we = dt.getDay() === 0 || dt.getDay() === 6
            return (
              <div key={d} style={{ gridRow: 1, gridColumn: i + 2 }} className={cn('text-center py-2 border-b border-l border-ocean-500/10', we && 'bg-sand-50', d === today && 'bg-gold/10')}>
                <p className="text-[10px] text-ocean-300 uppercase">{dt.toLocaleDateString('en-GB', { weekday: 'narrow' })}</p>
                <p className={cn('text-sm', d === today ? 'text-gold font-bold' : 'text-ocean-500')}>{dt.getDate()}</p>
              </div>
            )
          })}

          {/* Villa rows */}
          {rows.map((r, ri) => {
            const base = 2 + ri * 2
            const bars = inMonth.filter(b => (b.villa ?? null) === r.villa)
            return (
              <div key={r.key} className="contents">
                <div className="sticky left-0 z-10 bg-white border-b border-ocean-500/10 px-4 flex flex-col justify-center" style={{ gridRow: `${base} / span 2`, gridColumn: 1 }}>
                  <p className="font-heading text-lg leading-tight">{r.label}</p>
                  {r.villa && <p className="text-[11px] text-ocean-300">{occ(r.villa)}% booked</p>}
                </div>
                {days.map((d, i) => {
                  const dt = new Date(d + 'T00:00:00')
                  const we = dt.getDay() === 0 || dt.getDay() === 6
                  return (
                    <button
                      key={d}
                      onClick={() => editBooking({ villa: r.villa ?? 'two-bedroom', checkin: d, checkout: addDays(d, 1), status: 'confirmed' })}
                      className={cn('h-24 border-b border-l border-ocean-500/10 hover:bg-gold/5 cursor-pointer', we && 'bg-sand-50/60', d === today && 'bg-gold/5')}
                      style={{ gridRow: `${base} / span 2`, gridColumn: i + 2 }}
                      aria-label={`Add booking on ${d}`}
                    />
                  )
                })}
                {bars.map(b => {
                  const s = col(b.checkin), e = col(b.checkout)
                  const cls = b.status === 'confirmed' ? BAR[`confirmed-${b.villa ?? 'two-bedroom'}`] : BAR[b.status]
                  return (
                    <button
                      key={b.id}
                      onClick={() => editBooking(b)}
                      title={`${b.name} · ${fmtRange(b.checkin, b.checkout)} · ${b.status}`}
                      className={cn('relative z-[1] self-center h-9 mx-0.5 rounded-md px-2 text-left text-xs font-medium truncate cursor-pointer hover:brightness-95 shadow-sm', cls,
                        b.checkin < start && 'rounded-l-none ml-0', b.checkout > end && 'rounded-r-none mr-0')}
                      style={{ gridRow: base + lane(b), gridColumn: `${s + 2} / ${Math.max(e, s + 1) + 2}` }}
                    >
                      {b.name}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </Card>

      <div className="flex flex-wrap gap-5 text-xs text-ocean-400 mt-4">
        <span className="flex items-center gap-2"><span className="w-4 h-3 rounded bg-gold" /> Two-Bedroom confirmed</span>
        <span className="flex items-center gap-2"><span className="w-4 h-3 rounded bg-majorelle" /> Deluxe confirmed</span>
        <span className="flex items-center gap-2"><span className="w-4 h-3 rounded bg-amber-100 border border-dashed border-amber-400" /> Pending request</span>
        <span className="flex items-center gap-2"><span className="w-4 h-3 rounded bg-ocean-200" /> Blocked</span>
      </div>

      <h2 className="font-heading text-2xl mt-10 mb-4">Stays in {monthLabel}</h2>
      <Card>
        {inMonth.length === 0 ? <Empty>Nothing booked this month.</Empty> : (
          <ul className="divide-y divide-ocean-500/10">
            {[...inMonth].sort((a, b) => a.checkin.localeCompare(b.checkin)).map(b => (
              <li key={b.id}>
                <button onClick={() => editBooking(b)} className="w-full px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-left hover:bg-sand-50 cursor-pointer">
                  <span className="font-medium w-44 truncate">{b.name}</span>
                  <span className="text-ocean-400 w-28">{b.villa ? VILLA_LABEL[b.villa] : 'Unassigned'}</span>
                  <span className="text-ocean-400 flex-1">{fmtRange(b.checkin, b.checkout)} · {nightsBetween(b.checkin, b.checkout)}n</span>
                  <StatusBadge status={b.status} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
