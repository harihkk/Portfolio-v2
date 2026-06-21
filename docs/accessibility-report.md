# Accessibility Report

Target: WCAG 2.2 AA. Automated audit: axe-core via `@axe-core/playwright` (tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) across 11 routes × 2 viewports (Chromium desktop + Pixel 5).

## Result

**0 serious/critical violations** on every audited route (`e2e/a11y.spec.ts`, 22 tests passing). Routes audited: `/`, `/about`, `/systems`, `/systems/code-review-arena`, `/experience`, `/research`, `/research/swe-bench`, `/notes`, `/notes/[a note]`, `/archive`, `/contact`.

## Implemented

- **Landmarks & structure:** one `<main id="main">`, semantic `<header>`/`<nav>`/`<footer>`, correct heading order (one `h1` per page), descriptive link text.
- **Skip link:** "Skip to content" → `#main`, visible on focus.
- **Keyboard:** full keyboard operation. The Evidence Line is an ARIA `slider` (ArrowLeft/Right/Home/End, `aria-valuemin/max/now/text`, polite live region). The mobile menu manages focus (moves to first link on open, returns to the toggle on close) and closes on `Escape`. All demos use real `<button>`s and are keyboard-operable with `Reset`.
- **Visible focus:** global `:focus-visible` ring; custom rings on the Evidence Line node and scrollable code blocks.
- **Contrast:** all text meets 4.5:1 (palette tuned during QA, see qa-report). Status is never conveyed by color alone (text labels accompany every state: "Published", "Alpha", "blocked", "skipped", evidence bands).
- **Motion:** `prefers-reduced-motion` honored everywhere, opening sequence skipped, reveals shown immediately (verified 0 hidden under reduce), count-ups show final values, marquee wraps static, Evidence Line spring becomes instant snap.
- **Scrollable regions:** horizontally-scrollable `<pre>` blocks are `tabIndex=0` so keyboard users can scroll them.
- **Forms:** every field has a `<label>`, errors use `aria-invalid` + `aria-describedby`, status announced via `aria-live`.
- **Decorative content:** the systems plate has `role="img"` + descriptive label; decorative glyphs (arrows, ◆) are `aria-hidden`.
- **No hover-only content; touch targets** are comfortably sized (mono chips/buttons ≥ ~36px tall).

## To verify manually before cutover

- Screen-reader pass (VoiceOver / NVDA) on the homepage and one case study.
- 200% zoom and 320px-width reflow (no loss of content/function).
- Cross-browser focus-ring rendering (Firefox/WebKit once installed).
