import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validation";
import { generateSecureToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { logAuditEvent } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const { allowed } = checkRateLimit(`forgot-pw:${ip}`, 5, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many reset attempts. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
    }

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success response to prevent email enumeration attacks
    if (user && user.account_status === "ACTIVE") {
      const { rawToken, tokenHash } = generateSecureToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password_reset_token: tokenHash,
          password_reset_expires: expiresAt,
        },
      });

      await sendPasswordResetEmail({ to: user.email, rawToken });

      await logAuditEvent({
        actorId: user.id,
        action: "PASSWORD_RESET_REQUESTED",
        entityType: "USER",
        entityId: user.id,
      });
    }

    return NextResponse.json({
      message: "If an account exists with that email, a password reset link has been dispatched.",
    });
  } catch (error) {
    console.error("[Forgot Password Error]", error);
    return NextResponse.json({ error: "Could not process request." }, { status: 500 });
  }
}
