import { test, expect } from "@playwright/test";
import { TEST_TRANSFER } from "./fixtures/test-data";

test.describe("Transfer Form - Valid Submission @e2e @critical", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for page to be fully loaded
    await expect(page.locator("#transfer-form")).toBeVisible();
    await expect(page.locator("#balance-card h1")).toHaveText(
      /^\$[\d,]+\.\d{2}$/,
      { timeout: 10_000 }
    );
  });

  test("successfully submits a transfer with all fields", async ({ page }) => {
    await page.locator("#transfer-amount").fill(TEST_TRANSFER.amount);
    await page.locator("#transfer-recipient").fill(TEST_TRANSFER.recipient);
    await page.locator("#transfer-description").fill(TEST_TRANSFER.description);

    await page.locator("#transfer-form button[type='submit']").click();

    // Verify success message
    await expect(page.locator("#transfer-form")).toContainText(
      "Transfer initiated successfully",
      { timeout: 10_000 }
    );

    // Verify form fields are cleared
    await expect(page.locator("#transfer-amount")).toHaveValue("");
    await expect(page.locator("#transfer-recipient")).toHaveValue("");
    await expect(page.locator("#transfer-description")).toHaveValue("");
  });

  test("new transfer appears in transaction list with Pending status", async ({
    page,
  }) => {
    await page.locator("#transfer-amount").fill(TEST_TRANSFER.amount);
    await page.locator("#transfer-recipient").fill(TEST_TRANSFER.recipient);
    await page.locator("#transfer-description").fill(TEST_TRANSFER.description);

    await page.locator("#transfer-form button[type='submit']").click();

    // Wait for success
    await expect(page.locator("#transfer-form")).toContainText(
      "Transfer initiated successfully",
      { timeout: 10_000 }
    );

    // New transaction should appear in the list
    await expect(
      page.locator("#transaction-list").getByText(TEST_TRANSFER.description).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("description field is optional", async ({ page }) => {
    await page.locator("#transfer-amount").fill("50");
    await page.locator("#transfer-recipient").fill("Jane Smith");
    // Leave description empty

    await page.locator("#transfer-form button[type='submit']").click();

    await expect(page.locator("#transfer-form")).toContainText(
      "Transfer initiated successfully",
      { timeout: 10_000 }
    );
  });
});

test.describe("Transfer Form - Validation @e2e", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#transfer-form")).toBeVisible();
  });

  test("shows error when amount is empty", async ({ page }) => {
    await page.locator("#transfer-recipient").fill("John Doe");
    await page.locator("#transfer-form button[type='submit']").click();

    await expect(
      page.locator("#transfer-form").getByRole("alert")
    ).toBeVisible();
  });

  test("shows error when recipient is empty", async ({ page }) => {
    await page.locator("#transfer-amount").fill("100");
    await page.locator("#transfer-form button[type='submit']").click();

    await expect(
      page.locator("#transfer-form").getByText("Recipient is required")
    ).toBeVisible();
  });

  test("shows error for zero amount", async ({ page }) => {
    await page.locator("#transfer-amount").fill("0");
    await page.locator("#transfer-recipient").fill("John Doe");
    await page.locator("#transfer-form button[type='submit']").click();

    await expect(
      page.locator("#transfer-form").getByText("Amount must be greater than zero")
    ).toBeVisible();
  });

  test("shows error for negative amount", async ({ page }) => {
    await page.locator("#transfer-amount").fill("-50");
    await page.locator("#transfer-recipient").fill("John Doe");
    await page.locator("#transfer-form button[type='submit']").click();

    await expect(
      page.locator("#transfer-form").getByText("Amount must be greater than zero")
    ).toBeVisible();
  });

  test("clears field error when user starts typing", async ({ page }) => {
    // Submit empty form to trigger errors
    await page.locator("#transfer-form button[type='submit']").click();

    // Both errors should show
    await expect(
      page.locator("#transfer-form").getByText(/Amount is required/)
    ).toBeVisible();
    await expect(
      page.locator("#transfer-form").getByText("Recipient is required")
    ).toBeVisible();

    // Start typing in amount — amount error should clear
    await page.locator("#transfer-amount").fill("100");
    await expect(
      page.locator("#transfer-form").getByText(/Amount is required/)
    ).not.toBeVisible();
    // Recipient error should still show
    await expect(
      page.locator("#transfer-form").getByText("Recipient is required")
    ).toBeVisible();
  });
});
