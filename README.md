# DreamCatcher Homes — Website

Luxury beachfront villa rental website for DreamCatcher Homes, Mirleft, Morocco.
Built with React 18, TypeScript, Vite, Tailwind CSS v4 and Motion.

## Features

- **Hero availability search** — dates, guests and villa, carried straight into the booking form
- **Booking flow** — date pickers with validation, night count, adult/child steppers, villa picker, live stay summary; the request is sent via WhatsApp (with an email fallback)
- **Villa pages** with full-screen photo lightbox (keyboard + swipe), deep links (`/villas#deluxe`) and "Book this villa" pre-selection
- **Gallery** of 42 photos with lightbox and thumbnails
- **FAQ**, guest reviews, dining, amenities and location pages
- **English / French** and **light / dark** mode (remembered per visitor)
- Sticky mobile booking bar and floating WhatsApp button
- **SEO**: per-page titles, Open Graph tags, `LodgingBusiness` structured data, `robots.txt`, `sitemap.xml`
- Privacy Policy, Terms and a 404 page; route-level code splitting

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the build
```

## Configuration

Contact details (WhatsApp number, email, address, coordinates) and villa photo sets live in
`src/lib/site.ts`. All copy is in `src/i18n/translations.ts` (EN + FR).
Photos live in `images/`, which Vite serves as the public directory (`/photo01.jpg`, `/logo.png`, …).

## Deployment

The site is a single-page app, so every route must fall back to `index.html`:

- **Netlify** — handled by `images/_redirects` (copied into `dist/`). Build command `npm run build`, publish dir `dist`.
- **Vercel** — handled by `vercel.json`.

Update the domain in `index.html`, `images/sitemap.xml` and `images/robots.txt` if it changes.
