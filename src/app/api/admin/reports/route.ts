import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Admin credentials required." }, { status: 403 });
    }

    const reports = await db.report.findMany({
      include: {
        reporter: {
          select: {
            id: true,
            email: true,
            profile: { select: { displayName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("GET admin reports error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Admin credentials required." }, { status: 403 });
    }

    const { id, status, actionTaken } = await req.json();

    const updated = await db.report.update({
      where: { id },
      data: {
        status, // RESOLVED, DISMISSED
        actionTaken: actionTaken || `Action logged by admin ${user.email} on ${new Date().toISOString()}`,
      },
    });

    return NextResponse.json({ success: true, report: updated });
  } catch (error) {
    console.error("PATCH admin report error:", error);
    return NextResponse.json({ error: "Failed to update report status" }, { status: 500 });
  }
}
