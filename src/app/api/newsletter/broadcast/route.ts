import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { subject, message, testEmailOnly } = await req.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "RESEND_API_KEY is not configured in .env. Please set your Resend API key.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Travally <onboarding@resend.dev>";

    // If test mode is requested, only send to one specific test email
    if (testEmailOnly) {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: testEmailOnly,
        subject: `[TEST] ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
            <div style="background: #fef3c7; color: #92400e; padding: 8px 12px; border-radius: 6px; font-size: 12px; margin-bottom: 16px; font-weight: bold;">
              TEST BROADCAST PREVIEW
            </div>
            <h1 style="color: #0f172a; font-size: 22px; margin-bottom: 16px;">${subject}</h1>
            <div style="font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap;">
              ${message}
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">
              Sent by Travally to test recipient
            </p>
          </div>
        `,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Test email successfully sent to ${testEmailOnly}`,
        data,
      });
    }

    // 1. Fetch all active newsletter subscribers from database
    const subscribers = await db.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No active subscribers found in database.",
      }, { status: 400 });
    }

    const emailList = subscribers.map((s) => s.email);

    // 2. Resend batch sending (Resend batch API allows sending up to 100 emails at a time)
    const batchPayload = emailList.map((email) => ({
      from: fromEmail,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h1 style="color: #0f172a; font-size: 22px; margin-bottom: 16px;">${subject}</h1>
          <div style="font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap;">
            ${message}
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            You are receiving this because you subscribed to Travally Explorer Dispatch.
          </p>
        </div>
      `,
    }));

    // Send in chunks of 100 (Resend batch limit)
    const chunkSize = 100;
    let totalSent = 0;
    const errors: any[] = [];

    for (let i = 0; i < batchPayload.length; i += chunkSize) {
      const chunk = batchPayload.slice(i, i + chunkSize);
      try {
        const { data, error } = await resend.batch.send(chunk);
        if (error) {
          errors.push(error);
        } else {
          totalSent += chunk.length;
        }
      } catch (chunkErr) {
        errors.push(chunkErr);
      }
    }

    return NextResponse.json({
      success: totalSent > 0,
      totalRecipients: emailList.length,
      totalSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("[Broadcast] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to broadcast newsletter." },
      { status: 500 }
    );
  }
}
