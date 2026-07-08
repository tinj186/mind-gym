import { getRandomNames } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const advancedVariants = {
  advanced_duration_comparison: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const names = getRandomNames(2);
    
    // We want the hour amount to be a SMALLER number than the minute amount
    // to test if they actually look at the unit!
    const hourNum = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const minNum = Math.floor(Math.random() * 45) + 15; // 15 to 59
    
    // Who does what?
    const hourPersonFirst = Math.random() > 0.5;
    
    const activities = [
      ["reads a book", "plays a game"],
      ["draws a picture", "rides a bicycle"],
      ["watches television", "builds a sandcastle"],
      ["does homework", "eats lunch"]
    ];
    const chosenActivityPair = activities[Math.floor(Math.random() * activities.length)];
    
    const person1 = hourPersonFirst ? names[0] : names[1];
    const unit1 = hourPersonFirst ? 'h' : 'min';
    const num1 = hourPersonFirst ? hourNum : minNum;
    const act1 = hourPersonFirst ? chosenActivityPair[0] : chosenActivityPair[1];
    
    const person2 = hourPersonFirst ? names[1] : names[0];
    const unit2 = hourPersonFirst ? 'min' : 'h';
    const num2 = hourPersonFirst ? minNum : hourNum;
    const act2 = hourPersonFirst ? chosenActivityPair[1] : chosenActivityPair[0];
    
    const askLonger = Math.random() > 0.5;
    
    // The person with 'h' is always the longer one in this setup.
    const longerPerson = hourPersonFirst ? names[0] : names[1];
    const shorterPerson = hourPersonFirst ? names[1] : names[0];
    
    const answer = askLonger ? longerPerson : shorterPerson;
    const distractor = askLonger ? shorterPerson : longerPerson;
    
    const templates = [
      `${names[0]} ${act1} for ${num1} ${unit1}. ${names[1]} ${act2} for ${num2} ${unit2}. Who spends a ${askLonger ? 'longer' : 'shorter'} time?`,
      `For a school project, ${names[0]} ${act1} for ${num1} ${unit1} and ${names[1]} ${act2} for ${num2} ${unit2}. Who takes a ${askLonger ? 'longer' : 'shorter'} amount of time?`,
      `${names[1]} ${act2} for ${num2} ${unit2}. However, ${names[0]} ${act1} for ${num1} ${unit1}. Who spends ${askLonger ? 'more' : 'less'} time?`
    ];
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    let questionText = getQText(
      selectedTemplate,
      `${names[0]}: ${num1} ${unit1}\\n${names[1]}: ${num2} ${unit2}\\nWho spends ${askLonger ? 'more' : 'less'} time?`
    );

    let options = getShuffledOptions(answer, [distractor, "They are the same"]);

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
          "hint": ${JSON.stringify(getQText(`Look carefully at the letters 'h' and 'min'. Remember that 1 hour (h) is made up of 60 minutes (min).`, `Check units carefully.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Even though ${minNum} is a bigger number than ${hourNum}, the unit 'h' (hours) is much longer than 'min' (minutes).\\nSince 1 h is 60 minutes, ${hourNum} h is a longer time than ${minNum} min.\\nTherefore, ${answer} spends a ${askLonger ? 'longer' : 'shorter'} time.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "duration_comparison", hideVisual: true }
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
