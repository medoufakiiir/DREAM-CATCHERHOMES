// Post-build step: writes one HTML file per public route with the right
// <title>, description, canonical, Open Graph tags and crawlable content,
// then regenerates sitemap.xml. The React app takes over on load.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const SITE = 'https://dream-catcherhomes.com'
const dist = new URL('../dist/', import.meta.url)
const template = readFileSync(new URL('index.html', dist), 'utf8')
const posts = JSON.parse(readFileSync(new URL('../src/content/posts.json', import.meta.url), 'utf8'))
  .sort((a, b) => b.date.localeCompare(a.date))
const today = new Date().toISOString().slice(0, 10)

// Untouched app shell for SPA fallbacks (/admin, unknown URLs)
writeFileSync(new URL('spa.html', dist), template)

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const inline = s => esc(s)
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

const nav = `<nav><a href="/">Home</a> · <a href="/villas">Villas</a> · <a href="/dining">Dining</a> · <a href="/amenities">Amenities</a> · <a href="/gallery">Gallery</a> · <a href="/location">Location</a> · <a href="/journal">Journal</a> · <a href="/contact">Contact</a> · <a href="/booking">Book</a></nav>`

const pages = [
  { path: '/', title: 'DreamCatcher Homes — Luxury Beachfront Villas in Mirleft, Morocco', description: 'Two private villas with pools and ocean views, 50 m from Tamelalt Beach in Mirleft, Morocco. Rated 9.3 Superb. Free cancellation, no prepayment.', image: '/photo10.jpg', priority: '1.0' },
  { path: '/villas', title: 'Our Villas · DreamCatcher Homes Mirleft', description: 'Two-Bedroom and Deluxe villas, each 120 m² with a private pool, full kitchen, terraces and sea views — 50 m from Tamelalt Beach, Mirleft.', image: '/photo02.jpg', priority: '0.9' },
  { path: '/booking', title: 'Book Your Stay · DreamCatcher Homes Mirleft', description: 'Check availability and request your villa in Mirleft, Morocco. Free cancellation, no prepayment, pay at the property.', image: '/photo30.jpg', priority: '0.9' },
  { path: '/dining', title: 'Dining · DreamCatcher Homes Mirleft', description: 'Ocean Dunes House and Dunes Beach Bar — Moroccan, Mediterranean and international cuisine steps from the Atlantic in Mirleft.', image: '/photo11.jpg', priority: '0.7' },
  { path: '/amenities', title: 'Amenities · DreamCatcher Homes Mirleft', description: 'Private pools, rooftop conservatory, tennis court, gardens, free WiFi and parking, airport transfers — everything for a relaxed stay in Mirleft.', image: '/photo14.jpg', priority: '0.7' },
  { path: '/gallery', title: 'Photo Gallery · DreamCatcher Homes Mirleft', description: '42 photos of our villas, pools, terraces and the beaches of Mirleft, Morocco.', image: '/photo17.jpg', priority: '0.6' },
  { path: '/location', title: 'Location & Getting Here · DreamCatcher Homes Mirleft', description: 'Find us at Route d’Aglou, Tamelalt, Mirleft — 50 m from the beach and about two hours from Agadir airport. Map, distances and directions.', image: '/photo01.jpg', priority: '0.7' },
  { path: '/contact', title: 'Contact · DreamCatcher Homes Mirleft', description: 'Questions about your stay in Mirleft? Message us on WhatsApp or email — we usually reply within the hour.', image: '/photo26.jpg', priority: '0.6' },
  { path: '/journal', title: 'Journal — Mirleft Travel Guides · DreamCatcher Homes', description: 'Local guides to Mirleft and Morocco’s southern Atlantic coast: things to do, surfing, getting here and the best time to visit.', image: '/photo26.jpg', priority: '0.8',
    body: posts.map(p => `<article><h2><a href="/journal/${p.slug}">${esc(p.title)}</a></h2><p>${esc(p.description)}</p></article>`).join('') },
  { path: '/privacy', title: 'Privacy Policy · DreamCatcher Homes', description: 'How DreamCatcher Homes collects, uses and protects your personal data.', priority: '0.2' },
  { path: '/terms', title: 'Terms & Conditions · DreamCatcher Homes', description: 'Booking terms and house rules for DreamCatcher Homes, Mirleft, Morocco.', priority: '0.2' },
  ...posts.map(p => ({
    path: `/journal/${p.slug}`, title: `${p.title} · DreamCatcher Homes`, description: p.description, image: p.cover, type: 'article', priority: '0.8', lastmod: p.date,
    body: `<article><h1>${esc(p.title)}</h1><time datetime="${p.date}">${p.date}</time>` + p.body.map(b =>
      b.h2 ? `<h2>${esc(b.h2)}</h2>` : b.ul ? `<ul>${b.ul.map(li => `<li>${inline(li)}</li>`).join('')}</ul>` : `<p>${inline(b.p)}</p>`).join('') + '</article>',
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description,
      image: SITE + p.cover, datePublished: p.date, dateModified: p.date,
      author: { '@type': 'Organization', name: 'DreamCatcher Homes' },
      publisher: { '@type': 'Organization', name: 'DreamCatcher Homes', logo: { '@type': 'ImageObject', url: SITE + '/logo.png' } },
      mainEntityOfPage: `${SITE}/journal/${p.slug}`,
    },
  })),
]

const setMeta = (html, attr, key, value) =>
  html.replace(new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/>`), `<meta ${attr}="${key}" content="${esc(value)}" />`)

for (const pg of pages) {
  const url = SITE + (pg.path === '/' ? '/' : pg.path)
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(pg.title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url}" />`)
  html = setMeta(html, 'name', 'description', pg.description)
  html = setMeta(html, 'property', 'og:title', pg.title)
  html = setMeta(html, 'property', 'og:description', pg.description)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'property', 'og:type', pg.type ?? 'website')
  if (pg.image) html = setMeta(html, 'property', 'og:image', SITE + pg.image)
  if (pg.jsonLd) html = html.replace('</head>', `<script type="application/ld+json" data-page="true">${JSON.stringify(pg.jsonLd)}</script>\n  </head>`)
  const content = pg.body ?? `<h1>${esc(pg.title.split(' · ')[0])}</h1><p>${esc(pg.description)}</p>`
  html = html.replace('<div id="root"></div>', `<div id="root"><div style="max-width:720px;margin:0 auto;padding:120px 20px;font-family:Georgia,serif;color:#221f1b;background:#f6f1e8;line-height:1.7">${nav}${content}</div></div>`)

  const file = pg.path === '/' ? 'index.html' : `${pg.path.slice(1)}.html`
  const target = new URL(file, dist)
  mkdirSync(dirname(target.pathname), { recursive: true })
  writeFileSync(target, html)
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${SITE}${p.path === '/' ? '/' : p.path}</loc><lastmod>${p.lastmod ?? today}</lastmod><priority>${p.priority}</priority></url>`).join('\n')}
</urlset>
`
writeFileSync(new URL('sitemap.xml', dist), sitemap)
console.log(`prerendered ${pages.length} routes + sitemap.xml`)
