import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface RouteParams {
  params: Promise<{ username: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { username } = await params;

    const profile = await prisma.userProfile.findUnique({
      where: { custom_username: username },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            bio: true,
            location: true,
            created_at: true,
            achievements: {
              where: {
                visibility: "PUBLIC",
              },
              include: {
                achievementSkills: {
                  include: { skill: true },
                },
                verificationRecords: {
                  select: {
                    verifier_name: true,
                    verifier_organization: true,
                    verification_method: true,
                    verification_comment: true,
                    verified_at: true,
                  },
                },
              },
              orderBy: [
                { verification_status: "desc" },
                { created_at: "desc" },
              ],
            },
            educations: {
              orderBy: { start_date: "desc" },
            },
            projects: {
              orderBy: { created_at: "desc" },
            },
            userSkills: {
              include: { skill: true },
              orderBy: { evidence_count: "desc" },
            },
            recommendationsReceived: {
              where: { status: "APPROVED" },
              select: {
                id: true,
                recommender_name: true,
                relationship: true,
                content: true,
                created_at: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    if (!profile.public_profile_enabled) {
      return NextResponse.json({
        error: "This user profile is currently set to private.",
        private: true,
      }, { status: 403 });
    }

    return NextResponse.json({
      profile: {
        fullName: profile.user.full_name,
        avatarUrl: profile.user.avatar_url,
        bio: profile.user.bio,
        location: profile.user.location,
        headline: profile.headline,
        educationSummary: profile.education_summary,
        professionalSummary: profile.professional_summary,
        customUsername: profile.custom_username,
        memberSince: profile.user.created_at,
        achievements: profile.user.achievements,
        educations: profile.user.educations,
        projects: profile.user.projects,
        skills: profile.user.userSkills,
        recommendations: profile.user.recommendationsReceived,
      },
    });
  } catch (error) {
    console.error("[Public Profile Error]", error);
    return NextResponse.json({ error: "Failed to load public profile." }, { status: 500 });
  }
}
