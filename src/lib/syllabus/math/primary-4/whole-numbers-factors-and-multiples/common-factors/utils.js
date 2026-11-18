/**
 * Shared helpers for Primary 4 Common Factors variants.
 */

export const ALL_MODEL_OPTIONS = [
  { id: 'COMPARISON', label: 'Comparison Model', description: 'Compare quantities of distinct entities' },
  { id: 'PART_WHOLE', label: 'Part-Whole Model', description: 'Divide a single whole quantity into parts' },
  { id: 'BEFORE_AFTER', label: 'Before & After Model', description: 'Show transfer or change over time' }
];

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getFactors = (n) => {
  const res = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      res.push(i);
      if (i !== n / i) res.push(n / i);
    }
  }
  return res.sort((a, b) => a - b);
};

export const getGCF = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
};

export const getCommonFactors = (a, b) => getFactors(getGCF(a, b));

export const formatList = (arr) => arr.join(', ');

export const acceptedListVariants = (arr) => {
  const withSpaces = arr.join(', ');
  const noSpaces = arr.join(',');
  const spaceOnly = arr.join(' ');
  return [...new Set([withSpaces, noSpaces, spaceOnly])];
};

export const makeDivEq = (dividend, divisor) => {
  const q = Math.floor(dividend / divisor);
  const r = dividend % divisor;
  if (r === 0) {
    return {
      expected: `${dividend} / ${divisor} = ${q}`,
      accepted: [
        `${dividend} / ${divisor} = ${q}`,
        `${dividend}/${divisor}=${q}`,
        `${dividend} ÷ ${divisor} = ${q}`,
        `${dividend}÷${divisor}=${q}`
      ]
    };
  }
  return {
    expected: `${dividend} / ${divisor} = ${q} R ${r}`,
    accepted: [
      `${dividend} / ${divisor} = ${q} R ${r}`,
      `${dividend}/${divisor}=${q}R${r}`,
      `${dividend}/${divisor}=${q} R ${r}`,
      `${dividend} ÷ ${divisor} = ${q} R ${r}`,
      `${dividend}÷${divisor}=${q}R${r}`,
      `${dividend} / ${divisor} = ${q} remainder ${r}`,
      `${dividend} ÷ ${divisor} = ${q} remainder ${r}`
    ]
  };
};

export const makeSubEq = (a, b, res) => [
  `${a} - ${b} = ${res}`,
  `${a}-${b}=${res}`,
  String(res)
];

export const makeMulEq = (a, b, res) => [
  `${a} * ${b} = ${res}`,
  `${a}*${b}=${res}`,
  `${a} x ${b} = ${res}`,
  `${a}x${b}=${res}`,
  `${b} * ${a} = ${res}`,
  `${b}*${a}=${res}`,
  `${b} x ${a} = ${res}`,
  `${b}x${a}=${res}`
];

export const buildFourUniqueOptions = (correctAnswer, distractorPairs) => {
  const options = [String(correctAnswer)];
  const defectMap = {};

  for (const { value, defect } of distractorPairs) {
    const valStr = String(value);
    if (!options.includes(valStr)) {
      options.push(valStr);
      defectMap[valStr] = defect;
    }
    if (options.length === 4) break;
  }

  let pad = 1;
  while (options.length < 4) {
    const numeric = Number(correctAnswer);
    const candidate = Number.isFinite(numeric) ? String(numeric + pad) : `${correctAnswer} (${pad})`;
    if (!options.includes(candidate)) {
      options.push(candidate);
      defectMap[candidate] = 'CARELESS_CALCULATION';
    }
    pad++;
  }

  const shuffled = [...options].sort(() => Math.random() - 0.5);
  return { options: shuffled, defectMap };
};

export const buildPromptPayload = ({
  difficulty,
  isMCQ,
  isShort,
  isStructure,
  getFormatInstructions,
  askText,
  answer,
  acceptedAnswers = [],
  mcqData = null,
  solutionSteps,
  hint,
  visualEngineObj,
  inputRequirementObj,
  variantKey
}) => {
  const visualEngineStr = JSON.stringify(visualEngineObj || { componentToRender: 'NONE', componentData: { hideVisual: true } });
  const inputRequirementStr = inputRequirementObj ? JSON.stringify(inputRequirementObj) : null;
  const formatInstr = getFormatInstructions(visualEngineStr, inputRequirementStr, acceptedAnswers);

  const mcqPromptBlock = isMCQ && mcqData
    ? `\nGenerate EXACTLY 4 options in "content.options":\n${mcqData.options.map((o) => `- "${o}"`).join('\n')}\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${answer}") exactly.\nIn "content.defectMap", use EXACTLY: ${JSON.stringify(mcqData.defectMap)}`
    : '';

  const aiPrompt = `You are an expert Primary 4 Singapore Math question generator for Common Factors.
${formatInstr}

CRITICAL INSTRUCTIONS:
1. ${askText.startsWith('STORY:')
    ? 'Rewrite the STORY template into a natural Singaporean Primary 4 math word problem. Preserve ALL exact numbers and entities. NEVER add extra unrequested questions. Keep the final question sentence as instructed. DO NOT include the word "STORY:" in questionText.'
    : 'Your "content.questionText" MUST match the exact askText provided below. DO NOT add story fluff or change any numbers.'}
2. Your "content.finalAnswer" MUST be EXACTLY "${answer}".
3. Generate clear step-by-step "content.solutionSteps" (separate steps using the exact characters \\\\n inside the string) matching:
${solutionSteps}
4. Use "content.hint": "${hint}"
5. DO NOT alter "visualEngine" or "inputRequirement" from the JSON template above.${mcqPromptBlock}

askText:
${askText}`;

  return {
    aiPrompt,
    visualEngine: visualEngineObj || { componentToRender: 'NONE', componentData: { hideVisual: true } },
    inputRequirement: inputRequirementObj || {
      inputType: isMCQ ? 'MCQ_BUTTONS' : isShort ? 'STANDARD_TEXT' : 'MULTI_STEP_INPUT'
    },
    acceptedAnswers: acceptedAnswers.length > 0 ? acceptedAnswers : [String(answer)],
    metadata: {
      difficulty: String(difficulty || 'foundation').toLowerCase(),
      variant: variantKey,
      steps: inputRequirementObj?.steps?.length || 1
    }
  };
};

