import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './time-duration/foundation';
import { standardLogic } from './time-duration/standard';
import { advancedLogic } from './time-duration/advanced';

export const timeDurationBlueprint = {
  id: 'p1-time-duration',
  title: 'Time Sequence and Duration',
  strand: 'Measurement and Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Time Comparison',
      steps: 1,
      logicDescription: "Comparing basic time durations qualitatively and quantitatively."
    },
    standard: {
      name: 'Simple Duration',
      steps: 2,
      logicDescription: "Comparing activity durations and finding half-hour time shifts."
    },
    advanced: {
      name: 'Time Sequence Logic',
      steps: 3,
      logicDescription: "Complex time elapsed logic, pattern prediction, and shifting."
    }
  },

  variants: {
    foundation_qualitative_longer_shorter: "Comparing two vastly different activities to determine which naturally takes a longer or shorter time.",
    foundation_faster_slower_time: "Connecting the concepts of speed to the duration of time.",
    foundation_hour_vs_half_hour: "Understanding the relative magnitude of 1 hour vs half an hour.",
    foundation_basic_elapsed_hours: "Very basic counting of elapsed hours between two consecutive or nearby whole hours.",
    foundation_duration_number_compare: "Comparing two simple duration numbers to see which is longer/shorter.",

    standard_duration_simple: "Determining basic everyday event durations when given discrete start and end markers on whole or half hours.",
    standard_activity_duration_compare: "Comparing the length of two activities to deduce which one takes a longer or shorter duration of time.",
    standard_half_hour_later_earlier: "Calculating exactly half an hour later or earlier from a fixed baseline whole-hour or half-hour point.",
    standard_calculate_start_end_time: "Working forwards or backwards given one time and the duration.",
    standard_total_duration: "Adding the durations of two consecutive activities to find the total time spent.",

    advanced_sequence_logic: "Arranging a series of events or clock faces in chronological order.",
    advanced_one_hour_shift: "Determining the time one hour before or after a given clock state.",
    advanced_half_hour_shift: "Calculating the time exactly half an hour (30 minutes) earlier or later from a baseline time, shifting across hour boundaries (e.g., half an hour after 11:30 is 12:00).",
    advanced_elapsed_time_simple: "Calculating how many hours or half-hours have elapsed between a given start time and end time (e.g., from 2 o'clock to half past 3).",
    advanced_clock_pattern_prediction: "Analyzing a series of chronologically advancing clocks to find the pattern and predict the next clock face in the sequence (e.g., advancing by 1 hour or 30 minutes each step).",
    advanced_activity_duration_logic: "Deducing start or end times given a starting/ending point and a specific duration statement (e.g., 'Class is 1 hour long and ends at 11 o'clock. What time did it start?').",
    advanced_transitive_time_comparison: "Using logical deduction to order or evaluate the durations of three different characters' activities based on comparative text clues.",
    advanced_split_schedule_total: "Adding up two separate blocks of time dedicated to the same task to find the total structural duration (e.g., reading for 1 hour in the morning and half an hour at night).",
    advanced_earlier_later_clue_parsing: "Solving multi-step story problems matching descriptive vocabulary clues like 'too early' or 'too late' to adjust a clock state to its correct intended target."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_sequence_simple', type = 'MCQ') => {
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
    if (!timeDurationBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(timeDurationBlueprint.variants).filter(k => k.startsWith(finalDifficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_sequence_simple';
      }
    }

    const config = timeDurationBlueprint.difficultyLevels[finalDifficulty] || timeDurationBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Measurement';

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON. Focus on logical sequencing and time duration calculations.`;

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
