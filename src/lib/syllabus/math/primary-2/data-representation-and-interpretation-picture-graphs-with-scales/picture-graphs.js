import { foundationLogic } from './picture-graphs/foundation';
import { standardLogic } from './picture-graphs/standard';
import { advancedLogic } from './picture-graphs/advanced';

export const pictureGraphsBlueprint = {
  title: 'Picture-Graphs with Scales', // Must match subtopic exactly if dynamic
  variants: {
    'foundation_read_single_category': 'Calculate the exact number of items for a single specific category using the scale, OR given a quantity, calculate how many icons should be drawn on the graph (e.g., The key says 1 star = 3 stickers. How many stickers does Alice have? OR If there are 15 cars, how many symbols should be drawn?).',
    'foundation_identify_max_min_value': 'Visually identify the category with the most (or least) items, and then calculate its exact numerical value using the scale.',
    'foundation_scale_concept_check': 'A purely conceptual question to test the key itself in both directions (e.g., "If 1 smiley face stands for 5 children, how many children do 4 smiley faces stand for?" OR "how many smiley faces stand for 20 children?").',
    'foundation_basic_sum_two_categories': 'Calculate the total number of items in two explicitly named categories, OR given the total of two categories, calculate the missing icons for one of them.',
    'foundation_symbol_counting_trap': 'A trap question to test reading comprehension: asks for the number of *pictures drawn* rather than the actual scaled value (e.g., "How many star symbols are drawn in the row for Monday?").',

    // STANDARD VARIANTS
    'standard_difference_between_categories': 'Calculate how many more or how many fewer items are in Category A compared to Category B (requires scaling both categories before subtracting, or subtracting the symbols first then scaling).',
    'standard_find_category_by_value': 'Reverse lookup: The engine provides a specific numerical value (e.g., "Which day sold exactly 20 apples?"), and the student must use the scale backward to identify the correct category.',
    'standard_total_all_categories': 'Calculate the grand total of items across all categories in the entire picture graph.',
    'standard_combined_comparison': 'Solve a 2-step comparison involving three categories (e.g., "How many more books did Class A and B read *combined* compared to Class C?").',
    'standard_predictive_drawing': 'Determine how many symbols need to be drawn if new data is introduced (e.g., "Tom caught 15 more fish. If 1 picture = 5 fish, how many more pictures must be drawn on his row?").',

    // ADVANCED VARIANTS
    'advanced_missing_category_symbols': 'The grand total of all categories is provided in the text, but one category row is completely blank on the graph. The student must calculate how many symbols belong in the blank row.',
    'advanced_change_of_scale': 'The student is shown a graph where 1 symbol = 2 items. They must determine how many symbols would be needed for a specific category if a *new* graph was drawn where 1 symbol = 4 items.',
    'advanced_scale_translation_money': 'Layering a secondary unit: The graph shows items, but the question asks for cost/value (e.g., 1 icon = 3 cupcakes. Each cupcake costs $2. How much money did Sarah make?).',
    'advanced_half_symbol_interpretation': 'Introduce a "half-symbol" into one of the categories. The student must deduce its value based on the scale (e.g., if 1 full circle = 10 units, a half circle = 5 units) and calculate the row total.',
    'advanced_deduction_riddle': 'Identify a specific category based on a multi-step relational word puzzle (e.g., "I collected 8 more stamps than Alice, but 4 fewer than Bob. Which category am I?").'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Data Representation and Interpretation';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const subtopic = 'Picture-Graphs with Scales';

    // Zod formatting strings
    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    // Helper to switch text based on type
    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };

    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`, inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "type": "${zodType}",
    "difficulty": "${zodDiff}"
  },
  "content": {
    "questionText": ["string (Line 1)", "string (Line 2)"] (Array of strings for the full question text. Break into multiple lines if needed.),
    "options": ["string", "string", "string", "string"] (ONLY if MCQ, otherwise empty array),
    "defectMap": { "distractor1": "Error category", "distractor2": "Error category" } (ONLY if MCQ, otherwise empty object),
    "hint": "string (Pedagogical hint)",
    "solutionSteps": ["string (Step 1)", "string (Step 2)"] (Array of strings for the step-by-step model solution. Break down the logic into distinct steps. separate steps using the exact characters \\\\n inside the string),
    "finalAnswer": "string (The exact final answer)"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputRequirementStr || `{"inputType": "TEXT_INPUT"}`}
}`;

    // Dummy context (will be replaced by Universal Engine localization)
    const context = { name: "Ahmad", setting: "the library" };
    const selectedContextItem = "books";

    const diffLower = difficulty.toLowerCase();

    if (diffLower === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (diffLower === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (diffLower === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    throw new Error(`Unknown difficulty ${difficulty}`);
  }
};
