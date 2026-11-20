import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    await requireRole(["SUPER_ADMIN"], req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q");

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { full_name: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
        account_status: true,
        email_verified: true,
        created_at: true,
        _count: {
          select: {
            achievements: true,
            resumes: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 50,
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    if (error.message?.includes("FORBIDDEN")) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireRole(["SUPER_ADMIN"], req);
    const body = await req.json();
    const { userId, account_status, role } = body;

    if (!userId) {
      return NextResponse.json({ error: "Target userId required" }, { status: 400 });
    }

    // Prevent self-demotion or self-suspension by the last admin
    if (userId === session.userId && (account_status === "SUSPENDED" || role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Cannot suspend or demote yourself." }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        account_status: account_status ? (account_status as any) : undefined,
        role: role ? (role as any) : undefined,
      },
    });

    await logAuditEvent({
      actorId: session.userId,
      action: "USER_ADMIN_STATUS_CHANGED",
      entityType: "USER",
      entityId: userId,
      metadata: { newStatus: account_status, newRole: role },
    });

    return NextResponse.json({ user: updated });
  } catch (error: any) {
    if (error.message?.includes("FORBIDDEN")) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
