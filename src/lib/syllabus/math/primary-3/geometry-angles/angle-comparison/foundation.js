import { getRandomNames } from '../../../../../utils/variable-bank.js';
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomArrayElement = (arr) => arr[getRandomInt(0, arr.length - 1)];

export function foundationLogic(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic) {
  let visualEngineStr = "";
  let inputRequirementStr = "";
  let systemPrompt = "";

        if (activeVariant === 'foundation_classifying_polygon') {
const generateTotallyRandomPolygon = () => {
      let pts = [
        {x: 20, y: 20}, {x: 80, y: 20}, {x: 80, y: 80}, {x: 20, y: 80}
      ];
      const numTransforms = getRandomInt(3, 7);
      for (let i = 0; i < numTransforms; i++) {
        const tType = getRandomInt(0, 2);
        const edgeIdx = getRandomInt(0, pts.length - 1);
        const p1 = pts[edgeIdx];
        const p2 = pts[(edgeIdx + 1) % pts.length];
        
        if (tType === 0) {
          const p3 = pts[(edgeIdx + 2) % pts.length];
          if ((p1.x === p2.x && p2.y === p3.y) || (p1.y === p2.y && p2.x === p3.x)) {
            const mid1 = { x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2 };
            const mid2 = { x: (p2.x + p3.x)/2, y: (p2.y + p3.y)/2 };
            if (edgeIdx + 1 === pts.length) {
                pts.splice(0, 1, mid1, mid2);
            } else {
                pts.splice(edgeIdx + 1, 1, mid1, mid2);
            }
          }
        } else if (tType === 1) {
          if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 40) {
            const dir = p1.x > 50 ? 15 : -15;
            const yDir = Math.sign(p2.y - p1.y);
            const y1 = p1.y + yDir * 15;
            const y2 = p2.y - yDir * 15;
            pts.splice(edgeIdx + 1, 0, {x: p1.x, y: y1}, {x: p1.x + dir, y: y1}, {x: p1.x + dir, y: y2}, {x: p1.x, y: y2});
          } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 40) {
            const dir = p1.y > 50 ? 15 : -15;
            const xDir = Math.sign(p2.x - p1.x);
            const x1 = p1.x + xDir * 15;
            const x2 = p2.x - xDir * 15;
            pts.splice(edgeIdx + 1, 0, {x: x1, y: p1.y}, {x: x1, y: p1.y + dir}, {x: x2, y: p1.y + dir}, {x: x2, y: p1.y});
          }
        } else if (tType === 2) {
          if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 40) {
            const midY = (p1.y + p2.y) / 2;
            const dir = p1.x > 50 ? 15 : -15; 
            pts.splice(edgeIdx + 1, 0, {x: p1.x + dir, y: midY});
          } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 40) {
            const midX = (p1.x + p2.x) / 2;
            const dir = p1.y > 50 ? 15 : -15;
            pts.splice(edgeIdx + 1, 0, {x: midX, y: p1.y + dir});
          }
        }
      }
      
      let filtered = [];
      for (let p of pts) {
        if (filtered.length === 0) filtered.push(p);
        else {
          let last = filtered[filtered.length - 1];
          if (last.x !== p.x || last.y !== p.y) filtered.push(p);
        }
      }
      if (filtered.length > 1) {
        let last = filtered[filtered.length - 1];
        let first = filtered[0];
        if (last.x === first.x && last.y === first.y) filtered.pop();
      }
      return filtered;
    };
    
    let shapeVertices = generateTotallyRandomPolygon();
    let shapeName = "irregular shape";

    let rightAngles = [];
    let acuteAngles = [];
    let obtuseAngles = [];
    
    let area = 0;
    for (let i = 0; i < shapeVertices.length; i++) {
      let j = (i + 1) % shapeVertices.length;
      area += shapeVertices[i].x * shapeVertices[j].y - shapeVertices[j].x * shapeVertices[i].y;
    }
    let isClockwise = area >= 0;
    
    for (let i = 0; i < shapeVertices.length; i++) {
      let prev = shapeVertices[(i - 1 + shapeVertices.length) % shapeVertices.length];
      let curr = shapeVertices[i];
      let next = shapeVertices[(i + 1) % shapeVertices.length];
      
      let v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
      let v2 = { x: next.x - curr.x, y: next.y - curr.y };
      
      let cross = v1.x * v2.y - v1.y * v2.x;
      let dot = v1.x * v2.x + v1.y * v2.y;
      
      let isReflex = isClockwise ? (cross > 0) : (cross < 0);
      
      if (isReflex) {
        obtuseAngles.push(i);
      } else {
        let mag1 = Math.hypot(v1.x, v1.y);
        let mag2 = Math.hypot(v2.x, v2.y);
        let cosTheta = dot / (mag1 * mag2);
        
        if (Math.abs(cosTheta) < 0.05) {
          rightAngles.push(i);
        } else if (cosTheta > 0) {
          acuteAngles.push(i);
        } else {
          obtuseAngles.push(i);
        }
      }
    }
    
    let counts = { right: rightAngles.length, acute: acuteAngles.length, greater: obtuseAngles.length };
    
    const askMost = getRandomInt(0, 1) === 0;
    let targetKey = "";
    if (askMost) {
      if (counts.right >= counts.acute && counts.right >= counts.greater) targetKey = "right angles";
      if (counts.acute > counts.right && counts.acute >= counts.greater) targetKey = "angles smaller than a right angle";
      if (counts.greater > counts.right && counts.greater > counts.acute) targetKey = "angles greater than a right angle";
    } else {
      if (counts.right <= counts.acute && counts.right <= counts.greater) targetKey = "right angles";
      if (counts.acute < counts.right && counts.acute <= counts.greater) targetKey = "angles smaller than a right angle";
      if (counts.greater < counts.right && counts.greater < counts.acute) targetKey = "angles greater than a right angle";
    }
    
    let askText = "";
    let finalAns = targetKey;
    let hintStr = `Count all the right angles, smaller angles, and greater angles first. Then see which one has the ${askMost ? 'most' : 'least'}.`;
    let solutionStr = `1. Right angles = ${counts.right}.\\n2. Smaller angles = ${counts.acute}.\\n3. Greater angles = ${counts.greater}.\\n4. The ${askMost ? 'most' : 'least'} is ${targetKey}.`;
    
    let optionsArr = ["\"right angles\"", "\"angles smaller than a right angle\"", "\"angles greater than a right angle\""];
    let stepsArr = [];

    const name1 = getRandomNames()[0];

    if (isStructure) {
      askText = `STORY: [${name1}] drew a complex ${shapeName}. Count the different types of angles inside the polygon and determine which angle type there is the ${askMost ? 'most' : 'least'} of.`;
      stepsArr = [
        { label: `Number of right angles:`, expectedAnswer: `${counts.right}`, acceptedAnswers: [] },
        { label: `Number of angles smaller than a right angle:`, expectedAnswer: `${counts.acute}`, acceptedAnswers: [] },
        { label: `Number of angles greater than a right angle:`, expectedAnswer: `${counts.greater}`, acceptedAnswers: [] },
        { label: `Which type of angle is there the ${askMost ? 'most' : 'least'} of?`, expectedAnswer: targetKey, acceptedAnswers: [] }
      ];
    } else {
      askText = `STORY: Look at the ${shapeName}. Which type of angle is there the ${askMost ? 'most' : 'least'} of? (right angles, angles smaller than a right angle, or angles greater than a right angle)`;
    }

    visualEngineStr = JSON.stringify({ 
      componentToRender: "GEOMETRY_POLYGON", 
      componentData: { vertices: shapeVertices, rightAngles: rightAngles, acuteAngles: acuteAngles, obtuseAngles: obtuseAngles } 
    });

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
- For content.questionText, ` + ((isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \\[[^\\]]+\\] /, 'Someone ').replace('STORY: ', '')}"`) + `
- For content.finalAnswer, use: "${isStructure && activeVariant === 'standard_deducing_quantities' ? triangles : finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');

  } else if (activeVariant === 'foundation_clock_hands') {
    let type, angle, mAngle, hAngle;
    
    const targetType = getRandomArrayElement(["smaller than a right angle", "greater than a right angle", "a right angle"]);
    
    if (targetType === "a right angle") {
      mAngle = getRandomInt(0, 359);
      hAngle = mAngle + (Math.random() > 0.5 ? 90 : -90);
      type = targetType;
      angle = 90;
    } else {
      let attempts = 0;
      while (attempts < 100) {
        attempts++;
        mAngle = getRandomInt(0, 359);
        hAngle = getRandomInt(0, 359);
        
        let diff = Math.abs(hAngle - mAngle);
        angle = Math.min(diff, 360 - diff);
        
        if (targetType === "smaller than a right angle" && angle <= 75 && angle >= 15) {
          type = targetType;
          break;
        } else if (targetType === "greater than a right angle" && angle >= 105 && angle <= 170) {
          type = targetType;
          break;
        }
      }
    }
    
    // Reverse engineer props for ClockDisplay to draw these exact angles
    // ClockDisplay uses: minuteAngle = minute * 6, hourAngle = (hour % 12) * 30 + hourHandMinute * 0.5
    // By setting hourHandMinute to 0, hourAngle = (hour % 12) * 30
    let renderMinute = mAngle / 6;
    let renderHour = hAngle / 30;
    
    let askText = "";
    let finalAns = type;
    let hintStr = `Visually compare the distance between the hands to a corner of a square (which forms a right angle).`;
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = ["\"smaller than a right angle\"", "\"a right angle\"", "\"greater than a right angle\""];

    if (isStructure) {
      askText = `STORY: Look at the clock. Is the angle formed between the hands smaller than a right angle, exactly a right angle, or greater than a right angle?`;
      
      let ansDist = type === "a right angle" ? "exactly a right angle" : type;

      solutionStr = `1. Look at the space between the minute hand and the hour hand.\\n2. The opening is ${ansDist}.\\n3. Therefore, the angle is ${ansDist}.`;
      stepsArr = [
        { label: `Imagine a square corner (a right angle) placed between the hands. Is the opening between the hands smaller, larger, or exactly the same as the square corner?`, expectedAnswer: type === "a right angle" ? "exactly the same" : (type === "smaller than a right angle" ? "smaller" : "larger"), acceptedAnswers: ["smaller", "larger", "exactly the same"] },
        { label: `Therefore, is the angle smaller than a right angle, a right angle, or greater than a right angle?`, expectedAnswer: type, acceptedAnswers: [] }
      ];
    } else if (isMCQ) {
      askText = `STORY: Look at the clock. Is the angle formed between the hands smaller than a right angle, exactly a right angle, or greater than a right angle?`;
      solutionStr = `The hands form ${type}.`;
    } else {
      askText = `STORY: Look at the clock. Is the angle formed between the hands smaller than a right angle, exactly a right angle, or greater than a right angle?`;
      solutionStr = `The angle is ${finalAns}.`;
    }

    visualEngineStr = JSON.stringify({ componentToRender: "CLOCK_DISPLAY", componentData: { hour: renderHour, minute: renderMinute, hourHandMinute: 0 } });

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
- For content.questionText, ` + ((isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \\[[^\\]]+\\] /, 'Someone ').replace('STORY: ', '')}"`) + `
- For content.finalAnswer, use: "${isStructure && activeVariant === 'standard_deducing_quantities' ? triangles : finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');

  } else if (activeVariant === 'foundation_capital_letters') {
    const letters = [
      { l: "E", right: 4, smaller: 0, greater: 0 },
      { l: "H", right: 4, smaller: 0, greater: 0 },
      { l: "T", right: 2, smaller: 0, greater: 0 },
      { l: "L", right: 1, smaller: 0, greater: 0 },
      { l: "F", right: 3, smaller: 0, greater: 0 },
      { l: "X", right: 0, smaller: 2, greater: 2 },
      { l: "Y", right: 0, smaller: 1, greater: 2 },
      { l: "A", right: 0, smaller: 3, greater: 2 } 
    ];
    
    const wordList = [
      "EAT", "HAT", "FAT", "FLY", "LET", "LAY", "TAX", "HAY", "TEE", "LEE", "FEE", "ALL",
      "TALL", "FALL", "HALF", "HALL", "HEAL", "LEAF", "TALE", "LATE", "FEEL", "HEEL", "FLEA", "FLAY", "FLAT", "LATH", "HATE", "FATE", "THEY", "TEAL", "HEFT", "YELL", "FELL",
      "FATAL", "ALLEY", "TEETH", "THEFT", "LATHE", "FLEET"
    ];
    
    let wordStr = getRandomArrayElement(wordList);
    let wordChars = wordStr.split('');
    
    let totalRight = 0, totalSmaller = 0, totalGreater = 0;
    wordChars.forEach(ch => {
      let lData = letters.find(x => x.l === ch);
      if (lData) {
        totalRight += lData.right;
        totalSmaller += lData.smaller;
        totalGreater += lData.greater;
      }
    });
    
    const types = [
      { key: 'right', label: 'right angles', count: totalRight },
      { key: 'smaller', label: 'angles smaller than a right angle', count: totalSmaller },
      { key: 'greater', label: 'angles greater than a right angle', count: totalGreater }
    ];
    
    const qType = getRandomInt(0, 1); // 0: total of one type, 1: difference between two types
    
    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = [];
    const name1 = getRandomNames()[0];

    if (qType === 0) {
      let target = getRandomArrayElement(types);
      finalAns = `${target.count}`;
      optionsArr = [`"${target.count}"`, `"${target.count + 2}"`, `"${target.count - 1 < 0 ? 0 : target.count - 1}"`, `"${target.count + 1}"`];
      
      askText = `STORY: [name1] is looking at the word "${wordStr}" written in capital letters. Look at the marked angles. Calculate the total number of ${target.label} in the entire word.`;
      hintStr = `Count the ${target.label} across all the letters and add them up.`;
      solutionStr = `The total number of ${target.label} is ${target.count}.`;
      
      if (isStructure) {
        stepsArr = [
          { label: `Total ${target.label}:`, expectedAnswer: `${target.count}`, acceptedAnswers: [] }
        ];
      }
    } else {
      let shuffledTypes = types.sort(() => 0.5 - Math.random());
      let t1 = shuffledTypes[0];
      let t2 = shuffledTypes[1];
      let diff = Math.abs(t1.count - t2.count);
      
      finalAns = `${diff}`;
      optionsArr = [`"${diff}"`, `"${diff + 2}"`, `"${diff - 1 < 0 ? diff + 3 : diff - 1}"`, `"${diff + 1}"`];
      
      askText = `STORY: [name1] is looking at the word "${wordStr}" written in capital letters. Look at the marked angles. What is the difference between the number of ${t1.label} and ${t2.label} in the entire word?`;
      hintStr = `First count the ${t1.label}. Then count the ${t2.label}. Subtract the smaller number from the larger number.`;
      solutionStr = `1. ${t1.label.charAt(0).toUpperCase() + t1.label.slice(1)} = ${t1.count}.\n2. ${t2.label.charAt(0).toUpperCase() + t2.label.slice(1)} = ${t2.count}.\n3. Difference = ${Math.max(t1.count, t2.count)} - ${Math.min(t1.count, t2.count)} = ${diff}.`;
      
      if (isStructure) {
        stepsArr = [
          { label: `Total ${t1.label}:`, expectedAnswer: `${t1.count}`, acceptedAnswers: [] },
          { label: `Total ${t2.label}:`, expectedAnswer: `${t2.count}`, acceptedAnswers: [] },
          { label: `Difference:`, expectedAnswer: `${diff}`, acceptedAnswers: [] }
        ];
      }
    }
    
    askText = askText.replace('[name1]', name1);

    visualEngineStr = JSON.stringify({ componentToRender: "ANGLE_VISUALIZER", componentData: { word: wordStr } });

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
- For content.questionText, ` + ((isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \\[[^\\]]+\\] /, 'Someone ').replace('STORY: ', '')}"`) + `
- For content.finalAnswer, use: "${isStructure && activeVariant === 'standard_deducing_quantities' ? triangles : finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');

  } else if (activeVariant === 'foundation_comparing_categories') {
const generateTotallyRandomPolygon = () => {
      let pts = [
        {x: 20, y: 20}, {x: 80, y: 20}, {x: 80, y: 80}, {x: 20, y: 80}
      ];
      const numTransforms = getRandomInt(3, 7);
      for (let i = 0; i < numTransforms; i++) {
        const tType = getRandomInt(0, 2);
        const edgeIdx = getRandomInt(0, pts.length - 1);
        const p1 = pts[edgeIdx];
        const p2 = pts[(edgeIdx + 1) % pts.length];
        
        if (tType === 0) {
          const p3 = pts[(edgeIdx + 2) % pts.length];
          if ((p1.x === p2.x && p2.y === p3.y) || (p1.y === p2.y && p2.x === p3.x)) {
            const mid1 = { x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2 };
            const mid2 = { x: (p2.x + p3.x)/2, y: (p2.y + p3.y)/2 };
            if (edgeIdx + 1 === pts.length) {
                pts.splice(0, 1, mid1, mid2);
            } else {
                pts.splice(edgeIdx + 1, 1, mid1, mid2);
            }
          }
        } else if (tType === 1) {
          if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 40) {
            const dir = p1.x > 50 ? 15 : -15;
            const yDir = Math.sign(p2.y - p1.y);
            const y1 = p1.y + yDir * 15;
            const y2 = p2.y - yDir * 15;
            pts.splice(edgeIdx + 1, 0, {x: p1.x, y: y1}, {x: p1.x + dir, y: y1}, {x: p1.x + dir, y: y2}, {x: p1.x, y: y2});
          } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 40) {
            const dir = p1.y > 50 ? 15 : -15;
            const xDir = Math.sign(p2.x - p1.x);
            const x1 = p1.x + xDir * 15;
            const x2 = p2.x - xDir * 15;
            pts.splice(edgeIdx + 1, 0, {x: x1, y: p1.y}, {x: x1, y: p1.y + dir}, {x: x2, y: p1.y + dir}, {x: x2, y: p1.y});
          }
        } else if (tType === 2) {
          if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 40) {
            const midY = (p1.y + p2.y) / 2;
            const dir = p1.x > 50 ? 15 : -15; 
            pts.splice(edgeIdx + 1, 0, {x: p1.x + dir, y: midY});
          } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 40) {
            const midX = (p1.x + p2.x) / 2;
            const dir = p1.y > 50 ? 15 : -15;
            pts.splice(edgeIdx + 1, 0, {x: midX, y: p1.y + dir});
          }
        }
      }
      
      let filtered = [];
      for (let p of pts) {
        if (filtered.length === 0) filtered.push(p);
        else {
          let last = filtered[filtered.length - 1];
          if (last.x !== p.x || last.y !== p.y) filtered.push(p);
        }
      }
      if (filtered.length > 1) {
        let last = filtered[filtered.length - 1];
        let first = filtered[0];
        if (last.x === first.x && last.y === first.y) filtered.pop();
      }
      return filtered;
    };
    
    let shapeVertices = generateTotallyRandomPolygon();

    let rightAngles = [];
    let acuteAngles = [];
    let obtuseAngles = [];
    
    let area = 0;
    for (let i = 0; i < shapeVertices.length; i++) {
      let j = (i + 1) % shapeVertices.length;
      area += shapeVertices[i].x * shapeVertices[j].y - shapeVertices[j].x * shapeVertices[i].y;
    }
    let isClockwise = area >= 0;
    
    for (let i = 0; i < shapeVertices.length; i++) {
      let prev = shapeVertices[(i - 1 + shapeVertices.length) % shapeVertices.length];
      let curr = shapeVertices[i];
      let next = shapeVertices[(i + 1) % shapeVertices.length];
      
      let v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
      let v2 = { x: next.x - curr.x, y: next.y - curr.y };
      
      let cross = v1.x * v2.y - v1.y * v2.x;
      let dot = v1.x * v2.x + v1.y * v2.y;
      
      let isReflex = isClockwise ? (cross > 0) : (cross < 0);
      
      if (isReflex) {
        obtuseAngles.push(i);
      } else {
        let mag1 = Math.hypot(v1.x, v1.y);
        let mag2 = Math.hypot(v2.x, v2.y);
        let cosTheta = dot / (mag1 * mag2);
        
        if (Math.abs(cosTheta) < 0.05) {
          rightAngles.push(i);
        } else if (cosTheta > 0) {
          acuteAngles.push(i);
        } else {
          obtuseAngles.push(i);
        }
      }
    }
    
    const rCount = rightAngles.length;
    let otherType = "angles smaller than a right angle";
    let otherCount = acuteAngles.length;
    if (obtuseAngles.length > 0 && Math.random() > 0.5) {
       otherType = "angles greater than a right angle";
       otherCount = obtuseAngles.length;
    }
    
    const difference = Math.abs(rCount - otherCount);
    
    let askText = `STORY: An irregular shape is drawn above. Look at its angles. What is the difference between the number of right angles and ${otherType} inside the shape?`;
    let finalAns = `${difference}`;
    let hintStr = `Subtract the smaller number of angles from the larger number.`;
    let solutionStr = `Right angles = ${rCount}.\\n${otherType.charAt(0).toUpperCase() + otherType.slice(1)} = ${otherCount}.\\nDifference = ${Math.max(rCount, otherCount)} - ${Math.min(rCount, otherCount)} = ${difference}.`;
    
    let optionsArr = [`"\"${difference}\""`, `"\"${difference + 1}\""`, `"\"${difference + 2}\""`, `"\"${difference - 1 < 0 ? difference + 3 : difference - 1}\""`];

    visualEngineStr = JSON.stringify({ 
      componentToRender: "GEOMETRY_POLYGON", 
      componentData: { vertices: shapeVertices, rightAngles: rightAngles, acuteAngles: acuteAngles, obtuseAngles: obtuseAngles } 
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Number of right angles:`, expectedAnswer: `${rCount}`, acceptedAnswers: [] },
          { label: `Number of angles ${otherType}:`, expectedAnswer: `${otherCount}`, acceptedAnswers: [] },
          { label: `Write the working equation to find the difference:`, expectedAnswer: `${Math.max(rCount, otherCount)} - ${Math.min(rCount, otherCount)} = ${difference}`, acceptedAnswers: [] },
          { label: `Difference:`, expectedAnswer: `${difference}`, acceptedAnswers: [] }
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
- For content.questionText, ` + ((isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \\[[^\\]]+\\] /, 'Someone ').replace('STORY: ', '')}"`) + `
- For content.finalAnswer, use: "${isStructure && activeVariant === 'standard_deducing_quantities' ? triangles : finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');

  } else if (activeVariant === 'foundation_rectangular_subdivisions') {
    const rectLines = [[10,20, 90,20], [90,20, 90,80], [90,80, 10,80], [10,80, 10,20]];
    const generateRandomSubdivisions = () => {
      const rectLines = [[10,20, 90,20], [90,20, 90,80], [90,80, 10,80], [10,80, 10,20]];
      
      for (let attempt = 0; attempt < 50; attempt++) {
        const allLines = [...rectLines];
        
        const getPerimeterPoint = () => {
          let d = Math.random() * 280;
          if (d < 10 || d > 270) d = 0;
          else if (Math.abs(d - 80) < 10) d = 80;
          else if (Math.abs(d - 140) < 10) d = 140;
          else if (Math.abs(d - 220) < 10) d = 220;
          
          if (d < 80) return { x: 10 + d, y: 20 };
          if (d < 140) return { x: 90, y: 20 + (d - 80) };
          if (d < 220) return { x: 90 - (d - 140), y: 80 };
          return { x: 10, y: 80 - (d - 220) };
        };
        
        const N = getRandomInt(1, 3);
        const outLines = [...rectLines];
        
        for (let i = 0; i < N; i++) {
          let p1, p2;
          let subAttempts = 0;
          while(subAttempts < 100) {
            subAttempts++;
            p1 = getPerimeterPoint();
            p2 = getPerimeterPoint();
            if (Math.abs(p1.x - p2.x) < 1 || Math.abs(p1.y - p2.y) < 1) continue;
            if (Math.hypot(p1.x - p2.x, p1.y - p2.y) > 30) break;
          }
          allLines.push([p1.x, p1.y, p2.x, p2.y]);
          outLines.push([p1.x, p1.y, p2.x, p2.y]);
        }
        
        const getIntersection = (l1, l2) => {
          const x1 = l1[0], y1 = l1[1], x2 = l1[2], y2 = l1[3];
          const x3 = l2[0], y3 = l2[1], x4 = l2[2], y4 = l2[3];
          const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
          if (Math.abs(denom) < 0.001) return null;
          const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
          const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
          if (t >= -0.001 && t <= 1.001 && u >= -0.001 && u <= 1.001) {
            return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
          }
          return null;
        };
        
        let nodes = [];
        for (let i = 0; i < allLines.length; i++) {
          for (let j = i + 1; j < allLines.length; j++) {
            const pt = getIntersection(allLines[i], allLines[j]);
            if (pt) {
              let node = nodes.find(n => Math.hypot(n.x - pt.x, n.y - pt.y) < 0.1);
              if (!node) {
                node = { x: pt.x, y: pt.y, incidentLines: new Set() };
                nodes.push(node);
              }
              node.incidentLines.add(i);
              node.incidentLines.add(j);
            }
          }
        }
        
        let isValid = true;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < 15) {
              isValid = false; break;
            }
          }
          if (!isValid) break;
        }
        if (!isValid) continue;
        
        let edges = [];
        for (let i = 0; i < allLines.length; i++) {
          const lineNodes = nodes.filter(n => n.incidentLines.has(i));
          lineNodes.sort((a, b) => Math.hypot(a.x - allLines[i][0], a.y - allLines[i][1]) - Math.hypot(b.x - allLines[i][0], b.y - allLines[i][1]));
          
          for (let k = 0; k < lineNodes.length - 1; k++) {
            edges.push({ n1: lineNodes[k], n2: lineNodes[k+1] });
          }
        }
        
        const right = [];
        const acute = [];
        const obtuse = [];
        
        for (let node of nodes) {
          let rays = [];
          for (let edge of edges) {
            if (edge.n1 === node) rays.push({ dx: edge.n2.x - node.x, dy: edge.n2.y - node.y });
            if (edge.n2 === node) rays.push({ dx: edge.n1.x - node.x, dy: edge.n1.y - node.y });
          }
          
          rays = rays.map(r => {
            let a = Math.atan2(r.dy, r.dx) * 180 / Math.PI;
            if (a < 0) a += 360;
            return { ...r, angle: a };
          });
          rays.sort((a, b) => a.angle - b.angle);
          
          for (let i = 0; i < rays.length; i++) {
            let r1 = rays[i];
            let r2 = rays[(i + 1) % rays.length];
            
            let diff = r2.angle - r1.angle;
            if (diff < 0) diff += 360;
            
            if (diff < 1 || Math.abs(diff - 180) < 1) continue;
            
            let bisect = r1.angle + diff / 2;
            let bx = node.x + 5.0 * Math.cos(bisect * Math.PI / 180);
            let by = node.y + 5.0 * Math.sin(bisect * Math.PI / 180);
            
            let isInside = bx > 10.1 && bx < 89.9 && by > 20.1 && by < 79.9;
            
            if (isInside) {
              if (diff < 15) { isValid = false; break; }
              
              if (Math.abs(diff - 90) < 1) {
                let mag1 = Math.hypot(r1.dx, r1.dy);
                let mag2 = Math.hypot(r2.dx, r2.dy);
                right.push({ x: node.x, y: node.y, dx1: r1.dx/mag1, dy1: r1.dy/mag1, dx2: r2.dx/mag2, dy2: r2.dy/mag2 });
              } else if (diff < 90) {
                acute.push({ x: node.x, y: node.y, a1: r1.angle, a2: r2.angle > r1.angle ? r2.angle : r2.angle + 360 });
              } else if (diff > 90) {
                obtuse.push({ x: node.x, y: node.y, a1: r1.angle, a2: r2.angle > r1.angle ? r2.angle : r2.angle + 360 });
              }
            }
          }
          if (!isValid) break;
        }
        
        if (isValid) {
          return { lines: outLines, right, acute, obtuse };
        }
      }
      return { lines: [...rectLines, [30,20, 70,80]], right: [{x:10,y:20, dx1:1,dy1:0, dx2:0,dy2:1}, {x:90,y:20, dx1:-1,dy1:0, dx2:0,dy2:1}, {x:10,y:80, dx1:1,dy1:0, dx2:0,dy2:-1}, {x:90,y:80, dx1:-1,dy1:0, dx2:0,dy2:-1}], acute: [{x:30,y:20, a1:0, a2:56.31}, {x:70,y:80, a1:180, a2:236.31}], obtuse: [{x:30,y:20, a1:56.31, a2:180}, {x:70,y:80, a1:236.31, a2:360}] };
    };

    let cfg = generateRandomSubdivisions();
    let counts = { right: cfg.right.length, acute: cfg.acute.length, obtuse: cfg.obtuse.length };
    
    const targetType = getRandomArrayElement(["right", "acute", "obtuse"]);
    const targetLabel = targetType === "right" ? "right angles" : (targetType === "acute" ? "angles smaller than a right angle" : "angles greater than a right angle");
    const count = counts[targetType];
    
    let askText = `STORY: A rectangle is drawn and subdivided by several straight lines cutting across it. Look at the marked angles. Calculate the total number of ${targetLabel} inside the shape.`;
    let finalAns = `${count}`;
    let hintStr = `Carefully count every single ${targetLabel} marked in red.`;
    let solutionStr = `There are exactly ${count} ${targetLabel} formed by the intersecting lines.`;
    let stepsArr = [];
    let optionsArr = [`"${count}"`, `"${count + 1}"`, `"${count + 2}"`, `"${count - 1 < 0 ? count + 3 : count - 1}"`];

    if (isStructure) {
      stepsArr = [
        { label: `Total number of ${targetLabel}:`, expectedAnswer: `${count}`, acceptedAnswers: [] }
      ];
    }

    visualEngineStr = JSON.stringify({ componentToRender: "ANGLE_VISUALIZER", componentData: cfg });

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
- For content.questionText, ` + ((isStructure || (!isShort && !isMCQ)) ? `rewrite the following STORY replacing the placeholders. Preserve exact math values. NEVER add extra questions. DO NOT include "STORY:" prefix.\\n${askText}` : `use: "${askText.replace(/STORY: \\[[^\\]]+\\] /, 'Someone ').replace('STORY: ', '')}"`) + `
- For content.finalAnswer, use: "${isStructure && activeVariant === 'standard_deducing_quantities' ? triangles : finalAns}"
- For content.hint, use: "${hintStr}"
- For content.solutionSteps, use: """${solutionStr}"""
` + (isMCQ ? `Generate EXACTLY 4 options:
- ${optionsArr[0]}
- ${optionsArr[1]}
- ${optionsArr[2]}
- ${optionsArr[3]}` : '');

  }

  return { visualEngineStr, inputRequirementStr, systemPrompt };
}
