import { getRandomNames } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

const getStrictInstruction = (type, isShort) => {
  return `STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT modify ANY field in the JSON template except where instructed. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and 'questionText' MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;
};

export const foundationVariants = {
  foundation_qualitative_longer_shorter: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const askLonger = Math.random() > 0.5;
    
    const longActs = ["Sleeping at night", "Walking to the library", "Watching a movie", "Reading a thick book"];
    const shortActs = ["Blinking your eyes", "Clapping your hands", "Switching on the light", "Sneezing"];
    
    const longAct = longActs[Math.floor(Math.random() * longActs.length)];
    const shortAct = shortActs[Math.floor(Math.random() * shortActs.length)];
    
    let questionText = getQText(
      `Which activity takes a ${askLonger ? 'longer' : 'shorter'} time?`,
      `${askLonger ? 'Longer' : 'Shorter'} activity = ?`
    );

    const answer = askLonger ? longAct : shortAct;
    const distractor = askLonger ? shortAct : longAct;
    
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
          "hint": ${JSON.stringify(getQText(`Think about how fast each action is finished.`, `Which takes more/less time?`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${shortAct} is very quick and finishes almost immediately. ${longAct} takes much more time. So the ${askLonger ? 'longer' : 'shorter'} activity is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "qualitative_longer_shorter", hideVisual: true }
    };
  },

  foundation_faster_slower_time: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const askShorter = Math.random() > 0.5;
    const names = getRandomNames(2);
    
    let questionText = getQText(
      `${names[0]} runs to the park. ${names[1]} walks to the park. Who takes a ${askShorter ? 'shorter' : 'longer'} time to reach the park?`,
      `${names[0]} runs. ${names[1]} walks. Who takes a ${askShorter ? 'shorter' : 'longer'} time?`
    );

    // Runner takes shorter time, Walker takes longer time
    const answer = askShorter ? names[0] : names[1];
    const distractor = askShorter ? names[1] : names[0];
    
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
          "hint": ${JSON.stringify(getQText(`If you move faster, you need less time!`, `Faster = Shorter time.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Running is faster than walking. The faster you move, the shorter the time it takes. So ${answer} takes a ${askShorter ? 'shorter' : 'longer'} time.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "faster_slower_time", hideVisual: true }
    };
  },

  foundation_hour_vs_half_hour: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const askLonger = Math.random() > 0.5;
    
    let questionText = getQText(
      `Which is a ${askLonger ? 'longer' : 'shorter'} amount of time: 1 hour or half an hour?`,
      `1 hour vs half an hour: Which is ${askLonger ? 'longer' : 'shorter'}?`
    );

    const answer = askLonger ? "1 hour" : "half an hour";
    const distractor = askLonger ? "half an hour" : "1 hour";
    
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
          "hint": ${JSON.stringify(getQText(`A whole is always bigger than a half!`, `1 whole vs 1 half.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`1 whole hour is made up of two half-hours. So ${answer} is ${askLonger ? 'longer' : 'shorter'}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "hour_vs_half_hour", hideVisual: true }
    };
  },

  foundation_basic_elapsed_hours: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const startHour = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    const duration = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    const endHour = startHour + duration;
    const names = getRandomNames(1);
    
    let questionText = getQText(
      `A cartoon starts at ${startHour}:00 and ends at ${endHour}:00. How many hours did the cartoon last?`,
      `${startHour}:00 to ${endHour}:00 = ? hours`
    );

    const answer = `${duration}`;
    const distractor1 = `${duration + 1}`;
    const distractor2 = `${Math.abs(duration - 1) || duration + 2}`;
    const distractor3 = `${endHour}`;
    
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
          "hint": ${JSON.stringify(getQText(`Count the numbers from ${startHour} to ${endHour}.`, `Subtract the hours.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Counting from ${startHour} to ${endHour}, it is ${duration} hours.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "basic_elapsed_hours", hideVisual: true }
    };
  },

  foundation_duration_number_compare: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const askLonger = Math.random() > 0.5;
    
    const act1 = "Reading";
    const act2 = "Playing";
    const dur1 = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const dur2 = dur1 - 1; // 1 or 2
    
    // Randomize which is which
    const swap = Math.random() > 0.5;
    const finalAct1 = swap ? act2 : act1;
    const finalDur1 = swap ? dur2 : dur1;
    const finalAct2 = swap ? act1 : act2;
    const finalDur2 = swap ? dur1 : dur2;
    
    let questionText = getQText(
      `${finalAct1} takes ${finalDur1} hours. ${finalAct2} takes ${finalDur2} hours. Which activity takes a ${askLonger ? 'longer' : 'shorter'} time?`,
      `${finalAct1} (${finalDur1} hr) vs ${finalAct2} (${finalDur2} hr): Which is ${askLonger ? 'longer' : 'shorter'}?`
    );

    // the one with more hours is longer
    const answer = askLonger ? (finalDur1 > finalDur2 ? finalAct1 : finalAct2) : (finalDur1 < finalDur2 ? finalAct1 : finalAct2);
    const distractor = askLonger ? (finalDur1 > finalDur2 ? finalAct2 : finalAct1) : (finalDur1 < finalDur2 ? finalAct2 : finalAct1);
    
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
          "hint": ${JSON.stringify(getQText(`Compare the numbers! Is ${finalDur1} bigger or smaller than ${finalDur2}?`, `Compare hours.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Since ${Math.max(finalDur1, finalDur2)} hours is more than ${Math.min(finalDur1, finalDur2)} hours, the ${askLonger ? 'longer' : 'shorter'} activity is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "duration_number_compare", hideVisual: true }
    };
  }
};

export const foundationLogic = {
  generate: function() {
    const activeVariant = arguments[0];
    if (foundationVariants[activeVariant]) {
      return foundationVariants[activeVariant].apply(null, Array.prototype.slice.call(arguments, 1));
    }
  }
};
