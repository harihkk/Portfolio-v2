#!/usr/bin/env node
/**
 * Copy gate: fails the build when an em dash (or its HTML entities) appears in
 * tracked public content. Use periods, commas, colons, parentheses, or
 * ordinary hyphens instead.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components", "content", "lib", "public", "scripts"];
const EXTS = new Set([
  ".ts",
  ".tsx",
  ".mdx",
  ".md",
  ".css",
  ".mjs",
  ".js",
  ".json",
  ".html",
  ".svg",
  ".txt",
]);
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "test-results",
  "playwright-report",
]);

// Patterns that must never appear in public copy.
export const BANNED = [
  { re: /—/g, label: "em dash (U+2014)" },
  { re: /&mdash;/g, label: "&mdash;" },
  { re: /&#8212;/g, label: "&#8212;" },
  { re: /&#x2014;/gi, label: "&#x2014;" },
];

/** Pure detector used by the gate and its unit test. */
export function scanText(text) {
  const found = [];
  text.split("\n").forEach((line, i) => {
    for (const { re, label } of BANNED) {
      re.lastIndex = 0;
      if (re.test(line))
        found.push({ line: i + 1, label, text: line.trim().slice(0, 80) });
    }
  });
  return found;
}

const isMain =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("check-copy.mjs");

/** @param {string} dir @param {string[]} out */
function walk(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    // The gate file itself necessarily contains the banned patterns as data.
    else if (EXTS.has(extname(name)) && name !== "check-copy.mjs")
      out.push(full);
  }
}

if (isMain) {
  const files = [];
  for (const root of ROOTS) walk(root, files);

  const violations = [];
  for (const file of files) {
    for (const hit of scanText(readFileSync(file, "utf8"))) {
      violations.push(`${file}:${hit.line}  ${hit.label}  ->  ${hit.text}`);
    }
  }

  if (violations.length) {
    console.error(
      `check:copy FAILED. ${violations.length} banned em-dash occurrence(s):\n`,
    );
    for (const v of violations) console.error("  " + v);
    console.error(
      "\nReplace with a period, comma, colon, parentheses, or an ordinary hyphen.",
    );
    process.exit(1);
  }
  console.log(
    `check:copy passed. Scanned ${files.length} files in ${ROOTS.join(", ")}. No em dashes.`,
  );
}
