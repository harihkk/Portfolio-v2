import Reveal from "@/components/motion/Reveal";

/** A labeled process flow, vertical on mobile, horizontal on wider screens. */
export default function FlowDiagram({
  steps,
  label = "Process flow",
}: {
  steps: string[];
  label?: string;
}) {
  return (
    <Reveal stagger>
      <ol
        className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center"
        aria-label={label}
      >
        {steps.map((step, i) => (
          <li
            key={step}
            data-reveal-item
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <span className="inline-flex items-center gap-2.5 border border-[color:var(--hairline)] bg-paper-elevated px-3 py-2">
              <span className="stamp text-[0.7rem] text-signal-dark">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs tracking-[0.06em] text-ink uppercase">
                {step}
              </span>
            </span>
            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className="self-center px-1 text-rule sm:px-2 rotate-90 sm:rotate-0"
              >
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
