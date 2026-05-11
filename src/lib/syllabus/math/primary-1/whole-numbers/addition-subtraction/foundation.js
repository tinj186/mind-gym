import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';
  const isShortQ = zodType === 'SHORT_QUESTION';

  const levelNum = parseInt(level.replace('Primary ', ''));
  const readingMandate = levelNum <= 2 
    ? "STRICT READING LEVEL: Use sentences with maximum 10-12 words. Use simple nouns and verbs (Sight Words). No words with more than 2 syllables."
    : (levelNum >= 5 
        ? "ADVANCED READING LEVEL: You may use complex sentences and technical Singaporean context (e.g., GST, interest rates, or logistics). Use a professional, descriptive tone."
        : "");

  // Safety check for localization context
  const itemLabel = selectedContextItem?.item || 'items';

  // 1. Foundation Addition/Subtraction within 20
  if (activeVariant === 'foundation_add_20' || activeVariant === 'foundation_sub_20') {
    const isAdd = activeVariant.includes('add');
    const num1 = isAdd ? Math.floor(Math.random() * 6) + 6 : Math.floor(Math.random() * 8) + 12; 
    const num2 = isAdd ? Math.floor(Math.random() * 6) + 3 : Math.floor(Math.random() * 5) + 2;
    const answer = isAdd ? String(num1 + num2) : String(num1 - num2);
    const operator = isAdd ? '+' : '-';

    const options = isMCQ ? [answer, String(parseInt(answer) + 1), String(parseInt(answer) - 1), String(parseInt(answer) + 2)].sort(() => Math.random() - 0.5) : null;

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many ${isAdd ? 'altogether' : 'are left'}?`, `${num1} ${operator} ${num2} = ?`), // Use getQText
        options: options,
        finalAnswer: answer,
        solutionSteps: `${num1} ${operator} ${num2} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE", // Short questions (equations) get cards, word problems (stories) do not
        componentData: { items: [String(num1), operator, String(num2)], hideVisual: isShortQ } // hideVisual should be true if componentToRender is NONE
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}You are a text editor. 
      STRICT: Replace the "[STORY]" tag in the questionText with a 1-sentence Singaporean story about ${context.name} having ${num1} ${itemLabel} and ${isAdd ? 'getting' : 'giving away'} ${num2} more.
      ${isShortQ 
        ? 'DO NOT add a story for Short Questions.' 
        : `The story MUST be localized (e.g., using names like Siti and settings like a hawker centre) and include the numbers ${num1} and ${num2}.`
      }
      
      RETURN ONLY VALID JSON:
      ${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'foundation', 
        steps: 1, 
        logic: isAdd ? "add_20" : "sub_20", 
        hideVisual: isShortQ 
      }
    };
  }

  // 2. Foundation Missing Addend
  if (activeVariant === 'foundation_missing_addend') {
    const sum = Math.floor(Math.random() * 10) + 10; // 10-19
    const part = Math.floor(Math.random() * (sum - 4)) + 2; 
    const answer = String(sum - part);
    const isFirstMissing = Math.random() > 0.5;
    
    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many more does ${context.name} need?`, isFirstMissing ? `? + ${part} = ${sum}` : `${part} + ? = ${sum}`), // Use getQText
        options: isMCQ ? [answer, String(sum), String(part), String(sum + 1)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: `To find the missing part, subtract the known part from the whole: ${sum} - ${part} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: { items: isFirstMissing ? ["?", "+", String(part), "=", String(sum)] : [String(part), "+", "?", "=", String(sum)], hideVisual: isShortQ }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}You are a text editor. 
      STRICT: Replace the "[STORY]" tag in the questionText with a 1-sentence Singaporean story where ${context.name} has ${part} ${itemLabel} but needs ${sum} in total.
      
      ${isShortQ ? 'DO NOT add a story for Short Questions.'         : `The story MUST be localized (e.g., using names like Ahmad and settings like a playground) and include the numbers ${part} and ${sum}.`}

      
      RETURN ONLY VALID JSON:
      ${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'foundation', 
        steps: 1, 
        logic: "missing_addend", 
        hideVisual: isShortQ 
      }
    };
  }

  // 3. Foundation Number Bond Logic
  if (activeVariant === 'foundation_number_bond_logic') {
    const whole = Math.floor(Math.random() * 9) + 11; // 11-19
    const part1 = Math.floor(Math.random() * (whole - 4)) + 2; 
    const part2 = whole - part1;

    // Randomize missing position: 0 = Top, 1 = Left, 2 = Right
    const missingPos = Math.floor(Math.random() * 3);
    let answer, qTextSuffix, solutionSteps, visualData;

    if (missingPos === 0) {
      answer = String(whole);
      qTextSuffix = "What is the missing number?";
      solutionSteps = `${part1} + ${part2} = ${whole}.`;
      visualData = { whole: "?", part1: String(part1), part2: String(part2), hideVisual: false };
    } else if (missingPos === 1) {
      answer = String(part1);
      qTextSuffix = "What is the missing number?";
      solutionSteps = `${whole} - ${part2} = ${part1}.`;
      visualData = { whole: String(whole), part1: "?", part2: String(part2), hideVisual: false };
    } else {
      answer = String(part2);
      qTextSuffix = "What is the missing number?";
      solutionSteps = `${whole} - ${part1} = ${part2}.`;
      visualData = { whole: String(whole), part1: String(part1), part2: "?", hideVisual: false };
    }
    
    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] ${qTextSuffix}`, missingPos === 0 ? "Find the missing whole in the number bond." : `Find the missing part in the number bond for ${whole}.`),
        options: isMCQ ? [answer, String(whole), String(part1), String(parseInt(answer) + 1)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: solutionSteps
      },
      visualEngine: {
        componentToRender: "NUMBER_BOND", // Always show number bonds for this variant
        componentData: visualData
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}You are a text editor. 
      STRICT: Replace the "[STORY]" tag in the questionText with a 1-sentence Singaporean story.
      ${missingPos === 0
        ? `The story should be about ${context.name} having ${part1} ${itemLabel} and ${part2} ${itemLabel} and combining them.`
        : `The story should be about ${context.name} splitting ${whole} ${itemLabel} into two groups, where one has ${missingPos === 1 ? part2 : part1}.`
      }
      
      ${isShortQ ? 'DO NOT add a story for Short Questions.'         : `The story MUST be localized (e.g., using names like Wei Ling and settings like a library) and include the relevant numbers.`}

      
      RETURN ONLY VALID JSON:
      ${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'foundation', 
        steps: 1, 
        logic: "number_bond", 
        hideVisual: false 
      }
    };
  }
}