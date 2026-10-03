"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Users, Sparkles, MapPin, CheckCircle2, User, ShieldCheck, ArrowRight, Award, Crown, Compass, Info } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationPopup } from "@/components/common/NotificationPopup";

interface UserProfile {
  displayName?: string;
  avatarUrl?: string;
  city?: string;
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
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userNumber, setUserNumber] = useState<number | null>(null);
  const [showVipInfo, setShowVipInfo] = useState(false);
  const [showRegisteredPopup, setShowRegisteredPopup] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("registered") === "true") {
        setShowRegisteredPopup(true);
        window.history.replaceState({}, "", "/tracking");
      }
    }
    // Fetch tracking data
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

    // Fetch current user
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
    
    // Auto refresh every 10 seconds to show "live" aspect
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  // Animate the counter when actualTotal changes
  useEffect(() => {
    if (actualTotal === 0) return;
    
    let start = 0;
    const duration = 2000;
    const increment = actualTotal / (duration / 16); // 60fps
    
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

  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#000000] overflow-y-auto selection:bg-indigo-100 transition-colors duration-300">
      <NotificationPopup
        show={showRegisteredPopup}
        type="success"
        message="Your account has been created successfully! Welcome to Travally."
        onClose={() => setShowRegisteredPopup(false)}
      />
      {/* Navbar Area */}
      <div className="w-full border-b border-slate-100 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="transition hover:opacity-90">
              <Logo size={32} />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-gray-900 rounded-full border border-slate-200/60 dark:border-gray-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Systems Online</span>
            </div>
            <ThemeToggle showLabel={false} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Tracking Card - Centered Text */}
          <div className="bg-slate-50 dark:bg-[#111422] rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] dark:shadow-2xl border border-slate-200 dark:border-slate-800/80 relative overflow-hidden group flex flex-col items-center text-center h-full justify-center">
            {/* Subtle background gradient blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10 w-full space-y-8 flex flex-col items-center">
              <div className="space-y-4 flex flex-col items-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold mb-2 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-Time Network</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Live Community <br/> Tracking
                </h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
                  Monitoring the live registration count and active verified members on our platform.
                </p>
              </div>

              <div className="pt-8 w-full border-t border-slate-200 dark:border-slate-800/80 flex flex-col items-center">
                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-4">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                    </div>
                  )}
                  <span className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-gray-300">Total Members</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="text-7xl sm:text-8xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums drop-shadow-sm">
                    {displayCount.toLocaleString()}
                  </span>
                  <span className="text-slate-500 dark:text-gray-500 text-sm font-semibold uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Active Verified Profiles
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Current User Logged In Info Card - Clean Verified Profile */}
          <div className="bg-white dark:bg-[#111422] rounded-[2.5rem] p-8 sm:p-10 text-slate-900 dark:text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] dark:shadow-2xl relative overflow-hidden flex flex-col justify-center items-center text-center h-full group border border-slate-200/90 dark:border-slate-800/80 transition-colors duration-300">
             {/* Subtle ambient glows */}
             <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/30 dark:bg-emerald-950/20 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100/25 dark:bg-teal-950/20 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3 pointer-events-none" />
             
             <div className="relative z-10 flex flex-col items-center w-full my-auto">
               
               {/* Top Verified Member Status */}
               <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-4 shadow-sm">
                 <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                 <span>Verified Community Member</span>
               </div>

               {/* Avatar Container without Badge Overlays */}
               <div className="relative flex items-center justify-center mb-6 mt-1 w-32 h-32 mx-auto">
                 <div className="w-full h-full rounded-full border-[3px] border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.2)] overflow-hidden bg-slate-100 dark:bg-[#151928] flex items-center justify-center z-10 relative">
                   {(() => {
                     const raw = currentUser?.avatarUrl || currentUser?.profile?.avatarUrl;
                     const validSrc = (!raw || raw.includes('avatar.vercel.sh')) ? '/default-avatar.png?v=2' : raw;
                     return (
                       <img 
                         src={validSrc} 
                         alt="avatar" 
                         className="w-full h-full object-cover" 
                         onError={(e) => {
                           const target = e.currentTarget;
                           if (!target.src.endsWith('/default-avatar.png?v=2')) {
                             target.src = '/default-avatar.png?v=2';
                           }
                         }}
                       />
                     );
                   })()}
                 </div>
               </div>

               {/* Verified Explorer Subtitle / Divider */}
               <div className="flex items-center justify-center gap-3 mb-3 w-full max-w-xs">
                 <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
                 <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-xs tracking-[0.2em] uppercase">
                   <span>Verified Explorer</span>
                 </div>
                 <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
               </div>

               {/* User Name */}
               <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                 {currentUser?.profile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || "Ananya Sharma"}
               </h2>

               {/* Member Pill Info */}
               <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-700 dark:text-emerald-400 font-bold shadow-sm">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   Verified Member
                 </span>
                 {currentUser?.profile?.city && (
                   <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-semibold shadow-sm">
                     <MapPin className="w-3 h-3 text-slate-500" />
                     {currentUser.profile.city}
                   </span>
                 )}
               </div>

               {/* Member Stats Grid */}
               <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-6">
                 <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 flex flex-col items-center">
                   <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5 shadow-sm">
                     <Users className="w-3.5 h-3.5" />
                   </div>
                   <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Member Rank</span>
                   <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5">#{userNumber || 365}</span>
                 </div>

                 <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 flex flex-col items-center">
                   <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5 shadow-sm">
                     <ShieldCheck className="w-3.5 h-3.5" />
                   </div>
                   <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Access</span>
                   <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5">Active</span>
                 </div>

                 <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 flex flex-col items-center">
                   <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1.5 shadow-sm">
                     <Compass className="w-3.5 h-3.5" />
                   </div>
                   <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Travel Pass</span>
                   <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5">Active</span>
                 </div>
               </div>

               {/* Subtle ID footer */}
               <span className="text-[11px] text-slate-400 dark:text-gray-500 font-medium mt-4">
                 Verified Platform Pass • ID #{currentUser?.id ? currentUser.id.substring(currentUser.id.length - 6).toUpperCase() : "TRV-01"}
               </span>
               
             </div>
          </div>
          
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}} />
    </div>
  );
}
