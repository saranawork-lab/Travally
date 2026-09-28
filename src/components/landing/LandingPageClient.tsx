"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Users,
  Compass,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Star,
  Lock,
  BadgeCheck,
  ChevronRight,
  Film,
  Coffee,
  Globe,
  Mountain,
  Clock,
  Wallet,
  CheckCircle2,
  Tag,
  ShieldAlert,
  SlidersHorizontal,
  Flame,
  UserCheck,
  Clock3,
  HeartHandshake
} from "lucide-react";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { TripCard } from "@/components/travel/TripCard";
import type { Activity } from "@/types";

/**
 * Smooth GPU-stable hook that keeps layout stable and prevents scroll hitching
 */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  return { ref, isVisible: true };
}

// ── Realistic Showcase Data for Companion Activity Card ──
const SHOWCASE_COMPANION_ACTIVITY: Activity = {
  id: "showcase-activity-cinema",
  title: "Suchitra Film Society Screening & Filter Coffee",
  description: "Watching an indie 35mm film showcase, followed by artisanal South Indian filter coffee and casual conversation in Indiranagar.",
  category: "MOVIES",
  date: new Date(Date.now() + 86400000 * 2), // 2 days from now
  startTime: "17:00",
  approxDurationHours: 3.0,
  locationName: "Indiranagar, Bengaluru",
  meetingPointVenue: "Suchitra Film Society, BSK 2nd Stage, Bengaluru",
  maxParticipants: 2,
  currentAcceptedCount: 1,
  genderPreference: "ANY",
  cutoffHoursBeforeStart: 2,
  status: "OPEN",
  imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
  organizer: {
    id: "org-ananya",
    email: "ananya.sharma@example.com",
    profile: {
      displayName: "Ananya Sharma",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      bio: "Cinephile & architecture researcher. Loves 70s world cinema, filter coffee, and indie screenings.",
      isVerified: true,
      verificationStatus: "VERIFIED",
      city: "Bengaluru",
      linkedinUrl: "https://linkedin.com/in/ananya-sharma",
    },
  },
  requests: [],
};

// ── Realistic Showcase Data for Travel Plan Card ──
const SHOWCASE_TRAVEL_TRIP: any = {
  id: "showcase-trip-kasol",
  destination: "Kasol & Tosh: Parvati Valley Trek",
  departureCity: "New Delhi / Chandigarh",
  startDate: new Date(Date.now() + 86400000 * 14),
  endDate: new Date(Date.now() + 86400000 * 20),
  budgetMin: 8500,
  budgetMax: 14500,
  currency: "INR",
  travelStyle: "ADVENTURE",
  interests: JSON.stringify(["Trekking", "Pine Forests", "Hot Springs", "Stargazing", "Cozy Hostels"]),
  plannedAttractions: JSON.stringify(["Chalal Pine Forest Trail", "Manikaran Natural Hot Springs", "Tosh Glacier Viewpoint", "Riverside Camping"]),
  description: "6-day Himalayan scouting through Kasol, Chalal, and Tosh. Splitting shared cabs from Chandigarh, staying at riverside backpacker hostels.",
  accommodationPreference: "HOSTEL",
  transportPreference: "ROAD_TRIP",
  groupSizeMax: 3,
  currentAcceptedCount: 1,
  status: "OPEN",
  imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
  organizer: {
    id: "org-priya",
    email: "priya.iyer@example.com",
    profile: {
      displayName: "Priya Iyer",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      isVerified: true,
      verificationStatus: "VERIFIED",
      city: "Bengaluru",
      linkedinUrl: "https://linkedin.com/in/priya-iyer",
    },
  },
  requests: [],
  compatibility: {
    overallScore: 94,
    level: "HIGH" as const,
    factors: {
      travelStyle: 95,
      budget: 92,
      interests: 96,
      pace: 93,
    },
    commonInterests: ["Trekking", "Café Hopping", "Stargazing"],
  },
};

export function LandingPageClient() {
  const [activeCityTab, setActiveCityTab] = useState<string>("all");

  // Scroll reveal hooks for sections
  const companionReveal = useScrollReveal();
  const travelReveal = useScrollReveal();
  const howItWorksReveal = useScrollReveal();
  const destinationsReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();
  const safetyReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  const INDIAN_HUBS = [
    { id: "all", name: "All India" },
    { id: "bengaluru", name: "Bengaluru" },
    { id: "mumbai", name: "Mumbai" },
    { id: "delhi", name: "Delhi-NCR" },
    { id: "himachal", name: "Himachal" },
    { id: "meghalaya", name: "Meghalaya" },
    { id: "karnataka", name: "Gokarna & Hampi" },
  ];

  const TESTIMONIALS = [
    {
      name: "Rhea Deshmukh",
      city: "Bengaluru",
      role: "Cinema & Coffee Explorer",
      quote: "None of my colleagues wanted to catch an indie screening on a Sunday evening. I posted a 2-person plan on Travally, and had filter coffee with two wonderful women who love film just as much as I do. Zero awkwardness, purely good conversation.",
      badge: "Verified Member",
      type: "City Companion",
    },
    {
      name: "Arjun Nair",
      city: "Mumbai",
      role: "Himalayan Backpacker",
      quote: "Planning a 6-day Kasol and Tosh trip solo felt overwhelming. Finding Priya and Kabir on Travally saved us money on shared cabs and boutique stays, but more importantly, we became real friends who still hike together.",
      badge: "Govt ID Verified",
      type: "Travel Expedition",
    },
    {
      name: "Simran Kaur",
      city: "New Delhi",
      role: "Heritage Photographer",
      quote: "As a woman who loves early morning street photography, safety is everything. Travally's mutual acceptance rule means nobody can message you without your permission. I’ve done 4 photo walks in Delhi and felt completely secure.",
      badge: "Verified Host",
      type: "City Companion",
    },
  ];

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#090d0b] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans overflow-x-clip">
      {/* ── Rich Saturated Atmospheric Background Gradient Meshes ── */}
      <div className="absolute top-0 left-1/4 w-96 sm:w-[38rem] h-96 sm:h-[38rem] bg-gradient-to-tr from-emerald-500/28 via-teal-500/22 to-emerald-400/18 rounded-full blur-[110px] pointer-events-none transform-gpu" />
      <div className="absolute top-1/3 right-4 w-80 sm:w-[34rem] h-80 sm:h-[34rem] bg-gradient-to-bl from-orange-500/28 via-amber-500/22 to-rose-500/18 rounded-full blur-[110px] pointer-events-none transform-gpu" />
      <div className="absolute top-2/3 left-4 w-80 sm:w-[36rem] h-80 sm:h-[36rem] bg-gradient-to-tr from-emerald-500/20 via-teal-500/16 to-emerald-400/12 rounded-full blur-[120px] pointer-events-none transform-gpu" />

      {/* ── 1. HERO SECTION WITH INVITING HUMAN COPY & VIBRANT GRADIENTS ── */}
      <section className="relative pt-10 pb-12 md:pt-18 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Eyebrow Pill */}
          <div className="animate-fade-in-up animation-delay-100">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/50 dark:border-emerald-600/60 bg-gradient-to-r from-emerald-500/15 via-teal-500/12 to-orange-500/15 text-emerald-950 dark:text-emerald-200 text-xs font-bold backdrop-blur-md shadow-md shadow-emerald-500/10">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent font-black tracking-wider">
                TRAVALLY
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span>Find Trusted Companions for Weekend Outings &amp; Indian Travel</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="animate-fade-in-up animation-delay-200 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-slate-900 dark:text-white">
            Meet good people. Share real experiences.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-orange-500 dark:from-emerald-400 dark:via-teal-300 dark:to-orange-400 drop-shadow-xs">
              Never miss an outing again.
            </span>
          </h1>

          {/* Natural, Human-Centric Subtitle */}
          <p className="animate-fade-in-up animation-delay-300 text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            We all have moments when we want to try a new café, catch an indie film, or pack a bag for the mountains — but friends are busy, working, or in different life stages. Travally connects you with verified, friendly people who share your vibe, your timing, and your travel budget.
          </p>

          {/* High-Converting CTA Buttons with Rich Saturated Gradients */}
          <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="group w-full sm:w-auto min-h-[50px] px-8 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/35 hover:shadow-emerald-600/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Users className="w-4 h-4" />
              <span>Find a Companion Nearby</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>

            <Link
              href="/register"
              className="group w-full sm:w-auto min-h-[50px] px-8 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/35 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-4 h-4" />
              <span>Plan an Upcoming Trip</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          {/* Social Proof Metric Bar */}
          <div className="animate-fade-in-up animation-delay-500 pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[
                  { letter: "R", bg: "bg-emerald-600" },
                  { letter: "A", bg: "bg-orange-500" },
                  { letter: "P", bg: "bg-teal-600" },
                  { letter: "S", bg: "bg-emerald-700" }
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full border-2 border-white dark:border-[#090d0b] flex items-center justify-center text-[10px] font-black text-white ${item.bg} shadow-sm`}
                  >
                    {item.letter}
                  </div>
                ))}
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">15,000+ Verified Members</span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-current" />
              ))}
              <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1">4.9/5 Meetup Rating</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Mutual Approval &amp; Zero Spam</span>
            </div>
          </div>
        </div>

        {/* City Destinations Filter Strip */}
        <div className="mt-10 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {INDIAN_HUBS.map((hub) => (
            <button
              key={hub.id}
              onClick={() => setActiveCityTab(hub.id)}
              className={`min-h-[44px] px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap active:scale-95 ${
                activeCityTab === hub.id
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                  : "bg-slate-100 dark:bg-[#131c18] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {hub.name}
            </button>
          ))}
        </div>
      </section>

      {/* ── 2. SECTION A: COMPANION MODE SHOWCASE (CARD ON LEFT, DETAILS ON RIGHT) ── */}
      <section
        ref={companionReveal.ref}
        className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/70 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu relative ${
          companionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Saturated Emerald Glow Backdrop */}
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-gradient-to-tr from-emerald-500/30 via-teal-500/22 to-transparent rounded-full blur-[110px] pointer-events-none transform-gpu" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT COLUMN: Real Activity Card Showcase (Half of screen) */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-br from-emerald-500/18 via-teal-500/12 to-emerald-500/5 dark:from-emerald-950/80 dark:via-teal-950/50 dark:to-[#08120e] border-2 border-emerald-500/40 dark:border-emerald-500/50 shadow-[0_16px_50px_rgba(16,185,129,0.24)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_20px_60px_rgba(16,185,129,0.32)]">
              {/* Card Label Tag */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm">
                  <Film className="w-3 h-3" />
                  <span>COMPANION ACTIVITY CARD</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" /> Live App Preview
                </span>
              </div>

              {/* The Real ActivityCard Component */}
              <div className="overflow-hidden rounded-2xl shadow-sm">
                <ActivityCard activity={SHOWCASE_COMPANION_ACTIVITY} />
              </div>

              {/* Detail Callout Badges Highlighting Card Elements */}
              <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/60 grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 dark:bg-[#131e18]/80 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">Verified Host ID</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 dark:bg-[#131e18]/80 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">Public Meetup Venue</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 dark:bg-[#131e18]/80 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs">
                  <Clock3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">2-Hour Cutoff Gate</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 dark:bg-[#131e18]/80 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs">
                  <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">1 Spot Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Narrative & Details Explanation (Half of screen) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-md shadow-emerald-600/30 uppercase tracking-wider">
              <Film className="w-3.5 h-3.5" />
              <span>COMPANION MODE • CITY ACTIVITIES</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              Discover verified partners for{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 bg-clip-text text-transparent">
                movies, cafes, and everyday urban outings.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Companion Mode gives you a structured, reassuring card interface for discovering weekend activities happening in your city. Every detail is established up front:
            </p>

            {/* Feature Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#131c18] border border-emerald-200 dark:border-emerald-950/80 shadow-xs hover:border-emerald-500/60 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold mb-2.5">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                  1. Verified Host Identity
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  The card displays the host’s verified credentials (Govt ID or LinkedIn badge) so you know exactly who you are joining.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#131c18] border border-emerald-200 dark:border-emerald-950/80 shadow-xs hover:border-emerald-500/60 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold mb-2.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                  2. Public Meeting Venues
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every activity designates a safe public spot (such as Suchitra Film Society or Indiranagar cafes) before meetups occur.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#131c18] border border-emerald-200 dark:border-emerald-950/80 shadow-xs hover:border-emerald-500/60 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold mb-2.5">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                  3. Strict Spots Left Pill
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Clear spot indicators (e.g. &ldquo;1 spot left&rdquo;) ensure meetups remain intimate (1-on-1 or 2–3 travelers max) without chaotic groups.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#131c18] border border-emerald-200 dark:border-emerald-950/80 shadow-xs hover:border-emerald-500/60 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold mb-2.5">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                  4. Mutual Approval Chat Gate
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Direct group messaging unlocks only when the host reviews and accepts your request. Zero unsolicited messages.
                </p>
              </div>
            </div>

            {/* Saturated CTA Button */}
            <div className="pt-2">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/35 hover:shadow-emerald-600/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore City Activities</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SECTION B: TRAVEL MODE SHOWCASE (NARRATIVE ON LEFT, CARD ON RIGHT - ALTERNATING!) ── */}
      <section
        ref={travelReveal.ref}
        className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/70 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu relative ${
          travelReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Saturated Warm Sunrise Orange Glow Backdrop */}
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-gradient-to-bl from-orange-500/30 via-amber-500/22 to-transparent rounded-full blur-[110px] pointer-events-none transform-gpu" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT COLUMN: Narrative & Details Explanation (Half of screen - ALTERNATING!) */}
          <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white text-xs font-black shadow-md shadow-orange-500/30 uppercase tracking-wider">
              <Mountain className="w-3.5 h-3.5" />
              <span>TRAVEL EXPEDITIONS • MULTI-DAY ITINERARIES</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              Multi-day trips with travelers who match your{" "}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 dark:from-orange-400 dark:via-amber-300 dark:to-rose-200 bg-clip-text text-transparent">
                dates, pace, and rupee budget.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Solo travel in India is thrilling, but sharing cabs, homestays, and trekking trails makes the journey significantly safer and more affordable. The Travel Card displays complete clarity up front:
            </p>

            {/* Feature Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#17120d] border border-orange-200 dark:border-orange-950/80 shadow-xs hover:border-orange-500/60 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold mb-2.5">
                  <Wallet className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                  1. Transparent Rupee Budget
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  The card states clear cost ranges (e.g. ₹8,500 – ₹14,500) covering shared transit and stays. Zero uncomfortable money talks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#17120d] border border-orange-200 dark:border-orange-950/80 shadow-xs hover:border-orange-500/60 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold mb-2.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                  2. 94%+ AI Compatibility Score
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Smart compatibility analyzes travel style (Adventure vs Relaxation), pace, departure cities, and common interests before matching.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#17120d] border border-orange-200 dark:border-orange-950/80 shadow-xs hover:border-orange-500/60 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold mb-2.5">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                  3. Planned Route &amp; Attractions
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every card tags daily route highlights (Chalal trail, Manikaran hot springs) and accommodation preference (cozy hostels or boutique camps).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#17120d] border border-orange-200 dark:border-orange-950/80 shadow-xs hover:border-orange-500/60 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold mb-2.5">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                  4. Ephemeral 7-Day Chat Expiry
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Group chats automatically delete from the database 7 days after the trip completes for permanent privacy &amp; clean storage.
                </p>
              </div>
            </div>

            {/* Saturated CTA Button */}
            <div className="pt-2">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/35 hover:shadow-orange-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Browse Travel Expeditions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Real Travel Plan Card Showcase (Half of screen - ALTERNATING!) */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none order-1 lg:order-2">
            <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-br from-orange-500/18 via-amber-500/12 to-orange-500/5 dark:from-orange-950/80 dark:via-amber-950/50 dark:to-[#140b07] border-2 border-orange-500/40 dark:border-orange-500/50 shadow-[0_16px_50px_rgba(249,115,22,0.24)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_20px_60px_rgba(249,115,22,0.32)]">
              {/* Card Label Tag */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
                  <Mountain className="w-3 h-3" />
                  <span>TRAVEL PLAN CARD</span>
                </span>
                <span className="text-[11px] font-bold text-orange-700 dark:text-orange-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-orange-500" /> Live App Preview
                </span>
              </div>

              {/* The Real TripCard Component */}
              <div className="overflow-hidden rounded-2xl shadow-sm">
                <TripCard trip={SHOWCASE_TRAVEL_TRIP} />
              </div>

              {/* Detail Callout Badges Highlighting Card Elements */}
              <div className="mt-4 pt-3 border-t border-orange-200/60 dark:border-orange-900/60 grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 dark:bg-[#1f1712]/80 border border-orange-200/80 dark:border-orange-900/60 shadow-2xs">
                  <Wallet className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">₹8,500 – ₹14,500 Budget</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 dark:bg-[#1f1712]/80 border border-orange-200/80 dark:border-orange-900/60 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">94% Compatibility</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 dark:bg-[#1f1712]/80 border border-orange-200/80 dark:border-orange-900/60 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">Oct 12 – Oct 17 • 6 Days</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 dark:bg-[#1f1712]/80 border border-orange-200/80 dark:border-orange-900/60 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">7-Day Ephemeral Chat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. ROADMAP: 3 SAFE STEPS WITH SATURATED GRADIENT ACCENTS ── */}
      <section
        ref={howItWorksReveal.ref}
        className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/60 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu ${
          howItWorksReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-400/40">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            From Solo Idea to Shared Journey in 3 Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            A respectful, zero-pressure process designed around mutual comfort and safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 space-y-3 hover:border-emerald-500 hover:shadow-[0_12px_30px_rgba(16,185,129,0.20)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-base flex items-center justify-center shadow-md shadow-emerald-600/40 group-hover:scale-105 transition-transform duration-300">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Discover or Post an Idea
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Browse weekend city hangouts (movies, specialty coffee, book talks) or multi-day travel plans with transparent dates, venues, and estimated costs.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
              <span>View Open Meetups</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 space-y-3 hover:border-orange-500 hover:shadow-[0_12px_30px_rgba(249,115,22,0.20)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-orange-500/40 group-hover:scale-105 transition-transform duration-300">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mutual Compatibility Check
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Review verified member badges, bio notes, and compatibility scores. Send a personalized join request. No unsolicited messages ever reach your inbox.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
              <span>Zero Unwanted DMs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 space-y-3 hover:border-emerald-500 hover:shadow-[0_12px_30px_rgba(16,185,129,0.20)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 text-white font-black text-base flex items-center justify-center shadow-md shadow-teal-600/40 group-hover:scale-105 transition-transform duration-300">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Encrypted Chat &amp; Public Meetup
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                When the host confirms, an end-to-end encrypted room opens. Confirm details, meet in welcoming public spots, and turn solo plans into memorable days.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
              <span>Safe Public Spaces</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. POPULAR INDIAN DESTINATIONS SHOWCASE ── */}
      <section
        ref={destinationsReveal.ref}
        className={`py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/60 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu ${
          destinationsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">TRENDING EXPEDITIONS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Top Indian Destinations for Solo Travelers
            </h2>
          </div>
          <Link
            href="/register"
            className="group inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline min-h-[44px]"
          >
            <span>Browse all destinations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              name: "Kasol & Parvati Valley",
              state: "Himachal Pradesh",
              image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&auto=format&fit=crop&q=80",
              tag: "Trekking & Hostels",
              price: "₹8,500+",
            },
            {
              name: "Living Root Bridges",
              state: "Meghalaya",
              image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=500&auto=format&fit=crop&q=80",
              tag: "Eco Hikes & Waterfalls",
              price: "₹18,000+",
            },
            {
              name: "Hampi & Gokarna",
              state: "Karnataka",
              image: "https://images.unsplash.com/photo-1600100397608-f010e423b971?w=500&auto=format&fit=crop&q=80",
              tag: "Heritage & Beaches",
              price: "₹7,000+",
            },
            {
              name: "Alleppey & Munnar",
              state: "Kerala",
              image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&auto=format&fit=crop&q=80",
              tag: "Tea Estates & Waterways",
              price: "₹12,000+",
            },
          ].map((dest, idx) => (
            <Link
              key={idx}
              href="/register"
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-emerald-950/70 hover:-translate-y-1.5"
            >
              <div className="h-52 w-full overflow-hidden bg-slate-200 dark:bg-[#16201b]">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
                  {dest.tag}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[11px] text-emerald-300 font-medium">{dest.state}</p>
                <h4 className="text-sm font-bold drop-shadow-md">{dest.name}</h4>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-white/80 text-[11px]">Est. Budget</span>
                  <span className="font-extrabold text-orange-400">{dest.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 6. VERIFIED COMMUNITY TESTIMONIALS ── */}
      <section
        ref={testimonialsReveal.ref}
        className={`py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/60 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu ${
          testimonialsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            COMMUNITY STORIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Real Encounters, Genuine Connections
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Stories from people who turned solo weekends into shared adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-50 dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-orange-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                    {t.type}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-200/70 dark:border-emerald-950/60">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center ring-2 ring-emerald-500/30 shadow-sm shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <span>{t.name}</span>
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.city} • <span className="text-emerald-600 dark:text-emerald-400 font-medium">{t.badge}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. SAFETY BANNER WITH VIBRANT EMERALD GRADIENT ── */}
      <section
        ref={safetyReveal.ref}
        className={`py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu ${
          safetyReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/90 via-[#0d2218] to-emerald-950/80 border-2 border-emerald-500/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_12px_40px_rgba(16,185,129,0.20)] hover:shadow-[0_16px_50px_rgba(16,185,129,0.30)] transition-all duration-300">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SAFETY IS NON-NEGOTIABLE</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Built with Safety-First Principles for Every Traveler
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mandatory public-venue guidelines for first meetings, verified identity credentials, end-to-end encrypted messaging, and rapid 1-click reporting directly monitored by human administrators.
            </p>
          </div>
          <Link
            href="/safety"
            className="shrink-0 min-h-[44px] px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/35 transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
          >
            Review Safety Standards
          </Link>
        </div>
      </section>

      {/* ── 8. INVITING BOTTOM CALL TO ACTION WITH RICH SATURATED GRADIENT ── */}
      <section
        ref={ctaReveal.ref}
        className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu ${
          ctaReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-800 via-emerald-900 to-[#062015] border-2 border-emerald-400/50 p-8 sm:p-14 text-white text-center shadow-[0_20px_60px_rgba(16,185,129,0.32)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/30 to-amber-500/20 rounded-full blur-[100px] pointer-events-none transform-gpu" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md shadow-inner mb-1 border border-white/20">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to find your next companion?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
              Join thousands of members across Bengaluru, Mumbai, Delhi, Himachal, and beyond. Free, verified, and always respectful.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
              <Link
                href="/register"
                className="group w-full sm:w-auto min-h-[48px] px-8 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-black/20 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto min-h-[48px] px-8 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-white border border-emerald-400/50 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
              >
                <span>1-Click Demo Login</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPageClient;
