import { getRandomContext } from '@/lib/utils/localization';

const itemsPool = ["cutter", "highlighter", "pen", "pencil", "usbdrive"];
const heightPool = ["tree", "giraffe", "building", "boy", "ladder", "lamp-post"];
const units = [{ name: "paperclips", icon: "paperclip.svg" }, { name: "paperpins", icon: "paperpin.svg" }];
const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const standardVariants = {
  standard_baseline_comparison: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3);
    const lengths = [4, 7, 9].sort(() => 0.5 - Math.random());
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const componentData = { items: selection.map((name, idx) => ({ label: capitalize(name), length: lengths[idx] })), unitIcon: selectedUnit.icon };
    const maxIdx = lengths.indexOf(Math.max(...lengths));
    const longestObject = capitalize(selection[maxIdx]);

    const answer = longestObject;
    const questionTextTemplate = getQText(`Look at the items aligned to the wall line. Which object is the longest?`, `Longest object = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. 'Ali went to the store.'). DO NOT delete the math question! CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = selection.map(capitalize);
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
          "hint": ${JSON.stringify(getQText(`Look at the right side of the items. Which one reaches the furthest?`, `Check the right edges.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`All objects share the exact same starting line on the left. Looking across to the right edge, the ${longestObject} measures ${lengths[maxIdx]} ${selectedUnit.name} long, making it the longest.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_UNIT",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "baseline_comparison", hideVisual: false }
    };
  },

  standard_find_shortest: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3);
    const lengths = [3, 5, 8].sort(() => 0.5 - Math.random());
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const componentData = { items: selection.map((name, idx) => ({ label: capitalize(name), length: lengths[idx] })), unitIcon: selectedUnit.icon };
    const shortestItem = capitalize(selection[lengths.indexOf(Math.min(...lengths))]);

    const answer = shortestItem;
    const questionTextTemplate = getQText(`Look at the items. Which object is the shortest?`, `Shortest object = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. 'Ali went to the store.'). DO NOT delete the math question! CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = selection.map(capitalize);
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
          "hint": ${JSON.stringify(getQText(`Look at where each object ends. Which one is the smallest?`, `Find the smallest length.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`All objects share the same left wall. Looking across at the lengths, the ${shortestItem} is only ${Math.min(...lengths)} ${selectedUnit.name} long, making it the shortest object.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_UNIT",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "find_shortest", hideVisual: false }
    };
  },

  standard_vertical_baseline: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const tallItems = [{ name: "Building", baseLen: 9 }, { name: "Tree", baseLen: 6 }, { name: "Ladder", baseLen: 5 }, { name: "Boy", baseLen: 3 }];
    const selection = [...tallItems].sort(() => 0.5 - Math.random()).slice(0, 3).sort((a, b) => b.baseLen - a.baseLen); 
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const items = selection.map(item => ({ label: `Tall ${item.name}`, length: item.baseLen + (Math.random() > 0.5 ? 1 : 0) }));
    const componentData = { items, unitIcon: selectedUnit.icon };
    
    const lengths = items.map(i => i.length);
    const isAskingTallest = Math.random() > 0.5;
    const targetHeight = isAskingTallest ? Math.max(...lengths) : Math.min(...lengths);
    const targetItem = items.find(i => i.length === targetHeight);
    const distractor = tallItems.find(t => !selection.find(s => s.name === t.name));

    const answer = targetItem.label;
    const questionTextTemplate = getQText(`Look at the pictures standing on the ground floor. Which one is the ${isAskingTallest ? 'tallest' : 'shortest'}?`, `${isAskingTallest ? 'Tallest' : 'Shortest'} object = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. 'Ali went to the store.'). DO NOT delete the math question! CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = [...items.map(i => i.label), `Tall ${distractor.name}`];
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
          "hint": ${JSON.stringify(getQText(`Look at the tops of the objects. Which one is higher or lower?`, `Compare heights.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Since they are all standing on the same ground floor level, we look at their tops. The ${targetItem.label} reaches ${targetHeight} ${selectedUnit.name} high, making it the ${isAskingTallest ? 'tallest' : 'shortest'}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_UNIT",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "vertical_baseline", hideVisual: false }
    };
  },

  standard_ordering_ascending: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3).map(capitalize);
    const lengths = [4, 6, 9]; 
    const itemsArr = selection.map((name, idx) => ({ label: name, length: lengths[idx] })).sort(() => 0.5 - Math.random());
    const ascendingOrder = [...itemsArr].sort((a, b) => a.length - b.length).map(i => i.label);
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const componentData = { items: itemsArr, unitIcon: selectedUnit.icon };
    
    const answer = ascendingOrder.join(", ");
    const questionTextTemplate = getQText(`Arrange the objects in order from shortest to longest.`, `Order objects shortest to longest.`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. 'Ali went to the store.'). DO NOT delete the math question! CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = [
      answer,
      [...ascendingOrder].reverse().join(", "),
      `${ascendingOrder[1]}, ${ascendingOrder[0]}, ${ascendingOrder[2]}`,
      `${ascendingOrder[0]}, ${ascendingOrder[2]}, ${ascendingOrder[1]}`
    ];
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
          "hint": ${JSON.stringify(getQText(`Count the ${selectedUnit.name} for each one first, then put them in order from smallest to biggest!`, `Sort lengths increasing.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Let's count each object's units: ${itemsArr.map(i => `${i.label} is ${i.length} units`).join(', ')}. Putting them in order from shortest to longest gives: ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_UNIT",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "ordering_ascending", hideVisual: false }
    };
  },

  standard_ordering_descending: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3).map(capitalize);
    const lengths = [3, 6, 8];
    const itemsArr = selection.map((name, idx) => ({ label: name, length: lengths[idx] })).sort(() => 0.5 - Math.random());
    const descendingOrder = [...itemsArr].sort((a, b) => b.length - a.length).map(i => i.label);
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const componentData = { items: itemsArr, unitIcon: selectedUnit.icon };
    
    const answer = descendingOrder.join(", ");
    const questionTextTemplate = getQText(`Arrange the objects in order from longest to shortest.`, `Order objects longest to shortest.`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. 'Ali went to the store.'). DO NOT delete the math question! CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = [
      answer,
      [...descendingOrder].reverse().join(", "),
      `${descendingOrder[1]}, ${descendingOrder[2]}, ${descendingOrder[0]}`,
      `${descendingOrder[2]}, ${descendingOrder[1]}, ${descendingOrder[0]}`
    ];
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
          "hint": ${JSON.stringify(getQText(`Count the ${selectedUnit.name} for each one first, then put them in order from biggest to smallest!`, `Sort lengths decreasing.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Counting their units: ${itemsArr.map(i => `${i.label} is ${i.length} units`).join(', ')}. Sorting them from longest to shortest gives: ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_UNIT",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "ordering_descending", hideVisual: false }
    };
  },

  standard_transitive_logic: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3).map(capitalize);
    const labels = selection.map((name, i) => `${name} ${String.fromCharCode(65 + i)}`);
    const distractor = capitalize(itemsPool.find(i => !selection.map(s => s.toLowerCase()).includes(i.toLowerCase()))) + " D";
    const componentData = { items: [{ label: labels[0], length: 8 }, { label: labels[1], length: 5 }, { label: labels[2], length: 3 }] };
    
    const askLongest = Math.random() > 0.5;
    const answer = askLongest ? labels[0] : labels[2];

    const questionTextTemplate = getQText(`Read carefully:\n- ${labels[0]} is longer than ${labels[1]}.\n- ${labels[1]} is longer than ${labels[2]}.\n\nWhich object is the ${askLongest ? 'longest' : 'shortest'}?`, `If ${labels[0]} > ${labels[1]} and ${labels[1]} > ${labels[2]}, find ${askLongest ? 'longest' : 'shortest'}.`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. 'Ali went to the store.'). DO NOT delete the math question! CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = [...labels, distractor];
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
          "hint": ${JSON.stringify(getQText(`Read the clues carefully! If A is longer than B, and B is longer than C, where does C fit?`, `Use logic to compare.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`If ${labels[0]} is longer than ${labels[1]}, and ${labels[1]} is longer than ${labels[2]}, then ${labels[0]} is the biggest and ${labels[2]} is the smallest. The ${askLongest ? 'longest' : 'shortest'} is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "transitive_logic", hideVisual: true }
    };
  },

  standard_baseline_error_check: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 2).map(capitalize);
    const lenA = Math.floor(Math.random() * 3) + 4; 
    const offsetB = Math.floor(Math.random() * 2) + 2; 
    const lenB = lenA - (Math.floor(Math.random() * 2) + 1); 
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const componentData = { items: [{ label: `${selection[0]} A`, length: lenA }, { label: `${selection[1]} B`, length: lenB, startOffset: offsetB }], showFullRuler: true, unitIcon: selectedUnit.icon };

    const answer = "No, because they do not start at the same baseline.";
    const questionTextTemplate = getQText(`Look closely at the image alignment. Can we say ${selection[1]} B is longer than ${selection[0]} A simply because its right edge sticks out further?`, `Is B longer because its tip is further right?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. 'Ali went to the store.'). DO NOT delete the math question! CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = [
      "No, because they do not start at the same baseline.",
      "Yes, because its tip is further to the right.",
      "Yes, because it uses more units underneath.",
      "Yes, because it is a different color."
    ];
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
          "hint": ${JSON.stringify(getQText(`Look at the starting wall! Do both objects begin at the same spot?`, `Check the start positions.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`To compare lengths directly, objects must start at the exact same baseline line. Since ${selection[1]} B was pushed forward by ${offsetB} ${selectedUnit.name}, a direct visual edge comparison is incorrect.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_UNIT",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "baseline_error_check", hideVisual: false }
    };
  },

  standard_as_long_as: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3).map(capitalize);
    const baseLen = 6;
    const variantLen = 4;
    const referenceItem = { label: selection[0], length: baseLen };
    const matchingTwin = { label: selection[1], length: baseLen };
    const wrongItem = { label: selection[2], length: variantLen };
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const componentData = { items: [referenceItem, matchingTwin, wrongItem].sort(() => 0.5 - Math.random()), unitIcon: selectedUnit.icon };
    
    const optionsSet = new Set([matchingTwin.label]);
    while (optionsSet.size < 4) {
      const randomDistractor = capitalize(itemsPool[Math.floor(Math.random() * itemsPool.length)]);
      if (randomDistractor !== referenceItem.label) optionsSet.add(randomDistractor);
    }
    
    const answer = matchingTwin.label;
    const questionTextTemplate = getQText(`Look at the ${referenceItem.label}. Which object is as long as the ${referenceItem.label}?`, `Which object has same length as ${referenceItem.label}?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. 'Ali went to the store.'). DO NOT delete the math question! CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = Array.from(optionsSet);
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
          "hint": ${JSON.stringify(getQText(`Count the ${selectedUnit.name} for the ${referenceItem.label} and see which other object has the same number.`, `Match lengths.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Objects that are 'as long as' each other must have the same number of units. Both the ${referenceItem.label} and the ${matchingTwin.label} are exactly ${baseLen} ${selectedUnit.name} long.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_UNIT",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "as_long_as", hideVisual: false }
    };
  },

  standard_unit_difference_mcq: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 2).map(capitalize);
    const len1 = 8;
    const len2 = 5;
    const diff = len1 - len2;
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const componentData = { items: [{ label: selection[0], length: len1 }, { label: selection[1], length: len2 }], unitIcon: selectedUnit.icon };
    
    const answer = String(diff);
    const questionTextTemplate = getQText(`How many ${selectedUnit.name} longer is the ${selection[0]} than the ${selection[1]}?`, `Length difference = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. 'Ali went to the store.'). DO NOT delete the math question! CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = [answer, String(len1), String(len2), String(len1 + len2)];
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
          "hint": ${JSON.stringify(getQText(`Count how many extra ${selectedUnit.name} the longer object has!`, `Subtract lengths.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The ${selection[0]} is ${len1} ${selectedUnit.name}. The ${selection[1]} is ${len2} ${selectedUnit.name}. Subtract to find the difference: ${len1} - ${len2} = ${diff} ${selectedUnit.name}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_UNIT",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "unit_difference", hideVisual: false }
    };
  },

  standard_mid_grid_alignment: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedItem = capitalize(itemsPool[Math.floor(Math.random() * itemsPool.length)]);
    const startMarker = Math.floor(Math.random() * 3) + 1;
    const actualLength = Math.floor(Math.random() * 3) + 3;
    const endMarker = startMarker + actualLength;
    const selectedUnit = units[Math.floor(Math.random() * units.length)];
    const componentData = { items: [{ label: `Floating ${selectedItem}`, length: actualLength, startOffset: startMarker }], showFullRuler: true, unitIcon: selectedUnit.icon };
    
    const answer = String(actualLength);
    const questionTextTemplate = getQText(`Look at the ${selectedItem.toLowerCase()}. It starts at the ${startMarker} unit marker and ends at the ${endMarker} unit marker. How many units long is the ${selectedItem.toLowerCase()}?`, `Length of ${selectedItem.toLowerCase()} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. 'Ali went to the store.'). DO NOT delete the math question! CRITICAL: DO NOT modify the 'visualEngine' object, 'componentData', or any existing item names/lengths in the JSON template. They MUST remain exactly as provided!`;

    let options = [answer, String(endMarker), String(startMarker), String(endMarker + 1)];
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
          "hint": ${JSON.stringify(getQText(`Count only the units that are actually under the object!`, `Subtract start from end.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`When an object does not start at zero, calculate its true length by subtracting the starting marker position from the ending marker position: ${endMarker} - ${startMarker} = ${actualLength} ${selectedUnit.name}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_UNIT",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "mid_grid_alignment", hideVisual: false }
    };
  }
};

export const standardLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (standardVariants[activeVariant]) {
    return standardVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};