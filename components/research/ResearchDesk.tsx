"use client";

import { useState } from "react";
import type { ResearchPaper } from "@/lib/validation";
import PaperCard from "@/components/research/PaperCard";

export default function ResearchDesk({ papers }: { papers: ResearchPaper[] }) {
  const topics = Array.from(
    new Set(papers.map((p) => p.connectedTopic)),
  ).sort();
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all"
      ? papers
      : papers.filter((p) => p.connectedTopic === active);

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter papers by topic"
      >
        <Chip
          label="All topics"
          selected={active === "all"}
          onClick={() => setActive("all")}
        />
        {topics.map((t) => (
          <Chip
            key={t}
            label={t}
            selected={active === t}
            onClick={() => setActive(t)}
          />
        ))}
      </div>

      <p className="mt-6 font-mono text-[0.7rem] tracking-[0.06em] text-ink-muted uppercase">
        {filtered.length} {filtered.length === 1 ? "paper" : "papers"}
      </p>

      <div className="mt-2">
        {filtered.map((p) => (
          <PaperCard key={p.slug} paper={p} href={`/research/${p.slug}`} />
        ))}
      </div>
    </div>
  );
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`border px-3 py-2 font-mono text-[0.68rem] tracking-[0.06em] uppercase transition-colors ${
        selected
          ? "border-signal-dark bg-signal-dark text-paper-elevated"
          : "border-[color:var(--hairline)] text-ink-soft hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
