"use client";

import React from "react";
import { Play } from "lucide-react";

/**
 * Realistic Golden Metallic EMV Smart Card Chip
 * Replicated with precision SVG gradients and circuit engravings
 * matching the user's digital card reference (media_1790282834099.png)
 */
export const EmvChip: React.FC<{ className?: string; size?: "sm" | "md" | "lg" }> = ({
  className = "",
  size = "md",
}) => {
  const dimensions =
    size === "sm"
      ? { width: 34, height: 24 }
      : size === "lg"
      ? { width: 50, height: 36 }
      : { width: 42, height: 30 };

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 56 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-md ${className}`}
      aria-label="EMV Smart Chip"
    >
      <defs>
        <linearGradient id="goldGradient" x1="0" y1="0" x2="56" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F9D46A" />
          <stop offset="25%" stopColor="#E2A62C" />
          <stop offset="50%" stopColor="#FDE68A" />
          <stop offset="75%" stopColor="#D98A17" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="chipBorder" x1="0" y1="0" x2="56" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
      </defs>

      {/* Chip Base */}
      <rect
        x="1.5"
        y="1.5"
        width="53"
        height="37"
        rx="7"
        fill="url(#goldGradient)"
        stroke="url(#chipBorder)"
        strokeWidth="1.5"
      />

      {/* Internal Circuits */}
      {/* Top horizontal divider */}
      <path d="M7 13.5H49" stroke="#92400E" strokeWidth="1" strokeOpacity="0.75" />
      {/* Bottom horizontal divider */}
      <path d="M7 26.5H49" stroke="#92400E" strokeWidth="1" strokeOpacity="0.75" />
      {/* Center line */}
      <path d="M12 20H44" stroke="#92400E" strokeWidth="1.2" strokeOpacity="0.8" />
      {/* Left circuit loop */}
      <circle cx="20" cy="20" r="5" stroke="#92400E" strokeWidth="1" strokeOpacity="0.75" fill="none" />
      {/* Right circuit loop */}
      <circle cx="36" cy="20" r="5" stroke="#92400E" strokeWidth="1" strokeOpacity="0.75" fill="none" />
    </svg>
  );
};

/**
 * Contactless / NFC Payment Waves Indicator
 */
export const ContactlessIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 18,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Contactless Indicator"
    >
      <path
        d="M6 12C6 8.68629 8.68629 6 12 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M9 12C9 10.3431 10.3431 9 12 9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M12 12C12 11.4477 12 11.4477 12 11.4477"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M3 12C3 7.02944 7.02944 3 12 3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * TVLY Digital Pass Holographic Chip
 * Matches media_1790282844271.png
 */
export const TvlyCardBadge: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`inline-flex items-center justify-center px-3 py-1 rounded-xl text-[11px] font-black tracking-wider text-emerald-300 bg-gradient-to-br from-emerald-950/80 via-emerald-900/70 to-slate-950/90 border border-brand-500/40 shadow-inner backdrop-blur-md select-none ${className}`}
    >
      <span className="bg-gradient-to-r from-emerald-200 via-brand-300 to-emerald-100 bg-clip-text text-transparent">
        TVLY
      </span>
    </div>
  );
};

/**
 * Interactive Video Briefing Pill
 * Matches media_1790282936209.png
 */
export const VideoBriefingPill: React.FC<{
  videoUrl?: string | null;
  onPlay?: () => void;
  className?: string;
}> = ({ videoUrl, onPlay, className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={onPlay}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-brand-600 hover:from-emerald-500 hover:to-brand-500 shadow-lg shadow-brand-500/20 active:scale-95 transition-all group/btn"
      >
        <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
          <Play className="w-2.5 h-2.5 fill-white text-white translate-x-0.5" />
        </span>
        <span>Play Video Briefing</span>
      </button>
      <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
        Tap to preview host briefing
      </span>
    </div>
  );
};
