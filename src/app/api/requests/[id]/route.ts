import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { action } = await req.json(); // "ACCEPT" | "DECLINE"

    if (action !== "ACCEPT" && action !== "DECLINE") {
      return NextResponse.json({ error: "Invalid action. Must be ACCEPT or DECLINE." }, { status: 400 });
    }

    const joinRequest = await db.joinRequest.findUnique({
      where: { id },
      include: {
        activity: true,
        travelPlan: true,
        applicant: {
          select: {
            id: true,
            email: true,
            profile: { select: { displayName: true } },
          },
        },
      },
    });

    if (!joinRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const isActivity = joinRequest.type === "ACTIVITY";
    const organizerId = isActivity ? joinRequest.activity?.organizerId : joinRequest.travelPlan?.organizerId;

    if (organizerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only the organizer can respond to this request." }, { status: 403 });
    }

    if (joinRequest.status !== "PENDING") {
      return NextResponse.json({ error: `Request has already been ${joinRequest.status.toLowerCase()}.` }, { status: 400 });
    }

    if (action === "DECLINE") {
      const updated = await db.joinRequest.update({
        where: { id },
        data: {
          status: "DECLINED",
          respondedAt: new Date(),
        },
      });

      await db.notification.create({
        data: {
          userId: joinRequest.applicantId,
          type: "REQUEST_DECLINED",
          title: "Request Update",
          body: `Your request to join "${isActivity ? joinRequest.activity?.title : joinRequest.travelPlan?.destination}" was declined.`,
          actionUrl: "/discover",
        },
      });

      return NextResponse.json({ success: true, request: updated });
    }

    // Handle ACCEPT
    if (isActivity && joinRequest.activity) {
      const activity = joinRequest.activity;

      // Check current capacity
      if (activity.currentAcceptedCount >= activity.maxParticipants) {
        return NextResponse.json({ error: "Activity is already at maximum capacity." }, { status: 400 });
      }

      // 1. Update JoinRequest
      const updated = await db.joinRequest.update({
        where: { id },
        data: {
          status: "ACCEPTED",
          respondedAt: new Date(),
        },
      });

      // 2. Add to Participants
      const existingParticipant = await db.participant.findFirst({
        where: {
          userId: joinRequest.applicantId,
          activityId: activity.id,
        },
      });

      if (!existingParticipant) {
        await db.participant.create({
          data: {
            userId: joinRequest.applicantId,
            activityId: activity.id,
            role: "MEMBER",
          },
        });
      }

      // 3. Increment accepted count & check capacity
      const newAcceptedCount = activity.currentAcceptedCount + 1;
      const isNowFull = newAcceptedCount >= activity.maxParticipants;

      await db.activity.update({
        where: { id: activity.id },
        data: {
          currentAcceptedCount: newAcceptedCount,
          status: isNowFull ? "FULL" : activity.status,
        },
      });

      // 4. Ensure Conversation exists
      let conversation = await db.conversation.findFirst({
        where: { activityId: activity.id },
      });

      if (!conversation) {
        conversation = await db.conversation.create({
          data: {
            type: "ACTIVITY",
            activityId: activity.id,
            title: `${activity.title} Group Chat`,
          },
        });
      }

      // 5. Send welcome message into chat
      await db.message.create({
        data: {
          conversationId: conversation.id,
          senderId: user.id,
          content: `Welcome to the group, ${joinRequest.applicant.profile?.displayName || "companion"}! Feel free to coordinate details here.`,
        },
      });

      // 6. Send notification to applicant
      await db.notification.create({
        data: {
          userId: joinRequest.applicantId,
          type: "REQUEST_ACCEPTED",
          title: "Request Accepted!",
          body: `You are in! ${user.displayName} accepted your request for "${activity.title}". The private chat is now open.`,
          actionUrl: `/chats/${conversation.id}`,
        },
      });

      return NextResponse.json({ success: true, request: updated, conversationId: conversation.id });
    }

    if (!isActivity && joinRequest.travelPlan) {
      const trip = joinRequest.travelPlan;

      if (trip.currentAcceptedCount >= trip.groupSizeMax) {
        return NextResponse.json({ error: "Trip has reached maximum companion capacity." }, { status: 400 });
      }

      const updated = await db.joinRequest.update({
        where: { id },
        data: {
          status: "ACCEPTED",
          respondedAt: new Date(),
        },
      });

      const existingParticipant = await db.participant.findFirst({
        where: {
          userId: joinRequest.applicantId,
          travelPlanId: trip.id,
        },
      });

      if (!existingParticipant) {
        await db.participant.create({
          data: {
            userId: joinRequest.applicantId,
            travelPlanId: trip.id,
            role: "MEMBER",
          },
        });
      }

      const newAcceptedCount = trip.currentAcceptedCount + 1;
      const isNowFull = newAcceptedCount >= trip.groupSizeMax;

      await db.travelPlan.update({
        where: { id: trip.id },
        data: {
          currentAcceptedCount: newAcceptedCount,
          status: isNowFull ? "FULL" : trip.status,
        },
      });

      let conversation = await db.conversation.findFirst({
        where: { travelPlanId: trip.id },
      });

      if (!conversation) {
        conversation = await db.conversation.create({
          data: {
            type: "TRAVEL",
            travelPlanId: trip.id,
            title: `${trip.destination} Travel Team`,
          },
        });
      }

      await db.message.create({
        data: {
          conversationId: conversation.id,
          senderId: user.id,
          content: `Welcome to the travel group, ${joinRequest.applicant.profile?.displayName || "traveler"}! Excited to plan our journey together.`,
        },
      });

      await db.notification.create({
        data: {
          userId: joinRequest.applicantId,
          type: "REQUEST_ACCEPTED",
          title: "Travel Request Accepted!",
          body: `Your request to join the trip to ${trip.destination} has been accepted! You can now join the planning chat.`,
          actionUrl: `/chats/${conversation.id}`,
        },
      });

      return NextResponse.json({ success: true, request: updated, conversationId: conversation.id });
    }

    return NextResponse.json({ error: "Failed to process request." }, { status: 400 });
  } catch (error) {
    console.error("PATCH request error:", error);
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}

// User cancels their own request
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const joinRequest = await db.joinRequest.findUnique({
      where: { id },
    });

    if (!joinRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (joinRequest.applicantId !== user.id) {
      return NextResponse.json({ error: "You can only cancel your own requests." }, { status: 403 });
    }

    const cancelled = await db.joinRequest.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true, message: "Request cancelled successfully", request: cancelled });
  } catch (error) {
    console.error("DELETE request error:", error);
    return NextResponse.json({ error: "Failed to cancel request" }, { status: 500 });
  }
}
