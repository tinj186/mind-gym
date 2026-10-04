import { getRandomNames, getRandomRectangleItems } from '../../../../../utils/variable-bank.js';

export function standardLogic(activeVariant, args) {
  const { isShort, isMCQ, isStructure, getRandomInt, unit, zodType, zodDiff, topic } = args;
  
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });
  let inputRequirementStr = "";
  let systemPrompt = "";

  const name = getRandomNames()[0];

  if (activeVariant === 'standard_area_to_perimeter') {
    const isSquare = getRandomInt(0, 1) === 0;
    const isAreaToPerimeter = getRandomInt(0, 1) === 0; // 0 = Find P given A, 1 = Find A given P
    const item = getRandomRectangleItems(unit)[getRandomInt(0, getRandomRectangleItems(unit).length - 1)];

    let L, W, S, A, P;
    let askText, finalAnswer, sysSolutionSteps, expectedSteps, hintStr, finalAnswerVal, finalAnswerUnit;
    let edgeLabels = [];
    let shapeVertices = [];

    const shapeName = isSquare ? "square" : "rectangular";
    const boundary = unit === 'm' ? "fence" : "wire border";

    if (isSquare) {
      S = getRandomInt(5, 12);
      A = S * S;
      P = 4 * S;
      shapeVertices = [{x: 0, y: 0}, {x: S*10, y: 0}, {x: S*10, y: S*10}, {x: 0, y: S*10}];
      
      if (isAreaToPerimeter) {
        edgeLabels = ["?", null, null, "?"];
        askText = `STORY: ${name} has a ${shapeName} ${item} with an area of ${A} ${unit}². It is going to have a ${boundary} placed exactly around its perimeter. What is the total length of the ${boundary}?`;
        if (isShort) askText = `The area of a square ${item} is ${A} ${unit}². Find its perimeter.`;
        else if (isMCQ) askText = `A square ${item} has an area of ${A} ${unit}². What is its perimeter?`;

        finalAnswer = `${P} ${unit}`;
        finalAnswerVal = P;
        finalAnswerUnit = unit;
        hintStr = "Use the area to find the length of one side first, then calculate the perimeter.";
        sysSolutionSteps = `"""1. Side x Side = Area, so Side x Side = ${A}. Side = ${S} ${unit}.\\n2. Perimeter = Side x 4 = ${S} x 4 = ${P} ${unit}."""`;
        
        expectedSteps = [
          { label: `Write the working equation to deduce the side length of the ${item} (Side x Side = ${A}):`, expectedAnswer: `${S} x ${S} = ${A}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the perimeter:`, expectedAnswer: `${S} x 4 = ${P}`, acceptedAnswers: [`4 x ${S} = ${P}`, `${S} + ${S} + ${S} + ${S} = ${P}`] },
          { label: `Perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
        ];
      } else {
        edgeLabels = ["?", null, null, "?"];
        askText = `STORY: ${name} has a ${shapeName} ${item} with a perimeter of ${P} ${unit}. What is the total area of the ${item}?`;
        if (isShort) askText = `The perimeter of a square ${item} is ${P} ${unit}. Find its area.`;
        else if (isMCQ) askText = `A square ${item} has a perimeter of ${P} ${unit}. What is its area?`;

        finalAnswer = `${A} ${unit}²`;
        finalAnswerVal = A;
        finalAnswerUnit = `${unit}²`;
        hintStr = "Use the perimeter to find the length of one side first, then calculate the area.";
        sysSolutionSteps = `"""1. Side = Perimeter ÷ 4 = ${P} ÷ 4 = ${S} ${unit}.\\n2. Area = Side x Side = ${S} x ${S} = ${A} ${unit}²."""`;
        
        expectedSteps = [
          { label: `Write the working equation to find the side length of the ${item}:`, expectedAnswer: `${P} / 4 = ${S}`, acceptedAnswers: [`${P} \\div 4 = ${S}`] },
          { label: `Write the working equation to find the area:`, expectedAnswer: `${S} x ${S} = ${A}`, acceptedAnswers: [] },
          { label: `Area:`, expectedAnswer: `${A} ${unit}²`, acceptedAnswers: [`${A}${unit}²`] }
        ];
      }
    } else {
      L = getRandomInt(8, 15);
      W = getRandomInt(3, 7);
      A = L * W;
      P = 2 * (L + W);
      shapeVertices = [{x: 0, y: 0}, {x: L*10, y: 0}, {x: L*10, y: W*10}, {x: 0, y: W*10}];
      
      const givenDimensionIsLength = getRandomInt(0, 1) === 0;
      const D = givenDimensionIsLength ? L : W;
      const dimName = givenDimensionIsLength ? "length" : "width";
      const missingDimName = givenDimensionIsLength ? "width" : "length";
      const missingD = givenDimensionIsLength ? W : L;

      if (isAreaToPerimeter) {
        edgeLabels = givenDimensionIsLength ? [`${L} ${unit}`, "?", null, null] : ["?", `${W} ${unit}`, null, null];
        askText = `STORY: ${name} has a ${shapeName} ${item} with an area of ${A} ${unit}² and a ${dimName} of ${D} ${unit}. It is going to have a ${boundary} placed exactly around its perimeter. What is the total length of the ${boundary}?`;
        if (isShort) askText = `A rectangular ${item} has an area of ${A} ${unit}² and a ${dimName} of ${D} ${unit}. What is its perimeter?`;
        else if (isMCQ) askText = `The area of a rectangular ${item} is ${A} ${unit}² and its ${dimName} is ${D} ${unit}. What is its perimeter?`;

        finalAnswer = `${P} ${unit}`;
        finalAnswerVal = P;
        finalAnswerUnit = unit;
        hintStr = `Use the area to find the ${missingDimName} first, then calculate the perimeter.`;
        sysSolutionSteps = `"""1. ${missingDimName.charAt(0).toUpperCase() + missingDimName.slice(1)} = Area ÷ ${dimName.charAt(0).toUpperCase() + dimName.slice(1)} = ${A} ÷ ${D} = ${missingD} ${unit}.\\n2. Perimeter = ${L} + ${W} + ${L} + ${W} = ${P} ${unit}."""`;
        
        expectedSteps = [
          { label: `Write the working equation to find the ${missingDimName} of the ${item}:`, expectedAnswer: `${A} / ${D} = ${missingD}`, acceptedAnswers: [`${A} \\div ${D} = ${missingD}`] },
          { label: `Write the working equation to find the total perimeter:`, expectedAnswer: `${L} + ${W} + ${L} + ${W} = ${P}`, acceptedAnswers: [`(${L} + ${W}) x 2 = ${P}`, `2 x (${L} + ${W}) = ${P}`] },
          { label: `Perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
        ];
      } else {
        edgeLabels = givenDimensionIsLength ? [`${L} ${unit}`, "?", null, null] : ["?", `${W} ${unit}`, null, null];
        askText = `STORY: ${name} has a ${shapeName} ${item} with a perimeter of ${P} ${unit} and a ${dimName} of ${D} ${unit}. What is its area?`;
        if (isShort) askText = `A rectangular ${item} has a perimeter of ${P} ${unit} and a ${dimName} of ${D} ${unit}. What is its area?`;
        else if (isMCQ) askText = `The perimeter of a rectangular ${item} is ${P} ${unit} and its ${dimName} is ${D} ${unit}. What is its area?`;

        finalAnswer = `${A} ${unit}²`;
        finalAnswerVal = A;
        finalAnswerUnit = `${unit}²`;
        hintStr = `Use the perimeter to find the ${missingDimName} first, then calculate the area.`;
        
        const twoD = D * 2;
        const missingTwoD = P - twoD;
        sysSolutionSteps = `"""1. Two ${dimName}s = ${D} + ${D} = ${twoD} ${unit}.\\n2. Two ${missingDimName}s = Perimeter - Two ${dimName}s = ${P} - ${twoD} = ${missingTwoD} ${unit}.\\n3. ${missingDimName.charAt(0).toUpperCase() + missingDimName.slice(1)} = ${missingTwoD} ÷ 2 = ${missingD} ${unit}.\\n4. Area = Length x Width = ${L} x ${W} = ${A} ${unit}²."""`;
        
        expectedSteps = [
          { label: `Write the working equation to find the sum of two ${dimName}s:`, expectedAnswer: `${D} + ${D} = ${twoD}`, acceptedAnswers: [`${D} x 2 = ${twoD}`, `2 x ${D} = ${twoD}`] },
          { label: `Write the working equation to find the sum of two ${missingDimName}s:`, expectedAnswer: `${P} - ${twoD} = ${missingTwoD}`, acceptedAnswers: [] },
          { label: `Write the working equation to find one ${missingDimName}:`, expectedAnswer: `${missingTwoD} / 2 = ${missingD}`, acceptedAnswers: [`${missingTwoD} \\div 2 = ${missingD}`] },
          { label: `Write the working equation to find the area:`, expectedAnswer: `${L} x ${W} = ${A}`, acceptedAnswers: [`${W} x ${L} = ${A}`] },
          { label: `Area:`, expectedAnswer: `${A} ${unit}²`, acceptedAnswers: [`${A}${unit}²`] }
        ];
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: shapeVertices,
        edgeLabels: edgeLabels,
        fillColor: isSquare ? "#fde047" : "#bfdbfe",
        strokeColor: isSquare ? "#854d0e" : "#0f172a"
      }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: expectedSteps });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswerVal} ${finalAnswerUnit}"
- "${finalAnswerVal + (isAreaToPerimeter ? 4 : 10)} ${finalAnswerUnit}"
- "${finalAnswerVal > 2 ? finalAnswerVal - 2 : finalAnswerVal + 4} ${finalAnswerUnit}"
- "${isAreaToPerimeter ? finalAnswerVal * 2 : (finalAnswerVal > 10 ? finalAnswerVal - 10 : finalAnswerVal * 3)} ${finalAnswerUnit}"` : ''}
`;
  } else if (activeVariant === 'standard_proportional_shapes') {
    let valid = false;
    let L1, W1, L2, W2, A1, P1, A2, P2;
    let isAreaRel;
    let relType; 
    let items = getRandomRectangleItems(unit);
    let itemA = items[0] || "mat";
    let itemB = items[1] || "rug";

    const relOptions = [1, 2, 0.5, 3];
    
    while (!valid) {
      L1 = getRandomInt(4, 15);
      W1 = getRandomInt(2, 10);
      if (L1 === W1) continue;
      A1 = L1 * W1;
      P1 = 2 * (L1 + W1);
      
      isAreaRel = getRandomInt(0, 1) === 0;
      relType = relOptions[getRandomInt(0, 3)];
      
      if (isAreaRel) {
        A2 = A1 * relType;
        if (!Number.isInteger(A2)) continue;
        let possibleFactors = [];
        for (let i = 2; i <= Math.sqrt(A2); i++) {
          if (A2 % i === 0) {
            let f1 = Math.max(i, A2/i);
            let f2 = Math.min(i, A2/i);
            if (relType === 1 && f1 === Math.max(L1, W1)) continue;
            possibleFactors.push({l: f1, w: f2});
          }
        }
        if (possibleFactors.length > 0) {
          let choice = possibleFactors[getRandomInt(0, possibleFactors.length - 1)];
          L2 = choice.l;
          W2 = choice.w;
          valid = true;
        }
      } else {
        P2 = P1 * relType;
        if (!Number.isInteger(P2) || P2 % 2 !== 0) continue;
        let halfP2 = P2 / 2;
        let possibleSummands = [];
        for (let i = 2; i <= halfP2 / 2; i++) {
          let f1 = Math.max(i, halfP2 - i);
          let f2 = Math.min(i, halfP2 - i);
          if (relType === 1 && f1 === Math.max(L1, W1)) continue;
          if (f1 !== f2) possibleSummands.push({l: f1, w: f2});
        }
        if (possibleSummands.length > 0) {
          let choice = possibleSummands[getRandomInt(0, possibleSummands.length - 1)];
          L2 = choice.l;
          W2 = choice.w;
          valid = true;
        }
      }
    }

    const askForWidth = getRandomInt(0, 1) === 0;
    const givenDim2 = askForWidth ? L2 : W2;
    const missingDim2 = askForWidth ? W2 : L2;
    const givenDimName2 = askForWidth ? "length" : "width";
    const missingDimName2 = askForWidth ? "width" : "length";

    const relWords = { 1: "exactly the same area as", 2: "twice the area of", 0.5: "half the area of", 3: "three times the area of" };
    const relPerimWords = { 1: "exactly the same perimeter as", 2: "twice the perimeter of", 0.5: "half the perimeter of", 3: "three times the perimeter of" };
    let relStr = isAreaRel ? relWords[relType] : relPerimWords[relType];
    let trait = isAreaRel ? "area" : "perimeter";

    let askText = `STORY: A rectangular ${itemA} (Shape A) measures ${L1} ${unit} by ${W1} ${unit}. A rectangular ${itemB} (Shape B) has ${relStr} Shape A. If the ${givenDimName2} of Shape B is ${givenDim2} ${unit}, find its ${missingDimName2}.`;
    if (isShort) askText = `Shape A is a ${L1} ${unit} by ${W1} ${unit} rectangle. Shape B has ${relStr} Shape A, and its ${givenDimName2} is ${givenDim2} ${unit}. Find its ${missingDimName2}.`;
    else if (isMCQ) askText = `Rectangle A is ${L1} ${unit} by ${W1} ${unit}. Rectangle B has ${relStr} A, and its ${givenDimName2} is ${givenDim2} ${unit}. What is its ${missingDimName2}?`;

    let expectedSteps = [];
    let sysSolutionSteps = "";

    if (isAreaRel) {
      sysSolutionSteps = `"""1. Area of Shape A = ${L1} x ${W1} = ${A1} ${unit}².\\n`;
      expectedSteps.push({ label: `Write the working equation to find the area of Shape A:`, expectedAnswer: `${L1} x ${W1} = ${A1}`, acceptedAnswers: [`${W1} x ${L1} = ${A1}`] });
      
      if (relType !== 1) {
        let op = relType === 0.5 ? `÷ 2` : `x ${relType}`;
        let sym = relType === 0.5 ? `/ 2` : `x ${relType}`;
        sysSolutionSteps += `2. Area of Shape B = ${A1} ${op} = ${A2} ${unit}².\\n3. ${missingDimName2.charAt(0).toUpperCase() + missingDimName2.slice(1)} of Shape B = ${A2} ÷ ${givenDim2} = ${missingDim2} ${unit}."""`;
        expectedSteps.push({ label: `Write the working equation to find the area of Shape B:`, expectedAnswer: `${A1} ${sym} = ${A2}`, acceptedAnswers: relType === 0.5 ? [`${A1} \\div 2 = ${A2}`] : [`${relType} x ${A1} = ${A2}`] });
      } else {
        sysSolutionSteps += `2. Area of Shape B = ${A2} ${unit}².\\n3. ${missingDimName2.charAt(0).toUpperCase() + missingDimName2.slice(1)} of Shape B = ${A2} ÷ ${givenDim2} = ${missingDim2} ${unit}."""`;
      }
      
      expectedSteps.push({ label: `Write the working equation to find the ${missingDimName2} of Shape B:`, expectedAnswer: `${A2} / ${givenDim2} = ${missingDim2}`, acceptedAnswers: [`${A2} \\div ${givenDim2} = ${missingDim2}`] });
    } else {
      sysSolutionSteps = `"""1. Perimeter of Shape A = ${L1} + ${W1} + ${L1} + ${W1} = ${P1} ${unit}.\\n`;
      expectedSteps.push({ label: `Write the working equation to find the perimeter of Shape A:`, expectedAnswer: `${L1} + ${W1} + ${L1} + ${W1} = ${P1}`, acceptedAnswers: [`(${L1} + ${W1}) x 2 = ${P1}`, `2 x (${L1} + ${W1}) = ${P1}`] });
      
      if (relType !== 1) {
        let op = relType === 0.5 ? `÷ 2` : `x ${relType}`;
        let sym = relType === 0.5 ? `/ 2` : `x ${relType}`;
        sysSolutionSteps += `2. Perimeter of Shape B = ${P1} ${op} = ${P2} ${unit}.\\n`;
        expectedSteps.push({ label: `Write the working equation to find the perimeter of Shape B:`, expectedAnswer: `${P1} ${sym} = ${P2}`, acceptedAnswers: relType === 0.5 ? [`${P1} \\div 2 = ${P2}`] : [`${relType} x ${P1} = ${P2}`] });
      } else {
        sysSolutionSteps += `2. Perimeter of Shape B = ${P2} ${unit}.\\n`;
      }
      
      let halfP2 = P2 / 2;
      sysSolutionSteps += `3. Two sides of Shape B = ${P2} ÷ 2 = ${halfP2} ${unit}.\\n4. ${missingDimName2.charAt(0).toUpperCase() + missingDimName2.slice(1)} of Shape B = ${halfP2} - ${givenDim2} = ${missingDim2} ${unit}."""`;
      expectedSteps.push({ label: `Write the working equation to find the sum of length and width for Shape B:`, expectedAnswer: `${P2} / 2 = ${halfP2}`, acceptedAnswers: [`${P2} \\div 2 = ${halfP2}`] });
      expectedSteps.push({ label: `Write the working equation to find the ${missingDimName2} of Shape B:`, expectedAnswer: `${halfP2} - ${givenDim2} = ${missingDim2}`, acceptedAnswers: [] });
    }

    expectedSteps.push({ label: `${missingDimName2.charAt(0).toUpperCase() + missingDimName2.slice(1)}:`, expectedAnswer: `${missingDim2} ${unit}`, acceptedAnswers: [`${missingDim2}${unit}`] });

    let labelsA = [`${L1} ${unit}`, `${W1} ${unit}`, null, null];
    let labelsB = askForWidth ? [`${L2} ${unit}`, "?", null, null] : ["?", `${W2} ${unit}`, null, null];

    visualEngineStr = JSON.stringify({
      componentToRender: "MULTI_COMPONENT",
      componentData: {
        components: [
          {
            componentToRender: "GEOMETRY_POLYGON",
            componentData: {
              vertices: [{x: 0, y: 0}, {x: L1*10, y: 0}, {x: L1*10, y: W1*10}, {x: 0, y: W1*10}],
              edgeLabels: labelsA,
              fillColor: "#bfdbfe"
            }
          },
          {
            componentToRender: "GEOMETRY_POLYGON",
            componentData: {
              vertices: [{x: 0, y: 0}, {x: L2*10, y: 0}, {x: L2*10, y: W2*10}, {x: 0, y: W2*10}],
              edgeLabels: labelsB,
              fillColor: "#fecaca"
            }
          }
        ]
      }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: expectedSteps });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText}"`}
- For content.finalAnswer, use: "${missingDim2} ${unit}"
- For content.hint, use: "Find the ${trait} of the first shape, use the relationship to find the ${trait} of the second shape, then find its missing side."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${missingDim2} ${unit}"
- "${missingDim2 + 2} ${unit}"
- "${missingDim2 > 1 ? missingDim2 - 1 : missingDim2 + 4} ${unit}"
- "${L2 + W2} ${unit}"` : ''}
`;
  } else if (activeVariant === 'standard_subtracting_cutout') {
    const numCutouts = getRandomInt(1, 2);
    
    // Make dimensions large enough for 2 cutouts
    const L1 = getRandomInt(14, 18);
    const W1 = getRandomInt(8, 12);
    const A1 = L1 * W1;

    const L2 = getRandomInt(3, 5);
    const W2 = getRandomInt(2, 4);
    const A2 = L2 * W2;

    const L3 = numCutouts === 2 ? getRandomInt(3, 5) : 0;
    const W3 = numCutouts === 2 ? getRandomInt(2, 4) : 0;
    const A3 = L3 * W3;

    const remainingA = A1 - A2 - A3;

    // target: 0 = find remaining area, 1 = find outer dim, 2 = find inner dim
    const target = getRandomInt(0, 2);

    let askText = "";
    let finalAnswer = "";
    let hintStr = "";
    let sysSolutionSteps = "";
    let expectedSteps = [];

    // Outer shape item
    const items = ["rectangular piece of paper", "rectangular board", "wall", "rectangular banner"];
    const item = items[getRandomInt(0, items.length - 1)];

    // Inner shape item
    const innerItems = ["rectangular hole", "rectangular window", "cutout", "blank patch"];
    const innerItem = innerItems[getRandomInt(0, innerItems.length - 1)];

    let edgeLabels1 = [null, null, null, null];
    let edgeLabels2 = [null, null, null, null];
    let edgeLabels3 = [null, null, null, null];
    let finalAnswerVal, finalAnswerUnit;

    if (target === 0) {
      // Find remaining area
      edgeLabels1 = [`${L1} ${unit}`, `${W1} ${unit}`, null, null];
      edgeLabels2 = [`${L2} ${unit}`, null, null, `${W2} ${unit}`];
      if (numCutouts === 2) edgeLabels3 = [null, `${W3} ${unit}`, `${L3} ${unit}`, null];

      let innerDesc = numCutouts === 1 
        ? `a ${innerItem} measuring ${L2} ${unit} by ${W2} ${unit}` 
        : `two ${innerItem}s: one measuring ${L2} ${unit} by ${W2} ${unit} and another measuring ${L3} ${unit} by ${W3} ${unit}`;

      askText = `STORY: A ${item} measures ${L1} ${unit} by ${W1} ${unit}. There is ${innerDesc} inside it. What is the area of the ${item} left over?`;
      if (isShort) askText = `A ${L1} ${unit} by ${W1} ${unit} rectangle has ${numCutouts === 1 ? `a ${L2}x${W2} ${unit} hole` : `holes of ${L2}x${W2} ${unit} and ${L3}x${W3} ${unit}`}. Find the remaining area.`;
      else if (isMCQ) askText = `A ${L1} ${unit} by ${W1} ${unit} rectangle has ${numCutouts === 1 ? `a ${L2}x${W2} ${unit} hole` : `holes of ${L2}x${W2} ${unit} and ${L3}x${W3} ${unit}`}. What is the remaining area?`;

      finalAnswer = `${remainingA} ${unit}²`;
      finalAnswerVal = remainingA;
      finalAnswerUnit = `${unit}²`;
      hintStr = "Calculate the total area, then subtract the area of the hole(s).";

      sysSolutionSteps = `"""1. Total area = ${L1} x ${W1} = ${A1} ${unit}².\\n2. Area of first hole = ${L2} x ${W2} = ${A2} ${unit}².\\n`;
      expectedSteps.push({ label: `Write the working equation to find the total area before cutting:`, expectedAnswer: `${L1} x ${W1} = ${A1}`, acceptedAnswers: [`${W1} x ${L1} = ${A1}`] });
      expectedSteps.push({ label: `Write the working equation to find the area of the first hole:`, expectedAnswer: `${L2} x ${W2} = ${A2}`, acceptedAnswers: [`${W2} x ${L2} = ${A2}`] });

      if (numCutouts === 2) {
        sysSolutionSteps += `3. Area of second hole = ${L3} x ${W3} = ${A3} ${unit}².\\n4. Remaining area = ${A1} - ${A2} - ${A3} = ${remainingA} ${unit}²."""`;
        expectedSteps.push({ label: `Write the working equation to find the area of the second hole:`, expectedAnswer: `${L3} x ${W3} = ${A3}`, acceptedAnswers: [`${W3} x ${L3} = ${A3}`] });
        expectedSteps.push({ label: `Write the working equation to find the remaining area:`, expectedAnswer: `${A1} - ${A2 + A3} = ${remainingA}`, acceptedAnswers: [`${A1} - ${A2} - ${A3} = ${remainingA}`] });
      } else {
        sysSolutionSteps += `3. Remaining area = ${A1} - ${A2} = ${remainingA} ${unit}²."""`;
        expectedSteps.push({ label: `Write the working equation to find the remaining area:`, expectedAnswer: `${A1} - ${A2} = ${remainingA}`, acceptedAnswers: [] });
      }
      expectedSteps.push({ label: `Remaining area:`, expectedAnswer: `${remainingA} ${unit}²`, acceptedAnswers: [`${remainingA}${unit}²`] });

    } else if (target === 1) {
      // Find outer dimension
      const missingOuterIsLength = getRandomInt(0, 1) === 0;
      const givenOuterD = missingOuterIsLength ? W1 : L1;
      const missingOuterD = missingOuterIsLength ? L1 : W1;
      const missingOuterName = missingOuterIsLength ? "length" : "width";
      const givenOuterName = missingOuterIsLength ? "width" : "length";

      edgeLabels1 = missingOuterIsLength ? ["?", `${W1} ${unit}`, null, null] : [`${L1} ${unit}`, "?", null, null];
      edgeLabels2 = [`${L2} ${unit}`, null, null, `${W2} ${unit}`];
      if (numCutouts === 2) edgeLabels3 = [null, `${W3} ${unit}`, `${L3} ${unit}`, null];

      let innerDesc = numCutouts === 1 
        ? `a ${innerItem} measuring ${L2} ${unit} by ${W2} ${unit}` 
        : `two ${innerItem}s: one measuring ${L2} ${unit} by ${W2} ${unit} and another measuring ${L3} ${unit} by ${W3} ${unit}`;

      askText = `STORY: A ${item} has a ${givenOuterName} of ${givenOuterD} ${unit}. There is ${innerDesc} cut out from it. If the remaining area of the ${item} is ${remainingA} ${unit}², find its original ${missingOuterName}.`;
      if (isShort) askText = `A rectangle has a ${givenOuterName} of ${givenOuterD} ${unit}. After removing ${numCutouts === 1 ? `a ${L2}x${W2} ${unit} hole` : `holes of ${L2}x${W2} ${unit} and ${L3}x${W3} ${unit}`}, the remaining area is ${remainingA} ${unit}². Find its ${missingOuterName}.`;
      else if (isMCQ) askText = `A rectangle has a ${givenOuterName} of ${givenOuterD} ${unit}. After removing ${numCutouts === 1 ? `a ${L2}x${W2} ${unit} hole` : `holes of ${L2}x${W2} ${unit} and ${L3}x${W3} ${unit}`}, the remaining area is ${remainingA} ${unit}². What is its ${missingOuterName}?`;

      finalAnswer = `${missingOuterD} ${unit}`;
      finalAnswerVal = missingOuterD;
      finalAnswerUnit = unit;
      hintStr = "Add the remaining area and the area of the hole(s) to find the original total area, then divide by the known dimension.";

      sysSolutionSteps = `"""1. Area of first hole = ${L2} x ${W2} = ${A2} ${unit}².\\n`;
      expectedSteps.push({ label: `Write the working equation to find the area of the first hole:`, expectedAnswer: `${L2} x ${W2} = ${A2}`, acceptedAnswers: [`${W2} x ${L2} = ${A2}`] });

      if (numCutouts === 2) {
        sysSolutionSteps += `2. Area of second hole = ${L3} x ${W3} = ${A3} ${unit}².\\n3. Total original area = ${remainingA} + ${A2} + ${A3} = ${A1} ${unit}².\\n4. ${missingOuterName.charAt(0).toUpperCase() + missingOuterName.slice(1)} = ${A1} ÷ ${givenOuterD} = ${missingOuterD} ${unit}."""`;
        expectedSteps.push({ label: `Write the working equation to find the area of the second hole:`, expectedAnswer: `${L3} x ${W3} = ${A3}`, acceptedAnswers: [`${W3} x ${L3} = ${A3}`] });
        expectedSteps.push({ label: `Write the working equation to find the total original area:`, expectedAnswer: `${remainingA} + ${A2 + A3} = ${A1}`, acceptedAnswers: [`${remainingA} + ${A2} + ${A3} = ${A1}`] });
      } else {
        sysSolutionSteps += `2. Total original area = ${remainingA} + ${A2} = ${A1} ${unit}².\\n3. ${missingOuterName.charAt(0).toUpperCase() + missingOuterName.slice(1)} = ${A1} ÷ ${givenOuterD} = ${missingOuterD} ${unit}."""`;
        expectedSteps.push({ label: `Write the working equation to find the total original area:`, expectedAnswer: `${remainingA} + ${A2} = ${A1}`, acceptedAnswers: [`${A2} + ${remainingA} = ${A1}`] });
      }
      expectedSteps.push({ label: `Write the working equation to find the ${missingOuterName} of the ${item}:`, expectedAnswer: `${A1} / ${givenOuterD} = ${missingOuterD}`, acceptedAnswers: [`${A1} \\div ${givenOuterD} = ${missingOuterD}`] });
      expectedSteps.push({ label: `${missingOuterName.charAt(0).toUpperCase() + missingOuterName.slice(1)}:`, expectedAnswer: `${missingOuterD} ${unit}`, acceptedAnswers: [`${missingOuterD}${unit}`] });

    } else {
      // Find inner dimension
      const missingInnerIsLength = getRandomInt(0, 1) === 0;
      const givenInnerD = missingInnerIsLength ? W2 : L2;
      const missingInnerD = missingInnerIsLength ? L2 : W2;
      const missingInnerName = missingInnerIsLength ? "length" : "width";

      edgeLabels1 = [`${L1} ${unit}`, `${W1} ${unit}`, null, null];
      edgeLabels2 = missingInnerIsLength ? ["?", null, null, `${W2} ${unit}`] : [`${L2} ${unit}`, null, null, "?"]; 
      if (numCutouts === 2) edgeLabels3 = [null, `${W3} ${unit}`, `${L3} ${unit}`, null];

      let innerDesc = numCutouts === 1 
        ? `a ${innerItem} with a width of ${W2} ${unit} and an unknown length` 
        : `two ${innerItem}s: one with a width of ${W2} ${unit} and an unknown length, and another measuring ${L3} ${unit} by ${W3} ${unit}`;
      if (!missingInnerIsLength) {
        innerDesc = numCutouts === 1 
          ? `a ${innerItem} with a length of ${L2} ${unit} and an unknown width` 
          : `two ${innerItem}s: one with a length of ${L2} ${unit} and an unknown width, and another measuring ${L3} ${unit} by ${W3} ${unit}`;
      }

      askText = `STORY: A ${item} measures ${L1} ${unit} by ${W1} ${unit}. There is ${innerDesc} cut out from it. If the remaining area of the ${item} is ${remainingA} ${unit}², find the missing ${missingInnerName} of the first ${innerItem}.`;
      if (isShort) askText = `A ${L1} ${unit} by ${W1} ${unit} rectangle has ${numCutouts === 1 ? `a hole` : `two holes`} cut out. The remaining area is ${remainingA} ${unit}². Find the missing ${missingInnerName} of the first hole.`;
      else if (isMCQ) askText = `A ${L1} ${unit} by ${W1} ${unit} rectangle has a remaining area of ${remainingA} ${unit}² after holes are removed. What is the missing ${missingInnerName} of the hole?`;

      finalAnswer = `${missingInnerD} ${unit}`;
      finalAnswerVal = missingInnerD;
      finalAnswerUnit = unit;
      hintStr = "Calculate the total original area, subtract the remaining area to find the total area of the hole(s), then divide by the known dimension.";

      sysSolutionSteps = `"""1. Total original area = ${L1} x ${W1} = ${A1} ${unit}².\\n`;
      expectedSteps.push({ label: `Write the working equation to find the total original area:`, expectedAnswer: `${L1} x ${W1} = ${A1}`, acceptedAnswers: [`${W1} x ${L1} = ${A1}`] });

      if (numCutouts === 2) {
        sysSolutionSteps += `2. Area of second hole = ${L3} x ${W3} = ${A3} ${unit}².\\n3. Area of first hole = ${A1} - ${remainingA} - ${A3} = ${A2} ${unit}².\\n4. ${missingInnerName.charAt(0).toUpperCase() + missingInnerName.slice(1)} of first hole = ${A2} ÷ ${givenInnerD} = ${missingInnerD} ${unit}."""`;
        expectedSteps.push({ label: `Write the working equation to find the area of the second hole:`, expectedAnswer: `${L3} x ${W3} = ${A3}`, acceptedAnswers: [`${W3} x ${L3} = ${A3}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the first hole:`, expectedAnswer: `${A1} - ${remainingA + A3} = ${A2}`, acceptedAnswers: [`${A1} - ${remainingA} - ${A3} = ${A2}`] });
      } else {
        sysSolutionSteps += `2. Area of the hole = ${A1} - ${remainingA} = ${A2} ${unit}².\\n3. ${missingInnerName.charAt(0).toUpperCase() + missingInnerName.slice(1)} of the hole = ${A2} ÷ ${givenInnerD} = ${missingInnerD} ${unit}."""`;
        expectedSteps.push({ label: `Write the working equation to find the area of the hole:`, expectedAnswer: `${A1} - ${remainingA} = ${A2}`, acceptedAnswers: [] });
      }
      expectedSteps.push({ label: `Write the working equation to find the ${missingInnerName} of the hole:`, expectedAnswer: `${A2} / ${givenInnerD} = ${missingInnerD}`, acceptedAnswers: [`${A2} \\div ${givenInnerD} = ${missingInnerD}`] });
      expectedSteps.push({ label: `${missingInnerName.charAt(0).toUpperCase() + missingInnerName.slice(1)}:`, expectedAnswer: `${missingInnerD} ${unit}`, acceptedAnswers: [`${missingInnerD}${unit}`] });
    }

    let polygons = [
      {
        vertices: [{x: 0, y: 0}, {x: L1*10, y: 0}, {x: L1*10, y: W1*10}, {x: 0, y: W1*10}],
        edgeLabels: edgeLabels1,
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      },
      {
        // Clockwise: Top-Left -> Top-Right -> Bottom-Right -> Bottom-Left
        vertices: [{x: 20, y: 20}, {x: 20 + L2*10, y: 20}, {x: 20 + L2*10, y: 20 + W2*10}, {x: 20, y: 20 + W2*10}],
        edgeLabels: edgeLabels2,
        fillColor: "#ffffff",
        strokeColor: "#0f172a"
      }
    ];

    if (numCutouts === 2) {
      polygons.push({
        // Clockwise: Top-Left -> Top-Right -> Bottom-Right -> Bottom-Left
        vertices: [{x: 20 + L2*10 + 20, y: 20}, {x: 20 + L2*10 + 20 + L3*10, y: 20}, {x: 20 + L2*10 + 20 + L3*10, y: 20 + W3*10}, {x: 20 + L2*10 + 20, y: 20 + W3*10}],
        edgeLabels: edgeLabels3,
        fillColor: "#ffffff",
        strokeColor: "#0f172a"
      });
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        polygons: polygons
      }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: expectedSteps });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswerVal} ${finalAnswerUnit}"
- "${finalAnswerVal + 2} ${finalAnswerUnit}"
- "${finalAnswerVal > 1 ? finalAnswerVal - 1 : finalAnswerVal + 4} ${finalAnswerUnit}"
- "${finalAnswerVal * 2} ${finalAnswerUnit}"` : ''}
`;
  } else if (activeVariant === 'standard_tiling') {
    let valid = false;
    let L1, W1, totalA, tileA, count;
    
    while (!valid) {
      L1 = getRandomInt(6, 12);
      W1 = getRandomInt(4, 10);
      totalA = L1 * W1;
      
      // We want tileA to divide totalA perfectly, and tileA to be small (e.g. 2, 3, 4, 6, 8, 9)
      const possibleTiles = [2, 3, 4, 6, 8, 9].filter(t => totalA % t === 0);
      if (possibleTiles.length > 0) {
        tileA = possibleTiles[getRandomInt(0, possibleTiles.length - 1)];
        count = totalA / tileA;
        if (count > 2 && count < 60) valid = true;
      }
    }

    const scenarios = [
      { outer: "floor", inner: "square tile" },
      { outer: "wall", inner: "rectangular panel" },
      { outer: "patio", inner: "paving stone" },
      { outer: "board", inner: "large sticker" }
    ];
    const sc = scenarios[getRandomInt(0, scenarios.length - 1)];
    const outerItem = sc.outer;
    const innerItem = sc.inner;

    // Target: 0 = find count, 1 = find L1/W1, 2 = find tileA
    const target = getRandomInt(0, 2);
    
    let askText = "";
    let finalAnswer = "";
    let finalAnswerVal = "";
    let finalAnswerUnit = "";
    let sysSolutionSteps = "";
    let hintStr = "";
    let expectedSteps = [];

    let edgeLabels1 = [null, null, null, null];
    let visualEngineData = {};
    
    if (target === 0) {
      // Find count
      edgeLabels1 = [`${L1} ${unit}`, `${W1} ${unit}`, null, null];
      
      askText = `STORY: A rectangular ${outerItem} is ${L1} ${unit} long and ${W1} ${unit} wide. It is completely covered with identical ${innerItem}s. Each ${innerItem} has an area of ${tileA} ${unit}². How many ${innerItem}s are needed?`;
      if (isShort) askText = `A ${L1} ${unit} by ${W1} ${unit} ${outerItem} is covered by ${innerItem}s of area ${tileA} ${unit}². Find the number of ${innerItem}s needed.`;
      else if (isMCQ) askText = `A ${L1} ${unit} by ${W1} ${unit} ${outerItem} is covered by ${innerItem}s of area ${tileA} ${unit}². How many ${innerItem}s are needed?`;

      finalAnswer = `${count}`;
      finalAnswerVal = count;
      finalAnswerUnit = "";
      hintStr = "Calculate the total area first, then divide by the area of one tile.";
      
      sysSolutionSteps = `"""1. Total area = ${L1} x ${W1} = ${totalA} ${unit}².\\n2. Number of ${innerItem}s = ${totalA} ÷ ${tileA} = ${count}."""`;
      
      expectedSteps.push({ label: `Write the working equation to find the total area of the ${outerItem}:`, expectedAnswer: `${L1} x ${W1} = ${totalA}`, acceptedAnswers: [`${W1} x ${L1} = ${totalA}`] });
      expectedSteps.push({ label: `Write the working equation to find how many ${innerItem}s are needed:`, expectedAnswer: `${totalA} / ${tileA} = ${count}`, acceptedAnswers: [`${totalA} \\div ${tileA} = ${count}`] });
      expectedSteps.push({ label: `Number of ${innerItem}s:`, expectedAnswer: `${count}`, acceptedAnswers: [] });
      
    } else if (target === 1) {
      // Find L1 or W1
      const askForL1 = getRandomInt(0, 1) === 0;
      const givenD = askForL1 ? W1 : L1;
      const missingD = askForL1 ? L1 : W1;
      const givenName = askForL1 ? "width" : "length";
      const missingName = askForL1 ? "length" : "width";
      
      edgeLabels1 = askForL1 ? ["?", `${W1} ${unit}`, null, null] : [`${L1} ${unit}`, "?", null, null];
      
      askText = `STORY: A rectangular ${outerItem} has a ${givenName} of ${givenD} ${unit}. It takes exactly ${count} identical ${innerItem}s to cover it. If each ${innerItem} has an area of ${tileA} ${unit}², find the ${missingName} of the ${outerItem}.`;
      if (isShort) askText = `A ${outerItem} with a ${givenName} of ${givenD} ${unit} is covered by ${count} ${innerItem}s of area ${tileA} ${unit}² each. Find its ${missingName}.`;
      else if (isMCQ) askText = `A ${outerItem} with ${givenName} ${givenD} ${unit} requires ${count} ${innerItem}s of area ${tileA} ${unit}². What is its ${missingName}?`;

      finalAnswer = `${missingD} ${unit}`;
      finalAnswerVal = missingD;
      finalAnswerUnit = unit;
      hintStr = "Multiply the number of tiles by the area of one tile to find the total area, then divide by the given side.";

      sysSolutionSteps = `"""1. Total area = ${count} x ${tileA} = ${totalA} ${unit}².\\n2. ${missingName.charAt(0).toUpperCase() + missingName.slice(1)} = ${totalA} ÷ ${givenD} = ${missingD} ${unit}."""`;
      
      expectedSteps.push({ label: `Write the working equation to find the total area of the ${outerItem}:`, expectedAnswer: `${count} x ${tileA} = ${totalA}`, acceptedAnswers: [`${tileA} x ${count} = ${totalA}`] });
      expectedSteps.push({ label: `Write the working equation to find the ${missingName}:`, expectedAnswer: `${totalA} / ${givenD} = ${missingD}`, acceptedAnswers: [`${totalA} \\div ${givenD} = ${missingD}`] });
      expectedSteps.push({ label: `${missingName.charAt(0).toUpperCase() + missingName.slice(1)}:`, expectedAnswer: `${missingD} ${unit}`, acceptedAnswers: [`${missingD}${unit}`] });

    } else {
      // Find tileA
      edgeLabels1 = [`${L1} ${unit}`, `${W1} ${unit}`, null, null];
      
      askText = `STORY: A rectangular ${outerItem} is ${L1} ${unit} long and ${W1} ${unit} wide. It is perfectly covered by exactly ${count} identical ${innerItem}s. What is the area of each ${innerItem}?`;
      if (isShort) askText = `A ${L1} ${unit} by ${W1} ${unit} ${outerItem} is covered by ${count} identical ${innerItem}s. Find the area of one ${innerItem}.`;
      else if (isMCQ) askText = `A ${L1} ${unit} by ${W1} ${unit} ${outerItem} uses ${count} identical ${innerItem}s. What is the area of each ${innerItem}?`;

      finalAnswer = `${tileA} ${unit}²`;
      finalAnswerVal = tileA;
      finalAnswerUnit = `${unit}²`;
      hintStr = "Find the total area of the large rectangle, then divide it by the total number of tiles to find the area of one tile.";
      
      sysSolutionSteps = `"""1. Total area = ${L1} x ${W1} = ${totalA} ${unit}².\\n2. Area of each ${innerItem} = ${totalA} ÷ ${count} = ${tileA} ${unit}²."""`;

      expectedSteps.push({ label: `Write the working equation to find the total area of the ${outerItem}:`, expectedAnswer: `${L1} x ${W1} = ${totalA}`, acceptedAnswers: [`${W1} x ${L1} = ${totalA}`] });
      expectedSteps.push({ label: `Write the working equation to find the area of one ${innerItem}:`, expectedAnswer: `${totalA} / ${count} = ${tileA}`, acceptedAnswers: [`${totalA} \\div ${count} = ${tileA}`] });
      expectedSteps.push({ label: `Area of one ${innerItem}:`, expectedAnswer: `${tileA} ${unit}²`, acceptedAnswers: [`${tileA}${unit}²`] });
    }

    visualEngineData = {
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: [{x: 0, y: 0}, {x: L1*10, y: 0}, {x: L1*10, y: W1*10}, {x: 0, y: W1*10}],
        edgeLabels: edgeLabels1,
        fillColor: "#fef08a",
        strokeColor: "#854d0e"
      }
    };
    visualEngineStr = JSON.stringify(visualEngineData);

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: expectedSteps });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswerVal}${finalAnswerUnit ? ' ' + finalAnswerUnit : ''}"
- "${finalAnswerVal + 2}${finalAnswerUnit ? ' ' + finalAnswerUnit : ''}"
- "${finalAnswerVal > 2 ? finalAnswerVal - 2 : finalAnswerVal + 3}${finalAnswerUnit ? ' ' + finalAnswerUnit : ''}"
- "${finalAnswerVal * 2}${finalAnswerUnit ? ' ' + finalAnswerUnit : ''}"` : ''}
`;
  } else if (activeVariant === 'standard_joined_identical_squares') {
    const count = getRandomInt(3, 6);
    const side = getRandomInt(2, 6);
    const tileA = side * side;
    const totalA = tileA * count;
    
    // targets: 0 = width, 1 = length, 2 = perimeter
    const target = getRandomInt(0, 2);
    
    const squareItems = ["square tile", "stamp", "square card", "square block", "square sticky note"];
    const item = squareItems[getRandomInt(0, squareItems.length - 1)];

    let askText = "";
    let finalAnswer = "";
    let finalAnswerVal = 0;
    let finalAnswerUnit = unit;
    let sysSolutionSteps = "";
    let hintStr = "";
    let expectedSteps = [];

    const length = side * count;
    const width = side;
    const perimeter = 2 * (length + width);

    let targetName = "";
    if (target === 0) {
      targetName = "width";
      finalAnswer = `${width} ${unit}`;
      finalAnswerVal = width;
      hintStr = "Find the area of one square, deduce its side length, which is the width of the rectangle.";
    } else if (target === 1) {
      targetName = "length";
      finalAnswer = `${length} ${unit}`;
      finalAnswerVal = length;
      hintStr = "Find the side length of one square, then multiply by the number of squares in the row.";
    } else {
      targetName = "perimeter";
      finalAnswer = `${perimeter} ${unit}`;
      finalAnswerVal = perimeter;
      hintStr = "Find the side length of one square, determine the total length and width, then calculate the perimeter.";
    }

    askText = `STORY: A student joins ${count} identical ${item}s in a straight line to form a rectangular strip. The total area of the rectangular strip is ${totalA} ${unit}². Find the ${targetName} of the rectangular strip.`;
    if (isShort) askText = `${count} identical squares are joined in a row to form a rectangle. The total area is ${totalA} ${unit}². What is the ${targetName} of the rectangle?`;
    else if (isMCQ) askText = `${count} identical squares are joined side-by-side to form a rectangle. The total area is ${totalA} ${unit}². What is the ${targetName} of the rectangle?`;

    expectedSteps.push({ label: `Write the working equation to find the area of exactly 1 ${item}:`, expectedAnswer: `${totalA} / ${count} = ${tileA}`, acceptedAnswers: [`${totalA} \\div ${count} = ${tileA}`] });
    expectedSteps.push({ label: `Write the working equation to deduce the side length of 1 ${item} (Side x Side = ${tileA}):`, expectedAnswer: `${side} x ${side} = ${tileA}`, acceptedAnswers: [] });

    if (target === 0) {
      sysSolutionSteps = `"""1. Area of 1 square = ${totalA} ÷ ${count} = ${tileA} ${unit}².\\n2. Side of 1 square = ${side} ${unit} (since ${side} x ${side} = ${tileA}).\\n3. Width of rectangle = ${side} ${unit}."""`;
      expectedSteps.push({ label: `The width of the strip is exactly one tile's side. Width:`, expectedAnswer: `${width} ${unit}`, acceptedAnswers: [`${width}${unit}`] });
    } else if (target === 1) {
      sysSolutionSteps = `"""1. Area of 1 square = ${totalA} ÷ ${count} = ${tileA} ${unit}².\\n2. Side of 1 square = ${side} ${unit} (since ${side} x ${side} = ${tileA}).\\n3. Length of rectangle = ${side} x ${count} = ${length} ${unit}."""`;
      expectedSteps.push({ label: `Write the working equation to find the total length of the strip (${count} tiles long):`, expectedAnswer: `${side} x ${count} = ${length}`, acceptedAnswers: [`${count} x ${side} = ${length}`] });
      expectedSteps.push({ label: `Length:`, expectedAnswer: `${length} ${unit}`, acceptedAnswers: [`${length}${unit}`] });
    } else {
      sysSolutionSteps = `"""1. Area of 1 square = ${totalA} ÷ ${count} = ${tileA} ${unit}².\\n2. Side of 1 square = ${side} ${unit} (since ${side} x ${side} = ${tileA}).\\n3. Length of rectangle = ${side} x ${count} = ${length} ${unit}.\\n4. Perimeter = ${length} + ${width} + ${length} + ${width} = ${perimeter} ${unit}."""`;
      expectedSteps.push({ label: `Write the working equation to find the total length of the strip (${count} tiles long):`, expectedAnswer: `${side} x ${count} = ${length}`, acceptedAnswers: [`${count} x ${side} = ${length}`] });
      expectedSteps.push({ label: `Write the working equation to find the perimeter:`, expectedAnswer: `${length} + ${width} + ${length} + ${width} = ${perimeter}`, acceptedAnswers: [`(${length} + ${width}) x 2 = ${perimeter}`, `2 x (${length} + ${width}) = ${perimeter}`] });
      expectedSteps.push({ label: `Perimeter:`, expectedAnswer: `${perimeter} ${unit}`, acceptedAnswers: [`${perimeter}${unit}`] });
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "NONE",
      componentData: {}
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: expectedSteps });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswerVal} ${finalAnswerUnit}"
- "${finalAnswerVal + 2} ${finalAnswerUnit}"
- "${finalAnswerVal > 2 ? finalAnswerVal - 2 : finalAnswerVal + 3} ${finalAnswerUnit}"
- "${finalAnswerVal * 2} ${finalAnswerUnit}"` : ''}
`;
  }
  
  return { visualEngineStr, inputRequirementStr, systemPrompt };
}
