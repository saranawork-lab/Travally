"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  MapPin,
  ShieldCheck,
  Rocket,
  UserCheck,
  Users,
  Compass,
  User,
  BadgeCheck,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationPopup } from "@/components/common/NotificationPopup";
import { TravelMiniGame } from "@/components/game/TravelMiniGame";

interface UserProfile {
  displayName?: string;
  avatarUrl?: string;
  city?: string;
  linkedinUrl?: string;
}

interface UserData {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  profile?: UserProfile;
}

export default function TrackingPage() {
  const [loading, setLoading] = useState(true);
  const [actualTotal, setActualTotal] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userNumber, setUserNumber] = useState<number | null>(null);
  const [showRegisteredPopup, setShowRegisteredPopup] = useState(false);

  // 3D Card Flip State (false = Profile FRONT, true = Early Access BACK)
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("registered") === "true") {
        setShowRegisteredPopup(true);
        window.history.replaceState({}, "", "/tracking");
      }
    }

    // Fetch tracking statistics
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/tracking");
        const data = await res.json();
        if (data.success) {
          setActualTotal(data.totalCount);
          if (data.userNumber) {
            setUserNumber(data.userNumber);
          }
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error("Failed to fetch tracking data", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch current user session
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch current user", error);
      }
    };

    fetchMe();
    fetchUsers();

    const interval = setInterval(() => {
      fetchUsers();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animate counter
  useEffect(() => {
    if (actualTotal === 0) return;

    let start = 0;
    const duration = 2000;
    const increment = actualTotal / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= actualTotal) {
        setDisplayCount(actualTotal);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [actualTotal]);

  const isLinkedInMember = Boolean(
    currentUser?.linkedinUrl || currentUser?.profile?.linkedinUrl
  );

  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#000000] overflow-y-auto selection:bg-emerald-100 transition-colors duration-300 font-sans antialiased">
      <NotificationPopup
        show={showRegisteredPopup}
        type="success"
        message="Your account has been created successfully! Welcome to Travally."
        onClose={() => setShowRegisteredPopup(false)}
      />

      {/* Top Navbar Area */}
      <div className="w-full border-b border-slate-100 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="transition hover:opacity-90">
              <Logo size={32} />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Early Access Live
              </span>
            </div>
            <ThemeToggle showLabel={false} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-1.5 sm:px-8 py-2 sm:py-8 flex flex-col items-center justify-center min-h-[calc(100vh-70px)]">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-stretch my-auto">

          {/* Left Card: 3D Flip Card Container */}
          <div className="lg:col-span-5 h-[560px] sm:h-[600px] lg:h-[640px] w-full [perspective:1000px]">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`relative w-full h-full cursor-pointer select-none transition-transform duration-700 [transform-style:preserve-3d] ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
              title="Click anywhere to flip card"
            >
              {/* ── FRONT SIDE: Verified User Profile Card ── */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white dark:bg-[#111422] rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 text-slate-900 dark:text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] dark:shadow-2xl border border-slate-200/90 dark:border-slate-800/80 flex flex-col justify-between items-center text-center overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/30 dark:bg-emerald-950/20 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                {/* Top Badge (Verified Profile for LinkedIn members, Member Profile for others) */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  {isLinkedInMember ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Verified Profile</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-xs">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Member Profile</span>
                    </div>
                  )}

                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full">
                    Pass #{userNumber || 365}
                  </div>
                </div>

                {/* Avatar & Member Header */}
                <div className="relative z-10 flex flex-col items-center w-full my-auto">
                  <div className="relative flex items-center justify-center mb-2 sm:mb-4 mt-1 sm:mt-2 w-20 h-20 sm:w-28 sm:h-28 mx-auto">
                    <div className="w-full h-full rounded-full border-[3px] border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.2)] overflow-hidden bg-slate-100 dark:bg-[#151928] flex items-center justify-center z-10 relative">
                      {(() => {
                        const raw = currentUser?.avatarUrl || currentUser?.profile?.avatarUrl;
                        const validSrc = (!raw || raw.includes("avatar.vercel.sh")) ? "/default-avatar.png?v=2" : raw;
                        return (
                          <img
                            src={validSrc}
                            alt="avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.endsWith("/default-avatar.png?v=2")) {
                                target.src = "/default-avatar.png?v=2";
                              }
                            }}
                          />
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 mb-1.5 sm:mb-2 w-full max-w-xs">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-[11px] sm:text-xs tracking-[0.2em] uppercase">
                      <span>{isLinkedInMember ? "Verified Explorer" : "Founding Explorer"}</span>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
                  </div>

                  {/* Member Name + Verified Tick Button for LinkedIn Members */}
                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight flex items-center justify-center gap-1.5">
                    <span>
                      {currentUser?.profile?.displayName || currentUser?.displayName || currentUser?.email?.split("@")[0] || "Explorer"}
                    </span>
                    {isLinkedInMember && (
                      <span
                        className="inline-flex items-center justify-center p-0.5 rounded-full text-emerald-500 fill-emerald-100 dark:fill-emerald-950 shrink-0"
                        title="LinkedIn Verified Member"
                      >
                        <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 fill-emerald-500 text-white dark:fill-emerald-400 dark:text-slate-900 inline-block drop-shadow-xs" />
                      </span>
                    )}
                  </h2>

                  {/* Verification Status & City Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    {isLinkedInMember ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-700 dark:text-emerald-400 font-bold shadow-xs">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Verified Member</span>
                      </span>
                    ) : (
                      <a
                        href="/api/auth/linkedin"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-xs text-[#0A66C2] dark:text-[#388be8] font-bold shadow-xs transition cursor-pointer"
                        title="Connect LinkedIn for verified tick button"
                      >
                        <BadgeCheck className="w-3.5 h-3.5 text-[#0A66C2]" />
                        <span>Get Verified Tick with LinkedIn</span>
                      </a>
                    )}
                    {currentUser?.profile?.city && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-semibold shadow-xs">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {currentUser.profile.city}
                      </span>
                    )}
                  </div>

                  {/* Member Stats Grid */}
                  <div className="grid grid-cols-3 gap-2.5 w-full max-w-sm mb-2">
                    <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1 shadow-xs">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Member Rank</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5">#{userNumber || 365}</span>
                    </div>

                    <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Access</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5">Active</span>
                    </div>

                    <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1 shadow-xs">
                        <Compass className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Travel Pass</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5">Active</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between w-full text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Platform Pass
                  </span>
                  <span>ID #{currentUser?.id ? currentUser.id.substring(currentUser.id.length - 6).toUpperCase() : "TRV-01"}</span>
                </div>
              </div>

              {/* ── BACK SIDE: Live Community & Early Access Card ── */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-slate-50 dark:bg-[#111422] rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] dark:shadow-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-emerald-100 via-teal-100 to-amber-100 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-amber-900/20 rounded-full blur-3xl opacity-60 pointer-events-none" />

                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-xs font-black border border-orange-200 dark:border-orange-800/60 shadow-xs uppercase tracking-wider">
                      <Rocket className="w-3.5 h-3.5" />
                      <span>EARLY ACCESS • COMING SOON</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                      Live Community <br /> &amp; Early Access
                    </h1>

                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        🚀 Full Platform Launching Soon!
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Thank you for joining Travally Early Access. Our AI companion matching, group expedition trips, and verified travel buddy requests are launching soon.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                        </div>
                      )}
                      <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-gray-300">
                        Total Registered Early Explorers
                      </span>
                    </div>

                    <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums drop-shadow-sm">
                      {displayCount.toLocaleString()}
                    </span>

                    <div className="flex items-center justify-center gap-2 mt-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                      <span>Early Access Member Rank:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">#{userNumber || 365}</span>
                    </div>

                    {/* Upcoming Experience Tags (Filling empty space on back of card) */}
                    <div className="pt-3 pb-1 flex flex-col items-center gap-2 w-full">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Upcoming Platform Modes
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-sm">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-[11px] font-bold text-rose-600 dark:text-rose-400 shadow-xs">
                          ❤️ Travel Dating
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shadow-xs">
                          🎒 Solo Buddy Match
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-[11px] font-bold text-amber-700 dark:text-amber-400 shadow-xs">
                          ☕ Cafe &amp; City Walk
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 shadow-xs">
                          🏔️ Weekend Treks
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-900/60 text-[11px] font-bold text-violet-700 dark:text-violet-400 shadow-xs">
                          🎉 Nightlife &amp; Events
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-fuchsia-200/80 dark:border-fuchsia-900/60 text-[11px] font-bold text-fuchsia-700 dark:text-fuchsia-400 shadow-xs">
                          🍸 Pubs n Clubs
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs">
                          ✨ Others
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Pass
                  </span>
                  <span>Pass ID: #{currentUser?.id ? currentUser.id.substring(currentUser.id.length - 6).toUpperCase() : "TRV-01"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Interactive Travel Mini-Game in Place of Chat */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111422] rounded-3xl sm:rounded-[2.5rem] p-2.5 sm:p-6 lg:p-7 text-slate-900 dark:text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] dark:shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[550px] h-auto sm:h-[600px] lg:h-[640px] border border-slate-200/90 dark:border-slate-800/80">
            <TravelMiniGame />
          </div>

        </div>
      </div>
    </div>
  );
}
