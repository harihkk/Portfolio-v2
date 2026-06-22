import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getAllNotes } from "@/lib/notes";
import { getSubstackPosts } from "@/lib/substack";
import PageHeader from "@/components/layout/PageHeader";
import NotesIndex from "@/components/notes/NotesIndex";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "Field Notes",
  description:
    "Engineering notes, system briefs, and release notes from Hari Kancharla, labeled honestly by kind, derived from verified project documentation.",
  path: "/notes",
});

export default async function NotesPage() {
  const notes = getAllNotes().map((n) => ({
    slug: n.slug,
    frontmatter: n.frontmatter,
    readingMinutes: n.readingMinutes,
  }));
  const substack = await getSubstackPosts();

  return (
    <>
      <PageHeader
        kicker="Field notes"
        title="Briefs, notes, and releases."
        intro="System briefs derived from verified project documentation, release notes, and engineering notes. Each is labeled by kind, a project-derived brief is never presented as a personal essay."
        meta="Vol. I · Notes"
      />

      <section className="shell py-12">
        <NotesIndex notes={notes} />
      </section>

      {/* Substack, only when configured */}
      {substack.configured ? (
        <section className="shell py-12">
          <Reveal>
            <p className="kicker">From the newsletter</p>
            <hr className="rule mt-3 mb-6" />
            {substack.ok && substack.posts.length ? (
              <ul className="flex flex-col">
                {substack.posts.map((post) => (
                  <li
                    key={post.link}
                    className="border-b border-[color:var(--hairline)] py-4"
                  >
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <p className="font-serif text-xl text-ink group-hover:text-signal-dark">
                        {post.title}
                      </p>
                      <p className="mt-1 font-mono text-[0.7rem] text-ink-muted">
                        {post.date}
                      </p>
                      {post.excerpt ? (
                        <p className="mt-2 text-sm text-ink-soft">
                          {post.excerpt}
                        </p>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink-muted">
                The newsletter feed is momentarily unavailable. Read the latest
                at the source.
              </p>
            )}
          </Reveal>
        </section>
      ) : null}
    </>
  );
}
