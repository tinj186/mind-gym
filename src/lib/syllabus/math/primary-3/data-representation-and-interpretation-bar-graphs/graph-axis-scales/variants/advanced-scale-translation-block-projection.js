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

export function generateAdvancedScaleTranslationBlockProjection({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const barCount = Math.random() > 0.5 ? 4 : 3;
    const theme = getRandomBarGraphTheme(barCount);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    // 4 inquiry sub-varieties: 'addition', 'subtraction', 'combined', 'reverse_working'
    const subTypes = ['addition', 'subtraction', 'combined', 'reverse_working'];
    const subType = subTypes[getRandomInt(0, subTypes.length - 1)];

    if (subType === 'addition') {
      const catIdx = getRandomInt(0, barCount - 1);
      const cat = theme.items[catIdx];

      // Curate pairs with moderate ratios so Graph 1 has 3-6 blocks, and Graph 2 has 2-5 blocks
      const addConfigs = [
        { scale1: 5, scale2: 10, blocksRange: [4, 5, 6], minB1: 3, maxB1: 5 },
        { scale1: 5, scale2: 20, blocksRange: [3, 4], minB1: 3, maxB1: 5 },
        { scale1: 10, scale2: 20, blocksRange: [3, 4, 5], minB1: 3, maxB1: 5 },
        { scale1: 10, scale2: 25, blocksRange: [3, 4], minB1: 3, maxB1: 5 },
        { scale1: 10, scale2: 50, blocksRange: [2, 3], minB1: 3, maxB1: 6 },
        { scale1: 20, scale2: 50, blocksRange: [3, 4], minB1: 3, maxB1: 5 },
        { scale1: 25, scale2: 50, blocksRange: [3, 4], minB1: 3, maxB1: 5 },
        { scale1: 50, scale2: 100, blocksRange: [3, 4], minB1: 3, maxB1: 5 }
      ];
      const cfg = addConfigs[getRandomInt(0, addConfigs.length - 1)];
      const scale1 = cfg.scale1;
      const scale2 = cfg.scale2;

      const blocksNeeded = cfg.blocksRange[getRandomInt(0, cfg.blocksRange.length - 1)];
      const newTotal = blocksNeeded * scale2;

      const maxB1 = Math.min(cfg.maxB1, Math.floor((newTotal - scale1) / scale1));
      const minB1 = Math.min(cfg.minB1, maxB1);
      const b1 = getRandomInt(minB1, maxB1);

      let startVal = b1 * scale1;
      if (scale1 % 2 === 0 && Math.random() > 0.5 && (startVal + scale1 / 2 < newTotal)) {
        startVal += scale1 / 2;
      }
      const delta = newTotal - startVal;

      const addVerbs = ['added', 'donated', 'collected', 'received', 'baked', 'produced', 'packed', 'gathered'];
      const verb = addVerbs[getRandomInt(0, addVerbs.length - 1)];

      const colors = getRandomPaletteColors(barCount);
      const data = theme.items.map((item, idx) => {
        if (idx === catIdx) return { category: item, value: startVal, color: colors[idx] };
        const bOther = getRandomInt(2, Math.min(6, b1 + 1));
        const valOther = (Math.random() > 0.5 && scale1 % 2 === 0) ? (bOther * scale1 + scale1 / 2) : (bOther * scale1);
        return { category: item, value: valOther, color: colors[idx] };
      });

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scale1,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Later, ${delta} more ${theme.unit} are ${verb} for ${cat}. If the new total is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}, how many grid blocks tall will the bar for ${cat} be?"`;
        const stepsArr = [
          {
            label: `Number of ${theme.unit} for ${cat} on the graph:`,
            expectedAnswer: String(startVal),
            acceptedAnswers: [String(startVal)]
          },
          {
            label: `Write the working equation to find the new total of ${cat}:`,
            expectedAnswer: `${startVal} + ${delta} = ${newTotal}`,
            acceptedAnswers: getAdditionAcceptedAnswers(startVal, delta, newTotal)
          },
          {
            label: `Write the working equation to find the number of grid blocks needed on the new graph:`,
            expectedAnswer: `${newTotal} / ${scale2} = ${blocksNeeded}`,
            acceptedAnswers: getDivisionAcceptedAnswers(newTotal, scale2, blocksNeeded)
          },
          {
            label: `Number of grid blocks tall:`,
            expectedAnswer: String(blocksNeeded),
            acceptedAnswers: [String(blocksNeeded)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(blocksNeeded);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. After ${delta} more ${theme.unit} are ${verb} for ${cat}, the new total is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}. How many grid blocks tall will the bar for ${cat} be?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(blocksNeeded);
        const opts = getFourOptions(finalAnswer, [
          String(blocksNeeded + 1),
          String(Math.max(1, blocksNeeded - 1)),
          String(blocksNeeded + 2),
          String(Math.max(1, blocksNeeded - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. After ${delta} more ${theme.unit} are ${verb} for ${cat}, the new total is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}. How many grid blocks tall will the bar be?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(blocksNeeded);
      }

    } else if (subType === 'subtraction') {
      const catIdx = getRandomInt(0, barCount - 1);
      const cat = theme.items[catIdx];

      // Curate pairs for subtraction: newTotal = blocksNeeded * scale2 < startVal <= 7 * scale1
      const subConfigs = [
        { scale1: 5, scale2: 10, blocksNeeded: 2, minB1: 5, maxB1: 6 },
        { scale1: 10, scale2: 20, blocksNeeded: 2, minB1: 5, maxB1: 6 },
        { scale1: 10, scale2: 25, blocksNeeded: 2, minB1: 6, maxB1: 7 },
        { scale1: 20, scale2: 50, blocksNeeded: 2, minB1: 6, maxB1: 7 },
        { scale1: 25, scale2: 50, blocksNeeded: 2, minB1: 5, maxB1: 6 },
        { scale1: 50, scale2: 100, blocksNeeded: 2, minB1: 5, maxB1: 6 }
      ];
      const cfg = subConfigs[getRandomInt(0, subConfigs.length - 1)];
      const scale1 = cfg.scale1;
      const scale2 = cfg.scale2;

      const blocksNeeded = cfg.blocksNeeded;
      const newTotal = blocksNeeded * scale2;

      const b1 = getRandomInt(cfg.minB1, cfg.maxB1);
      let startVal = b1 * scale1;
      if (scale1 % 2 === 0 && Math.random() > 0.5) {
        startVal += scale1 / 2;
      }
      const delta = startVal - newTotal;

      const removeVerbs = ['sold', 'given away', 'eaten', 'distributed', 'used', 'borrowed'];
      const verb = removeVerbs[getRandomInt(0, removeVerbs.length - 1)];

      const colors = getRandomPaletteColors(barCount);
      const data = theme.items.map((item, idx) => {
        if (idx === catIdx) return { category: item, value: startVal, color: colors[idx] };
        const bOther = getRandomInt(2, Math.min(6, b1));
        const valOther = (Math.random() > 0.5 && scale1 % 2 === 0) ? (bOther * scale1 + scale1 / 2) : (bOther * scale1);
        return { category: item, value: valOther, color: colors[idx] };
      });

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scale1,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Later, ${delta} ${theme.unit} are ${verb} from ${cat}. If the remaining amount is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}, how many grid blocks tall will the bar for ${cat} be?"`;
        const stepsArr = [
          {
            label: `Number of ${theme.unit} for ${cat} on the graph:`,
            expectedAnswer: String(startVal),
            acceptedAnswers: [String(startVal)]
          },
          {
            label: `Write the working equation to find the remaining amount of ${cat}:`,
            expectedAnswer: `${startVal} - ${delta} = ${newTotal}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(startVal, delta, newTotal)
          },
          {
            label: `Write the working equation to find the number of grid blocks needed on the new graph:`,
            expectedAnswer: `${newTotal} / ${scale2} = ${blocksNeeded}`,
            acceptedAnswers: getDivisionAcceptedAnswers(newTotal, scale2, blocksNeeded)
          },
          {
            label: `Number of grid blocks tall:`,
            expectedAnswer: String(blocksNeeded),
            acceptedAnswers: [String(blocksNeeded)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(blocksNeeded);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. After ${delta} ${theme.unit} are ${verb} from ${cat}, the remaining amount is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}. How many grid blocks tall will the bar for ${cat} be?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(blocksNeeded);
        const opts = getFourOptions(finalAnswer, [
          String(blocksNeeded + 1),
          String(Math.max(1, blocksNeeded - 1)),
          String(blocksNeeded + 2),
          String(Math.max(1, blocksNeeded - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. If ${delta} ${theme.unit} are ${verb} from ${cat}, and the remaining amount is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}, how many grid blocks tall will the bar be?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(blocksNeeded);
      }

    } else if (subType === 'combined') {
      const idx1 = 0;
      const idx2 = 1;
      const cat1 = theme.items[idx1];
      const cat2 = theme.items[idx2];

      const combConfigs = [
        { scale1: 5, scale2: 10, pairs: [[3, 3], [4, 4], [3, 5], [4, 6]] },
        { scale1: 5, scale2: 20, pairs: [[3, 5], [4, 4], [5, 7]] },
        { scale1: 10, scale2: 20, pairs: [[2, 4], [3, 3], [3, 5], [4, 4]] },
        { scale1: 10, scale2: 25, pairs: [[4, 6], [5, 5], [3, 7]] },
        { scale1: 20, scale2: 50, pairs: [[2, 3], [4, 6]] },
        { scale1: 25, scale2: 50, pairs: [[2, 4], [3, 3], [4, 4]] },
        { scale1: 50, scale2: 100, pairs: [[2, 4], [3, 3], [4, 4]] }
      ];
      const cfg = combConfigs[getRandomInt(0, combConfigs.length - 1)];
      const scale1 = cfg.scale1;
      const scale2 = cfg.scale2;

      const p = cfg.pairs[getRandomInt(0, cfg.pairs.length - 1)];
      const val1 = p[0] * scale1;
      const val2 = p[1] * scale1;
      const combinedTotal = val1 + val2;
      const blocksNeeded = Math.round(combinedTotal / scale2);

      const colors = getRandomPaletteColors(barCount);
      const data = theme.items.map((item, idx) => {
        if (idx === idx1) return { category: item, value: val1, color: colors[idx] };
        if (idx === idx2) return { category: item, value: val2, color: colors[idx] };
        const bOther = getRandomInt(2, 5);
        const valOther = (Math.random() > 0.5 && scale1 % 2 === 0) ? (bOther * scale1 + scale1 / 2) : (bOther * scale1);
        return { category: item, value: valOther, color: colors[idx] };
      });

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scale1,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. If the combined total of ${cat1} and ${cat2} is drawn as a summary bar on a new graph where 1 grid block stands for ${scale2} ${theme.unit}, how many grid blocks tall will the summary bar be?"`;
        const stepsArr = [
          {
            label: `Number of ${theme.unit} for ${cat1} on the graph:`,
            expectedAnswer: String(val1),
            acceptedAnswers: [String(val1)]
          },
          {
            label: `Number of ${theme.unit} for ${cat2} on the graph:`,
            expectedAnswer: String(val2),
            acceptedAnswers: [String(val2)]
          },
          {
            label: `Write the working equation to find the combined total of ${cat1} and ${cat2}:`,
            expectedAnswer: `${val1} + ${val2} = ${combinedTotal}`,
            acceptedAnswers: getAdditionAcceptedAnswers(val1, val2, combinedTotal)
          },
          {
            label: `Write the working equation to find the number of grid blocks needed on the new graph:`,
            expectedAnswer: `${combinedTotal} / ${scale2} = ${blocksNeeded}`,
            acceptedAnswers: getDivisionAcceptedAnswers(combinedTotal, scale2, blocksNeeded)
          },
          {
            label: `Number of grid blocks tall:`,
            expectedAnswer: String(blocksNeeded),
            acceptedAnswers: [String(blocksNeeded)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(blocksNeeded);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. If the combined total of ${cat1} and ${cat2} is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}, how many grid blocks tall will the combined bar be?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(blocksNeeded);
        const opts = getFourOptions(finalAnswer, [
          String(blocksNeeded + 1),
          String(Math.max(1, blocksNeeded - 1)),
          String(blocksNeeded + 2),
          String(Math.max(1, blocksNeeded - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. If the combined total of ${cat1} and ${cat2} is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}, how many grid blocks tall will the combined bar be?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(blocksNeeded);
      }

    } else {
      // reverse_working
      const catIdx = getRandomInt(0, barCount - 1);
      const cat = theme.items[catIdx];

      const revConfigs = [
        { scale1: 5, scale2: 10, blocksRange: [4, 5, 6], minB1: 4, maxB1: 6 },
        { scale1: 5, scale2: 20, blocksRange: [3, 4], minB1: 4, maxB1: 6 },
        { scale1: 10, scale2: 20, blocksRange: [3, 4, 5], minB1: 3, maxB1: 5 },
        { scale1: 10, scale2: 25, blocksRange: [3, 4], minB1: 4, maxB1: 6 },
        { scale1: 10, scale2: 50, blocksRange: [2, 3], minB1: 4, maxB1: 6 },
        { scale1: 20, scale2: 50, blocksRange: [3, 4], minB1: 3, maxB1: 5 },
        { scale1: 25, scale2: 50, blocksRange: [3, 4], minB1: 3, maxB1: 5 },
        { scale1: 50, scale2: 100, blocksRange: [3, 4], minB1: 3, maxB1: 5 }
      ];
      const cfg = revConfigs[getRandomInt(0, revConfigs.length - 1)];
      const scale1 = cfg.scale1;
      const scale2 = cfg.scale2;

      const blocksNew = cfg.blocksRange[getRandomInt(0, cfg.blocksRange.length - 1)];
      const newTotal = blocksNew * scale2;

      const maxB1 = Math.min(cfg.maxB1, Math.floor((newTotal - scale1) / scale1));
      const minB1 = Math.min(cfg.minB1, maxB1);
      const b1 = getRandomInt(minB1, maxB1);

      let startVal = b1 * scale1;
      if (scale1 % 2 === 0 && Math.random() > 0.5 && (startVal + scale1 / 2 < newTotal)) {
        startVal += scale1 / 2;
      }
      const delta = newTotal - startVal;

      const colors = getRandomPaletteColors(barCount);
      const data = theme.items.map((item, idx) => {
        if (idx === catIdx) return { category: item, value: startVal, color: colors[idx] };
        const bOther = getRandomInt(2, Math.min(6, b1 + 1));
        const valOther = (Math.random() > 0.5 && scale1 % 2 === 0) ? (bOther * scale1 + scale1 / 2) : (bOther * scale1);
        return { category: item, value: valOther, color: colors[idx] };
      });

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scale1,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Later, more ${theme.unit} were added to ${cat}, and the new total was drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}. On the new graph, the bar for ${cat} is ${blocksNew} grid blocks tall. How many ${theme.unit} were added?"`;
        const stepsArr = [
          {
            label: `Number of ${theme.unit} for ${cat} on the graph:`,
            expectedAnswer: String(startVal),
            acceptedAnswers: [String(startVal)]
          },
          {
            label: `Write the working equation to find the new total on the new graph:`,
            expectedAnswer: `${blocksNew} x ${scale2} = ${newTotal}`,
            acceptedAnswers: getMultiplicationAcceptedAnswers(blocksNew, scale2, newTotal)
          },
          {
            label: `Write the working equation to find how many ${theme.unit} were added:`,
            expectedAnswer: `${newTotal} - ${startVal} = ${delta}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(newTotal, startVal, delta)
          },
          {
            label: `Number of ${theme.unit} added:`,
            expectedAnswer: String(delta),
            acceptedAnswers: [String(delta)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(delta);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Later, more ${theme.unit} were added to ${cat} and drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit} as a bar ${blocksNew} grid blocks tall. How many ${theme.unit} were added?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(delta);
        const opts = getFourOptions(finalAnswer, [
          String(delta + scale2),
          String(Math.max(scale1, delta - scale2)),
          String(newTotal),
          String(startVal)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. After more ${theme.unit} are added to ${cat}, the new total is drawn ${blocksNew} grid blocks tall on a new graph where 1 grid block stands for ${scale2} ${theme.unit}. How many ${theme.unit} were added?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(delta);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 13: Blank Axis Financial Application
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
