import { NextResponse } from "next/server";

/* ─── GET /api/balance ─── */

export async function GET() {
  return NextResponse.json({
    balance: 15000.5,
    currency: "USD",
  });
}
