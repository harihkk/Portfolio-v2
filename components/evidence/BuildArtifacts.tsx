import Reveal from "@/components/motion/Reveal";
import { systems } from "@/content/systems";

/**
 * Build artifacts = generated architecture diagrams from each system's verified
 * component map (no invented product screenshots). Editorially varied grid.
 */
export default function BuildArtifacts() {
  return (
    <div className="grid gap-px bg-[color:var(--hairline)] md:grid-cols-2">
      {systems.map((s) => (
        <Reveal key={s.slug}>
          <figure className="flex h-full flex-col bg-paper-elevated p-6">
            <figcaption className="mb-4 flex items-baseline justify-between gap-3">
              <span className="font-serif text-lg text-ink">{s.title}</span>
              <span className="stamp text-[0.66rem] text-ink-muted">
                {s.architecture.length} components
              </span>
            </figcaption>
            <ul className="flex flex-col gap-2">
              {s.architecture.slice(0, 6).map((c) => (
                <li
                  key={c.component}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-2"
                >
                  <span className="font-mono text-[0.72rem] text-ink">
                    {c.component}
                  </span>
                  <span className="truncate font-mono text-[0.62rem] text-ink-muted">
                    {c.path}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-[color:var(--hairline)] pt-3 font-mono text-[0.62rem] tracking-[0.06em] text-ink-muted uppercase">
              Diagram generated from verified source layout
            </p>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
