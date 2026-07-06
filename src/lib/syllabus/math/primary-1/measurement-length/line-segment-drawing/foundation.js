
const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const foundationLogic = {
  generate: (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const targetLength = Math.floor(Math.random() * 5) + 3;
    const itemsArr = [
      { label: "Line A", length: targetLength },
      { label: "Line B", length: targetLength + 2 },
      { label: "Line C", length: targetLength - 1 },
      { label: "Line D", length: targetLength + 1 }
    ].sort(() => Math.random() - 0.5);
    
    const componentData = { items: itemsArr, unitIcon: "ruler.svg" };
    const answer = itemsArr.find(i => i.length === targetLength).label;
    
    const questionTextTemplate = getQText(`Which line segment is exactly ${targetLength} cm long? (Note: Each unit stands for 1 cm)`, `Find the ${targetLength} cm line segment.`);
    
    let options = itemsArr.map(i => i.label);
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    
    const forceMCQ = true;
    if (type === 'MCQ' || forceMCQ) {
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
          "hint": "Count the cm units for each line.",
          "finalAnswer": "${answer}",
          "solutionSteps": "Counting the units, ${answer} is exactly ${targetLength} cm long."
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_UNIT",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "identify_line", hideVisual: false }
    };
  }
};
