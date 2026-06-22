# Animation Plan

Purpose: Define the complete motion system for _The Systems Journal_, what animates, how, why, and how it degrades, so motion reinforces the editorial-engineering conceit and the evidence-first thesis without ever competing with reading.

---

## 1. Technology Stack

The motion system uses one animation library and a small set of native primitives. No competing animation libraries (no Framer Motion, no Anime.js, no Lottie, no Locomotive Scroll) are permitted; this keeps the bundle lean, the timing model consistent, and the cleanup story single-sourced.

| Concern                              | Tool                                                              | Notes                                                                                                                              |
| ------------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Timeline + scroll-driven motion      | **GSAP + ScrollTrigger**                                          | Single source of truth for sequenced and scroll-linked animation.                                                                  |
| React integration                    | **`@gsap/react` `useGSAP()`**                                     | Scopes animations to a ref, auto-reverts on unmount, runs after layout. All GSAP code lives inside `useGSAP`.                      |
| Responsive + reduced-motion variants | **`gsap.matchMedia()`**                                           | One place to declare desktop / mobile / `prefers-reduced-motion` variants; each variant's cleanup is handled by matchMedia revert. |
| Microinteractions                    | **CSS transitions**                                               | Hover, focus, active, link underlines, button states, kept off the JS thread.                                                      |
| Diagrams                             | **SVG + DOM**                                                     | Architecture/data-flow plates are SVG/DOM nodes animated by GSAP; no canvas game, no physics sandbox.                              |
| Stack context                        | Next.js 16 App Router, React 19, TypeScript (strict), Tailwind v4 | Server-rendered content underneath all motion.                                                                                     |

Hard rules:

- All GSAP work is registered and torn down inside `useGSAP()` scoped to a component ref.
- `prefers-reduced-motion` is read through `gsap.matchMedia()`, never duplicated ad hoc.
- No animation library beyond GSAP/ScrollTrigger. CSS handles microinteractions.

---

## 2. Global Motion

Motion that spans the whole publication, not a single section.

### 2.1 Opening sequence, "Indexing the Systems Journal"

- A brief masthead-assembly sequence on first load: the wordmark, hairline rules, and Vol./No./Est./live-date stamp resolve into place.
- **Once per session**: gated by `sessionStorage` so returning navigation within the session does not replay it.
- **Budget**: total runtime **≤ ~1200ms**.
- **Server-rendered underneath**: the real page content is already in the DOM (SSR); the sequence is a reveal over committed content, never a loading gate. If JS fails, the content is there.
- **Reduced motion**: skipped entirely, content appears static, no fast-forwarded replay.

### 2.2 Masthead reveal

- The nameplate and masthead grammar (Vol./No./Issue/Est./live month-year) settle in after the opening sequence (or immediately, under reduced motion).
- Establishes the institutional "publication" frame in the first viewport.

### 2.3 Editorial rule draw

- The hairline section rules draw in (left-to-right or scaleX) as their section enters, reinforcing the "hard reset between blocks" rhythm.
- Reduced motion: rules are present and full-width immediately.

### 2.4 Route transition, paper / rule wipe

- Navigating between routes plays a paper-and-rule wipe (a hairline rule sweep over the paper field).
- **Budget**: **≤ 450ms**.
- Must not block the incoming route's interactivity longer than the wipe; reduced motion replaces it with an instant cut.

### 2.5 Reading progress

- A thin progress indicator tracks scroll depth through the current issue/article.
- Implemented as a single ScrollTrigger-linked element; under reduced motion it may remain as a static or stepwise indicator (no continuous easing required).

### 2.6 Footer reveal

- The closing colophon / open-channel footer reveals as it enters the viewport, the "back page" of the issue.

---

## 3. Section Motion

Per-section behaviors mapped to the editorial structure. Each reuses the _pattern_ from the reference benchmark's rhythm (scroll-reveal + count-up, subtle and single-purpose), never its copy, data, or code.

| Pattern                          | Where it applies                                             | Behavior                                                                                                                                         | Reduced-motion equivalent                  |
| -------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| **Masked text reveal**           | Section headlines, lead/thesis lede                          | Display serif rises/unmasks on enter                                                                                                             | Text shown in final position, no transform |
| **Count-up**                     | Verified metrics ("box score")                               | Numbers animate to final value when visible, **once**; **final value is in the HTML** (SSR) so non-JS / reduced-motion users see the real number | Final number rendered statically           |
| **Timeline draw**                | Professional engineering record                              | Connecting line/rule draws as the timeline scrolls into view                                                                                     | Full line drawn immediately                |
| **Sticky storytelling**          | Flagship system case studies                                 | Pinned panel with stepped content as the reader scrolls, **desktop only**                                                                        | Non-sticky stacked sections, normal flow   |
| **Diagram assembly**             | Interactive systems plate, architecture diagrams             | SVG/DOM nodes and connectors assemble into the diagram                                                                                           | Diagram rendered fully assembled           |
| **Paper-stack**                  | Layered cards / archive entries                              | Cards settle into a stacked composition on enter                                                                                                 | Cards in final layout, no motion           |
| **Archive sequencing**           | Earlier-work archive, milestones ledger                      | Items stagger in as the list enters                                                                                                              | All items visible at once                  |
| **Controlled horizontal record** | A marquee/record strip (e.g. releases/artifacts texture row) | Horizontal scroll/marquee with **pause-on-hover and pause-on-focus**                                                                             | **Off**, static row, no auto-scroll        |

Notes:

- Sticky storytelling is gated through `gsap.matchMedia()` to desktop breakpoints; mobile gets plain stacked flow.
- The horizontal record is the only auto-moving element; it must pause on hover and on keyboard focus, and is disabled entirely under reduced motion.
- Count-up values are authoritative in the server-rendered HTML; the animation only interpolates toward an already-correct number.

> Metric content note: any employer metrics surfaced in count-up form are **approved via Hari's resume** and must not be altered. Project metrics flagged in the audit JSON (e.g. Code Review Arena's headline detection-vs-validation gap, ContamCheckr's validation-run numbers) are **"Needs user approval"** before they appear as animated figures.

---

## 4. Signature Interaction, The Evidence Line

The single distinctive interaction of the site.

- **What it is**: a draggable SVG "signal" node riding an evidence line. Dragging the node highlights the related **claim ↔ metric ↔ system**, visually connecting a stated claim to its supporting metric and the system that produced it.
- **Lineage**: it evolves the old site's draggable logo / "wire-lit" idea into something that carries meaning (the evidence relationship) rather than decoration. _Could not verify_: the old site's source is empty (only a 1-byte README in the audited repo), so the "draggable logo / wire-lit" reference is carried from the brief, not reconstructed from source.
- **Input**: both **pointer** (drag) and **keyboard** (focusable node, arrow-key movement, activation), fully operable without a mouse.
- **Physics**: a **spring return** settles the node back to rest when released.
- **Color**: uses the signal accent (`#E34A2F`) for the lit/active state against the paper (`#F2EEE5`) / ink (`#151412`) palette.
- **Never blocks reading**: it is an enhancement layer; the underlying claims, metrics, and systems are fully readable and navigable without ever touching it.
- **Reduced motion**: **disabled or simplified**, no spring, no drag-driven motion. The claim↔metric↔system relationships are conveyed statically (e.g. always-on connecting lines or grouped layout) so the meaning survives without the interaction.

---

## 5. Microinteractions

Small, native, off-thread feedback, all via CSS transitions.

- Link underlines and nav items: hairline underline grow / ink shift on hover and focus.
- Buttons / CTAs: subtle state change on hover, active, and focus-visible.
- Cards / list rows: low-contrast lift or rule emphasis on hover.
- Form fields (open-channel/contact): focus ring and label transitions.
- Focus states are always visible and never suppressed for the sake of aesthetics.
- All durations are short (microinteraction-scale), use the project easing, and respect reduced motion by collapsing to instant state changes where motion would otherwise occur.

---

## 6. Motion Principles

Every animation must earn its place. An animation ships only if it does at least one of the following, and the dominant intent should be nameable:

1. **Establish hierarchy**, direct attention to what matters first.
2. **Explain sequence**, show the order in which things happen.
3. **Show state**, make a change of state legible (loading→ready, idle→active).
4. **Connect evidence**, tie a claim to its supporting metric/system (the Evidence Line is the purest case).
5. **Guide navigation**, orient the reader (progress, route transition, section rules).
6. **Reveal causality**, show that A produced B (diagram assembly, timeline draw).
7. **Provide feedback**, confirm an interaction registered (microinteractions).

Supporting principles:

- Motion is subtle and single-purpose, reinforcing the "turning the page" editorial metaphor, never gimmickry.
- Typography and hairline rules do the heavy lifting; motion supports the layout, it does not become the layout.
- No motion may delay access to content; content is server-rendered and present regardless of JS.
- Decorative-only motion (motion that satisfies none of the seven roles) is not shipped.

---

## 7. Reduced-Motion Strategy

Driven entirely through `gsap.matchMedia()` reading `prefers-reduced-motion: reduce`.

- **Static equivalents, not fast-forwards.** Under reduced motion the reader gets the _final composed state_ directly, full-width rules, assembled diagrams, final count-up numbers, stacked (non-sticky) storytelling, no opening sequence. There is **no fast-forwarded or accelerated replay** of the standard animation.
- The opening "Indexing" sequence is **skipped**.
- The route wipe becomes an **instant cut**.
- The horizontal record marquee is **off**.
- The Evidence Line is **disabled or simplified**, with claim↔metric↔system relationships shown statically so no meaning is lost.
- Microinteractions collapse to instant state changes.
- Because content is SSR and count-up final values live in the HTML, the reduced-motion experience is fully equivalent in information, just without movement.

---

## 8. Cleanup Discipline

- All GSAP timelines, tweens, and **ScrollTriggers are killed** on unmount via `useGSAP()` scope revert; `gsap.matchMedia()` variants self-clean on revert when breakpoints/media change.
- **`ScrollTrigger.refresh()`** is called after web fonts load and after late-loading media/layout shifts so trigger positions are measured against the final layout (display serif Newsreader, sans Manrope, mono IBM Plex Mono can reflow before refresh).
- Route changes revert the previous route's scope before the next route registers its triggers, preventing orphaned triggers from accumulating across navigation.
- No global, unscoped GSAP instances; every animation is owned by a component scope so teardown is guaranteed.

---

## Open Items (Needs User Approval / Could Not Verify)

- **Project metrics as animated figures**: Code Review Arena's detection-vs-validation headline gap, the audit_v2 "100% mutant-kill" / "fully certified" claims, any real-model leaderboard numbers, and ContamCheckr's validation-run figures (0.492 leak vs 0.008 clean, separation 0.362, etc.) are flagged in the audit JSON as needing a fresh run / Hari's approval before being shown, including as count-up targets. **Needs user approval.**
- **DebugBrief / Helm test-count figures** used as animated metrics shift with the suite and are flagged for confirmation. **Needs user approval.**
- **Old-site interaction lineage** ("draggable logo / wire-lit", dark "chaos-mode" theme, physics/sandbox canvas): the audited old-portfolio repo is empty (1-byte README), so these are carried from the brief and **could not be verified** against source. The chaos-mode dark theme and physics game are intentionally **not** carried into v2 per the brief.
- **LinkedIn URL**: not known; not referenced by any motion here, but noted as a standing **Needs user approval** input elsewhere in the project.
