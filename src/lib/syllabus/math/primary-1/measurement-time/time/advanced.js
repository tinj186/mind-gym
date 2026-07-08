import { getRandomContext } from '@/lib/utils/localization';
import { getRandomNames } from '@/lib/utils/variable-bank';
const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const advancedVariants = {

  advanced_half_hour_hand_drift: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const hour = Math.floor(Math.random() * 11) + 1;
    const nextHour = hour === 12 ? 1 : hour + 1;
    const answer = `Exactly halfway between ${hour} and ${nextHour}`;

    const questionTextTemplate = getQText(`Where is the short hour hand pointing when the time is exactly half past ${hour}?`, `Hour hand pos at half past ${hour} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)} that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [answer, `Exactly at ${hour}`, `Exactly at ${nextHour}`, `Exactly at 6`];
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
          "hint": ${JSON.stringify(getQText(`The hour hand doesn't stay on a number for the whole hour. It moves slowly toward the next number!`, `Check the hour hand.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`At half past ${hour}, 30 minutes have passed. The hour hand moves slowly throughout the hour and will be halfway between ${hour} and ${nextHour}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 1, logic: "half_hour_hand_drift", hideVisual: true }
    };
  },

  advanced_missing_numbers_clock: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const randomHour = Math.floor(Math.random() * 12) + 1;
    const isHalfHour = Math.random() > 0.5;
    
    let answer, hint, solutionSteps;
    if (isHalfHour) {
      answer = `Half past ${randomHour}`;
      hint = getQText(`The long hand points straight down to where 6 used to be. The short hand is past where ${randomHour} used to be.`, `Long hand down means half past.`);
      solutionSteps = getQText(`The long hand points straight down to the bottom tick mark, which is 30 minutes. The short hand points halfway between the ${randomHour} and ${randomHour === 12 ? 1 : randomHour + 1} tick marks. The time is half past ${randomHour}.`, `Answer is ${answer}.`);
    } else {
      answer = `${randomHour} o'clock`;
      hint = getQText(`The long hand points straight up to the top mark. Count the marks starting from the top to find where the short hand points!`, `Count marks from the top.`);
      solutionSteps = getQText(`The long hand points straight up to the top tick mark (the 12 position). The short hand points exactly to the tick mark for ${randomHour}. The time is ${randomHour} o'clock.`, `Answer is ${answer}.`);
    }

    let questionTextTemplate = getQText(`A clock has no numbers on it, only lines! The long minute hand points ${isHalfHour ? 'straight down to the bottom line' : 'straight up to the top line'}. The short hour hand points ${isHalfHour ? `halfway between the line for ${randomHour} and the line for ${randomHour === 12 ? 1 : randomHour + 1}` : `exactly to the line where the number ${randomHour} should be`}. What time is it?`, `Time on blank clock = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)} that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [
      answer,
      isHalfHour ? `${randomHour} o'clock` : `Half past ${randomHour}`,
      isHalfHour ? `Half past ${randomHour === 12 ? 1 : randomHour + 1}` : `${randomHour === 12 ? 1 : randomHour + 1} o'clock`,
      isHalfHour ? `Half past ${randomHour === 1 ? 12 : randomHour - 1}` : `${randomHour === 1 ? 12 : randomHour - 1} o'clock`
    ];
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
      questionTextTemplate += ` (Write the time, e.g., 5 o'clock or Half past 5)`;
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
      metadata: { difficulty: 'advanced', steps: 1, logic: "missing_numbers_clock", hideVisual: true }
    };
  },

  advanced_broken_minute_hand: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const isHalfHour = Math.random() > 0.5;
    
    let answer, hint, solutionSteps;
    if (isHalfHour) {
      const nextHour = hour === 12 ? 1 : hour + 1;
      answer = `Half past ${hour}`;
      hint = getQText(`When the hour hand is exactly halfway between two numbers, the long hand must be at the bottom (half past)!`, `Halfway between = half past.`);
      solutionSteps = getQText(`The short hour hand is exactly halfway between ${hour} and ${nextHour}. This means 30 minutes have passed in the hour, so it is ${answer}.`, `Answer is ${answer}.`);
    } else {
      answer = `${hour} o'clock`;
      hint = getQText(`When the hour hand points exactly to a number, the long hand must be at the top (o'clock)!`, `Exactly on number = o'clock.`);
      solutionSteps = getQText(`The short hour hand is pointing exactly at ${hour}. This means zero minutes have passed, so it is exactly ${answer}.`, `Answer is ${answer}.`);
    }

    let questionTextTemplate = getQText(`A clock's long minute hand is broken and missing! The short hour hand is pointing ${isHalfHour ? `exactly halfway between ${hour} and ${hour === 12 ? 1 : hour + 1}` : `exactly at the number ${hour}`}. What time is it?`, `Time based on hour hand = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)} that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let options = [
      answer,
      isHalfHour ? `${hour} o'clock` : `Half past ${hour}`,
      isHalfHour ? `Half past ${hour === 12 ? 1 : hour + 1}` : `${hour === 12 ? 1 : hour + 1} o'clock`,
      isHalfHour ? `Half past ${hour === 1 ? 12 : hour - 1}` : `${hour === 1 ? 12 : hour - 1} o'clock`
    ];
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
      questionTextTemplate += ` (Write the time, e.g., 5 o'clock or Half past 5)`;
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
      metadata: { difficulty: 'advanced', steps: 1, logic: "broken_minute_hand", hideVisual: true }
    };
  },

  advanced_fast_slow_clock_simple: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isFast = Math.random() > 0.5;
    const hour = Math.floor(Math.random() * 12) + 1;
    const isHalfHour = Math.random() > 0.5;
    
    let answerHour = isFast ? hour - 1 : hour + 1;
    if (answerHour === 0) answerHour = 12;
    if (answerHour === 13) answerHour = 1;
    
    const timeStr = isHalfHour ? `Half past ${hour}` : `${hour} o'clock`;
    const answerStr = isHalfHour ? `Half past ${answerHour}` : `${answerHour} o'clock`;

    let questionTextTemplate = getQText(`A clock is 1 hour ${isFast ? 'fast' : 'slow'}. The clock shows ${timeStr}. What is the real time?`, `Clock is 1 hr ${isFast ? 'fast' : 'slow'}. Shows ${timeStr}. Real time = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)} that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let distractors = [
      timeStr,
      isHalfHour ? `Half past ${isFast ? (hour === 12 ? 1 : hour + 1) : (hour === 1 ? 12 : hour - 1)}` : `${isFast ? (hour === 12 ? 1 : hour + 1) : (hour === 1 ? 12 : hour - 1)} o'clock`,
      isHalfHour ? `${answerHour} o'clock` : `Half past ${answerHour}`
    ];
    let options = [answerStr, ...distractors];
    options = getShuffledOptions(answerStr, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answerStr) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    } else {
      questionTextTemplate += ` (Write the time, e.g., 5 o'clock or Half past 5)`;
    }

    const hintStr = isFast ? `If the clock is fast, it shows a time that is ahead of the real time. You need to count backwards 1 hour.` : `If the clock is slow, it shows a time that is behind the real time. You need to count forwards 1 hour.`;
    const solStr = isFast ? `The clock is 1 hour fast, so the real time is 1 hour earlier than ${timeStr}. One hour earlier is ${answerStr}.` : `The clock is 1 hour slow, so the real time is 1 hour later than ${timeStr}. One hour later is ${answerStr}.`;

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
          "hint": ${JSON.stringify(getQText(hintStr, isFast ? `Count backwards 1 hour.` : `Count forwards 1 hour.`))},
          "finalAnswer": "${answerStr}",
          "solutionSteps": ${JSON.stringify(getQText(solStr, `Answer is ${answerStr}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 1, logic: "fast_slow_clock_simple", hideVisual: true }
    };
  },

  advanced_straight_line_hands: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isStraightLine = Math.random() > 0.5;
    const answer = isStraightLine ? "6 o'clock" : "12 o'clock";
    const condition = isStraightLine ? "form a perfectly straight line pointing in opposite directions" : "are perfectly overlapping and pointing at the exact same number";
    
    let questionTextTemplate = getQText(`At what time do the hour hand and minute hand ${condition}?`, `Hands ${isStraightLine ? 'form straight line opposite' : 'overlap exactly'} = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question. CRITICAL: DO NOT modify ANY field in the JSON template except inserting the story. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description." : `STRICT: Keep the mathematical sentences in "questionText" EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Just replace the "[STORY]" tag with a simple 1-sentence Singaporean math story context for a Primary 1 student featuring a person named ${getRandomNames(1)} that EXPLICITLY names the items/times in the question. DO NOT combine the story and the math question into one sentence. CRITICAL: DO NOT modify ANY field in the JSON template except replacing the [STORY] tag. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and all times/numbers MUST remain exactly as provided! IGNORE any examples in the logic variant description.`;

    let distractors = [isStraightLine ? "12 o'clock" : "6 o'clock", "3 o'clock", "9 o'clock"];
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
      questionTextTemplate += ` (Choose from: ${options.join(', ')})`;
    }

    const hintStr = isStraightLine ? `Think about when the long hand is pointing straight up at 12, and the short hand is pointing straight down!` : `Think about when both the long hand and short hand point straight up to the very top!`;
    const solStr = isStraightLine ? `At 6 o'clock, the minute hand points straight up at 12 and the hour hand points straight down at 6. This forms a perfect straight line!` : `At 12 o'clock, both the minute hand and the hour hand point straight up at the number 12. They overlap exactly!`;

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
          "hint": ${JSON.stringify(getQText(hintStr, isStraightLine ? `Straight line up and down.` : `Both hands point top.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(solStr, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 1, logic: "straight_line_hands", hideVisual: true }
    };
  }
};

export const advancedLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (advancedVariants[activeVariant]) {
    return advancedVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};