import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { improveAchievement } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    const { allowed } = checkRateLimit(`ai:${session.userId}`, 30, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "AI rate limit reached. Please wait a moment." }, { status: 429 });
    }

    const body = await req.json();
    const { title, description, role, organization, measurableImpact } = body;

    if (!description || description.trim().length < 5) {
      return NextResponse.json({ error: "Please provide a description to polish." }, { status: 400 });
    }

    const improvement = await improveAchievement({
      title: title || "Achievement",
      description,
      role,
      organization,
      measurableImpact,
    });

    return NextResponse.json({ improvement });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[AI Improve Error]", error);
    return NextResponse.json({ error: "Failed to improve achievement." }, { status: 500 });
  }
}
