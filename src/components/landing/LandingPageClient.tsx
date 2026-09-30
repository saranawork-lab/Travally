"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Mountain,
  Clock,
  Clock3,
  Wallet,
  CheckCircle2,
  HeartHandshake,
  Tag,
  Bookmark,
  Menu,
} from "lucide-react";

/**
 * 3D Tilt Component with Interactive Mouse Perspective & Ambient Mobile Float
 */
function Card3DContainer({
  children,
  accentColor = "emerald",
}: {
  children: React.ReactNode;
  accentColor?: "emerald" | "orange";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>(
    "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  );
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(
      `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setTransform(
      "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    );
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative transition-all duration-300 ease-out transform-gpu cursor-pointer select-none group/3d"
      style={{
        transform,
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D Ambient Backdrop Glow */}
      <div
        className={`absolute -inset-4 rounded-3xl blur-2xl opacity-40 group-hover/3d:opacity-70 transition-opacity duration-500 pointer-events-none ${
          accentColor === "emerald"
            ? "bg-gradient-to-tr from-emerald-500/40 via-teal-500/30 to-emerald-400/20"
            : "bg-gradient-to-tr from-orange-500/40 via-amber-500/30 to-rose-500/20"
        }`}
      />

      {/* Dynamic Lighting Glare Sheen */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl z-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, transparent 65%)`,
          opacity: glare.opacity,
        }}
      />

      {children}
    </div>
  );
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  return { ref, isVisible: true };
}

export function LandingPageClient() {
  const companionReveal = useScrollReveal();
  const travelReveal = useScrollReveal();
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
      {/* Background Gradient Meshes for Lower Sections */}
      <div className="absolute top-1/3 right-4 w-80 sm:w-[34rem] h-80 sm:h-[34rem] bg-gradient-to-bl from-orange-500/20 via-amber-500/15 to-rose-500/10 rounded-full blur-[110px] pointer-events-none transform-gpu" />
      <div className="absolute top-2/3 left-4 w-80 sm:w-[36rem] h-80 sm:h-[36rem] bg-gradient-to-tr from-emerald-500/18 via-teal-500/14 to-emerald-400/10 rounded-full blur-[120px] pointer-events-none transform-gpu" />

      {/* ── 1. HERO SECTION WITH CINEMATIC SUNRISE TRAVEL SCENERY ── */}
      <section className="relative w-full overflow-hidden bg-slate-950 text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 shadow-2xl">
        {/* Full-bleed Panoramic Mountain Sunrise Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=85"
            alt="Scenic Mountain Valley Horizon"
            className="w-full h-full object-cover object-center scale-105"
          />
        </div>

        {/* Warm Cinematic Gradient Overlay Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/65 to-slate-950/90 pointer-events-none" />

        {/* Atmospheric Ambient Lighting */}
        <div className="absolute -top-24 left-1/4 w-[36rem] h-[36rem] bg-emerald-500/18 rounded-full blur-[140px] pointer-events-none transform-gpu" />
        <div className="absolute -bottom-24 right-1/4 w-[32rem] h-[32rem] bg-amber-500/14 rounded-full blur-[140px] pointer-events-none transform-gpu" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow Pill */}
          <div className="animate-fade-in-up animation-delay-100 flex items-center justify-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 backdrop-blur-xl text-emerald-300 text-xs font-semibold shadow-lg shadow-emerald-950/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-extrabold uppercase tracking-widest text-[10px] text-emerald-400">
                TRAVALLY
              </span>
              <span className="text-emerald-500/40">|</span>
              <span className="text-slate-200 text-xs font-medium">
                India&apos;s Solo Travel &amp; Activity Community
              </span>
            </div>
          </div>

          {/* Main Headline with Premium Editorial Hierarchy */}
          <h1 className="animate-fade-in-up animation-delay-200 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            Meet good people. <br />
            <span className="font-light italic text-emerald-200">Share real journeys.</span> <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Never miss an outing again.
            </span>
          </h1>

          {/* Natural, Human-Centric Subtitle */}
          <p className="animate-fade-in-up animation-delay-300 text-base sm:text-lg text-slate-200/90 max-w-2xl mx-auto leading-relaxed font-normal pt-1 drop-shadow-md">
            Whether you want to try an artisanal café in Indiranagar, catch an indie film screening, or team up for a Himalayan trek, Travally connects verified people who share your vibe, timing, and travel budget.
          </p>

          {/* Quick Category Badges */}
          <div className="animate-fade-in-up animation-delay-350 pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-2xl mx-auto">
            {[
              { icon: Mountain, label: "Himalayan Ridge Treks" },
              { icon: Film, label: "City Meetups & Cafés" },
              { icon: Compass, label: "Coastal & Heritage Trails" },
              { icon: ShieldCheck, label: "Govt ID & Mutual Approval" },
            ].map((pill, i) => {
              const Icon = pill.icon;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md shadow-xs"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{pill.label}</span>
                </span>
              );
            })}
          </div>

          {/* High-Converting CTA Buttons */}
          <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              href="/register"
              className="group w-full sm:w-auto min-h-[52px] px-8 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_12px_32px_rgba(16,185,129,0.5)] hover:shadow-[0_16px_40px_rgba(16,185,129,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Users className="w-4 h-4" />
              <span>Join Travally Free</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>

            <Link
              href="/login"
              className="group w-full sm:w-auto min-h-[52px] px-8 rounded-full bg-white/15 hover:bg-white/25 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 border border-white/30 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Compass className="w-4 h-4 text-emerald-300 group-hover:rotate-45 transition-transform duration-300" />
              <span>Log In to Account</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          {/* Social Proof Metric Bar */}
          <div className="animate-fade-in-up animation-delay-500 pt-3 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {[
                  { letter: "R", bg: "bg-emerald-600" },
                  { letter: "A", bg: "bg-orange-500" },
                  { letter: "P", bg: "bg-teal-600" },
                  { letter: "S", bg: "bg-emerald-700" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-white ${item.bg} shadow-md`}
                  >
                    {item.letter}
                  </div>
                ))}
              </div>
              <span className="font-bold text-white drop-shadow-sm">
                15,000+ Verified Members
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-amber-300 drop-shadow-sm font-semibold">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-white font-bold ml-0.5">4.9/5</span>
              <span className="text-slate-300 text-[11px] font-normal">Meetup Rating</span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold drop-shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Mutual Approval &amp; Zero Spam</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SECTION 1: COMPANION CARD SECTION (CARD ON LEFT, TEXT ON RIGHT) ── */}
      <section
        ref={companionReveal.ref}
        className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/70 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu relative ${
          companionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT COLUMN: 3D Animated Duplicate Companion Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none">
            <Card3DContainer accentColor="emerald">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#f2faf8] to-[#e4f3f0] dark:from-[#0d1713] dark:to-[#08100d] border-2 border-emerald-500/50 shadow-[0_20px_50px_rgba(16,185,129,0.25)] p-5">
                {/* 3D Floating Pill Badges */}
                <div
                  className="flex items-center justify-between mb-4"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md">
                    <Film className="w-3 h-3" />
                    <span>COMPANION ACTIVITY</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-md shadow-emerald-500/40 animate-pulse">
                    1 spot left
                  </span>
                </div>

                {/* Cover Image Banner */}
                <div
                  className="relative h-48 rounded-2xl overflow-hidden mb-4 shadow-md group"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80"
                    alt="Suchitra Film Society Screening & Filter Coffee"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Movies &amp; Cinema
                    </span>
                    <h3 className="text-base font-black leading-tight drop-shadow-sm">
                      Suchitra Film Society Screening &amp; Filter Coffee
                    </h3>
                  </div>
                </div>

                {/* Host Info Box */}
                <div
                  className="p-3 rounded-2xl bg-white/90 dark:bg-[#121c17]/90 border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs mb-3 flex items-center justify-between"
                  style={{ transform: "translateZ(25px)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center shadow-xs">
                      A
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Ananya Sharma
                        </span>
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Indiranagar, Bengaluru • Govt ID &amp; LinkedIn Verified
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Host
                  </span>
                </div>

                {/* Meetup Details Grid */}
                <div
                  className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/80 dark:bg-[#121c17]/80 border border-emerald-100 dark:border-emerald-900/40 text-center mb-4 text-[11px]"
                  style={{ transform: "translateZ(25px)" }}
                >
                  <div className="p-1">
                    <p className="text-[10px] text-slate-400 font-medium">Date &amp; Time</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">Oct 1 • 17:00</p>
                    <p className="text-[9px] text-emerald-600 font-semibold">3h duration</p>
                  </div>
                  <div className="p-1 border-x border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-medium">Meeting Point</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">Indiranagar</p>
                    <p className="text-[9px] text-slate-500">Public Society</p>
                  </div>
                  <div className="p-1">
                    <p className="text-[10px] text-slate-400 font-medium">Attendees</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">1 of 2 joined</p>
                    <p className="text-[9px] text-emerald-600 font-semibold">1 spot left</p>
                  </div>
                </div>

                {/* Action Preview Button */}
                <div style={{ transform: "translateZ(30px)" }}>
                  <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30">
                    <span>Request to Join Activity</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Card3DContainer>
          </div>

          {/* RIGHT COLUMN: Narrative & Details of "What All It Shows" */}
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
              Companion Mode gives you a structured, reassuring interface for discovering weekend activities happening in your city. Every detail is established up front:
            </p>

            {/* Feature Breakdown Grid Explaining What the Card Shows */}
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
                  Every activity designates a safe public spot (such as Indiranagar cafes or cultural centers) before meetups occur.
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
                  Clear spot indicators (e.g. &ldquo;1 spot left&rdquo;) ensure meetups remain intimate (1-on-1 or 2–3 companions max) without chaotic crowds.
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

            {/* CTA Link */}
            <div className="pt-2">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/35 hover:shadow-emerald-600/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Join Free to Meet Companions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SECTION 2: TRAVEL CARD SECTION (VICE VERSA! TEXT ON LEFT, CARD ON RIGHT) ── */}
      <section
        ref={travelReveal.ref}
        className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-emerald-950/70 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu relative ${
          travelReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT COLUMN: Narrative & Details of "What All It Shows" (Alternating!) */}
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

            {/* Feature Breakdown Grid Explaining What the Card Shows */}
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

            {/* CTA Link */}
            <div className="pt-2">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/35 hover:shadow-orange-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Join Free to Plan Trips</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Animated Duplicate Travel Card (Alternating!) */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none order-1 lg:order-2">
            <Card3DContainer accentColor="orange">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#fcf7f2] to-[#faeee3] dark:from-[#1b140f] dark:to-[#120a06] border-2 border-orange-500/50 shadow-[0_20px_50px_rgba(249,115,22,0.25)] p-5">
                {/* 3D Floating Pill Badges */}
                <div
                  className="flex items-center justify-between mb-4"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md">
                    <Mountain className="w-3 h-3" />
                    <span>TRAVEL EXPEDITION</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[11px] font-bold shadow-md shadow-orange-500/40">
                    ⚡ 94% Compatibility
                  </span>
                </div>

                {/* Cover Image Banner */}
                <div
                  className="relative h-48 rounded-2xl overflow-hidden mb-4 shadow-md group"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80"
                    alt="Kasol & Tosh: Parvati Valley Trek"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300">
                      Himalayan Trekking • 6 Days
                    </span>
                    <h3 className="text-base font-black leading-tight drop-shadow-sm">
                      Kasol &amp; Tosh: Parvati Valley Trek
                    </h3>
                  </div>
                </div>

                {/* Host Info Box */}
                <div
                  className="p-3 rounded-2xl bg-white/90 dark:bg-[#18110a]/90 border border-orange-200/80 dark:border-orange-900/60 shadow-xs mb-3 flex items-center justify-between"
                  style={{ transform: "translateZ(25px)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950 border border-orange-300 text-orange-800 dark:text-orange-300 font-black text-xs flex items-center justify-center shadow-xs">
                      P
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Priya Iyer
                        </span>
                        <BadgeCheck className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Bengaluru / Delhi • Frequent Backpacker &amp; ID Verified
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                    Leader
                  </span>
                </div>

                {/* Trip Details Grid */}
                <div
                  className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/80 dark:bg-[#18110a]/80 border border-orange-100 dark:border-orange-900/40 text-center mb-4 text-[11px]"
                  style={{ transform: "translateZ(25px)" }}
                >
                  <div className="p-1">
                    <p className="text-[10px] text-slate-400 font-medium">Est. Budget</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">₹8.5k – ₹14.5k</p>
                    <p className="text-[9px] text-orange-600 font-semibold">Cabs &amp; Stays</p>
                  </div>
                  <div className="p-1 border-x border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-medium">Dates</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">Oct 12 – 18</p>
                    <p className="text-[9px] text-slate-500">6 Days Total</p>
                  </div>
                  <div className="p-1">
                    <p className="text-[10px] text-slate-400 font-medium">Group Size</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">Max 3 Travelers</p>
                    <p className="text-[9px] text-orange-600 font-semibold">1 Spot Open</p>
                  </div>
                </div>

                {/* Action Preview Button */}
                <div style={{ transform: "translateZ(30px)" }}>
                  <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
                    <span>Request to Join Expedition</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Card3DContainer>
          </div>
        </div>
      </section>

      {/* ── 4. ROADMAP: 3 SAFE STEPS ── */}
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

      {/* ── 5. POPULAR DESTINATIONS ── */}
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
                "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
              tag: "Trekking & Hostels",
              price: "₹8,500+ avg",
              spots: "3 spots open",
            },
            {
              name: "Living Root Bridges",
              state: "Meghalaya",
              image:
                "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80",
              tag: "Eco Hikes & Waterfalls",
              price: "₹18,000+ avg",
              spots: "2 spots open",
            },
            {
              name: "Hampi & Gokarna",
              state: "Karnataka",
              image:
                "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
              tag: "Heritage & Beaches",
              price: "₹7,000+ avg",
              spots: "4 spots open",
            },
            {
              name: "Alleppey & Munnar",
              state: "Kerala",
              image:
                "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
              tag: "Tea Estates & Waterways",
              price: "₹12,000+ avg",
              spots: "2 spots open",
            },
          ].map((dest, idx) => (
            <Link
              key={idx}
              href="/register"
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/90 dark:border-emerald-950/80 hover:border-emerald-500/60 hover:-translate-y-2 flex flex-col justify-end min-h-[300px] sm:min-h-[320px] bg-slate-900"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 group-hover:via-black/40 transition-colors duration-300" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30">
                  {dest.tag}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/40">
                  {dest.spots}
                </span>
              </div>
              <div className="relative z-10 p-4 pt-10 text-white">
                <div className="flex items-center gap-1 text-emerald-300 text-xs font-bold mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{dest.state}</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover:text-emerald-200 transition-colors">
                  {dest.name}
                </h4>
                <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white/70 text-[10px] uppercase font-semibold block">Est. Budget</span>
                    <span className="font-black text-amber-400 text-sm tracking-tight drop-shadow-xs">{dest.price}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/15 group-hover:bg-emerald-600 text-white text-xs font-bold backdrop-blur-md border border-white/20 group-hover:border-emerald-500 transition-all duration-200 shadow-sm">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
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

      {/* ── 7. SAFETY BANNER ── */}
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

      {/* ── 8. BOTTOM CTA ── */}
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
