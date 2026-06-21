import { z } from "zod";

/* =========================================================================
   Content schemas. Every content module parses itself against these at import
   time, so malformed or unsourced content fails the build instead of shipping.
   ========================================================================= */

/** Where a public claim is allowed to come from. */
export const sourceTypeSchema = z.enum([
  "resume",
  "repo-code",
  "repo-docs",
  "tests-ci",
  "package-metadata",
  "github-release",
  "content-file",
  "arxiv",
  "external",
]);
export type SourceType = z.infer<typeof sourceTypeSchema>;

/** A single traceable claim. Nothing with publicApproved:false is rendered. */
export const provenanceRecordSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  sourceType: sourceTypeSchema,
  sourceLocation: z.string().min(1),
  verifiedAt: z.string().min(4),
  publicApproved: z.boolean(),
  notes: z.string().optional().default(""),
});
export type ProvenanceRecord = z.infer<typeof provenanceRecordSchema>;

export const profileSchema = z.object({
  name: z.string(),
  legalName: z.string(),
  role: z.string(),
  location: z.string(),
  summary: z.string(),
  thesis: z.string(),
  disciplines: z.array(z.string()).min(1),
});
export type Profile = z.infer<typeof profileSchema>;

export const metricSchema = z.object({
  id: z.string().min(1),
  /** numeric portion when animatable (e.g. 306); null for non-numeric */
  value: z.number().nullable(),
  /** what shows when value is non-numeric or needs exact text (e.g. "1M+") */
  display: z.string().min(1),
  prefix: z.string().optional().default(""),
  suffix: z.string().optional().default(""),
  label: z.string().min(1),
  detail: z.string().optional().default(""),
  source: z.string().min(1),
  sourceType: sourceTypeSchema,
  approved: z.boolean(),
  verifiedAt: z.string().min(4),
  animate: z.boolean(),
  provenanceId: z.string().optional(),
});
export type Metric = z.infer<typeof metricSchema>;

export const experienceEntrySchema = z.object({
  id: z.string(),
  org: z.string(),
  role: z.string(),
  location: z.string(),
  start: z.string(),
  end: z.string(),
  current: z.boolean().optional().default(false),
  summary: z.string(),
  categories: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
    }),
  ),
  technologies: z.array(z.string()),
  relatedSystems: z.array(z.string()).optional().default([]),
  provenanceIds: z.array(z.string()).optional().default([]),
});
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;

export const educationEntrySchema = z.object({
  id: z.string(),
  degree: z.string(),
  field: z.string(),
  concentration: z.string().optional().default(""),
  institution: z.string(),
  location: z.string(),
  date: z.string(),
  note: z.string().optional().default(""),
});
export type EducationEntry = z.infer<typeof educationEntrySchema>;

export const systemStatusSchema = z.enum([
  "published",
  "active",
  "alpha",
  "prototype",
  "historical",
  "archived",
]);
export type SystemStatus = z.infer<typeof systemStatusSchema>;

export const systemDomainSchema = z.enum([
  "evaluation",
  "agent-reliability",
  "developer-infrastructure",
  "production-ai",
  "retrieval",
]);
export type SystemDomain = z.infer<typeof systemDomainSchema>;

export const evidenceRecordSchema = z.object({
  type: z.string(),
  detail: z.string(),
  source: z.string(),
  strength: z.enum(["execution", "deterministic", "documented"]).optional(),
});
export type EvidenceRecord = z.infer<typeof evidenceRecordSchema>;

export const systemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  index: z.string(),
  status: systemStatusSchema,
  domains: z.array(systemDomainSchema).min(1),
  oneLiner: z.string(),
  problem: z.string(),
  failureMode: z.string(),
  thesis: z.string(),
  howItWorks: z.string(),
  flow: z.array(z.string()).min(2),
  architecture: z.array(
    z.object({ component: z.string(), path: z.string(), role: z.string() }),
  ),
  keyComponents: z
    .array(z.object({ name: z.string(), path: z.string(), what: z.string() }))
    .optional()
    .default([]),
  evidence: z.array(evidenceRecordSchema),
  limitations: z.array(z.string()).min(1),
  technologies: z.array(z.string()),
  install: z.array(z.string()).optional().default([]),
  repo: z.string(),
  demo: z.string().optional().default(""),
  docs: z.string().optional().default(""),
  published: z.string().optional().default(""),
  lastVerifiedCommit: z.string(),
  lastVerifiedDate: z.string(),
  relatedPaperIds: z.array(z.string()).optional().default([]),
  relatedNoteSlugs: z.array(z.string()).optional().default([]),
  provenanceIds: z.array(z.string()).optional().default([]),
});
export type System = z.infer<typeof systemSchema>;

export const researchPaperSchema = z.object({
  slug: z.string(),
  title: z.string(),
  authors: z.array(z.string()).min(1),
  arxivId: z.string(),
  submittedDate: z.string(),
  latestRevision: z.string().optional().default(""),
  arxivUrl: z.string(),
  primaryCategory: z.string(),
  abstract: z.string(),
  recordType: z.enum(["READING", "NOTE", "PREPRINT"]),
  authoredByHari: z.boolean(),
  connectedSystem: z.string(),
  connectedTopic: z.string(),
  relationship: z.string(),
  verifiedAt: z.string(),
});
export type ResearchPaper = z.infer<typeof researchPaperSchema>;

export const noteKindSchema = z.enum([
  "Engineering Note",
  "System Brief",
  "Release Note",
  "Research Note",
]);
export type NoteKind = z.infer<typeof noteKindSchema>;

export const noteFrontmatterSchema = z.object({
  title: z.string(),
  kind: noteKindSchema,
  summary: z.string(),
  date: z.string(),
  updated: z.string().optional().default(""),
  relatedSystem: z.string().optional().default(""),
  relatedPaper: z.string().optional().default(""),
  authoredByHari: z.boolean(),
  draft: z.boolean().optional().default(false),
});
export type NoteFrontmatter = z.infer<typeof noteFrontmatterSchema>;

export const archiveEventSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  category: z.enum(["systems", "work", "research", "notes", "releases"]),
  detail: z.string(),
  href: z.string().optional().default(""),
  external: z.boolean().optional().default(false),
  source: z.string(),
});
export type ArchiveEvent = z.infer<typeof archiveEventSchema>;

/** Contact form input (shared by the client form and the server route). */
export const contactSchema = z.object({
  name: z.string().min(1, "Your name is required").max(120),
  email: z
    .string()
    .min(3, "Email is required")
    .max(200)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"),
  message: z
    .string()
    .min(10, "A little more detail helps")
    .max(4000, "That is a bit long, please trim it"),
  /** Honeypot: must stay empty. Bots fill it. */
  company: z.string().max(0).optional().default(""),
});
export type ContactInput = z.infer<typeof contactSchema>;

/** Parse helper that throws a clear, build-failing error on bad content. */
export function validateContent<T>(
  schema: z.ZodType<T>,
  data: unknown,
  label: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `[content:${label}] failed validation:\n${JSON.stringify(
        result.error.flatten(),
        null,
        2,
      )}`,
    );
  }
  return result.data;
}
