"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface NotificationPopupProps {
  show: boolean;
  type?: "success" | "error" | "info";
  title?: string;
  message: string;
  onClose: () => void;
  duration?: number; // auto-dismiss in ms (default 5000)
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({
  show,
  type = "success",
  title,
  message,
  onClose,
  duration = 5000,
}) => {
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
    }, 250);
  };

  if (!visible) return null;

  const isSuccess = type === "success";
  const isError = type === "error";

  return (
    <div
      role="alert"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-md pointer-events-auto"
    >
      <div
        className={`flex items-start sm:items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 rounded-2xl sm:rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-300 transform-gpu ${
          animatingOut
            ? "opacity-0 -translate-y-4 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        } ${
          isSuccess
            ? "bg-emerald-50/95 dark:bg-[#071f15]/95 border-emerald-300/90 dark:border-emerald-700/70 text-emerald-950 dark:text-emerald-50 shadow-emerald-900/10"
            : isError
            ? "bg-rose-50/95 dark:bg-[#200b0e]/95 border-rose-300 dark:border-rose-700/70 text-rose-950 dark:text-rose-50 shadow-rose-900/10"
            : "bg-slate-50/95 dark:bg-[#0f172a]/95 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-slate-900/10"
        }`}
      >
        {/* Icon */}
        <div className="shrink-0 mt-0.5 sm:mt-0">
          {isSuccess ? (
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/70 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          ) : isError ? (
            <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/70 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <Info className="w-4 h-4 stroke-[2.5]" />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 pr-1">
          {title && (
            <div className="text-xs font-bold tracking-tight mb-0.5 opacity-90">
              {title}
            </div>
          )}
          <p className="text-xs sm:text-sm font-medium leading-snug">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Dismiss notification"
          className="shrink-0 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationPopup;
