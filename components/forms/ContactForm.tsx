"use client";

import { useState } from "react";
import { contactSchema } from "@/lib/validation";
import { contact } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD =
  "w-full border border-[color:var(--rule)] bg-paper px-3 py-2.5 font-sans text-ink placeholder:text-ink-muted focus-visible:border-signal focus-visible:outline-none";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMsg, setServerMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerMsg("");
    const form = new FormData(e.currentTarget);
    const data = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
      company: String(form.get("company") ?? ""),
    };

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as {
        ok: boolean;
        fallback?: boolean;
        error?: string;
      };
      if (json.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setServerMsg(
          json.error ??
            "Something went wrong. Please email directly using the link below.",
        );
      }
    } catch {
      setStatus("error");
      setServerMsg(
        "Network error. Please email directly using the link below.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="border border-[color:var(--success)] bg-paper-elevated p-6">
        <p className="font-serif text-xl text-ink">Message sent.</p>
        <p className="mt-2 text-ink-soft">
          Thanks, it is on its way. Expect a reply at the address you gave.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {/* honeypot, visually hidden, not display:none so bots still see it */}
      <div aria-hidden className="sr-only">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="kicker mb-2 block">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          maxLength={120}
          required
          className={FIELD}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name ? (
          <p
            id="name-error"
            className="mt-1.5 font-mono text-xs text-signal-dark"
          >
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="kicker mb-2 block">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          maxLength={200}
          required
          className={FIELD}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email ? (
          <p
            id="email-error"
            className="mt-1.5 font-mono text-xs text-signal-dark"
          >
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="kicker mb-2 block">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={4000}
          required
          className={`${FIELD} resize-y`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message ? (
          <p
            id="message-error"
            className="mt-1.5 font-mono text-xs text-signal-dark"
          >
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="border border-ink bg-ink px-5 py-2.5 font-mono text-[0.72rem] tracking-[0.1em] text-paper-elevated uppercase transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
        <a
          href={`mailto:${contact.email}`}
          className="link-annotate font-mono text-[0.72rem] tracking-[0.08em] text-ink-soft uppercase"
        >
          or email directly
        </a>
      </div>

      <p aria-live="polite" className="min-h-[1.25rem]">
        {status === "error" ? (
          <span className="font-mono text-xs text-signal-dark">
            {serverMsg}
          </span>
        ) : null}
      </p>
    </form>
  );
}
