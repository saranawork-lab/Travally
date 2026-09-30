import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
  variant?: "full" | "icon";
  animate?: boolean;
  animateType?: "smooth" | "stay";
}

/**
 * Travally Brand Emblem:
 * Four-leaf compass flora with cardinal waypoints and warm golden sunrise beacon.
 * Features a periodic wheel spin like a chakra in place, without wobble.
 */
export const LogoMark: React.FC<{
  size?: number;
  className?: string;
  animate?: boolean;
  animateType?: "smooth" | "stay";
}> = ({
  size = 36,
  className = "",
  animate = true,
  animateType = "stay",
}) => {
  const animClass = animate
    ? animateType === "smooth"
      ? "animate-spin-smooth"
      : "animate-spin-stay"
    : "";

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none filter drop-shadow-[0_0_8px_rgba(16,185,129,0.2)] ${className}`}
      style={{ width: size, height: size }}
      aria-label="Travally Logo"
    >
      <img
        src="/brand-logo.png"
        alt="Travally Compass Rose Logo"
        width={size}
        height={size}
        className={`w-full h-full object-contain block transition-transform duration-300 group-hover:scale-105 ${animClass}`}
        style={{
          transformOrigin: "center center",
        }}
      />
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 36,
  showText = true,
  textClassName = "text-xl font-black tracking-tight",
  variant = "full",
  animate = true,
  animateType = "stay",
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      <LogoMark size={size} animate={animate} animateType={animateType} />
      {showText && variant === "full" && (
        <div className={`flex items-center tracking-tight font-black select-none ${textClassName}`}>
          <span className="text-orange-500 dark:text-orange-400">Tra</span>
          <span
            className="bg-gradient-to-r from-orange-500 to-emerald-500 dark:from-orange-400 dark:to-emerald-400 bg-clip-text text-transparent inline-block"
            style={{
              backgroundImage: "linear-gradient(to right, #f97316 0%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            va
          </span>
          <span className="text-emerald-600 dark:text-emerald-400">lly</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
