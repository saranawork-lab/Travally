"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Users,
  Compass,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Search,
} from "lucide-react";
import { formatTimeAgo, formatDate } from "@/lib/utils";

export default function ChatsInboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"ALL" | "ACTIVITY" | "TRAVEL">("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 8000);
    return () => clearInterval(interval);
  }, []);

  const filtered = conversations.filter((c) => {
    if (filterType !== "ALL" && c.type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const title = (c.title || "").toLowerCase();
      const targetTitle = (c.activity?.title || c.travelPlan?.destination || "").toLowerCase();
      return title.includes(q) || targetTitle.includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Private Chats
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          End-to-end private messaging for confirmed companion activities and travel expeditions.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              filterType === "ALL"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            All Conversations ({conversations.length})
          </button>
          <button
            onClick={() => setFilterType("ACTIVITY")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
              filterType === "ACTIVITY"
                ? "bg-teal-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Companion Chats</span>
          </button>
          <button
            onClick={() => setFilterType("TRAVEL")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
              filterType === "TRAVEL"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Travel Chats</span>
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading conversations...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800">
          <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No active conversations
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Private chats are unlocked automatically when an organizer accepts a join request for an activity or travel plan.
          </p>
          <div className="pt-4">
            <Link
              href="/discover"
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-teal-600 shadow-sm"
            >
              Browse Companion Activities
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((conv) => {
            const isActivity = conv.type === "ACTIVITY";
            const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;

            return (
              <Link
                key={conv.id}
                href={`/chats/${conv.id}`}
                className="group flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/50 shadow-sm hover:shadow-md transition-all gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isActivity
                        ? "bg-teal-50 dark:bg-teal-950/60 text-teal-600"
                        : "bg-amber-50 dark:bg-amber-950/60 text-amber-600"
                    }`}
                  >
                    {isActivity ? <Users className="w-6 h-6" /> : <Compass className="w-6 h-6" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-teal-600 transition">
                        {conv.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {isActivity ? "Activity" : "Trip"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {lastMsg
                        ? `${lastMsg.sender?.profile?.displayName || "Member"}: ${lastMsg.content}`
                        : "No messages yet. Say hello to your group!"}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">
                    {lastMsg ? formatTimeAgo(lastMsg.createdAt) : formatTimeAgo(conv.updatedAt)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                    <span>Chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
