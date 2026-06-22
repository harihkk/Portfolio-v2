"use client";

import { useEffect } from "react";
import {
  registerGsap,
  prefersReducedMotion,
  ScrollTrigger,
} from "@/lib/motion";

type MotionWindow = Window & {
  __tsjMotionReady?: boolean;
  __tsjRevealFailsafe?: ReturnType<typeof setTimeout>;
};

/**
 * Registers GSAP, confirms motion readiness (which disarms the fail-open timer
 * set by the inline head script), refreshes ScrollTrigger after fonts/images
 * settle, and cleans triggers up on unmount.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    registerGsap();

    // Confirm motion is live so the fail-open failsafe does not strip the
    // reveal start-state. (If this code never runs, content reveals anyway.)
    const w = window as MotionWindow;
    w.__tsjMotionReady = true;
    if (w.__tsjRevealFailsafe) {
      clearTimeout(w.__tsjRevealFailsafe);
      w.__tsjRevealFailsafe = undefined;
    }

    const refresh = () => ScrollTrigger.refresh();
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
