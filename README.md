# Saswat Residency — Official Website

A complete, production-ready, responsive marketing website for **Saswat Residency**, a 1BHK &amp; 2BHK residential project in Chuna Belari, Paradeep Garh, Jagatsinghapur, Odisha.

Built as a fast, dependency-free **static site** — plain HTML, CSS and vanilla JavaScript. No build step, no framework, no server required. It works by simply opening/uploading the files, and deploys to Vercel or GitHub Pages in minutes.

---

## ✨ What's included

- **Home / Hero** — full-bleed building render, key project stats, CTA buttons
- **About** — welcome copy and "Exquisite Design" section, taken from the official brochure
- **Floor Plans** — tabbed views for Ground Floor, First Floor, 2nd–4th Floor, Terrace Plan and Roof Plan, each with a unit/carpet-area table and a click-to-zoom plan image
- **Gallery** — lightbox image gallery (click any image to view full-size, arrow-key/swipe-style navigation)
- **Amenities** — icon grid of project highlights
- **Location** — embedded map (OpenStreetMap, no API key required) + address details
- **Brochure download** — one-click PDF download built from the original brochure pages
- **FAQ** — accordion of common buyer questions
- **Contact form** — client-side validated enquiry form with spam honeypot, ready to connect to a form backend (Formspree, Getform, etc.) with an automatic "open email draft" fallback if no backend is configured yet
- **WhatsApp + call floating buttons**
- **SEO** — meta description/keywords, Open Graph & Twitter Card tags, canonical URL, `robots.txt`, `sitemap.xml`, JSON-LD structured data (`ApartmentComplex` schema)
- **Responsive design** — mobile, tablet and desktop layouts, mobile slide-in navigation
- **Accessibility** — skip link, semantic landmarks, `aria-*` attributes on interactive components, keyboard-operable lightbox and accordion
- **Performance** — no external JS frameworks, lazy-loaded images, `fetchpriority` on the hero image, cache headers configured for Vercel

---

## 📁 Project structure

```
saswat-residency/
├── index.html                 # Main single-page site (all sections)
├── 404.html                   # Custom "page not found" page
├── robots.txt                 # Search engine crawl rules
├── sitemap.xml                # XML sitemap
├── site.webmanifest           # PWA-style manifest (icons, theme color)
├── favicon.ico
├── vercel.json                # Vercel headers/config (caching, security headers)
├── package.json                # Optional local dev server script
├── css/
│   └── style.css              # All styling (CSS variables, responsive rules)
├── js/
│   └── main.js                 # Nav, lightbox, tabs, FAQ, form validation
├── images/                     # All optimized JPG/PNG assets (from the brochure)
│   ├── hero-cover.jpg
│   ├── welcome.jpg
│   ├── exterior-quote.jpg
│   ├── floor-ground.jpg
│   ├── floor-first.jpg
│   ├── floor-upper.jpg
│   ├── floor-terrace.jpg
│   ├── floor-roof.jpg
│   ├── gallery-1.jpg
│   ├── gallery-2.jpg
│   ├── og-image.jpg           # Social share preview image
│   ├── icon-192.png / icon-512.png / apple-touch-icon.png / favicon-32.png
└── assets/
    └── Saswat-Residency-Brochure.pdf   # Downloadable brochure (all brochure pages)
```

---

## 🖥️ Preview locally

No installation is strictly required — you can just double-click `index.html`. For the best results (so relative paths and the service-worker-friendly manifest behave exactly like production), serve it over local HTTP:

```bash
# Option 1: Node (no install needed, uses npx)
npx serve .

# Option 2: Python
python3 -m http.server 8000

# Option 3: via package.json script (requires Node.js)
npm run dev
```

Then open the printed local URL (e.g. `http://localhost:3000`).

---

## 🚀 Deploy to Vercel

**Option A — Vercel Dashboard (easiest, no CLI):**

1. Push this folder to a GitHub (or GitLab/Bitbucket) repository (see "Deploy to GitHub Pages" below for the git commands).
2. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
3. Framework preset: choose **"Other"** (this is a static site — no build command needed).
4. Leave **Build Command** empty and **Output Directory** as `.` (root).
5. Click **Deploy**. Vercel will give you a live `*.vercel.app` URL immediately.
6. Optional: add your custom domain under **Project → Settings → Domains**.

**Option B — Vercel CLI:**

```bash
npm install -g vercel
cd saswat-residency
vercel        # first deploy, follow the prompts
vercel --prod # promote to production
```

The included `vercel.json` already configures:
- Clean URLs (no `.html` needed)
- Long-lived cache headers for `/images` and `/assets`
- Basic security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`)

---

## 📄 Deploy to GitHub Pages

1. Create a new repository on GitHub, e.g. `saswat-residency`.
2. From inside this folder, initialize git and push:

   ```bash
   git init
   git add .
   git commit -m "Initial commit — Saswat Residency website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/saswat-residency.git
   git push -u origin main
   ```

3. In the GitHub repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then **Save**.
6. GitHub will publish the site at:
   `https://<your-username>.github.io/saswat-residency/`

   > Because GitHub Pages serves the site from a sub-path (unless you use a custom domain or an org/user root repo named `<username>.github.io`), the site currently uses **root-relative paths** (e.g. `/css/style.css`, `/images/...`). If you deploy under a sub-path like `/saswat-residency/` and see missing styles/images, either:
   > - Add a custom domain (recommended — see below), which serves from the root and needs no path changes, **or**
   > - Do a find-and-replace of `href="/` and `src="/` to `href="./` and `src="./"` (relative paths) throughout `index.html` and `404.html`, or prefix them with `/saswat-residency/`.

7. **Custom domain (optional):** add a `CNAME` file to the repo root containing your domain (e.g. `www.saswatresidency.com`), then configure your DNS with a `CNAME` record pointing to `<your-username>.github.io`.

---

## ✉️ Wiring up the contact form

The contact form is fully functional client-side (validation, honeypot spam-guard) but needs a backend to actually receive submissions by email, since GitHub Pages/Vercel static hosting has no server code by default. Pick one:

### Option 1 — Formspree (fastest, free tier available)
1. Create a free account at [formspree.io](https://formspree.io) and create a new form.
2. Copy your form endpoint, e.g. `https://formspree.io/f/abcd1234`.
3. In `index.html`, find the `<form id="contact-form" ...>` element and replace:
   ```html
   action="https://formspree.io/f/your-form-id"
   ```
   with your real endpoint.
4. Done — submissions will arrive at the email you registered with Formspree.

### Option 2 — Getform, Web3Forms, or any "form backend as a service"
Same idea as above: paste your endpoint URL into the form's `action` attribute. These all accept a standard `POST` with `FormData`, which `js/main.js` already sends.

### Option 3 — Your own serverless function
If deploying on Vercel, you can add an `/api/contact.js` serverless function (Node.js) that sends an email via a provider like Resend, SendGrid, or Nodemailer, and point the form's `action` to `/api/contact`.

### No backend configured yet?
That's fine — until you add one, the form will automatically fall back to opening a pre-filled email draft addressed to `gprasadsahoo@gmail.com` in the visitor's email app, so no enquiry is ever lost.

---

## 🎨 Customizing content

- **Colors / fonts** — edit the CSS custom properties at the top of `css/style.css` (`:root { ... }`).
- **Copy / text** — edit directly in `index.html`; all sections are clearly commented (`<!-- ============ SECTION ============ -->`).
- **Floor plans / carpet areas** — see the `<table class="unit-table">` blocks inside the `#floor-plans` section; figures are sourced directly from the official brochure.
- **Images** — replace files in `/images` with the same filenames to swap photos without touching HTML, or add new ones and update the `src`/`data-lightbox` attributes.
- **Brochure PDF** — replace `/assets/Saswat-Residency-Brochure.pdf` with an updated PDF (keep the same filename, or update the download links in `index.html`).
- **Map** — the embedded map uses OpenStreetMap (no API key needed). To use Google Maps instead, replace the `<iframe>` inside `#location` with a Google Maps embed code.
- **Domain in SEO tags** — search for `saswatresidency.com` in `index.html`, `robots.txt`, and `sitemap.xml` and replace with your actual production domain once you have one.

---

## ✅ Pre-launch checklist

- [ ] Replace placeholder domain (`www.saswatresidency.com`) in meta tags, `robots.txt`, `sitemap.xml` with the real domain
- [ ] Connect the contact form to Formspree/Getform/your own backend (see above)
- [ ] Verify phone numbers / email / address are current
- [ ] Add Google Analytics or another analytics snippet if desired (paste before `</head>` in `index.html`)
- [ ] Test on a real mobile device
- [ ] Run through [PageSpeed Insights](https://pagespeed.web.dev/) and [Lighthouse](https://developer.chrome.com/docs/lighthouse/) once live
- [ ] Submit `sitemap.xml` to Google Search Console

---

## 📜 Legal note

All plans, layouts, specifications, images and details reflect the official project brochure. Per the developer's disclaimer, these are indicative only and may be modified without prior notice. Prospective buyers should independently verify all details before booking. This disclaimer is also shown on the website itself, in the Floor Plans section and footer.

---

Built with plain HTML, CSS &amp; JavaScript — no frameworks, no build step, no lock-in.
