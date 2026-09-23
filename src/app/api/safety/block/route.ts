import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { blockedId } = await req.json();

    if (!blockedId || blockedId === user.id) {
      return NextResponse.json({ error: "Invalid user to block" }, { status: 400 });
    }

    // Upsert block
    const block = await db.block.upsert({
      where: {
        blockerId_blockedId: {
          blockerId: user.id,
          blockedId,
        },
      },
      update: {},
      create: {
        blockerId: user.id,
        blockedId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User blocked successfully. They will not be able to interact with you or see your activities.",
      block,
    });
  } catch (error) {
    console.error("POST block error:", error);
    return NextResponse.json({ error: "Failed to block user" }, { status: 500 });
  }
}
