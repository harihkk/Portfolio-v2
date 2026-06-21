import { systemSchema, validateContent, type System } from "@/lib/validation";

/* =========================================================================
   FLAGSHIP SYSTEMS, full case-study data.
   Every field is grounded in the audited repositories (docs/audit/). Prose is
   rewritten, not copied. Counts, statuses, and packaging match the provenance
   ledger and were verified at the commit SHAs recorded below.
   ========================================================================= */

const data: System[] = [
  // ====================================================== Code Review Arena
  {
    slug: "code-review-arena",
    title: "Code Review Arena",
    subtitle: "Execution-backed evaluation for AI code-review agents",
    index: "01",
    status: "alpha",
    domains: ["evaluation", "developer-infrastructure"],
    oneLiner:
      "A local benchmark that measures whether an AI reviewer can both find a seeded bug and supply a patch that actually applies and passes tests, scoring detection separately from validated repair.",
    problem:
      "AI code-review benchmarks tend to reward a sharp-looking comment without checking whether any proposed fix actually works, and reviewers can quietly game them through leaked metadata or pre-patch test output that discloses the expected answer.",
    failureMode:
      "When detection counts as success, a model that names ten bugs but fixes none scores as well as one that repairs them all. Plausible review is mistaken for working repair, and the benchmark stops measuring the thing that matters.",
    thesis:
      "Trustworthy evaluation needs execution-backed proof of a working fix, not credit for a plausible comment. So detection and validation are scored separately, the reviewer payload is blind, and both reviewers and benchmark packs are treated as adversarial with tamper-evident, reproducible runs.",
    howItWorks:
      "Each case is a seeded pull request, before/after code, a diff, hidden tests, a reference patch, and a manifest declaring ground truth, required tests, and structural validators. The reviewer receives a blind payload (the diff plus a bounded set of files, with no title, category, severity, ground truth, or pre-patch test output) and returns findings and an optional patch. The harness scores detection deterministically, then applies the single repair patch in an isolated copied workspace, runs the required tests (Docker-isolated or trusted-local) with the hidden tests pinned read-only and tamper-detected, and runs structural validators. Detection and validation are scored on separate axes, and every run seals a content-addressed evidence bundle with a manifest of the harness version, git SHA, and pack checksum.",
    flow: [
      "Review",
      "Detection",
      "Patch",
      "Apply",
      "Test",
      "Structural validation",
      "Score",
    ],
    architecture: [
      {
        component: "Benchmark runner",
        path: "arena/benchmark/benchmark_runner.py",
        role: "Orchestrates diff → reviewer → patch → apply → tests → validators → score; classifies run status; seals the evidence bundle.",
      },
      {
        component: "Reviewers",
        path: "arena/reviewers/",
        role: "Deterministic controls, the reference-patch loader, a shallow-patch adversarial baseline, a custom-command wrapper, and an OpenAI-compatible HTTP reviewer.",
      },
      {
        component: "Execution",
        path: "arena/execution/",
        role: "Docker and trusted-local test backends with resource limits, sandbox materialization, and before/after tamper manifests for hidden tests.",
      },
      {
        component: "Patching",
        path: "arena/patching/",
        role: "Applies the reviewer patch with integrity guards that reject edits to tests, config, protected paths, and absolute/.. diff paths.",
      },
      {
        component: "Scoring & validators",
        path: "arena/scoring/ · arena/validators/",
        role: "Deterministic detection scoring plus comment-stripped structural validators (Python AST, JS/SQL static, RAG checks).",
      },
      {
        component: "Reports & dashboard",
        path: "arena/reports/ · dashboard/",
        role: "JSON/Markdown/HTML reports and a Next.js dashboard with leaderboard, per-pack reports, cases, and methodology.",
      },
    ],
    keyComponents: [
      {
        name: "run_benchmark / _evaluate_case",
        path: "arena/benchmark/benchmark_runner.py",
        what: "End-to-end pipeline, run-status classification, budgets, manifest and evidence-bundle sealing.",
      },
      {
        name: "controls + reference-patch",
        path: "arena/reviewers/",
        what: "Deterministic controls (keyword_gamer, bad_patch, detects_no_patch, …) that prove the metric separation.",
      },
      {
        name: "patch_applier",
        path: "arena/patching/patch_applier.py",
        what: "Applies a patch under integrity guards so a reviewer cannot edit the tests it is graded against.",
      },
    ],
    evidence: [
      {
        type: "Tests",
        detail: "306 test functions across 37 files.",
        source: "tests/ @ 656b401",
        strength: "execution",
      },
      {
        type: "CI",
        detail:
          "Five-job CI: backend gate, Docker execution, packaging, dashboard build, Windows-safety. Actions pinned by SHA.",
        source: ".github/workflows/ci.yml",
        strength: "execution",
      },
      {
        type: "Benchmark",
        detail:
          "30 cases across three packs; each pack ships a content checksum (pack.sha256).",
        source: "benchmark_sets/",
        strength: "deterministic",
      },
      {
        type: "Worked example",
        detail:
          "The keyword_gamer control detects all ten audit_v1 bugs (1.000) yet validates none (0.000); reference-patch validates all ten.",
        source: "README.md",
        strength: "documented",
      },
    ],
    limitations: [
      "Packs are curated and small, 30 cases total across the three sets.",
      "Concept matching is lexical (curated keywords), not semantic, so well-paraphrased findings can be under-credited; the execution metrics are unaffected.",
      "Structural validators are hand-authored heuristics that may reject alternate valid repairs, tests are the real gate.",
      "Passing tests is execution evidence, not proof of complete correctness.",
      "A local audit harness, not a large-scale public ranking; the API server is explicitly not hardened for public exposure.",
      "Ships deterministic controls and a reference patch only, running a real model requires the custom-command or HTTP reviewer.",
    ],
    technologies: [
      "Python 3.11+",
      "Typer",
      "Pydantic v2",
      "FastAPI",
      "SQLite",
      "Docker",
      "pytest + hypothesis",
      "Next.js dashboard",
    ],
    install: [
      "python3 -m venv .venv && source .venv/bin/activate",
      'python -m pip install -e ".[dev]"',
      "arena validate benchmark_sets/audit_v1",
      "arena run benchmark_sets/audit_v1 --reviewer reference-patch --mode full --allow-local-execution",
    ],
    repo: "https://github.com/harihkk/code-review-arena",
    demo: "",
    docs: "https://github.com/harihkk/code-review-arena/tree/main/docs",
    published: "",
    lastVerifiedCommit: "656b401",
    lastVerifiedDate: "2026-06-21",
    relatedPaperIds: ["swe-bench", "humaneval", "self-debug"],
    relatedNoteSlugs: ["why-detecting-a-bug-is-not-repairing-it"],
    provenanceIds: ["cra-tests", "cra-cases", "cra-ci", "cra-gap"],
  },

  // ====================================================== Helm Browser Agent
  {
    slug: "helm-browser-agent",
    title: "Helm Browser Agent",
    subtitle: "A browser runtime that only claims success it can prove",
    index: "02",
    status: "active",
    domains: ["agent-reliability"],
    oneLiner:
      "Drive a real browser with plain English. Helm turns an instruction into a structured intent, plans one safe action at a time, and reports a task done only when a validator can prove it from the visible page.",
    problem:
      "Natural-language browser agents fail in ways that matter: they paste the raw instruction into a search box, declare success because a page rendered, or emit actions the underlying engine cannot run. They also depend on one LLM provider whose free-tier quota runs out, and they navigate to whatever URL a model picks, including private or cloud-metadata addresses influenced by untrusted page text.",
    failureMode:
      "A faked completion is worse than an honest failure: it hides that nothing happened. The common shortcut, 'the page loaded, so we're done', produces confident agents that quietly do the wrong thing.",
    thesis:
      "A browser agent earns trust by being auditable and honest. Route every instruction through a fixed, testable pipeline; let the engine execute only whitelisted actions; gate completion on visible-page evidence; and report precise structured blockers (or 'unverified') instead of faking success.",
    howItWorks:
      "Every task runs through one pipeline rather than a raw prompt to the browser. A deterministic normalizer cleans the prompt; an intent planner builds a structured intent that separates command words from the content to act on and declares an explicit success condition. A risk layer pauses high-impact actions for confirmation. A deterministic planner handles high-confidence routes; only when none applies does the LLM choose the single next action. Each action is validated against a central registry, executed via Playwright, and the resulting page is observed. A loop detector triggers recovery. Completion is gated by evidence-based validators, a run is 'completed' only when a validator can prove the outcome, otherwise it ends 'unverified' or 'blocked'. The LLM provider is a cascade (Groq → Gemini → local Ollama) with quota-aware short-circuiting, and a deterministic SSRF guard checks every URL before navigation.",
    flow: ["Perceive", "Decide", "Act", "Verify", "Recover"],
    architecture: [
      {
        component: "API surface",
        path: "api/main.py",
        role: "FastAPI app serving the SPA, a /ws/advanced streaming endpoint, and REST routes for tasks, templates, workflows, and recordings.",
      },
      {
        component: "Intent pipeline",
        path: "core/prompt_normalizer.py · core/intent_planner.py",
        role: "Deterministic prompt cleanup and a structured BrowserIntent with command/content separation and high-confidence routing before any LLM step.",
      },
      {
        component: "Action registry",
        path: "core/action_registry.py",
        role: "The single source of truth for actions the engine can run; rejects unknown actions and non-executable planner concepts.",
      },
      {
        component: "Risk · validators · blockers",
        path: "core/risk.py · core/validators.py · core/blockers.py",
        role: "Confirmation gate for high-impact actions, evidence-based completion validators, and a typed blocker taxonomy.",
      },
      {
        component: "Orchestrator & engine",
        path: "core/task_orchestrator.py · core/browser_engine.py",
        role: "The plan-execute-observe-validate loop with loop detection and recovery, over a Playwright wrapper with page-state observation.",
      },
      {
        component: "Provider cascade",
        path: "core/ai_agent.py",
        role: "Groq → Gemini → Ollama with daily-quota short-circuiting and robust JSON parsing.",
      },
      {
        component: "SSRF guard",
        path: "core/url_policy.py",
        role: "Every navigation passes a deterministic gate blocking non-http(s), private/loopback, and cloud-metadata addresses.",
      },
    ],
    keyComponents: [
      {
        name: "SophisticatedTaskOrchestrator",
        path: "core/task_orchestrator.py",
        what: "Plan-execute-observe-validate loop with loop detection, recovery, and a shared-browser run lock.",
      },
      {
        name: "validate_completion + VALIDATORS",
        path: "core/validators.py",
        what: "Composable validators that gate the 'completed' state from visible page evidence.",
      },
      {
        name: "url_policy SSRF guard",
        path: "core/url_policy.py",
        what: "Blocks non-http(s), private/loopback/metadata, and packed-IP bypasses before the browser opens a URL.",
      },
    ],
    evidence: [
      {
        type: "Tests",
        detail:
          "192 test functions across 16 files, including 40 URL/SSRF policy tests and an offline end-to-end WebSocket test.",
        source: "tests/unit @ 784af0a",
        strength: "execution",
      },
      {
        type: "CI",
        detail:
          "GitHub Actions runs an AST syntax check and the offline unittest suite on every push and PR.",
        source: ".github/workflows/test.yml",
        strength: "execution",
      },
      {
        type: "Safety",
        detail:
          "High-impact actions (purchase, checkout, send, submit, delete, post, account changes) pause for explicit confirmation.",
        source: "core/risk.py",
        strength: "deterministic",
      },
      {
        type: "Honest states",
        detail:
          "'unverified' and typed 'blocked' are real terminal states, the agent does not fake completion.",
        source: "core/blockers.py",
        strength: "documented",
      },
    ],
    limitations: [
      "Runs locally only, there is no hosted version.",
      "Requires at least one configured provider (Groq, Gemini, or Ollama); the cascade mitigates but cannot eliminate quota exhaustion.",
      "The SSRF guard validates the literal host unless a DNS resolver is supplied, leaving a documented DNS-rebinding window.",
      "CI runs offline unit/integration/E2E tests; it does not install a real browser or exercise live sites.",
      "Real-world task success rates on live sites are not measured anywhere in the repo, no success rate is claimed.",
      "Not packaged or published; install is git-clone plus make.",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "WebSockets",
      "Playwright",
      "Groq / Gemini / Ollama",
      "Pydantic",
      "aiosqlite",
      "unittest",
    ],
    install: [
      "git clone https://github.com/harihkk/Helm-browser-agent.git",
      "cd Helm-browser-agent",
      "cp .env.example .env   # add Groq, Gemini, or Ollama settings",
      "make dev   # venv + deps + Chromium",
      "make run   # server on http://localhost:8000",
    ],
    repo: "https://github.com/harihkk/Helm-browser-agent",
    demo: "",
    docs: "",
    published: "",
    lastVerifiedCommit: "784af0a",
    lastVerifiedDate: "2026-06-09",
    relatedPaperIds: ["webarena", "mind2web", "webshop", "toolllm", "api-bank"],
    relatedNoteSlugs: ["why-browser-agents-need-state-and-recovery"],
    provenanceIds: ["helm-tests", "helm-cascade", "helm-completion", "helm-ssrf"],
  },

  // ====================================================== DebugBrief
  {
    slug: "debugbrief",
    title: "DebugBrief",
    subtitle: "An honest record of what actually happened while you debugged",
    index: "03",
    status: "published",
    domains: ["developer-infrastructure"],
    oneLiner:
      "A local-first, AI-free CLI that records the commands you run and the notes you write while debugging, then builds an evidence-only Markdown brief for a pull request, a handoff, or an incident.",
    problem:
      "The proof of a fix, what you tried, what failed, what finally passed, which files changed, lives only in scrollback and memory. Reconstructing it into a PR description or incident note is manual and lossy, and people routinely overstate results, claiming a test passed that they never actually saw go green.",
    failureMode:
      "Engineering write-ups drift from evidence. A summary that infers a root cause, or reports a green test that never ran, is confidently wrong in exactly the place people trust it most.",
    thesis:
      "An honest debugging report should be derived only from recorded evidence, never inferred. DebugBrief is a dependency-light, Unix-only CLI that captures commands under a pseudo-terminal and emits deterministic, evidence-only briefs, every empty section omitted, nothing invented, no AI in the loop.",
    howItWorks:
      "You start a session and run commands through it. Each `run` executes under a pseudo-terminal in its own process group, streaming output live while storing a bounded preview, the real exit code, the duration, and a per-command git snapshot. A command is classified by token patterns (pytest, jest, go test, cargo test, and more), and pass/fail comes strictly from the exit code, a command counts as verified only when a recognized runner actually exits 0. Secrets are redacted before anything is written to disk. On `end`, the tool reconstructs the red-to-green window, the reproduce and verify commands, the observed error, and the ruled-out attempts from the recorded events alone, and renders a PR, handoff, or incident report. File changes across the fix window are reported as correlation, never proven cause.",
    flow: ["Run", "Record", "Fix", "Verify", "Brief"],
    architecture: [
      {
        component: "CLI",
        path: "src/debugbrief/cli.py",
        role: "Entry point and all subcommands (start, note, run, redo, preview, end, doctor, recover, …).",
      },
      {
        component: "Command runner",
        path: "src/debugbrief/command_runner.py",
        role: "Pseudo-terminal capture with bounded output, process-group termination, timeout handling, and escape-sequence sanitization.",
      },
      {
        component: "Classifier",
        path: "src/debugbrief/filters.py",
        role: "Token-pattern test/build/lint detection, wrapper unwrapping, and shell-reliability analysis.",
      },
      {
        component: "Derivations",
        path: "src/debugbrief/derive.py",
        role: "Evidence-only derivation of the red-to-green window, reproduce/verify commands, observed error, and ruled-out attempts.",
      },
      {
        component: "Reporters",
        path: "src/debugbrief/reporters/",
        role: "Mode-specific Markdown for PR, handoff, and incident, plus a JSON form of the same evidence.",
      },
      {
        component: "Redaction & safety",
        path: "src/debugbrief/redaction.py · paths.py",
        role: "Best-effort secret scrubbing at capture time; symlink/special-file refusal and 0700/0600 permissions.",
      },
    ],
    keyComponents: [
      {
        name: "_detect_red_to_green",
        path: "src/debugbrief/derive.py",
        what: "Finds the same command failing then later passing in the same directory, and correlates file changes across the window.",
      },
      {
        name: "classify_command",
        path: "src/debugbrief/filters.py",
        what: "Marks a command verified only on a real exit 0 from a recognized runner.",
      },
      {
        name: "redact_text",
        path: "src/debugbrief/redaction.py",
        what: "Scrubs secret-shaped values before any disk write.",
      },
    ],
    evidence: [
      {
        type: "Published",
        detail: "On PyPI as debugbrief v1.3.0 (three releases, v1.1.0-v1.3.0).",
        source: "pypi.org/project/debugbrief",
        strength: "documented",
      },
      {
        type: "Tests",
        detail: "376 test functions across 29 files.",
        source: "tests/ @ d5c1df6",
        strength: "execution",
      },
      {
        type: "CI matrix",
        detail: "Linux and macOS across Python 3.9 through 3.14, every release.",
        source: ".github/workflows/ci.yml",
        strength: "execution",
      },
      {
        type: "No AI",
        detail: "No AI, no network requests, no telemetry; reports are built only from recorded evidence.",
        source: "README.md + SECURITY.md",
        strength: "documented",
      },
    ],
    limitations: [
      "Capture is explicit through `debugbrief run`; only a bounded preview is stored, so there is no full transcript.",
      "Full-screen TUIs (vim, htop) are not meaningfully captured, record their outcome with a note.",
      "Redaction is conservative and best effort; it does not catch every secret.",
      "Git sections require native git; outside a repository they are omitted.",
      "Unix-only, Linux and macOS are tested; native Windows and PowerShell are not supported.",
    ],
    technologies: [
      "Python (stdlib-only runtime)",
      "POSIX pseudo-terminals",
      "native git",
      "pytest",
      "ruff",
      "mypy",
      "GitHub Actions",
      "PyPI",
    ],
    install: [
      "pipx install debugbrief   # or: uv tool install debugbrief",
      'debugbrief start "Fix add() returning wrong result"',
      "debugbrief run -- pytest -q test_calc.py   # fails",
      "debugbrief redo   # after the fix, now passes",
      "debugbrief end   # writes the PR brief",
    ],
    repo: "https://github.com/harihkk/Debug-Brief",
    demo: "",
    docs: "https://github.com/harihkk/Debug-Brief/blob/main/docs/COMMANDS.md",
    published: "https://pypi.org/project/debugbrief/",
    lastVerifiedCommit: "d5c1df6",
    lastVerifiedDate: "2026-06-21",
    relatedPaperIds: ["self-debug", "swe-bench"],
    relatedNoteSlugs: ["debugging-summaries-should-preserve-uncertainty"],
    provenanceIds: ["db-pypi", "db-tests", "db-ci-matrix", "db-no-ai"],
  },

  // ====================================================== ContamCheckr
  {
    slug: "contamcheckr",
    title: "ContamCheckr",
    subtitle: "Benchmark-contamination evidence, with the caveats kept in",
    index: "04",
    status: "alpha",
    domains: ["evaluation"],
    oneLiner:
      "A local, CPU-friendly auditor that produces a caveated evidence score for benchmark contamination in causal language models, guided reproduction, control-calibrated Min-K%++, and a canonical-order permutation test, never a binary verdict.",
    problem:
      "Language models are increasingly trained on web-scraped corpora that may include the very benchmarks used to evaluate them, inflating reported scores. Existing detectors tend to emit overconfident binary 'was/was not in training' verdicts, often depend on cloud access or logits a model does not expose, and rarely pair Min-K-style scores with a matched control.",
    failureMode:
      "A contamination tool that outputs 'contaminated' or 'clean' invites a conclusion the evidence cannot support. The honest unit is a calibrated signal with its uncertainty attached, not a label.",
    thesis:
      "Benchmark contamination should be surfaced as a transparent, locally-computable evidence score with explicit method gating and caveats, not an overconfident binary verdict.",
    howItWorks:
      "ContamCheckr loads a local Hugging Face causal model and probes which signals it can produce (generation, sequence log-likelihood, full next-token distribution). It then runs up to three independent methods: guided overlap (reproduce the second half of each example with and without the dataset named, scoring the gap), Min-K%++ (which only becomes a calibrated index when a matched control set is supplied), and a canonical-order permutation test (comparing published order against seeded permutations). The method indices are combined with fixed base weights, renormalized over whichever methods produced usable evidence, mapped to low/moderate/high bands, and reported with a bootstrap confidence interval, a list of caveats, and the methods that were skipped and why. The output is explicitly evidence with uncertainty, not proof of training-set membership.",
    flow: ["Candidate", "Signals", "Calibrate", "Confidence", "Report"],
    architecture: [
      {
        component: "CLI",
        path: "contamcheckr/cli.py",
        role: "capabilities, run, and serve subcommands wired to the same pipeline.",
      },
      {
        component: "Model backend",
        path: "contamcheckr/model.py",
        role: "A Hugging Face causal-LM wrapper providing generation, a token log-prob table, and sequence log-likelihood.",
      },
      {
        component: "Methods",
        path: "contamcheckr/methods/",
        role: "Guided overlap, Min-K%++ scoring, and the canonical-order permutation test.",
      },
      {
        component: "Calibration & combination",
        path: "contamcheckr/calibration.py",
        role: "Control-AUC calibration of Min-K%++, weight renormalization over active methods, banding, and bootstrap intervals.",
      },
      {
        component: "Reports",
        path: "contamcheckr/report.py · html_report.py",
        role: "JSON, per-example CSV, and standalone HTML with caveats and skipped-method reasons.",
      },
      {
        component: "Local web UI",
        path: "contamcheckr/web.py",
        role: "A stdlib http.server dashboard, loopback-only, exposing the same pipeline and downloadable artifacts.",
      },
    ],
    keyComponents: [
      {
        name: "build_report",
        path: "contamcheckr/report.py",
        what: "Gates each method on probed capabilities and assembles the report with caveats and skipped methods.",
      },
      {
        name: "calibrate_minkpp",
        path: "contamcheckr/calibration.py",
        what: "Turns raw Min-K%++ scores into a calibrated index via benchmark-vs-control AUC; returns nothing without a control.",
      },
      {
        name: "combine_indices",
        path: "contamcheckr/calibration.py",
        what: "Renormalizes the method weights over whatever produced usable evidence and assigns the band.",
      },
    ],
    evidence: [
      {
        type: "Tests",
        detail: "30 test functions across 7 files.",
        source: "tests/ @ fbbc85e",
        strength: "execution",
      },
      {
        type: "Method gating",
        detail:
          "Min-K%++ contributes only when a matched control is supplied; weights renormalize over active methods.",
        source: "calibration.py · report.py",
        strength: "deterministic",
      },
      {
        type: "Controlled validation",
        detail:
          "A tiny model fine-tuned on a synthetic leak set scored higher on the leak set than on a held-out clean set, the separation the index is meant to surface (a controlled experiment, not a claim about any real model).",
        source: "docs/VALIDATION.md",
        strength: "documented",
      },
      {
        type: "Safe by default",
        detail: "The local web server refuses to bind to non-loopback addresses.",
        source: "web.py",
        strength: "deterministic",
      },
    ],
    limitations: [
      "Results depend on model capability, prompts, tokenization, sample size, and control quality.",
      "A weak model can fail to reproduce memorized text; a capable model can produce overlap without memorization.",
      "Min-K%++ contributes nothing without a matched control; order tests can respond to ordinary document coherence.",
      "Paraphrasing, deduplication, fine-tuning, and deliberate evasion can all reduce detection.",
      "Validation is a single seeded run on synthetic data with a very small model, not evidence about real benchmarks or large models.",
      "The output is an evidence signal, never proof of training-set membership. No CI; installed from source, not on PyPI.",
    ],
    technologies: [
      "Python 3.10+",
      "PyTorch",
      "Hugging Face Transformers",
      "Hugging Face Datasets",
      "NumPy",
      "pytest",
      "stdlib http.server",
    ],
    install: [
      "python -m pip install .",
      "contamcheckr run --model sshleifer/tiny-gpt2 --benchmark sample --limit 10 --output report.json",
      "contamcheckr serve --port 8000   # same pipeline, local web UI",
    ],
    repo: "https://github.com/harihkk/contamination-checker",
    demo: "",
    docs: "https://github.com/harihkk/contamination-checker/tree/main/docs",
    published: "",
    lastVerifiedCommit: "fbbc85e",
    lastVerifiedDate: "2026-06-06",
    relatedPaperIds: [
      "livecodebench",
      "rephrased-contamination",
      "plain-text-test-data",
    ],
    relatedNoteSlugs: ["how-to-read-contamination-evidence"],
    provenanceIds: ["cc-tests", "cc-bands", "cc-not-pypi"],
  },
];

export const systems: System[] = data.map((s) =>
  validateContent(systemSchema, s, `system:${s.slug}`),
);

const bySlug = new Map(systems.map((s) => [s.slug, s]));

export function getSystem(slug: string): System | undefined {
  return bySlug.get(slug);
}

export const systemSlugs = systems.map((s) => s.slug);
