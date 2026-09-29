import { useState } from 'react'
import { motion } from 'motion/react'
import { ZoomIn } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import Lightbox from '@/components/ui/Lightbox'
import Seo from '@/components/Seo'
import PageHero from '@/components/PageHero'

const allPhotos = Array.from({ length: 42 }, (_, i) => ({
  src: `/photo${String(i + 1).padStart(2, '0')}.jpg`,
  alt: `DreamCatcher Homes — Mirleft Morocco — photo ${i + 1}`,
}))

export default function Gallery() {
  const { tr, dark } = useApp()
  const [lightbox, setLightbox] = useState<number | null>(null)

  // Variable heights for masonry feel
  const sizes = ['h-52', 'h-64', 'h-44', 'h-72', 'h-56', 'h-48', 'h-60', 'h-40', 'h-68', 'h-52']

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-white'}>
      <Seo title={tr.gallery.page_title} description={tr.gallery.page_sub} />
      <PageHero image="/photo17.jpg" label={tr.gallery.page_label} title={tr.gallery.page_title} sub={tr.gallery.page_sub} />

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

      <Lightbox images={allPhotos} index={lightbox} onChange={setLightbox} />
    </div>
  )
}
