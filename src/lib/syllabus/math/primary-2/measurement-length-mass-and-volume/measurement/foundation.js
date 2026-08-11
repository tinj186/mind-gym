import { getRandomLengthItems, getRandomTheme, getGramItems, getKgItems, getMeasurementAppropriateUnits, getMeasurementEstimationPairs } from '@/lib/utils/variable-bank';

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let visualEngineStr = `{
    "componentToRender": "NONE",
    "componentData": { "hideVisual": true }
  }`;

  let inputRequirementStr = null;
  let systemPrompt = "";

  if (activeVariant === 'foundation_appropriate_unit') {
    if (isStructure) {
      const obj1 = getMeasurementAppropriateUnits();
      let obj2 = getMeasurementAppropriateUnits();
      while (obj1.name === obj2.name) {
        obj2 = getMeasurementAppropriateUnits();
      }

      const structureText = `Match the objects to their correct measurements. Object A: ${obj1.name}. Object B: ${obj2.name}.`;
      const shortText = `Match the objects. A: ${obj1.name}. B: ${obj2.name}.`;

      const askText = getQText(structureText, shortText);
      const answer = "A,B"; // Conceptual final answer
      
      const objs = [obj1, obj2];
      const askOrder = Math.random() > 0.5 ? [0, 1] : [1, 0];
      const ans1 = askOrder[0] === 0 ? 'A' : 'B';
      const ans2 = askOrder[1] === 0 ? 'A' : 'B';

      inputRequirementStr = `[
        {"label": "Which object is about ${objs[askOrder[0]].val} ${objs[askOrder[0]].unit}? (A or B):", "expectedAnswer": "${ans1}", "acceptedAnswers": ["${ans1.toLowerCase()}"]},
        {"label": "Which object is about ${objs[askOrder[1]].val} ${objs[askOrder[1]].unit}? (A or B):", "expectedAnswer": "${ans2}", "acceptedAnswers": ["${ans2.toLowerCase()}"]}
      ]`;
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": ${inputRequirementStr}}`;

      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!
If the questionText has multiple sentences, you may break it into an array of strings for better formatting.

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """Think about whether each object is big/heavy or small/light."""
solutionSteps: """1. Object A (${obj1.name}) is about ${obj1.val} ${obj1.unit}.\\n2. Object B (${obj2.name}) is about ${obj2.val} ${obj2.unit}."""
`;
    } else {
      const obj = getMeasurementAppropriateUnits();

      const structureText = `What is the most appropriate unit for the ${obj.name}? Is it about ${obj.val} ${obj.unit} or ${obj.val} ${obj.wrong}?`;
      const shortText = `The ${obj.name} is about ${obj.val} ___.`;

      const askText = getQText(structureText, shortText);
      const answer = obj.unit;

      if (isMCQ) {
        inputRequirementStr = `null`;
        systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """Think about whether the object is big/heavy or small/light."""
solutionSteps: """1. The ${obj.name} is measured using ${obj.unit}.\\n2. Therefore, it is about ${obj.val} ${obj.unit}."""

Generate options including "${answer}" and "${obj.wrong}".
The defectMap should map the wrong unit to "CONCEPTUAL_ERROR".
`;
      } else {
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """Think about whether the object is big/heavy or small/light."""
solutionSteps: """1. The ${obj.name} is measured using ${obj.unit}.\\n2. Therefore, it is about ${obj.val} ${obj.unit}."""
`;
      }
    }
  }
  else if (activeVariant === 'foundation_reading_ruler') {
    if (isStructure) {
      const items = getRandomLengthItems(2);
      const itemLabel1 = items[0];
      const itemLabel2 = items[1];
      const length1 = Math.floor(Math.random() * 5) + 2; // 2 to 6
      const length2 = Math.floor(Math.random() * 5) + 5; // 5 to 9
      
      visualEngineStr = `{
        "componentToRender": "MULTI_COMPONENT",
        "componentData": {
          "className": "flex-col items-center gap-8",
          "components": [
            {
              "componentToRender": "MEASUREMENT_RULER",
              "componentData": {
                "items": [{ "label": "${itemLabel1}", "length": ${length1}, "startOffset": 0 }],
                "showFullRuler": true
              }
            },
            {
              "componentToRender": "MEASUREMENT_RULER",
              "componentData": {
                "items": [{ "label": "${itemLabel2}", "length": ${length2}, "startOffset": 0 }],
                "showFullRuler": true
              }
            }
          ]
        }
      }`;
      
      const structureText = `Look at the two rulers. Find the length of the ${itemLabel1} and the ${itemLabel2} in cm.`;
      const shortText = `Find the lengths of the ${itemLabel1} and ${itemLabel2}.`;
      
      const askText = getQText(structureText, shortText);
      const answer = `${length1},${length2}`;
      
      inputRequirementStr = `[
        {"label": "Length of ${itemLabel1}:", "expectedAnswer": "${length1} cm", "acceptedAnswers": ["${length1}cm"]},
        {"label": "Length of ${itemLabel2}:", "expectedAnswer": "${length2} cm", "acceptedAnswers": ["${length2}cm"]}
      ]`;
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": ${inputRequirementStr}}`;
      
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} cm"""
hint: """Look at where each object ends on its ruler."""
solutionSteps: """1. The ${itemLabel1} ends at ${length1} cm.\\n2. The ${itemLabel2} ends at ${length2} cm."""
`;
    } else {
      const itemLabel = getRandomLengthItems();
      const length = Math.floor(Math.random() * 8) + 3; // 3 to 10

      visualEngineStr = `{
        "componentToRender": "MEASUREMENT_RULER",
        "componentData": {
          "items": [{ "label": "${itemLabel}", "length": ${length}, "startOffset": 0 }],
          "showFullRuler": true
        }
      }`;

      const structureText = `Look at the ruler. What is the length of the ${itemLabel} in cm?`;
      const shortText = `Find the length of the ${itemLabel} in cm.`;

      const askText = getQText(structureText, shortText);
      const answer = `${length}`;

    if (isMCQ) {
      inputRequirementStr = `null`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} cm"""
hint: """Look at where the ${itemLabel} ends on the ruler. The ruler is in cm."""
solutionSteps: """1. The ${itemLabel} starts at 0.\\n2. It ends at ${length}.\\n3. The length is ${length} cm."""

Generate options around ${length}.
The defectMap should map distractors (like ${length - 1}, ${length + 1}) to "READING_ERROR".
`;
      } else {
        inputRequirementStr = `{"inputType": "MATH_INPUT"}`;
        systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} cm"""
hint: """Look at where the ${itemLabel} ends on the ruler."""
solutionSteps: """1. The ${itemLabel} starts at 0.\\n2. It ends at ${length}.\\n3. The length is ${length} cm."""
`;
      }
    }
  }
  else if (activeVariant === 'foundation_reading_mass_scale') {
    if (isStructure) {
      const items = getGramItems(2);
      const itemLabel1 = items[0].item;
      const itemEmoji1 = items[0].icon;
      const mass1 = (Math.floor(Math.random() * 4) + 1) * 100; // 100 to 400
      
      const itemLabel2 = items[1].item;
      const itemEmoji2 = items[1].icon;
      const mass2 = (Math.floor(Math.random() * 4) + 5) * 100; // 500 to 800
      
      visualEngineStr = `{
        "componentToRender": "MULTI_COMPONENT",
        "componentData": {
          "className": "items-center gap-12",
          "components": [
            {
              "componentToRender": "MASS_SCALE",
              "componentData": {
                "value": ${mass1},
                "maxScale": 1000,
                "unit": "g",
                "intervals": 100,
                "objectEmoji": "${itemEmoji1}"
              }
            },
            {
              "componentToRender": "MASS_SCALE",
              "componentData": {
                "value": ${mass2},
                "maxScale": 1000,
                "unit": "g",
                "intervals": 100,
                "objectEmoji": "${itemEmoji2}"
              }
            }
          ]
        }
      }`;
      
      const structureText = `Look at the two weighing scales. Find the mass of the ${itemLabel1} and the ${itemLabel2} in g.`;
      const shortText = `Find the masses of the ${itemLabel1} and ${itemLabel2}.`;
      
      const askText = getQText(structureText, shortText);
      const answer = `${mass1},${mass2}`;
      
      inputRequirementStr = `[
        {"label": "Mass of ${itemLabel1}:", "expectedAnswer": "${mass1} g", "acceptedAnswers": ["${mass1}g"]},
        {"label": "Mass of ${itemLabel2}:", "expectedAnswer": "${mass2} g", "acceptedAnswers": ["${mass2}g"]}
      ]`;
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": ${inputRequirementStr}}`;
      
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} g"""
hint: """Look at the number the needle is pointing to on each scale."""
solutionSteps: """1. The ${itemLabel1} scale points to ${mass1} g.\\n2. The ${itemLabel2} scale points to ${mass2} g."""
`;
    } else {
      const item = getGramItems(1);
      const itemLabel = item.item;
      const itemEmoji = item.icon;
      const mass = (Math.floor(Math.random() * 8) + 1) * 100; // 100 to 800

      visualEngineStr = `{
      "componentToRender": "MASS_SCALE",
      "componentData": {
        "value": ${mass},
        "maxScale": 1000,
        "unit": "g",
        "intervals": 100,
        "objectEmoji": "${itemEmoji}"
      }
    }`;

    const structureText = `Look at the weighing scale. What is the mass of the ${itemLabel} in g?`;
    const shortText = `Find the mass of the ${itemLabel} in grams.`;

    const askText = getQText(structureText, shortText);
    const answer = `${mass}`;

    if (isMCQ) {
      inputRequirementStr = `null`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} g"""
hint: """Look at the number the needle is pointing to."""
solutionSteps: """1. The needle on the scale points to ${mass}.\\n2. The unit is in grams (g).\\n3. The mass is ${mass} g."""

Generate options around ${mass}.
The defectMap should map distractors (like ${mass - 100}, ${mass + 100}) to "READING_ERROR".
`;
    } else {
      inputRequirementStr = `{"inputType": "MATH_INPUT"}`;
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} g"""
hint: """Look at the number the needle is pointing to."""
solutionSteps: """1. The needle on the scale points to ${mass}.\\n2. The mass is ${mass} g."""
`;
      }
    }
  }
  else if (activeVariant === 'foundation_reading_volume_beaker') {
    const scaleOptions = [
      { max: 5, int: 1, step: 1 },
      { max: 10, int: 1, step: 1 },
      { max: 10, int: 2, step: 2 },
      { max: 20, int: 5, step: 5 },
      { max: 50, int: 10, step: 10 },
      { max: 100, int: 10, step: 10 },
      { max: 100, int: 20, step: 20 }
    ];
    
    if (isStructure) {
      const option1 = scaleOptions[Math.floor(Math.random() * scaleOptions.length)];
      const maxScale1 = option1.max;
      const intervals1 = option1.int;
      const steps1 = (maxScale1 / option1.step) - 1; 
      const randomStep1 = Math.floor(Math.random() * steps1) + 1;
      const vol1 = randomStep1 * option1.step;
      
      const option2 = scaleOptions[Math.floor(Math.random() * scaleOptions.length)];
      const maxScale2 = option2.max;
      const intervals2 = option2.int;
      const steps2 = (maxScale2 / option2.step) - 1; 
      const randomStep2 = Math.floor(Math.random() * steps2) + 1;
      const vol2 = randomStep2 * option2.step;
      
      visualEngineStr = `{
        "componentToRender": "MULTI_COMPONENT",
        "componentData": {
          "className": "items-end gap-12",
          "components": [
            {
              "componentToRender": "VOLUME_BEAKER",
              "componentData": {
                "label": "Beaker A",
                "value": ${vol1},
                "maxScale": ${maxScale1},
                "unit": "l",
                "intervals": ${intervals1}
              }
            },
            {
              "componentToRender": "VOLUME_BEAKER",
              "componentData": {
                "label": "Beaker B",
                "value": ${vol2},
                "maxScale": ${maxScale2},
                "unit": "l",
                "intervals": ${intervals2}
              }
            }
          ]
        }
      }`;
      
      const structureText = `Look at Beaker A and Beaker B. Find the volume of liquid in each beaker in litres.`;
      const shortText = `Find the volumes of liquid in Beaker A and Beaker B.`;
      
      const askText = getQText(structureText, shortText);
      const answer = `${vol1},${vol2}`;
      
      inputRequirementStr = `[
        {"label": "Volume in Beaker A:", "expectedAnswer": "${vol1} l", "acceptedAnswers": ["${vol1}l", "${vol1} L", "${vol1}L"]},
        {"label": "Volume in Beaker B:", "expectedAnswer": "${vol2} l", "acceptedAnswers": ["${vol2}l", "${vol2} L", "${vol2}L"]}
      ]`;
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": ${inputRequirementStr}}`;
      
      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} l"""
hint: """Look at the water level on the markings of each beaker."""
solutionSteps: """1. The water level in Beaker A reaches ${vol1} l.\\n2. The water level in Beaker B reaches ${vol2} l."""
`;
    } else {
      const option = scaleOptions[Math.floor(Math.random() * scaleOptions.length)];
      const maxScale = option.max;
      const intervals = option.int;
      const steps = (maxScale / option.step) - 1; 
      const randomStep = Math.floor(Math.random() * steps) + 1;
      const vol = randomStep * option.step;
      
      visualEngineStr = `{
        "componentToRender": "VOLUME_BEAKER",
        "componentData": {
          "value": ${vol},
          "maxScale": ${maxScale},
          "unit": "l",
          "intervals": ${intervals}
        }
      }`;
      
      const structureText = `Look at the measuring beaker. What is the volume of liquid in the beaker in litres?`;
      const shortText = `Find the volume of the liquid in litres.`;
      
      const askText = getQText(structureText, shortText);
      const answer = `${vol}`;
      
      if (isMCQ) {
        inputRequirementStr = `null`;
        systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} l"""
hint: """Look at the water level on the beaker markings."""
solutionSteps: """1. The water level reaches the number ${vol}.\\n2. The unit is in litres (l).\\n3. The volume is ${vol} l."""

Generate options around ${vol}. Ensure they are multiples of ${option.step}.
The defectMap should map distractors (like ${vol - option.step}, ${vol + option.step}) to "READING_ERROR".
`;
      } else {
        inputRequirementStr = `{"inputType": "MATH_INPUT"}`;
        systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer} l"""
hint: """Look at the water level on the beaker markings."""
solutionSteps: """1. The water level reaches the number ${vol}.\\n2. The volume is ${vol} l."""
`;
      }
    }
  }
  else if (activeVariant === 'foundation_estimate_measurement') {
    if (isStructure) {
      const pair1 = getMeasurementEstimationPairs();
      let pair2 = getMeasurementEstimationPairs();
      while (pair1.name === pair2.name) {
        pair2 = getMeasurementEstimationPairs();
      }

      const structureText = `Match the objects to their correct measurements. Object A: ${pair1.name}. Object B: ${pair2.name}.`;
      const shortText = `Match the objects. A: ${pair1.name}. B: ${pair2.name}.`;

      const askText = getQText(structureText, shortText);
      const answer = "A,B"; // Conceptual final answer

      const pairs = [pair1, pair2];
      const askOrder = Math.random() > 0.5 ? [0, 1] : [1, 0];
      const ans1 = askOrder[0] === 0 ? 'A' : 'B';
      const ans2 = askOrder[1] === 0 ? 'A' : 'B';

      inputRequirementStr = `[
        {"label": "Which object is about ${pairs[askOrder[0]].correct}? (A or B):", "expectedAnswer": "${ans1}", "acceptedAnswers": ["${ans1.toLowerCase()}"]},
        {"label": "Which object is about ${pairs[askOrder[1]].correct}? (A or B):", "expectedAnswer": "${ans2}", "acceptedAnswers": ["${ans2.toLowerCase()}"]}
      ]`;
      inputRequirementStr = `{"inputType": "MULTI_STEP_INPUT", "steps": ${inputRequirementStr}}`;

      systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!
If the questionText has multiple sentences, you may break it into an array of strings for better formatting.

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """Think about how big or heavy each object is in real life."""
solutionSteps: """1. Object A (${pair1.name}) is quite large/small, so ${pair1.correct} is a good estimate.\\n2. Object B (${pair2.name}) is quite large/small, so ${pair2.correct} is a good estimate."""
`;
    } else {
      const pair = getMeasurementEstimationPairs();

      const structureText = `Estimate the ${pair.name}. Is it ${pair.correct} or ${pair.wrong}?`;
      const shortText = `The ${pair.name} is about ${pair.correct} or ${pair.wrong}?`;

      const askText = getQText(structureText, shortText);
      const answer = pair.correct;

      if (isMCQ) {
        inputRequirementStr = `null`;
        systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """Think about how big or heavy the object is in real life."""
solutionSteps: """1. A ${pair.name} is quite large/small.\\n2. Therefore, ${pair.correct} is a better estimate than ${pair.wrong}."""

Generate options including "${pair.correct}" and "${pair.wrong}".
The defectMap should map the wrong estimate to "CONCEPTUAL_ERROR".
`;
      } else {
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        systemPrompt = `
You are generating a Primary 2 Math question.
Topic: ${topic}
Type: ${zodType}
Difficulty: ${zodDiff}

CRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!

Use EXACTLY:
questionText: """${askText}"""
finalAnswer: """${answer}"""
hint: """Think about how big or heavy the object is in real life."""
solutionSteps: """1. A ${pair.name} is quite large/small.\\n2. Therefore, ${pair.correct} is a better estimate than ${pair.wrong}."""
`;
      }
    }
  }

  const aiPrompt = systemPrompt + "\n" + getFormatInstructions(visualEngineStr, inputRequirementStr);
  return { aiPrompt };
};
