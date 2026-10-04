export function standardLogic(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getRandomInt, { getRandomNames }) {
  let visualEngineStr = "";
  let inputRequirementStr = "";
  let systemPrompt = "";

  if (activeVariant === 'standard_right_angle_turns') {
    const completeTurns = getRandomInt(1, 4);
    const halfTurns = getRandomInt(1, 5);
    const rightFromComplete = completeTurns * 4;
    const rightFromHalf = halfTurns * 2;
    const total = rightFromComplete + rightFromHalf;
    const target = getRandomInt(0, 2); // 0=find total, 1=find half turns, 2=find complete turns
    const name1 = getRandomNames()[0];
    const items = ['toy robot', 'toy car', 'spinning top', 'remote control boat'];
    const item = items[getRandomInt(0, items.length - 1)];

    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = [];

    if (target === 0) { // Find total
      askText = `STORY: A ${item} is programmed to spin on the floor. It makes exactly ${completeTurns} complete turns and ${halfTurns} half turns. Knowing that 1 complete turn is 4 right angles and a half turn is 2 right angles, calculate the total number of right angles the ${item} turned through.`;
      finalAns = `${total}`;
      hintStr = `Multiply complete turns by 4 and half turns by 2, then add them together.`;
      solutionStr = `1. Right angles from complete turns = ${completeTurns} x 4 = ${rightFromComplete}.\\n2. Right angles from half turns = ${halfTurns} x 2 = ${rightFromHalf}.\\n3. Total right angles = ${rightFromComplete} + ${rightFromHalf} = ${total}.`;
      stepsArr = [
        { label: `Write the working equation to find the number of right angles in the ${completeTurns} complete turns:`, expectedAnswer: `${completeTurns} x 4 = ${rightFromComplete}`, acceptedAnswers: [`4 x ${completeTurns} = ${rightFromComplete}`] },
        { label: `Write the working equation to find the number of right angles in the ${halfTurns} half turns:`, expectedAnswer: `${halfTurns} x 2 = ${rightFromHalf}`, acceptedAnswers: [`2 x ${halfTurns} = ${rightFromHalf}`] },
        { label: `Write the working equation to find the total number of right angles turned:`, expectedAnswer: `${rightFromComplete} + ${rightFromHalf} = ${total}`, acceptedAnswers: [`${rightFromHalf} + ${rightFromComplete} = ${total}`] },
        { label: `Total right angles:`, expectedAnswer: `${total}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${total}"`, `"${total + 2}"`, `"${total - 2}"`, `"${total + 4}"`];
    } else if (target === 1) { // Find half turns
      askText = `STORY: A ${item} turns through a total of ${total} right angles. Knowing that 1 complete turn is 4 right angles and a half turn is 2 right angles, if it made exactly ${completeTurns} complete turns, how many half turns did it make?`;
      finalAns = `${halfTurns}`;
      hintStr = `Find the right angles from complete turns, subtract from total, then divide the remainder by 2.`;
      solutionStr = `1. Right angles from complete turns = ${completeTurns} x 4 = ${rightFromComplete}.\\n2. Remaining right angles = ${total} - ${rightFromComplete} = ${rightFromHalf}.\\n3. Number of half turns = ${rightFromHalf} ÷ 2 = ${halfTurns}.`;
      stepsArr = [
        { label: `Write the working equation to find the number of right angles in the ${completeTurns} complete turns:`, expectedAnswer: `${completeTurns} x 4 = ${rightFromComplete}`, acceptedAnswers: [`4 x ${completeTurns} = ${rightFromComplete}`] },
        { label: `Write the working equation to subtract the complete turn angles from the total angles:`, expectedAnswer: `${total} - ${rightFromComplete} = ${rightFromHalf}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the number of half turns:`, expectedAnswer: `${rightFromHalf} ÷ 2 = ${halfTurns}`, acceptedAnswers: [`${rightFromHalf} / 2 = ${halfTurns}`] },
        { label: `Number of half turns:`, expectedAnswer: `${halfTurns}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${halfTurns}"`, `"${halfTurns + 1}"`, `"${halfTurns - 1 > 0 ? halfTurns - 1 : halfTurns + 2}"`, `"${halfTurns + 2}"`];
    } else { // Find complete turns
      askText = `STORY: A ${item} turns through a total of ${total} right angles. Knowing that 1 complete turn is 4 right angles and a half turn is 2 right angles, if it made exactly ${halfTurns} half turns, how many complete turns did it make?`;
      finalAns = `${completeTurns}`;
      hintStr = `Find the right angles from half turns, subtract from total, then divide the remainder by 4.`;
      solutionStr = `1. Right angles from half turns = ${halfTurns} x 2 = ${rightFromHalf}.\\n2. Remaining right angles = ${total} - ${rightFromHalf} = ${rightFromComplete}.\\n3. Number of complete turns = ${rightFromComplete} ÷ 4 = ${completeTurns}.`;
      stepsArr = [
        { label: `Write the working equation to find the number of right angles in the ${halfTurns} half turns:`, expectedAnswer: `${halfTurns} x 2 = ${rightFromHalf}`, acceptedAnswers: [`2 x ${halfTurns} = ${rightFromHalf}`] },
        { label: `Write the working equation to subtract the half turn angles from the total angles:`, expectedAnswer: `${total} - ${rightFromHalf} = ${rightFromComplete}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the number of complete turns:`, expectedAnswer: `${rightFromComplete} ÷ 4 = ${completeTurns}`, acceptedAnswers: [`${rightFromComplete} / 4 = ${completeTurns}`] },
        { label: `Number of complete turns:`, expectedAnswer: `${completeTurns}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${completeTurns}"`, `"${completeTurns + 1}"`, `"${completeTurns - 1 > 0 ? completeTurns - 1 : completeTurns + 2}"`, `"${completeTurns + 2}"`];
    }

    visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \[[^\]]+\] /, 'Someone ').replace('STORY: ', '')}"`}
- For content.finalAnswer, use: "${finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
${isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : ''}`;

  } else if (activeVariant === 'standard_capital_letters') {
    const lettersData = {
      'E': { rightAngles: 4 },
      'F': { rightAngles: 3 },
      'H': { rightAngles: 4 },
      'L': { rightAngles: 1 },
      'T': { rightAngles: 2 },
      'A': { rightAngles: 0 },
      'K': { rightAngles: 0 },
      'M': { rightAngles: 0 },
      'N': { rightAngles: 0 },
      'V': { rightAngles: 0 },
      'W': { rightAngles: 0 },
      'X': { rightAngles: 0 },
      'Y': { rightAngles: 0 },
      'Z': { rightAngles: 0 }
    };

    const words = [
      'TEA', 'HAT', 'FAT', 'NET', 'MAN', 'EAT', 'LET', 'MAT', 'VAN', 'YAM', 'TAX', 'WAY', 'HAM', 'HAY', 'ANY', 'KEY', 'TEN', 'MEN', 'NEW', 'LAW',
      'MATH', 'TEAM', 'LATE', 'TENT', 'HALF', 'FALL', 'TALL', 'VENT', 'HEAT', 'LEAF', 'MAKE', 'WAKE', 'YAWN', 'WALK', 'TANK', 'NEXT', 'WHAT', 'THAT', 'THEN', 'THEM', 'MANY', 'TALK', 'WEEK', 'FLAT',
      'HEAVY', 'TEETH', 'TENTH', 'WHALE', 'FLAME', 'VALVE', 'KNEEL', 'ANKLE', 'LEAVE', 'EVENT'
    ];
    const word = words[getRandomInt(0, words.length - 1)];
    const chars = word.split('');
    let total = 0;
    let stepExplanation = "";
    let stepWorking = "";
    let mathEquation = "";
    
    chars.forEach((c, index) => {
      total += lettersData[c].rightAngles;
      stepExplanation += `The letter ${c} has ${lettersData[c].rightAngles} right angles. `;
      mathEquation += `${lettersData[c].rightAngles}`;
      if (index < chars.length - 1) {
        mathEquation += " + ";
      }
    });
    
    const expectedMathEquation = `${mathEquation} = ${total}`;
    
    const askText = `STORY: Look at the word "${word}" written in capital letters. Calculate the total number of right angles in the entire word.`;
    
    // Not explicitly defined rendering. But prompt says "Showing the block letters with intersections marked." 
    // We can't render letters with our current visualizer, so we will use NONE or basic shapes. Better to use NONE.
    visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Write the working equation to add the right angles together:`, expectedAnswer: expectedMathEquation, acceptedAnswers: [] },
          { label: `Total right angles:`, expectedAnswer: `${total}`, acceptedAnswers: [] }
        ]
      });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "How many right angles are inside the word \\"${word}\\"?"`}
- For content.finalAnswer, use: "${total}"
- For content.hint, use: "Add the number of right angles for each letter together."
- For content.solutionSteps, use: """${stepExplanation.trim()}\\nTotal right angles = ${expectedMathEquation}."""
${isMCQ ? `Generate EXACTLY 4 options:
- "${total}"
- "${total + 1}"
- "${total + 2 > 0 ? total + 2 : 5}"
- "${total > 1 ? total - 1 : 4}"` : ''}`;

  } else if (activeVariant === 'standard_scaling_polygon_angles') {
    const polygonTypes = [
      { name: "triangle", angles: 3, isRight: false },
      { name: "square", angles: 4, isRight: true },
      { name: "5-sided shape", angles: 5, isRight: false },
      { name: "6-sided shape", angles: 6, isRight: false }
    ];
    const shape = polygonTypes[getRandomInt(0, polygonTypes.length - 1)];
    const initialShapes = getRandomInt(4, 9);
    const initialTotalAngles = initialShapes * shape.angles;
    const isAdding = getRandomInt(0, 1) === 0;
    
    let changeShapes = 0;
    if (isAdding) {
      changeShapes = getRandomInt(2, 5);
    } else {
      changeShapes = getRandomInt(1, initialShapes - 1);
    }
    
    const finalShapes = isAdding ? initialShapes + changeShapes : initialShapes - changeShapes;
    const finalTotalAngles = finalShapes * shape.angles;
    
    const name1 = getRandomNames()[0];
    const location = isAdding ? "adds" : "removes";
    const actionLabel = isAdding ? "adding" : "taking away";
    const mathSign = isAdding ? "+" : "-";
    
    let askText = "";
    let hintStr = "";
    let solutionStr = "";
    let finalAns = `${finalTotalAngles}`;
    let stepsArr = [];
    let optionsArr = [];

    const angleWord = shape.isRight ? "right angles" : "angles";

    const target = getRandomInt(0, 2);
    
    if (target === 0) { // Short
      askText = `STORY: A group of ${shape.name}s has ${initialTotalAngles} ${angleWord} in total. If ${changeShapes} ${shape.name}s are ${isAdding ? "added to" : "removed from"} the group, what is the new total number of ${angleWord}?`;
      hintStr = `First find how many ${shape.name}s there were. Then calculate the new number of ${shape.name}s, and multiply by the ${angleWord} per shape.`;
      solutionStr = `1. Starting number of ${shape.name}s = ${initialTotalAngles} ÷ ${shape.angles} = ${initialShapes}.\\n2. New number of ${shape.name}s = ${initialShapes} ${mathSign} ${changeShapes} = ${finalShapes}.\\n3. New total ${angleWord} = ${finalShapes} x ${shape.angles} = ${finalTotalAngles}.`;
      
      stepsArr = [
        { label: `Write the working equation to find the starting number of ${shape.name}s (Total ${angleWord} ÷ ${shape.angles}):`, expectedAnswer: `${initialTotalAngles} ÷ ${shape.angles} = ${initialShapes}`, acceptedAnswers: [`${initialTotalAngles} / ${shape.angles} = ${initialShapes}`] },
        { label: `Write the working equation to find the new number of ${shape.name}s after ${actionLabel} ${changeShapes}:`, expectedAnswer: `${initialShapes} ${mathSign} ${changeShapes} = ${finalShapes}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the new total number of ${angleWord}:`, expectedAnswer: `${finalShapes} x ${shape.angles} = ${finalTotalAngles}`, acceptedAnswers: [`${shape.angles} x ${finalShapes} = ${finalTotalAngles}`] },
        { label: `New total number of ${angleWord}:`, expectedAnswer: `${finalTotalAngles}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${finalTotalAngles}"`, `"${finalTotalAngles + shape.angles}"`, `"${finalTotalAngles - shape.angles}"`, `"${finalTotalAngles + shape.angles * 2}"`];
    } else if (target === 1) { // MCQ
      askText = `STORY: A pile of ${shape.name}s has ${initialTotalAngles} ${angleWord} in total. If ${changeShapes} ${isAdding ? "more" : "fewer"} ${shape.name}s are in the pile, what is the new total number of ${angleWord}?`;
      hintStr = `First find how many ${shape.name}s there were. Then calculate the new number of ${shape.name}s, and multiply by the ${angleWord} per shape.`;
      solutionStr = `1. Starting number of ${shape.name}s = ${initialTotalAngles} ÷ ${shape.angles} = ${initialShapes}.\\n2. New number of ${shape.name}s = ${initialShapes} ${mathSign} ${changeShapes} = ${finalShapes}.\\n3. New total ${angleWord} = ${finalShapes} x ${shape.angles} = ${finalTotalAngles}.`;
      
      stepsArr = [
        { label: `Write the working equation to find the starting number of ${shape.name}s (Total ${angleWord} ÷ ${shape.angles}):`, expectedAnswer: `${initialTotalAngles} ÷ ${shape.angles} = ${initialShapes}`, acceptedAnswers: [`${initialTotalAngles} / ${shape.angles} = ${initialShapes}`] },
        { label: `Write the working equation to find the new number of ${shape.name}s after ${actionLabel} ${changeShapes}:`, expectedAnswer: `${initialShapes} ${mathSign} ${changeShapes} = ${finalShapes}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the new total number of ${angleWord}:`, expectedAnswer: `${finalShapes} x ${shape.angles} = ${finalTotalAngles}`, acceptedAnswers: [`${shape.angles} x ${finalShapes} = ${finalTotalAngles}`] },
        { label: `New total number of ${angleWord}:`, expectedAnswer: `${finalTotalAngles}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${finalTotalAngles}"`, `"${finalTotalAngles + shape.angles}"`, `"${finalTotalAngles - shape.angles}"`, `"${finalTotalAngles + shape.angles * 2}"`];
    } else { // Structure
      askText = `STORY: [${name1}] places a group of identical ${shape.name}s on a board. Together, all the ${shape.name}s have a total of ${initialTotalAngles} ${angleWord}. They then ${isAdding ? "add" : "take away"} ${changeShapes} ${shape.name}s. Calculate the new total number of ${angleWord} on the board.`;
      hintStr = `First find how many ${shape.name}s there were. Then calculate the new number of ${shape.name}s, and multiply by the ${angleWord} per shape.`;
      solutionStr = `1. Starting number of ${shape.name}s = ${initialTotalAngles} ÷ ${shape.angles} = ${initialShapes}.\\n2. New number of ${shape.name}s = ${initialShapes} ${mathSign} ${changeShapes} = ${finalShapes}.\\n3. New total ${angleWord} = ${finalShapes} x ${shape.angles} = ${finalTotalAngles}.`;
      
      stepsArr = [
        { label: `Write the working equation to find the starting number of ${shape.name}s (Total ${angleWord} ÷ ${shape.angles}):`, expectedAnswer: `${initialTotalAngles} ÷ ${shape.angles} = ${initialShapes}`, acceptedAnswers: [`${initialTotalAngles} / ${shape.angles} = ${initialShapes}`] },
        { label: `Write the working equation to find the new number of ${shape.name}s after ${actionLabel} ${changeShapes}:`, expectedAnswer: `${initialShapes} ${mathSign} ${changeShapes} = ${finalShapes}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the new total number of ${angleWord}:`, expectedAnswer: `${finalShapes} x ${shape.angles} = ${finalTotalAngles}`, acceptedAnswers: [`${shape.angles} x ${finalShapes} = ${finalTotalAngles}`] },
        { label: `New total number of ${angleWord}:`, expectedAnswer: `${finalTotalAngles}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${finalTotalAngles}"`, `"${finalTotalAngles + shape.angles}"`, `"${finalTotalAngles - shape.angles}"`, `"${finalTotalAngles + shape.angles * 2}"`];
    }
    
    visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \[[^\]]+\] /, 'Someone ').replace('STORY: ', '')}"`}
- For content.finalAnswer, use: "${finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
${isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : ''}`;

  } else if (activeVariant === 'standard_comparing_groups_polygons') {
    const polygonTypes = [
      { name: "triangle", angles: 3 },
      { name: "square", angles: 4 },
      { name: "rectangle", angles: 4 },
      { name: "pentagon", angles: 5 },
      { name: "hexagon", angles: 6 }
    ];
    
    let shape1Idx = getRandomInt(0, polygonTypes.length - 1);
    let shape2Idx = getRandomInt(0, polygonTypes.length - 1);
    while (shape1Idx === shape2Idx) {
      shape2Idx = getRandomInt(0, polygonTypes.length - 1);
    }
    const shape1 = polygonTypes[shape1Idx];
    const shape2 = polygonTypes[shape2Idx];
    
    let count1 = getRandomInt(3, 8);
    let count2 = getRandomInt(3, 8);
    
    let total1 = count1 * shape1.angles;
    let total2 = count2 * shape2.angles;
    
    // Ensure total1 != total2 to have a difference
    while (total1 === total2) {
      count2 = getRandomInt(3, 8);
      total2 = count2 * shape2.angles;
    }
    
    const maxTotal = Math.max(total1, total2);
    const minTotal = Math.min(total1, total2);
    const diff = maxTotal - minTotal;
    
    const isGroup1Bigger = total1 > total2;
    const biggerGroupShape = isGroup1Bigger ? shape1.name : shape2.name;
    const smallerGroupShape = isGroup1Bigger ? shape2.name : shape1.name;
    const biggerGroupCount = isGroup1Bigger ? count1 : count2;
    const smallerGroupCount = isGroup1Bigger ? count2 : count1;
    const biggerGroupTotal = maxTotal;
    const smallerGroupTotal = minTotal;
    const biggerGroupAngles = isGroup1Bigger ? shape1.angles : shape2.angles;
    const smallerGroupAngles = isGroup1Bigger ? shape2.angles : shape1.angles;
    
    const names = getRandomNames();
    const name1 = names[0];
    const name2 = names[1];

    let askText = "";
    let hintStr = "";
    let solutionStr = "";
    let finalAns = "";
    let stepsArr = [];
    let optionsArr = [];

    const target = getRandomInt(0, 2);
    
    if (target === 0) { // Short
      askText = `STORY: Group A has ${count1} ${shape1.name}s. Group B has ${count2} ${shape2.name}s. How many more angles does the group with more angles have than the other group?`;
      hintStr = `Find the total angles for Group A and Group B, then subtract the smaller total from the larger total.`;
      solutionStr = `1. Group A total angles = ${count1} x ${shape1.angles} = ${total1}.\\n2. Group B total angles = ${count2} x ${shape2.angles} = ${total2}.\\n3. Difference = ${maxTotal} - ${minTotal} = ${diff}.`;
      finalAns = `${diff}`;
      
      stepsArr = [
        { label: `Write the working equation to find the total angles for Group A:`, expectedAnswer: `${count1} x ${shape1.angles} = ${total1}`, acceptedAnswers: [`${shape1.angles} x ${count1} = ${total1}`] },
        { label: `Write the working equation to find the total angles for Group B:`, expectedAnswer: `${count2} x ${shape2.angles} = ${total2}`, acceptedAnswers: [`${shape2.angles} x ${count2} = ${total2}`] },
        { label: `Write the working equation to find the difference in total angles:`, expectedAnswer: `${maxTotal} - ${minTotal} = ${diff}`, acceptedAnswers: [] },
        { label: `Difference in angles:`, expectedAnswer: `${diff}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${diff}"`, `"${diff + 2}"`, `"${diff > 2 ? diff - 2 : diff + 3}"`, `"${diff + 4}"`];
    } else if (target === 1) { // MCQ
      const missingGroupIsBigger = getRandomInt(0, 1) === 1;
      
      if (missingGroupIsBigger) {
        askText = `STORY: Box X contains ${smallerGroupCount} ${smallerGroupShape}s. Box Y contains some ${biggerGroupShape}s. Box Y has exactly ${diff} more angles in total than Box X. How many ${biggerGroupShape}s are in Box Y?`;
        hintStr = `Find the total angles in Box X. Then add the difference to find the total angles in Box Y. Finally, divide by the angles per ${biggerGroupShape}.`;
        solutionStr = `1. Total angles in Box X = ${smallerGroupCount} x ${smallerGroupAngles} = ${smallerGroupTotal}.\\n2. Total angles in Box Y = ${smallerGroupTotal} + ${diff} = ${biggerGroupTotal}.\\n3. Number of ${biggerGroupShape}s = ${biggerGroupTotal} ÷ ${biggerGroupAngles} = ${biggerGroupCount}.`;
        finalAns = `${biggerGroupCount}`;
        
        stepsArr = [
          { label: `Write the working equation to find the total angles in Box X:`, expectedAnswer: `${smallerGroupCount} x ${smallerGroupAngles} = ${smallerGroupTotal}`, acceptedAnswers: [`${smallerGroupAngles} x ${smallerGroupCount} = ${smallerGroupTotal}`] },
          { label: `Write the working equation to find the total angles in Box Y:`, expectedAnswer: `${smallerGroupTotal} + ${diff} = ${biggerGroupTotal}`, acceptedAnswers: [`${diff} + ${smallerGroupTotal} = ${biggerGroupTotal}`] },
          { label: `Write the working equation to find the number of ${biggerGroupShape}s in Box Y:`, expectedAnswer: `${biggerGroupTotal} ÷ ${biggerGroupAngles} = ${biggerGroupCount}`, acceptedAnswers: [`${biggerGroupTotal} / ${biggerGroupAngles} = ${biggerGroupCount}`] },
          { label: `Number of ${biggerGroupShape}s in Box Y:`, expectedAnswer: `${biggerGroupCount}`, acceptedAnswers: [] }
        ];
        optionsArr = [`"${biggerGroupCount}"`, `"${biggerGroupCount + 1}"`, `"${biggerGroupCount > 1 ? biggerGroupCount - 1 : biggerGroupCount + 2}"`, `"${biggerGroupCount + 2}"`];
      } else {
        askText = `STORY: Box X contains ${biggerGroupCount} ${biggerGroupShape}s. Box Y contains some ${smallerGroupShape}s. Box X has exactly ${diff} more angles in total than Box Y. How many ${smallerGroupShape}s are in Box Y?`;
        hintStr = `Find the total angles in Box X. Then subtract the difference to find the total angles in Box Y. Finally, divide by the angles per ${smallerGroupShape}.`;
        solutionStr = `1. Total angles in Box X = ${biggerGroupCount} x ${biggerGroupAngles} = ${biggerGroupTotal}.\\n2. Total angles in Box Y = ${biggerGroupTotal} - ${diff} = ${smallerGroupTotal}.\\n3. Number of ${smallerGroupShape}s = ${smallerGroupTotal} ÷ ${smallerGroupAngles} = ${smallerGroupCount}.`;
        finalAns = `${smallerGroupCount}`;
        
        stepsArr = [
          { label: `Write the working equation to find the total angles in Box X:`, expectedAnswer: `${biggerGroupCount} x ${biggerGroupAngles} = ${biggerGroupTotal}`, acceptedAnswers: [`${biggerGroupAngles} x ${biggerGroupCount} = ${biggerGroupTotal}`] },
          { label: `Write the working equation to find the total angles in Box Y:`, expectedAnswer: `${biggerGroupTotal} - ${diff} = ${smallerGroupTotal}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the number of ${smallerGroupShape}s in Box Y:`, expectedAnswer: `${smallerGroupTotal} ÷ ${smallerGroupAngles} = ${smallerGroupCount}`, acceptedAnswers: [`${smallerGroupTotal} / ${smallerGroupAngles} = ${smallerGroupCount}`] },
          { label: `Number of ${smallerGroupShape}s in Box Y:`, expectedAnswer: `${smallerGroupCount}`, acceptedAnswers: [] }
        ];
        optionsArr = [`"${smallerGroupCount}"`, `"${smallerGroupCount + 1}"`, `"${smallerGroupCount > 1 ? smallerGroupCount - 1 : smallerGroupCount + 2}"`, `"${smallerGroupCount + 2}"`];
      }
    } else { // Structure
      askText = `STORY: [${name1}] cuts out ${count1} ${shape1.name}s. [${name2}] cuts out ${count2} ${shape2.name}s. Calculate the total number of angles each person has, and determine the difference between their total angles.`;
      hintStr = `Find the total angles for ${name1} and ${name2} independently by multiplying their shape count by the angles per shape. Then subtract to find the difference.`;
      solutionStr = `1. ${name1}'s total angles = ${count1} x ${shape1.angles} = ${total1}.\\n2. ${name2}'s total angles = ${count2} x ${shape2.angles} = ${total2}.\\n3. Difference = ${maxTotal} - ${minTotal} = ${diff}.`;
      finalAns = `${diff}`;
      
      stepsArr = [
        { label: `Write the working equation to find the total angles for ${name1}'s ${count1} ${shape1.name}s:`, expectedAnswer: `${count1} x ${shape1.angles} = ${total1}`, acceptedAnswers: [`${shape1.angles} x ${count1} = ${total1}`] },
        { label: `Write the working equation to find the total angles for ${name2}'s ${count2} ${shape2.name}s:`, expectedAnswer: `${count2} x ${shape2.angles} = ${total2}`, acceptedAnswers: [`${shape2.angles} x ${count2} = ${total2}`] },
        { label: `Write the working equation to find the difference in total angles:`, expectedAnswer: `${maxTotal} - ${minTotal} = ${diff}`, acceptedAnswers: [] },
        { label: `Difference in angles:`, expectedAnswer: `${diff}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${diff}"`, `"${diff + 2}"`, `"${diff > 2 ? diff - 2 : diff + 3}"`, `"${diff + 4}"`];
    }
    
    visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \[[^\]]+\] /, 'Someone ').replace('STORY: ', '')}"`}
- For content.finalAnswer, use: "${finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
${isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : ''}`;

  } else if (activeVariant === 'standard_acute_obtuse') {
    const generateDynamicShape = () => {
      const type = getRandomInt(0, 5); // Exclude L-shape to avoid reflex angles for clarity
      let vertices = [];
      let name = '';
      switch(type) {
        case 0: { // Triangle 1R
          const x0 = getRandomInt(10, 40);
          const y1 = getRandomInt(60, 90);
          name = 'triangle';
          vertices = [
            {x: x0, y: getRandomInt(10, 40)},
            {x: x0, y: y1},
            {x: getRandomInt(60, 90), y: y1}
          ];
          break;
        }
        case 1: { // Quad 1R
          const x0 = getRandomInt(10, 30);
          const y1 = getRandomInt(10, 30);
          name = 'quadrilateral';
          vertices = [
            {x: x0, y: getRandomInt(60, 90)},
            {x: x0, y: y1},
            {x: getRandomInt(60, 90), y: y1},
            {x: getRandomInt(50, 90), y: getRandomInt(50, 90)}
          ];
          break;
        }
        case 2: { // Quad 2R (Trapezium)
          const x0 = getRandomInt(10, 30);
          const y0 = getRandomInt(10, 30);
          const y3 = getRandomInt(60, 90);
          name = 'quadrilateral';
          vertices = [
            {x: x0, y: y0},
            {x: getRandomInt(50, 90), y: y0},
            {x: getRandomInt(50, 90), y: y3},
            {x: x0, y: y3}
          ];
          break;
        }
        case 3: { // Pentagon 2R
          const x0 = getRandomInt(10, 30);
          const x1 = getRandomInt(70, 90);
          const y0 = getRandomInt(10, 30);
          name = 'pentagon';
          vertices = [
            {x: x0, y: y0},
            {x: x1, y: y0},
            {x: x1, y: getRandomInt(50, 70)},
            {x: getRandomInt(30, 70), y: getRandomInt(70, 90)},
            {x: x0, y: getRandomInt(50, 70)}
          ];
          break;
        }
        case 4: { // Pentagon 3R
          const x0 = getRandomInt(10, 30);
          const x2 = getRandomInt(70, 90);
          const y0 = getRandomInt(10, 30);
          const y1 = getRandomInt(70, 90);
          name = 'pentagon';
          vertices = [
            {x: x0, y: y0},
            {x: x0, y: y1},
            {x: x2, y: y1},
            {x: x2, y: getRandomInt(40, 60)},
            {x: getRandomInt(40, 60), y: y0}
          ];
          break;
        }
        case 5: { // Hexagon 1R
          const x1 = getRandomInt(10, 30);
          const y2 = getRandomInt(70, 90);
          name = 'hexagon';
          vertices = [
            {x: getRandomInt(40, 60), y: getRandomInt(10, 30)},
            {x: x1, y: getRandomInt(40, 60)},
            {x: x1, y: y2},
            {x: getRandomInt(60, 90), y: y2},
            {x: getRandomInt(70, 90), y: getRandomInt(40, 60)},
            {x: getRandomInt(70, 90), y: getRandomInt(10, 30)}
          ];
          break;
        }
      }
      return { name, vertices };
    };

    const shape = generateDynamicShape();
    const vertices = shape.vertices;
    const n = vertices.length;
    
    // Robustly measure the internal angles
    let angles = [];
    for (let i = 0; i < n; i++) {
      const A = vertices[(i - 1 + n) % n];
      const B = vertices[i];
      const C = vertices[(i + 1) % n];
      const BA = { x: A.x - B.x, y: A.y - B.y };
      const BC = { x: C.x - B.x, y: C.y - B.y };
      
      let a1 = Math.atan2(BA.y, BA.x);
      let a2 = Math.atan2(BC.y, BC.x);
      let ang = a2 - a1;
      while (ang < 0) ang += 2 * Math.PI;
      while (ang >= 2 * Math.PI) ang -= 2 * Math.PI;
      angles.push(ang * 180 / Math.PI);
    }
    
    let sum = angles.reduce((a, b) => a + b, 0);
    let expectedSum = (n - 2) * 180;
    if (Math.abs(sum - expectedSum) > 5) {
      angles = angles.map(a => 360 - a);
    }

    const rightAngles = [];
    const acuteAngles = [];
    const obtuseAngles = []; // Also includes reflex angles which are "greater than a right angle"
    
    angles.forEach((ang, index) => {
      if (Math.abs(ang - 90) < 2) rightAngles.push(index);
      else if (ang < 90) acuteAngles.push(index);
      else acuteAngles.push(); // Do nothing, it's obtuse/reflex
    });
    // Fill obtuse angles array explicitly
    angles.forEach((ang, index) => {
      if (Math.abs(ang - 90) >= 2 && ang > 90) {
        obtuseAngles.push(index);
      }
    });

    const totalAngles = n;
    const rightCount = rightAngles.length;
    const acuteCount = acuteAngles.length;
    const greaterCount = obtuseAngles.length;
    
    const askText = `STORY: Look at the irregular ${shape.name}. It has ${totalAngles} angles in total. You can see ${acuteCount} angle(s) are smaller than a right angle, and ${rightCount} is exactly a right angle. The rest are greater than a right angle. Calculate how many angles are greater.`;
    
    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: vertices,
        rightAngles: rightAngles,
        acuteAngles: acuteAngles,
        obtuseAngles: obtuseAngles
      }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Write the working equation to find the total of the known smaller and exact right angles:`, expectedAnswer: `${acuteCount} + ${rightCount} = ${acuteCount + rightCount}`, acceptedAnswers: [`${rightCount} + ${acuteCount} = ${acuteCount + rightCount}`] },
          { label: `Write the working equation to find the remaining angles that are greater:`, expectedAnswer: `${totalAngles} - ${acuteCount + rightCount} = ${greaterCount}`, acceptedAnswers: [] },
          { label: `Number of angles greater than a right angle:`, expectedAnswer: `${greaterCount}`, acceptedAnswers: [] }
        ]
      });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \[[^\]]+\] /, 'Someone ').replace('STORY: ', '')}"`}
- For content.finalAnswer, use: "${greaterCount}"
- For content.hint, use: "Add the smaller angles and right angles together, then subtract that sum from the total angles."
- For content.solutionSteps, use: """1. Total known angles = ${acuteCount} + ${rightCount} = ${acuteCount + rightCount}.\\n2. Angles greater than a right angle = ${totalAngles} - ${acuteCount + rightCount} = ${greaterCount}."""
${isMCQ ? `Generate EXACTLY 4 options:
- "${greaterCount}"
- "${greaterCount + 1}"
- "${greaterCount > 0 ? greaterCount - 1 : greaterCount + 2}"
- "${greaterCount + 2}"` : ''}`;
  }

  return { visualEngineStr, inputRequirementStr, systemPrompt };
}
