import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransferForm } from "@/components/TransferForm";
import { DashboardProvider } from "@/components/DashboardContext";

function mockFetchResponses() {
  (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
    (url: string, options?: RequestInit) => {
      if (url.includes("/api/balance")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ balance: 15000.5, currency: "USD" }),
        });
      }
      if (url.includes("/api/transactions") && options?.method === "POST") {
        const body = JSON.parse(options.body as string);
        return Promise.resolve({
          ok: true,
          status: 201,
          json: () =>
            Promise.resolve({
              transaction: {
                id: "txn_new",
                amount: body.amount,
                currency: "USD",
                status: "Pending",
                description:
                  body.description || `Transfer to ${body.recipient}`,
                recipient: body.recipient,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            }),
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

describe("TransferForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays the TRANSFER FUNDS eyebrow label", () => {
    mockFetchResponses();
    renderWithProvider(<TransferForm />);
    const labels = screen.getAllByText("TRANSFER FUNDS");
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  it("has Amount, Recipient, and Description input fields", () => {
    mockFetchResponses();
    renderWithProvider(<TransferForm />);

    expect(screen.getByLabelText(/AMOUNT/i)).toBeDefined();
    expect(screen.getByLabelText(/RECIPIENT/i)).toBeDefined();
    expect(screen.getByLabelText(/DESCRIPTION/i)).toBeDefined();
  });

  it("has a Transfer submit button", () => {
    mockFetchResponses();
    renderWithProvider(<TransferForm />);

    const transferBtns = screen.getAllByText("Transfer");
    expect(transferBtns.length).toBeGreaterThanOrEqual(1);
  });

  it("shows validation error when submitting without amount", async () => {
    mockFetchResponses();
    const user = userEvent.setup();
    renderWithProvider(<TransferForm />);

    // Fill only recipient
    await user.type(screen.getByLabelText(/RECIPIENT/i), "John Doe");

    // Submit — click the first Transfer button
    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    // Should show amount error
    await waitFor(() => {
      const errors = screen.getAllByText(/amount is required|amount must be/i);
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows validation error when submitting without recipient", async () => {
    mockFetchResponses();
    const user = userEvent.setup();
    renderWithProvider(<TransferForm />);

    // Fill only amount
    await user.type(screen.getByLabelText(/AMOUNT/i), "100");

    // Submit
    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    // Should show recipient error
    await waitFor(() => {
      const errors = screen.getAllByText(/recipient is required/i);
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows validation error for zero amount", async () => {
    mockFetchResponses();
    const user = userEvent.setup();
    renderWithProvider(<TransferForm />);

    await user.type(screen.getByLabelText(/AMOUNT/i), "0");
    await user.type(screen.getByLabelText(/RECIPIENT/i), "John Doe");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    await waitFor(() => {
      const errors = screen.getAllByText(
        /amount must be greater than zero/i
      );
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows validation error for negative amount", async () => {
    mockFetchResponses();
    const user = userEvent.setup();
    renderWithProvider(<TransferForm />);

    await user.type(screen.getByLabelText(/AMOUNT/i), "-50");
    await user.type(screen.getByLabelText(/RECIPIENT/i), "John Doe");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    await waitFor(() => {
      const errors = screen.getAllByText(
        /amount must be greater than zero/i
      );
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("clears form after successful submission", async () => {
    mockFetchResponses();
    const user = userEvent.setup();
    renderWithProvider(<TransferForm />);

    const amountInput = screen.getByLabelText(/AMOUNT/i) as HTMLInputElement;
    const recipientInput = screen.getByLabelText(
      /RECIPIENT/i
    ) as HTMLInputElement;
    const descInput = screen.getByLabelText(
      /DESCRIPTION/i
    ) as HTMLInputElement;

    await user.type(amountInput, "100");
    await user.type(recipientInput, "John Doe");
    await user.type(descInput, "Test transfer");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    // Wait for success message
    await waitFor(() => {
      const msgs = screen.getAllByText(/transfer initiated successfully/i);
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });

    // Form should be cleared
    expect(amountInput.value).toBe("");
    expect(recipientInput.value).toBe("");
    expect(descInput.value).toBe("");
  });

  it("shows success confirmation after valid submission", async () => {
    mockFetchResponses();
    const user = userEvent.setup();
    renderWithProvider(<TransferForm />);

    await user.type(screen.getByLabelText(/AMOUNT/i), "100");
    await user.type(screen.getByLabelText(/RECIPIENT/i), "John Doe");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    await waitFor(() => {
      const msgs = screen.getAllByText(/transfer initiated successfully/i);
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("calls POST /api/transactions with correct payload on valid submit", async () => {
    mockFetchResponses();
    const user = userEvent.setup();
    renderWithProvider(<TransferForm />);

    await user.type(screen.getByLabelText(/AMOUNT/i), "250.50");
    await user.type(screen.getByLabelText(/RECIPIENT/i), "Jane Smith");
    await user.type(screen.getByLabelText(/DESCRIPTION/i), "Dinner payment");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    await waitFor(() => {
      const msgs = screen.getAllByText(/transfer initiated successfully/i);
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });

    // Verify the POST call was made
    const fetchCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
    const postCall = fetchCalls.find(
      ([url, opts]: [string, RequestInit]) =>
        url.includes("/api/transactions") && opts?.method === "POST"
    );

    expect(postCall).toBeDefined();
    const body = JSON.parse(postCall![1].body as string);
    expect(body.amount).toBe(250.5);
    expect(body.recipient).toBe("Jane Smith");
    expect(body.description).toBe("Dinner payment");
  });

  it("description field is optional - form submits without it", async () => {
    mockFetchResponses();
    const user = userEvent.setup();
    renderWithProvider(<TransferForm />);

    await user.type(screen.getByLabelText(/AMOUNT/i), "100");
    await user.type(screen.getByLabelText(/RECIPIENT/i), "John Doe");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    await waitFor(() => {
      const msgs = screen.getAllByText(/transfer initiated successfully/i);
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("clears error messages when user starts typing in errored field", async () => {
    mockFetchResponses();
    const user = userEvent.setup();
    renderWithProvider(<TransferForm />);

    // Submit empty to trigger errors
    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    // Both errors should appear
    await waitFor(() => {
      expect(
        screen.getAllByText(/amount is required/i).length
      ).toBeGreaterThanOrEqual(1);
    });
    expect(
      screen.getAllByText(/recipient is required/i).length
    ).toBeGreaterThanOrEqual(1);

    // Start typing in amount — amount error should clear
    await user.type(screen.getByLabelText(/AMOUNT/i), "1");
    expect(screen.queryByText(/amount is required/i)).toBeNull();

    // Recipient error should still be there
    expect(
      screen.getAllByText(/recipient is required/i).length
    ).toBeGreaterThanOrEqual(1);
  });
});
