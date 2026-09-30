import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "travally_session";

function isValidObjectId(id: unknown): boolean {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
}

function isTokenActive(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const jsonString = atob(base64);
    const payload = JSON.parse(jsonString);
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false; // expired
    }
    return Boolean(payload.userId && isValidObjectId(payload.userId));
  } catch {
    return false;
  }
}

function getUserRoleFromToken(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const payload = JSON.parse(atob(base64));
    return payload.role || "USER";
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = isTokenActive(token);
  const userRole = getUserRoleFromToken(token);
  const isAdmin = userRole === "ADMIN";
  const isLaunchUnlocked = process.env.NEXT_PUBLIC_LAUNCH_UNLOCKED === "true";

  // Allow all static public assets (images, files with extensions like .png, .jpg, .svg, .ico)
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  // If a stale or invalid session cookie is present, automatically delete it from browser
  if (token && !isAuthenticated) {
    const isPublicPage =
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/register" ||
      pathname.startsWith("/safety");

    const response = isPublicPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  // 1. If user is already authenticated and visits landing or auth pages:
  // Redirect them to the Pre-Launch Early Access Hub (/launch) or /discover if unlocked
  if (isAuthenticated && (pathname === "/" || pathname === "/login" || pathname === "/register")) {
    const targetUrl = new URL(isLaunchUnlocked ? "/discover" : "/launch", request.url);
    return NextResponse.redirect(targetUrl);
  }

  // 2. Pre-launch gate:
  // When launch is not unlocked, non-admin members are held at /launch
  // (Full platform features /discover, /activities, /travel, /chats, /requests are guarded)
  if (isAuthenticated && !isLaunchUnlocked && !isAdmin) {
    const restrictedPrefixes = [
      "/discover",
      "/activities",
      "/travel",
      "/chats",
      "/requests",
      "/categories",
      "/destinations",
    ];
    const isRestricted = restrictedPrefixes.some((prefix) => pathname.startsWith(prefix));
    if (isRestricted) {
      return NextResponse.redirect(new URL("/launch", request.url));
    }
  }

  // 3. If user is NOT authenticated:
  // ONLY landing page (/), login (/login), register (/register), and safety (/safety) are public.
  const isPublicPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/safety");

  if (!isAuthenticated && !isPublicPage) {
    const landingUrl = new URL("/", request.url);
    return NextResponse.redirect(landingUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

