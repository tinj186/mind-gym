/**
 * Advanced Tier: Multi-step Problems & Predictions.
 * PATH: src/lib/syllabus/math/primary-1/data-representation/picture-graphs/advanced.js
 */
export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Picture Graphs', type: zodType, difficulty: zodDiff, strand: 'Data Representation', subject: 'Math', gradeLevel: 'P1' };
  const inputType = 'MCQ_BUTTONS';
  let componentData = null;
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender: "PICTURE_GRAPH_DISPLAY" }, inputRequirement: { inputType } };
  let seedInstructions = "";

  // Procedural Pools
  const themes = [
    { name: "fruits", items: ["Apple", "Banana", "Orange", "Grape", "Mango"], emojis: ["🍎", "🍌", "🍊", "🍇", "🥭"] },
    { name: "toys", items: ["Car", "Doll", "Ball", "Robot", "Train"], emojis: ["🚗", "🧸", "⚽", "🤖", "🚂"] },
    { name: "pets", items: ["Dog", "Cat", "Fish", "Bird", "Hamster"], emojis: ["🐶", "🐱", "🐠", "🐦", "🐹"] },
  ];

  // Generation Helpers
  const getRandom = (arr, count) => [...arr].sort(() => Math.random() - 0.5).slice(0, count);
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const getShuffledOptions = (correct, distractors) => [correct, ...distractors].sort(() => Math.random() - 0.5);

  const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
  const pairedItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
  
  // Fix: Destructure global categories for use across all switch cases
  const [cat1, cat2, cat3] = getRandom(pairedItems, 3);
  const currentOrientation = Math.random() > 0.5 ? "HORIZONTAL" : "VERTICAL";

  switch (activeVariant) {
    case 'advanced_multi_step_problem': {
      commonMeta.heuristic = 'Multi-step Analysis';

      const count1 = Math.floor(Math.random() * 3) + 3; // 3 to 5
      const count2 = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const count3 = Math.floor(Math.random() * 3) + 1; // 1 to 3

      const total = count1 + count2 + count3;
      const difference = Math.abs(count1 - count2);

      componentData = {
        title: `Our ${capitalize(selectedTheme.name)} Chart`,
        symbol: cat1.emoji,
        orientation: currentOrientation,
        categories: [
          { label: cat1.label, emoji: cat1.emoji, count: count1 },
          { label: cat2.label, emoji: cat2.emoji, count: count2 },
          { label: cat3.label, emoji: cat3.emoji, count: count3 }
        ],
        key: "Each picture = 1 item"
      };

      const questionChoice = Math.random();
      let questionText, finalAnswer, hint, solutionSteps;

      if (questionChoice < 0.33) {
        questionText = `How many ${selectedTheme.name} are there in total in this graph?`;
        finalAnswer = String(total);
        hint = "Add up the counts for all the categories.";
        solutionSteps = `Total = ${count1} (${cat1.label}) + ${count2} (${cat2.label}) + ${count3} (${cat3.label}) = ${total}.`;
      } else if (questionChoice < 0.66) {
        questionText = `How many more ${cat1.label} are there than ${cat2.label}?`;
        finalAnswer = String(difference);
        hint = `Subtract the smaller count from the larger count between ${cat1.label} and ${cat2.label}.`;
        solutionSteps = `Difference = ${Math.max(count1, count2)} - ${Math.min(count1, count2)} = ${difference}.`;
      } else {
        questionText = `If 2 more ${cat1.label} were added, what would be the new total for ${cat1.label}?`;
        finalAnswer = String(count1 + 2);
        hint = `Add 2 to the current count of ${cat1.label}.`;
        solutionSteps = `Current ${cat1.label} count is ${count1}. New count = ${count1} + 2 = ${count1 + 2}.`;
      }

      if (isShort || isStructure) {
        promptObject.inputRequirement.inputType = 'STANDARD_TEXT';
        promptObject.content = { questionText, finalAnswer, options: [], hint, solutionSteps };
      } else {
        promptObject.content = { questionText, finalAnswer, options: getShuffledOptions(finalAnswer, [String(total), String(difference), String(count1 + count2 + 1), String(parseInt(finalAnswer) + 5), "0"]), hint, solutionSteps };
      }
      seedInstructions = `Multi-step problem on picture graph.`;
      break;
    }

    case 'advanced_predict_next_category': {
      commonMeta.heuristic = 'Pattern Prediction';

      const patternType = Math.random();
      let counts;
      let nextCount;
      let patternDescription;

      if (patternType < 0.5) { // Increasing by 1
        counts = [2, 3, 4];
        nextCount = 5;
        patternDescription = "increasing by 1 each time";
      } else { // Increasing by 2
        counts = [2, 4, 6];
        nextCount = 8;
        patternDescription = "increasing by 2 each time";
      }

      componentData = {
        title: "Daily Collection Log",
        symbol: cat1.emoji,
        orientation: "HORIZONTAL",
        categories: [
          { label: `${cat1.label} (Day 1)`, emoji: cat1.emoji, count: counts[0] },
          { label: `${cat1.label} (Day 2)`, emoji: cat1.emoji, count: counts[1] },
          { label: `${cat1.label} (Day 3)`, emoji: cat1.emoji, count: counts[2] },
          { label: "Next", emoji: "❓", count: 0 } // Placeholder for next item
        ],
        key: "Each picture = 1 item"
      };

      promptObject.content = {
        questionText: `If the pattern continues, how many items will the next category have?`,
        finalAnswer: String(nextCount),
        options: getShuffledOptions(String(nextCount), [String(nextCount + 1), String(nextCount - 1), String(counts[0])]),
        hint: `Look at how the number of items changes from one category to the next.`,
        solutionSteps: `The number of items is ${patternDescription}. So, the next category will have ${nextCount} items.`
      };
      seedInstructions = `Predict next count in a picture graph pattern.`;
      break;
    }

case 'advanced_create_graph_from_data': {
      commonMeta.heuristic = 'Data-to-Graph Alignment';
      
      const count1 = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const count2 = Math.floor(Math.random() * 4) + 2;
      const count3 = Math.floor(Math.random() * 4) + 2;

      // Build data structures using the direct item string names
      componentData = {
        type: "PICTURE_GRAPH_DISPLAY",
        title: `Count of ${capitalize(selectedTheme.name)}`,
        symbol: cat1.emoji,
        orientation: "HORIZONTAL",
        categories: [
          { label: cat1.label, emoji: cat1.emoji, count: count1 },
          { label: cat2.label, emoji: cat2.emoji, count: count2 },
          { label: cat3.label, emoji: cat3.emoji, count: count3 }
        ],
        key: "Each picture = 1 item"
      };

      // 🧭 BRANCHING FOR MCQ VS SHORT ANSWER / STRUCTURED
      if (isShort || isStructure) {
        promptObject.inputRequirement.inputType = 'STANDARD_TEXT';
        
        promptObject.content = {
          questionText: `Look at the picture graph. How many ${cat1.label.toLowerCase()} are shown in its row?`,
          finalAnswer: String(count1),
          options: [], // Clear out selection values for Short Answers
          hint: `Find the row labeled ${cat1.label} and count how many symbols are drawn next to it.`,
          solutionSteps: `Looking closely at the graph rows, the category line for ${cat1.label} contains exactly ${count1} symbols. Therefore, the answer is ${count1}.`
        };
      } else {
        promptObject.inputRequirement.inputType = 'MCQ_BUTTONS';
        
        const correctText = `${capitalize(cat1.label)}: ${count1}, ${capitalize(cat2.label)}: ${count2}, ${capitalize(cat3.label)}: ${count3}`;
        const wrongText1 = `${capitalize(cat1.label)}: ${count1 + 1}, ${capitalize(cat2.label)}: ${count2}, ${capitalize(cat3.label)}: ${count3 - 1}`;
        const wrongText2 = `${capitalize(cat1.label)}: ${count2}, ${capitalize(cat2.label)}: ${count1}, ${capitalize(cat3.label)}: ${count3}`;

        promptObject.content = {
          questionText: "Look at the picture graph below. Which list shows the correct number of items in the graph?",
          finalAnswer: correctText,
          options: [correctText, wrongText1, wrongText2].sort(() => Math.random() - 0.5),
          hint: "Count the symbols for each category row carefully, then match the quantities to the options below.",
          solutionSteps: `Counting the rows one by one shows: ${correctText}. This matches the correct choice list.`
        };
      }

      seedInstructions = isShort || isStructure
        ? `CRITICAL: This is a SHORT ANSWER question. Use questionText: "Look at the picture graph. How many ${cat1.label} are shown in its row?". Do NOT ask to pick from a list. Answer is exactly "${count1}".`
        : `TASK: MCQ. Phrasing: "Which list shows the correct number...". Correct answer: "${cat1.label}: ${count1}, ...".`;
      break;
    }
    
    case 'advanced_missing_data_point': {
      commonMeta.heuristic = 'Missing Data Deduction';
      const count1 = Math.floor(Math.random() * 3) + 2;
      const count2 = Math.floor(Math.random() * 3) + 2;
      const totalKnown = count1 + count2;
      const totalGraph = totalKnown + (Math.floor(Math.random() * 3) + 1); // Ensure item3 has a count
      const missingCount = totalGraph - totalKnown;

      componentData = {
        title: "Mystery Data Chart",
        symbol: cat1.emoji,
        orientation: currentOrientation,
        categories: [
          { label: cat1.label, emoji: cat1.emoji, count: count1 },
          { label: cat2.label, emoji: cat2.emoji, count: count2 },
          { label: `${cat3.label} (Hidden)`, emoji: cat3.emoji, count: 0 }
        ],
        key: "Each picture = 1 item",
        total: totalGraph // Provide total for the graph
      };

      if (isShort || isStructure) {
        promptObject.inputRequirement.inputType = 'STANDARD_TEXT';
        promptObject.content = {
          questionText: `The total number of ${selectedTheme.name} is ${totalGraph}. How many ${cat3.label} are there?`,
          finalAnswer: String(missingCount),
          options: [],
          hint: `First, add up the known categories. Then, subtract that from the total to find the missing part.`,
          solutionSteps: `Known items: ${count1} (${cat1.label}) + ${count2} (${cat2.label}) = ${totalKnown}. Total graph items: ${totalGraph}. Missing ${cat3.label} = ${totalGraph} - ${totalKnown} = ${missingCount}.`
        };
      } else {
        promptObject.content = {
          questionText: `The total number of ${selectedTheme.name} is ${totalGraph}. How many ${cat3.label} are there?`,
          finalAnswer: String(missingCount),
          options: getShuffledOptions(String(missingCount), [String(missingCount + 1), String(missingCount - 1), String(missingCount + 2), String(totalKnown)]),
          hint: `First, add up the known categories. Then, subtract that from the total to find the missing part.`,
          solutionSteps: `Known items: ${count1} (${cat1.label}) + ${count2} (${cat2.label}) = ${totalKnown}. Total graph items: ${totalGraph}. Missing ${cat3.label} = ${totalGraph} - ${totalKnown} = ${missingCount}.`
        };
      }
      seedInstructions = `Deduce missing data point given total.`;
      break;
    }
  }

  if (promptObject.visualEngine.componentToRender) {
    promptObject.visualEngine.componentData = componentData;
  } else {
    delete promptObject.visualEngine;
  }

  const instructions = `
    TASK: Generate a Primary 1 Advanced Picture Graph question.
    VARIANT: ${activeVariant}
    INPUT_MODE: ${isShort || isStructure ? 'SHORT_ANSWER (The student types a number)' : 'MCQ (The student picks from a list)'}
    PEDAGOGY: Use picture graphs with 1-to-1 key ONLY. No multipliers. Focus on multi-step problems, pattern recognition, and data deduction.
    
    CRITICAL PHRASING CONSTRAINTS:
    - If INPUT_MODE is 'SHORT_ANSWER': Your phrasing MUST be direct (e.g., 'How many...'). You MUST NOT use MCQ phrasing ('Which of these...', 'Which list shows...'). Set 'content.options' to an empty array [].
    - If INPUT_MODE is 'MCQ': You may use comparative or selection-based phrasing. 'content.options' must contain 4 unique choices.

    CRITICAL PROMPT SEED CONSTRAINTS:
    - The output JSON object MUST contain 'content.hint' with a child-friendly string. Do not alter or omit this parameter name.
    - 'content.solutionSteps' must be a descriptive string explanation (no nested JSON).
    - ${seedInstructions}
    - Component data: ${componentData ? JSON.stringify(componentData) : 'None'}
    
    OUTPUT MANDATE: Return ONLY valid JSON. Follow the provided JSON template strictly.
    ${JSON.stringify(promptObject)}`;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}