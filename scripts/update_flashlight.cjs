const fs = require('fs');
const file = '/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-2/geometry-3d-shapes/identifying-3d-shapes/standard.js';
const content = fs.readFileSync(file, 'utf8');

const newLogic = `  } else if (activeVariant === 'standard_identify_net_to_shape') {
    // Flashlight shadow logic
    const shapes = [
      { shape3D: 'Cylinder', direction: 'TOP', shadow: 'Circle' },
      { shape3D: 'Cylinder', direction: 'SIDE', shadow: 'Rectangle' },
      { shape3D: 'Cone', direction: 'TOP', shadow: 'Circle' },
      { shape3D: 'Cone', direction: 'SIDE', shadow: 'Triangle' },
      { shape3D: 'Cube', direction: 'TOP', shadow: 'Square' },
      { shape3D: 'Cube', direction: 'SIDE', shadow: 'Square' },
      { shape3D: 'Cuboid', direction: 'TOP', shadow: 'Rectangle' },
      { shape3D: 'Cuboid', direction: 'SIDE', shadow: 'Rectangle' },
      { shape3D: 'Sphere', direction: 'TOP', shadow: 'Circle' }
    ];
    
    const selected = shapes[Math.floor(Math.random() * shapes.length)];
    actualAnswer = selected.shadow;
    
    shortText = \`A flashlight is shining directly from the \${selected.direction} of this \${selected.shape3D.toLowerCase()}. What 2D shape is its shadow?\`;
    structureText = \`Identify the 2D shape of the shadow cast when a flashlight shines from the \${selected.direction} of this \${selected.shape3D.toLowerCase()}.\`;
    
    hintStr = \`Imagine looking at the \${selected.shape3D.toLowerCase()} from exactly the \${selected.direction.toLowerCase()}. What flat shape do you see?\`;
    
    const step1 = \`Identify the 3D shape.\`;
    const step2 = \`The flashlight shines from the \${selected.direction}.\`;
    const step3 = \`The shadow cast will be a \${selected.shadow}.\`;
    
    stepsStr = JSON.stringify([step1, step2, step3]);

    structureSteps = [
      { label: "What 3D shape is this?", expectedAnswer: selected.shape3D },
      { label: "What is the shape of its shadow?", expectedAnswer: selected.shadow }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_3D",
      componentData: { 
        shape: selected.shape3D.toLowerCase(), 
        color: '#3b82f6', 
        size: 100, 
        rotation: [Math.PI/6, Math.PI/4, 0] // Isometric-like angle
      }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      const distractors = ['Square', 'Rectangle', 'Circle', 'Triangle', 'Semicircle'].filter(s => s !== actualAnswer).sort(() => 0.5 - Math.random());
      while (mcqOptions.length < 4) mcqOptions.push(distractors.pop());
    }
  }`;

const startMarker = `  } else if (activeVariant === 'standard_identify_net_to_shape') {`;
const endMarker = `  // Shuffle MCQ options if applicable`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  throw new Error("Could not find bounds");
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

fs.writeFileSync(file, before + newLogic + '\n\n' + after);
console.log('Success');
