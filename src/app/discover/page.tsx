"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ModeToggle, AppMode } from "@/components/common/ModeToggle";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { ActivityFilters } from "@/components/activities/ActivityFilters";
import { TripCard } from "@/components/travel/TripCard";
import { TripFilters } from "@/components/travel/TripFilters";
import { PlusCircle, Sparkles } from "lucide-react";
import Link from "next/link";

function DiscoverContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialMode = (searchParams.get("mode") as AppMode) || "companion";
  const [mode, setMode] = useState<AppMode>(initialMode);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Companion state
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activitySearch, setActivitySearch] = useState("");
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Travel state
  const [travelPlans, setTravelPlans] = useState<any[]>([]);
  const [selectedTravelStyle, setSelectedTravelStyle] = useState("ALL");
  const [tripSearch, setTripSearch] = useState("");
  const [loadingTrips, setLoadingTrips] = useState(true);

  // Load user
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Update mode when URL param changes
  useEffect(() => {
    const urlMode = searchParams.get("mode") as AppMode;
    if (urlMode && (urlMode === "companion" || urlMode === "travel")) {
      setMode(urlMode);
    }
  }, [searchParams]);

  // Fetch activities
  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "ALL") params.set("category", selectedCategory);
      if (activitySearch.trim()) params.set("search", activitySearch.trim());

      const res = await fetch(`/api/activities?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Fetch travel plans
  const fetchTravelPlans = async () => {
    setLoadingTrips(true);
    try {
      const params = new URLSearchParams();
      if (selectedTravelStyle !== "ALL") params.set("style", selectedTravelStyle);
      if (tripSearch.trim()) params.set("search", tripSearch.trim());

      const res = await fetch(`/api/travel?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTravelPlans(data.travelPlans || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTrips(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [selectedCategory, activitySearch]);

  useEffect(() => {
    fetchTravelPlans();
  }, [selectedTravelStyle, tripSearch]);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    router.replace(`/discover?mode=${newMode}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-24">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {mode === "companion" ? "Discover Companions" : "Discover Travel Expeditions"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {mode === "companion"
              ? "Find people to join you for movies, cafes, walks, and shared activities"
              : "Find compatible travel partners for upcoming trips and adventures"}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <ModeToggle currentMode={mode} onModeChange={handleModeChange} />

          <Link
            href={mode === "companion" ? "/activities/create" : "/travel/create"}
            className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-sm transition hover:shadow ${
              mode === "companion"
                ? "bg-teal-600 hover:bg-teal-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{mode === "companion" ? "Post Activity" : "Create Trip"}</span>
          </Link>
        </div>
      </div>

      {/* Mode 1: COMPANION FEED */}
      {mode === "companion" && (
        <section className="space-y-6">
          <ActivityFilters
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={activitySearch}
            onSearchChange={setActivitySearch}
          />

          {loadingActivities ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-850 animate-pulse border border-slate-200 dark:border-slate-800"
                />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto">
              <Sparkles className="w-10 h-10 text-teal-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No activities match your filter
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Be the first to organize an activity for this category in your area!
              </p>
              <div className="pt-4">
                <Link
                  href="/activities/create"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create an Activity</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((act) => (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  currentUser={currentUser}
                  onRefresh={fetchActivities}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Mode 2: TRAVEL FEED */}
      {mode === "travel" && (
        <section className="space-y-6">
          <TripFilters
            selectedStyle={selectedTravelStyle}
            onSelectStyle={setSelectedTravelStyle}
            searchQuery={tripSearch}
            onSearchChange={setTripSearch}
          />

          {loadingTrips ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-850 animate-pulse border border-slate-200 dark:border-slate-800"
                />
              ))}
            </div>
          ) : travelPlans.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto">
              <Sparkles className="w-10 h-10 text-amber-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No trips found for this destination or style
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Post your upcoming destination and connect with fellow explorers traveling at the same time.
              </p>
              <div className="pt-4">
                <Link
                  href="/travel/create"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Publish a Travel Plan</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {travelPlans.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  currentUser={currentUser}
                  onRefresh={fetchTravelPlans}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading discover feed...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
