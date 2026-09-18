import { getRandomNames, getTimeActivities } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const activities = getTimeActivities(3);
  
  let askText, answer, options, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {}}`;
  let inputRequirementStr = null;

  const makeAns = (val) => [`${val}`, `${val}s`, `${val} s`, `${val} seconds`];
  const makeEq = (a, op, b, c) => [
    `${a} ${op} ${b} = ${c}`,
    `${a}${op}${b}=${c}`,
    ...(['+', 'x', '*'].includes(op) ? [
      `${b} ${op} ${a} = ${c}`,
      `${b}${op}${a}=${c}`
    ] : [])
  ];

  switch (activeVariant) {
    case 'advanced_add_pure_convert': {
      // Variant 11: Add Pure Seconds, Then Convert to Compound Units
      const sec1 = Math.floor(Math.random() * 20) + 40; // 40 to 59
      const sec2 = Math.floor(Math.random() * 20) + 40; // 40 to 59
      const totalSec = sec1 + sec2;
      const min = Math.floor(totalSec / 60);
      const remSec = totalSec % 60;
      
      answer = `${min} min ${remSec} s`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { name: activities[0].text, value: activities[0].text, size: sec1, layoutSize: sec1, segments: 1 },
            { name: activities[1].text, value: activities[1].text, size: sec2, layoutSize: sec2, segments: 1 }
          ],
          whole: `? min ? s`
        }
      });

      if (isStructure) {
        askText = `STORY: ${names[0]} performs two activities. She takes ${sec1} seconds to ${activities[0].text} and ${sec2} seconds to ${activities[1].text}.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what her total time was in minutes and seconds.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total time in seconds:`, expectedAnswer: `${sec1} + ${sec2} = ${totalSec}`, acceptedAnswers: makeEq(sec1, '+', sec2, totalSec) },
            { label: `Number of full minutes in the total time:`, expectedAnswer: `${min}`, acceptedAnswers: [`${min}`, `${min} min`, `${min} minute`] },
            { label: `Write the working equation to find the remaining seconds:`, expectedAnswer: `${totalSec} - 60 = ${remSec}`, acceptedAnswers: makeEq(totalSec, '-', 60, remSec) },
            { label: `Remaining seconds:`, expectedAnswer: `${remSec} s`, acceptedAnswers: makeAns(remSec) }
          ]
        });
      } else {
        askText = `${names[0]} is taking time to ${activities[0].text}. Add ${sec1} s and ${sec2} s. Express the answer in minutes and seconds.`;
      }

      options = [
        answer,
        `${min + 1} min ${remSec} s`,
        `${min} min ${remSec + 10} s`,
        `${min} min ${remSec - 10} s`
      ];

      solutionSteps = `1. Add the seconds: ${sec1} s + ${sec2} s = ${totalSec} s.\n2. Convert to compound: ${totalSec} s = 60 s + ${remSec} s = ${answer}.`;
      hint = `First add the seconds together. Then convert the total sum into minutes and seconds.`;
      break;
    }

    case 'advanced_compare_mixed_formats': {
      // Variant 12: Comparison of Mixed Formats (Convert, Then Subtract)
      const secB = Math.floor(Math.random() * 15) + 75; // 75 to 89
      // A is compound, e.g. 1 min 10 s (70 s)
      const secA_part = Math.floor(Math.random() * 10) + 5; // 5 to 14
      const secA_total = 60 + secA_part; // 65 to 74
      const isALonger = Math.random() > 0.5;
      
      const p1 = isALonger ? secB : secA_total; // Swimmer A
      const p2 = isALonger ? secA_total : secB; // Swimmer B
      const diff = Math.abs(p1 - p2);
      
      // Let's explicitly define Swimmer A as compound, Swimmer B as pure
      const swimmerA_min = 1;
      const swimmerA_sec = isALonger ? secB - 60 : secA_part;
      const swimmerA_total = swimmerA_min * 60 + swimmerA_sec;
      
      const swimmerB_total = isALonger ? secA_total : secB;
      const actualDiff = Math.abs(swimmerA_total - swimmerB_total);
      const fasterSwimmer = swimmerA_total < swimmerB_total ? "A" : "B";
      
      answer = `${actualDiff} s`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "COMPARISON",
          isStatic: true,
          bar1: { name: names[0], size: swimmerA_total, layoutSize: swimmerA_total, value: "?", segments: 1 },
          bar2: { name: names[1], size: swimmerB_total, layoutSize: swimmerB_total, value: "?", segments: 1 },
          diff: "?",
          whole: "?"
        }
      });

      if (isStructure) {
        askText = `STORY: ${names[0]} finishes a task in ${swimmerA_min} min ${swimmerA_sec} s. ${names[1]} finishes the same task in ${swimmerB_total} seconds.\n\nCRITICAL INSTRUCTION: Write a creative math story about a competition between them to ${activities[0].text}. Ask who was faster, and by how many seconds.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to convert Swimmer A's time to seconds:`, expectedAnswer: `60 + ${swimmerA_sec} = ${swimmerA_total}`, acceptedAnswers: makeEq(60, '+', swimmerA_sec, swimmerA_total) },
            { label: `Who was faster? (Type A or B):`, expectedAnswer: fasterSwimmer, acceptedAnswers: [fasterSwimmer, `Swimmer ${fasterSwimmer}`] },
            { label: `Write the working equation to find the difference in seconds:`, expectedAnswer: `${Math.max(swimmerA_total, swimmerB_total)} - ${Math.min(swimmerA_total, swimmerB_total)} = ${actualDiff}`, acceptedAnswers: makeEq(Math.max(swimmerA_total, swimmerB_total), '-', Math.min(swimmerA_total, swimmerB_total), actualDiff) },
            { label: `Difference in seconds:`, expectedAnswer: `${actualDiff} s`, acceptedAnswers: makeAns(actualDiff) }
          ]
        });
      } else {
        askText = `${names[0]} and ${names[1]} are competing to ${activities[0].text}. Find the difference between ${swimmerA_min} min ${swimmerA_sec} s and ${swimmerB_total} s.`;
      }

      options = [
        answer,
        `${actualDiff + 10} s`,
        `${actualDiff - 10} s`,
        `${actualDiff + 5} s`
      ];

      solutionSteps = `1. Convert Swimmer A: 1 min ${swimmerA_sec} s = 60 s + ${swimmerA_sec} s = ${swimmerA_total} s.\n2. Find difference: ${Math.max(swimmerA_total, swimmerB_total)} s - ${Math.min(swimmerA_total, swimmerB_total)} s = ${actualDiff} s.`;
      hint = `First, convert the compound time (min and s) into pure seconds. Then subtract to find the difference!`;
      break;
    }

    case 'advanced_three_part_total': {
      // Variant 13: 3-Part Total (Sequential Addition Across Legs)
      const sec1 = Math.floor(Math.random() * 15) + 25; // 25 to 39
      const sec2 = Math.floor(Math.random() * 15) + 25; // 25 to 39
      const sec3 = Math.floor(Math.random() * 15) + 30; // 30 to 44
      const totalSec = sec1 + sec2 + sec3;
      
      const missingIdx = Math.floor(Math.random() * 4); // 0=sec1, 1=sec2, 2=sec3, 3=total
      
      let ansNum;
      if (missingIdx === 0) ansNum = sec1;
      else if (missingIdx === 1) ansNum = sec2;
      else if (missingIdx === 2) ansNum = sec3;
      else ansNum = totalSec;
      
      answer = `${ansNum} s`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { name: activities[0].text, value: activities[0].text, size: sec1, layoutSize: sec1, segments: 1 },
            { name: activities[1].text, value: activities[1].text, size: sec2, layoutSize: sec2, segments: 1 },
            { name: activities[2].text, value: activities[2].text, size: sec3, layoutSize: sec3, segments: 1 }
          ],
          whole: "?"
        }
      });

      if (isStructure) {
        if (missingIdx === 3) {
          askText = `STORY: ${names[0]} performs three activities. She takes ${sec1} seconds to ${activities[0].text}, ${sec2} seconds to ${activities[1].text}, and ${sec3} seconds to ${activities[2].text}.\n\nCRITICAL INSTRUCTION: Write a creative math story about this 3-step process. Ask for the total time in seconds.`;
          const sum12 = sec1 + sec2;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Write the working equation to add Step 1 and Step 2:`, expectedAnswer: `${sec1} + ${sec2} = ${sum12}`, acceptedAnswers: makeEq(sec1, '+', sec2, sum12) },
              { label: `Write the working equation to add Step 3 to that sum:`, expectedAnswer: `${sum12} + ${sec3} = ${totalSec}`, acceptedAnswers: makeEq(sum12, '+', sec3, totalSec) },
              { label: `Total time in seconds:`, expectedAnswer: `${totalSec} s`, acceptedAnswers: makeAns(totalSec) }
            ]
          });
          solutionSteps = `1. Add Step 1 and 2: ${sec1} + ${sec2} = ${sum12} s.\n2. Add Step 3: ${sum12} + ${sec3} = ${totalSec} s.`;
          hint = `Add the first two times together, then add the third time to that total.`;
        } else {
          const knownParts = [sec1, sec2, sec3].filter((_, i) => i !== missingIdx);
          const sumKnown = knownParts[0] + knownParts[1];
          const missingAct = activities[missingIdx].text;
          const knownAct1 = missingIdx === 0 ? activities[1].text : activities[0].text;
          const knownAct2 = missingIdx === 2 ? activities[1].text : activities[2].text;
          
          askText = `STORY: ${names[0]} performs three activities taking a total of ${totalSec} seconds. She takes ${knownParts[0]} seconds to ${knownAct1} and ${knownParts[1]} seconds to ${knownAct2}. The rest of the time is used to ${missingAct}.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask how many seconds she took to ${missingAct}.`;
          
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Write the working equation to add the two known times:`, expectedAnswer: `${knownParts[0]} + ${knownParts[1]} = ${sumKnown}`, acceptedAnswers: makeEq(knownParts[0], '+', knownParts[1], sumKnown) },
              { label: `Write the working equation to find the time for the missing activity:`, expectedAnswer: `${totalSec} - ${sumKnown} = ${ansNum}`, acceptedAnswers: makeEq(totalSec, '-', sumKnown, ansNum) },
              { label: `Time taken to ${missingAct}:`, expectedAnswer: `${ansNum} s`, acceptedAnswers: makeAns(ansNum) }
            ]
          });
          solutionSteps = `1. Add the two known times: ${knownParts[0]} + ${knownParts[1]} = ${sumKnown} s.\n2. Subtract from total to find the missing time: ${totalSec} - ${sumKnown} = ${ansNum} s.`;
          hint = `Add the times you know together. Then subtract that sum from the total time to find the missing part!`;
        }
      } else {
        if (missingIdx === 3) {
          askText = `${names[0]} is taking time to do three things. Find the total of ${sec1} s, ${sec2} s, and ${sec3} s.`;
        } else {
          const knownParts = [sec1, sec2, sec3].filter((_, i) => i !== missingIdx);
          askText = `${names[0]} took a total of ${totalSec} s to do three things. Two of the things took ${knownParts[0]} s and ${knownParts[1]} s. Find the time taken for the third thing.`;
        }
      }

      options = [
        answer,
        `${ansNum + 10} s`,
        `${ansNum - 10} s`,
        `${ansNum + 5} s`
      ];

      break;
    }

    case 'advanced_target_limit_deduction': {
      // Variant 14: Deduction from a Target Time Limit
      const minLimit = Math.floor(Math.random() * 5) + 2; // 2 to 6
      const secLimit = minLimit * 60;
      const elapsed = Math.floor(Math.random() * 40) + (secLimit - 60); // We want elapsed to be reasonably close, so remain is < 60 usually or maybe less than 120
      const remain = secLimit - elapsed;
      
      answer = `${remain} s`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { name: "Time Taken", value: "Time Taken", size: elapsed, layoutSize: elapsed, segments: 1 },
            { name: "Time Left", value: "Time Left", size: remain, layoutSize: remain, segments: 1 }
          ],
          whole: "?",
          wholeLayoutSize: secLimit
        }
      });

      if (isStructure) {
        askText = `STORY: A strict time limit of ${minLimit} minutes is given to ${names[0]} to ${activities[0].text}. He completes it in ${elapsed} seconds.\n\nCRITICAL INSTRUCTION: Write a creative math story about this challenge. Ask how much time was left over in seconds.`;
        
        const repeatedAdd = Array(minLimit).fill('60').join(' + ');
        const repeatedAddNoSpace = Array(minLimit).fill('60').join('+');

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to convert the ${minLimit}-minute limit into seconds:`, expectedAnswer: `${minLimit} x 60 = ${secLimit}`, acceptedAnswers: [...makeEq(minLimit, 'x', 60, secLimit), ...makeEq(minLimit, '*', 60, secLimit), `${repeatedAdd} = ${secLimit}`, `${repeatedAddNoSpace}=${secLimit}`] },
            { label: `Write the working equation to find the remaining seconds:`, expectedAnswer: `${secLimit} - ${elapsed} = ${remain}`, acceptedAnswers: makeEq(secLimit, '-', elapsed, remain) },
            { label: `Remaining time in seconds:`, expectedAnswer: `${remain} s`, acceptedAnswers: makeAns(remain) }
          ]
        });
      } else {
        askText = `${names[0]} is taking time to ${activities[0].text}. How many seconds remain from a ${minLimit}-minute timer after ${elapsed} seconds have elapsed?`;
      }

      options = [
        answer,
        `${remain + 10} s`,
        `${remain - 10} s`,
        `${remain + 20} s`
      ];

      solutionSteps = `1. Convert limit: ${minLimit} minutes = ${secLimit} seconds.\n2. Subtract elapsed time: ${secLimit} s - ${elapsed} s = ${remain} s.`;
      hint = `Convert the time limit into seconds first. Then subtract the time already used!`;
      break;
    }

    case 'advanced_constant_diff_convert': {
      // Variant 15: Constant Difference to Find Person B, Then Convert
      const personA = Math.floor(Math.random() * 20) + 75; // 75 to 94
      const slowerBy = Math.floor(Math.random() * 15) + 15; // 15 to 29
      const personB_total = personA + slowerBy;
      
      const personB_min = Math.floor(personB_total / 60);
      const personB_sec = personB_total % 60;
      
      answer = `${personB_min} min ${personB_sec} s`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "COMPARISON",
          isStatic: true,
          bar1: { name: names[0], size: personA, layoutSize: personA, value: "?", segments: 1 },
          bar2: { name: names[1], size: personB_total, layoutSize: personB_total, value: `?`, segments: 1 },
          diff: `${slowerBy} s`,
          whole: "?"
        }
      });

      if (isStructure) {
        askText = `STORY: ${names[0]} takes ${personA} seconds to ${activities[0].text}. ${names[1]} takes ${slowerBy} seconds longer than ${names[0]}.\n\nCRITICAL INSTRUCTION: Write a creative math story comparing them. Ask how long the slower person took in minutes and seconds.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find ${names[1]}'s total time in seconds:`, expectedAnswer: `${personA} + ${slowerBy} = ${personB_total}`, acceptedAnswers: makeEq(personA, '+', slowerBy, personB_total) },
            { label: `Number of full minutes in ${names[1]}'s time:`, expectedAnswer: `${personB_min}`, acceptedAnswers: [`${personB_min}`, `${personB_min} min`, `${personB_min} minute`] },
            { label: `Write the working equation to find ${names[1]}'s remaining seconds:`, expectedAnswer: `${personB_total} - 60 = ${personB_sec}`, acceptedAnswers: makeEq(personB_total, '-', 60, personB_sec) },
            { label: `${names[1]}'s remaining seconds:`, expectedAnswer: `${personB_sec} s`, acceptedAnswers: makeAns(personB_sec) }
          ]
        });
      } else {
        askText = `${names[0]} and ${names[1]} are taking time to ${activities[0].text}. ${names[0]} took ${personA} s. ${names[1]} took ${slowerBy} s longer. Express ${names[1]}'s time in minutes and seconds.`;
      }

      options = [
        answer,
        `${personB_min + 1} min ${personB_sec} s`,
        `${personB_min} min ${personB_sec + 10} s`,
        `${personB_min} min ${personB_sec - 10} s`
      ];

      solutionSteps = `1. Find ${names[1]}'s total time: ${personA} + ${slowerBy} = ${personB_total} s.\n2. Convert to compound units: ${personB_total} s = 60 s + ${personB_sec} s = ${answer}.`;
      hint = `First add to find ${names[1]}'s total time in seconds. Then convert that total into minutes and seconds.`;
      break;
    }

    default:
      throw new Error(`Variant not found in Advanced logic: ${activeVariant}`);
  }

  const generatedPrompt = getFormatInstructions(visualEngineStr, inputRequirementStr);

  return {
    aiPrompt: `You are an expert Primary 3 math generator. 

    ${generatedPrompt}

    STORY INSTRUCTION: 
    1. If the questionText starts with "STORY:", rewrite it into a creative Singaporean math story for a Primary 3 student. 
    2. Preserve exact mathematical values and operations.
    3. NEVER add extra unrequested questions. Keep the final question sentence exactly as requested.
    4. CRITICAL: DO NOT include the word "STORY:" or any other prefixes in your final generated questionText.
    5. If there is a "[STORY]" tag, replace it with a simple 1-sentence story. 
    6. DO NOT modify any other fields in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.
    ${isShort ? '\n    CRITICAL STRICT RULE: This is a SHORT QUESTION. You MUST provide a direct mathematical question exactly as provided. DO NOT generate ANY story context, NO names, NO scenarios, and NO characters.' : ''}

    OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
    {
      "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
      "content": {
        "questionText": ${JSON.stringify(isShort ? askText : (isStructure ? askText : "[STORY] " + askText))},
        "options": ${JSON.stringify(options)},
        "defectMap": {},
        "hint": ${JSON.stringify(hint)},
        "finalAnswer": "${answer}",
        "solutionSteps": ${JSON.stringify(solutionSteps)}
      },
      "visualEngine": ${visualEngineStr},
      "inputRequirement": ${inputRequirementStr || JSON.stringify({ inputType: isMCQ ? "MCQ_BUTTONS" : "STANDARD_TEXT" })}
    }`,
    metadata: { difficulty: 'advanced', steps: isStructure ? (inputRequirementStr ? JSON.parse(inputRequirementStr).steps.length : 1) : 1, logic: activeVariant.replace('advanced_', '') }
  };
};
