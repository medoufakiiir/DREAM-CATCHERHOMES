import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { testimonials } from '@/i18n/translations'
import { VillaId, isoDate, addDays } from '@/lib/site'

/* ─────────────────────────── types ─────────────────────────── */

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'blocked'

export interface Booking {
  id: string
  created_at: string
  villa: VillaId | null
  checkin: string
  checkout: string
  adults: number
  children: number
  name: string
  phone: string
  email: string | null
  requests: string | null
  status: BookingStatus
  source: string
  notes: string | null
}

export interface Message {
  id: string
  created_at: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  read: boolean
}

export interface Review {
  id: string
  created_at: string
  name: string
  country: string
  text: string
  rating: number
  published: boolean
}

type Tables = { bookings: Booking; messages: Message; reviews: Review }
type TableName = keyof Tables
type NewRow<T> = Omit<T, 'id' | 'created_at'>

export type BookedRange = { villa: VillaId | null; checkin: string; checkout: string }

/** True when [a1, b1) and [a2, b2) share at least one night. */
export const overlaps = (a1: string, b1: string, a2: string, b2: string) => a1 < b2 && a2 < b1

/* ─────────────────────────── live (Supabase) ─────────────────────────── */

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const sb: SupabaseClient | null = URL && KEY ? createClient(URL, KEY) : null

export const mode: 'live' | 'demo' = sb ? 'live' : 'demo'

/* ─────────────────────────── demo (localStorage) ─────────────────────────── */

const DEMO_KEY = 'dc-demo-db-v1'
const DEMO_AUTH = 'dc-demo-auth'
type DemoDb = { [K in TableName]: Tables[K][] }

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

function seed(): DemoDb {
  const t = isoDate(new Date())
  const ago = (h: number) => new Date(Date.now() - h * 3600e3).toISOString()
  const b = (villa: VillaId, inDays: number, nights: number, name: string, status: BookingStatus, extra: Partial<Booking> = {}): Booking => ({
    id: uid(), created_at: ago(24 * 5), villa, checkin: addDays(t, inDays), checkout: addDays(t, inDays + nights),
    adults: 2, children: 0, name, phone: '+44 7700 900123', email: null, requests: null, status, source: 'website', notes: null, ...extra,
  })
  return {
    bookings: [
      b('two-bedroom', -2, 5, 'Martin Keller', 'confirmed', { adults: 2, children: 1, source: 'booking.com' }),
      b('deluxe', 1, 4, 'Anthea Morris', 'confirmed', { email: 'anthea@example.com', requests: 'Airport transfer from Agadir please' }),
      b('two-bedroom', 6, 7, 'Claudio Rossi', 'confirmed', { adults: 4 }),
      b('deluxe', 9, 3, 'Owner stay', 'blocked', { name: 'Owner stay', phone: '', source: 'admin' }),
      b('deluxe', 14, 6, 'Marcel de Vries', 'pending', { created_at: ago(3), email: 'marcel@example.com', requests: 'Late check-in around 22:00' }),
      b('two-bedroom', 18, 4, 'Zane Ozols', 'pending', { created_at: ago(20), adults: 3 }),
      b('deluxe', 22, 5, 'Richard Hall', 'confirmed', { source: 'booking.com' }),
      b('two-bedroom', -15, 3, 'Alexandra Price', 'cancelled'),
    ],
    messages: [
      { id: uid(), created_at: ago(2), name: 'Sofia Martins', email: 'sofia@example.com', phone: '+351 912 345 678', subject: 'Surf lessons', message: 'Hi! We are arriving in November — can you arrange surf lessons for two beginners?', read: false },
      { id: uid(), created_at: ago(26), name: 'Tom Becker', email: 'tom@example.com', phone: null, subject: 'Dogs', message: 'Is it possible to bring our small dog? He is very calm.', read: false },
      { id: uid(), created_at: ago(80), name: 'Leila Amrani', email: 'leila@example.com', phone: '+212 600 000 000', subject: 'Group stay', message: 'We are 8 friends — could we book both villas for a week in December?', read: true },
    ],
    reviews: testimonials.map((r, i) => ({
      id: uid(), created_at: ago(24 * (i + 1) * 9), name: r.name, country: r.role, text: r.text, rating: 10, published: true,
    })),
  }
}

function load(): DemoDb {
  try {
    const raw = localStorage.getItem(DEMO_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  const s = seed()
  save(s)
  return s
}
function save(d: DemoDb) {
  try { localStorage.setItem(DEMO_KEY, JSON.stringify(d)) } catch { /* ignore */ }
}

export function resetDemo() {
  save(seed())
}

/* ─────────────────────────── API ─────────────────────────── */

const byNewest = <T extends { created_at: string }>(rows: T[]) => [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at))

async function unwrap<T>(p: PromiseLike<{ data: T | null; error: { message: string } | null }>): Promise<T> {
  const { data, error } = await p
  if (error) throw new Error(error.message)
  return data as T
}

export const db = {
  /* ── public ── */

  async createBooking(row: Omit<NewRow<Booking>, 'status' | 'source' | 'notes'>) {
    const full = { ...row, status: 'pending' as const, source: 'website', notes: null }
    if (sb) return void (await unwrap(sb.from('bookings').insert(full)))
    const d = load(); d.bookings.push({ ...full, id: uid(), created_at: new Date().toISOString() }); save(d)
  },

  async createMessage(row: Omit<NewRow<Message>, 'read'>) {
    if (sb) return void (await unwrap(sb.from('messages').insert({ ...row, read: false })))
    const d = load(); d.messages.push({ ...row, read: false, id: uid(), created_at: new Date().toISOString() }); save(d)
  },

  async publishedReviews(): Promise<Review[]> {
    if (sb) return unwrap(sb.from('reviews').select('*').eq('published', true).order('created_at', { ascending: false }))
    return byNewest(load().reviews.filter(r => r.published))
  },

  async bookedRanges(): Promise<BookedRange[]> {
    if (sb) return unwrap(sb.rpc('booked_ranges'))
    const today = isoDate(new Date())
    return load().bookings
      .filter(b => (b.status === 'confirmed' || b.status === 'blocked') && b.checkout >= today)
      .map(({ villa, checkin, checkout }) => ({ villa, checkin, checkout }))
  },

  /* ── auth ── */

  async signIn(email: string, password: string) {
    if (sb) {
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
      const ok = await unwrap<boolean>(sb.rpc('is_admin'))
      if (!ok) { await sb.auth.signOut(); throw new Error('This account is not an admin.') }
      return
    }
    try { sessionStorage.setItem(DEMO_AUTH, '1') } catch { /* ignore */ }
  },

  async signOut() {
    if (sb) await sb.auth.signOut()
    try { sessionStorage.removeItem(DEMO_AUTH) } catch { /* ignore */ }
  },

  async isSignedIn(): Promise<boolean> {
    if (sb) {
      const { data } = await sb.auth.getSession()
      if (!data.session) return false
      try { return await unwrap<boolean>(sb.rpc('is_admin')) } catch { return false }
    }
    try { return sessionStorage.getItem(DEMO_AUTH) === '1' } catch { return false }
  },

  /* ── admin CRUD ── */

  async list<K extends TableName>(table: K): Promise<Tables[K][]> {
    if (sb) return unwrap(sb.from(table).select('*').order('created_at', { ascending: false }))
    return byNewest(load()[table] as Tables[K][])
  },

  async insert<K extends TableName>(table: K, row: NewRow<Tables[K]>) {
    if (sb) return void (await unwrap(sb.from(table).insert(row as never)))
    const d = load()
    ;(d[table] as Tables[K][]).push({ ...row, id: uid(), created_at: new Date().toISOString() } as Tables[K])
    save(d)
  },

  async update<K extends TableName>(table: K, id: string, patch: Partial<Tables[K]>) {
    if (sb) return void (await unwrap(sb.from(table).update(patch as never).eq('id', id)))
    const d = load()
    d[table] = (d[table] as Tables[K][]).map(r => (r.id === id ? { ...r, ...patch } : r)) as DemoDb[K]
    save(d)
  },

  async remove(table: TableName, id: string) {
    if (sb) return void (await unwrap(sb.from(table).delete().eq('id', id)))
    const d = load()
    d[table] = (d[table] as { id: string }[]).filter(r => r.id !== id) as never
    save(d)
  },
}
