import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { systemSlugs } from "@/content/systems";
import { research } from "@/content/research";
import { getAllNoteSlugs } from "@/lib/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const lastModified = new Date("2026-06-21");

  const staticRoutes = [
    "",
    "/about",
    "/systems",
    "/experience",
    "/research",
    "/notes",
    "/archive",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const systemRoutes = systemSlugs.map((slug) => ({
    url: `${base}/systems/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const researchRoutes = research.map((p) => ({
    url: `${base}/research/${p.slug}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const noteRoutes = getAllNoteSlugs().map((slug) => ({
    url: `${base}/notes/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...systemRoutes, ...researchRoutes, ...noteRoutes];
}
