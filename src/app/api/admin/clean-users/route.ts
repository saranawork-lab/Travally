import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST() {
  try {
    const notifications = await db.notification.deleteMany({});
    const messages = await db.message.deleteMany({});
    const conversations = await db.conversation.deleteMany({});
    const joinRequests = await db.joinRequest.deleteMany({});
    const participants = await db.participant.deleteMany({});
    const activities = await db.activity.deleteMany({});
    const travelPlans = await db.travelPlan.deleteMany({});
    const blocks = await db.block.deleteMany({});
    const reports = await db.report.deleteMany({});
    const profiles = await db.profile.deleteMany({});
    const users = await db.user.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "MongoDB user data cleaned successfully",
      stats: {
        users: users.count,
        profiles: profiles.count,
        activities: activities.count,
        travelPlans: travelPlans.count,
        joinRequests: joinRequests.count,
        messages: messages.count,
        notifications: notifications.count,
        blocks: blocks.count,
        reports: reports.count,
      },
    });
  } catch (error: any) {
    console.error("Failed to clean MongoDB user data:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to clean MongoDB users data" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
