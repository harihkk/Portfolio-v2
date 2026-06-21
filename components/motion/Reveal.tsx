"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, EASE } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** travel distance in px */
  y?: number;
  delay?: number;
  /** when true, stagger direct children marked with data-reveal-item */
  stagger?: boolean;
  once?: boolean;
};

/**
 * Scroll-triggered editorial reveal. The wrapper carries data-reveal so its
 * start state is armed pre-paint (see the inline script in the root layout),
 * which means no flash and full visibility when JS is off or motion is reduced.
 */
export default function Reveal({
  children,
  className,
  y = 22,
  delay = 0,
  stagger = false,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      if (stagger) {
        const items = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
        gsap.set(el, { opacity: 1 });
        gsap.set(items, { opacity: 0, y });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: EASE,
          stagger: 0.08,
          delay,
          scrollTrigger: { trigger: el, start: "top 86%", once },
        });
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: EASE,
            delay,
            scrollTrigger: { trigger: el, start: "top 86%", once },
          },
        );
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal="" className={className}>
      {children}
    </div>
  );
}
