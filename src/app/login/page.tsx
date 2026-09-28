"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { Lock, Mail, ArrowRight, UserCheck, ShieldCheck, Sparkles, Loader2, KeyRound } from "lucide-react";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

interface DemoPersona {
  id: string;
  email: string;
  name: string;
  role: string;
  accent: "green" | "orange" | "slate";
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "ananya",
    email: "ananya@travally.app",
    name: "Ananya Sharma",
    role: "Bengaluru · Cinema & Coffee Host",
    accent: "green",
  },
  {
    id: "rohan",
    email: "rohan@travally.app",
    name: "Rohan Verma",
    role: "Mumbai · Heritage Walks Member",
    accent: "green",
  },
  {
    id: "priya",
    email: "priya@travally.app",
    name: "Priya Iyer",
    role: "Delhi/Kasol · Expedition Planner",
    accent: "orange",
  },
  {
    id: "admin",
    email: "admin@travally.app",
    name: "Travally India Safety Team",
    role: "Admin Community Moderator",
    accent: "slate",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ananya@travally.app");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [authenticatingPersona, setAuthenticatingPersona] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Authenticate user with given credentials
  const performLogin = async (loginEmail: string, loginPass: string, personaId?: string) => {
    if (personaId) {
      setAuthenticatingPersona(personaId);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please check credentials.");
      }

      // Hard redirect to ensure browser reloads session cookies cleanly
      const targetUrl = data?.user?.role === "ADMIN" ? "/admin" : "/discover";
      window.location.href = targetUrl;
    } catch (err: any) {
      setError(err.message || "Failed to log in");
      setLoading(false);
      setAuthenticatingPersona(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  // Seamless 1-click authentication for demo accounts
  const handleOneClickPersona = async (persona: DemoPersona) => {
    setEmail(persona.email);
    setPassword("Password123!");
    await performLogin(persona.email, "Password123!", persona.id);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-[#111815] rounded-3xl border border-slate-200 dark:border-emerald-950/60 p-7 sm:p-8 shadow-2xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Link href="/" className="hover:opacity-90 transition">
              <Logo size={40} />
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back to Travally
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Sign in to access your companion activities, trips, and private chats
          </p>
        </div>

        {/* LinkedIn & Google Social Sign In */}
        <SocialAuthButtons
          mode="login"
          defaultEmail={email}
        />

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 animate-slide-up">
            {error}
          </div>
        )}

        {/* 1-Click Demo Persona Switcher */}
        <div className="pt-1 pb-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>1-Click Demo Accounts</span>
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
              Instant Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {DEMO_PERSONAS.map((persona) => {
              const isSelected = authenticatingPersona === persona.id;
              const isGreen = persona.accent === "green";
              const isOrange = persona.accent === "orange";

              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleOneClickPersona(persona)}
                  disabled={loading || authenticatingPersona !== null}
                  className={`p-2.5 rounded-2xl text-left border transition-all duration-200 relative group flex items-start gap-2.5 ${isSelected
                      ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md"
                      : isGreen
                        ? "bg-slate-50 dark:bg-[#16201b] hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 border-slate-200 dark:border-emerald-950 hover:border-emerald-400 dark:hover:border-emerald-700"
                        : isOrange
                          ? "bg-slate-50 dark:bg-[#16201b] hover:bg-orange-50/70 dark:hover:bg-orange-950/40 border-slate-200 dark:border-emerald-950 hover:border-orange-400 dark:hover:border-orange-700"
                          : "bg-slate-50 dark:bg-[#16201b] hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-emerald-950"
                    }`}
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-xs font-black text-emerald-800 dark:text-emerald-300 shrink-0 shadow-sm">
                    {persona.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="block text-[11px] font-bold text-slate-900 dark:text-white truncate">
                      {persona.name}
                    </strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {persona.role}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5 truncate">
                      {persona.email}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute inset-0 bg-emerald-600/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                      <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 pt-0.5">
            Default Demo Password: <span className="font-mono text-slate-600 dark:text-slate-300">Password123!</span>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-emerald-950/60" />
          <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Or sign in with email
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-emerald-950/60" />
        </div>

        {/* Standard Email/Password Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya@travally.app or rohan"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-emerald-950/70 bg-white dark:bg-[#16201b] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-emerald-950/70 bg-white dark:bg-[#16201b] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || authenticatingPersona !== null}
            className="w-full py-3 rounded-2xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Travally</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-emerald-950/60">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
