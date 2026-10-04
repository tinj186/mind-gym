import { foundationLogic } from './angle-comparison/foundation.js';
import { standardLogic } from './angle-comparison/standard.js';
import { advancedLogic } from './angle-comparison/advanced.js';

export const p3AngleComparisonBlueprint = {
  id: 'angle-comparison',
  blueprint: 'Angle Comparison & Identification',
  variants: {
    'foundation_classifying_polygon': 'Classifying and Grouping Angles inside a Polygon',
    'foundation_clock_hands': 'Clock Hands (Specific Hours Classification)',
    'foundation_capital_letters': 'Capital Letters Angle Analysis',
    'foundation_comparing_categories': 'Comparing Angle Categories (Internal Difference)',
    'foundation_rectangular_subdivisions': 'Real-World Rectangular Sub-Divisions',

    'standard_deducing_quantities': 'Deducing Shape Quantities via Right Angles (Guess & Check)',
    'standard_composite_shapes': 'Composite Shapes (Internal vs External Right Angles)',
    'standard_grid_path_corners': 'Rectilinear Grid Path Corners',
    'standard_deductive_totals': 'Deductive Angle Totals (Shape Multiples)',
    'standard_clock_turns': 'Clock Turns (Right Angles to Time)',

    'advanced_corner_cut': 'The Corner Cut & Fold (Spatial Transformation)',
    'advanced_angle_profile_verification': 'Angle Profile Verification (True/False)',
    'advanced_overlapping_shapes': 'Overlapping Shapes (Boundary Deduction)',
    'advanced_tangram_reassembly': 'Tangram Reassembly (Original vs. New Boundary)',
    'advanced_mirror_reflection': 'Mirror Reflection (The Disappearing Right Angles)'
  },
  generate: function (difficulty, activeVariant, type) {
    const safeType = String(type).toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question';
    const isStructure = safeType === 'structured';

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 3';
    const topic = 'Geometry';
    const subtopic = 'Angle Comparison';

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
    "zodType": "${zodType}",
    "zodDiff": "${zodDiff}"
  },
  "content": {
    "questionText": "string",
    "finalAnswer": "string",
    "solutionSteps": "string",
    "hint": "string",
    ${isMCQ ? `"options": ${optionsStr},` : ""}
    "defectMap": ${defectMapStr}
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq}
}`;
    };

    let result;
    if (difficulty.toLowerCase() === 'foundation') {
      result = foundationLogic(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic);
    } else if (difficulty.toLowerCase() === 'standard') {
      result = standardLogic(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic);
    } else if (difficulty.toLowerCase() === 'advanced') {
      result = advancedLogic(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic);
    }

    if (!result) {
      throw new Error(`Logic not implemented for difficulty: ${difficulty}, variant: ${activeVariant}`);
    }

    const { visualEngineStr, inputRequirementStr, systemPrompt } = result;
    const aiPrompt = systemPrompt + "\\n\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);

    return {
      aiPrompt
    };
  }
};
