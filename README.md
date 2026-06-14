# Dream Catcher Homes — Website

Premium landing page for villa rentals in Mirleft, Morocco.

---

## File Tree

```
dream-catcher-homes/
├── index.html          ← Main landing page (all sections)
├── privacy.html        ← Privacy Policy
├── terms.html          ← Terms & Conditions
├── 404.html            ← 404 Not Found page
├── config.js           ← ⭐ All configurable variables (edit this first)
├── css/
│   └── style.css       ← Full stylesheet (design tokens, layout, components)
├── js/
│   └── main.js         ← Interactions (nav, FAQ, form, reveal animations)
├── images/             ← Add your real images here
│   ├── hero.jpg        ← Hero background (recommend: 1920×1080+, landscape)
│   ├── terrace.jpg     ← Terrace / outdoor area
│   ├── dunes.jpg       ← Landscape / dunes scene
│   ├── pool.jpg        ← Pool photo
│   └── interior.jpg    ← Interior bedroom/living area
└── README.md
```

---

## Quick Start

### Option A — Open directly in browser
Just open `index.html` in any modern browser. No build step required.

### Option B — Local dev server (recommended)
Using Python:
```bash
cd dream-catcher-homes
python3 -m http.server 3000
# Open: http://localhost:3000
```

Using Node.js (npx):
```bash
cd dream-catcher-homes
npx serve .
# Open: http://localhost:3000
```

Using VS Code:
- Install the "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

---

## Configuration (Required Before Launch)

Edit **`config.js`** and update every value:

```js
const CONFIG = {
  bookingUrl:     "https://www.booking.com/hotel/ma/YOUR-PROPERTY-ID.html",
  whatsappNumber: "+212600000000",   // Your WhatsApp, international format
  contactEmail:   "contact@dream-catcherhomes.com",
  phoneNumber:    "+212 600 000 000",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=...", // From Google Maps > Share > Embed
  siteName:  "Dream Catcher Homes",
  siteUrl:   "https://dream-catcherhomes.com",
  address:   "Route d'Aglou, Mirleft 85100, Morocco",
};
```

To get your Google Maps embed URL:
1. Go to maps.google.com
2. Search "Route d'Aglou, Mirleft, Morocco"
3. Click Share → Embed a map → Copy HTML
4. Extract the `src="..."` URL from the iframe tag

---

## Adding Real Images

Replace the CSS gradient placeholders with your actual images:

1. Place your images in the `/images/` folder using the names:
   - `hero.jpg` (main hero background)
   - `terrace.jpg`
   - `dunes.jpg`
   - `pool.jpg`
   - `interior.jpg`

2. Recommended sizes:
   - Hero: 1920 × 1080px minimum
   - Gallery & cards: 800 × 600px minimum
   - Compress with [Squoosh](https://squoosh.app/) or [TinyJPG](https://tinyjpg.com/)

3. In `css/style.css`, the gallery items and cards reference these images as fallback after the gradient. Once images are present, update the `background-image` properties to lead with the image URL.

---

## Deployment

### Netlify (free, recommended)
1. Create a free account at [netlify.com](https://netlify.com)
2. Drag & drop the `dream-catcher-homes/` folder into the Netlify dashboard
3. Add your custom domain (`dream-catcherhomes.com`) in Site Settings → Domain Management
4. SSL is automatic (HTTPS)

### GitHub Pages
1. Push to a GitHub repository
2. Settings → Pages → Deploy from branch (main / root)
3. Add custom domain in Pages settings

### Vercel
```bash
npm i -g vercel
cd dream-catcher-homes
vercel --prod
```

---

## SEO Checklist (post-launch)

- [ ] Update `og:image` in `config.js` with your full hero image URL
- [ ] Replace Google Maps embed with real embed code
- [ ] Submit sitemap to Google Search Console
- [ ] Add Google Analytics or Plausible (optional)
- [ ] Replace placeholder reviews with real ones
- [ ] Fill in real villa sizes and bedroom counts if different

---

## Performance Notes

- No JavaScript frameworks — pure HTML/CSS/JS
- Google Fonts loaded via `<link>` (can be self-hosted for performance)
- Images lazy-loaded with native browser lazy loading
- Intersection Observer used for scroll animations (no library)
- Minify CSS/JS for production with any build tool or online minifier

---

## Browser Support

Chrome 90+, Firefox 90+, Safari 14+, Edge 90+, iOS Safari 14+, Chrome Android 90+

---

Built with ♥ for Dream Catcher Homes, Mirleft, Morocco.
