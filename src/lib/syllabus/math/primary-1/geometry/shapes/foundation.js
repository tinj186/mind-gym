import { getRandomContext } from '@/lib/utils/localization';

const shapes = ["circle", "triangle", "square", "rectangle"];
const colors = ["red", "blue", "yellow", "green"];

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const getShuffledOptions = (correct, distractors) => {
  return [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
};

export const foundationVariants = {
  foundation_identify_shape: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    const rotation = Math.floor(Math.random() * 8) * 45;
    const componentData = { 
      shapeType: targetShape, 
      color: colors[Math.floor(Math.random() * colors.length)], 
      size: "medium", 
      rotation, 
      layout: "SINGLE" 
    };

    const answer = capitalize(targetShape);
    const questionTextTemplate = getQText(`What shape is shown in the picture?`, `Name this shape.`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context about finding a shape.`;

    let options = shapes.map(capitalize);
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
          "hint": ${JSON.stringify(getQText(`Count the number of straight sides or look for curves!`, `Count the sides.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`This shape is a ${targetShape}. It has ${targetShape === 'circle' ? 'no straight sides' : (targetShape === 'triangle' ? '3 sides' : '4 sides')}.`, `It is a ${targetShape}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "identify_shape", hideVisual: false }
    };
  },

  foundation_classify_attribute: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const useColor = Math.random() > 0.5;
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    const targetValue = useColor ? targetColor : targetShape;

    const componentData = { 
      layout: "GROUPS", 
      groups: [
        { label: "Group A", items: [{ shapeType: targetShape, color: targetColor, size: "medium" }] },
        { label: "Group B", items: [{ shapeType: shapes.find(s => s !== targetShape), color: colors.find(c => c !== targetColor), size: "medium" }] },
        { label: "Group C", items: [{ shapeType: shapes.find(s => s !== targetShape), color: colors.find(c => c !== targetColor), size: "medium" }] }
      ]
    };

    const answer = "Group A";
    const questionTextTemplate = getQText(`Which group shows shapes that are ${targetValue}?`, `Which group is ${targetValue}?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = ["Group A", "Group B", "Group C"];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        "Group B": "CONCEPTUAL_ERROR",
        "Group C": "CONCEPTUAL_ERROR"
      };
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
          "hint": ${JSON.stringify(getQText(`Look at the ${useColor ? 'colors' : 'shapes'} of each item carefully!`, `Check the ${useColor ? 'color' : 'shape'}.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(useColor ? `Only Group A contains a shape that is ${targetColor}. The other groups have different colors.` : `Only Group A contains a ${targetShape}. The other groups have different shapes.`, `Group A is correct.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "classify_attribute", hideVisual: false }
    };
  },

  foundation_count_sides: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const countShapes = ["triangle", "square", "rectangle"];
    const targetShape = countShapes[Math.floor(Math.random() * countShapes.length)];
    const sideCount = targetShape === "triangle" ? 3 : 4;

    const componentData = { 
      shapeType: targetShape, 
      color: colors[Math.floor(Math.random() * colors.length)], 
      size: "large", 
      rotation: 0, 
      layout: "SINGLE" 
    };

    const answer = String(sideCount);
    const questionTextTemplate = getQText(`How many straight sides does this ${targetShape} have?`, `Number of straight sides = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, "1", "2", "5"];
    if (sideCount === 3) options.push("4");
    else options.push("3");
    options = options.slice(0, 4);

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
          "hint": ${JSON.stringify(getQText(`Run your finger along the edges and count each straight line!`, `Count the straight edges.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`A ${targetShape} has exactly ${sideCount} straight lines connected together.`, `It has ${sideCount} sides.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "count_sides", hideVisual: false }
    };
  },

  foundation_size_comparison: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    const askSmallest = Math.random() > 0.5;

    const items = [
      { shapeType: targetShape, color: targetColor, size: "small", label: "Item A" },
      { shapeType: targetShape, color: targetColor, size: "medium", label: "Item B" },
      { shapeType: targetShape, color: targetColor, size: "large", label: "Item C" }
    ].sort(() => Math.random() - 0.5);

    const componentData = { layout: "GRID", items };
    const targetItem = items.find(i => i.size === (askSmallest ? "small" : "large"));
    const answer = targetItem.label;

    const questionTextTemplate = getQText(`Which ${targetShape} is the ${askSmallest ? 'smallest' : 'largest'}?`, `Identify the ${askSmallest ? 'smallest' : 'largest'} ${targetShape}.`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = ["Item A", "Item B", "Item C"];
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
          "hint": ${JSON.stringify(getQText(`Compare the shapes side by side. Which one looks the biggest or smallest?`, `Compare the sizes.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Comparing the three ${targetShape}s, ${targetItem.label} takes up the ${askSmallest ? 'least' : 'most'} amount of space.`, `${targetItem.label} is the ${askSmallest ? 'smallest' : 'largest'}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "size_comparison", hideVisual: false }
    };
  },

  foundation_match_real_object: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const realWorldObjects = [
      { name: "coin", shape: "Circle", emoji: "🪙", clue: "It is perfectly round metal money with no straight edges." },
      { name: "doughnut", shape: "Circle", emoji: "🍩", clue: "It is perfectly round with a hole in the middle." },
      { name: "envelope", shape: "Rectangle", emoji: "✉️", clue: "It has 2 long straight sides and 2 short straight sides." },
      { name: "chocolate bar", shape: "Rectangle", emoji: "🍫", clue: "It is a long sweet treat with straight sides." },
      { name: "window pane", shape: "Square", emoji: "🪟", clue: "It has 4 straight sides that are exactly the same length." },
      { name: "cheese wedge", shape: "Triangle", emoji: "🧀", clue: "It has 3 straight sides and pointy corners." },
      { name: "pizza slice", shape: "Triangle", emoji: "🍕", clue: "It has 3 straight sides and comes to a sharp point." },
    ];

    const target = realWorldObjects[Math.floor(Math.random() * realWorldObjects.length)];
    const componentData = { layout: "EMOJI", emoji: target.emoji, name: target.name };
    const answer = target.shape;

    const questionTextTemplate = getQText(`A ${target.name} looks like a...`, `What shape is a ${target.name}?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = ["Circle", "Triangle", "Square", "Rectangle"];
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
          "hint": ${JSON.stringify(getQText(target.clue, `Think of the shape's outline.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Most ${target.name}s have the outline of a ${target.shape.toLowerCase()}.`, `It is a ${target.shape.toLowerCase()}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "match_real_object", hideVisual: false }
    };
  }
};

export const foundationLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (foundationVariants[activeVariant]) {
    return foundationVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};