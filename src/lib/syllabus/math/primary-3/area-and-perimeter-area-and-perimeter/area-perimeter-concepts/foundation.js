export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const generateRect = (cols, rows) => {
    let w = getRandomInt(2, cols - 2);
    let h = getRandomInt(2, rows - 2);
    let startX = getRandomInt(1, cols - w - 1);
    let startY = getRandomInt(1, rows - h - 1);
    
    let shaded = [];
    for(let i=0; i<w; i++){
      for(let j=0; j<h; j++){
        shaded.push([startX + i, startY + j]);
      }
    }
    return { w, h, shaded };
  };

  if (activeVariant === 'foundation_pure_area') {
    const { w, h, shaded } = generateRect(8, 8);
    const area = w * h;
    const unit = Math.random() < 0.5 ? "cm" : "m";
    
    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: 8, rows: 8 },
        unitLabel: `1 ${unit}²`,
        figures: [{ shadedSquares: shaded }]
      }
    });

    let askText = `The shaded figure is drawn on a grid where each square has an area of 1 ${unit}². Find the total area of the figure.`;
    let finalAnswer = `${area} ${unit}²`;
    let sysSolutionSteps = `"""1. Count the number of shaded squares inside the figure.\\n2. There are ${area} shaded squares.\\n3. The area is ${area} ${unit}²."""`;

    if (isShort) {
      askText = `Look at the figure. What is its area?`;
    } else if (isMCQ) {
      askText = `The figure is drawn on a grid where each square is 1 ${unit}². What is its area?`;
      finalAnswer = `${area} ${unit}²`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Number of shaded squares counted:", expectedAnswer: `${area}`, acceptedAnswers: [] },
          { label: `Total area:`, expectedAnswer: `${area} \\\\text{${unit}}^2`, acceptedAnswers: [`${area}`, `${area} ${unit}²`] }
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
- For content.hint, use: "Count the number of shaded squares inside the figure."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${area + 2} ${unit}²"
- "${area - 2 > 0 ? area - 2 : area + 4} ${unit}²"
- "${(w+h)*2} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'foundation_pure_perimeter') {
    const { w, h, shaded } = generateRect(8, 8);
    const perimeter = (w + h) * 2;
    const unit = Math.random() < 0.5 ? "cm" : "m";
    
    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: 8, rows: 8 },
        unitLabel: `1 ${unit}`,
        figures: [{ shadedSquares: shaded }]
      }
    });

    let askText = `A garden is drawn on a 1 ${unit} square grid. What is the total length of the fence needed to surround the garden?`;
    let finalAnswer = `${perimeter} ${unit}`;
    let sysSolutionSteps = `"""1. Count the outer edge segments of the shaded figure.\\n2. There are ${perimeter} outer edge segments.\\n3. The perimeter is ${perimeter} ${unit}."""`;

    if (isShort) {
      askText = `Find the perimeter of the shaded figure in ${unit}.`;
    } else if (isMCQ) {
      askText = `Each grid square is 1 ${unit} by 1 ${unit}. What is the perimeter?`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Number of outer edge segments counted:", expectedAnswer: `${perimeter}`, acceptedAnswers: [] },
          { label: `Total perimeter:`, expectedAnswer: `${perimeter} ${unit}`, acceptedAnswers: [`${perimeter}`] }
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
- For content.hint, use: "Trace and count the outer edges of the shaded squares."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${perimeter + 2} ${unit}"
- "${perimeter - 2 > 0 ? perimeter - 2 : perimeter + 4} ${unit}"
- "${w*h} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'foundation_comparing_area') {
    let wA = getRandomInt(3, 5);
    let hA = getRandomInt(3, 4);
    let wB = getRandomInt(2, 3);
    let hB = getRandomInt(2, 3);
    
    // Ensure A is larger
    if (wA * hA <= wB * hB) {
      wA += 2;
    }
    
    let shadedA = [];
    for(let i=0; i<wA; i++) {
      for(let j=0; j<hA; j++) {
        shadedA.push([1 + i, 1 + j]);
      }
    }
    
    let shadedB = [];
    for(let i=0; i<wB; i++) {
      for(let j=0; j<hB; j++) {
        shadedB.push([wA + 3 + i, 1 + j]);
      }
    }

    const areaA = wA * hA;
    const areaB = wB * hB;
    const diff = areaA - areaB;
    const unit = Math.random() < 0.5 ? "cm" : "m";
    
    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: wA + wB + 5, rows: Math.max(hA, hB) + 3 },
        unitLabel: `1 ${unit}²`,
        figures: [
          { label: "Figure A", labelPos: {x: 1 + wA/2, y: hA + 1.5}, shadedSquares: shadedA },
          { label: "Figure B", labelPos: {x: wA + 3 + wB/2, y: hB + 1.5}, shadedSquares: shadedB }
        ]
      }
    });

    let askText = `Look at Figure A and Figure B on a grid where each square has an area of 1 ${unit}². How much larger is Figure A than Figure B?`;
    let finalAnswer = `${diff} ${unit}²`;
    let sysSolutionSteps = `"""1. Figure A has ${areaA} squares.\\n2. Figure B has ${areaB} squares.\\n3. ${areaA} - ${areaB} = ${diff}."""`;

    if (isShort) {
      askText = `How much larger is the area of Figure A than Figure B?`;
    } else if (isMCQ) {
      askText = `Each square on the grid has an area of 1 ${unit}². How much greater is the area of Figure A than Figure B?`;
      finalAnswer = `${diff} ${unit}²`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Area of Figure A:", expectedAnswer: `${areaA}`, acceptedAnswers: [`${areaA} \\\\text{${unit}}^2`] },
          { label: "Area of Figure B:", expectedAnswer: `${areaB}`, acceptedAnswers: [`${areaB} \\\\text{${unit}}^2`] },
          { label: "Write the working equation to find the difference in area:", expectedAnswer: `${areaA} - ${areaB} = ${diff}`, acceptedAnswers: [] },
          { label: "Difference in area:", expectedAnswer: `${diff} \\\\text{${unit}}^2`, acceptedAnswers: [`${diff}`, `${diff} ${unit}²`] }
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
- For content.hint, use: "Count the squares for each figure, then subtract the smaller area from the larger area."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${diff + 2} square units"
- "${diff - 2 > 0 ? diff - 2 : diff + 4} square units"
- "${areaA + areaB} square units"` : ''}
`;
  }
  else if (activeVariant === 'foundation_comparing_perimeter') {
    let wA = getRandomInt(3, 5);
    let hA = getRandomInt(3, 4);
    let wB = getRandomInt(2, 4);
    let hB = getRandomInt(2, 4);
    
    let perimA = (wA + hA) * 2;
    let perimB = (wB + hB) * 2;
    
    if (perimA <= perimB) {
      wA += 2;
      perimA = (wA + hA) * 2;
    }
    
    let shadedA = [];
    for(let i=0; i<wA; i++) {
      for(let j=0; j<hA; j++) {
        shadedA.push([1 + i, 1 + j]);
      }
    }
    
    let shadedB = [];
    for(let i=0; i<wB; i++) {
      for(let j=0; j<hB; j++) {
        shadedB.push([wA + 3 + i, 1 + j]);
      }
    }

    const diff = perimA - perimB;
    const unit = Math.random() < 0.5 ? "cm" : "m";
    
    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: wA + wB + 5, rows: Math.max(hA, hB) + 3 },
        unitLabel: `1 ${unit}`,
        figures: [
          { label: "Figure X", labelPos: {x: 1 + wA/2, y: hA + 1.5}, shadedSquares: shadedA },
          { label: "Figure Y", labelPos: {x: wA + 3 + wB/2, y: hB + 1.5}, shadedSquares: shadedB }
        ]
      }
    });

    let askText = `Look at the two figures. Calculate their perimeters to find out how much longer the perimeter of Figure X is than Figure Y.`;
    let finalAnswer = `${diff} ${unit}`;
    let sysSolutionSteps = `"""1. Find the perimeter of Figure X (${perimA} ${unit}).\\n2. Find the perimeter of Figure Y (${perimB} ${unit}).\\n3. Subtract the perimeter of Figure Y from Figure X: ${perimA} - ${perimB} = ${diff} ${unit}."""`;

    if (isShort) {
      askText = `Figure X has a perimeter of ${perimA} ${unit}. Figure Y has a perimeter of ${perimB} ${unit}. How much longer is Figure X's perimeter?`;
    } else if (isMCQ) {
      askText = `Which figure has the shortest perimeter, and by how much compared to the longest?`;
      finalAnswer = `Figure Y by ${diff} ${unit}`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the perimeter of Figure X:", expectedAnswer: `${wA} + ${hA} + ${wA} + ${hA} = ${perimA}`, acceptedAnswers: [] },
          { label: "Write the working equation to find the perimeter of Figure Y:", expectedAnswer: `${wB} + ${hB} + ${wB} + ${hB} = ${perimB}`, acceptedAnswers: [] },
          { label: "Write the working equation to find the difference:", expectedAnswer: `${perimA} - ${perimB} = ${diff}`, acceptedAnswers: [] },
          { label: `Difference in ${unit}:`, expectedAnswer: `${diff}`, acceptedAnswers: [`${diff}`] }
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
- For content.hint, use: "Count the outer edge segments for each figure, then find the difference."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "Figure Y by ${diff + 2} ${unit}"
- "Figure X by ${diff} ${unit}"
- "Figure X by ${diff + 2} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'foundation_area_and_perimeter') {
    const { w, h, shaded } = generateRect(8, 8);
    const area = w * h;
    const perimeter = (w + h) * 2;
    const unit = Math.random() < 0.5 ? "cm" : "m";
    
    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: 8, rows: 8 },
        unitLabel: `1 ${unit}`,
        figures: [{ shadedSquares: shaded }]
      }
    });

    let askText = `A carpet is laid on a 1 ${unit} grid. Find the area of the carpet and the perimeter of the carpet.`;
    let finalAnswer = `Area: ${area} ${unit}², Perimeter: ${perimeter} ${unit}`;
    let sysSolutionSteps = `"""1. Find the area by counting the squares (${area}).\\n2. Find the perimeter by counting the outer edges (${perimeter}).\\n3. The Area is ${area} and Perimeter is ${perimeter}."""`;

    if (isShort) {
      askText = `Look at the shape. Find its area in ${unit}² and its perimeter in ${unit} (Area, Perimeter).`;
    } else if (isMCQ) {
      askText = `Which pair of measurements is correct for the figure?`;
      finalAnswer = `Area ${area} ${unit}², Perimeter ${perimeter} ${unit}`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Number of shaded squares counted for Area:", expectedAnswer: `${area}`, acceptedAnswers: [] },
          { label: `Total area:`, expectedAnswer: `${area} \\\\text{${unit}}^2`, acceptedAnswers: [`${area}`, `${area} ${unit}²`] },
          { label: "Write the working equation to find the Perimeter:", expectedAnswer: `${w} + ${h} + ${w} + ${h} = ${perimeter}`, acceptedAnswers: [] },
          { label: `Total perimeter:`, expectedAnswer: `${perimeter} ${unit}`, acceptedAnswers: [`${perimeter}`] }
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
- For content.hint, use: "Area is the inside squares. Perimeter is the outside edges."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "Area ${perimeter} ${unit}², Perimeter ${area} ${unit}"
- "Area ${area + 2} ${unit}², Perimeter ${perimeter} ${unit}"
- "Area ${area} ${unit}², Perimeter ${perimeter + 2} ${unit}"` : ''}
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
