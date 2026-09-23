"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { ModeToggle, AppMode } from "@/components/common/ModeToggle";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";
import {
  Compass,
  Users,
  PlusCircle,
  Inbox,
  MessageSquare,
  Shield,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

interface NavbarProps {
  initialMode?: AppMode;
  onModeChange?: (mode: AppMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  initialMode = "companion",
  onModeChange,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mode, setMode] = useState<AppMode>(initialMode);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleModeSwitch = (newMode: AppMode) => {
    setMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    } else {
      router.push(`/discover?mode=${newMode}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const isDiscover = pathname.startsWith("/discover");
  const isCreate = pathname.startsWith("/activities/create") || pathname.startsWith("/travel/create");
  const isRequests = pathname.startsWith("/requests");
  const isChats = pathname.startsWith("/chats");
  const isSafety = pathname.startsWith("/safety");

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 transition hover:opacity-90">
          <Logo size={32} />
        </Link>

        {/* Central Mode Toggle (Visible on desktop & tablet) */}
        <div className="hidden sm:flex items-center justify-center">
          <ModeToggle currentMode={mode} onModeChange={handleModeSwitch} size="sm" />
        </div>

        {/* Main Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <Link
            href={`/discover?mode=${mode}`}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${
              isDiscover
                ? "bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            Discover
          </Link>

          <Link
            href={mode === "companion" ? "/activities/create" : "/travel/create"}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
              isCreate
                ? "bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <PlusCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Create</span>
          </Link>

          <Link
            href="/requests"
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${
              isRequests
                ? "bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            Requests
          </Link>

          <Link
            href="/chats"
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${
              isChats
                ? "bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            Chats
          </Link>

          <Link
            href="/safety"
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition flex items-center gap-1 ${
              isSafety
                ? "bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Safety</span>
          </Link>
        </nav>

        {/* Right Actions: Notifications & Profile / Auth */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <NotificationDropdown />

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <img
                    src={currentUser.avatarUrl || "https://avatar.vercel.sh/user"}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/30"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 py-2 animate-slide-up">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {currentUser.displayName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <User className="w-4 h-4 text-teal-600" />
                      <span>My Profile & Preferences</span>
                    </Link>

                    {currentUser.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-500" />
                        <span>Admin Moderation</span>
                      </Link>
                    )}

                    <Link
                      href="/safety"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Safety Center & Rules</span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm hover:shadow"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
