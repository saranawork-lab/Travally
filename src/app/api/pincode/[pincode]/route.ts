import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pincode: string }> }
) {
  const { pincode } = await params;

  if (!pincode || !/^\d{6}$/.test(pincode.trim())) {
    return NextResponse.json(
      { success: false, error: "Invalid 6-digit pincode" },
      { status: 400 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode.trim()}`, {
      signal: controller.signal,
      headers: { "Accept": "application/json" },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Postal service responded with an error" },
        { status: 502 }
      );
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0 || data[0].Status !== "Success") {
      return NextResponse.json(
        { success: false, error: "Pincode not found" },
        { status: 404 }
      );
    }

    const postOffices = data[0].PostOffice || [];
    const firstPo = postOffices[0] || {};
    
    // Clean area name, removing bracketed city if present: e.g. "Indiranagar (Bangalore)" -> "Indiranagar"
    const rawName = firstPo.Name || "";
    const cleanArea = rawName.replace(/\s*\([^)]*\)/g, "").trim();

    // Map common district names to standard city names if applicable
    let city = firstPo.District || cleanArea || "";
    if (city.toLowerCase() === "bangalore") city = "Bengaluru";

    return NextResponse.json({
      success: true,
      city,
      area: cleanArea,
      district: firstPo.District || "",
      state: firstPo.State || "",
      availableAreas: postOffices.map((po: any) => po.Name.replace(/\s*\([^)]*\)/g, "").trim()).filter(Boolean),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch postal data" },
      { status: 500 }
    );
  }
}
