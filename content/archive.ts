import {
  archiveEventSchema,
  validateContent,
  type ArchiveEvent,
} from "@/lib/validation";

/* =========================================================================
   EVIDENCE ARCHIVE, the complete, filterable record. Each entry names its
   source so it stays inspectable. Dates are verified from repos, releases,
   and the résumé. Sorted newest-first at read time.
   ========================================================================= */

const data: ArchiveEvent[] = [
  // ---- releases
  {
    id: "rel-db-130",
    date: "2026-06-17",
    title: "DebugBrief v1.3.0 published to PyPI",
    category: "releases",
    detail: "Third public release of the evidence-only debugging-brief CLI.",
    href: "https://pypi.org/project/debugbrief/",
    external: true,
    source: "Debug-Brief releases",
  },
  {
    id: "rel-db-120",
    date: "2026-06-12",
    title: "DebugBrief v1.2.0",
    category: "releases",
    detail: "Second release in the v1.x line.",
    href: "https://github.com/harihkk/Debug-Brief/releases/tag/v1.2.0",
    external: true,
    source: "Debug-Brief releases",
  },
  {
    id: "rel-db-110",
    date: "2026-06-12",
    title: "DebugBrief v1.1.0",
    category: "releases",
    detail: "First tagged v1.x release.",
    href: "https://github.com/harihkk/Debug-Brief/releases/tag/v1.1.0",
    external: true,
    source: "Debug-Brief releases",
  },
  // ---- systems
  {
    id: "sys-cra",
    date: "2026-06-21",
    title: "Code Review Arena, execution-backed code-review evaluation",
    category: "systems",
    detail:
      "306 tests across 37 files; 30 benchmark cases; five-job CI. Verified at 656b401.",
    href: "/systems/code-review-arena",
    external: false,
    source: "github.com/harihkk/code-review-arena",
  },
  {
    id: "sys-debugbrief",
    date: "2026-06-21",
    title: "DebugBrief, evidence-only debugging briefs",
    category: "systems",
    detail: "376 tests across 29 files; CI on Python 3.9-3.14; on PyPI.",
    href: "/systems/debugbrief",
    external: false,
    source: "github.com/harihkk/Debug-Brief",
  },
  {
    id: "sys-helm",
    date: "2026-06-09",
    title: "Helm Browser Agent, evidence-gated browser runtime",
    category: "systems",
    detail: "192 tests across 16 files, including 40 SSRF-policy tests. Verified at 784af0a.",
    href: "/systems/helm-browser-agent",
    external: false,
    source: "github.com/harihkk/Helm-browser-agent",
  },
  {
    id: "sys-contam",
    date: "2026-06-06",
    title: "ContamCheckr, caveated contamination evidence",
    category: "systems",
    detail: "30 tests across 7 files; evidence bands, not verdicts. Verified at fbbc85e.",
    href: "/systems/contamcheckr",
    external: false,
    source: "github.com/harihkk/contamination-checker",
  },
  // ---- research desk
  {
    id: "research-desk",
    date: "2026-06-21",
    title: "Research Desk opened with 14 external papers",
    category: "research",
    detail:
      "External arXiv papers connected to the flagship systems, metadata verified against the arXiv API.",
    href: "/research",
    external: false,
    source: "arXiv API",
  },
  // ---- earlier work
  {
    id: "work-promptbudd",
    date: "2026-03-26",
    title: "Prompt-Budd, prompt scoring extension goes live",
    category: "work",
    detail: "Chrome extension + FastAPI + MCP; live at promtbud.com.",
    href: "https://promtbud.com/",
    external: true,
    source: "github.com/harihkk/Prompt-Budd",
  },
  {
    id: "work-visioncraft",
    date: "2025-02-26",
    title: "Visioncraft, text-to-video pipeline",
    category: "work",
    detail: "Next.js + Remotion video generation pipeline (historical).",
    href: "https://github.com/harihkk/Visioncraft",
    external: true,
    source: "github.com/harihkk/Visioncraft",
  },
  {
    id: "work-askrc",
    date: "2024-12-01",
    title: "AskRC, MLOps RAG over university docs",
    category: "work",
    detail: "Full RAG + MLOps pipeline (academic, archived).",
    href: "https://github.com/harihkk/AskRC",
    external: true,
    source: "github.com/harihkk/AskRC",
  },
  // ---- professional + education
  {
    id: "edu-ms",
    date: "2025-05-01",
    title: "M.S. Data Analytics Engineering, Northeastern University",
    category: "work",
    detail: "Concentration in Machine Learning.",
    href: "",
    external: false,
    source: "Résumé, Education",
  },
  {
    id: "work-ms-start",
    date: "2024-11-01",
    title: "Joined Morgan Stanley as AI Software Engineer",
    category: "work",
    detail: "Retrieval and inference platforms for analyst and trading teams.",
    href: "/experience",
    external: false,
    source: "Résumé, Experience",
  },
  {
    id: "work-ii",
    date: "2021-05-01",
    title: "Machine Learning Engineer, Infinite Infolab",
    category: "work",
    detail: "Forecasting systems end to end (2021-2023).",
    href: "/experience",
    external: false,
    source: "Résumé, Experience",
  },
];

export const archive: ArchiveEvent[] = data
  .map((e, i) => validateContent(archiveEventSchema, e, `archive[${i}]:${e.id}`))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const archiveCategories = [
  "systems",
  "work",
  "research",
  "releases",
] as const;
