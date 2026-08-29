# AI Agent Guidelines

## Prompt Generation Rules
- **Constrained AI Story Generation:** To ensure high question variety and avoid template repetitiveness, the LLM is allowed to rewrite the descriptive portions of word problems (indicated by a `STORY:` prefix). 
- **Strict Hallucination Prevention:** When allowing the AI to generate/rewrite a story, you MUST strictly constrain it via a `CRITICAL INSTRUCTION`. Explicitly command the AI to:
  1. Preserve exact mathematical values and operations.
  2. NEVER add extra unrequested questions (e.g., do not add "How many altogether?").
  3. Keep the final question sentence exactly as provided.
- **Dynamic Variable Context:** Continue to inject names and items from `variable-bank.js` into the `STORY:` template to give the AI a grounded starting point, preventing it from lazily reusing the same names.
## Project Structure Rules
- Always place scratch scripts, testing files, and one-off debugging files in the `scripts/` directory to keep the root directory clean and organized.

## Blueprint & Syllabus Rules
- **API Contract Matching:** Difficulty logic files (`foundation.js`, `standard.js`, `advanced.js`) must strictly return an object with the key `aiPrompt` (i.e. `return { aiPrompt: ... }`). The `generation-engine.js` explicitly reads this key, so returning `systemPrompt` or `humanPrompt` will result in undefined prompts.
- **Case-Insensitive Routing:** The API frequently passes difficulty strings with varying cases (e.g. `Foundation`). Router files must always normalize before checking (e.g. `if (difficulty.toLowerCase() === 'foundation')`).
- **Verifying Imports:** Always verify exported variables from utility files (like `localization.js`) before importing them. Never assume a function name exists without checking.
- **Escaping Template Literals:** When writing code that generates code, be extremely careful not to accidentally escape template literals (e.g., using `\\\`` or `\\\$`) when inserting raw code content, as it will break syntax and JS interpolation.
- **Strict JSON Schema Provision:** Never assume the LLM knows the expected output structure. You MUST explicitly provide the `UniversalQuestionSchema` JSON output template (e.g., via `formatInstructions` in the router) and inject it into the `aiPrompt`. Failure to provide the exact schema will cause the LLM to hallucinate nested structures that fail Prisma validation on save.
- **Zod Schema Alignment for `visualEngine`:** When manually providing the JSON template to the LLM for `UniversalQuestionSchema` (e.g., in `getFormatInstructions`), ensure that `visualEngine` is placed at the ROOT of the JSON payload, NOT nested inside `content`. Zod's `.parse()` automatically strips unrecognized nested keys, which will cause `visualEngine` and all `componentData` (like `items`) to be silently discarded if placed inside `content`.
- **Explicit AI Prompting for Schema Fields:** When constructing `aiPrompt` in difficulty logic files, you MUST use explicit `CRITICAL INSTRUCTIONS` to command the LLM. You must strictly force it to use the exact `askText` as `questionText` (to prevent it from hallucinating worded math problems), and the exact `answer` as `finalAnswer`. You must also explicitly command it to generate a `solutionSteps` and `hint`. Do NOT rely on loose phrases like "Question Logic".
- **JSON String Line Breaks:** JSON does not support raw newlines within string values. When defining `solutionSteps` in the schema template, you MUST explicitly instruct the LLM to use the literal escaped newline characters `\\n` (e.g., `separate steps using the exact characters \\n inside the string`) to ensure line breaks are correctly parsed by the Generation Engine instead of being stripped.
- **Passing Format Instruction Arguments:** When calling `getFormatInstructions(visualEngineStr, inputRequirementStr)` inside difficulty logic files, you MUST pass both string arguments rather than calling it empty, otherwise any `MULTI_STEP_INPUT` structure configuration will fail to correctly mount to the schema root.

## Database Optimization Rules
- **Database-Level Processing (Supabase Payload Limits):** Never use massive `findMany` or `queryRaw` (e.g., `json_agg`) queries to pull thousands of rows into Node.js simply to calculate counts, groupings, or to push data back into another table. Always push the heavy computational and data-transfer lifting to PostgreSQL (e.g., use Prisma's `groupBy` for inventory counting, or `INSERT INTO ... SELECT` for internal backups). This prevents huge data payloads from crashing Supabase bandwidth limits and Node.js memory.
