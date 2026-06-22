"use client";

/*
 * sourceRepository: contamination-checker
 * sourceCommit: fbbc85ebab0515f8431d042a2740f8db22c4ee01
 * sourcePaths: experiments/results/*.json, docs/example_report.json
 * verifiedAt: 2026-06-21
 */

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import DemoShell from "@/components/systems/demos/DemoShell";

type MethodId = "overlap" | "mink" | "canon";

type MethodRow = {
  id: MethodId;
  label: string;
  base: number;
  index: number | null;
  active: number;
  detail: string;
  skipReason: string | null;
};

type Scenario = {
  id: "A" | "B" | "C" | "D";
  name: string;
  index: number;
  band: string;
  bandTone: string;
  ci: [number, number];
  sample: string;
  rows: MethodRow[];
  note: string | null;
};

const SCENARIOS: Scenario[] = [
  {
    id: "A",
    name: "Adapted model, synthetic leak set",
    index: 0.492,
    band: "moderate evidence",
    bandTone: "text-warning",
    ci: [0.354, 0.492],
    sample: "40 examples, 40 matched controls",
    rows: [
      {
        id: "overlap",
        label: "Guided overlap",
        base: 0.5,
        index: 0.0,
        active: 0.5,
        detail: "index 0.000",
        skipReason: null,
      },
      {
        id: "mink",
        label: "Min-K%++",
        base: 0.3,
        index: 1.0,
        active: 0.3,
        detail: "AUC 1.000",
        skipReason: null,
      },
      {
        id: "canon",
        label: "Canonical order",
        base: 0.2,
        index: 0.962,
        active: 0.2,
        detail: "p 0.038",
        skipReason: null,
      },
    ],
    note: null,
  },
  {
    id: "B",
    name: "Adapted model, matched clean set",
    index: 0.008,
    band: "low evidence",
    bandTone: "text-success",
    ci: [0.0, 0.103],
    sample: "40 examples, 40 matched controls",
    rows: [
      {
        id: "overlap",
        label: "Guided overlap",
        base: 0.5,
        index: 0.0,
        active: 0.5,
        detail: "index 0.000",
        skipReason: null,
      },
      {
        id: "mink",
        label: "Min-K%++",
        base: 0.3,
        index: 0.0,
        active: 0.3,
        detail: "index 0.000",
        skipReason: null,
      },
      {
        id: "canon",
        label: "Canonical order",
        base: 0.2,
        index: 0.038,
        active: 0.2,
        detail: "index 0.038",
        skipReason: null,
      },
    ],
    note: null,
  },
  {
    id: "C",
    name: "Base model, synthetic leak set",
    index: 0.131,
    band: "low evidence",
    bandTone: "text-success",
    ci: [0.008, 0.17],
    sample: "40 examples, 40 matched controls",
    rows: [
      {
        id: "overlap",
        label: "Guided overlap",
        base: 0.5,
        index: 0.0,
        active: 0.5,
        detail: "index 0.000",
        skipReason: null,
      },
      {
        id: "mink",
        label: "Min-K%++",
        base: 0.3,
        index: 0.0,
        active: 0.3,
        detail: "index 0.000",
        skipReason: null,
      },
      {
        id: "canon",
        label: "Canonical order",
        base: 0.2,
        index: 0.654,
        active: 0.2,
        detail: "index 0.654",
        skipReason: null,
      },
    ],
    note: null,
  },
  {
    id: "D",
    name: "distilgpt2 on GLUE, no matched control",
    index: 0.275,
    band: "moderate evidence",
    bandTone: "text-warning",
    ci: [0.0, 0.275],
    sample: "10 examples, no matched control",
    rows: [
      {
        id: "overlap",
        label: "Guided overlap",
        base: 0.5,
        index: 0.0,
        active: 0.714,
        detail: "index 0.000",
        skipReason: null,
      },
      {
        id: "mink",
        label: "Min-K%++",
        base: 0.3,
        index: null,
        active: 0.0,
        detail: "unavailable",
        skipReason: "no matched control",
      },
      {
        id: "canon",
        label: "Canonical order",
        base: 0.2,
        index: 0.962,
        active: 0.286,
        detail: "p 0.038",
        skipReason: null,
      },
    ],
    note: "Weak, uncertain evidence from 10 examples with no matched control. This is not a contamination finding.",
  },
];

const STAGES = [
  "Inspect capabilities",
  "Run supported methods",
  "Skip unsupported",
  "Calibrate",
  "Renormalize weights",
  "Estimate uncertainty",
  "Attach caveats",
  "Produce report",
];

const CAVEATS = [
  "Scores are evidence signals, not proof.",
  "Model capability, prompting and tokenization affect results.",
  "Sample size affects uncertainty.",
  "Matched-control quality matters.",
  "Canonical order can respond to ordinary coherence.",
  "The synthetic experiment is not a result about a real model.",
];

export default function ContamCheckrDemo() {
  const [active, setActive] = useState<Scenario["id"]>("A");
  const scenario = SCENARIOS.find((s) => s.id === active) ?? SCENARIOS[0];
  const barRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const indexBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instant = prefersReducedMotion();
    const apply = (el: HTMLDivElement | null, value: number) => {
      if (!el) return;
      el.style.transformOrigin = "left";
      if (instant) {
        el.style.transition = "none";
        el.style.transform = `scaleX(${value})`;
        return;
      }
      el.style.transition = "none";
      el.style.transform = "scaleX(0)";
      requestAnimationFrame(() => {
        el.style.transition = "transform 520ms cubic-bezier(0.22,1,0.36,1)";
        el.style.transform = `scaleX(${value})`;
      });
    };
    scenario.rows.forEach((r) => apply(barRefs.current[r.id], r.index ?? 0));
    apply(indexBarRef.current, scenario.index);
  }, [scenario]);

  return (
    <DemoShell
      kicker="ContamCheckr"
      title="Evidence, not a verdict"
      onReset={() => setActive("A")}
      controls={
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={s.id === active}
              onClick={() => setActive(s.id)}
              className={`border px-3 py-2 font-mono text-[0.66rem] tracking-[0.08em] uppercase transition-colors ${
                s.id === active
                  ? "border-signal text-signal-dark"
                  : "border-[color:var(--hairline)] text-ink-soft hover:border-ink"
              }`}
            >
              {s.id}. {s.name}
            </button>
          ))}
        </div>
      }
    >
      <p aria-live="polite" className="sr-only">
        {`Scenario ${scenario.id}, ${scenario.name}. Combined contamination index ${scenario.index.toFixed(3)}, ${scenario.band}, 95 percent interval ${scenario.ci[0].toFixed(3)} to ${scenario.ci[1].toFixed(3)}.`}
      </p>

      <div className="border border-[color:var(--hairline)]">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 border-b border-[color:var(--hairline)] bg-paper px-4 py-2 font-mono text-[0.6rem] tracking-[0.12em] text-ink-muted uppercase">
          <span>Method</span>
          <span className="text-right">Base</span>
          <span className="text-right">Active</span>
          <span className="text-right">Index</span>
        </div>
        {scenario.rows.map((r) => {
          const skipped = r.skipReason !== null;
          return (
            <div
              key={r.id}
              className={`border-b border-[color:var(--hairline)] px-4 py-2.5 last:border-b-0 ${skipped ? "bg-paper/60" : ""}`}
            >
              <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4">
                <span className="font-mono text-[0.76rem] text-ink">
                  {r.label}
                </span>
                <span className="tnum text-right font-mono text-[0.72rem] text-ink-muted">
                  {r.base.toFixed(2)}
                </span>
                <span
                  className={`tnum text-right font-mono text-[0.72rem] ${skipped ? "text-ink-muted" : "text-ink-soft"}`}
                >
                  {skipped ? "0.000" : r.active.toFixed(3)}
                </span>
                <span
                  className={`tnum text-right font-mono text-[0.72rem] ${skipped ? "text-ink-muted" : "text-ink"}`}
                >
                  {r.index === null ? "n/a" : r.index.toFixed(3)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="relative h-1.5 flex-1 bg-paper">
                  <div
                    ref={(el) => {
                      barRefs.current[r.id] = el;
                    }}
                    className="h-full origin-left bg-signal"
                    style={{ transform: "scaleX(0)" }}
                  />
                </div>
                <span className="font-mono text-[0.6rem] tracking-[0.06em] text-ink-muted">
                  {skipped ? `skipped: ${r.skipReason}` : r.detail}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border border-[color:var(--hairline)] bg-paper-elevated p-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="kicker">Combined contamination index</p>
          <p
            className={`stamp font-mono text-[0.66rem] tracking-[0.12em] ${scenario.bandTone}`}
          >
            {scenario.band}
          </p>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="tnum font-serif text-3xl text-ink">
            {scenario.index.toFixed(3)}
          </span>
          <span className="tnum font-mono text-[0.72rem] text-ink-muted">
            95% CI [{scenario.ci[0].toFixed(3)}, {scenario.ci[1].toFixed(3)}]
          </span>
        </div>
        <div className="relative mt-3 h-2 w-full bg-paper">
          <div
            ref={indexBarRef}
            className="h-full origin-left bg-signal-dark"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[0.58rem] tracking-[0.1em] text-ink-muted">
          <span>0.000</span>
          <span>{scenario.sample}</span>
          <span>1.000</span>
        </div>
        {scenario.note ? (
          <p className="mt-3 border-t border-[color:var(--hairline)] pt-2 font-serif text-[0.8rem] text-warning italic">
            {scenario.note}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="kicker mb-2">Demo stages</p>
          <ol className="space-y-1 font-mono text-[0.7rem] text-ink-soft">
            {STAGES.map((stage, i) => (
              <li key={stage} className="tnum">
                {String(i + 1).padStart(2, "0")}. {stage}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="kicker mb-2">Caveat ledger</p>
          <ul className="space-y-1 font-mono text-[0.7rem] text-ink-soft">
            {CAVEATS.map((c) => (
              <li key={c}>- {c}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="border-t border-[color:var(--hairline)] pt-3 font-serif text-[0.82rem] text-ink-soft italic">
        ContamCheckr reports evidence with uncertainty. It never prints a
        contaminated or clean verdict.
      </p>
    </DemoShell>
  );
}
