export function foundationLogic(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getRandomInt, { getRandomNames }) {
  let visualEngineStr = "";
  let inputRequirementStr = "";
  let systemPrompt = "";

  const polygonTypes = [
    { name: 'triangle', angles: 3, vertices: [{x:50, y:10}, {x:90, y:80}, {x:10, y:80}] },
    { name: 'square', angles: 4, vertices: [{x:20, y:20}, {x:80, y:20}, {x:80, y:80}, {x:20, y:80}] },
    { name: 'pentagon', angles: 5, vertices: [{x:50, y:10}, {x:90, y:40}, {x:75, y:90}, {x:25, y:90}, {x:10, y:40}] },
    { name: 'hexagon', angles: 6, vertices: [{x:30, y:10}, {x:70, y:10}, {x:90, y:50}, {x:70, y:90}, {x:30, y:90}, {x:10, y:50}] },
    { name: 'heptagon', angles: 7, vertices: [{x:50, y:10}, {x:80, y:25}, {x:90, y:60}, {x:70, y:90}, {x:30, y:90}, {x:10, y:60}, {x:20, y:25}] },
    { name: 'octagon', angles: 8, vertices: [{x:30, y:10}, {x:70, y:10}, {x:90, y:30}, {x:90, y:70}, {x:70, y:90}, {x:30, y:90}, {x:10, y:70}, {x:10, y:30}] }
  ];

  if (activeVariant === 'foundation_total_angles') {
    const isRealWorldRectangle = getRandomInt(0, 2) === 2; // 33% chance

    if (isRealWorldRectangle) {
      const items = ['windows', 'books', 'screens', 'tables', 'doors', 'picture frames'];
      const item = items[getRandomInt(0, items.length - 1)];
      const count = getRandomInt(3, 9);
      const rightAnglesPerItem = 4;
      const total = count * rightAnglesPerItem;
      const target = getRandomInt(0, 1);
      const name1 = getRandomNames()[0];
      
      let askText = "";
      let finalAns = "";
      let hintStr = "";
      let solutionStr = "";
      let stepsArr = [];
      let optionsArr = [];
      
      if (target === 0) { // Find total right angles
        askText = `STORY: [${name1}] sees ${count} rectangular ${item} in a room. How many right angles do they have altogether?`;
        finalAns = `${total}`;
        hintStr = `Every rectangle has 4 right angles. Multiply 4 by the number of ${item}.`;
        solutionStr = `1. Right angles in 1 rectangle = ${rightAnglesPerItem}.\\n2. Number of ${item} = ${count}.\\n3. Total right angles = ${count} x ${rightAnglesPerItem} = ${total}.`;
        stepsArr = [
          { label: `Number of right angles on exactly 1 rectangular ${item.endsWith('s') ? item.slice(0, -1) : item}:`, expectedAnswer: `${rightAnglesPerItem}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the total right angles:`, expectedAnswer: `${count} x ${rightAnglesPerItem} = ${total}`, acceptedAnswers: [`${rightAnglesPerItem} x ${count} = ${total}`] },
          { label: `Total right angles:`, expectedAnswer: `${total}`, acceptedAnswers: [] }
        ];
        optionsArr = [`"${total}"`, `"${total + 4}"`, `"${total - 4}"`, `"${total + 8}"`];
      } else { // Find count of objects
        askText = `STORY: [${name1}] counts the right angles on the ${item} in the room. Every one is a rectangle. They count a total of ${total} right angles. How many ${item} are there?`;
        finalAns = `${count}`;
        hintStr = `Divide the total number of right angles by the number of right angles in one rectangle (4).`;
        solutionStr = `1. Total right angles = ${total}.\\n2. Right angles in 1 rectangle = ${rightAnglesPerItem}.\\n3. Number of ${item} = ${total} ÷ ${rightAnglesPerItem} = ${count}.`;
        stepsArr = [
          { label: `Number of right angles on exactly 1 rectangular ${item.endsWith('s') ? item.slice(0, -1) : item}:`, expectedAnswer: `${rightAnglesPerItem}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the number of ${item}:`, expectedAnswer: `${total} ÷ ${rightAnglesPerItem} = ${count}`, acceptedAnswers: [`${total} / ${rightAnglesPerItem} = ${count}`] },
          { label: `Number of ${item}:`, expectedAnswer: `${count}`, acceptedAnswers: [] }
        ];
        optionsArr = [`"${count}"`, `"${count + 1}"`, `"${count - 1 > 0 ? count - 1 : count + 2}"`, `"${count + 2}"`];
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
    } else {
      const shape = polygonTypes[getRandomInt(0, 3)]; // limit up to hexagon
    const count = getRandomInt(3, 8);
    const total = shape.angles * count;
    const target = getRandomInt(0, 2);
    const name1 = getRandomNames()[0];
    
    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = [];

    if (target === 0) { // Find Total
      askText = `STORY: [${name1}] is cutting out paper shapes. They cut out exactly ${count} ${shape.name}s. Calculate the total number of angles in all ${count} ${shape.name}s.`;
      finalAns = `${total}`;
      hintStr = `Find the number of angles in one ${shape.name}, then multiply by ${count}.`;
      solutionStr = `1. Number of angles in 1 ${shape.name} = ${shape.angles}.\\n2. Total number of angles = ${shape.angles} x ${count} = ${total}.`;
      stepsArr = [
        { label: `Number of angles in 1 ${shape.name}:`, expectedAnswer: `${shape.angles}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the total number of angles:`, expectedAnswer: `${shape.angles} x ${count} = ${total}`, acceptedAnswers: [`${count} x ${shape.angles} = ${total}`] },
        { label: `Total number of angles:`, expectedAnswer: `${total}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${total}"`, `"${total + shape.angles}"`, `"${total - shape.angles}"`, `"${shape.angles * (count + 2)}"`];
    } else if (target === 1) { // Find Count
      askText = `STORY: [${name1}] is cutting out identical ${shape.name}s from paper. If the total number of angles for all the ${shape.name}s is ${total}, calculate how many ${shape.name}s were cut out.`;
      finalAns = `${count}`;
      hintStr = `Find the number of angles in one ${shape.name}, then divide the total angles by that number.`;
      solutionStr = `1. Number of angles in 1 ${shape.name} = ${shape.angles}.\\n2. Total shapes = ${total} ÷ ${shape.angles} = ${count}.`;
      stepsArr = [
        { label: `Number of angles in 1 ${shape.name}:`, expectedAnswer: `${shape.angles}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the number of shapes:`, expectedAnswer: `${total} ÷ ${shape.angles} = ${count}`, acceptedAnswers: [] },
        { label: `Total number of ${shape.name}s:`, expectedAnswer: `${count}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${count}"`, `"${count + 1}"`, `"${count - 1 > 0 ? count - 1 : 2}"`, `"${count + 2}"`];
    } else { // Find Shape Name
      askText = `STORY: [${name1}] cuts out ${count} identical shapes. The total number of angles for all ${count} shapes combined is ${total}. Calculate how many angles each shape has, and identify the shape.`;
      finalAns = `${shape.angles}`;
      hintStr = `Divide the total number of angles by the number of shapes to find the angles per shape.`;
      solutionStr = `1. Angles per shape = ${total} ÷ ${count} = ${shape.angles}.`;
      stepsArr = [
        { label: `Write the working equation to find the angles for 1 shape:`, expectedAnswer: `${total} ÷ ${count} = ${shape.angles}`, acceptedAnswers: [] },
        { label: `Number of angles in each shape:`, expectedAnswer: `${shape.angles}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${shape.angles}"`, `"${shape.angles + 1}"`, `"${shape.angles - 1 > 2 ? shape.angles - 1 : 7}"`, `"${shape.angles + 2}"`];
    }
    
    visualEngineStr = JSON.stringify({
      componentToRender: "GEOMETRY_POLYGON",
      componentData: {
        vertices: shape.vertices,
        rightAngles: [],
        acuteAngles: [],
        obtuseAngles: []
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
    }
  } else if (activeVariant === 'foundation_combining_angles') {
    let s1 = polygonTypes[getRandomInt(0, polygonTypes.length - 1)];
    let s2 = polygonTypes[getRandomInt(0, polygonTypes.length - 1)];
    while (s1.name === s2.name) s2 = polygonTypes[getRandomInt(0, polygonTypes.length - 1)];
    
    // Ensure s1 is the one with more angles so subtraction is always s1 - s2
    if (s1.angles < s2.angles) {
      let temp = s1;
      s1 = s2;
      s2 = temp;
    }

    const total = s1.angles + s2.angles;
    const diff = s1.angles - s2.angles;
    
    const target = getRandomInt(0, 2);
    const name1 = getRandomNames()[0];
    
    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = [];
    let visComps = [];

    if (target === 0) { // Find Total (Addition)
      askText = `STORY: [${name1}] draws a ${s1.name} and a ${s2.name}. Find the total number of angles they drew.`;
      finalAns = `${total}`;
      hintStr = `Count the number of angles for each shape and add them together.`;
      solutionStr = `1. Number of angles in a ${s1.name} = ${s1.angles}.\\n2. Number of angles in a ${s2.name} = ${s2.angles}.\\n3. Total number of angles = ${s1.angles} + ${s2.angles} = ${total}.`;
      stepsArr = [
        { label: `Number of angles in the ${s1.name}:`, expectedAnswer: `${s1.angles}`, acceptedAnswers: [] },
        { label: `Number of angles in the ${s2.name}:`, expectedAnswer: `${s2.angles}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the total:`, expectedAnswer: `${s1.angles} + ${s2.angles} = ${total}`, acceptedAnswers: [`${s2.angles} + ${s1.angles} = ${total}`] },
        { label: `Total number of angles:`, expectedAnswer: `${total}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${total}"`, `"${total + 2}"`, `"${total - 1}"`, `"${total + 1}"`];
      visComps = [
        { componentToRender: "GEOMETRY_POLYGON", componentData: { vertices: s1.vertices, rightAngles: [], acuteAngles: [], obtuseAngles: [] } },
        { componentToRender: "GEOMETRY_POLYGON", componentData: { vertices: s2.vertices, rightAngles: [], acuteAngles: [], obtuseAngles: [] } }
      ];
    } else if (target === 1) { // Find Difference (Subtraction)
      askText = `STORY: [${name1}] examines a ${s1.name} and a ${s2.name}. Calculate how many more angles the ${s1.name} has compared to the ${s2.name}.`;
      finalAns = `${diff}`;
      hintStr = `Count the angles on both shapes, then subtract the smaller number from the larger number.`;
      solutionStr = `1. Number of angles in a ${s1.name} = ${s1.angles}.\\n2. Number of angles in a ${s2.name} = ${s2.angles}.\\n3. Difference = ${s1.angles} - ${s2.angles} = ${diff}.`;
      stepsArr = [
        { label: `Number of angles in the ${s1.name}:`, expectedAnswer: `${s1.angles}`, acceptedAnswers: [] },
        { label: `Number of angles in the ${s2.name}:`, expectedAnswer: `${s2.angles}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the difference:`, expectedAnswer: `${s1.angles} - ${s2.angles} = ${diff}`, acceptedAnswers: [] },
        { label: `Difference in angles:`, expectedAnswer: `${diff}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${diff}"`, `"${diff + 1}"`, `"${diff > 1 ? diff - 1 : diff + 2}"`, `"${diff + 3}"`];
      visComps = [
        { componentToRender: "GEOMETRY_POLYGON", componentData: { vertices: s1.vertices, rightAngles: [], acuteAngles: [], obtuseAngles: [] } },
        { componentToRender: "GEOMETRY_POLYGON", componentData: { vertices: s2.vertices, rightAngles: [], acuteAngles: [], obtuseAngles: [] } }
      ];
    } else { // Working backwards (Find the missing shape)
      askText = `STORY: [${name1}] draws two shapes. One of them is a ${s1.name}. The total number of angles for both shapes combined is ${total}. Calculate how many angles the second unknown shape has, and identify it.`;
      finalAns = `${s2.angles}`;
      hintStr = `Subtract the number of angles in the ${s1.name} from the total angles to find the missing shape's angles.`;
      solutionStr = `1. Number of angles in a ${s1.name} = ${s1.angles}.\\n2. Angles in the second shape = ${total} - ${s1.angles} = ${s2.angles}.`;
      stepsArr = [
        { label: `Number of angles in the ${s1.name}:`, expectedAnswer: `${s1.angles}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the second shape's angles:`, expectedAnswer: `${total} - ${s1.angles} = ${s2.angles}`, acceptedAnswers: [] },
        { label: `Number of angles in the second shape:`, expectedAnswer: `${s2.angles}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${s2.angles}"`, `"${s2.angles + 1}"`, `"${s2.angles - 1 > 2 ? s2.angles - 1 : 8}"`, `"${s2.angles + 2}"`];
      visComps = [
        { componentToRender: "GEOMETRY_POLYGON", componentData: { vertices: s1.vertices, rightAngles: [], acuteAngles: [], obtuseAngles: [] } },
        { componentToRender: "HTML_CONTENT", componentData: { html: "<div style='display:flex;justify-content:center;align-items:center;width:100%;height:100%;font-size:80px;font-weight:bold;color:#666;'>?</div>" } }
      ];
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



  } else if (activeVariant === 'foundation_categorizing_inside') {
    const generateDynamicShape = () => {
      const type = getRandomInt(0, 6);
      switch(type) {
        case 0: { // Triangle 1R
          const x0 = getRandomInt(10, 40);
          const y1 = getRandomInt(60, 90);
          return {
            name: 'triangle', totalAngles: 3, rightAngles: [1],
            vertices: [
              {x: x0, y: getRandomInt(10, 40)},
              {x: x0, y: y1},
              {x: getRandomInt(60, 90), y: y1}
            ]
          };
        }
        case 1: { // Quad 1R
          const x0 = getRandomInt(10, 30);
          const y1 = getRandomInt(10, 30);
          return {
            name: 'quadrilateral', totalAngles: 4, rightAngles: [1],
            vertices: [
              {x: x0, y: getRandomInt(60, 90)},
              {x: x0, y: y1},
              {x: getRandomInt(60, 90), y: y1},
              {x: getRandomInt(50, 90), y: getRandomInt(50, 90)}
            ]
          };
        }
        case 2: { // Quad 2R (Trapezium)
          const x0 = getRandomInt(10, 30);
          const y0 = getRandomInt(10, 30);
          const y3 = getRandomInt(60, 90);
          return {
            name: 'quadrilateral', totalAngles: 4, rightAngles: [0, 3],
            vertices: [
              {x: x0, y: y0},
              {x: getRandomInt(50, 90), y: y0},
              {x: getRandomInt(50, 90), y: y3},
              {x: x0, y: y3}
            ]
          };
        }
        case 3: { // Pentagon 2R
          const x0 = getRandomInt(10, 30);
          const x1 = getRandomInt(70, 90);
          const y0 = getRandomInt(10, 30);
          return {
            name: 'pentagon', totalAngles: 5, rightAngles: [0, 1],
            vertices: [
              {x: x0, y: y0},
              {x: x1, y: y0},
              {x: x1, y: getRandomInt(50, 70)},
              {x: getRandomInt(30, 70), y: getRandomInt(70, 90)},
              {x: x0, y: getRandomInt(50, 70)}
            ]
          };
        }
        case 4: { // Pentagon 3R
          const x0 = getRandomInt(10, 30);
          const x2 = getRandomInt(70, 90);
          const y0 = getRandomInt(10, 30);
          const y1 = getRandomInt(70, 90);
          return {
            name: 'pentagon', totalAngles: 5, rightAngles: [0, 1, 2],
            vertices: [
              {x: x0, y: y0},
              {x: x0, y: y1},
              {x: x2, y: y1},
              {x: x2, y: getRandomInt(40, 60)},
              {x: getRandomInt(40, 60), y: y0}
            ]
          };
        }
        case 5: { // Hexagon 1R
          const x1 = getRandomInt(10, 30);
          const y2 = getRandomInt(70, 90);
          return {
            name: 'hexagon', totalAngles: 6, rightAngles: [2],
            vertices: [
              {x: getRandomInt(40, 60), y: getRandomInt(10, 30)},
              {x: x1, y: getRandomInt(40, 60)},
              {x: x1, y: y2},
              {x: getRandomInt(60, 90), y: y2},
              {x: getRandomInt(70, 90), y: getRandomInt(40, 60)},
              {x: getRandomInt(70, 90), y: getRandomInt(10, 30)}
            ]
          };
        }
        case 6: { // Hexagon 5R (L-Shape)
          const x1 = getRandomInt(10, 30);
          const x2 = getRandomInt(40, 60);
          const x3 = getRandomInt(70, 90);
          const y1 = getRandomInt(10, 30);
          const y2 = getRandomInt(40, 60);
          const y3 = getRandomInt(70, 90);
          return {
            name: 'hexagon', totalAngles: 6, rightAngles: [0, 1, 3, 4, 5],
            vertices: [
              {x: x1, y: y1}, {x: x2, y: y1}, {x: x2, y: y2},
              {x: x3, y: y2}, {x: x3, y: y3}, {x: x1, y: y3}
            ]
          };
        }
      }
    };
    
    const shape = generateDynamicShape();
    const totalAngles = shape.totalAngles;
    const rightAngleIndices = shape.rightAngles;
    const rightAnglesCount = rightAngleIndices.length;
    const nonRightAngles = totalAngles - rightAnglesCount;

    
    const target = getRandomInt(0, 1);
    const name1 = getRandomNames()[0];
    
    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = [];
    
    if (target === 0) { // Find non-right angles
      askText = `STORY: Look at the irregular ${shape.name} drawn by [${name1}]. It has ${totalAngles} angles in total. By identifying the right angles (marked with a square), calculate how many angles are NOT right angles.`;
      finalAns = `${nonRightAngles}`;
      hintStr = `Subtract the number of right angles from the total number of angles.`;
      solutionStr = `1. Total angles = ${totalAngles}.\\n2. Right angles = ${rightAnglesCount}.\\n3. Non-right angles = ${totalAngles} - ${rightAnglesCount} = ${nonRightAngles}.`;
      stepsArr = [
        { label: `Number of right angles shown in the shape:`, expectedAnswer: `${rightAnglesCount}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the remaining angles:`, expectedAnswer: `${totalAngles} - ${rightAnglesCount} = ${nonRightAngles}`, acceptedAnswers: [] },
        { label: `Number of angles that are not right angles:`, expectedAnswer: `${nonRightAngles}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${nonRightAngles}"`, `"${nonRightAngles + 1}"`, `"${nonRightAngles + 2}"`, `"${nonRightAngles - 1 > 0 ? nonRightAngles - 1 : nonRightAngles + 3}"`];
      
      visualEngineStr = JSON.stringify({
        componentToRender: "GEOMETRY_POLYGON",
        componentData: { vertices: shape.vertices, rightAngles: rightAngleIndices, acuteAngles: [], obtuseAngles: [] }
      });
    } else { // Find right angles
      askText = `STORY: [${name1}] draws an irregular ${shape.name} that has ${totalAngles} angles in total. If ${nonRightAngles} of its angles are NOT right angles, calculate how many right angles it has.`;
      finalAns = `${rightAnglesCount}`;
      hintStr = `Subtract the number of non-right angles from the total angles.`;
      solutionStr = `1. Total angles = ${totalAngles}.\\n2. Non-right angles = ${nonRightAngles}.\\n3. Right angles = ${totalAngles} - ${nonRightAngles} = ${rightAnglesCount}.`;
      stepsArr = [
        { label: `Total number of angles:`, expectedAnswer: `${totalAngles}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the right angles:`, expectedAnswer: `${totalAngles} - ${nonRightAngles} = ${rightAnglesCount}`, acceptedAnswers: [] },
        { label: `Number of right angles:`, expectedAnswer: `${rightAnglesCount}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${rightAnglesCount}"`, `"${rightAnglesCount + 1}"`, `"${rightAnglesCount + 2}"`, `"${rightAnglesCount - 1 > 0 ? rightAnglesCount - 1 : rightAnglesCount + 3}"`];
      
      visualEngineStr = JSON.stringify({
        componentToRender: "GEOMETRY_POLYGON",
        componentData: { vertices: shape.vertices, rightAngles: rightAngleIndices, acuteAngles: [], obtuseAngles: [] }
      });
    }

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

  } else if (activeVariant === 'foundation_grouped_angles') {
    const anglesPerShape = getRandomInt(3, 6);
    const count = getRandomInt(3, 10);
    const total = count * anglesPerShape;
    const target = getRandomInt(0, 1);
    const name1 = getRandomNames()[0];
    
    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = [];
    
    if (target === 0) { // Find angles per shape
      askText = `STORY: [${name1}] cuts out ${count} identical paper shapes. They count all the corners and find there are ${total} angles in total. Calculate how many angles exactly one of these shapes has.`;
      finalAns = `${anglesPerShape}`;
      hintStr = `Divide the total number of angles by the number of shapes.`;
      solutionStr = `1. Total angles = ${total}.\\n2. Number of shapes = ${count}.\\n3. Angles in 1 shape = ${total} ÷ ${count} = ${anglesPerShape}.`;
      stepsArr = [
        { label: `Write the working equation to find the number of angles in exactly 1 shape:`, expectedAnswer: `${total} ÷ ${count} = ${anglesPerShape}`, acceptedAnswers: [`${total} / ${count} = ${anglesPerShape}`] },
        { label: `Number of angles in 1 shape:`, expectedAnswer: `${anglesPerShape}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${anglesPerShape}"`, `"${anglesPerShape + 1}"`, `"${anglesPerShape - 1 > 0 ? anglesPerShape - 1 : anglesPerShape + 2}"`, `"${anglesPerShape + 2}"`];
    } else { // Find count of shapes
      const shapeName = anglesPerShape === 3 ? "triangles" : anglesPerShape === 4 ? "quadrilaterals" : anglesPerShape === 5 ? "pentagons" : "hexagons";
      askText = `STORY: [${name1}] has a group of identical ${shapeName}. If they count ${total} angles in total, how many ${shapeName} are there?`;
      finalAns = `${count}`;
      hintStr = `Divide the total number of angles by the number of angles in one shape.`;
      solutionStr = `1. Total angles = ${total}.\\n2. Angles in 1 shape (${shapeName}) = ${anglesPerShape}.\\n3. Number of shapes = ${total} ÷ ${anglesPerShape} = ${count}.`;
      stepsArr = [
        { label: `Number of angles in 1 shape:`, expectedAnswer: `${anglesPerShape}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the number of shapes:`, expectedAnswer: `${total} ÷ ${anglesPerShape} = ${count}`, acceptedAnswers: [`${total} / ${anglesPerShape} = ${count}`] },
        { label: `Number of shapes:`, expectedAnswer: `${count}`, acceptedAnswers: [] }
      ];
      optionsArr = [`"${count}"`, `"${count + 1}"`, `"${count - 1 > 0 ? count - 1 : count + 2}"`, `"${count + 2}"`];
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
  } else if (activeVariant === 'foundation_hidden_shape') {
    const shapes = [
      { name: "triangle", angles: 3 },
      { name: "4-sided shape", angles: 4 },
      { name: "5-sided shape", angles: 5 },
      { name: "6-sided shape", angles: 6 }
    ];
    
    const knownSame = getRandomInt(0, 1) === 0;
    let s1, s2;
    if (knownSame) {
      s1 = shapes[getRandomInt(0, shapes.length - 1)];
      s2 = s1;
    } else {
      s1 = shapes[getRandomInt(0, shapes.length - 1)];
      s2 = shapes[getRandomInt(0, shapes.length - 1)];
      while (s2.name === s1.name) {
        s2 = shapes[getRandomInt(0, shapes.length - 1)];
      }
    }
    
    const hiddenShape = shapes[getRandomInt(0, shapes.length - 1)];
    const totalAngles = s1.angles + s2.angles + hiddenShape.angles;
    const knownAnglesTotal = s1.angles + s2.angles;
    
    const name1 = getRandomNames()[0];
    
    let askText = "";
    let finalAns = `${hiddenShape.angles}`;
    let hintStr = `Add the angles of the known shapes first, then subtract from the total.`;
    let solutionStr = `1. Total angles of known shapes = ${s1.angles} + ${s2.angles} = ${knownAnglesTotal}.\\n2. Total angles of all 3 shapes = ${totalAngles}.\\n3. Angles of hidden shape = ${totalAngles} - ${knownAnglesTotal} = ${hiddenShape.angles}.`;
    let stepsArr = [];
    let optionsArr = [`"${hiddenShape.angles}"`, `"${hiddenShape.angles + 1}"`, `"${hiddenShape.angles - 1 > 2 ? hiddenShape.angles - 1 : hiddenShape.angles + 2}"`, `"${hiddenShape.angles + 3}"`];
    
    const target = getRandomInt(0, 2); 
    
    if (target === 0) {
      askText = `STORY: A group of 3 shapes has ${totalAngles} angles in total. ${knownSame ? `Two of the shapes are ${s1.name}s.` : `Shape 1 is a ${s1.name}. Shape 2 is a ${s2.name}.`} How many angles does the third shape have?`;
      stepsArr = [
        { label: `Write the working equation to find the total angles of the two known shapes:`, expectedAnswer: `${s1.angles} + ${s2.angles} = ${knownAnglesTotal}`, acceptedAnswers: (knownSame ? [`${s1.angles} x 2 = ${knownAnglesTotal}`, `2 x ${s1.angles} = ${knownAnglesTotal}`] : []) },
        { label: `Write the working equation to subtract the known angles from the total angles:`, expectedAnswer: `${totalAngles} - ${knownAnglesTotal} = ${hiddenShape.angles}`, acceptedAnswers: [] },
        { label: `Number of angles the hidden shape has:`, expectedAnswer: `${hiddenShape.angles}`, acceptedAnswers: [] }
      ];
    } else if (target === 1) {
      askText = `STORY: 3 shapes have ${totalAngles} angles altogether. Shape 1 is a ${s1.name}. Shape 2 is a ${s2.name}. How many angles does Shape 3 have?`;
      stepsArr = [
        { label: `Write the working equation to find the total angles of the two known shapes:`, expectedAnswer: `${s1.angles} + ${s2.angles} = ${knownAnglesTotal}`, acceptedAnswers: (knownSame ? [`${s1.angles} x 2 = ${knownAnglesTotal}`, `2 x ${s1.angles} = ${knownAnglesTotal}`] : []) },
        { label: `Write the working equation to subtract the known angles from the total angles:`, expectedAnswer: `${totalAngles} - ${knownAnglesTotal} = ${hiddenShape.angles}`, acceptedAnswers: [] },
        { label: `Number of angles the hidden shape has:`, expectedAnswer: `${hiddenShape.angles}`, acceptedAnswers: [] }
      ];
    } else {
      askText = `STORY: [${name1}] has 3 paper shapes in a bag. Together, all the shapes have exactly ${totalAngles} angles. They pull out two of the shapes, and they are ${knownSame ? `both ${s1.name}s` : `a ${s1.name} and a ${s2.name}`}. Calculate how many angles the third hidden shape has inside the bag.`;
      stepsArr = [
        { label: `Write the working equation to find the total angles of the two known ${knownSame ? `${s1.name}s` : 'shapes'}:`, expectedAnswer: `${s1.angles} + ${s2.angles} = ${knownAnglesTotal}`, acceptedAnswers: (knownSame ? [`${s1.angles} x 2 = ${knownAnglesTotal}`, `2 x ${s1.angles} = ${knownAnglesTotal}`] : []) },
        { label: `Write the working equation to subtract the known angles from the total angles:`, expectedAnswer: `${totalAngles} - ${knownAnglesTotal} = ${hiddenShape.angles}`, acceptedAnswers: [] },
        { label: `Number of angles the hidden shape has:`, expectedAnswer: `${hiddenShape.angles}`, acceptedAnswers: [] }
      ];
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
  }

  return { visualEngineStr, inputRequirementStr, systemPrompt };
}
