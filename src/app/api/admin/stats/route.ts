import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireRole(["SUPER_ADMIN"], req);

    const [
      totalUsers,
      activeUsers,
      totalAchievements,
      verifiedAchievements,
      pendingVerifications,
      totalInstitutions,
      openReports,
      totalResumes,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { account_status: "ACTIVE" } }),
      prisma.achievement.count(),
      prisma.achievement.count({ where: { verification_status: "VERIFIED" } }),
      prisma.verificationRequest.count({ where: { status: "PENDING" } }),
      prisma.institution.count(),
      prisma.report.count({ where: { status: "OPEN" } }),
      prisma.resume.count(),
    ]);

    const recentAuditLogs = await prisma.auditLog.findMany({
      orderBy: { created_at: "desc" },
      take: 10,
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalAchievements,
        verifiedAchievements,
        pendingVerifications,
        totalInstitutions,
        openReports,
        totalResumes,
      },
      recentLogs: recentAuditLogs,
    });
  } catch (error: any) {
    if (error.message?.includes("FORBIDDEN")) {
      return NextResponse.json({ error: "Access denied. Administrator privilege required." }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
