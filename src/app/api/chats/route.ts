import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { cleanupExpiredConversations, getChatRetentionInfo } from "@/lib/chatRetention";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Automatically purge conversations that exceeded their 7-day validity post-event
    await cleanupExpiredConversations();

    // 1. Get all activities and trips where the user is a participant
    const participations = await db.participant.findMany({
      where: { userId: user.id },
      select: { activityId: true, travelPlanId: true },
    });

    const activityIds = participations.map((p) => p.activityId).filter(Boolean) as string[];
    const travelPlanIds = participations.map((p) => p.travelPlanId).filter(Boolean) as string[];

    // 2. Fetch conversations matching these activities or trips
    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { activityId: { in: activityIds } },
          { travelPlanId: { in: travelPlanIds } },
        ],
      },
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            category: true,
            date: true,
            startTime: true,
            approxDurationHours: true,
            locationName: true,
            status: true,
            updatedAt: true,
          },
        },
        travelPlan: {
          select: {
            id: true,
            destination: true,
            departureCity: true,
            startDate: true,
            endDate: true,
            travelStyle: true,
            status: true,
            updatedAt: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                profile: { select: { displayName: true } },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Decorate each conversation with its 7-day retention details
    const decorated = conversations.map((conv) => ({
      ...conv,
      retentionInfo: getChatRetentionInfo(conv),
    }));

    return NextResponse.json({ conversations: decorated });
  } catch (error) {
    console.error("GET chats error:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
