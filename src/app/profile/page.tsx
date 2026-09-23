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
} from "lucide-react";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { safeJsonParse } from "@/lib/utils";

export default function MyProfilePage() {
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Profile & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Control your public persona, companion preferences, verified badges, and privacy settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card & Avatar */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl || "https://avatar.vercel.sh/user"}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-teal-500/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                    {displayName || "Your Name"}
                  </h2>
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
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs max-w-xs space-y-1">
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
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
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
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
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
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 leading-relaxed"
            />
          </div>

          {/* Avatar URL & LinkedIn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Profile Photo URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span>LinkedIn Profile URL (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
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
                className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-4 py-2 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {interests.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-xs border border-teal-200 dark:border-teal-800"
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
                        ? "bg-teal-600 text-white font-semibold shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {act}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Connection Preferences */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
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
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Friendship</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={connPrefs.activityPartner}
                  onChange={(e) => setConnPrefs({ ...connPrefs, activityPartner: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Activity Partner</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={connPrefs.travel}
                  onChange={(e) => setConnPrefs({ ...connPrefs, travel: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Travel Partner</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={connPrefs.dating}
                  onChange={(e) => setConnPrefs({ ...connPrefs, dating: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Open to Dating</span>
              </label>
            </div>
          </div>

          {/* Privacy & Safety Controls */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
              Privacy Settings
            </span>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideContactDetails}
                  onChange={(e) => setHideContactDetails(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Hide exact contact details (email and exact address) from public cards</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={discoveryVisible}
                  onChange={(e) => setDiscoveryVisible(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
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
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-60 transition shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Profile Changes"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
