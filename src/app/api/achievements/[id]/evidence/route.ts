import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { storeEvidenceFile } from "@/lib/storage";
import { logAuditEvent } from "@/lib/audit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: achievementId } = await params;
    const session = await requireAuth(req);

    // Verify achievement ownership
    const achievement = await prisma.achievement.findFirst({
      where: { id: achievementId, user_id: session.userId },
    });

    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found or unauthorized." }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const description = (formData.get("description") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Store file in private vault
    const uploadResult = await storeEvidenceFile(
      buffer,
      file.name,
      file.type,
      session.userId
    );

    // Create Evidence record in database
    const evidence = await prisma.$transaction(async (tx) => {
      const rec = await tx.evidence.create({
        data: {
          achievement_id: achievementId,
          uploaded_by: session.userId,
          file_name: uploadResult.fileName,
          file_type: uploadResult.fileType,
          storage_path: uploadResult.storagePath,
          file_size: uploadResult.fileSize,
          description,
        },
      });

      // Update achievement status if currently SELF_REPORTED
      if (achievement.verification_status === "SELF_REPORTED") {
        await tx.achievement.update({
          where: { id: achievementId },
          data: { verification_status: "EVIDENCE_ATTACHED" },
        });
      }

      return rec;
    });

    await logAuditEvent({
      actorId: session.userId,
      action: "EVIDENCE_ATTACHED",
      entityType: "EVIDENCE",
      entityId: evidence.id,
      metadata: { fileName: evidence.file_name, achievementId },
    });

    return NextResponse.json({ evidence }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Evidence Upload Error]", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload evidence." },
      { status: 400 }
    );
  }
}
