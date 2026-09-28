"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Calendar,
  Clock,
  Shield,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Film,
  Coffee,
  Footprints,
  BookOpen,
  Music,
  ShoppingBag,
  Compass,
  CheckCircle2,
  UploadCloud,
  X,
} from "lucide-react";

interface CategoryOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  tag: string;
  hint: string;
  popular?: boolean;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "FOOD_CAFES",
    label: "Food & Cafes",
    tag: "Food Crawls & Coffee",
    icon: <Coffee className="w-5 h-5 text-orange-500" />,
    hint: "Specialty coffee roasters, bakery walks, tasting new restaurants",
    popular: true,
  },
  {
    id: "MOVIES",
    label: "Movies & Cinema",
    tag: "Screenings & Film",
    icon: <Film className="w-5 h-5 text-emerald-500" />,
    hint: "Screenings, indie cinema discussions, film festivals",
    popular: true,
  },
  {
    id: "WALKING",
    label: "Walking & Trails",
    tag: "Urban & Nature Trails",
    icon: <Footprints className="w-5 h-5 text-green-600" />,
    hint: "Casual neighborhood strolls, scenic coastal walks, urban flâneur",
  },
  {
    id: "STUDYING",
    label: "Studying & Co-Working",
    tag: "Study & Work Sessions",
    icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
    hint: "Library focus sessions, writing blocks, quiet reading afternoons",
  },
  {
    id: "EVENTS",
    label: "Events & Concerts",
    tag: "Live Shows & Gigs",
    icon: <Music className="w-5 h-5 text-orange-500" />,
    hint: "Live indie gigs, theater performances, gallery openings",
  },
  {
    id: "SHOPPING",
    label: "Shopping & Markets",
    tag: "Vintage & Flea Markets",
    icon: <ShoppingBag className="w-5 h-5 text-amber-500" />,
    hint: "Flea markets, vintage shopping, artisanal farmers markets",
  },
  {
    id: "CITY_EXPLORATION",
    label: "City Exploration",
    tag: "Architecture & Photo Walks",
    icon: <Compass className="w-5 h-5 text-emerald-500" />,
    hint: "Architecture walks, discovering hidden streets, photography",
  },
  {
    id: "OTHER",
    label: "Other Activity",
    tag: "Mutual Passions",
    icon: <Sparkles className="w-5 h-5 text-orange-500" />,
    hint: "Any other shared mutual interest or casual adventure",
  },
];

export default function CreateActivityPage() {
  const router = useRouter();

  // Multi-step sliding flow: Step 1 = Tag Selection, Step 2 = Details Form
  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    date: "",
    startTime: "18:30",
    approxDurationHours: "2.0",
    genderPreference: "ANY",
    additionalRequirements: "",
    cutoffHoursBeforeStart: "2",
    imageUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === formData.category);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle selecting a tag/category -> smoothly slides to step 2
  const handleSelectCategory = (categoryId: string) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
    setDirection("forward");
    setStep(2);
  };

  const handleBackToTags = () => {
    setDirection("backward");
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const now = new Date();
      const selectedDate = new Date(`${formData.date}T${formData.startTime}`);
      if (selectedDate <= now) {
        throw new Error("Cannot select a date and time in the past.");
      }

      // Location and max companions removed from form; handled with sensible defaults
      const payload = {
        ...formData,
        locationName: "Flexible / Local Area",
        maxParticipants: "2",
      };

      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create activity");
      }

      router.push(`/activities/${data.activity.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-28">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/discover?mode=companion"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Activities</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-dark-border p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Step Progress Header */}
        <div className="mb-6 pb-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/80 text-brand-800 dark:text-brand-300 mb-2 border border-brand-200 dark:border-brand-800/60">
              <Users className="w-3.5 h-3.5" />
              <span>Companion Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Post an Activity
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">
              {step === 1
                ? "First, choose the activity tag or category you want to do."
                : "Fill in the details for your planned activity."}
            </p>
          </div>

          {/* Stepper Pill */}
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-dark-elevated text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-dark-border">
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
        {/* STEP 1: CHOOSE ACTIVITY TAG (SLIDE CONTAINER) */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="animate-slide-in-left space-y-6">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Select Activity Tag
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Tap on any tag below to continue. The form will slide forward automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {CATEGORIES.map((cat) => {
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-3.5 group hover:shadow-md ${
                      isSelected
                        ? "bg-brand-50 dark:bg-brand-950/70 border-brand-500 text-slate-900 dark:text-white ring-2 ring-brand-500/30"
                        : "bg-slate-50 dark:bg-dark-elevated border-slate-200 dark:border-dark-border text-slate-900 dark:text-slate-100 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-white dark:hover:bg-dark-card"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-white dark:bg-dark-card shadow-sm border border-slate-200 dark:border-dark-border shrink-0 group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="block text-sm font-bold text-slate-900 dark:text-white">
                          {cat.label}
                        </span>
                        {cat.popular && (
                          <span className="text-[10px] font-bold text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/60 px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="block text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 font-medium">
                        {cat.hint}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 self-center shrink-0 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: DETAILS FORM (SLIDES IN WHEN TAG IS SELECTED) */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="animate-slide-in-right space-y-6">
            {/* Active Tag Bar & Change Button */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white dark:bg-dark-elevated shadow-xs">
                  {selectedCategoryObj?.icon}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-brand-800 dark:text-brand-300 uppercase tracking-wider block">
                    Selected Tag
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {selectedCategoryObj?.label}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBackToTags}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-700 dark:text-brand-300 bg-white dark:bg-dark-card border border-brand-300 dark:border-brand-700 hover:bg-brand-100 dark:hover:bg-dark-elevated transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Tag</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title & Description */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Activity Title *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Screening of Wim Wenders 'Perfect Days' + Post-Film Coffee"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated px-4 py-2.5 text-xs text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Description & Plan *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe what you plan to do, why you're excited about this activity, and what kind of companion would enjoy joining..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated p-4 text-xs text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* Date, Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Date *
                  </label>
                  <input
                    required
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Start Time *
                  </label>
                  <input
                    required
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Duration (approx. hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="12"
                    value={formData.approxDurationHours}
                    onChange={(e) => setFormData({ ...formData, approxDurationHours: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Preferences: Gender & Cutoff (Location and Max Companions removed) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Gender Preference
                  </label>
                  <select
                    value={formData.genderPreference}
                    onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="ANY">Any gender welcome</option>
                    <option value="FEMALE_ONLY">Women only</option>
                    <option value="MALE_ONLY">Men only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Request Cutoff (Hours before start)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="48"
                    value={formData.cutoffHoursBeforeStart}
                    onChange={(e) => setFormData({ ...formData, cutoffHoursBeforeStart: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  Joining Requirements or Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please purchase ticket in advance, or bring comfortable shoes"
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                  className="w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              {/* Optional Image */}
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  Cover Image (Optional)
                </label>
                <div className="w-full">
                  {formData.imageUrl ? (
                    <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-slate-200 dark:border-dark-border shadow-sm">
                      <img src={formData.imageUrl} alt="Upload preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, imageUrl: "" })}
                        className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white rounded-full p-1.5 hover:bg-rose-500 transition-colors shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-slate-300 dark:border-dark-border bg-slate-50 dark:bg-dark-elevated hover:bg-slate-100 dark:hover:bg-dark-card hover:border-brand-400 dark:hover:border-brand-500 transition-colors cursor-pointer group">
                      <div className="flex flex-col items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-brand-500 mb-2 transition-colors" />
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Click to upload an image</p>
                        <p className="text-[10px] text-slate-400 mt-1">JPEG, PNG, WEBP up to 5MB</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              {/* Notice */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Organizer Review & Safety
                </span>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Interested companions will submit requests. You review their profile and approve before the private 1-on-1 or group chat is unlocked.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-dark-border">
                <button
                  type="button"
                  onClick={handleBackToTags}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-elevated transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Tags</span>
                </button>

                <div className="flex items-center gap-3">
                  <Link
                    href="/discover?mode=companion"
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-elevated transition"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full text-xs font-extrabold text-emerald-950 dark:text-emerald-200 bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 dark:from-emerald-950/80 dark:to-teal-950/70 hover:from-emerald-200 hover:to-teal-100 border border-emerald-300/80 dark:border-emerald-800/60 disabled:opacity-60 transition shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
                    <span>{isSubmitting ? "Publishing..." : "Publish Activity"}</span>
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
