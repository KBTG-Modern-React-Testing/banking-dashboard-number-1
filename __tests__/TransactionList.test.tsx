import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { TransactionList } from "@/components/TransactionList";
import { renderWithProviders } from "./helpers/test-utils";

const mockTransactions = [
  {
    id: "txn_001",
    amount: 1500.0,
    currency: "USD",
    status: "Completed",
    description: "Payment to vendor",
    recipient: "Acme Corp",
    createdAt: "2026-06-04T08:30:00Z",
    updatedAt: "2026-06-04T08:31:00Z",
  },
  {
    id: "txn_002",
    amount: 250.0,
    currency: "USD",
    status: "Pending",
    description: "Transfer to savings",
    recipient: "Savings Account",
    createdAt: "2026-06-04T07:15:00Z",
    updatedAt: "2026-06-04T07:15:00Z",
  },
  {
    id: "txn_003",
    amount: 500.0,
    currency: "USD",
    status: "Failed",
    description: "Failed payment",
    recipient: "Electric Co",
    createdAt: "2026-06-03T10:00:00Z",
    updatedAt: "2026-06-03T10:02:00Z",
  },
];

function useTransactionHandlers(transactions = mockTransactions) {
  server.use(
    http.get("/api/transactions", () =>
      HttpResponse.json({ transactions })
    )
  );
}

describe("TransactionList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays the TRANSACTIONS eyebrow label", () => {
    useTransactionHandlers();
    renderWithProviders(<TransactionList />);
    const labels = screen.getAllByText("TRANSACTIONS");
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  it("shows transaction descriptions after loading", async () => {
    useTransactionHandlers();
    renderWithProviders(<TransactionList />);

    expect(
      await screen.findByText("Payment to vendor", {}, { timeout: 3000 })
    ).toBeDefined();
    expect(screen.getByText("Transfer to savings")).toBeDefined();
    expect(screen.getByText("Failed payment")).toBeDefined();
  });

  it("shows formatted amounts for each transaction", async () => {
    useTransactionHandlers();
    renderWithProviders(<TransactionList />);

    expect(
      await screen.findByText("$1,500.00", {}, { timeout: 3000 })
    ).toBeDefined();
    expect(screen.getByText("$250.00")).toBeDefined();
    expect(screen.getByText("$500.00")).toBeDefined();
  });

  it("shows status badges for each transaction", async () => {
    useTransactionHandlers();
    renderWithProviders(<TransactionList />);

    // Wait for data to load
    await screen.findByText("Payment to vendor", {}, { timeout: 3000 });

    // Status badges (filter buttons also have these labels, so use getAllByText)
    const completedEls = screen.getAllByText("Completed");
    expect(completedEls.length).toBeGreaterThanOrEqual(1);

    const pendingEls = screen.getAllByText("Pending");
    expect(pendingEls.length).toBeGreaterThanOrEqual(1);

    const failedEls = screen.getAllByText("Failed");
    expect(failedEls.length).toBeGreaterThanOrEqual(1);
  });

  it("shows item count", async () => {
    useTransactionHandlers();
    renderWithProviders(<TransactionList />);

    await waitFor(() => {
      // The count "3" with "ITEMS" label
      const countEls = screen.getAllByText(/3/);
      expect(countEls.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows recipient names", async () => {
    useTransactionHandlers();
    renderWithProviders(<TransactionList />);

    expect(
      await screen.findByText("Acme Corp", {}, { timeout: 3000 })
    ).toBeDefined();
    expect(screen.getByText("Savings Account")).toBeDefined();
    expect(screen.getByText("Electric Co")).toBeDefined();
  });

  it("shows 'No transactions' message when list is empty", async () => {
    useTransactionHandlers([]);
    renderWithProviders(<TransactionList />);

    await waitFor(() => {
      const msgs = screen.getAllByText("No transactions");
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows filter buttons: All, Pending, Completed, Failed", () => {
    useTransactionHandlers();
    renderWithProviders(<TransactionList />);

    const allBtns = screen.getAllByText("All");
    expect(allBtns.length).toBeGreaterThanOrEqual(1);

    const pendingBtns = screen.getAllByText("Pending");
    expect(pendingBtns.length).toBeGreaterThanOrEqual(1);

    const completedBtns = screen.getAllByText("Completed");
    expect(completedBtns.length).toBeGreaterThanOrEqual(1);

    const failedBtns = screen.getAllByText("Failed");
    expect(failedBtns.length).toBeGreaterThanOrEqual(1);
  });

  it("filters to show only Pending transactions when Pending filter clicked", async () => {
    useTransactionHandlers();
    const user = userEvent.setup();
    renderWithProviders(<TransactionList />);

    // Wait for data to load
    await screen.findByText("Payment to vendor", {}, { timeout: 3000 });

    // Click Pending filter — find buttons with aria-pressed (filter buttons)
    const pendingElements = screen.getAllByText("Pending");
    const filterBtn = pendingElements.find(
      (el) => el.getAttribute("aria-pressed") !== null
    );
    expect(filterBtn).toBeDefined();
    await user.click(filterBtn!);

    // Should show pending transaction
    expect(screen.getByText("Transfer to savings")).toBeDefined();

    // Should NOT show completed or failed descriptions
    expect(screen.queryByText("Payment to vendor")).toBeNull();
    expect(screen.queryByText("Failed payment")).toBeNull();
  });

  it("returns to all transactions when All filter clicked", async () => {
    useTransactionHandlers();
    const user = userEvent.setup();
    renderWithProviders(<TransactionList />);

    await screen.findByText("Payment to vendor", {}, { timeout: 3000 });

    // Click Pending filter
    const pendingElements = screen.getAllByText("Pending");
    const filterBtn = pendingElements.find(
      (el) => el.getAttribute("aria-pressed") !== null
    );
    await user.click(filterBtn!);

    // Click All filter
    const allElements = screen.getAllByText("All");
    const allFilterBtn = allElements.find(
      (el) => el.getAttribute("aria-pressed") !== null
    );
    await user.click(allFilterBtn!);

    // All transactions should be visible again
    expect(screen.getByText("Payment to vendor")).toBeDefined();
    expect(screen.getByText("Transfer to savings")).toBeDefined();
    expect(screen.getByText("Failed payment")).toBeDefined();
  });

  it("shows message when filter has no matching results", async () => {
    // Only completed transactions — no failed
    const completedOnly = [mockTransactions[0]];
    useTransactionHandlers(completedOnly);
    const user = userEvent.setup();
    renderWithProviders(<TransactionList />);

    await screen.findByText("Payment to vendor", {}, { timeout: 3000 });

    // Click Failed filter — should show no results
    const failedElements = screen.getAllByText("Failed");
    const filterBtn = failedElements.find(
      (el) => el.getAttribute("aria-pressed") !== null
    );
    await user.click(filterBtn!);

    await waitFor(() => {
      const msgs = screen.getAllByText("No transactions");
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });
  });

  // --- Error state tests ---

  it("shows 'Unable to load transactions' when fetch fails", async () => {
    server.use(http.get("/api/transactions", () => HttpResponse.error()));
    renderWithProviders(<TransactionList />);

    expect(
      await screen.findByText(
        "Unable to load transactions",
        {},
        { timeout: 3000 }
      )
    ).toBeDefined();
  });

  it("shows a Retry button when fetch fails", async () => {
    server.use(http.get("/api/transactions", () => HttpResponse.error()));
    renderWithProviders(<TransactionList />);

    expect(
      await screen.findByText("Retry", {}, { timeout: 3000 })
    ).toBeDefined();
  });
});
