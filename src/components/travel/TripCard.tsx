"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Compass,
  MapPin,
  Users,
  Wallet,
  CheckCircle,
  Clock3,
  ArrowRight,
  Flag,
} from "lucide-react";
import { formatDate, formatShortDate, safeJsonParse } from "@/lib/utils";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { CompatibilityBadge } from "@/components/travel/CompatibilityBadge";
import { JoinRequestModal } from "@/components/activities/JoinRequestModal";
import { ReportModal } from "@/components/common/ReportModal";
import { CompatibilityResult } from "@/lib/scoring";

export interface TripCardProps {
  trip: {
    id: string;
    destination: string;
    departureCity: string;
    startDate: string | Date;
    endDate: string | Date;
    budgetMin?: number | null;
    budgetMax?: number | null;
    currency: string;
    travelStyle: string;
    interests: string;
    plannedAttractions?: string | null;
    accommodationPreference: string;
    transportPreference: string;
    groupSizeMax: number;
    currentAcceptedCount: number;
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
    compatibility?: CompatibilityResult;
  };
  currentUser?: any;
  onRefresh?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  currentUser,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const isOrganizer = currentUser?.id === trip.organizer.id;
  const userRequest = trip.requests && trip.requests.length > 0 ? trip.requests[0] : null;
  const isFull = trip.status === "FULL" || trip.currentAcceptedCount >= trip.groupSizeMax;
  const spotsLeft = Math.max(0, trip.groupSizeMax - trip.currentAcceptedCount);

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const interestsList: string[] = safeJsonParse(trip.interests, []);
  const attractionsList: string[] = safeJsonParse(trip.plannedAttractions, []);

  const handleCancelRequest = async () => {
    if (!userRequest) return;
    if (!confirm("Are you sure you want to cancel your trip join request?")) return;

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
          {/* Header: Organizer & Report */}
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <Link
              href={`/profile/${trip.organizer.id}`}
              className="flex items-center gap-2.5 hover:opacity-90 transition min-w-0"
            >
              <img
                src={trip.organizer.profile?.avatarUrl || "https://avatar.vercel.sh/user"}
                alt={trip.organizer.profile?.displayName || "Trip Planner"}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/20 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {trip.organizer.profile?.displayName || "Travel Planner"}
                  </span>
                  <VerificationBadge
                    status={trip.organizer.profile?.verificationStatus || "UNVERIFIED"}
                    isVerified={trip.organizer.profile?.isVerified}
                    hasLinkedin={!!trip.organizer.profile?.linkedinUrl}
                    size="sm"
                  />
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  Departs from {trip.departureCity}
                </p>
              </div>
            </Link>

            <button
              onClick={() => setIsReportOpen(true)}
              title="Report this trip"
              className="text-slate-300 hover:text-rose-500 transition p-1"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Badges: Style + Transparent Compatibility Score */}
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Compass className="w-3 h-3" />
              <span>{trip.travelStyle.replace("_", " ")}</span>
            </span>

            {trip.compatibility && (
              <CompatibilityBadge compatibility={trip.compatibility} />
            )}
          </div>

          {/* Trip Destination */}
          <Link href={`/travel/${trip.id}`}>
            <h3 className="font-bold text-base text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition mb-1">
              {trip.destination}
            </h3>
          </Link>

          {/* Planned Attractions Tags */}
          {attractionsList.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap my-2.5">
              {attractionsList.slice(0, 3).map((item, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                >
                  {item}
                </span>
              ))}
              {attractionsList.length > 3 && (
                <span className="text-[10px] text-slate-400">+{attractionsList.length - 3} more</span>
              )}
            </div>
          )}

          {/* Structured Details: Dates, Budget, Group Size */}
          <div className="space-y-1.5 py-3 border-y border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {formatShortDate(trip.startDate)} – {formatDate(trip.endDate)}
              </span>
              <span className="text-slate-400">•</span>
              <span>{durationDays} days</span>
            </div>

            {trip.budgetMin && trip.budgetMax && (
              <div className="flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  Est. Budget: {trip.currency} ${trip.budgetMin} – ${trip.budgetMax}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] pt-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {trip.currentAcceptedCount} of {trip.groupSizeMax} companions confirmed
                </span>
              </div>
              <span className={`font-medium ${spotsLeft > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-400"}`}>
                {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft > 1 ? "s" : ""} left` : "Full"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex items-center justify-between gap-2 mt-2">
          <Link
            href={`/travel/${trip.id}`}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1"
          >
            <span>Itinerary</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          {isOrganizer ? (
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Trip Organizer
            </span>
          ) : userRequest ? (
            userRequest.status === "PENDING" ? (
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Clock3 className="w-3 h-3" /> Request Sent
                </span>
                <button
                  onClick={handleCancelRequest}
                  disabled={isCancelling}
                  className="text-[11px] text-rose-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : userRequest.status === "ACCEPTED" ? (
              <Link
                href="/chats"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Team Chat
              </Link>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                {userRequest.status}
              </span>
            )
          ) : isFull ? (
            <button
              disabled
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            >
              Trip Full
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition shadow-sm hover:shadow hover:scale-105 active:scale-95"
            >
              Join Trip
            </button>
          )}
        </div>
      </div>

      <JoinRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="TRAVEL"
        targetId={trip.id}
        title={trip.destination}
        organizerName={trip.organizer.profile?.displayName || "Trip Host"}
        onSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="TRAVEL"
        targetId={trip.id}
        targetName={trip.destination}
      />
    </>
  );
};

export default TripCard;
