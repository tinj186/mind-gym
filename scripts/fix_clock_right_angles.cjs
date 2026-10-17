const fs = require('fs');
const file = 'src/lib/syllabus/math/primary-3/geometry-angles/angle-comparison/foundation.js';
let text = fs.readFileSync(file, 'utf8');

const regex = /if \(activeVariant === 'foundation_clock_hands'\) \{[\s\S]*?visualEngineStr = JSON.stringify\(\{ componentToRender: "CLOCK_DISPLAY", componentData: \{ hour: h, minute: m \} \}\);\n\s+\}\n\n\s+if \(isStructure\) \{/;

const newBlock = `if (activeVariant === 'foundation_clock_hands') {
    let h, m, exact_m, type, angle;
    
    // Decide if we want exactly right angle, smaller, or greater
    const targetType = getRandomArrayElement(["smaller than a right angle", "greater than a right angle", "a right angle"]);
    
    if (targetType === "a right angle") {
      h = getRandomInt(1, 12);
      // Formula for right angles: 5.5m = 30h +/- 90
      let m1 = (30 * h - 90) / 5.5;
      let m2 = (30 * h + 90) / 5.5;
      
      let validMs = [];
      if (m1 >= 0 && m1 < 60) validMs.push(m1);
      if (m2 >= 0 && m2 < 60) validMs.push(m2);
      
      // Handle edge cases where formula overflows (e.g. 12)
      if (h === 12) {
        m1 = (30 * 0 - 90) / 5.5; // negative
        m2 = (30 * 0 + 90) / 5.5; // 16.36
        if (m2 >= 0 && m2 < 60) validMs.push(m2);
      }
      
      exact_m = getRandomArrayElement(validMs);
      m = Math.round(exact_m);
      if (m === 60) { m = 0; h = (h % 12) + 1; }
      
      type = targetType;
      angle = 90;
    } else {
      let attempts = 0;
      while (attempts < 100) {
        attempts++;
        h = getRandomInt(1, 12);
        m = getRandomInt(0, 59);
        exact_m = m;
        
        let hAngle = (h % 12) * 30 + m * 0.5;
        let mAngle = m * 6;
        let diff = Math.abs(hAngle - mAngle);
        angle = Math.min(diff, 360 - diff);
        
        // Ensure angles are visually distinct from a right angle
        if (targetType === "smaller than a right angle" && angle < 75 && angle > 10) {
          type = targetType;
          break;
        } else if (targetType === "greater than a right angle" && angle > 105 && angle < 170) {
          type = targetType;
          break;
        }
      }
    }
    
    const timeStr = \`\${h}:\${m.toString().padStart(2, '0')}\`;
    
    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = ["\\\"smaller than a right angle\\\"", "\\\"a right angle\\\"", "\\\"greater than a right angle\\\""];

    if (isStructure) {
      askText = \`STORY: A clock shows exactly \${timeStr}. Look at the clock. Is the angle formed between the hands smaller than a right angle, exactly a right angle, or greater than a right angle?\`;
      finalAns = type;
      
      let relativeDist = type === "a right angle" ? "the same distance as" : (type === "smaller than a right angle" ? "closer together than" : "further apart than");
      let ansDist = type === "a right angle" ? "exactly a right angle" : type;

      hintStr = \`Visually compare the distance between the hands to a corner of a square (which forms a right angle).\`;
      solutionStr = \`1. Look at the space between the minute hand and the hour hand.\\n2. The opening is \${ansDist}.\\n3. Therefore, the angle is \${ansDist}.\`;
      stepsArr = [
        { label: \`Imagine a square corner (a right angle) placed between the hands. Is the opening between the hands smaller, larger, or exactly the same as the square corner?\`, expectedAnswer: type === "a right angle" ? "exactly the same" : (type === "smaller than a right angle" ? "smaller" : "larger"), acceptedAnswers: ["smaller", "larger", "exactly the same"] },
        { label: \`Therefore, is the angle smaller than a right angle, a right angle, or greater than a right angle?\`, expectedAnswer: type, acceptedAnswers: [] }
      ];
    } else if (isMCQ) {
      askText = \`STORY: A clock shows exactly \${timeStr}. Is the angle formed between the hands smaller than a right angle, exactly a right angle, or greater than a right angle?\`;
      finalAns = type;
      hintStr = \`Visually compare the distance between the hands to a corner of a square (which forms a right angle).\`;
      solutionStr = \`The time \${timeStr} forms \${type}.\`;
    } else {
      askText = \`STORY: A clock shows exactly \${timeStr}. Is the angle formed between the hands smaller than a right angle, exactly a right angle, or greater than a right angle?\`;
      finalAns = type;
      hintStr = \`Visually compare the distance between the hands to a corner of a square.\`;
      solutionStr = \`At \${timeStr}, the angle is \${finalAns}.\`;
    }

    visualEngineStr = JSON.stringify({ componentToRender: "CLOCK_DISPLAY", componentData: { hour: h, minute: m, hourHandMinute: exact_m } });

    if (isStructure) {`;

text = text.replace(regex, newBlock);
fs.writeFileSync(file, text);
