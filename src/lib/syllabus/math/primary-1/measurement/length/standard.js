/**
 * Standard Tier: Baseline comparisons, multi-object ordering, and baseline offset logic.
 * PATH: src/lib/syllabus/math/primary-1/measurement/length/standard.js
 */
export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { 
    level, 
    topic, 
    subtopic: 'Length', 
    type: zodType, 
    difficulty: zodDiff, 
    strand: 'Measurement and Geometry', 
    subject: 'Math', 
    gradeLevel: 'P1' 
  };
  
  // Standard-tier comparisons utilize multiple-choice button arrays for pristine input tracking
  const inputType = 'MCQ_BUTTONS'; 

  const itemsPool = ["Cutter", "Highlighter", "Pen", "Pencil", "Usbdrive"];
  const heightPool = ["Tree", "Giraffe", "Building", "Boy", "Ladder", "Lamp-post"];
  
  const units = [
    { name: "paperclips", icon: "paperclip.svg" },
    { name: "paperpins", icon: "paperpin.svg" },
  ];
  const selectedUnit = units[Math.floor(Math.random() * units.length)];
  let componentData = { items: [], unitIcon: selectedUnit.icon };
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender: "MEASUREMENT_UNIT" }, inputRequirement: { inputType } };
  let seedInstructions = "";

  // 🔀 CHOOSE ENGINE PROCESSING ROUTE BASED ON MOE VARIANT SLICE
  switch (activeVariant) {
    case 'standard_find_shortest': {
      commonMeta.heuristic = 'Baseline Extreme Finding';
      const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3);
      const lengths = [3, 5, 8].sort(() => 0.5 - Math.random());
      
      componentData.items = selection.map((name, idx) => ({ label: name, length: lengths[idx] }));
      const shortestItem = selection[lengths.indexOf(Math.min(...lengths))];

      promptObject.content = {
        questionText: "Look at the items. Which object is the shortest?",
        options: selection,
        finalAnswer: shortestItem,
        solutionSteps: `All objects share the same left wall. Looking across at the lengths, the ${shortestItem} is only ${Math.min(...lengths)} units long, making it the shortest object.`
      };
      seedInstructions = `Target objective: Find the SHORTEST item. True answer text: "${shortestItem}".`;
      break;
    }

    case 'standard_vertical_baseline': {
      commonMeta.heuristic = 'Height Vectors';
      
      // 🏢 Enforce logical, realistic base heights
      const tallItems = [
        { name: "Building", baseLen: 9 },
        { name: "Tree", baseLen: 6 },
        { name: "Ladder", baseLen: 5 },
        { name: "Boy", baseLen: 3 }
      ];
      
      // Pick 3 random distinct elements, but sort them by their real-world scale
      const selection = [...tallItems]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .sort((a, b) => b.baseLen - a.baseLen); // Tallest to shortest

      // Give them a small localized random offset so lengths aren't always hardcoded
      componentData.items = selection.map(item => {
        const variance = Math.random() > 0.5 ? 1 : 0;
        return {
          label: `Tall ${item.name}`,
          length: item.baseLen + variance
        };
      });

      const lengths = componentData.items.map(i => i.length);
      const isAskingTallest = Math.random() > 0.5;
      const targetHeight = isAskingTallest ? Math.max(...lengths) : Math.min(...lengths);
      const targetItem = componentData.items.find(i => i.length === targetHeight);

      promptObject.content = {
        questionText: `Look at the pictures standing on the ground floor. Which one is the ${isAskingTallest ? 'tallest' : 'shortest'}?`,
        options: componentData.items.map(i => i.label),
        finalAnswer: targetItem.label, 
        solutionSteps: `Since they are all standing on the same ground floor level, we look at their tops. The ${targetItem.label} reaches ${targetHeight} ${selectedUnit.name} high, making it the ${isAskingTallest ? 'tallest' : 'shortest'}.`
      };
      
      seedInstructions = `Target objective: Identify the height extreme. Find the ${isAskingTallest ? 'TALLEST' : 'SHORTEST'}. True answer: "${targetItem.label}".`;
      break;
    }

    case 'standard_ordering_ascending': {
      commonMeta.heuristic = 'Length Sequencing Ascending';
      const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3);
      const lengths = [4, 6, 9]; // Fixed sizes to make ordering distinct
      const itemsArr = selection.map((name, idx) => ({ label: name, length: lengths[idx] })).sort(() => 0.5 - Math.random());
      
      const ascendingOrder = [...itemsArr].sort((a, b) => a.length - b.length).map(i => i.label);
      const correctSequenceStr = ascendingOrder.join(" ➔ ");

      componentData.items = itemsArr;
      promptObject.content = {
        questionText: "Arrange the objects in order from shortest to longest.",
        options: [
          correctSequenceStr,
          [...ascendingOrder].reverse().join(" ➔ "),
          `${ascendingOrder[1]} ➔ ${ascendingOrder[0]} ➔ ${ascendingOrder[2]}`
        ].sort(() => 0.5 - Math.random()),
        finalAnswer: correctSequenceStr,
        solutionSteps: `Let's count each object's blocks: ${itemsArr.map(i => `${i.label} is ${i.length} units`).join(', ')}. Putting them in order from shortest to longest gives: ${correctSequenceStr}.`
      };
      seedInstructions = `Target objective: Sequence items from SHORTEST to LONGEST. True answer combo option string: "${correctSequenceStr}".`;
      break;
    }

    case 'standard_ordering_descending': {
      commonMeta.heuristic = 'Length Sequencing Descending';
      const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3);
      const lengths = [3, 6, 8];
      const itemsArr = selection.map((name, idx) => ({ label: name, length: lengths[idx] })).sort(() => 0.5 - Math.random());
      
      const descendingOrder = [...itemsArr].sort((a, b) => b.length - a.length).map(i => i.label);
      const correctSequenceStr = descendingOrder.join(" ➔ ");

      componentData.items = itemsArr;
      promptObject.content = {
        questionText: "Arrange the objects in order from longest to shortest.",
        options: [
          correctSequenceStr,
          [...descendingOrder].reverse().join(" ➔ "),
          `${descendingOrder[1]} ➔ ${descendingOrder[2]} ➔ ${descendingOrder[0]}`
        ].sort(() => 0.5 - Math.random()),
        finalAnswer: correctSequenceStr,
        solutionSteps: `Counting their blocks: ${itemsArr.map(i => `${i.label} is ${i.length} units`).join(', ')}. Sorting them from longest to shortest gives: ${correctSequenceStr}.`
      };
      seedInstructions = `Target objective: Sequence items from LONGEST to SHORTEST. True answer combo option string: "${correctSequenceStr}".`;
      break;
    }

    case 'standard_transitive_logic': {
      commonMeta.heuristic = 'Transitive Deduction';
      const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3);
      const labels = selection.map((name, i) => `${name} ${String.fromCharCode(65 + i)}`);
      const distractor = itemsPool.find(i => !selection.includes(i)) + " D";

      // Underlying secret values: A(8) > B(5) > C(3)
      componentData.items = [{ label: labels[0], length: 8 }, { label: labels[1], length: 5 }, { label: labels[2], length: 3 }];
      
      const askLongest = Math.random() > 0.5;
      promptObject.content = {
        questionText: `Read carefully:\n- ${labels[0]} is longer than ${labels[1]}.\n- ${labels[1]} is longer than ${labels[2]}.\n\nWhich object is the ${askLongest ? 'longest' : 'shortest'}?`,
        options: [...labels, distractor].sort(() => 0.5 - Math.random()),
        finalAnswer: askLongest ? labels[0] : labels[2],
        solutionSteps: `If ${labels[0]} is longer than ${labels[1]}, and ${labels[1]} is longer than ${labels[2]}, then ${labels[0]} is the biggest and ${labels[2]} is the smallest. The ${askLongest ? 'longest' : 'shortest'} is ${askLongest ? labels[0] : labels[2]}.`
      };
      seedInstructions = `Target objective: Transitive deduction reasoning. Find the ${askLongest ? 'LONGEST (' + labels[0] + ')' : 'SHORTEST (' + labels[2] + ')'}.`;
      break;
    }

    case 'standard_baseline_error_check': {
      commonMeta.heuristic = 'Anomaly Evaluation';
      
      const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 2);
      
      // ✅ RANDOMIZATION LOGIC: 
      // Pencil/Object A starts at 0. Length ranges from 4 to 6 units.
      const lenA = Math.floor(Math.random() * 3) + 4; 
      
      // Object B is pushed forward. Its startOffset ranges from 2 to 3.
      const offsetB = Math.floor(Math.random() * 2) + 2; 
      
      // Object B's actual physical length is shorter than A by 1 or 2 units.
      const lenB = lenA - (Math.floor(Math.random() * 2) + 1); 
      
      // This math guarantees that (lenB + offsetB) > lenA, 
      // meaning Object B's right tip WILL ALWAYS stick out further than A!
      componentData.items = [
        { label: `${selection[0]} A`, length: lenA },
        { label: `${selection[1]} B`, length: lenB, startOffset: offsetB }
      ];
      componentData.unitIcon = "🧱";

      promptObject.content = {
        questionText: `Look closely at the image alignment. Can we say ${selection[1]} B is longer than ${selection[0]} A simply because its right edge sticks out further?`,
        options: [
          "No, because they do not start at the same baseline.",
          "Yes, because its tip is further to the right.",
          "Yes, because it uses more blocks underneath.",
          "Yes, because it is a different color." // Added distractor for 4 options
        ].sort(() => 0.5 - Math.random()), // Shuffle options
        finalAnswer: "No, because they do not start at the same baseline.",
        solutionSteps: `To compare lengths directly, objects must start at the exact same baseline line. Since ${selection[1]} B was pushed forward by ${offsetB} blocks, a direct visual edge comparison is incorrect.`
      };
      seedInstructions = `Target objective: Baseline error handling. True choice string: "No, because they do not start at the same baseline."`;
      break;
    }

    case 'standard_as_long_as': {
      commonMeta.heuristic = 'Equality Mapping';
      
      // 1. Pick 3 random items from the pool for the visual display
      const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3);
      const baseLen = 6;
      const variantLen = 4;
      
      // 2. Explicitly define structural pairs so the reference item ALWAYS has a twin
      const referenceItem = { label: selection[0], length: baseLen };
      const matchingTwin = { label: selection[1], length: baseLen };
      const wrongItem = { label: selection[2], length: variantLen };

      // Shuffle them into the rendering component data safely
      componentData.items = [referenceItem, matchingTwin, wrongItem].sort(() => 0.5 - Math.random());

      // 3. Robustly build exactly 4 unique MCQ options to fulfill systemic constraints
      const optionsSet = new Set([matchingTwin.label]);
      
      while (optionsSet.size < 4) {
        const randomDistractor = itemsPool[Math.floor(Math.random() * itemsPool.length)];
        // Do not include the reference item itself as an option to keep the question intuitive
        if (randomDistractor !== referenceItem.label) {
          optionsSet.add(randomDistractor);
        }
      }

      promptObject.content = {
        questionText: `Look at the ${referenceItem.label}. Which object is as long as the ${referenceItem.label}?`,
        options: Array.from(optionsSet).sort(() => 0.5 - Math.random()),
        finalAnswer: matchingTwin.label,
        solutionSteps: `Objects that are 'as long as' each other must have the same number of units. Both the ${referenceItem.label} and the ${matchingTwin.label} are exactly ${baseLen} blocks long.`
      };
      
      seedInstructions = `Target objective: Find equal partner matching item name. True answer: "${matchingTwin.label}".`;
      break;
    }

    case 'standard_unit_difference_mcq': {
      commonMeta.heuristic = 'Unit Translation Arithmetic';
      const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 2);
      const len1 = 8;
      const len2 = 5;
      const diff = len1 - len2;

      componentData.items = [
        { label: selection[0], length: len1 },
        { label: selection[1], length: len2 }
      ];

      promptObject.content = {
        questionText: `How many ${selectedUnit.name} longer is the ${selection[0]} than the ${selection[1]}?`,
        options: [String(diff), String(len1), String(len2), String(len1 + len2)],
        finalAnswer: String(diff),
        solutionSteps: `The ${selection[0]} is ${len1} ${selectedUnit.name}. The ${selection[1]} is ${len2} ${selectedUnit.name}. Subtract to find the difference: ${len1} - ${len2} = ${diff} ${selectedUnit.name}.`
      };
      seedInstructions = `Target objective: Extract spatial difference subtraction value. True answer string: "${diff}".`;
      break;
    }

    case 'standard_mid_grid_alignment': {
      commonMeta.heuristic = 'Floating Grids';
      
      const selectedItem = itemsPool[Math.floor(Math.random() * itemsPool.length)];
      
      // ✅ RANDOMIZATION LOGIC:
      // Randomize the starting block marker (position 1 to 4)
      const startMarker = Math.floor(Math.random() * 4) + 1;
      // Randomize the actual unit length of the floating item (3 to 5 units long)
      const actualLength = Math.floor(Math.random() * 3) + 3;
      // Calculate the absolute ending marker on the ruler scale
      const endMarker = startMarker + actualLength;

      componentData.items = [
        { 
          label: `Floating ${selectedItem}`, 
          length: actualLength,
          startOffset: startMarker 
        }
      ];
      
      // Generate logical dynamic distractors close to the real answer string value
      const optionsSet = new Set([
        String(actualLength),
        String(endMarker),
        String(startMarker),
        String(endMarker + 1)
      ]);
      
      promptObject.content = {
        // ✅ DYNAMIC QUESTION STRING: Injects the calculated positions directly into the prompt narrative text
        questionText: `Look at the ${selectedItem.toLowerCase()}. It starts at the ${startMarker} block marker and ends at the ${endMarker} block marker. How many units long is the ${selectedItem.toLowerCase()}?`,
        options: Array.from(optionsSet).sort(() => 0.5 - Math.random()),
        finalAnswer: String(actualLength),
        solutionSteps: `When an object does not start at zero, calculate its true length by subtracting the starting marker position from the ending marker position: ${endMarker} - ${startMarker} = ${actualLength} units.`
      };
      seedInstructions = `Target objective: Floating offset grid arithmetic deduction. True answer string: "${actualLength}".`;
      break;
    }

    default: { // standard_baseline_comparison default fallback
      commonMeta.heuristic = 'Direct Comparison Extreme';
      const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3);
      const lengths = [4, 7, 9].sort(() => 0.5 - Math.random());

      componentData.items = selection.map((name, idx) => ({ label: name, length: lengths[idx] }));
      const maxIdx = lengths.indexOf(Math.max(...lengths));
      const longestObject = selection[maxIdx];

      promptObject.content = {
        questionText: "Look at the items aligned to the wall line. Which object is the longest?",
        options: selection,
        finalAnswer: longestObject,
        solutionSteps: `All objects share the exact same starting line on the left. Looking across to the right edge, the ${longestObject} measures ${lengths[maxIdx]} blocks long, making it the longest.`
      };
      seedInstructions = `Target objective: Identify the longest object. True answer string choice: "${longestObject}".`;
      break;
    }
  }

  // Assign unified spatial configurations
  promptObject.visualEngine.componentData = componentData;

  const instructions = `
    TASK: Generate a Primary 1 Multiple Choice Length comparison question.
    VARIANT KEY REFERENCE: ${activeVariant}
    PEDAGOGY: Strictly follow non-standard metrics rules. Absolutely NO centimeters (cm) or meters (m). Keep descriptions accessible for a 6-year-old child.
    
    CRITICAL PROMPT SEED CONSTRAINTS:
    - ${seedInstructions}
    - You MUST NEVER change the names, lengths, or order arrays inside visualEngine.componentData items.
    - Your generated options elements array and finalAnswer string property must strictly match the calculation values seeded above.
    
    OUTPUT STRUCTURE MANDATE: Return ONLY a valid, parseable JSON object matching this structural blueprint pattern. Do not wrap in markdown backticks or block formatting strings.
    ${JSON.stringify(promptObject)}
  `.trim();

  return { aiPrompt: instructions, parseResponse: (json) => json };
}