import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './abbreviations-h-and-min/foundation';
import { standardLogic } from './abbreviations-h-and-min/standard';
import { advancedLogic } from './abbreviations-h-and-min/advanced';

export const abbreviationsHAndMinBlueprint = {
  id: 'p1-abbreviations-h-and-min',
  title: 'Abbreviations: h and min',
  strand: 'Measurement and Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Identifying Abbreviations',
      steps: 1,
      logicDescription: "Direct recall of what 'h' and 'min' stand for."
    },
    standard: {
      name: 'Choosing the Right Unit',
      steps: 1,
      logicDescription: "Contextual application of 'h' and 'min' for everyday activities."
    },
    advanced: {
      name: 'Comparing Durations',
      steps: 2,
      logicDescription: "Comparing durations mixing 'h' and 'min', recognizing that hours are longer."
    }
  },

  variants: {
    foundation_identify_abbreviations: "Identifying what 'h' and 'min' stand for.",
    standard_unit_selection: "Choosing the appropriate unit ('h' or 'min') for a given everyday activity.",
    advanced_duration_comparison: "Comparing durations that use different units, relying on the conceptual understanding that an hour is much longer than a minute."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_identify_abbreviations', type = 'MCQ') => {
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
    if (!abbreviationsHAndMinBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(abbreviationsHAndMinBlueprint.variants).filter(k => k.startsWith(finalDifficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_identify_abbreviations';
      }
    }

    const config = abbreviationsHAndMinBlueprint.difficultyLevels[finalDifficulty] || abbreviationsHAndMinBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Measurement';

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON. Focus on the meaning of the abbreviations.`;

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}`
      : `Format as Short Answer. The "options" field in your JSON should be null.${hintProtocol}`;

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }
    
    if (activeVariant.startsWith('standard_')) {
      return standardLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    return foundationLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};
