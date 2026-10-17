const fs = require('fs');
const file = 'src/lib/syllabus/math/primary-3/geometry-angles/angle-comparison/foundation.js';
let text = fs.readFileSync(file, 'utf8');

const newBlock = `  if (activeVariant === 'foundation_classifying_polygon') {
    // Generate a list of shapes
    const shapes = [
      { name: "stairs shape", vertices: [{x:20,y:80}, {x:80,y:80}, {x:80,y:60}, {x:60,y:60}, {x:60,y:40}, {x:40,y:40}, {x:40,y:20}, {x:20,y:20}] },
      { name: "arrow shape", vertices: [{x:20,y:50}, {x:60,y:40}, {x:60,y:20}, {x:90,y:50}, {x:60,y:80}, {x:60,y:60}] },
      { name: "sawtooth shape", vertices: [{x:10,y:80}, {x:90,y:80}, {x:80,y:40}, {x:65,y:60}, {x:50,y:30}, {x:35,y:60}, {x:20,y:40}] },
      { name: "house shape", vertices: [{x:20,y:80}, {x:80,y:80}, {x:80,y:40}, {x:70,y:30}, {x:70,y:10}, {x:60,y:10}, {x:60,y:20}, {x:50,y:10}, {x:20,y:40}] },
      { name: "crown shape", vertices: [{x:20,y:80}, {x:80,y:80}, {x:80,y:40}, {x:65,y:60}, {x:50,y:20}, {x:35,y:60}, {x:20,y:40}] },
      { name: "cross shape", vertices: [{x:40,y:10}, {x:60,y:10}, {x:60,y:40}, {x:90,y:40}, {x:90,y:60}, {x:60,y:60}, {x:60,y:90}, {x:40,y:90}, {x:40,y:60}, {x:10,y:60}, {x:10,y:40}, {x:40,y:40}] },
      { name: "T-shape", vertices: [{x:20,y:20}, {x:80,y:20}, {x:80,y:40}, {x:60,y:40}, {x:60,y:80}, {x:40,y:80}, {x:40,y:40}, {x:20,y:40}] },
      { name: "L-shape", vertices: [{x:20,y:20}, {x:40,y:20}, {x:40,y:60}, {x:80,y:60}, {x:80,y:80}, {x:20,y:80}] }
    ];
    
    // Pick random shape
    const shape = getRandomArrayElement(shapes);
    
    // Auto-classify angles
    let rightAngles = [];
    let acuteAngles = [];
    let obtuseAngles = [];
    
    let area = 0;
    for (let i = 0; i < shape.vertices.length; i++) {
      let j = (i + 1) % shape.vertices.length;
      area += shape.vertices[i].x * shape.vertices[j].y - shape.vertices[j].x * shape.vertices[i].y;
    }
    let isClockwise = area >= 0;
    
    for (let i = 0; i < shape.vertices.length; i++) {
      let prev = shape.vertices[(i - 1 + shape.vertices.length) % shape.vertices.length];
      let curr = shape.vertices[i];
      let next = shape.vertices[(i + 1) % shape.vertices.length];
      
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
    
    shape.rightAngles = rightAngles;
    shape.acuteAngles = acuteAngles;
    shape.obtuseAngles = obtuseAngles;
    shape.counts = { right: rightAngles.length, acute: acuteAngles.length, greater: obtuseAngles.length };
    
    const askMost = getRandomInt(0, 1) === 0;
    let targetKey = "";
    if (askMost) {
      if (shape.counts.right > shape.counts.acute && shape.counts.right > shape.counts.greater) targetKey = "right angles";
      else if (shape.counts.acute > shape.counts.right && shape.counts.acute > shape.counts.greater) targetKey = "angles smaller than a right angle";
      else if (shape.counts.greater > shape.counts.right && shape.counts.greater > shape.counts.acute) targetKey = "angles greater than a right angle";
      else targetKey = "they are all equal"; // fallback
    } else {
      if (shape.counts.right < shape.counts.acute && shape.counts.right < shape.counts.greater) targetKey = "right angles";
      else if (shape.counts.acute < shape.counts.right && shape.counts.acute < shape.counts.greater) targetKey = "angles smaller than a right angle";
      else if (shape.counts.greater < shape.counts.right && shape.counts.greater < shape.counts.acute) targetKey = "angles greater than a right angle";
      else targetKey = "they are all equal";
    }
    
    let askText = "";
    let finalAns = targetKey;
    let hintStr = \`Count all the right angles, smaller angles, and greater angles first. Then see which one has the \${askMost ? 'most' : 'least'}.\`;
    let solutionStr = \`1. Right angles = \${shape.counts.right}.\\\\n2. Smaller angles = \${shape.counts.acute}.\\\\n3. Greater angles = \${shape.counts.greater}.\\\\n4. The \${askMost ? 'most' : 'least'} is \${targetKey}.\`;
    
    let optionsArr = ["\\\"right angles\\\"", "\\\"angles smaller than a right angle\\\"", "\\\"angles greater than a right angle\\\"", "\\\"they are all equal\\\""];
    let stepsArr = [];

    const name1 = getRandomNames()[0];

    if (isStructure) {
      askText = \`STORY: [\${name1}] drew a complex \${shape.name}. Count the different types of angles inside the polygon and determine which angle type there is the \${askMost ? 'most' : 'least'} of.\`;
      stepsArr = [
        { label: \`Number of right angles:\`, expectedAnswer: \`\${shape.counts.right}\`, acceptedAnswers: [] },
        { label: \`Number of angles smaller than a right angle:\`, expectedAnswer: \`\${shape.counts.acute}\`, acceptedAnswers: [] },
        { label: \`Number of angles greater than a right angle:\`, expectedAnswer: \`\${shape.counts.greater}\`, acceptedAnswers: [] },
        { label: \`Which type of angle is there the \${askMost ? 'most' : 'least'} of?\`, expectedAnswer: targetKey, acceptedAnswers: [] }
      ];
    } else {
      askText = \`STORY: Look at the \${shape.name}. Which type of angle is there the \${askMost ? 'most' : 'least'} of? (right angles, angles smaller than a right angle, or angles greater than a right angle)\`;
    }

    visualEngineStr = JSON.stringify({ 
      componentToRender: "GEOMETRY_POLYGON", 
      componentData: { vertices: shape.vertices, rightAngles: shape.rightAngles, acuteAngles: shape.acuteAngles, obtuseAngles: shape.obtuseAngles } 
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = \`{"inputType": "STANDARD_TEXT"}\`;
    }`;

const oldRegex = /if \(activeVariant === 'foundation_classifying_polygon'\) \{[\s\S]*?if \(isStructure\) \{\n\s+inputRequirementStr = JSON.stringify\(\{ inputType: "MULTI_STEP_INPUT", steps: stepsArr \}\);\n\s+\} else if \(!isMCQ\) \{\n\s+inputRequirementStr = `\{"inputType": "STANDARD_TEXT"\}`;\n\s+\}/;

text = text.replace(oldRegex, newBlock);
fs.writeFileSync(file, text);
