# Demo Audit

Audit of the four interactive demo components in Portfolio-v2 against the committed source data of the underlying repositories. The goal is to flag any demo fixtures that diverge from the real, committed outputs, then specify the corrected fixtures and the source path each value must trace back to.

Re-audit date: 2026-06-21. The latest repository SHAs match the researched revisions exactly, with no drift.

## Audited revisions

| Component          | Repository            | HEAD SHA                                 |
| ------------------ | --------------------- | ---------------------------------------- |
| Portfolio-v2       | Portfolio-v2          | 6ad90b2e73f770005ab41a112db0ecdbdab74825 |
| Code Review Arena  | code-review-arena     | 656b40187cb14321c2734bbec23e44c6e47131db |
| Helm Browser Agent | Helm-browser-agent    | 784af0a7998b90898a7d4bd4d11ee0ac62ace3db |
| DebugBrief         | Debug-Brief           | d5c1df6f4263f25c4142fd5e93c511b1cfed78bd |
| ContamCheckr       | contamination-checker | fbbc85ebab0515f8431d042a2740f8db22c4ee01 |

## Demo files in this repo

| Demo               | File                                               |
| ------------------ | -------------------------------------------------- |
| Code Review Arena  | `components/systems/demos/CodeReviewArenaDemo.tsx` |
| Helm Browser Agent | `components/systems/demos/HelmDemo.tsx`            |
| DebugBrief         | `components/systems/demos/DebugBriefDemo.tsx`      |
| ContamCheckr       | `components/systems/demos/ContamCheckrDemo.tsx`    |

## Summary of findings

| Demo               | Status       | Severity | Issue                                                                                                                                                                                                        |
| ------------------ | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ContamCheckr       | Fails audit  | High     | Method signals, combined index, CI, and bands use invented values (0.41 / 0.58 / 0.22 / index derived, CI 0.08) that do not appear in any committed report. Must be replaced with committed scenario values. |
| Helm Browser Agent | Fails audit  | High     | Demo lists `search` and `read_text` as engine actions. Neither is an executable action in the real registry. Must use real executable action names.                                                          |
| Code Review Arena  | Passes audit | Low      | Scored axes and narrative match `audit-v1.json`. One optional accuracy note below.                                                                                                                           |
| DebugBrief         | Passes audit | Low      | Session and brief match `sample-pr.md`. Command string differs cosmetically from the canonical form; see note.                                                                                               |

---

## 1. ContamCheckr (fails audit)

Source of truth: committed scenario reports in the contamination-checker repository.

### Current state in the demo

`components/systems/demos/ContamCheckrDemo.tsx` hardcodes a `METHODS` table with invented per-method signals and a fixed confidence interval:

| Method          | Demo weight | Demo signal | Committed value? |
| --------------- | ----------- | ----------- | ---------------- |
| Guided overlap  | 0.5         | 0.41        | No, invented     |
| Min-K%++        | 0.3         | 0.58        | No, invented     |
| Canonical order | 0.2         | 0.22        | No, invented     |

The demo also hardcodes `CI = 0.08`, which is invented, and computes the combined index from the invented signals. None of `0.41`, `0.58`, `0.22`, or `0.08` appear in any committed report.

### Verified facts (committed reports)

The base weights are correct as displayed (guided 0.5, Min-K%++ 0.3, order 0.2, renormalized over active methods). The per-scenario signals, combined index, band, and CI must come from the committed scenarios:

| Scenario                      | Index  | Band              | CI              | Guided | Min-K%++                         | Order           |
| ----------------------------- | ------ | ----------------- | --------------- | ------ | -------------------------------- | --------------- |
| A: contaminated_on_leak       | 0.492  | moderate evidence | [0.354, 0.492]  | 0.0    | 1.0 (AUC 1.0)                    | 0.962 (p 0.038) |
| B: contaminated_on_clean      | 0.0077 | low evidence      | [0, 0.103]      | 0      | 0                                | 0.038           |
| C: base_on_leak               | 0.131  | low evidence      | [0.0077, 0.170] | 0      | 0                                | 0.654           |
| D: example_report.json (GLUE) | 0.2747 | moderate evidence | [0, 0.2747]     | n/a    | unavailable (no matched control) | n/a             |

Scenario A uses 40 examples and 40 controls. Scenario D uses 10 examples and has Min-K%++ unavailable because there is no matched control.

### Corrected fixture

Replace the invented `METHODS` signals and the fixed `CI` with one of the committed scenarios. The cleanest correction is to drive the demo from a scenario table so the toggle (matched control on/off) maps to real behavior:

- With a matched control supplied, use Scenario A: guided 0.0, Min-K%++ 1.0 (AUC 1.0), order 0.962, combined index 0.492, band moderate evidence, CI [0.354, 0.492], 40 examples / 40 controls.
- Without a matched control, Min-K%++ is unavailable and is shown as skipped (no matched control), mirroring Scenario D where Min-K%++ is unavailable. Use a committed control-absent scenario rather than synthesizing an index.

Notes for the implementer:

- The band thresholds in the demo (`< 0.2` low, `< 0.5` moderate, else high) are not the source of truth; bands must be taken from the committed report ("low evidence", "moderate evidence"). Scenario A at index 0.492 is labeled moderate evidence in the committed report, which the demo threshold happens to agree with, but the label text should read as committed ("moderate evidence").
- The CI must be a per-scenario interval (for example [0.354, 0.492]), not a symmetric plus-or-minus constant.
- Keep the standing caveat copy: scores are signals with uncertainty, not proof of training-set membership.

Source paths: committed scenario reports in the contamination-checker repository (Scenario D is `example_report.json`, GLUE). Repo: github.com/harihkk/contamination-checker.

---

## 2. Helm Browser Agent (fails audit)

Source of truth: `core/action_registry.py` in the Helm-browser-agent repository.

### Current state in the demo

`components/systems/demos/HelmDemo.tsx` defines:

```
type Action = "navigate" | "search" | "read_text" | "click";
```

The scripted steps use `search` (catalog search) and `read_text` (reading the `.price` node) as if they were engine actions. They are not.

### Verified facts (real registry)

Executable actions (the engine actually runs these): `navigate`, `click`, `type`, `press_key`, `select`, `scroll`, `wait`, `extract`, `done`, plus higher-level executable workflows such as `open_top_github_repo` and `add_amazon_item_to_cart`.

Non-executable planner concepts (`executable=False`, never run by the engine): `search_web`, `site_search`, `observe_page`, `extract_text`, `select_option`, `wait_for_selector`, `validate_url`, `validate_text_visible`, `report_blocker`, `recover_from_error_page`.

Statuses: `pending`, `executing`, `completed`, `failed`, `cancelled`, `blocked`, `unverified`.

`search` and `read_text` are not in either list. Do not present search or read as executable engine actions.

### Corrected fixture

Re-map the scripted steps to real executable actions:

| Demo step intent                   | Replace with executable action                                                           |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| Search the catalog for the product | `type` (enter query) then `press_key` (submit), or `navigate` directly to the result URL |
| Click the result link              | `click` (already valid)                                                                  |
| Read the `.price` node             | `extract` (executable extraction)                                                        |
| Confirm task complete              | `done`                                                                                   |

Update the `Action` type to a union drawn only from the executable set, for example `"navigate" | "type" | "press_key" | "click" | "extract" | "done"`. The blocked-task path (login wall) should continue to surface a typed blocker and the `blocked` or `unverified` status from the real status set rather than a faked completion, which already matches the engine's honesty contract.

Source path: `core/action_registry.py`. Real repo: github.com/harihkk/Helm-browser-agent.

### Related: stale clone URL in content

`content/systems.ts` (around line 273) lists the clone command `git clone https://github.com/harihkk/Helm-browser-agent.git`. Per the verified facts, the real repo is github.com/harihkk/Helm-browser-agent, so the displayed clone host is correct. Confirm the README clone URL referenced upstream (noted as stale) is not what is surfaced here; the portfolio value points at the real repo.

---

## 3. Code Review Arena (passes audit)

Source of truth: `dashboard/public/reports/audit-v1.json` (generated 2026-06-18, 10 cases).

### Verified facts (audit-v1.json)

| Case                     | Detection | Validated | Apply | Tests   | Structural | Primary failure    |
| ------------------------ | --------- | --------- | ----- | ------- | ---------- | ------------------ |
| reference-patch          | 1.000     | 1.000     | 1.000 | 1.000   | 1.000      | none               |
| control: perfect_patch   | 1.000     | 1.000     | 1.000 | 1.000   | 1.000      | none               |
| control: keyword_gamer   | 1.000     | 0.000     | 1.000 | 0.000   | 0.000      | tests_failed       |
| control: bad_patch       | 1.000     | 0.000     | 1.000 | 0.000   | 0.000      | tests_failed       |
| control: malformed_patch | 1.000     | 0.000     | 0.000 | not run | not run    | patch_apply_failed |

Aggregate failure modes: tests_failed 30, structural_validation_failed 30, patch_apply_failed 10. Case studies include `security_fastapi_multitenant_admin_bypass_001`.

### Assessment

`components/systems/demos/CodeReviewArenaDemo.tsx` shows two reviewers:

- reference-patch: all six stages pass, detection 1.0, validated 1.0. Matches the committed reference-patch row.
- control: keyword_gamer: detection 1.0, validated 0.0, with Test and Structural validation failing while Detect / Patch / Apply / Score pass. This matches the committed keyword_gamer row (detection 1.000, validated 0.000, apply 1.000, tests 0.000, structural 0.000, primary failure tests_failed).

The footnote ("the keyword_gamer control detects all ten bugs yet validates none; reference-patch validates all ten") is consistent with the per-axis values and the audit covering 10 cases. No correction required.

Optional accuracy note: the demo's seeded case is labeled `security_jwt_audience_validation`, an illustrative JWT example. The committed case-study identifier is `security_fastapi_multitenant_admin_bypass_001`. The JWT label is presented as illustrative, not as a committed case id, so this is acceptable; if exact fidelity is desired, swap in the committed case-study id.

Source path: `dashboard/public/reports/audit-v1.json` (also surfaced in this repo's content as `arena/reports/` and the dashboard).

---

## 4. DebugBrief (passes audit)

Source of truth: `sample-pr.md` in the Debug-Brief repository.

### Verified facts (sample-pr.md)

- Command: `python -m pytest -q test_calc.py`.
- Exit 1 (failing), then exit 0 (passing) after editing `calc.py`.
- 2 attempts.
- File changed: `calc.py` (reported as correlation, not proven cause).
- Sections: Summary, Session metadata, Reproduce and verify, Red to green, Modified files, Timeline, Verification and tests, Failed attempts.
- No AI, no network, no inferred root cause.

### Assessment

`components/systems/demos/DebugBriefDemo.tsx` reproduces the red-to-green narrative faithfully:

- The brief Summary states the failing check `python -m pytest -q test_calc.py` passed after 2 attempts, changes touched `calc.py`. Matches the command, attempt count, and changed file.
- The Red to green section frames the changed file as "correlation, not proven cause", matching the committed wording and the no-inferred-root-cause rule.
- The standing footnote "No AI, no network" matches the committed constraints.

No correction required.

Note (cosmetic): the demo terminal lines render the command as `pytest -q test_calc.py` via a wrapper invocation (`debugbrief run -- pytest -q test_calc.py`), while the canonical recorded command in the brief is the full `python -m pytest -q test_calc.py`. The brief text already uses the full canonical form, so this is consistent; keep the brief body as the source of truth for the command string.

Source path: `sample-pr.md`. Repo: github.com/harihkk/Debug-Brief.

---

## Action checklist

| Priority | Demo              | Action                                                                                                                                                                                                                                    |
| -------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | ContamCheckr      | Replace invented signals (0.41 / 0.58 / 0.22) and fixed CI (0.08) with committed scenario values; drive the matched-control toggle from real scenarios (A and a control-absent scenario); use committed band labels and per-scenario CIs. |
| 2        | Helm              | Replace `search` and `read_text` with real executable actions (`type` / `press_key` / `navigate`, `extract`, `done`); restrict the `Action` union to the executable set.                                                                  |
| 3        | Code Review Arena | No change required; optionally swap the illustrative case label for the committed case id `security_fastapi_multitenant_admin_bypass_001`.                                                                                                |
| 4        | DebugBrief        | No change required.                                                                                                                                                                                                                       |
