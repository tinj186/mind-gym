/**
 * Standard Tier: Telling time to the half-hour and analog-digital conversion.
 * PATH: src/lib/syllabus/math/primary-1/measurement/time/standard.js
 */
export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Time', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1' };
  
  const inputType = 'MCQ_BUTTONS'; 
  let componentData = null;
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender: "CLOCK_DISPLAY" }, inputRequirement: { inputType } };
  let seedInstructions = "";

  const getShuffledOptions = (correct, distractors) => {
    return [correct, ...distractors]
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort(() => Math.random() - 0.5);
  };

  switch (activeVariant) {
    case 'standard_analog_digital': {
      commonMeta.heuristic = 'Analog-Digital Matching';
      const hour = Math.floor(Math.random() * 12) + 1;
      const minute = 30; // Standard tier focus is half-hour marks
      componentData = { hour, minute: 30, displayType: 'analog' };
      
      const digitalTime = `${hour}:30`;
      const distractors = [
        `${hour === 12 ? 1 : hour + 1}:30`,
        `${hour}:00`,
        `${hour === 1 ? 12 : hour - 1}:30`
      ];

      promptObject.content = {
        questionText: "Which digital clock shows the same time as the clock face?",
        options: getShuffledOptions(digitalTime, distractors),
        finalAnswer: digitalTime,
        solutionSteps: `The analog clock shows the long hand at 6 and the short hand past ${hour}. This is ${hour}:30.`,
        hint: "Check the hour hand first, then see if the long hand is at 12 or 6!"
      };
      seedInstructions = `Visual analog clock shows ${hour}:30. Students must select digital format "${digitalTime}".`;
      break;
    }

    case 'standard_digital_half_hour': {
      commonMeta.heuristic = 'Digital-Textual Matching';
      const hour = Math.floor(Math.random() * 12) + 1;
      componentData = { hour, minute: 30, displayType: 'digital' };
      
      const finalAnswer = `half past ${hour}`;
      const distractors = [`${hour} o'clock`, `half past ${hour === 12 ? 1 : hour + 1}`, `half past ${hour === 1 ? 12 : hour - 1}`];

      promptObject.content = {
        questionText: "Look at the digital clock. What is another way to say this time?",
        options: getShuffledOptions(finalAnswer, distractors),
        finalAnswer,
        solutionSteps: `The clock shows ${hour}:30. The ':30' part means half of the hour has passed, so it is half past ${hour}.`,
        hint: "When we see :30 on a clock, we say 'half past' the hour."
      };
      seedInstructions = `Digital clock shows ${hour}:30. Target phrase: "${finalAnswer}".`;
      break;
    }

    case 'standard_half_past_concept': {
      commonMeta.heuristic = 'Conceptual Equivalence';
      promptObject.visualEngine.componentToRender = null;
      const hour = Math.floor(Math.random() * 12) + 1;
      const digital = `${hour}:30`;
      const phrase = `half past ${hour}`;
      
      promptObject.content = {
        questionText: `Which of these is the same as ${phrase}?`,
        options: getShuffledOptions(digital, [`${hour}:00`, `${hour === 12 ? 1 : hour + 1}:30`, `${hour}:06`]),
        finalAnswer: digital,
        solutionSteps: `The term 'half past' means 30 minutes have passed after the hour. So, ${phrase} is written as ${digital}.`,
        hint: "Half of an hour is 30 minutes!"
      };
      seedInstructions = `Conceptual link between words and digital numbers for half-past ${hour}.`;
      break;
    }

    case 'standard_hour_hand_placement': {
      commonMeta.heuristic = 'Analog Anatomy Logic';
      promptObject.visualEngine.componentToRender = null;
      const hour = Math.floor(Math.random() * 11) + 1;
      const nextHour = hour + 1;
      const finalAnswer = `Between ${hour} and ${nextHour}`;

      promptObject.content = {
        questionText: `Where should the short hour hand point at half past ${hour}?`,
        options: getShuffledOptions(finalAnswer, [`Exactly at ${hour}`, `Exactly at ${nextHour}`, `Between ${nextHour} and ${nextHour + 1}`]),
        finalAnswer,
        solutionSteps: `At half past ${hour}, the hour hand has moved halfway from ${hour} towards ${nextHour}.`,
        hint: "The hour hand moves slowly as time goes by. At half past, it's right in the middle of two numbers!"
      };
      seedInstructions = `MCQ assessing hour hand position during half-hour increments for ${hour}:30.`;
      break;
    }

    case 'standard_duration_simple': {
      commonMeta.heuristic = 'Duration Arithmetic';
      promptObject.visualEngine.componentToRender = null;
      const start = Math.floor(Math.random() * 4) + 7; // 7 to 10
      const duration = Math.floor(Math.random() * 2) + 1; // 1 or 2 hours
      const end = start + duration;
      
      const finalAnswer = `${duration} ${duration === 1 ? 'hour' : 'hours'}`;

      promptObject.content = {
        questionText: `Math class starts at ${start} o'clock and ends at ${end} o'clock. How long is the class?`,
        options: getShuffledOptions(finalAnswer, ["3 hours", "half an hour", "5 hours"]),
        finalAnswer,
        solutionSteps: `We count the hours from ${start} to ${end}. ${end} minus ${start} is ${duration}.`,
        hint: "Count how many big jumps the hour hand makes from the start time to the end time."
      };
      seedInstructions = `Duration word problem: ${start}:00 to ${end}:00. Result: ${finalAnswer}.`;
      break;
    }

    case 'standard_digital_to_analog': {
      commonMeta.heuristic = 'Digital-Word Translation';
      promptObject.visualEngine.componentToRender = null;
      const hour = Math.floor(Math.random() * 12) + 1;
      const digital = `${hour}:30`;
      const finalAnswer = `half past ${hour}`;

      promptObject.content = {
        questionText: `If a digital clock shows ${digital}, what time is it in words?`,
        options: getShuffledOptions(finalAnswer, [`${hour} o'clock`, `half past ${hour === 1 ? 12 : hour - 1}`, "6 o'clock"]),
        finalAnswer,
        solutionSteps: `The digits ${hour} show the hour, and :30 means half an hour has passed. That is half past ${hour}.`,
        hint: "Digital clocks show the hour first, then the minutes."
      };
      seedInstructions = `Digital string ${digital} to target word selection "${finalAnswer}".`;
      break;
    }

    case 'standard_timeline_sequence': {
      commonMeta.heuristic = 'Daily Timeline Sequencing';
      promptObject.visualEngine.componentToRender = null;
      const events = [
        "Wake up (7:00)",
        "Breakfast (7:30)",
        "Recess (10:00)",
        "Lunch (12:30)"
      ];
      const finalAnswer = events.join(" ➔ ");
      const distractors = [
        "Breakfast (7:30) ➔ Wake up (7:00) ➔ Recess (10:00) ➔ Lunch (12:30)",
        "Lunch (12:30) ➔ Recess (10:00) ➔ Breakfast (7:30) ➔ Wake up (7:00)",
        "Wake up (7:00) ➔ Recess (10:00) ➔ Breakfast (7:30) ➔ Lunch (12:30)"
      ];

      promptObject.content = {
        questionText: "Arrange these school day events in the correct order from earliest to latest.",
        options: getShuffledOptions(finalAnswer, distractors),
        finalAnswer,
        solutionSteps: "We follow the clock from morning to afternoon. 7:00 comes before 7:30, which comes before 10:00, and lunch is last at 12:30.",
        hint: "Think about what happens at the start of your school day and what happens later!"
      };
      seedInstructions = `Ordering 4 chronological events involving whole and half hours.`;
      break;
    }

    case 'standard_activity_duration_compare': {
      commonMeta.heuristic = 'Duration Comparison';
      promptObject.visualEngine.componentToRender = null;
      
      const names = ["Meiling", "John", "Siti", "Ahmad", "Ali", "Wei Ming"];
      const shuffledNames = [...names].sort(() => Math.random() - 0.5);
      const nameA = shuffledNames[0];
      const nameB = shuffledNames[1];
      const durA = Math.floor(Math.random() * 2) + 1; // 1 or 2
      const durB = durA + 1; // Ensure durB is longer
      
      promptObject.content = {
        questionText: `${nameA} reads for ${durA} hour. ${nameB} draws for ${durB} hours. Who spent more time on their activity?`,
        options: [nameA, nameB, "They spent the same time", "Cannot tell"],
        finalAnswer: nameB,
        solutionSteps: `${durB} hours is a longer time than ${durA} hour. Therefore, ${nameB} spent more time.`,
        hint: "Compare the number of hours. Which number is bigger?"
      };
      seedInstructions = `Comparing ${durA} hour vs ${durB} hours duration. Target: ${nameB}. Do NOT mention any clock times.`;
      break;
    }

    case 'standard_half_hour_later_earlier': {
      commonMeta.heuristic = 'Temporal Offsets';
      const hour = Math.floor(Math.random() * 10) + 1;
      const isLater = Math.random() > 0.5;
      componentData = { hour, minute: 0, displayType: 'analog' };
      
      const finalAnswer = isLater ? `half past ${hour}` : `half past ${hour === 1 ? 12 : hour - 1}`;

      promptObject.content = {
        questionText: `The clock shows ${hour} o'clock. What time will it be half an hour ${isLater ? 'later' : 'earlier'}?`,
        options: getShuffledOptions(finalAnswer, [`${hour} o'clock`, `half past ${hour === 12 ? 1 : hour + 1}`, `${hour}:00`]),
        finalAnswer,
        solutionSteps: `Moving the minute hand half an hour ${isLater ? 'forward' : 'backward'} from the 12 brings it to the 6, which is 'half past'.`,
        hint: "Half an hour is the time it takes for the long hand to move from 12 to 6."
      };
      seedInstructions = `Analog visual ${hour}:00. Calculate half-hour ${isLater ? 'later' : 'earlier'}. Target: "${finalAnswer}".`;
      break;
    }

    default: // standard_to_half_hour
      commonMeta.heuristic = 'Half-Hour Clock Reading';
      const hour = Math.floor(Math.random() * 12) + 1;
      componentData = { hour, minute: 30, displayType: 'analog' };
      
      const answer = `half past ${hour}`;
      const distractors = [
        `half past ${hour === 12 ? 1 : hour + 1}`,
        `${hour} o'clock`,
        `half past ${hour === 1 ? 12 : hour - 1}`
      ];

      promptObject.content = {
        questionText: "What time is shown on the clock?",
        options: getShuffledOptions(answer, distractors),
        finalAnswer: answer,
        solutionSteps: `The long hand (minute hand) is at 6. The short hand (hour hand) is past ${hour}. This means it is ${answer}.`,
        hint: "If the long hand is at 6, it means 'half past' the hour!"
      };
      seedInstructions = `Analog clock is set to ${hour}:30. Correct seed answer is strictly the phrase "${answer}".`;
      break;
  }

  if (promptObject.visualEngine.componentToRender) {
    promptObject.visualEngine.componentData = componentData;
  } else {
    delete promptObject.visualEngine;
  }

  const instructions = `
    TASK: Generate a Primary 1 Standard Time question.
    VARIANT: ${activeVariant}
    PEDAGOGY: Use both digital strings (X:30) and 'half past' vocabulary. Half-hour increments only.
    
    CRITICAL PROMPT SEED CONSTRAINTS:
    - Your output JSON object MUST include the 'content.hint' parameter string. It cannot be null or empty.
    - Your output JSON object MUST include 'content.solutionSteps' as a pure text explanation. DO NOT nest or repeat a visual layout element inside solutionSteps.
    - ${seedInstructions}
    - Component visual state: ${JSON.stringify(componentData)}
    - Ensure the questionText and finalAnswer are perfectly aligned with the clock state.
    
    OUTPUT MANDATE: Return ONLY valid JSON matching the structure provided. No conversational text.
    ${JSON.stringify(promptObject)}
  `;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}