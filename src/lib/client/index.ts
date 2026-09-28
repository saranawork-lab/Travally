/**
 * ═══════════════════════════════════════════════════════════════
 *  TRAVALLY — Client-Side Barrel Export
 *  Frontend utilities: formatting, media helpers, class merging.
 *  Import from "@/lib/client" in components and pages.
 * ═══════════════════════════════════════════════════════════════
 */

export {
  cn,
  formatDate,
  formatShortDate,
  formatTimeAgo,
  isActivityUpcoming,
  isPastCutoff,
  safeJsonParse,
} from "../utils";

export {
  getActivityImage,
  getTripImage,
  CATEGORY_ASSIGNED_IMAGES,
  CATEGORY_META,
} from "../images";
