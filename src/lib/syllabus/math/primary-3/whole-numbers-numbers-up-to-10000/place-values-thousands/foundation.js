export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let promptInstruction = "";
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

  if (activeVariant === 'foundation_visual') {
    const num = Math.floor(Math.random() * 8999) + 1000;
    const th = Math.floor(num / 1000);
    const h = Math.floor((num % 1000) / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;
    visualEngineStr = `{\n    "componentToRender": "BASE_TEN_BLOCKS",\n    "componentData": { "thousands": ${th}, "hundreds": ${h}, "tens": ${t}, "ones": ${o} }\n  }`;
    promptInstruction = `- Create a question asking the student to look at blocks and identify the number they show.\\n- Use exactly the number ${num} as the target answer.\\n- The finalAnswer must be just the numeral.`;
  } else if (activeVariant === 'foundation_blocks_needed') {
    const num = Math.floor(Math.random() * 8999) + 1000;
    const th = Math.floor(num / 1000);
    const h = Math.floor((num % 1000) / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;
    promptInstruction = `- Create a question asking how many thousand blocks, hundred blocks, ten blocks, and one blocks are needed to show the number ${num}.\\n- The finalAnswer must be formatted exactly like: "${th} thousands, ${h} hundreds, ${t} tens, ${o} ones".`;
  } else if (activeVariant === 'foundation_identify_place') {
    // Generate distinct digits to avoid ambiguity
    let th = Math.floor(Math.random() * 9) + 1;
    let h = Math.floor(Math.random() * 10);
    while (h === th) h = Math.floor(Math.random() * 10);
    let t = Math.floor(Math.random() * 10);
    while (t === th || t === h) t = Math.floor(Math.random() * 10);
    let o = Math.floor(Math.random() * 10);
    while (o === th || o === h || o === t) o = Math.floor(Math.random() * 10);
    const num = (th * 1000) + (h * 100) + (t * 10) + o;
    
    const places = ['thousands', 'hundreds', 'tens', 'ones'];
    const place = places[Math.floor(Math.random() * places.length)];
    promptInstruction = `- Create a question asking which digit is in the ${place} place of the number ${num}.\\n- The finalAnswer must be just the single digit numeral.`;
  } else if (activeVariant === 'foundation_build_from_parts') {
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    promptInstruction = `- Create a question asking to write the number that is made of ${th} thousands, ${h} hundreds, ${t} tens, and ${o} ones.\\n- The finalAnswer must be just the numeral.`;
  } else if (activeVariant === 'foundation_expanded_form_addition') {
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 9) + 1;
    promptInstruction = `- Create a question asking to find the total of the expanded form: ${th * 1000} + ${h * 100} + ${t * 10} + ${o}.\\n- The finalAnswer must be just the numeral.`;
  }

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Place Values (Thousands).
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
