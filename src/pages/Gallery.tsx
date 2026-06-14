import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { useApp } from '@/context/AppContext'

const allPhotos = Array.from({ length: 42 }, (_, i) => ({
  src: `/photo${String(i + 1).padStart(2, '0')}.jpg`,
  alt: `DreamCatcher Homes — Mirleft Morocco — photo ${i + 1}`,
}))

export default function Gallery() {
  const { tr, dark } = useApp()
  const [lightbox, setLightbox] = useState<number | null>(null)

  const close = () => setLightbox(null)
  const prev = useCallback(() => setLightbox(i => i != null ? (i - 1 + allPhotos.length) % allPhotos.length : 0), [])
  const next = useCallback(() => setLightbox(i => i != null ? (i + 1) % allPhotos.length : 0), [])

  useEffect(() => {
    if (lightbox == null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [lightbox, prev, next])

  // Variable heights for masonry feel
  const sizes = ['h-52', 'h-64', 'h-44', 'h-72', 'h-56', 'h-48', 'h-60', 'h-40', 'h-68', 'h-52']

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-white'}>
      {/* Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img src="/photo01.jpg" alt="Gallery" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/30 to-ocean-900/80" />
        <div className="absolute inset-0 flex items-end pb-12 justify-center text-center px-5">
          <div className="text-white">
            <p className="font-body text-xs uppercase tracking-widest text-gold mb-2">{tr.gallery.page_label}</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold">{tr.gallery.page_title}</h1>
            <p className="font-body text-sm mt-2 opacity-60">{tr.gallery.page_sub}</p>
          </div>
        </div>
      </div>

      {/* Masonry grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 sm:gap-3">
            {allPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.04 }}
                className="break-inside-avoid mb-2 sm:mb-3 group relative overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setLightbox(i)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${sizes[i % sizes.length]}`}
                />
                <div className="absolute inset-0 bg-ocean-900/0 group-hover:bg-ocean-900/25 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn size={26} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox != null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={close}
          >
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              onClick={close} aria-label={tr.gallery.close}
            >
              <X size={18} />
            </button>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 font-body text-xs text-white/50">
              {lightbox + 1} / {allPhotos.length}
            </div>
            <button
              className="absolute left-3 sm:left-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              onClick={e => { e.stopPropagation(); prev() }} aria-label={tr.gallery.prev}
            >
              <ChevronLeft size={22} />
            </button>
            <motion.img
              key={lightbox}
              src={allPhotos[lightbox].src}
              alt={allPhotos[lightbox].alt}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="max-w-[92vw] max-h-[86vh] object-contain rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <button
              className="absolute right-3 sm:right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              onClick={e => { e.stopPropagation(); next() }} aria-label={tr.gallery.next}
            >
              <ChevronRight size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
