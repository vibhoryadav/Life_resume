import { describe, it, expect } from "vitest";
import {
  registerSchema,
  achievementSchema,
  verificationRequestSchema,
  verificationDecisionSchema,
} from "../lib/validation";

describe("Input Validation & Zod Schemas", () => {
  it("should validate a complete, compliant registration input", () => {
    const valid = {
      full_name: "Aarav Sharma",
      email: "aarav@example.com",
      password: "SecurePassword123!",
      confirm_password: "SecurePassword123!",
      terms_accepted: true,
      age_confirmed: true,
    };

    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should reject registration if password does not meet complexity", () => {
    const invalid = {
      full_name: "Aarav Sharma",
      email: "aarav@example.com",
      password: "short",
      confirm_password: "short",
      terms_accepted: true,
      age_confirmed: true,
    };

    const result = registerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject registration if terms or age consent are not accepted", () => {
    const unaccepted = {
      full_name: "Aarav Sharma",
      email: "aarav@example.com",
      password: "SecurePassword123!",
      confirm_password: "SecurePassword123!",
      terms_accepted: false,
      age_confirmed: false,
    };

    const result = registerSchema.safeParse(unaccepted);
    expect(result.success).toBe(false);
  });

  it("should validate achievement creation payload", () => {
    const achievement = {
      title: "Organized State Hackathon",
      description: "Directed 14 volunteer committees and managed 4,000 attendees.",
      category: "EVENTS",
      role: "Lead Convener",
      organization: "Campus Tech Collective",
      measurable_impact: "4,000 attendees, 60 teams",
      visibility: "PUBLIC",
      skills: ["Event Management", "Leadership"],
    };

    const result = achievementSchema.safeParse(achievement);
    expect(result.success).toBe(true);
  });

  it("should validate verification requests and decisions", () => {
    const req = {
      achievement_id: "ach-123",
      verifier_email: "mentor@stanford.edu",
      message: "Please verify my role.",
    };
    expect(verificationRequestSchema.safeParse(req).success).toBe(true);

    const decision = {
      token: "a".repeat(32),
      decision: "APPROVE",
      verifier_name: "Dr. Marcus Thorne",
      verifier_organization: "Stanford ACM",
      verification_comment: "Confirmed with excellence.",
      role_confirmed: true,
      impact_confirmed: true,
    };
    expect(verificationDecisionSchema.safeParse(decision).success).toBe(true);
  });
});
