import { foundationLogic } from './area-calculation-rectangle-square/foundation.js';
import { standardLogic } from './area-calculation-rectangle-square/standard.js';
import { advancedLogic } from './area-calculation-rectangle-square/advanced.js';

export const p3AreaCalculationRectangleSquareBlueprint = {
  id: 'area-calculation-rectangle-square',
  blueprint: 'Area of Rectangles, Squares, and Composite Shapes',
  variants: {
    'foundation_area_rectangle': 'Area of a Rectangle (L×W=A)',
    'foundation_area_square': 'Area of a Square (S×S=A)',
    'foundation_comparing_areas': 'Comparing Areas (Area A - Area B = Difference)',
    'foundation_total_area_identical': 'Total Area of Identical Items (Count × Area)',
    'foundation_area_cost_multiplier': 'Area and Cost Multiplier',

    'standard_area_to_perimeter': 'Area to Perimeter Conversion',
    'standard_proportional_shapes': 'Proportional Areas and Perimeters',
    'standard_subtracting_cutout': 'Subtracting a Cutout (Hole)',
    'standard_tiling': 'Painting/Tiling (Total Area ÷ Unit Area)',
    'standard_joined_identical_squares': 'Area of Joined Identical Squares',

    'advanced_composite_all_sides': 'Area of Composite Shape (All Sides Given)',
    'advanced_composite_missing_sides': 'Area of Composite Shape (Deducing Missing Sides)',
    'advanced_uniform_border': 'The Uniform Border (Deducing Outer Dimensions)',
    'advanced_overlapping_rectangles': 'Overlapping Rectangles',
    'advanced_shared_side_deduction': 'Shared Side Deduction (Joined Rectangles)'
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
    const subtopic = 'Area Calculation';

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
    "blueprint": "${this.blueprint}",
    "variant": "${activeVariant}",
    "type": "${zodType}",
    "difficulty": "${zodDiff}"
  },
  "content": {
    "questionText": "string",
    "solutionSteps": "string",
    "finalAnswer": "string",
    "hint": "string",
    "options": ${optionsStr}
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq},
  "defectMap": ${defectMapStr}
}`;
    };

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const unit = getRandomInt(0, 1) === 0 ? 'm' : 'cm';

    let logicResult;
    const commonArgs = { isShort, isMCQ, isStructure, getRandomInt, unit, zodType, zodDiff, topic };

    if (difficulty.toLowerCase() === 'foundation') {
      logicResult = foundationLogic(activeVariant, commonArgs);
    } else if (difficulty.toLowerCase() === 'standard') {
      logicResult = standardLogic(activeVariant, commonArgs);
    } else if (difficulty.toLowerCase() === 'advanced') {
      logicResult = advancedLogic(activeVariant, commonArgs);
    }

    if (!logicResult) {
      throw new Error(`Variant logic not found for ${activeVariant}`);
    }

    const formatInstructions = getFormatInstructions(logicResult.visualEngineStr, logicResult.inputRequirementStr);
    const aiPrompt = `${logicResult.systemPrompt}\n\n${formatInstructions}`;

    return { aiPrompt };
  }
};
