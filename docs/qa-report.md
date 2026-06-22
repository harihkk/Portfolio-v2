# QA Report

The Systems Journal, Hari Kancharla. Generated 2026-06-21 from a clean production build (Next.js 16.2.9 / React 19 / Tailwind v4).

## Quality gates

| Gate                            | Command                                                                             | Result                                              |
| ------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------- |
| Lint                            | `npm run lint`                                                                      | ✅ pass (0 errors, 0 warnings)                      |
| Type check (strict)             | `npm run typecheck`                                                                 | ✅ pass                                             |
| Unit tests                      | `npm run test`                                                                      | ✅ 22 passed (3 files)                              |
| Production build                | `npm run build`                                                                     | ✅ pass, 39 routes prerendered                      |
| Combined gate                   | `npm run verify`                                                                    | ✅ pass (lint → typecheck → test → build)           |
| E2E (Chromium + mobile)         | `npm run test:e2e`                                                                  | ✅ 94 passed, 2 skipped (project-gated)             |
| Accessibility (axe)             | `playwright test e2e/a11y.spec.ts`                                                  | ✅ 22 passed, 0 serious/critical violations         |
| Broken-link / route scan        | curl all routes                                                                     | ✅ 17 routes correct status (200s, 404 for unknown) |
| Provenance / public-claim audit | `tests/unit/content.test.ts` + [public-content-review.md](public-content-review.md) | ✅ pass                                             |

## Unit coverage (22 tests)

Provenance integrity (unique ids, no phone leak, held items unapproved), metrics (only approved, non-numeric not animated), systems (4 slugs, limitations present, only DebugBrief published), research (14 external, none authored by Hari, valid arXiv ids), archive ordering + sources, experience uses résumé titles, earlier-work omits weather-dashboard and only shows verified live links, contact schema (valid/invalid/honeypot), SEO canonical + structured data, contact channels hide LinkedIn until set and expose no phone, StatusTag rendering.

## E2E coverage (Chromium + mobile-Chrome)

All routes load with no horizontal overflow; masthead + thesis; phone-number leak check (0); 404 page; external-link safety (`rel=noopener`) + résumé reachable; flagship case study (repo link + limitations); research paper external label + arXiv link; MDX note render; contact validation + mailto fallback; **Evidence Line keyboard operation** (ArrowRight/Left changes `aria-valuenow`); demo reset control; reduced-motion skips the opening sequence; opening sequence runs at most once per session; mobile menu open/close; desktop navigation.

## Accessibility (axe-core, WCAG 2.0/2.1 A & AA)

0 serious/critical violations across 11 routes × 2 viewports. Issues found and fixed during QA:

- Color contrast on dimmed demo states (`opacity-30/45` dragged text below 4.5:1) → replaced opacity-dimming with color/border differentiation.
- `--warning` was 4.19:1 at small sizes → darkened to `#8a5616`.
- Selected filter chips (white on `#e34a2f`, 3.71:1) → switched to `bg-signal-dark` (#a82e1d).
- Metric grid used a malformed `<dl>` → switched to `<ul>`.
- Horizontally-scrollable `<pre>` code blocks were not keyboard-focusable on mobile → added `tabIndex={0}`.

Beyond axe: semantic landmarks, skip link, visible focus rings, keyboard-operable Evidence Line and mobile menu with focus management + Escape, `prefers-reduced-motion` honored throughout (verified: under reduce, 0 reveals hidden and count-ups render final values instantly), no hover-only content.

## Bug found and fixed via real-browser testing

**GSAP ScrollTrigger registration order.** Registration ran in the provider's `useEffect`, but child `useGSAP` effects fire _before_ the parent's, so `scrollTrigger` tweens were created before the plugin was registered. Effect: reveal animations silently no-op'd and `[data-reveal]` content stayed at `opacity:0` for motion-enabled users. Fixed by registering `ScrollTrigger` at module load in `lib/motion.ts`. Confirmed via Playwright console capture (warnings gone) and DOM checks (content present, 0 errors). This is exactly the class of issue code inspection alone would miss.

## Not executed in this environment (run instructions)

- **Lighthouse**, no Lighthouse CLI in this session. Run against the production server: `npm run build && npm run start`, then `npx lighthouse http://localhost:3000 --view` (and key routes). Expected to meet the budget, see [performance-report.md](performance-report.md).
- **Firefox / WebKit**, projects are defined in `playwright.config.ts`; browsers weren't installed this session. Run `npx playwright install firefox webkit` then `npm run test:e2e` for full cross-browser. Chromium (desktop) + mobile-Chrome are green.
- **Manual responsive sweep** at 390/430/768/1024/1440/1920, full-page screenshots captured at desktop (1440) and mobile (Pixel 5) in [screenshots/](screenshots); intermediate widths to be eyeballed before cutover.

## Console / runtime health

No console errors, no `pageerror`, no hydration warnings, and zero service workers after load (verified via Playwright console + DOM diagnostics on the homepage).
