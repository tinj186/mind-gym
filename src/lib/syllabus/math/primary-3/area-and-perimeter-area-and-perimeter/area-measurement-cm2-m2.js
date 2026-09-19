import { foundationLogic } from './area-measurement-cm2-m2/foundation.js';
import { standardLogic } from './area-measurement-cm2-m2/standard.js';
import { advancedLogic } from './area-measurement-cm2-m2/advanced.js';

export const p3AreaMeasurementCm2M2Blueprint = {
  id: 'area-measurement-cm2-m2',
  blueprint: 'Measuring Area in Square Units (cm² and m²)',
  variants: {
    'foundation_1': 'Counting Whole Units on a 1 cm Grid',
    'foundation_2': 'Counting Whole Units on a 1 m Grid',
    'foundation_3': 'Adding/Subtracting Two Given Areas (a±b=c)',
    'foundation_4': 'Comparing Two Given Areas (a-b=c)',
    'foundation_5': 'The Shortfall (Building a Target Area)',

    'standard_6': 'Area with Half-Squares (Single Shape)',
    'standard_7': 'Word Problem - Subtracting Area (The Cut-Out)',
    'standard_8': 'Grouping Identical Areas (Repeated Addition/Multiplication)',
    'standard_9': 'Grouping Identical Areas + A Remainder',
    'standard_10': 'Area on a Grid with a Hollow Center (The "Donut")',

    'advanced_11': '3-Part Area Comparison (A->B->C)',
    'advanced_12': 'Grid Area with Mixed Halves and Cutouts',
    'advanced_13': 'Area Conservation (Rearranging Pieces)',
    'advanced_14': 'Tiling with Larger Units (Area Division)',
    'advanced_15': 'Two-Part Area with Unit Cost (a+b->xCost)'
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
