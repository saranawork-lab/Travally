"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, PlusCircle, Inbox, MessageSquare, User } from "lucide-react";
import { useBadges } from "@/hooks/useBadges";
import { useAuth } from "@/context/AuthContext";

interface BottomNavProps {
  initialUser?: any;
}

export const BottomNav: React.FC<BottomNavProps> = () => {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const { unreadChatsCount, pendingRequestsCount, totalUnreadMessages } = useBadges();

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
  const isProfile = pathname.startsWith("/profile") || pathname.startsWith("/settings");
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
    <nav
      className="md:hidden fixed bottom-3 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[460px] z-50 pointer-events-none select-none"
      aria-label="Mobile Navigation"
    >
      {/* 100% Circular pill container (rounded-full) */}
      <div className="pointer-events-auto w-full h-[58px] rounded-full bg-white/95 dark:bg-[#0c1410]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-emerald-800/60 shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.65),0_0_0_1px_rgba(16,185,129,0.25)] px-2 py-1.5 flex items-center justify-between gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeId;

          // Active tab: Expands into full circular pill with [ (Icon) Label ] matching logo colors (Orange to Emerald)
          if (isActive) {
            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={true}
                scroll={false}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(249, 115, 22, 0.32) 0%, rgba(245, 158, 11, 0.25) 42%, rgba(16, 185, 129, 0.36) 100%)",
                }}
                className="relative flex items-center justify-center gap-2 h-full px-4 rounded-full border border-emerald-500/50 dark:border-emerald-400/60 shadow-[0_2px_10px_rgba(16,185,129,0.18)] transition-all duration-300 select-none shrink-0"
              >
                {item.isProfile && currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.displayName || "Profile"}
                    className="w-5 h-5 min-w-[20px] max-w-[20px] min-h-[20px] max-h-[20px] rounded-full object-cover shrink-0 ring-1.5 ring-emerald-500/60"
                  />
                ) : (
                  <Icon className="w-5 h-5 shrink-0 text-emerald-900 dark:text-emerald-100 stroke-[2.5]" />
                )}

                {/* Text: Appears horizontally right next to the active icon */}
                <span className="text-xs font-black text-slate-900 dark:text-white whitespace-nowrap animate-fade-in tracking-tight">
                  {item.label}
                </span>

                {/* Badge if present */}
                {item.badge && item.badge !== 0 ? (
                  <span className="min-w-[16px] h-4 px-1 rounded-full bg-emerald-300/90 dark:bg-emerald-800 text-emerald-950 dark:text-emerald-100 text-[9px] font-black inline-flex items-center justify-center border border-emerald-400 dark:border-emerald-600 shadow-2xs">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          }

          // Inactive tab: Shows ONLY clean circular icon button with no text underneath
          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={true}
              scroll={false}
              className="relative flex items-center justify-center flex-1 h-full rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors select-none"
              title={item.label}
            >
              <div className="relative flex items-center justify-center">
                {item.isProfile && currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.displayName || "Profile"}
                    className="w-5 h-5 min-w-[20px] max-w-[20px] min-h-[20px] max-h-[20px] rounded-full object-cover shrink-0 ring-1.5 ring-slate-300 dark:ring-emerald-800/80 opacity-85 hover:opacity-100"
                  />
                ) : (
                  <Icon className="w-5 h-5 shrink-0 transition-transform active:scale-90" />
                )}

                {/* Badge docked at top-right of the inactive icon */}
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
  );
};

export default BottomNav;
