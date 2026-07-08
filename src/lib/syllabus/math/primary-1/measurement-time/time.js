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
      name: 'Advanced Clock Face Concepts',
      steps: 3,
      logicDescription: "Analyzing complex clock face concepts."
    }
  },

  variants: {
    foundation_to_hour: "Reading analog clocks showing whole hours.",
    foundation_digital_hour: "Reading digital clock readouts displaying whole hours (e.g., 4:00) and matching them to descriptive time text.",
    foundation_clock_parts: "Identifying the basic features of an analog clock face, specifically distinguishing between the long minute hand and the short hour hand.",
    foundation_day_night_activities: "Identifying whether common daily activities (e.g., breakfast, sleeping) happen during the day or night.",
    foundation_time_word_match: "Matching the word form of a time (e.g., 'seven o\\'clock') to its numerical representation (e.g., '7 o\\'clock').",

    standard_to_half_hour: "Reading analog clocks showing half-hour increments.",
    standard_analog_digital: "Converting between analog clock faces and digital time formats.",
    standard_digital_half_hour: "Reading digital clock readouts displaying half-hour increments (e.g., 8:30) and matching them to descriptive time text.",
    standard_half_past_concept: "Recognizing that 'half past' an hour is identical to the ':30' digital representation (e.g., matching 'half past 2' with '2:30').",
    standard_hour_hand_placement: "Identifying the correct positioning of the hour hand during a half-hour increment (understanding it must point exactly midway between two numbers).",
    standard_digital_to_analog: "Converting from a text/digital format constraint into a matching visual analog clock alignment target.",

    advanced_half_hour_hand_drift: "Analyzing challenging conceptual scenarios regarding exactly where the short hour hand is pointing when the long minute hand is at 6.",
    advanced_missing_numbers_clock: "Reading the correct time from an analog clock face that has had its numbers removed.",
    advanced_broken_minute_hand: "Deducing the exact time by only analyzing the position of the short hour hand.",
    advanced_fast_slow_clock_simple: "Determining the true time when given a clock that is explicitly stated to be running exactly 1 hour fast or 1 hour slow.",
    advanced_straight_line_hands: "Identifying unique visual states of the clock hands, such as determining which time shows the hour and minute hands forming a perfectly straight line."
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