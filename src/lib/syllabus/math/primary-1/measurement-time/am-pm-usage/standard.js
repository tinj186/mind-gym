import { getRandomNames } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

const getStrictInstruction = (type, isShort) => {
  return `STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT modify ANY field in the JSON template except where instructed. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and 'questionText' MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;
};

export const standardVariants = {
  standard_timeline_sequence: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const eventSets = [
      [
        { text: "Wake up (7:00 a.m.)", order: 1 },
        { text: "Breakfast (7:30 a.m.)", order: 2 },
        { text: "Recess (10:00 a.m.)", order: 3 },
        { text: "Lunch (12:30 p.m.)", order: 4 }
      ],
      [
        { text: "Reach school (7:30 a.m.)", order: 1 },
        { text: "Assembly (8:00 a.m.)", order: 2 },
        { text: "PE Class (11:00 a.m.)", order: 3 },
        { text: "Go Home (1:30 p.m.)", order: 4 }
      ],
      [
        { text: "Math Class (8:00 a.m.)", order: 1 },
        { text: "Art Class (9:30 a.m.)", order: 2 },
        { text: "Recess (10:30 a.m.)", order: 3 },
        { text: "Lunch (12:30 p.m.)", order: 4 }
      ],
      [
        { text: "Leave House (7:00 a.m.)", order: 1 },
        { text: "Music Class (9:30 a.m.)", order: 2 },
        { text: "Lunch (12:00 p.m.)", order: 3 },
        { text: "CCA (2:30 p.m.)", order: 4 }
      ]
    ];
    const events = eventSets[Math.floor(Math.random() * eventSets.length)];
    
    const shuffled = events.sort(() => Math.random() - 0.5);
    const labeledEvents = shuffled.map((e, i) => ({ ...e, letter: String.fromCharCode(65 + i) })); // A, B, C, D
    const correctOrder = labeledEvents.slice().sort((a, b) => a.order - b.order).map(e => e.letter).join(", ");
    
    let questionText = `Arrange these school day events in the correct order from earliest to latest:\\n`;
    labeledEvents.forEach(e => {
      questionText += `\\n${e.letter}. ${e.text}`;
    });
    
    if (!isMCQ) questionText += `\\n\\n(Write your answer as letters, e.g., A, B, C, D)`;

    const answer = correctOrder;
    const distractors = [
      labeledEvents.slice().sort(() => Math.random() - 0.5).map(e => e.letter).join(", "),
      labeledEvents.slice().sort(() => Math.random() - 0.5).map(e => e.letter).join(", "),
      labeledEvents.slice().sort(() => Math.random() - 0.5).map(e => e.letter).join(", ")
    ];

    let questionTextTemplate = getQText(questionText, questionText);

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
      ${getStrictInstruction(type, isShort)}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Read the times on each event. The smallest hour number comes first, and a.m. is before p.m.!`, `Sort by time.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`We follow the clock from morning to afternoon. The correct order of letters is ${answer}.`, `Answer is ${answer}.`))}
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

  standard_am_pm_logic: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isAmStart = Math.random() > 0.5;
    const names = getRandomNames(1);
    
    // We stay in the same block for this variant (e.g., morning -> morning, or afternoon -> afternoon).
    // The noon boundary variant covers crossing the boundary.
    const startHour = isAmStart ? 8 : 2; // 8 am or 2 pm
    const duration = 2;
    const endHour = startHour + duration;
    
    let questionText = getQText(
      `${names} starts an activity at ${startHour}:00 ${isAmStart ? 'a.m.' : 'p.m.'} and finishes it ${duration} hours later. Does the activity finish in the a.m. or p.m.?`,
      `${startHour}:00 ${isAmStart ? 'a.m.' : 'p.m.'} + ${duration} hrs = a.m. or p.m.?`
    );

    const answer = isAmStart ? "a.m." : "p.m.";
    const distractor = isAmStart ? "p.m." : "a.m.";
    
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
          "hint": ${JSON.stringify(getQText(`Add the hours. Does it cross 12 o'clock? If not, it stays in the same part of the day!`, `Does it pass 12?`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${startHour} + ${duration} = ${endHour}. Since ${endHour} is before 12 o'clock, the time is still in the ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "am_pm_logic", hideVisual: true }
    };
  },

  standard_am_pm_sorting: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const findPm = Math.random() > 0.5;
    
    const amActs = ["Eating breakfast", "Waking up", "Morning assembly", "Watching the sunrise"];
    const pmActs = ["Eating dinner", "Going to sleep at night", "Watching the sunset", "Doing evening homework"];
    
    const shuffledAm = amActs.sort(() => Math.random() - 0.5);
    const shuffledPm = pmActs.sort(() => Math.random() - 0.5);
    
    const answer = findPm ? shuffledPm[0] : shuffledAm[0];
    const distractors = findPm ? shuffledAm.slice(0, 3) : shuffledPm.slice(0, 3);
    
    let questionText = getQText(
      `Which of these activities usually happens in the ${findPm ? 'p.m.' : 'a.m.'}?`,
      `${findPm ? 'p.m.' : 'a.m.'} activity = ?`
    );
    
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
          "hint": ${JSON.stringify(getQText(`Remember that a.m. means morning and p.m. means afternoon or night.`, `Match a.m./p.m.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The only activity that happens in the ${findPm ? 'afternoon or night (p.m.)' : 'morning (a.m.)'} is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "am_pm_sorting", hideVisual: true }
    };
  },

  standard_noon_boundary: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    // 11 a.m. + 2 hours = 1 p.m. OR 10 a.m. + 3 hours = 1 p.m.
    const startHour = Math.floor(Math.random() * 2) + 10; // 10 or 11
    const duration = startHour === 10 ? 3 : (Math.random() > 0.5 ? 2 : 3); // ensures it crosses 12
    const endHour = (startHour + duration) > 12 ? (startHour + duration) - 12 : 12; // 12 or 1 or 2
    
    let questionText = getQText(
      `It is ${startHour}:00 a.m. What time will it be ${duration} hours later?`,
      `${startHour}:00 a.m. + ${duration} hrs = ?`
    );
    
    const answer = `${endHour}:00 p.m.`;
    const distractor1 = `${endHour}:00 a.m.`;
    const distractor2 = `${startHour + duration}:00 a.m.`;
    const distractor3 = `${startHour + duration}:00 p.m.`;
    
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
          "hint": ${JSON.stringify(getQText(`Count forward from ${startHour}. After 12:00 noon, the time becomes p.m. and starts from 1 again!`, `Crosses 12 noon.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Counting ${duration} hours from ${startHour} a.m.: it goes past 12:00 noon, so it changes to p.m. The time is ${endHour}:00 p.m.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "noon_boundary", hideVisual: true }
    };
  },

  standard_clock_context_match: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isAm = Math.random() > 0.5;
    const names = getRandomNames(1);
    const hour = isAm ? 7 : 8; 
    const activity = isAm ? "eats breakfast" : "goes to sleep";
    const componentData = { hour, minute: 0, displayType: 'analog' };

    let questionText = getQText(
      `${names} ${activity} at the time shown on the clock. How do we write this time using a.m. or p.m.?`,
      `${activity} at ${hour}:00 = ?`
    );

    const answer = isAm ? `${hour}:00 a.m.` : `${hour}:00 p.m.`;
    const distractor = isAm ? `${hour}:00 p.m.` : `${hour}:00 a.m.`;
    
    let options = getShuffledOptions(answer, [distractor, "12:00 p.m.", "6:00 a.m."]);
    
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
          "hint": ${JSON.stringify(getQText(`Read the clock to find the hour. Then think if ${activity} happens in the morning (a.m.) or night (p.m.).`, `Read clock, add a.m./p.m.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The clock shows ${hour} o'clock. Since ${activity} happens in the ${isAm ? 'morning' : 'night'}, we use ${isAm ? 'a.m.' : 'p.m.'} The time is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "CLOCK_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "clock_context_match", hideVisual: false }
    };
  }
};

export const standardLogic = {
  generate: function() {
    const activeVariant = arguments[0];
    if (standardVariants[activeVariant]) {
      return standardVariants[activeVariant].apply(null, Array.prototype.slice.call(arguments, 1));
    }
  }
};
