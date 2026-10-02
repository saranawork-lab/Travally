import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Initiates LinkedIn OAuth 2.0 / OpenID Connect authorization.
 * Redirects user to LinkedIn's official OAuth consent screen if credentials exist,
 * or returns JSON status indicating if live OAuth is configured.
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  const host = req.headers.get("x-forwarded-host") || req.nextUrl.host;
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const requestOrigin = `${proto}://${host}`;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    requestOrigin ||
    "http://localhost:3000";

  let redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  if (!redirectUri || (redirectUri.includes("localhost") && !host.includes("localhost"))) {
    redirectUri = `${requestOrigin}/api/auth/linkedin/callback`;
  }

  // Check if live LinkedIn credentials are configured
  const isConfigured = Boolean(
    clientId &&
      clientId.trim() !== "" &&
      clientId !== "your_linkedin_client_id" &&
      clientSecret &&
      clientSecret.trim() !== "" &&
      clientSecret !== "your_linkedin_client_secret"
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
    const redirectUrl = new URL(returnTo, requestOrigin);
    redirectUrl.searchParams.set(
      "error",
      "LinkedIn credentials are not configured in environment variables."
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Construct LinkedIn OpenID Connect authorization URL
  const state = Math.random().toString(36).substring(2, 15);
  const scope = encodeURIComponent("openid profile email");

  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${scope}`;

  const response = NextResponse.redirect(linkedinAuthUrl);

  // Store state and redirectUri for CSRF and callback verification
  response.cookies.set("linkedin_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60, // 10 minutes
    path: "/",
  });

  response.cookies.set("linkedin_oauth_redirect_uri", redirectUri, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60, // 10 minutes
    path: "/",
  });

  return response;
}
