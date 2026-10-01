"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [loadingList, setLoadingList] = useState(true);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [testEmail, setTestEmail] = useState("");

  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchSubscribers = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/newsletter");
      if (res.ok) {
        const data = await res.json();
        setTotalSubscribers(data.totalSubscribers || 0);
        setSubscribers(data.subscribers || []);
      }
    } catch (err) {
      console.error("Failed to load subscribers", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setStatusFeedback({ type: "error", text: "Please enter both a subject and email body." });
      return;
    }
    if (!testEmail.trim() || !testEmail.includes("@")) {
      setStatusFeedback({ type: "error", text: "Please enter a valid test email address." });
      return;
    }

    setSendingTest(true);
    setStatusFeedback(null);

    try {
      const res = await fetch("/api/newsletter/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          message,
          testEmailOnly: testEmail.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusFeedback({
          type: "success",
          text: `Test email successfully dispatched to ${testEmail}!`,
        });
      } else {
        setStatusFeedback({
          type: "error",
          text: data.error || "Failed to send test email.",
        });
      }
    } catch (err: any) {
      setStatusFeedback({
        type: "error",
        text: err.message || "Failed to connect to broadcast service.",
      });
    } finally {
      setSendingTest(false);
    }
  };

  const handleBroadcastAll = async () => {
    if (!subject.trim() || !message.trim()) {
      setStatusFeedback({ type: "error", text: "Please enter both a subject and email body." });
      return;
    }

    if (totalSubscribers === 0) {
      setStatusFeedback({
        type: "error",
        text: "No active subscribers found in database to broadcast to.",
      });
      return;
    }

    const confirmSend = window.confirm(
      `Are you sure you want to send this email to all ${totalSubscribers} registered subscribers?`
    );
    if (!confirmSend) return;

    setSendingBroadcast(true);
    setStatusFeedback(null);

    try {
      const res = await fetch("/api/newsletter/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusFeedback({
          type: "success",
          text: `🎉 Successfully broadcasted newsletter to ${data.totalSent} subscribers!`,
        });
        setSubject("");
        setMessage("");
      } else {
        setStatusFeedback({
          type: "error",
          text: data.error || "Failed to broadcast newsletter.",
        });
      }
    } catch (err: any) {
      setStatusFeedback({
        type: "error",
        text: err.message || "Broadcast request failed.",
      });
    } finally {
      setSendingBroadcast(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c1410] text-slate-900 dark:text-slate-100 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
              <Link
                href="/admin"
                className="hover:text-emerald-500 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Admin Portal
              </Link>
              <span>/</span>
              <span>Newsletter Broadcast</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Mail className="w-8 h-8 text-emerald-500" />
              Newsletter Broadcast Center
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Deliver updates, community announcements, and trip drops to all your registered subscribers via Resend.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Total Subscribers</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {totalSubscribers}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {statusFeedback && (
          <div
            className={`p-4 rounded-xl flex items-start gap-3 border ${
              statusFeedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200"
                : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200"
            }`}
          >
            {statusFeedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            )}
            <div className="text-sm font-medium">{statusFeedback.text}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Compose Form (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Compose Campaign
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. ✈️ New weekend mountain treks & member meetup spots!"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Message Body
                  </label>
                  <textarea
                    rows={8}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your newsletter message here... Markdown or plain text with paragraphs."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-white/5">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Target: <strong className="text-slate-900 dark:text-white">{totalSubscribers} active subscribers</strong>
                </div>

                <button
                  type="button"
                  onClick={handleBroadcastAll}
                  disabled={sendingBroadcast || totalSubscribers === 0}
                  className="px-6 py-2.5 rounded-full font-bold text-sm text-slate-950 bg-gradient-to-r from-orange-300 via-amber-200 to-emerald-300 hover:from-orange-400 hover:to-emerald-400 shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingBroadcast ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Broadcasting to all...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send to All Subscribers ({totalSubscribers})
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Test Email Box */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Mail className="w-4 h-4 text-emerald-500" />
                Send a Test Copy First
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verify how the formatting looks in your own email inbox before broadcasting to everyone.
              </p>
              <form onSubmit={handleSendTest} className="flex gap-2">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
                />
                <button
                  type="submit"
                  disabled={sendingTest}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                >
                  {sendingTest ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Send Test
                </button>
              </form>
            </div>
          </div>

          {/* Subscribers Sidebar (1 col) */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  Recent Subscribers
                </h3>
                <button
                  onClick={fetchSubscribers}
                  title="Refresh list"
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? "animate-spin" : ""}`} />
                </button>
              </div>

              {loadingList ? (
                <div className="py-8 flex justify-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                </div>
              ) : subscribers.length === 0 ? (
                <div className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                  No subscribers recorded yet. Try entering an email into the footer newsletter form!
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-[400px] overflow-y-auto pr-1">
                  {subscribers.map((s) => (
                    <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {s.email}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {new Date(s.subscribedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Resend Info Card */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Resend Status
              </div>
              <p className="text-[11px] leading-relaxed">
                Add your <strong>RESEND_API_KEY</strong> to your <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">.env</code> file. For testing without a verified domain, Resend allows sending test copies to the email you used to register on Resend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
