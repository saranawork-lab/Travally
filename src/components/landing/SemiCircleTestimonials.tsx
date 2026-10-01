"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Star,
  BadgeCheck,
  ShieldCheck,
  Quote,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface TestimonialItem {
  name: string;
  avatarUrl?: string;
  city: string;
  role: string;
  quote: string;
  badge: string;
  type: string;
  rating?: number;
  activityTitle?: string;
}

interface SemiCircleTestimonialsProps {
  testimonials: TestimonialItem[];
}

export function SemiCircleTestimonials({ testimonials }: SemiCircleTestimonialsProps) {
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Card geometry: 360px card + 24px gap = 384px per item
  const CARD_WIDTH = 360;
  const GAP = 24;
  const ITEM_WIDTH = CARD_WIDTH + GAP;
  const HALF_WIDTH = ITEM_WIDTH * testimonials.length;
  const SPEED = 45; // Smooth, readable pixels per second

  // Duplicate items for a mathematically seamless infinite loop
  const displayItems = [...testimonials, ...testimonials];

  const animate = useCallback(
    (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!isPaused && HALF_WIDTH > 0) {
        setOffset((prev) => {
          const next = prev + (SPEED * delta) / 1000;
          return next >= HALF_WIDTH ? next - HALF_WIDTH : next;
        });
      }

      animRef.current = requestAnimationFrame(animate);
    },
    [isPaused, HALF_WIDTH]
  );

  useEffect(() => {
    lastTimeRef.current = 0;
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [animate]);

  const handlePrev = () => {
    setOffset((prev) => (prev - ITEM_WIDTH + HALF_WIDTH) % HALF_WIDTH);
  };

  const handleNext = () => {
    setOffset((prev) => (prev + ITEM_WIDTH) % HALF_WIDTH);
  };

  return (
    <div
      className="relative w-full overflow-hidden select-none py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-48 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Left & Right Edge Gradient Fade Masks for seamless appearance */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-white via-white/80 dark:from-[#090d0b] dark:via-[#090d0b]/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-white via-white/80 dark:from-[#090d0b] dark:via-[#090d0b]/80 to-transparent z-20 pointer-events-none" />

      {/* Floating Navigation Controls */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden sm:flex">
        <button
          onClick={handlePrev}
          type="button"
          aria-label="Previous review"
          className="w-10 h-10 rounded-full bg-white/90 dark:bg-[#121915]/90 backdrop-blur-md border border-slate-200/90 dark:border-emerald-900/60 shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-110 hover:border-emerald-500 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden sm:flex">
        <button
          onClick={handleNext}
          type="button"
          aria-label="Next review"
          className="w-10 h-10 rounded-full bg-white/90 dark:bg-[#121915]/90 backdrop-blur-md border border-slate-200/90 dark:border-emerald-900/60 shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-110 hover:border-emerald-500 transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Single-Line Conveyor Track */}
      <div className="w-full flex items-center py-6">
        <div
          className="flex items-stretch gap-6 transition-transform ease-linear duration-75"
          style={{
            transform: `translate3d(-${offset}px, 0, 0)`,
            willChange: "transform",
          }}
        >
          {displayItems.map((t, idx) => (
            <div
              key={idx}
              className={`
                w-[320px] sm:w-[360px] shrink-0
                p-5 sm:p-6 rounded-3xl
                bg-white/95 dark:bg-[#111915]/95 backdrop-blur-xl
                border border-slate-200/90 dark:border-emerald-950/80
                shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                transition-all duration-300 transform-gpu
                hover:-translate-y-2 hover:scale-[1.02]
                hover:border-emerald-500/60 dark:hover:border-emerald-500/50
                hover:shadow-[0_20px_45px_rgba(16,185,129,0.18)]
                flex flex-col justify-between
                relative overflow-hidden group
              `}
            >
              {/* Top Accent Gradient Stripe */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  t.type === "Travel Expedition"
                    ? "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400"
                    : "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400"
                }`}
              />

              {/* Upper Section: Rating + Category + Activity Pill */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      5.0
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      t.type === "Travel Expedition"
                        ? "bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/60"
                        : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                    }`}
                  >
                    {t.type}
                  </span>
                </div>

                {/* Specific Verified Activity Pill */}
                {t.activityTitle && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-[#16221c] border border-slate-200/70 dark:border-emerald-950/70 text-[11px] font-semibold text-slate-700 dark:text-slate-300 max-w-full">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{t.activityTitle}</span>
                  </div>
                )}

                {/* Review Quote */}
                <div className="relative pt-1">
                  <Quote className="w-6 h-6 absolute -top-1.5 -left-1 opacity-10 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
                  <p className="relative z-10 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed font-normal italic pl-2">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Lower Section: Author & Verified Credentials */}
              <div className="flex items-center gap-3 pt-3.5 mt-3 border-t border-slate-100 dark:border-emerald-950/70">
                <div className="relative shrink-0">
                  {t.avatarUrl ? (
                    <img
                      src={t.avatarUrl}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40 shadow-xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xs flex items-center justify-center ring-2 ring-emerald-500/30 shadow-xs">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-1.5 ring-white dark:ring-[#111915]">
                    <BadgeCheck className="w-3 h-3" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {t.name}
                    </h4>
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-900/60 shrink-0">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {t.city} • <span className="text-slate-600 dark:text-slate-300 font-medium">{t.role}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
