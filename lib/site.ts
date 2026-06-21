/**
 * Single source of truth for site identity, contact channels, and issue
 * metadata. Contact information lives ONLY here (per the content rules).
 *
 * Privacy: the phone number exists on the résumé but is intentionally NOT
 * exposed anywhere in the UI. It is omitted from this file entirely so it
 * cannot leak through a bundle. Use email / GitHub / LinkedIn / résumé.
 */

export const siteConfig = {
  /** Visible masthead name */
  name: "Hari Kancharla",
  /** Full legal name, used in SEO metadata and structured data only */
  legalName: "Hari Krishna Kancharla",
  brand: "The Systems Journal",
  role: "AI Systems Engineer",
  disciplines: ["Evaluation", "Agents", "Retrieval", "Infrastructure"],
  tagline: "Building AI systems that have to prove they work.",
  location: "Boston, Massachusetts",
  locationShort: "Boston, MA",

  /**
   * Canonical site URL. Override with NEXT_PUBLIC_SITE_URL at build time.
   * Falls back to the current GitHub Pages origin so SEO never points at
   * localhost. (Final production domain: pending user decision.)
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://harihkk.github.io",

  description:
    "Hari Krishna Kancharla, AI Systems Engineer in Boston. Four-plus years building production LLM, retrieval, agentic, evaluation, and model-serving systems. Work focused on observable execution and evidence.",

  /** Issue / masthead metadata (editorial conceit; not literal page numbers) */
  issue: {
    volume: "VOL. I",
    label: "CURRENT ISSUE",
    established: "EST. 2026",
  },
} as const;

/**
 * Contact channels. Anything with an empty `href` is treated as
 * "not configured" and is hidden from the UI rather than rendered broken.
 * LinkedIn URL is pending from Hari, see docs/content-conflicts.md.
 */
export const contact = {
  email: "harikrishnak2426@zohomail.com",
  github: "https://github.com/harihkk",
  /** Pending: Hari to supply the exact LinkedIn URL. Hidden until set. */
  linkedin: "",
  /** Public résumé download (served from /public). */
  resume: {
    href: "/Hari_K_Resume_AI_SWE.pdf",
    label: "Download résumé (PDF)",
  },
};

/** Optional Substack, only surfaced when configured. */
export const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL ?? "";

export type ContactChannel = {
  key: string;
  label: string;
  value: string;
  href: string;
};

/** Resolved, non-empty channels for rendering in the footer / contact page. */
export function getContactChannels(): ContactChannel[] {
  const channels: ContactChannel[] = [
    {
      key: "email",
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      key: "github",
      label: "GitHub",
      value: "github.com/harihkk",
      href: contact.github,
    },
  ];
  if (contact.linkedin) {
    channels.push({
      key: "linkedin",
      label: "LinkedIn",
      value: contact.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
      href: contact.linkedin,
    });
  }
  channels.push({
    key: "resume",
    label: "Résumé",
    value: "PDF",
    href: contact.resume.href,
  });
  return channels;
}
