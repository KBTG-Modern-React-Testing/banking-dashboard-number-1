import { http, HttpResponse } from "msw";
import type { TransferPayload, Transaction } from "@/lib/types";

/* ─── Stateful In-Memory Store (for tests) ───
 *
 * Mirrors the server-side lib/store.ts but runs in the test process.
 * Each test gets a fresh state thanks to server.resetHandlers() in afterEach.
 */

let balance = 15000.5;
const pendingSettlements: Array<{
  txnId: string;
  amount: number;
  timer: ReturnType<typeof setTimeout>;
}> = [];

/* ─── Default MSW Handlers ───
 *
 * These provide sensible defaults for every API endpoint.
 * Individual tests can override any handler via `server.use()`.
 */

export const handlers = [
  // GET /api/balance
  http.get("/api/balance", () => {
    return HttpResponse.json({ balance, currency: "USD" });
  }),

  // GET /api/transactions
  http.get("/api/transactions", () => {
    return HttpResponse.json({ transactions: [] });
  }),

  // POST /api/transactions
  http.post("/api/transactions", async ({ request }) => {
    const body = (await request.json()) as TransferPayload;

    const now = new Date().toISOString();
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      amount: body.amount,
      currency: "USD",
      status: "Pending",
      description:
        body.description?.trim() || `Transfer to ${body.recipient}`,
      recipient: body.recipient,
      createdAt: now,
      updatedAt: now,
    };

    return HttpResponse.json({ transaction }, { status: 201 });
  }),
];

/**
 * Helper to set the balance in the MSW store for a specific test.
 * Use in combination with server.use() for GET /api/balance override.
 */
export function setMswBalance(newBalance: number) {
  balance = newBalance;
}

/**
 * Helper to reset the MSW store state between tests.
 * Called automatically if you wire this into your setup.
 */
export function resetMswStore() {
  balance = 15000.5;
  for (const s of pendingSettlements) {
    clearTimeout(s.timer);
  }
  pendingSettlements.length = 0;
}

/**
 * Creates MSW handlers that simulate the settlement flow:
 * POST creates a Pending transaction, then after `settleDelayMs`
 * the balance is deducted and the transaction status changes.
 *
 * Returns { handlers, getBalance, getTransactions } for assertions.
 */
export function createSettlementHandlers(settleDelayMs = 100) {
  let storeBalance = 15000.5;
  const storeTransactions: Transaction[] = [];

  const settlementHandlers = [
    http.get("/api/balance", () => {
      return HttpResponse.json({ balance: storeBalance, currency: "USD" });
    }),

    http.get("/api/transactions", () => {
      const sorted = [...storeTransactions].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return HttpResponse.json({ transactions: sorted });
    }),

    http.post("/api/transactions", async ({ request }) => {
      const body = (await request.json()) as TransferPayload;

      const now = new Date().toISOString();
      const transaction: Transaction = {
        id: `txn_${Date.now()}`,
        amount: body.amount,
        currency: "USD",
        status: "Pending",
        description:
          body.description?.trim() || `Transfer to ${body.recipient}`,
        recipient: body.recipient,
        createdAt: now,
        updatedAt: now,
      };

      storeTransactions.unshift(transaction);

      // Schedule settlement
      setTimeout(() => {
        const txn = storeTransactions.find((t) => t.id === transaction.id);
        if (txn && txn.status === "Pending") {
          txn.status = "Completed";
          txn.updatedAt = new Date().toISOString();
          storeBalance = Math.max(0, storeBalance - body.amount);
        }
      }, settleDelayMs);

      return HttpResponse.json({ transaction }, { status: 201 });
    }),
  ];

  return {
    handlers: settlementHandlers,
    getBalance: () => storeBalance,
    getTransactions: () => [...storeTransactions],
  };
}
