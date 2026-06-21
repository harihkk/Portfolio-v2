# Performance Report

Companion to [performance-budget.md](performance-budget.md). Measured from the production build (`next build`, Next.js 16 / Turbopack) on 2026-06-21.

## Build output

39 routes. All content routes are **static** (`○`) or **SSG** (`●`), prerendered HTML, except `/api/contact` (dynamic by necessity). This means HTML is served instantly and the site is fully usable without JavaScript.

| Route class | Count | Rendering |
|---|---|---|
| Static | most pages | prerendered at build |
| SSG (generateStaticParams) | `/systems/[slug]` ×4, `/research/[slug]` ×14, `/notes/[slug]` ×5 | prerendered HTML |
| Dynamic | `/api/contact` | server route on demand |

## Why it should meet the budget (LCP <2.5s, CLS <0.1, INP <200ms)

- **Near-zero raster weight.** The design is typography + authored SVG/CSS. The only raster asset is one lazy-loaded `demo.gif` (1.1 MB) that appears **only** on the DebugBrief case study, below the fold, with explicit width/height (no CLS) and `loading="lazy"`.
- **Server components by default.** Client islands are limited to interaction/animation (header, motion primitives, demos, filters, contact form). Pages are server-rendered.
- **Code-split demos.** The four interactive demos load via `next/dynamic`, so a route only ships the demo chunks it shows; the homepage lazy-loads them, other pages don't carry them.
- **Fonts via `next/font`** (Newsreader, Manrope, IBM Plex Mono), self-hosted, `display: swap`, no blocking third-party `@import`. ScrollTrigger positions are refreshed after `document.fonts.ready` to avoid post-font layout shift.
- **GSAP only where used**, imported in client motion components, not the server tree. ScrollTrigger registered once at module load.
- **Transforms & opacity only** for animation; no animating of layout properties. The systems-plate loop **pauses when offscreen** (ScrollTrigger `onToggle`), no permanent main-thread loop while hidden.
- **No layout shift from reveals**, reveal start-state is armed pre-paint by a tiny inline script (only when motion is allowed), and content is fully visible under reduced motion / no-JS.

## CLS / stability notes

- Sticky header uses backdrop-blur + color transition only (no height change that reflows).
- The opening sequence is an overlay over already-rendered content (content doesn't move under it) and is capped well under ~1.2s with a hard 1.7s safety timeout; it never runs on repeat visits (sessionStorage) or under reduced motion.

## To measure before cutover (instructions)

Lighthouse wasn't available in the build session. Run:

```bash
npm run build && npm run start
npx lighthouse http://localhost:3000 --preset=desktop --view
npx lighthouse http://localhost:3000/systems/code-review-arena --view
```

Targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. If the DebugBrief case study's LCP is affected by the demo.gif, consider replacing it with a poster image + click-to-play.
