const fs = require('fs');
const file = '/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-2/geometry-3d-shapes/identifying-3d-shapes/standard.js';
const content = fs.readFileSync(file, 'utf8');

const newLogic = `  } else if (activeVariant === 'standard_fractional_shape_composition') {
    const shapeType = getRandomElement(['cube', 'cuboid', 'cylinder']);
    let shapeNameStr = "unit cubes";
    let singleShapeStr = "unit cube";
    let colorHex = '#3b82f6';
    let offsetX = 3.2, offsetY = 3.2, offsetZ = 3.2;
    
    if (shapeType === 'cuboid') {
      shapeNameStr = "unit cuboids";
      singleShapeStr = "unit cuboid";
      colorHex = '#22c55e';
      offsetX = 4.2; offsetY = 2.7; offsetZ = 2.7;
    } else if (shapeType === 'cylinder') {
      shapeNameStr = "unit cylinders";
      singleShapeStr = "unit cylinder";
      colorHex = '#f97316';
      offsetX = 3.2; offsetY = 4.2; offsetZ = 3.2;
    }
    
    const dimensions = getRandomElement([
      { x: 2, y: 2, z: 2, name: \`2 by 2 by 2 larger \${shapeType === 'cube' ? 'cube' : 'structure'}\` },
      { x: 3, y: 2, z: 2, name: \`3 by 2 by 2 larger structure\` },
      { x: 2, y: 3, z: 2, name: \`2 by 3 by 2 larger structure\` }
    ]);
    
    const totalCubes = dimensions.x * dimensions.y * dimensions.z;
    const composition = [];
    
    const startX = -(dimensions.x - 1) * offsetX / 2;
    const startY = -(dimensions.y - 1) * offsetY / 2;
    const startZ = -(dimensions.z - 1) * offsetZ / 2;
    
    for (let x = 0; x < dimensions.x; x++) {
      for (let y = 0; y < dimensions.y; y++) {
        for (let z = 0; z < dimensions.z; z++) {
          composition.push({
            shape: shapeType,
            color: colorHex,
            position: [startX + x * offsetX, startY + y * offsetY, startZ + z * offsetZ],
            rotation: [0, 0, 0],
            scale: [0.95, 0.95, 0.95] 
          });
        }
      }
    }
    
    actualAnswer = String(totalCubes);
    
    shortText = \`How many \${shapeNameStr} are needed to completely build this \${dimensions.name}?\`;
    structureText = \`Calculate the total number of \${shapeNameStr} used to build the \${dimensions.name}.\`;
    
    hintStr = \`Count the \${shapeNameStr} in one layer, then multiply by the number of layers!\`;
    
    const cubesPerLayer = dimensions.x * dimensions.z;
    const layers = dimensions.y;
    
    const step1 = \`Count the number of \${shapeNameStr} in the bottom layer.\`;
    const step2 = \`The bottom layer has \${dimensions.x} × \${dimensions.z} = \${cubesPerLayer} \${shapeNameStr}.\`;
    const step3 = \`There are \${layers} layers in total.\`;
    const step4 = \`\${cubesPerLayer} \${shapeNameStr} × \${layers} layers = \${totalCubes} \${shapeNameStr}.\`;
    
    stepsStr = JSON.stringify([step1, step2, step3, step4]);

    structureSteps = [
      { label: \`\${singleShapeStr.charAt(0).toUpperCase() + singleShapeStr.slice(1)}s in one layer\`, expectedAnswer: String(cubesPerLayer) },
      { label: "Number of layers", expectedAnswer: String(layers) },
      { label: \`Total \${shapeNameStr}\`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "COMPOSITE_SHAPE_3D",
      componentData: { composition, isometric: true, autoRotate: false }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      while (mcqOptions.length < 4) {
        const wrong = String(Math.max(4, totalCubes + getRandomInt(-4, 6)));
        if (!mcqOptions.includes(wrong)) mcqOptions.push(wrong);
      }
    }
  } else if (activeVariant === 'standard_identify_net_to_shape') {`;

const startMarker = `  } else if (activeVariant === 'standard_fractional_shape_composition') {`;
const endMarker = `  } else if (activeVariant === 'standard_identify_net_to_shape') {`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  throw new Error("Could not find bounds");
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex + endMarker.length);

fs.writeFileSync(file, before + newLogic + after);
console.log('Success');
