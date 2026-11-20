import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { resumeSchema } from "@/lib/validation";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const resumes = await prisma.resume.findMany({
      where: { user_id: session.userId },
      orderBy: { updated_at: "desc" },
    });
    return NextResponse.json({ resumes });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load resumes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();

    const parsed = resumeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, resume_type, template, content } = parsed.data;

    const resume = await prisma.resume.create({
      data: {
        user_id: session.userId,
        title,
        resume_type: resume_type as any,
        template: template as any,
        content: content as any,
      },
    });

    await logAuditEvent({
      actorId: session.userId,
      action: "RESUME_SAVED",
      entityType: "RESUME",
      entityId: resume.id,
      metadata: { title },
    });

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 });
  }
}
