"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  PlusCircle,
  Inbox,
  MessageSquare,
  Shield,
  ChevronRight,
} from "lucide-react";
import { useBadges } from "@/hooks/useBadges";
import { useAuth } from "@/context/AuthContext";

interface DesktopSidebarProps {
  initialUser?: any;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = () => {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const { unreadChatsCount, pendingRequestsCount, totalUnreadMessages } = useBadges();

  // State: whether user is hovering over the sidebar
  const [isHovered, setIsHovered] = useState(false);
  // State: when an option is clicked, force sidebar to shrink immediately
  const [forceCollapsed, setForceCollapsed] = useState(false);

  // Sync mode (companion vs travel) from URL or user preference
  const [mode, setMode] = useState<"companion" | "travel">("companion");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get("mode");
      if (urlMode === "companion" || urlMode === "travel") {
        setMode(urlMode);
      } else if (currentUser?.mode === "traveler") {
        setMode("travel");
      }
    }
  }, [pathname, currentUser]);

  // When route changes, shrink sidebar to collapsed state
  useEffect(() => {
    setForceCollapsed(true);
    setIsHovered(false);
  }, [pathname]);

  // 1. NEVER render sidebar when not logged in
  if (!currentUser) return null;

  // 2. NEVER render on public landing page or auth pages
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  // 3. Never render sidebar inside an active private chat room (chat has its own dedicated full-height view)
  if (pathname?.startsWith("/chats/") && pathname !== "/chats") {
    return null;
  }

  // Mouse hover handlers
  const handleMouseEnter = () => {
    setForceCollapsed(false);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setForceCollapsed(false);
    setIsHovered(false);
  };

  // Click handler: immediately shrink sidebar back to icons-only mode
  const handleItemClick = () => {
    setForceCollapsed(true);
    setIsHovered(false);
  };

  const isExpanded = isHovered && !forceCollapsed;

  // Active item determination
  const isDiscover = pathname.startsWith("/discover");
  const isCreate = pathname.startsWith("/activities/create") || pathname.startsWith("/travel/create");
  const isRequests = pathname.startsWith("/requests");
  const isChats = pathname.startsWith("/chats");
  const isSafety = pathname.startsWith("/safety");

  const navItems = [
    {
      id: "discover",
      label: "Discover",
      href: `/discover?mode=${mode}`,
      icon: Compass,
      isActive: isDiscover,
      badge: 0,
      badgeColor: "bg-emerald-500",
    },
    {
      id: "create",
      label: "Create",
      href: mode === "companion" ? "/activities/create" : "/travel/create",
      icon: PlusCircle,
      isActive: isCreate,
      badge: 0,
      badgeColor: "bg-emerald-500",
    },
    {
      id: "requests",
      label: "Requests",
      href: "/requests",
      icon: Inbox,
      isActive: isRequests,
      badge: pendingRequestsCount,
      badgeColor: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 border border-orange-300/80 shadow-xs",
    },
    {
      id: "chats",
      label: "Chats",
      href: "/chats",
      icon: MessageSquare,
      isActive: isChats,
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
      id: "safety",
      label: "Safety",
      href: "/safety",
      icon: Shield,
      isActive: isSafety,
      badge: 0,
      badgeColor: "bg-emerald-500",
    },
  ];

  return (
    <div className="hidden md:block shrink-0 w-[68px] relative select-none">
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed left-0 top-16 sm:top-18 bottom-0 z-30 flex flex-col bg-white/95 dark:bg-[#0c1410]/95 backdrop-blur-2xl border-r border-slate-200/85 dark:border-emerald-950/80 transition-all duration-300 ease-in-out ${
          isExpanded
            ? "w-60 shadow-[10px_0_36px_rgba(0,0,0,0.12)] dark:shadow-[12px_0_40px_rgba(0,0,0,0.7)]"
            : "w-[68px] shadow-[2px_0_10px_rgba(0,0,0,0.02)]"
        }`}
        aria-label="Desktop and Tablet Sidebar Navigation"
      >
        {/* Navigation items list */}
        <div className="flex-1 px-2.5 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={handleItemClick}
                prefetch={true}
                scroll={false}
                title={!isExpanded ? item.label : undefined}
                className={`group relative flex items-center rounded-2xl transition-all duration-200 ${
                  isExpanded
                    ? "w-full px-3.5 py-2.5 gap-3"
                    : "w-11 h-11 mx-auto justify-center"
                } ${
                  item.isActive
                    ? "bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 dark:from-emerald-950/80 dark:to-teal-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40 dark:border-emerald-600/50 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-[#16221c] border border-transparent"
                }`}
              >
                {/* Icon with relative badge container */}
                <div className="relative flex items-center justify-center shrink-0">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      item.isActive
                        ? "text-emerald-600 dark:text-emerald-400 stroke-[2.4]"
                        : "text-slate-500 dark:text-slate-400 stroke-[2]"
                    }`}
                  />

                  {/* Badge in collapsed mode: Compact pill docked at top-right of icon */}
                  {!isExpanded && item.badge && item.badge !== 0 ? (
                    <span
                      className={`absolute -top-1.5 -right-2 min-w-[15px] h-3.5 px-1 rounded-full text-[8px] font-bold inline-flex items-center justify-center ${
                        item.badgeColor
                      } ${item.id === "requests" ? "animate-pulse" : ""}`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </div>

                {/* Text Label & Badge in expanded mode */}
                {isExpanded && (
                  <div className="flex-1 flex items-center justify-between min-w-0 animate-fade-in">
                    <span
                      className={`text-xs font-semibold truncate ${
                        item.isActive
                          ? "text-emerald-900 dark:text-emerald-200 font-bold"
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {item.label}
                    </span>

                    {item.badge && item.badge !== 0 ? (
                      <span
                        className={`min-w-[18px] h-4.5 px-1.5 rounded-full text-[10px] font-bold inline-flex items-center justify-center shrink-0 ${
                          item.badgeColor
                        } ${item.id === "requests" ? "animate-pulse" : ""}`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                )}

                {/* Subtle active pulse dot when expanded */}
                {isExpanded && item.isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow shrink-0 animate-pulse ml-1" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom subtle indicator */}
        <div className="p-3 border-t border-slate-100 dark:border-emerald-950/60 flex items-center justify-center">
          {isExpanded ? (
            <div className="flex items-center justify-between w-full px-1 animate-fade-in">
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate">
                Travally
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                Quick Nav <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-emerald-900/80" />
          )}
        </div>
      </aside>
    </div>
  );
};

export default DesktopSidebar;
