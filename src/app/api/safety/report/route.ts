import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetType, targetId, reason, details } = await req.json();

    if (!targetType || !targetId || !reason) {
      return NextResponse.json(
        { error: "Target type, target ID, and reason are required." },
        { status: 400 }
      );
    }

    const report = await db.report.create({
      data: {
        reporterId: user.id,
        targetType, // USER, ACTIVITY, TRAVEL
        targetId,
        reason,
        details: details ? details.trim() : null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for helping keep our community safe. Our moderation team will review this report promptly.",
      report,
    });
  } catch (error) {
    console.error("POST report error:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
