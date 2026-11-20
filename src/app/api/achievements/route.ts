import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { achievementSchema } from "@/lib/validation";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("q");

    const where: any = { user_id: session.userId };
    if (category && category !== "ALL") {
      where.category = category;
    }
    if (status && status !== "ALL") {
      where.verification_status = status;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { organization: { contains: search, mode: "insensitive" } },
      ];
    }

    const achievements = await prisma.achievement.findMany({
      where,
      include: {
        evidence: true,
        achievementSkills: {
          include: { skill: true },
        },
        verificationRequests: {
          orderBy: { created_at: "desc" },
          take: 1,
        },
        verificationRecords: {
          orderBy: { verified_at: "desc" },
          take: 1,
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ achievements });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Achievements GET Error]", error);
    return NextResponse.json({ error: "Failed to load achievements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();

    const parsed = achievementSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const achievement = await prisma.$transaction(async (tx) => {
      const created = await tx.achievement.create({
        data: {
          user_id: session.userId,
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
          verification_status: "SELF_REPORTED",
        },
      });

      // Handle skills
      if (data.skills && data.skills.length > 0) {
        for (const skillName of data.skills) {
          const trimmed = skillName.trim();
          if (!trimmed) continue;

          // Upsert skill
          const skill = await tx.skill.upsert({
            where: { name: trimmed },
            update: {},
            create: { name: trimmed, category: "Demonstrated Skill" },
          });

          // Link to achievement
          await tx.achievementSkill.create({
            data: {
              achievement_id: created.id,
              skill_id: skill.id,
              confidence_score: 1.0,
              user_confirmed: true,
            },
          });

          // Upsert UserSkill
          await tx.userSkill.upsert({
            where: {
              user_id_skill_id: {
                user_id: session.userId,
                skill_id: skill.id,
              },
            },
            update: {
              evidence_count: { increment: 1 },
            },
            create: {
              user_id: session.userId,
              skill_id: skill.id,
              proficiency: "INTERMEDIATE",
              evidence_count: 1,
            },
          });
        }
      }

      return created;
    });

    await logAuditEvent({
      actorId: session.userId,
      action: "ACHIEVEMENT_CREATED",
      entityType: "ACHIEVEMENT",
      entityId: achievement.id,
      metadata: { title: achievement.title },
    });

    return NextResponse.json({ achievement }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Achievements POST Error]", error);
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}
