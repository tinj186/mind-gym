import { getRandomNames } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const standardVariants = {
  standard_unit_selection: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isLongActivity = Math.random() > 0.5;
    const names = getRandomNames(2);
    
    const longActivities = [
      { text: "sleeping at night", num: 8 },
      { text: "being at school", num: 6 },
      { text: "watching a movie", num: 2 },
      { text: "visiting the zoo", num: 4 },
      { text: "traveling on an airplane", num: 5 },
      { text: "going for a picnic", num: 3 },
      { text: "baking a big cake", num: 2 }
    ];
    
    const shortActivities = [
      { text: "brushing teeth", num: 3 },
      { text: "eating a snack", num: 10 },
      { text: "washing hands", num: 1 },
      { text: "packing a school bag", num: 5 },
      { text: "putting on shoes", num: 2 },
      { text: "drinking a glass of water", num: 1 },
      { text: "sharpening a pencil", num: 2 }
    ];

    const activity = isLongActivity 
      ? longActivities[Math.floor(Math.random() * longActivities.length)]
      : shortActivities[Math.floor(Math.random() * shortActivities.length)];

    const answer = isLongActivity ? "h" : "min";
    const distractor = isLongActivity ? "min" : "h";
    
    const templates = [
      `${names[0]} is ${activity.text}. This takes about ${activity.num} ___. Which unit of time should be used?`,
      `It takes ${names[0]} about ${activity.num} ___ when ${activity.text}. What is the correct unit?`,
      `For ${activity.text}, we usually measure the time in ${answer === 'h' ? 'hours' : 'minutes'}. The abbreviation is ${activity.num} ___. Which is it?`,
      `${names[0]} is ${activity.text} and says it takes ${activity.num} ___. Should the blank be 'h' or 'min'?`
    ];
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    let questionText = getQText(
      selectedTemplate,
      `${activity.text} takes ${activity.num} ___. (h or min?)`
    );

    let options = getShuffledOptions(answer, [distractor, "cm", "kg"]);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    
    if (type === 'MCQ' || type !== 'MCQ') { 
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
          "hint": ${JSON.stringify(getQText(`Think about how long this activity takes. Is it very fast (minutes) or does it take a very long time (hours)?`, `Consider realistic duration.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Since ${activity.text} takes a ${isLongActivity ? 'long' : 'short'} amount of time, we measure it in ${isLongActivity ? 'hours' : 'minutes'} ('${answer}').`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "unit_selection", hideVisual: true }
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
