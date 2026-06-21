import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { research } from "@/content/research";
import PageHeader from "@/components/layout/PageHeader";
import ResearchDesk from "@/components/research/ResearchDesk";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "Research Desk",
  description:
    "A reading desk of external arXiv papers connected to Hari Kancharla's engineering systems. External papers, not Hari's publications. Metadata verified against the arXiv API.",
  path: "/research",
});

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        kicker="Research desk"
        title="External papers, read against the work."
        intro="Each paper is an external work connected to a system, chosen for its bearing on a real engineering problem. These are not Hari's publications; every record is labeled External paper, and the metadata was verified against the arXiv API."
        meta="Vol. I · Research"
      />

      <section className="shell py-12">
        <ResearchDesk papers={research} />
      </section>

      {/* Reserved preprint area, honest about the current state */}
      <section className="shell py-12">
        <Reveal>
          <div className="border-2 border-dashed border-[color:var(--rule)] p-8">
            <p className="kicker">Preprints</p>
            <h2 className="mt-3 font-serif text-2xl text-ink">
              Reserved for authored work.
            </h2>
            <p className="measure mt-3 text-ink-soft">
              This space is held for preprints authored by Hari. It
              stays empty by design, no manuscript is claimed until a real,
              author-verified one exists. The reading desk above is curated
              external work, not authorship.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
