import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message, publicKey: clientKey } = await req.json();

    const cleanPhone = phone ? String(phone).replace(/[^0-9]/g, "") : "";
    if (!name || !email || !message || !cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "Name, email, message, and a valid 10-digit phone number are required." },
        { status: 400 }
      );
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_t9dwwep";
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_lecnff3";
    const publicKey = clientKey || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY;

    if (!publicKey) {
      return NextResponse.json(
        {
          error: "EmailJS Public Key is required. Please provide it or set NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in .env.",
          missingPublicKey: true,
        },
        { status: 400 }
      );
    }

    // Call EmailJS REST API
    const emailJsResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          from_name: name,
          name: name,
          from_email: email,
          email: email,
          reply_to: email,
          phone: phone || "Not provided",
          subject: subject || "New Inquiry from Travally",
          message: message,
        },
      }),
    });

    if (!emailJsResponse.ok) {
      const errText = await emailJsResponse.text();
      return NextResponse.json(
        { error: `EmailJS error (${emailJsResponse.status}): ${errText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message successfully transmitted via EmailJS!",
    });
  } catch (error: any) {
    console.error("[Connect API] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to transmit message." },
      { status: 500 }
    );
  }
}
