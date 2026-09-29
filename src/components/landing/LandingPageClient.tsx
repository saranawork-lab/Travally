"use client";

import React, { useRef } from "react";
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
  Mountain,
  Clock,
  Wallet,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  return { ref, isVisible: true };
}

export function LandingPageClient() {
  const featuresReveal = useScrollReveal();
  const howItWorksReveal = useScrollReveal();
  const destinationsReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();
  const safetyReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  const TESTIMONIALS = [
    {
      name: "Rhea Deshmukh",
      city: "Bengaluru",
      role: "Cinema & Coffee Explorer",
      quote:
        "None of my colleagues wanted to catch an indie screening on a Sunday evening. I posted a 2-person plan on Travally, and had filter coffee with two wonderful women who love film just as much as I do. Zero awkwardness, purely good conversation.",
      badge: "Verified Member",
      type: "City Companion",
    },
    {
      name: "Arjun Nair",
      city: "Mumbai",
      role: "Himalayan Backpacker",
      quote:
        "Planning a 6-day Kasol and Tosh trip solo felt overwhelming. Finding Priya and Kabir on Travally saved us money on shared cabs and boutique stays, but more importantly, we became real friends who still hike together.",
      badge: "Govt ID Verified",
      type: "Travel Expedition",
    },
    {
      name: "Simran Kaur",
      city: "New Delhi",
      role: "Heritage Photographer",
      quote:
        "As a woman who loves early morning street photography, safety is everything. Travally's mutual acceptance rule means nobody can message you without your permission. I’ve done 4 photo walks in Delhi and felt completely secure.",
      badge: "Verified Host",
      type: "City Companion",
    },
  ];

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#090d0b] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans overflow-x-clip">
      {/* Background Gradient Meshes */}
      <div className="absolute top-0 left-1/4 w-96 sm:w-[38rem] h-96 sm:h-[38rem] bg-gradient-to-tr from-emerald-500/25 via-teal-500/18 to-emerald-400/15 rounded-full blur-[110px] pointer-events-none transform-gpu" />
      <div className="absolute top-1/3 right-4 w-80 sm:w-[34rem] h-80 sm:h-[34rem] bg-gradient-to-bl from-orange-500/25 via-amber-500/18 to-rose-500/15 rounded-full blur-[110px] pointer-events-none transform-gpu" />
      <div className="absolute top-2/3 left-4 w-80 sm:w-[36rem] h-80 sm:h-[36rem] bg-gradient-to-tr from-emerald-500/18 via-teal-500/14 to-emerald-400/10 rounded-full blur-[120px] pointer-events-none transform-gpu" />

      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-12 pb-16 md:pt-24 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow Pill */}
          <div className="animate-fade-in-up animation-delay-100">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/50 dark:border-emerald-600/60 bg-gradient-to-r from-emerald-500/15 via-teal-500/12 to-orange-500/15 text-emerald-950 dark:text-emerald-200 text-xs font-bold backdrop-blur-md shadow-md shadow-emerald-500/10">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent font-black tracking-wider">
                TRAVALLY
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span>Solo Travel Companion &amp; Activity Community</span>
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
            Whether you want to try a new specialty café in Indiranagar, catch an indie film screening, or team up for a Himalayan trek, Travally connects verified people who share your vibe, timing, and travel budget.
          </p>

          {/* High-Converting CTA Buttons */}
          <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="group w-full sm:w-auto min-h-[50px] px-8 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/35 hover:shadow-emerald-600/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Users className="w-4 h-4" />
              <span>Join Travally Free</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>

            <Link
              href="/login"
              className="group w-full sm:w-auto min-h-[50px] px-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#16201b] dark:hover:bg-[#1f2e27] text-slate-800 dark:text-slate-200 font-extrabold text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-emerald-900/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Log In to Account</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          {/* Social Proof Metric Bar */}
          <div className="animate-fade-in-up animation-delay-500 pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[
                  { letter: "R", bg: "bg-emerald-600" },
                  { letter: "A", bg: "bg-orange-500" },
                  { letter: "P", bg: "bg-teal-600" },
                  { letter: "S", bg: "bg-emerald-700" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full border-2 border-white dark:border-[#090d0b] flex items-center justify-center text-[10px] font-black text-white ${item.bg} shadow-sm`}
                  >
                    {item.letter}
                  </div>
                ))}
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                15,000+ Verified Members
              </span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-current" />
              ))}
              <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1">
                4.9/5 Meetup Rating
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Mutual Approval &amp; Zero Spam</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TWO MODES OF TRAVALLY ── */}
      <section
        ref={featuresReveal.ref}
        className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/70 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu relative ${
          featuresReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>DISCOVER YOUR WAY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            One Community. Two Ways to Connect.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Log in to access your city&apos;s companion feed or multi-day travel expeditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Companion Mode Showcase Card */}
          <div className="relative rounded-3xl p-8 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 dark:from-[#101b16] dark:via-[#0c1410] dark:to-[#08120e] border border-emerald-200/90 dark:border-emerald-900/60 shadow-lg flex flex-col justify-between group hover:border-emerald-500/80 transition-all duration-300">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <Film className="w-3.5 h-3.5" />
                <span>CITY COMPANION MODE</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Everyday Local Activities
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Connect with local buddies for weekend activities: movie screenings, artisan cafe crawls, live stand-up gigs, art galleries, and morning sports sessions in your city.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Public meeting venues designated in advance</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Intimate meetups (1-on-1 or small groups of 2-3)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Automatic 2-hour cutoff gates before events start</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.01]"
              >
                <span>Sign Up to Explore Activities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Travel Mode Showcase Card */}
          <div className="relative rounded-3xl p-8 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/40 dark:from-[#1f1712] dark:via-[#16100c] dark:to-[#120a06] border border-orange-200/90 dark:border-orange-950/60 shadow-lg flex flex-col justify-between group hover:border-orange-500/80 transition-all duration-300">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 text-xs font-bold">
                <Mountain className="w-3.5 h-3.5" />
                <span>TRAVEL EXPEDITIONS MODE</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Multi-Day Travel Itineraries
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Find verified partners for road trips, Himalayan treks, and coastal explorations. Split cab fares, share homestays, and travel with confidence.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span>Transparent rupee budget ranges up front</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span>Smart AI compatibility matching for travel pace &amp; style</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span>Ephemeral encrypted group chats that auto-expire after trip</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/30 transition-all hover:scale-[1.01]"
              >
                <span>Sign Up to Plan Trips</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. ROADMAP: 3 SAFE STEPS ── */}
      <section
        ref={howItWorksReveal.ref}
        className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/60 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu ${
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
                1. Sign Up &amp; Verify
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Create your profile with verification credentials. Browse weekend city hangouts or multi-day travel expeditions once you log into the platform.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Quick &amp; Secure</span>
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
                2. Mutual Compatibility Check
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Review verified member badges, bio notes, and compatibility scores. Send a personalized join request. No unsolicited messages ever reach your inbox.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
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
                3. Encrypted Chat &amp; Public Meetup
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                When the host confirms, an end-to-end encrypted room opens. Confirm details, meet in welcoming public spots, and turn solo plans into memorable days.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Safe Public Spaces</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. POPULAR DESTINATIONS ── */}
      <section
        ref={destinationsReveal.ref}
        className={`py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/60 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu ${
          destinationsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
              POPULAR EXPEDITIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Trending Destinations for Indian Solo Travelers
            </h2>
          </div>
          <Link
            href="/register"
            className="group inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline min-h-[44px]"
          >
            <span>Sign up to view expeditions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              name: "Kasol & Parvati Valley",
              state: "Himachal Pradesh",
              image:
                "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&auto=format&fit=crop&q=80",
              tag: "Trekking & Hostels",
              price: "₹8,500+ avg",
            },
            {
              name: "Living Root Bridges",
              state: "Meghalaya",
              image:
                "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=500&auto=format&fit=crop&q=80",
              tag: "Eco Hikes & Waterfalls",
              price: "₹18,000+ avg",
            },
            {
              name: "Hampi & Gokarna",
              state: "Karnataka",
              image:
                "https://images.unsplash.com/photo-1600100397608-f010e423b971?w=500&auto=format&fit=crop&q=80",
              tag: "Heritage & Beaches",
              price: "₹7,000+ avg",
            },
            {
              name: "Alleppey & Munnar",
              state: "Kerala",
              image:
                "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&auto=format&fit=crop&q=80",
              tag: "Tea Estates & Waterways",
              price: "₹12,000+ avg",
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

      {/* ── 5. VERIFIED COMMUNITY TESTIMONIALS ── */}
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

      {/* ── 6. SAFETY BANNER ── */}
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

      {/* ── 7. BOTTOM CTA ── */}
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
