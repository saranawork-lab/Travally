/**
 * ═══════════════════════════════════════════════════════════════
 *  TRAVALLY — Server-Side Barrel Export
 *  Backend utilities: database, authentication, scoring.
 *  Import from "@/lib/server" in API routes and server components.
 * ═══════════════════════════════════════════════════════════════
 */

export { db, default as db_default } from "../db";
export {
  getCurrentUser,
  signToken,
  verifyToken,
  AuthService,
} from "../auth";
export type { SessionUser } from "../auth";
export {
  calculateTravelCompatibility,
} from "../scoring";
export type {
  TravelCompatibilityFactor,
  CompatibilityResult,
  UserTravelProfile,
  TripTarget,
} from "../scoring";
