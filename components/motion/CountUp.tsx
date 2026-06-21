"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

type CountUpProps = {
  value: number | null;
  display: string;
  prefix?: string;
  suffix?: string;
  animate?: boolean;
  className?: string;
};

/**
 * Counts up to `value` when scrolled into view, once. The final `display`
 * string is always the server-rendered text, so the real value is present
 * without JS and for non-numeric values (value === null) no animation runs.
 */
export default function CountUp({
  value,
  display,
  prefix = "",
  suffix = "",
  animate = true,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || value === null || !animate || prefersReducedMotion()) return;
      const proxy = { n: 0 };
      gsap.to(proxy, {
        n: value,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onStart: () => {
          el.textContent = `${prefix}0${suffix}`;
        },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(proxy.n)}${suffix}`;
        },
        onComplete: () => {
          el.textContent = display;
        },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
