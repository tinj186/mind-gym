import { generateFoundation } from './money-notation/foundation';
import { generateStandard } from './money-notation/standard';
import { generateAdvanced } from './money-notation/advanced';

export const moneyNotationBlueprint = {
  id: 'Primary 2-Money - Money-Money Notation (Decimals)',
  tierConstraints: {
    foundation: {
      name: 'Identifying and Writing Notation',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Writing simple cents or dollars/cents in decimal notation. Matching words to numerals."
    },
    standard: {
      name: 'Standard Formats',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Formatting large amounts, fixing poorly formatted decimals, multi-step extracting."
    },
    advanced: {
      name: 'Deducing Notation',
      steps: 3,
      maxNumber: 1000,
      logicDescription: "Multi-step logic: calculating a result then outputting in notation, or summing worded amounts."
    }
  },

  variants: {
    // Foundation Tier (5 variants)
    foundation_cents_to_decimal: "Write a simple cents amount in decimal notation (e.g., 65¢ -> $0.65).",
    foundation_dollars_cents_to_decimal: "Combine dollars and cents into decimal notation (e.g., 2 dollars and 15 cents -> $2.15).",
    foundation_numeral_to_word_simple: "Identify the word form of a simple amount (e.g., $1.20 -> One dollar and twenty cents).",
    foundation_word_to_numeral_simple: "Write the numeral form from a simple word phrase (e.g., Five dollars and five cents -> $5.05).",
    foundation_extract_dollars_cents: "Extract the dollar and cent parts from decimal notation (e.g., In $4.50, there are __ dollars and __ cents).",

    // Standard Tier (5 variants)
    standard_word_to_numeral_large: "Write the numeral form of a larger amount from a word problem.",
    standard_numeral_to_word_large: "Write large amounts in words (e.g., $105.40 -> One hundred and five dollars and forty cents).",
    standard_correct_formatting: "Given an improperly formatted amount like $4.5, recognize it must be written as $4.50.",
    standard_combined_extraction: "Given a worded amount, extract dollars and cents, then write the final numeral.",
    standard_deduce_notation_simple: "Word problem: 3 ten-dollar notes and 5 ten-cent coins. Write total in decimal notation.",

    // Advanced Tier (5 variants)
    advanced_deduce_notation_calculation: "Deduce the correct notation after a word problem calculation.",
    advanced_complex_word_to_numeral: "Convert a complex word phrase to numerals.",
    advanced_sum_worded_amounts: "Sum two worded amounts and write the answer in numerals.",
    advanced_difference_worded_amounts: "Subtract a worded amount from another and write in numerals.",
    advanced_fill_in_the_blanks: "Identify the missing dollar or cent value to match a worded phrase."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_cents_to_decimal', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    let finalDifficulty = difficulty;
    let finalVariant = variant;

    if (typeof difficulty === 'string' && difficulty.includes('_')) {
      finalVariant = difficulty;
      finalDifficulty = variant || 'standard';
    }

    let activeVariant = finalVariant;

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 2';
    const topic = 'Money - Money';
    const subtopic = 'Money Notation (Decimals)';

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON. Focus on reading and writing money using decimal notation ($XX.XX).`;

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}`
      : `Format as Short Answer. The "options" field in your JSON should be null.${hintProtocol}`;

    // Dispatch to tier files
    if (finalDifficulty.toLowerCase() === 'foundation' || activeVariant.startsWith('foundation_')) {
      return generateFoundation(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions);
    } else if (finalDifficulty.toLowerCase() === 'advanced' || activeVariant.startsWith('advanced_')) {
      return generateAdvanced(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions);
    } else {
      return generateStandard(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions);
    }
  }
};
