import { NextResponse } from "next/server";
import { getBalance } from "@/lib/store";

/* ─── GET /api/balance ─── */

export async function GET() {
  return NextResponse.json(getBalance());
}
