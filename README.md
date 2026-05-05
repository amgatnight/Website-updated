# Montreal Hospitality — official website

A static site for Montreal Hospitality, deployed via Cloudflare Pages.

This is **v6**: the rebuilt + cleaned version of [MH-Official-Website-v5](https://github.com/amgatnight/MH-Official-Website-v5). The full audit of what changed and why lives in the project workspace under `audit/00-summary.md`.

## What's in here

```
.
├── *.html                  54 page files, served as-is at /<filename>
├── styles.css              Compiled Tailwind output (built from src/input.css)
├── src/
│   └── input.css           Tailwind source (@tailwind directives + base styles)
├── js/
│   └── site.js             Shared behaviors: lang attr sync, mobile menu helper
├── tailwind.config.js      Tailwind theme: mh-* color palette, custom fonts
├── package.json            npm + build script
├── _redirects              Cloudflare Pages 301s for renamed/removed pages
├── robots.txt              Crawler rules + sitemap location
├── sitemap.xml             54 page URLs for search engines
└── README.md               You are here
```

## Local development

```sh
# One-time
npm install

# Watch mode — rebuilds styles.css whenever you edit input.css or any HTML
npm run watch

# Or single build (what Cloudflare Pages runs)
npm run build
```

Then open any `.html` file directly in your browser (no dev server needed).

## Deployment — Cloudflare Pages

When you connect this repo to Cloudflare Pages, configure:

- **Build command:** `npm run build`
- **Build output directory:** `.` (the repo root)
- **Root directory:** *(leave blank)*
- **Node.js version:** 18 or 20

That's it. Pages will run `npm install && npm run build` on every push, then serve the static files.

## Where the assets live

| Asset | Source |
|-------|--------|
| Images & video | [Cloudinary](https://cloudinary.com) account `dg79ri9bl` — referenced by URL, no upload step |
| Fonts | Google Fonts (Cormorant Garamond + Montserrat) |
| Icons | Font Awesome 6.4.0 via cdnjs |
| Form submissions | [Formspree](https://formspree.io) endpoint `f/mykdvnra` (used by `contact.html` + `inquire.html`) |

## Analytics

Each page has a commented-out Google Analytics 4 snippet in its `<head>`. To turn it on:

1. Get your GA4 measurement ID (looks like `G-XXXXXXXXXX`) from the [GA Admin → Data Streams](https://analytics.google.com/) page.
2. Find/replace `G-XXXXXXXXXX` across all `.html` files with your real ID, and uncomment the block.

The cookie consent UI on `index.html` is already wired to call `gtag('consent', 'update', ...)` once a user accepts/declines, so consent flows correctly.

## Languages

The site supports English + French (Canadian). The language switcher persists choice via `localStorage` under the key `preferred_language` (values: `en` or `fr`). `js/site.js` keeps `<html lang>` in sync (`en` or `fr-CA`) so screen readers and Google index the correct language.

## Editing rules of thumb

- **Renaming a page?** Add a 301 line to `_redirects` so existing Google-indexed URLs don't break.
- **Adding a page?** Add an entry to `sitemap.xml` (or regenerate it). Don't forget the `<title>`, `<meta name="description">`, OG tags, and canonical link in the `<head>`.
- **Changing the brand colors?** Edit `tailwind.config.js` (the `mh-*` palette), then run `npm run build`.
- **Adding new images?** Upload to Cloudinary and reference by URL. No images live in this repo.

## Forms

Both `contact.html` and `inquire.html` POST to `https://formspree.io/f/mykdvnra`. Submissions land in the email inbox configured on the Formspree dashboard. Free tier: 50 submissions/month.
