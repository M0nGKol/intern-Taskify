import { sendInviteEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Require authenticated session (BetterAuth)
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, projectName, role, acceptUrl } = await req.json();
    
    // Validate required fields
    if (!email ||!projectName|| !role || !acceptUrl) {
      return NextResponse.json(
        { error: "Missing required fields: email, projectName, role, acceptUrl" }, 
        { status: 400 }
      );
    }


    const result = await sendInviteEmail(email, projectName, role, acceptUrl);
    
    if (result && !result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "Email sent successfully",
        ...(result && { messageId: result.messageId, previewUrl: result.previewUrl })
      }, 
      { status: 200 }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("API route error:", message);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}   