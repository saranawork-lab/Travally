"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { Lock, Mail, ArrowRight, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("sarah@travally.app");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/discover");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password123!");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size={36} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back to Travally
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Sign in to access your companion activities, trips, and private chats
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition shadow-md hover:shadow-teal-500/25 flex items-center justify-center gap-1.5"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Selector */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 block text-center uppercase tracking-wider">
            Quick Persona Switch
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin("sarah@travally.app")}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-left border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              <strong className="block text-[11px]">Sarah Jenkins</strong>
              <span className="text-[10px] text-slate-400">Host (SF)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("alex@travally.app")}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-left border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              <strong className="block text-[11px]">Alex Rivera</strong>
              <span className="text-[10px] text-slate-400">Applicant / Member</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("maya@travally.app")}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-left border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              <strong className="block text-[11px]">Maya Chen</strong>
              <span className="text-[10px] text-slate-400">Japan Trip Host</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@travally.app")}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              <strong className="block text-[11px]">Trust & Safety</strong>
              <span className="text-[10px] text-slate-400">Admin Moderator</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-teal-600 hover:underline">
            Register for Free
          </Link>
        </div>
      </div>
    </div>
  );
}
