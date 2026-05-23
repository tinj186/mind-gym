/**
 * Advanced: Operational logic with non-standard units.
 * PATH: src/lib/syllabus/math/primary-1/measurement/length/advanced.js
 */
export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Length', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1', heuristic: 'Indirect Operational Logic' };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  const itemsPool = ["Cutter", "Highlighter", "Pen", "Pencil", "Usbdrive"];
  const units = [
    { name: "paperclips", icon: "paperclip.svg" },
    { name: "paperpins", icon: "paperpin.svg" },
  ];

  const selectedUnit = units[Math.floor(Math.random() * units.length)];
  let componentData = { items: [], unitIcon: selectedUnit.icon };
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender: "MEASUREMENT_UNIT" }, inputRequirement: { inputType } };
  let seedInstructions = "";

  // Shuffle tool utility for dynamic option placement
  const getShuffledOptions = (correct, distractors) => {
    return [correct, ...distractors]
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort(() => Math.random() - 0.5);
  };

  // 🎛️ ADVANCED VARIANT ROUTING SWITCH ENGINE
  switch (activeVariant) {
    case 'advanced_indirect_comparison': {
      commonMeta.heuristic = 'Transitive Deduction';
      const shuffledItems = [...itemsPool].sort(() => Math.random() - 0.5);
      const item1 = shuffledItems[0];
      const item2 = shuffledItems[1];
      const item3 = shuffledItems[2];

      const lenA = 9;
      const lenB = 6;
      const lenC = 4;

      componentData.items = [
        { label: item1, length: lenA },
        { label: item2, length: lenB },
        { label: item3, length: lenC }
      ].sort(() => Math.random() - 0.5);

      const findShortest = Math.random() > 0.5;
      const finalAnswer = findShortest ? item3 : item1;

      const distractors = itemsPool.filter(i => ![item1, item2, item3].includes(i)).slice(0, 1);

      promptObject.content = {
        questionText: `[Narrate Transitive Comparison: Object ${item1} is longer than ${item2}. Object ${item2} is longer than ${item3}. Which object is the ${findShortest ? 'shortest' : 'longest'}?]`,
        finalAnswer,
        options: isMCQ ? getShuffledOptions(finalAnswer, [item1, item2, item3, ...distractors]) : null,
        solutionSteps: `Comparing the sequence dimensions: ${item1} (${lenA} units) > ${item2} (${lenB} units) > ${item3} (${lenC} units). The target is ${finalAnswer}.`
      };
      seedInstructions = `Deduce sequence hierarchy. Target: ${findShortest ? 'SHORTEST' : 'LONGEST'}. Correct Answer: ${finalAnswer}.`;
      break;
    }

    case 'advanced_misaligned_start': {
      commonMeta.heuristic = 'Interval Offset Reading';
      const targetObj = itemsPool[Math.floor(Math.random() * itemsPool.length)];
      const startOffset = Math.floor(Math.random() * 3) + 2; // Starts at 2, 3, or 4
      const trueLength = Math.floor(Math.random() * 4) + 4;  // Length between 4 and 7
      const endPoint = startOffset + trueLength;

      componentData.items = [{ label: targetObj, length: trueLength, startOffset }];
      
      promptObject.content = {
        questionText: `[Formulate Baseline Offset Question: The ${targetObj} starts at the ${startOffset} unit line and ends at the ${endPoint} unit line. What is its true length in ${selectedUnit.name}?]`,
        finalAnswer: String(trueLength),
        options: isMCQ ? getShuffledOptions(String(trueLength), [String(endPoint), String(startOffset), String(trueLength + 1)]) : null,
        solutionSteps: `Subtract the starting line mark from the ending line mark: ${endPoint} - ${startOffset} = ${trueLength} ${selectedUnit.name}.`
      };
      seedInstructions = `Object starts layout shifted at interval marker ${startOffset} and ends at marker ${endPoint}. True length is ${trueLength}.`;
      break;
    }

    case 'advanced_unit_size_inverse': {
      commonMeta.heuristic = 'Inverse Proportional Logic';
      const targetObj = itemsPool[Math.floor(Math.random() * itemsPool.length)];
      const baseCount = Math.floor(Math.random() * 3) + 5; // 5 to 7

      componentData.items = [{ label: targetObj, length: baseCount }];

      promptObject.content = {
        questionText: `[Formulate Inverse Unit Comparison: Measuring a ${targetObj} takes ${baseCount} small ${selectedUnit.name}. If we switch to a longer unit, will the total count needed be more, fewer, or the same?]`,
        finalAnswer: 'Fewer',
        options: ['More', 'Fewer', 'The same', 'Cannot tell'],
        solutionSteps: `Larger units cover more space individually, meaning fewer of them are required to measure the exact same object length.`
      };
      seedInstructions = `Evaluate scaling sizes conceptually. Correct selection outcome option string is strictly 'Fewer'.`;
      break;
    }

    case 'advanced_combined_total': {
      commonMeta.heuristic = 'Additive Composition';
      const shuffledItems = [...itemsPool].sort(() => Math.random() - 0.5);
      const lenA = Math.floor(Math.random() * 3) + 4;
      const lenB = Math.floor(Math.random() * 3) + 3;
      const combinedTotal = lenA + lenB;

      componentData.items = [
        { label: shuffledItems[0], length: lenA },
        { label: shuffledItems[1], length: lenB }
      ];

      promptObject.content = {
        questionText: `[Formulate Composite Total Question: If the ${shuffledItems[0]} and ${shuffledItems[1]} are placed end-to-end, what is their combined total length?]`,
        finalAnswer: String(combinedTotal),
        options: isMCQ ? getShuffledOptions(String(combinedTotal), [String(combinedTotal - 1), String(combinedTotal + 2), String(lenA)]) : null,
        solutionSteps: `Add both component item metrics together: ${lenA} + ${lenB} = ${combinedTotal} ${selectedUnit.name}.`
      };
      seedInstructions = `Find sum length of compound structural layout tracker elements: ${lenA} + ${lenB} = ${combinedTotal}.`;
      break;
    }

    case 'advanced_overlap_deduction': {
      commonMeta.heuristic = 'Nested Overlap Math';
      const shuffledItems = [...itemsPool].sort(() => Math.random() - 0.5);
      const lenA = 8;
      const lenB = 6;
      const overlap = Math.floor(Math.random() * 2) + 2; // Overlap of 2 or 3
      const visibleTotal = lenA + lenB - overlap;

      componentData.items = [
        { label: shuffledItems[0], length: lenA },
        { label: shuffledItems[1], length: lenB }
      ];

      promptObject.content = {
        questionText: `[Formulate Overlap Deduction Narrative: Object ${shuffledItems[0]} (${lenA} units) and Object ${shuffledItems[1]} (${lenB} units) overlap when joined. If the total combined layout length is ${visibleTotal} units, how long is the overlapping section?]`,
        finalAnswer: String(overlap),
        options: isMCQ ? getShuffledOptions(String(overlap), [String(overlap + 1), String(overlap - 1), '4']) : null,
        solutionSteps: `Sum individual lengths (${lenA} + ${lenB} = ${lenA + lenB}) then subtract total visible covered length (${lenA + lenB} - ${visibleTotal} = ${overlap} units).`
      };
      seedInstructions = `Calculate segment overlap boundary intersection dimensions. True answer value evaluated is ${overlap}.`;
      break;
    }

    case 'advanced_multi_step_word_problems': {
      commonMeta.heuristic = 'Sequential Transformation Logic';
      const targetObj = itemsPool[Math.floor(Math.random() * itemsPool.length)];
      const baseLen = 10;
      const subtractAmt = 3;
      const additionAmt = 4;
      const currentNetLength = baseLen - subtractAmt + additionAmt;

      componentData.items = [{ label: targetObj, length: currentNetLength }];

      promptObject.content = {
        questionText: `[Formulate Multi-Step Story Problem: A craft string was originally ${baseLen} units long. ${subtractAmt} units were cut off, and then an extension piece of ${additionAmt} units was added. How long is it now?]`,
        finalAnswer: String(currentNetLength),
        options: isMCQ ? getShuffledOptions(String(currentNetLength), [String(baseLen), String(baseLen - subtractAmt), String(currentNetLength - 2)]) : null,
        solutionSteps: `Execute multi-part calculations: First subtract cut segment (${baseLen} - ${subtractAmt} = ${baseLen - subtractAmt}), then aggregate extension (${baseLen - subtractAmt} + ${additionAmt} = ${currentNetLength} units).`
      };
      seedInstructions = `Process sequence conversions sequentially: ${baseLen} minus ${subtractAmt} plus ${additionAmt} = ${currentNetLength}.`;
      break;
    }

    case 'advanced_part_whole_missing': {
      commonMeta.heuristic = 'Subtractive Decomposition';
      const shuffledItems = [...itemsPool].sort(() => Math.random() - 0.5);
      const completeWhole = 12;
      const partA = Math.floor(Math.random() * 3) + 4; // 4 to 6
      const partB = completeWhole - partA;

      componentData.items = [
        { label: `${shuffledItems[0]} (Whole)`, length: completeWhole },
        { label: `${shuffledItems[1]} (Part 1)`, length: partA }
      ];

      promptObject.content = {
        questionText: `[Formulate Part-Whole Missing Segment Question: The total combined structure length is ${completeWhole} units. If Part A measures ${partA} units, what is the length of missing Part B?]`,
        finalAnswer: String(partB),
        options: isMCQ ? getShuffledOptions(String(partB), [String(partB + 2), String(partB - 1), String(partA)]) : null,
        solutionSteps: `Isolate missing compound structural component: Total (${completeWhole}) - Given Part (${partA}) = ${partB} ${selectedUnit.name}.`
      };
      seedInstructions = `Subtract minor structural part matrix from master total: ${completeWhole} - ${partA} = ${partB}.`;
      break;
    }

    case 'advanced_excess_comparison': {
      commonMeta.heuristic = 'Deficit Target Benchmarking';
      const shuffledItems = [...itemsPool].sort(() => Math.random() - 0.5);
      const currentLength = Math.floor(Math.random() * 3) + 4; // 4 to 6
      const targetThreshold = 10;
      const missingDeficit = targetThreshold - currentLength;

      componentData.items = [
        { label: shuffledItems[0], length: currentLength },
        { label: "Target Marker", length: targetThreshold }
      ];

      promptObject.content = {
        questionText: `[Formulate Capacity Deficit Question: The ${shuffledItems[0]} is currently ${currentLength} units long. How many more ${selectedUnit.name} must be added to make it exactly ${targetThreshold} units long?]`,
        finalAnswer: String(missingDeficit),
        options: isMCQ ? getShuffledOptions(String(missingDeficit), [String(missingDeficit + 1), String(currentLength), String(targetThreshold)]) : null,
        solutionSteps: `Calculate the space gap delta to hit the benchmark: ${targetThreshold} - ${currentLength} = ${missingDeficit} units required.`
      };
      seedInstructions = `Evaluate dimensional capacity requirements needed to match target limits: ${targetThreshold} - ${currentLength} = ${missingDeficit}.`;
      break;
    }

    case 'advanced_perimeter_units': {
      commonMeta.heuristic = 'Open Boundary Path Accumulation';
      const targetShape = "Grid Frame Path";
      const side1 = 3;
      const side2 = 4;
      const side3 = 3;
      const cumulativePerimeter = side1 + side2 + side3;

      componentData.items = [{ label: targetShape, length: cumulativePerimeter }];

      promptObject.content = {
        questionText: `[Formulate Open Border Perimeter Question: Find the cumulative length around this 3-sided track frame map if the segments measure ${side1}, ${side2}, and ${side3} units respectively.]`,
        finalAnswer: String(cumulativePerimeter),
        options: isMCQ ? getShuffledOptions(String(cumulativePerimeter), [String(cumulativePerimeter - 1), String(side1 + side2), '12']) : null,
        solutionSteps: `Accumulate the composite vector sides around boundary paths: ${side1} + ${side2} + ${side3} = ${cumulativePerimeter} units.`
      };
      seedInstructions = `Total perimeter accumulation along multi-sided open grids equal to: ${cumulativePerimeter}.`;
      break;
    }

    default: // advanced_indirect_difference (Original Baseline)
      commonMeta.heuristic = 'Indirect Operational Logic';
      const lengthA = Math.floor(Math.random() * 4) + 6; 
      const difference = Math.floor(Math.random() * 3) + 2; 
      const isShorter = Math.random() > 0.5;
      const lengthB = isShorter ? (lengthA - difference) : (lengthA + difference);

      const items = [...itemsPool].sort(() => Math.random() - 0.5).map((name, i) => `${name} ${String.fromCharCode(65 + i)}`);
      const item1 = items[0];
      const item2 = items[1];

      componentData.items = [
        { label: item1, length: lengthA },
        { label: item2, length: lengthB }
      ];

      promptObject.content = {
        questionText: `[Insert structured word problem: ${item1} is ${lengthA} ${selectedUnit.name} long. ${item2} is ${difference} ${selectedUnit.name} ${isShorter ? 'shorter' : 'longer'} than ${item1}. How many ${selectedUnit.name} long is ${item2}?]`,
        finalAnswer: String(lengthB),
        options: isMCQ ? getShuffledOptions(String(lengthB), [String(lengthA), String(lengthA + difference), String(Math.max(1, lengthB - 2))]) : null,
        solutionSteps: `[Provide child-friendly breakdown: ${lengthA} ${isShorter ? '-' : '+'} ${difference} = ${lengthB} ${selectedUnit.name}]`
      };
      seedInstructions = `Target objective: Calculate missing relative distance dimensions. True answer: ${lengthB}.`;
      break;
  }

  // Assign generated payload properties globally
  promptObject.visualEngine.componentData = componentData;

  const constitution = isShort 
    ? "SHORT QUESTION MANDATE: Pure mathematical logic only. Keep questionText extremely direct (e.g., 'Item A is 6 units. Item B is 2 units longer. How long is Item B?'). NO character names or fluff." 
    : "STANDARD MANDATE: Use localized story elements for a 6-year-old (e.g., 'Siti has a ribbon...'). Keep sentences short.";

  const instructions = `
    TASK: Generate an advanced Primary 1 structured word problem tracking compound positional lengths using non-standard units.
    VARIANT: ${activeVariant}
    
    STRICT GENERATOR CONSTRAINTS:
    - ${seedInstructions}
    - The structural data inside visualEngine items array must remain exactly as seeded.
    - Ensure your question narrative text and finalAnswer perfectly synchronize with these calculation numbers.
    - ${constitution}
    
    Return ONLY clean, valid JSON format.
    ${JSON.stringify(promptObject)}
  `.trim();

  return { aiPrompt: instructions, parseResponse: (json) => json };
}