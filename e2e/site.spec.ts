import { test, expect, type Page } from "@playwright/test";

const ROUTES = [
  "/",
  "/about",
  "/systems",
  "/systems/code-review-arena",
  "/systems/helm-browser-agent",
  "/systems/debugbrief",
  "/systems/contamcheckr",
  "/experience",
  "/research",
  "/research/swe-bench",
  "/notes",
  "/notes/why-detecting-a-bug-is-not-repairing-it",
  "/archive",
  "/contact",
];

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  // allow a 2px rounding fudge
  expect(overflow).toBeLessThanOrEqual(2);
}

test.describe("routes load and are usable", () => {
  for (const route of ROUTES) {
    test(`loads ${route} with no horizontal overflow`, async ({ page }) => {
      const res = await page.goto(route, { waitUntil: "networkidle" });
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator("h1").first()).toBeVisible();
      await noHorizontalOverflow(page);
    });
  }
});

test("homepage shows the masthead and thesis", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Hari Kancharla" })).toBeVisible();
  // The thesis sits in a scroll-reveal block; scrolling to it both proves the
  // content exists and that the reveal animates it into view.
  const thesis = page.getByRole("heading", {
    name: "Building AI systems that have to prove they work.",
  });
  await thesis.scrollIntoViewIfNeeded();
  await expect(thesis).toBeVisible();
});

test("does not leak the phone number anywhere on the homepage", async ({ page }) => {
  await page.goto("/");
  const body = await page.locator("body").innerText();
  expect(body).not.toContain("508-293-1724");
});

test("404 page renders for unknown routes", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByText(/isn.t in the issue/i)).toBeVisible();
});

test("external links are safe (rel=noopener) and résumé is reachable", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const external = page.locator('a[target="_blank"]');
  const count = await external.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const rel = await external.nth(i).getAttribute("rel");
    expect(rel ?? "").toContain("noopener");
  }
  const resume = await request.get("/Hari_K_Resume_AI_SWE.pdf");
  expect(resume.status()).toBe(200);
});

test("a flagship case study shows repository link and limitations", async ({ page }) => {
  await page.goto("/systems/code-review-arena");
  await expect(page.getByRole("heading", { name: "Code Review Arena" })).toBeVisible();
  await expect(page.getByText("Honest limitations")).toBeVisible();
  const repo = page.locator('a[href="https://github.com/harihkk/code-review-arena"]').first();
  await expect(repo).toBeVisible();
});

test("research paper is labeled external and links to arXiv", async ({ page }) => {
  await page.goto("/research/swe-bench");
  await expect(page.getByText("External paper · not authored by Hari")).toBeVisible();
  const arxiv = page.locator('a[href*="arxiv.org/abs/"]').first();
  await expect(arxiv).toBeVisible();
});

test("notes render MDX content", async ({ page }) => {
  await page.goto("/notes/why-detecting-a-bug-is-not-repairing-it");
  await expect(page.getByText(/detection.*1\.000/i).first()).toBeVisible();
});
