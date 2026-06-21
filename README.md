# The Systems Journal, Hari Kancharla

An editorial engineering portfolio: _"Building AI systems that have to prove they work."_ A warm, paper-grained, motion-rich publication built around observable execution and inspectable evidence, no photograph, no video, no invented accomplishments.

Built with **Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · GSAP · MDX · Zod**.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run verify     # lint + typecheck + unit tests + production build
npm run test:e2e   # Playwright (Chromium + mobile); needs the browser installed
```

| Script | Does |
|---|---|
| `dev` / `build` / `start` | Next dev / production build / serve |
| `lint` · `typecheck` · `test` | ESLint · `tsc --noEmit` · Vitest |
| `test:e2e` | Playwright e2e + a11y + screenshots |
| `format` · `format:check` | Prettier |
| `verify` | lint → typecheck → test → build (the automated gate) |

First run for browsers: `npx playwright install chromium` (and `firefox webkit` for full cross-browser).

## What it contains

- **Routes:** `/` (long-form, 17 sections), `/about`, `/systems` + 4 case studies (`code-review-arena`, `helm-browser-agent`, `debugbrief`, `contamcheckr`), `/experience`, `/research` + paper detail, `/notes` (MDX) + note detail, `/archive`, `/contact`, plus `sitemap`, `robots`, OG image, and a 404.
- **Signature interaction:** the **Evidence Line**, a draggable + keyboard-operable signal node that lights up related evidence (an evolution of the old site's draggable logo).
- **Four interactive demonstrations** (deterministic, resettable, no live model) replacing the role of video.
- **Research Desk:** 14 external arXiv papers with metadata verified against the arXiv API, labeled external, never presented as Hari's publications.

## No-fabrication content system

Every public claim traces to a source. The ledger lives in [`content/provenance.ts`](content/provenance.ts); anything marked `publicApproved: false` is **never rendered**. Content modules (`content/*.ts`, `content/notes/*.mdx`) are **Zod-validated at import**, so malformed or unsourced content fails the build. See [docs/public-content-review.md](docs/public-content-review.md).

Contact information lives only in [`lib/site.ts`](lib/site.ts). The phone number is intentionally omitted from the codebase entirely.

## Integrations (all optional, all with fallbacks)

Configured via env (`.env.example`): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUBSTACK_URL`, `GITHUB_TOKEN`, `RESEND_API_KEY` / `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL`. GitHub, arXiv, and Substack helpers fetch server-side with strict timeouts and degrade to local fallbacks; the contact form falls back to a mailto link and never claims an unconfirmed delivery.

## Structure

```
app/        routes, layout, template (transitions), sitemap/robots/og, api/contact
components/ layout · editorial · motion · systems (+demos) · research · notes · evidence · forms
content/    profile, provenance, metrics, experience, education, systems, research, archive, earlier-work, notes/*.mdx
lib/        validation (Zod), site config, seo, motion, content (notes), github, arxiv, substack, rate-limit
docs/       audit + QA documentation (below)
e2e/        Playwright specs (site, interactions, a11y, screenshots)
```

## Documentation

`docs/` contains the full audit and QA trail: [content-audit](docs/content-audit.md), [content-conflicts](docs/content-conflicts.md), [reference-parity](docs/reference-parity.md), [information-architecture](docs/information-architecture.md), [animation-plan](docs/animation-plan.md), [performance-budget](docs/performance-budget.md), [implementation-plan](docs/implementation-plan.md), [public-content-review](docs/public-content-review.md), [qa-report](docs/qa-report.md), [accessibility-report](docs/accessibility-report.md), [performance-report](docs/performance-report.md), [rollback](docs/rollback.md), and [USER_APPROVALS](docs/USER_APPROVALS.md).

## Deployment & safety

The current live site (`harihkk.github.io`) is **untouched**, this is a separate project on the `portfolio-v2` branch (`main` holds the scaffold baseline). Do not repoint the live deployment until the build passes all gates and Hari approves. See [docs/rollback.md](docs/rollback.md).
