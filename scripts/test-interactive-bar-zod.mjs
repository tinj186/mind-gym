import { UniversalQuestionSchema } from '../src/app/api/admin/generate/questionSchema.js';
import { processAiQuestion } from '../src/lib/intelligence/generation-utils.js';
import { p4NumberComparisonAndOrderingBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering.js';

console.log("Testing UniversalQuestionSchema with INTERACTIVE_BAR_BUILDER...");

const stepResult = p4NumberComparisonAndOrderingBlueprint.generate('standard', 'standard_chain_comparison_three_entities', 'Structured');
console.log("Blueprint generated aiPrompt length:", stepResult.aiPrompt.length);

// Extract the mock JSON template from the aiPrompt
const jsonMatch = stepResult.aiPrompt.match(/OUTPUT FORMAT[^{]*({[\s\S]*})/);
if (!jsonMatch) {
  console.error("Could not find JSON template in prompt");
  process.exit(1);
}

const templateStr = jsonMatch[1];
const mockAiResponse = JSON.parse(templateStr
  .replace('"string (the exact question stem)"', '"Alice has 10,000 stickers. Bob has 3,000 more stickers than Alice. Charlie has 2,000 fewer stickers than Bob. How many stickers do the three of them have altogether?"')
  .replace('"string (the final correct answer)"', '"34000"')
  .replace('"string (step-by-step logic, separate steps using \\\\n)"', '"Step 1: Alice has 10000\\nStep 2: Bob has 13000\\nStep 3: Charlie has 11000"')
  .replace('"string (a helpful conceptual clue)"', '"Add up all amounts."')
);

console.log("Mock AI Response parsed from template successfully.");
console.log("Validating with UniversalQuestionSchema.parse...");

const validated = UniversalQuestionSchema.parse(mockAiResponse);
console.log("UniversalQuestionSchema validated successfully!");
console.log("Validated inputRequirement.inputType:", validated.inputRequirement.inputType);
console.log("Has barBuilderConfig?", !!validated.inputRequirement.barBuilderConfig);

console.log("Processing through processAiQuestion...");
const processed = processAiQuestion(mockAiResponse, {
  level: 'Primary 4',
  topic: 'Whole Numbers - Numbers up to 100 000',
  subtopic: 'Number Comparison and Ordering',
  difficulty: 'Standard',
  type: 'Structured',
  stepResult,
  heuristic: 'standard_chain_comparison_three_entities'
});

console.log("processAiQuestion succeeded!");
console.log("Processed question type:", processed.type);
console.log("Processed modelData.inputRequirement.inputType:", processed.modelData.inputRequirement.inputType);
console.log("Processed modelData.inputRequirement.barBuilderConfig:", !!processed.modelData.inputRequirement.barBuilderConfig);
console.log("All Zod checks PASSED!");
