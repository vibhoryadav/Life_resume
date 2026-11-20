import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { comparePassword, signSessionToken, setSessionCookie } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const { allowed } = checkRateLimit(`login:${ip}`, 15, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many login attempts. Please wait 1 minute." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (user.account_status === "SUSPENDED") {
      return NextResponse.json({ error: "This account has been suspended. Please contact support." }, { status: 403 });
    }

    if (user.account_status === "DEACTIVATED") {
      return NextResponse.json({ error: "This account has been deactivated." }, { status: 403 });
    }

    const passwordMatches = await comparePassword(password, user.password_hash);
    if (!passwordMatches) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    });

    await logAuditEvent({
      actorId: user.id,
      action: "USER_LOGGED_IN",
      entityType: "USER",
      entityId: user.id,
    });

    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        emailVerified: user.email_verified,
        username: user.profile?.custom_username,
      },
    });

    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("[Login Error]", error);
    return NextResponse.json({ error: "An unexpected error occurred during login." }, { status: 500 });
  }
}
