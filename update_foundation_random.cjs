const fs = require('fs');
const file = 'src/lib/syllabus/math/primary-3/geometry-angles/angle-comparison/foundation.js';
let text = fs.readFileSync(file, 'utf8');

const newBlock = `  if (activeVariant === 'foundation_classifying_polygon') {
    // Topologies
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
    let shapeName = "irregular shape";

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
    
    let counts = { right: rightAngles.length, acute: acuteAngles.length, greater: obtuseAngles.length };
    
    const askMost = getRandomInt(0, 1) === 0;
    let targetKey = "";
    if (askMost) {
      if (counts.right >= counts.acute && counts.right >= counts.greater) targetKey = "right angles";
      if (counts.acute > counts.right && counts.acute >= counts.greater) targetKey = "angles smaller than a right angle";
      if (counts.greater > counts.right && counts.greater > counts.acute) targetKey = "angles greater than a right angle";
    } else {
      if (counts.right <= counts.acute && counts.right <= counts.greater) targetKey = "right angles";
      if (counts.acute < counts.right && counts.acute <= counts.greater) targetKey = "angles smaller than a right angle";
      if (counts.greater < counts.right && counts.greater < counts.acute) targetKey = "angles greater than a right angle";
    }
    
    let askText = "";
    let finalAns = targetKey;
    let hintStr = \`Count all the right angles, smaller angles, and greater angles first. Then see which one has the \${askMost ? 'most' : 'least'}.\`;
    let solutionStr = \`1. Right angles = \${counts.right}.\\\\n2. Smaller angles = \${counts.acute}.\\\\n3. Greater angles = \${counts.greater}.\\\\n4. The \${askMost ? 'most' : 'least'} is \${targetKey}.\`;
    
    let optionsArr = ["\\\"right angles\\\"", "\\\"angles smaller than a right angle\\\"", "\\\"angles greater than a right angle\\\""];
    let stepsArr = [];

    const name1 = getRandomNames()[0];

    if (isStructure) {
      askText = \`STORY: [\${name1}] drew a complex \${shapeName}. Count the different types of angles inside the polygon and determine which angle type there is the \${askMost ? 'most' : 'least'} of.\`;
      stepsArr = [
        { label: \`Number of right angles:\`, expectedAnswer: \`\${counts.right}\`, acceptedAnswers: [] },
        { label: \`Number of angles smaller than a right angle:\`, expectedAnswer: \`\${counts.acute}\`, acceptedAnswers: [] },
        { label: \`Number of angles greater than a right angle:\`, expectedAnswer: \`\${counts.greater}\`, acceptedAnswers: [] },
        { label: \`Which type of angle is there the \${askMost ? 'most' : 'least'} of?\`, expectedAnswer: targetKey, acceptedAnswers: [] }
      ];
    } else {
      askText = \`STORY: Look at the \${shapeName}. Which type of angle is there the \${askMost ? 'most' : 'least'} of? (right angles, angles smaller than a right angle, or angles greater than a right angle)\`;
    }

    visualEngineStr = JSON.stringify({ 
      componentToRender: "GEOMETRY_POLYGON", 
      componentData: { vertices: shapeVertices, rightAngles: rightAngles, acuteAngles: acuteAngles, obtuseAngles: obtuseAngles } 
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = \`{"inputType": "STANDARD_TEXT"}\`;
    }`;

const oldRegex = /if \(activeVariant === 'foundation_classifying_polygon'\) \{[\s\S]*?if \(isStructure\) \{\n\s+inputRequirementStr = JSON.stringify\(\{ inputType: "MULTI_STEP_INPUT", steps: stepsArr \}\);\n\s+\} else if \(!isMCQ\) \{\n\s+inputRequirementStr = `\{"inputType": "STANDARD_TEXT"\}`;\n\s+\}/;

text = text.replace(oldRegex, newBlock);
fs.writeFileSync(file, text);
