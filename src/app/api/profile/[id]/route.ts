import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const currentUser = await getCurrentUser();

    // Check if blocked
    if (currentUser) {
      const isBlocked = await db.block.findFirst({
        where: {
          OR: [
            { blockerId: currentUser.id, blockedId: id },
            { blockerId: id, blockedId: currentUser.id },
          ],
        },
      });
      if (isBlocked) {
        return NextResponse.json({ error: "Profile unavailable" }, { status: 404 });
      }
    }

    const targetUser = await db.user.findUnique({
      where: { id },
      include: {
        profile: true,
        activitiesOrganized: {
          where: { status: "OPEN" },
          take: 4,
          orderBy: { date: "asc" },
        },
        travelPlansOrganized: {
          where: { status: "OPEN" },
          take: 4,
          orderBy: { startDate: "asc" },
        },
      },
    });

    if (!targetUser || !targetUser.profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Strip private details
    const sanitizedUser = {
      id: targetUser.id,
      email: targetUser.profile.hideContactDetails ? undefined : targetUser.email,
      role: targetUser.role,
      profile: targetUser.profile,
      activities: targetUser.activitiesOrganized,
      travelPlans: targetUser.travelPlansOrganized,
      isSelf: currentUser?.id === targetUser.id,
    };

    return NextResponse.json({ user: sanitizedUser });
  } catch (error) {
    console.error("GET public profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
