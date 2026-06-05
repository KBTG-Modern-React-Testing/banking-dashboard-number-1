import { test, expect } from "@playwright/test";
import { EXPECTED_BALANCE } from "./fixtures/test-data";

test.describe("Homepage Smoke Tests @smoke @critical", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("dashboard loads with all main sections visible", async ({ page }) => {
    await expect(page.locator("#balance-card")).toBeVisible();
    await expect(page.locator("#transaction-list")).toBeVisible();
    await expect(page.locator("#transfer-form")).toBeVisible();
    await expect(page.locator("#nav-bar")).toBeVisible();
  });

  test("account balance displays a valid dollar amount", async ({ page }) => {
    await expect(page.locator("#balance-card")).toContainText(
      EXPECTED_BALANCE,
      { timeout: 10_000 }
    );
  });

  test("transaction list shows recent activity", async ({ page }) => {
    // Wait for transactions to load
    await expect(
      page.locator("#transaction-list").getByText("Payment to vendor")
    ).toBeVisible({ timeout: 10_000 });
  });

  test("transfer form is ready for input", async ({ page }) => {
    await expect(page.locator("#transfer-amount")).toBeVisible();
    await expect(page.locator("#transfer-recipient")).toBeVisible();
    await expect(
      page.locator("#transfer-form button[type='submit']")
    ).toBeEnabled();
  });

  test("theme toggle button is accessible", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /switch to (light|dark) mode/i })
    ).toBeVisible();
  });

  test("navigation bar is visible with brand text", async ({ page }) => {
    await expect(page.locator("#nav-bar")).toContainText("BANKING");
    await expect(page.locator("#nav-bar")).toContainText("DASHBOARD");
  });
});
