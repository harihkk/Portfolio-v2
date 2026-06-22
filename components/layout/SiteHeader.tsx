"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { siteConfig } from "@/lib/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Toggle the stuck state via an IntersectionObserver sentinel, so React state
  // changes only when the threshold is crossed, never on every scroll event.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "-24px 0px 0px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Manage focus + escape for the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    firstLinkRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      <header
        className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
          stuck
            ? "border-[color:var(--hairline)] bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex items-center justify-between gap-4 py-3">
          <Link
            href="/"
            className="group flex items-baseline gap-2.5"
            aria-label={`${siteConfig.brand}, home`}
          >
            <span className="grid h-7 w-7 place-items-center bg-ink font-mono text-xs font-semibold text-paper-elevated">
              HK
            </span>
            <span className="font-serif text-base leading-none text-ink">
              The Systems Journal
            </span>
          </Link>

          {/* desktop nav */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative px-3 py-2 font-mono text-xs tracking-[0.1em] uppercase transition-colors ${
                      isActive(item.href)
                        ? "text-signal-dark"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) ? (
                      <span
                        aria-hidden
                        className="absolute inset-x-3 -bottom-px h-px bg-signal"
                      />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* mobile menu button */}
          <button
            ref={menuButtonRef}
            type="button"
            className="font-mono text-xs tracking-[0.12em] uppercase lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* mobile menu */}
        {menuOpen ? (
          <div
            id="mobile-menu"
            className="fixed inset-0 top-0 z-50 flex flex-col bg-paper lg:hidden"
          >
            <div className="shell flex items-center justify-between py-3">
              <span className="font-serif text-base">The Systems Journal</span>
              <button
                type="button"
                className="font-mono text-xs tracking-[0.12em] uppercase"
                onClick={() => {
                  setMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
              >
                Close
              </button>
            </div>
            <hr className="rule" />
            <nav
              aria-label="Mobile"
              className="shell flex-1 overflow-y-auto py-6"
            >
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item, i) => (
                  <li
                    key={item.href}
                    className="border-b border-[color:var(--hairline)]"
                  >
                    <Link
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-baseline justify-between py-4"
                    >
                      <span className="font-serif text-2xl text-ink">
                        {item.label}
                      </span>
                      <span className="stamp text-xs text-ink-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="shell pb-8 font-mono text-xs tracking-[0.1em] text-ink-muted uppercase">
              {siteConfig.locationShort} · {siteConfig.issue.volume}
            </p>
          </div>
        ) : null}
      </header>
    </>
  );
}
