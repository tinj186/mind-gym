import { getRandomNames } from '../../../../../utils/variable-bank';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function standardLogic(activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions) {
  let structureText, shortText, actualAnswer, hintStr, stepsStr;
  let mcqOptions = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let structureSteps = [];

  const formatTime = (h, m) => {
    return `${h}:${m === 0 ? '00' : m}`;
  };

  const calculateNewTime = (h, m, addMins, isLater) => {
    let total = h * 60 + m;
    total = isLater ? total + addMins : total - addMins;
    if (total <= 0) total += 12 * 60;
    
    let newH = Math.floor(total / 60) % 12;
    if (newH === 0) newH = 12;
    let newM = total % 60;
    return { h: newH, m: newM };
  };

  if (activeVariant === 'standard_calculate_hour_duration') {
    const unknownType = getRandomInt(0, 2); // 0: Start, 1: End, 2: Duration
    const startHour = getRandomInt(1, 8);
    const startMin = Math.random() > 0.5 ? 0 : 30;
    const durationHours = getRandomInt(2, 4);
    
    const startTimeStr = formatTime(startHour, startMin);
    const { h: endH, m: endM } = calculateNewTime(startHour, startMin, durationHours * 60, true);
    const endTimeStr = formatTime(endH, endM);
    const durationStr = `${durationHours} hours`;

    const names = getRandomNames(1);
    const person = names[0];

    if (unknownType === 0) { // Unknown Start
      actualAnswer = startTimeStr;
      structureText = `${person} finished an activity at ${endTimeStr}. The activity took ${durationStr}. What time did ${person} start?`;
      shortText = `End: ${endTimeStr}, Duration: ${durationStr}. Start time:`;
      hintStr = `To find the start time, count backward from the end time! Count back ${durationStr} from ${endTimeStr}.`;
      stepsStr = JSON.stringify([
        `1. The activity ended at ${endTimeStr} and took ${durationStr}.`,
        `2. We need to find the start time, so we count backward.`,
        `3. Counting back ${durationStr} from ${endTimeStr} gives ${startTimeStr}.`,
        `4. The start time is ${startTimeStr}.`
      ]);
      structureSteps = [
        { label: "End time:", expectedAnswer: endTimeStr },
        { label: "Duration:", expectedAnswer: durationStr },
        { label: "Start time:", expectedAnswer: startTimeStr }
      ];
      if (isMCQ) {
        mcqOptions = [
          actualAnswer,
          formatTime(calculateNewTime(endH, endM, (durationHours + 1) * 60, false).h, endM),
          formatTime(calculateNewTime(endH, endM, (durationHours - 1) * 60, false).h, endM),
          formatTime(calculateNewTime(endH, endM, durationHours * 60, true).h, endM)
        ];
      }
    } else if (unknownType === 1) { // Unknown End
      actualAnswer = endTimeStr;
      structureText = `${person} started an activity at ${startTimeStr}. The activity took ${durationStr}. What time did ${person} finish?`;
      shortText = `Start: ${startTimeStr}, Duration: ${durationStr}. End time:`;
      hintStr = `To find the end time, count forward from the start time! Count forward ${durationStr} from ${startTimeStr}.`;
      stepsStr = JSON.stringify([
        `1. The activity started at ${startTimeStr} and took ${durationStr}.`,
        `2. We need to find the end time, so we count forward.`,
        `3. Counting forward ${durationStr} from ${startTimeStr} gives ${endTimeStr}.`,
        `4. The end time is ${endTimeStr}.`
      ]);
      structureSteps = [
        { label: "Start time:", expectedAnswer: startTimeStr },
        { label: "Duration:", expectedAnswer: durationStr },
        { label: "End time:", expectedAnswer: endTimeStr }
      ];
      if (isMCQ) {
        mcqOptions = [
          actualAnswer,
          formatTime(calculateNewTime(startHour, startMin, (durationHours + 1) * 60, true).h, startMin),
          formatTime(calculateNewTime(startHour, startMin, (durationHours - 1) * 60, true).h, startMin),
          formatTime(calculateNewTime(startHour, startMin, durationHours * 60, false).h, startMin)
        ];
      }
    } else { // Unknown Duration
      actualAnswer = durationStr;
      structureText = `${person} started an activity at ${startTimeStr} and finished at ${endTimeStr}. How long did the activity take?`;
      shortText = `Start: ${startTimeStr}, End: ${endTimeStr}. Duration:`;
      hintStr = `Count the number of hours from the start time to the end time! How many hours from ${startTimeStr} to ${endTimeStr}?`;
      stepsStr = JSON.stringify([
        `1. The activity started at ${startTimeStr} and ended at ${endTimeStr}.`,
        `2. Let's count the hours from ${startTimeStr} to ${endTimeStr}.`,
        `3. Counting the hours gives ${durationHours}.`,
        `4. The duration is ${durationStr}.`
      ]);
      structureSteps = [
        { label: "Start time:", expectedAnswer: startTimeStr },
        { label: "End time:", expectedAnswer: endTimeStr },
        { label: "Duration:", expectedAnswer: durationStr }
      ];
      if (isMCQ) {
        mcqOptions = [
          actualAnswer,
          `${durationHours + 1} hours`,
          `${durationHours - 1 > 0 ? durationHours - 1 : 4} hours`,
          `${durationHours} hours 30 minutes`
        ];
      }
    }
  } else if (activeVariant === 'standard_calculate_half_hour_duration') {
    const unknownType = getRandomInt(0, 2); // 0: Start, 1: End, 2: Duration
    const startHour = getRandomInt(1, 8);
    const startMin = Math.random() > 0.5 ? 0 : 30;
    
    // Duration in 30-min intervals. For Standard, maybe 30 mins, 90 mins (1h 30m), 150 mins (2h 30m)
    // To ensure they are strictly half hours and not whole hours, pick odd multiples of 30
    const halfHourJumps = [1, 3, 5];
    const numJumps = halfHourJumps[getRandomInt(0, halfHourJumps.length - 1)];
    const durationMins = numJumps * 30;
    
    let durationStr = '';
    if (numJumps === 1) durationStr = '30 minutes';
    else if (numJumps === 3) durationStr = '1 hour 30 minutes';
    else if (numJumps === 5) durationStr = '2 hours 30 minutes';

    const startTimeStr = formatTime(startHour, startMin);
    const { h: endH, m: endM } = calculateNewTime(startHour, startMin, durationMins, true);
    const endTimeStr = formatTime(endH, endM);

    const names = getRandomNames(1);
    const person = names[0];

    if (unknownType === 0) { // Unknown Start
      actualAnswer = startTimeStr;
      structureText = `${person} finished an activity at ${endTimeStr}. The activity took ${durationStr}. What time did ${person} start?`;
      shortText = `End: ${endTimeStr}, Duration: ${durationStr}. Start time:`;
      hintStr = `Count backward from the end time. You can count in 30-minute jumps!`;
      stepsStr = JSON.stringify([
        `1. The activity ended at ${endTimeStr} and took ${durationStr} (${numJumps} jumps of 30 minutes).`,
        `2. We need to find the start time, so we count backward.`,
        `3. Counting back ${numJumps} jumps of 30 minutes from ${endTimeStr} gives ${startTimeStr}.`,
        `4. The start time is ${startTimeStr}.`
      ]);
      structureSteps = [
        { label: "End time:", expectedAnswer: endTimeStr },
        { label: "Duration:", expectedAnswer: durationStr },
        { label: "Jumps of 30 minutes:", expectedAnswer: String(numJumps) },
        { label: "Start time:", expectedAnswer: startTimeStr }
      ];
      if (isMCQ) {
        mcqOptions = [
          actualAnswer,
          formatTime(calculateNewTime(endH, endM, durationMins + 30, false).h, calculateNewTime(endH, endM, durationMins + 30, false).m),
          formatTime(calculateNewTime(endH, endM, durationMins - 30, false).h, calculateNewTime(endH, endM, durationMins - 30, false).m),
          formatTime(calculateNewTime(endH, endM, durationMins, true).h, calculateNewTime(endH, endM, durationMins, true).m)
        ];
      }
    } else if (unknownType === 1) { // Unknown End
      actualAnswer = endTimeStr;
      structureText = `${person} started an activity at ${startTimeStr}. The activity took ${durationStr}. What time did ${person} finish?`;
      shortText = `Start: ${startTimeStr}, Duration: ${durationStr}. End time:`;
      hintStr = `Count forward from the start time. You can count in 30-minute jumps!`;
      stepsStr = JSON.stringify([
        `1. The activity started at ${startTimeStr} and took ${durationStr} (${numJumps} jumps of 30 minutes).`,
        `2. We need to find the end time, so we count forward.`,
        `3. Counting forward ${numJumps} jumps of 30 minutes from ${startTimeStr} gives ${endTimeStr}.`,
        `4. The end time is ${endTimeStr}.`
      ]);
      structureSteps = [
        { label: "Start time:", expectedAnswer: startTimeStr },
        { label: "Duration:", expectedAnswer: durationStr },
        { label: "Jumps of 30 minutes:", expectedAnswer: String(numJumps) },
        { label: "End time:", expectedAnswer: endTimeStr }
      ];
      if (isMCQ) {
        mcqOptions = [
          actualAnswer,
          formatTime(calculateNewTime(startHour, startMin, durationMins + 30, true).h, calculateNewTime(startHour, startMin, durationMins + 30, true).m),
          formatTime(calculateNewTime(startHour, startMin, durationMins - 30, true).h, calculateNewTime(startHour, startMin, durationMins - 30, true).m),
          formatTime(calculateNewTime(startHour, startMin, durationMins, false).h, calculateNewTime(startHour, startMin, durationMins, false).m)
        ];
      }
    } else { // Unknown Duration
      actualAnswer = durationStr;
      structureText = `${person} started an activity at ${startTimeStr} and finished at ${endTimeStr}. How long did the activity take?`;
      shortText = `Start: ${startTimeStr}, End: ${endTimeStr}. Duration:`;
      hintStr = `Count the number of 30-minute jumps from the start time to the end time, then convert it to hours and minutes!`;
      stepsStr = JSON.stringify([
        `1. The activity started at ${startTimeStr} and ended at ${endTimeStr}.`,
        `2. Let's count the 30-minute jumps from ${startTimeStr} to ${endTimeStr}.`,
        `3. There are ${numJumps} jumps of 30 minutes.`,
        `4. Since 2 jumps make 1 hour, ${numJumps} jumps is ${durationStr}.`
      ]);
      structureSteps = [
        { label: "Start time:", expectedAnswer: startTimeStr },
        { label: "End time:", expectedAnswer: endTimeStr },
        { label: "Jumps of 30 minutes:", expectedAnswer: String(numJumps) },
        { label: "Duration:", expectedAnswer: durationStr }
      ];
      if (isMCQ) {
        let wrong1 = numJumps === 1 ? '1 hour 30 minutes' : '30 minutes';
        let wrong2 = numJumps === 3 ? '2 hours 30 minutes' : '1 hour 30 minutes';
        let wrong3 = `${Math.floor(numJumps/2) + 1} hours`;
        mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
      }
    }
  } else if (activeVariant === 'standard_compare_two_durations') {
    const askLonger = Math.random() > 0.5;
    
    const act1 = { name: "Reading a book", duration: 60 }; // 1 hour
    const act2 = { name: "Watching a movie", duration: 120 }; // 2 hours
    const act3 = { name: "Doing homework", duration: 90 }; // 1 hour 30 mins
    const act4 = { name: "Playing basketball", duration: 30 }; // 30 mins
    
    const allActs = [act1, act2, act3, act4].sort(() => Math.random() - 0.5);
    const a1 = allActs[0];
    const a2 = allActs[1];
    
    const formatDuration = (mins) => {
      if (mins === 30) return '30 minutes';
      if (mins === 60) return '1 hour';
      if (mins === 90) return '1 hour 30 minutes';
      if (mins === 120) return '2 hours';
      return `${mins} minutes`;
    };

    const isA1Longer = a1.duration > a2.duration;
    actualAnswer = askLonger 
      ? (isA1Longer ? a1.name : a2.name) 
      : (isA1Longer ? a2.name : a1.name);

    structureText = `${a1.name} takes ${formatDuration(a1.duration)}. ${a2.name} takes ${formatDuration(a2.duration)}. Which activity takes a ${askLonger ? 'longer' : 'shorter'} amount of time?`;
    shortText = `${a1.name} (${formatDuration(a1.duration)}). ${a2.name} (${formatDuration(a2.duration)}). Which is ${askLonger ? 'longer' : 'shorter'}?`;
    hintStr = `Convert both durations to minutes to compare them easily! 1 hour is 60 minutes.`;
    
    stepsStr = JSON.stringify([
      `1. ${a1.name} takes ${formatDuration(a1.duration)}, which is ${a1.duration} minutes.`,
      `2. ${a2.name} takes ${formatDuration(a2.duration)}, which is ${a2.duration} minutes.`,
      `3. We are looking for the ${askLonger ? 'longer' : 'shorter'} activity.`,
      `4. Since ${askLonger ? (isA1Longer ? `${a1.duration} > ${a2.duration}` : `${a2.duration} > ${a1.duration}`) : (isA1Longer ? `${a2.duration} < ${a1.duration}` : `${a1.duration} < ${a2.duration}`)}, the answer is ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `${a1.name} in minutes:`, expectedAnswer: `${a1.duration} minutes` },
      { label: `${a2.name} in minutes:`, expectedAnswer: `${a2.duration} minutes` },
      { label: `Which is ${askLonger ? 'longer' : 'shorter'}?`, expectedAnswer: actualAnswer }
    ];

    if (isMCQ) {
      mcqOptions = [a1.name, a2.name];
    }
  } else if (activeVariant === 'standard_timetable_duration_extraction') {
    const startHour = getRandomInt(1, 4);
    
    // Construct a schedule from different scenarios
    const busServices = ["Bus 14", "Bus 65", "Bus 190"];
    const mrtLines = ["East-West Line (EWL)", "North-South Line (NSL)", "Circle Line (CCL)"];

    const scenarios = [
      {
        type: 'event',
        title: "School Timetable",
        e1: "Math Class", e2: "Recess", e3: "Science Class", e4: "Dismissal"
      },
      {
        type: 'event',
        title: "TV Guide",
        e1: "Morning Cartoon", e2: "News Update", e3: "Documentary", e4: "Movie Premiere"
      },
      {
        type: 'transit',
        title: `${busServices[getRandomInt(0, busServices.length - 1)]} Schedule`,
        e1: "Bedok Interchange", e2: "East Coast Park", e3: "Orchard Road", e4: "Clementi Interchange"
      },
      {
        type: 'transit',
        title: `${mrtLines[getRandomInt(0, mrtLines.length - 1)]} Schedule`,
        e1: "Pasir Ris MRT", e2: "Tampines MRT", e3: "City Hall MRT", e4: "Jurong East MRT"
      }
    ];
    
    const scenario = scenarios[getRandomInt(0, scenarios.length - 1)];

    const event1 = { time: formatTime(startHour, 0), event: scenario.e1, mins: 60 };
    const event2 = { time: formatTime(startHour + 1, 0), event: scenario.e2, mins: 30 };
    const event3 = { time: formatTime(startHour + 1, 30), event: scenario.e3, mins: 60 };
    const event4 = { time: formatTime(startHour + 2, 30), event: scenario.e4, mins: 0 };
    
    const rows = [
      { time: event1.time, event: event1.event, mins: event1.mins },
      { time: event2.time, event: event2.event, mins: event2.mins },
      { time: event3.time, event: event3.event, mins: event3.mins },
      { time: event4.time, event: event4.event, mins: event4.mins }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "TIMETABLE",
      componentData: {
        title: scenario.title,
        rows: rows.map(r => ({ time: r.time, event: r.event }))
      }
    });

    // Pick start index (0 to 2) and end index (start index + 1 to 3)
    const startIdx = getRandomInt(0, 2);
    const endIdx = getRandomInt(startIdx + 1, 3);
    
    const targetStartEvent = rows[startIdx];
    const targetEndEvent = rows[endIdx];

    // Calculate total duration in minutes between startIdx and endIdx
    let totalMins = 0;
    for (let i = startIdx; i < endIdx; i++) {
      totalMins += rows[i].mins;
    }
    
    let durationStr = '';
    if (totalMins === 30) durationStr = '30 minutes';
    else if (totalMins === 60) durationStr = '1 hour';
    else if (totalMins === 90) durationStr = '1 hour 30 minutes';
    else if (totalMins === 120) durationStr = '2 hours';
    else if (totalMins === 150) durationStr = '2 hours 30 minutes';

    actualAnswer = durationStr;
    const askSingleSlot = (endIdx - startIdx === 1);

    if (scenario.type === 'transit') {
      structureText = `Look at the timetable above. How long does it take to travel from ${targetStartEvent.event} to ${targetEndEvent.event}?`;
      shortText = `Travel time from ${targetStartEvent.event} to ${targetEndEvent.event}:`;
      hintStr = `Look at the time at ${targetStartEvent.event}, and the time at ${targetEndEvent.event}. Calculate the difference!`;
      stepsStr = JSON.stringify([
        `1. The transit arrives at ${targetStartEvent.event} at ${targetStartEvent.time}.`,
        `2. It arrives at ${targetEndEvent.event} at ${targetEndEvent.time}.`,
        `3. We need to find the travel duration between ${targetStartEvent.time} and ${targetEndEvent.time}.`,
        `4. From ${targetStartEvent.time} to ${targetEndEvent.time} is ${durationStr}.`
      ]);
      structureSteps = [
        { label: `Time at ${targetStartEvent.event}:`, expectedAnswer: targetStartEvent.time },
        { label: `Time at ${targetEndEvent.event}:`, expectedAnswer: targetEndEvent.time },
        { label: "Travel time:", expectedAnswer: durationStr }
      ];
    } else {
      if (askSingleSlot) {
        structureText = `Look at the timetable above. How long is the ${targetStartEvent.event}?`;
        shortText = `Duration of ${targetStartEvent.event} from the timetable:`;
        hintStr = `Look at the start time of the ${targetStartEvent.event}, and the start time of the NEXT event. The difference is the duration!`;
      } else {
        structureText = `Look at the timetable above. How long is it from the start of ${targetStartEvent.event} to the start of ${targetEndEvent.event}?`;
        shortText = `Duration from ${targetStartEvent.event} to ${targetEndEvent.event}:`;
        hintStr = `Look at the start time of ${targetStartEvent.event}, and the start time of ${targetEndEvent.event}. Calculate the difference!`;
      }
      stepsStr = JSON.stringify([
        `1. The ${targetStartEvent.event} starts at ${targetStartEvent.time}.`,
        `2. The ${targetEndEvent.event} starts at ${targetEndEvent.time}.`,
        `3. We need to find the duration between ${targetStartEvent.time} and ${targetEndEvent.time}.`,
        `4. From ${targetStartEvent.time} to ${targetEndEvent.time} is ${durationStr}.`
      ]);
      structureSteps = [
        { label: `Start time of ${targetStartEvent.event}:`, expectedAnswer: targetStartEvent.time },
        { label: `Start time of ${targetEndEvent.event}:`, expectedAnswer: targetEndEvent.time },
        { label: "Total duration:", expectedAnswer: durationStr }
      ];
    }

    if (isMCQ) {
      mcqOptions = [actualAnswer, '30 minutes', '1 hour', '1 hour 30 minutes', '2 hours', '2 hours 30 minutes'];
    }
  } else if (activeVariant === 'standard_total_sequential_duration') {
    const names = getRandomNames(1);
    const person = names[0];

    const act1 = { name: "did homework", duration: 60, str: "1 hour" };
    const act2 = { name: "read a book", duration: 30, str: "30 minutes" };
    const act3 = { name: "played games", duration: 60, str: "1 hour" };
    const act4 = { name: "watched TV", duration: 90, str: "1 hour 30 minutes" };
    
    const pool = [act1, act2, act3, act4].sort(() => Math.random() - 0.5);
    const a1 = pool[0];
    const a2 = pool[1];
    
    const totalMins = a1.duration + a2.duration;
    
    let totalStr = '';
    if (totalMins === 60) totalStr = '1 hour';
    else if (totalMins === 90) totalStr = '1 hour 30 minutes';
    else if (totalMins === 120) totalStr = '2 hours';
    else if (totalMins === 150) totalStr = '2 hours 30 minutes';

    actualAnswer = totalStr;
    structureText = `${person} ${a1.name} for ${a1.str} and then ${a2.name} for ${a2.str}. How much time did ${person} spend altogether?`;
    shortText = `${a1.str} and ${a2.str} altogether:`;
    hintStr = `Convert everything to minutes first, add them up, then convert back to hours and minutes! 1 hour is 60 minutes.`;
    
    stepsStr = JSON.stringify([
      `1. ${person} ${a1.name} for ${a1.str} (${a1.duration} minutes).`,
      `2. ${person} ${a2.name} for ${a2.str} (${a2.duration} minutes).`,
      `3. Total time in minutes: ${a1.duration} + ${a2.duration} = ${totalMins} minutes.`,
      `4. ${totalMins} minutes is ${totalStr}.`
    ]);

    structureSteps = [
      { label: `First activity in minutes:`, expectedAnswer: `${a1.duration} minutes` },
      { label: `Second activity in minutes:`, expectedAnswer: `${a2.duration} minutes` },
      { label: `Total time in minutes:`, expectedAnswer: `${totalMins} minutes` },
      { label: `Total time in hours and minutes:`, expectedAnswer: totalStr }
    ];

    if (isMCQ) {
      mcqOptions = [
        actualAnswer,
        '1 hour',
        '1 hour 30 minutes',
        '2 hours',
        '2 hours 30 minutes'
      ];
    }
  }

  if (isStructure) {
    if (structureSteps && structureSteps.length > 0) {
      const stepsJson = structureSteps.map(step => 
        `{"label": "${step.label}", "expectedAnswer": "${step.expectedAnswer}", "acceptedAnswers": []}`
      ).join(",\n        ");
      
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        ${stepsJson}
      ]}`;
    } else {
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        {"label": "Step 1:", "expectedAnswer": "...", "acceptedAnswers": []}
      ]}`;
    }
  } else {
    inputRequirementStr = `{"inputType": "TEXT_INPUT"}`;
  }

  const baseInstruction = getQText(structureText, shortText);

  let systemPrompt = `You are a math question generator.
Generate a question following this logic: ${activeVariant}.

CRITICAL INSTRUCTIONS:
- You MUST use the exact 'questionText' provided below.
- You MUST use the exact 'finalAnswer' provided below.
- You MUST use the exact 'solutionSteps' provided below. Separate steps using the exact characters \\n inside the string.
- You MUST use the exact 'hint' provided below.
- Do NOT hallucinate or change the text.
- Do NOT use markdown formatting in the expectedAnswer of multi-step inputs.

Question Text: ${baseInstruction}
Final Answer: ${actualAnswer}
Hint: ${hintStr}
Solution Steps: ${stepsStr}
`;

  if (isMCQ && mcqOptions.length > 0) {
    let options = Array.from(new Set(mcqOptions));
    if (!options.includes(actualAnswer)) {
      options[0] = actualAnswer;
    }
    options.sort(() => Math.random() - 0.5);
    
    systemPrompt += `\nOptions (MCQ): ${JSON.stringify(options)}`;
    inputRequirementStr = `{"inputType": "MCQ", "options": ${JSON.stringify(options)}}`;
  }

  systemPrompt += "\n\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);

  return { aiPrompt: systemPrompt };
}
