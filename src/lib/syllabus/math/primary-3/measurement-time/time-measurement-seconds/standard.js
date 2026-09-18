import { getRandomNames, getTimeActivities } from '@/lib/utils/variable-bank';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
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
    case 'standard_decompose_pure': {
      // Variant 6: Decomposing Pure Seconds to Compound Units (<120 s)
      const sec = Math.floor(Math.random() * 50) + 65; // 65 to 114
      const remainingSec = sec - 60;
      
      answer = `1 min ${remainingSec} s`;

      if (isStructure) {
        askText = `STORY: ${names[0]} takes exactly ${sec} seconds to ${activities[0]}.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask to express the time taken in minutes and seconds.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Number of full minutes in ${sec} seconds:`, expectedAnswer: `1`, acceptedAnswers: [`1`, `1 min`, `1 minute`] },
            { label: `Write the working equation to find the remaining seconds:`, expectedAnswer: `${sec} - 60 = ${remainingSec}`, acceptedAnswers: makeEq(sec, '-', 60, remainingSec) },
            { label: `Remaining seconds:`, expectedAnswer: `${remainingSec} s`, acceptedAnswers: makeAns(remainingSec) }
          ]
        });
      } else {
        askText = `${names[0]} is taking time to ${activities[0].text}. Express ${sec} seconds in minutes and seconds.`;
      }

      options = [
        answer,
        `1 min ${remainingSec + 10} s`,
        `1 min ${remainingSec - 10} s`,
        `2 min ${remainingSec} s`
      ];

      solutionSteps = `${sec} s = 60 s + ${remainingSec} s = 1 min ${remainingSec} s.`;
      hint = `Remember that 60 seconds is 1 minute. Subtract 60 from the total to find the remaining seconds.`;
      break;
    }

    case 'standard_add_compound_pure': {
      // Variant 7: Adding Compound Time and Pure Seconds (Without Overflow)
      const sec1 = Math.floor(Math.random() * 20) + 10; // 10 to 29
      const sec2 = Math.floor(Math.random() * 20) + 20; // 20 to 39
      const sumSec = sec1 + sec2; // Max sum is 68, but wait: "where the seconds stay under 60".
      // Let's adjust sec2 so sumSec < 60
      const maxSec2 = 59 - sec1;
      const finalSec2 = Math.floor(Math.random() * (maxSec2 - 10)) + 10; 
      const finalSum = sec1 + finalSec2;
      
      answer = `1 min ${finalSum} s`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: `1 min ${sec1} s`, size: 60 + sec1, layoutSize: 60 + sec1, segments: 1 },
            { value: `${finalSec2} s`, size: finalSec2, layoutSize: finalSec2, segments: 1 }
          ],
          whole: "?"
        }
      });

      if (isStructure) {
        askText = `STORY: ${names[0]} spends 1 min ${sec1} s on the first part of ${activities[0].text}, and then ${finalSec2} seconds on the second part.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask how long the total duration was in minutes and seconds.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to add the seconds:`, expectedAnswer: `${sec1} + ${finalSec2} = ${finalSum}`, acceptedAnswers: makeEq(sec1, '+', finalSec2, finalSum) },
            { label: `Total minutes:`, expectedAnswer: `1`, acceptedAnswers: [`1`, `1 min`, `1 minute`] },
            { label: `Total seconds:`, expectedAnswer: `${finalSum} s`, acceptedAnswers: makeAns(finalSum) }
          ]
        });
      } else {
        askText = `${names[0]} is taking time to ${activities[0].text}. Add 1 min ${sec1} s and ${finalSec2} s.`;
      }

      options = [
        answer,
        `1 min ${finalSum + 10} s`,
        `1 min ${finalSum - 10} s`,
        `2 min ${finalSum - 60 > 0 ? finalSum - 60 : finalSum} s`
      ];

      solutionSteps = `Add the seconds: ${sec1} s + ${finalSec2} s = ${finalSum} s. Total: 1 min ${finalSum} s.`;
      hint = `Add the seconds together first. Since they don't add up to more than 60, the minutes stay the same!`;
      break;
    }

    case 'standard_compound_to_pure_2min': {
      // Variant 8: Compound Time to Pure Seconds (2 min+ Boundary)
      const min = Math.floor(Math.random() * 5) + 2; // 2 to 6
      const sec = Math.floor(Math.random() * 45) + 10;
      const minInSec = min * 60;
      const totalSec = minInSec + sec;
      
      answer = `${totalSec} s`;

      if (isStructure) {
        askText = `STORY: ${names[0]} takes ${min} min ${sec} s to ${activities[0].text}.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask for the total duration in seconds.`;
        
        const repeatedAdd = Array(min).fill('60').join(' + ');
        const repeatedAddNoSpace = Array(min).fill('60').join('+');

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the seconds in ${min} minutes:`, expectedAnswer: `${min} x 60 = ${minInSec}`, acceptedAnswers: [...makeEq(min, 'x', 60, minInSec), ...makeEq(min, '*', 60, minInSec), `${repeatedAdd} = ${minInSec}`, `${repeatedAddNoSpace}=${minInSec}`] },
            { label: `Write the working equation to find the total duration in seconds:`, expectedAnswer: `${minInSec} + ${sec} = ${totalSec}`, acceptedAnswers: makeEq(minInSec, '+', sec, totalSec) },
            { label: `Total seconds:`, expectedAnswer: `${totalSec} s`, acceptedAnswers: makeAns(totalSec) }
          ]
        });
      } else {
        askText = `${names[0]} is taking time to ${activities[0].text}. Convert ${min} min ${sec} s into seconds.`;
      }

      options = [
        answer,
        `${(min + 1) * 60 + sec} s`,
        `${totalSec - 10} s`,
        `${totalSec + 10} s`
      ];

      solutionSteps = `${min} min = ${minInSec} s. So, ${min} min ${sec} s = ${minInSec} s + ${sec} s = ${totalSec} s.`;
      hint = `First, convert the minutes into seconds. Then add the extra seconds.`;
      break;
    }

    case 'standard_addition_cross_60': {
      // Variant 9: Addition Crossing the 60-Second Threshold (Pure Seconds Output)
      const sec1 = Math.floor(Math.random() * 20) + 35; // 35 to 54
      const sec2 = Math.floor(Math.random() * 20) + 35; // 35 to 54
      const sum = sec1 + sec2;
      
      answer = `${sum} s`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: `${sec1} s`, size: sec1, layoutSize: sec1, segments: 1 },
            { value: `${sec2} s`, size: sec2, layoutSize: sec2, segments: 1 }
          ],
          whole: "?"
        }
      });

      if (isStructure) {
        askText = `STORY: ${names[0]} is trying to ${activities[0].text}. The first phase takes ${sec1} seconds and the second phase takes ${sec2} seconds.\n\nCRITICAL INSTRUCTION: Write a creative math story. Ask what the total time spent was in seconds.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total time:`, expectedAnswer: `${sec1} + ${sec2} = ${sum}`, acceptedAnswers: makeEq(sec1, '+', sec2, sum) },
            { label: `Total time in seconds:`, expectedAnswer: `${sum} s`, acceptedAnswers: makeAns(sum) }
          ]
        });
      } else {
        askText = `${names[0]} is taking time to ${activities[0].text}. What is the sum of ${sec1} seconds and ${sec2} seconds?`;
      }

      options = [
        answer,
        `${sum + 10} s`,
        `${sum - 10} s`,
        `${sum + 20} s`
      ];

      solutionSteps = `${sec1} s + ${sec2} s = ${sum} s.`;
      hint = `Just add the two amounts together to find the total seconds.`;
      break;
    }

    case 'standard_comparison_seconds': {
      // Variant 10: Comparison Word Problem with Seconds
      const t1 = Math.floor(Math.random() * 30) + 85; // 85 to 114
      const t2 = Math.floor(Math.random() * 30) + 50; // 50 to 79
      const diff = t1 - t2;
      
      answer = `${diff} s`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "COMPARISON",
          isStatic: true,
          bar1: { name: "App A", size: t1, layoutSize: t1, value: `${t1} s`, segments: 1 },
          bar2: { name: "App B", size: t2, layoutSize: t2, value: `${t2} s`, segments: 1 },
          diff: "?",
          whole: "?"
        }
      });

      if (isStructure) {
        askText = `STORY: It takes ${t1} seconds for ${names[0]} to ${activities[0].text}, but ${t2} seconds for ${names[1]} to do the same thing.\n\nCRITICAL INSTRUCTION: Write a creative math story comparing their times. Ask how much faster the shorter task was compared to the longer task.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the difference:`, expectedAnswer: `${t1} - ${t2} = ${diff}`, acceptedAnswers: makeEq(t1, '-', t2, diff) },
            { label: `Difference in seconds:`, expectedAnswer: `${diff} s`, acceptedAnswers: makeAns(diff) }
          ]
        });
      } else {
        askText = `${names[0]} and ${names[1]} are taking time to ${activities[0].text}. How many seconds shorter is ${t2} s than ${t1} s?`;
      }

      options = [
        answer,
        `${diff + 10} s`,
        `${diff - 10} s`,
        `${diff + 12} s`
      ];

      solutionSteps = `${t1} s - ${t2} s = ${diff} s.`;
      hint = `To find how much faster or shorter, subtract the smaller number from the larger number.`;
      break;
    }

    default:
      throw new Error(`Variant not found in Standard logic: ${activeVariant}`);
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
    metadata: { difficulty: 'standard', steps: isStructure ? (inputRequirementStr ? JSON.parse(inputRequirementStr).steps.length : 1) : 1, logic: activeVariant.replace('standard_', '') }
  };
};
