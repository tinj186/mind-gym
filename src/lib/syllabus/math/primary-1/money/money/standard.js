export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Money', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1', heuristic: 'Money Exchanges' };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  const promptObject = {
    meta: commonMeta,
    content: {
      questionText: "Count the total amount of money shown below.", // Restored to questionText
      hint: "[AI: Provide a strategic breakdown hint without revealing the answer]",
      options: isMCQ ? ["Placeholder1", "Placeholder2", "Placeholder3", "Placeholder4"] : null, 
      finalAnswer: "[AI: Insert calculated response]",
      solutionSteps: "[AI: Detail step by step calculation pathway]"
    },
    visualEngine: {
      componentToRender: "SINGAPORE_MONEY", // Directed to the isolated text-card troubleshooting block
      componentData: { 
        items: ["$5", "$2", "50¢"],
        total: "$7.50"
      }
    },
    inputRequirement: { inputType }
  };

  const constitution = isShort ? "SHORT: Pure counting math." :
                       isStructure ? "STRUCTURED: Localized shopping story." :
                       "MCQ: Question with 4 options.";

  const instructions = `
    TASK: Generate a Standard P1 Money question following the ${constitution}.
    LOCALIZATION: Singapore currency (10¢, 20¢, 50¢, $1, $2, $5, $10).
    
    BOUNDARIES:
    - Standard: Max $50 total.

    OUTPUT MANDATE: Populate all 'content' fields. Replace placeholders.
    Return ONLY a valid JSON object matching this structure:
    ${JSON.stringify(promptObject)}
  `;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}