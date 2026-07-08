import { getRandomNames } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

const getStrictInstruction = (type, isShort) => {
  return `STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT modify ANY field in the JSON template except where instructed. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and 'questionText' MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;
};

export const advancedVariants = {
  advanced_elapsed_time_cross_noon: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const names = getRandomNames(1);
    const startHour = Math.floor(Math.random() * 3) + 9; // 9, 10, or 11 a.m.
    const endHour = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 p.m.
    
    const duration = (12 - startHour) + endHour; // e.g. 10am to 2pm -> (12-10)+2 = 4 hours

    let questionText = getQText(
      `${names} starts an activity at ${startHour}:00 a.m. and finishes at ${endHour}:00 p.m. How many hours did the activity take?`,
      `Duration from ${startHour}:00 a.m. to ${endHour}:00 p.m. = ?`
    );

    const answer = `${duration} hours`;
    const distractor1 = `${duration + 12} hours`; // Common mistake: 14 - 10
    const distractor2 = `${Math.abs(startHour - endHour)} hours`; // Just subtracting the numbers
    const distractor3 = `${duration + 1} hours`; // Off by one
    
    let options = getShuffledOptions(answer, [distractor1, distractor2, distractor3]);
    
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    } else {
      questionText += ` (Choose from: ${options.join(', ')})`;
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${getStrictInstruction(type, isShort)}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionText)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Count the hours from ${startHour}:00 to 12:00, then count from 12:00 to ${endHour}:00.`, `Count to 12, then to ${endHour}.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`From ${startHour}:00 a.m. to 12:00 noon is ${12 - startHour} hours. From 12:00 noon to ${endHour}:00 p.m. is ${endHour} hours. Total is ${12 - startHour} + ${endHour} = ${duration} hours.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "elapsed_time_cross_noon", hideVisual: true }
    };
  },

  advanced_schedule_deduction: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isAmStart = Math.random() > 0.5;
    const names = getRandomNames(1);
    
    // Create a scenario that definitively crosses the noon or midnight boundary.
    // e.g. Start at 10 a.m. + 2 hrs = 12, + 1 hr = 1 p.m.
    const startHour = isAmStart ? 10 : 10; 
    const startString = isAmStart ? "10:00 a.m." : "10:00 p.m.";
    const dur1 = 2; // reaches 12
    const dur2 = 1; // reaches 1
    
    let questionText = getQText(
      `${names} starts a movie at ${startString}. The movie lasts for ${dur1} hours. After the movie, ${names} eats a meal for ${dur2} hour. Does the meal end in the a.m. or p.m.?`,
      `${startString} + ${dur1} hrs + ${dur2} hr = a.m. or p.m.?`
    );

    const answer = isAmStart ? "p.m." : "a.m.";
    const distractor = isAmStart ? "a.m." : "p.m.";
    
    let options = getShuffledOptions(answer, [distractor]);
    
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    } else {
      questionText += ` (Choose from: a.m., p.m.)`;
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${getStrictInstruction(type, isShort)}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionText)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Add the total hours and see if it passes 12:00.`, `Does it cross 12?`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The total time is ${dur1} + ${dur2} = ${dur1 + dur2} hours. ${startHour} + ${dur1 + dur2} = 13, which means it crosses 12:00. So the ${isAmStart ? 'a.m.' : 'p.m.'} changes to ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "schedule_deduction", hideVisual: true }
    };
  },

  advanced_midnight_boundary: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    // 10 p.m. or 11 p.m. + 2 or 3 hours
    const startHour = Math.floor(Math.random() * 2) + 10; // 10 or 11
    const duration = startHour === 10 ? 3 : (Math.random() > 0.5 ? 2 : 3); // ensures it crosses 12
    const endHour = (startHour + duration) > 12 ? (startHour + duration) - 12 : 12; // 12 or 1 or 2
    
    let questionText = getQText(
      `It is ${startHour}:00 p.m. What time will it be ${duration} hours later?`,
      `${startHour}:00 p.m. + ${duration} hrs = ?`
    );
    
    const answer = `${endHour}:00 a.m.`;
    const distractor1 = `${endHour}:00 p.m.`;
    const distractor2 = `${startHour + duration}:00 p.m.`;
    const distractor3 = `${startHour + duration}:00 a.m.`;
    
    let options = getShuffledOptions(answer, [distractor1, distractor2, distractor3]);
    
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    } else {
      questionText += ` (Choose from: ${options.join(', ')})`;
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${getStrictInstruction(type, isShort)}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionText)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Count forward from ${startHour}. After 12:00 midnight, the next day starts and the time becomes a.m.!`, `Crosses midnight.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Counting ${duration} hours from ${startHour} p.m. crosses 12:00 midnight. The time flips to a.m., making it ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "midnight_boundary", hideVisual: true }
    };
  },

  advanced_am_pm_word_problem: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    // Reverse time across noon: 1 p.m. - 2 hours = 11 a.m.
    const names = getRandomNames(1);
    const endHour = Math.floor(Math.random() * 2) + 1; // 1 or 2 p.m.
    const duration = endHour === 1 ? (Math.random() > 0.5 ? 2 : 3) : 3; // ensure it drops below 12
    
    // e.g. 1 p.m., 2 hours early -> 11 a.m.
    const startHour = 12 - (duration - endHour);
    
    let questionText = getQText(
      `A party starts at ${endHour}:00 p.m. ${names} arrived ${duration} hours early. What time did ${names} arrive?`,
      `${endHour}:00 p.m. minus ${duration} hrs = ?`
    );
    
    const answer = `${startHour}:00 a.m.`;
    const distractor1 = `${startHour}:00 p.m.`;
    const distractor2 = `${endHour + duration}:00 p.m.`; // Adding instead of subtracting
    const distractor3 = `12:00 p.m.`;
    
    let options = getShuffledOptions(answer, [distractor1, distractor2, distractor3]);
    
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    } else {
      questionText += ` (Choose from: ${options.join(', ')})`;
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${getStrictInstruction(type, isShort)}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionText)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Count backwards! If you count back past 12:00 noon, p.m. changes to a.m.`, `Count backwards.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Counting backwards ${duration} hours from ${endHour}:00 p.m.: ${endHour} hour back is 12:00, and the remaining ${duration - endHour} hours back is ${startHour}:00 a.m.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "am_pm_word_problem", hideVisual: true }
    };
  },

  advanced_time_comparison: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    // 11:00 a.m. vs 2:00 p.m. - testing if they know a.m. is earlier despite 11 > 2
    const askEarlier = Math.random() > 0.5;
    
    const amTime = "11:00 a.m.";
    const pmTime = "2:00 p.m.";
    
    let questionText = getQText(
      `Which time comes ${askEarlier ? 'earlier' : 'later'} in the day: ${pmTime} or ${amTime}?`,
      `${askEarlier ? 'Earlier' : 'Later'} time = ?`
    );
    
    const answer = askEarlier ? amTime : pmTime;
    const distractor = askEarlier ? pmTime : amTime;
    
    let options = getShuffledOptions(answer, [distractor, "They are the same time", "Cannot tell"]);
    
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    } else {
      questionText += ` (Choose from: ${options.join(', ')})`;
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${getStrictInstruction(type, isShort)}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionText)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Don't just look at the numbers! Look at a.m. and p.m.`, `a.m. is always earlier than p.m.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Times in the morning (a.m.) always come before times in the afternoon (p.m.). Therefore, ${answer} is ${askEarlier ? 'earlier' : 'later'}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 1, logic: "time_comparison", hideVisual: true }
    };
  }
};

export const advancedLogic = {
  generate: function() {
    const activeVariant = arguments[0];
    if (advancedVariants[activeVariant]) {
      return advancedVariants[activeVariant].apply(null, Array.prototype.slice.call(arguments, 1));
    }
  }
};
