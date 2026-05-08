import { numberToWords } from '@/lib/utils/math-helpers';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  // 1. GROWING PATTERN (Step-up Logic)
  if (activeVariant === 'advanced_growing_pattern') {
    const initialJump = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const growth = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const totalAdded = 4 * initialJump + 6 * growth; 
    const start = Math.floor(Math.random() * (101 - totalAdded));
    const sequence = [
      start,
      start + initialJump,
      start + initialJump + (initialJump + growth),
      start + initialJump + (initialJump + growth) + (initialJump + 2 * growth),
      start + initialJump + (initialJump + growth) + (initialJump + 2 * growth) + (initialJump + 3 * growth)
    ];
    const answer = String(sequence[4]);

    const lockedData = {
      meta: commonMeta,
      content: {
        questionText: "[STORY] Find the missing number at the end.",
        options: [answer, String(sequence[4] + growth), String(sequence[4] - initialJump), String(sequence[4] + 1)].sort(() => Math.random() - 0.5),
        finalAnswer: answer,
        solutionSteps: `The jumps are getting larger. We add ${initialJump}, then ${initialJump + growth}, then ${initialJump + 2 * growth}. The next jump should be ${initialJump + 3 * growth}. So, ${sequence[3]} + ${initialJump + 3 * growth} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NUMBER_PATTERN",
        componentData: { rule: `Growing (+${initialJump}, +${initialJump + growth}, +${initialJump + 2 * growth}...)`, items: [String(sequence[0]), String(sequence[1]), String(sequence[2]), String(sequence[3]), "?"], hideVisual: hideVisual }
      },
      inputRequirement: { inputType: inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT: Replace [STORY] with a 1-sentence localized Singaporean context about saving or collecting items (e.g., Siti is saving money). DO NOT mention the numbers, jump sizes, or the increasing logic in the story. \n${JSON.stringify(lockedData)}`,
      metadata: { difficulty: 'advanced', logic: "growing_step", hideVisual: hideVisual }
    };
  }

  // 3. INTERLEAVED SERIES (Two patterns in one)
  if (activeVariant === 'advanced_interleaved_series') {
    const startA = Math.floor(Math.random() * 30) + 10;
    const startB = Math.floor(Math.random() * 10) + 2;
    const stepA = Math.floor(Math.random() * 10) + 5; // 5 to 14
    const stepB = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const sequence = [startA, startB, startA + stepA, startB + stepB, startA + 2 * stepA, startB + 2 * stepB];
    
    const missingIdx = Math.random() > 0.5 ? 4 : 5;
    const answer = String(sequence[missingIdx]);
    const items = [String(sequence[0]), String(sequence[1]), String(sequence[2]), String(sequence[3]), String(sequence[4]), String(sequence[5])];
    items[missingIdx] = "?";

    const lockedData = {
      meta: commonMeta,
      content: {
        questionText: "[STORY] Look closely at the pattern. What is the missing number?",
        options: [answer, String(parseInt(answer) + 1), String(parseInt(answer) - 2), String(startA + startB)].sort(() => Math.random() - 0.5),
        finalAnswer: answer,
        solutionSteps: `This sequence has two patterns mixed together. Pattern 1 (1st, 3rd, 5th) counts by ${stepA}. Pattern 2 (2nd, 4th, 6th) counts by ${stepB}. The missing number follows ${missingIdx === 4 ? `Pattern 1: ${sequence[2]} + ${stepA} = ${answer}` : `Pattern 2: ${sequence[3]} + ${stepB} = ${answer}`}.`
      },
      visualEngine: {
        componentToRender: "NUMBER_PATTERN",
        componentData: { rule: "Interleaved Patterns", items: items, hideVisual: hideVisual }
      },
      inputRequirement: { inputType: inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT: Replace [STORY] with a 1-sentence localized Singaporean context involving two people (e.g., Ali and Raju comparing their stickers). DO NOT mention that there are two alternating patterns. \n${JSON.stringify(lockedData)}`,
      metadata: { difficulty: 'advanced', logic: "interleaved", hideVisual: hideVisual }
    };
  }

  // 4. SHRINKING PATTERN (Step-down logic)
  if (activeVariant === 'advanced_shrinking_pattern') {
    const initialJump = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const growth = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const totalSubtracted = 4 * initialJump + 6 * growth;
    const start = Math.floor(Math.random() * (101 - totalSubtracted)) + totalSubtracted;
    const sequence = [
      start,
      start - initialJump,
      start - initialJump - (initialJump + growth),
      start - initialJump - (initialJump + growth) - (initialJump + 2 * growth),
      start - initialJump - (initialJump + growth) - (initialJump + 2 * growth) - (initialJump + 3 * growth)
    ];
    const answer = String(sequence[4]);

    const lockedData = {
      meta: commonMeta,
      content: {
        questionText: "[STORY] Find the missing number at the end.",
        options: [answer, String(sequence[4] - growth), String(sequence[4] + initialJump), String(sequence[4] - 1)].sort(() => Math.random() - 0.5),
        finalAnswer: answer,
        solutionSteps: `The jumps are getting larger. We subtract ${initialJump}, then ${initialJump + growth}, then ${initialJump + 2 * growth}. The next jump should be ${initialJump + 3 * growth}. So, ${sequence[3]} - ${initialJump + 3 * growth} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NUMBER_PATTERN",
        componentData: { rule: `Shrinking (-${initialJump}, -${initialJump + growth}, -${initialJump + 2 * growth}...)`, items: [String(sequence[0]), String(sequence[1]), String(sequence[2]), String(sequence[3]), "?"], hideVisual: hideVisual }
      },
      inputRequirement: { inputType: inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT: Replace [STORY] with a 1-sentence localized Singaporean context about eating snacks or using items (e.g., Muthu is eating his crackers). DO NOT mention the numbers or the shrinking jump sizes in the story. \n${JSON.stringify(lockedData)}`,
      metadata: { difficulty: 'advanced', logic: "shrinking_step", hideVisual: hideVisual }
    };
  }

  // 5. DOUBLE DIGIT STEP (+11 or +12)
  if (activeVariant === 'advanced_double_digit_step') {
    const step = Math.random() > 0.5 ? 11 : 12;
    const start = Math.floor(Math.random() * 30) + 10;
    const sequence = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
    const answer = String(sequence[2]); // Missing middle

    const lockedData = {
      meta: commonMeta,
      content: {
        questionText: "[STORY] What number is missing in this pattern?",
        options: [answer, String(sequence[2] + 1), String(sequence[2] - 1), String(sequence[1] + 10)].sort(() => Math.random() - 0.5),
        finalAnswer: answer,
        solutionSteps: `The numbers increase by ${step} every time. ${sequence[1]} + ${step} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NUMBER_PATTERN",
        componentData: { rule: `+${step}`, items: [String(sequence[0]), String(sequence[1]), "?", String(sequence[3]), String(sequence[4])], hideVisual: hideVisual }
      },
      inputRequirement: { inputType: inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT: Replace [STORY] with a 1-sentence localized Singaporean context about buying items in groups or boxes (e.g., Siti is buying boxes of chicken wings). DO NOT reveal the specific number ${step}. \n${JSON.stringify(lockedData)}`,
      metadata: { difficulty: 'advanced', logic: "double_digit_step", hideVisual: hideVisual }
    };
  }

  // 6. BIG JUMP ALTERNATING (+20, -5)
  if (activeVariant === 'advanced_big_jump_alternating') {
    const j1Choices = [15, 20, 25, 30];
    const j2Choices = [-2, -3, -4, -5, -10];
    const j1 = j1Choices[Math.floor(Math.random() * j1Choices.length)];
    const j2 = j2Choices[Math.floor(Math.random() * j2Choices.length)];
    const maxJump = Math.max(j1, 2 * j1 + j2);
    const start = Math.floor(Math.random() * (100 - maxJump + 1));
    const sequence = [start, start + j1, start + j1 + j2, start + 2*j1 + j2, start + 2*j1 + 2*j2];
    const answer = String(sequence[3]); // Missing 4th

    const lockedData = {
      meta: commonMeta,
      content: {
        questionText: "[STORY] Find the missing number.",
        options: [answer, String(sequence[3] + Math.abs(j2)), String(sequence[3] - Math.abs(j2)), String(sequence[3] + 1)].sort(() => Math.random() - 0.5),
        finalAnswer: answer,
        solutionSteps: `The rule is to add ${j1}, then subtract ${Math.abs(j2)}. After ${sequence[2]}, we add ${j1} to get ${answer}.`
      },
      visualEngine: {
        componentToRender: "NUMBER_PATTERN",
        componentData: { rule: `+${j1}, ${j2}`, items: [String(sequence[0]), String(sequence[1]), String(sequence[2]), "?", String(sequence[4])], hideVisual: hideVisual }
      },
      inputRequirement: { inputType: inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT: Replace [STORY] with a 1-sentence localized Singaporean context about receiving an allowance and spending some of it. DO NOT reveal the numbers ${j1} or ${Math.abs(j2)} in the story. \n${JSON.stringify(lockedData)}`,
      metadata: { difficulty: 'advanced', logic: "big_alternating", hideVisual: hideVisual }
    };
  }

  // Alternating Patterns
  if (activeVariant === 'advanced_alt_plus_minus' || activeVariant === 'advanced_alt_plus_plus' || activeVariant === 'advanced_alt_missing_start' || activeVariant === 'advanced_alternating_rule') {
    let s0, j1, j2, missingIdx, sequence;
    
    if (activeVariant === 'advanced_alt_plus_minus') {
      s0 = Math.floor(Math.random() * 40) + 10;
      j1 = 3; j2 = -1; missingIdx = 3;
      sequence = [s0, s0 + j1, s0 + j1 + j2, s0 + j1 + j2 + j1, s0 + 2*j1 + j2]; // s0, s0+3, s0+2, s0+5, s0+4
    } else if (activeVariant === 'advanced_alt_plus_plus') {
      s0 = Math.floor(Math.random() * 40) + 10;
      j1 = 10; j2 = 2; missingIdx = 2;
      sequence = [s0, s0 + j1, s0 + j1 + j2, s0 + 2*j1 + j2, s0 + 2*j1 + 2*j2];
    } else if (activeVariant === 'advanced_alternating_rule') {
      s0 = Math.floor(Math.random() * 40) + 20;
      j1 = 5; j2 = -2; missingIdx = 2; // Hides 3rd number as requested
      sequence = [s0, s0 + j1, s0 + j1 + j2, s0 + 2*j1 + j2, s0 + 2*j1 + 2*j2];
    } else {
      s0 = Math.floor(Math.random() * 40) + 20;
      j1 = 5; j2 = -2; missingIdx = 0;
      sequence = [s0, s0 + j1, s0 + j1 + j2, s0 + 2*j1 + j2, s0 + 2*j1 + 2*j2];
    }

    const answer = String(sequence[missingIdx]);
    const items = sequence.map((val, idx) => (idx === missingIdx) ? "?" : String(val));

    // Generate distractors that are not directly part of the sequence or simple +/- step
    let distractors = [];
    while (distractors.length < 3) {
      let d = Math.floor(Math.random() * 10) + (parseInt(answer) - 5);
      if (d !== parseInt(answer) && !sequence.includes(d) && !distractors.includes(d) && d > 0) {
        distractors.push(String(d));
      }
    }
    const options = isMCQ ? [answer, ...distractors].sort(() => Math.random() - 0.5) : null;

    // Generate dynamic explanation based on missing position
    let solutionExplanation;
    if (missingIdx === 0) {
      solutionExplanation = `The first rule is ${j1 > 0 ? '+' : ''}${j1} and the second rule is ${j2 > 0 ? '+' : ''}${j2}. To find the first number, we count back from ${sequence[1]} using the opposite of the first rule. ${sequence[1]} - (${j1 > 0 ? '+' : ''}${j1}) = ${answer}.`;
    } else {
      const ruleName = (missingIdx % 2 === 0) ? "second" : "first";
      const ruleValue = (missingIdx % 2 === 0) ? j2 : j1;
      const prevNum = sequence[missingIdx - 1];
      solutionExplanation = `The first rule is ${j1 > 0 ? '+' : ''}${j1} and the second rule is ${j2 > 0 ? '+' : ''}${j2}. Following the ${ruleName} rule from ${prevNum}, ${prevNum} ${ruleValue > 0 ? '+' : ''}${ruleValue} = ${answer}.`;
    }

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`What is the missing number in this alternating number pattern?`, `What is the missing number? ${items.join(', ')}`),
        options: options,
        finalAnswer: answer,
        solutionSteps: getQText(solutionExplanation, `Rules: ${j1 > 0 ? '+' : ''}${j1}, ${j2 > 0 ? '+' : ''}${j2}. Missing: ${answer}.`)
      },
      visualEngine: {
        componentToRender: "NUMBER_PATTERN",
        componentData: { rule: `${j1},${j2}`, items: items, hideVisual: hideVisual }
      },
      inputRequirement: { inputType: inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
    STRICT: Use the [STORY] placeholder below to create a 1-sentence Singaporean math story (e.g., using names like Siti, items like curry puffs, and settings like an MRT station).
    The story MUST provide a simple context for the sequence (e.g., Siti is collecting items). DO NOT reveal the jump sizes, the rules, or any numbers in your story.
    
    RETURN ONLY VALID JSON. DO NOT OMIT THE visualEngine DATA:
    ${JSON.stringify(promptObject).replace('What is', '[STORY] What is')}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: hideVisual }
    };
  }
}