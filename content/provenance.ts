import { z } from "zod";
import {
  provenanceRecordSchema,
  type ProvenanceRecord,
  validateContent,
} from "@/lib/validation";

/* =========================================================================
   PROVENANCE LEDGER
   Every material public claim on the site traces to one record here.
   Records with publicApproved:false are NEVER rendered (see getApproved /
   isApproved). Held-for-approval items are kept here on purpose so the gap
   is visible and auditable rather than silently dropped.
   Verified 2026-06-21 against the commit SHAs in docs/audit/commit-shas.md.
   ========================================================================= */

const VERIFIED = "2026-06-21";

const records: z.input<typeof provenanceRecordSchema>[] = [
  // ---------------------------------------------------------------- identity
  {
    id: "exp-years",
    text: "More than four years building production LLM, retrieval, and agentic systems.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Summary",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "location-boston",
    text: "Based in Boston, Massachusetts.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, header",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "bio-coffee",
    text: "i run on coffee. the code barely runs.",
    sourceType: "external",
    sourceLocation: "github.com/harihkk, profile bio",
    verifiedAt: VERIFIED,
    publicApproved: true,
    notes: "Hari's own GitHub bio. Used as the one approved human-tone detail.",
  },

  // ----------------------------------------------------- Morgan Stanley role
  {
    id: "ms-role",
    text: "AI Software Engineer at Morgan Stanley, Boston, MA, November 2024 to present.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Experience",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "ms-recall",
    text: "Hybrid retrieval (vector + BM25) with cross-encoder reranking improved recall@10 by 42%.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Morgan Stanley bullet 1",
    verifiedAt: VERIFIED,
    publicApproved: true,
    notes:
      "Employer metric from Hari's own résumé. Listed for sign-off in docs/public-content-review.md.",
  },
  {
    id: "ms-research-time",
    text: "Cut analyst research time by 35%.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Morgan Stanley bullet 1",
    verifiedAt: VERIFIED,
    publicApproved: true,
    notes: "Employer metric from résumé; flagged for sign-off.",
  },
  {
    id: "ms-latency",
    text: "Reduced p95 inference latency by 3.5x via ONNX Runtime, TensorRT, quantization, and batching.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Morgan Stanley bullet 5",
    verifiedAt: VERIFIED,
    publicApproved: true,
    notes: "Employer metric from résumé; flagged for sign-off.",
  },
  {
    id: "ms-throughput",
    text: "Kubernetes-hosted LLM services support 1M+ daily inference requests.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Morgan Stanley bullet 5",
    verifiedAt: VERIFIED,
    publicApproved: true,
    notes: "Employer metric from résumé; flagged for sign-off.",
  },
  {
    id: "ms-precision",
    text: "LoRA fine-tuning of LLaMA and Mistral improved domain-specific precision by 28% while cutting training cost 40%.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Morgan Stanley bullet 4",
    verifiedAt: VERIFIED,
    publicApproved: true,
    notes: "Employer metric from résumé; flagged for sign-off.",
  },

  // ----------------------------------------------------- Infinite Infolab
  {
    id: "ii-role",
    text: "Machine Learning Engineer at Infinite Infolab, India, May 2021 to July 2023.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Experience",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "ii-demand",
    text: "Ensemble forecasting across SKU clusters improved demand prediction accuracy by 27%.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Infinite Infolab bullet 1",
    verifiedAt: VERIFIED,
    publicApproved: true,
    notes: "Employer metric from résumé; flagged for sign-off.",
  },
  {
    id: "ii-mape",
    text: "LSTM models for seasonal SKUs reduced forecast error (MAPE) by 22%.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Infinite Infolab bullet 2",
    verifiedAt: VERIFIED,
    publicApproved: true,
    notes: "Employer metric from résumé; flagged for sign-off.",
  },
  {
    id: "ii-records",
    text: "ETL and feature pipelines processed 10M+ records; preprocessing time cut 55%.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Infinite Infolab bullet 3",
    verifiedAt: VERIFIED,
    publicApproved: true,
    notes: "Employer metric from résumé; flagged for sign-off.",
  },
  {
    id: "ii-serving",
    text: "FastAPI inference services on GCP served 50K+ daily prediction requests at 99.9% uptime.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Infinite Infolab bullet 4",
    verifiedAt: VERIFIED,
    publicApproved: true,
    notes: "Employer metric from résumé; flagged for sign-off.",
  },

  // ----------------------------------------------------- Education
  {
    id: "edu-ms",
    text: "M.S. in Data Analytics Engineering (concentration: Machine Learning), Northeastern University, Boston, May 2025.",
    sourceType: "resume",
    sourceLocation: "Hari_K_Resume_AI_SWE.pdf, Education",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },

  // ----------------------------------------------------- Code Review Arena
  {
    id: "cra-tests",
    text: "306 test functions across 37 test files.",
    sourceType: "tests-ci",
    sourceLocation: "code-review-arena tests/ @ 656b401 (grep -rE 'def test_')",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "cra-cases",
    text: "30 benchmark cases across three packs (v1, audit_v1, audit_v2; 10 each).",
    sourceType: "repo-code",
    sourceLocation: "code-review-arena benchmark_sets/ @ 656b401",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "cra-ci",
    text: "Five-job CI: backend gate, Docker execution, packaging, dashboard build, and Windows-safety checks.",
    sourceType: "tests-ci",
    sourceLocation: "code-review-arena .github/workflows/ci.yml @ 656b401",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "cra-gap",
    text: "On audit_v1 the keyword_gamer control detects all ten bugs (detection 1.000) yet validates none of its patches (validated 0.000), while reference-patch validates all ten.",
    sourceType: "repo-docs",
    sourceLocation: "code-review-arena README.md @ 656b401",
    verifiedAt: VERIFIED,
    publicApproved: true,
    notes:
      "Documented worked example in the README. Presented as the project's stated example, not a fresh run.",
  },

  // ----------------------------------------------------- Helm Browser Agent
  {
    id: "helm-tests",
    text: "192 test functions across 16 files, including 40 URL/SSRF policy tests.",
    sourceType: "tests-ci",
    sourceLocation:
      "Helm-browser-agent tests/unit @ 784af0a (grep -rE 'def test_')",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "helm-cascade",
    text: "Fault-tolerant provider cascade: Groq llama-3.3-70b → Gemini 2.0 Flash → local Ollama, with quota-aware short-circuiting.",
    sourceType: "repo-code",
    sourceLocation: "Helm-browser-agent core/ai_agent.py @ 784af0a",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "helm-completion",
    text: "A task is reported completed only when a validator can prove the outcome from the visible page; otherwise it ends 'unverified' or a structured 'blocked'.",
    sourceType: "repo-docs",
    sourceLocation:
      "Helm-browser-agent README.md + core/validators.py @ 784af0a",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "helm-ssrf",
    text: "Every navigation passes an SSRF guard that blocks non-http(s) schemes, private/loopback addresses, and cloud-metadata endpoints.",
    sourceType: "repo-code",
    sourceLocation: "Helm-browser-agent core/url_policy.py @ 784af0a",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },

  // ----------------------------------------------------- DebugBrief
  {
    id: "db-pypi",
    text: "Published on PyPI as debugbrief, version 1.3.0 (three releases, v1.1.0-v1.3.0).",
    sourceType: "github-release",
    sourceLocation:
      "pypi.org/project/debugbrief + Debug-Brief releases @ d5c1df6",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "db-tests",
    text: "376 test functions across 29 files.",
    sourceType: "tests-ci",
    sourceLocation: "Debug-Brief tests/ @ d5c1df6 (grep -rhE 'def test_')",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "db-ci-matrix",
    text: "Tested in CI on Linux and macOS across Python 3.9 through 3.14.",
    sourceType: "tests-ci",
    sourceLocation: "Debug-Brief .github/workflows/ci.yml @ d5c1df6",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "db-no-ai",
    text: "Uses no AI, makes no network requests, and collects no telemetry; reports are built only from recorded evidence.",
    sourceType: "repo-docs",
    sourceLocation: "Debug-Brief README.md + SECURITY.md @ d5c1df6",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },

  // ----------------------------------------------------- ContamCheckr
  {
    id: "cc-tests",
    text: "30 test functions across 7 files.",
    sourceType: "tests-ci",
    sourceLocation:
      "contamination-checker tests/ @ fbbc85e (grep -rE 'def test_')",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "cc-bands",
    text: "Combines guided overlap, control-calibrated Min-K%++, and a canonical-order permutation test into a caveated evidence score (low/moderate/high bands), not a membership verdict.",
    sourceType: "repo-docs",
    sourceLocation:
      "contamination-checker README.md + calibration.py @ fbbc85e",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "cc-not-pypi",
    text: "ContamCheckr is installed from source and is not published to PyPI.",
    sourceType: "package-metadata",
    sourceLocation:
      "pypi.org/pypi/contamcheckr/json → 404 (checked 2026-06-21)",
    verifiedAt: VERIFIED,
    publicApproved: true,
    notes: "Recorded to PREVENT a false 'available on PyPI' claim.",
  },

  // ----------------------------------------------------- Aggregate
  {
    id: "agg-tests",
    text: "900+ automated tests across the four flagship systems (306 + 376 + 192 + 30 = 904).",
    sourceType: "tests-ci",
    sourceLocation: "Sum of verified per-repo test counts @ audited SHAs",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },
  {
    id: "agg-systems",
    text: "Four flagship engineering systems.",
    sourceType: "repo-code",
    sourceLocation:
      "github.com/harihkk, code-review-arena, Helm-browser-agent, Debug-Brief, contamination-checker",
    verifiedAt: VERIFIED,
    publicApproved: true,
  },

  // ----------------------------------------------------- HELD FOR APPROVAL
  // (publicApproved:false, never rendered; tracked so the gap is visible.)
  {
    id: "held-kl-university",
    text: "KL University, India, Research Assistant (appears on the old portfolio).",
    sourceType: "external",
    sourceLocation: "harihkk.github.io (old site), not on current résumé",
    verifiedAt: VERIFIED,
    publicApproved: false,
    notes:
      "Not on the current résumé. Held until Hari confirms role, dates, and whether to show.",
  },
  {
    id: "held-rlogical",
    text: "Rlogical Techsoft, India, Research Intern (appears on the old portfolio).",
    sourceType: "external",
    sourceLocation: "harihkk.github.io (old site), not on current résumé",
    verifiedAt: VERIFIED,
    publicApproved: false,
    notes: "Not on the current résumé. Held until confirmed.",
  },
  {
    id: "held-undergrad",
    text: "Undergraduate degree and dates.",
    sourceType: "external",
    sourceLocation:
      "Not present in résumé; Northeastern grad email implies prior study",
    verifiedAt: VERIFIED,
    publicApproved: false,
    notes:
      "No verified source. Held until Hari supplies degree, institution, and dates.",
  },
  {
    id: "held-linkedin",
    text: "LinkedIn profile URL.",
    sourceType: "external",
    sourceLocation: "Résumé links 'LinkedIn' but the URL was not extractable",
    verifiedAt: VERIFIED,
    publicApproved: false,
    notes: "Hidden in UI until Hari provides the exact URL.",
  },
];

// Build-time validation of every record.
export const provenance: ProvenanceRecord[] = records.map((r, i) =>
  validateContent(provenanceRecordSchema, r, `provenance[${i}]:${r.id}`),
);

const byId = new Map(provenance.map((r) => [r.id, r]));

export function getProvenance(id: string): ProvenanceRecord | undefined {
  return byId.get(id);
}

export function isApproved(id: string): boolean {
  return byId.get(id)?.publicApproved === true;
}

/** Records safe to render. */
export const approvedProvenance = provenance.filter((r) => r.publicApproved);

/** Records intentionally held back, surfaced in the content-review doc/UI. */
export const heldProvenance = provenance.filter((r) => !r.publicApproved);
