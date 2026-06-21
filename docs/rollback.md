# Rollback & Deployment Safety

Purpose: document the current live deployment, prove the original site stays recoverable, and define the gated cutover and rollback procedure for "The Systems Journal" (Portfolio V2).

## Guiding principle

The existing live site is **not replaced until two conditions are both met**: (1) the new build passes every quality gate, and (2) Hari explicitly approves the cutover. Until then, V2 ships only to a preview environment. Nothing about the current production deployment is touched.

## 1. Current deployment state

The live portfolio is a GitHub Pages **user site** serving a single static page.

| Property | Value |
| --- | --- |
| Host | GitHub Pages |
| Repository | `harihkk.github.io` (user/organization Pages site) |
| Default branch | `main` |
| Served content | A single `index.html` |
| Companion asset | The resume PDF |
| Build step | None, static `index.html` served directly |

Notes:
- This is the production surface visitors currently reach. It is independent of the V2 work.
- The old site also carried a dark "chaos-mode" theme and a physics/sandbox canvas. These are **intentionally not** carried into V2 (the brief forbids a physics game or a dark-only hacker theme as the primary experience). This is a deliberate redesign decision, not a regression.
- Custom-domain / DNS status for the live site: **Could not verify** from the audit data. Confirm whether the Pages site is served only at `harihkk.github.io` or also via a custom domain before any cutover that involves DNS.

## 2. How the original remains recoverable

The original deployment is recoverable because it was **never modified** by this work:

1. **No changes to the live repository.** V2 is a brand-new, separate Next.js project living in a separate directory and a separate git repository. No commits, branches, or settings of the `harihkk.github.io` Pages repository were altered.
2. **The live `index.html` and resume PDF are untouched** and continue to serve exactly as before.
3. **A cloned snapshot of the original exists** as an additional safety copy, independent of the live repo.

Because the source of the live site is unchanged, recovery does not depend on "undoing" anything, the original is already in its original state.

> Caveat: The audited clone of the live source captured here is empty (it contained no prose, titles, or assets, see `docs/content-conflicts.md` and the audit `gitMetadata`/`conflictsWithResume` notes). This means the *real* live content lives in the deployed Pages site / a different branch, not in that clone. The recoverability guarantee rests on the live Pages repo being **unmodified**, plus the separately retained snapshot, not on that empty clone.

## 3. Branch strategy

V2 development is isolated on its own branch within the V2 repository.

| Branch | Role |
| --- | --- |
| `main` | Scaffold baseline (preserved, untouched reference point) |
| `portfolio-v2` | Active build branch for The Systems Journal |

- `main` holds the preserved baseline scaffold.
- `portfolio-v2` is where the build happens; it is the current working branch.
- This branch separation is internal to the V2 repository and is distinct from the **live** `harihkk.github.io` repository's `main` branch, which is not involved in V2 development.

## 4. Pre-cutover checklist

Cutover is blocked until **all** of the following pass and are recorded.

| Gate | Requirement | Status |
| --- | --- | --- |
| Quality gates | All project quality gates pass (build, lint, type-check, tests) | Needs verification before cutover |
| Content provenance audit | Clean, every published claim traces to the verified facts / audit JSON; no fabricated metrics, awards, or publications | Needs verification before cutover |
| Responsive layout | Reviewed across breakpoints | Needs verification before cutover |
| Cross-browser | Reviewed on target browsers | Needs verification before cutover |
| Reduced motion | `prefers-reduced-motion` respected for GSAP/animation | Needs verification before cutover |
| Lighthouse | Reviewed (see `docs/performance-budget.md`) | Needs verification before cutover |

Provenance-specific reminders for the content audit (from the canonical facts):
- No phone number is ever published (one exists on the resume; it must stay private).
- Employer metrics are approval-gated (approved via Hari's public resume); never alter the numbers.
- LinkedIn URL is **not yet known**, do not invent one. **Needs user approval / input.**
- ContamCheckr is **not** on PyPI; only DebugBrief is published. Do not imply otherwise.
- No photo, no video, no fake social/awards/publications.
- Helm license is treated as MIT per its README/author but the GitHub API reported none, flag for confirmation.

## 5. Cutover options

The build is technology-isolated from the live site: V2 is **Next.js 16 (App Router) / React 19 / TypeScript (strict) / Tailwind v4 / GSAP**, whereas the live site is a static `index.html`. The two cannot accidentally overwrite each other.

Recommended sequence:

1. **Deploy V2 to Vercel first as a preview.** This gives a shareable, fully functional URL for review without touching the live site at all.
2. **Run the full pre-cutover checklist (Section 4) against the preview.**
3. **Obtain Hari's explicit approval.**
4. **Only then** repoint the production surface to V2.

Repointing options (choose at cutover time, once the custom-domain/DNS question in Section 1 is resolved):
- **Domain / DNS repoint**, point the domain at the Vercel deployment.
- **GitHub Pages replacement**, replace the served content of the Pages site with the V2 build output.

> The specific production repoint mechanism (DNS vs. Pages) depends on whether a custom domain is in use, which is currently **Could not verify**. Confirm before executing.

## 6. Rollback steps

If V2 must be reverted after cutover, recovery is fast because the original was never modified.

1. **Revert the production surface to the original.**
   - If cutover was a DNS repoint: restore the previous DNS records so the domain again serves the original GitHub Pages site.
   - If cutover replaced the Pages content: restore the original `index.html` (and resume PDF), available directly from the unmodified live repo and from the retained cloned snapshot.
2. **Confirm the original repository is unchanged.** Because no V2 work modified `harihkk.github.io`, the original source needs no reconstruction; it is already intact.
3. **Verify** the restored site serves the original `index.html` and the resume PDF, then confirm the rollback with Hari.
4. **Leave the V2 Vercel preview in place** for continued iteration; rolling back production does not require deleting the V2 build.

Rollback target state: the live experience is identical to its pre-cutover state, served from the untouched original source.

## Summary

- Live site (`harihkk.github.io` → single `index.html` + resume PDF on `main`) is **untouched**.
- Original is recoverable because it was never modified, plus a cloned snapshot exists.
- V2 lives in a separate repo/dir; `main` = scaffold baseline, `portfolio-v2` = build.
- Cutover is gated: preview on Vercel → pass all gates → Hari approves → repoint.
- Rollback = revert DNS/Pages to the untouched original.
- **Do not replace the live deployment until all gates pass AND Hari approves.**
