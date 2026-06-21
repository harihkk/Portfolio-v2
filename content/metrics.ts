import { z } from "zod";
import { metricSchema, validateContent, type Metric } from "@/lib/validation";

/* =========================================================================
   VERIFIED NUMBERS (homepage "box score").
   Deliberately repo- and résumé-derived, evidence-flavoured numbers, not
   employer-confidential figures. Employer metrics live on /experience with
   résumé provenance. Counter animation only runs when `animate` is true and
   `value` is numeric; the `display` string is always rendered in server HTML.
   ========================================================================= */

const VERIFIED = "2026-06-21";

const data: z.input<typeof metricSchema>[] = [
  {
    id: "years",
    value: 4,
    display: "4+",
    suffix: "+",
    label: "Years building production AI",
    detail: "LLM, retrieval, agentic, and serving systems.",
    source: "Résumé summary",
    sourceType: "resume",
    approved: true,
    verifiedAt: VERIFIED,
    animate: true,
    provenanceId: "exp-years",
  },
  {
    id: "systems",
    value: 4,
    display: "4",
    label: "Flagship systems",
    detail: "Evaluation, agents, developer tools, contamination evidence.",
    source: "github.com/harihkk",
    sourceType: "repo-code",
    approved: true,
    verifiedAt: VERIFIED,
    animate: true,
    provenanceId: "agg-systems",
  },
  {
    id: "tests",
    value: 900,
    display: "900+",
    suffix: "+",
    label: "Automated tests across flagship systems",
    detail: "306 + 376 + 192 + 30 = 904, counted at the audited commits.",
    source: "Per-repo test suites",
    sourceType: "tests-ci",
    approved: true,
    verifiedAt: VERIFIED,
    animate: true,
    provenanceId: "agg-tests",
  },
  {
    id: "cases",
    value: 30,
    display: "30",
    label: "Benchmark cases in Code Review Arena",
    detail: "Three packs of ten, each with hidden tests and validators.",
    source: "code-review-arena/benchmark_sets",
    sourceType: "repo-code",
    approved: true,
    verifiedAt: VERIFIED,
    animate: true,
    provenanceId: "cra-cases",
  },
  {
    id: "releases",
    value: 3,
    display: "3",
    label: "Published DebugBrief releases",
    detail: "v1.1.0-v1.3.0, live on PyPI.",
    source: "Debug-Brief releases + PyPI",
    sourceType: "github-release",
    approved: true,
    verifiedAt: VERIFIED,
    animate: true,
    provenanceId: "db-pypi",
  },
  {
    id: "python-matrix",
    value: null,
    display: "3.9-3.14",
    label: "Python versions DebugBrief is CI-tested on",
    detail: "Linux and macOS, every release.",
    source: "Debug-Brief CI matrix",
    sourceType: "tests-ci",
    approved: true,
    verifiedAt: VERIFIED,
    animate: false,
    provenanceId: "db-ci-matrix",
  },
];

export const metrics: Metric[] = data.map((m, i) =>
  validateContent(metricSchema, m, `metric[${i}]:${m.id}`),
);

/** Only approved metrics ever reach the UI. */
export const approvedMetrics = metrics.filter((m) => m.approved);
