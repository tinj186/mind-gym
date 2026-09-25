import { getRandomNames, getRandomLocations, getRandomLengthItems } from '../../../../../utils/variable-bank.js';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const advancedLogic = (activeVariant, isMCQ, isShort, isStructure, topic, zodType, zodDiff, getFormatInstructions) => {
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });
  let inputRequirementStr = "";
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
    
    // Choose appropriate context
    const mPlaces = ["garden", "field", "park", "courtyard", "stage"];
    const cmItems = ["cardboard cutout", "metal plate", "wooden tile", "sticker"];
    const contextItem = unit === "m" ? mPlaces[getRandomInt(0, mPlaces.length - 1)] : cmItems[getRandomInt(0, cmItems.length - 1)];

    // Staircase steps
    const w1 = Math.floor(totalW / 3);
    const w2 = Math.floor(totalW / 3);
    const w3 = totalW - w1 - w2;
    const h1 = Math.floor(totalH / 3);
    const h2 = Math.floor(totalH / 3);
    const h3 = totalH - h1 - h2;

    const mode = getRandomInt(1, 3);
    const labelScheme = getRandomInt(1, 4);
    
    let vertices = [];
    let edgeLabels = Array(8).fill(null);
    let l_horiz, l_vert, s_horiz, s_vert;
    let s_horiz_vals = [w1, w2, w3];
    let s_vert_vals = [h1, h2, h3];

    if (mode === 1) {
      // Standard staircase (cutout top-right)
      vertices = [
        {x: 0, y: 0}, 
        {x: w1*10, y: 0}, {x: w1*10, y: h1*10}, 
        {x: (w1+w2)*10, y: h1*10}, {x: (w1+w2)*10, y: (h1+h2)*10},
        {x: totalW*10, y: (h1+h2)*10}, {x: totalW*10, y: totalH*10},
        {x: 0, y: totalH*10}
      ];
      l_horiz = 6; l_vert = 7;
      s_horiz = [0, 2, 4]; s_vert = [1, 3, 5];
    } else if (mode === 2) {
      // Inverted staircase (cutout bottom-right)
      vertices = [
        {x: 0, y: 0}, 
        {x: totalW*10, y: 0}, 
        {x: totalW*10, y: h1*10}, {x: (w1+w2)*10, y: h1*10},
        {x: (w1+w2)*10, y: (h1+h2)*10}, {x: w1*10, y: (h1+h2)*10},
        {x: w1*10, y: totalH*10}, {x: 0, y: totalH*10}
      ];
      l_horiz = 0; l_vert = 7;
      s_horiz = [6, 4, 2]; s_vert = [1, 3, 5];
    } else {
      // Opposite staircase (cutout top-left)
      vertices = [
        {x: (w1+w2)*10, y: 0}, 
        {x: totalW*10, y: 0},
        {x: totalW*10, y: totalH*10},
        {x: 0, y: totalH*10},
        {x: 0, y: (h1+h2)*10}, {x: w1*10, y: (h1+h2)*10},
        {x: w1*10, y: h1*10}, {x: (w1+w2)*10, y: h1*10}
      ];
      l_horiz = 2; l_vert = 1;
      s_horiz = [4, 6, 0]; s_vert = [7, 5, 3];
    }

    if (labelScheme === 1) { // 2 bounding sides
      edgeLabels[l_horiz] = `${totalW} ${unit}`;
      edgeLabels[l_vert] = `${totalH} ${unit}`;
    } else if (labelScheme === 2) { // all short sides
      s_horiz.forEach((idx, i) => edgeLabels[idx] = `${s_horiz_vals[i]} ${unit}`);
      s_vert.forEach((idx, i) => edgeLabels[idx] = `${s_vert_vals[i]} ${unit}`);
    } else if (labelScheme === 3) { // 1 long horiz, all short vert
      edgeLabels[l_horiz] = `${totalW} ${unit}`;
      s_vert.forEach((idx, i) => edgeLabels[idx] = `${s_vert_vals[i]} ${unit}`);
    } else { // 1 long vert, all short horiz
      edgeLabels[l_vert] = `${totalH} ${unit}`;
      s_horiz.forEach((idx, i) => edgeLabels[idx] = `${s_horiz_vals[i]} ${unit}`);
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: vertices,
        edgeLabels: edgeLabels,
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });

    let askText = `STORY: A ${contextItem} is shaped like a set of steps with the dimensions shown in the diagram. Calculate the entire perimeter of the ${contextItem}.`;
    let finalAnswer = `${P} ${unit}`;
    
    let sysSolutionSteps = `"""1. The staircase shortcut means pushing the steps outward forms a perfect rectangle.\\n`;
    if (labelScheme === 1) {
      sysSolutionSteps += `2. Total width = ${totalW} ${unit}, Total height = ${totalH} ${unit}.\\n3. Total perimeter = 2 x (${totalW} + ${totalH}) = ${P} ${unit}."""`;
    } else if (labelScheme === 2) {
      sysSolutionSteps += `2. Total width = ${w1} + ${w2} + ${w3} = ${totalW} ${unit}.\\n3. Total height = ${h1} + ${h2} + ${h3} = ${totalH} ${unit}.\\n4. Total perimeter = 2 x (${totalW} + ${totalH}) = ${P} ${unit}."""`;
    } else if (labelScheme === 3) {
      sysSolutionSteps += `2. Total width = ${totalW} ${unit}.\\n3. Total height = ${h1} + ${h2} + ${h3} = ${totalH} ${unit}.\\n4. Total perimeter = 2 x (${totalW} + ${totalH}) = ${P} ${unit}."""`;
    } else {
      sysSolutionSteps += `2. Total width = ${w1} + ${w2} + ${w3} = ${totalW} ${unit}.\\n3. Total height = ${totalH} ${unit}.\\n4. Total perimeter = 2 x (${totalW} + ${totalH}) = ${P} ${unit}."""`;
    }

    if (isShort) {
      askText = `Find the perimeter of the figure shown.`;
    } else if (isMCQ) {
      askText = `Staircase shape fits exactly in a ${totalW} ${unit} by ${totalH} ${unit} rectangle. Perimeter?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the total length of all the horizontal segments (top and bottom):", expectedAnswer: labelScheme === 1 || labelScheme === 3 ? `${totalW} + ${totalW} = ${totalW*2}` : `${w1} + ${w2} + ${w3} + ${totalW} = ${totalW*2}`, acceptedAnswers: [`${totalW} x 2 = ${totalW*2}`] },
          { label: "Write the working equation to find the total length of all the vertical segments (left and right):", expectedAnswer: labelScheme === 1 || labelScheme === 4 ? `${totalH} + ${totalH} = ${totalH*2}` : `${h1} + ${h2} + ${h3} + ${totalH} = ${totalH*2}`, acceptedAnswers: [`${totalH} x 2 = ${totalH*2}`] },
          { label: "Write the working equation to find the total perimeter:", expectedAnswer: `${totalW*2} + ${totalH*2} = ${P}`, acceptedAnswers: [] },
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

    // Context from variable bank
    const mPlaces = ["garden", "field", "park", "playground", "courtyard"];
    const cmItems = ["cardboard piece", "paper", "metal sheet", "wooden board"];
    const contextItem = unit === "m" ? mPlaces[getRandomInt(0, mPlaces.length - 1)] : cmItems[getRandomInt(0, cmItems.length - 1)];

    const mode = getRandomInt(1, 4);
    const labelScheme = getRandomInt(1, 4);

    let vertices = [];
    let edgeLabels = Array(6).fill(null);
    let l_horiz, l_vert, s_horiz1, s_horiz2, s_vert1, s_vert2;
    let s_horiz1_val, s_horiz2_val, s_vert1_val, s_vert2_val;

    if (mode === 1) {
      // Top-Right Cut
      vertices = [
        {x: 0, y: 0}, {x: (L - cx)*10, y: 0}, {x: (L - cx)*10, y: cy*10}, 
        {x: L*10, y: cy*10}, {x: L*10, y: W*10}, {x: 0, y: W*10}
      ];
      l_horiz = 4; l_vert = 5; 
      s_horiz1 = 0; s_horiz1_val = L - cx;
      s_horiz2 = 2; s_horiz2_val = cx;
      s_vert1 = 1; s_vert1_val = cy;
      s_vert2 = 3; s_vert2_val = W - cy;
    } else if (mode === 2) {
      // Bottom-Right Cut
      vertices = [
        {x: 0, y: 0}, {x: L*10, y: 0}, {x: L*10, y: (W - cy)*10}, 
        {x: (L - cx)*10, y: (W - cy)*10}, {x: (L - cx)*10, y: W*10}, {x: 0, y: W*10}
      ];
      l_horiz = 0; l_vert = 5;
      s_horiz1 = 4; s_horiz1_val = L - cx;
      s_horiz2 = 2; s_horiz2_val = cx;
      s_vert1 = 3; s_vert1_val = cy;
      s_vert2 = 1; s_vert2_val = W - cy;
    } else if (mode === 3) {
      // Bottom-Left Cut
      vertices = [
        {x: 0, y: 0}, {x: L*10, y: 0}, {x: L*10, y: W*10}, 
        {x: cx*10, y: W*10}, {x: cx*10, y: (W - cy)*10}, {x: 0, y: (W - cy)*10}
      ];
      l_horiz = 0; l_vert = 1;
      s_horiz1 = 2; s_horiz1_val = L - cx;
      s_horiz2 = 4; s_horiz2_val = cx;
      s_vert1 = 3; s_vert1_val = cy;
      s_vert2 = 5; s_vert2_val = W - cy;
    } else {
      // Top-Left Cut
      vertices = [
        {x: cx*10, y: 0}, {x: L*10, y: 0}, {x: L*10, y: W*10}, 
        {x: 0, y: W*10}, {x: 0, y: cy*10}, {x: cx*10, y: cy*10}
      ];
      l_horiz = 2; l_vert = 1;
      s_horiz1 = 0; s_horiz1_val = L - cx;
      s_horiz2 = 4; s_horiz2_val = cx;
      s_vert1 = 5; s_vert1_val = cy;
      s_vert2 = 3; s_vert2_val = W - cy;
    }

    if (labelScheme === 1) {
      // Label 2 longest sides
      edgeLabels[l_horiz] = `${L} ${unit}`;
      edgeLabels[l_vert] = `${W} ${unit}`;
    } else if (labelScheme === 2) {
      // Label 4 short sides
      edgeLabels[s_horiz1] = `${s_horiz1_val} ${unit}`;
      edgeLabels[s_horiz2] = `${s_horiz2_val} ${unit}`;
      edgeLabels[s_vert1] = `${s_vert1_val} ${unit}`;
      edgeLabels[s_vert2] = `${s_vert2_val} ${unit}`;
    } else if (labelScheme === 3) {
      // Label Long Horiz + Short Verts
      edgeLabels[l_horiz] = `${L} ${unit}`;
      edgeLabels[s_vert1] = `${s_vert1_val} ${unit}`;
      edgeLabels[s_vert2] = `${s_vert2_val} ${unit}`;
    } else {
      // Label Long Vert + Short Horizs
      edgeLabels[l_vert] = `${W} ${unit}`;
      edgeLabels[s_horiz1] = `${s_horiz1_val} ${unit}`;
      edgeLabels[s_horiz2] = `${s_horiz2_val} ${unit}`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: vertices,
        edgeLabels: edgeLabels,
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });

    let askText = `STORY: ${person} has a rectangular ${contextItem}. A small rectangular piece is cut out of one of the corners, resulting in the shape shown in the diagram. Calculate the perimeter of the new shape.`;
    let finalAnswer = `${P} ${unit}`;
    
    let sysSolutionSteps = `"""1. Removing a corner does not change the total perimeter, because the missing outer edges are replaced by the inner edges of the same length.\\n`;
    if (labelScheme === 1) {
      sysSolutionSteps += `2. Perimeter = 2 x (${L} + ${W}) = ${P} ${unit}."""`;
    } else if (labelScheme === 2) {
      sysSolutionSteps += `2. Total width = ${L - cx} + ${cx} = ${L} ${unit}. Total height = ${W - cy} + ${cy} = ${W} ${unit}.\\n3. Perimeter = 2 x (${L} + ${W}) = ${P} ${unit}."""`;
    } else if (labelScheme === 3) {
      sysSolutionSteps += `2. Total height = ${W - cy} + ${cy} = ${W} ${unit}.\\n3. Perimeter = 2 x (${L} + ${W}) = ${P} ${unit}."""`;
    } else {
      sysSolutionSteps += `2. Total width = ${L - cx} + ${cx} = ${L} ${unit}.\\n3. Perimeter = 2 x (${L} + ${W}) = ${P} ${unit}."""`;
    }

    if (isShort) {
      askText = `Find the perimeter of the figure shown.`;
    } else if (isMCQ) {
      askText = `What is the perimeter of the shape shown?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the total bounding width:", expectedAnswer: (labelScheme === 1 || labelScheme === 3) ? `${L} = ${L}` : `${L - cx} + ${cx} = ${L}`, acceptedAnswers: [] },
          { label: "Write the working equation to find the total bounding height:", expectedAnswer: (labelScheme === 1 || labelScheme === 4) ? `${W} = ${W}` : `${W - cy} + ${cy} = ${W}`, acceptedAnswers: [] },
          { label: "Does the perimeter change when a corner is removed? Write the total perimeter of the new shape:", expectedAnswer: `${P}`, acceptedAnswers: [`${P}${unit}`] }
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
- "${(L + W)} ${unit}"
- "${(L * W) - (cx * cy)} ${unit}"
- "${(L * W)} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'advanced_composing_large_shape') {
    const count = getRandomInt(3, 6); // Number of strips
    const W = getRandomInt(2, 5);
    const mPlaces = ["garden plots", "rugs", "mats", "carpets", "wooden decks"];
    const cmItems = ["bookmarks", "paper strips", "wooden planks", "cardboard strips", "lego blocks"];
    const contextItem = unit === "m" ? mPlaces[getRandomInt(0, mPlaces.length - 1)] : cmItems[getRandomInt(0, cmItems.length - 1)];

    const scheme = getRandomInt(1, 4);
    let L, P, multiplier, stripP;
    let askText = "", finalAnswer = "", sysSolutionSteps = "", edgeLabels = [];
    let expectedSteps = [];

    if (scheme === 1) { // Square, Forward
      L = W * count; 
      P = 4 * L;
      edgeLabels = [`${W} ${unit}`, "?", null, null];
      
      askText = `STORY: ${person} has ${count} identical rectangular ${contextItem}. A single piece is shown in the diagram with a width of ${W} ${unit}. When ${person} places all ${count} of them side-by-side (joining their long edges), they form a perfect square. What is the total perimeter of this large square?`;
      finalAnswer = `${P} ${unit}`;
      sysSolutionSteps = `"""1. Since ${count} strips form a square, the length of the square is ${count} times the width: ${W} x ${count} = ${L} ${unit}.\\n2. The large shape is a square with side ${L} ${unit}.\\n3. Perimeter of the large square = ${L} x 4 = ${P} ${unit}."""`;
      
      expectedSteps = [
        { label: "Write the working equation to find the side of the new large square:", expectedAnswer: `${W} x ${count} = ${L}`, acceptedAnswers: [`${count} x ${W} = ${L}`] },
        { label: "Write the working equation to find the perimeter of the large square:", expectedAnswer: `${L} x 4 = ${P}`, acceptedAnswers: [`${L} + ${L} + ${L} + ${L} = ${P}`] },
        { label: `Perimeter of the large square:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
      ];
    } else if (scheme === 2) { // Square, Backward
      L = W * count; 
      P = 4 * L;
      stripP = 2 * (L + W);
      edgeLabels = ["?", "?", null, null];

      askText = `STORY: ${person} places ${count} identical rectangular ${contextItem} side-by-side to form a perfect large square. The total perimeter of this large square is ${P} ${unit}. Find the perimeter of just ONE single rectangular piece.`;
      finalAnswer = `${stripP} ${unit}`;
      sysSolutionSteps = `"""1. Side of the large square = ${P} / 4 = ${L} ${unit}.\\n2. The length of one strip is the side of the square = ${L} ${unit}.\\n3. The width of one strip = ${L} / ${count} = ${W} ${unit}.\\n4. Perimeter of one strip = 2 x (${L} + ${W}) = ${stripP} ${unit}."""`;

      expectedSteps = [
        { label: "Write the working equation to find one side of the large square:", expectedAnswer: `${P} / 4 = ${L}`, acceptedAnswers: [`${P} \\\\div 4 = ${L}`] },
        { label: "Write the working equation to find the width of one single strip:", expectedAnswer: `${L} / ${count} = ${W}`, acceptedAnswers: [`${L} \\\\div ${count} = ${W}`] },
        { label: "Write the working equation to find the perimeter of one single strip:", expectedAnswer: `${L} + ${W} + ${L} + ${W} = ${stripP}`, acceptedAnswers: [`(${L} + ${W}) x 2 = ${stripP}`, `${L*2} + ${W*2} = ${stripP}`] },
        { label: `Perimeter of one single strip:`, expectedAnswer: `${stripP} ${unit}`, acceptedAnswers: [`${stripP}${unit}`] }
      ];
    } else if (scheme === 3) { // Rectangle, Forward (multiplier)
      multiplier = getRandomInt(2, 4);
      L = W * multiplier;
      P = 2 * (L + (count * W));
      edgeLabels = [`${W} ${unit}`, "?", null, null];

      askText = `STORY: ${person} has ${count} identical rectangular ${contextItem}. The length of each piece is ${multiplier} times its width. A single piece is shown in the diagram with a width of ${W} ${unit}. If ${person} places all ${count} pieces side-by-side (joining their long edges), they form a large rectangle. What is the total perimeter of this large rectangle?`;
      finalAnswer = `${P} ${unit}`;
      sysSolutionSteps = `"""1. Length of one strip = ${W} x ${multiplier} = ${L} ${unit}.\\n2. The large rectangle has a length of ${L} ${unit} and a combined width of ${W} x ${count} = ${count * W} ${unit}.\\n3. Perimeter of the large rectangle = 2 x (${L} + ${count * W}) = ${P} ${unit}."""`;

      expectedSteps = [
        { label: "Write the working equation to find the length of one strip:", expectedAnswer: `${W} x ${multiplier} = ${L}`, acceptedAnswers: [`${multiplier} x ${W} = ${L}`] },
        { label: "Write the working equation to find the combined width of the large rectangle:", expectedAnswer: `${W} x ${count} = ${count * W}`, acceptedAnswers: [`${count} x ${W} = ${count * W}`] },
        { label: "Write the working equation to find the total perimeter:", expectedAnswer: `${L} + ${count * W} + ${L} + ${count * W} = ${P}`, acceptedAnswers: [`(${L} + ${count * W}) x 2 = ${P}`] },
        { label: `Total perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
      ];
    } else { // Rectangle, Backward (given L and P, find W)
      multiplier = getRandomInt(2, 4); // Just to ensure L is larger than W visually
      L = W * multiplier;
      P = 2 * (L + (count * W));
      edgeLabels = ["?", `${L} ${unit}`, null, null];

      askText = `STORY: ${person} places ${count} identical rectangular ${contextItem} side-by-side (joining their long edges) to form a large rectangle. The total perimeter of this large rectangle is ${P} ${unit}. The length of a single piece is ${L} ${unit} as shown. Find the width of one single piece.`;
      finalAnswer = `${W} ${unit}`;
      sysSolutionSteps = `"""1. The large rectangle has two lengths of ${L} ${unit}. Sum = ${L} x 2 = ${L * 2} ${unit}.\\n2. Remaining perimeter for the two combined widths = ${P} - ${L * 2} = ${P - L * 2} ${unit}.\\n3. One combined width = ${P - L * 2} / 2 = ${count * W} ${unit}.\\n4. Since the combined width is made of ${count} strips, width of one strip = ${count * W} / ${count} = ${W} ${unit}."""`;

      expectedSteps = [
        { label: "Write the working equation to find the sum of the two long sides of the large rectangle:", expectedAnswer: `${L} x 2 = ${L * 2}`, acceptedAnswers: [`${L} + ${L} = ${L * 2}`] },
        { label: "Write the working equation to find the sum of the two combined widths (Remaining perimeter):", expectedAnswer: `${P} - ${L * 2} = ${P - L * 2}`, acceptedAnswers: [] },
        { label: "Write the working equation to find just ONE combined width:", expectedAnswer: `${P - L * 2} / 2 = ${count * W}`, acceptedAnswers: [`${P - L * 2} \\\\div 2 = ${count * W}`] },
        { label: "Write the working equation to find the width of a single piece:", expectedAnswer: `${count * W} / ${count} = ${W}`, acceptedAnswers: [`${count * W} \\\\div ${count} = ${W}`] },
        { label: `Width of one piece:`, expectedAnswer: `${W} ${unit}`, acceptedAnswers: [`${W}${unit}`] }
      ];
    }

    const visualMode = getRandomInt(1, 2);
    let vertices = [];
    if (visualMode === 1) { // Vertical strip
      vertices = [{x: 0, y: 0}, {x: W*10, y: 0}, {x: W*10, y: L*10}, {x: 0, y: L*10}];
      // edgeLabels array is [top, right, bottom, left]. Let's map to [width, length, null, null]
    } else { // Horizontal strip
      vertices = [{x: 0, y: 0}, {x: L*10, y: 0}, {x: L*10, y: W*10}, {x: 0, y: W*10}];
      edgeLabels = [edgeLabels[1], edgeLabels[0], null, null]; // swap width and length labels
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: vertices,
        edgeLabels: edgeLabels,
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });

    if (isShort) {
      if (scheme === 1) askText = `${count} rectangles (width ${W} ${unit}) form a square side-by-side. Find its perimeter.`;
      else if (scheme === 2) askText = `${count} identical rectangles form a square of perimeter ${P} ${unit}. Find the perimeter of one rectangle.`;
      else if (scheme === 3) askText = `${count} rectangles (length is ${multiplier}x width) of width ${W} ${unit} form a large rectangle. Perimeter?`;
      else askText = `${count} rectangles (length ${L} ${unit}) form a large rectangle of perimeter ${P} ${unit}. Find the width of one rectangle.`;
    } else if (isMCQ) {
      if (scheme === 1) askText = `${count} rectangles (width ${W} ${unit}) form a square. Perimeter of the square?`;
      else if (scheme === 2) askText = `${count} rectangles form a square with perimeter ${P} ${unit}. Perimeter of ONE rectangle?`;
      else if (scheme === 3) askText = `${count} rectangles (W=${W} ${unit}, L=${multiplier}xW) form a large rectangle. Perimeter?`;
      else askText = `${count} rectangles (L=${L} ${unit}) form a large rectangle (P=${P} ${unit}). Width of one rectangle?`;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: expectedSteps
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
- For content.hint, use: "When joining identical strips side-by-side, their long edges touch, so the new combined width is (width of 1 strip x ${count})."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${(P/2)} ${unit}"
- "${(P + 2*L)} ${unit}"
- "${(P + 2*W)} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'advanced_symmetrical_cross') {
    const polygons = [
      {
        edges: 12,
        vertices: [
          {x: 1, y: 0}, {x: 2, y: 0}, {x: 2, y: 1}, {x: 3, y: 1},
          {x: 3, y: 2}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 1, y: 3},
          {x: 1, y: 2}, {x: 0, y: 2}, {x: 0, y: 1}, {x: 1, y: 1}
        ]
      },
      {
        edges: 16,
        vertices: [
          {x: 2, y: 4}, {x: 3, y: 4}, {x: 3, y: 3}, {x: 4, y: 3},
          {x: 4, y: 2}, {x: 3, y: 2}, {x: 3, y: 1}, {x: 2, y: 1},
          {x: 2, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1},
          {x: 0, y: 2}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 2, y: 3}
        ]
      },
      {
        edges: 20,
        vertices: [
          {x: 2, y: 0}, {x: 3, y: 0}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 4, y: 2},
          {x: 5, y: 2}, {x: 5, y: 3}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 3, y: 4},
          {x: 3, y: 5}, {x: 2, y: 5}, {x: 2, y: 4}, {x: 1, y: 4}, {x: 1, y: 3},
          {x: 0, y: 3}, {x: 0, y: 2}, {x: 1, y: 2}, {x: 1, y: 1}, {x: 2, y: 1}
        ]
      }
    ];

    const activePolygon = polygons[getRandomInt(0, polygons.length - 1)];
    const s = getRandomInt(3, 8); // length of one edge
    const totalEdges = activePolygon.edges;
    const P = s * totalEdges;
    
    const mPlaces = ["garden", "pool", "stage", "courtyard"];
    const cmItems = ["puzzle piece", "tile", "sticker", "cardboard cutout"];
    const contextItem = unit === "m" ? mPlaces[getRandomInt(0, mPlaces.length - 1)] : cmItems[getRandomInt(0, cmItems.length - 1)];

    const labelScheme = getRandomInt(1, 2); // 1 = Find P, 2 = Find s
    let edgeLabels = Array(totalEdges).fill(null);
    const randomEdge = getRandomInt(0, totalEdges - 1);
    
    if (labelScheme === 1) {
      edgeLabels[randomEdge] = `${s} ${unit}`;
    } else {
      edgeLabels[randomEdge] = `?`;
    }
    
    // Scale shape coordinates
    const scaledVertices = activePolygon.vertices.map(v => ({ x: v.x * s * 10, y: v.y * s * 10 }));

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: scaledVertices,
        edgeLabels: edgeLabels,
        fillColor: "#bfdbfe",
        strokeColor: "#0f172a"
      }
    });

    let askText = "";
    let finalAnswer = "";
    let sysSolutionSteps = "";

    if (labelScheme === 1) {
      askText = `STORY: A ${contextItem} is made up of equal outer edges. The diagram shows the length of one edge. Calculate the total perimeter of the ${contextItem}.`;
      finalAnswer = `${P} ${unit}`;
      sysSolutionSteps = `"""1. By counting the outer edges of the shape in the diagram, there are exactly ${totalEdges} equal edges.\\n2. Perimeter = ${s} x ${totalEdges} = ${P} ${unit}."""`;
    } else {
      askText = `STORY: A ${contextItem} is made up of equal outer edges. The total perimeter of the ${contextItem} is ${P} ${unit}. Find the length of one edge as shown by the '?' in the diagram.`;
      finalAnswer = `${s} ${unit}`;
      sysSolutionSteps = `"""1. By counting the outer edges of the shape in the diagram, there are exactly ${totalEdges} equal edges.\\n2. Length of one edge = ${P} / ${totalEdges} = ${s} ${unit}."""`;
    }

    if (isShort) {
      askText = labelScheme === 1 ? `A shape is made of equal outer edges of ${s} ${unit}. Find its perimeter.` : `A shape is made of equal outer edges. If its perimeter is ${P} ${unit}, what is the length of one side?`;
    } else if (isMCQ) {
      askText = labelScheme === 1 ? `Shape with equal edges of ${s} ${unit}. Perimeter?` : `Shape with equal edges has perimeter ${P} ${unit}. One edge?`;
    } else if (isStructure) {
      if (labelScheme === 1) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total perimeter (${totalEdges} equal edges):`, expectedAnswer: `${s} x ${totalEdges} = ${P}`, acceptedAnswers: [`${totalEdges} x ${s} = ${P}`] },
            { label: `Total perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
          ]
        });
      } else {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the length of one edge (${totalEdges} equal edges):`, expectedAnswer: `${P} / ${totalEdges} = ${s}`, acceptedAnswers: [`${P} \\\\div ${totalEdges} = ${s}`] },
            { label: `Length of one edge:`, expectedAnswer: `${s} ${unit}`, acceptedAnswers: [`${s}${unit}`] }
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
- For content.hint, use: "Count the number of outer edges on the shape first."
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${labelScheme === 1 ? s * (totalEdges - 2) : s * 2} ${unit}"
- "${labelScheme === 1 ? s * (totalEdges + 2) : s * 3} ${unit}"
- "${labelScheme === 1 ? s * (totalEdges + 4) : s * 4} ${unit}"` : ''}
`;
  }
  else if (activeVariant === 'advanced_frame_path_deduction') {
    const mPlaces = ["garden", "swimming pool", "flower bed", "fountain"];
    const cmItems = ["painting", "photograph", "mirror", "poster"];
    const contextItem = unit === "m" ? mPlaces[getRandomInt(0, mPlaces.length - 1)] : cmItems[getRandomInt(0, cmItems.length - 1)];
    const frameItem = unit === "m" ? "path" : "frame";

    const mode = getRandomInt(1, 4);
    let P, askText = "", finalAnswer = "", sysSolutionSteps = "", expectedSteps = [];
    let edgeLabels = [];
    let vertices = [];

    if (mode === 1 || mode === 2) {
      // Non-uniform rectangular frame
      const innerL = getRandomInt(10, 20);
      const innerW = getRandomInt(8, 15);
      const bX = getRandomInt(2, 5); // Left/Right border
      let bY = getRandomInt(2, 5); // Top/Bottom border
      if (bX === bY) bY = bX + 1; // Ensure non-uniform
      
      const outerL = innerL + 2 * bX;
      const outerW = innerW + 2 * bY;

      let polygons = [];

      if (mode === 1) { // Given Inner, Find Outer
        P = 2 * (outerL + outerW);
        polygons = [
          {
            vertices: [
              {x: 0, y: 0}, {x: outerL*10, y: 0}, 
              {x: outerL*10, y: outerW*10}, {x: 0, y: outerW*10}
            ],
            edgeLabels: [null, null, null, null],
            fillColor: "#fbcfe8",
            strokeColor: "#0f172a"
          },
          {
            // Counter-clockwise to make labels point inward
            vertices: [
              {x: bX*10, y: bY*10}, // TL
              {x: bX*10, y: (outerW-bY)*10}, // BL
              {x: (outerL-bX)*10, y: (outerW-bY)*10}, // BR
              {x: (outerL-bX)*10, y: bY*10} // TR
            ],
            edgeLabels: [null, `${innerL} ${unit}`, `${innerW} ${unit}`, null], // Left, Bottom, Right, Top
            fillColor: "#ffffff",
            strokeColor: "#0f172a"
          }
        ];
        
        askText = `STORY: A rectangular ${contextItem} is ${innerL} ${unit} long and ${innerW} ${unit} wide as shown by the inner hole in the diagram. A ${frameItem} surrounds it. The ${frameItem} is ${bX} ${unit} wide on the left and right, and ${bY} ${unit} wide on the top and bottom. Calculate the total outer perimeter of the ${frameItem}.`;
        finalAnswer = `${P} ${unit}`;
        sysSolutionSteps = `"""1. New outer length = ${innerL} + ${bX} + ${bX} = ${outerL} ${unit}.\\n2. New outer width = ${innerW} + ${bY} + ${bY} = ${outerW} ${unit}.\\n3. Total outer perimeter = 2 x (${outerL} + ${outerW}) = ${P} ${unit}."""`;
        
        expectedSteps = [
          { label: `Write the working equation to find the new outer length (${innerL} + left + right):`, expectedAnswer: `${innerL} + ${bX} + ${bX} = ${outerL}`, acceptedAnswers: [`${innerL} + ${bX*2} = ${outerL}`] },
          { label: `Write the working equation to find the new outer width (${innerW} + top + bottom):`, expectedAnswer: `${innerW} + ${bY} + ${bY} = ${outerW}`, acceptedAnswers: [`${innerW} + ${bY*2} = ${outerW}`] },
          { label: "Write the working equation to find the total outer perimeter:", expectedAnswer: `${outerL} + ${outerW} + ${outerL} + ${outerW} = ${P}`, acceptedAnswers: [`(${outerL} + ${outerW}) x 2 = ${P}`] },
          { label: `Outer perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
        ];
      } else { // Given Outer, Find Inner
        P = 2 * (innerL + innerW);
        polygons = [
          {
            vertices: [
              {x: 0, y: 0}, {x: outerL*10, y: 0}, 
              {x: outerL*10, y: outerW*10}, {x: 0, y: outerW*10}
            ],
            edgeLabels: [null, `${outerW} ${unit}`, `${outerL} ${unit}`, null], // Right, Bottom
            fillColor: "#fbcfe8",
            strokeColor: "#0f172a"
          },
          {
            // Counter-clockwise
            vertices: [
              {x: bX*10, y: bY*10}, // TL
              {x: bX*10, y: (outerW-bY)*10}, // BL
              {x: (outerL-bX)*10, y: (outerW-bY)*10}, // BR
              {x: (outerL-bX)*10, y: bY*10} // TR
            ],
            edgeLabels: [null, null, null, null],
            fillColor: "#ffffff",
            strokeColor: "#0f172a"
          }
        ];
        
        askText = `STORY: A rectangular ${contextItem} has a ${frameItem} around it. The ${frameItem} is ${bX} ${unit} wide on the left and right, and ${bY} ${unit} wide on the top and bottom. The total outer dimensions are ${outerL} ${unit} long and ${outerW} ${unit} wide as shown. Calculate the inner perimeter of the ${contextItem}.`;
        finalAnswer = `${P} ${unit}`;
        sysSolutionSteps = `"""1. Inner length = ${outerL} - ${bX} - ${bX} = ${innerL} ${unit}.\\n2. Inner width = ${outerW} - ${bY} - ${bY} = ${innerW} ${unit}.\\n3. Total inner perimeter = 2 x (${innerL} + ${innerW}) = ${P} ${unit}."""`;
        
        expectedSteps = [
          { label: `Write the working equation to find the inner length (${outerL} - left - right):`, expectedAnswer: `${outerL} - ${bX} - ${bX} = ${innerL}`, acceptedAnswers: [`${outerL} - ${bX*2} = ${innerL}`] },
          { label: `Write the working equation to find the inner width (${outerW} - top - bottom):`, expectedAnswer: `${outerW} - ${bY} - ${bY} = ${innerW}`, acceptedAnswers: [`${outerW} - ${bY*2} = ${innerW}`] },
          { label: "Write the working equation to find the total inner perimeter:", expectedAnswer: `${innerL} + ${innerW} + ${innerL} + ${innerW} = ${P}`, acceptedAnswers: [`(${innerL} + ${innerW}) x 2 = ${P}`] },
          { label: `Inner perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
        ];
      }
      
      visualEngineStr = JSON.stringify({
        componentToRender: "GEOMETRY_POLYGON",
        componentData: {
          polygons: polygons
        }
      });
      if (isShort || isMCQ) {
        if (mode === 1) askText = `The diagram shows a border around a rectangle. The border is ${bX} ${unit} wide on the left and right, and ${bY} ${unit} wide on the top and bottom. What is the total outer perimeter?`;
        else if (mode === 2) askText = `The diagram shows a border around a rectangle. The border is ${bX} ${unit} wide on the left and right, and ${bY} ${unit} wide on the top and bottom. What is the inner perimeter?`;
      }
    } else {
      // Irregular L-Shape path deduction
      const L1 = getRandomInt(10, 15), W1 = getRandomInt(10, 15);
      const L2 = getRandomInt(4, 8), W2 = getRandomInt(4, 8);
      const B = getRandomInt(2, 5); // Uniform border
      
      const pIn = 2 * (L1 + W1);
      const pOut = pIn + 8 * B;

      let polygons = [
        {
          vertices: [
            {x: 0, y: 0}, {x: (L1+2*B)*10, y: 0}, {x: (L1+2*B)*10, y: (W2+2*B)*10}, 
            {x: (L2+2*B)*10, y: (W2+2*B)*10}, {x: (L2+2*B)*10, y: (W1+2*B)*10}, {x: 0, y: (W1+2*B)*10}
          ],
          edgeLabels: Array(6).fill(null),
          fillColor: "#fbcfe8",
          strokeColor: "#0f172a"
        },
        {
          vertices: [
            {x: B*10, y: B*10}, {x: (L1+B)*10, y: B*10}, {x: (L1+B)*10, y: (W2+B)*10}, 
            {x: (L2+B)*10, y: (W2+B)*10}, {x: (L2+B)*10, y: (W1+B)*10}, {x: B*10, y: (W1+B)*10}
          ],
          edgeLabels: Array(6).fill(null),
          fillColor: "#ffffff",
          strokeColor: "#0f172a"
        }
      ];

      if (mode === 3) { // Given Inner P, Find Outer P
        P = pOut;
        askText = `STORY: An irregular L-shaped ${contextItem} (shown in the diagram) has a total inner perimeter of ${pIn} ${unit}. A uniform ${frameItem} of width ${B} ${unit} is added around all its sides. What is the total outer perimeter of the ${frameItem}?`;
        finalAnswer = `${P} ${unit}`;
        sysSolutionSteps = `"""1. Adding a border of ${B} ${unit} pushes the bounding box out by ${B} on all 4 sides.\\n2. The bounding length increases by ${B} x 2 = ${2*B} ${unit}.\\n3. The bounding width increases by ${B} x 2 = ${2*B} ${unit}.\\n4. The total perimeter increases by 2 x (${2*B} + ${2*B}) = ${8*B} ${unit}.\\n5. Outer perimeter = ${pIn} + ${8*B} = ${P} ${unit}."""`;
        
        expectedSteps = [
          { label: `Write the working equation to find how much the bounding length increases (${B} on left + right):`, expectedAnswer: `${B} x 2 = ${2*B}`, acceptedAnswers: [`${B} + ${B} = ${2*B}`] },
          { label: `Write the working equation to find how much the total perimeter increases (2 lengths + 2 widths):`, expectedAnswer: `${2*B} x 4 = ${8*B}`, acceptedAnswers: [`${2*B} + ${2*B} + ${2*B} + ${2*B} = ${8*B}`] },
          { label: "Write the working equation to find the new outer perimeter:", expectedAnswer: `${pIn} + ${8*B} = ${P}`, acceptedAnswers: [] },
          { label: `Outer perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
        ];
      } else { // Given Outer P, Find Inner P
        P = pIn;
        askText = `STORY: An irregular L-shaped ${contextItem} has a uniform ${frameItem} of width ${B} ${unit} around all its sides. The total outer perimeter of the ${frameItem} is ${pOut} ${unit}. What is the inner perimeter of the ${contextItem} itself?`;
        finalAnswer = `${P} ${unit}`;
        sysSolutionSteps = `"""1. A border of ${B} ${unit} means the bounding box was pushed out by ${B} on all 4 sides.\\n2. The total perimeter difference is 8 x ${B} = ${8*B} ${unit}.\\n3. Inner perimeter = ${pOut} - ${8*B} = ${P} ${unit}."""`;
        
        expectedSteps = [
          { label: `Write the working equation to find the total difference in perimeter (8 times the border width):`, expectedAnswer: `${B} x 8 = ${8*B}`, acceptedAnswers: [`8 x ${B} = ${8*B}`] },
          { label: "Write the working equation to find the inner perimeter:", expectedAnswer: `${pOut} - ${8*B} = ${P}`, acceptedAnswers: [] },
          { label: `Inner perimeter:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] }
        ];
      }
      
      visualEngineStr = JSON.stringify({
        componentToRender: "GEOMETRY_POLYGON",
        componentData: {
          polygons: polygons
        }
      });
      
      if (isShort || isMCQ) {
        if (mode === 3) askText = `A uniform border of ${B} ${unit} is added around an L-shape. If the inner perimeter is ${pIn} ${unit}, what is the total outer perimeter?`;
        else askText = `An L-shape has a uniform border of ${B} ${unit} around it. If the total outer perimeter is ${pOut} ${unit}, what is the inner perimeter?`;
      }
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: expectedSteps
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
- For content.hint, use: "${mode <= 2 ? `Remember to account for the border TWICE on each dimension (e.g. left and right).` : `Adding a uniform border of width B to any rectilinear shape increases its perimeter by 8 x B.`}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswer}"
- "${(parseInt(finalAnswer) + 12)} ${unit}"
- "${(parseInt(finalAnswer) - 8)} ${unit}"
- "${(parseInt(finalAnswer) + 16)} ${unit}"` : ''}
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
