import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

/** Editorial styling for MDX note bodies. */
export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="display-md mt-12 mb-4 font-serif text-ink" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 mb-3 font-serif text-xl text-ink" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4 text-ink-soft" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-4 flex list-disc flex-col gap-2 pl-5 text-ink-soft" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-4 flex list-decimal flex-col gap-2 pl-5 text-ink-soft" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="pl-1 leading-relaxed" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-6 border-l-2 border-signal pl-4 font-serif text-lg text-ink italic"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="border border-[color:var(--hairline)] bg-paper-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-signal-dark"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      tabIndex={0}
      className="my-6 overflow-x-auto border border-[color:var(--hairline)] bg-ink p-4 font-mono text-[0.8rem] leading-relaxed text-paper-elevated focus-visible:outline-2 focus-visible:outline-signal [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-paper-elevated"
      {...props}
    />
  ),
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    if (href.startsWith("/")) {
      return <Link href={href} className="link-annotate text-signal-dark" {...props} />;
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="link-annotate text-signal-dark"
        {...props}
      />
    );
  },
  hr: () => <hr className="rule my-8" />,
};
