import { foundationLogic } from './perpendicular-parallel-lines/foundation.js';
import { standardLogic } from './perpendicular-parallel-lines/standard.js';
import { advancedLogic } from './perpendicular-parallel-lines/advanced.js';

export const p3PerpendicularParallelLinesBlueprint = {
  id: 'perpendicular-parallel-lines',
  blueprint: 'Perpendicular and Parallel Lines',
  variants: {
    'foundation_grouping_parallel': 'Grouping Parallel Pairs in Standard Polygons',
    'foundation_grouping_perpendicular': 'Grouping Perpendicular Pairs in Standard Polygons',
    'foundation_letters_perpendicular': 'Perpendicular Pairs in Capital Letters',
    'foundation_grid_relationships': 'Grid-Based Line Relationships (Reference Line Verification)',
    'foundation_labeled_polygon_edges': 'Labeled Polygon Line Relationships (Reference Edges)',

    'standard_deducing_quantities': 'Deducing Shape Quantities (Guess & Check)',
    'standard_shapes_inside_shapes': 'Shapes Inside Shapes (Property Summation)',
    'standard_intersecting_networks': 'Intersecting Parallel Networks (Road Grids)',
    'standard_shape_group_filtering': 'Shape Group Filtering (Property Checking)',
    'standard_shape_splitting': 'Shape Splitting (Loss of Properties)',

    'advanced_grid_line_network': 'Multi-Slope Grid Line Network (Pair Classification)',
    'advanced_half_shape_reflection': 'Half-Shape Reflection (Mirror Line Property Doubling)',
    'advanced_composite_tangram': 'Composite Tangram Perimeter (Internal vs External Properties)',
    'advanced_overlapping_rectilinear': 'Overlapping Rectilinear Shapes (Merged Boundary Perpendiculars)',
    'advanced_grid_plotting_deduction': 'Grid Plotting Geometric Constraint Deduction'
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
    const subtopic = 'Perpendicular and Parallel Lines';

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
    "difficulty": "${zodDiff}",
    "type": "${zodType}",
    "variant": "${activeVariant}"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq},
  "content": {
    "questionText": "string (the story/context/question)",
    "options": ${optionsStr},
    "defectMap": ${defectMapStr},
    "finalAnswer": "string (the correct answer)",
    "solutionSteps": "string (step-by-step logic, separate steps using the exact characters \\\\n inside the string)",
    "hint": "string (a helpful clue)"
  }
}`;
    };

    const diffLower = difficulty.toLowerCase();
    if (diffLower === 'foundation') {
      return foundationLogic(activeVariant, isMCQ, isShort, isStructure, getFormatInstructions);
    } else if (diffLower === 'standard') {
      return standardLogic(activeVariant, isMCQ, isShort, isStructure, getFormatInstructions);
    } else if (diffLower === 'advanced') {
      return advancedLogic(activeVariant, isMCQ, isShort, isStructure, getFormatInstructions);
    }

    throw new Error('Not implemented');
  }
};
