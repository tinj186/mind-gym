import { getRandomNames, getRandom3DObject } from '../../../../../utils/variable-bank';

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions, context, selectedContextItem, getQText) {
  let structureText = '';
  let shortText = '';
  let actualAnswer = '';
  let hintStr = '';
  let stepsStr = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let mcqOptions = [];
  let structureSteps = [];

  const formatShapeName = (shape) => shape.charAt(0).toUpperCase() + shape.slice(1);

  if (activeVariant === 'advanced_2d_stacking_extrusion') {
    const direction = getRandomElement(['2D_TO_3D', '3D_TO_2D']);
    const multiplier = getRandomInt(10, 100);
    
    let rwo;
    while (true) {
      rwo = getRandom3DObject();
      if (['cube', 'cuboid', 'cylinder'].includes(rwo.shape)) break;
    }

    let flatShape = '';
    if (rwo.shape === 'cube') flatShape = 'square';
    else if (rwo.shape === 'cuboid') flatShape = 'rectangle';
    else if (rwo.shape === 'cylinder') flatShape = 'circle';

    const solidName = formatShapeName(rwo.shape);
    const flatName = formatShapeName(flatShape);

    if (direction === '2D_TO_3D') {
      actualAnswer = solidName;
      shortText = `Imagine stacking ${multiplier} identical flat ${flatShape}s on top of each other. It builds a 3D shape that looks like a ${rwo.name}! What mathematical 3D shape did you build?`;
      structureText = shortText;
      
      hintStr = `Imagine stacking many flat ${flatShape}s like pancakes. What 3D shape does it look like?`;
      stepsStr = JSON.stringify([
        `A ${rwo.name} is shaped like a ${rwo.shape}.`,
        `When you stack flat ${flatShape}s on top of each other, it gains height.`,
        `A tall stack of ${flatShape}s makes a ${rwo.shape}.`
      ]);
      if (isMCQ) mcqOptions = ['Cylinder', 'Cube', 'Cuboid', 'Sphere'];
      
    } else { // 3D_TO_2D
      actualAnswer = flatName;
      shortText = `If you cut a ${rwo.name} into ${multiplier} very thin flat slices, what 2D shape will each slice be?`;
      structureText = shortText;
      
      hintStr = `Think about what 3D shape a ${rwo.name} is. What flat shape makes up its layers?`;
      stepsStr = JSON.stringify([
        `A ${rwo.name} is shaped like a ${rwo.shape}.`,
        `If you slice a ${rwo.shape} very thinly, each slice is flat.`,
        `The flat layers of a ${rwo.shape} are ${flatShape}s.`
      ]);
      if (isMCQ) mcqOptions = ['Circle', 'Square', 'Rectangle', 'Triangle'];
    }

    structureSteps = [
      { label: `Mathematical 3D shape of a ${rwo.name}`, expectedAnswer: solidName },
      { label: "2D shape of its flat layers", expectedAnswer: flatName }
    ];

  } else if (activeVariant === 'advanced_elimination_riddle') {
    const isDirectionA = Math.random() > 0.5;

    const shapes = [
      {
        id: 'cube',
        flatDesc: "a shape with 4 equal straight sides",
        canSlide: true, canRoll: false, canStack: true,
        propertiesText: "It can slide and stack, but it cannot roll."
      },
      {
        id: 'cuboid',
        flatDesc: "a shape with 4 straight sides, but not all are equal",
        canSlide: true, canRoll: false, canStack: true,
        propertiesText: "It can slide and stack, but it cannot roll."
      },
      {
        id: 'cylinder',
        flatDesc: "a shape with 0 straight sides",
        canSlide: true, canRoll: true, canStack: true,
        propertiesText: "It can slide, roll, and stack."
      },
      {
        id: 'cone',
        flatDesc: "a shape with 0 straight sides",
        canSlide: true, canRoll: true, canStack: false,
        propertiesText: "It can slide and roll, but it cannot stack."
      },
      {
        id: 'sphere',
        flatDesc: "none",
        canSlide: false, canRoll: true, canStack: false,
        propertiesText: "It can roll, but it cannot slide or stack."
      }
    ];

    const target = getRandomElement(shapes);
    actualAnswer = formatShapeName(target.id);

    if (isDirectionA) {
      // Direction A: Riddle -> Find the 3D Shape
      let clues = [];
      if (target.id === 'sphere') {
        clues = ["I can roll, but I cannot slide or stack.", "I have no flat faces."];
      } else {
        clues.push(`Tracing one of my flat faces makes ${target.flatDesc}.`);
        if (target.canRoll && target.canStack) clues.push("I can roll and I can also stack.");
        else if (target.canRoll && !target.canStack) clues.push("I can roll, but I cannot stack.");
        else if (!target.canRoll && target.canStack) clues.push("I can stack, but I cannot roll.");
      }

      const clueText = clues.map((c, i) => `Clue ${i + 1}: ${c}`).join(" ");
      shortText = `${clueText} What shape am I?`;
      structureText = shortText;

      hintStr = `Look at the clues one by one. Which 3D shape has all of these properties?`;
      stepsStr = JSON.stringify([
        `Let's look at the clues one by one.`,
        ...clues.map(c => `"${c}" helps us figure out the shape's properties.`),
        `The only shape that fits all these clues is a ${target.id}.`
      ]);

      if (target.id === 'sphere') {
        structureSteps = [
          { label: "Does it have flat faces?", expectedAnswer: "No" },
          { label: "Can it slide?", expectedAnswer: "No" },
          { label: "What shape is it?", expectedAnswer: actualAnswer }
        ];
      } else {
        let expected2D = "Square";
        if (target.id === 'cuboid') expected2D = "Rectangle";
        if (target.id === 'cylinder' || target.id === 'cone') expected2D = "Circle";
        
        structureSteps = [
          { label: `What 2D shape is described in Clue 1?`, expectedAnswer: expected2D },
          { label: `Can the 3D shape roll?`, expectedAnswer: target.canRoll ? "Yes" : "No" },
          { label: `Can the 3D shape stack?`, expectedAnswer: target.canStack ? "Yes" : "No" },
          { label: `What shape is it?`, expectedAnswer: actualAnswer }
        ];
      }

      if (isMCQ) {
        mcqOptions = [actualAnswer];
        const distractors = ['Cube', 'Cuboid', 'Sphere', 'Cone', 'Cylinder'].filter(s => s !== actualAnswer).sort(() => 0.5 - Math.random());
        while (mcqOptions.length < 4) mcqOptions.push(distractors.pop());
      }
    } else {
      // Direction B: 3D Shape -> Find the Properties
      actualAnswer = target.propertiesText;
      shortText = `Look at a ${target.id}. Which of these sentences describes a ${target.id} perfectly?`;
      structureText = shortText;

      hintStr = `Think about whether a ${target.id} has flat faces or curved surfaces to see if it can slide, roll, or stack!`;
      stepsStr = JSON.stringify([
        `A ${target.id} has ${target.canRoll ? "a curved surface" : "only flat faces"}, so it ${target.canRoll ? "can" : "cannot"} roll.`,
        `It has ${target.canStack ? "flat faces on opposite ends" : "no flat faces on opposite ends"}, so it ${target.canStack ? "can" : "cannot"} stack.`,
        `Therefore, ${actualAnswer.toLowerCase()}`
      ]);

      structureSteps = [
        { label: `Does a ${target.id} have a curved surface?`, expectedAnswer: target.canRoll ? "Yes" : "No" },
        { label: `Therefore, can it roll?`, expectedAnswer: target.canRoll ? "Yes" : "No" },
        { label: `Can it stack?`, expectedAnswer: target.canStack ? "Yes" : "No" },
        { label: `Correct description`, expectedAnswer: actualAnswer }
      ];

      if (isMCQ) {
        mcqOptions = [actualAnswer];
        const allProperties = shapes.map(s => s.propertiesText);
        const uniqueProperties = [...new Set(allProperties)];
        const distractors = uniqueProperties.filter(p => p !== actualAnswer).sort(() => 0.5 - Math.random());
        while (mcqOptions.length < 4) mcqOptions.push(distractors.pop());
      } else {
        // If it's a short text, just ask for the description or properties, but it's hard to type. 
        // We can just use the same MCQ options so they can copy it.
        shortText += `\n(Choose one: ${[...new Set(shapes.map(s => s.propertiesText))].join(" / ")})`;
      }
    }

  } else if (activeVariant === 'advanced_hidden_block_difference') {
    const isAdding = Math.random() > 0.5;
    const baseCount = getRandomInt(3, 7);
    const difference = getRandomInt(1, 5);
    const finalCount = isAdding ? baseCount + difference : baseCount - difference;

    // Create random visually-offset structures
    const generateStructure = (count) => {
      const blocks = [];
      const used = new Set();
      blocks.push({ x: 0, y: 0, z: 0 });
      used.add('0,0,0');

      let attempts = 0;
      while (blocks.length < count && attempts < 100) {
        attempts++;
        const parent = getRandomElement(blocks);
        const dir = getRandomElement([
          { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
          { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
          { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }
        ]);
        const nx = parent.x + dir.x;
        const ny = parent.y + dir.y;
        const nz = parent.z + dir.z;
        if (ny < 0) continue; // no underground blocks
        const key = `${nx},${ny},${nz}`;
        if (!used.has(key)) {
          blocks.push({ x: nx, y: ny, z: nz });
          used.add(key);
        }
      }
      return blocks;
    };

    const baseBlocks = generateStructure(baseCount);
    const finalBlocks = generateStructure(finalCount);

    const compA = baseBlocks.map(b => ({
      shape: 'cube', color: '#3b82f6', position: [b.x * 1.5 - 5, b.y * 1.5, b.z * 1.5], scale: [0.48, 0.48, 0.48]
    }));
    const compB = finalBlocks.map(b => ({
      shape: 'cube', color: '#22c55e', position: [b.x * 1.5 + 5, b.y * 1.5, b.z * 1.5], scale: [0.48, 0.48, 0.48]
    }));

    visualEngineStr = JSON.stringify({
      componentToRender: "COMPOSITE_SHAPE_3D",
      componentData: { composition: [...compA, ...compB], isometric: true, autoRotate: false }
    });

    actualAnswer = String(difference);
    const action = isAdding ? "must be added to Structure A to build Structure B" : "were removed from Structure A to create Structure B";

    shortText = `The blue structure is Structure A. The green structure is Structure B. How many cubes ${action}?`;
    structureText = shortText;

    hintStr = `Count the exact number of cubes in Structure A, then count the exact number in Structure B. What is the difference?`;

    stepsStr = JSON.stringify([
      `First, count the cubes in Structure A. There are ${baseCount} cubes.`,
      `Next, count the cubes in Structure B. There are ${finalCount} cubes.`,
      `We need to find the difference between them.`,
      isAdding ? `${finalCount} - ${baseCount} = ${difference}.` : `${baseCount} - ${finalCount} = ${difference}.`,
      `${difference} cubes ${action}.`
    ]);

    structureSteps = [
      { label: "Cubes in Structure A", expectedAnswer: String(baseCount) },
      { label: "Cubes in Structure B", expectedAnswer: String(finalCount) },
      { label: isAdding ? "Cubes added" : "Cubes removed", expectedAnswer: actualAnswer }
    ];

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      while (mcqOptions.length < 4) {
        const wrong = String(Math.max(1, difference + getRandomInt(-2, 3)));
        if (!mcqOptions.includes(wrong)) mcqOptions.push(wrong);
      }
    }

  } else if (activeVariant === 'advanced_trace_and_manipulate') {
    const getProperties = (shape) => {
      if (shape === 'cube') return { trace: 'square', corners: 4, straight: 4 };
      if (shape === 'cuboid') return { trace: 'rectangle', corners: 4, straight: 4 };
      if (shape === 'cylinder' || shape === 'cone') return { trace: 'circle', corners: 0, straight: 0 };
      return null;
    };
    
    const fetchValidObject = (allowedShapes) => {
      let rwo;
      while (true) {
        rwo = getRandom3DObject();
        if (allowedShapes.includes(rwo.shape)) break;
      }
      return { name: rwo.name, ...getProperties(rwo.shape) };
    };

    const rule = getRandomElement(['COUNT_SIDES', 'NOT_EQUAL', 'COMMON']);

    if (rule === 'COUNT_SIDES') {
      const allTraceable = ['cube', 'cuboid', 'cylinder', 'cone'];
      const obj1 = fetchValidObject(allTraceable);
      let obj2 = fetchValidObject(allTraceable);
      while (obj2.name === obj1.name) obj2 = fetchValidObject(allTraceable);
      const selectedObjects = [obj1, obj2];

      const total = selectedObjects[0].straight + selectedObjects[1].straight;
      actualAnswer = String(total);
      shortText = `Mentally trace the flat bottom of a ${selectedObjects[0].name} and a ${selectedObjects[1].name}. How many straight sides do both traces have altogether?`;
      structureText = shortText;

      hintStr = `Trace the flat bottom of each object. A circle has 0 straight sides. Add the sides together!`;
      stepsStr = JSON.stringify([
        `The flat bottom of a ${selectedObjects[0].name} is a ${selectedObjects[0].trace}, which has ${selectedObjects[0].straight} straight sides.`,
        `The flat bottom of a ${selectedObjects[1].name} is a ${selectedObjects[1].trace}, which has ${selectedObjects[1].straight} straight sides.`,
        `${selectedObjects[0].straight} + ${selectedObjects[1].straight} = ${total}.`
      ]);

      structureSteps = [
        { label: `Straight sides in ${selectedObjects[0].name} trace`, expectedAnswer: String(selectedObjects[0].straight) },
        { label: `Straight sides in ${selectedObjects[1].name} trace`, expectedAnswer: String(selectedObjects[1].straight) },
        { label: "Total straight sides", expectedAnswer: actualAnswer }
      ];

      if (isMCQ) {
        mcqOptions = [actualAnswer];
        while (mcqOptions.length < 4) {
          const wrong = String(Math.max(0, total + getRandomInt(-2, 3)));
          if (!mcqOptions.includes(wrong)) mcqOptions.push(wrong);
        }
      }
    } else if (rule === 'NOT_EQUAL') {
      const rectObj = fetchValidObject(['cuboid']);
      const otherObj = fetchValidObject(['cube', 'cylinder', 'cone']);
      const pair = [rectObj, otherObj].sort(() => 0.5 - Math.random());

      actualAnswer = `The ${rectObj.trace} from the ${rectObj.name}`;
      shortText = `Trace the flat faces of a ${pair[0].name} and a ${pair[1].name}. Which 2D shape has sides that are NOT all equal?`;
      structureText = shortText;

      hintStr = `Trace both objects. A square has all equal sides. A rectangle has 2 long sides and 2 short sides.`;
      stepsStr = JSON.stringify([
        `Tracing a ${rectObj.name} makes a ${rectObj.trace}. A rectangle has sides that are NOT all equal.`,
        `Tracing a ${otherObj.name} makes a ${otherObj.trace}.`,
        `Therefore, the shape with unequal sides is the ${rectObj.trace} from the ${rectObj.name}.`
      ]);

      structureSteps = [
        { label: `Shape traced from ${rectObj.name}`, expectedAnswer: rectObj.trace },
        { label: `Shape traced from ${otherObj.name}`, expectedAnswer: otherObj.trace },
        { label: "Shape with unequal sides", expectedAnswer: actualAnswer }
      ];

      if (isMCQ) {
        mcqOptions = [
          actualAnswer,
          `The ${otherObj.trace} from the ${otherObj.name}`,
          `Both shapes`,
          `Neither shape`
        ];
      }
    } else { // COMMON
      const obj1 = fetchValidObject(['cylinder', 'cone']);
      let obj2 = fetchValidObject(['cylinder', 'cone']);
      while (obj2.name === obj1.name) obj2 = fetchValidObject(['cylinder', 'cone']);
      const circleObjs = [obj1, obj2];
      
      actualAnswer = "Both are circles";
      shortText = `Trace the flat bottom of a ${circleObjs[0].name} and a ${circleObjs[1].name}. What do the two 2D shapes have in common?`;
      structureText = shortText;

      hintStr = `Trace both objects in your mind. What 2D shape do they both make?`;
      stepsStr = JSON.stringify([
        `Tracing the bottom of a ${circleObjs[0].name} makes a circle.`,
        `Tracing the bottom of a ${circleObjs[1].name} also makes a circle.`,
        `Therefore, both shapes are circles.`
      ]);

      structureSteps = [
        { label: `Shape traced from ${circleObjs[0].name}`, expectedAnswer: "circle" },
        { label: `Shape traced from ${circleObjs[1].name}`, expectedAnswer: "circle" },
        { label: "What they have in common", expectedAnswer: actualAnswer }
      ];

      if (isMCQ) {
        mcqOptions = [
          actualAnswer,
          "Both are squares",
          "Both are rectangles",
          "Both have 4 corners"
        ];
      }
    }
  }

  // Shuffle MCQ options if applicable
  let defectMap = {};
  if (isMCQ) {
    const originalOptions = [...mcqOptions];
    mcqOptions = mcqOptions.sort(() => Math.random() - 0.5);
    originalOptions.slice(1).forEach((distractor, idx) => {
      defectMap[`distractor${idx + 1}`] = "Conceptual error";
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
`;

  return { aiPrompt };
}
