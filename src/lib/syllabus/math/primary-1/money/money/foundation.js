export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Money', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1', heuristic: 'Money Counting' };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  const promptObject = {
    meta: commonMeta,
    content: {
      questionText: "[AI: Generate clear P1 money counting question based on the requested variant]", // Restored to questionText
      hint: "[AI: Provide a conceptual counting hint without revealing the answer]",
      options: isMCQ ? ["Placeholder1", "Placeholder2", "Placeholder3", "Placeholder4"] : null, 
      finalAnswer: "[AI: Insert dynamically calculated numeric value or string amount]",
      solutionSteps: "[AI: Show step-by-step calculation steps]"
    },
    visualEngine: {
      componentToRender: "SINGAPORE_MONEY", // Directed to the isolated text-card troubleshooting block
      componentData: { 
        items: ["$2", "50¢", "20¢"],
        total: "$2.70"
      }
    },
    inputRequirement: { inputType }
  };

  const constitution = isShort ? "SHORT: Pure mathematical counting. No names or stories." :
                       isStructure ? "STRUCTURED: Simple localized word problem (e.g., Siti has these coins...)." :
                       "MCQ: Standard question with 4 options.";

  const instructions = `
    TASK: Generate a Primary 1 Mathematics money counting question following the ${constitution}.
    LOCALIZATION: Singapore currency (10¢, 20¢, 50¢, $1, $2, $5, $10).
    
    BOUNDARIES:
    - Foundation: Max $20 total.

    OUTPUT MANDATE: You MUST populate all fields in the 'content' block. Replace placeholders with real values.
    Return ONLY a valid JSON object matching this structure:
    ${JSON.stringify(promptObject)}
  `;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}