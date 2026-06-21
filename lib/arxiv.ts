import "server-only";
import { getPaper } from "@/content/research";
import type { ResearchPaper } from "@/lib/validation";

/* =========================================================================
   arXiv metadata. The build-time source of truth is content/research.ts,
   whose records were fetched and verified against the arXiv API during the
   content audit (2026-06-21). This module can optionally refresh a single
   record at request time, but ALWAYS falls back to the verified static record
   so an arXiv outage cannot break a page or introduce unverified data.
   ========================================================================= */

const TIMEOUT_MS = 4000;

type ArxivLive = {
  title: string;
  updated: string;
  published: string;
  live: true;
};

/** Best-effort live refresh of submission/revision dates for one paper. */
export async function fetchArxivDates(
  arxivId: string,
): Promise<ArxivLive | null> {
  try {
    const res = await fetch(
      `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(arxivId)}`,
      { signal: AbortSignal.timeout(TIMEOUT_MS), next: { revalidate: 86400 } },
    );
    if (!res.ok) return null;
    const xml = await res.text();
    const pick = (tag: string) => {
      const m = xml.match(new RegExp(`<${tag}>([^<]+)</${tag}>`));
      return m ? m[1].trim() : "";
    };
    const title = pick("title");
    const published = pick("published");
    const updated = pick("updated");
    if (!title || !published) return null;
    return { title, published, updated, live: true };
  } catch {
    return null;
  }
}

/** Returns the verified static record (the safe default for rendering). */
export function getVerifiedPaper(slug: string): ResearchPaper | undefined {
  return getPaper(slug);
}
