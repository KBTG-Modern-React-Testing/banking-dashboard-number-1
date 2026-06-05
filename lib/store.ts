/**
 * In-memory store that ties balance and transactions together.
 *
 * - `balance` starts at INITIAL_BALANCE and is deducted when a
 *   transaction transitions from Pending → Completed.
 * - New transfers start as "Pending", then auto-complete after
 *   SETTLE_DELAY_MS, at which point the balance is deducted.
 */

import type { Transaction } from "@/lib/types";

/* ─── Constants ─── */

const INITIAL_BALANCE = 15_000.5;
const SETTLE_DELAY_MS = 3_000; // 3 seconds to simulate bank processing

/* ─── State ─── */

let balance = INITIAL_BALANCE;
let nextId = 8;

const transactions: Transaction[] = [
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
    amount: 75.5,
    currency: "USD",
    status: "Completed",
    description: "Online purchase",
    recipient: "Amazon",
    createdAt: "2026-06-03T14:20:00Z",
    updatedAt: "2026-06-03T14:22:00Z",
  },
  {
    id: "txn_004",
    amount: 500.0,
    currency: "USD",
    status: "Failed",
    description: "Failed payment",
    recipient: "Electric Co",
    createdAt: "2026-06-03T10:00:00Z",
    updatedAt: "2026-06-03T10:02:00Z",
  },
  {
    id: "txn_005",
    amount: 3200.0,
    currency: "USD",
    status: "Completed",
    description: "Salary deposit",
    recipient: "Employer Inc",
    createdAt: "2026-06-02T09:00:00Z",
    updatedAt: "2026-06-02T09:01:00Z",
  },
  {
    id: "txn_006",
    amount: 89.99,
    currency: "USD",
    status: "Completed",
    description: "Subscription renewal",
    recipient: "Netflix",
    createdAt: "2026-06-01T12:00:00Z",
    updatedAt: "2026-06-01T12:01:00Z",
  },
  {
    id: "txn_007",
    amount: 150.0,
    currency: "USD",
    status: "Pending",
    description: "Dinner payment",
    recipient: "John Doe",
    createdAt: "2026-06-04T06:45:00Z",
    updatedAt: "2026-06-04T06:45:00Z",
  },
];

/* ─── Accessors ─── */

export function getBalance() {
  return { balance, currency: "USD" };
}

export function getTransactions() {
  return [...transactions].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/* ─── Mutations ─── */

export interface CreateTransferInput {
  amount: number;
  recipient: string;
  description?: string;
}

/**
 * Creates a new Pending transaction, then schedules auto-completion
 * after SETTLE_DELAY_MS. When it completes, the balance is deducted.
 */
export function createTransfer(input: CreateTransferInput): Transaction {
  const now = new Date().toISOString();
  const transaction: Transaction = {
    id: `txn_${String(nextId++).padStart(3, "0")}`,
    amount: input.amount,
    currency: "USD",
    status: "Pending",
    description:
      input.description?.trim() || `Transfer to ${input.recipient.trim()}`,
    recipient: input.recipient.trim(),
    createdAt: now,
    updatedAt: now,
  };

  transactions.unshift(transaction);

  // Schedule auto-completion: Pending → Completed + deduct balance
  scheduleSettlement(transaction.id, input.amount);

  return transaction;
}

/**
 * After SETTLE_DELAY_MS, mark the transaction as Completed and
 * deduct the amount from the balance.
 */
function scheduleSettlement(txnId: string, amount: number) {
  setTimeout(() => {
    const txn = transactions.find((t) => t.id === txnId);
    if (txn && txn.status === "Pending") {
      txn.status = "Completed";
      txn.updatedAt = new Date().toISOString();
      balance = Math.max(0, balance - amount);
    }
  }, SETTLE_DELAY_MS);
}
