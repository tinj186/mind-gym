import { getRandomContext } from '@/lib/utils/localization';
import { getRandomNames } from '@/lib/utils/variable-bank';
const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const advancedVariants = {
  advanced_one_hour_shift: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const startHour = Math.floor(Math.random() * 10) + 1; 
    const isLater = Math.random() > 0.5;
    const endHour = isLater ? startHour + 1 : (startHour === 1 ? 12 : startHour - 1);
    const answer = `${endHour} o'clock`;
    const componentData = { hour: startHour, minute: 0, displayType: 'analog' };

    const questionTextTemplate = getQText(`Minah started her homework at the time shown on the clock face. She finished exactly 1 hour ${isLater ? 'later' : 'earlier'}. What time did she finish?`, `Time 1 hour ${isLater ? 'later' : 'earlier'} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [answer, `${startHour} o'clock`, `${(endHour % 12) + 1} o'clock`, `${endHour}:30`];
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
          "hint": ${JSON.stringify(getQText(`Imagine moving the short hour hand forward or backward by one big number!`, `Move the hour hand.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The clock shows ${startHour} o'clock. 1 hour ${isLater ? 'after' : 'before'} ${startHour} is ${endHour} o'clock.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "CLOCK_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "one_hour_shift", hideVisual: false }
    };
  },


  advanced_sequence_logic: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const positions = ['A', 'B', 'C'];
    const eventIds = [1, 2, 3].sort(() => Math.random() - 0.5); 
    
    let questionText = `Arrange these daily activities in order from earliest to latest:\n\nA. [AI GENERATED EVENT ${eventIds[0]}]\nB. [AI GENERATED EVENT ${eventIds[1]}]\nC. [AI GENERATED EVENT ${eventIds[2]}]`;
    
    const answerArr = [];
    for(let i=1; i<=3; i++) {
        answerArr.push(positions[eventIds.indexOf(i)]);
    }
    const answer = answerArr.join(", ");
    
    const possibleLetters = ["A, B, C", "A, C, B", "B, A, C", "B, C, A", "C, A, B", "C, B, A"];
    const example = possibleLetters.find(p => p !== answer);
    if (!isMCQ) questionText += `\n\n(Write your answer as letters, e.g., ${example})`;

    const distractors = possibleLetters.filter(p => p !== answer).sort(() => Math.random() - 0.5).slice(0, 3);

    const themes = [
      "a trip to the zoo", "a sports day at school", "a weekend family picnic", 
      "a visit to the museum", "a baking session at home", "a day at the beach",
      "a school field trip", "a birthday party", "a morning at the wet market",
      "an evening at the night safari", "a swimming lesson", "a visit to the library"
    ];
    const theme = themes[Math.floor(Math.random() * themes.length)];

    const storyInstruction = `CRITICAL INSTRUCTION: Generate 3 distinct activities (with their corresponding times) related to '${theme}'. Event 1 (earliest) must be placed in ${positions[eventIds.indexOf(1)]}. Event 2 (middle) must be placed in ${positions[eventIds.indexOf(2)]}. Event 3 (latest) must be placed in ${positions[eventIds.indexOf(3)]}. Replace the placeholders [AI GENERATED EVENT X] in the questionText with your generated events.`;

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

    const solutionText = `${positions[eventIds.indexOf(1)]} happens earliest in the day. ${positions[eventIds.indexOf(2)]} happens next. ${positions[eventIds.indexOf(3)]} happens last. So the correct order is ${answer}.`;

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
          "hint": ${JSON.stringify(getQText(`Look at the times for each activity. Which one happens first in the day?`, `Check the times.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(solutionText, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "sequence_logic", hideVisual: true }
    };
  },


  advanced_half_hour_shift: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const hour = Math.floor(Math.random() * 11) + 1;
    const answer = `${hour + 1} o'clock`;
    const componentData = { hour, minute: 30, displayType: 'analog' };

    const questionTextTemplate = getQText(`The clock shows half past ${hour}. What time will it be in exactly 30 minutes?`, `Time 30 mins after half past ${hour} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [answer, `${hour}:30`, `${hour} o'clock`, `${hour + 2} o'clock`];
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
          "hint": ${JSON.stringify(getQText(`Half an hour is 30 minutes. If you add half an hour to a 'half past' time, you get a new 'o'clock' time!`, `Add 30 minutes.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`At half past ${hour}, the minute hand is at 6. In 30 minutes, it will move to 12, completing the hour to ${hour + 1} o'clock.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "CLOCK_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "half_hour_shift", hideVisual: false }
    };
  },


  advanced_elapsed_time_simple: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const startHour = Math.floor(Math.random() * 3) + 1; 
    const endHour = startHour + 1;
    const answer = "1 hour and 30 minutes";

    const questionTextTemplate = getQText(`How much time has passed between ${startHour} o'clock and half past ${endHour}?`, `Duration from ${startHour}:00 to ${endHour}:30 = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [answer, "1 hour", "2 hours", "30 minutes", "2 hours and 30 minutes"];
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
          "hint": ${JSON.stringify(getQText(`Count the hours first, then add the 30 minutes for the 'half past' part.`, `Calculate duration.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`From ${startHour} o'clock to ${endHour} o'clock is 1 hour. From ${endHour} o'clock to half past ${endHour} is 30 minutes. Total: 1 hour and 30 minutes.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "elapsed_time_simple", hideVisual: true }
    };
  },


  advanced_clock_pattern_prediction: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const hour = Math.floor(Math.random() * 10) + 1;
    const sequence = `${hour} o'clock ➔ half past ${hour} ➔ ${hour + 1} o'clock`;
    const answer = `half past ${hour + 1}`;

    const questionTextTemplate = getQText(`Look at the pattern: ${sequence}. What time comes next?`, `Next time in pattern = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [answer, `${hour + 1} o'clock`, `${hour + 2} o'clock`, `half past ${hour}`];
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
          "hint": ${JSON.stringify(getQText(`Is the time jumping by a whole hour or half an hour (30 minutes)?`, `Find the pattern.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The pattern shows time moving forward by 30 minutes each step. After ${hour + 1} o'clock, the next time is ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "clock_pattern_prediction", hideVisual: true }
    };
  },


  advanced_activity_duration_logic: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const startHour = Math.floor(Math.random() * 8) + 1; // 1 to 8 o'clock
    const duration = Math.floor(Math.random() * 3) + 1;
    const endHour = startHour + duration;
    const { name } = getRandomContext();
    const answer = `${startHour} o'clock`;
    
    const activities = [
      { noun: "homework", verb: "doing homework" },
      { noun: "reading", verb: "reading a book" },
      { noun: "art project", verb: "painting" },
      { noun: "piano practice", verb: "practicing piano" },
      { noun: "puzzle", verb: "doing a puzzle" }
    ];
    const activity = activities[Math.floor(Math.random() * activities.length)];

    const questionTextTemplate = getQText(`${name} finished ${activity.noun} at ${endHour} o'clock. ${name} spent 1 hour ${activity.verb}. What time did ${name} start?`, `Start time = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [answer, `${endHour} o'clock`, `${startHour + 2} o'clock`, "12 o'clock"];
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
          "hint": ${JSON.stringify(getQText(`To find a start time, we need to count backwards from the finish time!`, `Subtract duration.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`If he finished at ${endHour} o'clock and took 1 hour, we go back 1 hour from ${endHour}. ${endHour} - 1 = ${startHour} o'clock.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "activity_duration_logic", hideVisual: true }
    };
  },


  advanced_transitive_time_comparison: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const names = getRandomNames(4);
    const [name1, name2, name3] = names;
    const answer = name3;

    const fullText = `${name1} spent more time than ${name2} on homework. ${name2} spent more time than ${name3}. Who spent the least amount of time?`;
    const shortText = `${name1} took more time than ${name2}. ${name2} took more time than ${name3}. Who took the least time?`;
    const questionTextTemplate = getQText(fullText, shortText);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [answer, name1, name2, "They spent the same time"];
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
          "hint": ${JSON.stringify(getQText(`Try drawing lines to show who spent more time. The shortest line is the person who spent the least time!`, `Use transitive logic.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Since ${name1} > ${name2} and ${name2} > ${name3}, ${name3} must be the one who spent the least time.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "transitive_time_comparison", hideVisual: true }
    };
  },


  advanced_split_schedule_total: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const { name } = getRandomContext();
    const timeCombos = [
      { t1: "1 hour", t2: "30 minutes", ans: "1 hour and 30 minutes" },
      { t1: "30 minutes", t2: "30 minutes", ans: "1 hour" },
      { t1: "1 hour", t2: "1 hour", ans: "2 hours" },
      { t1: "2 hours", t2: "30 minutes", ans: "2 hours and 30 minutes" },
      { t1: "30 minutes", t2: "1 hour", ans: "1 hour and 30 minutes" }
    ];
    const combo = timeCombos[Math.floor(Math.random() * timeCombos.length)];
    const answer = combo.ans;

    const activities = [
      `${name} read a book for ${combo.t1} in the morning and ${combo.t2} at night. How much time did ${name} spend reading in total?`,
      `${name} played the piano for ${combo.t1} in the morning and ${combo.t2} at night. How much time did ${name} spend practicing in total?`,
      `${name} watched cartoons for ${combo.t1} in the afternoon and ${combo.t2} at night. How much time did ${name} spend watching cartoons in total?`
    ];
    const questionTextTemplate = getQText(activities[Math.floor(Math.random() * activities.length)], `Total time = ?`);
    const storyInstruction = "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it exactly as provided. CRITICAL: DO NOT modify ANY field in the JSON template. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.";

    const allOptions = ["1 hour", "2 hours", "30 minutes", "2 hours and 30 minutes", "3 hours", "1 hour and 30 minutes"];
    let distractors = allOptions.filter(opt => opt !== answer).sort(() => Math.random() - 0.5).slice(0, 3);
    let options = getShuffledOptions(answer, distractors);

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
          "questionText": ${JSON.stringify(questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Add the hours together, and then add the minutes.`, `Add times together.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Total time = Morning time + Night time. ${combo.t1} + ${combo.t2} = ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "split_schedule_total", hideVisual: true }
    };
  },


  advanced_earlier_later_clue_parsing: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const hour = Math.floor(Math.random() * 8) + 2; 
    const isLate = Math.random() > 0.5;
    const answer = isLate ? `${hour - 1} o'clock` : `${hour + 1} o'clock`;
    const componentData = { hour, minute: 0, displayType: 'analog' };

    const questionTextTemplate = getQText(`The clock shows when Aminah arrived at the library. She says she is 1 hour too ${isLate ? 'late' : 'early'}. What time was she supposed to be there?`, `Expected time = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let distractors = isLate 
      ? [`${hour} o'clock`, `${hour + 1} o'clock`, `${hour - 2} o'clock`]
      : [`${hour} o'clock`, `${hour - 1} o'clock`, `${hour + 2} o'clock`];
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
          "hint": ${JSON.stringify(getQText(isLate ? "If you are late, the event started before you got there!" : "If you are early, the event will start after you got there!", `Adjust for ${isLate ? 'late' : 'early'}.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(isLate ? `Being late means she arrived after the correct time. ${hour} o'clock minus 1 hour is ${hour - 1} o'clock.` : `Being early means she arrived before the correct time. ${hour} o'clock plus 1 hour is ${hour + 1} o'clock.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "CLOCK_DISPLAY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "earlier_later_clue_parsing", hideVisual: false }
    };
  }
};

export const advancedLogic = {
  generate: (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    if (advancedVariants[activeVariant]) {
      return advancedVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }
  }
};
