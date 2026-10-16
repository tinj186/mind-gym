import { getRandomBarGraphTheme, getRandomNames, CONTEXT_TIERS } from '../../../../../utils/variable-bank.js';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getFourOptions = (correctVal, candidateDistractors = []) => {
  const set = new Set([String(correctVal)]);
  for (const d of candidateDistractors) {
    if (d !== undefined && d !== null && String(d).trim() !== '' && !set.has(String(d)) && set.size < 4) {
      set.add(String(d));
    }
  }
  let delta = 1;
  const num = Number(correctVal);
  while (set.size < 4) {
    if (!isNaN(num)) {
      const candidate = String(Math.max(1, num + (set.size % 2 === 1 ? delta * 5 : -delta * 5)));
      if (!set.has(candidate)) set.add(candidate);
    } else {
      set.add(`Option ${set.size + 1}`);
    }
    delta++;
  }
  return Array.from(set);
};

const formatCategoryList = (cats) => {
  if (cats.length === 1) return cats[0];
  if (cats.length === 2) return `${cats[0]} and ${cats[1]}`;
  return `${cats.slice(0, -1).join(', ')}, and ${cats[cats.length - 1]}`;
};

const getContextQuery = (theme, cats) => {
  const list = formatCategoryList(cats);
  const u = theme.unit;
  if (theme.id === 'baking_chefs') return `number of cupcakes baked by ${list}`;
  if (theme.id === 'toy_shops') return `number of toys sold by ${list}`;
  if (theme.id === 'primary_classes') return `number of bottles recycled by ${list}`;
  if (theme.id === 'school_houses') return `points scored by ${list}`;
  if (theme.id === 'harvest_fields') return `kilograms of potatoes harvested from ${list}`;
  if (u === 'points') return `points scored in ${list}`;
  if (u === 'pupils') return `number of pupils who chose ${list}`;
  if (u === 'visitors') return `number of visitors on ${list}`;
  if (u === 'newspapers') return `newspapers collected on ${list}`;
  if (u === 'books') return `number of ${list} books borrowed`;
  if (u === 'pies') return `number of ${list} pies sold`;
  if (u === 'notebooks') return `number of ${list} notebooks`;
  if (u === 'flowers') return `number of ${list} sold`;
  return `number of ${list} ${u}`;
};

export const generateFoundation = (variant, type, getFormatInstructions) => {
  const safeType = String(type).toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

  const studentName = getRandomNames(1)[0] || 'Ali';

  // --------------------------------------------------------------------------
  // Variant 1: Direct Value Combination & Missing Bar Deduction
  // --------------------------------------------------------------------------
  if (variant === 'foundation_direct_combination') {
    const scaleOptions = [2, 5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, 2)];
    const theme = getRandomBarGraphTheme(4);

    // Generate values directly on grid lines (multiples of scaleStep)
    const multiplierPool = [2, 3, 4, 5, 6, 7];
    const shuffledMultipliers = multiplierPool.sort(() => 0.5 - Math.random());
    const data = theme.items.slice(0, 4).map((cat, idx) => ({
      category: cat,
      value: shuffledMultipliers[idx] * scaleStep
    }));

    // Randomize category ordering so we don't always pick items 0 and 1
    const shuffledIndices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());

    // Sub-types:
    // 1: Total of 2 categories
    // 2: Total of 3 categories
    // 3: Given grand total of all 4 categories, find the missing bar value
    // 4: Given combined total of 2 categories, find the missing bar value
    const subType = getRandomInt(1, 4);

    // ========================================================================
    // SUB-TYPE 1: Total of 2 categories
    // ========================================================================
    if (subType === 1) {
      const idx1 = shuffledIndices[0];
      const idx2 = shuffledIndices[1];
      const cat1 = data[idx1].category;
      const cat2 = data[idx2].category;
      const val1 = data[idx1].value;
      const val2 = data[idx2].value;
      const sum = val1 + val2;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation: "vertical",
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The scale goes up in steps of ${scaleStep}. Read the bar graph carefully. Find the ${getContextQuery(theme, [cat1, cat2])}, and calculate their total combined amount."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${cat1} shown on the graph:`, expectedAnswer: String(val1), acceptedAnswers: [] },
          { label: `Number of ${theme.unit} for ${cat2} shown on the graph:`, expectedAnswer: String(val2), acceptedAnswers: [] },
          { label: "Write the working equation to find the total:", expectedAnswer: `${val1} + ${val2} = ${sum}`, acceptedAnswers: [`${val2} + ${val1} = ${sum}`, `${val1}+${val2}=${sum}`, `${val2}+${val1}=${sum}`] },
          { label: `Total ${theme.unit}:`, expectedAnswer: String(sum), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(sum);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the bar graph of ${theme.title.toLowerCase()}. What is the total combined ${getContextQuery(theme, [cat1, cat2])}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(sum);
        const opts = getFourOptions(finalAnswer, [String(val1), String(val2), String(sum + scaleStep), String(sum - scaleStep > 0 ? sum - scaleStep : sum + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} with a scale step of ${scaleStep}. What is the total combined ${getContextQuery(theme, [cat1, cat2])}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(sum);
      }

    // ========================================================================
    // SUB-TYPE 2: Total of 3 categories
    // ========================================================================
    } else if (subType === 2) {
      const idx1 = shuffledIndices[0];
      const idx2 = shuffledIndices[1];
      const idx3 = shuffledIndices[2];
      const cat1 = data[idx1].category;
      const cat2 = data[idx2].category;
      const cat3 = data[idx3].category;
      const val1 = data[idx1].value;
      const val2 = data[idx2].value;
      const val3 = data[idx3].value;
      const sum = val1 + val2 + val3;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation: "vertical",
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The scale goes up in steps of ${scaleStep}. Read the bar graph carefully. Find the ${getContextQuery(theme, [cat1, cat2, cat3])}, and calculate their total combined amount."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${cat1} shown on the graph:`, expectedAnswer: String(val1), acceptedAnswers: [] },
          { label: `Number of ${theme.unit} for ${cat2} shown on the graph:`, expectedAnswer: String(val2), acceptedAnswers: [] },
          { label: `Number of ${theme.unit} for ${cat3} shown on the graph:`, expectedAnswer: String(val3), acceptedAnswers: [] },
          { label: "Write the working equation to find the total:", expectedAnswer: `${val1} + ${val2} + ${val3} = ${sum}`, acceptedAnswers: [
            `${val1}+${val2}+${val3}=${sum}`,
            `${val1} + ${val3} + ${val2} = ${sum}`,
            `${val2} + ${val1} + ${val3} = ${sum}`,
            `${val2} + ${val3} + ${val1} = ${sum}`,
            `${val3} + ${val1} + ${val2} = ${sum}`,
            `${val3} + ${val2} + ${val1} = ${sum}`
          ] },
          { label: `Total ${theme.unit}:`, expectedAnswer: String(sum), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(sum);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the bar graph of ${theme.title.toLowerCase()}. What is the total combined ${getContextQuery(theme, [cat1, cat2, cat3])}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(sum);
        const opts = getFourOptions(finalAnswer, [String(val1 + val2), String(sum + scaleStep), String(sum - scaleStep > 0 ? sum - scaleStep : sum + scaleStep * 2), String(val2 + val3)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows ${theme.title.toLowerCase()} with a scale step of ${scaleStep}. How many ${theme.unit} did ${cat1}, ${cat2}, and ${cat3} have altogether?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(sum);
      }

    // ========================================================================
    // SUB-TYPE 3: Given grand total of all 4 categories, find the missing bar value
    // ========================================================================
    } else if (subType === 3) {
      const missingIdx = shuffledIndices[3];
      const missingCat = data[missingIdx].category;
      const missingVal = data[missingIdx].value;

      const c1 = data[shuffledIndices[0]];
      const c2 = data[shuffledIndices[1]];
      const c3 = data[shuffledIndices[2]];

      const sumKnown = c1.value + c2.value + c3.value;
      const grandTotal = sumKnown + missingVal;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation: "vertical",
          showGridLines: true,
          missingBar: missingCat
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The grand total for all 4 categories combined is ${grandTotal} ${theme.unit}. However, the bar for ${missingCat} is missing. Read the graph carefully, find the total of the other three categories, and calculate the missing number of ${theme.unit} for ${missingCat}."`;
        const stepsArr = [
          { label: `Write the working equation to find the total for ${c1.category}, ${c2.category}, and ${c3.category} combined:`, expectedAnswer: `${c1.value} + ${c2.value} + ${c3.value} = ${sumKnown}`, acceptedAnswers: [`${c1.value}+${c2.value}+${c3.value}=${sumKnown}`] },
          { label: `Write the working equation to find the missing ${theme.unit} for ${missingCat} (Grand Total - Known Sum):`, expectedAnswer: `${grandTotal} - ${sumKnown} = ${missingVal}`, acceptedAnswers: [`${grandTotal}-${sumKnown}=${missingVal}`] },
          { label: `Number of ${theme.unit} for ${missingCat}:`, expectedAnswer: String(missingVal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(missingVal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The grand total across all 4 categories is ${grandTotal} ${theme.unit}. Based on the bar graph, how many ${theme.unit} are there in ${missingCat} (the missing bar)?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(missingVal);
        const opts = getFourOptions(finalAnswer, [String(missingVal + scaleStep), String(missingVal - scaleStep > 0 ? missingVal - scaleStep : missingVal + scaleStep * 2), String(grandTotal - c1.value), String(sumKnown)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. The grand total for all 4 categories combined is ${grandTotal} ${theme.unit}. The bar for ${missingCat} is missing. What is the value of ${missingCat}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(missingVal);
      }

    // ========================================================================
    // SUB-TYPE 4: Given combined total of 2 categories, find the missing bar value
    // ========================================================================
    } else {
      const idxKnown = shuffledIndices[0];
      const idxMissing = shuffledIndices[1];

      const knownCat = data[idxKnown].category;
      const knownVal = data[idxKnown].value;
      const missingCat = data[idxMissing].category;
      const missingVal = data[idxMissing].value;

      const pairTotal = knownVal + missingVal;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation: "vertical",
          showGridLines: true,
          missingBar: missingCat
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The bar for ${missingCat} is missing. The combined total for ${knownCat} and ${missingCat} is ${pairTotal} ${theme.unit}. Read the number of ${theme.unit} for ${knownCat} from the graph, and calculate the missing value for ${missingCat}."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${knownCat} shown on the graph:`, expectedAnswer: String(knownVal), acceptedAnswers: [] },
          { label: `Write the working equation to find the missing ${theme.unit} for ${missingCat} (Combined Total - ${knownCat}):`, expectedAnswer: `${pairTotal} - ${knownVal} = ${missingVal}`, acceptedAnswers: [`${pairTotal}-${knownVal}=${missingVal}`] },
          { label: `Number of ${theme.unit} for ${missingCat}:`, expectedAnswer: String(missingVal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(missingVal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The combined total for ${knownCat} and ${missingCat} is ${pairTotal} ${theme.unit}. Based on the bar graph, how many ${theme.unit} are there in ${missingCat} (the missing bar)?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(missingVal);
        const opts = getFourOptions(finalAnswer, [String(knownVal), String(pairTotal), String(missingVal + scaleStep), String(missingVal - scaleStep > 0 ? missingVal - scaleStep : missingVal + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. The bar for ${missingCat} is missing. If ${knownCat} and ${missingCat} have a combined total of ${pairTotal} ${theme.unit}, how many ${theme.unit} belong to ${missingCat}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(missingVal);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 2: Finding the Difference (Highest/Lowest, Ordinal Rankings & Inverse Deductions)
  // --------------------------------------------------------------------------
  } else if (variant === 'foundation_finding_difference') {
    const scaleOptions = [2, 5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, 2)];
    const theme = getRandomBarGraphTheme(4);

    // Generate 4 strictly distinct values so ranking is unambiguous
    const multiplierPool = [2, 3, 4, 6, 7, 8, 9];
    const chosenMultipliers = multiplierPool.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // Assign to categories
    const data = theme.items.slice(0, 4).map((cat, idx) => ({
      category: cat,
      value: chosenMultipliers[idx] * scaleStep
    }));

    // Sorted descending by value: [0] = 1st most, [1] = 2nd most, [2] = 3rd most, [3] = least
    const sorted = [...data].sort((a, b) => b.value - a.value);

    // Sub-types:
    // 1: Ranked Ordinal Comparison (1st vs least, 1st vs 2nd, 2nd vs least, 2nd vs 3rd) -> find c (a - b = c)
    // 2: Specific Named Pair Comparison -> find c (a - b = c)
    // 3: Given b and difference c, find a (b + c = a)
    // 4: Given a and difference c, find b (a - c = b)
    // 5: Reverse Category Deduction -> given base and difference, identify category a
    const subType = getRandomInt(1, 5);

    let orientation = Math.random() > 0.5 ? "horizontal" : "vertical";
    let missingBarName = "";

    // ========================================================================
    // SUB-TYPE 1: Ranked Ordinal Comparisons (1st, 2nd, 3rd, Least)
    // ========================================================================
    if (subType === 1) {
      const rankPairs = [
        {
          idxA: 0, idxB: 3,
          labelA: `the most ${theme.unit}`,
          labelB: `the fewest ${theme.unit}`
        },
        {
          idxA: 0, idxB: 1,
          labelA: `the most ${theme.unit}`,
          labelB: `the 2nd most ${theme.unit}`
        },
        {
          idxA: 1, idxB: 3,
          labelA: `the 2nd most ${theme.unit}`,
          labelB: `the fewest ${theme.unit}`
        },
        {
          idxA: 1, idxB: 2,
          labelA: `the 2nd most ${theme.unit}`,
          labelB: `the 3rd most ${theme.unit}`
        }
      ];

      const pair = rankPairs[getRandomInt(0, rankPairs.length - 1)];
      const itemA = sorted[pair.idxA];
      const itemB = sorted[pair.idxB];
      const diff = itemA.value - itemB.value;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A survey recorded the ${theme.title.toLowerCase()} on the bar graph. Look at the bar graph carefully to find the category with ${pair.labelA} and the category with ${pair.labelB}. Then, calculate the difference between them."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for the category with ${pair.labelA} (${itemA.category}):`, expectedAnswer: String(itemA.value), acceptedAnswers: [] },
          { label: `Number of ${theme.unit} for the category with ${pair.labelB} (${itemB.category}):`, expectedAnswer: String(itemB.value), acceptedAnswers: [] },
          { label: "Write the working equation to find the difference:", expectedAnswer: `${itemA.value} - ${itemB.value} = ${diff}`, acceptedAnswers: [`${itemA.value}-${itemB.value}=${diff}`] },
          { label: "Difference:", expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the bar graph of ${theme.title.toLowerCase()}. What is the difference between the category with ${pair.labelA} (${itemA.category}) and the category with ${pair.labelB} (${itemB.category})?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(itemA.value), String(itemB.value), String(diff + scaleStep), String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. What is the difference between the category with ${pair.labelA} (${itemA.category}) and the category with ${pair.labelB} (${itemB.category})?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    // ========================================================================
    // SUB-TYPE 2: Specific Named Pair Comparison
    // ========================================================================
    } else if (subType === 2) {
      // Pick any two distinct categories
      const indices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
      const c1 = data[indices[0]];
      const c2 = data[indices[1]];
      const itemA = c1.value >= c2.value ? c1 : c2;
      const itemB = c1.value >= c2.value ? c2 : c1;
      const diff = itemA.value - itemB.value;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. Read the graph carefully. How many more ${theme.unit} did ${itemA.category} have than ${itemB.category}?"`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${itemA.category} shown on the graph:`, expectedAnswer: String(itemA.value), acceptedAnswers: [] },
          { label: `Number of ${theme.unit} for ${itemB.category} shown on the graph:`, expectedAnswer: String(itemB.value), acceptedAnswers: [] },
          { label: `Write the working equation to find how many more ${theme.unit} ${itemA.category} has than ${itemB.category}:`, expectedAnswer: `${itemA.value} - ${itemB.value} = ${diff}`, acceptedAnswers: [`${itemA.value}-${itemB.value}=${diff}`] },
          { label: "Difference:", expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many more ${theme.unit} did ${itemA.category} have than ${itemB.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(itemA.value), String(itemB.value), String(diff + scaleStep), String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows ${theme.title.toLowerCase()}. What is the difference between ${itemA.category} and ${itemB.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    // ========================================================================
    // SUB-TYPE 3: Given b and difference c, find a (b + c = a)
    // ========================================================================
    } else if (subType === 3) {
      const indices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
      const c1 = data[indices[0]];
      const c2 = data[indices[1]];
      const itemA = c1.value >= c2.value ? c1 : c2; // larger (a)
      const itemB = c1.value >= c2.value ? c2 : c1; // smaller (b)
      const diff = itemA.value - itemB.value;

      missingBarName = itemA.category;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true,
          missingBar: missingBarName
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The bar for ${itemA.category} is missing. You are told that ${itemA.category} has ${diff} more ${theme.unit} than ${itemB.category}. Read the number of ${theme.unit} for ${itemB.category} from the graph, and calculate the value for ${itemA.category}."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${itemB.category} shown on the graph:`, expectedAnswer: String(itemB.value), acceptedAnswers: [] },
          { label: `Write the working equation to find the value of ${itemA.category} (${itemB.category} + Difference):`, expectedAnswer: `${itemB.value} + ${diff} = ${itemA.value}`, acceptedAnswers: [`${diff} + ${itemB.value} = ${itemA.value}`, `${itemB.value}+${diff}=${itemA.value}`, `${diff}+${itemB.value}=${itemA.value}`] },
          { label: `Number of ${theme.unit} for ${itemA.category}:`, expectedAnswer: String(itemA.value), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(itemA.value);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${itemA.category} is missing. If ${itemA.category} has ${diff} more ${theme.unit} than ${itemB.category}, how many ${theme.unit} does ${itemA.category} have?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(itemA.value);
        const opts = getFourOptions(finalAnswer, [String(itemB.value), String(diff), String(itemA.value + scaleStep), String(itemA.value - scaleStep)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"On the bar graph, the bar for ${itemA.category} is missing. If ${itemA.category} has ${diff} more ${theme.unit} than ${itemB.category}, how many ${theme.unit} are in ${itemA.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(itemA.value);
      }

    // ========================================================================
    // SUB-TYPE 4: Given a and difference c, find b (a - c = b)
    // ========================================================================
    } else if (subType === 4) {
      const indices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
      const c1 = data[indices[0]];
      const c2 = data[indices[1]];
      const itemA = c1.value >= c2.value ? c1 : c2; // larger (a)
      const itemB = c1.value >= c2.value ? c2 : c1; // smaller (b)
      const diff = itemA.value - itemB.value;

      missingBarName = itemB.category;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true,
          missingBar: missingBarName
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The bar for ${itemB.category} is missing. You are told that ${itemB.category} has ${diff} fewer ${theme.unit} than ${itemA.category}. Read the number of ${theme.unit} for ${itemA.category} from the graph, and calculate the value for ${itemB.category}."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${itemA.category} shown on the graph:`, expectedAnswer: String(itemA.value), acceptedAnswers: [] },
          { label: `Write the working equation to find the value of ${itemB.category} (${itemA.category} - Difference):`, expectedAnswer: `${itemA.value} - ${diff} = ${itemB.value}`, acceptedAnswers: [`${itemA.value}-${diff}=${itemB.value}`] },
          { label: `Number of ${theme.unit} for ${itemB.category}:`, expectedAnswer: String(itemB.value), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(itemB.value);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${itemB.category} is missing. If ${itemB.category} has ${diff} fewer ${theme.unit} than ${itemA.category}, how many ${theme.unit} does ${itemB.category} have?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(itemB.value);
        const opts = getFourOptions(finalAnswer, [String(itemA.value), String(diff), String(itemB.value + scaleStep), String(itemB.value - scaleStep > 0 ? itemB.value - scaleStep : itemB.value + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"On the bar graph, the bar for ${itemB.category} is missing. If ${itemB.category} has ${diff} fewer ${theme.unit} than ${itemA.category}, what is the value of ${itemB.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(itemB.value);
      }

    // ========================================================================
    // SUB-TYPE 5: Reverse Category Deduction (Which category is a?)
    // ========================================================================
    } else {
      const indices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
      const c1 = data[indices[0]];
      const c2 = data[indices[1]];
      const itemA = c1.value >= c2.value ? c1 : c2; // target category (a)
      const itemB = c1.value >= c2.value ? c2 : c1; // base category (b)
      const diff = itemA.value - itemB.value;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. ${itemB.category} has ${itemB.value} ${theme.unit}. One category on the graph has exactly ${diff} more ${theme.unit} than ${itemB.category}. Read the graph to calculate this target amount and identify which category it belongs to."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${itemB.category} shown on the graph:`, expectedAnswer: String(itemB.value), acceptedAnswers: [] },
          { label: `Write the working equation to find the target amount (${itemB.category} + ${diff}):`, expectedAnswer: `${itemB.value} + ${diff} = ${itemA.value}`, acceptedAnswers: [`${diff} + ${itemB.value} = ${itemA.value}`, `${itemB.value}+${diff}=${itemA.value}`, `${diff}+${itemB.value}=${itemA.value}`] },
          { label: `Which category has exactly this amount?`, expectedAnswer: itemA.category, acceptedAnswers: [itemA.category.toLowerCase()] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = itemA.category;
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, which category has exactly ${diff} more ${theme.unit} than ${itemB.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = itemA.category;
        const otherCats = data.map(d => d.category).filter(c => c !== itemA.category);
        const opts = [itemA.category, otherCats[0], otherCats[1], otherCats[2]];
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. Which category has exactly ${diff} more ${theme.unit} than ${itemB.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = itemA.category;
      }
    }

  // --------------------------------------------------------------------------
  // Variant 3: Threshold Filtering & Summation
  // --------------------------------------------------------------------------
  } else if (variant === 'foundation_threshold_filtering') {
    const scaleOptions = [2, 5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, 2)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? "vertical" : "horizontal";

    // Condition: 'more_than' vs 'fewer_than'
    const condition = Math.random() > 0.5 ? 'more_than' : 'fewer_than';
    const condPhrase = condition === 'more_than' ? 'more than' : 'fewer than';

    // Pick a threshold appropriate for scaleStep
    let threshold;
    let belowPool = [];
    let abovePool = [];

    if (scaleStep === 2) {
      // Thresholds: 10, 12, 14, 16, 18, 20
      const tOptions = [10, 12, 14, 16, 18, 20];
      threshold = tOptions[getRandomInt(0, tOptions.length - 1)];
      belowPool = [threshold - 8, threshold - 6, threshold - 4, threshold - 2].filter(v => v >= 2);
      abovePool = [threshold + 2, threshold + 4, threshold + 6, threshold + 8];
    } else if (scaleStep === 5) {
      // Thresholds: 20, 25, 30, 35, 40, 45
      const tOptions = [20, 25, 30, 35, 40, 45];
      threshold = tOptions[getRandomInt(0, tOptions.length - 1)];
      belowPool = [threshold - 15, threshold - 10, threshold - 5].filter(v => v >= 5);
      abovePool = [threshold + 5, threshold + 10, threshold + 15, threshold + 20];
    } else {
      // scaleStep === 10: Thresholds: 30, 40, 50, 60, 70
      const tOptions = [30, 40, 50, 60, 70];
      threshold = tOptions[getRandomInt(0, tOptions.length - 1)];
      belowPool = [threshold - 30, threshold - 20, threshold - 10].filter(v => v >= 10);
      abovePool = [threshold + 10, threshold + 20, threshold + 30, threshold + 40];
    }

    // Number of qualifying categories: 2 or 3
    const qualifyingCount = Math.random() > 0.35 ? 2 : 3;
    const nonQualifyingCount = 4 - qualifyingCount;

    // Shuffle pools
    belowPool.sort(() => 0.5 - Math.random());
    abovePool.sort(() => 0.5 - Math.random());

    let pickedQualifying = [];
    let pickedNonQualifying = [];

    if (condition === 'more_than') {
      pickedQualifying = abovePool.slice(0, qualifyingCount);
      pickedNonQualifying = belowPool.slice(0, nonQualifyingCount);
    } else {
      pickedQualifying = belowPool.slice(0, qualifyingCount);
      pickedNonQualifying = abovePool.slice(0, nonQualifyingCount);
    }

    // Combine and shuffle all 4 values to ensure completely randomized graph shapes
    const combinedValues = [...pickedQualifying, ...pickedNonQualifying].sort(() => 0.5 - Math.random());

    const data = theme.items.slice(0, 4).map((cat, idx) => ({
      category: cat,
      value: combinedValues[idx]
    }));

    const qualifying = condition === 'more_than'
      ? data.filter(d => d.value > threshold)
      : data.filter(d => d.value < threshold);

    const qualifyingValues = qualifying.map(q => q.value);
    const sum = qualifyingValues.reduce((a, b) => a + b, 0);

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
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. Look at the graph to identify the categories that have ${condPhrase} ${threshold} ${theme.unit}. Calculate the total combined ${theme.unit} from just those specific categories."`;
      
      let stepsArr = [];
      if (qualifyingCount === 2) {
        const v1 = qualifyingValues[0];
        const v2 = qualifyingValues[1];
        stepsArr = [
          { label: `List the values of the categories with ${condPhrase} ${threshold} ${theme.unit} (separated by a comma):`, expectedAnswer: `${v1}, ${v2}`, acceptedAnswers: [`${v2}, ${v1}`, `${v1},${v2}`, `${v2},${v1}`] },
          { label: "Write the working equation to find their total:", expectedAnswer: `${v1} + ${v2} = ${sum}`, acceptedAnswers: [`${v2} + ${v1} = ${sum}`, `${v1}+${v2}=${sum}`, `${v2}+${v1}=${sum}`] },
          { label: `Total ${theme.unit}:`, expectedAnswer: String(sum), acceptedAnswers: [] }
        ];
      } else {
        const v1 = qualifyingValues[0];
        const v2 = qualifyingValues[1];
        const v3 = qualifyingValues[2];
        stepsArr = [
          { label: `List the values of the categories with ${condPhrase} ${threshold} ${theme.unit} (separated by a comma):`, expectedAnswer: `${v1}, ${v2}, ${v3}`, acceptedAnswers: [
            `${v1}, ${v3}, ${v2}`, `${v2}, ${v1}, ${v3}`, `${v2}, ${v3}, ${v1}`, `${v3}, ${v1}, ${v2}`, `${v3}, ${v2}, ${v1}`,
            `${v1},${v2},${v3}`, `${v1},${v3},${v2}`, `${v2},${v1},${v3}`, `${v2},${v3},${v1}`, `${v3},${v1},${v2}`, `${v3},${v2},${v1}`
          ] },
          { label: "Write the working equation to find their total:", expectedAnswer: `${v1} + ${v2} + ${v3} = ${sum}`, acceptedAnswers: [
            `${v1}+${v2}+${v3}=${sum}`,
            `${v1} + ${v3} + ${v2} = ${sum}`,
            `${v2} + ${v1} + ${v3} = ${sum}`,
            `${v2} + ${v3} + ${v1} = ${sum}`,
            `${v3} + ${v1} + ${v2} = ${sum}`,
            `${v3} + ${v2} + ${v1} = ${sum}`
          ] },
          { label: `Total ${theme.unit}:`, expectedAnswer: String(sum), acceptedAnswers: [] }
        ];
      }

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(sum);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the bar graph of ${theme.title.toLowerCase()}. What is the total combined number of ${theme.unit} for the categories that have ${condPhrase} ${threshold} ${theme.unit}?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(sum);
      const opts = getFourOptions(finalAnswer, [String(qualifyingValues[0]), String(sum + scaleStep), String(sum - scaleStep > 0 ? sum - scaleStep : sum + scaleStep * 2), String(qualifyingValues[1] || sum + scaleStep * 3)]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} with a scale step of ${scaleStep}. What is the total combined ${theme.unit} from all categories that have ${condPhrase} ${threshold} ${theme.unit}?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(sum);
    }

  // --------------------------------------------------------------------------
  // Variant 4: Reverse Reading (Category Deduction)
  // --------------------------------------------------------------------------
  } else if (variant === 'foundation_reverse_category_deduction') {
    const scaleOptions = [2, 5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, 2)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? "vertical" : "horizontal";

    // Sub-types:
    // 1: Forward Multiplier ("twice as many", "double", "3 times as many", "triple", "4 times as many")
    // 2: Reverse Multiplier (Division: Target has M times as many, deduce Base via Target / M)
    // 3: Forward Comparison (Additive: "X more than", "X fewer than")
    // 4: Reverse Comparison (Inverse Additive: Target has X more/fewer, deduce Base via Target - X or Target + X)
    // 5: Forward Fractional ("half as many as": Base / 2)
    // 6: Reverse Fractional ("Target is half as many as Base": Target * 2)
    const subType = getRandomInt(1, 6);

    let valBase, valTarget, catBase, catTarget;
    let distractor1, distractor2;
    let equationStr = "";
    let equationAccepted = [];
    let relationPromptDesc = "";
    let step2Label = "";
    let finalCategoryAnswer = "";
    let questionTextStructured = "";
    let questionTextMCQ = "";
    let questionTextShort = "";

    // Shuffle category indices
    const catIndices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
    const cA = theme.items[catIndices[0]];
    const cB = theme.items[catIndices[1]];
    const cC = theme.items[catIndices[2]];
    const cD = theme.items[catIndices[3]];

    // ========================================================================
    // SUB-TYPE 1: Forward Multiplier ("twice", "double", "3 times", "triple", "4 times")
    // ========================================================================
    if (subType === 1) {
      catBase = cA;
      catTarget = cB;
      finalCategoryAnswer = catTarget;

      const multChoice = getRandomInt(1, 3); // 1: 2x, 2: 3x, 3: 4x
      let multiplier = 2;
      let multPhrase = "";
      let stepCalcPhrase = "";

      if (multChoice === 1) {
        multiplier = 2;
        valBase = getRandomInt(2, 4) * scaleStep;
        valTarget = valBase * multiplier;
        const useDouble = Math.random() > 0.5;
        multPhrase = useDouble ? "double the number of" : "twice as many";
        stepCalcPhrase = useDouble ? "double that amount" : "twice that amount";
      } else if (multChoice === 2) {
        multiplier = 3;
        valBase = getRandomInt(2, 3) * scaleStep;
        valTarget = valBase * multiplier;
        const useTriple = Math.random() > 0.5;
        multPhrase = useTriple ? "triple the number of" : "3 times as many";
        stepCalcPhrase = useTriple ? "triple that amount" : "3 times that amount";
      } else {
        multiplier = 4;
        valBase = getRandomInt(1, 2) * scaleStep;
        valTarget = valBase * multiplier;
        multPhrase = "4 times as many";
        stepCalcPhrase = "4 times that amount";
      }

      equationStr = `${valBase} x ${multiplier} = ${valTarget}`;
      equationAccepted = [
        `${multiplier} x ${valBase} = ${valTarget}`,
        `${valBase}*${multiplier}=${valTarget}`,
        `${multiplier}*${valBase}=${valTarget}`,
        `${valBase}x${multiplier}=${valTarget}`,
        `${multiplier}x${valBase}=${valTarget}`,
        `${valBase} X ${multiplier} = ${valTarget}`,
        `${multiplier} X ${valBase} = ${valTarget}`,
        `${valBase}X${multiplier}=${valTarget}`,
        `${multiplier}X${valBase}=${valTarget}`
      ];

      relationPromptDesc = `one category has exactly ${multPhrase} ${theme.unit} as ${catBase}`;
      step2Label = `Write the working equation to find ${stepCalcPhrase}:`;

      questionTextStructured = `${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. You are told that ${relationPromptDesc}. Read the number of ${theme.unit} for ${catBase} from the graph, calculate that target amount, and verify which category matches this value.`;
      questionTextMCQ = `Based on the bar graph, which category has exactly ${multPhrase} ${theme.unit} as ${catBase}?`;
      questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. Which category has exactly ${multPhrase} ${theme.unit} as ${catBase}?`;

    // ========================================================================
    // SUB-TYPE 2: Reverse Multiplier (Division: Target has M times, deduce Base)
    // ========================================================================
    } else if (subType === 2) {
      catTarget = cA; // Known on graph
      catBase = cB;   // Unknown to deduce
      finalCategoryAnswer = catBase;

      const multChoice = getRandomInt(1, 3); // 1: 2x, 2: 3x, 3: 4x
      let multiplier = 2;
      let multPhrase = "";

      if (multChoice === 1) {
        multiplier = 2;
        valBase = getRandomInt(2, 4) * scaleStep;
        valTarget = valBase * multiplier;
        multPhrase = Math.random() > 0.5 ? "twice as many" : "double the number of";
      } else if (multChoice === 2) {
        multiplier = 3;
        valBase = getRandomInt(2, 3) * scaleStep;
        valTarget = valBase * multiplier;
        multPhrase = Math.random() > 0.5 ? "3 times as many" : "triple the number of";
      } else {
        multiplier = 4;
        valBase = getRandomInt(1, 2) * scaleStep;
        valTarget = valBase * multiplier;
        multPhrase = "4 times as many";
      }

      equationStr = `${valTarget} / ${multiplier} = ${valBase}`;
      equationAccepted = [
        `${valTarget} ÷ ${multiplier} = ${valBase}`,
        `${valTarget}/${multiplier}=${valBase}`,
        `${valTarget}÷${multiplier}=${valBase}`
      ];

      relationPromptDesc = `${catTarget} has exactly ${multPhrase} ${theme.unit} as another category`;
      step2Label = `Write the working equation to find the value of that category (${valTarget} ÷ ${multiplier}):`;

      questionTextStructured = `${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. You are told that ${relationPromptDesc}. Read the number of ${theme.unit} for ${catTarget} from the graph, calculate the amount for the other category, and verify which category it is.`;
      questionTextMCQ = `Based on the bar graph, ${catTarget} has exactly ${multPhrase} ${theme.unit} as which category?`;
      questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. ${catTarget} has exactly ${multPhrase} ${theme.unit} as another category. Which category is it?`;

    // ========================================================================
    // SUB-TYPE 3: Forward Comparison (Additive: "X more than" or "X fewer than")
    // ========================================================================
    } else if (subType === 3) {
      catBase = cA;
      catTarget = cB;
      finalCategoryAnswer = catTarget;

      const isMore = Math.random() > 0.5;
      const diff = getRandomInt(2, 4) * scaleStep;

      if (isMore) {
        valBase = getRandomInt(2, 5) * scaleStep;
        valTarget = valBase + diff;
        equationStr = `${valBase} + ${diff} = ${valTarget}`;
        equationAccepted = [
          `${diff} + ${valBase} = ${valTarget}`,
          `${valBase}+${diff}=${valTarget}`,
          `${diff}+${valBase}=${valTarget}`
        ];
        relationPromptDesc = `one category has exactly ${diff} more ${theme.unit} than ${catBase}`;
        step2Label = `Write the working equation to find ${diff} more than ${catBase}:`;
        questionTextMCQ = `Based on the bar graph, which category has exactly ${diff} more ${theme.unit} than ${catBase}?`;
        questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. Which category has exactly ${diff} more ${theme.unit} than ${catBase}?`;
      } else {
        valBase = getRandomInt(5, 8) * scaleStep;
        valTarget = valBase - diff;
        equationStr = `${valBase} - ${diff} = ${valTarget}`;
        equationAccepted = [`${valBase}-${diff}=${valTarget}`];
        relationPromptDesc = `one category has exactly ${diff} fewer ${theme.unit} than ${catBase}`;
        step2Label = `Write the working equation to find ${diff} fewer than ${catBase}:`;
        questionTextMCQ = `Based on the bar graph, which category has exactly ${diff} fewer ${theme.unit} than ${catBase}?`;
        questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. Which category has exactly ${diff} fewer ${theme.unit} than ${catBase}?`;
      }

      questionTextStructured = `${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. You are told that ${relationPromptDesc}. Read the number of ${theme.unit} for ${catBase} from the graph, calculate that target amount, and verify which category matches this value.`;

    // ========================================================================
    // SUB-TYPE 4: Reverse Comparison (Inverse Working: Target has X more/fewer, deduce Base)
    // ========================================================================
    } else if (subType === 4) {
      catTarget = cA; // Known on graph
      catBase = cB;   // Unknown to deduce
      finalCategoryAnswer = catBase;

      const isMore = Math.random() > 0.5;
      const diff = getRandomInt(2, 4) * scaleStep;

      if (isMore) {
        // catTarget has diff MORE than catBase => catBase = valTarget - diff
        valBase = getRandomInt(2, 5) * scaleStep;
        valTarget = valBase + diff;
        equationStr = `${valTarget} - ${diff} = ${valBase}`;
        equationAccepted = [`${valTarget}-${diff}=${valBase}`];
        relationPromptDesc = `${catTarget} has exactly ${diff} more ${theme.unit} than another category`;
        step2Label = `Write the working equation to find the value of that category (${valTarget} - ${diff}):`;
        questionTextMCQ = `Based on the bar graph, ${catTarget} has exactly ${diff} more ${theme.unit} than which category?`;
        questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. ${catTarget} has exactly ${diff} more ${theme.unit} than another category. Which category is it?`;
      } else {
        // catTarget has diff FEWER than catBase => catBase = valTarget + diff
        valBase = getRandomInt(5, 8) * scaleStep;
        valTarget = valBase - diff;
        equationStr = `${valTarget} + ${diff} = ${valBase}`;
        equationAccepted = [
          `${diff} + ${valTarget} = ${valBase}`,
          `${valTarget}+${diff}=${valBase}`,
          `${diff}+${valTarget}=${valBase}`
        ];
        relationPromptDesc = `${catTarget} has exactly ${diff} fewer ${theme.unit} than another category`;
        step2Label = `Write the working equation to find the value of that category (${valTarget} + ${diff}):`;
        questionTextMCQ = `Based on the bar graph, ${catTarget} has exactly ${diff} fewer ${theme.unit} than which category?`;
        questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. ${catTarget} has exactly ${diff} fewer ${theme.unit} than another category. Which category is it?`;
      }

      questionTextStructured = `${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. You are told that ${relationPromptDesc}. Read the number of ${theme.unit} for ${catTarget} from the graph, calculate the amount for the other category, and verify which category it is.`;

    // ========================================================================
    // SUB-TYPE 5: Forward Fractional ("half as many as": valBase / 2)
    // ========================================================================
    } else if (subType === 5) {
      catBase = cA;
      catTarget = cB;
      finalCategoryAnswer = catTarget;

      valBase = getRandomInt(2, 4) * 2 * scaleStep; // even multiple so half is an integer multiple of scaleStep
      valTarget = valBase / 2;

      equationStr = `${valBase} / 2 = ${valTarget}`;
      equationAccepted = [
        `${valBase} ÷ 2 = ${valTarget}`,
        `${valBase}/2=${valTarget}`,
        `${valBase}÷2=${valTarget}`
      ];

      relationPromptDesc = `one category has exactly half as many ${theme.unit} as ${catBase}`;
      step2Label = `Write the working equation to find half that amount:`;

      questionTextStructured = `${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. You are told that ${relationPromptDesc}. Read the number of ${theme.unit} for ${catBase} from the graph, calculate half that amount, and verify which category matches this value.`;
      questionTextMCQ = `Based on the bar graph, which category has exactly half as many ${theme.unit} as ${catBase}?`;
      questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. Which category has exactly half as many ${theme.unit} as ${catBase}?`;

    // ========================================================================
    // SUB-TYPE 6: Reverse Fractional ("Target is half as many as Base": Target * 2)
    // ========================================================================
    } else {
      catTarget = cA; // Known on graph
      catBase = cB;   // Unknown to deduce
      finalCategoryAnswer = catBase;

      valTarget = getRandomInt(2, 4) * scaleStep;
      valBase = valTarget * 2;

      equationStr = `${valTarget} x 2 = ${valBase}`;
      equationAccepted = [
        `2 x ${valTarget} = ${valBase}`,
        `${valTarget}*2=${valBase}`,
        `2*${valTarget}=${valBase}`,
        `${valTarget}x2=${valBase}`,
        `2x${valTarget}=${valBase}`,
        `${valTarget} X 2 = ${valBase}`,
        `2 X ${valTarget} = ${valBase}`,
        `${valTarget}X2=${valBase}`,
        `2X${valTarget}=${valBase}`
      ];

      relationPromptDesc = `${catTarget} has exactly half as many ${theme.unit} as another category`;
      step2Label = `Write the working equation to find the value of that category (${valTarget} x 2):`;

      questionTextStructured = `${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. You are told that ${relationPromptDesc}. Read the number of ${theme.unit} for ${catTarget} from the graph, calculate the amount for the other category, and verify which category it is.`;
      questionTextMCQ = `Based on the bar graph, ${catTarget} has exactly half as many ${theme.unit} as which category?`;
      questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. ${catTarget} has exactly half as many ${theme.unit} as another category. Which category is it?`;
    }

    // Generate guaranteed unique, strictly positive distractors aligned to scaleStep
    const usedVals = new Set([valBase, valTarget]);
    const candidateDistractors = [
      valBase + scaleStep,
      valBase - scaleStep,
      valTarget + scaleStep,
      valTarget - scaleStep,
      valBase + scaleStep * 2,
      valTarget + scaleStep * 2,
      valBase + scaleStep * 3,
      valTarget + scaleStep * 3,
      scaleStep * 2,
      scaleStep * 3,
      scaleStep * 4,
      scaleStep * 5,
      scaleStep * 6,
      scaleStep * 7,
      scaleStep * 8
    ].filter(v => v > 0 && !usedVals.has(v));

    distractor1 = candidateDistractors[0];
    usedVals.add(distractor1);
    const remainingCandidates = candidateDistractors.filter(v => !usedVals.has(v));
    distractor2 = remainingCandidates[0];

    // Build categories data mapping with completely randomized bar positions
    const itemsWithValues = [
      { category: catBase, value: valBase },
      { category: catTarget, value: valTarget },
      { category: cC, value: distractor1 },
      { category: cD, value: distractor2 }
    ];
    // Shuffle the items array to randomize bar positions on the chart
    const data = itemsWithValues.sort(() => 0.5 - Math.random());

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
      const knownCategory = (subType === 1 || subType === 3 || subType === 5) ? catBase : catTarget;
      const knownValue = (subType === 1 || subType === 3 || subType === 5) ? valBase : valTarget;

      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${questionTextStructured}"`;
      const stepsArr = [
        { label: `Number of ${theme.unit} for ${knownCategory} shown on the graph:`, expectedAnswer: String(knownValue), acceptedAnswers: [] },
        { label: step2Label, expectedAnswer: equationStr, acceptedAnswers: equationAccepted },
        { label: `Which category has exactly this amount?`, expectedAnswer: finalCategoryAnswer, acceptedAnswers: [finalCategoryAnswer.toLowerCase(), finalCategoryAnswer.toUpperCase()] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = finalCategoryAnswer;
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${questionTextMCQ}"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = finalCategoryAnswer;
      const otherCategories = theme.items.slice(0, 4).filter(c => c !== finalCategoryAnswer);
      const opts = [finalCategoryAnswer, otherCategories[0], otherCategories[1], otherCategories[2]];
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${questionTextShort}"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = finalCategoryAnswer;
    }

  // --------------------------------------------------------------------------
  // Variant 5: The Remainder Calculation & Inventory Adjustments
  // --------------------------------------------------------------------------
  } else if (variant === 'foundation_remainder_calculation') {
    const scaleOptions = [2, 5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, 2)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? "vertical" : "horizontal";

    // 4 clean values for the categories
    const multiplierPool = [3, 4, 5, 6, 7, 8, 9].sort(() => 0.5 - Math.random());
    const data = theme.items.slice(0, 4).map((cat, idx) => ({
      category: cat,
      value: multiplierPool[idx] * scaleStep
    }));

    // Randomly pick which category is being adjusted
    const targetIdx = getRandomInt(0, 3);
    const chosenCat = data[targetIdx].category;
    const startingVal = data[targetIdx].value;

    // Sub-types:
    // 1: Remainder after deduction (Starting - Deducted = Remainder)
    // 2: Increase after addition (Starting + Added = New Total)
    // 3: Finding how many were deducted given remaining amount (Starting - Remaining = Deducted)
    const subType = getRandomInt(1, 3);

    // ========================================================================
    // SUB-TYPE 1: Remainder after deduction
    // ========================================================================
    if (subType === 1) {
      const deducted = getRandomInt(1, Math.max(1, Math.floor(startingVal / scaleStep) - 1)) * scaleStep;
      const remainder = startingVal - deducted;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. During the day, exactly ${deducted} ${theme.unit} of ${chosenCat} were used or sold. Read the starting amount of ${chosenCat} from the bar graph, and calculate how many ${theme.unit} of ${chosenCat} are left."`;
        const stepsArr = [
          { label: `Starting number of ${theme.unit} for ${chosenCat} shown on the graph:`, expectedAnswer: String(startingVal), acceptedAnswers: [] },
          { label: `Write the working equation to find the remaining amount:`, expectedAnswer: `${startingVal} - ${deducted} = ${remainder}`, acceptedAnswers: [`${startingVal}-${deducted}=${remainder}`] },
          { label: `Remaining ${theme.unit}:`, expectedAnswer: String(remainder), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(remainder);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, there were originally ${startingVal} ${theme.unit} of ${chosenCat}. If ${deducted} were used or sold, how many are left?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(remainder);
        const opts = getFourOptions(finalAnswer, [String(startingVal), String(deducted), String(remainder + scaleStep), String(remainder - scaleStep > 0 ? remainder - scaleStep : remainder + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. If ${deducted} ${theme.unit} of ${chosenCat} were sold or removed from the starting amount, how many ${theme.unit} remain?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(remainder);
      }

    // ========================================================================
    // SUB-TYPE 2: Addition to Inventory / Group (Starting + Added = Total)
    // ========================================================================
    } else if (subType === 2) {
      const added = getRandomInt(1, 3) * scaleStep;
      const newTotal = startingVal + added;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. Later, an additional ${added} ${theme.unit} of ${chosenCat} were added. Read the original number from the bar graph, and calculate the new total number of ${theme.unit} of ${chosenCat}."`;
        const stepsArr = [
          { label: `Starting number of ${theme.unit} for ${chosenCat} shown on the graph:`, expectedAnswer: String(startingVal), acceptedAnswers: [] },
          { label: `Write the working equation to find the new total:`, expectedAnswer: `${startingVal} + ${added} = ${newTotal}`, acceptedAnswers: [`${added} + ${startingVal} = ${newTotal}`, `${startingVal}+${added}=${newTotal}`, `${added}+${startingVal}=${newTotal}`] },
          { label: `New total ${theme.unit}:`, expectedAnswer: String(newTotal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(newTotal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, there were ${startingVal} ${theme.unit} of ${chosenCat}. If an additional ${added} were received, what is the new total?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(newTotal);
        const opts = getFourOptions(finalAnswer, [String(startingVal), String(newTotal - scaleStep), String(newTotal + scaleStep), String(startingVal - added)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows ${theme.title.toLowerCase()}. If ${added} more ${theme.unit} of ${chosenCat} are added to the starting amount, what is the new total?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(newTotal);
      }

    // ========================================================================
    // SUB-TYPE 3: Finding deduction amount (Starting - Remaining = Deducted)
    // ========================================================================
    } else {
      const remaining = getRandomInt(1, Math.max(1, Math.floor(startingVal / scaleStep) - 1)) * scaleStep;
      const deducted = startingVal - remaining;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the starting ${theme.title.toLowerCase()} on the bar graph. At the end of the day, exactly ${remaining} ${theme.unit} of ${chosenCat} were left. Read the starting amount from the graph, and calculate how many ${theme.unit} were sold or removed."`;
        const stepsArr = [
          { label: `Starting number of ${theme.unit} for ${chosenCat} shown on the graph:`, expectedAnswer: String(startingVal), acceptedAnswers: [] },
          { label: `Write the working equation to find the amount sold or removed:`, expectedAnswer: `${startingVal} - ${remaining} = ${deducted}`, acceptedAnswers: [`${startingVal}-${remaining}=${deducted}`] },
          { label: `Number of ${theme.unit} sold or removed:`, expectedAnswer: String(deducted), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(deducted);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the starting amount of ${chosenCat}. If ${remaining} are left at the end of the day, how many were sold or used?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(deducted);
        const opts = getFourOptions(finalAnswer, [String(startingVal), String(remaining), String(deducted + scaleStep), String(deducted - scaleStep > 0 ? deducted - scaleStep : deducted + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. If only ${remaining} ${theme.unit} of ${chosenCat} are left at the end of the day, how many were sold or used?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(deducted);
      }
    }
  }

  const aiPrompt = `CRITICAL INSTRUCTIONS:
1. You MUST use the exact "questionText" provided below.
2. You MUST use the exact "finalAnswer" provided below.
3. Generate detailed, pedagogical "solutionSteps" explaining the reading of the bar graph and calculation.
${mcqOptionsPrompt}

${getFormatInstructions(visualEngineStr, inputRequirementStr, askText, finalAnswer)}`;

  return { aiPrompt };
};
