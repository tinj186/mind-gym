import { numberToWords } from '@/lib/utils/math-helpers';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  if (activeVariant === 'foundation_compare_two') {
    const num1 = Math.floor(Math.random() * 80) + 10;
    let num2;
    do { num2 = Math.floor(Math.random() * 80) + 10; } while (num1 === num2);
    
    const askGreater = Math.random() > 0.5;
    const answer = askGreater ? String(Math.max(num1, num2)) : String(Math.min(num1, num2));
    const targetWord = askGreater ? "greater" : "smaller"; // Renamed from targetWord to targetWord
    const options = isMCQ ? [String(num1), String(num2), String(Math.max(num1, num2) + 10), String(Math.min(num1, num2) - 5)] : null;

    const questionText = getQText(`Look at the number cards. Which number is ${targetWord}?`, `Which is ${targetWord}: ${num1} or ${num2}?`);
    const solutionSteps = getQText(`Comparing the tens and ones, ${answer} is the ${targetWord} number.`, `${answer} is the ${targetWord} number.`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Compare 2 Numbers\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
          componentData: { items: [`${num1}`, `${num2}`], hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: "compare_two", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'foundation_greatest_three' || activeVariant === 'foundation_smallest_three') {
    const askGreatest = activeVariant === 'foundation_greatest_three';
    const nums = [];
    while(nums.length < 3) {
      const n = Math.floor(Math.random() * 80) + 10;
      if (!nums.includes(n)) nums.push(n);
    }
    
    const targetWord = askGreatest ? "greatest" : "smallest";
    const answer = String(askGreatest ? Math.max(...nums) : Math.min(...nums));
    
    let distractor;
    do { 
       distractor = Math.floor(Math.random() * 80) + 10; 
    } while (nums.includes(distractor) || (askGreatest && distractor > Math.max(...nums)) || (!askGreatest && distractor < Math.min(...nums)));

    const options = isMCQ ? [String(nums[0]), String(nums[1]), String(nums[2]), String(distractor)] : null;

    const questionText = getQText(`Look at the number cards. Which is the ${targetWord} number?`, `Which is the ${targetWord}: ${nums[0]}, ${nums[1]}, or ${nums[2]}?`);
    const solutionSteps = getQText(`Looking at the numbers ${nums.join(', ')}, the ${targetWord} one is ${answer}.`, `${answer} is the ${targetWord}.`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Identify ${targetWord}\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
          componentData: { items: [`${nums[0]}`, `${nums[1]}`, `${nums[2]}`], hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: askGreatest ? "greatest_3" : "smallest_3", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'foundation_next_number') {
    const num = Math.floor(Math.random() * 88) + 10; // 10 to 97
    const answer = String(num + 1);
    const options = isMCQ ? [String(num - 1), answer, String(num + 10), String(num)] : null;

    const questionText = getQText(`Look at the number cards. What number comes just after ${num}?`, `What number comes after ${num}?`);
    const solutionSteps = getQText(`The number that comes right after ${num} when counting is ${answer}.`, `${num} + 1 = ${answer}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Number Sequence (After)\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
          componentData: { items: [`${num}`, "?"] , hideVisual: hideVisual}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: "next_number", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'foundation_before_number') {
    const num = Math.floor(Math.random() * 88) + 11; // 11 to 98
    const answer = String(num - 1);
    const options = isMCQ ? [String(num + 1), answer, String(num - 10), String(num)] : null;

    const questionText = getQText(`Look at the number cards. What number comes just before ${num}?`, `What number comes before ${num}?`);
    const solutionSteps = getQText(`The number that comes right before ${num} when counting is ${answer}.`, `${num} - 1 = ${answer}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Number Sequence (Before)\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
          componentData: { items: ["?", `${num}`], hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: "before_number", hideVisual: hideVisual }
    };
  }
}