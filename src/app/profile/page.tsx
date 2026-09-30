"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  MapPin,
  Lock,
  Globe,
  Linkedin,
  Save,
  CheckCircle,
  Plus,
  X,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { safeJsonParse } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { AvatarBadge } from "@/components/common/AvatarBadge";
import { getBadgeForRank, parseRankFromMembership } from "@/lib/badges";

export default function MyProfilePage() {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("PREFER_NOT_TO_SAY");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [hideContactDetails, setHideContactDetails] = useState(true);
  const [discoveryVisible, setDiscoveryVisible] = useState(true);

  // Interests
  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  // Preferred Activities
  const [preferredActivities, setPreferredActivities] = useState<string[]>([]);

  // Connection Preferences
  const [connPrefs, setConnPrefs] = useState({
    friendship: true,
    activityPartner: true,
    travel: true,
    dating: false,
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        const p = data.user?.profile;
        if (p) {
          setProfile(p);
          setDisplayName(p.displayName || "");
          setBio(p.bio || "");
          setCity(p.city || "");
          setGender(p.gender || "PREFER_NOT_TO_SAY");
          setLinkedinUrl(p.linkedinUrl || "");
          setAvatarUrl(p.avatarUrl || "");
          setHideContactDetails(p.hideContactDetails ?? true);
          setDiscoveryVisible(p.discoveryVisible ?? true);
          setInterests(safeJsonParse<string[]>(p.interests, []));
          setPreferredActivities(safeJsonParse<string[]>(p.preferredActivities, []));
          setConnPrefs(safeJsonParse(p.connectionPreferences, { friendship: true, activityPartner: true, travel: true, dating: false }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const removeInterest = (tag: string) => {
    setInterests(interests.filter((t) => t !== tag));
  };

  const toggleActivityPref = (act: string) => {
    if (preferredActivities.includes(act)) {
      setPreferredActivities(preferredActivities.filter((a) => a !== act));
    } else {
      setPreferredActivities([...preferredActivities, act]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          bio,
          city,
          gender,
          linkedinUrl,
          avatarUrl,
          hideContactDetails,
          discoveryVisible,
          interests,
          preferredActivities,
          connectionPreferences: connPrefs,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert("Failed to save profile changes.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading your profile...</div>;
  }

  const ACTIVITIES_LIST = [
    "Movies",
    "Food and Cafes",
    "Walking",
    "Studying",
    "Events",
    "Shopping",
    "City Exploration",
  ];

  const userRank = currentUser?.joinRank || parseRankFromMembership(profile?.membershipNumber);
  const userBadge = getBadgeForRank(userRank);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Profile & Preferences
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control your public persona, companion preferences, verified badges, and privacy settings.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          <Link
            href="/launch"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-300 dark:border-amber-800/60 transition shadow-xs"
          >
            <span>🚀 Launch Pass</span>
          </Link>
          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800/60 transition shadow-xs"
          >
            <span>View Member Pass &rarr;</span>
          </Link>
          <button
            type="button"
            onClick={async () => {
              await logout();
              window.location.href = "/login";
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-800/60 transition shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card & Avatar */}
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-dark-border p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-dark-border">
            <div className="flex items-center gap-4">
              <AvatarBadge
                src={avatarUrl || currentUser?.avatarUrl}
                name={displayName || currentUser?.displayName}
                rank={userRank}
                badge={userBadge}
                size="lg"
                showCrown={true}
                showRibbon={true}
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                    {displayName || "Your Name"}
                  </h2>
                  {userBadge && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 inline-flex items-center gap-1 shadow-2xs">
                      <span>{userBadge.badgeIcon}</span>
                      <span>{userBadge.title} #{userRank}</span>
                    </span>
                  )}
                  <VerificationBadge
                    status={profile?.verificationStatus || "UNVERIFIED"}
                    isVerified={profile?.isVerified}
                    hasLinkedin={!!linkedinUrl}
                    showLabel
                  />
                </div>
                <p className="text-xs text-slate-500">{city || "City not set"}</p>
              </div>
            </div>

            {/* Verification Status Box */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-dark-elevated border border-slate-200/60 dark:border-dark-border text-xs max-w-xs space-y-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Trust & Verification Status
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {profile?.isVerified
                  ? "Your identity is verified by Travally. Verified badge is displayed on your activities."
                  : profile?.verificationStatus === "PENDING"
                  ? "Identity verification is currently pending manual or provider review."
                  : "Unverified member. You can connect your LinkedIn profile below to enhance trust."}
              </p>
            </div>
          </div>

          {/* Form Fields: Display Name, City, Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Display Name *
              </label>
              <input
                required
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                City / Location
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="NON_BINARY">Non-Binary</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Short Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about what you enjoy doing on weekends, what inspires you, and your favorite travel spots..."
              className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated p-3.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed"
            />
          </div>

          {/* LinkedIn Verification Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
              <span>LinkedIn Profile URL (Optional Verification)</span>
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Interests Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Personal Interests & Passions
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add interest (e.g. Cinema, Architecture, Pour-Over, Hiking)..."
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInterest();
                  }
                }}
                className="flex-1 rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-4 py-2 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-dark-elevated hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {interests.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-800 dark:text-brand-300 text-xs border border-brand-200 dark:border-brand-800"
                >
                  <span>{t}</span>
                  <button type="button" onClick={() => removeInterest(t)} className="hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Activities */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
              Preferred Activities
            </label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES_LIST.map((act) => {
                const isSelected = preferredActivities.includes(act);
                return (
                  <button
                    key={act}
                    type="button"
                    onClick={() => toggleActivityPref(act)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                      isSelected
                        ? "bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 dark:from-emerald-950/80 dark:to-teal-950/70 text-emerald-950 dark:text-emerald-200 border border-emerald-300/80 dark:border-emerald-700 font-bold shadow-xs"
                        : "bg-slate-100 dark:bg-dark-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {act}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Connection Preferences */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-elevated border border-slate-200/80 dark:border-dark-border space-y-3">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
              Connection Intent & Preferences
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Travally is activity-first. We do not force every connection to be romantic, but you can declare what connections you are open to.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={connPrefs.friendship}
                  onChange={(e) => setConnPrefs({ ...connPrefs, friendship: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Friendship</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={connPrefs.activityPartner}
                  onChange={(e) => setConnPrefs({ ...connPrefs, activityPartner: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Activity Partner</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={connPrefs.travel}
                  onChange={(e) => setConnPrefs({ ...connPrefs, travel: e.target.checked })}
                  className="rounded text-travel-600 focus:ring-travel-500"
                />
                <span>Travel Partner</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={connPrefs.dating}
                  onChange={(e) => setConnPrefs({ ...connPrefs, dating: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Open to Dating</span>
              </label>
            </div>
          </div>

          {/* Privacy & Safety Controls */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-elevated border border-slate-200/80 dark:border-dark-border space-y-3">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
              Privacy Settings
            </span>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideContactDetails}
                  onChange={(e) => setHideContactDetails(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Hide exact contact details (email and exact address) from public cards</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={discoveryVisible}
                  onChange={(e) => setDiscoveryVisible(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Make profile discoverable in member directory</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Changes saved successfully!
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-emerald-950 dark:text-emerald-200 bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 dark:from-emerald-950/80 dark:to-teal-950/70 hover:from-emerald-200 hover:to-teal-100 border border-emerald-300/80 dark:border-emerald-800/60 disabled:opacity-60 transition shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
              <span>{saving ? "Saving..." : "Save Profile Changes"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* ── PERSISTENT ACCOUNT SESSION & SIGN OUT ── */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-slate-900 dark:text-white">Active Session</strong>
              <span className="text-[11px] text-slate-500">Signed in as {profile?.displayName || "Travally Member"}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              window.location.href = "/login";
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition min-h-[44px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
