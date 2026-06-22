"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";

const STAGES = [
  { key: "REQUEST", note: "Task received", top: 6 },
  { key: "MODEL", note: "Action proposed", top: 28 },
  { key: "ACTION", note: "Executed in a sandbox", top: 50 },
  { key: "VALIDATION", note: "Validator checks the result", top: 72 },
  { key: "EVIDENCE", note: "Report sealed, inspectable", top: 94 },
];

/**
 * The interactive systems plate, the hero's visual proof (no photograph).
 * A signal travels down a request→evidence pipeline, lighting each stage. It
 * pauses when offscreen (no permanent loop while hidden) and renders a fully
 * legible static diagram under reduced motion / no JS.
 */
export default function SystemsPlate() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setActive(STAGES.length - 1);
        // No traveling node in the static diagram; the lit nodes carry state.
        if (dotRef.current) gsap.set(dotRef.current, { autoAlpha: 0 });
        return;
      }
      const dot = dotRef.current;
      const track = trackRef.current;
      if (!dot || !track) return;
      // Transform-only: center on the y origin, then translate down the spine
      // by a fraction of the measured track height (no layout-property animation).
      const h = () => track.getBoundingClientRect().height;
      gsap.set(dot, { yPercent: -50, y: h() * (STAGES[0].top / 100) });
      const tl = gsap.timeline({ repeat: -1, paused: true, repeatDelay: 0.4 });
      STAGES.forEach((stage, i) => {
        tl.to(dot, {
          y: () => h() * (stage.top / 100),
          duration: 0.85,
          ease: "power1.inOut",
          onComplete: () => setActive(i),
        });
        tl.to({}, { duration: 0.35 });
      });
      ScrollTrigger.create({
        trigger: scopeRef.current,
        start: "top 85%",
        end: "bottom 15%",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
    },
    { scope: scopeRef },
  );

  return (
    <div
      ref={scopeRef}
      className="plate relative overflow-hidden p-6 sm:p-8"
      role="img"
      aria-label="A pipeline: request, model, action, validation, evidence, each step validated before the next."
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="kicker">Execution pipeline</span>
        <span
          aria-hidden
          className="font-mono text-[0.7rem] tracking-[0.12em] text-signal-dark uppercase"
        >
          ● {STAGES[active].note}
        </span>
      </div>

      <div ref={trackRef} className="relative pl-6" aria-hidden>
        {/* spine */}
        <div className="absolute top-2 bottom-2 left-[7px] w-px bg-[color:var(--rule)]" />
        {/* traveling signal (transform-driven) */}
        <div
          ref={dotRef}
          className="absolute top-0 left-[2px] h-3 w-3 rounded-full bg-signal shadow-[0_0_0_5px_var(--signal-wash)]"
        />
        <ul className="flex flex-col justify-between gap-6">
          {STAGES.map((stage, i) => {
            const lit = i <= active;
            return (
              <li key={stage.key} className="relative">
                <span
                  className={`absolute top-1/2 -left-[18px] h-2.5 w-2.5 -translate-y-1/2 rounded-full border transition-colors duration-300 ${
                    lit
                      ? "border-signal bg-signal"
                      : "border-[color:var(--rule)] bg-paper"
                  }`}
                />
                <span
                  className={`block font-serif text-2xl leading-none transition-colors duration-300 sm:text-3xl ${
                    lit ? "text-ink" : "text-ink-muted"
                  }`}
                >
                  {stage.key}
                </span>
                <span className="mt-1 block font-mono text-[0.7rem] tracking-[0.08em] text-ink-muted uppercase">
                  {stage.note}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
