import { getRandomNames } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const standardVariants = {
  standard_line_drawing: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const targetLength = Math.floor(Math.random() * 6) + 4;
    const startPoint = Math.floor(Math.random() * 3) + 1;
    const endPoint = startPoint + targetLength;
    const name = getRandomNames(1);
    
    const answer = `${endPoint} cm`;
    const distractors = [`${targetLength} cm`, `${endPoint + 1} cm`, `${startPoint} cm`, `${endPoint - 1} cm`];
    
    const questionTextTemplate = getQText(`${name} wants to draw a line segment that is ${targetLength} cm long. If he starts drawing at the ${startPoint} cm mark on his ruler, at which mark should he stop?`, `Start: ${startPoint} cm. Length: ${targetLength} cm. End mark = ?`);
    
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
    
    const componentData = {
      items: [{ label: `${name}'s Line`, length: targetLength, startOffset: startPoint }],
      showFullRuler: true,
      unitIcon: "ruler.svg"
    };

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
          "solutionSteps": "${startPoint} + ${targetLength} = ${endPoint}. ${name} should stop at the ${endPoint} cm mark."
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": { "hideVisual": true }
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "line_drawing", hideVisual: false }
    };
  },

  standard_calculate_start_point: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const targetLength = Math.floor(Math.random() * 5) + 4;
    const startPoint = Math.floor(Math.random() * 4) + 1;
    const endPoint = startPoint + targetLength;
    const name = getRandomNames(1);
    
    const answer = `${startPoint} cm`;
    const distractors = [`${endPoint} cm`, `${startPoint + 1} cm`, `${targetLength} cm`, `${startPoint - 1} cm`];
    
    const questionTextTemplate = getQText(`${name} drew a line segment that is ${targetLength} cm long. If the line ends at the ${endPoint} cm mark on the ruler, at which mark did it start?`, `Length: ${targetLength} cm. End: ${endPoint} cm. Start mark = ?`);
    
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
    
    const componentData = {
      items: [{ label: `${name}'s Line`, length: targetLength, startOffset: startPoint }],
      showFullRuler: true,
      unitIcon: "ruler.svg"
    };

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
          "hint": "Subtract the length from the ending mark.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${endPoint} - ${targetLength} = ${startPoint}. It started at the ${startPoint} cm mark."
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": { "hideVisual": true }
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "calculate_start_point", hideVisual: false }
    };
  },

  standard_calculate_length_from_marks: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const startPoint = Math.floor(Math.random() * 4) + 1;
    const targetLength = Math.floor(Math.random() * 6) + 3;
    const endPoint = startPoint + targetLength;
    const name = getRandomNames(1);
    
    const answer = `${targetLength} cm`;
    const distractors = [`${endPoint} cm`, `${targetLength + 1} cm`, `${targetLength - 1} cm`, `${startPoint} cm`];
    
    const questionTextTemplate = getQText(`A line segment drawn by ${name} starts at the ${startPoint} cm mark and ends at the ${endPoint} cm mark. How long is the line segment?`, `Start: ${startPoint} cm. End: ${endPoint} cm. Length = ?`);
    
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
    
    const componentData = {
      items: [{ label: `${name}'s Line`, length: targetLength, startOffset: startPoint }],
      showFullRuler: true,
      unitIcon: "ruler.svg"
    };

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
          "hint": "Subtract the starting mark from the ending mark.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${endPoint} - ${startPoint} = ${targetLength}. The line segment is ${targetLength} cm long."
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": { "hideVisual": true }
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "calculate_length_from_marks", hideVisual: false }
    };
  },

  standard_draw_longer_line: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const names = getRandomNames(2);
    const name1 = names[0];
    const name2 = names[1];
    
    const len1 = Math.floor(Math.random() * 4) + 3;
    const diff = Math.floor(Math.random() * 3) + 2;
    const len2 = len1 + diff;
    const startPoint = Math.floor(Math.random() * 3) + 1;
    const endPoint = startPoint + len2;
    
    const answer = `${endPoint} cm`;
    const distractors = [`${len2} cm`, `${endPoint + 1} cm`, `${endPoint - 1} cm`, `${startPoint + len1} cm`];
    
    const questionTextTemplate = getQText(`${name1} drew a line that is ${len1} cm long. ${name2} drew a line that is ${diff} cm longer than ${name1}'s line. If ${name2} starts drawing at the ${startPoint} cm mark, at which mark should ${name2} stop?`, `${name1}: ${len1} cm. ${name2}: ${diff} cm longer. Start: ${startPoint} cm. ${name2} end mark = ?`);
    
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
    
    const componentData = {
      items: [
        { label: `${name1}'s Line`, length: len1, startOffset: 0 },
        { label: `${name2}'s Line`, length: len2, startOffset: startPoint }
      ],
      showFullRuler: true,
      unitIcon: "ruler.svg"
    };

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
          "hint": "First, find out how long ${name2}'s line is. Then, add it to the starting mark.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${len1} + ${diff} = ${len2}. ${name2}'s line is ${len2} cm long.\\n${startPoint} + ${len2} = ${endPoint}. ${name2} should stop at the ${endPoint} cm mark."
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": { "hideVisual": true }
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "draw_longer_line", hideVisual: false }
    };
  },

  standard_draw_shorter_line: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const names = getRandomNames(2);
    const name1 = names[0];
    const name2 = names[1];
    
    const len1 = Math.floor(Math.random() * 3) + 7;
    const diff = Math.floor(Math.random() * 3) + 2;
    const len2 = len1 - diff;
    const startPoint = Math.floor(Math.random() * 3) + 1;
    const endPoint = startPoint + len2;
    
    const answer = `${endPoint} cm`;
    const distractors = [`${len2} cm`, `${endPoint + 1} cm`, `${endPoint - 1} cm`, `${startPoint + len1} cm`];
    
    const questionTextTemplate = getQText(`${name1} drew a line that is ${len1} cm long. ${name2} drew a line that is ${diff} cm shorter than ${name1}'s line. If ${name2} starts drawing at the ${startPoint} cm mark, at which mark should ${name2} stop?`, `${name1}: ${len1} cm. ${name2}: ${diff} cm shorter. Start: ${startPoint} cm. ${name2} end mark = ?`);
    
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
    
    const componentData = {
      items: [
        { label: `${name1}'s Line`, length: len1, startOffset: 0 },
        { label: `${name2}'s Line`, length: len2, startOffset: startPoint }
      ],
      showFullRuler: true,
      unitIcon: "ruler.svg"
    };

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
          "hint": "First, find out how long ${name2}'s line is. Then, add it to the starting mark.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${len1} - ${diff} = ${len2}. ${name2}'s line is ${len2} cm long.\\n${startPoint} + ${len2} = ${endPoint}. ${name2} should stop at the ${endPoint} cm mark."
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": { "hideVisual": true }
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "draw_shorter_line", hideVisual: false }
    };
  }
};

export const standardLogic = {
  generate: (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    if (standardVariants[activeVariant]) {
      return standardVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }
  }
};
