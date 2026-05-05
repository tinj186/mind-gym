import { numberToWords } from '@/lib/utils/math-helpers';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon) {
  // ==========================================
  // FOUNDATION LEVEL
  // ==========================================

  // 1. Grouping Tens and Ones
  if (activeVariant === 'foundation_grouping') {
    const tens = Math.floor(Math.random() * 4) + 2; // 2 to 5 tens (20-59 items total)
    const ones = Math.floor(Math.random() * 9) + 1; // 1 to 9 ones
    const total = (tens * 10) + ones;

    const groups = Array(tens).fill(10);
    if (ones > 0) groups.push(ones);

    const askForWord = Math.random() > 0.5;
    
    const expectedAnswer = askForWord ? numberToWords(total) : String(total);
    const optionValues = [total - 10, total - 1, total, total + 1];
    const formattedOptions = askForWord 
      ? optionValues.map(v => numberToWords(v)) 
      : optionValues.map(v => String(v));

    const promptInstruction = askForWord 
      ? "Ask the student to count the items and write the number in WORDS (e.g., 'thirty-four')." 
      : "Ask the student to count the items and write the number in NUMERALS (e.g., '34').";

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} story. You MUST use the name ${context.name} and the item ${selectedContextItem}. The setting should be ${context.setting}.\nYou are an expert Primary 1 math question generator.\n MATH CONSTRAINTS:\n - Topic: Counting to 100 (Foundation Level - Tens and Ones)\n - Setup: There are ${total} items in total.\n - Question: ${promptInstruction}\n - Final Answer MUST strictly be: "${expectedAnswer}"\n ${formatInstructions}\n CRITICAL VISUAL RULE: DO NOT modify the "visualEngine" block below. You MUST copy the "totalItems" number and the "items" array exactly as provided in the template. Do not change them to match the final answer.\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('[Insert full localized Singaporean word problem here]', `Count the ${selectedContextItem}s. Write the total amount ${askForWord ? 'in words' : 'in numerals'}.`))},
          "options": ${isMCQ ? JSON.stringify(formattedOptions) : 'null'},
          "finalAnswer": "${expectedAnswer}",
          "solutionSteps": ${JSON.stringify(`There are ${tens} groups of ten (${tens * 10}) and ${ones} ones. Total is ${total}.`)}
        },
        "visualEngine": {
          "componentToRender": "GROUPING_WORKSPACE",
          "componentData": {
            "mode": "GROUPING",
            "targetGroupSize": 10,
            "items": ${JSON.stringify(Array(total).fill(selectedIcon))},
            "totalItems": ${total},
            "icon": "${selectedIcon}"
          }
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "base_ten_grouping", hideVisual: false }
    };
  }

  // 2. Simple Sequence
  if (activeVariant === 'foundation_sequence') {
    const start = Math.floor(Math.random() * 60) + 20;
    const isForward = Math.random() > 0.5;
    const step = isForward ? 1 : -1;
    const sequence = [start, start + step, start + (step * 2), "___"];
    const answer = String(start + (step * 3));
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math question generator.\n MATH CONSTRAINTS:\n - Topic: Counting to 100 (Foundation Level - Number Sequence)
      - Sequence: ${sequence.join(", ")}
      - Final Answer MUST strictly be: "${answer}"
      
      ${formatInstructions}
      
      CRITICAL VISUAL RULE: DO NOT modify the "visualEngine" block below. You MUST copy the "sequence" array and the "rule" string exactly as provided in the template. Do not change them to match the final answer.\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('Look at the numbers: ' + sequence.join(", ") + '. What number comes next?', sequence.slice(0, 3).join(", ") + ", ?"))},
          "options": ${isMCQ ? JSON.stringify([parseInt(answer) - 2, parseInt(answer) - 1, parseInt(answer), parseInt(answer) + 1].map(String)) : 'null'},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(`The numbers are counting ${isForward ? 'on' : 'back'} by 1. After ${sequence[2]}, the next number is ${answer}.`)}
        },
        "visualEngine": {
          "componentToRender": "NUMBER_PATTERN",
          "componentData": {
            "sequence": ["${sequence[0]}", "${sequence[1]}", "${sequence[2]}", "?"],
            "rule": "${isForward ? '+' : '-'}1"
          }
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "simple_sequence", hideVisual: false }
    };
  }

  throw new Error(`Variant '${activeVariant}' logic block not implemented in foundation.js.`);
}