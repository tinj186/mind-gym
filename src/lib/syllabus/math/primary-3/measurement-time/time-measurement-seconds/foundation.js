import { getRandomNames, getTimeActivities } from '@/lib/utils/variable-bank';

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const activities = getTimeActivities(2);

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
    case 'foundation_pure_conversion': {
      // Variant 1: Pure Conversion (Minutes to Seconds)
      const min = Math.floor(Math.random() * 5) + 2; // 2 to 6
      const sec = min * 60;

      answer = `${sec} s`;

      if (isStructure) {
        askText = `STORY: ${names[0]} spends exactly ${min} minutes to ${activities[0].text}.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask for the total duration in seconds.`;

        const repeatedAdd = Array(min).fill('60').join(' + ');
        const repeatedAddNoSpace = Array(min).fill('60').join('+');

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to convert ${min} minutes to seconds:`, expectedAnswer: `${min} x 60 = ${sec}`, acceptedAnswers: [...makeEq(min, 'x', 60, sec), ...makeEq(min, '*', 60, sec), `${repeatedAdd} = ${sec}`, `${repeatedAddNoSpace}=${sec}`] },
            { label: `Total duration in seconds:`, expectedAnswer: `${sec} s`, acceptedAnswers: makeAns(sec) }
          ]
        });
      } else {
        askText = `Convert ${min} minutes into seconds.`;
      }

      options = [
        answer,
        `${(min + 1) * 60} s`,
        `${min * 10} s`,
        `${min + 60} s`
      ];

      solutionSteps = `1 minute = 60 seconds. So, ${min} minutes = ${min} × 60 = ${sec} seconds.`;
      hint = `Remember that 1 minute is equal to 60 seconds.`;
      break;
    }

    case 'foundation_compound_to_pure': {
      // Variant 2: Compound Time to Pure Seconds (1 min + s)
      const secPart = Math.floor(Math.random() * 45) + 10; // 10 to 54
      const totalSec = 60 + secPart;

      answer = `${totalSec} s`;

      if (isStructure) {
        askText = `STORY: ${names[0]} took 1 min ${secPart} s to ${activities[0].text}.\n\nCRITICAL INSTRUCTION: Rewrite the story dynamically. Ask how many seconds she took altogether.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Number of seconds in 1 minute:`, expectedAnswer: `60`, acceptedAnswers: [`60`, `60s`, `60 s`, `60 seconds`] },
            { label: `Write the working equation to find the total seconds:`, expectedAnswer: `60 + ${secPart} = ${totalSec}`, acceptedAnswers: makeEq(60, '+', secPart, totalSec) },
            { label: `Total time in seconds:`, expectedAnswer: `${totalSec} s`, acceptedAnswers: makeAns(totalSec) }
          ]
        });
      } else {
        askText = `Express 1 min ${secPart} s in seconds.`;
      }

      options = [
        answer,
        `${100 + secPart} s`,
        `${totalSec - 10} s`,
        `${totalSec + 10} s`
      ];

      solutionSteps = `1 min = 60 s. So, 1 min ${secPart} s = 60 s + ${secPart} s = ${totalSec} s.`;
      hint = `First change 1 min into seconds, then add the extra seconds.`;
      break;
    }

    case 'foundation_add_within_60': {
      // Variant 3: Adding Durations Within 60 Seconds
      const t1 = Math.floor(Math.random() * 20) + 15; // 15 to 34
      const maxT2 = 59 - t1;
      const t2 = Math.floor(Math.random() * (maxT2 - 10)) + 10; // at least 10, sum <= 59
      const sum = t1 + t2;

      answer = `${sum} s`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: `${t1} s`, size: t1, layoutSize: t1, segments: 1 },
            { value: `${t2} s`, size: t2, layoutSize: t2, segments: 1 }
          ],
          whole: "?"
        }
      });

      if (isStructure) {
        askText = `STORY: ${names[0]} is taking time to ${activities[0].text}. Part 1 of the activity takes ${t1} seconds, and Part 2 takes ${t2} seconds.\n\nCRITICAL INSTRUCTION: Write a creative math story about ${names[0]} doing this. Ask for the total duration in seconds.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total time:`, expectedAnswer: `${t1} + ${t2} = ${sum}`, acceptedAnswers: makeEq(t1, '+', t2, sum) },
            { label: `Total time in seconds:`, expectedAnswer: `${sum} s`, acceptedAnswers: makeAns(sum) }
          ]
        });
      } else {
        askText = `Add ${t1} seconds and ${t2} seconds.`;
      }

      options = [
        answer,
        `${sum + 10} s`,
        `${sum - 10} s`,
        `${Math.abs(t1 - t2)} s`
      ];

      solutionSteps = `${t1} s + ${t2} s = ${sum} s.`;
      hint = `Just add the two amounts together.`;
      break;
    }

    case 'foundation_compare_within_60': {
      // Variant 4: Comparing Durations Within 60 Seconds
      const t1 = Math.floor(Math.random() * 15) + 40; // 40 to 54
      const t2 = Math.floor(Math.random() * 15) + 15; // 15 to 29
      const diff = t1 - t2;

      answer = `${diff} s`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "COMPARISON",
          isStatic: true,
          bar1: { name: names[0], size: t1, layoutSize: t1, value: `${t1} s`, segments: 1 },
          bar2: { name: names[1], size: t2, layoutSize: t2, value: `${t2} s`, segments: 1 },
          diff: "?",
          whole: "?"
        }
      });

      if (isStructure) {
        askText = `STORY: ${names[0]} takes ${t1} seconds to ${activities[0].text}. ${names[1]} takes ${t2} seconds to do the same thing.\n\nCRITICAL INSTRUCTION: Write a creative math story comparing their times. Ask how many seconds longer the slower person took compared to the faster person.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the difference:`, expectedAnswer: `${t1} - ${t2} = ${diff}`, acceptedAnswers: makeEq(t1, '-', t2, diff) },
            { label: `Difference in seconds:`, expectedAnswer: `${diff} s`, acceptedAnswers: makeAns(diff) }
          ]
        });
      } else {
        askText = `Find the difference between ${t1} seconds and ${t2} seconds.`;
      }

      options = [
        answer,
        `${diff + 10} s`,
        `${diff - 10} s`,
        `${t1 + t2} s`
      ];

      solutionSteps = `${t1} s - ${t2} s = ${diff} s.`;
      hint = `To find how much longer one is than the other, subtract the smaller number from the larger number.`;
      break;
    }

    case 'foundation_shortfall_to_1min': {
      // Variant 5: Shortfall to Complete 1 Minute
      const t1 = Math.floor(Math.random() * 20) + 35; // 35 to 54
      const diff = 60 - t1;

      answer = `${diff} s`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: `${t1} s`, size: t1, layoutSize: t1, segments: 1 },
            { value: "?", size: diff, layoutSize: diff, segments: 1 }
          ],
          whole: `1 minute`,
          wholeLayoutSize: 60
        }
      });

      if (isStructure) {
        askText = `STORY: A 1-minute countdown timer is running while ${names[0]} tries to ${activities[0].text}. So far, ${t1} seconds have passed.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask how many more seconds are remaining.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Number of seconds in 1 whole minute:`, expectedAnswer: `60`, acceptedAnswers: [`60`, `60s`, `60 s`, `60 seconds`] },
            { label: `Write the working equation to find the remaining seconds:`, expectedAnswer: `60 - ${t1} = ${diff}`, acceptedAnswers: makeEq(60, '-', t1, diff) },
            { label: `Remaining time in seconds:`, expectedAnswer: `${diff} s`, acceptedAnswers: makeAns(diff) }
          ]
        });
      } else {
        askText = `How many more seconds are needed to make 1 minute from ${t1} seconds?`;
      }

      options = [
        answer,
        `${diff + 10} s`,
        `${diff - 10} s`,
        `${60 + t1} s`
      ];

      solutionSteps = `1 minute = 60 seconds. ${t1} s + ? = 60 s. So, 60 s - ${t1} s = ${diff} s.`;
      hint = `First remember that 1 minute is 60 seconds. Then subtract to find what's missing.`;
      break;
    }

    default:
      throw new Error(`Variant not found in Foundation logic: ${activeVariant}`);
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
    metadata: { difficulty: 'foundation', steps: isStructure ? (inputRequirementStr ? JSON.parse(inputRequirementStr).steps.length : 1) : 1, logic: activeVariant.replace('foundation_', '') }
  };
};
