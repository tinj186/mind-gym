const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const standardLogic = (activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions) => {
  let structureText = '';
  let shortText = '';
  let actualAnswer = '';
  let mcqOptions = [];
  let hintStr = '';
  let stepsStr = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = '';
  let structureSteps = [];

  const SHAPES = ['circle', 'square', 'triangle', 'rectangle'];
  const ASYMMETRIC_SHAPES = ['triangle', 'half circle', 'quarter circle'];
  const COLORS = [
    { name: 'Red', hex: '#ef4444' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Green', hex: '#22c55e' },
    { name: 'Yellow', hex: '#eab308' }
  ];
  const SIZES = ['small', 'large'];
  
  const generatePattern = (core, repeats = 2) => {
    let pattern = [];
    for (let i = 0; i < repeats; i++) {
      pattern = pattern.concat(core);
    }
    pattern.push(core[0]);
    return pattern;
  };

  const getDirection = (rot) => {
    if (rot === 0) return 'up';
    if (rot === 90) return 'right';
    if (rot === 180) return 'down';
    if (rot === 270) return 'left';
    return 'up';
  };

  if (activeVariant === 'standard_dual_attribute_shape_colour') {
    const size = 'large';
    
    const templates = [
      [0, 1, 2], [0, 2, 1], [0, 0, 1], [0, 1, 1],
      [0, 0, 1, 1], [0, 1, 2, 2], [0, 0, 1, 2], [0, 1, 1, 2], [0, 1, 2, 3],
      [0, 1, 2, 3, 3], [0, 1, 2, 2, 3], [0, 1, 1, 2, 2], [0, 1, 2, 1, 2], [0, 0, 1, 1, 2], [0, 1, 2, 2, 1],
      [0, 1, 2, 3, 2, 1], [0, 0, 1, 1, 2, 2], [0, 1, 2, 2, 1, 0], [0, 1, 1, 2, 2, 3]
    ];
    
    // Shape and color can use different templates of the SAME length, or same template
    const validTemplates = templates.sort(() => 0.5 - Math.random());
    const shapeTemplate = validTemplates[0];
    const colorTemplate = validTemplates.find(t => t.length === shapeTemplate.length) || shapeTemplate;
    const coreLength = shapeTemplate.length;
    
    const distinctShapes = [...SHAPES].sort(() => 0.5 - Math.random());
    const distinctColors = [...COLORS].sort(() => 0.5 - Math.random());
    
    const core = [];
    for (let i = 0; i < coreLength; i++) {
      const sIdx = shapeTemplate[i];
      const cIdx = colorTemplate[i];
      core.push({ 
        shapeType: distinctShapes[sIdx], 
        color: distinctColors[cIdx].hex, 
        size, 
        colorName: distinctColors[cIdx].name 
      });
    }
    
    const repeats = coreLength > 4 ? 2 : 3;
    const pattern = generatePattern(core, repeats);
    
    // Randomize the missing position (gapIndex) anywhere from index 2 to pattern.length - 1
    const gapIndex = getRandomInt(2, pattern.length - 1);
    const nextShape = pattern[gapIndex];
    
    structureText = `Look at the pattern of shapes below. What is the missing shape in the pattern?`;
    shortText = `What is the missing shape in the pattern?`;
    actualAnswer = `${nextShape.colorName} ${nextShape.shapeType}`;
    hintStr = `Notice how BOTH the shape and the colour change. Find the repeating group!`;
    
    const coreString = core.map(s => `${s.colorName} ${s.shapeType}`).join(', ');
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern: ${coreString}.`,
      `The pattern repeats this sequence over and over.`,
      `The shape right before the missing one is a ${pattern[gapIndex - 1].colorName} ${pattern[gapIndex - 1].shapeType}.`,
      `According to the core, the shape that comes after that is a ${actualAnswer}.`,
      `So the missing shape is a ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes? (size, shape, colour, orientation)`, expectedAnswer: `shape, colour` },
      { label: `Repeating pattern`, expectedAnswer: coreString },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { layout: "PATTERN", pattern: pattern, gapIndex: gapIndex }
    });

    if (isMCQ) {
      mcqOptions = [
        actualAnswer,
        `${distinctColors[0].name} ${distinctShapes[1] || distinctShapes[0]}`,
        `${distinctColors[1] ? distinctColors[1].name : distinctColors[0].name} ${distinctShapes[0]}`,
        `${distinctColors[2] ? distinctColors[2].name : distinctColors[0].name} ${distinctShapes[2] || distinctShapes[0]}`
      ];
    }
  } else if (activeVariant === 'standard_dual_attribute_size_shape') {
    const color = getRandomElement(COLORS);
    
    const templates = [
      [0, 1, 2], [0, 2, 1], [0, 0, 1], [0, 1, 1],
      [0, 0, 1, 1], [0, 1, 2, 2], [0, 0, 1, 2], [0, 1, 1, 2], [0, 1, 2, 3],
      [0, 1, 2, 3, 3], [0, 1, 2, 2, 3], [0, 1, 1, 2, 2], [0, 1, 2, 1, 2], [0, 0, 1, 1, 2], [0, 1, 2, 2, 1],
      [0, 1, 2, 3, 2, 1], [0, 0, 1, 1, 2, 2], [0, 1, 2, 2, 1, 0], [0, 1, 1, 2, 2, 3]
    ];
    
    const validTemplates = templates.sort(() => 0.5 - Math.random());
    const shapeTemplate = validTemplates[0];
    const sizeTemplate = validTemplates.find(t => t.length === shapeTemplate.length) || shapeTemplate;
    const coreLength = shapeTemplate.length;
    
    const distinctShapes = [...SHAPES].sort(() => 0.5 - Math.random());
    // Only 2 sizes available, so we can't map 0,1,2,3 directly without modulo
    const distinctSizes = [...SIZES].sort(() => 0.5 - Math.random());
    
    const core = [];
    for (let i = 0; i < coreLength; i++) {
      const sIdx = shapeTemplate[i];
      const szIdx = sizeTemplate[i];
      core.push({ 
        shapeType: distinctShapes[sIdx % distinctShapes.length], 
        color: color.hex, 
        size: distinctSizes[szIdx % distinctSizes.length], 
        colorName: color.name 
      });
    }
    
    const repeats = coreLength > 4 ? 2 : 3;
    const pattern = generatePattern(core, repeats);
    const gapIndex = getRandomInt(2, pattern.length - 1);
    const nextShape = pattern[gapIndex];
    
    structureText = `Look at the pattern of shapes below. What is the missing shape in the pattern?`;
    shortText = `What is the missing shape in the pattern?`;
    actualAnswer = `${nextShape.size} ${nextShape.shapeType}`;
    hintStr = `Notice how BOTH the size and the shape change. Find the repeating group!`;
    
    const coreString = core.map(s => `${s.size} ${s.shapeType}`).join(', ');
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern: ${coreString}.`,
      `The pattern repeats this sequence over and over.`,
      `The shape right before the missing one is a ${pattern[gapIndex - 1].size} ${pattern[gapIndex - 1].shapeType}.`,
      `According to the core, the shape that comes after that is a ${actualAnswer}.`,
      `So the missing shape is a ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes?`, expectedAnswer: `size, shape` },
      { label: `Repeating pattern`, expectedAnswer: coreString },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    const usedShapes = [...new Set(core.map(c => c.shapeType))];
    const optionsRow = [];
    usedShapes.forEach(shapeType => {
      optionsRow.push({ label: `small ${shapeType}`, shapeType, color: color.hex, size: 'small' });
      optionsRow.push({ label: `large ${shapeType}`, shapeType, color: color.hex, size: 'large' });
    });

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { layout: "PATTERN", pattern: pattern, gapIndex: gapIndex, optionsRow: optionsRow }
    });

    if (isMCQ) {
      mcqOptions = [
        actualAnswer,
        `${distinctSizes[0]} ${distinctShapes[1] || distinctShapes[0]}`,
        `${distinctSizes[1] || distinctSizes[0]} ${distinctShapes[0]}`,
        `${distinctSizes[1] || distinctSizes[0]} ${distinctShapes[2] || distinctShapes[0]}`
      ];
    }
  } else if (activeVariant === 'standard_dual_attribute_orientation_colour') {
    const shape = getRandomElement(ASYMMETRIC_SHAPES);
    
    const templates = [
      [0, 1, 2], [0, 2, 1], [0, 0, 1], [0, 1, 1],
      [0, 0, 1, 1], [0, 1, 2, 2], [0, 0, 1, 2], [0, 1, 1, 2], [0, 1, 2, 3],
      [0, 1, 2, 3, 3], [0, 1, 2, 2, 3], [0, 1, 1, 2, 2], [0, 1, 2, 1, 2], [0, 0, 1, 1, 2], [0, 1, 2, 2, 1],
      [0, 1, 2, 3, 2, 1], [0, 0, 1, 1, 2, 2], [0, 1, 2, 2, 1, 0], [0, 1, 1, 2, 2, 3]
    ];
    
    const validTemplates = templates.sort(() => 0.5 - Math.random());
    const colorTemplate = validTemplates[0];
    const rotTemplate = validTemplates.find(t => t.length === colorTemplate.length) || colorTemplate;
    const coreLength = colorTemplate.length;
    
    const distinctColors = [...COLORS].sort(() => 0.5 - Math.random());
    const distinctRots = [0, 90, 180, 270].sort(() => 0.5 - Math.random());
    
    const core = [];
    for (let i = 0; i < coreLength; i++) {
      const cIdx = colorTemplate[i];
      const rIdx = rotTemplate[i];
      core.push({ 
        shapeType: shape, 
        color: distinctColors[cIdx % distinctColors.length].hex, 
        size: 'large', 
        colorName: distinctColors[cIdx % distinctColors.length].name,
        rotation: distinctRots[rIdx % distinctRots.length]
      });
    }
    
    const repeats = coreLength > 4 ? 2 : 3;
    const pattern = generatePattern(core, repeats);
    const gapIndex = getRandomInt(2, pattern.length - 1);
    const nextShape = pattern[gapIndex];
    
    structureText = `Look at the pattern of shapes below. What is the missing shape in the pattern?`;
    shortText = `What is the missing shape in the pattern?`;
    actualAnswer = `${nextShape.colorName} ${getDirection(nextShape.rotation)}`;
    hintStr = `Notice how BOTH the orientation and the colour change. Find the repeating group!`;
    
    const coreString = core.map(s => `${s.colorName} ${getDirection(s.rotation)}`).join(', ');
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern: ${coreString}.`,
      `The pattern repeats this sequence over and over.`,
      `The shape right before the missing one is a ${pattern[gapIndex - 1].colorName} ${getDirection(pattern[gapIndex - 1].rotation)}.`,
      `According to the core, the shape that comes after that is ${actualAnswer}.`,
      `So the missing shape is ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes?`, expectedAnswer: `orientation, colour` },
      { label: `Repeating pattern`, expectedAnswer: coreString },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    const usedColors = [...new Set(core.map(c => c.color))];
    const usedColorNames = [...new Set(core.map(c => c.colorName))];
    const optionsRow = [];
    usedColors.forEach((hex, idx) => {
      optionsRow.push({ label: `${usedColorNames[idx]} up`, shapeType: shape, color: hex, size: 'large', rotation: 0 });
      optionsRow.push({ label: `${usedColorNames[idx]} right`, shapeType: shape, color: hex, size: 'large', rotation: 90 });
      optionsRow.push({ label: `${usedColorNames[idx]} down`, shapeType: shape, color: hex, size: 'large', rotation: 180 });
      optionsRow.push({ label: `${usedColorNames[idx]} left`, shapeType: shape, color: hex, size: 'large', rotation: 270 });
    });

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { layout: "PATTERN", pattern: pattern, gapIndex: gapIndex, optionsRow: optionsRow }
    });

    if (isMCQ) {
      mcqOptions = [
        actualAnswer,
        `${distinctColors[0].name} ${getDirection(distinctRots[1] || distinctRots[0])}`,
        `${distinctColors[1] ? distinctColors[1].name : distinctColors[0].name} ${getDirection(distinctRots[0])}`,
        `${distinctColors[2] ? distinctColors[2].name : distinctColors[0].name} ${getDirection(distinctRots[2] || distinctRots[0])}`
      ];
    }
  } else if (activeVariant === 'standard_dual_attribute_shape_orientation') {
    const color = getRandomElement(COLORS);
    const templates = [
      [0, 1, 2], [0, 2, 1], [0, 0, 1], [0, 1, 1],
      [0, 0, 1, 1], [0, 1, 2, 2], [0, 0, 1, 2], [0, 1, 1, 2], [0, 1, 2, 3],
      [0, 1, 2, 3, 3], [0, 1, 2, 2, 3], [0, 1, 1, 2, 2], [0, 1, 2, 1, 2], [0, 0, 1, 1, 2], [0, 1, 2, 2, 1],
      [0, 1, 2, 3, 2, 1], [0, 0, 1, 1, 2, 2], [0, 1, 2, 2, 1, 0], [0, 1, 1, 2, 2, 3]
    ];
    
    const validTemplates = templates.sort(() => 0.5 - Math.random());
    const shapeTemplate = validTemplates[0];
    const rotTemplate = validTemplates.find(t => t.length === shapeTemplate.length) || shapeTemplate;
    const coreLength = shapeTemplate.length;
    
    const distinctShapes = [...ASYMMETRIC_SHAPES].sort(() => 0.5 - Math.random());
    const distinctRots = [0, 90, 180, 270].sort(() => 0.5 - Math.random());
    
    const core = [];
    for (let i = 0; i < coreLength; i++) {
      const sIdx = shapeTemplate[i];
      const rIdx = rotTemplate[i];
      core.push({ 
        shapeType: distinctShapes[sIdx % distinctShapes.length], 
        color: color.hex, 
        size: 'large', 
        colorName: color.name,
        rotation: distinctRots[rIdx % distinctRots.length]
      });
    }
    
    const repeats = coreLength > 4 ? 2 : 3;
    const pattern = generatePattern(core, repeats);
    const gapIndex = getRandomInt(2, pattern.length - 1);
    const nextShape = pattern[gapIndex];
    
    structureText = `Look at the pattern of shapes below. What is the missing shape in the pattern?`;
    shortText = `What is the missing shape in the pattern?`;
    actualAnswer = `${nextShape.shapeType} ${getDirection(nextShape.rotation)}`;
    hintStr = `Notice how BOTH the shape and the orientation change. Find the repeating group!`;
    
    const coreString = core.map(s => `${s.shapeType} ${getDirection(s.rotation)}`).join(', ');
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern: ${coreString}.`,
      `The pattern repeats this sequence over and over.`,
      `The shape right before the missing one is a ${pattern[gapIndex - 1].shapeType} ${getDirection(pattern[gapIndex - 1].rotation)}.`,
      `According to the core, the shape that comes after that is a ${actualAnswer}.`,
      `So the missing shape is a ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes?`, expectedAnswer: `shape, orientation` },
      { label: `Repeating pattern`, expectedAnswer: coreString },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    const usedShapes = [...new Set(core.map(c => c.shapeType))];
    const optionsRow = [];
    usedShapes.forEach(shapeType => {
      optionsRow.push({ label: `${shapeType} up`, shapeType, color: color.hex, size: 'large', rotation: 0 });
      optionsRow.push({ label: `${shapeType} right`, shapeType, color: color.hex, size: 'large', rotation: 90 });
      optionsRow.push({ label: `${shapeType} down`, shapeType, color: color.hex, size: 'large', rotation: 180 });
      optionsRow.push({ label: `${shapeType} left`, shapeType, color: color.hex, size: 'large', rotation: 270 });
    });

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { layout: "PATTERN", pattern: pattern, gapIndex: gapIndex, optionsRow: optionsRow }
    });

    if (isMCQ) {
      mcqOptions = [
        actualAnswer,
        `${distinctShapes[0]} ${getDirection(distinctRots[1] || distinctRots[0])}`,
        `${distinctShapes[1] || distinctShapes[0]} ${getDirection(distinctRots[0])}`,
        `${distinctShapes[1] || distinctShapes[0]} ${getDirection(distinctRots[2] || distinctRots[0])}`
      ];
    }
  } else if (activeVariant === 'standard_dual_attribute_colour_size') {
    const shape = getRandomElement(SHAPES);
    const templates = [
      [0, 1, 2], [0, 2, 1], [0, 0, 1], [0, 1, 1],
      [0, 0, 1, 1], [0, 1, 2, 2], [0, 0, 1, 2], [0, 1, 1, 2], [0, 1, 2, 3],
      [0, 1, 2, 3, 3], [0, 1, 2, 2, 3], [0, 1, 1, 2, 2], [0, 1, 2, 1, 2], [0, 0, 1, 1, 2], [0, 1, 2, 2, 1],
      [0, 1, 2, 3, 2, 1], [0, 0, 1, 1, 2, 2], [0, 1, 2, 2, 1, 0], [0, 1, 1, 2, 2, 3]
    ];
    
    const validTemplates = templates.sort(() => 0.5 - Math.random());
    const colorTemplate = validTemplates[0];
    const sizeTemplate = validTemplates.find(t => t.length === colorTemplate.length) || colorTemplate;
    const coreLength = colorTemplate.length;
    
    const distinctColors = [...COLORS].sort(() => 0.5 - Math.random());
    const distinctSizes = [...SIZES].sort(() => 0.5 - Math.random());
    
    const core = [];
    for (let i = 0; i < coreLength; i++) {
      const cIdx = colorTemplate[i];
      const szIdx = sizeTemplate[i];
      core.push({ 
        shapeType: shape, 
        color: distinctColors[cIdx % distinctColors.length].hex, 
        size: distinctSizes[szIdx % distinctSizes.length], 
        colorName: distinctColors[cIdx % distinctColors.length].name 
      });
    }
    
    const repeats = coreLength > 4 ? 2 : 3;
    const pattern = generatePattern(core, repeats);
    const gapIndex = getRandomInt(2, pattern.length - 1);
    const nextShape = pattern[gapIndex];
    
    structureText = `Look at the pattern of shapes below. What is the missing shape in the pattern?`;
    shortText = `What is the missing shape in the pattern?`;
    actualAnswer = `${nextShape.size} ${nextShape.colorName} ${shape}`;
    hintStr = `Notice how BOTH the colour and the size change. Find the repeating group!`;
    
    const coreString = core.map(s => `${s.size} ${s.colorName} ${shape}`).join(', ');
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern: ${coreString}.`,
      `The pattern repeats this sequence over and over.`,
      `The shape right before the missing one is a ${pattern[gapIndex - 1].size} ${pattern[gapIndex - 1].colorName} ${shape}.`,
      `According to the core, the shape that comes after that is a ${actualAnswer}.`,
      `So the missing shape is a ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes?`, expectedAnswer: `colour, size` },
      { label: `Repeating pattern`, expectedAnswer: coreString },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    const usedColors = [...new Set(core.map(c => c.color))];
    const usedColorNames = [...new Set(core.map(c => c.colorName))];
    const optionsRow = [];
    usedColors.forEach((hex, idx) => {
      optionsRow.push({ label: `small ${usedColorNames[idx]}`, shapeType: shape, color: hex, size: 'small' });
      optionsRow.push({ label: `large ${usedColorNames[idx]}`, shapeType: shape, color: hex, size: 'large' });
    });

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { layout: "PATTERN", pattern: pattern, gapIndex: gapIndex, optionsRow: optionsRow }
    });

    if (isMCQ) {
      mcqOptions = [
        actualAnswer,
        `${distinctSizes[0]} ${distinctColors[1] ? distinctColors[1].name : distinctColors[0].name} ${shape}`,
        `${distinctSizes[1] || distinctSizes[0]} ${distinctColors[0].name} ${shape}`,
        `${distinctSizes[1] || distinctSizes[0]} ${distinctColors[2] ? distinctColors[2].name : distinctColors[0].name} ${shape}`
      ];
    }
  } else if (activeVariant === 'standard_dual_attribute_size_orientation') {
    const shape = getRandomElement(ASYMMETRIC_SHAPES);
    const color = getRandomElement(COLORS);
    
    const templates = [
      [0, 1, 2], [0, 2, 1], [0, 0, 1], [0, 1, 1],
      [0, 0, 1, 1], [0, 1, 2, 2], [0, 0, 1, 2], [0, 1, 1, 2], [0, 1, 2, 3],
      [0, 1, 2, 3, 3], [0, 1, 2, 2, 3], [0, 1, 1, 2, 2], [0, 1, 2, 1, 2], [0, 0, 1, 1, 2], [0, 1, 2, 2, 1],
      [0, 1, 2, 3, 2, 1], [0, 0, 1, 1, 2, 2], [0, 1, 2, 2, 1, 0], [0, 1, 1, 2, 2, 3]
    ];
    
    const validTemplates = templates.sort(() => 0.5 - Math.random());
    const sizeTemplate = validTemplates[0];
    const rotTemplate = validTemplates.find(t => t.length === sizeTemplate.length) || sizeTemplate;
    const coreLength = sizeTemplate.length;
    
    const distinctSizes = [...SIZES].sort(() => 0.5 - Math.random());
    const distinctRots = [0, 90, 180, 270].sort(() => 0.5 - Math.random());
    
    const core = [];
    for (let i = 0; i < coreLength; i++) {
      const szIdx = sizeTemplate[i];
      const rIdx = rotTemplate[i];
      core.push({ 
        shapeType: shape, 
        color: color.hex, 
        size: distinctSizes[szIdx % distinctSizes.length], 
        colorName: color.name,
        rotation: distinctRots[rIdx % distinctRots.length]
      });
    }
    
    const repeats = coreLength > 4 ? 2 : 3;
    const pattern = generatePattern(core, repeats);
    const gapIndex = getRandomInt(2, pattern.length - 1);
    const nextShape = pattern[gapIndex];
    
    structureText = `Look at the pattern of shapes below. What is the missing shape in the pattern?`;
    shortText = `What is the missing shape in the pattern?`;
    actualAnswer = `${nextShape.size} ${getDirection(nextShape.rotation)}`;
    hintStr = `Notice how BOTH the size and the orientation change. Find the repeating group!`;
    
    const coreString = core.map(s => `${s.size} ${getDirection(s.rotation)}`).join(', ');
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern: ${coreString}.`,
      `The pattern repeats this sequence over and over.`,
      `The shape right before the missing one is a ${pattern[gapIndex - 1].size} ${getDirection(pattern[gapIndex - 1].rotation)}.`,
      `According to the core, the shape that comes after that is a ${actualAnswer}.`,
      `So the missing shape is a ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes?`, expectedAnswer: `size, orientation` },
      { label: `Repeating pattern`, expectedAnswer: coreString },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    const optionsRow = [
      { label: `small up`, shapeType: shape, color: color.hex, size: 'small', rotation: 0 },
      { label: `small right`, shapeType: shape, color: color.hex, size: 'small', rotation: 90 },
      { label: `large up`, shapeType: shape, color: color.hex, size: 'large', rotation: 0 },
      { label: `large right`, shapeType: shape, color: color.hex, size: 'large', rotation: 90 }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { layout: "PATTERN", pattern: pattern, gapIndex: gapIndex, optionsRow: optionsRow }
    });

    if (isMCQ) {
      mcqOptions = [
        actualAnswer,
        `${distinctSizes[0]} ${shape} ${getDirection(distinctRots[1] || distinctRots[0])}`,
        `${distinctSizes[1] || distinctSizes[0]} ${shape} ${getDirection(distinctRots[0])}`,
        `${distinctSizes[1] || distinctSizes[0]} ${shape} ${getDirection(distinctRots[2] || distinctRots[0])}`
      ];
    }

  } else if (activeVariant === 'standard_extend_multiple_elements') {
    // Extend by TWO consecutive shapes
    const size = 'large';
    const coreLength = getRandomInt(2, 4);
    const distinctShapes = [...SHAPES].sort(() => 0.5 - Math.random());
    const distinctColors = [...COLORS].sort(() => 0.5 - Math.random());
    
    const core = [];
    for (let i = 0; i < coreLength; i++) {
      core.push({ shapeType: distinctShapes[i % distinctShapes.length], color: distinctColors[i % distinctColors.length].hex, size, colorName: distinctColors[i % distinctColors.length].name });
    }
    
    const pattern = generatePattern(core, 2);
    const nextShape1 = core[1];
    const nextShape2 = core[(1 + 1) % coreLength];
    
    structureText = `Look at the pattern of shapes below. What are the NEXT TWO shapes in the pattern?`;
    shortText = `What are the next two shapes in the pattern?`;
    actualAnswer = `${nextShape1.colorName} ${nextShape1.shapeType}, ${nextShape2.colorName} ${nextShape2.shapeType}`;
    hintStr = `Find the repeating group and figure out the next TWO shapes!`;
    
    const coreString = core.map(s => `${s.colorName} ${s.shapeType}`).join(', ');
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern: ${coreString}.`,
      `The last shape shown is a ${core[0].colorName} ${core[0].shapeType}.`,
      `According to the core, the shape that comes next is a ${nextShape1.colorName} ${nextShape1.shapeType}.`,
      `The shape after that is a ${nextShape2.colorName} ${nextShape2.shapeType}.`,
      `So the next two shapes are: ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes?`, expectedAnswer: `shape, colour` },
      { label: `Repeating pattern`, expectedAnswer: coreString },
      { label: `Final Answer (Next 2 shapes)`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { 
        layout: "PATTERN", 
        pattern: pattern, 
        // We will render two empty gaps by using a custom layout trick, or just not pass gapIndex and let the user deduce.
        // Wait, ShapeDisplay handles one gapIndex. For multiple, we can append 2 'empty' shapes or just omit them.
        // If we omit gapIndex, they just see the pattern and extend it.
        gapIndex: -1 // Disable the single `?` gap since we want 2.
      }
    });

    if (isMCQ) {
      mcqOptions = [
        actualAnswer,
        `${nextShape2.colorName} ${nextShape2.shapeType}, ${nextShape1.colorName} ${nextShape1.shapeType}`,
        `${core[0].colorName} ${core[0].shapeType}, ${nextShape1.colorName} ${nextShape1.shapeType}`,
        `${nextShape1.colorName} ${nextShape1.shapeType}, ${core[0].colorName} ${core[0].shapeType}`
      ];
    }
  }

  // Remove duplicates and shuffle options for MCQ
  if (isMCQ && mcqOptions.length > 0) {
    mcqOptions = [...new Set(mcqOptions)];
    mcqOptions.sort(() => Math.random() - 0.5);
  }

  if (isStructure) {
    if (structureSteps && structureSteps.length > 0) {
      const stepsJson = structureSteps.map(step => 
        `{"label": "${step.label}", "expectedAnswer": "${step.expectedAnswer}", "acceptedAnswers": []}`
      ).join(",\\n        ");
      
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        ${stepsJson}
      ]}`;
    } else {
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        {"label": "Final Answer:", "expectedAnswer": "${actualAnswer}", "acceptedAnswers": []}
      ]}`;
    }
  } else {
    inputRequirementStr = `{"inputType": "TEXT_INPUT"}`;
  }

  let systemPrompt = `
Generate a math question using the following exact parameters:
Question Text: ${getQText(structureText, shortText)}
Correct Answer: ${actualAnswer}
${isMCQ ? `MCQ Options: ${JSON.stringify(mcqOptions)}` : ''}
Solution Steps: ${stepsStr}
Hint: ${hintStr}

CRITICAL INSTRUCTIONS:
- You must use the EXACT question text provided above.
- You must use the EXACT correct answer provided above.
- Ensure the solution steps are broken down clearly.
- Output ONLY valid JSON using the provided schema template.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `.trim();

  return { aiPrompt: systemPrompt };
};
