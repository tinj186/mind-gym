const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions, context, selectedContextItem, getQText) {
  let structureText = '';
  let shortText = '';
  let actualAnswer = '';
  let hintStr = '';
  let stepsStr = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let mcqOptions = [];
  let structureSteps = [];
  let acceptedAnswersArray = [];

  const SHAPES_3D = ['cube', 'cuboid', 'cone', 'cylinder', 'sphere'];
  const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#f97316'];
  const ORIENTATION_MAP = {
    'cone': [
      { rot: [0, 0, 0], name: 'Up', axis: 'Y' },
      { rot: [0, 0, Math.PI], name: 'Down', axis: 'Y-' },
      { rot: [0, 0, -Math.PI / 2], name: 'Right', axis: 'X' },
      { rot: [0, 0, Math.PI / 2], name: 'Left', axis: 'X-' },
      { rot: [Math.PI / 2, 0, 0], name: 'Front', axis: 'Z' },
      { rot: [-Math.PI / 2, 0, 0], name: 'Back', axis: 'Z-' }
    ],
    'cylinder': [
      { rot: [0, 0, 0], name: 'standing Up', axis: 'Y' },
      { rot: [0, 0, Math.PI / 2], name: 'lying Left-Right', axis: 'X' },
      { rot: [Math.PI / 2, 0, 0], name: 'lying Front-Back', axis: 'Z' }
    ],
    'cuboid': [
      { rot: [0, 0, Math.PI / 2], name: 'standing Tall', axis: 'Y' },
      { rot: [0, 0, 0], name: 'lying Flat', axis: 'X' },
      { rot: [0, Math.PI / 2, 0], name: 'lying Sideways', axis: 'Z' }
    ],
    'cube': [
      { rot: [0, 0, 0], name: 'sitting Straight', axis: 'Y' },
      { rot: [0, 0, Math.PI / 4], name: 'tilted Sideways', axis: 'XY' },
      { rot: [Math.PI / 4, 0, 0], name: 'tilted Forward', axis: 'YZ' }
    ],
    'sphere': [
      { rot: [0, 0, 0], name: '', axis: 'Y' }
    ]
  };
  const COLOR_NAMES = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange'];

  // Helper to get color name
  const getColorName = (hex) => COLOR_NAMES[COLORS.indexOf(hex)];

  // Helper to format shape name
  const formatShapeName = (shape) => shape.charAt(0).toUpperCase() + shape.slice(1);

  if (activeVariant === 'standard_dual_attribute_pattern') {
    const patternLength = getRandomInt(7, 10);
    const templates = [
      [0, 1, 2], [0, 0, 1], [0, 1, 1], 
      [0, 1, 2, 3], [0, 0, 1, 1], [0, 1, 1, 2], [0, 1, 2, 2], 
      [0, 1, 2, 3, 4], [0, 0, 1, 1, 2], [0, 1, 1, 2, 2], [0, 1, 2, 2, 3] 
    ];
    const template = getRandomElement(templates);
    const coreSize = template.length;
    
    // Pick 2 attributes to change
    const attributes = ['shape', 'color', 'size', 'orientation'];
    const changingAttrs = attributes.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    const isShapeChanging = changingAttrs.includes('shape');
    const isColorChanging = changingAttrs.includes('color');
    const isSizeChanging = changingAttrs.includes('size');
    const isOrientationChanging = changingAttrs.includes('orientation');
    
    // Determine static properties if they don't change
    let staticShape = 'cube';
    if (!isShapeChanging) {
      staticShape = getRandomElement(isOrientationChanging ? ['cuboid', 'cone', 'cylinder'] : SHAPES_3D);
    }
    const staticColor = isColorChanging ? null : getRandomElement(COLORS);
    const staticSizeIdx = isSizeChanging ? null : getRandomInt(0, 1); // 0=Big, 1=Small
    const staticOIdx = isOrientationChanging ? null : 0; // Default rot [0,0,0]
    
    // Pools for changing attributes
    const shapesPool = isOrientationChanging 
      ? ['cuboid', 'cone', 'cylinder'].sort(() => 0.5 - Math.random()) 
      : [...SHAPES_3D].sort(() => 0.5 - Math.random());
      
    const colorsPool = [...COLORS].sort(() => 0.5 - Math.random());
    const sizesPool = [0, 1].sort(() => 0.5 - Math.random());
    const commonAxes = ['Y', 'X', 'Z'].sort(() => 0.5 - Math.random());
    
    const uniqueIds = [...new Set(template)];
    const comboMap = {};
    
    uniqueIds.forEach((id, idx) => {
      comboMap[id] = {
        shape: isShapeChanging ? shapesPool[idx % shapesPool.length] : staticShape,
        color: isColorChanging ? colorsPool[idx % colorsPool.length] : staticColor,
        sizeIdx: isSizeChanging ? sizesPool[idx % sizesPool.length] : staticSizeIdx,
        axis: isOrientationChanging ? commonAxes[idx % commonAxes.length] : null
      };
    });
    
    const coreUnit = template.map(id => comboMap[id]);
    
    const pattern = [];
    for (let i = 0; i < patternLength; i++) {
      pattern.push(coreUnit[i % coreSize]);
    }
    
    const validMissingIndices = [];
    for (let i = 0; i < patternLength; i++) {
      const coreIdx = i % coreSize;
      let count = 0;
      for (let j = 0; j < patternLength; j++) {
        if (j % coreSize === coreIdx) count++;
      }
      if (count > 1) validMissingIndices.push(i);
    }
    const missingIdx = getRandomElement(validMissingIndices);
    const missingItem = pattern[missingIdx];
    
    // Determine compass if orientation is changing
    let compassShape = null;
    let getOrientationName = (item) => '';
    if (isOrientationChanging) {
      // Find the first visible shape to be the compass shape
      compassShape = pattern.find((_, idx) => idx !== missingIdx).shape;
      getOrientationName = (item) => ORIENTATION_MAP[compassShape].find(o => o.axis === item.axis).name;
    }
    
    const sizes = [160, 55];
    const sizeNames = ['Big', 'Small'];
    
    const formatItemName = (item) => {
      let parts = [];
      if (isSizeChanging) parts.push(sizeNames[item.sizeIdx]);
      if (isColorChanging) parts.push(getColorName(item.color));
      // Noun is always included
      parts.push(formatShapeName(item.shape));
      if (isOrientationChanging) parts.push(getOrientationName(item));
      return parts.join(' ');
    };
    
    actualAnswer = formatItemName(missingItem);
    
    if (isSizeChanging) {
      acceptedAnswersArray.push(actualAnswer.replace('Big', 'Large'));
    }
    
    const attrNames = changingAttrs.map(a => a.charAt(0).toUpperCase() + a.slice(1).replace('Color', 'Colour')).join(' and ');

    shortText = "Look at the pattern. What is the missing shape?";
    structureText = "Identify the missing shape in the pattern.";
    
    hintStr = `Look at the ${attrNames} of the shapes. Find the repeating block of ${coreSize} shapes.`;
    
    const step1 = `Observe the pattern to find the repeating block.`;
    const step2 = `The core repeating sequence is made of ${coreSize} shapes:`;
    const step3 = coreUnit.map((item, idx) => `${idx + 1}. ${formatItemName(item)}`).join(', ');
    const step4 = `The missing shape is at position ${missingIdx + 1} in the sequence.`;
    const step5 = `Following the repeating rule, the missing shape must be a ${actualAnswer}.`;
    
    stepsStr = JSON.stringify([step1, step2, step3, step4, step5]);

    structureSteps = [
      { label: "Changing attributes", expectedAnswer: attrNames },
      { label: "Core pattern length", expectedAnswer: String(coreSize) },
      { label: "Missing shape", expectedAnswer: actualAnswer }
    ];

    const components = pattern.map((item, idx) => {
      if (idx === missingIdx) {
        return {
          componentToRender: "HTML_CONTENT",
          componentData: { html: "<div class='text-6xl font-black text-slate-300 px-4'>?</div>" }
        };
      }
      
      let rotation = [0, 0, 0];
      if (isOrientationChanging) {
        rotation = ORIENTATION_MAP[item.shape].find(o => o.axis === item.axis).rot;
      } else if (item.shape === 'cube') {
         rotation = ORIENTATION_MAP['cube'][0].rot;
      } else {
         rotation = ORIENTATION_MAP[item.shape][0].rot;
      }
      
      return {
        componentToRender: "SHAPE_3D",
        componentData: { 
          shape: item.shape, 
          color: item.color, 
          size: isSizeChanging ? sizes[item.sizeIdx] : 100, 
          rotation: rotation 
        }
      };
    });

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_3D_PATTERN",
      componentData: { sequence: components, showCompass: isOrientationChanging }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      const distractors = new Set();
      while (distractors.size < 3) {
        let distItem = { ...missingItem };
        if (isShapeChanging) distItem.shape = getRandomElement(shapesPool);
        if (isColorChanging) distItem.color = getRandomElement(colorsPool);
        if (isSizeChanging) distItem.sizeIdx = getRandomElement(sizesPool);
        if (isOrientationChanging) distItem.axis = getRandomElement(commonAxes);
        
        const dist = formatItemName(distItem);
        if (dist !== actualAnswer) distractors.add(dist);
      }
      mcqOptions.push(...Array.from(distractors));
    }
  } else if (activeVariant === 'standard_missing_middle_element') {
    // Missing middle element (using single attribute: Shape)
    const patternLength = getRandomInt(7, 10);
    
    const templates = [
      [0, 1, 2], [0, 0, 1], [0, 1, 1], 
      [0, 1, 2, 3], [0, 0, 1, 1], [0, 1, 1, 2], [0, 1, 2, 2], 
      [0, 1, 2, 3, 4], [0, 0, 1, 1, 2], [0, 1, 1, 2, 2], [0, 1, 2, 2, 3] 
    ];
    const template = getRandomElement(templates);
    const coreSize = template.length;
    
    const uniqueIds = [...new Set(template)];
    const shapesPool = [...SHAPES_3D].sort(() => 0.5 - Math.random());
    const color = getRandomElement(COLORS);
    
    const comboMap = {};
    uniqueIds.forEach((id, idx) => {
      comboMap[id] = {
        shape: shapesPool[idx % shapesPool.length]
      };
    });
    
    const coreUnit = template.map(id => comboMap[id]);
    
    const pattern = [];
    for (let i = 0; i < patternLength; i++) {
      pattern.push(coreUnit[i % coreSize]);
    }
    
    // Guarantee missing element is in the middle and is logically solvable
    const validMissingIndices = [];
    for (let i = 1; i < patternLength - 1; i++) {
      const coreIdx = i % coreSize;
      let count = 0;
      for (let j = 0; j < patternLength; j++) {
        if (j % coreSize === coreIdx) count++;
      }
      if (count > 1) validMissingIndices.push(i);
    }
    const missingIdx = getRandomElement(validMissingIndices);
    const missingItem = pattern[missingIdx];
    
    actualAnswer = formatShapeName(missingItem.shape);

    shortText = "Fill in the missing shape in the pattern.";
    structureText = "Identify the missing shape in the middle of the pattern.";
    
    hintStr = `Look at the shapes before and after the missing space. Find the repeating block of ${coreSize} shapes.`;
    
    const step1 = `Observe the pattern to find the repeating block.`;
    const step2 = `The core repeating sequence is made of ${coreSize} shapes:`;
    const step3 = coreUnit.map((item, idx) => `${idx + 1}. ${formatShapeName(item.shape)}`).join(', ');
    const step4 = `The missing shape is at position ${missingIdx + 1} in the sequence.`;
    const step5 = `Following the repeating rule, the missing shape must be a ${actualAnswer}.`;
    
    stepsStr = JSON.stringify([step1, step2, step3, step4, step5]);

    structureSteps = [
      { label: "Changing attributes", expectedAnswer: "Shape" },
      { label: "Core pattern length", expectedAnswer: String(coreSize) },
      { label: "Missing shape", expectedAnswer: actualAnswer }
    ];

    const components = pattern.map((item, idx) => {
      if (idx === missingIdx) {
        return {
          componentToRender: "HTML_CONTENT",
          componentData: { html: "<div class='text-6xl font-black text-slate-300 px-4'>?</div>" }
        };
      }
      return {
        componentToRender: "SHAPE_3D",
        componentData: { shape: item.shape, color: color, size: 100 }
      };
    });

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_3D_PATTERN",
      componentData: { sequence: components }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      const distractors = SHAPES_3D.filter(s => formatShapeName(s) !== actualAnswer).map(s => formatShapeName(s)).sort(() => 0.5 - Math.random());
      while (mcqOptions.length < 4) mcqOptions.push(distractors.pop());
    }
  } else if (activeVariant === 'standard_extend_multiple_elements') {
    // Extend multiple elements
    const patternLength = getRandomInt(7, 9); // Total length shown before missing ones
    const missingCount = getRandomInt(2, 3);
    
    const templates = [
      [0, 1, 2], [0, 0, 1], [0, 1, 1], 
      [0, 1, 2, 3], [0, 0, 1, 1], [0, 1, 1, 2], [0, 1, 2, 2], 
      [0, 1, 2, 3, 4], [0, 0, 1, 1, 2], [0, 1, 1, 2, 2], [0, 1, 2, 2, 3] 
    ];
    const template = getRandomElement(templates);
    const coreSize = template.length;
    
    const uniqueIds = [...new Set(template)];
    const shapesPool = [...SHAPES_3D].sort(() => 0.5 - Math.random());
    const colorsPool = [...COLORS].sort(() => 0.5 - Math.random());
    
    const comboMap = {};
    uniqueIds.forEach((id, idx) => {
      comboMap[id] = {
        shape: shapesPool[idx % shapesPool.length],
        color: colorsPool[idx % colorsPool.length]
      };
    });
    
    const coreUnit = template.map(id => comboMap[id]);
    
    const pattern = [];
    for (let i = 0; i < patternLength + missingCount; i++) {
      pattern.push(coreUnit[i % coreSize]);
    }
    
    const missingItems = pattern.slice(patternLength);
    const visiblePattern = pattern.slice(0, patternLength);
    
    actualAnswer = missingItems.map(item => `${getColorName(item.color)} ${formatShapeName(item.shape)}`).join(' and ');

    shortText = `What are the next ${missingCount === 2 ? 'TWO' : 'THREE'} shapes in the pattern?`;
    structureText = `Identify the next ${missingCount === 2 ? 'two' : 'three'} shapes in the pattern.`;
    
    hintStr = "Identify the repeating sequence block, then continue it to find the missing shapes.";
    
    const step1 = `Observe the pattern to find the repeating block.`;
    const step2 = `The core repeating sequence is made of ${coreSize} shapes:`;
    const step3 = coreUnit.map((item, idx) => `${idx + 1}. ${getColorName(item.color)} ${formatShapeName(item.shape)}`).join(', ');
    const step4 = `We need to find the next ${missingCount} shapes after the sequence of ${patternLength}.`;
    const step5 = `Continuing the pattern, the next shapes are a ${actualAnswer}.`;
    
    stepsStr = JSON.stringify([step1, step2, step3, step4, step5]);

    structureSteps = [
      { label: "Changing attributes", expectedAnswer: "Shape and Colour" },
      { label: "Core pattern length", expectedAnswer: String(coreSize) },
      { label: `Next ${missingCount} shapes`, expectedAnswer: actualAnswer }
    ];

    const components = visiblePattern.map(item => ({
      componentToRender: "SHAPE_3D",
      componentData: { shape: item.shape, color: item.color, size: 90 }
    }));
    
    for (let i = 0; i < missingCount; i++) {
      components.push({
        componentToRender: "HTML_CONTENT",
        componentData: { html: "<div class='text-4xl font-black text-slate-300 px-2'>?</div>" }
      });
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_3D_PATTERN",
      componentData: { sequence: components }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      const distractors = new Set();
      while (distractors.size < 3) {
        const randItems = [];
        for (let i = 0; i < missingCount; i++) {
          const randShape = getRandomElement(SHAPES_3D);
          const randColor = getRandomElement(COLORS);
          randItems.push(`${getColorName(randColor)} ${formatShapeName(randShape)}`);
        }
        const dist = randItems.join(' and ');
        if (dist !== actualAnswer) distractors.add(dist);
      }
      mcqOptions.push(...Array.from(distractors));
    }
  } else if (activeVariant === 'standard_composite_shape_counting') {
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
    }
        const uniqueShapes = [...new Set(composition.map(s => s.shape))];
    targetShape = getRandomElement(uniqueShapes);
    targetCount = composition.filter(s => s.shape === targetShape).length;
    
    actualAnswer = String(targetCount);
    
    shortText = `Look at the ${theme}. How many ${targetShape}s are used to build it?`;
    structureText = `Analyze the composite 3D ${theme} and count the exact number of ${targetShape}s used.`;
    
    hintStr = `Count every ${targetShape} you see on the ${theme}. Don't forget to look around the sides!`;
    
    const step1 = `Identify the ${targetShape} shape.`;
    const step2 = `Carefully count each ${targetShape} used in the ${theme} structure.`;
    const step3 = `There are ${targetCount} ${targetShape}s in total.`;
    
    stepsStr = JSON.stringify([step1, step2, step3]);

    structureSteps = [
      { label: "Target Shape", expectedAnswer: formatShapeName(targetShape) },
      { label: `Total ${formatShapeName(targetShape)}s`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "COMPOSITE_SHAPE_3D",
      componentData: { composition, isometric: true, autoRotate: false }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      while (mcqOptions.length < 4) {
        const wrong = String(Math.max(1, targetCount + getRandomInt(-2, 3)));
        if (!mcqOptions.includes(wrong)) mcqOptions.push(wrong);
      }
    }
  } else if (activeVariant === 'standard_fractional_shape_composition') {
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
      { x: 2, y: 2, z: 2, name: `2 by 2 by 2 larger ${shapeType === 'cube' ? 'cube' : 'structure'}` },
      { x: 3, y: 2, z: 2, name: `3 by 2 by 2 larger structure` },
      { x: 2, y: 3, z: 2, name: `2 by 3 by 2 larger structure` }
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
    
    shortText = `How many ${shapeNameStr} are needed to completely build this ${dimensions.name}?`;
    structureText = `Calculate the total number of ${shapeNameStr} used to build the ${dimensions.name}.`;
    
    hintStr = `Count the ${shapeNameStr} in one layer, then multiply by the number of layers!`;
    
    const cubesPerLayer = dimensions.x * dimensions.z;
    const layers = dimensions.y;
    
    const step1 = `Count the number of ${shapeNameStr} in the bottom layer.`;
    const step2 = `The bottom layer has ${dimensions.x} × ${dimensions.z} = ${cubesPerLayer} ${shapeNameStr}.`;
    const step3 = `There are ${layers} layers in total.`;
    const step4 = `${cubesPerLayer} ${shapeNameStr} × ${layers} layers = ${totalCubes} ${shapeNameStr}.`;
    
    stepsStr = JSON.stringify([step1, step2, step3, step4]);

    structureSteps = [
      { label: `${singleShapeStr.charAt(0).toUpperCase() + singleShapeStr.slice(1)}s in one layer`, expectedAnswer: String(cubesPerLayer) },
      { label: "Number of layers", expectedAnswer: String(layers) },
      { label: `Total ${shapeNameStr}`, expectedAnswer: actualAnswer }
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
  } else if (activeVariant === 'standard_identify_net_to_shape') {
    // Flashlight shadow logic
    const shapes = [
      { shape3D: 'Cylinder', direction: 'TOP', shadow: 'Circle' },
      { shape3D: 'Cylinder', direction: 'SIDE', shadow: 'Rectangle' },
      { shape3D: 'Cone', direction: 'TOP', shadow: 'Circle' },
      { shape3D: 'Cone', direction: 'SIDE', shadow: 'Triangle' },
      { shape3D: 'Cube', direction: 'TOP', shadow: 'Square' },
      { shape3D: 'Cube', direction: 'SIDE', shadow: 'Square' },
      { shape3D: 'Cuboid', direction: 'TOP', shadow: 'Rectangle' },
      { shape3D: 'Cuboid', direction: 'SIDE', shadow: 'Square' },
      { shape3D: 'Sphere', direction: 'TOP', shadow: 'Circle' }
    ];
    
    const selected = shapes[Math.floor(Math.random() * shapes.length)];
    actualAnswer = selected.shadow;
    
    shortText = `A flashlight is shining directly from the ${selected.direction} of this ${selected.shape3D.toLowerCase()}. What 2D shape is its shadow?`;
    structureText = `Identify the 2D shape of the shadow cast when a flashlight shines from the ${selected.direction} of this ${selected.shape3D.toLowerCase()}.`;
    
    hintStr = `Imagine looking at the ${selected.shape3D.toLowerCase()} from exactly the ${selected.direction.toLowerCase()}. What flat shape do you see?`;
    
    const step1 = `Identify the 3D shape.`;
    const step2 = `The flashlight shines from the ${selected.direction}.`;
    const step3 = `The shadow cast will be a ${selected.shadow}.`;
    
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
        size: 150, 
        rotation: [Math.PI/6, Math.PI/4, 0], // Isometric-like angle
        flashlightDirection: selected.direction
      }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      const distractors = ['Square', 'Rectangle', 'Circle', 'Triangle', 'Semicircle'].filter(s => s !== actualAnswer).sort(() => 0.5 - Math.random());
      while (mcqOptions.length < 4) mcqOptions.push(distractors.pop());
    }
  }

  // Shuffle MCQ options if applicable
  let defectMap = {};
  if (isMCQ) {
    const originalOptions = [...mcqOptions];
    mcqOptions = mcqOptions.sort(() => Math.random() - 0.5);
    originalOptions.slice(1).forEach((distractor, idx) => {
      defectMap[`distractor${idx + 1}`] = "Pattern recognition error";
    });
  }

  // Build inputRequirement string for MULTI_STEP_INPUT
  let inputRequirementStr = null;
  if (isStructure && structureSteps.length > 0) {
    inputRequirementStr = JSON.stringify({
      inputType: "MULTI_STEP_INPUT",
      steps: structureSteps
    });
  }

  const aiPrompt = getFormatInstructions(visualEngineStr, inputRequirementStr) + `
CRITICAL INSTRUCTIONS:
- questionText: Use exact string [${JSON.stringify(getQText(structureText, shortText))}].
- finalAnswer: Use exact string "${actualAnswer}".
- solutionSteps: Use exact array ${stepsStr}.
- hint: Use exact string "${hintStr}".
${isMCQ ? `- options: Use exact array ${JSON.stringify(mcqOptions)}.` : ''}
${isMCQ ? `- defectMap: Use exact object ${JSON.stringify(defectMap)}.` : ''}
- acceptedAnswers: Use exact array ${JSON.stringify(acceptedAnswersArray)}.
`;

  return { aiPrompt };
}
