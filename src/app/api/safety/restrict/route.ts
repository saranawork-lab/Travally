import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { restrictedId } = await req.json();

    if (!restrictedId || restrictedId === user.id) {
      return NextResponse.json({ error: "Invalid user to restrict" }, { status: 400 });
    }

    // Upsert restriction into Block model with type="RESTRICT"
    const record = await (db.block as any).upsert({
      where: {
        blockerId_blockedId: {
          blockerId: user.id,
          blockedId: restrictedId,
        },
      },
      update: {
        type: "RESTRICT",
      },
      create: {
        blockerId: user.id,
        blockedId: restrictedId,
        type: "RESTRICT",
      },
    });

    return NextResponse.json({
      success: true,
      message: "User restricted. Their interactions and notifications are now restricted.",
      record,
    });
  } catch (error) {
    console.error("POST restrict error:", error);
    return NextResponse.json({ error: "Failed to restrict user" }, { status: 500 });
  }
}
