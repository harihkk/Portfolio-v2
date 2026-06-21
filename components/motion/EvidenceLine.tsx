"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

export type EvidenceAnchor = {
  id: string;
  label: string;
  detail: string;
  href?: string;
};

/**
 * The Evidence Line, the site's signature interaction.
 * A thin signal line carries a draggable node. Drag it (pointer) or move it
 * (arrow keys) toward an evidence anchor to light the relationship; release and
 * it springs to the nearest anchor. Implemented as an ARIA slider so it is
 * fully keyboard operable, and it never traps scroll or blocks reading. Under
 * reduced motion the spring is replaced by instant snapping (CSS handles this).
 */
export default function EvidenceLine({
  anchors,
  caption = "Drag the signal, or use arrow keys, to connect the evidence.",
}: {
  anchors: EvidenceAnchor[];
  caption?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [pct, setPct] = useState(() => positionFor(0, anchors.length));
  const [dragging, setDragging] = useState(false);

  const settleTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(anchors.length - 1, index));
      activeRef.current = clamped;
      setActive(clamped);
      setPct(positionFor(clamped, anchors.length));
    },
    [anchors.length],
  );

  const pointerToPct = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  const nearestIndex = useCallback(
    (p: number) => Math.round((p / 100) * (anchors.length - 1)),
    [anchors.length],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => {
      const p = pointerToPct(e.clientX);
      const idx = nearestIndex(p);
      activeRef.current = idx;
      setPct(p);
      setActive(idx);
    };
    const up = () => {
      setDragging(false);
      setPct(positionFor(activeRef.current, anchors.length));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, pointerToPct, nearestIndex, anchors.length]);

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
      settleTo(anchors.length - 1);
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
          {/* base line */}
          <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-[color:var(--rule)]" />
          {/* lit portion up to the node */}
          <div
            aria-hidden
            className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-signal"
            style={{
              width: `${pct}%`,
              transition: dragging ? "none" : "width 0.45s cubic-bezier(.22,1,.36,1)",
            }}
          />
          {/* anchors */}
          {anchors.map((a, i) => {
            const p = positionFor(i, anchors.length);
            const isActive = i === active;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => settleTo(i)}
                tabIndex={-1}
                aria-hidden
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p}%` }}
              >
                <span
                  className={`block rounded-full transition-all duration-200 ${
                    isActive
                      ? "h-3 w-3 bg-signal shadow-[0_0_0_5px_var(--signal-wash)]"
                      : "h-2 w-2 bg-[color:var(--rule)]"
                  }`}
                />
              </button>
            );
          })}
          {/* draggable node (the slider) */}
          <div
            role="slider"
            tabIndex={0}
            aria-label={`Evidence signal. Current: ${current.label}`}
            aria-valuemin={1}
            aria-valuemax={anchors.length}
            aria-valuenow={active + 1}
            aria-valuetext={current.label}
            data-focus-ring
            onPointerDown={onPointerDown}
            onKeyDown={onKeyDown}
            className="group absolute top-1/2 z-10 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none active:cursor-grabbing"
            style={{
              left: `${pct}%`,
              transition: dragging
                ? "none"
                : "left 0.45s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <span className="h-4 w-4 rounded-full border-2 border-signal bg-paper shadow-[0_0_0_4px_var(--signal-wash)] transition-transform group-active:scale-90" />
          </div>
        </div>

        {/* readout */}
        <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-baseline">
          <p className="stamp text-sm text-signal-dark">
            {String(active + 1).padStart(2, "0")} / {String(anchors.length).padStart(2, "0")}
          </p>
          <p className="measure text-ink-soft">
            <span className="font-serif text-xl text-ink">{current.label}.</span>{" "}
            {current.detail}{" "}
            {current.href ? (
              <Link href={current.href} className="link-annotate text-signal-dark">
                Open ↗
              </Link>
            ) : null}
          </p>
        </div>

        {/* polite announcement for screen readers */}
        <p className="sr-only" aria-live="polite">
          {current.label}. {current.detail}
        </p>
      </div>
    </section>
  );
}

function positionFor(index: number, count: number): number {
  if (count <= 1) return 50;
  const min = 6;
  const max = 94;
  return min + (index / (count - 1)) * (max - min);
}
