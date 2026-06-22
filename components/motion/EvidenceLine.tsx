"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, prefersReducedMotion, EASE } from "@/lib/motion";

export type EvidenceAnchor = {
  id: string;
  label: string;
  detail: string;
  href?: string;
};

/**
 * The Evidence Line, the site's signature interaction. A draggable signal node
 * slides along a line and lights the nearest evidence anchor. The hot path is
 * transform only: the node moves with `x` and the filled line scales with
 * `scaleX` via gsap.quickTo, the track width is cached with a ResizeObserver,
 * and React state changes only when the active anchor changes (never per
 * pointer frame). Fully keyboard operable as an ARIA slider; reduced motion
 * snaps instantly.
 */
export default function EvidenceLine({
  anchors,
  caption = "Drag the signal, or use the arrow keys, to connect the evidence.",
}: {
  anchors: EvidenceAnchor[];
  caption?: string;
}) {
  const count = anchors.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  const widthRef = useRef(0);
  const draggingRef = useRef(false);
  const activeRef = useRef(0);
  const quickX = useRef<((v: number) => void) | null>(null);
  const quickFill = useRef<((v: number) => void) | null>(null);
  const placeRef = useRef<(i: number) => void>(() => {});
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const node = nodeRef.current;
    const fill = fillRef.current;
    if (!track || !node || !fill) return;

    const reduce = prefersReducedMotion();
    gsap.set(node, { xPercent: -50, yPercent: -50 });
    gsap.set(fill, {
      transformOrigin: "left center",
      yPercent: -50,
      scaleX: 0,
    });
    quickX.current = reduce
      ? (v: number) => gsap.set(node, { x: v })
      : gsap.quickTo(node, "x", { duration: 0.4, ease: EASE });
    quickFill.current = reduce
      ? (v: number) => gsap.set(fill, { scaleX: v })
      : gsap.quickTo(fill, "scaleX", { duration: 0.45, ease: EASE });

    const placeAt = (index: number) => {
      const frac = fractionFor(index, count);
      quickX.current?.(frac * widthRef.current);
      quickFill.current?.(frac);
    };
    const measure = () => {
      widthRef.current = track.getBoundingClientRect().width;
      placeAt(activeRef.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const fracFromClientX = (clientX: number) => {
      const rect = track.getBoundingClientRect();
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const frac = fracFromClientX(e.clientX);
      quickX.current?.(frac * widthRef.current);
      quickFill.current?.(frac);
      const idx = Math.round(frac * (count - 1));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx); // state only when the anchor changes
      }
    };
    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      placeAt(activeRef.current); // snap to the nearest anchor
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // expose placeAt for keyboard handler via the ref bag
    placeRef.current = placeAt;

    return () => {
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [count]);

  const settleTo = (index: number) => {
    const clamped = Math.max(0, Math.min(count - 1, index));
    activeRef.current = clamped;
    setActive(clamped);
    placeRef.current(clamped);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    draggingRef.current = true;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      settleTo(active - 1);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      settleTo(active + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      settleTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      settleTo(count - 1);
    }
  };

  const current = anchors[active];

  return (
    <section
      aria-label="Evidence line"
      className="border-y border-[color:var(--hairline)] bg-paper-elevated/40 py-10"
    >
      <div className="shell">
        <p className="kicker mb-6">{caption}</p>

        <div className="relative h-16 select-none" ref={trackRef}>
          <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-[color:var(--rule)]" />
          {/* lit portion (transform: scaleX) */}
          <div
            ref={fillRef}
            aria-hidden
            className="absolute top-1/2 left-0 h-[2px] w-full bg-signal"
          />
          {/* anchors (static markers) */}
          {anchors.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => settleTo(i)}
              tabIndex={-1}
              aria-hidden
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${fractionFor(i, count) * 100}%` }}
            >
              <span
                className={`block rounded-full transition-all duration-200 ${
                  i === active
                    ? "h-3 w-3 bg-signal shadow-[0_0_0_5px_var(--signal-wash)]"
                    : "h-2 w-2 bg-[color:var(--rule)]"
                }`}
              />
            </button>
          ))}
          {/* draggable node (the slider, transform: x) */}
          <div
            ref={nodeRef}
            role="slider"
            tabIndex={0}
            aria-label={`Evidence signal. Current: ${current.label}`}
            aria-valuemin={1}
            aria-valuemax={count}
            aria-valuenow={active + 1}
            aria-valuetext={current.label}
            data-focus-ring
            onPointerDown={onPointerDown}
            onKeyDown={onKeyDown}
            className="group absolute top-1/2 left-0 z-10 grid h-9 w-9 cursor-grab touch-none place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none active:cursor-grabbing"
          >
            <span className="h-4 w-4 rounded-full border-2 border-signal bg-paper shadow-[0_0_0_4px_var(--signal-wash)] transition-transform group-active:scale-90" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-baseline">
          <p className="stamp text-sm text-signal-dark">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </p>
          <p className="measure text-ink-soft">
            <span className="font-serif text-xl text-ink">
              {current.label}.
            </span>{" "}
            {current.detail}{" "}
            {current.href ? (
              <Link
                href={current.href}
                className="link-annotate text-signal-dark"
              >
                Open ↗
              </Link>
            ) : null}
          </p>
        </div>

        <p className="sr-only" aria-live="polite">
          {current.label}. {current.detail}
        </p>
      </div>
    </section>
  );
}

function fractionFor(index: number, count: number): number {
  if (count <= 1) return 0.5;
  const min = 0.06;
  const max = 0.94;
  return min + (index / (count - 1)) * (max - min);
}
