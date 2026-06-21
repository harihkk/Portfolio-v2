"use client";

/** Shared editorial frame for the interactive demonstrations. */
export default function DemoShell({
  kicker,
  title,
  children,
  onReset,
  controls,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
  onReset?: () => void;
  controls?: React.ReactNode;
}) {
  return (
    <div className="plate flex h-full flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-[color:var(--hairline)] px-5 py-4">
        <div>
          <p className="kicker">{kicker}</p>
          <p className="mt-1 font-serif text-lg text-ink">{title}</p>
        </div>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="shrink-0 border border-[color:var(--hairline)] px-3 py-1.5 font-mono text-[0.7rem] tracking-[0.1em] text-ink-muted uppercase transition-colors hover:border-ink hover:text-ink"
          >
            Reset
          </button>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">{children}</div>
      {controls ? (
        <div className="flex flex-wrap gap-2 border-t border-[color:var(--hairline)] px-5 py-4">
          {controls}
        </div>
      ) : null}
      <p className="border-t border-[color:var(--hairline)] px-5 py-2.5 font-mono text-[0.66rem] tracking-[0.06em] text-ink-muted">
        Illustrative interface, runs locally in your browser, no live model.
      </p>
    </div>
  );
}
