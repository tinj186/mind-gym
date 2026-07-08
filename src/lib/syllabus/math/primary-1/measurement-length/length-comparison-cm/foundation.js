import { getRandomContext } from '@/lib/utils/localization';

import { getRandomNames, getRandomLengthItems, LENGTH_ITEMS_POOL } from '@/lib/utils/variable-bank';
const units = [{ name: "cm", icon: "ruler.svg" }];
const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const foundationVariants = {
  foundation_unit_counting: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTarget = getRandomLengthItems(1);
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const lengthCount = Math.floor(Math.random() * 6) + 3;

    const componentData = { items: [{ label: selectedTarget, length: lengthCount }], unitIcon: selectedUnit.icon };
    const answer = String(lengthCount);

    const questionTextTemplate = getQText(`How many ${selectedUnit.name} long is the ${selectedTarget}?`, `Length of ${selectedTarget} in ${selectedUnit.name} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary like "cumulative". Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g., if the question mentions a Marker, say "${getRandomNames(1)} bought a Marker."). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = [answer, String(lengthCount + 2), String(Math.max(1, lengthCount - 1)), String(lengthCount + 1)];
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
          "hint": ${JSON.stringify(getQText(`Count the ${selectedUnit.name} one by one from the start line to the end tip!`, `Count the units.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Counting the units from start to finish, the ${selectedTarget} is ${lengthCount} ${selectedUnit.name} long.`, `Count is ${lengthCount}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "unit_counting", hideVisual: false }
    };
  },

  foundation_compare_two: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = getRandomLengthItems(2);
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const len1 = Math.floor(Math.random() * 3) + 4; 
    const len2 = len1 + Math.floor(Math.random() * 3) + 1; 
    const isAskingLonger = Math.random() > 0.5;
    const shuffled = [{ label: selection[0], length: len1 }, { label: selection[1], length: len2 }].sort(() => 0.5 - Math.random());
    const targetItem = isAskingLonger ? shuffled.reduce((a, b) => a.length > b.length ? a : b) : shuffled.reduce((a, b) => a.length < b.length ? a : b);
    const distractors = LENGTH_ITEMS_POOL.filter(i => !selection.includes(i)).sort(() => 0.5 - Math.random()).slice(0, 2);

    const componentData = { items: shuffled, unitIcon: selectedUnit.icon };
    const answer = targetItem.label;

    const questionTextTemplate = getQText(`Which object is ${isAskingLonger ? 'longer' : 'shorter'}?`, `${isAskingLonger ? 'Longer' : 'Shorter'} object = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary like "cumulative". Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g., if the question mentions a Marker, say "${getRandomNames(1)} bought a Marker."). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = getShuffledOptions(answer, [...shuffled.map(i => i.label).filter(l => l !== answer), ...distractors]);
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
          "hint": ${JSON.stringify(getQText(`Look at both objects! See which one reaches further to the right.`, `Compare lengths.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The ${targetItem.label} is ${targetItem.length} units long. It is the ${isAskingLonger ? 'longer' : 'shorter'} object.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "compare_two", hideVisual: false }
    };
  },

  foundation_find_same: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = getRandomLengthItems(3);
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const targetLen = Math.floor(Math.random() * 3) + 5; 
    const offLen = targetLen + (Math.random() > 0.5 ? 2 : -2); 
    const itemsArr = [
      { label: selection[0], length: targetLen },
      { label: selection[1], length: targetLen },
      { label: selection[2], length: offLen }
    ].sort(() => 0.5 - Math.random());
    const correctPair = itemsArr.filter(i => i.length === targetLen).map(i => i.label);

    const componentData = { items: itemsArr, unitIcon: selectedUnit.icon };
    const answer = `${correctPair[0]} and ${correctPair[1]}`;

    const questionTextTemplate = getQText(`Which two objects have the same length?`, `Same length objects = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary like "cumulative". Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g., if the question mentions a Marker, say "${getRandomNames(1)} bought a Marker."). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = [
      `${itemsArr[0].label} and ${itemsArr[1].label}`,
      `${itemsArr[1].label} and ${itemsArr[2].label}`,
      `${itemsArr[0].label} and ${itemsArr[2].label}`,
      "None of them"
    ];
    if (!options.includes(answer)) { options[0] = answer; }

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    const forceMCQ = true;
    if (type === 'MCQ' || forceMCQ) {
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
          "hint": ${JSON.stringify(getQText(`Try counting the units for each object. Do any have the same count?`, `Count units to find matching pair.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Both the ${correctPair[0]} and the ${correctPair[1]} are exactly ${targetLen} units long.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "find_same", hideVisual: false }
    };
  },

  foundation_identify_by_length: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = getRandomLengthItems(4);
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const lengths = [4, 6, 8, 3].sort(() => 0.5 - Math.random());
    const itemsArr = selection.map((label, idx) => ({ label, length: lengths[idx] }));
    const targetItem = itemsArr[Math.floor(Math.random() * itemsArr.length)];

    const componentData = { items: itemsArr, unitIcon: selectedUnit.icon };
    const answer = targetItem.label;

    const questionTextTemplate = getQText(`Which object is exactly ${targetItem.length} ${selectedUnit.name} long?`, `Find object with length ${targetItem.length} ${selectedUnit.name}.`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary like "cumulative". Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g., if the question mentions a Marker, say "${getRandomNames(1)} bought a Marker."). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = itemsArr.map(i => i.label);
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
          "hint": ${JSON.stringify(getQText(`Count the ${selectedUnit.name} under each object carefully to find the match!`, `Count units for each object.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Counting the ${selectedUnit.name}, the ${targetItem.label} matches exactly ${targetItem.length} units.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "identify_by_length", hideVisual: false }
    };
  },

  foundation_true_false: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = getRandomLengthItems(2);
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const len1 = Math.floor(Math.random() * 3) + 4; 
    const len2 = len1 + Math.floor(Math.random() * 3) + 1;
    const shuffled = [{ label: selection[0], length: len1 }, { label: selection[1], length: len2 }].sort(() => 0.5 - Math.random());
    const itemA = shuffled[0];
    const itemB = shuffled[1];
    
    const makeStatementTrue = Math.random() > 0.5;
    const isALonger = itemA.length > itemB.length;
    const useLongerTerm = makeStatementTrue ? isALonger : !isALonger;
    const statement = `The ${itemA.label} is ${useLongerTerm ? 'longer' : 'shorter'} than the ${itemB.label}.`;
    const answer = makeStatementTrue ? 'True' : 'False';

    const componentData = { items: shuffled, unitIcon: selectedUnit.icon };

    const questionTextTemplate = getQText(`Look at the objects. Is this statement True or False?\n\n"${statement}"`, `Is "${statement}" True or False? (True/False)`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary like "cumulative". Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g., if the question mentions a Marker, say "${getRandomNames(1)} bought a Marker."). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = ['True', 'False', 'They are the same length', 'Cannot tell'];
    if (!options.includes(answer)) { options[0] = answer; }

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    const forceMCQ = true;
    if (type === 'MCQ' || forceMCQ) {
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
          "hint": ${JSON.stringify(getQText(`Count the units for both objects and check if the sentence is right!`, `Check the statement against the lengths.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The ${itemA.label} is ${itemA.length} units. The ${itemB.label} is ${itemB.length} units. Therefore, the statement is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "true_false", hideVisual: false }
    };
  },

  foundation_compare_height: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const items = getRandomLengthItems(2).map(capitalize);
    const item1 = items[0];
    const item2 = items[1];
    let len1 = Math.floor(Math.random() * 5) + 3;
    let len2 = Math.floor(Math.random() * 5) + 3;
    while(len1 === len2) len2 = Math.floor(Math.random() * 5) + 3;
    
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    
    const componentData = { items: [{ label: item1, length: len1, isVertical: true }, { label: item2, length: len2, isVertical: true }], showFullRuler: true, unitIcon: selectedUnit.icon, isVertical: true };
    
    const findTaller = Math.random() > 0.5;
    const answer = findTaller ? (len1 > len2 ? item1 : item2) : (len1 < len2 ? item1 : item2);

    const questionTextTemplate = getQText(`Look at the ${item1} and ${item2}. Which object is ${findTaller ? 'taller' : 'shorter'}?`, `Which object is ${findTaller ? 'taller' : 'shorter'}?`);

    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary like "cumulative". Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g., if the question mentions a Marker, say "${getRandomNames(1)} bought a Marker."). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = [item1, item2, "They are the same", "Cannot tell"];
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
          "hint": ${JSON.stringify(getQText(`Count how many units tall each object is to compare!`, `Compare heights.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The ${item1} is ${len1} units tall. The ${item2} is ${len2} units tall. The ${answer} is ${findTaller ? 'taller' : 'shorter'}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "compare_height", hideVisual: false }
    };
  },

  foundation_find_shorter_than: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const items = getRandomLengthItems(3).map(capitalize);
    const refItem = items[0];
    const otherItem1 = items[1];
    const otherItem2 = items[2];
    
    let refLen = Math.floor(Math.random() * 3) + 4; // 4 to 6
    let len1 = refLen - Math.floor(Math.random() * 2) - 1; // shorter
    let len2 = refLen + Math.floor(Math.random() * 2) + 1; // longer
    
    if (Math.random() > 0.5) {
      // Swap len1 and len2 so the shorter/longer is randomized in position
      const temp = len1;
      len1 = len2;
      len2 = temp;
    }
    
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    
    const componentData = { items: [{ label: refItem, length: refLen }, { label: otherItem1, length: len1 }, { label: otherItem2, length: len2 }], showFullRuler: true, unitIcon: selectedUnit.icon };
    
    const findShorter = Math.random() > 0.5;
    const answer = findShorter ? (len1 < refLen ? otherItem1 : otherItem2) : (len1 > refLen ? otherItem1 : otherItem2);

    const questionTextTemplate = getQText(`Which object is ${findShorter ? 'shorter' : 'longer'} than the ${refItem}?`, `Which is ${findShorter ? 'shorter' : 'longer'} than ${refItem}?`);

    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary like "cumulative". Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g., if the question mentions a Marker, say "${getRandomNames(1)} bought a Marker."). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = [otherItem1, otherItem2, refItem, "None of them"];
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
          "hint": ${JSON.stringify(getQText(`Find the length of the ${refItem} first, then see which object is ${findShorter ? 'shorter' : 'longer'} than it!`, `Compare with ${refItem}.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The ${refItem} is ${refLen} units long. The ${answer} is ${findShorter ? 'shorter' : 'longer'} than ${refLen} units.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "find_shorter_than", hideVisual: false }
    };
  }

};

export const foundationLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (foundationVariants[activeVariant]) {
    return foundationVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};