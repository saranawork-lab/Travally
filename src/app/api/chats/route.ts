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

    // 1. Non-blocking background purge of conversations exceeding 7-day retention
    cleanupExpiredConversations().catch((err) =>
      console.warn("Background chat retention cleanup warning:", err)
    );

    // 2. Get all activities and trips where the user is a participant
    const participations = await db.participant.findMany({
      where: { userId: user.id },
      select: { activityId: true, travelPlanId: true },
    });

    const activityIds = participations.map((p) => p.activityId).filter(Boolean) as string[];
    const travelPlanIds = participations.map((p) => p.travelPlanId).filter(Boolean) as string[];

    if (activityIds.length === 0 && travelPlanIds.length === 0) {
      const emptyRes = NextResponse.json({ conversations: [] });
      emptyRes.headers.set("Cache-Control", "private, s-maxage=10, stale-while-revalidate=59");
      return emptyRes;
    }

    // 3. Fetch conversations matching these activities or trips
    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          ...(activityIds.length > 0 ? [{ activityId: { in: activityIds } }] : []),
          ...(travelPlanIds.length > 0 ? [{ travelPlanId: { in: travelPlanIds } }] : []),
        ],
      },
      select: {
        id: true,
        title: true,
        type: true,
        updatedAt: true,
        activityId: true,
        travelPlanId: true,
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
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            sender: {
              select: {
                id: true,
                profile: { select: { displayName: true, avatarUrl: true } },
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

    const response = NextResponse.json({ conversations: decorated });
    response.headers.set("Cache-Control", "private, s-maxage=10, stale-while-revalidate=59");
    return response;
  } catch (error) {
    console.error("GET chats error:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
