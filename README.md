# LIFE RESUME

> **"Your achievements. Your evidence. Your story."**  
> *"Don't just list what you can do. Show what you've done."*

Life Resume is a digital identity and achievement documentation platform. Rather than reducing years of leadership, hackathons, sports, research, and creative milestones onto a static 1-page paper resume, Life Resume allows learners, builders, and professionals to continuously document their authentic journey, attach primary evidence artifacts, and receive cryptographic third-party attestation from teachers, mentors, and event organizers.

---

## 🌟 Key Features

1. **Continuous Achievement Timeline**
   - Document milestones across 13 categories: Leadership, Events, Technology, Research, Competitions, Volunteering, Entrepreneurship, Academics, Sports, Arts, Certifications, Professional Experience, and Other.
   - Attach measurable outcomes (e.g. "4,000 attendees, 14 volunteer committees, ₹5L raised").

2. **Encrypted Evidence Vault**
   - Upload primary documents (PDF, JPG, PNG, WebP up to 10MB).
   - Served via signed, expiring download tokens. Private vaults remain isolated and protected against IDOR.

3. **Third-Party Verification Workflow**
   - Single-use, expiring (14-day) cryptographic verification tokens (`/verify/[token]`).
   - Verifiers review claims, inspect attached artifacts, and sign formal verification statements with zero account friction.
   - Prevention of token reuse, replay attacks, and self-attestation.

4. **Safe AI Engine**
   - **Feature A: Achievement Analysis** — Auto-extracts demonstrated skills and categorizes accomplishments.
   - **Feature B: Achievement Improvement** — Rephrases rough notes with active verbs and impact framing without hallucinating numbers or fake employers.
   - **Feature C: Tailored Resume Synthesis** — Generates ATS-optimized resumes (Job, Internship, College App, Scholarship, Founder) from verified data.

5. **AI Resume Builder & Export**
   - 3 Professional Templates: *Modern Minimal*, *Executive Ivory*, and *Tech Focus*.
   - In-place editable resume document sheet.
   - Clean, print-ready PDF export via standard browser print styles.

6. **Privacy-First Public Profiles**
   - Custom handles (e.g. `lifresume.com/u/aarav`).
   - Granular privacy defaults: unlisted/private achievements and documents are never exposed on public endpoints.

7. **DPDP Compliance & Security**
   - Aligned with the Indian Digital Personal Data Protection (DPDP) Act.
   - Full data portability (download complete portfolio archive in JSON).
   - Verified right to erasure with cascaded account deletion.
   - Age assurance and guardian consent compliance for minors.

8. **Super Admin Governance Console**
   - Platform telemetry: registered users, verified records, pending tokens, and system health.
   - User governance: account suspension and role assignment.
   - Structured immutable audit logging for security compliance.

---

## 🎨 Brand Identity & Design System

The application strictly implements the **Yellow + White** visual identity:

| Design Token | Hex Code | Role |
| :--- | :--- | :--- |
| **Primary Brand Yellow** | `#F5C542` | Primary CTA buttons, active tabs, brand iconography |
| **Secondary Yellow** | `#FFD966` | Subtle accents, hover states |
| **Soft Yellow Background** | `#FFF8E5` | Highlighted cards, hero decorative accents |
| **Warm Ivory** | `#FFFEF8` | Page surface background |
| **Pure White** | `#FFFFFF` | Main dashboard cards, navigation panels, forms |
| **Primary Text** | `#252525` | Headings, primary body text, dark button labels |
| **Secondary Text** | `#777777` | Metadata, helper labels, timestamps |
| **Border** | `#EFE9D9` | Card and component borders |
| **Success Green** | `#238B57` | Verified badges, confirmation banners |
| **Error Red** | `#D94B4B` | Deletion triggers, validation alerts |

---

## 🛠 Technology Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide icons
- **Backend:** Next.js Server-side API routes, strictly separated server actions
- **Database & ORM:** PostgreSQL, Prisma ORM, automated migrations
- **Authentication:** Cryptographic JWT session tokens, bcrypt password hashing, HTTP-only secure cookies
- **Storage:** Secure file vault with signed download tokens
- **Email:** Resend integration (with development preview fallback)
- **Validation:** Zod schemas
- **Testing:** Vitest, Testing Library, JSDOM
- **CI/CD:** GitHub Actions, Vercel

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (tested on Node 20 & Node 26)
- npm or pnpm
- PostgreSQL database (Supabase, Neon, or local PostgreSQL)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/vibhoryadav/Life_resume.git
cd Life_resume

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your environment variables:
```ini
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
AUTH_SECRET="your-super-secret-random-key-min-32-chars"
JWT_SECRET="your-super-secret-random-key-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY="re_..."
```

### 4. Database Setup & Migrations
```bash
# Generate the typed Prisma Client
npx prisma generate

# Apply migrations to your PostgreSQL database
npx prisma migrate dev --name init

# (Optional) Seed development demo accounts & achievements
npm run prisma:seed
```

### 5. Running the Application
```bash
# Start Next.js development server
npm run dev

# Open in browser
# http://localhost:3000
```

### 6. Executing Tests
```bash
# Run all unit and integration tests
npm test
```

---

## 👤 Development Demo Accounts

When seeded via `npm run prisma:seed`, the following accounts are available for testing:

| Role | Email | Password | Handle |
| :--- | :--- | :--- | :--- |
| **Student / Achiever** | `student@liferesume.demo` | `Password123!` | `/u/aarav` |
| **Super Admin** | `admin@liferesume.demo` | `Password123!` | `/u/eleanor_admin` |
| **Verifier** | `verifier@festival.org` | `Password123!` | `/u/sarah_jenkins_verifier` |
| **Institution Admin** | `mentor@stanford.edu` | `Password123!` | `/u/dr_marcus_thorne` |

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub: `https://github.com/vibhoryadav/Life_resume.git`.
2. In the [Vercel Dashboard](https://vercel.com):
   - Click **Add New Project** and import `vibhoryadav/Life_resume`.
   - Set **Framework Preset**: Next.js.
   - Set **Root Directory**: `./`.
3. Add the required Environment Variables in Vercel:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://life-resume.vercel.app`)
   - `RESEND_API_KEY`
4. Click **Deploy**. Vercel will build and deploy the production bundle automatically.

---

## 🔒 Security & Compliance

- **OWASP Top 10:** Parameterized SQL queries via Prisma, strict input validation via Zod, rate limiting, and output sanitization.
- **IDOR Protection:** All user-scoped records are strictly authorized against the server-verified session identity.
- **Cryptographic Attestation:** Verification links use raw high-entropy tokens with SHA-256 database token hashes.
- **DPDP Act Aligned:** Sovereign right to access, right to correction, right to data portability, and right to permanent erasure.
