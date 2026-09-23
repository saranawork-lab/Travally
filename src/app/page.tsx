import React from "react";
import Link from "next/link";
import {
  Users,
  Compass,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Coffee,
  Film,
  MapPin,
  Calendar,
  Lock,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import db from "@/lib/db";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { TripCard } from "@/components/travel/TripCard";
import { calculateTravelCompatibility } from "@/lib/scoring";

export const revalidate = 60; // SSR with ISR caching

export default async function HomePage() {
  // Fetch sample activities and travel plans for landing showcase
  const sampleActivities = await db.activity.findMany({
    where: { status: "OPEN" },
    take: 3,
    include: {
      organizer: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
    },
    orderBy: { date: "asc" },
  });

  const rawTrips = await db.travelPlan.findMany({
    where: { status: "OPEN" },
    take: 3,
    include: {
      organizer: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
    },
    orderBy: { startDate: "asc" },
  });

  const sampleTrips = rawTrips.map((trip) => {
    const compatibility = calculateTravelCompatibility(
      { interests: ["Cultural Travel", "Architecture", "Photography", "Coffee"] },
      {
        destination: trip.destination,
        departureCity: trip.departureCity,
        startDate: trip.startDate,
        endDate: trip.endDate,
        travelStyle: trip.travelStyle,
        interests: trip.interests,
        budgetMin: trip.budgetMin,
        budgetMax: trip.budgetMax,
      }
    );
    return { ...trip, compatibility };
  });

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Activity-First Social Companion & Travel Discovery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Two independent paths.{" "}
            <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">
              One shared journey.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            Travally connects people based on shared activities, movies, coffee discussions, city explorations, and upcoming travel plans. Free, mutual, organizer-approved, and private.
          </p>

          {/* Core Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/discover?mode=companion"
              className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition shadow-lg hover:shadow-teal-500/25 flex items-center justify-center gap-2 group"
            >
              <Users className="w-4 h-4" />
              <span>Explore Companion Mode</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/discover?mode=travel"
              className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-600 transition shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-500" />
              <span>Explore Travel Mode</span>
            </Link>
          </div>

          {/* Social Proof / Pillars */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>100% Free Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Private Chat After Approval</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Community Vetted</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL MODE SHOWCASE: COMPANION MODE VS TRAVEL MODE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Mode 1: Companion Mode */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-teal-500/5 via-teal-500/10 to-transparent border border-teal-500/20 shadow-sm relative overflow-hidden">
            <div className="inline-flex p-3 rounded-2xl bg-teal-600 text-white shadow-md mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Companion Mode
            </h2>
            <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider mb-3">
              Everyday Shared Activities
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Never miss an indie movie screening, cafe tasting, weekend coastal trail walk, or focused library study session. Create activities with structured start times, capacity limits, and cutoff windows.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <Film className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Movies, Indie Cinemas & Post-Show Debriefs</span>
              </li>
              <li className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Specialty Coffee, Bakeries & Food Crawls</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Urban Walking, Architectural Tours & Photography</span>
              </li>
            </ul>

            <Link
              href="/discover?mode=companion"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 hover:gap-2.5 transition-all"
            >
              <span>Browse Companion Activities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mode 2: Travel Mode */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-transparent border border-amber-500/20 shadow-sm relative overflow-hidden">
            <div className="inline-flex p-3 rounded-2xl bg-amber-600 text-white shadow-md mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Travel Mode
            </h2>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider mb-3">
              Destination & Trip Companion Matching
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Publish upcoming trips or discover fellow travelers with overlapping travel windows, compatible travel styles, and shared itineraries. With defined transparent compatibility scoring.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Date overlap analysis & multi-day itinerary alignment</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Transparent scoring algorithm with 5-factor breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Group expedition chats once the organizer approves</span>
              </li>
            </ul>

            <Link
              href="/discover?mode=travel"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 hover:gap-2.5 transition-all"
            >
              <span>Browse Travel Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COMPANION ACTIVITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Upcoming Companion Activities
            </h2>
            <p className="text-xs text-slate-500">
              Real-world activities happening soon in your community
            </p>
          </div>
          <Link
            href="/discover?mode=companion"
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>View all activities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleActivities.map((act) => (
            <ActivityCard key={act.id} activity={act as any} />
          ))}
        </div>
      </section>

      {/* 4. FEATURED TRAVEL PLANS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Active Travel Expeditions
            </h2>
            <p className="text-xs text-slate-500">
              Verified travelers seeking compatible journey partners
            </p>
          </div>
          <Link
            href="/discover?mode=travel"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View all trips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip as any} />
          ))}
        </div>
      </section>

      {/* 5. TRUST, SAFETY & PRINCIPLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safety First Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Designed for mutual trust, not endless swipes.
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Travally is built specifically to prevent harassment, spam, and unvetted introductions. We strictly enforce organizer review, private participant messaging, structured meeting parameters, and zero commercial solicitation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="font-bold text-teal-300">Organizer Approval</span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  No unsolicited messages. Organizers review applicant profiles and must accept before any conversation begins.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="font-bold text-teal-300">Strict Moderation & Reporting</span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  One-click blocking and reporting immediately excludes bad actors from your discovery feed and alerts our team.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/safety"
                className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl border border-slate-700 transition"
              >
                <span>Read our Community Safety Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
