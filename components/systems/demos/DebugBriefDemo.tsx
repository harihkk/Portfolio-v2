"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import DemoShell from "@/components/systems/demos/DemoShell";

type Tone = "default" | "fail" | "pass" | "wrote";

type Line = { text: string; tone: Tone };

const SESSION: Line[] = [
  { text: "$ debugbrief run -- pytest -q test_calc.py", tone: "default" },
  { text: "... 1 failed in 0.20s   (exit 1, FAILED)", tone: "fail" },
  { text: "# edit calc.py to fix add()", tone: "default" },
  { text: "$ debugbrief redo", tone: "default" },
  { text: "... 1 passed in 0.18s    (exit 0, PASSED)", tone: "pass" },
  { text: "$ debugbrief end", tone: "default" },
  { text: "✓ wrote brief: .debugbrief/reports/pr.md", tone: "wrote" },
];

const BRIEF: { text: string; emphasis?: boolean; head?: boolean }[] = [
  { text: "## Summary", head: true },
  {
    text: "Failing check `python -m pytest -q test_calc.py` passed after 2 attempts over 2s, changes touched calc.py.",
  },
  { text: "## Red to green", head: true },
  {
    text: "A check failed at 12:02:09 and `python -m pytest -q test_calc.py` passed at 12:02:10 (window 1s).",
  },
  {
    text: "Between the failing and passing checks, these files changed (correlation, not proven cause):",
    emphasis: true,
  },
  { text: "- calc.py" },
];

const LINE_MS = 280;

const toneClass: Record<Tone, string> = {
  default: "text-ink-soft",
  fail: "text-warning",
  pass: "text-success",
  wrote: "text-signal-dark",
};

export default function DebugBriefDemo() {
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const finish = useCallback(() => {
    clear();
    setShown(SESSION.length);
    setPlaying(false);
    setDone(true);
  }, []);

  const play = useCallback(() => {
    if (done) return;
    if (reduced.current) {
      finish();
      return;
    }
    setPlaying(true);
  }, [done, finish]);

  const pause = () => {
    clear();
    setPlaying(false);
  };

  const reset = () => {
    clear();
    setShown(0);
    setPlaying(false);
    setDone(false);
  };

  useEffect(() => {
    if (!playing || shown >= SESSION.length) return;
    timer.current = setTimeout(() => {
      const next = shown + 1;
      setShown(next);
      if (next >= SESSION.length) {
        setPlaying(false);
        setDone(true);
      }
    }, LINE_MS);
    return clear;
  }, [playing, shown]);

  const briefVisible = shown >= SESSION.length;
  const status = done
    ? "Session complete. Generated brief revealed below."
    : playing
      ? "Playing recorded debug session."
      : "Ready to play recorded debug session.";

  return (
    <DemoShell
      kicker="DebugBrief"
      title="Evidence in, brief out"
      onReset={reset}
      controls={
        <>
          <button
            type="button"
            onClick={play}
            disabled={playing || done}
            className="border border-ink bg-ink px-4 py-2 font-mono text-[0.72rem] tracking-[0.1em] text-paper-elevated uppercase transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {done ? "Played" : "Play"}
          </button>
          <button
            type="button"
            onClick={pause}
            disabled={!playing}
            className="border border-[color:var(--hairline)] px-4 py-2 font-mono text-[0.72rem] tracking-[0.1em] text-ink-soft uppercase transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            Pause
          </button>
        </>
      }
    >
      <p aria-live="polite" className="sr-only">
        {status}
      </p>

      <div className="border border-[color:var(--hairline)] bg-paper">
        <div className="flex items-center justify-between border-b border-[color:var(--hairline)] px-3 py-2">
          <span className="font-mono text-[0.66rem] tracking-[0.12em] text-ink-muted uppercase">
            terminal
          </span>
          <span className="stamp font-mono text-[0.62rem] text-ink-muted">
            recorded session
          </span>
        </div>
        <div className="space-y-1 px-4 py-3 font-mono text-[0.74rem] leading-relaxed">
          {SESSION.slice(0, shown).map((line, i) => (
            <p key={i} className={`tnum ${toneClass[line.tone]}`}>
              {line.text}
            </p>
          ))}
          {shown === 0 ? (
            <p className="text-ink-muted">
              Press Play to replay the captured run.
            </p>
          ) : null}
          {playing && !briefVisible ? (
            <span className="inline-block h-3 w-2 animate-pulse bg-ink align-middle" />
          ) : null}
        </div>
      </div>

      {briefVisible ? (
        <div className="border border-signal/40 bg-paper-elevated">
          <p className="border-b border-[color:var(--hairline)] px-4 py-2 font-mono text-[0.64rem] tracking-[0.12em] text-signal-dark uppercase">
            .debugbrief/reports/pr.md
          </p>
          <div className="space-y-2 px-4 py-3">
            {BRIEF.map((b, i) =>
              b.head ? (
                <p
                  key={i}
                  className="font-serif text-base text-ink first:mt-0"
                >
                  {b.text.replace(/^##\s*/, "")}
                </p>
              ) : (
                <p
                  key={i}
                  className={`font-mono text-[0.74rem] leading-relaxed ${
                    b.emphasis
                      ? "text-signal-dark"
                      : "text-ink-soft"
                  }`}
                >
                  {b.text}
                </p>
              ),
            )}
          </div>
        </div>
      ) : null}

      <p className="font-mono text-[0.66rem] tracking-[0.06em] text-ink-muted">
        No AI, no network &mdash; built only from recorded evidence.
      </p>
    </DemoShell>
  );
}
