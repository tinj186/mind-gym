import { getRandomContext } from '@/lib/utils/localization';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const foundationVariants = {
  foundation_to_hour: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const randomHour = Math.floor(Math.random() * 12) + 1; 
    const answer = `${randomHour} o'clock`;
    const componentData = { hour: randomHour, minute: 0, displayType: 'analog' };
    
    const questionTextTemplate = getQText(`Look at the clock. What time is it?`, `Time on analog clock = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)} that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

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
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)} that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

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

    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)} that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;
    
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

  foundation_day_night_activities: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isDay = Math.random() > 0.5;
    
    let activity, answer, distractors;
    if (isDay) {
      activity = ["eating breakfast", "going to school", "playing in the sun"][Math.floor(Math.random() * 3)];
      answer = "Day";
      distractors = ["Night"];
    } else {
      activity = ["sleeping in bed", "looking at the stars", "eating supper before bed"][Math.floor(Math.random() * 3)];
      answer = "Night";
      distractors = ["Day"];
    }

    let questionTextTemplate = getQText(`Do you usually do this activity during the day or the night: ${activity}?`, `${activity} = Day or Night?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)} that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [answer, ...distractors];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    } else {
      questionTextTemplate += ` (Choose from: Day, Night)`;
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
          "hint": ${JSON.stringify(getQText(isDay ? `Does the sun shine when you do this?` : `Is it dark outside when you do this?`, isDay ? `Sun is out?` : `Is it dark?`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`We usually do this activity during the ${answer.toLowerCase()}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "day_night_activities", hideVisual: true }
    };
  },

  foundation_time_word_match: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const numberWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
    const randomHour = Math.floor(Math.random() * 12) + 1;
    const wordForm = numberWords[randomHour - 1];
    const answer = `${randomHour} o'clock`;
    
    let questionTextTemplate = getQText(`Match the time: ${wordForm} o'clock`, `${wordForm} o'clock = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)} that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let distractors = [
      `${randomHour === 12 ? 1 : randomHour + 1} o'clock`,
      `${randomHour === 1 ? 12 : randomHour - 1} o'clock`,
      `${randomHour > 6 ? randomHour - 2 : randomHour + 2} o'clock`
    ];
    let options = [answer, ...distractors];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CARELESS_MISTAKE"; });
      defectMapStr = JSON.stringify(defectMapObj);
    } else {
      questionTextTemplate += ` (Write the time as a number, e.g., 5 o'clock)`;
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
          "hint": ${JSON.stringify(getQText(`What number is ${wordForm}?`, `Read the number word.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The word ${wordForm} is the number ${randomHour}. So, it is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "time_word_match", hideVisual: true }
    };
  }
};

export const foundationLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (foundationVariants[activeVariant]) {
    return foundationVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};