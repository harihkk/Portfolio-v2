import Reveal from "@/components/motion/Reveal";
import { systems } from "@/content/systems";

type EvidenceRow = {
  system: string;
  type: string;
  detail: string;
  verified: string;
  source: string;
};

/** Numbered evidence ledger drawn from the flagship systems' verified records. */
export default function EvidenceArchive() {
  const rows: EvidenceRow[] = systems.flatMap((s) =>
    s.evidence.map((e) => ({
      system: s.title,
      type: e.type,
      detail: e.detail,
      verified: s.lastVerifiedDate,
      source: e.source,
    })),
  );

  return (
    <Reveal stagger>
      <ol className="border-t border-[color:var(--hairline)]">
        {rows.map((row, i) => (
          <li
            key={`${row.system}-${row.type}-${i}`}
            data-reveal-item
            className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-[color:var(--hairline)] py-4 sm:grid-cols-[3rem_10rem_1fr_auto]"
          >
            <span className="stamp text-sm text-signal-dark">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-serif text-base text-ink sm:self-center">
              {row.system}
            </span>
            <span className="col-span-2 text-sm text-ink-soft sm:col-span-1 sm:self-center">
              <span className="font-mono text-[0.66rem] tracking-[0.08em] text-ink-muted uppercase">
                {row.type}:
              </span>{" "}
              {row.detail}
            </span>
            <span className="col-span-2 font-mono text-[0.64rem] text-ink-muted sm:col-span-1 sm:self-center sm:text-right">
              {row.source} · {row.verified}
            </span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
