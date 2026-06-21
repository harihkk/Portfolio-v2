import type { Metadata } from "next";
import { siteConfig, contact } from "@/lib/site";

const BASE = siteConfig.url;

type PageMetaInput = {
  title: string;
  description?: string;
  path?: string;
  type?: "website" | "article" | "profile";
};

/** Per-route metadata with canonical URL + Open Graph + Twitter cards. */
export function pageMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  type = "website",
}: PageMetaInput): Metadata {
  const url = `${BASE}${path}`;
  const fullTitle =
    path === "/"
      ? `${siteConfig.name}, ${siteConfig.brand}`
      : `${title}, ${siteConfig.brand}`;
  return {
    title,
    description,
    metadataBase: new URL(BASE),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.brand,
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  } as Metadata;
}

/** schema.org Person + WebSite for the root layout. */
export function personJsonLd() {
  const sameAs = [contact.github];
  if (contact.linkedin) sameAs.push(contact.linkedin);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    jobTitle: siteConfig.role,
    email: `mailto:${contact.email}`,
    url: BASE,
    address: {
      "@type": "PostalPlace",
      addressLocality: "Boston",
      addressRegion: "MA",
      addressCountry: "US",
    },
    sameAs,
    knowsAbout: [
      "AI systems evaluation",
      "LLM agents",
      "Retrieval-augmented generation",
      "Model serving",
      "Developer tooling",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brand,
    url: BASE,
    author: { "@type": "Person", name: siteConfig.legalName },
    inLanguage: "en-US",
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateModified: "2026-06-21",
    mainEntity: personJsonLd(),
  };
}

/** schema.org SoftwareSourceCode for a flagship system. */
export function softwareJsonLd(opts: {
  name: string;
  description: string;
  codeRepository: string;
  path: string;
  language?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: opts.name,
    description: opts.description,
    codeRepository: opts.codeRepository,
    url: `${BASE}${opts.path}`,
    programmingLanguage: opts.language ?? "Python",
    author: { "@type": "Person", name: siteConfig.legalName },
    license: "https://opensource.org/licenses/MIT",
  };
}

/** schema.org Article for a real note. */
export function articleJsonLd(opts: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: `${BASE}${opts.path}`,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    author: { "@type": "Person", name: siteConfig.legalName },
    publisher: { "@type": "Organization", name: siteConfig.brand },
  };
}
