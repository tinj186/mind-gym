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

Law (Two-Tier Multi-Step Grading Architecture - Fast-Path Primary + Level-Based AI Backup):
While final answers must match deterministically, multi-step structured working allows diverse valid mathematical strategies (e.g. State Tracking vs. Difference Shifting) and step order permutations (e.g., finding Entity B before Entity A).
Execution:
1. **Tier 1 (Fast-Path Primary - 0ms Latency)**: Evaluates student working in `WorkoutSession` and `ArenaSession` synchronously. It verifies both primary `steps` (e.g. State Tracking) and alternative strategy steps (`alternativeSteps` / `barBuilderConfig.comparisonSteps` e.g. Difference Shifting). It incorporates **intermediate step permutation checking** (e.g., swapping Step 0 and Step 1 when finding two independent entity amounts) and applies resilient string sanitization (space removal, comma normalization, operator standardisation like `*`, `×`, `/`, `÷`).
2. **Tier 2 (AI Multi-Step Grader - Backup Fallback)**: If Fast-Path strict and permutation matching fails (due to unexpected combined expressions, alternative intermediate steps, or non-standard unitary representations), the submission is sent to `/api/grade-multi-step`. The AI evaluates the mathematical logic and pedagogical validity using grade-level criteria before incorrectly penalizing the student.

Law (Modular Level-Based AI Grader Library - Anti-Bloat Mandate):
Route handlers (like `/api/grade-multi-step/route.js`) must NOT be bloated with monolithic prompt templates, hardcoded single-grade logic, or repetitive pedagogical rules.
Execution: Prompt construction and pedagogical rubrics must be completely decoupled into `src/lib/grading/multiStepGrader.js`. The prompt builder dynamically injects grade-appropriate guidelines based on the student's level (`Primary 1` through `Primary 6`):
- *Lower Primary (P1–P2)*: Focuses on basic arithmetic, word problem context, text-form numbers ("in words"), and currency notation (`$` or `¢`).
- *Middle Primary (P3–P4)*: Evaluates Singapore Bar Model methods, the unitary method (`1 unit`, `1u`, `?`), state tracking vs. difference shifting, combined expressions, and step-order flexibility.
- *Upper Primary (P5–P6)*: Accepts algebraic equations, unit ratios, percentage deductions, and fraction multipliers.
The route handler in `route.js` remains a lean, single-purpose coordinator under 50 lines.

Law (Interactive Bar Model 3-Stage Workflow & Multi-Archetype Flexibility):
Structured word problems utilizing `INTERACTIVE_BAR_BUILDER` must follow the 3-Stage Lifecycle (Archetype Selection → Blueprint Construction → Equation Working). For complete technical specifications, the Golden Rule of Bar Modeling (Drawing Precedes Solving), multi-archetype flexibility, and blueprint validation laws, see **Section VIII: The Universal Interactive Bar Model Engine (Singapore Math Source of Truth)** below.

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

VIII. The Universal Interactive Bar Model Engine (Singapore Math Source of Truth)

To ensure that interactive bar modeling adheres strictly to Singapore MOE Concrete-Pictorial-Abstract (CPA) pedagogy, eliminates "pre-solving" bugs, and provides adaptive 3-stage scaffolding:

1. The Golden Law of Bar Modeling: Drawing Precedes Solving
- **Pedagogical Mandate**: The bar model is an exploratory cognitive heuristic. A student constructs the model using EXCLUSIVELY the numbers given in the problem stem, representing all unknown quantities and calculation targets with question marks (`?` or blank). The pictorial model is what enables the student to discover and write the arithmetic equations in Stage 3 — students must NEVER be forced to calculate arithmetic answers before they can build or validate their bar model.
- **Blueprint Config Rule**:
  - In `barBuilderConfig.parts`, `barBuilderConfig.entities`, and `barBuilderConfig.target`, any value that requires an arithmetic calculation (+, -, ×, ÷) to discover MUST be initialized with `value: '?'` and `displayValue: '?'`.
  - Calculated values must only be stored in `actualValue` or `actualDiff` (for optional validation if the student chooses to pre-calculate).
  - NEVER inject calculated intermediate numbers (e.g. overlap $16,900$, non-target group only $27,400$, initial difference $23,200$, new flipped difference $12,400$) into `value` or `displayValue`.
- **Validation Rule**:
  - In `checkPartWholeParameters`, `checkComparativeParameters`, and `checkBeforeAfterParameters`, marking unknown parts or difference segments with `'?'` or leaving them blank MUST ALWAYS pass validation without error.
  - The validator must NEVER reject a student's model with "Please enter the value (X)" when X is not in the question stem.

2. Full Archetype Palette Availability: Zero Pruning
- **Student Choice Principle**: Students must be trained to evaluate problem structures and select the correct bar model archetype.
- **Palette Rule**: `barBuilderConfig.modelOptions` must ALWAYS offer the full catalog of three core archetypes:
  1. `COMPARISON` ("Comparison Model — Compare quantities across distinct entities")
  2. `PART_WHOLE` ("Part-Whole Model — Divide a single whole quantity into parts or find a target whole")
  3. `BEFORE_AFTER` ("Before & After Model — Show transfers or changes across time states")
- **Never Prune Options**: Developers must NEVER remove or hide archetypes from `modelOptions` simply because a model is suboptimal or non-standard for that problem.
- **Multi-Match Archetypes**: When a problem can legitimately be solved using multiple archetypes (e.g., Shifting Transfers can be modeled via `BEFORE_AFTER` state tracking OR `COMPARISON` difference shifting), `barBuilderConfig.correctModelType` MUST be provided as an array `["BEFORE_AFTER", "COMPARISON"]`. The student can successfully confirm either archetype.
- **Educational Feedback for Incompatible Archetypes**: If an incompatible archetype is confirmed (e.g., selecting `PART_WHOLE` for a two-entity transfer problem), provide clear pedagogical guidance explaining why another model is better suited, rather than removing the option from the UI.

3. Permissive Multi-Model Blueprint Verification (Stage 2)
The blueprint validator must accept all mathematically valid representations of the problem stem:
- **A. Overlapping Sets (`OVERLAPPING_TARGET_DEDUCTION`)**:
  - *Standard 3-Part Disjoint Model*: Whole = Grand Total ($75,000$). Parts = `Group A Only (?)` + `Both (?)` + `Group B Only (?)`. All three parts are initially unknown (`?`). Validator accepts `'?'` or blank for all three, or accepted pre-computed numbers if supplied.
  - *Direct 2-Part Model*: Total = Known Group + Target Only (e.g., $\text{Total } (75,000) = \text{Chemistry Lab } (44,300) + \text{Astronomy Booth Only } (?)$). This directly maps the stem numbers to a 2-part whole. Validator explicitly accepts this 2-part model.
- **B. Shifting & Equalizing Transfers (`SHIFTING_DIFFERENCE_TRANSFER` & `EQUALIZING_TRANSFER`)**:
  - *Before State*: Must accept direct solid bars representing initial amounts from the stem (e.g., Kumar = $48,700$, Danial = $25,500$) without requiring a difference segment. If a difference segment is added, it must accept `'?'` as the unknown initial difference.
  - *After State (Action Transfer Model)*: Receiver shows initial base plus transfer segment ($25,500 + 18,000$), Giver shows ending bar ($30,700$ or `?`), and the new gap is `?` (target: New Difference).
  - *After State (Compound Transfer Model)*: Receiver shows initial base + transfer ($+z$), Giver shows shortage bracket (`- FEWER`).
  - *After State (Resulting Comparison Model)*: Base aligned to Giver's end amount, difference segment labeled `?` or new difference.
  - *Comparison Canvas (Single Time State)*: Accepts direct initial stem amounts (Giver: $48,700$, Receiver: $25,500$, difference: `?`), or Final State comparison.

4. Smart Diagnostic Misconception Feedback
Rather than throwing cryptic mismatch errors (e.g., "The difference amount should be 23,200, but got 18000"), the validator provides targeted pedagogical diagnostics:
- *Transfer Used as Difference*: If the student enters the transfer amount ($18,000$) as the difference on a Comparison canvas, diagnose:
  `"+18,000" is the amount transferred from Kumar to Danial, not the difference between them. In a Comparison Model, compare their quantities directly (initial difference is unknown "?"). Or switch to the "Before & After Model" to show the transfer across time!` (Defect: `TRANSFER_USED_AS_DIFFERENCE`).
- *Final Difference on Initial State*: If the student enters the ending difference on starting bars, diagnose `FINAL_DIFF_ON_INITIAL_MODEL`.
- *Inverted Relation / Wrong Winner*: If difference is placed on the wrong entity, diagnose `AFTER_STATE_WRONG_WINNER` or `INVERTED_RELATION_MORE`.

5. Reference Blueprint Rendering Integrity (`ModelSolutionBarModel`)
When a student triggers "View Model Solution" (or during review after an error):
- **Active Canvas Parity**: The rendered reference blueprint MUST match the student's selected `activeModel`. If the student is on the Comparison canvas, render the reference Comparison model. If on Before & After, render Before & After.
- **Stem-Only Data Grounding**:
  - Every number displayed on the reference blueprint MUST originate directly from the question stem.
  - All calculated targets and intermediate quantities MUST display `?`.
  - *Overlapping Sets Reference*: Shows Whole bracket ($75,000$), Group A span bracket ($47,600$), Group B span bracket ($44,300$), and `?` inside all three partitioned bar segments.
  - *Before & After Reference*: Shows solid bars in Before State ($48,700$ and $25,500$ with Initial Difference = `?`), transfer action in After State ($25,500 + 18,000$ with New Difference = `?`).

6. Downstream Calculation Adaptation (Stage 3)
- Multi-step equation working prompts (`steps` vs `comparisonSteps` / `alternativeSteps`) in Stage 3 adapt dynamically to the model archetype selected in Stage 1:
  - If `BEFORE_AFTER`: Prompts state-tracking steps (Find A's end amount $\to$ Find B's end amount $\to$ Subtract to find difference).
  - If `COMPARISON`: Prompts difference-shifting steps (Find initial difference $\to$ Find $2 \times$ transfer shift $\to$ Subtract initial difference to find new difference).
- Evaluated by Tier 1 Fast-Path with intermediate step permutation tolerance and Tier 2 AI Multi-Step Grader fallback.

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
Tier 1 (Local Deterministic Grader & Fast-Path): Instant 0ms JS evaluation in `WorkoutSession` and `ArenaSession`. Handles MCQs, Short Answers, and Multi-Step working (evaluating primary equations, alternative archetype equations, and intermediate step permutations with resilient string sanitization).

Tier 2 (Stealth AI Diagnostic): Asynchronous background processing by Gemini to assign "Defect Codes" for incorrect MCQ and Short answers, driving granular synapse strength tracking.

Tier 3 (AI Multi-Step Grader Fallback): Modular, grade-level-aware LLM evaluation (`/api/grade-multi-step` powered by `src/lib/grading/multiStepGrader.js`) that triggers as a backup ONLY when Tier 1 Fast-Path fails. It evaluates alternative mathematical methods, unitary notation (`1u`), combined equations, and pedagogical correctness tailored across Primary 1 through Primary 6.

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
- `src/lib/grading/multiStepGrader.js`: The modular grade-level AI grading prompt builder for multi-step structured working.
- `src/components/math/InteractiveBarBuilder.jsx`: The 3-stage interactive bar model builder component supporting multi-archetype verification, compound transfers, and dynamic equation scaffolding.
- `src/app/api/grade-multi-step/route.js`: The lean multi-step AI grader API endpoint.

7. Agent Index Trigger Command
!INDEX_TRIGGER: ALL AI AGENTS joining this conversation MUST read `prisma/schema.prisma` and `src/lib/payments/gateway.js` to understand the database architecture and payment decoupling before proposing any backend or subscription changes.
