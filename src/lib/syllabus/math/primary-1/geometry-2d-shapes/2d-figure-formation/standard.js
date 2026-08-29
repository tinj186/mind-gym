import { getRandomContext } from '@/lib/utils/localization';
import { getRandomShapes, getRandomColors, getRandomNames, SHAPES_POOL, COLORS_POOL } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => {
  const allDistractors = [...distractors].sort(() => Math.random() - 0.5);
  const options = [correct, ...allDistractors.slice(0, 3)].sort(() => Math.random() - 0.5);
  return options;
};

const standardVariants = {
  standard_compose_three_shapes: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const pairs = [
      { step1: "2 identical squares", step2: "1 identical rectangle", result: "Square", distractors: ["Circle", "Triangle", "Rectangle", "Half Circle"] },
      { step1: "2 identical quarter circles", step2: "1 identical half circle", result: "Circle", distractors: ["Square", "Rectangle", "Triangle", "Half Circle"] },
      { step1: "2 identical triangles", step2: "1 identical square", result: "Rectangle", distractors: ["Circle", "Triangle", "Square", "Half Circle"] }
    ];
    const target = pairs[Math.floor(Math.random() * pairs.length)];
    
    const questionTextTemplate = getQText(`If you join ${target.step1} to make a shape, and then join ${target.step2} to it, what shape do you get?`, `Join ${target.step1}. Then join ${target.step2}. What is the final shape?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}.`;
    
    let options = target.distractors;
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(target.result, target.distractors);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== target.result) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
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
          "hint": "Try to imagine building it step by step.",
          "finalAnswer": "${target.result}",
          "solutionSteps": "First, join ${target.step1}. Then, join ${target.step2}. Together, they form a ${target.result.toLowerCase()}."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": { "layout": "SINGLE", "shapeType": "${target.result.toLowerCase()}" }
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "compose_three_shapes", hideVisual: true }
    };
  },

  standard_decompose_complex_figure: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const subjects = ["house", "tree", "ice cream", "robot", "rocket", "train", "boat"];
    const selectedSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const componentData = { layout: "COMPOSITE_GENERATIVE", parts: [], name: selectedSubject };
    
    const questionTextTemplate = getQText(`Look at the drawing of the ${selectedSubject}. Which shapes do you get if you break it apart?`, `What shapes make up the ${selectedSubject}?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}.`;
    
    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL TASK: Build a 2D drawing of a "${selectedSubject.toUpperCase()}" built out of 2 to 4 basic shapes.
      
      1. Generate an array of exactly 2 to 4 shapes inside visualEngine.componentData.parts to create the ${selectedSubject}. Every part MUST have:
          - shapeType: "circle" | "square" | "triangle" | "rectangle" | "half circle" | "quarter circle"
          - color: a vibrant hex code (e.g., "#ef4444")
          - x: number (20 to 80) representing horizontal percentage (50 is center)
          - y: number (20 to 80) representing vertical percentage (50 is center)
          - scale: number (0.5 to 2.5) for size
          - rotation: number (0 to 360) for angle
      2. Summarize exactly what shapes you used (e.g., "1 square and 2 triangles"). This is the correct answer.
      3. Replace "{answer}" with your correct summary.
      4. Generate 3 plausible distractors (e.g., "2 squares and 1 triangle") and replace "{distractor1}", etc.
      5. Generate the options array containing the true answer and 3 distractors.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ["{answer}", "{distractor1}", "{distractor2}", "{distractor3}"],
          "defectMap": { "{distractor1}": "DECOMPOSITION_ERROR", "{distractor2}": "DECOMPOSITION_ERROR", "{distractor3}": "DECOMPOSITION_ERROR" },
          "hint": "Look closely at the top and bottom of the drawing.",
          "finalAnswer": "{answer}",
          "solutionSteps": "The ${selectedSubject} is made of {answer}."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "decompose_complex_figure", hideVisual: false }
    };
  },

  standard_count_embedded_pieces: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isSquare = Math.random() > 0.5;
    const isTriangles = isSquare && Math.random() > 0.5;
    
    let width, height, count, bigShape, smallShape, referenceLines;
    
    if (isTriangles) {
      width = 2; height = 2; count = 4;
      bigShape = "large square";
      smallShape = "small triangles";
      referenceLines = `[
        { "start": [1, 1], "end": [3, 1], "color": "#3b82f6" },
        { "start": [3, 1], "end": [3, 3], "color": "#3b82f6" },
        { "start": [3, 3], "end": [1, 3], "color": "#3b82f6" },
        { "start": [1, 3], "end": [1, 1], "color": "#3b82f6" },
        { "start": [1, 1], "end": [3, 3], "dashed": true },
        { "start": [1, 3], "end": [3, 1], "dashed": true }
      ]`;
    } else {
      if (isSquare) {
        width = Math.floor(Math.random() * 3) + 2; // 2 to 4
        height = width;
        bigShape = "large square";
      } else {
        width = Math.floor(Math.random() * 4) + 2; // 2 to 5
        height = Math.floor(Math.random() * 2) + 2; // 2 to 3
        if (width === height) width += 1;
        bigShape = "large rectangle";
      }
      count = width * height;
      smallShape = "small squares";
      referenceLines = `[
        { "start": [1, 1], "end": [${width + 1}, 1], "color": "#ef4444" },
        { "start": [${width + 1}, 1], "end": [${width + 1}, ${height + 1}], "color": "#ef4444" },
        { "start": [${width + 1}, ${height + 1}], "end": [1, ${height + 1}], "color": "#ef4444" },
        { "start": [1, ${height + 1}], "end": [1, 1], "color": "#ef4444" }
      ]`;
    }
    
    let distractors = [String(count - 1), String(count + 1), String(count + 2), String(count + Math.floor(Math.random() * 3) + 3)];
    if (distractors.includes("0")) distractors[distractors.indexOf("0")] = "5";
    // Deduplicate distractors if any overlap
    distractors = [...new Set(distractors)].filter(d => d !== String(count));
    while (distractors.length < 3) distractors.push(String(Math.floor(Math.random() * 10) + 10));
    
    const questionTextTemplate = getQText(`Look at the drawing. How many ${smallShape} can fit exactly inside this ${bigShape}?`, `How many ${smallShape} make up the ${bigShape}?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}.`;
    
    let options = distractors.slice(0, 3);
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(count.toString(), options);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== count.toString()) defectMapObj[opt] = "COUNTING_ERROR"; });
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
          "hint": "Count them one by one.",
          "finalAnswer": "${count}",
          "solutionSteps": "There are ${count} ${smallShape} inside the ${bigShape}."
        },
        "visualEngine": {
          "componentToRender": "GRID_DISPLAY",
          "componentData": { 
            "gridType": "SQUARE",
            "gridSize": { "cols": ${width + 2}, "rows": ${height + 2} },
            "referenceLines": ${referenceLines}
          }
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "count_embedded_pieces", hideVisual: false }
    };
  },

  standard_figure_formation_riddle: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const riddles = [
      { text: "I have a square. I cut it in half to get 2 triangles. I throw away 1 triangle. I cut the remaining triangle in half. What shapes do I have now?", ans: "2 smaller triangles", distractors: ["1 square", "2 squares", "1 triangle"] },
      { text: "I have a circle. I cut it in half to get 2 half circles. I cut one half circle in half again. What shapes do I have in total?", ans: "1 half circle and 2 quarter circles", distractors: ["4 quarter circles", "3 half circles", "1 circle and 1 quarter circle"] },
      { text: "I have 2 squares. I join them to make a rectangle. I cut the rectangle in half. What shapes do I get back?", ans: "2 squares", distractors: ["2 triangles", "2 rectangles", "4 squares"] }
    ];
    const target = riddles[Math.floor(Math.random() * riddles.length)];
    
    const questionTextTemplate = getQText(target.text, target.text);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}.`;
    
    let options = target.distractors;
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(target.ans, target.distractors);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== target.ans) defectMapObj[opt] = "LOGIC_ERROR"; });
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
          "hint": "Read the story step by step.",
          "finalAnswer": "${target.ans}",
          "solutionSteps": "Follow the steps carefully. You will have ${target.ans}."
        },
        "visualEngine": null,
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 3, logic: "figure_formation_riddle", hideVisual: true }
    };
  },

  standard_identify_extra_piece: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const scenarios = [
      { goal: "a full circle", pieces: "2 quarter circles, 1 half circle, and 1 square", extra: "Square", distractors: ["Quarter Circle", "Half Circle", "Triangle"] },
      { goal: "a square", pieces: "2 identical triangles and 1 circle", extra: "Circle", distractors: ["Triangle", "Square", "Rectangle"] },
      { goal: "a rectangle", pieces: "2 identical squares and 1 half circle", extra: "Half Circle", distractors: ["Square", "Rectangle", "Quarter Circle"] }
    ];
    const target = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    const questionTextTemplate = getQText(`You want to build ${target.goal}. You have ${target.pieces}. Which piece do you NOT need?`, `To build ${target.goal}, which extra piece from ${target.pieces} is NOT needed?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}.`;
    
    let options = target.distractors;
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(target.extra, target.distractors);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== target.extra) defectMapObj[opt] = "EXTRA_PIECE_ERROR"; });
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
          "hint": "Which piece doesn't belong?",
          "finalAnswer": "${target.extra}",
          "solutionSteps": "To make ${target.goal}, you do not need the ${target.extra.toLowerCase()}."
        },
        "visualEngine": null,
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "identify_extra_piece", hideVisual: true }
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
