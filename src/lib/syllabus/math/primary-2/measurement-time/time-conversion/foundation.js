const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const foundationLogic = (activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions) => {
  let structureText = '';
  let shortText = '';
  let actualAnswer = '';
  let mcqOptions = [];
  let hintStr = '';
  let stepsStr = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = '';
  let structureSteps = [];

  const hourToMin = (h) => h * 60;
  const halfHourToMin = (hh) => hh * 30;

  if (activeVariant === 'foundation_convert_hours_bidirectional') {
    const isHourToMin = Math.random() > 0.5;
    const val = getRandomInt(1, 5); // 1 to 5 hours

    if (isHourToMin) {
      structureText = `How many minutes are in ${val} hour${val > 1 ? 's' : ''}?`;
      shortText = `${val} hour${val > 1 ? 's' : ''} in minutes:`;
      actualAnswer = `${val * 60} minutes`;
      hintStr = `Remember that 1 hour is 60 minutes. Multiply the number of hours by 60!`;
      
      stepsStr = JSON.stringify([
        `1 hour = 60 minutes.`,
        `${val} hour${val > 1 ? 's' : ''} = ${val} × 60 minutes.`,
        `${val} × 60 = ${val * 60} minutes.`
      ]);

      structureSteps = [
        { label: `Working`, expectedAnswer: `${val} * 60 = ${val * 60}` },
        { label: `Final Answer`, expectedAnswer: `${val * 60} minutes` }
      ];

      if (isMCQ) {
        mcqOptions = [
          `${val * 60} minutes`,
          `${val * 30} minutes`,
          `${(val + 1) * 60} minutes`,
          `${(val * 60) + 30} minutes`
        ];
      }
    } else {
      const mins = val * 60;
      structureText = `How many hours are in ${mins} minutes?`;
      shortText = `${mins} minutes in hours:`;
      actualAnswer = `${val} hour${val > 1 ? 's' : ''}`;
      hintStr = `Remember that 60 minutes is 1 hour. How many groups of 60 are in ${mins}?`;
      
      stepsStr = JSON.stringify([
        `60 minutes = 1 hour.`,
        `We need to find how many groups of 60 are in ${mins}.`,
        `${mins} ÷ 60 = ${val}.`,
        `So, ${mins} minutes is ${val} hour${val > 1 ? 's' : ''}.`
      ]);

      structureSteps = [
        { label: `Working`, expectedAnswer: `${mins} / 60 = ${val}` },
        { label: `Final Answer`, expectedAnswer: `${val} hour${val > 1 ? 's' : ''}` }
      ];

      if (isMCQ) {
        mcqOptions = [
          `${val} hour${val > 1 ? 's' : ''}`,
          `${val + 1} hour${val + 1 > 1 ? 's' : ''}`,
          `${val > 1 ? val - 1 : 2} hour${val > 1 && val - 1 > 1 ? 's' : (val === 1 ? 's' : '')}`,
          `${val * 2} hour${val * 2 > 1 ? 's' : ''}`
        ];
      }
    }
  } else if (activeVariant === 'foundation_convert_half_hours_bidirectional') {
    const isHalfToMin = Math.random() > 0.5;
    const val = getRandomInt(1, 6); // 1 to 6 half-hours (up to 3 hours)

    if (isHalfToMin) {
      const halfStr = val === 1 ? "half an hour" : `${val} half-hours`;
      structureText = `How many minutes are in ${halfStr}?`;
      shortText = `${halfStr} in minutes:`;
      actualAnswer = `${val * 30} minutes`;
      hintStr = `Remember that half an hour is 30 minutes.`;
      
      stepsStr = JSON.stringify([
        `Half an hour = 30 minutes.`,
        `${halfStr} = ${val} × 30 minutes.`,
        `${val} × 30 = ${val * 30} minutes.`
      ]);

      structureSteps = [
        { label: `Working`, expectedAnswer: `${val} * 30 = ${val * 30}` },
        { label: `Final Answer`, expectedAnswer: `${val * 30} minutes` }
      ];

      if (isMCQ) {
        mcqOptions = [
          `${val * 30} minutes`,
          `${val * 60} minutes`,
          `${(val + 1) * 30} minutes`,
          `${val * 30 + 15} minutes`
        ];
      }
    } else {
      const mins = val * 30;
      structureText = `How many half-hours are in ${mins} minutes?`;
      shortText = `${mins} minutes in half-hours:`;
      actualAnswer = val === 1 ? `1 half-hour` : `${val} half-hours`;
      hintStr = `Remember that 30 minutes is 1 half-hour. How many groups of 30 are in ${mins}?`;
      
      stepsStr = JSON.stringify([
        `30 minutes = 1 half-hour.`,
        `We need to find how many groups of 30 are in ${mins}.`,
        `${mins} ÷ 30 = ${val}.`,
        `So, ${mins} minutes is ${val} half-hour${val > 1 ? 's' : ''}.`
      ]);

      structureSteps = [
        { label: `Working`, expectedAnswer: `${mins} / 30 = ${val}` },
        { label: `Final Answer`, expectedAnswer: val === 1 ? `1 half-hour` : `${val} half-hours` }
      ];

      if (isMCQ) {
        mcqOptions = [
          val === 1 ? `1 half-hour` : `${val} half-hours`,
          `${val + 1} half-hours`,
          `${val > 1 ? val - 1 : 2} half-hours`,
          `${val * 2} half-hours`
        ];
      }
    }
  } else if (activeVariant === 'foundation_identify_equivalents') {
    const val = getRandomInt(1, 4); // 1 to 4 hours
    const hasHalf = Math.random() > 0.5;
    
    let timeStr = `${val} hour${val > 1 ? 's' : ''}`;
    let timeMins = val * 60;
    
    if (hasHalf) {
      timeStr += ` 30 minutes`;
      timeMins += 30;
    }
    
    structureText = isMCQ 
      ? `Which of the following durations is exactly equal to ${timeStr}?` 
      : `What is exactly equal to ${timeStr} in minutes?`;
    shortText = `Equivalent to ${timeStr}:`;
    actualAnswer = `${timeMins} minutes`;
    hintStr = `Convert ${timeStr} entirely into minutes to see which one matches!`;
    
    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_CARDS",
      componentData: { items: [timeStr] }
    });
    
    stepsStr = JSON.stringify([
      `We know 1 hour = 60 minutes.`,
      `${val} hour${val > 1 ? 's' : ''} = ${val} × 60 = ${val * 60} minutes.`,
      ...(hasHalf ? [`Plus the extra 30 minutes: ${val * 60} + 30 = ${timeMins} minutes.`] : []),
      `The correct equivalent is ${timeMins} minutes.`
    ]);

    structureSteps = [
      { label: `Hours converted to minutes:`, expectedAnswer: `${val} * 60 = ${val * 60}` },
      { label: `Total duration in minutes:`, expectedAnswer: hasHalf ? `${val * 60} + 30 = ${timeMins}` : `${timeMins} minutes` }
    ];

    if (isMCQ) {
      mcqOptions = [
        `${timeMins} minutes`,
        `${timeMins - 30} minutes`,
        `${timeMins + 30} minutes`,
        `${timeMins + 60} minutes`
      ];
    }
  } else if (activeVariant === 'foundation_true_false_conversions') {
    const val = getRandomInt(1, 3); // 1 to 3 hours
    const isTrue = Math.random() > 0.5;
    
    let timeMins = val * 60;
    let wrongMins = timeMins + (Math.random() > 0.5 ? 30 : -30);
    if (wrongMins <= 0) wrongMins = 90;
    
    const statementMins = isTrue ? timeMins : wrongMins;
    
    structureText = `True or False: ${val} hour${val > 1 ? 's' : ''} is the exact same amount of time as ${statementMins} minutes.`;
    shortText = `${val} hour${val > 1 ? 's' : ''} = ${statementMins} minutes? (True/False):`;
    actualAnswer = isTrue ? "True" : "False";
    hintStr = `Convert ${val} hour${val > 1 ? 's' : ''} to minutes, and see if it equals ${statementMins} minutes.`;
    
    stepsStr = JSON.stringify([
      `1 hour = 60 minutes.`,
      `${val} hour${val > 1 ? 's' : ''} = ${val} × 60 = ${timeMins} minutes.`,
      `The statement says it is ${statementMins} minutes.`,
      `Since ${timeMins} ${isTrue ? 'is equal to' : 'is not equal to'} ${statementMins}, the statement is ${isTrue ? 'True' : 'False'}.`
    ]);

    structureSteps = [
      { label: `${val} hour${val > 1 ? 's' : ''} in minutes:`, expectedAnswer: `${val} * 60 = ${timeMins}` },
      { label: `Is the statement True or False?`, expectedAnswer: actualAnswer }
    ];

    isMCQ = true; // Force True/False
    mcqOptions = ["True", "False"];
  } else if (activeVariant === 'foundation_sort_mixed_units') {
    // Generate 3 distinct times: one in mins, one in half-hours, one in hours
    const options = [
      { text: "120 minutes", mins: 120 },
      { text: "half an hour", mins: 30 },
      { text: "1 hour", mins: 60 },
      { text: "3 half-hours", mins: 90 },
      { text: "2 hours", mins: 120 },
      { text: "1 hour 30 minutes", mins: 90 },
      { text: "60 minutes", mins: 60 }
    ];
    
    // Pick 3 unique by duration
    const picked = [];
    while (picked.length < 3) {
      const p = options[getRandomInt(0, options.length - 1)];
      if (!picked.find(x => x.mins === p.mins)) {
        picked.push(p);
      }
    }
    
    // Shuffle the picked ones for the question display
    const shuffled = [...picked].sort(() => Math.random() - 0.5);
    const sorted = [...picked].sort((a, b) => a.mins - b.mins);
    
    const displayList = shuffled.map(x => x.text).join(", ");
    actualAnswer = sorted.map(x => x.text).join(", ");
    
    structureText = `Arrange these times from shortest to longest: ${displayList}.`;
    shortText = `Sort shortest to longest: ${displayList}`;
    hintStr = `Convert all the times into minutes first! Then it is easy to compare them.`;
    
    stepsStr = JSON.stringify([
      `Convert everything to minutes to compare:`,
      `- ${shuffled[0].text} = ${shuffled[0].mins} minutes.`,
      `- ${shuffled[1].text} = ${shuffled[1].mins} minutes.`,
      `- ${shuffled[2].text} = ${shuffled[2].mins} minutes.`,
      `Now sort them from smallest to largest number of minutes: ${sorted[0].mins}, ${sorted[1].mins}, ${sorted[2].mins}.`,
      `The sorted order is: ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `${shuffled[0].text} in minutes:`, expectedAnswer: `${shuffled[0].mins} minutes` },
      { label: `${shuffled[1].text} in minutes:`, expectedAnswer: `${shuffled[1].mins} minutes` },
      { label: `${shuffled[2].text} in minutes:`, expectedAnswer: `${shuffled[2].mins} minutes` },
      { label: `Shortest time:`, expectedAnswer: sorted[0].text },
      { label: `Longest time:`, expectedAnswer: sorted[2].text },
      { label: `Sorted order:`, expectedAnswer: actualAnswer }
    ];

    if (isMCQ) {
      const wrong1 = `${sorted[2].text}, ${sorted[1].text}, ${sorted[0].text}`; // reversed
      const wrong2 = `${sorted[1].text}, ${sorted[0].text}, ${sorted[2].text}`;
      const wrong3 = `${sorted[0].text}, ${sorted[2].text}, ${sorted[1].text}`;
      mcqOptions = [actualAnswer, wrong1, wrong2, wrong3];
    }
  }

  // Remove duplicates and shuffle options for MCQ
  if (isMCQ && mcqOptions.length > 0) {
    mcqOptions = [...new Set(mcqOptions)];
    mcqOptions.sort(() => Math.random() - 0.5);
  }

  if (isStructure) {
    if (structureSteps && structureSteps.length > 0) {
      const stepsJson = structureSteps.map(step => 
        `{"label": "${step.label}", "expectedAnswer": "${step.expectedAnswer}", "acceptedAnswers": []}`
      ).join(",\\n        ");
      
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        ${stepsJson}
      ]}`;
    } else {
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": [
        {"label": "Step 1:", "expectedAnswer": "...", "acceptedAnswers": []}
      ]}`;
    }
  } else {
    inputRequirementStr = `{"inputType": "TEXT_INPUT"}`;
  }

  let systemPrompt = `
Generate a math question using the following exact parameters:
Question Text: ${getQText(structureText, shortText)}
Correct Answer: ${actualAnswer}
${isMCQ ? `MCQ Options: ${JSON.stringify(mcqOptions)}` : ''}
Solution Steps: ${stepsStr}
Hint: ${hintStr}

CRITICAL INSTRUCTIONS:
- You must use the EXACT question text provided above.
- You must use the EXACT correct answer provided above.
- Ensure the solution steps are broken down clearly.
- Output ONLY valid JSON using the provided schema template.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `.trim();

  return { aiPrompt: systemPrompt };
};
