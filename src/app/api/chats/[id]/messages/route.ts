import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ChatService } from "@/server/services/chatService";

export const dynamic = "force-dynamic";

/**
 * Controller for Chat Messages:
 * GET: Supports full conversation load or split-second delta fetch (?since=<isoDate>).
 * POST: Instant non-blocking message dispatch to database and peer notifications.
 * PATCH: Instant emoji reactions.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = params;
    const since = req.nextUrl.searchParams.get("since");

    const result = await ChatService.getMessages({
      conversationId,
      userId: user.id,
      userRole: user.role,
      since,
    });

    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }

    return NextResponse.json(result);
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

    const result = await ChatService.createMessage({
      conversationId,
      userId: user.id,
      userRole: user.role,
      userDisplayName: user.displayName || user.email.split("@")[0],
      content,
    });

    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }

    return NextResponse.json({ success: true, message: result.message }, { status: 201 });
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

    const result = await ChatService.toggleReaction(
      conversationId,
      messageId,
      user.id,
      emoji
    );

    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("PATCH message reaction error:", error);
    return NextResponse.json({ error: "Failed to toggle reaction" }, { status: 500 });
  }
}
