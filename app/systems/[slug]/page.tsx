import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSystem, systemSlugs } from "@/content/systems";
import { getPaper } from "@/content/research";
import { getNotesForSystem } from "@/lib/notes";
import { pageMetadata, softwareJsonLd } from "@/lib/seo";
import StatusTag from "@/components/editorial/StatusTag";
import FlowDiagram from "@/components/systems/FlowDiagram";
import DemoLoader from "@/components/systems/demos/DemoLoader";
import PaperCard from "@/components/research/PaperCard";
import NoteCard from "@/components/notes/NoteCard";
import Reveal from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return systemSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system)
    return pageMetadata({
      title: "System not found",
      path: `/systems/${slug}`,
    });
  return pageMetadata({
    title: system.title,
    description: system.oneLiner,
    path: `/systems/${slug}`,
    type: "article",
  });
}

function Field({
  kicker,
  children,
}: {
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="border-t border-[color:var(--hairline)] pt-6">
        <p className="kicker mb-4">{kicker}</p>
        {children}
      </section>
    </Reveal>
  );
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) notFound();

  const relatedPapers = system.relatedPaperIds
    .map((id) => getPaper(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const relatedNotes = getNotesForSystem(slug);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            softwareJsonLd({
              name: system.title,
              description: system.oneLiner,
              codeRepository: system.repo,
              path: `/systems/${slug}`,
              language: system.technologies[0],
            }),
          ),
        }}
      />

      {/* Masthead */}
      <header className="shell pt-8 sm:pt-12">
        <Reveal>
          <div className="flex items-center justify-between gap-4 font-mono text-[0.7rem] tracking-[0.12em] text-ink-muted uppercase">
            <Link href="/systems" className="link-annotate">
              ← Systems
            </Link>
            <span>
              {siteConfig.issue.volume} · Case study {system.index}
            </span>
          </div>
          <hr className="rule-strong mt-3 mb-8" />
          <div className="flex flex-wrap items-center gap-3">
            <span className="stamp text-4xl text-signal-dark">
              {system.index}
            </span>
            <StatusTag status={system.status} />
          </div>
          <h1 className="display-lg mt-4 font-serif text-ink">
            {system.title}
          </h1>
          <p className="mt-2 font-serif text-2xl text-ink-muted italic">
            {system.subtitle}
          </p>
          <p className="measure mt-6 text-lg text-ink-soft">
            {system.oneLiner}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={system.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-ink bg-ink px-4 py-2 font-mono text-[0.72rem] tracking-[0.1em] text-paper-elevated uppercase transition-opacity hover:opacity-85"
            >
              Repository ↗
            </a>
            {system.published ? (
              <a
                href={system.published}
                target="_blank"
                rel="noopener noreferrer"
                className="link-annotate font-mono text-[0.72rem] tracking-[0.08em] text-signal-dark uppercase"
              >
                PyPI ↗
              </a>
            ) : null}
            {system.docs ? (
              <a
                href={system.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="link-annotate font-mono text-[0.72rem] tracking-[0.08em] text-ink-soft uppercase"
              >
                Docs ↗
              </a>
            ) : null}
            <span className="font-mono text-[0.68rem] text-ink-muted">
              Verified @ {system.lastVerifiedCommit} · {system.lastVerifiedDate}
            </span>
          </div>
        </Reveal>
      </header>

      <div className="shell mt-12 flex flex-col gap-10 pb-8">
        <Field kicker="The problem">
          <p className="measure text-lg text-ink-soft">{system.problem}</p>
          <p className="measure mt-4 text-ink-muted">{system.failureMode}</p>
        </Field>

        <Field kicker="Product thesis">
          <p className="measure font-serif text-xl text-ink">{system.thesis}</p>
        </Field>

        <Field kicker="How it works">
          <p className="measure text-ink-soft">{system.howItWorks}</p>
          <div className="mt-6">
            <FlowDiagram
              steps={system.flow}
              label={`${system.title} execution flow`}
            />
          </div>
        </Field>

        <Field kicker="Architecture">
          <ul className="grid gap-px bg-[color:var(--hairline)] sm:grid-cols-2">
            {system.architecture.map((c) => (
              <li key={c.component} className="bg-paper p-4">
                <p className="font-mono text-sm text-ink">{c.component}</p>
                <p className="font-mono text-[0.66rem] text-signal-dark">
                  {c.path}
                </p>
                <p className="mt-1.5 text-sm text-ink-soft">{c.role}</p>
              </li>
            ))}
          </ul>
        </Field>

        {system.keyComponents.length ? (
          <Field kicker="Key components">
            <ul className="flex flex-col gap-3">
              {system.keyComponents.map((c) => (
                <li key={c.name} className="border-l-2 border-signal pl-4">
                  <p className="font-mono text-sm text-ink">{c.name}</p>
                  <p className="font-mono text-[0.66rem] text-ink-muted">
                    {c.path}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{c.what}</p>
                </li>
              ))}
            </ul>
          </Field>
        ) : null}
      </div>

      {/* Demonstration */}
      <section className="bg-paper-deep py-14">
        <div className="shell">
          <Reveal>
            <p className="kicker mb-2">Demonstration</p>
            <h2 className="display-md font-serif text-ink">See it run.</h2>
            <p className="measure mt-3 text-ink-soft">
              A deterministic, local illustration of the core behaviour, no live
              model, fully resettable.
            </p>
          </Reveal>
          <div className="mt-8 lg:max-w-2xl">
            <Reveal>
              <DemoLoader slug={system.slug} />
            </Reveal>
          </div>
          {slug === "debugbrief" ? (
            <Reveal>
              <figure className="mt-10 lg:max-w-2xl">
                <Image
                  src="/artifacts/debugbrief-demo.gif"
                  alt="A failing test streams live, the fix lands, the re-run passes, and the generated brief appears."
                  width={1050}
                  height={640}
                  unoptimized
                  loading="lazy"
                  className="h-auto w-full border border-[color:var(--hairline)]"
                />
                <figcaption className="mt-2 font-mono text-[0.66rem] text-ink-muted">
                  Real terminal capture from the DebugBrief repository
                  (docs/demo.gif).
                </figcaption>
              </figure>
            </Reveal>
          ) : null}
        </div>
      </section>

      <div className="shell flex flex-col gap-10 py-12">
        <Field kicker="Evidence">
          <ul className="flex flex-col gap-3">
            {system.evidence.map((e) => (
              <li
                key={e.type}
                className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4"
              >
                <span className="font-mono text-[0.7rem] tracking-[0.08em] text-signal-dark uppercase">
                  {e.type}
                </span>
                <span className="text-sm text-ink-soft">
                  {e.detail}{" "}
                  <span className="font-mono text-[0.64rem] text-ink-muted">
                    [{e.source}]
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Field>

        <Field kicker="Honest limitations">
          <ul className="measure flex flex-col gap-2">
            {system.limitations.map((l) => (
              <li key={l} className="flex gap-3 text-ink-soft">
                <span aria-hidden className="text-warning">
                  -
                </span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </Field>

        <Field kicker="Technologies">
          <div className="flex flex-wrap gap-1.5">
            {system.technologies.map((t) => (
              <span
                key={t}
                className="border border-[color:var(--hairline)] px-2.5 py-1 font-mono text-[0.7rem] text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>
        </Field>

        {system.install.length ? (
          <Field kicker="Install & run">
            <pre
              tabIndex={0}
              aria-label="Install and run commands"
              className="overflow-x-auto border border-[color:var(--hairline)] bg-ink p-4 font-mono text-[0.78rem] leading-relaxed text-paper-elevated focus-visible:outline-2 focus-visible:outline-signal"
            >
              <code>{system.install.join("\n")}</code>
            </pre>
          </Field>
        ) : null}

        {relatedNotes.length ? (
          <Field kicker="Related field notes">
            <div>
              {relatedNotes.map((n) => (
                <NoteCard key={n.slug} note={n} />
              ))}
            </div>
          </Field>
        ) : null}

        {relatedPapers.length ? (
          <Field kicker="Related research">
            <div>
              {relatedPapers.map((p) => (
                <PaperCard
                  key={p.slug}
                  paper={p}
                  href={`/research/${p.slug}`}
                />
              ))}
            </div>
          </Field>
        ) : null}

        <Reveal>
          <nav className="flex items-center justify-between border-t-2 border-ink pt-6 font-mono text-[0.72rem] tracking-[0.08em] uppercase">
            <Link href="/systems" className="link-annotate text-ink-soft">
              ← All systems
            </Link>
            <Link href="/contact" className="link-annotate text-signal-dark">
              Open channel →
            </Link>
          </nav>
        </Reveal>
      </div>
    </article>
  );
}
