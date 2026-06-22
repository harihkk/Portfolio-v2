import Link from "next/link";
import { siteConfig, contact } from "@/lib/site";
import { profile } from "@/content/profile";
import { systems } from "@/content/systems";
import { getPaper } from "@/content/research";
import { earlierWork } from "@/content/earlier-work";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { getAllNotes } from "@/lib/notes";

import Reveal from "@/components/motion/Reveal";
import Marquee from "@/components/motion/Marquee";
import EvidenceLine, {
  type EvidenceAnchor,
} from "@/components/motion/EvidenceLine";
import SectionHeader from "@/components/editorial/SectionHeader";
import MetricGrid from "@/components/editorial/MetricGrid";
import SystemsPlate from "@/components/systems/SystemsPlate";
import FlagshipEntry from "@/components/systems/FlagshipEntry";
import DemoLoader from "@/components/systems/demos/DemoLoader";
import PaperCard from "@/components/research/PaperCard";
import NoteCard from "@/components/notes/NoteCard";
import EvidenceArchive from "@/components/evidence/EvidenceArchive";
import BuildArtifacts from "@/components/evidence/BuildArtifacts";

const MARQUEE = [
  "Execution-backed evaluation",
  "Agent reliability",
  "Retrieval systems",
  "Developer infrastructure",
  "Model serving",
  "Python",
  "TypeScript",
  "FastAPI",
  "Kotlin",
  "GraphQL",
  "Kubernetes",
];

const FRONTIERS = [
  {
    key: "A",
    title: "Evaluation",
    body: "Separating plausible output from validated performance, execution-backed scoring, golden datasets, and LLM-as-judge harnesses that catch regressions.",
  },
  {
    key: "B",
    title: "Agent reliability",
    body: "Agents that observe state, operate within bounds, recover from failure, and expose exactly what happened, reporting honest outcomes instead of faked success.",
  },
  {
    key: "C",
    title: "Developer infrastructure",
    body: "Recording commands, failures, recoveries, releases, and engineering evidence so a claim about a system can be inspected, not just asserted.",
  },
  {
    key: "D",
    title: "Production AI",
    body: "Retrieval, serving, full-stack delivery, deployment, and monitoring at production scale, the path from a model to a system people depend on.",
  },
];

const INDEX_ITEMS = [
  { n: "I", label: "Systems", href: "#systems" },
  { n: "II", label: "Engineering record", href: "#record" },
  { n: "III", label: "Research desk", href: "#research" },
  { n: "IV", label: "Evidence archive", href: "#evidence" },
  { n: "V", label: "Field notes", href: "#notes" },
  { n: "VI", label: "Earlier work", href: "#earlier" },
  { n: "VII", label: "About", href: "/about" },
  { n: "VIII", label: "Contact", href: "#contact" },
];

const EVIDENCE_ANCHORS: EvidenceAnchor[] = [
  {
    id: "thesis",
    label: "The thesis",
    detail:
      "Systems are judged by what happens after they produce, did it complete, apply, pass, recover.",
    href: "/about",
  },
  {
    id: "cra",
    label: "Code Review Arena",
    detail:
      "Scores a found bug and a working fix separately, 306 tests, 30 cases.",
    href: "/systems/code-review-arena",
  },
  {
    id: "helm",
    label: "Helm Browser Agent",
    detail:
      "Reports done only with visible-page proof, 192 tests, 40 of them on the SSRF guard.",
    href: "/systems/helm-browser-agent",
  },
  {
    id: "debugbrief",
    label: "DebugBrief",
    detail:
      "An evidence-only debugging brief, on PyPI, 376 tests across Python 3.9-3.14.",
    href: "/systems/debugbrief",
  },
  {
    id: "contamcheckr",
    label: "ContamCheckr",
    detail:
      "A caveated contamination evidence score, never a verdict, 30 tests.",
    href: "/systems/contamcheckr",
  },
];

const researchPreview = [
  "swe-bench",
  "webarena",
  "rephrased-contamination",
  "ragas",
]
  .map((slug) => getPaper(slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

export default function HomePage() {
  const notes = getAllNotes().slice(0, 3);

  return (
    <>
      {/* 01 + 02, Masthead + lead story */}
      <section className="shell pt-8 sm:pt-12">
        <Reveal>
          <div className="flex items-center justify-between gap-4 font-mono text-[0.7rem] tracking-[0.12em] text-ink-muted uppercase">
            <span>{siteConfig.location}</span>
            <span>
              {siteConfig.issue.volume} · {siteConfig.issue.label}
            </span>
          </div>
          <hr className="rule-strong mt-3" />
        </Reveal>

        <Reveal>
          <p className="mt-6 text-center font-serif text-sm tracking-[0.3em] text-ink-muted uppercase">
            The Systems Journal
          </p>
          <h1 className="display-xl mt-2 text-center font-serif text-ink">
            Hari Kancharla
          </h1>
          <p className="mt-4 text-center font-mono text-[0.72rem] tracking-[0.16em] text-ink-soft uppercase">
            {siteConfig.role}, {siteConfig.disciplines.join(" · ")}
          </p>
          <hr className="rule mt-6" />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Reveal>
            <div>
              <p className="kicker">Lead story</p>
              <h2 className="display-lg mt-3 font-serif text-ink">
                Building AI systems that have to prove they work.
              </h2>
              <p className="measure mt-6 text-lg text-ink-soft">
                {profile.thesis}
              </p>
              <p className="measure mt-4 text-ink-muted">{profile.summary}</p>

              <div className="mt-8 flex flex-wrap gap-x-4 gap-y-3">
                <Link
                  href="#systems"
                  className="border border-ink bg-ink px-5 py-2.5 font-mono text-[0.72rem] tracking-[0.1em] text-paper-elevated uppercase transition-opacity hover:opacity-85"
                >
                  Explore systems
                </Link>
                <Link
                  href="/experience"
                  className="border border-ink px-5 py-2.5 font-mono text-[0.72rem] tracking-[0.1em] text-ink uppercase transition-colors hover:bg-ink hover:text-paper-elevated"
                >
                  Engineering record
                </Link>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-annotate self-center font-mono text-[0.72rem] tracking-[0.08em] text-ink-soft uppercase"
                >
                  GitHub ↗
                </a>
                <a
                  href={contact.resume.href}
                  className="link-annotate self-center font-mono text-[0.72rem] tracking-[0.08em] text-signal-dark uppercase"
                >
                  Résumé ↗
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <SystemsPlate />
          </Reveal>
        </div>
      </section>

      {/* Signature interaction */}
      <div className="mt-16">
        <EvidenceLine anchors={EVIDENCE_ANCHORS} />
      </div>

      {/* 03, Verified numbers */}
      <section className="shell py-16 sm:py-24">
        <SectionHeader
          kicker="By the numbers"
          index="§ 03"
          title="Selected numbers"
          intro="Each figure traces to a repository, a test suite, a release, or my resume. I would rather show a small honest number than a big vague one."
        />
        <div className="mt-10">
          <MetricGrid />
        </div>
      </section>

      {/* 04, Index */}
      <section className="shell py-12">
        <SectionHeader kicker="In this issue" index="§ 04" title="The index." />
        <Reveal stagger>
          <ul className="mt-8 border-t border-[color:var(--hairline)]">
            {INDEX_ITEMS.map((item) => (
              <li key={item.label} data-reveal-item>
                <Link
                  href={item.href}
                  className="group flex items-baseline justify-between gap-4 border-b border-[color:var(--hairline)] py-4"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="stamp w-8 text-sm text-ink-muted">
                      {item.n}
                    </span>
                    <span className="font-serif text-2xl text-ink transition-colors group-hover:text-signal-dark sm:text-3xl">
                      {item.label}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="text-rule transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* 05, Moving record */}
      <div className="my-8">
        <Marquee items={MARQUEE} />
      </div>

      {/* 06, Four frontiers */}
      <section className="shell py-16 sm:py-24">
        <SectionHeader
          kicker="Engineering focus areas"
          index="§ 06"
          title="What I build"
        />
        <Reveal stagger>
          <div className="mt-10 grid gap-px bg-[color:var(--hairline)] sm:grid-cols-2">
            {FRONTIERS.map((f) => (
              <div key={f.key} data-reveal-item className="bg-paper p-6 sm:p-8">
                <span className="stamp text-3xl text-signal-dark">{f.key}</span>
                <h3 className="mt-3 font-serif text-2xl text-ink">{f.title}</h3>
                <p className="mt-2 text-ink-soft">{f.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 07, Flagship systems */}
      <section id="systems" className="shell scroll-mt-24 py-16 sm:py-24">
        <SectionHeader
          kicker="Flagship systems"
          index="§ 07"
          title="Four systems I built"
          intro="Each one is built around a single idea: make the system show its work. The counts and statuses below were read straight from each repository."
        />
        <div className="mt-14 flex flex-col gap-20">
          {systems.map((s) => (
            <FlagshipEntry key={s.slug} system={s} />
          ))}
        </div>
      </section>

      {/* 08, Interactive demonstrations */}
      <section
        id="demonstrations"
        className="scroll-mt-24 bg-paper-deep py-16 sm:py-24"
      >
        <div className="shell">
          <SectionHeader
            kicker="Interactive demonstrations"
            index="§ 08"
            title="See them run"
            intro="Four small, deterministic playgrounds. No live model, no fake numbers. Each one shows how a system behaves, and you can reset it."
          />
          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2">
            {systems.map((s) => (
              <Reveal key={s.slug} className="h-full">
                <DemoLoader slug={s.slug} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 09, Professional engineering record */}
      <section id="record" className="shell scroll-mt-24 py-16 sm:py-24">
        <SectionHeader
          kicker="Experience"
          index="§ 09"
          title="Production work"
        />
        <div className="mt-10 flex flex-col gap-10">
          {experience.map((job) => (
            <Reveal key={job.id}>
              <article className="grid gap-4 border-t border-[color:var(--hairline)] pt-6 md:grid-cols-[1fr_2fr]">
                <div>
                  <h3 className="font-serif text-2xl text-ink">{job.org}</h3>
                  <p className="mt-1 font-mono text-[0.72rem] tracking-[0.06em] text-ink-soft uppercase">
                    {job.role}
                  </p>
                  <p className="mt-1 font-mono text-[0.7rem] text-ink-muted">
                    {job.location} · {job.start} - {job.end}
                  </p>
                </div>
                <p className="measure text-ink-soft">{job.summary}</p>
              </article>
            </Reveal>
          ))}
          <Reveal>
            <Link
              href="/experience"
              className="link-annotate font-mono text-[0.72rem] tracking-[0.08em] text-signal-dark uppercase"
            >
              Full engineering record ↗
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 10, Research desk */}
      <section
        id="research"
        className="scroll-mt-24 bg-paper-elevated py-16 sm:py-24"
      >
        <div className="shell">
          <SectionHeader
            kicker="Research desk"
            index="§ 10"
            title="Research I follow"
            intro="External papers I read alongside the work. These are not my publications. Each one links to arXiv and to the system it connects to."
          />
          <div className="mt-8">
            {researchPreview.map((p) => (
              <PaperCard key={p.slug} paper={p} href={`/research/${p.slug}`} />
            ))}
            <Reveal>
              <Link
                href="/research"
                className="link-annotate mt-6 inline-block font-mono text-[0.72rem] tracking-[0.08em] text-signal-dark uppercase"
              >
                Open the research desk ↗
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 11, Evidence archive */}
      <section id="evidence" className="shell scroll-mt-24 py-16 sm:py-24">
        <SectionHeader
          kicker="Evidence archive"
          index="§ 11"
          title="Tests and releases"
          intro="Tests, CI, releases, and validators: the record behind the claims. Test volume alone does not prove quality, but it is one signal worth showing."
        />
        <div className="mt-10">
          <EvidenceArchive />
        </div>
      </section>

      {/* 12, Build artifacts */}
      <section className="bg-paper-deep py-16 sm:py-24">
        <div className="shell">
          <SectionHeader
            kicker="Build artifacts"
            index="§ 12"
            title="Build artifacts"
            intro="Diagrams generated from each system's verified source layout. Where a repository has a real screenshot, it appears on its case study."
          />
          <div className="mt-10">
            <BuildArtifacts />
          </div>
        </div>
      </section>

      {/* 13, Field notes */}
      <section id="notes" className="shell scroll-mt-24 py-16 sm:py-24">
        <SectionHeader
          kicker="Field notes"
          index="§ 13"
          title="Notes"
          intro="Briefs and release notes drawn from the project docs. Each one is labeled for what it is, not dressed up as an essay."
        />
        <div className="mt-8">
          {notes.map((note) => (
            <NoteCard key={note.slug} note={note} />
          ))}
          <Reveal>
            <Link
              href="/notes"
              className="link-annotate mt-6 inline-block font-mono text-[0.72rem] tracking-[0.08em] text-signal-dark uppercase"
            >
              All field notes ↗
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 14, Earlier work */}
      <section
        id="earlier"
        className="scroll-mt-24 bg-paper-elevated py-16 sm:py-24"
      >
        <div className="shell">
          <SectionHeader
            kicker="Earlier work"
            index="§ 14"
            title="Earlier projects"
          />
          <Reveal stagger>
            <ul className="mt-8 border-t border-[color:var(--hairline)]">
              {earlierWork.map((p) => (
                <li
                  key={p.name}
                  data-reveal-item
                  className="grid grid-cols-1 gap-2 border-b border-[color:var(--hairline)] py-5 sm:grid-cols-[1fr_2fr_auto] sm:items-baseline sm:gap-6"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-xl text-ink">
                      {p.name}
                    </span>
                    <span className="stamp text-xs text-ink-muted">
                      {p.period}
                    </span>
                  </div>
                  <p className="text-sm text-ink-soft">{p.oneLiner}</p>
                  <div className="flex items-center gap-3 font-mono text-[0.66rem] tracking-[0.08em] uppercase">
                    <span className="text-ink-muted">{p.label}</span>
                    {p.live && p.liveVerified ? (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-annotate text-signal-dark"
                      >
                        Live ↗
                      </a>
                    ) : (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-annotate text-ink-soft"
                      >
                        Repo ↗
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 15, Education */}
      <section className="shell py-16">
        <SectionHeader kicker="Education" index="§ 15" title="Education" />
        <div className="mt-8">
          {education.map((e) => (
            <Reveal key={e.id}>
              <div className="flex flex-col gap-1 border-t border-[color:var(--hairline)] pt-6">
                <p className="font-serif text-2xl text-ink">
                  {e.degree} {e.field}
                </p>
                <p className="text-ink-soft">
                  {e.concentration
                    ? `Concentration: ${e.concentration} · `
                    : ""}
                  {e.institution}, {e.location}
                </p>
                <p className="font-mono text-[0.72rem] text-ink-muted">
                  {e.date}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 16 + 17, Human detail + Contact */}
      <section id="contact" className="shell scroll-mt-24 py-16 sm:py-24">
        <Reveal>
          <p className="kicker">Contact</p>
          <hr className="rule-strong mt-3 mb-8" />
          <h2 className="display-lg max-w-[16ch] font-serif text-ink">
            If it has to prove it works, I want to hear about it.
          </h2>
          <p className="measure mt-6 text-lg text-ink-soft">
            Evaluation infrastructure, reliable agents, developer tools,
            retrieval systems, or production AI: if that is the work, get in
            touch.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-3">
            <Link
              href="/contact"
              className="border border-ink bg-ink px-5 py-2.5 font-mono text-[0.72rem] tracking-[0.1em] text-paper-elevated uppercase transition-opacity hover:opacity-85"
            >
              Get in touch
            </Link>
            <a
              href={`mailto:${contact.email}`}
              className="border border-ink px-5 py-2.5 font-mono text-[0.72rem] tracking-[0.1em] text-ink uppercase transition-colors hover:bg-ink hover:text-paper-elevated"
            >
              {contact.email}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
