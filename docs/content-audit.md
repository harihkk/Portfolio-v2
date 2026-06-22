# Content Audit

A verified inventory of every credible project, role, and content artifact for "The Systems Journal" portfolio, with inclusion decisions grounded only in audited evidence.

---

## 1. Audit Metadata

- **Audit date:** 2026-06-21
- **Subject:** Hari Krishna Kancharla (SEO/legal name); masthead name "Hari Kancharla". Title: AI Systems Engineer. Tagline: "Building AI systems that have to prove they work." Location: Boston, Massachusetts.
- **Method:** Shallow `git clone` of each public repository under `github.com/harihkk`, inspected at a pinned HEAD; GitHub API for repo metadata; arXiv API for the reference-paper set (all 15 papers verified via `export.arxiv.org/api/query`); live-site HTTP fetch for deployed projects (e.g. promtbud.com returned 200, contamcheckr PyPI returned 404).
- **Commit provenance:** Every per-repo claim below is anchored to a HEAD SHA recorded in `docs/audit/commit-shas.md`. Key SHAs: code-review-arena `656b401` (2026-06-21), Debug-Brief `d5c1df6` (2026-06-21), Helm-browser-agent `784af0a` (2026-06-09), contamination-checker `fbbc85e` (2026-06-06), Prompt-Budd `0c99024` (2026-03-26), self-healing-pipeline `fa42b5f` (2026-03-26), AskRC `e0f1b85` (2024-12-01), GenBI `e5e685c` (2026-03-26), weather-dashboard `7a776bd` (2026-03-22), Visioncraft `8cd3a92` (2025-02-26), harihkk.github.io `656e01e` (2026-06-05).
- **Raw data:** `docs/audit/raw-audit-2026-06-21.json` is the single machine-readable source of truth for all counts and facts cited here.
- **Source-of-truth note on the old site:** The cloned `harihkk.github.io` working tree contains only a 1-byte `README.md` (single newline) with one commit ("Delete assets directory", `2784aee`, 2026-05-25). No HTML/CSS/JS, assets, or copy are recoverable; `git fsck` found nothing. The old site's stack and design **could not be verified** from source. Old-site content conflicts below come from the prior live site / resume comparison, not this empty repo.

---

## 2. Professional Record Audited

The resume is the authority for professional history. The portfolio must not contradict it.

| Organization            | Title                                              | Location   | Dates               | Status                                                                                                    |
| ----------------------- | -------------------------------------------------- | ---------- | ------------------- | --------------------------------------------------------------------------------------------------------- |
| Morgan Stanley          | AI Software Engineer                               | Boston, MA | Nov 2024 - Present  | Verified (resume)                                                                                         |
| Infinite Infolab        | Machine Learning Engineer                          | India      | May 2021 - Jul 2023 | Verified (resume)                                                                                         |
| Northeastern University | M.S. Data Analytics Engineering (ML concentration) | Boston, MA | Conferred May 2025  | Verified (resume); git author email `kancharla.ha@northeastern.edu` corroborates Northeastern affiliation |

- **Experience summary:** 4+ years (resume).
- **Employer metrics (approved via resume, never alter the numbers):**
  - Morgan Stanley: recall@10 +42%; analyst research time -35%; p95 inference latency improved 3.5×; 1M+ daily inference requests; domain precision +28%; training cost -40%.
  - Infinite Infolab: demand-forecast accuracy +27%; MAPE -22%; 10M+ records; preprocessing time -55%; 50K+ daily predictions; 99.9% uptime; 2× experimentation throughput.
  - These figures originate from Hari's own public resume and are therefore sourced. Treat them as "approved via resume." They are not independently verifiable from code, so present with provenance and do not embellish.

### Old-site-only / unconfirmed affiliations, DO NOT PUBLISH as professional experience

- **Infinite Infolab title conflict:** Old site said "Software Engineer, Machine Learning"; resume says "Machine Learning Engineer." **Resume wins** → publish "Machine Learning Engineer."
- **KL University (Research Assistant)** and **Rlogical Techsoft (Research Intern):** Listed on the old site, **not** on the current resume. **Needs user approval** before publishing. KL University is a likely undergraduate institution, but degree and dates are **Could not verify**.

---

## 3. Flagship Systems

Four flagships, all verified from their repositories. Counts below are exact (from `grep`/`find` over the cloned trees) and must not be rounded up.

### 3.1 Code Review Arena

- **Repo / name:** `harihkk/code-review-arena`; product name "Code Review Arena". Last-verified commit `656b401` (2026-06-21).
- **Problem:** AI code-review benchmarks often reward a sharp-looking comment without confirming any proposed fix actually works, and reviewers can game them via leaked metadata (title/category/severity) or pre-patch failing-test output. Reviewers and benchmark packs are both treated as potentially adversarial.
- **Thesis:** Trustworthy evaluation of AI code reviewers requires execution-backed proof of a working fix, not credit for a plausible comment, so detection and validation are scored separately, the reviewer payload is blind, and runs are tamper-evident and reproducible.
- **Real architecture:** A Typer CLI (`arena.cli`) over modular packages: `benchmark` (run orchestration, pack hashing, certification, mutation testing, contamination scanning), `reviewers` (deterministic controls, reference-patch loader, shallow-patch adversarial baseline, custom-command wrapper, OpenAI-compatible HTTP reviewer), `execution` (Docker + trusted-local backends, hardening, tamper manifests), `patching` (integrity-guarded patch application), `scoring` (deterministic lexical/line/severity matching), `validators` (Python AST / JS / SQL / RAG / source-text), `reports` (JSON/MD/HTML + content-addressed evidence bundle), `server` (FastAPI), `storage` (SQLite schema v2, WAL). A Next.js 16 / React 19 dashboard renders leaderboard, reports, cases, and methodology.
- **Execution flow:** Validate pack (reject symlinks/tampered packs before side effects) → compute pack checksum, abort on `--expected-pack-sha256` mismatch → per case: materialize isolated workspace → build blind reviewer context (diff + bounded files; no ground truth/metadata/test output) → `reviewer.review()` returns findings + optional patch → score detection deterministically → select single repair patch → apply with integrity guards (no tests/config/protected/absolute/`..` paths) → run hidden tests (Docker or trusted-local, read-only test mount) → run structural validators → attribute evidence, detect tampering → aggregate metrics, classify run status weakest-link-first → write `run.json`/`report.md`/`report.html`/`run_manifest.json`, seal evidence bundle, persist to SQLite.
- **Tests / CI:** **306 test functions across 37 `test_*.py` files** (pytest + hypothesis + pytest-cov). CI is a **5-job GitHub Actions workflow** (backend gate, docker, package, dashboard, windows-safety), SHA-pinned actions, least-privilege `contents:read`, Dependabot configured. CI is green-gating but not a public ranking.
- **Packaging / publication:** `pyproject.toml` name `codereview-arena` **v0.1.0**, `requires-python >=3.11`, console script `arena`. **NOT published to any registry**, only the GitHub homepage. No tagged release (all changes "Unreleased").
- **Install:** `python -m venv .venv && source .venv/bin/activate`; `python -m pip install -e ".[dev]"`; `arena validate benchmark_sets/audit_v1`; `arena run benchmark_sets/audit_v1 --reviewer reference-patch --mode full --allow-local-execution`; `arena leaderboard runs/ --metric validated_case_rate`; optional Docker sandbox via `scripts/build_bench_image.sh`; dashboard via `arena serve` + `cd dashboard && npm install && npm run dev`.
- **Technologies:** Python 3.11+, Typer, Pydantic v2, FastAPI + Uvicorn, SQLite (WAL), PyYAML, Rich, httpx, Docker, pytest + hypothesis, ruff + mypy, Next.js 16 / React 19 / TypeScript / Tailwind, GitHub Actions.
- **Evidence / scale:** 306 tests; 5-job CI; **30 benchmark cases total = 3 packs × exactly 10 `case.yaml`** (v1, audit_v1, audit_v2), each pack ships a `pack.sha256`. audit_v1 spans security/distributed-systems/RAG-safety/concurrency/reliability/API-correctness; audit_v2 is 10 logic-defect cases.
- **Limitations:** Curated, small packs (30 cases). Concept matching is lexical, not semantic. Structural validators are hand-authored heuristics; tests are the real gate. Passing tests is execution evidence, not proof of full correctness. Local audit harness, not a hardened public service. No real external-model results ship (only deterministic controls + reference-patch). Per-bug repair attribution is suite-level for multi-bug cases. **No image assets in the repo.**
- **Approval-gated claims:** The headline keyword_gamer-vs-reference gap numbers, the "100% mutant-kill / fully certified" audit_v2 claims, any pre-baked dashboard report JSONs, and "authored leak-free" framing must be re-derived from a fresh run before publishing (state as "CI-enforced," not absolute). **Needs user approval.**
- **Status:** Active, pre-release v0.1.0. Substantial and CI-gated; not published.

### 3.2 Helm Browser Agent

- **Repo / name:** `harihkk/Helm-browser-agent`; product name **"Helm"**. Last-verified commit `784af0a` (2026-06-09).
- **Problem:** Most NL browser agents paste the raw instruction into a search box, declare success because a page rendered, or emit actions the engine cannot run; they also depend on a single LLM provider whose free tier runs out, and will navigate to whatever URL the model emits (injection/SSRF risk).
- **Thesis:** A browser agent earns trust by being auditable and honest, route every instruction through a fixed, testable pipeline, execute only whitelisted actions, gate completion on visible-page evidence, and report precise structured blockers (or "unverified") instead of faking success.
- **Real architecture:** FastAPI app with a `/ws/advanced` WebSocket + REST surface (`api/main.py`), a deterministic `prompt_normalizer`, an `intent_planner` building a structured `BrowserIntent` with high-confidence deterministic routing, an `action_registry` whitelist, a `risk` confirmation gate, evidence-based `validators`, a typed `blockers` schema, a `task_orchestrator` plan-execute-observe-validate loop (loop detection, recovery, shared-browser run lock), a `GroqAIAgent` provider cascade, a Playwright `browser_engine` (CDP browser switching, auto-restart watchdog), session recorder, data extractor, task templates, workflow engine, scheduler, async SQLite (`aiosqlite`) persistence, and a single-page frontend.
- **Execution flow:** Prompt over WebSocket → deterministic normalize → structured intent (command vs content separation, explicit success condition) → risk gate (high-impact actions need confirmation) → plan one action (deterministic routing first; LLM only when no high-confidence route) → registry validation → Playwright execute + observe PageState → adaptive loop with recovery → evidence-based completion validation ("completed" only with visible proof, else "unverified" or a typed "blocked") → persist + stream.
- **Provider cascade:** **Groq (`llama-3.3-70b-versatile`) → Gemini (`gemini-2.0-flash`) → local Ollama**, with daily-quota short-circuit. No external hosted-LLM SDKs in code (Groq/Gemini/Ollama only).
- **Tests / CI:** **192 test functions across 16 files** (stdlib `unittest`), including **40 SSRF/URL-policy tests** (`test_url_policy.py`), a 53-test smoke suite, and offline E2E through the real pipeline with fakes. CI (`test.yml`, single `smoke` job on Python 3.12) runs an AST syntax check + `unittest discover`; **no Playwright/browser/network/live tests in CI**.
- **Packaging / publication:** **Not packaged**, no `pyproject.toml`/`setup.py`, no console script, **not on PyPI**. Launched via `python run.py` / `make run`. README header says **HELM v0.2**; CHANGELOG last tag `[0.1.0]` 2026-04-22 + Unreleased.
- **Install:** `git clone` the repo, `cp .env.example .env`, `make dev` (venv + deps + Playwright Chromium), `make run` (http://localhost:8000), `make test`, `make lint`.
  - **Conflict (logged):** The README clone URL `Helm-agentic-browser.git` is **STALE**. Link the real repo `github.com/harihkk/Helm-browser-agent`.
- **Technologies:** Python, FastAPI, Uvicorn, WebSockets, Playwright (Chromium, CDP), Groq, Gemini, Ollama, Pydantic, BeautifulSoup4, aiosqlite/SQLite, httpx, GitHub Actions, unittest.
- **Evidence / scale:** `core/` ~8,138 lines (browser_engine 1639, intent_planner 1617, ai_agent 989, task_orchestrator 826, api/main 754, db 377). SSRF guard (`url_policy.py`) blocks non-http(s), loopback/private/link-local/reserved IPs, cloud-metadata addresses, and packed-IPv4 bypasses; 40 dedicated tests.
- **Limitations:** No hosted version (local only). Requires a configured provider; free tiers can exhaust (mitigated only by cascade). SSRF guard validates only the literal host without a resolver (DNS-rebinding window, documented). CI is offline-only. "unverified" is a real terminal state. Not packaged/published. Live-site success rates are not measured. CI tests Python 3.12 only (run.py floor is 3.8+). **No image assets in the repo.**
- **Approval-gated claims:** No reliability/success-rate percentage exists in the repo, do not state one. The cascade "keeps working when quotas run out" is design intent, not measured uptime. Breadth of supported sites is not benchmarked. SSRF/injection guard is best-effort, not a guarantee. Whether to cite "192 tests" vs "16 files" framing → **Needs user approval.**
- **License conflict (logged):** GitHub API reported no license; README states MIT. **Treat as MIT per README/author; flag for confirmation.**
- **Naming conflict (logged):** Called "Surf" on the old site → use **"Helm Browser Agent"**.
- **Status:** Working, actively developed local application (v0.2); offline suite broad, CI green-gating; not packaged or hosted.

### 3.3 DebugBrief

- **Repo / name:** `harihkk/Debug-Brief`; product name **"DebugBrief"**. Last-verified commit `d5c1df6` (2026-06-21).
- **Problem:** The proof of a debugging session (what was tried, what failed, what passed, which files changed) lives only in scrollback and memory; reconstructing it into a PR/handoff/incident note is manual and lossy, and people overstate results. DebugBrief captures the real session and renders a report strictly from recorded evidence. It explicitly does **not** use AI, infer root cause, or report a test result that was not actually observed.
- **Thesis:** An honest debugging report should be derived only from recorded evidence, never inferred. A dependency-light, Unix-only CLI that captures foreground commands under a pseudo-terminal and emits deterministic, evidence-only Markdown/JSON briefs with every empty section omitted.
- **Real architecture:** argparse CLI (`cli.py`), a pseudo-terminal `command_runner` (bounded capture, process-group termination, escape sanitization), a token-pattern `filters` classifier (pytest/jest/vitest/go test/cargo, build/lint/typecheck, wrapper unwrapping, pipefail reliability analysis), evidence-only `derive` (red-to-green window, reproduce/verify, one-liner, observed error, ruled-out attempts), mode-specific `reporters` (pr/handoff/incident + JSON), atomic `session_manager`, `models`, safety-first `paths` (symlink/special-file refusal, 0700/0600), best-effort `redaction`, native-git `git_utils` (fail-closed `tracked_state`), optional `config`, and a `doctor` health check.
- **Execution flow:** start (or auto-start) and record initial Git state → `run -- <cmd>` under a PTY in its own process group, streaming live → capture real exit code, timestamps, duration, bounded previews, per-command Git snapshot → classify (pass/fail strictly from exit code; compounds only attributed under `--verify` with a reliable exit code) → redact secrets, persist atomically → `redo` re-runs the last command (refuses on tracked/unknown Git state) → `end` derives the red-to-green window and reproduce/verify/one-liner/observed-error/ruled-out from events → render pr/handoff/incident Markdown (+ optional JSON), omitting empty sections.
- **Tests / CI:** **376 test functions across 29 `test_*.py` files** (pytest) plus 6 committed snapshot reports; largest are runner-robustness (35), state-integrity (34), filters (29). CI (`ci.yml`) runs a lint job (ruff + mypy on 3.12) and a **matrix of ubuntu + macOS × Python 3.9/3.10/3.11/3.12/3.13/3.14** with wheel build/install, `pip check`, version-agreement assertion, and CLI smoke; **no Windows runner by design**. `release.yml` publishes to PyPI on a published GitHub Release (tag/version check, twine check, `gh-action-pypi-publish` with skip-existing).
- **Packaging / publication:** `debugbrief` **v1.3.0**, **PUBLISHED on PyPI** (`https://pypi.org/project/debugbrief/`), 3 releases v1.1.0-v1.3.0; 1.3.0 released 2026-06-17. `requires-python >=3.9`; single conditional runtime dep `tomli` (only on Python < 3.11), otherwise stdlib-only. MIT.
- **Install:** `pipx install debugbrief`; `uv tool install debugbrief`; `pip install debugbrief`; dev `pip install -e ".[dev]"`; `pytest`.
- **Technologies:** Python (stdlib-only runtime, >=3.9), argparse, POSIX pseudo-terminals/process groups/signals/select, subprocess, native git, tomllib/tomli, setuptools, pytest, ruff, mypy, GitHub Actions, PyPI/twine.
- **Evidence / scale:** 376 tests; multi-OS multi-Python CI matrix; honesty rules enforced in code (`_detect_red_to_green` requires same command + same cwd, fail-then-pass, and reports changed files only as correlation; `is_verification` true only on a recognized check exiting 0). Security: symlink/special-file refusal, atomic write+rename, redo fails closed on tracked/unknown Git state.
- **Limitations:** Capture is explicit via `debugbrief run`; only a bounded preview is stored (no full transcript). Full-screen TUIs not captured. Redaction is best-effort with documented known misses. Git sections require native git. Unix-only (Linux + macOS in CI; no native Windows/PowerShell). Compound commands need `--verify` under a reliable exit code. Shell-history capture intentionally not implemented in v1. Does not defend against a local attacker with write access to `.debugbrief/`.
- **Image assets:** **`docs/demo.gif`** (terminal demo), the **only** image asset across all four flagships.
- **Approval-gated claims:** Any specific test-count figure shown publicly, the "3.9-3.14 / Linux+macOS" claim (reflects CI config, not observed green runs in this clone), PyPI live/version state (this audit did not access PyPI download/adoption numbers), any phrasing implying it "proves" root cause, "no network/telemetry/AI" guarantees, and redaction effectiveness → **Needs user approval / confirm before publishing as guarantees.**
- **Status:** Active and published (v1.3.0; clone HEAD 2026-06-21 with an Unreleased section accruing fixes). CI and release automation in place.

### 3.4 ContamCheckr

- **Repo / name:** `harihkk/contamination-checker`; product name **"ContamCheckr"**. Last-verified commit `fbbc85e` (2026-06-06).
- **Problem:** LLMs are trained on web-scraped corpora that may include the benchmarks used to evaluate them, inflating scores. Existing detectors often overclaim binary membership verdicts and may need cloud access or signals a model does not expose. ContamCheckr instead audits a **local** HuggingFace causal LM and produces a **caveated evidence score**, gating each method on the model's probed capabilities.
- **Thesis:** Benchmark contamination should be surfaced as a transparent, locally-computable **evidence score** with explicit method gating and caveats, **not** as an overconfident binary verdict.
- **Real architecture:** argparse CLI (`capabilities`/`run`/`serve`), frozen `RunConfig`, `LocalCausalLM` wrapper (generation, token logprob table, sequence log-likelihood, capability probing), benchmark loader (bundled sample / local JSONL-CSV / HF datasets), three evidence methods, guided overlap (`methods/guided.py`), Min-K%++ (`methods/minkpp.py`), canonical-order permutation test (`methods/canonical_order.py`), plus `calibration` (weight combination + banding + bootstrap CI), `metrics` primitives, JSON/CSV/HTML `report` writers, and a loopback-only stdlib `http.server` web UI.
- **Execution flow:** CLI `run` → validated `RunConfig` → load local model + probe capabilities → load benchmark (+ optional matched control) → `build_report` runs guided overlap (if generation supported), Min-K%++ (if full distribution supported; calibrated only with a control), and canonical-order test (if logprobs supported) → `combine_indices` renormalizes base weights **0.5 guided / 0.3 Min-K%++ / 0.2 order** over active methods → bands (<0.2 low, <0.5 moderate, else high) → bootstrap 95% CI + caveats + skipped methods → stdout summary + optional JSON/CSV/HTML; `serve` runs the same pipeline through the cached-model web UI.
- **Tests / CI:** **30 test functions across 7 files** (pytest): calibration (3), canonical-order (4), end-to-end (4), guided (6), metrics (4), Min-K%++ (4), web (5). **NO CI**, there is no `.github/workflows` directory; pytest is declared but nothing runs it automatically.
- **Packaging / publication:** `contamcheckr` **v0.1.0**, `requires-python >=3.10`. **NOT on PyPI, confirmed 404** (`pypi.org/pypi/contamcheckr/json`). Install from source only. MIT. Single-commit repository (2026-06-06).
- **Install:** `python -m pip install .`; `contamcheckr run --model sshleifer/tiny-gpt2 --benchmark sample --limit 10 --output report.json --csv per_example.csv --html report.html`; `contamcheckr capabilities --model ...`; `contamcheckr serve --port 8000`.
- **Technologies:** Python 3.10+, PyTorch, HuggingFace Transformers + Datasets, NumPy, tqdm, pytest, stdlib `http.server`, setuptools.
- **Evidence / scale:** 30 tests; combined-index weights literally `{guided:0.5, minkpp:0.3, order:0.2}`; web server rejects non-loopback hosts; Min-K%++ contributes only with a matched control. No external/public benchmark bundled, only small synthetic fixtures (`sample_benchmark.jsonl` 30 lines, `sample_control.jsonl` 30 lines, plus 40-line clean/leak validation sets).
- **Limitations:** Results depend on model capability, prompts, tokenization, sample size, control quality. Weak models miss memorized text; capable models can overlap without memorization. Min-K%++ contributes nothing without a matched control. Order tests can respond to topical coherence. Paraphrasing/dedup/fine-tuning/evasion reduce detection. Validation is a single seeded synthetic run on tiny-gpt2, not evidence about real benchmarks or large models. Guided overlap contributed zero in all three validation runs. Output is an evidence signal, never proof of membership. No CI, not on PyPI. **No image assets in the repo.**
- **Approval-gated claims:** The controlled-validation numbers (adapted tiny-gpt2 0.492 leak vs 0.008 clean / 0.131 base; separation 0.362; Min-K%++ AUC 1.000), the distilgpt2/SST-2 10-example example (0.275), and any phrasing implying detection on real/production models must carry their synthetic-run framing. **Never imply PyPI installability**, confirmed not published. **Needs user approval.**
- **Status:** Working alpha (v0.1.0). Functional CLI + loopback web UI with a tested core pipeline and a documented controlled validation run; no CI, not published, single-commit.

---

## 4. Earlier-Work Candidates

| Project                   | Purpose                                                                                                                                    | Tech                                                                                                            | Status    | Live link / works                                       | Last update            | Inclusion decision                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prompt-Budd**           | Chrome extension + FastAPI backend + MCP tool that enhances/scores LLM prompts inline, detects PII, recommends models, summarizes sessions | Python, FastAPI, Manifest-v3 extension, FastMCP, Gemini/OpenAI/Groq, Docker, Cloud Run, GitHub Actions CI/CD    | Active    | **https://promtbud.com/, verified 200 OK**              | 2026-03-26 (`0c99024`) | **Include, strongest secondary.** Below flagship prominence.                                                                                                           |
| **AskRC**                 | End-to-end MLOps RAG chatbot over Northeastern Research Computing docs (scrape → Azure Search → Airflow/DVC/MLflow → Streamlit)            | Python, Streamlit, Azure Cognitive Search + Blob, Airflow, DVC, MLflow, OpenAI, Docker, pytest, GitHub Actions  | Archived  | None (Azure + NEU-specific; not independently runnable) | 2024-12-01 (`e0f1b85`) | **Historical/academic label.** Good MLOps breadth; date + team context. Low-medium prominence.                                                                         |
| **GenBI**                 | NL data-analysis API: upload dataset, ask in English, get charts/tables/text                                                               | Python, FastAPI, LangChain, GPT-4o, Plotly, Pandas, Firebase, Vercel                                            | Prototype | None (API-only, no frontend in repo)                    | 2026-03-26 (`e5e685c`) | **Include, low prominence** (or historical). Do not overstate as a finished app.                                                                                       |
| **Visioncraft**           | Text-to-video: Gemini script → Replicate images → GCP TTS → AssemblyAI captions → Remotion render                                          | Next.js 15, React 19, Remotion, Gemini, Replicate, GCP TTS, AssemblyAI, Clerk, Neon/Drizzle, Firebase, Tailwind | Prototype | None                                                    | 2025-02-26 (`8cd3a92`) | **Earlier work with a real written description, historical.** README is untouched create-next-app boilerplate; must write a real description. Not flagship prominence. |
| **self-healing-pipeline** | ML anomaly-detection data pipeline with automated repair + monitoring dashboard                                                            | Python, Flask, scikit-learn (Isolation Forest), pandas, SQLite, Slack webhooks                                  | Prototype | None                                                    | 2026-03-26 (`fa42b5f`) | **Historical or omit.** **Do NOT repeat the unverified "85%+ repair success" / "production-grade" claims.** No tests, no Dockerfile present despite README.            |
| **weather-dashboard**     | "Nimbus" React + Flask weather app (current + 5-day, adaptive UI)                                                                          | React 19, Axios, Flask, Flask-CORS, OpenWeatherMap                                                              | Prototype | None                                                    | 2026-03-22 (`7a776bd`) | **Omit (or lowest prominence).** Common beginner project; least distinctive.                                                                                           |

**Excluded forks (do not list as Hari's work):** `langgraph`, `litellm`, `MLOps`.

---

## 5. Project Inclusion Score

Scored 1-5 per dimension (Technical depth, Product clarity, Evidence, Documentation, Testing, Visual material, Current relevance, Differentiation, Public readiness). Max total 45. The four approved flagships retain top tier, no serious factual reason to demote any emerged.

| Project                   | Tech | Product | Evid. | Docs | Test | Visual | Relev. | Diff. | Public | Total /45 | Tier         |
| ------------------------- | ---- | ------- | ----- | ---- | ---- | ------ | ------ | ----- | ------ | --------- | ------------ |
| **Code Review Arena**     | 5    | 5       | 5     | 5    | 5    | 1      | 5      | 5     | 4      | **40**    | Flagship     |
| **DebugBrief**            | 5    | 5       | 5     | 5    | 5    | 2      | 5      | 5     | 5      | **42**    | Flagship     |
| **Helm Browser Agent**    | 5    | 5       | 4     | 4    | 4    | 1      | 5      | 5     | 3      | **36**    | Flagship     |
| **ContamCheckr**          | 5    | 4       | 4     | 4    | 3    | 1      | 5      | 5     | 2      | **33**    | Flagship     |
| **Prompt-Budd**           | 4    | 4       | 4     | 4    | 2    | 2      | 4      | 3     | 5      | **32**    | Earlier Work |
| **AskRC**                 | 4    | 3       | 3     | 4    | 3    | 1      | 2      | 3     | 2      | **25**    | Historical   |
| **GenBI**                 | 3    | 3       | 2     | 3    | 1    | 1      | 3      | 3     | 2      | **21**    | Earlier Work |
| **Visioncraft**           | 4    | 2       | 2     | 1    | 1    | 1      | 2      | 4     | 2      | **19**    | Historical   |
| **self-healing-pipeline** | 3    | 3       | 2     | 3    | 1    | 1      | 2      | 3     | 2      | **20**    | Historical   |
| **weather-dashboard**     | 2    | 3       | 2     | 3    | 1    | 1      | 2      | 1     | 2      | **17**    | Omit         |

Scoring notes: Visual scores are uniformly low because only DebugBrief ships an image asset (see §6). DebugBrief leads on public readiness (PyPI-published, multi-OS CI matrix). ContamCheckr's lower testing/public-readiness reflects 30 tests, no CI, and not-published status. Helm's public-readiness is constrained by no packaging and local-only operation. self-healing-pipeline and weather-dashboard are scored as historical/omit on differentiation and evidence.

---

## 6. Visual-Asset Inventory

| Project            | Image assets in repo                | Implication                                                                                |
| ------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| Code Review Arena  | None                                | Build artifacts must be **generated** (diagrams, terminal captures, evidence-bundle views) |
| Helm Browser Agent | None                                | Same, generated diagrams / terminal / evidence only                                        |
| DebugBrief         | **`docs/demo.gif`** (terminal demo) | The only real image asset; usable, but verify it reflects current behavior                 |
| ContamCheckr       | None                                | Generated diagrams / report screenshots only                                               |
| All earlier work   | None verified                       | Generated artifacts only                                                                   |

**Rule:** Only DebugBrief has an existing image asset (`docs/demo.gif`). For every other system, all visual/build artifacts in the portfolio must be **generated**, architecture diagrams, terminal recordings, real report/evidence output, **never fabricated screenshots, photos, or video**. The portfolio brief also forbids any photo, video, or fake social/awards/publications, and the hero must be an interactive systems visualization, not a portrait.

---

## 7. Missing Facts / Could-Not-Verify

**Needs user approval (Hari):**

- **LinkedIn URL**, not known; do not invent one. List as a remaining user input.
- **KL University** (Research Assistant) and **Rlogical Techsoft** (Research Intern), old-site-only, not on the resume; do not publish as professional experience without approval.
- All employer **metric figures** (§2), sourced to Hari's resume but treat as "approved via resume"; confirm presentation/provenance.
- Per-system **approval-gated claims** listed in §3 (Code Review Arena run numbers, Helm test-count framing and absence of any success-rate, DebugBrief test-count/CI-status/PyPI-state/guarantees, ContamCheckr synthetic-validation framing).

**Could not verify:**

- **Old portfolio stack and design**, the `harihkk.github.io` clone is an empty 1-byte README; no HTML/CSS/JS/assets recoverable. Any claim about the old site's look would be fabrication.
- **KL University degree and dates**, unconfirmed; likely undergraduate institution per old site, but no source confirms it.
- **DebugBrief PyPI live state / version / adoption numbers**, README and pyproject reference `pypi.org/project/debugbrief/`, but this audit did not access PyPI; confirm live at 1.3.0 before stating publicly. (ContamCheckr's PyPI absence **was** verified: 404.)
- **DebugBrief multi-version CI green status**, the "3.9-3.14, Linux+macOS" claim reflects CI configuration, not observed passing runs in this clone.
- **Helm license**, GitHub API reported none; README states MIT. Treated as MIT per author; flag for confirmation.
- **Live success / reliability rates** for Helm (and any agent), not measured anywhere in the repos; do not publish a number.

**Must never be published (hard rules):**

- The **phone number** on the resume, exists but must never appear publicly.
- Public contact is **email `harikrishnak2426@zohomail.com`** and **GitHub `github.com/harihkk`** only. (Note: the audit also observed `kancharla.ha@northeastern.edu` in git metadata and `harikrishnak2426@zohomail.com` as the brief's stated public email, use the brief's public email.)
- No fabricated social accounts, awards, publications, photos, or video. The Research Desk must surface **external** papers Hari engages with (the 15 arXiv-verified papers in the audit JSON), never presented as Hari's own authored work.
- The old site's dark "chaos-mode" theme and physics/sandbox canvas are intentionally **not** carried into v2.
