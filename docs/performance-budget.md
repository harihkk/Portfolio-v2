# Performance Budget

This document defines the performance budget for _The Systems Journal_ (Hari Kancharla's portfolio) and the engineering tactics that keep the site inside it. The budget is a hard contract: a build that misses these numbers is a regression, not a judgment call.

## Why a budget exists

The site's thesis is that engineering claims must be provable. The same standard applies to the site itself. A portfolio that argues for evidence-backed, honest systems cannot ship a slow, jank-prone front end. The budget below is the measurable form of that argument: every route is fast, stable, and quiet in the console, and we can demonstrate it on demand.

The site is built on Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind v4, and GSAP. Those choices shape the tactics but not the targets, the targets are fixed regardless of stack.

## Targets

### Lighthouse category scores

Every primary route must meet or exceed these Lighthouse scores (mobile profile, the stricter of the two):

| Category       | Minimum score |
| -------------- | ------------- |
| Performance    | >= 90         |
| Accessibility  | >= 95         |
| Best Practices | >= 95         |
| SEO            | >= 95         |

### Core Web Vitals (field-equivalent lab thresholds)

| Metric                          | Target   | Meaning                                |
| ------------------------------- | -------- | -------------------------------------- |
| LCP (Largest Contentful Paint)  | < 2.5 s  | Largest above-the-fold element painted |
| CLS (Cumulative Layout Shift)   | < 0.1    | Visual stability; no content jumping   |
| INP (Interaction to Next Paint) | < 200 ms | Responsiveness to user input           |

### Runtime hygiene (pass/fail, no tolerance)

These are binary gates. Any single violation fails the budget:

- **No console errors.** The console is clean on load and through a full scroll/interaction pass.
- **No React hydration warnings.** Server and client markup match; no hydration mismatch logs.
- **No unhandled promise rejections.** All async paths (data, animation setup, demo logic) handle their own failures.
- **No permanent main-thread loops.** No `requestAnimationFrame` loop or timer runs indefinitely; every animation and interaction loop has a termination or cleanup path. Idle routes settle to near-zero main-thread work.

## Tactics

How the budget is met. Each tactic maps to one or more of the targets above.

### Rendering model: server-first, client islands

- **Server Components by default.** Pages, sections, and static editorial content render on the server and ship zero component JavaScript by default. This is the single largest lever on Performance score and LCP.
- **Client islands only where interaction or animation lives.** A component opts into the client (`"use client"`) only when it needs state, event handlers, or animation. Count-up metrics, scroll-reveal headings, and interactive demos are islands; the masthead, lead story, indexes, and record sections are not.

### Code splitting and lazy loading

- **Per-route code splitting.** Demos and their dependencies are scoped to the routes that use them so they do not ship on every page. A heavy interactive demo on one case-study route must not appear in the bundle for the home route.
- **Lazy-load below-the-fold demos.** Interactive demonstrations and any heavy island below the first viewport are dynamically imported (`next/dynamic`) and mount on approach, not on initial load. This protects LCP and the initial JS budget.
- **GSAP loaded only where used.** GSAP and ScrollTrigger are imported only inside the client islands that animate. They are never part of the shared/global bundle. Routes with no animation ship no GSAP.

### Images and layout stability

- **SVG and CSS over raster images.** The visual system is near-zero raster: diagrams, the interactive systems plate, icons, and textures are SVG or CSS. This is by design and is the reason image weight is effectively negligible across the site.
- **Image strategy note.** Because there are almost no raster images (no photo, no video per the project brief), the usual image-optimization pipeline carries little weight. Where a raster asset is unavoidable, it goes through `next/image` with explicit `width`/`height` and a modern format. Today the image budget is treated as near-zero rather than a meaningful line item.
- **Explicit dimensions everywhere.** Every media element, embedded SVG, canvas, and reserved animation slot declares its dimensions (or aspect ratio) so nothing reflows as it loads. This is the primary defense for CLS.

### Animation discipline (CLS + INP + main-thread)

- **Transforms and opacity only.** Animations move and fade using `transform` and `opacity`, which are compositor-friendly and do not trigger layout. No animating of `width`, `height`, `top`, `left`, or other layout-affecting properties. This keeps CLS at zero from motion and keeps the main thread free for input (INP).
- **ScrollTrigger cleanup.** Every GSAP/ScrollTrigger instance is created in a scoped context and killed on unmount (no orphaned triggers, no leaked listeners). This is what guarantees "no permanent main-thread loops."
- **ScrollTrigger refresh after fonts.** Trigger positions are recalculated after web fonts load (and on resize) so scroll-driven reveals fire at the correct scroll offsets rather than positions measured against fallback-font layout.

### Fonts

- **`next/font`, no blocking `@import`.** The three families, Newsreader (serif), Manrope (sans), and IBM Plex Mono (mono), are loaded via `next/font`, which self-hosts and inlines font CSS with no render-blocking `@import` or external stylesheet request. Font display avoids invisible-text stalls (FOIT), protecting LCP, and the post-load ScrollTrigger refresh above absorbs any font-driven layout shift, protecting CLS.

## JS budget per route

Each route carries its own JavaScript budget, enforced against the route's first-load JS as reported by `next build`. The principle is fixed even where specific kilobyte ceilings are still being set:

- **Shared baseline (framework + global chrome).** The framework runtime plus shared layout (masthead, nav, footer) is the floor that every route pays. It must contain no GSAP and no demo code.
- **Editorial/static routes** (home/masthead, indexes, record sections, research desk, contact): close to the shared baseline. These are predominantly Server Components; client JS is limited to small islands (e.g., count-up, scroll reveal). Target: shared baseline plus a thin island layer.
- **Demo/case-study routes** (flagship system case studies with an interactive demonstration): allowed a higher ceiling to cover the route-local demo and GSAP, but only because that weight is code-split to the route and the demo itself is lazy-loaded below the fold. The cost is paid by the route that shows the demo, never globally.

> **Could not verify / Needs user approval:** Specific per-route kilobyte ceilings (e.g. "shared baseline <= X KB", "demo route <= Y KB first-load JS") are not established in the audit data and depend on the final implemented bundle. These numbers must be set from a real `next build` report and approved by Hari before they are published as a contract. Do not state a specific kB figure until then.

## Measurement plan

The budget is only real if it is measured. Three layers, from cheapest to most thorough.

### 1. Bundle analysis (`next build`)

`next build` prints a per-route breakdown of first-load JS and shared chunks. This is the primary tool for the per-route JS budget.

```bash
# Production build with the per-route JS size table
npm run build
```

Review the route table after every build. A route whose first-load JS grows unexpectedly is investigated before merge, usually it means a demo or GSAP leaked into a shared chunk, or a Server Component was accidentally marked `"use client"`. For deeper inspection, a bundle-analyzer pass (e.g. `@next/bundle-analyzer`) can be enabled to visualize what is in each chunk.

> **Could not verify:** Whether `@next/bundle-analyzer` (or an equivalent visualizer) is currently wired into the build is not confirmed in the audit data. If a richer visual breakdown is wanted, this needs to be added and the exact command documented. **Needs user approval.**

### 2. Lighthouse (category scores + Core Web Vitals)

Run Lighthouse against a production build (never `next dev`, which is unoptimized and will under-report Performance).

```bash
# 1. Build and serve the production bundle
npm run build
npm run start            # serves the production app locally

# 2. Run Lighthouse against each primary route (mobile profile)
npx lighthouse http://localhost:3000/ \
  --preset=desktop=false \
  --only-categories=performance,accessibility,best-practices,seo \
  --view
```

Run this for every primary route, not just the home page, and use the **mobile** profile as the gating profile. Manual Lighthouse runs from Chrome DevTools (Lighthouse panel) are acceptable for spot checks; the CLI is preferred for repeatability.

> **Lighthouse CI, Needs user approval.** Automating Lighthouse in CI (e.g. `@lhci/cli` with per-route assertions wired to the four category minimums and the LCP/CLS/INP thresholds) is the intended end state so the budget is enforced on every pull request rather than checked by hand. Whether to add Lighthouse CI, and the exact assertion config, is **not yet decided in the audit data and requires Hari's approval.** Until then, treat manual/CLI Lighthouse runs on a production build as the gate.

### 3. Runtime hygiene check

The pass/fail runtime gates (no console errors, no hydration warnings, no unhandled rejections, no permanent main-thread loops) are verified by:

- Loading each route on a production build with DevTools open and confirming a clean console on load and through a full scroll + interaction pass.
- Watching the Performance panel on an idle route to confirm main-thread work settles to near-zero (no animation loop left running after reveals complete).
- Confirming no React hydration mismatch warnings appear for any server-rendered route.

## Summary

| Lever                                 | Protects                                   |
| ------------------------------------- | ------------------------------------------ |
| Server Components by default          | Performance, LCP, JS budget                |
| Client islands only                   | JS budget, INP                             |
| Per-route code splitting + lazy demos | LCP, JS budget                             |
| GSAP only where used                  | JS budget                                  |
| SVG/CSS over images                   | Performance, LCP, image weight (near zero) |
| Explicit dimensions                   | CLS                                        |
| Transforms + opacity only             | CLS, INP, main-thread                      |
| ScrollTrigger cleanup                 | No permanent loops                         |
| ScrollTrigger refresh after fonts     | CLS                                        |
| `next/font` (no blocking `@import`)   | LCP, CLS                                   |

The budget holds when every primary route meets the four Lighthouse minimums and the three Core Web Vitals thresholds on a production build, ships within its per-route JS budget, and runs with a clean console and no permanent main-thread work.
