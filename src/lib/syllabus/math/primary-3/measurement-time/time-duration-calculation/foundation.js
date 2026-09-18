import { getRandomNames, getTimeActivities } from '@/lib/utils/variable-bank';

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const activities = getTimeActivities(2);

  let askText, answer, options, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {}}`;
  let inputRequirementStr = null;

  const makeTimeAns = (timeStr) => {
    const clean = timeStr.replace(/\./g, '').toLowerCase();
    const noSpace = clean.replace(/\s/g, '');
    const justTime = timeStr.split(' ')[0];
    return [timeStr, clean, noSpace, justTime, timeStr.replace(' p.m.', 'p.m.').replace(' a.m.', 'a.m.')];
  };

  const makeEq = (a, op, b, c) => [
    `${a} ${op} ${b} = ${c}`,
    `${a}${op}${b}=${c}`,
    ...(['+', 'x', '*'].includes(op) ? [`${b} ${op} ${a} = ${c}`, `${b}${op}${a}=${c}`] : [])
  ];

  const format12h = (h24, m) => {
    let period = h24 >= 12 ? 'p.m.' : 'a.m.';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    let mStr = m.toString().padStart(2, '0');
    return `${h12}:${mStr} ${period}`;
  };

  switch (activeVariant) {
    case 'foundation_find_finishing_pure': {
      // Variant 1: Start time + duration (mins). Stay within hour.
      let startH = Math.floor(Math.random() * 12) + 6; // 6am to 5pm
      let startM = Math.floor(Math.random() * 25) + 3; // 3 to 27
      let duration = Math.floor(Math.random() * 25) + 12; // 12 to 36
      // ensure no crossing
      while (startM + duration >= 60) duration--;
      
      let endM = startM + duration;
      let startTime = format12h(startH, startM);
      let endTime = format12h(startH, endM);
      let isPm = startH >= 12 ? "p.m." : "a.m.";
      
      answer = endTime;
      options = [
        endTime,
        format12h(startH, endM + 10 > 59 ? 59 : endM + 10),
        format12h(startH, Math.max(0, endM - 10)),
        format12h(startH + 1, endM)
      ];

      if (isStructure) {
        askText = `STORY: ${names[0]} starts ${activities[0].text} at ${startTime}. The activity takes ${duration} minutes.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time she finishes.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the final minutes:`, expectedAnswer: `${startM} + ${duration} = ${endM}`, acceptedAnswers: makeEq(startM, '+', duration, endM) },
            { label: `Finishing time (e.g., ${endTime}):`, expectedAnswer: endTime, acceptedAnswers: makeTimeAns(endTime) }
          ]
        });
      } else {
        askText = `${names[0]} started an activity at ${startTime}. The duration is ${duration} minutes. What is the finishing time?`;
      }
      
      solutionSteps = `1. Add the minutes: ${startM} + ${duration} = ${endM}.\n2. The hour remains the same. The finishing time is ${endTime}.`;
      hint = `Add the duration minutes to the starting minutes.`;
      break;
    }
    
    case 'foundation_find_starting_pure': {
      // Variant 2: Subtract minutes from end time. Stay within hour.
      let endH = Math.floor(Math.random() * 12) + 6; 
      let endM = Math.floor(Math.random() * 20) + 38; // 38 to 57
      let duration = Math.floor(Math.random() * 25) + 12; // 12 to 36
      // ensure no crossing backwards
      while (endM - duration < 0) duration--;
      
      let startM = endM - duration;
      let startTime = format12h(endH, startM);
      let endTime = format12h(endH, endM);
      let isPm = endH >= 12 ? "p.m." : "a.m.";
      
      answer = startTime;
      options = [
        startTime,
        format12h(endH, startM + 10),
        format12h(endH, Math.max(0, startM - 10)),
        format12h(endH - 1 < 0 ? 11 : endH - 1, startM)
      ];

      if (isStructure) {
        askText = `STORY: ${names[0]} finishes ${activities[0].text} at ${endTime}. The activity took ${duration} minutes.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time he started.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the starting minutes:`, expectedAnswer: `${endM} - ${duration} = ${startM}`, acceptedAnswers: makeEq(endM, '-', duration, startM) },
            { label: `Starting time (e.g., ${startTime}):`, expectedAnswer: startTime, acceptedAnswers: makeTimeAns(startTime) }
          ]
        });
      } else {
        askText = `${names[0]}'s finishing time is ${endTime}. The duration is ${duration} minutes. What is the starting time?`;
      }
      
      solutionSteps = `1. Subtract the duration minutes from the end minutes: ${endM} - ${duration} = ${startM}.\n2. The hour remains the same. The starting time is ${startTime}.`;
      hint = `Subtract the duration minutes from the finishing minutes to go backward in time.`;
      break;
    }
    
    case 'foundation_find_duration_same_hour': {
      // Variant 3: Difference between two times in same hour. BAR MODEL
      let h = Math.floor(Math.random() * 12) + 6; 
      let startM = Math.floor(Math.random() * 15) + 4; // 4 to 18
      let endM = Math.floor(Math.random() * 15) + 36; // 36 to 50
      let duration = endM - startM;
      
      let startTime = format12h(h, startM);
      let endTime = format12h(h, endM);
      
      answer = `${duration} minutes`;
      options = [
        `${duration} minutes`,
        `${duration + 10} minutes`,
        `${duration - 10} minutes`,
        `${endM + startM} minutes`
      ];

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { name: "Start Mins", value: `${startM} min`, size: startM, layoutSize: startM, segments: 1 },
            { name: "Duration", value: "?", size: duration, layoutSize: duration, segments: 1 }
          ],
          whole: `${endM} min`,
          wholeLayoutSize: endM
        }
      });

      if (isStructure) {
        askText = `STORY: ${names[0]} starts ${activities[0].text} at ${startTime} and stops at ${endTime}.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask how many minutes he spent.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the duration in minutes:`, expectedAnswer: `${endM} - ${startM} = ${duration}`, acceptedAnswers: makeEq(endM, '-', startM, duration) },
            { label: `Total duration in minutes:`, expectedAnswer: `${duration}`, acceptedAnswers: [`${duration}`, `${duration} minutes`, `${duration} mins`] }
          ]
        });
      } else {
        askText = `${names[0]} started at ${startTime} and finished at ${endTime}. What is the duration?`;
      }
      
      solutionSteps = `1. Subtract the starting minutes from the ending minutes: ${endM} - ${startM} = ${duration}.\n2. The total duration is ${duration} minutes.`;
      hint = `Subtract the starting minutes from the finishing minutes to find out how long it took.`;
      break;
    }
    
    case 'foundation_finishing_compound_no_cross': {
      // Variant 4: Add hours and minutes, no minute cross
      let startH = Math.floor(Math.random() * 8) + 1; // 1 to 8 pm
      let startM = Math.floor(Math.random() * 15) + 4; // 4 to 18
      let durH = Math.floor(Math.random() * 2) + 1; // 1 to 2
      let durM = Math.floor(Math.random() * 15) + 8; // 8 to 22
      
      let endH = startH + durH;
      let endM = startM + durM;
      
      let startTime = format12h(startH + 12, startM); // force p.m. for simplicity
      let endTime = format12h(endH + 12, endM);
      let isPm = "p.m.";
      
      answer = endTime;
      options = [
        endTime,
        format12h(endH + 12, endM + 10),
        format12h(endH + 1 + 12, endM),
        format12h(endH - 1 + 12, endM)
      ];

      if (isStructure) {
        askText = `STORY: ${names[0]} starts ${activities[0].text} at ${startTime}. It takes ${durH} hours and ${durM} minutes.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time she finishes.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the final hour:`, expectedAnswer: `${startH} + ${durH} = ${endH}`, acceptedAnswers: makeEq(startH, '+', durH, endH) },
            { label: `Write the working equation to find the final minutes:`, expectedAnswer: `${startM} + ${durM} = ${endM}`, acceptedAnswers: makeEq(startM, '+', durM, endM) },
            { label: `Finishing time (e.g., ${endTime}):`, expectedAnswer: endTime, acceptedAnswers: makeTimeAns(endTime) }
          ]
        });
      } else {
        askText = `${names[0]} started at ${startTime}. The duration is ${durH} hours ${durM} minutes. What is the finishing time?`;
      }
      
      solutionSteps = `1. Add the hours: ${startH} + ${durH} = ${endH}.\n2. Add the minutes: ${startM} + ${durM} = ${endM}.\n3. The finishing time is ${endTime}.`;
      hint = `Add the hours together, then add the minutes together.`;
      break;
    }
    
    case 'foundation_combine_two_durations': {
      // Variant 5: Combine two pure minute durations, then add to start time. BAR MODEL
      let dur1 = Math.floor(Math.random() * 11) + 12; // 12 to 22
      let dur2 = Math.floor(Math.random() * 11) + 12; // 12 to 22
      let totalDur = dur1 + dur2; // Max 44
      
      let startH = Math.floor(Math.random() * 11) + 6; // 6am to 4pm
      let startM = Math.floor(Math.random() * 11) + 3; // 3 to 13
      let endM = startM + totalDur;
      let startTime = format12h(startH, startM);
      let endTime = format12h(startH, endM);
      
      answer = endTime;
      options = [
        endTime,
        format12h(startH, endM + 10 > 59 ? 59 : endM + 10),
        format12h(startH, Math.max(0, endM - 10)),
        format12h(startH + 1, endM)
      ];

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { name: activities[0].text, value: `${dur1} min`, size: dur1, layoutSize: dur1, segments: 1 },
            { name: activities[1].text, value: `${dur2} min`, size: dur2, layoutSize: dur2, segments: 1 }
          ],
          whole: `? min`
        }
      });

      if (isStructure) {
        askText = `STORY: ${names[0]} started her tasks at ${startTime}. She spent ${dur1} minutes to ${activities[0].text} and ${dur2} minutes to ${activities[1].text}.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time she finished both activities.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total time spent:`, expectedAnswer: `${dur1} + ${dur2} = ${totalDur}`, acceptedAnswers: makeEq(dur1, '+', dur2, totalDur) },
            { label: `Write the working equation to find the final minutes:`, expectedAnswer: `${startM} + ${totalDur} = ${endM}`, acceptedAnswers: makeEq(startM, '+', totalDur, endM) },
            { label: `Finishing time (e.g., ${endTime}):`, expectedAnswer: endTime, acceptedAnswers: makeTimeAns(endTime) }
          ]
        });
      } else {
        askText = `${names[0]} started at ${startTime}. Task A takes ${dur1} minutes and Task B takes ${dur2} minutes. What is the finishing time?`;
      }
      
      solutionSteps = `1. Add the two durations: ${dur1} + ${dur2} = ${totalDur} minutes.\n2. Add the total duration to the start time's minutes: ${startM} + ${totalDur} = ${endM}.\n3. The finishing time is ${endTime}.`;
      hint = `First, add both duration times together to find the total time spent. Then, add that total to the start time!`;
      break;
    }
    
    default:
      throw new Error(`Variant not found in Foundation logic: ${activeVariant}`);
  }

  if (options && options.length > 0) {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
  }

  const generatedPrompt = getFormatInstructions(visualEngineStr, inputRequirementStr);

  return {
    aiPrompt: `You are an expert Primary 3 math generator. 

    ${generatedPrompt}

    STORY INSTRUCTION: 
    1. If the questionText starts with "STORY:", rewrite it into a creative Singaporean math story for a Primary 3 student. 
    2. Preserve exact mathematical values, times, and operations.
    3. NEVER add extra unrequested questions. Keep the final question sentence exactly as requested.
    4. CRITICAL: DO NOT include the word "STORY:" or any other prefixes in your final generated questionText.
    5. If there is a "[STORY]" tag, replace it with a simple 1-sentence story. 
    6. DO NOT modify any other fields in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided!
    7. CRITICAL: You are strictly forbidden from changing the "visualEngine" block. If the template provides "NONE", you MUST return "NONE". Do NOT hallucinate or create a BAR_MODEL.
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
