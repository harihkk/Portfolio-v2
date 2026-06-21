import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, profilePageJsonLd } from "@/lib/seo";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import PageHeader from "@/components/layout/PageHeader";
import SectionHeader from "@/components/editorial/SectionHeader";
import SystemsPlate from "@/components/systems/SystemsPlate";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Hari Kancharla is an AI Systems Engineer in Boston who moved across machine learning, full-stack systems, production AI, evaluation, and developer tooling, with a bias for evidence over confident output.",
  path: "/about",
});

const PRINCIPLES = [
  {
    title: "Prefer evidence over confident output",
    body: "A fluent answer is not a correct one. Build the check that tells you which it is.",
  },
  {
    title: "Treat failure as part of the design",
    body: "Systems hit walls. Detect them, recover where possible, and report the wall honestly instead of faking a pass.",
  },
  {
    title: "Separate detection from validation",
    body: "Noticing a problem and fixing it are different acts. Score them apart so the gap stays visible.",
  },
  {
    title: "Make execution observable",
    body: "Record what ran, what failed, what passed. A claim about a system should be inspectable, not asserted.",
  },
  {
    title: "Build across the full path",
    body: "From retrieval and fine-tuning to serving, deployment, and monitoring, the value is in the whole path, not a notebook.",
  },
];

const DOMAINS = [
  {
    title: "Evaluation & guardrails",
    detail: "LLM-as-judge, golden datasets, execution-backed scoring, drift and hallucination monitoring.",
  },
  {
    title: "Agents & tool use",
    detail: "Bounded action spaces, structured intent, evidence-gated completion, recovery and fallback.",
  },
  {
    title: "Retrieval & RAG",
    detail: "Hybrid vector + lexical retrieval, reranking, domain embeddings, recall-quality ownership.",
  },
  {
    title: "Model serving & optimization",
    detail: "LoRA fine-tuning, ONNX/TensorRT, quantization, batching, latency at scale.",
  },
  {
    title: "Backend & full-stack",
    detail: "Kotlin/Spring Boot, FastAPI, GraphQL, React/TypeScript, the API down to the client.",
  },
  {
    title: "MLOps & infrastructure",
    detail: "CI/CD, Kubernetes, model versioning and rollback, experiment tracking, observability.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd()) }}
      />
      <PageHeader
        kicker="About"
        title="An engineer who wants the system to prove it works."
        intro={profile.summary}
        meta="Vol. I · About"
      />

      <section className="shell py-12">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <Reveal>
            <div className="measure">
              <p className="kicker mb-2">Engineering philosophy</p>
              <p className="text-lg text-ink-soft">{profile.thesis}</p>
              <p className="mt-4 text-ink-soft">
                The throughline across Hari&rsquo;s work is a distrust of output taken at
                face value. A model can produce a fluent code review, a confident
                browser action, a clean-looking benchmark score, and be wrong in
                each. The interesting engineering is the layer that checks: the patch
                that has to apply and pass, the action that has to be provable from
                the page, the brief built only from what actually ran, the
                contamination score that keeps its caveats attached.
              </p>
              <p className="mt-4 text-ink-soft">
                That instinct was earned across roles. Forecasting systems at Infinite
                Infolab meant validation, backtesting, and drift monitoring before a
                number could be trusted. Production AI at Morgan Stanley meant owning
                retrieval quality, evaluation, guardrails, and reliability, not just
                shipping a model. The independent systems push the same idea further:
                evaluation, agent reliability, and developer tooling built so the
                evidence is the product.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <SystemsPlate />
          </Reveal>
        </div>
      </section>

      <section className="shell py-12">
        <SectionHeader kicker="Working principles" title="How the work gets made." />
        <Reveal stagger>
          <ol className="mt-10 grid gap-px bg-[color:var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} data-reveal-item className="bg-paper p-6">
                <span className="stamp text-2xl text-signal-dark">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-serif text-xl text-ink">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="shell py-12">
        <SectionHeader
          kicker="Technical domains"
          title="Where the work lands."
        />
        <Reveal stagger>
          <div className="mt-10 grid gap-px bg-[color:var(--hairline)] sm:grid-cols-2">
            {DOMAINS.map((d) => (
              <div key={d.title} data-reveal-item className="bg-paper p-6">
                <h3 className="font-mono text-[0.78rem] tracking-[0.06em] text-ink uppercase">
                  {d.title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">{d.detail}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="shell py-12">
        <SectionHeader kicker="Timeline" title="The path so far." />
        <div className="mt-10 flex flex-col gap-6">
          {experience.map((job) => (
            <Reveal key={job.id}>
              <div className="grid gap-1 border-t border-[color:var(--hairline)] pt-5 sm:grid-cols-[10rem_1fr]">
                <span className="font-mono text-[0.72rem] tracking-[0.08em] text-signal-dark uppercase">
                  {job.start} - {job.end}
                </span>
                <div>
                  <p className="font-serif text-xl text-ink">
                    {job.role}, {job.org}
                  </p>
                  <p className="text-sm text-ink-soft">{job.summary}</p>
                </div>
              </div>
            </Reveal>
          ))}
          {education.map((e) => (
            <Reveal key={e.id}>
              <div className="grid gap-1 border-t border-[color:var(--hairline)] pt-5 sm:grid-cols-[10rem_1fr]">
                <span className="font-mono text-[0.72rem] tracking-[0.08em] text-signal-dark uppercase">
                  {e.date}
                </span>
                <p className="font-serif text-xl text-ink">
                  {e.degree} {e.field}, {e.institution}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell py-12">
        <Reveal>
          <div className="border-t-2 border-ink pt-6">
            <p className="measure text-lg text-ink-soft">
              The honest version, from the GitHub bio:{" "}
              <span className="font-serif text-ink italic">
                i run on coffee. the code barely runs.
              </span>{" "}
              The rest of this site is the part that does.
            </p>
            <Link
              href="/systems"
              className="link-annotate mt-6 inline-block font-mono text-[0.72rem] tracking-[0.08em] text-signal-dark uppercase"
            >
              See the systems ↗
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
