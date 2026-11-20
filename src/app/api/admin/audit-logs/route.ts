import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireRole(["SUPER_ADMIN"], req);

    const logs = await prisma.auditLog.findMany({
      orderBy: { created_at: "desc" },
      take: 100,
    });

    return NextResponse.json({ logs });
  } catch (error: any) {
    if (error.message?.includes("FORBIDDEN")) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
