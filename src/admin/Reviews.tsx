import { useState } from 'react'
import { Eye, EyeOff, Trash2, Plus } from 'lucide-react'
import { useAdmin, Card, PageTitle, Empty, Modal, timeAgo, btn, field, labelCls } from './shared'
import { db } from '@/lib/db'
import { cn } from '@/lib/utils'

export default function Reviews() {
  const { reviews, run } = useAdmin()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', country: '', rating: 10, text: '' })
  const published = reviews.filter(r => r.published)
  const avg = published.length ? (published.reduce((s, r) => s + r.rating, 0) / published.length).toFixed(1) : '—'

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    await run(() => db.insert('reviews', { ...form, published: true }))
    setForm({ name: '', country: '', rating: 10, text: '' })
    setAdding(false)
  }

  return (
    <>
      <PageTitle
        title="Reviews"
        sub={`${published.length} shown on the website · average ${avg}/10`}
        action={<button className={btn.primary} onClick={() => setAdding(true)}><Plus size={15} /> Add review</button>}
      />
      <p className="text-sm text-ocean-400 -mt-3 mb-6 max-w-2xl">
        Published reviews appear in the home page carousel. Copy your best reviews from Booking.com, Airbnb or Google here, and hide any you don't want shown.
      </p>

      {reviews.length === 0 ? <Card><Empty>No reviews yet.</Empty></Card> : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reviews.map(r => (
            <Card key={r.id} className={cn('p-5 flex flex-col', !r.published && 'opacity-60')}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-xs text-ocean-300">{r.country} · {timeAgo(r.created_at)}</p>
                </div>
                <span className="font-heading text-2xl text-gold leading-none">{r.rating}<span className="text-sm text-ocean-300">/10</span></span>
              </div>
              <p className="text-sm text-ocean-400 leading-relaxed flex-1">“{r.text}”</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-ocean-500/10">
                <button
                  onClick={() => run(() => db.update('reviews', r.id, { published: !r.published }))}
                  className={cn('inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer', r.published ? 'text-emerald-700' : 'text-ocean-300')}
                >
                  {r.published ? <><Eye size={14} /> Published</> : <><EyeOff size={14} /> Hidden</>}
                </button>
                <button onClick={() => confirm('Delete this review?') && run(() => db.remove('reviews', r.id))} className="text-ocean-300 hover:text-red-600 cursor-pointer" aria-label="Delete review">
                  <Trash2 size={15} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {adding && (
        <Modal title="Add review" onClose={() => setAdding(false)}>
          <form onSubmit={add} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Guest name</label><input className={field} required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><label className={labelCls}>Country</label><input className={field} placeholder="United Kingdom 🇬🇧" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} /></div>
            </div>
            <div><label className={labelCls}>Rating (1–10)</label><input type="number" min={1} max={10} className={field} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: +e.target.value }))} /></div>
            <div><label className={labelCls}>Review</label><textarea rows={5} required className={cn(field, 'resize-none')} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} /></div>
            <div className="flex justify-end gap-2"><button type="button" className={btn.ghost} onClick={() => setAdding(false)}>Cancel</button><button className={btn.primary}>Publish review</button></div>
          </form>
        </Modal>
      )}
    </>
  )
}
