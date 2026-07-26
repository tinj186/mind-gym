import { getRandomNames } from '../../../../../utils/variable-bank';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function advancedLogic(activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions) {
  let structureText, shortText, actualAnswer, hintStr, stepsStr;
  let mcqOptions = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let structureSteps = [];
  let systemPrompt = "";

  const formatTimeWithPeriod = (h, m, period) => {
    return `${h}:${m === 0 ? '00' : m} ${period}`;
  };

  const calculateNewTimeWithPeriod = (h, m, period, addMins, isLater) => {
    let total = h * 60 + m;
    if (period === 'p.m.' && h !== 12) total += 12 * 60;
    if (period === 'a.m.' && h === 12) total -= 12 * 60;
    
    total = isLater ? total + addMins : total - addMins;
    if (total <= 0) total += 24 * 60;
    
    let newH = Math.floor(total / 60) % 24;
    let newM = total % 60;
    
    let newPeriod = newH >= 12 ? 'p.m.' : 'a.m.';
    if (newH > 12) newH -= 12;
    if (newH === 0) newH = 12;
    
    return { h: newH, m: newM, period: newPeriod };
  };

  if (activeVariant === 'advanced_schedule_mixed_duration') {
    const names = getRandomNames(1);
    const name = names[0];
    const startHour = getRandomInt(1, 5); // 1 to 5
    const startMin = Math.random() > 0.5 ? 0 : 30;
    const startPeriod = 'p.m.';
    
    // mixed units: e.g. 90 mins (1 hr 30 mins) or 150 mins (2 hrs 30 mins)
    const durationHours = getRandomInt(1, 3);
    const durationMins = 30;
    const totalDurationMins = durationHours * 60 + durationMins;
    
    const durationStr = `${durationHours} hour${durationHours > 1 ? 's' : ''} 30 minutes`;
    
    const end = calculateNewTimeWithPeriod(startHour, startMin, startPeriod, totalDurationMins, true);
    
    const startTimeStr = formatTimeWithPeriod(startHour, startMin, startPeriod);
    const endTimeStr = formatTimeWithPeriod(end.h, end.m, end.period);
    
    const qType = getRandomInt(0, 2); // 0: find end, 1: find start, 2: find duration
    
    if (qType === 0) {
      structureText = `${name} started studying at ${startTimeStr}. They studied for ${durationStr}. What time did ${name} finish studying?`;
      shortText = `Started: ${startTimeStr}. Duration: ${durationStr}. End time:`;
      actualAnswer = endTimeStr;
      hintStr = `Break the duration into hours and minutes. Add ${durationHours} hour${durationHours > 1 ? 's' : ''} first, then add 30 minutes!`;
      
      const intermediateTime = calculateNewTimeWithPeriod(startHour, startMin, startPeriod, durationHours * 60, true);
      const intermediateTimeStr = formatTimeWithPeriod(intermediateTime.h, intermediateTime.m, intermediateTime.period);
      
      stepsStr = JSON.stringify([
        `1. Start time is ${startTimeStr}.`,
        `2. First, add ${durationHours} hour${durationHours > 1 ? 's' : ''} to ${startTimeStr}.`,
        `3. ${startTimeStr} + ${durationHours} hour${durationHours > 1 ? 's' : ''} = ${intermediateTimeStr}.`,
        `4. Then, add 30 minutes.`,
        `5. ${intermediateTimeStr} + 30 minutes = ${endTimeStr}.`
      ]);
      structureSteps = [
        { label: `Time after adding ${durationHours} hour${durationHours > 1 ? 's' : ''}:`, expectedAnswer: intermediateTimeStr },
        { label: `Final time after adding 30 minutes:`, expectedAnswer: endTimeStr }
      ];
      if (isMCQ) {
        const o1 = calculateNewTimeWithPeriod(startHour, startMin, startPeriod, totalDurationMins + 30, true);
        const o2 = calculateNewTimeWithPeriod(startHour, startMin, startPeriod, totalDurationMins - 30, true);
        const o3 = calculateNewTimeWithPeriod(startHour, startMin, startPeriod, totalDurationMins + 60, true);
        mcqOptions = [
          endTimeStr,
          formatTimeWithPeriod(o1.h, o1.m, o1.period),
          formatTimeWithPeriod(o2.h, o2.m, o2.period),
          formatTimeWithPeriod(o3.h, o3.m, o3.period)
        ];
      }
    } else if (qType === 1) {
      structureText = `${name} finished studying at ${endTimeStr} after studying for ${durationStr}. What time did ${name} start?`;
      shortText = `End time: ${endTimeStr}. Duration: ${durationStr}. Start time:`;
      actualAnswer = startTimeStr;
      hintStr = `Work backwards! Subtract ${durationHours} hour${durationHours > 1 ? 's' : ''} first, then subtract 30 minutes from ${endTimeStr}.`;
      
      const intermediateTime = calculateNewTimeWithPeriod(end.h, end.m, end.period, durationHours * 60, false);
      const intermediateTimeStr = formatTimeWithPeriod(intermediateTime.h, intermediateTime.m, intermediateTime.period);
      
      stepsStr = JSON.stringify([
        `1. End time is ${endTimeStr}.`,
        `2. First, subtract ${durationHours} hour${durationHours > 1 ? 's' : ''} from ${endTimeStr}.`,
        `3. ${endTimeStr} - ${durationHours} hour${durationHours > 1 ? 's' : ''} = ${intermediateTimeStr}.`,
        `4. Then, subtract 30 minutes.`,
        `5. ${intermediateTimeStr} - 30 minutes = ${startTimeStr}.`
      ]);
      structureSteps = [
        { label: `Time after subtracting ${durationHours} hour${durationHours > 1 ? 's' : ''}:`, expectedAnswer: intermediateTimeStr },
        { label: `Start time after subtracting 30 minutes:`, expectedAnswer: startTimeStr }
      ];
      if (isMCQ) {
        const o1 = calculateNewTimeWithPeriod(end.h, end.m, end.period, totalDurationMins + 30, false);
        const o2 = calculateNewTimeWithPeriod(end.h, end.m, end.period, totalDurationMins - 30, false);
        const o3 = calculateNewTimeWithPeriod(end.h, end.m, end.period, totalDurationMins - 60, false);
        mcqOptions = [
          startTimeStr,
          formatTimeWithPeriod(o1.h, o1.m, o1.period),
          formatTimeWithPeriod(o2.h, o2.m, o2.period),
          formatTimeWithPeriod(o3.h, o3.m, o3.period)
        ];
      }
    } else {
      structureText = `${name} started studying at ${startTimeStr} and finished at ${endTimeStr}. How long did ${name} study?`;
      shortText = `Start: ${startTimeStr}. End: ${endTimeStr}. Duration:`;
      actualAnswer = durationStr;
      hintStr = `Calculate the total time in minutes first, then convert it to hours and minutes. 60 minutes = 1 hour!`;
      stepsStr = JSON.stringify([
        `1. From ${startTimeStr} to ${endTimeStr} is a total of ${totalDurationMins} minutes.`,
        `2. We know that 60 minutes is 1 hour.`,
        `3. ${totalDurationMins} minutes is ${Math.floor(totalDurationMins / 60)} hour(s) and ${totalDurationMins % 60} minutes.`,
        `4. The duration is ${durationStr}.`
      ]);
      structureSteps = [
        { label: `Total duration in minutes:`, expectedAnswer: `${totalDurationMins} minutes` },
        { label: `Duration in hours and minutes:`, expectedAnswer: durationStr }
      ];
      if (isMCQ) {
        mcqOptions = [
          durationStr,
          `${durationHours + 1} hours`,
          `${durationHours} hours`,
          `${durationHours + 1} hours 30 minutes`
        ];
      }
    }
  } else if (activeVariant === 'advanced_multi_break_gap_analysis') {
    const startHour = getRandomInt(7, 9); // Morning
    
    // Gap 1 (e.g. Recess): 30 mins
    // Gap 2 (e.g. Lunch): 60 mins
    const class1Mins = 120;
    const recessMins = 30;
    const class2Mins = 120;
    const lunchMins = 60;
    
    const event1 = calculateNewTimeWithPeriod(startHour, 0, 'a.m.', 0, true);
    const event2 = calculateNewTimeWithPeriod(event1.h, event1.m, event1.period, class1Mins, true); // Class is 2 hours
    const event3 = calculateNewTimeWithPeriod(event2.h, event2.m, event2.period, recessMins, true); // Recess is 30 mins
    const event4 = calculateNewTimeWithPeriod(event3.h, event3.m, event3.period, class2Mins, true); // Class is 2 hours
    const event5 = calculateNewTimeWithPeriod(event4.h, event4.m, event4.period, lunchMins, true); // Lunch is 60 mins (1 hr)
    
    const rows = [
      { time: formatTimeWithPeriod(event1.h, event1.m, event1.period), event: "Morning Class" },
      { time: formatTimeWithPeriod(event2.h, event2.m, event2.period), event: "Recess" },
      { time: formatTimeWithPeriod(event3.h, event3.m, event3.period), event: "Afternoon Class" },
      { time: formatTimeWithPeriod(event4.h, event4.m, event4.period), event: "Lunch" },
      { time: formatTimeWithPeriod(event5.h, event5.m, event5.period), event: "Dismissal" }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "TIMETABLE",
      componentData: {
        title: "School Timetable",
        rows: rows
      }
    });
    
    const qType = getRandomInt(0, 2);
    
    if (qType === 0) {
      structureText = `Look at the school timetable above. How much total time is given for breaks (Recess and Lunch)?`;
      shortText = `Total break time (Recess + Lunch) from timetable:`;
      actualAnswer = `1 hour 30 minutes`;
      hintStr = `Calculate the duration for Recess and the duration for Lunch separately. Then add them together!`;
      
      stepsStr = JSON.stringify([
        `1. Recess starts at ${rows[1].time} and ends at ${rows[2].time} (start of Afternoon Class).`,
        `2. Duration of Recess is ${recessMins} minutes.`,
        `3. Lunch starts at ${rows[3].time} and ends at ${rows[4].time} (Dismissal).`,
        `4. Duration of Lunch is 1 hour (${lunchMins} minutes).`,
        `5. Total break time = ${recessMins} minutes + ${lunchMins} minutes = ${recessMins + lunchMins} minutes.`,
        `6. ${recessMins + lunchMins} minutes is 1 hour 30 minutes.`
      ]);
      
      structureSteps = [
        { label: `Duration of Recess:`, expectedAnswer: `${recessMins} minutes` },
        { label: `Duration of Lunch:`, expectedAnswer: `1 hour` },
        { label: `Total break time in minutes:`, expectedAnswer: `${recessMins + lunchMins} minutes` },
        { label: `Total break time in hours and minutes:`, expectedAnswer: `1 hour 30 minutes` }
      ];

      if (isMCQ) {
        mcqOptions = [actualAnswer, '2 hours', '1 hour', '2 hours 30 minutes', '30 minutes'];
      }
    } else if (qType === 1) {
      structureText = `Look at the school timetable above. How much total time is spent in classes (Morning Class and Afternoon Class)?`;
      shortText = `Total class time (Morning + Afternoon) from timetable:`;
      actualAnswer = `4 hours`;
      hintStr = `Calculate the duration for Morning Class and Afternoon Class separately. Then add them together!`;
      
      stepsStr = JSON.stringify([
        `1. Morning Class starts at ${rows[0].time} and ends at ${rows[1].time}.`,
        `2. Duration of Morning Class is ${class1Mins / 60} hours.`,
        `3. Afternoon Class starts at ${rows[2].time} and ends at ${rows[3].time}.`,
        `4. Duration of Afternoon Class is ${class2Mins / 60} hours.`,
        `5. Total class time = ${class1Mins / 60} hours + ${class2Mins / 60} hours = ${(class1Mins + class2Mins) / 60} hours.`
      ]);
      
      structureSteps = [
        { label: `Duration of Morning Class:`, expectedAnswer: `${class1Mins / 60} hours` },
        { label: `Duration of Afternoon Class:`, expectedAnswer: `${class2Mins / 60} hours` },
        { label: `Total class time:`, expectedAnswer: `${(class1Mins + class2Mins) / 60} hours` }
      ];

      if (isMCQ) {
        mcqOptions = [actualAnswer, '3 hours', '5 hours', '2 hours', '4 hours 30 minutes'];
      }
    } else {
      // Modify rows for qType 2
      const isStartBlank = Math.random() > 0.5;
      let missingEventName;
      let actualTimeStr;
      
      if (isStartBlank) {
        // Blank out Afternoon Class start time (which is Recess end time)
        // Wait, if Afternoon class start is blank, then Recess end is blank, so we can't find Recess duration!
        // Instead, blank out Lunch start time (Afternoon class end time).
        missingEventName = "Lunch";
        actualTimeStr = formatTimeWithPeriod(event4.h, event4.m, event4.period);
        rows[3].time = "???";
      } else {
        // Blank out Dismissal time (Lunch end time)
        missingEventName = "Dismissal";
        actualTimeStr = formatTimeWithPeriod(event5.h, event5.m, event5.period);
        rows[4].time = "???";
      }

      visualEngineStr = JSON.stringify({
        componentToRender: "TIMETABLE",
        componentData: {
          title: "School Timetable",
          rows: rows
        }
      });

      const totalBreakMins = recessMins + lunchMins;
      const totalBreakStr = totalBreakMins === 90 ? "1 hour 30 minutes" : "2 hours";

      structureText = `Look at the school timetable above. The total time for breaks (Recess and Lunch) is ${totalBreakStr}. What time is ${missingEventName}?`;
      shortText = `Total break time: ${totalBreakStr}. Find ${missingEventName} time:`;
      actualAnswer = actualTimeStr;
      hintStr = `First find the duration of Recess from the timetable. Subtract it from the total break time to find the Lunch duration. Then use it to find the missing time!`;
      
      if (isStartBlank) {
        stepsStr = JSON.stringify([
          `1. The total break time is ${totalBreakStr}, which is ${totalBreakMins} minutes.`,
          `2. From the timetable, Recess starts at ${rows[1].time} and ends at ${rows[2].time}.`,
          `3. Duration of Recess is ${recessMins} minutes.`,
          `4. Lunch duration = Total break time - Recess duration = ${totalBreakMins} - ${recessMins} = ${lunchMins} minutes.`,
          `5. Lunch ends at ${rows[4].time} (Dismissal).`,
          `6. Lunch starts ${lunchMins} minutes before ${rows[4].time}, which is ${actualTimeStr}.`
        ]);
        
        structureSteps = [
          { label: `Total break time in minutes:`, expectedAnswer: `${totalBreakMins} minutes` },
          { label: `Duration of Recess:`, expectedAnswer: `${recessMins} minutes` },
          { label: `Duration of Lunch in minutes:`, expectedAnswer: `${lunchMins} minutes` },
          { label: `Start time of Lunch:`, expectedAnswer: actualTimeStr }
        ];
      } else {
        stepsStr = JSON.stringify([
          `1. The total break time is ${totalBreakStr}, which is ${totalBreakMins} minutes.`,
          `2. From the timetable, Recess starts at ${rows[1].time} and ends at ${rows[2].time}.`,
          `3. Duration of Recess is ${recessMins} minutes.`,
          `4. Lunch duration = Total break time - Recess duration = ${totalBreakMins} - ${recessMins} = ${lunchMins} minutes.`,
          `5. Lunch starts at ${rows[3].time}.`,
          `6. ${lunchMins} minutes after ${rows[3].time} is ${actualTimeStr} (Dismissal).`
        ]);
        
        structureSteps = [
          { label: `Total break time in minutes:`, expectedAnswer: `${totalBreakMins} minutes` },
          { label: `Duration of Recess:`, expectedAnswer: `${recessMins} minutes` },
          { label: `Duration of Lunch in minutes:`, expectedAnswer: `${lunchMins} minutes` },
          { label: `Time of Dismissal:`, expectedAnswer: actualTimeStr }
        ];
      }

      if (isMCQ) {
        let fake1 = calculateNewTimeWithPeriod(event4.h, event4.m, event4.period, 30, true);
        let fake2 = calculateNewTimeWithPeriod(event4.h, event4.m, event4.period, 30, false);
        if (!isStartBlank) {
           fake1 = calculateNewTimeWithPeriod(event5.h, event5.m, event5.period, 30, true);
           fake2 = calculateNewTimeWithPeriod(event5.h, event5.m, event5.period, 30, false);
        }
        mcqOptions = [actualAnswer, formatTimeWithPeriod(fake1.h, fake1.m, fake1.period), formatTimeWithPeriod(fake2.h, fake2.m, fake2.period)];
      }
    }
  } else if (activeVariant === 'advanced_duration_across_noon') {
    const names = getRandomNames(1);
    const name = names[0];
    
    // start time between 10am and 11am
    const startHour = getRandomInt(10, 11);
    const startMin = Math.random() > 0.5 ? 0 : 30;
    
    // duration 2 to 3 hours
    const durationHours = getRandomInt(2, 3);
    const durationMins = Math.random() > 0.5 ? 0 : 30;
    const totalDurationMins = durationHours * 60 + durationMins;
    
    const startTimeStr = formatTimeWithPeriod(startHour, startMin, 'a.m.');
    const end = calculateNewTimeWithPeriod(startHour, startMin, 'a.m.', totalDurationMins, true);
    
    const endTimeStr = formatTimeWithPeriod(end.h, end.m, end.period);
    const durationStr = `${durationHours > 0 ? durationHours + ' hour' + (durationHours > 1 ? 's' : '') : ''}${durationHours > 0 && durationMins > 0 ? ' ' : ''}${durationMins > 0 ? durationMins + ' minutes' : ''}`;
    
    const qType = Math.random() > 0.5 ? 'find_end' : 'find_duration';
    
    if (qType === 'find_end') {
      structureText = `${name} started a project at ${startTimeStr} and worked for ${durationStr}. What time did ${name} finish the project?`;
      shortText = `Start: ${startTimeStr}. Duration: ${durationStr}. End time:`;
      actualAnswer = endTimeStr;
      hintStr = `Count forward from ${startTimeStr}. Keep in mind that after 11:59 a.m., it becomes 12:00 p.m.!`;
      
      const noonH = 12;
      const noonM = 0;
      const minsToNoon = (noonH * 60) - (startHour * 60 + startMin);
      
      let noonSteps = [];
      if (minsToNoon > 0 && minsToNoon < totalDurationMins) {
        noonSteps = [
          `1. Start time is ${startTimeStr}.`,
          `2. Time until 12:00 p.m. is ${minsToNoon} minutes.`,
          `3. Remaining time after 12:00 p.m. is ${totalDurationMins} - ${minsToNoon} = ${totalDurationMins - minsToNoon} minutes.`,
          `4. ${totalDurationMins - minsToNoon} minutes after 12:00 p.m. is ${endTimeStr}.`
        ];
        structureSteps = [
          { label: `Time until 12:00 p.m. in minutes:`, expectedAnswer: `${minsToNoon} minutes` },
          { label: `Remaining duration after 12:00 p.m.:`, expectedAnswer: `${totalDurationMins - minsToNoon} minutes` },
          { label: `End time:`, expectedAnswer: endTimeStr }
        ];
      } else {
        noonSteps = [
          `1. Start time is ${startTimeStr}.`,
          `2. We add ${durationStr}.`,
          `3. The end time is ${endTimeStr}.`
        ];
        structureSteps = [
          { label: `End time:`, expectedAnswer: endTimeStr }
        ];
      }
      
      stepsStr = JSON.stringify(noonSteps);
      
      if (isMCQ) {
        const o1 = calculateNewTimeWithPeriod(end.h, end.m, end.period, 60, true);
        const o2 = calculateNewTimeWithPeriod(end.h, end.m, end.period, 60, false);
        const o3 = calculateNewTimeWithPeriod(end.h, end.m, end.period, 30, true);
        mcqOptions = [endTimeStr, formatTimeWithPeriod(o1.h, o1.m, o1.period), formatTimeWithPeriod(o2.h, o2.m, o2.period), formatTimeWithPeriod(o3.h, o3.m, o3.period)];
      }
    } else {
      structureText = `${name} started a project at ${startTimeStr} and finished at ${endTimeStr}. How long did ${name} work on the project?`;
      shortText = `Start: ${startTimeStr}. End: ${endTimeStr}. Duration:`;
      actualAnswer = durationStr;
      hintStr = `Count the time from ${startTimeStr} to 12:00 p.m., and then from 12:00 p.m. to ${endTimeStr}. Add them together!`;
      
      const noonH = 12;
      const minsToNoon = (noonH * 60) - (startHour * 60 + startMin);
      const minsAfterNoon = (end.h === 12 ? 0 : end.h * 60) + end.m;
      
      stepsStr = JSON.stringify([
        `1. From ${startTimeStr} to 12:00 p.m. is ${minsToNoon} minutes.`,
        `2. From 12:00 p.m. to ${endTimeStr} is ${minsAfterNoon} minutes.`,
        `3. Total time = ${minsToNoon} + ${minsAfterNoon} = ${totalDurationMins} minutes.`,
        `4. ${totalDurationMins} minutes is ${durationStr}.`
      ]);
      
      structureSteps = [
        { label: `Duration from ${startTimeStr} to 12:00 p.m.:`, expectedAnswer: `${minsToNoon} minutes` },
        { label: `Duration from 12:00 p.m. to ${endTimeStr}:`, expectedAnswer: `${minsAfterNoon} minutes` },
        { label: `Total duration in minutes:`, expectedAnswer: `${totalDurationMins} minutes` },
        { label: `Total duration:`, expectedAnswer: durationStr }
      ];
      
      if (isMCQ) {
        mcqOptions = [durationStr, `${durationHours + 1} hours`, `${durationHours} hours`, `${durationHours} hours ${durationMins === 30 ? '0' : '30'} minutes`];
      }
    }
  } else if (activeVariant === 'advanced_duration_relative_comparison') {
    const names = getRandomNames(1);
    const name = names[0];
    
    const act1 = "reading a book";
    const act2 = "playing a game";
    
    const relationType = Math.random() > 0.5 ? 'add_sub' : 'times';
    
    let act1Mins, act2Mins, act1Str, act2Str, relationText, relationShortText, step2Text, step2Op;
    
    if (relationType === 'add_sub') {
      const diffMins = Math.random() > 0.5 ? 30 : 60; // 30 mins or 1 hour
      act1Mins = Math.random() > 0.5 ? 60 : 90;
      
      const isLonger = Math.random() > 0.5;
      
      // Ensure positive time if shorter
      if (!isLonger && act1Mins <= diffMins) {
        act1Mins = diffMins + 30;
      }
      
      act2Mins = isLonger ? act1Mins + diffMins : act1Mins - diffMins;
      
      const diffStr = diffMins === 60 ? "1 hour" : "30 minutes";
      relationText = `${name} spent ${diffStr} ${isLonger ? 'more' : 'less'} time ${act2} than ${act1}.`;
      relationShortText = `${act2}: ${diffStr} ${isLonger ? 'longer' : 'shorter'}.`;
      step2Text = `Time spent ${act2} is ${diffStr} ${isLonger ? 'more' : 'less'}.`;
      step2Op = `${act1Mins} ${isLonger ? '+' : '-'} ${diffMins} = ${act2Mins} minutes.`;
    } else {
      const multiplier = getRandomInt(2, 3); // 2 times or 3 times
      act1Mins = Math.random() > 0.5 ? 30 : 60; // 30 mins or 1 hr
      
      act2Mins = act1Mins * multiplier;
      
      relationText = `${name} spent ${multiplier} times as much time ${act2} as ${act1}.`;
      relationShortText = `${act2}: ${multiplier} times as long as ${act1}.`;
      step2Text = `Time spent ${act2} is ${multiplier} times as much.`;
      step2Op = `${act1Mins} × ${multiplier} = ${act2Mins} minutes.`;
    }
    
    act1Str = act1Mins === 30 ? "30 minutes" : (act1Mins === 60 ? "1 hour" : (act1Mins === 90 ? "1 hour 30 minutes" : `${act1Mins / 60} hours`));
    act2Str = act2Mins === 30 ? "30 minutes" : (act2Mins === 60 ? "1 hour" : (act2Mins === 90 ? "1 hour 30 minutes" : (act2Mins === 120 ? "2 hours" : (act2Mins === 150 ? "2 hours 30 minutes" : (act2Mins === 180 ? "3 hours" : `${act2Mins} minutes`)))));
    
    const totalMins = act1Mins + act2Mins;
    let totalStr = '';
    if (totalMins === 60) totalStr = '1 hour';
    else if (totalMins === 90) totalStr = '1 hour 30 minutes';
    else if (totalMins === 120) totalStr = '2 hours';
    else if (totalMins === 150) totalStr = '2 hours 30 minutes';
    else if (totalMins === 180) totalStr = '3 hours';
    else if (totalMins === 210) totalStr = '3 hours 30 minutes';
    else if (totalMins === 240) totalStr = '4 hours';
    else if (totalMins === 270) totalStr = '4 hours 30 minutes';
    else totalStr = `${totalMins} minutes`;
    
    const qType = Math.random() > 0.5 ? 'find_act2' : 'find_total';
    
    if (qType === 'find_act2') {
      structureText = `${name} spent ${act1Str} ${act1}. ${relationText} How long did ${name} spend ${act2}?`;
      shortText = `${act1}: ${act1Str}. ${relationShortText} Duration for ${act2}:`;
      actualAnswer = act2Str;
      hintStr = `Convert the time spent ${act1} into minutes first. Then use the clue to find the time for ${act2}!`;
      stepsStr = JSON.stringify([
        `1. Time spent ${act1} = ${act1Str} = ${act1Mins} minutes.`,
        `2. ${step2Text}`,
        `3. ${step2Op}`,
        `4. ${act2Mins} minutes is ${act2Str}.`
      ]);
      structureSteps = [
        { label: `Time spent ${act1} in minutes:`, expectedAnswer: `${act1Mins} minutes` },
        { label: `Time spent ${act2} in minutes:`, expectedAnswer: `${act2Mins} minutes` },
        { label: `Duration for ${act2}:`, expectedAnswer: act2Str }
      ];
      if (isMCQ) {
        mcqOptions = [act2Str, act1Str, '2 hours', '1 hour 30 minutes', '3 hours'];
      }
    } else {
      structureText = `${name} spent ${act1Str} ${act1}. ${relationText} How much time did ${name} spend altogether?`;
      shortText = `${act1}: ${act1Str}. ${relationShortText} Total time:`;
      actualAnswer = totalStr;
      hintStr = `Find the time spent ${act2} in minutes first. Then add both times together!`;
      stepsStr = JSON.stringify([
        `1. Time spent ${act1} = ${act1Str} = ${act1Mins} minutes.`,
        `2. ${step2Text} ${step2Op}`,
        `3. Total time = ${act1Mins} + ${act2Mins} = ${totalMins} minutes.`,
        `4. ${totalMins} minutes is ${totalStr}.`
      ]);
      structureSteps = [
        { label: `Time spent ${act1} in minutes:`, expectedAnswer: `${act1Mins} minutes` },
        { label: `Time spent ${act2} in minutes:`, expectedAnswer: `${act2Mins} minutes` },
        { label: `Total time in minutes:`, expectedAnswer: `${totalMins} minutes` },
        { label: `Total time altogether:`, expectedAnswer: totalStr }
      ];
      if (isMCQ) {
        mcqOptions = [totalStr, act2Str, act1Str, '2 hours', '4 hours'];
      }
    }
  } else if (activeVariant === 'advanced_chained_events_with_gap') {
    const names = getRandomNames(1);
    const name = names[0];
    
    const startHour = getRandomInt(1, 4);
    const startMin = Math.random() > 0.5 ? 0 : 30;
    const startPeriod = 'p.m.';
    const startTimeStr = formatTimeWithPeriod(startHour, startMin, startPeriod);
    
    const event1Mins = 60; // 1 hour
    const gapMins = 30;    // 30 mins
    const event2Mins = 60; // 1 hour
    
    const event1End = calculateNewTimeWithPeriod(startHour, startMin, startPeriod, event1Mins, true);
    const event2Start = calculateNewTimeWithPeriod(event1End.h, event1End.m, event1End.period, gapMins, true);
    const event2End = calculateNewTimeWithPeriod(event2Start.h, event2Start.m, event2Start.period, event2Mins, true);
    
    const finalEndTimeStr = formatTimeWithPeriod(event2End.h, event2End.m, event2End.period);
    const event1EndStr = formatTimeWithPeriod(event1End.h, event1End.m, event1End.period);
    const event2StartStr = formatTimeWithPeriod(event2Start.h, event2Start.m, event2Start.period);
    
    const qTypes = ['find_end', 'find_start', 'find_gap'];
    const qType = qTypes[getRandomInt(0, 2)];
    
    if (qType === 'find_end') {
      structureText = `${name} had a 1-hour class, followed by a 30-minute bus ride, and then watched a 1-hour movie. If the class started at ${startTimeStr}, what time did the movie end?`;
      shortText = `Start: ${startTimeStr}. Class: 1 hr. Bus: 30 mins. Movie: 1 hr. End time:`;
      actualAnswer = finalEndTimeStr;
      hintStr = `Add the times step by step! First add the class time, then the bus ride, and finally the movie.`;
      
      stepsStr = JSON.stringify([
        `1. The class started at ${startTimeStr} and lasted 1 hour.`,
        `2. ${startTimeStr} + 1 hour = ${event1EndStr} (End of class).`,
        `3. The bus ride took 30 minutes.`,
        `4. ${event1EndStr} + 30 minutes = ${event2StartStr} (Start of movie).`,
        `5. The movie lasted 1 hour.`,
        `6. ${event2StartStr} + 1 hour = ${finalEndTimeStr}.`
      ]);
      
      structureSteps = [
        { label: `End time of class (after 1 hour):`, expectedAnswer: event1EndStr },
        { label: `Start time of movie (after 30 min bus ride):`, expectedAnswer: event2StartStr },
        { label: `End time of movie (after 1 hour):`, expectedAnswer: finalEndTimeStr }
      ];
      
      if (isMCQ) {
        const o1 = calculateNewTimeWithPeriod(event2End.h, event2End.m, event2End.period, 60, true);
        const o2 = calculateNewTimeWithPeriod(event2End.h, event2End.m, event2End.period, 30, false);
        mcqOptions = [finalEndTimeStr, formatTimeWithPeriod(o1.h, o1.m, o1.period), formatTimeWithPeriod(o2.h, o2.m, o2.period), event2StartStr];
      }
    } else if (qType === 'find_start') {
      structureText = `${name} had a 1-hour class, followed by a 30-minute bus ride, and then watched a 1-hour movie. If the movie ended at ${finalEndTimeStr}, what time did the class start?`;
      shortText = `Class: 1 hr. Bus: 30 mins. Movie: 1 hr. End time: ${finalEndTimeStr}. Start time:`;
      actualAnswer = startTimeStr;
      hintStr = `Work backwards! Subtract the movie time, then the bus ride, and finally the class time to find the start time.`;
      
      stepsStr = JSON.stringify([
        `1. The movie ended at ${finalEndTimeStr} and lasted 1 hour.`,
        `2. 1 hour before ${finalEndTimeStr} is ${event2StartStr} (Start of movie).`,
        `3. The bus ride took 30 minutes.`,
        `4. 30 minutes before ${event2StartStr} is ${event1EndStr} (End of class).`,
        `5. The class lasted 1 hour.`,
        `6. 1 hour before ${event1EndStr} is ${startTimeStr}.`
      ]);
      
      structureSteps = [
        { label: `Start time of movie (1 hour before end):`, expectedAnswer: event2StartStr },
        { label: `End time of class (30 min before movie):`, expectedAnswer: event1EndStr },
        { label: `Start time of class (1 hour before class ends):`, expectedAnswer: startTimeStr }
      ];
      
      if (isMCQ) {
        const o1 = calculateNewTimeWithPeriod(startHour, startMin, startPeriod, 60, true);
        const o2 = calculateNewTimeWithPeriod(startHour, startMin, startPeriod, 30, false);
        mcqOptions = [startTimeStr, formatTimeWithPeriod(o1.h, o1.m, o1.period), formatTimeWithPeriod(o2.h, o2.m, o2.period), event1EndStr];
      }
    } else {
      structureText = `${name} had a 1-hour class, followed by a bus ride, and then watched a 1-hour movie. If the class started at ${startTimeStr} and the movie ended at ${finalEndTimeStr}, how long was the bus ride?`;
      shortText = `Start: ${startTimeStr}. Class: 1 hr. Bus: ?. Movie: 1 hr. End time: ${finalEndTimeStr}. Bus duration:`;
      actualAnswer = `30 minutes`;
      hintStr = `Find the total time from start to end first. Then subtract the class and movie times to find the bus ride duration!`;
      
      const totalElapsedMins = event1Mins + gapMins + event2Mins; // 150 mins
      const totalElapsedStr = "2 hours 30 minutes";
      
      stepsStr = JSON.stringify([
        `1. From ${startTimeStr} to ${finalEndTimeStr} is ${totalElapsedStr} (${totalElapsedMins} minutes).`,
        `2. The class was 1 hour (60 minutes).`,
        `3. The movie was 1 hour (60 minutes).`,
        `4. Total known time = 60 + 60 = 120 minutes.`,
        `5. Bus ride = Total time - Known time = ${totalElapsedMins} - 120 = 30 minutes.`
      ]);
      
      structureSteps = [
        { label: `Total time from start to end in minutes:`, expectedAnswer: `${totalElapsedMins} minutes` },
        { label: `Total time of class and movie in minutes:`, expectedAnswer: `120 minutes` },
        { label: `Duration of bus ride:`, expectedAnswer: `30 minutes` }
      ];
      
      if (isMCQ) {
        mcqOptions = [`30 minutes`, `1 hour`, `1 hour 30 minutes`, `45 minutes`];
      }
    }
  }

  // Remove duplicates and shuffle options for MCQ
  if (isMCQ) {
    mcqOptions = [...new Set(mcqOptions)];
    while (mcqOptions.length < 4) {
      mcqOptions.push(`${getRandomInt(1, 12)}:${Math.random() > 0.5 ? '00' : '30'} ${Math.random() > 0.5 ? 'a.m.' : 'p.m.'}`);
      mcqOptions = [...new Set(mcqOptions)];
    }
    mcqOptions.sort(() => Math.random() - 0.5);
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

  const askText = getQText(structureText, shortText);

  systemPrompt = `
Generate a math question using the following exact parameters:
Question Text: ${askText}
Correct Answer: ${actualAnswer}
${isMCQ ? `MCQ Options: ${JSON.stringify(mcqOptions)}` : ''}
Solution Steps: ${stepsStr}
Hint: ${hintStr}

CRITICAL INSTRUCTIONS:
- You must use the EXACT question text provided above.
- You must use the EXACT correct answer provided above.
- Ensure the solution steps are broken down clearly.
- Output ONLY valid JSON using the provided schema template.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `.trim();

  return { aiPrompt: systemPrompt };
}
