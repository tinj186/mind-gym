import { getRandomContext } from '@/lib/utils/localization';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const standardVariants = {
  standard_to_half_hour: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const answer = `half past ${hour}`;
    const componentData = { hour, minute: 30, displayType: 'analog' };

    const questionTextTemplate = getQText(`What time is shown on the clock?`, `Time on analog clock = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let options = [answer, `half past ${hour === 12 ? 1 : hour + 1}`, `${hour} o'clock`, `half past ${hour === 1 ? 12 : hour - 1}`];
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
          "hint": ${JSON.stringify(getQText(`If the long hand is at 6, it means 'half past' the hour!`, `Check the long hand.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The long hand (minute hand) is at 6. The short hand (hour hand) is past ${hour}. This means it is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "CLOCK_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "to_half_hour", hideVisual: false }
    };
  },

  standard_analog_digital: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const answer = `${hour}:30`;
    const componentData = { hour, minute: 30, displayType: 'analog' };

    const questionTextTemplate = getQText(isMCQ ? `Which digital clock shows the same time as the clock face?` : `What is the digital time shown on the clock face?`, `Digital time = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let options = [answer, `${hour === 12 ? 1 : hour + 1}:30`, `${hour}:00`, `${hour === 1 ? 12 : hour - 1}:30`];
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
          "hint": ${JSON.stringify(getQText(`Check the hour hand first, then see if the long hand is at 12 or 6!`, `Match the hands.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The analog clock shows the long hand at 6 and the short hand past ${hour}. This is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "CLOCK_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "analog_digital", hideVisual: false }
    };
  },

  standard_digital_half_hour: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const answer = `half past ${hour}`;
    const componentData = { hour, minute: 30, displayType: 'digital' };

    const questionTextTemplate = getQText(`Look at the digital clock. What is another way to say this time?`, `Time in words = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let options = [answer, `${hour} o'clock`, `half past ${hour === 12 ? 1 : hour + 1}`, `half past ${hour === 1 ? 12 : hour - 1}`];
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
          "hint": ${JSON.stringify(getQText(`When we see :30 on a clock, we say 'half past' the hour.`, `Check the minutes.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The clock shows ${hour}:30. The ':30' part means half of the hour has passed, so it is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "CLOCK_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "digital_half_hour", hideVisual: false }
    };
  },

  standard_half_past_concept: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const answer = `${hour}:30`;
    const phrase = `half past ${hour}`;

    const questionTextTemplate = getQText(isMCQ ? `Which of these is the same as ${phrase}?` : `What is the digital time for ${phrase}?`, `Digital time for ${phrase} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let options = [answer, `${hour}:00`, `${hour === 12 ? 1 : hour + 1}:30`, `${hour}:06`];
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
          "hint": ${JSON.stringify(getQText(`Half of an hour is 30 minutes!`, `30 minutes passed.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The term 'half past' means 30 minutes have passed after the hour. So, ${phrase} is written as ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "half_past_concept", hideVisual: true }
    };
  },

  standard_hour_hand_placement: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const hour = Math.floor(Math.random() * 11) + 1;
    const nextHour = hour + 1;
    const answer = `Between ${hour} and ${nextHour}`;

    const questionTextTemplate = getQText(`Where should the short hour hand point at half past ${hour}?`, `Where does the hour hand point at half past ${hour}?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let options = [answer, `Exactly at ${hour}`, `Exactly at ${nextHour}`, `Between ${nextHour} and ${nextHour + 1}`];
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
          "hint": ${JSON.stringify(getQText(`The hour hand moves slowly as time goes by. At half past, it's right in the middle of two numbers!`, `Check the middle position.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`At half past ${hour}, the hour hand has moved halfway from ${hour} towards ${nextHour}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "hour_hand_placement", hideVisual: true }
    };
  },

  standard_duration_simple: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const start = Math.floor(Math.random() * 4) + 7; 
    const duration = Math.floor(Math.random() * 2) + 1; 
    const end = start + duration;
    const answer = `${duration} ${duration === 1 ? 'hour' : 'hours'}`;

    const questionTextTemplate = getQText(`Math class starts at ${start} o'clock and ends at ${end} o'clock. How long is the class?`, `Duration from ${start} to ${end} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let options = [answer, "3 hours", "half an hour", "5 hours"];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CARELESS_CALCULATION"; });
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
          "hint": ${JSON.stringify(getQText(`Count how many big jumps the hour hand makes from the start time to the end time.`, `Subtract start from end.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`We count the hours from ${start} to ${end}. ${end} minus ${start} is ${duration}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "duration_simple", hideVisual: true }
    };
  },

  standard_digital_to_analog: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const digital = `${hour}:30`;
    const answer = `half past ${hour}`;

    const questionTextTemplate = getQText(`If a digital clock shows ${digital}, what time is it in words?`, `Time in words for ${digital} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let options = [answer, `${hour} o'clock`, `half past ${hour === 1 ? 12 : hour - 1}`, "6 o'clock"];
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
          "hint": ${JSON.stringify(getQText(`Digital clocks show the hour first, then the minutes.`, `Check the minutes.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The digits ${hour} show the hour, and :30 means half an hour has passed. That is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "digital_to_analog", hideVisual: true }
    };
  },

  standard_timeline_sequence: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const eventSets = [
      [
        { text: "Wake up (7:00)", order: 1 },
        { text: "Breakfast (7:30)", order: 2 },
        { text: "Recess (10:00)", order: 3 },
        { text: "Lunch (12:30)", order: 4 }
      ],
      [
        { text: "Reach school (7:30)", order: 1 },
        { text: "Assembly (8:00)", order: 2 },
        { text: "PE Class (11:00)", order: 3 },
        { text: "Go Home (1:30)", order: 4 }
      ],
      [
        { text: "Math Class (8:00)", order: 1 },
        { text: "Art Class (9:30)", order: 2 },
        { text: "Recess (10:30)", order: 3 },
        { text: "Lunch (12:30)", order: 4 }
      ],
      [
        { text: "Leave House (7:00)", order: 1 },
        { text: "Music Class (9:30)", order: 2 },
        { text: "Lunch (12:00)", order: 3 },
        { text: "CCA (2:30)", order: 4 }
      ]
    ];
    const events = eventSets[Math.floor(Math.random() * eventSets.length)];
    
    const shuffled = events.sort(() => Math.random() - 0.5);
    const labeledEvents = shuffled.map((e, i) => ({ ...e, letter: String.fromCharCode(65 + i) })); // A, B, C, D
    const correctOrder = labeledEvents.slice().sort((a, b) => a.order - b.order).map(e => e.letter).join(", ");
    
    let questionText = `Arrange these school day events in the correct order from earliest to latest:\n`;
    labeledEvents.forEach(e => {
      questionText += `\n${e.letter}. ${e.text}`;
    });
    
    if (!isMCQ) questionText += `\n\n(Write your answer as letters, e.g., A, B, C, D)`;

    const answer = correctOrder;
    const distractors = [
      labeledEvents.slice().sort(() => Math.random() - 0.5).map(e => e.letter).join(", "),
      labeledEvents.slice().sort(() => Math.random() - 0.5).map(e => e.letter).join(", "),
      labeledEvents.slice().sort(() => Math.random() - 0.5).map(e => e.letter).join(", ")
    ];

    const questionTextTemplate = getQText(questionText, questionText);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let options = getShuffledOptions(answer, distractors);

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
          "hint": ${JSON.stringify(getQText(`Read the times on each event. The smallest hour number comes first!`, `Sort by time.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`We follow the clock from morning to afternoon. 7:00 comes before 7:30, which comes before 10:00, and lunch is last at 12:30. The correct order of letters is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "timeline_sequence", hideVisual: true }
    };
  },

  standard_activity_duration_compare: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const names = ["Meiling", "John", "Siti", "Ahmad", "Ali", "Wei Ming"].sort(() => Math.random() - 0.5);
    const nameA = names[0];
    const nameB = names[1];
    const durA = Math.floor(Math.random() * 2) + 1; 
    const durB = durA + 1; 
    const answer = nameB;

    const questionTextTemplate = getQText(`${nameA} reads for ${durA} hour. ${nameB} draws for ${durB} hours. Who spent more time on their activity?`, `Who spent more time = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let options = [nameA, nameB, "They spent the same time", "Cannot tell"];
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
          "hint": ${JSON.stringify(getQText(`Compare the number of hours. Which number is bigger?`, `Check the hours.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${durB} hours is a longer time than ${durA} hour. Therefore, ${nameB} spent more time.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "activity_duration_compare", hideVisual: true }
    };
  },

  standard_half_hour_later_earlier: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const hour = Math.floor(Math.random() * 10) + 1;
    const isLater = Math.random() > 0.5;
    const answer = isLater ? `half past ${hour}` : `half past ${hour === 1 ? 12 : hour - 1}`;
    const componentData = { hour, minute: 0, displayType: 'analog' };

    const questionTextTemplate = getQText(`The clock shows ${hour} o'clock. What time will it be half an hour ${isLater ? 'later' : 'earlier'}?`, `Time half an hour ${isLater ? 'later' : 'earlier'} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. ${getRandomContext().name}.`;

    let options = [answer, `${hour} o'clock`, `half past ${hour === 12 ? 1 : hour + 1}`, `${hour}:00`];
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
          "hint": ${JSON.stringify(getQText(`Half an hour is the time it takes for the long hand to move from 12 to 6.`, `Move the hand.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Moving the minute hand half an hour ${isLater ? 'forward' : 'backward'} from the 12 brings it to the 6, which is 'half past'.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "CLOCK_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "half_hour_later_earlier", hideVisual: false }
    };
  }
};

export const standardLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (standardVariants[activeVariant]) {
    return standardVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};