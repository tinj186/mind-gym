import { generateFoundation } from './bar-graph-interpretation/foundation.js';
import { generateStandard } from './bar-graph-interpretation/standard.js';
import { generateAdvanced } from './bar-graph-interpretation/advanced.js';

export const p3BarGraphInterpretationBlueprint = {
  id: 'p3-bar-graph-interpretation',
  title: 'Bar Graph Interpretation',
  blueprint: 'Bar Graph Interpretation',
  variants: {
    // 🟢 Foundation Level (Direct Reading, Simple Sums/Differences)
    'foundation_direct_combination': 'Direct Value Combination',
    'foundation_finding_difference': 'Finding the Difference (Highest/Lowest or Specific)',
    'foundation_threshold_filtering': 'Threshold Filtering & Summation',
    'foundation_reverse_category_deduction': 'Reverse Reading (Category Deduction)',
    'foundation_remainder_calculation': 'The Remainder Calculation',

    // 🟡 Standard Level (Half-way Marks, Multi-Step Comparisons, External Multipliers)
    'standard_halfway_computations': 'Half-Way Mark Computations',
    'standard_two_step_comparison': 'Two-Step Comparison (A + B vs C)',
    'standard_external_multiplier': 'External Multiplier (Groups and Items)',
    'standard_subgroup_part_whole': 'Subgroup Part-Whole Breakdown (Internal Categories)',
    'standard_before_after_adjustments': 'Before & After Adjustments (Graph as Starting Point)',

    // 🔴 Advanced Level (Complex Logic, Value/Cost Application, Goal Shortfalls)
    'advanced_unit_value_financial': 'Unit Value / Financial Application',
    'advanced_algebraic_multiplier_deduction': 'Algebraic Multiplier Deduction (Finding the Unknown)',
    'advanced_equalizing_quantities': 'Equalizing Quantities (The Transfer Problem)',
    'advanced_target_shortfall_analysis': 'Combined Target / Shortfall Analysis',
    'advanced_repacking_grouping': 'Repacking/Grouping from Total Data'
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
    const subtopic = 'Bar Graph Interpretation';

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

    throw new Error(`Unsupported difficulty '${difficulty}' for Bar Graph Interpretation`);
  }
};
