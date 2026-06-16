import { getRandomContext } from '@/lib/utils/localization';

const allShapes = ["circle", "triangle", "square", "rectangle"];
const allColors = ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#f97316"]; 
const getRandom = (arr, count) => [...arr].sort(() => Math.random() - 0.5).slice(0, count);
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const getShuffledOptions = (correct, distractors) => {
  return [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
};

export const standardVariants = {
  standard_count_composite: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const targetShape = allShapes[Math.floor(Math.random() * allShapes.length)];
    const subjects = ["steam train", "space rocket", "friendly robot", "sailboat on water", "tall castle", "butterfly", "racecar", "snowman", "house with a tree", "dog", "cat", "fish in a bowl", "submarine", "hot air balloon", "bulldozer"];
    const selectedSubject = subjects[Math.floor(Math.random() * subjects.length)];

    const componentData = { layout: "COMPOSITE_GENERATIVE", parts: [], name: selectedSubject };

    const answer = "{count}";
    const questionTextTemplate = getQText(`Look at the picture of the ${selectedSubject}. How many ${targetShape}s are used to build it?`, `How many ${targetShape}s in the ${selectedSubject}?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL TASK: Build a 2D drawing of a "${selectedSubject.toUpperCase()}" built ENTIRELY out of basic shapes.
      
      1. Generate an array of 5 to 10 shapes inside visualEngine.componentData.parts to create the ${selectedSubject}. Every part MUST have:
          - shapeType: "circle" | "square" | "triangle" | "rectangle"
          - color: a vibrant, child-friendly hex code (e.g., "#ef4444", "#3b82f6", "#eab308")
          - x: number (20 to 80) representing horizontal percentage (50 is center)
          - y: number (20 to 80) representing vertical percentage (50 is center)
          - scale: number (0.5 to 2.5) for size
          - rotation: number (0 to 360) for angle
      3. Ensure at least 1 and up to 4 shapes in your drawing are EXACTLY the "${targetShape}".
      4. Calculate the EXACT count of "${targetShape}"s in your parts array.
      5. Replace "{count}" in the promptObject.content strings with your generated value.
      6. Generate the options array containing the true count and 3 close distractors (e.g., ["2", "3", "4", "5"]).
      7. For "defectMap", map distractors to "CARELESS_CALCULATION".

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ["{count}", "{distractor1}", "{distractor2}", "{distractor3}"],
          "defectMap": { "{distractor1}": "CARELESS_CALCULATION", "{distractor2}": "CARELESS_CALCULATION", "{distractor3}": "CARELESS_CALCULATION" },
          "hint": ${JSON.stringify(getQText(`Count every single ${targetShape} you can find, even if they are different sizes or turned sideways!`, `Count all ${targetShape}s.`))},
          "finalAnswer": "{count}",
          "solutionSteps": ${JSON.stringify(getQText(`By looking closely at the ${selectedSubject}, we can count exactly {count} ${targetShape}s used in the drawing.`, `There are {count} ${targetShape}s.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "count_composite", hideVisual: false }
    };
  },

  standard_pattern_next: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const [sA, sB, sC] = getRandom(allShapes, 3);
    const templates = [
      { type: "ABAB", seq: [sA, sB, sA, sB, sA], next: sB },
      { type: "AABB", seq: [sA, sA, sB, sB, sA, sA], next: sB },
      { type: "ABC", seq: [sA, sB, sC, sA, sB, sC, sA, sB], next: sC }
    ];
    const selected = templates[Math.floor(Math.random() * templates.length)];
    const componentData = { layout: "PATTERN", pattern: selected.seq, nextItem: selected.next };
    
    const answer = capitalize(selected.next);
    const questionTextTemplate = getQText(`What shape comes next in the pattern?`, `Next shape in pattern = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = getRandom(allShapes, 4).map(capitalize);
    if (!options.includes(answer)) {
      options[0] = answer;
    }

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
          "hint": ${JSON.stringify(getQText(`Look closely at how the shapes repeat. Say their names out loud in order!`, `Say the pattern aloud.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The pattern follows a repeating rule. After the sequence ends, the correct next shape is a ${selected.next}.`, `The next shape is ${selected.next}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "pattern_next", hideVisual: false }
    };
  },

  standard_pattern_missing_middle: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const [sA, sB] = getRandom(allShapes, 2);
    const componentData = { layout: "PATTERN", pattern: [sA, sB, sA, sB], gapIndex: 2 };
    
    const answer = capitalize(sA);
    const questionTextTemplate = getQText(`Look at the pattern. What shape is missing in the box with the question mark?`, `Missing shape = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = getRandom(allShapes, 4).map(capitalize);
    if (!options.includes(answer)) {
      options[0] = answer;
    }

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
          "hint": ${JSON.stringify(getQText(`Say the pattern out loud. What shape should come between the two shapes to keep the pattern going?`, `Find the missing shape in the sequence.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The pattern repeats ${sA} and ${sB}. The shape between the two ${sB}s must be a ${sA}.`, `The missing shape is ${sA}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "pattern_missing_middle", hideVisual: false }
    };
  },

  standard_compose_shapes: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const rules = [
      { text: "If you put 2 identical squares side-by-side, what new shape do you make?", ans: "Rectangle", hint: "Think about the sides getting longer when you push them together!" },
      { text: "If you cut a square exactly in half straight down the middle, what two shapes do you get?", ans: "Rectangles", hint: "If you chop a square in half, you get two shapes with long and short sides." },
      { text: "If you cut a square from corner to corner, what two shapes do you get?", ans: "Triangles", hint: "Cutting corner to corner gives you pointy shapes with 3 sides." }
    ];
    const selected = rules[Math.floor(Math.random() * rules.length)];
    const answer = selected.ans;

    const questionTextTemplate = getQText(selected.text, selected.text);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = getRandom(["Squares", "Rectangles", "Triangles", "Circles"], 4);
    if (!options.includes(answer)) {
      options[0] = answer;
    }

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
          "hint": ${JSON.stringify(getQText(selected.hint, `Imagine joining or cutting the shape.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`By imagining the cut or join, we can see the resulting shape(s) will be ${selected.ans}.`, `Result is ${selected.ans}.`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "compose_shapes", hideVisual: true }
    };
  },

  standard_decompose_shape: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const rules = [
      { text: "If you cut a circle in half, what do you get?", ans: "Two half-circles", hint: "Cutting something into two equal pieces gives you two halves." },
      { text: "If you slice a rectangle in half from corner to corner, what two shapes do you get?", ans: "Triangles", hint: "Think about making two pointy shapes with 3 sides." }
    ];
    const selected = rules[Math.floor(Math.random() * rules.length)];
    const answer = selected.ans;

    const questionTextTemplate = getQText(selected.text, selected.text);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = getRandom(["Squares", "Triangles", "Circles", "Two half-circles"], 4);
    if (!options.includes(answer)) {
      options[0] = answer;
    }

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
          "hint": ${JSON.stringify(getQText(selected.hint, `Imagine cutting the shape.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Dividing a shape in a specific way changes what it is. In this case, you get ${selected.ans}.`, `Result is ${selected.ans}.`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "decompose_shape", hideVisual: true }
    };
  },

  standard_most_frequent_shape: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const subjects = ["steam train", "space rocket", "friendly robot", "sailboat on water", "tall castle", "butterfly", "racecar", "snowman", "house with a tree", "dog", "cat", "fish in a bowl", "submarine", "hot air balloon", "bulldozer"];
    const selectedSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const askMostFrequent = Math.random() > 0.5; 
    const componentData = { layout: "COMPOSITE_GENERATIVE", parts: [], name: selectedSubject };

    const questionTextTemplate = getQText(`Look at the picture of the ${selectedSubject}. Which shape is used the ${askMostFrequent ? 'most' : 'least'} to build it?`, `${askMostFrequent ? 'Most' : 'Least'} frequent shape in the ${selectedSubject}?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL TASK: Build a 2D drawing of a "${selectedSubject.toUpperCase()}" built ENTIRELY out of basic shapes.
      
      1. Generate an array of 5 to 10 shapes inside visualEngine.componentData.parts to create the ${selectedSubject}. Every part MUST have:
          - shapeType: "circle" | "square" | "triangle" | "rectangle"
          - color: a vibrant, child-friendly hex code (e.g., "#ef4444", "#3b82f6", "#eab308")
          - x: number (0 to 100) representing horizontal percentage (50 is center)
          - y: number (0 to 100) representing vertical percentage (50 is center)
          - scale: number (0.5 to 2.5) for size
          - rotation: number (0 to 360) for angle
      2. Ensure there is a clear ${askMostFrequent ? 'most' : 'least'} frequent shape. If asking for 'most', one shape type should appear at least 2 more times than any other. If asking for 'least', one shape type should appear at least 2 fewer times than any other, or only once.
      3. Calculate the EXACT name of the ${askMostFrequent ? 'most' : 'least'} frequent shape (e.g., "Triangle", "Square", "They are the same").
      4. Replace "{targetShapeName}" in the promptObject.content strings with your calculated value.
      5. Generate the options array containing the true answer and 3 close distractors (e.g., ["Triangle", "Square", "Circle", "Rectangle"]). Include "They are the same" if applicable.
      6. For "defectMap", map distractors to "CONCEPTUAL_ERROR".

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ["{targetShapeName}", "{distractor1}", "{distractor2}", "{distractor3}"],
          "defectMap": { "{distractor1}": "CONCEPTUAL_ERROR", "{distractor2}": "CONCEPTUAL_ERROR", "{distractor3}": "CONCEPTUAL_ERROR" },
          "hint": ${JSON.stringify(getQText(`Count how many times each type of shape appears in the ${selectedSubject}.`, `Count each shape type.`))},
          "finalAnswer": "{targetShapeName}",
          "solutionSteps": ${JSON.stringify(getQText(`By counting all the shapes in the ${selectedSubject}, we find that {targetShapeName} is used the ${askMostFrequent ? 'most' : 'least'}.`, `It is {targetShapeName}.`))}
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

  standard_shape_riddles: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const riddles = [
      { ans: "Square", clue: "I have 4 straight sides. All my sides are exactly the same length. What shape am I?" },
      { ans: "Rectangle", clue: "I have 4 straight sides. Two of my sides are long, and two are short. What shape am I?" },
      { ans: "Triangle", clue: "I have exactly 3 straight sides and 3 pointy corners. What shape am I?" },
      { ans: "Circle", clue: "I have no straight sides and no sharp corners. I am perfectly round. What shape am I?" }
    ];
    const selected = riddles[Math.floor(Math.random() * riddles.length)];
    const answer = selected.ans;

    const questionTextTemplate = getQText(selected.clue, selected.clue);
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
          "hint": ${JSON.stringify(getQText(`Count the sides and corners mentioned in the riddle to find the answer!`, `Use the clues.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Based on the clues given, the only shape that matches those exact rules is a ${selected.ans}.`, `It is a ${selected.ans}.`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "shape_riddles", hideVisual: true }
    };
  },

  standard_pattern_mistake: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const [sA, sB] = getRandom(allShapes, 2);
    const mistakeIndex = Math.floor(Math.random() * 4) + 1;
    const seq = Array.from({ length: 5 }, (_, i) => i % 2 === 0 ? sA : sB);
    const originalShape = seq[mistakeIndex];
    const wrongShape = originalShape === sA ? sB : sA;
    seq[mistakeIndex] = wrongShape;
    const positionLabels = ["1st", "2nd", "3rd", "4th", "5th"];
    const mistakePos = positionLabels[mistakeIndex];
    const answer = `The ${mistakePos} ${capitalize(wrongShape)}`;
    const componentData = { layout: "PATTERN", pattern: seq, mistakeIndex: mistakeIndex };
    const optionPool = seq.map((s, i) => `The ${positionLabels[i]} ${capitalize(s)}`);

    const questionTextTemplate = getQText(`Look at the pattern. Which shape is the mistake?`, `Which shape is incorrect?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = getShuffledOptions(answer, getRandom(optionPool.filter(o => o !== answer), 3));
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
          "hint": ${JSON.stringify(getQText(`Say the pattern out loud. Where does it stop making sense?`, `Find the sequence error.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The pattern should follow the rule: ${capitalize(sA)}, ${capitalize(sB)}, ${capitalize(sA)}, ${capitalize(sB)}... The ${mistakePos} shape is a ${capitalize(wrongShape)} but it should be a ${capitalize(originalShape)}.`, `Mistake is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "pattern_mistake", hideVisual: false }
    };
  },

  standard_find_all_target_shape: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const target = allShapes[Math.floor(Math.random() * allShapes.length)];
    const items = [];
    let count = 0;
    for (let i = 0; i < 6; i++) {
      const shape = allShapes[Math.floor(Math.random() * allShapes.length)];
      if (shape === target) count++;
      items.push({ shapeType: shape, color: allColors[Math.floor(Math.random() * allColors.length)], size: getRandom(["small", "medium", "large"], 1)[0] });
    }
    const componentData = { layout: "GRID", items: items };
    const answer = String(count);

    const questionTextTemplate = getQText(`How many ${target}s are in the grid?`, `Number of ${target}s = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = getShuffledOptions(answer, ["0", "1", "2", "3", "4", "5"].filter(x => x !== answer).slice(0, 3));
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
          "hint": ${JSON.stringify(getQText(`Count only the ${target}s you see in the grid.`, `Count the ${target}s.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`By looking at every shape, we find there are exactly ${count} ${target}s.`, `There are ${count} ${target}s.`))}
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

  standard_match_composite_parts: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const subjects = ["steam train", "space rocket", "friendly robot", "sailboat on water", "tall castle", "butterfly", "racecar", "snowman", "house with a tree", "dog", "cat", "fish in a bowl", "submarine", "hot air balloon", "bulldozer"];
    const selectedSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const componentData = { layout: "COMPOSITE_GENERATIVE", parts: [], name: selectedSubject };

    const answer = "{inventory}";
    const questionTextTemplate = getQText(`Look at the picture of the ${selectedSubject}. Which list of shapes was used to build it?`, `Shapes used to build the ${selectedSubject} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL TASK: Build a 2D drawing of a "${selectedSubject.toUpperCase()}" built ENTIRELY out of basic shapes.
      
      1. Generate an array of 5 to 10 shapes inside visualEngine.componentData.parts to create the ${selectedSubject}. Every part MUST have:
          - shapeType: "circle" | "square" | "triangle" | "rectangle"
          - color: a vibrant, child-friendly hex code (e.g., "#ef4444", "#3b82f6", "#eab308")
          - x: number (0 to 100) representing horizontal percentage (50 is center)
          - y: number (0 to 100) representing vertical percentage (50 is center)
          - scale: number (0.5 to 2.5) for size
          - rotation: number (0 to 360) for angle
      2. Calculate the exact inventory list of shapes used (e.g., "2 Triangles, 1 Square and 3 Circles").
      3. Replace "{inventory}" in the promptObject.content strings with your calculated summary.
      4. Generate the options array containing the true inventory and 3 incorrect but similar inventories (e.g., by changing one shape count or type).
      5. Map distractors in defectMap to "CONCEPTUAL_ERROR".

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ["{inventory}", "{distractor1}", "{distractor2}", "{distractor3}"],
          "defectMap": { "{distractor1}": "CONCEPTUAL_ERROR", "{distractor2}": "CONCEPTUAL_ERROR", "{distractor3}": "CONCEPTUAL_ERROR" },
          "hint": ${JSON.stringify(getQText(`Break down the drawing into the simple shapes you know.`, `Identify the parts.`))},
          "finalAnswer": "{inventory}",
          "solutionSteps": ${JSON.stringify(getQText(`By looking at the parts of the ${selectedSubject}, we can see it is built from {inventory}.`, `It is {inventory}.`))}
        },
        "visualEngine": {
          "componentToRender": "SHAPE_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "match_composite_parts", hideVisual: false }
    };
  }
};

export const standardLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (standardVariants[activeVariant]) {
    return standardVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};