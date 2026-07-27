const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const foundationLogic = (activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions) => {
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
  const COLORS = [
    { name: 'Red', hex: '#ef4444' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Green', hex: '#22c55e' },
    { name: 'Yellow', hex: '#eab308' }
  ];
  const SIZES = ['small', 'large'];
  const ROTATIONS = [0, 90, 180, 270];

  const generatePattern = (core, repeats = 2) => {
    let pattern = [];
    for (let i = 0; i < repeats; i++) {
      pattern = pattern.concat(core);
    }
    // Add one more element to make the next one predictable
    pattern.push(core[0]);
    return pattern;
  };

  if (activeVariant === 'foundation_single_attribute_shape') {
    // ONLY shape changes (e.g., Circle, Square, Triangle)
    const color = getRandomElement(COLORS);
    const size = 'large';
    
    // Pick 3 or 4 distinct shapes for the core
    const shuffledShapes = [...SHAPES].sort(() => 0.5 - Math.random());
    const coreLength = Math.random() > 0.5 ? 3 : 4;
    const coreShapes = shuffledShapes.slice(0, coreLength);
    
    const core = coreShapes.map(s => ({ shapeType: s, color: color.hex, size, colorName: color.name }));
    const pattern = generatePattern(core, 2);
    
    const nextShape = core[1];
    
    structureText = `Look at the pattern of shapes below. What comes next in the pattern?`;
    shortText = `What is the next shape in the pattern?`;
    actualAnswer = nextShape.shapeType; // Simplified to just the shape name since color/size don't change
    hintStr = `Notice how only the shape changes while the colour and size stay the same. Find the repeating group!`;
    
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern: ${core.map(s => s.shapeType).join(', ')}.`,
      `The pattern repeats this sequence over and over.`,
      `The last shape shown is a ${core[0].shapeType}.`,
      `According to the core, the shape that comes after ${core[0].shapeType} is a ${nextShape.shapeType}.`,
      `So the next shape is a ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes? (size, shape, colour, orientation)`, expectedAnswer: `shape` },
      { label: `Repeating pattern`, expectedAnswer: core.map(s => s.shapeType).join(', ') },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: {
        layout: "PATTERN",
        pattern: pattern,
        gapIndex: pattern.length
      }
    });

    if (isMCQ) {
      mcqOptions = core.map(s => s.shapeType);
      while(mcqOptions.length < 4) {
        const randomShape = getRandomElement(SHAPES);
        if (!mcqOptions.includes(randomShape)) mcqOptions.push(randomShape);
      }
    }
  } else if (activeVariant === 'foundation_single_attribute_size') {
    // ONLY size changes
    const shape = getRandomElement(SHAPES);
    const color = getRandomElement(COLORS);
    
    const sizes = ['small', 'large'];
    const coreSizes = [];
    if (Math.random() > 0.5) {
      coreSizes.push(sizes[0], sizes[1], sizes[1]); // e.g. small, large, large
    } else {
      coreSizes.push(sizes[0], sizes[0], sizes[1]); // e.g. small, small, large
    }
    
    if (Math.random() > 0.5) coreSizes.reverse();
    
    const core = coreSizes.map(s => ({ shapeType: shape, color: color.hex, size: s, colorName: color.name }));
    const pattern = generatePattern(core, 2);
    
    const nextShape = core[1];
    
    structureText = `Look at the pattern below. Which shape comes next?`;
    shortText = `What is the next shape in the pattern?`;
    actualAnswer = nextShape.size; // e.g. "small"
    hintStr = `The shape and colour are the same, but the size changes! Look for the small and large repeating pattern.`;
    
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern: ${core.map(s => s.size).join(', ')}.`,
      `The last shape shown is a ${core[0].size} ${shape}.`,
      `According to the pattern, a ${nextShape.size} shape comes after a ${core[0].size} shape.`,
      `So the next shape is ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes? (size, shape, colour, orientation)`, expectedAnswer: `size` },
      { label: `Repeating pattern`, expectedAnswer: core.map(s => s.size).join(', ') },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: {
        layout: "PATTERN",
        pattern: pattern,
        gapIndex: pattern.length
      }
    });

    if (isMCQ) {
      mcqOptions = ['small', 'large'];
    }
  } else if (activeVariant === 'foundation_single_attribute_colour') {
    // ONLY colour changes
    const shape = getRandomElement(SHAPES);
    const size = 'large';
    
    const shuffledColors = [...COLORS].sort(() => 0.5 - Math.random());
    const coreLength = Math.random() > 0.5 ? 3 : 4;
    const coreColors = shuffledColors.slice(0, coreLength);
    
    const core = coreColors.map(c => ({ shapeType: shape, color: c.hex, size, colorName: c.name }));
    const pattern = generatePattern(core, 2);
    
    const nextShape = core[1];
    
    structureText = `Look at the colour pattern below. What comes next?`;
    shortText = `What is the next shape in the pattern?`;
    actualAnswer = nextShape.colorName; // e.g. "Red"
    hintStr = `The shape and size remain the same, but the colours change in a repeating sequence!`;
    
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern: ${core.map(s => s.colorName).join(', ')}.`,
      `The pattern repeats this colour sequence.`,
      `The last shape shown is a ${core[0].colorName} ${shape}.`,
      `According to the pattern, the colour that comes after ${core[0].colorName} is ${nextShape.colorName}.`,
      `So the next shape is ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes? (size, shape, colour, orientation)`, expectedAnswer: `colour` },
      { label: `Repeating pattern`, expectedAnswer: core.map(s => s.colorName).join(', ') },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: {
        layout: "PATTERN",
        pattern: pattern,
        gapIndex: pattern.length
      }
    });

    if (isMCQ) {
      mcqOptions = coreColors.map(c => c.name);
      while(mcqOptions.length < 4) {
        const randomColor = getRandomElement(COLORS);
        if (!mcqOptions.includes(randomColor.name)) mcqOptions.push(randomColor.name);
      }
    }
  } else if (activeVariant === 'foundation_single_attribute_orientation') {
    // ONLY orientation changes
    // Asymmetric shapes that look different when rotated
    const asymmetricShapes = ['triangle', 'half circle', 'quarter circle'];
    const shape = getRandomElement(asymmetricShapes);
    const color = getRandomElement(COLORS);
    const size = 'large';
    
    const allRotations = [0, 90, 180, 270];
    const shuffledRots = [...allRotations].sort(() => 0.5 - Math.random());
    const distinctRots = shuffledRots.slice(0, 3); // A, B, C options
    
    // Build complex patterns (ensuring core length >= 3)
    const templates = [
      [0, 1, 2], // ABC
      [0, 2, 1], // ACB
      [0, 0, 1], // AAB
      [0, 1, 1], // ABB
      [0, 0, 1, 1], // AABB
      [0, 1, 2, 2], // ABCC
      [0, 0, 1, 2], // AABC
      [0, 1, 1, 2]  // ABBC
    ];
    const selectedTemplate = getRandomElement(templates);
    const coreRotations = selectedTemplate.map(idx => distinctRots[idx]);
    
    const core = coreRotations.map(r => ({ shapeType: shape, color: color.hex, size, rotation: r, colorName: color.name }));
    const pattern = generatePattern(core, 2);
    
    const nextShape = core[1]; // Wait, nextShape is the one after the last shown element. The last shown element is core[0]. So next is core[1].
    
    const getDirection = (rot) => rot === 0 ? 'up' : rot === 90 ? 'right' : rot === 180 ? 'down' : 'left';
    
    structureText = `Look at the pattern of shapes below. What comes next?`;
    shortText = `What is the next shape in the pattern?`;
    actualAnswer = getDirection(nextShape.rotation);
    hintStr = `Notice how the shape flips up, down, left, or right! Find the repeating sequence.`;
    
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern: ${core.map(s => getDirection(s.rotation)).join(', ')}.`,
      `The last shape shown is a ${color.name} ${shape} pointing ${getDirection(core[0].rotation)}.`,
      `According to the pattern, the orientation that comes after pointing ${getDirection(core[0].rotation)} is pointing ${getDirection(nextShape.rotation)}.`,
      `So the next shape is pointing ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes? (size, shape, colour, orientation)`, expectedAnswer: `orientation` },
      { label: `Repeating pattern`, expectedAnswer: core.map(s => getDirection(s.rotation)).join(', ') },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    const optionsRow = [
      { label: 'up', shapeType: shape, color: color.hex, size: 'large', rotation: 0 },
      { label: 'right', shapeType: shape, color: color.hex, size: 'large', rotation: 90 },
      { label: 'down', shapeType: shape, color: color.hex, size: 'large', rotation: 180 },
      { label: 'left', shapeType: shape, color: color.hex, size: 'large', rotation: 270 }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: {
        layout: "PATTERN",
        pattern: pattern,
        gapIndex: pattern.length,
        optionsRow: optionsRow
      }
    });

    if (isMCQ) {
      mcqOptions = ['up', 'down', 'left', 'right'];
    }
  } else if (activeVariant === 'foundation_identify_pattern_core') {
    // Identify the core (repeating unit)
    const coreLength = getRandomInt(2, 5); // 2 to 5 items
    
    // Pick 1 or 2 attributes to change
    const possibleAttrs = ['shape', 'colour', 'size'];
    const shuffledAttrs = [...possibleAttrs].sort(() => 0.5 - Math.random());
    const numChanging = Math.random() > 0.5 ? 2 : 1;
    const changingAttributes = shuffledAttrs.slice(0, numChanging); // e.g. ['shape', 'colour']
    
    const baseShape = getRandomElement(SHAPES);
    const baseColor = getRandomElement(COLORS);
    const baseSize = 'large';
    
    // Ensure we have enough distinct options for changing attributes
    const distinctShapes = [...SHAPES].sort(() => 0.5 - Math.random());
    const distinctColors = [...COLORS].sort(() => 0.5 - Math.random());
    const distinctSizes = ['small', 'large'];
    if (Math.random() > 0.5) distinctSizes.reverse();
    
    const core = [];
    for (let i = 0; i < coreLength; i++) {
      // Use modulo to cycle through distinct options, guaranteeing change
      const s = changingAttributes.includes('shape') ? distinctShapes[i % distinctShapes.length] : baseShape;
      const c = changingAttributes.includes('colour') ? distinctColors[i % distinctColors.length] : baseColor;
      const sz = changingAttributes.includes('size') ? distinctSizes[i % distinctSizes.length] : baseSize;
      core.push({ shapeType: s, color: c.hex, size: sz, colorName: c.name });
    }
    
    const pattern = generatePattern(core, 2);
    pattern.push(core[0]); // Add one more to break off cleanly
    if (coreLength > 2) pattern.push(core[1]); // Ensure sequence looks long enough
    
    structureText = `Every pattern has a "core" which is the smallest part that repeats over and over. What is the repeating core of this pattern?`;
    shortText = `What is the repeating core of this pattern?`;
    
    const getCoreString = (arr) => {
      return arr.map(s => {
        let parts = [];
        if (changingAttributes.includes('size')) parts.push(s.size);
        if (changingAttributes.includes('colour')) parts.push(s.colorName);
        if (changingAttributes.includes('shape') || parts.length === 0) parts.push(s.shapeType);
        return parts.join(' ');
      }).join(', ');
    };
    
    actualAnswer = getCoreString(core);
    const changingString = changingAttributes.sort().join(', ');
    hintStr = `Look for the group of shapes that repeats exactly in the same order!`;
    
    stepsStr = JSON.stringify([
      `Observe the sequence of shapes from the start.`,
      `Identify the attributes that change: ${changingString}.`,
      `Count the number of items before the pattern repeats: ${coreLength}.`,
      `Therefore, the repeating core is: ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes?`, expectedAnswer: changingString },
      { label: `Number of items in the core`, expectedAnswer: coreLength.toString() },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: {
        layout: "PATTERN",
        pattern: pattern,
        gapIndex: -1
      }
    });

    if (isMCQ) {
      mcqOptions = [
        actualAnswer,
        `${core[1].colorName} ${core[1].shapeType}, ${core[2].colorName} ${core[2].shapeType}, ${core[0].colorName} ${core[0].shapeType}`,
        `${core[2].colorName} ${core[2].shapeType}, ${core[0].colorName} ${core[0].shapeType}, ${core[1].colorName} ${core[1].shapeType}`,
        `${core[0].colorName} ${core[0].shapeType}, ${core[1].colorName} ${core[1].shapeType}, ${core[0].colorName} ${core[0].shapeType}`
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
