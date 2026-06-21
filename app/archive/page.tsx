import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { archive } from "@/content/archive";
import PageHeader from "@/components/layout/PageHeader";
import ArchiveExplorer from "@/components/evidence/ArchiveExplorer";

export const metadata: Metadata = pageMetadata({
  title: "Archive",
  description:
    "The complete record, systems, releases, research, and professional milestones, each entry inspectable to its source.",
  path: "/archive",
});

export default function ArchivePage() {
  return (
    <>
      <PageHeader
        kicker="Evidence archive"
        title="The complete record."
        intro="Systems, releases, research, and professional milestones in one timeline. Every entry names its source so it stays inspectable."
        meta="Vol. I · Archive"
      />
      <section className="shell py-12">
        <ArchiveExplorer events={archive} />
      </section>
    </>
  );
}
