import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { achievementSchema } from "@/lib/validation";
import { logAuditEvent } from "@/lib/audit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requireAuth(req);

    const achievement = await prisma.achievement.findFirst({
      where: {
        id,
        user_id: session.userId,
      },
      include: {
        evidence: true,
        achievementSkills: {
          include: { skill: true },
        },
        verificationRequests: true,
        verificationRecords: true,
      },
    });

    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found." }, { status: 404 });
    }

    return NextResponse.json({ achievement });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load achievement" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requireAuth(req);

    const existing = await prisma.achievement.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Achievement not found or unauthorized." }, { status: 404 });
    }

    const body = await req.json();
    const parsed = achievementSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const updated = await prisma.achievement.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category as any,
        organization: data.organization || null,
        role: data.role || null,
        start_date: data.start_date ? new Date(data.start_date) : null,
        end_date: data.end_date ? new Date(data.end_date) : null,
        measurable_impact: data.measurable_impact || null,
        location: data.location || null,
        visibility: data.visibility as any,
      },
    });

    await logAuditEvent({
      actorId: session.userId,
      action: "ACHIEVEMENT_UPDATED",
      entityType: "ACHIEVEMENT",
      entityId: id,
    });

    return NextResponse.json({ achievement: updated });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requireAuth(req);

    const existing = await prisma.achievement.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Achievement not found or unauthorized." }, { status: 404 });
    }

    await prisma.achievement.delete({
      where: { id },
    });

    await logAuditEvent({
      actorId: session.userId,
      action: "ACHIEVEMENT_DELETED",
      entityType: "ACHIEVEMENT",
      entityId: id,
    });

    return NextResponse.json({ message: "Achievement deleted successfully." });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 });
  }
}
