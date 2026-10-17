const fs = require('fs');
const file = 'src/lib/syllabus/math/primary-3/geometry-angles/angle-comparison/foundation.js';
let text = fs.readFileSync(file, 'utf8');

const regex = /if \(activeVariant === 'foundation_comparing_categories'\) \{[\s\S]*?visualEngineStr = JSON.stringify\(\{ componentToRender: "ANGLE_VISUALIZER", componentData: \{ right: rightAngles, other: otherAngles, otherType \} \}\);/;

const newBlock = `if (activeVariant === 'foundation_comparing_categories') {
    const generateStairs = () => {
      let x = Array.from({length: 4}, () => getRandomInt(1, 9) * 10);
      let y = Array.from({length: 4}, () => getRandomInt(1, 9) * 10);
      x = [...new Set(x)].sort((a, b) => a - b);
      y = [...new Set(y)].sort((a, b) => a - b);
      if (x.length < 4) x = [10, 30, 60, 90];
      if (y.length < 4) y = [10, 30, 60, 90];
      return [{x:x[0], y:y[3]}, {x:x[3], y:y[3]}, {x:x[3], y:y[2]}, {x:x[2], y:y[2]}, {x:x[2], y:y[1]}, {x:x[1], y:y[1]}, {x:x[1], y:y[0]}, {x:x[0], y:y[0]}];
    };
    const generateArrow = () => {
      let x = Array.from({length: 3}, () => getRandomInt(1, 9) * 10);
      let y = Array.from({length: 5}, () => getRandomInt(1, 9) * 10);
      x = [...new Set(x)].sort((a, b) => a - b);
      y = [...new Set(y)].sort((a, b) => a - b);
      if (x.length < 3) x = [20, 60, 90];
      if (y.length < 5) y = [10, 30, 50, 70, 90];
      return [{x:x[0], y:y[2]}, {x:x[1], y:y[1]}, {x:x[1], y:y[0]}, {x:x[2], y:y[2]}, {x:x[1], y:y[4]}, {x:x[1], y:y[3]}];
    };
    const generateCrown = () => {
      let x = Array.from({length: 5}, () => getRandomInt(1, 9) * 10);
      let y = Array.from({length: 3}, () => getRandomInt(1, 9) * 10);
      x = [...new Set(x)].sort((a, b) => a - b);
      y = [...new Set(y)].sort((a, b) => a - b);
      if (x.length < 5) x = [10, 30, 50, 70, 90];
      if (y.length < 3) y = [20, 50, 80];
      return [{x:x[0], y:y[2]}, {x:x[4], y:y[2]}, {x:x[4], y:y[1]}, {x:x[3], y:y[0]}, {x:x[2], y:y[1]}, {x:x[1], y:y[0]}, {x:x[0], y:y[1]}];
    };
    const generateHouse = () => {
      let x = Array.from({length: 6}, () => getRandomInt(1, 9) * 10);
      let y = Array.from({length: 4}, () => getRandomInt(1, 9) * 10);
      x = [...new Set(x)].sort((a, b) => a - b);
      y = [...new Set(y)].sort((a, b) => a - b);
      if (x.length < 6) x = [10, 20, 40, 60, 80, 90];
      if (y.length < 4) y = [10, 30, 50, 90];
      return [{x:x[0], y:y[3]}, {x:x[5], y:y[3]}, {x:x[5], y:y[2]}, {x:x[4], y:y[1]}, {x:x[4], y:y[0]}, {x:x[3], y:y[0]}, {x:x[3], y:y[1]}, {x:x[2], y:y[0]}, {x:x[0], y:y[2]}];
    };
    
    const generators = [generateStairs, generateArrow, generateCrown, generateHouse];
    let shapeVertices = getRandomArrayElement(generators)();

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
    
    const rCount = rightAngles.length;
    let otherType = "angles smaller than a right angle";
    let otherCount = acuteAngles.length;
    if (obtuseAngles.length > 0 && Math.random() > 0.5) {
       otherType = "angles greater than a right angle";
       otherCount = obtuseAngles.length;
    }
    
    const difference = Math.abs(rCount - otherCount);
    
    let askText = \`STORY: An irregular shape is drawn above. Look at its angles. What is the difference between the number of right angles and \${otherType} inside the shape?\`;
    let finalAns = \`\${difference}\`;
    let hintStr = \`Subtract the smaller number of angles from the larger number.\`;
    let solutionStr = \`Right angles = \${rCount}.\\\\n\${otherType.charAt(0).toUpperCase() + otherType.slice(1)} = \${otherCount}.\\\\nDifference = \${Math.max(rCount, otherCount)} - \${Math.min(rCount, otherCount)} = \${difference}.\`;
    
    let optionsArr = [\`"\\"\${difference}\\""\`, \`"\\"\${difference + 1}\\""\`, \`"\\"\${difference + 2}\\""\`, \`"\\"\${difference - 1 < 0 ? difference + 3 : difference - 1}\\""\`];

    visualEngineStr = JSON.stringify({ 
      componentToRender: "GEOMETRY_POLYGON", 
      componentData: { vertices: shapeVertices, rightAngles: rightAngles, acuteAngles: acuteAngles, obtuseAngles: obtuseAngles } 
    });`;

text = text.replace(regex, newBlock);
fs.writeFileSync(file, text);
