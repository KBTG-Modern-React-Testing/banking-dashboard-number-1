import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BalanceCard } from "@/components/BalanceCard";
import { DashboardProvider } from "@/components/DashboardContext";

// Helper to mock fetch responses
function mockFetchResponses(balance: number) {
  (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
    (url: string) => {
      if (url.includes("/api/balance")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ balance, currency: "USD" }),
        });
      }
      if (url.includes("/api/transactions")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ transactions: [] }),
        });
      }
      return Promise.resolve({ ok: false });
    }
  );
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<DashboardProvider>{ui}</DashboardProvider>);
}

describe("BalanceCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays formatted balance after loading", async () => {
    mockFetchResponses(15000.5);
    renderWithProvider(<BalanceCard />);

    expect(
      await screen.findByText("$15,000.50", {}, { timeout: 3000 })
    ).toBeDefined();
  });

  it("displays the ACCOUNT BALANCE eyebrow label", async () => {
    mockFetchResponses(15000.5);
    renderWithProvider(<BalanceCard />);

    const labels = await screen.findAllByText("ACCOUNT BALANCE");
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  it("displays the USD currency label", async () => {
    mockFetchResponses(15000.5);
    renderWithProvider(<BalanceCard />);

    const labels = await screen.findAllByText(
      /USD.*AVAILABLE FUNDS/,
      {},
      { timeout: 3000 }
    );
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  it("formats large balances with commas", async () => {
    mockFetchResponses(1234567.89);
    renderWithProvider(<BalanceCard />);

    expect(
      await screen.findByText("$1,234,567.89", {}, { timeout: 3000 })
    ).toBeDefined();
  });

  it("formats zero balance correctly", async () => {
    mockFetchResponses(0);
    renderWithProvider(<BalanceCard />);

    expect(
      await screen.findByText("$0.00", {}, { timeout: 3000 })
    ).toBeDefined();
  });
});
