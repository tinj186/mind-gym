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
    const tth = Math.floor(Math.random() * 9) + 1;
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    finalAnswer = num.toString();

    promptInstruction = `- Question stem: "What number is made of ${tth} ten thousands, ${th} thousands, ${h} hundreds, ${t} tens, and ${o} ones?"\\n- The finalAnswer must be just the numeral ${finalAnswer}.`;

    if (isMCQ) {
      const d1 = (tth * 1000) + (th * 100) + (h * 10) + o;
      const d2 = (tth * 10000) + (th * 100) + (h * 10) + o;
      const d3 = num + 10;
      const set = new Set([finalAnswer, d1.toString(), d2.toString(), d3.toString()]);
      while (set.size < 4) {
        set.add((num + (Math.floor(Math.random() * 5) + 1) * 100).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1.toString()]: "PLACE_VALUE_MISALIGNMENT"
      };
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
    // foundation_place_value_representation
    const tth = Math.floor(Math.random() * 9) + 1;
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    finalAnswer = tth.toString();

    promptInstruction = `- Question stem: "In the number ${num}, the digit ${tth} is in the ten thousands place. How many ten thousands does it represent?"\\n- The finalAnswer must be just the single digit numeral ${finalAnswer}.`;

    if (isMCQ) {
      options = [finalAnswer, (tth * 10).toString(), (tth * 1000).toString(), (tth * 10000).toString()].sort(() => Math.random() - 0.5);
      defectMap = {
        [(tth * 10000).toString()]: "CONFUSED_DIGIT_AND_VALUE"
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
