import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import { db, overlaps, Booking, BookingStatus, Message, Review } from '@/lib/db'
import { VillaId, nightsBetween, addDays, isoDate } from '@/lib/site'
import { cn } from '@/lib/utils'

/* ─────────────────────────── formatting ─────────────────────────── */

export const VILLA_LABEL: Record<VillaId, string> = { 'two-bedroom': 'Two-Bedroom', deluxe: 'Deluxe' }
export const villaLabel = (v: VillaId | null) => (v ? VILLA_LABEL[v] : 'Any villa')
export const VILLA_DOT: Record<VillaId, string> = { 'two-bedroom': 'bg-gold', deluxe: 'bg-majorelle' }

export const fmt = (iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) =>
  new Date(iso.length === 10 ? iso + 'T00:00:00' : iso).toLocaleDateString('en-GB', opts)

export const fmtRange = (a: string, b: string) => `${fmt(a)} → ${fmt(b, { day: 'numeric', month: 'short', year: 'numeric' })}`

export const timeAgo = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 60) return `${Math.max(1, m)}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  return d < 30 ? `${d}d ago` : fmt(iso)
}

export const waGuest = (phone: string, text: string) => `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`

export const confirmText = (b: Booking) =>
  `Hello ${b.name.split(' ')[0]}, your stay at DreamCatcher Homes is confirmed: ${villaLabel(b.villa)} Villa, ${fmtRange(b.checkin, b.checkout)} (${nightsBetween(b.checkin, b.checkout)} nights). Check-in from 15:00. We look forward to welcoming you in Mirleft!`

/* ─────────────────────────── ui atoms ─────────────────────────── */

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-ocean-50 text-ocean-300 line-through',
  blocked: 'bg-ocean-100 text-ocean-500',
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={cn('inline-block px-2 py-0.5 rounded text-[11px] font-semibold capitalize', STATUS_STYLE[status])}>{status}</span>
}

export const btn = {
  primary: 'inline-flex items-center justify-center gap-2 bg-ocean-500 hover:bg-gold text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50',
  accent: 'inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50',
  ghost: 'inline-flex items-center justify-center gap-2 border border-ocean-500/15 hover:border-ocean-500/40 text-ocean-500 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer bg-white',
  icon: 'inline-flex items-center justify-center w-9 h-9 rounded-lg border border-ocean-500/15 hover:border-gold hover:text-gold text-ocean-400 transition-colors cursor-pointer bg-white',
}

export const field = 'w-full px-3 py-2.5 rounded-lg border border-ocean-500/15 bg-white text-sm text-ocean-500 outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 [color-scheme:light]'
export const labelCls = 'block text-[11px] uppercase tracking-[0.14em] text-ocean-300 mb-1.5'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={cn('bg-white rounded-xl border border-ocean-500/10', className)}>{children}</div>
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
      <div>
        <h1 className="font-heading text-4xl text-ocean-500">{title}</h1>
        {sub && <p className="text-sm text-ocean-300 mt-1">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm text-ocean-300 py-10 text-center">{children}</p>
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[80] bg-ocean-900/50 flex items-end sm:items-center justify-center p-0 sm:p-6" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" className="bg-sand-50 w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl" onMouseDown={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-sand-50 flex items-center justify-between px-6 py-4 border-b border-ocean-500/10">
          <h2 className="font-heading text-2xl text-ocean-500">{title}</h2>
          <button onClick={onClose} className={btn.icon} aria-label="Close"><X size={16} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

/* ─────────────────────────── admin data context ─────────────────────────── */

interface AdminData {
  bookings: Booking[]
  messages: Message[]
  reviews: Review[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  /** Run a mutation, then refresh everything. */
  run: (fn: () => Promise<unknown>) => Promise<void>
  editBooking: (b: Partial<Booking> | null) => void
}

const Ctx = createContext<AdminData | null>(null)
export const useAdmin = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAdmin outside provider')
  return c
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Partial<Booking> | null>(null)

  const reload = useCallback(async () => {
    try {
      const [b, m, r] = await Promise.all([db.list('bookings'), db.list('messages'), db.list('reviews')])
      setBookings(b); setMessages(m); setReviews(r); setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  const run = useCallback(async (fn: () => Promise<unknown>) => {
    try { await fn() } catch (e) { setError((e as Error).message) }
    await reload()
  }, [reload])

  return (
    <Ctx.Provider value={{ bookings, messages, reviews, loading, error, reload, run, editBooking: setEditing }}>
      {children}
      {editing && <BookingModal initial={editing} onClose={() => setEditing(null)} />}
    </Ctx.Provider>
  )
}

/* ─────────────────────────── booking create / edit ─────────────────────────── */

const SOURCES = ['website', 'booking.com', 'airbnb', 'direct', 'phone', 'admin']

function BookingModal({ initial, onClose }: { initial: Partial<Booking>; onClose: () => void }) {
  const { bookings, run } = useAdmin()
  const today = isoDate(new Date())
  const isNew = !initial.id
  const [b, setB] = useState<Omit<Booking, 'id' | 'created_at'>>({
    villa: initial.villa ?? 'two-bedroom',
    checkin: initial.checkin ?? today,
    checkout: initial.checkout ?? addDays(initial.checkin ?? today, 3),
    adults: initial.adults ?? 2,
    children: initial.children ?? 0,
    name: initial.name ?? '',
    phone: initial.phone ?? '',
    email: initial.email ?? null,
    requests: initial.requests ?? null,
    status: initial.status ?? 'confirmed',
    source: initial.source ?? 'direct',
    notes: initial.notes ?? null,
  })
  const set = <K extends keyof typeof b>(k: K, v: (typeof b)[K]) => setB(x => ({ ...x, [k]: v }))
  const nights = nightsBetween(b.checkin, b.checkout)
  const clash = b.status !== 'cancelled' && bookings.find(o =>
    o.id !== initial.id && (o.status === 'confirmed' || o.status === 'blocked') &&
    (o.villa === b.villa || !o.villa || !b.villa) && overlaps(b.checkin, b.checkout, o.checkin, o.checkout))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nights) return
    const row = { ...b, name: b.name.trim() || (b.status === 'blocked' ? 'Blocked' : 'Guest') }
    await run(() => (isNew ? db.insert('bookings', row) : db.update('bookings', initial.id!, row)))
    onClose()
  }

  const del = async () => {
    if (!initial.id || !confirm('Delete this booking permanently?')) return
    await run(() => db.remove('bookings', initial.id!))
    onClose()
  }

  return (
    <Modal title={isNew ? 'New booking' : 'Edit booking'} onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Villa</label>
            <select className={field} value={b.villa ?? ''} onChange={e => set('villa', (e.target.value || null) as VillaId | null)}>
              <option value="two-bedroom">Two-Bedroom Villa</option>
              <option value="deluxe">Deluxe Villa</option>
              <option value="">Any / not assigned</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select className={field} value={b.status} onChange={e => set('status', e.target.value as BookingStatus)}>
              {(['pending', 'confirmed', 'blocked', 'cancelled'] as const).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Check-in</label>
            <input type="date" className={field} value={b.checkin} required onChange={e => {
              const v = e.target.value
              setB(x => ({ ...x, checkin: v, checkout: x.checkout <= v ? addDays(v, 1) : x.checkout }))
            }} />
          </div>
          <div>
            <label className={labelCls}>Check-out · {nights} night{nights === 1 ? '' : 's'}</label>
            <input type="date" className={field} value={b.checkout} min={addDays(b.checkin, 1)} required onChange={e => set('checkout', e.target.value)} />
          </div>
        </div>

        {clash && (
          <p className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            Overlaps with {clash.name} ({clash.status}, {fmtRange(clash.checkin, clash.checkout)}).
          </p>
        )}

        {b.status !== 'blocked' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Guest name</label>
                <input className={field} value={b.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div>
                <label className={labelCls}>Source</label>
                <select className={field} value={b.source} onChange={e => set('source', e.target.value)}>
                  {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Phone / WhatsApp</label>
                <input className={field} value={b.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" className={field} value={b.email ?? ''} onChange={e => set('email', e.target.value || null)} />
              </div>
              <div>
                <label className={labelCls}>Adults</label>
                <input type="number" min={0} max={20} className={field} value={b.adults} onChange={e => set('adults', +e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Children</label>
                <input type="number" min={0} max={20} className={field} value={b.children} onChange={e => set('children', +e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Guest requests</label>
              <textarea rows={2} className={cn(field, 'resize-none')} value={b.requests ?? ''} onChange={e => set('requests', e.target.value || null)} />
            </div>
          </>
        )}
        {b.status === 'blocked' && (
          <div>
            <label className={labelCls}>Reason (optional)</label>
            <input className={field} placeholder="Owner stay, maintenance…" value={b.name} onChange={e => set('name', e.target.value)} />
          </div>
        )}
        <div>
          <label className={labelCls}>Private notes</label>
          <textarea rows={2} className={cn(field, 'resize-none')} value={b.notes ?? ''} onChange={e => set('notes', e.target.value || null)} />
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          {!isNew ? (
            <button type="button" onClick={del} className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline cursor-pointer"><Trash2 size={14} /> Delete</button>
          ) : <span />}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className={btn.ghost}>Cancel</button>
            <button type="submit" disabled={!nights} className={btn.primary}>{isNew ? 'Add booking' : 'Save changes'}</button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
