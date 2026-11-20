import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { verifySignedDownloadToken } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: evidenceId } = await params;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const evidence = await prisma.evidence.findUnique({
      where: { id: evidenceId },
      include: { achievement: true },
    });

    if (!evidence) {
      return NextResponse.json({ error: "Evidence record not found." }, { status: 404 });
    }

    // Check authorization: signed token OR active session owner / admin
    let isAuthorized = false;

    if (token) {
      const verified = verifySignedDownloadToken(token);
      if (verified && verified.evidenceId === evidenceId) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      const session = await getSessionUser(req);
      if (
        session &&
        (session.userId === evidence.uploaded_by ||
          session.userId === evidence.achievement.user_id ||
          session.role === "SUPER_ADMIN" ||
          session.role === "INSTITUTION_ADMIN")
      ) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized access to evidence file." }, { status: 403 });
    }

    const fullPath = path.join(process.cwd(), "storage", evidence.storage_path);
    try {
      const fileBuffer = await fs.readFile(fullPath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": evidence.file_type,
          "Content-Disposition": `inline; filename="${evidence.file_name}"`,
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      });
    } catch {
      return NextResponse.json({ error: "Evidence file not found on disk." }, { status: 404 });
    }
  } catch (error) {
    console.error("[Evidence Download Error]", error);
    return NextResponse.json({ error: "Failed to download evidence." }, { status: 500 });
  }
}
