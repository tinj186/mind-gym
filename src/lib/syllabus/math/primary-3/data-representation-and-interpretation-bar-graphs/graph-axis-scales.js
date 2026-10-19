import { generateFoundation } from './graph-axis-scales/foundation.js';
import { generateStandard } from './graph-axis-scales/standard.js';
import { generateAdvanced } from './graph-axis-scales/advanced.js';

export const p3GraphAxisScalesBlueprint = {
  id: 'p3-graph-axis-scales',
  title: 'Graph Axis Scales',
  blueprint: 'Graph Axis Scales',
  variants: {
    // 🟢 Foundation Level (Scale Identification & Direct Grid Reading)
    'foundation_scale_step_identification': 'Scale Step Identification and Reading',
    'foundation_large_scale_summation': 'Large Scale Summation (50s and 100s)',
    'foundation_grid_block_multiplication': 'Grid Block Multiplication (Value by Counting)',
    'foundation_scale_verification_difference': 'Scale Verification & Difference',
    'foundation_combining_multiple_bars': 'Combining Multiple Bars on Base Scales',

    // 🟡 Standard Level (Halfway Marks & Scale Deduction)
    'standard_interpolating_halfway_marks': 'Interpolating Halfway Marks',
    'standard_deductive_axis_labeling': 'Deductive Axis Labeling',
    'standard_comparative_differences_mixed_alignments': 'Comparative Differences with Mixed Alignments',
    'standard_total_sum_mixed_alignments': 'Total Sum (3 Categories, Mixed Alignments)',
    'standard_scale_error_correction': 'Scale Error Correction (Translating Blocks to New Scale)',

    // 🔴 Advanced Level (Logical Deduction, Block Projection, & Scale Mapping)
    //    'advanced_missing_scale_value_difference_deduction': 'Missing Scale via Value Difference Deduction',
    'advanced_scale_translation_block_projection': 'Scale Translation & Block Projection',
    //    'advanced_blank_axis_financial_application': 'Blank Axis Financial Application',
    //    'advanced_equalizing_transfer_grid_block_shift': 'Equalizing Transfer (Grid Block Shift)',
    //    'advanced_target_shortfall_bar_height_prediction': 'Target Shortfall & Bar Height Prediction'
  },
  generate: function (difficulty, activeVariant, type) {
    const safeType = String(type || 'short question').toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question';
    const isStructure = !isMCQ && !isShort;

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 3';
    const topic = 'Statistics - Data Representation and Interpretation - Bar Graphs';
    const subtopic = 'Graph Axis Scales';

    const getFormatInstructions = (visualEngineStr, inputRequirementStr, askText, finalAnswer) => {
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
    "difficulty": "${zodDiff}",
    "type": "${zodType}",
    "variant": "${activeVariant}"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq},
  "content": {
    "questionText": "string (the exact questionText specified)",
    "options": ${optionsStr},
    "defectMap": ${defectMapStr},
    "finalAnswer": "${finalAnswer ? String(finalAnswer).replace(/"/g, '\\"') : 'string'}",
    "solutionSteps": "string (step-by-step logic, separate steps using the exact characters \\\\n inside the string)",
    "hint": "string (a helpful clue)"
  }
}

${askText ? `QUESTION TEXT SPECIFICATION:\n${askText}\n` : ''}
${finalAnswer ? `EXACT FINAL ANSWER:\n"${finalAnswer}"\n` : ''}`;
    };

    const diff = String(difficulty || 'foundation').toLowerCase();
    if (diff === 'foundation') {
      return generateFoundation(activeVariant, type, getFormatInstructions);
    } else if (diff === 'standard') {
      return generateStandard(activeVariant, type, getFormatInstructions);
    } else if (diff === 'advanced') {
      return generateAdvanced(activeVariant, type, getFormatInstructions);
    }

    throw new Error(`Unsupported difficulty '${difficulty}' for Graph Axis Scales`);
  }
};
