import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { generateResumeDocument } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    const { allowed } = checkRateLimit(`ai:${session.userId}`, 20, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Rate limit reached. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const resumeType = body.resumeType || "JOB";
    const selectedAchievementIds = body.achievementIds as string[] | undefined;

    // Load user data
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Load user's achievements
    const achWhere: any = { user_id: session.userId };
    if (selectedAchievementIds && selectedAchievementIds.length > 0) {
      achWhere.id = { in: selectedAchievementIds };
    }

    const achievements = await prisma.achievement.findMany({
      where: achWhere,
      orderBy: [
        { verification_status: "desc" },
        { created_at: "desc" },
      ],
      take: 8,
    });

    // Load user educations
    const educations = await prisma.education.findMany({
      where: { user_id: session.userId },
      orderBy: { start_date: "desc" },
    });

    // Load user skills
    const userSkills = await prisma.userSkill.findMany({
      where: { user_id: session.userId },
      include: { skill: true },
      orderBy: { evidence_count: "desc" },
    });

    const skills = userSkills.map((us) => ({
      name: us.skill.name,
      category: us.skill.category,
      proficiency: us.proficiency,
    }));

    const resumeContent = await generateResumeDocument({
      user: {
        fullName: user.full_name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        headline: user.profile?.headline,
      },
      resumeType,
      achievements,
      educations,
      skills,
    });

    return NextResponse.json({ resumeContent });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[AI Generate Resume Error]", error);
    return NextResponse.json({ error: "Failed to generate resume." }, { status: 500 });
  }
}
