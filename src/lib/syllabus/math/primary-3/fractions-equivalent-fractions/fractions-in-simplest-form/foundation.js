export const foundationLogic = {
  generate: function (difficulty, activeVariant, type, context, selectedContextItem, getQText) {
    let askText = "";
    let hint = "";
    let solutionSteps = [];
    let answer = "";
    let customConstraints = "";
    let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
    let inputRequirementStr = null;

    if (activeVariant === 'foundation_visual_simplification') {
      const options = [
        { num: 2, denom: 4, div: 2 }, // 1/2
        { num: 4, denom: 8, div: 4 }, // 1/2
        { num: 2, denom: 8, div: 2 }, // 1/4
        { num: 6, denom: 8, div: 2 }, // 3/4
        { num: 2, denom: 6, div: 2 }, // 1/3
        { num: 4, denom: 6, div: 2 }, // 2/3
        { num: 3, denom: 9, div: 3 }, // 1/3
        { num: 6, denom: 9, div: 3 }  // 2/3
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      const num = selected.num;
      const denom = selected.denom;
      const divisor = selected.div;
      
      const simpleNum = num / divisor;
      const simpleDenom = denom / divisor;
      
      answer = `${simpleNum}/${simpleDenom}`;
      
      let structText, shortText;
      const isFood = Math.random() > 0.5;
      
      if (isFood) {
        structText = `${context.name} cuts a ${selectedContextItem} into ${denom} equal slices and eats ${num}. Express the fraction of the ${selectedContextItem} eaten in its simplest form.`;
        shortText = `Express ${num}/${denom} in its simplest form.`;
      } else {
        structText = `A ${selectedContextItem} is cut into ${denom} equal parts, and ${context.name} uses ${num} parts. What fraction of the ${selectedContextItem} is used, in its simplest form?`;
        shortText = `Simplify ${num}/${denom}.`;
      }

      hint = `Divide both the top and bottom number by ${divisor} to find the simplest form.`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          models: [
            {
              modelType: "PART_WHOLE",
              parts: [{ value: "", segments: num, layoutSize: num }, { value: "", segments: denom - num, layoutSize: denom - num }],
              whole: String(denom),
              barLabel: "Original",
              isStatic: true
            },
            {
              modelType: "PART_WHOLE",
              parts: [{ value: "", segments: simpleNum, layoutSize: simpleNum }, { value: "", segments: simpleDenom - simpleNum, layoutSize: simpleDenom - simpleNum }],
              whole: String(simpleDenom),
              barLabel: "Simplest",
              isStatic: true
            }
          ]
        }
      });

      if (type === 'Structured') {
        askText = structText;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Simplified numerator", expectedAnswer: `${num}/${divisor}=${simpleNum}` },
            { label: "Simplified denominator", expectedAnswer: `${denom}/${divisor}=${simpleDenom}` },
            { label: "Simplified fraction", expectedAnswer: answer }
          ]
        });
      } else {
        askText = getQText(structText, shortText);
      }

      solutionSteps = [
        `Divide both the top and bottom by ${divisor}.`,
        `${num} ÷ ${divisor} = ${simpleNum}`,
        `${denom} ÷ ${divisor} = ${simpleDenom}`,
        `The simplest form is ${answer}.`
      ];
    } else if (activeVariant === 'foundation_divide_by_x') {
      const options = [
        { num: 2, denom: 4, div: 2 },
        { num: 2, denom: 6, div: 2 },
        { num: 4, denom: 6, div: 2 },
        { num: 2, denom: 8, div: 2 },
        { num: 6, denom: 8, div: 2 },
        { num: 3, denom: 6, div: 3 },
        { num: 3, denom: 9, div: 3 },
        { num: 6, denom: 9, div: 3 },
        { num: 4, denom: 8, div: 4 },
        { num: 4, denom: 12, div: 4 },
        { num: 8, denom: 12, div: 4 }
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      const num = selected.num;
      const denom = selected.denom;
      const divisor = selected.div;
      
      const simpleNum = num / divisor;
      const simpleDenom = denom / divisor;
      
      answer = `${simpleNum}/${simpleDenom}`;
      hint = `Divide both the top and bottom numbers by ${divisor}.`;

      visualEngineStr = JSON.stringify({
        componentToRender: "FRACTION_EQUIVALENCE",
        componentData: {
          before: { num: num, denom: denom },
          after: { num: '?', denom: '?' },
          operator: '÷',
          factor: divisor
        }
      });

      if (type === 'Structured') {
        askText = `${context.name} has ${denom} ${selectedContextItem}s and gives away ${num}. To find the simplest fraction given away, divide both numbers in ${num}/${denom} by ${divisor}. What is the answer?`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Simplified numerator", expectedAnswer: `${num}/${divisor}=${simpleNum}` },
            { label: "Simplified denominator", expectedAnswer: `${denom}/${divisor}=${simpleDenom}` },
            { label: "Simplified fraction", expectedAnswer: answer }
          ]
        });
      } else {
        askText = getQText(
          `${context.name} has ${denom} ${selectedContextItem}s and gives away ${num}. To find the simplest fraction given away, divide both numbers in ${num}/${denom} by ${divisor}. What is the answer?`,
          `Divide the numerator and denominator of ${num}/${denom} by ${divisor} to find its simplest form.`
        );
      }

      solutionSteps = [
        `${num} ÷ ${divisor} = ${simpleNum}`,
        `${denom} ÷ ${divisor} = ${simpleDenom}`,
        `The simplest form is ${answer}.`
      ];
    } else if (activeVariant === 'foundation_true_false') {
      const options = [
        { f1: "2/4", f2: "4/8", f3: "3/5", ans: "3/5", s1: "1/2", s2: "1/2", s3: "3/5" },
        { f1: "2/6", f2: "3/9", f3: "2/5", ans: "2/5", s1: "1/3", s2: "1/3", s3: "2/5" },
        { f1: "4/6", f2: "6/9", f3: "3/4", ans: "3/4", s1: "2/3", s2: "2/3", s3: "3/4" },
        { f1: "2/8", f2: "3/12", f3: "3/7", ans: "3/7", s1: "1/4", s2: "1/4", s3: "3/7" }
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      // Shuffle the 3 fractions so the answer isn't always last
      const fracs = [
        { orig: selected.f1, simp: selected.s1, isAns: false },
        { orig: selected.f2, simp: selected.s2, isAns: false },
        { orig: selected.f3, simp: selected.s3, isAns: true }
      ].sort(() => Math.random() - 0.5);

      answer = selected.ans;
      hint = `Try simplifying each fraction. The one that cannot be divided any further is the answer.`;

      visualEngineStr = JSON.stringify({
        componentToRender: "NUMBER_CARDS",
        componentData: {
          items: [
            { type: "fraction", num: fracs[0].orig.split('/')[0], denom: fracs[0].orig.split('/')[1] },
            { type: "fraction", num: fracs[1].orig.split('/')[0], denom: fracs[1].orig.split('/')[1] },
            { type: "fraction", num: fracs[2].orig.split('/')[0], denom: fracs[2].orig.split('/')[1] }
          ]
        }
      });

      if (type === 'Structured') {
        askText = `${context.name} has three fractions: ${fracs[0].orig}, ${fracs[1].orig}, and ${fracs[2].orig}. Which of these fractions cannot be simplified further?`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Simplest form of ${fracs[0].orig}`, expectedAnswer: fracs[0].simp },
            { label: `Simplest form of ${fracs[1].orig}`, expectedAnswer: fracs[1].simp },
            { label: `Simplest form of ${fracs[2].orig}`, expectedAnswer: fracs[2].simp },
            { label: "Which fraction cannot be simplified?", expectedAnswer: answer }
          ]
        });
      } else if (type === 'MCQ') {
        askText = `Which of these fractions is already in its simplest form: ${fracs[0].orig}, ${fracs[1].orig}, or ${fracs[2].orig}?`;
        customConstraints = `Provide these exactly as options: "${fracs[0].orig}", "${fracs[1].orig}", "${fracs[2].orig}"`;
      } else {
        askText = `Which of these fractions is already in its simplest form: ${fracs[0].orig}, ${fracs[1].orig}, or ${fracs[2].orig}?`;
      }

      solutionSteps = [
        `Simplify each fraction to check:`,
        `${fracs[0].orig} in simplest form is ${fracs[0].simp}`,
        `${fracs[1].orig} in simplest form is ${fracs[1].simp}`,
        `${fracs[2].orig} in simplest form is ${fracs[2].simp}`,
        `Therefore, ${answer} is the fraction that cannot be simplified further.`
      ];
    } else if (activeVariant === 'foundation_match') {
      const options = [
        { num: 6, denom: 8, div: 2, ans: "3/4", distractors: ["2/4", "1/4"] },
        { num: 4, denom: 8, div: 4, ans: "1/2", distractors: ["1/4", "3/8"] },
        { num: 4, denom: 6, div: 2, ans: "2/3", distractors: ["1/3", "1/6"] },
        { num: 6, denom: 9, div: 3, ans: "2/3", distractors: ["1/3", "2/9"] },
        { num: 2, denom: 8, div: 2, ans: "1/4", distractors: ["2/4", "1/2"] },
        { num: 2, denom: 6, div: 2, ans: "1/3", distractors: ["2/3", "1/6"] }
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      const num = selected.num;
      const denom = selected.denom;
      const divisor = selected.div;
      answer = selected.ans;
      
      const simpleNum = num / divisor;
      const simpleDenom = denom / divisor;
      
      // Shuffle options for the prompt text
      const choices = [answer, ...selected.distractors].sort(() => Math.random() - 0.5);
      const choicesStr = choices.join(', ');
      const mcqChoicesStr = `"${choices[0]}", "${choices[1]}", "${choices[2]}"`;

      hint = `Divide both ${num} and ${denom} by ${divisor} to find the simplest form.`;

      visualEngineStr = JSON.stringify({
        componentToRender: "NUMBER_CARDS",
        componentData: {
          items: [
            { type: "fraction", num: parseInt(choices[0].split('/')[0]), denom: parseInt(choices[0].split('/')[1]), color: "#FF6B6B" },
            { type: "fraction", num: parseInt(choices[1].split('/')[0]), denom: parseInt(choices[1].split('/')[1]), color: "#4ECDC4" },
            { type: "fraction", num: parseInt(choices[2].split('/')[0]), denom: parseInt(choices[2].split('/')[1]), color: "#FFE66D" }
          ]
        }
      });

      if (type === 'Structured') {
        askText = `${context.name} cuts a ${selectedContextItem} into ${denom} pieces and uses ${num}. Which fraction shows this amount in its simplest form: ${choicesStr}?`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Number to divide by", expectedAnswer: String(divisor) },
            { label: "Simplified numerator", expectedAnswer: `${num}/${divisor}=${simpleNum}` },
            { label: "Simplified denominator", expectedAnswer: `${denom}/${divisor}=${simpleDenom}` },
            { label: "Simplest form", expectedAnswer: answer }
          ]
        });
      } else if (type === 'MCQ') {
        askText = `Which of the following is the simplest form of ${num}/${denom}?`;
        customConstraints = `Provide these exactly as options: ${mcqChoicesStr}`;
      } else {
        askText = `Which fraction is the simplest form of ${num}/${denom}: ${choicesStr}?`;
      }
      
      solutionSteps = [
        `Divide both ${num} and ${denom} by ${divisor}.`,
        `${num} ÷ ${divisor} = ${simpleNum}`,
        `${denom} ÷ ${divisor} = ${simpleDenom}`,
        `Therefore, the simplest form is ${answer}.`
      ];
    } else if (activeVariant === 'foundation_evaluate_simplification') {
      const options = [
        { origNum: 4, origDenom: 8, simpNum: 2, simpDenom: 4, isSimplest: false, finalNum: 1, finalDenom: 2, divBy: 2 },
        { origNum: 4, origDenom: 8, simpNum: 1, simpDenom: 2, isSimplest: true, divBy: 4 },
        { origNum: 6, origDenom: 8, simpNum: 3, simpDenom: 4, isSimplest: true, divBy: 2 },
        { origNum: 4, origDenom: 12, simpNum: 2, simpDenom: 6, isSimplest: false, finalNum: 1, finalDenom: 3, divBy: 2 },
        { origNum: 6, origDenom: 9, simpNum: 2, simpDenom: 3, isSimplest: true, divBy: 3 }
      ];

      const selected = options[Math.floor(Math.random() * options.length)];
      answer = selected.isSimplest ? "No" : "Yes";

      hint = selected.isSimplest 
        ? `Can both ${selected.simpNum} and ${selected.simpDenom} be divided by the same number (other than 1)?`
        : `Check if both ${selected.simpNum} and ${selected.simpDenom} can be divided by ${selected.divBy}.`;

      visualEngineStr = JSON.stringify({
        componentToRender: "FRACTION_EQUIVALENCE",
        componentData: {
          before: { num: selected.origNum, denom: selected.origDenom },
          after: { num: selected.simpNum, denom: selected.simpDenom },
          operator: '÷',
          factor: selected.origNum / selected.simpNum,
          final: { num: '?', denom: '?' },
          operator2: '÷',
          factor2: '?'
        }
      });

      if (type === 'Structured') {
        askText = `${context.name} cuts a ${selectedContextItem} into ${selected.origDenom} pieces and eats ${selected.origNum}. They simplify the fraction ${selected.origNum}/${selected.origDenom} to ${selected.simpNum}/${selected.simpDenom}. Can ${selected.simpNum}/${selected.simpDenom} be simplified further?`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Can it be simplified further?", expectedAnswer: answer },
            { label: "Number to divide by (type 'no' if simplest form)", expectedAnswer: selected.isSimplest ? "no" : String(selected.divBy) },
            { label: "Simplified fraction", expectedAnswer: selected.isSimplest ? `${selected.simpNum}/${selected.simpDenom}` : `${selected.finalNum}/${selected.finalDenom}` }
          ]
        });
      } else if (type === 'MCQ') {
        askText = `If ${selected.origNum}/${selected.origDenom} is simplified to ${selected.simpNum}/${selected.simpDenom}, can ${selected.simpNum}/${selected.simpDenom} be simplified further?`;
        customConstraints = `Provide these exactly as options: "Yes", "No"`;
      } else {
        askText = `Can ${selected.simpNum}/${selected.simpDenom} be simplified further? (Yes/No)`;
      }

      solutionSteps = selected.isSimplest
        ? [
            `There is no number (other than 1) that can divide exactly into both ${selected.simpNum} and ${selected.simpDenom}.`,
            `Therefore, ${selected.simpNum}/${selected.simpDenom} is in its simplest form.`
          ]
        : [
            `Both ${selected.simpNum} and ${selected.simpDenom} can still be divided by ${selected.divBy}.`,
            `${selected.simpNum} ÷ ${selected.divBy} = ${selected.finalNum}`,
            `${selected.simpDenom} ÷ ${selected.divBy} = ${selected.finalDenom}`,
            `The actual simplest form is ${selected.finalNum}/${selected.finalDenom}.`,
            `Therefore, it can be simplified further.`
          ];
    }

    return { askText, hint, solutionSteps, answer, visualEngineStr, inputRequirementStr, customConstraints };
  }
};
