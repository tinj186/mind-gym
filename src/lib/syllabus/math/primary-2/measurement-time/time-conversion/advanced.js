import { getRandomNames, getTimeActivities, getPairedActivities } from '@/lib/utils/variable-bank';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const advancedLogic = (activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions) => {
  let structureText = '';
  let shortText = '';
  let actualAnswer = '';
  let hintStr = '';
  let stepsStr = '[]';
  let structureSteps = [];
  let mcqOptions = [];
  let defectMap = {};
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = `{"inputType":"TEXT_INPUT"}`;

  const names = getRandomNames(2);
  const name1 = names[0];
  const name2 = names[1];

  if (activeVariant === 'advanced_remainder_minutes_from_hour') {
    const hours = getRandomInt(1, 2);
    const totalMinutes = hours * 60;
    const breakMinutes = getRandomInt(2, 8) * 5; // 10 to 40 mins
    const mainMinutes = totalMinutes - breakMinutes;
    
    // Choose sensible pairs
    const pair = getPairedActivities();
    const hourStr = hours === 1 ? "1-hour" : "2-hour";
    
    const unknownType = getRandomInt(1, 3); // 1 = Unknown Main, 2 = Unknown Break, 3 = Unknown Total

    if (unknownType === 1) {
      // Unknown Main
      structureText = `A ${hourStr} ${pair.main} includes a ${breakMinutes}-minute ${pair.break}. The rest of the time is for the actual ${pair.main}. How many minutes is the actual ${pair.main}?`;
      shortText = `Total time: ${hours} ${hours === 1 ? 'hour' : 'hours'}. ${pair.break}: ${breakMinutes} mins. Actual ${pair.main} in mins:`;
      actualAnswer = `${mainMinutes} minutes`;
      hintStr = `Remember that 1 hour is 60 minutes. Convert ${hours} ${hours === 1 ? 'hour' : 'hours'} to minutes, then subtract ${breakMinutes} minutes!`;
      stepsStr = JSON.stringify([
        `Convert the total time to minutes.`,
        `${hours} ${hours === 1 ? 'hour' : 'hours'} = ${totalMinutes} minutes.`,
        `Subtract the ${pair.break} time from the total time.`,
        `${totalMinutes} - ${breakMinutes} = ${mainMinutes} minutes.`
      ]);
      structureSteps = [
        { label: `Total time in minutes:`, expectedAnswer: `${totalMinutes}` },
        { label: `Equation:`, expectedAnswer: `${totalMinutes} - ${breakMinutes} = ${mainMinutes}` }
      ];
      if (isMCQ) {
        mcqOptions = [
          `${mainMinutes} minutes`,
          `${mainMinutes + 10} minutes`,
          `${Math.abs(mainMinutes - 10)} minutes`,
          `${totalMinutes + breakMinutes} minutes`
        ];
        defectMap = {
          [`${mainMinutes + 10} minutes`]: "ARITHMETIC_ERROR",
          [`${Math.abs(mainMinutes - 10)} minutes`]: "ARITHMETIC_ERROR",
          [`${totalMinutes + breakMinutes} minutes`]: "WRONG_OPERATION"
        };
      }
    } else if (unknownType === 2) {
      // Unknown Break
      structureText = `A ${hourStr} ${pair.main} includes the actual ${pair.main} which lasts for ${mainMinutes} minutes. The rest of the time is for a ${pair.break}. How many minutes is the ${pair.break}?`;
      shortText = `Total time: ${hours} ${hours === 1 ? 'hour' : 'hours'}. Actual ${pair.main}: ${mainMinutes} mins. ${pair.break} in mins:`;
      actualAnswer = `${breakMinutes} minutes`;
      hintStr = `Remember that 1 hour is 60 minutes. Convert ${hours} ${hours === 1 ? 'hour' : 'hours'} to minutes, then subtract the actual ${pair.main} time!`;
      stepsStr = JSON.stringify([
        `Convert the total time to minutes.`,
        `${hours} ${hours === 1 ? 'hour' : 'hours'} = ${totalMinutes} minutes.`,
        `Subtract the actual ${pair.main} time from the total time.`,
        `${totalMinutes} - ${mainMinutes} = ${breakMinutes} minutes.`
      ]);
      structureSteps = [
        { label: `Total time in minutes:`, expectedAnswer: `${totalMinutes}` },
        { label: `Equation:`, expectedAnswer: `${totalMinutes} - ${mainMinutes} = ${breakMinutes}` }
      ];
      if (isMCQ) {
        mcqOptions = [
          `${breakMinutes} minutes`,
          `${breakMinutes + 5} minutes`,
          `${Math.abs(breakMinutes - 5)} minutes`,
          `${totalMinutes + mainMinutes} minutes`
        ];
        defectMap = {
          [`${breakMinutes + 5} minutes`]: "ARITHMETIC_ERROR",
          [`${Math.abs(breakMinutes - 5)} minutes`]: "ARITHMETIC_ERROR",
          [`${totalMinutes + mainMinutes} minutes`]: "WRONG_OPERATION"
        };
      }
    } else {
      // Unknown Total
      structureText = `A ${pair.main} includes a ${breakMinutes}-minute ${pair.break} and the actual ${pair.main} which lasts for ${mainMinutes} minutes. How many hours is the entire ${pair.main}?`;
      shortText = `${pair.break}: ${breakMinutes} mins. Actual ${pair.main}: ${mainMinutes} mins. Total time in hours:`;
      actualAnswer = hours === 1 ? `1 hour` : `${hours} hours`;
      hintStr = `Add the minutes together first, then convert the total minutes to hours!`;
      stepsStr = JSON.stringify([
        `Add the time spent on the ${pair.break} and the actual ${pair.main}.`,
        `${breakMinutes} + ${mainMinutes} = ${totalMinutes} minutes.`,
        `Convert the total minutes to hours.`,
        `${totalMinutes} ÷ 60 = ${hours}.`,
        `The total time is ${actualAnswer}.`
      ]);
      structureSteps = [
        { label: `Total time in minutes:`, expectedAnswer: `${totalMinutes}` },
        { label: `Equation:`, expectedAnswer: `${breakMinutes} + ${mainMinutes} = ${totalMinutes}` } // Also an equation!
      ];
      if (isMCQ) {
        mcqOptions = [
          actualAnswer,
          `${totalMinutes} hours`,
          `${hours + 1} hours`,
          hours === 1 ? `2 hours` : `${hours - 1} hours`
        ];
        defectMap = {
          [`${totalMinutes} hours`]: "CONFUSION_OF_UNITS",
          [`${hours + 1} hours`]: "ARITHMETIC_ERROR",
          [hours === 1 ? `2 hours` : `${hours - 1} hours`]: "ARITHMETIC_ERROR"
        };
      }
    }
  } else if (activeVariant === 'advanced_accumulate_minutes_to_hours') {
    const actualDays = getRandomInt(1, 2) * 2; // 2 or 4 days
    const totalMinutes = actualDays * 30;
    const actualTotalHours = totalMinutes / 60;
    
    const activitiesWrapped = getTimeActivities(1, true);
    // getTimeActivities(1, true) returns the object directly
    const act = activitiesWrapped.text;
    
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const startDayIdx = getRandomInt(0, 7 - actualDays);
    
    let actualDaysStr = "";
    for(let i=0; i<actualDays; i++) {
      if (i > 0 && i === actualDays - 1) {
        actualDaysStr += ` and on ${dayNames[startDayIdx + i]}`;
      } else if (i > 0) {
        actualDaysStr += `, on ${dayNames[startDayIdx + i]}`;
      } else {
        actualDaysStr += `on ${dayNames[startDayIdx + i]}`;
      }
    }
    
    const unknownType = getRandomInt(1, 3); // 1 = Unknown Total, 2 = Unknown Days, 3 = Unknown Duration per day

    if (unknownType === 1) {
      // Unknown Total Hours
      structureText = `${name1} spends 30 minutes ${act} ${actualDaysStr}. How many whole hours did ${name1} spend altogether?`;
      shortText = `${act}: 30 mins each day for ${actualDays} days. Total time in hours:`;
      actualAnswer = actualTotalHours === 1 ? `1 hour` : `${actualTotalHours} hours`;
      
      hintStr = `Add up 30 minutes for each of the ${actualDays} days, then convert the total minutes to hours!`;

      stepsStr = JSON.stringify([
        `Add the time spent for ${actualDays} days.`,
        `${actualDays} × 30 = ${totalMinutes} minutes.`,
        `We know that 60 minutes is equal to 1 hour.`,
        `${totalMinutes} ÷ 60 = ${actualTotalHours}.`,
        `The total time is ${actualAnswer}.`
      ]);

      const additionStr = Array(actualDays).fill('30').join(' + ');
      structureSteps = [
        { label: `Total minutes:`, expectedAnswer: `${additionStr} = ${totalMinutes}` },
        { label: `Equation:`, expectedAnswer: `${totalMinutes} / 60 = ${actualTotalHours}` }
      ];

      if (isMCQ) {
        mcqOptions = [actualAnswer, `${totalMinutes} hours`, `${actualTotalHours + 1} hours`, `${actualTotalHours === 1 ? 2 : actualTotalHours - 1} hours`];
        defectMap = {
          [`${totalMinutes} hours`]: "CONFUSION_OF_UNITS",
          [`${actualTotalHours + 1} hours`]: "ARITHMETIC_ERROR",
          [`${actualTotalHours === 1 ? 2 : actualTotalHours - 1} hours`]: "ARITHMETIC_ERROR"
        };
      }
    } else if (unknownType === 2) {
      // Unknown Days
      const hourStr = actualTotalHours === 1 ? "1 hour" : `${actualTotalHours} hours`;
      structureText = `${name1} spends 30 minutes ${act} every day. If ${name1} spent a total of ${hourStr} doing this, how many days did ${name1} do this for?`;
      shortText = `${act}: 30 mins every day. Total time: ${hourStr}. Number of days:`;
      actualAnswer = `${actualDays} days`;
      
      hintStr = `Convert ${hourStr} into minutes first. Then figure out how many 30 minutes fit into that total!`;

      stepsStr = JSON.stringify([
        `Convert the total hours to minutes.`,
        `${hourStr} = ${totalMinutes} minutes.`,
        `Divide the total minutes by 30 minutes to find the number of days.`,
        `${totalMinutes} ÷ 30 = ${actualDays}.`,
        `The answer is ${actualDays} days.`
      ]);

      structureSteps = [
        { label: `Total time in minutes:`, expectedAnswer: `${actualTotalHours} * 60 = ${totalMinutes}` },
        { label: `Equation:`, expectedAnswer: `${totalMinutes} / 30 = ${actualDays}` }
      ];

      if (isMCQ) {
        mcqOptions = [actualAnswer, `${actualDays + 1} days`, `${actualDays - 1 > 0 ? actualDays - 1 : actualDays + 2} days`, `${totalMinutes} days`];
        defectMap = {
          [`${actualDays + 1} days`]: "ARITHMETIC_ERROR",
          [`${actualDays - 1 > 0 ? actualDays - 1 : actualDays + 2} days`]: "ARITHMETIC_ERROR",
          [`${totalMinutes} days`]: "CONFUSION_OF_UNITS"
        };
      }
    } else {
      // Unknown Duration per day
      const hourStr = actualTotalHours === 1 ? "1 hour" : `${actualTotalHours} hours`;
      structureText = `${name1} spends an equal amount of time ${act} ${actualDaysStr}. If ${name1} spent a total of ${hourStr} doing this, how many minutes did ${name1} spend on it each day?`;
      shortText = `Total time: ${hourStr} over ${actualDays} days. Time spent each day in mins:`;
      actualAnswer = `30 minutes`;
      
      hintStr = `Convert ${hourStr} into minutes first. Then divide the total minutes by the ${actualDays} days!`;

      stepsStr = JSON.stringify([
        `Convert the total hours to minutes.`,
        `${hourStr} = ${totalMinutes} minutes.`,
        `Divide the total minutes by ${actualDays} days to find the time per day.`,
        `${totalMinutes} ÷ ${actualDays} = 30.`,
        `The answer is 30 minutes.`
      ]);

      structureSteps = [
        { label: `Total time in minutes:`, expectedAnswer: `${actualTotalHours} * 60 = ${totalMinutes}` },
        { label: `Equation:`, expectedAnswer: `${totalMinutes} / ${actualDays} = 30` }
      ];

      if (isMCQ) {
        mcqOptions = [`30 minutes`, `60 minutes`, `15 minutes`, `45 minutes`];
        defectMap = {
          "60 minutes": "ARITHMETIC_ERROR",
          "15 minutes": "ARITHMETIC_ERROR",
          "45 minutes": "ARITHMETIC_ERROR"
        };
      }
    }
  } else if (activeVariant === 'advanced_comparative_word_problem') {
    const actWrapped = getTimeActivities(1, true);
    const act = actWrapped.text;
    
    const startHours = [2, 3, 4, 5];
    const startHour = startHours[getRandomInt(0, startHours.length - 1)];
    const startTimeStr = `${startHour}:00 p.m.`;
    
    const difference = getRandomInt(4, 11) * 5; 
    const minutes2 = 60 - difference; 
    const endTimeStr = `${startHour}:${minutes2.toString().padStart(2, '0')} p.m.`;
    
    const unknownType = getRandomInt(1, 4); // 1 = End Time, 2 = Duration in Hours (a), 3 = Difference (b), 4 = Start Time (d)

    if (unknownType === 1) {
      // Solve for Ending Time (e)
      structureText = `${name1} and ${name2} started ${act} at ${startTimeStr}. ${name1} spent 1 hour on it. ${name1} spent ${difference} minutes MORE than ${name2}. What time did ${name2} finish?`;
      shortText = `Start: ${startTimeStr}. ${name1}: 1 hour. ${name2} is ${difference} mins faster. ${name2} ends at:`;
      actualAnswer = endTimeStr;
      hintStr = `Convert ${name1}'s time to minutes first (1 hour = 60 minutes). Subtract ${difference} minutes to find ${name2}'s time, then add that to the starting time!`;

      stepsStr = JSON.stringify([
        `Convert ${name1}'s time to minutes.`,
        `1 hour = 60 minutes.`,
        `Find ${name2}'s duration by subtracting ${difference} minutes.`,
        `60 - ${difference} = ${minutes2} minutes.`,
        `Add ${minutes2} minutes to the starting time of ${startTimeStr}.`,
        `The ending time is ${endTimeStr}.`
      ]);

      structureSteps = [
        { label: `Convert 1 hour to minutes:`, expectedAnswer: `1 * 60 = 60` },
        { label: `${name2}'s duration in minutes:`, expectedAnswer: `60 - ${difference} = ${minutes2}` },
        { label: `Ending time:`, expectedAnswer: endTimeStr }
      ];

      if (isMCQ) {
        mcqOptions = [
          endTimeStr,
          `${startHour}:${(minutes2 + 10).toString().padStart(2, '0')} p.m.`,
          `${startHour}:${(minutes2 - 10 > 0 ? minutes2 - 10 : minutes2 + 20).toString().padStart(2, '0')} p.m.`,
          `${startHour}:${difference.toString().padStart(2, '0')} p.m.`
        ];
        defectMap = {
          [`${startHour}:${(minutes2 + 10).toString().padStart(2, '0')} p.m.`]: "ARITHMETIC_ERROR",
          [`${startHour}:${(minutes2 - 10 > 0 ? minutes2 - 10 : minutes2 + 20).toString().padStart(2, '0')} p.m.`]: "ARITHMETIC_ERROR",
          [`${startHour}:${difference.toString().padStart(2, '0')} p.m.`]: "WRONG_OPERATION"
        };
      }
    } else if (unknownType === 2) {
      // Solve for Name 1's duration in hours (a)
      structureText = `${name1} and ${name2} started ${act} at ${startTimeStr}. ${name1} spent some time on it. ${name1} spent ${difference} minutes MORE than ${name2}. If ${name2} finished at ${endTimeStr}, how many hours did ${name1} spend on it?`;
      shortText = `Start: ${startTimeStr}. ${name2} ends at ${endTimeStr}. ${name1} is ${difference} mins slower. ${name1} total time in hours:`;
      actualAnswer = `1 hour`;
      hintStr = `Find ${name2}'s duration in minutes first. Add ${difference} minutes to find ${name1}'s duration, then convert that to hours!`;

      stepsStr = JSON.stringify([
        `Find ${name2}'s duration by looking at the start and end time.`,
        `From ${startTimeStr} to ${endTimeStr} is ${minutes2} minutes.`,
        `Find ${name1}'s duration by adding ${difference} minutes.`,
        `${minutes2} + ${difference} = 60 minutes.`,
        `Convert 60 minutes to hours.`,
        `60 minutes = 1 hour.`
      ]);

      structureSteps = [
        { label: `${name2}'s duration in minutes:`, expectedAnswer: `${minutes2}` },
        { label: `${name1}'s duration in minutes:`, expectedAnswer: `${minutes2} + ${difference} = 60` },
        { label: `Convert to hours:`, expectedAnswer: `60 / 60 = 1` }
      ];

      if (isMCQ) {
        mcqOptions = [`1 hour`, `2 hours`, `60 hours`, `3 hours`];
        defectMap = {
          "2 hours": "ARITHMETIC_ERROR",
          "60 hours": "CONFUSION_OF_UNITS",
          "3 hours": "ARITHMETIC_ERROR"
        };
      }
    } else if (unknownType === 3) {
      // Solve for Difference in minutes (b)
      structureText = `${name1} and ${name2} started ${act} at ${startTimeStr}. ${name1} spent 1 hour on it. If ${name2} finished at ${endTimeStr}, how many MORE minutes did ${name1} spend than ${name2}?`;
      shortText = `Start: ${startTimeStr}. ${name1}: 1 hour. ${name2} ends at ${endTimeStr}. Difference in minutes:`;
      actualAnswer = `${difference} minutes`;
      hintStr = `Find ${name2}'s duration in minutes first. Convert ${name1}'s time to minutes, then subtract to find the difference!`;

      stepsStr = JSON.stringify([
        `Find ${name2}'s duration by looking at the start and end time.`,
        `From ${startTimeStr} to ${endTimeStr} is ${minutes2} minutes.`,
        `Convert ${name1}'s time to minutes.`,
        `1 hour = 60 minutes.`,
        `Find the difference.`,
        `60 - ${minutes2} = ${difference} minutes.`
      ]);

      structureSteps = [
        { label: `${name2}'s duration in minutes:`, expectedAnswer: `${minutes2}` },
        { label: `Convert 1 hour to minutes:`, expectedAnswer: `1 * 60 = 60` },
        { label: `Difference in minutes:`, expectedAnswer: `60 - ${minutes2} = ${difference}` }
      ];

      if (isMCQ) {
        mcqOptions = [
          `${difference} minutes`,
          `${difference + 10} minutes`,
          `${Math.abs(difference - 10)} minutes`,
          `${60 + minutes2} minutes`
        ];
        defectMap = {
          [`${difference + 10} minutes`]: "ARITHMETIC_ERROR",
          [`${Math.abs(difference - 10)} minutes`]: "ARITHMETIC_ERROR",
          [`${60 + minutes2} minutes`]: "WRONG_OPERATION"
        };
      }
    } else {
      // Solve for Starting Time (d)
      structureText = `${name1} and ${name2} started ${act} at the same time. ${name1} spent 1 hour on it. ${name1} spent ${difference} minutes MORE than ${name2}. If ${name2} finished at ${endTimeStr}, what time did they start?`;
      shortText = `${name1}: 1 hour. ${name2} is ${difference} mins faster. ${name2} ends at ${endTimeStr}. Start time:`;
      actualAnswer = startTimeStr;
      hintStr = `Convert ${name1}'s time to minutes first (1 hour = 60 minutes). Subtract ${difference} minutes to find ${name2}'s duration, then count backwards from ${endTimeStr}!`;

      stepsStr = JSON.stringify([
        `Convert ${name1}'s time to minutes.`,
        `1 hour = 60 minutes.`,
        `Find ${name2}'s duration by subtracting ${difference} minutes.`,
        `60 - ${difference} = ${minutes2} minutes.`,
        `Count backwards ${minutes2} minutes from ${endTimeStr}.`,
        `The starting time is ${startTimeStr}.`
      ]);

      structureSteps = [
        { label: `Convert 1 hour to minutes:`, expectedAnswer: `1 * 60 = 60` },
        { label: `${name2}'s duration in minutes:`, expectedAnswer: `60 - ${difference} = ${minutes2}` },
        { label: `Starting time:`, expectedAnswer: startTimeStr }
      ];

      if (isMCQ) {
        mcqOptions = [
          startTimeStr,
          `${startHour - 1}:00 p.m.`,
          `${startHour}:30 p.m.`,
          `${startHour - 1}:30 p.m.`
        ];
        defectMap = {
          [`${startHour - 1}:00 p.m.`]: "ARITHMETIC_ERROR",
          [`${startHour}:30 p.m.`]: "ARITHMETIC_ERROR",
          [`${startHour - 1}:30 p.m.`]: "ARITHMETIC_ERROR"
        };
      }
    }
  } else if (activeVariant === 'advanced_timeline_unit_substitution') {
    const pair = getPairedActivities();
    const act1 = pair.main;
    const act2 = pair.break;

    const startHour = getRandomInt(1, 5);
    const startPeriod = Math.random() > 0.5 ? "a.m." : "p.m.";
    
    const firstDurationMins = 60;
    const secondDurationMins = 30;
    const totalDurationMins = firstDurationMins + secondDurationMins;
    
    let endHour = startHour + 1;
    let endMin = 30;
    
    const formatTime = (h, m, p) => {
      let suffix = p;
      let dH = h;
      if (dH === 12) {
        suffix = p === "a.m." ? "p.m." : "a.m.";
      } else if (dH > 12) {
        dH -= 12;
        suffix = p === "a.m." ? "p.m." : "a.m.";
      }
      return `${dH}:${m.toString().padStart(2, '0')} ${suffix}`;
    };
    
    const startTimeStr = `${startHour}:00 ${startPeriod}`;
    const endTimeStr = formatTime(endHour, endMin, startPeriod);

    const unknownType = getRandomInt(1, 4);

    if (unknownType === 1) {
      // Solve for End Time (d)
      structureText = `The ${act1} starts at ${startTimeStr}. It lasts 60 minutes. Then, the ${act2} lasts half an hour. What time does the ${act2} end?`;
      shortText = `Start: ${startTimeStr}. ${act1}: 60 mins. ${act2}: half an hour. End time:`;
      actualAnswer = endTimeStr;
      hintStr = `Find the total duration first. 60 minutes is 1 hour, and half an hour is 30 minutes. Then add that to the start time!`;
      
      stepsStr = JSON.stringify([
        `Find the duration of each part in hours and minutes.`,
        `60 minutes = 1 hour.`,
        `Half an hour = 30 minutes.`,
        `Total duration = 1 hour and 30 minutes.`,
        `Add 1 hour and 30 minutes to ${startTimeStr}.`,
        `${startTimeStr} + 1 hour = ${startHour + 1}:00 ${startPeriod}.`,
        `${startHour + 1}:00 ${startPeriod} + 30 minutes = ${endTimeStr}.`
      ]);

      structureSteps = [
        { label: `Decompose minutes:`, expectedAnswer: `90 = 60 + 30` },
        { label: `Unit conversion:`, expectedAnswer: `1 hour 30 minutes` },
        { label: `Start time:`, expectedAnswer: startTimeStr },
        { label: `Jump 1 hour:`, expectedAnswer: `${startHour + 1}:00 ${startPeriod}` },
        { label: `Jump 30 minutes (End time):`, expectedAnswer: endTimeStr }
      ];
      
      if (isMCQ) {
        mcqOptions = [
          actualAnswer,
          formatTime(endHour - 1, endMin, startPeriod),
          formatTime(endHour + 1, endMin, startPeriod),
          formatTime(endHour, 0, startPeriod)
        ];
        defectMap = {
          [formatTime(endHour - 1, endMin, startPeriod)]: "ARITHMETIC_ERROR",
          [formatTime(endHour + 1, endMin, startPeriod)]: "ARITHMETIC_ERROR",
          [formatTime(endHour, 0, startPeriod)]: "MISREADING_DATA"
        };
      }
    } else if (unknownType === 2) {
      // Solve for Start Time (a)
      structureText = `The ${act1} lasts 60 minutes. Then, the ${act2} lasts half an hour. If the ${act2} ends at ${endTimeStr}, what time did the ${act1} start?`;
      shortText = `${act1}: 60 mins. ${act2}: half an hour. End time: ${endTimeStr}. Start time:`;
      actualAnswer = startTimeStr;
      hintStr = `Find the total duration first. 60 minutes is 1 hour, and half an hour is 30 minutes. Then count backwards from the end time!`;

      stepsStr = JSON.stringify([
        `Find the duration of each part in hours and minutes.`,
        `60 minutes = 1 hour.`,
        `Half an hour = 30 minutes.`,
        `Total duration = 1 hour and 30 minutes.`,
        `Count backwards 1 hour and 30 minutes from ${endTimeStr}.`,
        `${endTimeStr} - 30 minutes = ${startHour + 1}:00 ${startPeriod}.`,
        `${startHour + 1}:00 ${startPeriod} - 1 hour = ${startTimeStr}.`
      ]);

      structureSteps = [
        { label: `Total duration in minutes:`, expectedAnswer: `60 + 30 = 90` },
        { label: `Total duration in hours and mins:`, expectedAnswer: `1 hour 30 mins` },
        { label: `Start time:`, expectedAnswer: startTimeStr }
      ];

      if (isMCQ) {
        mcqOptions = [
          actualAnswer,
          formatTime(startHour + 1, 0, startPeriod),
          formatTime(startHour - 1, 0, startPeriod),
          formatTime(startHour, 30, startPeriod)
        ];
        defectMap = {
          [formatTime(startHour + 1, 0, startPeriod)]: "ARITHMETIC_ERROR",
          [formatTime(startHour - 1, 0, startPeriod)]: "ARITHMETIC_ERROR",
          [formatTime(startHour, 30, startPeriod)]: "MISREADING_DATA"
        };
      }
    } else if (unknownType === 3) {
      // Solve for First Part Duration (b)
      structureText = `The ${act1} starts at ${startTimeStr}. Then, the ${act2} lasts half an hour. If the ${act2} ends at ${endTimeStr}, how many minutes did the ${act1} last?`;
      shortText = `Start: ${startTimeStr}. ${act2}: half an hour. End time: ${endTimeStr}. ${act1} duration in minutes:`;
      actualAnswer = `60 minutes`;
      hintStr = `Find the total time between the start and end time first. Convert that to minutes, then subtract the half an hour!`;

      stepsStr = JSON.stringify([
        `Find the total time from ${startTimeStr} to ${endTimeStr}.`,
        `Total time is 1 hour and 30 minutes, which is 90 minutes.`,
        `Half an hour = 30 minutes.`,
        `Subtract the ${act2} time from the total time.`,
        `90 - 30 = 60 minutes.`
      ]);

      structureSteps = [
        { label: `Total time in minutes:`, expectedAnswer: `90 minutes` },
        { label: `Convert half an hour to mins:`, expectedAnswer: `30` },
        { label: `${act1} duration:`, expectedAnswer: `90 - 30 = 60` }
      ];

      if (isMCQ) {
        mcqOptions = [`60 minutes`, `30 minutes`, `90 minutes`, `45 minutes`];
        defectMap = {
          "30 minutes": "ARITHMETIC_ERROR",
          "90 minutes": "MISREADING_DATA",
          "45 minutes": "ARITHMETIC_ERROR"
        };
      }
    } else {
      // Solve for Second Part Duration (c)
      structureText = `The ${act1} starts at ${startTimeStr}. It lasts 60 minutes. Then, they have a ${act2}. If the ${act2} ends at ${endTimeStr}, how many minutes did the ${act2} last?`;
      shortText = `Start: ${startTimeStr}. ${act1}: 60 mins. End time: ${endTimeStr}. ${act2} duration in minutes:`;
      actualAnswer = `30 minutes`;
      hintStr = `Find the time the ${act1} ended first by adding 60 minutes. Then find the difference to the final end time!`;

      stepsStr = JSON.stringify([
        `Add 60 minutes (1 hour) to the starting time.`,
        `${startTimeStr} + 1 hour = ${startHour + 1}:00 ${startPeriod}.`,
        `Find the difference between ${startHour + 1}:00 ${startPeriod} and ${endTimeStr}.`,
        `The difference is 30 minutes.`
      ]);

      structureSteps = [
        { label: `Time ${act1} ended:`, expectedAnswer: `${startHour + 1}:00 ${startPeriod}` },
        { label: `Time ${act2} ended:`, expectedAnswer: endTimeStr },
        { label: `${act2} duration:`, expectedAnswer: `30` }
      ];

      if (isMCQ) {
        mcqOptions = [`30 minutes`, `60 minutes`, `90 minutes`, `45 minutes`];
        defectMap = {
          "60 minutes": "ARITHMETIC_ERROR",
          "90 minutes": "MISREADING_DATA",
          "45 minutes": "ARITHMETIC_ERROR"
        };
      }
    }
  } else if (activeVariant === 'advanced_schedule_gap_conversion') {
    const isJourney = Math.random() > 0.5;
    const numSlots = getRandomInt(4, 6);
    
    let startHour = getRandomInt(7, 10);
    let startMin = Math.random() > 0.5 ? 0 : 30;
    
    const formatTime = (h, m) => {
      let suffix = "a.m.";
      let dH = h;
      if (dH >= 12) {
        suffix = "p.m.";
        if (dH > 12) dH -= 12;
      }
      return `${dH}:${m.toString().padStart(2, '0')} ${suffix}`;
    };

    let currentTimeH = startHour;
    let currentTimeM = startMin;

    const slots = [];
    const activities = ["Assembly", "Math", "English", "Recess", "Science", "Art", "PE", "Music", "Dismissal"];
    const stations = ["Station A", "Station B", "Station C", "Station D", "Station E", "Station F"];
    
    for (let i = 0; i < numSlots; i++) {
      let eventName = "";
      if (isJourney) {
        eventName = stations[i];
      } else {
        eventName = activities[i];
      }
      
      const gapMins = getRandomInt(1, 3) * 30; // 30, 60, or 90
      slots.push({
        time: formatTime(currentTimeH, currentTimeM),
        event: eventName,
        duration: gapMins,
        startH: currentTimeH,
        startM: currentTimeM
      });
      
      currentTimeM += gapMins;
      while (currentTimeM >= 60) {
        currentTimeH += 1;
        currentTimeM -= 60;
      }
    }
    
    const questionType = getRandomInt(1, 3);
    
    if (questionType === 1) {
      const targetIdx = getRandomInt(0, numSlots - 2);
      const targetSlot = slots[targetIdx];
      const nextSlot = slots[targetIdx + 1];
      
      if (isJourney) {
        structureText = `Look at the train schedule. How many minutes was the journey from ${targetSlot.event} to ${nextSlot.event}?`;
        shortText = `Journey from ${targetSlot.event} to ${nextSlot.event} duration in mins:`;
      } else {
        structureText = `Look at the timetable. How many minutes was ${targetSlot.event}?`;
        shortText = `${targetSlot.event} duration in mins:`;
      }
      
      actualAnswer = `${targetSlot.duration} minutes`;
      hintStr = `Count the time from ${targetSlot.time} to the start of the next event (${nextSlot.time}), then convert it to minutes!`;
      
      stepsStr = JSON.stringify([
        `Find the time difference between ${targetSlot.time} and ${nextSlot.time}.`,
        `The duration is ${targetSlot.duration >= 60 ? (targetSlot.duration === 60 ? '1 hour' : '1 hour and 30 minutes') : '30 minutes'}.`,
        `Convert this duration into minutes.`,
        `${targetSlot.duration >= 60 ? (targetSlot.duration === 60 ? '1 hour = 60 minutes' : '1 hour = 60 minutes, plus 30 minutes = 90 minutes') : 'Half an hour = 30 minutes'}.`,
        `The answer is ${actualAnswer}.`
      ]);
      
      structureSteps = [
        { label: `Start time:`, expectedAnswer: targetSlot.time },
        { label: `End time:`, expectedAnswer: nextSlot.time },
        { label: `Duration in minutes:`, expectedAnswer: `${targetSlot.duration}` }
      ];
      
      visualEngineStr = JSON.stringify({
        componentToRender: "TIMETABLE",
        componentData: {
          title: isJourney ? "Train Schedule" : "School Timetable",
          rows: slots.map(s => ({ time: s.time, event: s.event }))
        }
      });
      
      if (isMCQ) {
        mcqOptions = [`${targetSlot.duration} minutes`, `${targetSlot.duration + 30} minutes`, `${Math.abs(targetSlot.duration - 30) || 15} minutes`, `${targetSlot.duration / 60} hours`];
        defectMap = {
          [`${targetSlot.duration + 30} minutes`]: "ARITHMETIC_ERROR",
          [`${Math.abs(targetSlot.duration - 30) || 15} minutes`]: "ARITHMETIC_ERROR",
          [`${targetSlot.duration / 60} hours`]: "CONFUSION_OF_UNITS"
        };
      }
    } else if (questionType === 2) {
      const targetIdx = getRandomInt(0, numSlots - 3);
      const slot1 = slots[targetIdx];
      const slot2 = slots[targetIdx + 1];
      const nextSlot = slots[targetIdx + 2];
      
      const totalDur = slot1.duration + slot2.duration;
      
      if (isJourney) {
        structureText = `Look at the train schedule. How many minutes was the journey from ${slot1.event} to ${nextSlot.event}?`;
        shortText = `Journey from ${slot1.event} to ${nextSlot.event} duration in mins:`;
      } else {
        structureText = `Look at the timetable. How many minutes was ${slot1.event} and ${slot2.event} combined?`;
        shortText = `${slot1.event} and ${slot2.event} duration in mins:`;
      }
      
      actualAnswer = `${totalDur} minutes`;
      hintStr = `Count the time from the start of ${slot1.event} to the start of ${nextSlot.event}, then convert it to minutes!`;
      
      let durationStr = "";
      if (totalDur / 60 >= 1) {
        durationStr = totalDur % 60 === 0 ? `${totalDur / 60} hours` : `${Math.floor(totalDur / 60)} hours and 30 minutes`;
      } else {
        durationStr = `${totalDur} minutes`;
      }
      
      stepsStr = JSON.stringify([
        `Find the time difference between ${slot1.time} and ${nextSlot.time}.`,
        `The duration is ${durationStr}.`,
        `Convert this duration into minutes.`,
        `The answer is ${actualAnswer}.`
      ]);
      
      structureSteps = [
        { label: `${slot1.event} duration (mins):`, expectedAnswer: `${slot1.duration}` },
        { label: `${slot2.event} duration (mins):`, expectedAnswer: `${slot2.duration}` },
        { label: `Total duration:`, expectedAnswer: `${slot1.duration} + ${slot2.duration} = ${totalDur}` }
      ];
      
      visualEngineStr = JSON.stringify({
        componentToRender: "TIMETABLE",
        componentData: {
          title: isJourney ? "Train Schedule" : "School Timetable",
          rows: slots.map(s => ({ time: s.time, event: s.event }))
        }
      });
      
      if (isMCQ) {
        mcqOptions = [`${totalDur} minutes`, `${totalDur + 30} minutes`, `${Math.abs(totalDur - 30) || 15} minutes`, `${slot1.duration} minutes`];
        defectMap = {
          [`${totalDur + 30} minutes`]: "ARITHMETIC_ERROR",
          [`${Math.abs(totalDur - 30) || 15} minutes`]: "ARITHMETIC_ERROR",
          [`${slot1.duration} minutes`]: "MISREADING_DATA"
        };
      }
    } else {
      const missingIdx = getRandomInt(1, numSlots - 1);
      const missingSlot = slots[missingIdx];
      const prevSlot = slots[missingIdx - 1];
      
      if (isJourney) {
        structureText = `Look at the train schedule. The journey from ${prevSlot.event} to ${missingSlot.event} lasted for ${prevSlot.duration} minutes. What time should be written at the '?' mark?`;
        shortText = `Journey from ${prevSlot.event} to ${missingSlot.event} lasted ${prevSlot.duration} mins. Time at '?':`;
      } else {
        structureText = `Look at the timetable. The ${prevSlot.event} lasted for ${prevSlot.duration} minutes. What time should be written at the '?' mark?`;
        shortText = `${prevSlot.event} lasted ${prevSlot.duration} mins. Time at '?':`;
      }
      actualAnswer = missingSlot.time;
      hintStr = `Add ${prevSlot.duration} minutes to the start time of ${prevSlot.event} to find the missing time!`;
      
      stepsStr = JSON.stringify([
        `Find the start time of ${prevSlot.event}, which is ${prevSlot.time}.`,
        `Add ${prevSlot.duration} minutes to ${prevSlot.time}.`,
        `The missing time is ${missingSlot.time}.`
      ]);
      
      if (prevSlot.duration === 90) {
        structureSteps = [
          { label: `Decompose minutes:`, expectedAnswer: `90 = 60 + 30` },
          { label: `Unit conversion:`, expectedAnswer: `1 hour 30 minutes` },
          { label: `Start time:`, expectedAnswer: prevSlot.time },
          { label: `Jump 1 hour:`, expectedAnswer: formatTime(prevSlot.startH + 1, prevSlot.startM) },
          { label: `Jump 30 minutes (End time):`, expectedAnswer: missingSlot.time }
        ];
      } else if (prevSlot.duration === 60) {
        structureSteps = [
          { label: `Unit conversion:`, expectedAnswer: `60 minutes = 1 hour` },
          { label: `Start time:`, expectedAnswer: prevSlot.time },
          { label: `Jump 1 hour (End time):`, expectedAnswer: missingSlot.time }
        ];
      } else {
        structureSteps = [
          { label: `Start time:`, expectedAnswer: prevSlot.time },
          { label: `Jump 30 minutes (End time):`, expectedAnswer: missingSlot.time }
        ];
      }
      
      visualEngineStr = JSON.stringify({
        componentToRender: "TIMETABLE",
        componentData: {
          title: isJourney ? "Train Schedule" : "School Timetable",
          rows: slots.map((s, idx) => ({ time: idx === missingIdx ? "?" : s.time, event: s.event }))
        }
      });
      
      if (isMCQ) {
        let wrong1 = formatTime(missingSlot.startH, missingSlot.startM + 30);
        let wrong2 = formatTime(missingSlot.startH, missingSlot.startM - 30);
        let wrong3 = formatTime(missingSlot.startH + 1, missingSlot.startM);
        if (wrong1 === actualAnswer) wrong1 = formatTime(missingSlot.startH + 2, missingSlot.startM);
        if (wrong2 === actualAnswer) wrong2 = formatTime(missingSlot.startH - 1, missingSlot.startM);
        
        mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
        defectMap = {
          [wrong1]: "ARITHMETIC_ERROR",
          [wrong2]: "ARITHMETIC_ERROR",
          [wrong3]: "ARITHMETIC_ERROR"
        };
      }
    }
  }

  // Common multi-step logic
  if (isStructure && structureSteps.length > 0) {
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
- You MUST generate a JSON matching the provided OUTPUT FORMAT EXACTLY.
- NO markdown tags (e.g. \`\`\`json) or conversational text.
- questionText: MUST be an array of strings.
- EXACTLY use these values:
  - questionText: [ "${getQText(structureText, shortText)}" ]
  - finalAnswer: "${actualAnswer}"
  - hint: "${hintStr}"
  - solutionSteps: ${stepsStr}
${isMCQ ? `- EXACTLY use these options: ${JSON.stringify(mcqOptions)}\n- EXACTLY use this defectMap: ${JSON.stringify(defectMap)}` : ''}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
`;

  return { aiPrompt };
};
