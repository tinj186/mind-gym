import { getRandomNames } from '../../../../../utils/variable-bank.js';
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomArrayElement = (arr) => arr[getRandomInt(0, arr.length - 1)];

export function standardLogic(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic) {
  let visualEngineStr = "";
  let inputRequirementStr = "";
  let systemPrompt = "";

  const generateRandomShape = () => {
    for (let attempt = 0; attempt < 100; attempt++) {
      const N = getRandomInt(4, 9);
      let shape = new Set(['0,0']);
      let squares = [{r: 0, c: 0}];
      
      for (let i = 1; i < N; i++) {
        let neighbors = [];
        for (let sq of squares) {
          let dr = [0, 1, 0, -1];
          let dc = [1, 0, -1, 0];
          for (let k = 0; k < 4; k++) {
            let nr = sq.r + dr[k];
            let nc = sq.c + dc[k];
            if (!shape.has(`${nr},${nc}`)) {
              neighbors.push({r: nr, c: nc});
            }
          }
        }
        let nextSq = getRandomArrayElement(neighbors);
        shape.add(`${nextSq.r},${nextSq.c}`);
        squares.push(nextSq);
      }
      
      let vertices = new Set();
      for (let sq of squares) {
        vertices.add(`${sq.r},${sq.c}`);
        vertices.add(`${sq.r+1},${sq.c}`);
        vertices.add(`${sq.r},${sq.c+1}`);
        vertices.add(`${sq.r+1},${sq.c+1}`);
      }
      
      let Vc = 0;
      let V_concave = 0;
      let isValid = true;
      for (let vStr of Array.from(vertices)) {
        let parts = vStr.split(',');
        let vr = parseInt(parts[0]);
        let vc = parseInt(parts[1]);
        let tr = shape.has(`${vr-1},${vc}`) ? 1 : 0;
        let tl = shape.has(`${vr-1},${vc-1}`) ? 1 : 0;
        let br = shape.has(`${vr},${vc}`) ? 1 : 0;
        let bl = shape.has(`${vr},${vc-1}`) ? 1 : 0;
        
        let sum = tr + tl + br + bl;
        if (sum === 1) Vc++;
        if (sum === 3) V_concave++;
        if (sum === 2 && ((tl && br) || (tr && bl))) {
          isValid = false;
          break;
        }
      }
      
      if (isValid) {
        return { squares, Vc, V_concave, N };
      }
    }
    return { squares: [{r:0,c:0},{r:0,c:1},{r:0,c:2},{r:0,c:3}], Vc: 4, V_concave: 0, N: 4 };
  };

  if (activeVariant === 'standard_deducing_quantities') {
    const totalShapes = getRandomInt(6, 12);
    const squares = getRandomInt(2, 5);
    const rightAngles = squares * 4;
    const triangles = totalShapes - squares;
    
    const shape1 = "square";
    const shape2 = getRandomArrayElement(["triangle", "circle"]);
    
    let askText = `STORY: A bag has ${totalShapes} shapes in total (${shape1}s and ${shape2}s). There are ${rightAngles} right angles in total. How many ${shape1}s are there?`;
    let finalAns = `${squares}`;
    let hintStr = `Only ${shape1}s have right angles (4 each). Divide the total right angles by 4 to find the number of ${shape1}s.`;
    let solutionStr = `1. Total right angles = ${rightAngles}.\\n2. Right angles per ${shape1} = 4.\\n3. Number of ${shape1}s = ${rightAngles} ÷ 4 = ${squares}.`;
    
    let optionsArr = [`"${squares}"`, `"${squares + 1}"`, `"${squares - 1 < 0 ? squares + 2 : squares - 1}"`, `"${totalShapes}"`];
    let stepsArr = [];

    const name1 = getRandomNames()[0];

    if (isStructure) {
      askText = `STORY: [${name1}] has a total of ${totalShapes} paper shapes. They are a mix of ${shape1}s and ${shape2}s. She counts all the corners and finds a total of ${rightAngles} right angles. Since only the ${shape1}s have right angles, calculate how many ${shape1}s and how many ${shape2}s she has.`;
      stepsArr = [
        { label: `How many right angles does 1 ${shape1} have?`, expectedAnswer: `4`, acceptedAnswers: [] },
        { label: `Write the working equation to find the number of ${shape1}s (Total right angles ÷ 4):`, expectedAnswer: `${rightAngles} ÷ 4 = ${squares}`, acceptedAnswers: [`${rightAngles} / 4 = ${squares}`] },
        { label: `Write the working equation to find the number of ${shape2}s (Total shapes - ${shape1}s):`, expectedAnswer: `${totalShapes} - ${squares} = ${triangles}`, acceptedAnswers: [] },
        { label: `Number of ${shape2}s:`, expectedAnswer: `${triangles}`, acceptedAnswers: [] }
      ];
    } else {
      askText = `STORY: A bag has ${totalShapes} shapes in total (${shape1}s and ${shape2}s). There are ${rightAngles} right angles in total. How many ${shape1}s are there?`;
    }

    visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });

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

  } else if (activeVariant === 'standard_composite_shapes') {
    let shapeObj = generateRandomShape();
    while (shapeObj.Vc === shapeObj.V_concave || shapeObj.V_concave === 0) {
      shapeObj = generateRandomShape();
    }
    
    const generateContour = (squares) => {
      let shapeSet = new Set(squares.map(sq => `${sq.c},${sq.r}`));
      let edges = [];
      for (let sq of squares) {
        let x = sq.c, y = sq.r;
        if (!shapeSet.has(`${x},${y-1}`)) edges.push({ from: `${x},${y}`, to: `${x+1},${y}` });
        if (!shapeSet.has(`${x+1},${y}`)) edges.push({ from: `${x+1},${y}`, to: `${x+1},${y+1}` });
        if (!shapeSet.has(`${x},${y+1}`)) edges.push({ from: `${x+1},${y+1}`, to: `${x},${y+1}` });
        if (!shapeSet.has(`${x-1},${y}`)) edges.push({ from: `${x},${y+1}`, to: `${x},${y}` });
      }
      
      let edgeMap = new Map();
      for (let e of edges) edgeMap.set(e.from, e);
      
      let contour = [];
      let curr = edges[0];
      let start = curr.from;
      let count = 0;
      while(curr && count < edges.length + 5) {
        let [cx, cy] = curr.from.split(',').map(Number);
        contour.push({ x: cx, y: cy });
        curr = edgeMap.get(curr.to);
        if (curr && curr.from === start) break;
        count++;
      }
      
      let corners = [];
      let n = contour.length;
      for (let i = 0; i < n; i++) {
        let prev = contour[(i - 1 + n) % n];
        let currP = contour[i];
        let next = contour[(i + 1) % n];
        let cross = (currP.x - prev.x) * (next.y - currP.y) - (currP.y - prev.y) * (next.x - currP.x);
        if (cross !== 0) {
          corners.push({ x: currP.x * 20, y: currP.y * 20 });
        }
      }
      return corners;
    };
    
    const getAngleIndices = (corners) => {
      let rightAngles = [];
      let obtuseAngles = [];
      let n = corners.length;
      let area = 0;
      for(let i=0; i<n; i++) {
          let j = (i+1)%n;
          area += corners[i].x * corners[j].y - corners[j].x * corners[i].y;
      }
      const isClockwise = area > 0;
      
      for(let i=0; i<n; i++) {
        let prev = corners[(i - 1 + n) % n];
        let curr = corners[i];
        let next = corners[(i + 1) % n];
        let inX = curr.x - prev.x; let inY = curr.y - prev.y;
        let outX = next.x - curr.x; let outY = next.y - curr.y;
        let cross = inX * outY - inY * outX;
        if (isClockwise) {
            if (cross > 0) rightAngles.push(i);
            else if (cross < 0) obtuseAngles.push(i);
        } else {
            if (cross < 0) rightAngles.push(i);
            else if (cross > 0) obtuseAngles.push(i);
        }
      }
      return { rightAngles, obtuseAngles };
    };

    let vertices = generateContour(shapeObj.squares);
    let { rightAngles, obtuseAngles } = getAngleIndices(vertices);
    
    let diff = Math.abs(rightAngles.length - obtuseAngles.length);

    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let optionsArr = [];
    let stepsArr = [];
    
    if (isStructure) {
      askText = `STORY: An irregular shape is drawn above. Look at its angles. What is the difference between the number of right angles and angles greater than a right angle inside the shape?`;
      finalAns = `${diff}`;
      hintStr = `Count the right angles (marked with a square) and the angles greater than a right angle (marked with an arc). Then find their difference.`;
      solutionStr = `1. Right angles = ${rightAngles.length}.\\n2. Angles greater than a right angle = ${obtuseAngles.length}.\\n3. Difference = ${Math.max(rightAngles.length, obtuseAngles.length)} - ${Math.min(rightAngles.length, obtuseAngles.length)} = ${diff}.`;
      stepsArr = [
        { label: `Number of right angles:`, expectedAnswer: `${rightAngles.length}`, acceptedAnswers: [] },
        { label: `Number of angles greater than a right angle:`, expectedAnswer: `${obtuseAngles.length}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the difference:`, expectedAnswer: `${Math.max(rightAngles.length, obtuseAngles.length)} - ${Math.min(rightAngles.length, obtuseAngles.length)} = ${diff}`, acceptedAnswers: [] },
        { label: `Difference:`, expectedAnswer: `${diff}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${diff}"`, `"${diff + 1}"`, `"${diff + 2}"`, `"${diff - 1 === 0 ? 3 : diff - 1}"`];
    } else {
      askText = `STORY: An irregular shape is drawn above. Look at its angles. What is the difference between the number of right angles and angles greater than a right angle inside the shape?`;
      finalAns = `${diff}`;
      hintStr = `Count both types of angles and find the difference.`;
      solutionStr = `Right angles = ${rightAngles.length}. Angles greater than a right angle = ${obtuseAngles.length}. Difference = ${Math.max(rightAngles.length, obtuseAngles.length)} - ${Math.min(rightAngles.length, obtuseAngles.length)} = ${diff}.`;
      optionsArr = [`"${diff}"`, `"${diff + 1}"`, `"${diff + 2}"`, `"${diff - 1 === 0 ? 3 : diff - 1}"`];
    }
    
    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        polygons: [{
          vertices: vertices,
          rightAngles: rightAngles,
          obtuseAngles: obtuseAngles
        }]
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
- For content.finalAnswer, use: "${isStructure && activeVariant === 'standard_deducing_quantities' ? triangles : finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');

  } else if (activeVariant === 'standard_grid_path_corners') {
    const generateGridPath = () => {
      for (let attempt = 0; attempt < 2000; attempt++) {
        const numSegments = getRandomInt(6, 12);
        let path = [{x: 0, y: 0}];
        let visited = new Set(['0,0']);
        let cx = 0, cy = 0;
        
        let allDirs = [
          {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 0, dy: -1},
          {dx: 1, dy: 1}, {dx: 1, dy: -1}, {dx: -1, dy: 1}, {dx: -1, dy: -1}
        ];
        
        let currentDir = getRandomArrayElement(allDirs);
        let rightAngles = 0;
        let nonRightAngles = 0;
        
        let success = true;
        let diagCrossings = new Set();
        
        for (let i = 0; i < numSegments; i++) {
          let nextDir;
          let attempts2 = 0;
          while(attempts2 < 50) {
            attempts2++;
            nextDir = getRandomArrayElement(allDirs);
            let cross = currentDir.dx * nextDir.dy - currentDir.dy * nextDir.dx;
            if (cross === 0) continue; // no straight lines or 180 u-turns
            break;
          }
          
          if (i > 0) {
            let dot = currentDir.dx * nextDir.dx + currentDir.dy * nextDir.dy;
            if (dot === 0) rightAngles++;
            else nonRightAngles++;
          }
          currentDir = nextDir;
          
          let len = getRandomInt(1, 2);
          for (let k = 0; k < len; k++) {
            let nx = cx + currentDir.dx;
            let ny = cy + currentDir.dy;
            
            if (visited.has(`${nx},${ny}`)) {
              success = false; break;
            }
            
            if (Math.abs(currentDir.dx) === 1 && Math.abs(currentDir.dy) === 1) {
              let crossId = `${cx + currentDir.dx/2},${cy + currentDir.dy/2}`;
              if (diagCrossings.has(crossId)) {
                success = false; break;
              }
              diagCrossings.add(crossId);
            }
            
            cx = nx; cy = ny;
            visited.add(`${cx},${cy}`);
          }
          if (!success) break;
          
          path.push({x: cx, y: cy});
        }
        
        if (success && rightAngles > 0 && nonRightAngles > 0) {
          return { path, rightAngles };
        }
      }
      return { path: [{x:0,y:0}, {x:2,y:0}, {x:2,y:2}, {x:4,y:4}, {x:2,y:6}], rightAngles: 1 };
    };

    const { path, rightAngles } = generateGridPath();
    const total = rightAngles;
    
    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = [];

    const name1 = getRandomNames()[0];

    let visualPayload = { path };

    if (isStructure) {
      askText = `STORY: A maze wall is drawn on a grid. Look at the path and count the total number of right-angled corners it forms.`;
      finalAns = `${total}`;
      hintStr = `Trace the path from start to finish and count every time it makes a turn.`;
      solutionStr = `The path makes exactly ${total} right-angled corners.`;
      stepsArr = [
        { label: `Total number of right-angled corners on the path:`, expectedAnswer: `${total}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${total}"`, `"${total + 1}"`, `"${total - 1}"`, `"${total + 2}"`];
    } else {
      askText = `STORY: A maze wall is drawn on a grid. Look at the path. How many right-angled corners does it make?`;
      finalAns = `${total}`;
      hintStr = `Trace the path from start to finish and count every time it makes a turn.`;
      solutionStr = `The path makes exactly ${total} right-angled corners.`;
      optionsArr = [`"${total}"`, `"${total + 1}"`, `"${total - 1}"`, `"${total + 2}"`];
    }

    if (Object.keys(visualPayload).length > 0) {
      visualEngineStr = JSON.stringify({ componentToRender: "ANGLE_VISUALIZER", componentData: visualPayload });
    } else {
      visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });
    }
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

  } else if (activeVariant === 'standard_deductive_totals') {
    const generateTotallyRandomPolygon = (xOffset = 0) => {
      let pts = [
        {x: 20 + xOffset, y: 20}, {x: 80 + xOffset, y: 20}, {x: 80 + xOffset, y: 80}, {x: 20 + xOffset, y: 80}
      ];
      const numTransforms = getRandomInt(3, 7);
      for (let i = 0; i < numTransforms; i++) {
        const tType = getRandomInt(0, 2);
        const edgeIdx = getRandomInt(0, pts.length - 1);
        const p1 = pts[edgeIdx];
        const p2 = pts[(edgeIdx + 1) % pts.length];
        
        if (tType === 0) {
          const p3 = pts[(edgeIdx + 2) % pts.length];
          if ((p1.x === p2.x && p2.y === p3.y) || (p1.y === p2.y && p2.x === p3.x)) {
            const mid1 = { x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2 };
            const mid2 = { x: (p2.x + p3.x)/2, y: (p2.y + p3.y)/2 };
            if (edgeIdx + 1 === pts.length) {
                pts.splice(0, 1, mid1, mid2);
            } else {
                pts.splice(edgeIdx + 1, 1, mid1, mid2);
            }
          }
        } else if (tType === 1) {
          if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 40) {
            const dir = p1.x - xOffset > 50 ? 15 : -15;
            const yDir = Math.sign(p2.y - p1.y);
            const y1 = p1.y + yDir * 15;
            const y2 = p2.y - yDir * 15;
            pts.splice(edgeIdx + 1, 0, {x: p1.x, y: y1}, {x: p1.x + dir, y: y1}, {x: p1.x + dir, y: y2}, {x: p1.x, y: y2});
          } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 40) {
            const dir = p1.y > 50 ? 15 : -15;
            const xDir = Math.sign(p2.x - p1.x);
            const x1 = p1.x + xDir * 15;
            const x2 = p2.x - xDir * 15;
            pts.splice(edgeIdx + 1, 0, {x: x1, y: p1.y}, {x: x1, y: p1.y + dir}, {x: x2, y: p1.y + dir}, {x: x2, y: p1.y});
          }
        } else if (tType === 2) {
          if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 40) {
            const midY = (p1.y + p2.y) / 2;
            const dir = p1.x - xOffset > 50 ? 15 : -15; 
            pts.splice(edgeIdx + 1, 0, {x: p1.x + dir, y: midY});
          } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 40) {
            const midX = (p1.x + p2.x) / 2;
            const dir = p1.y > 50 ? 15 : -15;
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

    const types = ['right', 'acute', 'obtuse'];
    let typeA = getRandomArrayElement(types);
    let typeB = getRandomArrayElement(types);

    const getCount = (shape, type) => type === 'right' ? shape.r.length : type === 'acute' ? shape.a.length : shape.o.length;

    let shapeA, shapeB, mult;
    for (let attempt = 0; attempt < 500; attempt++) {
      let vA = generateTotallyRandomPolygon(0);
      let aA = getAngles(vA);
      shapeA = { v: vA, ...aA };
      
      let vB = generateTotallyRandomPolygon(120);
      let aB = getAngles(vB);
      shapeB = { v: vB, ...aB };
      
      let countA = getCount(shapeA, typeA);
      let countB = getCount(shapeB, typeB);

      if (countA > 0 && countB > 0 && countA !== countB) {
        if (countB % countA === 0) {
          mult = countB / countA;
          break;
        } else if (countA % countB === 0) {
          let tempShape = shapeA;
          shapeA = { ...shapeB, v: shapeB.v.map(pt => ({ x: pt.x - 120, y: pt.y })) };
          shapeB = { ...tempShape, v: tempShape.v.map(pt => ({ x: pt.x + 120, y: pt.y })) };
          let tempType = typeA;
          typeA = typeB;
          typeB = tempType;
          mult = countA / countB;
          break;
        }
      }
    }

    if (!mult) {
      shapeA = { v: [{x: 0, y: 0}, {x: 60, y: 0}, {x: 0, y: 60}], r: [0], a: [1,2], o: [] };
      typeA = 'right';
      shapeB = { v: [{x: 100, y: 0}, {x: 180, y: 0}, {x: 180, y: 50}, {x: 100, y: 50}], r: [0,1,2,3], a: [], o: [] };
      typeB = 'right';
      mult = 4;
    }

    let finalCountA = getCount(shapeA, typeA);
    let finalCountB = getCount(shapeB, typeB);

    const formatName = (type) => type === 'right' ? 'right angles' : type === 'acute' ? 'angles smaller than a right angle' : 'angles greater than a right angle';
    let angleNameA = formatName(typeA);
    let angleNameB = formatName(typeB);
    let shortNameA = typeA === 'right' ? 'right angles' : typeA === 'acute' ? 'smaller angles' : 'greater angles';
    let shortNameB = typeB === 'right' ? 'right angles' : typeB === 'acute' ? 'smaller angles' : 'greater angles';

    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = [];

    const name1 = getRandomNames()[0];

    let verticesB = shapeB.v;

    if (isStructure) {
      askText = `STORY: Look at Shape A (left) and Shape B (right). Count the ${angleNameA} in Shape A, and the ${angleNameB} in Shape B. How many times as many ${angleNameB} does Shape B have compared to the ${angleNameA} in Shape A?`;
      finalAns = `${mult}`;
      hintStr = `Count the ${shortNameA} in Shape A, and the ${shortNameB} in Shape B. Then divide Shape B's count by Shape A's count.`;
      solutionStr = `1. Shape A has ${finalCountA} ${shortNameA}.\\n2. Shape B has ${finalCountB} ${shortNameB}.\\n3. ${finalCountB} ÷ ${finalCountA} = ${mult}.`;
      stepsArr = [
        { label: `Number of ${shortNameA} in Shape A:`, expectedAnswer: `${finalCountA}`, acceptedAnswers: [] },
        { label: `Number of ${shortNameB} in Shape B:`, expectedAnswer: `${finalCountB}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the multiplier (Shape B ÷ Shape A):`, expectedAnswer: `${finalCountB} ÷ ${finalCountA} = ${mult}`, acceptedAnswers: [`${finalCountB}/${finalCountA}=${mult}`] },
        { label: `Multiplier:`, expectedAnswer: `${mult}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${mult}"`, `"${mult + 1}"`, `"${mult + 2}"`, `"${mult - 1 === 0 ? 3 : mult - 1}"`];
    } else {
      askText = `STORY: Look at Shape A (left) and Shape B (right). How many times as many ${angleNameB} does Shape B have compared to the ${angleNameA} in Shape A?`;
      finalAns = `${mult}`;
      hintStr = `Count the ${shortNameA} in Shape A, and the ${shortNameB} in Shape B. Then divide Shape B's count by Shape A's count.`;
      solutionStr = `Shape A has ${finalCountA} ${shortNameA}. Shape B has ${finalCountB} ${shortNameB}. ${finalCountB} ÷ ${finalCountA} = ${mult}.`;
      optionsArr = [`"${mult}"`, `"${mult + 1}"`, `"${mult + 2}"`, `"${mult - 1 === 0 ? 3 : mult - 1}"`];
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        polygons: [
          { vertices: shapeA.v, rightAngles: shapeA.r, acuteAngles: shapeA.a, obtuseAngles: shapeA.o, fillColor: "rgba(100,150,250,0.15)", strokeColor: "#3b82f6" },
          { vertices: verticesB, rightAngles: shapeB.r, acuteAngles: shapeB.a, obtuseAngles: shapeB.o, fillColor: "rgba(250,150,100,0.15)", strokeColor: "#f97316" }
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
- For content.finalAnswer, use: "${isStructure && activeVariant === 'standard_deducing_quantities' ? triangles : finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');

  } else if (activeVariant === 'standard_clock_turns') {
    const startPos = getRandomInt(1, 12);
    const rights = getRandomInt(1, 3);
    const rightUnits = rights * 3; // 1 right angle = 3 units (15 mins)
    const dir1 = Math.random() < 0.5 ? 'clockwise' : 'anti-clockwise';
    
    const hasSecondMove = Math.random() < 0.7;
    const smallMins = hasSecondMove ? getRandomArrayElement([5, 10]) : 0;
    const smallUnits = smallMins / 5;
    const dir2 = Math.random() < 0.5 ? 'clockwise' : 'anti-clockwise';

    let move1 = (dir1 === 'clockwise' ? 1 : -1) * rightUnits;
    let move2 = hasSecondMove ? (dir2 === 'clockwise' ? 1 : -1) * smallUnits : 0;
    
    let midPos = (startPos + move1) % 12;
    if (midPos <= 0) midPos += 12;
    
    let finalPos = (midPos + move2) % 12;
    if (finalPos <= 0) finalPos += 12;
    
    let askText = `STORY: The minute hand of a clock starts pointing at ${startPos}. First, it turns ${rights} right angle(s) ${dir1}.`;
    if (hasSecondMove) {
      askText += ` Then, it turns an angle smaller than a right angle (exactly ${smallMins} minutes) ${dir2}.`;
    }
    askText += ` What number does the minute hand point to in the end?`;
    
    let finalAns = `${finalPos}`;
    let hintStr = `Remember that a right angle turn covers exactly 3 numbers on the clock (15 minutes). Count the steps carefully.`;
    
    let solutionStr = `1. Start at ${startPos}.\\n2. 1 right angle covers 3 numbers on the clock face. ${rights} right angle(s) = ${rightUnits} numbers.\\n3. Moving ${dir1} from ${startPos} by ${rightUnits} numbers brings the hand to ${midPos}.`;
    if (hasSecondMove) {
      solutionStr += `\\n4. ${smallMins} minutes covers ${smallUnits} number(s). Moving ${dir2} from ${midPos} by ${smallUnits} number(s) brings the hand to ${finalPos}.`;
    }
    
    let stepsArr = [];
    if (isStructure) {
       stepsArr = [
         { label: `Number of units (numbers) for ${rights} right angle(s):`, expectedAnswer: `${rightUnits}`, acceptedAnswers: [] },
         { label: `Number the hand points to after the first turn:`, expectedAnswer: `${midPos}`, acceptedAnswers: [] }
       ];
       if (hasSecondMove) {
         stepsArr.push({ label: `Number of units (numbers) for ${smallMins} minutes:`, expectedAnswer: `${smallUnits}`, acceptedAnswers: [] });
       }
       stepsArr.push({ label: `Final number the hand points to:`, expectedAnswer: `${finalPos}`, acceptedAnswers: [] });
    }
    
    let optionsArr = [`"${finalPos}"`, `"${finalPos === 12 ? 1 : finalPos + 1}"`, `"${finalPos === 1 ? 12 : finalPos - 1}"`, `"${(finalPos + 3) % 12 || 12}"`];

    visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });

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
  }

  return { visualEngineStr, inputRequirementStr, systemPrompt };
}
