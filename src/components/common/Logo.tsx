import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
  variant?: "full" | "icon";
}

/**
 * Wayfellow Logo: Two independent paths converging into a shared forward journey.
 * Uses Teal (#0D9488) for the Companion path and Amber (#F59E0B) for the Travel path,
 * flowing together with precision geometric bezier curves.
 */
export const LogoMark: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Travally Logo"
    >
      <defs>
        <linearGradient id="companionPathGrad" x1="6" y1="42" x2="34" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
        <linearGradient id="travelPathGrad" x1="42" y1="42" x2="14" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Path 1: Companion Path (Teal) */}
      <path
        d="M8 38C14 38 18 28 24 24C28 21.3 32 17 38 10"
        stroke="url(#companionPathGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glowEffect)"
      />

      {/* Path 2: Travel Path (Amber) */}
      <path
        d="M40 38C34 38 30 28 24 24C20 21.3 16 17 10 10"
        stroke="url(#travelPathGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glowEffect)"
      />

      {/* Shared Forward Apex / Convergence Point */}
      <circle cx="24" cy="24" r="3.2" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="38" cy="10" r="2.5" fill="#2DD4BF" />
      <circle cx="10" cy="10" r="2.5" fill="#F59E0B" />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 32,
  showText = true,
  textClassName = "text-xl font-extrabold tracking-tight text-slate-900 dark:text-white",
  variant = "full",
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <LogoMark size={size} />
      {showText && variant === "full" && (
        <span className={textClassName}>
          Trav<span className="text-teal-600 dark:text-teal-400">ally</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
