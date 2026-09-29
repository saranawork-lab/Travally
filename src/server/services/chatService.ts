import db from "@/lib/db";
import { decryptChatMessage } from "@/lib/crypto";
import { getChatRetentionInfo } from "@/lib/chatRetention";

export interface CreateMessageInput {
  conversationId: string;
  userId: string;
  userRole?: string;
  userDisplayName?: string;
  content: string | object;
}

export interface GetMessagesOptions {
  conversationId: string;
  userId: string;
  userRole?: string;
  since?: string | null;
}

/**
 * Backend ChatService:
 * Core server-side business logic for messaging, real-time delta sync,
 * participant validation, and non-blocking background notification dispatch.
 */
export const ChatService = {
  /**
   * Retrieves messages for a conversation.
   * If `since` is provided, performs an ultra-fast delta fetch (only messages newer than `since`).
   */
  async getMessages({ conversationId, userId, userRole, since }: GetMessagesOptions) {
    // 1. Fast incremental delta check
    if (since) {
      const sinceDate = new Date(since);
      if (!isNaN(sinceDate.getTime())) {
        const deltaMessages = await db.message.findMany({
          where: {
            conversationId,
            createdAt: { gt: sinceDate },
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
          orderBy: { createdAt: "asc" },
        });

        // Background read-status update for incoming messages
        const unreadToUpdate: { id: string; readBy: string }[] = [];
        for (const msg of deltaMessages) {
          try {
            const readArray: string[] = JSON.parse(msg.readBy || "[]");
            if (!readArray.includes(userId)) {
              readArray.push(userId);
              const updatedJson = JSON.stringify(readArray);
              msg.readBy = updatedJson;
              unreadToUpdate.push({ id: msg.id, readBy: updatedJson });
            }
          } catch {
            // ignore JSON error
          }
        }

        if (unreadToUpdate.length > 0) {
          Promise.all(
            unreadToUpdate.map((item) =>
              db.message.update({
                where: { id: item.id },
                data: { readBy: item.readBy },
              }).catch(() => {})
            )
          ).catch(() => {});
        }

        return {
          isDelta: true,
          messages: deltaMessages,
        };
      }
    }

    // 2. Full initial conversation & messages load
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
      return { error: "Conversation not found", status: 404 };
    }

    // Retention check
    const retentionInfo = getChatRetentionInfo(conversation);
    if (retentionInfo.isExpired) {
      await db.conversation.delete({ where: { id: conversationId } }).catch(() => {});
      return { error: "Conversation expired and deleted", status: 410 };
    }

    // Participant membership check
    const participants = conversation.activity
      ? conversation.activity.participants
      : conversation.travelPlan?.participants || [];

    const isMember = participants.some((p) => p.userId === userId);
    if (!isMember && userRole !== "ADMIN") {
      return { error: "Access denied", status: 403 };
    }

    // Load conversation messages
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

    // Mark unread in background
    const unreadMessagesToUpdate: { id: string; readBy: string }[] = [];
    for (const msg of messages) {
      try {
        const readArray: string[] = JSON.parse(msg.readBy || "[]");
        if (!readArray.includes(userId)) {
          readArray.push(userId);
          const updatedJson = JSON.stringify(readArray);
          msg.readBy = updatedJson;
          unreadMessagesToUpdate.push({ id: msg.id, readBy: updatedJson });
        }
      } catch {
        // ignore
      }
    }

    if (unreadMessagesToUpdate.length > 0) {
      Promise.all(
        unreadMessagesToUpdate.map((item) =>
          db.message.update({
            where: { id: item.id },
            data: { readBy: item.readBy },
          }).catch(() => {})
        )
      ).catch(() => {});
    }

    return {
      isDelta: false,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        type: conversation.type,
        activity: conversation.activity,
        travelPlan: conversation.travelPlan,
        retentionInfo,
      },
      messages,
    };
  },

  /**
   * Fast message creation:
   * Saves message to MongoDB Atlas and returns immediately in split seconds.
   * Background notification dispatch and conversation touch occur asynchronously.
   */
  async createMessage({
    conversationId,
    userId,
    userRole,
    userDisplayName,
    content,
  }: CreateMessageInput) {
    if (!content) {
      return { error: "Message content cannot be empty", status: 400 };
    }

    const serializedContent =
      typeof content === "object" ? JSON.stringify(content) : (content as string).trim();

    // Fast conversation lookup with only participant user IDs
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        title: true,
        activity: {
          select: {
            id: true,
            status: true,
            date: true,
            participants: { select: { userId: true } },
          },
        },
        travelPlan: {
          select: {
            id: true,
            status: true,
            endDate: true,
            participants: { select: { userId: true } },
          },
        },
      },
    });

    if (!conversation) {
      return { error: "Conversation not found", status: 404 };
    }

    // Verify retention validity
    const retentionInfo = getChatRetentionInfo(conversation as any);
    if (retentionInfo.isExpired) {
      await db.conversation.delete({ where: { id: conversationId } }).catch(() => {});
      return { error: "Conversation expired and deleted", status: 410 };
    }

    // Membership verification
    const participants = conversation.activity
      ? conversation.activity.participants
      : conversation.travelPlan?.participants || [];

    const isMember = participants.some((p) => p.userId === userId);
    if (!isMember && userRole !== "ADMIN") {
      return { error: "Access denied. Only accepted participants can send messages.", status: 403 };
    }

    // ⚡ Fast DB insert
    const message = await db.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: serializedContent,
        readBy: JSON.stringify([userId]),
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

    // ⚡ Non-blocking background operations (Conversation touch & Participant notifications)
    // Run asynchronously without delaying client HTTP response!
    (async () => {
      try {
        await db.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        }).catch(() => {});

        const otherParticipants = participants.filter((p) => p.userId !== userId);
        if (otherParticipants.length > 0) {
          const senderName = userDisplayName || "Companion";
          let previewSnippet = "Shared a message";

          if (typeof content === "object") {
            previewSnippet = (content as any)?.text || "Shared an attachment";
          } else if (typeof content === "string") {
            try {
              const decrypted = await decryptChatMessage(content, conversationId);
              try {
                const parsed = JSON.parse(decrypted);
                previewSnippet = parsed?.text || decrypted;
              } catch {
                previewSnippet = decrypted;
              }
            } catch {
              previewSnippet = (content as string).slice(0, 80);
            }
          }

          await Promise.all(
            otherParticipants.map((p) =>
              db.notification.create({
                data: {
                  userId: p.userId,
                  type: "NEW_MESSAGE",
                  title: `New message in ${conversation.title}`,
                  body: `${senderName}: ${previewSnippet.slice(0, 100)}`,
                  actionUrl: `/chats/${conversation.id}`,
                },
              }).catch(() => {})
            )
          );
        }
      } catch (bgErr) {
        console.warn("Background notification dispatch warning:", bgErr);
      }
    })();

    return { message, status: 201 };
  },

  /**
   * Toggles message emoji reactions.
   */
  async toggleReaction(conversationId: string, messageId: string, userId: string, emoji: string) {
    const message = await db.message.findUnique({
      where: { id: messageId },
      include: { sender: { include: { profile: true } } },
    });

    if (!message || message.conversationId !== conversationId) {
      return { error: "Message not found in this conversation", status: 404 };
    }

    let parsedContent: any = {};
    let isEncrypted = false;
    let plainText = message.content;

    try {
      if (plainText.startsWith("e2ee:")) {
        isEncrypted = true;
        plainText = await decryptChatMessage(message.content, conversationId);
      }
      parsedContent = JSON.parse(plainText);
    } catch {
      parsedContent = { text: plainText };
    }

    const reactions = parsedContent.reactions || {};
    const userList = reactions[emoji] || [];

    if (userList.includes(userId)) {
      reactions[emoji] = userList.filter((id: string) => id !== userId);
      if (reactions[emoji].length === 0) delete reactions[emoji];
    } else {
      reactions[emoji] = [...userList, userId];
    }

    parsedContent.reactions = reactions;
    let updatedContent = JSON.stringify(parsedContent);

    if (isEncrypted) {
      const { encryptChatMessage } = await import("@/lib/crypto");
      updatedContent = await encryptChatMessage(updatedContent, conversationId);
    }

    const updatedMessage = await db.message.update({
      where: { id: messageId },
      data: { content: updatedContent },
    });

    return { success: true, reactions, updatedMessage };
  },
};

export default ChatService;
