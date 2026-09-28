import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import db from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "travally-fallback-secret-for-dev";
const COOKIE_NAME = "travally_session";

export interface SessionUser {
  id: string;
  email: string;
  role: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  verificationStatus: string;
  city: string | null;
}

export function signToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "90d" });
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

/**
 * Retrieves the current session user from HTTP-only cookie.
 * Also checks database to return full profile and role.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.profile?.displayName || user.email.split("@")[0],
      avatarUrl: user.profile?.avatarUrl || null,
      isVerified: user.profile?.isVerified || false,
      verificationStatus: user.profile?.verificationStatus || "UNVERIFIED",
      city: user.profile?.city || null,
    };
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}

/**
 * Authentication service abstraction layer.
 * Pre-configured for local JWT sessions, with interfaces ready for Supabase or external SSO.
 */
export const AuthService = {
  getCookieName: () => COOKIE_NAME,
  getProvider: () => process.env.AUTH_PROVIDER || "local",
};
