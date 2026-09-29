export const SITE = {
  name: 'DreamCatcher Homes',
  url: 'https://dream-catcherhomes.com',
  whatsapp: '212671779770',
  phoneDisplay: '+212 671-779770',
  email: 'contact@dreamcatcherhomes.com',
  address: "Route d'Aglou, 85000 Mirleft, Tamelalt, Morocco",
  geo: { lat: 29.70517, lng: -9.94919 },
}

export const waLink = (text?: string) =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const photo = (n: number) => `/photo${String(n).padStart(2, '0')}.jpg`
export const photos = Array.from({ length: 42 }, (_, i) => photo(i + 1))

export type VillaId = 'two-bedroom' | 'deluxe'

export const VILLAS: { id: VillaId; maxGuests: number; photos: string[] }[] = [
  { id: 'two-bedroom', maxGuests: 4, photos: [2, 6, 10, 3, 11, 15, 22, 27].map(photo) },
  { id: 'deluxe', maxGuests: 4, photos: [8, 13, 18, 12, 19, 24, 29, 34].map(photo) },
]

/** yyyy-mm-dd in local time */
export const isoDate = (d: Date) => {
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

export const addDays = (iso: string, n: number) => {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return isoDate(d)
}

export const nightsBetween = (a: string, b: string) => {
  if (!a || !b) return 0
  const diff = (new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()) / 86400000
  return diff > 0 ? Math.round(diff) : 0
}
