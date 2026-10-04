export function advancedLogic(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getRandomInt, { getRandomNames }) {
  let visualEngineStr = "";
  let inputRequirementStr = "";
  let systemPrompt = "";

  if (activeVariant === 'advanced_polygon_sequence') {
    const sequenceLength = getRandomInt(3, 4);
    const shapeNames = {3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon', 7: 'Heptagon', 8: 'Octagon'};
    
    let sequence = [];
    let totalAngles = 0;
    
    for (let i = 0; i < sequenceLength; i++) {
      const n = getRandomInt(3, 8);
      sequence.push({
        n: n,
        name: shapeNames[n]
      });
      totalAngles += n;
    }

    const generateIrregularPolygon = (n) => {
      let vertices = [];
      const cx = 50, cy = 50;
      const baseAngle = (2 * Math.PI) / n;
      for (let i = 0; i < n; i++) {
        const angle = baseAngle * i + (Math.random() * baseAngle * 0.5 - baseAngle * 0.25);
        const radius = getRandomInt(30, 45);
        vertices.push({
          x: Math.round(cx + radius * Math.cos(angle)),
          y: Math.round(cy + radius * Math.sin(angle))
        });
      }
      return vertices;
    };

    const target = getRandomInt(0, 1); // 0 = Find total, 1 = Find missing
    
    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = [];
    let visComps = [];
    const name1 = getRandomNames()[0];
    
    const seqString = sequence.map(s => `a ${s.name}`).join(", ").replace(/,([^,]*)$/, ', and$1');
    
    if (target === 0) { // Find total
      askText = `STORY: Teacher [${name1}] draws a sequence of shapes on the board: ${seqString}. Calculate the total number of angles for all ${sequenceLength} shapes combined.`;
      finalAns = `${totalAngles}`;
      hintStr = `Add the number of angles for each shape one by one.`;
      
      let sol = "";
      let currentTotal = sequence[0].n + sequence[1].n;
      sol += `1. ${sequence[0].name} + ${sequence[1].name} = ${sequence[0].n} + ${sequence[1].n} = ${currentTotal}.\\n`;
      stepsArr.push({
        label: `Write the working equation to add the angles of the first two shapes (${sequence[0].name} + ${sequence[1].name}):`,
        expectedAnswer: `${sequence[0].n} + ${sequence[1].n} = ${currentTotal}`,
        acceptedAnswers: [`${sequence[1].n} + ${sequence[0].n} = ${currentTotal}`]
      });
      
      for(let i=2; i<sequence.length; i++) {
         let newTotal = currentTotal + sequence[i].n;
         sol += `${i}. Total + ${sequence[i].name} = ${currentTotal} + ${sequence[i].n} = ${newTotal}.\\n`;
         stepsArr.push({
           label: `Write the working equation to add the ${sequence[i].name}'s angles to that total:`,
           expectedAnswer: `${currentTotal} + ${sequence[i].n} = ${newTotal}`,
           acceptedAnswers: [`${sequence[i].n} + ${currentTotal} = ${newTotal}`]
         });
         currentTotal = newTotal;
      }
      stepsArr.push({ label: `Total angles in the sequence:`, expectedAnswer: `${totalAngles}`, acceptedAnswers: [] });
      
      solutionStr = sol.trim();
      optionsArr = [`"${totalAngles}"`, `"${totalAngles + 2}"`, `"${totalAngles - 1}"`, `"${totalAngles + 1}"`];
      
      for(let i=0; i<sequence.length; i++) {
        visComps.push({ componentToRender: "GEOMETRY_POLYGON", componentData: { vertices: generateIrregularPolygon(sequence[i].n), rightAngles: [], acuteAngles: [], obtuseAngles: [] } });
      }
      
    } else { // Find missing
      const missingIndex = sequence.length - 1; // Always make the last one missing
      const missingShape = sequence[missingIndex];
      const givenShapes = sequence.slice(0, missingIndex);
      const givenSeqString = givenShapes.map(s => `a ${s.name}`).join(", ").replace(/,([^,]*)$/, ', and$1');
      const givenTotal = totalAngles - missingShape.n;

      askText = `STORY: Teacher [${name1}] draws a sequence of ${sequenceLength} shapes on the board. The total number of angles for all ${sequenceLength} shapes combined is ${totalAngles}. If the first ${givenShapes.length} shapes are ${givenSeqString}, calculate how many angles the last hidden shape has.`;
      finalAns = `${missingShape.n}`;
      hintStr = `Find the total angles of the known shapes first, then subtract that from the grand total to find the missing shape.`;
      
      let sol = "";
      let currentTotal = givenShapes[0].n + givenShapes[1].n;
      sol += `1. ${givenShapes[0].name} + ${givenShapes[1].name} = ${givenShapes[0].n} + ${givenShapes[1].n} = ${currentTotal}.\\n`;
      stepsArr.push({
        label: `Write the working equation to add the angles of the first two shapes (${givenShapes[0].name} + ${givenShapes[1].name}):`,
        expectedAnswer: `${givenShapes[0].n} + ${givenShapes[1].n} = ${currentTotal}`,
        acceptedAnswers: [`${givenShapes[1].n} + ${givenShapes[0].n} = ${currentTotal}`]
      });
      
      for(let i=2; i<givenShapes.length; i++) {
         let newTotal = currentTotal + givenShapes[i].n;
         sol += `${i}. Total + ${givenShapes[i].name} = ${currentTotal} + ${givenShapes[i].n} = ${newTotal}.\\n`;
         stepsArr.push({
           label: `Write the working equation to add the ${givenShapes[i].name}'s angles to that total:`,
           expectedAnswer: `${currentTotal} + ${givenShapes[i].n} = ${newTotal}`,
           acceptedAnswers: [`${givenShapes[i].n} + ${currentTotal} = ${newTotal}`]
         });
         currentTotal = newTotal;
      }
      
      sol += `${givenShapes.length}. Missing shape = ${totalAngles} - ${currentTotal} = ${missingShape.n}.`;
      stepsArr.push({
        label: `Write the working equation to subtract the known shapes' total from the grand total:`,
        expectedAnswer: `${totalAngles} - ${currentTotal} = ${missingShape.n}`,
        acceptedAnswers: []
      });
      stepsArr.push({ label: `Number of angles in the last shape:`, expectedAnswer: `${missingShape.n}`, acceptedAnswers: [] });
      
      solutionStr = sol;
      optionsArr = [`"${missingShape.n}"`, `"${missingShape.n + 1}"`, `"${missingShape.n - 1 > 2 ? missingShape.n - 1 : missingShape.n + 2}"`, `"${missingShape.n + 3}"`];
      
      for(let i=0; i<givenShapes.length; i++) {
        visComps.push({ componentToRender: "GEOMETRY_POLYGON", componentData: { vertices: generateIrregularPolygon(givenShapes[i].n), rightAngles: [], acuteAngles: [], obtuseAngles: [] } });
      }
      visComps.push({ componentToRender: "HTML_CONTENT", componentData: { html: "<div style='display:flex;justify-content:center;align-items:center;width:100%;height:100%;font-size:80px;font-weight:bold;color:#666;'>?</div>" } });
    }
    
    visualEngineStr = JSON.stringify({
      componentToRender: "MULTI_COMPONENT",
      componentData: {
        components: visComps
      }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: stepsArr
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
- For content.finalAnswer, use: "${finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
${isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : ''}`;

  } else if (activeVariant === 'advanced_joining_shapes') {
    const squaresCount = getRandomInt(3, 5);
    const startAngles = squaresCount * 4;
    const finalAngles = 4;
    const difference = startAngles - finalAngles;
    
    const target = getRandomInt(0, 1); // 0 = find disappeared, 1 = find squaresCount
    const name1 = getRandomNames()[0];
    
    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = [];

    if (target === 0) { // Find disappeared
      askText = `STORY: [${name1}] has ${squaresCount} square tiles. Before joining, the ${squaresCount} tiles have a total of ${startAngles} right angles. He joins them edge-to-edge to make a single rectangular strip. Calculate how many right angles disappeared into the middle join.`;
      finalAns = `${difference}`;
      hintStr = `A single rectangle has 4 right angles. Subtract this from the original total right angles.`;
      solutionStr = `1. Outer edge right angles = 4.\\n2. Angles disappeared = ${startAngles} - 4 = ${difference}.`;
      stepsArr = [
          { label: `Number of right angles on the outer edge of the new rectangular strip:`, expectedAnswer: `${finalAngles}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the difference between the starting angles and the new angles:`, expectedAnswer: `${startAngles} - ${finalAngles} = ${difference}`, acceptedAnswers: [] },
          { label: `Number of right angles that disappeared:`, expectedAnswer: `${difference}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${difference}"`, `"${difference + 2}"`, `"${difference - 2}"`, `"${startAngles}"`];
    } else { // Find number of tiles
      askText = `STORY: [${name1}] joins some identical square tiles edge-to-edge to make a single rectangular strip. In the process, ${difference} right angles disappeared into the middle joins. Calculate how many square tiles were joined together.`;
      finalAns = `${squaresCount}`;
      hintStr = `Find the total number of right angles before joining by adding the disappeared angles to the 4 angles of the final rectangle. Then divide by 4.`;
      solutionStr = `1. Original total right angles = ${difference} (disappeared) + 4 (outer edge) = ${startAngles}.\\n2. Number of square tiles = ${startAngles} ÷ 4 = ${squaresCount}.`;
      stepsArr = [
          { label: `Write the working equation to find the original total right angles before joining:`, expectedAnswer: `${difference} + 4 = ${startAngles}`, acceptedAnswers: [`4 + ${difference} = ${startAngles}`] },
          { label: `Write the working equation to find the number of square tiles:`, expectedAnswer: `${startAngles} ÷ 4 = ${squaresCount}`, acceptedAnswers: [`${startAngles} / 4 = ${squaresCount}`] },
          { label: `Number of square tiles:`, expectedAnswer: `${squaresCount}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${squaresCount}"`, `"${squaresCount + 1}"`, `"${squaresCount - 1}"`, `"${squaresCount + 2}"`];
    }
    
    visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: stepsArr
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
- For content.finalAnswer, use: "${finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
${isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : ''}`;

  } else if (activeVariant === 'advanced_clock_deduction') {
    const target = getRandomInt(0, 2); // 0 = right angle turns, 1 = acute range, 2 = obtuse range
    
    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = [];
    
    if (target === 0) { // Right angle turns
      const turns = getRandomInt(3, 8);
      const minutes = turns * 15;
      askText = `STORY: A bakery puts a cake in the oven at exactly 12:00. The cake needs to bake for exactly ${turns} right-angle turns of the minute hand. Calculate the total baking time in minutes.`;
      finalAns = `${minutes}`;
      hintStr = `One right-angle turn of the minute hand is 15 minutes. Multiply 15 by the number of turns.`;
      solutionStr = `1. 1 right-angle turn = 15 minutes.\\n2. Total minutes = 15 x ${turns} = ${minutes}.`;
      stepsArr = [
          { label: `Number of minutes in 1 right-angle turn:`, expectedAnswer: `15`, acceptedAnswers: [] },
          { label: `Write the working equation to find the total minutes for ${turns} turns:`, expectedAnswer: `15 x ${turns} = ${minutes}`, acceptedAnswers: [`${turns} x 15 = ${minutes}`] },
          { label: `Total baking time in minutes:`, expectedAnswer: `${minutes}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${minutes}"`, `"${minutes + 15}"`, `"${minutes - 15}"`, `"${minutes + 30}"`];
    } else if (target === 1) { // Acute range
      askText = `STORY: A clock's minute hand moves from 12:00 and turns through an acute angle. What is the range of possible time passed in minutes? (Write your answer in the format "X to Y minutes")`;
      finalAns = `1 to 14 minutes`;
      hintStr = `An acute angle is strictly less than a right angle. A right angle on a clock is 15 minutes.`;
      solutionStr = `1. A right angle turn is exactly 15 minutes.\\n2. An acute angle is more than 0 but less than a right angle.\\n3. Therefore, the time passed must be from 1 to 14 minutes.`;
      stepsArr = [
          { label: `Number of minutes for exactly 1 right-angle turn:`, expectedAnswer: `15`, acceptedAnswers: [] },
          { label: `Maximum whole minutes for an acute angle (less than a right angle):`, expectedAnswer: `14`, acceptedAnswers: [] },
          { label: `Range of possible time passed:`, expectedAnswer: `1 to 14 minutes`, acceptedAnswers: [] }
      ];
      optionsArr = [`"1 to 14 minutes"`, `"1 to 15 minutes"`, `"15 to 30 minutes"`, `"16 to 29 minutes"`];
    } else { // Obtuse range
      askText = `STORY: A clock's minute hand moves from 12:00 and turns through an obtuse angle. What is the range of possible time passed in minutes? (Write your answer in the format "X to Y minutes")`;
      finalAns = `16 to 29 minutes`;
      hintStr = `An obtuse angle is strictly greater than a right angle (15 minutes) but less than a half turn (30 minutes).`;
      solutionStr = `1. A right angle turn is exactly 15 minutes, and a half turn is exactly 30 minutes.\\n2. An obtuse angle is greater than a right angle but less than a half turn.\\n3. Therefore, the time passed must be from 16 to 29 minutes.`;
      stepsArr = [
          { label: `Number of minutes for exactly 1 right-angle turn:`, expectedAnswer: `15`, acceptedAnswers: [] },
          { label: `Number of minutes for exactly 1 half-turn:`, expectedAnswer: `30`, acceptedAnswers: [] },
          { label: `Range of possible time passed for an obtuse angle:`, expectedAnswer: `16 to 29 minutes`, acceptedAnswers: [] }
      ];
      optionsArr = [`"16 to 29 minutes"`, `"15 to 30 minutes"`, `"1 to 14 minutes"`, `"16 to 30 minutes"`];
    }
    
    visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: stepsArr
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
- For content.finalAnswer, use: "${finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
${isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : ''}`;

  } else if (activeVariant === 'advanced_deducing_shapes') {
    const shapeTypes = { 3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon' };
    const n1 = getRandomInt(3, 5);
    const n2 = n1 + 1;
    const name1Shape = shapeTypes[n1];
    const name2Shape = shapeTypes[n2];
    
    const q1 = getRandomInt(2, 6);
    const q2 = getRandomInt(2, 6);
    const totalShapes = q1 + q2;
    const totalAngles = (q1 * n1) + (q2 * n2);
    
    const assumedTotal = totalShapes * n1;
    const difference = totalAngles - assumedTotal;
    
    // In Assumption method, assuming all are shape 1, difference directly equals number of shape 2 (since n2 - n1 = 1)
    const targetIsShape2 = getRandomInt(0, 1) === 0; // if true, answer is q2. if false, answer is q1.
    
    const name1 = getRandomNames()[0];
    const askText = `STORY: [${name1}] cuts out exactly ${totalShapes} shapes. They are a mix of ${name1Shape}s (${n1} angles) and ${name2Shape}s (${n2} angles). The shapes have a total of ${totalAngles} angles. Calculate how many ${targetIsShape2 ? name2Shape : name1Shape}s there are.`;
    
    const finalAns = targetIsShape2 ? `${q2}` : `${q1}`;
    const hintStr = `Assume all shapes are ${name1Shape}s. Calculate the total angles, find the difference from the actual total, and deduce the number of each shape.`;
    
    const solutionStr = `1. Assume all ${totalShapes} are ${name1Shape}s: ${totalShapes} x ${n1} = ${assumedTotal} angles.\\n2. Difference: ${totalAngles} - ${assumedTotal} = ${difference} (This is the number of ${name2Shape}s).\\n3. Number of ${name1Shape}s = ${totalShapes} - ${difference} = ${q1}.`;
    
    visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Assume all ${totalShapes} shapes are ${name1Shape}s. Write the working equation for the total angles:`, expectedAnswer: `${totalShapes} x ${n1} = ${assumedTotal}`, acceptedAnswers: [`${n1} x ${totalShapes} = ${assumedTotal}`] },
          { label: `Write the working equation to find the difference between the actual angles (${totalAngles}) and this assumed total:`, expectedAnswer: `${totalAngles} - ${assumedTotal} = ${difference}`, acceptedAnswers: [] },
          { label: `Because a ${name2Shape} has 1 more angle than a ${name1Shape}, the difference tells us the number of ${name2Shape}s. Number of ${name2Shape}s:`, expectedAnswer: `${q2}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the number of ${name1Shape}s (Total shapes - ${name2Shape}s):`, expectedAnswer: `${totalShapes} - ${q2} = ${q1}`, acceptedAnswers: [] },
          { label: `Final answer for the number of ${targetIsShape2 ? name2Shape : name1Shape}s:`, expectedAnswer: `${targetIsShape2 ? q2 : q1}`, acceptedAnswers: [] }
        ]
      });
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    let optionsArr = [];
    const targetQ = targetIsShape2 ? q2 : q1;
    optionsArr = [`"${targetQ}"`, `"${targetQ + 1}"`, `"${targetQ - 1}"`, `"${totalShapes - targetQ}"`];
    // Ensure all options are distinct
    if (totalShapes - targetQ === targetQ || totalShapes - targetQ === targetQ + 1 || totalShapes - targetQ === targetQ - 1) {
      optionsArr[3] = `"${targetQ + 2}"`;
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

  } else if (activeVariant === 'advanced_shapes_within_shapes') {
    const innerShapesList = [
      { name: 'square', angles: 4, right: 4 },
      { name: 'rectangle', angles: 4, right: 4 },
      { name: 'triangle', angles: 3, right: 0 }
    ];
    const outerShapesList = [
      { name: 'pentagon', angles: 5 },
      { name: 'hexagon', angles: 6 },
      { name: 'octagon', angles: 8 },
      { name: 'nonagon', angles: 9 },
      { name: 'decagon', angles: 10 }
    ];
    
    const innerShape = innerShapesList[getRandomInt(0, innerShapesList.length - 1)];
    const outerShape = outerShapesList[getRandomInt(0, outerShapesList.length - 1)];
    const innerQuantity = getRandomInt(3, 7);
    
    const innerTotal = innerQuantity * innerShape.angles;
    const innerTotalRight = innerQuantity * innerShape.right;
    const grandTotal = innerTotal + outerShape.angles;
    
    const name1 = getRandomNames()[0];
    const articleOuter = ['octagon', 'ellipse'].includes(outerShape.name) ? 'an' : 'a';
    
    let askText = `STORY: [${name1}] draws a large ${outerShape.name} on a piece of paper. Inside the ${outerShape.name}, she draws exactly ${innerQuantity} separate ${innerShape.name}s. By recalling the properties of these shapes, calculate the total number of angles altogether in the drawing.`;
    
    if (isStructure && innerShape.right > 0) {
       askText = `STORY: [${name1}] draws a large ${outerShape.name} on a piece of paper. Inside the ${outerShape.name}, she draws exactly ${innerQuantity} separate ${innerShape.name}s. By recalling the properties of these shapes, calculate the total number of right angles she drew, and the total number of angles altogether in the drawing.`;
    }

    const finalAns = `${grandTotal}`;
    const hintStr = `Recall the number of angles in a ${innerShape.name} and a ${outerShape.name}. Multiply the inner shape's angles by ${innerQuantity}, then add the outer shape's angles.`;
    
    const solutionStr = `1. Angles in 1 ${innerShape.name} = ${innerShape.angles}. Total inner angles = ${innerShape.angles} x ${innerQuantity} = ${innerTotal}.\\n2. Angles in 1 ${outerShape.name} = ${outerShape.angles}.\\n3. Total angles altogether = ${innerTotal} + ${outerShape.angles} = ${grandTotal}.`;
    
    // Generate SVG for the visual
    let svg = `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">`;
    const outerPoints = [];
    for (let i = 0; i < outerShape.angles; i++) {
      const angle = (i * 2 * Math.PI) / outerShape.angles - Math.PI / 2;
      outerPoints.push(`${50 + 45 * Math.cos(angle)},${50 + 45 * Math.sin(angle)}`);
    }
    svg += `<polygon points="${outerPoints.join(' ')}" fill="rgba(200,200,200,0.1)" stroke="#333" stroke-width="2" />`;
    
    for (let i = 0; i < innerQuantity; i++) {
      const angle = (i * 2 * Math.PI) / innerQuantity;
      const r = 18 + (i % 2 === 0 ? 0 : 5); 
      const cx = 50 + r * Math.cos(angle);
      const cy = 50 + r * Math.sin(angle);
      
      if (innerShape.name === 'square' || innerShape.name === 'rectangle') {
         const w = innerShape.name === 'square' ? 10 : 14;
         const h = innerShape.name === 'square' ? 10 : 7;
         svg += `<rect x="${cx - w/2}" y="${cy - h/2}" width="${w}" height="${h}" fill="rgba(100,150,250,0.3)" stroke="#333" stroke-width="1.5" />`;
      } else if (innerShape.name === 'triangle') {
         const triPoints = [];
         for (let j = 0; j < 3; j++) {
           const tAngle = (j * 2 * Math.PI) / 3 - Math.PI / 2;
           triPoints.push(`${cx + 7 * Math.cos(tAngle)},${cy + 7 * Math.sin(tAngle)}`);
         }
         svg += `<polygon points="${triPoints.join(' ')}" fill="rgba(250,150,100,0.3)" stroke="#333" stroke-width="1.5" />`;
      }
    }
    svg += `</svg>`;

    visualEngineStr = JSON.stringify({ componentToRender: "HTML_CONTENT", componentData: { html: svg } });

    if (isStructure) {
      if (innerShape.right > 0) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `From memory, how many right angles does a single ${innerShape.name} have?`, expectedAnswer: `${innerShape.right}`, acceptedAnswers: [] },
            { label: `Write the working equation to find the total right angles for the ${innerQuantity} inner ${innerShape.name}s:`, expectedAnswer: `${innerShape.right} x ${innerQuantity} = ${innerTotalRight}`, acceptedAnswers: [`${innerQuantity} x ${innerShape.right} = ${innerTotalRight}`] },
            { label: `From memory, how many angles does ${articleOuter} ${outerShape.name} have?`, expectedAnswer: `${outerShape.angles}`, acceptedAnswers: [] },
            { label: `Write the working equation to find the total number of angles for all shapes combined:`, expectedAnswer: `${innerTotal} + ${outerShape.angles} = ${grandTotal}`, acceptedAnswers: [`${outerShape.angles} + ${innerTotal} = ${grandTotal}`] },
            { label: `Total angles altogether:`, expectedAnswer: `${grandTotal}`, acceptedAnswers: [] }
          ]
        });
      } else {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `From memory, how many angles does a single ${innerShape.name} have?`, expectedAnswer: `${innerShape.angles}`, acceptedAnswers: [] },
            { label: `Write the working equation to find the total angles for the ${innerQuantity} inner ${innerShape.name}s:`, expectedAnswer: `${innerShape.angles} x ${innerQuantity} = ${innerTotal}`, acceptedAnswers: [`${innerQuantity} x ${innerShape.angles} = ${innerTotal}`] },
            { label: `From memory, how many angles does ${articleOuter} ${outerShape.name} have?`, expectedAnswer: `${outerShape.angles}`, acceptedAnswers: [] },
            { label: `Write the working equation to find the total number of angles for all shapes combined:`, expectedAnswer: `${innerTotal} + ${outerShape.angles} = ${grandTotal}`, acceptedAnswers: [`${outerShape.angles} + ${innerTotal} = ${grandTotal}`] },
            { label: `Total angles altogether:`, expectedAnswer: `${grandTotal}`, acceptedAnswers: [] }
          ]
        });
      }
    } else if (!isMCQ) {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    const optionsArr = [`"${grandTotal}"`, `"${grandTotal - outerShape.angles}"`, `"${grandTotal + 2}"`, `"${grandTotal - 2}"`];

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST construct the "content" object using the EXACT strings provided below:
- For content.questionText, ${(isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "A large ${outerShape.name} has ${innerQuantity} separate ${innerShape.name}s inside it. How many angles are there in total across all the shapes?"`}
- For content.finalAnswer, use: "${finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
${isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : ''}`;
  }

  return { visualEngineStr, inputRequirementStr, systemPrompt };
}
