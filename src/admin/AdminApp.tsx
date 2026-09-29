import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, Link } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, ClipboardList, Mail, Star, LogOut, ExternalLink, Menu, X, Plus, RotateCcw } from 'lucide-react'
import { db, mode, resetDemo } from '@/lib/db'
import { AdminDataProvider, useAdmin, btn, field, labelCls } from './shared'
import Overview from './Overview'
import CalendarView from './CalendarView'
import Bookings from './Bookings'
import Messages from './Messages'
import Reviews from './Reviews'
import { cn } from '@/lib/utils'

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setErr('')
    try { await db.signIn(email, password); onDone() } catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen bg-sand-50 grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img src="/photo10.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ocean-900/40" />
        <p className="absolute bottom-12 left-12 right-12 font-heading text-white text-5xl leading-tight">Welcome back to DreamCatcher.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm">
          <img src="/logo.png" alt="DreamCatcher Homes" className="h-16 mb-8" />
          <h1 className="font-heading text-4xl text-ocean-500 mb-1">Admin sign in</h1>
          <p className="text-sm text-ocean-300 mb-8">Manage bookings, messages and reviews.</p>
          {mode === 'demo' && (
            <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 mb-5">
              <b>Demo mode</b> — no database connected yet, so any email and password will work and the data is sample data stored in this browser only.
            </p>
          )}
          <label className={labelCls}>Email</label>
          <input type="email" className={cn(field, 'mb-4')} value={email} onChange={e => setEmail(e.target.value)} required={mode === 'live'} autoComplete="username" />
          <label className={labelCls}>Password</label>
          <input type="password" className={cn(field, 'mb-6')} value={password} onChange={e => setPassword(e.target.value)} required={mode === 'live'} autoComplete="current-password" />
          {err && <p className="text-sm text-red-600 mb-4">{err}</p>}
          <button disabled={busy} className={cn(btn.primary, 'w-full py-3')}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <Link to="/" className="block text-center text-xs text-ocean-300 hover:text-gold mt-6">← Back to website</Link>
        </form>
      </div>
    </div>
  )
}

function Shell({ onSignOut }: { onSignOut: () => void }) {
  const { bookings, messages, error, editBooking, reload } = useAdmin()
  const [open, setOpen] = useState(false)
  const pending = bookings.filter(b => b.status === 'pending').length
  const unread = messages.filter(m => !m.read).length

  const nav = [
    { to: '/admin', end: true, icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/calendar', icon: CalendarDays, label: 'Calendar' },
    { to: '/admin/bookings', icon: ClipboardList, label: 'Bookings', count: pending },
    { to: '/admin/messages', icon: Mail, label: 'Messages', count: unread },
    { to: '/admin/reviews', icon: Star, label: 'Reviews' },
  ]

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 flex items-center justify-between">
        <img src="/logo.png" alt="DreamCatcher Homes" className="h-12 brightness-0 invert" />
        <button className="lg:hidden text-white/70" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>
      </div>
      <nav className="px-3 space-y-1 flex-1">
        {nav.map(({ to, end, icon: Icon, label, count }) => (
          <NavLink
            key={to} to={to} end={end} onClick={() => setOpen(false)}
            className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors', isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5')}
          >
            <Icon size={17} />
            <span className="flex-1">{label}</span>
            {!!count && <span className="min-w-5 h-5 px-1.5 rounded-full bg-gold text-white text-[11px] font-semibold flex items-center justify-center">{count}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-5 space-y-1 border-t border-white/10 pt-4">
        {mode === 'demo' && (
          <button onClick={async () => { if (confirm('Reset demo data?')) { resetDemo(); await reload() } }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white cursor-pointer">
            <RotateCcw size={16} /> Reset demo data
          </button>
        )}
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white">
          <ExternalLink size={16} /> View website
        </a>
        <button onClick={onSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white cursor-pointer">
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-sand-50 font-body text-ocean-500">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-60 bg-ocean-500">{sidebar}</aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-ocean-900/50" onClick={() => setOpen(false)}>
          <aside className="w-64 h-full bg-ocean-500" onClick={e => e.stopPropagation()}>{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-40 bg-sand-50/90 backdrop-blur border-b border-ocean-500/10 h-16 flex items-center justify-between px-4 sm:px-8">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="hidden lg:block text-sm text-ocean-300">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-3">
            {mode === 'demo' && <span className="text-[11px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded">Demo data</span>}
            <button onClick={() => editBooking({})} className={btn.accent}><Plus size={15} /> New booking</button>
          </div>
        </header>
        {error && <p className="mx-4 sm:mx-8 mt-4 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">{error}</p>}
        <main className="px-4 sm:px-8 py-8 max-w-[1400px]">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="messages" element={<Messages />} />
            <Route path="reviews" element={<Reviews />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    document.title = 'Admin · DreamCatcher Homes'
    const meta = document.createElement('meta')
    meta.name = 'robots'; meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    document.documentElement.classList.remove('dark')
    db.isSignedIn().then(setAuthed)
    return () => { meta.remove() }
  }, [])

  if (authed === null) return <div className="min-h-screen bg-sand-50" />
  if (!authed) return <Login onDone={() => setAuthed(true)} />
  return (
    <AdminDataProvider>
      <Shell onSignOut={async () => { await db.signOut(); setAuthed(false) }} />
    </AdminDataProvider>
  )
}
