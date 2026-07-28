const fs = require('fs');
const file = '/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-2/geometry-3d-shapes/identifying-3d-shapes/standard.js';
const content = fs.readFileSync(file, 'utf8');

const newLogic = `  } else if (activeVariant === 'standard_composite_shape_counting') {
    const themes = ['robot', 'castle', 'train', 'rocket', 'house', 'truck', 'tree', 'dog', 'bridge', 'boat'];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    
    let composition = [];
    let targetShape = '';
    let targetCount = 0;
    
    const colorPalette = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316', '#ec4899', '#06b6d4'];
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    if (theme === 'robot') {
      const hasAntenna = Math.random() > 0.5;
      const numEyes = getRandomInt(1, 3);
      const armRot = getRandomElement([0, Math.PI/4, -Math.PI/4]);
      
      composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.5, 1.5, 1.5] });
      composition.push({ shape: 'cube', color: getRandomElement(colorPalette), position: [0, 4.5, 0], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8] });
      
      const legShape = Math.random() > 0.5 ? 'cylinder' : 'cuboid';
      composition.push({ shape: legShape, color: getRandomElement(colorPalette), position: [-1.5, -3, 0], rotation: [0, 0, 0], scale: [0.5, 1.2, 0.5] });
      composition.push({ shape: legShape, color: getRandomElement(colorPalette), position: [1.5, -3, 0], rotation: [0, 0, 0], scale: [0.5, 1.2, 0.5] });
      
      composition.push({ shape: 'cylinder', color: getRandomElement(colorPalette), position: [-3.5, 0, 0], rotation: [0, 0, Math.PI/2 + armRot], scale: [0.4, 1.2, 0.4] });
      composition.push({ shape: 'cylinder', color: getRandomElement(colorPalette), position: [3.5, 0, 0], rotation: [0, 0, Math.PI/2 - armRot], scale: [0.4, 1.2, 0.4] });
      
      const eyeX = [-0.6, 0, 0.6];
      for (let i=0; i<numEyes; i++) {
        composition.push({ shape: 'sphere', color: '#ffffff', position: [numEyes === 1 ? 0 : eyeX[i], 5, 1.2], rotation: [0, 0, 0], scale: [0.2, 0.2, 0.2] });
      }
      
      if (hasAntenna) {
        composition.push({ shape: 'cylinder', color: '#cbd5e1', position: [0, 6.5, 0], rotation: [0, 0, 0], scale: [0.1, 1, 0.1] });
        composition.push({ shape: 'sphere', color: getRandomElement(colorPalette), position: [0, 7.5, 0], rotation: [0, 0, 0], scale: [0.3, 0.3, 0.3] });
      } else {
        composition.push({ shape: 'cone', color: getRandomElement(colorPalette), position: [0, 6.5, 0], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8] });
      }
      
    } else if (theme === 'castle') {
      const numTowers = getRandomElement([2, 4, 6]);
      const hasDoor = Math.random() > 0.5;
      
      composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [0, 0, 0], rotation: [0, 0, 0], scale: [2, 2, 2] });
      
      if (hasDoor) {
        composition.push({ shape: 'cuboid', color: '#854d0e', position: [0, -2, 2.6], rotation: [0, 0, 0], scale: [0.6, 1, 0.1] });
      }
      
      const towerPositions = [
        [-4, -4], [4, -4], [-4, 4], [4, 4], [0, -4], [0, 4]
      ].slice(0, numTowers);
      
      towerPositions.forEach(pos => {
        composition.push({ shape: 'cylinder', color: getRandomElement(colorPalette), position: [pos[0], 0, pos[1]], rotation: [0, 0, 0], scale: [0.8, 2, 0.8] });
        const roofShape = Math.random() > 0.3 ? 'cone' : 'cube';
        composition.push({ shape: roofShape, color: getRandomElement(colorPalette), position: [pos[0], 4.5, pos[1]], rotation: [0, 0, 0], scale: [0.9, 1, 0.9] });
      });
      
    } else if (theme === 'train') {
      const numWheels = getRandomElement([4, 6, 8]);
      const hasCargo = Math.random() > 0.5;
      
      composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [0, 0, 0], rotation: [0, 0, Math.PI/2], scale: [1.2, 2, 1.2] });
      composition.push({ shape: 'cube', color: getRandomElement(colorPalette), position: [-2, 2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] });
      composition.push({ shape: 'cylinder', color: getRandomElement(colorPalette), position: [2, 0, 0], rotation: [0, 0, Math.PI/2], scale: [1, 1.5, 1] });
      
      const funnelShape = Math.random() > 0.5 ? 'cylinder' : 'cone';
      composition.push({ shape: funnelShape, color: getRandomElement(colorPalette), position: [3, 2, 0], rotation: [0, 0, 0], scale: [0.4, 0.8, 0.4] });
      
      if (hasCargo) {
        composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [-6, 0, 0], rotation: [0, 0, Math.PI/2], scale: [1.2, 1.5, 1.2] });
        composition.push({ shape: 'cylinder', color: '#94a3b8', position: [-4, -1, 0], rotation: [0, 0, Math.PI/2], scale: [0.2, 0.8, 0.2] });
      }
      
      for (let i=0; i<numWheels/2; i++) {
        const xPos = 3 - (i * 2);
        composition.push({ shape: 'cylinder', color: '#333333', position: [xPos, -2, 2], rotation: [Math.PI/2, 0, 0], scale: [0.6, 0.2, 0.6] });
        composition.push({ shape: 'cylinder', color: '#333333', position: [xPos, -2, -2], rotation: [Math.PI/2, 0, 0], scale: [0.6, 0.2, 0.6] });
      }
    } else if (theme === 'rocket') {
      const numThrusters = getRandomElement([1, 3, 4]);
      const numFins = getRandomElement([2, 4]);
      const noseShape = Math.random() > 0.5 ? 'cone' : 'sphere';
      
      composition.push({ shape: 'cylinder', color: getRandomElement(colorPalette), position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.5, 2.5, 1.5] });
      composition.push({ shape: noseShape, color: getRandomElement(colorPalette), position: [0, 6, 0], rotation: [0, 0, 0], scale: [1.5, 1.5, 1.5] });
      
      for(let i=0; i<numThrusters; i++) {
        const angle = (i / numThrusters) * Math.PI * 2;
        const radius = numThrusters === 1 ? 0 : 1;
        composition.push({ shape: 'cone', color: '#f97316', position: [Math.cos(angle)*radius, -5, Math.sin(angle)*radius], rotation: [Math.PI, 0, 0], scale: [0.5, 0.8, 0.5] });
      }
      
      for(let i=0; i<numFins; i++) {
        const angle = (i / numFins) * Math.PI * 2;
        composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [Math.cos(angle)*2.5, -2, Math.sin(angle)*2.5], rotation: [0, -angle, 0], scale: [0.2, 1, 0.8] });
      }
      
      composition.push({ shape: 'sphere', color: '#67e8f9', position: [0, 2, 2.2], rotation: [0, 0, 0], scale: [0.4, 0.4, 0.1] });
      if (Math.random() > 0.5) {
        composition.push({ shape: 'sphere', color: '#67e8f9', position: [0, -1, 2.2], rotation: [0, 0, 0], scale: [0.4, 0.4, 0.1] });
      }
    } else if (theme === 'house') {
      const hasChimney = Math.random() > 0.5;
      const windowCount = getRandomElement([2, 4]);
      
      composition.push({ shape: 'cube', color: getRandomElement(colorPalette), position: [0, 0, 0], rotation: [0, 0, 0], scale: [2, 2, 2] });
      composition.push({ shape: 'cone', color: getRandomElement(colorPalette), position: [0, 4.5, 0], rotation: [0, 0, 0], scale: [2.2, 1.2, 2.2] });
      
      composition.push({ shape: 'cuboid', color: '#854d0e', position: [0, -1.5, 3.1], rotation: [0, 0, 0], scale: [0.4, 1, 0.1] });
      
      const wx = [-1.5, 1.5];
      for(let i=0; i<windowCount; i++) {
        const y = i < 2 ? 1 : -1;
        composition.push({ shape: 'cube', color: '#67e8f9', position: [wx[i%2], y, 3.1], rotation: [0, 0, 0], scale: [0.3, 0.3, 0.1] });
      }
      
      if (hasChimney) {
        composition.push({ shape: 'cylinder', color: '#ef4444', position: [1.5, 5, 1.5], rotation: [0, 0, 0], scale: [0.3, 1, 0.3] });
      }
    } else if (theme === 'truck') {
      const hasTrailer = Math.random() > 0.5;
      const numWheels = hasTrailer ? 8 : 6;
      
      composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [2, 0, 0], rotation: [0, 0, Math.PI/2], scale: [1, 1.5, 1] });
      composition.push({ shape: 'cube', color: getRandomElement(colorPalette), position: [1, 2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] });
      
      if (hasTrailer) {
        composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [-3, 0.5, 0], rotation: [0, 0, Math.PI/2], scale: [1.5, 2.5, 1.2] });
      } else {
        composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [-2, -0.5, 0], rotation: [0, 0, Math.PI/2], scale: [0.5, 1.5, 1] });
      }
      
      for (let i=0; i<numWheels/2; i++) {
        const xPos = 3 - (i * 2.5);
        composition.push({ shape: 'cylinder', color: '#333333', position: [xPos, -2, 1.8], rotation: [Math.PI/2, 0, 0], scale: [0.5, 0.2, 0.5] });
        composition.push({ shape: 'cylinder', color: '#333333', position: [xPos, -2, -1.8], rotation: [Math.PI/2, 0, 0], scale: [0.5, 0.2, 0.5] });
      }
    } else if (theme === 'tree') {
      const treeType = Math.random() > 0.5 ? 'round' : 'pine';
      const numApples = getRandomElement([0, 3, 5]);
      
      composition.push({ shape: 'cylinder', color: '#854d0e', position: [0, -2, 0], rotation: [0, 0, 0], scale: [0.6, 2, 0.6] });
      
      if (treeType === 'round') {
        composition.push({ shape: 'sphere', color: '#22c55e', position: [0, 3, 0], rotation: [0, 0, 0], scale: [2, 2, 2] });
        
        for(let i=0; i<numApples; i++) {
          const angle = (i / numApples) * Math.PI * 2;
          composition.push({ shape: 'sphere', color: '#ef4444', position: [Math.cos(angle)*2.5, 3 + Math.sin(angle)*1.5, Math.sin(angle)*2.5], rotation: [0, 0, 0], scale: [0.3, 0.3, 0.3] });
        }
      } else {
        composition.push({ shape: 'cone', color: '#16a34a', position: [0, 2, 0], rotation: [0, 0, 0], scale: [2.5, 1.5, 2.5] });
        composition.push({ shape: 'cone', color: '#16a34a', position: [0, 4.5, 0], rotation: [0, 0, 0], scale: [2, 1.5, 2] });
        composition.push({ shape: 'cone', color: '#16a34a', position: [0, 7, 0], rotation: [0, 0, 0], scale: [1.5, 1.5, 1.5] });
      }
    } else if (theme === 'dog') {
      const wagging = Math.random() > 0.5;
      const legShape = Math.random() > 0.5 ? 'cylinder' : 'cuboid';
      
      composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [0, 0, 0], rotation: [0, 0, Math.PI/2], scale: [0.8, 1.5, 0.8] });
      composition.push({ shape: 'cube', color: getRandomElement(colorPalette), position: [2.5, 2, 0], rotation: [0, 0, 0], scale: [0.6, 0.6, 0.6] });
      composition.push({ shape: 'cuboid', color: getRandomElement(colorPalette), position: [3.5, 1.5, 0], rotation: [0, 0, Math.PI/2], scale: [0.3, 0.5, 0.4] }); // snout
      
      const legPos = [[-2, -2.5, 1], [2, -2.5, 1], [-2, -2.5, -1], [2, -2.5, -1]];
      legPos.forEach(pos => {
        composition.push({ shape: legShape, color: getRandomElement(colorPalette), position: pos, rotation: [0, 0, 0], scale: [0.3, 0.8, 0.3] });
      });
      
      const tailAngle = wagging ? Math.PI/4 : Math.PI/8;
      composition.push({ shape: 'cone', color: getRandomElement(colorPalette), position: [-2.5, 1, 0], rotation: [0, 0, -Math.PI/2 - tailAngle], scale: [0.3, 0.8, 0.3] });
      
      composition.push({ shape: 'cone', color: getRandomElement(colorPalette), position: [2.5, 3.5, 0.8], rotation: [0, 0, 0], scale: [0.2, 0.4, 0.2] });
      composition.push({ shape: 'cone', color: getRandomElement(colorPalette), position: [2.5, 3.5, -0.8], rotation: [0, 0, 0], scale: [0.2, 0.4, 0.2] });
    } else if (theme === 'bridge') {
      const numPillars = getRandomElement([2, 3, 4]);
      const hasArches = Math.random() > 0.5;
      
      composition.push({ shape: 'cuboid', color: '#94a3b8', position: [0, 0, 0], rotation: [0, 0, Math.PI/2], scale: [0.4, 4, 1.2] }); // road
      
      for(let i=0; i<numPillars; i++) {
        const xPos = -4.5 + (i * (9 / (numPillars - 1)));
        composition.push({ shape: 'cylinder', color: getRandomElement(colorPalette), position: [xPos, -3, 0], rotation: [0, 0, 0], scale: [0.5, 1.5, 0.8] });
        if (hasArches && i < numPillars - 1) {
          const midX = xPos + (4.5 / (numPillars - 1));
          composition.push({ shape: 'sphere', color: getRandomElement(colorPalette), position: [midX, -1, 0], rotation: [0, 0, 0], scale: [1, 0.3, 0.8] });
        }
      }
    } else { // boat
      const hasMast = Math.random() > 0.2;
      const sailShape = Math.random() > 0.5 ? 'cuboid' : 'cone';
      
      composition.push({ shape: 'cuboid', color: '#854d0e', position: [0, -1, 0], rotation: [0, 0, Math.PI/2], scale: [0.8, 3, 1.2] });
      composition.push({ shape: 'cone', color: '#854d0e', position: [4.5, -1, 0], rotation: [0, 0, -Math.PI/2], scale: [1.2, 0.8, 1.2] }); // bow
      
      composition.push({ shape: 'cube', color: '#ffffff', position: [-2, 1, 0], rotation: [0, 0, 0], scale: [0.8, 0.6, 0.8] });
      
      if (hasMast) {
        composition.push({ shape: 'cylinder', color: '#94a3b8', position: [1.5, 3, 0], rotation: [0, 0, 0], scale: [0.1, 2, 0.1] });
        composition.push({ shape: sailShape, color: getRandomElement(colorPalette), position: [1.5, 3, 0], rotation: [0, 0, 0], scale: sailShape === 'cone' ? [1.5, 1.5, 0.2] : [0.8, 1.2, 0.1] });
      }
    }`;

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
