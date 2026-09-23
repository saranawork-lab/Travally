"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Clock3,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Shield,
  Flag,
} from "lucide-react";
import { formatDate, isPastCutoff } from "@/lib/utils";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { JoinRequestModal } from "@/components/activities/JoinRequestModal";
import { ReportModal } from "@/components/common/ReportModal";

export interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string | Date;
    startTime: string;
    approxDurationHours: number;
    locationName: string;
    meetingPointVenue?: string | null;
    maxParticipants: number;
    currentAcceptedCount: number;
    genderPreference?: string;
    cutoffHoursBeforeStart: number;
    status: string;
    organizer: {
      id: string;
      email: string;
      profile?: {
        displayName: string;
        avatarUrl?: string | null;
        isVerified?: boolean;
        verificationStatus?: string;
        city?: string | null;
        linkedinUrl?: string | null;
      } | null;
    };
    requests?: { id: string; status: string }[];
  };
  currentUser?: any;
  onRefresh?: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  MOVIES: { bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800", text: "text-purple-700 dark:text-purple-300", label: "Movies & Cinema" },
  FOOD_CAFES: { bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800", text: "text-amber-700 dark:text-amber-300", label: "Food & Cafes" },
  WALKING: { bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-300", label: "Walking & Trails" },
  STUDYING: { bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300", label: "Studying & Work" },
  EVENTS: { bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800", text: "text-rose-700 dark:text-rose-300", label: "Events & Shows" },
  SHOPPING: { bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800", text: "text-indigo-700 dark:text-indigo-300", label: "Shopping" },
  CITY_EXPLORATION: { bg: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800", text: "text-teal-700 dark:text-teal-300", label: "City Exploration" },
  OTHER: { bg: "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700", text: "text-slate-700 dark:text-slate-300", label: "Activity" },
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  currentUser,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const categoryInfo = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.OTHER;
  const isPast = isPastCutoff(activity.date, activity.startTime, activity.cutoffHoursBeforeStart);
  const isOrganizer = currentUser?.id === activity.organizer.id;
  const userRequest = activity.requests && activity.requests.length > 0 ? activity.requests[0] : null;

  const isFull = activity.status === "FULL" || activity.currentAcceptedCount >= activity.maxParticipants;
  const isCancelled = activity.status === "CANCELLED";
  const spotsLeft = Math.max(0, activity.maxParticipants - activity.currentAcceptedCount);

  const handleCancelRequest = async () => {
    if (!userRequest) return;
    if (!confirm("Are you sure you want to cancel your join request?")) return;

    setIsCancelling(true);
    try {
      const res = await fetch(`/api/requests/${userRequest.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (onRefresh) onRefresh();
      } else {
        alert("Failed to cancel request");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <div className="group relative bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between">
        <div>
          {/* Header: Organizer photo, name, badges & Report */}
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <Link
              href={`/profile/${activity.organizer.id}`}
              className="flex items-center gap-2.5 hover:opacity-90 transition min-w-0"
            >
              <img
                src={activity.organizer.profile?.avatarUrl || "https://avatar.vercel.sh/user"}
                alt={activity.organizer.profile?.displayName || "Organizer"}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/20 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {activity.organizer.profile?.displayName || "Community Member"}
                  </span>
                  <VerificationBadge
                    status={activity.organizer.profile?.verificationStatus || "UNVERIFIED"}
                    isVerified={activity.organizer.profile?.isVerified}
                    hasLinkedin={!!activity.organizer.profile?.linkedinUrl}
                    size="sm"
                  />
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {activity.organizer.profile?.city || "San Francisco"} • Host
                </p>
              </div>
            </Link>

            <button
              onClick={() => setIsReportOpen(true)}
              title="Report this activity"
              className="text-slate-300 hover:text-rose-500 transition p-1"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category Pill & Status Badge */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${categoryInfo.bg} ${categoryInfo.text}`}
            >
              {categoryInfo.label}
            </span>

            {isCancelled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200 dark:border-rose-900">
                <XCircle className="w-3 h-3" /> Cancelled
              </span>
            )}
            {!isCancelled && isFull && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200">
                Full Capacity
              </span>
            )}
            {!isCancelled && !isFull && isPast && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 border border-amber-200">
                <Clock3 className="w-3 h-3" /> Cutoff Passed
              </span>
            )}
          </div>

          {/* Activity Title */}
          <Link href={`/activities/${activity.id}`}>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-teal-600 dark:hover:text-teal-400 transition mb-2">
              {activity.title}
            </h3>
          </Link>

          {/* Description Preview */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {activity.description}
          </p>

          {/* Structured Details: Date, Time, Location, Capacity */}
          <div className="space-y-1.5 py-3 border-y border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {formatDate(activity.date)}
              </span>
              <span className="text-slate-400">•</span>
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{activity.startTime} ({activity.approxDurationHours}h)</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="truncate">{activity.locationName}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {activity.currentAcceptedCount} of {activity.maxParticipants} joined
                </span>
              </div>
              <span className={`font-medium ${spotsLeft > 0 ? "text-teal-600 dark:text-teal-400" : "text-slate-400"}`}>
                {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft > 1 ? "s" : ""} left` : "Full"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions: Request status / Button / Read more */}
        <div className="pt-4 flex items-center justify-between gap-2 mt-2">
          <Link
            href={`/activities/${activity.id}`}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          {/* Action based on user relation to activity */}
          {isOrganizer ? (
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Host / You
            </span>
          ) : userRequest ? (
            userRequest.status === "PENDING" ? (
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Clock3 className="w-3 h-3" /> Pending
                </span>
                <button
                  onClick={handleCancelRequest}
                  disabled={isCancelling}
                  className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : userRequest.status === "ACCEPTED" ? (
              <Link
                href="/chats"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Chat Open
              </Link>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                {userRequest.status}
              </span>
            )
          ) : isCancelled || isFull || isPast ? (
            <button
              disabled
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            >
              Closed
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm hover:shadow hover:scale-105 active:scale-95"
            >
              I'm Interested
            </button>
          )}
        </div>
      </div>

      <JoinRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="ACTIVITY"
        targetId={activity.id}
        title={activity.title}
        organizerName={activity.organizer.profile?.displayName || "Host"}
        onSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="ACTIVITY"
        targetId={activity.id}
        targetName={activity.title}
      />
    </>
  );
};

export default ActivityCard;
