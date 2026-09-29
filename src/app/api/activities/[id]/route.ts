import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser, isValidObjectId } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
    const currentUser = await getCurrentUser();

    const activity = await db.activity.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
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
      currentUser: currentUser
        ? {
            id: currentUser.id,
            displayName: currentUser.displayName,
            isVerified: currentUser.isVerified,
          }
        : null,
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
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
    const body = await req.json();

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

    // Build update data
    const updateData: any = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.category !== undefined) updateData.category = body.category;
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.startTime !== undefined) updateData.startTime = body.startTime;
    if (body.approxDurationHours !== undefined) updateData.approxDurationHours = parseFloat(body.approxDurationHours) || 2.0;
    if (body.locationName !== undefined) updateData.locationName = body.locationName.trim();
    if (body.meetingPointVenue !== undefined) updateData.meetingPointVenue = body.meetingPointVenue;
    if (body.maxParticipants !== undefined) updateData.maxParticipants = parseInt(body.maxParticipants, 10) || 2;
    if (body.genderPreference !== undefined) updateData.genderPreference = body.genderPreference;
    if (body.additionalRequirements !== undefined) updateData.additionalRequirements = body.additionalRequirements;
    if (body.cutoffHoursBeforeStart !== undefined) updateData.cutoffHoursBeforeStart = parseFloat(body.cutoffHoursBeforeStart) || 1;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;

    const updated = await db.activity.update({
      where: { id },
      data: updateData,
    });

    // Notify participants if cancelled
    if (body.status === "CANCELLED") {
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
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    const activity = await db.activity.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    if (activity.organizerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only the organizer can delete this activity" }, { status: 403 });
    }

    // Cascade delete activity and associated records
    await db.activity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Activity deleted successfully" });
  } catch (error) {
    console.error("DELETE activity error:", error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}
