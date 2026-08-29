export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let visualEngineStr = `{
    "componentToRender": "NONE",
    "componentData": { "hideVisual": true }
  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  const unitPairs = [
    { full: "centimetres", abbr: "cm", type: "Length" },
    { full: "metres", abbr: "m", type: "Length" },
    { full: "grams", abbr: "g", type: "Mass" },
    { full: "kilograms", abbr: "kg", type: "Mass" },
    { full: "litres", abbr: "l", type: "Volume" },
    { full: "millilitres", abbr: "ml", type: "Volume" }
  ];
  
  const pair = unitPairs[Math.floor(Math.random() * unitPairs.length)];
  let structureText, shortText, answer, hintStr, stepsStr, distractorMapping = "";
  
  if (activeVariant === 'foundation_word_to_abbreviation') {
    structureText = `What is the correct abbreviation for ${pair.full}?`;
    shortText = `Abbreviation for ${pair.full}:`;
    answer = pair.abbr;
    hintStr = `The abbreviation for ${pair.full} is ${pair.abbr}.`;
    stepsStr = `1. The word is ${pair.full}.\\n2. The correct abbreviation is ${pair.abbr}.`;
    distractorMapping = `Generate 3 options as distractors. The distractors MUST be other unit abbreviations (e.g. if answer is "cm", distractors could be "m", "g", "kg").\\nThe defectMap should map each distractor to "CONFUSED_UNIT".`;
  } else if (activeVariant === 'foundation_abbreviation_to_word') {
    structureText = `What does the abbreviation "${pair.abbr}" stand for?`;
    shortText = `What does "${pair.abbr}" mean?`;
    answer = pair.full;
    hintStr = `The abbreviation "${pair.abbr}" stands for ${pair.full}.`;
    stepsStr = `1. The abbreviation is ${pair.abbr}.\\n2. It stands for ${pair.full}.`;
    distractorMapping = `Generate 3 options as distractors. The distractors MUST be other full unit words (e.g. if answer is "centimetres", distractors could be "metres", "grams").\\nThe defectMap should map each distractor to "CONFUSED_UNIT".`;
  } else if (activeVariant === 'foundation_identify_measurement_type') {
    structureText = `What does the unit "${pair.abbr}" measure?`;
    shortText = `What does "${pair.abbr}" measure?`;
    answer = pair.type;
    hintStr = `The unit "${pair.abbr}" stands for ${pair.full}, which is used to measure ${pair.type.toLowerCase()}.`;
    stepsStr = `1. The unit "${pair.abbr}" means ${pair.full}.\\n2. ${pair.full} is used to measure ${pair.type.toLowerCase()}.`;
    distractorMapping = `The options must be: "Length", "Mass", "Volume", and "Time".\\nThe defectMap should map each incorrect option to "CONFUSED_UNIT".`;
  }

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
hint: """${hintStr}"""
solutionSteps: """${stepsStr}"""

${distractorMapping}
`;
  } else {
    let accepted = `[]`;
    if (activeVariant === 'foundation_abbreviation_to_word') {
      accepted = `["${pair.full.slice(0, -1)}"]`;
    }
    inputRequirementStr = `{"inputType": "TEXT_INPUT", "acceptedAnswers": ${accepted}}`;
    systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """${hintStr}"""
solutionSteps: """${stepsStr}"""
`;
  }

  const aiPrompt = systemPrompt + "\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
