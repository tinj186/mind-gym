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

    // Creating a pseudo-random triangle/shape representation with halves
    // Since SquareGridShape.jsx supports half-squares via a custom format or we just describe it
    // Wait, the prompt says "Requires half-shading support."
    // Let's use `shadedSquares` and `halfShadedSquares` if the component supports it.
    // If not, we just pass what we can or rely on the question text.
    // Assuming `SquareGridShape` supports `halfShadedSquares` (e.g. { type: 'top-left', x, y }).
    
    // For standard_6 we just need any visual that fits. Let's just create some dummy squares.
    let shaded = [];
    for(let i=0; i<full; i++){
      shaded.push([1 + i, 1]);
    }
    let halfShaded = [];
    for(let i=0; i<halves; i++){
      halfShaded.push({ type: 'top-left', x: 1 + i, y: 2 });
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: Math.max(full, halves) + 2, rows: 4 },
        unitLabel: `1 ${unit}`,
        figures: [{ shadedSquares: shaded, halfShadedSquares: halfShaded }]
      }
    });

    let askText = `Find the area of the shaded shape drawn on the 1 ${unit} grid.`;
    let finalAnswer = `${area} ${unit}²`;
    let sysSolutionSteps = `"""1. Count the full squares: ${full}.\\n2. Count the half-squares: ${halves}.\\n3. Combine the half-squares into full squares: ${halves} / 2 = ${halves/2}.\\n4. Add them together: ${full} + ${halves/2} = ${area}.\\n5. The total area is ${area} ${unit}²."""`;

    if (isShort) {
      askText = `Find the area of the shaded shape drawn on the 1 ${unit} grid.`;
    } else if (isMCQ) {
      askText = `What is the area of a figure with ${full} whole squares and ${halves} half-squares on a 1 ${unit} grid?`;
    } else if (isStructure) {
      askText = `Look at the shaded figure on the 1 ${unit} grid. It contains both full squares and half-squares. Find the total area.`;
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
- For content.questionText, use: "${askText}"
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "2 half-squares make 1 full square."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${area + 1} ${unit}²"
- "${full + halves} ${unit}²"
- "${area - 1} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'standard_subtracting_cut_out') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const totalArea = getRandomInt(40, 80);
    const cutOutCount = getRandomInt(1, 3);
    const cutOutArea = getRandomInt(5, 12);
    const totalCutOut = cutOutCount * cutOutArea;
    const remainingArea = totalArea - totalCutOut;

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        isStatic: true,
        modelType: 'PART_WHOLE',
        parts: [
          { segments: 1, value: remainingArea, displayValue: "?", bgClass: 'bg-slate-400 text-white' },
          { segments: 1, value: totalCutOut, label: `Cut: ${totalCutOut} ${unit}²`, bgClass: 'bg-red-500 text-white' }
        ],
        whole: `${totalArea} ${unit}²`
      }
    });

    let askText = `A piece of paper has an area of ${totalArea} ${unit}². ${cutOutCount > 1 ? `Two sections of ${cutOutArea} ${unit}² each are` : `A square of ${cutOutArea} ${unit}² is`} cut out. What is the remaining area?`;
    let finalAnswer = `${remainingArea} ${unit}²`;
    let sysSolutionSteps = `"""1. Find the total area removed: ${cutOutCount} x ${cutOutArea} = ${totalCutOut}.\\n2. Subtract the removed area from the total area.\\n3. ${totalArea} - ${totalCutOut} = ${remainingArea}.\\n4. The remaining area is ${remainingArea} ${unit}²."""`;

    if (isShort) {
      askText = `A piece of paper has an area of ${totalArea} ${unit}². A square of ${cutOutArea} ${unit}² is cut out. What is the remaining area?`;
      if (cutOutCount > 1) {
         askText = `A piece of paper has an area of ${totalArea} ${unit}². ${cutOutCount} identical squares of ${cutOutArea} ${unit}² are cut out. What is the remaining area?`;
      }
    } else if (isMCQ) {
      askText = `Total area is ${totalArea} ${unit}². ${cutOutCount} sections of ${cutOutArea} ${unit}² each are removed. Remaining area?`;
    } else if (isStructure) {
      askText = `A rectangular wooden board has a total area of ${totalArea} ${unit}². Jia Hao cuts out ${cutOutCount} identical triangles. Each triangle has an area of ${cutOutArea} ${unit}². What is the area of the remaining wooden board?`;
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Write the working equation to find the total area of the ${cutOutCount} cut-out triangles:`, expectedAnswer: cutOutCount > 1 ? `${cutOutCount} x ${cutOutArea} = ${totalCutOut}` : `${cutOutArea} = ${totalCutOut}`, acceptedAnswers: cutOutCount === 2 ? [`${cutOutArea} + ${cutOutArea} = ${totalCutOut}`] : [] },
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
- For content.questionText, use: "${askText}"
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

      if (isShort) {
        askText = `${items} identical square tiles have a total area of ${totalArea} ${unit}². What is the area of 1 tile?`;
      } else if (isMCQ) {
        askText = `${items} identical tiles have a total area of ${totalArea} ${unit}². What is the area of 1 tile?`;
      } else if (isStructure) {
        askText = `A bathroom wall is covered with ${items} identical tiles. The total area of the tiles is ${totalArea} ${unit}². What is the area of 1 tile?`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the area of 1 tile:", expectedAnswer: `${totalArea} / ${items} = ${unitArea}`, acceptedAnswers: [`${totalArea} \\\\div ${items} = ${unitArea}`] },
            { label: "Area of 1 tile:", expectedAnswer: `${unitArea} ${unit}²`, acceptedAnswers: [`${unitArea}`] }
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

      if (isShort) {
        askText = `A floor is covered by ${items} identical rugs. Each rug has an area of ${unitArea} ${unit}². What is the total area covered?`;
      } else if (isMCQ) {
        askText = `${items} rugs are ${unitArea} ${unit}² each. Total area?`;
      } else if (isStructure) {
        askText = `A bathroom wall is covered with ${items} identical tiles. Each tile has an area of ${unitArea} ${unit}². What is the total area of the tiles on the wall?`;
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
- For content.questionText, use: "${askText}"
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
    const totalArea = getRandomInt(60, 100);
    const items = getRandomInt(3, 5);
    const unitArea = getRandomInt(10, 15);
    const coveredArea = items * unitArea;
    const remainingArea = totalArea - coveredArea; // Make sure totalArea > coveredArea

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

    let askText = `A display board has a total area of ${totalArea} ${unit}². Sarah pins ${items} identical photos on it. Each photo has an area of ${unitArea} ${unit}². How much empty area is left on the display board?`;
    let finalAnswer = `${remainingArea} ${unit}²`;
    let sysSolutionSteps = `"""1. Find the total area covered by the photos: ${items} x ${unitArea} = ${coveredArea}.\\n2. Subtract the covered area from the total area: ${totalArea} - ${coveredArea} = ${remainingArea}.\\n3. The remaining empty area is ${remainingArea} ${unit}²."""`;

    if (isShort) {
      askText = `A wall has an area of ${totalArea} ${unit}². A painter paints ${items} sections of ${unitArea} ${unit}² each. How much area is left to paint?`;
    } else if (isMCQ) {
      askText = `Total area is ${totalArea} ${unit}². Covered by ${items} stickers of ${unitArea} ${unit}² each. Uncovered area?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Write the working equation to find the total area of the ${items} photos:`, expectedAnswer: `${items} x ${unitArea} = ${coveredArea}`, acceptedAnswers: [`${unitArea} x ${items} = ${coveredArea}`] },
          { label: "Write the working equation to find the remaining empty area:", expectedAnswer: `${totalArea} - ${coveredArea} = ${remainingArea}`, acceptedAnswers: [] },
          { label: "Empty area:", expectedAnswer: `${remainingArea} ${unit}²`, acceptedAnswers: [`${remainingArea}`] }
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
- For content.questionText, use: "${askText}"
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "Find the total covered area first, then subtract it from the total area."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${remainingArea + unitArea} ${unit}²"
- "${totalArea - unitArea} ${unit}²"
- "${coveredArea} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'standard_donut_hollow_center') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const outerW = getRandomInt(5, 7);
    const outerH = getRandomInt(4, 6);
    const innerW = getRandomInt(2, outerW - 2);
    const innerH = getRandomInt(2, outerH - 2);
    
    const outerArea = outerW * outerH;
    const innerArea = innerW * innerH;
    const pathArea = outerArea - innerArea;

    let shaded = [];
    for(let i=0; i<outerW; i++){
      for(let j=0; j<outerH; j++){
        // Check if inside inner hole
        const isHole = (i >= 1 && i < 1 + innerW) && (j >= 1 && j < 1 + innerH);
        if (!isHole) {
          shaded.push([1 + i, 1 + j]);
        }
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: outerW + 2, rows: outerH + 2 },
        unitLabel: `1 ${unit}`,
        figures: [{ shadedSquares: shaded }]
      }
    });

    let askText = `Look at the grid. What is the area of the shaded border in ${unit}²?`;
    let finalAnswer = `${pathArea} ${unit}²`;
    let sysSolutionSteps = `"""1. Find the area of the large outer rectangle: ${outerW} x ${outerH} = ${outerArea}.\\n2. Find the area of the empty inner hole: ${innerW} x ${innerH} = ${innerArea}.\\n3. Subtract the inner hole from the outer rectangle: ${outerArea} - ${innerArea} = ${pathArea}.\\n4. The area of the shaded path is ${pathArea} ${unit}²."""`;

    if (isShort) {
      askText = `Look at the grid. What is the area of the shaded border in ${unit}²?`;
    } else if (isMCQ) {
      askText = `A ${outerW}×${outerH} rectangle of squares has a ${innerW}×${innerH} hole in it. What is the area of the shaded part?`;
    } else if (isStructure) {
      askText = `A garden path is built around a rectangular pond on a 1 ${unit} grid. Find the total area of the shaded path.`;
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the area of the whole shape (including the pond):", expectedAnswer: `${outerW} x ${outerH} = ${outerArea}`, acceptedAnswers: [] },
          { label: "Write the working equation to find the area of the empty pond:", expectedAnswer: `${innerW} x ${innerH} = ${innerArea}`, acceptedAnswers: [] },
          { label: "Write the working equation to subtract the pond from the whole shape:", expectedAnswer: `${outerArea} - ${innerArea} = ${pathArea}`, acceptedAnswers: [] },
          { label: "Area of the path:", expectedAnswer: `${pathArea} ${unit}²`, acceptedAnswers: [`${pathArea}`] }
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
- For content.questionText, use: "${askText}"
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "Find the large area, find the small inner area, and subtract."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${outerArea} ${unit}²"
- "${innerArea} ${unit}²"
- "${pathArea + innerArea} ${unit}²"` : ''}
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
