import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import { hashPassword, generateSecureToken, signSessionToken, setSessionCookie } from "@/lib/auth";
import { sendEmailConfirmation } from "@/lib/email";
import { logAuditEvent } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const { allowed } = checkRateLimit(`register:${ip}`, 10, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many registration attempts. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, full_name, date_of_birth } = parsed.data;

    // Check if email already in use
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Generate secure email verification token
    const { rawToken, tokenHash } = generateSecureToken();
    const passwordHash = await hashPassword(password);

    // Generate unique username based on full name
    const baseUsername = full_name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .substring(0, 15);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const customUsername = `${baseUsername}_${randomSuffix}`;

    // Create user and profile in transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          full_name,
          password_hash: passwordHash,
          role: "USER",
          email_verified: false,
          email_verification_token: tokenHash,
          date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
          profile: {
            create: {
              custom_username: customUsername,
              public_profile_enabled: false,
              headline: "Learner & Lifelong Achiever",
            },
          },
          subscription: {
            create: {
              plan: "FREE",
              status: "ACTIVE",
            },
          },
        },
        include: {
          profile: true,
        },
      });

      return user;
    });

    // Send email confirmation asynchronously
    await sendEmailConfirmation({ to: email, rawToken });

    // Create session token and set cookie
    const token = signSessionToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.full_name,
    });

    await logAuditEvent({
      actorId: newUser.id,
      action: "USER_REGISTERED",
      entityType: "USER",
      entityId: newUser.id,
      metadata: { email: newUser.email },
    });

    const response = NextResponse.json(
      {
        message: "Account created successfully. Please verify your email.",
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
          role: newUser.role,
          username: newUser.profile?.custom_username,
        },
      },
      { status: 201 }
    );

    setSessionCookie(response, token);
    return response;
  } catch (error: any) {
    console.error("[Register Error]", error);
    return NextResponse.json({ error: "Registration failed. Please try again later." }, { status: 500 });
  }
}
