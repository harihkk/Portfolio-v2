import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getNote, getAllNoteSlugs } from "@/lib/notes";
import { getSystem } from "@/content/systems";
import { getPaper } from "@/content/research";
import { pageMetadata, articleJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { mdxComponents } from "@/components/notes/mdx-components";
import Reveal from "@/components/motion/Reveal";

export function generateStaticParams() {
  return getAllNoteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note)
    return pageMetadata({ title: "Note not found", path: `/notes/${slug}` });
  return pageMetadata({
    title: note.frontmatter.title,
    description: note.frontmatter.summary,
    path: `/notes/${slug}`,
    type: "article",
  });
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const fm = note.frontmatter;
  const relatedSystem = fm.relatedSystem
    ? getSystem(fm.relatedSystem)
    : undefined;
  const relatedPaper = fm.relatedPaper ? getPaper(fm.relatedPaper) : undefined;

  return (
    <article className="shell pt-8 pb-12 sm:pt-12">
      {fm.authoredByHari ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              articleJsonLd({
                headline: fm.title,
                description: fm.summary,
                path: `/notes/${slug}`,
                datePublished: fm.date,
                dateModified: fm.updated || fm.date,
              }),
            ),
          }}
        />
      ) : null}

      <Reveal>
        <div className="flex items-center justify-between gap-4 font-mono text-[0.7rem] tracking-[0.12em] text-ink-muted uppercase">
          <Link href="/notes" className="link-annotate">
            ← Field notes
          </Link>
          <span>{siteConfig.issue.volume} · Notes</span>
        </div>
        <hr className="rule-strong mt-3 mb-8" />

        <div className="flex flex-wrap items-center gap-3 font-mono text-[0.7rem] tracking-[0.08em] uppercase">
          <span className="border border-[color:var(--rule)] px-2 py-0.5 text-ink-muted">
            {fm.kind}
          </span>
          <span className="text-ink-muted">
            {fm.date} · {note.readingMinutes} min read
          </span>
        </div>
        <h1 className="display-md mt-4 font-serif text-ink">{fm.title}</h1>
        <p className="measure mt-4 text-lg text-ink-soft">{fm.summary}</p>
        {!fm.authoredByHari ? (
          <p className="mt-4 font-mono text-[0.66rem] text-ink-muted">
            Derived from verified project documentation, a{" "}
            {fm.kind.toLowerCase()}, not a personal essay.
          </p>
        ) : null}
        <hr className="rule mt-6" />
      </Reveal>

      <Reveal>
        <div className="measure mt-8">
          <MDXRemote
            source={note.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: "wrap" }],
                ],
              },
            }}
          />
        </div>
      </Reveal>

      {relatedSystem || relatedPaper ? (
        <Reveal>
          <footer className="mt-12 border-t border-[color:var(--hairline)] pt-6">
            <p className="kicker mb-3">Connected</p>
            <ul className="flex flex-col gap-2">
              {relatedSystem ? (
                <li>
                  <Link
                    href={`/systems/${relatedSystem.slug}`}
                    className="link-annotate text-signal-dark"
                  >
                    System: {relatedSystem.title} ↗
                  </Link>
                </li>
              ) : null}
              {relatedPaper ? (
                <li>
                  <Link
                    href={`/research/${relatedPaper.slug}`}
                    className="link-annotate text-signal-dark"
                  >
                    Paper: {relatedPaper.title} ↗
                  </Link>
                </li>
              ) : null}
            </ul>
          </footer>
        </Reveal>
      ) : null}
    </article>
  );
}
