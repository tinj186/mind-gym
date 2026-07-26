import { getTimeActivities, getRandomNames } from '../../../../../utils/variable-bank';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
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
      if (totalMins <= 0) totalMins += 12 * 60; // Keep within 12 hour cycle for simplicity
    }
    
    let newH = Math.floor(totalMins / 60) % 12;
    if (newH === 0) newH = 12;
    let newM = totalMins % 60;
    return { h: newH, m: newM };
  };

  if (activeVariant === 'standard_read_time_5_mins') {
    const hour = getRandomInt(1, 12);
    // Pick a minute in 5 min intervals, but avoid 0 and 30 since they are foundation
    const possibleMins = [5, 10, 15, 20, 25, 35, 40, 45, 50, 55];
    const min = possibleMins[getRandomInt(0, possibleMins.length - 1)];
    
    visualEngineStr = `{
      "componentToRender": "CLOCK_DISPLAY",
      "componentData": {
        "hour": ${hour},
        "minute": ${min},
        "displayType": "analog"
      }
    }`;

    actualAnswer = formatTime(hour, min);

    structureText = `What is the time shown on the clock?`;
    shortText = `Time shown on the clock:`;

    hintStr = `Look at the short hand for the hour and the long hand for the minutes. Multiply the number the long hand points to by 5.`;
    stepsStr = `"""1. The short hand is past ${hour}.\\n2. The long hand is pointing to ${min / 5}, which means ${min} minutes.\\n3. The time is ${actualAnswer}."""`;
    
    structureSteps = [
      { label: "The short hand (hour) is past:", expectedAnswer: String(hour) },
      { label: "The long hand (minute) means ___ minutes:", expectedAnswer: String(min) },
      { label: "The time is:", expectedAnswer: actualAnswer }
    ];

    if (isMCQ) {
      const wrong1 = formatTime(hour === 12 ? 1 : hour + 1, min);
      const wrong2 = formatTime(hour, min - 5);
      const wrong3 = formatTime(hour, min + 5 >= 60 ? 0 : min + 5);
      mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
    }
  } else if (activeVariant.includes('duration') || activeVariant.includes('half_hour')) {
    const isLater = Math.random() > 0.5;
    const isHalfHour = activeVariant.includes('half_hour');
    
    const startHour = getRandomInt(1, 11);
    const startMin = Math.random() > 0.5 ? 0 : 30; // standard usually starts at friendly times
    
    const durationHours = isHalfHour ? 0 : getRandomInt(1, 4);
    const durationMins = isHalfHour ? 30 : durationHours * 60;
    
    const startTimeStr = formatTime(startHour, startMin);
    const { h: endH, m: endM } = calculateNewTime(startHour, startMin, durationMins, isLater);
    actualAnswer = formatTime(endH, endM);

    const durationText = isHalfHour ? "half an hour" : `${durationHours} hour${durationHours > 1 ? 's' : ''}`;

    structureText = `What is the time ${durationText} ${isLater ? 'after' : 'before'} ${startTimeStr}?`;
    shortText = `${durationText} ${isLater ? 'after' : 'before'} ${startTimeStr}:`;

    hintStr = `To find the time ${isLater ? 'later' : 'before'}, ${isLater ? 'count forwards' : 'count backwards'} by ${durationText}.`;
    
    if (isHalfHour) {
      stepsStr = `"""1. Start time is ${startTimeStr}.\\n2. ${isLater ? 'Add' : 'Subtract'} 30 minutes.\\n3. The time is ${actualAnswer}."""`;
      structureSteps = [
        { label: "Equation:", expectedAnswer: `${startTimeStr} ${isLater ? '+' : '-'} 30 mins` },
        { label: "Time is:", expectedAnswer: actualAnswer }
      ];
    } else {
      stepsStr = `"""1. Start time is ${startTimeStr}.\\n2. ${isLater ? 'Add' : 'Subtract'} ${durationHours} hour${durationHours > 1 ? 's' : ''} to ${startHour}.\\n3. The time is ${actualAnswer}."""`;
      structureSteps = [
        { label: "Equation:", expectedAnswer: `${startTimeStr} ${isLater ? '+' : '-'} ${durationHours} hour${durationHours > 1 ? 's' : ''}` },
        { label: "Time is:", expectedAnswer: actualAnswer }
      ];
    }

    if (isMCQ) {
      const wrong1 = formatTime(endH === 12 ? 1 : endH + 1, endM); 
      const wrong2 = formatTime(endH, endM === 0 ? 30 : 0);
      const wrong3 = formatTime(endH === 1 ? 12 : endH - 1, endM); 
      mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
    }
  } else if (activeVariant === 'standard_minute_hand_conversion') {
    const isToMinutes = Math.random() > 0.5;
    const number = getRandomInt(1, 12);
    const minutes = number * 5;

    if (isToMinutes) {
      structureText = `The minute hand is pointing to ${number}. How many minutes does that mean?`;
      shortText = `Minute hand points to ${number}. Minutes = `;
      actualAnswer = String(minutes);
      hintStr = `Multiply the number the minute hand points to by 5.`;
      stepsStr = `"""1. The minute hand is pointing to ${number}.\\n2. Multiply ${number} by 5.\\n3. ${number} × 5 = ${minutes}."""`;
      
      structureSteps = [
        { label: "The minute hand is pointing to:", expectedAnswer: String(number) },
        { label: "The number of minutes is:", expectedAnswer: actualAnswer }
      ];
    } else {
      structureText = `The time shows ${minutes} minutes past the hour. What number is the minute hand pointing to?`;
      shortText = `${minutes} minutes past the hour. Minute hand points to:`;
      actualAnswer = String(number);
      hintStr = `Divide the minutes by 5 to find which number the minute hand is pointing to.`;
      stepsStr = `"""1. The minutes are ${minutes}.\\n2. Divide ${minutes} by 5.\\n3. ${minutes} ÷ 5 = ${number}."""`;
      
      structureSteps = [
        { label: "The number of minutes is:", expectedAnswer: String(minutes) },
        { label: "The minute hand points to:", expectedAnswer: actualAnswer }
      ];
    }

    if (isMCQ) {
      if (isToMinutes) {
        mcqOptions = [actualAnswer, String(minutes + 5), String(minutes - 5 > 0 ? minutes - 5 : 55), String(number)];
      } else {
        mcqOptions = [actualAnswer, String(number === 12 ? 1 : number + 1), String(number === 1 ? 12 : number - 1), String(minutes)];
      }
    }
  } else if (activeVariant === 'standard_identify_wrong_hand') {
    const isMinuteHandWrong = Math.random() > 0.5;
    
    // Intended time
    const correctH = getRandomInt(1, 12);
    const possibleMins = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const correctM = possibleMins[getRandomInt(0, possibleMins.length - 1)];
    const correctTimeStr = formatTime(correctH, correctM);

    // Rendered time with error
    let renderedH = correctH;
    let renderedM = correctM;

    if (isMinuteHandWrong) {
      // Pick a wrong minute (different by at least 10 mins to be obvious)
      renderedM = (correctM + 15) % 60;
      actualAnswer = isShort ? "minute hand" : `minute hand, ${correctM / 5}`;
      
      structureText = `The clock is supposed to show ${correctTimeStr}, but one hand is drawn incorrectly. Which hand is wrong, and what is its correct position?`;
      shortText = `Intended time: ${correctTimeStr}. Which hand is drawn incorrectly:`;
      hintStr = `Look at the time ${correctTimeStr}. The minute hand should point to ${correctM / 5}, and the hour hand should be past ${correctH}. See which one doesn't match!`;
      stepsStr = `"""1. The time is ${correctTimeStr}.\\n2. The hour hand is past ${correctH}, which is correct.\\n3. The minute hand points to ${renderedM === 0 ? 12 : renderedM / 5}, but it should point to ${correctM / 5}.\\n4. The minute hand is wrong${isShort ? '.' : `, it should point to ${correctM / 5}.`}"""`;
      
      structureSteps = [
        { label: "Which hand is wrong:", expectedAnswer: "minute hand" },
        { label: "Correct position:", expectedAnswer: String(correctM / 5) }
      ];

      if (isMCQ) {
        mcqOptions = [
          actualAnswer,
          `hour hand, past ${correctH} and before ${correctH === 12 ? 1 : correctH + 1}`,
          `minute hand, ${renderedM === 0 ? 12 : renderedM / 5}`,
          `hour hand, ${correctH}`
        ];
      }

    } else {
      // Hour hand is wrong
      renderedH = correctH === 12 ? 1 : correctH + 1; // Make it off by 1 hour
      actualAnswer = isShort ? "hour hand" : `hour hand, past ${correctH} and before ${correctH === 12 ? 1 : correctH + 1}`;
      
      structureText = `The clock is supposed to show ${correctTimeStr}, but one hand is drawn incorrectly. Which hand is wrong, and what is its correct position?`;
      shortText = `Intended time: ${correctTimeStr}. Which hand is drawn incorrectly:`;
      hintStr = `Look at the time ${correctTimeStr}. The hour hand should be past ${correctH}, and the minute hand should point to ${correctM / 5}. See which one doesn't match!`;
      stepsStr = `"""1. The time is ${correctTimeStr}.\\n2. The minute hand points to ${correctM / 5}, which is correct.\\n3. The hour hand is past ${renderedH}, but it should be past ${correctH} and before ${correctH === 12 ? 1 : correctH + 1}.\\n4. The hour hand is wrong${isShort ? '.' : `, it should be past ${correctH} and before ${correctH === 12 ? 1 : correctH + 1}.`}"""`;
      
      structureSteps = [
        { label: "Which hand is wrong:", expectedAnswer: "hour hand" },
        { label: "Correct position:", expectedAnswer: `past ${correctH} and before ${correctH === 12 ? 1 : correctH + 1}` }
      ];

      if (isMCQ) {
        mcqOptions = [
          actualAnswer,
          `minute hand, ${correctM / 5}`,
          `hour hand, past ${renderedH} and before ${renderedH === 12 ? 1 : renderedH + 1}`,
          `minute hand, ${renderedM === 0 ? 12 : renderedM / 5}`
        ];
      }
    }

    visualEngineStr = `{
      "componentToRender": "CLOCK_DISPLAY",
      "componentData": {
        "hour": ${renderedH},
        "minute": ${renderedM},
        "displayType": "analog"
      }
    }`;
  }

  const askText = getQText(structureText, shortText);

  if (isStructure) {
    let stepsJson = "";
    if (structureSteps && structureSteps.length > 0) {
      stepsJson = structureSteps.map(step => 
        `{"label": "${step.label}", "expectedAnswer": "${step.expectedAnswer}", "acceptedAnswers": []}`
      ).join(",\n        ");
    } else {
      stepsJson = `{"label": "Final Answer:", "expectedAnswer": "${actualAnswer}", "acceptedAnswers": []}`;
    }
    
    inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
      ${stepsJson}
    ]}`;
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
