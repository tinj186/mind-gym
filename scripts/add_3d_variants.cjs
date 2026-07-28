const fs = require('fs');
const file = '/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-2/geometry-3d-shapes/identifying-3d-shapes/standard.js';
const content = fs.readFileSync(file, 'utf8');

const newVariantsLogic = `  } else if (activeVariant === 'standard_composite_shape_counting') {
    // Generate a composite 3D robot or castle
    const themes = ['robot', 'castle', 'train'];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    
    let composition = [];
    let targetShape = '';
    let targetCount = 0;
    
    const colorPalette = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    if (theme === 'robot') {
      composition = [
        { shape: 'cuboid', color: getRandomElement(colorPalette), position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.5, 1.5, 1.5] },
        { shape: 'cube', color: getRandomElement(colorPalette), position: [0, 4.5, 0], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8] },
        { shape: 'cylinder', color: getRandomElement(colorPalette), position: [-1.5, -3, 0], rotation: [0, 0, 0], scale: [0.5, 1.2, 0.5] },
        { shape: 'cylinder', color: getRandomElement(colorPalette), position: [1.5, -3, 0], rotation: [0, 0, 0], scale: [0.5, 1.2, 0.5] },
        { shape: 'cylinder', color: getRandomElement(colorPalette), position: [-3.5, 0, 0], rotation: [0, 0, Math.PI/2], scale: [0.4, 1.2, 0.4] },
        { shape: 'cylinder', color: getRandomElement(colorPalette), position: [3.5, 0, 0], rotation: [0, 0, Math.PI/2], scale: [0.4, 1.2, 0.4] },
        { shape: 'sphere', color: '#ffffff', position: [-0.5, 5, 1.2], rotation: [0, 0, 0], scale: [0.2, 0.2, 0.2] },
        { shape: 'sphere', color: '#ffffff', position: [0.5, 5, 1.2], rotation: [0, 0, 0], scale: [0.2, 0.2, 0.2] },
        { shape: 'cone', color: getRandomElement(colorPalette), position: [0, 6.5, 0], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8] }
      ];
    } else if (theme === 'castle') {
      composition = [
        { shape: 'cuboid', color: getRandomElement(colorPalette), position: [0, 0, 0], rotation: [0, 0, 0], scale: [2, 2, 2] },
        { shape: 'cylinder', color: getRandomElement(colorPalette), position: [-4, 0, -4], rotation: [0, 0, 0], scale: [0.8, 2, 0.8] },
        { shape: 'cylinder', color: getRandomElement(colorPalette), position: [4, 0, -4], rotation: [0, 0, 0], scale: [0.8, 2, 0.8] },
        { shape: 'cylinder', color: getRandomElement(colorPalette), position: [-4, 0, 4], rotation: [0, 0, 0], scale: [0.8, 2, 0.8] },
        { shape: 'cylinder', color: getRandomElement(colorPalette), position: [4, 0, 4], rotation: [0, 0, 0], scale: [0.8, 2, 0.8] },
        { shape: 'cone', color: getRandomElement(colorPalette), position: [-4, 4.5, -4], rotation: [0, 0, 0], scale: [0.9, 1, 0.9] },
        { shape: 'cone', color: getRandomElement(colorPalette), position: [4, 4.5, -4], rotation: [0, 0, 0], scale: [0.9, 1, 0.9] },
        { shape: 'cone', color: getRandomElement(colorPalette), position: [-4, 4.5, 4], rotation: [0, 0, 0], scale: [0.9, 1, 0.9] },
        { shape: 'cone', color: getRandomElement(colorPalette), position: [4, 4.5, 4], rotation: [0, 0, 0], scale: [0.9, 1, 0.9] }
      ];
    } else { // train
      composition = [
        { shape: 'cuboid', color: getRandomElement(colorPalette), position: [0, 0, 0], rotation: [0, 0, Math.PI/2], scale: [1.2, 2, 1.2] },
        { shape: 'cube', color: getRandomElement(colorPalette), position: [-2, 2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        { shape: 'cylinder', color: getRandomElement(colorPalette), position: [2, 0, 0], rotation: [0, 0, Math.PI/2], scale: [1, 1.5, 1] },
        { shape: 'cylinder', color: getRandomElement(colorPalette), position: [3, 2, 0], rotation: [0, 0, 0], scale: [0.4, 0.8, 0.4] },
        { shape: 'cylinder', color: '#333333', position: [-2, -2, 2], rotation: [Math.PI/2, 0, 0], scale: [0.6, 0.2, 0.6] },
        { shape: 'cylinder', color: '#333333', position: [-2, -2, -2], rotation: [Math.PI/2, 0, 0], scale: [0.6, 0.2, 0.6] },
        { shape: 'cylinder', color: '#333333', position: [1, -2, 2], rotation: [Math.PI/2, 0, 0], scale: [0.6, 0.2, 0.6] },
        { shape: 'cylinder', color: '#333333', position: [1, -2, -2], rotation: [Math.PI/2, 0, 0], scale: [0.6, 0.2, 0.6] },
        { shape: 'cylinder', color: '#333333', position: [3, -2, 2], rotation: [Math.PI/2, 0, 0], scale: [0.6, 0.2, 0.6] },
        { shape: 'cylinder', color: '#333333', position: [3, -2, -2], rotation: [Math.PI/2, 0, 0], scale: [0.6, 0.2, 0.6] }
      ];
    }
    
    const uniqueShapes = [...new Set(composition.map(s => s.shape))];
    targetShape = getRandomElement(uniqueShapes);
    targetCount = composition.filter(s => s.shape === targetShape).length;
    
    actualAnswer = String(targetCount);
    
    shortText = \`Look at the \${theme}. How many \${targetShape}s are used to build it?\`;
    structureText = \`Analyze the composite 3D \${theme} and count the exact number of \${targetShape}s used.\`;
    
    hintStr = \`Count every \${targetShape} you see on the \${theme}. Don't forget to look around the sides!\`;
    
    const step1 = \`Identify the \${targetShape} shape.\`;
    const step2 = \`Carefully count each \${targetShape} used in the \${theme} structure.\`;
    const step3 = \`There are \${targetCount} \${targetShape}s in total.\`;
    
    stepsStr = JSON.stringify([step1, step2, step3]);

    structureSteps = [
      { label: "Target Shape", expectedAnswer: formatShapeName(targetShape) },
      { label: \`Total \${formatShapeName(targetShape)}s\`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "COMPOSITE_SHAPE_3D",
      componentData: { composition }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      while (mcqOptions.length < 4) {
        const wrong = String(Math.max(1, targetCount + getRandomInt(-2, 3)));
        if (!mcqOptions.includes(wrong)) mcqOptions.push(wrong);
      }
    }
  } else if (activeVariant === 'standard_fractional_shape_composition') {
    const dimensions = getRandomElement([
      { x: 2, y: 2, z: 2, name: "2 by 2 by 2 larger cube" },
      { x: 3, y: 2, z: 2, name: "3 by 2 by 2 cuboid" },
      { x: 2, y: 3, z: 2, name: "2 by 3 by 2 cuboid" }
    ]);
    
    const totalCubes = dimensions.x * dimensions.y * dimensions.z;
    const composition = [];
    const offset = 3.2; 
    
    const startX = -(dimensions.x - 1) * offset / 2;
    const startY = -(dimensions.y - 1) * offset / 2;
    const startZ = -(dimensions.z - 1) * offset / 2;
    
    for (let x = 0; x < dimensions.x; x++) {
      for (let y = 0; y < dimensions.y; y++) {
        for (let z = 0; z < dimensions.z; z++) {
          composition.push({
            shape: 'cube',
            color: '#3b82f6',
            position: [startX + x * offset, startY + y * offset, startZ + z * offset],
            rotation: [0, 0, 0],
            scale: [0.95, 0.95, 0.95] 
          });
        }
      }
    }
    
    actualAnswer = String(totalCubes);
    
    shortText = \`How many small unit cubes are needed to completely build this \${dimensions.name}?\`;
    structureText = \`Calculate the total number of unit cubes used to build the \${dimensions.name} structure.\`;
    
    hintStr = \`Count the cubes in one layer, then multiply by the number of layers!\`;
    
    const cubesPerLayer = dimensions.x * dimensions.z;
    const layers = dimensions.y;
    
    const step1 = \`Count the number of cubes in the bottom layer.\`;
    const step2 = \`The bottom layer has \${dimensions.x} × \${dimensions.z} = \${cubesPerLayer} cubes.\`;
    const step3 = \`There are \${layers} layers in total.\`;
    const step4 = \`\${cubesPerLayer} cubes × \${layers} layers = \${totalCubes} unit cubes.\`;
    
    stepsStr = JSON.stringify([step1, step2, step3, step4]);

    structureSteps = [
      { label: "Cubes in one layer", expectedAnswer: String(cubesPerLayer) },
      { label: "Number of layers", expectedAnswer: String(layers) },
      { label: "Total unit cubes", expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "COMPOSITE_SHAPE_3D",
      componentData: { composition }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      while (mcqOptions.length < 4) {
        const wrong = String(Math.max(4, totalCubes + getRandomInt(-4, 6)));
        if (!mcqOptions.includes(wrong)) mcqOptions.push(wrong);
      }
    }
  } else if (activeVariant === 'standard_identify_net_to_shape') {
    const nets = [
      {
        target: 'Cube',
        svg: \`<svg viewBox="0 0 100 100" class="w-full h-full max-w-xs mx-auto stroke-slate-800 stroke-2 fill-blue-200">
                <rect x="40" y="20" width="20" height="20" />
                <rect x="20" y="40" width="20" height="20" />
                <rect x="40" y="40" width="20" height="20" />
                <rect x="60" y="40" width="20" height="20" />
                <rect x="40" y="60" width="20" height="20" />
                <rect x="40" y="80" width="20" height="20" />
                <g stroke-dasharray="2 2" stroke-width="1.5" opacity="0.6">
                  <line x1="40" y1="40" x2="60" y2="40" />
                  <line x1="40" y1="60" x2="60" y2="60" />
                  <line x1="40" y1="40" x2="40" y2="60" />
                  <line x1="60" y1="40" x2="60" y2="60" />
                  <line x1="40" y1="80" x2="60" y2="80" />
                </g>
              </svg>\`
      },
      {
        target: 'Cuboid',
        svg: \`<svg viewBox="0 0 120 100" class="w-full h-full max-w-xs mx-auto stroke-slate-800 stroke-2 fill-green-200">
                <rect x="50" y="10" width="20" height="20" />
                <rect x="20" y="30" width="30" height="20" />
                <rect x="50" y="30" width="20" height="20" />
                <rect x="70" y="30" width="30" height="20" />
                <rect x="50" y="50" width="20" height="20" />
                <rect x="50" y="70" width="20" height="30" />
                <g stroke-dasharray="2 2" stroke-width="1.5" opacity="0.6">
                  <line x1="50" y1="30" x2="70" y2="30" />
                  <line x1="50" y1="50" x2="70" y2="50" />
                  <line x1="50" y1="30" x2="50" y2="50" />
                  <line x1="70" y1="30" x2="70" y2="50" />
                  <line x1="50" y1="70" x2="70" y2="70" />
                </g>
              </svg>\`
      },
      {
        target: 'Cylinder',
        svg: \`<svg viewBox="0 0 100 120" class="w-full h-full max-w-xs mx-auto stroke-slate-800 stroke-2 fill-yellow-200">
                <circle cx="50" cy="20" r="15" />
                <rect x="20" y="35" width="60" height="50" />
                <circle cx="50" cy="100" r="15" />
                <g stroke-dasharray="2 2" stroke-width="1.5" opacity="0.6">
                  <line x1="20" y1="35" x2="80" y2="35" />
                  <line x1="20" y1="85" x2="80" y2="85" />
                </g>
              </svg>\`
      },
      {
        target: 'Cone',
        svg: \`<svg viewBox="0 0 100 100" class="w-full h-full max-w-xs mx-auto stroke-slate-800 stroke-2 fill-purple-200">
                <path d="M 50 10 L 10 70 A 50 50 0 0 0 90 70 Z" />
                <circle cx="50" cy="85" r="15" />
                <g stroke-dasharray="2 2" stroke-width="1.5" opacity="0.6">
                  <path d="M 10 70 Q 50 75 90 70" fill="none" />
                </g>
              </svg>\`
      }
    ];
    
    const selectedNet = getRandomElement(nets);
    actualAnswer = selectedNet.target;
    
    shortText = "If you fold this 2D net along the dotted lines, what 3D shape will it form?";
    structureText = "Identify the resulting 3D shape when this 2D net is mentally folded.";
    
    hintStr = \`Imagine lifting the flaps and folding them together. What shape has these faces?\`;
    
    const step1 = \`Count the number and type of faces on the net.\`;
    
    let step2 = '';
    let facesObserved = "";
    if (actualAnswer === 'Cube') {
      step2 = \`There are 6 identical square faces.\`;
      facesObserved = "6 square faces";
    } else if (actualAnswer === 'Cuboid') {
      step2 = \`There are 6 rectangular/square faces, some of different sizes.\`;
      facesObserved = "6 rectangular faces";
    } else if (actualAnswer === 'Cylinder') {
      step2 = \`There are 2 identical circles and 1 large rectangle that wraps around.\`;
      facesObserved = "2 circles, 1 rectangle";
    } else if (actualAnswer === 'Cone') {
      step2 = \`There is 1 circle and 1 curved sector that wraps around.\`;
      facesObserved = "1 circle, 1 sector";
    }
    
    const step3 = \`The 3D shape that is made from these faces is a \${actualAnswer}.\`;
    
    stepsStr = JSON.stringify([step1, step2, step3]);

    structureSteps = [
      { label: "Faces observed", expectedAnswer: facesObserved },
      { label: "Resulting 3D shape", expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "HTML_CONTENT",
      componentData: { html: selectedNet.svg }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      const distractors = ['Cube', 'Cuboid', 'Cylinder', 'Cone', 'Sphere'].filter(s => s !== actualAnswer).sort(() => 0.5 - Math.random());
      while (mcqOptions.length < 4) mcqOptions.push(distractors.pop());
    }
  }`;

const endIdx = content.indexOf(`  }

  // Shuffle MCQ options if applicable`);
  
if (endIdx === -1) throw new Error("Could not find end of variants");

const before = content.substring(0, endIdx);
const after = content.substring(endIdx);

fs.writeFileSync(file, before + newVariantsLogic + after);
console.log('Success');
