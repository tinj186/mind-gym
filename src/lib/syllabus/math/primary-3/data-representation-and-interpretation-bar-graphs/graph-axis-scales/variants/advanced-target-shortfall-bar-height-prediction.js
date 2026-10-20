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

export function generateAdvancedTargetShortfallBarHeightPrediction({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleOptions = [10, 20, 25, 50, 100];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];

    const sfTheme = getRandomTargetShortfallTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const verb = sfTheme.verb || 'collect';
    const pastVerb = sfTheme.pastVerb || 'collected';
    const prep = sfTheme.prep || 'in';
    const categoriesPlural = sfTheme.categoriesPlural || 'categories';
    const categorySingular = sfTheme.categorySingular || 'category';

    // 3 or 4 bars
    const barCount = Math.random() > 0.4 ? 4 : 3;
    const allCats = sfTheme.items && sfTheme.items.length >= barCount
      ? sfTheme.items.slice(0, barCount)
      : (barCount === 4 ? ["Week 1", "Week 2", "Week 3", "Week 4"] : ["Week 1", "Week 2", "Week 3"]);

    // Missing bar can be ANY position (not just the last one!)
    const missingIdx = getRandomInt(0, barCount - 1);
    const missingCat = allCats[missingIdx];
    const knownIndices = [];
    for (let i = 0; i < barCount; i++) {
      if (i !== missingIdx) knownIndices.push(i);
    }

    // Generate known bar heights (blocks)
    const possibleBlocks = [2, 2.5, 3, 3.5, 4, 5];
    const blocksArr = [];
    for (let i = 0; i < barCount; i++) {
      if (i === missingIdx) {
        blocksArr.push(0);
      } else {
        blocksArr.push(possibleBlocks[getRandomInt(0, possibleBlocks.length - 1)]);
      }
    }

    // Values of known bars
    const knownValues = knownIndices.map(idx => blocksArr[idx] * scaleStep);
    const knownSum = knownValues.reduce((acc, v) => acc + v, 0);
    const knownCats = knownIndices.map(idx => allCats[idx]);
    const knownCatsStr = knownCats.length === 2
      ? `${knownCats[0]} and ${knownCats[1]}`
      : `${knownCats[0]}, ${knownCats[1]}, and ${knownCats[2]}`;

    // Helper for addition equation across known bars
    const getKnownSumAdditionAccepted = () => {
      if (knownValues.length === 2) {
        return getAdditionAcceptedAnswers(knownValues[0], knownValues[1], knownSum);
      }
      return getThreeAdditionAcceptedAnswers(knownValues[0], knownValues[1], knownValues[2], knownSum);
    };

    // Archetypes:
    // 1. 'overall_target': Grand goal across all categories
    // 2. 'comparative_multiple': Target is k times another known bar (k = 2 or 3)
    // 3. 'comparative_sum': Target equals the sum of two known bars
    // 4. 'comparative_excess': Target exceeds a known bar by a stated difference
    // 5. 'average_target': Target average per category
    const archetypes = [
      'overall_target',
      'overall_target',
      'comparative_multiple',
      'comparative_sum',
      'comparative_excess',
      'average_target'
    ];
    const archetype = archetypes[getRandomInt(0, archetypes.length - 1)];

    let blocksNeeded = 0;
    let shortage = 0;
    let goal = 0;
    let stepsArr = [];
    let candidateDistractors = [];

    if (archetype === 'overall_target') {
      const possibleTargetBlocks = [2, 3, 4, 5];
      blocksNeeded = possibleTargetBlocks[getRandomInt(0, possibleTargetBlocks.length - 1)];
      shortage = blocksNeeded * scaleStep;
      goal = knownSum + shortage;

      const askItems = Math.random() < 0.25;

      if (!askItems) {
        finalAnswer = String(blocksNeeded);
        askText = isStructure
          ? `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A goal was set to ${verb} exactly ${goal} ${sfTheme.unit} across all ${barCount} ${categoriesPlural}. The bar graph shows the amounts ${pastVerb} for ${knownCatsStr}. To reach the goal, how many grid blocks tall must the bar for ${missingCat} be drawn? Show your working and the final answer."`
          : `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A goal was set to ${verb} exactly ${goal} ${sfTheme.unit} across all ${barCount} ${categoriesPlural}. The bar graph shows the amounts ${pastVerb} for ${knownCatsStr}. Based on the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn to reach the goal?"`;

        stepsArr = [
          {
            label: `Write the working equation to find the total ${sfTheme.unit} ${pastVerb} in ${knownCatsStr}:`,
            expectedAnswer: knownValues.length === 2
              ? `${knownValues[0]} + ${knownValues[1]} = ${knownSum}`
              : `${knownValues[0]} + ${knownValues[1]} + ${knownValues[2]} = ${knownSum}`,
            acceptedAnswers: getKnownSumAdditionAccepted()
          },
          {
            label: `Write the working equation to find the shortage needed for ${missingCat}:`,
            expectedAnswer: `${goal} - ${knownSum} = ${shortage}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(goal, knownSum, shortage)
          },
          {
            label: `Write the working equation to find how many grid blocks tall the bar for ${missingCat} must be:`,
            expectedAnswer: `${shortage} / ${scaleStep} = ${blocksNeeded}`,
            acceptedAnswers: [
              ...getDivisionAcceptedAnswers(shortage, scaleStep, blocksNeeded),
              String(blocksNeeded)
            ]
          }
        ];

        candidateDistractors = [
          String(blocksNeeded + 1),
          String(Math.max(1, blocksNeeded - 1)),
          String(blocksNeeded + 2),
          String(blocksNeeded + 0.5)
        ];

      } else {
        finalAnswer = String(shortage);
        askText = isStructure
          ? `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A goal was set to ${verb} exactly ${goal} ${sfTheme.unit} across all ${barCount} ${categoriesPlural}. The bar graph shows the amounts ${pastVerb} for ${knownCatsStr}. How many more ${sfTheme.unit} must be ${pastVerb} ${prep} ${missingCat} to reach the goal? Show your working and the final answer."`
          : `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A goal was set to ${verb} exactly ${goal} ${sfTheme.unit} across all ${barCount} ${categoriesPlural}. The bar graph shows the amounts ${pastVerb} for ${knownCatsStr}. How many more ${sfTheme.unit} must be ${pastVerb} ${prep} ${missingCat} to reach the goal?"`;

        stepsArr = [
          {
            label: `Write the working equation to find the total ${sfTheme.unit} ${pastVerb} in ${knownCatsStr}:`,
            expectedAnswer: knownValues.length === 2
              ? `${knownValues[0]} + ${knownValues[1]} = ${knownSum}`
              : `${knownValues[0]} + ${knownValues[1]} + ${knownValues[2]} = ${knownSum}`,
            acceptedAnswers: getKnownSumAdditionAccepted()
          },
          {
            label: `Write the working equation to find how many more ${sfTheme.unit} are needed for ${missingCat}:`,
            expectedAnswer: `${goal} - ${knownSum} = ${shortage}`,
            acceptedAnswers: [
              ...getSubtractionAcceptedAnswers(goal, knownSum, shortage),
              String(shortage)
            ]
          }
        ];

        candidateDistractors = [
          String(shortage + scaleStep),
          String(Math.max(scaleStep, shortage - scaleStep)),
          String(shortage + scaleStep * 2),
          String(blocksNeeded)
        ];
      }

    } else if (archetype === 'comparative_multiple') {
      const compIdx = knownIndices[getRandomInt(0, knownIndices.length - 1)];
      const compCat = allCats[compIdx];
      const compVal = blocksArr[compIdx] * scaleStep;
      const compBlocks = blocksArr[compIdx];

      const multiplier = Math.random() > 0.5 ? 2 : 3;
      blocksNeeded = compBlocks * multiplier;
      shortage = blocksNeeded * scaleStep;

      finalAnswer = String(blocksNeeded);

      askText = isStructure
        ? `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the amounts ${pastVerb} ${sfTheme.activity}. The target for ${missingCat} is to have exactly ${multiplier} times the amount ${prep} ${compCat}. Based on the scale of the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn? Show your working and the final answer."`
        : `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the amounts ${pastVerb} ${sfTheme.activity}. The target for ${missingCat} is to have exactly ${multiplier} times the amount ${prep} ${compCat}. Based on the scale of the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn?"`;

      stepsArr = [
        {
          label: `Write the working equation to find the target amount for ${missingCat}:`,
          expectedAnswer: `${compVal} x ${multiplier} = ${shortage}`,
          acceptedAnswers: getMultiplicationAcceptedAnswers(compVal, multiplier, shortage)
        },
        {
          label: `Write the working equation to find how many grid blocks tall the bar for ${missingCat} must be:`,
          expectedAnswer: `${shortage} / ${scaleStep} = ${blocksNeeded}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(shortage, scaleStep, blocksNeeded),
            ...getMultiplicationAcceptedAnswers(compBlocks, multiplier, blocksNeeded),
            String(blocksNeeded)
          ]
        }
      ];

      candidateDistractors = [
        String(blocksNeeded + 1),
        String(Math.max(1, blocksNeeded - 1)),
        String(compBlocks),
        String(blocksNeeded + 2)
      ];

    } else if (archetype === 'comparative_sum') {
      const c1 = knownIndices[0];
      const c2 = knownIndices[1];
      const cat1Name = allCats[c1];
      const cat2Name = allCats[c2];
      const val1 = blocksArr[c1] * scaleStep;
      const val2 = blocksArr[c2] * scaleStep;
      const sumTwo = val1 + val2;
      blocksNeeded = blocksArr[c1] + blocksArr[c2];
      shortage = sumTwo;

      finalAnswer = String(blocksNeeded);

      askText = isStructure
        ? `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the amounts ${pastVerb} ${sfTheme.activity}. The goal for ${missingCat} is to have the same amount as ${cat1Name} and ${cat2Name} combined. Based on the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn? Show your working and the final answer."`
        : `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the amounts ${pastVerb} ${sfTheme.activity}. The goal for ${missingCat} is to have the same amount as ${cat1Name} and ${cat2Name} combined. Based on the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn?"`;

      stepsArr = [
        {
          label: `Write the working equation to find the combined total of ${cat1Name} and ${cat2Name}:`,
          expectedAnswer: `${val1} + ${val2} = ${sumTwo}`,
          acceptedAnswers: getAdditionAcceptedAnswers(val1, val2, sumTwo)
        },
        {
          label: `Write the working equation to find how many grid blocks tall the bar for ${missingCat} must be:`,
          expectedAnswer: `${sumTwo} / ${scaleStep} = ${blocksNeeded}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(sumTwo, scaleStep, blocksNeeded),
            ...getAdditionAcceptedAnswers(blocksArr[c1], blocksArr[c2], blocksNeeded),
            String(blocksNeeded)
          ]
        }
      ];

      candidateDistractors = [
        String(blocksNeeded + 1),
        String(Math.max(1, blocksNeeded - 1)),
        String(blocksArr[c1]),
        String(blocksNeeded + 2)
      ];

    } else if (archetype === 'comparative_excess') {
      const compIdx = knownIndices[0];
      const compCat = allCats[compIdx];
      const compVal = blocksArr[compIdx] * scaleStep;
      const extraBlocks = getRandomInt(1, 3);
      const diffVal = extraBlocks * scaleStep;

      blocksNeeded = blocksArr[compIdx] + extraBlocks;
      shortage = compVal + diffVal;

      finalAnswer = String(blocksNeeded);

      askText = isStructure
        ? `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the amounts ${pastVerb} ${sfTheme.activity}. The target for ${missingCat} is to ${verb} exactly ${diffVal} more ${sfTheme.unit} than ${compCat}. Based on the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn? Show your working and the final answer."`
        : `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the amounts ${pastVerb} ${sfTheme.activity}. The target for ${missingCat} is to ${verb} exactly ${diffVal} more ${sfTheme.unit} than ${compCat}. Based on the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn?"`;

      stepsArr = [
        {
          label: `Write the working equation to find the target amount for ${missingCat}:`,
          expectedAnswer: `${compVal} + ${diffVal} = ${shortage}`,
          acceptedAnswers: getAdditionAcceptedAnswers(compVal, diffVal, shortage)
        },
        {
          label: `Write the working equation to find how many grid blocks tall the bar for ${missingCat} must be:`,
          expectedAnswer: `${shortage} / ${scaleStep} = ${blocksNeeded}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(shortage, scaleStep, blocksNeeded),
            String(blocksNeeded)
          ]
        }
      ];

      candidateDistractors = [
        String(blocksNeeded + 1),
        String(Math.max(1, blocksNeeded - 1)),
        String(extraBlocks),
        String(blocksNeeded + 2)
      ];

    } else { // 'average_target'
      blocksNeeded = getRandomInt(2, 5);
      shortage = blocksNeeded * scaleStep;
      goal = knownSum + shortage;
      const rem = goal % barCount;
      if (rem !== 0) {
        blocksNeeded += (barCount - rem);
        shortage = blocksNeeded * scaleStep;
        goal = knownSum + shortage;
      }
      const finalAvgVal = Math.round(goal / barCount);

      finalAnswer = String(blocksNeeded);

      askText = isStructure
        ? `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The ${sfTheme.targetSubject} set a goal to ${verb} an average of ${finalAvgVal} ${sfTheme.unit} per ${categorySingular} across all ${barCount} ${categoriesPlural}. The bar graph shows the amounts ${pastVerb} for ${knownCatsStr}. How many grid blocks tall must the bar for ${missingCat} be drawn to achieve this goal? Show your working and the final answer."`
        : `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The ${sfTheme.targetSubject} set a goal to ${verb} an average of ${finalAvgVal} ${sfTheme.unit} per ${categorySingular} across all ${barCount} ${categoriesPlural}. The bar graph shows the amounts ${pastVerb} for ${knownCatsStr}. How many grid blocks tall must the bar for ${missingCat} be drawn to achieve this goal?"`;

      stepsArr = [
        {
          label: `Write the working equation to find the total ${sfTheme.unit} needed across all ${barCount} ${categoriesPlural}:`,
          expectedAnswer: `${finalAvgVal} x ${barCount} = ${goal}`,
          acceptedAnswers: getMultiplicationAcceptedAnswers(finalAvgVal, barCount, goal)
        },
        {
          label: `Write the working equation to find the total ${sfTheme.unit} ${pastVerb} in ${knownCatsStr}:`,
          expectedAnswer: knownValues.length === 2
            ? `${knownValues[0]} + ${knownValues[1]} = ${knownSum}`
            : `${knownValues[0]} + ${knownValues[1]} + ${knownValues[2]} = ${knownSum}`,
          acceptedAnswers: getKnownSumAdditionAccepted()
        },
        {
          label: `Write the working equation to find the shortage needed for ${missingCat}:`,
          expectedAnswer: `${goal} - ${knownSum} = ${shortage}`,
          acceptedAnswers: getSubtractionAcceptedAnswers(goal, knownSum, shortage)
        },
        {
          label: `Write the working equation to find how many grid blocks tall the bar for ${missingCat} must be:`,
          expectedAnswer: `${shortage} / ${scaleStep} = ${blocksNeeded}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(shortage, scaleStep, blocksNeeded),
            String(blocksNeeded)
          ]
        }
      ];

      candidateDistractors = [
        String(blocksNeeded + 1),
        String(Math.max(1, blocksNeeded - 1)),
        String(blocksNeeded + 2),
        String(Math.round(finalAvgVal / scaleStep))
      ];
    }

    const colors = getRandomPaletteColors(barCount);
    const data = allCats.map((cat, i) => ({
      category: cat,
      value: i === missingIdx ? 0 : blocksArr[i] * scaleStep,
      color: colors[i]
    }));

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_GRAPH",
      componentData: {
        title: sfTheme.title,
        xAxisLabel: sfTheme.xAxisLabel,
        yAxisLabel: sfTheme.yAxisLabel,
        data,
        scaleStep,
        orientation,
        showGridLines: true,
        missingBar: missingCat
      }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      const opts = getFourOptions(finalAnswer, candidateDistractors);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
