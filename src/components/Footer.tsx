import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'
import { useApp } from '@/context/AppContext'

export default function Footer() {
  const { tr, dark } = useApp()
  const year = new Date().getFullYear()

  const navLinks = [
    ['/villas', tr.nav.villas],
    ['/dining', tr.nav.dining],
    ['/amenities', tr.nav.amenities],
    ['/gallery', tr.nav.gallery],
    ['/location', tr.nav.location],
    ['/contact', tr.nav.contact],
    ['/booking', tr.nav.book],
  ] as [string, string][]

  return (
    <footer className={dark ? 'bg-ocean-900 border-t border-white/5' : 'bg-ocean-500'}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 cursor-pointer">
              <img src="/logo.png" alt="DreamCatcher Homes" className="h-11 w-auto object-contain brightness-0 invert" />
              <div>
                <p className="font-heading text-base font-semibold text-white leading-tight">DreamCatcher Homes</p>
                <p className="font-body text-[10px] text-white/50 tracking-widest uppercase mt-0.5">Mirleft · Morocco</p>
              </div>
            </Link>
            <p className="font-body text-sm text-white/60 leading-relaxed mb-6">{tr.footer.tagline}</p>
            <div className="flex items-center gap-4">
              {([
                ['https://instagram.com', Instagram, 'Instagram'],
                ['https://facebook.com', Facebook, 'Facebook'],
              ] as [string, typeof Instagram, string][]).map(([href, Icon, label]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer">
                  <Icon size={17} />
                </a>
              ))}
              <a href="https://wa.me/212671779770" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="text-white/40 hover:text-white transition-colors cursor-pointer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.114 1.528 5.836L0 24l6.335-1.51A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 01-5.031-1.387l-.361-.214-3.762.897.939-3.65-.235-.374A9.808 9.808 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-widest text-white/40 mb-5">{tr.footer.links}</h4>
            <ul className="space-y-2.5">
              {navLinks.map(([path, label]) => (
                <li key={path}>
                  <Link to={path} className="font-body text-sm text-white/60 hover:text-white transition-colors cursor-pointer">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-widest text-white/40 mb-5">{tr.footer.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/60 font-body">
                <MapPin size={13} className="mt-0.5 shrink-0 text-gold" />
                <span>Route d'Aglou, 85000<br />Mirleft, Tamelalt, Morocco</span>
              </li>
              <li>
                <a href="tel:+212671779770" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors font-body cursor-pointer">
                  <Phone size={13} className="text-gold shrink-0" />
                  +212 671-779770
                </a>
              </li>
              <li>
                <a href="mailto:contact@dreamcatcherhomes.com" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors font-body cursor-pointer">
                  <Mail size={13} className="text-gold shrink-0" />
                  contact@dreamcatcherhomes.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal + booking CTA */}
          <div>
            <h4 className="font-body text-xs uppercase tracking-widest text-white/40 mb-5">{tr.footer.legal}</h4>
            <ul className="space-y-2.5 mb-6">
              <li><a href="#" className="font-body text-sm text-white/60 hover:text-white transition-colors cursor-pointer">{tr.footer.privacy}</a></li>
              <li><a href="#" className="font-body text-sm text-white/60 hover:text-white transition-colors cursor-pointer">{tr.footer.terms}</a></li>
            </ul>
            <Link
              to="/booking"
              className="inline-flex items-center bg-gold hover:bg-gold-600 text-white font-body text-sm font-medium px-5 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              {tr.nav.book}
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 font-body text-xs">
          <p>© {year} DreamCatcher Homes. {tr.footer.rights}</p>
          <p>GPS: 29.70517, -9.94919 · Club Evasion Resort</p>
        </div>
      </div>
    </footer>
  )
}
