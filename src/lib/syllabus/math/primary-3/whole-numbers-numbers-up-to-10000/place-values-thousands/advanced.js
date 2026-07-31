import { getRandomNames } from '@/lib/utils/variable-bank';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let promptInstruction = "";
  const names = getRandomNames(2);

  if (activeVariant === 'advanced_decomposition') {
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    const num = (th * 1000) + (h * 100) + (t * 10) + o;
    
    promptInstruction = `- Create a question asking to decompose the number ${num} into thousands, hundreds, tens, and ones.\\n- The finalAnswer must explicitly show the correct breakdown (e.g., "${th} thousands, ${h} hundreds, ${t} tens, and ${o} ones").`;
  
  } else if (activeVariant === 'advanced_regrouping') {
    const baseTh = Math.floor(Math.random() * 7) + 1;
    const baseH = Math.floor(Math.random() * 8) + 1; 
    const baseT = Math.floor(Math.random() * 8) + 1; 
    const baseO = Math.floor(Math.random() * 8) + 1; 
    
    // Regroup 1 thousand to 10 hundreds, 1 hundred to 10 tens, and 1 ten to 10 ones
    const th = baseTh;
    const h = baseH + 10;
    const t = baseT + 10;
    const o = baseO + 10;
    const finalNum = (th * 1000) + (h * 100) + (t * 10) + o;
    
    promptInstruction = `- Create a question asking what number is formed by ${th} thousands, ${h} hundreds, ${t} tens, and ${o} ones.\\n- Mention that ${names[0]} is trying to figure this out.\\n- The finalAnswer must be just the numeral ${finalNum}.`;
    
  } else if (activeVariant === 'advanced_value_riddles') {
    const th = Math.floor(Math.random() * 4) + 1;
    const h = Math.floor(Math.random() * 4) + 1; 
    const diff = Math.floor(Math.random() * 4) + 1; 
    const t = h + diff; 
    const o = Math.floor(Math.random() * 9);
    const finalNum = (th * 1000) + (h * 100) + (t * 10) + o;
    
    promptInstruction = `- Create a word riddle for a mystery 4-digit number using EXACTLY these clues:\\n  1. The thousands digit is ${th}.\\n  2. The hundreds digit is ${h}.\\n  3. The tens digit is ${diff} more than the hundreds digit.\\n  4. The ones digit is ${o}.\\n- The finalAnswer must be just the numeral ${finalNum}.`;
    
  } else if (activeVariant === 'advanced_difference_between_values') {
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 9) + 1;
    const num = (th * 1000) + (h * 100) + (t * 10) + o;
    
    const isSum = Math.random() > 0.5;
    const valTh = th * 1000;
    const valT = t * 10;
    const result = isSum ? valTh + valT : valTh - valT;
    const operation = isSum ? "sum" : "difference";
    
    promptInstruction = `- Create a question asking for the ${operation} between the values of the digit ${th} and the digit ${t} in the number ${num}.\\n- The finalAnswer must be just the numeral ${result}.`;
    
  } else if (activeVariant === 'advanced_forming_numbers') {
    const d1 = Math.floor(Math.random() * 4) + 1; 
    const d2 = Math.floor(Math.random() * 4) + 5; 
    const d3 = [1, 3, 5, 7, 9][Math.floor(Math.random() * 5)]; 
    const d4 = [0, 2, 4, 6, 8][Math.floor(Math.random() * 5)]; 
    const digits = [d1, d2, d3, d4];
    
    let validCombinations = [];
    digits.forEach((th, i) => {
      if (th !== 0) {
        let remaining1 = digits.filter((_, idx) => idx !== i);
        remaining1.forEach((h, j) => {
          let remaining2 = remaining1.filter((_, idx) => idx !== j);
          remaining2.forEach((t, k) => {
            let o = remaining2.filter((_, idx) => idx !== k)[0];
            if (o % 2 === 0) {
              validCombinations.push(th * 1000 + h * 100 + t * 10 + o);
            }
          });
        });
      }
    });
    
    let smallestEven = Math.min(...validCombinations);
    
    promptInstruction = `- Create a question asking to use the digits ${digits.join(', ')} to form the smallest even 4-digit number.\\n- The finalAnswer must be just the numeral ${smallestEven}.`;
  }

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Place Values (Thousands).
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
${promptInstruction}
- Number range: up to 10000.
- If MCQ, provide 4 options.
- Ensure the math strictly matches the instructions above.

${getFormatInstructions()}`;

  return {
    aiPrompt: aiPrompt
  };
}
