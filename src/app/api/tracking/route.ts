import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    let userNumber: number | null = null;

    if (currentUser?.id) {
      try {
        const userDoc = await db.user.findUnique({
          where: { id: currentUser.id },
          select: { createdAt: true }
        });
        if (userDoc?.createdAt) {
          userNumber = await db.user.count({
            where: {
              createdAt: {
                lte: userDoc.createdAt
              }
            }
          });
        }
      } catch (err) {
        console.warn("Could not calculate userNumber:", err);
      }
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
            city: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });

    const totalCount = await db.user.count();

    return NextResponse.json({
      success: true,
      totalCount,
      userNumber,
      users
    });
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
