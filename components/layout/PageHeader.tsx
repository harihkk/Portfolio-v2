import Reveal from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site";

export default function PageHeader({
  kicker,
  title,
  intro,
  meta,
}: {
  kicker: string;
  title: string;
  intro?: string;
  meta?: string;
}) {
  return (
    <header className="shell pt-8 sm:pt-12">
      <Reveal>
        <div className="flex items-center justify-between gap-4 font-mono text-[0.7rem] tracking-[0.12em] text-ink-muted uppercase">
          <span>{siteConfig.brand}</span>
          <span>{meta ?? `${siteConfig.issue.volume} · ${kicker}`}</span>
        </div>
        <hr className="rule-strong mt-3 mb-8" />
        <p className="kicker">{kicker}</p>
        <h1 className="display-lg mt-3 max-w-[18ch] font-serif text-ink">{title}</h1>
        {intro ? (
          <p className="measure mt-6 text-lg text-ink-soft">{intro}</p>
        ) : null}
      </Reveal>
    </header>
  );
}
