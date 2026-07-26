import { getRandomNames } from '@/lib/utils/variable-bank';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let visualEngineStr = `{
    "componentToRender": "NONE",
    "componentData": { "hideVisual": true }
  }`;

  let inputRequirementStr = null;
  let systemPrompt = "";

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const formatTime = (h, m) => `${h === 0 ? 12 : h}:${m.toString().padStart(2, '0')}`;
  
  let structureText, shortText, actualAnswer, hintStr, stepsStr;
  let mcqOptions = [];
  let structureSteps = [];

  // Helper to add duration to a given time
  // duration is in minutes
  const calculateNewTime = (h, m, durationMins, isLater) => {
    let totalMins = h * 60 + m;
    if (isLater) {
      totalMins += durationMins;
    } else {
      totalMins -= durationMins;
      if (totalMins <= 0) totalMins += 12 * 60; 
    }
    
    let newH = Math.floor(totalMins / 60) % 12;
    if (newH === 0) newH = 12;
    let newM = totalMins % 60;
    return { h: newH, m: newM };
  };

  const getDurationString = (mins) => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    let parts = [];
    if (hrs > 0) parts.push(`${hrs} hour${hrs > 1 ? 's' : ''}`);
    if (m > 0) parts.push(`${m} minutes`);
    
    return parts.join(' and ');
  };

  if (activeVariant === 'advanced_time_pattern_5_mins') {
    const startHour = getRandomInt(1, 11);
    const startMins = getRandomInt(0, 8) * 5; // up to 40 mins so we don't cross hour bounds for simplicity
    
    const times = [
      formatTime(startHour, startMins),
      formatTime(startHour, startMins + 5),
      formatTime(startHour, startMins + 10),
      formatTime(startHour, startMins + 15)
    ];

    const missingIdx = getRandomInt(0, 3);
    actualAnswer = times[missingIdx];
    
    const displayPattern = times.map((t, idx) => idx === missingIdx ? '___' : t).join(', ');
    
    structureText = `What is the missing time in the pattern? ${displayPattern}`;
    shortText = `Missing time in pattern: ${displayPattern} ->`;
    hintStr = `Look at the other times to find the pattern. The minutes change by 5 each time.`;
    
    let ref1, ref2;
    if (missingIdx === 0 || missingIdx === 1) {
      ref1 = times[2];
      ref2 = times[3];
    } else {
      ref1 = times[0];
      ref2 = times[1];
    }
    
    stepsStr = `"""1. Look at ${ref1} and ${ref2} in the pattern.\\n2. The minutes increase by 5 each time.\\n3. Applying this pattern, the missing time is ${actualAnswer}."""`;
    
    structureSteps = [
      { label: "The pattern increases by (minutes):", expectedAnswer: "5" },
      { label: "The missing time is:", expectedAnswer: actualAnswer }
    ];

    if (isMCQ) {
      const wrong1 = formatTime(startHour, startMins + 20);
      const wrong2 = formatTime(startHour, startMins + 10);
      const wrong3 = formatTime(startHour === 12 ? 1 : startHour + 1, startMins + 15);
      mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
    }
  } else if (activeVariant === 'advanced_swapped_hands') {
    const startHour = getRandomInt(1, 12);
    const possibleMins = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const startMin = possibleMins[getRandomInt(0, possibleMins.length - 1)];
    
    const startTimeStr = formatTime(startHour, startMin);
    
    const swappedH = startMin / 5 === 0 ? 12 : startMin / 5;
    const swappedM = startHour === 12 ? 0 : startHour * 5;
    actualAnswer = formatTime(swappedH, swappedM);
    
    structureText = `The clock shows ${startTimeStr}. If the minute hand and hour hand were swapped, what time would it be?`;
    shortText = `Time is ${startTimeStr}. Time if hands swapped:`;
    hintStr = `The hour hand is past ${startHour} and the minute hand points to ${startMin / 5}. Swap them!`;
    
    stepsStr = `"""1. The time is ${startTimeStr}.\\n2. The hour hand is past ${startHour}, and the minute hand points to ${startMin / 5}.\\n3. If swapped, the hour hand points to ${swappedH} and the minute hand points to ${startHour}.\\n4. The new time is ${actualAnswer}."""`;

    structureSteps = [
      { label: "If swapped, the hour hand points to:", expectedAnswer: String(swappedH) },
      { label: "And the minute hand points to:", expectedAnswer: String(startHour) },
      { label: "The new time is:", expectedAnswer: actualAnswer }
    ];

    visualEngineStr = `{
      "componentToRender": "CLOCK_DISPLAY",
      "componentData": {
        "hour": ${startHour},
        "minute": ${startMin},
        "displayType": "analog"
      }
    }`;

    if (isMCQ) {
      const wrong1 = formatTime(swappedH === 12 ? 1 : swappedH + 1, swappedM);
      const wrong2 = formatTime(swappedH, swappedM === 0 ? 30 : 0);
      const wrong3 = formatTime(startHour, swappedM);
      mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
    }
  } else if (activeVariant === 'advanced_identify_wrong_hand_subtle') {
    const correctH = getRandomInt(1, 12);
    const possibleMins = [15, 30, 45]; // Use minutes that normally have a clear halfway/quarterway hour hand
    const correctM = possibleMins[getRandomInt(0, possibleMins.length - 1)];
    const correctTimeStr = formatTime(correctH, correctM);

    actualAnswer = isShort ? "hour hand" : `hour hand, past ${correctH} and before ${correctH === 12 ? 1 : correctH + 1}`;
    
    structureText = `A clockmaker made a mistake while building this clock to show ${correctTimeStr}. One of the hands is not drawn perfectly. Which hand is drawn incorrectly, and what is its correct position?`;
    shortText = `Intended time: ${correctTimeStr}. Which hand is drawn incorrectly:`;
    hintStr = `Since the time is ${correctTimeStr}, the hour hand shouldn't point exactly at ${correctH}. It should be moving towards the next hour!`;
    
    stepsStr = `"""1. The time is ${correctTimeStr}.\\n2. The minute hand points to ${correctM / 5}, which is correct.\\n3. The hour hand points exactly at ${correctH}, but it should be past ${correctH} and before ${correctH === 12 ? 1 : correctH + 1}.\\n4. The hour hand is wrong${isShort ? '.' : `, it should be past ${correctH} and before ${correctH === 12 ? 1 : correctH + 1}.`}"""`;

    structureSteps = [
      { label: "Which hand is wrong:", expectedAnswer: "hour hand" },
      { label: "Correct position:", expectedAnswer: `past ${correctH} and before ${correctH === 12 ? 1 : correctH + 1}` }
    ];

    visualEngineStr = `{
      "componentToRender": "CLOCK_DISPLAY",
      "componentData": {
        "hour": ${correctH},
        "minute": ${correctM},
        "hourHandMinute": 0,
        "displayType": "analog"
      }
    }`;

    if (isMCQ) {
      mcqOptions = [
        actualAnswer,
        `minute hand, ${correctM / 5}`,
        `hour hand, exactly ${correctH}`,
        `minute hand, exactly ${correctH}`
      ];
    }
  } else if (activeVariant === 'advanced_faulty_clock_correction') {
    const isFast = Math.random() > 0.5;
    const diffMins = (Math.random() > 0.5 ? 15 : 30);
    
    // actual time
    const actualH = getRandomInt(1, 11);
    const actualM = 30; // keep it simple
    
    // clock time (faulty)
    const { h: faultyH, m: faultyM } = calculateNewTime(actualH, actualM, diffMins, isFast);
    
    actualAnswer = formatTime(actualH, actualM);
    const faultyTimeStr = formatTime(faultyH, faultyM);
    
    structureText = `The clock shows ${faultyTimeStr}, but it is ${diffMins} minutes ${isFast ? 'fast' : 'slow'}. What is the actual time?`;
    shortText = `Clock shows ${faultyTimeStr} (${diffMins} mins ${isFast ? 'fast' : 'slow'}). Actual time:`;
    hintStr = `If the clock is ${isFast ? 'fast' : 'slow'}, the actual time is ${diffMins} minutes ${isFast ? 'earlier' : 'later'}.`;
    
    stepsStr = `"""1. Time shown on clock is ${faultyTimeStr}.\\n2. The clock is ${isFast ? 'fast' : 'slow'}, so the actual time is ${diffMins} minutes ${isFast ? 'earlier' : 'later'}.\\n3. The actual time is ${actualAnswer}."""`;

    structureSteps = [
      { label: "Time shown on clock:", expectedAnswer: faultyTimeStr },
      { label: "Actual time:", expectedAnswer: actualAnswer }
    ];

    visualEngineStr = `{
      "componentToRender": "CLOCK_DISPLAY",
      "componentData": {
        "hour": ${faultyH},
        "minute": ${faultyM},
        "displayType": "analog"
      }
    }`;

    if (isMCQ) {
      const wrong1 = formatTime(actualH, actualM === 30 ? 0 : 30);
      const wrong2 = formatTime(actualH === 12 ? 1 : actualH + 1, actualM);
      const wrong3 = formatTime(actualH === 1 ? 12 : actualH - 1, actualM);
      mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
    }
  } else if (activeVariant === 'advanced_chained_duration') {
    const isForward = Math.random() > 0.5;
    const names = getRandomNames(1);
    const name = names[0];
    
    const startHour = getRandomInt(1, 9);
    const startMin = Math.random() > 0.5 ? 0 : 30;
    
    const possibleDurations = [30, 60, 90, 120];
    const dur1Mins = possibleDurations[getRandomInt(0, possibleDurations.length - 1)];
    const dur2Mins = possibleDurations[getRandomInt(0, possibleDurations.length - 1)];
    
    const dur1Str = getDurationString(dur1Mins);
    const dur2Str = getDurationString(dur2Mins);
    
    const time0 = { h: startHour, m: startMin };
    const time1 = calculateNewTime(time0.h, time0.m, dur1Mins, true);
    const time2 = calculateNewTime(time1.h, time1.m, dur2Mins, true);
    
    const t0Str = formatTime(time0.h, time0.m);
    const t1Str = formatTime(time1.h, time1.m);
    const t2Str = formatTime(time2.h, time2.m);

    if (isForward) {
      actualAnswer = t2Str;
      structureText = `${name} started reading at ${t0Str} and read for ${dur1Str}. Then ${name} took a nap for ${dur2Str}. What time did ${name} wake up?`;
      shortText = `Start: ${t0Str}. Read: ${dur1Str}. Nap: ${dur2Str}. Wake up time:`;
      hintStr = `First find the time after reading. Then use that time to find the time after the nap.`;
      
      stepsStr = `"""1. Reading started at ${t0Str} and lasted ${dur1Str}.\\n2. The time reading ended is ${t1Str}.\\n3. The nap lasted ${dur2Str} after reading.\\n4. ${dur2Str} after ${t1Str} is ${t2Str}.\\n5. The wake up time is ${t2Str}."""`;

      structureSteps = [
        { label: "Time reading ended:", expectedAnswer: t1Str },
        { label: "Time nap ended (wake up time):", expectedAnswer: actualAnswer }
      ];
    } else {
      actualAnswer = t0Str;
      structureText = `${name} woke up at ${t2Str}. Before waking up, ${name} took a nap for ${dur2Str}. Before the nap, ${name} read for ${dur1Str}. What time did ${name} start reading?`;
      shortText = `Wake up: ${t2Str}. Nap: ${dur2Str}. Read: ${dur1Str}. Start reading time:`;
      hintStr = `Work backwards! First find the time before the nap started. Then use that time to find the time before reading started.`;
      
      stepsStr = `"""1. Wake up time is ${t2Str}.\\n2. The nap lasted ${dur2Str}.\\n3. The time before the nap started is ${t1Str}.\\n4. Reading lasted ${dur1Str}.\\n5. ${dur1Str} before ${t1Str} is ${t0Str}.\\n6. The time reading started is ${t0Str}."""`;

      structureSteps = [
        { label: "Time before nap started:", expectedAnswer: t1Str },
        { label: "Time reading started:", expectedAnswer: actualAnswer }
      ];
    }

    if (isMCQ) {
      const hAns = isForward ? time2.h : time0.h;
      const mAns = isForward ? time2.m : time0.m;
      const wrong1 = formatTime(hAns === 12 ? 1 : hAns + 1, mAns);
      const wrong2 = formatTime(hAns, mAns === 0 ? 30 : 0);
      const wrong3 = formatTime(time1.h, time1.m);
      mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
    }
  }

  const askText = getQText(structureText, shortText);

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
        {"label": "Final Answer:", "expectedAnswer": "${actualAnswer}", "acceptedAnswers": []}
      ]}`;
    }
  } else if (isMCQ) {
    inputRequirementStr = `null`;
  } else {
    inputRequirementStr = `{"inputType": "TEXT_INPUT"}`;
  }

  if (isMCQ) {
    systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!
DO NOT ADD ANY CONTEXT OR EXTRA SENTENCES to the questionText. It must ONLY contain the single question asked.

Use EXACTLY:
questionText: ["${askText}"]
finalAnswer: """${actualAnswer}"""
hint: """${hintStr}"""
solutionSteps: ${stepsStr}

Generate exactly ${mcqOptions.length} options: ${mcqOptions.map(o => `"${o}"`).join(', ')}.
The defectMap should map the incorrect options to "TIME_CALCULATION_ERROR".
`;
  } else {
    systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${actualAnswer}"""
hint: """${hintStr}"""
solutionSteps: ${stepsStr}
`;
  }

  const aiPrompt = systemPrompt + "\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
}
