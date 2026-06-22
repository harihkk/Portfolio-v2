"use client";

/*
 * sourceRepository: Helm-browser-agent
 * sourceCommit: 784af0a7998b90898a7d4bd4d11ee0ac62ace3db
 * sourcePaths: core/action_registry.py
 * verifiedAt: 2026-06-21
 * Engine actions used (the only executable ones): navigate, click, type,
 * press_key, select, scroll, wait, extract, done. search, read_text,
 * observe_page and report_blocker are planner/validator concepts, not engine
 * actions. Fictional demo site, simulation only, no network.
 */

import { useEffect, useRef, useState } from "react";
import DemoShell from "@/components/systems/demos/DemoShell";
import { prefersReducedMotion } from "@/lib/motion";

// Real statuses: pending, executing, completed, failed, cancelled, blocked, unverified.
type RestStatus =
  | "completed"
  | "failed"
  | "cancelled"
  | "blocked"
  | "unverified";
type Step = {
  perceive: string;
  decide: string;
  act: string;
  verify: string;
  status: RestStatus;
};
type TermKind = "completed" | "blocked" | "confirmation" | "unverified";
type Terminal = { kind: TermKind; lines: string[] };
type Scenario = {
  id: "A" | "B" | "C" | "D";
  label: string;
  budget: number;
  steps: Step[];
  terminal: Terminal;
};

const SCENARIOS: Scenario[] = [
  {
    id: "A",
    label: "Find the demo product price",
    budget: 6,
    steps: [
      {
        perceive: "Blank tab, no document loaded",
        decide: "navigate{url: shop.demo.test/catalog}",
        act: "engine.navigate executed",
        verify: "validator: document ready, status 200",
        status: "completed",
      },
      {
        perceive: "Catalog filter input focused",
        decide: "type{selector: #q, text: demo widget}",
        act: "engine.type executed",
        verify: "validator: input value matches text",
        status: "completed",
      },
      {
        perceive: "One result card visible",
        decide: "click{selector: a.result}",
        act: "engine.click executed",
        verify: "validator: url is /product/demo-widget",
        status: "completed",
      },
      {
        perceive: "Product page, price node present",
        decide: "extract{}",
        act: "engine.extract executed",
        verify: "validator: .price visible, text non-empty",
        status: "completed",
      },
    ],
    terminal: {
      kind: "completed",
      lines: [
        "done{summary: price located on visible product page}",
        'Visible-page evidence: .price reads "$24.00"',
        "Validator: extract assertion on .price (visible, non-empty)",
        "Executed steps: 4",
        "Step budget: 6",
      ],
    },
  },
  {
    id: "B",
    label: "Open my email inbox",
    budget: 6,
    steps: [
      {
        perceive: "Blank tab, no document loaded",
        decide: "navigate{url: mail.demo.test/inbox}",
        act: "engine.navigate executed",
        verify: "validator: redirected to /login, no inbox DOM",
        status: "blocked",
      },
    ],
    terminal: {
      kind: "blocked",
      lines: [
        "Status: blocked",
        "Blocker type: login_required",
        "Current URL: mail.demo.test/login",
        "Page title: Sign in to Demo Mail",
        "Failed step: navigate{url: mail.demo.test/inbox}",
        "Last successful step: none (no prior step)",
        "Visible evidence: sign-in form, no message list rendered",
        "Suggested next step: return to user for credentials, then resume",
      ],
    },
  },
  {
    id: "C",
    label: "Buy the demo item",
    budget: 6,
    steps: [
      {
        perceive: "Blank tab, no document loaded",
        decide: "navigate{url: shop.demo.test/product/demo-widget}",
        act: "engine.navigate executed",
        verify: "validator: document ready, status 200",
        status: "completed",
      },
      {
        perceive: "Cookie banner overlays page",
        decide: "click{selector: #cookie-accept}",
        act: "engine.click executed",
        verify: "validator: banner removed from DOM",
        status: "completed",
      },
      {
        perceive: "Quantity dropdown enabled",
        decide: "select{selector: #qty, value: 1}",
        act: "engine.select executed",
        verify: "validator: selected option is 1",
        status: "completed",
      },
      {
        perceive: "Card field empty and editable",
        decide: "type{selector: #card, text: 4242 demo}",
        act: "engine.type executed",
        verify: "validator: input value matches text",
        status: "completed",
      },
    ],
    terminal: {
      kind: "confirmation",
      lines: [
        "Status: confirmation_required",
        "Gated action: click{selector: #pay-now}",
        "Reason: irreversible commit (payment submit)",
        "Preparation steps proceeded without a prompt.",
        "Only the final Pay now click gates. Awaiting user confirmation.",
      ],
    },
  },
  {
    id: "D",
    label: "Summarize the article",
    budget: 6,
    steps: [
      {
        perceive: "Blank tab, no document loaded",
        decide: "navigate{url: news.demo.test/article/quarterly}",
        act: "engine.navigate executed",
        verify: "validator: document ready, status 200",
        status: "completed",
      },
      {
        perceive: "Article above the fold",
        decide: "scroll{selector: article, to: bottom}",
        act: "engine.scroll executed",
        verify: "validator: scroll position at end",
        status: "completed",
      },
      {
        perceive: "Body text present, no summary node",
        decide: "extract{}",
        act: "engine.extract executed",
        verify: "validator: cannot prove summary from visible page",
        status: "unverified",
      },
    ],
    terminal: {
      kind: "unverified",
      lines: [
        "Status: unverified",
        "Steps executed, but no validator can confirm a summary.",
        "The requested outcome is not present on the visible page.",
        "Returned as unverified, not completed.",
      ],
    },
  },
];

const STEP_MS = 420;

const toneFor = (kind: string): string =>
  kind === "completed"
    ? "text-success"
    : kind === "unverified"
      ? "text-ink-muted"
      : "text-warning";

export default function HelmDemo() {
  const [id, setId] = useState<Scenario["id"]>("A");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [announce, setAnnounce] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sc = SCENARIOS.find((s) => s.id === id) as Scenario;
  const total = sc.steps.length;

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
  };
  const rewind = () => {
    setDone(false);
    setRevealed(0);
  };
  useEffect(() => clear, []);

  function reset() {
    clear();
    setRunning(false);
    rewind();
    setId("A");
    setAnnounce("Reset to scenario A");
  }

  function pick(next: Scenario["id"]) {
    if (running) return;
    clear();
    setId(next);
    rewind();
  }

  function run() {
    if (running) return;
    setRunning(true);
    rewind();
    const finish = () => {
      setRunning(false);
      setDone(true);
      setAnnounce(`Scenario ${sc.id} terminal state: ${sc.terminal.kind}`);
    };
    if (prefersReducedMotion()) {
      setRevealed(total);
      finish();
      return;
    }
    const advance = (n: number) => {
      setRevealed(n);
      setAnnounce(`Step ${n} of ${total}: ${sc.steps[n - 1].status}`);
      if (n >= total) return finish();
      timer.current = setTimeout(() => advance(n + 1), STEP_MS);
    };
    timer.current = setTimeout(() => advance(1), STEP_MS);
  }

  const t = sc.terminal;

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
          {running ? "Executing..." : done ? "Run again" : "Run scenario"}
        </button>
      }
    >
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pick(s.id)}
            disabled={running}
            aria-pressed={s.id === id}
            className={`border px-3 py-2 font-mono text-[0.7rem] tracking-[0.08em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${s.id === id ? "border-signal text-signal-dark" : "border-[color:var(--hairline)] text-ink-soft hover:border-ink"}`}
          >
            {s.id}. {s.label}
          </button>
        ))}
      </div>

      <p className="font-mono text-[0.66rem] tracking-[0.06em] text-ink-muted">
        Simulation on a fictional site (shop.demo.test), not a live site, no
        network.
      </p>

      <ol className="flex flex-col gap-2">
        {sc.steps.map((s, i) => {
          const shown = i < revealed;
          return (
            <li
              key={i}
              aria-hidden={!shown}
              className={`origin-left border-l-2 pl-3 transition-transform duration-300 ${shown ? "scale-x-100 border-signal" : "scale-x-95 border-[color:var(--rule)]"}`}
            >
              <p className="font-mono text-[0.62rem] tracking-[0.12em] text-ink-muted uppercase">
                Step {i + 1} ({shown ? s.status : "pending"})
              </p>
              <dl className="mt-1 grid grid-cols-[5rem_1fr] gap-x-3 gap-y-0.5 font-mono text-[0.72rem]">
                <dt className="text-ink-muted">perceive</dt>
                <dd className="text-ink-soft">{shown ? s.perceive : "."}</dd>
                <dt className="text-ink-muted">decide</dt>
                <dd className="text-ink">{shown ? s.decide : "."}</dd>
                <dt className="text-ink-muted">act</dt>
                <dd className="text-ink-soft">{shown ? s.act : "."}</dd>
                <dt className="text-ink-muted">verify</dt>
                <dd className={shown ? toneFor(s.status) : "text-ink-soft"}>
                  {shown ? s.verify : "."}
                </dd>
              </dl>
            </li>
          );
        })}
      </ol>

      {done ? (
        <div className="border border-[color:var(--hairline)] bg-paper px-4 py-3">
          <p className={`stamp ${toneFor(t.kind)}`}>{t.kind}</p>
          <ul className="mt-1.5 flex flex-col gap-0.5 font-mono text-[0.72rem] text-ink">
            {t.lines.map((line, i) => (
              <li key={i} className="tnum">
                {line}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-auto font-serif text-[0.92rem] leading-snug text-ink-muted">
        Helm reports <span className="text-ink-soft">completed</span> only with
        visible-page evidence. Otherwise it returns a typed blocker,{" "}
        <span className="text-ink-soft">confirmation_required</span> at the
        irreversible commit, or{" "}
        <span className="text-ink-soft">unverified</span>, never a faked
        success.
      </p>
    </DemoShell>
  );
}
