import { NextRequest, NextResponse } from "next/server";
import type { Transaction } from "@/lib/types";


/* ─── In-Memory Store ─── */

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

/* ─── GET /api/transactions ─── */

export async function GET() {
  // Return sorted newest-first
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ transactions: sorted });
}

/* ─── POST /api/transactions ─── */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, recipient, description } = body;

    // Validation
    if (amount === undefined || amount === null || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Amount is required and must be a number" },
        { status: 400 }
      );
    }
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than zero" },
        { status: 400 }
      );
    }
    if (!recipient || typeof recipient !== "string" || !recipient.trim()) {
      return NextResponse.json(
        { error: "Recipient is required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const transaction: Transaction = {
      id: `txn_${String(nextId++).padStart(3, "0")}`,
      amount,
      currency: "USD",
      status: "Pending",
      description: description?.trim() || `Transfer to ${recipient.trim()}`,
      recipient: recipient.trim(),
      createdAt: now,
      updatedAt: now,
    };

    // Add to store
    transactions.unshift(transaction);

    return NextResponse.json({ transaction }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
