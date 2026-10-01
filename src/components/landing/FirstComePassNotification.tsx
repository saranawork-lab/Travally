"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, X, ArrowRight, ShieldCheck, Crown } from "lucide-react";

interface FirstComePassNotificationProps {
  show: boolean;
  onClose: () => void;
  duration?: number; // default 15000ms (15 seconds)
}

export function FirstComePassNotification({ 
  show, 
  onClose,
  duration = 15000 
}: FirstComePassNotificationProps) {
  const [visible, setVisible] = useState(show);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnimatingOut(false);

      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      handleClose();
    }
  }, [show, duration]);

  const handleClose = () => {
    setAnimatingOut(true);
    setTimeout(() => {
      setVisible(false);
      setAnimatingOut(false);
      onClose();
    }, 280);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Exclusive First-Come Access Pass"
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[9999] w-[calc(100%-2rem)] sm:w-auto sm:max-w-[325px] pointer-events-auto"
    >
      {/* Ambient Theme Backlight Glow - Emerald / Teal */}
      <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500/30 via-teal-500/20 to-emerald-400/20 rounded-2xl blur-lg opacity-70 pointer-events-none" />

      {/* Floating Modern Compact Card - Theme Aligned */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-white/95 dark:bg-[#0b1411]/95 text-slate-900 dark:text-white border border-emerald-500/30 dark:border-emerald-500/35 shadow-[0_15px_35px_rgba(16,185,129,0.15)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.65)] backdrop-blur-2xl p-3.5 sm:p-4 transition-all duration-300 transform-gpu ${
          animatingOut
            ? "opacity-0 translate-y-4 scale-95"
            : "opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-bottom-4"
        }`}
      >
        {/* Subtle decorative background gradient matching Travally green brand */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-xl pointer-events-none" />

        {/* Top Header Row: Pill Badge + Dismiss Button */}
        <div className="flex items-center justify-between gap-2 mb-1.5 relative z-10">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider shadow-xs">
            <Flame className="w-3 h-3 fill-emerald-500 text-emerald-500 animate-pulse" />
            <span>First-Come Exclusive</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Dismiss notification"
            className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-slate-500 dark:text-emerald-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card Body Message */}
        <p className="text-slate-600 dark:text-emerald-100/80 text-[11px] leading-snug mb-2.5 relative z-10 font-normal">
          We are exclusively offering these limited passes to <strong className="text-emerald-700 dark:text-emerald-300 font-semibold">first-come members</strong>! Register now to claim your Travally Verified Badge & VIP privileges.
        </p>

        {/* Value Prop Chips - Theme Colors */}
        <div className="grid grid-cols-2 gap-1.5 mb-3 relative z-10">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 text-[10px] font-bold text-emerald-900 dark:text-emerald-200">
            <div className="w-4 h-4 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3 h-3" />
            </div>
            <span className="truncate">Verified Badge</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/50 text-[10px] font-bold text-teal-900 dark:text-teal-200">
            <div className="w-4 h-4 rounded-md bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Crown className="w-3 h-3" />
            </div>
            <span className="truncate">VIP Priority</span>
          </div>
        </div>

        {/* Theme CTA Button - Emerald to Teal Gradient */}
        <Link
          href="/register"
          onClick={handleClose}
          className="relative z-10 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-400 text-white font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/35 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
        >
          <span>Register & Claim Your Pass</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        {/* 5-second countdown progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-100 dark:bg-emerald-950/60 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            style={{
              animation: `countdownBar ${duration}ms linear forwards`,
              width: "100%",
            }}
          />
        </div>
      </div>


      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes countdownBar {
            from { width: 100%; }
            to { width: 0%; }
          }
        `
      }} />
    </div>
  );
}
