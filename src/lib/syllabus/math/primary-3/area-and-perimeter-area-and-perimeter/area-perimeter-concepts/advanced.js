export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (activeVariant === 'advanced_corner_bite') {
    const s = getRandomInt(4, 6);
    const c = getRandomInt(1, s - 2); // Corner bite size can be 1x1, 2x2, etc.
    const originalArea = s * s;
    const originalPerimeter = s * 4;
    const newPerimeter = originalPerimeter; // Perimeter remains the same
    const unit = Math.random() < 0.5 ? "cm" : "m";

    let shadedA = [];
    let shadedB = [];

    // Figure A: Complete square
    for(let i=0; i<s; i++){
      for(let j=0; j<s; j++){
        shadedA.push([1 + i, 1 + j]);
        // Figure B: Missing top right corner of size c x c
        // i goes from 0 to s-1 (x-axis), j goes from 0 to s-1 (y-axis)
        // Top right is highest i, lowest j
        if (!(i >= s - c && j < c)) {
          shadedB.push([s + 3 + i, 1 + j]);
        }
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: s * 2 + 5, rows: s + 3 },
        unitLabel: `1 ${unit}`,
        figures: [
          { label: "Figure A", labelPos: {x: 1 + s/2, y: s + 1.5}, shadedSquares: shadedA },
          { label: "Figure B", labelPos: {x: s + 3 + s/2, y: s + 1.5}, shadedSquares: shadedB }
        ]
      }
    });

    let askText = `Figure A is a complete ${s}×${s} square. Figure B is the same square, but a ${c} ${unit} by ${c} ${unit} block is removed from the top right corner. Calculate the perimeter of Figure B.`;
    let finalAnswer = `${newPerimeter}`;
    let sysSolutionSteps = `"""1. Find the perimeter of the original Figure A: ${s} \\times 4 = ${originalPerimeter}.\\n2. The corner block removes 2 outer edges but exposes 2 new inner edges.\\n3. The perimeter remains exactly the same.\\n4. Perimeter of Figure B is ${newPerimeter} ${unit}."""`;

    if (isShort) {
      askText = `A ${c}×${c} square is cut from the corner of a ${s}×${s} square grid. What is the perimeter of the new shape in ${unit}?`;
    } else if (isMCQ) {
      askText = `If a ${c}x${c} corner unit is removed from a rectangle, what happens to the perimeter?`;
      finalAnswer = `It stays the same`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the perimeter of the original Figure A:", expectedAnswer: `${s} + ${s} + ${s} + ${s} = ${originalPerimeter}`, acceptedAnswers: [`${s} \\times 4 = ${originalPerimeter}`] },
          { label: "Write the working equation to find the perimeter of the new Figure B by adding its outer edges:", expectedAnswer: `${s} + ${s} + ${s-c} + ${c} + ${c} + ${s-c} = ${newPerimeter}`, acceptedAnswers: [] },
          { label: "Are the perimeters of Figure A and Figure B the same or different?", expectedAnswer: "Same", acceptedAnswers: ["same", "The same", "the same", "They are the same"] },
          { label: "Perimeter of Figure B:", expectedAnswer: `${newPerimeter} ${unit}`, acceptedAnswers: [] }
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
- For content.hint, use: "Removing a corner does not change the perimeter because the two 'lost' edges are replaced by two new 'inner' edges of the same length."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "It decreases by 2 ${unit}"
- "It decreases by 1 ${unit}"
- "It increases by 2 ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'advanced_joining_shapes') {
    const h = getRandomInt(2, 5); // shared height
    const w1 = getRandomInt(2, 4);
    const w2 = w1 + getRandomInt(1, 3); // guaranteed different width
    const individualP1 = (w1 + h) * 2;
    const individualP2 = (w2 + h) * 2;
    const combinedP = individualP1 + individualP2 - (h * 2);
    const unit = Math.random() < 0.5 ? "cm" : "m";
    
    let shadedBefore = [];
    let shadedAfter = [];
    
    // Before: two separate rectangles
    for(let i=0; i<w1; i++){
      for(let j=0; j<h; j++){
        shadedBefore.push([1 + i, 1 + j]);
      }
    }
    for(let i=0; i<w2; i++){
      for(let j=0; j<h; j++){
        shadedBefore.push([w1 + 3 + i, 1 + j]);
      }
    }
    
    // After: joined
    const totalW = w1 + w2;
    for(let i=0; i<totalW; i++){
      for(let j=0; j<h; j++){
        shadedAfter.push([1 + i, h + 3 + j]);
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: totalW + 5, rows: h * 2 + 5 },
        unitLabel: `1 ${unit}`,
        figures: [
          { label: "Before", labelPos: {x: totalW / 2 + 1.5, y: h + 1.5}, shadedSquares: shadedBefore },
          { label: "After Joining", labelPos: {x: totalW / 2 + 1, y: h * 2 + 3.5}, color: "#fef08a", shadedSquares: shadedAfter }
        ]
      }
    });

    let askText = `A rectangular block has a perimeter of ${individualP1} ${unit}. Another different sized rectangular block has a perimeter of ${individualP2} ${unit}. They are joined end-to-end sharing a side of length ${h} ${unit}. What is the perimeter of the new joined shape?`;
    let finalAnswer = `${combinedP}`;
    let sysSolutionSteps = `"""1. The perimeters of the blocks are ${individualP1} and ${individualP2}. The total perimeter before joining is ${individualP1 + individualP2}.\\n2. When they join along the side of length ${h}, two sides touch and 'disappear' into the inside.\\n3. Subtract the two hidden sides: ${individualP1 + individualP2} - ${h} - ${h} = ${combinedP}.\\n4. The new perimeter is ${combinedP} ${unit}."""`;

    if (isShort) {
      askText = `Two rectangles with perimeters of ${individualP1} ${unit} and ${individualP2} ${unit} are joined along a side of length ${h} ${unit}. What is the new perimeter?`;
    } else if (isMCQ) {
      askText = `Two rectangles with perimeters of ${individualP1} ${unit} and ${individualP2} ${unit} are joined along a side of length ${h} ${unit}. What is the new perimeter?`;
      finalAnswer = `${combinedP} ${unit}`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the combined perimeter before they touch:", expectedAnswer: `${individualP1} + ${individualP2} = ${individualP1 + individualP2}`, acceptedAnswers: [] },
          { label: "Write the working equation to subtract the two hidden sides where they join:", expectedAnswer: `${individualP1 + individualP2} - ${h} - ${h} = ${combinedP}`, acceptedAnswers: [`${individualP1 + individualP2} - ${h*2} = ${combinedP}`] },
          { label: "When the shapes are joined, does their total area just add up?", expectedAnswer: "Yes", acceptedAnswers: ["yes", "yep"] },
          { label: "When the shapes are joined, does their total perimeter just add up?", expectedAnswer: "No", acceptedAnswers: ["no", "nope"] },
          { label: "New perimeter:", expectedAnswer: `${combinedP} ${unit}`, acceptedAnswers: [] }
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
- For content.hint, use: "When shapes are joined, the edges that touch are no longer part of the outside perimeter."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${individualP1 + individualP2} ${unit}"
- "${individualP1 + individualP2 - h} ${unit}"
- "${combinedP + h} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'advanced_border_problem') {
    const wOut = getRandomInt(5, 7);
    const hOut = getRandomInt(4, 6);
    const wIn = getRandomInt(2, 3);
    const hIn = getRandomInt(2, 3);
    
    const areaOut = wOut * hOut;
    const areaIn = wIn * hIn;
    const borderArea = areaOut - areaIn;

    // Build shaded squares with a hole
    let shaded = [];
    const offsetX = Math.floor((wOut - wIn)/2);
    const offsetY = Math.floor((hOut - hIn)/2);
    
    for(let i=0; i<wOut; i++) {
      for(let j=0; j<hOut; j++) {
        const isHole = (i >= offsetX && i < offsetX + wIn) && (j >= offsetY && j < offsetY + hIn);
        if (!isHole) {
          shaded.push([1 + i, 1 + j]);
        }
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: wOut + 2, rows: hOut + 2 },
        unitLabel: `1 m`,
        figures: [{ shadedSquares: shaded }]
      }
    });

    let askText = `A garden is ${wOut} m long and ${hOut} m wide. In the center, there is a ${wIn} m by ${hIn} m pond. Find the area of the grass surrounding the pond.`;
    let finalAnswer = `${borderArea}`;
    let sysSolutionSteps = `"""1. Count the squares for the whole garden (${areaOut}).\\n2. Count the squares for the pond inside (${areaIn}).\\n3. Subtract the pond from the total area to find the grass border: ${areaOut} - ${areaIn} = ${borderArea}.\\n4. The area of the grass is ${borderArea} square metres."""`;

    if (isShort) {
      askText = `A ${wOut}×${hOut} grid has a ${wIn}×${hIn} hole in the center. Find the area of the border.`;
    } else if (isMCQ) {
      askText = `What is the area of a ${wOut}m by ${hOut}m garden with a ${wIn}m by ${hIn}m empty pond inside?`;
      finalAnswer = `${borderArea} m²`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Number of squares counted for the whole garden:", expectedAnswer: `${areaOut}`, acceptedAnswers: [] },
            { label: "Number of squares counted for the pond:", expectedAnswer: `${areaIn}`, acceptedAnswers: [] },
          { label: "Write the working equation to find the area of the grass (border):", expectedAnswer: `${areaOut} - ${areaIn} = ${borderArea}`, acceptedAnswers: [] },
          { label: "Area of the grass:", expectedAnswer: `${borderArea} \\text{m}^2`, acceptedAnswers: [`${borderArea} m^2`, `${borderArea} sq m`, `${borderArea} square metres`, `${borderArea} square meters`] }
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
- For content.hint, use: "Subtract the area of the inner hole from the area of the large outer shape."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${areaOut} m²"
- "${areaOut + areaIn} m²"
- "${borderArea + 2} m²"` : ''}
`;
  }
  else if (activeVariant === 'advanced_cost_multiplier') {
    const numSides = getRandomInt(3, 6);
    const knownSides = [];
    let perimeter = 0;
    for (let i = 0; i < numSides; i++) {
      const s = getRandomInt(4, 10);
      knownSides.push(s);
      perimeter += s;
    }
    const costPerUnit = getRandomInt(3, 8);
    const totalCost = perimeter * costPerUnit;
    const unit = "m";

    // Generate convex polygon vertices with minimum separation
    const angles = [];
    const sector = (Math.PI * 2) / numSides;
    for (let i = 0; i < numSides; i++) {
      const margin = 0.3; // minimum separation margin
      const minAngle = i * sector + margin;
      const maxAngle = (i + 1) * sector - margin;
      angles.push(minAngle + Math.random() * (maxAngle - minAngle));
    }
    
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
    const sideObjects = [...knownSides.map(s => ({ val: s }))];
    sideObjects.sort((a, b) => a.val - b.val);

    const edgeLabels = new Array(numSides);
    for (let i = 0; i < numSides; i++) {
      const e = visualEdges[i];
      const s = sideObjects[i];
      edgeLabels[e.index] = `${s.val} ${unit}`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: vertices,
        edgeLabels: edgeLabels
      }
    });

    let knownSidesText = "";
    const displaySides = [...knownSides];
    const last = displaySides.pop();
    knownSidesText = `${displaySides.map(s => `${s} ${unit}`).join(', ')}, and ${last} ${unit}`;

    const perimeterEq = knownSides.join(' + ') + ` = ${perimeter}`;

    let askText = `Mr. Lim wants to build a fence around his garden. The sides of the garden are ${knownSidesText}. The fencing material costs $${costPerUnit} for every metre. How much will he pay in total?`;
    let finalAnswer = `$${totalCost}`;
    let sysSolutionSteps = `"""1. Find the total perimeter of the garden: ${perimeterEq} ${unit}.\\n2. Multiply the perimeter by the cost per metre: ${perimeter} x ${costPerUnit} = ${totalCost}.\\n3. He will pay $${totalCost}."""`;

    if (isShort) {
      askText = `A garden has sides of ${knownSidesText}. Fencing costs $${costPerUnit} per metre. Find the total cost to fence it.`;
      finalAnswer = `${totalCost}`; // Without $ for short answer logic
    } else if (isMCQ) {
      askText = `A garden has sides of ${knownSidesText}. Fencing costs $${costPerUnit} per metre. What is the total cost?`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the total perimeter of the garden:", expectedAnswer: `${perimeterEq}`, acceptedAnswers: [] },
          { label: "Write the working equation to find the total cost of the fence:", expectedAnswer: `${perimeter} x ${costPerUnit} = ${totalCost}`, acceptedAnswers: [`${costPerUnit} x ${perimeter} = ${totalCost}`] },
          { label: "Total cost:", expectedAnswer: `$${totalCost}`, acceptedAnswers: [] }
        ]
      });
      finalAnswer = `${totalCost}`;
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
- For content.hint, use: "First find the total perimeter length, then multiply by the cost per metre."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "$${(perimeter * 2) * costPerUnit}"
- "$${perimeter + costPerUnit}"
- "$${totalCost - costPerUnit}"` : ''}
`;
  }
  else if (activeVariant === 'advanced_max_min_perimeter') {
    const areasData = [
      { area: 12, maxDim: [12, 1], maxP: 26, minDim: [4, 3], minP: 14 },
      { area: 16, maxDim: [16, 1], maxP: 34, minDim: [4, 4], minP: 16 },
      { area: 24, maxDim: [24, 1], maxP: 50, minDim: [6, 4], minP: 20 }
    ];
    const data = areasData[getRandomInt(0, areasData.length - 1)];
    const isMax = Math.random() < 0.5;
    const targetType = isMax ? "longest" : "shortest";
    const targetDim = isMax ? data.maxDim : data.minDim;
    const targetP = isMax ? data.maxP : data.minP;

    visualEngineStr = JSON.stringify({
      componentToRender: "AREA_PERIMETER_EXPLORER",
      componentData: {
        area: data.area,
        startDim: [Math.round(Math.sqrt(data.area)), Math.round(data.area / Math.round(Math.sqrt(data.area)))], // Start with roughly a square to make it interesting
        targetType: targetType
      }
    });

    let askText = `Sarah has ${data.area} square tiles (1 cm² each). She wants to arrange them into a rectangle that gives her the ${targetType} possible perimeter. What is the length, width, and perimeter of this rectangle?`;
    let finalAnswer = `${targetP}`;
    let sysSolutionSteps = `"""1. To get the ${targetType} perimeter, the rectangle must be as ${isMax ? "long and thin" : "close to a square"} as possible.\\n2. The dimensions will be ${targetDim[0]} cm by ${targetDim[1]} cm.\\n3. Perimeter = ${targetDim[0]} + ${targetDim[1]} + ${targetDim[0]} + ${targetDim[1]} = ${targetP} cm."""`;

    if (isShort) {
      askText = `Draw a rectangle with an area of ${data.area} cm² that has the ${targetType} possible perimeter. What is that perimeter?`;
    } else if (isMCQ) {
      askText = `Which dimensions for an area of ${data.area} cm² give the ${targetType} perimeter?`;
      finalAnswer = `${targetDim[0]}x${targetDim[1]}`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Write the dimensions (length and width) that make the ${targetType} shape (format: length and width):`, expectedAnswer: `${targetDim[0]} and ${targetDim[1]}`, acceptedAnswers: [`${targetDim[1]} and ${targetDim[0]}`] },
          { label: "Write the working equation to find the perimeter of this arrangement:", expectedAnswer: `${targetDim[0]} + ${targetDim[1]} + ${targetDim[0]} + ${targetDim[1]} = ${targetP}`, acceptedAnswers: [`${targetDim[1]} + ${targetDim[0]} + ${targetDim[1]} + ${targetDim[0]} = ${targetP}`, `(${targetDim[0]} + ${targetDim[1]}) * 2 = ${targetP}`, `(${targetDim[1]} + ${targetDim[0]}) * 2 = ${targetP}`] },
          { label: `${targetType.charAt(0).toUpperCase() + targetType.slice(1)} possible perimeter:`, expectedAnswer: `${targetP} cm`, acceptedAnswers: [] }
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
- For content.hint, use: "To ${isMax ? "maximize" : "minimize"} perimeter with a fixed area, make the rectangle as ${isMax ? "long and narrow" : "close to a square"} as possible."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${isMax ? data.minDim.join('x') : data.maxDim.join('x')}"
- "${data.area / 2}x2"
- "${data.area}x2"` : ''}
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
