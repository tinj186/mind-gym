import { getRandomNames, getTimeActivities } from '@/lib/utils/variable-bank';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const standardLogic = (activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions) => {
  let structureText = '';
  let shortText = '';
  let actualAnswer = '';
  let mcqOptions = [];
  let hintStr = '';
  let stepsStr = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = '';
  let structureSteps = [];

  const names = getRandomNames(2);

  if (activeVariant === 'standard_recurring_event_conversion') {
    const validPairs = [[1, 2], [1, 3], [1, 4], [1, 5], [2, 2], [2, 3], [3, 2]];
    const [hours, days] = validPairs[Math.floor(Math.random() * validPairs.length)];
    const totalHours = hours * days;
    const totalMins = totalHours * 60;
    
    const repeatedAdditionStr = Array(totalHours).fill(60).join(" + ");
    
    // "Siti reads for 1 hour each day for 3 days. How many total minutes did she read?"
    structureText = `${names[0]} reads for ${hours} hour${hours > 1 ? 's' : ''} each day for ${days} days. How many total minutes did ${names[0]} read?`;
    shortText = `${hours} hour${hours > 1 ? 's' : ''} a day for ${days} days is how many minutes?`;
    actualAnswer = `${totalMins} minutes`;
    hintStr = `Find the total number of hours first by multiplying ${hours} and ${days}. Then convert the total hours to minutes!`;
    
    stepsStr = JSON.stringify([
      `First, find the total hours ${names[0]} read over ${days} days.`,
      `${days} × ${hours} = ${totalHours} hours.`,
      `We know 1 hour = 60 minutes.`,
      `Convert ${totalHours} hours to minutes: ${repeatedAdditionStr} = ${totalMins} minutes.`
    ]);

    structureSteps = [
      { label: `Total hours:`, expectedAnswer: `${days} * ${hours} = ${totalHours}` },
      { label: `Total minutes:`, expectedAnswer: `${repeatedAdditionStr} = ${totalMins}` }
    ];

    if (isMCQ) {
      mcqOptions = [
        `${totalMins} minutes`,
        `${(totalHours + 1) * 60} minutes`,
        `${totalHours * 30} minutes`,
        `${(totalHours - 1 > 0 ? totalHours - 1 : totalHours + 2) * 60} minutes`
      ];
    }
  } else if (activeVariant === 'standard_combined_activities_conversion') {
    const hourVal = getRandomInt(1, 2);
    const halfHourVal = getRandomInt(1, 3);
    const totalMins = (hourVal * 60) + (halfHourVal * 30);
    
    const halfStr = halfHourVal === 1 ? "half an hour" : `${halfHourVal} half-hours`;
    const hourStr = hourVal === 1 ? "1 hour" : `${hourVal} hours`;
    
    const transportModes = ["bus ride", "train ride", "plane flight", "bicycle ride", "ferry ride"];
    const activityModes = ["walking", "running", "driving", "jogging", "hiking"];
    
    const transport = transportModes[getRandomInt(0, transportModes.length - 1)];
    const activity = activityModes[getRandomInt(0, activityModes.length - 1)];
    
    const hourRepeatedAddition = Array(hourVal).fill(60).join(" + ");
    const hourStep = hourVal === 1 ? `60` : `${hourRepeatedAddition} = ${hourVal * 60}`;
    const halfHourStep = halfHourVal === 1 ? `30` : `${halfHourVal} * 30 = ${halfHourVal * 30}`;
    
    const unknownType = getRandomInt(1, 3); // 1: C (total), 2: A (transport), 3: B (activity)
    
    if (unknownType === 1) { // Unknown C (Total)
      structureText = `A ${transport} takes ${hourStr} and ${activity} takes ${halfStr}. How many minutes is the entire journey?`;
      shortText = `Transport: ${hourStr}. Activity: ${halfStr}. Entire journey in mins:`;
      actualAnswer = `${totalMins} minutes`;
      hintStr = `Convert both times into minutes first. ${hourStr} is ${hourVal * 60} minutes, and each half-hour is 30 minutes. Then add them up!`;
      
      stepsStr = JSON.stringify([
        `Convert the ${transport} time to minutes: ${hourStr} = ${hourStep} minutes.`,
        `Convert the ${activity} time to minutes: ${halfStr} = ${halfHourStep} minutes.`,
        `Add them together: ${hourVal * 60} + ${halfHourVal * 30} = ${totalMins} minutes.`
      ]);

      structureSteps = [
        { label: `First part in minutes:`, expectedAnswer: hourStep },
        { label: `Second part in minutes:`, expectedAnswer: halfHourStep },
        { label: `Entire journey:`, expectedAnswer: `${hourVal * 60} + ${halfHourVal * 30} = ${totalMins}` }
      ];
    } else if (unknownType === 2) { // Unknown A (Transport)
      structureText = `An entire journey takes ${totalMins} minutes. ${activity} takes ${halfStr}. How many minutes does the ${transport} take?`;
      shortText = `Entire journey: ${totalMins} mins. Activity: ${halfStr}. Transport in mins:`;
      actualAnswer = `${hourVal * 60} minutes`;
      hintStr = `Convert the ${activity} time to minutes first. Then subtract it from the entire journey time!`;
      
      stepsStr = JSON.stringify([
        `Convert the ${activity} time to minutes: ${halfStr} = ${halfHourStep} minutes.`,
        `Subtract the ${activity} time from the total journey time.`,
        `${totalMins} - ${halfHourVal * 30} = ${hourVal * 60} minutes.`
      ]);

      structureSteps = [
        { label: `${activity} in minutes:`, expectedAnswer: halfHourStep },
        { label: `${transport} in minutes:`, expectedAnswer: `${totalMins} - ${halfHourVal * 30} = ${hourVal * 60}` }
      ];
    } else { // Unknown B (Activity)
      structureText = `An entire journey takes ${totalMins} minutes. A ${transport} takes ${hourStr}. How many minutes does ${activity} take?`;
      shortText = `Entire journey: ${totalMins} mins. Transport: ${hourStr}. Activity in mins:`;
      actualAnswer = `${halfHourVal * 30} minutes`;
      hintStr = `Convert the ${transport} time to minutes first. Then subtract it from the entire journey time!`;
      
      stepsStr = JSON.stringify([
        `Convert the ${transport} time to minutes: ${hourStr} = ${hourStep} minutes.`,
        `Subtract the ${transport} time from the total journey time.`,
        `${totalMins} - ${hourVal * 60} = ${halfHourVal * 30} minutes.`
      ]);

      structureSteps = [
        { label: `${transport} in minutes:`, expectedAnswer: hourStep },
        { label: `${activity} in minutes:`, expectedAnswer: `${totalMins} - ${hourVal * 60} = ${halfHourVal * 30}` }
      ];
    }
    
    if (isMCQ) {
      const ansVal = unknownType === 1 ? totalMins : (unknownType === 2 ? hourVal * 60 : halfHourVal * 30);
      mcqOptions = [
        `${ansVal} minutes`,
        `${ansVal + 30} minutes`,
        `${ansVal - 30 > 0 ? ansVal - 30 : ansVal + 60} minutes`,
        `${ansVal + 10} minutes`
      ];
    }
    
    const p1 = "0";
    const p2 = (unknownType === 2) ? "?" : "";
    const p3 = (unknownType === 1) ? "?" : `${totalMins}`;
    
    visualEngineStr = JSON.stringify({
      componentToRender: "TIMELINE",
      componentData: {
        points: [
          { label: p1 },
          { label: p2 },
          { label: p3 }
        ],
        jumps: [
          { startIndex: 0, endIndex: 1, label: unknownType === 2 ? `? (${transport})` : `${hourStr} (${transport})` },
          { startIndex: 1, endIndex: 2, label: unknownType === 3 ? `? (${activity})` : `${halfStr} (${activity})` }
        ]
      }
    });
  } else if (activeVariant === 'standard_schedule_duration_comparison') {
    const isLonger = Math.random() > 0.5;
    
    // Randomize threshold to either 1 hour (60 mins) or half an hour (30 mins)
    const thresholdIsHour = Math.random() > 0.5;
    const thresholdMins = thresholdIsHour ? 60 : 30;
    const thresholdText = thresholdIsHour ? "1 hour" : "half an hour";
    
    let durationMins;
    if (thresholdIsHour) {
      durationMins = isLonger ? getRandomInt(7, 9) * 10 : getRandomInt(3, 5) * 10; // 70-90 or 30-50
    } else {
      durationMins = isLonger ? getRandomInt(4, 5) * 10 : getRandomInt(1, 2) * 10; // 40-50 or 10-20
    }
    
    const startHour = getRandomInt(1, 4);
    const startMin = getRandomInt(0, 5) * 10;
    
    let endHour = startHour;
    let endMin = startMin + durationMins;
    if (endMin >= 60) {
      endHour += Math.floor(endMin / 60);
      endMin = endMin % 60;
    }
    
    const formatTime = (h, m) => {
      let suffix = "a.m.";
      let dH = h;
      if (dH >= 12) {
        suffix = "p.m.";
        if (dH > 12) dH -= 12;
      }
      return `${dH}:${m.toString().padStart(2, '0')} ${suffix}`;
    };
    
    const startTimeStr = formatTime(startHour, startMin);
    const endTimeStr = formatTime(endHour, endMin);
    
    const busServices = ["Bus 14", "Bus 65", "Bus 190"];
    const mrtLines = ["East-West Line (EWL)", "North-South Line (NSL)", "Circle Line (CCL)"];

    const scenarios = [
      { type: 'event', title: "School Timetable", e1: "Science", e2: "Math", e3: "Recess" },
      { type: 'event', title: "TV Guide", e1: "Morning Cartoon", e2: "News Update", e3: "Documentary" },
      { type: 'transit', title: `${busServices[getRandomInt(0, busServices.length - 1)]} Schedule`, e1: "Bedok Interchange", e2: "East Coast Park", e3: "Orchard Road" },
      { type: 'transit', title: `${mrtLines[getRandomInt(0, mrtLines.length - 1)]} Schedule`, e1: "Pasir Ris MRT", e2: "Tampines MRT", e3: "City Hall MRT" }
    ];
    
    const scenario = scenarios[getRandomInt(0, scenarios.length - 1)];
    const targetEvent = scenario.e1;
    const targetNextEvent = scenario.e2;
    
    visualEngineStr = JSON.stringify({
      componentToRender: "TIMETABLE",
      componentData: {
        title: scenario.title,
        rows: [
          { time: startTimeStr, event: scenario.e1 },
          { time: endTimeStr, event: scenario.e2 },
          { time: formatTime(endHour + 1, endMin), event: scenario.e3 }
        ]
      }
    });

    const isTransit = scenario.type === 'transit';
    actualAnswer = isLonger ? `Longer` : `Shorter`;
    
    if (isTransit) {
      structureText = `Look at the timetable above. Is the travel time from ${targetEvent} to ${targetNextEvent} longer or shorter than ${thresholdText}?`;
      shortText = `Travel time from ${targetEvent} to ${targetNextEvent}: longer or shorter than ${thresholdText}?`;
      hintStr = `First calculate how many minutes the trip from ${targetEvent} to ${targetNextEvent} takes. Then compare it to ${thresholdText} (${thresholdMins} minutes).`;
      
      stepsStr = JSON.stringify([
        `The trip from ${targetEvent} to ${targetNextEvent} starts at ${startTimeStr} and ends at ${endTimeStr}.`,
        `The duration is ${durationMins} minutes.`,
        `${thresholdIsHour ? '1 hour' : 'Half an hour'} = ${thresholdMins} minutes.`,
        `Since ${durationMins} minutes is ${isLonger ? 'more' : 'less'} than ${thresholdMins} minutes, it is ${isLonger ? 'longer' : 'shorter'} than ${thresholdText}.`
      ]);

      structureSteps = [
        { label: `Travel time in minutes:`, expectedAnswer: `${durationMins}` },
        { label: `${thresholdIsHour ? '1 hour' : 'Half an hour'} in minutes:`, expectedAnswer: `${thresholdMins}` },
        { label: `Longer or shorter?`, expectedAnswer: actualAnswer }
      ];
    } else {
      const eventName = targetEvent.includes("Class") ? targetEvent : targetEvent;

      structureText = `Look at the timetable above. Is the ${eventName} longer or shorter than ${thresholdText}?`;
      shortText = `Is ${eventName} longer or shorter than ${thresholdText}?`;
      hintStr = `First calculate how many minutes the ${eventName} takes. Then compare it to ${thresholdText} (${thresholdMins} minutes).`;
      
      stepsStr = JSON.stringify([
        `${targetEvent} starts at ${startTimeStr} and ends at ${endTimeStr}.`,
        `The duration is ${durationMins} minutes.`,
        `${thresholdIsHour ? '1 hour' : 'Half an hour'} = ${thresholdMins} minutes.`,
        `Since ${durationMins} minutes is ${isLonger ? 'more' : 'less'} than ${thresholdMins} minutes, it is ${isLonger ? 'longer' : 'shorter'} than ${thresholdText}.`
      ]);

      structureSteps = [
        { label: `${targetEvent} duration in minutes:`, expectedAnswer: `${durationMins}` },
        { label: `${thresholdIsHour ? '1 hour' : 'Half an hour'} in minutes:`, expectedAnswer: `${thresholdMins}` },
        { label: `Longer or shorter?`, expectedAnswer: actualAnswer }
      ];
    }

    isMCQ = true;
    mcqOptions = ["Longer", "Shorter"];
  } else if (activeVariant === 'standard_minutes_to_complete_hour') {
    const isMorning = Math.random() > 0.5;
    const activityObj = getTimeActivities(1, isMorning);
    let activityText = activityObj.text; // e.g. "eating breakfast"
    if (activityText.startsWith("having ") || activityText.startsWith("eating ") || activityText.startsWith("watching ") || activityText.startsWith("going ")) {
      // Just keep as is
    } else {
      // try to replace generic verb with something that flows, though 'text' from variable bank is usually 'verb-ing ...'
    }
    
    // For grammar: "John wants to spend 1 hour [eating breakfast]." 
    // Or we can just use simple string manipulation.
    // Actually, "wants to spend 1 hour eating breakfast" is fine.
    // "John has spent 20 minutes eating breakfast."
    
    const hours = getRandomInt(1, 3);
    const totalMinsTarget = hours * 60;
    const elapsedMins = getRandomInt(2, 5) * 10; // 20, 30, 40, 50
    const remainingMins = totalMinsTarget - elapsedMins;
    
    structureText = `${names[0]} wants to spend ${hours} hour${hours > 1 ? 's' : ''} ${activityText}. ${names[0]} has spent ${elapsedMins} minutes ${activityText}. How many more minutes does ${names[0]} need?`;
    shortText = `Total goal: ${hours} hour${hours > 1 ? 's' : ''}. Completed: ${elapsedMins} mins. Mins left:`;
    actualAnswer = `${remainingMins} minutes`;
    hintStr = `Convert ${hours} hour${hours > 1 ? 's' : ''} to minutes first. Then subtract the ${elapsedMins} minutes ${names[0]} has already spent!`;
    
    const repeatedAdditionStr = hours === 1 ? '60' : `${Array(hours).fill(60).join(" + ")} = ${totalMinsTarget}`;
    
    stepsStr = JSON.stringify([
      `First, convert the total time to minutes.`,
      `${hours} hour${hours > 1 ? 's' : ''} = ${repeatedAdditionStr} minutes.`,
      `Subtract the time already spent to find the remaining time.`,
      `${totalMinsTarget} - ${elapsedMins} = ${remainingMins} minutes.`
    ]);

    structureSteps = [
      { label: `Total goal in minutes:`, expectedAnswer: repeatedAdditionStr },
      { label: `Minutes left to complete:`, expectedAnswer: `${totalMinsTarget} - ${elapsedMins} = ${remainingMins}` }
    ];

    if (isMCQ) {
      mcqOptions = [
        `${remainingMins} minutes`,
        `${remainingMins + 10} minutes`,
        `${remainingMins - 10 > 0 ? remainingMins - 10 : remainingMins + 20} minutes`,
        `${totalMinsTarget + elapsedMins} minutes`
      ];
    }
  } else if (activeVariant === 'standard_four_operations_substitution') {
    const op = getRandomInt(1, 4); // 1: add, 2: sub, 3: mul, 4: div
    const isMorning = Math.random() > 0.5;
    const activityText = getTimeActivities(1, isMorning).text;
    
    let totalMins;
    
    if (op === 1) { // addition
      const hours = getRandomInt(1, 2);
      const extraMins = getRandomInt(1, 4) * 5; // 5, 10, 15, 20
      totalMins = (hours * 60) + extraMins;
      
      structureText = `${names[0]} planned to spend ${hours} hour${hours > 1 ? 's' : ''} ${activityText}, but took an extra ${extraMins} minutes. How many minutes did ${names[0]} take in total?`;
      shortText = `Base time: ${hours} hour${hours > 1 ? 's' : ''}. Extra time: ${extraMins} mins. Total time in mins:`;
      hintStr = `Convert ${hours} hour${hours > 1 ? 's' : ''} to minutes, then add the extra ${extraMins} minutes.`;
      
      const repeatedAdditionStr = hours === 1 ? '60' : `${Array(hours).fill(60).join(" + ")} = ${hours * 60}`;
      
      stepsStr = JSON.stringify([
        `${hours} hour${hours > 1 ? 's' : ''} = ${repeatedAdditionStr} minutes.`,
        `Add the extra time: ${hours * 60} + ${extraMins} = ${totalMins} minutes.`
      ]);
      
      structureSteps = [
        { label: `${hours} hour${hours > 1 ? 's' : ''} in minutes:`, expectedAnswer: repeatedAdditionStr },
        { label: `Total time in minutes:`, expectedAnswer: `${hours * 60} + ${extraMins} = ${totalMins}` }
      ];
    } else if (op === 2) { // subtraction
      const hours = getRandomInt(1, 2);
      const lessMins = getRandomInt(2, 5) * 5; // 10, 15, 20, 25
      totalMins = (hours * 60) - lessMins;
      
      structureText = `${names[0]} had ${hours} hour${hours > 1 ? 's' : ''} for ${activityText}. ${names[0]} finished ${lessMins} minutes early. How many minutes did ${names[0]} take?`;
      shortText = `Allowed time: ${hours} hour${hours > 1 ? 's' : ''}. Finished ${lessMins} mins early. Mins taken:`;
      hintStr = `Convert ${hours} hour${hours > 1 ? 's' : ''} to minutes, then subtract the ${lessMins} minutes since ${names[0]} finished early.`;
      
      const repeatedAdditionStr = hours === 1 ? '60' : `${Array(hours).fill(60).join(" + ")} = ${hours * 60}`;
      
      stepsStr = JSON.stringify([
        `${hours} hour${hours > 1 ? 's' : ''} = ${repeatedAdditionStr} minutes.`,
        `Subtract the early finish time: ${hours * 60} - ${lessMins} = ${totalMins} minutes.`
      ]);
      
      structureSteps = [
        { label: `${hours} hour${hours > 1 ? 's' : ''} in minutes:`, expectedAnswer: repeatedAdditionStr },
        { label: `Time taken in minutes:`, expectedAnswer: `${hours * 60} - ${lessMins} = ${totalMins}` }
      ];
    } else if (op === 3) { // multiplication
      const baseHour = 1;
      const times = getRandomInt(2, 5); // 2, 3, 4, 5
      totalMins = (baseHour * 60) * times;
      
      structureText = `${names[0]} spends ${baseHour} hour ${activityText} each day for ${times} days. How many minutes does ${names[0]} spend in total?`;
      shortText = `${baseHour} hour each day for ${times} days. Total mins:`;
      hintStr = `Convert ${baseHour} hour to minutes first, then multiply by ${times} days (or add it ${times} times).`;
      
      const repeatedAdditionStr = `${Array(times).fill(60).join(" + ")} = ${totalMins}`;
      
      stepsStr = JSON.stringify([
        `${baseHour} hour = 60 minutes.`,
        `For ${times} days: ${repeatedAdditionStr} minutes.`
      ]);
      
      structureSteps = [
        { label: `${baseHour} hour in minutes:`, expectedAnswer: `60` },
        { label: `Total time in minutes:`, expectedAnswer: repeatedAdditionStr }
      ];
    } else { // division
      const hours = getRandomInt(1, 2);
      const parts = 2;
      totalMins = (hours * 60) / parts;
      
      structureText = `${names[0]} splits ${hours} hour${hours > 1 ? 's' : ''} of ${activityText} equally into ${parts} parts. How many minutes is each part?`;
      shortText = `${hours} hour${hours > 1 ? 's' : ''} split equally into ${parts} parts. Mins each part:`;
      hintStr = `Convert ${hours} hour${hours > 1 ? 's' : ''} to minutes, then divide by ${parts}.`;
      
      const repeatedAdditionStr = hours === 1 ? '60' : `${Array(hours).fill(60).join(" + ")} = ${hours * 60}`;
      
      stepsStr = JSON.stringify([
        `${hours} hour${hours > 1 ? 's' : ''} = ${repeatedAdditionStr} minutes.`,
        `Split into ${parts} parts: ${hours * 60} ÷ ${parts} = ${totalMins} minutes.`
      ]);
      
      structureSteps = [
        { label: `${hours} hour${hours > 1 ? 's' : ''} in minutes:`, expectedAnswer: repeatedAdditionStr },
        { label: `Minutes each part:`, expectedAnswer: `${hours * 60} / ${parts} = ${totalMins}` }
      ];
    }
    
    actualAnswer = `${totalMins} minutes`;
    
    if (isMCQ) {
      mcqOptions = [
        `${totalMins} minutes`,
        `${totalMins + 15} minutes`,
        `${totalMins - 10 > 0 ? totalMins - 10 : totalMins + 20} minutes`,
        `${totalMins + 30} minutes`
      ];
    }
  }

  // Common multi-step logic
  if (isStructure) {
    inputRequirementStr = `{\n  "inputType": "MULTI_STEP_INPUT",\n  "steps": [\n${structureSteps.map(s => `    { "label": "${s.label}", "expectedAnswer": "${s.expectedAnswer}", "acceptedAnswers": [] }`).join(',\n')}\n  ]\n}`;
  } else {
    inputRequirementStr = `{"inputType": "TEXT_INPUT"}`;
  }

  // Shuffle MCQ options if applicable
  if (isMCQ && mcqOptions.length > 0) {
    mcqOptions = mcqOptions.sort(() => Math.random() - 0.5);
  }

  const aiPrompt = `
You are an expert Primary 2 math teacher.
Generate a valid JSON object representing a math question.

CRITICAL INSTRUCTIONS:
- questionText: MUST be an array of strings. Break the question into multiple lines if needed.
- ${isStructure ? 'The output MUST match the MULTI_STEP format specified below.' : (isMCQ ? 'The output MUST provide the multiple choice options.' : 'The output MUST NOT provide options or multi-step input.')}
- EXACTLY use the following text as the question:
  ${getQText(structureText, shortText)}
- EXACTLY use the following as the finalAnswer:
  "${actualAnswer}"
- Use the following steps for the solution (do NOT add numbers like "1." yourself):
  ${stepsStr}
- Use the following hint:
  "${hintStr}"
${isMCQ ? `- EXACTLY use these options: ${JSON.stringify(mcqOptions)}` : ''}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `;

  return { aiPrompt };
};
