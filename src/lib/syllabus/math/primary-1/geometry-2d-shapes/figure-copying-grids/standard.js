import { getRandomNames } from '@/lib/utils/variable-bank';

const standardLogic = {
  getVariants: () => ({
    standard_diagonal_line: "Copy a single diagonal line on a grid.",
    standard_triangle_copy: "Copy a basic triangle on a grid.",
    standard_composite_shape: "Copy a composite shape (e.g. house or boat) on a grid.",
    standard_complete_composite: "Complete the missing half of a composite shape.",
    standard_identify_incorrect_copy: "MCQ: Identify which of the 4 grids shows an incorrect copy of the shape."
  }),
  generate: (variant, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    // Normalization helper (backend must normalize finalAnswer so grading works perfectly)
    const normalizeLinesArray = (lines) => {
      const normalized = lines.map(line => {
        if (!line.start || !line.end) return line;
        const [x1, y1] = line.start;
        const [x2, y2] = line.end;
        if (x1 > x2 || (x1 === x2 && y1 > y2)) {
          return { start: [x2, y2], end: [x1, y1] };
        }
        return { start: [x1, y1], end: [x2, y2] };
      });
      normalized.sort((a, b) => {
        if (a.start[0] !== b.start[0]) return a.start[0] - b.start[0];
        if (a.start[1] !== b.start[1]) return a.start[1] - b.start[1];
        if (a.end[0] !== b.end[0]) return a.end[0] - b.end[0];
        return a.end[1] - b.end[1];
      });
      return normalized;
    };

    const variants = {
      standard_diagonal_line: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
        const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
        
        // Random diagonal direction: down-right, up-right
        const dx = Math.random() > 0.5 ? 3 : -3;
        const dy = 3;
        
        const startX = dx > 0 ? 1 : 4;
        const startY = 1;
        
        const referenceLines = [
          { start: [startX, startY], end: [startX + dx, startY + dy] }
        ];

        const componentData = { 
          gridType, 
          gridSize: { cols: 6, rows: 6 },
          referenceLines,
          workspaceLines: []
        };

        const answer = JSON.stringify(normalizeLinesArray(referenceLines));

        const questionTextTemplate = getQText(`Copy the diagonal line exactly as it is shown onto the empty grid.`, `Copy the line.`);
        const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character. THIS IS A SHORT QUESTION SO THERE IS NO STORY." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT modify ANY field in the JSON template except replacing the [STORY] tag.`;

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
              "hint": "Count how many dots across and how many dots down the line goes.",
              "finalAnswer": ${JSON.stringify(answer)},
              "solutionSteps": "You drew a diagonal line matching the target line."
            },
            "visualEngine": {
              "componentToRender": "GRID_DRAWING_CANVAS",
              "componentData": ${JSON.stringify(componentData)}
            },
            "inputRequirement": { "inputType": "INTERACTIVE_GRID" }
          }`,
          metadata: { difficulty: 'standard', steps: 1, logic: "standard_diagonal_line", hideVisual: false },
          visualEngine: {
            componentToRender: "GRID_DRAWING_CANVAS",
            componentData
          }
        };
      },

      standard_triangle_copy: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
        const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
        
        const vectors = [
          [1, 0], [0, 1], // Upright
          [1, 1], [1, -1], // 45 deg
          [2, 1], [1, 2], [2, -1], [-1, 2], // ~26.5 deg / 63.4 deg
          [3, 1], [1, 3], [3, -1], [-1, 3]  // ~18.4 deg / 71.6 deg
        ];

        let finalLines = null;
        let dx = 0, dy = 0;

        while (!finalLines) {
          const v1 = vectors[Math.floor(Math.random() * vectors.length)];
          const v2 = [-v1[1], v1[0]]; // Orthogonal direction for height

          const isTilted = Math.abs(v1[0]) > 0 && Math.abs(v1[1]) > 0;
          // Width must be even so top vertex is exactly halfway
          const width = isTilted ? 2 : (Math.random() > 0.5 ? 2 : 4);
          const height = isTilted ? (Math.floor(Math.random() * 2) + 1) : (Math.floor(Math.random() * 3) + 2);

          const p0 = [0, 0];
          const p1 = [width * v1[0], width * v1[1]];
          const p2 = [(width/2) * v1[0] + height * v2[0], (width/2) * v1[1] + height * v2[1]];

          const pts = [p0, p1, p2];
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
              { start: [p2[0] + dx, p2[1] + dy], end: [p0[0] + dx, p0[1] + dy] }
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

        const answer = JSON.stringify(normalizeLinesArray(referenceLines));

        const questionTextTemplate = getQText(`Copy the triangle exactly as it is shown onto the empty grid.`, `Copy the shape.`);
        const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT modify ANY field in the JSON template except replacing the [STORY] tag.`;

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
              "hint": "Notice that the top of the triangle is right in the middle!",
              "finalAnswer": ${JSON.stringify(answer)},
              "solutionSteps": "You drew a triangle with 3 straight sides matching the target."
            },
            "visualEngine": {
              "componentToRender": "GRID_DRAWING_CANVAS",
              "componentData": ${JSON.stringify(componentData)}
            },
            "inputRequirement": { "inputType": "INTERACTIVE_GRID" }
          }`,
          metadata: { difficulty: 'standard', steps: 1, logic: "standard_triangle_copy", hideVisual: false },
          visualEngine: {
            componentToRender: "GRID_DRAWING_CANVAS",
            componentData
          }
        };
      },

      standard_composite_shape: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
        const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
        
        const generators = [
          () => {
            // House
            const w = Math.random() > 0.5 ? 2 : 4;
            const bodyH = Math.floor(Math.random() * 2) + 1;
            const roofH = Math.floor(Math.random() * 2) + 1;
            return {
              name: "house",
              lines: [
                { start: [w/2, 0], end: [w, roofH] }, { start: [w, roofH], end: [0, roofH] }, { start: [0, roofH], end: [w/2, 0] },
                { start: [0, roofH], end: [0, roofH + bodyH] }, { start: [w, roofH], end: [w, roofH + bodyH] }, { start: [0, roofH + bodyH], end: [w, roofH + bodyH] }
              ],
              hint: "Break it down into parts and draw the outer boundary carefully."
            };
          },
          () => {
            // Boat
            const sailW = Math.floor(Math.random() * 2) + 2;
            const sailH = Math.floor(Math.random() * 2) + 2;
            const hullH = 1;
            const hullExt = 1;
            return {
              name: "boat",
              lines: [
                { start: [0, 0], end: [0, sailH] }, { start: [0, sailH], end: [sailW, sailH] }, { start: [sailW, sailH], end: [0, 0] },
                { start: [-hullExt, sailH], end: [sailW + hullExt, sailH] }, { start: [sailW + hullExt, sailH], end: [sailW, sailH + hullH] },
                { start: [sailW, sailH + hullH], end: [0, sailH + hullH] }, { start: [0, sailH + hullH], end: [-hullExt, sailH] }
              ],
              hint: "Draw the lines one by one, keeping the same angles."
            };
          },
          () => {
            // Tree
            const topW = Math.random() > 0.5 ? 2 : 4;
            const topH = Math.floor(Math.random() * 2) + 2;
            const trunkW = 2;
            const trunkH = Math.floor(Math.random() * 2) + 1;
            const trunkOffsetX = (topW - trunkW) / 2;
            return {
              name: "tree",
              lines: [
                { start: [topW/2, 0], end: [topW, topH] }, { start: [topW, topH], end: [0, topH] }, { start: [0, topH], end: [topW/2, 0] },
                { start: [trunkOffsetX, topH], end: [trunkOffsetX, topH + trunkH] }, { start: [trunkOffsetX + trunkW, topH], end: [trunkOffsetX + trunkW, topH + trunkH] },
                { start: [trunkOffsetX, topH + trunkH], end: [trunkOffsetX + trunkW, topH + trunkH] }
              ],
              hint: "Copy the shape by checking the exact number of squares between corners."
            };
          }
        ];
        
        let chosenShape = null;
        let finalLines = null;
        let dx = 0, dy = 0;

        // Try transformations until we find one that fits in 6x6
        while (!finalLines) {
          chosenShape = generators[Math.floor(Math.random() * generators.length)]();
          
          // Available integer transformations:
          // 1. Identity
          // 2. 90 deg rotation: (x,y) -> (-y, x)
          // 3. 180 deg rotation: (x,y) -> (-x, -y)
          // 4. 270 deg rotation: (x,y) -> (y, -x)
          // 5. 45 deg tilt + scale: (x,y) -> (x+y, x-y)
          // 6. -45 deg tilt + scale: (x,y) -> (x-y, x+y)
          // 7. ~26.5 deg steep tilt + scale: (x,y) -> (2x-y, x+2y)
          // 8. -26.5 deg steep tilt + scale: (x,y) -> (x-2y, 2x+y)
          // 9. ~18.4 deg steep tilt + scale: (x,y) -> (3x-y, x+3y)
          // 10. -18.4 deg steep tilt + scale: (x,y) -> (x-3y, 3x+y)
          const transforms = [
            (p) => [p[0], p[1]],
            (p) => [-p[1], p[0]],
            (p) => [-p[0], -p[1]],
            (p) => [p[1], -p[0]],
            (p) => [p[0] + p[1], p[0] - p[1]],
            (p) => [p[0] - p[1], p[0] + p[1]],
            (p) => [2*p[0] - p[1], p[0] + 2*p[1]],
            (p) => [p[0] - 2*p[1], 2*p[0] + p[1]],
            (p) => [3*p[0] - p[1], p[0] + 3*p[1]],
            (p) => [p[0] - 3*p[1], 3*p[0] + p[1]]
          ];
          
          const transform = transforms[Math.floor(Math.random() * transforms.length)];
          
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          const transformedLines = chosenShape.lines.map(l => {
            const start = transform(l.start);
            const end = transform(l.end);
            minX = Math.min(minX, start[0], end[0]);
            minY = Math.min(minY, start[1], end[1]);
            maxX = Math.max(maxX, start[0], end[0]);
            maxY = Math.max(maxY, start[1], end[1]);
            return { start, end };
          });

          const w = maxX - minX;
          const h = maxY - minY;

          // If the bounding box fits within the 6x6 grid (max width/height 5 to fit inside 6 dots/squares)
          if (w <= 5 && h <= 5) {
            // Shift to origin
            const originLines = transformedLines.map(l => ({
              start: [l.start[0] - minX, l.start[1] - minY],
              end: [l.end[0] - minX, l.end[1] - minY]
            }));

            // Random offset within remaining grid space
            dx = Math.floor(Math.random() * (6 - w));
            dy = Math.floor(Math.random() * (6 - h));

            finalLines = originLines;
          }
        }

        const referenceLines = finalLines.map(l => ({
          start: [l.start[0] + dx, l.start[1] + dy],
          end: [l.end[0] + dx, l.end[1] + dy]
        }));

        const componentData = { 
          gridType, 
          gridSize: { cols: 6, rows: 6 },
          referenceLines,
          workspaceLines: []
        };

        const answer = JSON.stringify(normalizeLinesArray(referenceLines));

        const questionTextTemplate = getQText(`Copy the ${chosenShape.name} shape exactly as it is shown onto the empty grid.`, `Copy the shape.`);
        const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT modify ANY field in the JSON template except replacing the [STORY] tag.`;

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
              "hint": ${JSON.stringify(chosenShape.hint)},
              "finalAnswer": ${JSON.stringify(answer)},
              "solutionSteps": "You drew the ${chosenShape.name} perfectly by connecting all the outer lines."
            },
            "visualEngine": {
              "componentToRender": "GRID_DRAWING_CANVAS",
              "componentData": ${JSON.stringify(componentData)}
            },
            "inputRequirement": { "inputType": "INTERACTIVE_GRID" }
          }`,
          metadata: { difficulty: 'standard', steps: 1, logic: "standard_composite_shape", hideVisual: false },
          visualEngine: {
            componentToRender: "GRID_DRAWING_CANVAS",
            componentData
          }
        };
      },

      standard_complete_composite: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
        const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
        
        // A diamond shape
        const referenceLines = [
          { start: [3, 1], end: [5, 3] },
          { start: [5, 3], end: [3, 5] },
          { start: [3, 5], end: [1, 3] },
          { start: [1, 3], end: [3, 1] }
        ];

        // Give them the right half
        const workspaceLines = [
          { start: [3, 1], end: [5, 3] },
          { start: [5, 3], end: [3, 5] }
        ];

        const missingLines = [
          { start: [3, 5], end: [1, 3] },
          { start: [1, 3], end: [3, 1] }
        ];

        const componentData = { 
          gridType, 
          gridSize: { cols: 6, rows: 6 },
          referenceLines,
          workspaceLines
        };

        const answer = JSON.stringify(normalizeLinesArray(missingLines));

        const questionTextTemplate = getQText(`Look at the diamond shape. Half of it is missing in the workspace. Draw the missing lines to complete the shape!`, `Complete the shape.`);
        const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT modify ANY field in the JSON template except replacing the [STORY] tag.`;

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
              "hint": "The shape has 4 sides in total. You just need to draw the 2 sides on the left.",
              "finalAnswer": ${JSON.stringify(answer)},
              "solutionSteps": "You connected the dots on the left to close the diamond."
            },
            "visualEngine": {
              "componentToRender": "GRID_DRAWING_CANVAS",
              "componentData": ${JSON.stringify(componentData)}
            },
            "inputRequirement": { "inputType": "INTERACTIVE_GRID" }
          }`,
          metadata: { difficulty: 'standard', steps: 1, logic: "standard_complete_composite", hideVisual: false },
          visualEngine: {
            componentToRender: "GRID_DRAWING_CANVAS",
            componentData
          }
        };
      },

      standard_identify_incorrect_copy: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
        const gridType = Math.random() > 0.5 ? "SQUARE" : "DOT";
        
        // Define base shapes (must fit in 3x3 max bounding box)
        const shapeGenerators = [
          () => {
            // Square
            const size = Math.random() > 0.5 ? 2 : 3;
            return {
              name: "square",
              target: [
                { start: [0, 0], end: [size, 0] }, { start: [size, 0], end: [size, size] },
                { start: [size, size], end: [0, size] }, { start: [0, size], end: [0, 0] }
              ],
              distractor: [
                { start: [0, 0], end: [size + 1, 0] }, { start: [size + 1, 0], end: [size + 1, size] },
                { start: [size + 1, size], end: [0, size] }, { start: [0, size], end: [0, 0] }
              ],
              distractorDesc: `is ${size + 1} units wide instead of ${size}, making it a rectangle`
            };
          },
          () => {
            // Rectangle
            const w = Math.random() > 0.5 ? 2 : 3;
            const h = w === 2 ? 3 : 2;
            return {
              name: "rectangle",
              target: [
                { start: [0, 0], end: [w, 0] }, { start: [w, 0], end: [w, h] },
                { start: [w, h], end: [0, h] }, { start: [0, h], end: [0, 0] }
              ],
              distractor: [
                { start: [0, 0], end: [w, 0] }, { start: [w, 0], end: [w, h + 1] },
                { start: [w, h + 1], end: [0, h + 1] }, { start: [0, h + 1], end: [0, 0] }
              ],
              distractorDesc: `is ${h + 1} units high instead of ${h}`
            };
          },
          () => {
            // Triangle
            const w = 2;
            const h = 2;
            return {
              name: "triangle",
              target: [
                { start: [w/2, 0], end: [w, h] }, { start: [w, h], end: [0, h] }, { start: [0, h], end: [w/2, 0] }
              ],
              distractor: [
                { start: [w/2, 0], end: [w+1, h] }, { start: [w+1, h], end: [-1, h] }, { start: [-1, h], end: [w/2, 0] }
              ],
              distractorDesc: `is too wide at the bottom base`
            };
          },
          () => {
            // Diamond
            return {
              name: "diamond",
              target: [
                { start: [1, 0], end: [2, 1] }, { start: [2, 1], end: [1, 2] },
                { start: [1, 2], end: [0, 1] }, { start: [0, 1], end: [1, 0] }
              ],
              distractor: [
                { start: [1, 0], end: [3, 1] }, { start: [3, 1], end: [1, 2] },
                { start: [1, 2], end: [0, 1] }, { start: [0, 1], end: [1, 0] }
              ],
              distractorDesc: `has one corner stretched too far to the right`
            };
          }
        ];

        const chosenShape = shapeGenerators[Math.floor(Math.random() * shapeGenerators.length)]();

        // Target placement
        const targetOffset = [1, 1];
        const referenceLines = chosenShape.target.map(l => ({
          start: [l.start[0] + targetOffset[0], l.start[1] + targetOffset[1]],
          end: [l.end[0] + targetOffset[0], l.end[1] + targetOffset[1]]
        }));

        // We will place 4 shapes in a 12x9 grid
        const origins = [
          [5, 1], // Top right
          [9, 1], // Far top right
          [2, 5], // Bottom left
          [7, 5]  // Bottom right
        ];

        // Shuffle labels
        const labels = ['A', 'B', 'C', 'D'].sort(() => Math.random() - 0.5);
        
        // Pick one to be the incorrect one
        const incorrectIndex = Math.floor(Math.random() * 4);
        const incorrectLabel = labels[incorrectIndex];

        let workspaceLines = [];
        for (let i = 0; i < 4; i++) {
          const [ox, oy] = origins[i];
          const label = labels[i];
          
          const linesToUse = (i === incorrectIndex) ? chosenShape.distractor : chosenShape.target;
          
          linesToUse.forEach((l, idx) => {
            let lineObj = {
              start: [l.start[0] + ox, l.start[1] + oy],
              end: [l.end[0] + ox, l.end[1] + oy]
            };
            if (idx === 0) lineObj.label = label;
            workspaceLines.push(lineObj);
          });
        }

        const componentData = { 
          gridType, 
          gridSize: { cols: 13, rows: 9 },
          referenceLines,
          workspaceLines
        };

        const options = ["Option A", "Option B", "Option C", "Option D"];
        const finalAnswerStr = `Option ${incorrectLabel}`;

        const questionTextTemplate = getQText(`Look at the target ${chosenShape.name} on the top left. Which of the labelled shapes (A, B, C, or D) is NOT a correct copy of the ${chosenShape.name}?`, `Find the incorrect copy.`);
        const storyInstruction = isShort ? "STRICT: Return the JSON template EXACTLY as provided. DO NOT modify a single character." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)}. DO NOT modify ANY field in the JSON template except replacing the [STORY] tag.`;

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
              "hint": "Count the width and height of the target ${chosenShape.name}, and compare it to the options.",
              "finalAnswer": "${finalAnswerStr}",
              "solutionSteps": "${finalAnswerStr} is incorrect because it ${chosenShape.distractorDesc}."
            },
            "visualEngine": {
              "componentToRender": "GRID_DISPLAY",
              "componentData": ${JSON.stringify(componentData)}
            },
            "inputRequirement": { "inputType": "MCQ_BUTTONS" }
          }`,
          metadata: { difficulty: 'standard', steps: 1, logic: "standard_identify_incorrect_copy", hideVisual: false },
          visualEngine: {
            componentToRender: "GRID_DISPLAY",
            componentData
          }
        };
      }
    };

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

    const targetVariant = variants[variant] || variants.standard_diagonal_line;
    return targetVariant({}, type, _isMCQ, _isShort, _isStructure, _zodType, _zodDiff, _level, _topic, _formatInstructions, _context, _getQText);
  }
};

export default standardLogic;
