import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { analyzeAchievement } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    const { allowed } = checkRateLimit(`ai:${session.userId}`, 30, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "AI rate limit reached. Please wait a moment." }, { status: 429 });
    }

    const body = await req.json();
    const { title, description, category } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required for analysis." }, { status: 400 });
    }

    const analysis = await analyzeAchievement({ title, description, category });
    return NextResponse.json({ analysis });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[AI Analyze Error]", error);
    return NextResponse.json({ error: "Failed to analyze achievement." }, { status: 500 });
  }
}
