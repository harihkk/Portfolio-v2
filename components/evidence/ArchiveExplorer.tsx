"use client";

import { useState } from "react";
import Link from "next/link";
import type { ArchiveEvent } from "@/lib/validation";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "systems", label: "Systems" },
  { key: "work", label: "Work" },
  { key: "research", label: "Research" },
  { key: "releases", label: "Releases" },
] as const;

const CAT_TONE: Record<string, string> = {
  systems: "text-signal-dark",
  work: "text-ink-soft",
  research: "text-warning",
  releases: "text-success",
  notes: "text-ink-muted",
};

export default function ArchiveExplorer({ events }: { events: ArchiveEvent[] }) {
  const [active, setActive] = useState<string>("all");
  const filtered =
    active === "all" ? events : events.filter((e) => e.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter archive">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActive(f.key)}
            aria-pressed={active === f.key}
            className={`border px-3 py-2 font-mono text-[0.68rem] tracking-[0.08em] uppercase transition-colors ${
              active === f.key
                ? "border-signal-dark bg-signal-dark text-paper-elevated"
                : "border-[color:var(--hairline)] text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ol className="mt-10 border-t border-[color:var(--hairline)]">
        {filtered.map((e) => (
          <li
            key={e.id}
            className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-[color:var(--hairline)] py-5 sm:grid-cols-[7rem_1fr] sm:items-baseline"
          >
            <span className="stamp text-sm text-ink-muted">{e.date}</span>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span
                  className={`font-mono text-[0.62rem] tracking-[0.12em] uppercase ${
                    CAT_TONE[e.category] ?? "text-ink-muted"
                  }`}
                >
                  {e.category}
                </span>
                <h3 className="font-serif text-lg text-ink">
                  {e.href ? (
                    e.external ? (
                      <a
                        href={e.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-annotate"
                      >
                        {e.title} ↗
                      </a>
                    ) : (
                      <Link href={e.href} className="link-annotate">
                        {e.title}
                      </Link>
                    )
                  ) : (
                    e.title
                  )}
                </h3>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{e.detail}</p>
              <p className="mt-1 font-mono text-[0.62rem] text-ink-muted">
                Source: {e.source}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
