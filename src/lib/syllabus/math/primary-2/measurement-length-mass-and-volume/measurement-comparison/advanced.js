import { getMeasurementAppropriateUnits, getRandomNames } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, getQText) => {
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

  let objA, objB, valA, diff, unitA, unitB, baseUnit, factor;
  let attribute, comparisonAdj;
  const isShorterLighterLess = Math.random() > 0.5;
  const isFindTotal = activeVariant.includes('total_from_relative');

  if (activeVariant.includes('length')) {
    if (isCrossUnit) {
      unitA = 'm';
      unitB = 'cm';
      baseUnit = 'cm';
      factor = 100;
      objA = getRealisticItems('length', 'm', 1)[0].item;
      objB = getRealisticItems('length', 'cm', 1)[0].item;
      valA = getRandomInt(1, 3);
      diff = getRandomInt(10, 80);
    } else {
      unitA = Math.random() > 0.5 ? 'cm' : 'm';
      unitB = unitA;
      baseUnit = unitA;
      factor = 1;
      const items = getRealisticItems('length', unitA, 2);
      objA = items[0].item;
      objB = items[1].item;
      valA = items[0].val;
      diff = getRandomInt(2, 20);
    }
    comparisonAdj = isShorterLighterLess ? 'shorter' : 'longer';
  } else if (activeVariant.includes('mass')) {
    if (isCrossUnit) {
      objA = getRealisticItems('mass', 'kg', 1)[0].item;
      objB = getRealisticItems('mass', 'g', 1)[0].item;
      unitA = 'kg';
      unitB = 'g';
      baseUnit = 'g';
      factor = 1000;
      valA = getRandomInt(1, 3);
      diff = getRandomInt(100, 500);
    } else {
      const isKg = Math.random() > 0.5;
      unitA = isKg ? 'kg' : 'g';
      unitB = unitA;
      baseUnit = unitA;
      factor = 1;
      const items = getRealisticItems('mass', unitA, 2);
      objA = items[0].item;
      objB = items[1].item;
      valA = items[0].val;
      diff = isKg ? getRandomInt(2, 10) : getRandomInt(20, 200);
    }
    comparisonAdj = isShorterLighterLess ? 'lighter' : 'heavier';
  } else if (activeVariant.includes('volume')) {
    if (isCrossUnit) {
      unitA = 'l';
      unitB = 'ml';
      baseUnit = 'ml';
      factor = 1000;
      objA = getRealisticItems('volume', 'l', 1)[0].item;
      objB = getRealisticItems('volume', 'ml', 1)[0].item;
      valA = getRandomInt(1, 3);
      diff = getRandomInt(100, 500);
    } else {
      unitA = Math.random() > 0.5 ? 'l' : 'ml';
      unitB = unitA;
      baseUnit = unitA;
      factor = 1;
      const items = getRealisticItems('volume', unitA, 2);
      objA = items[0].item;
      objB = items[1].item;
      valA = items[0].val;
      diff = unitA === 'l' ? getRandomInt(2, 10) : getRandomInt(50, 300);
    }
    comparisonAdj = isShorterLighterLess ? 'less' : 'more';
  }

  const baseValA = valA * factor;

  // Make sure we don't end up with negative B
  if (isShorterLighterLess && diff >= baseValA) {
    diff = Math.max(1, baseValA - (isCrossUnit ? (factor === 100 ? 10 : 100) : 10)); // Ensure B > 0
  }

  const valB = isShorterLighterLess ? (baseValA - diff) : (baseValA + diff);
  const total = baseValA + valB;

  let structureText, shortText;

  if (activeVariant.includes('volume')) {
    structureText = `Container A is a ${objA} that holds ${valA} ${unitA} of water. Container B is a ${objB} that holds ${diff} ${unitB} ${comparisonAdj} water than Container A. What is the ${isFindTotal ? 'total volume of water in both containers' : 'volume of water in Container B'}?`;
    shortText = `A: ${objA} (${valA} ${unitA}). B holds ${diff} ${unitB} ${comparisonAdj} than A. ${isFindTotal ? 'Total volume' : 'Volume of B'}:`;
  } else {
    structureText = `Object A is a ${objA} that is ${valA} ${unitA}. Object B is a ${objB} that is ${diff} ${unitB} ${comparisonAdj} than Object A. What is the ${isFindTotal ? (activeVariant.includes('length') ? 'total length of both objects' : 'total mass of both objects') : (activeVariant.includes('length') ? 'length of Object B' : 'mass of Object B')}?`;
    shortText = `A: ${objA} (${valA} ${unitA}). B is ${diff} ${unitB} ${comparisonAdj} than A. ${isFindTotal ? 'Total' : 'Value of B'}:`;
  }

  const askText = getQText(structureText, shortText);
  const actualAnswer = `${isFindTotal ? total : valB} ${baseUnit}`;

  const conversionStep = isCrossUnit ? `\\n1. Convert Object A's measurement to ${baseUnit}: ${valA} ${unitA} = ${baseValA} ${baseUnit}.` : "";
  const stepOffset = isCrossUnit ? 1 : 0;

  const eq1 = isShorterLighterLess ? `${baseValA} ${baseUnit} - ${diff} ${baseUnit} = ${valB} ${baseUnit}` : `${baseValA} ${baseUnit} + ${diff} ${baseUnit} = ${valB} ${baseUnit}`;
  const eq2 = `${baseValA} ${baseUnit} + ${valB} ${baseUnit} = ${total} ${baseUnit}`;

  if (isStructure) {
    if (isFindTotal) {
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        {"label": "Equation for B:", "expectedAnswer": "${eq1}", "acceptedAnswers": []},
        {"label": "Value of B:", "expectedAnswer": "${valB} ${baseUnit}", "acceptedAnswers": ["${valB}"]},
        {"label": "Equation for Total:", "expectedAnswer": "${eq2}", "acceptedAnswers": []},
        {"label": "Total:", "expectedAnswer": "${actualAnswer}", "acceptedAnswers": ["${total}"]}
      ]}`;
    } else {
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        {"label": "Working equation:", "expectedAnswer": "${eq1}", "acceptedAnswers": []},
        {"label": "Value of B:", "expectedAnswer": "${actualAnswer}", "acceptedAnswers": ["${valB}"]}
      ]}`;
    }
  }

  const solutionStepsForB = `\\n${stepOffset + 1}. Find the value for B. Since B is ${comparisonAdj}, we ${isShorterLighterLess ? 'subtract' : 'add'}.\\n${stepOffset + 2}. ${baseValA} ${isShorterLighterLess ? '-' : '+'} ${diff} = ${valB}.\\n${stepOffset + 3}. B is ${valB} ${baseUnit}.`;
  const solutionStepsForTotal = isFindTotal ? `\\n${stepOffset + 4}. Find the total by adding A and B.\\n${stepOffset + 5}. ${baseValA} + ${valB} = ${total}.\\n${stepOffset + 6}. The total is ${total} ${baseUnit}.` : '';

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
hint: """${isCrossUnit ? 'First, convert both measurements to ' + baseUnit + '. ' : ''}First, find the value of B by ${isShorterLighterLess ? 'subtracting' : 'adding'}.${isFindTotal ? ' Then, add the values of A and B together.' : ''}"""
solutionSteps: """${conversionStep ? conversionStep : ''}${solutionStepsForB}${solutionStepsForTotal}"""

Generate options around ${isFindTotal ? total : valB} ${baseUnit}.
The defectMap should map incorrect options to "CALCULATION_ERROR".
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
hint: """${isCrossUnit ? 'First, convert both measurements to ' + baseUnit + '. ' : ''}First, find the value of B by ${isShorterLighterLess ? 'subtracting' : 'adding'}.${isFindTotal ? ' Then, add the values of A and B together.' : ''}"""
solutionSteps: """${conversionStep ? conversionStep : ''}${solutionStepsForB}${solutionStepsForTotal}"""
`;
  }

  const aiPrompt = systemPrompt + "\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
