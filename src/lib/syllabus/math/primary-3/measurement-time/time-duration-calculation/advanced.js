import { getRandomNames, getTimeActivities } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
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
    let period = h24 >= 12 && h24 < 24 ? 'p.m.' : 'a.m.';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    let mStr = m.toString().padStart(2, '0');
    return `${h12}:${mStr} ${period}`;
  };

  switch (activeVariant) {
    case 'advanced_crossing_ampm_a_b_c': {
      // Find Start/End/Duration, crossing am to pm or pm to am
      let isAmToPm = Math.random() < 0.5;
      
      let startH, endH;
      if (isAmToPm) {
        startH = Math.floor(Math.random() * 3) + 9; // 9, 10, 11
        endH = Math.floor(Math.random() * 2) + 12; // 12, 13 (1pm)
      } else {
        startH = Math.floor(Math.random() * 3) + 21; // 21 (9pm), 22, 23
        endH = Math.floor(Math.random() * 2) + 24; // 24 (12am), 25 (1am)
      }
      
      let startM = Math.floor(Math.random() * 16) + 13; // 13 to 28
      let endM = Math.floor(Math.random() * 16) + 13; // 13 to 28
      
      let totalMinsDuration = (endH * 60 + endM) - (startH * 60 + startM);
      let durH = Math.floor(totalMinsDuration / 60);
      let durM = totalMinsDuration % 60;
      
      let minsTo12 = 60 - startM;
      let hoursAfter12 = (endH % 12) === 0 ? 0 : (endH % 12);
      
      let startTime = format12h(startH % 24, startM);
      let endTime = format12h(endH % 24, endM);
      let midTime = isAmToPm ? "12:00 p.m." : "12:00 a.m.";
      
      let qType = Math.floor(Math.random() * 3); // 0: End time, 1: Start time, 2: Duration
      
      if (qType === 0) {
        // Find Ending Time
        answer = endTime;
        options = [
          endTime,
          format12h((endH + 1) % 24, endM),
          format12h(endH % 24, endM + 10),
          format12h((endH + 12) % 24, endM)
        ];
        
        let remMinsStr = hoursAfter12 > 0 ? `${hoursAfter12} h ${endM} min` : `${endM} min`;
        
        if (isStructure) {
          askText = `STORY: ${names[0]} started ${activities[0].text} at ${startTime}. It lasted for ${durH} hour(s) and ${durM} minutes.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time ${names[0]} finished.`;
          
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Write the working equation to find minutes from ${startTime} to ${midTime}:`, expectedAnswer: `60 - ${startM} = ${minsTo12}`, acceptedAnswers: makeEq(60, '-', startM, minsTo12) },
              { label: `Write the working equation to subtract ${minsTo12} mins from the total ${totalMinsDuration} mins:`, expectedAnswer: `${totalMinsDuration} - ${minsTo12} = ${totalMinsDuration - minsTo12}`, acceptedAnswers: makeEq(totalMinsDuration, '-', minsTo12, totalMinsDuration - minsTo12) },
              { label: `Convert remaining ${totalMinsDuration - minsTo12} mins to hours and mins:`, expectedAnswer: remMinsStr, acceptedAnswers: [remMinsStr, remMinsStr.replace('h', 'hour').replace('min', 'minutes')] },
              { label: `Finishing time (e.g., ${endTime}):`, expectedAnswer: endTime, acceptedAnswers: makeTimeAns(endTime) }
            ]
          });
        } else {
          askText = `${names[0]} started at ${startTime}. The duration is ${durH} hour(s) ${durM} minutes. What is the end time?`;
        }
        solutionSteps = `1. Minutes to ${midTime}: 60 - ${startM} = ${minsTo12} min.\n2. Remaining time: ${totalMinsDuration} - ${minsTo12} = ${totalMinsDuration - minsTo12} min.\n3. ${totalMinsDuration - minsTo12} min is ${remMinsStr}.\n4. Adding that to ${midTime} gives ${endTime}.`;
        hint = `First figure out how many minutes it takes to reach ${midTime}, then add the rest of the duration.`;
      } 
      else if (qType === 1) {
        // Find Starting Time
        answer = startTime;
        options = [
          startTime,
          format12h((startH - 1 + 24) % 24, startM),
          format12h(startH % 24, startM - 10 > 0 ? startM - 10 : startM + 10),
          format12h((startH + 12) % 24, startM)
        ];
        
        let minsAfter12 = (hoursAfter12 * 60) + endM;
        let remainingToSub = totalMinsDuration - minsAfter12;
        let subH = Math.floor(remainingToSub / 60);
        let subM = remainingToSub % 60;
        let subStr = subH > 0 ? `${subH} h ${subM} min` : `${subM} min`;
        
        if (isStructure) {
          askText = `STORY: ${names[0]} finished ${activities[0].text} at ${endTime}. The activity took ${durH} hour(s) and ${durM} minutes.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time ${names[0]} started.`;
          
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Time from ${midTime} to ${endTime} in minutes:`, expectedAnswer: `${minsAfter12}`, acceptedAnswers: [`${minsAfter12}`, `${minsAfter12} min`, `${minsAfter12} minutes`] },
              { label: `Write the working equation to subtract ${minsAfter12} from the total ${totalMinsDuration} mins:`, expectedAnswer: `${totalMinsDuration} - ${minsAfter12} = ${remainingToSub}`, acceptedAnswers: makeEq(totalMinsDuration, '-', minsAfter12, remainingToSub) },
              { label: `Convert remaining ${remainingToSub} mins to hours and mins:`, expectedAnswer: subStr, acceptedAnswers: [subStr, subStr.replace('h', 'hour').replace('min', 'minutes')] },
              { label: `Starting time (e.g., ${startTime}):`, expectedAnswer: startTime, acceptedAnswers: makeTimeAns(startTime) }
            ]
          });
        } else {
          askText = `${names[0]}'s end time is ${endTime}. The duration is ${durH} hour(s) and ${durM} minutes. What is the start time?`;
        }
        solutionSteps = `1. Time after ${midTime} is ${minsAfter12} mins.\n2. Subtract this from the total duration: ${totalMinsDuration} - ${minsAfter12} = ${remainingToSub} mins.\n3. Subtract ${remainingToSub} mins from ${midTime} gives ${startTime}.`;
        hint = `Work backwards to ${midTime} first, then subtract the remaining duration.`;
      }
      else {
        // Find Duration
        answer = `${durH} h ${durM} min`;
        options = [
          answer,
          `${durH} h ${durM + 10} min`,
          `${durH + 1} h ${durM} min`,
          `${totalMinsDuration} min`
        ];
        
        let minsAfter12 = (hoursAfter12 * 60) + endM;
        
        if (isStructure) {
          askText = `STORY: ${names[0]} started ${activities[0].text} at ${startTime} and finished at ${endTime}.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask how long the activity took in hours and minutes.`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Write the working equation to find the minutes from ${startTime} to ${midTime}:`, expectedAnswer: `60 - ${startM} = ${minsTo12}`, acceptedAnswers: makeEq(60, '-', startM, minsTo12) },
              { label: `Time from ${midTime} to ${endTime} in minutes:`, expectedAnswer: `${minsAfter12}`, acceptedAnswers: [`${minsAfter12}`, `${minsAfter12} min`, `${minsAfter12} minutes`] },
              { label: `Write the working equation to find total minutes:`, expectedAnswer: `${minsTo12} + ${minsAfter12} = ${totalMinsDuration}`, acceptedAnswers: makeEq(minsTo12, '+', minsAfter12, totalMinsDuration) },
              { label: `Total duration is ${durH} hour(s) and how many minutes?`, expectedAnswer: `${durM}`, acceptedAnswers: [`${durM}`, `${durM} min`, `${durM} minutes`] }
            ]
          });
        } else {
          askText = `Find ${names[0]}'s duration from ${startTime} to ${endTime}. Express the answer in hours and minutes.`;
        }
        solutionSteps = `1. Minutes to ${midTime}: 60 - ${startM} = ${minsTo12} min.\n2. Time after ${midTime} to ${endTime} is ${minsAfter12} min.\n3. Add them: ${minsTo12} + ${minsAfter12} = ${totalMinsDuration} min.\n4. Total duration: ${durH} h ${durM} min.`;
        hint = `Count the time to ${midTime} first, then add the time after ${midTime}.`;
      }
      break;
    }
    
    case 'advanced_comparing_durations_diff': {
      // Variant 12: Comparing Durations (Constant Difference)
      let personA = Math.floor(Math.random() * 16) + 38; // 38 to 53
      let diff = Math.floor(Math.random() * 16) + 13; // 13 to 28 (longer)
      let personB = personA + diff;
      
      let startH = Math.floor(Math.random() * 4) + 13; // 1 to 4 pm
      let startM = Math.floor(Math.random() * 16) + 13; // 13 to 28
      
      let tempH = startH;
      let totalM = startM + personB;
      let carryH = Math.floor(totalM / 60);
      let endM = totalM % 60;
      let endH = tempH + carryH;
      
      let startTime = format12h(startH, startM);
      let endTime = format12h(endH, endM);
      let isPm = endH >= 12 && endH < 24 ? "p.m." : "a.m.";
      
      answer = endTime;
      let trapH = startH + Math.floor((startM + personA) / 60);
      let trapM = (startM + personA) % 60;
      let trapTime = format12h(trapH, trapM);

      options = [
        endTime,
        trapTime, // If they used Person A's duration
        format12h(endH + 1, endM),
        format12h(endH, endM + 10 > 59 ? 59 : endM + 10)
      ];

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "COMPARISON",
          isStatic: true,
          bar1: { name: names[0], size: personA, layoutSize: personA, value: "?", segments: 1 },
          bar2: { name: names[1], size: personB, layoutSize: personB, value: "?", segments: 1 },
          diff: "?",
          whole: "?"
        }
      });

      if (isStructure) {
        askText = `STORY: ${names[0]} took ${personA} minutes to ${activities[0].text}. ${names[1]} took ${diff} minutes longer than ${names[0]}. If ${names[1]} started at ${startTime}, what time did he finish?\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask for ${names[1]}'s finishing time.`;
        let minsToHour = 60 - startM;
        let remainingToTarget = personB - minsToHour;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find ${names[1]}'s total duration in minutes:`, expectedAnswer: `${personA} + ${diff} = ${personB}`, acceptedAnswers: makeEq(personA, '+', diff, personB) },
            { label: `Write the working equation to find the minutes to reach ${format12h(startH + 1, 0)} from ${startTime}:`, expectedAnswer: `60 - ${startM} = ${minsToHour}`, acceptedAnswers: makeEq(60, '-', startM, minsToHour) },
            { label: `Write the working equation to find the remaining minutes to add after ${format12h(startH + 1, 0)}:`, expectedAnswer: `${personB} - ${minsToHour} = ${remainingToTarget}`, acceptedAnswers: makeEq(personB, '-', minsToHour, remainingToTarget) },
            { label: `${names[1]}'s finishing time (e.g., ${endTime}):`, expectedAnswer: endTime, acceptedAnswers: makeTimeAns(endTime) }
          ]
        });
      } else {
        askText = `${names[0]} took ${personA} minutes. ${names[1]} took ${diff} minutes longer. If ${names[1]} started at ${startTime}, what time did ${names[1]} finish?`;
      }
      
      solutionSteps = `1. ${names[1]}'s duration: ${personA} + ${diff} = ${personB} min.\n2. Minutes to next hour: 60 - ${startM} = ${60 - startM} min.\n3. Remaining minutes: ${personB} - ${60 - startM} = ${personB - (60 - startM)} min.\n4. Finishing time is ${endTime}.`;
      hint = `Find the second person's duration first, then add it to their starting time.`;
      break;
    }
    

    case 'advanced_total_deduction_hidden_break': {
      // Variant 14: Total Duration Deduction (Hidden Break)
      let startH = Math.floor(Math.random() * 3) + 7; // 7am to 9am
      let startM = Math.floor(Math.random() * 16) + 13; // 13 to 28
      let totalDurH = Math.floor(Math.random() * 2) + 2; // 2 to 3
      let totalDurM = 0; // Keep it simple by making end minute same as start
      
      let endH = startH + totalDurH;
      let endM = startM; // End minutes same as start minutes makes total elapsed exactly totalDurH hours
      let breakM = Math.floor(Math.random() * 11) + 28; // 28 to 38
      
      let totalElapsedMins = totalDurH * 60;
      let actualMins = totalElapsedMins - breakM;
      let actualH = Math.floor(actualMins / 60);
      let actualM = actualMins % 60;
      
      let startTime = format12h(startH, startM);
      let endTime = format12h(endH, endM);
      
      answer = `${actualH} h ${actualM} min`;
      options = [
        answer,
        `${totalDurH} h`,
        `${actualH + 1} h ${actualM} min`,
        `${actualH} h ${actualM + 10} min`
      ];

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { name: "Activity Time", value: "?", size: actualMins, layoutSize: actualMins, segments: 1 },
            { name: "Rest", value: "?", size: breakM, layoutSize: breakM, segments: 1 }
          ],
          whole: "?"
        }
      });

      if (isStructure) {
        askText = `STORY: ${names[0]} started ${activities[0].text} at ${startTime} and ended at ${endTime}. Along the way, he took a ${breakM}-minute rest.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask how much time he actually spent on the activity in hours and minutes.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total hours from ${startTime} to ${endTime}:`, expectedAnswer: `${endH} - ${startH} = ${totalDurH}`, acceptedAnswers: makeEq(endH, '-', startH, totalDurH) },
            { label: `Write the working equation to convert the total hours to minutes:`, expectedAnswer: `${totalDurH} x 60 = ${totalElapsedMins}`, acceptedAnswers: makeEq(totalDurH, 'x', 60, totalElapsedMins).concat(makeEq(totalDurH, '*', 60, totalElapsedMins)) },
            { label: `Write the working equation to find the actual time spent on the activity in minutes:`, expectedAnswer: `${totalElapsedMins} - ${breakM} = ${actualMins}`, acceptedAnswers: makeEq(totalElapsedMins, '-', breakM, actualMins) },
            { label: `Convert your answer back to hours and minutes. The actual time spent is ${actualH} hour(s) and how many minutes?`, expectedAnswer: `${actualM}`, acceptedAnswers: [`${actualM}`, `${actualM} min`, `${actualM} minutes`] }
          ]
        });
      } else {
        askText = `${names[0]}'s start time is ${startTime}, End time is ${endTime}. Break was ${breakM} mins. What is the actual working time in hours and minutes?`;
      }
      
      solutionSteps = `1. Total time from ${startTime} to ${endTime} is ${totalDurH} hours.\n2. In minutes: ${totalDurH} x 60 = ${totalElapsedMins} min.\n3. Subtract rest: ${totalElapsedMins} - ${breakM} = ${actualMins} min.\n4. Convert: ${actualMins} min = ${actualH} h ${actualM} min.`;
      hint = `Find the total time elapsed first, convert it all to minutes, and subtract the break time!`;
      break;
    }
    
    case 'advanced_schedule_total_combined_time': {
      // Find total duration of two distinct events from a schedule.
      const themes = [
        {
          title: "School Timetable",
          events: ["Morning Assembly", "Mathematics", "Recess", "English", "Lunch", "Science"],
          target1: "Recess",
          target2: "Lunch"
        },
        {
          title: "Tour Itinerary",
          events: ["Hotel Pickup", "Museum Tour", "Souvenir Shopping", "City Sightseeing", "Free and Easy", "Dinner"],
          target1: "Souvenir Shopping",
          target2: "Free and Easy"
        },
        {
          title: "TV Guide",
          events: ["Morning News", "Cartoon Time", "Documentary", "Cooking Show", "Movie Time", "Sports Highlights"],
          target1: "Cartoon Time",
          target2: "Movie Time"
        },
        {
          title: "Training Camp",
          events: ["Warm Up", "Drills", "Water Break", "Tactics", "Lunch Break", "Scrimmage"],
          target1: "Water Break",
          target2: "Lunch Break"
        }
      ];
      
      const theme = themes[Math.floor(Math.random() * themes.length)];
      
      let startH = Math.floor(Math.random() * 3) + 7; // 7, 8, 9
      let e0_m = Math.floor(Math.random() * 4) * 5 + 10; // 10, 15, 20, 25
      let e1_m = Math.floor(Math.random() * 3) * 5 + 35; // 35, 40, 45 (This is Target1 Start)
      
      let e2_m = Math.floor(Math.random() * 4) * 5 + 5; // 5, 10, 15, 20 (This is Target1 End, which is in next hour)
      let e3_m = Math.floor(Math.random() * 3) * 5 + 35; // 35, 40, 45 (This is Target2 Start)
      
      let e4_m = Math.floor(Math.random() * 4) * 5 + 5; // 5, 10, 15, 20 (This is Target2 End, which is in next hour)
      let e5_m = Math.floor(Math.random() * 4) * 5 + 35; // 35, 40, 45, 50
      
      const formatTime = (h, m) => {
        let h12 = h % 12;
        if (h12 === 0) h12 = 12;
        let period = h >= 12 && h < 24 ? "p.m." : "a.m.";
        return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
      };
      
      const rows = [
        { time: formatTime(startH, 0), event: theme.events[0] },
        { time: formatTime(startH, e0_m), event: theme.events[1] },
        { time: formatTime(startH, e1_m), event: theme.events[2] }, // target 1 start
        { time: formatTime(startH + 1, e2_m), event: theme.events[3] }, // target 1 end
        { time: formatTime(startH + 1, e3_m), event: theme.events[4] }, // target 2 start
        { time: formatTime(startH + 2, e4_m), event: theme.events[5] }, // target 2 end
        { time: formatTime(startH + 2, e5_m), event: "End of schedule" }
      ];
      
      let e1Dur1 = 60 - e1_m;
      let e1Dur2 = e2_m;
      let e1DurTotal = e1Dur1 + e1Dur2;
      
      let e2Dur1 = 60 - e3_m;
      let e2Dur2 = e4_m;
      let e2DurTotal = e2Dur1 + e2Dur2;
      
      let totalBreak = e1DurTotal + e2DurTotal;
      let calculatedH = Math.floor(totalBreak / 60);
      let calculatedM = totalBreak % 60;
      let totalStr = calculatedH > 0 ? `${calculatedH} h ${calculatedM} min` : `${calculatedM} min`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "TIMETABLE",
        componentData: {
          title: theme.title,
          rows: rows.slice(0, 6)
        }
      });
      
      answer = totalStr;
      options = [
        totalStr,
        calculatedH > 0 ? `${calculatedH} h ${calculatedM + 10 > 59 ? calculatedM - 10 : calculatedM + 10} min` : `${calculatedM + 10} min`,
        `${calculatedH + 1} h ${calculatedM} min`,
        `${Math.abs(e1DurTotal - e2DurTotal)} min`
      ];
      
      if (isStructure) {
        askText = `STORY: ${names[0]} is looking at the ${theme.title} above.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask for the total time spent on ${theme.target1} and ${theme.target2} combined in hours and minutes. DO NOT LEAK ANY TIMES IN THE STORY.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the duration of ${theme.target1} (mins to next hour + remaining mins):`, expectedAnswer: `${e1Dur1} + ${e1Dur2} = ${e1DurTotal}`, acceptedAnswers: makeEq(e1Dur1, '+', e1Dur2, e1DurTotal) },
            { label: `Write the working equation to find the duration of ${theme.target2} (mins to next hour + remaining mins):`, expectedAnswer: `${e2Dur1} + ${e2Dur2} = ${e2DurTotal}`, acceptedAnswers: makeEq(e2Dur1, '+', e2Dur2, e2DurTotal) },
            { label: `Write the working equation to find the total time combined:`, expectedAnswer: `${e1DurTotal} + ${e2DurTotal} = ${totalBreak}`, acceptedAnswers: makeEq(e1DurTotal, '+', e2DurTotal, totalBreak) },
            { label: `Total time in hours and minutes:`, expectedAnswer: totalStr, acceptedAnswers: [totalStr, totalStr.replace('h', 'hour').replace('min', 'minutes')] }
          ]
        });
      } else {
        askText = `Look at the ${theme.title}. What is the total time spent on ${theme.target1} and ${theme.target2} in hours and minutes?`;
      }
      
      solutionSteps = `1. ${theme.target1}: ${e1Dur1} + ${e1Dur2} = ${e1DurTotal} min.\n2. ${theme.target2}: ${e2Dur1} + ${e2Dur2} = ${e2DurTotal} min.\n3. Total: ${e1DurTotal} + ${e2DurTotal} = ${totalBreak} min.\n4. Convert: ${totalBreak} min = ${totalStr}.`;
      hint = `Find the duration of ${theme.target1} and ${theme.target2} first. Remember to find minutes to the next hour first, then add the remaining minutes!`;
      break;
    }
    
    case 'advanced_chained_events_with_travel': {
      // Activity -> Gap -> Activity. Find end time.
      let startH = Math.floor(Math.random() * 4) + 1; // 1 to 4 pm
      let startM = Math.floor(Math.random() * 16) + 13; // 13 to 28
      
      let dur1 = Math.floor(Math.random() * 21) + 35; // 35 to 55 mins
      let gap = Math.floor(Math.random() * 16) + 15; // 15 to 30 mins
      let dur2 = Math.floor(Math.random() * 21) + 35; // 35 to 55 mins
      
      let totalMins = dur1 + gap + dur2;
      let totalH = Math.floor(totalMins / 60);
      let remM = totalMins % 60;
      
      let endM = startM + remM;
      let endH = startH + totalH;
      if (endM >= 60) {
        endM -= 60;
        endH += 1;
      }
      
      let startTime = format12h(startH, startM);
      let endTime = format12h(endH, endM);
      
      answer = endTime;
      options = [
        endTime,
        format12h(endH, endM + 10 > 59 ? 59 : endM + 10),
        format12h(endH + 1, endM),
        format12h(endH, Math.max(0, endM - 10))
      ];
      
      if (isStructure) {
        askText = `STORY: ${names[0]} spent ${dur1} minutes doing ${activities[0].text}, took a ${gap}-minute break, and then spent ${dur2} minutes doing ${activities[1].text}. If he started at ${startTime}, what time did he finish the second activity?\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time he finished the second activity.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find total time spent:`, expectedAnswer: `${dur1} + ${gap} + ${dur2} = ${totalMins}`, acceptedAnswers: [`${dur1} + ${gap} + ${dur2} = ${totalMins}`, `${dur1}+${gap}+${dur2}=${totalMins}`] },
            { label: `Convert total time to hours and minutes:`, expectedAnswer: `${totalH} h ${remM} min`, acceptedAnswers: [`${totalH} h ${remM} min`, `${totalH} hour ${remM} minutes`] },
            { label: `Finishing time (e.g., ${endTime}):`, expectedAnswer: endTime, acceptedAnswers: makeTimeAns(endTime) }
          ]
        });
      } else {
        askText = `${names[0]} spent ${dur1} minutes doing ${activities[0].text}, took a ${gap}-minute break, and spent ${dur2} minutes doing ${activities[1].text}. If he started at ${startTime}, what time did he finish?`;
      }
      
      solutionSteps = `1. Add all the durations together: ${dur1} + ${gap} + ${dur2} = ${totalMins} minutes.\n2. Convert to hours and minutes: ${totalMins} min = ${totalH} h ${remM} min.\n3. Add ${totalH} h ${remM} min to ${startTime} gives ${endTime}.`;
      hint = `First, find the total amount of time that has passed by adding the two activities and the break together!`;
      break;
    }
    
    case 'advanced_timetable_duration_comparison': {
      // Compare two durations from a schedule and find difference
      const startHour = Math.floor(Math.random() * 4) + 8; // 8 to 11
      const startMin = Math.floor(Math.random() * 12) * 5; // 0 to 55
      
      const addMins = (h, m, add) => {
        let newM = m + add;
        let newH = h + Math.floor(newM / 60);
        newM = newM % 60;
        return { h: newH, m: newM };
      };
      
      const t1 = { h: startHour, m: startMin };
      const e1Dur = Math.floor(Math.random() * 11) + 40; // 40 to 50
      const t2 = addMins(t1.h, t1.m, e1Dur);
      const e2Dur = Math.floor(Math.random() * 11) + 15; // 15 to 25
      const t3 = addMins(t2.h, t2.m, e2Dur);
      const e3Dur = Math.floor(Math.random() * 11) + 55; // 55 to 65
      const t4 = addMins(t3.h, t3.m, e3Dur);
      
      const rows = [
        { time: format12h(t1.h, t1.m), event: "Morning Show" },
        { time: format12h(t2.h, t2.m), event: "Cooking with Chef" },
        { time: format12h(t3.h, t3.m), event: "Nature Documentary" },
        { time: format12h(t4.h, t4.m), event: "Evening News" }
      ];
      
      visualEngineStr = JSON.stringify({
        componentToRender: "TIMETABLE",
        componentData: {
          title: "TV Guide",
          rows: rows
        }
      });
      
      const diff = Math.abs(e3Dur - e1Dur);
      
      const isE3Longer = e3Dur > e1Dur;
      const longerEvent = isE3Longer ? "Nature Documentary" : "Morning Show";
      const shorterEvent = isE3Longer ? "Morning Show" : "Nature Documentary";
      const longerDur = isE3Longer ? e3Dur : e1Dur;
      const shorterDur = isE3Longer ? e1Dur : e3Dur;
      
      answer = `${diff} minutes`;
      options = [
        `${diff} minutes`,
        `${diff + 10} minutes`,
        `${Math.abs(diff - 10) || diff + 5} minutes`,
        `${e1Dur + e3Dur} minutes`
      ];
      
      if (isStructure) {
        askText = `STORY: Look at the TV Guide above.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask how much longer ${longerEvent} is compared to ${shorterEvent}.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Duration of ${longerEvent}:`, expectedAnswer: `${longerDur}`, acceptedAnswers: [`${longerDur}`, `${longerDur} minutes`, `${longerDur} mins`] },
            { label: `Duration of ${shorterEvent}:`, expectedAnswer: `${shorterDur}`, acceptedAnswers: [`${shorterDur}`, `${shorterDur} minutes`, `${shorterDur} mins`] },
            { label: `Write the working equation to find the difference:`, expectedAnswer: `${longerDur} - ${shorterDur} = ${diff}`, acceptedAnswers: makeEq(longerDur, '-', shorterDur, diff) },
            { label: `Difference in minutes:`, expectedAnswer: `${diff}`, acceptedAnswers: [`${diff}`, `${diff} minutes`, `${diff} mins`] }
          ]
        });
      } else {
        askText = `Look at the TV Guide. How much longer is ${longerEvent} compared to ${shorterEvent}?`;
      }
      
      solutionSteps = `1. Duration of ${longerEvent} is ${longerDur} min.\n2. Duration of ${shorterEvent} is ${shorterDur} min.\n3. Difference: ${longerDur} - ${shorterDur} = ${diff} min.`;
      hint = `Find the duration of both shows by looking at their start times and the next show's start time, then subtract to find the difference!`;
      break;
    }

    default:
      throw new Error(`Variant not found in Advanced logic: ${activeVariant}`);
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
    metadata: { difficulty: 'advanced', steps: isStructure ? (inputRequirementStr ? JSON.parse(inputRequirementStr).steps.length : 1) : 1, logic: activeVariant.replace('advanced_', '') }
  };
};
