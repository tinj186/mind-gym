import { getRandomNames } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

// Shared strict instruction to prevent hallucination
const getStrictInstruction = (type, isShort) => {
  return `STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT modify ANY field in the JSON template except where instructed. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and 'questionText' MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;
};

export const foundationVariants = {
  foundation_day_night: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isNightScenario = Math.random() > 0.5;
    const names = getRandomNames(2);
    
    const templates = isNightScenario ? [
      "Which of these activities do you usually do at night when it is dark outside?",
      `It is nighttime. What activity is ${names[0]} most likely doing?`,
      "When the moon and stars are out, which of these is the best activity?"
    ] : [
      "Which of these activities do you usually do in the morning when the sun comes up?",
      `It is morning. What activity is ${names[1]} most likely doing?`,
      "Right after waking up, which of these is the best activity?"
    ];
    
    let questionText = getQText(
      templates[Math.floor(Math.random() * templates.length)],
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

  foundation_am_pm_definition: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isAm = Math.random() > 0.5;
    
    const templates = isAm ? [
      "The letters 'a.m.' are used for times in the ___.",
      "When we say a time is 'a.m.', it means it is ___ noon.",
      "What part of the day does 'a.m.' usually stand for?"
    ] : [
      "The letters 'p.m.' are used for times in the ___.",
      "When we say a time is 'p.m.', it means it is ___ noon.",
      "What part of the day does 'p.m.' usually stand for?"
    ];

    let questionText = getQText(
      templates[Math.floor(Math.random() * templates.length)],
      isAm ? "'a.m.' stands for = ?" : "'p.m.' stands for = ?"
    );

    const answer = isAm ? "morning" : "afternoon";
    const distractors = isAm ? ["afternoon"] : ["morning"];

    let options = getShuffledOptions(answer, distractors);
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
          "hint": ${JSON.stringify(getQText(`Think about when a.m. and p.m. are used. a.m. is before lunch!`, `a.m. is morning, p.m. is afternoon.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(isAm ? "The letters 'a.m.' stand for times in the morning (before 12 noon)." : "The letters 'p.m.' stand for times in the afternoon (after 12 noon).", `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "am_pm_definition", hideVisual: true }
    };
  },

  foundation_am_pm_activities: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isAm = Math.random() > 0.5;
    const names = getRandomNames(2);

    const amActivities = [
      "eats breakfast", "goes to school", "wakes up", "has morning assembly"
    ];
    const pmActivities = [
      "eats dinner", "goes to sleep", "watches the sunset", "does evening homework"
    ];

    const chosenActivity = isAm 
      ? amActivities[Math.floor(Math.random() * amActivities.length)]
      : pmActivities[Math.floor(Math.random() * pmActivities.length)];

    const templates = [
      `${names[0]} ${chosenActivity}. Does this happen in the a.m. or p.m.?`,
      `If ${names[1]} ${chosenActivity}, which abbreviation should we use for the time?`,
      `We use ___ for the time when someone ${chosenActivity}.`
    ];

    let questionText = getQText(
      templates[Math.floor(Math.random() * templates.length)],
      `${chosenActivity} = a.m. or p.m.?`
    );

    const answer = isAm ? "a.m." : "p.m.";
    const distractors = isAm ? ["p.m."] : ["a.m."];

    let options = getShuffledOptions(answer, distractors);
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
          "hint": ${JSON.stringify(getQText(`Think about whether this activity happens in the morning or later in the day.`, `Morning is a.m., otherwise p.m.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(isAm ? "Activities like this happen in the morning. We use a.m. for morning times." : "Activities like this happen in the evening or night. We use p.m. for these times.", `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "am_pm_activities", hideVisual: true }
    };
  },

  foundation_time_of_day_sequence: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const questions = [
      { q: "What part of the day comes right after Morning?", a: "Afternoon", d: ["Evening", "Night", "Midnight"] },
      { q: "What part of the day comes right after Afternoon?", a: "Evening", d: ["Morning", "Night", "Sunrise"] },
      { q: "What part of the day comes right after Evening?", a: "Night", d: ["Morning", "Afternoon", "Lunchtime"] },
      { q: "What part of the day comes right before Afternoon?", a: "Morning", d: ["Evening", "Night", "Dinner"] }
    ];

    const chosen = questions[Math.floor(Math.random() * questions.length)];

    let questionText = getQText(
      chosen.q,
      chosen.q
    );

    let options = getShuffledOptions(chosen.a, chosen.d);
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    
    if (type === 'MCQ' || type !== 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== chosen.a) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
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
          "hint": ${JSON.stringify(getQText(`The order of the day is: Morning -> Afternoon -> Evening -> Night.`, `Sequence: Morning, Afternoon, Evening, Night.`))},
          "finalAnswer": "${chosen.a}",
          "solutionSteps": ${JSON.stringify(getQText(`The correct order of the day is Morning, Afternoon, Evening, and then Night. So the answer is ${chosen.a}.`, `Answer is ${chosen.a}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "time_of_day_sequence", hideVisual: true }
    };
  },

  foundation_clock_am_pm: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isAm = Math.random() > 0.5;
    const names = getRandomNames(2);
    
    const hour = Math.floor(Math.random() * 11) + 1; // 1 to 11

    const amSettings = ["in the morning"];
    const pmSettings = hour >= 7 ? ["at night", "in the evening"] : ["in the afternoon"];

    const chosenSetting = isAm 
      ? amSettings[Math.floor(Math.random() * amSettings.length)]
      : pmSettings[Math.floor(Math.random() * pmSettings.length)];

    const templates = [
      `${names[0]} sees the clock reads ${hour} o'clock ${chosenSetting}. How do we write this time?`,
      `If an event happens at ${hour} o'clock ${chosenSetting}, which abbreviation do we use?`,
      `How do we write ${hour} o'clock ${chosenSetting} using a.m. or p.m.?`
    ];

    let questionText = getQText(
      templates[Math.floor(Math.random() * templates.length)],
      `${hour} o'clock ${chosenSetting} = ?`
    );

    const answer = isAm ? `${hour} a.m.` : `${hour} p.m.`;
    const distractor = isAm ? `${hour} p.m.` : `${hour} a.m.`;

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
          "hint": ${JSON.stringify(getQText(`Remember that 'in the morning' is a.m. and 'in the afternoon/evening/night' is p.m.`, `Match description to a.m./p.m.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Since the time is ${chosenSetting}, we use ${isAm ? 'a.m.' : 'p.m.'} The correct way to write it is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "clock_am_pm", hideVisual: true }
    };
  },

  foundation_sequence_simple: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const scenario = Math.random() > 0.5;
    const names = getRandomNames(2);
    
    let questionText = getQText(scenario
      ? "Choose the correct order of events from morning to night."
      : `${names} is planning the day. What does ${names} do first when waking up in the morning?`,
      scenario ? "Correct chronological order = ?" : "First morning activity = ?"
    );
      
    const answer = scenario 
      ? "Wake up, Eat lunch, Sleep in bed" 
      : "Brush teeth";
      
    const distractors = scenario
      ? ["Sleep in bed, Eat lunch, Wake up", "Eat lunch, Sleep in bed, Wake up"]
      : ["Pack school bag to go home", "Have dinner with family"];
      
    let options = getShuffledOptions(answer, distractors);
    
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
      ${getStrictInstruction(type, isShort)}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionText)},
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

export const foundationLogic = {
  generate: function() {
    const activeVariant = arguments[0];
    if (foundationVariants[activeVariant]) {
      return foundationVariants[activeVariant].apply(null, Array.prototype.slice.call(arguments, 1));
    }
  }
};
