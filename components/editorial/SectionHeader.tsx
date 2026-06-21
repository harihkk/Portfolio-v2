import Reveal from "@/components/motion/Reveal";

type SectionHeaderProps = {
  kicker: string;
  index?: string;
  title: string;
  intro?: string;
  id?: string;
};

/** Editorial section header: mono kicker + index stamp, hairline rule, serif title. */
export default function SectionHeader({
  kicker,
  index,
  title,
  intro,
  id,
}: SectionHeaderProps) {
  return (
    <Reveal>
      <header id={id} className="scroll-mt-28">
        <div className="flex items-baseline justify-between gap-4">
          <span className="kicker">{kicker}</span>
          {index ? (
            <span className="stamp text-sm text-ink-muted">{index}</span>
          ) : null}
        </div>
        <hr className="rule mt-3 mb-6" />
        <h2 className="display-md max-w-[20ch] font-serif text-ink">{title}</h2>
        {intro ? (
          <p className="measure mt-5 text-lg text-ink-soft">{intro}</p>
        ) : null}
      </header>
    </Reveal>
  );
}
