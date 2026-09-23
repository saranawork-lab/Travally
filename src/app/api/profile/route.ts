import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        activitiesOrganized: { take: 5, orderBy: { createdAt: "desc" } },
        travelPlansOrganized: { take: 5, orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ user: fullUser });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      displayName,
      bio,
      city,
      gender,
      interests,
      preferredActivities,
      connectionPreferences,
      linkedinUrl,
      avatarUrl,
      hideContactDetails,
      discoveryVisible,
    } = body;

    const updatedProfile = await db.profile.upsert({
      where: { userId: user.id },
      update: {
        displayName: displayName ? displayName.trim() : undefined,
        bio: bio !== undefined ? bio.trim() : undefined,
        city: city !== undefined ? city.trim() : undefined,
        gender: gender || undefined,
        interests: interests !== undefined ? JSON.stringify(interests) : undefined,
        preferredActivities: preferredActivities !== undefined ? JSON.stringify(preferredActivities) : undefined,
        connectionPreferences: connectionPreferences !== undefined ? JSON.stringify(connectionPreferences) : undefined,
        linkedinUrl: linkedinUrl !== undefined ? (linkedinUrl ? linkedinUrl.trim() : null) : undefined,
        avatarUrl: avatarUrl || undefined,
        hideContactDetails: hideContactDetails !== undefined ? hideContactDetails : undefined,
        discoveryVisible: discoveryVisible !== undefined ? discoveryVisible : undefined,
      },
      create: {
        userId: user.id,
        displayName: displayName || user.displayName,
        bio: bio || "",
        city: city || "",
        gender: gender || "PREFER_NOT_TO_SAY",
        interests: JSON.stringify(interests || []),
        preferredActivities: JSON.stringify(preferredActivities || []),
        connectionPreferences: JSON.stringify(connectionPreferences || {}),
        linkedinUrl: linkedinUrl || null,
        avatarUrl: avatarUrl || null,
        hideContactDetails: true,
        discoveryVisible: true,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("PUT profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
