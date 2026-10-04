import { foundationLogic } from './angle-concepts/foundation.js';
import { standardLogic } from './angle-concepts/standard.js';
import { advancedLogic } from './angle-concepts/advanced.js';
import { getRandomNames } from '../../../../utils/variable-bank.js';

export const p3AngleConceptsBlueprint = {
  id: 'angle-concepts',
  blueprint: 'Angle Concepts',
  variants: {
    'foundation_total_angles': 'Total Angles of Identical Polygons (Count×Angles=Total)',
    'foundation_combining_angles': 'Combining/Comparing Angles of Polygons (Addition, Subtraction, Deduction)',
    'foundation_categorizing_inside': 'Categorizing Inside a Shape (Right+Non-Right=Total)',
    'foundation_grouped_angles': 'Identifying Shapes from Grouped Angles (Total÷Count=Angles)',
    'foundation_hidden_shape': 'Angle Deduction (The Hidden Shape)',

    'standard_right_angle_turns': 'Right Angles in Turns (Complete & Half Turns)',
    'standard_capital_letters': 'Right Angles in Capital Letters',
    'standard_scaling_polygon_angles': 'Scaling Polygon Angles (Adding/Removing Shapes)',
    'standard_acute_obtuse': 'Acute vs Obtuse Conceptually',
    'standard_comparing_groups_polygons': 'Comparing Groups of Polygons (Multi-Step Difference)',

    'advanced_polygon_sequence': 'The Polygon Sequence Pattern',
    'advanced_joining_shapes': 'Joining Shapes (Hidden Angles Deduction)',
    'advanced_clock_deduction': 'Clock Turning Deduction (Time Calculation)',
    'advanced_deducing_shapes': 'Deducing Shapes from Total Angles (Heuristic/Assumption)',
    'advanced_shapes_within_shapes': 'Shapes within Shapes (Implicit Property Deduction)'
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
    const subtopic = 'Angle Concepts';

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
    "solutionSteps": "string",
    "hint": "string",
    "finalAnswer": "string",
    "options": ${optionsStr},
    "defectMap": ${defectMapStr},
    "acceptedAnswers": ["string"]
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq}
}`;
    };

    let visualEngineStr = '';
    let inputRequirementStr = '';
    let systemPrompt = '';

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const variableBank = { getRandomNames };

    try {
      let result;
      if (difficulty.toLowerCase() === 'foundation') {
        result = foundationLogic(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getRandomInt, variableBank);
      } else if (difficulty.toLowerCase() === 'standard') {
        result = standardLogic(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getRandomInt, variableBank);
      } else {
        result = advancedLogic(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getRandomInt, variableBank);
      }
      visualEngineStr = result.visualEngineStr;
      inputRequirementStr = result.inputRequirementStr;
      systemPrompt = result.systemPrompt;
    } catch (e) {
      console.error(e);
      throw e;
    }

    const aiPrompt = systemPrompt + "\\n\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);

    return {
      aiPrompt
    };
  }
};
