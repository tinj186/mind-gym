import { getMeasurementEstimationPairs } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let visualEngineStr = `{
    "componentToRender": "NONE",
    "componentData": { "hideVisual": true }
  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  let propType = 'length';
  if (activeVariant === 'advanced_best_estimate_mass') propType = 'mass';
  else if (activeVariant === 'advanced_best_estimate_volume') propType = 'volume';
  
  const estPair = getMeasurementEstimationPairs(propType);
  
  const unitToWord = {
    'cm': 'centimetre',
    'm': 'metre',
    'g': 'gram',
    'kg': 'kilogram',
    'ml': 'millilitre',
    'l': 'litre'
  };

  const useAbbreviation = Math.random() > 0.5;
  
  const parseEst = (estString) => {
    const parts = estString.split(' ');
    if (useAbbreviation || parts.length !== 2) return estString;
    
    let word = unitToWord[parts[1]];
    if (Number(parts[0]) !== 1) word += 's'; // Pluralize
    
    return `${parts[0]} ${word}`;
  };

  const answer = parseEst(estPair.correct);
  const wrongAnswer = parseEst(estPair.wrong);
  const formatInstructionText = useAbbreviation ? "(Give your unit as an abbreviation)" : "(Give your unit as a full word)";
    
  const structureText = `What is the most reasonable estimate for the ${estPair.name}? ${formatInstructionText}`;
  const shortText = `Estimate for the ${estPair.name} ${formatInstructionText}:`;
  
  const askText = getQText(structureText, shortText);
  
  if (isMCQ) {
    inputRequirementStr = `null`;
    systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """Think about the real-world size or mass of the ${estPair.name} to choose the best estimate."""
solutionSteps: """1. We need to estimate the ${estPair.name}.\\n2. The most reasonable estimate is ${answer}."""

Generate options around ${answer}. Include ${wrongAnswer} as a strong distractor.
The defectMap should map ${wrongAnswer} to "CONFUSED_UNIT".
`;
  } else {
    inputRequirementStr = `{"inputType": "TEXT_INPUT"}`;
    systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """Think about the real-world size or mass of the ${estPair.name} to choose the best estimate."""
solutionSteps: """1. We need to estimate the ${estPair.name}.\\n2. The most reasonable estimate is ${answer}."""
`;
  }

  const aiPrompt = systemPrompt + "\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
