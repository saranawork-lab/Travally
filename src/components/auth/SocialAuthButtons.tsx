"use client";

import React, { useState } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { LinkedInAuthButton } from "./LinkedInAuthButton";

interface SocialAuthButtonsProps {
  mode?: "signup" | "login";
  defaultEmail?: string;
  defaultName?: string;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  mode = "signup",
  defaultEmail = "",
  defaultName = "",
}) => {
  const [googleNotice, setGoogleNotice] = useState(false);

  const handleGoogleClick = () => {
    setGoogleNotice(true);
    setTimeout(() => setGoogleNotice(false), 4000);
  };

  return (
    <div className="space-y-3.5">
      {/* 1. Primary Highlighted: Continue with LinkedIn */}
      <LinkedInAuthButton
        mode={mode}
        defaultEmail={defaultEmail}
        defaultName={defaultName}
      />

      {/* 2. Secondary Social: Continue with Google */}
      <div className="relative">
        <button
          type="button"
          onClick={handleGoogleClick}
          className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-[#16201b] hover:bg-slate-50 dark:hover:bg-[#1e2a24] text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-emerald-950/70 shadow-xs hover:border-slate-300 dark:hover:border-emerald-800 transition flex items-center justify-center gap-2.5"
        >
          {/* Google 4-color G SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {googleNotice && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-max max-w-xs px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] shadow-lg flex items-center gap-1.5 animate-fade-in z-20">
            <Sparkles className="w-3 h-3 text-[#0A66C2]" />
            <span>Tip: Use LinkedIn to get your Verified Member Badge!</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-200 dark:border-emerald-950/60" />
        <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Or continue with email
        </span>
        <div className="flex-grow border-t border-slate-200 dark:border-emerald-950/60" />
      </div>
    </div>
  );
};
