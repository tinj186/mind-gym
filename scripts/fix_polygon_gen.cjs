const fs = require('fs');
const file = 'src/lib/syllabus/math/primary-3/geometry-angles/angle-comparison/foundation.js';
let text = fs.readFileSync(file, 'utf8');

const regexClassifying = /if \(activeVariant === 'foundation_classifying_polygon'\) \{[\s\S]*?let shapeVertices = getRandomArrayElement\(generators\)\(\);/;
const regexComparing = /if \(activeVariant === 'foundation_comparing_categories'\) \{[\s\S]*?let shapeVertices = getRandomArrayElement\(generators\)\(\);/;

const newGenStr = `const generateTotallyRandomPolygon = () => {
      let pts = [
        {x: 20, y: 20}, {x: 80, y: 20}, {x: 80, y: 80}, {x: 20, y: 80}
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
            const dir = p1.x > 50 ? 15 : -15;
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
            const dir = p1.x > 50 ? 15 : -15; 
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
    
    let shapeVertices = generateTotallyRandomPolygon();`;

let text1 = text.replace(regexClassifying, `if (activeVariant === 'foundation_classifying_polygon') {\n${newGenStr}`);
let text2 = text1.replace(regexComparing, `if (activeVariant === 'foundation_comparing_categories') {\n${newGenStr}`);

fs.writeFileSync(file, text2);
