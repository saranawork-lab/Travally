"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo, LogoMark } from "@/components/common/Logo";
import { ModeToggle, AppMode } from "@/components/common/ModeToggle";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Search,
  X,
} from "lucide-react";

interface NavbarProps {
  initialMode?: AppMode;
  onModeChange?: (mode: AppMode) => void;
  initialUser?: any;
}

export const Navbar: React.FC<NavbarProps> = ({
  initialMode = "companion",
  onModeChange,
  initialUser = null,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mode, setMode] = useState<AppMode>(initialMode);
  const { currentUser, logout: handleLogout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Click outside to close user profile dropdown
  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [userMenuOpen]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get("search") || "");
      const urlMode = params.get("mode") as AppMode;
      if (urlMode === "companion" || urlMode === "travel") {
        setMode(urlMode);
      }
    }
  }, [pathname]);

  const handleMobileSearch = (q: string) => {
    setSearchQuery(q);
    // Instant real-time event for zero-latency UI update across companion and travel feeds
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("travally-search", { detail: q }));
      const params = new URLSearchParams(window.location.search);
      if (q.trim()) {
        params.set("search", q.trim());
      } else {
        params.delete("search");
      }
      const currentMode = params.get("mode") || (pathname.startsWith("/travel") ? "travel" : "companion");
      params.set("mode", currentMode);
      router.replace(`/discover?${params.toString()}`);
    }
  };

  // Hide global navbar inside active chat rooms (chat has its own complete header)
  if (pathname?.startsWith("/chats/") && pathname !== "/chats") {
    return null;
  }

  const handleModeSwitch = (newMode: AppMode) => {
    setMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    } else {
      const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("search") : null;
      const query = search ? `?mode=${newMode}&search=${encodeURIComponent(search)}` : `?mode=${newMode}`;
      router.push(`/discover${query}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#090d0b] border-b border-slate-100/90 dark:border-emerald-950/60 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-200">
      <div className="w-full px-3 sm:px-8 md:px-10 lg:px-12 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Area */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-0">
          {/* Desktop/Tablet Logo with full Travally Gradient */}
          <Link href={currentUser ? "/discover" : "/"} className="hidden sm:flex items-center gap-2.5 transition hover:opacity-90 shrink-0">
            <Logo size={36} />
          </Link>

          {/* Mobile Responsive: Single Clean Logo when logged out/landing, or LogoMark + Search when logged in */}
          <div className="flex sm:hidden items-center gap-2 w-full min-w-0">
            {currentUser && pathname !== "/" ? (
              <>
                <Link
                  href="/discover"
                  className="flex items-center shrink-0 transition hover:opacity-90"
                  title="Travally"
                >
                  <LogoMark size={28} />
                </Link>

                <div className="relative flex-1 min-w-0 max-w-[210px] xs:max-w-[250px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleMobileSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder={isSearchFocused ? "" : "Travally"}
                    aria-label="Search Travally"
                    className="w-full pl-8 pr-7 py-1.5 rounded-full bg-slate-100/90 dark:bg-[#16201b] border border-slate-200/90 dark:border-emerald-950/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-inner"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => handleMobileSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                      aria-label="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : null}
                </div>
              </>
            ) : (
              <Link href="/" className="flex items-center gap-1.5 transition hover:opacity-90">
                <Logo size={28} showText />
              </Link>
            )}
          </div>
        </div>

        {/* ── LOGGED-IN NAV: Central Mode Toggle (In-App Pages Only) ── */}
        {currentUser && pathname !== "/" && (
          <div className="hidden sm:flex items-center justify-center">
            <ModeToggle currentMode={mode} onModeChange={handleModeSwitch} size="sm" />
          </div>
        )}

        {/* Right Actions: Theme Toggle, Notifications & Profile / Auth */}
        <div className="flex items-center gap-2">
          {/* Functional Light/Dark Mode Switcher: ONLY for logged-in users, hidden on landing, login & register */}
          {currentUser && pathname !== "/" && pathname !== "/login" && pathname !== "/register" && <ThemeToggle />}

          {currentUser && pathname !== "/" ? (
            <>
              <NotificationDropdown />

              {/* Profile Dropdown (Desktop only - on mobile/tablet it lives in the bottom nav dock) */}
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-[#131c18] transition border border-transparent hover:border-slate-200 dark:hover:border-emerald-900/50"
                  aria-label="User navigation menu"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-sm shrink-0">
                    {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 sm:w-64 rounded-2xl bg-white dark:bg-[#131c18] border border-slate-200 dark:border-emerald-900/50 shadow-2xl z-50 py-2 animate-slide-up">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-emerald-950/60">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {currentUser.displayName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#18241f]"
                    >
                      <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>My Profile & Preferences</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#18241f]"
                    >
                      <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Account Settings &amp; Pass</span>
                    </Link>

                    {currentUser.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#18241f]"
                      >
                        <LayoutDashboard className="w-4 h-4 text-orange-500" />
                        <span>Admin Moderation</span>
                      </Link>
                    )}

                    <Link
                      href="/safety"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#18241f]"
                    >
                      <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Safety Center & Rules</span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-emerald-950/60 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
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
            <div className="flex items-center gap-2.5 sm:gap-3">
              {currentUser && pathname === "/" ? (
                <>
                  <Link
                    href="/discover"
                    className="px-5 py-2 rounded-full text-xs font-bold text-emerald-900 dark:text-emerald-200 bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 dark:from-emerald-950/80 dark:to-teal-950/70 hover:from-emerald-200 hover:to-teal-100 border border-emerald-300/80 dark:border-emerald-800/60 shadow-xs transition-all"
                  >
                    Go to App
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-[#131c18] transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 rounded-full text-xs font-bold text-emerald-900 dark:text-emerald-200 bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 dark:from-emerald-950/80 dark:to-teal-950/70 hover:from-emerald-200 hover:to-teal-100 border border-emerald-300/80 dark:border-emerald-800/60 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Join Free
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
