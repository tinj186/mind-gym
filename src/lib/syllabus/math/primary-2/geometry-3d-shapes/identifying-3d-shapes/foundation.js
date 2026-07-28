const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
import { getRandom3DObject } from '../../../../../utils/variable-bank';


export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions, context, selectedContextItem, getQText) {
  let structureText = '';
  let shortText = '';
  let actualAnswer = '';
  let hintStr = '';
  let stepsStr = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let mcqOptions = [];
  let structureSteps = [];

  const SHAPES_3D = ['cube', 'cuboid', 'cone', 'cylinder', 'sphere'];
  const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#f97316'];

  if (activeVariant === 'foundation_identify_from_visual') {
    const targetShape = getRandomElement(SHAPES_3D);
    const targetColor = getRandomElement(COLORS);
    
    structureText = `What is the name of this 3D shape?`;
    shortText = `What is the name of this 3D shape?`;
    actualAnswer = targetShape.charAt(0).toUpperCase() + targetShape.slice(1);
    
    hintStr = `Look at its faces. Does it have flat faces, curved faces, or both?`;
    
    stepsStr = JSON.stringify([
      `Observe the shape shown above.`,
      targetShape === 'cube' ? `It has 6 flat square faces that are all the same size.` :
      targetShape === 'cuboid' ? `It has 6 flat rectangular faces.` :
      targetShape === 'cone' ? `It has 1 flat circular face and 1 curved surface coming to a point.` :
      targetShape === 'cylinder' ? `It has 2 flat circular faces and 1 curved surface.` :
      `It is perfectly round with only 1 curved surface.`,
      `Therefore, the shape is a ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `Shape name`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_3D",
      componentData: { shape: targetShape, color: targetColor, size: 150 }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      const distractors = SHAPES_3D.filter(s => s !== targetShape).map(s => s.charAt(0).toUpperCase() + s.slice(1));
      while (mcqOptions.length < 4) {
        mcqOptions.push(distractors.pop());
      }
    }
  } else if (activeVariant === 'foundation_real_world_matching') {
    const randomObject = getRandom3DObject();
    const targetObject = randomObject.name;
    const targetShape = randomObject.shape;
    
    structureText = `Which 3D shape looks like a ${targetObject}?`;
    shortText = `Which 3D shape looks like a ${targetObject}?`;
    actualAnswer = targetShape.charAt(0).toUpperCase() + targetShape.slice(1);
    
    hintStr = `Think about the surfaces of a ${targetObject}. Are they flat or curved?`;
    
    stepsStr = JSON.stringify([
      `Think about what a ${targetObject} looks like in real life.`,
      targetShape === 'cone' ? `It has a flat circular bottom and a curved part that comes to a point.` :
      targetShape === 'cuboid' ? `It is a box shape with rectangular flat faces.` :
      targetShape === 'sphere' ? `It is perfectly round like a ball.` :
      targetShape === 'cube' ? `It is a box shape where every side is a perfect square.` :
      `It has flat circular ends and a curved tube body.`,
      `The mathematical name for this shape is a ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `Matching 3D shape`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: randomObject.imageId ? "STATIC_IMAGE" : "NONE",
      componentData: randomObject.imageId ? {
        src: `/assets/3dshapes/${randomObject.imageId}.png`,
        alt: `A ${targetObject} which is a ${targetShape}`
      } : { hideVisual: true }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      const distractors = SHAPES_3D.filter(s => s !== targetShape).map(s => s.charAt(0).toUpperCase() + s.slice(1)).sort(() => 0.5 - Math.random());
      while (mcqOptions.length < 4) {
        mcqOptions.push(distractors.pop());
      }
    }
  } else if (activeVariant === 'foundation_surface_type_classification') {
    const targetShape = getRandomElement(SHAPES_3D);
    const targetColor = getRandomElement(COLORS);
    
    let answerCategory = '';
    if (targetShape === 'cube' || targetShape === 'cuboid') {
      answerCategory = 'Only flat surfaces';
    } else if (targetShape === 'sphere') {
      answerCategory = 'Only curved surfaces';
    } else {
      answerCategory = 'Both flat and curved surfaces';
    }
    
    structureText = `Look at the ${targetShape} below. What kind of surfaces does it have?`;
    shortText = `What kind of surfaces does a ${targetShape} have?`;
    actualAnswer = answerCategory;
    
    hintStr = `Touch the screen imaginary. Is it completely smooth and round, completely flat like a wall, or both?`;
    
    stepsStr = JSON.stringify([
      `Look closely at the surfaces of the ${targetShape}.`,
      targetShape === 'cube' || targetShape === 'cuboid' ? `All the sides are flat. There are no round parts.` :
      targetShape === 'sphere' ? `The whole shape is round and smooth. There are no flat parts.` :
      `It has at least one flat part (like a circle) and a smooth, round part.`,
      `Therefore, it has ${actualAnswer.toLowerCase()}.`
    ]);

    structureSteps = [
      { label: `Surface type`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_3D",
      componentData: { shape: targetShape, color: targetColor, size: 150 }
    });

    if (isMCQ) {
      mcqOptions = ['Only flat surfaces', 'Only curved surfaces', 'Both flat and curved surfaces'];
    }
  } else if (activeVariant === 'foundation_trace_single_2d_face') {
    const shapesWithFlatFaces = ['cube', 'cuboid', 'cone', 'cylinder'];
    const targetShape = getRandomElement(shapesWithFlatFaces);
    const targetColor = getRandomElement(COLORS);
    
    let faceToTrace = '';
    let answer2D = '';
    
    if (targetShape === 'cube') {
      faceToTrace = 'one of its flat faces';
      answer2D = 'square';
    } else if (targetShape === 'cuboid') {
      // Simplification for Primary 2: usually they trace the long face or we just say rectangle
      faceToTrace = 'one of its long flat faces';
      answer2D = 'rectangle';
    } else if (targetShape === 'cone') {
      faceToTrace = 'its flat bottom';
      answer2D = 'circle';
    } else if (targetShape === 'cylinder') {
      faceToTrace = 'its flat bottom';
      answer2D = 'circle';
    }
    
    structureText = `If you place this ${targetShape} on a piece of paper and trace around ${faceToTrace}, what 2D shape will you draw?`;
    shortText = `If you trace ${faceToTrace} of a ${targetShape}, what 2D shape will you draw?`;
    actualAnswer = answer2D.charAt(0).toUpperCase() + answer2D.slice(1);
    
    hintStr = `Imagine looking straight at the flat part of the shape. What flat 2D shape do you see?`;
    
    stepsStr = JSON.stringify([
      `Look at the ${targetShape}. We want to trace ${faceToTrace}.`,
      `The flat surface is shaped like a ${answer2D}.`,
      `So, if you trace around it, you will draw a ${answer2D}.`
    ]);

    structureSteps = [
      { label: `2D Shape drawn`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_3D",
      componentData: { shape: targetShape, color: targetColor, size: 150 }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      const all2D = ['Square', 'Rectangle', 'Circle', 'Triangle'];
      const distractors = all2D.filter(s => s !== actualAnswer).sort(() => 0.5 - Math.random());
      while (mcqOptions.length < 4 && distractors.length > 0) {
        mcqOptions.push(distractors.pop());
      }
    }
  } else if (activeVariant === 'foundation_count_basic_faces') {
    const targetShape = getRandomElement(['cube', 'cuboid']);
    const targetColor = getRandomElement(COLORS);
    
    structureText = `How many flat faces does a ${targetShape} have?`;
    shortText = `How many flat faces does a ${targetShape} have?`;
    actualAnswer = '6';
    
    hintStr = `Think about a dice or a box. Count the top, bottom, front, back, left, and right sides!`;
    
    stepsStr = JSON.stringify([
      `Let's count the flat faces on a ${targetShape}.`,
      `There is 1 on the top and 1 on the bottom (that makes 2).`,
      `There is 1 on the front and 1 on the back (that makes 4).`,
      `There is 1 on the left side and 1 on the right side.`,
      `4 + 2 = 6.`,
      `A ${targetShape} has 6 flat faces in total.`
    ]);

    structureSteps = [
      { label: `Number of faces`, expectedAnswer: actualAnswer }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_3D",
      componentData: { shape: targetShape, color: targetColor, size: 150 }
    });

    if (isMCQ) {
      mcqOptions = ['4', '5', '6', '8'];
    }
  }

  const defectMapStr = isMCQ 
    ? JSON.stringify(Object.fromEntries(mcqOptions.filter(o => o !== actualAnswer).map(o => [o, "Incorrect selection"])))
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

  const aiPrompt = `
You are a math question generator. Your task is to output a single JSON object.

CRITICAL INSTRUCTIONS:
- You MUST use the exact string provided in "questionText" as the primary question.
- You MUST use the exact string in "finalAnswer" as the expected answer.
- You MUST include a "solutionSteps" array that explains how to get the answer. Be age-appropriate for Primary 2. 
- You MUST use the exact characters \\n inside the string to separate steps in the solutionSteps string, do NOT output actual line breaks in the string.
- Your output MUST match the provided schema exactly.

${getFormatInstructions(visualEngineStr, multiStepInputStr)}

Question Details:
- questionText: ${questionTextStr}
- finalAnswer: ${actualAnswer}
- options: ${optionsStr}
- stepByStep: ${stepsStr}
- hint: ${hintStr}
`;

  return { aiPrompt };
}
