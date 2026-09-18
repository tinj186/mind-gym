import { getRandomNames } from '@/lib/utils/variable-bank';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pad0 = (num) => num.toString().padStart(2, '0');

  const names = getRandomNames(2);
  const activitiesList = ['playing', 'reading', 'swimming', 'studying', 'sleeping', 'eating'];
  const name = names[0];
  const name2 = names[1];
  const activity = activitiesList[getRandomInt(0, activitiesList.length - 1)];

  const format12h = (h, m, ampm) => {
    let dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${dh}:${pad0(m)} ${ampm}`;
  };

  const format24h = (h, m) => {
    return `${pad0(h)}${pad0(m)}`;
  };

  if (activeVariant === 'standard_timeline_crossing_hour') {
    const unknown = ['start', 'duration', 'end'][getRandomInt(0, 2)];
    const h1 = getRandomInt(8, 18);
    const m1 = getRandomInt(35, 55);
    const dur = getRandomInt(20, 50);
    
    let totalM = m1 + dur;
    let h2 = h1;
    let m2 = totalM;
    if (totalM >= 60) {
      h2 += 1;
      m2 = totalM - 60;
    }
    
    const start24 = format24h(h1, m1);
    const end24 = format24h(h2, m2);
    
    let askText = "";
    let finalAnswer = "";

    if (unknown === 'start') {
      askText = `An event ended at ${end24}. It lasted ${dur} minutes. When did it start?`;
      finalAnswer = start24;
      if (isStructure) {
        askText = `A swimmer finished training at ${end24}. They trained for ${dur} minutes. At what time did they start? Write your answer using the 24-hour clock.`;
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the minutes backwards to the start of the hour:", "expectedAnswer": "${dur} - ${m2} = ${dur - m2}", "acceptedAnswers": []},
          {"label": "Write the working equation to subtract the remaining minutes from 60:", "expectedAnswer": "60 - ${dur - m2} = ${m1}", "acceptedAnswers": []},
          {"label": "Starting time in 24-hour format:", "expectedAnswer": "${start24}", "acceptedAnswers": ["${start24}"]}
        ]}`;
      }
    } else if (unknown === 'end') {
      askText = `A cake is put in the oven at ${start24}. It bakes for ${dur} minutes. What time in the 24-hour clock is it done?`;
      finalAnswer = end24;
      if (isStructure) {
        askText = `A swimmer started training at ${start24} and trained for ${dur} minutes. At what time did the training end? Write your answer using the 24-hour clock.`;
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the minutes to reach the next hour:", "expectedAnswer": "60 - ${m1} = ${60 - m1}", "acceptedAnswers": []},
          {"label": "Write the working equation to find the remaining minutes to add:", "expectedAnswer": "${dur} - ${60 - m1} = ${m2}", "acceptedAnswers": []},
          {"label": "Finishing time in 24-hour format:", "expectedAnswer": "${end24}", "acceptedAnswers": ["${end24}"]}
        ]}`;
      }
    } else {
      askText = `A show started at ${start24} and finished at ${end24}. How many minutes did it last?`;
      finalAnswer = `${dur} minutes`;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the minutes to reach the next hour:", "expectedAnswer": "60 - ${m1} = ${60 - m1}", "acceptedAnswers": []},
          {"label": "Write the working equation to add the minutes past the hour:", "expectedAnswer": "${60 - m1} + ${m2} = ${dur}", "acceptedAnswers": []},
          {"label": "Total duration in minutes:", "expectedAnswer": "${dur}", "acceptedAnswers": ["${dur}"]}
        ]}`;
      }
    }

    let sysSolutionSteps = ``;
    if (unknown === 'start') {
      sysSolutionSteps = `"""1. End time is ${end24} and duration is ${dur} minutes.\\n2. Minutes back to ${pad0(h2)}00 is ${m2} minutes. Remaining to subtract: ${dur} - ${m2} = ${dur - m2} minutes.\\n3. Subtract from 60: 60 - ${dur - m2} = ${m1}. The start time is ${start24}."""`;
    } else if (unknown === 'end') {
      sysSolutionSteps = `"""1. Start time is ${start24} and duration is ${dur} minutes.\\n2. Minutes to the next hour (${pad0(h2)}00) is 60 - ${m1} = ${60 - m1} minutes.\\n3. Remaining minutes: ${dur} - ${60 - m1} = ${m2}. The end time is ${end24}."""`;
    } else {
      sysSolutionSteps = `"""1. Start time is ${start24} and end time is ${end24}.\\n2. Minutes to next hour (${pad0(h2)}00) is 60 - ${m1} = ${60 - m1}.\\n3. Add minutes past the hour: ${60 - m1} + ${m2} = ${dur}. The duration is ${dur} minutes."""`;
    }

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = finalAnswer;
      let opt2, opt3, opt4;
      if (unknown === 'duration') {
        opt2 = `${dur + 10} minutes`;
        opt3 = `${dur - 10} minutes`;
        opt4 = `${dur + 60} minutes`;
      } else {
        const fakeM2 = m2 + 10 > 59 ? m2 - 10 : m2 + 10;
        const fakeM1 = m1 - 10 < 0 ? m1 + 10 : m1 - 10;
        opt2 = format24h(unknown === 'end' ? h2 : h1, unknown === 'end' ? fakeM2 : fakeM1);
        opt3 = format24h(unknown === 'end' ? h1 : h2, unknown === 'end' ? m2 : m1); // Forgot to roll over hour
        opt4 = format24h(unknown === 'end' ? h2+1 : h1-1, unknown === 'end' ? m2 : m1);
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
hint: "Break the time into parts, jumping to the nearest full hour first."
solutionSteps: ${sysSolutionSteps}

Generate EXACTLY 4 options:
- "${opt1}"
- "${opt2}"
- "${opt3}"
- "${opt4}"
The defectMap should map the incorrect options to "TIME_CROSSING_ERROR".
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
hint: "Break the time into parts, jumping to the nearest full hour first."
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  else if (activeVariant === 'standard_mixed_format_timeline') {
    const unknown = ['start', 'duration', 'end'][getRandomInt(0, 2)];
    const isPm = Math.random() > 0.5;
    const h1 = getRandomInt(1, 10);
    const m1 = getRandomInt(10, 50);
    const dur = getRandomInt(20, 45);
    
    let totalM = m1 + dur;
    let h2 = h1;
    let m2 = totalM;
    if (totalM >= 60) {
      h2 += 1;
      m2 = totalM - 60;
    }
    
    const ampm = isPm ? 'p.m.' : 'a.m.';
    const start12 = format12h(h1, m1, ampm);
    const end12 = format12h(h2, m2, ampm);
    const start24 = format24h(isPm ? h1 + 12 : h1, m1);
    const end24 = format24h(isPm ? h2 + 12 : h2, m2);
    
    let askText = "";
    let finalAnswer = "";

    visualEngineStr = `{
      "componentToRender": "TIMELINE",
      "componentData": {
        "points": [
          {"label": "${unknown === 'start' ? '?' : start12}"},
          {"label": "${unknown === 'end' ? '?' : end24}"}
        ],
        "jumps": [
          {"startIndex": 0, "endIndex": 1, "label": "${unknown === 'duration' ? '?' : dur + ' min'}"}
        ]
      }
    }`;

    if (unknown === 'start') {
      askText = `An event ended at ${end24}. It lasted ${dur} minutes. When did it start in the 12-hour clock?`;
      finalAnswer = start12;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to convert the end time's hour to 12-hour format:", "expectedAnswer": "${isPm ? (h2 + 12) + ' - 12 = ' + h2 : '0'} ", "acceptedAnswers": []},
          {"label": "Write the starting time in 12-hour format:", "expectedAnswer": "${h1}:${pad0(m1)}", "acceptedAnswers": ["${h1}:${pad0(m1)}"]},
          {"label": "Write a.m. or p.m.:", "expectedAnswer": "${ampm}", "acceptedAnswers": []}
        ]}`;
      }
    } else if (unknown === 'end') {
      askText = `A game starts at ${start12} and lasts for ${dur} minutes. Give the end time in the 24-hour clock.`;
      finalAnswer = end24;
      if (isStructure) {
        if (m1 + dur >= 60) {
          inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
            {"label": "Write the working equation to convert the start time's hour to the 24-hour clock:", "expectedAnswer": "${isPm ? h1 + ' + 12 = ' + (h1+12) : h1}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the minutes to reach the next hour:", "expectedAnswer": "60 - ${m1} = ${60 - m1}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the remaining minutes to add:", "expectedAnswer": "${dur} - ${60 - m1} = ${m2}", "acceptedAnswers": []},
            {"label": "Write the end time in 24-hour clock format:", "expectedAnswer": "${end24}", "acceptedAnswers": ["${end24}"]}
          ]}`;
        } else {
          inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
            {"label": "Write the working equation to convert the start time's hour to the 24-hour clock:", "expectedAnswer": "${isPm ? h1 + ' + 12 = ' + (h1+12) : h1}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the final minutes:", "expectedAnswer": "${m1} + ${dur} = ${m2}", "acceptedAnswers": []},
            {"label": "Write the end time in 24-hour clock format:", "expectedAnswer": "${end24}", "acceptedAnswers": ["${end24}"]}
          ]}`;
        }
      }
    } else {
      askText = `A museum tour begins at ${start12} and ends at ${end24}. How many minutes did the tour last?`;
      finalAnswer = `${dur} minutes`;
      if (isStructure) {
        const baseH = isPm ? h1 + 12 : h1;
        if (m1 + dur >= 60) {
          inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
            {"label": "Write the working equation to convert the start time's hour to the 24-hour clock:", "expectedAnswer": "${isPm ? h1 + ' + 12 = ' + baseH : h1}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the minutes to reach the next hour:", "expectedAnswer": "60 - ${m1} = ${60 - m1}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the total duration in minutes:", "expectedAnswer": "${60 - m1} + ${m2} = ${dur}", "acceptedAnswers": []},
            {"label": "Total duration in minutes:", "expectedAnswer": "${dur}", "acceptedAnswers": ["${dur}"]}
          ]}`;
        } else {
          inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
            {"label": "Write the working equation to convert the start time's hour to the 24-hour clock:", "expectedAnswer": "${isPm ? h1 + ' + 12 = ' + baseH : h1}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the duration in minutes:", "expectedAnswer": "${m2} - ${m1} = ${dur}", "acceptedAnswers": []},
            {"label": "Total duration in minutes:", "expectedAnswer": "${dur}", "acceptedAnswers": ["${dur}"]}
          ]}`;
        }
      }
    }

    let sysSolutionSteps = `"""1. Make sure both times are in the same format to calculate easily.\\n2. Calculate the difference or add the duration.\\n3. Format the final answer as requested: ${finalAnswer}."""`;

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = finalAnswer;
      let opt2, opt3, opt4;
      if (unknown === 'duration') {
        opt2 = `${dur + 10} minutes`;
        opt3 = `${dur - 10} minutes`;
        opt4 = `${dur + 60} minutes`;
      } else if (unknown === 'end') {
        opt2 = format24h(isPm ? h2 : h2+12, m2); // wrong am/pm
        opt3 = format12h(h2, m2, ampm); // wrong format
        opt4 = format24h(isPm ? h2+12 : h2, m2+10>59?m2-10:m2+10);
      } else {
        opt2 = format12h(h1, m1, isPm ? 'a.m.' : 'p.m.'); // wrong am/pm
        opt3 = format24h(isPm ? h1+12 : h1, m1); // wrong format
        opt4 = format12h(h1, m1+10>59?m1-10:m1+10, ampm);
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
hint: "Convert one of the times so they are both in the same format before calculating."
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
hint: "Convert one of the times so they are both in the same format before calculating."
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  else if (activeVariant === 'standard_timeline_hours_minutes') {
    const unknown = ['start', 'duration', 'end'][getRandomInt(0, 2)];
    const h1 = getRandomInt(8, 15);
    const m1 = getRandomInt(10, 45);
    const durH = getRandomInt(1, 3);
    const durM = getRandomInt(15, 45);
    
    let totalM = m1 + durM;
    let h2 = h1 + durH;
    let m2 = totalM;
    if (totalM >= 60) {
      h2 += 1;
      m2 = totalM - 60;
    }
    
    const start24 = format24h(h1, m1);
    const end24 = format24h(h2, m2);
    
    let askText = "";
    let finalAnswer = "";

    if (unknown === 'start') {
      askText = `A show ended at ${end24}. It was ${durH} hour(s) ${durM} minutes long. What was the start time?`;
      finalAnswer = start24;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to subtract the hours:", "expectedAnswer": "${h2} - ${durH} = ${h2 - durH}", "acceptedAnswers": []},
          {"label": "Start time in 24-hour clock:", "expectedAnswer": "${start24}", "acceptedAnswers": ["${start24}"]}
        ]}`;
      }
    } else if (unknown === 'end') {
      askText = `A flight departs at ${start24} and takes ${durH} hour(s) ${durM} minutes. Find the arrival time in the 24-hour clock.`;
      finalAnswer = end24;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to add the hours:", "expectedAnswer": "${h1} + ${durH} = ${h1 + durH}", "acceptedAnswers": []},
          {"label": "Arrival time in 24-hour clock:", "expectedAnswer": "${end24}", "acceptedAnswers": ["${end24}"]}
        ]}`;
      }
    } else {
      askText = `${name} cycled from ${start24} to ${end24}. How long did they cycle in hours and minutes?`;
      finalAnswer = `${durH} h ${durM} min`;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the duration in hours to the nearest hour:", "expectedAnswer": "${h2 - (m2<m1?1:0)} - ${h1} = ${durH}", "acceptedAnswers": []},
          {"label": "Write the working equation to find the total minutes from the remaining part:", "expectedAnswer": "${m2 < m1 ? (60-m1+m2) : m2-m1}", "acceptedAnswers": []},
          {"label": "Duration is ${durH} hour(s) and how many minutes?", "expectedAnswer": "${durM}", "acceptedAnswers": ["${durM}"]}
        ]}`;
      }
    }

    let sysSolutionSteps = `"""1. Break the calculation into hours and minutes.\\n2. Calculate the difference or add the duration carefully.\\n3. The result is ${finalAnswer}."""`;

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = finalAnswer;
      let opt2, opt3, opt4;
      if (unknown === 'duration') {
        opt2 = `${durH + 1} h ${durM} min`;
        opt3 = `${durH} h ${durM + 10 > 59 ? durM - 10 : durM + 10} min`;
        opt4 = `${durH - 1 > 0 ? durH - 1 : durH + 2} h ${durM} min`;
      } else {
        const fakeH = unknown === 'end' ? h2 + 1 : h1 - 1;
        opt2 = format24h(fakeH, m2);
        opt3 = format24h(unknown === 'end' ? h2 : h1, m2 + 10 > 59 ? m2 - 10 : m2 + 10);
        opt4 = format24h(unknown === 'end' ? h2 : h1, m1); // wrong minutes
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
hint: "Calculate the hours first, then the minutes."
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
hint: "Calculate the hours first, then the minutes."
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  else if (activeVariant === 'standard_sequential_events') {
    const unknown = ['total', 'end', 'start', 'dur1', 'dur2'][getRandomInt(0, 4)];
    const h1 = getRandomInt(8, 12);
    const m1 = getRandomInt(0, 30);
    const dur1 = getRandomInt(20, 45);
    const dur2 = getRandomInt(20, 45);
    const totalDur = dur1 + dur2;
    
    let m2 = m1 + totalDur;
    let h2 = h1;
    while (m2 >= 60) {
      h2 += 1;
      m2 -= 60;
    }
    
    const start24 = format24h(h1, m1);
    const end24 = format24h(h2, m2);
    
    let askText = "";
    let finalAnswer = "";

    const midM = (m1 + dur1) % 60;
    const midH = h1 + Math.floor((m1 + dur1) / 60);
    const mid24 = format24h(midH, midM);

    visualEngineStr = `{
      "componentToRender": "TIMELINE",
      "componentData": {
        "points": [
          {"label": "${unknown === 'start' ? '?' : start24}"},
          {"label": "?"},
          {"label": "${(unknown === 'end' || unknown === 'total') ? '?' : end24}"}
        ],
        "jumps": [
          {"startIndex": 0, "endIndex": 1, "label": "${unknown === 'dur1' ? '?' : dur1 + ' min'}"},
          {"startIndex": 1, "endIndex": 2, "label": "${unknown === 'dur2' ? '?' : dur2 + ' min'}"}
        ]
      }
    }`;

    let sysSolutionSteps = "";
    let sysHint = "";

    if (unknown === 'total') {
      if (isShort) {
        askText = `Event 1 took ${dur1} minutes and Event 2 took ${dur2} minutes. If they occurred sequentially, what was the total duration in hours and minutes?`;
      } else {
        askText = `STORY: A test starts at ${start24}. Part 1 takes ${dur1} minutes. Part 2 takes ${dur2} minutes. \\n\\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask how long the total test is in hours and minutes.`;
      }
      const finalH = Math.floor(totalDur / 60);
      const finalM = totalDur % 60;
      finalAnswer = `${finalH > 0 ? finalH + ' h ' : ''}${finalM} min`;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the total duration in minutes:", "expectedAnswer": "${dur1} + ${dur2} = ${totalDur}", "acceptedAnswers": []},
          {"label": "Number of full hours in the total duration:", "expectedAnswer": "${finalH}", "acceptedAnswers": ["${finalH}"]},
          {"label": "Remaining minutes:", "expectedAnswer": "${finalM}", "acceptedAnswers": ["${finalM}"]}
        ]}`;
      }
      sysSolutionSteps = `"""1. Total duration = ${dur1} + ${dur2} = ${totalDur} minutes.\\n2. ${totalDur} minutes is ${finalH} hours and ${finalM} minutes.\\n3. The answer is ${finalAnswer}."""`;
      sysHint = "Add the two durations together first to find the total time.";
    } else if (unknown === 'end') {
      if (isShort) {
        askText = `Two sequential events took ${dur1} minutes and ${dur2} minutes respectively. If they started at ${start24}, what time did they end in the 24-hour clock?`;
      } else {
        askText = `STORY: A school assembly started at ${start24}. The principal spoke for ${dur1} minutes, and the awards took ${dur2} minutes. \\n\\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time the assembly ended in the 24-hour clock.`;
      }
      finalAnswer = end24;
      if (isStructure) {
        if (m1 + totalDur >= 60) {
          inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
            {"label": "Write the working equation to find the total duration in minutes:", "expectedAnswer": "${dur1} + ${dur2} = ${totalDur}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the minutes to reach the next hour:", "expectedAnswer": "60 - ${m1} = ${60 - m1}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the remaining minutes to add:", "expectedAnswer": "${totalDur} - ${60 - m1} = ${m2}", "acceptedAnswers": []},
            {"label": "Finishing time in 24-hour format:", "expectedAnswer": "${end24}", "acceptedAnswers": ["${end24}"]}
          ]}`;
        } else {
          inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
            {"label": "Write the working equation to find the total duration in minutes:", "expectedAnswer": "${dur1} + ${dur2} = ${totalDur}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the final minutes:", "expectedAnswer": "${m1} + ${totalDur} = ${m2}", "acceptedAnswers": []},
            {"label": "Finishing time in 24-hour format:", "expectedAnswer": "${end24}", "acceptedAnswers": ["${end24}"]}
          ]}`;
        }
      }
      sysSolutionSteps = `"""1. Total duration = ${dur1} + ${dur2} = ${totalDur} minutes.\\n2. Start time + ${totalDur} minutes = ${end24}.\\n3. The answer is ${finalAnswer}."""`;
      sysHint = "Add the two durations together first, then find the end time.";
    } else if (unknown === 'start') {
      if (isShort) {
        askText = `Two sequential events took ${dur1} minutes and ${dur2} minutes respectively. If they ended at ${end24}, what time did they start in the 24-hour clock?`;
      } else {
        askText = `STORY: A school assembly ended at ${end24}. The principal spoke for ${dur1} minutes, and the awards took ${dur2} minutes. \\n\\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time the assembly started in the 24-hour clock.`;
      }
      finalAnswer = start24;
      if (isStructure) {
        if (m2 - totalDur < 0) {
          inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
            {"label": "Write the working equation to find the total duration in minutes:", "expectedAnswer": "${dur1} + ${dur2} = ${totalDur}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the minutes backwards to the start of the hour:", "expectedAnswer": "${totalDur} - ${m2} = ${totalDur - m2}", "acceptedAnswers": []},
            {"label": "Write the working equation to subtract the remaining minutes from 60:", "expectedAnswer": "60 - ${totalDur - m2} = ${m1}", "acceptedAnswers": []},
            {"label": "Starting time in 24-hour format:", "expectedAnswer": "${start24}", "acceptedAnswers": ["${start24}"]}
          ]}`;
        } else {
          inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
            {"label": "Write the working equation to find the total duration in minutes:", "expectedAnswer": "${dur1} + ${dur2} = ${totalDur}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the starting minutes:", "expectedAnswer": "${m2} - ${totalDur} = ${m1}", "acceptedAnswers": []},
            {"label": "Starting time in 24-hour format:", "expectedAnswer": "${start24}", "acceptedAnswers": ["${start24}"]}
          ]}`;
        }
      }
      sysSolutionSteps = `"""1. Total duration = ${dur1} + ${dur2} = ${totalDur} minutes.\\n2. Go backwards ${totalDur} minutes from ${end24}.\\n3. The starting time is ${start24}."""`;
      sysHint = "Add the two durations together first, then go backwards from the end time.";
    } else { // dur1 or dur2
      const isDur1 = unknown === 'dur1';
      const knownDur = isDur1 ? dur2 : dur1;
      const unkDur = isDur1 ? dur1 : dur2;
      
      if (isShort) {
        askText = `Two sequential events started at ${start24} and ended at ${end24}. The ${isDur1 ? 'second' : 'first'} event took ${knownDur} minutes. How many minutes did the ${isDur1 ? 'first' : 'second'} event take?`;
      } else {
        const actor1 = "The principal spoke";
        const actor2 = "the awards took";
        const knownText = isDur1 ? `${actor2} for ${knownDur} minutes.` : `${actor1} for ${knownDur} minutes.`;
        const askUnknownText = isDur1 ? "How many minutes did the principal speak for?" : "How many minutes did the awards take?";

        askText = `STORY: A school assembly started at ${start24} and ended at ${end24}. ${knownText} \\n\\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask ${askUnknownText}`;
      }

      finalAnswer = `${unkDur} min`;
      if (isStructure) {
        if (m1 + totalDur >= 60) { // meaning hour crossed
          inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
            {"label": "Write the working equation to find the minutes to reach the next hour:", "expectedAnswer": "60 - ${m1} = ${60 - m1}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the total duration in minutes:", "expectedAnswer": "${60 - m1} + ${m2} = ${totalDur}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the unknown duration:", "expectedAnswer": "${totalDur} - ${knownDur} = ${unkDur}", "acceptedAnswers": []},
            {"label": "Final answer in minutes:", "expectedAnswer": "${unkDur}", "acceptedAnswers": ["${unkDur}"]}
          ]}`;
        } else { // did not cross hour
          inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
            {"label": "Write the working equation to find the total duration in minutes:", "expectedAnswer": "${m2} - ${m1} = ${totalDur}", "acceptedAnswers": []},
            {"label": "Write the working equation to find the unknown duration:", "expectedAnswer": "${totalDur} - ${knownDur} = ${unkDur}", "acceptedAnswers": []},
            {"label": "Final answer in minutes:", "expectedAnswer": "${unkDur}", "acceptedAnswers": ["${unkDur}"]}
          ]}`;
        }
      }
      sysSolutionSteps = `"""1. Find total time from ${start24} to ${end24}, which is ${totalDur} minutes.\\n2. Total time - known part = ${totalDur} - ${knownDur} = ${unkDur} minutes.\\n3. The answer is ${unkDur} min."""`;
      sysHint = "Find the total duration first, then subtract the part you already know.";
    }

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = finalAnswer;
      let opt2, opt3, opt4;
      if (unknown === 'total') {
        opt2 = `${totalDur + 10} min`;
        opt3 = `${Math.floor((totalDur+60)/60)} h ${totalDur%60} min`;
        opt4 = `${dur1} min`;
      } else if (unknown === 'end') {
        opt2 = format24h(h2, m2 + 10 > 59 ? m2 - 10 : m2 + 10);
        opt3 = format24h(h2 + 1, m2);
        opt4 = format24h(h2, m2 - 10 < 0 ? m2 + 10 : m2 - 10);
      } else if (unknown === 'start') {
        opt2 = format24h(h1, m1 + 10 > 59 ? m1 - 10 : m1 + 10);
        opt3 = format24h(h1 - 1 < 0 ? 23 : h1 - 1, m1);
        opt4 = format24h(h1, m1 - 10 < 0 ? m1 + 10 : m1 - 10);
      } else {
        const unk = unknown === 'dur1' ? dur1 : dur2;
        opt2 = `${unk + 10} min`;
        opt3 = `${Math.abs(unk - 10)} min`;
        opt4 = `${unk + 5} min`;
      }
      
      const storyInstruction = `STORY INSTRUCTION: 
      1. If the questionText starts with "STORY:", rewrite it into a creative Singaporean math story for a Primary 3 student. 
      2. Preserve exact mathematical values, times, and operations.
      3. NEVER add extra unrequested questions. Keep the final question sentence exactly as requested.
      4. CRITICAL: DO NOT include the word "STORY:" or any other prefixes in your final generated questionText.
      5. CRITICAL: DO NOT modify any other fields in the JSON template except inserting the story.
      ${isShort ? '\\n    CRITICAL STRICT RULE: This is a SHORT QUESTION. You MUST provide a direct mathematical question exactly as provided. DO NOT generate ANY story context, NO names, NO scenarios, and NO characters.' : ''}`;

      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

${storyInstruction}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${askText}"
finalAnswer: "${opt1}"
hint: "${sysHint}"
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
      
      const storyInstruction = `STORY INSTRUCTION: 
      1. If the questionText starts with "STORY:", rewrite it into a creative Singaporean math story for a Primary 3 student. 
      2. Preserve exact mathematical values, times, and operations.
      3. NEVER add extra unrequested questions. Keep the final question sentence exactly as requested.
      4. CRITICAL: DO NOT include the word "STORY:" or any other prefixes in your final generated questionText.
      5. CRITICAL: DO NOT modify any other fields in the JSON template except inserting the story.
      ${isShort ? '\\n    CRITICAL STRICT RULE: This is a SHORT QUESTION. You MUST provide a direct mathematical question exactly as provided. DO NOT generate ANY story context, NO names, NO scenarios, and NO characters.' : ''}`;

      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

${storyInstruction}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${askText}"
finalAnswer: "${finalAnswer}"
hint: "${sysHint}"
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  else if (activeVariant === 'standard_constant_difference') {
    const isAfter = Math.random() > 0.5;
    const h1 = getRandomInt(10, 16);
    const m1 = getRandomInt(0, 30);
    const dur = getRandomInt(40, 55);
    const diff = getRandomInt(15, 30);
    
    // Person A
    let aTotalM = m1 + dur;
    let aH2 = h1;
    let aM2 = aTotalM;
    while (aM2 >= 60) {
      aH2 += 1;
      aM2 -= 60;
    }
    const aStart24 = format24h(h1, m1);
    const aEnd24 = format24h(aH2, aM2);
    
    // Person B
    let bM1 = m1 + (isAfter ? diff : -diff);
    let bH1 = h1;
    if (bM1 < 0) {
      bH1 -= 1;
      bM1 += 60;
    } else if (bM1 >= 60) {
      bH1 += 1;
      bM1 -= 60;
    }
    
    let bTotalM = bM1 + dur;
    let bH2 = bH1;
    let bM2 = bTotalM;
    while (bM2 >= 60) {
      bH2 += 1;
      bM2 -= 60;
    }
    
    const bEnd24 = format24h(bH2, bM2);
    
    let askText = "";
    if (isShort) {
      askText = `Event A started at ${aStart24} and lasted for ${dur} minutes. Event B started ${diff} minutes ${isAfter ? 'later' : 'earlier'} than Event A and lasted for the same duration. What time did Event B finish?`;
    } else {
      askText = `STORY: ${name} starts ${activity} for ${dur} minutes at ${aStart24}. ${name2} does the exact same activity, but starts ${diff} minutes ${isAfter ? 'later' : 'earlier'} than ${name}. \\n\\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time ${name2} finished in the 24-hour clock.`;
    }
    let finalAnswer = bEnd24;

    visualEngineStr = `{
      "componentToRender": "NONE",
      "componentData": {
        "hideVisual": true,
        "modelDescription": "A comparison showing that ${name2} starts ${diff} minutes ${isAfter ? 'later' : 'earlier'} than ${name}."
      }
    }`;

    if (isStructure) {
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        {"label": "Write the working equation to find ${name2}'s starting minutes:", "expectedAnswer": "${m1} ${isAfter ? '+' : '-'} ${diff} = ${bM1}", "acceptedAnswers": []},
        {"label": "Write the working equation to find the total minutes from ${name2}'s start to end:", "expectedAnswer": "${bM1} + ${dur} = ${bTotalM}", "acceptedAnswers": []},
        {"label": "${name2}'s finishing time in 24-hour format:", "expectedAnswer": "${bEnd24}", "acceptedAnswers": ["${bEnd24}"]}
      ]}`;
    }

    let sysSolutionSteps = `"""1. ${name2} starts ${diff} minutes ${isAfter ? 'later' : 'earlier'} than ${name}.\\n2. Calculate ${name2}'s start time.\\n3. Add ${dur} minutes to ${name2}'s start time to find the end time: ${bEnd24}."""`;

    const storyInstruction = `STORY INSTRUCTION: 
    1. If the questionText starts with "STORY:", rewrite it into a creative Singaporean math story for a Primary 3 student. 
    2. Preserve exact mathematical values, times, and operations.
    3. NEVER add extra unrequested questions. Keep the final question sentence exactly as requested.
    4. CRITICAL: DO NOT include the word "STORY:" or any other prefixes in your final generated questionText.
    5. CRITICAL: DO NOT modify any other fields in the JSON template except inserting the story.
    ${isShort ? '\\n    CRITICAL STRICT RULE: This is a SHORT QUESTION. You MUST provide a direct mathematical question exactly as provided. DO NOT generate ANY story context, NO names, NO scenarios, and NO characters.' : ''}`;

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = finalAnswer;
      let opt2 = format24h(aH2, aM2); // A's end time
      let opt3 = format24h(bH2, bM2 + 10 >= 60 ? bM2 - 10 : bM2 + 10);
      let opt4 = format24h(bH2 + (isAfter ? -1 : 1), bM2);
      
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

${storyInstruction}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${askText}"
finalAnswer: "${opt1}"
hint: "Find ${name2}'s start time first, then add the duration."
solutionSteps: ${sysSolutionSteps}

Generate EXACTLY 4 options:
- "${opt1}"
- "${opt2}"
- "${opt3}"
- "${opt4}"
The defectMap should map the incorrect options to "TIMELINE_OFFSET_ERROR".
`;
    } else {
      if (!isStructure) inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

${storyInstruction}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${askText}"
finalAnswer: "${finalAnswer}"
hint: "Find ${name2}'s start time first, then add the duration."
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  const aiPrompt = systemPrompt + "\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
