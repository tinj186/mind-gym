import { getRandomNames, getRandomLocations, getRandomLengthItems } from '../../../../../utils/variable-bank.js';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const advancedLogic = (activeVariant, isMCQ, isShort, isStructure, topic, zodType, zodDiff, getFormatInstructions) => {
  let visualEngineStr = `"{}"`;
  let inputRequirementStr = `""`;
  let systemPrompt = ``;

  const unit = Math.random() < 0.5 ? "cm" : "m";
  const person = getRandomNames(1)[0];
  const place = getRandomLocations(1)[0];
  const itemObj = getRandomLengthItems(1)[0];
  const item = itemObj ? itemObj.item : "object";

  if (activeVariant === 'advanced_staircase_shortcut') {
    const totalW = getRandomInt(10, 20);
    const totalH = getRandomInt(10, 20);
    const P = 2 * (totalW + totalH);

    // Render a staircase with 3 steps
    const w1 = Math.floor(totalW / 3);
    const w2 = Math.floor(totalW / 3);
    const w3 = totalW - w1 - w2;
    const h1 = Math.floor(totalH / 3);
    const h2 = Math.floor(totalH / 3);
    const h3 = totalH - h1 - h2;

    visualEngineStr = JSON.stringify({
      componentToRender: "GeometryPolygon",
      componentData: {
        vertices: [
          {x: 0, y: 0}, 
          {x: w1*10, y: 0}, {x: w1*10, y: h1*10}, 
          {x: (w1+w2)*10, y: h1*10}, {x: (w1+w2)*10, y: (h1+h2)*10},
          {x: totalW*10, y: (h1+h2)*10}, {x: totalW*10, y: totalH*10},
          {x: 0, y: totalH*10}
        ],
        edgeLabels: [
          null, null, null, null, null, null, 
          `${totalW} ${unit}`, // bottom
          `${totalH} ${unit}` // left
        ],
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });

    let askText = `STORY: A garden is shaped like a set of steps. The total distance across the bottom is ${totalW} ${unit}, and the total vertical height on the left is ${totalH} ${unit}. Calculate the entire perimeter of the garden.`;
    let finalAnswer = `${P} ${unit}`;
    let sysSolutionSteps = `"""1. The staircase shortcut means pushing the steps outward forms a perfect rectangle.\\n2. Total width = ${totalW} ${unit}, Total height = ${totalH} ${unit}.\\n3. Total perimeter = 2 x (${totalW} + ${totalH}) = ${P} ${unit}."""`;

    if (isShort) {
      askText = `A staircase shape has a total width of ${totalW} ${unit} and total height of ${totalH} ${unit}. Find its perimeter.`;
    } else if (isMCQ) {
      askText = `Staircase shape fits exactly in a ${totalW} ${unit} by ${totalH} ${unit} rectangle. Perimeter of staircase?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the total length of all the horizontal segments (top and bottom):", expectedAnswer: `${totalW} + ${totalW} = ${totalW*2}`, acceptedAnswers: [`${totalW} x 2 = ${totalW*2}`] },
          { label: "Write the working equation to find the total length of all the vertical segments (left and right):", expectedAnswer: `${totalH} + ${totalH} = ${totalH*2}`, acceptedAnswers: [`${totalH} x 2 = ${totalH*2}`] },
          { label: "Write the working equation to find the total perimeter:", expectedAnswer: `${totalW*2} + ${totalH*2} = ${P}`, acceptedAnswers: [] },
          { label: `Perimeter in ${unit}:`, expectedAnswer: `${P}`, acceptedAnswers: [] }
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
- For content.hint, use: "Pushing the 'steps' outward forms a perfect rectangle. The perimeter is exactly the same."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${totalW + totalH} ${unit}"
- "${totalW * totalH} ${unit}"
- "${(totalW + totalH) * 3} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'advanced_subtracted_perimeter') {
    const L = getRandomInt(10, 25);
    const W = getRandomInt(8, L - 2);
    const cx = getRandomInt(2, 5);
    const cy = getRandomInt(2, 5);
    const P = 2 * (L + W);

    visualEngineStr = JSON.stringify({
      componentToRender: "GeometryPolygon",
      componentData: {
        vertices: [
          {x: 0, y: 0}, 
          {x: (L - cx)*10, y: 0}, {x: (L - cx)*10, y: cy*10}, 
          {x: L*10, y: cy*10}, {x: L*10, y: W*10}, 
          {x: 0, y: W*10}
        ],
        edgeLabels: [
          null, null, null, null, 
          `${L} ${unit}`, // bottom
          `${W} ${unit}` // left
        ],
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });

    let askText = `STORY: ${person} has a rectangular piece of cardboard measuring ${L} ${unit} by ${W} ${unit}. ${person} cuts a small ${cx} ${unit} by ${cy} ${unit} rectangular piece out of one of the corners. Calculate the perimeter of the new shape.`;
    let finalAnswer = `${P} ${unit}`;
    let sysSolutionSteps = `"""1. Removing a corner does not change the total perimeter, because the missing outer edges are replaced by the inner edges of the same length.\\n2. Perimeter = ${L} + ${W} + ${L} + ${W} = ${P} ${unit}."""`;

    if (isShort) {
      askText = `A ${L} ${unit} by ${W} ${unit} rectangle has a ${cx} ${unit} by ${cy} ${unit} piece cut from its corner. Find the new perimeter.`;
    } else if (isMCQ) {
      askText = `If a corner is cut out of a ${L} by ${W} rectangle, what is the new perimeter?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the perimeter of the original uncut cardboard:", expectedAnswer: `${L} + ${W} + ${L} + ${W} = ${P}`, acceptedAnswers: [`${L*2} + ${W*2} = ${P}`] },
          { label: "Does the perimeter change when a corner is removed? Write the total perimeter of the new shape:", expectedAnswer: `${P}`, acceptedAnswers: [] }
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
- For content.hint, use: "When you cut a corner, the new inner edges have the exact same length as the outer edges you removed. The perimeter stays exactly the same."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${P - (cx + cy)} ${unit}"
- "${P - 2*(cx + cy)} ${unit}"
- "${P + (cx + cy)} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'advanced_composing_large_shape') {
    const count = getRandomInt(3, 5); // Number of strips
    const W = getRandomInt(2, 5);
    const L = W * count; // so that stacked they form a square (L x L)
    
    const P = 4 * L;

    // Draw the composed large square with internal lines
    let vertices = [{x: 0, y: 0}, {x: L*10, y: 0}, {x: L*10, y: L*10}, {x: 0, y: L*10}];
    
    visualEngineStr = JSON.stringify({
      componentToRender: "GeometryPolygon",
      componentData: {
        vertices: vertices,
        edgeLabels: [
          null, null, `${L} ${unit}`, `${L} ${unit}`
        ],
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });

    let askText = `STORY: ${person} has ${count} identical rectangular strips. Each strip is ${L} ${unit} long and ${W} ${unit} wide. ${person} stacks them side-by-side to form a large square. What is the perimeter of this large square?`;
    let finalAnswer = `${P} ${unit}`;
    let sysSolutionSteps = `"""1. Side of the large square = ${W} x ${count} = ${L} ${unit}.\\n2. Perimeter of the large square = ${L} x 4 = ${P} ${unit}."""`;

    if (isShort) {
      askText = `${count} rectangles (each ${L} ${unit} by ${W} ${unit}) form a large square. Find the perimeter of the square.`;
    } else if (isMCQ) {
      askText = `${count} rectangles (${L} ${unit} by ${W} ${unit}) form a square. Perimeter of the square?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the side of the new square formed by the widths:", expectedAnswer: `${W} x ${count} = ${L}`, acceptedAnswers: [] },
          { label: "Write the working equation to find the perimeter of the large square:", expectedAnswer: `${L} x 4 = ${P}`, acceptedAnswers: [`${L} + ${L} + ${L} + ${L} = ${P}`] },
          { label: `Perimeter of the large square in ${unit}:`, expectedAnswer: `${P}`, acceptedAnswers: [] }
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
- For content.hint, use: "The widths of the strips combine to form one side of the large square."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${(2*(L+W)) * count} ${unit}"
- "${L * 2 + W * 2} ${unit}"
- "${(L + L) * 2} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'advanced_symmetrical_cross') {
    const s = getRandomInt(3, 8); // edge of the cross
    const totalEdges = 12;
    const P = s * totalEdges;
    
    // Cross shape coordinates
    visualEngineStr = JSON.stringify({
      componentToRender: "GeometryPolygon",
      componentData: {
        vertices: [
          {x: s*10, y: 0}, {x: s*20, y: 0}, 
          {x: s*20, y: s*10}, {x: s*30, y: s*10}, 
          {x: s*30, y: s*20}, {x: s*20, y: s*20},
          {x: s*20, y: s*30}, {x: s*10, y: s*30},
          {x: s*10, y: s*20}, {x: 0, y: s*20},
          {x: 0, y: s*10}, {x: s*10, y: s*10}
        ],
        edgeLabels: [
          `${s} ${unit}`, null, null, null, null, null, null, null, null, null, null, null
        ],
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });

    let askText = `STORY: A plus-shaped figure (+) is made up of exactly 12 equal edges. The total perimeter of the figure is ${P} ${unit}. Find the length of one edge, and calculate the total length of 3 edges.`;
    let finalAnswer = `${s * 3} ${unit}`;
    let sysSolutionSteps = `"""1. Length of one edge = ${P} / 12 = ${s} ${unit}.\\n2. Length of 3 edges = ${s} x 3 = ${s * 3} ${unit}."""`;

    if (isShort) {
      askText = `A plus shape is made of 12 equal sides. If the perimeter is ${P} ${unit}, what is the length of one side?`;
      finalAnswer = `${s} ${unit}`; // Short question format is just one side according to proposal
      sysSolutionSteps = `"""1. Length of one side = ${P} / 12 = ${s} ${unit}."""`;
    } else if (isMCQ) {
      askText = `Two identical rectangles (${s*3} ${unit} by ${s} ${unit}) cross each other exactly in the middle to form a plus (+). Perimeter?`;
      finalAnswer = `${P} ${unit}`;
      sysSolutionSteps = `"""1. A plus shape has 12 equal edges.\\n2. Perimeter = ${s} x 12 = ${P} ${unit}."""`;
      // No inputRequirement needed for MCQ
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the length of one edge:", expectedAnswer: `${P} / 12 = ${s}`, acceptedAnswers: [`${P} \\\\div 12 = ${s}`] },
          { label: "Write the working equation to find the length of 3 edges:", expectedAnswer: `${s} x 3 = ${s*3}`, acceptedAnswers: [] },
          { label: `Length of 3 edges in ${unit}:`, expectedAnswer: `${s*3}`, acceptedAnswers: [] }
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
- For content.hint, use: "A plus shape has exactly 12 equal outer edges."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${P - 4*s} ${unit}"
- "${(s*3 + s)*2} ${unit}"
- "${P + s} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'advanced_frame_path_deduction') {
    const pL = getRandomInt(10, 20); // picture length
    const pW = getRandomInt(8, pL - 2); // picture width
    const border = getRandomInt(2, 5); // border width

    const newL = pL + 2 * border;
    const newW = pW + 2 * border;
    const P = 2 * (newL + newW);

    visualEngineStr = JSON.stringify({
      componentToRender: "GeometryPolygon",
      componentData: {
        vertices: [{x: 0, y: 0}, {x: newL*10, y: 0}, {x: newL*10, y: newW*10}, {x: 0, y: newW*10}],
        edgeLabels: [
          `${newL} ${unit}`, `${newW} ${unit}`, null, null
        ],
        fillColor: "#fbcfe8",
        strokeColor: "#0f172a"
      }
    });

    let askText = `STORY: A rectangular painting is ${pL} ${unit} long and ${pW} ${unit} wide. It is placed inside a border that is ${border} ${unit} wide on all sides. Calculate the total outer perimeter of the border.`;
    let finalAnswer = `${P} ${unit}`;
    let sysSolutionSteps = `"""1. New outer length = ${pL} + ${border} + ${border} = ${newL} ${unit}.\\n2. New outer width = ${pW} + ${border} + ${border} = ${newW} ${unit}.\\n3. Total outer perimeter = ${newL} + ${newW} + ${newL} + ${newW} = ${P} ${unit}."""`;

    if (isShort) {
      askText = `A ${pL} ${unit} by ${pW} ${unit} picture has a ${border} ${unit} wide frame around it. Find the outer perimeter.`;
    } else if (isMCQ) {
      askText = `A ${pL} ${unit} by ${pW} ${unit} garden has a ${border} ${unit} wide path surrounding it. Outer perimeter?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the new outer length (Painting length + left border + right border):", expectedAnswer: `${pL} + ${border} + ${border} = ${newL}`, acceptedAnswers: [`${pL} + ${border*2} = ${newL}`] },
          { label: "Write the working equation to find the new outer width (Painting width + top border + bottom border):", expectedAnswer: `${pW} + ${border} + ${border} = ${newW}`, acceptedAnswers: [`${pW} + ${border*2} = ${newW}`] },
          { label: "Write the working equation to find the total outer perimeter:", expectedAnswer: `${newL} + ${newW} + ${newL} + ${newW} = ${P}`, acceptedAnswers: [`${newL*2} + ${newW*2} = ${P}`] },
          { label: `Outer perimeter in ${unit}:`, expectedAnswer: `${P}`, acceptedAnswers: [] }
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
- For content.hint, use: "Add the border width TWICE to the length (left and right) and TWICE to the width (top and bottom)."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${2 * ((pL + border) + (pW + border))} ${unit}"
- "${2 * (pL + pW)} ${unit}"
- "${P - border} ${unit}"` : ''}
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
