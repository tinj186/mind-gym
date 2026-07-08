import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './am-pm-usage/foundation';
import { standardLogic } from './am-pm-usage/standard';
import { advancedLogic } from './am-pm-usage/advanced';

export const amPmUsageBlueprint = {
  id: 'p1-am-pm-usage',
  title: 'AM / PM Usage and Time of Day',
  strand: 'Measurement and Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Day and Night Activities',
      steps: 1,
      logicDescription: "Identifying appropriate activities for daytime vs nighttime."
    },
    standard: {
      name: 'Timelines & Sequences',
      steps: 2,
      logicDescription: "Arranging events chronologically using a mix of half-past and whole-hour descriptions."
    },
    advanced: {
      name: 'Complex Boundaries',
      steps: 3,
      logicDescription: "Multi-step reasoning across noon and midnight boundaries."
    }
  },

  variants: {
    foundation_day_night: "Identifying appropriate activities for daytime vs nighttime.",
    foundation_am_pm_definition: "Identifying what a.m. and p.m. stand for in terms of time of day.",
    foundation_am_pm_activities: "Mapping daily activities to a.m. or p.m.",
    foundation_time_of_day_sequence: "Sequencing morning, afternoon, evening, and night.",
    foundation_clock_am_pm: "Translating conversational time to a.m. or p.m.",
    foundation_sequence_simple: "Arranging two or three highly distinct everyday events in chronological order.",
    standard_timeline_sequence: "Arranging four common primary school daily timeline events chronologically using a mix of half-past and whole-hour descriptions.",
    standard_am_pm_logic: "Determining the correct a.m./p.m. for a secondary activity based on a time shift.",
    standard_am_pm_sorting: "Identifying the odd-one-out from a list of activities based on whether they happen in the a.m. or p.m.",
    standard_noon_boundary: "Crossing the 12:00 noon boundary from a.m. to p.m.",
    standard_clock_context_match: "Matching an activity's likely time to a provided clock face and determining the abbreviation.",
    advanced_elapsed_time_cross_noon: "Calculating the duration (in hours) between a time in the morning (a.m.) and a time in the afternoon (p.m.).",
    advanced_schedule_deduction: "Calculating a multi-step timeline to deduce whether the final event ends in the a.m. or p.m.",
    advanced_midnight_boundary: "Calculating a time jump that crosses the 12:00 midnight boundary (flipping p.m. to a.m.).",
    advanced_am_pm_word_problem: "A reverse time calculation (working backwards) that crosses the noon boundary.",
    advanced_time_comparison: "Comparing two times to see which is earlier or later, overriding number magnitude with a.m./p.m. logic."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_day_night', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    let finalDifficulty = difficulty; 
    let finalVariant = variant;

    if (typeof difficulty === 'string' && difficulty.includes('_')) {
      finalVariant = difficulty;
      finalDifficulty = variant || (difficulty.startsWith('advanced') ? 'advanced' : (difficulty.startsWith('standard') ? 'standard' : 'foundation'));
    }

    let activeVariant = finalVariant;
    if (!amPmUsageBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(amPmUsageBlueprint.variants).filter(k => k.startsWith(finalDifficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_day_night';
      }
    }

    const config = amPmUsageBlueprint.difficultyLevels[finalDifficulty] || amPmUsageBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Measurement';

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON. Focus on logical time of day and typical activities.`;

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}`
      : `Format as Short Answer. The "options" field in your JSON should be null.${hintProtocol}`;

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }
    
    if (activeVariant.startsWith('standard_')) {
      return standardLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }
    
    return foundationLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};
