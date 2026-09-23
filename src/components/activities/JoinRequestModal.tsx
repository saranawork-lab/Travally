"use client";

import React, { useState } from "react";
import { Send, X, ShieldCheck, AlertCircle } from "lucide-react";

interface JoinRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "ACTIVITY" | "TRAVEL";
  targetId: string;
  title: string;
  organizerName: string;
  onSuccess: () => void;
}

export const JoinRequestModal: React.FC<JoinRequestModalProps> = ({
  isOpen,
  onClose,
  type,
  targetId,
  title,
  organizerName,
  onSuccess,
}) => {
  const [introMessage, setIntroMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: any = {
        type,
        introMessage: introMessage.trim(),
      };
      if (type === "ACTIVITY") payload.activityId = targetId;
      else payload.travelPlanId = targetId;

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Private Join Request</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Interested in Joining {type === "ACTIVITY" ? "Activity" : "Trip"}?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Send a private request to <strong>{organizerName}</strong> for "{title}".
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Introduce Yourself & Share Shared Interests
            </label>
            <textarea
              required
              rows={4}
              value={introMessage}
              onChange={(e) => setIntroMessage(e.target.value)}
              placeholder="Hi! I'd love to join this activity because I'm a huge fan of... Here is my schedule availability..."
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Organizers review profiles and introductory notes before approving. Once approved, you gain access to the private group chat.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !introMessage.trim()}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Sending Request..." : "Send Join Request"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRequestModal;
