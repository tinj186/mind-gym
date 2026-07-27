import { foundationLogic } from './patterns-with-2d-shapes/foundation';
import { standardLogic } from './patterns-with-2d-shapes/standard';
import { advancedLogic } from './patterns-with-2d-shapes/advanced'; // Trigger recompile

export const patternsWith2DShapesBlueprint = {
  title: 'patternsWith2DShapes',
  variants: {
    'foundation_single_attribute_shape': 'Identify the next 2D shape in a pattern where ONLY the shape changes (e.g., Circle, Square, Triangle, Circle, Square, [__]).',
    'foundation_single_attribute_size': 'Identify the next shape in a pattern where ONLY the size changes (e.g., Big Square, Small Square, Big Square, [__]).',
    'foundation_single_attribute_colour': 'Identify the next shape in a pattern where ONLY the colour changes (e.g., Red Triangle, Blue Triangle, Green Triangle, Red Triangle, [__]).',
    'foundation_single_attribute_orientation': 'Identify the next shape in a pattern where ONLY the orientation changes (e.g., Arrow pointing Up, Down, Up, Down, [__]).',
    'foundation_identify_pattern_core': 'Identify the repeating "core" or basic unit of a given single-attribute pattern (e.g., select the block of 3 shapes that repeats over and over).',
    'standard_dual_attribute_shape_colour': 'Identify the missing shape in a pattern where BOTH shape and colour change (e.g., Red Circle, Blue Square, Red Circle, [__]).',
    'standard_dual_attribute_size_shape': 'Identify the missing shape in a pattern where BOTH size and shape change (e.g., Big Triangle, Small Circle, Big Triangle, [__]).',
    'standard_dual_attribute_shape_orientation': 'Identify the missing shape in a pattern where BOTH shape and orientation change (e.g., Triangle pointing Up, Semicircle pointing Down, [__]).',
    'standard_dual_attribute_colour_size': 'Identify the missing shape in a pattern where BOTH colour and size change (e.g., Big Red Circle, Small Blue Circle, [__]).',
    'standard_dual_attribute_orientation_colour': 'Identify the next shape in a pattern where BOTH orientation and colour change (e.g., Red Semicircle pointing Up, Blue Semicircle pointing Down, [__]).',
    'standard_dual_attribute_size_orientation': 'Identify the missing shape in a pattern where BOTH size and orientation change (e.g., Big Triangle pointing Up, Small Triangle pointing Down, [__]).',
    'standard_extend_multiple_elements': 'Extend the pattern by selecting the next TWO or THREE consecutive shapes in the sequence instead of just one.',
    'advanced_identify_changing_attributes': 'Analyze a complex pattern and explicitly identify the core size and WHICH two or three attributes are changing from a multi-select list (Size, Shape, Colour, Orientation).',
    'advanced_spot_the_error': 'Identify the one shape that breaks the rule in a provided dual-attribute pattern (e.g., "Which shape does not belong in this pattern?").',
    'advanced_composite_shape_pattern': 'Identify the missing element in a pattern made of two shapes joined together (e.g., a square with a semicircle on top), where the orientation or color of one component changes.',
    'advanced_logical_translation': 'Match the underlying logic of a given pattern to a completely different set of shapes (e.g., "The pattern Red, Blue, Red, Blue follows the same rule as which of these? -> Big Square, Small Square, Big Square, Small Square").',
    'advanced_predict_nth_element': 'Identify a specific shape further down the sequence (e.g., "What will the 10th shape be?") in a dual-attribute pattern, without showing the intermediate blanks.',
    'advanced_mismatched_attribute_cycles': 'Identify the next shape in a pattern where two attributes change, but they repeat at different intervals (e.g., the Shape alternates every 2 spaces, but the Colour alternates every 3 spaces).'
  },
  generate: function (difficulty, activeVariant, type) {
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';
    const level = 'Primary 2';
    const topic = 'Geometry - 2D Shapes';
    const subtopic = '2D Shape Patterns';
    const zodType = type;
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

    if (difficulty.toLowerCase() === 'foundation') {
      const result = foundationLogic(activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions);
      return { aiPrompt: result.aiPrompt };
    } else if (difficulty.toLowerCase() === 'standard') {
      const result = standardLogic(activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions);
      return { aiPrompt: result.aiPrompt };
    } else if (difficulty.toLowerCase() === 'advanced') {
      const result = advancedLogic(activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions);
      return { aiPrompt: result.aiPrompt };
    }

    return { aiPrompt: `No logic matched for difficulty: ${difficulty}` };
  }
};
