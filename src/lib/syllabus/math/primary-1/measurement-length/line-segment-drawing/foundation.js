const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const foundationVariants = {
  foundation_identify_line: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const targetLength = Math.floor(Math.random() * 5) + 3;
    const lengthsArr = [
      targetLength,
      targetLength + 2,
      targetLength - 1,
      targetLength + 1
    ].sort(() => Math.random() - 0.5);
    
    const itemsArr = lengthsArr.map((len, index) => ({
      label: `Line ${String.fromCharCode(65 + index)}`,
      length: len
    }));
    
    const componentData = { items: itemsArr, unitIcon: "ruler.svg" };
    const answer = itemsArr.find(i => i.length === targetLength).label;
    
    const questionTextTemplate = getQText(`Which line segment is exactly ${targetLength} cm long? (Note: Each unit stands for 1 cm)`, `Find the ${targetLength} cm line segment.`);
    
    let options = itemsArr.map(i => i.label);
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    
    const forceMCQ = true;
    if (type === 'MCQ' || forceMCQ) {
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "subtopic": "${subtopic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": "Count the cm units for each line.",
          "finalAnswer": "${answer}",
          "solutionSteps": "Counting the units, ${answer} is exactly ${targetLength} cm long."
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "identify_line", hideVisual: false }
    };
  },

  foundation_find_longest: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    let len1 = Math.floor(Math.random() * 5) + 3;
    let len2 = Math.floor(Math.random() * 5) + 3;
    let len3 = Math.floor(Math.random() * 5) + 3;
    while (len1 === len2 || len1 === len3 || len2 === len3) {
      len1 = Math.floor(Math.random() * 5) + 3;
      len2 = Math.floor(Math.random() * 5) + 3;
      len3 = Math.floor(Math.random() * 5) + 3;
    }
    const lengthsArr = [len1, len2, len3].sort(() => Math.random() - 0.5);
    
    const itemsArr = lengthsArr.map((len, index) => ({
      label: `Line ${String.fromCharCode(65 + index)}`,
      length: len
    }));
    
    const componentData = { items: itemsArr, unitIcon: "ruler.svg" };
    const maxLen = Math.max(...lengthsArr);
    const answer = itemsArr.find(i => i.length === maxLen).label;
    
    const questionTextTemplate = getQText(`Look at the lines. Which line segment is the longest?`, `Which line is the longest?`);
    
    let options = itemsArr.map(i => i.label);
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    
    const forceMCQ = true;
    if (type === 'MCQ' || forceMCQ) {
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "subtopic": "${subtopic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": "Count the cm units for each line and find the biggest number.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${answer} has ${maxLen} cm units, which is more than the other lines."
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "find_longest", hideVisual: false }
    };
  },

  foundation_find_shortest: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    let len1 = Math.floor(Math.random() * 5) + 3;
    let len2 = Math.floor(Math.random() * 5) + 3;
    let len3 = Math.floor(Math.random() * 5) + 3;
    while (len1 === len2 || len1 === len3 || len2 === len3) {
      len1 = Math.floor(Math.random() * 5) + 3;
      len2 = Math.floor(Math.random() * 5) + 3;
      len3 = Math.floor(Math.random() * 5) + 3;
    }
    const lengthsArr = [len1, len2, len3].sort(() => Math.random() - 0.5);
    
    const itemsArr = lengthsArr.map((len, index) => ({
      label: `Line ${String.fromCharCode(65 + index)}`,
      length: len
    }));
    
    const componentData = { items: itemsArr, unitIcon: "ruler.svg" };
    const minLen = Math.min(...lengthsArr);
    const answer = itemsArr.find(i => i.length === minLen).label;
    
    const questionTextTemplate = getQText(`Look at the lines. Which line segment is the shortest?`, `Which line is the shortest?`);
    
    let options = itemsArr.map(i => i.label);
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    
    const forceMCQ = true;
    if (type === 'MCQ' || forceMCQ) {
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "subtopic": "${subtopic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": "Count the cm units for each line and find the smallest number.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${answer} has ${minLen} cm units, which is less than the other lines."
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "find_shortest", hideVisual: false }
    };
  },

  foundation_true_false_length: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    let len1 = Math.floor(Math.random() * 5) + 3;
    let len2 = Math.floor(Math.random() * 5) + 3;
    while (len1 === len2) {
      len1 = Math.floor(Math.random() * 5) + 3;
      len2 = Math.floor(Math.random() * 5) + 3;
    }
    const lengthsArr = [len1, len2].sort(() => Math.random() - 0.5);
    
    const itemsArr = lengthsArr.map((len, index) => ({
      label: `Line ${String.fromCharCode(65 + index)}`,
      length: len
    }));
    
    const componentData = { items: itemsArr, unitIcon: "ruler.svg" };
    
    const isTrue = Math.random() > 0.5;
    const targetLine = itemsArr[Math.floor(Math.random() * itemsArr.length)];
    const statedLength = isTrue ? targetLine.length : (targetLine.length + (Math.random() > 0.5 ? 1 : -1));
    const answer = isTrue ? "True" : "False";
    
    const questionTextTemplate = getQText(`${targetLine.label} is exactly ${statedLength} cm long. Is this True or False?`, `Is ${targetLine.label} ${statedLength} cm long?`);
    
    let options = ["True", "False"];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    
    const forceMCQ = true;
    if (type === 'MCQ' || forceMCQ) {
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "subtopic": "${subtopic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": "Count the cm units for the line mentioned in the question.",
          "finalAnswer": "${answer}",
          "solutionSteps": "Counting the units, ${targetLine.label} is exactly ${targetLine.length} cm long. So the statement is ${answer}."
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "true_false_length", hideVisual: false }
    };
  },

  foundation_find_same_length: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const sameLen = Math.floor(Math.random() * 4) + 3;
    let other1 = Math.floor(Math.random() * 4) + 3;
    let other2 = Math.floor(Math.random() * 4) + 3;
    while (other1 === sameLen) other1 = Math.floor(Math.random() * 4) + 3;
    while (other2 === sameLen || other2 === other1) other2 = Math.floor(Math.random() * 4) + 3;
    
    const lengthsArr = [sameLen, sameLen, other1, other2].sort(() => Math.random() - 0.5);
    
    const itemsArr = lengthsArr.map((len, index) => ({
      label: `Line ${String.fromCharCode(65 + index)}`,
      length: len
    }));
    
    const componentData = { items: itemsArr, unitIcon: "ruler.svg" };
    
    const sameItems = itemsArr.filter(i => i.length === sameLen);
    const answer = `${sameItems[0].label} and ${sameItems[1].label}`;
    
    const questionTextTemplate = getQText(`Which two line segments have the exact same length?`, `Find the two lines with the same length.`);
    
    // Generate valid combinations for options
    const allLabels = itemsArr.map(i => i.label);
    const possibleOptions = [];
    for (let i = 0; i < allLabels.length; i++) {
      for (let j = i + 1; j < allLabels.length; j++) {
        possibleOptions.push(`${allLabels[i]} and ${allLabels[j]}`);
      }
    }
    
    let options = [answer, ...possibleOptions.filter(o => o !== answer).sort(() => Math.random() - 0.5).slice(0, 3)];
    options = options.sort(() => Math.random() - 0.5);
    
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    
    const forceMCQ = true;
    if (type === 'MCQ' || forceMCQ) {
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "subtopic": "${subtopic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": "Count the cm units for each line and find the two that match.",
          "finalAnswer": "${answer}",
          "solutionSteps": "Counting the units, both ${answer} are exactly ${sameLen} cm long."
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "find_same_length", hideVisual: false }
    };
  }
};

export const foundationLogic = {
  generate: (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    if (foundationVariants[activeVariant]) {
      return foundationVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }
  }
};
