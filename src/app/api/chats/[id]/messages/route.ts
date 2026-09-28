import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { decryptChatMessage } from "@/lib/crypto";
import { getChatRetentionInfo } from "@/lib/chatRetention";

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
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    profile: {
                      select: {
                        displayName: true,
                        avatarUrl: true,
                        bio: true,
                        isVerified: true,
                        verificationStatus: true,
                      },
                    },
                  },
                },
              },
            },
            organizer: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    displayName: true,
                    avatarUrl: true,
                    bio: true,
                    isVerified: true,
                    verificationStatus: true,
                  },
                },
              },
            },
          },
        },
        travelPlan: {
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    profile: {
                      select: {
                        displayName: true,
                        avatarUrl: true,
                        bio: true,
                        isVerified: true,
                        verificationStatus: true,
                      },
                    },
                  },
                },
              },
            },
            organizer: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    displayName: true,
                    avatarUrl: true,
                    bio: true,
                    isVerified: true,
                    verificationStatus: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Check 7-day retention expiry post-event
    const retentionInfo = getChatRetentionInfo(conversation);
    if (retentionInfo.isExpired) {
      // Auto-delete from database
      await db.conversation.delete({ where: { id: conversationId } }).catch(() => {});
      return NextResponse.json(
        {
          error: "This chat room reached its 7-day validity limit following event completion and has been automatically deleted.",
          isExpired: true,
        },
        { status: 410 }
      );
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

    // Automatically mark unread messages as read by current user without blocking response
    const unreadMessagesToUpdate: { id: string; readBy: string }[] = [];
    for (const msg of messages) {
      try {
        const readArray: string[] = JSON.parse(msg.readBy || "[]");
        if (!readArray.includes(user.id)) {
          readArray.push(user.id);
          const updatedJson = JSON.stringify(readArray);
          msg.readBy = updatedJson;
          unreadMessagesToUpdate.push({ id: msg.id, readBy: updatedJson });
        }
      } catch {
        // ignore json parse error
      }
    }

    if (unreadMessagesToUpdate.length > 0) {
      // Execute in background without delaying client response
      Promise.all(
        unreadMessagesToUpdate.map((item) =>
          db.message.update({
            where: { id: item.id },
            data: { readBy: item.readBy },
          }).catch(() => {})
        )
      ).catch(() => {});
    }

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        type: conversation.type,
        activity: conversation.activity,
        travelPlan: conversation.travelPlan,
        retentionInfo,
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
    const body = await req.json();
    const content = body?.content;

    if (!content) {
      return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
    }

    // Stringify content if passed as object (for replies, voice, photos, etc.)
    const serializedContent = typeof content === "object" ? JSON.stringify(content) : content.trim();

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

    // Verify chat retention validity
    const retentionInfo = getChatRetentionInfo(conversation);
    if (retentionInfo.isExpired) {
      await db.conversation.delete({ where: { id: conversationId } }).catch(() => {});
      return NextResponse.json(
        { error: "This conversation reached its 7-day validity limit following event completion and was deleted." },
        { status: 410 }
      );
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
        content: serializedContent,
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

    // Notify other participants with the actual message preview
    const userDisplay = user.displayName || user.email.split("@")[0];
    let previewSnippet = "Shared a message";
    if (typeof content === "object") {
      previewSnippet = content?.text || "Shared an attachment";
    } else if (typeof content === "string") {
      try {
        const decrypted = await decryptChatMessage(content, conversation.id);
        try {
          const parsed = JSON.parse(decrypted);
          previewSnippet = parsed?.text || decrypted;
        } catch {
          previewSnippet = decrypted;
        }
      } catch {
        previewSnippet = content.slice(0, 80);
      }
    }
    for (const p of participants) {
      if (p.userId !== user.id) {
        await db.notification.create({
          data: {
            userId: p.userId,
            type: "NEW_MESSAGE",
            title: `New message in ${conversation.title}`,
            body: `${userDisplay}: ${previewSnippet.slice(0, 100)}`,
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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = params;
    const { messageId, emoji } = await req.json();

    if (!messageId || !emoji) {
      return NextResponse.json({ error: "messageId and emoji are required" }, { status: 400 });
    }

    const message = await db.message.findUnique({
      where: { id: messageId },
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

    if (!message || message.conversationId !== conversationId) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const userName = user.displayName || user.email.split("@")[0];

    let parsedContent: any;
    try {
      parsedContent = JSON.parse(message.content);
      if (typeof parsedContent !== "object" || parsedContent === null) {
        parsedContent = { text: message.content, reactions: {} };
      }
    } catch {
      parsedContent = { text: message.content, reactions: {} };
    }

    if (!parsedContent.reactions) {
      parsedContent.reactions = {};
    }

    const currentReactors: string[] = parsedContent.reactions[emoji] || [];
    if (currentReactors.includes(userName)) {
      // Toggle off
      parsedContent.reactions[emoji] = currentReactors.filter((name: string) => name !== userName);
      if (parsedContent.reactions[emoji].length === 0) {
        delete parsedContent.reactions[emoji];
      }
    } else {
      // Toggle on
      parsedContent.reactions[emoji] = [...currentReactors, userName];
    }

    const updated = await db.message.update({
      where: { id: messageId },
      data: { content: JSON.stringify(parsedContent) },
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

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    console.error("PATCH message reaction error:", error);
    return NextResponse.json({ error: "Failed to toggle reaction" }, { status: 500 });
  }
}
