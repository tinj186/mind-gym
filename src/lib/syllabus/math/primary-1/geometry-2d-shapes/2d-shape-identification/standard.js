import { getRandomContext } from '@/lib/utils/localization';
import { getRandomShapes, getRandomColors, getRandomGeometrySubjects, getRandomNames, SHAPES_POOL, COLORS_POOL } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => {
  const allDistractors = [...distractors].sort(() => Math.random() - 0.5);
  const options = [correct, ...allDistractors.slice(0, 3)].sort(() => Math.random() - 0.5);
  return options;
};

const standardVariants = {
  standard_find_all_target_shape: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const target = getRandomShapes(1);
    const items = [];
    let count = 0;
    for (let i = 0; i < 8; i++) {
      const shape = getRandomShapes(1);
      if (shape === target) count++;
      items.push({ shapeType: shape, color: getRandomColors(1), size: "medium" });
    }
    // Ensure at least 1 exists
    if (count === 0) {
      items[0] = { shapeType: target, color: getRandomColors(1), size: "medium" };
      count = 1;
    }
    
    const componentData = { layout: "GRID", items: items };
    const answer = String(count);

    const questionTextTemplate = getQText(`How many ${target}s are in the picture?`, `Number of ${target}s = ?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = getShuffledOptions(answer, ["1", "2", "3", "4", "5", "6", "7", "8"].filter(x => x !== answer));
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "COUNTING_ERROR"; });
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
          "hint": "Count only the ${target}s, one by one.",
          "finalAnswer": "${answer}",
          "solutionSteps": "There are exactly ${answer} ${target}s in the grid."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "find_all_target", hideVisual: false }
    };
  },

  standard_shape_riddles: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const riddles = [
      { text: "I have 4 straight sides. All my sides are exactly the same length. What shape am I?", ans: "Square", distractors: ["Rectangle", "Triangle", "Circle"] },
      { text: "I have 4 straight sides. Two of my sides are long, and two of my sides are short. What shape am I?", ans: "Rectangle", distractors: ["Square", "Triangle", "Circle"] },
      { text: "I have 0 straight sides. I am perfectly round. What shape am I?", ans: "Circle", distractors: ["Half Circle", "Quarter Circle", "Square"] },
      { text: "I have exactly 3 straight sides. What shape am I?", ans: "Triangle", distractors: ["Rectangle", "Square", "Half Circle"] },
      { text: "I have 1 straight side and 1 curved side. What shape am I?", ans: "Half Circle", distractors: ["Circle", "Quarter Circle", "Triangle"] }
    ];
    const target = riddles[Math.floor(Math.random() * riddles.length)];
    
    const questionTextTemplate = getQText(target.text, target.text);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = target.distractors;
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(target.ans, target.distractors);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== target.ans) defectMapObj[opt] = "PROPERTIES_ERROR"; });
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
          "hint": "Think about how many sides or curves the shape has.",
          "finalAnswer": "${target.ans}",
          "solutionSteps": "The shape that matches this description is a ${target.ans}."
        },
        "visualEngine": null,
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "shape_riddles", hideVisual: true }
    };
  },

  standard_most_frequent_shape: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const subjects = ["space station", "robot", "castle", "train"];
    const selectedSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const componentData = { layout: "COMPOSITE_GENERATIVE", parts: [], name: selectedSubject };
    const findMost = Math.random() > 0.5;

    const questionTextTemplate = getQText(`Look at the ${selectedSubject}. Which shape is used the ${findMost ? 'most' : 'least'}?`, `Which shape is used the ${findMost ? 'most' : 'least'}?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL TASK: Build a 2D drawing of a "${selectedSubject.toUpperCase()}" built out of basic shapes.
      
      1. Generate an array of exactly 5 to 7 shapes inside visualEngine.componentData.parts to create the ${selectedSubject}. Every part MUST have:
          - shapeType: "circle" | "square" | "triangle" | "rectangle" | "half circle" | "quarter circle"
          - color: a vibrant hex code (e.g., "#ef4444")
          - x: number (20 to 80) representing horizontal percentage (50 is center)
          - y: number (20 to 80) representing vertical percentage (50 is center)
          - scale: number (0.5 to 2.5) for size
          - rotation: number (0 to 360) for angle
      2. Ensure one shape is used the ${findMost ? 'most (e.g. 3 or 4 times)' : 'least (e.g. only 1 time)'} compared to the other shapes.
      3. CAREFULLY COUNT the occurrences of each shape type you used. Identify the ${findMost ? 'most' : 'least'} frequent shape.
      4. This shape name is your correct answer. Replace "{answer}" with the shape name (e.g., "Square").
      5. Generate 3 plausible distractors (other shapes from the drawing or pool) and replace "{distractor1}", etc.
      6. Generate the options array containing the true answer and 3 distractors.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ["{answer}", "{distractor1}", "{distractor2}", "{distractor3}"],
          "defectMap": { "{distractor1}": "FREQUENCY_ERROR", "{distractor2}": "FREQUENCY_ERROR", "{distractor3}": "FREQUENCY_ERROR" },
          "hint": "Count how many of each shape there are, then compare the numbers.",
          "finalAnswer": "{answer}",
          "solutionSteps": "The ${findMost ? 'most' : 'least'} frequently used shape is the {answer}."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "most_frequent_shape", hideVisual: false }
    };
  },

  standard_compare_shape_counts: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const shape1 = getRandomShapes(1);
    let shape2 = getRandomShapes(1);
    while (shape1 === shape2) shape2 = getRandomShapes(1);
    
    let count1 = Math.floor(Math.random() * 4) + 1; // 1 to 4
    let count2 = Math.floor(Math.random() * 4) + 1; // 1 to 4
    while (count1 === count2) count2 = Math.floor(Math.random() * 4) + 1;

    const askMore = Math.random() > 0.5;
    const answer = askMore ? (count1 > count2 ? shape1 : shape2) : (count1 < count2 ? shape1 : shape2);
    
    const items = [];
    for (let i = 0; i < count1; i++) items.push({ shapeType: shape1, color: getRandomColors(1), size: "medium" });
    for (let i = 0; i < count2; i++) items.push({ shapeType: shape2, color: getRandomColors(1), size: "medium" });
    
    // Add random distractors to make grid 8
    while (items.length < 8) {
        let dist = getRandomShapes(1);
        while(dist === shape1 || dist === shape2) dist = getRandomShapes(1);
        items.push({ shapeType: dist, color: getRandomColors(1), size: "medium" });
    }
    items.sort(() => Math.random() - 0.5);
    
    const componentData = { layout: "GRID", items };
    const capitalizedAnswer = answer.charAt(0).toUpperCase() + answer.slice(1);
    
    const questionTextTemplate = getQText(`Look at the shapes. Are there ${askMore ? 'more' : 'fewer'} ${shape1}s or ${shape2}s?`, `Which is there ${askMore ? 'more' : 'fewer'} of: ${shape1}s or ${shape2}s?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [shape1.charAt(0).toUpperCase() + shape1.slice(1), shape2.charAt(0).toUpperCase() + shape2.slice(1)];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== capitalizedAnswer) defectMapObj[opt] = "COMPARISON_ERROR"; });
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
          "hint": "Count how many ${shape1}s there are, then count how many ${shape2}s there are.",
          "finalAnswer": "${capitalizedAnswer}",
          "solutionSteps": "There are ${count1} ${shape1}s and ${count2} ${shape2}s. So there are ${askMore ? 'more' : 'fewer'} ${capitalizedAnswer}s."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "compare_counts", hideVisual: false }
    };
  },

  standard_identify_by_exclusion: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const presentShapes = [];
    while (presentShapes.length < 5) {
      const s = getRandomShapes(1);
      if (!presentShapes.includes(s)) presentShapes.push(s);
    }
    const missingShape = SHAPES_POOL.find(s => !presentShapes.includes(s));

    const items = [];
    for (let i = 0; i < 6; i++) {
      items.push({ shapeType: presentShapes[i % 5], color: getRandomColors(1), size: "medium" });
    }
    items.sort(() => Math.random() - 0.5);
    const componentData = { layout: "GRID", items };
    const answer = missingShape.charAt(0).toUpperCase() + missingShape.slice(1);

    const questionTextTemplate = getQText(`Look at the picture. Which shape is NOT in the picture?`, `Which shape is NOT shown?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [answer, ...presentShapes.map(s => s.charAt(0).toUpperCase() + s.slice(1))];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(answer, presentShapes.map(s => s.charAt(0).toUpperCase() + s.slice(1)));
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "EXCLUSION_ERROR"; });
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
          "hint": "Check the options one by one. Which one can you not find?",
          "finalAnswer": "${answer}",
          "solutionSteps": "The picture contains ${presentShapes.join(', ')}s, but there are no ${missingShape}s."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "identify_by_exclusion", hideVisual: false }
    };
  }
};

export const standardLogic = {
  generate: (variant, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const _isMCQ = isMCQ ?? (type === 'MCQ');
    const _isShort = isShort ?? (type === 'Short Question');
    const _isStructure = isStructure ?? (type === 'Structured Question');
    const _zodType = zodType ?? type;
    const _zodDiff = zodDiff ?? 'Standard';
    const _level = level ?? 'Primary 1';
    const _topic = topic ?? 'Geometry - 2D Shapes';
    const _formatInstructions = formatInstructions ?? '';
    const _context = context ?? {};
    const _getQText = getQText ?? ((t1, t2) => t1);

    const activeVariant = variant || Object.keys(standardVariants)[Math.floor(Math.random() * Object.keys(standardVariants).length)];
    if (standardVariants[activeVariant]) {
      return standardVariants[activeVariant]({}, type, _isMCQ, _isShort, _isStructure, _zodType, _zodDiff, _level, _topic, _formatInstructions, _context, _getQText);
    }
  }
};
