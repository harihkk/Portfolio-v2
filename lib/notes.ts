import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import {
  noteFrontmatterSchema,
  validateContent,
  type NoteFrontmatter,
} from "@/lib/validation";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export type Note = {
  slug: string;
  frontmatter: NoteFrontmatter;
  content: string;
  readingMinutes: number;
};

function readNoteFile(slug: string): Note | null {
  const filePath = path.join(NOTES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  // YAML auto-parses unquoted dates into Date objects; coerce back to strings.
  const normalized: Record<string, unknown> = { ...data };
  for (const key of ["date", "updated"]) {
    if (normalized[key] instanceof Date) {
      normalized[key] = (normalized[key] as Date).toISOString().slice(0, 10);
    }
  }
  const frontmatter = validateContent(
    noteFrontmatterSchema,
    normalized,
    `note:${slug}`,
  );
  const minutes = Math.max(1, Math.round(readingTime(content).minutes));
  return { slug, frontmatter, content, readingMinutes: minutes };
}

export function getAllNoteSlugs(): string[] {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getNote(slug: string): Note | null {
  return readNoteFile(slug);
}

export function getAllNotes(): Note[] {
  const isProd = process.env.NODE_ENV === "production";
  return getAllNoteSlugs()
    .map(readNoteFile)
    .filter((n): n is Note => n !== null)
    .filter((n) => !(isProd && n.frontmatter.draft))
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function getNotesForSystem(systemSlug: string): Note[] {
  return getAllNotes().filter(
    (n) => n.frontmatter.relatedSystem === systemSlug,
  );
}
