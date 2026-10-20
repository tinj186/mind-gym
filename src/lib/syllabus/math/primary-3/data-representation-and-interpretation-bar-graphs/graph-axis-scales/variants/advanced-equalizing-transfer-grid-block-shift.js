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

export function generateAdvancedEqualizingTransferGridBlockShift({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleOptions = [5, 10, 20, 25, 50];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const eqTheme = getRandomEqualizingTheme(3);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const containersPlural = eqTheme.containersPlural || 'groups';

    // 2 or 3 bars on the graph
    const barCount = Math.random() > 0.5 ? 3 : 2;
    const catA = eqTheme.items[0];
    const catB = eqTheme.items[1];
    const catC = barCount === 3 ? eqTheme.items[2] : null;

    // Pick Relationship Type:
    // 1. 'equal': both containers have the exact same number
    // 2. 'twice_recipient': catB has 2 times as many as catA
    // 3. 'three_times_recipient': catB has 3 times as many as catA
    // 4. 'twice_donor': catA still has 2 times as many as catB
    // 5. 'three_times_donor': catA still has 3 times as many as catB
    const relationshipTypes = [
      'equal',
      'twice_recipient',
      'three_times_recipient',
      'twice_donor',
      'three_times_donor'
    ];
    const relationship = relationshipTypes[getRandomInt(0, relationshipTypes.length - 1)];

    let bA, bB, blocksMoved, itemsMoved, relPhrase;
    let finalBlocksA, finalBlocksB;
    let stepsArr = [];

    if (relationship === 'equal') {
      relPhrase = `both ${containersPlural} have the exact same number of ${eqTheme.unit}`;
      blocksMoved = getRandomInt(1, 3); // 1, 2, 3 blocks moved
      const diffBlocks = blocksMoved * 2; // 2, 4, 6
      bB = getRandomInt(2, 5);
      bA = bB + diffBlocks;
      finalBlocksA = bA - blocksMoved;
      finalBlocksB = bB + blocksMoved;
      itemsMoved = blocksMoved * scaleStep;

      const valA = bA * scaleStep;
      const valB = bB * scaleStep;
      const valDiff = valA - valB;

      stepsArr = [
        {
          label: `Write the working equation to find the difference in ${eqTheme.unit} between ${catA} and ${catB}:`,
          expectedAnswer: `${valA} - ${valB} = ${valDiff}`,
          acceptedAnswers: getSubtractionAcceptedAnswers(valA, valB, valDiff)
        },
        {
          label: `Write the working equation to find how many ${eqTheme.unit} must be moved:`,
          expectedAnswer: `${valDiff} / 2 = ${itemsMoved}`,
          acceptedAnswers: getDivisionAcceptedAnswers(valDiff, 2, itemsMoved)
        },
        {
          label: `Write the working equation to find how many grid blocks shorter ${catA}'s bar will become:`,
          expectedAnswer: `${itemsMoved} / ${scaleStep} = ${blocksMoved}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(itemsMoved, scaleStep, blocksMoved),
            String(blocksMoved)
          ]
        }
      ];

    } else if (relationship === 'twice_recipient') {
      relPhrase = `${catB} has 2 times as many ${eqTheme.unit} as ${catA}`;
      finalBlocksA = getRandomInt(2, 4);
      finalBlocksB = finalBlocksA * 2;
      const totalBlocks = finalBlocksA + finalBlocksB; // 3 * finalBlocksA
      blocksMoved = getRandomInt(1, 2);
      bA = finalBlocksA + blocksMoved;
      bB = finalBlocksB - blocksMoved;
      if (bB < 1) {
        bB = 1;
        bA = totalBlocks - bB;
        blocksMoved = bA - finalBlocksA;
      }
      itemsMoved = blocksMoved * scaleStep;

      const valA = bA * scaleStep;
      const valB = bB * scaleStep;
      const totalVal = valA + valB;
      const oneUnitVal = totalVal / 3;

      stepsArr = [
        {
          label: `Write the working equation to find the total number of ${eqTheme.unit} in both ${containersPlural}:`,
          expectedAnswer: `${valA} + ${valB} = ${totalVal}`,
          acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, totalVal)
        },
        {
          label: `Write the working equation to find the number of ${eqTheme.unit} in 1 unit (${catA}'s final amount):`,
          expectedAnswer: `${totalVal} / 3 = ${oneUnitVal}`,
          acceptedAnswers: getDivisionAcceptedAnswers(totalVal, 3, oneUnitVal)
        },
        {
          label: `Write the working equation to find how many ${eqTheme.unit} were moved from ${catA} to ${catB}:`,
          expectedAnswer: `${valA} - ${oneUnitVal} = ${itemsMoved}`,
          acceptedAnswers: [
            ...getSubtractionAcceptedAnswers(valA, oneUnitVal, itemsMoved),
            ...getSubtractionAcceptedAnswers(finalBlocksB * scaleStep, valB, itemsMoved)
          ]
        },
        {
          label: `Write the working equation to find how many grid blocks shorter ${catA}'s bar will become:`,
          expectedAnswer: `${itemsMoved} / ${scaleStep} = ${blocksMoved}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(itemsMoved, scaleStep, blocksMoved),
            String(blocksMoved)
          ]
        }
      ];

    } else if (relationship === 'three_times_recipient') {
      relPhrase = `${catB} has 3 times as many ${eqTheme.unit} as ${catA}`;
      finalBlocksA = getRandomInt(1, 3);
      finalBlocksB = finalBlocksA * 3;
      const totalBlocks = finalBlocksA + finalBlocksB; // 4 * finalBlocksA
      blocksMoved = getRandomInt(1, 2);
      bA = finalBlocksA + blocksMoved;
      bB = finalBlocksB - blocksMoved;
      if (bB < 1) {
        bB = 1;
        bA = totalBlocks - bB;
        blocksMoved = bA - finalBlocksA;
      }
      itemsMoved = blocksMoved * scaleStep;

      const valA = bA * scaleStep;
      const valB = bB * scaleStep;
      const totalVal = valA + valB;
      const oneUnitVal = totalVal / 4;

      stepsArr = [
        {
          label: `Write the working equation to find the total number of ${eqTheme.unit} in both ${containersPlural}:`,
          expectedAnswer: `${valA} + ${valB} = ${totalVal}`,
          acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, totalVal)
        },
        {
          label: `Write the working equation to find the number of ${eqTheme.unit} in 1 unit (${catA}'s final amount):`,
          expectedAnswer: `${totalVal} / 4 = ${oneUnitVal}`,
          acceptedAnswers: getDivisionAcceptedAnswers(totalVal, 4, oneUnitVal)
        },
        {
          label: `Write the working equation to find how many ${eqTheme.unit} were moved from ${catA} to ${catB}:`,
          expectedAnswer: `${valA} - ${oneUnitVal} = ${itemsMoved}`,
          acceptedAnswers: [
            ...getSubtractionAcceptedAnswers(valA, oneUnitVal, itemsMoved),
            ...getSubtractionAcceptedAnswers(finalBlocksB * scaleStep, valB, itemsMoved)
          ]
        },
        {
          label: `Write the working equation to find how many grid blocks shorter ${catA}'s bar will become:`,
          expectedAnswer: `${itemsMoved} / ${scaleStep} = ${blocksMoved}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(itemsMoved, scaleStep, blocksMoved),
            String(blocksMoved)
          ]
        }
      ];

    } else if (relationship === 'twice_donor') {
      relPhrase = `${catA} still has 2 times as many ${eqTheme.unit} as ${catB}`;
      finalBlocksB = getRandomInt(2, 4);
      finalBlocksA = finalBlocksB * 2;
      const totalBlocks = finalBlocksA + finalBlocksB;
      blocksMoved = getRandomInt(1, Math.max(1, finalBlocksB - 1));
      bB = finalBlocksB - blocksMoved;
      bA = finalBlocksA + blocksMoved;
      itemsMoved = blocksMoved * scaleStep;

      const valA = bA * scaleStep;
      const valB = bB * scaleStep;
      const totalVal = valA + valB;
      const oneUnitVal = totalVal / 3; // final B

      stepsArr = [
        {
          label: `Write the working equation to find the total number of ${eqTheme.unit} in both ${containersPlural}:`,
          expectedAnswer: `${valA} + ${valB} = ${totalVal}`,
          acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, totalVal)
        },
        {
          label: `Write the working equation to find the number of ${eqTheme.unit} in 1 unit (${catB}'s final amount):`,
          expectedAnswer: `${totalVal} / 3 = ${oneUnitVal}`,
          acceptedAnswers: getDivisionAcceptedAnswers(totalVal, 3, oneUnitVal)
        },
        {
          label: `Write the working equation to find how many ${eqTheme.unit} were moved from ${catA} to ${catB}:`,
          expectedAnswer: `${oneUnitVal} - ${valB} = ${itemsMoved}`,
          acceptedAnswers: [
            ...getSubtractionAcceptedAnswers(oneUnitVal, valB, itemsMoved),
            ...getSubtractionAcceptedAnswers(valA, finalBlocksA * scaleStep, itemsMoved)
          ]
        },
        {
          label: `Write the working equation to find how many grid blocks shorter ${catA}'s bar will become:`,
          expectedAnswer: `${itemsMoved} / ${scaleStep} = ${blocksMoved}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(itemsMoved, scaleStep, blocksMoved),
            String(blocksMoved)
          ]
        }
      ];

    } else { // 'three_times_donor'
      relPhrase = `${catA} still has 3 times as many ${eqTheme.unit} as ${catB}`;
      finalBlocksB = getRandomInt(2, 3);
      finalBlocksA = finalBlocksB * 3;
      const totalBlocks = finalBlocksA + finalBlocksB;
      blocksMoved = getRandomInt(1, Math.max(1, finalBlocksB - 1));
      bB = finalBlocksB - blocksMoved;
      bA = finalBlocksA + blocksMoved;
      itemsMoved = blocksMoved * scaleStep;

      const valA = bA * scaleStep;
      const valB = bB * scaleStep;
      const totalVal = valA + valB;
      const oneUnitVal = totalVal / 4; // final B

      stepsArr = [
        {
          label: `Write the working equation to find the total number of ${eqTheme.unit} in both ${containersPlural}:`,
          expectedAnswer: `${valA} + ${valB} = ${totalVal}`,
          acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, totalVal)
        },
        {
          label: `Write the working equation to find the number of ${eqTheme.unit} in 1 unit (${catB}'s final amount):`,
          expectedAnswer: `${totalVal} / 4 = ${oneUnitVal}`,
          acceptedAnswers: getDivisionAcceptedAnswers(totalVal, 4, oneUnitVal)
        },
        {
          label: `Write the working equation to find how many ${eqTheme.unit} were moved from ${catA} to ${catB}:`,
          expectedAnswer: `${oneUnitVal} - ${valB} = ${itemsMoved}`,
          acceptedAnswers: [
            ...getSubtractionAcceptedAnswers(oneUnitVal, valB, itemsMoved),
            ...getSubtractionAcceptedAnswers(valA, finalBlocksA * scaleStep, itemsMoved)
          ]
        },
        {
          label: `Write the working equation to find how many grid blocks shorter ${catA}'s bar will become:`,
          expectedAnswer: `${itemsMoved} / ${scaleStep} = ${blocksMoved}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(itemsMoved, scaleStep, blocksMoved),
            String(blocksMoved)
          ]
        }
      ];
    }

    const colors = getRandomPaletteColors(barCount);
    const data = [
      { category: catA, value: bA * scaleStep, color: colors[0] },
      { category: catB, value: bB * scaleStep, color: colors[1] }
    ];
    if (barCount === 3 && catC) {
      const bC = getRandomInt(2, 6);
      data.push({ category: catC, value: bC * scaleStep, color: colors[2] });
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_GRAPH",
      componentData: {
        title: eqTheme.title,
        xAxisLabel: eqTheme.xAxisLabel,
        yAxisLabel: eqTheme.yAxisLabel,
        data,
        scaleStep,
        orientation,
        showGridLines: true
      }
    });

    const categoriesListStr = barCount === 3 ? `${catA}, ${catB}, and ${catC}` : `${catA} and ${catB}`;

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${eqTheme.unit} in ${categoriesListStr}. Some ${eqTheme.unit} are moved from ${catA} to ${catB} so that ${relPhrase}. How many grid blocks shorter will the bar for ${catA} become?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(blocksMoved);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${eqTheme.unit} in ${categoriesListStr}. Some ${eqTheme.unit} are moved from ${catA} to ${catB} so that ${relPhrase}. How many grid blocks shorter will the bar for ${catA} become?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(blocksMoved);
      const opts = getFourOptions(finalAnswer, [
        String(blocksMoved + 1),
        String(Math.max(1, blocksMoved - 1) === blocksMoved ? blocksMoved + 2 : Math.max(1, blocksMoved - 1)),
        String(blocksMoved + 3),
        String(bA - bB > 0 ? bA - bB : blocksMoved + 4)
      ]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${eqTheme.unit} in ${categoriesListStr}. Some ${eqTheme.unit} are moved from ${catA} to ${catB} so that ${relPhrase}. How many grid blocks shorter will the bar for ${catA} become?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(blocksMoved);
    }

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
