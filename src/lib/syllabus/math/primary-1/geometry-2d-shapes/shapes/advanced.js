import { getRandomContext } from '@/lib/utils/localization';
import { getRandomShapes, getRandomColors, getRandomGeometrySubjects, getRandomNames, SHAPES_POOL, COLORS_POOL } from '@/lib/utils/variable-bank';

const colorNames = { "#ef4444": "red", "#3b82f6": "blue", "#eab308": "yellow", "#22c55e": "green", "#a855f7": "purple", "#f97316": "orange" };
const sizeTiers = ["small", "medium", "large"];

const getRandom = (arr, count) => [...arr].sort(() => Math.random() - 0.5).slice(0, count);
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const getShuffledOptions = (correct, distractors) => {
  return [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
};

export const advancedVariants = {
  advanced_pattern_two_attributes: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const [s1, s2] = getRandomShapes(2);
    const [c1, c2] = getRandomColors(2);
    
    const p1 = { shapeType: s1, size: "medium", color: c1 };
    const p2 = { shapeType: s2, size: "medium", color: c2 };
    const componentData = { layout: "PATTERN", pattern: [p1, p2, p1, p2], nextItem: p1 };

    const answer = `${capitalize(c1)} ${capitalize(s1)}`;
    const questionTextTemplate = getQText(`What comes next in the pattern?`, `Next shape = ?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [answer, `${capitalize(c2)} ${capitalize(s2)}`, `${capitalize(c2)} ${capitalize(s1)}`, `${capitalize(c1)} ${capitalize(s2)}`];
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
          "hint": ${JSON.stringify(getQText(`Look at the shape and the color. They both change every time!`, `Observe changing properties.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The pattern shows a ${c1} ${s1} followed by a ${c2} ${s2}. To continue the pattern, we need a ${c1} ${s1} again.`, `It is a ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "pattern_two_attr", hideVisual: false }
    };
  },

  advanced_attribute_logic: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const [c1, c2] = getRandomColors(2);
    const [s1, s2] = getRandomShapes(2);
    const items = [
      { shapeType: s1, color: c1, size: "medium", label: "A" },
      { shapeType: s1, color: c2, size: "medium", label: "B" },
      { shapeType: s2, color: c1, size: "medium", label: "C" },
    ].sort(() => Math.random() - 0.5);

    const componentData = { layout: "GRID", items };
    const target = items.find(i => i.shapeType === s1 && i.color === c1);
    const answer = `Item ${target.label}`;

    const questionTextTemplate = getQText(`Which item is a ${s1} AND is colored ${colorNames[c1]}?`, `Find the ${colorNames[c1]} ${s1}.`);
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
          "hint": ${JSON.stringify(getQText(`You need to find a shape that matches both rules: it must be a ${s1} and also be ${colorNames[c1]}.`, `Match both rules.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Look at each item. Only Item ${target.label} is both a ${s1} and colored ${colorNames[c1]}.`, `It is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "attribute_logic", hideVisual: false }
    };
  },

  advanced_pattern_three_attributes: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const [s1, s2] = getRandomShapes(2);
    const [c1, c2] = getRandomColors(2);
    // Force maximum contrast (Small vs Large) to prevent visual ambiguity
    const sizes = Math.random() > 0.5 ? ["small", "large"] : ["large", "small"];
    const [sz1, sz2] = sizes;

    const p1 = { shapeType: s1, color: c1, size: sz1 };
    const p2 = { shapeType: s2, color: c2, size: sz2 };
    const componentData = { layout: "PATTERN", pattern: [p1, p2, p1, p2] };

    const answer = `${capitalize(sz1)} ${capitalize(c1)} ${capitalize(s1)}`;
    const questionTextTemplate = getQText(`Which shape comes next in this complex pattern?`, `Next shape in pattern = ?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [answer, `${capitalize(sz2)} ${capitalize(c2)} ${capitalize(s2)}`, `${capitalize(sz1)} ${capitalize(c2)} ${capitalize(s1)}`, `${capitalize(sz2)} ${capitalize(c1)} ${capitalize(s2)}`];
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
          "hint": ${JSON.stringify(getQText(`Watch the shape, the color, AND the size. All three things repeat in order!`, `Identify all 3 changing properties.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The pattern repeats two different items. The first item is a ${sz1} ${c1} ${s1}. This is what comes after the second item.`, `It is a ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "pattern_three_attr", hideVisual: false }
    };
  },

  advanced_pattern_retrograde_logic: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const [s1, s2] = getRandomShapes(2);
    const [c1] = getRandomColors(1);
    const pattern = [s1, s2, s1, s2].map(s => ({ shapeType: s, color: c1, size: "medium" }));
    const componentData = { layout: "PATTERN", pattern, gapIndex: 0 };

    const answer = capitalize(s1);
    const questionTextTemplate = getQText(`Look at the pattern. What shape is missing at the start?`, `Missing first shape = ?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = SHAPES_POOL.map(capitalize);
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
          "hint": ${JSON.stringify(getQText(`Look at the shapes that come after the gap to see how the pattern repeats backwards.`, `Check backward pattern.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The pattern follows an ABAB rule. Since the second shape is a ${s2}, the first shape must be a ${s1}.`, `Missing is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "pattern_retro", hideVisual: false }
    };
  },

  advanced_shape_exclusion_riddles: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const [s1, s2, s3] = getRandomShapes(3);
    const sides = s1 === "triangle" ? 3 : (s1 === "circle" ? 0 : 4);
    const answer = capitalize(s1);

    const questionTextTemplate = getQText(`I am NOT a ${s2}. I am NOT a ${s3}. I have exactly ${sides} straight sides. What shape am I?`, `Not ${s2}, not ${s3}, has ${sides} sides. Shape = ?`);
    const storyInstruction = "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A RIDDLE SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples.";

    let options = SHAPES_POOL.map(capitalize);
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
          "questionText": ${JSON.stringify(questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Focus on the number of straight sides to find the answer!`, `Use side count.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`A ${s1} is the only shape that has exactly ${sides} sides and is not a ${s2} or ${s3}.`, `Shape is ${answer}.`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "exclusion_riddle", hideVisual: true }
    };
  },

  advanced_embedded_counting: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const [targetShape] = getRandom(["square", "circle", "triangle"], 1);
    const count = Math.floor(Math.random() * 2) + 3; 
    const parts = Array.from({ length: count }, (_, i) => ({
      shapeType: targetShape,
      color: COLORS_POOL[i % COLORS_POOL.length],
      x: 50,
      y: 50,
      scale: 2.5 - (i * 0.5),
      opacity: Math.max(0.3, 0.8 - (i * 0.15)),
      zIndex: 10 + (count - i)
    }));
    const componentData = { layout: "COMPOSITE_GENERATIVE", parts };

    const answer = String(count);
    const questionTextTemplate = getQText(`How many ${targetShape}s are nested inside each other in this picture?`, `Nested ${targetShape}s count = ?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = ["2", "3", "4", "5"];
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
          "hint": ${JSON.stringify(getQText(`Count each shape from the biggest one on the outside to the smallest one in the middle!`, `Count layers.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Looking at the center, we can see ${count} separate ${targetShape}s drawn inside one another.`, `Count is ${count}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "embedded_counting", hideVisual: false }
    };
  },

  advanced_composite_deconstruct_inventory: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const subjects = ["rocket", "robot", "truck", "castle", "house", "boat", "train"];
    const sub = subjects[Math.floor(Math.random() * subjects.length)];
    const componentData = { layout: "COMPOSITE_GENERATIVE", parts: [], name: sub };

    const questionTextTemplate = getQText(`Which list shows all the shapes used to build this ${sub}?`, `Inventory of shapes for ${sub} = ?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      TASK: You are an artist and a math teacher! 
      1. Draw a '${sub}' using ONLY basic 2D shapes (circle, square, rectangle, triangle).
      2. Create 4 to 8 shapes. Output them in visualEngine.componentData.parts.
      3. Each part needs: shapeType, color (hex), x (20-80), y (20-80), scale (0.5 to 2.0). 
      4. Based on your drawing, calculate the EXACT inventory of shapes.
      5. Set content.finalAnswer to the correct inventory string (e.g. "1 Rectangle, 2 Circles, 1 Triangle").
      6. Generate 3 plausible distractors for content.options (e.g. swap a shape type or count).
      7. For "defectMap", map distractors to "CONCEPTUAL_ERROR".

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ["{inventory}", "{distractor1}", "{distractor2}", "{distractor3}"],
          "defectMap": { "{distractor1}": "CONCEPTUAL_ERROR", "{distractor2}": "CONCEPTUAL_ERROR", "{distractor3}": "CONCEPTUAL_ERROR" },
          "hint": ${JSON.stringify(getQText(`Break the drawing down into pieces and count how many of each shape you see.`, `Count all shape types.`))},
          "finalAnswer": "{inventory}",
          "solutionSteps": ${JSON.stringify(getQText(`The ${sub} is made of {inventory}.`, `Inventory is {inventory}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "deconstruct_inventory", hideVisual: false }
    };
  },

  advanced_attribute_matrix_intersection: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const [c1, c2] = getRandomColors(2);
    const [s1, s2] = getRandomShapes(2);
    const componentData = {
      layout: "GRID",
      items: [
        { shapeType: s1, color: c1, size: "medium", label: "1" },
        { shapeType: s1, color: c2, size: "medium", label: "2" },
        { shapeType: s2, color: c1, size: "medium", label: "3" },
        { shapeType: s2, color: c2, size: "medium", label: "4" }
      ]
    };
    const answer = "Item 3";

    const questionTextTemplate = getQText(`Find the item that fits this rule: It must be a ${s2} AND it must be ${colorNames[c1]}.`, `Find the ${colorNames[c1]} ${s2}.`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = ["Item 1", "Item 2", "Item 3", "Item 4"];
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
          "hint": ${JSON.stringify(getQText(`Look for the shape first, then check if it has the right color.`, `Check shape and color.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Only Item 3 is a ${s2} that is also colored ${colorNames[c1]}.`, `Item 3 fits the rule.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "matrix_intersection", hideVisual: false }
    };
  },

  advanced_orientation_invariance: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const target = getRandom(["square", "triangle", "rectangle"], 1)[0];
    const rotation = Math.floor(Math.random() * 200) + 30; 
    const componentData = { shapeType: target, color: getRandomColors(1), size: "large", rotation, layout: "SINGLE" };
    const answer = capitalize(target);

    const questionTextTemplate = getQText(`Even though this shape is tilted, what shape is it?`, `Name this tilted shape.`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = SHAPES_POOL.map(capitalize);
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
          "hint": ${JSON.stringify(getQText(`Try tilting your head! Count the sides and corners to be sure.`, `Count sides to identify.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`A shape stays the same even if you turn it. This shape has ${target === "triangle" ? 3 : 4} sides, so it is a ${target}.`, `It is a ${target}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 1, logic: "orientation_invariance", hideVisual: false }
    };
  },

  advanced_conservation_of_shapes: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const [s1] = getRandom(["square", "rectangle"], 1);
    const answer = "Yes";

    const questionTextTemplate = getQText(`Ben has a large ${s1}. He cuts it into 4 smaller triangles. If he puts all the pieces back together perfectly, will they still be as big as the original ${s1}?`, `Will reassembled pieces equal the original size?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers/shapes MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = ["Yes", "No", "It will be smaller", "It will be larger"];
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
          "hint": ${JSON.stringify(getQText(`Think! Did Ben add any more paper or throw any away?`, `Is any piece missing?`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`When you cut a shape into parts, the total amount of space (the size) stays the same if you keep all the pieces.`, `Size remains the same.`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "conservation", hideVisual: true }
    };
  }
};

export const advancedLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (advancedVariants[activeVariant]) {
    return advancedVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};