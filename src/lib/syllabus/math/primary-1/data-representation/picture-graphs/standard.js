import { getRandomContext } from '@/lib/utils/localization';
import { getRandomTheme } from '@/lib/utils/variable-bank';

const getRandom = (arr, count) => [...arr].sort(() => Math.random() - 0.5).slice(0, count);
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const getShuffledOptions = (correct, distractors) => {
  return [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
};

export const standardVariants = {
  standard_read_all_categories: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const uniqueCounts = [1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
    const baseCategories = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i], count: uniqueCounts[i] }));
    const targetIdx = Math.floor(Math.random() * 4);
    const target = baseCategories[targetIdx];
    const answer = String(target.count);

    const componentData = { title: `Our ${capitalize(selectedTheme.name)}`, symbol: target.emoji, orientation, categories: baseCategories };

    const questionTextTemplate = getQText(`Look at the graph. How many ${target.label.toLowerCase()} are there?`, `Number of ${target.label.toLowerCase()} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = [answer, "2", "4", "5", "7"];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(answer, ["2", "4", "5", "7"]).sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        "2": "CARELESS_CALCULATION",
        "4": "CARELESS_CALCULATION",
        "5": "CARELESS_CALCULATION",
        "7": "CARELESS_CALCULATION"
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
          "hint": ${JSON.stringify(getQText(`Find the label for ${target.label} and count how many icons are in its line.`, `Count the icons for ${target.label}.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Locate the ${target.label} category. We can see there are ${target.count} icons, and each stands for 1 item.`, `${target.label} count is ${target.count}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "read_all", hideVisual: false }
    };
  },

  standard_most_least_frequent: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const uniqueCounts = [1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
    const baseCategories = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i], count: uniqueCounts[i] }));
    const componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };
    
    const askMost = Math.random() > 0.5;
    const target = askMost 
      ? baseCategories.reduce((prev, curr) => (prev.count > curr.count) ? prev : curr)
      : baseCategories.reduce((prev, curr) => (prev.count < curr.count) ? prev : curr);
    const answer = target.label;

    const questionTextTemplate = getQText(`Which category has the ${askMost ? 'most' : 'least'} items?`, `Category with ${askMost ? 'most' : 'least'} items = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = baseCategories.map(c => c.label);
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
          "hint": ${JSON.stringify(getQText(`Look for the ${askMost ? 'longest' : 'shortest'} line of pictures in the graph.`, `Find the ${askMost ? 'longest' : 'shortest'} row.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Compare all lines. The ${target.label} line has ${target.count} pictures, which is the ${askMost ? 'highest' : 'lowest'} number.`, `${target.label} has the ${askMost ? 'most' : 'least'}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "most_least_freq", hideVisual: false }
    };
  },

  standard_difference_two_categories: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const uniqueCounts = [1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
    const baseCategories = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i], count: uniqueCounts[i] }));
    const [cat1, cat2] = getRandom(baseCategories, 2);
    const diff = Math.abs(cat1.count - cat2.count);
    const answer = String(diff);
    const componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };

    const questionTextTemplate = getQText(`How many more ${cat1.count > cat2.count ? cat1.label.toLowerCase() : cat2.label.toLowerCase()} are there than ${cat1.count > cat2.count ? cat2.label.toLowerCase() : cat1.label.toLowerCase()}?`, `Difference between ${cat1.label} and ${cat2.label} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = [answer, "1", "2", "3", "5"];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(answer, ["1", "2", "3", "5"]).sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        "1": "CARELESS_CALCULATION",
        "2": "CARELESS_CALCULATION",
        "3": "CARELESS_CALCULATION",
        "5": "CARELESS_CALCULATION"
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
          "hint": ${JSON.stringify(getQText(`Count the items in both groups and subtract the smaller number from the bigger number.`, `Subtract the smaller from the bigger.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`There are ${cat1.count} ${cat1.label.toLowerCase()} and ${cat2.count} ${cat2.label.toLowerCase()}. To find the difference: ${Math.max(cat1.count, cat2.count)} - ${Math.min(cat1.count, cat2.count)} = ${diff}.`, `${Math.max(cat1.count, cat2.count)} - ${Math.min(cat1.count, cat2.count)} = ${diff}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "difference_two", hideVisual: false }
    };
  },

  standard_combine_two_groups_vs_third: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const uniqueCounts = [1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
    const baseCategories = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i], count: uniqueCounts[i] }));
    const [c1, c2, c3] = getRandom(baseCategories, 3);
    const combined = c1.count + c2.count;
    const isMore = combined > c3.count;
    const answer = isMore ? "Yes" : "No";
    const componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };

    const questionTextTemplate = getQText(`If we combine the ${c1.label.toLowerCase()} and the ${c2.label.toLowerCase()}, are there more than the ${c3.label.toLowerCase()}?`, `Is ${c1.label} + ${c2.label} > ${c3.label}?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = ["Yes", "No", "Exactly the same"];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        "Exactly the same": "CONCEPTUAL_ERROR",
      };
      defectMapObj[isMore ? "No" : "Yes"] = "CONCEPTUAL_ERROR";
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
          "hint": ${JSON.stringify(getQText(`Add the count of ${c1.label} and ${c2.label} together first, then compare that sum to ${c3.label}.`, `Compare sum to the third group.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${c1.label} (${c1.count}) + ${c2.label} (${c2.count}) = ${combined}. Since ${combined} is ${isMore ? 'more' : 'less'} than ${c3.count}, the answer is ${isMore ? 'Yes' : 'No'}.`, `${c1.count} + ${c2.count} = ${combined}. Result: ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "combine_vs_third", hideVisual: false }
    };
  },

  standard_fewer_than_threshold: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const uniqueCounts = [1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
    const baseCategories = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i], count: uniqueCounts[i] }));
    const threshold = Math.floor(Math.random() * 3) + 3;
    const countBelow = baseCategories.filter(c => c.count < threshold).length;
    const answer = String(countBelow);
    const componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };

    const questionTextTemplate = getQText(`How many categories have fewer than ${threshold} pictures?`, `Number of categories with fewer than ${threshold} pictures = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = [answer, "0", "1", "2", "3", "4"];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(answer, ["0", "1", "2", "3", "4"]).sort(() => Math.random() - 0.5);
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
          "hint": ${JSON.stringify(getQText(`Look at each row. Count how many rows have a line of pictures shorter than ${threshold}.`, `Count rows with less than ${threshold}.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The counts are: ${baseCategories.map(c => `${c.label}(${c.count})`).join(', ')}. Rows with fewer than ${threshold} are: ${baseCategories.filter(c => c.count < threshold).map(c => c.label).join(', ') || 'none'}.`, `Count is ${countBelow}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "fewer_than", hideVisual: false }
    };
  },

  standard_rank_three_categories: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const uniqueCounts = [1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
    const baseCategories = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i], count: uniqueCounts[i] }));
    const selection = getRandom(baseCategories, 3);
    const isMostToLeast = Math.random() > 0.5;
    const sorted = [...selection].sort((a, b) => isMostToLeast ? b.count - a.count : a.count - b.count);
    const finalAnswer = sorted.map(c => c.label).join(", ");
    const componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };

    const questionTextTemplate = getQText(`Arrange these 3 categories from ${isMostToLeast ? 'most to least' : 'least to most'}: ${selection.map(c => c.label).join(", ")}.`, `Arrange ${isMostToLeast ? 'most to least' : 'least to most'}: ${selection.map(c => c.label).join(", ")}`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = [finalAnswer, [...sorted].reverse().map(c => c.label).join(", "), [sorted[1], sorted[0], sorted[2]].map(c => c.label).join(", "), [sorted[0], sorted[2], sorted[1]].map(c => c.label).join(", ")];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== finalAnswer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
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
          "hint": ${JSON.stringify(getQText(`Find the number for each item first, then put them in order based on their counts!`, `Count each, then order them.`))},
          "finalAnswer": "${finalAnswer}",
          "solutionSteps": ${JSON.stringify(getQText(`The counts are: ${selection.map(c => `${c.label}: ${c.count}`).join(', ')}. Ordering them ${isMostToLeast ? 'most to least' : 'least to most'} gives: ${finalAnswer}.`, `Order is ${finalAnswer}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "rank_three", hideVisual: false }
    };
  },

  standard_equal_value_groups: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const uniqueCounts = [1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
    const baseCategories = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i], count: uniqueCounts[i] }));
    const [c1, c2] = getRandom(baseCategories, 2);
    const twinCount = Math.floor(Math.random() * 4) + 3;
    const categories = baseCategories.map(c => {
      if (c.label === c1.label || c.label === c2.label) return { ...c, count: twinCount };
      return { ...c, count: c.count === twinCount ? 2 : c.count };
    });
    const componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories };

    const answer = `${c1.label} and ${c2.label}`;
    const questionTextTemplate = getQText(`Which two categories have the same number of items?`, `Categories with equal items = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = [answer, `${categories[0].label} and ${categories[2].label}`, `${categories[1].label} and ${categories[3].label}`, "None of them"];
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
          "hint": ${JSON.stringify(getQText(`Look for two rows where the line of pictures is exactly the same length.`, `Find two rows of equal length.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Count every row. ${c1.label} and ${c2.label} both have exactly ${twinCount} pictures.`, `${c1.label} and ${c2.label} have the same count.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "equal_groups", hideVisual: false }
    };
  },

  standard_add_item_prediction: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const selectedTheme = getRandomTheme(4);
    const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
    const uniqueCounts = [1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
    const baseCategories = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i], count: uniqueCounts[i] }));
    const target = baseCategories[Math.floor(Math.random() * 4)];
    const answer = String(target.count + 1);
    const componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };

    const questionTextTemplate = getQText(`If we add 1 more ${target.emoji} to the ${target.label} row, how many ${target.label.toLowerCase()} will there be in total?`, `Add 1 to ${target.label}. Total = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}).`;

    let options = [answer, String(target.count), String(target.count - 1), String(target.count + 2)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(target.count)]: "CONCEPTUAL_ERROR",
        [String(target.count - 1)]: "CONCEPTUAL_ERROR",
        [String(target.count + 2)]: "CARELESS_CALCULATION"
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
          "hint": ${JSON.stringify(getQText(`Count the ${target.label} currently in the graph and then add 1 more!`, `Current count + 1.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`There are currently ${target.count} ${target.label.toLowerCase()}. Adding one more: ${target.count} + 1 = ${target.count + 1}.`, `${target.count} + 1 = ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "PICTURE_GRAPH_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": ${isStructure ? `{"inputType": "MULTI_STEP_INPUT", "steps": [{"stepLabel": "Identify Category", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Count Items", "expectedAnswer": "FILL_ME_IN"}, {"stepLabel": "Final Answer", "expectedAnswer": "FILL_ME_IN"}]}` : `{"inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "add_prediction", hideVisual: false }
    };
  }
};

export const standardLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (standardVariants[activeVariant]) {
    return standardVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};