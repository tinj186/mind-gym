import { generateFoundation } from './line-drawing-perpendicular-parallel/foundation.js';
import { generateStandard } from './line-drawing-perpendicular-parallel/standard.js';
import { generateAdvanced } from './line-drawing-perpendicular-parallel/advanced.js';

export const p3LineDrawingPerpendicularParallelBlueprint = {
  id: 'p3-line-drawing-perpendicular-parallel',
  blueprint: 'Drawing Perpendicular and Parallel Lines',
  variants: {
    // Foundation
    'foundation_orthogonal_perpendiculars': 'Drawing Orthogonal Perpendiculars (Length Relationships)',
    'foundation_selecting_grid_parallel': 'Selecting Grid Points for Parallel Lines',
    'foundation_selecting_grid_perpendicular': 'Selecting Grid Points for Perpendicular Lines',
    'foundation_verifying_drawn_lines': 'Verifying Drawn Lines (Grid Rule Checking)',
    'foundation_drawing_concentric_frames': 'Drawing Concentric Frames (Parallel Offsets)',

    // Standard
    'standard_grid_step_replication': 'Grid Step Replication (Drawing Slanted Parallel Lines)',
    'standard_completing_rectangles': 'Completing Shapes on a Grid (Missing Edge Deduction)',
    'standard_drawing_alternating_paths': 'Drawing Alternating Paths (Perpendicular Zig-Zags)',
    'standard_dividing_shapes': 'Dividing Shapes (Drawing Internal Parallel Lines)',
    'standard_drawing_symmetrical_halves': 'Drawing Symmetrical Halves (Perpendicular Connection to Axis)',

    // Advanced
    'advanced_identifying_slanted_perpendiculars': 'Identifying Slanted Perpendicular Lines (Visual Verification)',
    'advanced_drawing_expanding_spiral': 'Drawing the Expanding Spiral (Perpendicular Growth)',
    'advanced_composite_shape_drawing': 'Composite Shape Drawing (Tracing Parallel Boundaries)',
    'advanced_grid_point_deduction': 'Grid Point Deduction (Completing Slanted Polygons)',
    'advanced_overlapping_draw': 'Intersecting Projections (Finding the Meeting Point)'
  },
  generate: function (difficulty, activeVariant, type) {
    const safeType = String(type).toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question';
    const isStructure = !isMCQ && !isShort;

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 3';
    const topic = 'Geometry';
    const subtopic = 'Drawing Perpendicular and Parallel Lines';

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

    if (difficulty.toLowerCase() === 'foundation') {
      return generateFoundation(activeVariant, type, getFormatInstructions);
    }
    if (difficulty.toLowerCase() === 'standard') {
      return generateStandard(activeVariant, type, getFormatInstructions);
    }
    if (difficulty.toLowerCase() === 'advanced') {
      return generateAdvanced(activeVariant, type, getFormatInstructions);
    }
    throw new Error(`Unknown difficulty: ${difficulty}`);
  }
};
