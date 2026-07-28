const fs = require('fs');
const file = '/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-2/geometry-3d-shapes/identifying-3d-shapes/standard.js';
const content = fs.readFileSync(file, 'utf8');

const newLogic = `  } else if (activeVariant === 'standard_identify_net_to_shape') {
    const shapes = [
      { shape3D: 'Cube', face2D: 'Square' },
      { shape3D: 'Cuboid', face2D: 'Rectangle' },
      { shape3D: 'Cylinder', face2D: 'Circle' },
      { shape3D: 'Cone', face2D: 'Circle' }
    ];
    
    const selected = shapes[Math.floor(Math.random() * shapes.length)];
    actualAnswer = selected.face2D;
    
    shortText = \`If you trace one flat face of this \${selected.shape3D.toLowerCase()} onto a piece of paper, what 2D shape will you draw?\`;
    structureText = \`Identify the 2D shape formed by tracing a flat face of this \${selected.shape3D.toLowerCase()}.\`;
    
    hintStr = \`Look at the flat surfaces of the \${selected.shape3D.toLowerCase()}. If you press it flat against paper and trace around it, what shape do you get?\`;
    
    const step1 = \`Identify the 3D shape.\`;
    const step2 = \`The 3D shape is a \${selected.shape3D}.\`;
    const step3 = \`Its flat face is a \${selected.face2D}.\`;
    
    stepsStr = JSON.stringify([step1, step2, step3]);

    structureSteps = [
      { label: "What 3D shape is this?", expectedAnswer: selected.shape3D },
      { label: "What 2D shape is its flat face?", expectedAnswer: selected.face2D }
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
