export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (activeVariant === 'foundation_counting_grid') {
    const isM = Math.random() < 0.5;
    const unit = isM ? 'm' : 'cm';
    const w = getRandomInt(3, 6);
    const h = getRandomInt(2, 5);
    const area = w * h;
    
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

    let askText = `Look at the figure. What is its area in ${unit}²?`;
    let finalAnswer = `${area} ${unit}²`;
    let sysSolutionSteps = `"""1. Count the number of squares in one row: ${w}.\\n2. Count the number of rows: ${h}.\\n3. Add or multiply to find the total: ${w} x ${h} = ${area}.\\n4. The total area is ${area} ${unit}²."""`;

    if (isShort) {
      if (isM) {
        askText = `The floor plan of a stage is drawn on a 1 ${unit} grid. Find the area of the stage in ${unit}².`;
      } else {
        askText = `Look at the figure. What is its area in ${unit}²?`;
      }
    } else if (isMCQ) {
      askText = `The figure is drawn on a 1 ${unit} square grid. What is its area?`;
    }

    if (isStructure) {
      if (isM) {
        askText = `A garden path is drawn on a 1 ${unit} square grid. The path is made of ${h} rows, with ${w} squares in each row. Find the area of the path.`;
      } else {
        askText = `A rectangle is drawn on a grid of 1 ${unit} squares. The shape is ${h} squares tall and ${w} squares long. Find the total area.`;
      }
      
      const additionStr = Array(h).fill(w).join(" + ") + ` = ${area}`;
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to group and count the squares (e.g., adding rows):", expectedAnswer: additionStr, acceptedAnswers: [`${w} \\\\times ${h} = ${area}`] },
          { label: "Total area:", expectedAnswer: `${area} ${unit}²`, acceptedAnswers: [`${area}`, `${area} \\\\text{${unit}}^2`] }
        ]
      });
    } else if (!isMCQ) {
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
- For content.hint, use: "Count the total number of shaded squares."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${area - h} ${unit}²"
- "${area + w} ${unit}²"
- "${area * 2} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'foundation_irregular_part_addition') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const partA_w = getRandomInt(4, 6);
    const partA_h = getRandomInt(2, 3);
    const partB_w = getRandomInt(2, 3);
    const partB_h = getRandomInt(2, 3);
    
    const areaA = partA_w * partA_h;
    const areaB = partB_w * partB_h;
    const totalArea = areaA + areaB;

    let shaded = [];
    for(let i=0; i<partA_w; i++){
      for(let j=0; j<partA_h; j++){
        shaded.push([1 + i, 1 + partB_h + j]);
      }
    }
    const offsetX = Math.floor((partA_w - partB_w) / 2);
    for(let i=0; i<partB_w; i++){
      for(let j=0; j<partB_h; j++){
        shaded.push([1 + offsetX + i, 1 + j]);
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: partA_w + 2, rows: partA_h + partB_h + 2 },
        unitLabel: `1 ${unit}`,
        figures: [{ shadedSquares: shaded }]
      }
    });

    let askText = `Look at the figure on the 1 ${unit} grid. What is its area in ${unit}²?`;
    let finalAnswer = `${totalArea} ${unit}²`;
    let sysSolutionSteps = `"""1. Split the shape into two parts.\\n2. Count the squares in the first part: ${areaA}.\\n3. Count the squares in the second part: ${areaB}.\\n4. Add them together: ${areaA} + ${areaB} = ${totalArea}.\\n5. The total area is ${totalArea} ${unit}²."""`;

    if (isShort) {
      askText = `Look at the T-shaped figure on the 1 ${unit} grid. What is its area in ${unit}²?`;
    } else if (isMCQ) {
      askText = `The shaded shape on the 1 ${unit} grid is made of a square part and a rectangular part. What is the total area?`;
    } else if (isStructure) {
      askText = `A stage is drawn on a 1 ${unit} grid. It has a main rectangular area made of ${areaA} squares and a smaller front step area made of ${areaB} squares. Find the total area of the stage.`;
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to add the squares of the two parts together:", expectedAnswer: `${areaA} + ${areaB} = ${totalArea}`, acceptedAnswers: [`${areaB} + ${areaA} = ${totalArea}`] },
          { label: "Total area:", expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}`, `${totalArea} \\\\text{${unit}}^2`] }
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
- For content.hint, use: "Split the shape into two blocks and add their areas together."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${totalArea - partB_w} ${unit}²"
- "${totalArea + partA_w} ${unit}²"
- "${areaA * 2} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'foundation_add_sub_given_areas') {
    const isAddition = Math.random() < 0.5;
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const areaA = getRandomInt(10, 30);
    const areaB = getRandomInt(5, 20);
    const totalArea = areaA + areaB;

    let askText = "";
    let finalAnswer = "";
    let sysSolutionSteps = "";

    if (isAddition) {
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          isStatic: true,
          modelType: 'PART_WHOLE',
          parts: [
            { segments: 1, value: areaA, label: `Rug A: ${areaA} ${unit}²`, bgClass: 'bg-blue-500 text-white' },
            { segments: 1, value: areaB, label: `Rug B: ${areaB} ${unit}²`, bgClass: 'bg-red-500 text-white' }
          ],
          whole: "?"
        }
      });

      finalAnswer = `${totalArea} ${unit}²`;
      sysSolutionSteps = `"""1. Add the areas together.\\n2. ${areaA} + ${areaB} = ${totalArea}.\\n3. The total area is ${totalArea} ${unit}²."""`;

      if (isShort) {
        askText = `A blue rug has an area of ${areaA} ${unit}². A red rug has an area of ${areaB} ${unit}². What is their total area?`;
      } else if (isMCQ) {
        askText = `Room A is ${areaA} ${unit}². Room B is ${areaB} ${unit}². What is the total area?`;
      } else if (isStructure) {
        askText = `The area of the first section is ${areaA} ${unit}². The area of the second section is ${areaB} ${unit}². What is their total area?`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the total area:", expectedAnswer: `${areaA} + ${areaB} = ${totalArea}`, acceptedAnswers: [] },
            { label: "Total area:", expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}`, `${totalArea} \\\\text{${unit}}^2`] }
          ]
        });
      }
    } else {
      // Subtraction (given total and one part)
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          isStatic: true,
          modelType: 'PART_WHOLE',
          parts: [
            { segments: 1, value: areaA, label: `First: ${areaA} ${unit}²`, bgClass: 'bg-blue-500 text-white' },
            { segments: 1, value: areaB, displayValue: "?", bgClass: 'bg-slate-400 text-white' }
          ],
          whole: `${totalArea} ${unit}²`
        }
      });

      finalAnswer = `${areaB} ${unit}²`;
      sysSolutionSteps = `"""1. Subtract the known area from the total area.\\n2. ${totalArea} - ${areaA} = ${areaB}.\\n3. The area of the second painting is ${areaB} ${unit}²."""`;

      if (isShort) {
        askText = `The total area of two pieces is ${totalArea} ${unit}². One piece has an area of ${areaA} ${unit}². What is the area of the second piece?`;
      } else if (isMCQ) {
        askText = `Total area is ${totalArea} ${unit}². Area A is ${areaA} ${unit}². What is Area B?`;
      } else if (isStructure) {
        askText = `The total area of two paintings is ${totalArea} ${unit}². One painting has an area of ${areaA} ${unit}². What is the area of the second painting?`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the unknown area:", expectedAnswer: `${totalArea} - ${areaA} = ${areaB}`, acceptedAnswers: [] },
            { label: "Area of the second piece:", expectedAnswer: `${areaB} ${unit}²`, acceptedAnswers: [`${areaB}`, `${areaB} \\\\text{${unit}}^2`] }
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
- For content.hint, use: "${isAddition ? "Add the two parts together." : "Subtract the part from the total."}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${isAddition ? Math.abs(areaA - areaB) : totalArea + areaA} ${unit}²"
- "${isAddition ? totalArea + 5 : areaB + 10} ${unit}²"
- "${isAddition ? totalArea - 5 : Math.abs(areaB - 5)} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'foundation_compare_given_areas') {
    const isFindingDiff = Math.random() < 0.5;
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const areaA = getRandomInt(20, 40);
    const diff = getRandomInt(5, 15);
    const areaB = areaA - diff; // B is smaller

    let askText = "";
    let finalAnswer = "";
    let sysSolutionSteps = "";

    if (isFindingDiff) {
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          isStatic: true,
          modelType: 'COMPARISON',
          bar1: { segments: 1, value: areaA, name: "Section A", displayValue: `${areaA} ${unit}²` },
          bar2: { segments: 1, value: areaB, name: "Section B", displayValue: `${areaB} ${unit}²` },
          difference: { displayValue: "?" }
        }
      });

      finalAnswer = `${diff} ${unit}²`;
      sysSolutionSteps = `"""1. Subtract the smaller area from the larger area.\\n2. ${areaA} - ${areaB} = ${diff}.\\n3. The difference is ${diff} ${unit}²."""`;

      if (isShort) {
        askText = `A large mirror has an area of ${areaA} ${unit}². A small mirror has an area of ${areaB} ${unit}². How much larger is the first mirror?`;
      } else if (isMCQ) {
        askText = `Board A is ${areaA} ${unit}². Board B is ${areaB} ${unit}². How much bigger is Board A?`;
      } else if (isStructure) {
        askText = `Section A has an area of ${areaA} ${unit}². Section B has an area of ${areaB} ${unit}². How much larger is Section A than Section B?`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the difference:", expectedAnswer: `${areaA} - ${areaB} = ${diff}`, acceptedAnswers: [] },
            { label: "Difference in area:", expectedAnswer: `${diff} ${unit}²`, acceptedAnswers: [`${diff}`, `${diff} \\\\text{${unit}}^2`] }
          ]
        });
      }
    } else {
      // Find unknown area using difference (e.g., A is known, B is smaller by diff)
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          isStatic: true,
          modelType: 'COMPARISON',
          bar1: { segments: 1, value: areaA, name: "Section A", displayValue: `${areaA} ${unit}²` },
          bar2: { segments: 1, value: areaB, name: "Section B", displayValue: "?" },
          difference: { displayValue: `${diff} ${unit}²` }
        }
      });

      finalAnswer = `${areaB} ${unit}²`;
      sysSolutionSteps = `"""1. Subtract the difference from the larger area to find the smaller area.\\n2. ${areaA} - ${diff} = ${areaB}.\\n3. The area of the smaller board is ${areaB} ${unit}²."""`;

      if (isShort) {
        askText = `Board X is ${areaA} ${unit}². Board Y is ${diff} ${unit}² smaller than Board X. What is the area of Board Y?`;
      } else if (isMCQ) {
        askText = `Room 1 is ${areaA} ${unit}². Room 2 is ${diff} ${unit}² smaller. Area of Room 2?`;
      } else if (isStructure) {
        askText = `Section A of a wall has an area of ${areaA} ${unit}². Section B is ${diff} ${unit}² smaller than Section A. What is the area of Section B?`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the area of Section B:", expectedAnswer: `${areaA} - ${diff} = ${areaB}`, acceptedAnswers: [] },
            { label: "Area of Section B:", expectedAnswer: `${areaB} ${unit}²`, acceptedAnswers: [`${areaB}`, `${areaB} \\\\text{${unit}}^2`] }
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
- For content.hint, use: "Draw a comparison model to see which area is larger and subtract to find the difference."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${isFindingDiff ? areaA + areaB : areaA + diff} ${unit}²"
- "${isFindingDiff ? diff + 5 : areaB + 5} ${unit}²"
- "${isFindingDiff ? diff - 2 : Math.abs(areaB - 5)} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'foundation_shortfall_target_area') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const w = getRandomInt(2, 4);
    const h = getRandomInt(2, 4);
    const shadedArea = w * h;
    const missingArea = getRandomInt(3, 10);
    const targetArea = shadedArea + missingArea;

    let shaded = [];
    for(let i=0; i<w; i++){
      for(let j=0; j<h; j++){
        shaded.push([1 + i, 1 + j]);
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: w + missingArea, rows: Math.max(h, Math.ceil(targetArea / (w + missingArea))) + 2 },
        unitLabel: `1 ${unit}`,
        figures: [{ shadedSquares: shaded }]
      }
    });

    let askText = `The shaded figure has some squares. How many more 1 ${unit}² squares must be shaded to make a total area of ${targetArea} ${unit}²?`;
    let finalAnswer = `${missingArea}`;
    let sysSolutionSteps = `"""1. Count the currently shaded squares (${shadedArea}).\\n2. Subtract the shaded squares from the target area.\\n3. ${targetArea} - ${shadedArea} = ${missingArea}.\\n4. ${missingArea} more squares must be shaded."""`;

    if (isShort) {
      askText = `The shaded figure has some squares. How many more 1 ${unit}² squares must be shaded to make a total area of ${targetArea} ${unit}²?`;
    } else if (isMCQ) {
      askText = `The target area is ${targetArea} ${unit}². The figure currently shows some shaded squares. How many more squares are needed?`;
    } else if (isStructure) {
      askText = `Min Jie wants to shade a total area of ${targetArea} ${unit}² on the grid. He has already shaded a block that is ${w} squares wide and ${h} squares long. How many more squares does he need to shade?`;
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the area already shaded:", expectedAnswer: `${w} x ${h} = ${shadedArea}`, acceptedAnswers: [`${h} x ${w} = ${shadedArea}`] },
          { label: "Write the working equation to find the remaining area needed:", expectedAnswer: `${targetArea} - ${shadedArea} = ${missingArea}`, acceptedAnswers: [] },
          { label: "Number of additional squares to shade:", expectedAnswer: `${missingArea}`, acceptedAnswers: [] }
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
- For content.hint, use: "Subtract the shaded area from the total target area."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${missingArea + 2}"
- "${targetArea + missingArea}"
- "${shadedArea}"` : ''}
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
