
const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const foundationLogic = {
  generate: (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    let answer = "";
    let distractors = [];
    let qText = "";
    let sText = "";
    let hint = "";
    let solutionSteps = "";
    
    if (activeVariant === 'foundation_identify_cm') {
      answer = "cm";
      distractors = ["c", "m", "mm"];
      qText = "What is the short way to write 'centimetre'?";
      sText = "Abbreviation for centimetre = ?";
      hint = "Centimetre starts with 'c' and 'm'.";
      solutionSteps = "The abbreviation for centimetre is cm.";
    } else if (activeVariant === 'foundation_identify_word') {
      answer = "centimetre";
      distractors = ["metre", "cent", "millimetre"];
      qText = "What does 'cm' stand for?";
      sText = "cm stands for = ?";
      hint = "Think about the word we use to measure short lengths.";
      solutionSteps = "cm stands for centimetre.";
    } else { // foundation_spelling
      answer = "centimetre";
      distractors = ["sentimeter", "cemtimetre", "centmetre"];
      qText = "Which is the correct spelling for the unit we use to measure short lengths?";
      sText = "Correct spelling of centimetre = ?";
      hint = "It starts with a 'c' and ends with 'metre'.";
      solutionSteps = "The correct spelling is centimetre.";
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
      metadata: { difficulty: 'foundation', steps: 1, logic: activeVariant, hideVisual: true }
    };
  }
};
