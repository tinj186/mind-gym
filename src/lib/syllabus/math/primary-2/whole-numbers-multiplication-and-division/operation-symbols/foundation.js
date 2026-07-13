export const foundationLogic = function (
  activeVariant,
  difficulty,
  type,
  isMCQ,
  isShort,
  isStructure,
  zodType,
  zodDiff,
  levelName,
  topic,
  getFormatInstructions,
  context,
  selectedContextItem,
  getQText
) {
  let askText = '';
  let answer = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  if (activeVariant === 'foundation_identify_multiply') {
    const groups = Math.floor(Math.random() * 5) + 2;
    const items = Math.floor(Math.random() * 5) + 2;

    answer = "x";
    askText = getQText(
      `${groups} groups of ${items} is written as: ${groups} [?] ${items}. What is the missing symbol?`,
      `${groups} groups of ${items} -> ${groups} [?] ${items}`
    );

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Does 'groups of' mean we add, subtract, multiply, or divide?", "expectedAnswer": "multiply" },\n      { "label": "What symbol do we use for multiplication?", "expectedAnswer": "x" }\n    ]\n  }`;
    }
    
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "x", "÷", "+", "-"
      2. Set defectMap as: { "+": "CONFUSED_OPERATION", "-": "CONFUSED_OPERATION", "÷": "CONFUSED_OPERATION" }
      3. Solution should state that "groups of" refers to multiplication, which uses the 'x' symbol.
    `;
  }
  else if (activeVariant === 'foundation_identify_divide') {
    const groups = Math.floor(Math.random() * 4) + 2;
    const items = Math.floor(Math.random() * 4) + 2;
    const total = groups * items;

    answer = "÷";
    askText = getQText(
      `Sharing ${total} equally into ${groups} groups is written as: ${total} [?] ${groups}. What is the missing symbol?`,
      `Share ${total} into ${groups} groups -> ${total} [?] ${groups}`
    );

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Does 'sharing equally' mean we add, subtract, multiply, or divide?", "expectedAnswer": "divide" },\n      { "label": "What symbol do we use for division?", "expectedAnswer": "÷" }\n    ]\n  }`;
    }
    
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "÷", "x", "+", "-"
      2. Set defectMap as: { "+": "CONFUSED_OPERATION", "-": "CONFUSED_OPERATION", "x": "CONFUSED_OPERATION" }
      3. Solution should state that "sharing equally" refers to division, which uses the '÷' symbol.
    `;
  }
  else if (activeVariant === 'foundation_missing_symbol_direct') {
    const isMultiply = Math.random() > 0.5;
    const a = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const b = Math.floor(Math.random() * 5) + 2;
    const c = a * b;

    if (isMultiply) {
      answer = "x";
      askText = `Fill in the missing symbol: ${a} [?] ${b} = ${c}`;
      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Is ${c} larger or smaller than ${a} and ${b}?", "expectedAnswer": "larger" },\n      { "label": "Write the full equation including the equal sign.", "expectedAnswer": "${a} x ${b} = ${c}" }\n    ]\n  }`;
      }
    } else {
      answer = "÷";
      askText = `Fill in the missing symbol: ${c} [?] ${a} = ${b}`;
      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Are we putting groups together or breaking ${c} into parts?", "expectedAnswer": "breaking into parts" },\n      { "label": "Write the full equation including the equal sign.", "expectedAnswer": "${c} ÷ ${a} = ${b}" }\n    ]\n  }`;
      }
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "x", "÷", "+", "-"
      2. Set defectMap for the incorrect symbols to "CONFUSED_OPERATION".
      3. Solution should calculate both adding and multiplying/dividing to prove which symbol produces the correct result.
    `;
  }

  const aiPrompt = `
    You are an expert Math curriculum designer for Primary 2 students.
    Generate a ${type} question based on this variant: ${activeVariant}.

    Question parameters:
    - The question should ask for the missing symbol.
    - askText: ${askText}
    - answer: ${answer}

    ${customConstraints}

    ${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `;

  return { aiPrompt };
};
