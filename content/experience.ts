import { z } from "zod";
import {
  experienceEntrySchema,
  validateContent,
  type ExperienceEntry,
} from "@/lib/validation";

/* =========================================================================
   PROFESSIONAL ENGINEERING RECORD
   Titles and dates are taken verbatim from the current résumé (the authority).
   Bullets are rewritten into editorial summaries that remain factually
   equivalent, not pasted. Metric phrasing matches the provenance ledger.
   KL University and Rlogical Techsoft (old-site only, not on the résumé) are
   intentionally excluded, see content/provenance.ts (held-* records).
   ========================================================================= */

const data: z.input<typeof experienceEntrySchema>[] = [
  {
    id: "morgan-stanley",
    org: "Morgan Stanley",
    role: "AI Software Engineer",
    location: "Boston, Massachusetts",
    start: "Nov 2024",
    end: "Present",
    current: true,
    summary:
      "Builds retrieval and inference platforms for analyst and trading teams, owning retrieval quality, evaluation, guardrails, and reliability at production scale, from the backend services down to model fine-tuning and Kubernetes serving.",
    categories: [
      {
        title: "Retrieval & RAG systems",
        detail:
          "A hybrid retrieval platform on LangChain, Pinecone, and FAISS, vector plus BM25, metadata-aware chunking, cross-encoder reranking, and FinBERT financial embeddings, improving recall@10 by 42% and cutting analyst research time by 35%.",
      },
      {
        title: "Evaluation & guardrails",
        detail:
          "LLM workflows and eval harnesses (LLM-as-judge, golden datasets) with monitoring across retrieval quality, hallucination risk, and latency, catching regressions before they reach production.",
      },
      {
        title: "Services & integration",
        detail:
          "Kotlin and Spring Boot services exposing GraphQL APIs across internal teams, schema-first design, federated resolvers, and end-to-end TypeScript type generation for the React client.",
      },
      {
        title: "Fine-tuning & inference",
        detail:
          "LoRA fine-tuning pipelines for LLaMA and Mistral (PyTorch, Hugging Face, MLflow) lifting domain precision 28% while cutting training cost 40%; p95 inference latency reduced 3.5x with ONNX Runtime, TensorRT, quantization, and batching, supporting 1M+ daily requests.",
      },
      {
        title: "Deployment & reliability",
        detail:
          "CI/CD and deployment automation with GitHub Actions, ArgoCD, Docker, and Kubernetes for model versioning, rollback, and reproducibility, with Prometheus and Grafana tracking hallucination rate, retrieval quality, and drift.",
      },
    ],
    technologies: [
      "LangChain",
      "Pinecone",
      "FAISS",
      "PyTorch",
      "Kotlin",
      "Spring Boot",
      "GraphQL",
      "React / TypeScript",
      "Kubernetes",
      "ONNX Runtime",
      "TensorRT",
      "MLflow",
      "Prometheus / Grafana",
    ],
    relatedSystems: ["code-review-arena", "contamcheckr"],
    provenanceIds: [
      "ms-role",
      "ms-recall",
      "ms-research-time",
      "ms-precision",
      "ms-latency",
      "ms-throughput",
    ],
  },
  {
    id: "infinite-infolab",
    org: "Infinite Infolab",
    role: "Machine Learning Engineer",
    location: "India",
    start: "May 2021",
    end: "Jul 2023",
    summary:
      "Built forecasting systems end to end, from ETL and feature pipelines through deep-learning models to FastAPI inference services on GCP, with the experiment tracking and drift monitoring needed to ship and roll back safely.",
    categories: [
      {
        title: "Forecasting & validation",
        detail:
          "Supervised and ensemble models (XGBoost, LightGBM, scikit-learn) across SKU behavioral clusters with time-series cross-validation and rolling-window backtesting, improving demand prediction accuracy by 27%.",
      },
      {
        title: "Deep-learning models",
        detail:
          "LSTM models in TensorFlow and PyTorch for highly seasonal SKUs, capturing long-term temporal dependencies and reducing forecast error (MAPE) by 22%.",
      },
      {
        title: "Data & feature pipelines",
        detail:
          "ETL and feature pipelines in Python and SQL processing 10M+ records from ERP, POS, and supplier systems, cutting preprocessing time 55% through parallelization, query tuning, and reusable feature modules.",
      },
      {
        title: "Serving & MLOps",
        detail:
          "FastAPI inference services on GCP with Docker serving 50K+ daily prediction requests at 99.9% uptime via autoscaling, batching, and feature caching; experiment tracking and drift monitoring with MLflow enabled safe rollbacks and doubled experimentation throughput.",
      },
    ],
    technologies: [
      "Python",
      "XGBoost",
      "LightGBM",
      "TensorFlow",
      "PyTorch",
      "FastAPI",
      "GCP",
      "Docker",
      "MLflow",
      "SQL",
    ],
    relatedSystems: [],
    provenanceIds: [
      "ii-role",
      "ii-demand",
      "ii-mape",
      "ii-records",
      "ii-serving",
    ],
  },
];

export const experience: ExperienceEntry[] = data.map((e, i) =>
  validateContent(experienceEntrySchema, e, `experience[${i}]:${e.id}`),
);
