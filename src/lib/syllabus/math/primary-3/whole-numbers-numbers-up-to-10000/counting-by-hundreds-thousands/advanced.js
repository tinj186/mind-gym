export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let promptInstruction = "";
  
  // Helper to ensure tens/ones aren't uniformly 00
  const getTensOnes = () => (Math.floor(Math.random() * 9) + 1) * 10 + (Math.floor(Math.random() * 9) + 1);
  const item = (context.items && context.items.length > 0) ? context.items[0].item : 'items';
  const name = context.name || 'someone';
  const setting = context.setting || 'a familiar place';

  if (activeVariant === 'advanced_word_problem') {
    const isThousands = Math.random() > 0.5;
    const rate = isThousands ? (Math.floor(Math.random() * 2) + 1) * 1000 : (Math.floor(Math.random() * 8) + 2) * 100;
    const periods = Math.floor(Math.random() * 3) + 2; // 2 to 4 periods
    const maxBase = 9900 - (rate * periods);
    const baseNumber = Math.floor(Math.random() * (maxBase - 1000 + 1) / 100) * 100 + 1000 + getTensOnes();
    
    promptInstruction = `- Create a creative and engaging word problem featuring ${name} and ${item} at ${setting}. Inject a strong local Singaporean flavour into the story.\\n- The math structure MUST be: Starts with ${baseNumber}. Then increases by a rate of ${rate} per time period for ${periods} time periods. Ask for the final amount.\\n- Feel free to be generative with the scenario (e.g. collecting ${item} every day, producing them every hour, etc.) but the phrasing must emphasize this step-by-step counting nature. DO NOT phrase it as a simple addition problem like "${name} has ${baseNumber} and buys ${rate * periods} more".`;
  } else if (activeVariant === 'advanced_word_problem_count_back') {
    const isThousands = Math.random() > 0.5;
    const rate = isThousands ? (Math.floor(Math.random() * 2) + 1) * 1000 : (Math.floor(Math.random() * 8) + 2) * 100;
    const periods = Math.floor(Math.random() * 3) + 2; // 2 to 4 periods
    const minBase = (rate * periods) + 1000;
    const baseNumber = Math.floor(Math.random() * (9900 - minBase + 1) / 100) * 100 + minBase + getTensOnes();
    
    promptInstruction = `- Create a creative and engaging word problem featuring ${name} and ${item} at ${setting}. Inject a strong local Singaporean flavour into the story.\\n- The math structure MUST be: Starts with ${baseNumber}. Then decreases by a rate of ${rate} per time period for ${periods} time periods. Ask for the final amount left.\\n- Feel free to be generative with the scenario (e.g. giving away ${item} every day, spending them, etc.) but the phrasing must emphasize this step-by-step counting back nature.`;
  } else if (activeVariant === 'advanced_two_step_word_problem') {
    const rate1000 = (Math.floor(Math.random() * 2) + 1) * 1000; // 1000 or 2000
    const periods1000 = Math.floor(Math.random() * 2) + 2; // 2 to 3
    const rate100 = (Math.floor(Math.random() * 5) + 2) * 100; // 200 to 600
    const periods100 = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const totalAdded = (rate1000 * periods1000) + (rate100 * periods100);
    const maxBase = 9900 - totalAdded;
    const baseNumber = Math.floor(Math.random() * (maxBase - 1000 + 1) / 100) * 100 + 1000 + getTensOnes();
    
    promptInstruction = `- Create a creative two-step word problem featuring ${name} and ${item} at ${setting}. Inject a strong local Singaporean flavour into the story.\\n- The math structure MUST be: Starts with ${baseNumber}. It increases by ${rate1000} every period for ${periods1000} periods, and then increases by ${rate100} every period for ${periods100} periods. Ask for the final amount.\\n- Be generative with the story (e.g. first month vs second month), but maintain the step-by-step counting phrasing.`;
  } else if (activeVariant === 'advanced_finding_initial_amount') {
    const isThousands = Math.random() > 0.5;
    const rate = isThousands ? (Math.floor(Math.random() * 2) + 1) * 1000 : (Math.floor(Math.random() * 8) + 2) * 100;
    const periods = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const addedAmount = periods * rate;
    const maxInitial = 9900 - addedAmount;
    const initialQty = Math.floor(Math.random() * (maxInitial - 1000 + 1) / 100) * 100 + 1000 + getTensOnes();
    const finalQty = initialQty + addedAmount;
    
    promptInstruction = `- Create a reverse word problem (working backwards) featuring ${name} and ${item} at ${setting}. Inject a strong local Singaporean flavour into the story.\\n- The math structure MUST be: ${name} collects/increases by ${rate} every time period for ${periods} time periods. They end up with a total of ${finalQty} ${item}. Ask how many they had at first.\\n- Be generative and creative with the story, but emphasize the step-by-step counting sequence.`;
  } else if (activeVariant === 'advanced_daily_saving_pattern') {
    const isThousands = Math.random() > 0.5;
    const dailyAmt = isThousands ? (Math.floor(Math.random() * 2) + 1) * 1000 : (Math.floor(Math.random() * 8) + 2) * 100;
    // Cap days to 4 if it's thousands to prevent exceeding 10000 (e.g. 2000 * 5 = 10000 + base)
    const days = isThousands ? Math.floor(Math.random() * 2) + 3 : Math.floor(Math.random() * 4) + 3; // 3 to 4 days for thousands, 3 to 6 for hundreds
    const addedAmount = dailyAmt * days;
    const maxBase = 9900 - addedAmount;
    const baseNumber = Math.floor(Math.random() * (maxBase - 1000 + 1) / 100) * 100 + 1000 + getTensOnes();
    
    promptInstruction = `- Create a creative daily pattern word problem featuring ${name} and ${item} at ${setting}. Inject a strong local Singaporean flavour into the story.\\n- The math structure MUST be: Starts with ${baseNumber}. Collects ${dailyAmt} more every day for ${days} days. Ask for the final amount.\\n- Be generative with the story to make it engaging, while emphasizing the daily step-by-step counting nature.`;
  }

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Counting by Hundreds/Thousands.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
${promptInstruction}
- If MCQ, provide 4 options.
- The finalAnswer must be just the numeral.

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
