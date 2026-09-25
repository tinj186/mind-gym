import { foundationLogic } from './perimeter-calculation/foundation.js';
import { standardLogic } from './perimeter-calculation/standard.js';
import { advancedLogic } from './perimeter-calculation/advanced.js';

export const p3PerimeterCalculationBlueprint = {
  id: 'perimeter-calculation',
  blueprint: 'Calculating Perimeter of Polygons and Composite Shapes',
  variants: {
    'foundation_perimeter_square': 'Perimeter of a Square (4×S=P)',
    'foundation_perimeter_rectangle': 'Perimeter of a Rectangle (L+W+L+W=P)',
    'foundation_simple_rectilinear': 'Perimeter of a Simple Rectilinear Figure',
    'foundation_compare_perimeters': 'Comparing Two Perimeters',
    'foundation_perimeter_cost': 'Perimeter Cost/Multiplier',

    'standard_rectilinear_missing_sides': 'Rectilinear Figure (Deducing Missing Parallel Sides)',
    'standard_same_wire_different_shape': 'Same Wire, Different Shape (Conservation of Perimeter)',
    'standard_joining_identical_shapes': 'Joining Identical Shapes End-to-End',
    'standard_constant_difference': 'Constant Difference in Dimensions (L+x,W+y)',
    'standard_repeated_shapes': 'Repeated Shapes Total Perimeter',

    'advanced_staircase_shortcut': 'The "Staircase" Rectilinear Perimeter Shortcut',
    'advanced_subtracted_perimeter': 'Complex Overlap / Subtracted Perimeter',
    'advanced_composing_large_shape': 'Composing a Large Shape from Smaller Units',
    'advanced_symmetrical_cross': 'Symmetrical Cross/Plus Shape Perimeter',
    'advanced_frame_path_deduction': 'Frame / Path Perimeter Deduction'
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
    const subtopic = 'Perimeter Calculation';

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
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq},
  "content": {
    "questionText": "string",
    "hint": "string",
    "solutionSteps": "string",
    "options": ${optionsStr},
    "defectMap": ${defectMapStr},
    "finalAnswer": "string"
  }
}`;
    };

    const diff = String(difficulty).toLowerCase();
    if (diff === 'foundation') {
      return foundationLogic(activeVariant, isMCQ, isShort, isStructure, topic, zodType, zodDiff, getFormatInstructions);
    } else if (diff === 'standard') {
      return standardLogic(activeVariant, isMCQ, isShort, isStructure, topic, zodType, zodDiff, getFormatInstructions);
    } else if (diff === 'advanced') {
      return advancedLogic(activeVariant, isMCQ, isShort, isStructure, topic, zodType, zodDiff, getFormatInstructions);
    }

    throw new Error(`Unsupported difficulty: ${difficulty}`);
  }
};
