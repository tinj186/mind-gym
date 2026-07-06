/**
 * Blueprint for Primary 1: Measurement - Length - Abbreviation 'cm'
 */
import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './abbreviation-cm/foundation';
import { standardLogic } from './abbreviation-cm/standard';
import { advancedLogic } from './abbreviation-cm/advanced';

export const abbreviationCmBlueprint = {
  id: 'p1-abbreviation-cm',
  title: "Abbreviation 'cm'",
  strand: 'Measurement and Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Identifying cm',
      steps: 1,
      logicDescription: "Identifying the correct spelling and abbreviation for centimeter."
    },
    standard: {
      name: 'Contextual Application',
      steps: 1,
      logicDescription: "Applying the 'cm' abbreviation in sentences and identifying wrong units."
    },
    advanced: {
      name: 'Error Correction',
      steps: 2,
      logicDescription: "Correcting typos in abbreviations and recognizing correct usage contexts."
    }
  },

  variants: {
    // Foundation
    foundation_identify_cm: "Identifying the short way to write centimetre.",
    foundation_identify_word: "Identifying what 'cm' stands for.",
    foundation_spelling: "Identifying the correct spelling of centimetre.",
    
    // Standard
    standard_select_unit: "Selecting the correct abbreviation to measure length.",
    standard_sentence_completion: "Filling in the missing 'cm' abbreviation in a sentence.",
    standard_true_false: "Evaluating a True/False statement about the usage of 'cm'.",
    
    // Advanced
    advanced_error_correction: "Correcting a typo of the 'cm' abbreviation (e.g. 'mc').",
    advanced_correct_usage: "Identifying which sentence uses 'cm' correctly instead of other units.",
    advanced_estimate_unit: "Filling in the correct unit for a standard 15cm school ruler."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_identify_cm', type = 'MCQ') => {
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
    if (!abbreviationCmBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(abbreviationCmBlueprint.variants).filter(k => k.startsWith(finalDifficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_identify_cm';
      }
    }

    const config = abbreviationCmBlueprint.difficultyLevels[finalDifficulty] || abbreviationCmBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Measurement - Length';
    const subtopic = "Abbreviation 'cm'";

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    const strictInstruction = `\nCRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!`;

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${strictInstruction}`
      : `Format as Short Answer. The "options" field in your JSON should be null.${strictInstruction}`;

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }

    return foundationLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
  }
};
