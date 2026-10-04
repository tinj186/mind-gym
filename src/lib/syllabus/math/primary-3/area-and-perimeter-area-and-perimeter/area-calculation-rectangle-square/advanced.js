import { getRandomNames } from '../../../../../utils/variable-bank.js';

export function advancedLogic(activeVariant, args) {
  const { isShort, isMCQ, isStructure, getRandomInt, unit, zodType, zodDiff, topic } = args;
  
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });
  let inputRequirementStr = "";
  let systemPrompt = "";

  const name = getRandomNames()[0];

  if (activeVariant === 'advanced_composite_all_sides') {
    // 0: L-shape, 1: T-shape, 2: 3-Rectangles (Step shape)
    const shapeType = getRandomInt(0, 2);
    // 0: Find Total Area, 1: Find a missing vertical side given Total Area
    const target = getRandomInt(0, 1);
    
    let totalArea = 0;
    let vertices = [];
    let edgeLabels = [];
    let askText = "";
    let finalAnswer = "";
    let finalAnswerVal = 0;
    let hintStr = "";
    let sysSolutionSteps = "";
    let expectedSteps = [];

    const items = ["figure", "block", "cardboard shape", "paper cutout"];
    const item = items[getRandomInt(0, items.length - 1)];

    if (shapeType === 0) {
      // L-shape
      const w1 = getRandomInt(3, 5);
      const h1 = getRandomInt(6, 10);
      const w2 = getRandomInt(4, 7);
      const h2 = getRandomInt(2, 4);
      
      const totalW = w1 + w2;
      const totalH = h1; 
      
      const area1 = w1 * h1;
      const area2 = w2 * h2;
      totalArea = area1 + area2;

      vertices = [
        {x: 0, y: 0},
        {x: w1*10, y: 0},
        {x: w1*10, y: (h1-h2)*10},
        {x: totalW*10, y: (h1-h2)*10},
        {x: totalW*10, y: h1*10},
        {x: 0, y: h1*10}
      ];

      if (target === 0) {
        edgeLabels = [`${w1} ${unit}`, null, null, `${h2} ${unit}`, `${totalW} ${unit}`, `${h1} ${unit}`];
        askText = `Look at the L-shaped ${item}. It can be split into two smaller rectangles. Find the total area of the ${item}.`;
        finalAnswer = `${totalArea} ${unit}²`;
        finalAnswerVal = totalArea;
        hintStr = "Split the L-shape into two rectangles. Find the area of both and add them together.";
        sysSolutionSteps = `"""1. Area of left rectangle = ${w1} x ${h1} = ${area1} ${unit}².\\n2. Area of right rectangle = ${w2} x ${h2} = ${area2} ${unit}².\\n3. Total Area = ${area1} + ${area2} = ${totalArea} ${unit}²."""`;
        
        expectedSteps.push({ label: `Write the working equation to find the area of the left rectangle:`, expectedAnswer: `${w1} x ${h1} = ${area1}`, acceptedAnswers: [`${h1} x ${w1} = ${area1}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the right rectangle:`, expectedAnswer: `${w2} x ${h2} = ${area2}`, acceptedAnswers: [`${h2} x ${w2} = ${area2}`] });
        expectedSteps.push({ label: `Write the working equation to find the total area:`, expectedAnswer: `${area1} + ${area2} = ${totalArea}`, acceptedAnswers: [`${area2} + ${area1} = ${totalArea}`] });
        expectedSteps.push({ label: `Total area:`, expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}${unit}²`] });
      } else {
        edgeLabels = [`${w1} ${unit}`, null, null, "?", `${totalW} ${unit}`, `${h1} ${unit}`];
        askText = `An L-shaped ${item} has a total area of ${totalArea} ${unit}². The longest vertical side is ${h1} ${unit} and the longest horizontal side is ${totalW} ${unit}. The top horizontal edge is ${w1} ${unit}. Find the missing vertical side length indicated by "?".`;
        finalAnswer = `${h2} ${unit}`;
        finalAnswerVal = h2;
        hintStr = "Split the shape. Find the area of the known rectangle, subtract it from the total area, and then find the missing side of the second rectangle.";
        sysSolutionSteps = `"""1. Area of left rectangle = ${w1} x ${h1} = ${area1} ${unit}².\\n2. Area of right rectangle = ${totalArea} - ${area1} = ${area2} ${unit}².\\n3. Width of right rectangle = ${totalW} - ${w1} = ${w2} ${unit}.\\n4. Missing vertical side = ${area2} ÷ ${w2} = ${h2} ${unit}."""`;
        
        expectedSteps.push({ label: `Write the working equation to find the area of the left rectangle:`, expectedAnswer: `${w1} x ${h1} = ${area1}`, acceptedAnswers: [`${h1} x ${w1} = ${area1}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the right rectangle:`, expectedAnswer: `${totalArea} - ${area1} = ${area2}`, acceptedAnswers: [] });
        expectedSteps.push({ label: `Write the working equation to find the width of the right rectangle:`, expectedAnswer: `${totalW} - ${w1} = ${w2}`, acceptedAnswers: [] });
        expectedSteps.push({ label: `Write the working equation to find the missing vertical side:`, expectedAnswer: `${area2} / ${w2} = ${h2}`, acceptedAnswers: [`${area2} \\div ${w2} = ${h2}`] });
        expectedSteps.push({ label: `Missing side length:`, expectedAnswer: `${h2} ${unit}`, acceptedAnswers: [`${h2}${unit}`] });
      }

    } else if (shapeType === 1) {
      // T-shape
      const topW = getRandomInt(6, 10); // even
      const w1 = topW % 2 !== 0 ? topW + 1 : topW; 
      const h1 = getRandomInt(2, 4);
      const w2 = getRandomInt(2, w1 - 2); // strictly smaller than w1
      // ensure w2 is also even or has same parity as w1 so it can be centered nicely on an integer coordinate if needed, but visually it doesn't matter much.
      const h2 = getRandomInt(4, 7);
      
      const area1 = w1 * h1;
      const area2 = w2 * h2;
      totalArea = area1 + area2;
      const indent = Math.floor((w1 - w2) / 2);

      vertices = [
        {x: 0, y: 0},
        {x: w1*10, y: 0},
        {x: w1*10, y: h1*10},
        {x: (w1 - indent)*10, y: h1*10},
        {x: (w1 - indent)*10, y: (h1+h2)*10},
        {x: indent*10, y: (h1+h2)*10},
        {x: indent*10, y: h1*10},
        {x: 0, y: h1*10}
      ];

      if (target === 0) {
        edgeLabels = [`${w1} ${unit}`, `${h1} ${unit}`, null, `${h2} ${unit}`, `${w2} ${unit}`, null, null, null];
        askText = `Look at the T-shaped ${item}. Find the total area of the ${item}.`;
        finalAnswer = `${totalArea} ${unit}²`;
        finalAnswerVal = totalArea;
        hintStr = "Split the T-shape into a top horizontal rectangle and a bottom vertical rectangle.";
        sysSolutionSteps = `"""1. Area of top rectangle = ${w1} x ${h1} = ${area1} ${unit}².\\n2. Area of bottom rectangle = ${w2} x ${h2} = ${area2} ${unit}².\\n3. Total Area = ${area1} + ${area2} = ${totalArea} ${unit}²."""`;
        
        expectedSteps.push({ label: `Write the working equation to find the area of the top rectangle:`, expectedAnswer: `${w1} x ${h1} = ${area1}`, acceptedAnswers: [`${h1} x ${w1} = ${area1}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the bottom rectangle:`, expectedAnswer: `${w2} x ${h2} = ${area2}`, acceptedAnswers: [`${h2} x ${w2} = ${area2}`] });
        expectedSteps.push({ label: `Write the working equation to find the total area:`, expectedAnswer: `${area1} + ${area2} = ${totalArea}`, acceptedAnswers: [`${area2} + ${area1} = ${totalArea}`] });
        expectedSteps.push({ label: `Total area:`, expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}${unit}²`] });
      } else {
        edgeLabels = [`${w1} ${unit}`, `${h1} ${unit}`, null, "?", `${w2} ${unit}`, null, null, null];
        askText = `A T-shaped ${item} has a total area of ${totalArea} ${unit}². The top rectangle is ${w1} ${unit} by ${h1} ${unit}. The bottom rectangle has a width of ${w2} ${unit}. Find the missing length indicated by "?".`;
        finalAnswer = `${h2} ${unit}`;
        finalAnswerVal = h2;
        hintStr = "Find the area of the top rectangle, subtract it from the total area, and then divide by the width of the bottom rectangle.";
        sysSolutionSteps = `"""1. Area of top rectangle = ${w1} x ${h1} = ${area1} ${unit}².\\n2. Area of bottom rectangle = ${totalArea} - ${area1} = ${area2} ${unit}².\\n3. Missing length = ${area2} ÷ ${w2} = ${h2} ${unit}."""`;
        
        expectedSteps.push({ label: `Write the working equation to find the area of the top rectangle:`, expectedAnswer: `${w1} x ${h1} = ${area1}`, acceptedAnswers: [`${h1} x ${w1} = ${area1}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the bottom rectangle:`, expectedAnswer: `${totalArea} - ${area1} = ${area2}`, acceptedAnswers: [] });
        expectedSteps.push({ label: `Write the working equation to find the missing length:`, expectedAnswer: `${area2} / ${w2} = ${h2}`, acceptedAnswers: [`${area2} \\div ${w2} = ${h2}`] });
        expectedSteps.push({ label: `Missing side length:`, expectedAnswer: `${h2} ${unit}`, acceptedAnswers: [`${h2}${unit}`] });
      }

    } else {
      // Step shape (3 rectangles)
      const w1 = getRandomInt(2, 4);
      const h1 = getRandomInt(6, 8);
      const w2 = getRandomInt(3, 5);
      const h2 = getRandomInt(4, 5);
      const w3 = getRandomInt(3, 5);
      const h3 = getRandomInt(2, 3);
      
      const area1 = w1 * h1;
      const area2 = w2 * h2;
      const area3 = w3 * h3;
      totalArea = area1 + area2 + area3;

      vertices = [
        {x: 0, y: 0},
        {x: w1*10, y: 0},
        {x: w1*10, y: (h1-h2)*10},
        {x: (w1+w2)*10, y: (h1-h2)*10},
        {x: (w1+w2)*10, y: (h1-h3)*10},
        {x: (w1+w2+w3)*10, y: (h1-h3)*10},
        {x: (w1+w2+w3)*10, y: h1*10},
        {x: 0, y: h1*10}
      ];

      if (target === 0) {
        edgeLabels = [`${w1} ${unit}`, null, `${w2} ${unit}`, null, `${w3} ${unit}`, `${h3} ${unit}`, `${w1+w2+w3} ${unit}`, `${h1} ${unit}`];
        askText = `Look at the staircase-shaped ${item}. It is made of 3 joined rectangles. Find the total area of the ${item}.`;
        finalAnswer = `${totalArea} ${unit}²`;
        finalAnswerVal = totalArea;
        hintStr = "Split the shape into 3 vertical rectangles. Find the area of each and add them together.";
        sysSolutionSteps = `"""1. Area of 1st rectangle = ${w1} x ${h1} = ${area1} ${unit}².\\n2. Area of 2nd rectangle = ${w2} x ${h2} = ${area2} ${unit}².\\n3. Area of 3rd rectangle = ${w3} x ${h3} = ${area3} ${unit}².\\n4. Total Area = ${area1} + ${area2} + ${area3} = ${totalArea} ${unit}²."""`;
        
        expectedSteps.push({ label: `Write the working equation to find the area of the 1st rectangle:`, expectedAnswer: `${w1} x ${h1} = ${area1}`, acceptedAnswers: [`${h1} x ${w1} = ${area1}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the 2nd rectangle:`, expectedAnswer: `${w2} x ${h2} = ${area2}`, acceptedAnswers: [`${h2} x ${w2} = ${area2}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the 3rd rectangle:`, expectedAnswer: `${w3} x ${h3} = ${area3}`, acceptedAnswers: [`${h3} x ${w3} = ${area3}`] });
        expectedSteps.push({ label: `Write the working equation to find the total area:`, expectedAnswer: `${area1} + ${area2} + ${area3} = ${totalArea}`, acceptedAnswers: [] });
        expectedSteps.push({ label: `Total area:`, expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}${unit}²`] });
      } else {
        edgeLabels = [`${w1} ${unit}`, null, `${w2} ${unit}`, null, `${w3} ${unit}`, "?", `${w1+w2+w3} ${unit}`, `${h1} ${unit}`];
        askText = `A staircase-shaped ${item} has a total area of ${totalArea} ${unit}². The first rectangle is ${w1} x ${h1} ${unit}. The second is ${w2} x ${h2} ${unit}. The third has a width of ${w3} ${unit}. Find the missing height of the third rectangle indicated by "?".`;
        finalAnswer = `${h3} ${unit}`;
        finalAnswerVal = h3;
        hintStr = "Find the area of the first two rectangles, subtract them from the total area, then find the missing side.";
        sysSolutionSteps = `"""1. Area of 1st rectangle = ${w1} x ${h1} = ${area1} ${unit}².\\n2. Area of 2nd rectangle = ${w2} x ${h2} = ${area2} ${unit}².\\n3. Area of 3rd rectangle = ${totalArea} - ${area1} - ${area2} = ${area3} ${unit}².\\n4. Missing height = ${area3} ÷ ${w3} = ${h3} ${unit}."""`;
        
        expectedSteps.push({ label: `Write the working equation to find the area of the 1st rectangle:`, expectedAnswer: `${w1} x ${h1} = ${area1}`, acceptedAnswers: [`${h1} x ${w1} = ${area1}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the 2nd rectangle:`, expectedAnswer: `${w2} x ${h2} = ${area2}`, acceptedAnswers: [`${h2} x ${w2} = ${area2}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the 3rd rectangle:`, expectedAnswer: `${totalArea} - ${area1 + area2} = ${area3}`, acceptedAnswers: [`${totalArea} - ${area1} - ${area2} = ${area3}`] });
        expectedSteps.push({ label: `Write the working equation to find the missing height:`, expectedAnswer: `${area3} / ${w3} = ${h3}`, acceptedAnswers: [`${area3} \\div ${w3} = ${h3}`] });
        expectedSteps.push({ label: `Missing side length:`, expectedAnswer: `${h3} ${unit}`, acceptedAnswers: [`${h3}${unit}`] });
      }
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
- "${finalAnswerVal} ${unit}${target===0?'²':''}"
- "${finalAnswerVal + 4} ${unit}${target===0?'²':''}"
- "${finalAnswerVal * 2} ${unit}${target===0?'²':''}"
- "${finalAnswerVal > 2 ? finalAnswerVal - 2 : finalAnswerVal + 5} ${unit}${target===0?'²':''}"` : ''}
`;
  } else if (activeVariant === 'advanced_composite_missing_sides') {
    // 0: L-shape, 1: T-shape
    const shapeType = getRandomInt(0, 1);
    
    let totalArea = 0;
    let vertices = [];
    let edgeLabels = [];
    let askText = "";
    let finalAnswer = "";
    let finalAnswerVal = 0;
    let hintStr = "";
    let sysSolutionSteps = "";
    let expectedSteps = [];

    const items = ["figure", "block", "cardboard shape", "cutout"];
    const item = items[getRandomInt(0, items.length - 1)];
    const isRelational = Math.random() > 0.5;

    if (shapeType === 0) {
      // L-shape
      const w1 = getRandomInt(3, 5);
      const w1_rel = getRandomInt(2, 3);
      const totalW = w1 * w1_rel;
      
      const h2_rel = getRandomInt(2, 3);
      const h2 = w1; // equal length relationship
      const totalH = h2 * h2_rel;
      
      const w2 = totalW - w1;
      const hMissing = totalH - h2;
      const h1 = totalH;
      
      const area1 = w1 * totalH;
      const area2 = w2 * h2;
      totalArea = area1 + area2;

      vertices = [
        {x: 0, y: 0},
        {x: w1*10, y: 0},
        {x: w1*10, y: hMissing*10},
        {x: totalW*10, y: hMissing*10},
        {x: totalW*10, y: totalH*10},
        {x: 0, y: totalH*10}
      ];

      // Target: 0 = Find total area, 1 = Find missing vertical side given area
      const target = getRandomInt(0, 1);

      const relTextW = w1_rel === 2 ? "twice as long as" : "three times as long as";
      const relTextH = h2_rel === 2 ? "twice as long as" : "three times as long as";

      if (target === 0) {
        if (isRelational) {
          edgeLabels = [`${w1} ${unit}`, null, null, null, null, null];
          askText = `STORY: An L-shaped ${item} has a top horizontal edge of ${w1} ${unit}. The longest horizontal side is ${relTextW} the top edge. The bottom vertical side (inner right) is equal in length to the top edge. The longest vertical side is ${relTextH} the bottom vertical side. Find the total area of the ${item}.`;
          hintStr = "Use the relationships to find all the side lengths first, then split the shape into two rectangles.";
          sysSolutionSteps = `"""1. Longest horizontal side = ${w1} x ${w1_rel} = ${totalW} ${unit}.\\n2. Bottom vertical side = ${h2} ${unit}.\\n3. Longest vertical side = ${h2} x ${h2_rel} = ${totalH} ${unit}.\\n4. Missing horizontal side = ${totalW} - ${w1} = ${w2} ${unit}.\\n5. Area of left rectangle = ${w1} x ${totalH} = ${area1} ${unit}².\\n6. Area of right rectangle = ${w2} x ${h2} = ${area2} ${unit}².\\n7. Total Area = ${area1} + ${area2} = ${totalArea} ${unit}²."""`;

          expectedSteps.push({ label: `Write the working equation to find the longest horizontal side:`, expectedAnswer: `${w1} x ${w1_rel} = ${totalW}`, acceptedAnswers: [`${w1_rel} x ${w1} = ${totalW}`] });
          expectedSteps.push({ label: `Write the working equation to find the longest vertical side:`, expectedAnswer: `${h2} x ${h2_rel} = ${totalH}`, acceptedAnswers: [`${h2_rel} x ${h2} = ${totalH}`] });
        } else {
          edgeLabels = [`${w1} ${unit}`, `${hMissing} ${unit}`, null, null, `${totalW} ${unit}`, `${totalH} ${unit}`];
          askText = `STORY: An L-shaped ${item} has a longest vertical side of ${totalH} ${unit} and a longest horizontal side of ${totalW} ${unit}. The top horizontal edge is ${w1} ${unit} and the inner vertical cut is ${hMissing} ${unit}. Find the total area of the ${item}.`;
          hintStr = "Use the given sides to find the missing side dimensions first, then split the shape into two rectangles.";
          sysSolutionSteps = `"""1. Bottom vertical side = ${totalH} - ${hMissing} = ${h2} ${unit}.\\n2. Missing horizontal side = ${totalW} - ${w1} = ${w2} ${unit}.\\n3. Area of left rectangle = ${w1} x ${totalH} = ${area1} ${unit}².\\n4. Area of right rectangle = ${w2} x ${h2} = ${area2} ${unit}².\\n5. Total Area = ${area1} + ${area2} = ${totalArea} ${unit}²."""`;
          
          expectedSteps.push({ label: `Write the working equation to find the missing horizontal side length:`, expectedAnswer: `${totalW} - ${w1} = ${w2}`, acceptedAnswers: [] });
          expectedSteps.push({ label: `Write the working equation to find the missing bottom vertical side length:`, expectedAnswer: `${totalH} - ${hMissing} = ${h2}`, acceptedAnswers: [] });
        }
        
        finalAnswer = `${totalArea} ${unit}²`;
        finalAnswerVal = totalArea;

        expectedSteps.push({ label: `Write the working equation to find the area of the left rectangle:`, expectedAnswer: `${w1} x ${totalH} = ${area1}`, acceptedAnswers: [`${totalH} x ${w1} = ${area1}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the right rectangle:`, expectedAnswer: `${w2} x ${h2} = ${area2}`, acceptedAnswers: [`${h2} x ${w2} = ${area2}`] });
        expectedSteps.push({ label: `Write the working equation to find the total area:`, expectedAnswer: `${area1} + ${area2} = ${totalArea}`, acceptedAnswers: [`${area2} + ${area1} = ${totalArea}`] });
        expectedSteps.push({ label: `Total area:`, expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}${unit}²`] });

      } else {
        if (isRelational) {
          edgeLabels = [`${w1} ${unit}`, null, null, null, null, null];
          askText = `STORY: An L-shaped ${item} has a total area of ${totalArea} ${unit}². The top horizontal edge is ${w1} ${unit}. The longest horizontal side is ${relTextW} the top edge. The bottom vertical side (inner right) is equal in length to the top edge. Find the longest vertical side of the ${item}.`;
          hintStr = "Use the relationships to find the right rectangle's dimensions and area. Subtract it from the total area to find the left rectangle's area, then deduce its height.";
          sysSolutionSteps = `"""1. Longest horizontal side = ${w1} x ${w1_rel} = ${totalW} ${unit}.\\n2. Bottom vertical side = ${h2} ${unit}.\\n3. Missing horizontal side = ${totalW} - ${w1} = ${w2} ${unit}.\\n4. Area of right rectangle = ${w2} x ${h2} = ${area2} ${unit}².\\n5. Area of left rectangle = ${totalArea} - ${area2} = ${area1} ${unit}².\\n6. Longest vertical side = ${area1} ÷ ${w1} = ${totalH} ${unit}."""`;

          expectedSteps.push({ label: `Write the working equation to find the longest horizontal side:`, expectedAnswer: `${w1} x ${w1_rel} = ${totalW}`, acceptedAnswers: [`${w1_rel} x ${w1} = ${totalW}`] });
          expectedSteps.push({ label: `Write the working equation to find the width of the right rectangle:`, expectedAnswer: `${totalW} - ${w1} = ${w2}`, acceptedAnswers: [] });
        } else {
          edgeLabels = [`${w1} ${unit}`, null, null, `${h2} ${unit}`, `${totalW} ${unit}`, null];
          askText = `STORY: An L-shaped ${item} has a total area of ${totalArea} ${unit}². The longest horizontal side is ${totalW} ${unit}. The top horizontal edge is ${w1} ${unit}. The bottom vertical side (inner right) is ${h2} ${unit}. Find the longest vertical side of the ${item}.`;
          hintStr = "Find the right rectangle's area. Subtract it from the total area to find the left rectangle's area, then deduce its height.";
          sysSolutionSteps = `"""1. Missing horizontal side = ${totalW} - ${w1} = ${w2} ${unit}.\\n2. Area of right rectangle = ${w2} x ${h2} = ${area2} ${unit}².\\n3. Area of left rectangle = ${totalArea} - ${area2} = ${area1} ${unit}².\\n4. Longest vertical side = ${area1} ÷ ${w1} = ${totalH} ${unit}."""`;

          expectedSteps.push({ label: `Write the working equation to find the width of the right rectangle:`, expectedAnswer: `${totalW} - ${w1} = ${w2}`, acceptedAnswers: [] });
        }
        
        finalAnswer = `${totalH} ${unit}`;
        finalAnswerVal = totalH;

        expectedSteps.push({ label: `Write the working equation to find the area of the right rectangle:`, expectedAnswer: `${w2} x ${h2} = ${area2}`, acceptedAnswers: [`${h2} x ${w2} = ${area2}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the left rectangle:`, expectedAnswer: `${totalArea} - ${area2} = ${area1}`, acceptedAnswers: [] });
        expectedSteps.push({ label: `Write the working equation to find the longest vertical side:`, expectedAnswer: `${area1} / ${w1} = ${totalH}`, acceptedAnswers: [`${area1} \\div ${w1} = ${totalH}`] });
        expectedSteps.push({ label: `Longest vertical side:`, expectedAnswer: `${totalH} ${unit}`, acceptedAnswers: [`${totalH}${unit}`] });
      }
    } else {
      // T-shape
      const topW = getRandomInt(6, 10);
      const w1 = topW % 2 !== 0 ? topW + 1 : topW; 
      const h1_rel = 2; // top width is twice the top height
      const h1 = w1 / h1_rel;
      
      const w2 = w1 / 2; // bottom width is half the top width
      const h2_rel = getRandomInt(2, 3);
      const h2 = w2 * h2_rel; // bottom height is 2x or 3x the bottom width

      const area1 = w1 * h1;
      const area2 = w2 * h2;
      totalArea = area1 + area2;
      const indent = Math.floor((w1 - w2) / 2);

      vertices = [
        {x: 0, y: 0},
        {x: w1*10, y: 0},
        {x: w1*10, y: h1*10},
        {x: (w1 - indent)*10, y: h1*10},
        {x: (w1 - indent)*10, y: (h1+h2)*10},
        {x: indent*10, y: (h1+h2)*10},
        {x: indent*10, y: h1*10},
        {x: 0, y: h1*10}
      ];

      const relTextH2 = h2_rel === 2 ? "twice as long as" : "three times as long as";
      const target = getRandomInt(0, 1);

      if (target === 0) {
        if (isRelational) {
          edgeLabels = [`${w1} ${unit}`, null, null, null, null, null, null, null];
          askText = `STORY: A T-shaped ${item} has a top horizontal edge of ${w1} ${unit}. The top edge is twice as long as the top vertical sides. The bottom rectangle has a width that is half of the top edge. The bottom vertical side is ${relTextH2} the bottom width. Find the total area of the ${item}.`;
          hintStr = "Use the relationships to find all the side lengths first, then split the shape into a top and bottom rectangle.";
          sysSolutionSteps = `"""1. Top height = ${w1} ÷ 2 = ${h1} ${unit}.\\n2. Area of top rectangle = ${w1} x ${h1} = ${area1} ${unit}².\\n3. Bottom width = ${w1} ÷ 2 = ${w2} ${unit}.\\n4. Bottom height = ${w2} x ${h2_rel} = ${h2} ${unit}.\\n5. Area of bottom rectangle = ${w2} x ${h2} = ${area2} ${unit}².\\n6. Total Area = ${area1} + ${area2} = ${totalArea} ${unit}²."""`;

          expectedSteps.push({ label: `Write the working equation to find the top height:`, expectedAnswer: `${w1} / 2 = ${h1}`, acceptedAnswers: [`${w1} \\div 2 = ${h1}`] });
          expectedSteps.push({ label: `Write the working equation to find the area of the top rectangle:`, expectedAnswer: `${w1} x ${h1} = ${area1}`, acceptedAnswers: [`${h1} x ${w1} = ${area1}`] });
          expectedSteps.push({ label: `Write the working equation to find the bottom width:`, expectedAnswer: `${w1} / 2 = ${w2}`, acceptedAnswers: [`${w1} \\div 2 = ${w2}`] });
          expectedSteps.push({ label: `Write the working equation to find the bottom height:`, expectedAnswer: `${w2} x ${h2_rel} = ${h2}`, acceptedAnswers: [`${h2_rel} x ${w2} = ${h2}`] });
        } else {
          edgeLabels = [`${w1} ${unit}`, `${h1} ${unit}`, null, `${h2} ${unit}`, `${w2} ${unit}`, null, null, null];
          askText = `STORY: A T-shaped ${item} has a top rectangle measuring ${w1} ${unit} by ${h1} ${unit}. The bottom rectangle has a width of ${w2} ${unit} and a height of ${h2} ${unit}. Find the total area of the ${item}.`;
          hintStr = "Split the T-shape into a top and bottom rectangle. Find the area of each and add them together.";
          sysSolutionSteps = `"""1. Area of top rectangle = ${w1} x ${h1} = ${area1} ${unit}².\\n2. Area of bottom rectangle = ${w2} x ${h2} = ${area2} ${unit}².\\n3. Total Area = ${area1} + ${area2} = ${totalArea} ${unit}²."""`;

          expectedSteps.push({ label: `Write the working equation to find the area of the top rectangle:`, expectedAnswer: `${w1} x ${h1} = ${area1}`, acceptedAnswers: [`${h1} x ${w1} = ${area1}`] });
        }
        
        finalAnswer = `${totalArea} ${unit}²`;
        finalAnswerVal = totalArea;

        expectedSteps.push({ label: `Write the working equation to find the area of the bottom rectangle:`, expectedAnswer: `${w2} x ${h2} = ${area2}`, acceptedAnswers: [`${h2} x ${w2} = ${area2}`] });
        expectedSteps.push({ label: `Write the working equation to find the total area:`, expectedAnswer: `${area1} + ${area2} = ${totalArea}`, acceptedAnswers: [`${area2} + ${area1} = ${totalArea}`] });
        expectedSteps.push({ label: `Total area:`, expectedAnswer: `${totalArea} ${unit}²`, acceptedAnswers: [`${totalArea}${unit}²`] });

      } else {
        if (isRelational) {
          edgeLabels = [`${w1} ${unit}`, null, null, null, null, null, null, null];
          askText = `STORY: A T-shaped ${item} has a total area of ${totalArea} ${unit}². The top horizontal edge is ${w1} ${unit}. The top edge is twice as long as the top vertical sides. The bottom rectangle has a width that is half of the top edge. Find the bottom vertical side of the ${item}.`;
          hintStr = "Use the relationships to find the top rectangle's area and the bottom rectangle's width. Subtract to find the bottom rectangle's area, then deduce its height.";
          sysSolutionSteps = `"""1. Top height = ${w1} ÷ 2 = ${h1} ${unit}.\\n2. Area of top rectangle = ${w1} x ${h1} = ${area1} ${unit}².\\n3. Area of bottom rectangle = ${totalArea} - ${area1} = ${area2} ${unit}².\\n4. Bottom width = ${w1} ÷ 2 = ${w2} ${unit}.\\n5. Bottom vertical side = ${area2} ÷ ${w2} = ${h2} ${unit}."""`;

          expectedSteps.push({ label: `Write the working equation to find the top height:`, expectedAnswer: `${w1} / 2 = ${h1}`, acceptedAnswers: [`${w1} \\div 2 = ${h1}`] });
          expectedSteps.push({ label: `Write the working equation to find the area of the top rectangle:`, expectedAnswer: `${w1} x ${h1} = ${area1}`, acceptedAnswers: [`${h1} x ${w1} = ${area1}`] });
          expectedSteps.push({ label: `Write the working equation to find the area of the bottom rectangle:`, expectedAnswer: `${totalArea} - ${area1} = ${area2}`, acceptedAnswers: [] });
          expectedSteps.push({ label: `Write the working equation to find the bottom width:`, expectedAnswer: `${w1} / 2 = ${w2}`, acceptedAnswers: [`${w1} \\div 2 = ${w2}`] });
        } else {
          edgeLabels = [`${w1} ${unit}`, `${h1} ${unit}`, null, "?", `${w2} ${unit}`, null, null, null];
          askText = `STORY: A T-shaped ${item} has a total area of ${totalArea} ${unit}². The top rectangle is ${w1} ${unit} by ${h1} ${unit}. The bottom rectangle has a width of ${w2} ${unit}. Find the missing length indicated by "?".`;
          hintStr = "Find the top rectangle's area. Subtract to find the bottom rectangle's area, then deduce its height.";
          sysSolutionSteps = `"""1. Area of top rectangle = ${w1} x ${h1} = ${area1} ${unit}².\\n2. Area of bottom rectangle = ${totalArea} - ${area1} = ${area2} ${unit}².\\n3. Bottom vertical side = ${area2} ÷ ${w2} = ${h2} ${unit}."""`;

          expectedSteps.push({ label: `Write the working equation to find the area of the top rectangle:`, expectedAnswer: `${w1} x ${h1} = ${area1}`, acceptedAnswers: [`${h1} x ${w1} = ${area1}`] });
          expectedSteps.push({ label: `Write the working equation to find the area of the bottom rectangle:`, expectedAnswer: `${totalArea} - ${area1} = ${area2}`, acceptedAnswers: [] });
        }

        finalAnswer = `${h2} ${unit}`;
        finalAnswerVal = h2;

        expectedSteps.push({ label: `Write the working equation to find the bottom vertical side:`, expectedAnswer: `${area2} / ${w2} = ${h2}`, acceptedAnswers: [`${area2} \\div ${w2} = ${h2}`] });
        expectedSteps.push({ label: `Bottom vertical side:`, expectedAnswer: `${h2} ${unit}`, acceptedAnswers: [`${h2}${unit}`] });
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: vertices,
        edgeLabels: edgeLabels,
        fillColor: "#fcd34d",
        strokeColor: "#b45309"
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
- "${finalAnswerVal} ${unit}"
- "${finalAnswerVal + 4} ${unit}"
- "${finalAnswerVal * 2} ${unit}"
- "${finalAnswerVal > 2 ? finalAnswerVal - 2 : finalAnswerVal + 5} ${unit}"` : ''}
`;
  } else if (activeVariant === 'advanced_uniform_border') {
    const subtype = getRandomInt(0, 3);
    let askText = "";
    let finalAnswer = "";
    let finalAnswerVal = 0;
    let hintStr = "";
    let sysSolutionSteps = "";
    let expectedSteps = [];

    if (subtype === 0) {
      // Outer border (Uniform or Uneven)
      const isUniform = Math.random() > 0.5;
      const L = getRandomInt(8, 12);
      const W = getRandomInt(4, 7);
      const B_L = getRandomInt(2, 3); // Left/right thickness
      const B_W = isUniform ? B_L : getRandomInt(1, 2); // Top/bottom thickness
      const outerL = L + 2 * B_L;
      const outerW = W + 2 * B_W;
      
      const innerA = L * W;
      const outerA = outerL * outerW;
      const borderA = outerA - innerA;

      const target = getRandomInt(0, 1);
      
      if (target === 0) {
        // Find area of border
        if (isUniform) {
          askText = `STORY: A rectangular painting is ${L} ${unit} long and ${W} ${unit} wide. It is placed on a piece of cardboard, leaving a ${B_L} ${unit} wide border all the way around the painting. What is the area of the cardboard border?`;
        } else {
          askText = `STORY: A rectangular painting is ${L} ${unit} long and ${W} ${unit} wide. It is placed on a piece of cardboard, leaving a ${B_L} ${unit} wide border on the left and right sides, and a ${B_W} ${unit} wide border on the top and bottom. What is the area of the cardboard border?`;
        }
        
        finalAnswer = `${borderA} ${unit}²`;
        finalAnswerVal = borderA;
        hintStr = "Find the outer length and outer width by adding the border thicknesses. Then subtract the inner area from the outer area.";
        sysSolutionSteps = `"""1. Outer length = ${L} + ${B_L} + ${B_L} = ${outerL} ${unit}.\\n2. Outer width = ${W} + ${B_W} + ${B_W} = ${outerW} ${unit}.\\n3. Outer area = ${outerL} x ${outerW} = ${outerA} ${unit}².\\n4. Inner area = ${L} x ${W} = ${innerA} ${unit}².\\n5. Border Area = ${outerA} - ${innerA} = ${borderA} ${unit}²."""`;

        expectedSteps.push({ label: `Write the working equation to find the total outer length:`, expectedAnswer: `${L} + ${B_L} + ${B_L} = ${outerL}`, acceptedAnswers: [`${L} + ${B_L*2} = ${outerL}`] });
        expectedSteps.push({ label: `Write the working equation to find the total outer width:`, expectedAnswer: `${W} + ${B_W} + ${B_W} = ${outerW}`, acceptedAnswers: [`${W} + ${B_W*2} = ${outerW}`] });
        expectedSteps.push({ label: `Write the working equation to find the total area of the cardboard:`, expectedAnswer: `${outerL} x ${outerW} = ${outerA}`, acceptedAnswers: [`${outerW} x ${outerL} = ${outerA}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the painting:`, expectedAnswer: `${L} x ${W} = ${innerA}`, acceptedAnswers: [`${W} x ${L} = ${innerA}`] });
        expectedSteps.push({ label: `Write the working equation to subtract the painting to find the border's area:`, expectedAnswer: `${outerA} - ${innerA} = ${borderA}`, acceptedAnswers: [] });
        expectedSteps.push({ label: `Area of border:`, expectedAnswer: `${borderA} ${unit}²`, acceptedAnswers: [`${borderA}${unit}²`] });

        visualEngineStr = JSON.stringify({
          componentToRender: "GEOMETRY_POLYGON",
          componentData: {
            polygons: [
              { vertices: [{x: 0, y: 0}, {x: outerL*10, y: 0}, {x: outerL*10, y: outerW*10}, {x: 0, y: outerW*10}], edgeLabels: [null, null, null, null], fillColor: "#cbd5e1", strokeColor: "#0f172a" },
              { vertices: [{x: B_L*10, y: B_W*10}, {x: (outerL-B_L)*10, y: B_W*10}, {x: (outerL-B_L)*10, y: (outerW-B_W)*10}, {x: B_L*10, y: (outerW-B_W)*10}], edgeLabels: [`${L} ${unit}`, `${W} ${unit}`, null, null], fillColor: "#ffffff", strokeColor: "#0f172a" }
            ]
          }
        });
      } else {
        // Target 1: Find outer length
        askText = `STORY: A rectangular painting is ${L} ${unit} long and ${W} ${unit} wide. It is placed on a piece of cardboard, leaving a uniform border all the way around. The total area of the cardboard border is ${borderA} ${unit}². If the outer width of the cardboard is ${outerW} ${unit}, what is the outer length of the cardboard?`;
        
        finalAnswer = `${outerL} ${unit}`;
        finalAnswerVal = outerL;
        hintStr = "Find the inner area first. Add the border area to find the total outer area, then deduce the outer length.";
        sysSolutionSteps = `"""1. Inner area = ${L} x ${W} = ${innerA} ${unit}².\\n2. Outer area = ${innerA} + ${borderA} = ${outerA} ${unit}².\\n3. Outer length = ${outerA} ÷ ${outerW} = ${outerL} ${unit}."""`;

        expectedSteps.push({ label: `Write the working equation to find the area of the painting:`, expectedAnswer: `${L} x ${W} = ${innerA}`, acceptedAnswers: [`${W} x ${L} = ${innerA}`] });
        expectedSteps.push({ label: `Write the working equation to find the total outer area:`, expectedAnswer: `${innerA} + ${borderA} = ${outerA}`, acceptedAnswers: [`${borderA} + ${innerA} = ${outerA}`] });
        expectedSteps.push({ label: `Write the working equation to find the outer length:`, expectedAnswer: `${outerA} / ${outerW} = ${outerL}`, acceptedAnswers: [`${outerA} \\div ${outerW} = ${outerL}`] });
        expectedSteps.push({ label: `Outer length:`, expectedAnswer: `${outerL} ${unit}`, acceptedAnswers: [`${outerL}${unit}`] });

        visualEngineStr = JSON.stringify({
          componentToRender: "GEOMETRY_POLYGON",
          componentData: {
            polygons: [
              { vertices: [{x: 0, y: 0}, {x: outerL*10, y: 0}, {x: outerL*10, y: outerW*10}, {x: 0, y: outerW*10}], edgeLabels: ["?", `${outerW} ${unit}`, null, null], fillColor: "#cbd5e1", strokeColor: "#0f172a" },
              { vertices: [{x: B_L*10, y: B_W*10}, {x: (outerL-B_L)*10, y: B_W*10}, {x: (outerL-B_L)*10, y: (outerW-B_W)*10}, {x: B_L*10, y: (outerW-B_W)*10}], edgeLabels: [`${L} ${unit}`, `${W} ${unit}`, null, null], fillColor: "#ffffff", strokeColor: "#0f172a" }
            ]
          }
        });
      }

    } else if (subtype === 1) {
      // Inner cross path
      const L = getRandomInt(12, 16);
      const W = getRandomInt(8, 12);
      const P = getRandomInt(2, 3);
      
      const totalArea = L * W;
      const horizPathArea = L * P;
      const vertPathArea = W * P;
      const intersectionArea = P * P;
      const pathArea = horizPathArea + vertPathArea - intersectionArea;

      let fieldObj = unit === 'cm' ? "rectangular card" : "rectangular garden";
      let pathObj = unit === 'cm' ? "coloured stripes" : "paths";
      let verbObj = unit === 'cm' ? "are painted" : "cut";
      
      askText = `STORY: A ${fieldObj} is ${L} ${unit} long and ${W} ${unit} wide. Two intersecting ${pathObj}, each ${P} ${unit} wide, ${verbObj} through the center. Find the total area of the ${pathObj}.`;
      
      finalAnswer = `${pathArea} ${unit}²`;
      finalAnswerVal = pathArea;
      hintStr = `Find the area of the horizontal and vertical ${pathObj} separately. Subtract the overlapping square in the middle so you don't count it twice.`;
      sysSolutionSteps = `"""1. Area of horizontal ${unit === 'cm' ? 'stripe' : 'path'} = ${L} x ${P} = ${horizPathArea} ${unit}².\\n2. Area of vertical ${unit === 'cm' ? 'stripe' : 'path'} = ${W} x ${P} = ${vertPathArea} ${unit}².\\n3. Area of overlapping square = ${P} x ${P} = ${intersectionArea} ${unit}².\\n4. Total area of ${pathObj} = ${horizPathArea} + ${vertPathArea} - ${intersectionArea} = ${pathArea} ${unit}²."""`;

      expectedSteps.push({ label: `Write the working equation to find the area of the horizontal ${unit === 'cm' ? 'stripe' : 'path'}:`, expectedAnswer: `${L} x ${P} = ${horizPathArea}`, acceptedAnswers: [`${P} x ${L} = ${horizPathArea}`] });
      expectedSteps.push({ label: `Write the working equation to find the area of the vertical ${unit === 'cm' ? 'stripe' : 'path'}:`, expectedAnswer: `${W} x ${P} = ${vertPathArea}`, acceptedAnswers: [`${P} x ${W} = ${vertPathArea}`] });
      expectedSteps.push({ label: `Write the working equation to find the area of the overlapping square:`, expectedAnswer: `${P} x ${P} = ${intersectionArea}`, acceptedAnswers: [] });
      expectedSteps.push({ label: `Write the working equation to find the total area of the ${pathObj}:`, expectedAnswer: `${horizPathArea} + ${vertPathArea} - ${intersectionArea} = ${pathArea}`, acceptedAnswers: [] });
      expectedSteps.push({ label: `Total area of ${pathObj}:`, expectedAnswer: `${pathArea} ${unit}²`, acceptedAnswers: [`${pathArea}${unit}²`] });

      const cx = (L - P) / 2;
      const cy = (W - P) / 2;

      visualEngineStr = JSON.stringify({
        componentToRender: "GEOMETRY_POLYGON",
        componentData: {
          polygons: [
            { vertices: [{x:0, y:0}, {x:L*10, y:0}, {x:L*10, y:W*10}, {x:0, y:W*10}], edgeLabels: [`${L} ${unit}`, `${W} ${unit}`, null, null], fillColor: "#bbf7d0", strokeColor: "#0f172a" },
            { 
              vertices: [
                {x: cx*10, y: 0},
                {x: (cx+P)*10, y: 0},
                {x: (cx+P)*10, y: cy*10},
                {x: L*10, y: cy*10},
                {x: L*10, y: (cy+P)*10},
                {x: (cx+P)*10, y: (cy+P)*10},
                {x: (cx+P)*10, y: W*10},
                {x: cx*10, y: W*10},
                {x: cx*10, y: (cy+P)*10},
                {x: 0, y: (cy+P)*10},
                {x: 0, y: cy*10},
                {x: cx*10, y: cy*10}
              ], 
              edgeLabels: Array(12).fill(null), 
              fillColor: "#e2e8f0", 
              strokeColor: "#0f172a" 
            }
          ]
        }
      });

    } else if (subtype === 2) {
      // Inner single path
      const L = getRandomInt(10, 15);
      const W = getRandomInt(6, 10);
      const P = getRandomInt(2, 4);
      
      const totalArea = L * W;
      const isVertical = Math.random() > 0.5;
      const pathArea = isVertical ? P * W : L * P;
      const remainingArea = totalArea - pathArea;
      const target = getRandomInt(0, 1);

      const pathDir = isVertical ? "vertical" : "horizontal";

      let fieldObj = unit === 'cm' ? "rectangular card" : "rectangular field";
      let fieldNoun = unit === 'cm' ? "card" : "field";
      let pathObj = unit === 'cm' ? "coloured stripe" : "path";
      let verbObj = unit === 'cm' ? "is painted" : "cuts";
      let remainingObj = unit === 'cm' ? "card (not painted)" : "field (not covered by the path)";

      if (target === 0) {
        askText = `STORY: A ${fieldObj} is ${L} ${unit} long and ${W} ${unit} wide. A single ${pathDir} ${pathObj} of width ${P} ${unit} ${verbObj} across it. What is the area of the remaining ${remainingObj}?`;
        
        finalAnswer = `${remainingArea} ${unit}²`;
        finalAnswerVal = remainingArea;
        hintStr = `Find the total area of the ${fieldNoun} and subtract the area of the ${pathObj}.`;
        sysSolutionSteps = `"""1. Total area of ${fieldNoun} = ${L} x ${W} = ${totalArea} ${unit}².\\n2. Area of ${pathObj} = ${isVertical ? W : L} x ${P} = ${pathArea} ${unit}².\\n3. Remaining area = ${totalArea} - ${pathArea} = ${remainingArea} ${unit}²."""`;

        expectedSteps.push({ label: `Write the working equation to find the total area of the ${fieldNoun}:`, expectedAnswer: `${L} x ${W} = ${totalArea}`, acceptedAnswers: [`${W} x ${L} = ${totalArea}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the ${pathObj}:`, expectedAnswer: `${isVertical ? W : L} x ${P} = ${pathArea}`, acceptedAnswers: [`${P} x ${isVertical ? W : L} = ${pathArea}`] });
        expectedSteps.push({ label: `Write the working equation to find the remaining area:`, expectedAnswer: `${totalArea} - ${pathArea} = ${remainingArea}`, acceptedAnswers: [] });
        expectedSteps.push({ label: `Remaining area:`, expectedAnswer: `${remainingArea} ${unit}²`, acceptedAnswers: [`${remainingArea}${unit}²`] });

      } else {
        askText = `STORY: A ${fieldObj} is ${L} ${unit} long and ${W} ${unit} wide. A single ${pathDir} ${pathObj} ${verbObj} across it. The area of the remaining ${remainingObj} is ${remainingArea} ${unit}². What is the width of the ${pathObj}?`;
        
        finalAnswer = `${P} ${unit}`;
        finalAnswerVal = P;
        hintStr = `Find the total area of the ${fieldNoun}. Subtract the remaining area to find the ${pathObj}'s area, then deduce the ${pathObj}'s width.`;
        sysSolutionSteps = `"""1. Total area of ${fieldNoun} = ${L} x ${W} = ${totalArea} ${unit}².\\n2. Area of ${pathObj} = ${totalArea} - ${remainingArea} = ${pathArea} ${unit}².\\n3. Width of ${pathObj} = ${pathArea} ÷ ${isVertical ? W : L} = ${P} ${unit}."""`;

        expectedSteps.push({ label: `Write the working equation to find the total area of the ${fieldNoun}:`, expectedAnswer: `${L} x ${W} = ${totalArea}`, acceptedAnswers: [`${W} x ${L} = ${totalArea}`] });
        expectedSteps.push({ label: `Write the working equation to find the area of the ${pathObj}:`, expectedAnswer: `${totalArea} - ${remainingArea} = ${pathArea}`, acceptedAnswers: [] });
        expectedSteps.push({ label: `Write the working equation to find the width of the ${pathObj}:`, expectedAnswer: `${pathArea} / ${isVertical ? W : L} = ${P}`, acceptedAnswers: [`${pathArea} \\div ${isVertical ? W : L} = ${P}`] });
        expectedSteps.push({ label: `Width of ${pathObj}:`, expectedAnswer: `${P} ${unit}`, acceptedAnswers: [`${P}${unit}`] });
      }

      const cx = (L - P) / 2;
      const cy = (W - P) / 2;

      if (isVertical) {
        visualEngineStr = JSON.stringify({
          componentToRender: "GEOMETRY_POLYGON",
          componentData: {
            polygons: [
              { vertices: [{x:0, y:0}, {x:L*10, y:0}, {x:L*10, y:W*10}, {x:0, y:W*10}], edgeLabels: [`${L} ${unit}`, `${W} ${unit}`, null, null], fillColor: "#bbf7d0", strokeColor: "#0f172a" },
              { vertices: [{x:cx*10, y:0}, {x:(cx+P)*10, y:0}, {x:(cx+P)*10, y:W*10}, {x:cx*10, y:W*10}], edgeLabels: [null, null, null, null], fillColor: "#e2e8f0", strokeColor: "#0f172a" }
            ]
          }
        });
      } else {
        visualEngineStr = JSON.stringify({
          componentToRender: "GEOMETRY_POLYGON",
          componentData: {
            polygons: [
              { vertices: [{x:0, y:0}, {x:L*10, y:0}, {x:L*10, y:W*10}, {x:0, y:W*10}], edgeLabels: [`${L} ${unit}`, `${W} ${unit}`, null, null], fillColor: "#bbf7d0", strokeColor: "#0f172a" },
              { vertices: [{x:0, y:cy*10}, {x:L*10, y:cy*10}, {x:L*10, y:(cy+P)*10}, {x:0, y:(cy+P)*10}], edgeLabels: [null, null, null, null], fillColor: "#e2e8f0", strokeColor: "#0f172a" }
            ]
          }
        });
      }
    } else if (subtype === 3) {
      // Border around an L-shape
      const w1 = getRandomInt(4, 6);
      const w2 = getRandomInt(4, 6);
      const h1 = getRandomInt(4, 6);
      const h2 = getRandomInt(4, 6);
      const B = getRandomInt(1, 2);

      const totalW = w1 + w2;
      const totalH = h1 + h2;

      const innerAreaLeft = w1 * totalH;
      const innerAreaRight = w2 * h2;
      const innerArea = innerAreaLeft + innerAreaRight;
      
      const outer_w1 = w1 + 2*B;
      const outer_totalH = totalH + 2*B;
      const outer_w2 = w2;
      const outer_h2 = h2 + 2*B;

      const outerAreaLeft = outer_w1 * outer_totalH;
      const outerAreaRight = outer_w2 * outer_h2;
      const outerArea = outerAreaLeft + outerAreaRight;
      
      const borderArea = outerArea - innerArea;

      let fieldObj = unit === 'cm' ? "L-shaped card" : "L-shaped garden";
      let pathObj = unit === 'cm' ? "coloured border" : "path";
      
      askText = `STORY: An ${fieldObj} is formed by two rectangles. The longest vertical side is ${totalH} ${unit} and the longest horizontal side is ${totalW} ${unit}. The top horizontal edge is ${w1} ${unit} and the inner vertical cut is ${h1} ${unit}. A ${pathObj} of width ${B} ${unit} is placed all the way around the outer edge of the ${fieldObj}. What is the area of the ${pathObj}?`;
      
      finalAnswer = `${borderArea} ${unit}²`;
      finalAnswerVal = borderArea;
      hintStr = "Find the total outer area by splitting the outer shape into two rectangles, then subtract the inner area.";
      sysSolutionSteps = `"""1. Area of inner shape = (${w1} x ${totalH}) + (${w2} x ${h2}) = ${innerAreaLeft} + ${innerAreaRight} = ${innerArea} ${unit}².\\n2. Outer top width = ${w1} + ${B} + ${B} = ${outer_w1} ${unit}.\\n3. Outer longest height = ${totalH} + ${B} + ${B} = ${outer_totalH} ${unit}.\\n4. Outer inner right height = ${h2} + ${B} + ${B} = ${outer_h2} ${unit}.\\n5. Area of outer shape = (${outer_w1} x ${outer_totalH}) + (${outer_w2} x ${outer_h2}) = ${outerAreaLeft} + ${outerAreaRight} = ${outerArea} ${unit}².\\n6. Area of ${pathObj} = ${outerArea} - ${innerArea} = ${borderArea} ${unit}²."""`;

      expectedSteps.push({ label: `Area of inner shape:`, expectedAnswer: `${innerArea}`, acceptedAnswers: [`${innerArea} ${unit}²`] });
      expectedSteps.push({ label: `Area of outer shape:`, expectedAnswer: `${outerArea}`, acceptedAnswers: [`${outerArea} ${unit}²`] });
      expectedSteps.push({ label: `Write the working equation to find the area of the ${pathObj}:`, expectedAnswer: `${outerArea} - ${innerArea} = ${borderArea}`, acceptedAnswers: [] });
      expectedSteps.push({ label: `Area of ${pathObj}:`, expectedAnswer: `${borderArea} ${unit}²`, acceptedAnswers: [`${borderArea}${unit}²`] });

      visualEngineStr = JSON.stringify({
        componentToRender: "GEOMETRY_POLYGON",
        componentData: {
          polygons: [
            {
              vertices: [
                {x: 0, y: 0},
                {x: outer_w1*10, y: 0},
                {x: outer_w1*10, y: h1*10},
                {x: (totalW + 2*B)*10, y: h1*10},
                {x: (totalW + 2*B)*10, y: outer_totalH*10},
                {x: 0, y: outer_totalH*10}
              ],
              edgeLabels: Array(6).fill(null),
              fillColor: "#cbd5e1",
              strokeColor: "#0f172a"
            },
            {
              vertices: [
                {x: B*10, y: B*10},
                {x: (w1 + B)*10, y: B*10},
                {x: (w1 + B)*10, y: (h1 + B)*10},
                {x: (totalW + B)*10, y: (h1 + B)*10},
                {x: (totalW + B)*10, y: (totalH + B)*10},
                {x: B*10, y: (totalH + B)*10}
              ],
              edgeLabels: [`${w1} ${unit}`, `${h1} ${unit}`, `${w2} ${unit}`, `${h2} ${unit}`, `${totalW} ${unit}`, `${totalH} ${unit}`],
              fillColor: "#ffffff",
              strokeColor: "#0f172a"
            }
          ]
        }
      });
    }

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
- "${finalAnswerVal} ${unit}${askText.includes('What is the area') ? '²' : ''}"
- "${finalAnswerVal + 4} ${unit}${askText.includes('What is the area') ? '²' : ''}"
- "${finalAnswerVal * 2} ${unit}${askText.includes('What is the area') ? '²' : ''}"
- "${finalAnswerVal > 2 ? finalAnswerVal - 2 : finalAnswerVal + 5} ${unit}${askText.includes('What is the area') ? '²' : ''}"` : ''}
`;
  } else if (activeVariant === 'advanced_overlapping_rectangles') {
    const L1 = getRandomInt(6, 10);
    const W1 = getRandomInt(3, 5);
    const L2 = getRandomInt(5, 8);
    const W2 = getRandomInt(4, 6);
    const OL = getRandomInt(2, 3);
    const OW = getRandomInt(1, 2);
    
    const A1 = L1 * W1;
    const A2 = L2 * W2;
    const AO = OL * OW;
    const totalCovered = A1 + A2 - AO;

    const target = getRandomInt(0, 2);
    
    let askText = "";
    let finalAnswer = "";
    let finalAnswerVal = 0;
    let hintStr = "";
    let sysSolutionSteps = "";
    let expectedSteps = [];
    
    let edgeLabelsA = [`${L1} ${unit}`, null, null, `${W1} ${unit}`];
    let edgeLabelsB = [null, `${W2} ${unit}`, `${L2} ${unit}`, null];

    if (target === 0) {
      // Find Total Area
      askText = `STORY: Two rectangular rugs are placed on the floor. Rug A is ${L1} ${unit} by ${W1} ${unit}. Rug B is ${L2} ${unit} by ${W2} ${unit}. They overlap each other, and the overlapping section is a ${OL} ${unit} by ${OW} ${unit} rectangle. What is the total area of the floor covered by the rugs?`;
      finalAnswer = `${totalCovered} ${unit}²`;
      finalAnswerVal = totalCovered;
      hintStr = "When you add the areas of Rug A and Rug B, you count the overlapping area twice, so you must subtract it once.";
      sysSolutionSteps = `"""1. Area of Rug A = ${L1} x ${W1} = ${A1} ${unit}².\\n2. Area of Rug B = ${L2} x ${W2} = ${A2} ${unit}².\\n3. Overlapping Area = ${OL} x ${OW} = ${AO} ${unit}².\\n4. Total Covered = ${A1} + ${A2} - ${AO} = ${totalCovered} ${unit}²."""`;

      expectedSteps.push({ label: `Write the working equation to find the area of Rug A:`, expectedAnswer: `${L1} x ${W1} = ${A1}`, acceptedAnswers: [`${W1} x ${L1} = ${A1}`] });
      expectedSteps.push({ label: `Write the working equation to find the area of Rug B:`, expectedAnswer: `${L2} x ${W2} = ${A2}`, acceptedAnswers: [`${W2} x ${L2} = ${A2}`] });
      expectedSteps.push({ label: `Write the working equation to find the area of the overlapping section:`, expectedAnswer: `${OL} x ${OW} = ${AO}`, acceptedAnswers: [`${OW} x ${OL} = ${AO}`] });
      expectedSteps.push({ label: `Write the working equation to find the total area covered (Rug A + Rug B - Overlap):`, expectedAnswer: `${A1} + ${A2} - ${AO} = ${totalCovered}`, acceptedAnswers: [] });
      expectedSteps.push({ label: `Total area:`, expectedAnswer: `${totalCovered} ${unit}²`, acceptedAnswers: [`${totalCovered}${unit}²`] });

    } else if (target === 1) {
      // Find Overlap Area
      askText = `STORY: Two rectangular rugs are placed on the floor. Rug A is ${L1} ${unit} by ${W1} ${unit}. Rug B is ${L2} ${unit} by ${W2} ${unit}. They overlap each other. The total area of the floor covered by the rugs is ${totalCovered} ${unit}². What is the area of the overlapping section?`;
      finalAnswer = `${AO} ${unit}²`;
      finalAnswerVal = AO;
      hintStr = "Find the total area of the two rugs first. The difference between this and the floor covered is the overlap.";
      sysSolutionSteps = `"""1. Area of Rug A = ${L1} x ${W1} = ${A1} ${unit}².\\n2. Area of Rug B = ${L2} x ${W2} = ${A2} ${unit}².\\n3. Total area of both rugs = ${A1} + ${A2} = ${A1 + A2} ${unit}².\\n4. Overlapping Area = ${A1 + A2} - ${totalCovered} = ${AO} ${unit}²."""`;

      expectedSteps.push({ label: `Write the working equation to find the area of Rug A:`, expectedAnswer: `${L1} x ${W1} = ${A1}`, acceptedAnswers: [`${W1} x ${L1} = ${A1}`] });
      expectedSteps.push({ label: `Write the working equation to find the area of Rug B:`, expectedAnswer: `${L2} x ${W2} = ${A2}`, acceptedAnswers: [`${W2} x ${L2} = ${A2}`] });
      expectedSteps.push({ label: `Write the working equation to find the combined area of both rugs:`, expectedAnswer: `${A1} + ${A2} = ${A1 + A2}`, acceptedAnswers: [`${A2} + ${A1} = ${A1 + A2}`] });
      expectedSteps.push({ label: `Write the working equation to find the area of the overlapping section:`, expectedAnswer: `${A1 + A2} - ${totalCovered} = ${AO}`, acceptedAnswers: [] });
      expectedSteps.push({ label: `Area of overlap:`, expectedAnswer: `${AO} ${unit}²`, acceptedAnswers: [`${AO}${unit}²`] });

    } else {
      // Find Missing Side
      edgeLabelsA[0] = "?";
      askText = `STORY: Two rectangular rugs are placed on the floor and overlap by a ${OL} ${unit} by ${OW} ${unit} section. Rug A has a width of ${W1} ${unit}. Rug B is ${L2} ${unit} by ${W2} ${unit}. If the total area of the floor covered by the rugs is ${totalCovered} ${unit}², what is the length of Rug A?`;
      finalAnswer = `${L1} ${unit}`;
      finalAnswerVal = L1;
      hintStr = "Find the area of Rug B and the overlap first. Then work backwards to find the area of Rug A and deduce its length.";
      sysSolutionSteps = `"""1. Area of Rug B = ${L2} x ${W2} = ${A2} ${unit}².\\n2. Overlapping Area = ${OL} x ${OW} = ${AO} ${unit}².\\n3. Area of Rug A = ${totalCovered} - ${A2} + ${AO} = ${A1} ${unit}².\\n4. Length of Rug A = ${A1} ÷ ${W1} = ${L1} ${unit}."""`;

      expectedSteps.push({ label: `Write the working equation to find the area of Rug B:`, expectedAnswer: `${L2} x ${W2} = ${A2}`, acceptedAnswers: [`${W2} x ${L2} = ${A2}`] });
      expectedSteps.push({ label: `Write the working equation to find the overlapping area:`, expectedAnswer: `${OL} x ${OW} = ${AO}`, acceptedAnswers: [`${OW} x ${OL} = ${AO}`] });
      expectedSteps.push({ label: `Write the working equation to find the area of Rug A:`, expectedAnswer: `${totalCovered} - ${A2} + ${AO} = ${A1}`, acceptedAnswers: [] });
      expectedSteps.push({ label: `Write the working equation to find the length of Rug A:`, expectedAnswer: `${A1} / ${W1} = ${L1}`, acceptedAnswers: [`${A1} \\div ${W1} = ${L1}`] });
      expectedSteps.push({ label: `Length of Rug A:`, expectedAnswer: `${L1} ${unit}`, acceptedAnswers: [`${L1}${unit}`] });
    }

    // To visualize overlapping, we use a single GEOMETRY_POLYGON component containing an array of polygons, drawing them on the same canvas coordinate plane.
    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        polygons: [
          {
            vertices: [{x: 0, y: 0}, {x: L1*10, y: 0}, {x: L1*10, y: W1*10}, {x: 0, y: W1*10}],
            edgeLabels: edgeLabelsA,
            fillColor: "#bfdbfecc",
            strokeColor: "#0f172a"
          },
          {
            vertices: [
              {x: (L1-OL)*10, y: (W1-OW)*10}, 
              {x: (L1-OL+L2)*10, y: (W1-OW)*10}, 
              {x: (L1-OL+L2)*10, y: (W1-OW+W2)*10}, 
              {x: (L1-OL)*10, y: (W1-OW+W2)*10}
            ],
            edgeLabels: edgeLabelsB,
            fillColor: "#fbcfe8cc",
            strokeColor: "#0f172a"
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

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace("STORY: ", "")}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswerVal} ${unit}${target===0||target===1?'²':''}"
- "${finalAnswerVal + 4} ${unit}${target===0||target===1?'²':''}"
- "${finalAnswerVal * 2} ${unit}${target===0||target===1?'²':''}"
- "${finalAnswerVal > 2 ? finalAnswerVal - 2 : finalAnswerVal + 5} ${unit}${target===0||target===1?'²':''}"` : ''}
`;
  } else if (activeVariant === 'advanced_shared_side_deduction') {
    const W = getRandomInt(3, 7);
    const L1 = getRandomInt(4, 9);
    let L2 = getRandomInt(4, 9);
    while (L2 === L1) {
      L2 = getRandomInt(4, 9);
    }
    
    const A1 = L1 * W;
    const A2 = L2 * W;
    const totalLength = L1 + L2;
    const totalPerimeter = (totalLength * 2) + (W * 2);
    
    const target = getRandomInt(0, 3);
    
    let askText = "";
    let finalAnswerVal = 0;
    let finalAnswerUnit = unit;
    
    let expectedSteps = [];
    let hintStr = "";
    let sysSolutionSteps = "";
    
    let edgeLabelsA = [null, null, null, `${W} ${unit}`];
    let edgeLabelsB = [null, null, null, null];
    let centerLabelA = `Area: ${A1} ${unit}²`;
    let centerLabelB = `Area: ${A2} ${unit}²`;

    if (target === 0) {
      // Find Total Length
      askText = `STORY: Rectangle A (Area ${A1} ${unit}²) and Rectangle B (Area ${A2} ${unit}²) are joined side-by-side. They share a width of ${W} ${unit}. What is the total length of the combined shape?`;
      finalAnswerVal = totalLength;
      
      expectedSteps = [
        { label: `Write the working equation to find the length of Rectangle A:`, expectedAnswer: `${A1} / ${W} = ${L1}`, acceptedAnswers: [`${A1} \\div ${W} = ${L1}`] },
        { label: `Write the working equation to find the length of Rectangle B:`, expectedAnswer: `${A2} / ${W} = ${L2}`, acceptedAnswers: [`${A2} \\div ${W} = ${L2}`] },
        { label: `Write the working equation to find the total length of the combined shape:`, expectedAnswer: `${L1} + ${L2} = ${totalLength}`, acceptedAnswers: [`${L2} + ${L1} = ${totalLength}`] },
        { label: `Total length:`, expectedAnswer: `${totalLength} ${unit}`, acceptedAnswers: [`${totalLength}${unit}`] }
      ];
      
      hintStr = "Divide each area by the shared width to find the individual lengths, then add them together.";
      sysSolutionSteps = `"""1. Length of Rectangle A = ${A1} ÷ ${W} = ${L1} ${unit}.\\n2. Length of Rectangle B = ${A2} ÷ ${W} = ${L2} ${unit}.\\n3. Total length = ${L1} + ${L2} = ${totalLength} ${unit}."""`;
      
    } else if (target === 1) {
      // Find Total Perimeter
      askText = `STORY: Rectangle A (Area ${A1} ${unit}²) and Rectangle B (Area ${A2} ${unit}²) are joined side-by-side. They share a width of ${W} ${unit}. What is the total perimeter of the combined shape?`;
      finalAnswerVal = totalPerimeter;
      
      expectedSteps = [
        { label: `Write the working equation to find the length of Rectangle A:`, expectedAnswer: `${A1} / ${W} = ${L1}`, acceptedAnswers: [`${A1} \\div ${W} = ${L1}`] },
        { label: `Write the working equation to find the length of Rectangle B:`, expectedAnswer: `${A2} / ${W} = ${L2}`, acceptedAnswers: [`${A2} \\div ${W} = ${L2}`] },
        { label: `Write the working equation to find the total length of the combined shape:`, expectedAnswer: `${L1} + ${L2} = ${totalLength}`, acceptedAnswers: [`${L2} + ${L1} = ${totalLength}`] },
        { label: `Write the working equation to find the total perimeter:`, expectedAnswer: `${totalLength} + ${totalLength} + ${W} + ${W} = ${totalPerimeter}`, acceptedAnswers: [`(${totalLength} + ${W}) x 2 = ${totalPerimeter}`] },
        { label: `Total perimeter:`, expectedAnswer: `${totalPerimeter} ${unit}`, acceptedAnswers: [`${totalPerimeter}${unit}`] }
      ];
      
      hintStr = "Divide each area by the shared width to find the individual lengths. Add them to get the total length, then calculate the perimeter of the new large rectangle.";
      sysSolutionSteps = `"""1. Length of Rectangle A = ${A1} ÷ ${W} = ${L1} ${unit}.\\n2. Length of Rectangle B = ${A2} ÷ ${W} = ${L2} ${unit}.\\n3. Total length = ${L1} + ${L2} = ${totalLength} ${unit}.\\n4. Total Perimeter = ${totalLength} + ${totalLength} + ${W} + ${W} = ${totalPerimeter} ${unit}."""`;
      
    } else if (target === 2) {
      // Find Shared Width
      edgeLabelsA = [null, null, null, `?`];
      askText = `STORY: Rectangle A (Area ${A1} ${unit}²) and Rectangle B (Area ${A2} ${unit}²) are joined side-by-side to form a large rectangle. If the total length of the combined shape is ${totalLength} ${unit}, what is their shared width?`;
      finalAnswerVal = W;
      
      expectedSteps = [
        { label: `Write the working equation to find the total area of the combined shape:`, expectedAnswer: `${A1} + ${A2} = ${A1 + A2}`, acceptedAnswers: [`${A2} + ${A1} = ${A1 + A2}`] },
        { label: `Write the working equation to find the shared width:`, expectedAnswer: `${A1 + A2} / ${totalLength} = ${W}`, acceptedAnswers: [`${A1 + A2} \\div ${totalLength} = ${W}`] },
        { label: `Shared width:`, expectedAnswer: `${W} ${unit}`, acceptedAnswers: [`${W}${unit}`] }
      ];
      
      hintStr = "First add the two areas together to find the total area. Since you know the total length, use division to find the shared width.";
      sysSolutionSteps = `"""1. Total Area = ${A1} + ${A2} = ${A1 + A2} ${unit}².\\n2. Shared Width = Total Area ÷ Total Length = ${A1 + A2} ÷ ${totalLength} = ${W} ${unit}."""`;
      
    } else {
      // Find Length of Rectangle B
      centerLabelB = null;
      askText = `STORY: Rectangle A (Area ${A1} ${unit}²) and Rectangle B are joined side-by-side. They share a width of ${W} ${unit}. If the total length of the combined shape is ${totalLength} ${unit}, what is the length of Rectangle B?`;
      finalAnswerVal = L2;
      
      expectedSteps = [
        { label: `Write the working equation to find the length of Rectangle A:`, expectedAnswer: `${A1} / ${W} = ${L1}`, acceptedAnswers: [`${A1} \\div ${W} = ${L1}`] },
        { label: `Write the working equation to find the length of Rectangle B:`, expectedAnswer: `${totalLength} - ${L1} = ${L2}`, acceptedAnswers: [] },
        { label: `Length of Rectangle B:`, expectedAnswer: `${L2} ${unit}`, acceptedAnswers: [`${L2}${unit}`] }
      ];
      
      hintStr = "Find the length of Rectangle A first using its area and the shared width. Then subtract it from the total length to find the length of Rectangle B.";
      sysSolutionSteps = `"""1. Length of Rectangle A = ${A1} ÷ ${W} = ${L1} ${unit}.\\n2. Length of Rectangle B = Total Length - Length of Rectangle A = ${totalLength} - ${L1} = ${L2} ${unit}."""`;
    }
    
    const finalAnswer = `${finalAnswerVal} ${finalAnswerUnit}`;

    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        polygons: [
          {
            vertices: [{x: 0, y: 0}, {x: L1*10, y: 0}, {x: L1*10, y: W*10}, {x: 0, y: W*10}],
            edgeLabels: edgeLabelsA,
            centerLabel: centerLabelA,
            fillColor: "#bfdbfe",
            strokeColor: "#0f172a"
          },
          {
            vertices: [{x: L1*10, y: 0}, {x: (L1+L2)*10, y: 0}, {x: (L1+L2)*10, y: W*10}, {x: L1*10, y: W*10}],
            edgeLabels: edgeLabelsB,
            centerLabel: centerLabelB,
            fillColor: "#fbcfe8",
            strokeColor: "#0f172a"
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

    systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace("STORY: ", "")}"`}
- For content.finalAnswer, use: "${finalAnswer}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: ${sysSolutionSteps}
${isMCQ ? `Generate EXACTLY 4 options:
- "${finalAnswerVal} ${finalAnswerUnit}"
- "${finalAnswerVal + 4} ${finalAnswerUnit}"
- "${finalAnswerVal * 2} ${finalAnswerUnit}"
- "${finalAnswerVal > 2 ? finalAnswerVal - 2 : finalAnswerVal + 5} ${finalAnswerUnit}"` : ''}
`;
  }
  
  return { visualEngineStr, inputRequirementStr, systemPrompt };
}
