import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Initiates Google OAuth 2.0 authorization.
 * Reads GOOGLE_CLIENT_ID and GOOGLE_REDIRECT_URI strictly from environment variables.
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.nextUrl.origin ||
    "http://localhost:3000";

  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    `${appUrl}/api/auth/google/callback`;

  // Check if Google credentials are configured in environment
  const isConfigured = Boolean(
    clientId &&
      clientId.trim() !== "" &&
      clientSecret &&
      clientSecret.trim() !== ""
  );

  const searchParams = req.nextUrl.searchParams;
  const checkStatusOnly = searchParams.get("check") === "true";

  if (checkStatusOnly) {
    return NextResponse.json({
      configured: isConfigured,
      redirectUri,
    });
  }

  if (!isConfigured) {
    const returnTo = searchParams.get("returnTo") || "/login";
    const redirectUrl = new URL(returnTo, req.nextUrl.origin);
    redirectUrl.searchParams.set("error", "Google credentials are not configured in .env");
    return NextResponse.redirect(redirectUrl);
  }

  // Generate random CSRF state
  const state = Math.random().toString(36).substring(2, 15);
  const scope = encodeURIComponent("openid profile email");

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${scope}&access_type=offline&prompt=select_account`;

  const response = NextResponse.redirect(googleAuthUrl);

  // Store state cookie for verification
  response.cookies.set({
    name: "google_oauth_state",
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 mins
    path: "/",
  });

  return response;
}
