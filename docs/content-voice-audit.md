# Content Voice Audit

Audit date: 2026-06-21. Target: Portfolio-v2 at HEAD `6ad90b2e73f770005ab41a112db0ecdbdab74825`.

This audit reviews the live copy voice in the Portfolio-v2 repository. It flags generated, defensive, abstract, and third-person phrasing that is actually present in the source, then recommends first-person rewrites and plainer headings. No personal history is invented. External arXiv papers stay labeled as external, not as Hari's publications.

## Scope of files reviewed

| Area               | File                      | Notes                                               |
| ------------------ | ------------------------- | --------------------------------------------------- |
| Home               | `app/page.tsx`            | Masthead, section headers, frontiers, contact block |
| About              | `app/about/page.tsx`      | Bio prose, principles, domains, timeline            |
| Contact            | `app/contact/page.tsx`    | Header, direct channels copy                        |
| Systems index      | `app/systems/page.tsx`    | Section headers                                     |
| Research desk      | `app/research/page.tsx`   | Header and labeling                                 |
| Field notes        | `app/notes/page.tsx`      | Header and labeling                                 |
| Engineering record | `app/experience/page.tsx` | Header and sourcing                                 |
| Evidence archive   | `app/archive/page.tsx`    | Header                                              |
| Profile content    | `content/profile.ts`      | Summary and thesis strings                          |
| Site config        | `lib/site.ts`             | Tagline                                             |
| OG image           | `app/opengraph-image.tsx` | Tagline duplication                                 |
| Provenance         | `content/provenance.ts`   | GitHub bio quote                                    |

## Voice problems found

### 1. Defensive, marketing-flavored section titles

These titles are slogan-shaped and read as self-defense or copywriting rather than as labels for the content beneath them.

| Location                                            | Current copy                            | Problem                                                               |
| --------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| `app/page.tsx:200`                                  | "Verified, sourced, defensible."        | Three abstract adjectives in a row. Defensive posture, not a heading. |
| `app/page.tsx:368`                                  | "The receipts."                         | Slangy and abstract for an evidence section.                          |
| `app/page.tsx:305` and `app/experience/page.tsx:22` | "Where the systems shipped."            | Reads as a slogan and is duplicated across two pages.                 |
| `app/page.tsx:382`                                  | "Architecture, not stock photos."       | Defensive framing (telling the reader what it is not).                |
| `app/page.tsx:288`                                  | "See the idea run."                     | Marketing imperative.                                                 |
| `app/page.tsx:249`                                  | "Four problems worth getting right."    | Abstract, non-descriptive.                                            |
| `app/page.tsx:269`                                  | "Four systems, one standard of proof."  | Slogan cadence.                                                       |
| `app/systems/page.tsx:34`                           | "Secondary projects, honestly labeled." | "honestly labeled" is defensive; the work should just be labeled.     |
| `app/page.tsx:423`                                  | "The archive, labeled honestly."        | Same defensive tic as above.                                          |

### 2. The repeated "prove it works" slogan

The same idea is restated in slightly different wording across at least six locations, which makes it read as a tagline being enforced rather than a single clear claim.

| Location                                            | Current copy                                             |
| --------------------------------------------------- | -------------------------------------------------------- |
| `lib/site.ts:18`                                    | "Building AI systems that have to prove they work."      |
| `app/page.tsx:148` and `app/opengraph-image.tsx:55` | "Building AI systems that have to prove they work."      |
| `app/page.tsx:494`                                  | "Building something that has to prove it works?"         |
| `app/contact/page.tsx:21`                           | "Let's talk about systems that have to prove they work." |
| `app/about/page.tsx:78`                             | "An engineer who wants the system to prove it works."    |

Recommendation: keep one canonical statement (the site tagline is a fine home for it) and let the other pages use plain, page-specific headings instead of restating the slogan.

### 3. Third-person bio on personal pages

The About and home pages narrate Hari in the third person, which reads as auto-generated copy on a personal site.

| Location                              | Current copy                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `content/profile.ts:9-12`             | "Hari is an AI Systems Engineer in Boston..." and "Hari's work focuses on what happens next..."  |
| `app/about/page.tsx:90`               | "The throughline across Hari's work is a distrust of output taken at face value."                |
| `app/about/page.tsx:99-105`           | "That instinct was earned across roles... The independent systems push the same idea further..." |
| `app/about/page.tsx:14-15` (metadata) | "Hari Kancharla is an AI Systems Engineer in Boston who moved across..."                         |

Recommendation: rewrite the About body and the profile `summary`/`thesis` in the first person ("I build...", "My work focuses on..."). Page metadata and JSON-LD can stay third person for SEO, since that is machine-facing, but the visible bio prose should be first person.

### 4. Stray, hard-to-read status line

`app/page.tsx:515` renders:

> "Status: shipping. Mood: caffeinated., i run on coffee. the code barely runs."

This concatenates two separate jokes plus a stray comma and period (". ,") into one line. The "Status: shipping. Mood: caffeinated." construction is a generated-feeling status meme. The GitHub bio quote "i run on coffee. the code barely runs." is genuine (it traces to `content/provenance.ts:39`) and is already used well on the About page (`app/about/page.tsx:190`), so it does not need to be repeated here in a broken form.

Recommendation: drop "Status: shipping. Mood: caffeinated." entirely and remove the duplicated bio quote from the home contact block. If a sign-off is wanted, a single clean first-person line is enough.

### 5. Defensive caveats embedded in headings and intros

Several intros over-explain their own honesty, which paradoxically reads as defensive. Examples: "not rounded up for effect" (`app/page.tsx:201`), "labeled honestly, never passed off as essays" (`app/page.tsx:397`), "honestly labeled" / "labeled honestly" (multiple). The underlying discipline is good and should stay in the body where it is load-bearing (for example the research-desk disclaimer that papers are external, not Hari's publications, at `app/research/page.tsx:21`). The fix is to move honesty into how things are labeled, not into adjectives in the titles.

## Recommended headings

Replace the slogan-style titles with plain, descriptive ones. The recommended set:

| Section            | Current                                          | Recommended        |
| ------------------ | ------------------------------------------------ | ------------------ |
| Verified numbers   | "Verified, sourced, defensible."                 | Selected numbers   |
| Frontiers          | "Four problems worth getting right."             | What I build       |
| Demonstrations     | "See the idea run."                              | How it works       |
| Engineering record | "Where the systems shipped."                     | Production work    |
| Research desk      | "External papers, connected to the work."        | Research I follow  |
| Evidence archive   | "The receipts."                                  | Tests and releases |
| Earlier work       | "The archive, labeled honestly."                 | Earlier projects   |
| Field notes        | "System briefs and release notes."               | Notes              |
| Education          | "Foundations."                                   | Education          |
| Contact            | "Building something that has to prove it works?" | Contact            |

## Recommended first-person rewrites

These are suggested directions, not new facts. Every claim below restates content already in the repo.

| Location                     | From                                                                                             | To (first person)                                                                                                                                                                                                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/profile.ts` summary | "Hari is an AI Systems Engineer in Boston with more than four years..."                          | "I am an AI Systems Engineer in Boston with more than four years building production LLM, retrieval, agentic, model-serving, backend, and full-stack systems. At Morgan Stanley I build retrieval and inference platforms for analyst and trading teams, owning retrieval quality, evaluation, guardrails, and reliability at scale." |
| `content/profile.ts` thesis  | "Hari's work focuses on what happens next..."                                                    | "My work focuses on what happens next: whether the action completed, whether the patch applies, whether the tests pass, whether the evidence is inspectable, and whether the system can recover when execution fails."                                                                                                                |
| `app/about/page.tsx:90`      | "The throughline across Hari's work is a distrust of output taken at face value."                | "The throughline across my work is a distrust of output taken at face value."                                                                                                                                                                                                                                                         |
| `app/about/page.tsx:99-105`  | "That instinct was earned across roles... The independent systems push the same idea further..." | Keep the same facts (Infinite Infolab forecasting with validation, backtesting, and drift monitoring; Morgan Stanley owning retrieval quality, evaluation, guardrails, and reliability; independent systems built so the evidence is the product), restated as "I earned that instinct across roles..."                               |
| `app/page.tsx:515`           | "Status: shipping. Mood: caffeinated., i run on coffee. the code barely runs."                   | Remove. The bio quote already lives on About.                                                                                                                                                                                                                                                                                         |

## What to keep

The accuracy discipline in the body copy is a strength and should be preserved:

- Research desk labels papers as external arXiv work, not Hari's publications, with metadata verified against the arXiv API (`app/research/page.tsx:21`). This is correct and must stay.
- Evidence and systems intros note that counts and statuses are verified at specific audited commits (`app/page.tsx:269`, `app/systems/page.tsx:24`). Keep the substance; only simplify the titles.
- The note that test volume alone does not prove quality (`app/page.tsx:369`) is honest and worth keeping in the body.
- The contact-form caveat that it "never claims a delivery it cannot confirm" (`app/contact/page.tsx:58`) is accurate and should remain.

## Summary

The copy is factually careful but stylistically over-produced: slogan-shaped titles, a repeated "prove it works" tagline across six places, a broken status meme line, and third-person bio prose on personal pages. The fix is mechanical and low-risk: switch the visible bio to first person, keep one canonical tagline, drop the status meme, and rename roughly ten section titles to plain descriptive headings. None of these changes require new facts.
