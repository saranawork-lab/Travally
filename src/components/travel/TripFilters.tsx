"use client";

import React from "react";
import { Search } from "lucide-react";

const TRAVEL_STYLES = [
  { id: "ALL", label: "All Styles" },
  { id: "CULTURAL", label: "Cultural & Heritage" },
  { id: "SLOW_TRAVEL", label: "Slow Travel" },
  { id: "BACKPACKING", label: "Backpacking" },
  { id: "ADVENTURE", label: "Adventure & Hiking" },
  { id: "ROAD_TRIP", label: "Road Trip" },
  { id: "LUXURY", label: "Boutique & Luxury" },
];

interface TripFiltersProps {
  selectedStyle: string;
  onSelectStyle: (style: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TripFilters: React.FC<TripFiltersProps> = ({
  selectedStyle,
  onSelectStyle,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search trips by destination (e.g. Tokyo, Barcelona, Switzerland) or attraction..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TRAVEL_STYLES.map((st) => {
          const isActive = selectedStyle === st.id;
          return (
            <button
              key={st.id}
              onClick={() => onSelectStyle(st.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all select-none ${
                isActive
                  ? "bg-amber-600 text-white shadow-sm font-semibold"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {st.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TripFilters;
