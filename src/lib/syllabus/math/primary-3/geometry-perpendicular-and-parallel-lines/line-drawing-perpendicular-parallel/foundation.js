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

export const generateFoundation = (variant, type, getFormatInstructions) => {
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

  if (variant === 'foundation_orthogonal_perpendiculars') {
    // Keep lengths small so they fit in a 300x300 (15x15 unit) grid
    const masterLen = getRandomInt(3, 5);
    const multiplier = masterLen === 5 ? 2 : getRandomInt(2, 3);
    const isHorizontal = Math.random() > 0.5;
    
    // Master line AB
    let startA, endB;
    if (isHorizontal) {
      // If horizontal, BC goes UP, so AB must be near the BOTTOM
      startA = {x: 40, y: 260};
      endB = {x: 40 + masterLen * 20, y: 260};
    } else {
      // If vertical, BC goes LEFT, so AB must be near the RIGHT
      startA = {x: 260, y: 40};
      endB = {x: 260, y: 40 + masterLen * 20};
    }
    
    const lenBC = masterLen * multiplier;
    const isDiff = Math.random() > 0.5;
    let lenCD = masterLen;
    let drawnLinesStr = "";
    
    let totalLen = 0;
    
    if (isDiff) {
      const diff = getRandomInt(1, 3);
      const isShorter = Math.random() > 0.5 && masterLen > diff;
      const bcLen = isShorter ? masterLen - diff : masterLen + diff;
      const directionStr = isHorizontal ? "going upwards" : "going to the left";
      drawnLinesStr = `Line BC is ${diff} units ${isShorter ? "shorter" : "longer"} than Line AB, ${directionStr}`;
      totalLen = masterLen + bcLen + lenCD;
      
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"On the square grid, Line AB is already drawn. Wei Ling is asked to draw Line BC perfectly perpendicular to Line AB. ${drawnLinesStr}. Finally, she draws Line CD perfectly parallel to Line AB, and it is exactly the same length as Line AB. Look at the grid to find the length of Line AB, then calculate the total length of all 3 lines she drew."`;

      finalAnswer = String(totalLen);
      
      if (isStructure) {
        const stepsArr = [
          { label: "Visually count the grid units for Line AB on the screen:", expectedAnswer: String(masterLen), acceptedAnswers: [] },
          { label: `Write the working equation to find the length of the perpendicular Line BC:`, expectedAnswer: isShorter ? `${masterLen} - ${diff} = ${bcLen}` : `${masterLen} + ${diff} = ${bcLen}`, acceptedAnswers: [] },
          { label: "Write the working equation to find the total length of all 3 lines (AB + BC + CD):", expectedAnswer: `${masterLen} + ${bcLen} + ${lenCD} = ${totalLen}`, acceptedAnswers: [] },
          { label: "Total length of the drawn lines:", expectedAnswer: String(totalLen), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Line AB is drawn. You draw Line BC perpendicular to it, ${directionStr}. ${drawnLinesStr}. Then you draw Line CD perfectly parallel to AB, same length as AB. What is the total length of all 3 lines?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(masterLen + bcLen),
          String(totalLen + 2),
          String(totalLen - 2 > 0 ? totalLen - 2 : totalLen + 4),
          String(masterLen * 2 + diff)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Line AB is drawn. You draw Line BC perpendicular to it, ${directionStr}. ${drawnLinesStr}. Finally, you draw Line CD parallel to AB (same length as AB). Find the total length of all 3 lines."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    } else {
      totalLen = masterLen + lenBC + lenCD;
      const directionStr = isHorizontal ? "going upwards" : "going to the left";
      drawnLinesStr = `Line BC is exactly ${multiplier} times as long as Line AB, ${directionStr}`;
      
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"On the square grid, Line AB is already drawn. Wei Ling is asked to draw Line BC perfectly perpendicular to Line AB. ${drawnLinesStr}. Finally, she draws Line CD perfectly parallel to Line AB, and it is exactly the same length as Line AB. Look at the grid to find the length of Line AB, then calculate the total length of all 3 lines she drew."`;

      finalAnswer = String(totalLen);

      if (isStructure) {
        const stepsArr = [
          { label: "Visually count the grid units for Line AB on the screen:", expectedAnswer: String(masterLen), acceptedAnswers: [] },
          { label: `Write the working equation to find the length of the perpendicular Line BC:`, expectedAnswer: `${masterLen} x ${multiplier} = ${lenBC}`, acceptedAnswers: [`${multiplier}x${masterLen}=${lenBC}`] },
          { label: "Write the working equation to find the total length of all 3 lines (AB + BC + CD):", expectedAnswer: `${masterLen} + ${lenBC} + ${lenCD} = ${totalLen}`, acceptedAnswers: [] },
          { label: "Total length of the drawn lines:", expectedAnswer: String(totalLen), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Line AB is drawn. You draw Line BC perpendicular to it, ${directionStr}. ${drawnLinesStr}. Then you draw Line CD perfectly parallel to AB, same length as AB. What is the total length of all 3 lines?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(masterLen + lenBC),
          String(totalLen + 2),
          String(totalLen - 2 > 0 ? totalLen - 2 : totalLen + 4),
          String(masterLen * multiplier + multiplier)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Line AB is drawn. You draw Line BC perpendicular to it, ${directionStr}. ${drawnLinesStr}. Finally, you draw Line CD parallel to AB (same length as AB). Find the total length of all 3 lines."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    }
    let ptC, ptD;
    let expectedLines = [];
    if (isHorizontal) {
      const ptB = endB;
      ptC = { x: ptB.x, y: ptB.y - lenBC * 20 };
      ptD = { x: startA.x, y: ptC.y };
      expectedLines = [
        { p1: ptB, p2: ptC },
        { p1: ptC, p2: ptD }
      ];
    } else {
      const ptB = endB;
      ptC = { x: ptB.x - lenBC * 20, y: ptB.y };
      ptD = { x: ptC.x, y: startA.y };
      expectedLines = [
        { p1: ptB, p2: ptC },
        { p1: ptC, p2: ptD }
      ];
    }

    // Dynamic grid space based on the points, plus 2 grid units (40px) padding
    const rawMinX = Math.min(startA.x, endB.x, ptC.x, ptD.x) - 40;
    const rawMaxX = Math.max(startA.x, endB.x, ptC.x, ptD.x) + 40;
    const rawMinY = Math.min(startA.y, endB.y, ptC.y, ptD.y) - 40;
    const rawMaxY = Math.max(startA.y, endB.y, ptC.y, ptD.y) + 40;
    
    // Snap bounds to 100-unit (5-block) milestones to align major grid lines perfectly
    const gridBounds = { 
      minX: rawMinX, 
      maxX: rawMaxX, 
      minY: rawMinY, 
      maxY: rawMaxY 
    };

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        drawMode: true,
        drawLabels: ["C", "D"], // For the toolbar buttons
        expectedLabels: { "C": ptC, "D": ptD },
        expectedLines,
        gridBounds,
        polygons: [
          { vertices: [startA, endB], isOpen: true, strokeColor: "#3b82f6" },
          createLabeledDot(startA, "A"),
          createLabeledDot(endB, "B")
        ],
        showGrid: true
      }
    });

  } else if (variant === 'foundation_selecting_grid_parallel' || variant === 'foundation_selecting_grid_perpendicular') {
    const isParallel = variant === 'foundation_selecting_grid_parallel';
    const isHorizontal = Math.random() > 0.5;
    const masterLen = getRandomInt(3, 7);
    const drawnLen = getRandomInt(2, 5);
    
    let startA, endB;
    if (isHorizontal) {
      startA = {x: 40, y: 40};
      endB = {x: 40 + masterLen * 20, y: 40};
    } else {
      startA = {x: 40, y: 40};
      endB = {x: 40, y: 40 + masterLen * 20};
    }

    let startC;
    if (isHorizontal) {
      startC = {x: 60, y: 100};
    } else {
      startC = {x: 100, y: 60};
    }

    // Candidate Points
    let trueD;
    if (isParallel) {
      trueD = isHorizontal ? {x: startC.x + drawnLen * 20, y: startC.y} : {x: startC.x, y: startC.y + drawnLen * 20};
    } else {
      trueD = isHorizontal ? {x: startC.x, y: startC.y + drawnLen * 20} : {x: startC.x + drawnLen * 20, y: startC.y};
    }
    
    // Fakes
    const fake1 = isHorizontal ? {x: startC.x + drawnLen * 20, y: startC.y + 40} : {x: startC.x + 40, y: startC.y + drawnLen * 20};
    const fake2 = isHorizontal ? {x: startC.x - 20, y: startC.y + (isParallel ? 20 : 0)} : {x: startC.x + (isParallel ? 20 : 0), y: startC.y - 20};
    const fake3 = isHorizontal ? {x: startC.x + 40, y: startC.y - (isParallel ? 40 : 20)} : {x: startC.x - (isParallel ? 40 : 20), y: startC.y + 40};

    const candidates = [trueD, fake1, fake2, fake3];
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const candidateLabels = ["P", "Q", "R", "S"];
    let correctAnswerLabel = "";
    const candidatePolygons = candidates.map((pt, idx) => {
      if (pt.x === trueD.x && pt.y === trueD.y) correctAnswerLabel = candidateLabels[idx];
      return createLabeledDot(pt, candidateLabels[idx], "#ef4444");
    });
    
    const conditionStr = isParallel ? "perfectly parallel to" : "perfectly perpendicular to";
    
    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A graphic designer has drawn Line AB on the grid. She places a new starting Point C. She wants to draw a line from Point C to one of the marked points (P, Q, R, or S) so that the new line is ${conditionStr} Line AB. Use the drawing tool to draw this line. Then, count the grid units to find the total length of Line AB and the newly drawn line combined."`;
      const stepsArr = [
        { label: `To draw a line ${conditionStr} Line AB, which point must you connect Point C to?`, expectedAnswer: correctAnswerLabel, acceptedAnswers: [`Point ${correctAnswerLabel}`] },
        { label: "Visually count the grid units for Line AB:", expectedAnswer: String(masterLen), acceptedAnswers: [] },
        { label: "Visually count the grid units for your new drawn line:", expectedAnswer: String(drawnLen), acceptedAnswers: [] },
        { label: "Write the working equation to find their total combined length:", expectedAnswer: `${masterLen} + ${drawnLen} = ${masterLen + drawnLen}`, acceptedAnswers: [`${drawnLen}+${masterLen}=${masterLen + drawnLen}`] },
        { label: "Total combined length:", expectedAnswer: String(masterLen + drawnLen), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(masterLen + drawnLen);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Line AB is drawn. Use the drawing tool to draw a line from Point C that is ${conditionStr} Line AB. Which point did you connect it to?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = `Point ${correctAnswerLabel}`;
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "Point P"\n- "Point Q"\n- "Point R"\n- "Point S"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Draw a line from Point C to form a line ${conditionStr} Line AB, then find the combined length in grid units."`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(masterLen + drawnLen);
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        drawMode: true,
        expectedLines: [{ p1: startC, p2: trueD }],
        polygons: [
          { vertices: [startA, endB], isOpen: true, strokeColor: "#3b82f6" },
          createLabeledDot(startA, "A"),
          createLabeledDot(endB, "B"),
          createLabeledDot(startC, "C"),
          ...candidatePolygons
        ],
        showGrid: true
      }
    });

  } else if (variant === 'foundation_verifying_drawn_lines') {
    const isMasterHoriz = Math.random() > 0.5;
    const isRuleParallel = Math.random() > 0.5;
    const modifierTypes = ['longer', 'shorter', 'times'];
    const modType = modifierTypes[Math.floor(Math.random() * modifierTypes.length)];
    
    let masterLen = 4;
    let modVal = 2;
    let targetLen = 4;
    if (modType === 'longer') {
      masterLen = getRandomInt(3, 5);
      modVal = getRandomInt(2, 4);
      targetLen = masterLen + modVal;
    } else if (modType === 'shorter') {
      masterLen = getRandomInt(5, 8);
      modVal = getRandomInt(2, 4);
      targetLen = masterLen - modVal;
    } else {
      masterLen = getRandomInt(2, 4);
      modVal = getRandomInt(2, 3);
      targetLen = masterLen * modVal;
    }

    const mx = 60;
    const my = 60;
    const mP1 = {x: mx, y: my};
    const mP2 = isMasterHoriz ? {x: mx + masterLen * 20, y: my} : {x: mx, y: my + masterLen * 20};

    const correctHoriz = isRuleParallel ? isMasterHoriz : !isMasterHoriz;
    
    const trueC = { horiz: correctHoriz, len: targetLen };
    const fake1 = { horiz: correctHoriz, len: targetLen === masterLen ? targetLen + 1 : masterLen };
    const fake2 = { horiz: !correctHoriz, len: targetLen };
    const fake3 = { horiz: !correctHoriz, len: fake1.len };
    
    const candidates = [trueC, fake1, fake2, fake3];
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const candidateLabels = ["P", "Q", "R", "S"];
    let correctAnswerLabel = "";
    
    const placements = [
      {x: 180, y: 60},
      {x: 60, y: 220},
      {x: 180, y: 220},
      {x: 320, y: 140}
    ];

    const polys = [
      { vertices: [mP1, mP2], isOpen: true, strokeColor: "#3b82f6" },
      createLabeledDot(mP1, "M")
    ];
    
    candidates.forEach((cand, idx) => {
      if (cand === trueC) correctAnswerLabel = candidateLabels[idx];
      const pt = placements[idx];
      const p2 = cand.horiz ? {x: pt.x + cand.len * 20, y: pt.y} : {x: pt.x, y: pt.y + cand.len * 20};
      polys.push({ vertices: [pt, p2], isOpen: true, strokeColor: "#ef4444" });
      polys.push(createLabeledDot(pt, candidateLabels[idx], "#ef4444"));
    });

    const ruleStr = isRuleParallel ? "parallel to" : "perpendicular to";
    let modStr = "";
    let eqStr = "";
    if (modType === 'longer') {
      modStr = `exactly ${modVal} units longer than Line M`;
      eqStr = `${masterLen} + ${modVal} = ${targetLen}`;
    } else if (modType === 'shorter') {
      modStr = `exactly ${modVal} units shorter than Line M`;
      eqStr = `${masterLen} - ${modVal} = ${targetLen}`;
    } else {
      modStr = `exactly ${modVal} times the length of Line M`;
      eqStr = `${masterLen} x ${modVal} = ${targetLen}`;
    }

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A teacher draws a master line, Line M, on the grid paper. She tells the class: 'Draw a line perfectly ${ruleStr} Line M, and make it ${modStr}.' Four students drew Line P, Line Q, Line R, and Line S. Visually inspect the grid to determine the length of Line M, figure out the required length of the new drawn line, and identify which student's line is correct."`;
      const stepsArr = [
        { label: "Visually count the grid units for the teacher's Line M:", expectedAnswer: String(masterLen), acceptedAnswers: [] },
        { label: `Write the working equation to find the required length of the new ${isRuleParallel ? 'parallel' : 'perpendicular'} drawn line:`, expectedAnswer: eqStr, acceptedAnswers: [] },
        { label: `Visually check the candidate lines on the grid. Which line is drawn perfectly ${ruleStr} Line M AND is exactly ${targetLen} units long?`, expectedAnswer: `Line ${correctAnswerLabel}`, acceptedAnswers: [correctAnswerLabel] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = `Line ${correctAnswerLabel}`;
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The teacher asked you to draw a line perfectly ${ruleStr} Line M. The line must also be ${modStr}. Which drawn line on the grid is correct?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = `Line ${correctAnswerLabel}`;
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "Line P"\n- "Line Q"\n- "Line R"\n- "Line S"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Line M is drawn. You are asked to draw a line ${ruleStr} Line M that is ${modStr}. By looking at the grid, which line (P, Q, R, or S) is drawn correctly?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = `Line ${correctAnswerLabel}`;
    }
    
    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        hideToolbar: true,
        polygons: polys,
        showGrid: true
      }
    });

  } else if (variant === 'foundation_drawing_concentric_frames') {
    const shapeType = getRandomInt(1, 3); // 1 = Rectangle (all 4 sides), 2 = L-Shaped Polygon, 3 = Right Trapezoid

    if (shapeType === 1) {
      // Shape 1: Closed Rectangle ABCD - parallel to all 4 internal edges, external lines perpendicular at corners
      const innerW = getRandomInt(3, 6);
      const innerH = getRandomInt(3, 5);
      
      const distVariation = getRandomInt(1, 3);
      let topOffset, bottomOffset, leftOffset, rightOffset;
      if (distVariation === 1) {
        const d = getRandomInt(1, 2);
        topOffset = bottomOffset = leftOffset = rightOffset = d;
      } else if (distVariation === 2) {
        leftOffset = rightOffset = getRandomInt(1, 2);
        topOffset = bottomOffset = (leftOffset === 1 ? 2 : 1);
      } else {
        topOffset = getRandomInt(1, 2);
        bottomOffset = getRandomInt(1, 2);
        leftOffset = getRandomInt(1, 2);
        rightOffset = getRandomInt(1, 2);
      }

      const outerW = innerW + leftOffset + rightOffset;
      const outerH = innerH + topOffset + bottomOffset;
      const totalPerimeter = outerW * 2 + outerH * 2;

      let offsetDesc = "";
      if (topOffset === bottomOffset && leftOffset === rightOffset && topOffset === leftOffset) {
        offsetDesc = `exactly ${topOffset} grid unit(s) away on all 4 sides`;
      } else if (topOffset === bottomOffset && leftOffset === rightOffset) {
        offsetDesc = `exactly ${leftOffset} grid unit(s) away on the left and right sides, and ${topOffset} grid unit(s) away on the top and bottom sides`;
      } else {
        offsetDesc = `exactly ${topOffset} grid unit(s) above Line AD, ${bottomOffset} grid unit(s) below Line BC, ${leftOffset} grid unit(s) to the left of Line AB, and ${rightOffset} grid unit(s) to the right of Line CD`;
      }

      const ax = 80, ay = 80;
      const bx = 80, by = 80 + innerH * 20;
      const cx = 80 + innerW * 20, cy = 80 + innerH * 20;
      const dx = 80 + innerW * 20, dy = 80;

      const pTL = { x: ax - leftOffset * 20, y: ay - topOffset * 20 };
      const pBL = { x: ax - leftOffset * 20, y: by + bottomOffset * 20 };
      const pBR = { x: cx + rightOffset * 20, y: cy + bottomOffset * 20 };
      const pTR = { x: dx + rightOffset * 20, y: dy - topOffset * 20 };

      const outerTop = { p1: pTL, p2: pTR };
      const outerBottom = { p1: pBL, p2: pBR };
      const outerLeft = { p1: pTL, p2: pBL };
      const outerRight = { p1: pTR, p2: pBR };

      const allOuterLines = [outerTop, outerBottom, outerLeft, outerRight];

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An inner rectangular box ABCD is drawn on a square grid. You want to draw a complete outer rectangular frame that surrounds box ABCD based on these spacing instructions: ${offsetDesc}. Use the drawing tool to draw the complete outer frame (all 4 outer lines). Visually count the inner grid lengths, calculate the width and height of the new outer frame, and find the total perimeter (total length of all 4 drawn outer lines)."`;
        
        const wEqAccepted = [
          `${innerW}+${leftOffset}+${rightOffset}=${outerW}`,
          `${leftOffset}+${innerW}+${rightOffset}=${outerW}`
        ];
        if (leftOffset === rightOffset) {
          wEqAccepted.push(`${innerW} + ${leftOffset * 2} = ${outerW}`);
          wEqAccepted.push(`${innerW}+${leftOffset * 2}=${outerW}`);
        }

        const hEqAccepted = [
          `${innerH}+${topOffset}+${bottomOffset}=${outerH}`,
          `${topOffset}+${innerH}+${bottomOffset}=${outerH}`
        ];
        if (topOffset === bottomOffset) {
          hEqAccepted.push(`${innerH} + ${topOffset * 2} = ${outerH}`);
          hEqAccepted.push(`${innerH}+${topOffset * 2}=${outerH}`);
        }

        const perimAccepted = [
          `${outerW} + ${outerH} + ${outerW} + ${outerH} = ${totalPerimeter}`,
          `${outerH} + ${outerW} + ${outerH} + ${outerW} = ${totalPerimeter}`,
          `${outerH} + ${outerH} + ${outerW} + ${outerW} = ${totalPerimeter}`,
          `2 x (${outerW} + ${outerH}) = ${totalPerimeter}`,
          `2 x ${outerW} + 2 x ${outerH} = ${totalPerimeter}`,
          `${outerW} x 2 + ${outerH} x 2 = ${totalPerimeter}`,
          `${outerW}+${outerW}+${outerH}+${outerH}=${totalPerimeter}`,
          `${outerH}+${outerW}+${outerH}+${outerW}=${totalPerimeter}`,
          `(${outerW} + ${outerH}) x 2 = ${totalPerimeter}`
        ];

        const stepsArr = [
          { label: "Visually count the length of the inner horizontal edge BC (in grid units):", expectedAnswer: String(innerW), acceptedAnswers: [] },
          { label: "Write the working equation to find the width of the new outer frame:", expectedAnswer: `${innerW} + ${leftOffset} + ${rightOffset} = ${outerW}`, acceptedAnswers: wEqAccepted },
          { label: "Visually count the length of the inner vertical edge AB (in grid units):", expectedAnswer: String(innerH), acceptedAnswers: [] },
          { label: "Write the working equation to find the height of the new outer frame:", expectedAnswer: `${innerH} + ${topOffset} + ${bottomOffset} = ${outerH}`, acceptedAnswers: hEqAccepted },
          { label: "Write the working equation to find the total length (perimeter) of all 4 drawn outer lines:", expectedAnswer: `${outerW} + ${outerW} + ${outerH} + ${outerH} = ${totalPerimeter}`, acceptedAnswers: perimAccepted }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(totalPerimeter);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An inner rectangular box ABCD is drawn on a square grid. An outer rectangular frame is drawn around it based on the spacing: ${offsetDesc}. Use the drawing tool to draw all 4 lines of the outer frame. What is the total length (perimeter) of the drawn outer frame?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(totalPerimeter);
        const opts = getFourOptions(finalAnswer, [
          String(outerW + outerH),
          String(totalPerimeter - 4 > 0 ? totalPerimeter - 4 : totalPerimeter + 6),
          String(totalPerimeter + 4),
          String(innerW * 2 + innerH * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An inner rectangular box ABCD is drawn on a square grid. Draw the complete outer rectangular frame around it based on the spacing: ${offsetDesc}. Use the drawing tool to draw all 4 lines of the outer frame. Find the total perimeter (total length of all 4 drawn lines) of the outer frame."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(totalPerimeter);
      }

      visualEngineStr = JSON.stringify({
        componentToRender: "LINE_AND_POLYGON",
        componentData: {
          drawMode: true,
          expectedLines: allOuterLines,
          polygons: [
            { 
              vertices: [{x: ax, y: ay}, {x: bx, y: by}, {x: cx, y: cy}, {x: dx, y: dy}], 
              isOpen: false, 
              strokeColor: "#3b82f6",
              fillColor: "rgba(59, 130, 246, 0.08)"
            },
            createLabeledDot({x: ax, y: ay}, "A"),
            createLabeledDot({x: bx, y: by}, "B"),
            createLabeledDot({x: cx, y: cy}, "C"),
            createLabeledDot({x: dx, y: dy}, "D")
          ],
          showGrid: true
        }
      });

    } else if (shapeType === 2) {
      // Shape 2: L-shaped orthogonal polygon ABCDEF (6 vertices)
      // External lines are drawn parallel to specific edges (AB and BC) and are perpendicular to each other at the corner
      const totalW = getRandomInt(5, 7);
      const totalH = getRandomInt(5, 7);
      const cutW = getRandomInt(2, totalW - 2);
      const cutH = getRandomInt(2, totalH - 2);
      
      const leftOffset = getRandomInt(1, 2);
      const bottomOffset = getRandomInt(1, 2);
      const topOffset = getRandomInt(1, 2);
      const rightOffset = getRandomInt(1, 2);

      const ax = 80, ay = 80;
      const bx = ax, by = ay + totalH * 20;
      const cx = ax + totalW * 20, cy = by;
      const dx = cx, dy = ay + (totalH - cutH) * 20;
      const ex = ax + (totalW - cutW) * 20, ey = dy;
      const fx = ex, fy = ay;

      const outerH = totalH + topOffset + bottomOffset;
      const outerW = totalW + leftOffset + rightOffset;
      const totalSum = outerH + outerW;

      // Line 1: parallel to vertical edge AB, offset by leftOffset units
      // Line 2: parallel to horizontal edge BC, offset by bottomOffset units
      // They intersect at (ax - leftOffset * 20, by + bottomOffset * 20) perpendicularly!
      const pCorner = { x: ax - leftOffset * 20, y: by + bottomOffset * 20 };
      const pTop = { x: ax - leftOffset * 20, y: ay - topOffset * 20 };
      const pRight = { x: cx + rightOffset * 20, y: by + bottomOffset * 20 };

      const outerVert = { p1: pTop, p2: pCorner };
      const outerHoriz = { p1: pCorner, p2: pRight };

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An L-shaped polygon ABCDEF is drawn on the square grid. You are instructed to draw two new outer boundary lines: (1) a vertical line parallel to Line AB, placed exactly ${leftOffset} grid unit(s) to the left (extended ${topOffset} unit(s) above Point A and ${bottomOffset} unit(s) below Point B), and (2) a horizontal line parallel to Line BC, placed exactly ${bottomOffset} grid unit(s) below (extended ${leftOffset} unit(s) to the left of Point B and ${rightOffset} unit(s) to the right of Point C). Notice that the two newly drawn lines meet and are perpendicular to each other at the outer corner. Visually count the inner lengths, calculate the lengths of the two new lines, and find their total combined length."`;

        const vEqAccepted = [
          `${totalH}+${topOffset}+${bottomOffset}=${outerH}`,
          `${topOffset}+${totalH}+${bottomOffset}=${outerH}`
        ];
        if (topOffset === bottomOffset) {
          vEqAccepted.push(`${totalH} + ${topOffset * 2} = ${outerH}`);
          vEqAccepted.push(`${totalH}+${topOffset * 2}=${outerH}`);
        }

        const hEqAccepted = [
          `${totalW}+${leftOffset}+${rightOffset}=${outerW}`,
          `${leftOffset}+${totalW}+${rightOffset}=${outerW}`
        ];
        if (leftOffset === rightOffset) {
          hEqAccepted.push(`${totalW} + ${leftOffset * 2} = ${outerW}`);
          hEqAccepted.push(`${totalW}+${leftOffset * 2}=${outerW}`);
        }

        const sumAccepted = [
          `${outerW} + ${outerH} = ${totalSum}`,
          `${outerH}+${outerW}=${totalSum}`,
          `${outerW}+${outerH}=${totalSum}`
        ];

        const stepsArr = [
          { label: "Visually count the length of the inner vertical edge AB (in grid units):", expectedAnswer: String(totalH), acceptedAnswers: [] },
          { label: "Write the working equation to find the length of the new outer vertical line (parallel to AB):", expectedAnswer: `${totalH} + ${topOffset} + ${bottomOffset} = ${outerH}`, acceptedAnswers: vEqAccepted },
          { label: "Visually count the length of the inner horizontal edge BC (in grid units):", expectedAnswer: String(totalW), acceptedAnswers: [] },
          { label: "Write the working equation to find the length of the new outer horizontal line (parallel to BC):", expectedAnswer: `${totalW} + ${leftOffset} + ${rightOffset} = ${outerW}`, acceptedAnswers: hEqAccepted },
          { label: "Write the working equation to find the total combined length of these two perpendicular outer lines:", expectedAnswer: `${outerH} + ${outerW} = ${totalSum}`, acceptedAnswers: sumAccepted }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(totalSum);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An L-shaped polygon ABCDEF is drawn on the grid. Draw an outer vertical line parallel to Line AB (${leftOffset} unit(s) to the left) and an outer horizontal line parallel to Line BC (${bottomOffset} unit(s) below), meeting perpendicularly at the outer corner. What is the total combined length of the two newly drawn lines?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(totalSum);
        const opts = getFourOptions(finalAnswer, [
          String(outerH),
          String(outerW),
          String(totalSum - 2 > 0 ? totalSum - 2 : totalSum + 4),
          String(totalW + totalH)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An L-shaped polygon ABCDEF is drawn on the grid. Draw a vertical line parallel to Line AB (${leftOffset} unit(s) to the left) and a horizontal line parallel to Line BC (${bottomOffset} unit(s) below). The two lines meet perpendicularly at the outer corner. Find the total combined length of both drawn lines."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(totalSum);
      }

      visualEngineStr = JSON.stringify({
        componentToRender: "LINE_AND_POLYGON",
        componentData: {
          drawMode: true,
          expectedLines: [outerVert, outerHoriz],
          polygons: [
            { 
              vertices: [{x: ax, y: ay}, {x: bx, y: by}, {x: cx, y: cy}, {x: dx, y: dy}, {x: ex, y: ey}, {x: fx, y: fy}], 
              isOpen: false, 
              strokeColor: "#3b82f6",
              fillColor: "rgba(59, 130, 246, 0.08)"
            },
            createLabeledDot({x: ax, y: ay}, "A"),
            createLabeledDot({x: bx, y: by}, "B"),
            createLabeledDot({x: cx, y: cy}, "C"),
            createLabeledDot({x: dx, y: dy}, "D"),
            createLabeledDot({x: ex, y: ey}, "E"),
            createLabeledDot({x: fx, y: fy}, "F")
          ],
          showGrid: true
        }
      });

    } else {
      // Shape 3: Right Trapezoid ABCD (orthogonal edges AB and BC, parallel bases AD and BC, slanted edge CD)
      const trapH = getRandomInt(3, 5);
      const bottomW = getRandomInt(5, 7);
      const topW = getRandomInt(2, bottomW - 2);

      const leftOffset = getRandomInt(1, 2);
      const bottomOffset = getRandomInt(1, 2);
      const topOffset = getRandomInt(1, 2);
      const rightOffset = getRandomInt(1, 2);

      const ax = 80, ay = 80;
      const bx = ax, by = ay + trapH * 20;
      const cx = ax + bottomW * 20, cy = by;
      const dx = ax + topW * 20, dy = ay;

      const outerH = trapH + topOffset + bottomOffset;
      const outerW = bottomW + leftOffset + rightOffset;
      const totalSum = outerH + outerW;

      const pCorner = { x: ax - leftOffset * 20, y: by + bottomOffset * 20 };
      const pTop = { x: ax - leftOffset * 20, y: ay - topOffset * 20 };
      const pRight = { x: cx + rightOffset * 20, y: by + bottomOffset * 20 };

      const outerVert = { p1: pTop, p2: pCorner };
      const outerHoriz = { p1: pCorner, p2: pRight };

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A right trapezoid ABCD is drawn on a square grid. Edge AB is perpendicular to edge BC, and top edge AD is parallel to bottom edge BC. You are asked to draw two new boundary lines: (1) a vertical line parallel to Line AB, placed exactly ${leftOffset} grid unit(s) to the left (extended ${topOffset} unit(s) above Point A and ${bottomOffset} unit(s) below Point B), and (2) a horizontal line parallel to Line BC, placed exactly ${bottomOffset} grid unit(s) below (extended ${leftOffset} unit(s) to the left of Point B and ${rightOffset} unit(s) to the right of Point C). Notice that the two newly drawn lines are perpendicular to each other and meet at a right-angled corner. Visually count the inner lengths, calculate the lengths of the two new lines, and find their total combined length."`;

        const vEqAccepted = [
          `${trapH}+${topOffset}+${bottomOffset}=${outerH}`,
          `${topOffset}+${trapH}+${bottomOffset}=${outerH}`
        ];
        if (topOffset === bottomOffset) {
          vEqAccepted.push(`${trapH} + ${topOffset * 2} = ${outerH}`);
          vEqAccepted.push(`${trapH}+${topOffset * 2}=${outerH}`);
        }

        const hEqAccepted = [
          `${bottomW}+${leftOffset}+${rightOffset}=${outerW}`,
          `${leftOffset}+${bottomW}+${rightOffset}=${outerW}`
        ];
        if (leftOffset === rightOffset) {
          hEqAccepted.push(`${bottomW} + ${leftOffset * 2} = ${outerW}`);
          hEqAccepted.push(`${bottomW}+${leftOffset * 2}=${outerW}`);
        }

        const sumAccepted = [
          `${outerW} + ${outerH} = ${totalSum}`,
          `${outerH}+${outerW}=${totalSum}`,
          `${outerW}+${outerH}=${totalSum}`
        ];

        const stepsArr = [
          { label: "Visually count the length of the vertical edge AB (in grid units):", expectedAnswer: String(trapH), acceptedAnswers: [] },
          { label: "Write the working equation to find the length of the new outer vertical line (parallel to AB):", expectedAnswer: `${trapH} + ${topOffset} + ${bottomOffset} = ${outerH}`, acceptedAnswers: vEqAccepted },
          { label: "Visually count the length of the bottom horizontal edge BC (in grid units):", expectedAnswer: String(bottomW), acceptedAnswers: [] },
          { label: "Write the working equation to find the length of the new outer horizontal line (parallel to BC):", expectedAnswer: `${bottomW} + ${leftOffset} + ${rightOffset} = ${outerW}`, acceptedAnswers: hEqAccepted },
          { label: "Write the working equation to find the total combined length of these two perpendicular outer lines:", expectedAnswer: `${outerH} + ${outerW} = ${totalSum}`, acceptedAnswers: sumAccepted }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(totalSum);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A right trapezoid ABCD is drawn on the grid. Draw an outer vertical line parallel to edge AB (${leftOffset} unit(s) to the left) and an outer horizontal line parallel to edge BC (${bottomOffset} unit(s) below), meeting perpendicularly at the corner. What is the total combined length of the two newly drawn lines?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(totalSum);
        const opts = getFourOptions(finalAnswer, [
          String(outerH),
          String(outerW),
          String(totalSum - 2 > 0 ? totalSum - 2 : totalSum + 4),
          String(trapH + bottomW)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A right trapezoid ABCD is drawn on the grid. Draw a vertical line parallel to edge AB (${leftOffset} unit(s) to the left) and a horizontal line parallel to edge BC (${bottomOffset} unit(s) below). The two lines are perpendicular to each other. Find the total combined length of both drawn lines."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(totalSum);
      }

      visualEngineStr = JSON.stringify({
        componentToRender: "LINE_AND_POLYGON",
        componentData: {
          drawMode: true,
          expectedLines: [outerVert, outerHoriz],
          polygons: [
            { 
              vertices: [{x: ax, y: ay}, {x: bx, y: by}, {x: cx, y: cy}, {x: dx, y: dy}], 
              isOpen: false, 
              strokeColor: "#3b82f6",
              fillColor: "rgba(59, 130, 246, 0.08)"
            },
            createLabeledDot({x: ax, y: ay}, "A"),
            createLabeledDot({x: bx, y: by}, "B"),
            createLabeledDot({x: cx, y: cy}, "C"),
            createLabeledDot({x: dx, y: dy}, "D")
          ],
          showGrid: true
        }
      });
    }
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
