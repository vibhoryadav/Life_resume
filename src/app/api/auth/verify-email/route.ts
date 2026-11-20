import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashToken } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Missing verification token" }, { status: 400 });
    }

    const tokenHash = hashToken(token);

    const user = await prisma.user.findFirst({
      where: { email_verification_token: tokenHash },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or already confirmed verification token." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email_verified: true,
        email_verification_token: null,
      },
    });

    await logAuditEvent({
      actorId: user.id,
      action: "EMAIL_VERIFIED",
      entityType: "USER",
      entityId: user.id,
    });

    return NextResponse.json({ message: "Email confirmed successfully. Your account is fully active." });
  } catch (error) {
    console.error("[Email Verification Error]", error);
    return NextResponse.json({ error: "Failed to confirm email." }, { status: 500 });
  }
}
