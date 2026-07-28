const fs = require('fs');
const file = '/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-2/geometry-3d-shapes/identifying-3d-shapes/standard.js';
const content = fs.readFileSync(file, 'utf8');

const newLogic = `  } else if (activeVariant === 'standard_composite_shape_counting') {
    // Generate a composite 3D robot, castle, or train procedurally for infinite variety
    const themes = ['robot', 'castle', 'train'];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    
    let composition = [];
    let targetShape = '';
    let targetCount = 0;
    
    const colorPalette = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316'];
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    if (theme === 'robot') {
      const hasAntenna = Math.random() > 0.5;
      const numEyes = getRandomInt(1, 3);
      const armRot = getRandomElement([0, Math.PI/4, -Math.PI/4]);
      
      // Body & Head
      composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.5, 1.5, 1.5] });
      composition.push({ shape: 'cube', color: getRandomElement(colorPalette), position: [0, 4.5, 0], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8] });
      
      // Legs (can be cylinders or cuboids)
      const legShape = Math.random() > 0.5 ? 'cylinder' : 'cuboid';
      composition.push({ shape: legShape, color: getRandomElement(colorPalette), position: [-1.5, -3, 0], rotation: [0, 0, 0], scale: [0.5, 1.2, 0.5] });
      composition.push({ shape: legShape, color: getRandomElement(colorPalette), position: [1.5, -3, 0], rotation: [0, 0, 0], scale: [0.5, 1.2, 0.5] });
      
      // Arms (can be raised or lowered)
      composition.push({ shape: 'cylinder', color: getRandomElement(colorPalette), position: [-3.5, 0, 0], rotation: [0, 0, Math.PI/2 + armRot], scale: [0.4, 1.2, 0.4] });
      composition.push({ shape: 'cylinder', color: getRandomElement(colorPalette), position: [3.5, 0, 0], rotation: [0, 0, Math.PI/2 - armRot], scale: [0.4, 1.2, 0.4] });
      
      // Eyes
      const eyeX = [-0.6, 0, 0.6];
      for (let i=0; i<numEyes; i++) {
        composition.push({ shape: 'sphere', color: '#ffffff', position: [numEyes === 1 ? 0 : eyeX[i], 5, 1.2], rotation: [0, 0, 0], scale: [0.2, 0.2, 0.2] });
      }
      
      // Hat or Antenna
      if (hasAntenna) {
        composition.push({ shape: 'cylinder', color: '#cbd5e1', position: [0, 6.5, 0], rotation: [0, 0, 0], scale: [0.1, 1, 0.1] });
        composition.push({ shape: 'sphere', color: getRandomElement(colorPalette), position: [0, 7.5, 0], rotation: [0, 0, 0], scale: [0.3, 0.3, 0.3] });
      } else {
        composition.push({ shape: 'cone', color: getRandomElement(colorPalette), position: [0, 6.5, 0], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8] });
      }
      
    } else if (theme === 'castle') {
      const numTowers = getRandomElement([2, 4, 6]);
      const hasDoor = Math.random() > 0.5;
      
      // Main building
      composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [0, 0, 0], rotation: [0, 0, 0], scale: [2, 2, 2] });
      
      // Door
      if (hasDoor) {
        composition.push({ shape: 'cuboid', color: '#854d0e', position: [0, -2, 2.6], rotation: [0, 0, 0], scale: [0.6, 1, 0.1] });
      }
      
      // Towers
      const towerPositions = [
        [-4, -4], [4, -4], [-4, 4], [4, 4], [0, -4], [0, 4]
      ].slice(0, numTowers);
      
      towerPositions.forEach(pos => {
        // Tower base
        composition.push({ shape: 'cylinder', color: getRandomElement(colorPalette), position: [pos[0], 0, pos[1]], rotation: [0, 0, 0], scale: [0.8, 2, 0.8] });
        // Tower roof (cone or cube)
        const roofShape = Math.random() > 0.3 ? 'cone' : 'cube';
        composition.push({ shape: roofShape, color: getRandomElement(colorPalette), position: [pos[0], 4.5, pos[1]], rotation: [0, 0, 0], scale: [0.9, 1, 0.9] });
      });
      
    } else { // train
      const numWheels = getRandomElement([4, 6, 8]);
      const hasCargo = Math.random() > 0.5;
      
      // Engine Body
      composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [0, 0, 0], rotation: [0, 0, Math.PI/2], scale: [1.2, 2, 1.2] });
      // Cabin
      composition.push({ shape: 'cube', color: getRandomElement(colorPalette), position: [-2, 2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] });
      // Boiler
      composition.push({ shape: 'cylinder', color: getRandomElement(colorPalette), position: [2, 0, 0], rotation: [0, 0, Math.PI/2], scale: [1, 1.5, 1] });
      // Funnel (cylinder or cone)
      const funnelShape = Math.random() > 0.5 ? 'cylinder' : 'cone';
      composition.push({ shape: funnelShape, color: getRandomElement(colorPalette), position: [3, 2, 0], rotation: [0, 0, 0], scale: [0.4, 0.8, 0.4] });
      
      // Cargo
      if (hasCargo) {
        composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [-6, 0, 0], rotation: [0, 0, Math.PI/2], scale: [1.2, 1.5, 1.2] });
        // Link
        composition.push({ shape: 'cylinder', color: '#94a3b8', position: [-4, -1, 0], rotation: [0, 0, Math.PI/2], scale: [0.2, 0.8, 0.2] });
      }
      
      // Wheels
      for (let i=0; i<numWheels/2; i++) {
        const xPos = 3 - (i * 2);
        composition.push({ shape: 'cylinder', color: '#333333', position: [xPos, -2, 2], rotation: [Math.PI/2, 0, 0], scale: [0.6, 0.2, 0.6] });
        composition.push({ shape: 'cylinder', color: '#333333', position: [xPos, -2, -2], rotation: [Math.PI/2, 0, 0], scale: [0.6, 0.2, 0.6] });
      }
    }`;

// Find the target block to replace
const startMarker = `  } else if (activeVariant === 'standard_composite_shape_counting') {`;
const endMarker = `    const uniqueShapes = [...new Set(composition.map(s => s.shape))];`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  throw new Error("Could not find replacement bounds");
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

fs.writeFileSync(file, before + newLogic + '\n    ' + after);
console.log('Success');
