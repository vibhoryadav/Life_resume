import { describe, it, expect } from "vitest";
import {
  analyzeAchievement,
  improveAchievement,
  generateResumeDocument,
} from "../lib/ai";

describe("AI Engine & Guardrail Verification", () => {
  it("should extract demonstrated skills from raw achievement descriptions", async () => {
    const input = {
      title: "Organized Flagship College Hackathon",
      description: "Managed 14 volunteers and coordinated 4,000 attendees across 3 days.",
    };

    const result = await analyzeAchievement(input);

    expect(result.suggestedCategory).toBe("EVENTS");
    expect(result.suggestedSkills.some((s) => s.name === "Event Management")).toBe(true);
    expect(result.suggestedSkills.some((s) => s.name === "Leadership")).toBe(true);
    expect(result.suggestedSkills.some((s) => s.name === "Team Coordination")).toBe(true);
    expect(result.detectedMetrics.length).toBeGreaterThan(0);
  });

  it("should polish wording without fabricating non-existent numbers or companies", async () => {
    const input = {
      title: "Disaster Alert SMS Gateway",
      description: "I worked on an offline SMS notification service for local floods.",
      measurableImpact: "120,000 notifications dispatched",
      organization: "Open Disaster Aid Labs",
    };

    const result = await improveAchievement(input);

    expect(result.improvedDescription).toContain("Spearheaded");
    expect(result.improvedDescription).toContain("120,000 notifications dispatched");
    // Ensure it did not hallucinate fortune 500 companies
    expect(result.improvedDescription).not.toContain("Google");
    expect(result.improvedDescription).not.toContain("Microsoft");
  });

  it("should synthesize ATS resume documents strictly from given profile records", async () => {
    const params = {
      user: {
        fullName: "Aarav Sharma",
        email: "aarav@example.com",
        headline: "Software Engineer",
      },
      resumeType: "JOB",
      achievements: [
        {
          title: "Disaster Alert SMS Gateway",
          description: "Engineered high throughput offline SMS dispatcher.",
          category: "TECHNOLOGY",
          organization: "Open Aid",
          role: "Core Developer",
          verification_status: "VERIFIED",
        },
      ],
      educations: [
        {
          institution: "Indian Institute of Information Technology",
          qualification: "B.Tech Computer Science",
          start_date: new Date("2022-08-01"),
        },
      ],
      skills: [
        { name: "Next.js", category: "Engineering", proficiency: "ADVANCED" },
        { name: "PostgreSQL", category: "Database", proficiency: "ADVANCED" },
      ],
    };

    const resume = await generateResumeDocument(params);

    expect(resume.headline).toContain("Aarav Sharma");
    expect(resume.sections.length).toBe(2);
    expect(resume.sections[0].items[0].title).toContain("Core Developer");
    expect(resume.sections[0].items[0].verificationBadge).toBe(true);
    expect(resume.skillsGrouped.length).toBeGreaterThan(0);
  });
});
