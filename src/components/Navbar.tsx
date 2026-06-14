import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, Sun, Moon, Globe } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

const links = [
  { key: 'home' as const, path: '/' },
  { key: 'villas' as const, path: '/villas' },
  { key: 'dining' as const, path: '/dining' },
  { key: 'amenities' as const, path: '/amenities' },
  { key: 'gallery' as const, path: '/gallery' },
  { key: 'location' as const, path: '/location' },
  { key: 'contact' as const, path: '/contact' },
]

export default function Navbar() {
  const { tr, dark, toggleDark, lang, setLang } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const transparent = isHome && !scrolled

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          transparent
            ? 'bg-transparent'
            : dark
            ? 'bg-ocean-900/95 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-white/95 backdrop-blur-md border-b border-sand-100 shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 cursor-pointer">
            <img
              src="/logo.png"
              alt="DreamCatcher Homes"
              className={cn('h-11 w-auto object-contain transition-all duration-300', transparent && 'brightness-0 invert')}
            />
            <div className="hidden sm:block leading-tight">
              <p className={cn('font-heading text-base font-semibold tracking-tight', transparent ? 'text-white' : dark ? 'text-sand-100' : 'text-ocean-500')}>
                DreamCatcher Homes
              </p>
              <p className={cn('font-body text-[10px] tracking-widest uppercase', transparent ? 'text-white/60' : dark ? 'text-sand-300/60' : 'text-ocean-400/60')}>
                Mirleft · Morocco
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-7">
            {links.map(({ key, path }) => (
              <Link
                key={key}
                to={path}
                className={cn(
                  'font-body text-sm transition-all duration-200 relative pb-0.5 cursor-pointer',
                  transparent
                    ? 'text-white/80 hover:text-white'
                    : dark
                    ? 'text-sand-300 hover:text-sand-100'
                    : 'text-ocean-400 hover:text-ocean-500',
                  pathname === path && 'font-medium'
                )}
              >
                {tr.nav[key]}
                {pathname === path && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-px bg-gold"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className={cn(
                'hidden sm:flex items-center gap-1.5 font-body text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors duration-200 cursor-pointer',
                transparent
                  ? 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                  : dark
                  ? 'border-white/10 text-sand-300 hover:border-gold/50 hover:text-gold'
                  : 'border-sand-200 text-ocean-400 hover:border-gold hover:text-gold'
              )}
              aria-label="Switch language"
            >
              <Globe size={12} />
              {lang === 'en' ? 'FR' : 'EN'}
            </button>

            <button
              onClick={toggleDark}
              className={cn(
                'p-2 rounded-lg transition-colors duration-200 cursor-pointer',
                transparent
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : dark
                  ? 'text-sand-300 hover:text-gold hover:bg-white/5'
                  : 'text-ocean-400 hover:text-gold hover:bg-sand-50'
              )}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <Link
              to="/booking"
              className="hidden sm:inline-flex items-center bg-gold hover:bg-gold-600 text-white font-body text-sm font-medium px-5 py-2.5 rounded-full transition-colors duration-200 cursor-pointer shadow-md shadow-gold/20"
            >
              {tr.nav.book}
            </Link>

            <button
              onClick={() => setOpen(o => !o)}
              className={cn(
                'xl:hidden p-2 rounded-lg transition-colors cursor-pointer',
                transparent ? 'text-white' : dark ? 'text-sand-200' : 'text-ocean-500'
              )}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className={cn(
              'fixed inset-0 z-40 pt-24 px-8 pb-12 flex flex-col xl:hidden overflow-y-auto',
              dark ? 'bg-ocean-900' : 'bg-white'
            )}
          >
            <nav className="flex flex-col gap-5 mb-10">
              {links.map(({ key, path }) => (
                <Link
                  key={key}
                  to={path}
                  className={cn(
                    'font-heading text-2xl transition-colors cursor-pointer',
                    pathname === path ? 'text-gold' : dark ? 'text-sand-100' : 'text-ocean-500'
                  )}
                >
                  {tr.nav[key]}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 mt-auto">
              <Link
                to="/booking"
                className="w-full text-center bg-gold hover:bg-gold-600 text-white font-body font-medium py-3.5 rounded-full transition-colors cursor-pointer"
              >
                {tr.nav.book}
              </Link>
              <div className="flex items-center gap-3 mt-1">
                <button
                  onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
                  className={cn(
                    'flex items-center gap-1.5 font-body text-sm px-3 py-2 rounded-lg border cursor-pointer transition-colors',
                    dark ? 'border-white/10 text-sand-200' : 'border-sand-200 text-ocean-400'
                  )}
                >
                  <Globe size={14} />
                  {lang === 'en' ? 'Français' : 'English'}
                </button>
                <button
                  onClick={toggleDark}
                  className={cn('p-2 rounded-lg cursor-pointer', dark ? 'text-sand-200' : 'text-ocean-400')}
                  aria-label="Toggle theme"
                >
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
