/**
 * Standard Tier: Composite shapes and simple patterns.
 * PATH: src/lib/syllabus/math/primary-1/geometry/shapes/standard.js
 */
export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: '2D Shapes', type: zodType, difficulty: zodDiff, strand: 'Geometry', subject: 'Math', gradeLevel: 'P1' };
  const inputType = 'MCQ_BUTTONS';
  let componentData = null;
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender: "SHAPE_DISPLAY" }, inputRequirement: { inputType } };
  let seedInstructions = "";

  const allShapes = ["circle", "triangle", "square", "rectangle"];
  const allColors = ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#f97316"]; // Red, Blue, Yellow, Green, Purple, Orange
  
  // Helper to get random distinct items from an array
  const getRandom = (arr, count) => [...arr].sort(() => Math.random() - 0.5).slice(0, count);

  const shapes = ["circle", "triangle", "square", "rectangle"];
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const getShuffledOptions = (correct, distractors) => {
    return [correct, ...distractors].sort(() => Math.random() - 0.5);
  };

  switch (activeVariant) {
    case 'standard_count_composite': {
      commonMeta.heuristic = 'Part-Whole Decomposition';

      const targetShapes = allShapes;
      const targetShape = targetShapes[Math.floor(Math.random() * targetShapes.length)];

      // 💡 NEW: A massive pool of subjects to force the AI to be creative
      const subjects = [
        "steam train", "space rocket", "friendly robot", "sailboat on water", 
        "tall castle", "butterfly", "racecar", "snowman", "house with a tree", 
        "dog", "cat", "fish in a bowl", "submarine", "hot air balloon", "bulldozer"
      ];
      const selectedSubject = subjects[Math.floor(Math.random() * subjects.length)];

      componentData = { 
        layout: "COMPOSITE_GENERATIVE", 
        parts: [], 
        name: selectedSubject // Pre-fill the name so the AI doesn't have to guess
      };

      promptObject.content = {
        questionText: `Look at the picture of the ${selectedSubject}. How many ${targetShape}s are used to build it?`,
        finalAnswer: "{count}", 
        options: [], 
        hint: `Count every single ${targetShape} you can find, even if they are different sizes or turned sideways!`,
        solutionSteps: `By looking closely at the ${selectedSubject}, we can count exactly {count} ${targetShape}s used in the drawing.`
      };

      seedInstructions = `
        CRITICAL TASK: Build a 2D drawing of a "${selectedSubject.toUpperCase()}" built ENTIRELY out of basic shapes.
        
        1. Generate an array of 5 to 10 shapes inside visualEngine.componentData.parts to create the ${selectedSubject}. Every part MUST have:
           - shapeType: "circle" | "square" | "triangle" | "rectangle"
           - color: a vibrant, child-friendly hex code (e.g., "#ef4444", "#3b82f6", "#eab308")
           - x: number (20 to 80) representing horizontal percentage (50 is center)
           - y: number (20 to 80) representing vertical percentage (50 is center)
           - scale: number (0.5 to 2.5) for size
           - rotation: number (0 to 360) for angle
        3. Ensure at least 1 and up to 4 shapes in your drawing are EXACTLY the "${targetShape}".
        4. Calculate the EXACT count of "${targetShape}"s in your parts array.
        5. Replace "{count}" in the promptObject.content strings with your generated value.
        6. Generate the options array containing the true count and 3 close distractors (e.g., ["2", "3", "4", "5"]).
      `;
      break;
    }

    case 'standard_pattern_next': {
      commonMeta.heuristic = 'Pattern Recognition';
      
      // Randomize the shapes used in the pattern
      const [sA, sB, sC] = getRandom(allShapes, 3);
      
      // Randomize the pattern structure (ABAB, AABB, ABC)
      const templates = [
        { type: "ABAB", seq: [sA, sB, sA, sB, sA], next: sB },
        { type: "AABB", seq: [sA, sA, sB, sB, sA, sA], next: sB },
        { type: "ABC", seq: [sA, sB, sC, sA, sB, sC, sA, sB], next: sC }
      ];
      const selected = templates[Math.floor(Math.random() * templates.length)];

      componentData = { layout: "PATTERN", pattern: selected.seq, nextItem: selected.next };

      promptObject.content = {
        questionText: "What shape comes next in the pattern?",
        finalAnswer: selected.next.charAt(0).toUpperCase() + selected.next.slice(1),
        options: getRandom(allShapes, 4).map(s => s.charAt(0).toUpperCase() + s.slice(1)), // 4 random options
        hint: "Look closely at how the shapes repeat. Say their names out loud in order!",
        solutionSteps: `The pattern follows a repeating rule. After the sequence ends, the correct next shape is a ${selected.next}.`
      };
      seedInstructions = `Create a shape pattern sequence logic problem.`;
      break;
    }

    case 'standard_pattern_missing_middle': {
      commonMeta.heuristic = 'Sequence Interpolation';
      const [sA, sB] = getRandom(allShapes, 2);
      componentData = { layout: "PATTERN", pattern: [sA, sB, sA, sB], gapIndex: 2 };

      promptObject.content = {
        questionText: `Look at the pattern. What shape is missing in the box with the question mark?`,
        finalAnswer: capitalize(sA),
        options: getRandom(allShapes, 4).map(capitalize),
        hint: "Say the pattern out loud. What shape should come between the two shapes to keep the pattern going?",
        solutionSteps: `The pattern repeats ${sA} and ${sB}. The shape between the two ${sB}s must be a ${sA}.`
      };
      seedInstructions = "Interpolate a missing shape in the middle of a repeating sequence.";
      break;
    }

    case 'standard_compose_shapes': {
      commonMeta.heuristic = 'Shape Composition';
      promptObject.visualEngine.componentToRender = null; 
      
      const rules = [
        { text: "If you put 2 identical squares side-by-side, what new shape do you make?", ans: "Rectangle", hint: "Think about the sides getting longer when you push them together!" },
        { text: "If you cut a square exactly in half straight down the middle, what two shapes do you get?", ans: "Rectangles", hint: "If you chop a square in half, you get two shapes with long and short sides." },
        { text: "If you cut a square from corner to corner, what two shapes do you get?", ans: "Triangles", hint: "Cutting corner to corner gives you pointy shapes with 3 sides." }
      ];
      const selected = rules[Math.floor(Math.random() * rules.length)];

      promptObject.content = {
        questionText: selected.text,
        finalAnswer: selected.ans,
        options: getRandom(["Squares", "Rectangles", "Triangles", "Circles"], 4),
        hint: selected.hint,
        solutionSteps: `By imagining the cut or join, we can see the resulting shape(s) will be ${selected.ans}.`
      };
      break;
    }

    case 'standard_decompose_shape': {
      commonMeta.heuristic = 'Shape Decomposition';
      promptObject.visualEngine.componentToRender = null; 
      
      const rules = [
        { text: "If you cut a circle in half, what do you get?", ans: "Two half-circles", hint: "Cutting something into two equal pieces gives you two halves." },
        { text: "If you slice a rectangle in half from corner to corner, what two shapes do you get?", ans: "Triangles", hint: "Think about making two pointy shapes with 3 sides." }
      ];
      const selected = rules[Math.floor(Math.random() * rules.length)];

      promptObject.content = {
        questionText: selected.text,
        finalAnswer: selected.ans,
        options: getRandom(["Squares", "Triangles", "Circles", "Two half-circles"], 4),
        hint: selected.hint,
        solutionSteps: `Dividing a shape in a specific way changes what it is. In this case, you get ${selected.ans}.`
      };
      break;
    }

    case 'standard_most_frequent_shape': {
      commonMeta.heuristic = 'Visual Comparison';
      
      const subjects = [
        "steam train", "space rocket", "friendly robot", "sailboat on water", 
        "tall castle", "butterfly", "racecar", "snowman", "house with a tree", 
        "dog", "cat", "fish in a bowl", "submarine", "hot air balloon", "bulldozer"
      ];
      const selectedSubject = subjects[Math.floor(Math.random() * subjects.length)];

      const askMostFrequent = Math.random() > 0.5; // Randomly ask for most or least

      componentData = { 
        layout: "COMPOSITE_GENERATIVE", 
        parts: [], 
        name: selectedSubject 
      };

      promptObject.content = {
        questionText: `Look at the picture of the ${selectedSubject}. Which shape is used the ${askMostFrequent ? 'most' : 'least'} to build it?`,
        finalAnswer: "{targetShapeName}", // e.g., "Triangle" or "They are the same"
        options: [], // AI will generate
        hint: `Count how many times each type of shape appears in the ${selectedSubject}.`,
        solutionSteps: `By counting all the shapes in the ${selectedSubject}, we find that {targetShapeName} is used the ${askMostFrequent ? 'most' : 'least'}.`
      };

      seedInstructions = `
        CRITICAL TASK: Build a 2D drawing of a "${selectedSubject.toUpperCase()}" built ENTIRELY out of basic shapes.
        
        1. Generate an array of 5 to 10 shapes inside visualEngine.componentData.parts to create the ${selectedSubject}. Every part MUST have:
           - shapeType: "circle" | "square" | "triangle" | "rectangle"
           - color: a vibrant, child-friendly hex code (e.g., "#ef4444", "#3b82f6", "#eab308")
           - x: number (0 to 100) representing horizontal percentage (50 is center)
           - y: number (0 to 100) representing vertical percentage (50 is center)
           - scale: number (0.5 to 2.5) for size
           - rotation: number (0 to 360) for angle
        2. Ensure there is a clear ${askMostFrequent ? 'most' : 'least'} frequent shape. If asking for 'most', one shape type should appear at least 2 more times than any other. If asking for 'least', one shape type should appear at least 2 fewer times than any other, or only once.
        3. Calculate the EXACT name of the ${askMostFrequent ? 'most' : 'least'} frequent shape (e.g., "Triangle", "Square", "They are the same").
        4. Replace "{targetShapeName}" in the promptObject.content strings with your calculated value.
        5. Generate the options array containing the true answer and 3 close distractors (e.g., ["Triangle", "Square", "Circle", "Rectangle"]). Include "They are the same" if applicable.
      `;
      break;
    }

    case 'standard_shape_riddles': {
      commonMeta.heuristic = 'Property Identification';
      promptObject.visualEngine.componentToRender = null; // Text only
      
      const riddles = [
        { ans: "Square", clue: "I have 4 straight sides. All my sides are exactly the same length. What shape am I?" },
        { ans: "Rectangle", clue: "I have 4 straight sides. Two of my sides are long, and two are short. What shape am I?" },
        { ans: "Triangle", clue: "I have exactly 3 straight sides and 3 pointy corners. What shape am I?" },
        { ans: "Circle", clue: "I have no straight sides and no sharp corners. I am perfectly round. What shape am I?" }
      ];
      
      const selected = riddles[Math.floor(Math.random() * riddles.length)];

      promptObject.content = {
        questionText: selected.clue,
        finalAnswer: selected.ans,
        options: ["Circle", "Triangle", "Square", "Rectangle"],
        hint: "Count the sides and corners mentioned in the riddle to find the answer!",
        solutionSteps: `Based on the clues given, the only shape that matches those exact rules is a ${selected.ans}.`
      };
      seedInstructions = `Shape property riddle.`;
      break;
    }

    case 'standard_pattern_mistake': {
      commonMeta.heuristic = 'Anomaly Detection';
      const [sA, sB] = getRandom(allShapes, 2);
      
      // Pattern: ABABA. Randomize where the mistake happens (index 1 to 4)
      const mistakeIndex = Math.floor(Math.random() * 4) + 1;
      const seq = Array.from({ length: 5 }, (_, i) => i % 2 === 0 ? sA : sB);
      
      const originalShape = seq[mistakeIndex];
      const wrongShape = originalShape === sA ? sB : sA;
      
      // Apply the mistake
      seq[mistakeIndex] = wrongShape;
      
      const positionLabels = ["1st", "2nd", "3rd", "4th", "5th"];
      const mistakePos = positionLabels[mistakeIndex];
      const answer = `The ${mistakePos} ${capitalize(wrongShape)}`;
      
      componentData = { 
        layout: "PATTERN", 
        pattern: seq, 
        mistakeIndex: mistakeIndex 
      };

      // Construct options from actual sequence labels
      const optionPool = seq.map((s, i) => `The ${positionLabels[i]} ${capitalize(s)}`);

      promptObject.content = {
        questionText: "Look at the pattern. Which shape is the mistake?",
        finalAnswer: answer,
        options: getShuffledOptions(answer, getRandom(optionPool.filter(o => o !== answer), 3)),
        hint: "Say the pattern out loud. Where does it stop making sense?",
        solutionSteps: `The pattern should follow the rule: ${capitalize(sA)}, ${capitalize(sB)}, ${capitalize(sA)}, ${capitalize(sB)}... The ${mistakePos} shape is a ${capitalize(wrongShape)} but it should be a ${capitalize(originalShape)}.`
      };
      seedInstructions = "Identify the anomaly in a shape pattern.";
      break;
    }

    case 'standard_find_all_target_shape': {
      commonMeta.heuristic = 'Visual Discrimination';
      const target = allShapes[Math.floor(Math.random() * allShapes.length)];
      const items = [];
      let count = 0;
      for (let i = 0; i < 6; i++) {
        const shape = allShapes[Math.floor(Math.random() * allShapes.length)];
        if (shape === target) count++;
        items.push({ shapeType: shape, color: allColors[Math.floor(Math.random() * allColors.length)], size: getRandom(["small", "medium", "large"], 1)[0] });
      }

      componentData = { 
        layout: "GRID", 
        items: items
      };

      const finalAnswer = String(count);

      promptObject.content = {
        questionText: `How many ${target}s are in the grid?`,
        finalAnswer: finalAnswer,
        options: getShuffledOptions(finalAnswer, ["0", "1", "2", "3", "4", "5"].filter(x => x !== finalAnswer).slice(0, 3)),
        hint: `Count only the ${target}s you see in the grid.`,
        solutionSteps: `By looking at every shape, we find there are exactly ${count} ${target}s.`
      };
      seedInstructions = `Count all ${target}s in the grid.`;
      break;
    }

    case 'standard_match_composite_parts': {
      commonMeta.heuristic = 'Inventory Recognition';

      const subjects = [
        "steam train", "space rocket", "friendly robot", "sailboat on water", 
        "tall castle", "butterfly", "racecar", "snowman", "house with a tree", 
        "dog", "cat", "fish in a bowl", "submarine", "hot air balloon", "bulldozer"
      ];
      const selectedSubject = subjects[Math.floor(Math.random() * subjects.length)];

      componentData = { 
        layout: "COMPOSITE_GENERATIVE", 
        parts: [], 
        name: selectedSubject 
      };

      promptObject.content = {
        questionText: `Look at the picture of the ${selectedSubject}. Which list of shapes was used to build it?`,
        finalAnswer: "{inventory}", // AI will calculate and fill this (e.g. "2 Triangles, 1 Square")
        options: [], 
        hint: "Break down the drawing into the simple shapes you know.",
        solutionSteps: `By looking at the parts of the ${selectedSubject}, we can see it is built from {inventory}.`
      };

      seedInstructions = `
        CRITICAL TASK: Build a 2D drawing of a "${selectedSubject.toUpperCase()}" built ENTIRELY out of basic shapes.
        
        1. Generate an array of 5 to 10 shapes inside visualEngine.componentData.parts to create the ${selectedSubject}. Every part MUST have:
           - shapeType: "circle" | "square" | "triangle" | "rectangle"
           - color: a vibrant, child-friendly hex code (e.g., "#ef4444", "#3b82f6", "#eab308")
           - x: number (0 to 100) representing horizontal percentage (50 is center)
           - y: number (0 to 100) representing vertical percentage (50 is center)
           - scale: number (0.5 to 2.5) for size
           - rotation: number (0 to 360) for angle
        2. Calculate the exact inventory list of shapes used (e.g., "2 Triangles, 1 Square and 3 Circles").
        3. Replace "{inventory}" in the promptObject.content strings with your calculated summary.
        4. Generate the options array containing the true inventory and 3 incorrect but similar inventories (e.g., by changing one shape count or type).
      `;
      break;
    }

    default:
      // Fallback
      return standardLogic('standard_count_composite', difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic);
  }

  if (promptObject.visualEngine.componentToRender) {
    promptObject.visualEngine.componentData = componentData;
  } else {
    delete promptObject.visualEngine;
  }

  const instructions = `
    TASK: Generate a Standard Primary 1 Geometry question.
    VARIANT: ${activeVariant}
    CRITICAL PROMPT SEED CONSTRAINTS:
    - The output JSON object MUST contain 'content.hint' with a child-friendly string. Do not alter or omit this parameter name.
    - ${seedInstructions}
    - Component data: ${JSON.stringify(componentData)}
    
    OUTPUT MANDATE: Return ONLY valid JSON. ${JSON.stringify(promptObject)}`;
  return { aiPrompt: instructions, parseResponse: (json) => json };
}