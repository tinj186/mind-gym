import { getRandomNames } from '../../../../../utils/variable-bank.js';

export const advancedLogic = (variant, isMCQ, isShort, isStructure, getFormatInstructions) => {
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });
  let inputRequirementStr = "{}";
  let systemPrompt = "";

  const name = getRandomNames(1)[0];

  if (variant === 'advanced_grid_line_network') {
    const numLines = 5 + Math.floor(Math.random() * 2); // 5 or 6
    const lines = [];
    const slopes = [];
    
    // Procedurally generate lines with known slopes
    // Types: 0 (horiz), Infinity (vert), 1 (diag), -1 (diag neg), 2 (steep), -0.5 (shallow)
    const slopeTypes = [
      { s: 0, dx: 40, dy: 0 },
      { s: Infinity, dx: 0, dy: 40 },
      { s: 1, dx: 40, dy: -40 },
      { s: -1, dx: 40, dy: 40 },
      { s: 2, dx: 20, dy: -40 },
      { s: -0.5, dx: 40, dy: 20 }
    ];

    let parPairs = 0;
    let perpPairs = 0;

    // To ensure predictable properties, we pick a fixed set of slopes
    const chosenTypes = [];
    chosenTypes.push(slopeTypes[0], slopeTypes[0]); // 2 horizontals -> 1 parallel pair
    chosenTypes.push(slopeTypes[1]); // 1 vertical -> 2 perp pairs (with horiz)
    chosenTypes.push(slopeTypes[2], slopeTypes[3]); // slope 1 and -1 -> 1 perp pair
    if (numLines === 6) {
      chosenTypes.push(slopeTypes[2]); // Another slope 1 -> 1 more parallel pair, 1 more perp pair
    }

    parPairs = (numLines === 6) ? 2 : 1;
    perpPairs = (numLines === 6) ? 4 : 3;

    // Distribute them on a grid
    for(let i=0; i<numLines; i++) {
      const type = chosenTypes[i];
      const x0 = 20 + Math.random() * 80;
      const y0 = 20 + Math.random() * 80;
      lines.push({
        vertices: [{x: x0, y: y0}, {x: x0 + type.dx, y: y0 + type.dy}],
        isOpen: true, strokeColor: "#3b82f6", label: String.fromCharCode(65 + i)
      });
    }

    let askText = "";
    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A grid displays ${numLines} independent line segments labeled A to ${String.fromCharCode(64 + numLines)}. By inspecting their directions and slopes on the square grid, identify all pairs of parallel lines and all pairs of perpendicular lines. Calculate the difference between the total number of perpendicular pairs and parallel pairs."`;
      const stepsArr = [
        { label: "Visually check the grid. How many distinct pairs of parallel lines can you find?", expectedAnswer: String(parPairs), acceptedAnswers: [] },
        { label: "Visually check the grid. How many distinct pairs of perpendicular lines can you find?", expectedAnswer: String(perpPairs), acceptedAnswers: [] },
        { label: "Write the working equation to find the difference between the two totals:", expectedAnswer: `${perpPairs} - ${parPairs} = ${perpPairs - parPairs}`, acceptedAnswers: [] },
        { label: "Difference:", expectedAnswer: String(perpPairs - parPairs), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Line A has a slanted slope on the grid. Which pair of lines on the grid is perpendicular to each other?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the lines on the grid. How many distinct pairs of parallel lines are there in total?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: { polygons: lines, showGrid: true }
    });

    systemPrompt = `You are generating a Primary 3 Math question.
${getFormatInstructions(visualEngineStr, inputRequirementStr)}
Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${isMCQ ? "Line C and Line D" : isStructure ? perpPairs - parPairs : parPairs}
CRITICAL: Do not explain the math inside the questionText. Leave it as a puzzle for the student.`;

  } else if (variant === 'advanced_half_shape_reflection') {
    const names = ["symmetrical badge", "spaceship design", "robot head", "crown", "castle tower", "geometric trophy", "shield", "puzzle piece"];
    const shapeName = names[Math.floor(Math.random() * names.length)];
    
    const k = 1 + Math.floor(Math.random() * 4); // 1 to 4 vertical edges
    const originalVertices = [{x: 100, y: 20}];
    let currentY = 20;
    
    let lastX = 100;
    for (let i = 0; i < k; i++) {
      let nextX;
      do {
        nextX = 20 + Math.floor(Math.random() * 4) * 20; // 20, 40, 60, 80
      } while (nextX === lastX);
      
      // Horizontal move away from/towards mirror
      originalVertices.push({x: nextX, y: currentY});
      
      // Vertical move (parallel to mirror)
      const yStep = 20 + Math.floor(Math.random() * 2) * 20; // 20 or 40
      currentY += yStep;
      originalVertices.push({x: nextX, y: currentY});
      
      lastX = nextX;
    }
    // Final horizontal move back to mirror
    originalVertices.push({x: 100, y: currentY});

    const perpPairsAway = 2 * k;
    const parEdgesToMirror = k;

    const isHorizontalMirror = Math.random() > 0.5;
    
    // Transform vertices if horizontal mirror
    const transform = (v) => {
      if (isHorizontalMirror) {
        return { x: v.y, y: v.x };
      }
      return { x: v.x, y: v.y };
    };

    const finalVertices = originalVertices.map(transform);
    const mirrorAxis = isHorizontalMirror ? "horizontal" : "vertical";

    // Generate ghost vertices (reflection)
    const ghostVertices = finalVertices.map(v => {
      if (isHorizontalMirror) {
        return { x: v.x, y: 100 + (100 - v.y) };
      } else {
        return { x: 100 + (100 - v.x), y: v.y };
      }
    });

    const mirrorLine = isHorizontalMirror 
      ? [{x: 0, y: 100}, {x: 200, y: 100}]
      : [{x: 100, y: 0}, {x: 100, y: 200}];

    let askText = "";
    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The diagram shows half of a ${shapeName} resting against a dashed mirror line. By visually inspecting the half-shape, deduce the total number of perpendicular pairs on the completed ${shapeName} when fully reflected."`;
      const stepsArr = [
        { label: "Visually count the number of perpendicular corners on the half-shape (away from the mirror line):", expectedAnswer: `${perpPairsAway}`, acceptedAnswers: [] },
        { label: "When reflected, these corners are doubled. Write the working equation to find the total perpendicular pairs:", expectedAnswer: `${perpPairsAway} x 2 = ${perpPairsAway * 2}`, acceptedAnswers: [`2x${perpPairsAway}=${perpPairsAway * 2}`] },
        { label: `Total pairs of perpendicular lines on the completed ${shapeName}:`, expectedAnswer: `${perpPairsAway * 2}`, acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A half-polygon rests against a mirror line. By visually inspecting the half-shape, how many pairs of perpendicular lines will be formed on the outer boundary of the completed shape?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A half-shape rests against a ${mirrorAxis} mirror line. By visual inspection, how many pairs of perpendicular lines will the full shape have?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        polygons: [
          { vertices: finalVertices, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.1)" },
          { vertices: mirrorLine, isDashed: true, isOpen: true, strokeColor: "#475569" },
          { vertices: ghostVertices, isDashed: true, strokeColor: "#94a3b8", fillColor: "rgba(148, 163, 184, 0.05)" }
        ],
        showGrid: true
      }
    });

    systemPrompt = `You are generating a Primary 3 Math question.
${getFormatInstructions(visualEngineStr, inputRequirementStr)}
Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${perpPairsAway * 2}
CRITICAL: Do not explain the math inside the questionText. Leave it as a puzzle for the student.`;

  } else if (variant === 'advanced_composite_tangram') {
    // A standard Tangram set has 1 Square, 1 Parallelogram, and a limited number of Triangles.
    // The base shape is the 1 Square. We can only attach up to 2 small Triangles and 1 Parallelogram.
    const availablePieces = ["TRIANGLE", "TRIANGLE", "PARALLELOGRAM"];
    
    let topMut, rightMut, bottomMut, leftMut;
    let numTiles = 1;
    do {
      const shuffled = [...availablePieces].sort(() => Math.random() - 0.5);
      const edges = ["NONE", "NONE", "NONE", "NONE"];
      
      // Attach 2 or 3 pieces to the base square
      const numPiecesToAttach = 2 + Math.floor(Math.random() * 2); 
      for (let i = 0; i < numPiecesToAttach; i++) {
        edges[i] = shuffled[i];
      }
      
      // Randomly assign the pieces to the 4 edges
      edges.sort(() => Math.random() - 0.5);
      [topMut, rightMut, bottomMut, leftMut] = edges;
      
      numTiles = 1 + edges.filter(m => m !== "NONE").length;
    } while (numTiles < 3);

    const rawOuter = [];
    const internalSeams = [];

    // TOP EDGE (80,80 -> 120,80)
    rawOuter.push({x:80,y:80});
    if (topMut === "TRIANGLE") { rawOuter.push({x:100,y:60}); internalSeams.push([{x:80,y:80},{x:120,y:80}]); }
    else if (topMut === "SQUARE") { rawOuter.push({x:80,y:40}, {x:120,y:40}); internalSeams.push([{x:80,y:80},{x:120,y:80}]); }
    else if (topMut === "PARALLELOGRAM") { rawOuter.push({x:100,y:40}, {x:140,y:40}); internalSeams.push([{x:80,y:80},{x:120,y:80}]); }

    // RIGHT EDGE (120,80 -> 120,120)
    rawOuter.push({x:120,y:80});
    if (rightMut === "TRIANGLE") { rawOuter.push({x:140,y:100}); internalSeams.push([{x:120,y:80},{x:120,y:120}]); }
    else if (rightMut === "SQUARE") { rawOuter.push({x:160,y:80}, {x:160,y:120}); internalSeams.push([{x:120,y:80},{x:120,y:120}]); }
    else if (rightMut === "PARALLELOGRAM") { rawOuter.push({x:160,y:100}, {x:160,y:140}); internalSeams.push([{x:120,y:80},{x:120,y:120}]); }

    // BOTTOM EDGE (120,120 -> 80,120)
    rawOuter.push({x:120,y:120});
    if (bottomMut === "TRIANGLE") { rawOuter.push({x:100,y:140}); internalSeams.push([{x:120,y:120},{x:80,y:120}]); }
    else if (bottomMut === "SQUARE") { rawOuter.push({x:120,y:160}, {x:80,y:160}); internalSeams.push([{x:120,y:120},{x:80,y:120}]); }
    else if (bottomMut === "PARALLELOGRAM") { rawOuter.push({x:100,y:160}, {x:60,y:160}); internalSeams.push([{x:120,y:120},{x:80,y:120}]); }

    // LEFT EDGE (80,120 -> 80,80)
    rawOuter.push({x:80,y:120});
    if (leftMut === "TRIANGLE") { rawOuter.push({x:60,y:100}); internalSeams.push([{x:80,y:120},{x:80,y:80}]); }
    else if (leftMut === "SQUARE") { rawOuter.push({x:40,y:120}, {x:40,y:80}); internalSeams.push([{x:80,y:120},{x:80,y:80}]); }
    else if (leftMut === "PARALLELOGRAM") { rawOuter.push({x:40,y:100}, {x:40,y:60}); internalSeams.push([{x:80,y:120},{x:80,y:80}]); }

    // Clean up collinear points (merge adjacent collinear edges)
    const finalOuter = [];
    for (let i = 0; i < rawOuter.length; i++) {
      const pPrev = rawOuter[(i - 1 + rawOuter.length) % rawOuter.length];
      const pCurr = rawOuter[i];
      const pNext = rawOuter[(i + 1) % rawOuter.length];
      
      const dx1 = pCurr.x - pPrev.x;
      const dy1 = pCurr.y - pPrev.y;
      const dx2 = pNext.x - pCurr.x;
      const dy2 = pNext.y - pCurr.y;
      
      const cross = dx1 * dy2 - dy1 * dx2;
      const dot = dx1 * dx2 + dy1 * dy2;
      if (Math.abs(cross) < 0.001 && dot > 0) {
        continue; // skip collinear midpoint
      }
      finalOuter.push(pCurr);
    }

    const finalPolygons = [
      { vertices: finalOuter, strokeColor: "#2563eb", fillColor: "rgba(59, 130, 246, 0.1)", strokeWidth: 3 }
    ];

    internalSeams.forEach(seam => {
      finalPolygons.push({
        vertices: seam,
        isDashed: true, isOpen: true, strokeColor: "#94a3b8"
      });
    });

    let perpPairs = 0;
    let parPairs = 0;
    const edges = [];
    for (let i = 0; i < finalOuter.length; i++) {
      const p1 = finalOuter[i];
      const p2 = finalOuter[(i + 1) % finalOuter.length];
      edges.push({ dx: p2.x - p1.x, dy: p2.y - p1.y });
    }
    
    // Auto-calculate perpendicular adjacent corners
    for (let i = 0; i < edges.length; i++) {
      const e1 = edges[i];
      const e2 = edges[(i + 1) % edges.length];
      if (Math.abs(e1.dx * e2.dx + e1.dy * e2.dy) < 0.001) perpPairs++;
    }
    
    // Auto-calculate parallel edges on the boundary
    for (let i = 0; i < edges.length; i++) {
      for (let j = i + 1; j < edges.length; j++) {
        const cross = edges[i].dx * edges[j].dy - edges[i].dy * edges[j].dx;
        if (Math.abs(cross) < 0.001) parPairs++;
      }
    }

    const totalRelationships = perpPairs + parPairs;

    let askText = "";
    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Sarah fits ${numTiles} Tangram-style tiles together to build the composite shape shown. The internal cut lines are dashed, and the outer boundary is a solid blue line. By visually inspecting the solid outer boundary, calculate the sum of its parallel line pairs and perpendicular corners."`;
      const stepsArr = [
        { label: "Visually trace the solid outer boundary. How many pairs of parallel edges are there?", expectedAnswer: String(parPairs), acceptedAnswers: [] },
        { label: "Visually trace the solid outer boundary. How many perpendicular corners (right angles) are there?", expectedAnswer: String(perpPairs), acceptedAnswers: [] },
        { label: "Write the working equation to find the total sum:", expectedAnswer: `${parPairs} + ${perpPairs} = ${totalRelationships}`, acceptedAnswers: [`${perpPairs}+${parPairs}=${totalRelationships}`] },
        { label: "Total sum:", expectedAnswer: String(totalRelationships), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the composite shape built from ${numTiles} tiles. What is the total sum of parallel line pairs and perpendicular corners on its solid outer boundary?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A composite shape is formed by ${numTiles} tiles. What is the sum of parallel pairs and perpendicular corners on its solid outer boundary?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        polygons: finalPolygons,
        showGrid: false
      }
    });

    systemPrompt = `You are generating a Primary 3 Math question.
${getFormatInstructions(visualEngineStr, inputRequirementStr)}
Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${totalRelationships}
CRITICAL: Do not explain the math inside the questionText. Leave it as a puzzle for the student.`;

  } else if (variant === 'advanced_overlapping_rectilinear') {
    const generateCappedLines = () => {
      let current = 20 + Math.floor(Math.random() * 2) * 20; // start at 20 or 40
      const lines = [current];
      for (let i = 0; i < 3; i++) {
        current += (1 + Math.floor(Math.random() * 2)) * 20; // Add 20 or 40 width blocks
        lines.push(current);
      }
      return lines;
    };
    
    const xLines = generateCappedLines();
    const yLines = generateCappedLines();

    const configs = [
      {
        name: "L-shape",
        outerIdx: [[0,0], [1,0], [1,1], [2,1], [2,2], [0,2]],
        overlapIdx: [[0,1], [1,1], [1,2], [0,2]]
      },
      {
        name: "Plus-shape",
        outerIdx: [[1,0], [2,0], [2,1], [3,1], [3,2], [2,2], [2,3], [1,3], [1,2], [0,2], [0,1], [1,1]],
        overlapIdx: [[1,1], [2,1], [2,2], [1,2]]
      },
      {
        name: "T-shape",
        outerIdx: [[0,0], [3,0], [3,1], [2,1], [2,3], [1,3], [1,1], [0,1]],
        overlapIdx: [[1,0], [2,0], [2,1], [1,1]]
      },
      {
        name: "Stair-shape",
        outerIdx: [[1,0], [3,0], [3,2], [2,2], [2,3], [0,3], [0,1], [1,1]],
        overlapIdx: [[1,1], [2,1], [2,2], [1,2]]
      }
    ];

    const config = configs[Math.floor(Math.random() * configs.length)];
    let outer = config.outerIdx.map(idx => ({x: xLines[idx[0]], y: yLines[idx[1]]}));
    let overlap = config.overlapIdx.map(idx => ({x: xLines[idx[0]], y: yLines[idx[1]]}));

    const rotations = [0, 90, 180, 270];
    const rot = rotations[Math.floor(Math.random() * rotations.length)];
    
    // Rotate around bounding box center
    const minX = Math.min(...outer.map(p => p.x));
    const maxX = Math.max(...outer.map(p => p.x));
    const minY = Math.min(...outer.map(p => p.y));
    const maxY = Math.max(...outer.map(p => p.y));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const rotatePoint = (p) => {
      if (rot === 0) return {x: p.x, y: p.y};
      const dx = p.x - cx;
      const dy = p.y - cy;
      if (rot === 90) return {x: cx - dy, y: cy + dx};
      if (rot === 180) return {x: cx - dx, y: cy - dy};
      if (rot === 270) return {x: cx + dy, y: cy - dx};
    };

    outer = outer.map(rotatePoint);
    overlap = overlap.map(rotatePoint);

    // Calculate properties dynamically
    let perpPairs = 0;
    let parPairs = 0;
    let outwardCorners = 0;
    let inwardCorners = 0;
    
    const edges = [];
    for (let i = 0; i < outer.length; i++) {
      const p1 = outer[i];
      const p2 = outer[(i + 1) % outer.length];
      edges.push({ dx: p2.x - p1.x, dy: p2.y - p1.y });
    }
    
    for (let i = 0; i < edges.length; i++) {
      for (let j = i + 1; j < edges.length; j++) {
        const cross = edges[i].dx * edges[j].dy - edges[i].dy * edges[j].dx;
        if (Math.abs(cross) < 0.001) parPairs++;
      }
    }
    
    for (let i = 0; i < edges.length; i++) {
      const e1 = edges[i];
      const e2 = edges[(i + 1) % edges.length];
      const dot = e1.dx * e2.dx + e1.dy * e2.dy;
      const cross = e1.dx * e2.dy - e1.dy * e2.dx;
      
      if (Math.abs(dot) < 0.001) {
        perpPairs++;
        if (cross > 0) outwardCorners++; // Right turn (clockwise)
        else if (cross < 0) inwardCorners++; // Left turn (clockwise)
      }
    }

    const questionTypes = ["Q_OUTER", "Q_OVERLAP", "Q_CORNERS"];
    const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let askText = "";
    let finalAnswer = "";

    if (qType === "Q_OUTER") {
      finalAnswer = String(parPairs + perpPairs);
      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Two rectangular pieces of wood overlap on a grid to form the composite ${config.name} shown. By visually inspecting the solid outer boundary, calculate the sum of its parallel line pairs and perpendicular corners."`;
        const stepsArr = [
          { label: "Visually trace the solid outer boundary. How many pairs of parallel lines are there?", expectedAnswer: String(parPairs), acceptedAnswers: [] },
          { label: "Visually trace the solid outer boundary. How many perpendicular corners (right angles) are there?", expectedAnswer: String(perpPairs), acceptedAnswers: [] },
          { label: "Write the working equation to find the total sum:", expectedAnswer: `${parPairs} + ${perpPairs} = ${finalAnswer}`, acceptedAnswers: [`${perpPairs}+${parPairs}=${finalAnswer}`] },
          { label: "Total sum:", expectedAnswer: finalAnswer, acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Two rectangles overlap on a grid to form a ${config.name}. What is the total sum of parallel line pairs and perpendicular corners on its solid outer perimeter?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Two rectangles overlap on a grid. What is the sum of parallel pairs and perpendicular corners on the solid outer boundary?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    } else if (qType === "Q_OVERLAP") {
      finalAnswer = "2"; 
      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Two pieces of wood overlap on a grid to form the composite ${config.name} shown. The internal dashed lines show the exact area where the two pieces overlap. Focus ONLY on the dashed overlap region. How many pairs of parallel lines does the overlap region have?"`;
        const stepsArr = [
          { label: "What polygon shape is formed by the dashed overlap region?", expectedAnswer: "Rectangle", acceptedAnswers: ["Square", "Quadrilateral"] },
          { label: "How many pairs of parallel lines does this overlap region have?", expectedAnswer: finalAnswer, acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the dashed overlap region in the center of the shape. How many pairs of parallel lines does the overlap polygon have?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Focus on the dashed overlap region where the two shapes intersect. How many pairs of parallel lines are there in the overlap region?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    } else { 
      finalAnswer = String(outwardCorners + inwardCorners); 
      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Two rectangular pieces of wood overlap on a grid to form the composite ${config.name} shown. By inspecting the solid perimeter of the combined shape, count all the outward-pointing perpendicular corners and all the inward-pointing (re-entrant) perpendicular corners, then calculate the total."`;
        const stepsArr = [
          { label: "Visually count the outward-pointing perpendicular corners on the outer boundary:", expectedAnswer: String(outwardCorners), acceptedAnswers: [] },
          { label: "Visually count the inward-pointing perpendicular corners on the boundary:", expectedAnswer: String(inwardCorners), acceptedAnswers: [] },
          { label: "Total number of perpendicular corners:", expectedAnswer: finalAnswer, acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An L-shape or cross overlaps on a grid. What is the total sum of outward-pointing corners and inward-pointing corners on the merged boundary?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"What is the total sum of outward corners and inward corners on the solid outer perimeter?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        polygons: [
          { vertices: outer, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.1)" },
          { vertices: overlap, isDashed: true, strokeColor: "#94a3b8" }
        ],
        showGrid: true
      }
    });

    systemPrompt = `You are generating a Primary 3 Math question.
${getFormatInstructions(visualEngineStr, inputRequirementStr)}
Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${finalAnswer}
CRITICAL: Do not explain the math inside the questionText. Leave it as a puzzle for the student.`;

  } else {
    // advanced_grid_plotting_deduction
    const rotations = [0, 90, 180, 270];
    const rot = rotations[Math.floor(Math.random() * rotations.length)];
    const cx = 80;
    const cy = 80;
    
    const rotatePoint = (p) => {
      if (rot === 0) return {x: p.x, y: p.y};
      const dx = p.x - cx;
      const dy = p.y - cy;
      if (rot === 90) return {x: cx - dy, y: cy + dx};
      if (rot === 180) return {x: cx - dx, y: cy - dy};
      if (rot === 270) return {x: cx + dy, y: cy - dx};
    };

    const A = rotatePoint({x: 40, y: 40});
    const B = rotatePoint({x: 120, y: 40});
    const C = rotatePoint({x: 100, y: 100}); 
    
    // Four mathematically distinct candidates
    const D_both = {x: 40, y: 100};    // 1 par, 2 perp
    const D_parOnly = {x: 20, y: 100}; // 2 par, 0 perp (Parallelogram)
    const D_perpOnly = {x: 40, y: 80}; // 0 par, 2 perp
    const D_neither = {x: 20, y: 80};  // 0 par, 0 perp

    const candidateTypes = [
      { pt: D_both,     type: "BOTH",    par: 1, perp: 2, sum: 3, condition: "Line CD is parallel to Line AB, AND Line AD is perpendicular to Line AB." },
      { pt: D_parOnly,  type: "PAR",     par: 2, perp: 0, sum: 2, condition: "Line CD is parallel to Line AB, AND Line AD is parallel to Line BC (forming a parallelogram)." },
      { pt: D_perpOnly, type: "PERP",    par: 0, perp: 2, sum: 2, condition: "Line AD is perpendicular to Line AB, but Line CD is NOT parallel to Line AB." },
      { pt: D_neither,  type: "NEITHER", par: 0, perp: 0, sum: 0, condition: "The completed shape ABCD has EXACTLY ZERO parallel pairs and ZERO perpendicular pairs." }
    ];

    const targetCondition = candidateTypes[Math.floor(Math.random() * candidateTypes.length)];
    const trueD = rotatePoint(targetCondition.pt);

    const candidates = [
      rotatePoint(D_both), 
      rotatePoint(D_parOnly), 
      rotatePoint(D_perpOnly), 
      rotatePoint(D_neither)
    ];

    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    
    const createLabeledDot = (pt, label, color = "#1e293b") => {
      const d = 1; 
      return {
        vertices: [
          {x: pt.x - d, y: pt.y - d},
          {x: pt.x + d, y: pt.y - d},
          {x: pt.x + d, y: pt.y + d},
          {x: pt.x - d, y: pt.y + d}
        ],
        strokeColor: color,
        fillColor: color,
        vertexLabels: [label, "", "", ""]
      };
    };

    const candidateLabels = ["P", "Q", "R", "S"];
    let correctAnswerLabel = "";
    const candidatePolygons = candidates.map((pt, idx) => {
      if (pt.x === trueD.x && pt.y === trueD.y) correctAnswerLabel = candidateLabels[idx];
      return createLabeledDot(pt, candidateLabels[idx], "#ef4444");
    });

    let askText = "";
    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A builder wants to complete a four-sided garden plot ABCD on a grid map. Edges AB and BC are already laid out. Point D must be placed at one of four marked points (P, Q, R, or S) such that ${targetCondition.condition} Determine which point is Point D, then calculate the total number of parallel and perpendicular pairs in the completed garden plot."`;
      const stepsArr = [
        { label: `Which candidate point (P, Q, R, or S) satisfies the condition: ${targetCondition.condition}`, expectedAnswer: correctAnswerLabel, acceptedAnswers: [`Point ${correctAnswerLabel}`] },
        { label: "Once Point D is placed at that point, how many pairs of parallel lines does the completed shape ABCD have?", expectedAnswer: String(targetCondition.par), acceptedAnswers: [] },
        { label: "How many pairs of perpendicular lines does the completed shape ABCD have?", expectedAnswer: String(targetCondition.perp), acceptedAnswers: [] },
        { label: "Write the working equation to find the total number of parallel and perpendicular pairs in shape ABCD:", expectedAnswer: `${targetCondition.par} + ${targetCondition.perp} = ${targetCondition.sum}`, acceptedAnswers: [`${targetCondition.perp}+${targetCondition.par}=${targetCondition.sum}`] },
        { label: "Total pairs:", expectedAnswer: String(targetCondition.sum), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"To complete a 4-sided shape where ${targetCondition.condition} which point must be chosen as Point D?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at edges AB and BC on the grid. Which of the marked points (P, Q, R, or S) should be Point D so that ${targetCondition.condition}"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        polygons: [
          { vertices: [A, B, C], isOpen: true, strokeColor: "#3b82f6" },
          createLabeledDot(A, "A"),
          createLabeledDot(B, "B"),
          createLabeledDot(C, "C"),
          ...candidatePolygons
        ],
        showGrid: true
      }
    });

    systemPrompt = `You are generating a Primary 3 Math question.
${getFormatInstructions(visualEngineStr, inputRequirementStr)}
Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${isMCQ ? "Point " + correctAnswerLabel : isStructure ? targetCondition.sum : correctAnswerLabel}
CRITICAL: Do not explain the math inside the questionText. Leave it as a puzzle for the student.`;
  }

  return { aiPrompt: systemPrompt };
};
