import { z } from "zod";
import { validateContent } from "@/lib/validation";

/* =========================================================================
   EARLIER WORK, secondary projects, honestly labeled. Prominence and labels
   follow the audit recommendations (docs/content-audit.md). weather-dashboard
   is intentionally omitted (lowest signal). Forks are never listed.
   Only live links that actually return 200 are marked live.
   ========================================================================= */

const earlierWorkSchema = z.object({
  name: z.string(),
  period: z.string(),
  oneLiner: z.string(),
  technologies: z.array(z.string()),
  status: z.enum(["active", "prototype", "archived", "historical"]),
  label: z.string(),
  repo: z.string(),
  live: z.string().optional().default(""),
  liveVerified: z.boolean().optional().default(false),
});
export type EarlierWork = z.infer<typeof earlierWorkSchema>;

const data: EarlierWork[] = [
  {
    name: "Prompt-Budd",
    period: "2026",
    oneLiner:
      "A Chrome extension plus FastAPI backend that scores and rewrites LLM prompts inline across major chat sites, and exposes prompt enhancement as an MCP tool.",
    technologies: [
      "Chrome Extension (MV3)",
      "FastAPI",
      "FastMCP",
      "Gemini",
      "Cloud Run",
    ],
    status: "active",
    label: "Live",
    repo: "https://github.com/harihkk/Prompt-Budd",
    live: "https://promtbud.com/",
    liveVerified: true,
  },
  {
    name: "AskRC",
    period: "2024",
    oneLiner:
      "An end-to-end MLOps RAG chatbot over Northeastern's Research Computing documentation, scraping, indexing, Airflow orchestration, DVC, and MLflow.",
    technologies: ["Streamlit", "Azure Cognitive Search", "Airflow", "DVC", "MLflow"],
    status: "archived",
    label: "Academic · archived",
    repo: "https://github.com/harihkk/AskRC",
    live: "",
    liveVerified: false,
  },
  {
    name: "GenBI",
    period: "2026",
    oneLiner:
      "An AI data-analysis API: upload a dataset, ask in plain English, and get a chart, a table, or a written answer.",
    technologies: ["FastAPI", "LangChain", "Plotly", "Pandas"],
    status: "prototype",
    label: "Prototype · API only",
    repo: "https://github.com/harihkk/GenBI",
    live: "",
    liveVerified: false,
  },
  {
    name: "Visioncraft",
    period: "2025",
    oneLiner:
      "A text-to-video pipeline that turns a topic into a captioned short, AI script, generated images, voiceover, and Remotion rendering.",
    technologies: ["Next.js", "Remotion", "Gemini", "Replicate", "Neon / Drizzle"],
    status: "historical",
    label: "Historical",
    repo: "https://github.com/harihkk/Visioncraft",
    live: "",
    liveVerified: false,
  },
  {
    name: "self-healing-pipeline",
    period: "2026",
    oneLiner:
      "A demo data pipeline with ML-based anomaly detection, automated repair strategies, and a live monitoring dashboard.",
    technologies: ["Flask", "scikit-learn", "pandas", "SQLite", "Docker"],
    status: "prototype",
    label: "Prototype · demo",
    repo: "https://github.com/harihkk/self-healing-pipeline",
    live: "",
    liveVerified: false,
  },
];

export const earlierWork: EarlierWork[] = data.map((p, i) =>
  validateContent(earlierWorkSchema, p, `earlierWork[${i}]:${p.name}`),
);
