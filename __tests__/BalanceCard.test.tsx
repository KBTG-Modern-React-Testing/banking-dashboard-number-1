import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { BalanceCard } from "@/components/BalanceCard";
import { renderWithProviders } from "./helpers/test-utils";
import { mockFetchResponses } from "./helpers/mock-fetch";

describe("BalanceCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays formatted balance after loading", async () => {
    mockFetchResponses({ balance: 15000.5 });
    renderWithProviders(<BalanceCard />);

    expect(
      await screen.findByText("$15,000.50", {}, { timeout: 3000 })
    ).toBeDefined();
  });

  it("displays the ACCOUNT BALANCE eyebrow label", async () => {
    mockFetchResponses({ balance: 15000.5 });
    renderWithProviders(<BalanceCard />);

    const labels = await screen.findAllByText("ACCOUNT BALANCE");
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  it("displays the USD currency label", async () => {
    mockFetchResponses({ balance: 15000.5 });
    renderWithProviders(<BalanceCard />);

    const labels = await screen.findAllByText(
      /USD.*AVAILABLE FUNDS/,
      {},
      { timeout: 3000 }
    );
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  it("formats large balances with commas", async () => {
    mockFetchResponses({ balance: 1234567.89 });
    renderWithProviders(<BalanceCard />);

    expect(
      await screen.findByText("$1,234,567.89", {}, { timeout: 3000 })
    ).toBeDefined();
  });

  it("formats zero balance correctly", async () => {
    mockFetchResponses({ balance: 0 });
    renderWithProviders(<BalanceCard />);

    expect(
      await screen.findByText("$0.00", {}, { timeout: 3000 })
    ).toBeDefined();
  });

  // --- Error state tests ---

  it("shows 'Unable to load balance' when fetch fails", async () => {
    mockFetchResponses({ balanceFail: true });
    renderWithProviders(<BalanceCard />);

    expect(
      await screen.findByText("Unable to load balance", {}, { timeout: 3000 })
    ).toBeDefined();
  });

  it("shows a Retry button when fetch fails", async () => {
    mockFetchResponses({ balanceFail: true });
    renderWithProviders(<BalanceCard />);

    expect(
      await screen.findByText("Retry", {}, { timeout: 3000 })
    ).toBeDefined();
  });

  it("does NOT display '$0.00' when fetch fails", async () => {
    mockFetchResponses({ balanceFail: true });
    renderWithProviders(<BalanceCard />);

    // Wait for error state to render
    await screen.findByText("Unable to load balance", {}, { timeout: 3000 });

    expect(screen.queryByText("$0.00")).toBeNull();
  });
});
