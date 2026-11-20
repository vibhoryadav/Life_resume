import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    // Fetch all user records across all models
    const userData = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        profile: true,
        achievements: {
          include: {
            evidence: true,
            achievementSkills: { include: { skill: true } },
            verificationRecords: true,
          },
        },
        educations: true,
        projects: true,
        userSkills: { include: { skill: true } },
        recommendationsReceived: true,
        recommendationsGiven: true,
        resumes: true,
        notifications: true,
        subscription: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Exclude password hash and internal verification tokens from portable export
    const { password_hash, email_verification_token, password_reset_token, ...safeExport } = userData;

    await logAuditEvent({
      actorId: session.userId,
      action: "DATA_PORTABILITY_EXPORTED",
      entityType: "USER",
      entityId: session.userId,
    });

    const filename = `life-resume-export-${userData.profile?.custom_username || "user"}-${new Date().toISOString().split("T")[0]}.json`;

    return new NextResponse(JSON.stringify(safeExport, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to export personal data" }, { status: 500 });
  }
}
