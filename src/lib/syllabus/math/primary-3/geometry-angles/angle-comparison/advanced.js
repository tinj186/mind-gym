import { getRandomNames } from '../../../../../utils/variable-bank.js';
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomArrayElement = (arr) => arr[getRandomInt(0, arr.length - 1)];

export function advancedLogic(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic) {
  let visualEngineStr = "";
  let inputRequirementStr = "";
  let systemPrompt = "";

  if (activeVariant === 'advanced_corner_cut') {
    const generateOrthogonalPolygon = () => {
      let newPts = [];
      newPts.push({ x: 40, y: 40 });

      // Randomly carve 1 to 3 edges safely
      let cTop = Math.random() < 0.6;
      let cRight = Math.random() < 0.6;
      let cBottom = Math.random() < 0.6;
      let cLeft = Math.random() < 0.6;

      if (!cTop && !cRight && !cBottom && !cLeft) cTop = true; // ensure at least 1 carve

      // Top edge carve (inward depth 20)
      if (cTop) newPts.push({ x: 80, y: 40 }, { x: 80, y: 60 }, { x: 120, y: 60 }, { x: 120, y: 40 });

      newPts.push({ x: 160, y: 40 });

      // Right edge carve
      if (cRight) newPts.push({ x: 160, y: 80 }, { x: 140, y: 80 }, { x: 140, y: 120 }, { x: 160, y: 120 });

      newPts.push({ x: 160, y: 160 });

      // Bottom edge carve
      if (cBottom) newPts.push({ x: 120, y: 160 }, { x: 120, y: 140 }, { x: 80, y: 140 }, { x: 80, y: 160 });

      newPts.push({ x: 40, y: 160 });

      // Left edge carve
      if (cLeft) newPts.push({ x: 40, y: 120 }, { x: 60, y: 120 }, { x: 60, y: 80 }, { x: 40, y: 80 });

      return newPts;
    };

    const mirrorPoint = (c, a, b) => {
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let l2 = dx * dx + dy * dy;
      if (l2 === 0) return c;
      let dot = ((c.x - a.x) * dx + (c.y - a.y) * dy) / l2;
      let px = a.x + dot * dx;
      let py = a.y + dot * dy;
      return { x: 2 * px - c.x, y: 2 * py - c.y };
    };

    const getAngles = (shapeVertices) => {
      let rightAngles = [];
      let acuteAngles = [];
      let obtuseAngles = [];
      let area = 0;
      for (let i = 0; i < shapeVertices.length; i++) {
        let j = (i + 1) % shapeVertices.length;
        area += shapeVertices[i].x * shapeVertices[j].y - shapeVertices[j].x * shapeVertices[i].y;
      }
      let isClockwise = area >= 0;
      for (let i = 0; i < shapeVertices.length; i++) {
        let prev = shapeVertices[(i - 1 + shapeVertices.length) % shapeVertices.length];
        let curr = shapeVertices[i];
        let next = shapeVertices[(i + 1) % shapeVertices.length];
        let v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
        let v2 = { x: next.x - curr.x, y: next.y - curr.y };
        let cross = v1.x * v2.y - v1.y * v2.x;
        let dot = v1.x * v2.x + v1.y * v2.y;
        let isReflex = isClockwise ? (cross > 0) : (cross < 0);
        if (isReflex) {
          obtuseAngles.push(i);
        } else {
          let mag1 = Math.hypot(v1.x, v1.y);
          let mag2 = Math.hypot(v2.x, v2.y);
          let cosTheta = dot / (mag1 * mag2);
          if (Math.abs(cosTheta) < 0.05) {
            rightAngles.push(i);
          } else if (cosTheta > 0) {
            acuteAngles.push(i);
          } else {
            obtuseAngles.push(i);
          }
        }
      }
      return { r: rightAngles, a: acuteAngles, o: obtuseAngles };
    };

    let vA = generateOrthogonalPolygon();
    let vB = [...vA];
    let numCuts = getRandomInt(1, 2);
    let cutPieces = [];

    for (let c = 0; c < numCuts; c++) {
      let convex = [];
      let area = 0;
      for (let i = 0; i < vB.length; i++) {
        let j = (i + 1) % vB.length;
        area += vB[i].x * vB[j].y - vB[j].x * vB[i].y;
      }
      let isClockwise = area >= 0;
      for (let i = 0; i < vB.length; i++) {
        let prev = vB[(i - 1 + vB.length) % vB.length];
        let curr = vB[i];
        let next = vB[(i + 1) % vB.length];
        let v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
        let v2 = { x: next.x - curr.x, y: next.y - curr.y };
        let cross = v1.x * v2.y - v1.y * v2.x;
        let dot = v1.x * v2.x + v1.y * v2.y;
        let isReflex = isClockwise ? (cross > 0) : (cross < 0);

        let mag1 = Math.hypot(v1.x, v1.y);
        let mag2 = Math.hypot(v2.x, v2.y);
        let cosTheta = dot / (mag1 * mag2);

        // Only cut strict right angles, this prevents double-cutting a newly formed obtuse corner
        if (!isReflex && Math.abs(cosTheta) < 0.05) convex.push(i);
      }
      if (convex.length === 0) break;
      let cutIdx = getRandomArrayElement(convex);
      let prev = vB[(cutIdx - 1 + vB.length) % vB.length];
      let curr = vB[cutIdx];
      let next = vB[(cutIdx + 1) % vB.length];

      let p1 = { x: (prev.x + curr.x) / 2, y: (prev.y + curr.y) / 2 };
      let p2 = { x: (next.x + curr.x) / 2, y: (next.y + curr.y) / 2 };

      cutPieces.push([{ ...p1 }, { ...curr }, { ...p2 }]);
      vB.splice(cutIdx, 1, p1, p2);
    }

    let aA = getAngles(vA);
    let aB = getAngles(vB);

    let types = ['right', 'obtuse'];
    let targetType = getRandomArrayElement(types);

    let countA = targetType === 'right' ? aA.r.length : aA.o.length;
    let countB = targetType === 'right' ? aB.r.length : aB.o.length;

    if (countA === countB) {
      targetType = targetType === 'right' ? 'obtuse' : 'right';
      countA = targetType === 'right' ? aA.r.length : aA.o.length;
      countB = targetType === 'right' ? aB.r.length : aB.o.length;
    }

    let diff = Math.abs(countB - countA);
    let moreOrFewer = countB > countA ? 'more' : 'fewer';

    let targetName = targetType === 'right' ? 'right angles' : 'angles greater than a right angle';
    let shortName = targetType === 'right' ? 'right angles' : 'greater angles';

    let isFold = Math.random() < 0.5;
    let actionNoun = isFold ? 'fold' : 'cut';
    let actionVerb = isFold ? 'folded exactly inward' : 'cut straight across';
    
    let askText = "";
    let finalAns = `${diff}`;
    let hintStr = `First, count the ${shortName} on the original shape (including the dotted parts). Then, count the ${shortName} on the outer boundary of the new solid shape. Find the difference.`;
    let solutionStr = `1. Before the ${actionNoun}, the paper had ${countA} ${shortName}.\\n2. After the ${actionNoun}, the solid shape's outer boundary has ${countB} ${shortName}.\\n3. Difference = ${Math.max(countA, countB)} - ${Math.min(countA, countB)} = ${diff} ${moreOrFewer} ${shortName}.`;

    let optionsArr = [
      `"${diff}"`,
      `"${diff + 1}"`,
      `"${diff === 1 ? 2 : diff - 1}"`,
      `"${diff + 2}"`
    ];

    let stepsArr = [];

    if (isStructure) {
      let storyAct = isFold ? `folded exactly inward to make small triangular flaps` : `cut straight across, completely removing those corner points`;
      askText = `STORY: An irregular piece of paper originally has only right angles and reflex angles. ${numCuts} of its corners are ${storyAct}. The original uncut corners are shown with dotted lines. By visualizing both the original paper and the new solid shape, deduce how many ${moreOrFewer} ${targetName} the outer boundary of the shape has after the ${actionNoun} compared to before.`;
      stepsArr = [
        { label: `How many ${shortName} did the original shape have before the ${actionNoun}?`, expectedAnswer: `${countA}`, acceptedAnswers: [] },
        { label: `How many ${shortName} does the outer boundary of the new solid shape have after the ${actionNoun}?`, expectedAnswer: `${countB}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the difference:`, expectedAnswer: `${Math.max(countA, countB)} - ${Math.min(countA, countB)} = ${diff}`, acceptedAnswers: [`${Math.max(countA, countB)}-${Math.min(countA, countB)}=${diff}`] },
        { label: `Difference:`, expectedAnswer: `${diff}`, acceptedAnswers: [] }
      ];
    } else {
      let storyAct2 = isFold ? `folded exactly inward` : `cut straight across`;
      askText = `STORY: An irregular piece of paper had ${numCuts} of its corners ${storyAct2}. The original uncut corners are shown with dotted lines. How many ${moreOrFewer} ${targetName} does the outer boundary of the shape have after the ${actionNoun} compared to before?`;
    }

    let polygons = [
      { vertices: vB, rightAngles: [], acuteAngles: [], obtuseAngles: [], fillColor: "rgba(100,150,250,0.4)", strokeColor: "#3b82f6" }
    ];
    cutPieces.forEach(cutPts => {
      polygons.push({ vertices: cutPts, rightAngles: [], acuteAngles: [], obtuseAngles: [], fillColor: "transparent", strokeColor: "#94a3b8", isDashed: true });
      
      if (isFold) {
        let p1 = cutPts[0];
        let curr = cutPts[1];
        let p2 = cutPts[2];
        let foldedCurr = mirrorPoint(curr, p1, p2);
        polygons.push({ vertices: [p1, p2, foldedCurr], rightAngles: [], acuteAngles: [], obtuseAngles: [], fillColor: "rgba(37,99,235,0.3)", strokeColor: "#2563eb" });
      }
    });

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: { polygons }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ` + ((isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \\[[^\\]]+\\] /, 'Someone ').replace('STORY: ', '')}"`) + `
- For content.finalAnswer, use: "${isStructure && activeVariant === 'standard_deducing_quantities' ? triangles : finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');

  } else if (activeVariant === 'advanced_angle_profile_verification') {
    const generateTotallyRandomPolygon = () => {
      let pts = [
        { x: 40, y: 40 }, { x: 160, y: 40 }, { x: 160, y: 160 }, { x: 40, y: 160 }
      ];
      const numTransforms = getRandomInt(3, 6);
      for (let i = 0; i < numTransforms; i++) {
        const tType = getRandomInt(0, 2);
        const edgeIdx = getRandomInt(0, pts.length - 1);
        const p1 = pts[edgeIdx];
        const p2 = pts[(edgeIdx + 1) % pts.length];

        if (tType === 0) { // Diagonal cut
          const p3 = pts[(edgeIdx + 2) % pts.length];
          if ((p1.x === p2.x && p2.y === p3.y) || (p1.y === p2.y && p2.x === p3.x)) {
            const mid1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
            const mid2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
            if (edgeIdx + 1 === pts.length) pts.splice(0, 1, mid1, mid2);
            else pts.splice(edgeIdx + 1, 1, mid1, mid2);
          }
        } else if (tType === 1) { // Notch carve
          if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 40) {
            const dir = p1.x > 100 ? -20 : 20;
            const yMin = Math.min(p1.y, p2.y);
            const y1 = yMin + 15;
            const y2 = yMin + 30;
            if (p1.y < p2.y) pts.splice(edgeIdx + 1, 0, { x: p1.x, y: y1 }, { x: p1.x + dir, y: y1 }, { x: p1.x + dir, y: y2 }, { x: p1.x, y: y2 });
            else pts.splice(edgeIdx + 1, 0, { x: p1.x, y: y2 }, { x: p1.x + dir, y: y2 }, { x: p1.x + dir, y: y1 }, { x: p1.x, y: y1 });
          } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 40) {
            const dir = p1.y > 100 ? -20 : 20;
            const xMin = Math.min(p1.x, p2.x);
            const x1 = xMin + 15;
            const x2 = xMin + 30;
            if (p1.x < p2.x) pts.splice(edgeIdx + 1, 0, { x: x1, y: p1.y }, { x: x1, y: p1.y + dir }, { x: x2, y: p1.y + dir }, { x: x2, y: p1.y });
            else pts.splice(edgeIdx + 1, 0, { x: x2, y: p1.y }, { x: x2, y: p1.y + dir }, { x: x1, y: p1.y + dir }, { x: x1, y: p1.y });
          }
        } else if (tType === 2) { // Triangular protrusion
          if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 40) {
            const midY = (p1.y + p2.y) / 2;
            const dir = p1.x > 100 ? -20 : 20;
            pts.splice(edgeIdx + 1, 0, { x: p1.x + dir, y: midY });
          } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 40) {
            const midX = (p1.x + p2.x) / 2;
            const dir = p1.y > 100 ? -20 : 20;
            pts.splice(edgeIdx + 1, 0, { x: midX, y: p1.y + dir });
          }
        }
      }
      return pts.filter((p, i, a) => i === 0 || p.x !== a[i - 1].x || p.y !== a[i - 1].y);
    };

    const getAngles = (shapeVertices) => {
      let rightAngles = [];
      let acuteAngles = [];
      let obtuseAngles = [];
      let area = 0;
      for (let i = 0; i < shapeVertices.length; i++) {
        let j = (i + 1) % shapeVertices.length;
        area += shapeVertices[i].x * shapeVertices[j].y - shapeVertices[j].x * shapeVertices[i].y;
      }
      let isClockwise = area >= 0;
      for (let i = 0; i < shapeVertices.length; i++) {
        let prev = shapeVertices[(i - 1 + shapeVertices.length) % shapeVertices.length];
        let curr = shapeVertices[i];
        let next = shapeVertices[(i + 1) % shapeVertices.length];
        let v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
        let v2 = { x: next.x - curr.x, y: next.y - curr.y };
        let cross = v1.x * v2.y - v1.y * v2.x;
        let dot = v1.x * v2.x + v1.y * v2.y;
        let isReflex = isClockwise ? (cross > 0) : (cross < 0);
        if (isReflex) {
          obtuseAngles.push(i);
        } else {
          let mag1 = Math.hypot(v1.x, v1.y);
          let mag2 = Math.hypot(v2.x, v2.y);
          let cosTheta = dot / (mag1 * mag2);
          if (Math.abs(cosTheta) < 0.05) rightAngles.push(i);
          else if (cosTheta > 0) acuteAngles.push(i);
          else obtuseAngles.push(i);
        }
      }
      return { r: rightAngles, a: acuteAngles, o: obtuseAngles };
    };

    let shapeV = generateTotallyRandomPolygon();
    let angles = getAngles(shapeV);
    let trueR = angles.r.length;
    let trueA = angles.a.length;
    let trueO = angles.o.length;

    let isStatementTrue = Math.random() < 0.5;
    let claimR = trueR;
    let claimA = trueA;
    let claimO = trueO;

    if (!isStatementTrue) {
      let falseAttr = getRandomInt(0, 2);
      if (falseAttr === 0) claimR += (Math.random() < 0.5 && trueR > 0) ? -1 : 1;
      else if (falseAttr === 1) claimA += (Math.random() < 0.5 && trueA > 0) ? -1 : 1;
      else claimO += (Math.random() < 0.5 && trueO > 0) ? -1 : 1;
    }

    let askText = "";
    let finalAns = isStatementTrue ? "Yes" : "No";
    let hintStr = `Count the different types of angles on the shape carefully to check if the student's statement is correct.`;
    let solutionStr = `1. Count the right angles: ${trueR}.\\n2. Count angles smaller than a right angle: ${trueA}.\\n3. Count angles greater than a right angle: ${trueO}.\\n4. The statement is ${isStatementTrue ? 'correct' : 'incorrect'}.`;
    let optionsArr = [`"Yes"`, `"No"`, `"Not possible to tell"`, `"True"`];

    let stepsArr = [];
    const name1 = getRandomNames()[0];

    if (isStructure) {
      askText = `STORY: [${name1}] is analyzing the irregular polygon below and writes down the following statement:\\n"This shape has exactly ${claimR} right angle(s), ${claimA} angle(s) smaller than a right angle, and ${claimO} angle(s) greater than a right angle."\\n\\nAnalyze the shape and determine if [${name1}]'s statement is correct.`;
      stepsArr = [
        { label: `How many right angles does the shape actually have?`, expectedAnswer: `${trueR}`, acceptedAnswers: [] },
        { label: `How many angles smaller than a right angle does it have?`, expectedAnswer: `${trueA}`, acceptedAnswers: [] },
        { label: `How many angles greater than a right angle does it have?`, expectedAnswer: `${trueO}`, acceptedAnswers: [] },
        { label: `Is the student's statement correct? (Yes / No)`, expectedAnswer: finalAns, acceptedAnswers: [] }
      ];
    } else {
      askText = `STORY: A student claims:\\n"The shape below has exactly ${claimR} right angle(s), ${claimA} angle(s) smaller than a right angle, and ${claimO} angle(s) greater than a right angle."\\n\\nIs this statement correct? (Yes or No)`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        polygons: [
          { vertices: shapeV, rightAngles: angles.r, acuteAngles: angles.a, obtuseAngles: angles.o, fillColor: "rgba(100,150,250,0.15)", strokeColor: "#3b82f6" }
        ]
      }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ` + ((isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \\[[^\\]]+\\] /, 'Someone ').replace('STORY: ', '')}"`) + `
- For content.finalAnswer, use: "${finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');

  } else if (activeVariant === 'advanced_overlapping_shapes') {
    const getSquare = () => [{ x: -20, y: -20 }, { x: 20, y: -20 }, { x: 20, y: 20 }, { x: -20, y: 20 }];
    const getRect = () => [{ x: -30, y: -15 }, { x: 30, y: -15 }, { x: 30, y: 15 }, { x: -30, y: 15 }];
    const getRightTri = () => [{ x: -20, y: -20 }, { x: 20, y: -20 }, { x: -20, y: 20 }];
    const getEqTri = () => [{ x: 0, y: -25 }, { x: 25, y: 18 }, { x: -25, y: 18 }];

    const shapes = [
      { name: 'square', get: getSquare, rightIdxs: [0, 1, 2, 3], acuteIdxs: [] },
      { name: 'rectangle', get: getRect, rightIdxs: [0, 1, 2, 3], acuteIdxs: [] },
      { name: 'right-angled triangle', get: getRightTri, rightIdxs: [0], acuteIdxs: [1, 2] },
      { name: 'equilateral triangle', get: getEqTri, rightIdxs: [], acuteIdxs: [0, 1, 2] }
    ];

    const rotatePolygon = (poly, theta) => {
      const rad = theta * Math.PI / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      return poly.map(p => ({ x: p.x * cos - p.y * sin, y: p.x * sin + p.y * cos }));
    };
    const translatePolygon = (poly, dx, dy) => poly.map(p => ({ x: p.x + dx, y: p.y + dy }));
    const pointInPolygon = (point, vs) => {
      let x = point.x, y = point.y;
      let inside = false;
      for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i].x, yi = vs[i].y;
        let xj = vs[j].x, yj = vs[j].y;
        let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };

    const distToSegmentSquared = (p, v, w) => {
      let l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
      if (l2 === 0) return (p.x - v.x) ** 2 + (p.y - v.y) ** 2;
      let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
      t = Math.max(0, Math.min(1, t));
      return (p.x - (v.x + t * (w.x - v.x))) ** 2 + (p.y - (v.y + t * (w.y - v.y))) ** 2;
    };

    const ccw = (a, b, c) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
    const doSegmentsIntersect = (p1, p2, p3, p4) => {
      return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
    };

    const angleBetweenEdges = (p1, p2, p3, p4) => {
      let v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
      let v2 = { x: p4.x - p3.x, y: p4.y - p3.y };
      let dot = v1.x * v2.x + v1.y * v2.y;
      let mag1 = Math.hypot(v1.x, v1.y);
      let mag2 = Math.hypot(v2.x, v2.y);
      let angle = Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2)))) * 180 / Math.PI;
      return angle > 90 ? 180 - angle : angle;
    };

    let poly1, poly2, s1, s2;
    let outerRightAngles = 0;
    let outerAcuteAngles = 0;
    let numIntersections = 0;

    for (let attempt = 0; attempt < 500; attempt++) {
      s1 = getRandomArrayElement(shapes);
      s2 = getRandomArrayElement(shapes);

      let p1 = s1.get();
      p1 = rotatePolygon(p1, getRandomInt(0, 359));
      p1 = translatePolygon(p1, getRandomInt(30, 70), getRandomInt(30, 70));

      let p2 = s2.get();
      p2 = rotatePolygon(p2, getRandomInt(0, 359));
      p2 = translatePolygon(p2, getRandomInt(30, 70), getRandomInt(30, 70));

      let p1InsideP2 = p1.filter(pt => pointInPolygon(pt, p2));
      let p2InsideP1 = p2.filter(pt => pointInPolygon(pt, p1));

      let isValid = true;
      let hasIntersection = false;
      numIntersections = 0;

      for (let i = 0; i < p1.length; i++) {
        let a = p1[i], b = p1[(i + 1) % p1.length];
        for (let j = 0; j < p2.length; j++) {
          let c = p2[j], d = p2[(j + 1) % p2.length];

          if (Math.sqrt(distToSegmentSquared(a, c, d)) < 8) isValid = false;
          if (Math.sqrt(distToSegmentSquared(c, a, b)) < 8) isValid = false;

          if (doSegmentsIntersect(a, b, c, d)) {
            hasIntersection = true;
            numIntersections++;
            if (isValid && angleBetweenEdges(a, b, c, d) < 25) {
              isValid = false;
            }
          }
        }
      }

      if (isValid && hasIntersection &&
        p1InsideP2.length > 0 && p1InsideP2.length < p1.length &&
        p2InsideP1.length > 0 && p2InsideP1.length < p2.length) {

        poly1 = p1;
        poly2 = p2;

        outerRightAngles = 0;
        outerAcuteAngles = 0;
        s1.rightIdxs.forEach(idx => { if (!pointInPolygon(poly1[idx], poly2)) outerRightAngles++; });
        s2.rightIdxs.forEach(idx => { if (!pointInPolygon(poly2[idx], poly1)) outerRightAngles++; });

        s1.acuteIdxs.forEach(idx => { if (!pointInPolygon(poly1[idx], poly2)) outerAcuteAngles++; });
        s2.acuteIdxs.forEach(idx => { if (!pointInPolygon(poly2[idx], poly1)) outerAcuteAngles++; });
        break;
      }
    }

    if (!poly1) { // fallback
      s1 = shapes[0]; s2 = shapes[1];
      poly1 = translatePolygon(s1.get(), 50, 50);
      poly2 = translatePolygon(s2.get(), 60, 60);
      outerRightAngles = 6;
      outerAcuteAngles = 0;
      numIntersections = 2;
    }

    let totalRightBefore = s1.rightIdxs.length + s2.rightIdxs.length;

    let askText = "";
    let finalAns = `"Angles greater than a right angle"`;
    let hintStr = `Count the angles before they overlapped. Then count the angles on the combined outer boundary. Intersections create inward dents, which are angles greater than a right angle!`;
    let solutionStr = `1. Before overlapping, the shapes had ${totalRightBefore} right angles and 0 angles greater than a right angle.\\n2. After overlapping, some original corners are hidden, so right angles either decreased or stayed the same (${outerRightAngles}).\\n3. But the overlapping edges created ${numIntersections} inward dents!\\n4. Inward dents are reflex angles (greater than a right angle). Therefore, "Angles greater than a right angle" increased.`;

    let optionsArr = [`"Angles greater than a right angle"`, `"Right angles"`, `"Angles smaller than a right angle"`, `"None of the angles increased"`];
    let stepsArr = [];

    const name1 = getRandomNames()[0];

    if (isStructure) {
      askText = `STORY: [${name1}] cuts a ${s1.name} and a ${s2.name} out of paper and overlaps them on a table. By comparing the angles before and after they overlap, we can discover a geometry rule! Follow the steps to analyze the outer boundary of the combined shape.`;
      stepsArr = [
        { label: `Before overlapping, how many right angles did the 2 shapes have in total?`, expectedAnswer: `${totalRightBefore}`, acceptedAnswers: [] },
        { label: `Look at the combined shape. How many right angles does the outer boundary have?`, expectedAnswer: `${outerRightAngles}`, acceptedAnswers: [] },
        { label: `Before overlapping, how many angles GREATER than a right angle did the 2 shapes have?`, expectedAnswer: `0`, acceptedAnswers: [] },
        { label: `Look at the combined shape. Everywhere the edges cross, they create an "inward dent". How many inward dents (angles greater than a right angle) are on the boundary?`, expectedAnswer: `${numIntersections}`, acceptedAnswers: [] },
        { label: `Based on your analysis, which type of angle ALWAYS INCREASES when shapes overlap? (Right angles / Angles greater than a right angle)`, expectedAnswer: `Angles greater than a right angle`, acceptedAnswers: [`angles greater than a right angle`] }
      ];
    } else {
      askText = `STORY: A ${s1.name} and a ${s2.name} are placed on a table so that they overlap. Compare the angles of the original shapes to the angles of the combined outer boundary. Which type of angle definitely INCREASED in quantity?`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        polygons: [
          { vertices: poly1, hideInside: [1], showInternalDashed: true, rightAngles: [], acuteAngles: [], obtuseAngles: [], fillColor: "rgba(100,150,250,0.15)", strokeColor: "#2563eb" },
          { vertices: poly2, hideInside: [0], showInternalDashed: true, rightAngles: [], acuteAngles: [], obtuseAngles: [], fillColor: "rgba(250,150,100,0.15)", strokeColor: "#ea580c" }
        ]
      }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ` + ((isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \\[[^\\]]+\\] /, 'Someone ').replace('STORY: ', '')}"`) + `
- For content.finalAnswer, use: ${isStructure ? `"${finalAns.replace(/"/g, '')}"` : finalAns}
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');

  } else if (activeVariant === 'advanced_folded_corner') {
    let askText = `STORY: A rectangular paper has 1 corner folded exactly inward to make a small triangle flap. How many of the original right-angled corners are left untouched?`;
    let finalAns = `3`;
    let hintStr = `A rectangle starts with 4 right angles. Folding 1 corner affects only that corner.`;
    let solutionStr = `1. A rectangle has 4 corners.\\n2. Folding 1 corner leaves 4 - 1 = 3 corners untouched.`;
    let optionsArr = [`"3"`, `"4"`, `"2"`, `"5"`];
    let stepsArr = [];

    const name1 = getRandomNames()[0];

    if (isStructure) {
      stepsArr = [
        { label: `When you fold down 1 corner of a rectangle, how many of the original right-angled corners are left untouched?`, expectedAnswer: `3`, acceptedAnswers: [] }
      ];
    }

    visualEngineStr = JSON.stringify({ componentToRender: "ANGLE_VISUALIZER", componentData: { foldedCorner: true } });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ` + ((isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \\[[^\\]]+\\] /, 'Someone ').replace('STORY: ', '')}"`) + `
- For content.finalAnswer, use: "${isStructure && activeVariant === 'standard_deducing_quantities' ? triangles : finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');

  } else if (activeVariant === 'advanced_tangram_reassembly') {
    const getAngles = (shapeVertices) => {
      let rightAngles = [];
      let acuteAngles = [];
      let obtuseAngles = [];
      let area = 0;
      for (let i = 0; i < shapeVertices.length; i++) {
        let j = (i + 1) % shapeVertices.length;
        area += shapeVertices[i].x * shapeVertices[j].y - shapeVertices[j].x * shapeVertices[i].y;
      }
      let isClockwise = area >= 0;
      for (let i = 0; i < shapeVertices.length; i++) {
        let prev = shapeVertices[(i - 1 + shapeVertices.length) % shapeVertices.length];
        let curr = shapeVertices[i];
        let next = shapeVertices[(i + 1) % shapeVertices.length];
        let v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
        let v2 = { x: next.x - curr.x, y: next.y - curr.y };
        let cross = v1.x * v2.y - v1.y * v2.x;
        let dot = v1.x * v2.x + v1.y * v2.y;
        let isReflex = isClockwise ? (cross > 0) : (cross < 0);
        if (isReflex) {
          obtuseAngles.push(i);
        } else {
          let mag1 = Math.hypot(v1.x, v1.y);
          let mag2 = Math.hypot(v2.x, v2.y);
          let cosTheta = dot / (mag1 * mag2);
          if (Math.abs(cosTheta) < 0.05) {
            rightAngles.push(i);
          } else if (cosTheta > 0) {
            acuteAngles.push(i);
          } else {
            obtuseAngles.push(i);
          }
        }
      }
      return { r: rightAngles, a: acuteAngles, o: obtuseAngles };
    };


    const baseTangrams = [
  {
    name: "Chair",
    outer: [{x:0,y:0},{x:40,y:0},{x:40,y:20},{x:60,y:20},{x:60,y:60},{x:0,y:60}],
    pieces: [
      [{x:20,y:20},{x:40,y:20},{x:40,y:0},{x:20,y:0}],
      [{x:20,y:40},{x:40,y:40},{x:20,y:60},{x:0,y:60}],
      [{x:0,y:60},{x:20,y:40},{x:0,y:40}],
      [{x:20,y:20},{x:20,y:0},{x:0,y:0}],
      [{x:40,y:40},{x:60,y:20},{x:20,y:20}],
      [{x:60,y:60},{x:20,y:60},{x:60,y:20}],
      [{x:0,y:40},{x:40,y:40},{x:0,y:0}]
    ]
  },
  {
    name: "Man",
    outer: [{x:0,y:34},{x:14,y:20},{x:45,y:20},{x:45,y:0},{x:65,y:0},{x:65,y:20},{x:94,y:20},{x:108,y:34},{x:94,y:48},{x:66,y:48},{x:54,y:60},{x:42,y:48},{x:14,y:48}],
    pieces: [
      [{x:45,y:20},{x:45,y:0},{x:65,y:0},{x:65,y:20}],
      [{x:14,y:48},{x:42,y:48},{x:28,y:34},{x:0,y:34}],
      [{x:28,y:34},{x:0,y:34},{x:14,y:20}],
      [{x:94,y:48},{x:108,y:34},{x:94,y:20}],
      [{x:66,y:48},{x:94,y:48},{x:94,y:20}],
      [{x:54,y:60},{x:54,y:20},{x:14,y:20}],
      [{x:54,y:60},{x:94,y:20},{x:54,y:20}]
    ]
  },
  {
    name: "Lamp Shade",
    outer: [{x:0,y:20},{x:20,y:0},{x:61,y:0},{x:82,y:20},{x:61,y:20},{x:61,y:41},{x:50,y:41},{x:50,y:61},{x:70,y:82},{x:9,y:82},{x:30,y:61},{x:30,y:41},{x:20,y:41},{x:20,y:20}],
    pieces: [
      [{x:50,y:41},{x:30,y:41},{x:30,y:61},{x:50,y:61}],
      [{x:30,y:82},{x:9,y:82},{x:30,y:61},{x:50,y:61}],
      [{x:20,y:20},{x:0,y:20},{x:20,y:0}],
      [{x:82,y:20},{x:61,y:20},{x:61,y:0}],
      [{x:70,y:82},{x:30,y:82},{x:50,y:61}],
      [{x:20,y:41},{x:61,y:41},{x:20,y:0}],
      [{x:61,y:41},{x:61,y:0},{x:20,y:0}]
    ]
  },
  {
    name: "Bird",
    outer: [{x:0,y:0},{x:121,y:0},{x:91,y:30},{x:91,y:61},{x:61,y:30},{x:45,y:45},{x:30,y:61},{x:30,y:30}],
    pieces: [
      [{x:45,y:15},{x:61,y:0},{x:76,y:15},{x:61,y:30}],
      [{x:30,y:30},{x:30,y:61},{x:45,y:45},{x:45,y:15}],
      [{x:45,y:45},{x:61,y:30},{x:45,y:15}],
      [{x:91,y:30},{x:61,y:30},{x:76,y:15}],
      [{x:91,y:61},{x:91,y:30},{x:61,y:30}],
      [{x:30,y:30},{x:61,y:0},{x:0,y:0}],
      [{x:91,y:30},{x:121,y:0},{x:61,y:0}]
    ]
  },
  {
    name: "A Swimming Turtle",
    outer: [{x:0,y:0},{x:112,y:0},{x:98,y:14},{x:112,y:28},{x:98,y:42},{x:84,y:28},{x:28,y:28},{x:14,y:42},{x:0,y:28},{x:14,y:14}],
    pieces: [
      [{x:0,y:28},{x:14,y:14},{x:28,y:28},{x:14,y:42}],
      [{x:98,y:14},{x:84,y:0},{x:84,y:28},{x:98,y:42}],
      [{x:98,y:42},{x:112,y:28},{x:98,y:14}],
      [{x:98,y:14},{x:84,y:0},{x:112,y:0}],
      [{x:84,y:28},{x:84,y:0},{x:56,y:0}],
      [{x:28,y:28},{x:84,y:28},{x:56,y:0}],
      [{x:28,y:28},{x:56,y:0},{x:0,y:0}]
    ]
  },
  {
    name: "Cat Head From Behind",
    outer: [{x:0,y:0},{x:32,y:32},{x:64,y:0},{x:64,y:64},{x:48,y:80},{x:55,y:87},{x:9,y:87},{x:16,y:80},{x:0,y:64}],
    pieces: [
      [{x:16,y:80},{x:0,y:64},{x:16,y:48},{x:32,y:64}],
      [{x:16,y:48},{x:48,y:48},{x:64,y:64},{x:32,y:64}],
      [{x:48,y:80},{x:32,y:64},{x:64,y:64}],
      [{x:16,y:48},{x:48,y:48},{x:32,y:32}],
      [{x:55,y:87},{x:9,y:87},{x:32,y:64}],
      [{x:0,y:64},{x:32,y:32},{x:0,y:0}],
      [{x:64,y:64},{x:32,y:32},{x:64,y:0}]
    ]
  },
  {
    name: "Two Snake Hugging",
    outer: [{x:0,y:1},{x:68,y:1},{x:45,y:24},{x:70,y:0},{x:138,y:0},{x:104,y:34},{x:118,y:48},{x:21,y:48},{x:34,y:35}],
    pieces: [
      [{x:94,y:24},{x:70,y:24},{x:70,y:48},{x:94,y:48}],
      [{x:70,y:24},{x:45,y:48},{x:21,y:48},{x:45,y:24}],
      [{x:70,y:48},{x:45,y:48},{x:70,y:24}],
      [{x:118,y:48},{x:94,y:48},{x:94,y:24}],
      [{x:94,y:24},{x:45,y:24},{x:70,y:0}],
      [{x:104,y:34},{x:138,y:0},{x:70,y:0}],
      [{x:34,y:35},{x:68,y:1},{x:0,y:1}]
    ]
  },
  {
    name: "Vase",
    outer: [{x:0,y:46},{x:22.62295081967213,y:22.622950819672134},{x:15,y:30},{x:15,y:0},{x:46,y:0},{x:46,y:30},{x:30.253968253968253,y:15.238095238095239},{x:30.24590163934426,y:15.245901639344263},{x:61,y:46},{x:30,y:76},{x:46,y:61},{x:61,y:76},{x:46,y:91},{x:15,y:91},{x:0,y:76},{x:15,y:61}],
    pieces: [
      [{x:15,y:91},{x:0,y:76},{x:15,y:61},{x:30,y:76}],
      [{x:61,y:76},{x:46,y:91},{x:15,y:91},{x:30,y:76}],
      [{x:46,y:30},{x:30,y:15},{x:46,y:0}],
      [{x:61,y:76},{x:30,y:76},{x:46,y:61}],
      [{x:15,y:30},{x:46,y:0},{x:15,y:0}],
      [{x:30,y:76},{x:61,y:46},{x:0,y:46}],
      [{x:61,y:46},{x:0,y:46},{x:30,y:15}]
    ]
  },
  {
    name: "Spotlight",
    outer: [{x:0,y:0},{x:104,y:0},{x:63,y:42},{x:83,y:63},{x:21,y:63},{x:42,y:42}],
    pieces: [
      [{x:42,y:21},{x:63,y:21},{x:63,y:0},{x:42,y:0}],
      [{x:42,y:42},{x:63,y:63},{x:83,y:63},{x:63,y:42}],
      [{x:63,y:42},{x:63,y:21},{x:42,y:21}],
      [{x:63,y:42},{x:42,y:42},{x:42,y:21}],
      [{x:63,y:63},{x:21,y:63},{x:42,y:42}],
      [{x:63,y:42},{x:63,y:0},{x:104,y:0}],
      [{x:42,y:42},{x:42,y:0},{x:0,y:0}]
    ]
  },
  {
    name: "Fruit Bowl",
    outer: [{x:0,y:0},{x:243,y:0},{x:183,y:61},{x:149,y:61},{x:192,y:104},{x:63,y:104},{x:106,y:61},{x:61,y:61}],
    pieces: [
      [{x:152,y:30},{x:122,y:0},{x:91,y:30},{x:122,y:61}],
      [{x:149,y:61},{x:192,y:104},{x:149,y:104},{x:106,y:61}],
      [{x:122,y:61},{x:61,y:61},{x:91,y:30}],
      [{x:183,y:61},{x:122,y:61},{x:152,y:30}],
      [{x:149,y:104},{x:63,y:104},{x:106,y:61}],
      [{x:61,y:61},{x:122,y:0},{x:0,y:0}],
      [{x:183,y:61},{x:122,y:0},{x:243,y:0}]
    ]
  },
  {
    name: "Well",
    outer: [{x:0,y:22},{x:22,y:0},{x:43,y:0},{x:65,y:22},{x:43,y:22},{x:43,y:65},{x:53,y:65},{x:53,y:108},{x:9,y:108},{x:9,y:65},{x:22,y:65},{x:22,y:22}],
    pieces: [
      [{x:43,y:43},{x:22,y:43},{x:22,y:65},{x:43,y:65}],
      [{x:65,y:22},{x:43,y:0},{x:22,y:0},{x:43,y:22}],
      [{x:43,y:43},{x:22,y:22},{x:43,y:22}],
      [{x:22,y:43},{x:43,y:43},{x:22,y:22}],
      [{x:43,y:22},{x:0,y:22},{x:22,y:0}],
      [{x:9,y:108},{x:53,y:108},{x:9,y:65}],
      [{x:53,y:108},{x:9,y:65},{x:53,y:65}]
    ]
  },
  {
    name: "A Fire Place",
    outer: [{x:0,y:0},{x:97,y:0},{x:73,y:24},{x:73,y:73},{x:83,y:83},{x:14,y:83},{x:24,y:72.70588235294117},{x:24,y:24}],
    pieces: [
      [{x:48,y:0},{x:24,y:0},{x:24,y:24},{x:48,y:24}],
      [{x:97,y:0},{x:73,y:0},{x:48,y:24},{x:73,y:24}],
      [{x:48,y:24},{x:73,y:0},{x:48,y:0}],
      [{x:24,y:24},{x:24,y:0},{x:0,y:0}],
      [{x:24,y:73},{x:48,y:48},{x:24,y:24}],
      [{x:83,y:83},{x:14,y:83},{x:48,y:48}],
      [{x:73,y:73},{x:73,y:24},{x:24,y:24}]
    ]
  },
  {
    name: "Serving Dish",
    outer: [{x:0,y:0},{x:80,y:0},{x:80,y:20},{x:60,y:40},{x:68,y:48},{x:12,y:48},{x:20,y:40},{x:0,y:20}],
    pieces: [
      [{x:60,y:20},{x:80,y:20},{x:80,y:0},{x:60,y:0}],
      [{x:20,y:20},{x:0,y:0},{x:0,y:20},{x:20,y:40}],
      [{x:20,y:20},{x:20,y:0},{x:0,y:0}],
      [{x:60,y:40},{x:80,y:20},{x:60,y:20}],
      [{x:20,y:40},{x:40,y:20},{x:20,y:0}],
      [{x:68,y:48},{x:12,y:48},{x:40,y:20}],
      [{x:60,y:40},{x:60,y:0},{x:20,y:0}]
    ]
  },
  {
    name: "Horse",
    outer: [{x:0,y:11},{x:11,y:0},{x:38,y:27},{x:86,y:27},{x:86,y:59},{x:70,y:59},{x:70,y:43},{x:38,y:43},{x:38,y:59},{x:22,y:59},{x:22,y:34}],
    pieces: [
      [{x:38,y:43},{x:22,y:43},{x:22,y:59},{x:38,y:59}],
      [{x:70,y:43},{x:54,y:43},{x:38,y:27},{x:54,y:27}],
      [{x:70,y:59},{x:86,y:59},{x:70,y:43}],
      [{x:22,y:11},{x:0,y:11},{x:11,y:0}],
      [{x:22,y:34},{x:22,y:11},{x:0,y:11}],
      [{x:86,y:59},{x:86,y:27},{x:54,y:27}],
      [{x:54,y:43},{x:22,y:43},{x:22,y:11}]
    ]
  },
  {
    name: "Inverted Mountain",
    outer: [{x:0,y:0},{x:90,y:0},{x:90,y:32},{x:74,y:32},{x:74,y:16.727272727272727},{x:68,y:23},{x:56,y:11},{x:45,y:23},{x:34.234042553191486,y:11.25531914893617},{x:23,y:23},{x:16,y:16},{x:16,y:32},{x:0,y:32}],
    pieces: [
      [{x:45,y:23},{x:34,y:11},{x:45,y:0},{x:56,y:11}],
      [{x:0,y:16},{x:0,y:0},{x:16,y:16},{x:16,y:32}],
      [{x:0,y:32},{x:16,y:32},{x:0,y:16}],
      [{x:74,y:32},{x:90,y:32},{x:74,y:16}],
      [{x:90,y:32},{x:74,y:16},{x:90,y:0}],
      [{x:68,y:23},{x:90,y:0},{x:45,y:0}],
      [{x:23,y:23},{x:45,y:0},{x:0,y:0}]
    ]
  },
  {
    name: "Cleaver",
    outer: [{x:0,y:0},{x:36,y:0},{x:36,y:18},{x:18,y:18},{x:18,y:54},{x:36,y:54},{x:36,y:90},{x:0,y:90}],
    pieces: [
      [{x:18,y:36},{x:18,y:54},{x:0,y:54},{x:0,y:36}],
      [{x:18,y:36},{x:18,y:18},{x:0,y:0},{x:0,y:18}],
      [{x:0,y:36},{x:18,y:36},{x:0,y:18}],
      [{x:36,y:18},{x:18,y:18},{x:36,y:0}],
      [{x:18,y:18},{x:36,y:0},{x:0,y:0}],
      [{x:36,y:90},{x:0,y:90},{x:36,y:54}],
      [{x:0,y:90},{x:36,y:54},{x:0,y:54}]
    ]
  },
  {
    name: "Table",
    outer: [{x:0,y:16},{x:17,y:33},{x:26,y:33},{x:26,y:16},{x:10,y:0},{x:59,y:0},{x:43,y:16},{x:43,y:33},{x:48.515151515151516,y:33},{x:65,y:16},{x:65,y:49},{x:0,y:49}],
    pieces: [
      [{x:43,y:16},{x:43,y:33},{x:26,y:33},{x:26,y:16}],
      [{x:26,y:16},{x:10,y:0},{x:26,y:0},{x:43,y:16}],
      [{x:43,y:16},{x:43,y:0},{x:26,y:0}],
      [{x:43,y:16},{x:59,y:0},{x:43,y:0}],
      [{x:33,y:49},{x:49,y:33},{x:16,y:33}],
      [{x:33,y:49},{x:0,y:49},{x:0,y:16}],
      [{x:65,y:49},{x:33,y:49},{x:65,y:16}]
    ]
  },
  {
    name: "Lobster",
    outer: [{x:0,y:26},{x:26,y:0},{x:26,y:34},{x:44,y:34},{x:44,y:0},{x:70,y:26},{x:44,y:52},{x:44,y:107},{x:26,y:107},{x:26,y:52}],
    pieces: [
      [{x:26,y:34},{x:26,y:52},{x:44,y:52},{x:44,y:34}],
      [{x:26,y:52},{x:44,y:70},{x:44,y:89},{x:26,y:70}],
      [{x:44,y:107},{x:26,y:107},{x:44,y:89}],
      [{x:44,y:70},{x:44,y:52},{x:26,y:52}],
      [{x:26,y:107},{x:44,y:89},{x:26,y:70}],
      [{x:44,y:52},{x:70,y:26},{x:44,y:0}],
      [{x:26,y:52},{x:0,y:26},{x:26,y:0}]
    ]
  },
  {
    name: "Tool Shed",
    outer: [{x:0,y:16},{x:16,y:0},{x:32,y:0},{x:48,y:16},{x:48,y:48},{x:0,y:48}],
    pieces: [
      [{x:48,y:16},{x:32,y:16},{x:32,y:32},{x:48,y:32}],
      [{x:0,y:16},{x:16,y:16},{x:32,y:0},{x:16,y:0}],
      [{x:32,y:48},{x:48,y:32},{x:32,y:32}],
      [{x:48,y:48},{x:32,y:48},{x:48,y:32}],
      [{x:48,y:16},{x:16,y:16},{x:32,y:0}],
      [{x:32,y:48},{x:32,y:16},{x:0,y:16}],
      [{x:0,y:48},{x:32,y:48},{x:0,y:16}]
    ]
  },
  {
    name: "Person",
    outer: [{x:0,y:17},{x:26,y:17},{x:26,y:0},{x:43,y:0},{x:43,y:17},{x:68,y:17},{x:46,y:39},{x:46,y:63},{x:58,y:75},{x:10,y:75},{x:22,y:63},{x:22,y:39}],
    pieces: [
      [{x:26,y:17},{x:43,y:17},{x:43,y:0},{x:26,y:0}],
      [{x:34,y:75},{x:46,y:63},{x:22,y:63},{x:10,y:75}],
      [{x:58,y:75},{x:34,y:75},{x:46,y:63}],
      [{x:22,y:63},{x:34,y:51},{x:22,y:39}],
      [{x:46,y:63},{x:22,y:63},{x:46,y:39}],
      [{x:34,y:51},{x:34,y:17},{x:68,y:17}],
      [{x:34,y:51},{x:34,y:17},{x:0,y:17}]
    ]
  },
  {
    name: "Candle On Stand",
    outer: [{x:0,y:72},{x:48,y:72},{x:48,y:24},{x:72,y:0},{x:96,y:24},{x:96,y:72},{x:144,y:72},{x:96,y:120},{x:120,y:144},{x:24,y:144},{x:48,y:120}],
    pieces: [
      [{x:96,y:120},{x:72,y:96},{x:96,y:72},{x:120,y:96}],
      [{x:96,y:72},{x:96,y:24},{x:72,y:0},{x:72,y:48}],
      [{x:72,y:48},{x:48,y:24},{x:72,y:0}],
      [{x:120,y:96},{x:144,y:72},{x:96,y:72}],
      [{x:48,y:72},{x:96,y:72},{x:48,y:24}],
      [{x:120,y:144},{x:24,y:144},{x:72,y:96}],
      [{x:48,y:120},{x:0,y:72},{x:96,y:72}]
    ]
  },
  {
    name: "Plateau",
    outer: [{x:0,y:41},{x:41,y:0},{x:82,y:0},{x:123,y:41}],
    pieces: [
      [{x:61,y:0},{x:82,y:0},{x:82,y:20},{x:61,y:20}],
      [{x:41,y:20},{x:41,y:41},{x:61,y:20},{x:61,y:0}],
      [{x:41,y:20},{x:61,y:0},{x:41,y:0}],
      [{x:82,y:41},{x:82,y:20},{x:61,y:20}],
      [{x:82,y:41},{x:41,y:41},{x:61,y:20}],
      [{x:0,y:41},{x:41,y:41},{x:41,y:0}],
      [{x:123,y:41},{x:82,y:41},{x:82,y:0}]
    ]
  },
  {
    name: "Tortoise",
    outer: [{x:0,y:17},{x:17,y:0},{x:33,y:17},{x:50,y:0},{x:67,y:17},{x:67,y:50},{x:50,y:50},{x:50,y:33},{x:17,y:33},{x:17,y:50},{x:0,y:50}],
    pieces: [
      [{x:67,y:33},{x:50,y:33},{x:50,y:50},{x:67,y:50}],
      [{x:50,y:17},{x:50,y:0},{x:67,y:17},{x:67,y:33}],
      [{x:50,y:33},{x:67,y:33},{x:50,y:17}],
      [{x:17,y:50},{x:0,y:50},{x:17,y:33}],
      [{x:33,y:17},{x:0,y:17},{x:17,y:0}],
      [{x:0,y:50},{x:33,y:17},{x:0,y:17}],
      [{x:50,y:33},{x:17,y:33},{x:50,y:0}]
    ]
  },
  {
    name: "Sectional Couch",
    outer: [{x:0,y:0},{x:81,y:0},{x:81,y:32},{x:70,y:44},{x:58,y:32},{x:70,y:21},{x:65,y:16},{x:16,y:16},{x:11,y:21},{x:23,y:32},{x:11,y:44},{x:0,y:32}],
    pieces: [
      [{x:70,y:21},{x:58,y:32},{x:70,y:44},{x:81,y:32}],
      [{x:65,y:16},{x:49,y:0},{x:32,y:0},{x:49,y:16}],
      [{x:23,y:32},{x:0,y:32},{x:11,y:21}],
      [{x:11,y:44},{x:23,y:32},{x:0,y:32}],
      [{x:49,y:16},{x:16,y:16},{x:32,y:0}],
      [{x:81,y:32},{x:81,y:0},{x:49,y:0}],
      [{x:0,y:32},{x:32,y:0},{x:0,y:0}]
    ]
  },
  {
    name: "Large Tent",
    outer: [{x:0,y:33},{x:33,y:0},{x:67,y:33},{x:67,y:50},{x:0,y:50}],
    pieces: [
      [{x:67,y:50},{x:50,y:50},{x:50,y:33},{x:67,y:33}],
      [{x:33,y:50},{x:17,y:33},{x:0,y:33},{x:17,y:50}],
      [{x:17,y:50},{x:0,y:50},{x:0,y:33}],
      [{x:50,y:50},{x:33,y:50},{x:50,y:33}],
      [{x:33,y:50},{x:50,y:33},{x:17,y:33}],
      [{x:67,y:33},{x:33,y:33},{x:33,y:0}],
      [{x:33,y:33},{x:0,y:33},{x:33,y:0}]
    ]
  },
  {
    name: "Giraffe",
    outer: [{x:0,y:20},{x:20,y:0},{x:20,y:20},{x:40,y:0},{x:60,y:20},{x:60,y:0},{x:80,y:20},{x:54,y:46},{x:68,y:60},{x:97,y:60},{x:83,y:74},{x:54,y:74}],
    pieces: [
      [{x:40,y:60},{x:54,y:74},{x:68,y:60},{x:54,y:46}],
      [{x:54,y:74},{x:68,y:60},{x:97,y:60},{x:83,y:74}],
      [{x:0,y:20},{x:20,y:20},{x:20,y:0}],
      [{x:80,y:20},{x:60,y:20},{x:60,y:0}],
      [{x:60,y:20},{x:20,y:20},{x:40,y:0}],
      [{x:40,y:60},{x:40,y:20},{x:80,y:20}],
      [{x:40,y:60},{x:40,y:20},{x:0,y:20}]
    ]
  },
  {
    name: "Submarine",
    outer: [{x:0,y:0},{x:51,y:0},{x:34,y:17},{x:34,y:34},{x:49,y:34},{x:37,y:46},{x:37,y:70},{x:49,y:82},{x:1,y:82},{x:13,y:70},{x:13,y:46},{x:1,y:34},{x:17,y:34},{x:17,y:17}],
    pieces: [
      [{x:17,y:17},{x:17,y:34},{x:34,y:34},{x:34,y:17}],
      [{x:51,y:0},{x:34,y:17},{x:17,y:17},{x:34,y:0}],
      [{x:13,y:70},{x:25,y:58},{x:13,y:46}],
      [{x:37,y:70},{x:25,y:58},{x:37,y:46}],
      [{x:17,y:17},{x:34,y:0},{x:0,y:0}],
      [{x:25,y:58},{x:49,y:34},{x:1,y:34}],
      [{x:49,y:82},{x:1,y:82},{x:25,y:58}]
    ]
  },
  {
    name: "King",
    outer: [{x:0,y:33},{x:25,y:33},{x:25,y:17},{x:8,y:0},{x:58,y:0},{x:42,y:17},{x:42,y:33},{x:67,y:33},{x:45,y:55},{x:57,y:67},{x:10,y:67},{x:21.671641791044777,y:55.32835820895522}],
    pieces: [
      [{x:42,y:17},{x:42,y:33},{x:25,y:33},{x:25,y:17}],
      [{x:42,y:17},{x:25,y:0},{x:8,y:0},{x:25,y:17}],
      [{x:10,y:67},{x:33,y:67},{x:22,y:55}],
      [{x:57,y:67},{x:33,y:67},{x:45,y:55}],
      [{x:42,y:17},{x:58,y:0},{x:25,y:0}],
      [{x:33,y:67},{x:67,y:33},{x:33,y:33}],
      [{x:33,y:67},{x:33,y:33},{x:0,y:33}]
    ]
  },
  {
    name: "Graduation Gown",
    outer: [{x:0,y:0},{x:71,y:0},{x:54,y:16.52777777777778},{x:54,y:41},{x:67,y:54},{x:54,y:67},{x:42,y:54},{x:42,y:29},{x:49.25,y:21.145833333333336},{x:35,y:35},{x:28,y:28},{x:28,y:53},{x:16,y:66},{x:3,y:53},{x:16,y:40},{x:16,y:16}],
    pieces: [
      [{x:54,y:67},{x:42,y:54},{x:54,y:41},{x:67,y:54}],
      [{x:42,y:29},{x:42,y:54},{x:54,y:41},{x:54,y:16}],
      [{x:16,y:41},{x:28,y:28},{x:16,y:16}],
      [{x:16,y:66},{x:28,y:53},{x:3,y:53}],
      [{x:28,y:53},{x:3,y:53},{x:28,y:28}],
      [{x:35,y:35},{x:35,y:0},{x:0,y:0}],
      [{x:35,y:35},{x:71,y:0},{x:35,y:0}]
    ]
  },
  {
    name: "Paper Boat",
    outer: [{x:0,y:9},{x:45,y:9},{x:54,y:0},{x:63,y:9},{x:108,y:9},{x:86,y:32},{x:22,y:32}],
    pieces: [
      [{x:70,y:16},{x:70,y:32},{x:54,y:32},{x:54,y:16}],
      [{x:38,y:16},{x:54,y:16},{x:38,y:32},{x:22,y:32}],
      [{x:54,y:32},{x:38,y:32},{x:54,y:16}],
      [{x:86,y:32},{x:70,y:32},{x:70,y:16}],
      [{x:70,y:16},{x:38,y:16},{x:54,y:0}],
      [{x:22,y:32},{x:0,y:9},{x:45,y:9}],
      [{x:86,y:32},{x:108,y:9},{x:63,y:9}]
    ]
  },
  {
    name: "Michelin Man",
    outer: [{x:0,y:34},{x:17,y:17},{x:25,y:17},{x:25,y:0},{x:42,y:0},{x:42,y:17},{x:51,y:17},{x:68,y:34},{x:68,y:51},{x:51,y:34},{x:51,y:51},{x:34,y:68},{x:17,y:51},{x:17,y:34},{x:0,y:51}],
    pieces: [
      [{x:25,y:17},{x:25,y:0},{x:42,y:0},{x:42,y:17}],
      [{x:51,y:34},{x:68,y:51},{x:68,y:34},{x:51,y:17}],
      [{x:0,y:51},{x:17,y:34},{x:0,y:34}],
      [{x:17,y:34},{x:0,y:34},{x:17,y:17}],
      [{x:34,y:68},{x:17,y:51},{x:51,y:51}],
      [{x:17,y:51},{x:51,y:51},{x:17,y:17}],
      [{x:51,y:51},{x:51,y:17},{x:17,y:17}]
    ]
  },
  {
    name: "Person Doing Yoga",
    outer: [{x:0,y:53},{x:13,y:40},{x:27,y:27},{x:40,y:13},{x:53,y:0},{x:80,y:27},{x:107,y:53}],
    pieces: [
      [{x:27,y:27},{x:40,y:40},{x:27,y:53},{x:13,y:40}],
      [{x:53,y:27},{x:40,y:40},{x:40,y:13},{x:53,y:0}],
      [{x:40,y:40},{x:27,y:27},{x:40,y:13}],
      [{x:27,y:53},{x:0,y:53},{x:13,y:40}],
      [{x:27,y:53},{x:53,y:53},{x:53,y:27}],
      [{x:107,y:53},{x:53,y:53},{x:80,y:27}],
      [{x:53,y:53},{x:80,y:27},{x:53,y:0}]
    ]
  },
];


    const transformations = [
      { nameMod: "", r: 0, mx: 1 },
      { nameMod: "Sideways ", r: 90, mx: 1 },
      { nameMod: "Upside-down ", r: 180, mx: 1 },
      { nameMod: "Tilted ", r: 270, mx: 1 },
      { nameMod: "Mirrored ", r: 0, mx: -1 },
      { nameMod: "Mirrored Sideways ", r: 90, mx: -1 },
      { nameMod: "Mirrored Upside-down ", r: 180, mx: -1 },
      { nameMod: "Mirrored Tilted ", r: 270, mx: -1 }
    ];

    const transformShape = (shape, tx) => {
      const transformPoint = (p) => {
        let x = p.x * tx.mx;
        let y = p.y;
        let angle = tx.r * (Math.PI / 180);
        let rx = x * Math.cos(angle) - y * Math.sin(angle);
        let ry = x * Math.sin(angle) + y * Math.cos(angle);
        return { x: Math.round(rx), y: Math.round(ry) };
      };

      return {
        name: tx.nameMod + shape.name,
        outer: shape.outer.map(transformPoint),
        pieces: shape.pieces.map(piece => piece.map(transformPoint))
      };
    };

    let allTangrams = [];
    baseTangrams.forEach(shape => {
      transformations.forEach(tx => {
        allTangrams.push(transformShape(shape, tx));
      });
    });

    const chosen = getRandomArrayElement(allTangrams);
    const angles = getAngles(chosen.outer);
    
    const rCount = angles.r.length;
    const aCount = angles.a.length;
    const oCount = angles.o.length;
    const total = rCount + aCount + oCount;
    const diff = total - 4;
    const name1 = getRandomNames()[0];

    let askText = "";
    let finalAns = `${diff}`;
    let hintStr = `Count all the right, smaller, and greater angles on the outer boundary of the ${chosen.name} on the right. Add them up, then subtract 4 (the angles of the original square on the left).`;
    let solutionStr = `1. The ${chosen.name} has ${rCount} right angles, ${aCount} angles smaller than a right angle, and ${oCount} angles greater than a right angle.\\n2. Total angles = ${rCount} + ${aCount} + ${oCount} = ${total}.\\n3. A square has 4 angles. Difference = ${total} - 4 = ${diff}.`;

    let optionsArr = [
      `"${diff}"`,
      `"${diff + 2}"`,
      `"${diff - 2}"`,
      `"${total}"`
    ];

    let stepsArr = [];

    if (isStructure) {
      const name = getRandomNames(1)[0];
      askText = `STORY: ${name} takes a square piece of Tangram paper. ${name} cuts it into pieces and rearranges all of them to form a new '${chosen.name}' shape. By visually checking the corners of the new ${chosen.name} shape on your screen, count the different types of angles on its outer boundary. Calculate the total number of angles the new shape has formed, and find out how many more angles it has compared to the original square.`;
      stepsArr = [
        { label: `Visually count the number of right angles on the outer boundary of the new shape:`, expectedAnswer: `${rCount}`, acceptedAnswers: [] },
        { label: `Visually count the number of angles smaller than a right angle:`, expectedAnswer: `${aCount}`, acceptedAnswers: [] },
        { label: `Visually count the number of angles greater than a right angle:`, expectedAnswer: `${oCount}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the total angles formed by the new shape:`, expectedAnswer: `${rCount} + ${aCount} + ${oCount} = ${total}`, acceptedAnswers: [`${rCount}+${aCount}+${oCount}=${total}`, `${aCount}+${rCount}+${oCount}=${total}`, `${oCount}+${aCount}+${rCount}=${total}`] },
        { label: `Write the working equation to find how many MORE angles the new shape has than the original square (Total new angles - 4):`, expectedAnswer: `${total} - 4 = ${diff}`, acceptedAnswers: [`${total}-4=${diff}`] },
        { label: `Difference in total angles:`, expectedAnswer: `${diff}`, acceptedAnswers: [] }
      ];
    } else {
      askText = `STORY: A square is cut into pieces and rearranged into a "${chosen.name}" shape. By looking at the ${chosen.name}, how many MORE angles does the new shape have on its outer boundary compared to the original square?`;
    }

    const originalOuter = [{x:0, y:0}, {x:80, y:0}, {x:80, y:80}, {x:0, y:80}].map(pt => ({ x: pt.x - 100, y: pt.y }));
    const originalPieces = [
      [{x:0, y:0}, {x:80, y:0}, {x:40, y:40}],
      [{x:0, y:0}, {x:0, y:80}, {x:40, y:40}],
      [{x:80, y:80}, {x:40, y:80}, {x:80, y:40}],
      [{x:40, y:40}, {x:60, y:20}, {x:80, y:40}, {x:60, y:60}],
      [{x:80, y:0}, {x:80, y:40}, {x:60, y:20}],
      [{x:20, y:60}, {x:60, y:60}, {x:40, y:40}],
      [{x:0, y:80}, {x:20, y:60}, {x:60, y:60}, {x:40, y:80}]
    ].map(piece => piece.map(pt => ({ x: pt.x - 100, y: pt.y })));

    let polygons = [];
    // Original Square
    polygons.push({ vertices: originalOuter, rightAngles: [], acuteAngles: [], obtuseAngles: [], fillColor: "rgba(250,150,100,0.15)", strokeColor: "#ea580c" });
    originalPieces.forEach(pts => {
      polygons.push({ vertices: pts, rightAngles: [], acuteAngles: [], obtuseAngles: [], fillColor: "transparent", strokeColor: "#c2410c", isDashed: true });
    });

    // New Shape (Dynamically shifted to avoid overlap)
    const minX = Math.min(...chosen.outer.map(p => p.x));
    const minY = Math.min(...chosen.outer.map(p => p.y));
    const offsetX = 20 - minX;
    const offsetY = 0 - minY;

    const shiftedOuter = chosen.outer.map(pt => ({ x: pt.x + offsetX, y: pt.y + offsetY }));
    polygons.push({ vertices: shiftedOuter, rightAngles: [], acuteAngles: [], obtuseAngles: [], fillColor: "rgba(100,150,250,0.4)", strokeColor: "#3b82f6" });
    chosen.pieces.forEach(pts => {
      const shiftedPts = pts.map(pt => ({ x: pt.x + offsetX, y: pt.y + offsetY }));
      polygons.push({ vertices: shiftedPts, rightAngles: [], acuteAngles: [], obtuseAngles: [], fillColor: "transparent", strokeColor: "#475569", isDashed: true });
    });

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: { polygons }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ` + ((isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \\[[^\\]]+\\] /, 'Someone ').replace('STORY: ', '')}"`) + `
- For content.finalAnswer, use: "${isStructure && activeVariant === 'standard_deducing_quantities' ? triangles : finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');
  } else if (activeVariant === 'advanced_mirror_reflection') {
    const generateTotallyRandomPolygon = () => {
      let pts = [
        {x: 20, y: 20}, {x: 220, y: 20}, {x: 220, y: 220}, {x: 20, y: 220}
      ];
      const numTransforms = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < numTransforms; i++) {
        const tType = Math.floor(Math.random() * 3);
        const edgeIdx = Math.floor(Math.random() * pts.length);
        const p1 = pts[edgeIdx];
        const p2 = pts[(edgeIdx + 1) % pts.length];
        
        if (tType === 0) {
          const p3 = pts[(edgeIdx + 2) % pts.length];
          if ((p1.x === p2.x && p2.y === p3.y) || (p1.y === p2.y && p2.x === p3.x)) {
            if (Math.hypot(p1.x-p2.x, p1.y-p2.y) > 60 && Math.hypot(p2.x-p3.x, p2.y-p3.y) > 60) {
              const mid1 = { x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2 };
              const mid2 = { x: (p2.x + p3.x)/2, y: (p2.y + p3.y)/2 };
              if (edgeIdx + 1 === pts.length) {
                  pts.splice(0, 1, mid1, mid2);
              } else {
                  pts.splice(edgeIdx + 1, 1, mid1, mid2);
              }
            }
          }
        } else if (tType === 1) {
          if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 100) {
            const dir = p1.x > 120 ? 40 : -40;
            const yDir = Math.sign(p2.y - p1.y);
            const y1 = p1.y + yDir * 30;
            const y2 = p2.y - yDir * 30;
            pts.splice(edgeIdx + 1, 0, {x: p1.x, y: y1}, {x: p1.x + dir, y: y1}, {x: p1.x + dir, y: y2}, {x: p1.x, y: y2});
          } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 100) {
            const dir = p1.y > 120 ? 40 : -40;
            const xDir = Math.sign(p2.x - p1.x);
            const x1 = p1.x + xDir * 30;
            const x2 = p2.x - xDir * 30;
            pts.splice(edgeIdx + 1, 0, {x: x1, y: p1.y}, {x: x1, y: p1.y + dir}, {x: x2, y: p1.y + dir}, {x: x2, y: p1.y});
          }
        } else if (tType === 2) {
          if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 100) {
            const midY = (p1.y + p2.y) / 2;
            const dir = p1.x > 120 ? 40 : -40; 
            pts.splice(edgeIdx + 1, 0, {x: p1.x + dir, y: midY});
          } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 100) {
            const midX = (p1.x + p2.x) / 2;
            const dir = p1.y > 120 ? 40 : -40;
            pts.splice(edgeIdx + 1, 0, {x: midX, y: p1.y + dir});
          }
        }
      }
      
      let filtered = [];
      for (let p of pts) {
        if (filtered.length === 0) filtered.push(p);
        else {
          let last = filtered[filtered.length - 1];
          if (last.x !== p.x || last.y !== p.y) filtered.push(p);
        }
      }
      if (filtered.length > 1) {
        let last = filtered[filtered.length - 1];
        let first = filtered[0];
        if (last.x === first.x && last.y === first.y) filtered.pop();
      }
      return filtered;
    };

    const getExactAngles = (shapeVertices) => {
        let angles = [];
        let area = 0;
        for (let i = 0; i < shapeVertices.length; i++) {
          let j = (i + 1) % shapeVertices.length;
          area += shapeVertices[i].x * shapeVertices[j].y - shapeVertices[j].x * shapeVertices[i].y;
        }
        let isClockwise = area >= 0;
        for (let i = 0; i < shapeVertices.length; i++) {
          let prev = shapeVertices[(i - 1 + shapeVertices.length) % shapeVertices.length];
          let curr = shapeVertices[i];
          let next = shapeVertices[(i + 1) % shapeVertices.length];
          let v1 = { x: prev.x - curr.x, y: prev.y - curr.y }; 
          let v2 = { x: next.x - curr.x, y: next.y - curr.y }; 
          
          let cross = v1.x * v2.y - v1.y * v2.x;
          let dot = v1.x * v2.x + v1.y * v2.y;
          
          let mag1 = Math.hypot(v1.x, v1.y);
          let mag2 = Math.hypot(v2.x, v2.y);
          if (mag1 === 0 || mag2 === 0) {
              angles.push(180);
              continue;
          }
          let cosTheta = dot / (mag1 * mag2);
          cosTheta = Math.max(-1, Math.min(1, cosTheta));
          
          let angleRad = Math.acos(cosTheta);
          let angleDeg = Math.round(angleRad * 180 / Math.PI);
          
          let isReflex = isClockwise ? (cross > 0) : (cross < 0);
          if (isReflex && angleDeg !== 180 && angleDeg !== 0) {
              angleDeg = 360 - angleDeg;
          }
          angles.push(angleDeg);
        }
        return angles;
    };

    const removeDuplicates = (pts) => {
        let res = [];
        for (let p of pts) {
            if (res.length === 0) res.push(p);
            else {
                let last = res[res.length - 1];
                if (Math.hypot(last.x - p.x, last.y - p.y) > 0.1) {
                    res.push(p);
                }
            }
        }
        if (res.length > 1) {
            let last = res[res.length - 1];
            let first = res[0];
            if (Math.hypot(last.x - first.x, last.y - first.y) < 0.1) {
                res.pop();
            }
        }
        return res;
    };

    const cleanCollinear = (pts) => {
        let clean = [];
        let angles = getExactAngles(pts);
        for (let i = 0; i < pts.length; i++) {
            if (Math.abs(angles[i] - 180) > 1 && Math.abs(angles[i] - 0) > 1 && Math.abs(angles[i] - 360) > 1) {
                clean.push(pts[i]);
            }
        }
        return clean;
    };

    let valid = false;
    let clipped = [];
    let baseVertices = [];
    let mAngle, mRad, mNormal, maxProj, offsetX, offsetY, reflectedVertices;

    let attempt = 0;
    while (!valid && attempt < 50) {
        attempt++;
        baseVertices = generateTotallyRandomPolygon();
        
        let minBx = Math.min(...baseVertices.map(v => v.x));
        let maxBx = Math.max(...baseVertices.map(v => v.x));
        let minBy = Math.min(...baseVertices.map(v => v.y));
        let maxBy = Math.max(...baseVertices.map(v => v.y));
        let cx = (minBx + maxBx) / 2;
        let cy = (minBy + maxBy) / 2;

        const mirrorAngles = [0, 45, 90, 135, 180, 225, 270, 315];
        mAngle = getRandomArrayElement(mirrorAngles);
        mRad = mAngle * Math.PI / 180;
        mNormal = { x: Math.cos(mRad), y: Math.sin(mRad) };
        maxProj = cx * mNormal.x + cy * mNormal.y; 

        const inside = (p) => (p.x * mNormal.x + p.y * mNormal.y) >= maxProj - 0.0001;
        const intersect = (p1, p2) => {
            let dx = p2.x - p1.x;
            let dy = p2.y - p1.y;
            let denom = dx * mNormal.x + dy * mNormal.y;
            if (Math.abs(denom) < 0.0001) return { x: p1.x, y: p1.y };
            let t = (maxProj - (p1.x * mNormal.x + p1.y * mNormal.y)) / denom;
            return { x: p1.x + t * dx, y: p1.y + t * dy };
        };

        clipped = [];
        let cp1 = baseVertices[baseVertices.length - 1];
        for (let cp2 of baseVertices) {
            if (inside(cp2)) {
                if (!inside(cp1)) clipped.push(intersect(cp1, cp2));
                clipped.push(cp2);
            } else if (inside(cp1)) {
                clipped.push(intersect(cp1, cp2));
            }
            cp1 = cp2;
        }

        clipped = cleanCollinear(removeDuplicates(clipped));

        if (clipped.length < 3) continue;

        let tooShort = false;
        for (let i = 0; i < clipped.length; i++) {
            let p1 = clipped[i];
            let p2 = clipped[(i + 1) % clipped.length];
            if (Math.hypot(p1.x - p2.x, p1.y - p2.y) < 25) { 
                tooShort = true;
                break;
            }
        }
        if (tooShort) continue;
        
        let anglesList = getExactAngles(clipped);
        let weirdAngle = false;
        for (let a of anglesList) {
            if (a < 20 || (a > 175 && a < 185) || a > 340) {
                weirdAngle = true;
                break;
            }
        }
        if (weirdAngle) continue;

        valid = true;
    }

    const reflectPoint = (p) => {
        const dist = (p.x * mNormal.x + p.y * mNormal.y) - maxProj;
        return {
            x: p.x - 2 * dist * mNormal.x,
            y: p.y - 2 * dist * mNormal.y
        };
    };

    reflectedVertices = clipped.map(reflectPoint);
    reflectedVertices = cleanCollinear(removeDuplicates(reflectedVertices));

    const allX = [...clipped.map(v => v.x), ...reflectedVertices.map(v => v.x)];
    const allY = [...clipped.map(v => v.y), ...reflectedVertices.map(v => v.y)];
    const minX = Math.min(...allX);
    const minY = Math.min(...allY);
    offsetX = 20 - minX;
    offsetY = 20 - minY;

    const shiftedHalf = clipped.map(v => ({ x: Math.round((v.x + offsetX)*10)/10, y: Math.round((v.y + offsetY)*10)/10 }));
    const shiftedReflected = reflectedVertices.map(v => ({ x: Math.round((v.x + offsetX)*10)/10, y: Math.round((v.y + offsetY)*10)/10 }));

    let halfAnglesList = getExactAngles(shiftedHalf);
    
    let aCount = 0, oCount = 0, rCount = 0;
    let wholeA = 0, wholeO = 0, wholeR = 0;
    
    let half_r = [], half_a = [], half_o = [];

    for (let i = 0; i < shiftedHalf.length; i++) {
        let V = shiftedHalf[i];
        let theta = halfAnglesList[i];
        
        if (Math.abs(theta - 90) < 2) { rCount++; half_r.push(i); theta = 90; }
        else if (theta < 90) { aCount++; half_a.push(i); }
        else if (theta > 90 && Math.abs(theta - 180) > 2 && Math.abs(theta - 360) > 2) { oCount++; half_o.push(i); }
        
        let shiftedMaxProj = maxProj + offsetX * mNormal.x + offsetY * mNormal.y;
        let onLine = Math.abs(V.x * mNormal.x + V.y * mNormal.y - shiftedMaxProj) < 0.5;
        
        if (!onLine) {
            if (theta === 90) wholeR += 2;
            else if (theta < 90) wholeA += 2;
            else if (theta > 90 && Math.abs(theta - 180) > 2 && Math.abs(theta - 360) > 2) wholeO += 2;
        } else {
            let combined = theta * 2;
            if (Math.abs(combined - 90) < 2) wholeR += 1;
            else if (combined < 90) wholeA += 1;
            else if (combined > 90 && Math.abs(combined - 180) > 2 && Math.abs(combined - 360) > 2) wholeO += 1;
        }
    }

    let totalHalf = aCount + oCount + rCount;
    let totalWhole = wholeA + wholeO + wholeR;

    let polygons = [];
    
    polygons.push({ 
      vertices: shiftedReflected,
      rightAngles: [], acuteAngles: [], obtuseAngles: [], 
      fillColor: "transparent", 
      strokeColor: "#94a3b8", 
      isDashed: true 
    });

    polygons.push({ 
      vertices: shiftedHalf, 
      rightAngles: half_r, 
      acuteAngles: half_a, 
      obtuseAngles: half_o, 
      fillColor: "rgba(100,150,250,0.4)", 
      strokeColor: "#3b82f6" 
    });

    let wholeMinX = Math.min(...allX) + offsetX;
    let wholeMaxX = Math.max(...allX) + offsetX;
    let wholeMinY = Math.min(...allY) + offsetY;
    let wholeMaxY = Math.max(...allY) + offsetY;
    let mCx = (wholeMinX + wholeMaxX) / 2;
    let mCy = (wholeMinY + wholeMaxY) / 2;
    
    let lineLen = Math.hypot(wholeMaxX - wholeMinX, wholeMaxY - wholeMinY) * 0.7;
    
    let mDir = { x: -mNormal.y, y: mNormal.x };
    let mLineTop = { x: mCx - mDir.x * lineLen, y: mCy - mDir.y * lineLen };
    let mLineBottom = { x: mCx + mDir.x * lineLen, y: mCy + mDir.y * lineLen };
    
    let perpX = -mDir.y * 0.5;
    let perpY = mDir.x * 0.5;

    polygons.push({
      vertices: [
        { x: mLineTop.x + perpX, y: mLineTop.y + perpY },
        { x: mLineTop.x - perpX, y: mLineTop.y - perpY },
        { x: mLineBottom.x - perpX, y: mLineBottom.y - perpY },
        { x: mLineBottom.x + perpX, y: mLineBottom.y + perpY }
      ],
      rightAngles: [], acuteAngles: [], obtuseAngles: [],
      fillColor: "#ef4444",
      strokeColor: "transparent",
      isDashed: true
    });

    let standaloneOffsetX = wholeMaxX + 30;
    let standaloneHalf = shiftedHalf.map(v => ({ x: v.x + standaloneOffsetX, y: v.y }));
    
    polygons.push({ 
      vertices: standaloneHalf, 
      rightAngles: half_r, 
      acuteAngles: half_a, 
      obtuseAngles: half_o, 
      fillColor: "rgba(100,150,250,0.4)", 
      strokeColor: "#3b82f6" 
    });

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: { polygons }
    });

    let askText = "";
    let finalAns = `${totalWhole}`;
    let hintStr = `Count the angles on the whole shape. Remember that if two angles on the mirror line merge into a flat line (180 degrees), they disappear!`;
    let solutionStr = `1. The half-shape has ${totalHalf} angles in total.\n2. When reflected, the shape merges along the mirror line.\n3. The whole shape has ${totalWhole} total angles.`;

    let optionsArr = [
      `"${totalWhole}"`,
      `"${totalWhole + 2}"`,
      `"${totalWhole + 4}"`,
      `"${totalWhole - 2 > 0 ? totalWhole - 2 : totalWhole + 6}"`
    ].sort(() => Math.random() - 0.5);

    let stepsArr = [];
    let designObj = "geometry";
    const name = getRandomNames(1)[0];

    if (isStructure) {
      askText = `STORY: ${name} draws half of a ${designObj} design resting against a dashed mirror line. When the shape is completely reflected across the mirror to form the whole ${designObj}, calculate the total number of angles the new, whole ${designObj} has.`;
      stepsArr = [
        { label: `For the half-shape, what is the total angle for smaller than right angle, right angle, larger than right angle? (e.g. answer 1,0,2 is 1 for smaller, 0 for right, 2 for larger):`, expectedAnswer: `${aCount},${rCount},${oCount}`, acceptedAnswers: [`${aCount}, ${rCount}, ${oCount}`, `${aCount}, ${rCount},${oCount}`, `${aCount},${rCount}, ${oCount}`] },
        { label: `For the new whole shape, what is the total angle for smaller than right angle, right angle, larger than right angle? (e.g. 1,0,2):`, expectedAnswer: `${wholeA},${wholeR},${wholeO}`, acceptedAnswers: [`${wholeA}, ${wholeR}, ${wholeO}`, `${wholeA}, ${wholeR},${wholeO}`, `${wholeA},${wholeR}, ${wholeO}`] },
        { label: `Total number of angles the new, whole shape has:`, expectedAnswer: `${totalWhole}`, acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `STORY: Half of a ${designObj} design is drawn against a dashed mirror line. When reflected to make the full ${designObj}, what is the total number of angles on the full shape?`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `STORY: A half-shape against a mirror is completely reflected into a whole shape. How many angles does the new whole shape have in total?`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ` + ((isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\n${askText}` : `use: "${askText.replace(/STORY: \\[[^\\]]+\\] /, 'Someone ').replace('STORY: ', '')}"`) + `
- For content.finalAnswer, use: "${finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');
  }

  return { visualEngineStr, inputRequirementStr, systemPrompt };
}
