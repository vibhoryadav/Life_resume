import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashToken } from "@/lib/auth";
import { verificationDecisionSchema } from "@/lib/validation";
import { generateSignedDownloadToken } from "@/lib/storage";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Verification token is required." }, { status: 400 });
    }

    const tokenHash = hashToken(token);

    const vReq = await prisma.verificationRequest.findUnique({
      where: { verification_token_hash: tokenHash },
      include: {
        achievement: {
          include: {
            evidence: true,
            user: {
              select: {
                id: true,
                full_name: true,
                avatar_url: true,
              },
            },
          },
        },
      },
    });

    if (!vReq) {
      return NextResponse.json({ error: "Invalid verification link." }, { status: 404 });
    }

    if (vReq.status !== "PENDING") {
      return NextResponse.json({
        error: `This request has already been ${vReq.status.toLowerCase()}. Each verification link is single-use.`,
        status: vReq.status,
      }, { status: 410 });
    }

    if (new Date() > vReq.expires_at) {
      return NextResponse.json({ error: "This verification link has expired.", status: "EXPIRED" }, { status: 410 });
    }

    // Attach signed download tokens for each piece of evidence
    const sanitizedEvidence = vReq.achievement.evidence.map((ev) => ({
      id: ev.id,
      fileName: ev.file_name,
      fileType: ev.file_type,
      fileSize: ev.file_size,
      description: ev.description,
      downloadUrl: `/api/evidence/${ev.id}/download?token=${generateSignedDownloadToken(ev.id, vReq.achievement.user.id, 3600)}`,
    }));

    return NextResponse.json({
      valid: true,
      requestId: vReq.id,
      requesterName: vReq.achievement.user.full_name,
      achievement: {
        id: vReq.achievement.id,
        title: vReq.achievement.title,
        description: vReq.achievement.description,
        category: vReq.achievement.category,
        role: vReq.achievement.role,
        organization: vReq.achievement.organization,
        startDate: vReq.achievement.start_date,
        endDate: vReq.achievement.end_date,
        measurableImpact: vReq.achievement.measurable_impact,
        location: vReq.achievement.location,
        evidence: sanitizedEvidence,
      },
      message: vReq.message,
      verifierEmail: vReq.verifier_email,
      expiresAt: vReq.expires_at,
    });
  } catch (error) {
    console.error("[Verify GET Error]", error);
    return NextResponse.json({ error: "Failed to load verification details." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verificationDecisionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      token,
      decision,
      verifier_name,
      verifier_organization,
      verification_comment,
      role_confirmed,
      impact_confirmed,
    } = parsed.data;

    const tokenHash = hashToken(token);

    // Atomic transaction to guarantee single-use & consistent state
    const result = await prisma.$transaction(async (tx) => {
      const vReq = await tx.verificationRequest.findUnique({
        where: { verification_token_hash: tokenHash },
        include: {
          achievement: {
            include: { achievementSkills: true },
          },
        },
      });

      if (!vReq) {
        throw new Error("NOT_FOUND");
      }

      if (vReq.status !== "PENDING") {
        throw new Error("ALREADY_PROCESSED");
      }

      if (new Date() > vReq.expires_at) {
        throw new Error("EXPIRED");
      }

      const isApproved = decision === "APPROVE";
      const newStatus = isApproved ? "VERIFIED" : "REJECTED";
      const requestNewStatus = isApproved ? "APPROVED" : "REJECTED";

      // 1. Create permanent VerificationRecord
      const record = await tx.verificationRecord.create({
        data: {
          achievement_id: vReq.achievement_id,
          verifier_name,
          verifier_organization: verifier_organization || null,
          verification_method: "TOKEN_LINK",
          verification_status: requestNewStatus,
          verification_comment: [
            verification_comment,
            role_confirmed !== undefined ? `[Role confirmed: ${role_confirmed ? "Yes" : "Disputed"}]` : null,
            impact_confirmed !== undefined ? `[Impact confirmed: ${impact_confirmed ? "Yes" : "Disputed"}]` : null,
          ].filter(Boolean).join(" | "),
        },
      });

      // 2. Update achievement status
      await tx.achievement.update({
        where: { id: vReq.achievement_id },
        data: { verification_status: newStatus },
      });

      // 3. Mark request as finalized so token cannot be used again
      await tx.verificationRequest.update({
        where: { id: vReq.id },
        data: { status: requestNewStatus },
      });

      // 4. If approved, boost skill confidence
      if (isApproved && vReq.achievement.achievementSkills.length > 0) {
        for (const askill of vReq.achievement.achievementSkills) {
          await tx.userSkill.updateMany({
            where: {
              user_id: vReq.requester_id,
              skill_id: askill.skill_id,
            },
            data: {
              evidence_count: { increment: 1 },
            },
          });
        }
      }

      // 5. Create in-app notification for student
      await tx.notification.create({
        data: {
          user_id: vReq.requester_id,
          title: isApproved ? "Achievement Verified! 🎉" : "Verification Request Update",
          message: `${verifier_name} has ${isApproved ? "verified" : "declined"} your achievement: "${vReq.achievement.title}".`,
          type: "VERIFICATION",
        },
      });

      return { record, vReq };
    });

    await logAuditEvent({
      actorId: null,
      action: decision === "APPROVE" ? "ACHIEVEMENT_VERIFIED" : "ACHIEVEMENT_REJECTED",
      entityType: "ACHIEVEMENT",
      entityId: result.vReq.achievement_id,
      metadata: {
        verifierName: verifier_name,
        verifierOrganization: verifier_organization,
        decision,
      },
    });

    return NextResponse.json({
      message: decision === "APPROVE"
        ? "Thank you! The achievement has been officially verified."
        : "Your feedback has been recorded.",
      recordId: result.record.id,
    });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Invalid verification link." }, { status: 404 });
    }
    if (error.message === "ALREADY_PROCESSED") {
      return NextResponse.json({ error: "This verification link has already been used." }, { status: 410 });
    }
    if (error.message === "EXPIRED") {
      return NextResponse.json({ error: "This verification link has expired." }, { status: 410 });
    }
    console.error("[Verify POST Error]", error);
    return NextResponse.json({ error: "Could not submit verification decision." }, { status: 500 });
  }
}
