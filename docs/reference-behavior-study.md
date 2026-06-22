# Reference Behavior Study

A behavior-only study of `shivanshgupta.com` as a quality benchmark for _The Systems Journal_ (Hari Kancharla's Portfolio-v2). This document records _how the reference experience behaves_: its editorial pacing, motion continuity, scroll rhythm, section variety, density, typographic hierarchy, route completeness, transition quality, archive presentation, long-form flow, responsiveness, and single visual world. It then states precisely what we borrow (rhythm and grammar) and what we never copy (code, copy, layout, assets, timings).

This study is a companion to [reference-parity.md](reference-parity.md), which maps the reference's sections to our equivalents. Where parity maps _what each section becomes_, this study describes _how the experience moves and breathes_ so we can match the craft bar without importing anything concrete.

## Ground Rules

- `shivanshgupta.com` is used strictly as a **quality benchmark for craft and pacing**, never a source of content, code, or assets.
- We borrow **rhythm and grammar**: pacing, motion vocabulary, scroll behavior, density discipline, typographic hierarchy, and the editorial "publication" conceit.
- We never copy **code, copy, layout, assets, or timings**: no markup, class strings, `clamp()` values, color tokens, reveal keyframes, component structure, headline text, images, video, or numeric figures.
- No reference figures, credentials, awards, or publications are ever reused or implied as Hari's.
- The Systems Journal is reimplemented independently in our own stack (Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, GSAP, MDX, Zod) and our own voice.

## Behavioral Dimensions Studied

| Dimension            | What we observe in the reference (behavior only)                                                                                                                                  | What we borrow (rhythm / grammar)                                                              | What we never copy                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Editorial pacing     | Sections are gated by a full-width serif headline plus a thin border rule, giving the eye a hard reset between blocks; dense record sections alternate with visual exhales.       | The gate-and-reset cadence and the dense-vs-exhale alternation.                                | The specific headline copy, rule thicknesses, and spacing values.    |
| Motion continuity    | Motion is subtle, single-purpose, and consistent across the page: entrance reveals and count-up stats reinforce a "turning the page" metaphor rather than competing with content. | A single, coherent motion language with one purpose per effect.                                | Their reveal keyframes, easings, and timing curves.                  |
| Scroll rhythm        | Scrolling progresses through clearly demarcated blocks; each block enters with a gentle opacity/translate reveal so the page reads as a sequence of pages, not one wall.          | Scroll-reveal as a per-block "page turn"; reveals serve reading, never spectacle.              | Their scroll thresholds, offsets, and reveal timings.                |
| Section variety      | Roughly fifteen sections coexist without clutter because each has a distinct register (lede, by-the-numbers, index, record grid, archival, listing, exhale, closing CTA).         | The principle that many sections can coexist when each has a distinct register.                | Their section roster, ordering, and content semantics.               |
| Density              | Dense, information-rich sections are tolerable because they are bounded by hard resets and balanced by exhale sections.                                                           | Bounded density: pack information, then give the eye rest.                                     | Their exact information per block and grid densities.                |
| Typography hierarchy | Hierarchy is almost entirely typographic: one high-contrast serif at large `clamp()` sizes does the heavy lifting while body and metadata recede.                                 | Typographic-first hierarchy: a dominant serif headline scale over recessive body and metadata. | Their type-scale values, font stack, and `clamp()` numbers.          |
| Route completeness   | The experience reads as a complete, self-contained publication with no obvious dead ends.                                                                                         | The expectation of a complete, finished publication.                                           | Their route map and URL structure.                                   |
| Transition quality   | Movement between states is smooth and unobtrusive, never a loading gate or a jarring cut.                                                                                         | Smooth, content-respecting transitions that never block reading.                               | Their transition implementation and durations.                       |
| Archive presentation | A distinct "archival record on newsprint" register sets archival material apart from the main flow, signaling a different kind of record.                                         | A differentiated visual register for archival / record material.                               | The newsprint texture, palette, and the archival content itself.     |
| Long-form flow       | The single long page flows as one continuous editorial read, lede to closing CTA, with momentum carried by the box-score stats early on.                                          | A long-form, top-to-bottom editorial flow with early momentum.                                 | Their narrative copy and section sequence.                           |
| Responsiveness       | The layout holds its editorial character across viewport sizes.                                                                                                                   | Editorial character preserved across breakpoints.                                              | Their breakpoint logic and responsive values.                        |
| Single visual world  | Color is restrained and near-monochrome, which is what makes it read editorial rather than startup; one coherent palette unifies the whole page.                                  | A single, restrained, coherent visual world across the page.                                   | Their `#1A1916` ink, cream/newsprint/border tokens, and color names. |

## Rhythm and Grammar We Borrow

The reference's central lesson is **rhythm**: it packs many sections yet never feels cluttered because every section is bounded by a serif headline and a hairline rule, and because dense record sections are deliberately interleaved with visual exhales. We reproduce this cadence in our own tokens and stack, not theirs.

The reference's second lesson is **grammar**: the editorial "publication" conceit (masthead nameplate, Vol./No./Est. framing, live date, hairline section rules, near-monochrome restraint, typographic-first hierarchy, single-purpose entrance and count-up motion). We adopt this grammar only because we can back it with real editorial substance; a thin masthead over hype reads as costume.

We reproduce the rhythm and grammar in The Systems Journal palette and tokens: paper `#F2EEE5`, ink `#151412`, signal `#E34A2F`; Newsreader serif, Manrope sans, IBM Plex Mono; GSAP with ScrollTrigger for motion, with all motion scoped and torn down inside `useGSAP()` and reduced-motion variants handled through `gsap.matchMedia()`.

## What We Never Copy

| Category             | Specifically excluded                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Code                 | Markup, Tailwind class strings, component structure, exact `clamp()` type-scale values, `#1A1916` ink token, cream/newsprint/border token names. |
| Copy                 | Every reference headline and body line; we write entirely new copy in our own voice.                                                             |
| Layout               | Their section roster, ordering, grid structure, and spacing values.                                                                              |
| Assets               | Photos, portraits, the moments/Instagram imagery, logos, and any embedded video.                                                                 |
| Timings              | Their reveal keyframes (`opacity:0` plus translateY/scale), easings, scroll thresholds, and transition durations.                                |
| Data and credentials | Their figures (250+, 284+, 100+, 15+, 300+, 7+), credentials, awards, and named papers or projects.                                              |

Nothing concrete crosses the line. We study behavior, then reimplement the behavior from scratch.

## How The Systems Journal Stays Distinct

Matching a craft bar is not imitation. The Systems Journal is recognizably its own publication, distinct from the reference in identity and substance:

- **Execution Trace.** Our work is presented as observable execution and inspectable evidence, not as a maker's showcase. Flagship systems surface execution-backed results (for example Code Review Arena's case-level detection, validation, apply, and test outcomes; DebugBrief's red-to-green CI matrix), and the signature interaction is the **Evidence Line**, a draggable and keyboard-operable signal node that lights up related evidence. This evidence-first frame has no analog in the reference.
- **Warm palette.** Where the reference reads near-monochrome, The Systems Journal lives in a warm, paper-grained world: paper `#F2EEE5`, ink `#151412`, and a single signal `#E34A2F`. The visual world is ours, not a recoloring of theirs.
- **No photo.** The reference centers a portrait hero and photographic exhales. The Systems Journal carries **no photograph, no video, no portrait** anywhere; the hero is an interactive systems plate, and the visual breathers are engineering imagery (architecture diagrams, dashboards, system screenshots). The proof is a system, not a face.

In short: we borrow the reference's rhythm and editorial grammar, render it in a warm paper world, and replace its content world entirely with an evidence-first, execution-traced engineering publication.
