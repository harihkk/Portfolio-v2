"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

function Row({ items, dup = false }: { items: string[]; dup?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center gap-x-10 pr-10 motion-reduce:flex-wrap motion-reduce:gap-y-3 ${
        dup ? "motion-reduce:hidden" : ""
      }`}
      aria-hidden={dup}
    >
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center gap-x-10">
          <span className="font-mono text-sm tracking-[0.12em] text-ink-soft uppercase">
            {item}
          </span>
          <span aria-hidden className="text-signal">
            ◆
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * Slow editorial moving record. Content is duplicated for a seamless loop;
 * pauses on hover and keyboard focus; under reduced motion the animation is
 * skipped and the terms wrap into a static, readable list (the duplicate is
 * hidden). Overflow is clipped so it never creates horizontal page scroll.
 */
export default function Marquee({
  items,
  speed = 38,
}: {
  items: string[];
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || prefersReducedMotion()) return;
      tween.current = gsap.to(track, {
        xPercent: -50,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: trackRef },
  );

  const pause = () => tween.current?.pause();
  const resume = () => tween.current?.resume();

  return (
    <div
      className="overflow-hidden border-y border-[color:var(--hairline)] py-4"
      role="group"
      aria-label="Focus areas and core technologies"
      tabIndex={0}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      data-focus-ring
    >
      <div
        ref={trackRef}
        className="flex w-max will-change-transform motion-reduce:w-full"
      >
        <Row items={items} />
        <Row items={items} dup />
      </div>
    </div>
  );
}
