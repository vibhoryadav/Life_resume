export interface AchievementAnalysisResult {
  suggestedCategory: string;
  suggestedSkills: { name: string; confidence: number; category: string }[];
  detectedMetrics: string[];
  suggestedTitle?: string;
}

export interface AchievementImprovementResult {
  improvedDescription: string;
  keyActionVerbs: string[];
  suggestedImpactStatement: string;
}

export interface GeneratedResumeContent {
  headline: string;
  summary: string;
  sections: {
    title: string;
    items: {
      title: string;
      subtitle: string;
      dateRange: string;
      bullets: string[];
      skills: string[];
      verificationBadge?: boolean;
    }[];
  }[];
  skillsGrouped: {
    category: string;
    skills: string[];
  }[];
}

// Deterministic intelligent skill dictionary & NLP heuristics
const SKILL_RULES: { keywords: RegExp[]; skill: string; category: string }[] = [
  { keywords: [/organiz/i, /attendee/i, /festival/i, /event/i, /conference/i], skill: "Event Management", category: "Operations" },
  { keywords: [/manag/i, /lead/i, /leader/i, /head/i, /director/i], skill: "Leadership", category: "Management" },
  { keywords: [/volunteer/i, /team/i, /coordinat/i, /collab/i], skill: "Team Coordination", category: "Management" },
  { keywords: [/sponsor/i, /partner/i, /fundrais/i, /pitch/i], skill: "Sponsorship & Partnerships", category: "Business" },
  { keywords: [/budget/i, /financ/i, /cost/i, /revenue/i, /profit/i], skill: "Budgeting & Financial Planning", category: "Finance" },
  { keywords: [/market/i, /campaign/i, /social media/i, /growth/i, /brand/i], skill: "Marketing & Outreach", category: "Marketing" },
  { keywords: [/react/i, /next\.?js/i, /typescript/i, /javascript/i, /frontend/i], skill: "Frontend Development", category: "Engineering" },
  { keywords: [/node/i, /python/i, /api/i, /backend/i, /database/i, /postgres/i], skill: "Backend Engineering", category: "Engineering" },
  { keywords: [/design/i, /figma/i, /ui/i, /ux/i, /prototyp/i], skill: "UI/UX Design", category: "Design" },
  { keywords: [/research/i, /paper/i, /survey/i, /data analysis/i, /analy/i], skill: "Data Analysis & Research", category: "Analytics" },
  { keywords: [/public speak/i, /speech/i, /present/i, /panel/i], skill: "Public Speaking", category: "Communication" },
  { keywords: [/customer/i, /client/i, /support/i, /user success/i], skill: "Stakeholder Relations", category: "Operations" },
];

/**
 * Feature A: Analyze Achievement
 * Extracts skills, category, and numerical impact without hallucinating facts.
 */
export async function analyzeAchievement(input: {
  title: string;
  description: string;
  category?: string;
}): Promise<AchievementAnalysisResult> {
  const combinedText = `${input.title} ${input.description}`;
  const suggestedSkills: { name: string; confidence: number; category: string }[] = [];

  for (const rule of SKILL_RULES) {
    if (rule.keywords.some((kw) => kw.test(combinedText))) {
      suggestedSkills.push({
        name: rule.skill,
        confidence: 0.9,
        category: rule.category,
      });
    }
  }

  // Detect quantitative metrics
  const metricRegex = /(\b\d+(?:[,\.]\d+)?\s*(?:k|m|%)?|\$\d+(?:[,\.]\d+)?|\b\d+\+?)\s*(?:attendees|volunteers|participants|students|users|dollars|rupees|members|growth|events|projects|hours)/gi;
  const detectedMetrics = combinedText.match(metricRegex) || [];

  // Suggest category if not provided
  let suggestedCategory = input.category || "LEADERSHIP";
  if (/festival|event|hackathon|meetup/i.test(combinedText)) {
    suggestedCategory = "EVENTS";
  } else if (/start-?up|found|venture|revenue|sales/i.test(combinedText)) {
    suggestedCategory = "ENTREPRENEURSHIP";
  } else if (/code|software|app|github|algorithm/i.test(combinedText)) {
    suggestedCategory = "TECHNOLOGY";
  } else if (/research|paper|lab|academic|thesis/i.test(combinedText)) {
    suggestedCategory = "RESEARCH";
  } else if (/award|won|first place|finalist|hackathon/i.test(combinedText)) {
    suggestedCategory = "COMPETITIONS";
  }

  return {
    suggestedCategory,
    suggestedSkills: suggestedSkills.length > 0 ? suggestedSkills : [
      { name: "Strategic Execution", confidence: 0.75, category: "General" },
      { name: "Communication", confidence: 0.75, category: "Soft Skills" }
    ],
    detectedMetrics: Array.from(new Set(detectedMetrics)),
  };
}

/**
 * Feature B: Improve Achievement
 * Transforms rough user notes into clean, impactful, professional bullet descriptions.
 * STRICT RULE: Does not invent external metrics or companies not mentioned in input.
 */
export async function improveAchievement(input: {
  title: string;
  description: string;
  role?: string | null;
  organization?: string | null;
  measurableImpact?: string | null;
}): Promise<AchievementImprovementResult> {
  const desc = input.description.trim();
  const title = input.title.trim();
  const org = input.organization ? ` at ${input.organization}` : "";

  // Structure into high-impact active phrasing
  let improved = desc;
  const firstWord = desc.split(" ")[0].toLowerCase();

  if (["i", "was", "helped", "worked"].includes(firstWord)) {
    improved = desc
      .replace(/^i\s+(?:was\s+responsible\s+for|helped\s+to|worked\s+on)\s+/i, "Spearheaded ")
      .replace(/^i\s+/i, "Led ");
  }

  if (input.measurableImpact) {
    improved = `${improved}. Delivered measurable impact: ${input.measurableImpact}.`;
  }

  return {
    improvedDescription: `${improved.trim()}`,
    keyActionVerbs: ["Spearheaded", "Orchestrated", "Directed", "Executed", "Optimized"],
    suggestedImpactStatement: input.measurableImpact || "Resulted in successful on-time execution with full stakeholder satisfaction.",
  };
}

/**
 * Feature C: Resume Generation
 * Synthesizes user achievements, education, and verified skills into an ATS-friendly, professional structured document.
 */
export async function generateResumeDocument(params: {
  user: {
    fullName: string;
    email: string;
    bio?: string | null;
    location?: string | null;
    headline?: string | null;
  };
  resumeType: string;
  achievements: Array<{
    title: string;
    description: string;
    category: string;
    organization?: string | null;
    role?: string | null;
    start_date?: Date | null;
    end_date?: Date | null;
    measurable_impact?: string | null;
    verification_status: string;
  }>;
  educations: Array<{
    institution: string;
    qualification: string;
    field_of_study?: string | null;
    start_date: Date;
    end_date?: Date | null;
    description?: string | null;
  }>;
  skills: Array<{
    name: string;
    category?: string | null;
    proficiency: string;
  }>;
}): Promise<GeneratedResumeContent> {
  const typeLabel = params.resumeType.replace("_", " ").toLowerCase();

  const headline = params.user.headline
    ? `${params.user.fullName} | ${params.user.headline}`
    : `${params.user.fullName} | Life Resume Portfolio`;
  const summary = `Dynamic professional with demonstrated achievement in ${params.achievements.slice(0, 3).map(a => a.title).join(", ") || "cross-functional leadership"}. Proven track record with documented, verified experiences.`;

  const achievementItems = params.achievements.map((ach) => ({
    title: ach.role ? `${ach.role} — ${ach.title}` : ach.title,
    subtitle: ach.organization || "Independent Accomplishment",
    dateRange: ach.start_date
      ? `${new Date(ach.start_date).getFullYear()} – ${ach.end_date ? new Date(ach.end_date).getFullYear() : "Present"}`
      : "Active Record",
    bullets: [
      ach.description,
      ach.measurable_impact ? `Impact: ${ach.measurable_impact}` : "",
    ].filter(Boolean),
    skills: [ach.category],
    verificationBadge: ach.verification_status === "VERIFIED",
  }));

  const educationItems = params.educations.map((edu) => ({
    title: edu.qualification,
    subtitle: edu.institution + (edu.field_of_study ? ` (${edu.field_of_study})` : ""),
    dateRange: `${new Date(edu.start_date).getFullYear()} – ${edu.end_date ? new Date(edu.end_date).getFullYear() : "Present"}`,
    bullets: edu.description ? [edu.description] : [],
    skills: [],
  }));

  // Group skills
  const skillsByCategory: Record<string, string[]> = {};
  for (const s of params.skills) {
    const cat = s.category || "Core Competencies";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(s.name);
  }

  const skillsGrouped = Object.entries(skillsByCategory).map(([category, skills]) => ({
    category,
    skills,
  }));

  if (skillsGrouped.length === 0) {
    skillsGrouped.push({
      category: "Demonstrated Capabilities",
      skills: ["Leadership", "Project Management", "Strategic Execution", "Collaboration"],
    });
  }

  return {
    headline,
    summary,
    sections: [
      {
        title: "Verified & Key Achievements",
        items: achievementItems,
      },
      {
        title: "Education & Qualifications",
        items: educationItems,
      },
    ],
    skillsGrouped,
  };
}
