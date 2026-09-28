"use client";

import React, { useState } from "react";
import { Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import { LinkedInConnectModal } from "./LinkedInConnectModal";

interface LinkedInAuthButtonProps {
  mode?: "signup" | "login";
  className?: string;
  defaultEmail?: string;
  defaultName?: string;
}

export const LinkedInAuthButton: React.FC<LinkedInAuthButtonProps> = ({
  mode = "signup",
  className = "",
  defaultEmail = "",
  defaultName = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleClick = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/auth/linkedin?check=true");
      const data = await res.json();

      if (data.configured) {
        // Live LinkedIn credentials exist: redirect to LinkedIn OAuth consent screen
        window.location.href = "/api/auth/linkedin";
      } else {
        // Fallback: open the instant verified member modal
        setIsModalOpen(true);
      }
    } catch {
      setIsModalOpen(true);
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <div className={`space-y-2.5 ${className}`}>
        <button
          type="button"
          onClick={handleClick}
          disabled={checking}
          className="w-full relative group overflow-hidden py-3 px-4 rounded-2xl bg-[#0A66C2] hover:bg-[#084e96] active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-[#0A66C2]/20 hover:shadow-lg hover:shadow-[#0A66C2]/30 transition-all duration-200 flex items-center justify-between border border-blue-400/30"
        >
          {/* Subtle animated shimmer background */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform" />

          {/* Left: Icon + Label */}
          <div className="flex items-center gap-2.5 z-10">
            {checking ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 fill-white"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
            )}
            <span className="tracking-tight text-white font-semibold">
              {mode === "signup" ? "Continue with LinkedIn" : "Sign In with LinkedIn"}
            </span>
          </div>

          {/* Right: Verified Pill */}
          <div className="z-10 flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20 shrink-0">
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            <span>Get Verified Badge</span>
          </div>
        </button>

        {/* Small trust caption */}
        <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 font-medium">
          <Sparkles className="w-3 h-3 text-[#0A66C2]" />
          <span>
            Automatically links your verified member badge &amp; boosts trust
          </span>
        </p>
      </div>

      <LinkedInConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultEmail={defaultEmail}
        defaultName={defaultName}
      />
    </>
  );
};
