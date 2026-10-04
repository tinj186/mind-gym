import { getRandomNames, getRandomRectangleItems } from '../../../../../utils/variable-bank.js';

export function foundationLogic(activeVariant, args) {
  const { isShort, isMCQ, isStructure, getRandomInt, unit, zodType, zodDiff, topic } = args;
  
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });
  let inputRequirementStr = "";
  let systemPrompt = "";

  const item = getRandomRectangleItems(unit)[0];
  const name = getRandomNames()[0];

  if (activeVariant === 'foundation_area_rectangle') {
    // Randomize which is unknown: 0 = Area, 1 = Length, 2 = Width
    const unknownTarget = getRandomInt(0, 2);
    const L = getRandomInt(6, 12);
    const W = getRandomInt(2, 5);
    const A = L * W;

    let askText, finalAnswer, sysSolutionSteps, expectedSteps;
    let edgeLabels = [];
    
    if (unknownTarget === 0) {
      // Find Area
      edgeLabels = [`${L} ${unit}`, `${W} ${unit}`, null, null];
      askText = `STORY: A rectangular ${item} has a length of ${L} ${unit} and a width of ${W} ${unit}. What is its area in ${unit}²?`;
      finalAnswer = `${A} ${unit}²`;
      sysSolutionSteps = `"""1. Area of rectangle = Length x Width.\\n2. Area = ${L} x ${W} = ${A} ${unit}²."""`;
      
      expectedSteps = [
        { label: `Write the working equation to find the area of the ${item} (Length x Width):`, expectedAnswer: `${L} x ${W} = ${A}`, acceptedAnswers: [`${W} x ${L} = ${A}`] },
        { label: `Area:`, expectedAnswer: `${A} ${unit}²`, acceptedAnswers: [`${A}${unit}²`] }
      ];
      
      if (isShort) askText = `A rectangle has a length of ${L} ${unit} and a width of ${W} ${unit}. Find its area.`;
      else if (isMCQ) askText = `The length of a rectangle is ${L} ${unit} and its width is ${W} ${unit}. What is its area?`;

    } else if (unknownTarget === 1) {
      // Find Length
      edgeLabels = ["?", `${W} ${unit}`, null, null];
      askText = `STORY: A rectangular ${item} has an area of ${A} ${unit}². If the width of the ${item} is ${W} ${unit}, find its length.`;
      finalAnswer = `${L} ${unit}`;
      sysSolutionSteps = `"""1. Length = Area ÷ Width.\\n2. Length = ${A} ÷ ${W} = ${L} ${unit}."""`;
      
      expectedSteps = [
        { label: `Write the working equation to find the length of the ${item} (Area ÷ Width):`, expectedAnswer: `${A} / ${W} = ${L}`, acceptedAnswers: [`${A} \\div ${W} = ${L}`] },
        { label: `Length:`, expectedAnswer: `${L} ${unit}`, acceptedAnswers: [`${L}${unit}`] }
      ];
      
      if (isShort) askText = `A rectangle has an area of ${A} ${unit}² and a width of ${W} ${unit}. What is its length?`;
      else if (isMCQ) askText = `The area of a rectangle is ${A} ${unit}². Its width is ${W} ${unit}. What is its length?`;

    } else {
      // Find Width
      edgeLabels = [`${L} ${unit}`, "?", null, null];
      askText = `STORY: A rectangular ${item} has an area of ${A} ${unit}². If the length of the ${item} is ${L} ${unit}, find its width.`;
      finalAnswer = `${W} ${unit}`;
      sysSolutionSteps = `"""1. Width = Area ÷ Length.\\n2. Width = ${A} ÷ ${L} = ${W} ${unit}."""`;
      
      expectedSteps = [
        { label: `Write the working equation to find the width of the ${item} (Area ÷ Length):`, expectedAnswer: `${A} / ${L} = ${W}`, acceptedAnswers: [`${A} \\div ${L} = ${W}`] },
        { label: `Width:`, expectedAnswer: `${W} ${unit}`, acceptedAnswers: [`${W}${unit}`] }
      ];
      
      if (isShort) askText = `A rectangle has an area of ${A} ${unit}² and a length of ${L} ${unit}. What is its width?`;
      else if (isMCQ) askText = `The area of a rectangle is ${A} ${unit}². Its length is ${L} ${unit}. What is its width?`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: [{x: 0, y: 0}, {x: L*10, y: 0}, {x: L*10, y: W*10}, {x: 0, y: W*10}],
        edgeLabels: edgeLabels,
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
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
- For content.hint, use: "Area of rectangle = Length x Width"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${unknownTarget === 0 ? A + 4 : unknownTarget === 1 ? L + 2 : W + 2} ${unknownTarget === 0 ? unit + '²' : unit}"
- "${unknownTarget === 0 ? A - 4 : unknownTarget === 1 ? L - 1 : W - 1} ${unknownTarget === 0 ? unit + '²' : unit}"
- "${unknownTarget === 0 ? L + W : A * (unknownTarget === 1 ? W : L)} ${unknownTarget === 0 ? unit + '²' : unit}"` : ''}
`;
  } else if (activeVariant === 'foundation_area_square') {
    const unknownTarget = getRandomInt(0, 1); // 0 = Area, 1 = Side
    const S = getRandomInt(4, 9);
    const A = S * S;

    let askText, finalAnswer, sysSolutionSteps, expectedSteps;
    let edgeLabels = [];
    
    if (unknownTarget === 0) {
      // Find Area
      edgeLabels = [`${S} ${unit}`, null, null, `${S} ${unit}`];
      askText = `STORY: ${name} has a square ${item}. The ${item} has a side length of ${S} ${unit}. Calculate the total area of the ${item}.`;
      finalAnswer = `${A} ${unit}²`;
      sysSolutionSteps = `"""1. Area of a square = Side x Side.\\n2. Area = ${S} x ${S} = ${A} ${unit}²."""`;
      
      expectedSteps = [
        { label: `Write the working equation to find the area of the square (Side x Side):`, expectedAnswer: `${S} x ${S} = ${A}`, acceptedAnswers: [] },
        { label: `Area:`, expectedAnswer: `${A} ${unit}²`, acceptedAnswers: [`${A}${unit}²`] }
      ];
      
      if (isShort) askText = `Find the area of a square with a side length of ${S} ${unit}.`;
      else if (isMCQ) askText = `A square has a side length of ${S} ${unit}. What is its area?`;

    } else {
      // Find Side
      edgeLabels = ["?", null, null, "?"];
      askText = `STORY: A square ${item} has an area of ${A} ${unit}². What is the length of one side of the square ${item}?`;
      finalAnswer = `${S} ${unit}`;
      sysSolutionSteps = `"""1. Area of a square = Side x Side.\\n2. Since ${S} x ${S} = ${A}, the side is ${S} ${unit}."""`;
      
      expectedSteps = [
        { label: `Write the working equation to deduce the length of one side (Side x Side = ${A}):`, expectedAnswer: `${S} x ${S} = ${A}`, acceptedAnswers: [] },
        { label: `Length of one side:`, expectedAnswer: `${S} ${unit}`, acceptedAnswers: [`${S}${unit}`] }
      ];
      
      if (isShort) askText = `A square has an area of ${A} ${unit}². Find its side length.`;
      else if (isMCQ) askText = `The area of a square is ${A} ${unit}². What is the length of one side?`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: [{x: 0, y: 0}, {x: S*10, y: 0}, {x: S*10, y: S*10}, {x: 0, y: S*10}],
        edgeLabels: edgeLabels,
        fillColor: "#fbcfe8",
        strokeColor: "#0f172a"
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
- For content.hint, use: "Area of a square = Side x Side"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${unknownTarget === 0 ? A + 10 : S + 2} ${unknownTarget === 0 ? unit + '²' : unit}"
- "${unknownTarget === 0 ? S * 4 : S - 1} ${unknownTarget === 0 ? unit + '²' : unit}"
- "${unknownTarget === 0 ? A - 4 : S * 2} ${unknownTarget === 0 ? unit + '²' : unit}"` : ''}
`;
  } else if (activeVariant === 'foundation_comparing_areas') {
    // Determine shapes: 0 = Rectangle, 1 = Square
    const typeA = getRandomInt(0, 1);
    const typeB = getRandomInt(0, 1);
    
    // Generate dimensions
    let L1, W1, S1, areaA, L2, W2, S2, areaB;
    if (typeA === 0) {
      L1 = getRandomInt(6, 10);
      W1 = getRandomInt(3, 5);
      areaA = L1 * W1;
    } else {
      S1 = getRandomInt(4, 9);
      areaA = S1 * S1;
    }
    
    // Ensure areas are not equal to avoid 0 difference, and keep it clean
    do {
      if (typeB === 0) {
        L2 = getRandomInt(6, 10);
        W2 = getRandomInt(3, 5);
        areaB = L2 * W2;
      } else {
        S2 = getRandomInt(4, 9);
        areaB = S2 * S2;
      }
    } while (areaA === areaB);

    const diff = Math.abs(areaA - areaB);
    const aIsLarger = areaA > areaB;
    const largerName = aIsLarger ? "Card A" : "Card B";
    
    // Determine what to ask for: 
    // 0 = Find Difference
    // 1 = Find missing dimension of Card A
    // 2 = Find missing dimension of Card B
    const target = getRandomInt(0, 2);

    let askText = "";
    let finalAnswer = "";
    let expectedSteps = [];
    let sysSolutionSteps = "";
    let edgeLabelsA = [];
    let edgeLabelsB = [];

    const getShapeName = (type) => type === 0 ? "rectangular" : "square";
    const shapeAName = getShapeName(typeA);
    const shapeBName = getShapeName(typeB);

    if (target === 0) {
      // Find difference
      if (typeA === 0) edgeLabelsA = [`${L1} ${unit}`, `${W1} ${unit}`, null, null];
      else edgeLabelsA = [`${S1} ${unit}`, null, null, `${S1} ${unit}`];
      
      if (typeB === 0) edgeLabelsB = [`${L2} ${unit}`, `${W2} ${unit}`, null, null];
      else edgeLabelsB = [`${S2} ${unit}`, null, null, `${S2} ${unit}`];

      askText = `STORY: ${name} has a ${shapeAName} blue card (Card A) that measures ${typeA === 0 ? `${L1} ${unit} by ${W1} ${unit}` : `with a side of ${S1} ${unit}`}. He has a ${shapeBName} red card (Card B) ${typeB === 0 ? `measuring ${L2} ${unit} by ${W2} ${unit}` : `with a side of ${S2} ${unit}`}. Find the difference in area between the two cards.`;
      
      if (isShort) askText = `Card A is a ${shapeAName} card ${typeA === 0 ? `(${L1}x${W1} ${unit})` : `(side ${S1} ${unit})`}. Card B is a ${shapeBName} card ${typeB === 0 ? `(${L2}x${W2} ${unit})` : `(side ${S2} ${unit})`}. What is the difference in area?`;
      else if (isMCQ) askText = `Card A is a ${shapeAName} card ${typeA === 0 ? `(${L1}x${W1} ${unit})` : `(side ${S1} ${unit})`}. Card B is a ${shapeBName} card ${typeB === 0 ? `(${L2}x${W2} ${unit})` : `(side ${S2} ${unit})`}. What is the difference in area?`;

      finalAnswer = `${diff} ${unit}²`;
      sysSolutionSteps = `"""1. Area of Card A = ${areaA} ${unit}².\\n2. Area of Card B = ${areaB} ${unit}².\\n3. Difference = ${Math.max(areaA, areaB)} - ${Math.min(areaA, areaB)} = ${diff} ${unit}²."""`;

      expectedSteps = [
        { label: `Write the working equation to find the area of Card A:`, expectedAnswer: typeA === 0 ? `${L1} x ${W1} = ${areaA}` : `${S1} x ${S1} = ${areaA}`, acceptedAnswers: typeA === 0 ? [`${W1} x ${L1} = ${areaA}`] : [] },
        { label: `Write the working equation to find the area of Card B:`, expectedAnswer: typeB === 0 ? `${L2} x ${W2} = ${areaB}` : `${S2} x ${S2} = ${areaB}`, acceptedAnswers: typeB === 0 ? [`${W2} x ${L2} = ${areaB}`] : [] },
        { label: "Write the working equation to find the difference in area:", expectedAnswer: `${Math.max(areaA, areaB)} - ${Math.min(areaA, areaB)} = ${diff}`, acceptedAnswers: [] },
        { label: `Difference in area:`, expectedAnswer: `${diff} ${unit}²`, acceptedAnswers: [`${diff}${unit}²`] }
      ];

    } else if (target === 1) {
      // Find missing dimension of A
      let missingDimStr = typeA === 0 ? "length" : "side length";
      let missingVal = typeA === 0 ? L1 : S1;
      
      if (typeA === 0) {
        // Find Length A
        edgeLabelsA = ["?", `${W1} ${unit}`, null, null];
      } else {
        // Find Side A
        edgeLabelsA = ["?", null, null, "?"];
      }

      if (typeB === 0) edgeLabelsB = [`${L2} ${unit}`, `${W2} ${unit}`, null, null];
      else edgeLabelsB = [`${S2} ${unit}`, null, null, `${S2} ${unit}`];

      askText = `STORY: ${name} has a ${shapeAName} blue card (Card A) and a ${shapeBName} red card (Card B) ${typeB === 0 ? `measuring ${L2} ${unit} by ${W2} ${unit}` : `with a side of ${S2} ${unit}`}. The area of ${largerName} is ${diff} ${unit}² larger than the other card. ${typeA === 0 ? `If Card A has a width of ${W1} ${unit}` : `Since Card A is a square`}, find the ${missingDimStr} of Card A.`;
      
      if (isShort) askText = `Card A (${shapeAName}) is ${diff} ${unit}² ${aIsLarger ? 'larger' : 'smaller'} than Card B ${typeB === 0 ? `(${L2}x${W2} ${unit})` : `(side ${S2} ${unit})`}. Find Card A's ${missingDimStr}.`;
      else if (isMCQ) askText = `Card A (${shapeAName}) is ${diff} ${unit}² ${aIsLarger ? 'larger' : 'smaller'} than Card B ${typeB === 0 ? `(${L2}x${W2} ${unit})` : `(side ${S2} ${unit})`}. What is the ${missingDimStr} of Card A?`;

      finalAnswer = `${missingVal} ${unit}`;
      sysSolutionSteps = `"""1. Area of Card B = ${areaB} ${unit}².\\n2. Area of Card A = ${areaB} ${aIsLarger ? '+' : '-'} ${diff} = ${areaA} ${unit}².\\n3. ${missingDimStr === 'length' ? `Length = Area ÷ Width = ${areaA} ÷ ${W1} = ${L1} ${unit}` : `Since Side x Side = ${areaA}, Side = ${S1} ${unit}`}."""`;

      expectedSteps = [
        { label: `Write the working equation to find the area of Card B:`, expectedAnswer: typeB === 0 ? `${L2} x ${W2} = ${areaB}` : `${S2} x ${S2} = ${areaB}`, acceptedAnswers: typeB === 0 ? [`${W2} x ${L2} = ${areaB}`] : [] },
        { label: `Write the working equation to find the area of Card A:`, expectedAnswer: aIsLarger ? `${areaB} + ${diff} = ${areaA}` : `${areaB} - ${diff} = ${areaA}`, acceptedAnswers: aIsLarger ? [`${diff} + ${areaB} = ${areaA}`] : [] },
        { label: `Write the working equation to deduce the ${missingDimStr} of Card A:`, expectedAnswer: typeA === 0 ? `${areaA} / ${W1} = ${L1}` : `${S1} x ${S1} = ${areaA}`, acceptedAnswers: typeA === 0 ? [`${areaA} \\div ${W1} = ${L1}`] : [] },
        { label: `${missingDimStr.charAt(0).toUpperCase() + missingDimStr.slice(1)}:`, expectedAnswer: `${missingVal} ${unit}`, acceptedAnswers: [`${missingVal}${unit}`] }
      ];
      
    } else {
      // Find missing dimension of B
      let missingDimStr = typeB === 0 ? "length" : "side length";
      let missingVal = typeB === 0 ? L2 : S2;
      
      if (typeA === 0) edgeLabelsA = [`${L1} ${unit}`, `${W1} ${unit}`, null, null];
      else edgeLabelsA = [`${S1} ${unit}`, null, null, `${S1} ${unit}`];

      if (typeB === 0) {
        edgeLabelsB = ["?", `${W2} ${unit}`, null, null];
      } else {
        edgeLabelsB = ["?", null, null, "?"];
      }

      askText = `STORY: ${name} has a ${shapeAName} blue card (Card A) ${typeA === 0 ? `measuring ${L1} ${unit} by ${W1} ${unit}` : `with a side of ${S1} ${unit}`}. He also has a ${shapeBName} red card (Card B). The area of ${largerName} is ${diff} ${unit}² larger than the other card. ${typeB === 0 ? `If Card B has a width of ${W2} ${unit}` : `Since Card B is a square`}, find the ${missingDimStr} of Card B.`;
      
      if (isShort) askText = `Card B (${shapeBName}) is ${diff} ${unit}² ${!aIsLarger ? 'larger' : 'smaller'} than Card A ${typeA === 0 ? `(${L1}x${W1} ${unit})` : `(side ${S1} ${unit})`}. Find Card B's ${missingDimStr}.`;
      else if (isMCQ) askText = `Card B (${shapeBName}) is ${diff} ${unit}² ${!aIsLarger ? 'larger' : 'smaller'} than Card A ${typeA === 0 ? `(${L1}x${W1} ${unit})` : `(side ${S1} ${unit})`}. What is the ${missingDimStr} of Card B?`;

      finalAnswer = `${missingVal} ${unit}`;
      sysSolutionSteps = `"""1. Area of Card A = ${areaA} ${unit}².\\n2. Area of Card B = ${areaA} ${!aIsLarger ? '+' : '-'} ${diff} = ${areaB} ${unit}².\\n3. ${missingDimStr === 'length' ? `Length = Area ÷ Width = ${areaB} ÷ ${W2} = ${L2} ${unit}` : `Since Side x Side = ${areaB}, Side = ${S2} ${unit}`}."""`;

      expectedSteps = [
        { label: `Write the working equation to find the area of Card A:`, expectedAnswer: typeA === 0 ? `${L1} x ${W1} = ${areaA}` : `${S1} x ${S1} = ${areaA}`, acceptedAnswers: typeA === 0 ? [`${W1} x ${L1} = ${areaA}`] : [] },
        { label: `Write the working equation to find the area of Card B:`, expectedAnswer: !aIsLarger ? `${areaA} + ${diff} = ${areaB}` : `${areaA} - ${diff} = ${areaB}`, acceptedAnswers: !aIsLarger ? [`${diff} + ${areaA} = ${areaB}`] : [] },
        { label: `Write the working equation to deduce the ${missingDimStr} of Card B:`, expectedAnswer: typeB === 0 ? `${areaB} / ${W2} = ${L2}` : `${S2} x ${S2} = ${areaB}`, acceptedAnswers: typeB === 0 ? [`${areaB} \\div ${W2} = ${L2}`] : [] },
        { label: `${missingDimStr.charAt(0).toUpperCase() + missingDimStr.slice(1)}:`, expectedAnswer: `${missingVal} ${unit}`, acceptedAnswers: [`${missingVal}${unit}`] }
      ];
    }

    // Geometry data
    const polyA = {
      vertices: typeA === 0 
        ? [{x: 0, y: 0}, {x: L1*10, y: 0}, {x: L1*10, y: W1*10}, {x: 0, y: W1*10}]
        : [{x: 0, y: 0}, {x: S1*10, y: 0}, {x: S1*10, y: S1*10}, {x: 0, y: S1*10}],
      edgeLabels: edgeLabelsA,
      fillColor: "#bfdbfe"
    };

    const polyB = {
      vertices: typeB === 0
        ? [{x: 0, y: 0}, {x: L2*10, y: 0}, {x: L2*10, y: W2*10}, {x: 0, y: W2*10}]
        : [{x: 0, y: 0}, {x: S2*10, y: 0}, {x: S2*10, y: S2*10}, {x: 0, y: S2*10}],
      edgeLabels: edgeLabelsB,
      fillColor: "#fecaca"
    };

    visualEngineStr = JSON.stringify({
      componentToRender: "MULTI_COMPONENT",
      componentData: {
        components: [
          {
            componentToRender: "GEOMETRY_POLYGON",
            componentData: polyA
          },
          {
            componentToRender: "GEOMETRY_POLYGON",
            componentData: polyB
          }
        ]
      }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: expectedSteps
      });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    let finalAnswerVal = target === 0 ? diff : target === 1 ? (typeA === 0 ? L1 : S1) : (typeB === 0 ? L2 : S2);
    let finalAnswerUnit = target === 0 ? `${unit}²` : unit;

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "Calculate known areas first. If given the difference, add or subtract it to find the other area."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswerVal} ${finalAnswerUnit}"
- "${finalAnswerVal + 2} ${finalAnswerUnit}"
- "${finalAnswerVal > 2 ? finalAnswerVal - 2 : finalAnswerVal + 4} ${finalAnswerUnit}"
- "${finalAnswerVal * 2} ${finalAnswerUnit}"` : ''}
`;
  } else if (activeVariant === 'foundation_total_area_identical') {
    const isSquare = getRandomInt(0, 1) === 0;
    const count = getRandomInt(3, 6);
    let L, W, S, areaOne;
    
    if (isSquare) {
      S = getRandomInt(4, 9);
      areaOne = S * S;
    } else {
      L = getRandomInt(5, 10);
      W = getRandomInt(2, 5);
      areaOne = L * W;
    }
    
    const totalArea = areaOne * count;

    // Verb based on unit to make it sound natural
    const action = unit === 'cm' 
      ? ["has", "makes", "cuts out", "buys"][getRandomInt(0, 3)] 
      : ["has", "builds", "paints", "cleans"][getRandomInt(0, 3)];

    const shapeName = isSquare ? "square" : "rectangular";

    // 0 = Find totalArea
    // 1 = Find count
    // 2 = Find missing dimension (L or S)
    const target = getRandomInt(0, 2);

    let askText = "";
    let expectedSteps = [];
    let sysSolutionSteps = "";
    let finalAnswer = "";
    let finalAnswerVal = 0;
    let finalAnswerUnit = "";

    if (target === 0) {
      // Find totalArea
      askText = `STORY: ${name} ${action} ${count} identical ${shapeName} ${item}s. Each ${item} ${isSquare ? `has a side of ${S} ${unit}` : `measures ${L} ${unit} by ${W} ${unit}`}. What is the total area of all ${count} ${item}s?`;
      if (isShort) askText = `There are ${count} identical ${shapeName} ${item}s. Each is ${isSquare ? `a square with side ${S} ${unit}` : `${L} ${unit} by ${W} ${unit}`}. What is their total area?`;
      else if (isMCQ) askText = `What is the total area of ${count} identical ${shapeName} ${item}s if each is ${isSquare ? `a square with side ${S} ${unit}` : `${L} ${unit} by ${W} ${unit}`}?`;

      finalAnswerVal = totalArea;
      finalAnswerUnit = `${unit}²`;
      finalAnswer = `${totalArea} ${unit}²`;
      sysSolutionSteps = `"""1. Area of 1 ${item} = ${isSquare ? `${S} x ${S}` : `${L} x ${W}`} = ${areaOne} ${unit}².\\n2. Total area = ${areaOne} x ${count} = ${totalArea} ${unit}²."""`;

      expectedSteps = [
        { label: `Write the working equation to find the area of 1 ${item}:`, expectedAnswer: isSquare ? `${S} x ${S} = ${areaOne}` : `${L} x ${W} = ${areaOne}`, acceptedAnswers: isSquare ? [] : [`${W} x ${L} = ${areaOne}`] },
        { label: `Write the working equation to find the total area of ${count} ${item}s:`, expectedAnswer: `${areaOne} x ${count} = ${totalArea}`, acceptedAnswers: [`${count} x ${areaOne} = ${totalArea}`] },
        { label: `Total area:`, expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}${unit}²`] }
      ];
    } else if (target === 1) {
      // Find count
      askText = `STORY: ${name} ${action} some identical ${shapeName} ${item}s. Each ${item} ${isSquare ? `has a side of ${S} ${unit}` : `measures ${L} ${unit} by ${W} ${unit}`}. If the total area of all the ${item}s is ${totalArea} ${unit}², how many ${item}s did ${name} ${action}?`;
      if (isShort) askText = `Identical ${shapeName} ${item}s each measuring ${isSquare ? `side ${S} ${unit}` : `${L}x${W} ${unit}`} have a total area of ${totalArea} ${unit}². How many ${item}s are there?`;
      else if (isMCQ) askText = `Identical ${shapeName} ${item}s each measuring ${isSquare ? `side ${S} ${unit}` : `${L}x${W} ${unit}`} have a total area of ${totalArea} ${unit}². How many ${item}s are there?`;

      finalAnswerVal = count;
      finalAnswerUnit = ``;
      finalAnswer = `${count}`;
      sysSolutionSteps = `"""1. Area of 1 ${item} = ${isSquare ? `${S} x ${S}` : `${L} x ${W}`} = ${areaOne} ${unit}².\\n2. Number of ${item}s = Total Area ÷ Area of 1 ${item} = ${totalArea} ÷ ${areaOne} = ${count}."""`;

      expectedSteps = [
        { label: `Write the working equation to find the area of 1 ${item}:`, expectedAnswer: isSquare ? `${S} x ${S} = ${areaOne}` : `${L} x ${W} = ${areaOne}`, acceptedAnswers: isSquare ? [] : [`${W} x ${L} = ${areaOne}`] },
        { label: `Write the working equation to find the number of ${item}s:`, expectedAnswer: `${totalArea} / ${areaOne} = ${count}`, acceptedAnswers: [`${totalArea} \\div ${areaOne} = ${count}`] },
        { label: `Number of ${item}s:`, expectedAnswer: `${count}`, acceptedAnswers: [] }
      ];
    } else {
      // Find missing dimension (L or S)
      if (isSquare) {
        askText = `STORY: ${name} ${action} ${count} identical ${shapeName} ${item}s. The total area of all ${count} ${item}s is ${totalArea} ${unit}². What is the side length of one ${item}?`;
        if (isShort) askText = `There are ${count} identical ${shapeName} ${item}s with a total area of ${totalArea} ${unit}². Find the side length of one ${item}.`;
        else if (isMCQ) askText = `There are ${count} identical ${shapeName} ${item}s with a total area of ${totalArea} ${unit}². What is the side length of one ${item}?`;
        
        finalAnswerVal = S;
        finalAnswerUnit = unit;
        finalAnswer = `${S} ${unit}`;
        sysSolutionSteps = `"""1. Area of 1 ${item} = ${totalArea} ÷ ${count} = ${areaOne} ${unit}².\\n2. Since Side x Side = ${areaOne}, Side = ${S} ${unit}."""`;

        expectedSteps = [
          { label: `Write the working equation to find the area of 1 ${item}:`, expectedAnswer: `${totalArea} / ${count} = ${areaOne}`, acceptedAnswers: [`${totalArea} \\div ${count} = ${areaOne}`] },
          { label: `Write the working equation to deduce the side length of 1 ${item}:`, expectedAnswer: `${S} x ${S} = ${areaOne}`, acceptedAnswers: [] },
          { label: `Side length:`, expectedAnswer: `${S} ${unit}`, acceptedAnswers: [`${S}${unit}`] }
        ];
      } else {
        askText = `STORY: ${name} ${action} ${count} identical ${shapeName} ${item}s. The total area of all ${count} ${item}s is ${totalArea} ${unit}². If the width of each ${item} is ${W} ${unit}, what is the length of one ${item}?`;
        if (isShort) askText = `There are ${count} identical ${shapeName} ${item}s with a total area of ${totalArea} ${unit}². Each has a width of ${W} ${unit}. Find its length.`;
        else if (isMCQ) askText = `There are ${count} identical ${shapeName} ${item}s with a total area of ${totalArea} ${unit}². Each has a width of ${W} ${unit}. What is its length?`;

        finalAnswerVal = L;
        finalAnswerUnit = unit;
        finalAnswer = `${L} ${unit}`;
        sysSolutionSteps = `"""1. Area of 1 ${item} = ${totalArea} ÷ ${count} = ${areaOne} ${unit}².\\n2. Length = Area ÷ Width = ${areaOne} ÷ ${W} = ${L} ${unit}."""`;

        expectedSteps = [
          { label: `Write the working equation to find the area of 1 ${item}:`, expectedAnswer: `${totalArea} / ${count} = ${areaOne}`, acceptedAnswers: [`${totalArea} \\div ${count} = ${areaOne}`] },
          { label: `Write the working equation to deduce the length of 1 ${item}:`, expectedAnswer: `${areaOne} / ${W} = ${L}`, acceptedAnswers: [`${areaOne} \\div ${W} = ${L}`] },
          { label: `Length:`, expectedAnswer: `${L} ${unit}`, acceptedAnswers: [`${L}${unit}`] }
        ];
      }
    }

    visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: expectedSteps
      });
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
- For content.hint, use: "${target === 0 ? "Find the area of 1 item first, then multiply by the total number of items." : target === 1 ? "Find the area of 1 item first, then divide the total area by it." : "Find the area of 1 item first, then divide by the known side to find the missing side."}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswerVal} ${finalAnswerUnit}".trim()
- "${finalAnswerVal + 2} ${finalAnswerUnit}".trim()
- "${finalAnswerVal > 2 ? finalAnswerVal - 1 : finalAnswerVal + 3} ${finalAnswerUnit}".trim()
- "${finalAnswerVal * 2} ${finalAnswerUnit}".trim()` : ''}
`;
  } else if (activeVariant === 'foundation_area_cost_multiplier') {
    const L = getRandomInt(4, 9);
    const W = getRandomInt(3, 6);
    const costPer = getRandomInt(2, 5);
    const area = L * W;
    
    // Scenarios
    const scenarios = [
      { action: "planting turf", surface: "patch of land", material: "turf" },
      { action: "laying carpet", surface: "floor", material: "carpet" },
      { action: "painting", surface: "wall", material: "paint" },
      { action: "installing glass", surface: "window", material: "glass" },
      { action: "laying tiles", surface: "floor", material: "tiles" }
    ];
    const scenario = scenarios[getRandomInt(0, scenarios.length - 1)];

    // Target:
    // 0 = Find total cost
    // 1 = Find cost per unit area
    // 2 = Given budget, find uncovered area
    const target = getRandomInt(0, 2);

    let askText = "";
    let expectedSteps = [];
    let sysSolutionSteps = "";
    let finalAnswer = "";
    let finalAnswerVal = 0;
    let finalAnswerUnit = "";
    let hintStr = "";

    if (target === 0) {
      // Find total cost
      const totalCost = area * costPer;
      askText = `STORY: A worker is ${scenario.action} on a rectangular ${scenario.surface}. The ${scenario.surface} is ${L} ${unit} long and ${W} ${unit} wide. The ${scenario.material} costs $${costPer} for every ${unit}². Calculate the total cost to cover the entire ${scenario.surface}.`;
      if (isShort) askText = `A ${L} ${unit} by ${W} ${unit} rectangular ${scenario.surface} needs ${scenario.material}. It costs $${costPer} per ${unit}². What is the total cost?`;
      else if (isMCQ) askText = `${scenario.material.charAt(0).toUpperCase() + scenario.material.slice(1)} costs $${costPer} per ${unit}². A rectangular ${scenario.surface} is ${L} ${unit} by ${W} ${unit}. What is the total cost?`;

      finalAnswerVal = totalCost;
      finalAnswerUnit = `$`;
      finalAnswer = `$${totalCost}`;
      hintStr = `Find the total area first, then multiply by the cost per ${unit}².`;
      sysSolutionSteps = `"""1. Area = ${L} x ${W} = ${area} ${unit}².\\n2. Total cost = ${area} x $${costPer} = $${totalCost}."""`;

      expectedSteps = [
        { label: `Write the working equation to find the area of the rectangular ${scenario.surface}:`, expectedAnswer: `${L} x ${W} = ${area}`, acceptedAnswers: [`${W} x ${L} = ${area}`] },
        { label: `Write the working equation to find the total cost of the ${scenario.material}:`, expectedAnswer: `${area} x ${costPer} = ${totalCost}`, acceptedAnswers: [`${costPer} x ${area} = ${totalCost}`] },
        { label: `Total cost:`, expectedAnswer: `$${totalCost}`, acceptedAnswers: [`${totalCost}`] }
      ];
    } else if (target === 1) {
      // Find cost per unit
      const totalCost = area * costPer;
      askText = `STORY: A worker is ${scenario.action} on a rectangular ${scenario.surface}. The ${scenario.surface} is ${L} ${unit} long and ${W} ${unit} wide. If the total cost to cover the entire ${scenario.surface} is $${totalCost}, calculate the cost of the ${scenario.material} for every ${unit}².`;
      if (isShort) askText = `The total cost to cover a ${L} ${unit} by ${W} ${unit} rectangular ${scenario.surface} with ${scenario.material} is $${totalCost}. What is the cost per ${unit}²?`;
      else if (isMCQ) askText = `The total cost to cover a ${L} ${unit} by ${W} ${unit} rectangular ${scenario.surface} with ${scenario.material} is $${totalCost}. What is the cost per ${unit}²?`;

      finalAnswerVal = costPer;
      finalAnswerUnit = `$`;
      finalAnswer = `$${costPer}`;
      hintStr = `Find the total area first, then divide the total cost by the area.`;
      sysSolutionSteps = `"""1. Area = ${L} x ${W} = ${area} ${unit}².\\n2. Cost per ${unit}² = $${totalCost} ÷ ${area} = $${costPer}."""`;

      expectedSteps = [
        { label: `Write the working equation to find the area of the rectangular ${scenario.surface}:`, expectedAnswer: `${L} x ${W} = ${area}`, acceptedAnswers: [`${W} x ${L} = ${area}`] },
        { label: `Write the working equation to find the cost per ${unit}²:`, expectedAnswer: `${totalCost} / ${area} = ${costPer}`, acceptedAnswers: [`${totalCost} \\div ${area} = ${costPer}`] },
        { label: `Cost per ${unit}²:`, expectedAnswer: `$${costPer}`, acceptedAnswers: [`${costPer}`] }
      ];
    } else {
      // Budget / Uncovered area
      const uncovered = getRandomInt(2, area - 4);
      const coveredArea = area - uncovered;
      const budget = coveredArea * costPer;
      
      askText = `STORY: A worker is ${scenario.action} on a rectangular ${scenario.surface}. The ${scenario.surface} is ${L} ${unit} long and ${W} ${unit} wide. The ${scenario.material} costs $${costPer} for every ${unit}². If the worker only has a budget of $${budget}, calculate the area of the ${scenario.surface} that is left uncovered.`;
      if (isShort) askText = `A ${L} ${unit} by ${W} ${unit} ${scenario.surface} needs ${scenario.material} at $${costPer} per ${unit}². With a budget of $${budget}, how much area is left uncovered?`;
      else if (isMCQ) askText = `A ${L} ${unit} by ${W} ${unit} ${scenario.surface} needs ${scenario.material} at $${costPer} per ${unit}². With a budget of $${budget}, how much area is left uncovered?`;

      finalAnswerVal = uncovered;
      finalAnswerUnit = `${unit}²`;
      finalAnswer = `${uncovered} ${unit}²`;
      hintStr = `Find the total area, calculate how much area the budget can cover, and then subtract.`;
      sysSolutionSteps = `"""1. Total Area = ${L} x ${W} = ${area} ${unit}².\\n2. Area covered by budget = $${budget} ÷ $${costPer} = ${coveredArea} ${unit}².\\n3. Area uncovered = ${area} - ${coveredArea} = ${uncovered} ${unit}²."""`;

      expectedSteps = [
        { label: `Write the working equation to find the total area of the ${scenario.surface}:`, expectedAnswer: `${L} x ${W} = ${area}`, acceptedAnswers: [`${W} x ${L} = ${area}`] },
        { label: `Write the working equation to find the area covered by the budget:`, expectedAnswer: `${budget} / ${costPer} = ${coveredArea}`, acceptedAnswers: [`${budget} \\div ${costPer} = ${coveredArea}`] },
        { label: `Write the working equation to find the uncovered area:`, expectedAnswer: `${area} - ${coveredArea} = ${uncovered}`, acceptedAnswers: [] },
        { label: `Uncovered area:`, expectedAnswer: `${uncovered} ${unit}²`, acceptedAnswers: [`${uncovered}${unit}²`] }
      ];
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: [{x: 0, y: 0}, {x: L*10, y: 0}, {x: L*10, y: W*10}, {x: 0, y: W*10}],
        edgeLabels: [`${L} ${unit}`, `${W} ${unit}`, null, null],
        fillColor: "#bbf7d0",
        strokeColor: "#166534"
      }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: expectedSteps
      });
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
- "${finalAnswerVal}${target < 2 ? '' : ' '}${finalAnswerUnit}"
- "${finalAnswerVal + 2}${target < 2 ? '' : ' '}${finalAnswerUnit}"
- "${finalAnswerVal > 2 ? finalAnswerVal - 2 : finalAnswerVal + 4}${target < 2 ? '' : ' '}${finalAnswerUnit}"
- "${finalAnswerVal * 2}${target < 2 ? '' : ' '}${finalAnswerUnit}"` : ''}
`;
  }
  
  return { visualEngineStr, inputRequirementStr, systemPrompt };
}

