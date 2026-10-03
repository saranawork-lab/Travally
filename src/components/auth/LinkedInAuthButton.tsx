"use client";

import React, { useState } from "react";
import { Loader2, HelpCircle } from "lucide-react";

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
  const [checking, setChecking] = useState(false);

  const handleClick = () => {
    setChecking(true);
    window.location.href = "/api/auth/linkedin";
  };

  return (
    <>
      <div className={`relative pt-2.5 ${className}`}>
        {/* Help Tooltip Icon */}
        <div className="absolute top-1 left-2 sm:left-2 z-20 group/tooltip">
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200 cursor-help">
            <HelpCircle className="w-3.5 h-3.5 text-[#0A66C2]" />
          </div>
          {/* Tooltip Popup */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/4 mb-1 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none w-[140px] z-30">
            <div className="bg-slate-800 text-white text-[10px] font-medium py-1.5 px-2.5 rounded shadow-lg text-center leading-tight relative">
              Gets Travally Verified Badge
              <div className="absolute top-full left-1/4 -translate-x-1/2 -mt-px border-[4px] border-transparent border-t-slate-800" />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClick}
          disabled={checking}
          className="w-full h-11 sm:h-12 relative group overflow-hidden px-3 rounded-2xl bg-[#0A66C2] hover:bg-[#084e96] active:scale-[0.99] text-white shadow-sm shadow-[#0A66C2]/20 hover:shadow-md hover:shadow-[#0A66C2]/30 transition-all duration-200 flex items-center justify-center gap-2 border border-blue-400/30 cursor-pointer disabled:opacity-60"
        >
          {/* Subtle animated shimmer background */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform" />

          {/* Icon */}
          {checking ? (
            <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
              <svg
                className="w-3.5 h-3.5 fill-white"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
          )}

          {/* Centered clearly visible button text */}
          <span className="font-bold text-xs sm:text-xs text-white tracking-tight z-10 whitespace-nowrap">
            <span className="hidden xs:inline sm:hidden md:inline">Continue with </span>LinkedIn
          </span>
        </button>
      </div>
    </>
  );
};
