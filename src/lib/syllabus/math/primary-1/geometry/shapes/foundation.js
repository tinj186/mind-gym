/**
 * Foundation Tier: Identify single shapes and classify by attribute.
 * PATH: src/lib/syllabus/math/primary-1/geometry/shapes/foundation.js
 */
export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: '2D Shapes', type: zodType, difficulty: zodDiff, strand: 'Geometry', subject: 'Math', gradeLevel: 'P1' };
  const inputType = 'MCQ_BUTTONS';
  let componentData = null;
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender: "SHAPE_DISPLAY" }, inputRequirement: { inputType } };
  let seedInstructions = "";

  const shapes = ["circle", "triangle", "square", "rectangle"];
  const colors = ["red", "blue", "yellow", "green"];

  switch (activeVariant) {
    case 'foundation_identify_shape': {
      commonMeta.heuristic = 'Shape Identification';
      const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
      const rotation = Math.floor(Math.random() * 8) * 45;
      componentData = { 
        shapeType: targetShape, 
        color: colors[Math.floor(Math.random() * colors.length)], 
        size: "medium", 
        rotation, 
        layout: "SINGLE" 
      };

      const finalAnswer = targetShape.charAt(0).toUpperCase() + targetShape.slice(1);
      promptObject.content = {
        questionText: "What shape is shown in the picture?",
        finalAnswer,
        options: shapes.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        hint: "Count the number of straight sides or look for curves!",
        solutionSteps: `This shape is a ${targetShape}. It has ${targetShape === 'circle' ? 'no straight sides' : (targetShape === 'triangle' ? '3 sides' : '4 sides')}.`
      };
      seedInstructions = `Identify a ${targetShape} rotated by ${rotation} degrees.`;
      break;
    }

    case 'foundation_classify_attribute': {
      commonMeta.heuristic = 'Attribute Classification';
      const useColor = Math.random() > 0.5;
      const targetColor = colors[Math.floor(Math.random() * colors.length)];
      const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
      const targetValue = useColor ? targetColor : targetShape;

      componentData = { 
        layout: "GROUPS", 
        groups: [
          { label: "Group A", items: [{ shapeType: targetShape, color: targetColor, size: "medium" }] },
          { label: "Group B", items: [{ shapeType: shapes.find(s => s !== targetShape), color: colors.find(c => c !== targetColor), size: "medium" }] },
          { label: "Group C", items: [{ shapeType: shapes.find(s => s !== targetShape), color: colors.find(c => c !== targetColor), size: "medium" }] }
        ]
      };

      promptObject.content = {
        questionText: `Which group shows shapes that are ${targetValue}?`,
        finalAnswer: "Group A",
        options: ["Group A", "Group B", "Group C"],
        hint: `Look at the ${useColor ? 'colors' : 'shapes'} of each item carefully!`,
        solutionSteps: useColor
          ? `Only Group A contains a shape that is ${targetColor}. The other groups have different colors.`
          : `Only Group A contains a ${targetShape}. The other groups have different shapes.`
      };
      seedInstructions = `Classify shapes by ${useColor ? 'color' : 'shape'}: ${targetValue}. Correct answer is Group A.`;
      break;
    }

    case 'foundation_count_sides': {
      commonMeta.heuristic = 'Structural Analysis';
      const countShapes = ["triangle", "square", "rectangle"];
      const targetShape = countShapes[Math.floor(Math.random() * countShapes.length)];
      const sideCount = targetShape === "triangle" ? 3 : 4;

      componentData = { 
        shapeType: targetShape, 
        color: colors[Math.floor(Math.random() * colors.length)], 
        size: "large", 
        rotation: 0, 
        layout: "SINGLE" 
      };

      promptObject.content = {
        questionText: `How many straight sides does this ${targetShape} have?`,
        finalAnswer: String(sideCount),
        options: ["1", "2", "3", "4", "5"],
        hint: "Run your finger along the edges and count each straight line!",
        solutionSteps: `A ${targetShape} has exactly ${sideCount} straight lines connected together.`
      };
      seedInstructions = `Count straight sides for a ${targetShape}. Correct answer: ${sideCount}.`;
      break;
    }

    case 'foundation_size_comparison': {
      commonMeta.heuristic = 'Size Discrimination';
      const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
      const targetColor = colors[Math.floor(Math.random() * colors.length)];
      const askSmallest = Math.random() > 0.5;

      const items = [
        { shapeType: targetShape, color: targetColor, size: "small", label: "Item A" },
        { shapeType: targetShape, color: targetColor, size: "medium", label: "Item B" },
        { shapeType: targetShape, color: targetColor, size: "large", label: "Item C" }
      ].sort(() => Math.random() - 0.5);

      componentData = { layout: "GRID", items };
      const targetItem = items.find(i => i.size === (askSmallest ? "small" : "large"));

      promptObject.content = {
        questionText: `Which ${targetShape} is the ${askSmallest ? 'smallest' : 'largest'}?`,
        finalAnswer: targetItem.label,
        options: ["Item A", "Item B", "Item C"],
        hint: "Compare the shapes side by side. Which one looks the biggest or smallest?",
        solutionSteps: `Comparing the three ${targetShape}s, ${targetItem.label} takes up the ${askSmallest ? 'least' : 'most'} amount of space.`
      };
      seedInstructions = `Compare sizes of three ${targetShape}s. Find the ${askSmallest ? 'SMALLEST' : 'LARGEST'}. Correct label: ${targetItem.label}.`;
      break;
    }

    case 'foundation_match_real_object': {
      commonMeta.heuristic = 'Real-world Mapping';
      
      const realWorldObjects = [
        // CIRCLES (Pure round boundaries)
        { name: "coin", shape: "Circle", emoji: "🪙", clue: "It is perfectly round metal money with no straight edges." },
        { name: "doughnut", shape: "Circle", emoji: "🍩", clue: "It is perfectly round with a hole in the middle." },
        { name: "cookie", shape: "Circle", emoji: "🍪", clue: "It is a round sweet treat with no sharp corners." },
        { name: "target board", shape: "Circle", emoji: "🎯", clue: "It has round rings that go round and round." },

        // RECTANGLES (2 long, 2 short sides)
        { name: "envelope", shape: "Rectangle", emoji: "✉️", clue: "It has 2 long straight sides and 2 short straight sides." },
        { name: "chocolate bar", shape: "Rectangle", emoji: "🍫", clue: "It is a long sweet treat with straight sides." },
        { name: "smartphone", shape: "Rectangle", emoji: "📱", clue: "It is long and has a screen with 4 straight corners." },
        { name: "door", shape: "Rectangle", emoji: "🚪", clue: "It is tall with 2 long sides and 2 short sides." },

        // SQUARES (4 equal sides)
        { name: "window pane", shape: "Square", emoji: "🪟", clue: "It has 4 straight sides that are exactly the same length." },
        { name: "picture frame", shape: "Square", emoji: "🖼️", clue: "All 4 of its straight sides are perfectly equal." },
        { name: "slice of square bread", shape: "Square", emoji: "🍞", clue: "It has 4 equal straight edges." },

        // TRIANGLES (3 sides)
        { name: "cheese wedge", shape: "Triangle", emoji: "🧀", clue: "It has 3 straight sides and pointy corners." },
        { name: "camping tent", shape: "Triangle", emoji: "⛺", clue: "The front of it has 3 straight sides pointing up like a roof." },
        { name: "sailboat", shape: "Triangle", emoji: "⛵", clue: "The sails catching the wind have exactly 3 straight sides." },
        { name: "flag", shape: "Triangle", emoji: "🚩", clue: "It has 3 straight edges pointing out in the wind." },
        { name: "party popper", shape: "Triangle", emoji: "🎉", clue: "The bottom part points down like a shape with 3 sides." },
        { name: "megaphone", shape: "Triangle", emoji: "📣", clue: "The side of it looks like a shape with 3 straight edges." },
        { name: "pine tree", shape: "Triangle", emoji: "🌲", clue: "It has a pointy top and a wide bottom, just like a shape with 3 sides." },
        { name: "snowy mountain", shape: "Triangle", emoji: "🗻", clue: "It is tall and pointy at the very top with 3 straight sides." },
        { name: "mountain peak", shape: "Triangle", emoji: "⛰️", clue: "The rocky outline goes up to a sharp point with 3 sides." },
        { name: "pizza slice", shape: "Triangle", emoji: "🍕", clue: "It has 3 straight sides and comes to a sharp point." },
      ];

      const target = realWorldObjects[Math.floor(Math.random() * realWorldObjects.length)];

      componentData = { 
        layout: "EMOJI", 
        emoji: target.emoji, 
        name: target.name 
      };

      promptObject.content = {
        questionText: `A ${target.name} looks like a...`,
        finalAnswer: target.shape,
        options: ["Circle", "Triangle", "Square", "Rectangle"],
        hint: target.clue,
        solutionSteps: `Most ${target.name}s have the outline of a ${target.shape.toLowerCase()}.`
      };
      seedInstructions = `Match real-world object "${target.name}" (emoji: ${target.emoji}) to its 2D shape: ${target.shape}.`;
      break;
    }
  }

  // Final structural optimization: ensure componentData is assigned if visualEngine is present
  if (promptObject.visualEngine.componentToRender) {
    promptObject.visualEngine.componentData = componentData;
  }

  const instructions = `
    TASK: Generate a Primary 1 Geometry question.
    VARIANT: ${activeVariant}
    CRITICAL PROMPT SEED CONSTRAINTS:
    - The output JSON object MUST contain 'content.hint' with a child-friendly string. Do not alter or omit this parameter name.
    - ${seedInstructions}
    - Component data: ${componentData ? JSON.stringify(componentData) : 'None'}
    
    OUTPUT MANDATE: Return ONLY valid JSON. ${JSON.stringify(promptObject)}`;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}