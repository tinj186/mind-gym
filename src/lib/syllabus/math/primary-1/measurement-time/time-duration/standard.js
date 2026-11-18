import { getRandomContext } from '../../../../../utils/localization.js';
import { getRandomNames } from '../../../../../utils/variable-bank.js';
const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const standardVariants = {

  standard_duration_simple: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const start = Math.floor(Math.random() * 4) + 7; 
    const duration = Math.floor(Math.random() * 2) + 1; 
    const end = start + duration;
    const answer = `${duration} ${duration === 1 ? 'hour' : 'hours'}`;

    const [name] = getRandomNames(1);
    const events = [
      "swimming lesson",
      "art class",
      "math class",
      "piano practice",
      "reading session",
      "football training"
    ];
    const event = events[Math.floor(Math.random() * events.length)];

    const stems = [
      `${name}'s ${event} starts at ${start} o'clock and ends at ${end} o'clock. How many hours does the ${event} last?`,
      `A cartoon show starts at ${start} o'clock and finishes at ${end} o'clock. How many hours did the cartoon last?`,
      `How many hours are there from ${start} o'clock to ${end} o'clock?`
    ];
    const questionText = stems[Math.floor(Math.random() * stems.length)];
    const storyInstruction = "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT modify ANY field in the JSON template except where instructed. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and 'questionText' MUST remain exactly as provided! IGNORE any examples in the logic variant description.";

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

    const solutionSteps = `Step 1: The start time is ${start} o'clock.\\nStep 2: The end time is ${end} o'clock.\\nStep 3: Count forward: ${end} - ${start} = ${duration}.\\nStep 4: The duration is ${answer}.`;
    const hint = `Count the number of hours from ${start} o'clock to ${end} o'clock on the clock face!`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionText)},
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
      metadata: { difficulty: 'standard', steps: 1, logic: "duration_simple", hideVisual: true }
    };
  },


  standard_activity_duration_compare: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const names = getRandomNames(4);
    const nameA = names[0];
    const nameB = names[1];
    const durA = Math.floor(Math.random() * 2) + 1; 
    const durB = durA + 1; 
    const answer = nameB;

    let questionTextTemplate = getQText(`${nameA} reads for ${durA} hour. ${nameB} draws for ${durB} hours. Who spent more time on their activity?`, `${nameA} (${durA} hr) vs ${nameB} (${durB} hr). Who spent more time?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

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
    } else {
      questionTextTemplate += ` (Choose from: ${options.join(', ')})`;
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
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

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
  },
  
  standard_calculate_start_end_time: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const askEnd = Math.random() > 0.5;
    const [name] = getRandomNames(1);
    const duration = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 hours
    
    // We stay within 1-12 without crossing noon to keep it standard
    const startHour = askEnd ? (Math.floor(Math.random() * (10 - duration)) + 1) : (Math.floor(Math.random() * 5) + 1); // e.g. if dur=3, start is 1..7. If askEnd=false, start=1..5
    const endHour = startHour + duration;
    
    const questionTextTemplate = askEnd 
      ? getQText(`${name} starts playing at ${startHour} o'clock and plays for ${duration} hours. What time does ${name} finish playing?`, `${name} starts at ${startHour} o'clock. Duration is ${duration} hours. What time does it end?`)
      : getQText(`A concert ends at ${endHour} o'clock. The concert is ${duration} hours long. What time did it start?`, `End time is ${endHour} o'clock. Duration is ${duration} hours. What time did it start?`);
      
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    const answer = askEnd ? `${endHour} o'clock` : `${startHour} o'clock`;
    let options = [answer, `${askEnd ? startHour - duration : endHour + duration} o'clock`, `${askEnd ? endHour + 1 : startHour - 1} o'clock`, `${askEnd ? startHour : endHour} o'clock`];
    // Filter out invalid negative times or > 12 if any occurred in distractors
    options = options.map(o => {
      let h = parseInt(o.split(' ')[0]);
      if (h <= 0) h = 12 + h;
      if (h > 12) h = h - 12;
      return `${h} o'clock`;
    });
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

    const solutionSteps = askEnd
      ? `Step 1: Start time is ${startHour} o'clock.\\nStep 2: Add the duration (${duration} hours): ${startHour} + ${duration} = ${endHour}.\\nStep 3: ${name} finishes playing at ${answer}.`
      : `Step 1: End time is ${endHour} o'clock.\\nStep 2: Subtract the duration (${duration} hours): ${endHour} - ${duration} = ${startHour}.\\nStep 3: The concert started at ${answer}.`;

    const hint = askEnd 
      ? `Start at ${startHour} o'clock and count forward ${duration} hours on the clock!`
      : `Start at ${endHour} o'clock and count backwards ${duration} hours on the clock!`;

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
      metadata: { difficulty: 'standard', steps: 1, logic: "calculate_start_end_time", hideVisual: true }
    };
  },

  standard_total_duration: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const [name] = getRandomNames(1);
    const dur1 = Math.floor(Math.random() * 2) + 1; // 1 or 2
    const dur2 = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const total = dur1 + dur2;
    const act1 = "reading";
    const act2 = "playing";
    
    const questionTextTemplate = getQText(`${name} spends ${dur1} ${dur1 === 1 ? 'hour' : 'hours'} ${act1} and ${dur2} hours ${act2}. How many hours does ${name} spend in total?`, `${name} spends ${dur1} ${dur1 === 1 ? 'hour' : 'hours'} ${act1} and ${dur2} hours ${act2}. How many hours does ${name} spend altogether?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    const answer = `${total} hours`;
    let options = [answer, `${dur1 + dur2 + 1} hours`, `${Math.abs(dur1 - dur2)} hours`, `${dur2} hours`];
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

    const solutionSteps = `Step 1: Time spent ${act1} = ${dur1} ${dur1 === 1 ? 'hour' : 'hours'}.\\nStep 2: Time spent ${act2} = ${dur2} hours.\\nStep 3: Add the times: ${dur1} + ${dur2} = ${total} hours.\\nStep 4: ${name} spends ${answer} altogether.`;
    const hint = `Add the two durations together: ${dur1} + ${dur2}!`;

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
      metadata: { difficulty: 'standard', steps: 1, logic: "total_duration", hideVisual: true }
    };
  }
};

export const standardLogic = {
  generate: (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    if (standardVariants[activeVariant]) {
      return standardVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }
  }
};
