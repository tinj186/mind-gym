import { getRandomContext } from '@/lib/utils/localization';

const themes = [
  { name: "fruits", items: ["Apples", "Bananas", "Oranges", "Grapes", "Mangoes"], emojis: ["🍎", "🍌", "🍊", "🍇", "🥭"] },
  { name: "toys", items: ["Cars", "Dolls", "Balls", "Robots", "Trains"], emojis: ["🚗", "🧸", "⚽", "🤖", "🚂"] },
  { name: "pets", items: ["Dogs", "Cats", "Fish", "Birds", "Hamsters"], emojis: ["🐶", "🐱", "🐠", "🐦", "🐹"] },
];

const getRandom = (arr, count) => [...arr].sort(() => Math.random() - 0.5).slice(0, count);
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const getShuffledOptions = (correct, distractors) => {
  return [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
};

export const advancedVariants = {
  advanced_multi_step_problem: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const pairedItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const [cat1, cat2, cat3] = getRandom(pairedItems, 3);
    const currentOrientation = Math.random() > 0.5 ? "HORIZONTAL" : "VERTICAL";
    
    const count1 = Math.floor(Math.random() * 4) + 3; 
    const count2 = Math.floor(Math.random() * 3) + 2;
    const count3 = Math.floor(Math.random() * 2) + 1;
    const finalValue = (count1 + count2) - count3;
    const answer = String(finalValue);

    const componentData = {
      title: `Our ${capitalize(selectedTheme.name)} Chart`,
      symbol: cat1.emoji,
      orientation: currentOrientation,
      categories: [
        { label: cat1.label, emoji: cat1.emoji, count: count1 },
        { label: cat2.label, emoji: cat2.emoji, count: count2 },
        { label: cat3.label, emoji: cat3.emoji, count: count3 }
      ]
    };

    const questionTextTemplate = getQText(`How many ${cat1.label} and ${cat2.label} are there altogether? Take away the number of ${cat3.label}, what is the final count?`, `(${cat1.label} + ${cat2.label}) - ${cat3.label} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, String(finalValue + 1), String(finalValue - 1), String(count1 + count2)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(finalValue + 1)]: "CARELESS_CALCULATION",
        [String(finalValue - 1)]: "CARELESS_CALCULATION",
        [String(count1 + count2)]: "CONCEPTUAL_ERROR"
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
          "hint": ${JSON.stringify(getQText(`First, add the counts of ${cat1.label} and ${cat2.label}. Then, subtract the count of ${cat3.label} from that total.`, `Add the first two, subtract the third.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`There are ${count1} ${cat1.label} and ${count2} ${cat2.label}. Combined total = ${count1} + ${count2} = ${count1 + count2}. Take away ${count3} ${cat3.label}s: ${count1 + count2} - ${count3} = ${finalValue}.`, `(${count1} + ${count2}) - ${count3} = ${finalValue}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "multi_step", hideVisual: false }
    };
  },

  advanced_predict_next_category: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const pairedItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const cat1 = pairedItems[0];
    
    const count1 = Math.floor(Math.random() * 2) + 1;
    const step = Math.floor(Math.random() * 2) + 1;
    const count2 = count1 + step;
    const count3 = count2 + step;
    const nextPatternValue = count3 + step;
    const answer = String(nextPatternValue);

    const componentData = {
      title: `Weekly Collection Pattern`,
      symbol: cat1.emoji,
      orientation: "HORIZONTAL",
      categories: [
        { label: "Week 1", emoji: cat1.emoji, count: count1 },
        { label: "Week 2", emoji: cat1.emoji, count: count2 },
        { label: "Week 3", emoji: cat1.emoji, count: count3 }
      ]
    };

    const questionTextTemplate = getQText(`Look at the pattern across Week 1, Week 2, and Week 3. If the pattern continues, how many items should be drawn for Week 4?`, `Predict count for Week 4 = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, String(nextPatternValue + 1), String(nextPatternValue - 1), String(count3)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(nextPatternValue + 1)]: "CARELESS_CALCULATION",
        [String(nextPatternValue - 1)]: "CARELESS_CALCULATION",
        [String(count3)]: "CONCEPTUAL_ERROR"
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
          "hint": ${JSON.stringify(getQText(`Find the difference between consecutive weeks. See how much the graph grows each week!`, `Find the pattern increment.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The counts are Week 1: ${count1}, Week 2: ${count2}, Week 3: ${count3}. The graph increases by ${step} each week. Following this rule, Week 4 will have ${count3} + ${step} = ${nextPatternValue}.`, `Pattern increments by ${step}. Week 4 is ${count3} + ${step} = ${nextPatternValue}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "predict_next", hideVisual: false }
    };
  },

  advanced_create_graph_from_data: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const pairedItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const [cat1, cat2, cat3] = getRandom(pairedItems, 3);
    const currentOrientation = Math.random() > 0.5 ? "HORIZONTAL" : "VERTICAL";
    
    const count1 = Math.floor(Math.random() * 4) + 2;
    const count2 = Math.floor(Math.random() * 4) + 2;
    const count3 = Math.floor(Math.random() * 4) + 2;

    const componentData = {
      title: `Store Inventory`,
      symbol: cat1.emoji,
      orientation: currentOrientation,
      categories: [
        { label: cat1.label, emoji: cat1.emoji, count: count1 },
        { label: cat2.label, emoji: cat2.emoji, count: count2 },
        { label: cat3.label, emoji: cat3.emoji, count: count3 }
      ]
    };

    let answer, options, questionTextTemplate, mcqOptions = 'null', defectMapStr = 'null', hint, solutionSteps;

    if (isShort || isStructure || !isMCQ) {
      answer = String(count1);
      options = [answer];
      questionTextTemplate = getQText(`Look at the picture graph. Based on the symbols shown, how many total ${cat1.label} are recorded?`, `Total ${cat1.label} = ?`);
      hint = getQText(`Find the row labeled ${cat1.label} and count how many symbols are drawn next to it.`, `Count ${cat1.label} symbols.`);
      solutionSteps = getQText(`Looking closely at the graph rows, the category line for ${cat1.label} contains exactly ${count1} symbols.`, `${cat1.label} count is ${count1}.`);
    } else {
      answer = `${cat1.label}: ${count1}, ${cat2.label}: ${count2}, ${cat3.label}: ${count3}`;
      const wrongText1 = `${cat1.label}: ${count1 + 1}, ${cat2.label}: ${count2}, ${cat3.label}: ${count3 - 1}`;
      const wrongText2 = `${cat1.label}: ${count2}, ${cat2.label}: ${count1}, ${cat3.label}: ${count3}`;
      const wrongText3 = `${cat1.label}: ${count1 - 1}, ${cat2.label}: ${count2 + 1}, ${cat3.label}: ${count3}`;
      options = [answer, wrongText1, wrongText2, wrongText3].sort(() => Math.random() - 0.5);
      questionTextTemplate = getQText(`Look at the picture graph below. Which list shows the correct number of items in the graph?`, `Which list is correct?`);
      hint = getQText(`Count the symbols for each category row carefully, then match the quantities to the choices below.`, `Match row counts to list.`);
      solutionSteps = getQText(`Counting the rows one by one shows: ${answer}. This matches the correct option list.`, `The counts are: ${answer}.`);
      
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [wrongText1]: "CARELESS_CALCULATION",
        [wrongText2]: "CONCEPTUAL_ERROR",
        [wrongText3]: "CARELESS_CALCULATION"
      };
      defectMapStr = JSON.stringify(defectMapObj);
    }

    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

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
          "hint": ${JSON.stringify(hint)},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(solutionSteps)}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "create_graph", hideVisual: false }
    };
  },

  advanced_missing_data_point: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const pairedItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const [cat1, cat2, cat3] = getRandom(pairedItems, 3);
    
    const count1 = Math.floor(Math.random() * 4) + 2; 
    const count2 = Math.floor(Math.random() * 4) + 2; 
    const missingCount = Math.floor(Math.random() * 3) + 2; 
    const totalGraph = count1 + count2 + missingCount;
    const totalKnown = count1 + count2;
    const answer = String(missingCount);

    const componentData = {
      title: `Total Count: ${totalGraph}`,
      symbol: cat1.emoji,
      orientation: "HORIZONTAL",
      categories: [
        { label: cat1.label, emoji: cat1.emoji, count: count1 },
        { label: cat2.label, emoji: cat2.emoji, count: count2 },
        { label: `${cat3.label} (Hidden)`, emoji: cat3.emoji, count: 0 }
      ]
    };

    const questionTextTemplate = getQText(`The grand total number of items shown on the graph is ${totalGraph}, but the row for ${cat3.label} is blank. How many items belong in the ${cat3.label} category row?`, `Total is ${totalGraph}. Count for ${cat3.label} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, String(missingCount + 1), String(missingCount - 1), String(totalKnown)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(missingCount + 1)]: "CARELESS_CALCULATION",
        [String(missingCount - 1)]: "CARELESS_CALCULATION",
        [String(totalKnown)]: "CONCEPTUAL_ERROR"
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
          "hint": ${JSON.stringify(getQText(`First, add up the known categories. Then, subtract that from the total to find the missing part.`, `Total - known items = missing items.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Known items: ${count1} (${cat1.label}) + ${count2} (${cat2.label}) = ${totalKnown}. Total graph items: ${totalGraph}. Missing ${cat3.label} = ${totalGraph} - ${totalKnown} = ${missingCount}.`, `${totalGraph} - (${count1} + ${count2}) = ${missingCount}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "missing_data", hideVisual: false }
    };
  },

  advanced_clue_deduction_riddle: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const pairedItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const [cat1, cat2] = getRandom(pairedItems, 2);
    const currentOrientation = Math.random() > 0.5 ? "HORIZONTAL" : "VERTICAL";
    
    const count1 = Math.floor(Math.random() * 3) + 4; 
    const diff = Math.floor(Math.random() * 2) + 2; 
    const count2 = count1 - diff;
    const answer = String(count2);

    const componentData = {
      title: "Deduction Clue Graph",
      symbol: cat1.emoji,
      orientation: currentOrientation,
      categories: [
        { label: cat1.label, emoji: cat1.emoji, count: count1 },
        { label: cat2.label, emoji: cat2.emoji, count: count2 }
      ]
    };

    const questionTextTemplate = getQText(`Riddle Hint: There are ${count1} ${cat1.label}s on our graph. There are exactly ${diff} fewer ${cat2.label}s than ${cat1.label}s. Based on this rule, what is the count for ${cat2.label}?`, `${cat1.label} is ${count1}. ${cat2.label} is ${diff} fewer. Count for ${cat2.label} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, String(count1), String(count2 + 1), String(count1 + diff)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(count1)]: "CONCEPTUAL_ERROR",
        [String(count2 + 1)]: "CARELESS_CALCULATION",
        [String(count1 + diff)]: "CONFUSED_OPERATION"
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
          "hint": ${JSON.stringify(getQText(`Fewer means you subtract. Take away ${diff} from the count of ${cat1.label} (${count1}).`, `Subtract ${diff} from ${count1}.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Starting with ${count1} ${cat1.label}s, subtract ${diff} because there are fewer ${cat2.label}s. This gives: ${count1} - ${diff} = ${count2}.`, `${count1} - ${diff} = ${count2}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "deduction_riddle", hideVisual: true }
    };
  },

  advanced_total_graph_redistribution: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const pairedItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const [cat1, cat2] = getRandom(pairedItems, 2);
    const move = Math.floor(Math.random() * 2) + 1; 
    const targetVal = Math.floor(Math.random() * 3) + 3; 
    const c1 = targetVal + move;
    const c2 = targetVal - move;
    const answer = String(move);

    const questionTextTemplate = getQText(`How many items must move from ${cat1.label} to ${cat2.label} so that both rows have the same number?`, `Items to move from ${cat1.label} to ${cat2.label} to equalise = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, String(move + 1), String(move + 2), String(c1 - c2)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(move + 1)]: "CARELESS_CALCULATION",
        [String(move + 2)]: "CARELESS_CALCULATION",
        [String(c1 - c2)]: "CONCEPTUAL_ERROR"
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
          "hint": ${JSON.stringify(getQText(`Find the total items first, then see what half of that would be.`, `Find total, halve it, find difference to half.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Total = ${c1} + ${c2} = ${c1 + c2}. For rows to be equal, both need ${(c1 + c2) / 2}. Moving ${move} from the ${c1} row leaves ${(c1 + c2) / 2}.`, `Equal amount is ${(c1 + c2) / 2}. Difference is ${move}.`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "redistribution", hideVisual: true }
    };
  },

  advanced_comparative_sum_groups: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const pairedItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const [cat1, cat2, cat3] = getRandom(pairedItems, 3);
    
    const count1 = Math.floor(Math.random() * 3) + 2;
    const count2 = Math.floor(Math.random() * 3) + 1;
    const balanceNeeded = Math.floor(Math.random() * 3) + 2; 
    const count3 = count1 + count2 + balanceNeeded;
    const answer = String(balanceNeeded);

    const questionTextTemplate = getQText(`How many MORE icons must be added to ${cat1.label} and ${cat2.label} rows combined to equal ${cat3.label}?`, `How many more needed for (${cat1.label} + ${cat2.label}) to equal ${cat3.label}?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, String(balanceNeeded + 1), String(count3), String(count1 + count2)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(balanceNeeded + 1)]: "CARELESS_CALCULATION",
        [String(count3)]: "CONCEPTUAL_ERROR",
        [String(count1 + count2)]: "CONCEPTUAL_ERROR"
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
          "hint": ${JSON.stringify(getQText(`Add up the items in the first two rows, then find the difference to the third row.`, `Find sum of first two, then difference to third.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${cat1.label} + ${cat2.label} = ${count1} + ${count2} = ${count1 + count2}. Target is ${count3}. Difference = ${count3} - ${count1 + count2} = ${balanceNeeded}.`, `${count3} - (${count1} + ${count2}) = ${balanceNeeded}.`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "comparative_sum", hideVisual: true }
    };
  },

  advanced_data_entry_mistake: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const pairedItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const targetCat = pairedItems[0];
    const accurateCount = Math.floor(Math.random() * 4) + 3; 
    const extraCount = Math.floor(Math.random() * 3) + 1; 
    const flawedCount = accurateCount + extraCount;
    const answer = String(extraCount);

    const questionTextTemplate = getQText(`Someone was supposed to draw exactly ${accurateCount} ${targetCat.label.toLowerCase()} in the graph, but they accidentally drew ${flawedCount}. How many EXTRA symbols did they draw?`, `Expected ${accurateCount}. Drawn ${flawedCount}. Extra = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, String(extraCount + 1), String(accurateCount), "0"];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(extraCount + 1)]: "CARELESS_CALCULATION",
        [String(accurateCount)]: "CONCEPTUAL_ERROR",
        "0": "CONCEPTUAL_ERROR"
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
          "hint": ${JSON.stringify(getQText(`Compare the target number to the number of pictures in the graph.`, `Difference between drawn and expected.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The graph shows ${flawedCount} symbols, but there should be ${accurateCount}. The difference is ${flawedCount} - ${accurateCount} = ${extraCount} extra symbols.`, `${flawedCount} - ${accurateCount} = ${extraCount}.`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 1, logic: "data_mistake", hideVisual: true }
    };
  },

  advanced_backwards_tracking_total: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const pairedItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const [cat1, cat2, cat3] = getRandom(pairedItems, 3);
    const c1 = Math.floor(Math.random() * 3) + 2; 
    const c2 = Math.floor(Math.random() * 3) + 1; 
    const hidden = Math.floor(Math.random() * 4) + 2;
    const totalValue = c1 + c2 + hidden;
    const answer = String(hidden);

    const questionTextTemplate = getQText(`The total items is ${totalValue}. Based on the other rows (${cat1.label}: ${c1}, ${cat2.label}: ${c2}), what is the count for the unknown ${cat3.label} row?`, `Total = ${totalValue}. ${cat1.label} = ${c1}, ${cat2.label} = ${c2}. ${cat3.label} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, String(hidden + 1), String(c1 + c2), "0"];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(hidden + 1)]: "CARELESS_CALCULATION",
        [String(c1 + c2)]: "CONCEPTUAL_ERROR",
        "0": "CONCEPTUAL_ERROR"
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
          "hint": ${JSON.stringify(getQText(`Subtract all the items you can see from the total of ${totalValue}.`, `Total - known items.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Total (${totalValue}) - ${cat1.label} (${c1}) - ${cat2.label} (${c2}) = ${hidden}.`, `${totalValue} - ${c1} - ${c2} = ${hidden}.`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "backwards_total", hideVisual: true }
    };
  },

  advanced_hypothetical_sharing: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const pairedItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
    const [cat1, cat2] = getRandom(pairedItems, 2);
    const shared = Math.floor(Math.random() * 2) + 2; 
    const c1 = Math.floor(Math.random() * 3) + 4; 
    const c2 = Math.floor(Math.random() * 4) + 2; 
    const total = c1 + c2;
    const answer = String(total - shared);

    const questionTextTemplate = getQText(`If ${shared} items from the ${cat1.label} row (${c1}) are given away, how many items are left in the whole graph (${cat2.label}: ${c2})?`, `Give away ${shared} from ${cat1.label} (${c1}). Total left with ${cat2.label} (${c2}) = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, String(total), String(c1 - shared), String(c2)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(total)]: "CONCEPTUAL_ERROR",
        [String(c1 - shared)]: "CONCEPTUAL_ERROR",
        [String(c2)]: "CONCEPTUAL_ERROR"
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
          "hint": ${JSON.stringify(getQText(`Find the total number of items first, then subtract the ${shared} items that were given away.`, `Total items - items given away.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Total = ${c1} + ${c2} = ${total}. Subtracting the ${shared} given away: ${total} - ${shared} = ${total - shared}.`, `(${c1} + ${c2}) - ${shared} = ${answer}.`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "hypothetical_sharing", hideVisual: true }
    };
  }
};

export const advancedLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (advancedVariants[activeVariant]) {
    return advancedVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};