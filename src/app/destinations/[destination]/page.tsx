import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { TripCard } from "@/components/travel/TripCard";
import { ArrowLeft, Compass, MapPin, Sparkles, PlusCircle } from "lucide-react";
import { calculateTravelCompatibility } from "@/lib/scoring";
import type { Metadata } from "next";

const DESTINATION_META: Record<string, { name: string; country: string; desc: string; highlights: string[] }> = {
  tokyo: {
    name: "Tokyo & Kyoto",
    country: "Japan",
    desc: "Find verified travel companions for exploring ancient shrines, neon alleyways, tea ceremonies, and bullet train journeys across Japan.",
    highlights: ["Senso-ji & Yanaka", "Fushimi Inari morning hike", "Uji matcha tour", "Shinjuku izakayas"],
  },
  barcelona: {
    name: "Barcelona & Costa Brava",
    country: "Spain",
    desc: "Connect with fellow architecture lovers, tapas connoisseurs, and Mediterranean coastal explorers.",
    highlights: ["Gaudí Modernisme", "Gothic Quarter alleys", "Cadaqués coastal path", "Tapas & cava debriefs"],
  },
  interlaken: {
    name: "Interlaken & Bernese Oberland",
    country: "Switzerland",
    desc: "Discover alpine hiking partners for valley waterfalls, ridge treks, and turquoise lake kayaking.",
    highlights: ["Lauterbrunnen Valley", "Schilthorn ridge trek", "Lake Brienz kayak", "Alpine rail journeys"],
  },
  "san-francisco": {
    name: "San Francisco",
    country: "United States",
    desc: "Explore iconic hills, Victorian architecture, indie cinema, and specialty pour-over roasters.",
    highlights: ["Mission murals & coffee", "Presidio coastal trail", "Golden Gate sunset", "Chinatown alleys"],
  },
};

export async function generateMetadata({
  params,
}: {
  params: { destination: string };
}): Promise<Metadata> {
  const dest = DESTINATION_META[params.destination.toLowerCase()];
  if (!dest) return { title: "Travel Expeditions — Travally" };

  return {
    title: `Travel Companions for ${dest.name}, ${dest.country} — Travally`,
    description: dest.desc,
    openGraph: {
      title: `Travel Companions for ${dest.name} — Travally`,
      description: dest.desc,
    },
  };
}

export default async function DestinationSEOPage({
  params,
}: {
  params: { destination: string };
}) {
  const destKey = params.destination.toLowerCase();
  const destInfo = DESTINATION_META[destKey];

  if (!destInfo) {
    notFound();
  }

  const rawTrips = await db.travelPlan.findMany({
    where: {
      destination: { contains: destInfo.name.split(" ")[0] },
      status: "OPEN",
    },
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

  const trips = rawTrips.map((trip) => {
    const compatibility = calculateTravelCompatibility(
      { destinationPreferences: [destInfo.name] },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${destInfo.name}, ${destInfo.country}`,
    description: destInfo.desc,
    url: `https://travally.app/destinations/${destKey}`,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Link
          href="/discover?mode=travel"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Travel Destinations</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200">
          <Compass className="w-3.5 h-3.5" />
          <span>{destInfo.country}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find Travel Companions for {destInfo.name}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          {destInfo.desc}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 pt-2">
          {destInfo.highlights.map((h, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium"
            >
              <MapPin className="w-3 h-3 text-amber-500" />
              <span>{h}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Trips list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Active Expeditions to {destInfo.name} ({trips.length})
          </h2>
          <Link
            href="/travel/create"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publish Your Trip to {destInfo.name}</span>
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400 space-y-3">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
            <p>No open trips currently posted for this destination. Create your travel plan to connect with other travelers!</p>
            <Link
              href="/travel/create"
              className="inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600"
            >
              Post a Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
