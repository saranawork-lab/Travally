"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface GenderSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Others" },
];

export const GenderSelect: React.FC<GenderSelectProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedOption = GENDER_OPTIONS.find((opt) => opt.value === value) || GENDER_OPTIONS[0];

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Gender"
        className={`w-full h-10 px-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer select-none ${
          isOpen
            ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-[#16201b] text-emerald-600 dark:text-emerald-400"
            : "border-slate-200 dark:border-emerald-950/70 bg-white dark:bg-[#16201b] text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-emerald-800"
        }`}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-emerald-500" : ""
          }`}
        />
      </button>

      {/* Custom Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full rounded-2xl bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/90 shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          {GENDER_OPTIONS.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-between text-left cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2520] hover:text-emerald-600 dark:hover:text-emerald-400"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
