import { getRandomNames } from '@/lib/utils/variable-bank';

export const advancedLogic = {
  variants: {
    advanced_symmetric_copy: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
      const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
      
      const baseShapes = [
        {
          name: "butterfly",
          leftHalf: [
            { start: [3, 1], end: [1, 2] },
            { start: [1, 2], end: [3, 3] },
            { start: [3, 3], end: [2, 5] },
            { start: [2, 5], end: [3, 5] }
          ]
        },
        {
          name: "arrow",
          leftHalf: [
            { start: [3, 1], end: [1, 3] },
            { start: [1, 3], end: [3, 3] },
            { start: [3, 3], end: [2, 5] },
            { start: [2, 5], end: [3, 5] }
          ]
        },
        {
          name: "crown",
          leftHalf: [
            { start: [3, 1], end: [1, 1] },
            { start: [1, 1], end: [1, 3] },
            { start: [1, 3], end: [2, 2] },
            { start: [2, 2], end: [3, 3] }
          ]
        }
      ];

      const chosenShape = baseShapes[Math.floor(Math.random() * baseShapes.length)];
      const leftHalf = chosenShape.leftHalf;

      // Auto-generate correct right half (mirror across x=3)
      const rightHalfCorrect = leftHalf.map(l => ({
        start: [6 - l.start[0], l.start[1]],
        end: [6 - l.end[0], l.end[1]]
      }));

      // Distractors
      const distractor1 = leftHalf.map(l => ({
        start: [l.start[0] + 2, l.start[1]],
        end: [l.end[0] + 2, l.end[1]]
      }));

      const distractor2 = rightHalfCorrect.map(l => ({
        start: [l.start[0], l.start[1] + 1],
        end: [l.end[0], l.end[1] + 1]
      }));

      const distractor3 = rightHalfCorrect.map(l => ({
        start: [l.start[0], 6 - l.start[1]],
        end: [l.end[0], 6 - l.end[1]]
      }));

      const origins = [ [1, 1], [8, 1], [1, 7], [8, 7] ];
      const labels = ['A', 'B', 'C', 'D'].sort(() => Math.random() - 0.5);
      const correctIndex = Math.floor(Math.random() * 4);
      const correctLabel = labels[correctIndex];

      let workspaceLines = [];
      let referenceLines = [];
      const distractors = [distractor1, distractor2, distractor3];
      let distIdx = 0;

      for (let i = 0; i < 4; i++) {
        const [ox, oy] = origins[i];
        const labelText = "Option " + labels[i];
        
        // Add dedicated invisible label
        workspaceLines.push({ start: [ox + 3, oy - 0.5], end: [ox + 3, oy - 0.5], label: labelText, color: "transparent" });

        referenceLines.push({ start: [ox + 3, oy - 1], end: [ox + 3, oy + 6], color: "red", dashed: true });
        
        leftHalf.forEach(l => {
          workspaceLines.push({ start: [l.start[0] + ox, l.start[1] + oy], end: [l.end[0] + ox, l.end[1] + oy] });
        });

        const rightSide = (i === correctIndex) ? rightHalfCorrect : distractors[distIdx++];
        rightSide.forEach(l => {
          workspaceLines.push({ start: [l.start[0] + ox, l.start[1] + oy], end: [l.end[0] + ox, l.end[1] + oy] });
        });
      }

      const componentData = { gridType, gridSize: { cols: 15, rows: 14 }, referenceLines, workspaceLines };
      const options = ["Option A", "Option B", "Option C", "Option D"];
      const finalAnswerStr = `Option ${correctLabel}`;

      const questionTextTemplate = getQText(`The red dotted line is a mirror line. Which of the labelled shapes (A, B, C, or D) shows the ${chosenShape.name} drawn perfectly symmetrically?`, `Find the symmetric shape.`);
      const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named \${getRandomNames(1)}.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator. 
        ${formatInstructions}
        ${storyInstruction}
  
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "MCQ", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
            "options": ${JSON.stringify(options)},
            "defectMap": null,
            "hint": "Check if every point on the right is exactly the same distance from the red line as the point on the left.",
            "finalAnswer": "${finalAnswerStr}",
            "solutionSteps": "${finalAnswerStr} is a perfect mirror reflection."
          },
          "visualEngine": {
            "componentToRender": "GRID_DISPLAY",
            "componentData": ${JSON.stringify(componentData)}
          },
          "inputRequirement": { "inputType": "MCQ_BUTTONS" }
        }`,
        metadata: { difficulty: 'advanced', steps: 1, logic: "advanced_symmetric_copy", hideVisual: false },
        visualEngine: {
          componentToRender: "GRID_DISPLAY",
          componentData
        }
      };
    },

    advanced_scaled_copy: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
      const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
      
      const scaleChoices = [2, 3];
      const scaleFactor = scaleChoices[Math.floor(Math.random() * scaleChoices.length)];
      const scaleWord = scaleFactor === 2 ? "TWICE" : "THREE TIMES";

      const shapes = [
        {
          name: "rectangle",
          base: [
            { start: [1, 1], end: [2, 1] },
            { start: [2, 1], end: [2, 2] },
            { start: [2, 2], end: [1, 2] },
            { start: [1, 2], end: [1, 1] }
          ]
        },
        {
          name: "triangle",
          base: [
            { start: [1, 2], end: [2, 2] },
            { start: [2, 2], end: [1, 1] },
            { start: [1, 1], end: [1, 2] }
          ]
        }
      ];
      const chosen = shapes[Math.floor(Math.random() * shapes.length)];
      const referenceShape = chosen.base;

      const makeScaled = (sx, sy) => chosen.base.map(l => ({
        start: [(l.start[0] - 1) * sx, (l.start[1] - 1) * sy],
        end: [(l.end[0] - 1) * sx, (l.end[1] - 1) * sy]
      }));

      const scaledCorrect = makeScaled(scaleFactor, scaleFactor);
      const scaledWrong1 = makeScaled(scaleFactor === 2 ? 3 : 2, scaleFactor === 2 ? 3 : 2);
      const scaledWidthOnly = makeScaled(scaleFactor, 1);
      const scaledHeightOnly = makeScaled(1, scaleFactor);

      const origins = [ [5, 1], [10, 1], [5, 9], [10, 9] ];
      const labels = ['A', 'B', 'C', 'D'].sort(() => Math.random() - 0.5);
      const correctIndex = Math.floor(Math.random() * 4);
      const correctLabel = labels[correctIndex];

      let workspaceLines = [];
      let referenceLines = referenceShape.map(l => ({ start: [l.start[0], l.start[1]], end: [l.end[0], l.end[1]], color: "blue" }));
      referenceLines.push({ start: [1.5, 0.5], end: [1.5, 0.5], label: "Target", color: "transparent" });

      const distractors = [scaledWrong1, scaledWidthOnly, scaledHeightOnly];
      let distIdx = 0;

      for (let i = 0; i < 4; i++) {
        const [ox, oy] = origins[i];
        const labelText = "Option " + labels[i];
        
        workspaceLines.push({ start: [ox + 1, oy - 0.5], end: [ox + 1, oy - 0.5], label: labelText, color: "transparent" });

        const shape = (i === correctIndex) ? scaledCorrect : distractors[distIdx++];
        shape.forEach(l => {
          workspaceLines.push({ start: [l.start[0] + ox, l.start[1] + oy], end: [l.end[0] + ox, l.end[1] + oy] });
        });
      }

      const componentData = { gridType, gridSize: { cols: 15, rows: 17 }, referenceLines, workspaceLines };
      const options = ["Option A", "Option B", "Option C", "Option D"];
      const finalAnswerStr = `Option ${correctLabel}`;

      const questionTextTemplate = getQText(`Look at the blue Target ${chosen.name}. Which of the labelled shapes shows the Target drawn EXACTLY ${scaleWord} as big?`, `Find the ${scaleFactor}x scaled shape.`);
      const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named \${getRandomNames(1)}.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator. 
        ${formatInstructions}
        ${storyInstruction}
  
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "MCQ", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
            "options": ${JSON.stringify(options)},
            "defectMap": null,
            "hint": "The correct answer must be ${scaleFactor} times as wide and ${scaleFactor} times as tall.",
            "finalAnswer": "${finalAnswerStr}",
            "solutionSteps": "${finalAnswerStr} is exactly ${scaleWord.toLowerCase()} as wide and tall."
          },
          "visualEngine": {
            "componentToRender": "GRID_DISPLAY",
            "componentData": ${JSON.stringify(componentData)}
          },
          "inputRequirement": { "inputType": "MCQ_BUTTONS" }
        }`,
        metadata: { difficulty: 'advanced', steps: 1, logic: "advanced_scaled_copy", hideVisual: false },
        visualEngine: {
          componentToRender: "GRID_DISPLAY",
          componentData
        }
      };
    },

    advanced_translation_copy: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
      const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
      
      const shapes = [
        {
          name: "triangle",
          coords: [
            { start: [2, 2], end: [4, 2] },
            { start: [4, 2], end: [4, 4] },
            { start: [4, 4], end: [2, 2] }
          ]
        },
        {
          name: "rectangle",
          coords: [
            { start: [2, 2], end: [4, 2] },
            { start: [4, 2], end: [4, 3] },
            { start: [4, 3], end: [2, 3] },
            { start: [2, 3], end: [2, 2] }
          ]
        },
        {
          name: "square",
          coords: [
            { start: [2, 2], end: [4, 2] },
            { start: [4, 2], end: [4, 4] },
            { start: [4, 4], end: [2, 4] },
            { start: [2, 4], end: [2, 2] }
          ]
        },
        {
          name: "arrow shape",
          coords: [
            { start: [2, 3], end: [3, 2] },
            { start: [3, 2], end: [4, 3] },
            { start: [4, 3], end: [3, 4] },
            { start: [3, 4], end: [2, 3] }
          ]
        }
      ];
      const chosenShape = shapes[Math.floor(Math.random() * shapes.length)];
      const referenceTri = chosenShape.coords;

      // Safe slots to place the 4 options so they never overlap with the Target or each other
      const safeSlots = [
        { x: 2, y: 7 }, { x: 2, y: 12 },
        { x: 7, y: 2 }, { x: 7, y: 7 }, { x: 7, y: 12 },
        { x: 12, y: 2 }, { x: 12, y: 7 }, { x: 12, y: 12 }
      ].sort(() => Math.random() - 0.5);

      const chosenSlots = safeSlots.slice(0, 4);

      const labels = ['A', 'B', 'C', 'D'].sort(() => Math.random() - 0.5);
      const correctIndex = Math.floor(Math.random() * 4);
      const correctLabel = labels[correctIndex];
      const correctSlot = chosenSlots[correctIndex];

      const dxCorrect = correctSlot.x - 2;
      const dyCorrect = correctSlot.y - 2;

      let workspaceLines = [];
      let referenceLines = referenceTri.map(l => ({ start: [l.start[0], l.start[1]], end: [l.end[0], l.end[1]], color: "blue" }));
      referenceLines.push({ start: [3, 1.5], end: [3, 1.5], label: "Target", color: "transparent" });

      for (let i = 0; i < 4; i++) {
        const slot = chosenSlots[i];
        const labelText = "Option " + labels[i];
        
        workspaceLines.push({ start: [slot.x + 1, slot.y - 0.5], end: [slot.x + 1, slot.y - 0.5], label: labelText, color: "transparent" });

        referenceTri.forEach(l => {
          workspaceLines.push({ 
            start: [l.start[0] - 2 + slot.x, l.start[1] - 2 + slot.y], 
            end: [l.end[0] - 2 + slot.x, l.end[1] - 2 + slot.y] 
          });
        });
      }

      const componentData = { gridType, gridSize: { cols: 17, rows: 17 }, referenceLines, workspaceLines };
      const options = ["Option A", "Option B", "Option C", "Option D"];
      const finalAnswerStr = `Option ${correctLabel}`;

      const questionTextTemplate = getQText(`Look at the blue Target ${chosenShape.name}. Which of the labelled shapes shows the Target moved exactly ${dxCorrect} squares to the RIGHT and ${dyCorrect} squares DOWN?`, `Find the translated shape.`);
      const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named \${getRandomNames(1)}.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator. 
        ${formatInstructions}
        ${storyInstruction}
  
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "MCQ", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
            "options": ${JSON.stringify(options)},
            "defectMap": null,
            "hint": "Pick a corner of the Target (like the top-left corner). Count ${dxCorrect} squares right and ${dyCorrect} squares down.",
            "finalAnswer": "${finalAnswerStr}",
            "solutionSteps": "${finalAnswerStr} has been moved exactly ${dxCorrect} squares right and ${dyCorrect} squares down from the Target."
          },
          "visualEngine": {
            "componentToRender": "GRID_DISPLAY",
            "componentData": ${JSON.stringify(componentData)}
          },
          "inputRequirement": { "inputType": "MCQ_BUTTONS" }
        }`,
        metadata: { difficulty: 'advanced', steps: 1, logic: "advanced_translation_copy", hideVisual: false },
        visualEngine: {
          componentToRender: "GRID_DISPLAY",
          componentData
        }
      };
    },

    advanced_pattern_extension: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
      const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
      
      const patterns = [
        {
          name: "zigzag",
          desc: "UP 2 and RIGHT 1, then DOWN 2 and RIGHT 1",
          basePattern: [ { start: [0, 2], end: [1, 0] }, { start: [1, 0], end: [2, 2] }, { start: [2, 2], end: [3, 0] }, { start: [3, 0], end: [4, 2] } ],
          correctNext: [ { start: [4, 2], end: [5, 0] }, { start: [5, 0], end: [6, 2] } ],
          distractor1: [ { start: [4, 2], end: [5, 4] }, { start: [5, 4], end: [6, 2] } ], 
          distractor2: [ { start: [4, 2], end: [6, 0] }, { start: [6, 0], end: [7, 2] } ], 
          distractor3: [ { start: [4, 2], end: [5, 2] }, { start: [5, 2], end: [6, 2] } ]  
        },
        {
          name: "steps",
          desc: "RIGHT 1, then UP 1",
          basePattern: [ { start: [0, 2], end: [1, 2] }, { start: [1, 2], end: [1, 1] }, { start: [1, 1], end: [2, 1] }, { start: [2, 1], end: [2, 0] } ],
          correctNext: [ { start: [2, 0], end: [3, 0] }, { start: [3, 0], end: [3, -1] } ],
          distractor1: [ { start: [2, 0], end: [2, -1] }, { start: [2, -1], end: [3, -1] } ],
          distractor2: [ { start: [2, 0], end: [3, 0] }, { start: [3, 0], end: [4, 0] } ],
          distractor3: [ { start: [2, 0], end: [3, 1] }, { start: [3, 1], end: [4, 1] } ]
        }
      ];

      const chosenPattern = patterns[Math.floor(Math.random() * patterns.length)];

      const origins = [ [1, 2], [1, 7], [1, 12], [1, 17] ];
      const labels = ['A', 'B', 'C', 'D'].sort(() => Math.random() - 0.5);
      const correctIndex = Math.floor(Math.random() * 4);
      const correctLabel = labels[correctIndex];

      let workspaceLines = [];
      let referenceLines = [];
      const distractors = [chosenPattern.distractor1, chosenPattern.distractor2, chosenPattern.distractor3];
      let distIdx = 0;

      for (let i = 0; i < 4; i++) {
        const [ox, oy] = origins[i];
        const labelText = "Option " + labels[i];
        
        workspaceLines.push({ start: [ox + 3.5, oy - 0.5], end: [ox + 3.5, oy - 0.5], label: labelText, color: "transparent" });
        
        chosenPattern.basePattern.forEach(l => {
          workspaceLines.push({ start: [l.start[0] + ox, l.start[1] + oy], end: [l.end[0] + ox, l.end[1] + oy], color: "blue" });
        });

        const nextLines = (i === correctIndex) ? chosenPattern.correctNext : distractors[distIdx++];
        nextLines.forEach(l => {
          workspaceLines.push({ start: [l.start[0] + ox, l.start[1] + oy], end: [l.end[0] + ox, l.end[1] + oy], color: "red", dashed: true });
        });
      }

      const componentData = { gridType, gridSize: { cols: 10, rows: 22 }, referenceLines, workspaceLines };
      const options = ["Option A", "Option B", "Option C", "Option D"];
      const finalAnswerStr = `Option ${correctLabel}`;

      const questionTextTemplate = getQText(`Look at the blue ${chosenPattern.name} patterns. Which option correctly continues the pattern using the red dotted lines?`, `Find the correct pattern extension.`);
      const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named \${getRandomNames(1)}.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator. 
        ${formatInstructions}
        ${storyInstruction}
  
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "MCQ", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
            "options": ${JSON.stringify(options)},
            "defectMap": null,
            "hint": "The pattern goes ${chosenPattern.desc}.",
            "finalAnswer": "${finalAnswerStr}",
            "solutionSteps": "${finalAnswerStr} correctly continues the pattern."
          },
          "visualEngine": {
            "componentToRender": "GRID_DISPLAY",
            "componentData": ${JSON.stringify(componentData)}
          },
          "inputRequirement": { "inputType": "MCQ_BUTTONS" }
        }`,
        metadata: { difficulty: 'advanced', steps: 1, logic: "advanced_pattern_extension", hideVisual: false },
        visualEngine: {
          componentToRender: "GRID_DISPLAY",
          componentData
        }
      };
    },

    advanced_rotated_copy_mcq: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
      const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
      
      const shapes = [
        {
          name: "L-shape",
          coords: [
            { start: [0, 0], end: [1, 0] },
            { start: [1, 0], end: [1, 2] },
            { start: [1, 2], end: [2, 2] },
            { start: [2, 2], end: [2, 3] },
            { start: [2, 3], end: [0, 3] },
            { start: [0, 3], end: [0, 0] }
          ]
        },
        {
          name: "T-shape",
          coords: [
            { start: [0, 0], end: [3, 0] },
            { start: [3, 0], end: [3, 1] },
            { start: [2, 1], end: [2, 3] },
            { start: [1, 3], end: [1, 1] },
            { start: [1, 1], end: [0, 1] },
            { start: [0, 1], end: [0, 0] }
          ]
        },
        {
          name: "stairs shape",
          coords: [
            { start: [0, 1], end: [1, 1] },
            { start: [1, 1], end: [1, 2] },
            { start: [1, 2], end: [2, 2] },
            { start: [2, 2], end: [2, 3] },
            { start: [2, 3], end: [0, 3] },
            { start: [0, 3], end: [0, 1] }
          ]
        }
      ];

      const chosenShape = shapes[Math.floor(Math.random() * shapes.length)];
      const targetShape = chosenShape.coords;

      const referenceLines = targetShape.map(l => ({
        start: [l.start[0] + 1, l.start[1] + 1],
        end: [l.end[0] + 1, l.end[1] + 1],
        color: "blue"
      }));
      referenceLines.push({ start: [2, 0.5], end: [2, 0.5], label: "Target", color: "transparent" });

      const rotatedTarget = targetShape.map(l => ({
        start: [3 - l.start[1], l.start[0]],
        end: [3 - l.end[1], l.end[0]]
      }));

      const flippedTarget = targetShape.map(l => ({
        start: [2 - l.start[0], l.start[1]],
        end: [2 - l.end[0], l.end[1]]
      }));

      const stretchedTarget = targetShape.map(l => ({
        start: [l.start[0], l.start[1] === 3 ? 4 : l.start[1]],
        end: [l.end[0], l.end[1] === 3 ? 4 : l.end[1]]
      }));

      const origins = [ [5, 2], [10, 2], [2, 8], [8, 8] ];
      const labels = ['A', 'B', 'C', 'D'].sort(() => Math.random() - 0.5);
      const correctIndex = Math.floor(Math.random() * 4);
      const correctLabel = labels[correctIndex];

      let workspaceLines = [];
      let distIdx = 0;
      const distractors = [flippedTarget, stretchedTarget, targetShape]; 

      for (let i = 0; i < 4; i++) {
        const [ox, oy] = origins[i];
        const labelText = "Option " + labels[i];
        
        workspaceLines.push({ start: [ox + 1.5, oy - 0.5], end: [ox + 1.5, oy - 0.5], label: labelText, color: "transparent" });
        
        const linesToUse = (i === correctIndex) ? rotatedTarget : distractors[distIdx++];
        linesToUse.forEach(l => {
          workspaceLines.push({ start: [l.start[0] + ox, l.start[1] + oy], end: [l.end[0] + ox, l.end[1] + oy] });
        });
      }

      const componentData = { gridType, gridSize: { cols: 15, rows: 13 }, referenceLines, workspaceLines };
      const options = ["Option A", "Option B", "Option C", "Option D"];
      const finalAnswerStr = `Option ${correctLabel}`;

      const questionTextTemplate = getQText(`Look at the blue Target ${chosenShape.name} on the top left. Which of the labelled shapes (A, B, C, or D) shows the EXACT same shape but rotated on its side?`, `Find the rotated copy.`);
      const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named \${getRandomNames(1)}.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator. 
        ${formatInstructions}
        ${storyInstruction}
  
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "MCQ", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
            "options": ${JSON.stringify(options)},
            "defectMap": null,
            "hint": "Try turning your head or the screen to see which shape matches exactly.",
            "finalAnswer": "${finalAnswerStr}",
            "solutionSteps": "${finalAnswerStr} is the exact same shape rotated 90 degrees."
          },
          "visualEngine": {
            "componentToRender": "GRID_DISPLAY",
            "componentData": ${JSON.stringify(componentData)}
          },
          "inputRequirement": { "inputType": "MCQ_BUTTONS" }
        }`,
        metadata: { difficulty: 'advanced', steps: 1, logic: "advanced_rotated_copy_mcq", hideVisual: false },
        visualEngine: {
          componentToRender: "GRID_DISPLAY",
          componentData
        }
      };
    }
  },

  generate: (variant, type, config = {}, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context) => {
    const getQText = (mathText, rawText) => {
      if (isShort) return rawText;
      return mathText;
    };
    const targetVariantFunction = advancedLogic.variants[variant] || advancedLogic.variants.advanced_symmetric_copy;
    return targetVariantFunction(config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};
