import { getRandomNames, getRandomCountableItems } from '../../../../../utils/variable-bank.js';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (activeVariant === 'standard_area_half_squares') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const full = getRandomInt(4, 10);
    const halves = getRandomInt(1, 4) * 2; // Always even to make whole squares
    const area = full + (halves / 2);

    // Create a cohesive, symmetrical composite shape.
    // 1. All full squares form a single horizontal block at y=2.
    let shaded = [];
    for(let i=0; i<full; i++){
      shaded.push([2 + i, 2]);
    }
    
    // 2. Attach pairs of half-squares (triangles) to the top (y=1) and bottom (y=3)
    // Since full is at least 4, x=2,3,4,5 are guaranteed to be full squares.
    let halfShaded = [];
    let pairs = halves / 2;
    let pairIdx = 0;
    while (pairIdx < pairs) {
        if (pairIdx === 0) {
            halfShaded.push({ type: 'bottom-right', x: 2, y: 1 });
            halfShaded.push({ type: 'bottom-left', x: 3, y: 1 });
        } else if (pairIdx === 1) {
            halfShaded.push({ type: 'bottom-right', x: 4, y: 1 });
            halfShaded.push({ type: 'bottom-left', x: 5, y: 1 });
        } else if (pairIdx === 2) {
            halfShaded.push({ type: 'top-right', x: 2, y: 3 });
            halfShaded.push({ type: 'top-left', x: 3, y: 3 });
        } else if (pairIdx === 3) {
            halfShaded.push({ type: 'top-right', x: 4, y: 3 });
            halfShaded.push({ type: 'top-left', x: 5, y: 3 });
        }
        pairIdx++;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: Math.max(full + 4, 8), rows: 5 },
        unitLabel: `1 ${unit}`,
        figures: [{ shadedSquares: shaded, halfShadedSquares: halfShaded }]
      }
    });

    let askText = `Look at the shaded figure on the 1 ${unit} grid. It contains both full squares and half-squares. Find the total area.`;
    if (isShort || isMCQ) askText = `Find the area of the shaded shape drawn on the 1 ${unit} grid.`;

    let finalAnswer = `${area} ${unit}²`;
    let sysSolutionSteps = `"""1. Count the full squares: ${full}.\\n2. Count the half-squares: ${halves}.\\n3. Combine the half-squares into full squares: ${halves} / 2 = ${halves/2}.\\n4. Add them together: ${full} + ${halves/2} = ${area}.\\n5. The total area is ${area} ${unit}²."""`;

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Number of full squares:", expectedAnswer: `${full}`, acceptedAnswers: [] },
          { label: "Write the working equation to combine the half-squares into full squares:", expectedAnswer: `${halves} / 2 = ${halves/2}`, acceptedAnswers: [`${halves} \\\\div 2 = ${halves/2}`] },
          { label: "Write the working equation for the total area:", expectedAnswer: `${full} + ${halves/2} = ${area}`, acceptedAnswers: [] },
          { label: "Total area:", expectedAnswer: `${area} ${unit}²`, acceptedAnswers: [`${area}`, `${area} \\\\text{${unit}}^2`] }
        ]
      });
    }

    if (!isStructure && !isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${isStructure ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\nSTORY: ${askText}` : `use: "${askText}"`}
- "${finalAnswer}"
- "${area + 1} ${unit}²"
- "${full + halves} ${unit}²"
- "${area - 1} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'standard_subtracting_cut_out') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const cutOutCount = getRandomInt(1, 5); // Primary 3 can handle up to 5 items comfortably
    const cutOutArea = getRandomInt(5, 12);
    const totalCutOut = cutOutCount * cutOutArea;
    const totalArea = totalCutOut + getRandomInt(20, 60); // Ensure total area is always comfortably larger than the cutout
    const remainingArea = totalArea - totalCutOut;
    
    const name = getRandomNames(1);
    const item = getRandomCountableItems(1).item || "piece of paper";
    const shape = Math.random() < 0.5 ? "square" : "triangle";

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        isStatic: true,
        modelType: 'PART_WHOLE',
        parts: [
          { segments: 1, value: remainingArea, displayValue: "?", bgClass: 'bg-slate-400 text-white' },
          ...Array(cutOutCount).fill({ segments: 1, value: cutOutArea, label: `Cut: ${cutOutArea} ${unit}²`, bgClass: 'bg-red-500 text-white' })
        ],
        whole: `${totalArea} ${unit}²`
      }
    });

    let askText = `STORY: ${name} has a ${item} with a total area of ${totalArea} ${unit}². ${name} cuts out ${cutOutCount} identical ${shape}s. Each ${shape} has an area of ${cutOutArea} ${unit}². What is the area of the remaining ${item}?`;
    if (isShort || isMCQ) askText = `Based on the model, find the remaining area in ${unit}².`;

    let finalAnswer = `${remainingArea} ${unit}²`;
    let sysSolutionSteps = `"""1. Find the total area removed: ${cutOutCount} x ${cutOutArea} = ${totalCutOut}.\\n2. Subtract the removed area from the total area.\\n3. ${totalArea} - ${totalCutOut} = ${remainingArea}.\\n4. The remaining area is ${remainingArea} ${unit}²."""`;

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Write the working equation to find the total area of the ${cutOutCount} cut-out ${shape}s:`, expectedAnswer: cutOutCount > 1 ? `${cutOutCount} x ${cutOutArea} = ${totalCutOut}` : `${cutOutArea} = ${totalCutOut}`, acceptedAnswers: cutOutCount === 2 ? [`${cutOutArea} + ${cutOutArea} = ${totalCutOut}`] : [] },
          { label: "Write the working equation to find the remaining area:", expectedAnswer: `${totalArea} - ${totalCutOut} = ${remainingArea}`, acceptedAnswers: [] },
          { label: "Remaining area:", expectedAnswer: `${remainingArea} ${unit}²`, acceptedAnswers: [`${remainingArea}`] }
        ]
      });
    }

    if (!isStructure && !isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${isStructure ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "Subtract the cut out area from the total area."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${totalArea - cutOutArea} ${unit}²"
- "${remainingArea + cutOutArea} ${unit}²"
- "${totalArea + cutOutArea} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'standard_grouping_identical_areas') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const items = getRandomInt(4, 9);
    const unitArea = getRandomInt(3, 8);
    const totalArea = items * unitArea;
    const isFindingUnit = Math.random() < 0.5;

    const name = getRandomNames(1);
    const itemObj = getRandomCountableItems(1);
    // Remove the trailing 's' if any to get singular form
    const itemSingular = (itemObj.item || "piece of paper").replace(/s$/, '');

    let askText = "";
    let finalAnswer = "";
    let sysSolutionSteps = "";

    if (isFindingUnit) {
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          isStatic: true,
          modelType: 'PART_WHOLE',
          parts: Array(items).fill({ segments: 1, value: unitArea, displayValue: "?", bgClass: "bg-blue-500 text-white" }),
          whole: `${totalArea} ${unit}²`
        }
      });
      finalAnswer = `${unitArea} ${unit}²`;
      sysSolutionSteps = `"""1. Divide the total area by the number of items.\\n2. ${totalArea} / ${items} = ${unitArea}.\\n3. The area of 1 item is ${unitArea} ${unit}²."""`;

      askText = `STORY: ${name} has ${items} identical ${itemSingular}s. The total area of the ${itemSingular}s is ${totalArea} ${unit}². What is the area of 1 ${itemSingular}?`;
      if (isShort || isMCQ) askText = `Based on the model, find the area of 1 shape in ${unit}².`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the area of 1 ${itemSingular}:`, expectedAnswer: `${totalArea} / ${items} = ${unitArea}`, acceptedAnswers: [`${totalArea} \\\\div ${items} = ${unitArea}`] },
            { label: `Area of 1 ${itemSingular}:`, expectedAnswer: `${unitArea} ${unit}²`, acceptedAnswers: [`${unitArea}`] }
          ]
        });
      }
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          isStatic: true,
          modelType: 'PART_WHOLE',
          parts: Array(items).fill({ segments: 1, value: unitArea, label: `${unitArea}`, bgClass: "bg-blue-500 text-white" }),
          whole: "?"
        }
      });
      finalAnswer = `${totalArea} ${unit}²`;
      sysSolutionSteps = `"""1. Multiply the number of items by the area of 1 item.\\n2. ${items} x ${unitArea} = ${totalArea}.\\n3. The total area is ${totalArea} ${unit}²."""`;

      askText = `STORY: ${name} has ${items} identical ${itemSingular}s. Each ${itemSingular} has an area of ${unitArea} ${unit}². What is the total area of the ${itemSingular}s?`;
      if (isShort || isMCQ) askText = `Based on the model, find the total area in ${unit}².`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the total area:", expectedAnswer: `${items} x ${unitArea} = ${totalArea}`, acceptedAnswers: [`${unitArea} x ${items} = ${totalArea}`] },
            { label: "Total area:", expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}`] }
          ]
        });
      }
    }

    if (!isStructure && !isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${isStructure ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "${isFindingUnit ? "Divide the total area by the number of items." : "Multiply the area of one item by the number of items."}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${isFindingUnit ? unitArea + 2 : totalArea + items} ${unit}²"
- "${isFindingUnit ? unitArea - 1 : totalArea - unitArea} ${unit}²"
- "${isFindingUnit ? totalArea - items : totalArea + unitArea} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'standard_grouping_with_remainder') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const items = getRandomInt(3, 5);
    const unitArea = getRandomInt(10, 15);
    const coveredArea = items * unitArea;
    const totalArea = coveredArea + getRandomInt(20, 60); // Ensure totalArea > coveredArea safely
    const remainingArea = totalArea - coveredArea;
    const isFindingTotal = Math.random() < 0.5;

    const name = getRandomNames(1);
    const itemObj = getRandomCountableItems(1);
    const itemSingular = (itemObj.item || "sticker").replace(/s$/, '');
    const surfaces = ["board", "table", "floor", "wall", "piece of paper", "mat"];
    const surface = surfaces[Math.floor(Math.random() * surfaces.length)];

    let askText = "";
    let finalAnswer = "";
    let sysSolutionSteps = "";

    if (isFindingTotal) {
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          isStatic: true,
          modelType: 'PART_WHOLE',
          parts: [
            ...Array(items).fill({ segments: 1, value: unitArea, label: `${unitArea}`, bgClass: 'bg-blue-500 text-white' }),
            { segments: 1, value: remainingArea, label: `${remainingArea}`, bgClass: 'bg-slate-400 text-white' }
          ],
          whole: "?"
        }
      });

      askText = `STORY: ${name} places ${items} identical ${itemSingular}s on a ${surface}. Each ${itemSingular} has an area of ${unitArea} ${unit}². There is ${remainingArea} ${unit}² of empty area left on the ${surface}. What is the total area of the ${surface}?`;
      if (isShort || isMCQ) askText = `Based on the model, find the total area in ${unit}².`;

      finalAnswer = `${totalArea} ${unit}²`;
      sysSolutionSteps = `"""1. Find the total area covered by the ${itemSingular}s: ${items} x ${unitArea} = ${coveredArea}.\\n2. Add the covered area to the remaining empty area: ${coveredArea} + ${remainingArea} = ${totalArea}.\\n3. The total area of the ${surface} is ${totalArea} ${unit}²."""`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total area of the ${items} ${itemSingular}s:`, expectedAnswer: `${items} x ${unitArea} = ${coveredArea}`, acceptedAnswers: [`${unitArea} x ${items} = ${coveredArea}`] },
            { label: `Write the working equation to find the total area of the ${surface}:`, expectedAnswer: `${coveredArea} + ${remainingArea} = ${totalArea}`, acceptedAnswers: [`${remainingArea} + ${coveredArea} = ${totalArea}`] },
            { label: "Total area:", expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}`] }
          ]
        });
      }
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          isStatic: true,
          modelType: 'PART_WHOLE',
          parts: [
            ...Array(items).fill({ segments: 1, value: unitArea, label: `${unitArea}`, bgClass: 'bg-blue-500 text-white' }),
            { segments: 1, value: remainingArea, displayValue: "?", bgClass: 'bg-slate-400 text-white' }
          ],
          whole: `${totalArea} ${unit}²`
        }
      });

      askText = `STORY: ${name} has a ${surface} with a total area of ${totalArea} ${unit}². ${name} places ${items} identical ${itemSingular}s on it. Each ${itemSingular} has an area of ${unitArea} ${unit}². How much empty area is left on the ${surface}?`;
      if (isShort || isMCQ) askText = `Based on the model, find the remaining empty area in ${unit}².`;

      finalAnswer = `${remainingArea} ${unit}²`;
      sysSolutionSteps = `"""1. Find the total area covered by the ${itemSingular}s: ${items} x ${unitArea} = ${coveredArea}.\\n2. Subtract the covered area from the total area: ${totalArea} - ${coveredArea} = ${remainingArea}.\\n3. The remaining empty area is ${remainingArea} ${unit}²."""`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total area of the ${items} ${itemSingular}s:`, expectedAnswer: `${items} x ${unitArea} = ${coveredArea}`, acceptedAnswers: [`${unitArea} x ${items} = ${coveredArea}`] },
            { label: "Write the working equation to find the remaining empty area:", expectedAnswer: `${totalArea} - ${coveredArea} = ${remainingArea}`, acceptedAnswers: [] },
            { label: "Empty area:", expectedAnswer: `${remainingArea} ${unit}²`, acceptedAnswers: [`${remainingArea}`] }
          ]
        });
      }
    }

    if (!isStructure && !isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${isStructure ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "${isFindingTotal ? "Find the total covered area first, then add it to the empty area." : "Find the total covered area first, then subtract it from the total area."}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${isFindingTotal ? remainingArea : remainingArea + unitArea} ${unit}²"
- "${isFindingTotal ? totalArea - items : totalArea - unitArea} ${unit}²"
- "${coveredArea} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'standard_donut_hollow_center') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const outerW = getRandomInt(4, 6);
    const outerH = getRandomInt(4, 6);
    
    // Generate a full block
    let fullSquares = [];
    for(let i=0; i<outerW; i++){
      for(let j=0; j<outerH; j++){
        fullSquares.push({x: i, y: j});
      }
    }
    
    // Randomly carve out edges to make the outer shape irregular
    if (Math.random() < 0.5) fullSquares = fullSquares.filter(s => !(s.x === 0 && s.y === 0)); // top-left
    if (Math.random() < 0.5) fullSquares = fullSquares.filter(s => !(s.x === outerW-1 && s.y === 0)); // top-right
    if (Math.random() < 0.5) fullSquares = fullSquares.filter(s => !(s.x === 0 && s.y === outerH-1)); // bottom-left
    if (Math.random() < 0.5) fullSquares = fullSquares.filter(s => !(s.x === outerW-1 && s.y === outerH-1)); // bottom-right
    
    // Generate an irregular hole in the middle (usually 2x2, maybe missing 1 block)
    const holeX = Math.floor(outerW/2) - 1;
    const holeY = Math.floor(outerH/2) - 1;
    let holeSquares = [
      {x: holeX, y: holeY}, {x: holeX+1, y: holeY},
      {x: holeX, y: holeY+1}, {x: holeX+1, y: holeY+1}
    ];
    // Randomly remove one block to make the hole irregular (like an L-shape)
    if (Math.random() < 0.5) {
      holeSquares.pop();
    }
    
    const outerArea = fullSquares.length;
    const innerArea = holeSquares.length;
    const pathArea = outerArea - innerArea;
    
    const shaded = fullSquares
      .filter(s => !holeSquares.some(h => h.x === s.x && h.y === s.y))
      .map(s => [s.x + 1, s.y + 1]);

    const name = getRandomNames(1);
    const surfaces = ["garden", "courtyard", "park", "playground", "plaza"];
    const surface = surfaces[Math.floor(Math.random() * surfaces.length)];
    const objects = ["pond", "fountain", "sandbox", "statue", "flower bed"];
    const object = objects[Math.floor(Math.random() * objects.length)];

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: outerW + 2, rows: outerH + 2 },
        unitLabel: `1 ${unit}`,
        figures: [{ shadedSquares: shaded }]
      }
    });

    const mode = getRandomInt(0, 2); // 0: find path (c), 1: find whole (a), 2: find hole (b)
    
    let askText = "";
    let finalAnswer = "";
    let sysSolutionSteps = "";

    if (mode === 0) {
      // Find Path (C = A - B)
      askText = `STORY: ${name} is designing a ${surface} on a grid. The shaded part is a walking path, and the empty center is a ${object}. Find the total area of the shaded walking path.`;
      if (isShort || isMCQ) askText = `Look at the shape drawn on the grid. Find the area of the shaded path.`;

      finalAnswer = `${pathArea} ${unit}²`;
      sysSolutionSteps = `"""1. Count the number of squares in the whole shape (including the empty center): ${outerArea}.\\n2. Count the number of squares in the empty center: ${innerArea}.\\n3. Subtract the empty center from the whole shape: ${outerArea} - ${innerArea} = ${pathArea}.\\n4. The area of the shaded path is ${pathArea} ${unit}²."""`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Count the number of squares for the whole shape (including the empty ${object}):`, expectedAnswer: `${outerArea}`, acceptedAnswers: [] },
            { label: `Count the number of empty squares for the ${object}:`, expectedAnswer: `${innerArea}`, acceptedAnswers: [] },
            { label: "Write the working equation to find the area of the shaded path:", expectedAnswer: `${outerArea} - ${innerArea} = ${pathArea}`, acceptedAnswers: [] },
            { label: "Area of the path:", expectedAnswer: `${pathArea} ${unit}²`, acceptedAnswers: [`${pathArea}`] }
          ]
        });
      }
    } else if (mode === 1) {
      // Find Whole (A = C + B)
      askText = `STORY: ${name} is designing a ${surface} on a grid. The shaded part is a walking path, and the empty center is a ${object}. If the ${object} was also filled in, what would be the total area of the whole shape?`;
      if (isShort || isMCQ) askText = `Look at the shape drawn on the grid. If the empty center was filled in, what would be the total area of the whole shape?`;

      finalAnswer = `${outerArea} ${unit}²`;
      sysSolutionSteps = `"""1. Count the number of shaded squares in the path: ${pathArea}.\\n2. Count the number of empty squares for the ${object}: ${innerArea}.\\n3. Add them together to find the whole area: ${pathArea} + ${innerArea} = ${outerArea}.\\n4. The total area of the whole shape is ${outerArea} ${unit}²."""`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Count the number of shaded squares for the path:", expectedAnswer: `${pathArea}`, acceptedAnswers: [] },
            { label: `Count the number of empty squares for the ${object}:`, expectedAnswer: `${innerArea}`, acceptedAnswers: [] },
            { label: "Write the working equation to find the total area of the whole shape:", expectedAnswer: `${pathArea} + ${innerArea} = ${outerArea}`, acceptedAnswers: [`${innerArea} + ${pathArea} = ${outerArea}`] },
            { label: "Area of the whole shape:", expectedAnswer: `${outerArea} ${unit}²`, acceptedAnswers: [`${outerArea}`] }
          ]
        });
      }
    } else {
      // Find Hole (B = A - C)
      askText = `STORY: ${name} had a solid shape with a total area of ${outerArea} ${unit}². ${name} erased the middle to create an empty ${object}. Look at the remaining shaded path on the grid. What is the area of the empty ${object}?`;
      if (isShort || isMCQ) askText = `Look at the shape drawn on the grid. Find the area of the empty space.`;

      finalAnswer = `${innerArea} ${unit}²`;
      sysSolutionSteps = `"""1. The total area of the solid shape was ${outerArea}.\\n2. Count the number of shaded squares left in the path: ${pathArea}.\\n3. Subtract the path area from the total area to find the empty space: ${outerArea} - ${pathArea} = ${innerArea}.\\n4. The area of the empty ${object} is ${innerArea} ${unit}²."""`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Count the number of shaded squares for the path:", expectedAnswer: `${pathArea}`, acceptedAnswers: [] },
            { label: `Write the working equation to find the area of the empty ${object}:`, expectedAnswer: `${outerArea} - ${pathArea} = ${innerArea}`, acceptedAnswers: [] },
            { label: `Area of the ${object}:`, expectedAnswer: `${innerArea} ${unit}²`, acceptedAnswers: [`${innerArea}`] }
          ]
        });
      }
    }

    if (!isStructure && !isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    let hintText = "Count the whole shape and the empty center, then subtract.";
    if (mode === 1) hintText = "Count the shaded path and the empty center, then add them together.";
    if (mode === 2) hintText = "Subtract the shaded path area from the total area given in the story.";

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${isStructure ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "${hintText}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${mode === 0 ? outerArea : mode === 1 ? pathArea : pathArea} ${unit}²"
- "${mode === 0 ? innerArea : mode === 1 ? innerArea : outerArea} ${unit}²"
- "${mode === 0 ? pathArea + 2 : mode === 1 ? outerArea + 1 : innerArea + 2} ${unit}²"` : ''}
`;
  }

  const aiPrompt = `
${systemPrompt}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
`;

  return {
    aiPrompt
  };
};
