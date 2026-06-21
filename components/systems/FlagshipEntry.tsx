import Link from "next/link";
import type { System } from "@/lib/validation";
import Reveal from "@/components/motion/Reveal";
import FlowDiagram from "@/components/systems/FlowDiagram";
import StatusTag from "@/components/editorial/StatusTag";

const STRENGTH_TONE: Record<string, string> = {
  execution: "text-success",
  deterministic: "text-signal-dark",
  documented: "text-ink-muted",
};

export default function FlagshipEntry({ system }: { system: System }) {
  return (
    <article className="border-t-2 border-ink pt-8">
      <Reveal>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="stamp text-3xl text-signal-dark">{system.index}</span>
          <StatusTag status={system.status} />
          <span className="font-mono text-[0.7rem] tracking-[0.1em] text-ink-muted uppercase">
            {system.domains.join(" · ").replace(/-/g, " ")}
          </span>
        </div>
        <h3 className="display-md mt-4 font-serif text-ink">{system.title}</h3>
        <p className="mt-2 font-serif text-xl text-ink-muted italic">
          {system.subtitle}
        </p>
      </Reveal>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr]">
        <Reveal>
          <div className="measure">
            <p className="kicker mb-2">Problem</p>
            <p className="text-ink-soft">{system.problem}</p>
            <p className="kicker mt-6 mb-2">Thesis</p>
            <p className="text-lg text-ink">{system.thesis}</p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {system.technologies.slice(0, 8).map((t) => (
                <span
                  key={t}
                  className="border border-[color:var(--hairline)] px-2 py-0.5 font-mono text-[0.66rem] text-ink-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href={`/systems/${system.slug}`}
                className="border border-ink bg-ink px-4 py-2 font-mono text-[0.72rem] tracking-[0.1em] text-paper-elevated uppercase transition-opacity hover:opacity-85"
              >
                Read the case study
              </Link>
              <a
                href={system.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="link-annotate font-mono text-[0.72rem] tracking-[0.08em] text-ink-soft uppercase"
              >
                Repository ↗
              </a>
              {system.published ? (
                <a
                  href={system.published}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-annotate font-mono text-[0.72rem] tracking-[0.08em] text-signal-dark uppercase"
                >
                  PyPI ↗
                </a>
              ) : null}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <p className="kicker mb-3">Execution flow</p>
            <FlowDiagram steps={system.flow} label={`${system.title} flow`} />

            <p className="kicker mt-7 mb-3">Evidence</p>
            <ul className="flex flex-col gap-2">
              {system.evidence.map((e) => (
                <li
                  key={e.type}
                  className="flex gap-3 border-l-2 border-[color:var(--rule)] pl-3"
                >
                  <span
                    className={`mt-0.5 shrink-0 font-mono text-[0.66rem] tracking-[0.08em] uppercase ${
                      STRENGTH_TONE[e.strength ?? "documented"]
                    }`}
                  >
                    {e.type}
                  </span>
                  <span className="text-sm text-ink-soft">{e.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
