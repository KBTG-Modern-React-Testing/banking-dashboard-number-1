import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "../mocks/server";
import { createSettlementHandlers } from "../mocks/handlers";
import { TransferForm } from "@/components/TransferForm";
import { renderWithProviders } from "./helpers/test-utils";

/**
 * Tests for the settlement flow:
 * Transfer → Pending → Completed (after delay) → Balance deducted
 *
 * Uses createSettlementHandlers() which simulates the server-side
 * store behavior with a configurable settlement delay (100ms in tests).
 */
describe("Transaction Settlement & Balance Deduction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("balance decreases after a transfer settles from Pending to Completed", async () => {
    const { handlers, getBalance } = createSettlementHandlers(100);
    server.use(...handlers);

    // Verify initial balance
    expect(getBalance()).toBe(15000.5);

    // Render TransferForm and submit a transfer
    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

    await user.type(screen.getByLabelText(/AMOUNT/i), "500");
    await user.type(screen.getByLabelText(/RECIPIENT/i), "Test User");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    // Wait for success
    await waitFor(() => {
      const msgs = screen.getAllByText(/transfer initiated successfully/i);
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });

    // Balance should not yet be deducted (still Pending)
    expect(getBalance()).toBe(15000.5);

    // Wait for settlement (100ms delay + buffer)
    await vi.waitFor(
      () => {
        expect(getBalance()).toBe(14500.5);
      },
      { timeout: 1000 }
    );
  });

  it("transaction status changes from Pending to Completed after settlement", async () => {
    const { handlers, getTransactions } = createSettlementHandlers(100);
    server.use(...handlers);

    // Submit transfer
    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

    await user.type(screen.getByLabelText(/AMOUNT/i), "200");
    await user.type(screen.getByLabelText(/RECIPIENT/i), "Jane Doe");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    await waitFor(() => {
      const msgs = screen.getAllByText(/transfer initiated successfully/i);
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });

    // Transaction should initially be Pending
    const txnsBefore = getTransactions();
    expect(txnsBefore.length).toBe(1);
    expect(txnsBefore[0].status).toBe("Pending");

    // Wait for settlement
    await vi.waitFor(
      () => {
        const txnsAfter = getTransactions();
        expect(txnsAfter[0].status).toBe("Completed");
      },
      { timeout: 1000 }
    );
  });

  it("multiple transfers deduct balance cumulatively", async () => {
    const { handlers, getBalance } = createSettlementHandlers(100);
    server.use(...handlers);

    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

    // First transfer: $300
    await user.type(screen.getByLabelText(/AMOUNT/i), "300");
    await user.type(screen.getByLabelText(/RECIPIENT/i), "Alice");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    await waitFor(() => {
      const msgs = screen.getAllByText(/transfer initiated successfully/i);
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });

    // Wait for form to clear, then submit second transfer: $200
    await waitFor(() => {
      expect(
        (screen.getByLabelText(/AMOUNT/i) as HTMLInputElement).value
      ).toBe("");
    });

    await user.type(screen.getByLabelText(/AMOUNT/i), "200");
    await user.type(screen.getByLabelText(/RECIPIENT/i), "Bob");

    const btns2 = screen.getAllByText("Transfer");
    await user.click(btns2[0]);

    await waitFor(() => {
      const msgs = screen.getAllByText(/transfer initiated successfully/i);
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });

    // Wait for both to settle: 15000.5 - 300 - 200 = 14500.5
    await vi.waitFor(
      () => {
        expect(getBalance()).toBe(14500.5);
      },
      { timeout: 2000 }
    );
  });

  it("balance does not go below zero", async () => {
    const { handlers, getBalance } = createSettlementHandlers(50);
    server.use(...handlers);

    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

    // Transfer more than the balance
    await user.type(screen.getByLabelText(/AMOUNT/i), "99999");
    await user.type(screen.getByLabelText(/RECIPIENT/i), "Big Spender");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    await waitFor(() => {
      const msgs = screen.getAllByText(/transfer initiated successfully/i);
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });

    // Wait for settlement — balance should be clamped at 0
    await vi.waitFor(
      () => {
        expect(getBalance()).toBe(0);
      },
      { timeout: 1000 }
    );
  });
});
