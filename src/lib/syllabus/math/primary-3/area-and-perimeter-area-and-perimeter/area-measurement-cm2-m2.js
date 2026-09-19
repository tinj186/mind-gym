import { foundationLogic } from './area-measurement-cm2-m2/foundation.js';
import { standardLogic } from './area-measurement-cm2-m2/standard.js';
import { advancedLogic } from './area-measurement-cm2-m2/advanced.js';

export const p3AreaMeasurementCm2M2Blueprint = {
  id: 'area-measurement-cm2-m2',
  blueprint: 'Measuring Area in Square Units (cm² and m²)',
  variants: {
    //    'foundation_counting_grid': 'Counting Whole Units on a Grid (cm² or m²)',
    //    'foundation_irregular_part_addition': 'Area of an Irregular Shape by Part Addition',
    'foundation_add_sub_given_areas': 'Adding/Subtracting Two Given Areas (a±b=c)',
    //    'foundation_compare_given_areas': 'Comparing Two Given Areas (a-b=c)',
    //    'foundation_shortfall_target_area': 'The Shortfall (Building a Target Area)',

    'standard_area_half_squares': 'Area with Half-Squares (Single Shape)',
    'standard_subtracting_cut_out': 'Word Problem - Subtracting Area (The Cut-Out)',
    'standard_grouping_identical_areas': 'Grouping Identical Areas (Repeated Addition/Multiplication)',
    'standard_grouping_with_remainder': 'Grouping Identical Areas + A Remainder',
    'standard_donut_hollow_center': 'Area on a Grid with a Hollow Center (The "Donut")',

    'advanced_3_part_comparison': '3-Part Area Comparison (A->B->C)',
    'advanced_mixed_halves_cutouts': 'Grid Area with Mixed Halves and Cutouts',
    'advanced_area_conservation': 'Area Conservation (Rearranging Pieces)',
    'advanced_tiling_area_division': 'Tiling with Larger Units (Area Division)',
    'advanced_two_part_unit_cost': 'Two-Part Area with Unit Cost (a+b->xCost)'
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
    const subtopic = 'Area Measurement cm2 and m2';

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
