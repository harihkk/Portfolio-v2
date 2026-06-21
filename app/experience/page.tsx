import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { getSystem } from "@/content/systems";
import PageHeader from "@/components/layout/PageHeader";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "Experience",
  description:
    "The professional engineering record of Hari Kancharla, Morgan Stanley and Infinite Infolab, organized by system category, with verified outcomes from the résumé.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        kicker="Engineering record"
        title="Where the systems shipped."
        intro="Titles and dates follow the current résumé. Outcomes are stated as the résumé states them; figures derive from that source."
      />

      <section className="shell py-12">
        <div className="flex flex-col gap-16">
          {experience.map((job) => (
            <Reveal key={job.id}>
              <article className="border-l-2 border-ink pl-6 sm:pl-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h2 className="font-serif text-3xl text-ink">{job.org}</h2>
                  <span className="font-mono text-[0.72rem] tracking-[0.1em] text-signal-dark uppercase">
                    {job.start} - {job.end}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[0.74rem] tracking-[0.06em] text-ink-soft uppercase">
                  {job.role} · {job.location}
                </p>
                <p className="measure mt-5 text-lg text-ink-soft">{job.summary}</p>

                <div className="mt-8 grid gap-px bg-[color:var(--hairline)] sm:grid-cols-2">
                  {job.categories.map((c) => (
                    <div key={c.title} className="bg-paper p-5">
                      <h3 className="font-mono text-[0.74rem] tracking-[0.08em] text-ink uppercase">
                        {c.title}
                      </h3>
                      <p className="mt-2 text-sm text-ink-soft">{c.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {job.technologies.map((t) => (
                    <span
                      key={t}
                      className="border border-[color:var(--hairline)] px-2 py-0.5 font-mono text-[0.66rem] text-ink-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {job.relatedSystems.length ? (
                  <p className="mt-5 font-mono text-[0.72rem] text-ink-muted">
                    Related systems:{" "}
                    {job.relatedSystems.map((slug, i) => {
                      const s = getSystem(slug);
                      if (!s) return null;
                      return (
                        <span key={slug}>
                          {i > 0 ? ", " : ""}
                          <Link
                            href={`/systems/${slug}`}
                            className="link-annotate text-signal-dark"
                          >
                            {s.title}
                          </Link>
                        </span>
                      );
                    })}
                  </p>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell py-12">
        <Reveal>
          <p className="kicker">Education</p>
          <hr className="rule mt-3 mb-6" />
          {education.map((e) => (
            <div key={e.id} className="mb-4">
              <p className="font-serif text-2xl text-ink">
                {e.degree} {e.field}
              </p>
              <p className="text-ink-soft">
                {e.concentration ? `Concentration: ${e.concentration} · ` : ""}
                {e.institution}, {e.location}
              </p>
              <p className="font-mono text-[0.72rem] text-ink-muted">{e.date}</p>
            </div>
          ))}
          <p className="mt-4 font-mono text-[0.7rem] text-ink-muted">
            Earlier education is held pending verified detail, see the content
            review.
          </p>
        </Reveal>
      </section>
    </>
  );
}
