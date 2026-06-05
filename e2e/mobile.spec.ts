import { test, expect } from "@playwright/test";

test.describe("Mobile Layout @e2e", () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone viewport

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#nav-bar")).toBeVisible();
  });

  test("dashboard stacks vertically on mobile", async ({ page }) => {
    // Both columns should be visible (stacked, not side-by-side)
    await expect(page.locator("#balance-card")).toBeVisible();
    await expect(page.locator("#transfer-form")).toBeVisible();
    await expect(page.locator("#transaction-list")).toBeVisible();
  });

  test("hamburger menu is visible on mobile", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Toggle menu" })
    ).toBeVisible();
  });

  test("desktop nav is hidden on mobile", async ({ page }) => {
    // The desktop nav container with the theme toggle should be hidden
    await expect(page.locator(".desktop-nav")).not.toBeVisible();
  });

  test("hamburger menu opens and shows theme toggle", async ({ page }) => {
    // Click hamburger
    await page.getByRole("button", { name: "Toggle menu" }).click();

    // Mobile menu should appear with theme toggle
    await expect(
      page.locator(".mobile-menu-dropdown")
    ).toBeVisible();
    await expect(
      page
        .locator(".mobile-menu-dropdown")
        .getByRole("button", { name: /switch to (light|dark) mode/i })
    ).toBeVisible();
  });

  test("transfer form is fully accessible on mobile", async ({ page }) => {
    await expect(page.locator("#transfer-amount")).toBeVisible();
    await expect(page.locator("#transfer-recipient")).toBeVisible();
    await expect(page.locator("#transfer-description")).toBeVisible();
    await expect(
      page.locator("#transfer-form button[type='submit']")
    ).toBeVisible();
  });

  test("no horizontal scrolling on mobile", async ({ page }) => {
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });
});
