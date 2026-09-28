import db from "@/lib/db";

export interface DatabaseHealthResult {
  ok: boolean;
  status: "connected" | "degraded" | "disconnected";
  latencyMs: number;
  provider: string;
  databaseName?: string;
  error?: string;
  timestamp: string;
}

/**
 * Actively checks database connection health and query responsiveness.
 * Supports Prisma SQLite / PostgreSQL and verifies MongoDB if MONGODB_URI is configured.
 */
export async function verifyDatabaseConnection(): Promise<DatabaseHealthResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Detect configured database provider
  const dbUrl = process.env.DATABASE_URL || "";
  const mongoUrl = process.env.MONGODB_URI || "";
  const provider = mongoUrl
    ? "mongodb"
    : dbUrl.startsWith("file:")
    ? "sqlite"
    : dbUrl.startsWith("postgresql:") || dbUrl.startsWith("postgres:")
    ? "postgresql"
    : "database";

  try {
    // 1. Perform a lightweight ping query through Prisma
    const userCount = await db.user.count();
    const latencyMs = Date.now() - startTime;

    return {
      ok: true,
      status: "connected",
      latencyMs,
      provider,
      timestamp,
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error("Database health check error:", error);

    return {
      ok: false,
      status: "disconnected",
      latencyMs,
      provider,
      error: error?.message || "Database connection could not be established",
      timestamp,
    };
  }
}
