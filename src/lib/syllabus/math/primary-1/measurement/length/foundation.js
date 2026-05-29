/**
 * Foundation Tier: Non-standard units, basic comparison, and equality.
 * PATH: src/lib/syllabus/math/primary-1/measurement/length/foundation.js
 */
export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Length', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1' };
  
  // MCQ is highly preferred for comparative foundation logic
  const inputType = (activeVariant !== 'foundation_unit_counting') ? 'MCQ_BUTTONS' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  const itemsPool = ["Cutter", "Highlighter", "Pen", "Pencil", "Usbdrive"];
const units = [
  { name: "paperclips", icon: "paperclip.svg" },
  { name: "paperpins", icon: "paperpin.svg" },
  ];

  const selectedUnit = units[Math.floor(Math.random() * units.length)];
  let componentData = { items: [], unitIcon: selectedUnit.icon };
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender: "MEASUREMENT_UNIT" }, inputRequirement: { inputType } };
  let seedInstructions = "";

  // 楳 VARIANT ROUTING LOGIC
  switch (activeVariant) {
    case 'foundation_compare_two': {
      commonMeta.heuristic = 'Comparative Vocabulary';
      const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 2);
      const len1 = Math.floor(Math.random() * 3) + 4; // 4 to 6
      const len2 = len1 + Math.floor(Math.random() * 3) + 1; // Guarantee different lengths
      
      const isAskingLonger = Math.random() > 0.5;
      const shuffled = [{ label: selection[0], length: len1 }, { label: selection[1], length: len2 }].sort(() => 0.5 - Math.random());
      
      const targetItem = isAskingLonger 
        ? shuffled.reduce((a, b) => a.length > b.length ? a : b)
        : shuffled.reduce((a, b) => a.length < b.length ? a : b);

      // Generate 2 additional distractors from the pool to reach 4 options
      const distractors = itemsPool.filter(i => !selection.includes(i)).sort(() => 0.5 - Math.random()).slice(0, 2);

      componentData.items = shuffled;
      promptObject.content = {
        questionText: `Which object is ${isAskingLonger ? 'longer' : 'shorter'}?`,
        options: [...shuffled.map(i => i.label), ...distractors].sort(() => 0.5 - Math.random()),
        finalAnswer: targetItem.label,
        solutionSteps: `The ${targetItem.label} is ${targetItem.length} units long. It is the ${isAskingLonger ? 'longer' : 'shorter'} object.`,
        hint: "Look at both objects! See which one reaches further to the right."
      };
      seedInstructions = `Target objective: Identify the ${isAskingLonger ? 'LONGER' : 'SHORTER'} item. True answer: ${targetItem.label}.`;
      break;
    }

    case 'foundation_find_same': {
      commonMeta.heuristic = 'Length Equality';
      const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 3);
      const targetLen = Math.floor(Math.random() * 3) + 5; // 5 to 7
      const offLen = targetLen + (Math.random() > 0.5 ? 2 : -2); // Guarantee noticeably different
      
      const itemsArr = [
        { label: selection[0], length: targetLen },
        { label: selection[1], length: targetLen },
        { label: selection[2], length: offLen }
      ].sort(() => 0.5 - Math.random());

      const correctPair = itemsArr.filter(i => i.length === targetLen).map(i => i.label);
      
      componentData.items = itemsArr;
      promptObject.content = {
        questionText: `Which two objects have the same length?`,
        options: [
          `${itemsArr[0].label} and ${itemsArr[1].label}`,
          `${itemsArr[1].label} and ${itemsArr[2].label}`,
          `${itemsArr[0].label} and ${itemsArr[2].label}`,
          "None of them"
        ],
        finalAnswer: `${correctPair[0]} and ${correctPair[1]}`,
        solutionSteps: `Both the ${correctPair[0]} and the ${correctPair[1]} are exactly ${targetLen} units long.`,
        hint: "Try counting the blocks for each object. Do any have the same count?"
      };
      seedInstructions = `Target objective: Identify the two items of EQUAL length (${targetLen} units). True answer: "${correctPair[0]} and ${correctPair[1]}".`;
      break;
    }

    case 'foundation_identify_by_length': {
      commonMeta.heuristic = 'Attribute Matching';
      const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 4);
      const lengths = [4, 6, 8, 3].sort(() => 0.5 - Math.random());
      
      const itemsArr = selection.map((label, idx) => ({ label, length: lengths[idx] }));
      const targetItem = itemsArr[Math.floor(Math.random() * itemsArr.length)];

      componentData.items = itemsArr;
      promptObject.content = {
        questionText: `Which object is exactly ${targetItem.length} ${selectedUnit.name} long?`,
        options: itemsArr.map(i => i.label),
        finalAnswer: targetItem.label,
        solutionSteps: `Counting the ${selectedUnit.name}, the ${targetItem.label} matches exactly ${targetItem.length} units.`,
        hint: `Count the ${selectedUnit.name} under each object carefully to find the match!`
      };
      seedInstructions = `Target objective: Find the item that is exactly ${targetItem.length} units long. True answer: ${targetItem.label}.`;
      break;
    }

    case 'foundation_true_false': {
      commonMeta.heuristic = 'Logical Evaluation';
      const selection = [...itemsPool].sort(() => 0.5 - Math.random()).slice(0, 2);
      const len1 = Math.floor(Math.random() * 3) + 4; // 4 to 6
      const len2 = len1 + Math.floor(Math.random() * 3) + 1;
      
      const shuffled = [{ label: selection[0], length: len1 }, { label: selection[1], length: len2 }].sort(() => 0.5 - Math.random());
      const itemA = shuffled[0];
      const itemB = shuffled[1];
      
      // Randomly decide if the generated statement should be True or False
      const makeStatementTrue = Math.random() > 0.5;
      const isALonger = itemA.length > itemB.length;
      
      // Construct the statement
      const useLongerTerm = makeStatementTrue ? isALonger : !isALonger;
      const statement = `The ${itemA.label} is ${useLongerTerm ? 'longer' : 'shorter'} than the ${itemB.label}.`;
      const correctAnswer = makeStatementTrue ? 'True' : 'False';

      componentData.items = shuffled;
      promptObject.content = {
        questionText: `Look at the objects. Is this statement True or False?\n\n"${statement}"`,
        options: ['True', 'False', 'They are the same length', 'Cannot tell'],
        finalAnswer: correctAnswer,
        solutionSteps: `The ${itemA.label} is ${itemA.length} units. The ${itemB.label} is ${itemB.length} units. Therefore, the statement is ${correctAnswer}.`,
        hint: "Count the units for both objects and check if the sentence is right!"
      };
      seedInstructions = `Target objective: True/False Evaluation. The generated statement is "${statement}". The mathematically correct answer is "${correctAnswer}".`;
      break;
    }

    default: // foundation_unit_counting
      commonMeta.heuristic = 'Unit Counting';
      const selectedTarget = itemsPool[Math.floor(Math.random() * itemsPool.length)];
      const lengthCount = Math.floor(Math.random() * 6) + 3;

      componentData.items = [{ label: selectedTarget, length: lengthCount }];
      promptObject.content = {
        questionText: `How many ${selectedUnit.name} long is the ${selectedTarget}?`,
        options: isMCQ ? [String(lengthCount), String(lengthCount + 2), String(Math.max(1, lengthCount - 1)), String(lengthCount + 1)].sort() : null,
        finalAnswer: String(lengthCount),
        solutionSteps: `Counting the units from start to finish, the ${selectedTarget} is ${lengthCount} ${selectedUnit.name} long.`,
        hint: `Count the ${selectedUnit.name} one by one from the start line to the end tip!`
      };
      seedInstructions = `Target objective: Count the units. True answer string: "${lengthCount}".`;
      break;
  }

  // Assign generated payload
  promptObject.visualEngine.componentData = componentData;

  const instructions = `
    TASK: Generate a Primary 1 Length question.
    VARIANT: ${activeVariant}
    PEDAGOGY: Use non-standard measuring units. NO metric mentions (cm, m). Keep sentences simple for 6-year-olds.
    
    CRITICAL PROMPT SEED CONSTRAINTS:
    - Your output JSON object MUST include the 'content.hint' parameter string. It cannot be null or empty. // Corrected from hintText
    - The 'content.solutionSteps' MUST be a text-only explanation. Do not repeat visual rendering instructions.
    - ${seedInstructions}
    - You MUST NEVER alter the 'items' lengths inside the visualEngine data.
    - Your content.finalAnswer MUST strictly match the true mathematical reality established by the seeds.
    
    OUTPUT MANDATE: Return ONLY a valid JSON object structure matching this shape. No markdown blocks.
    ${JSON.stringify(promptObject)}
  `;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}