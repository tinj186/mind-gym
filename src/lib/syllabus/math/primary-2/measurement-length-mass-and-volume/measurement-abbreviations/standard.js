import { getMeasurementAppropriateUnits } from '@/lib/utils/variable-bank';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let visualEngineStr = `{
    "componentToRender": "NONE",
    "componentData": { "hideVisual": true }
  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  let propType = 'length';
  if (activeVariant === 'standard_appropriate_mass_unit') propType = 'mass';
  else if (activeVariant === 'standard_appropriate_volume_unit') propType = 'volume';
  
  const unitPair = getMeasurementAppropriateUnits(propType);
  
  const unitToWord = {
    'cm': 'centimetre',
    'm': 'metre',
    'g': 'gram',
    'kg': 'kilogram',
    'ml': 'millilitre',
    'l': 'litre'
  };

  const useAbbreviation = Math.random() > 0.5;
  const answer = useAbbreviation ? unitPair.unit : unitToWord[unitPair.unit];
  const wrongAnswer = useAbbreviation ? unitPair.wrong : unitToWord[unitPair.wrong];
  const formatInstructionText = useAbbreviation ? "(Give your answer as an abbreviation)" : "(Give your answer as a full word)";
    
  const structureText = `Which unit of measurement is best used to measure the ${unitPair.name}? ${formatInstructionText}`;
  const shortText = `Unit to measure ${unitPair.name} ${formatInstructionText}:`;
  
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
hint: """Think about whether the ${unitPair.name} is big or small, heavy or light, and choose the most appropriate unit."""
solutionSteps: """1. The item is the ${unitPair.name}.\\n2. The most appropriate unit to measure it is ${answer}."""

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
hint: """Think about whether the ${unitPair.name} is big or small, heavy or light, and choose the most appropriate unit."""
solutionSteps: """1. The item is the ${unitPair.name}.\\n2. The most appropriate unit to measure it is ${answer}."""
`;
  }

  const aiPrompt = systemPrompt + "\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
