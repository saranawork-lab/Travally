"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, ShieldAlert, ArrowRightLeft } from "lucide-react";
import Image from "next/image";

interface DemoAccount {
  id: string;
  email: string;
  displayName: string;
  role: string;
  avatarUrl: string;
  description: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "sarah",
    email: "sarah@travally.app",
    displayName: "Sarah Jenkins",
    role: "Organizer & Movie Host",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    description: "Organizes movies & cafes in SF. Has pending join requests.",
  },
  {
    id: "alex",
    email: "alex@travally.app",
    displayName: "Alex Rivera",
    role: "Applicant & Explorer",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    description: "Accepted participant in Perfect Days screening. Has active chat.",
  },
  {
    id: "maya",
    email: "maya@travally.app",
    displayName: "Maya Chen",
    role: "Travel Planner",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    description: "Organizer of Tokyo & Kyoto Slow Travel Plan.",
  },
  {
    id: "david",
    email: "david@travally.app",
    displayName: "David Ross",
    role: "Event & Hiking Explorer",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    description: "Interlaken trip host and live gig attendee.",
  },
  {
    id: "admin",
    email: "admin@travally.app",
    displayName: "Admin Moderator",
    role: "Trust & Safety Admin",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    description: "Platform moderator with access to /admin.",
  },
];

export const DemoUserSwitcher: React.FC = () => {
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
        window.location.reload();
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

  const activeAccount = DEMO_ACCOUNTS.find((a) => a.email === currentUserEmail);

  return (
    <div className="fixed bottom-20 md:bottom-5 right-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 w-80 text-xs animate-slide-up">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <ArrowRightLeft className="w-4 h-4 text-teal-600" />
              <span>Multi-Account Persona Switcher</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-500 mb-3 text-[11px] leading-relaxed">
            Switch between real database accounts to test organizer vs. applicant workflows, chat unlocks, and approval pipelines.
          </p>
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = acc.email === currentUserEmail;
              return (
                <button
                  key={acc.id}
                  disabled={isSwitching}
                  onClick={() => handleSwitchAccount(acc)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                    isSelected
                      ? "bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-transparent"
                  }`}
                >
                  <img
                    src={acc.avatarUrl}
                    alt={acc.displayName}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {acc.displayName}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/50 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{acc.role}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur px-3 py-2 rounded-full shadow-lg border border-slate-700 hover:border-teal-500 text-xs transition-all hover:scale-105"
        >
          <UserCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>
            Acting as: <strong className="font-semibold text-teal-300">{activeAccount?.displayName || "Guest / Log In"}</strong>
          </span>
          <ArrowRightLeft className="w-3 h-3 text-slate-400" />
        </button>
      )}
    </div>
  );
};

export default DemoUserSwitcher;
