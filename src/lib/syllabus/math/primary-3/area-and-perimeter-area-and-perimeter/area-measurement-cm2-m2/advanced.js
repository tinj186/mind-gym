import { getRandomNames, getRandomCountableItems, getRandomLocations } from '../../../../../utils/variable-bank.js';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (activeVariant === 'advanced_3_part_comparison') {
    const unit = Math.random() < 0.5 ? "cm" : "m";
    const mode = getRandomInt(1, 4); // 1 to 4
    const names = getRandomNames(3);
    const nA = names[0];
    const nB = names[1];
    const nC = names[2];

    const areaA = getRandomInt(10, 20);
    const diff1 = getRandomInt(4, 10);
    const diff2 = getRandomInt(2, 6);

    // A -> B (B is larger than A)
    const areaB = areaA + diff1;
    // B -> C (C is smaller than B)
    const areaC = areaB - diff2;
    const totalArea = areaA + areaB + areaC;

    let askText = "";
    let finalAnswer = "";
    let sysSolutionSteps = "";
    let displayA = "?";
    let displayB = "?";
    let displayC = "?";
    let hint = "";

    // Determine knowns based on mode
    if (mode === 1) { // Forward to Total
      displayA = `${areaA}`;
      askText = `STORY: ${nA}'s poster has an area of ${areaA} ${unit}². ${nB}'s poster has an area ${diff1} ${unit}² larger than ${nA}'s. ${nC}'s poster has an area ${diff2} ${unit}² smaller than ${nB}'s. What is the total area of all three posters?`;
      finalAnswer = `${totalArea} ${unit}²`;
      sysSolutionSteps = `"""1. Find the area of ${nB}'s poster: ${areaA} + ${diff1} = ${areaB}.\\n2. Find the area of ${nC}'s poster: ${areaB} - ${diff2} = ${areaC}.\\n3. Find the total area: ${areaA} + ${areaB} + ${areaC} = ${totalArea}.\\n4. The total area is ${totalArea} ${unit}²."""`;
      hint = `Find the area of the second figure, then the third, and read carefully what you need to find.`;
    } else if (mode === 2) { // Forward to Target C
      displayA = `${areaA}`;
      askText = `STORY: ${nA}'s rug is ${areaA} ${unit}². ${nB}'s rug is ${diff1} ${unit}² larger than ${nA}'s. ${nC}'s rug is ${diff2} ${unit}² smaller than ${nB}'s. What is the area of ${nC}'s rug?`;
      finalAnswer = `${areaC} ${unit}²`;
      sysSolutionSteps = `"""1. Find the area of ${nB}'s rug: ${areaA} + ${diff1} = ${areaB}.\\n2. Find the area of ${nC}'s rug: ${areaB} - ${diff2} = ${areaC}.\\n3. The area of ${nC}'s rug is ${areaC} ${unit}²."""`;
      hint = `Find the area of the second figure, then the third.`;
    } else if (mode === 3) { // Backward to Target A
      displayC = `${areaC}`;
      askText = `STORY: ${nC} painted a mural with an area of ${areaC} ${unit}². ${nC}'s mural is ${diff2} ${unit}² smaller than ${nB}'s mural. ${nB}'s mural is ${diff1} ${unit}² larger than ${nA}'s mural. What is the area of ${nA}'s mural?`;
      finalAnswer = `${areaA} ${unit}²`;
      sysSolutionSteps = `"""1. Work backwards to find ${nB}'s mural: ${areaC} + ${diff2} = ${areaB}.\\n2. Work backwards to find ${nA}'s mural: ${areaB} - ${diff1} = ${areaA}.\\n3. The area of ${nA}'s mural is ${areaA} ${unit}²."""`;
      hint = `Work backwards. If the third is smaller than the second, add to find the second.`;
    } else { // Backward to Total
      displayC = `${areaC}`;
      askText = `STORY: ${nC} bought a carpet with an area of ${areaC} ${unit}². ${nC}'s carpet is ${diff2} ${unit}² smaller than ${nB}'s. ${nB}'s carpet is ${diff1} ${unit}² larger than ${nA}'s carpet. What is the total area of all three carpets?`;
      finalAnswer = `${totalArea} ${unit}²`;
      sysSolutionSteps = `"""1. Work backwards to find ${nB}'s carpet: ${areaC} + ${diff2} = ${areaB}.\\n2. Work backwards to find ${nA}'s carpet: ${areaB} - ${diff1} = ${areaA}.\\n3. Find the total area: ${areaA} + ${areaB} + ${areaC} = ${totalArea}.\\n4. The total area is ${totalArea} ${unit}²."""`;
      hint = `Work backwards to find the second and first areas, then add all three together.`;
    }

    if (isShort || isMCQ) {
      if (mode === 1 || mode === 4) {
        askText = `Based on the model, find the total area.`;
      } else if (mode === 2) {
        askText = `Based on the model, find the area of ${nC}'s item.`;
      } else {
        askText = `Based on the model, find the area of ${nA}'s item.`;
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: [
          {
            isStatic: true,
            modelType: 'COMPARISON',
            bars: [
              { layoutSize: areaA, segments: 1, value: areaA, name: nA, displayValue: displayA, difference: { displayValue: `${diff1}` } },
              { layoutSize: areaB, segments: 1, value: areaB, name: nB, displayValue: displayB },
              { layoutSize: areaC, segments: 1, value: areaC, name: nC, displayValue: displayC, difference: { displayValue: `${diff2}` } }
            ]
          }
        ]
      }
    });

    if (isStructure) {
      let steps = [];
      if (mode === 1) {
        steps = [
          { label: `Write the working equation to find the area for ${nB}:`, expectedAnswer: `${areaA} + ${diff1} = ${areaB}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the area for ${nC}:`, expectedAnswer: `${areaB} - ${diff2} = ${areaC}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the total area:`, expectedAnswer: `${areaA} + ${areaB} + ${areaC} = ${totalArea}`, acceptedAnswers: [] },
          { label: `Total area:`, expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}`] }
        ];
      } else if (mode === 2) {
        steps = [
          { label: `Write the working equation to find the area for ${nB}:`, expectedAnswer: `${areaA} + ${diff1} = ${areaB}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the area for ${nC}:`, expectedAnswer: `${areaB} - ${diff2} = ${areaC}`, acceptedAnswers: [] },
          { label: `Area for ${nC}:`, expectedAnswer: `${areaC} ${unit}²`, acceptedAnswers: [`${areaC}`] }
        ];
      } else if (mode === 3) {
        steps = [
          { label: `Write the working equation to find the area for ${nB}:`, expectedAnswer: `${areaC} + ${diff2} = ${areaB}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the area for ${nA}:`, expectedAnswer: `${areaB} - ${diff1} = ${areaA}`, acceptedAnswers: [] },
          { label: `Area for ${nA}:`, expectedAnswer: `${areaA} ${unit}²`, acceptedAnswers: [`${areaA}`] }
        ];
      } else {
        steps = [
          { label: `Write the working equation to find the area for ${nB}:`, expectedAnswer: `${areaC} + ${diff2} = ${areaB}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the area for ${nA}:`, expectedAnswer: `${areaB} - ${diff1} = ${areaA}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the total area:`, expectedAnswer: `${areaA} + ${areaB} + ${areaC} = ${totalArea}`, acceptedAnswers: [] },
          { label: `Total area:`, expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}`] }
        ];
      }

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: steps
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
- For content.hint, use: "${hint}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${mode === 1 || mode === 4 ? totalArea - diff2 : (mode === 2 ? areaC + diff2 : areaA + diff1)} ${unit}²"
- "${mode === 1 || mode === 4 ? totalArea + diff1 : (mode === 2 ? areaA : areaC)} ${unit}²"
- "${mode === 1 || mode === 4 ? areaB : totalArea} ${unit}²"` : ''}
`;
  }
  else if (activeVariant === 'advanced_mixed_halves_cutouts') {
    const unit = Math.random() < 0.5 ? "cm" : "m";

    let shadedSquares = [];
    let halfShadedSquares = [];

    // Procedural Shape Generation Algorithm
    const W = getRandomInt(4, 6);
    const H = getRandomInt(4, 5);
    const startX = 2;
    const startY = 2;

    let S = new Set();
    let interior = [];
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        const pt = `${startX + x},${startY + y}`;
        S.add(pt);
        if (x > 0 && x < W - 1 && y > 0 && y < H - 1) {
          interior.push(pt);
        }
      }
    }

    // Punch random strictly interior cutouts
    let cutouts = 0;
    const targetCutouts = getRandomInt(1, Math.min(3, interior.length));
    interior.sort(() => 0.5 - Math.random()).slice(0, targetCutouts).forEach(pt => {
      S.delete(pt);
      cutouts++;
    });

    // Randomly carve corners to make it an irregular complex polygon
    const corners = [
      `${startX},${startY}`, `${startX + W - 1},${startY}`,
      `${startX},${startY + H - 1}`, `${startX + W - 1},${startY + H - 1}`
    ];
    corners.sort(() => 0.5 - Math.random()).slice(0, getRandomInt(1, 3)).forEach(c => S.delete(c));

    // Find valid edge attachment points for half-squares
    let candidateMap = new Map();
    const dirs = [[0, -1, 'bottom'], [0, 1, 'top'], [-1, 0, 'right'], [1, 0, 'left']];
    S.forEach(pt => {
      const [x, y] = pt.split(',').map(Number);
      dirs.forEach((dir) => {
        const dx = dir[0];
        const dy = dir[1];
        const attachment = dir[2];
        const npt = `${x + dx},${y + dy}`;
        // If the neighbor is empty, it's a potential attachment point
        if (!S.has(npt)) {
          if (!candidateMap.has(npt)) candidateMap.set(npt, []);
          candidateMap.get(npt).push(attachment);
        }
      });
    });

    // Only use empty cells that strictly touch exactly ONE solid edge to ensure clean triangles
    let validCandidates = [];
    candidateMap.forEach((attachments, pt) => {
      if (attachments.length === 1) validCandidates.push({ pt, attachment: attachments[0] });
    });

    // Attach half squares
    let halves = 0;
    const targetHalves = getRandomInt(2, 4) * 2;
    validCandidates.sort(() => 0.5 - Math.random()).slice(0, targetHalves).forEach(cand => {
      const [x, y] = cand.pt.split(',').map(Number);
      let type = '';
      const r = Math.random();
      // Orient the triangle hypotenuse dynamically based on the edge it attaches to
      if (cand.attachment === 'bottom') type = r < 0.5 ? 'bottom-left' : 'bottom-right';
      else if (cand.attachment === 'top') type = r < 0.5 ? 'top-left' : 'top-right';
      else if (cand.attachment === 'right') type = r < 0.5 ? 'top-right' : 'bottom-right';
      else type = r < 0.5 ? 'top-left' : 'bottom-left';

      halfShadedSquares.push({ x, y, type });
      halves++;
    });

    // Ensure halves count is an even number
    if (halves % 2 !== 0 && halves > 0) {
      halfShadedSquares.pop();
      halves--;
    }

    // Convert Set back to array for the visual engine
    S.forEach(pt => {
      const [x, y] = pt.split(',').map(Number);
      shadedSquares.push([x, y]);
    });

    const full = shadedSquares.length;

    const area = full + (halves / 2) - cutouts;

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols: 10, rows: 8 },
        unitLabel: `1 ${unit}`,
        figures: [{ shadedSquares, halfShadedSquares }]
      }
    });

    let askText = `The shaded figure on the 1 ${unit} grid is a complex shape. Calculate the total area carefully. It has ${full} full squares, ${halves} half-squares, and ${cutouts} empty spaces inside that must be subtracted from the full squares.`;
    let finalAnswer = `${area} ${unit}²`;
    let sysSolutionSteps = `"""1. Number of full squares: ${full}.\\n2. Group the half-squares into wholes: ${halves} / 2 = ${halves / 2}.\\n3. Subtract the empty spaces: ${full} - ${cutouts} = ${full - cutouts}.\\n4. Add everything together: ${full - cutouts} + ${halves / 2} = ${area}.\\n5. The total area is ${area} ${unit}²."""`;

    if (isShort) {
      askText = `Find the area of the shaded shape on the 1 ${unit} grid which has ${full} full squares, ${halves} half-squares, and ${cutouts} empty spaces inside.`;
    } else if (isMCQ) {
      askText = `A complex shape has ${full} wholes, ${halves} halves, and ${cutouts} empty spaces inside. Area?`;
    } else if (isStructure) {
      askText = `The shaded figure on the 1 ${unit} grid is a complex shape with ${full} full squares, ${halves} half-squares, and ${cutouts} empty squares. Calculate the total area carefully.`;
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Number of full squares:", expectedAnswer: `${full}`, acceptedAnswers: [] },
          { label: "Write the working equation to group the half-squares into wholes:", expectedAnswer: `${halves} / 2 = ${halves / 2}`, acceptedAnswers: [`${halves} \\\\div 2 = ${halves / 2}`] },
          { label: "Write the working equation to add the full and grouped squares together, subtracting the empty spaces:", expectedAnswer: `${full} + ${halves / 2} - ${cutouts} = ${area}`, acceptedAnswers: [] },
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
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
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
    
    const tileShapes = [ [1,2], [2,1], [2,2], [1,3], [3,1] ];
    const tileShape = tileShapes[getRandomInt(0, tileShapes.length - 1)];
    const tileW = tileShape[0];
    const tileH = tileShape[1];
    const unitArea = tileW * tileH;

    const WallW = tileW * getRandomInt(2, tileW > 1 ? 3 : 4);
    const WallH = tileH * getRandomInt(2, tileH > 1 ? 3 : 4);
    const totalArea = WallW * WallH;
    const tilesNeeded = totalArea / unitArea;

    let wallSquares = [];
    let tileSquares = [];

    // Place the Wall at x=1, y=1
    for (let i = 0; i < WallW; i++) {
        for (let j = 0; j < WallH; j++) {
            wallSquares.push([1 + i, 1 + j]);
        }
    }

    // Place the Tile to the right of the wall, with a gap of 2.
    const tileStartX = 1 + WallW + 2;
    const tileStartY = 2; // Offset by 1 row down to centerish
    for (let i = 0; i < tileW; i++) {
        for (let j = 0; j < tileH; j++) {
            tileSquares.push([tileStartX + i, tileStartY + j]);
        }
    }

    const cols = tileStartX + tileW + 1;
    const rows = Math.max(WallH + 1, tileStartY + tileH) + 2; // Extra room for labels at the bottom

    const person = getRandomNames(1)[0];
    const tileItems = ['tile', 'rug', 'mat', 'sticker', 'carpet square', 'wooden panel'];
    const item = tileItems[getRandomInt(0, tileItems.length - 1)];
    const place = getRandomLocations(1)[0];
    
    const wallLabel = `The ${place}`;
    const tileLabel = `1 ${item}`;

    visualEngineStr = JSON.stringify({
      componentToRender: "SQUARE_GRID_SHAPE",
      componentData: {
        gridSize: { cols, rows },
        unitLabel: `1 ${unit}`,
        figures: [
          { 
            shadedSquares: wallSquares,
            color: "#bfdbfe",
            label: wallLabel,
            labelPos: { x: 1 + WallW/2, y: 1 + WallH + 0.6 } // Positioned below the wall
          },
          { 
            shadedSquares: tileSquares,
            color: "#fbcfe8",
            label: tileLabel,
            labelPos: { x: tileStartX + tileW/2, y: tileStartY + tileH + 0.6 } // Positioned below the tile
          }
        ]
      }
    });

    let askText = `STORY: ${person} wants to cover the ${place} with ${item}s. Look at the grid to find the area of the ${place} and the area of 1 ${item}. How many ${item}s does ${person} need to completely cover the ${place}?`;
    let finalAnswer = `${tilesNeeded}`;
    let sysSolutionSteps = `"""1. Count the area of the ${place}: ${totalArea} ${unit}².\\n2. Count the area of 1 ${item}: ${unitArea} ${unit}².\\n3. Divide the total area by the area of 1 ${item}.\\n4. ${totalArea} / ${unitArea} = ${tilesNeeded}.\\n5. ${person} needs ${tilesNeeded} ${item}s."""`;

    if (isShort) {
      askText = `Look at the grid. How many of the small shapes are needed to completely cover the large shape?`;
    } else if (isMCQ) {
      askText = `Look at the grid. How many ${item}s are needed to cover the ${place}?`;
    } else if (isStructure) {
      askText = `STORY: ${person} wants to cover the ${place} with ${item}s. Look at the grid to find the area of the ${place} and the area of 1 ${item}. How many ${item}s does ${person} need to completely cover the ${place}?`;
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Area of the ${place}:`, expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}`] },
          { label: `Area of 1 ${item}:`, expectedAnswer: `${unitArea} ${unit}²`, acceptedAnswers: [`${unitArea}`] },
          { label: `Write the working equation to find how many ${item}s are needed (Area of ${place} ÷ Area of 1 ${item}):`, expectedAnswer: `${totalArea} / ${unitArea} = ${tilesNeeded}`, acceptedAnswers: [`${totalArea} \\\\div ${unitArea} = ${tilesNeeded}`] },
          { label: `Number of ${item}s needed:`, expectedAnswer: `${tilesNeeded}`, acceptedAnswers: [] }
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
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "Count the area of the ${place}, count the area of the ${item}, and then divide."
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

    const person = getRandomNames(1)[0];
    const place = getRandomLocations(1)[0];
    const surfaces = ['grass', 'carpet', 'artificial turf', 'wooden flooring', 'new tiles'];
    const surface = surfaces[getRandomInt(0, surfaces.length - 1)];

    const mode = getRandomInt(1, 3);

    let parts = [];
    let wholeStr = "";
    let askText = "";
    let finalAnswer = "";
    let sysSolutionSteps = "";

    if (mode === 1) { // Forward to Cost
      parts = [
        { segments: 1, value: areaA, label: `Patch 1: ${areaA}`, bgClass: 'bg-blue-500 text-white' },
        { segments: 1, value: areaB, label: `Patch 2: ${areaB}`, bgClass: 'bg-green-500 text-white' }
      ];
      wholeStr = "?";
      
      askText = `STORY: ${person} wants to put ${surface} on two patches of ground at the ${place}. The first patch has an area of ${areaA} ${unit}² and the second patch has an area of ${areaB} ${unit}². The ${surface} costs $${costPerUnit} for every 1 ${unit}². How much will the ${surface} cost in total?`;
      finalAnswer = `$${totalCost}`;
      sysSolutionSteps = `"""1. Find the total area: ${areaA} + ${areaB} = ${totalArea} ${unit}².\\n2. Multiply the total area by the cost per square unit: ${totalArea} x ${costPerUnit} = ${totalCost}.\\n3. The total cost is $${totalCost}."""`;
      
      if (isShort) {
        askText = `Patch 1 is ${areaA} ${unit}² and Patch 2 is ${areaB} ${unit}². Material costs $${costPerUnit} per 1 ${unit}². Total cost?`;
      } else if (isMCQ) {
        askText = `Patch 1: ${areaA} ${unit}². Patch 2: ${areaB} ${unit}². Cost: $${costPerUnit}/1 ${unit}². Total cost?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the total area:", expectedAnswer: `${areaA} + ${areaB} = ${totalArea}`, acceptedAnswers: [`${areaB} + ${areaA} = ${totalArea}`] },
            { label: "Write the working equation to find the total cost:", expectedAnswer: `${totalArea} x ${costPerUnit} = ${totalCost}`, acceptedAnswers: [`${totalArea} * ${costPerUnit} = ${totalCost}`] },
            { label: "Total cost in dollars:", expectedAnswer: `${totalCost}`, acceptedAnswers: [`$${totalCost}`] }
          ]
        });
      }
    } 
    else if (mode === 2) { // Backward to Area B
      parts = [
        { segments: 1, value: areaA, label: `Patch 1: ${areaA}`, bgClass: 'bg-blue-500 text-white' },
        { segments: 1, value: areaB, label: `Patch 2: ?`, bgClass: 'bg-green-500 text-white' }
      ];
      wholeStr = `Total Cost: $${totalCost}`;

      askText = `STORY: ${person} puts ${surface} on two patches of ground at the ${place}. The first patch has an area of ${areaA} ${unit}². The ${surface} costs $${costPerUnit} for every 1 ${unit}², and ${person} pays $${totalCost} in total for both patches. What is the area of the second patch?`;
      finalAnswer = `${areaB} ${unit}²`;
      sysSolutionSteps = `"""1. Find the total area by dividing the total cost by the cost per unit: ${totalCost} / ${costPerUnit} = ${totalArea} ${unit}².\\n2. Subtract the first patch to find the second patch: ${totalArea} - ${areaA} = ${areaB}.\\n3. The second patch is ${areaB} ${unit}²."""`;

      if (isShort) {
        askText = `Material costs $${costPerUnit} per 1 ${unit}². Total cost is $${totalCost}. If Patch 1 is ${areaA} ${unit}², what is the area of Patch 2?`;
      } else if (isMCQ) {
        askText = `Total cost: $${totalCost} at $${costPerUnit}/1 ${unit}². Patch 1: ${areaA} ${unit}². Area of Patch 2?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the total area of both patches (Total Cost ÷ Cost per Unit):", expectedAnswer: `${totalCost} / ${costPerUnit} = ${totalArea}`, acceptedAnswers: [`${totalCost} \\\\div ${costPerUnit} = ${totalArea}`] },
            { label: "Write the working equation to find the area of the second patch:", expectedAnswer: `${totalArea} - ${areaA} = ${areaB}`, acceptedAnswers: [] },
            { label: "Area of the second patch:", expectedAnswer: `${areaB} ${unit}²`, acceptedAnswers: [`${areaB}`] }
          ]
        });
      }
    }
    else { // Backward to Unit Cost
      parts = [
        { segments: 1, value: areaA, label: `Patch 1: ${areaA}`, bgClass: 'bg-blue-500 text-white' },
        { segments: 1, value: areaB, label: `Patch 2: ${areaB}`, bgClass: 'bg-green-500 text-white' }
      ];
      wholeStr = `Total Cost: $${totalCost}`;

      askText = `STORY: ${person} puts ${surface} on two patches of ground at the ${place}. The first patch has an area of ${areaA} ${unit}² and the second patch is ${areaB} ${unit}². The total cost for the ${surface} is $${totalCost}. How much does the ${surface} cost for every 1 ${unit}²?`;
      finalAnswer = `$${costPerUnit}`;
      sysSolutionSteps = `"""1. Find the total area: ${areaA} + ${areaB} = ${totalArea} ${unit}².\\n2. Divide the total cost by the total area to find the unit cost: ${totalCost} / ${totalArea} = ${costPerUnit}.\\n3. It costs $${costPerUnit} per 1 ${unit}²."""`;

      if (isShort) {
        askText = `Patch 1 is ${areaA} ${unit}² and Patch 2 is ${areaB} ${unit}². Total cost is $${totalCost}. Cost per 1 ${unit}²?`;
      } else if (isMCQ) {
        askText = `Patch 1: ${areaA} ${unit}². Patch 2: ${areaB} ${unit}². Total Cost: $${totalCost}. Cost per 1 ${unit}²?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the total area:", expectedAnswer: `${areaA} + ${areaB} = ${totalArea}`, acceptedAnswers: [`${areaB} + ${areaA} = ${totalArea}`] },
            { label: "Write the working equation to find the cost for 1 square unit (Total Cost ÷ Total Area):", expectedAnswer: `${totalCost} / ${totalArea} = ${costPerUnit}`, acceptedAnswers: [`${totalCost} \\\\div ${totalArea} = ${costPerUnit}`] },
            { label: "Cost per 1 square unit:", expectedAnswer: `$${costPerUnit}`, acceptedAnswers: [`${costPerUnit}`] }
          ]
        });
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        isStatic: true,
        modelType: 'PART_WHOLE',
        parts: parts,
        whole: wholeStr
      }
    });

    let hintText = "";
    let distractors = [];

    if (mode === 1) {
      hintText = "Find the total area first, then multiply it by the cost per unit.";
      distractors = [`$${(areaA + areaB) + costPerUnit}`, `$${(areaA * costPerUnit) + areaB}`, `$${totalCost + costPerUnit}`];
    } else if (mode === 2) {
      hintText = "Divide the total cost by the cost per unit to find the total area, then subtract.";
      distractors = [`${totalArea} ${unit}²`, `${areaA} ${unit}²`, `${areaB + 2} ${unit}²`];
    } else {
      hintText = "Find the total area first, then divide the total cost by the total area.";
      distractors = [`$${costPerUnit + 2}`, `$${Math.abs(totalCost - totalArea)}`, `$${Math.abs(totalCost - areaA)}`];
    }

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "${hintText}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${distractors[0]}"
- "${distractors[1]}"
- "${distractors[2]}"` : ''}
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
