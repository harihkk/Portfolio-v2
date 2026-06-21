"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register at module load (client only) so ScrollTrigger is available before
// any child component's useGSAP effect runs, child effects fire before the
// provider's effect, so effect-time registration is too late.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Idempotent GSAP plugin registration (kept for explicit call sites). */
export function registerGsap(): void {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export const EASE = "power3.out";
export const EASE_IN_OUT = "power2.inOut";

export { gsap, ScrollTrigger };
