export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (activeVariant === 'standard_irregular_area' || activeVariant === 'standard_irregular_perimeter') {
    function generateIrregularShape(targetArea, maxCols = 8, maxRows = 8) {
      const shape = new Set();
      const startX = Math.floor(maxCols / 2);
      const startY = Math.floor(maxRows / 2);
      
      shape.add(`${startX},${startY}`);
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      
      while (shape.size < targetArea) {
        const currentBlocks = Array.from(shape);
        const randomBlock = currentBlocks[getRandomInt(0, currentBlocks.length - 1)];
        const [cx, cy] = randomBlock.split(',').map(Number);
        
        const [dx, dy] = dirs[getRandomInt(0, 3)];
        const nx = cx + dx;
        const ny = cy + dy;
        
        if (nx >= 1 && nx < maxCols && ny >= 1 && ny < maxRows) {
          shape.add(`${nx},${ny}`);
        }
      }
      
      const blocks = Array.from(shape).map(s => s.split(',').map(Number));
      
      let perimeter = 0;
      for (const [x, y] of blocks) {
        for (const [dx, dy] of dirs) {
          if (!shape.has(`${x+dx},${y+dy}`)) {
            perimeter++;
          }
        }
      }
      
      let minX = Infinity, minY = Infinity;
      for (const [x, y] of blocks) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
      }
      
      const finalBlocks = blocks.map(([x, y]) => [x - minX + 1, y - minY + 1]);
      
      let maxX = 0, maxY = 0;
      for (const [x, y] of finalBlocks) {
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
      
      return {
        shaded: finalBlocks,
        perimeter,
        cols: maxX + 1,
        rows: maxY + 1,
        area: targetArea
      };
    }

    const targetArea = getRandomInt(8, 16);
    const { shaded, perimeter, cols, rows, area } = generateIrregularShape(targetArea, 10, 8);
    const unit = Math.random() < 0.5 ? "cm" : "m";

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: cols + 3, rows: rows + 3 },
        unitLabel: `1 ${unit}²`,
        figures: [{ shadedSquares: shaded }]
      }
    });

    if (activeVariant === 'standard_irregular_area') {
      let askText = `The shaded irregular shape is drawn on a grid where each square has an area of 1 ${unit}². Calculate the total area of the figure.`;
      let finalAnswer = `${area} ${unit}²`;
      let sysSolutionSteps = `"""1. Count all the shaded squares in the irregular shape.\\n2. There are ${area} shaded squares.\\n3. Total area = ${area} ${unit}²."""`;

      if (isShort) {
        askText = `Find the area of the irregular figure in ${unit}².`;
      } else if (isMCQ) {
        askText = `Each square on the grid has an area of 1 ${unit}². What is the area of the shaded irregular shape?`;
        finalAnswer = `${area} ${unit}²`;
      }

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Number of shaded squares counted for total area:", expectedAnswer: `${area}`, acceptedAnswers: [] },
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
- For content.hint, use: "Count all the shaded squares inside the shape."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${area + 2} ${unit}²"
- "${perimeter} ${unit}²"
- "${area - 2} ${unit}²"` : ''}
`;
    } else {
      const places = ["garden", "playground", "tiled patio", "swimming pool", "farm pen", "park"];
      const place = places[getRandomInt(0, places.length - 1)];

      let askText = `A ${place} is shaped irregularly. Each grid square represents 1 ${unit}. What is the perimeter of the ${place}?`;
      let finalAnswer = `${perimeter} ${unit}`;
      let sysSolutionSteps = `"""1. Trace the outside boundary of the irregular shape.\\n2. Count the outer edge segments.\\n3. There are ${perimeter} outer edge segments.\\n4. The total perimeter is ${perimeter} ${unit}."""`;

      if (isShort) {
        askText = `Find the perimeter of the irregular figure in ${unit}.`;
      } else if (isMCQ) {
        askText = `What is the perimeter of the irregular shape in ${unit === 'cm' ? 'centimetres' : 'metres'}?`;
        finalAnswer = `${perimeter} ${unit}`;
      }

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Number of outer edge segments counted for Perimeter:", expectedAnswer: `${perimeter}`, acceptedAnswers: [] },
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
- For content.hint, use: "Trace the outside boundary and count all the outer edge segments."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${perimeter + 2} ${unit}"
- "${area} ${unit}"
- "${perimeter - 2} ${unit}"` : ''}
`;
    }
  }
  else if (activeVariant === 'standard_same_area_diff_perimeter') {
    let shapeA, shapeB;
    let isSameArea = Math.random() < 0.5;
    
    // We can reuse the generateIrregularShape function from the previous block.
    // If it is out of scope here, we redefine it briefly.
    function generateShape(targetArea, maxCols = 8, maxRows = 8) {
      const shape = new Set();
      const startX = Math.floor(maxCols / 2);
      const startY = Math.floor(maxRows / 2);
      shape.add(`${startX},${startY}`);
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      
      while (shape.size < targetArea) {
        const currentBlocks = Array.from(shape);
        const randomBlock = currentBlocks[getRandomInt(0, currentBlocks.length - 1)];
        const [cx, cy] = randomBlock.split(',').map(Number);
        const [dx, dy] = dirs[getRandomInt(0, 3)];
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 1 && nx < maxCols && ny >= 1 && ny < maxRows) {
          shape.add(`${nx},${ny}`);
        }
      }
      
      const blocks = Array.from(shape).map(s => s.split(',').map(Number));
      let perimeter = 0;
      for (const [x, y] of blocks) {
        for (const [dx, dy] of dirs) {
          if (!shape.has(`${x+dx},${y+dy}`)) {
            perimeter++;
          }
        }
      }
      
      let minX = Infinity, minY = Infinity;
      for (const [x, y] of blocks) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
      }
      const finalBlocks = blocks.map(([x, y]) => [x - minX + 1, y - minY + 1]);
      let maxX = 0, maxY = 0;
      for (const [x, y] of finalBlocks) {
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
      return { shaded: finalBlocks, perimeter, cols: maxX + 1, rows: maxY + 1, area: targetArea };
    }

    if (isSameArea) {
      const targetArea = getRandomInt(8, 14);
      shapeA = generateShape(targetArea, 8, 8);
      let attempts = 0;
      do {
        shapeB = generateShape(targetArea, 8, 8);
        attempts++;
      } while (shapeA.perimeter === shapeB.perimeter && attempts < 100);
      
      if (shapeA.perimeter === shapeB.perimeter) {
        // Fallback: manually alter shape B's perimeter if stuck
        shapeB.perimeter += 2;
      }
    } else {
      let found = false;
      let attempts = 0;
      while (!found && attempts < 200) {
        const targetAreaA = getRandomInt(6, 12);
        const targetAreaB = getRandomInt(6, 12);
        if (targetAreaA === targetAreaB) { attempts++; continue; }
        
        let tempA = generateShape(targetAreaA, 8, 8);
        let tempB = generateShape(targetAreaB, 8, 8);
        
        if (tempA.perimeter === tempB.perimeter) {
          shapeA = tempA;
          shapeB = tempB;
          found = true;
        }
        attempts++;
      }
      
      if (!found) {
        // Fallback to Same Area if it couldn't easily find a match
        isSameArea = true;
        const targetArea = getRandomInt(8, 12);
        shapeA = generateShape(targetArea, 8, 8);
        shapeB = generateShape(targetArea, 8, 8);
        if (shapeA.perimeter === shapeB.perimeter) shapeB.perimeter += 2;
      }
    }

    const unit = Math.random() < 0.5 ? "cm" : "m";
    
    // Margins and padding
    const marginX = 2;
    const marginY = 2;
    const padding = 3;
    
    // Shift Shape A
    const shiftedShadedA = shapeA.shaded.map(([x, y]) => [x + marginX, y + marginY]);
    
    // Shift Shape B to the right of Shape A
    const shiftedShadedB = shapeB.shaded.map(([x, y]) => [x + shapeA.cols + padding + marginX, y + marginY]);

    const maxRows = Math.max(shapeA.rows, shapeB.rows);

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: marginX + shapeA.cols + padding + shapeB.cols + marginX, rows: maxRows + marginY + 4 },
        unitLabel: `1 ${unit}`,
        figures: [
          { label: "Figure A", labelPos: {x: marginX + shapeA.cols/2, y: maxRows + marginY + 1.5}, shadedSquares: shiftedShadedA },
          { label: "Figure B", labelPos: {x: marginX + shapeA.cols + padding + shapeB.cols/2, y: maxRows + marginY + 1.5}, shadedSquares: shiftedShadedB }
        ]
      }
    });

    let askText = `Look at Figure A and Figure B. Do they have the same area or the same perimeter?`;
    let finalAnswer = isSameArea ? `Same Area` : `Same Perimeter`;
    let sysSolutionSteps = `"""1. Count the shaded squares for Area of Figure A: ${shapeA.area}.\\n2. Count the shaded squares for Area of Figure B: ${shapeB.area}.\\n3. Count outer edges for Perimeter of Figure A: ${shapeA.perimeter}.\\n4. Count outer edges for Perimeter of Figure B: ${shapeB.perimeter}.\\n5. They have the ${isSameArea ? "same area" : "same perimeter"}."""`;

    if (isShort) {
      askText = `Look at Figure A and Figure B. Do they have the same area or the same perimeter?`;
    } else if (isMCQ) {
      askText = `Which property do Figure A and Figure B share?`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Number of squares counted for Area of Figure A:", expectedAnswer: `${shapeA.area}`, acceptedAnswers: [] },
          { label: "Number of squares counted for Area of Figure B:", expectedAnswer: `${shapeB.area}`, acceptedAnswers: [] },
          { label: "Number of outer edge segments for Perimeter of Figure A:", expectedAnswer: `${shapeA.perimeter}`, acceptedAnswers: [] },
          { label: "Number of outer edge segments for Perimeter of Figure B:", expectedAnswer: `${shapeB.perimeter}`, acceptedAnswers: [] },
          { label: `Conclusion (Same Area / Same Perimeter):`, expectedAnswer: `${finalAnswer}`, acceptedAnswers: [] }
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
- For content.hint, use: "Count both the area (squares inside) and perimeter (outer edges) for both figures to compare."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${isSameArea ? "Same Perimeter" : "Same Area"}"
- "Neither"
- "Both Same Area and Same Perimeter"` : ''}
`;
  }
  else if (activeVariant === 'standard_missing_edge_deduction') {
    const numSides = getRandomInt(3, 6);
    const knownSides = [];
    let knownSum = 0;
    for (let i = 0; i < numSides - 1; i++) {
      const s = getRandomInt(5, 12);
      knownSides.push(s);
      knownSum += s;
    }
    const unknown = getRandomInt(5, 12);
    const totalP = knownSum + unknown;
    const unit = Math.random() < 0.5 ? "cm" : "m";

    // Generate convex polygon vertices with minimum separation
    const angles = [];
    const sector = (Math.PI * 2) / numSides;
    for (let i = 0; i < numSides; i++) {
      const margin = 0.3; // minimum separation margin
      const minAngle = i * sector + margin;
      const maxAngle = (i + 1) * sector - margin;
      angles.push(minAngle + Math.random() * (maxAngle - minAngle));
    }
    // Angles are naturally sorted because of the sectors
    
    const radius = 80;
    const centerX = 0;
    const centerY = 0;
    const vertices = angles.map(a => ({
      x: Math.round(centerX + radius * Math.cos(a)),
      y: Math.round(centerY + radius * Math.sin(a))
    }));

    // Calculate visual edge lengths
    const visualEdges = [];
    for (let i = 0; i < numSides; i++) {
      const v1 = vertices[i];
      const v2 = vertices[(i + 1) % numSides];
      const dist = Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
      visualEdges.push({ index: i, length: dist });
    }

    // Sort edges by length, sort assigned values by magnitude to ensure proportionality
    visualEdges.sort((a, b) => a.length - b.length);
    const sideObjects = [...knownSides.map(s => ({ val: s, isUnknown: false })), { val: unknown, isUnknown: true }];
    sideObjects.sort((a, b) => a.val - b.val);

    const edgeLabels = new Array(numSides);
    for (let i = 0; i < numSides; i++) {
      const e = visualEdges[i];
      const s = sideObjects[i];
      edgeLabels[e.index] = s.isUnknown ? '?' : `${s.val} ${unit}`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices,
        edgeLabels
      }
    });

    let knownSidesText = "";
    if (knownSides.length === 2) {
      knownSidesText = `${knownSides[0]} ${unit} and ${knownSides[1]} ${unit}`;
    } else {
      const last = knownSides.pop();
      knownSidesText = `${knownSides.map(s => `${s} ${unit}`).join(', ')}, and ${last} ${unit}`;
      knownSides.push(last); // restore array
    }
    
    const knownSidesSumEq = knownSides.join(' + ') + ` = ${knownSum}`;

    let askText = `A polygon has a total perimeter of ${totalP} ${unit}. The lengths of its given sides are ${knownSidesText}. What is the length of the unknown side?`;
    let finalAnswer = `${unknown} ${unit}`;
    let sysSolutionSteps = `"""1. Add the known sides together: ${knownSidesSumEq} ${unit}.\\n2. Subtract from the total perimeter: ${totalP} - ${knownSum} = ${unknown} ${unit}.\\n3. The unknown side is ${unknown} ${unit}."""`;

    if (isShort) {
      askText = `The perimeter of the shape is ${totalP} ${unit}. The known sides are ${knownSidesText}. Find the missing side.`;
    } else if (isMCQ) {
      askText = `Perimeter is ${totalP} ${unit}. Known sides are ${knownSidesText}. What is the missing side?`;
      finalAnswer = `${unknown} ${unit}`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to add the known sides together:", expectedAnswer: knownSidesSumEq, acceptedAnswers: [] },
          { label: "Write the working equation to find the unknown side using the total perimeter:", expectedAnswer: `${totalP} - ${knownSum} = ${unknown}`, acceptedAnswers: [] },
          { label: `Length of the unknown side in ${unit}:`, expectedAnswer: `${unknown}`, acceptedAnswers: [`${unknown}`] }
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
- For content.hint, use: "Subtract the sum of the known sides from the total perimeter."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${unknown + 2} ${unit}"
- "${unknown - 2} ${unit}"
- "${knownSum} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'standard_area_half_squares') {
    let full = getRandomInt(3, 6);
    let halves = getRandomInt(2, 4) * 2; // Even number of halves (4, 6, 8)
    const area = full + (halves / 2);
    const unit = Math.random() < 0.5 ? "cm" : "m";
    
    // Draw something simple: A 3x3 box with some missing corners replaced by triangles
    let shaded = [];
    let countFull = 0;
    
    // Base 2x3 block for full squares
    for(let i=0; i<2; i++){
      for(let j=0; j<2; j++){
        if (countFull < full) {
          shaded.push({x: 2+i, y: 2+j, type: 'full'});
          countFull++;
        }
      }
    }
    // Add extra full squares if needed
    if (countFull < full) {
      shaded.push({x: 2, y: 4, type: 'full'});
      countFull++;
    }
    if (countFull < full) {
      shaded.push({x: 3, y: 4, type: 'full'});
    }

    // Add halves (triangles)
    let halfTypes = ['half-bl', 'half-tr', 'half-br', 'half-tl', 'half-bl', 'half-tr', 'half-br', 'half-tl'];
    let halfCoords = [
      {x: 1, y: 2}, {x: 4, y: 2}, {x: 1, y: 3}, {x: 4, y: 3},
      {x: 1, y: 4}, {x: 4, y: 4}, {x: 2, y: 1}, {x: 3, y: 1}
    ];

    for(let i=0; i<halves; i++) {
      shaded.push({x: halfCoords[i].x, y: halfCoords[i].y, type: halfTypes[i]});
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: 6, rows: 6 },
        unitLabel: `1 ${unit}`,
        figures: [{ shadedSquares: shaded }]
      }
    });

    let askText = `Look at the shaded figure on the 1 ${unit} grid. It contains both full squares and half-squares. Find the total area.`;
    let finalAnswer = `${area} ${unit}²`;
    let sysSolutionSteps = `"""1. Count the full squares: ${full}.\\n2. Count the half-squares: ${halves}. Two half-squares make 1 full square.\\n3. ${halves} halves = ${halves/2} wholes.\\n4. Total area = ${full} + ${halves/2} = ${area} ${unit}²."""`;

    if (isShort) {
      askText = `Find the area of the shaded figure drawn on the grid.`;
    } else if (isMCQ) {
      askText = `What is the area of a figure with ${full} whole squares and ${halves} half-squares?`;
      finalAnswer = `${area} ${unit}²`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Number of full squares:", expectedAnswer: `${full}`, acceptedAnswers: [`${full}`] },
          { label: "Write the working equation to combine the half-squares into full squares:", expectedAnswer: `${halves} / 2 = ${halves/2}`, acceptedAnswers: [] },
          { label: "Write the working equation for the total area:", expectedAnswer: `${full} + ${halves/2} = ${area}`, acceptedAnswers: [] },
          { label: `Total area in square ${unit}:`, expectedAnswer: `${area} \\\\text{${unit}}^2`, acceptedAnswers: [`${area}`, `${area} \\\\text{${unit}}^2`] }
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
- For content.hint, use: "Two half-squares combine to make one full square."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${area + 1} square units"
- "${full + halves} square units"
- "${area - 1 > 0 ? area - 1 : area + 2} square units"` : ''}
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
