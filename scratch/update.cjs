const fs = require('fs');
const file = 'src/lib/syllabus/math/primary-3/geometry-angles/angle-comparison/advanced.js';
let content = fs.readFileSync(file, 'utf8');

const splitToken = "  } else if (activeVariant === 'advanced_mirror_reflection') {";
const parts = content.split(splitToken);

const newLogic = `  } else if (activeVariant === 'advanced_mirror_reflection') {
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

    let standaloneOffsetX = wholeMaxX + 80;
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
    let finalAns = \`\${totalWhole}\`;
    let hintStr = \`Count the angles on the whole shape. Remember that if two angles on the mirror line merge into a flat line (180 degrees), they disappear!\`;
    let solutionStr = \`1. The half-shape has \${totalHalf} angles in total.\\n2. When reflected, the shape merges along the mirror line.\\n3. The whole shape has \${totalWhole} total angles.\`;

    let optionsArr = [
      \`"\${totalWhole}"\`,
      \`"\${totalWhole + 2}"\`,
      \`"\${totalWhole + 4}"\`,
      \`"\${totalWhole - 2 > 0 ? totalWhole - 2 : totalWhole + 6}"\`
    ].sort(() => Math.random() - 0.5);

    let stepsArr = [];
    let designObj = "geometry";

    if (isStructure) {
      askText = \`STORY: [Name] draws half of a \${designObj} design resting against a dashed mirror line. The half-shape has \${aCount} angle(s) smaller than a right angle, \${rCount} right angle(s), and \${oCount} angle(s) greater than a right angle. When the shape is completely reflected across the mirror to form the whole \${designObj}, calculate the total number of angles the new, whole \${designObj} has.\`;
      stepsArr = [
        { label: \`For the half-shape, what is the total angle for smaller than right angle, right angle, larger than right angle? (e.g. answer 1,0,2 is 1 for smaller, 0 for right, 2 for larger):\`, expectedAnswer: \`\${aCount},\${rCount},\${oCount}\`, acceptedAnswers: [\`\${aCount}, \${rCount}, \${oCount}\`, \`\${aCount}, \${rCount},\${oCount}\`, \`\${aCount},\${rCount}, \${oCount}\`] },
        { label: \`For the new whole shape, what is the total angle for smaller than right angle, right angle, larger than right angle? (e.g. 1,0,2):\`, expectedAnswer: \`\${wholeA},\${wholeR},\${wholeO}\`, acceptedAnswers: [\`\${wholeA}, \${wholeR}, \${wholeO}\`, \`\${wholeA}, \${wholeR},\${wholeO}\`, \`\${wholeA},\${wholeR}, \${wholeO}\`] },
        { label: \`Total number of angles the new, whole shape has:\`, expectedAnswer: \`\${totalWhole}\`, acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = \`STORY: Half of a \${designObj} design is drawn against a dashed mirror line. It has \${aCount} acute, \${oCount} obtuse, and \${rCount} right angles. When reflected to make the full \${designObj}, what is the total number of angles on the full shape?\`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = \`STORY: A half-shape against a mirror has \${aCount} angle(s) smaller than a right angle, \${oCount} angle(s) greater than a right angle, and \${rCount} right angle(s). When reflected into a whole shape, how many angles does the new whole shape have in total?\`;
      inputRequirementStr = \`{"inputType": "STANDARD_TEXT"}\`;
    }

    systemPrompt = \`You are generating a Primary 3 Math question.
Topic: \${topic}
Type: \${zodType}
Difficulty: \${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, \` + ((isStructure || (!isShort && !isMCQ)) ? \`rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n\${askText}\` : \`use: "\${askText.replace(/STORY: \\\\[[^\\\\]]+\\\\] /, 'Someone ').replace('STORY: ', '')}"\`) + \`
- For content.finalAnswer, use: "\${finalAns}"
- For content.hint, use: "\${hintStr}"
- For content.solutionSteps, use: """\${solutionStr}"""
\` + (isMCQ ? \`Generate EXACTLY 4 options:
- \${optionsArr[0]}
- \${optionsArr[1]}
- \${optionsArr[2]}
- \${optionsArr[3]}\` : '');
  }

  return { visualEngineStr, inputRequirementStr, systemPrompt };
}
`;
fs.writeFileSync(file, parts[0] + newLogic);
