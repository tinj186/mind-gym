import { getRandomNames, getRandomLocations, getRandomLengthItems } from '../../../../../utils/variable-bank.js';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const foundationLogic = (activeVariant, isMCQ, isShort, isStructure, topic, zodType, zodDiff, getFormatInstructions) => {
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });
  let inputRequirementStr = "";
  let systemPrompt = ``;

  const unit = Math.random() < 0.5 ? "cm" : "m";
  const person = getRandomNames(1)[0];
  const mPlaces = ["garden", "playground", "room", "hall", "park"];
  const cmItems = ["photo frame", "card", "stamp", "tile", "sticker", "piece of cardboard", "label"];
  const item = unit === "m" ? mPlaces[getRandomInt(0, mPlaces.length - 1)] : cmItems[getRandomInt(0, cmItems.length - 1)];

  if (activeVariant === 'foundation_perimeter_square') {
    // 4×S = P
    const side = getRandomInt(4, 15);
    const perimeter = side * 4;
    
    // Mode 1: Given Side, find P. Mode 2: Given P, find Side.
    const mode = getRandomInt(1, 2); 
    
    let askText = "";
    let finalAnswer = "";
    let sysSolutionSteps = "";
    
    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: [{x: 0, y: 0}, {x: side*10, y: 0}, {x: side*10, y: side*10}, {x: 0, y: side*10}],
        edgeLabels: [
          mode === 1 ? `${side} ${unit}` : "?", 
          null, 
          null, 
          null
        ],
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });

    if (mode === 1) {
      askText = `STORY: ${person} has a square ${item}. The length of one side is ${side} ${unit}. What is the perimeter of the ${item}?`;
      finalAnswer = `${perimeter} ${unit}`;
      sysSolutionSteps = `"""1. A square has 4 equal sides.\\n2. Perimeter = ${side} x 4 = ${perimeter} ${unit}."""`;
      
      if (isShort) {
        askText = `A square has a side of ${side} ${unit}. What is its perimeter?`;
      } else if (isMCQ) {
        askText = `The side of a square is ${side} ${unit}. What is its perimeter?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the perimeter:", expectedAnswer: `${side} x 4 = ${perimeter}`, acceptedAnswers: [`4 x ${side} = ${perimeter}`, `${side} + ${side} + ${side} + ${side} = ${perimeter}`] },
            { label: `Final perimeter:`, expectedAnswer: `${perimeter} ${unit}`, acceptedAnswers: [`${perimeter}${unit}`] }
          ]
        });
      }
    } else {
      askText = `STORY: ${person} has a square ${item}. The total perimeter of the ${item} is ${perimeter} ${unit}. Find the length of one side of the ${item}.`;
      finalAnswer = `${side} ${unit}`;
      sysSolutionSteps = `"""1. A square has 4 equal sides.\\n2. Length of one side = ${perimeter} / 4 = ${side} ${unit}."""`;
      
      if (isShort) {
        askText = `A square has a perimeter of ${perimeter} ${unit}. What is the length of one side?`;
      } else if (isMCQ) {
        askText = `The perimeter of a square is ${perimeter} ${unit}. What is its side?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the length of one side:", expectedAnswer: `${perimeter} / 4 = ${side}`, acceptedAnswers: [`${perimeter} \\\\div 4 = ${side}`] },
            { label: `Length of one side:`, expectedAnswer: `${side} ${unit}`, acceptedAnswers: [`${side}${unit}`] }
          ]
        });
      }
    }

    if (!isStructure && !isMCQ) {
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
- For content.hint, use: "${mode === 1 ? 'Multiply the side by 4.' : 'Divide the perimeter by 4.'}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${mode === 1 ? (side * 2) : (perimeter / 2)} ${unit}"
- "${mode === 1 ? (side * 3) : (perimeter * 4)} ${unit}"
- "${mode === 1 ? (side + 4) : (perimeter - 4)} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'foundation_perimeter_rectangle') {
    const L = getRandomInt(6, 15);
    const W = getRandomInt(2, L - 1);
    const P = 2 * (L + W);
    
    // Mode 1: Given L & W, find P. Mode 2: Given P & W, find L.
    const mode = getRandomInt(1, 2);

    let askText = "";
    let finalAnswer = "";
    let sysSolutionSteps = "";

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: [{x: 0, y: 0}, {x: L*10, y: 0}, {x: L*10, y: W*10}, {x: 0, y: W*10}],
        edgeLabels: [
          mode === 1 ? `${L} ${unit}` : "?", 
          `${W} ${unit}`, 
          null, 
          null
        ],
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });

    if (mode === 1) {
      askText = `STORY: ${person} draws a rectangular ${item}. It has a length of ${L} ${unit} and a width of ${W} ${unit}. What is the perimeter of the ${item}?`;
      finalAnswer = `${P} ${unit}`;
      sysSolutionSteps = `"""1. Length = ${L} ${unit}, Width = ${W} ${unit}.\\n2. Perimeter = ${L} + ${W} + ${L} + ${W} = ${P} ${unit}."""`;
      
      if (isShort) {
        askText = `A rectangle is ${L} ${unit} long and ${W} ${unit} wide. Find its perimeter.`;
      } else if (isMCQ) {
        askText = `The length of a rectangle is ${L} ${unit} and its width is ${W} ${unit}. Perimeter?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the total length of the two known widths:", expectedAnswer: `${W} + ${W} = ${W*2}`, acceptedAnswers: [`${W} x 2 = ${W*2}`] },
            { label: "Write the working equation to find the total length of the two known lengths:", expectedAnswer: `${L} + ${L} = ${L*2}`, acceptedAnswers: [`${L} x 2 = ${L*2}`] },
            { label: "Write the working equation to find the total perimeter:", expectedAnswer: `${L*2} + ${W*2} = ${P}`, acceptedAnswers: [`${L} + ${W} + ${L} + ${W} = ${P}`] },
            { label: `Final perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
          ]
        });
      }
    } else {
      askText = `STORY: ${person} has a rectangular ${item}. The total perimeter is ${P} ${unit}. If the width is ${W} ${unit}, calculate the length of the ${item}.`;
      finalAnswer = `${L} ${unit}`;
      sysSolutionSteps = `"""1. Total perimeter = ${P} ${unit}. Two widths = ${W} + ${W} = ${W*2} ${unit}.\\n2. Remaining perimeter for the two lengths = ${P} - ${W*2} = ${P - W*2} ${unit}.\\n3. Length = ${P - W*2} / 2 = ${L} ${unit}."""`;
      
      if (isShort) {
        askText = `The perimeter of a rectangle is ${P} ${unit}. Its width is ${W} ${unit}. Find its length.`;
      } else if (isMCQ) {
        askText = `Perimeter is ${P} ${unit}, width is ${W} ${unit}. What is the length?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the total length of the two known widths:", expectedAnswer: `${W} + ${W} = ${W*2}`, acceptedAnswers: [`${W} x 2 = ${W*2}`] },
            { label: "Write the working equation to find the remaining perimeter for the two lengths:", expectedAnswer: `${P} - ${W*2} = ${P - W*2}`, acceptedAnswers: [] },
            { label: "Write the working equation to find one length:", expectedAnswer: `${P - W*2} / 2 = ${L}`, acceptedAnswers: [`${P - W*2} \\\\div 2 = ${L}`] },
            { label: `Final length:`, expectedAnswer: `${L} ${unit}`, acceptedAnswers: [`${L}${unit}`] }
          ]
        });
      }
    }

    if (!isStructure && !isMCQ) {
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
- For content.hint, use: "${mode === 1 ? 'Add all 4 sides together: Length + Width + Length + Width.' : 'Subtract the two widths from the perimeter, then divide by 2.'}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${mode === 1 ? (L + W) : (P - W)} ${unit}"
- "${mode === 1 ? (L * W) : ((P - W)/2)} ${unit}"
- "${mode === 1 ? (P + 2) : (L + W)} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'foundation_simple_rectilinear') {
    const s1 = getRandomInt(4, 10);
    const s2 = getRandomInt(3, 8);
    const s3 = getRandomInt(3, 8);
    const s4 = getRandomInt(4, 10);
    const s5 = Math.abs(s1 - s3) || 2;
    const s6 = s2 + s4; 
    
    // Let's use an irregular pentagon to keep it simple, or L-shape with all sides known
    // Let's do an L-shape where all 6 sides are known.
    // L-shape vertices: (0,0), (s1, 0), (s1, s2), (s1-s3, s2), (s1-s3, s2+s4), (0, s2+s4)
    // Actually, to ensure simple geometry: (0,0) to (W, 0) to (W, H1) to (W2, H1) to (W2, H) to (0, H)
    const W = getRandomInt(8, 12);
    const H1 = getRandomInt(4, 7);
    const W2 = getRandomInt(3, W-2);
    const H = H1 + getRandomInt(4, 7);

    const sides = [
      W, 
      H1, 
      W - W2, 
      H - H1, 
      W2, 
      H
    ];
    const P = sides.reduce((a, b) => a + b, 0);
    
    // Mode 1: All sides known, find P. Mode 2: P known, one side missing.
    const mode = getRandomInt(1, 2);
    const missingIndex = getRandomInt(0, 5);
    const missingSide = sides[missingIndex];
    const knownSum = P - missingSide;

    let edgeLabels = sides.map(s => `${s} ${unit}`);
    if (mode === 2) {
      edgeLabels[missingIndex] = "?";
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: [
          {x: 0, y: 0}, 
          {x: W*10, y: 0}, 
          {x: W*10, y: H1*10}, 
          {x: W2*10, y: H1*10}, 
          {x: W2*10, y: H*10}, 
          {x: 0, y: H*10}
        ],
        edgeLabels: edgeLabels,
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });

    let askText = "";
    let finalAnswer = "";
    let sysSolutionSteps = "";

    if (mode === 1) {
      askText = `STORY: ${person} builds a rectilinear ${item}. The six sides measure ${sides.join(', ')} ${unit}. What is the total perimeter of the ${item}?`;
      finalAnswer = `${P} ${unit}`;
      sysSolutionSteps = `"""1. Add all the outer sides together.\\n2. ${sides.join(' + ')} = ${P} ${unit}."""`;
      
      if (isShort) {
        askText = `An irregular polygon has sides of ${sides.join(', ')} ${unit}. What is the perimeter?`;
      } else if (isMCQ) {
        askText = `Sides: ${sides.join(', ')} ${unit}. Find the perimeter.`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the total perimeter:", expectedAnswer: `${sides.join(' + ')} = ${P}`, acceptedAnswers: [] },
            { label: `Final perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
          ]
        });
      }
    } else {
      let knownSides = sides.slice();
      knownSides.splice(missingIndex, 1);
      
      askText = `STORY: ${person} builds a rectilinear ${item} with 6 sides. The known sides are ${knownSides.join(', ')} ${unit}. The total perimeter is ${P} ${unit}. Find the length of the missing side.`;
      finalAnswer = `${missingSide} ${unit}`;
      sysSolutionSteps = `"""1. Add the known sides: ${knownSides.join(' + ')} = ${knownSum} ${unit}.\\n2. Subtract from the total perimeter: ${P} - ${knownSum} = ${missingSide} ${unit}."""`;
      
      if (isShort) {
        askText = `Perimeter is ${P} ${unit}. Known sides are ${knownSides.join(', ')} ${unit}. Find the missing side.`;
      } else if (isMCQ) {
        askText = `Perimeter = ${P} ${unit}. Known sides = ${knownSides.join(', ')} ${unit}. Missing side?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the total length of the known sides:", expectedAnswer: `${knownSides.join(' + ')} = ${knownSum}`, acceptedAnswers: [] },
            { label: "Write the working equation to find the missing side:", expectedAnswer: `${P} - ${knownSum} = ${missingSide}`, acceptedAnswers: [] },
            { label: `Length of the missing side:`, expectedAnswer: `${missingSide} ${unit}`, acceptedAnswers: [`${missingSide}${unit}`] }
          ]
        });
      }
    }

    if (!isStructure && !isMCQ) {
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
- For content.hint, use: "${mode === 1 ? 'Add all the outer sides together.' : 'Add all the known sides, then subtract from the total perimeter.'}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${mode === 1 ? P - sides[0] : missingSide + 2} ${unit}"
- "${mode === 1 ? P + sides[0] : Math.abs(missingSide - 2)} ${unit}"
- "${mode === 1 ? P + 4 : knownSum} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'foundation_compare_perimeters') {
    const s = getRandomInt(4, 9);
    const P1 = s * 4;
    
    let L = getRandomInt(6, 12);
    let W = getRandomInt(2, 8);
    if (L === s && W === s) L += 1;
    const P2 = 2 * (L + W);
    
    const diff = Math.abs(P1 - P2);
    const longer = P1 > P2 ? "square" : P1 < P2 ? "rectangle" : "neither";

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON", // Alternatively render two shapes side by side if supported, or no rendering. For now, we omit rendering as the prompt says "Two separate shapes" which might be tricky in one SVG unless we offset them.
      componentData: {
        vertices: [{x: 0, y: 0}, {x: s*10, y: 0}, {x: s*10, y: s*10}, {x: 0, y: s*10}, 
                   {x: s*10 + 20, y: 0}, {x: s*10 + 20 + L*10, y: 0}, {x: s*10 + 20 + L*10, y: W*10}, {x: s*10 + 20, y: W*10}],
        edgeLabels: [
          `${s} ${unit}`, null, null, null,
          `${L} ${unit}`, `${W} ${unit}`, null, null
        ],
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });
    // Let's just disable visualEngine for comparison since drawing two shapes with current GeometryPolygon logic connects them into one path.
    visualEngineStr = JSON.stringify({
      componentToRender: "NONE",
      componentData: {}
    });

    let askText = `STORY: ${person} draws a square with a side of ${s} ${unit}. Then, ${person} draws a rectangle with a length of ${L} ${unit} and a width of ${W} ${unit}. How much longer is the perimeter of the ${longer} than the other shape?`;
    let finalAnswer = `${diff} ${unit}`;
    let sysSolutionSteps = `"""1. Perimeter of square = ${s} x 4 = ${P1} ${unit}.\\n2. Perimeter of rectangle = ${L} + ${W} + ${L} + ${W} = ${P2} ${unit}.\\n3. Difference = ${Math.max(P1, P2)} - ${Math.min(P1, P2)} = ${diff} ${unit}."""`;

    if (P1 === P2) {
      askText = `STORY: ${person} draws a square with a side of ${s} ${unit} and a rectangle with length ${L} ${unit} and width ${W} ${unit}. What is the difference in their perimeters?`;
    }

    if (isShort) {
      askText = `Square A has side ${s} ${unit}. Rectangle B is ${L} ${unit} by ${W} ${unit}. Find the difference in their perimeters.`;
    } else if (isMCQ) {
      askText = `Square: side ${s} ${unit}. Rectangle: ${L} ${unit} by ${W} ${unit}. Difference in perimeters?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the perimeter of the square:", expectedAnswer: `${s} x 4 = ${P1}`, acceptedAnswers: [`4 x ${s} = ${P1}`, `${s} + ${s} + ${s} + ${s} = ${P1}`] },
          { label: "Write the working equation to find the perimeter of the rectangle:", expectedAnswer: `${L} + ${W} + ${L} + ${W} = ${P2}`, acceptedAnswers: [`${L}*2 + ${W}*2 = ${P2}`, `${L*2} + ${W*2} = ${P2}`] },
          { label: "Write the working equation to find the difference:", expectedAnswer: `${Math.max(P1, P2)} - ${Math.min(P1, P2)} = ${diff}`, acceptedAnswers: [] },
          { label: `Difference:`, expectedAnswer: `${diff} ${unit}`, acceptedAnswers: [`${diff}${unit}`] }
        ]
      });
    }

    if (!isStructure && !isMCQ) {
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
- For content.hint, use: "Find the perimeter of both shapes first, then subtract to find the difference."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${diff + 2} ${unit}"
- "${Math.abs(P1 + P2)} ${unit}"
- "${Math.abs(diff - 2) || 1} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'foundation_perimeter_cost') {
    const L = getRandomInt(5, 12);
    const W = getRandomInt(3, L - 1);
    const P = 2 * (L + W);
    const cost = getRandomInt(2, 6);
    const totalCost = P * cost;

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: [{x: 0, y: 0}, {x: L*10, y: 0}, {x: L*10, y: W*10}, {x: 0, y: W*10}],
        edgeLabels: [`${L} ${unit}`, `${W} ${unit}`, null, null],
        fillColor: "#fbcfe8",
        strokeColor: "#0f172a"
      }
    });

    let templates = [
      `STORY: ${person} wants to put a border around a rectangular ${item}. The ${item} has a length of ${L} ${unit} and a width of ${W} ${unit}. The border material costs $${cost} per ${unit}. How much will ${person} pay in total?`,
      `STORY: ${person} is attaching a decorative ribbon along the edges of a rectangular ${item}. The length is ${L} ${unit} and the width is ${W} ${unit}. The ribbon costs $${cost} for every ${unit}. What is the total cost of the ribbon?`,
      `STORY: ${person} needs to place a protective lining around the perimeter of a rectangular ${item}. The ${item} measures ${L} ${unit} by ${W} ${unit}. If the lining is priced at $${cost} per ${unit}, calculate the total amount ${person} has to pay.`
    ];
    let askText = templates[getRandomInt(0, templates.length - 1)];
    
    let finalAnswer = `$${totalCost}`;
    let sysSolutionSteps = `"""1. Perimeter = ${L} + ${W} + ${L} + ${W} = ${P} ${unit}.\\n2. Total cost = ${P} x ${cost} = $${totalCost}."""`;

    if (isShort) {
      askText = `A rectangular ${item} is ${L} ${unit} by ${W} ${unit}. The material costs $${cost} per ${unit}. What is the total cost?`;
    } else if (isMCQ) {
      askText = `Rectangle: ${L} ${unit} by ${W} ${unit}. Cost: $${cost}/${unit}. Total cost?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the total perimeter:", expectedAnswer: `${L} + ${W} + ${L} + ${W} = ${P}`, acceptedAnswers: [`${L*2} + ${W*2} = ${P}`] },
          { label: "Write the working equation to find the total cost:", expectedAnswer: `${P} x ${cost} = ${totalCost}`, acceptedAnswers: [`${cost} x ${P} = ${totalCost}`] },
          { label: "Total cost in dollars:", expectedAnswer: `${totalCost}`, acceptedAnswers: [`$${totalCost}`] }
        ]
      });
    }

    if (!isStructure && !isMCQ) {
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
- For content.hint, use: "Find the total perimeter first, then multiply it by the cost per unit."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "$${(L + W) * cost}"
- "$${(L * W) * cost}"
- "$${totalCost + cost}"` : ''}
`;
  }

  const aiPrompt = `
${systemPrompt}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
`;

  return {
    aiPrompt
  };
};
