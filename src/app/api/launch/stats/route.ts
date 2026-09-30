import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getBadgeForRank, parseRankFromMembership } from "@/lib/badges";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalUsers = await db.user.count();
    const targetUsers = 1000;
    const remainingSpots = Math.max(0, targetUsers - totalUsers);
    const progressPercentage = Math.min(100, parseFloat(((totalUsers / targetUsers) * 100).toFixed(1)));
    const isUnlocked = totalUsers >= targetUsers || process.env.NEXT_PUBLIC_LAUNCH_UNLOCKED === "true";
    const foundingPioneersRemaining = Math.max(0, 100 - totalUsers);

    // Fetch recent founders in order of creation
    const founders = await db.user.findMany({
      take: 12,
      orderBy: { createdAt: "desc" },
      include: {
        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
            city: true,
            membershipNumber: true,
            membershipTier: true,
          },
        },
      },
    });

    const recentFounders = founders.map((u, i) => {
      const rank = parseRankFromMembership(u.profile?.membershipNumber) || (totalUsers - i);
      const badge = getBadgeForRank(rank);
      return {
        id: u.id,
        displayName: u.profile?.displayName || u.email.split("@")[0],
        avatarUrl: u.profile?.avatarUrl,
        city: u.profile?.city || "India",
        rank,
        badge,
        membershipNumber: u.profile?.membershipNumber || `TRV-${String(rank).padStart(4, "0")}`,
      };
    });

    return NextResponse.json({
      totalUsers,
      targetUsers,
      remainingSpots,
      progressPercentage,
      isUnlocked,
      foundingPioneersRemaining,
      recentFounders,
    });
  } catch (error) {
    console.error("GET launch/stats error:", error);
    return NextResponse.json(
      {
        totalUsers: 10,
        targetUsers: 1000,
        remainingSpots: 990,
        progressPercentage: 1.0,
        isUnlocked: false,
        foundingPioneersRemaining: 90,
        recentFounders: [],
      },
      { status: 200 }
    );
  }
}
