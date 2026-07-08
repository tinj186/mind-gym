import { getRandomContext } from '@/lib/utils/localization';
import { getRandomShapes, getRandomColors, getRandomNames, SHAPES_POOL, COLORS_POOL } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => {
  const allDistractors = [...distractors].sort(() => Math.random() - 0.5);
  const options = [correct, ...allDistractors.slice(0, 3)].sort(() => Math.random() - 0.5);
  return options;
};

const advancedVariants = {
  advanced_find_missing_pieces: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const scenarios = [
      { goal: "a large square", totalPieces: 4, usedPieces: "2 small squares and 1 rectangle", missing: "1 rectangle", distractors: ["1 small square", "2 small squares", "1 triangle"] },
      { goal: "a large rectangle", totalPieces: 3, usedPieces: "2 identical squares", missing: "1 rectangle", distractors: ["1 small square", "1 triangle", "1 circle"] },
      { goal: "a circle", totalPieces: 4, usedPieces: "1 half circle and 1 quarter circle", missing: "1 quarter circle", distractors: ["1 half circle", "2 quarter circles", "1 triangle"] }
    ];
    const target = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    const questionTextTemplate = getQText(`I built ${target.goal} using ${target.totalPieces} pieces. I used ${target.usedPieces}. What is the missing piece?`, `What piece is missing to build ${target.goal}?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}.`;
    
    let options = target.distractors;
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(target.missing, target.distractors);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== target.missing) defectMapObj[opt] = "SPATIAL_ERROR"; });
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
          "hint": "Think about what shapes combine to make the full figure.",
          "finalAnswer": "${target.missing}",
          "solutionSteps": "If you have ${target.usedPieces}, you still need ${target.missing} to complete ${target.goal}."
        },
        "visualEngine": null,
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "find_missing_pieces", hideVisual: true }
    };
  },

  advanced_generative_decomposition: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const subjects = ["space station", "dinosaur", "monster", "alien spaceship"];
    const selectedSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const componentData = { layout: "COMPOSITE_GENERATIVE", parts: [], name: selectedSubject };
    
    const questionTextTemplate = getQText(`Look at the drawing of the ${selectedSubject}. How many curved shapes (circles, half circles, quarter circles) were used to build it?`, `How many curved shapes make up the ${selectedSubject}?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}.`;
    
    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL TASK: Build a highly complex 2D drawing of a "${selectedSubject.toUpperCase()}" built out of 5 to 8 basic shapes.
      
      1. Generate an array of exactly 5 to 8 shapes inside visualEngine.componentData.parts to create the ${selectedSubject}. Every part MUST have:
          - shapeType: "circle" | "square" | "triangle" | "rectangle" | "half circle" | "quarter circle"
          - color: a vibrant hex code (e.g., "#ef4444")
          - x: number (20 to 80) representing horizontal percentage (50 is center)
          - y: number (20 to 80) representing vertical percentage (50 is center)
          - scale: number (0.5 to 2.5) for size
          - rotation: number (0 to 360) for angle
      2. Ensure you use a mix of straight-sided shapes and curved shapes (circles, half circles, quarter circles).
      3. CAREFULLY COUNT exactly how many CURVED shapes (circles, half circles, or quarter circles) you used in total.
      4. This count is your correct answer. Replace "{answer}" with this number.
      5. Generate 3 plausible distractors (e.g., "{answer} + 1", "{answer} - 1", "{answer} + 2") and replace "{distractor1}", etc.
      6. Generate the options array containing the true answer and 3 distractors.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ["{answer}", "{distractor1}", "{distractor2}", "{distractor3}"],
          "defectMap": { "{distractor1}": "COUNTING_ERROR", "{distractor2}": "COUNTING_ERROR", "{distractor3}": "COUNTING_ERROR" },
          "hint": "Look closely at the shapes. Which ones have curves?",
          "finalAnswer": "{answer}",
          "solutionSteps": "There are exactly {answer} curved shapes in the ${selectedSubject}."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "generative_decomposition", hideVisual: false }
    };
  },

  advanced_evaluate_formation_statements: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const scenarios = [
      { text: "I have 4 identical triangles.", falseStatement: "I can make 1 large circle.", distractors: ["I can make 1 large square.", "I can make 2 small squares.", "I can make 1 large triangle."] },
      { text: "I have 4 identical quarter circles.", falseStatement: "I can make 1 large square.", distractors: ["I can make 1 large circle.", "I can make 2 half circles.", "I can make a shape with no straight sides."] },
      { text: "I have 2 identical squares.", falseStatement: "I can make 1 large triangle.", distractors: ["I can make 1 rectangle.", "I can make a shape with 4 straight sides.", "I can make a shape with 4 corners."] }
    ];
    const target = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    const questionTextTemplate = getQText(`${target.text} Which of these statements is FALSE?`, `Which statement is FALSE about ${target.text}?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}.`;
    
    let options = target.distractors;
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(target.falseStatement, target.distractors);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== target.falseStatement) defectMapObj[opt] = "LOGIC_ERROR"; });
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
          "hint": "Read each statement carefully and imagine the shapes.",
          "finalAnswer": "${target.falseStatement}",
          "solutionSteps": "The false statement is '${target.falseStatement}' because you cannot form that shape with those pieces."
        },
        "visualEngine": null,
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "evaluate_formation_statements", hideVisual: true }
    };
  },

  advanced_substitution_riddle: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const riddles = [
      { text: "2 quarter circles make 1 half circle. 2 half circles make 1 circle. If I have 1 circle and 1 half circle, how many quarter circles is that equal to in total?", ans: "6", distractors: ["4", "5", "8"] },
      { text: "2 triangles make 1 square. 2 squares make 1 rectangle. If I have 1 rectangle and 1 square, how many triangles is that equal to in total?", ans: "6", distractors: ["4", "5", "8"] }
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
      options.forEach(opt => { if (opt !== target.ans) defectMapObj[opt] = "SUBSTITUTION_ERROR"; });
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
          "hint": "Break down the big shapes into the smallest pieces step by step.",
          "finalAnswer": "${target.ans}",
          "solutionSteps": "If you break them down, you get exactly ${target.ans} small pieces in total."
        },
        "visualEngine": null,
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "substitution_riddle", hideVisual: true }
    };
  },

  advanced_maximum_shapes_in_boundary: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const scenarios = [
      { text: "A large rectangle can be cut into exactly 4 squares. Each square can be cut into exactly 2 triangles.", q: "How many triangles can fit inside the large rectangle?", ans: "8", distractors: ["6", "10", "4"] },
      { text: "A large circle can be cut into exactly 2 half circles. Each half circle can be cut into exactly 2 quarter circles.", q: "How many quarter circles can fit inside the large circle?", ans: "4", distractors: ["2", "6", "8"] }
    ];
    const target = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    const questionTextTemplate = getQText(`${target.text} ${target.q}`, target.q);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}.`;
    
    let options = target.distractors;
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(target.ans, target.distractors);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== target.ans) defectMapObj[opt] = "MULTIPLICATIVE_ERROR"; });
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
          "hint": "Try drawing a picture or multiplying the numbers.",
          "finalAnswer": "${target.ans}",
          "solutionSteps": "Exactly ${target.ans} pieces fit inside."
        },
        "visualEngine": null,
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "maximum_shapes_in_boundary", hideVisual: true }
    };
  }
};

export const advancedLogic = {
  generate: (variant, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const _isMCQ = isMCQ ?? (type === 'MCQ');
    const _isShort = isShort ?? (type === 'Short Question');
    const _isStructure = isStructure ?? (type === 'Structured Question');
    const _zodType = zodType ?? type;
    const _zodDiff = zodDiff ?? 'Advanced';
    const _level = level ?? 'Primary 1';
    const _topic = topic ?? 'Geometry - 2D Shapes';
    const _formatInstructions = formatInstructions ?? '';
    const _context = context ?? {};
    const _getQText = getQText ?? ((t1, t2) => t1);

    const activeVariant = variant || Object.keys(advancedVariants)[Math.floor(Math.random() * Object.keys(advancedVariants).length)];
    if (advancedVariants[activeVariant]) {
      return advancedVariants[activeVariant]({}, type, _isMCQ, _isShort, _isStructure, _zodType, _zodDiff, _level, _topic, _formatInstructions, _context, _getQText);
    }
  }
};
