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

export const generateAdvanced = (variant, type, getFormatInstructions) => {
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

  if (variant === 'advanced_identifying_slanted_perpendiculars') {
    const dx = getRandomInt(2, 5);
    const dy = getRandomInt(2, 5);
    const sum = dx + dy;
    
    // Master Line AB
    const startA = {x: 80, y: 80};
    const endB = {x: 80 + dx * 20, y: 80 - dy * 20}; // up and right
    
    // True perpendicular BC (swaps dx and dy, one is negative)
    // To go right and down: dx2 = dy, dy2 = -dx. (dot product: dx*dy + dy*(-dx) = 0)
    const trueC = {x: endB.x + dy * 20, y: endB.y + dx * 20};
    
    // Fake C1 (same dx, diff dy)
    const fakeC1 = {x: endB.x + dx * 20, y: endB.y + dy * 20};
    // Fake C2 (diff dx, same dy)
    const fakeC2 = {x: endB.x + dy * 20, y: endB.y + dy * 20};

    const candidates = [
      {pt: trueC, label: ""}, 
      {pt: fakeC1, label: ""}, 
      {pt: fakeC2, label: ""}
    ];
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    
    const candidateLabels = ["P", "Q", "R"];
    let correctAnswerLabel = "";
    
    const candidateLines = candidates.map((c, idx) => {
      c.label = candidateLabels[idx];
      if (c.pt.x === trueC.x && c.pt.y === trueC.y) {
        correctAnswerLabel = candidateLabels[idx];
      }
      return { vertices: [endB, c.pt], isOpen: true, strokeColor: "#ef4444" }; // Candidate lines
    });

    const candidateDots = candidates.map((c) => createLabeledDot(c.pt, c.label, "#ef4444"));

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A game designer draws a slanted laser beam, Line AB, on a grid. Line AB spans ${dx} horizontal boxes and ${dy} vertical boxes. The designer wants to draw a shield, Line BC, that perfectly deflects the laser at a right angle (perpendicular). He draws 3 candidate lines (Lines P, Q, and R). By knowing that perpendicular slanted lines on a grid "swap" their horizontal and vertical box counts, visually verify which drawn line is the true perpendicular shield. Then, calculate the total horizontal and vertical boxes spanned by the chosen shield line."`;
      const stepsArr = [
        { label: `Look at the master Line AB. It spans ${dx} horizontal boxes and ${dy} vertical boxes. To be perfectly perpendicular, the drawn Line BC must swap these. How many horizontal boxes must Line BC span?`, expectedAnswer: String(dy), acceptedAnswers: [] },
        { label: "How many vertical boxes must the drawn Line BC span?", expectedAnswer: String(dx), acceptedAnswers: [] },
        { label: "Visually match these box counts to the candidate lines. Which line is the correct perpendicular shield?", expectedAnswer: correctAnswerLabel, acceptedAnswers: [`Line ${correctAnswerLabel}`] },
        { label: "Write the working equation to find the total sum of horizontal and vertical boxes spanned by the drawn shield:", expectedAnswer: `${dy} + ${dx} = ${sum}`, acceptedAnswers: [`${dx}+${dy}=${sum}`] },
        { label: "Total boxes spanned:", expectedAnswer: String(sum), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(sum);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Line XY goes ${dy} units up and ${dx} units right. A perfectly perpendicular drawn line YZ will go ${dy} units right and how many units down?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(dx);
      const opts = getFourOptions(finalAnswer, [String(dy), String(sum), String(dx + 1), String(dx + 2)]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Line AB is slanted on a grid. You draw Line BC perpendicular to it. If AB spans ${dx} horizontal boxes, and BC is drawn perfectly perpendicular, how many vertical boxes must BC span?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(dx); // Wait, "AB spans dx horizontal, BC must span dx vertical". So answer is dx.
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        hideToolbar: true,
        polygons: [
          { vertices: [startA, endB], isOpen: true, strokeColor: "#3b82f6" },
          createLabeledDot(startA, "A"),
          createLabeledDot(endB, "B"),
          ...candidateLines,
          ...candidateDots
        ],
        showGrid: true
      }
    });

  } else if (variant === 'advanced_drawing_expanding_spiral') {
    const allNames = [...(CONTEXT_TIERS?.MIDDLE_BLOCK?.NAMES || []), ...(CONTEXT_TIERS?.LOWER_BLOCK?.NAMES || [])];
    const studentName = allNames.length > 0 ? allNames[getRandomInt(0, allNames.length - 1)] : 'Jia Hao';

    const step = getRandomInt(1, 3);
    const start = getRandomInt(1, 3);
    const s1 = start;
    const s2 = s1 + step;
    const s3 = s2 + step;
    const s4 = s3 + step;
    const s5 = s4 + step;
    const s = [s1, s2, s3, s4, s5];
    const totalLen = s1 + s2 + s3 + s4 + s5;

    const orientation = getRandomInt(0, 3);
    let pts = [{ x: 0, y: 0 }];

    if (orientation === 0) {
      // Counter-Clockwise: Right -> Up -> Left -> Down -> Right
      pts.push({ x: pts[0].x + s[0] * 20, y: pts[0].y });
      pts.push({ x: pts[1].x, y: pts[1].y - s[1] * 20 });
      pts.push({ x: pts[2].x - s[2] * 20, y: pts[2].y });
      pts.push({ x: pts[3].x, y: pts[3].y + s[3] * 20 });
      pts.push({ x: pts[4].x + s[4] * 20, y: pts[4].y });
    } else if (orientation === 1) {
      // Clockwise: Right -> Down -> Left -> Up -> Right
      pts.push({ x: pts[0].x + s[0] * 20, y: pts[0].y });
      pts.push({ x: pts[1].x, y: pts[1].y + s[1] * 20 });
      pts.push({ x: pts[2].x - s[2] * 20, y: pts[2].y });
      pts.push({ x: pts[3].x, y: pts[3].y - s[3] * 20 });
      pts.push({ x: pts[4].x + s[4] * 20, y: pts[4].y });
    } else if (orientation === 2) {
      // Counter-Clockwise: Up -> Left -> Down -> Right -> Up
      pts.push({ x: pts[0].x, y: pts[0].y - s[0] * 20 });
      pts.push({ x: pts[1].x - s[1] * 20, y: pts[1].y });
      pts.push({ x: pts[2].x, y: pts[2].y + s[2] * 20 });
      pts.push({ x: pts[3].x + s[3] * 20, y: pts[3].y });
      pts.push({ x: pts[4].x, y: pts[4].y - s[4] * 20 });
    } else {
      // Clockwise: Down -> Left -> Up -> Right -> Down
      pts.push({ x: pts[0].x, y: pts[0].y + s[0] * 20 });
      pts.push({ x: pts[1].x - s[1] * 20, y: pts[1].y });
      pts.push({ x: pts[2].x, y: pts[2].y - s[2] * 20 });
      pts.push({ x: pts[3].x + s[3] * 20, y: pts[3].y });
      pts.push({ x: pts[4].x, y: pts[4].y + s[4] * 20 });
    }

    const minRawX = Math.min(...pts.map(p => p.x));
    const minRawY = Math.min(...pts.map(p => p.y));
    const shiftX = 60 - minRawX;
    const shiftY = 60 - minRawY;
    const finalPts = pts.map(p => ({ x: p.x + shiftX, y: p.y + shiftY }));

    const initialDrawn = [finalPts[0], finalPts[1], finalPts[2], finalPts[3]];
    const expectedLines = [
      { p1: finalPts[3], p2: finalPts[4] },
      { p1: finalPts[4], p2: finalPts[5] }
    ];

    // Only Points A, B, C, D are provided. Target points E and F are intentionally NOT provided
    // so students must deduce the pattern, right-angle direction, and count grid boxes themselves.
    const polygons = [
      { vertices: initialDrawn, isOpen: true, strokeColor: "#3b82f6" },
      createLabeledDot(finalPts[0], "A"),
      createLabeledDot(finalPts[1], "B"),
      createLabeledDot(finalPts[2], "C"),
      createLabeledDot(finalPts[3], "D")
    ];

    const allX = finalPts.map(p => p.x);
    const allY = finalPts.map(p => p.y);
    const gridBounds = {
      minX: Math.max(0, Math.min(...allX) - 40),
      maxX: Math.max(...allX) + 40,
      minY: Math.max(0, Math.min(...allY) - 40),
      maxY: Math.max(...allY) + 40
    };

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is drawing an expanding square spiral on grid paper. Every time a straight line is completed, a 90-degree perpendicular turn is made in the spiral path to draw the next line. The line lengths follow an increasing pattern: the 1st line (Point A to Point B) is ${s1} grid units, the 2nd line (Point B to Point C) is ${s2} grid units, and the 3rd line (Point C to Point D) is ${s3} grid units (each new line increases by ${step} grid unit(s)). Starting from Point D, use the drawing tool to continue the expanding spiral: count the grid units to draw the 4th perpendicular line, then make another 90-degree turn and count the grid units to draw the 5th perpendicular line. Determine the pattern, calculate the length of the 5th line, and find the total number of grid units used to draw all 5 lines."`;
      const stepsArr = [
        { label: `Looking at the pattern of line lengths (${s1}, ${s2}, ${s3}...), each new perpendicular line increases by ${step} grid unit(s). What is the length of the 4th line to be drawn from Point D?`, expectedAnswer: String(s4), acceptedAnswers: [] },
        { label: "What is the length of the 5th perpendicular line to be drawn?", expectedAnswer: String(s5), acceptedAnswers: [] },
        { label: `Write the working equation to find the total length of all 5 lines drawn (${s1} + ${s2} + ${s3} + ${s4} + ${s5}):`, expectedAnswer: `${s1} + ${s2} + ${s3} + ${s4} + ${s5} = ${totalLen}`, acceptedAnswers: [`${s1}+${s2}+${s3}+${s4}+${s5}=${totalLen}`] },
        { label: "Total grid units drawn for all 5 lines:", expectedAnswer: String(totalLen), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(totalLen);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is drawing an expanding square spiral with perpendicular turns. The line lengths follow an increasing pattern of ${step} grid unit(s): Line 1 is ${s1} units, Line 2 is ${s2} units, and Line 3 is ${s3} units. Starting from Point D, use the drawing tool to count grid units and draw the 4th and 5th perpendicular lines. What is the total length of all 5 lines drawn?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(totalLen);
      const opts = getFourOptions(finalAnswer, [String(s4 + s5), String(totalLen - s1), String(totalLen + step), String(totalLen - step > 0 ? totalLen - step : totalLen + step * 2)]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"An expanding square spiral has perpendicular turns with an increasing pattern of ${step} grid unit(s). The first 3 lines are ${s1}, ${s2}, and ${s3} units long. Starting from Point D, use the drawing tool to count grid units and draw the 4th and 5th perpendicular lines. Find the total length of all 5 lines drawn."`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(totalLen);
    }

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

  } else if (variant === 'advanced_composite_shape_drawing' || variant === 'advanced_sequential_blueprint_drawing') {
    const allNames = [...(CONTEXT_TIERS?.MIDDLE_BLOCK?.NAMES || []), ...(CONTEXT_TIERS?.LOWER_BLOCK?.NAMES || [])];
    const studentName = allNames.length > 0 ? allNames[getRandomInt(0, allNames.length - 1)] : 'An engineer';

    const L1 = getRandomInt(5, 8); // e.g. 5, 6, 7, 8
    const L2 = getRandomInt(3, 6); // e.g. 3, 4, 5, 6
    const L3 = getRandomInt(1, L1 - 2); // e.g. 1, 2, 3 so remaining EA is >= 2
    const remainingL = L1 - L3;
    const totalClosing = L2 + remainingL;
    finalAnswer = String(totalClosing);

    const orientation = getRandomInt(0, 3);
    let ptA, refStart, refEnd, ptB, ptC, ptD, ptE;
    let refDesc = "";
    let dirAB = "", dirBC = "", dirCD = "", dirDE = "", dirEA = "";
    let dimDE = "", dimEA = "";

    if (orientation === 0) {
      // Bottom horizontal reference line: Up, Right, Down, Left, Down
      refDesc = "A horizontal reference line is at the bottom, and the drawing starts at Point A on the reference line.";
      dirAB = "Up";
      dirBC = "Right";
      dirCD = "Down";
      dirDE = "Left";
      dirEA = "Down";
      dimDE = "horizontal distance of Line BC";
      dimEA = "vertical distance";

      ptA = { x: 80, y: 220 };
      refStart = { x: 40, y: 220 };
      refEnd = { x: 80 + (L2 + 2) * 20, y: 220 };
      ptB = { x: ptA.x, y: ptA.y - L1 * 20 };
      ptC = { x: ptB.x + L2 * 20, y: ptB.y };
      ptD = { x: ptC.x, y: ptC.y + L3 * 20 };
      ptE = { x: ptA.x, y: ptD.y };
    } else if (orientation === 1) {
      // Bottom horizontal reference line: Up, Left, Down, Right, Down
      refDesc = "A horizontal reference line is at the bottom, and the drawing starts at Point A on the reference line.";
      dirAB = "Up";
      dirBC = "Left";
      dirCD = "Down";
      dirDE = "Right";
      dirEA = "Down";
      dimDE = "horizontal distance of Line BC";
      dimEA = "vertical distance";

      ptA = { x: 80 + (L2 + 1) * 20, y: 220 };
      refStart = { x: 40, y: 220 };
      refEnd = { x: ptA.x + 40, y: 220 };
      ptB = { x: ptA.x, y: ptA.y - L1 * 20 };
      ptC = { x: ptB.x - L2 * 20, y: ptB.y };
      ptD = { x: ptC.x, y: ptC.y + L3 * 20 };
      ptE = { x: ptA.x, y: ptD.y };
    } else if (orientation === 2) {
      // Top horizontal reference line: Down, Right, Up, Left, Up
      refDesc = "A horizontal reference line is at the top, and the drawing starts at Point A on the reference line.";
      dirAB = "Down";
      dirBC = "Right";
      dirCD = "Up";
      dirDE = "Left";
      dirEA = "Up";
      dimDE = "horizontal distance of Line BC";
      dimEA = "vertical distance";

      ptA = { x: 80, y: 60 };
      refStart = { x: 40, y: 60 };
      refEnd = { x: 80 + (L2 + 2) * 20, y: 60 };
      ptB = { x: ptA.x, y: ptA.y + L1 * 20 };
      ptC = { x: ptB.x + L2 * 20, y: ptB.y };
      ptD = { x: ptC.x, y: ptC.y - L3 * 20 };
      ptE = { x: ptA.x, y: ptD.y };
    } else {
      // Left vertical reference line: Right, Up, Left, Down, Left
      refDesc = "A vertical reference line is on the left, and the drawing starts at Point A on the reference line.";
      dirAB = "Right";
      dirBC = "Up";
      dirCD = "Left";
      dirDE = "Down";
      dirEA = "Left";
      dimDE = "vertical distance of Line BC";
      dimEA = "horizontal distance";

      ptA = { x: 60, y: 80 + (L2 + 1) * 20 };
      refStart = { x: 60, y: ptA.y + 40 };
      refEnd = { x: 60, y: 40 };
      ptB = { x: ptA.x + L1 * 20, y: ptA.y };
      ptC = { x: ptB.x, y: ptB.y - L2 * 20 };
      ptD = { x: ptC.x - L3 * 20, y: ptC.y };
      ptE = { x: ptD.x, y: ptA.y };
    }

    const expectedLines = [
      { p1: ptA, p2: ptB },
      { p1: ptB, p2: ptC },
      { p1: ptC, p2: ptD },
      { p1: ptD, p2: ptE },
      { p1: ptE, p2: ptA }
    ];

    const allPts = [refStart, refEnd, ptA, ptB, ptC, ptD, ptE];
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

    // Displays ONLY the reference line and the starting Point A.
    // The student is forced to use the grid to visualize the drawing steps themselves.
    const polygons = [
      {
        vertices: [refStart, refEnd],
        isOpen: true,
        strokeColor: "#64748b",
        strokeWidth: 3
      },
      createLabeledDot(ptA, "A")
    ];

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} is drawing an engineering blueprint on a grid. ${refDesc}\nFirst, draw Line AB perpendicular to the reference line, going ${dirAB} for exactly ${L1} grid units.\nNext, draw Line BC parallel to the reference line, going ${dirBC} for exactly ${L2} grid units.\nNext, draw Line CD parallel to Line AB, going ${dirCD} for exactly ${L3} grid units.\nFinally, draw Line DE (going ${dirDE}) and Line EA (going ${dirEA}) to close the shape perfectly back to Point A. Use the drawing tool to trace the path and draw all lines closing the shape back to Point A. By tracing his drawing steps, deduce the exact lengths of Line DE and Line EA, then calculate their total length."`;
      const stepsArr = [
        { label: `Line DE goes perfectly ${dirDE} to align with Point A. Because it must match the ${dimDE}, what is the length of Line DE?`, expectedAnswer: String(L2), acceptedAnswers: [] },
        { label: `Line AB went ${dirAB} for ${L1} units, and Line CD already went ${dirCD} for ${L3} units. Write the working equation to find the remaining ${dimEA} for Line EA (${L1} - ${L3}):`, expectedAnswer: `${L1} - ${L3} = ${remainingL}`, acceptedAnswers: [`${L1}-${L3}=${remainingL}`] },
        { label: `Write the working equation to find the total length of the two closing lines (Line DE + Line EA):`, expectedAnswer: `${L2} + ${remainingL} = ${totalClosing}`, acceptedAnswers: [`${remainingL} + ${L2} = ${totalClosing}`, `${L2}+${remainingL}=${totalClosing}`, `${remainingL}+${L2}=${totalClosing}`] },
        { label: "Total length of the closing lines:", expectedAnswer: String(totalClosing), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(totalClosing);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A drawn path starts at Point A. It goes ${L1} units ${dirAB}, turns perpendicularly and goes ${L2} units ${dirBC}, then turns perpendicularly again and goes ${L3} units ${dirCD}. If you draw two lines to close the path straight back to Point A, how many grid units long are the two closing lines combined?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(totalClosing);
      const opts = getFourOptions(finalAnswer, [String(L1 + L2), String(L1 + L2 - L3), String(totalClosing + 2), String(totalClosing - 2 > 0 ? totalClosing - 2 : totalClosing + 3)]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Starting at Point A, you draw Line AB (${L1} units ${dirAB}). You draw Line BC perpendicular to AB (${L2} units ${dirBC}). You draw Line CD parallel to AB (${L3} units ${dirCD}). To close the shape back to Point A using only a vertical line and a horizontal line, what is the total length of the two closing lines you must draw?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(totalClosing);
    }

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

  } else if (variant === 'advanced_grid_point_deduction') {
    const dx = getRandomInt(2, 5);
    const dy = getRandomInt(1, 4);
    const sum = dx + dy;
    
    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A surveyor is plotting a slanted parallelogram boundary on a grid map. He has drawn Point A, Point B, and Point C. Line AB goes diagonally across the grid. To complete the drawing, he must place Point D and draw Line CD perfectly parallel to Line AB, and Line AD perfectly parallel to Line BC. Visually analyze the grid steps of Line AB. Deduce how many grid boxes right and up Point D must be drawn from Point C, and calculate the sum of those horizontal and vertical steps."`;
      const stepsArr = [
        { label: "Look at the master Line AB. How many grid boxes horizontally (right) does it span?", expectedAnswer: String(dx), acceptedAnswers: [] },
        { label: "How many grid boxes vertically (up) does Line AB span?", expectedAnswer: String(dy), acceptedAnswers: [] },
        { label: "Because Line CD is drawn perfectly parallel to Line AB, Point D must be exactly that many boxes right and up from Point C. Write the working equation to find the sum of these horizontal and vertical steps:", expectedAnswer: `${dx} + ${dy} = ${sum}`, acceptedAnswers: [`${dy}+${dx}=${sum}`] },
        { label: "Sum of steps used to draw the parallel line:", expectedAnswer: String(sum), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(sum);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"You draw a slanted parallelogram. The top line goes ${dx} units right and ${dy} units down. The bottom line must be drawn perfectly parallel to it. The bottom line must also go ${dx} units right and how many units down?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(dy);
      const opts = getFourOptions(finalAnswer, [String(dx), String(sum), String(dy + 1), String(dy + 2)]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Line AB is a slanted line going ${dx} units right and ${dy} unit(s) up. To draw a parallel line CD starting from Point C, how many units right must Point D be from Point C?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(dx);
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        hideToolbar: true,
        polygons: [
          { vertices: [{x: 40, y: 100}, {x: 40 + dx * 20, y: 100 - dy * 20}, {x: 80 + dx * 20, y: 100 - dy * 20}], isOpen: true, strokeColor: "#3b82f6" },
          createLabeledDot({x: 40, y: 100}, "A"),
          createLabeledDot({x: 40 + dx * 20, y: 100 - dy * 20}, "B"),
          createLabeledDot({x: 80 + dx * 20, y: 100 - dy * 20}, "C")
        ],
        showGrid: true
      }
    });

  } else if (variant === 'advanced_overlapping_draw' || variant === 'advanced_intersecting_projections') {
    const isVertical = Math.random() < 0.5;
    const LP = getRandomInt(3, 6);
    const LQ = getRandomInt(3, 7);
    const totalLen = LP + LQ;
    finalAnswer = String(totalLen);

    let lineMStart, lineMEnd, lineMLabelPos;
    let ptP, ptQ, ptR;
    const lineMOri = isVertical ? "vertical" : "horizontal";

    if (isVertical) {
      // Line M is vertical
      const xM = 40;
      lineMStart = { x: xM, y: 40 };
      lineMEnd = { x: xM, y: 240 };
      lineMLabelPos = { x: xM, y: 20 };

      // Line from P is parallel to M -> vertical line (same x)
      // Line from Q is perpendicular to M -> horizontal line (same y)
      // Intersection R has x = ptP.x, y = ptQ.y
      ptP = { x: 140, y: 60 };
      ptQ = { x: 140 - LQ * 20, y: 60 + LP * 20 };
      // Ensure ptQ is at least x=60
      if (ptQ.x < 60) {
        const offset = 60 - ptQ.x;
        ptP.x += offset;
        ptQ.x += offset;
      }
      ptR = { x: ptP.x, y: ptQ.y };
    } else {
      // Line M is horizontal
      const yM = 40;
      lineMStart = { x: 40, y: yM };
      lineMEnd = { x: 240, y: yM };
      lineMLabelPos = { x: 20, y: yM };

      // Line from P is parallel to M -> horizontal line (same y)
      // Line from Q is perpendicular to M -> vertical line (same x)
      // Intersection R has x = ptQ.x, y = ptP.y
      ptP = { x: 60, y: 140 };
      ptQ = { x: 60 + LP * 20, y: 140 - LQ * 20 };
      // Ensure ptQ is at least y=60
      if (ptQ.y < 60) {
        const offset = 60 - ptQ.y;
        ptP.y += offset;
        ptQ.y += offset;
      }
      ptR = { x: ptQ.x, y: ptP.y };
    }

    const expectedLines = [
      { p1: ptP, p2: ptR },
      { p1: ptQ, p2: ptR }
    ];

    const allPts = [lineMStart, lineMEnd, ptP, ptQ, ptR];
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

    // Displays ONLY the bold solid Line M and distinct labeled dots Point P and Point Q.
    // The lines connecting P and Q to the intersection are NOT pre-drawn.
    const polygons = [
      {
        vertices: [lineMStart, lineMEnd],
        isOpen: true,
        strokeColor: "#334155",
        strokeWidth: 4
      },
      createLabeledDot(lineMLabelPos, "M", "#334155"),
      createLabeledDot(ptP, "P"),
      createLabeledDot(ptQ, "Q")
    ];

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A game map is plotted on a square grid. Line M is a solid ${lineMOri} wall. You are standing at Point P, and your teammate is at Point Q. To unlock the hidden door at Point R, you must draw a laser beam from Point P that is perfectly parallel to Line M. Your teammate must draw a laser beam from Point Q that is perfectly perpendicular to Line M. The hidden door is exactly where your two laser beams cross. Visually trace these beams on the grid to find the intersection point Point R. Use the drawing tool to draw the two beams connecting Point P to Point R and Point Q to Point R. Then, count the grid units to find the length of your beam, your teammate's beam, and calculate their total combined length."`;
      const stepsArr = [
        { label: "Visually trace a line from Point P that is parallel to Line M, and a line from Point Q that is perpendicular to Line M. Find where they cross. How many grid units long is the beam drawn from Point P to the crossing point?", expectedAnswer: String(LP), acceptedAnswers: [] },
        { label: "How many grid units long is the beam drawn from Point Q to the crossing point?", expectedAnswer: String(LQ), acceptedAnswers: [] },
        { label: `Write the working equation to find the total length of both drawn beams combined (${LP} + ${LQ}):`, expectedAnswer: `${LP} + ${LQ} = ${totalLen}`, acceptedAnswers: [`${LQ} + ${LP} = ${totalLen}`, `${LP}+${LQ}=${totalLen}`, `${LQ}+${LP}=${totalLen}`] },
        { label: "Total length of the beams:", expectedAnswer: String(totalLen), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(totalLen);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A ${lineMOri} master line (Line M) is drawn on a grid. You project a parallel line from Point P and a perpendicular line from Point Q until they intersect at Point R. Use the drawing tool to draw both lines to their intersection. By counting the grid boxes between them, what is the total length of the two drawn lines combined?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(totalLen);
      const opts = getFourOptions(finalAnswer, [String(LP), String(LQ), String(totalLen + 2), String(totalLen - 2 > 0 ? totalLen - 2 : totalLen + 3)]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Line M is ${lineMOri} on a grid. If you draw a line from Point P parallel to Line M, and a line from Point Q perpendicular to Line M, they will cross at Point R. Use the drawing tool to draw both lines to Point R. By looking at the grid, what is the total length of these two drawn lines combined?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(totalLen);
    }

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
