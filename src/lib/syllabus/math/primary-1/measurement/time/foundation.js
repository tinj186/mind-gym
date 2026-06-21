import { getRandomContext } from '@/lib/utils/localization';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const foundationVariants = {
  foundation_to_hour: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const randomHour = Math.floor(Math.random() * 12) + 1; 
    const answer = `${randomHour} o'clock`;
    const componentData = { hour: randomHour, minute: 0, displayType: 'analog' };
    
    const questionTextTemplate = getQText(`Look at the clock. What time is it?`, `Time on analog clock = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let options = [`${randomHour === 12 ? 1 : randomHour + 1} o'clock`, `${randomHour === 1 ? 12 : randomHour - 1} o'clock`, "6 o'clock"];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Look closely at the shorter hand! Which number is it pointing directly to?`, `Look at short hand.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The long hand (minute hand) points straight up at 12, and the short hand (hour hand) points right at ${randomHour}. That means it is exactly ${randomHour} o'clock.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "CLOCK_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "to_hour", hideVisual: false }
    };
  },

  foundation_digital_hour: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const randomHour = Math.floor(Math.random() * 12) + 1;
    const answer = `${randomHour} o'clock`;
    const componentData = { hour: randomHour, minute: 0, displayType: 'digital' };

    const questionTextTemplate = getQText(`What time is shown on the digital clock?`, `Time on digital clock = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let options = [`${randomHour === 12 ? 1 : randomHour + 1} o'clock`, "half past 12", "3 o'clock"];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`The first number in a digital clock readout tells us the hour!`, `Read the first number.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The digital clock displays ${randomHour}:00. The double zeros mean zero minutes have passed, so it is exactly ${randomHour} o'clock.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "CLOCK_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "digital_hour", hideVisual: false }
    };
  },

  foundation_clock_parts: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const subVariant = Math.floor(Math.random() * 3);
    let answer, allOptions, questionText, hint, solutionSteps;

    if (subVariant === 0) {
      const askAboutHourHand = Math.random() > 0.5;
      answer = askAboutHourHand ? "Hour hand" : "Minute hand";
      allOptions = ["Hour hand", "Minute hand", "Second hand", "Number hand"];
      questionText = getQText(`On an analog clock face, what do we call the ${askAboutHourHand ? 'short' : 'long'} hand?`, `${askAboutHourHand ? 'Short' : 'Long'} hand is called = ?`);
      hint = getQText(`The hand that points to the main hour numbers is always shorter!`, `Think about hand length.`);
      solutionSteps = getQText(`The short hand on a clock is the hour hand, and the long hand is the minute hand. So the correct answer is the ${answer}.`, `Answer is ${answer}.`);
    } else if (subVariant === 1) {
      const randomHour = Math.floor(Math.random() * 12) + 1;
      const askByLength = Math.random() > 0.5;
      const handName = askByLength ? "short hand" : "hour hand";
      answer = String(randomHour);
      let distractors = ["12", "6", String(randomHour === 12 ? 1 : randomHour + 1)];
      if (randomHour === 12) distractors = ["9", "6", "1"];
      allOptions = getShuffledOptions(answer, distractors);
      questionText = getQText(`The time is exactly ${randomHour} o'clock. Which number does the ${handName} point directly to?`, `At ${randomHour} o'clock, ${handName} points to = ?`);
      hint = getQText(`Remember, the hour hand tells us which hour it is!`, `Check the hour.`);
      solutionSteps = getQText(`At exactly ${randomHour} o'clock, the hour hand (the short hand) points exactly at the number ${randomHour}.`, `Answer is ${answer}.`);
    } else {
      const randomHour = Math.floor(Math.random() * 12) + 1;
      const askByLength = Math.random() > 0.5;
      const handName = askByLength ? "long hand" : "minute hand";
      answer = "12";
      let distractors = [String(randomHour), "6", "3"];
      if (randomHour === 12 || randomHour === 6) distractors = ["9", "3", "1"];
      allOptions = getShuffledOptions(answer, distractors);
      questionText = getQText(`The time is exactly ${randomHour} o'clock. Which number does the ${handName} point directly to?`, `At ${randomHour} o'clock, ${handName} points to = ?`);
      hint = getQText(`At any exact hour (like 1 o'clock or 4 o'clock), the long hand always points to the very top number!`, `Check the top number.`);
      solutionSteps = getQText(`At any exact 'o'clock', zero minutes have passed. This means the minute hand (the long hand) points straight up to the number 12.`, `Answer is ${answer}.`);
    }

    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;
    
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      allOptions = allOptions.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(allOptions);
      let defectMapObj = {};
      allOptions.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionText : "[STORY] " + questionText)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(hint)},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(solutionSteps)}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "clock_parts", hideVisual: true }
    };
  },

  foundation_day_night: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isNightScenario = Math.random() > 0.5;
    
    let questionText = getQText(isNightScenario 
      ? "Which of these activities do you usually do at night when it is dark outside?"
      : "Which of these activities do you usually do in the morning when the sun comes up?",
      isNightScenario ? "Night activity = ?" : "Morning activity = ?"
    );

    const morningActivities = [
      "Eating breakfast before school",
      "Watching the morning sunrise",
      "Going to school",
      "Waking up from bed",
      "Brushing teeth in the morning",
      "Playing at the school field"
    ].sort(() => Math.random() - 0.5);

    const nightActivities = [
      "Going to sleep in bed",
      "Looking at stars in the sky",
      "Having dinner with family",
      "Sleeping in pajamas",
      "Reading a bedtime story",
      "Watching the moon"
    ].sort(() => Math.random() - 0.5);

    const answer = isNightScenario ? nightActivities[0] : morningActivities[0];
    const distractors = isNightScenario 
      ? morningActivities.slice(0, 3)
      : nightActivities.slice(0, 3);

    let options = getShuffledOptions(answer, distractors);

    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    } else {
      questionText += ` (Choose from: ${options.join(' / ')})`;
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionText : "[STORY] " + questionText)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(isNightScenario ? "Think about what you do when the moon and stars are out!" : "Think about what you do right after you wake up to get ready for school!", `Consider time of day.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(isNightScenario ? "We sleep in bed at night when it is dark outside. Playing on the field and eating breakfast are daytime routines." : "We eat breakfast in the morning to prepare for our day ahead. Sleeping and seeing stars happen at night.", `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "day_night", hideVisual: true }
    };
  },

  foundation_sequence_simple: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const scenario = Math.random() > 0.5;
    
    let questionText = getQText(scenario
      ? "Choose the correct order of events from morning to night."
      : "Siti is planning her day. What does she do first when she wakes up in the morning?",
      scenario ? "Correct chronological order = ?" : "First morning activity = ?"
    );
      
    const answer = scenario 
      ? "Wake up, Eat lunch, Sleep in bed" 
      : "Brush her teeth";
      
    const distractors = scenario
      ? ["Sleep in bed, Eat lunch, Wake up", "Eat lunch, Sleep in bed, Wake up"]
      : ["Pack her school bag to go home", "Have dinner with her family"];
      
    let options = getShuffledOptions(answer, distractors);
    
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    } else {
      if (scenario) {
        questionText = "Arrange these events in the correct order from morning to night: Sleep in bed, Eat lunch, Wake up.";
      } else {
        questionText += ` (Choose from: ${options.join(' / ')})`;
      }
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionText : "[STORY] " + questionText)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Think about what happens at the very start of your day versus the very end!`, `Consider daily order.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(scenario ? "Your day always starts with waking up in the morning, followed by having lunch in the afternoon, and ends with sleeping at night." : "Waking up is the absolute start of the day, so brushing teeth happens first before afternoon dismissal or evening routines.", `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "sequence_simple", hideVisual: true }
    };
  }
};

export const foundationLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (foundationVariants[activeVariant]) {
    return foundationVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};