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
finalAnswer: """${answer} cm"""
hint: """Look at where the ${itemLabel} starts and ends. Subtract the start number from the end number."""
solutionSteps: """1. The ${itemLabel} starts at ${start} cm.\\n2. It ends at ${end} cm.\\n3. Length = ${end} - ${start} = ${length} cm."""

Generate options around ${length}. Include ${end} as a strong distractor.
The defectMap should map the distractor ${end} to "READING_ERROR".
`;
    } else {
      if (isStructure) {
        inputRequirementStr = `[
          {"label": "Working equation:", "expectedAnswer": "${end} cm - ${start} cm", "acceptedAnswers": ["${end}cm - ${start}cm", "${end} - ${start}", "${end}-${start}"]},
          {"label": "Length:", "expectedAnswer": "${length} cm", "acceptedAnswers": ["${length}cm"]}
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
hint: """Look at where the ${itemLabel} starts and ends. Subtract the start number from the end number."""
solutionSteps: """1. The ${itemLabel} starts at ${start} cm.\\n2. It ends at ${end} cm.\\n3. Length = ${end} - ${start} = ${length} cm."""
`;
    }
  }
  else if (activeVariant === 'standard_compare_two_lengths') {
    const isSum = Math.random() < 0.5;
    const item1 = "String A";
    const item2 = "String B";
    const len1 = Math.floor(Math.random() * 45) + 5; // 5 to 49
    const len2 = len1 + (Math.floor(Math.random() * 20) + 2); // difference of 2 to 21
    const total = len1 + len2;
    const diff = len2 - len1;
    
    const structureText = isSum 
      ? `${context.name} has two strings. ${item1} is ${len1} cm long. ${item2} is ${len2} cm long. What is their total length?`
      : `${context.name} has two strings. ${item1} is ${len1} cm long. ${item2} is ${len2} cm long. How much longer is ${item2} than ${item1}?`;
      
    const shortText = isSum
      ? `${len1} cm + ${len2} cm = ?`
      : `${len2} cm - ${len1} cm = ?`;
    
    const askText = getQText(structureText, shortText);
    const answer = isSum ? `${total}` : `${diff}`;
    
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
hint: """${isSum ? 'To find the total length, add both lengths together.' : 'To find how much longer one string is, subtract the shorter length from the longer length.'}"""
solutionSteps: """1. ${item2} is ${len2} cm.\\n2. ${item1} is ${len1} cm.\\n3. ${isSum ? `Total length = ${len2} + ${len1} = ${total}` : `Difference = ${len2} - ${len1} = ${diff}`} cm."""

Generate options around ${answer}. Include ${isSum ? diff : total} as a strong distractor.
The defectMap should map the distractor ${isSum ? diff : total} to "CONFUSED_OPERATION".
`;
    } else {
      if (isStructure) {
        if (isSum) {
          inputRequirementStr = `[
            {"label": "Working equation:", "expectedAnswer": "${len1} cm + ${len2} cm", "acceptedAnswers": ["${len1}cm + ${len2}cm", "${len2} cm + ${len1} cm", "${len2}cm + ${len1}cm", "${len1} + ${len2}", "${len2} + ${len1}", "${len1}+${len2}", "${len2}+${len1}"]},
            {"label": "Total length:", "expectedAnswer": "${total} cm", "acceptedAnswers": ["${total}cm"]}
          ]`;
        } else {
          inputRequirementStr = `[
            {"label": "Working equation:", "expectedAnswer": "${len2} cm - ${len1} cm", "acceptedAnswers": ["${len2}cm - ${len1}cm", "${len2} - ${len1}", "${len2}-${len1}"]},
            {"label": "Difference:", "expectedAnswer": "${diff} cm", "acceptedAnswers": ["${diff}cm"]}
          ]`;
        }
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
hint: """${isSum ? 'To find the total length, add both lengths together.' : 'To find how much longer one string is, subtract the shorter length from the longer length.'}"""
solutionSteps: """1. ${item2} is ${len2} cm.\\n2. ${item1} is ${len1} cm.\\n3. ${isSum ? `Total length = ${len2} + ${len1} = ${total}` : `Difference = ${len2} - ${len1} = ${diff}`} cm."""
`;
    }
  }
  else if (activeVariant === 'standard_compare_two_masses') {
    const isSum = Math.random() < 0.5;
    const items = getGramItems(2);
    const item1 = items[0].item;
    const item2 = items[1].item;
    const mass1 = Math.floor(Math.random() * 400) + 50; // 50 to 449
    const mass2 = mass1 + Math.floor(Math.random() * 250) + 25; // difference of 25 to 274
    const total = mass1 + mass2;
    const diff = mass2 - mass1; 
    
    const structureText = isSum
      ? `The mass of the ${item1} is ${mass1} g. The mass of the ${item2} is ${mass2} g. What is their total mass in grams?`
      : `The mass of the ${item1} is ${mass1} g. The mass of the ${item2} is ${mass2} g. How much lighter is the ${item1} than the ${item2}?`;
      
    const shortText = isSum
      ? `${mass1} g + ${mass2} g = ?`
      : `${mass2} g - ${mass1} g = ?`;
    
    const askText = getQText(structureText, shortText);
    const answer = isSum ? `${total}` : `${diff}`;
    
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
hint: """${isSum ? 'To find the total mass, add both masses together.' : 'To find how much lighter one item is, subtract the smaller mass from the bigger mass.'}"""
solutionSteps: """1. Mass of ${item2} = ${mass2} g.\\n2. Mass of ${item1} = ${mass1} g.\\n3. ${isSum ? `Total mass = ${mass2} + ${mass1} = ${total}` : `Difference = ${mass2} - ${mass1} = ${diff}`} g."""

Generate options around ${answer}. Include ${isSum ? diff : total} as a strong distractor.
The defectMap should map the distractor ${isSum ? diff : total} to "CONFUSED_OPERATION".
`;
    } else {
      if (isStructure) {
        if (isSum) {
          inputRequirementStr = `[
            {"label": "Working equation:", "expectedAnswer": "${mass1} g + ${mass2} g", "acceptedAnswers": ["${mass1}g + ${mass2}g", "${mass2} g + ${mass1} g", "${mass2}g + ${mass1}g", "${mass1} + ${mass2}", "${mass2} + ${mass1}", "${mass1}+${mass2}", "${mass2}+${mass1}"]},
            {"label": "Total mass:", "expectedAnswer": "${total} g", "acceptedAnswers": ["${total}g"]}
          ]`;
        } else {
          inputRequirementStr = `[
            {"label": "Working equation:", "expectedAnswer": "${mass2} g - ${mass1} g", "acceptedAnswers": ["${mass2}g - ${mass1}g", "${mass2} - ${mass1}", "${mass2}-${mass1}"]},
            {"label": "Difference:", "expectedAnswer": "${diff} g", "acceptedAnswers": ["${diff}g"]}
          ]`;
        }
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
finalAnswer: """${answer} g"""
hint: """${isSum ? 'To find the total mass, add both masses together.' : 'To find how much lighter one item is, subtract the smaller mass from the bigger mass.'}"""
solutionSteps: """1. Mass of ${item2} = ${mass2} g.\\n2. Mass of ${item1} = ${mass1} g.\\n3. ${isSum ? `Total mass = ${mass2} + ${mass1} = ${total}` : `Difference = ${mass2} - ${mass1} = ${diff}`} g."""
`;
    }
  }
  else if (activeVariant === 'standard_compare_two_volumes') {
    const isSum = Math.random() < 0.5;
    const vol1 = Math.floor(Math.random() * 16) + 4; // 4 to 19
    const vol2 = vol1 + (Math.floor(Math.random() * 10) + 2); // difference of 2 to 11
    const total = vol1 + vol2;
    const diff = vol2 - vol1; 
    
    const structureText = isSum
      ? `Beaker A contains ${vol1} l of water. Beaker B contains ${vol2} l of water. What is the total volume of water in litres?`
      : `Beaker A contains ${vol1} l of water. Beaker B contains ${vol2} l of water. How much more water is in Beaker B in litres?`;
      
    const shortText = isSum
      ? `${vol1} l + ${vol2} l = ?`
      : `${vol2} l - ${vol1} l = ?`;
    
    const askText = getQText(structureText, shortText);
    const answer = isSum ? `${total}` : `${diff}`;
    
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
hint: """${isSum ? 'To find the total volume, add the volumes together.' : 'Subtract the smaller volume from the larger volume.'}"""
solutionSteps: """1. Volume in Beaker B = ${vol2} l.\\n2. Volume in Beaker A = ${vol1} l.\\n3. ${isSum ? `Total volume = ${vol2} + ${vol1} = ${total}` : `Difference = ${vol2} - ${vol1} = ${diff}`} l."""

Generate options around ${answer}. Include ${isSum ? diff : total} as a strong distractor.
The defectMap should map the distractor ${isSum ? diff : total} to "CONFUSED_OPERATION".
`;
    } else {
      if (isStructure) {
        if (isSum) {
          inputRequirementStr = `[
            {"label": "Working equation:", "expectedAnswer": "${vol1} l + ${vol2} l", "acceptedAnswers": ["${vol1}l + ${vol2}l", "${vol2} l + ${vol1} l", "${vol2}l + ${vol1}l", "${vol1} L + ${vol2} L", "${vol2} L + ${vol1} L", "${vol1} + ${vol2}", "${vol2} + ${vol1}", "${vol1}+${vol2}", "${vol2}+${vol1}"]},
            {"label": "Total volume:", "expectedAnswer": "${total} l", "acceptedAnswers": ["${total}l", "${total} L", "${total}L"]}
          ]`;
        } else {
          inputRequirementStr = `[
            {"label": "Working equation:", "expectedAnswer": "${vol2} l - ${vol1} l", "acceptedAnswers": ["${vol2}l - ${vol1}l", "${vol2} L - ${vol1} L", "${vol2} - ${vol1}", "${vol2}-${vol1}"]},
            {"label": "Difference:", "expectedAnswer": "${diff} l", "acceptedAnswers": ["${diff}l", "${diff} L", "${diff}L"]}
          ]`;
        }
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
hint: """${isSum ? 'To find the total volume, add the volumes together.' : 'Subtract the smaller volume from the larger volume.'}"""
solutionSteps: """1. Volume in Beaker B = ${vol2} l.\\n2. Volume in Beaker A = ${vol1} l.\\n3. ${isSum ? `Total volume = ${vol2} + ${vol1} = ${total}` : `Difference = ${vol2} - ${vol1} = ${diff}`} l."""
`;
    }
  }

  const aiPrompt = systemPrompt + "\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
