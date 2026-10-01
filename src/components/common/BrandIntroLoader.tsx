"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const BrandIntroLoader: React.FC = () => {
  const [phase, setPhase] = useState<"spinning" | "gliding" | "done">("spinning");
  const pathname = usePathname();
  const { currentUser } = useAuth();

  const isAuthOrLanding = pathname === "/" || pathname === "/login" || pathname === "/register";

  useEffect(() => {
    // 1. Center spinning animation runs for 650ms
    const t1 = setTimeout(() => {
      setPhase("gliding");
    }, 650);

    // 2. Gliding & zoom to top navbar logo position completes at 1200ms
    const t2 = setTimeout(() => {
      setPhase("done");
    }, 1250);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Suppress full-screen loader after login on in-app pages like /requests, /discover
  if (currentUser && !isAuthOrLanding) return null;

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center transition-opacity duration-500 ease-out select-none bg-[#090d0b]/98 backdrop-blur-md ${
        phase === "gliding" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* ── Soft Emerald & Warm Amber Aura behind center emblem ── */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-700 ease-out ${
          phase === "spinning" ? "scale-100 opacity-60" : "scale-50 opacity-0"
        }`}
        style={{
          width: "360px",
          height: "360px",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(245, 158, 11, 0.15) 35%, rgba(16, 185, 129, 0.04) 65%, transparent 75%)",
          filter: "blur(32px)",
        }}
      />

      {/* ── Center Emblem that Spins and Smoothly Fades Out ── */}
      <div
        className={`fixed z-[10000] pointer-events-none transform-gpu transition-all duration-500 ease-out top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
          phase === "spinning"
            ? "scale-100 opacity-100"
            : "scale-90 opacity-0"
        }`}
      >
        <div className="relative flex flex-col items-center justify-center">
          {/* Spinning Logo Wheel */}
          <div className="relative flex items-center justify-center">
            <img
              src="/brand-logo-dark.png"
              alt="Travally Logo"
              className={`w-28 h-28 sm:w-32 sm:h-32 object-contain filter drop-shadow-[0_4px_24px_rgba(52,211,153,0.4)] ${
                phase === "spinning" ? "animate-spin" : ""
              }`}
              style={{
                animationDuration: "1.2s",
                animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>

          {/* Brand Name Text during center spin phase */}
          <div
            className={`mt-4 text-center transition-all duration-300 ${
              phase === "spinning" ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          >
            <div className="text-xl sm:text-2xl font-black tracking-tight flex items-center justify-center">
              <span className="text-orange-500">Tra</span><span
                className="bg-gradient-to-r from-orange-500 to-emerald-500 bg-clip-text text-transparent inline"
                style={{
                  backgroundImage: "linear-gradient(to right, #f97316 0%, #10b981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >va</span><span className="text-emerald-500">lly</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
              Your Solo Travel Companion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandIntroLoader;
