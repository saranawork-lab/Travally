"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Star,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Quote,
} from "lucide-react";

export interface TestimonialItem {
  name: string;
  city: string;
  role: string;
  quote: string;
  badge: string;
  type: string;
  rating?: number;
  avatarColor?: string;
}

interface SemiCircleTestimonialsProps {
  testimonials: TestimonialItem[];
}

export function SemiCircleTestimonials({ testimonials }: SemiCircleTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Responsive screen size detection for exact arc coordinates
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Advance right-to-left
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-scroll along semi-circle from right to left every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      // Swiped left -> move right-to-left
      handleNext();
    } else if (diff < -45) {
      // Swiped right -> move left-to-right
      handlePrev();
    }
    touchStartX.current = null;
  };

  /**
   * Calculate exact position along the semi-circle arc for each card.
   * Slot 0 is apex/summit (center).
   * Positive slots (+1, +2) curve down towards the right.
   * Negative slots (-1, -2) curve down towards the left.
   */
  const getCardStyle = (index: number) => {
    const total = testimonials.length;
    let diff = (index - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    // Radius / spread configs per breakpoint
    let xSpread = 330;
    let yCurve = 42;
    let rotationAngle = 8;
    let cardScale = 0.9;

    if (isMobile) {
      xSpread = 165;
      yCurve = 22;
      rotationAngle = 5;
      cardScale = 0.84;
    } else if (isTablet) {
      xSpread = 240;
      yCurve = 32;
      rotationAngle = 6.5;
      cardScale = 0.88;
    }

    if (diff === 0) {
      // CENTER APEX / SUMMIT
      return {
        transform: "translate3d(0, 0, 0) scale(1.05) rotate(0deg)",
        opacity: 1,
        zIndex: 30,
        pointerEvents: "auto" as const,
        filter: "drop-shadow(0 20px 30px rgba(16, 185, 129, 0.18))",
      };
    } else if (diff === 1) {
      // RIGHT SLOT +1 (Approaching center from right)
      return {
        transform: `translate3d(${xSpread}px, ${yCurve}px, -60px) scale(${cardScale}) rotate(${rotationAngle}deg)`,
        opacity: isMobile ? 0.45 : 0.82,
        zIndex: 20,
        pointerEvents: "auto" as const,
        filter: "blur(0.4px)",
      };
    } else if (diff === -1) {
      // LEFT SLOT -1 (Exiting center to left)
      return {
        transform: `translate3d(-${xSpread}px, ${yCurve}px, -60px) scale(${cardScale}) rotate(-${rotationAngle}deg)`,
        opacity: isMobile ? 0.45 : 0.82,
        zIndex: 20,
        pointerEvents: "auto" as const,
        filter: "blur(0.4px)",
      };
    } else if (diff === 2) {
      // FAR RIGHT SLOT +2 (Entering on the far right)
      const farX = xSpread * 1.82;
      const farY = yCurve * 2.5;
      return {
        transform: `translate3d(${farX}px, ${farY}px, -140px) scale(${cardScale * 0.86}) rotate(${rotationAngle * 1.8}deg)`,
        opacity: isMobile ? 0 : 0.35,
        zIndex: 10,
        pointerEvents: "auto" as const,
        filter: "blur(1px)",
      };
    } else if (diff === -2) {
      // FAR LEFT SLOT -2 (Exiting on the far left)
      const farX = -xSpread * 1.82;
      const farY = yCurve * 2.5;
      return {
        transform: `translate3d(${farX}px, ${farY}px, -140px) scale(${cardScale * 0.86}) rotate(-${rotationAngle * 1.8}deg)`,
        opacity: isMobile ? 0 : 0.35,
        zIndex: 10,
        pointerEvents: "auto" as const,
        filter: "blur(1px)",
      };
    } else {
      // HIDDEN OFF-STAGE
      const dir = diff > 0 ? 1 : -1;
      return {
        transform: `translate3d(${dir * xSpread * 2.2}px, ${yCurve * 3}px, -200px) scale(0.6)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none" as const,
      };
    }
  };

  return (
    <div
      className="relative w-full max-w-7xl mx-auto overflow-hidden py-8 sm:py-12 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative Semi-Circle Orbit Path Indicator (SVG Arc) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <svg
          className="w-full max-w-5xl h-72 sm:h-96 opacity-40 dark:opacity-20"
          viewBox="0 0 900 360"
          fill="none"
        >
          <path
            d="M 60,320 Q 450,40 840,320"
            stroke="url(#semiCircleGradient)"
            strokeWidth="2.5"
            strokeDasharray="6 8"
          />
          <defs>
            <linearGradient id="semiCircleGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.05" />
              <stop offset="25%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>

        {/* Atmospheric Ambient Lighting behind the semi-circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-emerald-500/12 rounded-full blur-[90px] pointer-events-none" />
      </div>

      {/* 3D Semi-Circle Arc Stage */}
      <div
        className="relative h-[380px] sm:h-[420px] flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {testimonials.map((t, idx) => {
          const style = getCardStyle(idx);
          const isCenter = idx === activeIndex;

          return (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={style}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[295px] sm:w-[350px] md:w-[380px] p-6 rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer transform-gpu ${
                isCenter
                  ? "bg-white dark:bg-[#111815] border-2 border-emerald-500/60 shadow-[0_22px_50px_rgba(16,185,129,0.25)] ring-2 ring-emerald-400/40"
                  : "bg-slate-50/90 dark:bg-[#0e1411]/90 border border-slate-200 dark:border-emerald-950/80 hover:border-emerald-500/50 hover:bg-white dark:hover:bg-[#131c18]"
              }`}
            >
              {/* Card Quote icon & top row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors ${
                      isCenter
                        ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40 shadow-xs"
                        : "bg-slate-200/70 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-400"
                    }`}
                  >
                    {t.type}
                  </span>
                </div>

                <div className="relative">
                  <Quote
                    className={`w-6 h-6 absolute -top-1 -left-1 opacity-10 transition-colors ${
                      isCenter ? "text-emerald-500" : "text-slate-400"
                    }`}
                  />
                  <p className="relative z-10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic pl-1 min-h-[92px] sm:min-h-[105px]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Author Row */}
              <div className="flex items-center gap-3 pt-3.5 mt-2 border-t border-slate-200/80 dark:border-emerald-950/70">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-sm flex items-center justify-center ring-2 ring-emerald-500/40 shadow-md shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 truncate">
                    <span>{t.name}</span>
                    <BadgeCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/20 shrink-0" />
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {t.city} •{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {t.badge}
                    </span>
                  </p>
                </div>
              </div>

              {/* Center Active Indicator Badge */}
              {isCenter && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[9px] font-black uppercase tracking-widest shadow-md">
                  Active Story
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Controls Bar: Prev / Next / Pause / Indicators */}
      <div className="relative z-20 mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 max-w-xl mx-auto">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous story (scroll right)"
            className="w-10 h-10 rounded-full bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 hover:border-emerald-500 text-slate-700 dark:text-slate-200 hover:text-emerald-500 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            title="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            className="px-3 h-10 rounded-full bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 hover:border-emerald-500 text-slate-700 dark:text-slate-200 hover:text-emerald-500 flex items-center gap-1.5 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            title={isPaused ? "Resume right-to-left semi-circle scroll" : "Pause scroll"}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                <span>Play</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Scrolling ↺</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            aria-label="Next story (scroll left)"
            className="w-10 h-10 rounded-full bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 hover:border-emerald-500 text-slate-700 dark:text-slate-200 hover:text-emerald-500 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            title="Scroll Right-to-Left"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Semi-Circle Position Dot Indicators */}
        <div className="flex items-center gap-1.5">
          {testimonials.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to ${t.name}'s story`}
              className={`transition-all duration-300 rounded-full h-2 ${
                idx === activeIndex
                  ? "w-8 bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]"
                  : "w-2 bg-slate-300 dark:bg-emerald-950 hover:bg-emerald-400/50"
              }`}
              title={`${t.name} (${t.city})`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
