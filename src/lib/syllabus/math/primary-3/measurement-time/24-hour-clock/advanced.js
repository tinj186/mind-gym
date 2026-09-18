import { getRandomNames, getOverlappingVenues } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pad0 = (num) => num.toString().padStart(2, '0');

  const names = getRandomNames(2);
  const activitiesList = ['playing', 'reading', 'swimming', 'studying', 'sleeping', 'eating'];
  const name = names[0];
  const activity = activitiesList[getRandomInt(0, activitiesList.length - 1)];

  const format24h = (h, m) => {
    let dh = h >= 24 ? h - 24 : h;
    return `${pad0(dh)}${pad0(m)}`;
  };

  if (activeVariant === 'advanced_timeline_crossing_noon') {
    const unknown = ['start', 'duration', 'end'][getRandomInt(0, 2)];
    const h1 = 11;
    const m1 = getRandomInt(10, 50);
    const durH = getRandomInt(1, 2);
    const durM = getRandomInt(10, 45);
    const dur = durH * 60 + durM;
    
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
      askText = `A seminar ends at ${end24} and lasts ${durH} hours ${durM} minutes. What is the start time?`;
      finalAnswer = start24;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to subtract the hours:", "expectedAnswer": "${h2} - ${durH} = ${h2 - durH}", "acceptedAnswers": []},
          {"label": "Write the working equation to subtract the minutes backwards across the hour:", "expectedAnswer": "60 - (${durM} - ${m2}) = ${m1}", "acceptedAnswers": []},
          {"label": "Starting time in 24-hour clock:", "expectedAnswer": "${start24}", "acceptedAnswers": ["${start24}"]}
        ]}`;
      }
    } else if (unknown === 'end') {
      askText = `A seminar starts at ${start24} and lasts ${durH} hours ${durM} minutes. What is the end time?`;
      finalAnswer = end24;
      if (isStructure) {
        askText = `A hiking trail begins at ${start24}. The hikers walk for ${durH} hours ${durM} minutes. At what time do they finish the trail? Give your answer in the 24-hour clock.`;
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the time ${durH} hours after ${start24}:", "expectedAnswer": "${h1} + ${durH} = ${h1 + durH}", "acceptedAnswers": []},
          {"label": "Write the working equation to find the minutes to reach the next hour (${pad0(h1 + durH + 1)}00):", "expectedAnswer": "60 - ${m1} = ${60 - m1}", "acceptedAnswers": []},
          {"label": "Write the working equation to find the remaining minutes to add past ${pad0(h1 + durH + 1)}00:", "expectedAnswer": "${durM} - ${60 - m1} = ${m2}", "acceptedAnswers": []},
          {"label": "Finishing time in 24-hour format:", "expectedAnswer": "${end24}", "acceptedAnswers": ["${end24}"]}
        ]}`;
      }
    } else {
      askText = `A show started at ${start24} and finished at ${end24}. How long was the show?`;
      finalAnswer = `${durH} h ${durM} min`;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the duration in hours to the nearest hour:", "expectedAnswer": "${h2 - (m2<m1?1:0)} - ${h1} = ${durH}", "acceptedAnswers": []},
          {"label": "Write the working equation to find the total minutes from the remaining part:", "expectedAnswer": "${m2 < m1 ? (60-m1+m2) : m2-m1}", "acceptedAnswers": []},
          {"label": "Duration is ${durH} hour(s) and how many minutes?", "expectedAnswer": "${durM}", "acceptedAnswers": ["${durM}"]}
        ]}`;
      }
    }

    let sysSolutionSteps = `"""1. Carefully calculate the hours and minutes across the 1200 boundary.\\n2. Remember that 24-hour clock continues to 1300, 1400 etc.\\n3. The result is ${finalAnswer}."""`;

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = finalAnswer;
      let opt2, opt3, opt4;
      if (unknown === 'duration') {
        opt2 = `${durH + 1} h ${durM} min`;
        opt3 = `${durH} h ${durM + 10} min`;
        opt4 = `${durH} h ${durM - 5 > 0 ? durM - 5 : durM + 5} min`;
      } else {
        const fakeH = h2 - 12 > 0 ? h2 - 12 : h2;
        opt2 = format24h(fakeH, m2); // Used 12-hour hour instead of 13+
        opt3 = format24h(h2, m2 + 10 > 59 ? m2 - 10 : m2 + 10);
        opt4 = format24h(h1, m1); // Distractor
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
hint: "Remember that the hour after 1200 in the 24-hour clock is 1300."
solutionSteps: ${sysSolutionSteps}

Generate EXACTLY 4 options:
- "${opt1}"
- "${opt2}"
- "${opt3}"
- "${opt4}"
The defectMap should map the incorrect options to "CROSSING_NOON_ERROR".
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
hint: "Remember that the hour after 1200 in the 24-hour clock is 1300."
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  else if (activeVariant === 'advanced_timeline_crossing_midnight') {
    const unknown = ['start', 'duration', 'end'][getRandomInt(0, 2)];
    const h1 = getRandomInt(22, 23);
    const m1 = getRandomInt(10, 50);
    const durH = getRandomInt(1, 3);
    const durM = getRandomInt(10, 45);
    const dur = durH * 60 + durM;
    
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
      askText = `A night shift ends at ${end24} and lasts ${durH} hours ${durM} minutes. What time did it start?`;
      finalAnswer = start24;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find minutes back to midnight:", "expectedAnswer": "60 + ${m2} = ${60+m2}", "acceptedAnswers": []},
          {"label": "Write the working equation to subtract the remaining hours:", "expectedAnswer": "24 - ${durH - (m1>m2?0:1)} = ${h1}", "acceptedAnswers": []},
          {"label": "Starting time in 24-hour clock:", "expectedAnswer": "${start24}", "acceptedAnswers": ["${start24}"]}
        ]}`;
      }
    } else if (unknown === 'end') {
      askText = `A night shift starts at ${start24} and lasts ${durH} hours ${durM} minutes. What time does it end?`;
      finalAnswer = end24;
      if (isStructure) {
        askText = `A late-night movie started at ${start24}. The movie was ${durH} hours ${durM} minutes long. What time did the movie end?`;
        const minToMidnight = 60 - m1;
        const durTotal = durH * 60 + durM;
        const remainMins = durTotal - minToMidnight;
        const remainH = Math.floor(remainMins / 60);
        const finalMins = remainMins % 60;
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find how many minutes are needed to reach midnight (0000):", "expectedAnswer": "60 - ${m1} = ${minToMidnight}", "acceptedAnswers": []},
          {"label": "Write the working equation to subtract those ${minToMidnight} minutes from the total movie duration (${durTotal} mins):", "expectedAnswer": "${durTotal} - ${minToMidnight} = ${remainMins}", "acceptedAnswers": []},
          {"label": "Number of full hours in the remaining ${remainMins} minutes:", "expectedAnswer": "${remainH}", "acceptedAnswers": ["${remainH}"]},
          {"label": "Write the working equation to find the remaining minutes past ${pad0(remainH)}00:", "expectedAnswer": "${remainMins} - ${remainH * 60} = ${finalMins}", "acceptedAnswers": []},
          {"label": "Finishing time in 24-hour format:", "expectedAnswer": "${end24}", "acceptedAnswers": ["${end24}"]}
        ]}`;
      }
    } else {
      askText = `A train departs at ${start24} and arrives at ${end24} the next day. How long was the journey?`;
      finalAnswer = `${durH} h ${durM} min`;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find minutes to midnight:", "expectedAnswer": "60 - ${m1} = ${60-m1}", "acceptedAnswers": []},
          {"label": "Write the working equation to find the duration in hours past midnight:", "expectedAnswer": "${h2 >= 24 ? h2-24 : h2}", "acceptedAnswers": []},
          {"label": "Duration is ${durH} hour(s) and how many minutes?", "expectedAnswer": "${durM}", "acceptedAnswers": ["${durM}"]}
        ]}`;
      }
    }

    let sysSolutionSteps = `"""1. Carefully calculate the hours and minutes across the midnight boundary (2400 or 0000).\\n2. Time resets to 0000 after 2359.\\n3. The result is ${finalAnswer}."""`;

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = finalAnswer;
      let opt2, opt3, opt4;
      if (unknown === 'duration') {
        opt2 = `${durH + 1} h ${durM} min`;
        opt3 = `${durH} h ${durM + 10} min`;
        opt4 = `${durH} h ${durM - 5 > 0 ? durM - 5 : durM + 5} min`;
      } else {
        const fakeH = h2;
        opt2 = `${pad0(fakeH)}${pad0(m2)}`; // e.g. 2505 (didn't reset)
        opt3 = format24h(h2, m2 + 10 > 59 ? m2 - 10 : m2 + 10);
        opt4 = format24h(h2 > 24 ? h2-24-1 : 23, m2);
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
hint: "Remember that time resets to 0000 after 2359."
solutionSteps: ${sysSolutionSteps}

Generate EXACTLY 4 options:
- "${opt1}"
- "${opt2}"
- "${opt3}"
- "${opt4}"
The defectMap should map the incorrect options to "CROSSING_MIDNIGHT_ERROR".
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
hint: "Remember that time resets to 0000 after 2359."
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  else if (activeVariant === 'advanced_offset_delayed_timeline') {
    const unknown = ['end', 'delay'][getRandomInt(0, 1)];
    const h1 = getRandomInt(10, 18);
    const m1 = getRandomInt(0, 50);
    const durH = getRandomInt(1, 2);
    const durM = getRandomInt(10, 45);
    const delay = getRandomInt(15, 40);
    
    const durTotal = durH * 60 + durM;
    const finalTotal = durTotal + delay;
    
    let m2 = m1 + finalTotal;
    let h2 = h1;
    while (m2 >= 60) {
      h2 += 1;
      m2 -= 60;
    }
    
    const start24 = format24h(h1, m1);
    const end24 = format24h(h2, m2);
    
    let askText = "";
    let finalAnswer = "";

    visualEngineStr = `{
      "componentToRender": "TIMELINE",
      "componentData": {
        "points": [
          {"label": "${start24}"},
          {"label": "?"},
          {"label": "${unknown === 'end' ? '?' : end24}"}
        ],
        "jumps": [
          {"startIndex": 0, "endIndex": 1, "label": "${durH > 0 ? durH + 'h ' : ''}${durM}m"},
          {"startIndex": 1, "endIndex": 2, "label": "${unknown === 'delay' ? '?' : delay + 'm'}"}
        ]
      }
    }`;

    if (unknown === 'delay') {
      askText = `A flight leaves at ${start24}. The journey is usually ${durH} hours ${durM} minutes. It arrived at ${end24}. How long was the delay in minutes?`;
      finalAnswer = `${delay} minutes`;
      if (isStructure) {
        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the total time taken in minutes:", "expectedAnswer": "(${h2}-${h1})*60 + ${m2} - ${m1} = ${finalTotal}", "acceptedAnswers": []},
          {"label": "Write the working equation to find the delay:", "expectedAnswer": "${finalTotal} - ${durTotal} = ${delay}", "acceptedAnswers": []},
          {"label": "Delay in minutes:", "expectedAnswer": "${delay}", "acceptedAnswers": ["${delay}"]}
        ]}`;
      }
    } else {
      askText = `A flight leaves at ${start24}. The journey is ${durH} hours ${durM} minutes. It is delayed by ${delay} minutes. What is the new arrival time?`;
      finalAnswer = end24;
      if (isStructure) {
        askText = `A train departs at ${start24}. The journey usually takes ${durH} hours ${durM} minutes, but due to heavy rain, the train arrived ${delay} minutes late. What time did the train arrive in the 24-hour clock?`;
        
        let mToNext = 60 - m1;
        let rMins = finalTotal - mToNext;
        let rHours = Math.floor(rMins / 60);
        let finalMins = rMins % 60;

        inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
          {"label": "Write the working equation to find the total time taken in minutes (${durH} h ${durM} m + ${delay} m):", "expectedAnswer": "${durTotal} + ${delay} = ${finalTotal}", "acceptedAnswers": []},
          {"label": "Write the working equation to find the minutes to reach the next hour from ${start24}:", "expectedAnswer": "60 - ${m1} = ${mToNext}", "acceptedAnswers": []},
          {"label": "Write the working equation to subtract those ${mToNext} minutes from the total time:", "expectedAnswer": "${finalTotal} - ${mToNext} = ${rMins}", "acceptedAnswers": []},
          {"label": "Number of hours to add after ${pad0(h1 + 1)}00:", "expectedAnswer": "${rHours}", "acceptedAnswers": ["${rHours}"]},
          {"label": "Write the working equation to find the remaining minutes past ${pad0(h1 + 1 + rHours)}00:", "expectedAnswer": "${rMins} - ${rHours * 60} = ${finalMins}", "acceptedAnswers": []},
          {"label": "Arrival time in 24-hour format:", "expectedAnswer": "${end24}", "acceptedAnswers": ["${end24}"]}
        ]}`;
      }
    }

    let sysSolutionSteps = `"""1. Find the total time taken by adding the planned duration and the delay.\\n2. Then add the total time to the start time.\\n3. The answer is ${finalAnswer}."""`;

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = finalAnswer;
      let opt2, opt3, opt4;
      if (unknown === 'delay') {
        opt2 = `${delay + 10} minutes`;
        opt3 = `${delay - 10 > 0 ? delay - 10 : delay + 5} minutes`;
        opt4 = `${durM + delay} minutes`;
      } else {
        opt2 = format24h(h1 + durH, m1 + durM > 59 ? m1 + durM - 60 : m1 + durM); // Forgot delay
        opt3 = format24h(h2, m2 + 10 > 59 ? m2 - 10 : m2 + 10);
        opt4 = format24h(h2 + 1, m2);
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
hint: "Add the planned duration and the delay to find the total time taken."
solutionSteps: ${sysSolutionSteps}

Generate EXACTLY 4 options:
- "${opt1}"
- "${opt2}"
- "${opt3}"
- "${opt4}"
The defectMap should map the incorrect options to "DELAY_CALCULATION_ERROR".
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
hint: "Add the planned duration and the delay to find the total time taken."
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  else if (activeVariant === 'advanced_hidden_break_deduction') {
    const h1 = getRandomInt(8, 14);
    const m1 = getRandomInt(10, 50);
    const workH = getRandomInt(2, 4);
    const workM = getRandomInt(0, 45);
    const breakM = getRandomInt(30, 60);
    
    const actualWorkMins = workH * 60 + workM;
    const totalElapsedMins = actualWorkMins + breakM;
    
    let m2 = m1 + totalElapsedMins;
    let h2 = h1;
    while (m2 >= 60) {
      h2 += 1;
      m2 -= 60;
    }
    
    const start24 = format24h(h1, m1);
    const end24 = format24h(h2, m2);
    
    let askText = `Work starts at ${start24} and ends at ${end24}. There is a ${breakM}-minute break. What is the actual working time?`;
    let finalAnswer = `${workH > 0 ? workH + ' h ' : ''}${workM > 0 ? workM + ' min' : (workH === 0 ? '0 min' : '')}`.trim();

    visualEngineStr = `{
      "componentToRender": "TIMELINE",
      "componentData": {
        "points": [
          {"label": "${start24}"},
          {"label": "?"},
          {"label": "${end24}"}
        ],
        "jumps": [
          {"startIndex": 0, "endIndex": 1, "label": "? h"},
          {"startIndex": 1, "endIndex": 2, "label": "? min"}
        ]
      }
    }`;

    const elapsedH = Math.floor(totalElapsedMins / 60);
    const elapsedM = totalElapsedMins % 60;

    if (isStructure) {
      askText = `${name} studied from ${start24} to ${end24}. During this time, they took a ${breakM}-minute screen break. How much time did they actually spend studying? Give your answer in hours and minutes.`;
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        {"label": "Number of full hours elapsed on the timeline:", "expectedAnswer": "${elapsedH}", "acceptedAnswers": ["${elapsedH}"]},
        {"label": "Number of remaining minutes elapsed on the timeline:", "expectedAnswer": "${elapsedM}", "acceptedAnswers": ["${elapsedM}"]},
        {"label": "Total elapsed time in minutes:", "expectedAnswer": "${totalElapsedMins}", "acceptedAnswers": ["${totalElapsedMins}"]},
        {"label": "Write the working equation to subtract the break time from the total elapsed time:", "expectedAnswer": "${totalElapsedMins} - ${breakM} = ${actualWorkMins}", "acceptedAnswers": []},
        {"label": "Number of full hours in the actual study time:", "expectedAnswer": "${workH}", "acceptedAnswers": ["${workH}"]},
        {"label": "Number of remaining minutes in the actual study time:", "expectedAnswer": "${workM}", "acceptedAnswers": ["${workM}"]}
      ]}`;
    }

    let sysSolutionSteps = `"""1. Use the timeline to find the total elapsed time: ${elapsedH} h ${elapsedM} min, which is ${totalElapsedMins} mins.\\n2. Subtract the break time (${breakM} mins) from the total elapsed time.\\n3. ${totalElapsedMins} - ${breakM} = ${actualWorkMins} mins, which is ${finalAnswer}."""`;

    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = finalAnswer;
      let opt2 = `${Math.floor(totalElapsedMins/60)} h ${totalElapsedMins%60} min`; // Forgot to subtract break
      let opt3 = `${workH} h ${workM + 10 > 59 ? workM - 10 : workM + 10} min`;
      let opt4 = `${workH > 0 ? workH - 1 : workH + 1} h ${workM} min`;
      
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below.
Use EXACTLY:
questionText: "${askText}"
finalAnswer: "${opt1}"
hint: "Find the total time from start to end first, then subtract the break time."
solutionSteps: ${sysSolutionSteps}

Generate EXACTLY 4 options:
- "${opt1}"
- "${opt2}"
- "${opt3}"
- "${opt4}"
The defectMap should map the incorrect options to "HIDDEN_BREAK_ERROR".
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
hint: "Find the total time from start to end first, then subtract the break time."
solutionSteps: ${sysSolutionSteps}
`;
    }
  }

  else if (activeVariant === 'advanced_overlapping_events') {
    let hA1, mA1, endA_H, endA_M, hB1, mB1, hB2, mB2;
    let askText = "";
    let finalAnswer = "";
    
    if (isStructure) {
      hA1 = getRandomInt(8, 9);
      mA1 = getRandomInt(1, 3) * 15;
      endA_H = getRandomInt(12, 14);
      endA_M = 0;
      hB1 = getRandomInt(10, 11);
      mB1 = getRandomInt(1, 3) * 15;
      hB2 = getRandomInt(15, 17);
      mB2 = getRandomInt(1, 3) * 15;
      
      const startA24 = format24h(hA1, mA1);
      const endA24 = format24h(endA_H, endA_M);
      const startB24 = format24h(hB1, mB1);
      const endB24 = format24h(hB2, mB2);
      
      const overlapH = endA_H - hB1 - 1;
      const overlapM = 60 - mB1;
      
      const venues = getOverlappingVenues();
      askText = `STORY: The ${venues[0]} is open from ${startA24} to ${endA24}. The ${venues[1]} is open from ${startB24} to ${endB24}. For how long are both the ${venues[0]} and the ${venues[1]} open at the same time?`;
      
      const nextHourB = hB1 + 1;
      
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        {"label": "Which is the later start time? (Type the time in 24-hour format):", "expectedAnswer": "${startB24}", "acceptedAnswers": []},
        {"label": "Which is the earlier end time? (Type the time in 24-hour format):", "expectedAnswer": "${endA24}", "acceptedAnswers": []},
        {"label": "Write the working equation to find the number of minutes to the next hour:", "expectedAnswer": "60 - ${mB1} = ${overlapM}", "acceptedAnswers": []},
        {"label": "Number of full hours in the overlapping time:", "expectedAnswer": "${overlapH}", "acceptedAnswers": ["${overlapH}"]},
        {"label": "Number of minutes in the overlapping time:", "expectedAnswer": "${overlapM}", "acceptedAnswers": ["${overlapM}"]}
      ]}`;
      
      finalAnswer = `${overlapH > 0 ? overlapH + ' h ' : ''}${overlapM} min`.trim();
    } else {
      hA1 = getRandomInt(8, 19);
      mA1 = getRandomInt(0, 3) * 15;
      const durA = getRandomInt(60, 180); 
      
      let endATot = hA1 * 60 + mA1 + durA;
      endA_H = Math.floor(endATot / 60);
      endA_M = endATot % 60;
      
      const bOffset = getRandomInt(30, 90);
      let bStartTot = hA1 * 60 + mA1 + bOffset;
      hB1 = Math.floor(bStartTot / 60);
      mB1 = bStartTot % 60;
      
      const bEndOffset = getRandomInt(30, 90);
      let bEndTot = endATot + bEndOffset;
      hB2 = Math.floor(bEndTot / 60);
      mB2 = bEndTot % 60;
      
      const startA24 = format24h(hA1, mA1);
      const endA24 = format24h(endA_H, endA_M);
      const startB24 = format24h(hB1, mB1);
      const endB24 = format24h(hB2, mB2);
      
      const overlapTotalMins = endATot - bStartTot;
      const overlapH = Math.floor(overlapTotalMins / 60);
      const overlapM = overlapTotalMins % 60;
      
      const venues = getOverlappingVenues();
      
      if (isShort) {
        askText = `STORY: The ${venues[0]} is open from ${startA24} to ${endA24}. The ${venues[1]} is open from ${startB24} to ${endB24}. How many minutes are both open at the same time?`;
        finalAnswer = `${overlapTotalMins} minutes`;
      } else {
        askText = `STORY: The ${venues[0]} opens ${startA24}-${endA24}. The ${venues[1]} opens ${startB24}-${endB24}. How long are both open at the same time?`;
        finalAnswer = `${overlapH > 0 ? overlapH + ' h ' : ''}${overlapM > 0 ? overlapM + ' min' : (overlapH === 0 ? '0 min' : '')}`.trim();
      }
      
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }
    
    let sysSolutionSteps = `"""1. Find the latest start time.\\n2. Find the earliest end time.\\n3. Calculate the duration between these two times to find the overlap.\\n4. The answer is ${finalAnswer}."""`;
    
    if (isMCQ) {
      inputRequirementStr = `null`;
      let opt1 = finalAnswer;
      
      let overlapTotalMins = (endA_H*60 + endA_M) - (hB1*60 + mB1);
      let fakeH1 = Math.floor((overlapTotalMins + 60) / 60);
      let fakeM1 = (overlapTotalMins + 60) % 60;
      let opt2 = `${fakeH1 > 0 ? fakeH1 + ' h ' : ''}${fakeM1 > 0 ? fakeM1 + ' min' : (fakeH1 === 0 ? '0 min' : '')}`.trim();
      
      let fakeH2 = Math.floor((overlapTotalMins + 30) / 60);
      let fakeM2 = (overlapTotalMins + 30) % 60;
      let opt3 = `${fakeH2 > 0 ? fakeH2 + ' h ' : ''}${fakeM2 > 0 ? fakeM2 + ' min' : (fakeH2 === 0 ? '0 min' : '')}`.trim();
      
      let fakeH3 = Math.floor(Math.abs(overlapTotalMins - 30) / 60);
      let fakeM3 = Math.abs(overlapTotalMins - 30) % 60;
      let opt4 = `${fakeH3 > 0 ? fakeH3 + ' h ' : ''}${fakeM3 > 0 ? fakeM3 + ' min' : (fakeH3 === 0 ? '0 min' : '')}`.trim();
      
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below EXCEPT for questionText. For questionText, you must rewrite the provided "STORY:" into a creative math word problem. 
1. Preserve the exact mathematical values, times, and operations.
2. NEVER add extra unrequested questions.
3. Keep the final question sentence exactly as provided.
4. DO NOT include the word "STORY:" in your final output.

Use EXACTLY:
finalAnswer: "${opt1}"
hint: "Identify the latest start time and earliest end time, then find the duration between them."
solutionSteps: ${sysSolutionSteps}

Base your question on this:
questionText: "${askText}"

Generate EXACTLY 4 options:
- "${opt1}"
- "${opt2}"
- "${opt3}"
- "${opt4}"
The defectMap should map the incorrect options to "OVERLAP_CALCULATION_ERROR".
`;
    } else {
      systemPrompt = `
You are generating a Primary 3 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below EXCEPT for questionText. For questionText, you must rewrite the provided "STORY:" into a creative math word problem. 
1. Preserve the exact mathematical values, times, and operations.
2. NEVER add extra unrequested questions.
3. Keep the final question sentence exactly as provided.
4. DO NOT include the word "STORY:" in your final output.

Use EXACTLY:
finalAnswer: "${finalAnswer}"
hint: "Identify the latest start time and earliest end time, then find the duration between them."
solutionSteps: ${sysSolutionSteps}

Base your question on this:
questionText: "${askText}"
`;
    }
  }

  const aiPrompt = systemPrompt + "\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
