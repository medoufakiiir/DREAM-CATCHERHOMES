import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { CalendarDays } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

/** Sticky booking bar on small screens, shown after the user scrolls. */
export default function MobileBookBar() {
  const { tr, dark } = useApp()
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const fn = () => setShow(window.scrollY > 500)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  if (pathname === '/booking') return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'tween', duration: 0.25 }}
          className={cn(
            'md:hidden fixed bottom-0 inset-x-0 z-40 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-3 border-t backdrop-blur-md',
            dark ? 'bg-ocean-900/95 border-white/10' : 'bg-white/95 border-sand-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
          )}
        >
          <div className="flex-1 min-w-0">
            <p className={cn('font-heading text-sm font-semibold truncate', dark ? 'text-sand-100' : 'text-ocean-500')}>DreamCatcher Homes</p>
            <p className={cn('font-body text-[11px] truncate', dark ? 'text-sand-400' : 'text-ocean-300')}>{tr.x.mobile_sub}</p>
          </div>
          <Link
            to="/booking"
            className="shrink-0 inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-white font-body text-[11px] uppercase tracking-[0.18em] font-semibold px-5 py-3.5 transition-colors"
          >
            <CalendarDays size={15} /> {tr.x.mobile_book}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
