import { getRandomNames, getTimeActivities } from '@/lib/utils/variable-bank';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
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
    let period = h24 >= 12 ? 'p.m.' : 'a.m.';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    let mStr = m.toString().padStart(2, '0');
    return `${h12}:${mStr} ${period}`;
  };

  switch (activeVariant) {
    case 'standard_crossing_hour_a_b_c': {
      // Combined Variant: Duration Calculation (Crossing the Hour)
      let startH = Math.floor(Math.random() * 11) + 6; // 6 to 16
      let startM = Math.floor(Math.random() * 16) + 33; // 33 to 48
      let duration = Math.floor(Math.random() * 21) + 23; // 23 to 43
      
      // Ensure it crosses the hour
      if (startM + duration < 60) duration += 30;
      
      let endM = (startM + duration) % 60;
      let endH = startH + Math.floor((startM + duration) / 60);
      
      let startTime = format12h(startH, startM);
      let endTime = format12h(endH, endM);
      
      let type = Math.floor(Math.random() * 3); // 0: end, 1: start, 2: duration
      
      if (type === 0) {
        // Find Finishing Time
        let minsToHour = 60 - startM;
        let remainingMins = duration - minsToHour;
        answer = endTime;
        options = [
          endTime,
          format12h(endH, remainingMins + 10 > 59 ? 59 : remainingMins + 10),
          format12h(startH, endM),
          format12h(endH + 1, endM)
        ];
        if (isStructure) {
          askText = `STORY: ${names[0]} started ${activities[0].text} at ${startTime}. The activity took ${duration} minutes.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time ${names[0]} finished.`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Write the working equation to find minutes to reach ${format12h(endH, 0)}:`, expectedAnswer: `60 - ${startM} = ${minsToHour}`, acceptedAnswers: makeEq(60, '-', startM, minsToHour) },
              { label: `Write the working equation to find remaining minutes:`, expectedAnswer: `${duration} - ${minsToHour} = ${remainingMins}`, acceptedAnswers: makeEq(duration, '-', minsToHour, remainingMins) },
              { label: `Finishing time (e.g., ${endTime}):`, expectedAnswer: endTime, acceptedAnswers: makeTimeAns(endTime) }
            ]
          });
        } else {
          askText = `${names[0]} started at ${startTime}. The duration is ${duration} minutes. What is the finishing time?`;
        }
        solutionSteps = `1. Minutes to reach ${format12h(endH, 0)}: 60 - ${startM} = ${minsToHour} min.\n2. Remaining minutes: ${duration} - ${minsToHour} = ${remainingMins} min.\n3. Add ${remainingMins} min to ${format12h(endH, 0)} to get ${endTime}.`;
        hint = `Count how many minutes it takes to reach the next hour, then add the rest of the duration to find the finishing time.`;
      } else if (type === 1) {
        // Find Starting Time
        let minsToSubtractFirst = endM;
        let remainingMinsToSubtract = duration - minsToSubtractFirst;
        answer = startTime;
        options = [
          startTime,
          format12h(startH, startM - 10 < 0 ? 0 : startM - 10),
          format12h(endH, startM),
          format12h(startH - 1, startM)
        ];
        if (isStructure) {
          askText = `STORY: ${names[0]} finished ${activities[0].text} at ${endTime}. The activity took ${duration} minutes.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time ${names[0]} started.`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Write the working equation to subtract the minutes back to ${format12h(endH, 0)}:`, expectedAnswer: `${duration} - ${minsToSubtractFirst} = ${remainingMinsToSubtract}`, acceptedAnswers: makeEq(duration, '-', minsToSubtractFirst, remainingMinsToSubtract) },
              { label: `Write the working equation to subtract the remaining minutes from 60:`, expectedAnswer: `60 - ${remainingMinsToSubtract} = ${startM}`, acceptedAnswers: makeEq(60, '-', remainingMinsToSubtract, startM) },
              { label: `Starting time (e.g., ${startTime}):`, expectedAnswer: startTime, acceptedAnswers: makeTimeAns(startTime) }
            ]
          });
        } else {
          askText = `${names[0]}'s finishing time is ${endTime}. The duration is ${duration} minutes. What is the starting time?`;
        }
        solutionSteps = `1. Subtract ${minsToSubtractFirst} min to reach ${format12h(endH, 0)}.\n2. You still need to subtract ${remainingMinsToSubtract} min (${duration} - ${minsToSubtractFirst} = ${remainingMinsToSubtract}).\n3. Subtracting ${remainingMinsToSubtract} min from ${format12h(endH, 0)} gives ${startTime}.`;
        hint = `Count backward to the top of the hour first, then subtract the rest of the minutes!`;
      } else {
        // Find Duration
        let minsToHour = 60 - startM;
        answer = `${duration} minutes`;
        options = [
          `${duration} minutes`,
          `${duration + 10} minutes`,
          `${Math.abs(duration - 10)} minutes`,
          `${endM + startM} minutes`
        ];
        if (isStructure) {
          askText = `STORY: ${names[0]} started ${activities[0].text} at ${startTime}. He finished at ${endTime}.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask how many minutes he spent.`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Write the working equation to find minutes to reach ${format12h(endH, 0)}:`, expectedAnswer: `60 - ${startM} = ${minsToHour}`, acceptedAnswers: makeEq(60, '-', startM, minsToHour) },
              { label: `Write the working equation to find the total minutes:`, expectedAnswer: `${minsToHour} + ${endM} = ${duration}`, acceptedAnswers: makeEq(minsToHour, '+', endM, duration) },
              { label: `Total time in minutes:`, expectedAnswer: `${duration}`, acceptedAnswers: [`${duration}`, `${duration} minutes`, `${duration} mins`] }
            ]
          });
        } else {
          askText = `How many minutes are there between ${startTime} and ${endTime} for ${names[0]}?`;
        }
        solutionSteps = `1. Minutes from ${startTime} to ${format12h(endH, 0)}: 60 - ${startM} = ${minsToHour} min.\n2. Minutes after ${format12h(endH, 0)}: ${endM} min.\n3. Total duration: ${minsToHour} + ${endM} = ${duration} minutes.`;
        hint = `First find out how many minutes there are to the next hour, then add the remaining minutes!`;
      }
      break;
    }
    
    case 'standard_total_duration_exceed_1h': {
      // Variant 9: Total Duration (Minutes Exceeding 1 Hour)
      let dur1 = Math.floor(Math.random() * 16) + 33; // 33 to 48
      let dur2 = Math.floor(Math.random() * 16) + 33; // 33 to 48
      let totalDur = dur1 + dur2; // 70 to 100
      let h = Math.floor(totalDur / 60);
      let m = totalDur % 60;
      
      answer = `${h} h ${m} min`;
      options = [
        answer,
        `${totalDur} min`,
        `${h} h ${m + 10} min`,
        `${h + 1} h ${m} min`
      ];

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { name: activities[0].text, value: activities[0].text, size: dur1, layoutSize: dur1, segments: 1 },
            { name: activities[1].text, value: activities[1].text, size: dur2, layoutSize: dur2, segments: 1 }
          ],
          whole: `?`
        }
      });

      if (isStructure) {
        askText = `STORY: ${names[0]} spent ${dur1} minutes on ${activities[0].text} and then ${dur2} minutes to ${activities[1].text}.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what her total time was in hours and minutes.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total minutes:`, expectedAnswer: `${dur1} + ${dur2} = ${totalDur}`, acceptedAnswers: makeEq(dur1, '+', dur2, totalDur) },
            { label: `Number of full hours in the total time:`, expectedAnswer: `${h}`, acceptedAnswers: [`${h}`, `${h} h`, `${h} hour`] },
            { label: `Write the working equation to find the remaining minutes:`, expectedAnswer: `${totalDur} - 60 = ${m}`, acceptedAnswers: makeEq(totalDur, '-', 60, m) },
            { label: `Remaining minutes:`, expectedAnswer: `${m}`, acceptedAnswers: [`${m}`, `${m} min`, `${m} minutes`] }
          ]
        });
      } else {
        askText = `${names[0]} spent ${dur1} minutes on a task and then ${dur2} minutes on another. Express the total time in hours and minutes.`;
      }
      
      solutionSteps = `1. Total minutes: ${dur1} + ${dur2} = ${totalDur} minutes.\n2. Convert to hours: ${totalDur} - 60 = ${m} minutes remaining. So it is ${h} h ${m} min.`;
      hint = `Add the minutes together first, then convert every 60 minutes into 1 hour.`;
      break;
    }
    
    case 'standard_timetable_duration_extraction': {
      // P3 Upgrade: Render a TIMETABLE. Student locates specific event and calculates duration with minute-level precision.
      const startHour = Math.floor(Math.random() * 4) + 8; // 8 to 11
      const startMin1 = Math.floor(Math.random() * 12) * 5; // 0 to 55
      
      const e1Duration = Math.floor(Math.random() * 20) + 15; // 15 to 34
      const e2Duration = Math.floor(Math.random() * 25) + 20; // 20 to 44
      const e3Duration = Math.floor(Math.random() * 20) + 15; // 15 to 34
      const e4Duration = Math.floor(Math.random() * 30) + 30; // 30 to 59
      
      let curH = startHour;
      let curM = startMin1;
      
      const addMins = (h, m, add) => {
        let newM = m + add;
        let newH = h + Math.floor(newM / 60);
        newM = newM % 60;
        return { h: newH, m: newM };
      };
      
      const t1 = { h: curH, m: curM };
      const t2 = addMins(t1.h, t1.m, e1Duration);
      const t3 = addMins(t2.h, t2.m, e2Duration);
      const t4 = addMins(t3.h, t3.m, e3Duration);
      const t5 = addMins(t4.h, t4.m, e4Duration);
      
      const tArr = [t1, t2, t3, t4, t5];
      
      const scenarios = [
        {
          type: "event", title: "School Timetable",
          e1: "Math Class", e2: "Recess", e3: "Science Class", e4: "English Class", e5: "Dismissal"
        },
        {
          type: "event", title: "TV Guide",
          e1: "Morning News", e2: "Cartoon Time", e3: "Documentary", e4: "Movie Premiere", e5: "Sign Off"
        },
        {
          type: "event", title: "Camp Itinerary",
          e1: "Tent Pitching", e2: "Treasure Hunt", e3: "Lunch Break", e4: "Obstacle Course", e5: "Campfire"
        },
        {
          type: "travel", title: "Bus Schedule",
          e1: "Orchard Road", e2: "Dhoby Ghaut", e3: "City Hall", e4: "Marina Bay", e5: "HarbourFront"
        },
        {
          type: "travel", title: "Train Journey",
          e1: "Jurong East", e2: "Clementi", e3: "Buona Vista", e4: "Outram Park", e5: "Raffles Place"
        }
      ];
      
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      
      const rows = [
        { time: format12h(t1.h, t1.m), event: scenario.e1, duration: e1Duration },
        { time: format12h(t2.h, t2.m), event: scenario.e2, duration: e2Duration },
        { time: format12h(t3.h, t3.m), event: scenario.e3, duration: e3Duration },
        { time: format12h(t4.h, t4.m), event: scenario.e4, duration: e4Duration },
        { time: format12h(t5.h, t5.m), event: scenario.e5, duration: 0 }
      ];
      
      visualEngineStr = JSON.stringify({
        componentToRender: "TIMETABLE",
        componentData: {
          title: scenario.title,
          rows: rows.map(r => ({ time: r.time, event: r.event }))
        }
      });
      
      // Target multiple events to span across exactly the next hour
      // Find a valid pair (startIdx, endIdx) where endT.h - startT.h === 1
      let validPairs = [];
      for(let i=0; i<tArr.length; i++) {
        for(let j=i+1; j<tArr.length; j++) {
          if (tArr[j].h - tArr[i].h === 1 && tArr[i].m > 0) {
            validPairs.push([i, j]);
          }
        }
      }
      
      // Fallback if no pair strictly crosses 1 hour, just pick 0 and 2
      let startIdx = 0;
      let endIdx = 2;
      if (validPairs.length > 0) {
        const pair = validPairs[Math.floor(Math.random() * validPairs.length)];
        startIdx = pair[0];
        endIdx = pair[1];
      }
      
      const startEvent = rows[startIdx];
      const endEvent = rows[endIdx]; 
      const isTravel = scenario.type === 'travel';
      
      const startT = tArr[startIdx];
      const endT = tArr[endIdx];
      const durationMins = (endT.h * 60 + endT.m) - (startT.h * 60 + startT.m);
      
      const nextH = startT.h + 1;
      const minsToHour = 60 - startT.m;
      const extraMins = durationMins - minsToHour; // This is endT.m + (endT.h - nextH) * 60
      
      const h = Math.floor(durationMins / 60);
      const m = durationMins % 60;
      const durationStr = h > 0 ? (m > 0 ? `${h} h ${m} min` : `${h} h`) : `${m} min`;
      
      answer = durationStr;
      
      // Generate some plausible distractors
      const dist1 = h > 0 ? `${h} h ${m + 10} min` : `${m + 10} min`;
      const dist2 = h > 0 ? (m - 10 > 0 ? `${h} h ${m - 10} min` : `${h} h ${m + 5} min`) : `${m + 5} min`;
      const dist3 = `${h + 1} h ${m} min`;
      
      options = [
        answer,
        dist1,
        dist2,
        dist3
      ];
      
      if (isStructure) {
        if (isTravel) {
          askText = `STORY: Look at the ${scenario.title} above.\n\nCRITICAL INSTRUCTION: Write a creative math story about someone traveling on this route. Ask how long the total travel time is from ${startEvent.event} to ${endEvent.event}. DO NOT include the actual departure or arrival times in the story text—the student must read them from the schedule.`;
        } else {
          askText = `STORY: Look at the ${scenario.title} above.\n\nCRITICAL INSTRUCTION: Write a creative math story about someone looking at this timetable. Ask how long the total time is from the start of ${startEvent.event} to the start of ${endEvent.event}. DO NOT include the actual start or end times in the story text—the student must read them from the timetable.`;
        }
        
        let steps = [
          { label: `Write the working equation to find the minutes to reach the next hour:`, expectedAnswer: `60 - ${startT.m} = ${minsToHour}`, acceptedAnswers: makeEq(60, '-', startT.m, minsToHour) },
          { label: `Write the working equation to find the total minutes:`, expectedAnswer: `${minsToHour} + ${extraMins} = ${durationMins}`, acceptedAnswers: makeEq(minsToHour, '+', extraMins, durationMins) }
        ];
        
        if (h > 0) {
          steps.push({ label: `Total duration (in hours and minutes):`, expectedAnswer: durationStr, acceptedAnswers: [durationStr, `${durationMins} min`, `${durationMins} minutes`] });
        } else {
          steps.push({ label: `Total duration in minutes:`, expectedAnswer: `${durationMins}`, acceptedAnswers: [`${durationMins}`, `${durationMins} min`, `${durationMins} minutes`] });
        }

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: steps
        });
      } else {
        if (isTravel) {
          askText = `Look at the ${scenario.title}. What is the total travel time from ${startEvent.event} to ${endEvent.event}?`;
        } else {
          askText = `Look at the ${scenario.title}. How long is the total time from the start of ${startEvent.event} to the start of ${endEvent.event}?`;
        }
      }
      
      if (isTravel) {
        solutionSteps = `1. The departure time at ${startEvent.event} is ${startEvent.time}.\n2. Minutes to reach ${format12h(nextH, 0)}: 60 - ${startT.m} = ${minsToHour} min.\n3. Minutes after ${format12h(nextH, 0)} until ${endEvent.time}: ${extraMins} min.\n4. Total minutes: ${minsToHour} + ${extraMins} = ${durationMins} minutes.\n5. Travel time is ${durationStr}.`;
        hint = `Find the minutes to reach the top of the next hour first, then add the rest of the minutes!`;
      } else {
        solutionSteps = `1. The start time of ${startEvent.event} is ${startEvent.time}.\n2. Minutes to reach ${format12h(nextH, 0)}: 60 - ${startT.m} = ${minsToHour} min.\n3. Minutes after ${format12h(nextH, 0)} until ${endEvent.time}: ${extraMins} min.\n4. Total minutes: ${minsToHour} + ${extraMins} = ${durationMins} minutes.\n5. Total duration is ${durationStr}.`;
        hint = `Find the minutes to reach the top of the next hour first, then add the rest of the minutes!`;
      }
      break;
    }
    
    case 'standard_schedule_wait_time': {
      // Find gap between arrival and departure. Crosses an hour for working equations.
      const startHour = Math.floor(Math.random() * 4) + 8; // 8 to 11
      const startMin = Math.floor(Math.random() * 6) * 5 + 30; // 30, 35, 40, 45, 50, 55
      
      const addMins = (h, m, add) => {
        let newM = m + add;
        let newH = h + Math.floor(newM / 60);
        newM = newM % 60;
        return { h: newH, m: newM };
      };
      
      const t1 = { h: startHour, m: startMin };
      const t2 = addMins(t1.h, t1.m, Math.floor(Math.random() * 2) * 10 + 35); // 35 or 45 mins interval to guarantee hour crossing
      const t3 = addMins(t2.h, t2.m, Math.floor(Math.random() * 2) * 10 + 35);
      const t4 = addMins(t3.h, t3.m, Math.floor(Math.random() * 2) * 10 + 35);
      
      const scenarios = [
        { title: "Ferry Departure Schedule", prefix: "Ferry", verb: "departs" },
        { title: "Intercity Bus Schedule", prefix: "Bus", verb: "leaves" },
        { title: "Movie Showtimes", prefix: "Show", verb: "starts" },
        { title: "Train Departure Schedule", prefix: "Train", verb: "departs" },
        { title: "Flight Boarding Times", prefix: "Flight", verb: "boards" }
      ];
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      
      const rows = [
        { time: format12h(t1.h, t1.m), event: `${scenario.prefix} 1` },
        { time: format12h(t2.h, t2.m), event: `${scenario.prefix} 2` },
        { time: format12h(t3.h, t3.m), event: `${scenario.prefix} 3` },
        { time: format12h(t4.h, t4.m), event: `${scenario.prefix} 4` }
      ];
      
      visualEngineStr = JSON.stringify({
        componentToRender: "TIMETABLE",
        componentData: {
          title: scenario.title,
          rows: rows
        }
      });
      
      // Target train (Train 2 or 3)
      const targetIdx = Math.floor(Math.random() * 2) + 1; // 1 or 2
      const targetEvent = rows[targetIdx];
      const prevTimeObj = targetIdx === 1 ? t1 : t2;
      const targetTimeObj = targetIdx === 1 ? t2 : t3;
      
      // Arrive strictly after prevEvent and before targetEvent, in the previous hour relative to targetEvent
      let arrivalH = targetTimeObj.h - 1;
      let arrivalM = Math.max(prevTimeObj.m + 5, 60 - (Math.floor(Math.random() * 15) + 10)); // e.g., 60-15 = 45
      if (arrivalM >= 60) arrivalM = 55;
      
      let arrivalTime = format12h(arrivalH, arrivalM);
      
      let minsToHour = 60 - arrivalM;
      let extraMins = targetTimeObj.m;
      let waitMins = minsToHour + extraMins;
      
      answer = `${waitMins} minutes`;
      options = [
        `${waitMins} minutes`,
        `${waitMins + 10} minutes`,
        `${Math.abs(waitMins - 10) || waitMins + 5} minutes`,
        `${waitMins + 15} minutes`
      ];
      
      if (isStructure) {
        askText = `STORY: ${names[0]} arrives at the terminal at ${arrivalTime}. He wants to catch ${targetEvent.event}.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask how long he has to wait. DO NOT mention the exact scheduled time of the ${scenario.prefix} in the story.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Arrival time:`, expectedAnswer: arrivalTime, acceptedAnswers: makeTimeAns(arrivalTime) },
            { label: `Scheduled time of ${targetEvent.event}:`, expectedAnswer: targetEvent.time, acceptedAnswers: makeTimeAns(targetEvent.time) },
            { label: `Write the working equation to find the minutes to reach the next hour:`, expectedAnswer: `60 - ${arrivalM} = ${minsToHour}`, acceptedAnswers: makeEq(60, '-', arrivalM, minsToHour) },
            { label: `Write the working equation to find the total minutes:`, expectedAnswer: `${minsToHour} + ${extraMins} = ${waitMins}`, acceptedAnswers: makeEq(minsToHour, '+', extraMins, waitMins) },
            { label: `Wait time in minutes:`, expectedAnswer: `${waitMins}`, acceptedAnswers: [`${waitMins}`, `${waitMins} minutes`, `${waitMins} mins`] }
          ]
        });
      } else {
        askText = `${names[0]} arrives at ${arrivalTime}. Based on the schedule, how long must he wait for ${targetEvent.event}?`;
      }
      
      solutionSteps = `1. Look at the schedule to find that ${targetEvent.event} ${scenario.verb} at ${targetEvent.time}.\n2. Minutes from arrival (${arrivalTime}) to the next hour: 60 - ${arrivalM} = ${minsToHour} min.\n3. Minutes after the hour: ${extraMins} min.\n4. Total wait time: ${minsToHour} + ${extraMins} = ${waitMins} minutes.`;
      hint = `Find the scheduled time of ${targetEvent.event}. Calculate the minutes to the top of the next hour first, then add the rest of the minutes!`;
      break;
    }
    
    case 'standard_finishing_compound_cross': {
      // Variant 10: Find Finishing Time (Hours and Minutes, Crossing Hour)
      let startH = Math.floor(Math.random() * 8) + 1; // 1 to 8 pm
      let startM = Math.floor(Math.random() * 16) + 33; // 33 to 48
      let durH = Math.floor(Math.random() * 2) + 1; // 1 to 2
      let durM = Math.floor(Math.random() * 16) + 33; // 33 to 48
      
      let tempH = startH + durH;
      let totalM = startM + durM;
      let carryH = Math.floor(totalM / 60);
      let endM = totalM % 60;
      let endH = tempH + carryH;
      
      let startTime = format12h(startH + 12, startM); // force p.m.
      let endTime = format12h(endH + 12, endM);
      
      answer = endTime;
      let trapString = `${endH - carryH}:${totalM} p.m.`; // Manual trap format
      options = [
        endTime,
        trapString,
        format12h(endH + 12, endM + 10 > 59 ? 59 : endM + 10),
        format12h(endH - 1 + 12, endM)
      ];

      if (isStructure) {
        askText = `STORY: ${names[0]} started ${activities[0].text} at ${startTime}. It lasted for ${durH} hour(s) and ${durM} minutes.\n\nCRITICAL INSTRUCTION: Write a creative math story about this. Ask what time ${names[0]} finished.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the time ${durH} hours after ${startTime}:`, expectedAnswer: `${startH} + ${durH} = ${tempH}`, acceptedAnswers: makeEq(startH, '+', durH, tempH) },
            { label: `Write the working equation to add the ${durM} minutes to ${format12h(tempH + 12, startM)} (Mins to next hour + remaining):`, expectedAnswer: `${60 - startM} + ${endM} = ${durM}`, acceptedAnswers: makeEq(60 - startM, '+', endM, durM) },
            { label: `Finishing time (e.g., ${endTime}):`, expectedAnswer: endTime, acceptedAnswers: makeTimeAns(endTime) }
          ]
        });
      } else {
        askText = `${names[0]} started at ${startTime}. The duration is ${durH} hour(s) ${durM} minutes. What is the end time?`;
      }
      
      solutionSteps = `1. Add the hours: ${startH} + ${durH} = ${tempH} p.m.\n2. Add the minutes: ${startM} + ${durM} = ${totalM} minutes.\n3. Convert minutes: ${totalM} min = 1 h ${endM} min.\n4. Final time: ${tempH} + 1 hour = ${endH}, so ${endTime}.`;
      hint = `Add the hours first. Then add the minutes and convert them if they go over 60!`;
      break;
    }

    default:
      throw new Error(`Variant not found in Standard logic: ${activeVariant}`);
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
    metadata: { difficulty: 'standard', steps: isStructure ? (inputRequirementStr ? JSON.parse(inputRequirementStr).steps.length : 1) : 1, logic: activeVariant.replace('standard_', '') }
  };
};
