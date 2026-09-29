import { motion } from 'motion/react'
import { Waves, Wifi, Car, Utensils, TreePalm, Coffee, Tv, Bike, Plane, PawPrint, Accessibility, Users, Flame, Shield, Baby, CreditCard, Clock, MapPin, Mountain, Dumbbell, BedDouble, Bath, ChefHat, Wind } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import Seo from '@/components/Seo'
import PageHero from '@/components/PageHero'
import { cn } from '@/lib/utils'


function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const categories = [
  {
    key: 'water',
    icon: Waves,
    color: 'from-blue-400/20 to-cyan-400/20',
    items: [
      { icon: Waves, en: '2 outdoor swimming pools', fr: '2 piscines extérieures' },
      { icon: Waves, en: 'Private beach area', fr: 'Espace plage privé' },
      { icon: MapPin, en: '50m from Tamelalt Beach', fr: 'À 50m de la plage Tamelalt' },
      { icon: Mountain, en: '350m from Sand Dunes', fr: 'À 350m des dunes de sable' },
      { icon: Waves, en: 'Sea & dune panoramic views', fr: 'Vues panoramiques mer & dunes' },
    ],
  },
  {
    key: 'leisure',
    icon: Dumbbell,
    color: 'from-green-400/20 to-emerald-400/20',
    items: [
      { icon: Dumbbell, en: 'Tennis court', fr: 'Court de tennis' },
      { icon: TreePalm, en: 'Lush garden & terraces', fr: 'Jardin & terrasses' },
      { icon: TreePalm, en: 'Rooftop conservatory', fr: 'Véranda sur le toit' },
      { icon: Wind, en: 'Private balcony per villa', fr: 'Balcon privé par villa' },
      { icon: Flame, en: 'BBQ facilities', fr: 'Équipements barbecue' },
    ],
  },
  {
    key: 'dining',
    icon: ChefHat,
    color: 'from-orange-400/20 to-amber-400/20',
    items: [
      { icon: Utensils, en: 'Ocean Dunes House restaurant', fr: 'Restaurant Ocean Dunes House' },
      { icon: Utensils, en: 'Dunes Beach Bar', fr: 'Dunes Beach Bar' },
      { icon: Coffee, en: 'Breakfast from €6/person', fr: 'Petit-déjeuner à partir de 6€' },
      { icon: Flame, en: 'Bar on site', fr: 'Bar sur place' },
      { icon: ChefHat, en: 'Moroccan & international menus', fr: 'Menus marocains & internationaux' },
    ],
  },
  {
    key: 'comfort',
    icon: BedDouble,
    color: 'from-purple-400/20 to-violet-400/20',
    items: [
      { icon: BedDouble, en: '2 bedrooms + living room', fr: '2 chambres + salon' },
      { icon: Bath, en: 'Private bathroom', fr: 'Salle de bain privée' },
      { icon: ChefHat, en: 'Fully equipped kitchen', fr: 'Cuisine entièrement équipée' },
      { icon: Coffee, en: 'Coffee machine, kettle, toaster', fr: 'Machine à café, bouilloire, grille-pain' },
      { icon: Tv, en: 'Flat-screen TV & satellite', fr: 'TV à écran plat & satellite' },
      { icon: Wifi, en: 'Free WiFi throughout', fr: 'WiFi gratuit partout' },
    ],
  },
  {
    key: 'services',
    icon: Car,
    color: 'from-red-400/20 to-pink-400/20',
    items: [
      { icon: Car, en: 'Free private parking', fr: 'Parking privé gratuit' },
      { icon: Car, en: 'Car rental available', fr: 'Location de voiture disponible' },
      { icon: Bike, en: 'Bicycle rental', fr: 'Location de vélos' },
      { icon: Plane, en: 'Paid airport shuttle', fr: 'Navette aéroport (payante)' },
      { icon: Shield, en: '24h security & reception', fr: 'Sécurité & réception 24h/24' },
    ],
  },
  {
    key: 'policies',
    icon: CreditCard,
    color: 'from-gold/20 to-amber-400/20',
    items: [
      { icon: PawPrint, en: 'Pets allowed (charges may apply)', fr: 'Animaux acceptés (supplément éventuel)' },
      { icon: Accessibility, en: 'Disabled facilities', fr: 'Installations pour personnes handicapées' },
      { icon: Users, en: 'Family rooms, children welcome', fr: 'Chambres familiales, enfants bienvenus' },
      { icon: Baby, en: 'Free cots on request', fr: 'Berceaux gratuits sur demande' },
      { icon: Clock, en: 'Check-in 15:00 · Check-out 11:00', fr: 'Arrivée 15h · Départ 11h' },
      { icon: CreditCard, en: 'Cash · Visa · Mastercard', fr: 'Espèces · Visa · Mastercard' },
    ],
  },
]

export default function Amenities() {
  const { tr, dark, lang } = useApp()

  const categoryLabels: Record<string, string> = {
    water: lang === 'fr' ? 'Plage & Eau' : tr.amenities.water,
    leisure: lang === 'fr' ? 'Loisirs' : tr.amenities.leisure,
    dining: lang === 'fr' ? 'Restauration & Bar' : tr.amenities.dining,
    comfort: lang === 'fr' ? 'Confort des villas' : tr.amenities.comfort,
    services: lang === 'fr' ? 'Services' : tr.amenities.services,
    policies: lang === 'fr' ? 'Politique' : tr.amenities.policies,
  }

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-white'}>
      <Seo title={tr.amenities.page_title} description={tr.amenities.page_sub} />
      <PageHero image="/photo14.jpg" label={tr.amenities.page_label} title={tr.amenities.page_title} sub={tr.amenities.page_sub} />

      {/* Photo strip */}

      {/* Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-14">
            {categories.map((cat, ci) => {
              const HeadIcon = cat.icon
              return (
                <Reveal key={cat.key} delay={ci * 0.08}>
                  <div className={cn('h-full border-t pt-7', dark ? 'border-white/15' : 'border-ocean-500/20')}>
                    <div>
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="flex items-center justify-center">
                          <HeadIcon size={18} className="text-gold" />
                        </div>
                        <h2 className={`font-heading text-2xl ${dark ? 'text-sand-100' : 'text-ocean-500'}`}>
                          {categoryLabels[cat.key]}
                        </h2>
                      </div>
                      <ul className="space-y-2.5">
                        {cat.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2.5">
                            <div className="w-5 flex items-center justify-center shrink-0">
                              <item.icon size={11} className="text-gold" />
                            </div>
                            <span className={`font-body text-sm ${dark ? 'text-sand-200' : 'text-ocean-400'}`}>
                              {lang === 'fr' ? item.fr : item.en}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
