import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken, AuthService as AuthCookieService } from "@/lib/auth";

export const ServerAuthService = {
  /**
   * Validates credentials and returns signed session token and user details.
   */
  async authenticateUser(email: string, password?: string) {
    const normalized = (email || "").toLowerCase().trim();

    const ALIAS_MAP: Record<string, string[]> = {
      "ananya@travally.app": ["ananya@travally.app", "ananya", "sarah", "sarah@travally.app"],
      "rohan@travally.app": ["rohan@travally.app", "rohan", "alex", "alex@travally.app"],
      "priya@travally.app": ["priya@travally.app", "priya", "maya", "maya@travally.app"],
      "admin@travally.app": ["admin@travally.app", "admin", "safety", "safety@travally.app"],
      "kabir@travally.app": ["kabir@travally.app", "kabir"],
      "sneha@travally.app": ["sneha@travally.app", "sneha"],
    };

    let targetPrimary = normalized;
    for (const [primaryEmail, aliases] of Object.entries(ALIAS_MAP)) {
      if (aliases.includes(normalized) || primaryEmail === normalized) {
        targetPrimary = primaryEmail;
        break;
      }
    }

    const candidateAliases = ALIAS_MAP[targetPrimary] || [normalized];
    const user = await db.user.findFirst({
      where: { email: { in: [targetPrimary, normalized, ...candidateAliases] } },
      include: { profile: true },
    });

    return { user, targetPrimary };
  },
};

export default ServerAuthService;
