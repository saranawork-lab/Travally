import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getCallById,
  answerCall,
  declineCall,
  endCall,
  addIceCandidate,
} from "@/lib/callSignaling";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const call = getCallById(params.id);
    if (!call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    return NextResponse.json({ call });
  } catch (error) {
    console.error("GET /api/calls/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch call" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, sdpAnswer, candidate, fromCaller } = body;

    const call = getCallById(params.id);
    if (!call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    let updated = call;

    switch (action) {
      case "ANSWER":
        updated = answerCall(params.id, user.id, sdpAnswer) || call;
        break;
      case "DECLINE":
        updated = declineCall(params.id) || call;
        break;
      case "END":
        updated = endCall(params.id) || call;
        break;
      case "ICE_CANDIDATE":
        addIceCandidate(params.id, Boolean(fromCaller), candidate);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ call: updated });
  } catch (error) {
    console.error("POST /api/calls/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to process call action" },
      { status: 500 }
    );
  }
}
