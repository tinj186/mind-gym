import { generateFoundation } from './money-conversion/foundation';
import { generateStandard } from './money-conversion/standard';
import { generateAdvanced } from './money-conversion/advanced';

const getFormatInstructions = (inputRequirementStr, isMCQ) => {
  const visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  return `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "Primary 2",
    "topic": "Money - Money",
    "subtopic": "Money Conversion (Cents/Decimals)",
    "type": "${isMCQ === 'true' ? 'MCQ' : (inputRequirementStr ? 'Structured' : 'Short Question')}"
  },
  "content": {
    "questionText": ["string (Line 1)", "string (Line 2)"] (Array of strings for the full question text. Break into multiple lines if needed.),
    "options": ["string", "string", "string", "string"] (ONLY if MCQ, otherwise empty array),
    "defectMap": { "distractor1": "Error category", "distractor2": "Error category" } (ONLY if MCQ, otherwise empty object),
    "hint": "string (Pedagogical hint)",
    "solutionSteps": "string (step-by-step model solution. You MUST separate steps using the exact characters \\\\n inside the string. Formatted strictly as a numbered list 1. ..., 2. ..., 3. ...)",
    "finalAnswer": "string (The exact final answer)"
  },
  "visualEngine": ${visualEngineStr}${inputRequirementStr ? `,\n  "inputRequirement": ${inputRequirementStr}` : ''}
}`;
};

export const moneyConversionBlueprint = {
  id: 'Primary 2-Money - Money-Money Conversion (Cents/Decimals)',
  name: 'Money Conversion (Cents/Decimals)',
  description: 'Convert money between cents and decimals, including worded amounts.',

  variants: {
    // Foundation Tier (5 variants)
    foundation_cents_to_decimals: "Convert simple cents amount (< 100¢) to decimals (e.g., 65¢ -> $0.65).",
    foundation_decimals_to_cents: "Convert simple decimal amount (< $1.00) to cents (e.g., $0.54 -> 54¢).",
    foundation_cents_to_decimals_large: "Convert large cents amount (> 100¢) to decimals (e.g., 150¢ -> $1.50).",
    foundation_decimals_to_cents_large: "Convert large decimal amount (> $1.00) to cents (e.g., $2.05 -> 205¢).",
    foundation_worded_to_decimals: "Convert word string to decimals (e.g., 'four dollars and fifty cents' -> $4.50).",

    // Standard Tier (5 variants)
    standard_worded_to_cents: "Convert worded amount directly to pure cents (e.g., 'three dollars and twenty cents' -> 320¢).",
    standard_decimals_to_worded: "Convert decimal amount to worded string (e.g., $5.40 -> 'five dollars and forty cents').",
    standard_cents_to_worded: "Convert pure cents to worded string (e.g., 405¢ -> 'four dollars and five cents').",
    standard_part_cents_part_dollars: "Convert mixed numeral representation (e.g., 2 dollars and 45 cents -> $2.45).",
    standard_convert_and_compare: "Convert to dollars, then compare (e.g., Convert 250¢ to dollars. Is it greater than $2.00?).",

    // Advanced Tier (5 variants)
    advanced_sum_and_convert: "Add mixed units and output in decimals (e.g., $1.20 + 45¢ = $1.65).",
    advanced_change_conversion: "Subtract mixed units to find change in decimals (e.g., You have $5.00, spend 120¢, how much left in decimals?).",
    advanced_missing_cents: "Find missing cents component (e.g., $3.50 = 3 dollars and __ cents).",
    advanced_convert_large_amount: "Convert very large amount (e.g., 1250¢ -> $12.50).",
    advanced_multi_step_conversion: "Convert coin denominations to total dollars (e.g., You have 5 fifty-cent coins. How much in dollars?)."
  },
  
  generate(difficulty = 'foundation', variant, type) {
    const safeType = String(type).toLowerCase();
    const isMCQ = safeType.includes('mcq');
    let isShort = safeType.includes('short');
    let isStructure = safeType.includes('structure') || safeType.includes('structured');
    
    // Foundation variants do not have multi-step logic. Downgrade to Short Answer if requested as Structure.
    if (difficulty.toLowerCase() === 'foundation' && isStructure) {
      isStructure = false;
      isShort = true;
    }
    
    // Default variants per difficulty level
    const foundationVariants = [
      'foundation_cents_to_decimals',
      'foundation_decimals_to_cents',
      'foundation_cents_to_decimals_large',
      'foundation_decimals_to_cents_large',
      'foundation_worded_to_decimals'
    ];
    
    const standardVariants = [
      'standard_worded_to_cents',
      'standard_decimals_to_worded',
      'standard_cents_to_worded',
      'standard_part_cents_part_dollars',
      'standard_convert_and_compare'
    ];
    
    const advancedVariants = [
      'advanced_sum_and_convert',
      'advanced_change_conversion',
      'advanced_missing_cents',
      'advanced_convert_large_amount',
      'advanced_multi_step_conversion'
    ];

    let activeVariant = variant;
    if (!activeVariant) {
      if (difficulty.toLowerCase() === 'foundation') {
        activeVariant = foundationVariants[Math.floor(Math.random() * foundationVariants.length)];
      } else if (difficulty.toLowerCase() === 'standard') {
        let pool = standardVariants;
        if (isStructure) {
          pool = ['standard_worded_to_cents', 'standard_convert_and_compare'];
        }
        activeVariant = pool[Math.floor(Math.random() * pool.length)];
      } else if (difficulty.toLowerCase() === 'advanced') {
        activeVariant = advancedVariants[Math.floor(Math.random() * advancedVariants.length)];
      }
    }

    // Generation Engine might pass in a variant that doesn't support Structure due to its own random pool logic.
    // If we are in Standard and the requested variant doesn't support Structure, force it to one that does.
    if (difficulty.toLowerCase() === 'standard' && isStructure) {
      const validStructured = ['standard_worded_to_cents', 'standard_convert_and_compare'];
      if (!validStructured.includes(activeVariant)) {
        activeVariant = validStructured[Math.floor(Math.random() * validStructured.length)];
      }
    }

    let logicVariant = '';
    
    // Foundation descriptions
    if (activeVariant === 'foundation_cents_to_decimals') logicVariant = 'Convert simple cents amount (< 100¢) to decimals (e.g., 65¢ -> $0.65).';
    else if (activeVariant === 'foundation_decimals_to_cents') logicVariant = 'Convert simple decimal amount (< $1.00) to cents (e.g., $0.54 -> 54¢).';
    else if (activeVariant === 'foundation_cents_to_decimals_large') logicVariant = 'Convert large cents amount (> 100¢) to decimals (e.g., 150¢ -> $1.50).';
    else if (activeVariant === 'foundation_decimals_to_cents_large') logicVariant = 'Convert large decimal amount (> $1.00) to cents (e.g., $2.05 -> 205¢).';
    else if (activeVariant === 'foundation_worded_to_decimals') logicVariant = 'Convert word string to decimals (e.g., "four dollars and fifty cents" -> $4.50).';
    
    // Standard descriptions
    else if (activeVariant === 'standard_worded_to_cents') logicVariant = 'Convert worded amount directly to pure cents (e.g., "three dollars and twenty cents" -> 320¢).';
    else if (activeVariant === 'standard_decimals_to_worded') logicVariant = 'Convert decimal amount to worded string (e.g., $5.40 -> "five dollars and forty cents").';
    else if (activeVariant === 'standard_cents_to_worded') logicVariant = 'Convert pure cents to worded string (e.g., 405¢ -> "four dollars and five cents").';
    else if (activeVariant === 'standard_part_cents_part_dollars') logicVariant = 'Convert mixed numeral representation (e.g., 2 dollars and 45 cents -> $2.45).';
    else if (activeVariant === 'standard_convert_and_compare') logicVariant = 'Convert to dollars, then compare (e.g., Convert 250¢ to dollars. Is it greater than $2.00?).';
    
    // Advanced descriptions
    else if (activeVariant === 'advanced_sum_and_convert') logicVariant = 'Add mixed units and output in decimals (e.g., $1.20 + 45¢ = $1.65).';
    else if (activeVariant === 'advanced_change_conversion') logicVariant = 'Subtract mixed units to find change in decimals (e.g., You have $5.00, spend 120¢, how much left in decimals?).';
    else if (activeVariant === 'advanced_missing_cents') logicVariant = 'Find missing cents component (e.g., $3.50 = 3 dollars and __ cents).';
    else if (activeVariant === 'advanced_convert_large_amount') logicVariant = 'Convert very large amount (e.g., 1250¢ -> $12.50).';
    else if (activeVariant === 'advanced_multi_step_conversion') logicVariant = 'Convert coin denominations to total dollars (e.g., You have 5 fifty-cent coins. How much in dollars?).';

    const zodType = type === 'Structure' ? 'MULTI_STEP_INPUT' : 
                    type === 'MCQ' ? 'MCQ_BUTTONS' : 
                    'STANDARD_TEXT';
    
    const zodDiff = difficulty.toUpperCase();
    const level = 'Primary 2';
    const topic = 'Money - Money';
    const subtopic = 'Money Conversion (Cents/Decimals)';
    
    let result = null;
    if (difficulty.toLowerCase() === 'foundation') {
      result = generateFoundation(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    } else if (difficulty.toLowerCase() === 'standard') {
      result = generateStandard(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    } else if (difficulty.toLowerCase() === 'advanced') {
      result = generateAdvanced(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }
    
    if (result) {
      result.logicVariant = logicVariant;
    }
    
    return result;
  }
};
