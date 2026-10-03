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
  UserX,
  EyeOff,
  Slash,
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
    if (typeof window !== "undefined") {
      localStorage.setItem("travally_requests_viewed_at", new Date().toISOString());
      window.dispatchEvent(new Event("travally_badges_updated"));
    }
    fetchRequests();
  }, []);

  const handleAction = async (requestId: string, action: "ACCEPT" | "DECLINE" | "NOT_INTERESTED") => {
    setProcessingId(requestId);
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchRequests();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update request");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestrictUser = async (targetUserId: string, targetName: string, requestId?: string) => {
    if (!confirm(`Restrict ${targetName}? They will not be able to interact with you again.`)) return;
    setProcessingId(requestId || targetUserId);
    try {
      const res = await fetch("/api/safety/restrict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restrictedId: targetUserId }),
      });
      if (res.ok) {
        if (requestId) {
          await handleAction(requestId, "NOT_INTERESTED");
        }
        alert(`${targetName} has been restricted.`);
        fetchRequests();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleBlockUser = async (targetUserId: string, targetName: string, requestId?: string) => {
    if (!confirm(`Block ${targetName}? They will be completely blocked from seeing your posts or contacting you.`)) return;
    setProcessingId(requestId || targetUserId);
    try {
      const res = await fetch("/api/safety/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedId: targetUserId }),
      });
      if (res.ok) {
        if (requestId) {
          await handleAction(requestId, "DECLINE");
        }
        alert(`${targetName} has been blocked.`);
        fetchRequests();
      }
    } catch (e) {
      console.error(e);
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-28 md:pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Request Management
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review companion applications for your activities and trips, or track your sent requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-emerald-950/60 pb-3">
        <button
          onClick={() => setTab("received")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            tab === "received"
              ? "bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 dark:from-emerald-950/80 dark:to-teal-900/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/60 shadow-xs"
              : "bg-slate-100/80 dark:bg-[#16201b] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Inbox className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Received Requests ({receivedRequests.filter((r) => r.status === "PENDING").length} pending)</span>
        </button>

        <button
          onClick={() => setTab("sent")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            tab === "sent"
              ? "bg-gradient-to-r from-orange-100 via-amber-50 to-orange-100 dark:from-orange-950/80 dark:to-amber-900/60 text-orange-900 dark:text-orange-300 border border-orange-300/80 dark:border-orange-700/60 shadow-xs"
              : "bg-slate-100/80 dark:bg-[#16201b] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Send className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span>My Sent Requests ({sentRequests.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 dark:text-slate-500">Loading requests...</div>
      ) : tab === "received" ? (
        /* TAB 1: RECEIVED REQUESTS (ORGANIZER MANAGEMENT) */
        <div className="space-y-4">
          {receivedRequests.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-[#111815] rounded-3xl border border-slate-200 dark:border-emerald-950/70">
              <Inbox className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No received join requests yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
                  className="bg-white dark:bg-[#111815] rounded-3xl border border-slate-200/90 dark:border-emerald-950/70 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {/* Applicant Profile */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-100 dark:from-emerald-950/80 dark:to-teal-900/60 border border-emerald-300/80 dark:border-emerald-700/60 flex items-center justify-center font-black text-sm text-emerald-800 dark:text-emerald-300 shadow-xs shrink-0">
                        {req.applicant?.profile?.displayName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setSelectedApplicant(req.applicant)}
                            className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left"
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
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {req.applicant?.profile?.city || "San Francisco"} • {req.applicant?.profile?.age ? `${req.applicant?.profile?.age} yrs` : ""} • Sent {formatTimeAgo(req.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Target Activity / Trip Badge */}
                    <div className="text-left sm:text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        isActivity
                          ? "bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 text-emerald-800 dark:from-emerald-950/50 dark:to-teal-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/50"
                          : "bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 text-orange-800 dark:from-orange-950/50 dark:to-amber-950/40 dark:text-orange-300 border-orange-200/80 dark:border-orange-800/50"
                      }`}>
                        {isActivity ? <Users className="w-3 h-3 text-emerald-600" /> : <Compass className="w-3 h-3 text-orange-500" />}
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
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16201b] border border-slate-200/60 dark:border-emerald-950/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <p className="italic">&ldquo;{req.introMessage}&rdquo;</p>
                    </div>
                  )}

                  {/* Applicant Tags */}
                  {interests.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400">Shared passions:</span>
                      {interests.slice(0, 4).map((i, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions & Status */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-emerald-950/60">
                    <button
                      onClick={() => setSelectedApplicant(req.applicant)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Inspect Full Profile</span>
                    </button>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleAction(req.id, "NOT_INTERESTED")}
                            disabled={processingId === req.id}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16201b] transition border border-slate-200 dark:border-emerald-950 flex items-center gap-1"
                            title="Politely decline this request as not interested"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Not Interested</span>
                          </button>

                          <button
                            onClick={() => handleRestrictUser(req.applicantId, req.applicant?.profile?.displayName || "Applicant", req.id)}
                            disabled={processingId === req.id}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-orange-800 dark:text-orange-300 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 hover:from-orange-100 hover:to-amber-100 transition border border-orange-200/80 dark:border-orange-800/60 flex items-center gap-1"
                            title="Restrict applicant from future interactions"
                          >
                            <Slash className="w-3.5 h-3.5" />
                            <span>Restrict</span>
                          </button>

                          <button
                            onClick={() => handleBlockUser(req.applicantId, req.applicant?.profile?.displayName || "Applicant", req.id)}
                            disabled={processingId === req.id}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-800 dark:text-rose-300 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 hover:from-rose-100 hover:to-pink-100 transition border border-rose-200/80 dark:border-rose-800/60 flex items-center gap-1"
                            title="Block applicant completely"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Block</span>
                          </button>

                          <button
                            onClick={() => handleAction(req.id, "ACCEPT")}
                            disabled={processingId === req.id}
                            className="px-4 py-1.5 rounded-xl text-xs font-bold text-emerald-900 dark:text-emerald-300 bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 hover:from-emerald-200 hover:to-teal-100 border border-emerald-300/90 dark:border-emerald-700/60 shadow-xs transition"
                          >
                            {processingId === req.id ? "Processing..." : "Accept Companion"}
                          </button>
                        </>
                      ) : req.status === "ACCEPTED" ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Accepted
                          </span>
                          {(() => {
                            const chatId = req.activity?.conversations?.[0]?.id || req.travelPlan?.conversations?.[0]?.id || "";
                            return (
                              <Link
                                href={chatId ? `/chats/${chatId}` : "/chats"}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300 bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 hover:from-emerald-200 hover:to-teal-100 px-3.5 py-1.5 rounded-xl border border-emerald-300/90 dark:border-emerald-700/60 shadow-xs transition hover:scale-105 active:scale-95"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Message {req.applicant?.profile?.displayName?.split(" ")[0] || "Companion"}</span>
                              </Link>
                            );
                          })()}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 dark:bg-[#16201b] px-3 py-1.5 rounded-xl">
                          <XCircle className="w-3.5 h-3.5" /> {req.status === "DECLINED" ? "Declined / Not Interested" : req.status}
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
            <div className="text-center py-16 px-4 bg-white dark:bg-[#111815] rounded-3xl border border-slate-200 dark:border-emerald-950/70">
              <Send className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                You haven&apos;t sent any requests
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Explore activities or travel plans and click &quot;Join Activity&quot; or &quot;Join Expedition&quot;.
              </p>
              <div className="pt-4">
                <Link
                  href="/discover"
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-emerald-900 dark:text-emerald-300 bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 hover:from-emerald-200 hover:to-teal-100 border border-emerald-300/90 dark:border-emerald-700/60 shadow-xs transition"
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
                  className="bg-white dark:bg-[#111815] rounded-3xl border border-slate-200/90 dark:border-emerald-950/70 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
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
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition block"
                    >
                      {isActivity ? target?.title : target?.destination}
                    </Link>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Organized by: <strong>{organizer?.profile?.displayName || "Host"}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {req.status === "PENDING" && (
                      <>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 text-orange-800 dark:from-orange-950/60 dark:to-amber-950/50 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 flex items-center gap-1">
                          <Clock3 className="w-3 h-3 text-orange-600" /> Pending Review
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

                    {req.status === "ACCEPTED" && (() => {
                      const chatId = req.activity?.conversations?.[0]?.id || req.travelPlan?.conversations?.[0]?.id || "";
                      return (
                        <Link
                          href={chatId ? `/chats/${chatId}` : "/chats"}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-900 dark:text-emerald-300 bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 hover:from-emerald-200 hover:to-teal-100 border border-emerald-300/90 dark:border-emerald-700/60 shadow-xs flex items-center gap-1.5 transition hover:scale-105 active:scale-95"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Message Host</span>
                        </Link>
                      );
                    })()}

                    {req.status === "DECLINED" && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#16201b] text-slate-500">
                        Declined
                      </span>
                    )}

                    {req.status === "CANCELLED" && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#16201b] text-slate-500">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="w-full max-w-md bg-white dark:bg-[#111815] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-950/80 p-6 relative space-y-4">
            <button
              onClick={() => setSelectedApplicant(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center font-black text-base text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/25 shrink-0 shadow-sm">
                {selectedApplicant.profile?.displayName?.charAt(0).toUpperCase() || "U"}
              </div>
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
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedApplicant.profile?.city || "San Francisco"} • {selectedApplicant.profile?.age ? `${selectedApplicant.profile?.age} years old` : ""}
                </p>
              </div>
            </div>

            {selectedApplicant.profile?.bio && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16201b] text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Bio</span>
                {selectedApplicant.profile.bio}
              </div>
            )}

            {selectedApplicant.profile?.interests && (
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Passions & Interests
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {safeJsonParse<string[]>(selectedApplicant.profile.interests, []).map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium"
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
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#16201b] hover:bg-slate-200 transition"
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
