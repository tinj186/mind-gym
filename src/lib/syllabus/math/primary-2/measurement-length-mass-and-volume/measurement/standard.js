import { getRandomLengthItems, getRandomTheme, getGramItems, getKgItems } from '@/lib/utils/variable-bank';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let visualEngineStr = `{
    "componentToRender": "NONE",
    "componentData": { "hideVisual": true }
  }`;
  
  let inputRequirementStr = null;
  let systemPrompt = "";

  if (activeVariant === 'standard_reading_ruler_offset') {
    const itemLabel = getRandomLengthItems();
    const start = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const length = Math.floor(Math.random() * 6) + 3; // 3 to 8
    const end = start + length;
    
    visualEngineStr = `{
      "componentToRender": "MEASUREMENT_RULER",
      "componentData": {
        "items": [{ "label": "${itemLabel}", "length": ${length}, "startOffset": ${start} }],
        "showFullRuler": true
      }
    }`;
    
    const structureText = `Look at the ruler. What is the length of the ${itemLabel} in cm?`;
    const shortText = `Find the length of the ${itemLabel} in cm.`;
    
    const askText = getQText(structureText, shortText);
    const answer = `${length}`;
    
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
hint: """Look at where the ${itemLabel} starts and ends. Subtract the start number from the end number."""
solutionSteps: """1. The ${itemLabel} starts at ${start} cm.\\n2. It ends at ${end} cm.\\n3. Length = ${end} - ${start} = ${length} cm."""

Generate options around ${length}. Include ${end} as a strong distractor.
The defectMap should map the distractor ${end} to "READING_ERROR".
`;
    } else {
      inputRequirementStr = `{"inputType": "MATH_INPUT"}`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """Look at where the ${itemLabel} starts and ends. Subtract the start number from the end number."""
solutionSteps: """1. The ${itemLabel} starts at ${start} cm.\\n2. It ends at ${end} cm.\\n3. Length = ${end} - ${start} = ${length} cm."""
`;
    }
  }
  else if (activeVariant === 'standard_compare_two_lengths') {
    const item1 = "String A";
    const item2 = "String B";
    const len1 = Math.floor(Math.random() * 15) + 5; // 5 to 19
    const diff = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const len2 = len1 + diff; 
    
    const structureText = `${context.name} has two strings. ${item1} is ${len1} cm long. ${item2} is ${len2} cm long. How much longer is ${item2} than ${item1}?`;
    const shortText = `${item1} is ${len1} cm long. ${item2} is ${len2} cm long. How much longer is ${item2} than ${item1}?`;
    
    const askText = getQText(structureText, shortText);
    const answer = `${diff}`;
    
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
hint: """To find how much longer one string is, subtract the shorter length from the longer length."""
solutionSteps: """1. ${item2} is ${len2} cm.\\n2. ${item1} is ${len1} cm.\\n3. Difference = ${len2} - ${len1} = ${diff} cm.\\n4. ${item2} is ${diff} cm longer."""

Generate options around ${diff}. Include ${len1 + len2} as a strong distractor.
The defectMap should map the distractor ${len1 + len2} to "CONFUSED_OPERATION".
`;
    } else {
      inputRequirementStr = `{"inputType": "MATH_INPUT"}`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """To find how much longer one string is, subtract the shorter length from the longer length."""
solutionSteps: """1. ${item2} is ${len2} cm.\\n2. ${item1} is ${len1} cm.\\n3. Difference = ${len2} - ${len1} = ${diff} cm.\\n4. ${item2} is ${diff} cm longer."""
`;
    }
  }
  else if (activeVariant === 'standard_compare_two_masses') {
    const items = getGramItems(2);
    const item1 = items[0].item;
    const item2 = items[1].item;
    const mass1 = (Math.floor(Math.random() * 5) + 2) * 100; // 200 to 600
    const diff = (Math.floor(Math.random() * 3) + 1) * 100; // 100 to 300
    const mass2 = mass1 + diff; 
    
    const structureText = `The mass of the ${item1} is ${mass1} g. The mass of the ${item2} is ${mass2} g. How much lighter is the ${item1} than the ${item2}?`;
    const shortText = `The ${item1} is ${mass1} g. The ${item2} is ${mass2} g. How much lighter is the ${item1}?`;
    
    const askText = getQText(structureText, shortText);
    const answer = `${diff}`;
    
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
hint: """To find how much lighter one item is, subtract the smaller mass from the bigger mass."""
solutionSteps: """1. Mass of ${item2} = ${mass2} g.\\n2. Mass of ${item1} = ${mass1} g.\\n3. Difference = ${mass2} - ${mass1} = ${diff} g."""

Generate options around ${diff}. Include ${mass1 + mass2} as a strong distractor.
The defectMap should map the distractor ${mass1 + mass2} to "CONFUSED_OPERATION".
`;
    } else {
      inputRequirementStr = `{"inputType": "MATH_INPUT"}`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """To find how much lighter one item is, subtract the smaller mass from the bigger mass."""
solutionSteps: """1. Mass of ${item2} = ${mass2} g.\\n2. Mass of ${item1} = ${mass1} g.\\n3. Difference = ${mass2} - ${mass1} = ${diff} g."""
`;
    }
  }
  else if (activeVariant === 'standard_compare_two_volumes') {
    const vol1 = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const diff = Math.floor(Math.random() * 2) + 1; // 1 to 2
    const vol2 = vol1 + diff; 
    
    const structureText = `Beaker A contains ${vol1} l of water. Beaker B contains ${vol2} l of water. How much more water is in Beaker B in litres?`;
    const shortText = `Beaker A has ${vol1} l of water. Beaker B has ${vol2} l of water. Find the difference in volume in litres.`;
    
    const askText = getQText(structureText, shortText);
    const answer = `${diff}`;
    
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
hint: """Subtract the smaller volume from the larger volume."""
solutionSteps: """1. Volume in Beaker B = ${vol2} l.\\n2. Volume in Beaker A = ${vol1} l.\\n3. Difference = ${vol2} - ${vol1} = ${diff} l."""

Generate options around ${diff}. Include ${vol1 + vol2} as a strong distractor.
The defectMap should map the distractor ${vol1 + vol2} to "CONFUSED_OPERATION".
`;
    } else {
      inputRequirementStr = `{"inputType": "MATH_INPUT"}`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """Subtract the smaller volume from the larger volume."""
solutionSteps: """1. Volume in Beaker B = ${vol2} l.\\n2. Volume in Beaker A = ${vol1} l.\\n3. Difference = ${vol2} - ${vol1} = ${diff} l."""
`;
    }
  }
  else if (activeVariant === 'standard_total_mass') {
    const items = getGramItems(2);
    const item1 = items[0].item;
    const item2 = items[1].item;
    const mass1 = (Math.floor(Math.random() * 4) + 1) * 100; // 100 to 400
    const mass2 = (Math.floor(Math.random() * 4) + 1) * 100; // 100 to 400
    const total = mass1 + mass2; 
    
    const structureText = `The mass of the ${item1} is ${mass1} g. The mass of the ${item2} is ${mass2} g. What is their total mass in grams?`;
    const shortText = `The ${item1} is ${mass1} g. The ${item2} is ${mass2} g. Find the total mass in grams.`;
    
    const askText = getQText(structureText, shortText);
    const answer = `${total}`;
    
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
hint: """To find the total mass, add both masses together."""
solutionSteps: """1. Mass of ${item1} = ${mass1} g.\\n2. Mass of ${item2} = ${mass2} g.\\n3. Total mass = ${mass1} + ${mass2} = ${total} g."""

Generate options around ${total}. Include ${Math.abs(mass1 - mass2)} as a strong distractor if it is greater than 0, otherwise use ${total + 100}.
The defectMap should map the distractors to "CONFUSED_OPERATION" or "CARELESS_CALCULATION".
`;
    } else {
      inputRequirementStr = `{"inputType": "MATH_INPUT"}`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """To find the total mass, add both masses together."""
solutionSteps: """1. Mass of ${item1} = ${mass1} g.\\n2. Mass of ${item2} = ${mass2} g.\\n3. Total mass = ${mass1} + ${mass2} = ${total} g."""
`;
    }
  }

  const aiPrompt = systemPrompt + "\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
