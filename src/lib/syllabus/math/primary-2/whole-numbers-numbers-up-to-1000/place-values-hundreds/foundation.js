export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let promptInstruction = "";
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

  if (activeVariant === 'foundation_visual') {
    const num = Math.floor(Math.random() * 899) + 100;
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;
    visualEngineStr = `{\n    "componentToRender": "BASE_TEN_BLOCKS",\n    "componentData": { "hundreds": ${h}, "tens": ${t}, "ones": ${o} }\n  }`;
    promptInstruction = `- Create a question asking the student to look at blocks and identify the number they show.\\n- Use exactly the number ${num} as the target answer.\\n- The finalAnswer must be just the numeral.`;
  } else if (activeVariant === 'foundation_blocks_needed') {
    const num = Math.floor(Math.random() * 899) + 100;
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;
    promptInstruction = `- Create a question asking how many hundred blocks, ten blocks, and one blocks are needed to show the number ${num}.\\n- The finalAnswer must be formatted exactly like: "${h} hundreds, ${t} tens, ${o} ones".`;
  } else if (activeVariant === 'foundation_identify_place') {
    // Generate distinct digits to avoid ambiguity
    let h = Math.floor(Math.random() * 9) + 1;
    let t = Math.floor(Math.random() * 10);
    while (t === h) t = Math.floor(Math.random() * 10);
    let o = Math.floor(Math.random() * 10);
    while (o === h || o === t) o = Math.floor(Math.random() * 10);
    const num = (h * 100) + (t * 10) + o;
    
    const places = ['hundreds', 'tens', 'ones'];
    const place = places[Math.floor(Math.random() * places.length)];
    promptInstruction = `- Create a question asking which digit is in the ${place} place of the number ${num}.\\n- The finalAnswer must be just the single digit numeral.`;
  } else if (activeVariant === 'foundation_build_from_parts') {
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    promptInstruction = `- Create a question asking to write the number that is made of ${h} hundreds, ${t} tens, and ${o} ones.\\n- The finalAnswer must be just the numeral.`;
  } else if (activeVariant === 'foundation_expanded_form_addition') {
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 9) + 1;
    promptInstruction = `- Create a question asking to find the total of the expanded form: ${h * 100} + ${t * 10} + ${o}.\\n- The finalAnswer must be just the numeral.`;
  }

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Place Values (Hundreds).
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
${promptInstruction}
- If MCQ, provide 4 options.

${getFormatInstructions(visualEngineStr)}`;

  return {
    aiPrompt: aiPrompt
  };
}
