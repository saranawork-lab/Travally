import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export interface CommunityPostItem {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  authorCity?: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isEarlyAccessFounder?: boolean;
}

// Global in-memory storage for community posts on tracking page
let communityPostsStore: CommunityPostItem[] = [
  {
    id: "post-1",
    userId: "user-system-1",
    authorName: "Ananya Sharma",
    authorAvatar: "/default-avatar.png?v=2",
    authorCity: "Mumbai",
    content: "Welcome to Travally Early Access! Super excited to connect with fellow weekend travelers, cafe explorers, and adventure seekers! 🏔️✨",
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    likesCount: 14,
    isEarlyAccessFounder: true,
  },
  {
    id: "post-2",
    userId: "user-system-2",
    authorName: "Rohan Verma",
    authorAvatar: "/default-avatar.png?v=2",
    authorCity: "Bengaluru",
    content: "Hey everyone! Anyone planning road trips or trekking in South India once full activity matching opens up? Let's connect! 🎒🚗",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    likesCount: 9,
    isEarlyAccessFounder: true,
  },
  {
    id: "post-3",
    userId: "user-system-3",
    authorName: "Priya Nair",
    authorAvatar: "/default-avatar.png?v=2",
    authorCity: "Delhi NCR",
    content: "Thrilled to be an Early Access Founding Member on Travally! Looking forward to meeting travel companions for North India trips! ✈️☕",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likesCount: 21,
    isEarlyAccessFounder: true,
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      posts: communityPostsStore,
    });
  } catch (error) {
    console.error("Error fetching community posts:", error);
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Post content cannot be empty" }, { status: 400 });
    }

    const rawAvatar = currentUser?.avatarUrl;
    const authorAvatar = (!rawAvatar || rawAvatar.includes("avatar.vercel.sh"))
      ? "/default-avatar.png?v=2"
      : rawAvatar;

    const authorName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "Explorer";
    const authorCity = currentUser?.city || "Travally Community";

    const newPost: CommunityPostItem = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: currentUser?.id || "guest-user",
      authorName,
      authorAvatar,
      authorCity,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likesCount: 1,
      isEarlyAccessFounder: true,
    };

    // Append new post so latest messages appear at the bottom
    communityPostsStore = [...communityPostsStore, newPost];

    return NextResponse.json({
      success: true,
      post: newPost,
      posts: communityPostsStore,
    });
  } catch (error) {
    console.error("Error creating community post:", error);
    return NextResponse.json({ error: "Failed to publish post" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, content } = body;

    if (!id || !content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Post ID and valid content are required" }, { status: 400 });
    }

    const postIndex = communityPostsStore.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    communityPostsStore[postIndex] = {
      ...communityPostsStore[postIndex],
      content: content.trim(),
    };

    return NextResponse.json({
      success: true,
      post: communityPostsStore[postIndex],
      posts: communityPostsStore,
    });
  } catch (error) {
    console.error("Error updating community post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, action } = body;

    const postIndex = communityPostsStore.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (action === "like") {
      communityPostsStore[postIndex].likesCount += 1;
    } else if (action === "unlike") {
      communityPostsStore[postIndex].likesCount = Math.max(0, communityPostsStore[postIndex].likesCount - 1);
    }

    return NextResponse.json({
      success: true,
      post: communityPostsStore[postIndex],
      posts: communityPostsStore,
    });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    communityPostsStore = communityPostsStore.filter((p) => p.id !== id);

    return NextResponse.json({
      success: true,
      posts: communityPostsStore,
    });
  } catch (error) {
    console.error("Error deleting community post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
