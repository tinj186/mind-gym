
const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const standardLogic = {
  generate: (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    let answer = "";
    let distractors = [];
    let qText = "";
    let sText = "";
    let hint = "";
    let solutionSteps = "";
    
    const smallObjects = ["pencil", "marker", "eraser", "crayon", "stapler"];
    const longObjects = ["math textbook", "laptop", "whiteboard duster", "school bag"];
    const randomSmall = smallObjects[Math.floor(Math.random() * smallObjects.length)];
    const randomLong = longObjects[Math.floor(Math.random() * longObjects.length)];
    const randomLengthLong = Math.floor(Math.random() * 30) + 20; // 20 to 49
    
    if (activeVariant === 'standard_select_unit') {
      answer = "cm";
      distractors = ["m", "kg", "l"];
      qText = `Which abbreviation is used to measure the length of a ${randomSmall}?`;
      sText = `Unit for measuring length of ${randomSmall} = ?`;
      hint = "Length of small objects is measured in centimetres.";
      solutionSteps = `We measure the length of small objects like a ${randomSmall} in cm.`;
    } else if (activeVariant === 'standard_sentence_completion') {
      answer = "cm";
      distractors = ["m", "c", "mm"];
      qText = `The ${randomLong} is ${randomLengthLong} ___ long. What is the missing abbreviation?`;
      sText = `${randomLong.charAt(0).toUpperCase() + randomLong.slice(1)} is ${randomLengthLong} ___ long. Missing unit = ?`;
      hint = "A small everyday object's length is measured in centimetres.";
      solutionSteps = "The missing abbreviation is cm (centimetres).";
    } else { // standard_true_false
      answer = "False";
      distractors = ["True"];
      qText = "True or False: We use the abbreviation 'cm' to measure how heavy something is.";
      sText = "Is cm used to measure heavy things? (True/False) = ?";
      hint = "cm is used for length, not weight.";
      solutionSteps = "False. We use cm to measure length, not how heavy something is.";
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
      metadata: { difficulty: 'standard', steps: 1, logic: activeVariant, hideVisual: true }
    };
  }
};
