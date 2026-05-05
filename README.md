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

## Deployment — GitHub Pages (branch deploy)

This repo deploys to GitHub Pages by serving the `main` branch directly. No build step runs on the server — the pre-built `styles.css` is committed to the repo, so what you push is what gets served.

### One-time setup (do this once after the first push)

1. Go to **Settings → Pages** in this repo
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. **Branch:** `main`, **Folder:** `/ (root)` → **Save**
4. Wait ~30 seconds, then site goes live at `https://amgatnight.github.io/Website-updated/`

### Editing workflow

If you change HTML files via the github.com web editor, the changes go live within ~30 seconds. **Caveat:** if you add a Tailwind class that's not already in `styles.css`, it won\'t render until you rebuild. To rebuild:

```sh
git pull              # get latest
npm install           # one-time
npm run build         # rewrites styles.css with all classes used in current HTML
git add styles.css
git commit -m "Rebuild styles"
git push
```

If you want fully automatic builds on every push, see the "Re-enabling GitHub Actions" section below.

### Custom domain (montrealhospitality.com)

1. **In this repo:** Settings → Pages → **Custom domain** → enter `montrealhospitality.com` → Save. GitHub will create a `CNAME` file in the repo automatically.
2. **At your DNS registrar** (where you bought the domain), add four `A` records pointing the apex to GitHub Pages:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
   And a `CNAME` record for the `www` subdomain pointing to `amgatnight.github.io`.
3. Wait 5–60 minutes for DNS propagation. GitHub will issue a free Let's Encrypt SSL cert automatically (check **Enforce HTTPS** in the Pages settings once it's available).

### Local development

```sh
npm install        # one-time
npm run watch      # rebuilds styles.css whenever you edit input.css or HTML
# or
npm run build      # single build
```

Then open any `.html` file directly in your browser.

### URL redirects

The original v5 site had pages at older URLs (e.g., `Bordelle.html` capital-B, `private jet.html` with a space, `40-cruiser.html` without yacht prefix). For SEO continuity, those URLs are kept as small HTML files that `meta refresh` + JS-redirect to the new canonical path. They're noindexed so search engines won't double-list them, but existing inbound links keep working.

The Cloudflare-style `_redirects` file is also preserved in the repo as documentation / for any future migration.

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


## Re-enabling GitHub Actions (when billing is resolved)

This repo originally shipped with a `.github/workflows/deploy.yml` file that ran `npm run build` on every push and deployed automatically. It was removed because the GitHub account had a billing block preventing Actions runners from starting.

To re-enable automatic builds:

1. Resolve any billing issue at https://github.com/settings/billing
2. Restore the workflow file (it\'s in git history at the second commit) or paste this into `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
     workflow_dispatch:
   permissions:
     contents: read
     pages: write
     id-token: write
   concurrency:
     group: "pages"
     cancel-in-progress: false
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: \'20\'
             cache: \'npm\'
         - run: npm ci
         - run: npm run build
         - uses: actions/configure-pages@v5
         - uses: actions/upload-pages-artifact@v3
           with:
             path: \'.\'
     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

3. In **Settings → Pages**, switch Source from "Deploy from a branch" back to "GitHub Actions".
