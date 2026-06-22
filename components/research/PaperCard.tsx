import Link from "next/link";
import type { ResearchPaper } from "@/lib/validation";

const SYSTEM_LABEL: Record<string, string> = {
  "code-review-arena": "Code Review Arena",
  "helm-browser-agent": "Helm Browser Agent",
  debugbrief: "DebugBrief",
  contamcheckr: "ContamCheckr",
  general: "General evaluation",
};

function authorLine(authors: string[]): string {
  if (authors.length <= 3) return authors.join(", ");
  return `${authors.slice(0, 3).join(", ")} et al.`;
}

export default function PaperCard({
  paper,
  href,
}: {
  paper: ResearchPaper;
  href: string;
}) {
  const year = paper.submittedDate.slice(0, 4);
  return (
    <article className="flex flex-col gap-3 border-t border-[color:var(--hairline)] py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="border border-[color:var(--rule)] px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.12em] text-ink-muted uppercase">
          External paper
        </span>
        <span className="stamp text-xs text-ink-muted">
          arXiv:{paper.arxivId} · {paper.primaryCategory} · {year}
        </span>
      </div>

      <h3 className="font-serif text-xl leading-snug text-ink">
        <Link href={href} className="link-annotate">
          {paper.title}
        </Link>
      </h3>

      <p className="font-mono text-[0.72rem] text-ink-muted">
        {authorLine(paper.authors)}
      </p>

      <p className="measure text-sm text-ink-soft">{paper.relationship}</p>

      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="kicker text-[0.62rem]">
          Connected:{" "}
          {SYSTEM_LABEL[paper.connectedSystem] ?? paper.connectedSystem}
        </span>
        <a
          href={paper.arxivUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-annotate font-mono text-[0.7rem] tracking-[0.08em] text-signal-dark uppercase"
        >
          Read on arXiv ↗
        </a>
      </div>
    </article>
  );
}
