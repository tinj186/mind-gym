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

Law: The AI must NEVER generate mathematical logic, numbers, or distractors dynamically.

Execution: All math is pre-calculated deterministically in JavaScript within the sub-modules (foundation.js, standard.js, advanced.js). The AI receives a "Locked" JSON blueprint and is permitted only to replace the [STORY] placeholder with localized context, adhering strictly to the schema structure, including passing the explicitly defined `defectMap` for distractors.

II. Standardized JSON Structure

Every question produced by the engine must follow this 4-tier nested structure:

meta: Topic, Level, Type (MCQ/Structured), and Difficulty.

content: questionText, options, finalAnswer, solutionSteps, hint, and defectMap (strictly mapping MCQ distractors to defect codes like "CARELESS_CALCULATION" or "CONCEPTUAL_ERROR").

visualEngine: componentToRender (e.g., NUMBER_BOND, GROUPING_WORKSPACE, SINGAPORE_MONEY, NONE) and componentData.

inputRequirement: inputType (e.g., MCQ_BUTTONS, MATH_INPUT, STANDARD_TEXT).

III. The Safe Schema Bridge (Data Flattening)

To resolve the conflict between nested AI JSON and flat database schemas:

Law: The route.js controller must apply a Flattening Map before database insertion.

Execution: The engine renames questionText to question and solutionSteps to solution, and merges visual data into a single modelData column, ensuring Prisma compatibility without losing data depth.

IV. The Equal Spread Protocol (Stateful LRU)

To prevent variant "clumping" and ensure students are exposed to all mathematical variations evenly:

Law: The engine must NOT rely on stateless pure randomness (\`Math.random()\`) for variant selection.

Execution: The engine must utilize a Stateful Least-Recently-Used (LRU) system. It tracks generation counts for each variant within the `SystemConfig` Postgres table and purposefully selects the variant with the absolute lowest generation count. This guarantees an equal spread of exposure over time.

V. AI Guardrails & Hallucination Prevention

To ensure absolute UI stability and strict pedagogical grading, the generation engine enforces these hard guardrails:

Law (Hallucinated Options Stripping): The AI must NEVER be allowed to accidentally transform a Short or Structured question into an MCQ question by hallucinating options.
Execution: The Universal AI Parser (`generation-utils.js`) explicitly checks the locked `meta.type`. If the requested type is NOT an MCQ, the parser aggressively deletes any AI-generated `options` array before saving to the database. This guarantees the frontend renders standard text/multi-step inputs instead of MCQ buttons.

Law (Negative Prompt Exclusion): Negative instructions must NOT be included in AI system prompts (e.g. "Do not write 'Start with'").
Execution: Generative models frequently misinterpret negative string examples as positive instructions and hallucinate them into the JSON output (e.g. injecting them into `solutionSteps`). System prompts must explicitly command what the AI *should* do, omitting string examples of what it should avoid.

Law (Language Layer Override Prevention): The general AI engine applies age-appropriate language constraints (e.g., "maximum 10-12 words") based on the student's level. However, explicit text templates hardcoded into syllabus blueprints (e.g., `questionTextTemplate`) strictly override these general rules.
Execution: Developers MUST NOT hardcode complex vocabulary (e.g., "cumulative", "track frame map", "composite vector") into static syllabus templates for lower levels (P1/P2). The AI is instructed to output these templates EXACTLY, which will bypass the general engine's simplification rules and cause age-inappropriate wording to be rendered to the user.


Law (Variant Fallback Constraints): Variants that conceptually violate a requested question type must securely fallback or override.
Execution: During generation, the engine filters variants. If a variant conceptually violates the requested type (e.g., trying to render a "Strict Word Problem" as a "Short Question" equation), the generator securely falls back to a valid variant. Conversely, variants that strictly rely on multiple-choice mechanics (e.g., Equation Equivalence) will explicitly override the user's type request to `MCQ`.

Law (Multi-Step Associative Flexibility): While final answers must match deterministically, multi-step associative working (e.g., 3+2=5 vs 2+3=5) must be handled flexibly.
Execution: The client-side `WorkoutSession` executes a strict string-matching "fast path". If strict matching fails for a multi-step input, it securely delegates the check to a deterministic, zero-temperature AI Grader API (`/api/grade-multi-step`) to mathematically evaluate logical equivalence before incorrectly failing the student.

Law (Template Preservation Strictness): When dynamic context or randomized attributes (e.g. random objects like "eraser" or math numbers) are generated deterministically in code, the AI must NEVER be allowed to "autocorrect" or rewrite the template string.
Execution: To prevent the LLM from taking creative liberty and replacing randomized values with what it perceives to be "better" standard examples, the format instructions MUST explicitly prepend the following directive to the prompt: `CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!`

VI. MathLive & Universal Grading Protocols

To ensure resilient mathematical input and strictly deterministic grading across all components (`WorkoutSession`, `ArenaSession`, `MathInput`):

Law (MathLive Upright Rendering): The MathLive engine must be forced to render words normally instead of in math-italics (`smartMode = true`, `letterShapeStyle = "upright"`). This prevents basic English words from looking like algebra variables when the student is typing multi-step textual responses.

Law (Physical Keyboard Whitelisting): Physical keyboard inputs within `MathInput` must explicitly whitelist basic math operators (+, /, <, >, =, $, -, *, commas, periods) while aggressively blocking unhandled symbols. This prevents the student from triggering formatting bugs while allowing flexible data entry.

Law (Ultra-Resilient String Sanitization): Before grading any user input string against a database answer, the engine must sanitize the strings using a two-step Universal String Sanitizer. 
1. MathLive Formatting Stripping: MathLive's `smartMode` secretly wraps English words in `\text{...}` blocks. These must be explicitly stripped via regex (`.replace(/\\text\{([^\}]+)\}/g, '$1')`).
2. Absolute Space Eradication: To prevent students from being penalized for double-spacing or invisible formatting gaps, the grader must entirely delete all spaces from BOTH the student's answer and the database target answer (`.replace(/\s+/g, '')`) before executing the final equivalence check.

VII. Adaptive Engine Session Integrity

Law (Strict Isolation Enforcement): When an Isolation Workout (Subtopic Focus) is triggered, the engine must prioritize the requested subtopic over any historically locked Daily Workout session. If the database `activeWorkout` lock does not strictly match the requested subtopic, the lock must be instantly discarded. Furthermore, Isolation Workouts MUST save their own 10-question lock to the database to preserve student progress.

Law (Isolation Randomization): Isolation Workouts must NOT pull the top 10 static questions. They must execute a `.count()` on the subtopic and utilize a `randomSkip` offset to pull a dynamically randomized slice from the entire database pool for that subtopic, ensuring zero repetition for the student.

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

III. The Strict Localization Mandate (Anti-Hallucination)

Protocol: When requesting a \`[STORY]\` context from the AI, the prompt MUST explicitly constrain the name generation (e.g., "Use a local name like Siti, Muthu, Ali instead of generic names like Sam"). If left unconstrained or if a local name is not explicitly passed as a variable, the AI generative models will default to generic English/Western names, violating the "Singapore Flavor" localization goal.

IV. Centralized Variable Banks (Decoupled Localization)

Protocol: To ensure consistency across all current and future syllabuses (Primary 1 through Primary 6), all culturally specific variables, names, items, and thematic concepts MUST be decoupled from the individual AI generation prompts.
Execution: All variable banks (e.g., \`localNames\`, \`singaporeItems\`, \`schoolContexts\`) are centrally stored and managed within \`src/lib/utils/variable-bank.js\`. The generation engine dynamically imports and selects these variables, injecting them into the locked blueprints *before* sending the prompt to the AI. This prevents duplication of logic and ensures a single, immutable source of truth for the platform's localization identity.

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

9. The Assessment & Exhaustion Pipeline
The engine enforces strict progression and provides total visibility into content consumption to prevent repetition and pinpoint mechanical bottlenecks.

I. True Randomness & Zero Repeats (The No-Repeat Protocol)
Mock Exams and timed assessments must NEVER present a student with a question they have previously seen. 
Protocol: The `MockExam` generation engine must execute a strict sub-query against the `AttemptLog` to explicitly strip out any `questionId` the student has historically touched before randomizing the remaining vault.

II. Admin Exhaustion Drill-down
The system calculates real-time "Exhaustion Metrics" by dividing a student's unique attempts by the total vault size. 
Protocol: To maintain performance, high-level exhaustion is tracked at the `primaryLevel` on the Admin Roster. Detailed Subtopic Exhaustion Drill-downs (identifying specific topics >95% consumed) must run on a dedicated, on-demand API route (`/api/admin/users/exhaustion`) to prevent massive database joins on page load.

III. Parent Assessment Audit
The Parent Hub bridges the gap between AI diagnostic strength and actual exam execution. It tracks `conceptualMastery` (Synapse Strength) vs `accuracy` (Timed Exam Performance). If a student has high mastery but poor exam accuracy, the system triggers an "Execution Risk" warning, shifting the focus from concept teaching to speed and error reduction.

10. Question Type Architecture (Structural Logic)
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

III. The Notation Variant Exception
Protocol: Not all "Structured" questions are word problems. The system identifies pure mathematical logic tasks (e.g., "34 = 30 + ____") via an `isNotationVariant` flag.
Execution: If a variant is flagged as `isNotationVariant`, the system explicitly overrides the standard "Structured" instruction (which normally forces a localized word problem) and defaults to a direct mathematical equation. This prevents strict variants from contradicting the overarching format rules, which would otherwise cause the AI to hallucinate word problems into pure notation exercises.

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
5. Modern Security & Route Protection
Zero-Trust Architecture: All API routes must assume requests are malicious unless verified by NextAuth.js session tokens.
Database Integrity: Never use raw SQL queries or string concatenation. All database interactions MUST go through the Prisma ORM to prevent SQL injection.
Edge Middleware Lock: The file `src/proxy.js` acts as the absolute gatekeeper. It explicitly protects `/hub`, `/math`, `/parent`, and `/admin`. No private application logic should ever be exposed outside these guarded paths.
Execution Environment: The backend Node.js environment must never use `exec()`, `eval()`, or `child_process`. All grading logic must be deterministic and sandboxed.

6. File Map (Current Source of Truth)
To ensure AI agents understand the modern Vercel/Supabase Phase 2 Architecture, adhere to this mapping:
- `prisma/schema.prisma`: The absolute Source of Truth for all database models (User, StudentProfile, QuestionBank, AttemptLog).
- `src/proxy.js`: The NextAuth Middleware that locks down the app.
- `src/app/page.js`: The Public SEO Magnet (Free Worksheet Generator).
- `src/lib/payments/gateway.js`: The core of the Payment-Agnostic architecture.
- `src/lib/payments/adapters/HitPayAdapter.js`: The active Singapore payment gateway.
- `src/app/api/webhooks/payment/route.js`: The secure listener that validates HMAC signatures and updates `subscriptionStatus` to ACTIVE.

7. Agent Index Trigger Command
!INDEX_TRIGGER: ALL AI AGENTS joining this conversation MUST read `prisma/schema.prisma` and `src/lib/payments/gateway.js` to understand the database architecture and payment decoupling before proposing any backend or subscription changes.
