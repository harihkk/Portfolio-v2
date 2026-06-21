# Content Conflicts Log

Purpose: a single, auditable record of every conflict between the old portfolio (`harihkk.github.io`) and the current resume, plus repo-vs-metadata conflicts, showing both sides, the chosen resolution, the authority, and any item held for Hari's approval. Nothing here is silently resolved.

## How to read this log

- **Old value**, what the prior site (`harihkk.github.io`) or repo metadata asserted.
- **Current value**, what the resume, repo source, or verified audit asserts.
- **Resolution**, the value that ships in v2.
- **Authority**, the source that wins, and why.
- **Status**, `Resolved`, `Resolved (flag for confirmation)`, or `Held for user approval`.

A note on source integrity: the old-site repository `harihkk/harihkk.github.io` was audited and found to contain only a 1-byte `README.md` (single newline) with one commit ("Delete assets directory", 2026-05-25). No HTML, CSS, JS, assets, or design tokens are recoverable from it. Therefore the "old value" entries below are drawn from the documented conflict brief, not from recoverable old-site source. Any claim about the old site's visual design or stack is explicitly **Could not verify** from source.

---

## 1. Conflicts log (the six required conflicts)

| # | Field | Old value (`harihkk.github.io`) | Current value | Resolution | Authority / reason | Status |
|---|-------|---------------------------------|---------------|------------|--------------------|--------|
| C1 | Browser-agent product name | "Surf" | "Helm" / "Helm Browser Agent" (repo `harihkk/Helm-browser-agent`) | Use **"Helm Browser Agent"**; link the real repo `https://github.com/harihkk/Helm-browser-agent` | Current repo source is authoritative over the old site. The README's clone URL `Helm-agentic-browser.git` is **stale** and must not be linked. | Resolved |
| C2 | Helm license | GitHub API reported **no license** | README states **MIT** | Treat as **MIT** per README/author | README + author intent over GitHub API metadata; the API simply failed to detect a license file. Surfaced separately below for explicit confirmation. | Resolved (flag for confirmation) |
| C3 | Infinite Infolab job title | "Software Engineer, Machine Learning" | "Machine Learning Engineer" | Use **"Machine Learning Engineer"** | The resume is the authority for the professional record. | Resolved |
| C4 | Extra prior roles (KL University, Research Assistant; Rlogical Techsoft, Research Intern) | Listed on the old site as experience | **Not present** on the current resume | **Do not publish** as professional experience in v2 | Resume is the authority; these roles are unverified against it. Held for Hari's approval below. | Held for user approval |
| C5 | ContamCheckr PyPI status | (implied/ambiguous packaged tool) | **Not on PyPI**, confirmed 404; only DebugBrief is published | Never imply ContamCheckr is on PyPI; describe it as a local CLI, not a published package | Verified audit (PyPI 404 for `contamination-checker`; only `debugbrief` v1.3.0 is live). | Resolved |
| C6 | Primary site experience | Dark "chaos-mode" theme + physics/sandbox canvas | "The Systems Journal" editorial publication (warm paper palette, editorial serif/sans/mono) | **Do not carry** the chaos-mode theme or physics/sandbox canvas into v2 as the primary experience | v2 project brief explicitly forbids a physics game or dark-only hacker theme as the primary experience. | Resolved |

---

## 2. Supporting repo-vs-metadata details

### C1, Helm naming and repo link
- Ship name: **Helm Browser Agent** (masthead), product noun **Helm**.
- Canonical repo: `https://github.com/harihkk/Helm-browser-agent`.
- Stale artifact to avoid: the README's `git clone https://github.com/harihkk/Helm-agentic-browser.git` line. Do not link `Helm-agentic-browser`.
- No hosted/live version exists; Helm runs locally only.

### C2, Helm license
- Resolution stands as **MIT** per README and author. Because the GitHub API reported none, this is **flagged for confirmation** (see Held items) rather than treated as fully settled metadata.

### C5, Publication status across all flagships
To prevent any implication that ContamCheckr is published, the verified publication state of every flagship is recorded:

| Project | Repo | Version | Published? |
|---------|------|---------|-----------|
| DebugBrief | `harihkk/Debug-Brief` | v1.3.0 (releases v1.1.0-v1.3.0) | **Yes, PyPI as `debugbrief`** |
| Code Review Arena | `harihkk/code-review-arena` | v0.1.0 | No (not on any registry) |
| Helm Browser Agent | `harihkk/Helm-browser-agent` | v0.2 | No (not packaged) |
| ContamCheckr | `harihkk/contamination-checker` | v0.1.0 | **No, PyPI 404 confirmed** |

### C6, Design discontinuity
- The old site's "chaos-mode" dark theme and physics/sandbox canvas are intentionally **not** carried forward.
- The old site's actual visual stack and design tokens are **Could not verify**, the old-site repo is empty (1-byte README), so no palette, fonts, or layout are recoverable from source.

---

## 3. Held for user approval

These items are unresolved by design. Each shows both sides; none is silently picked.

| Item | Both sides | Why held | Needs from Hari |
|------|-----------|----------|-----------------|
| KL University (Research Assistant) | Old site listed it as experience vs. resume omits it. Git author email `kancharla.ha@northeastern.edu` confirms Northeastern only; KL University is a *likely* undergrad institution but **degree and dates are unconfirmed**. | Publishing unverified professional experience would contradict the resume. | **Needs user approval**: confirm whether to list KL University at all, and if so, the exact role, degree, and dates. |
| Rlogical Techsoft (Research Intern) | Old site listed it as experience vs. resume omits it. | Same as above, not on the resume. | **Needs user approval**: confirm whether to include this role and its exact title/dates. |
| Undergraduate degree / dates | Old site implies an undergrad affiliation (likely KL University); resume lists only the M.S. (Northeastern, May 2025). | Undergrad degree name and dates are **Could not verify** from any source. | **Needs user approval**: provide undergraduate institution, degree, and dates if they should appear. |
| LinkedIn URL | Old site / resume: a LinkedIn profile may exist, but the **URL is not known**. | No verified URL exists; inventing one is forbidden. | **Needs user approval**: provide the canonical LinkedIn URL. (Do not publish a guessed URL.) |
| Approval-gated employer metrics | Resume contains specific metrics (Morgan Stanley and Infinite Infolab, see list below). They are sourced from Hari's own public resume ("approved via resume"), but the brief treats public display as approval-gated. | Showing precise employer impact numbers publicly is a discretionary call; numbers must never be altered. | **Needs user approval**: confirm which (if any) of the resume metrics may be displayed publicly. Numbers are fixed as written on the resume and must not be changed. |
| Helm license confirmation (C2) | README/author: **MIT**. GitHub API: **none detected**. | Metadata disagreement; default is MIT per author. | **Needs user approval / confirmation**: confirm MIT is the intended license and that a `LICENSE` file is present in the repo. |

### Approval-gated employer metrics (verbatim, do not alter)
These are recorded for reference so the displayed numbers, if approved, match the resume exactly.

- **Morgan Stanley** (AI Software Engineer, Nov 2024-Present): recall@10 +42%; analyst research time -35%; p95 inference latency 3.5x; 1M+ daily inference requests; domain precision +28%; training cost -40%.
- **Infinite Infolab** (Machine Learning Engineer, May 2021-Jul 2023): demand accuracy +27%; MAPE -22%; 10M+ records; preprocessing -55%; 50K+ daily predictions; 99.9% uptime; 2x experimentation.

---

## 4. Standing constraints carried into v2

- **Phone number**: exists on the resume but **must never be published** in any form.
- **Public contact**: email `harikrishnak2426@zohomail.com`; GitHub `github.com/harihkk`.
- **No fabrication**: no invented metrics, publications, awards, dates, or claims. No photo, no video, no fake social/awards/publications.
- **Forks excluded**: `langgraph`, `litellm`, `MLOps` are forks and are **excluded entirely**.
- **Reference benchmark**: `shivanshgupta.com` is a **quality benchmark only**, never copy its code, copy, layout, data, or assets.
- **self-healing-pipeline metrics**: do **not** repeat its unverified "85%+ / production-grade" claims.

---

*Last reviewed: 2026-06-21. Source of truth: the verified audit at `docs/audit/raw-audit-2026-06-21.json` plus the canonical facts brief.*
