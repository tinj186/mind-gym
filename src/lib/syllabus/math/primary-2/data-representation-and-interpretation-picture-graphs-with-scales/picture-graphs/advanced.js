import { getRandomNames, getRandomTheme } from '../../../../../utils/variable-bank';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
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
  
  // Set up categories. For advanced, limit count so multiplication stays within limits
  const categories = theme.items.map(item => ({
    label: item,
    count: getRandomInt(2, 6),
    emoji: symbol
  }));
  
  // Ensure we have unique values for deduction riddles
  categories[0].count = 8;
  categories[1].count = 5;
  categories[2].count = 3;
  categories[3].count = 1;
  categories.sort(() => 0.5 - Math.random());
  
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

  if (activeVariant === 'advanced_missing_category_symbols') {
    // Upgraded variant: "Category A and B combined have X items. A has Y symbols. Find B's missing symbols."
    // We pick A (known) and B (unknown).
    const catA = categories[0];
    const catB = categories[1];
    const originalCatBCount = catB.count;
    catB.count = '?';
    
    visualEngineStr = buildVisualEngine();
    
    const combinedSymbols = catA.count + originalCatBCount;
    const combinedItems = combinedSymbols * scale;
    const catAItems = catA.count * scale;
    
    actualAnswer = String(originalCatBCount);
    
    shortText = `The total number of ${theme.name.toLowerCase()} for ${catA.label} and ${catB.label} combined is ${combinedItems}. How many ${symbol} should be drawn for ${catB.label}?`;
    structureText = `Look at the picture graph. The total number of ${theme.name.toLowerCase()} for ${catA.label} and ${catB.label} combined is ${combinedItems}. How many ${symbol} should be drawn in the missing row for ${catB.label}? Show your working and the final answer.`;
    
    hintStr = `First find the number of ${theme.name.toLowerCase()} for ${catA.label}. Subtract that from the combined total to find ${catB.label}'s ${theme.name.toLowerCase()}. Finally, divide by ${scale}.`;
    
    stepsStr = JSON.stringify([
      `${theme.name.toLowerCase()} for ${catA.label} = ${catA.count} x ${scale} = ${catAItems}.`,
      `${theme.name.toLowerCase()} for ${catB.label} = ${combinedItems} - ${catAItems} = ${originalCatBCount * scale}.`,
      `${originalCatBCount * scale} ÷ ${scale} = ${actualAnswer} ${symbol} for ${catB.label}.`
    ]);
    
    structureSteps = [
      { label: `Working equation for ${theme.name.toLowerCase()} of ${catA.label}`, expectedAnswer: `${catA.count} x ${scale}` },
      { label: `Working equation for missing ${theme.name.toLowerCase()} of ${catB.label}`, expectedAnswer: `${combinedItems} - ${catAItems}` },
      { label: `Working equation for number of ${symbol} to draw`, expectedAnswer: `${originalCatBCount * scale} ÷ ${scale}` },
      { label: `Number of ${symbol} to draw`, expectedAnswer: actualAnswer }
    ];
    
    if (isMCQ) {
      mcqOptions = [actualAnswer, String(originalCatBCount + 1), String(combinedSymbols), String(catA.count)];
    }

  } else if (activeVariant === 'advanced_change_of_scale') {
    const targetCat = getRandomElement(categories);
    const oldScale = scale;
    
    // Pick a new scale that is guaranteed to be different
    const availableNewScales = [2, 3, 4, 5, 10].filter(s => s !== oldScale);
    const newScale = getRandomElement(availableNewScales);
    
    // To ensure clean division without half-symbols, we force targetCat.count
    // so that total items is the Least Common Multiple (LCM) of both scales.
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const lcm = (oldScale * newScale) / gcd(oldScale, newScale);
    
    // Multiply by 1 or 2 to add some randomness, but keep symbols reasonable (max 10)
    let multiplier = 1;
    if (lcm / oldScale < 5) multiplier = getRandomInt(1, 2);
    
    targetCat.count = (lcm / oldScale) * multiplier;
    const totalItems = targetCat.count * oldScale;
    const newSymbols = totalItems / newScale;
    
    visualEngineStr = buildVisualEngine();
    
    actualAnswer = String(newSymbols);
    
    shortText = `If a new graph was drawn where each ${symbol} stands for ${newScale} ${theme.name.toLowerCase()}, how many ${symbol} would be needed for ${targetCat.label}?`;
    structureText = `Look at the picture graph. If a new graph was drawn where each ${symbol} stands for ${newScale} ${theme.name.toLowerCase()}, how many ${symbol} would be needed for ${targetCat.label}? Show your working and the final answer.`;
    
    hintStr = `First find the total number of ${theme.name.toLowerCase()} for ${targetCat.label}. Then divide by the new scale (${newScale}) to find the new number of symbols.`;
    
    stepsStr = JSON.stringify([
      `Total ${theme.name.toLowerCase()} for ${targetCat.label} = ${targetCat.count} x ${oldScale} = ${totalItems}.`,
      `New scale: each ${symbol} stands for ${newScale}.`,
      `${totalItems} ÷ ${newScale} = ${actualAnswer} ${symbol}.`
    ]);
    
    structureSteps = [
      { label: `Working equation for total ${theme.name.toLowerCase()}`, expectedAnswer: `${targetCat.count} x ${oldScale}` },
      { label: `Working equation for symbols needed on new graph`, expectedAnswer: `${totalItems} ÷ ${newScale}` },
      { label: `Final answer`, expectedAnswer: actualAnswer }
    ];
    
    if (isMCQ) {
      mcqOptions = [actualAnswer, String(newSymbols + 1), String(targetCat.count), String(Math.abs(newSymbols - 2))];
    }

  } else if (activeVariant === 'advanced_scale_translation_money') {
    const targetCat = getRandomElement(categories);
    
    // Ensure totalItems <= 12 to keep the final multiplication within P2 limits (max 12x tables)
    const maxCount = Math.floor(12 / scale);
    targetCat.count = getRandomInt(1, Math.max(1, maxCount));
    visualEngineStr = buildVisualEngine();
    
    const totalItems = targetCat.count * scale;
    const price = getRandomInt(2, 5);
    const totalMoney = totalItems * price;
    
    actualAnswer = `$${totalMoney}`;
    
    shortText = `If each ${theme.name.toLowerCase()} costs $${price}, how much money is all the ${theme.name.toLowerCase()} for ${targetCat.label} worth?`;
    structureText = `Look at the picture graph. If each ${theme.name.toLowerCase()} costs $${price}, how much money is all the ${theme.name.toLowerCase()} for ${targetCat.label} worth? Show your working and the final answer.`;
    
    hintStr = `First find the total number of ${theme.name.toLowerCase()} for ${targetCat.label}. Then multiply by $${price}.`;
    
    stepsStr = JSON.stringify([
      `Total ${theme.name.toLowerCase()} for ${targetCat.label} = ${targetCat.count} x ${scale} = ${totalItems}.`,
      `Each ${theme.name.toLowerCase()} costs $${price}.`,
      `${totalItems} x $${price} = $${totalMoney}.`
    ]);
    
    structureSteps = [
      { label: `Working equation for total ${theme.name.toLowerCase()}`, expectedAnswer: `${targetCat.count} x ${scale}` },
      { label: `Working equation for total money`, expectedAnswer: `${totalItems} x ${price}` },
      { label: `Final answer`, expectedAnswer: actualAnswer }
    ];
    
    if (isMCQ) {
      mcqOptions = [actualAnswer, `$${(totalItems + 1) * price}`, `$${totalItems * (price + 1)}`, `$${(targetCat.count + 1) * price}`];
    }

  } else if (activeVariant === 'advanced_half_symbol_interpretation') {
    // Only even scales allow for clean halves
    const evenScales = [2, 4, 10];
    const halfScale = getRandomElement(evenScales);
    const halfValue = halfScale / 2;
    
    // Override the general graph data
    graphData.key = `Each ${symbol} stands for ${halfScale} ${theme.name}`;
    
    const targetCatIndex = getRandomInt(0, categories.length - 1);
    const targetCat = categories[targetCatIndex];
    
    // Set a floating point count for half symbol! e.g., 3.5
    targetCat.count = getRandomInt(2, 5) + 0.5;
    
    visualEngineStr = buildVisualEngine();
    
    const fullSymbols = Math.floor(targetCat.count);
    const totalItems = (fullSymbols * halfScale) + halfValue;
    
    actualAnswer = String(totalItems);
    
    shortText = `What is the exact number of ${theme.name.toLowerCase()} for ${targetCat.label}?`;
    structureText = `Look at the picture graph. Note that a half-symbol is used for ${targetCat.label}. What is the exact number of ${theme.name.toLowerCase()} for ${targetCat.label}? Show your working and the final answer.`;
    
    hintStr = `A full ${symbol} is ${halfScale}, so a half ${symbol} is ${halfValue}. Calculate the full symbols first, then add the half.`;
    
    stepsStr = JSON.stringify([
      `${fullSymbols} full ${symbol} = ${fullSymbols} x ${halfScale} = ${fullSymbols * halfScale}.`,
      `Half ${symbol} = ${halfScale} ÷ 2 = ${halfValue}.`,
      `Total = ${fullSymbols * halfScale} + ${halfValue} = ${totalItems}.`
    ]);
    
    structureSteps = [
      { label: `Working equation for half a ${symbol}`, expectedAnswer: `${halfScale} ÷ 2` },
      { label: `Working equation for total ${theme.name.toLowerCase()}`, expectedAnswer: `${fullSymbols * halfScale} + ${halfValue}` },
      { label: `Final answer`, expectedAnswer: actualAnswer }
    ];
    
    if (isMCQ) {
      mcqOptions = [actualAnswer, String(Math.floor(targetCat.count) * halfScale), String(Math.ceil(targetCat.count) * halfScale), String(totalItems + halfValue)];
    }

  } else if (activeVariant === 'advanced_deduction_riddle') {
    visualEngineStr = buildVisualEngine();
    
    // Pick two random distinct items
    const [me, other] = categories.slice(0, 2);
    
    const diffSymbols = me.count - other.count;
    const isMore = diffSymbols > 0;
    const absDiff = Math.abs(diffSymbols) * scale;
    const comparisonWord = isMore ? 'more' : 'fewer';
    const singularName = theme.name.toLowerCase().replace(/s$/, ''); // e.g. "toys" -> "toy"
    
    actualAnswer = me.label;
    
    shortText = `Read the riddle: "I have ${absDiff} ${comparisonWord} ${theme.name.toLowerCase()} than ${other.label}." Which ${singularName} am I?`;
    structureText = `Look at the picture graph. Read the riddle: "I have ${absDiff} ${comparisonWord} ${theme.name.toLowerCase()} than ${other.label}." Which ${singularName} am I? Show your working and the final answer.`;
    
    hintStr = `First calculate how many ${theme.name.toLowerCase()} ${other.label} has. Then ${isMore ? 'add' : 'subtract'} ${absDiff} to find how many you have. Check which row matches that total!`;
    
    const otherItems = other.count * scale;
    const myItems = me.count * scale;
    
    stepsStr = JSON.stringify([
      `${other.label} has ${other.count} x ${scale} = ${otherItems} ${theme.name.toLowerCase()}.`,
      `I have ${absDiff} ${comparisonWord} than ${other.label}, so I have ${otherItems} ${isMore ? '+' : '-'} ${absDiff} = ${myItems}.`,
      `${myItems} ÷ ${scale} = ${me.count} ${symbol}. ${me.label} has exactly ${me.count} ${symbol}.`
    ]);
    
    structureSteps = [
      { label: `Working equation for ${other.label}'s ${theme.name.toLowerCase()}`, expectedAnswer: `${other.count} x ${scale}` },
      { label: `Working equation for my ${theme.name.toLowerCase()}`, expectedAnswer: `${otherItems} ${isMore ? '+' : '-'} ${absDiff}` },
      { label: `Working equation for my ${symbol}`, expectedAnswer: `${myItems} ÷ ${scale}` },
      { label: `Final answer`, expectedAnswer: actualAnswer }
    ];
    
    if (isMCQ) {
      mcqOptions = categories.map(c => c.label);
    }

  } else {
    throw new Error(`Variant '${activeVariant}' logic block not implemented in advanced.js.`);
  }

  // Defect map for MCQs (stubbed)
  const defectMap = {};

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
