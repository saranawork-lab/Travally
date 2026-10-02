"use client";

import React from "react";
import Link from "next/link";

interface LiquidWaveButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export const LiquidWaveButton: React.FC<LiquidWaveButtonProps> = ({
  href,
  children,
  className = "",
  size = "md",
}) => {
  const sizeClasses =
    size === "sm"
      ? "px-3.5 py-1.5 text-xs min-h-[32px]"
      : "px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-bold min-h-[36px]";

  return (
    <Link
      href={href}
      className={`liquid-bottle-btn group relative inline-flex items-center justify-center overflow-hidden rounded-full font-bold text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${sizeClasses} ${className}`}
      aria-label={typeof children === "string" ? children : "Button"}
    >
      {/* --- Glass Bottle Body (Outer & Inner Depth) --- */}
      <span className="liquid-glass-bottle" />

      {/* --- Liquid Container with Sea Waves --- */}
      <span className="liquid-fluid-chamber">
        {/* Deep Ocean Wave (Back layer) */}
        <span className="liquid-wave liquid-wave-back" />

        {/* Mid Tropical Wave (Middle layer) */}
        <span className="liquid-wave liquid-wave-mid" />

        {/* Front Crest Wave with Foam border (Top layer) */}
        <span className="liquid-wave liquid-wave-front" />

        {/* Floating Water Bubbles inside bottle */}
        <span className="liquid-bubble b1" />
        <span className="liquid-bubble b2" />
        <span className="liquid-bubble b3" />
        <span className="liquid-bubble b4" />
      </span>

      {/* --- Glass Bottle Specular Reflection Highlights (Top & Bottom curves) --- */}
      <span className="liquid-glass-specular-top" />
      <span className="liquid-glass-specular-bottom" />

      {/* --- Button Content / Label --- */}
      <span className="relative z-30 flex items-center justify-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        {children}
      </span>
    </Link>
  );
};

export default LiquidWaveButton;
