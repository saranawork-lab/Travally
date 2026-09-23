"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Send,
  ArrowLeft,
  Users,
  Compass,
  Shield,
  ShieldAlert,
  Flag,
  UserX,
  MoreVertical,
  CheckCheck,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { ReportModal } from "@/components/common/ReportModal";

export default function ActiveChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params?.id as string;

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Safety actions modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState({ id: "", name: "" });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChatData = async () => {
    try {
      const res = await fetch(`/api/chats/${conversationId}/messages`);
      if (res.status === 403) {
        setAccessDenied(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setConversation(data.conversation);
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});

    if (conversationId) {
      fetchChatData();
      const interval = setInterval(fetchChatData, 3000); // 3s polling for near-real-time messages
      return () => clearInterval(interval);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const content = inputMessage.trim();
    setInputMessage("");
    setSending(true);

    try {
      const res = await fetch(`/api/chats/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to send message");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleBlockUser = async (targetUserId: string, targetName: string) => {
    if (!confirm(`Are you sure you want to block ${targetName}? They will no longer be able to message you or view your activities.`)) return;

    try {
      const res = await fetch("/api/safety/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedId: targetUserId }),
      });
      if (res.ok) {
        alert(`${targetName} has been blocked.`);
        router.push("/chats");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (accessDenied) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Private Chat Restricted
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Access to this conversation is strictly limited to the host and participants whose join request has been accepted.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-5rem)] pb-20 md:pb-6">
      {/* Top Chat Header */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/chats"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="min-w-0">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white truncate">
              {conversation?.title || "Private Group Conversation"}
            </h2>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
              Verified Private Chat • Mutual Members Only
            </p>
          </div>
        </div>

        {/* Safety Actions */}
        <div className="flex items-center gap-2">
          {conversation?.activity && (
            <Link
              href={`/activities/${conversation.activity.id}`}
              className="hidden sm:inline-flex text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              Activity Info
            </Link>
          )}
          {conversation?.travelPlan && (
            <Link
              href={`/travel/${conversation.travelPlan.id}`}
              className="hidden sm:inline-flex text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              Trip Itinerary
            </Link>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-inner">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-600 dark:text-slate-300">Welcome to your private group chat!</p>
            <p>Coordinate meeting points, timing, and travel details with your companions.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            const senderName = msg.sender?.profile?.displayName || "Member";
            const senderAvatar = msg.sender?.profile?.avatarUrl || "https://avatar.vercel.sh/user";

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {!isMe && (
                  <img
                    src={senderAvatar}
                    alt={senderName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                )}

                <div className={`max-w-[78%] sm:max-w-md space-y-1 ${isMe ? "items-end" : "items-start"}`}>
                  {!isMe && (
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {senderName}
                      </span>
                      <button
                        onClick={() => {
                          setReportTarget({ id: msg.senderId, name: senderName });
                          setReportModalOpen(true);
                        }}
                        title="Report user"
                        className="text-slate-300 hover:text-rose-500 text-[10px]"
                      >
                        <Flag className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={() => handleBlockUser(msg.senderId, senderName)}
                        title="Block user"
                        className="text-slate-300 hover:text-rose-500 text-[10px]"
                      >
                        <UserX className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMe
                        ? "bg-teal-600 text-white rounded-tr-none"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  <div className={`flex items-center gap-1 px-1 text-[10px] text-slate-400 ${isMe ? "justify-end" : "justify-start"}`}>
                    <span>{formatTimeAgo(msg.createdAt)}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-teal-600" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Write a message to your companions..."
          className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || sending}
          className="p-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white shadow-md transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="USER"
        targetId={reportTarget.id}
        targetName={reportTarget.name}
      />
    </div>
  );
}
