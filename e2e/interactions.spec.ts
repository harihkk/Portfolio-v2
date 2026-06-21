import { test, expect } from "@playwright/test";

test("contact form validates and offers a mailto fallback", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText(/your name is required/i)).toBeVisible();
  const mailto = page.locator('a[href^="mailto:"]').first();
  await expect(mailto).toBeVisible();
});

test("Evidence Line is keyboard operable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); // skip the opening overlay
  await page.goto("/");
  const slider = page.getByRole("slider").first();
  await slider.scrollIntoViewIfNeeded();
  await slider.focus();
  const before = await slider.getAttribute("aria-valuenow");
  await slider.press("ArrowRight");
  const after = await slider.getAttribute("aria-valuenow");
  expect(Number(after)).toBe(Number(before) + 1);
  await slider.press("ArrowLeft");
  expect(await slider.getAttribute("aria-valuenow")).toBe(before);
});

test("interactive demos expose a reset control", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/systems/debugbrief");
  const reset = page.getByRole("button", { name: /^reset$/i }).first();
  await reset.scrollIntoViewIfNeeded();
  await expect(reset).toBeVisible();
  await reset.click(); // must not throw
});

test("reduced motion skips the opening sequence and shows content immediately", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Hari Kancharla" }),
  ).toBeVisible();
  await expect(page.getByText("Loading systems")).toHaveCount(0);
});

test("opening sequence runs at most once per session", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  // wait out the capped sequence
  await page.waitForTimeout(2000);
  const seen = await page.evaluate(() =>
    sessionStorage.getItem("tsj-opening-seen"),
  );
  expect(seen).toBe("1");
  await page.reload();
  await page.waitForTimeout(300);
  await expect(page.getByText("Loading systems")).toHaveCount(0);
});

test("mobile menu opens and closes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const menuBtn = page.getByRole("button", { name: /^menu$/i });
  await expect(menuBtn).toBeVisible();
  await menuBtn.click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile" });
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.locator('a[href="/systems"]')).toBeVisible();
  await page
    .locator("#mobile-menu")
    .getByRole("button", { name: /^close$/i })
    .click();
  await expect(mobileNav).toHaveCount(0);
});

test("desktop navigation moves between routes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop-only");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Research" }).click();
  await expect(page).toHaveURL(/\/research$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
