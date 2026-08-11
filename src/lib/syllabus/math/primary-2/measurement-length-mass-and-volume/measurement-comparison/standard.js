import { getMeasurementAppropriateUnits, getRandomNames } from '@/lib/utils/variable-bank';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, getQText) => {
  let visualEngineStr = `{
    "componentToRender": "NONE",
    "componentData": { "hideVisual": true }
  }`;

  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const isCrossUnit = Math.random() > 0.5;

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
    while (items.length < count) {
      items.push({ item: `item ${items.length}`, val: getRandomInt(10, 50) });
    }
    return items;
  };

  if (activeVariant.includes('difference')) {
    let objA, objB, valA, valB, unitA, unitB, baseUnit, factor;
    let comparisonAdj;
    let baseValA, baseValB;
    const isShorterLighterLess = Math.random() > 0.5;

    if (activeVariant === 'standard_difference_lengths') {
      if (isCrossUnit) {
        unitA = 'cm';
        unitB = 'm';
        baseUnit = 'cm';
        factor = 100;
        objA = getRealisticItems('length', 'cm', 1)[0].item;
        objB = getRealisticItems('length', 'm', 1)[0].item;
        baseValB = getRandomInt(1, 3);
        valB = baseValB;
        baseValA = (baseValB * 100) + getRandomInt(-30, 30);
        while (baseValA === baseValB * 100) baseValA += 10;
        valA = baseValA;
      } else {
        unitA = Math.random() > 0.5 ? 'cm' : 'm';
        unitB = unitA;
        baseUnit = unitA;
        factor = 1;
        const items = getRealisticItems('length', unitA, 2);
        objA = items[0].item;
        objB = items[1].item;
        valB = items[1].val;
        valA = items[0].val;
        if (valA === valB) valA += getRandomInt(5, 10);
        baseValA = valA;
        baseValB = valB;
      }
      comparisonAdj = isShorterLighterLess ? 'shorter' : 'longer';
    } else if (activeVariant === 'standard_difference_masses') {
      if (isCrossUnit) {
        objA = getRealisticItems('mass', 'g', 1)[0].item;
        objB = getRealisticItems('mass', 'kg', 1)[0].item;
        unitA = 'g';
        unitB = 'kg';
        baseUnit = 'g';
        factor = 1000;
        baseValB = getRandomInt(1, 3);
        valB = baseValB;
        baseValA = (baseValB * 1000) + getRandomInt(-200, 200);
        while (baseValA === baseValB * 1000) baseValA += 50;
        valA = baseValA;
      } else {
        unitA = Math.random() > 0.5 ? 'kg' : 'g';
        unitB = unitA;
        baseUnit = unitA;
        factor = 1;
        const items = getRealisticItems('mass', unitA, 2);
        objA = items[0].item;
        objB = items[1].item;
        valB = items[1].val;
        valA = items[0].val;
        if (valA === valB) valA += getRandomInt(5, 10);
        baseValA = valA;
        baseValB = valB;
      }
      comparisonAdj = isShorterLighterLess ? 'lighter' : 'heavier';
    } else if (activeVariant === 'standard_difference_volumes') {
      if (isCrossUnit) {
        unitA = 'ml';
        unitB = 'l';
        baseUnit = 'ml';
        factor = 1000;
        objA = getRealisticItems('volume', 'ml', 1)[0].item;
        objB = getRealisticItems('volume', 'l', 1)[0].item;
        baseValB = getRandomInt(1, 3);
        valB = baseValB;
        baseValA = (baseValB * 1000) + getRandomInt(-200, 200);
        while (baseValA === baseValB * 1000) baseValA += 50;
        valA = baseValA;
      } else {
        unitA = Math.random() > 0.5 ? 'l' : 'ml';
        unitB = unitA;
        baseUnit = unitA;
        factor = 1;
        const items = getRealisticItems('volume', unitA, 2);
        objA = items[0].item;
        objB = items[1].item;
        valB = items[1].val;
        valA = items[0].val;
        if (valA === valB) valA += getRandomInt(5, 10);
        baseValA = valA;
        baseValB = valB;
      }
      comparisonAdj = isShorterLighterLess ? 'less' : 'more';
    }

    // Determine values for comparison
    const compareValB = baseValB * factor;
    const diff = Math.abs(baseValA - compareValB);

    // Randomize A/B display order
    const displayAFirst = Math.random() > 0.5;
    const firstObj = displayAFirst ? objA : objB;
    const firstVal = displayAFirst ? valA : valB;
    const firstUnit = displayAFirst ? unitA : unitB;
    const firstBaseVal = displayAFirst ? baseValA : compareValB;
    
    const secondObj = displayAFirst ? objB : objA;
    const secondVal = displayAFirst ? valB : valA;
    const secondUnit = displayAFirst ? unitB : unitA;
    const secondBaseVal = displayAFirst ? compareValB : baseValA;

    // Pick a subject for the question
    // "How much longer is A than B?"
    const askFirst = Math.random() > 0.5;
    const subjectBaseVal = askFirst ? firstBaseVal : secondBaseVal;
    const targetBaseVal = askFirst ? secondBaseVal : firstBaseVal;

    // Fix the adjective if they asked a specific way that violates truth
    // If A is 150cm and B is 1m (100cm). A > B. If subject is A, A is longer.
    const isSubjectLarger = subjectBaseVal > targetBaseVal;
    const finalAdj = isSubjectLarger ?
      (activeVariant === 'standard_difference_lengths' ? 'longer' : activeVariant === 'standard_difference_masses' ? 'heavier' : 'more') :
      (activeVariant === 'standard_difference_lengths' ? 'shorter' : activeVariant === 'standard_difference_masses' ? 'lighter' : 'less');

    let structureText, shortText, actualAnswer, equation;

    if (activeVariant === 'standard_difference_volumes') {
      structureText = `Container A is a ${firstObj} that holds ${firstVal} ${firstUnit} of water. Container B is a ${secondObj} that holds ${secondVal} ${secondUnit} of water. How much ${finalAdj} water does Container ${askFirst ? 'A' : 'B'} hold than Container ${askFirst ? 'B' : 'A'}?`;
      shortText = `A: ${firstObj} (${firstVal} ${firstUnit}), B: ${secondObj} (${secondVal} ${secondUnit}). Container ${askFirst ? 'A' : 'B'} holds ___ ${finalAdj} water than Container ${askFirst ? 'B' : 'A'}.`;
    } else {
      structureText = `Object A is a ${firstObj} that is ${firstVal} ${firstUnit}. Object B is a ${secondObj} that is ${secondVal} ${secondUnit}. How much ${finalAdj} is Object ${askFirst ? 'A' : 'B'} than Object ${askFirst ? 'B' : 'A'}?`;
      shortText = `A: ${firstObj} (${firstVal} ${firstUnit}), B: ${secondObj} (${secondVal} ${secondUnit}). Object ${askFirst ? 'A' : 'B'} is ___ ${finalAdj} than Object ${askFirst ? 'B' : 'A'}.`;
    }

    actualAnswer = `${diff} ${baseUnit}`;
    equation = `${Math.max(baseValA, compareValB)} ${baseUnit} - ${Math.min(baseValA, compareValB)} ${baseUnit} = ${actualAnswer}`;

    const askText = getQText(structureText, shortText);

    if (isStructure) {
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        {"label": "Equation to find difference:", "expectedAnswer": "${equation}", "acceptedAnswers": []},
        {"label": "Difference:", "expectedAnswer": "${actualAnswer}", "acceptedAnswers": ["${diff}"]}
      ]}`;
    }

    const conversionStep = isCrossUnit ? `\\n1. Convert to the same unit: ${valB} ${unitB} = ${compareValB} ${baseUnit}.` : "";
    const stepOffset = isCrossUnit ? 1 : 0;

    if (isMCQ) {
      inputRequirementStr = `null`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT JSON provided below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY these JSON values:
"questionText": ${JSON.stringify(askText.split(/(?<=\.|\?) /).map(s => s.trim()))},
"finalAnswer": ${JSON.stringify(actualAnswer)},
"hint": ${JSON.stringify(isCrossUnit ? 'First, convert both measurements to ' + baseUnit + '. Then, find the difference by subtracting the smaller number from the larger number.' : 'Find the difference by subtracting the smaller number from the larger number.')},
"solutionSteps": ${JSON.stringify(
  (conversionStep ? conversionStep + '\\n' : '') +
  `${stepOffset + 1}. Subtract the smaller measurement from the larger measurement.\\n` +
  `${stepOffset + 2}. ${Math.max(baseValA, compareValB)} - ${Math.min(baseValA, compareValB)} = ${diff}.\\n` +
  `${stepOffset + 3}. It is ${diff} ${baseUnit} ${finalAdj}.`
).replace(/\\\\n/g, '\\n')}

Generate options around ${diff} ${baseUnit}.
The defectMap should map incorrect options to "CALCULATION_ERROR".
`;
    } else {
      if (!isStructure) inputRequirementStr = `{"inputType": "TEXT_INPUT"}`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT JSON provided below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY these JSON values:
"questionText": ${JSON.stringify(askText.split(/(?<=\.|\?) /).map(s => s.trim()))},
"finalAnswer": ${JSON.stringify(actualAnswer)},
"hint": ${JSON.stringify(isCrossUnit ? 'First, convert both measurements to ' + baseUnit + '. Then, find the difference by subtracting the smaller number from the larger number.' : 'Find the difference by subtracting the smaller number from the larger number.')},
"solutionSteps": ${JSON.stringify(
  (conversionStep ? conversionStep + '\\n' : '') +
  `${stepOffset + 1}. Subtract the smaller measurement from the larger measurement.\\n` +
  `${stepOffset + 2}. ${Math.max(baseValA, compareValB)} - ${Math.min(baseValA, compareValB)} = ${diff}.\\n` +
  `${stepOffset + 3}. It is ${diff} ${baseUnit} ${finalAdj}.`
).replace(/\\\\n/g, '\\n')}
`;
    }
  } else if (activeVariant.includes('order')) {
    // Ordering 3 items
    const isAscending = Math.random() > 0.5;
    let items, unit, baseUnit, factor, attribute, orderAdj;

    if (activeVariant === 'standard_order_lengths') {
      if (isCrossUnit) {
        unit = 'cm/m';
        baseUnit = 'cm';
        factor = 100;
        const cmItems = getRealisticItems('length', 'cm', 2).map(i => i.item);
        const mItems = getRealisticItems('length', 'm', 1).map(i => i.item);
        items = [...cmItems, ...mItems];
      } else {
        unit = Math.random() > 0.5 ? 'cm' : 'm';
        baseUnit = unit;
        factor = 1;
        items = getRealisticItems('length', unit, 3).map(i => i.item);
      }
      attribute = 'long';
      orderAdj = isAscending ? 'shortest to longest' : 'longest to shortest';
    } else {
      if (isCrossUnit) {
        const gItems = getRealisticItems('mass', 'g', 2).map(i => i.item);
        const kgItems = getRealisticItems('mass', 'kg', 1).map(i => i.item);
        items = [...gItems, ...kgItems];
        unit = 'g/kg';
        baseUnit = 'g';
        factor = 1000;
      } else {
        const isKg = Math.random() > 0.5;
        unit = isKg ? 'kg' : 'g';
        items = getRealisticItems('mass', unit, 3).map(i => i.item);
        baseUnit = unit;
        factor = 1;
      }
      attribute = 'heavy';
      orderAdj = isAscending ? 'lightest to heaviest' : 'heaviest to lightest';
    }

    let vals = [];
    while (vals.length < 3) {
      let v = (baseUnit === 'kg' || baseUnit === 'm') ? getRandomInt(2, 20) : getRandomInt(10, 90) * 10;
      if (!vals.includes(v)) vals.push(v);
    }

    let valA = vals[0];
    let valB = vals[1];
    let valC = vals[2];

    let dispA = valA + ' ' + baseUnit;
    let dispB = valB + ' ' + baseUnit;
    let dispC = valC + ' ' + baseUnit;

    if (isCrossUnit) {
      // make one of them a cross-unit
      // E.g. valB is a multiple of factor
      valB = Math.floor(valB / factor) || 1;
      let trueValB = valB * factor;
      while (trueValB === valA || trueValB === valC) {
        valB++;
        trueValB = valB * factor;
      }
      vals[1] = trueValB;
      dispB = valB + ' ' + (baseUnit === 'cm' ? 'm' : 'kg');
    }

    const structureText = `Object A is a ${items[0]} (${dispA}). Object B is a ${items[1]} (${dispB}). Object C is a ${items[2]} (${dispC}). Order the objects from ${orderAdj}.`;
    const shortText = `A: ${items[0]} (${dispA}), B: ${items[1]} (${dispB}), C: ${items[2]} (${dispC}). Order from ${orderAdj}:`;

    const askText = getQText(structureText, shortText);

    let sortedObjects = [
      { id: 'A', val: vals[0], disp: dispA },
      { id: 'B', val: vals[1], disp: dispB },
      { id: 'C', val: vals[2], disp: dispC }
    ];

    sortedObjects.sort((a, b) => isAscending ? a.val - b.val : b.val - a.val);

    const actualAnswer = sortedObjects.map(o => o.id).join(', ');

    if (isStructure) {
      const label1 = isAscending ? (attribute === 'long' ? 'Shortest' : 'Lightest') : (attribute === 'long' ? 'Longest' : 'Heaviest');
      const label3 = isAscending ? (attribute === 'long' ? 'Longest' : 'Heaviest') : (attribute === 'long' ? 'Shortest' : 'Lightest');
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        {"label": "1st (${label1}):", "expectedAnswer": "${sortedObjects[0].id}", "acceptedAnswers": ["Object ${sortedObjects[0].id}"]},
        {"label": "2nd:", "expectedAnswer": "${sortedObjects[1].id}", "acceptedAnswers": ["Object ${sortedObjects[1].id}"]},
        {"label": "3rd (${label3}):", "expectedAnswer": "${sortedObjects[2].id}", "acceptedAnswers": ["Object ${sortedObjects[2].id}"]}
      ]}`;
    }

    const conversionStep = isCrossUnit ? `\\n1. Convert Object B to ${baseUnit}: ${dispB} = ${vals[1]} ${baseUnit}.` : "";
    const stepOffset = isCrossUnit ? 1 : 0;

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
finalAnswer: """${actualAnswer}"""
hint: """${isCrossUnit ? 'Convert all measurements to ' + baseUnit + ' first. Then, c' : 'C'}ompare the numbers and arrange them from ${orderAdj}."""
solutionSteps: """${conversionStep ? conversionStep : ''}\\n${stepOffset + 1}. The measurements are ${vals[0]} ${baseUnit}, ${vals[1]} ${baseUnit}, and ${vals[2]} ${baseUnit}.\\n${stepOffset + 2}. Ordered from ${orderAdj}, they are: ${sortedObjects.map(o => o.val + ' ' + baseUnit).join(', ')}.\\n${stepOffset + 3}. So the objects are ${actualAnswer}."""

Generate options for different order permutations of A, B, C (e.g. "A, C, B").
The defectMap should map incorrect options to "ORDERING_ERROR".
`;
    } else {
      if (!isStructure) inputRequirementStr = `{"inputType": "TEXT_INPUT"}`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${actualAnswer}"""
hint: """${isCrossUnit ? 'Convert all measurements to ' + baseUnit + ' first. Then, c' : 'C'}ompare the numbers and arrange them from ${orderAdj}."""
solutionSteps: """${conversionStep ? conversionStep : ''}\\n${stepOffset + 1}. The measurements are ${vals[0]} ${baseUnit}, ${vals[1]} ${baseUnit}, and ${vals[2]} ${baseUnit}.\\n${stepOffset + 2}. Ordered from ${orderAdj}, they are: ${sortedObjects.map(o => o.val + ' ' + baseUnit).join(', ')}.\\n${stepOffset + 3}. So the objects are ${actualAnswer}."""
`;
    }
  }

  const aiPrompt = systemPrompt + "\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
