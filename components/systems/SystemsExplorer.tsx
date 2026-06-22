"use client";

import { useState } from "react";
import Link from "next/link";
import type { System, SystemDomain } from "@/lib/validation";
import StatusTag from "@/components/editorial/StatusTag";

const DOMAIN_LABEL: Record<SystemDomain, string> = {
  evaluation: "Evaluation",
  "agent-reliability": "Agent reliability",
  "developer-infrastructure": "Developer infrastructure",
  "production-ai": "Production AI",
  retrieval: "Retrieval",
};

export default function SystemsExplorer({ systems }: { systems: System[] }) {
  const domains = Array.from(
    new Set(systems.flatMap((s) => s.domains)),
  ) as SystemDomain[];
  const [active, setActive] = useState<SystemDomain | "all">("all");

  const filtered =
    active === "all"
      ? systems
      : systems.filter((s) => s.domains.includes(active));

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter systems by domain"
      >
        <FilterButton
          label="All systems"
          selected={active === "all"}
          onClick={() => setActive("all")}
        />
        {domains.map((d) => (
          <FilterButton
            key={d}
            label={DOMAIN_LABEL[d]}
            selected={active === d}
            onClick={() => setActive(d)}
          />
        ))}
      </div>

      <ul className="mt-10 grid gap-px bg-[color:var(--hairline)] sm:grid-cols-2">
        {filtered.map((s) => (
          <li key={s.slug} className="bg-paper">
            <Link
              href={`/systems/${s.slug}`}
              className="group flex h-full flex-col p-6 transition-colors hover:bg-paper-elevated"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="stamp text-2xl text-signal-dark">
                  {s.index}
                </span>
                <StatusTag status={s.status} />
              </div>
              <h2 className="mt-4 font-serif text-2xl text-ink group-hover:text-signal-dark">
                {s.title}
              </h2>
              <p className="mt-1 font-serif text-base text-ink-muted italic">
                {s.subtitle}
              </p>
              <p className="mt-4 text-sm text-ink-soft">{s.oneLiner}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {s.domains.map((d) => (
                  <span
                    key={d}
                    className="border border-[color:var(--rule)] px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.08em] text-ink-muted uppercase"
                  >
                    {DOMAIN_LABEL[d]}
                  </span>
                ))}
              </div>
              <span className="mt-auto pt-5 font-mono text-[0.7rem] tracking-[0.08em] text-ink-soft uppercase">
                Read case study →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterButton({
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
      className={`border px-3 py-2 font-mono text-[0.7rem] tracking-[0.08em] uppercase transition-colors ${
        selected
          ? "border-signal-dark bg-signal-dark text-paper-elevated"
          : "border-[color:var(--hairline)] text-ink-soft hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
