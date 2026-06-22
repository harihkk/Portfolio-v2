# Motion Audit

A snapshot of the motion system as it actually exists in Portfolio-v2 (HEAD `6ad90b2e73f770005ab41a112db0ecdbdab74825`), measured against the intended system described in `docs/animation-plan.md`. The goal of this pass is to be honest about the distance between plan and code: what is shipped now, what this hardening pass implements, and what is deliberately deferred.

This document records facts read directly from the repository. Where a plan item has no corresponding implementation, it is listed as a gap rather than glossed over.

## Stack as built

The motion layer is GSAP-based, matching the plan's "one animation library" rule. Confirmed in `lib/motion.ts`:

- `gsap` and `ScrollTrigger` are the only animation engine; `ScrollTrigger` is registered at module load (client only) so it is available before any child `useGSAP` effect runs.
- React integration is `@gsap/react` `useGSAP()`, scoped to a component ref, in every animated component.
- Exposed easing constants: `EASE = "power3.out"` and `EASE_IN_OUT = "power2.inOut"`.
- Reduced motion is read through a `prefersReducedMotion()` helper that calls `window.matchMedia("(prefers-reduced-motion: reduce)")`.

No competing animation library is present, consistent with the plan's hard rule against Framer Motion, Anime.js, Lottie, and Locomotive Scroll.

`MotionProvider` (`components/motion/MotionProvider.tsx`) registers GSAP, calls `ScrollTrigger.refresh()` after `document.fonts.ready` and on window `load`, and kills all triggers on unmount. The reveal hidden-state is armed pre-paint by an inline script in `app/layout.tsx` (gated on `matchMedia` reduced-motion and `prefers-reduced-motion`), which avoids a flash and leaves content visible when JS is off or motion is reduced.

## Current motion system (shipped)

| Element          | File                                    | Behavior                                                                                                                                                                                                                                                                                | Reduced-motion handling                                                                                        |
| ---------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Opening sequence | `components/motion/OpeningSequence.tsx` | First-session overlay ("Indexing the Systems Journal"): a `scaleX` rule draw plus four staged status steps, then a `yPercent: -100` curtain lift. Gated once per session via `sessionStorage` key `tsj-opening-seen`. Hard safety cap at 1700ms so the page is never trapped.           | Skipped entirely (returns before activating); content is server-rendered underneath.                           |
| Reveal (generic) | `components/motion/Reveal.tsx`          | Scroll-triggered opacity + `y` rise (default `y = 22`), `start: "top 86%"`, `once` by default. Optional staggered variant for children marked `data-reveal-item`.                                                                                                                       | Sets opacity to 1, no transform.                                                                               |
| Marquee          | `components/motion/Marquee.tsx`         | Slow horizontal record (`xPercent: -50`, linear, infinite), content duplicated for a seamless loop. Pauses on hover and on keyboard focus.                                                                                                                                              | Animation skipped; terms wrap into a static readable list, the duplicate row is hidden.                        |
| CountUp          | `components/motion/CountUp.tsx`         | Counts to `value` once when scrolled into view (`start: "top 92%"`). Final `display` string is always the server-rendered text.                                                                                                                                                         | No animation; static `display` value shown.                                                                    |
| EvidenceLine     | `components/motion/EvidenceLine.tsx`    | Signature interaction. Draggable / arrow-key node on a signal line, implemented as an ARIA `slider` (`aria-valuemin/max/now/text`), with click-to-anchor and a polite live region. Settle uses a CSS cubic-bezier transition on `left`/`width`; during drag the transition is disabled. | Settling relies on CSS transition; node still snaps to the nearest anchor and the readout stays fully legible. |
| SystemsPlate     | `components/systems/SystemsPlate.tsx`   | Hero "execution pipeline" diagram: a signal dot travels a five-stage spine (REQUEST, MODEL, ACTION, VALIDATION, EVIDENCE), lighting each stage. Timeline is `paused` and driven by a `ScrollTrigger.onToggle` so it does not loop while offscreen.                                      | Sets the final stage active immediately and renders a fully legible static diagram.                            |
| ReadingProgress  | `components/motion/ReadingProgress.tsx` | Thin top scroll-progress rule, `scaleX` driven by scroll position via a `requestAnimationFrame`-throttled scroll listener (not GSAP/ScrollTrigger).                                                                                                                                     | No special branch; it reflects position rather than animating decoratively, so it degrades gracefully.         |
| Route transition | `app/template.tsx`                      | Template-level fade: opacity + `y: 12` over 0.42s `power2.out` on client navigation. First paint is skipped to avoid initial-load flicker.                                                                                                                                              | Sets opacity to 1, no transform.                                                                               |

Supporting editorial components reuse `Reveal`: `SectionHeader` (`components/editorial/SectionHeader.tsx`) wraps its header in `Reveal` and renders its hairline as a static `<hr className="rule">`; `FlowDiagram` (`components/systems/FlowDiagram.tsx`) uses the staggered `Reveal` variant for its steps.

## Gaps versus the plan

The plan in `docs/animation-plan.md` describes a richer system. The following items are specified there but have no implementation at HEAD:

| Planned element                                             | Plan reference                                         | Status in code                                                                                                                                                                                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Masked heading reveal (serif rises / unmasks behind a mask) | Section 3, "Masked text reveal"                        | Not implemented. Headings use the generic opacity + `y` `Reveal`; no clip-path or mask-based reveal exists (the only `clipPath` reference is `clipPath: "none"` in `app/template.tsx`).                                           |
| Editorial rule draw (hairline rules draw in on enter)       | Section 2.3                                            | Not implemented as a per-section reveal. Section rules are static `<hr className="rule">`. A `scaleX` rule draw exists only inside the opening sequence.                                                                          |
| Sticky storytelling (pinned, stepped panels, desktop only)  | Section 3, "Sticky storytelling"                       | Not implemented. No ScrollTrigger pinning exists for case studies.                                                                                                                                                                |
| Diagram assembly (SVG/DOM nodes and connectors assemble)    | Section 3, "Diagram assembly"                          | Not implemented. SystemsPlate animates a traveling signal over an already-assembled diagram; nodes and connectors do not assemble. FlowDiagram only staggers in via `Reveal`.                                                     |
| Real route curtain (paper / rule wipe, budget <=450ms)      | Section 2.4                                            | Not implemented. The route transition is a template fade, not a hairline rule sweep over the paper field.                                                                                                                         |
| `gsap.matchMedia()` responsive variants                     | Sections 1, 7, and the sticky-storytelling gating note | Not used. `matchMedia` appears only as a raw reduced-motion check in `lib/motion.ts` and the inline reveal script in `app/layout.tsx`. There is no `gsap.matchMedia()` call and no desktop/mobile breakpoint variant declaration. |
| Execution Trace                                             | (intended motion item)                                 | Not implemented. No Execution Trace component exists.                                                                                                                                                                             |

Additional smaller deltas worth noting:

- Reduced-motion strategy is currently per-component (each component calls `prefersReducedMotion()` and branches), not centralized through `gsap.matchMedia()` as Section 7 intends. The information outcome matches the plan (static final state, no fast-forward), but the single-source-of-truth mechanism is not in place.
- Several plan items (Masthead reveal in Section 2.2, Footer reveal in Section 2.5, Timeline draw and Paper-stack in Section 3) are partially or fully served by the generic `Reveal` rather than the bespoke behaviors described, or are not yet distinct.

## This pass: implements vs defers

Stated honestly so expectations match reality.

### Implemented / hardened in this pass

- Documentation of the real motion surface: this audit, grounded in the components listed above.
- Confirmation that the shipped motion respects the plan's non-negotiables: single animation library (GSAP), `useGSAP` scoping with teardown, server-rendered content underneath all motion, CountUp final values present in the HTML, marquee pause-on-hover and pause-on-focus, opening sequence gated once per session with a hard safety cap, and `ScrollTrigger.refresh()` after fonts load.
- Confirmation of accessibility posture on the signature interaction: the Evidence Line is an ARIA slider, keyboard operable (arrows, Home, End), with a polite live region and a visible focus ring.

### Deferred (not in this pass)

- Masked heading reveal.
- Editorial rule draw as a per-section ScrollTrigger behavior.
- Sticky storytelling for flagship case studies.
- Diagram assembly for SystemsPlate and architecture diagrams.
- Real route curtain (paper / rule wipe) to replace the template fade.
- Migration of reduced-motion and responsive logic to `gsap.matchMedia()` variants.
- Execution Trace component.

These remain open against `docs/animation-plan.md` and are not claimed as done.

## Notes and constraints

- Project and system metrics that could appear as animated count-up figures (for example Code Review Arena's detection-versus-validation gap from its committed `audit-v1.json`, and ContamCheckr's contamination-index figures) are flagged in the animation plan's Open Items as needing a fresh run or user approval before being shown as animated values. This audit does not change that status.
- The old-site interaction lineage referenced by the Evidence Line ("draggable logo / wire-lit") could not be verified against source and is carried from the brief, per the animation plan's Open Items.
