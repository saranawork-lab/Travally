import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken, AuthService } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      displayName,
      city,
      gender,
      birthDate,
      bio,
      interests,
      preferredActivities,
      connectionPreferences,
      linkedinUrl,
    } = body;

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: "Email, password, and display name are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    let calculatedAge: number | undefined = undefined;
    let parsedBirthDate: Date | undefined = undefined;
    if (birthDate) {
      parsedBirthDate = new Date(birthDate);
      const diffMs = Date.now() - parsedBirthDate.getTime();
      const ageDt = new Date(diffMs);
      calculatedAge = Math.abs(ageDt.getUTCFullYear() - 1970);
      if (calculatedAge < 18) {
        return NextResponse.json(
          { error: "You must be at least 18 years old to join Travally." },
          { status: 400 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        role: "USER",
        profile: {
          create: {
            displayName: displayName.trim(),
            avatarUrl: `https://avatar.vercel.sh/${encodeURIComponent(displayName)}`,
            city: city ? city.trim() : null,
            gender: gender || "PREFER_NOT_TO_SAY",
            birthDate: parsedBirthDate,
            age: calculatedAge,
            bio: bio ? bio.trim() : "",
            interests: JSON.stringify(Array.isArray(interests) ? interests : []),
            preferredActivities: JSON.stringify(
              Array.isArray(preferredActivities) ? preferredActivities : []
            ),
            connectionPreferences: JSON.stringify(connectionPreferences || { friendship: true, activityPartner: true }),
            isVerified: false,
            verificationStatus: "UNVERIFIED",
            linkedinUrl: linkedinUrl ? linkedinUrl.trim() : null,
            hideContactDetails: true,
            discoveryVisible: true,
          },
        },
      },
      include: { profile: true },
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        displayName: newUser.profile?.displayName,
        avatarUrl: newUser.profile?.avatarUrl,
        isVerified: false,
        verificationStatus: "UNVERIFIED",
      },
    });

    response.cookies.set({
      name: AuthService.getCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
