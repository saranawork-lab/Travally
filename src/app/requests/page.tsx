"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  Send,
  Check,
  X,
  Clock3,
  CheckCircle,
  XCircle,
  MessageSquare,
  Shield,
  User,
  Users,
  Compass,
  ArrowRight,
} from "lucide-react";
import { formatDate, formatTimeAgo, safeJsonParse } from "@/lib/utils";
import { VerificationBadge } from "@/components/common/VerificationBadge";

export default function RequestsPage() {
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Applicant Profile Modal
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [resReceived, resSent] = await Promise.all([
        fetch("/api/requests?view=received"),
        fetch("/api/requests?view=sent"),
      ]);

      if (resReceived.ok) {
        const dataReceived = await resReceived.json();
        setReceivedRequests(dataReceived.requests || []);
      }
      if (resSent.ok) {
        const dataSent = await resSent.json();
        setSentRequests(dataSent.requests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId: string, action: "ACCEPT" | "DECLINE") => {
    setProcessingId(requestId);
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || `Failed to ${action.toLowerCase()} request`);
      } else {
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to cancel your join request?")) return;
    setProcessingId(requestId);
    try {
      const res = await fetch(`/api/requests/${requestId}`, { method: "DELETE" });
      if (res.ok) fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Request Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review companion applications for your activities and trips, or track your sent requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setTab("received")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition ${
            tab === "received"
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received Requests ({receivedRequests.filter((r) => r.status === "PENDING").length} pending)</span>
        </button>

        <button
          onClick={() => setTab("sent")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition ${
            tab === "sent"
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>My Sent Requests ({sentRequests.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading requests...</div>
      ) : tab === "received" ? (
        /* TAB 1: RECEIVED REQUESTS (ORGANIZER MANAGEMENT) */
        <div className="space-y-4">
          {receivedRequests.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Inbox className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No received join requests yet
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                When people express interest in your activities or travel expeditions, they will appear here for review.
              </p>
            </div>
          ) : (
            receivedRequests.map((req) => {
              const isActivity = req.type === "ACTIVITY";
              const targetTitle = isActivity ? req.activity?.title : req.travelPlan?.destination;
              const targetCapacity = isActivity
                ? `${req.activity?.currentAcceptedCount}/${req.activity?.maxParticipants}`
                : `${req.travelPlan?.currentAcceptedCount}/${req.travelPlan?.groupSizeMax}`;
              const isPending = req.status === "PENDING";
              const interests = safeJsonParse<string[]>(req.applicant?.profile?.interests, []);

              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {/* Applicant Profile */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={req.applicant?.profile?.avatarUrl || "https://avatar.vercel.sh/user"}
                        alt={req.applicant?.profile?.displayName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setSelectedApplicant(req.applicant)}
                            className="font-bold text-sm text-slate-900 dark:text-white hover:text-teal-600 transition text-left"
                          >
                            {req.applicant?.profile?.displayName || "Applicant"}
                          </button>
                          <VerificationBadge
                            status={req.applicant?.profile?.verificationStatus || "UNVERIFIED"}
                            isVerified={req.applicant?.profile?.isVerified}
                            hasLinkedin={!!req.applicant?.profile?.linkedinUrl}
                            size="sm"
                          />
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {req.applicant?.profile?.city || "San Francisco"} • {req.applicant?.profile?.age ? `${req.applicant?.profile?.age} yrs` : ""} • Sent {formatTimeAgo(req.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Target Activity / Trip Badge */}
                    <div className="text-left sm:text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {isActivity ? <Users className="w-3 h-3 text-teal-600" /> : <Compass className="w-3 h-3 text-amber-600" />}
                        <span>{isActivity ? "Companion Activity" : "Travel Plan"}</span>
                      </span>
                      <p className="font-semibold text-xs text-slate-900 dark:text-white mt-1 max-w-xs truncate">
                        {targetTitle}
                      </p>
                      <p className="text-[10px] text-slate-400">Spots filled: {targetCapacity}</p>
                    </div>
                  </div>

                  {/* Introductory Message */}
                  {req.introMessage && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      <p className="italic">"{req.introMessage}"</p>
                    </div>
                  )}

                  {/* Applicant Tags */}
                  {interests.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400">Shared passions:</span>
                      {interests.slice(0, 4).map((i, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[10px] font-medium"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions & Status */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedApplicant(req.applicant)}
                      className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Inspect Full Profile</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleAction(req.id, "DECLINE")}
                            disabled={processingId === req.id}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleAction(req.id, "ACCEPT")}
                            disabled={processingId === req.id}
                            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm"
                          >
                            {processingId === req.id ? "Processing..." : "Accept Companion"}
                          </button>
                        </>
                      ) : req.status === "ACCEPTED" ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle className="w-3.5 h-3.5" /> Accepted
                          </span>
                          <Link
                            href="/chats"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-xl shadow-sm"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Open Chat
                          </Link>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                          <XCircle className="w-3.5 h-3.5" /> {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* TAB 2: SENT REQUESTS */
        <div className="space-y-4">
          {sentRequests.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Send className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                You haven't sent any requests
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Explore activities or travel plans and click "I'm Interested" or "Join Trip".
              </p>
              <div className="pt-4">
                <Link
                  href="/discover"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-teal-600 shadow-sm"
                >
                  Explore Discover Feed
                </Link>
              </div>
            </div>
          ) : (
            sentRequests.map((req) => {
              const isActivity = req.type === "ACTIVITY";
              const target = isActivity ? req.activity : req.travelPlan;
              const organizer = target?.organizer;

              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {isActivity ? "Activity Request" : "Travel Request"}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[10px] text-slate-400">
                        Sent {formatTimeAgo(req.createdAt)}
                      </span>
                    </div>

                    <Link
                      href={isActivity ? `/activities/${target?.id}` : `/travel/${target?.id}`}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-teal-600 transition block"
                    >
                      {isActivity ? target?.title : target?.destination}
                    </Link>

                    <p className="text-xs text-slate-500">
                      Organized by: <strong>{organizer?.profile?.displayName || "Host"}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {req.status === "PENDING" && (
                      <>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 flex items-center gap-1">
                          <Clock3 className="w-3 h-3" /> Pending Review
                        </span>
                        <button
                          onClick={() => handleCancelRequest(req.id)}
                          disabled={processingId === req.id}
                          className="text-xs text-rose-600 hover:underline"
                        >
                          Cancel Request
                        </button>
                      </>
                    )}

                    {req.status === "ACCEPTED" && (
                      <Link
                        href="/chats"
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat Unlocked</span>
                      </Link>
                    )}

                    {req.status === "DECLINED" && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                        Declined
                      </span>
                    )}

                    {req.status === "CANCELLED" && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Applicant Full Profile Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative space-y-4">
            <button
              onClick={() => setSelectedApplicant(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={selectedApplicant.profile?.avatarUrl || "https://avatar.vercel.sh/user"}
                alt={selectedApplicant.profile?.displayName}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-500/20"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedApplicant.profile?.displayName}
                  </h3>
                  <VerificationBadge
                    status={selectedApplicant.profile?.verificationStatus || "UNVERIFIED"}
                    isVerified={selectedApplicant.profile?.isVerified}
                    hasLinkedin={!!selectedApplicant.profile?.linkedinUrl}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {selectedApplicant.profile?.city || "San Francisco"} • {selectedApplicant.profile?.age ? `${selectedApplicant.profile?.age} years old` : ""}
                </p>
              </div>
            </div>

            {selectedApplicant.profile?.bio && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-semibold text-slate-900 dark:text-white block mb-1">Bio</span>
                {selectedApplicant.profile.bio}
              </div>
            )}

            {selectedApplicant.profile?.interests && (
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Passions & Interests
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {safeJsonParse<string[]>(selectedApplicant.profile.interests, []).map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
