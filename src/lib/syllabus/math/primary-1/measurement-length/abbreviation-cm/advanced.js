
const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const advancedLogic = {
  generate: (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    let answer = "";
    let distractors = [];
    let qText = "";
    let sText = "";
    let hint = "";
    let solutionSteps = "";
    
    const smallObjects = ["pencil", "marker", "eraser", "crayon", "stapler"];
    const randomSmall1 = smallObjects[Math.floor(Math.random() * smallObjects.length)];
    const randomSmall2 = smallObjects[Math.floor(Math.random() * smallObjects.length)];
    const names = ["Ahmad", "Ali", "Mei Ling", "Ravi", "Siti"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    const randomLength1 = Math.floor(Math.random() * 15) + 5; // 5 to 19
    const randomLength2 = Math.floor(Math.random() * 10) + 3; // 3 to 12
    const rulerLengths = [15, 30];
    const randomRulerLength = rulerLengths[Math.floor(Math.random() * rulerLengths.length)];
    
    if (activeVariant === 'advanced_error_correction') {
      answer = "cm";
      distractors = ["c", "m", "mm"];
      qText = `${randomName} wrote: 'The ${randomSmall1} is ${randomLength1} mc long.' What is the correct abbreviation he should have written?`;
      sText = `'${randomLength1} mc' is wrong. Correct abbreviation = ?`;
      hint = "The letters for centimetre are c and m in that order.";
      solutionSteps = "The correct abbreviation for centimetre is cm, not mc.";
    } else if (activeVariant === 'advanced_correct_usage') {
      answer = `The ${randomSmall2} is ${randomLength2} cm long.`;
      distractors = [`The ${randomSmall2} is ${randomLength2} m long.`, `The ${randomSmall2} is ${randomLength2} kg long.`, `The ${randomSmall2} is ${randomLength2} ml long.`];
      qText = `Which sentence uses the correct abbreviation for measuring the length of an ${randomSmall2}?`;
      sText = `Correct sentence for length of ${randomSmall2} = ?`;
      hint = `A ${randomSmall2} is small and its length is measured in centimetres.`;
      solutionSteps = `The length of a ${randomSmall2} is measured in cm. So, 'The ${randomSmall2} is ${randomLength2} cm long.' is correct.`;
    } else { // advanced_estimate_unit
      answer = "cm";
      distractors = ["m", "mm", "km"];
      qText = `A standard ruler used in school is usually ${randomRulerLength} ___ long. Fill in the blank.`;
      sText = `Standard ruler is ${randomRulerLength} ___ long. Unit = ?`;
      hint = "Look at your ruler! What does it say on it?";
      solutionSteps = `A standard short school ruler is ${randomRulerLength} cm long.`;
    }
    
    const questionTextTemplate = getQText(qText, sText);
    let options = getShuffledOptions(answer, distractors);
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    
    const forceMCQ = true;
    if (type === 'MCQ' || forceMCQ) {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "subtopic": "${subtopic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": "${hint}",
          "finalAnswer": "${answer}",
          "solutionSteps": "${solutionSteps}"
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 1, logic: activeVariant, hideVisual: true }
    };
  }
};
