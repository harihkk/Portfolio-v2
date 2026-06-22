# Content Conflicts (re-audit)

Purpose: a re-audit pass over the content conflict log for the Portfolio-v2 hardening. This pass re-confirms source integrity (no SHA drift), records which previously logged conflicts are now resolved in the shipping source, and restates the items still held for Hari's approval. Nothing is silently resolved.

Re-audit date: 2026-06-21.

## Source-of-truth hierarchy

When two sources disagree, the higher tier wins:

```
code > tests > artifacts > release/package > docs > resume > existing portfolio > old portfolio
```

- code: the committed source of each flagship and of this portfolio (`content/`, `lib/`).
- tests: committed test files and their assertions.
- artifacts: committed fixtures and reports (for example `audit-v1.json`, `sample-pr.md`, ContamCheckr result JSONs).
- release/package: published versions and registry status (PyPI, GitHub releases).
- docs: README and in-repo documentation.
- resume: Hari's own public resume.
- existing portfolio: the current Portfolio-v2 source.
- old portfolio: `harihkk.github.io` (the empty old-site repo).

## Source drift check (SHAs match, no drift)

`git ls-remote` plus shallow clone inspection confirms every researched revision still matches the latest published HEAD. No drift detected.

| Repo                     | Researched SHA                             | Latest SHA                                 | Status           |
| ------------------------ | ------------------------------------------ | ------------------------------------------ | ---------------- |
| Portfolio-v2 (this site) | `6ad90b2e73f770005ab41a112db0ecdbdab74825` | `6ad90b2e73f770005ab41a112db0ecdbdab74825` | Match (no drift) |
| code-review-arena        | `656b40187cb14321c2734bbec23e44c6e47131db` | `656b40187cb14321c2734bbec23e44c6e47131db` | Match (no drift) |
| Helm-browser-agent       | `784af0a7998b90898a7d4bd4d11ee0ac62ace3db` | `784af0a7998b90898a7d4bd4d11ee0ac62ace3db` | Match (no drift) |
| Debug-Brief              | `d5c1df6f4263f25c4142fd5e93c511b1cfed78bd` | `d5c1df6f4263f25c4142fd5e93c511b1cfed78bd` | Match (no drift) |
| contamination-checker    | `fbbc85ebab0515f8431d042a2740f8db22c4ee01` | `fbbc85ebab0515f8431d042a2740f8db22c4ee01` | Match (no drift) |

Because the SHAs match exactly, every fixture-backed claim audited below is reading the same committed bytes as the prior pass. No re-derivation was required.

## Resolved items

These conflicts are resolved and the resolution is reflected in the shipping source at the Portfolio-v2 HEAD above.

| #   | Conflict                   | Old / lower-tier value                                | Resolved value                                                | Authority (why it wins)                                               | Verified in source                                                   |
| --- | -------------------------- | ----------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| R1  | Browser-agent product name | "Surf" (old portfolio)                                | "Helm" / "Helm Browser Agent"                                 | code over old portfolio: repo is `harihkk/Helm-browser-agent`         | Named "Helm" across `content/systems.ts` and notes                   |
| R2  | Helm clone URL             | README clone URL is stale                             | Link only `github.com/harihkk/Helm-browser-agent`             | code over docs: the README clone line is stale and must not be linked | Canonical repo URL used; stale `Helm-agentic-browser` not linked     |
| R3  | Infinite Infolab job title | "Software Engineer, Machine Learning" (old portfolio) | "Machine Learning Engineer"                                   | resume over old portfolio                                             | `content/experience.ts` line 83: `role: "Machine Learning Engineer"` |
| R4  | ContamCheckr packaging     | implied packaged tool                                 | Not on PyPI; describe as a local CLI, not a published package | release/package status (PyPI 404 for `contamination-checker`)         | Not presented as a published package                                 |

### R1 / R2 notes (Helm)

- Ship name: Helm Browser Agent; product noun: Helm.
- Canonical repo: `https://github.com/harihkk/Helm-browser-agent`. The README clone URL is stale and must not be linked.
- The action registry in `core/action_registry.py` separates executable engine actions from non-executable planner concepts. The portfolio must present only the executable set as engine actions.

| Category                                             | Members                                                                                                                                                                                 |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Executable engine actions                            | `navigate`, `click`, `type`, `press_key`, `select`, `scroll`, `wait`, `extract`, `done`                                                                                                 |
| Executable higher-level workflows                    | `open_top_github_repo`, `add_amazon_item_to_cart`                                                                                                                                       |
| Non-executable planner concepts (`executable=False`) | `search_web`, `site_search`, `observe_page`, `extract_text`, `select_option`, `wait_for_selector`, `validate_url`, `validate_text_visible`, `report_blocker`, `recover_from_error_page` |
| Statuses                                             | `pending`, `executing`, `completed`, `failed`, `cancelled`, `blocked`, `unverified`                                                                                                     |

Do not present `search_web` / `extract_text` (or any planner concept) as executable engine actions. Planner concepts are not engine actions.

### R3 note (Infinite Infolab title)

Resolved to "Machine Learning Engineer" per the resume, and that is the value committed in `content/experience.ts`.

### R4 note (ContamCheckr not on PyPI)

ContamCheckr is described as a local CLI, never as a published package. The committed result reports back the demo without implying registry availability. Method weights are guided 0.5, Min-K%++ 0.3, order 0.2, renormalized over active methods.

| Scenario | Report                     | Index  | Band              | CI              | guided | minkpp      | order | Notes                                                   |
| -------- | -------------------------- | ------ | ----------------- | --------------- | ------ | ----------- | ----- | ------------------------------------------------------- |
| A        | contaminated_on_leak       | 0.492  | moderate evidence | [0.354, 0.492]  | 0.0    | 1.0         | 0.962 | minkpp AUC 1.0; order p 0.038; 40 examples, 40 controls |
| B        | contaminated_on_clean      | 0.0077 | low evidence      | [0, 0.103]      | 0      | 0           | 0.038 |                                                         |
| C        | base_on_leak               | 0.131  | low evidence      | [0.0077, 0.170] | 0      | 0           | 0.654 |                                                         |
| D        | example_report.json (GLUE) | 0.2747 | moderate evidence | [0, 0.2747]     | n/a    | unavailable | n/a   | 10 examples; Min-K%++ unavailable (no matched control)  |

## Still-held items

These remain unresolved by design and are gated on input from Hari. None is silently picked.

| Item                                | Both sides                                                                                 | Why held                                                                              | Needs from Hari                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| KL University                       | Old portfolio lists it as experience vs. resume omits it.                                  | Publishing experience absent from the resume would contradict the higher-tier source. | Confirm whether to list KL University at all, and if so the exact role, degree, and dates. |
| Rlogical Techsoft (Research Intern) | Old portfolio lists it as experience vs. resume omits it.                                  | Same: not on the resume.                                                              | Confirm whether to include this role and its exact title and dates.                        |
| Undergraduate degree / dates        | Old portfolio implies an undergrad affiliation; resume lists only the M.S. (Northeastern). | Undergrad degree name and dates could not be verified from any source.                | Provide undergraduate institution, degree, and dates if they should appear.                |
| LinkedIn URL                        | A LinkedIn profile may exist, but no verified URL is known.                                | Inventing a URL is forbidden.                                                         | Provide the canonical LinkedIn URL.                                                        |

Source confirmation for the held items:

- `content/experience.ts` (line 13) notes KL University and Rlogical Techsoft are old-site only and not on the resume.
- `lib/site.ts` (lines 45-51) records the LinkedIn URL as pending: `linkedin: ""`, hidden until set.

## Code Review Arena fixture (audited, no drift)

The committed fixture `dashboard/public/reports/audit-v1.json` (generated 2026-06-18, 10 cases) is re-confirmed at the matching SHA.

| Case                    | detection | validated | apply | tests   | structural | primary failure    |
| ----------------------- | --------- | --------- | ----- | ------- | ---------- | ------------------ |
| reference-patch         | 1.000     | 1.000     | 1.000 | 1.000   | 1.000      | none               |
| control:perfect_patch   | 1.000     | 1.000     | 1.000 | 1.000   | 1.000      | none               |
| control:keyword_gamer   | 1.000     | 0.000     | 1.000 | 0.000   | 0.000      | tests_failed       |
| control:bad_patch       | 1.000     | 0.000     | 1.000 | 0.000   | 0.000      | tests_failed       |
| control:malformed_patch | 1.000     | 0.000     | 0.000 | not run | not run    | patch_apply_failed |

Aggregate failure modes: tests_failed 30, structural_validation_failed 30, patch_apply_failed 10. Case studies include `security_fastapi_multitenant_admin_bypass_001`.

## DebugBrief fixture (audited, no drift)

The sample brief `examples/sample-pr.md` records a session driven by `python -m pytest -q test_calc.py`, which exits 1 then exits 0 after editing `calc.py`, across 2 attempts. The file `calc.py` changed (correlation, not proven cause). Sections: Summary, Session metadata, Reproduce and verify, Red to green, Modified files, Timeline, Verification and tests, Failed attempts. No AI, no network access, no inferred root cause.

## Standing constraints carried into v2

- No fabrication: no invented metrics, publications, awards, dates, or claims.
- Do not present external arXiv papers as Hari's publications.
- Do not present planner concepts (`search_web`, `extract_text`, etc.) as executable Helm engine actions.
- Do not imply ContamCheckr is published on PyPI.
- No em dashes in published or repo copy: use periods, commas, colons, parentheses, or hyphens.

---

_Last reviewed: 2026-06-21. Source integrity: all five SHAs match the researched revisions exactly, no drift._
