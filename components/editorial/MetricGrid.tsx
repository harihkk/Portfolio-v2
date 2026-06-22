import CountUp from "@/components/motion/CountUp";
import Reveal from "@/components/motion/Reveal";
import { approvedMetrics } from "@/content/metrics";

/** Verified-numbers "box score". Every value is approved and sourced. */
export default function MetricGrid() {
  return (
    <Reveal stagger>
      <ul className="grid grid-cols-2 gap-px bg-[color:var(--hairline)] sm:grid-cols-3">
        {approvedMetrics.map((m) => (
          <li
            key={m.id}
            data-reveal-item
            className="flex flex-col bg-paper p-5"
          >
            <span className="font-serif text-4xl text-ink tnum sm:text-5xl">
              <CountUp
                value={m.value}
                display={m.display}
                prefix={m.prefix}
                suffix={m.suffix}
                animate={m.animate}
              />
            </span>
            <span className="mt-3 text-sm leading-snug text-ink-soft">
              {m.label}
            </span>
            {m.detail ? (
              <span className="mt-1.5 font-mono text-[0.66rem] leading-snug text-ink-muted">
                {m.detail}
              </span>
            ) : null}
            <span className="mt-auto pt-3 font-mono text-[0.6rem] tracking-[0.08em] text-ink-muted uppercase">
              {m.source}
            </span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
