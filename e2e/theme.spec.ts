import { test, expect } from "@playwright/test";

test.describe("Theme Toggle @e2e", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("banking-theme"));
    await page.reload();
    await expect(page.locator("#nav-bar")).toBeVisible();
  });

  test("defaults to dark theme", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("switches to light theme on click", async ({ page }) => {
    await page
      .getByRole("button", { name: /switch to light mode/i })
      .click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("switches back to dark theme", async ({ page }) => {
    // Switch to light
    await page
      .getByRole("button", { name: /switch to light mode/i })
      .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    // Switch back to dark
    await page
      .getByRole("button", { name: /switch to dark mode/i })
      .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("persists theme preference across page reload", async ({ page }) => {
    // Switch to light
    await page
      .getByRole("button", { name: /switch to light mode/i })
      .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    // Reload
    await page.reload();

    // Should still be light
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("theme toggle is keyboard accessible", async ({ page }) => {
    const toggle = page.getByRole("button", {
      name: /switch to light mode/i,
    });
    await toggle.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});
