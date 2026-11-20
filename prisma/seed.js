const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding development demo data for LIFE RESUME...");

  // Clear existing demo data in reverse relation order
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.project.deleteMany();
  await prisma.education.deleteMany();
  await prisma.achievementSkill.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.verificationRecord.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.institutionMembership.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Super Admin Demo Account
  const admin = await prisma.user.create({
    data: {
      email: "admin@liferesume.demo",
      full_name: "Eleanor Vance (Platform Admin)",
      password_hash: passwordHash,
      role: "SUPER_ADMIN",
      email_verified: true,
      profile: {
        create: {
          headline: "Platform Operations & Verification Trust Officer",
          custom_username: "eleanor_admin",
          public_profile_enabled: true,
        },
      },
    },
  });

  // 2. Institution & Institution Admin
  const institution = await prisma.institution.create({
    data: {
      name: "Stanford University / ACM Student Chapter",
      domain: "stanford.edu",
      description: "Official student branch of the Association for Computing Machinery",
    },
  });

  const institutionAdmin = await prisma.user.create({
    data: {
      email: "mentor@stanford.edu",
      full_name: "Dr. Marcus Thorne",
      password_hash: passwordHash,
      role: "INSTITUTION_ADMIN",
      email_verified: true,
      profile: {
        create: {
          headline: "Faculty Advisor & Computer Science Department Lead",
          custom_username: "dr_marcus_thorne",
          public_profile_enabled: true,
        },
      },
    },
  });

  await prisma.institutionMembership.create({
    data: {
      institution_id: institution.id,
      user_id: institutionAdmin.id,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  // 3. Verifier Account
  const verifier = await prisma.user.create({
    data: {
      email: "verifier@festival.org",
      full_name: "Sarah Jenkins",
      password_hash: passwordHash,
      role: "VERIFIER",
      email_verified: true,
      profile: {
        create: {
          headline: "Head of Operations, Annual Innovation Festival",
          custom_username: "sarah_jenkins_verifier",
          public_profile_enabled: true,
        },
      },
    },
  });

  // 4. Primary Student / Demo User
  const student = await prisma.user.create({
    data: {
      email: "student@liferesume.demo",
      full_name: "Aarav Sharma",
      password_hash: passwordHash,
      role: "USER",
      email_verified: true,
      bio: "Computer Science builder passionate about distributed systems, community hackathons, and climate tech.",
      location: "Bengaluru, India",
      profile: {
        create: {
          headline: "Full-Stack Engineer & Campus Tech Lead",
          custom_username: "aarav",
          public_profile_enabled: true,
          education_summary: "B.Tech in Computer Science & Engineering (2022 - 2026)",
          professional_summary: "Built scalable web apps, organized state-level hackathons with 4,000+ attendees, and published peer-reviewed AI research.",
        },
      },
      subscription: {
        create: {
          plan: "PRO",
          status: "ACTIVE",
        },
      },
    },
  });

  // Seed Skills
  const skillsData = [
    { name: "Event Management", category: "Operations" },
    { name: "Leadership", category: "Management" },
    { name: "Team Coordination", category: "Management" },
    { name: "Next.js", category: "Engineering" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Public Speaking", category: "Communication" },
  ];

  const createdSkills = [];
  for (const s of skillsData) {
    const skill = await prisma.skill.create({ data: s });
    createdSkills.push(skill);
    await prisma.userSkill.create({
      data: {
        user_id: student.id,
        skill_id: skill.id,
        proficiency: "ADVANCED",
        evidence_count: 2,
      },
    });
  }

  // Seed Achievements
  const ach1 = await prisma.achievement.create({
    data: {
      user_id: student.id,
      title: "Organized Annual Tech Summit & Hackathon",
      description: "Spearheaded planning and execution of 3-day flagship festival. Coordinated 14 volunteer committees, managed 4,000 attendees, and handled partner relations.",
      category: "EVENTS",
      organization: "Campus Tech Collective",
      role: "Lead Convener",
      measurable_impact: "4,000+ attendees, 60 hackathon teams, 100% on-time execution",
      start_date: new Date("2024-03-01"),
      end_date: new Date("2024-03-04"),
      verification_status: "VERIFIED",
      visibility: "PUBLIC",
    },
  });

  // Attached Evidence for ach1
  await prisma.evidence.create({
    data: {
      achievement_id: ach1.id,
      uploaded_by: student.id,
      file_name: "Summit_Organizer_Certificate.pdf",
      file_type: "application/pdf",
      storage_path: "vault/demo/Summit_Organizer_Certificate.pdf",
      file_size: 1024 * 450,
      description: "Official signed certificate from university patron.",
    },
  });

  // Verification Record for ach1
  await prisma.verificationRecord.create({
    data: {
      achievement_id: ach1.id,
      verifier_id: verifier.id,
      verifier_name: "Sarah Jenkins",
      verifier_organization: "Annual Innovation Festival Board",
      verification_method: "TOKEN_LINK",
      verification_status: "APPROVED",
      verification_comment: "Confirmed. Aarav effectively coordinated 14 volunteers and managed the full audience logistics flawlessly.",
    },
  });

  // Link skills to ach1
  await prisma.achievementSkill.create({
    data: {
      achievement_id: ach1.id,
      skill_id: createdSkills[0].id, // Event Management
      confidence_score: 1.0,
      user_confirmed: true,
    },
  });
  await prisma.achievementSkill.create({
    data: {
      achievement_id: ach1.id,
      skill_id: createdSkills[1].id, // Leadership
      confidence_score: 1.0,
      user_confirmed: true,
    },
  });

  // Achievement 2: In-review verification
  const ach2 = await prisma.achievement.create({
    data: {
      user_id: student.id,
      title: "Built Open-Source Disaster Response SMS Alert Gateway",
      description: "Engineered high-throughput offline SMS dispatch system handling emergency warnings for localized floods.",
      category: "TECHNOLOGY",
      organization: "Open Disaster Aid Labs",
      role: "Core Developer",
      measurable_impact: "Delivered 120,000 critical alerts with sub-second latency.",
      start_date: new Date("2024-06-01"),
      end_date: new Date("2024-09-01"),
      verification_status: "VERIFICATION_REQUESTED",
      visibility: "PUBLIC",
    },
  });

  // Seed Education
  await prisma.education.create({
    data: {
      user_id: student.id,
      institution: "Indian Institute of Information Technology",
      qualification: "Bachelor of Technology",
      field_of_study: "Computer Science & Artificial Intelligence",
      start_date: new Date("2022-08-01"),
      end_date: new Date("2026-05-01"),
      description: "Focus on distributed systems, algorithms, and applied machine learning.",
    },
  });

  // Seed Project
  await prisma.project.create({
    data: {
      user_id: student.id,
      title: "Life Resume Identity Engine",
      description: "Decentralized achievement verification platform bridging portfolio evidence with verified trust anchors.",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
      project_url: "https://liferesume.com",
      repository_url: "https://github.com/vibhoryadav/life-resume",
    },
  });

  console.log("✅ Seed completed successfully with demo accounts:");
  console.log("   - User: student@liferesume.demo / Password123! (Username: aarav)");
  console.log("   - Admin: admin@liferesume.demo / Password123!");
  console.log("   - Verifier: verifier@festival.org / Password123!");
  console.log("   - Institution Admin: mentor@stanford.edu / Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
