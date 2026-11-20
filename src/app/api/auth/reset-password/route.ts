import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resetPasswordSchema } from "@/lib/validation";
import { hashPassword, hashToken } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;
    const tokenHash = hashToken(token);

    const user = await prisma.user.findFirst({
      where: {
        password_reset_token: tokenHash,
        password_reset_expires: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: passwordHash,
        password_reset_token: null,
        password_reset_expires: null,
      },
    });

    await logAuditEvent({
      actorId: user.id,
      action: "PASSWORD_RESET_COMPLETED",
      entityType: "USER",
      entityId: user.id,
    });

    return NextResponse.json({ message: "Password updated successfully. You can now sign in." });
  } catch (error) {
    console.error("[Reset Password Error]", error);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}
