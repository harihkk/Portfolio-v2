# Source Revisions

Re-audit of the source repositories that ground the Portfolio-v2 site and its demo fixtures. This pass confirms that the revisions originally researched still match the latest published revisions, with no drift.

## Re-audit metadata

- Date: 2026-06-21.
- Method: `git ls-remote` against each public GitHub repo to read the latest published HEAD, followed by a shallow clone to inspect the committed artifacts.
- Result: all five repositories match the researched revisions exactly. No drift was detected.
- Demo fixtures used on the portfolio are derived from artifacts committed at the SHAs listed below. They are not regenerated at request time and are not invented; they are read from files committed to each repo at these exact revisions.

## Revision match table

| Repo                     | Researched SHA                             | Latest SHA                                 | Status           |
| ------------------------ | ------------------------------------------ | ------------------------------------------ | ---------------- |
| Portfolio-v2 (this site) | `6ad90b2e73f770005ab41a112db0ecdbdab74825` | `6ad90b2e73f770005ab41a112db0ecdbdab74825` | Match (no drift) |
| code-review-arena        | `656b40187cb14321c2734bbec23e44c6e47131db` | `656b40187cb14321c2734bbec23e44c6e47131db` | Match (no drift) |
| Helm-browser-agent       | `784af0a7998b90898a7d4bd4d11ee0ac62ace3db` | `784af0a7998b90898a7d4bd4d11ee0ac62ace3db` | Match (no drift) |
| Debug-Brief              | `d5c1df6f4263f25c4142fd5e93c511b1cfed78bd` | `d5c1df6f4263f25c4142fd5e93c511b1cfed78bd` | Match (no drift) |
| contamination-checker    | `fbbc85ebab0515f8431d042a2740f8db22c4ee01` | `fbbc85ebab0515f8431d042a2740f8db22c4ee01` | Match (no drift) |

The four flagships are the source of truth for the demo fixtures shown on the portfolio. The portfolio repo itself is pinned for completeness.

## Committed artifacts per flagship

Each flagship contributes specific committed files, read at the matching SHA above, that back the on-site demos and claims.

| Flagship              | Committed artifact(s)                                    |
| --------------------- | -------------------------------------------------------- |
| code-review-arena     | `dashboard/public/reports/audit-v1.json`                 |
| Helm-browser-agent    | `core/action_registry.py`                                |
| Debug-Brief           | `examples/sample-pr.md`, `docs/demo.tape`                |
| contamination-checker | `experiments/results/*.json`, `docs/example_report.json` |

## Notes per flagship

### code-review-arena

The fixture `dashboard/public/reports/audit-v1.json` was generated 2026-06-18 and covers 10 cases.

| Case                    | detection | validated | apply | tests   | structural | primary failure    |
| ----------------------- | --------- | --------- | ----- | ------- | ---------- | ------------------ |
| reference-patch         | 1.000     | 1.000     | 1.000 | 1.000   | 1.000      | none               |
| control:perfect_patch   | 1.000     | 1.000     | 1.000 | 1.000   | 1.000      | none               |
| control:keyword_gamer   | 1.000     | 0.000     | 1.000 | 0.000   | 0.000      | tests_failed       |
| control:bad_patch       | 1.000     | 0.000     | 1.000 | 0.000   | 0.000      | tests_failed       |
| control:malformed_patch | 1.000     | 0.000     | 0.000 | not run | not run    | patch_apply_failed |

Aggregate failure modes: tests_failed 30, structural_validation_failed 30, patch_apply_failed 10. Case studies include `security_fastapi_multitenant_admin_bypass_001`.

### Helm-browser-agent

The action registry in `core/action_registry.py` distinguishes executable engine actions from non-executable planner concepts.

- Executable actions: `navigate`, `click`, `type`, `press_key`, `select`, `scroll`, `wait`, `extract`, `done`, plus higher-level executable workflows such as `open_top_github_repo` and `add_amazon_item_to_cart`.
- Non-executable planner concepts (`executable=False`): `search_web`, `site_search`, `observe_page`, `extract_text`, `select_option`, `wait_for_selector`, `validate_url`, `validate_text_visible`, `report_blocker`, `recover_from_error_page`.
- Statuses: `pending`, `executing`, `completed`, `failed`, `cancelled`, `blocked`, `unverified`.

The README clone URL is stale. The real repository is `github.com/harihkk/Helm-browser-agent`. Planner concepts such as `search_web` and `extract_text` are not executable engine actions and are not presented as such.

### Debug-Brief

The sample brief `examples/sample-pr.md` records a session driven by the command `python -m pytest -q test_calc.py`, which exits 1 and then exits 0 after editing `calc.py`, across 2 attempts. The file `calc.py` was changed (correlation, not proven cause). Sections: Summary, Session metadata, Reproduce and verify, Red to green, Modified files, Timeline, Verification and tests, Failed attempts. The brief involves no AI, no network access, and no inferred root cause. The demo recording is `docs/demo.tape`.

### contamination-checker

Committed reports under `experiments/results/*.json` plus `docs/example_report.json` provide the demo scenarios. Method weights are guided 0.5, Min-K%++ 0.3, order 0.2, renormalized over the active methods.

| Scenario | Report                     | Index  | Band              | CI              | guided | minkpp      | order | Notes                                                   |
| -------- | -------------------------- | ------ | ----------------- | --------------- | ------ | ----------- | ----- | ------------------------------------------------------- |
| A        | contaminated_on_leak       | 0.492  | moderate evidence | [0.354, 0.492]  | 0.0    | 1.0         | 0.962 | minkpp AUC 1.0; order p 0.038; 40 examples, 40 controls |
| B        | contaminated_on_clean      | 0.0077 | low evidence      | [0, 0.103]      | 0      | 0           | 0.038 |                                                         |
| C        | base_on_leak               | 0.131  | low evidence      | [0.0077, 0.170] | 0      | 0           | 0.654 |                                                         |
| D        | example_report.json (GLUE) | 0.2747 | moderate evidence | [0, 0.2747]     | n/a    | unavailable | n/a   | 10 examples; Min-K%++ unavailable (no matched control)  |
