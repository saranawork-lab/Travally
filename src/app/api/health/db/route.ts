import { NextResponse } from "next/server";
import { verifyDatabaseConnection } from "@/lib/server/dbHealth";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbHealth = await verifyDatabaseConnection();
  const status = dbHealth.ok ? 200 : 503;

  return NextResponse.json(dbHealth, { status });
}
