"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, PlusCircle, Inbox, MessageSquare, User, Sparkles } from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const isDiscover = pathname.startsWith("/discover") || pathname === "/";
  const isCreate = pathname.includes("/create");
  const isRequests = pathname.startsWith("/requests");
  const isChats = pathname.startsWith("/chats");
  const isProfile = pathname.startsWith("/profile");

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1 safe-area-pb">
      <div className="flex items-center justify-around">
        <Link
          href="/discover"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
            isDiscover
              ? "text-teal-600 dark:text-teal-400 font-semibold"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Discover</span>
        </Link>

        <Link
          href="/activities/create"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
            isCreate
              ? "text-teal-600 dark:text-teal-400 font-semibold"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <PlusCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Create</span>
        </Link>

        <Link
          href="/requests"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
            isRequests
              ? "text-teal-600 dark:text-teal-400 font-semibold"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Inbox className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Requests</span>
        </Link>

        <Link
          href="/chats"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
            isChats
              ? "text-teal-600 dark:text-teal-400 font-semibold"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Chats</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
            isProfile
              ? "text-teal-600 dark:text-teal-400 font-semibold"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
