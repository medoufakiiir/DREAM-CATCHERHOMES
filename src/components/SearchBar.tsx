import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Users, Search, Home as HomeIcon } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { isoDate, addDays } from '@/lib/site'
import { cn } from '@/lib/utils'

export default function SearchBar() {
  const { tr } = useApp()
  const navigate = useNavigate()
  const today = isoDate(new Date())
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [guests, setGuests] = useState(2)
  const [villa, setVilla] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = new URLSearchParams()
    if (checkin) q.set('checkin', checkin)
    if (checkout) q.set('checkout', checkout)
    q.set('adults', String(guests))
    if (villa) q.set('villa', villa)
    navigate(`/booking?${q}`)
  }

  const cell = 'flex items-center gap-3 px-4 py-2.5 text-left min-w-0'
  const label = 'block font-body text-[10px] uppercase tracking-widest text-ocean-300'
  const input = 'w-full bg-transparent font-body text-sm text-ocean-500 outline-none cursor-pointer'

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl md:rounded-full shadow-2xl shadow-black/30 p-2 grid grid-cols-2 md:grid-cols-[1fr_1fr_0.8fr_1fr_auto] items-center gap-y-1 md:divide-x divide-sand-100"
    >
      <label className={cell}>
        <CalendarDays size={16} className="text-gold shrink-0" />
        <span className="min-w-0 flex-1">
          <span className={label}>{tr.x.search_checkin}</span>
          <input
            type="date"
            min={today}
            value={checkin}
            onChange={e => {
              setCheckin(e.target.value)
              if (!checkout || checkout <= e.target.value) setCheckout(addDays(e.target.value, 3))
            }}
            className={input}
          />
        </span>
      </label>
      <label className={cell}>
        <CalendarDays size={16} className="text-gold shrink-0" />
        <span className="min-w-0 flex-1">
          <span className={label}>{tr.x.search_checkout}</span>
          <input
            type="date"
            min={checkin ? addDays(checkin, 1) : addDays(today, 1)}
            value={checkout}
            onChange={e => setCheckout(e.target.value)}
            className={input}
          />
        </span>
      </label>
      <label className={cell}>
        <Users size={16} className="text-gold shrink-0" />
        <span className="min-w-0 flex-1">
          <span className={label}>{tr.x.search_guests}</span>
          <select value={guests} onChange={e => setGuests(+e.target.value)} className={input}>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? tr.x.guest_one : tr.x.guest_many}</option>
            ))}
          </select>
        </span>
      </label>
      <label className={cell}>
        <HomeIcon size={16} className="text-gold shrink-0" />
        <span className="min-w-0 flex-1">
          <span className={label}>{tr.x.search_villa}</span>
          <select value={villa} onChange={e => setVilla(e.target.value)} className={input}>
            <option value="">{tr.x.search_any}</option>
            <option value="two-bedroom">{tr.villas.v1_name}</option>
            <option value="deluxe">{tr.villas.v2_name}</option>
          </select>
        </span>
      </label>
      <div className={cn('col-span-2 md:col-span-1 md:pl-2 !border-0')}>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-600 text-white font-body text-sm font-medium px-6 py-3.5 rounded-full transition-colors cursor-pointer shadow-lg shadow-gold/30 whitespace-nowrap"
        >
          <Search size={16} />
          {tr.x.search_btn}
        </button>
      </div>
    </form>
  )
}
