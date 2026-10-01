import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Save or reactivate subscriber in MongoDB Atlas
    const subscriber = await db.newsletterSubscriber.upsert({
      where: { email: cleanEmail },
      update: { isActive: true },
      create: { email: cleanEmail, isActive: true },
    });

    console.log(`[Newsletter] Subscribed: ${cleanEmail} at ${new Date().toISOString()}`);

    // 2. If RESEND_API_KEY is configured, send an immediate welcome email
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "Travally <onboarding@resend.dev>";
        
        await resend.emails.send({
          from: fromEmail,
          to: cleanEmail,
          subject: "Welcome to Travally Explorer Dispatch! 🌍✈️",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h1 style="color: #0f172a; font-size: 24px; margin-bottom: 16px;">Welcome to Travally! 🌍</h1>
              <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                Thanks for subscribing to the <strong>Travally Explorer Dispatch</strong>. You'll be the first to hear about curated travel companions, spontaneous city meetups, weekend getaways, and VIP community perks.
              </p>
              <div style="margin: 28px 0; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/tracking" style="display: inline-block; background: linear-gradient(135deg, #f97316, #10b981); color: #ffffff; font-weight: bold; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-size: 14px;">
                  Explore Live Community
                </a>
              </div>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="font-size: 12px; color: #94a3b8; text-align: center;">
                Travally Inc. • Connect with like-minded travel companions
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.warn("[Newsletter] Welcome email could not be dispatched via Resend:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to Travally Explorer Dispatch!",
      subscriberId: subscriber.id,
    });
  } catch (error) {
    console.error("[Newsletter] Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription." },
      { status: 500 }
    );
  }
}

// GET endpoint to view subscribers count and list
export async function GET(req: NextRequest) {
  try {
    const count = await db.newsletterSubscriber.count({
      where: { isActive: true },
    });

    const subscribers = await db.newsletterSubscriber.findMany({
      where: { isActive: true },
      orderBy: { subscribedAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      totalSubscribers: count,
      subscribers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subscribers." },
      { status: 500 }
    );
  }
}
