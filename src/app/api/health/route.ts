import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const start = Date.now();
  let dbStatus = "healthy";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err: any) {
    dbStatus = "unreachable: " + (err.message || "database connection error");
  }

  const responseTimeMs = Date.now() - start;

  return NextResponse.json(
    {
      status: dbStatus === "healthy" ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      service: "life-resume-engine",
      database: dbStatus,
      responseTimeMs,
      version: "1.0.0",
    },
    { status: dbStatus === "healthy" ? 200 : 503 }
  );
}
