import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        bio: true,
        location: true,
        role: true,
        account_status: true,
        email_verified: true,
        created_at: true,
        profile: true,
        subscription: true,
      },
    });

    if (!user || user.account_status !== "ACTIVE") {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("[Auth Me Error]", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
