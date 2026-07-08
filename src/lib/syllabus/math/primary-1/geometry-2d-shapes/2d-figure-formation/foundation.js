import { getRandomContext } from '@/lib/utils/localization';
import { getRandomShapes, getRandomColors, getRandomNames, SHAPES_POOL, COLORS_POOL } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => {
  const allDistractors = [...distractors].sort(() => Math.random() - 0.5);
  const options = [correct, ...allDistractors.slice(0, 3)].sort(() => Math.random() - 0.5);
  return options;
};

const foundationVariants = {
  foundation_compose_two_shapes: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const pairs = [
      { pieces: "2 squares", result: "Rectangle", distractors: ["Circle", "Triangle", "Square", "Quarter Circle"] },
      { pieces: "2 half circles", result: "Circle", distractors: ["Square", "Rectangle", "Triangle", "Quarter Circle"] },
      { pieces: "2 identical triangles", result: "Square", distractors: ["Circle", "Rectangle", "Triangle", "Half Circle"] },
      { pieces: "2 quarter circles", result: "Half Circle", distractors: ["Circle", "Square", "Rectangle", "Triangle"] }
    ];
    const target = pairs[Math.floor(Math.random() * pairs.length)];
    
    const questionTextTemplate = getQText(`What shape do you get if you join ${target.pieces} together?`, `Join ${target.pieces}. What is the new shape?`);
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
          "hint": "Try to imagine pushing them together.",
          "finalAnswer": "${target.result}",
          "solutionSteps": "When you put ${target.pieces} together, they form a ${target.result.toLowerCase()}."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": { "layout": "SINGLE", "shapeType": "${target.result.toLowerCase()}" }
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "compose_two_shapes", hideVisual: true } // Hide visual so they guess the result, or maybe show the pieces? Hiding visual for now, as SHAPE_DISPLAY doesn't natively draw separated pieces joining unless we use COMPOSITE. Let's use hideVisual: true.
    };
  },

  foundation_decompose_in_half: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const pairs = [
      { shape: "Rectangle", result: "2 Squares", distractors: ["2 Circles", "2 Triangles", "2 Rectangles"] },
      { shape: "Rectangle", result: "2 Triangles", distractors: ["2 Squares", "2 Circles", "2 Rectangles"] },
      { shape: "Circle", result: "2 Half Circles", distractors: ["2 Triangles", "2 Quarter Circles", "2 Squares"] },
      { shape: "Square", result: "2 Triangles", distractors: ["2 Circles", "2 Half Circles", "2 Squares"] },
      { shape: "Half Circle", result: "2 Quarter Circles", distractors: ["2 Triangles", "2 Circles", "2 Squares"] }
    ];
    const target = pairs[Math.floor(Math.random() * pairs.length)];
    
    const questionTextTemplate = getQText(`If you cut a ${target.shape.toLowerCase()} exactly in half, what smaller shapes can you get?`, `Cut a ${target.shape.toLowerCase()} in half. What shapes do you get?`);
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
          "hint": "Imagine drawing a line down the middle of the shape.",
          "finalAnswer": "${target.result}",
          "solutionSteps": "Cutting a ${target.shape.toLowerCase()} in half can give you ${target.result.toLowerCase()}."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": { "layout": "SINGLE", "shapeType": "${target.shape.toLowerCase()}" }
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "decompose_in_half", hideVisual: false } 
    };
  },

  foundation_count_pieces_to_form: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const scenarios = [
      { pieces: "Quarter Circles", result: "Circle", count: 4, distractors: ["2", "3", "5"] },
      { pieces: "Half Circles", result: "Circle", count: 2, distractors: ["3", "4", "5"] },
      { pieces: "Quarter Circles", result: "Half Circle", count: 2, distractors: ["3", "4", "5"] }
    ];
    const target = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    const questionTextTemplate = getQText(`How many ${target.pieces.toLowerCase()} do you need to form a full ${target.result.toLowerCase()}?`, `How many ${target.pieces.toLowerCase()} make a ${target.result.toLowerCase()}?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}.`;
    
    let options = target.distractors;
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(target.count.toString(), target.distractors);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== target.count.toString()) defectMapObj[opt] = "COUNTING_ERROR"; });
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
          "hint": "Think about how many pieces you need to complete the whole shape.",
          "finalAnswer": "${target.count}",
          "solutionSteps": "You need ${target.count} ${target.pieces.toLowerCase()} to make a ${target.result.toLowerCase()}."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": { "layout": "SINGLE", "shapeType": "${target.result.toLowerCase()}" }
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "count_pieces_to_form", hideVisual: false }
    };
  },

  foundation_complete_the_figure: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const missingPieces = [
      { shape: "Circle", missing: "Quarter Circle", parts: "three quarter circles", distractors: ["Half Circle", "Square", "Triangle"] },
      { shape: "Circle", missing: "Half Circle", parts: "one half circle", distractors: ["Quarter Circle", "Square", "Triangle"] },
      { shape: "Square", missing: "Triangle", parts: "one triangle", distractors: ["Quarter Circle", "Rectangle", "Half Circle"] }
    ];
    const target = missingPieces[Math.floor(Math.random() * missingPieces.length)];
    
    const questionTextTemplate = getQText(`A ${target.shape.toLowerCase()} is missing a piece. It only has ${target.parts}. Which shape completes it?`, `What shape completes the ${target.shape.toLowerCase()}?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}.`;
    
    let options = target.distractors;
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = getShuffledOptions(target.missing, target.distractors);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== target.missing) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
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
          "hint": "What piece fills in the empty space?",
          "finalAnswer": "${target.missing}",
          "solutionSteps": "The missing piece is a ${target.missing.toLowerCase()}."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": { "layout": "SINGLE", "shapeType": "${target.shape.toLowerCase()}" }
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "complete_the_figure", hideVisual: false }
    };
  },

  foundation_impossible_formation: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const scenarios = [
      { statement: "You can form a circle using only squares.", result: "False", distractors: ["True"] },
      { statement: "You can form a rectangle using two squares.", result: "True", distractors: ["False"] },
      { statement: "You can form a square using two triangles.", result: "True", distractors: ["False"] },
      { statement: "You can form a triangle using two circles.", result: "False", distractors: ["True"] },
      { statement: "You can form a circle using four quarter circles.", result: "True", distractors: ["False"] }
    ];
    const target = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    const questionTextTemplate = getQText(`Is this true or false? ${target.statement}`, `True or false: ${target.statement}`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}.`;
    
    let options = target.distractors;
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = [target.result, target.distractors[0]].sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== target.result) defectMapObj[opt] = "LOGIC_ERROR"; });
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
          "hint": "Try to imagine putting those shapes together.",
          "finalAnswer": "${target.result}",
          "solutionSteps": "The statement '${target.statement}' is ${target.result}."
        },
        "visualEngine": null,
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "impossible_formation", hideVisual: true }
    };
  }
};

export const foundationLogic = {
  generate: (variant, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    // If we only receive variant and type, provide standard defaults.
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
