import { test, expect } from "@playwright/test";
import { EXPECTED_TRANSACTIONS } from "./fixtures/test-data";

test.describe("Account Balance @e2e", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for balance to load (any valid dollar amount)
    await expect(page.locator("#balance-card h1")).toHaveText(
      /^\$[\d,]+\.\d{2}$/,
      { timeout: 10_000 }
    );
  });

  test("displays formatted balance with dollar sign and commas", async ({
    page,
  }) => {
    await expect(page.locator("#balance-card h1")).toHaveText(/^\$[\d,]+\.\d{2}$/);
  });

  test("shows ACCOUNT BALANCE label", async ({ page }) => {
    await expect(page.locator("#balance-card")).toContainText("ACCOUNT BALANCE");
  });

  test("shows USD currency label", async ({ page }) => {
    await expect(page.locator("#balance-card")).toContainText(/USD.*AVAILABLE FUNDS/);
  });
});

test.describe("Transaction List @e2e", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for transactions to load
    await expect(
      page.locator("#transaction-list").getByText("Payment to vendor")
    ).toBeVisible({ timeout: 10_000 });
  });

  test("displays all transactions on initial load", async ({ page }) => {
    const list = page.locator("#transaction-list");
    await expect(list.getByText("Payment to vendor")).toBeVisible();
    await expect(list.getByText("Transfer to savings")).toBeVisible();
    await expect(list.getByText("Failed payment")).toBeVisible();
  });

  test("shows transaction amounts formatted as currency", async ({ page }) => {
    const list = page.locator("#transaction-list");
    await expect(
      list.getByText(EXPECTED_TRANSACTIONS.first.amount)
    ).toBeVisible();
    await expect(
      list.getByText(EXPECTED_TRANSACTIONS.pending.amount)
    ).toBeVisible();
    await expect(
      list.getByText(EXPECTED_TRANSACTIONS.failed.amount)
    ).toBeVisible();
  });

  test("shows status badges for each transaction", async ({ page }) => {
    const list = page.locator("#transaction-list");
    await expect(list.getByText("Completed").first()).toBeVisible();
    await expect(list.getByText("Pending").first()).toBeVisible();
    await expect(list.getByText("Failed").first()).toBeVisible();
  });

  test("shows item count", async ({ page }) => {
    await expect(page.locator("#transaction-list")).toContainText(/\d+ ITEMS/);
  });

  test("shows recipient names", async ({ page }) => {
    const list = page.locator("#transaction-list");
    await expect(list.getByText("Acme Corp")).toBeVisible();
    await expect(list.getByText("Savings Account")).toBeVisible();
    await expect(list.getByText("Electric Co")).toBeVisible();
  });
});

test.describe("Transaction Filtering @e2e", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator("#transaction-list").getByText("Payment to vendor")
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows filter buttons: All, Pending, Completed, Failed", async ({
    page,
  }) => {
    const filters = page.locator("#transaction-filters");
    await expect(filters.getByRole("button", { name: "All" })).toBeVisible();
    await expect(
      filters.getByRole("button", { name: "Pending" })
    ).toBeVisible();
    await expect(
      filters.getByRole("button", { name: "Completed" })
    ).toBeVisible();
    await expect(
      filters.getByRole("button", { name: "Failed" })
    ).toBeVisible();
  });

  test("filters to Pending only", async ({ page }) => {
    await page
      .locator("#transaction-filters")
      .getByRole("button", { name: "Pending" })
      .click();

    const list = page.locator("#transaction-list");
    await expect(list.getByText("Transfer to savings")).toBeVisible();
    // Completed transactions should be hidden
    await expect(list.getByText("Payment to vendor")).not.toBeVisible();
  });

  test("filters to Completed only", async ({ page }) => {
    await page
      .locator("#transaction-filters")
      .getByRole("button", { name: "Completed" })
      .click();

    const list = page.locator("#transaction-list");
    await expect(list.getByText("Payment to vendor")).toBeVisible();
    await expect(list.getByText("Failed payment")).not.toBeVisible();
  });

  test("filters to Failed only", async ({ page }) => {
    await page
      .locator("#transaction-filters")
      .getByRole("button", { name: "Failed" })
      .click();

    const list = page.locator("#transaction-list");
    await expect(list.getByText("Failed payment")).toBeVisible();
    await expect(list.getByText("Payment to vendor")).not.toBeVisible();
  });

  test("returns to all transactions when All clicked", async ({ page }) => {
    // First filter to Pending
    await page
      .locator("#transaction-filters")
      .getByRole("button", { name: "Pending" })
      .click();
    // Then back to All
    await page
      .locator("#transaction-filters")
      .getByRole("button", { name: "All" })
      .click();

    const list = page.locator("#transaction-list");
    await expect(list.getByText("Payment to vendor")).toBeVisible();
    await expect(list.getByText("Transfer to savings")).toBeVisible();
    await expect(list.getByText("Failed payment")).toBeVisible();
  });
});
