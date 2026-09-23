"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  MapPin,
  Linkedin,
  ArrowLeft,
  Flag,
  UserX,
  Compass,
  Users,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { ReportModal } from "@/components/common/ReportModal";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { TripCard } from "@/components/travel/TripCard";
import { safeJsonParse } from "@/lib/utils";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  const handleBlockUser = async () => {
    if (!confirm(`Are you sure you want to block ${user?.profile?.displayName}? You will no longer see each other's content.`)) return;

    try {
      const res = await fetch("/api/safety/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedId: user.id }),
      });
      if (res.ok) {
        alert("User blocked successfully.");
        router.push("/discover");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading member profile...</div>;
  }

  if (!user || !user.profile) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Unavailable</h2>
        <p className="text-xs text-slate-500">This member profile does not exist or has been restricted.</p>
        <Link href="/discover" className="inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600">
          Back to Discover
        </Link>
      </div>
    );
  }

  const p = user.profile;
  const interests: string[] = safeJsonParse(p.interests, []);
  const preferredActivities: string[] = safeJsonParse(p.preferredActivities, []);
  const connPrefs: any = safeJsonParse(p.connectionPreferences, {});

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      <div>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={p.avatarUrl || "https://avatar.vercel.sh/user"}
              alt={p.displayName}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-teal-500/20"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-bold text-xl text-slate-900 dark:text-white">
                  {p.displayName}
                </h1>
                <VerificationBadge
                  status={p.verificationStatus || "UNVERIFIED"}
                  isVerified={p.isVerified}
                  hasLinkedin={!!p.linkedinUrl}
                  showLabel
                />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {p.city || "San Francisco"} • {p.age ? `${p.age} years old` : "Member"}
              </p>
            </div>
          </div>

          {/* Block / Report Controls */}
          {!user.isSelf && (
            <div className="flex items-center gap-2">
              {p.linkedinUrl && (
                <a
                  href={p.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-[#0A66C2] hover:bg-slate-50 flex items-center gap-1"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
              <button
                onClick={() => setReportOpen(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                title="Report user"
              >
                <Flag className="w-4 h-4" />
              </button>
              <button
                onClick={handleBlockUser}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                title="Block user"
              >
                <UserX className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Bio */}
        {p.bio && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">About</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {p.bio}
            </p>
          </div>
        )}

        {/* Passions & Interests */}
        {interests.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Passions & Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Preferred Activities */}
        {preferredActivities.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Preferred Activities</h2>
            <div className="flex flex-wrap gap-2">
              {preferredActivities.map((act, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {act}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Connection Intentions */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">Connection Intent</span>
          <div className="flex flex-wrap gap-3 text-slate-600 dark:text-slate-400">
            {connPrefs.friendship && <span>• Open to friendship</span>}
            {connPrefs.activityPartner && <span>• Seeking activity companions</span>}
            {connPrefs.travel && <span>• Open to travel partnerships</span>}
            {connPrefs.dating && <span>• Open to romantic dating</span>}
          </div>
        </div>
      </div>

      {/* Member's Organized Activities */}
      {user.activities && user.activities.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" />
            <span>Activities Organized by {p.displayName}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.activities.map((act: any) => (
              <ActivityCard
                key={act.id}
                activity={{ ...act, organizer: user }}
                onRefresh={fetchProfile}
              />
            ))}
          </div>
        </div>
      )}

      {/* Member's Travel Plans */}
      {user.travelPlans && user.travelPlans.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Travel Expeditions Hosted by {p.displayName}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.travelPlans.map((trip: any) => (
              <TripCard
                key={trip.id}
                trip={{ ...trip, organizer: user }}
                onRefresh={fetchProfile}
              />
            ))}
          </div>
        </div>
      )}

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="USER"
        targetId={user.id}
        targetName={p.displayName}
      />
    </div>
  );
}
