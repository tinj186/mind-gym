import { getRandomNames, getRandomTheme } from '../../../../../utils/variable-bank';

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  // Trap variant is too simple for Structured multi-step logic. Fallback to read_single_category.
  if (activeVariant === 'foundation_symbol_counting_trap' && isStructure) {
    activeVariant = 'foundation_read_single_category';
  }

  let structureText = '';
  let shortText = '';
  let actualAnswer = '';
  let hintStr = '';
  let stepsStr = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let mcqOptions = [];
  let structureSteps = [];

  const scales = [2, 3, 4, 5, 10];
  const scale = getRandomElement(scales);
  const neutralEmojis = ['⭐️', '⬛️', '🟢', '🔷', '🔺'];
  const symbol = getRandomElement(neutralEmojis);

  // Generate basic graph data
  const theme = getRandomTheme(4); // e.g. toys: ["Car", "Doll", "Ball", "Robot"]
  
  // Create categories with randomized counts of *drawn symbols* (between 2 and 6)
  const categories = theme.items.map(item => {
    return {
      label: item,
      count: getRandomInt(2, 6),
      emoji: symbol // Uniform symbol
    };
  });
  
  const graphData = {
    title: `Number of ${theme.name}`,
    key: `Each ${symbol} stands for ${scale} ${theme.name}`,
    categories: categories,
    orientation: Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL'
  };

  const buildVisualEngine = () => JSON.stringify({
    componentToRender: "PICTURE_GRAPH_DISPLAY",
    componentData: graphData
  });

  if (activeVariant === 'foundation_read_single_category') {
    const isReverse = Math.random() > 0.5;
    const targetCat = getRandomElement(categories);
    
    if (isReverse) {
      const originalCount = targetCat.count;
      const givenQuantity = originalCount * scale;
      
      targetCat.count = '?'; // Render the missing mark
      graphData.categories = categories; 
      visualEngineStr = buildVisualEngine();
      
      actualAnswer = String(originalCount);
      
      shortText = `Look at the picture graph. If there are exactly ${givenQuantity} ${targetCat.label.toLowerCase()}s in total, how many ${symbol} should be drawn in the row for ${targetCat.label}?`;
      structureText = shortText;
      
      hintStr = `To find the number of symbols to draw, you need to divide the total quantity (${givenQuantity}) by the scale (${scale}).`;
      stepsStr = JSON.stringify([
        `The total number of ${targetCat.label.toLowerCase()}s is ${givenQuantity}.`,
        `Each ${symbol} stands for ${scale} ${theme.name}.`,
        `${givenQuantity} ÷ ${scale} = ${actualAnswer}.`,
        `So, ${actualAnswer} ${symbol} should be drawn.`
      ]);
      
      structureSteps = [
        { label: `Working equation`, expectedAnswer: `${givenQuantity} ÷ ${scale}` },
        { label: `Number of ${symbol} to draw`, expectedAnswer: actualAnswer }
      ];
      
      if (isMCQ) {
        mcqOptions = [actualAnswer, String(originalCount * scale), String(originalCount + 1), String(Math.max(1, originalCount - 1))];
      }
    } else {
      visualEngineStr = buildVisualEngine();
      actualAnswer = String(targetCat.count * scale);
      
      shortText = `Look at the picture graph. How many ${targetCat.label.toLowerCase()}s are there?`;
      structureText = shortText;
      
      hintStr = `First, count the number of ${symbol} for ${targetCat.label}. Then multiply it by ${scale}.`;
      stepsStr = JSON.stringify([
        `There are ${targetCat.count} ${symbol} for ${targetCat.label}.`,
        `Each ${symbol} stands for ${scale} ${theme.name}.`,
        `${targetCat.count} x ${scale} = ${actualAnswer}.`
      ]);
      
      structureSteps = [
        { label: `Number of ${symbol} for ${targetCat.label}`, expectedAnswer: String(targetCat.count) },
        { label: `Working equation`, expectedAnswer: `${targetCat.count} x ${scale}` },
        { label: `Final answer`, expectedAnswer: actualAnswer }
      ];
      
      if (isMCQ) {
        mcqOptions = [actualAnswer, String(targetCat.count), String(targetCat.count * (scale === 2 ? 3 : 2)), String(targetCat.count + scale)];
      }
    }

  } else if (activeVariant === 'foundation_identify_max_min_value') {
    // Ensure unique max/min by assigning sequential counts and shuffling
    categories[0].count = 2; categories[1].count = 3; categories[2].count = 4; categories[3].count = 5;
    categories.sort(() => 0.5 - Math.random());
    graphData.categories = categories;
    visualEngineStr = buildVisualEngine();
    
    const findMax = Math.random() > 0.5;
    const extremeCat = findMax ? categories.reduce((max, c) => c.count > max.count ? c : max) : categories.reduce((min, c) => c.count < min.count ? c : min);
    const comparisonWord = findMax ? "most" : "least";
    actualAnswer = String(extremeCat.count * scale);
    
    structureText = `Look at the picture graph. Which item has the ${comparisonWord} number? How many of that item are there?`;
    shortText = `Look at the picture graph. How many ${theme.name.toLowerCase()} are there for the item with the ${comparisonWord} number?`;
    
    hintStr = `Look for the row with the ${comparisonWord} symbols. Then multiply that number of symbols by ${scale}.`;
    stepsStr = JSON.stringify([
      `The item with the ${comparisonWord} number of ${symbol} is ${extremeCat.label} with ${extremeCat.count} symbols.`,
      `Each ${symbol} stands for ${scale} ${theme.name}.`,
      `${extremeCat.count} x ${scale} = ${actualAnswer}.`
    ]);
    
    structureSteps = [
      { label: `Item with the ${comparisonWord} number`, expectedAnswer: extremeCat.label },
      { label: `Number of ${symbol} for ${extremeCat.label}`, expectedAnswer: String(extremeCat.count) },
      { label: `Working equation`, expectedAnswer: `${extremeCat.count} x ${scale}` },
      { label: `Final answer`, expectedAnswer: actualAnswer }
    ];
    
    if (isMCQ) {
      mcqOptions = [actualAnswer, String(extremeCat.count), extremeCat.label, String((findMax ? 6 : 1) * scale)];
    }

  } else if (activeVariant === 'foundation_scale_concept_check') {
    graphData.categories = [];
    visualEngineStr = buildVisualEngine();
    
    const thing = theme.name;
    const multiplier = getRandomInt(2, 6);
    const isReverse = Math.random() > 0.5;
    
    if (isReverse) {
      const totalThing = multiplier * scale;
      actualAnswer = String(multiplier);
      
      shortText = `In a picture graph, if 1 ${symbol} stands for ${scale} ${thing}, how many ${symbol} stand for ${totalThing} ${thing}?`;
      structureText = shortText;
      
      hintStr = `To find the number of ${symbol}, divide the total number of ${thing} (${totalThing}) by ${scale}.`;
      stepsStr = JSON.stringify([
        `1 ${symbol} = ${scale} ${thing}.`,
        `We have ${totalThing} ${thing} in total.`,
        `${totalThing} ÷ ${scale} = ${actualAnswer}.`
      ]);
      
      structureSteps = [
        { label: `Working equation`, expectedAnswer: `${totalThing} ÷ ${scale}` },
        { label: `Final answer`, expectedAnswer: actualAnswer }
      ];
      
      if (isMCQ) {
        mcqOptions = [actualAnswer, String(multiplier * scale), String(multiplier + 1), String(Math.max(1, multiplier - 1))];
      }
    } else {
      actualAnswer = String(multiplier * scale);
      
      shortText = `In a picture graph, if 1 ${symbol} stands for ${scale} ${thing}, how many ${thing} do ${multiplier} ${symbol} stand for?`;
      structureText = shortText;
      
      hintStr = `To find the total, multiply the number of ${symbol} by ${scale}.`;
      stepsStr = JSON.stringify([
        `1 ${symbol} = ${scale} ${thing}.`,
        `We have ${multiplier} ${symbol}.`,
        `${multiplier} x ${scale} = ${actualAnswer}.`
      ]);
      
      structureSteps = [
        { label: `Working equation`, expectedAnswer: `${multiplier} x ${scale}` },
        { label: `Final answer`, expectedAnswer: actualAnswer }
      ];
      
      if (isMCQ) {
        mcqOptions = [actualAnswer, String(multiplier + scale), String(multiplier), String(multiplier * (scale === 2 ? 3 : 2))];
      }
    }

  } else if (activeVariant === 'foundation_basic_sum_two_categories') {
    // Pick two random distinct categories
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    const cat1 = shuffled[0];
    const cat2 = shuffled[1];
    
    const isReverse = Math.random() > 0.5;
    
    if (isReverse) {
      const originalCat2Count = cat2.count;
      cat2.count = '?';
      graphData.categories = categories;
      visualEngineStr = buildVisualEngine();
      
      const totalQuantity = (cat1.count + originalCat2Count) * scale;
      actualAnswer = String(originalCat2Count);
      
      shortText = `Look at the picture graph. The total number of ${cat1.label.toLowerCase()}s and ${cat2.label.toLowerCase()}s altogether is ${totalQuantity}. How many ${symbol} should be drawn in the missing row for ${cat2.label}?`;
      structureText = shortText;
      
      const totalSymbols = totalQuantity / scale;
      
      hintStr = `First, find the total number of ${symbol} needed for both items (${totalQuantity} ÷ ${scale}). Then subtract the ${symbol} already drawn for ${cat1.label}.`;
      stepsStr = JSON.stringify([
        `Total quantity is ${totalQuantity}. Each ${symbol} stands for ${scale}.`,
        `Total ${symbol} needed = ${totalQuantity} ÷ ${scale} = ${totalSymbols}.`,
        `There are ${cat1.count} ${symbol} for ${cat1.label}.`,
        `${totalSymbols} - ${cat1.count} = ${actualAnswer} ${symbol} for ${cat2.label}.`
      ]);
      
      structureSteps = [
        { label: `Working equation for total ${symbol} needed`, expectedAnswer: `${totalQuantity} ÷ ${scale}` },
        { label: `Working equation for ${cat2.label}`, expectedAnswer: `${totalSymbols} - ${cat1.count}` },
        { label: `Number of ${symbol} to draw`, expectedAnswer: actualAnswer }
      ];
      
      if (isMCQ) {
        mcqOptions = [actualAnswer, String(totalSymbols), String(originalCat2Count * scale), String(Math.max(1, originalCat2Count - 1))];
      }
    } else {
      visualEngineStr = buildVisualEngine();
      
      const sumSymbols = cat1.count + cat2.count;
      actualAnswer = String(sumSymbols * scale);
      
      shortText = `Look at the picture graph. How many ${cat1.label.toLowerCase()}s and ${cat2.label.toLowerCase()}s are there altogether?`;
      structureText = shortText;
      
      hintStr = `You can count the total number of ${symbol} for both items first, then multiply by ${scale}.`;
      stepsStr = JSON.stringify([
        `There are ${cat1.count} ${symbol} for ${cat1.label} and ${cat2.count} ${symbol} for ${cat2.label}.`,
        `Total ${symbol} = ${cat1.count} + ${cat2.count} = ${sumSymbols}.`,
        `Each ${symbol} stands for ${scale} ${theme.name}.`,
        `${sumSymbols} x ${scale} = ${actualAnswer}.`
      ]);
      
      structureSteps = [
        { label: `Working equation for total ${symbol}`, expectedAnswer: `${cat1.count} + ${cat2.count}` },
        { label: `Working equation for total ${theme.name}`, expectedAnswer: `${sumSymbols} x ${scale}` },
        { label: `Final answer`, expectedAnswer: actualAnswer }
      ];
      
      if (isMCQ) {
        mcqOptions = [actualAnswer, String(cat1.count * scale), String(cat2.count * scale), String((sumSymbols + 1) * scale)];
      }
    }

  } else if (activeVariant === 'foundation_symbol_counting_trap') {
    visualEngineStr = buildVisualEngine();
    const targetCat = getRandomElement(categories);
    actualAnswer = String(targetCat.count); // Trap! Just the drawn symbols
    
    shortText = `Look closely at the picture graph. How many ${symbol} are DRAWN in the row for ${targetCat.label}?`;
    structureText = shortText;
    
    hintStr = `Read the question carefully! Does it ask for the total number of ${theme.name}, or just the number of drawn ${symbol} symbols?`;
    stepsStr = JSON.stringify([
      `The question asks for the number of ${symbol} drawn, NOT the total scaled value.`,
      `Count the ${symbol} next to ${targetCat.label}.`,
      `There are exactly ${actualAnswer} ${symbol} drawn.`
    ]);
    
    structureSteps = [
      { label: `Number of ${symbol} drawn for ${targetCat.label}`, expectedAnswer: actualAnswer }
    ];
    
    if (isMCQ) {
      mcqOptions = [actualAnswer, String(targetCat.count * scale), String(targetCat.count + 1), String(targetCat.count - 1)];
    }
  } else {
    throw new Error(`Variant '${activeVariant}' logic block not implemented in foundation.js.`);
  }

  // Deduplicate and randomize MCQ options
  if (isMCQ) {
    mcqOptions = [...new Set(mcqOptions)];
    while (mcqOptions.length < 4) {
      let randOffset = getRandomInt(-2, 3);
      if (randOffset === 0) randOffset = 2; // avoid 0
      const fakeAns = String(Math.max(1, parseInt(actualAnswer) + randOffset * scale));
      if (!mcqOptions.includes(fakeAns)) mcqOptions.push(fakeAns);
    }
    mcqOptions.sort(() => 0.5 - Math.random());
  }

  const multiStepInputStr = (isStructure && structureSteps.length > 0) ? JSON.stringify({
    inputType: "MULTI_STEP_INPUT",
    steps: structureSteps
  }) : (isMCQ ? `{"inputType": "MCQ_BUTTONS"}` : `{"inputType": "STANDARD_TEXT"}`);

  const defectMap = {};

  const aiPrompt = getFormatInstructions(visualEngineStr, multiStepInputStr) + `
CRITICAL INSTRUCTIONS:
- You are a curriculum generator for a Primary 2 math app.
- Write a short question testing this exact logic: ${activeVariant}
- Use the provided Multi-Step Input schema if requested.
- questionText MUST precisely match: ${getQText(structureText, shortText)}
- finalAnswer MUST precisely match: ${actualAnswer}
- hint MUST precisely match: ${hintStr}
- solutionSteps MUST use the literal escaped newline \\n to separate these strings: ${stepsStr}
- defectMap MUST be empty {}.
`;

  return {
    aiPrompt,
    mcqOptions,
    defectMap,
    actualAnswer
  };
}
