/**
 * Advanced Tier: Complex patterns and attribute logic.
 * PATH: src/lib/syllabus/math/primary-1/geometry/shapes/advanced.js
 */
export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: '2D Shapes', type: zodType, difficulty: zodDiff, strand: 'Geometry', subject: 'Math', gradeLevel: 'P1' };
  const inputType = 'MCQ_BUTTONS';
  let componentData = null;
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender: "SHAPE_DISPLAY" }, inputRequirement: { inputType } };
  let seedInstructions = "";
  let lockComponentData = true; // By default, prevent AI from hallucinating math-dependent structures

  // 1. Procedural Generation Pools
  const shapeTypes = ["circle", "triangle", "square", "rectangle"];
  const allColors = ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#f97316"]; // Red, Blue, Yellow, Green, Purple, Orange
  const colorNames = { "#ef4444": "red", "#3b82f6": "blue", "#eab308": "yellow", "#22c55e": "green", "#a855f7": "purple", "#f97316": "orange" };
  const sizeTiers = ["small", "medium", "large"];

  // 2. Generation Helpers
  const getRandom = (arr, count) => [...arr].sort(() => Math.random() - 0.5).slice(0, count);
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const getShuffledOptions = (correct, distractors) => [correct, ...distractors].sort(() => Math.random() - 0.5);

  switch (activeVariant) {
    case 'advanced_pattern_two_attributes': {
      commonMeta.heuristic = 'Multi-Attribute Patterns';
      const [s1, s2] = getRandom(shapeTypes, 2);
      const [c1] = getRandom(allColors, 1);
      const [sz1, sz2] = getRandom(sizeTiers, 2);
      
      // Pattern alternates Shape and Size (A-B-A-B)
      const p1 = { shapeType: s1, size: sz1, color: c1 };
      const p2 = { shapeType: s2, size: sz2, color: c1 };
      componentData = { layout: "PATTERN", pattern: [p1, p2, p1, p2], nextItem: p1 };

      const ans = `${capitalize(sz1)} ${capitalize(s1)}`;
      promptObject.content = {
        questionText: "What comes next in the pattern?",
        finalAnswer: ans,
        options: getShuffledOptions(ans, [`${capitalize(sz2)} ${capitalize(s2)}`, `${capitalize(sz2)} ${capitalize(s1)}`, `${capitalize(sz1)} ${capitalize(s2)}`]),
        hint: "Look at the shape and the size. They both change every time!",
        solutionSteps: `The pattern shows a ${sz1} ${s1} followed by a ${sz2} ${s2}. To continue the pattern, we need a ${sz1} ${s1} again.`
      };
      seedInstructions = `Sequence logic with Shape and Size properties.`;
      break;
    }

    case 'advanced_attribute_logic': {
      commonMeta.heuristic = 'Dual Attribute Deduction';
      const [c1, c2] = getRandom(allColors, 2);
      const [s1, s2] = getRandom(shapeTypes, 2);
      
      const items = [
        { shapeType: s1, color: c1, size: "medium", label: "A" }, // Target
        { shapeType: s1, color: c2, size: "medium", label: "B" }, // Same shape, wrong color
        { shapeType: s2, color: c1, size: "medium", label: "C" }, // Wrong shape, same color
      ].sort(() => Math.random() - 0.5);

      componentData = { layout: "GRID", items };
      const target = items.find(i => i.shapeType === s1 && i.color === c1);

      promptObject.content = {
        questionText: `Which item is a ${s1} AND is colored ${colorNames[c1]}?`,
        finalAnswer: `Item ${target.label}`,
        options: ["Item A", "Item B", "Item C"],
        hint: `You need to find a shape that matches both rules: it must be a ${s1} and also be ${colorNames[c1]}.`,
        solutionSteps: `Look at each item. Only Item ${target.label} is both a ${s1} and colored ${colorNames[c1]}.`
      };
      seedInstructions = `Grid identification with simultaneous text constraints.`;
      break;
    }

    case 'advanced_pattern_three_attributes': {
      commonMeta.heuristic = 'Triple Attribute Extrapolation';
      const [s1, s2] = getRandom(shapeTypes, 2);
      const [c1, c2] = getRandom(allColors, 2);
      const [sz1, sz2] = getRandom(sizeTiers, 2);

      const p1 = { shapeType: s1, color: c1, size: sz1 };
      const p2 = { shapeType: s2, color: c2, size: sz2 };
      componentData = { layout: "PATTERN", pattern: [p1, p2, p1, p2] };

      const ans = `${capitalize(sz1)} ${colorNames[c1]} ${capitalize(s1)}`;
      promptObject.content = {
        questionText: "Which shape comes next in this complex pattern?",
        finalAnswer: ans,
        options: getShuffledOptions(ans, [
          `${capitalize(sz2)} ${colorNames[c2]} ${capitalize(s2)}`,
          `${capitalize(sz1)} ${colorNames[c2]} ${capitalize(s1)}`,
          `${capitalize(sz2)} ${colorNames[c1]} ${capitalize(s2)}`
        ]),
        hint: "Watch the shape, the color, AND the size. All three things repeat in order!",
        solutionSteps: `The pattern repeats two different items. The first item is a ${sz1} ${colorNames[c1]} ${s1}. This is what comes after the second item.`
      };
      seedInstructions = `Sequential pattern involving Shape, Color, and Size simultaneously.`;
      break;
    }

    case 'advanced_pattern_retrograde_logic': {
      commonMeta.heuristic = 'Retrograde Sequence Analysis';
      const [s1, s2] = getRandom(shapeTypes, 2);
      const [c1] = getRandom(allColors, 1);
      const pattern = [s1, s2, s1, s2].map(s => ({ shapeType: s, color: c1, size: "medium" }));
      
      componentData = { layout: "PATTERN", pattern, gapIndex: 0 };

      promptObject.content = {
        questionText: `Look at the pattern. What shape is missing at the start?`,
        finalAnswer: capitalize(s1),
        options: shapeTypes.map(capitalize),
        hint: "Look at the shapes that come after the gap to see how the pattern repeats backwards.",
        solutionSteps: `The pattern follows an ABAB rule. Since the second shape is a ${s2}, the first shape must be a ${s1}.`
      };
      seedInstructions = `Pattern with missing start item.`;
      break;
    }

    case 'advanced_shape_exclusion_riddles': {
      commonMeta.heuristic = 'Negative Property Logic';
      promptObject.visualEngine.componentToRender = null;
      const [s1, s2, s3] = getRandom(shapeTypes, 3);
      const [c1] = getRandom(allColors, 1);
      
      const sides = s1 === "triangle" ? 3 : (s1 === "circle" ? 0 : 4);
      const targetName = capitalize(s1);

      promptObject.content = {
        questionText: `I am NOT a ${s2}. I am NOT a ${s3}. I have exactly ${sides} straight sides. What shape am I?`,
        finalAnswer: targetName,
        options: shapeTypes.map(capitalize),
        hint: "Focus on the number of straight sides to find the answer!",
        solutionSteps: `A ${s1} is the only shape that has exactly ${sides} sides and is not a ${s2} or ${s3}.`
      };
      seedInstructions = `Text riddle using exclusion logic.`;
      break;
    }

    case 'advanced_embedded_counting': {
      commonMeta.heuristic = 'Structural Decomposition';
      const [targetShape] = getRandom(["square", "circle", "triangle"], 1);
      const count = Math.floor(Math.random() * 2) + 3; // 3 or 4 nested
      
      const parts = Array.from({ length: count }, (_, i) => ({
        shapeType: targetShape,
        color: allColors[i % allColors.length],
        x: 50,
        y: 50,
        scale: 2.5 - (i * 0.5),
        opacity: Math.max(0.3, 0.8 - (i * 0.15)),
        zIndex: 10 + (count - i)
      }));

      componentData = { layout: "COMPOSITE_GENERATIVE", parts };

      promptObject.content = {
        questionText: `How many ${targetShape}s are nested inside each other in this picture?`,
        finalAnswer: String(count),
        options: ["2", "3", "4", "5"],
        hint: "Count each shape from the biggest one on the outside to the smallest one in the middle!",
        solutionSteps: `Looking at the center, we can see ${count} separate ${targetShape}s drawn inside one another.`
      };
      seedInstructions = `Nested concentric primitives for counting.`;
      break;
    }

    case 'advanced_composite_deconstruct_inventory': {
      commonMeta.heuristic = 'Total Part Inventory';
      const subjects = ["rocket", "robot", "truck", "castle", "house", "boat", "train"];
      const sub = subjects[Math.floor(Math.random() * subjects.length)];
      
      // Let the AI generate the parts dynamically!
      componentData = { layout: "COMPOSITE_GENERATIVE", parts: [], name: sub };
      lockComponentData = false;

      promptObject.content = {
        questionText: `Which list shows all the shapes used to build this ${sub}?`,
        finalAnswer: "", // AI must calculate this
        options: [], // AI must generate distractors
        hint: "Break the drawing down into pieces and count how many of each shape you see.",
        solutionSteps: `The ${sub} is made of ...` // AI to fill in
      };
      
      seedInstructions = `
        TASK: You are an artist and a math teacher! 
        1. Draw a '${sub}' using ONLY basic 2D shapes (circle, square, rectangle, triangle).
        2. Create 4 to 8 shapes. Output them in visualEngine.componentData.parts.
        3. Each part needs: shapeType, color (hex), x (20-80), y (20-80), scale (0.5 to 2.0). 
        4. Based on your drawing, calculate the EXACT inventory of shapes.
        5. Set content.finalAnswer to the correct inventory string (e.g. "1 Rectangle, 2 Circles, 1 Triangle").
        6. Generate 3 plausible distractors for content.options.
      `;
      break;
    }

    case 'advanced_attribute_matrix_intersection': {
      commonMeta.heuristic = 'Matrix Intersection Logic';
      const [c1, c2] = getRandom(allColors, 2);
      const [s1, s2] = getRandom(shapeTypes, 2);

      // Create a 2x2 matrix as a Grid
      componentData = {
        layout: "GRID",
        items: [
          { shapeType: s1, color: c1, size: "medium", label: "1" },
          { shapeType: s1, color: c2, size: "medium", label: "2" },
          { shapeType: s2, color: c1, size: "medium", label: "3" },
          { shapeType: s2, color: c2, size: "medium", label: "4" }
        ]
      };

      promptObject.content = {
        questionText: `Find the item that fits this rule: It must be a ${s2} AND it must be ${colorNames[c1]}.`,
        finalAnswer: "Item 3",
        options: ["Item 1", "Item 2", "Item 3", "Item 4"],
        hint: "Look for the shape first, then check if it has the right color.",
        solutionSteps: `Only Item 3 is a ${s2} that is also colored ${colorNames[c1]}.`
      };
      seedInstructions = `Attribute matrix intersection.`;
      break;
    }

    case 'advanced_orientation_invariance': {
      commonMeta.heuristic = 'Rotational Invariance';
      const target = getRandom(["square", "triangle", "rectangle"], 1)[0];
      const rotation = Math.floor(Math.random() * 200) + 30; // Severe rotation

      componentData = { 
        shapeType: target, 
        color: getRandom(allColors, 1)[0], 
        size: "large", 
        rotation, 
        layout: "SINGLE" 
      };

      promptObject.content = {
        questionText: "Even though this shape is tilted, what shape is it?",
        finalAnswer: capitalize(target),
        options: shapeTypes.map(capitalize),
        hint: "Try tilting your head! Count the sides and corners to be sure.",
        solutionSteps: `A shape stays the same even if you turn it. This shape has ${target === "triangle" ? 3 : 4} sides, so it is a ${target}.`
      };
      seedInstructions = `Shape identification under severe rotation (${rotation} degrees).`;
      break;
    }

    case 'advanced_conservation_of_shapes': {
      commonMeta.heuristic = 'Conservation Logic';
      promptObject.visualEngine.componentToRender = null;
      const [s1] = getRandom(["square", "rectangle"], 1);
      
      promptObject.content = {
        questionText: `Ben has a large ${s1}. He cuts it into 4 smaller triangles. If he puts all the pieces back together perfectly, will they still be as big as the original ${s1}?`,
        finalAnswer: "Yes",
        options: ["Yes", "No", "It will be smaller", "It will be larger"],
        hint: "Think! Did Ben add any more paper or throw any away?",
        solutionSteps: `When you cut a shape into parts, the total amount of space (the size) stays the same if you keep all the pieces.`
      };
      seedInstructions = `Conservation of area/mass logic problem.`;
      break;
    }
  }

  // 3. Final Payload Assembly
  promptObject.visualEngine.componentData = componentData;

  const instructions = `
    TASK: Generate an advanced Primary 1 Geometry structured problem.
    VARIANT: ${activeVariant}

    CRITICAL ARCHITECTURAL RUNTIME CONSTRAINTS:
    ${promptObject.visualEngine.componentToRender === "SHAPE_DISPLAY" ? '- Visual layouts MUST use componentToRender: "SHAPE_DISPLAY".' : '- DO NOT generate any visual elements for this question. Keep visualEngine.componentToRender as null.'}
    ${lockComponentData && promptObject.visualEngine.componentToRender !== null ? '- DO NOT modify the visualEngine.componentData object. You must return it exactly as provided.' : ''}
    - All 'x' and 'y' coordinates in parts must be strictly between 20 and 80.
    - The output JSON object MUST contain 'content.hint' with a child-friendly clue.
    - 'content.solutionSteps' must be a descriptive string explanation (no nested JSON).
    - ${seedInstructions}
    - Current Component State: ${JSON.stringify(componentData)}

    OUTPUT MANDATE: Return ONLY valid, parseable JSON.
    ${JSON.stringify(promptObject)}`;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}