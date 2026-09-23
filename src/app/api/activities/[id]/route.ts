import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const currentUser = await getCurrentUser();

    const activity = await db.activity.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
                bio: true,
                age: true,
                city: true,
                interests: true,
                isVerified: true,
                verificationStatus: true,
                linkedinUrl: true,
              },
            },
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                profile: {
                  select: {
                    displayName: true,
                    avatarUrl: true,
                    isVerified: true,
                    verificationStatus: true,
                  },
                },
              },
            },
          },
        },
        requests: currentUser
          ? {
              where: { applicantId: currentUser.id },
            }
          : false,
      },
    });

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    return NextResponse.json({
      activity,
      userRequest: activity.requests && activity.requests.length > 0 ? activity.requests[0] : null,
      isOrganizer: currentUser?.id === activity.organizerId,
    });
  } catch (error) {
    console.error("GET activity error:", error);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { status } = await req.json();

    const activity = await db.activity.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    if (activity.organizerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only the organizer can modify this activity" }, { status: 403 });
    }

    const updated = await db.activity.update({
      where: { id },
      data: { status },
    });

    // Notify participants if cancelled
    if (status === "CANCELLED") {
      for (const p of activity.participants) {
        if (p.userId !== user.id) {
          await db.notification.create({
            data: {
              userId: p.userId,
              type: "ACTIVITY_CANCELLED",
              title: "Activity Cancelled",
              body: `The activity "${activity.title}" was cancelled by the host.`,
              actionUrl: `/activities/${activity.id}`,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, activity: updated });
  } catch (error) {
    console.error("PATCH activity error:", error);
    return NextResponse.json({ error: "Failed to update activity status" }, { status: 500 });
  }
}
