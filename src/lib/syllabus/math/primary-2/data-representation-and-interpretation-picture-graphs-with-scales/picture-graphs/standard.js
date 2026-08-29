import { getRandomNames, getRandomTheme } from '../../../../../utils/variable-bank';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let structureText = '';
  let shortText = '';
  let actualAnswer = '';
  let mcqOptions = [];

  let hintStr = '';
  let stepsStr = '[]';
  let structureSteps = [];

  const scales = [2, 3, 4, 5, 10];
  const scale = getRandomElement(scales);
  const neutralEmojis = ['⭐️', '⬛️', '🟢', '🔷', '🔺'];
  const symbol = getRandomElement(neutralEmojis);

  const theme = getRandomTheme(4);

  // Generate unique counts for each category (guarantees unique min/max/targets)
  const availableCounts = [1, 2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random());
  
  const categories = theme.items.map((item, index) => ({
    label: item,
    count: availableCounts[index],
    emoji: symbol
  }));

  const graphData = {
    title: `Number of ${theme.name}`,
    key: `Each ${symbol} stands for ${scale} ${theme.name}`,
    categories: categories,
    orientation: Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL'
  };

  let visualEngineStr = '';
  const buildVisualEngine = () => {
    return JSON.stringify({
      componentToRender: "PICTURE_GRAPH_DISPLAY",
      componentData: graphData
    }, null, 2);
  };

  if (activeVariant === 'standard_difference_between_categories') {
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    const catA = shuffled[0];
    const catB = shuffled[1];

    if (catA.count === catB.count) {
      catA.count += 1;
    }

    const isReverse = Math.random() > 0.5;

    if (isReverse) {
      const originalCatBCount = catB.count;
      catB.count = '?';
      visualEngineStr = buildVisualEngine();

      const diffSymbols = Math.abs(catA.count - originalCatBCount);
      const diffItems = diffSymbols * scale;
      const isMore = originalCatBCount > catA.count;
      const comparisonWord = isMore ? 'more' : 'fewer';

      actualAnswer = String(originalCatBCount);

      shortText = `There are ${diffItems} ${comparisonWord} ${theme.name.toLowerCase()} for ${catB.label} than for ${catA.label}. How many ${symbol} should be drawn for ${catB.label}?`;
      structureText = `Look at the picture graph. There are ${diffItems} ${comparisonWord} ${theme.name.toLowerCase()} for ${catB.label} than for ${catA.label}. How many ${symbol} should be drawn in the missing row for ${catB.label}? Show your working and the final answer.`;

      hintStr = `First find the difference in ${symbol} (${diffItems} ÷ ${scale}). Then use it to find the number of ${symbol} for ${catB.label}.`;

      const operator = isMore ? '+' : '-';

      stepsStr = JSON.stringify([
        `Difference in ${symbol} = ${diffItems} ÷ ${scale} = ${diffSymbols}.`,
        `${catB.label} has ${diffSymbols} ${comparisonWord} ${symbol} than ${catA.label}.`,
        `${catA.label} has ${catA.count} ${symbol}.`,
        `${catA.count} ${operator} ${diffSymbols} = ${originalCatBCount} ${symbol} for ${catB.label}.`
      ]);

      structureSteps = [
        { label: `Working equation for difference in ${symbol}`, expectedAnswer: `${diffItems} ÷ ${scale}` },
        { label: `Working equation for ${catB.label}`, expectedAnswer: `${catA.count} ${operator} ${diffSymbols}` },
        { label: `Number of ${symbol} to draw`, expectedAnswer: actualAnswer }
      ];

      if (isMCQ) {
        mcqOptions = [actualAnswer, String(diffSymbols), String(catA.count + diffSymbols), String(Math.abs(catA.count - diffSymbols))];
      }
    } else {
      visualEngineStr = buildVisualEngine();

      const diffSymbols = Math.abs(catA.count - catB.count);
      const isMore = Math.random() > 0.5;
      const comparisonWord = isMore ? 'more' : 'fewer';

      let higherCat = catA.count > catB.count ? catA : catB;
      let lowerCat = catA.count > catB.count ? catB : catA;

      let subject = isMore ? higherCat : lowerCat;
      let target = isMore ? lowerCat : higherCat;

      actualAnswer = String(diffSymbols * scale);
      
      shortText = `What is the difference in the number of ${catA.label} and ${catB.label}?`;
      structureText = `Look at the picture graph. What is the difference in the number of ${catA.label} and ${catB.label}? Show your working and the final answer.`;

      hintStr = `Find the difference in the number of ${symbol} between ${subject.label} and ${target.label}, then multiply by ${scale}.`;
      stepsStr = JSON.stringify([
        `${higherCat.label} has ${higherCat.count} ${symbol} and ${lowerCat.label} has ${lowerCat.count} ${symbol}.`,
        `Difference in ${symbol} = ${higherCat.count} - ${lowerCat.count} = ${diffSymbols}.`,
        `Each ${symbol} stands for ${scale} ${theme.name}.`,
        `${diffSymbols} x ${scale} = ${actualAnswer}.`
      ]);

      structureSteps = [
        { label: `Working equation for difference in ${symbol}`, expectedAnswer: `${higherCat.count} - ${lowerCat.count}` },
        { label: `Working equation for difference in ${theme.name.toLowerCase()}`, expectedAnswer: `${diffSymbols} x ${scale}` },
        { label: `Final answer`, expectedAnswer: actualAnswer }
      ];

      if (isMCQ) {
        mcqOptions = [actualAnswer, String((diffSymbols + 1) * scale), String(Math.abs(diffSymbols - 1) * scale), String(higherCat.count * scale)];
      }
    }

  } else if (activeVariant === 'standard_find_category_by_value') {
    const targetCat = getRandomElement(categories);
    const targetValue = targetCat.count * scale;

    visualEngineStr = buildVisualEngine();

    actualAnswer = targetCat.label;

    shortText = `Which item has exactly ${targetValue} ${theme.name.toLowerCase()}?`;
    structureText = `Look at the picture graph. Which item has exactly ${targetValue} ${theme.name.toLowerCase()}? Show your working and the final answer.`;

    hintStr = `Divide ${targetValue} by the scale (${scale}) to find the number of ${symbol} needed. Then find which row has that many ${symbol}.`;
    stepsStr = JSON.stringify([
      `Each ${symbol} stands for ${scale}.`,
      `Number of ${symbol} needed = ${targetValue} ÷ ${scale} = ${targetCat.count}.`,
      `The row for ${targetCat.label} has ${targetCat.count} ${symbol}.`
    ]);

    structureSteps = [
      { label: `Working equation to find number of ${symbol} needed`, expectedAnswer: `${targetValue} ÷ ${scale}` },
      { label: `Final answer`, expectedAnswer: actualAnswer }
    ];

    if (isMCQ) {
      mcqOptions = [actualAnswer, ...categories.filter(c => c.label !== actualAnswer).map(c => c.label)];
    }

  } else if (activeVariant === 'standard_total_all_categories') {
    // Re-generate counts to ensure total symbols <= 12, so multiplication/division stays within 12x tables
    categories[0].count = getRandomInt(3, 5);
    categories[1].count = getRandomInt(1, 3);
    categories[2].count = getRandomInt(1, 2);
    categories[3].count = getRandomInt(1, 2);
    categories.sort(() => 0.5 - Math.random());

    const isReverse = Math.random() > 0.5;

    if (isReverse) {
      const targetCatIndex = getRandomInt(0, categories.length - 1);
      const targetCat = categories[targetCatIndex];
      const originalCatCount = targetCat.count;
      targetCat.count = '?';

      visualEngineStr = buildVisualEngine();

      const otherCategories = categories.filter((c, i) => i !== targetCatIndex);
      const sumRest = otherCategories.reduce((sum, c) => sum + c.count, 0);
      const totalSymbols = sumRest + originalCatCount;
      const totalItems = totalSymbols * scale;
      const sumRestItems = sumRest * scale;
      const missingItems = originalCatCount * scale;

      actualAnswer = String(originalCatCount);

      shortText = `The total number of ${theme.name.toLowerCase()} in all is ${totalItems}. How many ${symbol} should be drawn for ${targetCat.label}?`;
      structureText = `Look at the picture graph. The total number of ${theme.name.toLowerCase()} in all is ${totalItems}. How many ${symbol} should be drawn in the missing row for ${targetCat.label}? Show your working and the final answer.`;

      hintStr = `First find the total ${theme.name.toLowerCase()} for the other items. Subtract that from ${totalItems} to find the missing ${theme.name.toLowerCase()}. Finally, divide by ${scale} to find the number of ${symbol} to draw.`;

      const additionEq = otherCategories.map(c => c.count).join(' + ');

      stepsStr = JSON.stringify([
        `${symbol} for other items = ${additionEq} = ${sumRest}.`,
        `${theme.name.toLowerCase()} for other items = ${sumRest} x ${scale} = ${sumRestItems}.`,
        `Missing ${theme.name.toLowerCase()} = ${totalItems} - ${sumRestItems} = ${missingItems}.`,
        `${missingItems} ÷ ${scale} = ${actualAnswer} ${symbol} for ${targetCat.label}.`
      ]);

      structureSteps = [
        { label: `Working equation for ${symbol} of other items`, expectedAnswer: additionEq },
        { label: `Working equation for ${theme.name.toLowerCase()} of other items`, expectedAnswer: `${sumRest} x ${scale}` },
        { label: `Working equation for missing ${theme.name.toLowerCase()}`, expectedAnswer: `${totalItems} - ${sumRestItems}` },
        { label: `Working equation for number of ${symbol} to draw`, expectedAnswer: `${missingItems} ÷ ${scale}` },
        { label: `Number of ${symbol} to draw`, expectedAnswer: actualAnswer }
      ];

      if (isMCQ) {
        mcqOptions = [actualAnswer, String(totalSymbols), String(sumRest), String(Math.abs(totalSymbols - sumRest) + 1)];
      }

    } else {
      visualEngineStr = buildVisualEngine();

      const totalSymbols = categories.reduce((sum, cat) => sum + cat.count, 0);
      actualAnswer = String(totalSymbols * scale);

      shortText = `What is the total number of ${theme.name.toLowerCase()} in all?`;
      structureText = `Look at the picture graph. What is the total number of ${theme.name.toLowerCase()} in all? Show your working and the final answer.`;

      hintStr = `First, find the total number of ${symbol} in the whole graph. Then multiply by ${scale}.`;

      const additionEq = categories.map(c => c.count).join(' + ');

      stepsStr = JSON.stringify([
        `Total ${symbol} = ${additionEq} = ${totalSymbols}.`,
        `Each ${symbol} stands for ${scale} ${theme.name}.`,
        `${totalSymbols} x ${scale} = ${actualAnswer}.`
      ]);

      structureSteps = [
        { label: `Working equation for total ${symbol}`, expectedAnswer: additionEq },
        { label: `Working equation for total ${theme.name.toLowerCase()}`, expectedAnswer: `${totalSymbols} x ${scale}` },
        { label: `Final answer`, expectedAnswer: actualAnswer }
      ];

      if (isMCQ) {
        mcqOptions = [actualAnswer, String((totalSymbols - 1) * scale), String((totalSymbols + 1) * scale), String(totalSymbols)];
      }
    }

  } else if (activeVariant === 'standard_combined_comparison') {
    // Pick 3 categories
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    const catA = shuffled[0];
    const catB = shuffled[1];
    const catC = shuffled[2];

    visualEngineStr = buildVisualEngine();

    const combinedSymbols = catA.count + catB.count;
    const isMore = combinedSymbols > catC.count;
    // ensure they are not equal, if so force it
    if (combinedSymbols === catC.count) {
      catC.count -= 1; // It was equal, so catC must be > 1. 
    }

    const newIsMore = combinedSymbols > catC.count;
    const diffSymbols = Math.abs(combinedSymbols - catC.count);

    actualAnswer = String(diffSymbols * scale);
    const comparisonWord = newIsMore ? 'more' : 'fewer';

    shortText = `How many ${comparisonWord} ${theme.name.toLowerCase()} do ${catA.label} and ${catB.label} have combined compared to ${catC.label}?`;
    structureText = `Look at the picture graph. How many ${comparisonWord} ${theme.name.toLowerCase()} do ${catA.label} and ${catB.label} have combined compared to ${catC.label}? Show your working and the final answer.`;

    hintStr = `First add the ${symbol} for ${catA.label} and ${catB.label}. Then find the difference compared to ${catC.label}. Finally, multiply by ${scale}.`;
    stepsStr = JSON.stringify([
      `Combined ${symbol} for ${catA.label} and ${catB.label} = ${catA.count} + ${catB.count} = ${combinedSymbols}.`,
      `${catC.label} has ${catC.count} ${symbol}.`,
      `Difference in ${symbol} = ${Math.max(combinedSymbols, catC.count)} - ${Math.min(combinedSymbols, catC.count)} = ${diffSymbols}.`,
      `${diffSymbols} x ${scale} = ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `Working equation for combined ${symbol} of ${catA.label} and ${catB.label}`, expectedAnswer: `${catA.count} + ${catB.count}` },
      { label: `Working equation for difference in ${symbol} compared to ${catC.label}`, expectedAnswer: `${Math.max(combinedSymbols, catC.count)} - ${Math.min(combinedSymbols, catC.count)}` },
      { label: `Working equation for difference in ${theme.name.toLowerCase()}`, expectedAnswer: `${diffSymbols} x ${scale}` },
      { label: `Final answer`, expectedAnswer: actualAnswer }
    ];

    if (isMCQ) {
      mcqOptions = [actualAnswer, String((diffSymbols + 1) * scale), String(combinedSymbols * scale), String((catA.count + catB.count + catC.count) * scale)];
    }

  } else if (activeVariant === 'standard_predictive_drawing') {
    const targetCat = getRandomElement(categories);
    const additionalSymbols = getRandomInt(2, 5);
    const additionalValue = additionalSymbols * scale;

    visualEngineStr = buildVisualEngine();

    actualAnswer = String(additionalSymbols);

    shortText = `If ${additionalValue} more ${theme.name.toLowerCase()} were added to ${targetCat.label}, how many more ${symbol} should be drawn?`;
    structureText = `Look at the picture graph. ${additionalValue} more ${theme.name.toLowerCase()} were added to ${targetCat.label}. How many more ${symbol} should be drawn in the row for ${targetCat.label}? Show your working and the final answer.`;

    hintStr = `Divide the additional number of ${theme.name.toLowerCase()} by the scale (${scale}) to find out how many more ${symbol} to draw.`;
    stepsStr = JSON.stringify([
      `Each ${symbol} stands for ${scale}.`,
      `Additional ${symbol} to draw = ${additionalValue} ÷ ${scale} = ${actualAnswer}.`
    ]);

    structureSteps = [
      { label: `Working equation for additional ${symbol} to draw`, expectedAnswer: `${additionalValue} ÷ ${scale}` },
      { label: `Final answer`, expectedAnswer: actualAnswer }
    ];

    if (isMCQ) {
      mcqOptions = [actualAnswer, String(additionalSymbols + 1), String(additionalValue), String(targetCat.count + additionalSymbols)];
    }

  } else {
    throw new Error(`Variant '${activeVariant}' logic block not implemented in standard.js.`);
  }

  // Defect map for MCQs (stubbed)
  const defectMap = {};

  // Standard multi-step JSON string formatting
  const multiStepInputStr = JSON.stringify({
    inputType: "MULTI_STEP_INPUT",
    steps: structureSteps
  });

  const finalInputReqStr = isStructure ? multiStepInputStr : (isMCQ ? `{"inputType": "MCQ_BUTTONS"}` : `{"inputType": "STANDARD_TEXT"}`);

  const questionTextArrStr = JSON.stringify([getQText(structureText, shortText)]);
  const mcqOptionsStr = isMCQ ? JSON.stringify([...new Set(mcqOptions)].slice(0, 4).sort(() => 0.5 - Math.random())) : `[]`;
  const defectMapStr = isMCQ ? JSON.stringify(defectMap) : `{}`;

  const aiPrompt = getFormatInstructions(visualEngineStr, finalInputReqStr) + `
CRITICAL INSTRUCTIONS:
- You are a curriculum generator for a Primary 2 math app.
- Write a short question testing this exact logic: ${activeVariant}
- MUST use this exact text for the question: ${questionTextArrStr} (Map this exact array to 'content.questionText')
- MUST use this exact pedagogical hint: "${hintStr}" (Map to 'content.hint')
- MUST use these exact solution steps: ${stepsStr} (Map to 'content.solutionSteps')
- MUST use this exact final answer: "${actualAnswer}" (Map to 'content.finalAnswer')
- If it is MCQ, shuffle the options and map exactly these strings: ${mcqOptionsStr} to 'content.options'
- For MCQ defectMap, use exactly: ${defectMapStr}
`;

  return {
    aiPrompt,
  };
}
