import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import Seo from '@/components/Seo'

export default function NotFound() {
  const { tr } = useApp()
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <Seo title="404" />
      <img src="/photo10.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-ocean-900/80" />
      <div className="relative z-10 text-center text-white px-5 pt-20">
        <p className="font-heading text-8xl sm:text-9xl font-bold text-gold/90 mb-4">404</p>
        <h1 className="font-heading text-3xl sm:text-4xl mb-3">{tr.x.notfound_title}</h1>
        <p className="font-body text-white/70 max-w-md mx-auto mb-8">{tr.x.notfound_sub}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="bg-gold hover:bg-gold-600 text-white font-body text-sm font-medium px-7 py-3.5 rounded-full transition-colors">{tr.x.back_home}</Link>
          <Link to="/villas" className="border border-white/30 hover:border-white/70 text-white font-body text-sm px-7 py-3.5 rounded-full transition-colors">{tr.nav.villas}</Link>
        </div>
      </div>
    </div>
  )
}
