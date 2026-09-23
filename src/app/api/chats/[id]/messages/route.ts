import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = params;

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        activity: {
          include: {
            participants: true,
            organizer: {
              select: {
                id: true,
                profile: { select: { displayName: true, avatarUrl: true } },
              },
            },
          },
        },
        travelPlan: {
          include: {
            participants: true,
            organizer: {
              select: {
                id: true,
                profile: { select: { displayName: true, avatarUrl: true } },
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Check membership authorization
    const participants = conversation.activity
      ? conversation.activity.participants
      : conversation.travelPlan?.participants || [];

    const isMember = participants.some((p) => p.userId === user.id);
    if (!isMember && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Only accepted participants can view or send messages in this private chat." },
        { status: 403 }
      );
    }

    const messages = await db.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
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
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        type: conversation.type,
        activity: conversation.activity,
        travelPlan: conversation.travelPlan,
      },
      messages,
    });
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = params;
    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
    }

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        activity: { include: { participants: true } },
        travelPlan: { include: { participants: true } },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Verify membership authorization
    const participants = conversation.activity
      ? conversation.activity.participants
      : conversation.travelPlan?.participants || [];

    const isMember = participants.some((p) => p.userId === user.id);
    if (!isMember && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Only accepted participants can send messages in this chat." },
        { status: 403 }
      );
    }

    const message = await db.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content: content.trim(),
        readBy: JSON.stringify([user.id]),
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
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
    });

    // Update conversation updatedAt
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Notify other participants
    for (const p of participants) {
      if (p.userId !== user.id) {
        await db.notification.create({
          data: {
            userId: p.userId,
            type: "NEW_MESSAGE",
            title: `New message in ${conversation.title}`,
            body: `${user.displayName}: ${content.slice(0, 80)}${content.length > 80 ? "..." : ""}`,
            actionUrl: `/chats/${conversation.id}`,
          },
        });
      }
    }

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    console.error("POST message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
