export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (activeVariant === 'advanced_3_part_comparison') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const isTotal = Math.random() < 0.5;
    const areaA = getRandomInt(10, 20);
    const diff1 = getRandomInt(4, 10);
    const diff2 = getRandomInt(2, 6);
    
    // A -> B (B is larger than A)
    const areaB = areaA + diff1;
    // B -> C (C is smaller than B)
    const areaC = areaB - diff2;
    const totalArea = areaA + areaB + areaC;

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        bars: [
          { segments: [{ value: areaA, label: `A: ${areaA}`, color: "blue" }] },
          { segments: [{ value: areaB, label: "B", color: "red" }], alignment: "left" },
          { segments: [{ value: areaC, label: "C", color: "green" }], alignment: "left" }
        ],
        differences: [
          { fromBar: 1, toBar: 0, label: `${diff1} larger`, color: "orange" },
          { fromBar: 1, toBar: 2, label: `${diff2} smaller`, color: "purple" }
        ]
      }
    });

    let askText = `Figure X has an area of ${areaA} ${unit}². Figure Y has an area ${diff1} ${unit}² larger than Figure X. Figure Z has an area ${diff2} ${unit}² smaller than Figure Y. What is the total area of all three figures?`;
    let finalAnswer = `${totalArea} ${unit}²`;
    let sysSolutionSteps = `"""1. Find the area of Figure Y: ${areaA} + ${diff1} = ${areaB}.\\n2. Find the area of Figure Z: ${areaB} - ${diff2} = ${areaC}.\\n3. Find the total area: ${areaA} + ${areaB} + ${areaC} = ${totalArea}.\\n4. The total area is ${totalArea} ${unit}²."""`;

    if (!isTotal) {
      askText = `Rug A is ${areaA} ${unit}². Rug B is ${diff1} ${unit}² larger than A. Rug C is ${diff2} ${unit}² smaller than B. Area of Rug C?`;
      finalAnswer = `${areaC} ${unit}²`;
      sysSolutionSteps = `"""1. Find the area of Rug B: ${areaA} + ${diff1} = ${areaB}.\\n2. Find the area of Rug C: ${areaB} - ${diff2} = ${areaC}.\\n3. The area of Rug C is ${areaC} ${unit}²."""`;
    }

    if (isShort) {
      // askText already set based on isTotal
    } else if (isMCQ) {
      askText = `Box A area = ${areaA} ${unit}². Box B is ${diff1} ${unit}² larger. Box C is ${diff2} ${unit}² smaller than B. ${isTotal ? "Total area?" : "Area of Box C?"}`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the area of Figure Y:", expectedAnswer: `${areaA} + ${diff1} = ${areaB}`, acceptedAnswers: [] },
          { label: "Write the working equation to find the area of Figure Z:", expectedAnswer: `${areaB} - ${diff2} = ${areaC}`, acceptedAnswers: [] },
          ...(isTotal ? [{ label: "Write the working equation to find the total area of X, Y, and Z:", expectedAnswer: `${areaA} + ${areaB} + ${areaC} = ${totalArea}`, acceptedAnswers: [] }] : []),
          { label: isTotal ? "Total area:" : "Area of Figure Z:", expectedAnswer: isTotal ? `${totalArea} ${unit}²` : `${areaC} ${unit}²`, acceptedAnswers: [isTotal ? `${totalArea}` : `${areaC}`] }
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
- For content.hint, use: "Find the area of the second figure, then the third, and read carefully what you need to find."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${isTotal ? totalArea - diff2 : areaC + diff2} ${unit}²"
- "${isTotal ? totalArea + diff1 : areaC - 2} ${unit}²"
- "${isTotal ? areaC : totalArea} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'advanced_mixed_halves_cutouts') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const full = getRandomInt(6, 12);
    const halves = getRandomInt(2, 6) * 2;
    const cutouts = getRandomInt(1, 3); // "empty spaces" inside
    const area = full + (halves / 2) - cutouts; // The math here is conceptual based on prompt

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: 8, rows: 6 },
        unitLabel: `1 ${unit}`,
        figures: [{ shadedSquares: [[1,1]], halfShadedSquares: [] }] // Dummy visual for complex shape
      }
    });

    let askText = `The shaded figure on the 1 ${unit} grid is a complex shape. Calculate the total area carefully. It has ${full} full squares, ${halves} half-squares, and ${cutouts} empty spaces inside that must be subtracted from the full squares.`;
    let finalAnswer = `${area} ${unit}²`;
    let sysSolutionSteps = `"""1. Number of full squares: ${full}.\\n2. Group the half-squares into wholes: ${halves} / 2 = ${halves/2}.\\n3. Subtract the empty spaces: ${full} - ${cutouts} = ${full - cutouts}.\\n4. Add everything together: ${full - cutouts} + ${halves/2} = ${area}.\\n5. The total area is ${area} ${unit}²."""`;

    if (isShort) {
      askText = `Find the area of the shaded shape on the 1 ${unit} grid which has ${full} full squares, ${halves} half-squares, and ${cutouts} empty spaces inside.`;
    } else if (isMCQ) {
      askText = `A shape has ${full} wholes, ${halves} halves, and ${cutouts} empty spaces inside. Area?`;
    } else if (isStructure) {
      askText = `The shaded figure on the 1 ${unit} grid is a complex shape with ${full} full squares, ${halves} half-squares, and ${cutouts} empty squares. Calculate the total area carefully.`;
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Number of full squares:", expectedAnswer: `${full}`, acceptedAnswers: [] },
          { label: "Write the working equation to group the half-squares into wholes:", expectedAnswer: `${halves} / 2 = ${halves/2}`, acceptedAnswers: [`${halves} \\\\div 2 = ${halves/2}`] },
          { label: "Write the working equation to add the full and grouped squares together, subtracting the empty spaces:", expectedAnswer: `${full} + ${halves/2} - ${cutouts} = ${area}`, acceptedAnswers: [] },
          { label: "Total area:", expectedAnswer: `${area} ${unit}²`, acceptedAnswers: [`${area}`] }
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
- For content.hint, use: "Pair the half-squares together and subtract the empty spaces."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${area + cutouts} ${unit}²"
- "${full + halves - cutouts} ${unit}²"
- "${area - 1} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'advanced_area_conservation') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const w = getRandomInt(3, 5);
    const h = getRandomInt(3, 5);
    const startArea = w * h;
    const lostSquares = getRandomInt(2, 5);
    const newArea = startArea - lostSquares;

    let shaded = [];
    for(let i=0; i<w; i++){
      for(let j=0; j<h; j++){
        shaded.push([1 + i, 1 + j]);
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: w + 2, rows: h + 2 },
        unitLabel: `1 ${unit}`,
        figures: [{ shadedSquares: shaded }]
      }
    });

    let askText = `Look at Figure A on the 1 ${unit} grid. All of its squares are detached and rearranged to form Figure B, but ${lostSquares} squares were lost in the process. What is the area of Figure B?`;
    let finalAnswer = `${newArea} ${unit}²`;
    let sysSolutionSteps = `"""1. Find the area of the starting Figure A: ${w} x ${h} = ${startArea}.\\n2. Subtract the lost squares: ${startArea} - ${lostSquares} = ${newArea}.\\n3. The area of Figure B is ${newArea} ${unit}²."""`;

    if (isShort) {
      askText = `A ${startArea} ${unit}² shape is broken apart. ${lostSquares} squares are thrown away, and the rest make a new shape. New area?`;
    } else if (isMCQ) {
      askText = `Figure A has an area of ${startArea} ${unit}². It is broken apart. ${lostSquares} squares are lost. What is the new area?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the area of the starting Figure A (by counting rows):", expectedAnswer: `${w} x ${h} = ${startArea}`, acceptedAnswers: [`${h} x ${w} = ${startArea}`] },
          { label: "Write the working equation to subtract the lost squares:", expectedAnswer: `${startArea} - ${lostSquares} = ${newArea}`, acceptedAnswers: [] },
          { label: "Area of Figure B:", expectedAnswer: `${newArea} ${unit}²`, acceptedAnswers: [`${newArea}`] }
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
- For content.hint, use: "Find the starting area and subtract the lost squares."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${startArea + lostSquares} ${unit}²"
- "${startArea} ${unit}²"
- "${newArea - 2} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'advanced_tiling_area_division') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const tilesNeeded = getRandomInt(6, 12);
    const unitArea = getRandomInt(2, 5);
    const totalArea = tilesNeeded * unitArea;

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        bars: [
          {
            segments: [
              { value: unitArea, label: `${unitArea}`, color: "blue" },
              { value: unitArea, label: `${unitArea}`, color: "blue" },
              { value: totalArea - (unitArea * 2), label: "...", color: "gray" }
            ],
            bracketLabel: `Total: ${totalArea} ${unit}²`,
            bracketPosition: "top"
          }
        ]
      }
    });

    let askText = `Mr. Tan wants to cover a wall with wooden panels. The total area of the wall is ${totalArea} ${unit}². Each wooden panel has an area of ${unitArea} ${unit}². How many wooden panels does he need?`;
    let finalAnswer = `${tilesNeeded}`;
    let sysSolutionSteps = `"""1. Divide the total area by the area of 1 panel.\\n2. ${totalArea} / ${unitArea} = ${tilesNeeded}.\\n3. He needs ${tilesNeeded} panels."""`;

    if (isShort) {
      askText = `A room has an area of ${totalArea} ${unit}². How many ${unitArea} ${unit}² rugs are needed to cover it?`;
    } else if (isMCQ) {
      askText = `Total area ${totalArea} ${unit}². Each sticker is ${unitArea} ${unit}². How many stickers?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find how many panels are needed (Total Area ÷ Area of 1 Panel):", expectedAnswer: `${totalArea} / ${unitArea} = ${tilesNeeded}`, acceptedAnswers: [`${totalArea} \\\\div ${unitArea} = ${tilesNeeded}`] },
          { label: "Number of panels needed:", expectedAnswer: `${tilesNeeded}`, acceptedAnswers: [] }
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
- For content.hint, use: "Divide the total area by the area of one unit."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${tilesNeeded + 2}"
- "${totalArea - unitArea}"
- "${tilesNeeded * 2}"` : ''}
`;
  }
  else if (activeVariant === 'advanced_two_part_unit_cost') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const areaA = getRandomInt(10, 20);
    const areaB = getRandomInt(5, 15);
    const totalArea = areaA + areaB;
    const costPerUnit = getRandomInt(2, 5);
    const totalCost = totalArea * costPerUnit;

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        bars: [
          {
            segments: [
              { value: areaA, label: `Patch 1: ${areaA}`, color: "blue" },
              { value: areaB, label: `Patch 2: ${areaB}`, color: "green" }
            ],
            bracketLabel: `Total Area: ?`,
            bracketPosition: "top"
          }
        ]
      }
    });

    let askText = `A school wants to put new grass on two patches of ground. The first patch has an area of ${areaA} ${unit}² and the second patch has an area of ${areaB} ${unit}². The grass costs $${costPerUnit} for every 1 ${unit}². How much will the grass cost in total?`;
    let finalAnswer = `$${totalCost}`;
    let sysSolutionSteps = `"""1. Find the total area: ${areaA} + ${areaB} = ${totalArea} ${unit}².\\n2. Multiply the total area by the cost per square unit: ${totalArea} x ${costPerUnit} = ${totalCost}.\\n3. The total cost is $${totalCost}."""`;

    if (isShort) {
      askText = `Room A is ${areaA} ${unit}². Room B is ${areaB} ${unit}². Carpet costs $${costPerUnit} per ${unit}². Total cost?`;
    } else if (isMCQ) {
      askText = `Area 1 is ${areaA} ${unit}². Area 2 is ${areaB} ${unit}². Cost is $${costPerUnit} per ${unit}². Total cost?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the total area:", expectedAnswer: `${areaA} + ${areaB} = ${totalArea}`, acceptedAnswers: [] },
          { label: "Write the working equation to find the total cost of the grass:", expectedAnswer: `${totalArea} x ${costPerUnit} = ${totalCost}`, acceptedAnswers: [`${costPerUnit} x ${totalArea} = ${totalCost}`] },
          { label: "Total cost in dollars:", expectedAnswer: `${totalCost}`, acceptedAnswers: [`$${totalCost}`] }
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
- For content.hint, use: "Find the total area first, then multiply it by the cost per unit."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "$${(areaA + areaB) + costPerUnit}"
- "$${(areaA * costPerUnit) + areaB}"
- "$${totalCost + costPerUnit}"` : ''}
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
