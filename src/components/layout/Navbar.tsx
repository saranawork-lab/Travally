"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo, LogoMark } from "@/components/common/Logo";
import { ModeToggle, AppMode } from "@/components/common/ModeToggle";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Search, X } from "lucide-react";

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
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleSidebarState = (e: any) => {
        setIsSidebarOpen(Boolean(e.detail?.expanded));
      };
      window.addEventListener("travally-sidebar-state", handleSidebarState);
      return () => window.removeEventListener("travally-sidebar-state", handleSidebarState);
    }
  }, []);

  // Track scroll position to transition the navbar on the landing page
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > (window.innerHeight * 0.8));
    };
    
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // When route changes, ensure sidebar state is immediately reset to closed
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleMobileSearch = (q: string) => {
    setSearchQuery(q);
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

  // Hide global navbar inside active chat rooms and full-screen onboarding (AFTER all hooks have executed)
  if (
    (pathname?.startsWith("/chats/") && pathname !== "/chats") ||
    pathname?.startsWith("/onboarding")
  ) {
    return null;
  }

  const isAuthOrLandingPage = pathname === "/" || pathname === "/login" || pathname === "/register";
  const shouldAnimateLogo = isAuthOrLandingPage ? true : isSidebarOpen;

  // Determine navbar styles based on route and scroll
  const isLandingPage = pathname === "/";
  const isTransparent = isLandingPage && !isScrolled;

  return (
    <header className={`z-40 w-full transition-all duration-500 ${
      isLandingPage ? "fixed top-0" : "sticky top-0"
    } ${
      isTransparent
        ? "bg-black/10 backdrop-blur-md border-transparent shadow-none"
        : "bg-white dark:bg-[#090d0b] border-b border-slate-100/90 dark:border-emerald-950/60 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] dark:shadow-none"
    }`}>
      <div className="w-full px-3 sm:px-8 md:px-10 lg:px-12 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4 relative">
        {/* Brand Area */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop/Tablet Logo: Animates ONLY when sidebar opens (or on login/register/landing) */}
          <Link
            href="/"
            className="hidden sm:flex items-center gap-2.5 transition hover:opacity-90 shrink-0 group"
          >
            <Logo
              size={36}
              animate={shouldAnimateLogo}
              animateType={isSidebarOpen ? "smooth" : "stay"}
            />
          </Link>

          {/* Mobile Responsive: Single Clean Logo when logged out/landing, or LogoMark + Search when logged in */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            {currentUser && pathname !== "/" ? (
              <>
                <Link
                  href="/"
                  className="flex items-center shrink-0 transition hover:opacity-90"
                  title="Travally"
                >
                  <LogoMark size={28} animate={isAuthOrLandingPage} />
                </Link>

                <div className="relative flex-1 min-w-0 max-w-[140px] xs:max-w-[180px]">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleMobileSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder={isSearchFocused ? "" : "Travally"}
                    aria-label="Search Travally"
                    className="w-full pl-7 pr-6 py-1.5 rounded-full bg-slate-100/90 dark:bg-[#16201b] border border-slate-200/90 dark:border-emerald-950/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
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
              <Link href="/" className="flex items-center gap-1 transition hover:opacity-90 shrink-0">
                <Logo size={26} showText textClassName="text-base sm:text-xl font-black tracking-tight" />
              </Link>
            )}
          </div>
        </div>

        {/* ── LOGGED-IN NAV: Central Mode Toggle (In-App Pages Only, NOT on login/register/landing) ── */}
        {currentUser && pathname !== "/" && pathname !== "/login" && pathname !== "/register" && (
          <div className="hidden sm:flex items-center justify-center absolute left-1/2 -translate-x-1/2 pointer-events-auto">
            <ModeToggle currentMode={mode} onModeChange={handleModeSwitch} size="sm" />
          </div>
        )}

        {/* Right Actions: Theme Toggle, Notifications & Profile / Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
          {/* Functional Light/Dark Mode Switcher: scaled slightly on mobile to guarantee comfortable fit */}
          <div className="scale-[0.82] sm:scale-100 origin-right -mr-1 sm:mr-0 shrink-0">
            <ThemeToggle />
          </div>

          {currentUser && pathname !== "/" && pathname !== "/login" && pathname !== "/register" ? (
            <NotificationDropdown />
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-3">
              {currentUser && pathname === "/" ? (
                <Link
                  href="/tracking"
                  className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs font-bold transition-all shadow-xs border whitespace-nowrap text-slate-900 dark:text-slate-950 bg-gradient-to-r from-orange-200 via-amber-100 to-emerald-200 hover:from-orange-300 hover:via-amber-200 hover:to-emerald-300 border-orange-300/80 dark:border-emerald-400/50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Go to App
                </Link>
              ) : pathname === "/login" ? (
                <Link
                  href="/register"
                  className="px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold text-slate-900 dark:text-slate-950 bg-gradient-to-r from-orange-200 via-amber-100 to-emerald-200 hover:from-orange-300 hover:via-amber-200 hover:to-emerald-300 border border-orange-300/80 dark:border-emerald-400/50 shadow-xs whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Join Free
                </Link>
              ) : pathname === "/register" ? (
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition whitespace-nowrap"
                >
                  Log In
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                      isTransparent
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-[#131c18]"
                    }`}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all shadow-xs border hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap text-slate-900 dark:text-slate-950 bg-gradient-to-r from-orange-200 via-amber-100 to-emerald-200 hover:from-orange-300 hover:via-amber-200 hover:to-emerald-300 border-orange-300/80 dark:border-emerald-400/50"
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
