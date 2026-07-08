import { getRandomContext } from '@/lib/utils/localization';

import { getRandomNames, getRandomLengthItems, LENGTH_ITEMS_POOL } from '@/lib/utils/variable-bank';
const units = [{ name: "cm", icon: "ruler.svg" }];
const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const foundationVariants = {
  foundation_unit_counting: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTarget = getRandomLengthItems(1);
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const lengthCount = Math.floor(Math.random() * 6) + 3;

    const componentData = { items: [{ label: selectedTarget, length: lengthCount }], unitIcon: selectedUnit.icon };
    const requireUnit = Math.random() > 0.5;
    const answer = requireUnit ? `${lengthCount} ${selectedUnit.name}` : String(lengthCount);

    const questionTextTemplate = requireUnit
      ? getQText(`What is the length of the ${selectedTarget}?`, `Length of ${selectedTarget} = ?`)
      : getQText(`How many ${selectedUnit.name} long is the ${selectedTarget}?`, `Length of ${selectedTarget} in ${selectedUnit.name} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary like "cumulative". Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g., if the question mentions a Marker, say "${getRandomNames(1)} bought a Marker."). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = requireUnit
      ? [answer, `${lengthCount + 2} ${selectedUnit.name}`, `${Math.max(1, lengthCount - 1)} ${selectedUnit.name}`, `${lengthCount + 1} ${selectedUnit.name}`]
      : [answer, String(lengthCount + 2), String(Math.max(1, lengthCount - 1)), String(lengthCount + 1)];
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

  foundation_true_false_length: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = getRandomLengthItems(1);
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const trueLength = Math.floor(Math.random() * 6) + 3;
    const isStatementTrue = Math.random() > 0.5;
    const offset = Math.random() > 0.5 ? 1 : 2;
    const statedLength = isStatementTrue ? trueLength : trueLength + offset;
    
    const componentData = { items: [{ label: selection, length: trueLength }], unitIcon: selectedUnit.icon };
    const answer = isStatementTrue ? 'True' : 'False';

    const questionTextTemplate = getQText(`Look at the ${selection}. Is this statement True or False?\n\n"The ${selection} is ${statedLength} ${selectedUnit.name} long."`, `Is the ${selection} ${statedLength} ${selectedUnit.name} long? (True/False)`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary like "cumulative". Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g., if the question mentions a Marker, say "${getRandomNames(1)} bought a Marker."). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = ['True', 'False', 'Cannot tell'];
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
          "hint": ${JSON.stringify(getQText(`Count the units carefully to see its actual length.`, `Check the statement against the lengths.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Counting the units, the ${selection} is actually ${trueLength} units long. Therefore, the statement is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "true_false_length", hideVisual: false }
    };
  },

  foundation_longer_than_target: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = getRandomLengthItems(3);
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    
    const targetLength = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const longerLen = targetLength + Math.floor(Math.random() * 3) + 1;
    const shorterLen1 = targetLength - Math.floor(Math.random() * 2) - 1;
    const shorterLen2 = shorterLen1 - Math.floor(Math.random() * 2) - 1;
    
    const lengths = [longerLen, shorterLen1, shorterLen2].sort(() => 0.5 - Math.random());
    const itemsArr = selection.map((label, idx) => ({ label, length: lengths[idx] }));
    const answerObj = itemsArr.find(i => i.length > targetLength);
    const answer = answerObj.label;

    const componentData = { items: itemsArr, unitIcon: selectedUnit.icon };

    const questionTextTemplate = getQText(`Which object is longer than ${targetLength} ${selectedUnit.name}?`, `Which is longer than ${targetLength} ${selectedUnit.name}?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary like "cumulative". Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g., if the question mentions a Marker, say "${getRandomNames(1)} bought a Marker."). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = itemsArr.map(i => i.label);
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
          "hint": ${JSON.stringify(getQText(`Count the units for each object to see which one has more than ${targetLength}.`, `Count and compare to ${targetLength}.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The ${answerObj.label} is ${answerObj.length} units long, which is more than ${targetLength}. The other objects are shorter.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "longer_than_target", hideVisual: false }
    };
  },

  foundation_shorter_than_target: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = getRandomLengthItems(3);
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    
    const targetLength = Math.floor(Math.random() * 4) + 6; // 6 to 9
    const shorterLen = targetLength - Math.floor(Math.random() * 3) - 1;
    const longerLen1 = targetLength + Math.floor(Math.random() * 2) + 1;
    const longerLen2 = longerLen1 + Math.floor(Math.random() * 2) + 1;
    
    const lengths = [shorterLen, longerLen1, longerLen2].sort(() => 0.5 - Math.random());
    const itemsArr = selection.map((label, idx) => ({ label, length: lengths[idx] }));
    const answerObj = itemsArr.find(i => i.length < targetLength);
    const answer = answerObj.label;

    const componentData = { items: itemsArr, unitIcon: selectedUnit.icon };

    const questionTextTemplate = getQText(`Which object is shorter than ${targetLength} ${selectedUnit.name}?`, `Which is shorter than ${targetLength} ${selectedUnit.name}?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!" : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary like "cumulative". Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items in the question (e.g., if the question mentions a Marker, say "${getRandomNames(1)} bought a Marker."). DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify the "visualEngine" object, "componentData", or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = itemsArr.map(i => i.label);
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
          "hint": ${JSON.stringify(getQText(`Count the units for each object to see which one has fewer than ${targetLength}.`, `Count and compare to ${targetLength}.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The ${answerObj.label} is ${answerObj.length} units long, which is less than ${targetLength}. The other objects are longer.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "shorter_than_target", hideVisual: false }
    };
  }
};

export const foundationLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (foundationVariants[activeVariant]) {
    return foundationVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};