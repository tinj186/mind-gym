export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let promptInstruction = "";
  const item = context.items[0] || 'cards';

  if (activeVariant === 'advanced_word_problem') {
    const startQty = Math.floor(Math.random() * 250) + 150; // 150 to 399
    const packets = Math.floor(Math.random() * 4) + 2; // 2 to 5 packets
    const packetSize = Math.random() > 0.5 ? 10 : 100;
    promptInstruction = `- Create a word problem involving counting by 10s or 100s.\\n- Use EXACTLY these values: ${context.name} has ${startQty} ${item}. He buys ${packets} packets of ${packetSize} ${item}. How many does he have now?\\n- Rephrase the story to be engaging, but keep the math operations and numbers identical.`;
  } else if (activeVariant === 'advanced_word_problem_count_back') {
    const startQty = Math.floor(Math.random() * 400) + 500; // 500 to 899
    const packets = Math.floor(Math.random() * 4) + 2; // 2 to 5 packets
    const packetSize = Math.random() > 0.5 ? 10 : 100;
    promptInstruction = `- Create a word problem involving counting back by 10s or 100s.\\n- Use EXACTLY these values: ${context.name} has ${startQty} ${item}. He gives away/spends ${packets} packets of ${packetSize} ${item}. How many does he have left?\\n- Rephrase the story to be engaging, but keep the math operations and numbers identical.`;
  } else if (activeVariant === 'advanced_two_step_word_problem') {
    const startQty = Math.floor(Math.random() * 200) + 100; // 100 to 299
    const packs100 = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const packs10 = Math.floor(Math.random() * 5) + 2; // 2 to 6
    promptInstruction = `- Create a two-step word problem involving both 10s and 100s.\\n- Use EXACTLY these values: ${context.name} has ${startQty} ${item}. He receives ${packs100} boxes of 100 and ${packs10} packets of 10. How many does he have in total?\\n- Rephrase the story to be engaging, but keep the math operations and numbers identical.`;
  } else if (activeVariant === 'advanced_finding_initial_amount') {
    const packets = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const packetSize = Math.random() > 0.5 ? 10 : 100;
    const addedAmount = packets * packetSize;
    // ensure finalQty is greater than addedAmount
    const initialQty = Math.floor(Math.random() * 400) + 100; // 100 to 499
    const finalQty = initialQty + addedAmount;
    promptInstruction = `- Create a reverse word problem (working backwards).\\n- Use EXACTLY these values: ${context.name} receives ${packets} packets of ${packetSize} ${item}. He now has a total of ${finalQty} ${item}. How many did he have at first?\\n- Rephrase the story to be engaging, but keep the math operations and numbers identical.`;
  } else if (activeVariant === 'advanced_daily_saving_pattern') {
    const startQty = Math.floor(Math.random() * 200) + 100; // 100 to 299
    const dailyAmt = Math.random() > 0.5 ? 10 : 100;
    const days = Math.floor(Math.random() * 5) + 3; // 3 to 7 days
    promptInstruction = `- Create a word problem involving a daily pattern.\\n- Use EXACTLY these values: ${context.name} starts with ${startQty} ${item}. He collects ${dailyAmt} more every day for ${days} days. How many does he have at the end?\\n- Rephrase the story to be engaging, but keep the math operations and numbers identical.`;
  }

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Counting by Tens/Hundreds.
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
