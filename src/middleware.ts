import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "travally_session";

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
    return Boolean(payload.userId);
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = isTokenActive(token);

  // Allow all static public assets (images, files with extensions like .png, .jpg, .svg, .ico)
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  // 1. If user is already authenticated and visits landing or auth pages,
  // redirect them straight to /discover (never show landing/auth page once logged in)
  if (isAuthenticated && (pathname === "/" || pathname === "/login" || pathname === "/register")) {
    const discoverUrl = new URL("/discover", request.url);
    return NextResponse.redirect(discoverUrl);
  }

  // 2. If user is NOT authenticated:
  // ONLY landing page (/), login (/login), register (/register), and safety (/safety) are public.
  // Any attempt to visit /discover or protected pages must redirect straight to the landing page (/)
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

