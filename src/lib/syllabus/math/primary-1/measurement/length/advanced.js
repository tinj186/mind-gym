/**
 * Advanced: Operational logic with non-standard units.
 * PATH: src/lib/syllabus/math/primary-1/measurement/length/advanced.js
 */
export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Length', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1', heuristic: 'Indirect Operational Logic' };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  const lengthA = Math.floor(Math.random() * 4) + 6; // Base length between 6 and 9
  const difference = Math.floor(Math.random() * 3) + 2; // Difference between 2 and 4
  const isShorter = Math.random() > 0.5;
  const lengthB = isShorter ? (lengthA - difference) : (lengthA + difference);

  const itemsPool = ["Cutter", "Highlighter", "Pen", "Pencil", "Usbdrive"];
  const items = [...itemsPool].sort(() => Math.random() - 0.5).map((name, i) => `${name} ${String.fromCharCode(65 + i)}`);
  const item1 = items[0];
  const item2 = items[1];

  const units = [
    { name: "paperclips", icon: "paperclip.svg" },
    { name: "paperpins", icon: "paperpin.svg" },
  ];
  const selectedUnit = units[Math.floor(Math.random() * units.length)];

  const componentData = {
    items: [
      { label: item1, length: lengthA },
      { label: item2, length: lengthB }
    ],
    unitIcon: selectedUnit.icon
  };

  const promptObject = {
    meta: commonMeta,
    content: {
      questionText: `[Insert structured word problem: ${item1} is ${lengthA} ${selectedUnit.name} long. ${item2} is ${difference} ${selectedUnit.name} ${isShorter ? 'shorter' : 'longer'} than ${item1}. How many ${selectedUnit.name} long is ${item2}?]`,
      finalAnswer: String(lengthB),
      // ✅ FIXED: Enforces unique option items to prevent layout rendering breaks
      options: isMCQ ? [
        String(lengthB), 
        String(lengthA), 
        String(lengthA + difference), 
        String(Math.max(1, lengthB - 2))
      ].filter((v, i, a) => a.indexOf(v) === i).sort(() => Math.random() - 0.5) : null,
      solutionSteps: `[Provide child-friendly breakdown: ${lengthA} ${isShorter ? '-' : '+'} ${difference} = ${lengthB} ${selectedUnit.name}]`
    },
    visualEngine: {
      componentToRender: "MEASUREMENT_UNIT",
      componentData: componentData
    },
    inputRequirement: { inputType }
  };

  const constitution = isShort ? "SHORT QUESTION MANDATE: Pure mathematical logic only. Keep questionText extremely direct (e.g., 'Item A is 6 units. Item B is 2 units longer. How long is Item B?'). NO character names or fluff." : "STANDARD MANDATE: Use localized story elements for a 6-year-old (e.g., 'Siti has a ribbon...'). Keep sentences short.";

  const instructions = `
    TASK: Generate an advanced Primary 1 structured word problem tracking compound positional lengths using non-standard units.
    
    STRICT GENERATOR CONSTRAINTS:
    - The structural data inside visualEngine items array must remain exactly as seeded.
    - Item 1 (${item1}) length is fixed at ${lengthA}. Item 2 (${item2}) length is fixed at ${lengthB}.
    - Ensure your question narrative text and finalAnswer perfectly synchronize with these calculation numbers.
    
    Return ONLY clean, valid JSON format.
    ${JSON.stringify(promptObject)}
  `.trim();

  return { aiPrompt: instructions, parseResponse: (json) => json };
}