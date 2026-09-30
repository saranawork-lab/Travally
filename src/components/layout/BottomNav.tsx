"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  PlusCircle,
  Inbox,
  MessageSquare,
  User,
  Settings,
  Shield,
  LogOut,
  LayoutDashboard,
  ChevronRight,
  X,
} from "lucide-react";
import { useBadges } from "@/hooks/useBadges";
import { useAuth } from "@/context/AuthContext";

interface BottomNavProps {
  initialUser?: any;
}

export const BottomNav: React.FC<BottomNavProps> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const { unreadChatsCount, pendingRequestsCount, totalUnreadMessages } = useBadges();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Close profile popup whenever the route changes
  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [pathname]);

  // Handle logout
  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
    router.push("/");
  };

  // 1. NEVER render bottom dock when not logged in
  if (!currentUser) return null;

  // 2. NEVER render on public landing page or auth pages
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  // 3. Never render floating dock inside an active private chat room (needs full space for keyboard & input)
  if (pathname?.startsWith("/chats/") && pathname !== "/chats") {
    return null;
  }

  // Determine active item
  const isCreate = pathname.startsWith("/activities/create") || pathname.startsWith("/travel/create");
  const isRequests = pathname.startsWith("/requests");
  const isChats = pathname.startsWith("/chats");
  const isProfile =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/safety") ||
    pathname.startsWith("/admin");
  const isDiscover = !isCreate && !isRequests && !isChats && !isProfile;

  const activeId = isProfile
    ? "profile"
    : isChats
    ? "chats"
    : isRequests
    ? "requests"
    : isCreate
    ? "create"
    : "discover";

  const navItems = [
    {
      id: "discover",
      label: "Discover",
      href: "/discover",
      icon: Compass,
      badge: 0,
      badgeColor: "bg-emerald-500",
    },
    {
      id: "create",
      label: "Create",
      href: currentUser?.mode === "traveler" ? "/travel/create" : "/activities/create",
      icon: PlusCircle,
      badge: 0,
      badgeColor: "bg-emerald-500",
    },
    {
      id: "requests",
      label: "Requests",
      href: "/requests",
      icon: Inbox,
      badge: pendingRequestsCount,
      badgeColor: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 border border-orange-300/80 shadow-xs",
    },
    {
      id: "chats",
      label: "Chats",
      href: "/chats",
      icon: MessageSquare,
      badge:
        totalUnreadMessages > 0
          ? totalUnreadMessages > 9
            ? "9+"
            : totalUnreadMessages
          : unreadChatsCount > 9
          ? "9+"
          : unreadChatsCount,
      badgeColor: "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-300/80 shadow-xs",
    },
    {
      id: "profile",
      label: "Profile",
      href: "/profile",
      icon: User,
      isProfile: true,
      badge: 0,
      badgeColor: "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-300/80 shadow-xs",
    },
  ];

  return (
    <>
      {/* Dimmed backdrop when mobile profile menu is open */}
      {isProfileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs z-40 animate-fade-in"
          onClick={() => setIsProfileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Profile Popup Sheet anchored directly above bottom dock */}
      {isProfileMenuOpen && (
        <div
          className="md:hidden fixed bottom-[76px] right-3 left-3 sm:left-auto sm:right-6 sm:w-80 max-w-sm ml-auto z-50 rounded-3xl bg-white/95 dark:bg-[#111a15]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-emerald-800/60 shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-3 animate-slide-up select-none"
          role="dialog"
          aria-label="User profile menu"
        >
          {/* User Details Header */}
          <div className="flex items-center gap-3 p-2 pb-3 border-b border-slate-100 dark:border-emerald-950/60">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-sm font-bold text-emerald-800 dark:text-emerald-300 shadow-sm shrink-0 overflow-hidden">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName || "User"}
                  className="w-full h-full object-cover"
                />
              ) : currentUser.displayName ? (
                currentUser.displayName.charAt(0).toUpperCase()
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {currentUser.displayName || "Travally Traveler"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {currentUser.email}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-800/50">
                  ✨ {currentUser.mode === "companion" ? "Companion" : "Traveler"}
                </span>
                {currentUser.isVerified && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-emerald-950/50 transition shrink-0"
              aria-label="Close profile menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action List */}
          <div className="mt-2 space-y-1">
            <Link
              href="/profile"
              onClick={() => setIsProfileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-[#18241f] hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
                  <User className="w-4 h-4" />
                </div>
                <span>My Profile &amp; Preferences</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 opacity-60" />
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsProfileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-[#18241f] hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
                  <Settings className="w-4 h-4" />
                </div>
                <span>Account Settings &amp; Pass</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 opacity-60" />
            </Link>

            {currentUser.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100/70 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <span>Admin Moderation</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 opacity-60" />
              </Link>
            )}

            <Link
              href="/safety"
              onClick={() => setIsProfileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-[#18241f] hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
                  <Shield className="w-4 h-4" />
                </div>
                <span>Safety Center &amp; Rules</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 opacity-60" />
            </Link>

            <div className="border-t border-slate-100 dark:border-emerald-950/60 my-1 pt-1">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-100/70 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span>Sign Out</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Dock */}
      <nav
        className="md:hidden fixed bottom-3 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[460px] z-50 pointer-events-none select-none"
        aria-label="Mobile Navigation"
      >
        {/* 100% Circular pill container (rounded-full) */}
        <div className="pointer-events-auto w-full h-[58px] rounded-full bg-white/95 dark:bg-[#0c1410]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-emerald-800/60 shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.65),0_0_0_1px_rgba(16,185,129,0.25)] px-2 py-1.5 flex items-center justify-between gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isProfileItem = item.id === "profile";
            const isActive = isProfileItem
              ? isProfileMenuOpen || activeId === "profile"
              : item.id === activeId;

            // Profile item button trigger
            if (isProfileItem) {
              if (isActive) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(249, 115, 22, 0.32) 0%, rgba(245, 158, 11, 0.25) 42%, rgba(16, 185, 129, 0.36) 100%)",
                    }}
                    className="relative flex items-center justify-center gap-2 h-full px-4 rounded-full border border-emerald-500/50 dark:border-emerald-400/60 shadow-[0_2px_10px_rgba(16,185,129,0.18)] transition-all duration-300 select-none shrink-0"
                    title="User Profile & Settings"
                  >
                    {currentUser?.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.displayName || "Profile"}
                        className="w-5 h-5 min-w-[20px] max-w-[20px] min-h-[20px] max-h-[20px] rounded-full object-cover shrink-0 ring-1.5 ring-emerald-500/60"
                      />
                    ) : (
                      <Icon className="w-5 h-5 shrink-0 text-emerald-900 dark:text-emerald-100 stroke-[2.5]" />
                    )}
                    <span className="text-xs font-black text-slate-900 dark:text-white whitespace-nowrap animate-fade-in tracking-tight">
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="relative flex items-center justify-center flex-1 h-full rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors select-none"
                  title="User Profile & Settings"
                >
                  <div className="relative flex items-center justify-center">
                    {currentUser?.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.displayName || "Profile"}
                        className="w-5 h-5 min-w-[20px] max-w-[20px] min-h-[20px] max-h-[20px] rounded-full object-cover shrink-0 ring-1.5 ring-slate-300 dark:ring-emerald-800/80 opacity-85 hover:opacity-100"
                      />
                    ) : (
                      <Icon className="w-5 h-5 shrink-0 transition-transform active:scale-90" />
                    )}
                  </div>
                </button>
              );
            }

            // Other items: Active tab expands into circular pill
            if (isActive) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsProfileMenuOpen(false)}
                  prefetch={true}
                  scroll={false}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(249, 115, 22, 0.32) 0%, rgba(245, 158, 11, 0.25) 42%, rgba(16, 185, 129, 0.36) 100%)",
                  }}
                  className="relative flex items-center justify-center gap-2 h-full px-4 rounded-full border border-emerald-500/50 dark:border-emerald-400/60 shadow-[0_2px_10px_rgba(16,185,129,0.18)] transition-all duration-300 select-none shrink-0"
                >
                  <Icon className="w-5 h-5 shrink-0 text-emerald-900 dark:text-emerald-100 stroke-[2.5]" />
                  <span className="text-xs font-black text-slate-900 dark:text-white whitespace-nowrap animate-fade-in tracking-tight">
                    {item.label}
                  </span>

                  {item.badge && item.badge !== 0 ? (
                    <span className="min-w-[16px] h-4 px-1 rounded-full bg-emerald-300/90 dark:bg-emerald-800 text-emerald-950 dark:text-emerald-100 text-[9px] font-black inline-flex items-center justify-center border border-emerald-400 dark:border-emerald-600 shadow-2xs">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            }

            // Inactive tab: Shows ONLY clean circular icon button
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsProfileMenuOpen(false)}
                prefetch={true}
                scroll={false}
                className="relative flex items-center justify-center flex-1 h-full rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors select-none"
                title={item.label}
              >
                <div className="relative flex items-center justify-center">
                  <Icon className="w-5 h-5 shrink-0 transition-transform active:scale-90" />

                  {item.badge && item.badge !== 0 ? (
                    <span
                      className={`absolute -top-1.5 -right-2 min-w-[15px] h-3.5 px-1 rounded-full text-[8px] font-bold inline-flex items-center justify-center ${
                        item.badgeColor
                      } ${item.id === "requests" ? "animate-pulse" : ""}`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
