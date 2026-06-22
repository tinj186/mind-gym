/**
 * Blueprint for Primary 1: Measurement - Time
 * PATH: src/lib/syllabus/math/primary-1/measurement/time.js
 */
import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './time/foundation';
import { standardLogic } from './time/standard';
import { advancedLogic } from './time/advanced';

export const timeBlueprint = {
  id: 'p1-measurement-time',
  title: 'Time',
  strand: 'Measurement and Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Telling Time to the Hour',
      steps: 1,
      logicDescription: "Reading analog clocks to the hour and identifying day/night activities."
    },
    standard: {
      name: 'Half-Hours & Digital Conversion',
      steps: 2,
      logicDescription: "Telling time to the half-hour and matching analog to digital displays."
    },
    advanced: {
      name: 'Time Sequences & Duration Shifting',
      steps: 3,
      logicDescription: "Ordering events in time and calculating one-hour future/past shifts."
    }
  },

  variants: {
    foundation_to_hour: "Reading analog clocks showing whole hours.",
    foundation_day_night: "Identifying appropriate activities for daytime vs nighttime.",
    foundation_digital_hour: "Reading digital clock readouts displaying whole hours (e.g., 4:00) and matching them to descriptive time text.",
    foundation_clock_parts: "Identifying the basic features of an analog clock face, specifically distinguishing between the long minute hand and the short hour hand.",
    foundation_sequence_simple: "Arranging two or three highly distinct everyday events in chronological order (e.g., waking up, going to school, sleeping at night).",

    standard_to_half_hour: "Reading analog clocks showing half-hour increments.",
    standard_analog_digital: "Converting between analog clock faces and digital time formats.",
    standard_digital_half_hour: "Reading digital clock readouts displaying half-hour increments (e.g., 8:30) and matching them to descriptive time text.",
    standard_half_past_concept: "Recognizing that 'half past' an hour is identical to the ':30' digital representation (e.g., matching 'half past 2' with '2:30').",
    standard_hour_hand_placement: "Identifying the correct positioning of the hour hand during a half-hour increment (understanding it must point exactly midway between two numbers).",
    standard_duration_simple: "Determining basic everyday event durations when given discrete start and end markers on whole or half hours.",
    standard_digital_to_analog: "Converting from a text/digital format constraint into a matching visual analog clock alignment target.",
    standard_timeline_sequence: "Arranging four common primary school daily timeline events chronologically using a mix of half-past and whole-hour descriptions.",
    standard_activity_duration_compare: "Comparing the length of two activities to deduce which one takes a longer or shorter duration of time.",
    standard_half_hour_later_earlier: "Calculating exactly half an hour later or earlier from a fixed baseline whole-hour or half-hour point.",

    advanced_sequence_logic: "Arranging a series of events or clock faces in chronological order.",
    advanced_one_hour_shift: "Determining the time one hour before or after a given clock state.",
    advanced_half_hour_shift: "Calculating the time exactly half an hour (30 minutes) earlier or later from a baseline time, shifting across hour boundaries (e.g., half an hour after 11:30 is 12:00).",
    advanced_elapsed_time_simple: "Calculating how many hours or half-hours have elapsed between a given start time and end time (e.g., from 2 o'clock to half past 3).",
    advanced_clock_pattern_prediction: "Analyzing a series of chronologically advancing clocks to find the pattern and predict the next clock face in the sequence (e.g., advancing by 1 hour or 30 minutes each step).",
    advanced_activity_duration_logic: "Deducing start or end times given a starting/ending point and a specific duration statement (e.g., 'Class is 1 hour long and ends at 11 o'clock. What time did it start?').",
    advanced_transitive_time_comparison: "Using logical deduction to order or evaluate the durations of three different characters' activities based on comparative text clues.",
    advanced_half_hour_hand_drift: "Analyzing challenging conceptual scenarios regarding exactly where the short hour hand is pointing when the long minute hand is at 6.",
    advanced_split_schedule_total: "Adding up two separate blocks of time dedicated to the same task to find the total structural duration (e.g., reading for 1 hour in the morning and half an hour at night).",
    advanced_earlier_later_clue_parsing: "Solving multi-step story problems matching descriptive vocabulary clues like 'too early' or 'too late' to adjust a clock state to its correct intended target."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_to_hour', type = 'MCQ') => {
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
    if (!timeBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(timeBlueprint.variants).filter(k => k.startsWith(finalDifficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_to_hour';
      }
    }

    const config = timeBlueprint.difficultyLevels[finalDifficulty] || timeBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Measurement';

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON. Focus on reading clock hands correctly.`;

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}`
      : `Format as Short Answer. The "options" field in your JSON should be null. If the answer involves words like 'hour', 'o'clock', or formatting variations, include an "acceptedAnswers" array in the "content" object with string variations (e.g., ["1 hr", "one hour", "1:00"]).${hintProtocol}`;

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    throw new Error(`Variant '${finalVariant}' not valid.`);
  }
};