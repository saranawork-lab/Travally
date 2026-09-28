"use client";

import React, { useState, useEffect } from "react";

export const BrandIntroLoader: React.FC = () => {
  const [phase, setPhase] = useState<"spinning" | "fit" | "gliding" | "done">("spinning");

  useEffect(() => {
    // Only run on initial site entry/fresh tab load
    const seen = sessionStorage.getItem("travally_intro_seen");
    if (seen) {
      setPhase("done");
      return;
    }

    // Phase 1: Realistic Compass Gyroscope Orientation (0 -> 700ms)
    const t1 = setTimeout(() => {
      setPhase("fit");
    }, 700);

    // Phase 2: Settle and Glide to the Navbar (1250ms -> 1750ms)
    const t2 = setTimeout(() => {
      setPhase("gliding");
    }, 1250);

    // Phase 3: Seamless finish & cleanup (1750ms)
    const t3 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("travally_intro_seen", "true");
    }, 1750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] pointer-events-none flex items-center justify-center transition-opacity duration-500 ease-out select-none ${
        phase === "gliding" ? "opacity-0" : "opacity-100"
      }`}
      style={{
        backgroundColor: "rgba(5, 8, 6, 0.94)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* ── Realistic Optical Radial Bloom & Compass Rays ── */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-700 ${
          phase === "fit" ? "scale-125 opacity-70" : "scale-90 opacity-40"
        }`}
        style={{
          width: "480px",
          height: "480px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(245, 158, 11, 0.18) 35%, rgba(5, 150, 105, 0.05) 60%, transparent 80%)",
          filter: "blur(40px)",
        }}
      />

      {/* Realistic Compass Degree Dial Ring behind the emblem */}
      <div
        className={`absolute pointer-events-none rounded-full border border-emerald-500/20 transition-all duration-700 ${
          phase === "fit" ? "scale-100 opacity-60" : "scale-75 opacity-20"
        }`}
        style={{
          width: "280px",
          height: "280px",
          boxShadow: "0 0 50px rgba(16, 185, 129, 0.15), inset 0 0 30px rgba(245, 158, 11, 0.1)",
        }}
      >
        {/* Cardinal North/South/East/West Compass Ticks */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-emerald-400/80 rounded-full" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-emerald-400/40 rounded-full" />
        <div className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-3 bg-emerald-400/40 rounded-full" />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 h-1.5 w-3 bg-amber-400/80 rounded-full" />
      </div>

      {/* ── Realistic Emblem with Physics-Based Inertia Rotation & Navbar Glide ── */}
      <div
        className="fixed z-[101] transform-gpu pointer-events-none"
        style={
          phase === "spinning"
            ? {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(0.65) rotate(-360deg)",
                transition: "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease",
                opacity: 0.85,
              }
            : phase === "fit"
            ? {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
                transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
                opacity: 1,
              }
            : {
                // Gliding seamlessly to top-left Navbar logo position
                top: "1.25rem",
                left: "2rem",
                transform: "translate(0, 0) scale(0.28) rotate(360deg)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                opacity: 0.95,
              }
        }
      >
        <div className="relative flex flex-col items-center justify-center">
          {/* High-Resolution Retina Logo with Soft Ambient Illumination */}
          <img
            src="/brand-logo.png"
            alt="Travally Compass Rose Logo"
            className="w-36 h-36 sm:w-44 sm:h-44 object-contain filter drop-shadow-[0_0_30px_rgba(52,211,153,0.5)] drop-shadow-[0_0_60px_rgba(245,158,11,0.35)]"
          />

          {/* Minimalist Subtitle that appears only while fit in center */}
          {phase === "fit" && (
            <div className="mt-5 text-center animate-fade-in-up">
              <span className="text-2xl font-black tracking-tight text-white">
                Trav<span className="text-emerald-400">ally</span>
              </span>
              <p className="text-[10px] font-bold text-amber-400/90 tracking-widest uppercase mt-0.5">
                Your Solo Travel Companion
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandIntroLoader;
