import { useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: { src: string; alt: string }[]
  index: number | null
  onChange: (i: number | null) => void
}

export default function Lightbox({ images, index, onChange }: Props) {
  const touchX = useRef<number | null>(null)
  const n = images.length
  const close = useCallback(() => onChange(null), [onChange])
  const prev = useCallback(() => index != null && onChange((index - 1 + n) % n), [index, n, onChange])
  const next = useCallback(() => index != null && onChange((index + 1) % n), [index, n, onChange])

  useEffect(() => {
    if (index == null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [index, close, prev, next])

  // Preload neighbours for instant navigation
  useEffect(() => {
    if (index == null) return
    ;[images[(index + 1) % n], images[(index - 1 + n) % n]].forEach(img => { new Image().src = img.src })
  }, [index, images, n])

  const btn = 'absolute z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors'

  return (
    <AnimatePresence>
      {index != null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={close}
          onTouchStart={e => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            if (touchX.current == null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(dx) > 50) (dx > 0 ? prev() : next())
            touchX.current = null
          }}
        >
          <button className={`${btn} top-4 right-4 w-10 h-10`} onClick={close} aria-label="Close">
            <X size={18} />
          </button>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 font-body text-xs text-white/50">
            {index + 1} / {n}
          </div>
          <button className={`${btn} left-3 sm:left-5 hidden sm:flex`} onClick={e => { e.stopPropagation(); prev() }} aria-label="Previous">
            <ChevronLeft size={22} />
          </button>
          <motion.img
            key={index}
            src={images[index].src}
            alt={images[index].alt}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22 }}
            className="max-w-[94vw] max-h-[80vh] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button className={`${btn} right-3 sm:right-5 hidden sm:flex`} onClick={e => { e.stopPropagation(); next() }} aria-label="Next">
            <ChevronRight size={22} />
          </button>
          {/* Thumbnails */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 px-4 overflow-x-auto" onClick={e => e.stopPropagation()}>
            {images.map((img, i) => (
              <button
                key={img.src}
                onClick={() => onChange(i)}
                className={`shrink-0 w-12 h-9 sm:w-14 sm:h-10 rounded-md overflow-hidden cursor-pointer transition-all ${i === index ? 'ring-2 ring-gold opacity-100' : 'opacity-40 hover:opacity-80'}`}
                aria-label={`Photo ${i + 1}`}
              >
                <img src={img.src} alt="" loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
