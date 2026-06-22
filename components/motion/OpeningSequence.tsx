"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const STEPS = [
  "Loading systems",
  "Verifying evidence",
  "Indexing field notes",
  "Record ready",
];

const SESSION_KEY = "tsj-opening-seen";

/**
 * First-session-only opening sequence. Rendered only after mount, so no-JS
 * users never see an overlay and content is server-rendered underneath. Skips
 * immediately under reduced motion, caps total duration well under the budget,
 * and ends by drawing a rule and lifting the curtain to reveal the masthead.
 */
export default function OpeningSequence() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen || prefersReducedMotion()) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    // Defer past hydration so SSR/client initial render agree (no mismatch).
    const id = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!active) return;
    const overlay = overlayRef.current;
    const rule = ruleRef.current;
    if (!overlay) return;

    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setActive(false);
        },
      });
      // ~900ms of staged progress, then ~300ms reveal, under the 1200ms target.
      tl.to(rule, { scaleX: 1, duration: 0.95, ease: "power1.inOut" }, 0);
      STEPS.forEach((_, i) => {
        tl.add(() => setStep(i), i * 0.23);
      });
      tl.to(
        overlay,
        { yPercent: -100, duration: 0.5, ease: "power3.inOut" },
        ">-0.05",
      );
    }, overlayRef);

    // Hard safety cap: never trap the page.
    const cap = window.setTimeout(() => {
      document.body.style.overflow = "";
      setActive(false);
    }, 1700);

    return () => {
      ctx.revert();
      window.clearTimeout(cap);
      document.body.style.overflow = "";
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-paper"
      role="status"
      aria-label="Indexing The Systems Journal"
    >
      <span className="sr-only">
        Indexing The Systems Journal, please wait.
      </span>
      <div className="shell flex w-full max-w-3xl flex-col items-center gap-8">
        <p className="kicker">Indexing the Systems Journal</p>
        <div className="h-px w-full max-w-md overflow-hidden bg-[color:var(--hairline)]">
          <div
            ref={ruleRef}
            className="h-full origin-left bg-signal"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <p
          aria-hidden
          className="font-mono text-sm tracking-[0.14em] text-ink-muted uppercase"
        >
          {STEPS[step]}
        </p>
      </div>
    </div>
  );
}
