-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'VERIFIER', 'INSTITUTION_ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('LEADERSHIP', 'ENTREPRENEURSHIP', 'ACADEMICS', 'SPORTS', 'ARTS', 'VOLUNTEERING', 'EVENTS', 'TECHNOLOGY', 'RESEARCH', 'COMPETITIONS', 'CERTIFICATIONS', 'PROFESSIONAL_EXPERIENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('SELF_REPORTED', 'EVIDENCE_ATTACHED', 'VERIFICATION_REQUESTED', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SkillProficiency" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "ResumeType" AS ENUM ('INTERNSHIP', 'JOB', 'COLLEGE_APPLICATION', 'SCHOLARSHIP', 'FOUNDER');

-- CreateEnum
CREATE TYPE "ResumeTemplate" AS ENUM ('MODERN_MINIMAL', 'EXECUTIVE_IVORY', 'TECH_FOCUS');

-- CreateEnum
CREATE TYPE "InstitutionRole" AS ENUM ('ADMIN', 'MEMBER', 'VERIFIER');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'INSTITUTION');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'PAST_DUE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('VERIFICATION', 'SYSTEM', 'RESUME', 'SECURITY');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "password_hash" TEXT,
    "avatar_url" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "bio" TEXT,
    "location" TEXT,
    "account_status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verification_token" TEXT,
    "password_reset_token" TEXT,
    "password_reset_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "headline" TEXT,
    "education_summary" TEXT,
    "professional_summary" TEXT,
    "public_profile_enabled" BOOLEAN NOT NULL DEFAULT false,
    "custom_username" TEXT NOT NULL,
    "profile_visibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "AchievementCategory" NOT NULL,
    "organization" TEXT,
    "role" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "measurable_impact" TEXT,
    "location" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'SELF_REPORTED',
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "achievement_id" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "achievement_id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "verifier_email" TEXT NOT NULL,
    "verifier_id" TEXT,
    "verification_token_hash" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRecord" (
    "id" TEXT NOT NULL,
    "achievement_id" TEXT NOT NULL,
    "verifier_id" TEXT,
    "verifier_name" TEXT NOT NULL,
    "verifier_organization" TEXT,
    "verification_method" TEXT NOT NULL DEFAULT 'TOKEN_LINK',
    "verification_status" TEXT NOT NULL,
    "verification_comment" TEXT,
    "verified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkill" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "proficiency" "SkillProficiency" NOT NULL DEFAULT 'INTERMEDIATE',
    "evidence_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementSkill" (
    "id" TEXT NOT NULL,
    "achievement_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "confidence_score" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "user_confirmed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AchievementSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "field_of_study" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "description" TEXT,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "technologies" TEXT[],
    "project_url" TEXT,
    "repository_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "recommender_id" TEXT,
    "recommender_name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "resume_type" "ResumeType" NOT NULL DEFAULT 'JOB',
    "content" JSONB NOT NULL,
    "template" "ResumeTemplate" NOT NULL DEFAULT 'MODERN_MINIMAL',
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionMembership" (
    "id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "InstitutionRole" NOT NULL DEFAULT 'MEMBER',
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstitutionMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "billing_provider" TEXT,
    "billing_customer_id" TEXT,
    "billing_subscription_id" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "reported_user_id" TEXT,
    "achievement_id" TEXT,
    "reason" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_account_status_idx" ON "User"("account_status");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_user_id_key" ON "UserProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_custom_username_key" ON "UserProfile"("custom_username");

-- CreateIndex
CREATE INDEX "UserProfile_custom_username_idx" ON "UserProfile"("custom_username");

-- CreateIndex
CREATE INDEX "UserProfile_public_profile_enabled_idx" ON "UserProfile"("public_profile_enabled");

-- CreateIndex
CREATE INDEX "Achievement_user_id_idx" ON "Achievement"("user_id");

-- CreateIndex
CREATE INDEX "Achievement_category_idx" ON "Achievement"("category");

-- CreateIndex
CREATE INDEX "Achievement_verification_status_idx" ON "Achievement"("verification_status");

-- CreateIndex
CREATE INDEX "Achievement_visibility_idx" ON "Achievement"("visibility");

-- CreateIndex
CREATE INDEX "Evidence_achievement_id_idx" ON "Evidence"("achievement_id");

-- CreateIndex
CREATE INDEX "Evidence_uploaded_by_idx" ON "Evidence"("uploaded_by");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_verification_token_hash_key" ON "VerificationRequest"("verification_token_hash");

-- CreateIndex
CREATE INDEX "VerificationRequest_achievement_id_idx" ON "VerificationRequest"("achievement_id");

-- CreateIndex
CREATE INDEX "VerificationRequest_requester_id_idx" ON "VerificationRequest"("requester_id");

-- CreateIndex
CREATE INDEX "VerificationRequest_verifier_email_idx" ON "VerificationRequest"("verifier_email");

-- CreateIndex
CREATE INDEX "VerificationRequest_verification_token_hash_idx" ON "VerificationRequest"("verification_token_hash");

-- CreateIndex
CREATE INDEX "VerificationRequest_status_idx" ON "VerificationRequest"("status");

-- CreateIndex
CREATE INDEX "VerificationRecord_achievement_id_idx" ON "VerificationRecord"("achievement_id");

-- CreateIndex
CREATE INDEX "VerificationRecord_verifier_id_idx" ON "VerificationRecord"("verifier_id");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE INDEX "Skill_name_idx" ON "Skill"("name");

-- CreateIndex
CREATE INDEX "UserSkill_user_id_idx" ON "UserSkill"("user_id");

-- CreateIndex
CREATE INDEX "UserSkill_skill_id_idx" ON "UserSkill"("skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserSkill_user_id_skill_id_key" ON "UserSkill"("user_id", "skill_id");

-- CreateIndex
CREATE INDEX "AchievementSkill_achievement_id_idx" ON "AchievementSkill"("achievement_id");

-- CreateIndex
CREATE INDEX "AchievementSkill_skill_id_idx" ON "AchievementSkill"("skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementSkill_achievement_id_skill_id_key" ON "AchievementSkill"("achievement_id", "skill_id");

-- CreateIndex
CREATE INDEX "Education_user_id_idx" ON "Education"("user_id");

-- CreateIndex
CREATE INDEX "Project_user_id_idx" ON "Project"("user_id");

-- CreateIndex
CREATE INDEX "Recommendation_user_id_idx" ON "Recommendation"("user_id");

-- CreateIndex
CREATE INDEX "Recommendation_recommender_id_idx" ON "Recommendation"("recommender_id");

-- CreateIndex
CREATE INDEX "Resume_user_id_idx" ON "Resume"("user_id");

-- CreateIndex
CREATE INDEX "Resume_resume_type_idx" ON "Resume"("resume_type");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_domain_key" ON "Institution"("domain");

-- CreateIndex
CREATE INDEX "Institution_domain_idx" ON "Institution"("domain");

-- CreateIndex
CREATE INDEX "InstitutionMembership_institution_id_idx" ON "InstitutionMembership"("institution_id");

-- CreateIndex
CREATE INDEX "InstitutionMembership_user_id_idx" ON "InstitutionMembership"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionMembership_institution_id_user_id_key" ON "InstitutionMembership"("institution_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_user_id_key" ON "Subscription"("user_id");

-- CreateIndex
CREATE INDEX "Subscription_user_id_idx" ON "Subscription"("user_id");

-- CreateIndex
CREATE INDEX "Subscription_plan_idx" ON "Subscription"("plan");

-- CreateIndex
CREATE INDEX "Notification_user_id_idx" ON "Notification"("user_id");

-- CreateIndex
CREATE INDEX "Notification_read_at_idx" ON "Notification"("read_at");

-- CreateIndex
CREATE INDEX "Report_reporter_id_idx" ON "Report"("reporter_id");

-- CreateIndex
CREATE INDEX "Report_reported_user_id_idx" ON "Report"("reported_user_id");

-- CreateIndex
CREATE INDEX "Report_achievement_id_idx" ON "Report"("achievement_id");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "AuditLog_actor_id_idx" ON "AuditLog"("actor_id");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entity_type_idx" ON "AuditLog"("entity_type");

-- CreateIndex
CREATE INDEX "AuditLog_created_at_idx" ON "AuditLog"("created_at");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRecord" ADD CONSTRAINT "VerificationRecord_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRecord" ADD CONSTRAINT "VerificationRecord_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementSkill" ADD CONSTRAINT "AchievementSkill_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementSkill" ADD CONSTRAINT "AchievementSkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_recommender_id_fkey" FOREIGN KEY ("recommender_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionMembership" ADD CONSTRAINT "InstitutionMembership_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionMembership" ADD CONSTRAINT "InstitutionMembership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reported_user_id_fkey" FOREIGN KEY ("reported_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "Achievement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

