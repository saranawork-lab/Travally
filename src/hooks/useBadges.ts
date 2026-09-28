"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface BadgeState {
  unreadChatsCount: number;
  pendingRequestsCount: number;
  totalUnreadMessages: number;
}

// Module-level shared singleton cache to prevent multiple concurrent requests from Navbar & BottomNav
let globalBadges: BadgeState = {
  unreadChatsCount: 0,
  pendingRequestsCount: 0,
  totalUnreadMessages: 0,
};

let lastFetchTime = 0;
let inFlightPromise: Promise<void> | null = null;
const subscribers = new Set<(badges: BadgeState) => void>();
let globalIntervalStarted = false;

function notifySubscribers() {
  subscribers.forEach((cb) => cb({ ...globalBadges }));
}

async function doFetchBadges(force = false) {
  const now = Date.now();
  // Don't refetch if fetched within last 8 seconds unless forced
  if (!force && now - lastFetchTime < 8000) {
    return;
  }

  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      const viewedAt = typeof window !== "undefined" ? localStorage.getItem("travally_requests_viewed_at") : null;
      const url = viewedAt ? `/api/badges?viewedAt=${encodeURIComponent(viewedAt)}` : "/api/badges";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        globalBadges = {
          unreadChatsCount: data.unreadChatsCount || 0,
          pendingRequestsCount: data.pendingRequestsCount || 0,
          totalUnreadMessages: data.totalUnreadMessages || 0,
        };
        lastFetchTime = Date.now();
        notifySubscribers();
      }
    } catch (_) {
      // ignore network errors
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

function ensureGlobalInterval() {
  if (globalIntervalStarted || typeof window === "undefined") return;
  globalIntervalStarted = true;
  setInterval(() => {
    doFetchBadges();
  }, 12000);

  const handleUpdate = () => doFetchBadges(true);
  window.addEventListener("travally_badges_updated", handleUpdate);
  window.addEventListener("storage", handleUpdate);
}

export function useBadges() {
  const pathname = usePathname();
  const [badges, setBadges] = useState<BadgeState>(globalBadges);

  useEffect(() => {
    ensureGlobalInterval();
    const subscriber = (newBadges: BadgeState) => {
      setBadges(newBadges);
    };
    subscribers.add(subscriber);

    // Initial fetch if stale
    doFetchBadges();

    return () => {
      subscribers.delete(subscriber);
    };
  }, []);

  // When on /requests, immediately clear pending count locally without hitting the server
  useEffect(() => {
    if (pathname?.startsWith("/requests")) {
      globalBadges = { ...globalBadges, pendingRequestsCount: 0 };
      setBadges({ ...globalBadges });
      if (typeof window !== "undefined") {
        localStorage.setItem("travally_requests_viewed_at", new Date().toISOString());
      }
    }
  }, [pathname]);

  return {
    unreadChatsCount: badges.unreadChatsCount,
    pendingRequestsCount: badges.pendingRequestsCount,
    totalUnreadMessages: badges.totalUnreadMessages,
    refreshBadges: () => doFetchBadges(true),
  };
}
