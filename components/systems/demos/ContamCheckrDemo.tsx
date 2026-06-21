"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import DemoShell from "@/components/systems/demos/DemoShell";

type Method = {
  id: string;
  label: string;
  weight: number;
  signal: number;
  requiresControl: boolean;
};

const METHODS: Method[] = [
  { id: "overlap", label: "Guided overlap", weight: 0.5, signal: 0.41, requiresControl: false },
  { id: "mink", label: "Min-K%++", weight: 0.3, signal: 0.58, requiresControl: true },
  { id: "canon", label: "Canonical order", weight: 0.2, signal: 0.22, requiresControl: false },
];

const CI = 0.08;
const CAVEATS = ["Model capability", "Sample size", "Control quality"];

type Band = { name: string; tone: string; bar: string };

function bandFor(index: number): Band {
  if (index < 0.2) return { name: "LOW", tone: "text-ink-muted", bar: "bg-ink-muted" };
  if (index < 0.5) return { name: "MODERATE", tone: "text-warning", bar: "bg-warning" };
  return { name: "HIGH", tone: "text-signal-dark", bar: "bg-signal-dark" };
}

export default function ContamCheckrDemo() {
  const [hasControl, setHasControl] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const { rows, index, band, skipped } = useMemo(() => {
    const active = METHODS.filter((m) => !m.requiresControl || hasControl);
    const totalWeight = active.reduce((sum, m) => sum + m.weight, 0);
    const rows = METHODS.map((m) => {
      const isActive = !m.requiresControl || hasControl;
      return {
        ...m,
        isActive,
        renorm: isActive ? m.weight / totalWeight : 0,
      };
    });
    const index = active.reduce((sum, m) => sum + (m.weight / totalWeight) * m.signal, 0);
    const skipped = METHODS.filter((m) => m.requiresControl && !hasControl).map((m) => ({
      label: m.label,
      reason: "no matched control",
    }));
    return { rows, index: Math.round(index * 100) / 100, band: bandFor(index), skipped };
  }, [hasControl]);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const target = `${Math.round(index * 100)}%`;
    if (prefersReducedMotion()) {
      el.style.transition = "none";
      el.style.width = target;
      return;
    }
    el.style.transition = "width 480ms cubic-bezier(0.22,1,0.36,1)";
    requestAnimationFrame(() => {
      el.style.width = target;
    });
  }, [index]);

  return (
    <DemoShell
      kicker="ContamCheckr"
      title="Evidence, not a verdict"
      onReset={() => setHasControl(false)}
      controls={
        <button
          type="button"
          aria-pressed={hasControl}
          onClick={() => setHasControl((v) => !v)}
          className={`border px-3 py-2 font-mono text-[0.7rem] tracking-[0.1em] uppercase transition-colors ${
            hasControl
              ? "border-signal text-signal-dark"
              : "border-[color:var(--hairline)] text-ink-soft hover:border-ink"
          }`}
        >
          Matched control supplied: {hasControl ? "on" : "off"}
        </button>
      }
    >
      <p aria-live="polite" className="sr-only">
        {`Combined evidence ${index.toFixed(2)} plus or minus ${CI.toFixed(2)}, ${band.name} band. ${skipped.length} method(s) skipped.`}
      </p>

      <div className="border border-[color:var(--hairline)]">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-[color:var(--hairline)] bg-paper px-4 py-2 font-mono text-[0.62rem] tracking-[0.12em] text-ink-muted uppercase">
          <span>Method</span>
          <span className="text-right">Weight</span>
          <span className="text-right">Signal</span>
        </div>
        {rows.map((r) => (
          <div
            key={r.id}
            className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-[color:var(--hairline)] px-4 py-2.5 last:border-b-0 ${
              r.isActive ? "" : "bg-paper-deep/40"
            }`}
          >
            <span className="font-mono text-[0.78rem] text-ink">{r.label}</span>
            <span className="tnum text-right font-mono text-[0.74rem] text-ink-soft">
              {r.isActive ? r.renorm.toFixed(2) : ", "}
            </span>
            <span
              className={`tnum text-right font-mono text-[0.74rem] ${
                r.isActive ? "text-ink" : "text-ink-muted"
              }`}
            >
              {r.isActive ? r.signal.toFixed(2) : "skipped"}
            </span>
          </div>
        ))}
      </div>

      <div className="border border-[color:var(--hairline)] bg-paper-elevated p-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="kicker">Combined evidence index</p>
          <p className={`stamp font-mono text-[0.7rem] tracking-[0.12em] ${band.tone}`}>
            {band.name} EVIDENCE
          </p>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="tnum font-serif text-3xl text-ink">{index.toFixed(2)}</span>
          <span className="tnum font-mono text-[0.74rem] text-ink-muted">± {CI.toFixed(2)}</span>
        </div>
        <div className="relative mt-3 h-2 w-full bg-paper">
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 -translate-x-1/2 border-l border-dashed border-ink-muted"
            style={{ left: `${Math.round(index * 100)}%` }}
          />
          <div ref={barRef} className={`h-full ${band.bar}`} style={{ width: 0 }} />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[0.6rem] tracking-[0.1em] text-ink-muted">
          <span>0.00 LOW</span>
          <span>0.20</span>
          <span>0.50</span>
          <span>HIGH 1.00</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="kicker mb-2">Caveats weighed</p>
          <ul className="space-y-1 font-mono text-[0.72rem] text-ink-soft">
            {CAVEATS.map((c) => (
              <li key={c}>- {c}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kicker mb-2">Skipped methods</p>
          {skipped.length === 0 ? (
            <p className="font-mono text-[0.72rem] text-ink-muted">None, all methods active.</p>
          ) : (
            <ul className="space-y-1 font-mono text-[0.72rem] text-ink-soft">
              {skipped.map((s) => (
                <li key={s.label}>, {s.label}{" "}
                  <span className="text-ink-muted">({s.reason})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="border-t border-[color:var(--hairline)] pt-3 font-serif text-[0.82rem] text-ink-soft italic">
        Scores are signals with uncertainty, not proof of training-set membership.
      </p>
    </DemoShell>
  );
}
