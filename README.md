# CG-Agro-Farm

**“Growing Agriculture, Building Future”**

A professional, responsive, single-page website for **CG-Agro-Farm** — one parent company
with four business divisions:

| Division | Section id | What it covers |
| --- | --- | --- |
| CG Rice Mill | `#rice-mill` | Paddy intake, cleaning, milling, grading, packaging, storage, distribution |
| Tharu Vaisi Farm | `#tharu-vaisi-farm` | Buffalo farming, dairy production, animal care, sustainability |
| CG Furniture | `#furniture` | Home, office, bedroom, living room, restaurant and custom furniture |
| CG Fish Farm | `#fish-farm` | Fish breeding, pond management, feeding, harvest, fresh supply |

---

## 1. Technology

* HTML5
* CSS3 (Grid, Flexbox, custom properties, no framework)
* Vanilla JavaScript (no libraries, no build step)

No React, Vue, Angular, jQuery or any other dependency. Nothing to install.

---

## 2. File structure

```
CG-AGRO-FARM/
│
├── index.html          ← the whole website (all sections)
├── style.css           ← all styling + responsive rules
├── script.js           ← all interactive behaviour
├── README.md           ← this file
│
└── assets/
    ├── images/         ← website photos and illustrations
    │   ├── hero-farm.svg
    │   ├── div-rice.svg
    │   ├── div-farm.svg
    │   ├── div-furniture.svg
    │   └── div-fish.svg
    ├── icons/          ← extra icons (optional)
    └── logo/           ← logo files
        ├── logo.svg
        └── favicon.svg
```

---

## 3. How to open the website

**Option A — double click (easiest)**

1. Open the project folder.
2. Double-click `index.html`.
3. The website opens in your default browser.

**Option B — local server (recommended while editing)**

Open a terminal inside the project folder and run:

```bash
# Python 3
python -m http.server 8000
```

Then visit <http://localhost:8000>.

> Opening `index.html` directly works fine. A local server is only needed if you later add
> PHP, a database or `fetch()` requests that browsers block on `file://` URLs.

---

## 4. Changing the logo

The logo is text + a small SVG leaf, so it works without any image file.

**To change the words** — search `index.html` for `CG-Agro-Farm` inside the two `.brand`
blocks (navbar and footer) and edit the text.

**To use a real image instead** — replace:

```html
<span class="brand__mark" aria-hidden="true"> … SVG … </span>
```

with:

```html
<img class="brand__img" src="assets/logo/logo.svg" alt="CG-Agro-Farm">
```

and add this to `style.css`:

```css
.brand__img { width: 44px; height: 44px; border-radius: 12px; object-fit: contain; }
```

Put your file at `assets/logo/logo.svg` (or `logo.png`). Recommended size: square,
transparent background, at least 512 × 512 px.

**To change the browser tab icon** — replace `assets/logo/favicon.svg`.

---

## 5. Changing images

1. Copy your photo into `assets/images/`.
2. In `index.html`, find the `<img>` tag you want to change.
3. Change the `src`, `alt` and (optionally) `width` / `height`.

```html
<!-- before -->
<img src="assets/images/div-rice.svg" alt="Illustration of CG Rice Mill …">

<!-- after -->
<img src="assets/images/rice-mill-real.jpg" alt="Our rice mill in [City]">
```

Recommended: `.jpg` or `.webp`, landscape, around 1200 × 800 px, under 300 KB each.

The hero background is set in `style.css`:

```css
.hero {
  background-image: url("assets/images/hero-farm.svg");
}
```

The bundled `.svg` files are **placeholders**. They work offline and are clearly marked
“PLACEHOLDER”, so replace them with real photography of the mill, farm, workshop and ponds.

---

## 6. Changing contact details

### Contact info card (section `#contact`)

Search `index.html` for the placeholders and replace them:

```html
<p>[Add Business Address]</p>
<p>[Add Phone Number]</p>
<p>[Add Email Address]</p>
<p>[Add Business Hours]</p>
```

### Contact form pre-filled values

```html
<input type="text" id="cName"  value="CG Agro Farm">
<input type="tel"  id="cPhone" value="9847211161">
<input type="email" id="cEmail" value="cgagrofarm@gmail.com">
```

### Footer

Replace `[Add Business Address]`, `[Add Phone Number]`, `[Add Email Address]` and
`[Add Business Hours]` in the footer columns too.

### Social media links

The footer icons ship as placeholders. Each one carries `data-placeholder` plus an
`aria-label` ending in `(link not added yet)`, and it is styled with a dashed border and
reduced opacity so it is visibly not live yet. Clicking one shows a toast instead of
following an empty `#` link.

To activate them, replace `href="#"` and `data-placeholder` with the real URL and remove
the `(link not added yet)` part of the label:

```html
<a href="https://www.facebook.com/yourpage" aria-label="Facebook">…</a>
```

Find them by searching `data-placeholder` in `index.html`.

### Making the contact form actually send email

The form currently validates input only and shows a confirmation message — nothing is
transmitted. To make it live, use a free form service (Formspree, Web3Forms, Google Forms)
or your own server:

```html
<form class="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST">
```

and remove `event.preventDefault();` inside the submit handler in `script.js`
(`initContactForm`).

---

## 7. Changing colours

All brand colours are CSS variables at the **top** of `style.css`. Change the values there —
every element updates automatically.

```css
:root {
  --green-dark:  #14532D;   /* Dark Green     */
  --green:       #2E7D32;   /* Agriculture Green */
  --green-fresh: #4CAF50;   /* Fresh Green    */
  --brown:       #795548;   /* Earth Brown    */
  --gold:        #D4A017;   /* Warm Gold      */
  --cream:       #F8F6EF;   /* Cream          */
  --charcoal:    #1F2937;   /* Dark Charcoal  */
}
```

Also update the same colours in:

* `index.html` → `<meta name="theme-color" content="#14532D">`
* `index.html` → the SVG gradient inside the logo (`stop-color` values)

Gradients are variables too: `--grad-brand`, `--grad-fresh`, `--grad-gold`, `--grad-earth`.

---

## 8. Adding a new business division

Example: adding a fifth division called **CG Poultry Farm**.

1. **Add the anchor to the navbar** (`index.html`):

   ```html
   <li><a href="#poultry-farm" class="nav-link">Poultry</a></li>
   ```

2. **Add a card** inside `<div class="division-grid">`:

   ```html
   <article class="division-card reveal">
     <div class="division-card__media">
       <img src="assets/images/div-poultry.svg" alt="CG Poultry Farm" loading="lazy" />
     </div>
     <div class="division-card__body">
       <span class="division-card__icon" aria-hidden="true">🐔</span>
       <h3 class="division-card__title">CG Poultry Farm</h3>
       <p>Short description of the division.</p>
       <ul class="tick-list">
         <li>Broiler Farming</li>
         <li>Layer Farming</li>
         <li>Egg Supply</li>
       </ul>
       <a href="#poultry-farm" class="btn btn--outline">Explore Poultry Farm</a>
     </div>
   </article>
   ```

3. **Add a full section** (copy the CG Fish Farm section as a template) with
   `id="poultry-farm"`.

4. **Add an SOP card** inside `.sop-grid` with the poultry procedure.

5. **Add the name** to every `<select>` in `index.html` that lists divisions
   (contact form, daily operations form).

6. **Add a footer link** in the “Business Divisions” column.

7. Add an image file `assets/images/div-poultry.svg`.

No CSS or JavaScript changes are needed — the layouts are reusable grids.

---

## 9. Placeholders that must be filled before launch

| Placeholder | Where |
| --- | --- |
| `[Add Business Address]` | Contact section, footer |
| `[Add Phone Number]` | Contact section, footer |
| `[Add Email Address]` | Contact section, footer |
| `[Add Business Hours]` | Contact section, footer |
| `[Facebook URL]`, `[Instagram URL]`, `[YouTube URL]` | Footer social icons |
| `XX` / `XX+` / `XX L` | Tharu Vaisi Farm statistics |
| `Rs. 0`, `0 Units`, `0 Customers` | Management dashboard (**marked as demo**) |
| `https://www.cgagrofarm.com/` | `<link rel="canonical">` and Open Graph URL |
| `og:image` / `twitter:image` | must point to a **PNG or JPG** (1200 × 630 px) — social platforms do not accept SVG |
| placeholder `.svg` images | `assets/images/` |

**Nothing on the website is a fabricated company fact.** All figures are either placeholders
or explicitly labelled “Demo value”. Replace them with verified numbers only.

---

## 10. Publishing the website

The site is completely static, so it works on any host.

1. **Netlify** (free, easiest) — go to <https://app.netlify.com/drop> and drag the whole
   project folder in. You get a public URL in seconds.
2. **GitHub Pages** — push the folder to a repository, then
   *Settings → Pages → Deploy from a branch →* `main` / root.
3. **Vercel / Cloudflare Pages** — import the repository; no build command is needed.
4. **Traditional hosting** — upload all files (including `assets/`) to `public_html`
   via cPanel or FTP.
5. **Local network share** — copy the folder to any machine and open `index.html`.

After publishing, update the canonical URL and Open Graph tags in `index.html`, and add the
website to Google Search Console and Google Business Profile.

---

## 11. Website sections (in order)

1. `#home` — hero
2. Trust strip
3. `#divisions` — our business divisions
4. `#about` — about + mission / vision / values
5. `#rice-mill` — CG Rice Mill
6. `#tharu-vaisi-farm` — Tharu Vaisi Farm
7. `#furniture` — CG Furniture
8. `#fish-farm` — CG Fish Farm
9. `#services` — our services
10. `#management-system` — centralized management dashboard
11. `#modules` — sales / purchase / expense / inventory / production / SOP modules
12. `#sop` — standard operating procedures
13. `#daily-operations` — daily operations entry
14. `#gallery` — filterable gallery
15. `#contact` — contact form + details
16. Footer, back-to-top button, toast messages

---

## 12. JavaScript features

| # | Feature | Where in `script.js` |
| --- | --- | --- |
| 01 | Mobile hamburger menu (with overlay + Esc key) | `initMobileMenu` |
| 02 | Smooth scrolling with sticky-header offset | `initSmoothScroll` |
| 03 | Sticky navbar background on scroll | `initScrollUi` |
| 04 | Active navigation item | `initActiveNav` |
| 05 | Scroll reveal animations | `initReveal` |
| 06 | Gallery filtering | `initGalleryFilter` |
| 07 | Contact + daily operations form validation | `initContactForm`, `initOpsForm` |
| 08 | Back-to-top button | `initScrollUi` |
| 09 | Toast notifications | `showToast` |
| 10 | Automatic year in footer | `initCurrentYear` |
| + | Management module tabs | `initTabs` |
| + | Number counters (real values only) | `initCounters` |
| + | Auto-calculated closing stock | `initOpsForm` |

All animations automatically stop for visitors who have
“Reduce motion” enabled in their operating system
(`prefers-reduced-motion`).

---

## 13. Browser support

Chrome, Edge, Firefox and Safari (desktop and mobile), current versions.
Uses CSS Grid, Flexbox, `IntersectionObserver`, `scroll-behavior` and `backdrop-filter`.

---

## 14. Accessibility & SEO built in

* Semantic landmarks: `header`, `nav`, `main`, `section`, `article`, `figure`, `footer`
* Proper `h1` → `h2` → `h3` → `h4` heading order
* Skip-to-content link, visible focus rings, `aria-expanded`, `aria-pressed`,
  `aria-selected`, `aria-invalid`, `role="tablist"` for the module tabs
* Descriptive `alt` text on every image
* `title`, `meta description`, `meta keywords`, Open Graph, Twitter card,
  canonical link and Organization structured data (JSON-LD)

---

© 2026 CG-Agro-Farm. All Rights Reserved.
“Growing Agriculture, Building Future”