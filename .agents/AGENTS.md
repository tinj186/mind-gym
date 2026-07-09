# AI Agent Guidelines

## Prompt Generation Rules
- Always use dynamic JS interpolation (e.g., \`${getRandomNames(1)}\`) to inject names and items from variable-bank.js directly into the LLM prompt. Do NOT write static prompt instructions that ask the LLM to "pick a random name from a list," as the LLM will lazily reuse the same names.

## Project Structure Rules
- Always place scratch scripts, testing files, and one-off debugging files in the `scripts/` directory to keep the root directory clean and organized.

## Blueprint & Syllabus Rules
- **API Contract Matching:** Difficulty logic files (`foundation.js`, `standard.js`, `advanced.js`) must strictly return an object with the key `aiPrompt` (i.e. `return { aiPrompt: ... }`). The `generation-engine.js` explicitly reads this key, so returning `systemPrompt` or `humanPrompt` will result in undefined prompts.
- **Case-Insensitive Routing:** The API frequently passes difficulty strings with varying cases (e.g. `Foundation`). Router files must always normalize before checking (e.g. `if (difficulty.toLowerCase() === 'foundation')`).
- **Verifying Imports:** Always verify exported variables from utility files (like `localization.js`) before importing them. Never assume a function name exists without checking.
- **Escaping Template Literals:** When writing code that generates code, be extremely careful not to accidentally escape template literals (e.g., using `\\\`` or `\\\$`) when inserting raw code content, as it will break syntax and JS interpolation.
- **Strict JSON Schema Provision:** Never assume the LLM knows the expected output structure. You MUST explicitly provide the `UniversalQuestionSchema` JSON output template (e.g., via `formatInstructions` in the router) and inject it into the `aiPrompt`. Failure to provide the exact schema will cause the LLM to hallucinate nested structures that fail Prisma validation on save.
