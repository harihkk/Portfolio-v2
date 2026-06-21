import "server-only";

/* =========================================================================
   Conservative GitHub metadata with hard timeout, caching, and local
   fallback. GitHub downtime must never break rendering, so every path
   resolves to the provided fallback. Stars/contribution graphs are never used.
   ========================================================================= */

export type RepoMeta = {
  repo: string;
  primaryLanguage: string | null;
  pushedAt: string | null;
  latestRelease: string | null;
  htmlUrl: string;
  live: boolean; // whether the data is fresh (true) or fallback (false)
};

const TIMEOUT_MS = 4000;

async function ghFetch(url: string): Promise<Response | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "the-systems-journal",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: 3600 },
    });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

export async function getRepoMeta(
  owner: string,
  repo: string,
  fallback: Omit<RepoMeta, "repo" | "htmlUrl" | "live">,
): Promise<RepoMeta> {
  const htmlUrl = `https://github.com/${owner}/${repo}`;
  const base: RepoMeta = {
    repo,
    htmlUrl,
    live: false,
    primaryLanguage: fallback.primaryLanguage,
    pushedAt: fallback.pushedAt,
    latestRelease: fallback.latestRelease,
  };

  const res = await ghFetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!res) return base;
  try {
    const data = (await res.json()) as {
      language?: string;
      pushed_at?: string;
    };
    let latestRelease = fallback.latestRelease;
    const relRes = await ghFetch(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
    );
    if (relRes) {
      const rel = (await relRes.json()) as { tag_name?: string };
      if (rel.tag_name) latestRelease = rel.tag_name;
    }
    return {
      repo,
      htmlUrl,
      live: true,
      primaryLanguage: data.language ?? fallback.primaryLanguage,
      pushedAt: data.pushed_at ?? fallback.pushedAt,
      latestRelease,
    };
  } catch {
    return base;
  }
}
