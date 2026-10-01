import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
  variant?: "full" | "icon";
  themeVariant?: "auto" | "light" | "dark";
  animate?: boolean;
  animateType?: "smooth" | "stay";
}

/**
 * Travally Brand Emblem:
 * Four-leaf compass flora with cardinal waypoints and warm golden sunrise beacon.
 * Features a periodic wheel spin like a chakra in place, without wobble.
 * High-contrast rendering for both pristine light mode and radiant dark mode.
 */
export const LogoMark: React.FC<{
  size?: number;
  className?: string;
  animate?: boolean;
  animateType?: "smooth" | "stay";
  themeVariant?: "auto" | "light" | "dark";
}> = ({
  size = 36,
  className = "",
  animate = true,
  animateType = "stay",
  themeVariant = "auto",
}) => {
  const animClass = animate
    ? animateType === "smooth"
      ? "animate-spin-smooth"
      : "animate-spin-stay"
    : "!animate-none !transform-none";

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none filter drop-shadow-[0_0_8px_rgba(16,185,129,0.2)] dark:drop-shadow-[0_0_12px_rgba(52,211,153,0.35)] transition-all duration-300 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Travally Logo"
    >
      {/* Light Mode Logo: Rich forest emerald with warm sun on light surfaces */}
      <img
        src="/brand-logo.png"
        alt="Travally Logo"
        width={size}
        height={size}
        className={`w-full h-full object-contain block transition-transform duration-300 ${
          themeVariant === "auto"
            ? "dark:hidden"
            : themeVariant === "dark"
            ? "hidden"
            : "block"
        } ${animate ? "group-hover:scale-105" : ""} ${animClass}`}
        style={{
          transformOrigin: "center center",
        }}
      />

      {/* Dark Mode Logo: Luminous high-contrast emerald & radiant sun, perfectly clear on dark backgrounds */}
      <img
        src="/brand-logo-dark.png"
        alt="Travally Logo"
        width={size}
        height={size}
        className={`w-full h-full object-contain block transition-transform duration-300 ${
          themeVariant === "auto"
            ? "hidden dark:block"
            : themeVariant === "light"
            ? "hidden"
            : "block"
        } ${animate ? "group-hover:scale-105" : ""} ${animClass}`}
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
  themeVariant = "auto",
  animate = true,
  animateType = "stay",
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      <LogoMark
        size={size}
        animate={animate}
        animateType={animateType}
        themeVariant={themeVariant}
      />
      {showText && variant === "full" && (
        <div className={`flex items-center tracking-tight font-black select-none ${textClassName}`}>
          <span className="text-orange-500 dark:text-orange-400">Tra</span><span
            className="bg-gradient-to-r from-orange-500 to-emerald-500 dark:from-orange-400 dark:to-emerald-400 bg-clip-text text-transparent inline"
            style={{
              backgroundImage: "linear-gradient(to right, #f97316 0%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >va</span><span className="text-emerald-600 dark:text-emerald-400">lly</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
