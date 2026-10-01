"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";

interface BirthDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  className?: string;
}

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

export const BirthDatePicker: React.FC<BirthDatePickerProps> = ({
  value,
  onChange,
  className = "",
}) => {
  // Active open dropdown: 'day' | 'month' | 'year' | null
  const [openDropdown, setOpenDropdown] = useState<"day" | "month" | "year" | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dayListRef = useRef<HTMLDivElement>(null);
  const monthListRef = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Parse current value
  const [currentYear, currentMonth, currentDay] = useMemo(() => {
    if (!value || !value.includes("-")) {
      return ["1998", "06", "15"];
    }
    const parts = value.split("-");
    return [
      parts[0] || "1998",
      parts[1] ? parts[1].padStart(2, "0") : "06",
      parts[2] ? parts[2].padStart(2, "0") : "15",
    ];
  }, [value]);

  // Allowed Years: Up to 2015 down to 1940
  const maxYear = 2015;
  const minYear = 1940;
  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, [maxYear, minYear]);

  // Days in month
  const daysInMonth = useMemo(() => {
    const y = parseInt(currentYear, 10) || 1998;
    const m = parseInt(currentMonth, 10) || 6;
    return new Date(y, m, 0).getDate();
  }, [currentYear, currentMonth]);

  const days = useMemo(() => {
    const list: string[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      list.push(d.toString().padStart(2, "0"));
    }
    return list;
  }, [daysInMonth]);

  // Auto-scroll to selected element when dropdown opens
  useEffect(() => {
    if (openDropdown === "year" && yearListRef.current) {
      const selectedEl = yearListRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "center" });
      }
    } else if (openDropdown === "month" && monthListRef.current) {
      const selectedEl = monthListRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "center" });
      }
    } else if (openDropdown === "day" && dayListRef.current) {
      const selectedEl = dayListRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "center" });
      }
    }
  }, [openDropdown]);

  const selectDay = (day: string) => {
    onChange(`${currentYear}-${currentMonth}-${day}`);
    setOpenDropdown(null);
  };

  const selectMonth = (month: string) => {
    const maxD = new Date(parseInt(currentYear, 10), parseInt(month, 10), 0).getDate();
    const safeDay = parseInt(currentDay, 10) > maxD ? maxD.toString().padStart(2, "0") : currentDay;
    onChange(`${currentYear}-${month}-${safeDay}`);
    setOpenDropdown(null);
  };

  const selectYear = (year: number) => {
    const maxD = new Date(year, parseInt(currentMonth, 10), 0).getDate();
    const safeDay = parseInt(currentDay, 10) > maxD ? maxD.toString().padStart(2, "0") : currentDay;
    onChange(`${year}-${currentMonth}-${safeDay}`);
    setOpenDropdown(null);
  };

  return (
    <div ref={containerRef} className={`grid grid-cols-3 gap-1.5 relative ${className}`}>
      {/* ── 1. DAY SELECTOR ── */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "day" ? null : "day")}
          className={`w-full h-10 px-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer select-none ${
            openDropdown === "day"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-[#16201b] text-emerald-600 dark:text-emerald-400"
              : "border-slate-200 dark:border-emerald-950/70 bg-white dark:bg-[#16201b] text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-emerald-800"
          }`}
        >
          <span>{currentDay}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              openDropdown === "day" ? "rotate-180 text-emerald-500" : ""
            }`}
          />
        </button>

        {openDropdown === "day" && (
          <div
            ref={dayListRef}
            className="absolute left-0 top-full mt-1.5 w-full max-h-48 overflow-y-auto rounded-2xl bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/90 shadow-xl p-1 z-50 scrollbar-thin"
          >
            {days.map((d) => {
              const isSelected = d === currentDay;
              return (
                <button
                  key={d}
                  type="button"
                  data-selected={isSelected}
                  onClick={() => selectDay(d)}
                  className={`w-full py-1.5 px-2 rounded-xl text-xs font-semibold transition text-center flex items-center justify-center gap-1 ${
                    isSelected
                      ? "bg-emerald-600 text-white font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2520] hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 2. MONTH SELECTOR ── */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "month" ? null : "month")}
          className={`w-full h-10 px-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer select-none ${
            openDropdown === "month"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-[#16201b] text-emerald-600 dark:text-emerald-400"
              : "border-slate-200 dark:border-emerald-950/70 bg-white dark:bg-[#16201b] text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-emerald-800"
          }`}
        >
          <span>{MONTHS.find((m) => m.value === currentMonth)?.label || currentMonth}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              openDropdown === "month" ? "rotate-180 text-emerald-500" : ""
            }`}
          />
        </button>

        {openDropdown === "month" && (
          <div
            ref={monthListRef}
            className="absolute left-0 top-full mt-1.5 w-full max-h-48 overflow-y-auto rounded-2xl bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/90 shadow-xl p-1 z-50 scrollbar-thin"
          >
            {MONTHS.map((m) => {
              const isSelected = m.value === currentMonth;
              return (
                <button
                  key={m.value}
                  type="button"
                  data-selected={isSelected}
                  onClick={() => selectMonth(m.value)}
                  className={`w-full py-1.5 px-2 rounded-xl text-xs font-semibold transition text-center flex items-center justify-center gap-1 ${
                    isSelected
                      ? "bg-emerald-600 text-white font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2520] hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 3. YEAR SELECTOR (Allows till 2015) ── */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "year" ? null : "year")}
          className={`w-full h-10 px-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer select-none ${
            openDropdown === "year"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-[#16201b] text-emerald-600 dark:text-emerald-400"
              : "border-slate-200 dark:border-emerald-950/70 bg-white dark:bg-[#16201b] text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-emerald-800"
          }`}
        >
          <span>{currentYear}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              openDropdown === "year" ? "rotate-180 text-emerald-500" : ""
            }`}
          />
        </button>

        {openDropdown === "year" && (
          <div
            ref={yearListRef}
            className="absolute left-0 top-full mt-1.5 w-full max-h-48 overflow-y-auto rounded-2xl bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/90 shadow-xl p-1 z-50 scrollbar-thin"
          >
            {years.map((y) => {
              const isSelected = y.toString() === currentYear;
              return (
                <button
                  key={y}
                  type="button"
                  data-selected={isSelected}
                  onClick={() => selectYear(y)}
                  className={`w-full py-1.5 px-2 rounded-xl text-xs font-semibold transition text-center flex items-center justify-center gap-1 ${
                    isSelected
                      ? "bg-emerald-600 text-white font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2520] hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                >
                  {y}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
