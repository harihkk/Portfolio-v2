import Link from "next/link";
import type { Note } from "@/lib/notes";

const KIND_TONE: Record<string, string> = {
  "Engineering Note": "text-signal-dark border-[color:var(--signal)]",
  "System Brief": "text-ink-soft border-[color:var(--rule)]",
  "Release Note": "text-success border-[color:var(--success)]",
  "Research Note": "text-warning border-[color:var(--warning)]",
};

export default function NoteCard({ note }: { note: Note }) {
  const { frontmatter: fm } = note;
  return (
    <article className="flex flex-col gap-3 border-t border-[color:var(--hairline)] py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`border px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.12em] uppercase ${
            KIND_TONE[fm.kind] ?? "text-ink-muted border-[color:var(--rule)]"
          }`}
        >
          {fm.kind}
        </span>
        <span className="stamp text-xs text-ink-muted">
          {fm.date} · {note.readingMinutes} min
        </span>
      </div>
      <h3 className="font-serif text-xl leading-snug text-ink">
        <Link href={`/notes/${note.slug}`} className="link-annotate">
          {fm.title}
        </Link>
      </h3>
      <p className="measure text-sm text-ink-soft">{fm.summary}</p>
    </article>
  );
}
