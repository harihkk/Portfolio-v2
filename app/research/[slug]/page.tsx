import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { research, getPaper } from "@/content/research";
import { getSystem } from "@/content/systems";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";

const SYSTEM_SLUGS: Record<string, string> = {
  "code-review-arena": "code-review-arena",
  "helm-browser-agent": "helm-browser-agent",
  debugbrief: "debugbrief",
  contamcheckr: "contamcheckr",
};

export function generateStaticParams() {
  return research.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paper = getPaper(slug);
  if (!paper) return pageMetadata({ title: "Paper not found", path: `/research/${slug}` });
  return pageMetadata({
    title: paper.title,
    description: `External paper (arXiv:${paper.arxivId}) connected to ${paper.connectedTopic}. ${paper.relationship}`,
    path: `/research/${slug}`,
    type: "article",
  });
}

export default async function PaperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = getPaper(slug);
  if (!paper) notFound();

  const connectedSystem = SYSTEM_SLUGS[paper.connectedSystem]
    ? getSystem(SYSTEM_SLUGS[paper.connectedSystem])
    : undefined;
  const year = paper.submittedDate.slice(0, 4);

  return (
    <article className="shell pt-8 pb-12 sm:pt-12">
      <Reveal>
        <div className="flex items-center justify-between gap-4 font-mono text-[0.7rem] tracking-[0.12em] text-ink-muted uppercase">
          <Link href="/research" className="link-annotate">
            ← Research desk
          </Link>
          <span>{siteConfig.issue.volume} · Reading</span>
        </div>
        <hr className="rule-strong mt-3 mb-8" />

        <span className="inline-block border border-[color:var(--rule)] px-2 py-0.5 font-mono text-[0.64rem] tracking-[0.12em] text-ink-muted uppercase">
          External paper · not authored by Hari
        </span>
        <h1 className="display-md mt-4 font-serif text-ink">{paper.title}</h1>
        <p className="mt-4 measure font-mono text-sm text-ink-soft">
          {paper.authors.join(", ")}
        </p>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <Reveal>
          <div className="measure">
            <p className="kicker mb-2">Abstract (paraphrase)</p>
            <p className="text-ink-soft">{paper.abstract}</p>

            <p className="kicker mt-8 mb-2">
              Relationship to {connectedSystem?.title ?? "the work"}
            </p>
            <p className="text-lg text-ink">{paper.relationship}</p>

            <a
              href={paper.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block border border-ink bg-ink px-4 py-2 font-mono text-[0.72rem] tracking-[0.1em] text-paper-elevated uppercase transition-opacity hover:opacity-85"
            >
              Read on arXiv ↗
            </a>
          </div>
        </Reveal>

        <Reveal>
          <dl className="border-t border-[color:var(--hairline)] font-mono text-sm">
            <Row label="arXiv ID" value={paper.arxivId} />
            <Row label="Category" value={paper.primaryCategory} />
            <Row label="Submitted" value={paper.submittedDate} />
            {paper.latestRevision ? (
              <Row label="Latest revision" value={paper.latestRevision} />
            ) : null}
            <Row label="Year" value={year} />
            <Row label="Topic" value={paper.connectedTopic} />
            <Row label="Authored by Hari" value="No, external" />
            {connectedSystem ? (
              <div className="grid grid-cols-[8rem_1fr] gap-2 border-b border-[color:var(--hairline)] py-3">
                <dt className="text-ink-muted">Connected</dt>
                <dd>
                  <Link
                    href={`/systems/${connectedSystem.slug}`}
                    className="link-annotate text-signal-dark"
                  >
                    {connectedSystem.title}
                  </Link>
                </dd>
              </div>
            ) : null}
          </dl>
          <p className="mt-4 font-mono text-[0.64rem] text-ink-muted">
            Metadata verified against the arXiv API on {paper.verifiedAt}.
          </p>
        </Reveal>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-2 border-b border-[color:var(--hairline)] py-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
