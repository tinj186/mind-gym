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

export function generateStandardScaleErrorCorrection({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    // Sub-types:
    // 1: Scale correction for 1 single bar
    // 2: Scale correction for combined total of 2 bars
    // 3: Scale correction for grand total of all 4 bars
    // 4: Difference caused by scale error (valNew - valOrig)
    // 5: Work backward from missing scale -> work forward to new scale (1 bar)
    // 6: Work backward from missing scale -> work forward to new scale total of 2 bars
    // 7: Correcting halfway marks to a new scale
    const subType = getRandomInt(1, 7);

    const scalePairs = [
      [2, 5],
      [2, 10],
      [5, 10],
      [5, 20],
      [10, 20],
      [10, 50],
      [20, 50],
      [50, 100]
    ];
    const pair = scalePairs[getRandomInt(0, scalePairs.length - 1)];
    const scaleOrig = pair[0];
    const scaleNew = pair[1];

    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const colors = getRandomPaletteColors(4);

    if (subType === 1) {
      // Sub-type 1: Scale correction for 1 single bar
      const blocks = [getRandomInt(4, 7), getRandomInt(2, 4), getRandomInt(3, 5), getRandomInt(2, 6)];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleOrig,
        color: colors[idx]
      }));
      const catA = data[0].category;
      const bA = blocks[0];
      const valOrig = bA * scaleOrig;
      const valNew = bA * scaleNew;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scaleOrig,
          orientation,
          showGridLines: true
        }
      });

      finalAnswer = String(valNew);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} with a scale of ${scaleOrig} ${theme.unit} per grid block. If the scale is corrected so that each grid block represents ${scaleNew} ${theme.unit}, what is the correct value for ${catA}?"`;
        const stepsArr = [
          { label: `Number of grid blocks for ${catA}:`, expectedAnswer: String(bA), acceptedAnswers: [] },
          { label: `Write the working equation to find the corrected value for ${catA}:`, expectedAnswer: `${bA} × ${scaleNew} = ${valNew}`, acceptedAnswers: getMultiplicationAcceptedAnswers(bA, scaleNew, valNew) },
          { label: `Corrected value for ${catA}:`, expectedAnswer: String(valNew), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows ${theme.title.toLowerCase()} where 1 grid block represents ${scaleOrig} ${theme.unit}. If 1 grid block is changed to represent ${scaleNew} ${theme.unit}, what is the new value for ${catA}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(valOrig),
          String(valNew - scaleNew),
          String(bA * (scaleOrig + scaleNew))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows ${theme.title.toLowerCase()} with a scale step of ${scaleOrig}. If each grid block is corrected to represent ${scaleNew} ${theme.unit}, what is the corrected value for ${catA}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 2) {
      // Sub-type 2: Scale correction for combined total of 2 bars
      const blocks = [getRandomInt(3, 5), getRandomInt(2, 4), getRandomInt(3, 6), getRandomInt(2, 5)];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleOrig,
        color: colors[idx]
      }));
      const catA = data[0].category;
      const bA = blocks[0];
      const catB = data[1].category;
      const bB = blocks[1];
      const totalBlocks = bA + bB;
      const newTotal = totalBlocks * scaleNew;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scaleOrig,
          orientation,
          showGridLines: true
        }
      });

      finalAnswer = String(newTotal);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} drawn with a scale step of ${scaleOrig}. If each grid block is re-scaled to represent ${scaleNew} ${theme.unit}, what is the new combined total for ${catA} and ${catB}?"`;
        const stepsArr = [
          { label: `Total number of grid blocks for ${catA} and ${catB}:`, expectedAnswer: String(totalBlocks), acceptedAnswers: getAdditionAcceptedAnswers(bA, bB, totalBlocks) },
          { label: "Write the working equation to find the new combined total:", expectedAnswer: `${totalBlocks} × ${scaleNew} = ${newTotal}`, acceptedAnswers: getMultiplicationAcceptedAnswers(totalBlocks, scaleNew, newTotal) },
          { label: `New combined total for ${catA} and ${catB}:`, expectedAnswer: String(newTotal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} with scale step ${scaleOrig}. If each block represents ${scaleNew} ${theme.unit} instead, what is the new combined total for ${catA} and ${catB}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(totalBlocks * scaleOrig),
          String(newTotal - scaleNew),
          String(newTotal + scaleNew)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} with a scale step of ${scaleOrig}. If each grid block is re-scaled to represent ${scaleNew} ${theme.unit}, what is the new combined total for ${catA} and ${catB}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 3) {
      // Sub-type 3: Scale correction for grand total of all 4 bars
      const blocks = [getRandomInt(2, 4), getRandomInt(3, 5), getRandomInt(2, 4), getRandomInt(3, 5)];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleOrig,
        color: colors[idx]
      }));
      const totalBlocks = blocks[0] + blocks[1] + blocks[2] + blocks[3];
      const newGrandTotal = totalBlocks * scaleNew;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scaleOrig,
          orientation,
          showGridLines: true
        }
      });

      finalAnswer = String(newGrandTotal);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} using a scale of ${scaleOrig} ${theme.unit} per grid block. If the graph is corrected to use a scale of ${scaleNew} ${theme.unit} per grid block, what is the correct grand total for all 4 categories?"`;
        const stepsArr = [
          { label: "Total number of grid blocks across all 4 categories:", expectedAnswer: String(totalBlocks), acceptedAnswers: [] },
          { label: "Write the working equation to find the corrected grand total:", expectedAnswer: `${totalBlocks} × ${scaleNew} = ${newGrandTotal}`, acceptedAnswers: getMultiplicationAcceptedAnswers(totalBlocks, scaleNew, newGrandTotal) },
          { label: `Corrected grand total ${theme.unit}:`, expectedAnswer: String(newGrandTotal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows ${theme.title.toLowerCase()} with 1 block = ${scaleOrig} units. If corrected so that 1 block = ${scaleNew} units, what is the grand total across all 4 categories?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(totalBlocks * scaleOrig),
          String(newGrandTotal - scaleNew * 2),
          String(newGrandTotal + scaleNew)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} using a scale of ${scaleOrig} ${theme.unit} per grid block. If the graph is corrected to use a scale of ${scaleNew} ${theme.unit} per grid block, what is the correct grand total for all 4 categories?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 4) {
      // Sub-type 4: Difference caused by scale error (valNew - valOrig)
      const blocks = [getRandomInt(4, 7), getRandomInt(2, 4), getRandomInt(3, 5), getRandomInt(2, 5)];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleOrig,
        color: colors[idx]
      }));
      const catA = data[0].category;
      const bA = blocks[0];
      const valOrig = bA * scaleOrig;
      const valNew = bA * scaleNew;
      const diff = valNew - valOrig;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scaleOrig,
          orientation,
          showGridLines: true
        }
      });

      finalAnswer = String(diff);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} with a scale step of ${scaleOrig}. A pupil mistakenly used this scale instead of the correct scale step of ${scaleNew}. How much greater is the correct value for ${catA} than the value shown on the graph?"`;
        const stepsArr = [
          { label: `Value of ${catA} shown on the graph:`, expectedAnswer: String(valOrig), acceptedAnswers: [] },
          { label: `Correct value of ${catA} with the new scale:`, expectedAnswer: String(valNew), acceptedAnswers: getMultiplicationAcceptedAnswers(bA, scaleNew, valNew) },
          { label: "Write the working equation to find the difference:", expectedAnswer: `${valNew} - ${valOrig} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(valNew, valOrig, diff) },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A pupil mistakenly used scale ${scaleOrig} instead of ${scaleNew} for ${catA}. How much greater is the correct value of ${catA} than the value shown on the graph?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(valNew),
          String(valOrig),
          String(diff + scaleOrig)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} with a scale step of ${scaleOrig}. A pupil mistakenly used this scale instead of the correct scale step of ${scaleNew}. How much greater is the correct value for ${catA} than the value shown on the graph?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 5) {
      // Sub-type 5: Backward from missing scale -> forward to new scale (1 bar)
      const blocks = [getRandomInt(4, 6), getRandomInt(2, 4), getRandomInt(3, 5), getRandomInt(2, 5)];
      const bA = blocks[0];
      const valOrig = bA * scaleOrig;
      const bB = blocks[1];
      const valNewB = bB * scaleNew;

      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleOrig,
        color: colors[idx]
      }));
      const catA = data[0].category;
      const catB = data[1].category;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scaleOrig,
          orientation,
          showGridLines: true,
          showScaleNumbers: false
        }
      });

      finalAnswer = String(valNewB);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} (${bA} grid blocks) represents ${valOrig} ${theme.unit}. If each grid block is re-scaled to represent ${scaleNew} ${theme.unit} instead, what will be the new value of ${catB}?"`;
        const stepsArr = [
          { label: "Write the working equation to find the original value of 1 grid block:", expectedAnswer: `${valOrig} ÷ ${bA} = ${scaleOrig}`, acceptedAnswers: getDivisionAcceptedAnswers(valOrig, bA, scaleOrig) },
          { label: `Number of grid blocks for ${catB}:`, expectedAnswer: String(bB), acceptedAnswers: [] },
          { label: `Write the working equation to find the new value of ${catB}:`, expectedAnswer: `${bB} × ${scaleNew} = ${valNewB}`, acceptedAnswers: getMultiplicationAcceptedAnswers(bB, scaleNew, valNewB) },
          { label: `New value of ${catB}:`, expectedAnswer: String(valNewB), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. ${catA} (${bA} blocks) has ${valOrig} ${theme.unit}. If each block is re-scaled to represent ${scaleNew} ${theme.unit}, what is the new value of ${catB} (${bB} blocks)?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(bB * scaleOrig),
          String(valNewB - scaleNew),
          String(valNewB + scaleNew)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} (${bA} grid blocks) represents ${valOrig} ${theme.unit}. If each grid block is re-scaled to represent ${scaleNew} ${theme.unit} instead, what will be the new value of ${catB}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 6) {
      // Sub-type 6: Backward from missing scale -> forward to new scale total of 2 bars
      const blocks = [getRandomInt(4, 6), getRandomInt(2, 4), getRandomInt(3, 5), getRandomInt(2, 4)];
      const b1 = blocks[0];
      const valOrig = b1 * scaleOrig;
      const b2 = blocks[1];
      const b3 = blocks[2];
      const blocks23 = b2 + b3;
      const newTotal23 = blocks23 * scaleNew;

      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleOrig,
        color: colors[idx]
      }));
      const cat1 = data[0].category;
      const cat2 = data[1].category;
      const cat3 = data[2].category;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scaleOrig,
          orientation,
          showGridLines: true,
          showScaleNumbers: false
        }
      });

      finalAnswer = String(newTotal23);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} (${b1} grid blocks) represents ${valOrig} ${theme.unit}. If the graph is updated so that 1 grid block stands for ${scaleNew} ${theme.unit}, what is the new combined total for ${cat2} and ${cat3}?"`;
        const stepsArr = [
          { label: "Write the working equation to find the original value of 1 grid block:", expectedAnswer: `${valOrig} ÷ ${b1} = ${scaleOrig}`, acceptedAnswers: getDivisionAcceptedAnswers(valOrig, b1, scaleOrig) },
          { label: `Total number of grid blocks for ${cat2} and ${cat3}:`, expectedAnswer: String(blocks23), acceptedAnswers: getAdditionAcceptedAnswers(b2, b3, blocks23) },
          { label: `Write the working equation to find the new combined total for ${cat2} and ${cat3}:`, expectedAnswer: `${blocks23} × ${scaleNew} = ${newTotal23}`, acceptedAnswers: getMultiplicationAcceptedAnswers(blocks23, scaleNew, newTotal23) },
          { label: `New combined total for ${cat2} and ${cat3}:`, expectedAnswer: String(newTotal23), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. ${cat1} (${b1} blocks) has ${valOrig} ${theme.unit}. If 1 block stands for ${scaleNew} ${theme.unit}, what is the new combined total for ${cat2} and ${cat3}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(blocks23 * scaleOrig),
          String(newTotal23 - scaleNew),
          String(newTotal23 + scaleNew)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} (${b1} grid blocks) represents ${valOrig} ${theme.unit}. If the graph is updated so that 1 grid block stands for ${scaleNew} ${theme.unit}, what is the new combined total for ${cat2} and ${cat3}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else {
      // Sub-type 7: Correcting halfway marks to a new scale
      const pair7 = [[2, 10], [10, 20], [10, 50], [20, 50], [50, 100]][getRandomInt(0, 4)];
      const sOrig = pair7[0];
      const sNew = pair7[1];
      const halfOrig = sOrig / 2;
      const halfNew = sNew / 2;

      const bA = getRandomInt(3, 5);
      const valOrig = bA * sOrig + halfOrig;
      const valNew = bA * sNew + halfNew;

      const data = [
        { category: theme.items[0], value: valOrig, color: colors[0] },
        { category: theme.items[1], value: 2 * sOrig, color: colors[1] },
        { category: theme.items[2], value: (bA - 1) * sOrig, color: colors[2] },
        { category: theme.items[3], value: (bA + 1) * sOrig, color: colors[3] }
      ];
      const catA = data[0].category;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: sOrig,
          orientation,
          showGridLines: true
        }
      });

      finalAnswer = String(valNew);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} with a scale step of ${sOrig}. The bar for ${catA} stops halfway between two grid lines (${bA} and a half intervals). If the scale is changed so that 1 grid interval represents ${sNew} ${theme.unit}, what is the new value for ${catA}?"`;
        const stepsArr = [
          { label: `Value of ${bA} whole grid intervals with the new scale:`, expectedAnswer: String(bA * sNew), acceptedAnswers: getMultiplicationAcceptedAnswers(bA, sNew, bA * sNew) },
          { label: `Half of the new grid interval (${sNew} ÷ 2):`, expectedAnswer: String(halfNew), acceptedAnswers: getDivisionAcceptedAnswers(sNew, 2, halfNew) },
          { label: `Write the working equation to find the new value for ${catA}:`, expectedAnswer: `${bA * sNew} + ${halfNew} = ${valNew}`, acceptedAnswers: getAdditionAcceptedAnswers(bA * sNew, halfNew, valNew) },
          { label: `New value for ${catA}:`, expectedAnswer: String(valNew), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${catA} is ${bA} and a half intervals long. If 1 grid interval is changed from ${sOrig} to ${sNew} ${theme.unit}, what is the new value for ${catA}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(valOrig),
          String(valNew - sNew),
          String(valNew + sNew)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} with a scale step of ${sOrig}. The bar for ${catA} stops halfway between two grid lines (${bA} and a half intervals). If the scale is changed so that 1 grid interval represents ${sNew} ${theme.unit}, what is the new value for ${catA}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    }

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
