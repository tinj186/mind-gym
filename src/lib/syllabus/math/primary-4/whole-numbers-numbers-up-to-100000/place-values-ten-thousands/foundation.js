export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let finalAnswer = "";
  let options = [];
  let defectMap = {};

  // Normalize/fallback variant
  if (!activeVariant || activeVariant === 'foundation_default' || activeVariant === 'default') {
    const defaultVariants = [
      'foundation_visual',
      'foundation_identify_place',
      'foundation_build_from_parts',
      'foundation_expanded_form_addition',
      'foundation_place_value_representation'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'foundation_visual') {
    const tth = Math.floor(Math.random() * 9) + 1;
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;

    visualEngineStr = `{\n    "componentToRender": "PLACE_VALUE_CHART",\n    "componentData": { "tenThousands": ${tth}, "thousands": ${th}, "hundreds": ${h}, "tens": ${t}, "ones": ${o} }\n  }`;
    finalAnswer = num.toString();
    promptInstruction = `- Question stem: "Look at the place value chart. What number is shown?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (tth * 1000) + (th * 100) + (h * 10) + o; // dropped ten thousands column
      const d2 = num + 1000;
      const d3 = num - 100;
      const set = new Set([finalAnswer, d1.toString(), d2.toString(), d3.toString()]);
      let offset = 20;
      while (set.size < 4) {
        set.add((num + offset).toString());
        offset += 10;
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1.toString()]: "PLACE_VALUE_MISALIGNMENT"
      };
    }
  } else if (activeVariant === 'foundation_identify_place') {
    // Generate distinct digits to prevent ambiguity
    let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 5);
    const [tth, th, h, t, o] = digits;
    const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;

    const places = [
      { name: 'ten thousands', dig: tth },
      { name: 'thousands', dig: th },
      { name: 'hundreds', dig: h },
      { name: 'tens', dig: t },
      { name: 'ones', dig: o }
    ];
    const target = places[Math.floor(Math.random() * places.length)];
    finalAnswer = target.dig.toString();
    promptInstruction = `- Question stem: "In the number ${num}, which digit is in the ${target.name} place?"\\n- The finalAnswer must be just the single digit numeral ${finalAnswer}.`;

    if (isMCQ) {
      const others = digits.filter(d => d !== target.dig).slice(0, 3);
      options = [finalAnswer, ...others.map(String)].sort(() => Math.random() - 0.5);
      defectMap = {
        [others[0]]: "PLACE_VALUE_MISALIGNMENT",
        [others[1]]: "CARELESS_READING"
      };
    }
  } else if (activeVariant === 'foundation_build_from_parts') {
    // Variety:
    // Subtype 0: Double-digit thousands (11 to 35 thousands) requiring regrouping to ten thousands
    // Subtype 1: Double-digit hundreds (12 to 45 hundreds) requiring regrouping to thousands
    // Subtype 2: Double-digit tens (15 to 65 tens) requiring regrouping to hundreds
    // Subtype 3: Double-digit ones (15 to 85 ones) requiring regrouping to tens
    // Subtype 4: Multiple double digits (e.g. thousands and hundreds, or hundreds and tens)
    // Subtype 5: Jumbled / Non-sequential place value order with double digits
    // Subtype 6: Large double-digit thousands representation (e.g. 25 to 80 thousands)

    const subtype = Math.floor(Math.random() * 7);
    let tth = 0;
    let th = 0;
    let h = 0;
    let t = 0;
    let o = 0;
    let shuffleParts = false;

    if (subtype === 0) {
      // Double-digit thousands (11 to 35)
      tth = Math.floor(Math.random() * 5) + 2; // 2 to 6
      th = Math.floor(Math.random() * 25) + 11; // 11 to 35
      h = Math.random() < 0.2 ? 0 : Math.floor(Math.random() * 9) + 1;
      t = Math.random() < 0.2 ? 0 : Math.floor(Math.random() * 9) + 1;
      o = Math.floor(Math.random() * 9) + 1;
    } else if (subtype === 1) {
      // Double-digit hundreds (12 to 45)
      tth = Math.floor(Math.random() * 6) + 2; // 2 to 7
      th = Math.floor(Math.random() * 7); // 0 to 6
      h = Math.floor(Math.random() * 34) + 12; // 12 to 45
      t = Math.random() < 0.2 ? 0 : Math.floor(Math.random() * 9) + 1;
      o = Math.floor(Math.random() * 9) + 1;
    } else if (subtype === 2) {
      // Double-digit tens (15 to 65)
      tth = Math.floor(Math.random() * 7) + 2; // 2 to 8
      th = Math.floor(Math.random() * 8); // 0 to 7
      h = Math.floor(Math.random() * 9) + 1; // 1 to 9
      t = Math.floor(Math.random() * 51) + 15; // 15 to 65
      o = Math.floor(Math.random() * 9) + 1;
    } else if (subtype === 3) {
      // Double-digit ones (15 to 85)
      tth = Math.floor(Math.random() * 7) + 2; // 2 to 8
      th = Math.floor(Math.random() * 8); // 0 to 7
      h = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 9) + 1;
      t = Math.floor(Math.random() * 8) + 1; // 1 to 8
      o = Math.floor(Math.random() * 71) + 15; // 15 to 85
    } else if (subtype === 4) {
      // Multiple double digits (thousands and hundreds, or hundreds and tens)
      tth = Math.floor(Math.random() * 4) + 2; // 2 to 5
      th = Math.floor(Math.random() * 15) + 11; // 11 to 25
      h = Math.floor(Math.random() * 20) + 12; // 12 to 31
      t = Math.floor(Math.random() * 25) + 12; // 12 to 36
      o = Math.floor(Math.random() * 10);
    } else if (subtype === 5) {
      // Jumbled / non-sequential order
      tth = Math.floor(Math.random() * 5) + 2;
      th = Math.random() < 0.5 ? Math.floor(Math.random() * 15) + 11 : Math.floor(Math.random() * 8);
      h = Math.floor(Math.random() * 25) + 12; // 12 to 36
      t = Math.floor(Math.random() * 10);
      o = Math.floor(Math.random() * 9) + 1;
      shuffleParts = true;
    } else {
      // Large double-digit thousands representation (e.g. 25 to 80 thousands)
      tth = 0;
      th = Math.floor(Math.random() * 56) + 25; // 25 to 80
      h = Math.floor(Math.random() * 20) + 12; // 12 to 31
      t = Math.floor(Math.random() * 10);
      o = Math.floor(Math.random() * 9) + 1;
    }

    const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    finalAnswer = num.toString();

    // In Singapore MOE, missing places are naturally omitted from the prompt
    const parts = [];
    if (tth > 0) parts.push({ text: `${tth} ten thousand${tth === 1 ? '' : 's'}`, val: tth * 10000 });
    if (th > 0) parts.push({ text: `${th} thousand${th === 1 ? '' : 's'}`, val: th * 1000 });
    if (h > 0) parts.push({ text: `${h} hundred${h === 1 ? '' : 's'}`, val: h * 100 });
    if (t > 0) parts.push({ text: `${t} ten${t === 1 ? '' : 's'}`, val: t * 10 });
    if (o > 0) parts.push({ text: `${o} one${o === 1 ? '' : 's'}`, val: o });

    if (shuffleParts) {
      parts.sort(() => Math.random() - 0.5);
    }

    const partsText = parts.length > 1
      ? parts.slice(0, -1).map(p => p.text).join(', ') + ', and ' + parts[parts.length - 1].text
      : parts[0].text;

    const stemVariants = [
      `What number is made of ${partsText}?`,
      `What number is represented by ${partsText}?`,
      `Find the number that is made up of ${partsText}.`,
      `What is the number formed by ${partsText}?`
    ];
    const stem = stemVariants[Math.floor(Math.random() * stemVariants.length)];

    const stepBreakdown = parts.map(p => `${p.text} = ${p.val}`).join(', ');

    promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- When writing solutionSteps, calculate each part's value first (${stepBreakdown}), then add them together to obtain ${finalAnswer}.\\n- In the hint, encourage converting each place value part to its number value or regrouping place values.`;

    if (isMCQ) {
      // 1. Dropped regrouping / direct digit misconception
      let d1Num = 0;
      if (th >= 10) {
        d1Num = (tth * 10000) + ((th % 10) * 1000) + (h * 100) + (t * 10) + o;
      } else if (h >= 10) {
        d1Num = (tth * 10000) + (th * 1000) + ((h % 10) * 100) + (t * 10) + o;
      } else if (t >= 10) {
        d1Num = (tth * 10000) + (th * 1000) + (h * 100) + ((t % 10) * 10) + o;
      } else if (o >= 10) {
        d1Num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + (o % 10);
      } else {
        d1Num = num - 1000;
      }

      if (d1Num < 10000 || d1Num >= 100000) {
        d1Num = (num - 10000 > 10000) ? num - 10000 : num + 10000;
      }

      // 2. Off by 1000
      const d2Num = (num + 1000 < 100000) ? num + 1000 : num - 1000;

      // 3. Off by 100
      const d3Num = (num - 100 > 10000) ? num - 100 : num + 100;

      const set = new Set([finalAnswer]);
      if (d1Num > 10000 && d1Num < 100000) set.add(d1Num.toString());
      if (d2Num > 10000 && d2Num < 100000) set.add(d2Num.toString());
      if (d3Num > 10000 && d3Num < 100000) set.add(d3Num.toString());

      let offset = 200;
      while (set.size < 4) {
        const candidate = num + offset;
        if (candidate > 10000 && candidate < 100000) {
          set.add(candidate.toString());
        }
        offset += 100;
      }

      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {};
      if (options.includes(d1Num.toString()) && d1Num.toString() !== finalAnswer) {
        defectMap[d1Num.toString()] = "NO_REGROUPING_OF_PLACE_VALUE";
      }
      if (options.includes(d2Num.toString()) && d2Num.toString() !== finalAnswer) {
        defectMap[d2Num.toString()] = "OFF_BY_THOUSAND";
      }
    }
  } else if (activeVariant === 'foundation_expanded_form_addition') {
    const tth = Math.floor(Math.random() * 9) + 1;
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 9) + 1;
    const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    finalAnswer = num.toString();

    promptInstruction = `- Question stem: "Find the value of ${tth * 10000} + ${th * 1000} + ${h * 100} + ${t * 10} + ${o}."\\n- The finalAnswer must be just the numeral ${finalAnswer}.`;

    if (isMCQ) {
      const d1 = num - 900;
      const d2 = num + 90;
      const d3 = (tth * 1000) + (th * 1000) + (h * 100) + (t * 10) + o;
      const set = new Set([finalAnswer, d1.toString(), d2.toString(), d3.toString()]);
      while (set.size < 4) {
        set.add((num + (Math.floor(Math.random() * 20) - 10) * 100).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [options.find(opt => opt !== finalAnswer)]: "CARELESS_CALCULATION"
      };
    }
  } else {
    // foundation_place_value_representation:
    // Test place value representation and value recognition WITHOUT giving away the answer in the stem.
    // Varieties:
    // Subtype 0: "In the number {num}, the digit {d} stands for ______." -> Value {d * mult}
    // Subtype 1: "How many ten thousands are there in the number {num}?" -> Count {tth}
    // Subtype 2: "In the number {num}, what is the value of the digit in the ten thousands place?" -> Value {tth * 10000}
    // Subtype 3 (MCQ): "In the number {num}, the digit {d} stands for ______." -> Words "{d} {placeName}"

    const first = Math.floor(Math.random() * 8) + 2;
    const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => d !== first).sort(() => Math.random() - 0.5);
    const digits = [first, pool[0], pool[1], pool[2], pool[3]];
    const [tth, th, h, t, o] = digits;
    const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;

    const places = [
      { name: 'ten thousands', dig: tth, mult: 10000 },
      { name: 'thousands', dig: th, mult: 1000 },
      { name: 'hundreds', dig: h, mult: 100 },
      { name: 'tens', dig: t, mult: 10 }
    ].filter(p => p.dig > 0);

    const subtype = isMCQ ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 3);

    if (subtype === 0) {
      // Subtype 0: "In the number {num}, the digit {d} stands for ______." (Value in numerals)
      const target = places[Math.floor(Math.random() * places.length)];
      finalAnswer = (target.dig * target.mult).toString();
      const stem = `In the number ${num}, the digit ${target.dig} stands for ______.`;
      promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- When writing solutionSteps, explain that in ${num}, the digit ${target.dig} is in the ${target.name} place, so its value is ${target.dig} × ${target.mult} = ${finalAnswer}.\\n- In the hint, encourage students to determine the place value column of ${target.dig} to find its total value.`;

      if (isMCQ) {
        const wrong1 = (target.dig * (target.mult === 10000 ? 1000 : target.mult * 10)).toString();
        const wrong2 = (target.dig * (target.mult === 10 ? 100 : target.mult / 10)).toString();
        const wrong3 = target.dig.toString();
        const optSet = new Set([finalAnswer, wrong1, wrong2, wrong3]);
        const fallbacks = ['10000', '1000', '100', '10', '1'];
        for (const f of fallbacks) {
          if (optSet.size >= 4) break;
          optSet.add(f);
        }
        options = Array.from(optSet).sort(() => Math.random() - 0.5);
        defectMap = {};
        if (options.includes(wrong1)) defectMap[wrong1] = "OFF_BY_FACTOR_OF_10";
        if (options.includes(wrong3)) defectMap[wrong3] = "CONFUSED_DIGIT_AND_VALUE";
      }
    } else if (subtype === 1) {
      // Subtype 1: "How many ten thousands are there in the number {num}?" (Count of ten thousands)
      finalAnswer = tth.toString();
      const stem = `How many ten thousands are there in the number ${num}?`;
      promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- When writing solutionSteps, explain that in ${num}, the digit in the ten thousands place is ${tth}, which has a value of ${tth * 10000} (or ${finalAnswer} groups of 10 000).\\n- In the hint, direct attention to the ten thousands column (5th digit from the right).`;

      if (isMCQ) {
        const optSet = new Set([finalAnswer, (tth * 10).toString(), (tth * 100).toString(), (tth * 10000).toString()]);
        const fallbacks = ['10000', '1000', '100', '10'];
        for (const f of fallbacks) {
          if (optSet.size >= 4) break;
          optSet.add(f);
        }
        options = Array.from(optSet).sort(() => Math.random() - 0.5);
        defectMap = {};
        if (options.includes((tth * 10000).toString())) defectMap[(tth * 10000).toString()] = "CONFUSED_DIGIT_AND_VALUE";
        if (options.includes((tth * 10).toString())) defectMap[(tth * 10).toString()] = "PLACE_VALUE_MISALIGNMENT";
      }
    } else if (subtype === 2) {
      // Subtype 2: "In the number {num}, what is the value of the digit in the ten thousands place?"
      finalAnswer = (tth * 10000).toString();
      const stem = `In the number ${num}, what is the value of the digit in the ten thousands place?`;
      promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- When writing solutionSteps, explain that the digit in the ten thousands place is ${tth}, and its value is ${tth} × 10 000 = ${finalAnswer}.\\n- In the hint, suggest identifying the digit in the ten thousands place first, then finding its value.`;

      if (isMCQ) {
        const optSet = new Set([finalAnswer, (th * 1000).toString(), (tth * 1000).toString(), tth.toString()]);
        const fallbacks = [(tth * 100).toString(), (tth * 10).toString(), '10000', '1000'];
        for (const f of fallbacks) {
          if (optSet.size >= 4) break;
          optSet.add(f);
        }
        options = Array.from(optSet).sort(() => Math.random() - 0.5);
        defectMap = {};
        if (options.includes(tth.toString())) defectMap[tth.toString()] = "CONFUSED_DIGIT_AND_VALUE";
        if (options.includes((tth * 1000).toString())) defectMap[(tth * 1000).toString()] = "OFF_BY_FACTOR_OF_10";
      }
    } else {
      // Subtype 3 (MCQ only): "In the number {num}, the digit {d} stands for ______." (Place name in words)
      const target = places[Math.floor(Math.random() * places.length)];
      finalAnswer = `${target.dig} ${target.name}`;
      const stem = `In the number ${num}, the digit ${target.dig} stands for ______.`;
      promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- When writing solutionSteps, explain that in ${num}, ${target.dig} is in the ${target.name} place, so it stands for ${finalAnswer}.\\n- In the hint, suggest checking the place value column of the digit.`;

      const allPlaceNames = ['ten thousands', 'thousands', 'hundreds', 'tens'];
      const otherOptions = allPlaceNames.filter(p => p !== target.name).map(p => `${target.dig} ${p}`);
      options = [finalAnswer, ...otherOptions].sort(() => Math.random() - 0.5);
      defectMap = {
        [otherOptions[0]]: "PLACE_VALUE_MISALIGNMENT",
        [otherOptions[1]]: "PLACE_VALUE_MISALIGNMENT"
      };
    }
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a foundation-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Place Values (Ten Thousands)
Difficulty: ${zodDiff}
Type: ${zodType}

CRITICAL INSTRUCTIONS:
1. ${promptInstruction}
2. The finalAnswer must be strictly "${finalAnswer}".
${mcqInstruction}
3. Provide step-by-step solution steps separated by \\n and an encouraging conceptual hint.
4. Forbid using "STORY:" or any instructional prefix in the output.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return { aiPrompt };
}
