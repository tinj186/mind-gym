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

export function generateAdvancedMissingScaleValueDifferenceDeduction({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleOptions = [5, 10, 20, 25, 40, 50];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];

    // 3 or 4 bars
    const barCount = Math.random() > 0.5 ? 4 : 3;
    const theme = getRandomBarGraphTheme(barCount, 'game_points') || getRandomBarGraphTheme(barCount);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    // Choose blocks: A > B, C is 3rd bar, D optional 4th bar
    const diffBlocks = getRandomInt(2, 5); // 2, 3, 4, 5
    const bB = getRandomInt(2, 4); // 2, 3, 4
    const bA = bB + diffBlocks; // 4 to 9
    let bC = getRandomInt(3, 7);
    if (bC === bA) bC = Math.max(1, bA - 1);
    if (bC === bB) bC = bB + 1;
    const bD = barCount === 4 ? getRandomInt(2, 7) : 0;

    const diffVal = diffBlocks * scaleStep;
    const valA = bA * scaleStep;
    const valB = bB * scaleStep;
    const valC = bC * scaleStep;
    const valD = bD * scaleStep;

    const totalBlocks = bA + bB + bC + (barCount === 4 ? bD : 0);
    const grandTotal = totalBlocks * scaleStep;

    const catA = theme.items[0];
    const catB = theme.items[1];
    const catC = theme.items[2];
    const catD = barCount === 4 ? theme.items[3] : '';

    const colors = getRandomPaletteColors(barCount);
    const data = [
      { category: catA, value: valA, color: colors[0] },
      { category: catB, value: valB, color: colors[1] },
      { category: catC, value: valC, color: colors[2] }
    ];
    if (barCount === 4) {
      data.push({ category: catD, value: valD, color: colors[3] });
    }

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

    // Inquiry goal: single_bar (value of 1 bar), grand_total (total of all bars), bar_and_total (value of bar + total), combined_two_bars (sum of 2 bars)
    const goalTypes = ['single_bar', 'grand_total', 'bar_and_total', 'combined_two_bars'];
    const goal = goalTypes[getRandomInt(0, goalTypes.length - 1)];

    const valSumEquationTerms = barCount === 4 ? `${valA} + ${valB} + ${valC} + ${valD} = ${grandTotal}` : `${valA} + ${valB} + ${valC} = ${grandTotal}`;
    const valSumEquationTermsNoSpace = barCount === 4 ? `${valA}+${valB}+${valC}+${valD}=${grandTotal}` : `${valA}+${valB}+${valC}=${grandTotal}`;

    if (isStructure) {
      if (goal === 'single_bar') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. Determine what 1 grid block stands for, and then find the value of ${catC}."`;
        const stepsArr = [
          {
            label: `Write the working equation to find the difference in grid blocks between ${catA} and ${catB}:`,
            expectedAnswer: `${bA} - ${bB} = ${diffBlocks}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(bA, bB, diffBlocks)
          },
          {
            label: `Write the working equation to find the value of 1 grid block:`,
            expectedAnswer: `${diffVal} / ${diffBlocks} = ${scaleStep}`,
            acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep)
          },
          {
            label: `Write the working equation to find the value of ${catC}:`,
            expectedAnswer: `${bC} x ${scaleStep} = ${valC}`,
            acceptedAnswers: getMultiplicationAcceptedAnswers(bC, scaleStep, valC)
          },
          {
            label: `${theme.unit.charAt(0).toUpperCase() + theme.unit.slice(1)} for ${catC}:`,
            expectedAnswer: String(valC),
            acceptedAnswers: [String(valC)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(valC);
      } else if (goal === 'grand_total') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. Determine what 1 grid block stands for, and then calculate the total number of ${theme.unit} across all categories combined."`;
        const stepsArr = [
          {
            label: `Write the working equation to find the difference in grid blocks between ${catA} and ${catB}:`,
            expectedAnswer: `${bA} - ${bB} = ${diffBlocks}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(bA, bB, diffBlocks)
          },
          {
            label: `Write the working equation to find the value of 1 grid block:`,
            expectedAnswer: `${diffVal} / ${diffBlocks} = ${scaleStep}`,
            acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep)
          },
          {
            label: `Total number of grid blocks across all ${data.length} categories:`,
            expectedAnswer: String(totalBlocks),
            acceptedAnswers: [String(totalBlocks)]
          },
          {
            label: `Write the working equation to find the total ${theme.unit} across all categories:`,
            expectedAnswer: `${totalBlocks} x ${scaleStep} = ${grandTotal}`,
            acceptedAnswers: [
              ...getMultiplicationAcceptedAnswers(totalBlocks, scaleStep, grandTotal),
              valSumEquationTerms,
              valSumEquationTermsNoSpace,
              String(grandTotal)
            ]
          },
          {
            label: `Total ${theme.unit} across all categories:`,
            expectedAnswer: String(grandTotal),
            acceptedAnswers: [String(grandTotal)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(grandTotal);
      } else if (goal === 'bar_and_total') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. Determine what 1 grid block stands for, find the value of ${catC}, and then calculate the total number of ${theme.unit} across all categories combined."`;
        const stepsArr = [
          {
            label: `Write the working equation to find the difference in grid blocks between ${catA} and ${catB}:`,
            expectedAnswer: `${bA} - ${bB} = ${diffBlocks}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(bA, bB, diffBlocks)
          },
          {
            label: `Write the working equation to find the value of 1 grid block:`,
            expectedAnswer: `${diffVal} / ${diffBlocks} = ${scaleStep}`,
            acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep)
          },
          {
            label: `Write the working equation to find the value of ${catC}:`,
            expectedAnswer: `${bC} x ${scaleStep} = ${valC}`,
            acceptedAnswers: getMultiplicationAcceptedAnswers(bC, scaleStep, valC)
          },
          {
            label: `Write the working equation to find the total ${theme.unit} across all categories:`,
            expectedAnswer: `${totalBlocks} x ${scaleStep} = ${grandTotal}`,
            acceptedAnswers: [
              ...getMultiplicationAcceptedAnswers(totalBlocks, scaleStep, grandTotal),
              valSumEquationTerms,
              valSumEquationTermsNoSpace,
              String(grandTotal)
            ]
          },
          {
            label: `Total ${theme.unit} across all categories:`,
            expectedAnswer: String(grandTotal),
            acceptedAnswers: [String(grandTotal)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(grandTotal);
      } else {
        // combined_two_bars
        const combinedBlocks = bA + bC;
        const combinedVal = combinedBlocks * scaleStep;
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. Determine what 1 grid block stands for, and then calculate the combined total of ${catA} and ${catC}."`;
        const stepsArr = [
          {
            label: `Write the working equation to find the difference in grid blocks between ${catA} and ${catB}:`,
            expectedAnswer: `${bA} - ${bB} = ${diffBlocks}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(bA, bB, diffBlocks)
          },
          {
            label: `Write the working equation to find the value of 1 grid block:`,
            expectedAnswer: `${diffVal} / ${diffBlocks} = ${scaleStep}`,
            acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep)
          },
          {
            label: `Write the working equation to find the total grid blocks for ${catA} and ${catC} combined:`,
            expectedAnswer: `${bA} + ${bC} = ${combinedBlocks}`,
            acceptedAnswers: getAdditionAcceptedAnswers(bA, bC, combinedBlocks)
          },
          {
            label: `Write the working equation to find the combined total for ${catA} and ${catC}:`,
            expectedAnswer: `${combinedBlocks} x ${scaleStep} = ${combinedVal}`,
            acceptedAnswers: [
              ...getMultiplicationAcceptedAnswers(combinedBlocks, scaleStep, combinedVal),
              `${valA} + ${valC} = ${combinedVal}`,
              `${valA}+${valC}=${combinedVal}`,
              `${valC} + ${valA} = ${combinedVal}`,
              `${valC}+${valA}=${combinedVal}`,
              String(combinedVal)
            ]
          },
          {
            label: `Combined total for ${catA} and ${catC}:`,
            expectedAnswer: String(combinedVal),
            acceptedAnswers: [String(combinedVal)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(combinedVal);
      }
    } else if (isMCQ) {
      if (goal === 'single_bar') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. How many ${theme.unit} does ${catC} represent?"`;
        finalAnswer = String(valC);
        const opts = getFourOptions(finalAnswer, [
          String(valC + scaleStep),
          String(Math.max(scaleStep, valC - scaleStep)),
          String(valB),
          String(valA)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else if (goal === 'grand_total' || goal === 'bar_and_total') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. What is the total number of ${theme.unit} across all categories combined?"`;
        finalAnswer = String(grandTotal);
        const opts = getFourOptions(finalAnswer, [
          String(grandTotal - scaleStep * 2),
          String(grandTotal + scaleStep * 2),
          String(valA + valB),
          String(totalBlocks * (scaleStep + 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        // combined_two_bars
        const combinedVal = (bA + bC) * scaleStep;
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. What is the combined total of ${catA} and ${catC}?"`;
        finalAnswer = String(combinedVal);
        const opts = getFourOptions(finalAnswer, [
          String((bA + bC + 1) * scaleStep),
          String(Math.max(scaleStep, (bA + bC - 1) * scaleStep)),
          String(valA + valB),
          String(grandTotal)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      }
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      // Short Question
      if (goal === 'single_bar') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. ${catA} represents ${diffVal} more ${theme.unit} than ${catB}. What is the value of ${catC}?"`;
        finalAnswer = String(valC);
      } else if (goal === 'grand_total' || goal === 'bar_and_total') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. ${catA} represents ${diffVal} more ${theme.unit} than ${catB}. What is the total number of ${theme.unit} across all categories combined?"`;
        finalAnswer = String(grandTotal);
      } else {
        const combinedVal = (bA + bC) * scaleStep;
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. ${catA} represents ${diffVal} more ${theme.unit} than ${catB}. What is the combined total for ${catA} and ${catC}?"`;
        finalAnswer = String(combinedVal);
      }
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

  // --------------------------------------------------------------------------
  // Variant 12: Scale Translation & Block Projection
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
