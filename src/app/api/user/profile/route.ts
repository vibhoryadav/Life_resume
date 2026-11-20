import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { userProfileSchema } from "@/lib/validation";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const profile = await prisma.userProfile.findUnique({
      where: { user_id: session.userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            full_name: true,
            bio: true,
            location: true,
            avatar_url: true,
          },
        },
      },
    });
    return NextResponse.json({ profile });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();

    const parsed = userProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check if new username taken by another user
    const existing = await prisma.userProfile.findFirst({
      where: {
        custom_username: data.custom_username,
        user_id: { not: session.userId },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "That username is already taken. Please choose another." }, { status: 409 });
    }

    const updated = await prisma.userProfile.upsert({
      where: { user_id: session.userId },
      update: {
        headline: data.headline || null,
        education_summary: data.education_summary || null,
        professional_summary: data.professional_summary || null,
        custom_username: data.custom_username,
        public_profile_enabled: data.public_profile_enabled,
        profile_visibility: data.profile_visibility as any,
      },
      create: {
        user_id: session.userId,
        headline: data.headline || null,
        education_summary: data.education_summary || null,
        professional_summary: data.professional_summary || null,
        custom_username: data.custom_username,
        public_profile_enabled: data.public_profile_enabled,
        profile_visibility: data.profile_visibility as any,
      },
    });

    // Optionally update bio/location if provided in body
    if (body.bio !== undefined || body.location !== undefined || body.full_name !== undefined) {
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          bio: body.bio !== undefined ? body.bio : undefined,
          location: body.location !== undefined ? body.location : undefined,
          full_name: body.full_name !== undefined ? body.full_name : undefined,
        },
      });
    }

    await logAuditEvent({
      actorId: session.userId,
      action: "USER_PROFILE_UPDATED",
      entityType: "USER_PROFILE",
      entityId: updated.id,
    });

    return NextResponse.json({ profile: updated });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
