import { getRandomContext } from '@/lib/utils/localization';
import { getRandomShapes, getRandomColors, getRandomNames, SHAPES_POOL, COLORS_POOL } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => {
  const allDistractors = [...distractors].sort(() => Math.random() - 0.5);
  const options = [correct, ...allDistractors.slice(0, 3)].sort(() => Math.random() - 0.5);
  return options;
};

const advancedVariants = {
  advanced_attribute_logic: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const targetColor = getRandomColors(1);
    const targetShape = getRandomShapes(1);
    
    // Properties of target shape
    let sideCount = 4;
    if (targetShape === "triangle") sideCount = 3;
    if (targetShape === "half circle") sideCount = 1;
    if (targetShape === "quarter circle") sideCount = 2;
    if (targetShape === "circle") sideCount = 0;
    
    const items = [
      { shapeType: targetShape, color: targetColor, size: "medium", label: "Item A" },
      { shapeType: targetShape, color: COLORS_POOL.find(c => c !== targetColor), size: "medium", label: "Item B" },
      { shapeType: SHAPES_POOL.find(s => s !== targetShape), color: targetColor, size: "medium", label: "Item C" },
      { shapeType: SHAPES_POOL.find(s => s !== targetShape), color: COLORS_POOL.find(c => c !== targetColor), size: "medium", label: "Item D" }
    ].sort(() => Math.random() - 0.5);

    const componentData = { layout: "GRID", items };
    const answer = items.find(i => i.shapeType === targetShape && i.color === targetColor).label;

    const questionTextTemplate = getQText(`Which item is ${targetColor} and has ${sideCount} straight sides?`, `Find the ${targetColor} shape with ${sideCount} straight sides.`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = ["Item A", "Item B", "Item C", "Item D"];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "ATTRIBUTE_ERROR"; });
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
          "hint": "Check both rules! First find the shapes with the correct sides, then check their colors.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${answer} is the only item that is both ${targetColor} and has ${sideCount} straight sides."
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

  advanced_shape_exclusion_riddles: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const targetShape = "circle";
    const targetColor = "#ef4444"; // red
    
    const items = [
      { shapeType: "circle", color: "#ef4444", size: "medium", label: "Item A" },
      { shapeType: "square", color: "#3b82f6", size: "medium", label: "Item B" },
      { shapeType: "triangle", color: "#22c55e", size: "medium", label: "Item C" },
      { shapeType: "rectangle", color: "#ef4444", size: "medium", label: "Item D" }
    ].sort(() => Math.random() - 0.5);

    const componentData = { layout: "GRID", items };
    const answer = items.find(i => i.shapeType === "circle").label;

    const questionTextTemplate = getQText(`I am NOT blue. I am NOT green. I have NO straight sides. Which item am I?`, `Not blue. Not green. No straight sides. Which item?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = ["Item A", "Item B", "Item C", "Item D"];
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
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
          "hint": "Rule out the items that don't match the clues one by one.",
          "finalAnswer": "${answer}",
          "solutionSteps": "The only shape that is not blue, not green, and has no straight sides is ${answer} (the red circle)."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "exclusion_riddles", hideVisual: false }
    };
  },

  advanced_orientation_invariance: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const shapes = ["square", "rectangle", "triangle", "half circle"];
    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    const rotations = [45, 135, 225, 315];
    const targetRot = rotations[Math.floor(Math.random() * rotations.length)];
    
    const componentData = { 
      layout: "SINGLE", 
      shapeType: targetShape, 
      color: getRandomColors(1), 
      size: "large",
      rotation: targetRot
    };

    const answer = targetShape.charAt(0).toUpperCase() + targetShape.slice(1);
    const questionTextTemplate = getQText(`Look at the tilted shape. What is its true name?`, `Name this tilted shape.`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = getShuffledOptions(answer, SHAPES_POOL.filter(s => s !== targetShape).map(s => s.charAt(0).toUpperCase() + s.slice(1)));
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "ORIENTATION_ERROR"; });
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
          "hint": "Try tilting your head or turning the screen to see what it normally looks like.",
          "finalAnswer": "${answer}",
          "solutionSteps": "Even though it is turned sideways, it still has the properties of a ${answer}."
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

  advanced_composite_deconstruct_inventory: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const subjects = ["rocket", "robot", "castle"];
    const sub = subjects[Math.floor(Math.random() * subjects.length)];
    const componentData = { layout: "COMPOSITE_GENERATIVE", parts: [], name: sub };

    const questionTextTemplate = getQText(`Which list shows exactly how many of each shape was used to build this ${sub}?`, `Inventory of shapes for ${sub} = ?`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      TASK: You are an artist and a math teacher! 
      1. Draw a '${sub}' using ONLY basic 2D shapes (circle, square, rectangle, triangle).
      2. Create EXACTLY 4 to 6 shapes. Output them in visualEngine.componentData.parts.
      3. Each part needs: shapeType, color (hex), x (20-80), y (20-80), scale (0.5 to 2.0). 
      4. Based on your drawing, calculate the EXACT inventory of shapes.
      5. Set content.finalAnswer to the correct inventory string (e.g. "1 Rectangle, 2 Circles, 1 Triangle").
      6. Generate 3 plausible distractors for content.options (e.g. swap a shape type or change a count).
      7. For "defectMap", map distractors to "CONCEPTUAL_ERROR".

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ["{inventory}", "{distractor1}", "{distractor2}", "{distractor3}"],
          "defectMap": { "{distractor1}": "CONCEPTUAL_ERROR", "{distractor2}": "CONCEPTUAL_ERROR", "{distractor3}": "CONCEPTUAL_ERROR" },
          "hint": "Break the drawing down into pieces and count how many of each shape type you see.",
          "finalAnswer": "{inventory}",
          "solutionSteps": "The ${sub} is made of exactly {inventory}."
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
    const items = [
      { shapeType: s1, color: c1, size: "medium", label: "Item 1" },
      { shapeType: s1, color: c2, size: "medium", label: "Item 2" },
      { shapeType: s2, color: c1, size: "medium", label: "Item 3" },
      { shapeType: s2, color: c2, size: "medium", label: "Item 4" }
    ];
    
    // Shuffle the layout to prevent predictability
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    // Relabel after shuffle so they are 1-4 left to right, top to bottom
    shuffledItems.forEach((item, index) => { item.label = `Item ${index + 1}`; });

    const componentData = { layout: "GRID", items: shuffledItems };
    // We choose the item that is s2 and c1
    const targetItem = shuffledItems.find(i => i.shapeType === s2 && i.color === c1);
    const answer = targetItem.label;

    const questionTextTemplate = getQText(`Find the item that fits this rule: It must be a ${s2} AND it must be ${c1}.`, `Find the ${c1} ${s2}.`);
    const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character, word, or number in 'questionText', 'visualEngine', 'componentData', 'solutionSteps', 'hint', or 'finalAnswer'. THIS IS A SHORT QUESTION SO THERE IS NO STORY. Just output the exact JSON structure with the provided values. IGNORE any logic instructions or examples." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all options MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

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
          "hint": "Look for the shape first, then check if it has the right color.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${answer} is the only item that is both a ${s2} and colored ${c1}."
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "matrix_intersection", hideVisual: false }
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
