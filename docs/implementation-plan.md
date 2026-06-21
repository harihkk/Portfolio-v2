# Implementation Plan

Phased build plan for **The Systems Journal**, Hari Kancharla's editorial engineering portfolio, grounded in the verified audit of 2026-06-21.

---

## Overview

| Field | Value |
| --- | --- |
| Project | The Systems Journal (portfolio v2) |
| Subject | Hari Krishna Kancharla (masthead: "Hari Kancharla"), AI Systems Engineer, Boston, MA |
| Tagline | "Building AI systems that have to prove they work." |
| Stack | Next.js 16 App Router · React 19 · TypeScript (strict) · Tailwind v4 · GSAP |
| Palette | Paper `#F2EEE5` · Ink `#151412` · Signal `#E34A2F` |
| Type | Newsreader (serif) · Manrope (sans) · IBM Plex Mono (mono) |
| Hard constraints | No photo · no video · no fabricated social/awards/publications · no physics game · no dark-only hacker theme |
| Source of truth | Canonical verified facts + `docs/audit/raw-audit-2026-06-21.json` |

The plan runs in six phases. Phase 1 (Audit) is complete; the remaining phases build forward from its findings. Every metric, name, date, and claim in the built site must trace to the audit JSON or the canonical facts, anything else is blocked pending user approval (see [Blocked / Needs User Input](#blocked--needs-user-input)).

---

## Phase 1, Audit (DONE)

**Status: Complete.** Summary of what was produced and verified, captured in `docs/audit/raw-audit-2026-06-21.json`.

### What was done
- **Flagship repos audited and verified** (four systems): architecture, execution flow, test counts, CI, packaging, and limitations were extracted directly from source.
  - **Code Review Arena** (`harihkk/code-review-arena`), 306 test functions / 37 files; 30 benchmark cases (3 packs × 10); 5-job CI; Python 3.11+; v0.1.0; MIT; **not** published to a registry.
  - **Helm Browser Agent** (`harihkk/Helm-browser-agent`, product "Helm"), 192 test functions / 16 files (40 SSRF tests); Groq → Gemini → Ollama cascade; SSRF guard; v0.2; MIT per README; **not** packaged.
  - **DebugBrief** (`harihkk/Debug-Brief`, product "DebugBrief"), 376 test functions / 29 files; CI matrix Linux + macOS × Python 3.9-3.14; **published on PyPI** as `debugbrief` v1.3.0 (releases v1.1.0-v1.3.0); MIT.
  - **ContamCheckr** (`harihkk/contamination-checker`), 30 test functions / 7 files; caveated evidence score (low/moderate/high bands), not a binary verdict; **no CI**; **not on PyPI** (confirmed 404); v0.1.0; MIT.
- **Earlier work catalogued and triaged**: Prompt-Budd (live at https://promtbud.com/, 200 OK, strongest secondary), AskRC (historical/academic, last work Dec 2024), GenBI (API-only prototype), Visioncraft (ambitious, boilerplate README, Feb 2025), self-healing-pipeline (prototype; unverified "85%+/production-grade" claims to be dropped), weather-dashboard (omit / lowest prominence). Forks (`langgraph`, `litellm`, `MLOps`) excluded.
- **Old portfolio inspected**: `harihkk.github.io` source is effectively empty (single 1-byte README; no recoverable stack, design, or copy). The only surviving voice artifact is the GitHub bio.
- **Content conflicts logged** (old site vs resume): Surf → Helm rename; stale clone URL; Helm license discrepancy; Infinite Infolab title; unconfirmed KL University / Rlogical entries; ContamCheckr-not-on-PyPI; old dark "chaos-mode" theme not carried forward. See [Conflict Log](#content-conflict-log).
- **Reference benchmark mapped**: `shivanshgupta.com` analysed as a quality benchmark only; a section-by-section parity mapping and an explicit do-not-copy caution list were recorded (audit JSON `reference`).
- **Research surfaced**: 15 arXiv papers verified via the arXiv API, each tied to a flagship system or topic, the basis for the external Research Desk.

### Deliverables
- `docs/audit/raw-audit-2026-06-21.json` (verified facts; the downstream source of truth).
- This implementation plan.

### Exit criteria (met)
- Every flagship fact traceable to source. ✅
- Conflicts logged, not silently resolved. ✅
- Reference parity mapping and copy/asset cautions recorded. ✅

---

## Phase 2, Foundation

**Goal:** Stand up a strict, reproducible Next.js 16 project skeleton with the design system encoded as tokens, plus the content layer that will feed every section.

### Tasks
- Initialize Next.js 16 (App Router) + React 19 + TypeScript in `strict` mode.
- Configure Tailwind v4 with design tokens: paper `#F2EEE5`, ink `#151412`, signal `#E34A2F`; hairline border tokens; type scale via `clamp()`.
- Wire fonts: Newsreader (serif display/body), Manrope (sans), IBM Plex Mono (mono) via `next/font`.
- Establish a typed content layer (TypeScript modules or MDX with typed frontmatter) for: flagship systems, earlier work, professional record, metrics, research desk, milestones. Source all content from the audit JSON / canonical facts.
- Set up linting (ESLint + Tailwind plugin), Prettier, and `tsc --noEmit` typecheck.
- Configure the test runner (unit) and a Playwright project (e2e), scaffolded now, exercised in Phases 5-6.
- Add the npm scripts (see [Quality Gates & Scripts](#quality-gates--npm-scripts)).
- Add base accessibility scaffolding (semantic landmarks, skip link, focus-visible styles).

### Deliverables
- Buildable, type-clean skeleton with tokens and fonts.
- Typed content models with placeholder-free seed data drawn from the audit.
- Project-wide lint/format/typecheck configuration.

### Exit criteria
- `npm run lint`, `npm run typecheck`, and `npm run build` all pass on an empty-but-structured app.
- Design tokens render correctly in light editorial palette; no dark-only theme.
- Content schema compiles and rejects unknown fields.

---

## Phase 3, Static Editorial Build

**Goal:** Build every section as static, content-complete, accessible markup, the full "issue" of The Systems Journal with no motion yet. This is where the parity mapping is realised, in our own copy and components.

### Sections (mapped from the reference parity table; original copy and components only)

| Systems Journal section | Role | Content source |
| --- | --- | --- |
| **Masthead + Nav** | Institutional nameplate: "The Systems Journal" wordmark, Vol./No./Issue line, "Est." + live date, hairline rules | Original; date stamp generated |
| **Engineering thesis (Lead Story)** | One front-page lede stating Hari's engineering thesis | Tagline + canonical identity |
| **Interactive systems plate (hero)** | Oversized name + an interactive system/architecture visualization, **NO photo** | Flagship architecture (audit) |
| **Verified metrics (by-the-numbers)** | Scannable box score; every number verified with provenance | See note below |
| **Systems Journal index** | Table-of-contents / engineering-frontiers taxonomy | Original domains |
| **Professional engineering record** | Employers, scope, ownership grid | Resume (canonical) |
| **Evaluation / benchmark record** | Results against named benchmarks, archival register | Flagship benchmark facts (audit) |
| **Research Desk** | EXTERNAL papers Hari engages with, explicitly **not** authored by Hari | 15 verified arXiv papers (audit) |
| **Flagship systems + archive** | Deep case studies (4 flagships) + lighter archive of smaller builds | Audit flagships + earlier work |
| **Releases / packages / CI / artifacts** | Engineering social proof grid | Audit packaging/CI facts |
| **Interactive demonstrations** | Live playgrounds / system walkthroughs | Built artifacts only |
| **Verified milestones** | Shipped-at-scale moments, acceptances, with provenance | Audit + resume |
| **Build artifacts gallery** | Architecture diagrams, dashboards (no personal photos) | Self-produced imagery |
| **Notes / Substack** | Newsletter/notes, **only if real content exists** | Blocked (see below) |
| **Open channel (Contact)** | Closing CTA / colophon | Canonical contact |

### Per-system case-study content (verified)

| System | One-liner basis | Verified facts to surface | License | Distribution |
| --- | --- | --- | --- | --- |
| Code Review Arena | Execution-backed code-review benchmark; scores detection separately from validated repair | 306 tests / 37 files; 30 cases (3×10); 5-job CI; Python 3.11+ | MIT | Not on a registry (v0.1.0), state as such |
| Helm | Bounded perceive→decide→act browser runtime; completion only on visible-page evidence | 192 tests / 16 files (40 SSRF); Groq→Gemini→Ollama cascade; SSRF guard; v0.2 | MIT per README (flag for confirmation) | Not packaged; link real repo `harihkk/Helm-browser-agent` (clone URL in README is stale) |
| DebugBrief | Local-first, AI-free CLI turning a debugging session into an evidence-only Markdown brief | 376 tests / 29 files; CI Linux+macOS × Py 3.9-3.14 | MIT | **Published on PyPI** `debugbrief` v1.3.0 |
| ContamCheckr | Local CPU-friendly auditor producing a caveated evidence score (low/moderate/high), not a binary verdict | 30 tests / 7 files; no CI; v0.1.0 | MIT | **Not on PyPI** (404), never imply otherwise |

### Tasks
- Build all sections above as server components with semantic, accessible HTML.
- Render flagship case studies, earlier-work archive (Prompt-Budd highest, weather-dashboard omitted/lowest), and the external Research Desk.
- Implement the masthead conceit (Vol./No./Est./live date) consistently.
- Hero = interactive systems plate placeholder component (static render now; interaction in Phase 4).
- GitHub bio refined for voice: source line "i run on coffee. the code barely runs.", refine, do not invent new voice.
- Ensure NO photo, NO video, NO fabricated social/awards/publications anywhere.

### Deliverables
- Content-complete static site, all sections present, all copy original.
- Provenance notes attached to every metric and claim.

### Exit criteria
- All sections render with verified content; zero placeholder/lorem text.
- No fabricated data; no copied copy/assets from the reference (independently reimplemented).
- Passes axe/manual a11y checks on static markup; lint + typecheck + build green.

> **Verified-metrics note:** Employer metrics (Morgan Stanley and Infinite Infolab figures) come from Hari's own public resume and are therefore "approved via resume", their numbers must never be altered. However, **public display** of these employer metrics on the live site is approval-gated (see [Blocked](#blocked--needs-user-input)). System metrics (test counts, case counts, CI jobs) are audit-verified and display-ready, though headline benchmark gap figures (e.g. Code Review Arena's detection-vs-validation numbers) must be re-derived from a fresh run before publishing.

---

## Phase 4, Motion

**Goal:** Add subtle, single-purpose GSAP motion that reinforces the "turning the page" editorial metaphor, never gimmicky.

### Tasks
- Scroll-triggered count-up on the verified-metrics box score (numbers animate to their verified values).
- Section-heading entrance transitions (opacity + small translate/scale) revealed on scroll behind hairline rules.
- Interactive hero systems plate: live diagram/canvas of an architecture or data flow (the visual proof is a system, not a face).
- Respect `prefers-reduced-motion`: all entrance/count-up animations degrade to instant final state.
- Keep motion subtle, single-purpose, and consistent with the masthead conceit; no physics sandbox, no chaos-mode theme.

### Deliverables
- GSAP-driven scroll reveals and count-ups wired to verified data.
- Reduced-motion fallbacks.

### Exit criteria
- Motion runs at 60fps on a mid-range device; no layout shift from animations.
- `prefers-reduced-motion: reduce` fully honored.
- Count-up targets read from verified metric values, not hardcoded reference figures.

---

## Phase 5, Integrations

**Goal:** Wire live data sources with graceful, deterministic fallbacks so the site is never blank or wrong if a source is down.

### GitHub
- Pull repo metadata (stars, last commit, release tags) for the four flagships + Prompt-Budd from the GitHub API.
- **Fallback:** statically cached values from the audit JSON if the API fails or rate-limits.
- Link the **real** Helm repo (`harihkk/Helm-browser-agent`); ignore the stale `Helm-agentic-browser.git` clone URL in the README.

### PyPI / releases
- Surface DebugBrief's PyPI presence (`debugbrief` v1.3.0) in the Releases/packages grid.
- ContamCheckr, Code Review Arena, and Helm are **not** distributed on a registry, present them as source/CI artifacts only; never imply a PyPI listing for ContamCheckr.

### arXiv (Research Desk)
- Render the 15 verified papers from the audit as the external reading desk, clearly framed as papers Hari engages with, **not** authored by Hari.
- Optionally refresh metadata via the arXiv API; **fallback:** the verified audit snapshot (already API-verified).

### Substack (Notes / Newsletter)
- **Could not verify:** no Substack/newsletter URL is in the audit or canonical facts. Section is **optional** and stays hidden until a real feed is supplied. Do not invent a feed. (See [Blocked](#blocked--needs-user-input).)

### Contact (Open channel)
- Publish email `harikrishnak2426@zohomail.com` and GitHub `github.com/harihkk`.
- **Never publish the phone number** (it exists on the resume but is not for publication).
- LinkedIn URL is **not known**, do not invent one; render only when supplied.
- If a contact form is built, its email-provider keys are **blocked** pending user input; until then, use a `mailto:` link as the no-key fallback.

### Deliverables
- Live integrations with cached fallbacks for GitHub, PyPI, arXiv.
- Contact channel with safe defaults; newsletter gated behind real content.

### Exit criteria
- Every integration degrades to a verified static fallback with no error state visible to users.
- No unpublished/unverified link is ever rendered (LinkedIn, Substack, phone).
- Contact renders correctly with or without provider keys.

---

## Phase 6, Verification (Quality Gates)

**Goal:** Prove the site meets correctness, accessibility, performance, and content-integrity bars before ship.

### Tasks
- Run the full local gate suite (lint, typecheck, unit tests, build).
- Run Playwright e2e across the critical paths (nav, section rendering, integration fallbacks).
- Run Lighthouse (performance, a11y, best-practices, SEO) and cross-browser checks.
- Content-integrity pass: confirm no fabricated metrics/publications/awards/social; confirm phone number absent; confirm ContamCheckr not implied on PyPI; confirm Research Desk papers are framed as external.
- Confirm SEO name "Hari Krishna Kancharla" and masthead "Hari Kancharla" are both present and correct.

### Deliverables
- Green local gate run.
- Documented e2e / Lighthouse / cross-browser results (or run-instructions where not executable, see note).

### Exit criteria
- All gates in the table below pass (or are documented as run-instructions with a clear owner).
- Content-integrity checklist fully satisfied.

> **Browser-runtime note:** Playwright e2e, Lighthouse, and cross-browser testing require a browser runtime. If this environment lacks one, these gates are documented as **run-instructions** (commands + expected thresholds) rather than executed here, and must be run on a machine with a browser before release.

---

## Quality Gates & npm Scripts

### Gate list

| Gate | Tool | Blocks release? | Executable here? |
| --- | --- | --- | --- |
| Lint | ESLint + Tailwind plugin + Prettier check | Yes | Yes |
| Typecheck | `tsc --noEmit` (strict) | Yes | Yes |
| Unit tests | test runner | Yes | Yes |
| Build | `next build` | Yes | Yes |
| E2E | Playwright | Yes | Browser runtime required, else run-instructions |
| Performance / a11y | Lighthouse | Yes | Browser runtime required, else run-instructions |
| Cross-browser | Playwright/manual | Yes | Browser runtime required, else run-instructions |
| Content integrity | Manual checklist | Yes | Yes |
| Reduced-motion | Manual / automated check | Yes | Yes |

### npm scripts

| Script | Purpose |
| --- | --- |
| `npm run lint` | ESLint + Prettier + Tailwind lint |
| `npm run typecheck` | `tsc --noEmit` under strict mode |
| `npm run test` | Unit test suite |
| `npm run test:e2e` | Playwright end-to-end suite |
| `npm run build` | Production `next build` |
| `npm run verify` | Aggregate gate: lint → typecheck → test → build (+ e2e where a browser runtime is available) |

---

## Content Conflict Log

Conflicts surfaced in the audit. Logged, never silently resolved.

| # | Conflict | Resolution / status |
| --- | --- | --- |
| 1 | Helm was "Surf" on the old site | Use **Helm Browser Agent**; link real repo `harihkk/Helm-browser-agent`. README clone URL `Helm-agentic-browser.git` is **stale**, do not use. |
| 2 | Helm license: GitHub API reported none; README states MIT | Treat as **MIT per README/author**; flag for confirmation. |
| 3 | Infinite Infolab title: old site "Software Engineer, Machine Learning" vs resume "Machine Learning Engineer" | **Resume wins** → Machine Learning Engineer. |
| 4 | Old site listed KL University (Research Assistant) and Rlogical Techsoft (Research Intern), not on resume | **Do not publish** as professional experience without Hari's approval. Northeastern confirmed via git email; KL University undergrad details unconfirmed. |
| 5 | ContamCheckr not on PyPI (only DebugBrief is) | **Never imply** ContamCheckr is on PyPI. |
| 6 | Old site had dark "chaos-mode" theme + physics/sandbox canvas | **Intentionally not carried** into v2 (brief forbids physics game / dark-only hacker theme as the primary experience). |

---

## Blocked / Needs User Input

The following are required to complete the site and **cannot be guessed**. Each is flagged where it surfaces above.

| Item | Status | Needed for |
| --- | --- | --- |
| **LinkedIn URL** | **Needs user approval**, not known; do not invent | Contact / open channel |
| **Substack / newsletter URL** | **Could not verify**, no feed in audit or canonical facts; section hidden until supplied | Notes / Newsletter section |
| **Contact email provider keys** | **Needs user input**, required only if a server-side contact form is built; `mailto:` fallback used otherwise | Contact form (optional) |
| **Employer-metric public-display approval** | **Needs user approval**, Morgan Stanley & Infinite Infolab resume metrics are sourced/approved-via-resume, but public display on the live site must be approved; numbers must never be altered | Verified-metrics box score |
| **KL University / undergrad details** | **Could not verify**, degree, dates, and role unconfirmed; not on current resume | Education / professional record (do not publish without approval) |
| **Helm license confirmation** | **Needs user approval**, MIT assumed per README; GitHub API reported none | Helm case study license line |
| **Headline benchmark figures (e.g. Code Review Arena detection-vs-validation gap)** | **Needs re-derivation** from a fresh run before publishing | Evaluation / benchmark record |

---

## Reference Discipline

`shivanshgupta.com` is a **quality benchmark only**. Borrow the *rhythm*, typographic hierarchy, hairline section rules, dense-vs-exhale pacing, subtle scroll-reveal + count-up motion, near-monochrome editorial palette, and the masthead (Vol./No./Est./live-date) conceit. **Never** copy its code, Tailwind class strings, `clamp()` values, color/border token names, reveal keyframes, component structure, copy, assets, data/figures, or credentials. Crucially: their Publications are self-authored, but **our Research Desk surfaces EXTERNAL papers**, keep that ownership distinction sharp to avoid implying false authorship.
