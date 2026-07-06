
const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const standardLogic = {
  generate: (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const targetLength = Math.floor(Math.random() * 6) + 4;
    const startPoint = Math.floor(Math.random() * 3) + 1;
    const endPoint = startPoint + targetLength;
    
    const answer = `${endPoint} cm`;
    const distractors = [`${targetLength} cm`, `${endPoint + 1} cm`, `${startPoint} cm`, `${endPoint - 1} cm`];
    
    const questionTextTemplate = getQText(`Ali wants to draw a line segment that is ${targetLength} cm long. If he starts drawing at the ${startPoint} cm mark on his ruler, at which mark should he stop?`, `Start: ${startPoint} cm. Length: ${targetLength} cm. End mark = ?`);
    
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
          "hint": "Add the length to the starting mark.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${startPoint} + ${targetLength} = ${endPoint}. He should stop at the ${endPoint} cm mark."
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "line_drawing", hideVisual: true }
    };
  }
};
