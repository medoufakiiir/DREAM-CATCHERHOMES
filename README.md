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

## Admin panel

`/admin` — overview, calendar, bookings, messages and reviews.

Without a database the admin runs in **demo mode** (sample data, stored only in your browser,
any login works). To go live with real data:

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query**, paste [`supabase/schema.sql`](supabase/schema.sql) and run it.
3. **Authentication → Users → Add user** with your email and a strong password.
4. In the SQL Editor run: `insert into public.admins (email) values ('your@email.com');`
5. **Authentication → Sign In / Providers**: turn off "Allow new users to sign up".
6. **Settings → API**: copy the Project URL and the `anon` public key into Vercel
   (**Project → Settings → Environment Variables**) as `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY`, then redeploy. For local dev put them in `.env.local` (see `.env.example`).

From then on, every booking request and contact message is saved (as well as sent to WhatsApp),
confirmed and blocked dates are shown as unavailable on the booking page, and the reviews you
publish appear on the home page. Security is enforced in the database (row-level security):
visitors can only submit requests; only emails in `admins` can read or change anything.

## Journal (blog)

Articles live in `src/content/posts.json` — copy an entry, change the `slug`, `title`,
`description`, `date`, `cover` and `body` blocks (`{ "h2": … }`, `{ "p": … }`, `{ "ul": [...] }`;
paragraphs support `**bold**` and `[links](/booking)`). The build adds them to the sitemap automatically.

## SEO

- `npm run build` runs `scripts/prerender.mjs`, which writes a real HTML file per page with its own
  title, description, canonical URL, Open Graph tags, crawlable content and `BlogPosting` data,
  and regenerates `sitemap.xml`.
- After launch: add the site to **Google Search Console** and submit `/sitemap.xml`.

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
