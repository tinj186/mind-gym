import { CONTEXT_TIERS } from '../../../../../utils/variable-bank.js';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getFourOptions = (correctVal, candidateDistractors = []) => {
  const set = new Set([String(correctVal)]);
  for (const d of candidateDistractors) {
    if (d !== undefined && d !== null && String(d).trim() !== '' && !set.has(String(d)) && set.size < 4) {
      set.add(String(d));
    }
  }
  let delta = 1;
  const num = Number(correctVal);
  while (set.size < 4) {
    if (!isNaN(num)) {
      const candidate = String(Math.max(1, num + (set.size % 2 === 1 ? delta : -delta)));
      if (!set.has(candidate)) set.add(candidate);
    } else {
      set.add(`Option ${set.size + 1}`);
    }
    delta++;
  }
  return Array.from(set);
};

export const generateStandard = (variant, type, getFormatInstructions) => {
  const safeType = String(type).toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  let systemPrompt = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let askText = '';
  let finalAnswer = '';
  let mcqOptionsPrompt = '';

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

  if (variant === 'standard_grid_step_replication') {
    const dx = getRandomInt(1, 3);
    const dy = getRandomInt(1, 3);
    const multiplier = (dx >= 3 || dy >= 3) ? getRandomInt(2, 3) : getRandomInt(2, 4);
    
    const newDx = dx * multiplier;
    const newDy = dy * multiplier;
    
    // Master Line AB
    const startA = { x: 40, y: 80 + dy * 20 };
    const endB = { x: 40 + dx * 20, y: 80 };
    
    // Starting Point C placed below Line AB, line CD draws parallel (+newDx, -newDy)
    const startC = { x: 40, y: 120 + dy * 20 + newDy * 20 };
    const endD = { x: startC.x + newDx * 20, y: startC.y - newDy * 20 };
    
    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A master line, Line AB, is drawn diagonally on the grid. A student is told to start at Point C and draw a new line perfectly parallel to Line AB. However, the instructions say the new drawn line must be exactly ${multiplier} times as long as Line AB. Use the drawing tool to draw this new parallel line starting from Point C. By counting the grid boxes Line AB spans, calculate the total number of horizontal grid steps (boxes moved right) and vertical grid steps (boxes moved up) the new line will require."`;
      const stepsArr = [
        { label: "Look at Line AB on the grid. How many horizontal grid boxes right does it span?", expectedAnswer: String(dx), acceptedAnswers: [] },
        { label: "Look at Line AB. How many vertical grid boxes up does it span?", expectedAnswer: String(dy), acceptedAnswers: [] },
        { label: `Write the working equation to find the horizontal steps for the drawn line (${multiplier} times as long):`, expectedAnswer: `${dx} x ${multiplier} = ${newDx}`, acceptedAnswers: [`${multiplier}x${dx}=${newDx}`] },
        { label: `Write the working equation to find the vertical steps for the drawn line:`, expectedAnswer: `${dy} x ${multiplier} = ${newDy}`, acceptedAnswers: [`${multiplier}x${dy}=${newDy}`] },
        { label: "Total horizontal steps for the new line:", expectedAnswer: String(newDx), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(newDx);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A slanted line AB goes ${dy} unit(s) up and ${dx} unit(s) right. Use the drawing tool to draw a parallel line from Point C that is ${multiplier} times as long. How many grid units right will your drawn line stretch?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(newDx);
      const opts = getFourOptions(finalAnswer, [String(dx), String(newDy), String(dx + multiplier), String(newDx + 2)]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Line AB spans ${dx} boxes right and ${dy} boxes up. Use the drawing tool to draw a parallel line from Point C that is ${multiplier} times as long. How many grid boxes right must it go?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(newDx);
    }
    
    const allPts = [startA, endB, startC, endD];
    const rawMinX = Math.min(...allPts.map(p => p.x)) - 40;
    const rawMaxX = Math.max(...allPts.map(p => p.x)) + 40;
    const rawMinY = Math.min(...allPts.map(p => p.y)) - 40;
    const rawMaxY = Math.max(...allPts.map(p => p.y)) + 40;
    const gridBounds = {
      minX: Math.max(0, rawMinX),
      maxX: rawMaxX,
      minY: Math.max(0, rawMinY),
      maxY: rawMaxY
    };

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        drawMode: true,
        expectedLines: [{ p1: startC, p2: endD }],
        gridBounds,
        polygons: [
          { vertices: [startA, endB], isOpen: true, strokeColor: "#3b82f6" },
          createLabeledDot(startA, "A"),
          createLabeledDot(endB, "B"),
          createLabeledDot(startC, "C")
        ],
        showGrid: true
      }
    });
  } else if (variant === 'standard_completing_rectangles') {
    const shapeType = getRandomInt(1, 4); // 1: Slanted Parallelogram, 2: Right Trapezoid, 3: L-Shaped Polygon, 4: Oriented Rectangle

    let expectedLines = [];
    let polygons = [];
    let allPts = [];

    if (shapeType === 1) {
      // Shape 1: Slanted Parallelogram ABCD
      // AB is horizontal, BC is slanted. Student draws CD (parallel to AB) and DA (parallel to BC).
      const w = getRandomInt(4, 6);
      const dx = getRandomInt(2, 3);
      const dy = getRandomInt(2, 3);
      
      const startA = { x: 60, y: 60 };
      const ptB = { x: 60 + w * 20, y: 60 };
      const ptC = { x: ptB.x + dx * 20, y: ptB.y + dy * 20 };
      const ptD = { x: ptC.x - w * 20, y: ptC.y };
      
      allPts = [startA, ptB, ptC, ptD];
      expectedLines = [
        { p1: ptC, p2: ptD },
        { p1: ptD, p2: startA }
      ];
      
      polygons = [
        { vertices: [startA, ptB, ptC], isOpen: true, strokeColor: "#3b82f6" },
        createLabeledDot(startA, "A"),
        createLabeledDot(ptB, "B"),
        createLabeledDot(ptC, "C")
      ];

      const sumParallelBases = w * 2;
      finalAnswer = String(sumParallelBases);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A student is drawing a slanted parallelogram ABCD on a square grid. Lines AB and BC are already drawn. Top horizontal Line AB is parallel to bottom horizontal Line CD, and slanted Line BC is parallel to slanted Line DA. Use the drawing tool to draw Line CD and Line DA to complete the parallelogram. Visually count the grid units for Line AB, deduce the length of parallel Line CD, and find the combined length of the two horizontal parallel edges (AB + CD)."`;
        const stepsArr = [
          { label: "Visually count the units for top horizontal Line AB:", expectedAnswer: String(w), acceptedAnswers: [] },
          { label: "Because bottom Line CD must be perfectly parallel and equal to Line AB, what is the length of Line CD?", expectedAnswer: String(w), acceptedAnswers: [] },
          { label: `Line BC is slanted (${dx} boxes right and ${dy} boxes down). Because Line DA is parallel to it, how many boxes horizontally does Line DA span?`, expectedAnswer: String(dx), acceptedAnswers: [] },
          { label: "Write the working equation to find the total combined length of the two horizontal parallel edges (AB + CD):", expectedAnswer: `${w} + ${w} = ${sumParallelBases}`, acceptedAnswers: [`2 x ${w} = ${sumParallelBases}`, `2x${w}=${sumParallelBases}`, `${w}*2=${sumParallelBases}`] },
          { label: "Total combined length of the two horizontal parallel edges:", expectedAnswer: String(sumParallelBases), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Lines AB and BC of a slanted parallelogram are drawn. Top edge AB is horizontal (${w} units). Use the drawing tool to complete the shape. What is the combined length of the two horizontal parallel edges (AB + CD)?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(w), String(sumParallelBases + 2), String(sumParallelBases - 2 > 0 ? sumParallelBases - 2 : sumParallelBases + 4), String(w + dx)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Lines AB and BC of a slanted parallelogram are drawn. Edge AB is ${w} units long. Use the drawing tool to draw lines CD and DA to complete the shape. Find the combined length of horizontal edges AB + CD."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (shapeType === 2) {
      // Shape 2: Right Trapezoid ABCD
      // AB is vertical, BC is horizontal (AB ⊥ BC).
      // Top base AD is parallel to BC with length topW. Student draws AD and slanted DC.
      const h = getRandomInt(3, 5);
      const botW = getRandomInt(5, 7);
      const topW = getRandomInt(2, botW - 2);

      const startA = { x: 60, y: 60 };
      const ptB = { x: 60, y: 60 + h * 20 };
      const ptC = { x: 60 + botW * 20, y: ptB.y };
      const ptD = { x: 60 + topW * 20, y: 60 };

      allPts = [startA, ptB, ptC, ptD];
      expectedLines = [
        { p1: startA, p2: ptD },
        { p1: ptD, p2: ptC }
      ];

      polygons = [
        { vertices: [startA, ptB, ptC], isOpen: true, strokeColor: "#3b82f6" },
        createLabeledDot(startA, "A"),
        createLabeledDot(ptB, "B"),
        createLabeledDot(ptC, "C")
      ];

      const sumBases = topW + botW;
      const diffBases = botW - topW;
      finalAnswer = String(sumBases);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A designer is drawing a right trapezoid ABCD on a square grid. Vertical edge AB and bottom horizontal edge BC are already drawn at a right angle. The top horizontal edge AD must be drawn parallel to edge BC and must be exactly ${topW} grid units long. Then, a slanted closing line CD connects Point D to Point C. Use the drawing tool to draw Line AD and Line CD. Deduce the grid lengths and calculate the total combined length of both parallel horizontal bases (AD + BC)."`;
        const stepsArr = [
          { label: "Visually count the length of the bottom horizontal base BC:", expectedAnswer: String(botW), acceptedAnswers: [] },
          { label: `Top edge AD is drawn parallel to BC with length ${topW} units. Write the equation to find the difference between the two parallel bases (${botW} - ${topW}):`, expectedAnswer: `${botW} - ${topW} = ${diffBases}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the total combined length of both parallel bases (${topW} + ${botW}):`, expectedAnswer: `${topW} + ${botW} = ${sumBases}`, acceptedAnswers: [`${botW} + ${topW} = ${sumBases}`, `${botW}+${topW}=${sumBases}`] },
          { label: "Total combined length of both parallel bases:", expectedAnswer: String(sumBases), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A right trapezoid has bottom base BC (${botW} units). You draw top base AD parallel to BC (${topW} units) and slanted Line CD to complete the shape. What is the combined length of both parallel bases (AD + BC)?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(botW), String(diffBases), String(sumBases + 2), String(sumBases - 2 > 0 ? sumBases - 2 : sumBases + 4)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Lines AB and BC of a right trapezoid are drawn. Bottom base BC is ${botW} units. Draw top base AD (${topW} units) parallel to BC and slanted Line CD to complete it. Find the combined length of bases AD + BC."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (shapeType === 3) {
      // Shape 3: L-Shaped Orthogonal 6-sided Polygon (ABCDEF)
      // AB, BC, CD, DE drawn. Student deduces missing vertical EF and horizontal FA.
      const totalW = getRandomInt(5, 7);
      const totalH = getRandomInt(5, 7);
      const cutW = getRandomInt(2, totalW - 2);
      const cutH = getRandomInt(2, totalH - 2);
      
      const h1 = totalH - cutH;
      const w1 = cutW;
      const h2 = cutH;
      const w2 = totalW - cutW;

      const startA = { x: 60, y: 60 };
      const ptB = { x: 60, y: 60 + totalH * 20 };
      const ptC = { x: 60 + totalW * 20, y: ptB.y };
      const ptD = { x: ptC.x, y: ptC.y - h1 * 20 };
      const ptE = { x: ptD.x - w1 * 20, y: ptD.y };
      const ptF = { x: ptE.x, y: 60 };

      allPts = [startA, ptB, ptC, ptD, ptE, ptF];
      expectedLines = [
        { p1: ptE, p2: ptF },
        { p1: ptF, p2: startA }
      ];

      polygons = [
        { vertices: [startA, ptB, ptC, ptD, ptE], isOpen: true, strokeColor: "#3b82f6" },
        createLabeledDot(startA, "A"),
        createLabeledDot(ptB, "B"),
        createLabeledDot(ptC, "C"),
        createLabeledDot(ptD, "D"),
        createLabeledDot(ptE, "E")
      ];

      const perimeter = (totalW + totalH) * 2;
      finalAnswer = String(perimeter);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An L-shaped polygon ABCDEF is partially drawn on a grid. Edges AB, BC, CD, and DE are already drawn. To complete the 6-sided polygon, you must draw vertical Line EF (parallel to edge AB) and horizontal Line FA (parallel to edge BC). Visually count the lengths on the grid, use parallel properties to deduce the lengths of the missing edges EF and FA, draw them using the drawing tool, and calculate the total perimeter of the completed 6-sided polygon."`;
        const stepsArr = [
          { label: "Visually count the total height of left vertical edge AB:", expectedAnswer: String(totalH), acceptedAnswers: [] },
          { label: `Edge CD has height ${h1}. Write the equation to deduce the length of missing parallel vertical edge EF (${totalH} - ${h1}):`, expectedAnswer: `${totalH} - ${h1} = ${h2}`, acceptedAnswers: [] },
          { label: "Visually count the total width of bottom horizontal edge BC:", expectedAnswer: String(totalW), acceptedAnswers: [] },
          { label: `Edge DE has width ${w1}. Write the equation to deduce the length of missing parallel horizontal edge FA (${totalW} - ${w1}):`, expectedAnswer: `${totalW} - ${w1} = ${w2}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the total perimeter of the completed polygon (${totalW} + ${totalH}) x 2:`, expectedAnswer: `(${totalW} + ${totalH}) x 2 = ${perimeter}`, acceptedAnswers: [`2 x (${totalW} + ${totalH}) = ${perimeter}`, `${totalW} + ${totalH} + ${totalW} + ${totalH} = ${perimeter}`, `${totalW}+${totalH}+${totalW}+${totalH}=${perimeter}`, `2x(${totalW}+${totalH})=${perimeter}`] },
          { label: "Total perimeter of the completed polygon:", expectedAnswer: String(perimeter), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An L-shaped polygon has total height ${totalH} units and total width ${totalW} units. Use the drawing tool to draw missing edges EF and FA to complete the polygon. What is the total perimeter of the completed polygon?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(totalW + totalH), String(perimeter - 4 > 0 ? perimeter - 4 : perimeter + 6), String(perimeter + 4), String(totalW * totalH)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An L-shaped polygon has total height ${totalH} units and total width ${totalW} units. Complete the shape by drawing parallel edges EF and FA. Find the total perimeter of the completed polygon."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else {
      // Shape 4: Oriented Rectangle ABCD (Random orientation: top-left, bottom-left, top-right)
      const w = getRandomInt(4, 7);
      const h = getRandomInt(3, 5);
      const perimeter = (w + h) * 2;
      const orient = getRandomInt(1, 3);

      let startA, ptB, ptC, ptD;
      if (orient === 1) {
        startA = { x: 60, y: 60 };
        ptB = { x: 60 + w * 20, y: 60 };
        ptC = { x: ptB.x, y: ptB.y + h * 20 };
        ptD = { x: startA.x, y: ptC.y };
      } else if (orient === 2) {
        startA = { x: 60, y: 60 };
        ptB = { x: 60, y: 60 + h * 20 };
        ptC = { x: 60 + w * 20, y: ptB.y };
        ptD = { x: ptC.x, y: 60 };
      } else {
        startA = { x: 60 + w * 20, y: 60 };
        ptB = { x: 60, y: 60 };
        ptC = { x: 60, y: 60 + h * 20 };
        ptD = { x: startA.x, y: ptC.y };
      }

      allPts = [startA, ptB, ptC, ptD];
      expectedLines = [
        { p1: ptC, p2: ptD },
        { p1: ptD, p2: startA }
      ];

      polygons = [
        { vertices: [startA, ptB, ptC], isOpen: true, strokeColor: "#3b82f6" },
        createLabeledDot(startA, "A"),
        createLabeledDot(ptB, "B"),
        createLabeledDot(ptC, "C")
      ];

      finalAnswer = String(perimeter);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A gardener is drawing a rectangular flower bed ABCD on a grid map. Edges AB and BC are already drawn perpendicularly. To complete the rectangle, plot Point D and use the drawing tool to draw Line CD parallel to Line AB, and Line DA parallel to Line BC. Deduce the grid lengths of the missing edges and find the total perimeter of the completed rectangle."`;
        const stepsArr = [
          { label: "Visually count the units for Line AB. Because Line CD is parallel to it, what is the length of Line CD?", expectedAnswer: String(w), acceptedAnswers: [] },
          { label: "Visually count the units for Line BC. Because Line DA is parallel to it, what is the length of Line DA?", expectedAnswer: String(h), acceptedAnswers: [] },
          { label: "Write the working equation to find the total perimeter (all 4 edges):", expectedAnswer: `${w} + ${h} + ${w} + ${h} = ${perimeter}`, acceptedAnswers: [`(${w} + ${h}) x 2 = ${perimeter}`, `2 x (${w} + ${h}) = ${perimeter}`, `${w}*2 + ${h}*2 = ${perimeter}`, `${h} + ${w} + ${h} + ${w} = ${perimeter}`, `${w}+${h}+${w}+${h}=${perimeter}`] },
          { label: "Total perimeter length:", expectedAnswer: String(perimeter), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Lines AB (${w} units) and BC (${h} units) form a right angle on a grid. Use the drawing tool to draw lines CD and DA to complete the rectangle. What is the total perimeter of the completed rectangle?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(w + h), String(perimeter - 4 > 0 ? perimeter - 4 : perimeter + 4), String(perimeter + 4), String(w * h)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Lines AB (${w} units) and BC (${h} units) are drawn perpendicularly. Draw lines CD and DA to complete the rectangle. Find the total perimeter."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    }

    const rawMinX = Math.min(...allPts.map(p => p.x)) - 40;
    const rawMaxX = Math.max(...allPts.map(p => p.x)) + 40;
    const rawMinY = Math.min(...allPts.map(p => p.y)) - 40;
    const rawMaxY = Math.max(...allPts.map(p => p.y)) + 40;
    const gridBounds = {
      minX: Math.max(0, rawMinX),
      maxX: rawMaxX,
      minY: Math.max(0, rawMinY),
      maxY: rawMaxY
    };

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        drawMode: true,
        expectedLines,
        gridBounds,
        polygons,
        showGrid: true
      }
    });

  } else if (variant === 'standard_drawing_alternating_paths') {
    const pathType = getRandomInt(1, 4); // 1: Stepped Staircase, 2: Castle Battlement, 3: Meandering Snake Track, 4: Rectangular Obstacle Detour

    let expectedLines = [];
    let polygons = [];
    let allPts = [];

    if (pathType === 1) {
      // Archetype 1: Ascending Staircase
      const hStep = getRandomInt(2, 4);
      const vStep = getRandomInt(2, 3);
      const totalSteps = getRandomInt(3, 4);
      const remainingSteps = totalSteps - 1;

      const startY = 80 + totalSteps * vStep * 20;
      const pts = [{ x: 40, y: startY }];

      for (let i = 0; i < totalSteps; i++) {
        const prev = pts[pts.length - 1];
        const nextH = { x: prev.x + hStep * 20, y: prev.y };
        const nextV = { x: nextH.x, y: nextH.y - vStep * 20 };
        pts.push(nextH, nextV);
      }

      allPts = pts;
      // First step already drawn: pts[0] -> pts[1] -> pts[2]
      const initialDrawn = [pts[0], pts[1], pts[2]];
      
      for (let i = 2; i < pts.length - 1; i++) {
        expectedLines.push({ p1: pts[i], p2: pts[i + 1] });
      }

      polygons = [
        { vertices: initialDrawn, isOpen: true, strokeColor: "#3b82f6" },
        createLabeledDot(pts[0], "A"),
        createLabeledDot(pts[2], "B")
      ];

      const hTotal = hStep * totalSteps;
      const vTotal = vStep * totalSteps;
      const grandTotal = hTotal + vTotal;
      finalAnswer = String(grandTotal);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A character draws an ascending staircase path with perpendicular corners on a grid. The first step from Point A to Point B is already drawn (${hStep} units Right, then ${vStep} units Up). The character must draw a total of ${totalSteps} identical steps. Use the drawing tool to draw the remaining ${remainingSteps} step(s) starting from Point B. Then, calculate the total length of all parallel horizontal lines, all parallel vertical lines, and the grand total path length."`;
        const stepsArr = [
          { label: "Visually count the length of one horizontal step:", expectedAnswer: String(hStep), acceptedAnswers: [] },
          { label: "Visually count the height of one vertical step:", expectedAnswer: String(vStep), acceptedAnswers: [] },
          { label: `Write the working equation to find the total length of all ${totalSteps} parallel horizontal lines (${totalSteps} x ${hStep}):`, expectedAnswer: `${totalSteps} x ${hStep} = ${hTotal}`, acceptedAnswers: [`${hStep} x ${totalSteps} = ${hTotal}`, `${totalSteps}*${hStep}=${hTotal}`, `${hStep}*${totalSteps}=${hTotal}`] },
          { label: `Write the working equation to find the total length of all ${totalSteps} parallel vertical lines (${totalSteps} x ${vStep}):`, expectedAnswer: `${totalSteps} x ${vStep} = ${vTotal}`, acceptedAnswers: [`${vStep} x ${totalSteps} = ${vTotal}`, `${totalSteps}*${vStep}=${vTotal}`, `${vStep}*${totalSteps}=${vTotal}`] },
          { label: `Write the working equation to find the grand total length of the entire drawn path (${hTotal} + ${vTotal}):`, expectedAnswer: `${hTotal} + ${vTotal} = ${grandTotal}`, acceptedAnswers: [`${vTotal} + ${hTotal} = ${grandTotal}`, `${hTotal}+${vTotal}=${grandTotal}`, `${vTotal}+${hTotal}=${grandTotal}`] },
          { label: "Grand total length of the path:", expectedAnswer: String(grandTotal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A staircase path has ${totalSteps} repeated steps (${hStep} units Right, ${vStep} units Up with perpendicular turns). The first step from A to B is drawn. Use the drawing tool to complete the remaining steps. What is the grand total length of the entire path?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(hTotal), String(vTotal), String(grandTotal + 2), String(grandTotal - 2 > 0 ? grandTotal - 2 : grandTotal + 4)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A staircase path repeats ${totalSteps} steps (${hStep} units Right, ${vStep} units Up). Use the drawing tool to draw the remaining steps from Point B. Find the grand total path length."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (pathType === 2) {
      // Archetype 2: Castle Battlement (Square Wave Pattern)
      const h = getRandomInt(2, 4);
      const w = getRandomInt(2, 3);
      const waves = 2; // 2 complete crests

      const pts = [{ x: 40, y: 80 + h * 20 }];
      for (let i = 0; i < waves; i++) {
        const pLast = pts[pts.length - 1];
        const pUp = { x: pLast.x, y: pLast.y - h * 20 };
        const pRightTop = { x: pUp.x + w * 20, y: pUp.y };
        const pDown = { x: pRightTop.x, y: pRightTop.y + h * 20 };
        const pRightBot = { x: pDown.x + w * 20, y: pDown.y };
        pts.push(pUp, pRightTop, pDown, pRightBot);
      }

      allPts = pts;
      // First crest already drawn: pts[0] -> pts[1] -> pts[2]
      const initialDrawn = [pts[0], pts[1], pts[2]];
      
      for (let i = 2; i < pts.length - 1; i++) {
        expectedLines.push({ p1: pts[i], p2: pts[i + 1] });
      }

      polygons = [
        { vertices: initialDrawn, isOpen: true, strokeColor: "#3b82f6" },
        createLabeledDot(pts[0], "A"),
        createLabeledDot(pts[2], "B")
      ];

      const numVert = waves * 2;
      const numHoriz = waves * 2;
      const vTotal = numVert * h;
      const hTotal = numHoriz * w;
      const grandTotal = vTotal + hTotal;
      finalAnswer = String(grandTotal);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A stonemason is carving a castle battlement with perpendicular corners along a wall. The first section from Point A to Point B is drawn (${h} units Up, then ${w} units Right). The full wall contains exactly ${numVert} vertical segments (each ${h} units) and ${numHoriz} horizontal segments (each ${w} units). Use the drawing tool to continue the pattern from Point B and complete the battlement. Then, calculate the total length of all vertical lines, horizontal lines, and the grand total path length."`;
        const stepsArr = [
          { label: "Visually count the height of one vertical post:", expectedAnswer: String(h), acceptedAnswers: [] },
          { label: "Visually count the width of one horizontal segment:", expectedAnswer: String(w), acceptedAnswers: [] },
          { label: `Write the equation to find the total length of all ${numVert} parallel vertical posts (${numVert} x ${h}):`, expectedAnswer: `${numVert} x ${h} = ${vTotal}`, acceptedAnswers: [`${h} x ${numVert} = ${vTotal}`, `${numVert}*${h}=${vTotal}`, `${h}*${numVert}=${vTotal}`] },
          { label: `Write the equation to find the total length of all ${numHoriz} parallel horizontal segments (${numHoriz} x ${w}):`, expectedAnswer: `${numHoriz} x ${w} = ${hTotal}`, acceptedAnswers: [`${w} x ${numHoriz} = ${hTotal}`, `${numHoriz}*${w}=${hTotal}`, `${w}*${numHoriz}=${hTotal}`] },
          { label: `Write the equation to find the grand total carved length (${vTotal} + ${hTotal}):`, expectedAnswer: `${vTotal} + ${hTotal} = ${grandTotal}`, acceptedAnswers: [`${hTotal} + ${vTotal} = ${grandTotal}`, `${vTotal}+${hTotal}=${grandTotal}`, `${hTotal}+${vTotal}=${grandTotal}`] },
          { label: "Grand total length of the battlement:", expectedAnswer: String(grandTotal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A castle battlement has ${numVert} vertical posts (${h} units each) and ${numHoriz} horizontal segments (${w} units each). The section from A to B is drawn. Use the drawing tool to complete the pattern. What is the grand total length of the battlement?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(vTotal), String(hTotal), String(grandTotal + 2), String(grandTotal - 2 > 0 ? grandTotal - 2 : grandTotal + 4)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A battlement path has ${numVert} vertical segments (${h} units) and ${numHoriz} horizontal segments (${w} units). Draw the remaining lines from Point B to complete it. Find the grand total length."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (pathType === 3) {
      // Archetype 3: Meandering Snake Track
      const w = getRandomInt(4, 6);
      const h = getRandomInt(2, 3);

      const p0 = { x: 40, y: 60 };
      const p1 = { x: p0.x + w * 20, y: p0.y };
      const p2 = { x: p1.x, y: p1.y + h * 20 };
      const p3 = { x: p0.x, y: p2.y };
      const p4 = { x: p3.x, y: p3.y + h * 20 };
      const p5 = { x: p4.x + w * 20, y: p4.y };

      const pts = [p0, p1, p2, p3, p4, p5];
      allPts = pts;

      const initialDrawn = [p0, p1, p2];

      expectedLines = [
        { p1: p2, p2: p3 },
        { p1: p3, p2: p4 },
        { p1: p4, p2: p5 }
      ];

      polygons = [
        { vertices: initialDrawn, isOpen: true, strokeColor: "#3b82f6" },
        createLabeledDot(p0, "A"),
        createLabeledDot(p2, "B")
      ];

      const numHoriz = 3;
      const numVert = 2;
      const hTotal = numHoriz * w;
      const vTotal = numVert * h;
      const grandTotal = hTotal + vTotal;
      finalAnswer = String(grandTotal);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A robot navigates a snake track with perpendicular turns between two parallel walls. The initial path from Point A to Point B is drawn (${w} units Right, then ${h} units Down). To finish the track, the robot must make ${numHoriz} parallel horizontal runs (each ${w} units long) connected by ${numVert} perpendicular drops (each ${h} units long). Use the drawing tool to draw the remaining segments starting from Point B. Then, calculate the total length of the parallel horizontal runs, the vertical drops, and the total track length."`;
        const stepsArr = [
          { label: "Visually count the width of one horizontal run:", expectedAnswer: String(w), acceptedAnswers: [] },
          { label: "Visually count the height of one vertical drop:", expectedAnswer: String(h), acceptedAnswers: [] },
          { label: `Write the working equation to find the total length of all ${numHoriz} parallel horizontal runs (${numHoriz} x ${w}):`, expectedAnswer: `${numHoriz} x ${w} = ${hTotal}`, acceptedAnswers: [`${w} x ${numHoriz} = ${hTotal}`, `${numHoriz}*${w}=${hTotal}`, `${w}*${numHoriz}=${hTotal}`] },
          { label: `Write the working equation to find the total length of all ${numVert} parallel vertical drops (${numVert} x ${h}):`, expectedAnswer: `${numVert} x ${h} = ${vTotal}`, acceptedAnswers: [`${h} x ${numVert} = ${vTotal}`, `${numVert}*${h}=${vTotal}`, `${h}*${numVert}=${vTotal}`] },
          { label: `Write the working equation to find the total track length (${hTotal} + ${vTotal}):`, expectedAnswer: `${hTotal} + ${vTotal} = ${grandTotal}`, acceptedAnswers: [`${vTotal} + ${hTotal} = ${grandTotal}`, `${hTotal}+${vTotal}=${grandTotal}`, `${vTotal}+${hTotal}=${grandTotal}`] },
          { label: "Total length of the entire track:", expectedAnswer: String(grandTotal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A snake track has ${numHoriz} parallel horizontal runs (${w} units each) and ${numVert} vertical drops (${h} units each) meeting perpendicularly. The path from A to B is drawn. Use the drawing tool to complete the track. What is the total length of the track?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(hTotal), String(vTotal), String(grandTotal + 2), String(grandTotal - 2 > 0 ? grandTotal - 2 : grandTotal + 4)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A snake track has ${numHoriz} horizontal runs (${w} units each) and ${numVert} vertical drops (${h} units each). Draw the remaining lines from Point B to complete the path. Find the total length."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else {
      // Archetype 4: Rectangular Obstacle Detour
      const d1 = getRandomInt(2, 4);
      const v = getRandomInt(2, 4);
      const d2 = getRandomInt(3, 5);
      const d3 = getRandomInt(2, 4);

      const p0 = { x: 40, y: 80 + v * 20 };
      const p1 = { x: p0.x + d1 * 20, y: p0.y };
      const p2 = { x: p1.x, y: p1.y - v * 20 };
      const p3 = { x: p2.x + d2 * 20, y: p2.y };
      const p4 = { x: p3.x, y: p3.y + v * 20 };
      const p5 = { x: p4.x + d3 * 20, y: p4.y };

      const pts = [p0, p1, p2, p3, p4, p5];
      allPts = pts;

      const initialDrawn = [p0, p1, p2];

      expectedLines = [
        { p1: p2, p2: p3 },
        { p1: p3, p2: p4 },
        { p1: p4, p2: p5 }
      ];

      polygons = [
        { vertices: initialDrawn, isOpen: true, strokeColor: "#3b82f6" },
        createLabeledDot(p0, "A"),
        createLabeledDot(p2, "B")
      ];

      const hTotal = d1 + d2 + d3;
      const vTotal = v * 2;
      const grandTotal = hTotal + vTotal;
      finalAnswer = String(grandTotal);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A pipeline engineer is drawing a detour path around an underground obstacle using perpendicular turns. The first section from Point A to Point B is drawn (${d1} units Right, then ${v} units Up). The remaining detour must go ${d2} units Right, ${v} units Down, and ${d3} units Right to rejoin the mainline. Use the drawing tool to draw the remaining segments starting from Point B. Then, calculate the total length of all parallel horizontal pipe sections, all parallel vertical pipe sections, and the total pipeline length."`;
        const stepsArr = [
          { label: `Write the equation to find the total length of the 3 parallel horizontal sections (${d1} + ${d2} + ${d3}):`, expectedAnswer: `${d1} + ${d2} + ${d3} = ${hTotal}`, acceptedAnswers: [] },
          { label: `Write the equation to find the total length of the 2 parallel vertical detour sections (${v} + ${v}):`, expectedAnswer: `${v} + ${v} = ${vTotal}`, acceptedAnswers: [`2 x ${v} = ${vTotal}`, `2x${v}=${vTotal}`, `${v}*2=${vTotal}`] },
          { label: `Write the working equation to find the grand total length of the detour pipeline (${hTotal} + ${vTotal}):`, expectedAnswer: `${hTotal} + ${vTotal} = ${grandTotal}`, acceptedAnswers: [`${vTotal} + ${hTotal} = ${grandTotal}`, `${hTotal}+${vTotal}=${grandTotal}`, `${vTotal}+${hTotal}=${grandTotal}`] },
          { label: "Grand total length of the pipeline:", expectedAnswer: String(grandTotal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A detour pipeline has 3 parallel horizontal sections (${d1}, ${d2}, and ${d3} units) and 2 vertical sections (${v} units each) with perpendicular turns. The section from A to B is drawn. Use the drawing tool to complete the pipeline. What is the grand total length?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(hTotal), String(vTotal), String(grandTotal + 2), String(grandTotal - 2 > 0 ? grandTotal - 2 : grandTotal + 4)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A detour pipeline has 3 horizontal sections (${d1}, ${d2}, ${d3} units) and 2 vertical sections (${v} units each). Draw the remaining lines from Point B to complete it. Find the grand total length."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    }

    const rawMinX = Math.min(...allPts.map(p => p.x)) - 40;
    const rawMaxX = Math.max(...allPts.map(p => p.x)) + 40;
    const rawMinY = Math.min(...allPts.map(p => p.y)) - 40;
    const rawMaxY = Math.max(...allPts.map(p => p.y)) + 40;
    const gridBounds = {
      minX: Math.max(0, rawMinX),
      maxX: rawMaxX,
      minY: Math.max(0, rawMinY),
      maxY: rawMaxY
    };

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        drawMode: true,
        expectedLines,
        gridBounds,
        polygons,
        showGrid: true
      }
    });

  } else if (variant === 'standard_dividing_shapes') {
    const shapeType = getRandomInt(1, 4); // 1: Slanted Parallelogram, 2: Right Trapezoid, 3: Tall Cabinet (Horizontal Shelves), 4: L-Shaped Polygon

    let expectedLines = [];
    let polygons = [];
    let allPts = [];

    if (shapeType === 1) {
      // Archetype 1: Slanted Parallelogram with slanted parallel cut-lines
      const sections = getRandomInt(3, 4);
      const stepW = getRandomInt(2, 3);
      const totalW = sections * stepW;
      const dx = getRandomInt(2, 3);
      const dy = getRandomInt(2, 3);

      const startA = { x: 60, y: 60 };
      const ptB = { x: 60 + totalW * 20, y: 60 };
      const ptC = { x: ptB.x + dx * 20, y: ptB.y + dy * 20 };
      const ptD = { x: startA.x + dx * 20, y: ptC.y };

      allPts = [startA, ptB, ptC, ptD];

      for (let i = 1; i < sections; i++) {
        const pTop = { x: startA.x + i * stepW * 20, y: startA.y };
        const pBot = { x: ptD.x + i * stepW * 20, y: ptD.y };
        expectedLines.push({ p1: pTop, p2: pBot });
        allPts.push(pTop, pBot);
      }

      polygons = [
        { vertices: [startA, ptB, ptC, ptD], isOpen: false, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.08)" },
        createLabeledDot(startA, "A"),
        createLabeledDot(ptB, "B"),
        createLabeledDot(ptC, "C"),
        createLabeledDot(ptD, "D")
      ];

      const numCuts = sections - 1;
      const secondCutDist = stepW * 2;
      finalAnswer = String(secondCutDist);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A designer is dividing a slanted parallelogram banner ABCD into ${sections} equal slanted strips. Top horizontal edge AB is ${totalW} grid units long. She needs to draw ${numCuts} internal slanted dividing lines, each perfectly parallel to slanted side edge AD. Use the drawing tool to draw all ${numCuts} internal slanted parallel dividing lines. Calculate the width of one strip, and find the distance along the top edge from Point A to the second drawn cut-line."`;
        const stepsArr = [
          { label: `Write the working equation to find the width of one equal strip (${totalW} ÷ ${sections}):`, expectedAnswer: `${totalW} / ${sections} = ${stepW}`, acceptedAnswers: [`${totalW} \\div ${sections} = ${stepW}`] },
          { label: `Write the working equation to find the distance along the top edge from Point A to the SECOND drawn cut-line (${stepW} x 2):`, expectedAnswer: `${stepW} x 2 = ${secondCutDist}`, acceptedAnswers: [`2 x ${stepW} = ${secondCutDist}`, `2x${stepW}=${secondCutDist}`, `${stepW}*2=${secondCutDist}`] },
          { label: "Distance from Point A to the second cut-line:", expectedAnswer: String(secondCutDist), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A parallelogram banner has top edge ${totalW} units. You draw slanted lines parallel to the sides to split it into ${sections} equal strips. Use the drawing tool to draw the dividing lines. What is the distance from Point A to the second cut-line?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(stepW), String(totalW), String(secondCutDist + 2), String(secondCutDist - 2 > 0 ? secondCutDist - 2 : secondCutDist + 4)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A parallelogram has top edge ${totalW} units. Draw ${numCuts} slanted parallel cut-lines to divide it into ${sections} equal strips. Find the distance from Point A to the second cut-line."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (shapeType === 2) {
      // Archetype 2: Right Trapezoid divided into Rectangle + Right Triangle
      const h = getRandomInt(3, 5);
      const botW = getRandomInt(6, 8);
      const topW = getRandomInt(3, botW - 2);
      const triW = botW - topW;

      const startA = { x: 60, y: 60 };
      const ptB = { x: 60, y: 60 + h * 20 };
      const ptC = { x: 60 + botW * 20, y: ptB.y };
      const ptD = { x: 60 + topW * 20, y: 60 };
      const ptE = { x: ptD.x, y: ptB.y }; // Point on bottom edge BC

      allPts = [startA, ptB, ptC, ptD, ptE];
      expectedLines = [{ p1: ptD, p2: ptE }];

      polygons = [
        { vertices: [startA, ptB, ptC, ptD], isOpen: false, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.08)" },
        createLabeledDot(startA, "A"),
        createLabeledDot(ptB, "B"),
        createLabeledDot(ptC, "C"),
        createLabeledDot(ptD, "D")
      ];

      finalAnswer = String(triW);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An architect has drawn a right trapezoid ABCD on a square grid. Vertical edge AB has height ${h} units, and bottom edge BC has length ${botW} units. She wants to divide the trapezoid into a rectangle and a right triangle by drawing an internal vertical cut-line DE from top vertex D straight down to bottom edge BC, perfectly parallel to vertical edge AB. Use the drawing tool to draw the internal parallel line DE. Deduce the grid measurements and find the base width of the triangular portion (EC)."`;
        const stepsArr = [
          { label: "Visually count the height of vertical edge AB (in grid units):", expectedAnswer: String(h), acceptedAnswers: [] },
          { label: "Because cut-line DE is drawn parallel to edge AB, what is the length of cut-line DE?", expectedAnswer: String(h), acceptedAnswers: [] },
          { label: "Visually count the total length of bottom horizontal edge BC:", expectedAnswer: String(botW), acceptedAnswers: [] },
          { label: `Top horizontal edge AD is ${topW} units. Write the equation to find the base width of the triangular portion (${botW} - ${topW}):`, expectedAnswer: `${botW} - ${topW} = ${triW}`, acceptedAnswers: [] },
          { label: "Base width of the triangular portion (EC):", expectedAnswer: String(triW), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A right trapezoid has bottom edge BC (${botW} units) and top edge AD (${topW} units). You draw an internal line DE parallel to edge AB to split it into a rectangle and a triangle. Use the drawing tool to draw line DE. What is the base width of the triangular part (EC)?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(topW), String(botW), String(h), String(triW + 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Right trapezoid ABCD has bottom edge BC of ${botW} units and top edge AD of ${topW} units. Draw line DE parallel to AB to divide it into a rectangle and a triangle. Find the base width of the triangle."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (shapeType === 3) {
      // Archetype 3: Tall Cabinet with Horizontal Parallel Shelves
      const sections = getRandomInt(3, 4);
      const shelfH = getRandomInt(2, 3);
      const totalH = sections * shelfH;
      const w = getRandomInt(4, 6);

      const startA = { x: 60, y: 60 };
      const ptB = { x: 60 + w * 20, y: 60 };
      const ptC = { x: 60 + w * 20, y: 60 + totalH * 20 };
      const ptD = { x: 60, y: 60 + totalH * 20 };

      allPts = [startA, ptB, ptC, ptD];

      for (let i = 1; i < sections; i++) {
        const pLeft = { x: 60, y: 60 + i * shelfH * 20 };
        const pRight = { x: 60 + w * 20, y: 60 + i * shelfH * 20 };
        expectedLines.push({ p1: pLeft, p2: pRight });
        allPts.push(pLeft, pRight);
      }

      polygons = [
        { vertices: [startA, ptB, ptC, ptD], isOpen: false, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.08)" },
        createLabeledDot(startA, "A"),
        createLabeledDot(ptB, "B"),
        createLabeledDot(ptC, "C"),
        createLabeledDot(ptD, "D")
      ];

      const numShelves = sections - 1;
      const totalShelfLen = numShelves * w;
      finalAnswer = String(totalShelfLen);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A carpenter is building a tall vertical storage cabinet ABCD on his grid blueprint. The cabinet has height ${totalH} grid units and width ${w} grid units. He wants to draw ${numShelves} internal horizontal shelf lines, perfectly parallel to top edge AB. These shelves will divide the cabinet into ${sections} equal compartments. Use the drawing tool to draw all ${numShelves} internal horizontal parallel shelf lines. Calculate the height of one compartment and the total combined length of all drawn shelves."`;
        const stepsArr = [
          { label: `Write the working equation to find the vertical height of one equal compartment (${totalH} ÷ ${sections}):`, expectedAnswer: `${totalH} / ${sections} = ${shelfH}`, acceptedAnswers: [`${totalH} \\div ${sections} = ${shelfH}`] },
          { label: "Visually count the width of one horizontal shelf (edge AB):", expectedAnswer: String(w), acceptedAnswers: [] },
          { label: `Write the working equation to find the total combined length of all ${numShelves} internal shelves (${numShelves} x ${w}):`, expectedAnswer: `${numShelves} x ${w} = ${totalShelfLen}`, acceptedAnswers: [`${w} x ${numShelves} = ${totalShelfLen}`, `${numShelves}*${w}=${totalShelfLen}`, `${w}*${numShelves}=${totalShelfLen}`] },
          { label: "Total length of all internal shelves drawn:", expectedAnswer: String(totalShelfLen), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A storage cabinet is ${totalH} units high and ${w} units wide. You draw ${numShelves} horizontal shelf lines parallel to the top edge to create ${sections} equal compartments. Use the drawing tool to draw the shelves. What is the total combined length of all internal shelves drawn?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(shelfH), String(w), String(totalShelfLen + 2), String(totalShelfLen - 2 > 0 ? totalShelfLen - 2 : totalShelfLen + 4)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A cabinet is ${totalH} units high and ${w} units wide. Draw ${numShelves} horizontal parallel shelf lines to split it into ${sections} compartments. Find the total length of all drawn shelves."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else {
      // Archetype 4: L-Shaped Polygon divided into Two Rectangles
      const totalW = getRandomInt(6, 8);
      const totalH = getRandomInt(6, 8);
      const w1 = getRandomInt(3, totalW - 3);
      const h1 = getRandomInt(3, totalH - 3);
      const h2 = totalH - h1;

      const startA = { x: 60, y: 60 };
      const ptB = { x: 60, y: 60 + totalH * 20 };
      const ptC = { x: 60 + totalW * 20, y: ptB.y };
      const ptD = { x: ptC.x, y: ptC.y - h1 * 20 };
      const ptE = { x: 60 + w1 * 20, y: ptD.y }; // inner reflex corner
      const ptF = { x: ptE.x, y: 60 };
      const ptG = { x: 60, y: ptE.y }; // point on left vertical edge AB

      allPts = [startA, ptB, ptC, ptD, ptE, ptF, ptG];
      expectedLines = [{ p1: ptE, p2: ptG }];

      polygons = [
        { vertices: [startA, ptB, ptC, ptD, ptE, ptF], isOpen: false, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.08)" },
        createLabeledDot(startA, "A"),
        createLabeledDot(ptB, "B"),
        createLabeledDot(ptC, "C"),
        createLabeledDot(ptD, "D"),
        createLabeledDot(ptE, "E"),
        createLabeledDot(ptF, "F")
      ];

      finalAnswer = String(w1);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An L-shaped room ABCDEF is drawn on a floorplan grid. A builder wants to divide the L-shaped room into two separate rectangular rooms by drawing an internal horizontal divider line EG from inner corner E to left edge AB, perfectly parallel to horizontal edge AF. Use the drawing tool to draw the internal parallel line EG. Deduce the grid measurements and determine the length of the internal dividing line EG."`;
        const stepsArr = [
          { label: "Visually count the length of top horizontal edge AF:", expectedAnswer: String(w1), acceptedAnswers: [] },
          { label: "Because internal dividing line EG is parallel to edge AF, what is the length of line EG?", expectedAnswer: String(w1), acceptedAnswers: [] },
          { label: "Visually count the total height of vertical edge AB:", expectedAnswer: String(totalH), acceptedAnswers: [] },
          { label: `Edge CD has height ${h1}. Write the equation to find the vertical height of bottom rectangle BCG (${totalH} - ${h2}):`, expectedAnswer: `${totalH} - ${h2} = ${h1}`, acceptedAnswers: [] },
          { label: "Length of the internal dividing line EG:", expectedAnswer: String(w1), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An L-shaped room has top edge AF (${w1} units). You draw an internal line EG from inner corner E to edge AB, parallel to edge AF, to split it into two rectangles. Use the drawing tool to draw line EG. What is the length of the dividing line EG?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(totalW), String(totalH), String(w1 + 2), String(w1 - 1 > 0 ? w1 - 1 : w1 + 3)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An L-shaped room has top edge AF (${w1} units). Draw an internal line EG from corner E parallel to edge AF to split the room into two rectangles. Find the length of line EG."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    }

    const rawMinX = Math.min(...allPts.map(p => p.x)) - 40;
    const rawMaxX = Math.max(...allPts.map(p => p.x)) + 40;
    const rawMinY = Math.min(...allPts.map(p => p.y)) - 40;
    const rawMaxY = Math.max(...allPts.map(p => p.y)) + 40;
    const gridBounds = {
      minX: Math.max(0, rawMinX),
      maxX: rawMaxX,
      minY: Math.max(0, rawMinY),
      maxY: rawMaxY
    };

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        drawMode: true,
        expectedLines,
        gridBounds,
        polygons,
        showGrid: true
      }
    });

  } else if (variant === 'standard_drawing_symmetrical_halves') {
    const allNames = [...(CONTEXT_TIERS?.MIDDLE_BLOCK?.NAMES || []), ...(CONTEXT_TIERS?.LOWER_BLOCK?.NAMES || [])];
    const studentName = allNames.length > 0 ? allNames[getRandomInt(0, allNames.length - 1)] : 'Wei Ling';
    const archetype = getRandomInt(0, 4);

    let polygons = [];
    let expectedLines = [];
    let allPts = [];

    if (archetype === 0) {
      // Archetype 0: Symmetrical Castle Tower / Crest (Vertical Mirror Axis)
      const xm = getRandomInt(7, 9) * 20; // 140, 160, 180
      const yTop = getRandomInt(1, 3) * 20; // 20, 40, 60
      const hRoof = getRandomInt(2, 4) * 20; // 40, 60, 80
      const hWall = getRandomInt(3, 5) * 20; // 60, 80, 100
      const d1 = getRandomInt(3, 7); // battlement width in grid units (3 to 7)
      const d2 = getRandomInt(1, Math.max(1, d1 - 2)); // wall base offset (1 to d1 - 2)
      const totalDist = d1 * 2;
      finalAnswer = String(totalDist);

      const ptT = { x: xm, y: yTop };
      const ptA = { x: xm - d1 * 20, y: yTop + hRoof };
      const ptB = { x: xm - d2 * 20, y: yTop + hRoof + hWall };
      const ptC = { x: xm, y: yTop + hRoof + hWall };

      const ptAReflect = { x: xm + d1 * 20, y: yTop + hRoof };
      const ptBReflect = { x: xm + d2 * 20, y: yTop + hRoof + hWall };

      allPts = [ptT, ptA, ptB, ptC, ptAReflect, ptBReflect, { x: xm, y: yTop - 20 }, { x: xm, y: yTop + hRoof + hWall + 20 }];

      polygons = [
        // Dashed mirror line
        { vertices: [{ x: xm, y: Math.max(0, yTop - 20) }, { x: xm, y: yTop + hRoof + hWall + 20 }], isOpen: true, strokeColor: "#8b5cf6", isDashed: true },
        // Given left half of castle crest
        {
          vertices: [ptT, ptA, ptB, ptC],
          isOpen: true,
          strokeColor: "#3b82f6",
          fillColor: "rgba(59, 130, 246, 0.08)"
        },
        // Labeled vertices
        createLabeledDot(ptT, "T"),
        createLabeledDot(ptA, "A"),
        createLabeledDot(ptB, "B"),
        createLabeledDot(ptC, "C"),
        createLabeledDot(ptAReflect, "A'", "#6366f1"),
        createLabeledDot(ptBReflect, "B'", "#6366f1")
      ];

      expectedLines = [
        { p1: ptT, p2: ptAReflect },
        { p1: ptAReflect, p2: ptBReflect },
        { p1: ptBReflect, p2: ptC }
      ];

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is drawing the missing symmetrical right half of a castle crest on an architect's grid. A purple dashed vertical mirror line runs down the center. The crest's left roof corner (Point A) is located exactly ${d1} grid units to the left of the mirror line. Use the drawing tool to draw the 3 symmetrical lines connecting Points T to A', A' to B', and B' to C. Then calculate the distance of Point A' from the mirror line, and find the total length of the horizontal perpendicular line connecting Point A to Point A'."`;
        const stepsArr = [
          { label: "Visually count the perpendicular grid distance from Point A to the vertical mirror line:", expectedAnswer: String(d1), acceptedAnswers: [] },
          { label: `Because the crest is symmetrical, how many grid units to the right of the mirror line is Point A'?`, expectedAnswer: String(d1), acceptedAnswers: [] },
          { label: `Write the working equation to find the total length of the perpendicular line connecting Point A and Point A' (${d1} + ${d1}):`, expectedAnswer: `${d1} + ${d1} = ${totalDist}`, acceptedAnswers: [`${d1}+${d1}=${totalDist}`, `${d1}x2=${totalDist}`, `2x${d1}=${totalDist}`, `${d1}*2=${totalDist}`, `2*${d1}=${totalDist}`] },
          { label: "Total length of the perpendicular line connecting Point A and Point A':", expectedAnswer: String(totalDist), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is drawing the symmetrical right half of a castle crest across a vertical mirror line. Point A is ${d1} grid units to the left of the mirror line, and its reflection Point A' is ${d1} grid units to the right. Use the drawing tool to draw the symmetrical right half. What is the total length of the horizontal perpendicular line connecting Point A to Point A'?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(d1), String(totalDist + 2), String(d1 * 3), String(totalDist - 2 > 0 ? totalDist - 2 : totalDist + 4)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A castle crest has a vertical mirror line. Corner A is ${d1} grid units to the left of the mirror line. Use the drawing tool to draw the symmetrical right half (T to A', A' to B', and B' to C). Calculate the total length of the horizontal perpendicular line connecting Corner A to Corner A'."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (archetype === 1) {
      // Archetype 1: Symmetrical Diamond Kite / Glider (Horizontal Mirror Axis)
      const ym = getRandomInt(5, 7) * 20; // 100, 120, 140
      const xNose = getRandomInt(2, 4) * 20; // 40, 60, 80
      const wNose = getRandomInt(4, 6) * 20; // 80, 100, 120
      const wTail = getRandomInt(4, 6) * 20; // 80, 100, 120
      const h = getRandomInt(3, 7); // wing height above mirror line (3 to 7)
      const totalDist = h * 2;
      finalAnswer = String(totalDist);

      const ptN = { x: xNose, y: ym };
      const ptP = { x: xNose + wNose, y: ym - h * 20 };
      const ptT = { x: xNose + wNose + wTail, y: ym };
      const ptPReflect = { x: xNose + wNose, y: ym + h * 20 };

      allPts = [ptN, ptP, ptT, ptPReflect, { x: xNose - 20, y: ym }, { x: xNose + wNose + wTail + 20, y: ym }];

      polygons = [
        // Horizontal dashed mirror line
        { vertices: [{ x: Math.max(0, xNose - 20), y: ym }, { x: xNose + wNose + wTail + 20, y: ym }], isOpen: true, strokeColor: "#8b5cf6", isDashed: true },
        // Given top half of the glider
        {
          vertices: [ptN, ptP, ptT],
          isOpen: true,
          strokeColor: "#3b82f6",
          fillColor: "rgba(59, 130, 246, 0.08)"
        },
        // Labeled vertices
        createLabeledDot(ptN, "N"),
        createLabeledDot(ptP, "P"),
        createLabeledDot(ptT, "T"),
        createLabeledDot(ptPReflect, "P'", "#6366f1")
      ];

      expectedLines = [
        { p1: ptN, p2: ptPReflect },
        { p1: ptPReflect, p2: ptT }
      ];

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is building a symmetrical diamond glider. A purple dashed horizontal mirror line represents the central wooden spine. The upper wingtip (Point P) is located exactly ${h} grid units perpendicularly above the mirror line. Use the drawing tool to draw the symmetrical lower wing lines connecting N to P' and P' to T. Then calculate the distance of Point P' below the mirror line, and find the total length of the vertical perpendicular crossbar connecting Point P to Point P'."`;
        const stepsArr = [
          { label: "Visually count the perpendicular grid distance from upper wingtip P down to the horizontal mirror line:", expectedAnswer: String(h), acceptedAnswers: [] },
          { label: `Because the glider is symmetrical, how many grid units below the mirror line is lower wingtip P'?`, expectedAnswer: String(h), acceptedAnswers: [] },
          { label: `Write the working equation to find the total length of the vertical perpendicular crossbar connecting Point P and Point P' (${h} + ${h}):`, expectedAnswer: `${h} + ${h} = ${totalDist}`, acceptedAnswers: [`${h}+${h}=${totalDist}`, `${h}x2=${totalDist}`, `2x${h}=${totalDist}`, `${h}*2=${totalDist}`, `2*${h}=${totalDist}`] },
          { label: "Total length of the perpendicular crossbar connecting Point P and Point P':", expectedAnswer: String(totalDist), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is drawing the symmetrical lower half of a diamond glider across a horizontal mirror line. Upper wingtip P is ${h} grid units above the mirror line, and lower wingtip P' is ${h} grid units below. Use the drawing tool to draw lines NP' and P'T. What is the total length of the vertical perpendicular line connecting Point P to Point P'?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(h), String(totalDist + 2), String(h * 3), String(totalDist - 2 > 0 ? totalDist - 2 : totalDist + 4)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A diamond glider has a horizontal mirror line. Point P is ${h} grid units above the mirror line. Use the drawing tool to draw the symmetrical bottom half (lines NP' and P'T). Find the total length of the vertical perpendicular crossbar connecting Point P to Point P'."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (archetype === 2) {
      // Archetype 2: Symmetrical Butterfly Wings (Vertical Mirror Axis)
      const xm = getRandomInt(7, 9) * 20; // 140, 160, 180
      const yTop = getRandomInt(1, 2) * 20; // 20, 40
      const h1 = getRandomInt(2, 3) * 20; // upper wing height drop
      const h2 = getRandomInt(2, 3) * 20; // waist drop
      const h3 = getRandomInt(2, 3) * 20; // lower wing drop
      const h4 = getRandomInt(2, 3) * 20; // tail drop
      const w1 = getRandomInt(4, 7); // upper wingtip distance (4 to 7)
      const w2 = getRandomInt(2, Math.max(2, w1 - 2)); // lower wingtip distance (2 to w1 - 2)
      const totalDist = w1 * 2;
      finalAnswer = String(totalDist);

      const ptC1 = { x: xm, y: yTop };
      const ptA = { x: xm - w1 * 20, y: yTop + h1 };
      const ptC2 = { x: xm, y: yTop + h1 + h2 };
      const ptB = { x: xm - w2 * 20, y: yTop + h1 + h2 + h3 };
      const ptC3 = { x: xm, y: yTop + h1 + h2 + h3 + h4 };

      const ptAReflect = { x: xm + w1 * 20, y: yTop + h1 };
      const ptBReflect = { x: xm + w2 * 20, y: yTop + h1 + h2 + h3 };

      allPts = [ptC1, ptA, ptC2, ptB, ptC3, ptAReflect, ptBReflect, { x: xm, y: yTop - 20 }, { x: xm, y: yTop + h1 + h2 + h3 + h4 + 20 }];

      polygons = [
        // Dashed mirror line
        { vertices: [{ x: xm, y: Math.max(0, yTop - 20) }, { x: xm, y: yTop + h1 + h2 + h3 + h4 + 20 }], isOpen: true, strokeColor: "#8b5cf6", isDashed: true },
        // Given left wing of butterfly
        {
          vertices: [ptC1, ptA, ptC2, ptB, ptC3],
          isOpen: true,
          strokeColor: "#3b82f6",
          fillColor: "rgba(59, 130, 246, 0.08)"
        },
        // Labeled vertices
        createLabeledDot(ptC1, "C1"),
        createLabeledDot(ptA, "A"),
        createLabeledDot(ptC2, "C2"),
        createLabeledDot(ptB, "B"),
        createLabeledDot(ptC3, "C3"),
        createLabeledDot(ptAReflect, "A'", "#6366f1"),
        createLabeledDot(ptBReflect, "B'", "#6366f1")
      ];

      expectedLines = [
        { p1: ptC1, p2: ptAReflect },
        { p1: ptAReflect, p2: ptC2 },
        { p1: ptC2, p2: ptBReflect },
        { p1: ptBReflect, p2: ptC3 }
      ];

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is drawing a symmetrical butterfly stencil on a craft grid. A purple dashed vertical mirror line represents the butterfly's body axis. The left upper wingtip (Point A) is located exactly ${w1} grid units away from the mirror line. Use the drawing tool to draw the 4 symmetrical lines for the right wing (connecting C1 to A', A' to C2, C2 to B', and B' to C3). Then calculate the distance of Point A' from the mirror line, and find the total length of the horizontal perpendicular line connecting wingtips A and A'."`;
        const stepsArr = [
          { label: "Visually count the perpendicular grid distance from left upper wingtip A to the vertical mirror line:", expectedAnswer: String(w1), acceptedAnswers: [] },
          { label: `Because the butterfly is symmetrical, how many grid units to the right of the mirror line is right upper wingtip A'?`, expectedAnswer: String(w1), acceptedAnswers: [] },
          { label: `Write the working equation to find the total length of the perpendicular line connecting Point A and Point A' (${w1} + ${w1}):`, expectedAnswer: `${w1} + ${w1} = ${totalDist}`, acceptedAnswers: [`${w1}+${w1}=${totalDist}`, `${w1}x2=${totalDist}`, `2x${w1}=${totalDist}`, `${w1}*2=${totalDist}`, `2*${w1}=${totalDist}`] },
          { label: "Total length of the perpendicular line connecting wingtip A and wingtip A':", expectedAnswer: String(totalDist), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is drawing the symmetrical right wing of a butterfly across a vertical mirror line. Upper wingtip A is ${w1} grid units to the left of the mirror line. Use the drawing tool to draw the symmetrical right wing. What is the total length of the horizontal perpendicular line connecting Point A to Point A'?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(w1), String(totalDist + 2), String(w1 * 3), String(totalDist - 2 > 0 ? totalDist - 2 : totalDist + 4)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A butterfly stencil has a vertical mirror line. Upper wingtip A is ${w1} grid units away from the mirror line. Use the drawing tool to draw the right wing. Calculate the total length of the perpendicular line connecting upper wingtips A and A'."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (archetype === 3) {
      // Archetype 3: Symmetrical Space Rocket Fuselage (Vertical Mirror Axis)
      const xm = getRandomInt(7, 9) * 20; // 140, 160, 180
      const yTop = getRandomInt(1, 2) * 20; // 20, 40
      const hNose = getRandomInt(2, 4) * 20; // 40, 60, 80
      const hFin = getRandomInt(3, 5) * 20; // 60, 80, 100
      const s = getRandomInt(1, 3); // body shoulder width (1, 2, 3)
      const d = getRandomInt(s + 2, s + 4); // fin width in grid units (s+2 to s+4)
      const totalDist = d * 2;
      finalAnswer = String(totalDist);

      const ptN = { x: xm, y: yTop };
      const ptS = { x: xm - s * 20, y: yTop + hNose };
      const ptF = { x: xm - d * 20, y: yTop + hNose + hFin };
      const ptE = { x: xm, y: yTop + hNose + hFin };

      const ptSReflect = { x: xm + s * 20, y: yTop + hNose };
      const ptFReflect = { x: xm + d * 20, y: yTop + hNose + hFin };

      allPts = [ptN, ptS, ptF, ptE, ptSReflect, ptFReflect, { x: xm, y: yTop - 20 }, { x: xm, y: yTop + hNose + hFin + 20 }];

      polygons = [
        // Dashed mirror line
        { vertices: [{ x: xm, y: Math.max(0, yTop - 20) }, { x: xm, y: yTop + hNose + hFin + 20 }], isOpen: true, strokeColor: "#8b5cf6", isDashed: true },
        // Given left half of rocket
        {
          vertices: [ptN, ptS, ptF, ptE],
          isOpen: true,
          strokeColor: "#3b82f6",
          fillColor: "rgba(59, 130, 246, 0.08)"
        },
        // Labeled vertices
        createLabeledDot(ptN, "N"),
        createLabeledDot(ptS, "S"),
        createLabeledDot(ptF, "F"),
        createLabeledDot(ptE, "E"),
        createLabeledDot(ptSReflect, "S'", "#6366f1"),
        createLabeledDot(ptFReflect, "F'", "#6366f1")
      ];

      expectedLines = [
        { p1: ptN, p2: ptSReflect },
        { p1: ptSReflect, p2: ptFReflect },
        { p1: ptFReflect, p2: ptE }
      ];

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is completing the blueprint for a symmetrical space rocket on a design grid. A purple dashed vertical mirror line runs down the center of the fuselage. The left stabilizer fin tip (Point F) is located exactly ${d} grid units to the left of the mirror line. Use the drawing tool to draw the 3 symmetrical lines for the right side (connecting N to S', S' to F', and F' to E). Then calculate the distance of Point F' from the mirror line, and find the total span of the horizontal perpendicular line connecting fin tips F and F'."`;
        const stepsArr = [
          { label: "Visually count the perpendicular grid distance from left fin tip F to the vertical mirror line:", expectedAnswer: String(d), acceptedAnswers: [] },
          { label: `Because the rocket is symmetrical, how many grid units to the right of the mirror line is right fin tip F'?`, expectedAnswer: String(d), acceptedAnswers: [] },
          { label: `Write the working equation to find the total length of the perpendicular line connecting fin tip F and fin tip F' (${d} + ${d}):`, expectedAnswer: `${d} + ${d} = ${totalDist}`, acceptedAnswers: [`${d}+${d}=${totalDist}`, `${d}x2=${totalDist}`, `2x${d}=${totalDist}`, `${d}*2=${totalDist}`, `2*${d}=${totalDist}`] },
          { label: "Total length of the perpendicular line connecting fin tip F and fin tip F':", expectedAnswer: String(totalDist), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is drawing the symmetrical right fin of a space rocket across a vertical mirror line. Left fin tip F is ${d} grid units to the left of the mirror line. Use the drawing tool to draw the symmetrical right side. What is the total length of the horizontal perpendicular line connecting fin tip F to fin tip F'?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(d), String(totalDist + 2), String(d * 3), String(totalDist - 2 > 0 ? totalDist - 2 : totalDist + 4)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A space rocket blueprint has a vertical center mirror line. Stabilizer fin tip F is ${d} grid units away from the mirror line. Use the drawing tool to draw the symmetrical right half (N to S', S' to F', and F' to E). Calculate the total span of the perpendicular line connecting fin tip F to fin tip F'."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else {
      // Archetype 4: Symmetrical Arrowhead Emblem / Shield (Vertical Mirror Axis)
      const xm = getRandomInt(7, 9) * 20; // 140, 160, 180
      const yTop = getRandomInt(1, 2) * 20; // 20, 40
      const hFlare = getRandomInt(3, 5) * 20; // 60, 80, 100
      const hShaft = getRandomInt(2, 4) * 20; // 40, 60, 80
      const wTip = getRandomInt(4, 7); // arrowhead outer flare in grid units (4 to 7)
      const wBarb = getRandomInt(1, Math.max(1, wTip - 3)); // inner barb notch (1 to wTip - 3)
      const totalDist = wTip * 2;
      finalAnswer = String(totalDist);

      const ptApex = { x: xm, y: yTop };
      const ptWing = { x: xm - wTip * 20, y: yTop + hFlare };
      const ptBarb = { x: xm - wBarb * 20, y: yTop + hFlare - 20 };
      const ptBase = { x: xm - wBarb * 20, y: yTop + hFlare + hShaft };
      const ptCenterBase = { x: xm, y: yTop + hFlare + hShaft };

      const ptWingReflect = { x: xm + wTip * 20, y: yTop + hFlare };
      const ptBarbReflect = { x: xm + wBarb * 20, y: yTop + hFlare - 20 };
      const ptBaseReflect = { x: xm + wBarb * 20, y: yTop + hFlare + hShaft };

      allPts = [ptApex, ptWing, ptBarb, ptBase, ptCenterBase, ptWingReflect, ptBarbReflect, ptBaseReflect, { x: xm, y: yTop - 20 }, { x: xm, y: yTop + hFlare + hShaft + 20 }];

      polygons = [
        // Dashed mirror line
        { vertices: [{ x: xm, y: Math.max(0, yTop - 20) }, { x: xm, y: yTop + hFlare + hShaft + 20 }], isOpen: true, strokeColor: "#8b5cf6", isDashed: true },
        // Given left half of arrowhead emblem
        {
          vertices: [ptApex, ptWing, ptBarb, ptBase, ptCenterBase],
          isOpen: true,
          strokeColor: "#3b82f6",
          fillColor: "rgba(59, 130, 246, 0.08)"
        },
        // Labeled vertices
        createLabeledDot(ptApex, "T"),
        createLabeledDot(ptWing, "W"),
        createLabeledDot(ptBarb, "B"),
        createLabeledDot(ptBase, "S"),
        createLabeledDot(ptCenterBase, "C"),
        createLabeledDot(ptWingReflect, "W'", "#6366f1"),
        createLabeledDot(ptBarbReflect, "B'", "#6366f1"),
        createLabeledDot(ptBaseReflect, "S'", "#6366f1")
      ];

      expectedLines = [
        { p1: ptApex, p2: ptWingReflect },
        { p1: ptWingReflect, p2: ptBarbReflect },
        { p1: ptBarbReflect, p2: ptBaseReflect },
        { p1: ptBaseReflect, p2: ptCenterBase }
      ];

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is drawing the symmetrical right half of an arrowhead badge on a craft grid. A purple dashed vertical mirror line runs down the center axis. The left outer wingtip (Point W) is located exactly ${wTip} grid units to the left of the mirror line. Use the drawing tool to draw the 4 symmetrical lines for the right side (connecting T to W', W' to B', B' to S', and S' to C). Then calculate the distance of Point W' from the mirror line, and find the total span of the horizontal perpendicular line connecting wingtips W and W'."`;
        const stepsArr = [
          { label: "Visually count the perpendicular grid distance from left wingtip W to the vertical mirror line:", expectedAnswer: String(wTip), acceptedAnswers: [] },
          { label: `Because the badge is symmetrical, how many grid units to the right of the mirror line is right wingtip W'?`, expectedAnswer: String(wTip), acceptedAnswers: [] },
          { label: `Write the working equation to find the total length of the perpendicular line connecting Point W and Point W' (${wTip} + ${wTip}):`, expectedAnswer: `${wTip} + ${wTip} = ${totalDist}`, acceptedAnswers: [`${wTip}+${wTip}=${totalDist}`, `${wTip}x2=${totalDist}`, `2x${wTip}=${totalDist}`, `${wTip}*2=${totalDist}`, `2*${wTip}=${totalDist}`] },
          { label: "Total length of the perpendicular line connecting wingtip W and wingtip W':", expectedAnswer: String(totalDist), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is drawing the symmetrical right side of an arrowhead badge across a vertical mirror line. Left wingtip W is ${wTip} grid units to the left of the mirror line. Use the drawing tool to draw the symmetrical right side. What is the total length of the horizontal perpendicular line connecting Point W to Point W'?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [String(wTip), String(totalDist + 2), String(wTip * 3), String(totalDist - 2 > 0 ? totalDist - 2 : totalDist + 4)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An arrowhead badge has a vertical mirror line. Wingtip W is ${wTip} grid units away from the mirror line. Use the drawing tool to draw the symmetrical right half (T to W', W' to B', B' to S', and S' to C). Calculate the total span of the perpendicular line connecting wingtip W to wingtip W'."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    }

    const rawMinX = Math.min(...allPts.map(p => p.x)) - 40;
    const rawMaxX = Math.max(...allPts.map(p => p.x)) + 40;
    const rawMinY = Math.min(...allPts.map(p => p.y)) - 40;
    const rawMaxY = Math.max(...allPts.map(p => p.y)) + 40;
    const gridBounds = {
      minX: Math.max(0, rawMinX),
      maxX: rawMaxX,
      minY: Math.max(0, rawMinY),
      maxY: rawMaxY
    };

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        drawMode: true,
        expectedLines,
        gridBounds,
        polygons,
        showGrid: true
      }
    });
  }

  const formattedPrompt = `You are generating a Primary 3 Math question.
${getFormatInstructions(visualEngineStr, inputRequirementStr)}
Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${finalAnswer}
${mcqOptionsPrompt}
CRITICAL: Do not explain the math inside the questionText. Leave it as a puzzle for the student.`;

  return { aiPrompt: formattedPrompt };
};
