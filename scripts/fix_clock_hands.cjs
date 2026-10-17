const fs = require('fs');
const file = 'src/lib/syllabus/math/primary-3/geometry-angles/angle-comparison/foundation.js';
let text = fs.readFileSync(file, 'utf8');

const regex = /if \(activeVariant === 'foundation_clock_hands'\) \{[\s\S]*?if \(isStructure\) \{\n\s+inputRequirementStr = JSON.stringify\(\{ inputType: "MULTI_STEP_INPUT", steps: stepsArr \}\);\n\s+\} else if \(!isMCQ\) \{\n\s+inputRequirementStr = `\{"inputType": "STANDARD_TEXT"\}`;\n\s+\}/;

const newBlock = `if (activeVariant === 'foundation_clock_hands') {
    const times = [
      { time: "3:00", type: "a right angle" },
      { time: "9:00", type: "a right angle" },
      { time: "1:00", type: "smaller than a right angle" },
      { time: "2:00", type: "smaller than a right angle" },
      { time: "10:00", type: "smaller than a right angle" },
      { time: "11:00", type: "smaller than a right angle" },
      { time: "4:00", type: "greater than a right angle" },
      { time: "5:00", type: "greater than a right angle" },
      { time: "7:00", type: "greater than a right angle" },
      { time: "8:00", type: "greater than a right angle" }
    ];
    
    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = ["\\\"smaller than a right angle\\\"", "\\\"a right angle\\\"", "\\\"greater than a right angle\\\""];

    const clock = getRandomArrayElement(times);

    if (isStructure) {
      askText = \`STORY: A clock shows exactly \${clock.time}. Is the angle formed between the hands smaller than a right angle, exactly a right angle, or greater than a right angle?\`;
      finalAns = clock.type;
      
      let relativeDist = clock.type === "a right angle" ? "the same distance as" : (clock.type === "smaller than a right angle" ? "closer together than" : "further apart than");
      let ansDist = clock.type === "a right angle" ? "exactly a right angle" : clock.type;

      hintStr = \`Compare the distance between the hands to 3:00 (which forms a right angle).\`;
      solutionStr = \`1. At 3:00, the hands form a right angle.\\n2. At \${clock.time}, the hands are \${relativeDist} they are at 3:00.\\n3. Therefore, the angle is \${ansDist}.\`;
      stepsArr = [
        { label: \`At 3:00, the angle between the hands is exactly a right angle. At \${clock.time}, are the hands closer together, further apart, or the same distance as 3:00?\`, expectedAnswer: clock.type === "a right angle" ? "the same distance" : (clock.type === "smaller than a right angle" ? "closer together" : "further apart"), acceptedAnswers: [] },
        { label: \`Therefore, is the angle smaller than a right angle, a right angle, or greater than a right angle?\`, expectedAnswer: clock.type, acceptedAnswers: [] }
      ];
    } else if (isMCQ) {
      const targetType = getRandomArrayElement(["smaller than a right angle", "greater than a right angle", "a right angle"]);
      const correctTime = getRandomArrayElement(times.filter(t => t.type === targetType)).time;
      let wrongTimes = times.filter(t => t.type !== targetType).sort(() => 0.5 - Math.random()).slice(0, 3).map(t => t.time);
      
      askText = \`STORY: Which of these times shows an angle \${targetType}?\`;
      finalAns = correctTime;
      hintStr = \`Think about the clock face. 3:00 and 9:00 are right angles. Closer hands make smaller angles, further apart make greater angles.\`;
      solutionStr = \`The time \${correctTime} forms \${targetType}.\`;
      optionsArr = [\`"\\"\${correctTime}\\""\`, \`"\\"\${wrongTimes[0]}\\""\`, \`"\\"\${wrongTimes[1]}\\""\`, \`"\\"\${wrongTimes[2]}\\""\`];
      visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });
    } else {
      askText = \`STORY: A clock shows exactly \${clock.time}. Is the angle formed between the hands smaller than a right angle, exactly a right angle, or greater than a right angle?\`;
      finalAns = clock.type;
      hintStr = \`Compare the distance between the hands to 3:00 (which is a right angle).\`;
      solutionStr = \`At \${clock.time}, the angle is \${finalAns}.\`;
    }

    if (!isMCQ) {
      visualEngineStr = JSON.stringify({ componentToRender: "CLOCK_DISPLAY", componentData: { time: clock.time } });
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = \`{"inputType": "STANDARD_TEXT"}\`;
    }`;

text = text.replace(regex, newBlock);
fs.writeFileSync(file, text);
