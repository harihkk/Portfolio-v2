import "server-only";
import { substackUrl } from "@/lib/site";

/* =========================================================================
   Substack RSS, only used when NEXT_PUBLIC_SUBSTACK_URL is configured.
   Server-side fetch with a strict timeout, sanitized excerpts, caching, and a
   graceful empty fallback. Full article bodies are never copied, only title,
   link, date, and a short sanitized excerpt. When unconfigured, returns
   { configured:false, posts:[] } so the UI hides Substack CTAs cleanly.
   ========================================================================= */

export type SubstackPost = {
  title: string;
  link: string;
  date: string;
  excerpt: string;
};

export type SubstackResult = {
  configured: boolean;
  ok: boolean;
  posts: SubstackPost[];
};

const TIMEOUT_MS = 4000;

function stripHtml(html: string): string {
  return html
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string): string {
  const m = block.match(
    new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"),
  );
  return m ? m[1] : "";
}

export async function getSubstackPosts(limit = 4): Promise<SubstackResult> {
  if (!substackUrl) return { configured: false, ok: false, posts: [] };
  const feedUrl = `${substackUrl.replace(/\/$/, "")}/feed`;
  try {
    const res = await fetch(feedUrl, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: 1800 },
    });
    if (!res.ok) return { configured: true, ok: false, posts: [] };
    const xml = await res.text();
    const items = xml.split(/<item>/i).slice(1, limit + 1);
    const posts: SubstackPost[] = items
      .map((raw) => {
        const block = raw.split(/<\/item>/i)[0] ?? "";
        const title = stripHtml(tag(block, "title")).slice(0, 160);
        const link = stripHtml(tag(block, "link")).slice(0, 500);
        const date = stripHtml(tag(block, "pubDate")).slice(0, 60);
        const desc = tag(block, "description");
        const excerpt = stripHtml(desc).slice(0, 220);
        return { title, link, date, excerpt };
      })
      .filter((p) => p.title && p.link.startsWith("http"));
    return { configured: true, ok: true, posts };
  } catch {
    return { configured: true, ok: false, posts: [] };
  }
}
