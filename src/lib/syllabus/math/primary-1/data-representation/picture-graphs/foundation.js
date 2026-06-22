import { getRandomContext } from '@/lib/utils/localization';

import { getRandomTheme } from '@/lib/utils/variable-bank';
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const getShuffledOptions = (correct, distractors) => {
  return [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
};

export const foundationVariants = {
  foundation_read_single_category: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const themeItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const shuffledDisplay = [...themeItems].sort(() => Math.random() - 0.5);
    const counts = [2, 3, 4, 5].sort(() => Math.random() - 0.5);
    const targetIdx = Math.floor(Math.random() * 4);
    const target = shuffledDisplay[targetIdx];
    const answer = String(counts[targetIdx]);

    const componentData = {
      title: `Our ${capitalize(selectedTheme.name)}`,
      orientation,
      categories: shuffledDisplay.map((item, i) => ({ ...item, count: counts[i] })),
      key: "Each picture = 1 item"
    };

    const questionTextTemplate = getQText(`Look at the picture graph. How many ${target.label.toLowerCase()} are there?`, `Number of ${target.label.toLowerCase()} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = [answer, "1", "0", String(counts[targetIdx] + 1)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        "1": "CONCEPTUAL_ERROR",
        "0": "CONCEPTUAL_ERROR",
        [String(counts[targetIdx] + 1)]: "CARELESS_CALCULATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
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
          "hint": ${JSON.stringify(getQText(`Find the row for ${target.label} and count the pictures one by one!`, `Count the ${target.label} symbols.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Locate the ${target.label} category. Counting the pictures shown, we find there are ${counts[targetIdx]} ${target.label.toLowerCase()}.`, `${target.label} count is ${counts[targetIdx]}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Which item are we counting?", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "How many are there?", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "read_single", hideVisual: false }
    };
  },

  foundation_compare_two_categories: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const themeItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const shuffledDisplay = [...themeItems].sort(() => Math.random() - 0.5);
    const countA = 5;
    const countB = 2;
    const diff = countA - countB;
    const isAskingMore = Math.random() > 0.5;
    const answer = String(diff);

    const componentData = {
      title: `Our ${capitalize(selectedTheme.name)}`,
      orientation,
      categories: [
        { ...shuffledDisplay[0], count: countA },
        { ...shuffledDisplay[1], count: countB },
        { ...shuffledDisplay[2], count: 3 }
      ],
      key: "Each picture = 1 item"
    };

    const questionTextTemplate = getQText(`How many ${isAskingMore ? 'more' : 'fewer'} ${shuffledDisplay[isAskingMore ? 0 : 1].label.toLowerCase()} are there than ${shuffledDisplay[isAskingMore ? 1 : 0].label.toLowerCase()}?`, `Difference between ${shuffledDisplay[0].label} and ${shuffledDisplay[1].label} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = [answer, "1", "2", String(countA + countB)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        "1": "CARELESS_CALCULATION",
        "2": "CARELESS_CALCULATION",
        [String(countA + countB)]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
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
          "hint": ${JSON.stringify(getQText(`Find both categories and see how many extra pictures the longer row has!`, `Subtract the smaller count from the larger.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`There are ${countA} ${shuffledDisplay[0].label.toLowerCase()} and ${countB} ${shuffledDisplay[1].label.toLowerCase()}. To find how many ${isAskingMore ? 'more' : 'fewer'}, we subtract: ${countA} - ${countB} = ${diff}.`, `${countA} - ${countB} = ${diff}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "compare_two", hideVisual: false }
    };
  },

  foundation_total_two_categories: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const themeItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const shuffledDisplay = [...themeItems].sort(() => Math.random() - 0.5);
    const c1 = 3;
    const c2 = 4;
    const total = c1 + c2;
    const answer = String(total);

    const componentData = {
      title: `Our ${capitalize(selectedTheme.name)}`,
      orientation,
      categories: [
        { ...shuffledDisplay[0], count: c1 },
        { ...shuffledDisplay[1], count: c2 },
        { ...shuffledDisplay[2], count: 2 }
      ],
      key: "Each picture = 1 item"
    };

    const questionTextTemplate = getQText(`How many ${shuffledDisplay[0].label.toLowerCase()} and ${shuffledDisplay[1].label.toLowerCase()} are there altogether?`, `Total of ${shuffledDisplay[0].label} and ${shuffledDisplay[1].label} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = [answer, String(c1), String(c2), String(total + 1)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(c1)]: "CONCEPTUAL_ERROR",
        [String(c2)]: "CONCEPTUAL_ERROR",
        [String(total + 1)]: "CARELESS_CALCULATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
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
          "hint": ${JSON.stringify(getQText(`Count the pictures for both categories and add them together!`, `Add counts of both.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Count ${c1} for ${shuffledDisplay[0].label} and ${c2} for ${shuffledDisplay[1].label}. Adding them together: ${c1} + ${c2} = ${total}.`, `${c1} + ${c2} = ${total}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "total_two", hideVisual: false }
    };
  },

  foundation_most_least_category: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const themeItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const shuffledDisplay = [...themeItems].sort(() => Math.random() - 0.5);
    const counts = [1, 2, 4, 6].sort(() => Math.random() - 0.5);
    const isAskingMost = Math.random() > 0.5;
    
    const targetIdx = isAskingMost ? counts.indexOf(Math.max(...counts)) : counts.indexOf(Math.min(...counts));
    const target = shuffledDisplay[targetIdx];
    const answer = target.label;

    const componentData = {
      title: `Our ${capitalize(selectedTheme.name)}`,
      orientation,
      categories: shuffledDisplay.map((item, i) => ({ ...item, count: counts[i] })),
      key: "Each picture = 1 item"
    };

    const questionTextTemplate = getQText(`Which category has the ${isAskingMost ? 'most' : 'least'} items?`, `Category with ${isAskingMost ? 'most' : 'least'} items = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = shuffledDisplay.map(i => i.label);
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
          "hint": ${JSON.stringify(getQText(`Look for the row that has the ${isAskingMost ? 'longest' : 'shortest'} line of pictures!`, `Find the ${isAskingMost ? 'longest' : 'shortest'} row.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`By looking at the graph, the ${target.label} row has ${counts[targetIdx]} pictures, which is the ${isAskingMost ? 'most' : 'least'} of all.`, `${target.label} has the ${isAskingMost ? 'most' : 'least'}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "most_least", hideVisual: false }
    };
  },

  foundation_zero_value_category: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const themeItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const shuffledDisplay = [...themeItems].sort(() => Math.random() - 0.5);
    const zeroIdx = Math.floor(Math.random() * 4);
    const target = shuffledDisplay[zeroIdx];
    const answer = target.label;

    const componentData = {
      title: `Our ${capitalize(selectedTheme.name)}`,
      orientation,
      categories: shuffledDisplay.map((item, i) => ({ ...item, count: i === zeroIdx ? 0 : (Math.floor(Math.random() * 3) + 2) })),
      key: "Each picture = 1 item"
    };

    const questionTextTemplate = getQText(`Which category has no items (zero items) in the picture graph?`, `Category with 0 items = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = shuffledDisplay.map(i => i.label);
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
          "hint": ${JSON.stringify(getQText(`Look for the row that is completely empty with no pictures at all.`, `Find the empty row.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The row for ${target.label} has no pictures. This means it has exactly 0 items.`, `${target.label} has 0 items.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "zero_value", hideVisual: false }
    };
  },

  foundation_category_match_text: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const themeItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const shuffledDisplay = [...themeItems].sort(() => Math.random() - 0.5);
    const counts = [1, 2, 3, 5].sort(() => Math.random() - 0.5);
    const targetIdx = Math.floor(Math.random() * 4);
    const target = shuffledDisplay[targetIdx];
    const targetCount = counts[targetIdx];
    const answer = target.label;

    const componentData = {
      title: `Our ${capitalize(selectedTheme.name)}`,
      orientation,
      categories: shuffledDisplay.map((item, i) => ({ ...item, count: counts[i] })),
      key: "Each picture = 1 item"
    };

    const questionTextTemplate = getQText(`Which category has exactly ${targetCount} items?`, `Category with ${targetCount} items = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = shuffledDisplay.map(i => i.label);
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
          "hint": ${JSON.stringify(getQText(`Count the pictures in each row until you find one with exactly ${targetCount}.`, `Find row with ${targetCount} symbols.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`We count each row: ${shuffledDisplay.map((item, i) => `${item.label} has ${counts[i]}`).join(', ')}. The ${target.label} row matches ${targetCount}.`, `${target.label} has ${targetCount} items.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "match_text", hideVisual: false }
    };
  }
};

export const foundationLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (foundationVariants[activeVariant]) {
    return foundationVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};