import { getRandomNames, getTimeActivities } from '@/lib/utils/variable-bank';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
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
  let name, activity, timeStr;

  let structureSteps = [];

  if (activeVariant.includes('read_time')) {
    const isHalfHour = activeVariant === 'foundation_read_time_half_hour';
    const hour = getRandomInt(1, 12);
    const min = isHalfHour ? 30 : 0;
    
    visualEngineStr = `{
      "componentToRender": "CLOCK_DISPLAY",
      "componentData": {
        "hour": ${hour},
        "minute": ${min},
        "displayType": "analog"
      }
    }`;

    actualAnswer = formatTime(hour, min);

    structureText = `What is the time shown on the clock? Write your answer using numbers (e.g., 4:00).`;
    shortText = `Time shown on the clock (e.g., 4:00):`;

    hintStr = `Look at the short hand for the hour and the long hand for the minutes.`;
    stepsStr = `"""1. The short hand (hour hand) is ${isHalfHour ? 'between ' + hour + ' and ' + (hour === 12 ? 1 : hour + 1) : 'pointing to ' + hour}.\\n2. The long hand (minute hand) is pointing to ${isHalfHour ? '6, which means 30 minutes' : '12, which means 0 minutes'}.\\n3. The time is ${actualAnswer}."""`;
    
    structureSteps = [
      { label: "The short hand (hour) is pointing to:", expectedAnswer: String(hour) },
      { label: "The long hand (minute) means ___ minutes:", expectedAnswer: String(min) },
      { label: "The time is:", expectedAnswer: actualAnswer }
    ];

    if (isMCQ) {
      const wrong1 = formatTime(hour === 12 ? 1 : hour + 1, min);
      const wrong2 = formatTime(hour, min === 0 ? 30 : 0);
      const wrong3 = formatTime(hour === 1 ? 12 : hour - 1, min);
      mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
    }
  } else if (activeVariant.includes('am_pm')) {
    const isMorning = activeVariant === 'foundation_am_pm_morning';
    const activityObj = getTimeActivities(1, isMorning)[0];
      
    activity = activityObj.text;
    name = getRandomNames(1)[0];
    const hour = getRandomInt(activityObj.min, activityObj.max);
    const min = Math.random() > 0.5 ? 0 : 30;
    timeStr = formatTime(hour, min);

    actualAnswer = isMorning ? "a.m." : "p.m.";
    const wrongAnswer = isMorning ? "p.m." : "a.m.";

    structureText = `The clock shows ${timeStr}. ${name} is ${activity}. Is the time in a.m. or p.m.?`;
    shortText = `${timeStr} (${activity}). a.m. or p.m.?`;
    
    structureSteps = [
      { label: "Based on the clues, this happens in the:", expectedAnswer: isMorning ? "morning" : "afternoon/night" },
      { label: "So, the time is:", expectedAnswer: actualAnswer }
    ];

    hintStr = `Remember that a.m. is from midnight to morning, and p.m. is from noon to night.`;
    stepsStr = `"""1. Based on the clues, this happens in the ${isMorning ? 'morning' : 'afternoon/night'}.\\n2. So, the time is ${actualAnswer}."""`;

    if (isMCQ) {
      mcqOptions = ["a.m.", "p.m."];
    }
  } else if (activeVariant === 'foundation_time_duration_later') {
    const durationHours = getRandomInt(1, 3);
    const startHour = getRandomInt(1, 12 - durationHours - 1); // Ensure it doesn't cross 12
    const min = Math.random() > 0.5 ? 0 : 30;
    const isAm = Math.random() > 0.5;
    
    // We avoid crossing 12 to keep foundation level simple
    const amPm = isAm ? "a.m." : "p.m.";

    const startTimeStr = formatTime(startHour, min);
    const endHour = startHour + durationHours;
    actualAnswer = `${formatTime(endHour, min)} ${amPm}`;
    
    const durationText = durationHours === 1 ? '1 hour' : `${durationHours} hours`;

    structureText = `What is the time ${durationText} after ${startTimeStr} ${amPm}?`;
    shortText = `${durationText} after ${startTimeStr} ${amPm}:`;

    hintStr = `To find ${durationText} later, add ${durationHours} to the hour. The minutes stay the same.`;
    stepsStr = `"""1. Start time is ${startTimeStr} ${amPm}.\\n2. Add ${durationText} to ${startHour}.\\n3. ${startHour} + ${durationHours} = ${endHour}.\\n4. The time is ${actualAnswer}."""`;

    structureSteps = [
      { label: "Start hour:", expectedAnswer: String(startHour) },
      { label: `Hour after adding ${durationHours}:`, expectedAnswer: String(endHour) },
      { label: "Final Time:", expectedAnswer: actualAnswer }
    ];

    if (isMCQ) {
      const wrong1 = `${formatTime(startHour - durationHours <= 0 ? 12 : startHour - durationHours, min)} ${amPm}`; // X hours earlier
      const wrong2 = `${formatTime(endHour, min === 0 ? 30 : 0)} ${amPm}`; // wrong minutes
      const wrong3 = `${formatTime(startHour, min)} ${amPm}`; // same time
      mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
    }
  }

  const askText = getQText(structureText, shortText);

  if (isStructure) {
    const stepsJson = structureSteps.map(step => 
      `{"label": "${step.label}", "expectedAnswer": "${step.expectedAnswer}", "acceptedAnswers": []}`
    ).join(",\n        ");
    
    inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
      ${stepsJson}
    ]}`;
  } else if (isMCQ) {
    inputRequirementStr = `null`;
  } else {
    inputRequirementStr = `{"inputType": "TEXT_INPUT"}`;
  }

  if (isMCQ) {
    if (activeVariant.includes('am_pm')) {
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for hint and solutionSteps. DO NOT rephrase them!
For questionText, write a 2-3 sentence story where ${name} is doing activities. The story MUST give contextual clues that it is happening in the ${actualAnswer === 'a.m.' ? 'morning' : 'afternoon/night'} (e.g. ${activity}). Do NOT explicitly use the words 'morning', 'afternoon', 'night', 'a.m.', or 'p.m.'. End the story by stating: 'The clock shows ${timeStr}. Is the time in a.m. or p.m.?'

Use EXACTLY:
questionText: ["Write the 2-3 sentence story here based on the instructions above"]
finalAnswer: """${actualAnswer}"""
hint: """${hintStr}"""
solutionSteps: ${stepsStr}

Generate exactly ${mcqOptions.length} options: ${mcqOptions.map(o => `"${o}"`).join(', ')}.
The defectMap should map the incorrect options to "TIME_READING_ERROR" or "AM_PM_ERROR".
`;
    } else {
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
The defectMap should map the incorrect options to "TIME_READING_ERROR" or "AM_PM_ERROR".
`;
    }
  } else {
    if (activeVariant.includes('am_pm')) {
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for hint and solutionSteps. DO NOT rephrase them!
For questionText, write a 2-3 sentence story where ${name} is doing activities. The story MUST give contextual clues that it is happening in the ${actualAnswer === 'a.m.' ? 'morning' : 'afternoon/night'} (e.g. ${activity}). Do NOT explicitly use the words 'morning', 'afternoon', 'night', 'a.m.', or 'p.m.'. End the story by stating: 'The clock shows ${timeStr}. Is the time in a.m. or p.m.?'

Use EXACTLY:
questionText: ["Write the 2-3 sentence story here based on the instructions above"]
finalAnswer: """${actualAnswer}"""
hint: """${hintStr}"""
solutionSteps: ${stepsStr}
`;
    } else {
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: ["${askText}"]
finalAnswer: """${actualAnswer}"""
hint: """${hintStr}"""
solutionSteps: ${stepsStr}
`;
    }
  }

  const aiPrompt = systemPrompt + "\\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
}
