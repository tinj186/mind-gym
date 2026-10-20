import {
  getRandomBarGraphTheme,
  getRandomNames,
  getRandomPaletteColors,
  getRandomFinancialTheme,
  getRandomEqualizingTheme,
  getRandomTargetShortfallTheme,
  getSingularUnit
} from '../../../../../../utils/variable-bank.js';

import {
  getRandomInt,
  getFourOptions,
  getMultiplicationAcceptedAnswers,
  getDivisionAcceptedAnswers,
  getAdditionAcceptedAnswers,
  getSubtractionAcceptedAnswers,
  getThreeTermAdditionAcceptedAnswers,
  getThreeAdditionAcceptedAnswers,
  getDifferenceAcceptedAnswers,
  getSumAcceptedAnswers,
  getThreeTermSumAcceptedAnswers,
  getCombinedAddSubAcceptedAnswers,
  getSubSubAcceptedAnswers,
  getTwoPairsDiffAcceptedAnswers,
  getFourTermAdditionAcceptedAnswers,
  getTwoPairSumAcceptedAnswers
} from '../helpers.js';

export function generateStandardDeductiveAxisLabeling({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    // Sub-types:
    // 1: Deduction from 1 bar -> find remaining 1 bar
    // 2: Deduction from total of 2 bars -> find remaining 1 bar
    // 3: Deduction from total of 3 bars -> find remaining 1 bar
    // 4: Deduction from difference between 2 bars -> find remaining 1 bar
    // 5: Deduction from 1 bar -> find combined total of 2 remaining bars
    // 6: Deduction from grand total of all 4 bars -> find remaining 1 bar
    const subType = getRandomInt(1, 6);
    const scaleOptions = [2, 5, 10, 20, 50];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const colors = getRandomPaletteColors(4);

    // Pick 4 distinct block counts between 2 and 8
    const blockPool = [2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random());
    const blocks = blockPool.slice(0, 4);
    const categories = [...theme.items].slice(0, 4);

    const data = categories.map((cat, idx) => ({
      category: cat,
      value: blocks[idx] * scaleStep,
      color: colors[idx]
    }));

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_GRAPH",
      componentData: {
        title: theme.title,
        xAxisLabel: theme.xAxisLabel,
        yAxisLabel: theme.yAxisLabel,
        data,
        scaleStep,
        orientation,
        showGridLines: true,
        showScaleNumbers: false
      }
    });

    if (subType === 1) {
      // Sub-type 1: Deduction from 1 bar -> determine a remaining bar
      const catA = data[0].category;
      const bA = blocks[0];
      const valA = data[0].value;

      const catB = data[1].category;
      const bB = blocks[1];
      const valB = data[1].value;

      finalAnswer = String(valB);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} represents ${valA} ${theme.unit} and is ${bA} grid blocks long. Determine the value of 1 grid block, and find the value of ${catB}."`;
        const stepsArr = [
          { label: "Write the working equation to find the value of 1 grid block:", expectedAnswer: `${valA} ÷ ${bA} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(valA, bA, scaleStep) },
          { label: `Write the working equation to find the value of ${catB}:`, expectedAnswer: `${bB} × ${scaleStep} = ${valB}`, acceptedAnswers: getMultiplicationAcceptedAnswers(bB, scaleStep, valB) },
          { label: `Value of ${catB}:`, expectedAnswer: String(valB), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} (${bA} blocks) represents ${valA} ${theme.unit}. How many ${theme.unit} does ${catB} (${bB} blocks) represent?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(valB + scaleStep),
          String(valB - scaleStep > 0 ? valB - scaleStep : valB + scaleStep * 2),
          String(valA - scaleStep > 0 ? valA - scaleStep : valB + 20)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} represents ${valA} ${theme.unit} and is ${bA} grid blocks long. Determine the value of 1 grid block, and find the value of ${catB}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 2) {
      // Sub-type 2: Deduction from total of 2 bars -> determine remaining 1 bar
      const cat1 = data[0].category;
      const b1 = blocks[0];
      const val1 = data[0].value;

      const cat2 = data[1].category;
      const b2 = blocks[1];
      const val2 = data[1].value;

      const cat3 = data[2].category;
      const b3 = blocks[2];
      const val3 = data[2].value;

      const total12 = val1 + val2;
      const blocks12 = b1 + b2;

      finalAnswer = String(val3);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. Together, ${cat1} and ${cat2} have a combined total of ${total12} ${theme.unit}. Determine the value of 1 grid block, and find the value of ${cat3}."`;
        const stepsArr = [
          { label: `Total number of grid blocks for ${cat1} and ${cat2}:`, expectedAnswer: String(blocks12), acceptedAnswers: getAdditionAcceptedAnswers(b1, b2, blocks12) },
          { label: "Write the working equation to find the value of 1 grid block:", expectedAnswer: `${total12} ÷ ${blocks12} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(total12, blocks12, scaleStep) },
          { label: `Write the working equation to find the value of ${cat3}:`, expectedAnswer: `${b3} × ${scaleStep} = ${val3}`, acceptedAnswers: getMultiplicationAcceptedAnswers(b3, scaleStep, val3) },
          { label: `Value of ${cat3}:`, expectedAnswer: String(val3), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The combined total for ${cat1} and ${cat2} is ${total12} ${theme.unit}. How many ${theme.unit} does ${cat3} (${b3} blocks) represent?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(val3 + scaleStep),
          String(val3 - scaleStep > 0 ? val3 - scaleStep : val3 + scaleStep * 2),
          String(b3 * (scaleStep + 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. Together, ${cat1} and ${cat2} have a combined total of ${total12} ${theme.unit}. Determine the value of 1 grid block, and find the value of ${cat3}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 3) {
      // Sub-type 3: Deduction from total of 3 bars -> determine remaining 1 bar
      const cat1 = data[0].category;
      const b1 = blocks[0];
      const val1 = data[0].value;

      const cat2 = data[1].category;
      const b2 = blocks[1];
      const val2 = data[1].value;

      const cat3 = data[2].category;
      const b3 = blocks[2];
      const val3 = data[2].value;

      const cat4 = data[3].category;
      const b4 = blocks[3];
      const val4 = data[3].value;

      const total123 = val1 + val2 + val3;
      const blocks123 = b1 + b2 + b3;

      finalAnswer = String(val4);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The combined total for ${cat1}, ${cat2}, and ${cat3} is ${total123} ${theme.unit}. Determine the value of 1 grid block, and find the value of ${cat4}."`;
        const stepsArr = [
          { label: `Total number of grid blocks for ${cat1}, ${cat2}, and ${cat3}:`, expectedAnswer: String(blocks123), acceptedAnswers: getThreeTermAdditionAcceptedAnswers(b1, b2, b3, blocks123) },
          { label: "Write the working equation to find the value of 1 grid block:", expectedAnswer: `${total123} ÷ ${blocks123} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(total123, blocks123, scaleStep) },
          { label: `Write the working equation to find the value of ${cat4}:`, expectedAnswer: `${b4} × ${scaleStep} = ${val4}`, acceptedAnswers: getMultiplicationAcceptedAnswers(b4, scaleStep, val4) },
          { label: `Value of ${cat4}:`, expectedAnswer: String(val4), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The combined total for ${cat1}, ${cat2}, and ${cat3} is ${total123} ${theme.unit}. How many ${theme.unit} does ${cat4} (${b4} blocks) represent?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(val4 + scaleStep),
          String(val4 - scaleStep > 0 ? val4 - scaleStep : val4 + scaleStep * 2),
          String(b4 * (scaleStep + 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The combined total for ${cat1}, ${cat2}, and ${cat3} is ${total123} ${theme.unit}. Determine the value of 1 grid block, and find the value of ${cat4}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 4) {
      // Sub-type 4: Deduction from difference between 2 bars -> determine remaining 1 bar
      let idxA = 0;
      let idxB = 1;
      if (blocks[idxA] < blocks[idxB]) {
        [idxA, idxB] = [idxB, idxA];
      }
      const catA = data[idxA].category;
      const bA = blocks[idxA];
      const catB = data[idxB].category;
      const bB = blocks[idxB];
      const diffBlocks = bA - bB;
      const diffVal = diffBlocks * scaleStep;

      const catC = data[2].category;
      const bC = blocks[2];
      const valC = data[2].value;

      finalAnswer = String(valC);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${catA} than in ${catB}. Determine the value of 1 grid block, and find the value of ${catC}."`;
        const stepsArr = [
          { label: `Difference in grid blocks between ${catA} and ${catB}:`, expectedAnswer: String(diffBlocks), acceptedAnswers: getSubtractionAcceptedAnswers(bA, bB, diffBlocks) },
          { label: "Write the working equation to find the value of 1 grid block:", expectedAnswer: `${diffVal} ÷ ${diffBlocks} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep) },
          { label: `Write the working equation to find the value of ${catC}:`, expectedAnswer: `${bC} × ${scaleStep} = ${valC}`, acceptedAnswers: getMultiplicationAcceptedAnswers(bC, scaleStep, valC) },
          { label: `Value of ${catC}:`, expectedAnswer: String(valC), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. How many ${theme.unit} does ${catC} (${bC} blocks) represent?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(valC + scaleStep),
          String(valC - scaleStep > 0 ? valC - scaleStep : valC + scaleStep * 2),
          String(bC * (scaleStep + 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${catA} than in ${catB}. Determine the value of 1 grid block, and find the value of ${catC}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 5) {
      // Sub-type 5: Deduction from 1 bar -> determine combined total of 2 remaining bars
      const cat1 = data[0].category;
      const b1 = blocks[0];
      const val1 = data[0].value;

      const cat2 = data[1].category;
      const b2 = blocks[1];
      const val2 = data[1].value;

      const cat3 = data[2].category;
      const b3 = blocks[2];
      const val3 = data[2].value;

      const blocks23 = b2 + b3;
      const total23 = val2 + val3;

      finalAnswer = String(total23);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} represents ${val1} ${theme.unit} and is ${b1} grid blocks long. Determine the value of 1 grid block, and find the combined total for ${cat2} and ${cat3}."`;
        const stepsArr = [
          { label: "Write the working equation to find the value of 1 grid block:", expectedAnswer: `${val1} ÷ ${b1} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(val1, b1, scaleStep) },
          { label: `Total number of grid blocks for ${cat2} and ${cat3}:`, expectedAnswer: String(blocks23), acceptedAnswers: getAdditionAcceptedAnswers(b2, b3, blocks23) },
          { label: `Write the working equation to find the combined total of ${cat2} and ${cat3}:`, expectedAnswer: `${blocks23} × ${scaleStep} = ${total23}`, acceptedAnswers: [...getMultiplicationAcceptedAnswers(blocks23, scaleStep, total23), ...getAdditionAcceptedAnswers(val2, val3, total23)] },
          { label: `Combined total of ${cat2} and ${cat3}:`, expectedAnswer: String(total23), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} (${b1} blocks) represents ${val1} ${theme.unit}. What is the combined total for ${cat2} and ${cat3}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(total23 + scaleStep),
          String(total23 - scaleStep > 0 ? total23 - scaleStep : total23 + scaleStep * 2),
          String(val2 + val3 + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} represents ${val1} ${theme.unit} and is ${b1} grid blocks long. Determine the value of 1 grid block, and find the combined total for ${cat2} and ${cat3}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else {
      // Sub-type 6: Deduction from grand total of all 4 bars -> determine remaining 1 bar
      const totalBlocks = blocks[0] + blocks[1] + blocks[2] + blocks[3];
      const grandTotal = totalBlocks * scaleStep;

      const targetIdx = getRandomInt(0, 3);
      const targetCat = data[targetIdx].category;
      const targetBlocks = blocks[targetIdx];
      const targetVal = data[targetIdx].value;

      finalAnswer = String(targetVal);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The grand total across all 4 categories is ${grandTotal} ${theme.unit}. Determine the value of 1 grid block, and find the value of ${targetCat}."`;
        const stepsArr = [
          { label: "Total number of grid blocks across all 4 categories:", expectedAnswer: String(totalBlocks), acceptedAnswers: [] },
          { label: "Write the working equation to find the value of 1 grid block:", expectedAnswer: `${grandTotal} ÷ ${totalBlocks} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(grandTotal, totalBlocks, scaleStep) },
          { label: `Write the working equation to find the value of ${targetCat}:`, expectedAnswer: `${targetBlocks} × ${scaleStep} = ${targetVal}`, acceptedAnswers: getMultiplicationAcceptedAnswers(targetBlocks, scaleStep, targetVal) },
          { label: `Value of ${targetCat}:`, expectedAnswer: String(targetVal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The grand total across all 4 categories is ${grandTotal} ${theme.unit}. How many ${theme.unit} does ${targetCat} (${targetBlocks} blocks) represent?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(targetVal + scaleStep),
          String(targetVal - scaleStep > 0 ? targetVal - scaleStep : targetVal + scaleStep * 2),
          String(targetBlocks * (scaleStep + 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The grand total across all 4 categories is ${grandTotal} ${theme.unit}. Determine the value of 1 grid block, and find the value of ${targetCat}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    }


  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
