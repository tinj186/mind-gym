import { numberToWords } from '@/lib/utils/math-helpers';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  // Unified logic for randomized standard patterns
  const variantParts = activeVariant.match(/^standard_missing_(start|second|middle|fourth|last)([+-])$/);

  if (variantParts) {
    const position = variantParts[1];
    const direction = variantParts[2];
    const isForward = direction === '+';
    
    // Step X can be 2 - 10
    const stepValue = Math.floor(Math.random() * 9) + 2; 
    const step = isForward ? stepValue : -stepValue;
    
    const posMap = { start: 0, second: 1, middle: 2, fourth: 3, last: 4 };
    const missingIdx = posMap[position];
    
    // Generate start to stay within 0-100 range for a 5-item sequence
    let start;
    if (isForward) {
      start = Math.floor(Math.random() * (100 - 4 * stepValue + 1));
    } else {
      start = Math.floor(Math.random() * (100 - 4 * stepValue + 1)) + (4 * stepValue);
    }
    
    const sequence = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
    const answer = String(sequence[missingIdx]);
    const items = sequence.map((val, idx) => idx === missingIdx ? "?" : String(val));
    
    // Generate 3 unique distractors within bounds that are not in the sequence
    const distractorsSet = new Set();
    while (distractorsSet.size < 3) {
      const offset = (Math.floor(Math.random() * 10) + 1) * (Math.random() > 0.5 ? 1 : -1);
      // Ensure candidate is not already in the sequence
      const candidate = parseInt(answer) + offset;
      if (candidate >= 0 && candidate <= 100 && !sequence.includes(candidate)) {
        distractorsSet.add(String(candidate));
      }
    }
    const options = isMCQ ? [answer, ...Array.from(distractorsSet)].sort(() => Math.random() - 0.5) : null;

    // Construct the explanation logic
    const isStart = missingIdx === 0;
    const prevNum = sequence[isStart ? 1 : missingIdx - 1];
    const solutionText = `The pattern is counting ${isForward ? 'on' : 'back'} by ${stepValue}. ${isStart ? `To find the first number, count ${isForward ? 'back' : 'on'} from ${prevNum}.` : ''} So, ${prevNum} ${isStart ? (isForward ? '-' : '+') : (isForward ? '+' : '-')} ${stepValue} = ${answer}.`;

    const hideVisual = isShort; // Visual is redundant if questionText contains the sequence
    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`What is the missing number in the skip counting pattern?`, `What is the missing number? ${items.join(', ')}`),
        options: options,
        hint: null,
        finalAnswer: answer,
        solutionSteps: getQText(solutionText, `${prevNum} ${isStart ? (isForward ? '-' : '+') : (isForward ? '+' : '-')} ${stepValue} = ${answer}.`)
      },
      visualEngine: {
        componentToRender: "NUMBER_PATTERN",
        componentData: { rule: isForward ? `+${stepValue}` : `-${stepValue}`, items: items, hideVisual: hideVisual }
      },
      inputRequirement: { inputType: inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
    STRICT: Use the [STORY] placeholder below to create a 1-sentence Singaporean math story (e.g., using names like Siti, items like curry puffs, and settings like an MRT station).
    The story MUST provide context for the sequence (e.g., Siti is packing an equal number of items into each bag). DO NOT reveal the specific number ${stepValue} in the story text.
    
    RETURN ONLY VALID JSON. DO NOT OMIT THE visualEngine DATA:
    ${JSON.stringify(promptObject).replace('What is', '[STORY] What is')}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: hideVisual }
    };
  }
}