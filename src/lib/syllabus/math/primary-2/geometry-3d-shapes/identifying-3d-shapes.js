import { foundationLogic } from './identifying-3d-shapes/foundation';
import { standardLogic } from './identifying-3d-shapes/standard';
import { advancedLogic } from './identifying-3d-shapes/advanced';

export const identifying3DShapesBlueprint = {
  title: '3D Shape Classification', // Must match subtopic exactly if dynamic
  variants: {
    // Foundation
    'foundation_identify_from_visual': 'Identify the correct mathematical name (cube, cuboid, cone, cylinder, sphere) when shown a randomly oriented 3D shape.',
    'foundation_real_world_matching': 'Match a familiar everyday object to its 3D shape name (e.g., a party hat to a cone, a tissue box to a cuboid, a marble to a sphere).',
    'foundation_surface_type_classification': 'Classify a single given shape based on its surface types: "Only flat surfaces", "Only curved surfaces", or "Both flat and curved surfaces".',
    'foundation_trace_single_2d_face': 'Identify the 2D shape that would be drawn if you traced the flat face of a given 3D shape on a piece of paper (e.g., tracing the bottom of a cone makes a circle).',
    'foundation_count_basic_faces': 'Count the total number of flat faces on a standard cube or cuboid.',

    // Standard
    'standard_dual_attribute_pattern': 'Identify the missing shape in a pattern where exactly TWO attributes change (Shape, Colour, Size, or Orientation).',
    'standard_extend_multiple_elements': 'Extend the pattern by selecting the next TWO or THREE consecutive shapes in the sequence instead of just one.',
    'standard_composite_shape_counting': 'Analyze a composite 3D figure (e.g., a robot made of 3D shapes) and count the exact number of a specific shape or surface type used.',
    'standard_fractional_shape_composition': 'Calculate how many smaller 3D blocks (e.g., unit cubes) are needed to completely build a provided larger 3D structure.',
    'standard_identify_net_to_shape': 'Identify the 2D shape of the shadow cast when a flashlight shines from the TOP or SIDE of a given 3D shape.',

    // Advanced
    'advanced_2d_stacking_extrusion': 'Randomized questions about stacking 2D shapes to make 3D shapes (or vice versa), masked with everyday objects.',
    'advanced_elimination_riddle': 'Identify a 3D shape based on 2-3 randomized clues about its properties (movement, faces, tracing).',
    'advanced_hidden_block_difference': 'Compare two 3D coordinate grids of blocks (one with hidden blocks) and calculate how many to add or remove.',
    'advanced_trace_and_manipulate': 'Mentally trace the flat faces of 2-3 randomized everyday 3D objects and evaluate a randomized geometric rule based on those traces.'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Geometry - 3D Shapes';
    const subtopic = '3D Shape Classification';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    // Zod formatting strings
    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    // Helper to switch text based on type
    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };

    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`, inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "type": "${zodType}",
    "difficulty": "${zodDiff}"
  },
  "content": {
    "questionText": ["string (Line 1)", "string (Line 2)"] (Array of strings for the full question text. Break into multiple lines if needed.),
    "options": ["string", "string", "string", "string"] (ONLY if MCQ, otherwise empty array),
    "defectMap": { "distractor1": "Error category", "distractor2": "Error category" } (ONLY if MCQ, otherwise empty object),
    "hint": "string (Pedagogical hint)",
    "solutionSteps": ["string (Step 1)", "string (Step 2)"] (Array of strings for the step-by-step model solution. Break down the logic into distinct steps. separate steps using the exact characters \\\\n inside the string),
    "finalAnswer": "string (The exact final answer)"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputRequirementStr || `{"inputType": "TEXT_INPUT"}`}
}`;
    // Dummy context (will be replaced by Universal Engine localization)
    const context = { name: "Ahmad", setting: "the library" };
    const selectedContextItem = "books";

    const diffKey = difficulty.toLowerCase();

    if (diffKey === 'foundation' && isStructure) {
      throw new Error("Structured questions are not supported for Foundation difficulty in this module.");
    }

    if (diffKey === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (diffKey === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (diffKey === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    throw new Error(`Unknown difficulty ${difficulty}`);
  }
};
