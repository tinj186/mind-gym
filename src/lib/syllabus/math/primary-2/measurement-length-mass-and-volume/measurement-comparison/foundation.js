import { getMeasurementAppropriateUnits, getRandomNames } from '@/lib/utils/variable-bank';

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, getQText) => {
  let visualEngineStr = `{
    "componentToRender": "NONE",
    "componentData": { "hideVisual": true }
  }`;

  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const isShorterLighterLess = Math.random() > 0.5;

  const getRealisticItems = (itemType, targetUnit, count) => {
    const items = [];
    const prefixes = /^(length of a|height of a|width of a|length of an|height of an|width of an|mass of a|mass of an|volume of a|volume of an|volume of water in a|volume of milk in a|volume of fuel in a|volume of shampoo in a|volume of medicine in an|thickness of a|length of) /i;
    let safety = 0;
    while(items.length < count && safety < 200) {
      const rawObj = getMeasurementAppropriateUnits(itemType);
      if (rawObj.unit === targetUnit && rawObj.val <= 900) {
        const cleanItemName = rawObj.name.replace(prefixes, '');
        if (!items.find(i => i.item === cleanItemName)) {
          items.push({ item: cleanItemName, val: rawObj.val });
        }
      }
      safety++;
    }
    // Fallback if not enough unique items are found (shouldn't happen with large pools)
    while (items.length < count) {
      items.push({ item: `item ${items.length}`, val: getRandomInt(10, 50) });
    }
    return items;
  };

  if (activeVariant.includes('compare_two')) {
    let objA, objB, valA, valB, unit;
    let attribute, comparisonAdj;
    let globalItems = [];

    if (activeVariant === 'foundation_compare_two_lengths') {
      unit = Math.random() > 0.5 ? 'cm' : 'm';
      const itemsList = getRealisticItems('length', unit, 4);
      objA = itemsList[0].item;
      objB = itemsList[1].item;
      valA = itemsList[0].val;
      valB = itemsList[1].val;
      while (valA === valB) valB += 1;
      
      // Ensure all 4 globalItems have distinct values for MCQ logic
      const distinctVals = Array.from(new Set(itemsList.map(i => i.val)));
      while (distinctVals.length < 4) {
        const newVal = getRandomInt(10, 500);
        if (!distinctVals.includes(newVal)) distinctVals.push(newVal);
      }
      for (let i = 0; i < 4; i++) {
        itemsList[i].val = distinctVals[i];
      }
      valA = itemsList[0].val;
      valB = itemsList[1].val;

      attribute = 'long';
      comparisonAdj = isShorterLighterLess ? 'shorter' : 'longer';
      globalItems = itemsList;
    } else if (activeVariant === 'foundation_compare_two_masses') {
      unit = Math.random() > 0.5 ? 'kg' : 'g';
      const itemsList = getRealisticItems('mass', unit, 4);
      objA = itemsList[0].item;
      objB = itemsList[1].item;
      valA = itemsList[0].val;
      valB = itemsList[1].val;
      while (valA === valB) valB += 1;
      
      // Ensure all 4 globalItems have distinct values for MCQ logic
      const distinctVals = Array.from(new Set(itemsList.map(i => i.val)));
      while (distinctVals.length < 4) {
        const newVal = getRandomInt(10, 500);
        if (!distinctVals.includes(newVal)) distinctVals.push(newVal);
      }
      for (let i = 0; i < 4; i++) {
        itemsList[i].val = distinctVals[i];
      }
      valA = itemsList[0].val;
      valB = itemsList[1].val;

      attribute = 'heavy';
      comparisonAdj = isShorterLighterLess ? 'lighter' : 'heavier';
      globalItems = itemsList;
    } else if (activeVariant === 'foundation_compare_two_volumes') {
      unit = Math.random() > 0.5 ? 'l' : 'ml';
      const itemsList = getRealisticItems('volume', unit, 4);
      objA = itemsList[0].item;
      objB = itemsList[1].item;
      valA = itemsList[0].val;
      valB = itemsList[1].val;
      while (valA === valB) valB += 1;
      
      // Ensure all 4 globalItems have distinct values for MCQ logic
      const distinctVals = Array.from(new Set(itemsList.map(i => i.val)));
      while (distinctVals.length < 4) {
        const newVal = getRandomInt(10, 500);
        if (!distinctVals.includes(newVal)) distinctVals.push(newVal);
      }
      for (let i = 0; i < 4; i++) {
        itemsList[i].val = distinctVals[i];
      }
      valA = itemsList[0].val;
      valB = itemsList[1].val;

      attribute = 'volume';
      comparisonAdj = isShorterLighterLess ? 'less' : 'more';
      globalItems = itemsList;
    }

    const structureText = activeVariant === 'foundation_compare_two_volumes'
      ? `Container A is a ${objA} that holds ${valA} ${unit} of water. Container B is a ${objB} that holds ${valB} ${unit} of water. Which container holds ${comparisonAdj} water?`
      : `Object A is a ${objA} that is ${valA} ${unit} ${attribute}. Object B is a ${objB} that is ${valB} ${unit} ${attribute}. Which object is ${comparisonAdj}?`;

    const shortText = activeVariant === 'foundation_compare_two_volumes'
      ? `A: ${objA} (${valA} ${unit}), B: ${objB} (${valB} ${unit}). Container with ${comparisonAdj} water:`
      : `A: ${objA} (${valA} ${unit}), B: ${objB} (${valB} ${unit}). The ${comparisonAdj} object is:`;


    let askText = getQText(structureText, shortText);

    let expectedWinner;
    if (isShorterLighterLess) {
      expectedWinner = valA < valB ? 'A' : 'B';
    } else {
      expectedWinner = valA > valB ? 'A' : 'B';
    }

    const answer = `Container ${expectedWinner}`.replace('Container Container', 'Container').replace('Object Object', 'Object'); // Just 'A' or 'B', or we can enforce it.
    const actualAnswer = activeVariant === 'foundation_compare_two_volumes' ? `Container ${expectedWinner}` : `Object ${expectedWinner}`;

    if (isStructure) {
      const diff = Math.abs(valA - valB);
      const isVolume = activeVariant === 'foundation_compare_two_volumes';
      const label1 = isVolume ? `Container with ${comparisonAdj} water:` : `${comparisonAdj.charAt(0).toUpperCase() + comparisonAdj.slice(1)} object:`;
      const eq = `${Math.max(valA, valB)} ${unit} - ${Math.min(valA, valB)} ${unit} = ${diff} ${unit}`;

      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        {"label": "${label1}", "expectedAnswer": "${actualAnswer}", "acceptedAnswers": ["${expectedWinner}", "${actualAnswer}"]},
        {"label": "Equation to find difference:", "expectedAnswer": "${eq}", "acceptedAnswers": []},
        {"label": "Difference:", "expectedAnswer": "${diff} ${unit}", "acceptedAnswers": ["${diff}"]}
      ]}`;
    }

    if (isMCQ) {
      inputRequirementStr = `null`;
      
      // For MCQ, we just find the expected winner from the 4 distinct global items to avoid duplicate weight ties
      let targetVal = isShorterLighterLess ? Math.min(...globalItems.map(i => i.val)) : Math.max(...globalItems.map(i => i.val));
      let targetItem = globalItems.find(i => i.val === targetVal);
      const mcqAnswer = `${targetItem.item} (${targetItem.val} ${unit})`;
      
      const mcqAskText = activeVariant === 'foundation_compare_two_volumes'
        ? `Which container holds ${comparisonAdj} water?`
        : `Which object is ${comparisonAdj}?`;

      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!
CRITICAL INSTRUCTION: The 'options' array MUST contain EXACTLY 4 elements. DO NOT generate 2 or 3 options!

Use EXACTLY:
questionText: ["${mcqAskText}"]
finalAnswer: "${mcqAnswer}"
hint: "Look for the ${isShorterLighterLess ? 'smallest' : 'largest'} number among the measurements."
solutionSteps: ["1. Compare the measurements: ${globalItems[0].val} ${unit}, ${globalItems[1].val} ${unit}, ${globalItems[2].val} ${unit}, and ${globalItems[3].val} ${unit}.", "2. The ${isShorterLighterLess ? 'smallest' : 'largest'} is ${targetVal} ${unit}, so it is the ${comparisonAdj} one."]

Generate EXACTLY 4 options:
- "${globalItems[0].item} (${globalItems[0].val} ${unit})"
- "${globalItems[1].item} (${globalItems[1].val} ${unit})"
- "${globalItems[2].item} (${globalItems[2].val} ${unit})"
- "${globalItems[3].item} (${globalItems[3].val} ${unit})"
The options array MUST contain these 4 strings exactly.
The defectMap should map the incorrect options to "COMPARISON_ERROR".
`;
    } else {
      if (!isStructure) {
        inputRequirementStr = `{"inputType": "TEXT_INPUT"}`;
      }

      let sysFinalAnswer = actualAnswer;
      let sysSolutionSteps = `"""1. Compare the measurements: ${valA} ${unit} and ${valB} ${unit}.\\n2. Since ${isShorterLighterLess ? Math.min(valA, valB) + ' is less than ' + Math.max(valA, valB) : Math.max(valA, valB) + ' is more than ' + Math.min(valA, valB)}, ${actualAnswer} is ${comparisonAdj}."""`;

      if (isStructure) {
        const diff = Math.abs(valA - valB);
        sysFinalAnswer = `${actualAnswer}, ${diff} ${unit}`;
        sysSolutionSteps = `"""1. Compare the measurements: ${valA} ${unit} and ${valB} ${unit}.\\n2. Since ${isShorterLighterLess ? Math.min(valA, valB) + ' is less than ' + Math.max(valA, valB) : Math.max(valA, valB) + ' is more than ' + Math.min(valA, valB)}, ${actualAnswer} is ${comparisonAdj}.\\n3. Difference = ${Math.max(valA, valB)} - ${Math.min(valA, valB)} = ${diff} ${unit}."""`;
        askText += " Show your working and find the difference.";
      }

      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${sysFinalAnswer}"""
hint: """Compare the numbers ${valA} and ${valB}. The one with the ${isShorterLighterLess ? 'smaller' : 'larger'} number is the ${comparisonAdj} one."""
solutionSteps: ${sysSolutionSteps}
`;
    }
  } else if (activeVariant.includes('identify')) {
    let items, unit, attribute, comparisonAdj;

    if (activeVariant === 'foundation_identify_longest_shortest') {
      unit = Math.random() > 0.5 ? 'cm' : 'm';
      const fetchedItems = getRealisticItems('length', unit, 4);
      items = fetchedItems.map(i => i.item);
      vals = fetchedItems.map(i => i.val);
      attribute = 'long';
      comparisonAdj = isShorterLighterLess ? 'shortest' : 'longest';
    } else {
      unit = Math.random() > 0.5 ? 'kg' : 'g';
      const fetchedItems = getRealisticItems('mass', unit, 4);
      items = fetchedItems.map(i => i.item);
      vals = fetchedItems.map(i => i.val);
      attribute = 'heavy';
      comparisonAdj = isShorterLighterLess ? 'lightest' : 'heaviest';
    }

    // Ensure all 4 values are distinct
    const distinctVals = Array.from(new Set(vals));
    while (distinctVals.length < 4) {
      const newVal = getRandomInt(10, 500);
      if (!distinctVals.includes(newVal)) distinctVals.push(newVal);
    }
    vals = distinctVals;

const structureText = `Object A is a ${items[0]} (${vals[0]} ${unit}). Object B is a ${items[1]} (${vals[1]} ${unit}). Object C is a ${items[2]} (${vals[2]} ${unit}). Object D is a ${items[3]} (${vals[3]} ${unit}). Which object is the ${comparisonAdj}?`;
    const shortText = `A: ${items[0]} (${vals[0]} ${unit}), B: ${items[1]} (${vals[1]} ${unit}), C: ${items[2]} (${vals[2]} ${unit}), D: ${items[3]} (${vals[3]} ${unit}). The ${comparisonAdj} object is:`;

    let askText = getQText(structureText, shortText);

    let targetVal = isShorterLighterLess ? Math.min(...vals) : Math.max(...vals);
    let targetIndex = vals.indexOf(targetVal);
    let expectedWinner = ['A', 'B', 'C', 'D'][targetIndex];
    const actualAnswer = `Object ${expectedWinner}`;

    if (isStructure) {
      const otherIndices = [0, 1, 2, 3].filter(i => i !== targetIndex);
      const other1 = otherIndices[0];
      const other2 = otherIndices[1];
      const objLetters = ['A', 'B', 'C', 'D'];

      const diff1 = Math.abs(targetVal - vals[other1]);
      const diff2 = Math.abs(targetVal - vals[other2]);

      const eq1 = `${Math.max(targetVal, vals[other1])} ${unit} - ${Math.min(targetVal, vals[other1])} ${unit} = ${diff1} ${unit}`;
      const eq2 = `${Math.max(targetVal, vals[other2])} ${unit} - ${Math.min(targetVal, vals[other2])} ${unit} = ${diff2} ${unit}`;

      const label0 = `The ${comparisonAdj} object:`;
      const label1 = `Difference with Object ${objLetters[other1]}:`;
      const label2 = `Difference with Object ${objLetters[other2]}:`;

      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        {"label": "${label0}", "expectedAnswer": "${actualAnswer}", "acceptedAnswers": ["${expectedWinner}"]},
        {"label": "${label1}", "expectedAnswer": "${diff1} ${unit}", "acceptedAnswers": ["${diff1}", "${eq1}"]},
        {"label": "${label2}", "expectedAnswer": "${diff2} ${unit}", "acceptedAnswers": ["${diff2}", "${eq2}"]}
      ]}`;

      askText += " Show your working and find the differences with Object " + objLetters[other1] + " and Object " + objLetters[other2] + ".";
    }

    if (isMCQ) {
      inputRequirementStr = `null`;
      let expectedWinnerName = items[targetIndex];
      const mcqAnswer = `${expectedWinnerName} (${targetVal} ${unit})`;
      const mcqAskText = `Which object is the ${comparisonAdj}?`;

      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!
DO NOT ADD ANY CONTEXT OR EXTRA SENTENCES to the questionText. It must ONLY contain the single question asked.

Use EXACTLY:
questionText: ["${mcqAskText}"]
finalAnswer: "${mcqAnswer}"
hint: "Look for the ${isShorterLighterLess ? 'smallest' : 'largest'} number among the measurements."
solutionSteps: ["1. Compare the measurements: ${vals[0]} ${unit}, ${vals[1]} ${unit}, ${vals[2]} ${unit}, and ${vals[3]} ${unit}.", "2. The ${isShorterLighterLess ? 'smallest' : 'largest'} is ${targetVal} ${unit}, so it is the ${comparisonAdj} one."]

Generate exactly 4 options:
- "${items[0]} (${vals[0]} ${unit})"
- "${items[1]} (${vals[1]} ${unit})"
- "${items[2]} (${vals[2]} ${unit})"
- "${items[3]} (${vals[3]} ${unit})"
The defectMap should map the incorrect options to "COMPARISON_ERROR".
`;
    } else {
      if (!isStructure) {
        inputRequirementStr = `{"inputType": "TEXT_INPUT"}`;
      }

      let sysFinalAnswer = actualAnswer;
      let sysSolutionSteps = `"""1. Compare the measurements: ${vals[0]} ${unit}, ${vals[1]} ${unit}, ${vals[2]} ${unit}, and ${vals[3]} ${unit}.\\n2. The ${isShorterLighterLess ? 'smallest' : 'largest'} is ${targetVal} ${unit}, so ${actualAnswer} is the ${comparisonAdj}."""`;

      if (isStructure) {
        const otherIndices = [0, 1, 2, 3].filter(i => i !== targetIndex);
        const objLetters = ['A', 'B', 'C', 'D'];
        const diff1 = Math.abs(targetVal - vals[otherIndices[0]]);
        const diff2 = Math.abs(targetVal - vals[otherIndices[1]]);

        sysFinalAnswer = `${actualAnswer}, ${diff1} ${unit}, ${diff2} ${unit}`;
        sysSolutionSteps = `"""1. Compare the measurements: ${vals[0]} ${unit}, ${vals[1]} ${unit}, ${vals[2]} ${unit}, and ${vals[3]} ${unit}.\\n2. The ${isShorterLighterLess ? 'smallest' : 'largest'} is ${targetVal} ${unit}, so ${actualAnswer} is the ${comparisonAdj}.\\n3. Difference with Object ${objLetters[otherIndices[0]]} = ${Math.max(targetVal, vals[otherIndices[0]])} - ${Math.min(targetVal, vals[otherIndices[0]])} = ${diff1} ${unit}.\\n4. Difference with Object ${objLetters[otherIndices[1]]} = ${Math.max(targetVal, vals[otherIndices[1]])} - ${Math.min(targetVal, vals[otherIndices[1]])} = ${diff2} ${unit}."""`;
      }

      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${sysFinalAnswer}"""
hint: """Look for the ${isShorterLighterLess ? 'smallest' : 'largest'} number among the three measurements."""
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  const aiPrompt = systemPrompt + "\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
