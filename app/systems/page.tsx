import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { systems } from "@/content/systems";
import { earlierWork } from "@/content/earlier-work";
import PageHeader from "@/components/layout/PageHeader";
import SystemsExplorer from "@/components/systems/SystemsExplorer";
import SectionHeader from "@/components/editorial/SectionHeader";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "Systems",
  description:
    "Flagship engineering systems by Hari Kancharla, execution-backed evaluation, reliable agents, developer tooling, and contamination evidence, plus the earlier-work archive.",
  path: "/systems",
});

export default function SystemsPage() {
  return (
    <>
      <PageHeader
        kicker="Systems"
        title="The systems, by domain and maturity."
        intro="Four flagship systems and a labeled archive of earlier work. Filter by domain; every status and count is verified at the commit noted on the case study."
      />

      <section className="shell py-14">
        <SystemsExplorer systems={systems} />
      </section>

      <section className="shell py-14">
        <SectionHeader
          kicker="Earlier work"
          title="Secondary projects, honestly labeled."
          intro="Lower-prominence work, included for breadth, not parity. Live links are shown only where the deployment actually responds."
        />
        <Reveal stagger>
          <ul className="mt-8 border-t border-[color:var(--hairline)]">
            {earlierWork.map((p) => (
              <li
                key={p.name}
                data-reveal-item
                className="grid grid-cols-1 gap-2 border-b border-[color:var(--hairline)] py-5 sm:grid-cols-[1fr_2fr_auto] sm:items-baseline sm:gap-6"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-xl text-ink">{p.name}</span>
                  <span className="stamp text-xs text-ink-muted">{p.period}</span>
                </div>
                <p className="text-sm text-ink-soft">{p.oneLiner}</p>
                <div className="flex items-center gap-3 font-mono text-[0.66rem] tracking-[0.08em] uppercase">
                  <span className="text-ink-muted">{p.label}</span>
                  {p.live && p.liveVerified ? (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-annotate text-signal-dark"
                    >
                      Live ↗
                    </a>
                  ) : (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-annotate text-ink-soft"
                    >
                      Repo ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <Link
            href="/archive"
            className="link-annotate mt-8 inline-block font-mono text-[0.72rem] tracking-[0.08em] text-signal-dark uppercase"
          >
            Full evidence archive ↗
          </Link>
        </Reveal>
      </section>
    </>
  );
}
