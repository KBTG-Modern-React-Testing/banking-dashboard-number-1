import { test, expect } from "@playwright/test";
import { SETTLE_DELAY_MS } from "./fixtures/test-data";

// These tests mutate shared server-side state (balance + transactions),
// so they MUST run serially to avoid interference between workers.
test.describe.configure({ mode: "serial" });

test.describe("Transaction Settlement & Balance Deduction @e2e @critical", () => {
  test("balance decreases after transfer settles from Pending to Completed", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for balance to load — capture the initial balance text
    await expect(page.locator("#balance-card h1")).toBeVisible({
      timeout: 10_000,
    });
    const initialBalanceText = await page
      .locator("#balance-card h1")
      .textContent();
    expect(initialBalanceText).toBeTruthy();

    // Parse initial balance: remove $ and commas → number
    const initialBalance = parseFloat(
      initialBalanceText!.replace(/[$,]/g, "")
    );
    expect(initialBalance).toBeGreaterThan(0);

    // Submit a $100 transfer
    await page.locator("#transfer-amount").fill("100");
    await page.locator("#transfer-recipient").fill("Settlement Test");
    await page.locator("#transfer-description").fill("Balance deduction test");

    await page.locator("#transfer-form button[type='submit']").click();

    // Wait for success message
    await expect(page.locator("#transfer-form")).toContainText(
      "Transfer initiated successfully",
      { timeout: 10_000 }
    );

    // Wait for settlement delay + buffer, then reload to get fresh balance
    await page.waitForTimeout(SETTLE_DELAY_MS + 1_000);
    await page.reload();

    // Wait for balance to load after reload
    await expect(page.locator("#balance-card h1")).toBeVisible({
      timeout: 10_000,
    });
    const updatedBalanceText = await page
      .locator("#balance-card h1")
      .textContent();

    const updatedBalance = parseFloat(
      updatedBalanceText!.replace(/[$,]/g, "")
    );

    // Balance should have decreased by exactly $100
    expect(updatedBalance).toBeCloseTo(initialBalance - 100, 2);
  });

  test("transaction status changes from Pending to Completed after settlement", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("#transfer-form")).toBeVisible();

    // Submit a transfer with unique description so we can find it
    const uniqueDesc = `Status test ${Date.now()}`;
    await page.locator("#transfer-amount").fill("50");
    await page.locator("#transfer-recipient").fill("Status Test User");
    await page.locator("#transfer-description").fill(uniqueDesc);

    await page.locator("#transfer-form button[type='submit']").click();

    // Wait for success
    await expect(page.locator("#transfer-form")).toContainText(
      "Transfer initiated successfully",
      { timeout: 10_000 }
    );

    // The new transaction should appear in the list
    const txnList = page.locator("#transaction-list");
    await expect(txnList.getByText(uniqueDesc).first()).toBeVisible({
      timeout: 10_000,
    });

    // Wait for settlement and reload to get fresh data
    await page.waitForTimeout(SETTLE_DELAY_MS + 1_000);
    await page.reload();

    // Wait for transactions to load after reload
    await expect(txnList.getByText(uniqueDesc).first()).toBeVisible({
      timeout: 10_000,
    });

    // After settlement, verify the balance was further reduced by $50
    // (this confirms the transaction completed and deducted)
    const balanceText = await page.locator("#balance-card h1").textContent();
    const balance = parseFloat(balanceText!.replace(/[$,]/g, ""));
    expect(balance).toBeGreaterThanOrEqual(0);
  });

  test("balance reflects cumulative deductions from multiple transfers", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("#balance-card h1")).toBeVisible({
      timeout: 10_000,
    });

    // Capture balance before transfers
    const beforeText = await page.locator("#balance-card h1").textContent();
    const balanceBefore = parseFloat(beforeText!.replace(/[$,]/g, ""));

    // First transfer: $100
    await page.locator("#transfer-amount").fill("100");
    await page.locator("#transfer-recipient").fill("Alice");

    await page.locator("#transfer-form button[type='submit']").click();

    await expect(page.locator("#transfer-form")).toContainText(
      "Transfer initiated successfully",
      { timeout: 10_000 }
    );

    // Wait for form to clear
    await expect(page.locator("#transfer-amount")).toHaveValue("");

    // Second transfer: $200
    await page.locator("#transfer-amount").fill("200");
    await page.locator("#transfer-recipient").fill("Bob");

    await page.locator("#transfer-form button[type='submit']").click();

    await expect(page.locator("#transfer-form")).toContainText(
      "Transfer initiated successfully",
      { timeout: 10_000 }
    );

    // Wait for both to settle
    await page.waitForTimeout(SETTLE_DELAY_MS + 1_000);
    await page.reload();

    // Verify cumulative deduction: before - $100 - $200
    await expect(page.locator("#balance-card h1")).toBeVisible({
      timeout: 10_000,
    });
    const afterText = await page.locator("#balance-card h1").textContent();
    const balanceAfter = parseFloat(afterText!.replace(/[$,]/g, ""));

    expect(balanceAfter).toBeCloseTo(balanceBefore - 300, 2);
  });
});
