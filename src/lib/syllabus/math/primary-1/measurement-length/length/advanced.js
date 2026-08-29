import { getRandomContext } from '@/lib/utils/localization';

import { getRandomNames, getRandomLengthItems, LENGTH_ITEMS_POOL } from '@/lib/utils/variable-bank';
const units = [{ name: "cm", icon: "ruler.svg" }];
const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
const capitalize = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);

export const advancedVariants = {
  advanced_indirect_comparison: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const shuffledItems = getRandomLengthItems(5).map(capitalize);
    const item1 = shuffledItems[0];
    const item2 = shuffledItems[1];
    const item3 = shuffledItems[2];
    const lenA = Math.floor(Math.random() * 5) + 6;
    const lenB = Math.floor(Math.random() * 4) + 4;
    const lenC = Math.floor(Math.random() * 3) + 2;
    const selectedUnit = units[Math.floor(Math.random() * units.length)];

    const componentData = { items: [{ label: item1, length: lenA }, { label: item2, length: lenB }, { label: item3, length: lenC }].sort(() => Math.random() - 0.5), unitIcon: selectedUnit.icon };
    const findShortest = Math.random() > 0.5;
    const answer = findShortest ? item3 : item1;
    const distractors = LENGTH_ITEMS_POOL.map(capitalize).filter(i => ![item1, item2, item3].includes(i)).slice(0, 1);

    const questionTextTemplate = getQText(`Object ${item1} is longer than ${item2}. Object ${item2} is longer than ${item3}. Which object is the ${findShortest ? 'shortest' : 'longest'}?`, `${item1} is longer than ${item2}. ${item2} is longer than ${item3}. ${findShortest ? 'Shortest' : 'Longest'} object = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `CRITICAL INSTRUCTION: You MUST use the exact mathematical sentences provided in the "questionText" template! You are ONLY permitted to replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g. "${getRandomNames(1)} has some stationery."). DO NOT paraphrase, reword, or add ANY extra questions to the end (e.g. DO NOT ask "How many altogether?"). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template!`;

    let options = [answer, ...[item1, item2, item3, ...distractors].filter(i => i !== answer)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Draw a simple line for each object using the clues to help you see the order!`, `Use transitive logic.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Comparing the sequence dimensions: ${item1} (${lenA} units) is longer than ${item2} (${lenB} units) which is longer than ${item3} (${lenC} units). The target is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "indirect_comparison", hideVisual: false }
    };
  },

  advanced_misaligned_start: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const targetObj = capitalize(getRandomLengthItems(1));
    const startOffset = Math.floor(Math.random() * 3) + 2; 
    const trueLength = Math.floor(Math.random() * 4) + 4;  
    const endPoint = startOffset + trueLength;
    const selectedUnit = units[Math.floor(Math.random() * units.length)];

    const componentData = { items: [{ label: targetObj, length: trueLength, startOffset }], showFullRuler: true, unitIcon: selectedUnit.icon };
    const requireUnit = Math.random() > 0.5;
    const answer = requireUnit ? `${trueLength} ${selectedUnit.name}` : String(trueLength);

    const questionTextTemplate = requireUnit
      ? getQText(`The ${targetObj} starts at the ${startOffset} unit line and ends at the ${endPoint} unit line. What is its true length?`, `Length of ${targetObj} = ?`)
      : getQText(`The ${targetObj} starts at the ${startOffset} unit line and ends at the ${endPoint} unit line. What is its true length in ${selectedUnit.name}?`, `Length of ${targetObj} from ${startOffset} to ${endPoint} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `CRITICAL INSTRUCTION: You MUST use the exact mathematical sentences provided in the "questionText" template! You are ONLY permitted to replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g. "${getRandomNames(1)} has some stationery."). DO NOT paraphrase, reword, or add ANY extra questions to the end (e.g. DO NOT ask "How many altogether?"). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template!`;

    let options = requireUnit
      ? [answer, `${endPoint} ${selectedUnit.name}`, `${startOffset} ${selectedUnit.name}`, `${trueLength + 1} ${selectedUnit.name}`]
      : [answer, String(endPoint), String(startOffset), String(trueLength + 1)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Count the units between the start mark and the end mark carefully!`, `Subtract start from end.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Subtract the starting line mark from the ending line mark: ${endPoint} - ${startOffset} = ${trueLength} ${selectedUnit.name}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "misaligned_start", hideVisual: false }
    };
  },

  advanced_unit_size_inverse: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const targetObj = capitalize(getRandomLengthItems(1));
    const baseCount = Math.floor(Math.random() * 3) + 5; 
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const componentData = { items: [{ label: targetObj, length: baseCount }], unitIcon: selectedUnit.icon };
    const answer = 'Fewer';

    const questionTextTemplate = getQText(`Measuring a ${targetObj} takes ${baseCount} small ${selectedUnit.name}. If we switch to a longer unit, will the total count needed be more, fewer, or the same?`, `If unit is longer, will count be More, Fewer, or Same?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `CRITICAL INSTRUCTION: You MUST use the exact mathematical sentences provided in the "questionText" template! You are ONLY permitted to replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g. "${getRandomNames(1)} has some stationery."). DO NOT paraphrase, reword, or add ANY extra questions to the end (e.g. DO NOT ask "How many altogether?"). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template!`;

    let options = [answer, 'More', 'The same', 'Cannot tell'];
    if (!options.includes(answer)) { options[0] = answer; }

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Think! If a unit is big, will you need many or just a few to measure the object?`, `Larger units cover more space.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Larger units cover more space individually, meaning fewer of them are required to measure the exact same object length.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "unit_size_inverse", hideVisual: false }
    };
  },

  advanced_combined_total: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const shuffledItems = getRandomLengthItems(5).map(capitalize);
    const lenA = Math.floor(Math.random() * 3) + 4;
    const lenB = Math.floor(Math.random() * 3) + 3;
    const combinedTotal = lenA + lenB;
    const selectedUnit = units[Math.floor(Math.random() * units.length)];

    const componentData = { items: [{ label: shuffledItems[0], length: lenA }, { label: shuffledItems[1], length: lenB }], unitIcon: selectedUnit.icon };
    const answer = String(combinedTotal);

    const questionTextTemplate = getQText(`If the ${shuffledItems[0].toLowerCase()} and the ${shuffledItems[1].toLowerCase()} are placed end-to-end, what is their combined total length in ${selectedUnit.name}?`, `Total length of ${shuffledItems[0].toLowerCase()} and ${shuffledItems[1].toLowerCase()} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `CRITICAL INSTRUCTION: You MUST use the exact mathematical sentences provided in the "questionText" template! You are ONLY permitted to replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g. "${getRandomNames(1)} has some stationery."). DO NOT paraphrase, reword, or add ANY extra questions to the end (e.g. DO NOT ask "How many altogether?"). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template!`;

    let options = [answer, String(combinedTotal - 1), String(combinedTotal + 2), String(lenA)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Add the number of units for the first object to the number of units for the second object!`, `Add both lengths.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Add both component item metrics together: ${lenA} + ${lenB} = ${combinedTotal} ${selectedUnit.name}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "combined_total", hideVisual: false }
    };
  },

  advanced_overlap_deduction: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const shuffledItems = getRandomLengthItems(5).map(capitalize);
    const lenA = Math.floor(Math.random() * 4) + 6;
    const lenB = Math.floor(Math.random() * 3) + 3;
    const overlap = Math.floor(Math.random() * 2) + 2; 
    const visibleTotal = lenA + lenB - overlap;
    const selectedUnit = units[Math.floor(Math.random() * units.length)];

    const componentData = { 
      items: [
        { label: shuffledItems[0], length: lenA, startOffset: 0 }, 
        { label: shuffledItems[1], length: lenB, startOffset: lenA - overlap }
      ], 
      unitIcon: selectedUnit.icon,
      showFullRuler: true
    };
    const answer = String(overlap);

    const questionTextTemplate = getQText(`A ${shuffledItems[0].toLowerCase()} is ${lenA} ${selectedUnit.name} long and a ${shuffledItems[1].toLowerCase()} is ${lenB} ${selectedUnit.name} long. They overlap when joined. If the total combined length is ${visibleTotal} ${selectedUnit.name}, how long is the overlapping section?`, `${shuffledItems[0]} = ${lenA}. ${shuffledItems[1]} = ${lenB}. Combined length = ${visibleTotal}. Overlap = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `CRITICAL INSTRUCTION: You MUST use the exact mathematical sentences provided in the "questionText" template! You are ONLY permitted to replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g. "${getRandomNames(1)} has some stationery."). DO NOT paraphrase, reword, or add ANY extra questions to the end (e.g. DO NOT ask "How many altogether?"). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template!`;

    let options = [answer, String(overlap + 1), String(overlap - 1), '4'];
    if (!options.includes(answer)) { options[0] = answer; }

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Try adding the two lengths together and see how much bigger that is than the total shown!`, `Subtract visible from sum.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Sum individual lengths (${lenA} + ${lenB} = ${lenA + lenB}) then subtract total visible covered length (${lenA + lenB} - ${visibleTotal} = ${overlap} units).`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "overlap_deduction", hideVisual: false }
    };
  },

  advanced_multi_step_word_problems: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const cuttableItems = ["ribbon", "string", "rope", "yarn", "paper strip", "wire"];
    const targetObj = capitalize(cuttableItems[Math.floor(Math.random() * cuttableItems.length)]);
    const baseLen = Math.floor(Math.random() * 6) + 8;
    const subtractAmt = Math.floor(Math.random() * 4) + 2;
    const additionAmt = Math.floor(Math.random() * 4) + 2;
    const currentNetLength = baseLen - subtractAmt + additionAmt;
    const selectedUnit = units[Math.floor(Math.random() * units.length)];

    const componentData = { items: [{ label: targetObj, length: currentNetLength }], unitIcon: selectedUnit.icon };
    const answer = String(currentNetLength);

    const questionTextTemplate = getQText(`A ${targetObj.toLowerCase()} was originally ${baseLen} ${selectedUnit.name} long. ${subtractAmt} ${selectedUnit.name} were cut off, and then an extension piece of ${additionAmt} ${selectedUnit.name} was added. How long is the ${targetObj.toLowerCase()} now?`, `Original length = ${baseLen}. Cut off = ${subtractAmt}. Added = ${additionAmt}. Net length = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `CRITICAL INSTRUCTION: You MUST use the exact mathematical sentences provided in the "questionText" template! You are ONLY permitted to replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g. "${getRandomNames(1)} has some stationery."). DO NOT paraphrase, reword, or add ANY extra questions to the end (e.g. DO NOT ask "How many altogether?"). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template!`;

    let options = [answer, String(baseLen), String(baseLen - subtractAmt), String(currentNetLength - 2)];
    if (!options.includes(answer)) { options[0] = answer; }

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`First find out the length after cutting, then add the new piece!`, `Subtract then add.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Execute multi-part calculations: First subtract cut segment (${baseLen} - ${subtractAmt} = ${baseLen - subtractAmt}), then aggregate extension (${baseLen - subtractAmt} + ${additionAmt} = ${currentNetLength} ${selectedUnit.name}).`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "multi_step_word", hideVisual: true }
    };
  },

  advanced_part_whole_missing: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const shuffledItems = getRandomLengthItems(5).map(capitalize);
    const completeWhole = Math.floor(Math.random() * 5) + 10;
    const partA = Math.floor(Math.random() * 3) + 4; 
    const partB = completeWhole - partA;
    const selectedUnit = units[Math.floor(Math.random() * units.length)];

    const item1 = shuffledItems[0].toLowerCase();
    const item2 = shuffledItems[1].toLowerCase();

    const componentData = { items: [{ label: `Total (Combined)`, length: completeWhole }, { label: shuffledItems[0], length: partA }], unitIcon: selectedUnit.icon };
    const requireUnit = Math.random() > 0.5;
    const answer = requireUnit ? `${partB} ${selectedUnit.name}` : String(partB);

    const questionTextTemplate = requireUnit
      ? getQText(`The total combined length of a ${item1} and a ${item2} is ${completeWhole} ${selectedUnit.name}. If the ${item1} measures ${partA} ${selectedUnit.name}, what is the length of the ${item2}?`, `Total length = ${completeWhole}. One part = ${partA}. Missing part = ?`)
      : getQText(`The total combined length of a ${item1} and a ${item2} is ${completeWhole} ${selectedUnit.name}. If the ${item1} measures ${partA} ${selectedUnit.name}, how many ${selectedUnit.name} long is the ${item2}?`, `Total length = ${completeWhole}. One part = ${partA}. Missing part in ${selectedUnit.name} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `CRITICAL INSTRUCTION: You MUST use the exact mathematical sentences provided in the "questionText" template! You are ONLY permitted to replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g. "${getRandomNames(1)} has some stationery."). DO NOT paraphrase, reword, or add ANY extra questions to the end (e.g. DO NOT ask "How many altogether?"). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template!`;

    let options = requireUnit
      ? [answer, `${partB + 2} ${selectedUnit.name}`, `${partB - 1} ${selectedUnit.name}`, `${partA} ${selectedUnit.name}`]
      : [answer, String(partB + 2), String(partB - 1), String(partA)];
    if (!options.includes(answer)) { options[0] = answer; }

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Take away the units we know from the total length to find the missing part!`, `Subtract known part from whole.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Isolate missing compound structural component: Total (${completeWhole}) - Given Part (${partA}) = ${partB} ${selectedUnit.name}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "part_whole_missing", hideVisual: true }
    };
  },

  advanced_excess_comparison: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const shuffledItems = getRandomLengthItems(5).map(capitalize);
    const currentLength = Math.floor(Math.random() * 3) + 4; 
    const targetThreshold = Math.floor(Math.random() * 4) + 8;
    const missingDeficit = targetThreshold - currentLength;
    const selectedUnit = units[Math.floor(Math.random() * units.length)];

    const componentData = { items: [{ label: shuffledItems[0], length: currentLength }, { label: "Target Marker", length: targetThreshold }], unitIcon: selectedUnit.icon };
    const answer = String(missingDeficit);

    const questionTextTemplate = getQText(`The ${shuffledItems[0].toLowerCase()} is currently ${currentLength} ${selectedUnit.name} long. How many more ${selectedUnit.name} must be added to make it exactly ${targetThreshold} ${selectedUnit.name} long?`, `Missing units to reach ${targetThreshold} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `CRITICAL INSTRUCTION: You MUST use the exact mathematical sentences provided in the "questionText" template! You are ONLY permitted to replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g. "${getRandomNames(1)} has some stationery."). DO NOT paraphrase, reword, or add ANY extra questions to the end (e.g. DO NOT ask "How many altogether?"). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template!`;

    let options = [answer, String(missingDeficit + 1), String(currentLength), String(targetThreshold)];
    if (!options.includes(answer)) { options[0] = answer; }

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Count how many more units you need to reach the target line!`, `Subtract current from target.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Calculate the space gap delta to hit the benchmark: ${targetThreshold} - ${currentLength} = ${missingDeficit} ${selectedUnit.name} required.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "excess_comparison", hideVisual: false }
    };
  },

  advanced_perimeter_units: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const targetShape = "Shape";
    const numSides = Math.floor(Math.random() * 3) + 2; 
    const sides = [];
    for(let i=0; i<numSides; i++) {
      sides.push(Math.floor(Math.random() * 3) + 2); 
    }
    const cumulativePerimeter = sides.reduce((a, b) => a + b, 0);
    const selectedUnit = units[Math.floor(Math.random() * units.length)];

    const componentData = { items: [{ label: targetShape, length: cumulativePerimeter }], isPerimeter: true, sides: sides, unitIcon: selectedUnit.icon };
    const sidesText = sides.length === 2 ? `${sides[0]} and ${sides[1]}` : sides.slice(0, -1).join(', ') + ', and ' + sides[sides.length - 1];
    const requireUnit = Math.random() > 0.5;
    const answer = requireUnit ? `${cumulativePerimeter} ${selectedUnit.name}` : String(cumulativePerimeter);

    const questionTextTemplate = requireUnit
      ? getQText(`Find the total length around this shape. The sides are ${sidesText} ${selectedUnit.name} long.`, `Total length of sides ${sidesText} = ?`)
      : getQText(`How many ${selectedUnit.name} is the total length around this shape? The sides are ${sidesText} ${selectedUnit.name} long.`, `Total length of sides ${sidesText} in ${selectedUnit.name} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary like "cumulative". Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student (e.g., "${getRandomNames(1)} drew a shape with ${numSides} sides."). DO NOT name specific closed polygons like 'triangle' or 'square' because the rendering is an abstract path. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = requireUnit
      ? [answer, `${cumulativePerimeter - 1} ${selectedUnit.name}`, `${cumulativePerimeter + 2} ${selectedUnit.name}`, `12 ${selectedUnit.name}`]
      : [answer, String(cumulativePerimeter - 1), String(cumulativePerimeter + 2), '12'];
    if (!options.includes(answer)) { options[0] = answer; }

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Trace your finger around the outside edges and count every unit!`, `Add all sides.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Add all the sides together: ${sides.join(' + ')} = ${cumulativePerimeter} ${selectedUnit.name}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "perimeter_units", hideVisual: false }
    };
  },

  advanced_indirect_difference: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const lengthA = Math.floor(Math.random() * 4) + 6; 
    const difference = Math.floor(Math.random() * 3) + 2; 
    const isShorter = Math.random() > 0.5;
    const lengthB = isShorter ? (lengthA - difference) : (lengthA + difference);
    const baseName = capitalize(getRandomLengthItems(1));
    const item1 = `${baseName} A`;
    const item2 = `${baseName} B`;
    const selectedUnit = units[Math.floor(Math.random() * units.length)];

    const componentData = { items: [{ label: item1, length: lengthA }, { label: item2, length: lengthB }], unitIcon: selectedUnit.icon };
    const requireUnit = Math.random() > 0.5;
    const answer = requireUnit ? `${lengthB} ${selectedUnit.name}` : String(lengthB);

    const questionTextTemplate = requireUnit
      ? getQText(`${item1} is ${lengthA} ${selectedUnit.name} long. ${item2} is ${difference} ${selectedUnit.name} ${isShorter ? 'shorter' : 'longer'} than ${item1}. What is the length of ${item2}?`, `Length of ${item2} = ?`)
      : getQText(`${item1} is ${lengthA} ${selectedUnit.name} long. ${item2} is ${difference} ${selectedUnit.name} ${isShorter ? 'shorter' : 'longer'} than ${item1}. How many ${selectedUnit.name} long is ${item2}?`, `Length of ${item2} in ${selectedUnit.name} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `CRITICAL INSTRUCTION: You MUST use the exact mathematical sentences provided in the "questionText" template! You are ONLY permitted to replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g. "${getRandomNames(1)} has some stationery."). DO NOT paraphrase, reword, or add ANY extra questions to the end (e.g. DO NOT ask "How many altogether?"). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template!`;

    let options = requireUnit
      ? [answer, `${lengthA} ${selectedUnit.name}`, `${lengthA + difference} ${selectedUnit.name}`, `${Math.max(1, lengthB - 2)} ${selectedUnit.name}`]
      : [answer, String(lengthA), String(lengthA + difference), String(Math.max(1, lengthB - 2))];
    if (!options.includes(answer)) { options[0] = answer; }

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Start with the units for the first object and then add or subtract based on the clue!`, `Add or subtract difference.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${lengthA} ${isShorter ? '-' : '+'} ${difference} = ${lengthB} ${selectedUnit.name}`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "indirect_difference", hideVisual: false }
    };
  }
};

export const advancedLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (advancedVariants[activeVariant]) {
    return advancedVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};