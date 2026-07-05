import { foundationLogic } from './operation-symbols/foundation';
import { standardLogic } from './operation-symbols/standard';
import { advancedLogic } from './operation-symbols/advanced';

export const operationSymbolsBlueprint = {
  id: 'p1-operation-symbols',

  // 1. DIFFICULTY LEVELS
  levels: {
    foundation: {
      name: 'Symbol Meaning',
      steps: 1,
      maxNumber: 10,
      logicDescription: "Identify and understand basic operation symbols (+, -, =).",
      logic: 'Direct Identification'
    },
    standard: {
      name: 'Applying Symbols',
      steps: 2,
      maxNumber: 20,
      logicDescription: "Translate words into the correct operation symbol.",
      logic: 'Equation Translation'
    },
    advanced: {
      name: 'Missing Operations',
      steps: 3,
      maxNumber: 20,
      logicDescription: "Determine multiple missing symbols to balance an equation.",
      logic: 'Multi-Step Deduction'
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    // Foundation
    foundation_identify_plus: "What does the '+' symbol mean?",
    foundation_identify_minus: "What does the '-' symbol mean?",
    foundation_identify_equals: "What does the '=' symbol mean?",
    foundation_choose_operation_word: "Given a simple word context, choose the correct symbol.",
    foundation_missing_symbol_equation: "Fill in the missing symbol (+ or -) in a simple equation.",

    // Standard
    standard_word_to_equation: "Select the correct equation for a short word problem.",
    standard_equation_to_word: "Select the correct English sentence for a given equation.",
    standard_fix_wrong_symbol: "Identify which symbol fixes an incorrect equation.",
    standard_missing_symbol_large: "Fill in the missing symbol (+ or -) in an equation with numbers up to 20.",
    standard_find_target_operation: "Find the required operation (e.g., 'Add 5') to reach a target.",

    // Advanced
    advanced_balance_equation: "Fill in the missing symbols to balance an equation on both sides.",
    advanced_two_missing_symbols: "Pick the correct pair of symbols for a multi-step expression.",
    advanced_true_false_symbols: "Determine if two expressions using different symbols are equal.",
    advanced_word_to_multi_step_equation: "Translate a two-step word problem into a chained equation.",
    advanced_find_target_two_steps: "Determine the final operation required in a two-step conceptual problem."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_identify_plus', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');
    let activeVariant = variant;

    // 1. Ensure the variant exists (Fallback only if invalid)
    if (!operationSymbolsBlueprint.variants[variant]) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(operationSymbolsBlueprint.variants).filter(k => k.startsWith(safeDiff));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_choose_operation_word';
      }
    }

    // 2. Prevent "identify symbol" variants from being used in Short Questions
    if (isShort && ['foundation_identify_plus', 'foundation_identify_minus', 'foundation_identify_equals'].includes(activeVariant)) {
      const fallbackShortVariants = ['foundation_choose_operation_word', 'foundation_missing_symbol_equation'];
      activeVariant = fallbackShortVariants[Math.floor(Math.random() * fallbackShortVariants.length)];
    }

    // Prepare Zod Schema Meta
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    // Core Topic Meta
    const level = 'Primary 1';
    const topic = 'Whole Numbers - Addition and Subtraction';

    // Output formatting protocol
    const formatInstructions = `
      FORMAT PROTOCOL:
      - 'options' must be an array of EXACTLY strings if MCQ, or null otherwise.
      - 'finalAnswer' must match EXACTLY one of the options (if MCQ).
      - 'defectMap' (only for MCQ) maps wrong options to either "CARELESS_CALCULATION" or "CONCEPTUAL_ERROR".
      - 'hint' must guide the student without giving away the answer directly.
      - 'solutionSteps' must clearly explain how to get the answer.
    `;

    // Dynamic Q Text Helper
    const getQText = (raw, short) => {
      if (isShort) return short;
      if (isStructure) return `Solve this:\\n${raw}`;
      return raw;
    };

    // Route to logic engines
    if (activeVariant.startsWith('foundation')) {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText);
    }
    if (activeVariant.startsWith('standard')) {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText);
    }
    if (activeVariant.startsWith('advanced')) {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText);
    }

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}' in Operation Symbols`);
  }
};
