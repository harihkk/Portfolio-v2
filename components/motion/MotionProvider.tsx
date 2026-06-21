"use client";

import { useEffect } from "react";
import { registerGsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";

/**
 * Registers GSAP once, refreshes ScrollTrigger after fonts/images settle so
 * pinned/triggered positions are correct, and cleans triggers up on unmount.
 * The reveal hidden-state is armed by an inline script in <head> (before paint)
 * to avoid a flash; this provider only handles refresh + cleanup.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    registerGsap();

    const refresh = () => ScrollTrigger.refresh();

    // Recompute trigger positions after web fonts load (layout shifts).
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
