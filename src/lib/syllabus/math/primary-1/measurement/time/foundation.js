/**
 * Foundation Tier: Telling time to the hour, digital matching, clock anatomy, day/night cycles, and simple chronology.
 * PATH: src/lib/syllabus/math/primary-1/measurement/time/foundation.js
 */
export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Time', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1', heuristic: 'Basic Time Awareness' };
  const inputType = 'MCQ_BUTTONS'; // Highly preferred UI interaction mode for Primary 1 entry-level tasks

  let componentData = null;
  let componentToRender = "CLOCK_DISPLAY";
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender }, inputRequirement: { inputType } };
  let seedInstructions = "";

  // Helper utility to safely shuffle options with the correct option included
  const getShuffledOptions = (correct, distractors) => {
    return [correct, ...distractors]
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort(() => Math.random() - 0.5);
  };

  // 🎛️ FOUNDATION TIERS VARIANT ROUTING SWITCH ENGINE
  switch (activeVariant) {
    case 'foundation_to_hour': {
      commonMeta.heuristic = 'Analog Reading';
      const randomHour = Math.floor(Math.random() * 12) + 1; // 1 to 12 o'clock
      const finalAnswer = `${randomHour} o'clock`;

      componentData = { hour: randomHour, minute: 0, displayType: 'analog' };
      
      promptObject.content = {
        questionText: "Look at the clock. What time is it?",
        finalAnswer,
        options: getShuffledOptions(finalAnswer, [
          `${randomHour === 12 ? 1 : randomHour + 1} o'clock`, 
          `${randomHour === 1 ? 12 : randomHour - 1} o'clock`, 
          "6 o'clock"
        ]),
        hint: "Look closely at the shorter hand! Which number is it pointing directly to?",
        solutionSteps: `The long hand (minute hand) points straight up at 12, and the short hand (hour hand) points right at ${randomHour}. That means it is exactly ${randomHour} o'clock.`
      };
      seedInstructions = `Generate analog whole hour clock visualization for ${randomHour}. Answer must be exactly "${finalAnswer}".`;
      break;
    }

    case 'foundation_digital_hour': {
      commonMeta.heuristic = 'Digital Matching';
      const randomHour = Math.floor(Math.random() * 12) + 1;
      const finalAnswer = `${randomHour} o'clock`;

      componentData = { hour: randomHour, minute: 0, displayType: 'digital' };

      promptObject.content = {
        questionText: "What time is shown on the digital clock?",
        finalAnswer,
        options: getShuffledOptions(finalAnswer, [
          `${randomHour === 12 ? 1 : randomHour + 1} o'clock`, 
          "half past 12", 
          "3 o'clock"
        ]),
        hint: "The first number in a digital clock readout tells us the hour!",
        solutionSteps: `The digital clock displays ${randomHour}:00. The double zeros mean zero minutes have passed, so it is exactly ${randomHour} o'clock.`
      };
      seedInstructions = `Generate digital readout for ${randomHour}:00. Answer string is "${finalAnswer}".`;
      break;
    }

    case 'foundation_clock_parts': {
      commonMeta.heuristic = 'Clock Anatomy';
      componentToRender = null; // Pure conceptual text question
      const askAboutHourHand = Math.random() > 0.5;
      const finalAnswer = askAboutHourHand ? "Hour hand" : "Minute hand";

      promptObject.content = {
        questionText: `On an analog clock face, what do we call the ${askAboutHourHand ? 'short' : 'long'} hand?`,
        finalAnswer,
        options: ["Hour hand", "Minute hand", "Second hand", "Number hand"],
        hint: "The hand that points to the main hour numbers is always shorter!",
        solutionSteps: `The short hand on a clock is the hour hand, and the long hand is the minute hand. So the correct answer is the ${finalAnswer}.`
      };
      seedInstructions = `Identify features of clock hands. Target is the ${askAboutHourHand ? 'SHORT' : 'LONG'} hand.`;
      break;
    }

    case 'foundation_day_night': {
      commonMeta.heuristic = 'Diurnal Activity Sorting';
      componentToRender = null;
      const isNightScenario = Math.random() > 0.5;
      
      const questionText = isNightScenario 
        ? "Which of these activities do you usually do at night when it is dark outside?"
        : "Which of these activities do you usually do in the morning when the sun comes up?";
      const finalAnswer = isNightScenario ? "Going to sleep in bed" : "Eating breakfast before school";
      const distractors = isNightScenario 
        ? ["Playing at the school field", "Eating breakfast", "Watching the morning sunrise"]
        : ["Sleeping in pajamas", "Looking at stars in the sky", "Having dinner with family"];

      promptObject.content = {
        questionText,
        finalAnswer,
        options: getShuffledOptions(finalAnswer, distractors),
        hint: isNightScenario ? "Think about what you do when the moon and stars are out!" : "Think about what you do right after you wake up to get ready for school!",
        solutionSteps: isNightScenario
          ? "We sleep in bed at night when it is dark outside. Playing on the field and eating breakfast are daytime routines."
          : "We eat breakfast in the morning to prepare for our day ahead. Sleeping and seeing stars happen at night."
      };
      seedInstructions = `Classify activities by day/night cycle parts. Scenario target mode: ${isNightScenario ? 'NIGHT' : 'MORNING'}.`;
      break;
    }

    case 'foundation_sequence_simple': {
      commonMeta.heuristic = 'Chronological Sorting';
      componentToRender = null;
      const scenario = Math.random() > 0.5;
      
      const questionText = scenario
        ? "Choose the correct order of events from morning to night."
        : "Siti is planning her day. What does she do first when she wakes up in the morning?";
        
      const finalAnswer = scenario 
        ? "Wake up ➔ Eat lunch ➔ Sleep in bed" 
        : "Brush her teeth";
      const options = scenario
        ? ["Wake up ➔ Eat lunch ➔ Sleep in bed", "Sleep in bed ➔ Eat lunch ➔ Wake up", "Eat lunch ➔ Sleep in bed ➔ Wake up"]
        : ["Brush her teeth", "Pack her school bag to go home", "Have dinner with her family"];

      promptObject.content = {
        questionText,
        finalAnswer,
        options: scenario ? options : getShuffledOptions(finalAnswer, options.slice(1)),
        hint: "Think about what happens at the very start of your day versus the very end!",
        solutionSteps: scenario
          ? "Your day always starts with waking up in the morning, followed by having lunch in the afternoon, and ends with sleeping at night."
          : "Waking up is the absolute start of the day, so brushing teeth happens first before afternoon dismissal or evening routines."
      };
      seedInstructions = `Simple chronological sequencing tracker logic.`;
      break;
    }
  }

  // Final structural optimization: delete visual parameters if text-only variant
  if (componentToRender === null) {
    delete promptObject.visualEngine;
  } else {
    promptObject.visualEngine.componentToRender = componentToRender;
    promptObject.visualEngine.componentData = componentData;
  }

  const instructions = `
    TASK: Generate a Primary 1 Time foundation question.
    VARIANT: ${activeVariant}
    PEDAGOGY: Strictly adhere to Singapore MOE P1 time limits. Use whole hours only. No exact minutes, no A.M./P.M. notations. Keep terms highly accessible to a 6-year-old child.
    
    CRITICAL PROMPT SEED CONSTRAINTS:
    - Your output JSON object MUST include the 'content.hint' parameter string. It cannot be null or empty. // Corrected from hintText
    - Your output JSON object MUST include 'content.solutionSteps' as a pure text explanation. DO NOT nest or repeat a visual layout element inside solutionSteps.
    - Keep hint short, encouraging, and actionable without revealing the direct target option selection.
    - ${seedInstructions}
    
    OUTPUT MANDATE: Return ONLY a clean, valid JSON object structure matching the configuration blueprint layout. No markdown fence flags.
    ${JSON.stringify(promptObject)}
  `.trim();

  return { aiPrompt: instructions, parseResponse: (json) => json };
}