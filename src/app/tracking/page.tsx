"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Sparkles,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Send,
  MessageSquare,
  Rocket,
  Heart,
  UserCheck,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationPopup } from "@/components/common/NotificationPopup";

interface UserProfile {
  displayName?: string;
  avatarUrl?: string;
  city?: string;
}

interface UserData {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  profile?: UserProfile;
}

interface CommunityPost {
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

export default function TrackingPage() {
  const [loading, setLoading] = useState(true);
  const [actualTotal, setActualTotal] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userNumber, setUserNumber] = useState<number | null>(null);
  const [showRegisteredPopup, setShowRegisteredPopup] = useState(false);

  // Community Posts Feed State
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("registered") === "true") {
        setShowRegisteredPopup(true);
        window.history.replaceState({}, "", "/tracking");
      }
    }

    // Fetch tracking statistics
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/tracking");
        const data = await res.json();
        if (data.success) {
          setActualTotal(data.totalCount);
          if (data.userNumber) {
            setUserNumber(data.userNumber);
          }
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error("Failed to fetch tracking data", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch current user
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch current user", error);
      }
    };

    // Fetch community posts feed
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/tracking/posts");
        const data = await res.json();
        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error("Failed to fetch community posts", error);
      }
    };

    fetchMe();
    fetchUsers();
    fetchPosts();

    // Auto refresh posts and member count every 5 seconds for live community feel
    const interval = setInterval(() => {
      fetchUsers();
      fetchPosts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animate the counter when actualTotal changes
  useEffect(() => {
    if (actualTotal === 0) return;

    let start = 0;
    const duration = 2000;
    const increment = actualTotal / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= actualTotal) {
        setDisplayCount(actualTotal);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [actualTotal]);

  // Submit a new post to the community feed
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const res = await fetch("/api/tracking/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPostContent }),
      });

      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
        setNewPostContent("");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const isLiked = likedPosts[postId];
          return {
            ...p,
            likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1,
          };
        }
        return p;
      })
    );
  };

  const formatTimeAgo = (dateStr: string) => {
    const time = new Date(dateStr).getTime();
    const diff = Math.floor((Date.now() - time) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#000000] overflow-y-auto selection:bg-emerald-100 transition-colors duration-300">
      <NotificationPopup
        show={showRegisteredPopup}
        type="success"
        message="Your account has been created successfully! Welcome to Travally."
        onClose={() => setShowRegisteredPopup(false)}
      />

      {/* Top Navbar Area */}
      <div className="w-full border-b border-slate-100 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="transition hover:opacity-90">
              <Logo size={32} />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Early Access Live
              </span>
            </div>
            <ThemeToggle showLabel={false} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch my-auto">
          
          {/* Left Card: Live Count Box with Early Access / Coming Soon Messaging */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-[#111422] rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] dark:shadow-2xl border border-slate-200 dark:border-slate-800/80 relative overflow-hidden group flex flex-col justify-between h-full">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-emerald-100 via-teal-100 to-amber-100 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-amber-900/20 rounded-full blur-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-xs font-black border border-orange-200 dark:border-orange-800/60 shadow-xs uppercase tracking-wider">
                  <Rocket className="w-3.5 h-3.5" />
                  <span>EARLY ACCESS • COMING SOON</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-black border border-emerald-200 dark:border-emerald-800/60 shadow-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>FOUNDING MEMBER</span>
                </div>
              </div>

              {/* Title & Sentences Explaining Coming Soon Early Access */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Live Community <br /> &amp; Early Access
                </h1>
                
                {/* Coming Soon Explanatory Sentences */}
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    🚀 Full Platform Launching Soon!
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Thank you for joining Travally Early Access. Our AI companion matching, group expedition trips, and verified travel buddy requests are launching soon.
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Your live registration pass secures your priority founding spot!
                  </p>
                </div>
              </div>

              {/* Live Count Counter Box */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                    </div>
                  )}
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-gray-300">
                    Total Registered Early Explorers
                  </span>
                </div>

                <span className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums drop-shadow-sm">
                  {displayCount.toLocaleString()}
                </span>

                <div className="flex items-center justify-center gap-2 mt-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <span>Early Access Member Rank:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">#{userNumber || 365}</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="relative z-10 pt-6 mt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Pass
              </span>
              <span>Pass ID: #{currentUser?.id ? currentUser.id.substring(currentUser.id.length - 6).toUpperCase() : "TRV-01"}</span>
            </div>
          </div>

          {/* Right Card: Single Public Community Post & Broadcast Wall (No calls, No user list) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111422] rounded-[2.5rem] p-6 sm:p-8 text-slate-900 dark:text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] dark:shadow-2xl relative overflow-hidden flex flex-col justify-between h-[600px] border border-slate-200/90 dark:border-slate-800/80">
            
            {/* Header of Public Post Wall (Clean, No user list, No calls) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    Community Early Access Feed
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Public community updates &amp; post wall • Everyone can post
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Feed</span>
              </div>
            </div>

            {/* Scrollable Community Posts Feed Area */}
            <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 custom-scrollbar">
              {posts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                  <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                  <p className="text-xs font-semibold">No community posts yet. Be the first to share an update!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/70 hover:border-emerald-500/30 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-emerald-500/60 overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                          <img
                            src={post.authorAvatar || "/default-avatar.png?v=2"}
                            alt={post.authorName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.endsWith("/default-avatar.png?v=2")) {
                                target.src = "/default-avatar.png?v=2";
                              }
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              {post.authorName}
                            </span>
                            {post.isEarlyAccessFounder && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Early Access
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            {post.authorCity && (
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {post.authorCity}
                              </span>
                            )}
                            <span>•</span>
                            <span>{formatTimeAgo(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post Content Body */}
                    <p className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Post Footer Actions */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition font-bold ${
                          likedPosts[post.id]
                            ? "text-rose-500"
                            : "hover:text-rose-500 text-slate-400"
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            likedPosts[post.id] ? "fill-rose-500 text-rose-500" : ""
                          }`}
                        />
                        <span>{post.likesCount} {post.likesCount === 1 ? "Like" : "Likes"}</span>
                      </button>

                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Public Community Post
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Post Input Box (Everyone logged in can post) */}
            <form onSubmit={handleCreatePost} className="pt-3 border-t border-slate-100 dark:border-slate-800/80 shrink-0 space-y-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={
                    currentUser
                      ? "Write a post to the early access community..."
                      : "Log in to post to the community feed..."
                  }
                  maxLength={300}
                  className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!newPostContent.trim() || isPosting}
                  className="absolute right-2 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:hover:bg-emerald-600 transition shadow-md flex items-center justify-center"
                  title="Publish Post"
                >
                  {isPosting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
                <span>Posts are visible to all registered early access members</span>
                <span>{newPostContent.length}/300</span>
              </div>
            </form>
          </div>

        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `,
        }}
      />
    </div>
  );
}
