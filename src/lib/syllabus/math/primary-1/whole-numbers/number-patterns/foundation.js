import { numberToWords } from '@/lib/utils/math-helpers';
export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  if (activeVariant === 'foundation_forward_1' || activeVariant === 'foundation_backward_1') {
    const isForward = activeVariant === 'foundation_forward_1';
    const start = isForward ? Math.floor(Math.random() * 80) + 10 : Math.floor(Math.random() * 80) + 14;
    const step = isForward ? 1 : -1;
    const sequence = [start, start + step, start + 2 * step, start + 3 * step];
    const answer = String(start + 4 * step);
    
    const distractors = isForward 
      ? [String(start + 3 * step), String(start + 5 * step), String(start + 14)]
      : [String(start - 5), String(start - 3), String(start - 14)];
      
    const options = isMCQ ? [answer, ...distractors].sort(() => Math.random() - 0.5) : null;
    const sequenceItems = [...sequence.map(String), "?"];
    const hideVisual = false;
    const questionTextTemplate = getQText(`What is the next number in this pattern?`, `What is the next number: ${sequence.join(', ')}, ?`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. DO NOT mention the number 1 in your story.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify("[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify(options) : 'null'},
          "hint": "Check if the numbers are getting bigger or smaller by 1 each time.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. The pattern is counting ${isForward ? 'on' : 'back'} by 1.\\n2. ${sequence[3]} ${isForward ? '+' : '-'} 1 = ${answer}."
        },
        "visualEngine": {
          "componentToRender": "${hideVisual ? 'NONE' : 'NUMBER_PATTERN'}",
          "componentData": { "rule": "${isForward ? '+1' : '-1'}", "sequence": ${JSON.stringify(sequenceItems)} }
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 1, logic: isForward ? "forward_1" : "backward_1", hideVisual: false }
    };
  }

  if (activeVariant === 'foundation_missing_middle_1' || activeVariant === 'foundation_missing_middle_back_1') {
    const isForward = activeVariant === 'foundation_missing_middle_1';
    const start = isForward ? Math.floor(Math.random() * 80) + 10 : Math.floor(Math.random() * 80) + 14;
    const step = isForward ? 1 : -1;
    const sequence = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
    const answer = String(sequence[2]);
    
    const options = isMCQ ? [answer, String(sequence[2] - 2), String(sequence[2] + 1), String(sequence[2] + 2)].sort(() => Math.random() - 0.5) : null;
    const sequenceItems = [String(sequence[0]), String(sequence[1]), "?", String(sequence[3]), String(sequence[4])];
    const hideVisual = false;
    const questionTextTemplate = getQText(`What is the missing number in the middle?`, `What is the missing number? ${sequenceItems.join(', ')}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. DO NOT mention the number 1 in your story.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify("[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify(options) : 'null'},
          "hint": "What number comes exactly after ${sequence[1]}?",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. The pattern is counting ${isForward ? 'on' : 'back'} by 1.\\n2. ${sequence[1]} ${isForward ? '+' : '-'} 1 = ${answer}."
        },
        "visualEngine": {
          "componentToRender": "${hideVisual ? 'NONE' : 'NUMBER_PATTERN'}",
          "componentData": { "rule": "${isForward ? '+1' : '-1'}", "sequence": ${JSON.stringify(sequenceItems)} }
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 1, logic: isForward ? "missing_middle_1" : "missing_middle_back_1", hideVisual: false }
    };
  }

  if (activeVariant === 'foundation_missing_start_1') {
    const start = Math.floor(Math.random() * 80) + 10;
    const sequence = [start, start + 1, start + 2, start + 3];
    const answer = String(start);
    
    const options = isMCQ ? [answer, String(start - 1), String(start + 4), String(start + 2)].sort(() => Math.random() - 0.5) : null;
    const sequenceItems = ["?", String(sequence[1]), String(sequence[2]), String(sequence[3])];
    const hideVisual = false;
    const questionTextTemplate = getQText(`What is the first number in the pattern?`, `What is the missing number? ${sequenceItems.join(', ')}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. DO NOT mention the number 1 in your story.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify("[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify(options) : 'null'},
          "hint": "Try counting backward by 1 from ${sequence[1]} to find the start.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. The pattern is counting on by 1.\\n2. To find the first number, we count back by 1 from ${sequence[1]}.\\n3. ${sequence[1]} - 1 = ${answer}."
        },
        "visualEngine": {
          "componentToRender": "${hideVisual ? 'NONE' : 'NUMBER_PATTERN'}",
          "componentData": { "rule": "+1", "sequence": ${JSON.stringify(sequenceItems)} }
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "missing_start_1", hideVisual: false }
    };
  }
}