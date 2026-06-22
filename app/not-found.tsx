import Link from "next/link";
import { NAV_ITEMS } from "@/components/layout/nav-items";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60vh] flex-col justify-center py-20">
      <p className="kicker">Error 404 · off the index</p>
      <hr className="rule-strong mt-3 mb-8" />
      <h1 className="display-lg font-serif text-ink">
        This page isn&rsquo;t in the issue.
      </h1>
      <p className="measure mt-5 text-lg text-ink-soft">
        The record you were looking for has moved or never ran. Here is the
        index, every section is verifiable from here.
      </p>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        <li>
          <Link
            href="/"
            className="link-annotate font-mono text-[0.74rem] tracking-[0.08em] text-signal-dark uppercase"
          >
            Front page
          </Link>
        </li>
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="link-annotate font-mono text-[0.74rem] tracking-[0.08em] text-ink-soft uppercase"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
