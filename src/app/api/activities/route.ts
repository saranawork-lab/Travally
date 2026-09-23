import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "OPEN";

    const currentUser = await getCurrentUser();

    // Find blocked users to exclude
    let blockedUserIds: string[] = [];
    if (currentUser) {
      const blocks = await db.block.findMany({
        where: {
          OR: [
            { blockerId: currentUser.id },
            { blockedId: currentUser.id },
          ],
        },
      });
      blockedUserIds = blocks.map((b) => (b.blockerId === currentUser.id ? b.blockedId : b.blockerId));
    }

    const where: any = {
      status: status === "ALL" ? undefined : status,
      organizerId: { notIn: blockedUserIds },
    };

    if (category && category !== "ALL") {
      where.category = category.toUpperCase().replace(/\s+/g, "_");
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { locationName: { contains: q } },
      ];
    }

    const activities = await db.activity.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
                isVerified: true,
                verificationStatus: true,
                city: true,
                linkedinUrl: true,
              },
            },
          },
        },
        requests: currentUser
          ? {
              where: { applicantId: currentUser.id },
              select: { id: true, status: true },
            }
          : false,
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("GET activities error:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required to create an activity" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      date,
      startTime,
      approxDurationHours,
      locationName,
      meetingPointVenue,
      maxParticipants,
      preferredAgeMin,
      preferredAgeMax,
      genderPreference,
      additionalRequirements,
      cutoffHoursBeforeStart,
    } = body;

    // Note: locationName and maxParticipants are now optional as requested
    if (!title || !description || !category || !date || !startTime) {
      return NextResponse.json(
        { error: "Please fill in all required fields: title, description, category, date, and start time." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format." }, { status: 400 });
    }

    const activity = await db.activity.create({
      data: {
        organizerId: user.id,
        title: title.trim(),
        description: description.trim(),
        category: category.toUpperCase().replace(/\s+/g, "_"),
        date: parsedDate,
        startTime: startTime.trim(),
        approxDurationHours: parseFloat(approxDurationHours) || 2.0,
        locationName: locationName ? locationName.trim() : (user.city || "Local Meetup"),
        meetingPointVenue: meetingPointVenue ? meetingPointVenue.trim() : null,
        maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : 2,
        currentAcceptedCount: 0,
        preferredAgeMin: preferredAgeMin ? parseInt(preferredAgeMin, 10) : null,
        preferredAgeMax: preferredAgeMax ? parseInt(preferredAgeMax, 10) : null,
        genderPreference: genderPreference || "ANY",
        additionalRequirements: additionalRequirements ? additionalRequirements.trim() : null,
        cutoffHoursBeforeStart: cutoffHoursBeforeStart ? parseInt(cutoffHoursBeforeStart, 10) : 2,
        status: "OPEN",
      },
    });

    // Automatically create participant entry for the organizer
    await db.participant.create({
      data: {
        userId: user.id,
        activityId: activity.id,
        role: "ORGANIZER",
      },
    });

    return NextResponse.json({ success: true, activity }, { status: 201 });
  } catch (error) {
    console.error("POST activity error:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}
