import { getRandomNames, getRandomLocations, getRandomLengthItems, getRandomRectangleItems } from '../../../../../utils/variable-bank.js';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const standardLogic = (activeVariant, isMCQ, isShort, isStructure, topic, zodType, zodDiff, getFormatInstructions) => {
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });
  let inputRequirementStr = "";
  let systemPrompt = ``;

  const unit = Math.random() < 0.5 ? "cm" : "m";
  const person = getRandomNames(1)[0];
  const place = getRandomLocations(1)[0];
  const itemObj = getRandomLengthItems(1)[0];
  const item = itemObj ? itemObj.item : "string";

  if (activeVariant === 'standard_rectilinear_missing_sides') {
    const mPlaces = ["garden", "room", "stage", "hall", "swimming pool"];
    const cmItems = ["wooden block", "card", "piece of paper", "tile", "sticker"];
    const lShapeItem = unit === "m" ? mPlaces[getRandomInt(0, mPlaces.length - 1)] : cmItems[getRandomInt(0, cmItems.length - 1)];

    // L-Shape with missing inner parallel sides
    const W = getRandomInt(10, 16); // Total bottom width
    const H = getRandomInt(10, 16); // Total left height
    const W2 = getRandomInt(4, W - 4); // inner horizontal
    const H2 = getRandomInt(4, H - 4); // inner vertical
    
    // Top = W - W2
    const topW = W - W2;
    // Right = H - H2
    const rightH = H - H2;

    const P = W + H + topW + rightH + W2 + H2;

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: [
          {x: 0, y: 0}, 
          {x: topW*10, y: 0}, 
          {x: topW*10, y: H2*10}, 
          {x: W*10, y: H2*10}, 
          {x: W*10, y: H*10}, 
          {x: 0, y: H*10}
        ],
        edgeLabels: [
          `A`, // top
          `B`, // inner vert
          `${W2} ${unit}`, // inner horiz
          `${rightH} ${unit}`, // right
          `${W} ${unit}`, // bottom
          `${H} ${unit}` // left
        ],
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });

    let askText = `STORY: ${person} has a ${lShapeItem} cut into an L-shape. The longest vertical side is ${H} ${unit} and the longest horizontal side is ${W} ${unit}. The inner horizontal side is ${W2} ${unit} and the outer right side is ${rightH} ${unit}. Find the perimeter of the ${lShapeItem}.`;
    let finalAnswer = `${P} ${unit}`;
    let sysSolutionSteps = `"""1. Side A = ${W} - ${W2} = ${topW} ${unit}.\\n2. Side B = ${H} - ${rightH} = ${H2} ${unit}.\\n3. Total perimeter = ${H} + ${W} + ${W2} + ${rightH} + ${topW} + ${H2} = ${P} ${unit}."""`;

    if (isShort) {
      askText = `Find the perimeter of the figure shown.`;
    } else if (isMCQ) {
      askText = `L-shape: left=${H}${unit}, bottom=${W}${unit}, inner-horiz=${W2}${unit}, right=${rightH}${unit}. Perimeter?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find Side A:", expectedAnswer: `${W} - ${W2} = ${topW}`, acceptedAnswers: [] },
          { label: "Write the working equation to find Side B:", expectedAnswer: `${H} - ${rightH} = ${H2}`, acceptedAnswers: [] },
          { label: "Write the working equation to find the total perimeter:", expectedAnswer: `${H} + ${W} + ${W2} + ${rightH} + ${topW} + ${H2} = ${P}`, acceptedAnswers: [`${H}*2 + ${W}*2 = ${P}`, `${H + H} + ${W + W} = ${P}`] },
          { label: `Final perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
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
- For content.hint, use: "Find the missing parallel sides by subtracting the shorter sides from the longest sides."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${W + H + W2 + rightH} ${unit}"
- "${(W + H) * 2 - (W2 + rightH)} ${unit}"
- "${P - topW} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'standard_same_wire_different_shape') {
    // Mode 1: Square -> Rectangle (find length/width). Mode 2: Rectangle -> Square (find side)
    const mode = getRandomInt(1, 2);
    let askText, finalAnswer, sysSolutionSteps;
    
    if (mode === 1) {
      const s = getRandomInt(4, 12);
      const P = s * 4;
      let W = getRandomInt(2, s - 1);
      const L = (P - (W * 2)) / 2;

      askText = `STORY: ${person} has a piece of wire. ${person} uses the entire wire to form a square with sides of ${s} ${unit}. Later, ${person} uses the same wire to form a rectangle. If the width of the rectangle is ${W} ${unit}, what is its length?`;
      finalAnswer = `${L} ${unit}`;
      sysSolutionSteps = `"""1. Total length of wire (perimeter of square) = ${s} x 4 = ${P} ${unit}.\\n2. The rectangle uses the same wire, so its perimeter is ${P} ${unit}.\\n3. Two widths = ${W} x 2 = ${W*2} ${unit}.\\n4. Two lengths = ${P} - ${W*2} = ${P - W*2} ${unit}.\\n5. One length = ${P - W*2} / 2 = ${L} ${unit}."""`;

      if (isShort) {
        askText = `A wire forms a square of side ${s} ${unit}. It is unbent into a rectangle of width ${W} ${unit}. Find the length of the rectangle.`;
      } else if (isMCQ) {
        askText = `Wire forms square (side ${s} ${unit}), then a rectangle (width ${W} ${unit}). Length of rectangle?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the total length of the wire (perimeter of the square):", expectedAnswer: `${s} x 4 = ${P}`, acceptedAnswers: [`4 x ${s} = ${P}`, `${s} + ${s} + ${s} + ${s} = ${P}`] },
            { label: "Write the working equation to find the total length of the two known widths of the rectangle:", expectedAnswer: `${W} + ${W} = ${W*2}`, acceptedAnswers: [`${W} x 2 = ${W*2}`] },
            { label: "Write the working equation to find the total length of the two unknown lengths:", expectedAnswer: `${P} - ${W*2} = ${P - W*2}`, acceptedAnswers: [] },
            { label: "Write the working equation to find one length:", expectedAnswer: `${P - W*2} / 2 = ${L}`, acceptedAnswers: [`${P - W*2} \\\\div 2 = ${L}`] }
          ]
        });
      }
    } else {
      const L = getRandomInt(6, 12);
      const W = getRandomInt(2, 8);
      const P = 2 * (L + W);
      const s = P / 4; // might be decimal, let's ensure P is divisible by 4
      // To ensure P is divisible by 4, L+W must be even.
      const adjustedL = ((L + W) % 2 !== 0) ? L + 1 : L;
      const actualP = 2 * (adjustedL + W);
      const actualS = actualP / 4;

      askText = `STORY: ${person} has a piece of wire. ${person} forms a rectangle with a length of ${adjustedL} ${unit} and a width of ${W} ${unit}. The wire is then reshaped into a square. What is the length of one side of the square?`;
      finalAnswer = `${actualS} ${unit}`;
      sysSolutionSteps = `"""1. Total length of wire (perimeter of rectangle) = ${adjustedL} + ${W} + ${adjustedL} + ${W} = ${actualP} ${unit}.\\n2. The square uses the same wire, so its perimeter is ${actualP} ${unit}.\\n3. Side of the square = ${actualP} / 4 = ${actualS} ${unit}."""`;

      if (isShort) {
        askText = `A wire forms a rectangle ${adjustedL} ${unit} by ${W} ${unit}. It is reshaped into a square. Find the side of the square.`;
      } else if (isMCQ) {
        askText = `Wire forms rectangle (${adjustedL} ${unit} by ${W} ${unit}), then a square. Side of square?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the total length of the wire (perimeter of the rectangle):", expectedAnswer: `${adjustedL} + ${W} + ${adjustedL} + ${W} = ${actualP}`, acceptedAnswers: [`${adjustedL*2} + ${W*2} = ${actualP}`] },
            { label: "Write the working equation to find the side of the square:", expectedAnswer: `${actualP} / 4 = ${actualS}`, acceptedAnswers: [`${actualP} \\\\div 4 = ${actualS}`] },
            { label: `Side of the square:`, expectedAnswer: `${actualS} ${unit}`, acceptedAnswers: [`${actualS}${unit}`] }
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
- For content.hint, use: "The perimeter stays the same because the same wire is used."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${parseInt(finalAnswer) * 2} ${unit}"
- "${parseInt(finalAnswer) + 2} ${unit}"
- "${Math.abs(parseInt(finalAnswer) - 2) || 1} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'standard_joining_identical_shapes') {
    const mode = getRandomInt(1, 2); // 1: Given single card, find P. 2: Given P, find single card length.
    const L = getRandomInt(6, 12);
    const W = getRandomInt(2, 5);
    const count = getRandomInt(2, 4);

    const newL = L * count;
    const P = 2 * (newL + W);

    const item = getRandomRectangleItems(unit, 1)[0];

    let askText, finalAnswer, sysSolutionSteps;

    if (mode === 1) {
      // Render single card
      visualEngineStr = JSON.stringify({
        componentToRender: "GEOMETRY_POLYGON",
        componentData: {
          vertices: [{x: 0, y: 0}, {x: L*10, y: 0}, {x: L*10, y: W*10}, {x: 0, y: W*10}],
          edgeLabels: [`${L} ${unit}`, `${W} ${unit}`, null, null],
          fillColor: "#fbcfe8",
          strokeColor: "#0f172a"
        }
      });
      askText = `STORY: ${person} has ${count} identical rectangular ${item}s as shown above. ${person} joins them together end-to-end along their shorter ${W} ${unit} widths to form a long rectangle. What is the total perimeter of this new long rectangle?`;
      finalAnswer = `${P} ${unit}`;
      sysSolutionSteps = `"""1. The new length is ${count} times the original length: ${L} x ${count} = ${newL} ${unit}.\\n2. The width remains ${W} ${unit}.\\n3. New perimeter = ${newL} + ${W} + ${newL} + ${W} = ${P} ${unit}."""`;

      if (isShort) {
        askText = `${count} identical rectangles shown above are joined along their ${W} ${unit} sides. Find the new perimeter.`;
      } else if (isMCQ) {
        askText = `${count} ${item}s (shown above) joined along widths. New perimeter?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the new combined length:", expectedAnswer: `${L} x ${count} = ${newL}`, acceptedAnswers: [] },
            { label: "Write the working equation to find the perimeter of the new long rectangle:", expectedAnswer: `${newL} + ${W} + ${newL} + ${W} = ${P}`, acceptedAnswers: [`${newL*2} + ${W*2} = ${P}`] },
            { label: `New perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
          ]
        });
      }
    } else {
      // Mode 2: Render long rectangle
      visualEngineStr = JSON.stringify({
        componentToRender: "GEOMETRY_POLYGON",
        componentData: {
          vertices: [{x: 0, y: 0}, {x: newL*10, y: 0}, {x: newL*10, y: W*10}, {x: 0, y: W*10}],
          edgeLabels: [`?`, `${W} ${unit}`, null, null],
          fillColor: "#fbcfe8",
          strokeColor: "#0f172a"
        }
      });
      askText = `STORY: ${person} forms the long rectangle shown above by joining ${count} identical smaller ${item}s end-to-end along their ${W} ${unit} widths. The total perimeter of the long rectangle is ${P} ${unit}. Find the length of one smaller ${item}.`;
      finalAnswer = `${L} ${unit}`;
      sysSolutionSteps = `"""1. Find the sum of the two long sides: ${P} - ${W} - ${W} = ${newL * 2} ${unit}.\\n2. The combined length of the long rectangle is ${newL * 2} / 2 = ${newL} ${unit}.\\n3. Length of one smaller ${item} = ${newL} / ${count} = ${L} ${unit}."""`;

      if (isShort) {
        askText = `The figure above has a perimeter of ${P} ${unit} and is made of ${count} identical smaller rectangles. Find the length of one smaller rectangle.`;
      } else if (isMCQ) {
        askText = `Long rectangle (perimeter ${P}${unit}) made of ${count} ${item}s. Length of one ${item}?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the total of the two long sides:", expectedAnswer: `${P} - ${W} - ${W} = ${newL * 2}`, acceptedAnswers: [`${P} - ${W*2} = ${newL * 2}`] },
            { label: "Write the working equation to find the combined length:", expectedAnswer: `${newL * 2} / 2 = ${newL}`, acceptedAnswers: [] },
            { label: "Write the working equation to find the length of one smaller item:", expectedAnswer: `${newL} / ${count} = ${L}`, acceptedAnswers: [] },
            { label: `Length of one item:`, expectedAnswer: `${L} ${unit}`, acceptedAnswers: [`${L}${unit}`] }
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
- For content.hint, use: "${mode === 1 ? 'When joined, the inner sides are hidden. Find the new combined length first.' : 'Subtract the two widths from the total perimeter to find the two long sides.'}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${mode === 1 ? (2 * (L + W)) * count : newL} ${unit}"
- "${mode === 1 ? P + W * 2 * (count - 1) : L * 2} ${unit}"
- "${mode === 1 ? newL + W : L + W} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'standard_constant_difference') {
    const mode = getRandomInt(1, 2); // 1 = find larger, 2 = find smaller
    const dx = getRandomInt(2, 5);
    const dy = getRandomInt(2, 5);
    
    const item = getRandomRectangleItems(unit, 1)[0];

    let askText, finalAnswer, sysSolutionSteps, opt1, opt2, opt3, hintText;

    if (mode === 1) {
      const L = getRandomInt(8, 15);
      const W = getRandomInt(4, L - 2);
      const newL = L + dx;
      const newW = W + dy;
      const P = 2 * (newL + newW);

      askText = `STORY: A small rectangular ${item} has a length of ${L} ${unit} and a width of ${W} ${unit}. A larger ${item} is ${dx} ${unit} longer and ${dy} ${unit} wider than the small ${item}. What is the perimeter of the larger ${item}?`;
      finalAnswer = `${P} ${unit}`;
      hintText = `Calculate the length and width of the larger ${item} first.`;
      sysSolutionSteps = `"""1. Length of larger ${item} = ${L} + ${dx} = ${newL} ${unit}.\\n2. Width of larger ${item} = ${W} + ${dy} = ${newW} ${unit}.\\n3. Perimeter = ${newL} + ${newW} + ${newL} + ${newW} = ${P} ${unit}."""`;

      opt1 = `${P - 2 * (dx + dy)} ${unit}`;
      opt2 = `${newL * newW} ${unit}`;
      opt3 = `${newL + newW} ${unit}`;

      if (isShort) {
        askText = `Rectangle A is ${L} ${unit} by ${W} ${unit}. Rectangle B is ${dx} ${unit} longer and ${dy} ${unit} wider. Find the perimeter of Rectangle B.`;
      } else if (isMCQ) {
        askText = `Rectangle A: ${L} ${unit} by ${W} ${unit}. Rectangle B is ${dx} ${unit} longer, ${dy} ${unit} wider. Perimeter of B?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the length of the larger ${item}:`, expectedAnswer: `${L} + ${dx} = ${newL}`, acceptedAnswers: [] },
            { label: `Write the working equation to find the width of the larger ${item}:`, expectedAnswer: `${W} + ${dy} = ${newW}`, acceptedAnswers: [] },
            { label: `Write the working equation to find the perimeter of the larger ${item}:`, expectedAnswer: `${newL} + ${newW} + ${newL} + ${newW} = ${P}`, acceptedAnswers: [`${newL*2} + ${newW*2} = ${P}`] },
            { label: `Final perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
          ]
        });
      }
    } else {
      const largeL = getRandomInt(12, 20);
      const largeW = getRandomInt(8, largeL - 2);
      const smallL = largeL - dx;
      const smallW = largeW - dy;
      const P = 2 * (smallL + smallW);

      askText = `STORY: A large rectangular ${item} has a length of ${largeL} ${unit} and a width of ${largeW} ${unit}. A smaller ${item} is ${dx} ${unit} shorter and ${dy} ${unit} narrower than the large ${item}. What is the perimeter of the smaller ${item}?`;
      finalAnswer = `${P} ${unit}`;
      hintText = `Calculate the length and width of the smaller ${item} first.`;
      sysSolutionSteps = `"""1. Length of smaller ${item} = ${largeL} - ${dx} = ${smallL} ${unit}.\\n2. Width of smaller ${item} = ${largeW} - ${dy} = ${smallW} ${unit}.\\n3. Perimeter = ${smallL} + ${smallW} + ${smallL} + ${smallW} = ${P} ${unit}."""`;

      opt1 = `${P + 2 * (dx + dy)} ${unit}`;
      opt2 = `${smallL * smallW} ${unit}`;
      opt3 = `${smallL + smallW} ${unit}`;

      if (isShort) {
        askText = `Rectangle A is ${largeL} ${unit} by ${largeW} ${unit}. Rectangle B is ${dx} ${unit} shorter and ${dy} ${unit} narrower. Find the perimeter of Rectangle B.`;
      } else if (isMCQ) {
        askText = `Rectangle A: ${largeL} ${unit} by ${largeW} ${unit}. Rectangle B is ${dx} ${unit} shorter, ${dy} ${unit} narrower. Perimeter of B?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the length of the smaller ${item}:`, expectedAnswer: `${largeL} - ${dx} = ${smallL}`, acceptedAnswers: [] },
            { label: `Write the working equation to find the width of the smaller ${item}:`, expectedAnswer: `${largeW} - ${dy} = ${smallW}`, acceptedAnswers: [] },
            { label: `Write the working equation to find the perimeter of the smaller ${item}:`, expectedAnswer: `${smallL} + ${smallW} + ${smallL} + ${smallW} = ${P}`, acceptedAnswers: [`${smallL*2} + ${smallW*2} = ${P}`] },
            { label: `Final perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
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
- For content.hint, use: "${hintText}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${opt1}"
- "${opt2}"
- "${opt3}"` : ''}
`;
  }
  else if (activeVariant === 'standard_repeated_shapes') {
    const mode = getRandomInt(1, 2); // 1 = find side from total, 2 = find total from side
    const side = getRandomInt(3, 8);
    const P = side * 4;
    const count = getRandomInt(3, 6);
    const totalWire = P * count;

    const mMaterials = ["rope", "wire", "hose", "string", "measuring tape"];
    const cmMaterials = ["ribbon", "thread", "string", "wire", "tape"];
    const material = unit === "m" ? mMaterials[getRandomInt(0, mMaterials.length - 1)] : cmMaterials[getRandomInt(0, cmMaterials.length - 1)];

    let askText, finalAnswer, sysSolutionSteps, opt1, opt2, opt3, hintText;

    if (mode === 1) {
      askText = `STORY: ${person} has a ${totalWire} ${unit} ${material}. ${person} cuts it into equal pieces to make ${count} identical squares. Find the length of one side of a single square.`;
      finalAnswer = `${side} ${unit}`;
      sysSolutionSteps = `"""1. Perimeter of 1 square = ${totalWire} / ${count} = ${P} ${unit}.\\n2. Length of one side = ${P} / 4 = ${side} ${unit}."""`;
      hintText = `Find the ${material} used for just 1 square, then divide by 4.`;

      opt1 = `${P} ${unit}`;
      opt2 = `${side * count} ${unit}`;
      opt3 = `${side + count} ${unit}`;

      if (isShort) {
        askText = `${count} identical squares are made from a ${totalWire} ${unit} ${material}. Find the length of one side of a square.`;
      } else if (isMCQ) {
        askText = `${count} squares made from a ${totalWire} ${unit} ${material}. Side of one square?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the perimeter of exactly 1 square:`, expectedAnswer: `${totalWire} / ${count} = ${P}`, acceptedAnswers: [`${totalWire} \\\\div ${count} = ${P}`] },
            { label: "Write the working equation to find the length of one side:", expectedAnswer: `${P} / 4 = ${side}`, acceptedAnswers: [`${P} \\\\div 4 = ${side}`] },
            { label: `Length of one side:`, expectedAnswer: `${side} ${unit}`, acceptedAnswers: [`${side}${unit}`] }
          ]
        });
      }
    } else {
      askText = `STORY: ${person} wants to make ${count} identical squares using a ${material}. Each side of the square must be ${side} ${unit}. How much ${material} does ${person} need in total?`;
      finalAnswer = `${totalWire} ${unit}`;
      sysSolutionSteps = `"""1. Perimeter of 1 square = ${side} x 4 = ${P} ${unit}.\\n2. Total ${material} needed = ${P} x ${count} = ${totalWire} ${unit}."""`;
      hintText = `Find the perimeter of one square first, then multiply by ${count}.`;

      opt1 = `${P} ${unit}`;
      opt2 = `${side * count} ${unit}`;
      opt3 = `${P + count} ${unit}`;

      if (isShort) {
        askText = `Find the total ${material} needed to make ${count} squares if each side is ${side} ${unit}.`;
      } else if (isMCQ) {
        askText = `Total ${material} needed for ${count} squares, side ${side} ${unit}?`;
      } else if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the perimeter of 1 square:`, expectedAnswer: `${side} x 4 = ${P}`, acceptedAnswers: [`${side} * 4 = ${P}`] },
            { label: `Write the working equation to find the total ${material} needed:`, expectedAnswer: `${P} x ${count} = ${totalWire}`, acceptedAnswers: [`${P} * ${count} = ${totalWire}`] },
            { label: `Total ${material} needed:`, expectedAnswer: `${totalWire} ${unit}`, acceptedAnswers: [`${totalWire}${unit}`] }
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
- For content.hint, use: "${hintText}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${opt1}"
- "${opt2}"
- "${opt3}"` : ''}
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
