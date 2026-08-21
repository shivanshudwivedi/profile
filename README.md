# Shivanshu Dwivedi — Founder Portfolio

A custom, dependency-free portfolio built around Shivanshu's founder, engineering, and AI/physics research work.

## Run locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Design direction

- Founder operating-system aesthetic rather than a conventional résumé
- Proof-first storytelling with metrics, graphs, product systems, and research visualizations
- Custom motion with no animation or UI libraries
- Responsive layout, semantic HTML, and reduced-motion support

## Quality floor

Verified with automated checks at 390 / 768 / 1440, and under forced reduced-motion:

- **Contrast** — every text element clears WCAG AA (4.5:1) against its real
  composited background. Verified by walking the live DOM, not by eye.
- **Keyboard** — a designed 3px focus ring on every interactive element, recoloured
  to lime on the blue and dark bands. Skip link is the first tab stop.
- **Targets** — no interactive element under 44×44.
- **Motion** — `prefers-reduced-motion` stops all 91 infinite animations.
- **No JavaScript** — a `<noscript>` block reveals everything, so a failed script
  never leaves a blank page.
- **Print** — a dedicated stylesheet turns the site into an 11-page document with
  link destinations expanded.
- **Zero horizontal overflow** at every width.

## Files

```
index.html            markup + head metadata + JSON-LD
styles.css            everything visual, including print and reduced-motion
script.js             reveals, counters, nav state, ticker (no dependencies)
fonts/                Inter variable, self-hosted (latin + latin-ext)
og.png                1200×630 link-preview card
favicon.svg           tab icon
apple-touch-icon.png  512px home-screen icon
robots.txt            crawler policy
sitemap.xml           single-page sitemap
```

No build step. No runtime dependencies. No CDN.
