import { foundationLogic } from './area-perimeter-concepts/foundation';
import { standardLogic } from './area-perimeter-concepts/standard';
import { advancedLogic } from './area-perimeter-concepts/advanced';

export const p3AreaPerimeterConceptsBlueprint = {
  id: 'area-perimeter-concepts',
  blueprint: 'Pending implementation.',
  variants: {
    'foundation_pure_area': 'Pure Area of a Rectilinear Figure',
    'foundation_pure_perimeter': 'Pure Perimeter of a Rectilinear Figure',
    'foundation_comparing_area': 'Comparing Area (Figure A vs. Figure B)',
    'foundation_comparing_perimeter': 'Comparing Perimeter (Figure A vs. Figure B)',
    'foundation_area_and_perimeter': 'Area and Perimeter of the Same Figure',

    'standard_irregular_area': 'Area of an Irregular Composite Shape',
    'standard_irregular_perimeter': 'Perimeter of an Irregular Composite Shape',
    'standard_same_area_diff_perimeter': 'Same Area, Different Perimeter',
    'standard_missing_edge_deduction': 'Missing Edge Deduction',
    'standard_area_half_squares': 'Area Deduction via Counting Half-Squares',

    'advanced_corner_bite': 'The Corner "Bite" Paradox',
    'advanced_joining_shapes': 'Joining Two Shapes (Perimeter Deduction)',
    'advanced_border_problem': 'The Border / Path Problem',
    'advanced_cost_multiplier': 'Cost/Multiplier Scaling',
    'advanced_max_min_perimeter': 'Maximum/Minimum Perimeter for a Given Area'
  },
  generate: function (difficulty, activeVariant, type) {
    const safeType = String(type).toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question';
    const isStructure = safeType === 'structured';

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 3';
    const topic = 'Area & Perimeter';
    const subtopic = 'Concepts';

    const getFormatInstructions = (visualEngineStr, inputRequirementStr) => {
      const inputReq = inputRequirementStr || JSON.stringify({ inputType: isMCQ ? "MCQ_BUTTONS" : "STANDARD_TEXT" });
      const optionsStr = isMCQ ? `["string", "string", "string", "string"]` : `[]`;
      const defectMapStr = isMCQ ? `{ "distractor1": "Error category", "distractor2": "Error category" }` : `{}`;

      return `CRITICAL INSTRUCTION: You MUST use the EXACT "visualEngine" and "inputRequirement" JSON objects provided in the template below. DO NOT hallucinate, change, or rewrite the structure, labels, expected answers, or accepted answers inside "inputRequirement".
OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "type": "${zodType}",
    "difficulty": "${zodDiff}"
  },
  "content": {
    "questionText": "string",
    "options": ${optionsStr},
    "defectMap": ${defectMapStr},
    "hint": "string",
    "finalAnswer": "string",
    "solutionSteps": "string (separate steps using the exact characters \\\\n inside the string)"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq}
}`;
    };

    if (difficulty.toLowerCase() === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    } else if (difficulty.toLowerCase() === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    } else if (difficulty.toLowerCase() === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }
  }
};
