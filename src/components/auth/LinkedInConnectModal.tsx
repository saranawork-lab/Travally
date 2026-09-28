"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  Loader2,
  User,
  Mail,
  MapPin,
  Linkedin,
} from "lucide-react";

interface LinkedInConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  defaultName?: string;
}

export const LinkedInConnectModal: React.FC<LinkedInConnectModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = "",
  defaultName = "",
}) => {
  const [displayName, setDisplayName] = useState(defaultName || "Sarana Sai Bagadi");
  const [email, setEmail] = useState(defaultEmail || "sarana.linkedin@travally.app");
  const [linkedinUrl, setLinkedinUrl] = useState(
    "https://www.linkedin.com/in/sarana-sai-bagadi"
  );
  const [city, setCity] = useState("Bengaluru");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/linkedin/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          email,
          linkedinUrl,
          city,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to connect with LinkedIn");
      }

      // Hard redirect to load session cookies cleanly
      window.location.href = "/discover?verified=linkedin";
    } catch (err: any) {
      setError(err.message || "Failed to complete LinkedIn verification");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#111815] rounded-3xl border border-slate-200 dark:border-emerald-950/80 shadow-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0A66C2] via-teal-500 to-emerald-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with LinkedIn branding */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#0A66C2] text-white flex items-center justify-center shadow-lg shadow-[#0A66C2]/25 shrink-0">
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Connect with LinkedIn
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20">
                <Sparkles className="w-2.5 h-2.5" />
                Verified Member
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sign in instantly and receive an official LinkedIn Verified Member badge across your Travally profile, activities, and trips.
            </p>
          </div>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-1">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-950/60 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Verified Badge
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Instantly on your profile
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-950/60 text-center">
            <CheckCircle2 className="w-4 h-4 text-[#0A66C2] mx-auto mb-1" />
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Higher Trust
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              3x faster companion accept
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#16201b] border border-slate-200/80 dark:border-emerald-950/60 text-center">
            <Linkedin className="w-4 h-4 text-[#0A66C2] mx-auto mb-1" />
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Safe & Private
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Zero passwords needed
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleConnect} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-emerald-950/70 bg-white dark:bg-[#16201b] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/30 focus:border-[#0A66C2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                City / Location
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-emerald-950/70 bg-white dark:bg-[#16201b] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/30 focus:border-[#0A66C2]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-emerald-950/70 bg-white dark:bg-[#16201b] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/30 focus:border-[#0A66C2]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              LinkedIn Profile Link
            </label>
            <div className="relative">
              <Linkedin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#0A66C2]" />
              <input
                required
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/username"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-emerald-950/70 bg-white dark:bg-[#16201b] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/30 focus:border-[#0A66C2]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl font-bold text-xs text-white bg-[#0A66C2] hover:bg-[#084e96] transition shadow-lg shadow-[#0A66C2]/25 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying & Signing In...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Sign In with LinkedIn</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live OAuth Developer Note */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed border-t border-slate-100 dark:border-emerald-950/60 pt-3">
          💡 <span className="font-semibold">Live OAuth Ready:</span> Add{" "}
          <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-mono">
            LINKEDIN_CLIENT_ID
          </code>{" "}
          &amp;{" "}
          <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-mono">
            LINKEDIN_CLIENT_SECRET
          </code>{" "}
          in <code className="font-mono">.env</code> to redirect directly to LinkedIn.com!
        </div>
      </div>
    </div>
  );
};
