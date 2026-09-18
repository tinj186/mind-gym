import { getRandomNames } from '@/lib/utils/variable-bank';

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pad0 = (num) => num.toString().padStart(2, '0');

  // Random names and activities
  const names = getRandomNames(2);
  const activitiesList = ['playing', 'reading', 'swimming', 'studying', 'sleeping', 'eating'];
  const name = names[0];
  const activity = activitiesList[getRandomInt(0, activitiesList.length - 1)];

  const format12h = (h, m, ampm) => {
    let dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${dh}:${pad0(m)} ${ampm}`;
  };

  const format24h = (h, m) => {
    return `${pad0(h)}${pad0(m)}`;
  };

  if (activeVariant === 'foundation_direct_conversion_am') {
    // 12-hour AM -> 24h OR 24h -> 12-hour AM
    const isTo24 = Math.random() > 0.5;
    const h = getRandomInt(1, 11);
    const m = getRandomInt(0, 59);
    
    const time12 = format12h(h, m, 'a.m.');
    const time24 = format24h(h, m);
    
    let askText = "";
    let finalAnswer = "";
    
    if (isTo24) {
      askText = `Write ${time12} in the 24-hour clock.`;
      finalAnswer = time24;
      
      if (isStructure) {
        askText = `${name} starts ${activity} at ${time12}. What time is this in the 24-hour clock?`;
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the time in 24-hour format (e.g., 0815):", "expectedAnswer": "${time24}", "acceptedAnswers": ["${time24}"]}
        ]}`;
      }
    } else {
      askText = `Write ${time24} in the 12-hour clock.`;
      finalAnswer = time12;
      
      if (isStructure) {
        askText = `The school bus arrives at ${time24}. What time is this in the 12-hour clock?`;
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the time in 12-hour format (e.g., 7:15):", "expectedAnswer": "${h}:${pad0(m)}", "acceptedAnswers": ["${h}:${pad0(m)}"]},
          {"label": "Write a.m. or p.m.:", "expectedAnswer": "a.m.", "acceptedAnswers": ["am", "a.m"]}
        ]}`;
      }
    }
    
    let sysSolutionSteps = isTo24 
      ? `"""1. ${time12} is in the morning.\\n2. In the 24-hour clock, we write it as a 4-digit number without a.m. or p.m.\\n3. ${time12} becomes ${time24}."""`
      : `"""1. ${time24} is less than 1200, so it is in the morning (a.m.).\\n2. The hours are ${h} and the minutes are ${pad0(m)}.\\n3. So, ${time24} is ${time12}."""`;

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = isTo24 ? time24 : time12;
      let opt2 = isTo24 ? format24h(h+12, m) : format12h(h, m, 'p.m.');
      let opt3 = isTo24 ? format24h(h, m+10>59?m-10:m+10) : format12h(h-1===0?12:h-1, m, 'a.m.');
      let opt4 = isTo24 ? format24h(h+1, m) : format12h(h, m+10>59?m-10:m+10, 'a.m.');
      
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps.
Use EXACTLY:
questionText: "${isTo24 ? `Which of the following shows ${time12} in the 24-hour clock?` : `Which of the following shows ${time24} in the 12-hour clock?`}"
finalAnswer: "${opt1}"
hint: "${isTo24 ? `Times in the morning (a.m.) between 0100 and 1159 are written exactly the same, but with 4 digits and no a.m.` : `Numbers less than 1200 mean it is in the morning (a.m.).`}"
solutionSteps: ${sysSolutionSteps}

Generate EXACTLY 4 options:
- "${opt1}"
- "${opt2}"
- "${opt3}"
- "${opt4}"
The defectMap should map the incorrect options to "CONVERSION_ERROR".
`;
    } else {
      if (!isStructure) inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${askText}"
finalAnswer: "${finalAnswer}"
hint: "${isTo24 ? `Times in the morning (a.m.) between 0100 and 1159 are written exactly the same, but with 4 digits and no a.m.` : `Numbers less than 1200 mean it is in the morning (a.m.).`}"
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  else if (activeVariant === 'foundation_direct_conversion_pm') {
    const isTo24 = Math.random() > 0.5;
    const h = getRandomInt(1, 11);
    const m = getRandomInt(0, 59);
    
    const time12 = format12h(h, m, 'p.m.');
    const time24 = format24h(h + 12, m);
    
    let askText = "";
    let finalAnswer = "";
    
    if (isTo24) {
      askText = `Convert ${time12} to the 24-hour clock.`;
      finalAnswer = time24;
      
      if (isStructure) {
        askText = `A movie starts at ${time12}. Write this time using the 24-hour clock.`;
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to convert the p.m. hour to the 24-hour clock:", "expectedAnswer": "${h} + 12 = ${h+12}", "acceptedAnswers": []},
          {"label": "Write the final time in 24-hour clock format (e.g., 1830):", "expectedAnswer": "${time24}", "acceptedAnswers": ["${time24}"]}
        ]}`;
      }
    } else {
      askText = `Convert ${time24} to the 12-hour clock.`;
      finalAnswer = time12;
      
      if (isStructure) {
        askText = `${name} finishes ${activity} at ${time24}. What time is this in the 12-hour clock?`;
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to convert the hour to the 12-hour clock:", "expectedAnswer": "${h+12} - 12 = ${h}", "acceptedAnswers": []},
          {"label": "Write the time in 12-hour format (e.g., 7:15):", "expectedAnswer": "${h}:${pad0(m)}", "acceptedAnswers": ["${h}:${pad0(m)}"]},
          {"label": "Write a.m. or p.m.:", "expectedAnswer": "p.m.", "acceptedAnswers": ["pm", "p.m"]}
        ]}`;
      }
    }
    
    let sysSolutionSteps = isTo24 
      ? `"""1. ${time12} is in the afternoon or evening.\\n2. To change p.m. to the 24-hour clock, add 12 to the hours: ${h} + 12 = ${h+12}.\\n3. ${time12} becomes ${time24}."""`
      : `"""1. ${time24} is 1200 or more, so it is in the afternoon or evening (p.m.).\\n2. To find the 12-hour time, subtract 12 from the hours: ${h+12} - 12 = ${h}.\\n3. ${time24} is ${time12}."""`;

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = isTo24 ? time24 : time12;
      let opt2 = isTo24 ? format24h(h, m) : format12h(h, m, 'a.m.');
      let opt3 = isTo24 ? format24h(h+12, m+10>59?m-10:m+10) : format12h(h+1===12?1:h+1, m, 'p.m.');
      let opt4 = isTo24 ? format24h(h+10, m) : format12h(h===1?12:h-1, m, 'p.m.');
      
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${isTo24 ? `Which of the following shows ${time12} in the 24-hour clock?` : `${time24} is the same as which time?`}"
finalAnswer: "${opt1}"
hint: "${isTo24 ? `For p.m. times, add 12 to the hours.` : `For 24-hour times 1300 and above, subtract 12 from the hours and use p.m.`}"
solutionSteps: ${sysSolutionSteps}

Generate EXACTLY 4 options:
- "${opt1}"
- "${opt2}"
- "${opt3}"
- "${opt4}"
The defectMap should map the incorrect options to "CONVERSION_ERROR".
`;
    } else {
      if (!isStructure) inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${askText}"
finalAnswer: "${finalAnswer}"
hint: "${isTo24 ? `For p.m. times, add 12 to the hours.` : `For 24-hour times 1300 and above, subtract 12 from the hours and use p.m.`}"
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  else if (activeVariant === 'foundation_thresholds_noon_midnight') {
    const isNoon = Math.random() > 0.5;
    const isTo24 = Math.random() > 0.5;
    const m = getRandomInt(0, 59);
    
    const time12 = format12h(12, m, isNoon ? 'p.m.' : 'a.m.');
    const time24 = format24h(isNoon ? 12 : 0, m);
    
    let askText = "";
    let finalAnswer = "";
    
    if (isTo24) {
      askText = `Write ${time12} in the 24-hour clock.`;
      finalAnswer = time24;
      
      if (isStructure) {
        askText = `${name} had a snack at ${time12}. Write this time using the 24-hour clock.`;
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the time in 24-hour format (e.g., 0015):", "expectedAnswer": "${time24}", "acceptedAnswers": ["${time24}"]}
        ]}`;
      }
    } else {
      askText = `Write ${time24} in the 12-hour clock.`;
      finalAnswer = time12;
      
      if (isStructure) {
        askText = `Jia Hao went to sleep at ${time24}. What time is this in the 12-hour clock?`;
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the time in 12-hour format (e.g., 12:15):", "expectedAnswer": "12:${pad0(m)}", "acceptedAnswers": ["12:${pad0(m)}"]},
          {"label": "Write a.m. or p.m.:", "expectedAnswer": "${isNoon ? 'p.m.' : 'a.m.'}", "acceptedAnswers": []}
        ]}`;
      }
    }
    
    let sysSolutionSteps = isTo24 
      ? `"""1. ${time12} is ${isNoon ? 'after 12 noon' : 'after midnight'}.\\n2. ${isNoon ? '12 p.m. times keep the 12 in 24-hour format.' : '12 a.m. times become 00 hours in 24-hour format.'}\\n3. ${time12} becomes ${time24}."""`
      : `"""1. ${time24} is ${isNoon ? 'after 12 noon' : 'after midnight'}.\\n2. ${isNoon ? '12xx times become 12 p.m.' : '00xx times become 12 a.m.'}\\n3. ${time24} is ${time12}."""`;

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = isTo24 ? time24 : time12;
      let opt2 = isTo24 ? format24h(isNoon ? 0 : 12, m) : format12h(12, m, isNoon ? 'a.m.' : 'p.m.');
      let opt3 = isTo24 ? format24h(isNoon ? 24 : 12, m) : format12h(1, m, isNoon ? 'p.m.' : 'a.m.');
      let opt4 = isTo24 ? format24h(isNoon ? 12 : 0, m+10>59?m-10:m+10) : format12h(12, m+10>59?m-10:m+10, isNoon ? 'p.m.' : 'a.m.');
      
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${isTo24 ? `What is ${time12} in the 24-hour clock?` : `What is ${time24} in the 12-hour clock?`}"
finalAnswer: "${opt1}"
hint: "${isNoon ? '12:xx p.m. is 12xx in 24-hour clock.' : '12:xx a.m. is 00xx in 24-hour clock.'}"
solutionSteps: ${sysSolutionSteps}

Generate EXACTLY 4 options:
- "${opt1}"
- "${opt2}"
- "${opt3}"
- "${opt4}"
The defectMap should map the incorrect options to "CONVERSION_ERROR".
`;
    } else {
      if (!isStructure) inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${askText}"
finalAnswer: "${finalAnswer}"
hint: "${isNoon ? '12:xx p.m. is 12xx in 24-hour clock.' : '12:xx a.m. is 00xx in 24-hour clock.'}"
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  else if (activeVariant === 'foundation_simple_timeline_same_hour') {
    const unknown = ['start', 'duration', 'end'][getRandomInt(0, 2)];
    const h = getRandomInt(1, 22);
    const startM = getRandomInt(0, 30);
    const dur = getRandomInt(10, 25);
    const endM = startM + dur;
    
    const start24 = format24h(h, startM);
    const end24 = format24h(h, endM);
    
    let askText = "";
    let finalAnswer = "";
    
    visualEngineStr = `{
      "componentToRender": "TIMELINE",
      "componentData": {
        "points": [
          {"label": "${unknown === 'start' ? '?' : start24}"},
          {"label": "${unknown === 'end' ? '?' : end24}"}
        ],
        "jumps": [
          {"startIndex": 0, "endIndex": 1, "label": "${unknown === 'duration' ? '?' : dur + ' min'}"}
        ]
      }
    }`;

    if (unknown === 'start') {
      askText = `A class ended at ${end24}. It lasted for ${dur} minutes. What time did it start?`;
      finalAnswer = start24;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the starting minutes:", "expectedAnswer": "${endM} - ${dur} = ${startM}", "acceptedAnswers": []},
          {"label": "Starting time in 24-hour clock:", "expectedAnswer": "${start24}", "acceptedAnswers": ["${start24}"]}
        ]}`;
      }
    } else if (unknown === 'end') {
      askText = `A train leaves at ${start24}. The journey takes ${dur} minutes. What time does it arrive in 24-hour clock format?`;
      finalAnswer = end24;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the finishing minutes:", "expectedAnswer": "${startM} + ${dur} = ${endM}", "acceptedAnswers": []},
          {"label": "Finishing time in 24-hour clock:", "expectedAnswer": "${end24}", "acceptedAnswers": ["${end24}"]}
        ]}`;
      }
    } else {
      askText = `${name} started reading at ${start24} and finished at ${end24}. How many minutes did they read?`;
      finalAnswer = `${dur} minutes`;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the duration in minutes:", "expectedAnswer": "${endM} - ${startM} = ${dur}", "acceptedAnswers": []},
          {"label": "Duration in minutes:", "expectedAnswer": "${dur}", "acceptedAnswers": ["${dur}"]}
        ]}`;
      }
    }

    let sysSolutionSteps = ``;
    if (unknown === 'start') {
      sysSolutionSteps = `"""1. End time is ${end24} and duration is ${dur} minutes.\\n2. Subtract duration from the end minutes: ${endM} - ${dur} = ${startM}.\\n3. The start time is ${start24}."""`;
    } else if (unknown === 'end') {
      sysSolutionSteps = `"""1. Start time is ${start24} and duration is ${dur} minutes.\\n2. Add duration to the start minutes: ${startM} + ${dur} = ${endM}.\\n3. The end time is ${end24}."""`;
    } else {
      sysSolutionSteps = `"""1. Start time is ${start24} and end time is ${end24}.\\n2. Subtract the start minutes from the end minutes: ${endM} - ${startM} = ${dur}.\\n3. The duration is ${dur} minutes."""`;
    }

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = finalAnswer;
      let opt2, opt3, opt4;
      if (unknown === 'duration') {
        opt2 = `${dur + 10} minutes`;
        opt3 = `${dur - 10 > 0 ? dur - 10 : dur + 5} minutes`;
        opt4 = `${startM + endM} minutes`;
      } else {
        const fakeH = h;
        const o2m = endM + 10 > 59 ? endM - 10 : endM + 10;
        const o3m = startM - 10 < 0 ? startM + 10 : startM - 10;
        opt2 = format24h(fakeH, o2m);
        opt3 = format24h(fakeH, o3m);
        opt4 = format24h(fakeH, startM + dur + 10);
      }
      
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${askText}"
finalAnswer: "${opt1}"
hint: "Use a timeline. ${unknown === 'duration' ? 'Subtract start from end.' : unknown === 'end' ? 'Add duration to start.' : 'Subtract duration from end.'}"
solutionSteps: ${sysSolutionSteps}

Generate EXACTLY 4 options:
- "${opt1}"
- "${opt2}"
- "${opt3}"
- "${opt4}"
The defectMap should map the incorrect options to "CALCULATION_ERROR".
`;
    } else {
      if (!isStructure) inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${askText}"
finalAnswer: "${finalAnswer}"
hint: "Use a timeline. ${unknown === 'duration' ? 'Subtract start from end.' : unknown === 'end' ? 'Add duration to start.' : 'Subtract duration from end.'}"
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  else if (activeVariant === 'foundation_comparing_24h_times') {
    const unknown = ['diff', 'start', 'end'][getRandomInt(0, 2)];
    const h = getRandomInt(1, 22);
    const m1 = getRandomInt(0, 25);
    const diff = getRandomInt(10, 30);
    const m2 = m1 + diff;
    
    const time1 = format24h(h, m1); // Earlier
    const time2 = format24h(h, m2); // Later
    
    let askText = "";
    let finalAnswer = "";
    
    visualEngineStr = `{
      "componentToRender": "TIMELINE",
      "componentData": {
        "points": [
          {"label": "${unknown === 'start' ? '?' : time1}"},
          {"label": "${unknown === 'end' ? '?' : time2}"}
        ],
        "jumps": [
          {"startIndex": 0, "endIndex": 1, "label": "${unknown === 'diff' ? '?' : diff + ' min'}"}
        ]
      }
    }`;

    if (unknown === 'diff') {
      askText = `Bus A arrives at ${time1}. Bus B arrives at ${time2}. How many minutes later does Bus B arrive?`;
      finalAnswer = `${diff} minutes`;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the difference in minutes:", "expectedAnswer": "${m2} - ${m1} = ${diff}", "acceptedAnswers": []},
          {"label": "Difference in minutes:", "expectedAnswer": "${diff}", "acceptedAnswers": ["${diff}"]}
        ]}`;
      }
    } else if (unknown === 'start') {
      askText = `Task A ends at ${time2}. Task B ends ${diff} minutes earlier. What time does Task B end?`;
      finalAnswer = time1;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the finishing minutes for Task B:", "expectedAnswer": "${m2} - ${diff} = ${m1}", "acceptedAnswers": []},
          {"label": "Task B end time in 24-hour format:", "expectedAnswer": "${time1}", "acceptedAnswers": ["${time1}"]}
        ]}`;
      }
    } else {
      askText = `Which time is ${diff} minutes later than ${time1}?`;
      finalAnswer = time2;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the new minutes:", "expectedAnswer": "${m1} + ${diff} = ${m2}", "acceptedAnswers": []},
          {"label": "New time in 24-hour format:", "expectedAnswer": "${time2}", "acceptedAnswers": ["${time2}"]}
        ]}`;
      }
    }

    let sysSolutionSteps = ``;
    if (unknown === 'diff') {
      sysSolutionSteps = `"""1. The two times are ${time1} and ${time2}.\\n2. Subtract the earlier minutes from the later minutes: ${m2} - ${m1} = ${diff}.\\n3. Bus B arrives ${diff} minutes later."""`;
    } else if (unknown === 'start') {
      sysSolutionSteps = `"""1. Task A ends at ${time2} and Task B is ${diff} minutes earlier.\\n2. Subtract ${diff} from ${m2}: ${m2} - ${diff} = ${m1}.\\n3. Task B ends at ${time1}."""`;
    } else {
      sysSolutionSteps = `"""1. The starting time is ${time1}.\\n2. Add ${diff} to the minutes: ${m1} + ${diff} = ${m2}.\\n3. The time is ${time2}."""`;
    }

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = finalAnswer;
      let opt2, opt3, opt4;
      if (unknown === 'diff') {
        opt2 = `${diff + 10} minutes`;
        opt3 = `${diff - 5} minutes`;
        opt4 = `${m1 + m2} minutes`;
      } else {
        const o2m = m1 + 10 > 59 ? m1 : m1 + 10;
        const o3m = m2 + 10 > 59 ? m2 : m2 + 10;
        opt2 = format24h(h, o2m);
        opt3 = format24h(h, o3m);
        opt4 = format24h(h, Math.abs(m2 - m1) + 10);
      }
      
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${askText}"
finalAnswer: "${opt1}"
hint: "${unknown === 'diff' ? 'Find the difference between the minutes.' : unknown === 'start' ? 'Subtract the minutes to find the earlier time.' : 'Add the minutes to find the later time.'}"
solutionSteps: ${sysSolutionSteps}

Generate EXACTLY 4 options:
- "${opt1}"
- "${opt2}"
- "${opt3}"
- "${opt4}"
The defectMap should map the incorrect options to "CALCULATION_ERROR".
`;
    } else {
      if (!isStructure) inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${askText}"
finalAnswer: "${finalAnswer}"
hint: "${unknown === 'diff' ? 'Find the difference between the minutes.' : unknown === 'start' ? 'Subtract the minutes to find the earlier time.' : 'Add the minutes to find the later time.'}"
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  const aiPrompt = systemPrompt + "\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
