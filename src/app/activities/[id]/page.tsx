"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock3,
  XCircle,
  Flag,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { formatDate, isPastCutoff } from "@/lib/utils";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { JoinRequestModal } from "@/components/activities/JoinRequestModal";
import { ReportModal } from "@/components/common/ReportModal";

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [activity, setActivity] = useState<any>(null);
  const [userRequest, setUserRequest] = useState<any>(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchActivity = async () => {
    try {
      const res = await fetch(`/api/activities/${id}`);
      if (res.ok) {
        const data = await res.json();
        setActivity(data.activity);
        setUserRequest(data.userRequest);
        setIsOrganizer(data.isOrganizer);
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

    if (id) fetchActivity();
  }, [id]);

  const handleCancelActivity = async () => {
    if (!confirm("Are you sure you want to cancel this activity? All confirmed participants will be notified.")) return;
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (res.ok) {
        fetchActivity();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelJoinRequest = async () => {
    if (!userRequest) return;
    if (!confirm("Are you sure you want to cancel your join request?")) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/requests/${userRequest.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchActivity();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-xs text-slate-500">
        Loading activity details...
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Activity Not Found</h2>
        <p className="text-xs text-slate-500">This activity may have expired or been removed.</p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>
      </div>
    );
  }

  const isFull = activity.status === "FULL" || activity.currentAcceptedCount >= activity.maxParticipants;
  const isCancelled = activity.status === "CANCELLED";
  const isPast = isPastCutoff(activity.date, activity.startTime, activity.cutoffHoursBeforeStart);
  const spotsLeft = Math.max(0, activity.maxParticipants - activity.currentAcceptedCount);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Back button */}
      <div>
        <Link
          href="/discover?mode=companion"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Activities</span>
        </Link>
      </div>

      {/* Main Activity Card */}
      <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Category & Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            {activity.category.replace("_", " ")}
          </span>

          <div className="flex items-center gap-2">
            {isCancelled && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                Activity Cancelled
              </span>
            )}
            {isPast && !isCancelled && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Cutoff Passed
              </span>
            )}
            <button
              onClick={() => setIsReportOpen(true)}
              className="p-1.5 text-slate-400 hover:text-rose-500 transition"
              title="Report this activity"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {activity.title}
        </h1>

        {/* Organizer Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <Link
            href={`/profile/${activity.organizer.id}`}
            className="flex items-center gap-3 hover:opacity-90 transition min-w-0"
          >
            <img
              src={activity.organizer.profile?.avatarUrl || "https://avatar.vercel.sh/user"}
              alt={activity.organizer.profile?.displayName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500/20"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {activity.organizer.profile?.displayName || "Activity Host"}
                </span>
                <VerificationBadge
                  status={activity.organizer.profile?.verificationStatus || "UNVERIFIED"}
                  isVerified={activity.organizer.profile?.isVerified}
                  hasLinkedin={!!activity.organizer.profile?.linkedinUrl}
                  showLabel
                />
              </div>
              <p className="text-xs text-slate-500 truncate">
                {activity.organizer.profile?.city || "San Francisco"} • Activity Organizer
              </p>
            </div>
          </Link>

          <Link
            href={`/profile/${activity.organizer.id}`}
            className="hidden sm:inline-flex text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            View Profile
          </Link>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            About This Activity
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {activity.description}
          </p>
        </div>

        {/* Structured Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <Calendar className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">Date & Time</span>
              <span className="text-slate-600 dark:text-slate-300">
                {formatDate(activity.date)} at {activity.startTime} ({activity.approxDurationHours} hours)
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">Location & Meeting Point</span>
              <span className="text-slate-600 dark:text-slate-300 block">{activity.locationName}</span>
              {activity.meetingPointVenue && (
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Venue: {activity.meetingPointVenue}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <Users className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">Capacity & Spots</span>
              <span className="text-slate-600 dark:text-slate-300">
                {activity.currentAcceptedCount} of {activity.maxParticipants} joined ({spotsLeft} spots available)
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <Clock3 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">Request Cutoff</span>
              <span className="text-slate-600 dark:text-slate-300">
                Requests close {activity.cutoffHoursBeforeStart} hours before start time
              </span>
            </div>
          </div>
        </div>

        {/* Additional requirements if any */}
        {activity.additionalRequirements && (
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 text-xs space-y-1">
            <span className="font-semibold text-amber-800 dark:text-amber-300 block">
              Organizer's Requirements:
            </span>
            <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
              {activity.additionalRequirements}
            </p>
          </div>
        )}

        {/* Confirmed Participants */}
        {activity.participants && activity.participants.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Confirmed Group ({activity.participants.length})
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              {activity.participants.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/profile/${p.user.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition text-xs"
                >
                  <img
                    src={p.user.profile?.avatarUrl || "https://avatar.vercel.sh/user"}
                    alt={p.user.profile?.displayName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {p.user.profile?.displayName}
                  </span>
                  {p.role === "ORGANIZER" && (
                    <span className="text-[10px] text-teal-600 font-semibold">(Host)</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Button Section */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
            * Travally enables mutual companion discovery. Platform does not book cinema tickets, transportation, or reserve tables.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {isOrganizer ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/requests"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm"
                >
                  Manage Requests
                </Link>
                {!isCancelled && (
                  <button
                    onClick={handleCancelActivity}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 transition"
                  >
                    Cancel Activity
                  </button>
                )}
              </div>
            ) : userRequest ? (
              userRequest.status === "PENDING" ? (
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                    <Clock3 className="w-3.5 h-3.5" /> Request Pending Organizer Approval
                  </span>
                  <button
                    onClick={handleCancelJoinRequest}
                    disabled={isCancelling}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Cancel Request
                  </button>
                </div>
              ) : userRequest.status === "ACCEPTED" ? (
                <Link
                  href="/chats"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Enter Private Activity Chat</span>
                </Link>
              ) : (
                <span className="px-3 py-1.5 rounded-xl text-xs bg-slate-100 text-slate-500">
                  Request {userRequest.status}
                </span>
              )
            ) : isCancelled || isFull || isPast ? (
              <button
                disabled
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              >
                Requests Closed
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!currentUser) {
                    router.push("/login");
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition shadow-md hover:shadow-teal-500/25 hover:scale-105 active:scale-95"
              >
                I'm Interested in Joining
              </button>
            )}
          </div>
        </div>
      </div>

      <JoinRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="ACTIVITY"
        targetId={activity.id}
        title={activity.title}
        organizerName={activity.organizer.profile?.displayName || "Host"}
        onSuccess={() => fetchActivity()}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="ACTIVITY"
        targetId={activity.id}
        targetName={activity.title}
      />
    </div>
  );
}
