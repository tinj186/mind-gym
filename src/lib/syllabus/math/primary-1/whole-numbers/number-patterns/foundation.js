import { numberToWords } from '@/lib/utils/math-helpers';
export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
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
    const items = [...sequence.map(String), "?"];

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`What is the next number in this pattern?`, `What is the next number: ${sequence.join(', ')}, ?`),
        options: options,
        finalAnswer: answer,
        solutionSteps: getQText(`The pattern is counting ${isForward ? 'on' : 'back'} by 1. So, ${sequence[3]} ${isForward ? '+' : '-'} 1 = ${answer}.`, `${sequence[3]} ${isForward ? '+' : '-'} 1 = ${answer}.`)
      },
      visualEngine: {
        componentToRender: "NUMBER_PATTERN",
        componentData: { rule: isForward ? "+1" : "-1", items: items, hideVisual: hideVisual }
      },
      inputRequirement: { inputType: inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
    STRICT: Use the [STORY] placeholder below to create a 1-sentence Singaporean math story (e.g., using names like Siti, items like curry puffs, and settings like an MRT station).
    The story MUST provide context for the sequence (e.g., Siti is counting her stickers). DO NOT mention the number 1 in your story.
    
    RETURN ONLY VALID JSON. DO NOT OMIT THE visualEngine DATA:
    ${JSON.stringify(promptObject).replace('What is', '[STORY] What is')}`,
      metadata: { difficulty, steps: 1, logic: isForward ? "forward_1" : "backward_1", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'foundation_missing_middle_1' || activeVariant === 'foundation_missing_middle_back_1') {
    const isForward = activeVariant === 'foundation_missing_middle_1';
    const start = isForward ? Math.floor(Math.random() * 80) + 10 : Math.floor(Math.random() * 80) + 14;
    const step = isForward ? 1 : -1;
    const sequence = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
    const answer = String(sequence[2]);
    
    const options = isMCQ ? [answer, String(sequence[2] - 2), String(sequence[2] + 1), String(sequence[2] + 2)].sort(() => Math.random() - 0.5) : null;
    const items = [String(sequence[0]), String(sequence[1]), "?", String(sequence[3]), String(sequence[4])];

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`What is the missing number in the middle?`, `What is the missing number? ${items.join(', ')}`),
        options: options,
        finalAnswer: answer,
        solutionSteps: getQText(`The pattern is counting ${isForward ? 'on' : 'back'} by 1. So, ${sequence[1]} ${isForward ? '+' : '-'} 1 = ${answer}.`, `${sequence[1]} ${isForward ? '+' : '-'} 1 = ${answer}.`)
      },
      visualEngine: {
        componentToRender: "NUMBER_PATTERN",
        componentData: { rule: isForward ? "+1" : "-1", items: items, hideVisual: hideVisual }
      },
      inputRequirement: { inputType: inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
    STRICT: Use the [STORY] placeholder below to create a 1-sentence Singaporean math story (e.g., using names like Siti, items like curry puffs, and settings like an MRT station).
    The story MUST provide context for the sequence (e.g., Ahmad is arranging his toy cars). DO NOT mention the number 1 in your story.
    
    RETURN ONLY VALID JSON. DO NOT OMIT THE visualEngine DATA:
    ${JSON.stringify(promptObject).replace('What is', '[STORY] What is')}`,
      metadata: { difficulty, steps: 1, logic: isForward ? "missing_middle_1" : "missing_middle_back_1", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'foundation_missing_start_1') {
    const start = Math.floor(Math.random() * 80) + 10;
    const sequence = [start, start + 1, start + 2, start + 3];
    const answer = String(start);
    
    const options = isMCQ ? [answer, String(start - 1), String(start + 4), String(start + 2)].sort(() => Math.random() - 0.5) : null;
    const items = ["?", String(sequence[1]), String(sequence[2]), String(sequence[3])];

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`What is the first number in the pattern?`, `What is the missing number? ${items.join(', ')}`),
        options: options,
        finalAnswer: answer,
        solutionSteps: getQText(`The pattern is counting on by 1. To find the first number, we count back by 1 from ${sequence[1]}. So, ${sequence[1]} - 1 = ${answer}.`, `${sequence[1]} - 1 = ${answer}.`)
      },
      visualEngine: {
        componentToRender: "NUMBER_PATTERN",
        componentData: { rule: "+1", items: items, hideVisual: hideVisual }
      },
      inputRequirement: { inputType: inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
    STRICT: Use the [STORY] placeholder below to create a 1-sentence Singaporean math story (e.g., using names like Siti, items like curry puffs, and settings like an MRT station).
    The story MUST provide context for the sequence (e.g., Wei Ling is collecting seashells). DO NOT mention the number 1 in your story.
    
    RETURN ONLY VALID JSON. DO NOT OMIT THE visualEngine DATA:
    ${JSON.stringify(promptObject).replace('What is', '[STORY] What is')}`,
      metadata: { difficulty, steps: 1, logic: "missing_start_1", hideVisual: hideVisual }
    };
  }
}