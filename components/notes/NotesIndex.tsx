"use client";

import { useState } from "react";
import type { Note } from "@/lib/notes";
import NoteCard from "@/components/notes/NoteCard";

type Serializable = {
  slug: string;
  frontmatter: Note["frontmatter"];
  readingMinutes: number;
};

export default function NotesIndex({ notes }: { notes: Serializable[] }) {
  const kinds = Array.from(new Set(notes.map((n) => n.frontmatter.kind)));
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all"
      ? notes
      : notes.filter((n) => n.frontmatter.kind === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter notes by kind">
        <Chip label="All" selected={active === "all"} onClick={() => setActive("all")} />
        {kinds.map((k) => (
          <Chip key={k} label={k} selected={active === k} onClick={() => setActive(k)} />
        ))}
      </div>
      <div className="mt-4">
        {filtered.map((n) => (
          <NoteCard
            key={n.slug}
            note={{ ...n, content: "" } as Note}
          />
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
