import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { resumeSchema } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requireAuth(req);

    const resume = await prisma.resume.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found." }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load resume" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requireAuth(req);

    const existing = await prisma.resume.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Resume not found or unauthorized." }, { status: 404 });
    }

    const body = await req.json();
    const parsed = resumeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.resume.update({
      where: { id },
      data: {
        title: parsed.data.title,
        resume_type: parsed.data.resume_type as any,
        template: parsed.data.template as any,
        content: parsed.data.content as any,
      },
    });

    return NextResponse.json({ resume: updated });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await requireAuth(req);

    const existing = await prisma.resume.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Resume not found or unauthorized." }, { status: 404 });
    }

    await prisma.resume.delete({ where: { id } });
    return NextResponse.json({ message: "Resume deleted successfully." });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
