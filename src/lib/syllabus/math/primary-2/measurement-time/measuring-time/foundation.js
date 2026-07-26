import { getRandomNames } from '../../../../../utils/variable-bank';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function foundationLogic(activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions) {
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
    if (total <= 0) total += 12 * 60; // handle wrap around backwards
    
    let newH = Math.floor(total / 60) % 12;
    if (newH === 0) newH = 12;
    let newM = total % 60;
    return { h: newH, m: newM };
  };

  if (activeVariant === 'foundation_estimate_activity_duration') {
    const isHours = Math.random() > 0.5;
    
    const hourActivities = [
      { name: "Sleeping at night", duration: 8, label: "8 hours", startHours: [9, 10, 11] },
      { name: "A day at school", duration: 6, label: "6 hours", startHours: [7, 8] },
      { name: "Watching a movie", duration: 2, label: "2 hours", startHours: [2, 7, 8] }
    ];
    
    const minActivities = [
      { name: "School recess", duration: 0.5, label: "30 minutes", startHours: [9, 10, 11] },
      { name: "Eating dinner", duration: 0.5, label: "30 minutes", startHours: [6, 7, 8] },
      { name: "Watching a cartoon", duration: 0.5, label: "30 minutes", startHours: [3, 4, 5] }
    ];

    const pool = isHours ? hourActivities : minActivities;
    const item = pool[getRandomInt(0, pool.length - 1)];
    const names = getRandomNames(1);
    const person = names[0];
    
    const startHour = item.startHours[getRandomInt(0, item.startHours.length - 1)];
    const startMin = isHours ? 0 : (Math.random() > 0.5 ? 0 : 30);
    const startTimeStr = formatTime(startHour, startMin);
    
    const addMins = isHours ? item.duration * 60 : 30;
    const { h: endH, m: endM } = calculateNewTime(startHour, startMin, addMins, true);
    const endTimeStr = formatTime(endH, endM);
    
    const allActivities = [...hourActivities, ...minActivities].filter(a => a.name !== item.name);
    allActivities.sort(() => Math.random() - 0.5);
    const optionsList = [item.name, allActivities[0].name, allActivities[1].name, allActivities[2].name].sort(() => Math.random() - 0.5);

    actualAnswer = item.name;
    
    if (isMCQ) {
      structureText = `${person} started an activity at ${startTimeStr} and ended at ${endTimeStr}. Which activity is this most likely to be?`;
      shortText = `Activity from ${startTimeStr} to ${endTimeStr}:`;
      mcqOptions = optionsList;
    } else {
      structureText = `${person} started an activity at ${startTimeStr} and ended at ${endTimeStr}. Which activity is this most likely to be? (Choose from: ${optionsList.join(', ')})`;
      shortText = `Activity from ${startTimeStr} to ${endTimeStr} (${optionsList.join(', ')}):`;
    }

    hintStr = `First, calculate the duration from ${startTimeStr} to ${endTimeStr}. Then think about which activity usually takes that long!`;
    
    stepsStr = JSON.stringify([
      `1. The activity started at ${startTimeStr} and ended at ${endTimeStr}.`,
      `2. The duration from ${startTimeStr} to ${endTimeStr} is ${item.label}.`,
      `3. An activity that usually takes ${item.label} is ${item.name}.`,
      `4. So the most likely activity is ${item.name}.`
    ]);

    structureSteps = [
      { label: "Duration of activity:", expectedAnswer: item.label },
      { label: "Most likely activity:", expectedAnswer: item.name }
    ];
  } else if (activeVariant === 'foundation_duration_timeline_counting') {
    const isHourJumps = Math.random() > 0.5;
    const startHour = getRandomInt(1, 8);
    const startMin = isHourJumps ? 0 : (Math.random() > 0.5 ? 0 : 30);
    const numJumps = getRandomInt(2, 4);
    
    const jumpMins = isHourJumps ? 60 : 30;
    const jumpLabel = isHourJumps ? "1 hour" : "30 mins";
    
    let points = [];
    let jumps = [];
    let currentH = startHour;
    let currentM = startMin;
    
    for (let i = 0; i <= numJumps; i++) {
      points.push({ label: formatTime(currentH, currentM) });
      if (i < numJumps) {
        jumps.push({ startIndex: i, endIndex: i + 1, label: `+ ${jumpLabel}` });
        const nextTime = calculateNewTime(currentH, currentM, jumpMins, true);
        currentH = nextTime.h;
        currentM = nextTime.m;
      }
    }
    
    const startTimeStr = formatTime(startHour, startMin);
    const endTimeStr = formatTime(currentH, currentM);
    
    actualAnswer = isHourJumps ? `${numJumps} hour${numJumps > 1 ? 's' : ''}` : `${numJumps * 30} minutes`;
    
    structureText = `A timeline shows jumps of ${jumpLabel} from ${startTimeStr} to ${endTimeStr}. By counting the jumps, what is the total duration?`;
    shortText = `Timeline shows ${numJumps} jumps of ${jumpLabel}. Total duration:`;
    hintStr = `Count the number of jumps on the timeline. There are ${numJumps} jumps of ${jumpLabel} each.`;
    
    stepsStr = JSON.stringify([
      `1. The timeline starts at ${startTimeStr} and ends at ${endTimeStr}.`,
      `2. There are ${numJumps} jumps of ${jumpLabel}.`,
      `3. ${numJumps} jumps of ${jumpLabel} is ${actualAnswer}.`,
      `4. The total duration is ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: "Number of jumps:", expectedAnswer: String(numJumps) },
      { label: "Total duration:", expectedAnswer: actualAnswer }
    ];

    visualEngineStr = `{
      "componentToRender": "TIMELINE",
      "componentData": {
        "points": ${JSON.stringify(points)},
        "jumps": ${JSON.stringify(jumps)}
      }
    }`;

    if (isMCQ) {
      if (isHourJumps) {
        mcqOptions = [
          actualAnswer,
          `${numJumps + 1} hours`,
          `${numJumps - 1 <= 0 ? 12 : numJumps - 1} hours`,
          `${numJumps * 30} minutes`
        ];
      } else {
        mcqOptions = [
          actualAnswer,
          `${numJumps} hours`,
          `${(numJumps + 1) * 30} minutes`,
          `${numJumps * 15} minutes`
        ];
      }
    }
  } else if (activeVariant === 'foundation_time_multiple_hours_later') {
    const isLater = Math.random() > 0.5;
    const startHour = getRandomInt(1, 12);
    const startMin = 0;
    const numHours = getRandomInt(2, 4);
    
    const startTimeStr = formatTime(startHour, startMin);
    const { h: endH, m: endM } = calculateNewTime(startHour, startMin, numHours * 60, isLater);
    actualAnswer = formatTime(endH, endM);

    structureText = `What is the time ${numHours} hours ${isLater ? 'after' : 'before'} ${startTimeStr}?`;
    shortText = `${numHours} hours ${isLater ? 'after' : 'before'} ${startTimeStr}:`;
    hintStr = `${isLater ? 'Count forward' : 'Count backward'} by ${numHours} hours from ${startTimeStr}.`;
    
    stepsStr = JSON.stringify([
      `1. Start time is ${startTimeStr}.`,
      `2. We need to find the time ${numHours} hours ${isLater ? 'later' : 'earlier'}.`,
      `3. ${numHours} hours ${isLater ? 'after' : 'before'} ${startTimeStr} is ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: "Start time:", expectedAnswer: startTimeStr },
      { label: `Hours ${isLater ? 'later' : 'before'}:`, expectedAnswer: String(numHours) },
      { label: "Final time:", expectedAnswer: actualAnswer }
    ];

    if (isMCQ) {
      const wrong1 = formatTime(endH === 12 ? 1 : endH + 1, endM);
      const wrong2 = formatTime(endH === 1 ? 12 : endH - 1, endM);
      const wrong3 = formatTime(endH, 30);
      mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
    }
  } else if (activeVariant === 'foundation_time_multiple_half_hours_later') {
    const isLater = Math.random() > 0.5;
    const startHour = getRandomInt(1, 12);
    const startMin = Math.random() > 0.5 ? 0 : 30;
    const numHalfHours = getRandomInt(2, 4); // 2, 3, or 4 half-hours (60, 90, 120 mins)
    
    let durationString = '';
    if (numHalfHours === 2) durationString = '1 hour';
    else if (numHalfHours === 3) durationString = '1 hour 30 minutes';
    else if (numHalfHours === 4) durationString = '2 hours';

    const startTimeStr = formatTime(startHour, startMin);
    const { h: endH, m: endM } = calculateNewTime(startHour, startMin, numHalfHours * 30, isLater);
    actualAnswer = formatTime(endH, endM);

    structureText = `What is the time ${numHalfHours} half-hours (30-minute intervals) ${isLater ? 'after' : 'before'} ${startTimeStr}?`;
    shortText = `${numHalfHours} half-hours ${isLater ? 'after' : 'before'} ${startTimeStr}:`;
    hintStr = `Every 2 half-hours is 1 hour. First find out how many hours and minutes is in ${numHalfHours} half-hours, then find the time ${isLater ? 'after' : 'before'} ${startTimeStr}.`;
    
    stepsStr = JSON.stringify([
      `1. Start time is ${startTimeStr}.`,
      `2. ${numHalfHours} half-hours is ${numHalfHours * 30} minutes, which is ${durationString}.`,
      `3. To find the time, count ${durationString} ${isLater ? 'forward' : 'backward'} from ${startTimeStr}.`,
      `4. The final time is ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: "Start time:", expectedAnswer: startTimeStr },
      { label: `Duration for ${numHalfHours} half-hours:`, expectedAnswer: durationString },
      { label: "Final time:", expectedAnswer: actualAnswer }
    ];

    if (isMCQ) {
      const wrong1 = formatTime(endH === 12 ? 1 : endH + 1, endM);
      const wrong2 = formatTime(endH, endM === 0 ? 30 : 0);
      const wrong3 = formatTime(startHour, startMin === 0 ? 30 : 0);
      mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
    }
  } else if (activeVariant === 'foundation_duration_visual_clock_counting') {
    const isHourJumps = Math.random() > 0.5;
    const startHour = getRandomInt(1, 8);
    const startMin = isHourJumps ? 0 : (Math.random() > 0.5 ? 0 : 30);
    const numJumps = getRandomInt(2, 4);
    
    const jumpMins = isHourJumps ? 60 : 30;
    const { h: endH, m: endM } = calculateNewTime(startHour, startMin, numJumps * jumpMins, true);
    
    const startTimeStr = formatTime(startHour, startMin);
    const endTimeStr = formatTime(endH, endM);
    
    actualAnswer = isHourJumps ? `${numJumps} hour${numJumps > 1 ? 's' : ''}` : `${numJumps * 30} minutes`;
    
    structureText = `The first clock shows the start time (${startTimeStr}) and the second clock shows the end time (${endTimeStr}). How many ${isHourJumps ? '1-hour' : '30-minute'} intervals have passed?`;
    shortText = `Start: ${startTimeStr}, End: ${endTimeStr}. Total duration:`;
    if (isHourJumps) {
      hintStr = `Since both times are exact hours, you can subtract the start hour from the end hour to find the difference!`;
      stepsStr = JSON.stringify([
        `1. Start time is ${startTimeStr}.`,
        `2. End time is ${endTimeStr}.`,
        `3. Since they are exact hours, we can subtract the hours: ${endH} - ${startHour} = ${numJumps}.`,
        `4. So the duration is ${actualAnswer}.`
      ]);
      structureSteps = [
        { label: "Start time:", expectedAnswer: startTimeStr },
        { label: "End time:", expectedAnswer: endTimeStr },
        { label: "Equation (End - Start):", expectedAnswer: `${endH} - ${startHour} = ${numJumps}` },
        { label: "Total duration:", expectedAnswer: actualAnswer }
      ];
    } else {
      let hrMinsDuration = '';
      if (numJumps === 2) hrMinsDuration = '1 hour';
      else if (numJumps === 3) hrMinsDuration = '1 hour 30 minutes';
      else if (numJumps === 4) hrMinsDuration = '2 hours';

      hintStr = `Count the spaces the hour or minute hand moved! From ${startTimeStr} to ${endTimeStr} is ${hrMinsDuration}. Then change it to minutes!`;
      stepsStr = JSON.stringify([
        `1. Start time is ${startTimeStr}.`,
        `2. End time is ${endTimeStr}.`,
        `3. Counting from ${startTimeStr} to ${endTimeStr}, the duration is ${hrMinsDuration}.`,
        `4. Since 1 hour is 60 minutes, ${hrMinsDuration} is ${actualAnswer}.`
      ]);
      structureSteps = [
        { label: "Start time:", expectedAnswer: startTimeStr },
        { label: "End time:", expectedAnswer: endTimeStr },
        { label: "Duration in hours and minutes:", expectedAnswer: hrMinsDuration },
        { label: "Total duration in minutes:", expectedAnswer: actualAnswer }
      ];
    }

    visualEngineStr = `{
      "componentToRender": "MULTI_COMPONENT",
      "componentData": {
        "className": "gap-8",
        "components": [
          {
            "componentToRender": "CLOCK_DISPLAY",
            "componentData": {
              "hour": ${startHour},
              "minute": ${startMin},
              "displayType": "analog"
            }
          },
          {
            "componentToRender": "CLOCK_DISPLAY",
            "componentData": {
              "hour": ${endH},
              "minute": ${endM},
              "displayType": "analog"
            }
          }
        ]
      }
    }`;

    if (isMCQ) {
      if (isHourJumps) {
        mcqOptions = [
          actualAnswer,
          `${numJumps + 1} hours`,
          `${numJumps - 1 <= 0 ? 12 : numJumps - 1} hours`,
          `${numJumps * 30} minutes`
        ];
      } else {
        mcqOptions = [
          actualAnswer,
          `${numJumps} hours`,
          `${(numJumps + 1) * 30} minutes`,
          `${numJumps * 15} minutes`
        ];
      }
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

  let systemPrompt = getFormatInstructions(visualEngineStr, inputRequirementStr) + `
  
CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!
DO NOT ADD ANY CONTEXT OR EXTRA SENTENCES to the questionText. It must ONLY contain the single question asked.

Use EXACTLY:
questionText: ["${askText}"]
finalAnswer: """${actualAnswer}"""
hint: """${hintStr}"""
solutionSteps: ${stepsStr}
`;

  if (isMCQ) {
    systemPrompt += `
Generate exactly ${mcqOptions.length} options: ${mcqOptions.map(o => `"${o}"`).join(', ')}.
The defectMap should map the incorrect options to "TIME_CALCULATION_ERROR".
`;
  }
  
  return { aiPrompt: systemPrompt };
}
