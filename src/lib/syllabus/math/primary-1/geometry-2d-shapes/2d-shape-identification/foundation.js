import { getRandomContext } from '@/lib/utils/localization';
import { getRandomShapes, getRandomColors, getRandomNames, SHAPES_POOL, COLORS_POOL } from '@/lib/utils/variable-bank';

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const getShuffledOptions = (correct, distractors) => {
  return [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
};

export const foundationVariants = {
  foundation_identify_shape: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const targetShape = getRandomShapes(1);
    const rotation = Math.floor(Math.random() * 8) * 45;
    const componentData = { 
      shapeType: targetShape, 
      color: getRandomColors(1), 
      size: "medium", 
      rotation, 
      layout: "SINGLE" 
    };

    const distractors = SHAPES_POOL.filter(s => s !== targetShape).slice(0, 3);
    const answer = capitalize(targetShape);
    const questionTextTemplate = getQText(`What shape is shown in the picture?`, `Name this shape.`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = SHAPES_POOL.map(capitalize);
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
          "solutionSteps": ${JSON.stringify(getQText(`This shape is a ${targetShape}. It has ${targetShape === 'circle' ? 'no straight sides' : (targetShape === 'triangle' ? '3 straight sides' : (targetShape === 'half circle' ? '1 straight side and 1 curved side' : (targetShape === 'quarter circle' ? '2 straight sides and 1 curved side' : '4 straight sides')))}.`, `It is a ${targetShape}.`))}
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
    const targetColor = getRandomColors(1);
    const targetShape = getRandomShapes(1);
    const targetValue = useColor ? targetColor : targetShape;

    const componentData = { 
      layout: "GROUPS", 
      groups: [
        { label: "Group A", items: [{ shapeType: targetShape, color: targetColor, size: "medium" }] },
        { label: "Group B", items: [{ shapeType: SHAPES_POOL.find(s => s !== targetShape), color: COLORS_POOL.find(c => c !== targetColor), size: "medium" }] },
        { label: "Group C", items: [{ shapeType: SHAPES_POOL.find(s => s !== targetShape), color: COLORS_POOL.find(c => c !== targetColor), size: "medium" }] }
      ]
    };

    const answer = "Group A";
    const questionTextTemplate = getQText(`Which group shows shapes that are ${targetValue}?`, `Which group is ${targetValue}?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

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
    const targetShape = getRandomShapes(1);
    let sideCount = 4;
    if (targetShape === "triangle") sideCount = 3;
    if (targetShape === "half circle") sideCount = 1;
    if (targetShape === "quarter circle") sideCount = 2;
    if (targetShape === "circle") sideCount = 0;

    const componentData = { 
      shapeType: targetShape, 
      color: getRandomColors(1), 
      size: "large", 
      rotation: 0, 
      layout: "SINGLE" 
    };

    const answer = String(sideCount);
    const questionTextTemplate = getQText(`How many straight sides does this ${targetShape} have?`, `Number of straight sides = ?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)} that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [answer, ...["0", "1", "2", "3", "4", "5"].filter(x => x !== answer).slice(0, 3)];

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
    const targetShape = getRandomShapes(1);
    const targetColor = getRandomColors(1);
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
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

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
      { name: "bowl", shape: "Half Circle", emoji: "🥣", clue: "It has 1 straight side across the top and 1 curved side at the bottom." }
    ];

    const target = realWorldObjects[Math.floor(Math.random() * realWorldObjects.length)];
    const componentData = { layout: "EMOJI", emoji: target.emoji, name: target.name };
    const answer = target.shape;

    const questionTextTemplate = getQText(`A ${target.name} looks like a...`, `What shape is a ${target.name}?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = ["Circle", "Triangle", "Square", "Rectangle", "Half Circle", "Quarter Circle"];
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

export const foundationLogic = {
  generate: (variant, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const _isMCQ = isMCQ ?? (type === 'MCQ');
    const _isShort = isShort ?? (type === 'Short Question');
    const _isStructure = isStructure ?? (type === 'Structured Question');
    const _zodType = zodType ?? type;
    const _zodDiff = zodDiff ?? 'Foundation';
    const _level = level ?? 'Primary 1';
    const _topic = topic ?? 'Geometry - 2D Shapes';
    const _formatInstructions = formatInstructions ?? '';
    const _context = context ?? {};
    const _getQText = getQText ?? ((t1, t2) => t1);

    const activeVariant = variant || Object.keys(foundationVariants)[Math.floor(Math.random() * Object.keys(foundationVariants).length)];
    if (foundationVariants[activeVariant]) {
      return foundationVariants[activeVariant]({}, type, _isMCQ, _isShort, _isStructure, _zodType, _zodDiff, _level, _topic, _formatInstructions, _context, _getQText);
    }
  }
};