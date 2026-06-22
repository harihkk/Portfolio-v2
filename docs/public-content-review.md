# Public Content Review

Every public claim rendered on the site, mapped to its provenance record and approval status. Verified 2026-06-21 against the commit SHAs in [commit-shas.md](audit/commit-shas.md). Nothing with `publicApproved: false` is rendered anywhere, those items are listed under "Held, not rendered."

The machine-readable source of truth is [`content/provenance.ts`](../content/provenance.ts). A unit test (`tests/unit/content.test.ts`) asserts the phone number never appears in any record and that held items stay unapproved.

## Identity

| Claim                                           | Provenance ID     | Source                  | Approved                                        |
| ----------------------------------------------- | ----------------- | ----------------------- | ----------------------------------------------- |
| Hari Kancharla / Hari Krishna Kancharla (legal) |                   | résumé header           | ✅                                              |
| AI Systems Engineer · Boston, Massachusetts     | `location-boston` | résumé                  | ✅                                              |
| 4+ years building production AI                 | `exp-years`       | résumé summary          | ✅                                              |
| "i run on coffee. the code barely runs."        | `bio-coffee`      | GitHub bio (Hari's own) | ✅                                              |
| Phone number                                    |                   | résumé                  | 🚫 never published (omitted from code entirely) |

## Employer record (résumé-sourced; flagged for sign-off)

These come from Hari's own public résumé. They are rendered on `/experience` and in the homepage record. Each is flagged in its provenance `notes` for explicit sign-off; if Hari prefers any omitted, set `publicApproved: false` on that record and it disappears.

| Claim                                                          | Provenance ID                   | Approved    |
| -------------------------------------------------------------- | ------------------------------- | ----------- |
| Morgan Stanley, AI Software Engineer, Nov 2024-Present         | `ms-role`                       | ✅          |
| recall@10 +42%; analyst research time -35%                     | `ms-recall`, `ms-research-time` | ✅ (résumé) |
| p95 inference latency -3.5×; 1M+ daily requests                | `ms-latency`, `ms-throughput`   | ✅ (résumé) |
| domain precision +28%; training cost -40%                      | `ms-precision`                  | ✅ (résumé) |
| Infinite Infolab, Machine Learning Engineer, May 2021-Jul 2023 | `ii-role`                       | ✅          |
| demand accuracy +27%; MAPE -22%                                | `ii-demand`, `ii-mape`          | ✅ (résumé) |
| 10M+ records; preprocessing -55%                               | `ii-records`                    | ✅ (résumé) |
| 50K+ daily predictions at 99.9% uptime                         | `ii-serving`                    | ✅ (résumé) |

## Flagship systems (repository-verified)

| Claim                                                               | Provenance ID              | Source                      | Approved |
| ------------------------------------------------------------------- | -------------------------- | --------------------------- | -------- |
| Code Review Arena, 306 tests / 37 files                             | `cra-tests`                | tests @ 656b401             | ✅       |
| 30 benchmark cases (3 packs × 10)                                   | `cra-cases`                | benchmark_sets/             | ✅       |
| five-job CI                                                         | `cra-ci`                   | ci.yml                      | ✅       |
| keyword_gamer detection 1.000 / validation 0.000 vs reference-patch | `cra-gap`                  | README (documented example) | ✅       |
| Helm, 192 tests / 16 files (40 SSRF)                                | `helm-tests`               | tests @ 784af0a             | ✅       |
| Groq→Gemini→Ollama cascade                                          | `helm-cascade`             | core/ai_agent.py            | ✅       |
| completed only with visible-page proof                              | `helm-completion`          | README + validators.py      | ✅       |
| SSRF guard                                                          | `helm-ssrf`                | core/url_policy.py          | ✅       |
| DebugBrief, on PyPI v1.3.0 (3 releases)                             | `db-pypi`                  | PyPI + releases             | ✅       |
| 376 tests / 29 files                                                | `db-tests`                 | tests @ d5c1df6             | ✅       |
| CI Python 3.9-3.14, Linux+macOS                                     | `db-ci-matrix`             | ci.yml                      | ✅       |
| no AI / no network / no telemetry                                   | `db-no-ai`                 | README + SECURITY.md        | ✅       |
| ContamCheckr, 30 tests / 7 files                                    | `cc-tests`                 | tests @ fbbc85e             | ✅       |
| evidence bands, not a verdict                                       | `cc-bands`                 | README + calibration.py     | ✅       |
| NOT on PyPI (recorded to prevent a false claim)                     | `cc-not-pypi`              | PyPI 404 check              | ✅       |
| Aggregate: 900+ tests; 4 flagship systems                           | `agg-tests`, `agg-systems` | sums @ audited SHAs         | ✅       |

## Status labels

`published` (DebugBrief, PyPI), `active` (Helm v0.2, working local app), `alpha` (Code Review Arena v0.1.0 / ContamCheckr v0.1.0). A unit test asserts only DebugBrief carries `published`.

## Research relationships

All 14 Research Desk papers are labeled **External paper**, `authoredByHari: false`, `recordType: READING`. Metadata (title, full author list, arXiv ID, dates, category) was fetched and verified against the arXiv API on 2026-06-21 (queries recorded in [raw-audit](audit/raw-audit-2026-06-21.json)). The "relationship" text is a neutral relevance note, never a first-person Hari annotation. The Preprints area is intentionally empty (no authored manuscript is claimed).

## Education

| Claim                                                        | Source            | Approved                     |
| ------------------------------------------------------------ | ----------------- | ---------------------------- |
| M.S. Data Analytics Engineering (ML), Northeastern, May 2025 | `edu-ms` (résumé) | ✅                           |
| Undergraduate degree/dates                                   |                   | 🚫 held (no verified source) |

## External links (all `target="_blank"` carry `rel="noopener noreferrer"`; verified by e2e)

GitHub profile + 4 flagship repos; DebugBrief on PyPI; Prompt-Budd live (`promtbud.com`, confirmed 200); AskRC/GenBI/Visioncraft/self-healing-pipeline repos; 14 arXiv URLs; résumé PDF (`/Hari_K_Resume_AI_SWE.pdf`, served 200). Earlier-work "Live" links are shown only when the deployment actually responds (`liveVerified`).

## Held, NOT rendered (publicApproved: false)

| Item                               | Provenance ID        | Why held                                    |
| ---------------------------------- | -------------------- | ------------------------------------------- |
| KL University, Research Assistant  | `held-kl-university` | On old portfolio, not on current résumé     |
| Rlogical Techsoft, Research Intern | `held-rlogical`      | On old portfolio, not on current résumé     |
| Undergraduate degree/dates         | `held-undergrad`     | No verified source                          |
| LinkedIn URL                       | `held-linkedin`      | URL not yet provided; link hidden until set |

See [USER_APPROVALS.md](USER_APPROVALS.md) for what to confirm or supply.
