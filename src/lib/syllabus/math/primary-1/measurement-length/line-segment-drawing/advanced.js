import { getRandomNames } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

export const advancedVariants = {
  advanced_combined_length_misaligned: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const names = getRandomNames(2);
    const name1 = names[0];
    const name2 = names[1];
    
    const start1 = Math.floor(Math.random() * 3) + 1;
    const len1 = Math.floor(Math.random() * 3) + 3;
    const end1 = start1 + len1;
    
    const start2 = Math.floor(Math.random() * 3) + 1;
    const len2 = Math.floor(Math.random() * 4) + 4;
    const end2 = start2 + len2;
    
    const totalLength = len1 + len2;
    const answer = `${totalLength} cm`;
    const distractors = [`${totalLength + 1} cm`, `${totalLength - 1} cm`, `${len1} cm`, `${len2} cm`, `${end1 + end2} cm`];
    
    const questionTextTemplate = getQText(`${name1} drew a line from the ${start1} cm mark to the ${end1} cm mark. ${name2} drew a line from the ${start2} cm mark to the ${end2} cm mark. What is the total length of the two lines?`, `${name1}'s line: from ${start1} cm to ${end1} cm.\\n${name2}'s line: from ${start2} cm to ${end2} cm.\\nTotal length = ?`);
    
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
        { label: `${name1}'s Line`, length: len1, startOffset: start1 },
        { label: `${name2}'s Line`, length: len2, startOffset: start2 }
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
          "hint": "First, find the length of each line by subtracting the start mark from the end mark. Then add the two lengths together.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${name1}'s line is ${end1} - ${start1} = ${len1} cm long.\\n${name2}'s line is ${end2} - ${start2} = ${len2} cm long.\\nTotal length: ${len1} + ${len2} = ${totalLength} cm."
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "combined_length_misaligned", hideVisual: false }
    };
  },

  advanced_missing_part_length: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const totalLength = Math.floor(Math.random() * 5) + 10; // 10 to 14
    const startMark = Math.floor(Math.random() * 3) + 1;
    const part1Length = Math.floor(Math.random() * 4) + 3;
    const endMark = startMark + part1Length;
    const part2Length = totalLength - part1Length;
    
    const answer = `${part2Length} cm`;
    const distractors = [`${part1Length} cm`, `${totalLength - endMark} cm`, `${part2Length + 1} cm`, `${part2Length - 1} cm`];
    
    const questionTextTemplate = getQText(`A string is ${totalLength} cm long in total. It is cut into two pieces. One piece is placed on a ruler starting at the ${startMark} cm mark and ending at the ${endMark} cm mark. How long is the other piece?`, `Total string: ${totalLength} cm.\\nPiece 1: from ${startMark} cm to ${endMark} cm.\\nPiece 2 length = ?`);
    
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
        { label: "Piece 1", length: part1Length, startOffset: startMark }
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
          "hint": "First, find out how long Piece 1 is. Then subtract it from the total length.",
          "finalAnswer": "${answer}",
          "solutionSteps": "Piece 1 is ${endMark} - ${startMark} = ${part1Length} cm long.\\nTotal string is ${totalLength} cm.\\nPiece 2: ${totalLength} - ${part1Length} = ${part2Length} cm."
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "missing_part_length", hideVisual: false }
    };
  },

  advanced_draw_equal_parts: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    // We need an even length so it can be divided into 2 equal parts
    const halfLength = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const totalLength = halfLength * 2;
    const startMark = Math.floor(Math.random() * 3) + 1;
    const endMark = startMark + totalLength;
    
    const answer = `${halfLength} cm`;
    const distractors = [`${totalLength} cm`, `${halfLength + 1} cm`, `${halfLength - 1} cm`, `${endMark} cm`];
    
    const questionTextTemplate = getQText(`A ribbon is placed on a ruler starting at the ${startMark} cm mark and ending at the ${endMark} cm mark. It is then cut into two equal pieces. How long is each piece?`, `Ribbon: from ${startMark} cm to ${endMark} cm.\\nCut into 2 equal pieces.\\nLength of 1 piece = ?`);
    
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
        { label: "Full Ribbon", length: totalLength, startOffset: startMark }
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
          "hint": "First find the total length of the ribbon. Then think about what number added to itself gives you that total length.",
          "finalAnswer": "${answer}",
          "solutionSteps": "The full ribbon is ${endMark} - ${startMark} = ${totalLength} cm long.\\nSince ${halfLength} + ${halfLength} = ${totalLength}, each equal piece is ${halfLength} cm long."
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "draw_equal_parts", hideVisual: false }
    };
  },

  advanced_draw_three_lines: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const lenA = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const longerBy = Math.floor(Math.random() * 3) + 2;
    const lenB = lenA + longerBy;
    const shorterBy = Math.floor(Math.random() * 2) + 1;
    const lenC = lenB - shorterBy;
    
    const startC = Math.floor(Math.random() * 3) + 1;
    const endC = startC + lenC;
    
    const answer = `${endC} cm`;
    const distractors = [`${lenC} cm`, `${endC + 1} cm`, `${endC - 1} cm`, `${startC + lenB} cm`];
    
    const questionTextTemplate = getQText(`Line A is ${lenA} cm long. Line B is ${longerBy} cm longer than Line A. Line C is ${shorterBy} cm shorter than Line B. If Line C starts at the ${startC} cm mark, where does it end?`, `Line A: ${lenA} cm.\\nLine B: ${longerBy} cm longer than A.\\nLine C: ${shorterBy} cm shorter than B.\\nLine C starts at ${startC} cm.\\nLine C end mark = ?`);
    
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

    // Only render A and B to avoid giving away the answer for C's end point!
    const componentData = {
      items: [
        { label: "Line A", length: lenA, startOffset: 0 },
        { label: "Line B", length: lenB, startOffset: 0 }
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
          "hint": "Find the length of Line B first, then find the length of Line C. Finally, add Line C's length to its starting mark.",
          "finalAnswer": "${answer}",
          "solutionSteps": "Line B: ${lenA} + ${longerBy} = ${lenB} cm.\\nLine C: ${lenB} - ${shorterBy} = ${lenC} cm.\\nLine C end mark: ${startC} + ${lenC} = ${endC} cm."
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "draw_three_lines", hideVisual: false }
    };
  },

  advanced_find_longest_misaligned: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const isALonger = Math.random() > 0.5;
    const diff = Math.floor(Math.random() * 3) + 1;
    
    const shortLen = Math.floor(Math.random() * 3) + 3;
    const longLen = shortLen + diff;
    
    const lenA = isALonger ? longLen : shortLen;
    const lenB = isALonger ? shortLen : longLen;
    
    const startA = Math.floor(Math.random() * 3) + 1;
    const startB = startA + Math.floor(Math.random() * 3) + 1; // Different start
    
    const endA = startA + lenA;
    const endB = startB + lenB;
    
    const longerLineName = isALonger ? "Line A" : "Line B";
    const answer = `${longerLineName} by ${diff} cm`;
    
    const distractor1 = `${isALonger ? "Line B" : "Line A"} by ${diff} cm`;
    const distractor2 = `${longerLineName} by ${diff + 1} cm`;
    const distractor3 = `${isALonger ? "Line B" : "Line A"} by ${diff + 1} cm`;
    const distractors = [distractor1, distractor2, distractor3];
    
    const questionTextTemplate = getQText(`Line A starts at the ${startA} cm mark and ends at the ${endA} cm mark. Line B starts at the ${startB} cm mark and ends at the ${endB} cm mark. Which line is longer, and by how much?`, `Line A: ${startA} cm to ${endA} cm.\\nLine B: ${startB} cm to ${endB} cm.\\nWhich is longer and by how much?`);
    
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
        { label: "Line A", length: lenA, startOffset: startA },
        { label: "Line B", length: lenB, startOffset: startB }
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
          "hint": "Find the length of both lines first by subtracting their start marks from their end marks. Then subtract the smaller length from the larger length.",
          "finalAnswer": "${answer}",
          "solutionSteps": "Line A is ${endA} - ${startA} = ${lenA} cm.\\nLine B is ${endB} - ${startB} = ${lenB} cm.\\n${longLen} - ${shortLen} = ${diff}. ${longerLineName} is longer by ${diff} cm."
        },
        "visualEngine": {
          "componentToRender": "MEASUREMENT_RULER",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'STANDARD_TEXT' : (type === 'MCQ' || forceMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "find_longest_misaligned", hideVisual: false }
    };
  }
};

export const advancedLogic = {
  generate: (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    if (advancedVariants[activeVariant]) {
      return advancedVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }
  }
};
