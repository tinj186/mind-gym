import {
  getRandomBarGraphTheme,
  getRandomPackagingTheme,
  getRandomSubgroupTheme,
  getRandomBeforeAfterTheme,
  getRandomFinancialTheme,
  getRandomAlgebraicTheme,
  getRandomEqualizingTheme,
  getRandomTargetShortfallTheme,
  getRandomRepackingTheme,
  getRandomNames,
  CONTEXT_TIERS
} from '../../../../../../utils/variable-bank.js';

import {
  getRandomInt,
  capitalize,
  gcd,
  lcm,
  partitionSum,
  formatCategoryList,
  getContextQuery,
  getFourOptions,
  getMultiplicationAcceptedAnswers,
  getDivisionAcceptedAnswers,
  getAdditionAcceptedAnswers,
  getSubtractionAcceptedAnswers,
  getSumAcceptedAnswers
} from '../helpers.js';

export function generateAdvancedAlgebraicMultiplierDeduction({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleStep = [2, 5, 10, 20][Math.floor(Math.random() * 4)];
    const orientation = Math.random() < 0.5 ? "vertical" : "horizontal";
    const theme = getRandomAlgebraicTheme(3);
    const extEntity = theme.externalEntity;
    const baseVerb = theme.baseVerb || 'collect';

    // 6 Sub-types covering diverse algebraic multiplier reasoning
    const subType = getRandomInt(1, 6);

    // Multiplier: 2, 3, or 4
    const multiplier = [2, 3, 4][Math.floor(Math.random() * 3)];
    const multiplierWord = multiplier === 2 ? "twice as many" : `${multiplier} times as many`;

    let data = [];

    // ========================================================================
    // SUB-TYPE 1: External Entity Multiplier of Combined Categories
    // ========================================================================
    if (subType === 1) {
      const valA = getRandomInt(2, 5) * scaleStep;
      const valB = getRandomInt(2, 5) * scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[1];
      const catB = data[2];
      const combined = catA.value + catB.value;
      const ans = combined * multiplier;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} ${theme.verb} by ${data[0].category}, ${catA.category}, and ${catB.category}. ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category} and ${catB.category} combined. Calculate the total number of ${theme.unit} ${theme.verb} by ${catA.category} and ${catB.category}, then find the number of ${theme.unit} ${extEntity} ${theme.verb}."`;
        const stepsArr = [
          { label: `Write the working equation to find the combined number of ${theme.unit} for ${catA.category} and ${catB.category}:`, expectedAnswer: `${catA.value} + ${catB.value} = ${combined}`, acceptedAnswers: getAdditionAcceptedAnswers(catA.value, catB.value, combined) },
          { label: `Write the working equation to find the number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: `${combined} x ${multiplier} = ${ans}`, acceptedAnswers: getMultiplicationAcceptedAnswers(combined, multiplier, ans) },
          { label: `Number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: String(ans), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(ans);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category} and ${catB.category} combined. How many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(ans);
        const opts = getFourOptions(finalAnswer, [String(combined), String(ans + scaleStep * multiplier), String(ans - scaleStep * multiplier > 0 ? ans - scaleStep * multiplier : ans + 20), String(catA.value * multiplier)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category} and ${catB.category} combined. How many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(ans);
      }

    // ========================================================================
    // SUB-TYPE 2: External Entity Multiplier of Difference
    // ========================================================================
    } else if (subType === 2) {
      let valA = getRandomInt(3, 6) * scaleStep;
      let valB = getRandomInt(1, 4) * scaleStep;
      if (valA === valB) valA += scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const moreCat = valA > valB ? data[0] : data[1];
      const fewerCat = valA > valB ? data[1] : data[0];
      const diff = moreCat.value - fewerCat.value;
      const ans = diff * multiplier;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} ${theme.verb} by ${data[0].category}, ${data[1].category}, and ${data[2].category}. ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as the difference between ${moreCat.category} and ${fewerCat.category}. Calculate the difference between ${moreCat.category} and ${fewerCat.category}, then determine how many ${theme.unit} ${extEntity} ${theme.verb}."`;
        const stepsArr = [
          { label: `Write the working equation to find the difference in ${theme.unit} between ${moreCat.category} and ${fewerCat.category}:`, expectedAnswer: `${moreCat.value} - ${fewerCat.value} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(moreCat.value, fewerCat.value, diff) },
          { label: `Write the working equation to find the number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: `${diff} x ${multiplier} = ${ans}`, acceptedAnswers: getMultiplicationAcceptedAnswers(diff, multiplier, ans) },
          { label: `Number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: String(ans), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(ans);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as the difference between ${moreCat.category} and ${fewerCat.category}. Based on the bar graph, how many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(ans);
        const opts = getFourOptions(finalAnswer, [String(diff), String(ans + scaleStep * 2), String(ans - scaleStep > 0 ? ans - scaleStep : ans + 15), String(moreCat.value)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as the difference between ${moreCat.category} and ${fewerCat.category}. Based on the bar graph, how many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(ans);
      }

    // ========================================================================
    // SUB-TYPE 3: Reverse Multiplier Deduction (Finding Unknown From Graph Multiplier)
    // ========================================================================
    } else if (subType === 3) {
      const valA = getRandomInt(2, 5) * multiplier * scaleStep;
      const valB = getRandomInt(2, 5) * scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[0];
      const ans = valA / multiplier;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} ${theme.verb}. ${catA.category} ${theme.verb} ${multiplierWord} ${theme.unit} as ${extEntity}. Read the quantity from the bar graph, and calculate how many ${theme.unit} ${extEntity} ${theme.verb}."`;
        const stepsArr = [
          { label: `Write the working equation to find the number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: `${valA} ÷ ${multiplier} = ${ans}`, acceptedAnswers: getDivisionAcceptedAnswers(valA, multiplier, ans) },
          { label: `Number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: String(ans), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(ans);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${catA.category} ${theme.verb} ${multiplierWord} ${theme.unit} as ${extEntity}. Based on the bar graph, how many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(ans);
        const opts = getFourOptions(finalAnswer, [String(valA), String(ans + scaleStep), String(ans - scaleStep > 0 ? ans - scaleStep : ans + 5), String(valA * multiplier)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${catA.category} ${theme.verb} ${multiplierWord} ${theme.unit} as ${extEntity}. Based on the bar graph, how many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(ans);
      }

    // ========================================================================
    // SUB-TYPE 4: Unknown with Multiplier and Additional / Fewer ("m times as many and k more/fewer")
    // ========================================================================
    } else if (subType === 4) {
      const valA = getRandomInt(2, 4) * scaleStep;
      const valB = getRandomInt(2, 5) * scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[0];
      const isMore = Math.random() < 0.6;
      const k = getRandomInt(1, 3) * scaleStep;
      const base = valA * multiplier;
      const ans = isMore ? base + k : base - k;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} ${theme.verb}. ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category} and ${k} ${isMore ? 'more' : 'fewer'} ${theme.unit}. Calculate ${multiplier} times the number of ${theme.unit} for ${catA.category}, then find the number of ${theme.unit} ${extEntity} ${theme.verb}."`;
        const stepsArr = [
          { label: `Write the working equation to find ${multiplier} times the number of ${theme.unit} for ${catA.category}:`, expectedAnswer: `${valA} x ${multiplier} = ${base}`, acceptedAnswers: getMultiplicationAcceptedAnswers(valA, multiplier, base) },
          { label: `Write the working equation to find the number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: isMore ? `${base} + ${k} = ${ans}` : `${base} - ${k} = ${ans}`, acceptedAnswers: isMore ? getAdditionAcceptedAnswers(base, k, ans) : getSubtractionAcceptedAnswers(base, k, ans) },
          { label: `Number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: String(ans), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(ans);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category} and ${k} ${isMore ? 'more' : 'fewer'} ${theme.unit}. Based on the bar graph, how many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(ans);
        const opts = getFourOptions(finalAnswer, [String(base), String(isMore ? base - k : base + k), String(ans + scaleStep * 2), String(valA + k)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category} and ${k} ${isMore ? 'more' : 'fewer'} ${theme.unit}. Based on the bar graph, how many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(ans);
      }

    // ========================================================================
    // SUB-TYPE 5: Combined Total of Known and Multiplier Unknown
    // ========================================================================
    } else if (subType === 5) {
      const valA = getRandomInt(2, 4) * scaleStep;
      const valB = getRandomInt(2, 5) * scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[0];
      const unknown = valA * multiplier;
      const total = valA + unknown;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} ${theme.verb}. ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category}. Calculate the number of ${theme.unit} ${extEntity} ${theme.verb}, then find the total number of ${theme.unit} for ${catA.category} and ${extEntity} combined."`;
        const stepsArr = [
          { label: `Write the working equation to find the number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: `${valA} x ${multiplier} = ${unknown}`, acceptedAnswers: getMultiplicationAcceptedAnswers(valA, multiplier, unknown) },
          { label: `Write the working equation to find the total number of ${theme.unit} for ${catA.category} and ${extEntity} combined:`, expectedAnswer: `${valA} + ${unknown} = ${total}`, acceptedAnswers: getAdditionAcceptedAnswers(valA, unknown, total) },
          { label: `Total number of ${theme.unit} combined:`, expectedAnswer: String(total), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(total);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category}. Based on the bar graph, how many ${theme.unit} did ${catA.category} and ${extEntity} ${baseVerb} altogether?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(total);
        const opts = getFourOptions(finalAnswer, [String(unknown), String(valA * (multiplier - 1)), String(total + scaleStep * 2), String(total - scaleStep * 2 > 0 ? total - scaleStep * 2 : total + 20)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category}. Based on the bar graph, how many ${theme.unit} did ${catA.category} and ${extEntity} ${baseVerb} altogether?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(total);
      }

    // ========================================================================
    // SUB-TYPE 6: Difference Between Multiplier Unknown and Known
    // ========================================================================
    } else {
      const valA = getRandomInt(2, 4) * scaleStep;
      const valB = getRandomInt(2, 5) * scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[0];
      const unknown = valA * multiplier;
      const diff = unknown - valA;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} ${theme.verb}. ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category}. Calculate the number of ${theme.unit} ${extEntity} ${theme.verb}, then find how many more ${theme.unit} ${extEntity} ${theme.verb} than ${catA.category}."`;
        const stepsArr = [
          { label: `Write the working equation to find the number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: `${valA} x ${multiplier} = ${unknown}`, acceptedAnswers: getMultiplicationAcceptedAnswers(valA, multiplier, unknown) },
          { label: `Write the working equation to find how many more ${theme.unit} ${extEntity} ${theme.verb} than ${catA.category}:`, expectedAnswer: `${unknown} - ${valA} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(unknown, valA, diff) },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category}. Based on the bar graph, how many more ${theme.unit} did ${extEntity} ${baseVerb} than ${catA.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(unknown), String(valA), String(diff + scaleStep * 2), String(diff - scaleStep > 0 ? diff - scaleStep : diff + 10)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category}. Based on the bar graph, how many more ${theme.unit} did ${extEntity} ${baseVerb} than ${catA.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 13: Equalizing Quantities (The Transfer Problem)
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
