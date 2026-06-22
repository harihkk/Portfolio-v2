# Implementation Plan (hardening)

Hardening pass for **The Systems Journal**, Hari Kancharla's editorial engineering portfolio (Portfolio-v2). This plan covers the work on branch `motion-content-demo-hardening`. It builds on the original phased build (see the prior `implementation-plan` history) and on the 2026-06-21 re-audit, which confirmed that all four flagship source repositories match their researched revisions with no drift.

This document is honest about scope. It marks what this pass completes and what it explicitly defers, with reasons, so the deferred work is tracked rather than silently dropped.

---

## Context

| Field             | Value                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| Branch            | `motion-content-demo-hardening`                                                                          |
| Portfolio-v2 HEAD | `6ad90b2e73f770005ab41a112db0ecdbdab74825`                                                               |
| Stack             | Next.js 16 App Router, React 19, TypeScript (strict), Tailwind v4, GSAP                                  |
| Subject           | Hari Krishna Kancharla (masthead: "Hari Kancharla"), AI Systems Engineer, Boston, MA                     |
| Hard rule         | No em dashes anywhere in tracked content. Use periods, commas, colons, parentheses, or ordinary hyphens. |
| Source of truth   | Committed artifacts in the four flagship repos, read at the pinned SHAs below.                           |

### Pinned source revisions (re-audit 2026-06-21, no drift)

| Repo                     | SHA                                        |
| ------------------------ | ------------------------------------------ |
| Portfolio-v2 (this site) | `6ad90b2e73f770005ab41a112db0ecdbdab74825` |
| code-review-arena        | `656b40187cb14321c2734bbec23e44c6e47131db` |
| Helm-browser-agent       | `784af0a7998b90898a7d4bd4d11ee0ac62ace3db` |
| Debug-Brief              | `d5c1df6f4263f25c4142fd5e93c511b1cfed78bd` |
| contamination-checker    | `fbbc85ebab0515f8431d042a2740f8db22c4ee01` |

Demo fixtures shown on the site are derived from files committed to these repos at these exact SHAs. They are read from committed artifacts, not regenerated at request time and not invented.

---

## Phases at a glance

| #   | Phase                                             | Status                                                           |
| --- | ------------------------------------------------- | ---------------------------------------------------------------- |
| 0   | Audit (re-audit and drift check)                  | Done                                                             |
| 1   | Copy gate (em-dash ban)                           | This pass                                                        |
| 2   | Balanced grid                                     | This pass                                                        |
| 3   | Fail-open and transform-only motion hot paths     | This pass                                                        |
| 4   | Content rewrite to first person, simpler headings | This pass                                                        |
| 5   | Demo accuracy from committed fixtures             | This pass                                                        |
| 6   | Social channel config                             | This pass                                                        |
| 7   | Route curtain                                     | This pass                                                        |
| 8   | Verification                                      | This pass (local gates), partly deferred (browser-runtime gates) |

---

## Phase 0, Audit (DONE)

**Status: complete.** The re-audit on 2026-06-21 used `git ls-remote` against each public repo to read the latest published HEAD, then a shallow clone to inspect committed artifacts. Result: all five revisions match the researched revisions exactly, no drift. Recorded in `docs/source-revisions.md`.

Key committed artifacts that ground the site:

| Flagship              | Committed artifact(s)                                    |
| --------------------- | -------------------------------------------------------- |
| code-review-arena     | `dashboard/public/reports/audit-v1.json`                 |
| Helm-browser-agent    | `core/action_registry.py`                                |
| Debug-Brief           | `examples/sample-pr.md`, `docs/demo.tape`                |
| contamination-checker | `experiments/results/*.json`, `docs/example_report.json` |

---

## Phase 1, Copy gate (em-dash ban)

**Goal:** make the no-em-dash rule a build-enforced gate, not a convention.

### What this pass completes

- Ship `scripts/check-copy.mjs` as a pure-detector plus CLI. It walks `app`, `components`, `content`, `lib`, `public`, `scripts` over the relevant extensions and fails on the em dash (U+2014) and its HTML entities (`&mdash;`, `&#8212;`, `&#x2014;`).
- Wire `npm run check:copy` into the aggregate `npm run verify` chain, ahead of lint and typecheck, so a banned character fails the build.
- Cover the detector with a unit test (the `scanText` export is imported by `tests/unit`).

### Exit criteria

- `npm run check:copy` passes and reports the file count scanned.
- The gate is part of `verify` and blocks release on any violation.

---

## Phase 2, Balanced grid

**Goal:** even out the section and card layouts so dense and exhale regions read as a deliberate editorial rhythm rather than ragged blocks.

### What this pass completes

- Normalize the metric and card grids (`components/editorial/MetricGrid.tsx`, the systems and archive grids) so columns balance across breakpoints and hairline rules align.
- Keep the near-monochrome editorial palette (paper, ink, signal) and the masthead conceit intact; this is layout balancing, not a redesign.

### Exit criteria

- Grids align on the hairline system at the supported breakpoints with no orphaned single-item rows where a balanced layout is possible.
- No layout shift introduced; build and typecheck stay green.

---

## Phase 3, Fail-open and transform-only motion hot paths

**Goal:** motion must never hide content and must stay cheap on the main thread.

### What this pass completes

- **Fail-open reveals.** The reveal wrapper carries `data-reveal` and its hidden start state is armed by an inline script before paint, so when JavaScript is off or motion is reduced, content is fully visible (no flash, no trapped-hidden content). See `components/motion/Reveal.tsx` and `components/motion/MotionProvider.tsx`.
- **Reduced-motion honored everywhere.** `prefersReducedMotion()` in `lib/motion.ts` short-circuits reveals, the opening sequence, count-ups, and the route template to their final state.
- **Transform-only hot paths.** Scroll-triggered reveals and the route transition animate opacity and transform (translate/scale) only, avoiding layout-affecting properties on the animation hot path. `ScrollTrigger` is refreshed after fonts settle so trigger positions stay correct.

### What is deferred (and why)

| Deferred                                                             | Reason                                                                                                                                                                                                          |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full Execution Trace sticky storytelling                             | Larger interaction design effort; the current reveal and count-up motion is sufficient and stable for this pass. Scoped out to keep the hardening pass focused on correctness rather than new narrative motion. |
| Motion visual baselines (screenshot regression for animation states) | Requires a stable browser-runtime baseline and review of acceptable diffs; not run in this environment. Deferred to a machine with a browser runtime.                                                           |
| Full performance recording (frame-by-frame profiling of motion)      | Requires a real device and profiler; not reproducible here. Deferred.                                                                                                                                           |

### Exit criteria

- With `prefers-reduced-motion: reduce`, the opening sequence is skipped and content shows immediately (covered by `e2e/interactions.spec.ts`).
- No reveal can leave content permanently hidden when JS is disabled.

---

## Phase 4, Content rewrite to first person, simpler headings

**Goal:** tighten the voice to first person and simplify headings, without inventing facts.

### What this pass completes

- Rewrite prose to first person where the third-person framing read stiff, keeping every metric, name, date, and claim traceable to the committed artifacts and canonical facts.
- Simplify section headings to plain noun phrases.
- Keep the ownership distinction sharp: the Research Desk surfaces external papers Hari engages with, not papers authored by Hari. External arXiv papers are never presented as Hari's publications.
- All rewritten copy passes the Phase 1 copy gate (no em dashes).

### Exit criteria

- No fabricated facts introduced; counts and statuses still match the provenance ledger.
- Copy gate, lint, and typecheck stay green.

---

## Phase 5, Demo accuracy from committed fixtures

**Goal:** every interactive demo reflects the committed artifacts exactly, including the executable-vs-planner distinction.

### Per-flagship accuracy targets

**Code Review Arena** (from `dashboard/public/reports/audit-v1.json`, generated 2026-06-18, 10 cases):

| Case                    | detection | validated | apply | tests   | structural | primary failure    |
| ----------------------- | --------- | --------- | ----- | ------- | ---------- | ------------------ |
| reference-patch         | 1.000     | 1.000     | 1.000 | 1.000   | 1.000      | none               |
| control:perfect_patch   | 1.000     | 1.000     | 1.000 | 1.000   | 1.000      | none               |
| control:keyword_gamer   | 1.000     | 0.000     | 1.000 | 0.000   | 0.000      | tests_failed       |
| control:bad_patch       | 1.000     | 0.000     | 1.000 | 0.000   | 0.000      | tests_failed       |
| control:malformed_patch | 1.000     | 0.000     | 0.000 | not run | not run    | patch_apply_failed |

Aggregate failure modes: tests_failed 30, structural_validation_failed 30, patch_apply_failed 10. Case studies include `security_fastapi_multitenant_admin_bypass_001`. The demo must score detection separately from validated repair, so a "names the bug but the patch fails tests" case reads as detection 1.000 and validated 0.000.

**Helm Browser Agent** (from `core/action_registry.py`):

This is the most important accuracy fix in the pass. The engine actions and the planner concepts must not be conflated.

| Class                                                | Members                                                                                                                                                                                      |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Executable engine actions                            | `navigate`, `click`, `type`, `press_key`, `select`, `scroll`, `wait`, `extract`, `done`, plus higher-level executable workflows such as `open_top_github_repo` and `add_amazon_item_to_cart` |
| Non-executable planner concepts (`executable=False`) | `search_web`, `site_search`, `observe_page`, `extract_text`, `select_option`, `wait_for_selector`, `validate_url`, `validate_text_visible`, `report_blocker`, `recover_from_error_page`      |

Action statuses: `pending`, `executing`, `completed`, `failed`, `cancelled`, `blocked`, `unverified`.

Required corrections:

- Do not present `search` or `read_text` (the planner concepts `search_web` / `extract_text`) as executable engine actions. The current `HelmDemo` uses `search` and `read_text` as if they were engine actions; these must be reframed as planner concepts or replaced with the real executable actions (for example `navigate`, `type`, `extract`).
- The clone URL in the Helm README is stale. The real repository is `github.com/harihkk/Helm-browser-agent`. Link the real repo only.

**DebugBrief** (from `examples/sample-pr.md`):

- Command `python -m pytest -q test_calc.py`, exit 1 then exit 0 after editing `calc.py`, across 2 attempts. The file `calc.py` changed (correlation, not proven cause).
- Sections present: Summary, Session metadata, Reproduce and verify, Red to green, Modified files, Timeline, Verification and tests, Failed attempts.
- The brief involves no AI, no network access, and no inferred root cause. The demo must not imply any of those.

**ContamCheckr** (from `experiments/results/*.json` and `docs/example_report.json`). Method weights: guided 0.5, Min-K%++ 0.3, order 0.2, renormalized over the active methods.

| Scenario | Report                     | Index  | Band              | CI              | guided | minkpp      | order | Notes                                                   |
| -------- | -------------------------- | ------ | ----------------- | --------------- | ------ | ----------- | ----- | ------------------------------------------------------- |
| A        | contaminated_on_leak       | 0.492  | moderate evidence | [0.354, 0.492]  | 0.0    | 1.0         | 0.962 | minkpp AUC 1.0, order p 0.038, 40 examples, 40 controls |
| B        | contaminated_on_clean      | 0.0077 | low evidence      | [0, 0.103]      | 0      | 0           | 0.038 |                                                         |
| C        | base_on_leak               | 0.131  | low evidence      | [0.0077, 0.170] | 0      | 0           | 0.654 |                                                         |
| D        | example_report.json (GLUE) | 0.2747 | moderate evidence | [0, 0.2747]     | n/a    | unavailable | n/a   | 10 examples, Min-K%++ unavailable (no matched control)  |

The output is a caveated evidence score with low/moderate/high bands and a confidence interval, not a binary verdict. Scenario D must show Min-K%++ as unavailable because there is no matched control.

### What is deferred (and why)

| Deferred                                                                     | Reason                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full demo state-machine (formal, exhaustive states and transitions per demo) | The demos are code-split, fixture-backed walkthroughs with a reset control. A formal state machine is a larger rework that is not needed for fixture accuracy in this pass. Deferred.                                                     |
| Exhaustive Playwright matrix per demo                                        | This pass covers the critical interactions (reset control present, keyboard-operable controls, reduced-motion path). Full per-demo, per-state Playwright coverage is deferred to keep the pass scoped to accuracy and the critical paths. |

### Exit criteria

- Each demo's surfaced numbers, bands, statuses, and action vocabulary match the committed fixtures in the tables above.
- Helm planner concepts are no longer presented as engine actions; only the real Helm repo is linked.
- Demos expose a reset control and remain keyboard operable (covered by `e2e/interactions.spec.ts`).

---

## Phase 6, Social channel config

**Goal:** render only verified, configured channels. Never invent a link, never leak the phone number.

### What this pass completes

- Contact channels live in one place (`lib/site.ts`). Email and GitHub are published; the resume PDF is linked.
- LinkedIn renders only when a real URL is supplied. It is empty by default and hidden from the UI until set; no invented URL.
- Substack is surfaced only when `NEXT_PUBLIC_SUBSTACK_URL` is configured; hidden otherwise.
- The phone number exists on the resume but is intentionally omitted from this file entirely so it cannot leak through the bundle.
- Any channel with an empty `href` is treated as not configured and is not rendered broken.

### Exit criteria

- No unverified or unconfigured link is ever rendered (LinkedIn, Substack).
- The phone number appears nowhere in the build output.

---

## Phase 7, Route curtain

**Goal:** a subtle page-transition curtain on client navigations that never blocks content or first paint.

### What this pass completes

- The route template (`app/template.tsx`) skips the very first paint to avoid an initial-load flicker, then animates only on subsequent client navigations with a short opacity-and-translate transition.
- Under reduced motion, the transition collapses to the final state immediately.
- Pairs with the first-session-only opening sequence (`components/motion/OpeningSequence.tsx`), which only mounts after hydration so no-JS users never see an overlay and content is server-rendered underneath.

### Exit criteria

- No transition blocks server-rendered content or delays first paint.
- Reduced motion fully bypasses the curtain.

---

## Phase 8, Verification

**Goal:** prove correctness, accessibility, and content integrity before ship, and be explicit about which gates run in this environment.

### Gates

| Gate                 | Tool                     | Runs in this environment?  |
| -------------------- | ------------------------ | -------------------------- |
| Format check         | Prettier `--check`       | Yes                        |
| Copy gate            | `scripts/check-copy.mjs` | Yes                        |
| Lint                 | ESLint                   | Yes                        |
| Typecheck            | `tsc --noEmit` (strict)  | Yes                        |
| Unit tests           | Vitest                   | Yes                        |
| Build                | `next build`             | Yes                        |
| E2E (critical paths) | Playwright               | Requires a browser runtime |
| Content integrity    | Manual checklist         | Yes                        |

The aggregate command is `npm run verify`: `format:check` then `check:copy` then `lint` then `typecheck` then `test` then `build`.

### Content-integrity checklist (this pass)

- No fabricated metrics, publications, awards, or social links.
- Phone number absent from the build.
- ContamCheckr never implied to be on a package registry; it produces a caveated evidence score, not a binary verdict.
- Helm planner concepts (`search_web`, `extract_text`, and the rest) not presented as executable engine actions; only `github.com/harihkk/Helm-browser-agent` linked.
- Research Desk papers framed as external, not authored by Hari.
- Masthead "Hari Kancharla" and legal name "Hari Krishna Kancharla" both present and correct.

### What is deferred (and why)

| Deferred                                            | Reason                                                                                                                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Full Playwright e2e run and exhaustive matrix       | Playwright needs a browser runtime that is not available in this environment. Documented as run-instructions (`npm run test:e2e`) to run on a machine with a browser before release. |
| Firefox and WebKit cross-browser checks             | Same browser-runtime constraint. The Playwright config targets these projects but they are not executed here. Deferred.                                                              |
| Lighthouse (performance, a11y, best-practices, SEO) | Requires a browser runtime and a running server. Deferred to a machine with a browser.                                                                                               |
| Motion visual baselines                             | Requires a stable browser-runtime baseline; see Phase 3. Deferred.                                                                                                                   |
| Full performance recording                          | Requires a real device and profiler; see Phase 3. Deferred.                                                                                                                          |

### Exit criteria

- All locally runnable gates pass under `npm run verify`.
- Browser-runtime gates are documented as run-instructions with a clear owner and thresholds, to be run before release.
- The content-integrity checklist is fully satisfied.

---

## Summary: completed vs deferred

| This pass completes                                                          | Deferred (with reason above)                             |
| ---------------------------------------------------------------------------- | -------------------------------------------------------- |
| Copy gate wired into `verify`                                                | Full Execution Trace sticky storytelling                 |
| Balanced grid                                                                | Full demo state-machine and exhaustive Playwright matrix |
| Fail-open, transform-only, reduced-motion-safe motion hot paths              | Motion visual baselines                                  |
| First-person content rewrite, simpler headings                               | Firefox and WebKit cross-browser checks                  |
| Demo accuracy from committed fixtures (including Helm planner-vs-engine fix) | Lighthouse run                                           |
| Social channel config (no invented links, no phone leak)                     | Full performance recording                               |
| Route curtain                                                                | Full Playwright e2e run                                  |
| Local verification gates                                                     | Browser-runtime gates (documented as run-instructions)   |
