/**
 * Travally Founding Member & Milestone Badge System
 * 
 * Rules:
 * - Members #1 to #100: Every single member gets an exclusive permanent founding badge!
 *   - #1: "Genesis Explorer #1" (Mythic Gold aura, royal crown, animated glow)
 *   - #2 to #10: "Top 10 Pioneer #N" (Cyan & Gold energy aura, electric pioneer emblem)
 *   - #11 to #100: "Century Pioneer #N" (Emerald & Platinum luster aura, pioneer chevron)
 * - Members > #100: ONLY milestone hundreds get an exclusive badge:
 *   - #200, #300, #400, #500, #600, #700, #800, #900: "Centurion #N" (Solar Amber crest)
 *   - #1000: "Millennium Explorer #1000" (Historic Millennium Nova crest)
 *   - Other members (e.g. 101, 142, 205) have normal member ranking without the exclusive milestone badge.
 */

export type BadgeTier = "GENESIS" | "PIONEER_ELITE" | "CENTURY_PIONEER" | "CENTURION" | "MEMBER";

export interface UserBadge {
  hasBadge: boolean;
  rank: number;
  title: string | null;
  tier: BadgeTier;
  badgeLabel: string;
  badgeIcon: string;
  icon?: string;
  frameStyle: string;
  ringClass: string;
  glowClass: string;
  pillGradient: string;
  textColor: string;
  borderColor: string;
  description: string;
  isMilestone: boolean;
}

export function getBadgeForRank(rank: number = 1): UserBadge {
  const safeRank = Math.max(1, Math.floor(rank));

  // 1. Genesis Member #1 (The very first user)
  if (safeRank === 1) {
    return {
      hasBadge: true,
      rank: 1,
      title: "Genesis Explorer #1",
      tier: "GENESIS",
      badgeLabel: "#1 Genesis",
      badgeIcon: "👑",
      frameStyle: "genesis",
      ringClass: "ring-3 ring-amber-400 border-2 border-yellow-200 shadow-[0_0_25px_rgba(251,191,36,0.85)] animate-pulse",
      glowClass: "from-amber-400/30 via-yellow-400/20 to-amber-600/30",
      pillGradient: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/40",
      textColor: "text-amber-400",
      borderColor: "border-amber-400/60",
      description: "The very first explorer to join Travally in history. Permanent Genesis Rank #1.",
      isMilestone: true,
    };
  }

  // 2. Top 10 Pioneers (#2 to #10)
  if (safeRank >= 2 && safeRank <= 10) {
    return {
      hasBadge: true,
      rank: safeRank,
      title: `Top 10 Pioneer #${safeRank}`,
      tier: "PIONEER_ELITE",
      badgeLabel: `#${safeRank} Pioneer`,
      badgeIcon: "⚡",
      frameStyle: "pioneer",
      ringClass: "ring-2.5 ring-cyan-400 border-2 border-teal-200 shadow-[0_0_20px_rgba(6,182,212,0.7)]",
      glowClass: "from-cyan-500/25 via-teal-400/20 to-emerald-500/25",
      pillGradient: "bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 text-slate-950 font-black shadow-md shadow-cyan-500/30",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-400/60",
      description: `Top 10 Founding Pioneer of Travally. Permanent Rank #${safeRank}.`,
      isMilestone: true,
    };
  }

  // 3. Century Pioneers (#11 to #100)
  if (safeRank >= 11 && safeRank <= 100) {
    return {
      hasBadge: true,
      rank: safeRank,
      title: `Century Pioneer #${safeRank}`,
      tier: "CENTURY_PIONEER",
      badgeLabel: `#${safeRank} Founder`,
      badgeIcon: "🎖️",
      frameStyle: "century",
      ringClass: "ring-2 ring-emerald-400 border border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.55)]",
      glowClass: "from-emerald-500/20 via-teal-500/15 to-emerald-600/20",
      pillGradient: "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black shadow-sm",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-400/50",
      description: `First 100 Founding Members of Travally. Permanent Rank #${safeRank}.`,
      isMilestone: true,
    };
  }

  // 4. Milestone Centurions (#200, #300, #400, ... #1000)
  if (safeRank > 100 && safeRank % 100 === 0) {
    const is1000 = safeRank === 1000;
    return {
      hasBadge: true,
      rank: safeRank,
      title: is1000 ? "Millennium Explorer #1000" : `Centurion #${safeRank}`,
      tier: "CENTURION",
      badgeLabel: is1000 ? "#1000 Millennium" : `#${safeRank} Century`,
      badgeIcon: is1000 ? "🌟" : "🛡️",
      frameStyle: "centurion",
      ringClass: "ring-2.5 ring-orange-400 border-2 border-amber-300 shadow-[0_0_22px_rgba(249,115,22,0.7)] animate-pulse",
      glowClass: "from-orange-500/30 via-amber-400/20 to-rose-500/30",
      pillGradient: "bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 text-slate-950 font-black shadow-md shadow-orange-500/40",
      textColor: "text-orange-400",
      borderColor: "border-orange-400/60",
      description: is1000
        ? "The historic 1,000th member who unlocked Travally worldwide."
        : `Exclusive milestone century member #${safeRank}.`,
      isMilestone: true,
    };
  }

  // 5. Standard Verified Member (> 100 and not a milestone hundred)
  return {
    hasBadge: false,
    rank: safeRank,
    title: null,
    tier: "MEMBER",
    badgeLabel: `#${safeRank}`,
    badgeIcon: "🧭",
    frameStyle: "member",
    ringClass: "ring-1.5 ring-slate-300 dark:ring-emerald-800/60",
    glowClass: "from-slate-500/10 to-transparent",
    pillGradient: "bg-slate-200 dark:bg-emerald-950/80 text-slate-700 dark:text-emerald-300 font-bold",
    textColor: "text-slate-400",
    borderColor: "border-slate-300 dark:border-emerald-900/60",
    description: `Verified Member #${safeRank}`,
    isMilestone: false,
  };
}

export function parseRankFromMembership(membershipNumber?: string | null): number {
  if (!membershipNumber) return 1;
  const match = membershipNumber.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    return isNaN(num) || num < 1 ? 1 : num;
  }
  return 1;
}
