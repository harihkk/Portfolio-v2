"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

// Skip the very first paint (avoids an initial-load flicker); animate only on
// subsequent client navigations.
let firstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (firstLoad) {
        firstLoad = false;
        gsap.set(el, { opacity: 1, clipPath: "none" });
        return;
      }
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" },
      );
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
