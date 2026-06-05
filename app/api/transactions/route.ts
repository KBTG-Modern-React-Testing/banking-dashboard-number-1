import { NextRequest, NextResponse } from "next/server";
import { getTransactions, createTransfer } from "@/lib/store";

/* ─── GET /api/transactions ─── */

export async function GET() {
  return NextResponse.json({ transactions: getTransactions() });
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

    const transaction = createTransfer({
      amount,
      recipient,
      description,
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
