import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAuth, comparePassword, clearSessionCookie } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();
    const { password, confirmationText } = body;

    if (confirmationText !== "DELETE MY LIFE RESUME") {
      return NextResponse.json(
        { error: "Confirmation phrase does not match. Please type 'DELETE MY LIFE RESUME'." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isPasswordCorrect = await comparePassword(password, user.password_hash);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Incorrect password. Account deletion aborted." }, { status: 401 });
    }

    // Cascade delete user
    await prisma.user.delete({
      where: { id: session.userId },
    });

    await logAuditEvent({
      actorId: null,
      action: "ACCOUNT_PERMANENTLY_DELETED",
      entityType: "USER",
      entityId: session.userId,
      metadata: { email: user.email },
    });

    const response = NextResponse.json({ message: "Your account and associated data have been permanently erased." });
    clearSessionCookie(response);
    return response;
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Account Deletion Error]", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
