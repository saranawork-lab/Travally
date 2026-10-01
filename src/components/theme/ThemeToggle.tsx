"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabel = false,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-14 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 animate-pulse ${className}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className="group relative w-14 h-8 rounded-full p-1 cursor-pointer select-none transition-colors duration-500 ease-in-out border shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 bg-slate-200 hover:bg-slate-300/80 border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
      >
        {/* Background Icons on track */}
        <div className="absolute inset-0 px-2 flex items-center justify-between pointer-events-none">
          {/* Sun on left */}
          <Sun
            className={`w-3.5 h-3.5 transition-all duration-300 ${
              isDark
                ? "text-slate-500 opacity-40 scale-75"
                : "text-amber-500 opacity-90 scale-100"
            }`}
          />
          {/* Moon on right */}
          <Moon
            className={`w-3.5 h-3.5 transition-all duration-300 ${
              isDark
                ? "text-indigo-400 opacity-90 scale-100"
                : "text-slate-400 opacity-40 scale-75"
            }`}
          />
        </div>

        {/* Sliding Thumb Knob with Spring Animation */}
        <div
          className={`relative z-10 w-6 h-6 rounded-full bg-white dark:bg-[#0f172a] shadow-md flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isDark
              ? "translate-x-6 text-indigo-400 shadow-indigo-950/50"
              : "translate-x-0 text-amber-500 shadow-slate-400/30"
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 transform transition-transform duration-500 -rotate-12 group-hover:rotate-0" />
          ) : (
            <Sun className="w-3.5 h-3.5 transform transition-transform duration-500 rotate-0 group-hover:rotate-45" />
          )}
        </div>
      </button>

      {showLabel && (
        <span className="text-xs font-bold text-slate-700 dark:text-gray-300 select-none">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </div>
  );
};

export default ThemeToggle;
