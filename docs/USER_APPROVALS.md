# Remaining User Approvals & Inputs

The site is complete and ships honestly without any of these. Each item below is either held back (not rendered) or uses a safe default until you decide. Nothing here blocks the build or deploy.

## Inputs needed (optional, enable more)

1. **LinkedIn URL**, not currently known, so the LinkedIn channel is hidden everywhere. Set `contact.linkedin` in [`lib/site.ts`](../lib/site.ts) and it appears in the footer and contact page automatically.
2. **Production domain**, SEO/canonical/sitemap default to `https://harihkk.github.io`. Set `NEXT_PUBLIC_SITE_URL` when the final domain is chosen.
3. **Substack URL**, if you start a newsletter, set `NEXT_PUBLIC_SUBSTACK_URL`; the Notes page then fetches and shows recent posts (sanitized, cached, with fallback). Until then, all Substack UI stays hidden.
4. **Contact email delivery**, the form falls back to a mailto link until `RESEND_API_KEY` + `CONTACT_FROM_EMAIL` are set (see `.env.example`). It never claims a delivery it can't confirm.
5. **GitHub token** (optional), `GITHUB_TOKEN` lifts API rate limits on the conservative repo-metadata fetch; everything works without it via local fallbacks.

## Decisions to confirm

6. **Employer metrics**, the résumé figures (recall@10 +42%, 1M+ daily requests, MAPE -22%, etc.) are shown on `/experience` and the homepage record, sourced from your own public résumé. If you'd rather omit any, set `publicApproved: false` on its record in [`content/provenance.ts`](../content/provenance.ts) and it disappears site-wide. See [public-content-review.md](public-content-review.md).
7. **Earlier experience**, KL University (Research Assistant) and Rlogical Techsoft (Research Intern) appear on the _old_ portfolio but not the current résumé, so they're **held and not shown**. Provide confirmed role + dates to include them.
8. **Undergraduate education**, not on the résumé; held. Provide degree, institution, and dates to add it to `/about` and `/experience`.
9. **Helm license**, the README states MIT but the repo had no license file detected via the GitHub API. Add a `LICENSE` file to the repo to make it unambiguous (the site states MIT per the README).

## Optional content you could add later

- A real personal photograph (the hero is architected so one can be introduced without a redesign, it currently uses the interactive systems plate by design).
- Personal first-person research annotations (the Research Desk currently uses neutral relevance notes, never invented opinions).
- An authored preprint (the Preprints area is reserved and stays empty until a verified manuscript exists).
- A `/uses` page (deferred, add when there's enough verified content).
