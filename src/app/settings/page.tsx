"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  ShieldCheck,
  CreditCard,
  User,
  Bell,
  Lock,
  Eye,
  KeyRound,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  LogOut,
  Sparkles,
  ArrowLeft,
  Smartphone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Compass,
  Edit3,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Award,
} from "lucide-react";
import { VirtualMembershipCard } from "@/components/profile/VirtualMembershipCard";
import { AvatarBadge } from "@/components/common/AvatarBadge";
import { getBadgeForRank, parseRankFromMembership } from "@/lib/badges";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const router = useRouter();
  const { logout, currentUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "membership" | "privacy" | "security">("profile");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  // Editable profile state
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [hideContactDetails, setHideContactDetails] = useState(true);
  const [discoveryVisible, setDiscoveryVisible] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          if (data.user.profile) {
            setDisplayName(data.user.profile.displayName || "");
            setCity(data.user.profile.city || "");
            setBio(data.user.profile.bio || "");
            setLinkedinUrl(data.user.profile.linkedinUrl || "");
            setHideContactDetails(data.user.profile.hideContactDetails ?? true);
            setDiscoveryVisible(data.user.profile.discoveryVisible ?? true);
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          city,
          bio,
          linkedinUrl,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePrivacy = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hideContactDetails,
          discoveryVisible,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profile = user?.profile;
  const userRank = user?.joinRank || parseRankFromMembership(profile?.membershipNumber) || 10;
  const userBadge = getBadgeForRank(userRank);

  const parsedInterests = (() => {
    try {
      return JSON.parse(profile?.interests || "[]");
    } catch {
      return [];
    }
  })();

  const parsedActivities = (() => {
    try {
      return JSON.parse(profile?.preferredActivities || "[]");
    } catch {
      return [];
    }
  })();

  const handleCopyPass = () => {
    if (typeof navigator !== "undefined" && profile?.membershipNumber) {
      navigator.clipboard.writeText(profile.membershipNumber);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-28">
      {/* ── TOP BREADCRUMB / TITLE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/launch"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Early Access Gate</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account Settings &amp; Profile Pass
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View your verified contact card, permanent founding badge, and manage your account pass.
          </p>
        </div>

        {/* Quick Member Badge & Mobile-Friendly Sign Out */}
        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${userBadge.pillGradient}`}>
            <span>{userBadge.badgeIcon}</span>
            <span>{userBadge.badgeLabel}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 transition min-h-[36px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-emerald-950/70 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[44px] ${
            activeTab === "profile"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131c18]"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Contact Card Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("membership")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[44px] ${
            activeTab === "membership"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131c18]"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Virtual Membership Pass</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("privacy")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[44px] ${
            activeTab === "privacy"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131c18]"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Privacy &amp; Visibility</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[44px] ${
            activeTab === "security"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131c18]"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security &amp; E2EE</span>
        </button>
      </div>

      {/* ── TAB 1: SMARTPHONE CONTACT CARD VIEW (PROFILE PHOTO FIRST, THEN DATA) ── */}
      {activeTab === "profile" && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Contact Card Container */}
          <div className="rounded-3xl bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 overflow-hidden shadow-lg">
            {/* Top Contact Hero Header */}
            <div className="relative bg-gradient-to-b from-slate-100 to-white dark:from-[#17221c] dark:to-[#111815] p-8 sm:p-10 flex flex-col items-center text-center border-b border-slate-200/80 dark:border-emerald-950/70">
              {/* Profile Photo Comes FIRST with Exclusive Badge Frame */}
              <div className="mb-4">
                <AvatarBadge
                  avatarUrl={profile?.avatarUrl}
                  displayName={profile?.displayName || user?.email}
                  rank={userRank}
                  badge={userBadge}
                  size="2xl"
                  showBanner={true}
                />
              </div>

              {/* Name & Verification Badge */}
              <div className="space-y-1 max-w-md">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                  <span>{profile?.displayName || "Explorer"}</span>
                  <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                </h2>

                {/* Permanent Founding Badge Banner */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-emerald-950/80 border border-slate-200 dark:border-emerald-800/60 mt-1">
                  <span>{userBadge.badgeIcon}</span>
                  <span className={userBadge.textColor}>{userBadge.title || `Verified Member #${userRank}`}</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                  {profile?.city ? `${profile.city}, India` : "India"} • Joined {new Date(profile?.createdAt || user?.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </p>
              </div>

              {/* Contact Action Bar (Like iPhone / Android Contact Card) */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCopyPass}
                  className="flex flex-col items-center justify-center w-20 h-16 rounded-2xl bg-white dark:bg-[#1a2620] border border-slate-200 dark:border-emerald-900/60 shadow-xs hover:border-emerald-500 transition-all text-slate-700 dark:text-slate-200"
                >
                  {copiedPass ? (
                    <Check className="w-4 h-4 text-emerald-500 mb-1" />
                  ) : (
                    <Copy className="w-4 h-4 text-emerald-500 mb-1" />
                  )}
                  <span className="text-[10px] font-bold">{copiedPass ? "Copied" : "Copy Pass"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("membership")}
                  className="flex flex-col items-center justify-center w-20 h-16 rounded-2xl bg-white dark:bg-[#1a2620] border border-slate-200 dark:border-emerald-900/60 shadow-xs hover:border-emerald-500 transition-all text-slate-700 dark:text-slate-200"
                >
                  <CreditCard className="w-4 h-4 text-amber-500 mb-1" />
                  <span className="text-[10px] font-bold">3D Pass</span>
                </button>

                <Link
                  href="/launch"
                  className="flex flex-col items-center justify-center w-20 h-16 rounded-2xl bg-white dark:bg-[#1a2620] border border-slate-200 dark:border-emerald-900/60 shadow-xs hover:border-emerald-500 transition-all text-slate-700 dark:text-slate-200"
                >
                  <Sparkles className="w-4 h-4 text-cyan-500 mb-1" />
                  <span className="text-[10px] font-bold">Milestone</span>
                </Link>
              </div>
            </div>

            {/* Contact Data Details Fields (Organized like Contacts App) */}
            <div className="p-6 sm:p-8 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Contact &amp; Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-950/70 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Registered Email</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {user?.email}
                  </p>
                </div>

                {/* Location */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-950/70 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Current City</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {profile?.city || "Not specified"}
                  </p>
                </div>

                {/* Age & Gender */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-950/70 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Age &amp; Identity</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {profile?.age ? `${profile.age} yrs` : "Age not set"} • {profile?.gender || "Prefer not to say"}
                  </p>
                </div>

                {/* Membership Pass & Rank */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-950/70 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Founding Rank &amp; Pass</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-amber-500">#{userRank}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-xs">{profile?.membershipNumber || `TRV-${String(userRank).padStart(4, "0")}`}</span>
                  </p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-950/70 space-y-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                  Bio / Travel Persona
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  {profile?.bio ? `“${profile.bio}”` : "No bio provided yet. Add one in the quick edit form below!"}
                </p>
              </div>

              {/* Interests & Activity Tags */}
              {parsedInterests.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Interests &amp; Vibes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {parsedInterests.map((interest: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Activities */}
              {parsedActivities.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Preferred Activities
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {parsedActivities.map((act: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Edit Contact Data Card */}
          <div className="rounded-3xl bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-500" />
                <span>Edit Contact Details</span>
              </h3>
              <p className="text-xs text-slate-500">
                Update how your name and details appear across Travally.
              </p>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Contact details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-emerald-950/80 bg-slate-50 dark:bg-[#16201b] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City / Base
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-emerald-950/80 bg-slate-50 dark:bg-[#16201b] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bio / Travel Persona
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio about what activities or treks you love..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-emerald-950/80 bg-slate-50 dark:bg-[#16201b] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  LinkedIn URL (for Verified Companion Badge)
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-emerald-950/80 bg-slate-50 dark:bg-[#16201b] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  Save Contact Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB 2: VIRTUAL MEMBERSHIP PASS ── */}
      {activeTab === "membership" && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-gradient-to-b from-slate-50 to-white dark:from-[#111815] dark:to-[#0d1411] border border-slate-200 dark:border-emerald-950/80 rounded-3xl p-3.5 sm:p-8 md:p-10 shadow-sm space-y-6">
            <div className="text-center max-w-lg mx-auto space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CONFIDENTIAL • CERTIFIED TO YOUR ACCOUNT</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Your Official Virtual Membership Pass
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                This card certifies your permanent founding rank ({userBadge.title || `#${userRank}`}) in the Travally network.
              </p>
            </div>

            {/* The 3D Foil Holographic Virtual Membership Card */}
            <VirtualMembershipCard
              displayName={profile?.displayName || user?.email?.split("@")[0] || "Travally Explorer"}
              avatarUrl={profile?.avatarUrl}
              membershipNumber={profile?.membershipNumber || `TRV-${String(userRank).padStart(4, "0")}`}
              membershipTier={userBadge.tier}
              membershipStatus={profile?.membershipStatus || "ACTIVE"}
              memberSince={profile?.memberSince || profile?.createdAt}
              isVerified={profile?.isVerified}
              city={profile?.city || undefined}
              interests={parsedInterests}
              totalActivities={user?.activitiesOrganized?.length || 0}
              totalTrips={user?.travelPlansOrganized?.length || 0}
            />
          </div>
        </div>
      )}

      {/* ── TAB 3: PRIVACY & DISCOVERY VISIBILITY ── */}
      {activeTab === "privacy" && (
        <div className="bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Privacy &amp; Discovery Visibility
            </h2>
            <p className="text-xs text-slate-500">
              Customize how other explorers find and interact with you on Travally.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <label className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-950/60 cursor-pointer">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Show in Public Discovery Feed
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-relaxed">
                  Allow other verified travelers in your city to view your interests and invite you to activities.
                </span>
              </div>
              <input
                type="checkbox"
                checked={discoveryVisible}
                onChange={(e) => setDiscoveryVisible(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 mt-1 cursor-pointer"
              />
            </label>

            <label className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-950/60 cursor-pointer">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Hide Exact Contact Details
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-relaxed">
                  Only show contact handles after you mutually accept a companion request or activity invite.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hideContactDetails}
                onChange={(e) => setHideContactDetails(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 mt-1 cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSavePrivacy}
              className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Save Privacy Preferences
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 4: SECURITY & E2EE ── */}
      {activeTab === "security" && (
        <div className="bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              End-to-End Encryption &amp; Security
            </h2>
            <p className="text-xs text-slate-500">
              Travally ensures your direct communications and meetup coordinates remain private.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Session Shield Active</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your session is cryptographically signed and stored in a secure HttpOnly cookie. Messages in confirmed companion rooms use WebCrypto end-to-end encryption.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
