const SHAPES = ['circle', 'square', 'triangle', 'rectangle'];
const COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Yellow', hex: '#eab308' }
];
const SIZES = ['small', 'large'];
const ROTATIONS = [0, 90, 180, 270];
const ASYMMETRIC_SHAPES = ['triangle', 'half circle', 'quarter circle'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getDirection = (rot) => {
  if (rot === 0) return 'up';
  if (rot === 90) return 'right';
  if (rot === 180) return 'down';
  if (rot === 270) return 'left';
  return 'up';
};

// Helper to generate a repeating pattern array given a core
function generatePattern(core, repetitions = 3) {
  const pattern = [];
  for (let i = 0; i < repetitions; i++) {
    pattern.push(...core.map(item => JSON.parse(JSON.stringify(item))));
  }
  // Add an extra element or two to break symmetry slightly
  pattern.push(JSON.parse(JSON.stringify(core[0])));
  if (core.length > 2) pattern.push(JSON.parse(JSON.stringify(core[1])));
  return pattern;
}

export function advancedLogic(activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions) {
  let structureText = '';
  let shortText = '';
  let hintStr = '';
  let stepsStr = '';
  let actualAnswer = '';
  let mcqOptions = [];
  let visualEngineStr = '{}';
  let inputRequirementStr = null;
  let structureSteps = [];

  if (activeVariant === 'advanced_identify_changing_attributes') {
    // Generate a complex pattern and ask the student to identify which attributes change.
    // Pick 2 or 3 attributes to change randomly.
    const attributes = ['size', 'shape', 'colour', 'orientation'];
    const numChanges = getRandomInt(2, 3);
    
    // Pick the changing attributes
    const shuffledAttributes = [...attributes].sort(() => 0.5 - Math.random());
    const changingAttributes = shuffledAttributes.slice(0, numChanges).sort();
    
    const isShapeChanging = changingAttributes.includes('shape');
    const isColorChanging = changingAttributes.includes('colour');
    const isSizeChanging = changingAttributes.includes('size');
    const isOrientationChanging = changingAttributes.includes('orientation');
    
    // Set base values
    const baseShape = isOrientationChanging ? getRandomElement(ASYMMETRIC_SHAPES) : getRandomElement(SHAPES);
    const baseColor = getRandomElement(COLORS);
    const baseSize = 'large';
    const baseRot = 0;
    
    const coreLength = getRandomInt(3, 4);
    
    // Distinct elements to use for changes
    const distinctShapes = isOrientationChanging ? [...ASYMMETRIC_SHAPES].sort(() => 0.5 - Math.random()) : [...SHAPES].sort(() => 0.5 - Math.random());
    const distinctColors = [...COLORS].sort(() => 0.5 - Math.random());
    const distinctSizes = [...SIZES].sort(() => 0.5 - Math.random());
    const distinctRots = [0, 90, 180, 270].sort(() => 0.5 - Math.random());
    
    const core = [];
    for (let i = 0; i < coreLength; i++) {
      core.push({
        shapeType: isShapeChanging ? distinctShapes[i % distinctShapes.length] : baseShape,
        color: isColorChanging ? distinctColors[i % distinctColors.length].hex : baseColor.hex,
        size: isSizeChanging ? distinctSizes[i % distinctSizes.length] : baseSize,
        rotation: isOrientationChanging ? distinctRots[i % distinctRots.length] : baseRot
      });
    }
    
    const pattern = generatePattern(core, 3);
    
    structureText = `Look at the pattern below carefully. How many shapes make up the repeating core, and which attributes are changing?`;
    shortText = `What is the core size, and which attributes are changing?`;
    const changingStr = changingAttributes.join(' and ');
    actualAnswer = `Core size ${coreLength}; ${changingStr}`;
    hintStr = `First count how many shapes it takes before the pattern starts repeating again. Then look closely at each shape in that core: Does its size, colour, shape, or orientation change?`;
    
    stepsStr = JSON.stringify([
      `Observe the pattern from left to right.`,
      `The pattern repeats after every ${coreLength} shapes, so the core size is ${coreLength}.`,
      `Does the size of the shapes change? ${isSizeChanging ? 'Yes.' : 'No.'}`,
      `Does the shape itself change? ${isShapeChanging ? 'Yes.' : 'No.'}`,
      `Does the colour change? ${isColorChanging ? 'Yes.' : 'No.'}`,
      `Does the orientation change? ${isOrientationChanging ? 'Yes.' : 'No.'}`,
      `Therefore, the core size is ${coreLength} and the changing attributes are ${changingStr}.`
    ]);

    structureSteps = [
      { label: `Core size`, expectedAnswer: `${coreLength}` },
      { label: `Attributes changing`, expectedAnswer: changingStr },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { layout: "PATTERN", pattern: pattern, hideGap: true }
    });

    if (isMCQ) {
      mcqOptions = [
        actualAnswer,
        `Core size ${coreLength === 3 ? 4 : 3}; ${changingStr}`,
        `Core size ${coreLength}; ${shuffledAttributes.slice(1, 3).sort().join(' and ')}`,
        `Core size ${coreLength === 3 ? 4 : 3}; ${shuffledAttributes.slice(1, 3).sort().join(' and ')}`
      ];
      // Ensure unique and enough options
      mcqOptions = [...new Set(mcqOptions)];
      while(mcqOptions.length < 4) {
        const randCore = getRandomInt(3, 4);
        const randAttrs = [...attributes].sort(() => 0.5 - Math.random()).slice(0, getRandomInt(2,3)).sort().join(' and ');
        mcqOptions.push(`Core size ${randCore}; ${randAttrs}`);
        mcqOptions = [...new Set(mcqOptions)];
      }
    }
  } else if (activeVariant === 'advanced_spot_the_error') {
    const attributes = ['size', 'shape', 'colour', 'orientation'];
    const numChanges = getRandomInt(1, 2);
    
    // Pick the changing attributes for the core
    const shuffledAttributes = [...attributes].sort(() => 0.5 - Math.random());
    const changingAttributes = shuffledAttributes.slice(0, numChanges).sort();
    
    const isShapeChanging = changingAttributes.includes('shape');
    const isColorChanging = changingAttributes.includes('colour');
    const isSizeChanging = changingAttributes.includes('size');
    const isOrientationChanging = changingAttributes.includes('orientation');
    
    const baseShape = isOrientationChanging ? getRandomElement(ASYMMETRIC_SHAPES) : getRandomElement(SHAPES);
    const baseColor = getRandomElement(COLORS);
    const baseSize = 'large';
    const baseRot = 0;
    
    const coreLength = 3;
    
    // Distinct elements to use for changes
    const distinctShapes = isOrientationChanging ? [...ASYMMETRIC_SHAPES].sort(() => 0.5 - Math.random()) : [...SHAPES].sort(() => 0.5 - Math.random());
    const distinctColors = [...COLORS].sort(() => 0.5 - Math.random());
    const distinctSizes = [...SIZES].sort(() => 0.5 - Math.random());
    const distinctRots = [0, 90, 180, 270].sort(() => 0.5 - Math.random());
    
    const core = [];
    for (let i = 0; i < coreLength; i++) {
      core.push({
        shapeType: isShapeChanging ? distinctShapes[i % distinctShapes.length] : baseShape,
        color: isColorChanging ? distinctColors[i % distinctColors.length].hex : baseColor.hex,
        size: isSizeChanging ? distinctSizes[i % distinctSizes.length] : baseSize,
        rotation: isOrientationChanging ? distinctRots[i % distinctRots.length] : baseRot,
        colorName: isColorChanging ? distinctColors[i % distinctColors.length].name : baseColor.name
      });
    }
    
    const pattern = generatePattern(core, 3);
    
    // Choose an index to corrupt (not the first 3 elements so the rule is established)
    const errorIndex = getRandomInt(4, pattern.length - 2);
    const originalShape = { ...pattern[errorIndex] };
    
    // Mutate the shape to something else by changing one of its changing attributes
    const mutateAttr = getRandomElement(changingAttributes);
    if (mutateAttr === 'shape') {
      const availableShapes = (isOrientationChanging ? ASYMMETRIC_SHAPES : SHAPES).filter(s => s !== originalShape.shapeType);
      pattern[errorIndex].shapeType = getRandomElement(availableShapes);
    } else if (mutateAttr === 'colour') {
      const availableColors = COLORS.filter(c => c.name !== originalShape.colorName);
      const c = getRandomElement(availableColors);
      pattern[errorIndex].color = c.hex;
      pattern[errorIndex].colorName = c.name;
    } else if (mutateAttr === 'size') {
      pattern[errorIndex].size = originalShape.size === 'large' ? 'small' : 'large';
    } else if (mutateAttr === 'orientation') {
      const availableRots = [0, 90, 180, 270].filter(r => r !== originalShape.rotation);
      pattern[errorIndex].rotation = getRandomElement(availableRots);
    }
    
    structureText = `One of the shapes in the pattern below is wrong! Which shape does not belong?`;
    shortText = `Which shape does not belong in this pattern?`;
    actualAnswer = `Shape ${errorIndex + 1}`;
    hintStr = `Find the repeating group first. Then look for the shape that breaks the rule!`;
    
    const buildShapeDesc = (s) => {
      let desc = '';
      if (isSizeChanging || mutateAttr === 'size') desc += `${s.size} `;
      if (isColorChanging || mutateAttr === 'colour') desc += `${s.colorName} `;
      desc += s.shapeType;
      if (isOrientationChanging || mutateAttr === 'orientation') desc += ` ${getDirection(s.rotation)}`;
      return desc;
    };
    
    const coreString = core.map(s => buildShapeDesc(s)).join(', ');
    stepsStr = JSON.stringify([
      `First, identify the repeating core of the pattern by looking at the start: ${coreString}.`,
      `The pattern should repeat this sequence over and over.`,
      `Check each shape. Shape ${errorIndex + 1} is a ${buildShapeDesc(pattern[errorIndex])}.`,
      `According to the core rule, it should be a ${buildShapeDesc(originalShape)}.`,
      `So the shape that does not belong is Shape ${errorIndex + 1}.`
    ]);

    structureSteps = [
      { label: `Repeating pattern`, expectedAnswer: coreString },
      { label: `Incorrect shape`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { layout: "PATTERN", pattern: pattern, mistakeIndex: errorIndex, showIndexes: true }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer, `Shape ${errorIndex}`, `Shape ${errorIndex + 2}`, `Shape ${errorIndex + 3}`];
      mcqOptions = [...new Set(mcqOptions)];
      while(mcqOptions.length < 4) {
        mcqOptions.push(`Shape ${getRandomInt(4, pattern.length)}`);
        mcqOptions = [...new Set(mcqOptions)];
      }
    }
  } else if (activeVariant === 'advanced_composite_shape_pattern') {
    // A pattern of composite shapes. E.g., a large square with a small triangle inside that changes color.
    const outerShapes = [...SHAPES];
    const innerShapes = [...SHAPES, ...ASYMMETRIC_SHAPES];
    
    const baseOuterShape = getRandomElement(outerShapes);
    const baseInnerShape = getRandomElement(innerShapes.filter(s => s !== baseOuterShape));
    const baseOuterColor = getRandomElement(COLORS);
    const baseInnerColor = getRandomElement(COLORS.filter(c => c.name !== baseOuterColor.name));
    
    // What changes? 0: inner colour, 1: outer colour, 2: inner shape
    const changeMode = getRandomInt(0, 2);
    
    const coreLength = 3;
    const core = [];
    
    let changeLabel = '';
    let distinctValues = [];
    
    if (changeMode === 0) {
      changeLabel = 'inner colour';
      distinctValues = [...COLORS].filter(c => c.name !== baseOuterColor.name).sort(() => 0.5 - Math.random()).slice(0, coreLength);
    } else if (changeMode === 1) {
      changeLabel = 'outer colour';
      distinctValues = [...COLORS].filter(c => c.name !== baseInnerColor.name).sort(() => 0.5 - Math.random()).slice(0, coreLength);
    } else {
      changeLabel = 'inner shape';
      distinctValues = [...innerShapes].filter(s => s !== baseOuterShape).sort(() => 0.5 - Math.random()).slice(0, coreLength);
    }
    
    for (let i = 0; i < coreLength; i++) {
      core.push({
        isComposite: true,
        parts: [
          { 
            shapeType: baseOuterShape, 
            color: changeMode === 1 ? distinctValues[i].hex : baseOuterColor.hex, 
            size: 'large', 
            zIndex: 1,
            colorName: changeMode === 1 ? distinctValues[i].name : baseOuterColor.name
          },
          { 
            shapeType: changeMode === 2 ? distinctValues[i] : baseInnerShape, 
            color: changeMode === 0 ? distinctValues[i].hex : baseInnerColor.hex, 
            size: 'small', 
            zIndex: 2,
            colorName: changeMode === 0 ? distinctValues[i].name : baseInnerColor.name
          }
        ]
      });
    }
    
    const pattern = generatePattern(core, 3);
    const gapIndex = getRandomInt(2, pattern.length - 1);
    const nextComposite = pattern[gapIndex];
    const nextOuter = nextComposite.parts[0];
    const nextInner = nextComposite.parts[1];
    
    const getDesc = (comp) => `${comp.parts[0].colorName} ${comp.parts[0].shapeType} with ${comp.parts[1].colorName} ${comp.parts[1].shapeType}`;
    
    structureText = `Look at the pattern of stacked shapes below. What is the missing shape in the pattern?`;
    shortText = `What is the missing stacked shape?`;
    actualAnswer = getDesc(nextComposite);
    hintStr = `Look at the outer shape and the inner shape separately. Which one is changing?`;
    
    const coreString = core.map(c => getDesc(c)).join(', ');
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern: ${coreString}.`,
      `The pattern repeats this sequence over and over.`,
      `The shape right before the missing one is a ${getDesc(pattern[gapIndex - 1])}.`,
      `According to the core, the shape that comes after that is a ${actualAnswer}.`,
      `So the missing shape is a ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `What changes?`, expectedAnswer: changeLabel },
      { label: `Repeating pattern`, expectedAnswer: coreString },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { layout: "PATTERN", pattern: pattern, gapIndex: gapIndex }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      for (let i = 1; i < 4; i++) {
        mcqOptions.push(getDesc(pattern[(gapIndex + i) % coreLength]));
      }
      mcqOptions = [...new Set(mcqOptions)];
      while(mcqOptions.length < 4) {
        mcqOptions.push(`${getRandomElement(COLORS).name} ${baseOuterShape} with ${getRandomElement(COLORS).name} ${baseInnerShape}`);
        mcqOptions = [...new Set(mcqOptions)];
      }
    }
  } else if (activeVariant === 'advanced_logical_translation') {
    const rules = [
      { type: 'A, A, B', core: [0, 0, 1] },
      { type: 'A, B, B', core: [0, 1, 1] },
      { type: 'A, B, C', core: [0, 1, 2] },
      { type: 'A, B, A', core: [0, 1, 0] }
    ];
    
    const targetRule = getRandomElement(rules);
    
    function generateLogicCore(attribute, corePattern) {
      const distinctVals = [];
      if (attribute === 'shape') {
        distinctVals.push(...[...SHAPES].sort(() => 0.5 - Math.random()).slice(0, 3));
        const baseColor = getRandomElement(COLORS);
        return corePattern.map(idx => ({ shapeType: distinctVals[idx], color: baseColor.hex, size: 'large', colorName: baseColor.name, desc: distinctVals[idx] }));
      } else if (attribute === 'colour') {
        distinctVals.push(...[...COLORS].sort(() => 0.5 - Math.random()).slice(0, 3));
        const baseShape = getRandomElement(SHAPES);
        return corePattern.map(idx => ({ shapeType: baseShape, color: distinctVals[idx].hex, size: 'large', colorName: distinctVals[idx].name, desc: `${distinctVals[idx].name} ${baseShape}` }));
      } else if (attribute === 'size') {
        distinctVals.push(...[...SIZES].sort(() => 0.5 - Math.random()).slice(0, 3));
        const baseColor = getRandomElement(COLORS);
        const baseShape = getRandomElement(SHAPES);
        return corePattern.map(idx => ({ shapeType: baseShape, color: baseColor.hex, size: distinctVals[idx], colorName: baseColor.name, desc: `${distinctVals[idx]} ${baseShape}` }));
      }
    }
    
    const attributes = ['shape', 'colour', 'size'];
    const refAttr = getRandomElement(attributes);
    // Allow either the same attribute or a different attribute to create similar/cross attribute variation
    const optAttr = getRandomElement(attributes);
    
    const refCore = generateLogicCore(refAttr, targetRule.core);
    const refPattern = generatePattern(refCore, 2);
    
    const options = [];
    for (const rule of rules) {
       const optCore = generateLogicCore(optAttr, rule.core);
       options.push({ pattern: generatePattern(optCore, 2), type: rule.type, isCorrect: rule.type === targetRule.type, coreDesc: optCore.map(o => o.desc).join(', ') });
    }
    
    const patternsToDisplay = [
      { label: 'First Pattern', pattern: refPattern }
    ];
    
    const optionsOnly = options.sort(() => 0.5 - Math.random());
    let correctOptLabel = '';
    let correctOptDesc = '';
    optionsOnly.forEach((opt, idx) => {
      const lbl = `Option ${String.fromCharCode(65 + idx)}`;
      opt.label = lbl;
      if (opt.isCorrect) {
        correctOptLabel = lbl;
        correctOptDesc = opt.coreDesc;
      }
      patternsToDisplay.push({ label: lbl, pattern: opt.pattern });
    });
    
    structureText = `Look at the first pattern carefully. Which of the options below follows the exact same rule?`;
    shortText = `Which option follows the same rule as the first pattern?`;
    actualAnswer = correctOptLabel;
    
    const hintDesc = targetRule.type.split(', ');
    const secondLetter = hintDesc[1];
    hintStr = `Think of the shapes as letters. If the first shape is A, and the second shape is ${secondLetter === 'A' ? 'the same, it is also A' : 'different, it is B'}. Which option also repeats like ${targetRule.type}?`;
    
    const refDesc = refCore.map(c => c.desc).join(', ');
    stepsStr = JSON.stringify([
      `Look at the first pattern: ${refDesc}.`,
      `We can describe this rule using letters: ${targetRule.type}.`,
      `Now look at the options. We need to find the one that also repeats in an ${targetRule.type} pattern.`,
      `Let's look at ${correctOptLabel}: ${correctOptDesc}.`,
      `This perfectly matches the ${targetRule.type} rule!`,
      `Therefore, ${actualAnswer} is the correct answer.`
    ]);

    structureSteps = [
      { label: `Pattern Rule`, expectedAnswer: targetRule.type },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { layout: "MULTI_PATTERN", patterns: patternsToDisplay }
    });

    if (isMCQ) {
      mcqOptions = ['Option A', 'Option B', 'Option C', 'Option D'];
    }
  } else if (activeVariant === 'advanced_predict_nth_element') {
    const coreLength = getRandomElement([3, 4]);
    const attributes = ['shape', 'color', 'size'].sort(() => 0.5 - Math.random());
    const attr1 = attributes[0];
    const attr2 = attributes[1];
    
    const baseShape = getRandomElement(SHAPES);
    const baseColor = getRandomElement(COLORS);
    const baseSize = 'large';
    
    const core = [];
    const getDistinct = (attr, count, excludeHex = null) => {
      if (attr === 'shape') {
        return [...SHAPES, ...ASYMMETRIC_SHAPES].sort(() => 0.5 - Math.random()).slice(0, count);
      } else if (attr === 'color') {
        const availableColors = excludeHex ? COLORS.filter(c => c.hex !== excludeHex) : COLORS;
        return availableColors.sort(() => 0.5 - Math.random()).slice(0, count);
      } else {
        return ['small', 'medium', 'large'].sort(() => 0.5 - Math.random()).slice(0, count);
      }
    };
    
    const v1List = getDistinct(attr1, coreLength);
    const v2List = getDistinct(attr2, coreLength, attr1 === 'color' ? v1List[0].hex : null);
    
    for (let i = 0; i < coreLength; i++) {
      let shapeType = attr1 === 'shape' ? v1List[i] : (attr2 === 'shape' ? v2List[i] : baseShape);
      let colorObj = attr1 === 'color' ? v1List[i] : (attr2 === 'color' ? v2List[i] : baseColor);
      let size = attr1 === 'size' ? v1List[i] : (attr2 === 'size' ? v2List[i] : baseSize);
      
      core.push({ shapeType, color: colorObj.hex, size, colorName: colorObj.name });
    }
    
    const targetN = getRandomElement([9, 10, 11, 12]);
    const targetIndex = targetN - 1; 
    
    const elementsToShow = coreLength + 2; 
    const pattern = generatePattern(core, Math.ceil(elementsToShow / coreLength) + 1).slice(0, elementsToShow);
    
    const targetShapeObj = core[targetIndex % coreLength];
    const actualAnswerDesc = `${targetShapeObj.size === 'medium' ? 'medium ' : targetShapeObj.size === 'small' ? 'small ' : ''}${targetShapeObj.colorName} ${targetShapeObj.shapeType}`;
    
    structureText = `Look at the pattern below. The shapes repeat in a rule. What will the ${targetN}th shape be?`;
    shortText = `What will the ${targetN}th shape be?`;
    actualAnswer = actualAnswerDesc;
    
    hintStr = `First, find the repeating core. How many shapes make up one complete group? Once you know that, you can count forward to the ${targetN}th shape!`;
    
    const coreDesc = core.map(c => `${c.size === 'medium' ? 'medium ' : c.size === 'small' ? 'small ' : ''}${c.colorName} ${c.shapeType}`).join(', ');
    
    stepsStr = JSON.stringify([
      `Identify the repeating core of the pattern.`,
      `The core is: ${coreDesc}.`,
      `This core has ${coreLength} shapes.`,
      `If we keep repeating this group of ${coreLength} shapes, the ${targetN}th shape will be the same as shape number ${(targetIndex % coreLength) + 1} in the core.`,
      `Shape number ${(targetIndex % coreLength) + 1} in the core is a ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `Repeating pattern`, expectedAnswer: coreDesc },
      { label: `Target shape`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { layout: "PATTERN", pattern: pattern, hideGap: true }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      for (let i = 1; i < coreLength; i++) {
        const incorrectTarget = core[(targetIndex + i) % coreLength];
        mcqOptions.push(`${incorrectTarget.size === 'medium' ? 'medium ' : incorrectTarget.size === 'small' ? 'small ' : ''}${incorrectTarget.colorName} ${incorrectTarget.shapeType}`);
      }
      mcqOptions = [...new Set(mcqOptions)];
      while(mcqOptions.length < 4) {
        mcqOptions.push(`${getRandomElement(COLORS).name} ${getRandomElement(SHAPES)}`);
        mcqOptions = [...new Set(mcqOptions)];
      }
    }
  } else if (activeVariant === 'advanced_mismatched_attribute_cycles') {
    const cycleLen1 = 2;
    const cycleLen2 = 3;
    
    const attributes = ['shape', 'color', 'size'].sort(() => 0.5 - Math.random());
    const attr1 = attributes[0];
    const attr2 = attributes[1];
    
    const baseShape = getRandomElement(SHAPES);
    const baseColor = getRandomElement(COLORS);
    const baseSize = 'large';
    
    const getDistinct = (attr, count) => {
      if (attr === 'shape') return [...SHAPES, ...ASYMMETRIC_SHAPES].sort(() => 0.5 - Math.random()).slice(0, count);
      if (attr === 'color') return [...COLORS].sort(() => 0.5 - Math.random()).slice(0, count);
      return ['small', 'medium', 'large'].sort(() => 0.5 - Math.random()).slice(0, count);
    };
    
    const v1List = getDistinct(attr1, cycleLen1);
    const v2List = getDistinct(attr2, cycleLen2);
    
    const patternLength = 6;
    const gapIndex = 5;
    const pattern = [];
    
    for (let i = 0; i < patternLength; i++) {
      let shapeType = attr1 === 'shape' ? v1List[i % cycleLen1] : (attr2 === 'shape' ? v2List[i % cycleLen2] : baseShape);
      let colorObj = attr1 === 'color' ? v1List[i % cycleLen1] : (attr2 === 'color' ? v2List[i % cycleLen2] : baseColor);
      let size = attr1 === 'size' ? v1List[i % cycleLen1] : (attr2 === 'size' ? v2List[i % cycleLen2] : baseSize);
      
      pattern.push({ shapeType, color: colorObj.hex, size, colorName: colorObj.name });
    }
    
    const nextShapeObj = pattern[gapIndex];
    const isSizeChanging = (attr1 === 'size' || attr2 === 'size');
    const actualAnswerDesc = `${(isSizeChanging || nextShapeObj.size !== 'large') ? nextShapeObj.size + ' ' : ''}${nextShapeObj.colorName} ${nextShapeObj.shapeType}`;
    
    structureText = `This is a tricky pattern! Two things are changing, but they don't change together. What is the missing shape?`;
    shortText = `What is the missing shape?`;
    actualAnswer = actualAnswerDesc;
    
    hintStr = `Look at just the ${attr1}s first. Then look at just the ${attr2}s. They follow different rules!`;
    
    const attr1ValsDesc = v1List.map(v => typeof v === 'object' ? v.name : v).join(', ');
    const attr2ValsDesc = v2List.map(v => typeof v === 'object' ? v.name : v).join(', ');
    
    stepsStr = JSON.stringify([
      `First, let's look at just the ${attr1}s.`,
      `The ${attr1}s follow a repeating rule of: ${attr1ValsDesc}.`,
      `Next, let's look at just the ${attr2}s.`,
      `The ${attr2}s follow a repeating rule of: ${attr2ValsDesc}.`,
      `By combining these two rules, we can find the missing shape.`,
      `The missing shape must be a ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `${attr1} rule`, expectedAnswer: attr1ValsDesc },
      { label: `${attr2} rule`, expectedAnswer: attr2ValsDesc },
      { label: `Final Answer`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_DISPLAY",
      componentData: { layout: "PATTERN", pattern: pattern, gapIndex: gapIndex }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      for (let i = 1; i <= 3; i++) {
        let shapeType = attr1 === 'shape' ? v1List[(gapIndex + i) % cycleLen1] : (attr2 === 'shape' ? v2List[(gapIndex + i) % cycleLen2] : baseShape);
        let colorObj = attr1 === 'color' ? v1List[(gapIndex + i) % cycleLen1] : (attr2 === 'color' ? v2List[(gapIndex + i) % cycleLen2] : baseColor);
        let size = attr1 === 'size' ? v1List[(gapIndex + i) % cycleLen1] : (attr2 === 'size' ? v2List[(gapIndex + i) % cycleLen2] : baseSize);
        let desc = `${(isSizeChanging || size !== 'large') ? size + ' ' : ''}${colorObj.name} ${shapeType}`;
        mcqOptions.push(desc);
      }
      mcqOptions = [...new Set(mcqOptions)];
      while(mcqOptions.length < 4) {
        mcqOptions.push(`${getRandomElement(COLORS).name} ${getRandomElement(SHAPES)}`);
        mcqOptions = [...new Set(mcqOptions)];
      }
    }
  }

  // Common output builder
  const defectMapStr = isMCQ 
    ? JSON.stringify(Object.fromEntries(mcqOptions.filter(o => o !== actualAnswer).map(o => [o, "Incorrect logic/shape"])))
    : `{}`;

  const optionsStr = isMCQ ? JSON.stringify(mcqOptions) : `[]`;
  const questionTextStr = JSON.stringify([getQText(structureText, shortText)]);

  let multiStepInputStr = null;
  if (isStructure && structureSteps.length > 0) {
    multiStepInputStr = JSON.stringify({
      inputType: "MULTI_STEP_INPUT",
      steps: structureSteps
    });
  }

  const aiPrompt = getFormatInstructions(visualEngineStr, multiStepInputStr) + `

CRITICAL INSTRUCTIONS:
- questionText: Use exactly: ${questionTextStr}
- options: ${optionsStr}
- defectMap: ${defectMapStr}
- hint: "${hintStr}"
- solutionSteps: ${stepsStr}
- finalAnswer: "${actualAnswer}"
`;

  return { aiPrompt };
}
