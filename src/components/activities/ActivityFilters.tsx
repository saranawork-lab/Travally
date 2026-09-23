"use client";

import React from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

const CATEGORIES = [
  { id: "ALL", label: "All Activities" },
  { id: "MOVIES", label: "Movies & Cinema" },
  { id: "FOOD_CAFES", label: "Food & Cafes" },
  { id: "WALKING", label: "Walking & Trails" },
  { id: "STUDYING", label: "Studying & Work" },
  { id: "EVENTS", label: "Events & Shows" },
  { id: "CITY_EXPLORATION", label: "City Exploration" },
  { id: "SHOPPING", label: "Shopping" },
];

interface ActivityFiltersProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search activities by title, neighborhood (e.g. Mission, Hayes Valley), or keywords..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
        />
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all select-none ${
                isActive
                  ? "bg-teal-600 text-white shadow-sm font-semibold"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFilters;
