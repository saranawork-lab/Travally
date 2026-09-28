import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const activity = await db.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    if (activity.organizerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only the event creator can reopen this event." }, { status: 403 });
    }

    if (activity.currentAcceptedCount >= activity.maxParticipants) {
      return NextResponse.json({ error: "Cannot reopen an event that is currently at full capacity." }, { status: 400 });
    }

    const updated = await db.activity.update({
      where: { id },
      data: { status: "OPEN" },
    });

    return NextResponse.json({
      success: true,
      message: "Event has been reopened to the public feed and discovery views.",
      activity: updated,
    });
  } catch (error) {
    console.error("POST activity reopen error:", error);
    return NextResponse.json({ error: "Failed to reopen activity" }, { status: 500 });
  }
}
