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
  Smartphone
} from "lucide-react";
import { VirtualMembershipCard } from "@/components/profile/VirtualMembershipCard";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"membership" | "privacy" | "security">("membership");
  const [savedSuccess, setSavedSuccess] = useState(false);

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
            setHideContactDetails(data.user.profile.hideContactDetails ?? true);
            setDiscoveryVisible(data.user.profile.discoveryVisible ?? true);
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [router]);

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-28">
      {/* ── TOP BREADCRUMB / TITLE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/profile"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Profile</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account Settings &amp; Membership
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your verified virtual membership pass, end-to-end security, and privacy preferences.
          </p>
        </div>

        {/* Quick Member Badge & Mobile-Friendly Sign Out */}
        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Active Member</span>
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
          onClick={() => setActiveTab("membership")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[44px] ${
            activeTab === "membership"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131c18]"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Virtual Membership Card</span>
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

      {/* ── TAB 1: VIRTUAL MEMBERSHIP CARD (EXCLUSIVE IN SETTINGS) ── */}
      {activeTab === "membership" && (
        <div className="space-y-8 animate-fade-in">
          {/* Card Presentation Canvas */}
          <div className="bg-gradient-to-b from-slate-50 to-white dark:from-[#111815] dark:to-[#0d1411] border border-slate-200 dark:border-emerald-950/80 rounded-3xl p-3.5 sm:p-8 md:p-10 shadow-sm space-y-6">
            <div className="text-center max-w-lg mx-auto space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CONFIDENTIAL • PRIVATE TO YOUR ACCOUNT</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Your Official Virtual Membership Pass
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                This card certifies your verified membership in the Travally companion network. Kept private strictly within your Settings page.
              </p>
            </div>

            {/* The 3D Foil Holographic Virtual Membership Card */}
            <VirtualMembershipCard
              displayName={profile?.displayName || user?.email?.split("@")[0] || "Travally Explorer"}
              avatarUrl={profile?.avatarUrl}
              membershipNumber={profile?.membershipNumber || "TRV-894215"}
              membershipTier={profile?.membershipTier || "FOUNDING_EXPLORER"}
              membershipStatus={profile?.membershipStatus || "ACTIVE"}
              memberSince={profile?.memberSince || profile?.createdAt}
              isVerified={profile?.isVerified}
              city={profile?.city || undefined}
              interests={(() => { try { return JSON.parse(profile?.interests || "[]"); } catch { return []; } })()}
              totalActivities={user?.activitiesOrganized?.length || 0}
              totalTrips={user?.travelPlansOrganized?.length || 0}
            />

            {/* Membership Details & Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-emerald-950/60 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-900/40 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Tier Status</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Founding Explorer</p>
                <p className="text-[11px] text-slate-500">Permanent lifetime access to companion match features.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-900/40 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Privacy Guarantee</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Protected &amp; Private</p>
                <p className="text-[11px] text-slate-500">Never rendered publicly on open explorer profile cards.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-900/40 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Network Trust</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Verified Credentials</p>
                <p className="text-[11px] text-slate-500">Unlocks direct host requests and end-to-end encrypted messaging.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: PRIVACY & DISCOVERY VISIBILITY ── */}
      {activeTab === "privacy" && (
        <div className="bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
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
                <span className="text-[11px] text-slate-500 block leading-relaxed">
                  Allow other verified members in your city to see your organized outings and travel plans.
                </span>
              </div>
              <input
                type="checkbox"
                checked={discoveryVisible}
                onChange={(e) => setDiscoveryVisible(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 mt-1 cursor-pointer"
              />
            </label>

            <label className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-950/60 cursor-pointer">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Hide Phone &amp; Contact Details
                </span>
                <span className="text-[11px] text-slate-500 block leading-relaxed">
                  Keeps your direct phone number and contact information protected. Chats take place exclusively through the in-app E2EE messaging platform.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hideContactDetails}
                onChange={(e) => setHideContactDetails(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 mt-1 cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-emerald-950/60">
            {savedSuccess ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle className="w-4 h-4" />
                <span>Preferences saved successfully!</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">Settings update in real time.</span>
            )}

            <button
              type="button"
              onClick={handleSavePrivacy}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition min-h-[44px]"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: SECURITY & END-TO-END ENCRYPTION (E2EE) ── */}
      {activeTab === "security" && (
        <div className="bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Security &amp; End-to-End Encryption Protocol</span>
            </h2>
            <p className="text-xs text-slate-500">
              Travally secures all direct messaging and group chat communications using standard AES-GCM 256-bit encryption.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <strong className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Client-Side Encryption Active
              </strong>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
              Every message payload sent inside event and travel rooms is encrypted in the client’s browser before reaching our databases. Only participants confirmed by the event host hold the decryption key.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60">Algorithm: AES-GCM-256</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60">Derivation: PBKDF2 / SHA-256</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60">Status: Active &amp; Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* ── PERSISTENT ACCOUNT SESSION & SIGN OUT (VISIBLE ON ALL TABS) ── */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-slate-900 dark:text-white">Active Device Session</strong>
              <span className="text-[11px] text-slate-500">Signed in as {user?.email}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition min-h-[44px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
