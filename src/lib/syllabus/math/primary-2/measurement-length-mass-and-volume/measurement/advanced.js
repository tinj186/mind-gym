import { getRandomLengthItems, getRandomTheme, getGramItems, getKgItems } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let visualEngineStr = `{
    "componentToRender": "NONE",
    "componentData": { "hideVisual": true }
  }`;
  
  let inputRequirementStr = null;
  let systemPrompt = "";

  if (activeVariant === 'advanced_difference_length') {
    const materials = ["Ribbon", "String", "Rope", "Wire", "Tape"];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const item1 = `${material} A`;
    const item2 = `${material} B`;
    const len1 = Math.floor(Math.random() * 20) + 15; // 15 to 34
    const diff = Math.floor(Math.random() * 10) + 5; // 5 to 14
    const len2 = len1 + diff; 
    
    const structureText = `${item1} is ${len1} m long. ${item2} is ${diff} m longer than ${item1}. What is the difference in length between the two ribbons?`;
    const shortText = `${item1} is ${len1} m long. ${item2} is ${diff} m longer than ${item1}. Find the difference.`;
    
    // This is a trick question. The difference is already given as `diff`. 
    // Wait, let's make it a 2-step question: Find total length, OR find the length of Ribbon B and then difference.
    // Let's change it to: find total length.
    const actualStructureText = `${item1} is ${len1} m long. ${item2} is ${diff} m longer than ${item1}. What is the total length of the two ribbons?`;
    const actualShortText = `${item1} is ${len1} m long. ${item2} is ${diff} m longer than ${item1}. Find the total length.`;
    
    const askText = getQText(actualStructureText, actualShortText);
    const answer = `${len1 + len2}`;
    
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
finalAnswer: """${answer} m"""
hint: """First, find the length of ${item2}. Then, add the lengths of both ribbons together."""
solutionSteps: """1. Length of ${item1} = ${len1} m.\\n2. Length of ${item2} = ${len1} + ${diff} = ${len2} m.\\n3. Total length = ${len1} + ${len2} = ${answer} m."""

Generate options around ${answer}. Include ${len2} as a strong distractor.
The defectMap should map ${len2} to "INCOMPLETE_STEP".
`;
    } else {
      inputRequirementStr = `[
        {"label": "Length of ${item2}:", "expectedAnswer": "${len2} m", "acceptedAnswers": ["${len2}m"]},
        {"label": "Working equation for total:", "expectedAnswer": "${len1} m + ${len2} m", "acceptedAnswers": ["${len1}m + ${len2}m", "${len1} + ${len2}", "${len1}+${len2}", "${len2} m + ${len1} m", "${len2}m + ${len1}m", "${len2} + ${len1}", "${len2}+${len1}"]},
        {"label": "Total length:", "expectedAnswer": "${answer} m", "acceptedAnswers": ["${answer}m"]}
      ]`;
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": ${inputRequirementStr}}`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} m"""
hint: """First, find the length of ${item2}. Then, add the lengths of both ribbons together."""
solutionSteps: """1. Length of ${item1} = ${len1} m.\\n2. Length of ${item2} = ${len1} + ${diff} = ${len2} m.\\n3. Total length = ${len1} + ${len2} = ${answer} m."""
`;
    }
  }
  else if (activeVariant === 'advanced_find_start_point_ruler') {
    const itemLabel = getRandomLengthItems();
    const start = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const length = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const end = start + length;
    
    // Hide the start point visually? The ruler doesn't support hiding just the start.
    // Instead we do a word problem without the ruler component.
    const structureText = `A ${itemLabel} is ${length} cm long. It is placed on a ruler. The end of the ${itemLabel} is at ${end} cm. At which marking on the ruler in cm does the ${itemLabel} start?`;
    const shortText = `A ${length} cm ${itemLabel} ends at ${end} cm on a ruler. Where does it start in cm?`;
    
    const askText = getQText(structureText, shortText);
    const answer = `${start}`;
    
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
finalAnswer: """${answer} cm"""
hint: """Subtract the length of the item from the end marking to find the start point."""
solutionSteps: """1. The ${itemLabel} ends at ${end} cm.\\n2. The length is ${length} cm.\\n3. Start point = ${end} - ${length} = ${start} cm."""

Generate options around ${start}. Include ${end + length} as a strong distractor.
The defectMap should map ${end + length} to "CONFUSED_OPERATION".
`;
    } else {
      if (isStructure) {
        inputRequirementStr = `[
          {"label": "Working equation:", "expectedAnswer": "${end} cm - ${length} cm", "acceptedAnswers": ["${end}cm - ${length}cm", "${end} - ${length}", "${end}-${length}"]},
          {"label": "Start point:", "expectedAnswer": "${start} cm", "acceptedAnswers": ["${start}cm"]}
        ]`;
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": ${inputRequirementStr}}`;
      } else {
        inputRequirementStr = `{"inputType": "MATH_INPUT"}`;
      }
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} cm"""
hint: """Subtract the length of the item from the end marking to find the start point."""
solutionSteps: """1. The ${itemLabel} ends at ${end} cm.\\n2. The length is ${length} cm.\\n3. Start point = ${end} - ${length} = ${start} cm."""
`;
    }
  }
  else if (activeVariant === 'advanced_balance_scale_mass') {
    const item1 = getGramItems(1).item;
    const knownMass = (Math.floor(Math.random() * 3) + 2) * 100; // 200 to 400
    const itemMass = knownMass + ((Math.floor(Math.random() * 3) + 1) * 100); // larger
    const diff = itemMass - knownMass;
    
    const structureText = `A balance scale has a ${item1} on one side. On the other side, there is a ${knownMass} g weight. To balance the scale, another ${diff} g weight is added to the side with the ${knownMass} g weight. What is the mass of the ${item1}?`;
    const shortText = `A balance scale is balanced with a ${item1} on one side and a ${knownMass} g weight plus a ${diff} g weight on the other. What is the mass of the ${item1}?`;
    
    const askText = getQText(structureText, shortText);
    const answer = `${itemMass}`;
    
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
finalAnswer: """${answer} g"""
hint: """Add the two weights on the other side together. This total is equal to the mass of the ${item1}."""
solutionSteps: """1. The two weights are ${knownMass} g and ${diff} g.\\n2. Total mass on that side = ${knownMass} + ${diff} = ${itemMass} g.\\n3. The mass of the ${item1} is equal to the total weight, which is ${itemMass} g."""

Generate options around ${itemMass}. Include ${knownMass - diff} as a strong distractor.
The defectMap should map ${knownMass - diff} to "CONFUSED_OPERATION".
`;
    } else {
      inputRequirementStr = `[
          {"label": "Working equation:", "expectedAnswer": "${knownMass} g + ${diff} g", "acceptedAnswers": ["${knownMass}g + ${diff}g", "${diff} g + ${knownMass} g", "${diff}g + ${knownMass}g", "${knownMass} + ${diff}", "${diff} + ${knownMass}", "${knownMass}+${diff}", "${diff}+${knownMass}"]},
          {"label": "Mass of ${item1}:", "expectedAnswer": "${answer} g", "acceptedAnswers": ["${answer}g"]}
        ]`;
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": ${inputRequirementStr}}`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} g"""
hint: """Add the two weights on the other side together. This total is equal to the mass of the ${item1}."""
solutionSteps: """1. The two weights are ${knownMass} g and ${diff} g.\\n2. Total mass on that side = ${knownMass} + ${diff} = ${itemMass} g.\\n3. The mass of the ${item1} is equal to the total weight, which is ${itemMass} g."""
`;
    }
  }
  else if (activeVariant === 'advanced_combined_volume_beakers') {
    const vol1 = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const vol2 = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const total = vol1 + vol2;
    
    visualEngineStr = `{
      "componentToRender": "MULTI_COMPONENT",
      "componentData": {
        "className": "items-end gap-12",
        "components": [
          {
            "componentToRender": "VOLUME_BEAKER",
            "componentData": {
              "label": "Beaker A",
              "value": ${vol1},
              "maxScale": 10,
              "unit": "l",
              "intervals": 2,
              "color": "#3b82f6"
            }
          },
          {
            "componentToRender": "VOLUME_BEAKER",
            "componentData": {
              "label": "Beaker B",
              "value": ${vol2},
              "maxScale": 10,
              "unit": "l",
              "intervals": 2,
              "color": "#ef4444"
            }
          }
        ]
      }
    }`;
    
    const structureText = `Beaker A contains ${vol1} l of blue liquid. Beaker B contains ${vol2} l of red liquid. If both liquids are poured into a large empty container, what is the total volume of liquid in litres?`;
    const shortText = `Find the total volume in litres when ${vol1} l of blue liquid and ${vol2} l of red liquid are mixed.`;
    
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
finalAnswer: """${answer} l"""
hint: """To find the total volume, add the volumes of the two liquids together."""
solutionSteps: """1. Volume of blue liquid = ${vol1} l.\\n2. Volume of red liquid = ${vol2} l.\\n3. Total volume = ${vol1} + ${vol2} = ${total} l."""

Generate options around ${total}. Include ${Math.abs(vol1 - vol2)} as a strong distractor.
The defectMap should map ${Math.abs(vol1 - vol2)} to "CONFUSED_OPERATION".
`;
    } else {
      if (isStructure) {
        inputRequirementStr = `[
          {"label": "Working equation:", "expectedAnswer": "${vol1} l + ${vol2} l", "acceptedAnswers": ["${vol1}l + ${vol2}l", "${vol1} L + ${vol2} L", "${vol2} l + ${vol1} l", "${vol2}l + ${vol1}l", "${vol2} L + ${vol1} L", "${vol1} + ${vol2}", "${vol2} + ${vol1}", "${vol1}+${vol2}", "${vol2}+${vol1}"]},
          {"label": "Total volume:", "expectedAnswer": "${total} l", "acceptedAnswers": ["${total}l", "${total} L", "${total}L"]}
        ]`;
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": ${inputRequirementStr}}`;
      } else {
        inputRequirementStr = `{"inputType": "MATH_INPUT"}`;
      }
      
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} l"""
hint: """To find the total volume, add the volumes of the two liquids together."""
solutionSteps: """1. Volume of blue liquid = ${vol1} l.\\n2. Volume of red liquid = ${vol2} l.\\n3. Total volume = ${vol1} + ${vol2} = ${total} l."""
`;
    }
  }
  else if (activeVariant === 'advanced_mass_change') {
    const scenarios = [
      { item: "flour", action: "bake a cake" },
      { item: "sugar", action: "make some drinks" },
      { item: "rice", action: "cook dinner" },
      { item: "clay", action: "make some models" },
      { item: "beans", action: "make a soup" },
      { item: "butter", action: "bake cookies" },
      { item: "salt", action: "preserve some fish" }
    ];
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const item = scenario.item;
    const action = scenario.action;
    
    const initialMass = Math.floor(Math.random() * 500) + 400; // 400 to 899
    const usedMass = Math.floor(Math.random() * 300) + 50; // 50 to 349
    const remainingMass = initialMass - usedMass;
    
    const structureText = `${context.name} bought a bag of ${item} with a mass of ${initialMass} g. After using some to ${action}, ${remainingMass} g of ${item} was left. How much ${item} did ${context.name} use in grams?`;
    const shortText = `A bag of ${item} was ${initialMass} g. ${remainingMass} g was left after some was used to ${action}. How much ${item} was used?`;
    
    const askText = getQText(structureText, shortText);
    const answer = `${usedMass}`;
    
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
finalAnswer: """${answer} g"""
hint: """Subtract the remaining mass from the starting mass to find out how much was used."""
solutionSteps: """1. Starting mass = ${initialMass} g.\\n2. Remaining mass = ${remainingMass} g.\\n3. Mass used = ${initialMass} - ${remainingMass} = ${usedMass} g."""

Generate options around ${usedMass}. Include ${initialMass + remainingMass} as a strong distractor.
The defectMap should map ${initialMass + remainingMass} to "CONFUSED_OPERATION".
`;
    } else {
      inputRequirementStr = `[
          {"label": "Working equation:", "expectedAnswer": "${initialMass} g - ${remainingMass} g", "acceptedAnswers": ["${initialMass}g - ${remainingMass}g", "${initialMass} - ${remainingMass}", "${initialMass}-${remainingMass}"]},
          {"label": "Mass used:", "expectedAnswer": "${answer} g", "acceptedAnswers": ["${answer}g"]}
        ]`;
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": ${inputRequirementStr}}`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} g"""
hint: """Subtract the remaining mass from the starting mass to find out how much was used."""
solutionSteps: """1. Starting mass = ${initialMass} g.\\n2. Remaining mass = ${remainingMass} g.\\n3. Mass used = ${initialMass} - ${remainingMass} = ${usedMass} g."""
`;
    }
  }

  const aiPrompt = systemPrompt + "\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
