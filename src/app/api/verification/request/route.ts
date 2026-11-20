import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAuth, generateSecureToken } from "@/lib/auth";
import { verificationRequestSchema } from "@/lib/validation";
import { sendVerificationRequestEmail } from "@/lib/email";
import { logAuditEvent } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    const { allowed } = checkRateLimit(`verify-req:${session.userId}`, 10, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many verification requests submitted. Please wait before submitting more." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = verificationRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { achievement_id, verifier_email, message } = parsed.data;

    // Verify achievement ownership
    const achievement = await prisma.achievement.findFirst({
      where: { id: achievement_id, user_id: session.userId },
      include: { user: true },
    });

    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found or unauthorized." }, { status: 404 });
    }

    // Do not allow verifying own achievement with own email
    if (verifier_email.toLowerCase() === session.email.toLowerCase()) {
      return NextResponse.json(
        { error: "You cannot request verification from your own email address." },
        { status: 400 }
      );
    }

    // Generate single-use token and hash
    const { rawToken, tokenHash } = generateSecureToken();
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

    // If an existing pending request exists for this achievement and verifier, expire it
    await prisma.verificationRequest.updateMany({
      where: {
        achievement_id,
        verifier_email,
        status: "PENDING",
      },
      data: { status: "EXPIRED" },
    });

    // Create verification request in transaction
    const verificationRequest = await prisma.$transaction(async (tx) => {
      const vReq = await tx.verificationRequest.create({
        data: {
          achievement_id,
          requester_id: session.userId,
          verifier_email,
          verification_token_hash: tokenHash,
          status: "PENDING",
          message: message || null,
          expires_at: expiresAt,
        },
      });

      await tx.achievement.update({
        where: { id: achievement_id },
        data: { verification_status: "VERIFICATION_REQUESTED" },
      });

      return vReq;
    });

    // Send verification email
    await sendVerificationRequestEmail({
      to: verifier_email,
      requesterName: session.fullName,
      achievementTitle: achievement.title,
      rawToken,
      customMessage: message,
    });

    await logAuditEvent({
      actorId: session.userId,
      action: "VERIFICATION_REQUEST_SENT",
      entityType: "VERIFICATION_REQUEST",
      entityId: verificationRequest.id,
      metadata: { verifierEmail: verifier_email, achievementId: achievement_id },
    });

    return NextResponse.json({
      message: "Verification request dispatched successfully to " + verifier_email,
      requestId: verificationRequest.id,
      expiresAt,
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Verification Request Error]", error);
    return NextResponse.json({ error: "Failed to dispatch verification request" }, { status: 500 });
  }
}
