"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { UserCheck, ArrowRightLeft, Sparkles, Loader2 } from "lucide-react";

interface DemoAccount {
  id: string;
  email: string;
  displayName: string;
  role: string;
  description: string;
  badge: "Host" | "Member" | "Trip Planner" | "Admin";
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "ananya",
    email: "ananya@travally.app",
    displayName: "Ananya Sharma",
    role: "Organizer & Movie Host",
    description: "Organizes indie cinema & filter coffee walks in Bengaluru. Has join requests.",
    badge: "Host",
  },
  {
    id: "rohan",
    email: "rohan@travally.app",
    displayName: "Rohan Verma",
    role: "Explorer & Architecture Buff",
    description: "Bandra heritage walk enthusiast from Mumbai. Has active chats.",
    badge: "Member",
  },
  {
    id: "priya",
    email: "priya@travally.app",
    displayName: "Priya Iyer",
    role: "Travel Planner & Trekker",
    description: "Organizer of Kasol & Tosh Parvati Valley Autumn trek (₹8,500).",
    badge: "Trip Planner",
  },
  {
    id: "admin",
    email: "admin@travally.app",
    displayName: "Travally India Safety Team",
    role: "Community Moderator",
    description: "Platform safety & verification team with access to /admin.",
    badge: "Admin",
  },
];

export const DemoUserSwitcher: React.FC = () => {
  const pathname = usePathname();
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUserEmail(data.user.email);
        }
      })
      .catch(() => {});
  }, []);

  // Hide in active chat rooms so floating button doesn't cover input bar
  if (pathname?.startsWith("/chats/") && pathname !== "/chats") {
    return null;
  }

  const handleSwitchAccount = async (account: DemoAccount) => {
    setIsSwitching(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: account.email, password: "Password123!" }),
      });
      if (res.ok) {
        setCurrentUserEmail(account.email);
        window.location.href = account.id === "admin" ? "/admin" : "/discover";
      } else {
        alert("Failed to switch account");
      }
    } catch (err) {
      console.error("Account switch error:", err);
    } finally {
      setIsSwitching(false);
      setIsOpen(false);
    }
  };

  const activeAccount = DEMO_ACCOUNTS.find(
    (a) =>
      a.email === currentUserEmail ||
      (currentUserEmail === "sarah@travally.app" && a.id === "sarah") ||
      (currentUserEmail === "alex@travally.app" && a.id === "alex") ||
      (currentUserEmail === "maya@travally.app" && a.id === "maya")
  );

  return (
    <div className="fixed bottom-20 md:bottom-5 right-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-[#111815] border border-slate-200 dark:border-emerald-950/80 rounded-2xl shadow-2xl p-4 w-80 text-xs animate-slide-up">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-emerald-950/60">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Quick Persona Switcher</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold p-1"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-3 text-[11px] leading-relaxed">
            One-click switch between seeded accounts to test organizer vs. applicant workflows, chat unlocks, and trip discovery.
          </p>
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = acc.email === currentUserEmail;
              return (
                <button
                  key={acc.id}
                  disabled={isSwitching}
                  onClick={() => handleSwitchAccount(acc)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors relative ${
                    isSelected
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60"
                      : "hover:bg-slate-50 dark:hover:bg-[#16201b] border border-transparent"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-xs font-black text-emerald-800 dark:text-emerald-300 shrink-0 shadow-sm">
                    {acc.displayName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {acc.displayName}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                          {acc.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{acc.role}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#090d0b] dark:bg-[#131c18] text-white px-3.5 py-2 rounded-full shadow-xl border border-emerald-800/60 hover:border-emerald-500 text-xs transition-all hover:scale-105"
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Acting as:{" "}
            <strong className="font-bold text-emerald-300">
              {activeAccount?.displayName || "Guest / Log In"}
            </strong>
          </span>
          <ArrowRightLeft className="w-3 h-3 text-orange-400" />
        </button>
      )}
    </div>
  );
};

export default DemoUserSwitcher;
