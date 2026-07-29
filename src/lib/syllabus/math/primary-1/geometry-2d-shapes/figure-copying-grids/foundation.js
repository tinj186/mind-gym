import { getRandomContext } from '@/lib/utils/localization';
import { getRandomNames } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => {
  const allDistractors = [...distractors].sort(() => Math.random() - 0.5);
  const options = [correct, ...allDistractors.slice(0, 3)].sort(() => Math.random() - 0.5);
  return options;
};

const foundationVariants = {
  foundation_count_grid_units: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
    const isHorizontal = Math.random() > 0.5;
    const length = Math.floor(Math.random() * 4) + 2; // 2 to 5 units
    
    // Draw a single line of `length` units
    const referenceLines = [
      { start: [1, 1], end: isHorizontal ? [1 + length, 1] : [1, 1 + length] }
    ];

    const componentData = { 
      gridType, 
      gridSize: { cols: 8, rows: 8 },
      referenceLines,
      workspaceLines: []
    };

    const answer = String(length);
    const questionTextTemplate = getQText(`Look at the ${gridType.toLowerCase()} grid. How many units long is the line?`, `Length of line = ? units`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = getShuffledOptions(answer, ["1", "2", "3", "4", "5", "6", "7", "8"].filter(x => x !== answer));
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
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
        "meta": { "level": "${level}", "topic": "${topic}", "type": "SHORT_QUESTION", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": "Count the spaces between the dots or the squares along the line.",
          "finalAnswer": "${answer}",
          "solutionSteps": "The line covers exactly ${answer} units on the grid."
        },
        "visualEngine": {
          "componentToRender": "GRID_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "count_grid_units", hideVisual: false },
      visualEngine: {
        componentToRender: "GRID_DISPLAY",
        componentData
      }
    };
  },

  foundation_identify_correct_copy: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    // For MCQ, we show a target shape, and 4 distractors in the visual component
    const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
    
    // Target is a 2x2 square
    const targetLines = [
      { start: [1, 1], end: [3, 1] },
      { start: [3, 1], end: [3, 3] },
      { start: [3, 3], end: [1, 3] },
      { start: [1, 3], end: [1, 1] }
    ];

    const answer = "Option B"; // We just hardcode B as the correct one in the generator, AI doesn't need to do logic
    const componentData = { 
      gridType, 
      gridSize: { cols: 10, rows: 10 },
      referenceLines: targetLines,
      // Distractors could be rendered in the workspace with labels
      workspaceLines: [
        // Option A (1x2 rectangle)
        { start: [5, 1], end: [6, 1], label: "A" }, { start: [6, 1], end: [6, 3] }, { start: [6, 3], end: [5, 3] }, { start: [5, 3], end: [5, 1] },
        // Option B (2x2 square - correct)
        { start: [8, 1], end: [10, 1], label: "B" }, { start: [10, 1], end: [10, 3] }, { start: [10, 3], end: [8, 3] }, { start: [8, 3], end: [8, 1] },
        // Option C (3x3 square)
        { start: [5, 5], end: [8, 5], label: "C" }, { start: [8, 5], end: [8, 8] }, { start: [8, 8], end: [5, 8] }, { start: [5, 8], end: [5, 5] },
        // Option D (2x3 rectangle)
        { start: [1, 5], end: [3, 5], label: "D" }, { start: [3, 5], end: [3, 8] }, { start: [3, 8], end: [1, 8] }, { start: [1, 8], end: [1, 5] }
      ]
    };

    const questionTextTemplate = getQText(`Look at the target shape on the top left. Which option (A, B, C, or D) is the correct copy of the shape?`, `Which option is the correct copy?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = ["Option A", "Option B", "Option C", "Option D"];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      mcqOptions = JSON.stringify(options);
      let defectMapObj = { "Option A": "SPATIAL_ERROR", "Option C": "SPATIAL_ERROR", "Option D": "SPATIAL_ERROR" };
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "MCQ", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": "Check how many dots/squares wide and tall the target shape is. Find the option with the exact same size.",
          "finalAnswer": "${answer}",
          "solutionSteps": "The target shape is 2 units wide and 2 units tall. Option B is also exactly 2 units wide and 2 units tall, making it the correct copy."
        },
        "visualEngine": {
          "componentToRender": "GRID_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 2, logic: "identify_correct_copy", hideVisual: false },
      visualEngine: {
        componentToRender: "GRID_DISPLAY",
        componentData
      }
    };
  },

  foundation_copy_simple_line: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
    const isHorizontal = Math.random() > 0.5;
    const length = Math.floor(Math.random() * 3) + 2; // 2 to 4 units
    
    // Draw a single line
    const referenceLines = [
      { start: [2, 2], end: isHorizontal ? [2 + length, 2] : [2, 2 + length] }
    ];

    const componentData = { 
      gridType, 
      gridSize: { cols: 6, rows: 6 },
      referenceLines,
      workspaceLines: []
    };

    // The answer is the expected JSON output array of coordinates the student must draw
    const answer = JSON.stringify(referenceLines);

    const questionTextTemplate = getQText(`Copy the line onto the empty grid. Click on the dots to draw.`, `Copy the line.`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "SHORT_QUESTION", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": null,
          "defectMap": null,
          "hint": "Count how many spaces the line covers, and make sure your line covers the exact same number of spaces.",
          "finalAnswer": ${JSON.stringify(answer)},
          "solutionSteps": "You drew a line that is exactly ${length} units long, matching the target line."
        },
        "visualEngine": {
          "componentToRender": "GRID_DRAWING_CANVAS",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "INTERACTIVE_GRID" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "copy_simple_line", hideVisual: false },
      visualEngine: {
        componentToRender: "GRID_DRAWING_CANVAS",
        componentData
      }
    };
  },

  foundation_copy_basic_shape: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
    
    // We want to generate a rectangle using two orthogonal vectors v1=(dx, dy) and v2=(-dy, dx).
    const vectors = [
      [1, 0], [0, 1], // Upright
      [1, 1], [1, -1], // 45 deg
      [2, 1], [1, 2], [2, -1], [-1, 2], // ~26.5 deg / 63.4 deg
      [3, 1], [1, 3], [3, -1], [-1, 3]  // ~18.4 deg / 71.6 deg
    ];

    let finalLines = null;
    let dx = 0, dy = 0;
    let width = 0, height = 0;

    while (!finalLines) {
      // Pick a random direction
      const v1 = vectors[Math.floor(Math.random() * vectors.length)];
      const v2 = [-v1[1], v1[0]]; // Orthogonal
      
      // For tilted shapes, we want smaller logical width/height so it fits in 6x6.
      // If upright, w can be 1-4. If tilted (dx>0 and dy>0), w can be 1-2.
      const isTilted = Math.abs(v1[0]) > 0 && Math.abs(v1[1]) > 0;
      width = isTilted ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 2;
      height = isTilted ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 2;

      const p0 = [0, 0];
      const p1 = [width * v1[0], width * v1[1]];
      const p2 = [width * v1[0] + height * v2[0], width * v1[1] + height * v2[1]];
      const p3 = [height * v2[0], height * v2[1]];

      const pts = [p0, p1, p2, p3];
      const minX = Math.min(...pts.map(p => p[0]));
      const maxX = Math.max(...pts.map(p => p[0]));
      const minY = Math.min(...pts.map(p => p[1]));
      const maxY = Math.max(...pts.map(p => p[1]));

      const w = maxX - minX;
      const h = maxY - minY;

      // Ensure it fits inside a 6x6 grid bounding box (max width/height 5)
      if (w <= 5 && h <= 5) {
        dx = Math.floor(Math.random() * (6 - w)) - minX;
        dy = Math.floor(Math.random() * (6 - h)) - minY;

        finalLines = [
          { start: [p0[0] + dx, p0[1] + dy], end: [p1[0] + dx, p1[1] + dy] },
          { start: [p1[0] + dx, p1[1] + dy], end: [p2[0] + dx, p2[1] + dy] },
          { start: [p2[0] + dx, p2[1] + dy], end: [p3[0] + dx, p3[1] + dy] },
          { start: [p3[0] + dx, p3[1] + dy], end: [p0[0] + dx, p0[1] + dy] }
        ];
      }
    }

    const referenceLines = finalLines;

    const componentData = { 
      gridType, 
      gridSize: { cols: 6, rows: 6 },
      referenceLines,
      workspaceLines: []
    };

    const answer = JSON.stringify(referenceLines);

    const questionTextTemplate = getQText(`Copy the shape exactly as it is shown onto the empty grid.`, `Copy the shape.`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "SHORT_QUESTION", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": null,
          "defectMap": null,
          "hint": "Count the width and the height of the shape carefully before drawing.",
          "finalAnswer": ${JSON.stringify(answer)},
          "solutionSteps": "You copied the shape perfectly by drawing a boundary that is ${width} units wide and ${height} units tall."
        },
        "visualEngine": {
          "componentToRender": "GRID_DRAWING_CANVAS",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "INTERACTIVE_GRID" }
      }`,
      metadata: { difficulty: 'foundation', steps: 2, logic: "copy_basic_shape", hideVisual: false },
      visualEngine: {
        componentToRender: "GRID_DRAWING_CANVAS",
        componentData
      }
    };
  },

  foundation_complete_the_shape: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
    
    // Draw a 3x2 rectangle
    const referenceLines = [
      { start: [1, 1], end: [4, 1] },
      { start: [4, 1], end: [4, 3] },
      { start: [4, 3], end: [1, 3] },
      { start: [1, 3], end: [1, 1] }
    ];
    
    // Provide 2 of the 4 lines in the workspace
    const workspaceLines = [
      { start: [1, 1], end: [4, 1] },
      { start: [4, 1], end: [4, 3] }
    ];
    
    // The missing lines that the student needs to draw
    const missingLines = [
      { start: [4, 3], end: [1, 3] },
      { start: [1, 3], end: [1, 1] }
    ];

    const componentData = { 
      gridType, 
      gridSize: { cols: 6, rows: 5 },
      referenceLines,
      workspaceLines // Pre-populated in the drawing canvas!
    };

    const answer = JSON.stringify(missingLines); // The payload evaluates exactly what they ADDED

    const questionTextTemplate = getQText(`Look at the rectangle. Half of it has been drawn for you. Draw the missing lines to complete the shape!`, `Complete the shape.`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "SHORT_QUESTION", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": null,
          "defectMap": null,
          "hint": "Match the bottom and left sides of the target shape to close the rectangle.",
          "finalAnswer": ${JSON.stringify(answer)},
          "solutionSteps": "You successfully drew the missing lines to form a closed rectangle!"
        },
        "visualEngine": {
          "componentToRender": "GRID_DRAWING_CANVAS",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "INTERACTIVE_GRID" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "complete_the_shape", hideVisual: false },
      visualEngine: {
        componentToRender: "GRID_DRAWING_CANVAS",
        componentData
      }
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
