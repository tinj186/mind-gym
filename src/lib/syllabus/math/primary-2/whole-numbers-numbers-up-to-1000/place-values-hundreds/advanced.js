import { getRandomNames } from '@/lib/utils/variable-bank';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let promptInstruction = "";
  const names = getRandomNames(2);

  if (activeVariant === 'advanced_decomposition') {
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    const num = (h * 100) + (t * 10) + o;
    
    promptInstruction = `- Create a question asking to decompose the number ${num} into hundreds, tens, and ones.\\n- The finalAnswer must explicitly show the correct breakdown (e.g., "${h} hundreds, ${t} tens, and ${o} ones" or "${h} hundreds, ${t} tens, ${o} ones").`;
  
  } else if (activeVariant === 'advanced_regrouping') {
    const baseH = Math.floor(Math.random() * 7) + 1; 
    const baseT = Math.floor(Math.random() * 8) + 1; 
    const baseO = Math.floor(Math.random() * 8) + 1; 
    
    // Regroup 1 hundred to 10 tens, and 1 ten to 10 ones
    const h = baseH;
    const t = baseT + 10;
    const o = baseO + 10;
    const finalNum = (h * 100) + (t * 10) + o;
    
    promptInstruction = `- Create a question asking what number is formed by ${h} hundreds, ${t} tens, and ${o} ones.\\n- Mention that ${names[0]} is trying to figure this out.\\n- The finalAnswer must be just the numeral ${finalNum}.`;
    
  } else if (activeVariant === 'advanced_value_riddles') {
    const h = Math.floor(Math.random() * 4) + 1; 
    const diff = Math.floor(Math.random() * 4) + 1; 
    const t = h + diff; 
    const o = Math.floor(Math.random() * 9);
    const finalNum = (h * 100) + (t * 10) + o;
    
    promptInstruction = `- Create a word riddle for a mystery 3-digit number using EXACTLY these clues:\\n  1. The hundreds digit is ${h}.\\n  2. The tens digit is ${diff} more than the hundreds digit.\\n  3. The ones digit is ${o}.\\n- The finalAnswer must be just the numeral ${finalNum}.`;
    
  } else if (activeVariant === 'advanced_difference_between_values') {
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 9) + 1;
    const num = (h * 100) + (t * 10) + o;
    
    const isSum = Math.random() > 0.5;
    const valH = h * 100;
    const valO = o;
    const result = isSum ? valH + valO : valH - valO;
    const operation = isSum ? "sum" : "difference";
    
    promptInstruction = `- Create a question asking for the ${operation} between the values of the digit ${h} and the digit ${o} in the number ${num}.\\n- The finalAnswer must be just the numeral ${result}.`;
    
  } else if (activeVariant === 'advanced_forming_numbers') {
    const d1 = Math.floor(Math.random() * 4) + 1; 
    const d2 = Math.floor(Math.random() * 4) + 5; 
    const d3 = [0, 2, 4, 6, 8][Math.floor(Math.random() * 5)]; 
    const digits = [d1, d2, d3];
    
    // Sort to find smallest even
    // To ensure a valid 3 digit smallest even, we need a non-zero hundreds digit.
    // Since d1 and d2 are non-zero, we can always form a 3 digit number.
    // The smallest even number means the last digit must be even.
    let evens = digits.filter(d => d % 2 === 0);
    // Since d3 is always even, evens is not empty.
    let validCombinations = [];
    digits.forEach((h, i) => {
      if (h !== 0) {
        let remaining1 = digits.filter((_, idx) => idx !== i);
        remaining1.forEach((t, j) => {
          let o = remaining1.filter((_, idx) => idx !== j)[0];
          if (o % 2 === 0) {
            validCombinations.push(h * 100 + t * 10 + o);
          }
        });
      }
    });
    
    let smallestEven = Math.min(...validCombinations);
    
    promptInstruction = `- Create a question asking to use the digits ${digits.join(', ')} to form the smallest even 3-digit number.\\n- The finalAnswer must be just the numeral ${smallestEven}.`;
  }

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Place Values (Hundreds).
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
${promptInstruction}
- Number range: up to 1000.
- If MCQ, provide 4 options.
- Ensure the math strictly matches the instructions above.

${getFormatInstructions()}`;

  return {
    aiPrompt: aiPrompt
  };
}
