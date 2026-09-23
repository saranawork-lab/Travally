import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isAfter, isBefore, addHours } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "EEE, MMM d, yyyy");
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d");
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function isActivityUpcoming(date: Date | string, startTime: string): boolean {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  const [hours, minutes] = startTime.split(":").map(Number);
  d.setHours(hours || 0, minutes || 0, 0, 0);
  return isAfter(d, new Date());
}

export function isPastCutoff(date: Date | string, startTime: string, cutoffHours: number): boolean {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  const [hours, minutes] = startTime.split(":").map(Number);
  d.setHours(hours || 0, minutes || 0, 0, 0);
  const cutoffTime = addHours(new Date(), cutoffHours);
  return isBefore(d, cutoffTime);
}

export function safeJsonParse<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}
