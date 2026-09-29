import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Mail, MessageCircle, Trash2, MailOpen, ArrowLeft } from 'lucide-react'
import { useAdmin, Card, PageTitle, Empty, timeAgo, fmt, waGuest, btn } from './shared'
import { db } from '@/lib/db'
import { cn } from '@/lib/utils'

export default function Messages() {
  const { messages, run } = useAdmin()
  const [params, setParams] = useSearchParams()
  const id = params.get('id')
  const current = messages.find(m => m.id === id) ?? null

  // Mark as read when opened
  useEffect(() => {
    if (current && !current.read) run(() => db.update('messages', current.id, { read: true }))
  }, [current, run])

  const open = (mid: string | null) => setParams(mid ? { id: mid } : {})

  return (
    <>
      <PageTitle title="Messages" sub={`${messages.filter(m => !m.read).length} unread · from the contact form`} />
      <Card className="grid md:grid-cols-[340px_1fr] min-h-[560px] overflow-hidden">
        <ul className={cn('divide-y divide-ocean-500/10 border-r border-ocean-500/10 overflow-y-auto max-h-[70vh]', current && 'hidden md:block')}>
          {messages.length === 0 && <Empty>No messages yet.</Empty>}
          {messages.map(m => (
            <li key={m.id}>
              <button onClick={() => open(m.id)} className={cn('w-full text-left px-5 py-4 flex gap-3 cursor-pointer', m.id === id ? 'bg-sand-50' : 'hover:bg-sand-50/60')}>
                <span className={cn('w-2 h-2 rounded-full shrink-0 mt-1.5', m.read ? 'bg-transparent' : 'bg-gold')} />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className={cn('text-sm truncate', !m.read && 'font-semibold')}>{m.name}</p>
                    <span className="text-[11px] text-ocean-300 shrink-0">{timeAgo(m.created_at)}</span>
                  </div>
                  {m.subject && <p className="text-xs text-ocean-500 truncate">{m.subject}</p>}
                  <p className="text-xs text-ocean-300 truncate">{m.message}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <div className={cn('p-6 sm:p-8', !current && 'hidden md:flex items-center justify-center')}>
          {!current ? <p className="text-sm text-ocean-300">Select a message</p> : (
            <article>
              <button onClick={() => open(null)} className="md:hidden inline-flex items-center gap-1 text-sm text-ocean-400 mb-5"><ArrowLeft size={14} /> Inbox</button>
              <p className="text-xs text-ocean-300">{fmt(current.created_at, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <h2 className="font-heading text-3xl mt-1">{current.subject || 'Enquiry'}</h2>
              <p className="text-sm mt-3"><b>{current.name}</b> · <a className="text-gold hover:underline" href={`mailto:${current.email}`}>{current.email}</a>{current.phone && <> · {current.phone}</>}</p>
              <p className="mt-6 text-[15px] leading-relaxed whitespace-pre-wrap text-ocean-500">{current.message}</p>
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-ocean-500/10">
                <a className={btn.primary} href={`mailto:${current.email}?subject=${encodeURIComponent('Re: ' + (current.subject || 'Your enquiry – DreamCatcher Homes'))}`}>
                  <Mail size={15} /> Reply by email
                </a>
                {current.phone && (
                  <a className={btn.ghost} href={waGuest(current.phone, `Hello ${current.name.split(' ')[0]}, thank you for your message to DreamCatcher Homes. `)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                )}
                <button className={btn.ghost} onClick={() => run(() => db.update('messages', current.id, { read: false })).then(() => open(null))}>
                  <MailOpen size={15} /> Mark unread
                </button>
                <button className={cn(btn.ghost, 'text-red-600')} onClick={() => confirm('Delete this message?') && run(() => db.remove('messages', current.id)).then(() => open(null))}>
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </article>
          )}
        </div>
      </Card>
    </>
  )
}
