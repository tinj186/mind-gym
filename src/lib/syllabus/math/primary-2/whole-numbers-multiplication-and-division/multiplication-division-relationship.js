import { foundationLogic } from './multiplication-division-relationship/foundation';
import { standardLogic } from './multiplication-division-relationship/standard';
import { advancedLogic } from './multiplication-division-relationship/advanced';
import { getRandomContext } from '@/lib/utils/localization';

export const multiplicationDivisionRelationshipBlueprint = {
  title: 'Multiplication/Division Relationship',
  variants: {
    'foundation_related_multiplication_fact': 'Given a division fact, find the related multiplication fact.',
    'foundation_related_division_fact': 'Given a multiplication fact, find the related division fact.',
    'foundation_fact_family_missing_equation': 'Given 3 equations in a fact family, find the 4th missing one.',
    'standard_inverse_balance': 'Find an unknown factor using inverse operations.',
    'standard_division_to_multiplication_unknown': 'Find an unknown dividend using inverse operations.',
    'standard_identify_false_related_fact': 'Identify the incorrect equation from a list of related equations.',
    'advanced_inverse_chain': 'Solve a multi-step equation backwards using inverse operations.',
    'advanced_two_equations_unknowns': 'Solve two unknowns from two related equations.',
    'advanced_balance_inverse_sides': 'Balance an equation where one side is multiplication and the other is division.',
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Multiplication and Division';
    const subtopic = 'Multiplication/Division Relationship';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };

    // The mandatory format instructions for the Generation Engine schema
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
    "solutionSteps": ["string (Step 1)", "string (Step 2)"] (Array of strings for the step-by-step model solution. Break down the logic into distinct steps.),
    "finalAnswer": "string (The exact final answer)"
  },
  "visualEngine": ${visualEngineStr}${inputRequirementStr ? `,\n  "inputRequirement": ${inputRequirementStr}` : ''}
}`;

    const context = getRandomContext('general');
    const selectedContextItem = context.items[0];

    const normDiff = difficulty.toLowerCase();

    if (normDiff === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (normDiff === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (normDiff === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    throw new Error(`Unknown difficulty ${difficulty}`);
  }
};
