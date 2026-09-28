import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = params;
    const body = await req.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
    }

    if (targetUserId === user.id) {
      return NextResponse.json({ error: "Host cannot remove themselves from the group." }, { status: 400 });
    }

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        activity: {
          include: {
            organizer: {
              include: { profile: true },
            },
          },
        },
        travelPlan: {
          include: {
            organizer: {
              include: { profile: true },
            },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Verify current user is the host / organizer
    const isHost =
      (conversation.activity && conversation.activity.organizerId === user.id) ||
      (conversation.travelPlan && conversation.travelPlan.organizerId === user.id) ||
      user.role === "ADMIN";

    if (!isHost) {
      return NextResponse.json(
        { error: "Only the group host has authority to remove members." },
        { status: 403 }
      );
    }

    // Target user profile for system message and notifications
    const targetUser = await db.user.findUnique({
      where: { id: targetUserId },
      include: { profile: true },
    });
    const targetName = targetUser?.profile?.displayName || targetUser?.email?.split("@")[0] || "A participant";
    const hostName = (user as any).name || (user as any).displayName || user.email?.split("@")[0] || "The host";

    // Remove from Participant table
    if (conversation.activityId) {
      await db.participant.deleteMany({
        where: {
          userId: targetUserId,
          activityId: conversation.activityId,
        },
      });

      // Update Activity accepted count & reopen
      await db.activity.update({
        where: { id: conversation.activityId },
        data: {
          currentAcceptedCount: { decrement: 1 },
          status: "OPEN",
        },
      });

      // Update any JoinRequests from this user to DECLINED
      await db.joinRequest.updateMany({
        where: {
          applicantId: targetUserId,
          activityId: conversation.activityId,
          status: "ACCEPTED",
        },
        data: { status: "DECLINED" },
      });
    } else if (conversation.travelPlanId) {
      await db.participant.deleteMany({
        where: {
          userId: targetUserId,
          travelPlanId: conversation.travelPlanId,
        },
      });

      // Update TravelPlan accepted count & reopen
      await db.travelPlan.update({
        where: { id: conversation.travelPlanId },
        data: {
          currentAcceptedCount: { decrement: 1 },
          status: "OPEN",
        },
      });

      // Update any JoinRequests from this user to DECLINED
      await db.joinRequest.updateMany({
        where: {
          applicantId: targetUserId,
          travelPlanId: conversation.travelPlanId,
          status: "ACCEPTED",
        },
        data: { status: "DECLINED" },
      });
    }

    // Create system message in chat
    await db.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content: JSON.stringify({
          text: `⚠️ ${targetName} was removed from the group by the host.`,
          system: true,
        }),
        readBy: JSON.stringify([user.id]),
      },
    });

    // Create In-App Notification for removed user
    await db.notification.create({
      data: {
        userId: targetUserId,
        type: "ACTIVITY_CANCELLED",
        title: "Removed from Group",
        body: `You were removed from "${conversation.title}" by the host.`,
        actionUrl: "/chats",
      },
    });

    return NextResponse.json({ success: true, removedUserId: targetUserId });
  } catch (error) {
    console.error("Remove participant error:", error);
    return NextResponse.json({ error: "Failed to remove participant" }, { status: 500 });
  }
}
