import type { SystemStatus } from "@/lib/validation";

const LABELS: Record<SystemStatus, string> = {
  published: "Published",
  active: "Active",
  alpha: "Alpha",
  prototype: "Prototype",
  historical: "Historical",
  archived: "Archived",
};

const TONE: Record<SystemStatus, string> = {
  published: "text-success border-[color:var(--success)]",
  active: "text-success border-[color:var(--success)]",
  alpha: "text-warning border-[color:var(--warning)]",
  prototype: "text-ink-muted border-[color:var(--rule)]",
  historical: "text-ink-muted border-[color:var(--rule)]",
  archived: "text-ink-muted border-[color:var(--rule)]",
};

export default function StatusTag({ status }: { status: SystemStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[0.68rem] tracking-[0.12em] uppercase ${TONE[status]}`}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full bg-current"
      />
      {LABELS[status]}
    </span>
  );
}
