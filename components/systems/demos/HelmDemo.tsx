"use client";

import { useEffect, useRef, useState } from "react";
import DemoShell from "@/components/systems/demos/DemoShell";
import { prefersReducedMotion } from "@/lib/motion";

type Action = "navigate" | "search" | "read_text" | "click";

type Step = {
  perceive: string;
  decide: string;
  action: Action;
  act: string;
  verify: string;
  ok: boolean;
};

type Outcome =
  | { kind: "completed"; proof: string }
  | { kind: "blocked"; blocker: string; next: string };

type Task = {
  id: "price" | "inbox";
  label: string;
  budget: number;
  steps: Step[];
  outcome: Outcome;
};

const TASKS: Task[] = [
  {
    id: "price",
    label: "Find the price of the demo product",
    budget: 6,
    steps: [
      { perceive: "Blank tab, no page loaded", decide: "navigate → shop.demo/catalog", action: "navigate", act: "GET shop.demo/catalog", verify: "200 OK · catalog DOM ready", ok: true },
      { perceive: "Catalog grid, 12 product cards", decide: "search → \"demo product\"", action: "search", act: "type query, submit", verify: "1 match · /product/demo-01", ok: true },
      { perceive: "Search result link visible", decide: "click → result link", action: "click", act: "click <a> demo-01", verify: "navigated · product DOM ready", ok: true },
      { perceive: "Product page, price node present", decide: "read_text → .price selector", action: "read_text", act: "read .price → \"$24.00\"", verify: "node visible · text non-empty", ok: true },
    ],
    outcome: {
      kind: "completed",
      proof: "validator: \".price\" visible on /product/demo-01 → \"$24.00\"",
    },
  },
  {
    id: "inbox",
    label: "Open my email inbox",
    budget: 6,
    steps: [
      { perceive: "Blank tab, no page loaded", decide: "navigate → mail.demo/inbox", action: "navigate", act: "GET mail.demo/inbox", verify: "302 → /login · redirected", ok: false },
      { perceive: "Login form, no session cookie", decide: "read_text → page heading", action: "read_text", act: "read <h1> → \"Sign in\"", verify: "auth wall · no inbox DOM", ok: false },
    ],
    outcome: {
      kind: "blocked",
      blocker: "login_required",
      next: "Hand back to user for credentials, then re-run from /login",
    },
  },
];

const STEP_MS = 400;

export default function HelmDemo() {
  const [taskId, setTaskId] = useState<Task["id"]>("price");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [announce, setAnnounce] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const task = TASKS.find((t) => t.id === taskId) as Task;
  const total = task.steps.length;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setRunning(false);
    setDone(false);
    setRevealed(0);
    setTaskId("price");
    setAnnounce("Reset to task selection");
  }

  function pick(id: Task["id"]) {
    if (running) return;
    setTaskId(id);
    setDone(false);
    setRevealed(0);
  }

  function run() {
    if (running) return;
    setRunning(true);
    setDone(false);
    setRevealed(0);
    const reduced = prefersReducedMotion();
    const advance = (n: number) => {
      setRevealed(n);
      setAnnounce(
        `Step ${n} of ${task.budget}: ${task.steps[n - 1].decide}, ${task.steps[n - 1].verify}`,
      );
      if (n >= total) {
        const o = task.outcome;
        setAnnounce(
          o.kind === "completed"
            ? `Task completed with page evidence. ${o.proof}`
            : `Task blocked: ${o.blocker}. Suggested next step: ${o.next}`,
        );
        setRunning(false);
        setDone(true);
        return;
      }
      timer.current = setTimeout(() => advance(n + 1), reduced ? 0 : STEP_MS);
    };
    if (reduced) {
      // Instant path: reveal all, then settle.
      let n = 0;
      const burst = () => {
        n += 1;
        advance(n);
        if (n < total) burst();
      };
      burst();
    } else {
      timer.current = setTimeout(() => advance(1), STEP_MS);
    }
  }

  const o = task.outcome;
  const blocked = done && o.kind === "blocked";
  const completed = done && o.kind === "completed";

  return (
    <DemoShell
      kicker="Helm Browser Agent"
      title="Only success it can prove"
      onReset={reset}
      controls={
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="border border-ink bg-ink px-4 py-2 font-mono text-[0.72rem] tracking-[0.1em] text-paper-elevated uppercase transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {running ? "Running…" : done ? "Run again" : "Run task"}
        </button>
      }
    >
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {TASKS.map((t) => {
          const sel = t.id === taskId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => pick(t.id)}
              disabled={running}
              aria-pressed={sel}
              className={`border px-3 py-2 font-mono text-[0.7rem] tracking-[0.1em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                sel
                  ? "border-signal text-signal-dark"
                  : "border-[color:var(--hairline)] text-ink-soft hover:border-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
        <span className="ml-auto font-mono text-[0.7rem] tracking-[0.08em] text-ink-muted tnum">
          Step {Math.min(revealed, task.budget)} / {task.budget}
        </span>
      </div>

      <ol className="flex flex-col gap-2">
        {task.steps.map((s, i) => {
          const shown = i < revealed;
          return (
            <li
              key={i}
              aria-hidden={!shown}
              className={`border-l-2 pl-3 transition-colors duration-300 ${
                shown ? "border-signal" : "border-[color:var(--rule)]"
              }`}
            >
              <p className="font-mono text-[0.62rem] tracking-[0.12em] text-ink-muted uppercase">
                Step {i + 1}
              </p>
              <dl className="mt-1 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-0.5 font-mono text-[0.72rem]">
                <dt className="text-ink-muted">perceive</dt>
                <dd className="text-ink-soft">{shown ? s.perceive : ", "}</dd>
                <dt className="text-ink-muted">decide</dt>
                <dd className="text-ink">{shown ? s.decide : ", "}</dd>
                <dt className="text-ink-muted">act</dt>
                <dd className="text-ink-soft">{shown ? s.act : ", "}</dd>
                <dt className="text-ink-muted">verify</dt>
                <dd className={shown ? (s.ok ? "text-success" : "text-warning") : "text-ink-soft"}>
                  {shown ? s.verify : ", "}
                </dd>
              </dl>
            </li>
          );
        })}
      </ol>

      {completed && o.kind === "completed" ? (
        <div className="border border-[color:var(--hairline)] bg-paper px-4 py-3">
          <p className="stamp text-success">completed · verified</p>
          <p className="mt-1.5 font-mono text-[0.72rem] text-ink">{o.proof}</p>
        </div>
      ) : null}

      {blocked && o.kind === "blocked" ? (
        <div className="border border-[color:var(--hairline)] bg-paper px-4 py-3">
          <p className="stamp text-warning">blocked · {o.blocker}</p>
          <p className="mt-1.5 font-mono text-[0.72rem] text-ink-soft">
            No inbox DOM reached, reported as a typed blocker, not a completion.
          </p>
          <p className="mt-1 font-mono text-[0.72rem] text-ink">next: {o.next}</p>
        </div>
      ) : null}

      <p className="mt-auto font-serif text-[0.92rem] leading-snug text-ink-muted">
        Helm reports <span className="text-ink-soft">completed</span> only with
        visible-page evidence. Anything else is returned as{" "}
        <span className="text-ink-soft">unverified</span> or a typed blocker, never a faked success.
      </p>
    </DemoShell>
  );
}
