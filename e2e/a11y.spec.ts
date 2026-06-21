import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/about",
  "/systems",
  "/systems/code-review-arena",
  "/experience",
  "/research",
  "/research/swe-bench",
  "/notes",
  "/notes/why-detecting-a-bug-is-not-repairing-it",
  "/archive",
  "/contact",
];

test.describe("accessibility (axe, WCAG 2 A/AA)", () => {
  for (const route of ROUTES) {
    test(`no serious/critical violations on ${route}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      if (serious.length) {
        console.log(
          `A11Y ${route} ` +
            JSON.stringify(
              serious.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length })),
            ),
        );
      }
      expect(serious).toEqual([]);
    });
  }
});
