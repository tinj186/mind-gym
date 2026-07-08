import { getRandomNames } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const foundationVariants = {
  foundation_identify_abbreviations: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isHour = Math.random() > 0.5;
    const names = getRandomNames(2);
    
    const hTemplates = [
      `What does the abbreviation 'h' stand for when measuring time?`,
      `When we talk about time, what does the letter 'h' mean?`,
      `The short way to write 'hour' is 'h'. What does 'h' stand for?`,
      `${names[0]} sees the letter 'h' next to a number on a clock. What does 'h' stand for?`
    ];
    const minTemplates = [
      `What does the abbreviation 'min' stand for when measuring time?`,
      `When we talk about time, what does 'min' mean?`,
      `The short way to write 'minute' is 'min'. What does 'min' stand for?`,
      `${names[1]} wants to write 'minutes' the short way. She writes 'min'. What does 'min' stand for?`
    ];
    
    const templates = isHour ? hTemplates : minTemplates;
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    let questionText = getQText(
      selectedTemplate,
      `'${isHour ? 'h' : 'min'}' stands for = ?`
    );

    const answer = isHour ? "hour" : "minute";
    const distractors = isHour 
      ? ["half", "heavy", "morning", "meter"]
      : ["morning", "month", "heavy", "meter"];

    let options = getShuffledOptions(answer, distractors);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    
    // This question makes the most sense as MCQ to give them choices, but we handle Short Answer too.
    if (type === 'MCQ' || type !== 'MCQ') { 
      // Force MCQ for this conceptual question if possible
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      
      STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT modify ANY field in the JSON template except where instructed. 'visualEngine', 'componentData', 'solutionSteps', 'hint', 'finalAnswer', and 'questionText' MUST remain exactly as provided! IGNORE any examples in the logic variant description.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionText)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Think about the common words we use to measure time on a clock.`, `Think about clock words.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The abbreviation '${isHour ? 'h' : 'min'}' stands for ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "identify_abbreviations", hideVisual: true }
    };
  }
};

export const foundationLogic = {
  generate: (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    if (foundationVariants[activeVariant]) {
      return foundationVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }
  }
};
