"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Calendar,
  Wallet,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  CheckCircle2,
  Landmark,
  Trees,
  Backpack,
  Mountain,
  Car,
  Sparkles,
  Heart,
} from "lucide-react";

interface TravelStyleOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  desc: string;
  popular?: boolean;
}

const STYLES: TravelStyleOption[] = [
  {
    id: "CULTURAL",
    label: "Cultural & Heritage",
    icon: <Landmark className="w-5 h-5 text-amber-500" />,
    desc: "Historic districts, architecture, museums, culinary heritage",
    popular: true,
  },
  {
    id: "SLOW_TRAVEL",
    label: "Slow Travel",
    icon: <Trees className="w-5 h-5 text-emerald-500" />,
    desc: "Neighborhood living, unhurried exploration, local immersion",
    popular: true,
  },
  {
    id: "BACKPACKING",
    label: "Backpacking & Hostels",
    icon: <Backpack className="w-5 h-5 text-teal-500" />,
    desc: "Hostels, flexible transit, budget-conscious exploration",
  },
  {
    id: "ADVENTURE",
    label: "Adventure & Hiking",
    icon: <Mountain className="w-5 h-5 text-indigo-500" />,
    desc: "Mountain trails, outdoor trekking, coastal walks",
  },
  {
    id: "ROAD_TRIP",
    label: "Scenic Road Trip",
    icon: <Car className="w-5 h-5 text-cyan-500" />,
    desc: "Coastal drives, countryside exploration, road journeys",
  },
  {
    id: "LUXURY",
    label: "Boutique & Luxury",
    icon: <Sparkles className="w-5 h-5 text-rose-500" />,
    desc: "Curated boutique stays, fine dining, private tours",
  },
  {
    id: "RELAXATION",
    label: "Relaxation & Wellness",
    icon: <Heart className="w-5 h-5 text-amber-600" />,
    desc: "Hot springs, coastal retreats, peaceful escapes",
  },
];

export default function CreateTravelPlanPage() {
  const router = useRouter();

  // Multi-step sliding flow: Step 1 = Style Tag Selection, Step 2 = Trip Details
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    travelStyle: "",
    destination: "",
    departureCity: "",
    startDate: "",
    endDate: "",
    budgetMin: "1500",
    budgetMax: "2500",
    currency: "USD",
    accommodationPreference: "AIRBNB",
    transportPreference: "TRAIN",
  });

  const [attractionInput, setAttractionInput] = useState("");
  const [attractions, setAttractions] = useState<string[]>([
    "Historic Old Town & Temples",
    "Local Street Food Crawl",
  ]);

  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState<string[]>([
    "Photography",
    "Architecture",
    "Cultural Travel",
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedStyleObj = STYLES.find((s) => s.id === formData.travelStyle);

  const handleSelectStyle = (styleId: string) => {
    setFormData((prev) => ({ ...prev, travelStyle: styleId }));
    setStep(2);
  };

  const handleBackToStyles = () => {
    setStep(1);
  };

  const addAttraction = () => {
    if (attractionInput.trim() && !attractions.includes(attractionInput.trim())) {
      setAttractions([...attractions, attractionInput.trim()]);
      setAttractionInput("");
    }
  };

  const removeAttraction = (index: number) => {
    setAttractions(attractions.filter((_, i) => i !== index));
  };

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Location and max companions removed from form; sensible defaults sent
      const payload = {
        ...formData,
        groupSizeMax: "3",
        plannedAttractions: attractions,
        interests,
      };

      const res = await fetch("/api/travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create travel plan");
      }

      router.push(`/travel/${data.travelPlan.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create travel plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-28">
      <div>
        <Link
          href="/discover?mode=travel"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Travel Expeditions</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Step Progress Header */}
        <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Travel Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Publish a Travel Plan
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">
              {step === 1
                ? "First, select your travel style tag."
                : "Enter your destination, dates, and journey details."}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              Step {step} of 2
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-200">
            {error}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: CHOOSE TRAVEL STYLE TAG */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="animate-slide-in-left space-y-6">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Select Your Travel Style
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Tap on any style tag below to slide forward to trip details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {STYLES.map((st) => {
                const isSelected = formData.travelStyle === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleSelectStyle(st.id)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-3.5 group hover:shadow-md ${
                      isSelected
                        ? "bg-amber-50 dark:bg-amber-950/70 border-amber-600 text-slate-900 dark:text-white ring-2 ring-amber-500/30"
                        : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-white dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 shrink-0 group-hover:scale-110 transition-transform">
                      {st.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="block text-sm font-bold text-slate-900 dark:text-white">
                          {st.label}
                        </span>
                        {st.popular && (
                          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="block text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 font-medium">
                        {st.desc}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 self-center shrink-0 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: TRIP DETAILS (SLIDES IN) */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="animate-slide-in-right space-y-6">
            {/* Active Style Bar & Back Button */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs">
                  {selectedStyleObj?.icon}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                    Selected Travel Style
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {selectedStyleObj?.label}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBackToStyles}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-slate-700 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Style</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destination & Departure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Destination City / Region *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Tokyo & Kyoto, Japan"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Departure City *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. San Francisco or Flexible"
                    value={formData.departureCity}
                    onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Travel Start Date *
                  </label>
                  <input
                    required
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Travel End Date *
                  </label>
                  <input
                    required
                    type="date"
                    min={formData.startDate || new Date().toISOString().split("T")[0]}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Budget & Accommodation (Max companions removed) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Min Budget ($)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Max Budget ($)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Accommodation
                  </label>
                  <select
                    value={formData.accommodationPreference}
                    onChange={(e) => setFormData({ ...formData, accommodationPreference: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="AIRBNB">Airbnb / Apartments</option>
                    <option value="HOTEL">Hotels</option>
                    <option value="HOSTEL">Hostels</option>
                    <option value="FLEXIBLE">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Planned Attractions */}
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  Planned Highlights & Attractions
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add an attraction (e.g. Senso-ji temple, Shibuya sky, tea tasting)"
                    value={attractionInput}
                    onChange={(e) => setAttractionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAttraction();
                      }
                    }}
                    className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={addAttraction}
                    className="px-4 py-2 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {attractions.map((att, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      <span>{att}</span>
                      <button
                        type="button"
                        onClick={() => removeAttraction(i)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Travel Interests */}
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  Trip Interests & Passions
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add an interest tag (e.g. Photography, Street Food, Hiking)"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                    className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    className="px-4 py-2 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((int, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-semibold border border-amber-300/80 dark:border-amber-800/80"
                    >
                      <span>{int}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(i)}
                        className="text-amber-600 hover:text-rose-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleBackToStyles}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Styles</span>
                </button>

                <div className="flex items-center gap-3">
                  <Link
                    href="/discover?mode=travel"
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full text-xs font-extrabold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-60 transition shadow-md hover:shadow-amber-500/25 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? "Publishing..." : "Publish Travel Plan"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
