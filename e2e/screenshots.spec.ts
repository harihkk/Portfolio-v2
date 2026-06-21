import { test } from "@playwright/test";

/** Captures full-page screenshots of key routes for visual review. */
const PAGES: [string, string][] = [
  ["home", "/"],
  ["about", "/about"],
  ["systems", "/systems"],
  ["case-study", "/systems/code-review-arena"],
  ["experience", "/experience"],
  ["research", "/research"],
  ["notes", "/notes"],
  ["archive", "/archive"],
  ["contact", "/contact"],
];

for (const [name, path] of PAGES) {
  test(`screenshot ${name}`, async ({ page }, testInfo) => {
    // Reduced motion so scroll-reveal content is fully painted for the capture.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: `docs/screenshots/${testInfo.project.name}-${name}.png`,
      fullPage: true,
    });
  });
}
