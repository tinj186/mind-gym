export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  const visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a advanced-level question for Singapore Primary 4 students.
Topic: ${topic}
Subtopic: Rectangle/Square Drawing
Difficulty: ${zodDiff}
Type: ${zodType}

CRITICAL INSTRUCTIONS:
1. Ensure numerical values, contexts, and operations strictly adhere to the Singapore MOE Primary 4 Mathematics Syllabus.
2. If MCQ, generate exactly 4 options.
3. Provide step-by-step solution steps separated by \\n and an encouraging conceptual hint.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return { aiPrompt };
}
