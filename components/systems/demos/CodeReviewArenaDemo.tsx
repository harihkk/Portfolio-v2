"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import DemoShell from "@/components/systems/demos/DemoShell";

type ReviewerId = "reference-patch" | "keyword_gamer";
type StageState = "pending" | "active" | "pass" | "fail";

const STAGES = [
  "Detect",
  "Patch",
  "Apply",
  "Test",
  "Structural validation",
  "Score",
] as const;

const REVIEWERS: { id: ReviewerId; label: string }[] = [
  { id: "reference-patch", label: "reference-patch" },
  { id: "keyword_gamer", label: "control: keyword_gamer" },
];

// Scripted, deterministic outcomes per stage (index-aligned with STAGES).
const RESULTS: Record<
  ReviewerId,
  { stages: StageState[]; detection: number; validated: number; note: string }
> = {
  "reference-patch": {
    stages: ["pass", "pass", "pass", "pass", "pass", "pass"],
    detection: 1.0,
    validated: 1.0,
    note: "Patch fixes the audience/issuer check; tests and validators pass.",
  },
  keyword_gamer: {
    stages: ["pass", "pass", "pass", "fail", "fail", "pass"],
    detection: 1.0,
    validated: 0.0,
    note: "Names the bug but the patch does not enforce validation; tests fail.",
  },
};

const STEP_MS = 250;

export default function CodeReviewArenaDemo() {
  const [reviewer, setReviewer] = useState<ReviewerId>("reference-patch");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [stages, setStages] = useState<StageState[]>(() =>
    STAGES.map(() => "pending"),
  );
  const [live, setLive] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const result = RESULTS[reviewer];

  const reset = () => {
    clearTimers();
    setRunning(false);
    setDone(false);
    setStages(STAGES.map(() => "pending"));
    setLive("Reviewer selection ready.");
  };

  const finalize = () => {
    setStages(result.stages);
    setRunning(false);
    setDone(true);
    setLive(
      `Scored. Detection ${result.detection.toFixed(3)}, validated repair ${result.validated.toFixed(3)}.`,
    );
  };

  const run = () => {
    clearTimers();
    setDone(false);
    setRunning(true);
    setStages(STAGES.map(() => "pending"));
    setLive(`Running blind case for ${reviewer}.`);

    if (prefersReducedMotion()) {
      finalize();
      return;
    }

    STAGES.forEach((label, i) => {
      timers.current.push(
        setTimeout(() => {
          setStages((prev) => {
            const next = [...prev];
            if (i > 0) next[i - 1] = result.stages[i - 1];
            next[i] = "active";
            return next;
          });
          setLive(`${label}…`);
        }, i * STEP_MS),
      );
    });
    timers.current.push(setTimeout(finalize, STAGES.length * STEP_MS));
  };

  const stageGlyph = (s: StageState) =>
    s === "pass" ? "✓" : s === "fail" ? "✕" : s === "active" ? "…" : "·";
  const stageColor = (s: StageState) =>
    s === "pass"
      ? "text-success"
      : s === "fail"
        ? "text-warning"
        : s === "active"
          ? "text-signal-dark"
          : "text-ink-muted";

  return (
    <DemoShell
      kicker="Code Review Arena"
      title="Detection is not repair"
      onReset={reset}
      controls={
        <>
          {REVIEWERS.map((r) => {
            const selected = reviewer === r.id;
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={selected}
                disabled={running}
                onClick={() => {
                  setReviewer(r.id);
                  setDone(false);
                  setStages(STAGES.map(() => "pending"));
                }}
                className={`border px-3 py-2 font-mono text-[0.7rem] tracking-[0.1em] uppercase transition-colors disabled:opacity-40 ${
                  selected
                    ? "border-signal text-signal-dark"
                    : "border-[color:var(--hairline)] text-ink-soft hover:border-ink"
                }`}
              >
                {r.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="border border-ink bg-ink px-4 py-2 font-mono text-[0.72rem] tracking-[0.1em] text-paper-elevated uppercase transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Run case
          </button>
        </>
      }
    >
      <p className="sr-only" aria-live="polite">
        {live}
      </p>

      <div className="border border-[color:var(--hairline)] bg-paper p-4">
        <p className="kicker">Blind seeded case</p>
        <p className="mt-1 font-mono text-[0.8rem] text-ink">
          security_jwt_audience_validation
        </p>
        <p className="mt-1 font-mono text-[0.7rem] text-ink-muted">
          Diff: JWT <span className="text-ink-soft">aud</span>/
          <span className="text-ink-soft">iss</span> are decoded but never
          validated. Reviewer payload is blind, no ground truth.
        </p>
      </div>

      <ol className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
        {STAGES.map((label, i) => (
          <li
            key={label}
            className="flex items-center gap-2 font-mono text-[0.72rem]"
          >
            <span className={`tnum w-4 ${stageColor(stages[i])}`}>
              {stageGlyph(stages[i])}
            </span>
            <span
              className={
                stages[i] === "pending" ? "text-ink-muted" : "text-ink-soft"
              }
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-2 gap-4">
        {(
          [
            { key: "detection", label: "Detection", value: result.detection },
            {
              key: "validated",
              label: "Validated repair",
              value: result.validated,
            },
          ] as const
        ).map((axis) => {
          const pct = done ? axis.value * 100 : 0;
          const full = done && axis.value >= 1;
          return (
            <div
              key={axis.key}
              className="border border-[color:var(--hairline)] bg-paper p-4"
            >
              <p className="kicker">{axis.label}</p>
              <p
                className={`tnum mt-1 font-mono text-2xl ${
                  done
                    ? full
                      ? "text-success"
                      : "text-warning"
                    : "text-ink-muted"
                }`}
              >
                {done ? axis.value.toFixed(3) : ", "}
              </p>
              <div className="mt-2 h-1.5 w-full bg-[color:var(--hairline)]">
                <div
                  className={`h-full ${full ? "bg-success" : "bg-warning"} transition-[width] duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="font-serif text-[0.86rem] text-ink-soft">
        {done ? result.note : "Pick a reviewer and run the blind case."}
      </p>
      <p className="font-mono text-[0.66rem] tracking-[0.04em] text-ink-muted">
        Illustrative of the documented audit_v1 result: the keyword_gamer
        control detects all ten bugs yet validates none; reference-patch
        validates all ten.
      </p>
    </DemoShell>
  );
}
