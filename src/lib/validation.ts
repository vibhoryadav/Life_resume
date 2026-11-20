import { z } from "zod";

export const AchievementCategoryEnum = z.enum([
  "LEADERSHIP",
  "ENTREPRENEURSHIP",
  "ACADEMICS",
  "SPORTS",
  "ARTS",
  "VOLUNTEERING",
  "EVENTS",
  "TECHNOLOGY",
  "RESEARCH",
  "COMPETITIONS",
  "CERTIFICATIONS",
  "PROFESSIONAL_EXPERIENCE",
  "OTHER",
]);

export const VerificationStatusEnum = z.enum([
  "SELF_REPORTED",
  "EVIDENCE_ATTACHED",
  "VERIFICATION_REQUESTED",
  "VERIFIED",
  "REJECTED",
  "EXPIRED",
]);

export const VisibilityEnum = z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]);
export const ProfileVisibilityEnum = z.enum(["PUBLIC", "PRIVATE", "RESTRICTED"]);
export const ResumeTypeEnum = z.enum([
  "INTERNSHIP",
  "JOB",
  "COLLEGE_APPLICATION",
  "SCHOLARSHIP",
  "FOUNDER",
]);
export const ResumeTemplateEnum = z.enum([
  "MODERN_MINIMAL",
  "EXECUTIVE_IVORY",
  "TECH_FOCUS",
]);

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
    email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirm_password: z.string(),
    date_of_birth: z.string().optional(),
    terms_accepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service and Privacy Policy",
    }),
    age_confirmed: z.boolean().refine((val) => val === true, {
      message: "Please confirm you meet age and consent requirements",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, "Invalid reset token"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const achievementSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  category: AchievementCategoryEnum,
  organization: z.string().trim().max(100).optional().nullable(),
  role: z.string().trim().max(100).optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  measurable_impact: z.string().trim().max(300).optional().nullable(),
  location: z.string().trim().max(100).optional().nullable(),
  visibility: VisibilityEnum.default("PUBLIC"),
  skills: z.array(z.string().trim()).optional().default([]),
});

export type AchievementInput = z.infer<typeof achievementSchema>;

export const verificationRequestSchema = z.object({
  achievement_id: z.string().min(1, "Achievement ID is required"),
  verifier_email: z.string().trim().email("Please enter a valid verifier email").toLowerCase(),
  message: z.string().trim().max(500).optional().nullable(),
});

export const verificationDecisionSchema = z.object({
  token: z.string().min(10, "Valid verification token is required"),
  decision: z.enum(["APPROVE", "REJECT"]),
  verifier_name: z.string().trim().min(2, "Verifier name is required").max(100),
  verifier_organization: z.string().trim().max(150).optional().nullable(),
  verification_comment: z.string().trim().max(1000).optional().nullable(),
  role_confirmed: z.boolean().optional(),
  impact_confirmed: z.boolean().optional(),
});

export const resumeSchema = z.object({
  title: z.string().trim().min(2, "Resume title is required").max(100),
  resume_type: ResumeTypeEnum.default("JOB"),
  template: ResumeTemplateEnum.default("MODERN_MINIMAL"),
  content: z.record(z.any()),
});

export const userProfileSchema = z.object({
  headline: z.string().trim().max(150).optional().nullable(),
  education_summary: z.string().trim().max(500).optional().nullable(),
  professional_summary: z.string().trim().max(1000).optional().nullable(),
  custom_username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be under 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
  public_profile_enabled: z.boolean().default(false),
  profile_visibility: ProfileVisibilityEnum.default("PUBLIC"),
});

export const educationSchema = z.object({
  institution: z.string().trim().min(2, "Institution is required"),
  qualification: z.string().trim().min(2, "Qualification is required"),
  field_of_study: z.string().trim().optional().nullable(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional().nullable(),
  description: z.string().trim().max(500).optional().nullable(),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Project title is required"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  technologies: z.array(z.string().trim()).default([]),
  project_url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  repository_url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
});
