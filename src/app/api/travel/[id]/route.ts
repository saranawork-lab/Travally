import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser, isValidObjectId } from "@/lib/auth";
import { calculateTravelCompatibility, UserTravelProfile } from "@/lib/scoring";
import { safeJsonParse } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Travel plan not found" }, { status: 404 });
    }
    const currentUser = await getCurrentUser();

    const travelPlan = await db.travelPlan.findUnique({
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

    if (!travelPlan) {
      return NextResponse.json({ error: "Travel plan not found" }, { status: 404 });
    }

    let userTravelProfile: UserTravelProfile = {};
    if (currentUser) {
      const profile = await db.profile.findUnique({
        where: { userId: currentUser.id },
      });
      if (profile) {
        userTravelProfile = {
          departureCity: profile.city || undefined,
          interests: safeJsonParse<string[]>(profile.interests, []),
        };
      }
    }

    const compatibility = calculateTravelCompatibility(userTravelProfile, {
      destination: travelPlan.destination,
      departureCity: travelPlan.departureCity,
      startDate: travelPlan.startDate,
      endDate: travelPlan.endDate,
      travelStyle: travelPlan.travelStyle,
      interests: travelPlan.interests,
      budgetMin: travelPlan.budgetMin,
      budgetMax: travelPlan.budgetMax,
    });

    return NextResponse.json({
      travelPlan: {
        ...travelPlan,
        compatibility,
      },
      userRequest: travelPlan.requests && travelPlan.requests.length > 0 ? travelPlan.requests[0] : null,
      isOrganizer: currentUser?.id === travelPlan.organizerId,
      currentUser: currentUser
        ? {
            id: currentUser.id,
            displayName: currentUser.displayName,
            isVerified: currentUser.isVerified,
          }
        : null,
    });
  } catch (error) {
    console.error("GET travel plan error:", error);
    return NextResponse.json({ error: "Failed to fetch travel plan" }, { status: 500 });
  }
}
