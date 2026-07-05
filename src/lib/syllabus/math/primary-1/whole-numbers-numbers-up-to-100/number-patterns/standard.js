import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomNames } from '@/lib/utils/variable-bank';
export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

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
    
    let defectMap = null;
    let options = null;
    if (isMCQ) {
      const wrongDirection = parseInt(answer) + (isForward ? -stepValue : stepValue);
      const distractorsSet = new Set();
      if (!sequence.includes(wrongDirection)) {
        distractorsSet.add(String(wrongDirection));
      }
      while (distractorsSet.size < 3) {
        const offset = (Math.floor(Math.random() * 10) + 1) * (Math.random() > 0.5 ? 1 : -1);
        const candidate = parseInt(answer) + offset;
        if (candidate >= 0 && candidate <= 100 && !sequence.includes(candidate)) {
          distractorsSet.add(String(candidate));
        }
      }
      options = [answer, ...Array.from(distractorsSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(wrongDirection)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    // Construct the explanation logic
    const isStart = missingIdx === 0;
    const prevNum = sequence[isStart ? 1 : missingIdx - 1];
    const solutionSteps = `1. The pattern is counting ${isForward ? 'on' : 'back'} by ${stepValue}.\\n2. ${isStart ? `To find the first number, count ${isForward ? 'back' : 'on'} from ${prevNum}.` : `The number before the missing one is ${prevNum}.`}\\n3. ${prevNum} ${isStart ? (isForward ? '-' : '+') : (isForward ? '+' : '-')} ${stepValue} = ${answer}.`;

    const questionTextTemplate = getQText(`What is the missing number in the skip counting pattern?`, `What is the missing number? ${items.join(', ')}`);
    const localName = getRandomNames(1);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol. ${formatInstructions}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify(options) : 'null'},
          "defectMap": ${defectMap ? JSON.stringify(defectMap) : (typeof answer === 'string' && !isNaN(parseInt(answer)) ? JSON.stringify({ [String(parseInt(answer) + 1)]: "CARELESS_CALCULATION", [String(parseInt(answer) - 1)]: "CARELESS_CALCULATION", [String(parseInt(answer) + 10)]: "CARELESS_CALCULATION", [typeof wrongOpAnswer !== 'undefined' ? wrongOpAnswer : '9999']: "CONFUSED_OPERATION" }) : 'null')},
          "hint": "Check the jump between the numbers you can see.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${solutionSteps}"
        },
        "visualEngine": {
          "componentToRender": "NUMBER_PATTERN",
          "componentData": { "rule": "${isForward ? '+' : '-'}${stepValue}", "sequence": ${JSON.stringify(items)} }
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }
}