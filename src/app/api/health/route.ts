import { NextResponse } from "next/server";
import { verifyDatabaseConnection } from "@/lib/server/dbHealth";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbHealth = await verifyDatabaseConnection();

  const isHealthy = dbHealth.ok;
  const status = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "unhealthy",
      service: "travally-api",
      timestamp: new Date().toISOString(),
      database: dbHealth,
    },
    { status }
  );
}
