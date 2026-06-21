import Link from "next/link";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { siteConfig, getContactChannels } from "@/lib/site";

export default function Footer() {
  const channels = getContactChannels();
  const year = "2026";

  return (
    <footer className="mt-24 border-t-2 border-ink bg-paper-elevated">
      <div className="shell py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* colophon */}
          <div>
            <p className="kicker">
              {siteConfig.locationShort} · {siteConfig.issue.volume} ·{" "}
              {siteConfig.issue.established}
            </p>
            <p className="mt-4 font-serif text-3xl text-ink">
              The Systems Journal
            </p>
            <p className="measure mt-3 text-ink-soft">{siteConfig.tagline}</p>
          </div>

          {/* navigate */}
          <nav aria-label="Footer">
            <p className="kicker mb-4">Index</p>
            <ul className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-annotate text-ink-soft hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* channels */}
          <div>
            <p className="kicker mb-4">Open channel</p>
            <ul className="flex flex-col gap-2">
              {channels.map((c) => (
                <li key={c.key}>
                  <a
                    href={c.href}
                    className="link-annotate text-ink-soft hover:text-ink"
                    {...(c.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {c.label}
                    <span className="ml-2 font-mono text-xs text-ink-muted">
                      {c.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="rule mt-14 mb-6" />
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-mono text-xs tracking-[0.08em] text-ink-muted">
            © {year} {siteConfig.legalName}. Built with evidence, not adjectives.
          </p>
          <p
            className="font-mono text-xs tracking-[0.08em] text-ink-muted"
            title="straight from the source"
          >
            i run on coffee. the code barely runs.
          </p>
        </div>
      </div>
    </footer>
  );
}
