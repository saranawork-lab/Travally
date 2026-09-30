"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Star,
  BadgeCheck,
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
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const CARD_WIDTH = 270; // px (card + gap effective width)
  const TOTAL_WIDTH = CARD_WIDTH * testimonials.length;
  const SPEED = 80; // px per second

  // Smooth continuous scroll animation
  const animate = useCallback(
    (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!isPaused) {
        setOffset((prev) => {
          const next = prev + (SPEED * delta) / 1000;
          // Loop seamlessly
          return next >= TOTAL_WIDTH ? next - TOTAL_WIDTH : next;
        });
      }

      animRef.current = requestAnimationFrame(animate);
    },
    [isPaused, TOTAL_WIDTH]
  );

  useEffect(() => {
    lastTimeRef.current = 0;
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [animate]);

  /**
   * For each card, compute its position along a horizontal arc.
   * - `t` is a normalized position from -0.5 (far left) to +0.5 (far right)
   * - The vertical position follows a parabolic arc (upside-down U)
   * - Opacity fades at the edges
   * - Scale shrinks at the edges
   */
  const getCardTransform = (index: number) => {
    const containerWidth =
      containerRef.current?.offsetWidth ?? 1100;

    // The "virtual x" position of this card in the infinite scroll
    let rawX = index * CARD_WIDTH - offset;

    // Wrap around for infinite loop — keep cards within [-CARD_WIDTH, TOTAL_WIDTH]
    while (rawX < -CARD_WIDTH) rawX += TOTAL_WIDTH;
    while (rawX > TOTAL_WIDTH - CARD_WIDTH) rawX -= TOTAL_WIDTH;

    // Center the track in the container
    const centeredX = rawX - containerWidth / 2 + CARD_WIDTH / 2;

    // Normalize to [-1, 1] — use full container width so cards span edge to edge
    const halfVisible = containerWidth / 2;
    const t = centeredX / halfVisible; // -1 = left edge, 0 = center, 1 = right edge

    // Arc: strong parabolic curve — center is highest, edges dip down dramatically
    const arcHeight = 75; // max vertical dip in px at the edges
    const y = arcHeight * t * t;

    // Rotation along the arc — stronger tilt following the curve
    const rotation = t * 6; // degrees

    // Scale: largest at center, shrinks towards edges
    const scale = 1 - 0.15 * Math.abs(t);

    // Smooth fade at edges — cards gradually become transparent
    const absT = Math.abs(t);
    let opacity: number;
    if (absT < 0.45) {
      opacity = 1;
    } else if (absT < 1.0) {
      opacity = 1 - (absT - 0.45) / 0.55;
    } else {
      opacity = 0;
    }

    // If card is fully off-screen, hide completely
    if (absT > 1.05) {
      return {
        transform: `translate3d(${centeredX}px, ${y}px, 0) scale(0.6) rotate(${rotation}deg)`,
        opacity: 0,
        pointerEvents: "none" as const,
        visibility: "hidden" as const,
      };
    }

    return {
      transform: `translate3d(${centeredX}px, ${y}px, 0) scale(${scale}) rotate(${rotation}deg)`,
      opacity,
      pointerEvents: opacity > 0.1 ? ("auto" as const) : ("none" as const),
      visibility: "visible" as const,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto select-none"
      style={{ minHeight: "340px" }}
    >

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-56 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />



      {/* Cards moving along the arc */}
      <div
        className="relative h-[310px] flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {testimonials.map((t, idx) => {
          const style = getCardTransform(idx);

          return (
            <div
              key={idx}
              className="absolute"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              style={{
                ...style,
                willChange: "transform, opacity",
                left: "50%",
                top: "50%",
                marginLeft: `-${CARD_WIDTH / 2}px`,
                marginTop: "-105px",
              }}
            >
              <div
                className={`
                  w-[240px] sm:w-[250px]
                  p-4 rounded-xl
                  bg-white dark:bg-[#111815]
                  border border-slate-200/80 dark:border-emerald-950/70
                  shadow-[0_6px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.3)]
                  transition-shadow duration-300
                  hover:shadow-[0_12px_36px_rgba(16,185,129,0.15)]
                `}
              >
                {/* Stars + Badge */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40">
                      {t.type}
                    </span>
                  </div>

                  {/* Quote — truncated */}
                  <div className="relative">
                    <Quote className="w-4 h-4 absolute -top-0.5 -left-0.5 opacity-[0.07] text-emerald-500" />
                    <p className="relative z-10 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic pl-1 min-h-[56px]">
                      &ldquo;{t.quote.length > 120 ? t.quote.slice(0, 120).trimEnd() + "…" : t.quote}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2.5 pt-2.5 mt-1.5 border-t border-slate-200/70 dark:border-emerald-950/60">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-xs flex items-center justify-center ring-2 ring-emerald-500/30 shadow-sm shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 truncate">
                      <span>{t.name}</span>
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20 shrink-0" />
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {t.city} •{" "}
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {t.badge}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
