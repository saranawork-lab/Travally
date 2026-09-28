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

    const trip = await db.travelPlan.findUnique({
      where: { id },
    });

    if (!trip) {
      return NextResponse.json({ error: "Travel plan not found" }, { status: 404 });
    }

    if (trip.organizerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only the travel organizer can reopen this trip." }, { status: 403 });
    }

    if (trip.currentAcceptedCount >= trip.groupSizeMax) {
      return NextResponse.json({ error: "Cannot reopen a trip that is currently at full capacity." }, { status: 400 });
    }

    const updated = await db.travelPlan.update({
      where: { id },
      data: { status: "OPEN" },
    });

    return NextResponse.json({
      success: true,
      message: "Trip has been reopened to the public feed and discovery views.",
      travelPlan: updated,
    });
  } catch (error) {
    console.error("POST travel reopen error:", error);
    return NextResponse.json({ error: "Failed to reopen travel plan" }, { status: 500 });
  }
}
