import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getContactChannels } from "@/lib/site";
import PageHeader from "@/components/layout/PageHeader";
import ContactForm from "@/components/forms/ContactForm";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Open channel, reach Hari Kancharla about evaluation infrastructure, reliable agents, developer tools, retrieval systems, or production AI.",
  path: "/contact",
});

export default function ContactPage() {
  const channels = getContactChannels();
  return (
    <>
      <PageHeader
        kicker="Contact"
        title="Let's talk about systems that have to prove they work."
        intro="Evaluation infrastructure, reliable agents, developer tools, retrieval systems, or production AI: if that is the work, I would like to hear about it."
        meta="Vol. I · Contact"
      />

      <section className="shell py-12">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal>
            <div>
              <p className="kicker mb-4">Direct channels</p>
              <ul className="border-t border-[color:var(--hairline)]">
                {channels.map((c) => (
                  <li
                    key={c.key}
                    className="flex items-baseline justify-between gap-4 border-b border-[color:var(--hairline)] py-3"
                  >
                    <span className="font-mono text-[0.7rem] tracking-[0.1em] text-ink-muted uppercase">
                      {c.label}
                    </span>
                    <a
                      href={c.href}
                      className="link-annotate text-ink"
                      {...(c.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {c.value}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-mono text-[0.7rem] leading-relaxed text-ink-muted">
                Based in Boston, Massachusetts. The form sends only if a mail
                provider is configured; otherwise it points you to the email
                link, it never claims a delivery it cannot confirm.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
