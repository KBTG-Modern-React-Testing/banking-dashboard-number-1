import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { TransferForm } from "@/components/TransferForm";
import { renderWithProviders } from "./helpers/test-utils";

describe("TransferForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays the TRANSFER FUNDS eyebrow label", () => {
    renderWithProviders(<TransferForm />);
    const labels = screen.getAllByText("TRANSFER FUNDS");
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  it("has Amount, Recipient, and Description input fields", () => {
    renderWithProviders(<TransferForm />);

    expect(screen.getByLabelText(/AMOUNT/i)).toBeDefined();
    expect(screen.getByLabelText(/RECIPIENT/i)).toBeDefined();
    expect(screen.getByLabelText(/DESCRIPTION/i)).toBeDefined();
  });

  it("has a Transfer submit button", () => {
    renderWithProviders(<TransferForm />);

    const transferBtns = screen.getAllByText("Transfer");
    expect(transferBtns.length).toBeGreaterThanOrEqual(1);
  });

  it("shows validation error when submitting without amount", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

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
    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

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
    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

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
    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

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
    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

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
    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

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
    let capturedBody: Record<string, unknown> | undefined;

    server.use(
      http.post("/api/transactions", async ({ request }) => {
        capturedBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json(
          {
            transaction: {
              id: "txn_new",
              amount: capturedBody.amount,
              currency: "USD",
              status: "Pending",
              description: capturedBody.description || "Transfer",
              recipient: capturedBody.recipient,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
          { status: 201 }
        );
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

    await user.type(screen.getByLabelText(/AMOUNT/i), "250.50");
    await user.type(screen.getByLabelText(/RECIPIENT/i), "Jane Smith");
    await user.type(screen.getByLabelText(/DESCRIPTION/i), "Dinner payment");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    await waitFor(() => {
      const msgs = screen.getAllByText(/transfer initiated successfully/i);
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });

    // Verify the POST payload was captured correctly
    expect(capturedBody).toBeDefined();
    expect(capturedBody!.amount).toBe(250.5);
    expect(capturedBody!.recipient).toBe("Jane Smith");
    expect(capturedBody!.description).toBe("Dinner payment");
  });

  it("description field is optional - form submits without it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

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
    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

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

  // --- Network error tests ---

  it("shows network error message when POST fails due to network error", async () => {
    server.use(
      http.post("/api/transactions", () => HttpResponse.error())
    );

    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

    await user.type(screen.getByLabelText(/AMOUNT/i), "100");
    await user.type(screen.getByLabelText(/RECIPIENT/i), "John Doe");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    await waitFor(() => {
      const msgs = screen.getAllByText(
        /unable to connect to banking services/i
      );
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("does NOT clear form inputs when POST fails due to network error", async () => {
    server.use(
      http.post("/api/transactions", () => HttpResponse.error())
    );

    const user = userEvent.setup();
    renderWithProviders(<TransferForm />);

    const amountInput = screen.getByLabelText(/AMOUNT/i) as HTMLInputElement;
    const recipientInput = screen.getByLabelText(
      /RECIPIENT/i
    ) as HTMLInputElement;
    const descInput = screen.getByLabelText(
      /DESCRIPTION/i
    ) as HTMLInputElement;

    await user.type(amountInput, "500");
    await user.type(recipientInput, "Jane Smith");
    await user.type(descInput, "Important payment");

    const btns = screen.getAllByText("Transfer");
    await user.click(btns[0]);

    // Wait for the network error to appear
    await waitFor(() => {
      const msgs = screen.getAllByText(
        /unable to connect to banking services/i
      );
      expect(msgs.length).toBeGreaterThanOrEqual(1);
    });

    // Form inputs should NOT be cleared — data preserved for retry
    expect(amountInput.value).toBe("500");
    expect(recipientInput.value).toBe("Jane Smith");
    expect(descInput.value).toBe("Important payment");
  });
});
