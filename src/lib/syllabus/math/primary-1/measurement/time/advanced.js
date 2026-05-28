/**
 * Advanced Tier: Time sequencing and one-hour duration shifts.
 * PATH: src/lib/syllabus/math/primary-1/measurement/time/advanced.js
 */
export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Time', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1' };
  
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';
  let componentData = null;
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender: "CLOCK_DISPLAY" }, inputRequirement: { inputType } };
  let seedInstructions = "";

  const getShuffledOptions = (correct, distractors) => {
    if (!isMCQ) return null;
    return [correct, ...distractors]
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort(() => Math.random() - 0.5);
  };

  switch (activeVariant) {
    case 'advanced_sequence_logic': {
      commonMeta.heuristic = 'Chronological Reasoning';
      const events = [
        { act: "Eating lunch", time: "12:30 p.m." },
        { act: "Homework", time: "3:00 p.m." },
        { act: "Eating dinner", time: "6:30 p.m." }
      ];

      promptObject.visualEngine.componentToRender = null;
      const correctOrder = events.map(e => e.act).join(", ");
      const distractors = [
        [...events].reverse().map(e => e.act).join(", "),
        `${events[1].act}, ${events[0].act}, ${events[2].act}`,
        `${events[0].act}, ${events[2].act}, ${events[1].act}`
      ];

      promptObject.content = {
        questionText: `Arrange these daily activities in order from earliest to latest:\n- ${events[2].act}\n- ${events[0].act}\n- ${events[1].act}`,
        options: getShuffledOptions(correctOrder, distractors),
        finalAnswer: correctOrder,
        solutionSteps: `Daily events happen in this order: ${events[0].act} (${events[0].time}), ${events[1].act} (${events[1].time}), and finally ${events[2].act} (${events[2].time}).`,
        hint: "Think about your own day! What do you do first, and what comes later?"
      };
      seedInstructions = `Sequence logic problem. Correct chronological string: "${correctOrder}".`;
      break;
    }

    case 'advanced_half_hour_shift': {
      commonMeta.heuristic = 'Boundary Shifting';
      const hour = Math.floor(Math.random() * 11) + 1;
      componentData = { hour, minute: 30, displayType: 'analog' };
      
      const targetTime = `${hour + 1} o'clock`;
      const distractors = [`${hour}:30`, `${hour} o'clock`, `${hour + 2} o'clock`];

      promptObject.content = {
        questionText: `The clock shows half past ${hour}. What time will it be in exactly 30 minutes?`,
        options: getShuffledOptions(targetTime, distractors),
        finalAnswer: targetTime,
        solutionSteps: `At half past ${hour}, the minute hand is at 6. In 30 minutes, it will move to 12, completing the hour to ${hour + 1} o'clock.`,
        hint: "Half an hour is 30 minutes. If you add half an hour to a 'half past' time, you get a new 'o'clock' time!"
      };
      seedInstructions = `Shifting across hour boundary from ${hour}:30 to ${hour + 1}:00.`;
      break;
    }

    case 'advanced_elapsed_time_simple': {
      commonMeta.heuristic = 'Interval Calculation';
      promptObject.visualEngine.componentToRender = null;
      const startHour = Math.floor(Math.random() * 3) + 1; 
      const endHour = startHour + 1;
      const finalAnswer = "1 hour and 30 minutes";

      promptObject.content = {
        questionText: `How much time has passed between ${startHour} o'clock and half past ${endHour}?`,
        options: getShuffledOptions(finalAnswer, ["1 hour", "2 hours", "30 minutes", "2 hours and 30 minutes"]),
        finalAnswer,
        solutionSteps: `From ${startHour} o'clock to ${endHour} o'clock is 1 hour. From ${endHour} o'clock to half past ${endHour} is 30 minutes. Total: 1 hour and 30 minutes.`,
        hint: "Count the hours first, then add the 30 minutes for the 'half past' part."
      };
      seedInstructions = `Calculate duration from ${startHour}:00 to ${endHour}:30.`;
      break;
    }

    case 'advanced_clock_pattern_prediction': {
      commonMeta.heuristic = 'Temporal Patterns';
      promptObject.visualEngine.componentToRender = null;
      const hour = Math.floor(Math.random() * 10) + 1;
      const sequence = `${hour} o'clock ➔ half past ${hour} ➔ ${hour + 1} o'clock`;
      const nextTime = `half past ${hour + 1}`;

      promptObject.content = {
        questionText: `Look at the pattern: ${sequence}. What time comes next?`,
        options: getShuffledOptions(nextTime, [`${hour + 1} o'clock`, `${hour + 2} o'clock`, `half past ${hour}`]),
        finalAnswer: nextTime,
        solutionSteps: `The pattern shows time moving forward by 30 minutes each step. After ${hour + 1} o'clock, the next time is half past ${hour + 1}.`,
        hint: "Is the time jumping by a whole hour or half an hour (30 minutes)?"
      };
      seedInstructions = `Predict next item in +30 min pattern starting at ${hour}:00.`;
      break;
    }

    case 'advanced_activity_duration_logic': {
      commonMeta.heuristic = 'Backward Deduction';
      promptObject.visualEngine.componentToRender = null;
      const startHour = Math.floor(Math.random() * 8) + 1;
      const duration = 1;
      const endHour = startHour + duration;
      const name = "Ali";

      promptObject.content = {
        questionText: `${name} finished his lunch at ${endHour} o'clock. He spent 1 hour eating. What time did he start eating?`,
        options: getShuffledOptions(`${startHour} o'clock`, [`${endHour} o'clock`, `${startHour + 2} o'clock`, "12 o'clock"]),
        finalAnswer: `${startHour} o'clock`,
        solutionSteps: `If he finished at ${endHour} o'clock and took 1 hour, we go back 1 hour from ${endHour}. ${endHour} - 1 = ${startHour} o'clock.`,
        hint: "To find a start time, we need to count backwards from the finish time!"
      };
      seedInstructions = `Deduce start time given end time ${endHour}:00 and 1 hour duration.`;
      break;
    }

    case 'advanced_transitive_time_comparison': {
      commonMeta.heuristic = 'Transitive Duration Logic';
      promptObject.visualEngine.componentToRender = null;
      const names = ["Meiling", "John", "Siti", "Ahmad"].sort(() => Math.random() - 0.5);
      const [name1, name2, name3] = names;

      promptObject.content = {
        questionText: `${name1} spent more time than ${name2} on homework. ${name2} spent more time than ${name3}. Who spent the least amount of time?`,
        options: getShuffledOptions(name3, [name1, name2, "They spent the same time"]),
        finalAnswer: name3,
        solutionSteps: `Since ${name1} > ${name2} and ${name2} > ${name3}, ${name3} must be the one who spent the least time.`,
        hint: "Try drawing lines to show who spent more time. The shortest line is the person who spent the least time!"
      };
      seedInstructions = `Transitive logic comparison between 3 people. Target: shortest duration.`;
      break;
    }

    case 'advanced_half_hour_hand_drift': {
      commonMeta.heuristic = 'Analog Anatomy';
      promptObject.visualEngine.componentToRender = null;
      const hour = Math.floor(Math.random() * 11) + 1;
      const nextHour = hour === 12 ? 1 : hour + 1;
      const finalAnswer = `Exactly halfway between ${hour} and ${nextHour}`;

      promptObject.content = {
        questionText: `Where is the short hour hand pointing when the time is exactly half past ${hour}?`,
        options: getShuffledOptions(finalAnswer, [`Exactly at ${hour}`, `Exactly at ${nextHour}`, `Exactly at 6`]),
        finalAnswer,
        solutionSteps: `At half past ${hour}, 30 minutes have passed. The hour hand moves slowly throughout the hour and will be halfway between ${hour} and ${nextHour}.`,
        hint: "The hour hand doesn't stay on a number for the whole hour. It moves slowly toward the next number!"
      };
      seedInstructions = `Conceptual hand drift question for half-past ${hour}.`;
      break;
    }

    case 'advanced_split_schedule_total': {
      commonMeta.heuristic = 'Compound Duration';
      promptObject.visualEngine.componentToRender = null;
      const name = "Wei Ming";
      const finalAnswer = "1 hour and 30 minutes";

      promptObject.content = {
        questionText: `${name} read for 1 hour in the morning and 30 minutes at night. How much time did he spend reading in total?`,
        options: getShuffledOptions(finalAnswer, ["1 hour", "2 hours", "30 minutes", "2 hours and 30 minutes"]),
        finalAnswer,
        solutionSteps: `Total time = Morning time + Night time. 1 hour + 30 minutes = 1 hour and 30 minutes.`,
        hint: "Add the hours together, and then add the minutes."
      };
      seedInstructions = `Summing 1 hour and 30 minutes.`;
      break;
    }

    case 'advanced_earlier_later_clue_parsing': {
      commonMeta.heuristic = 'Clue Adjustment Logic';
      const hour = Math.floor(Math.random() * 8) + 2; 
      const isLate = Math.random() > 0.5;
      componentData = { hour, minute: 0, displayType: 'analog' };

      const finalAnswer = isLate ? `${hour - 1} o'clock` : `${hour + 1} o'clock`;
      const distractors = isLate 
        ? [`${hour} o'clock`, `${hour + 1} o'clock`, `${hour - 2} o'clock`]
        : [`${hour} o'clock`, `${hour - 1} o'clock`, `${hour + 2} o'clock`];

      promptObject.content = {
        questionText: `The clock shows when Aminah arrived at the library. She says she is 1 hour too ${isLate ? 'late' : 'early'}. What time was she supposed to be there?`,
        options: getShuffledOptions(finalAnswer, distractors),
        finalAnswer,
        solutionSteps: isLate 
          ? `Being late means she arrived after the correct time. ${hour} o'clock minus 1 hour is ${hour - 1} o'clock.`
          : `Being early means she arrived before the correct time. ${hour} o'clock plus 1 hour is ${hour + 1} o'clock.`,
        hint: isLate ? "If you are late, the event started before you got there!" : "If you are early, the event will start after you got there!"
      };
      seedInstructions = `Story logic adjusting ${hour}:00 based on 'too ${isLate ? 'late' : 'early'}'.`;
      break;
    }

    default: // advanced_one_hour_shift
      commonMeta.heuristic = 'Temporal Displacement';
      const startHour = Math.floor(Math.random() * 10) + 1; // Start at 1-10
      const isLater = Math.random() > 0.5;
      const endHour = isLater ? startHour + 1 : (startHour === 1 ? 12 : startHour - 1);
      
      componentData = { hour: startHour, minute: 0, displayType: 'analog' };
      
      const targetTime = `${endHour} o'clock`;
      const distractors = [
        `${startHour} o'clock`,
        `${(endHour % 12) + 1} o'clock`,
        `${endHour}:30`
      ];

      promptObject.content = {
        questionText: `Minah started her homework at the time shown on the clock face. She finished exactly 1 hour ${isLater ? 'later' : 'earlier'}. What time did she finish?`,
        options: getShuffledOptions(targetTime, distractors),
        finalAnswer: targetTime,
        solutionSteps: `The clock shows ${startHour} o'clock. 1 hour ${isLater ? 'after' : 'before'} ${startHour} is ${endHour} o'clock.`,
        hint: "Imagine moving the short hour hand forward or backward by one big number!"
      };
      seedInstructions = `Initial analog visual set to ${startHour}:00. Student must calculate +/- 1 hour. Correct answer: "${targetTime}".`;
      break;
  }

  if (promptObject.visualEngine.componentToRender) {
    promptObject.visualEngine.componentData = componentData;
  } else {
    delete promptObject.visualEngine;
  }

  const instructions = `
    TASK: Generate a Primary 1 Advanced Time reasoning question.
    VARIANT: ${activeVariant}
    PEDAGOGY: Multi-step chronological reasoning and duration arithmetic limited to +/- 1 whole hour or 30-minute shifts.
    
    CRITICAL PROMPT SEED CONSTRAINTS:
    - Your output JSON object MUST include the 'content.hint' parameter string. It cannot be null or empty.
    - Your output JSON object MUST include 'content.solutionSteps' as a pure text explanation. DO NOT nest or repeat a visual layout element inside solutionSteps.
    - ${seedInstructions}
    - Component visual state parameters: ${componentData ? JSON.stringify(componentData) : 'None'}
    - Narrative and finalAnswer must be perfectly synchronized with the seeded logic.
    
    OUTPUT MANDATE: Return ONLY a valid JSON object structure matching this shape. No markdown blocks.
    ${JSON.stringify(promptObject)}
  `;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}