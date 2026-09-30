"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Compass,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Share2,
  Copy,
  Check,
  Crown,
  Zap,
  Award,
  Lock,
  Unlock,
  Settings,
  LogOut,
  MapPin,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { LogoMark } from "@/components/common/Logo";
import { AvatarBadge } from "@/components/common/AvatarBadge";
import { getBadgeForRank, parseRankFromMembership } from "@/lib/badges";
import { useAuth } from "@/context/AuthContext";

export default function EarlyAccessLaunchPage() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 10,
    targetUsers: 1000,
    remainingSpots: 990,
    progressPercentage: 1.0,
    isUnlocked: false,
    foundingPioneersRemaining: 90,
    recentFounders: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/launch/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setStats(data);
        }
      })
      .catch((err) => console.error("Error fetching launch stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const userRank = currentUser?.joinRank || parseRankFromMembership(currentUser?.membershipNumber) || 10;
  const userBadge = getBadgeForRank(userRank);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/register?ref=${currentUser?.membershipNumber || "FOUNDER"}` : "https://travally.app/register";

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* Cinematic Ambient Glow Meshes */}
      <div className="absolute top-0 left-1/4 w-[42rem] h-[42rem] bg-emerald-500/12 rounded-full blur-[140px] pointer-events-none transform-gpu" />
      <div className="absolute top-1/3 right-10 w-[36rem] h-[36rem] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none transform-gpu" />
      <div className="absolute bottom-10 left-10 w-[38rem] h-[38rem] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none transform-gpu" />

      {/* ── TOP HEADER ── */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <LogoMark size={20} />
              </div>
            </div>
            <div>
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                TRAVALLY
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                FOUNDER PHASE
              </span>
            </div>
          </div>

          {/* User Status & Sign Out */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all text-xs font-semibold"
                title="View Profile & Pass"
              >
                <AvatarBadge
                  avatarUrl={currentUser.avatarUrl}
                  displayName={currentUser.displayName}
                  rank={userRank}
                  badge={userBadge}
                  size="sm"
                />
                <span className="hidden sm:inline truncate max-w-[120px]">
                  {currentUser.displayName}
                </span>
                <span className={`text-[10px] font-bold ${userBadge.textColor}`}>
                  #{userRank}
                </span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors text-xs font-medium flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Eyebrow & Headline */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 backdrop-blur-md text-amber-300 text-xs font-bold shadow-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="tracking-wide uppercase text-[10px]">PRE-LAUNCH EARLY ACCESS GATE</span>
            <span className="text-amber-500/40">|</span>
            <span>Target: 1,000 Verified Explorers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            Welcome to the Inner Circle. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Unlocking at 1,000 Members.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Your account is confirmed and saved in our database. To preserve authentic verified companions and zero spam, Travally unlocks all discovery features once our founding community reaches 1,000 members.
          </p>
        </div>

        {/* ── 1,000 MEMBERS MILESTONE PROGRESS CARD ── */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

          {/* Top Row: Count & Remaining */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                COMMUNITY MILESTONE
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white">
                  {stats.totalUsers.toLocaleString()}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-slate-400">
                  / {stats.targetUsers.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-emerald-400 ml-2">
                  ({stats.progressPercentage}% Reached)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                🔥 {stats.remainingSpots} Spots Left to Unlock
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                🎖️ {stats.foundingPioneersRemaining} Top 100 Badges Left
              </div>
            </div>
          </div>

          {/* The Progress Bar Track */}
          <div className="space-y-2">
            <div className="w-full h-4 sm:h-5 rounded-full bg-slate-950/80 border border-slate-800 p-1 relative overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.7)]"
                style={{ width: `${Math.max(2, stats.progressPercentage)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 px-1">
              <span>#1 Genesis Joiner</span>
              <span className="text-amber-400 font-bold">#100 Pioneer Cap</span>
              <span>#500 Halfway</span>
              <span className="text-emerald-400 font-bold">#1000 Worldwide Unlock 🎉</span>
            </div>
          </div>
        </div>

        {/* ── USER'S EXCLUSIVE FOUNDING MEMBER PASS SHOWCASE ── */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-2 border-emerald-500/40 p-6 sm:p-10 shadow-[0_20px_50px_rgba(16,185,129,0.2)] relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Avatar with Exclusive Badge Frame */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-3">
              <AvatarBadge
                avatarUrl={currentUser?.avatarUrl}
                displayName={currentUser?.displayName}
                rank={userRank}
                badge={userBadge}
                size="2xl"
                showBanner={true}
              />

              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                  PERMANENT JOIN RANK
                </span>
                <span className={`text-2xl sm:text-3xl font-black ${userBadge.textColor}`}>
                  #{userRank}
                </span>
              </div>
            </div>

            {/* Right: Badge Details & Perks */}
            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/15">
                  <span>{userBadge.badgeIcon}</span>
                  <span>{userBadge.title || `Verified Member #${userRank}`}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {currentUser?.displayName || "Founding Member"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {userBadge.description} This exclusive badge frame and pass number are permanently tied to your profile across Travally.
                </p>
              </div>

              {/* Quick Card Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Pass Code</span>
                  <span className="text-sm font-black text-white">{currentUser?.membershipNumber || `TRV-${String(userRank).padStart(4, "0")}`}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Badge Status</span>
                  <span className={`text-sm font-black ${userBadge.textColor}`}>
                    {userBadge.hasBadge ? "Permanent" : "Standard"}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Platform Access</span>
                  <span className="text-sm font-black text-amber-300">Unlocks at 1,000</span>
                </div>
              </div>

              {/* Action: View Settings / Pass */}
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>View Contact Profile &amp; Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {currentUser?.role === "ADMIN" && (
                  <Link
                    href="/discover"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 transition-all hover:scale-105"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Admin Mode: Enter /discover</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── SHARE & INVITE TO UNLOCK FASTER ── */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 backdrop-blur-md space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              <span>ACCELERATE THE UNLOCK</span>
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Invite friends to claim the remaining Founding Badges
            </h3>
            <p className="text-xs text-slate-400">
              Only the first 100 members in Travally history receive the permanent Founding Pioneer Badge. Share your invite link to help reach the 1,000 goal faster!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex-1 flex items-center px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono truncate select-all">
              {shareUrl}
            </div>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Join Travally with me! We're building India's solo travel & companion network. Grab one of the first 100 Founding Badges before the 1,000 member milestone unlocks the platform: ${shareUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* ── THE OFFICIAL BADGE TIERS EXPLAINED ── */}
        <div className="space-y-4">
          <div className="text-center max-w-lg mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              EXCLUSIVE REPUTATION
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Permanent Founding Badge Hierarchy
            </h3>
            <p className="text-xs text-slate-400">
              Badges are hardcoded by registration sequence and can never be bought or transferred.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Genesis #1 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-2xl">👑</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500 text-slate-950">
                  Only 1
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">Genesis Explorer #1</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Reserved exclusively for the 1st explorer who initiated the platform.
              </p>
            </div>

            {/* Top 10 Pioneers */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">⚡</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-cyan-500 text-slate-950">
                  Ranks 2–10
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">Top 10 Pioneers</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                The initial 9 founding explorers who joined right after Genesis.
              </p>
            </div>

            {/* Century Founders */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🎖️</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500 text-white">
                  Ranks 11–100
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">Century Pioneers</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Awarded to every member from #11 to #100. Capped at 100 members.
              </p>
            </div>

            {/* Century Milestones */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-orange-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🌟</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-orange-500 text-slate-950">
                  #200, #300... #1000
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">Centurion Milestones</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Granted strictly to the landmark 100th users (#200, #300... up to #1000).
              </p>
            </div>
          </div>
        </div>

        {/* ── LIVE RECENT FOUNDERS STREAM ── */}
        {stats.recentFounders.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300">
                  Recent Founding Explorers
                </h3>
              </div>
              <span className="text-xs text-slate-500">Live Registration Order</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {stats.recentFounders.map((f, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col items-center text-center space-y-2 hover:border-emerald-500/40 transition-colors"
                >
                  <AvatarBadge
                    avatarUrl={f.avatarUrl}
                    displayName={f.displayName}
                    rank={f.rank}
                    badge={f.badge}
                    size="md"
                  />
                  <div className="min-w-0 w-full">
                    <p className="text-xs font-bold text-white truncate">{f.displayName}</p>
                    <p className="text-[10px] text-emerald-400 font-bold">Rank #{f.rank}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
