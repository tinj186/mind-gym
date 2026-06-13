This Markdown document serves as the Project Manifesto and Technical Source of Truth for The Mind Gym. It integrates the high-level educational philosophy with the "Universal Engine" protocols established during the development of the Singapore Math modules.

📜 Project Manifesto: The Mind Gym
1. Executive Summary
The Math Mind Gym is a commercial-grade, adaptive EdTech platform focused on the Singapore MOE Primary School Mathematics syllabus. It is designed to scale across multiple subjects and levels. Moving beyond a static "Question Bank," it functions as an intelligent coaching platform that tracks granular student mastery ("synapse strength"), identifies specific learning bottlenecks ("defect codes"), and curates daily personalized workouts.

2. Mission and Vision
Vision: To build a "gym for the mind" where synapses are trained like muscles. We ensure students build correct neural pathways, eliminating "bad form" and reinforcing mastery through targeted practice.

Mission: To provide an intelligent, frictionless learning environment bridging the gap between raw AI generation and syllabus-aligned education.

3. The Universal Engine: Technical Core
The "Universal Engine" is the set of immutable laws governing how questions are generated, structured, and saved. This ensures 100% stability and prevents AI "strategy drift."

I. The Locked Object Pattern (Mathematical Integrity)

To eliminate AI "hallucinations" and math errors:

Law: The AI must NEVER generate mathematical logic, numbers, or distractors.

Execution: All math is pre-calculated in JavaScript within the sub-modules (foundation.js, standard.js, advanced.js). The AI receives a "Locked" JSON string and is permitted only to replace the [STORY] placeholder with localized context.

II. Standardized JSON Structure

Every question produced by the engine must follow this 4-tier nested structure:

meta: Topic, Level, Type (MCQ/Structured), and Difficulty.

content: questionText, options, finalAnswer, and solutionSteps.

visualEngine: componentToRender (e.g., NUMBER_BOND, GROUPING_WORKSPACE) and componentData.

inputRequirement: inputType (e.g., MCQ_BUTTONS, MATH_INPUT).

III. The Safe Schema Bridge (Data Flattening)

To resolve the conflict between nested AI JSON and flat database schemas:

Law: The route.js controller must apply a Flattening Map before database insertion.

Execution: The engine renames questionText to question and solutionSteps to solution, and merges visual data into a single modelData column, ensuring Prisma compatibility without losing data depth.

### 3.4 Cloud Neutrality & Vendor Lock-In Prevention
To maintain the ability to smoothly migrate from Serverless (Vercel) to a containerized VPS (Docker/Render/DigitalOcean) in the future, strictly enforce the following architectural boundaries:

* **No Proprietary Vercel Services:** Do not implement Vercel KV, Vercel Blob, or Vercel Postgres. Rely exclusively on standard PostgreSQL and S3-compatible APIs for storage to ensure database portability.
* **No Edge Runtime Exclusivity:** Do not write core API routes or database logic that strictly relies on Vercel's Edge runtime. Standardize on the Node.js runtime to ensure your build can be containerized later.
* **Absolute Auth Data Ownership:** Do not use proprietary Managed Auth providers (e.g., Supabase Auth, Clerk, Auth0) that silo user credentials out of our control. Exclusively use **NextAuth.js (Auth.js)** combined with the Prisma Adapter. All user profiles, sessions, and verification tokens MUST live inside our primary PostgreSQL database.

4. Core Philosophy: The Gym Metaphor
Synapse Building (Muscle Memory): Tracking a weighted moving average of mastery; recognizing that a concept is built over time.

Identifying "Bad Form" (Defect Tracking): Diagnosing specific errors (e.g., Careless Calculation, Unit Mismatch) rather than just marking "wrong."

Spotting (AI Scaffolding): Dynamically breaking complex problems into manageable steps based on past failures.

5. Scaling & Localization: The Singapore Flavor
The engine scales complexity according to the Singapore MOE Syllabus and the student's reading ability.

I. The Reading Level Mandate

LOWER_BLOCK (P1-P2): Sentences < 12 words. High-frequency sight words. Max 2 syllables. Tangible items (curry puffs, stickers).

MIDDLE_BLOCK (P3-P4): Compound sentences ("but", "because"). Community contexts (Hawker centers, Libraries).

UPPER_BLOCK (P5-P6): Complex clauses. Abstract/Technical contexts (GST, Interest Rates, PSA Port logistics).

II. Zero-Footprint Personalization

Protocol: Personalization must be "Invisible." The system uses user data to select themes (e.g., sports, food) but is strictly prohibited from using "Bridge Phrases" like "Since you like..." or "Based on your interest...".

6. System Architecture
Frontend: Next.js 15 (React) with MathLive inputs and dynamic SVG Bar Models.

Backend: Next.js API Routes (App Router) using await searchParams and await params.

Database: PostgreSQL + Prisma ORM.

AI Engine: Google Gemini (Generative AI) via strict JSON templates.

7. Hybrid Grading Engine
Tier 1 (Local Grader): Instant deterministic JS feedback for MCQs and Short Answers.

Tier 2 (Stealth AI Diagnostic): Asynchronous background processing by Gemini to assign "Defect Codes" for incorrect answers.

Tier 3 (Full AI Grader): Comprehensive logical analysis for structured working.

8. The Adaptive Workout Algorithm
The trainer curates a 10-question set using the 20/60/20 Rep Structure:

20% Warm-up: High mastery (Synapse > 80) or decaying topics to build momentum.

60% Core Workout: High-focus on the student’s primary bottleneck (Synapse 30-60).

20% Challenge: Introduction of new subtopics or higher difficulty tiers.

9. Question Type Architecture (Structural Logic)
The Engine enforces distinct content rules based on the syllabus "Type Count" to maintain mathematical focus and reading stamina.

I. The 2-Type Protocol (Short & MCQ Only)
Applied when a topic lacks a "Structured" tier.

Short Question: A simplified math equation or a brief descriptive problem. Multiple steps are allowed as difficulty increases.

MCQ: A combination of the short question logic with 4 distinct answer options.

II. The 3-Type Protocol (Short, MCQ, & Structured)
Applied when a topic includes "Structured" complex word problems.

Short Question (Pure Math): Strictly a simplified math equation problem. No backstory is permitted; only a brief mathematical description if necessary.

Structured Question (Word Problem): A complex, descriptive narrative. Requires multiple logical steps and localized context.

MCQ: A hybrid of Short and Structured logic, formatted with 4 distinct answer options.

[ADDENDUM: PHASE 2 STRATEGIC EVOLUTION]
1. Business & Pricing Model
Annual Subscription Anchor: The platform operates on a single-tier, annual subscription of S$29.90.
Trust-Based Retention: To justify the annual commitment, the platform must prioritize "Trust Features" over "Flashy Features."
Automated Lifecycle: Implement a mandatory monthly "AI Progress Report" for all subscribers to demonstrate long-term value.
Refund Policy: All checkout flows must explicitly support a 30-day money-back guarantee to lower the barrier to entry for parents.
2. Marketing & Growth (Product-Led Strategy)
"Free Utility" Funnel: The engine is now tasked with supporting a "Free Math Worksheet Generator" as a core SEO asset.
Design: This utility must be open (no login required) to maximize search indexing.
Conversion: The results page of this utility must act as a seamless bridge to the S$29.90 annual pass, emphasizing the benefit of unlimited, auto-marked, and tracked exercises.
Organic Focus: Prioritize "High-Intent" resource pages (e.g., "P1 Math Place Value Explained") over manual community outreach. All SEO content is to be generated by the AI using the "Parent-Friendly Guide" protocol.
3. Financial Sustainability & Infrastructure
Lean Operational Costs: All development must prioritize low-overhead infrastructure.
Variable Cost Control: As content generation (AI questions) is the primary variable cost, the engine must ensure high-efficiency token usage (e.g., Gemini Flash models).
Usage Awareness: While "super-users" are not currently a risk, the engine should implement reasonable rate-limiting (e.g., worksheets-per-week) to preserve margins for the S$29.90 price point.
Scalability Target: The architecture must be prepared to support a target of ~7,850 active subscribers by ensuring the database/serverless functions remain horizontally scalable.
4. Developer Workflow: Cloud-Native Transition
Stack Alignment: Transition all local development from Synology/Docker to a Vercel + Supabase workflow.
Source of Truth: All database migrations and authentication (NextAuth.js + Prisma) must be managed through the Antigravity agent, ensuring the local development environment perfectly mirrors the cloud production environment.