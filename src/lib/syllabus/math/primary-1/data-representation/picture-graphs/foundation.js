/**
 * Foundation Tier: Reading & Comparing Simple Picture Graphs.
 * PATH: src/lib/syllabus/math/primary-1/data-representation/picture-graphs/foundation.js
 */
export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Picture Graphs', type: zodType, difficulty: zodDiff, strand: 'Data Representation', subject: 'Math', gradeLevel: 'P1' };
  const inputType = 'MCQ_BUTTONS';
  let componentData = null;
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender: "PICTURE_GRAPH_DISPLAY" }, inputRequirement: { inputType } };
  let seedInstructions = "";

  // 1. Procedural Theme Pools
  const themes = [
    { name: "fruits", items: ["Apple", "Banana", "Orange", "Grape"], emojis: ["🍎", "🍌", "🍊", "🍇"] },
    { name: "toys", items: ["Car", "Doll", "Ball", "Robot"], emojis: ["🚗", "🧸", "⚽", "🤖"] },
    { name: "pets", items: ["Dog", "Cat", "Fish", "Bird"], emojis: ["🐶", "🐱", "🐠", "🐦"] },
    { name: "vegetables", items: ["Carrot", "Broccoli", "Corn", "Pea"], emojis: ["🥕", "🥦", "🌽", "🫛"] }
  ];

  // 2. Generation Helpers
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const getShuffledOptions = (correct, distractors) => {
    return [correct, ...distractors]
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  };

  const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
  const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
  const themeItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
  const shuffledDisplay = [...themeItems].sort(() => Math.random() - 0.5);

  switch (activeVariant) {
    case 'foundation_read_single_category': {
      commonMeta.heuristic = 'Single Category Reading';
      const counts = [2, 3, 4, 5].sort(() => Math.random() - 0.5);
      const targetIdx = Math.floor(Math.random() * 4);
      const target = shuffledDisplay[targetIdx];

      componentData = {
        title: `Our ${capitalize(selectedTheme.name)}`,
        orientation,
        categories: shuffledDisplay.map((item, i) => ({ ...item, count: counts[i] })),
        key: "Each picture = 1 item"
      };

      promptObject.content = {
        questionText: `Look at the picture graph. How many ${target.label.toLowerCase()} are there?`,
        finalAnswer: String(counts[targetIdx]),
        options: getShuffledOptions(String(counts[targetIdx]), ["1", "0", String(counts[targetIdx] + 1), String(counts[targetIdx] + 2), "6"]),
        hint: `Find the row for ${target.label} and count the pictures one by one!`,
        solutionSteps: `Locate the ${target.label} category. Counting the pictures shown, we find there are ${counts[targetIdx]} ${target.label.toLowerCase()}.`
      };
      seedInstructions = `Identify count of ${target.label} as ${counts[targetIdx]}.`;
      break;
    }

    case 'foundation_compare_two_categories': {
      commonMeta.heuristic = 'Comparison Arithmetic';
      const countA = 5;
      const countB = 2;
      const diff = countA - countB;
      const isAskingMore = Math.random() > 0.5;

      componentData = {
        title: `Our ${capitalize(selectedTheme.name)}`,
        orientation,
        categories: [
          { ...shuffledDisplay[0], count: countA },
          { ...shuffledDisplay[1], count: countB },
          { ...shuffledDisplay[2], count: 3 }
        ],
        key: "Each picture = 1 item"
      };

      promptObject.content = {
        questionText: `How many ${isAskingMore ? 'more' : 'fewer'} ${shuffledDisplay[isAskingMore ? 0 : 1].label.toLowerCase()} are there than ${shuffledDisplay[isAskingMore ? 1 : 0].label.toLowerCase()}?`,
        finalAnswer: String(diff),
        options: getShuffledOptions(String(diff), ["1", "5", "2", "3", String(countA + countB)]),
        hint: `Find both categories and see how many extra pictures the longer row has!`,
        solutionSteps: `There are ${countA} ${shuffledDisplay[0].label.toLowerCase()} and ${countB} ${shuffledDisplay[1].label.toLowerCase()}. To find how many ${isAskingMore ? 'more' : 'fewer'}, we subtract: ${countA} - ${countB} = ${diff}.`
      };
      seedInstructions = `Calculate difference ${diff} between ${shuffledDisplay[0].label} and ${shuffledDisplay[1].label}.`;
      break;
    }

    case 'foundation_total_two_categories': {
      commonMeta.heuristic = 'Additive Composition';
      const c1 = 3;
      const c2 = 4;
      const total = c1 + c2;

      componentData = {
        title: `Our ${capitalize(selectedTheme.name)}`,
        orientation,
        categories: [
          { ...shuffledDisplay[0], count: c1 },
          { ...shuffledDisplay[1], count: c2 },
          { ...shuffledDisplay[2], count: 2 }
        ],
        key: "Each picture = 1 item"
      };

      promptObject.content = {
        questionText: `How many ${shuffledDisplay[0].label.toLowerCase()} and ${shuffledDisplay[1].label.toLowerCase()} are there altogether?`,
        finalAnswer: String(total),
        options: getShuffledOptions(String(total), [String(c1), String(c2), String(total + 1), String(total - 1), "9"]),
        hint: `Count the pictures for both categories and add them together!`,
        solutionSteps: `Count ${c1} for ${shuffledDisplay[0].label} and ${c2} for ${shuffledDisplay[1].label}. Adding them together: ${c1} + ${c2} = ${total}.`
      };
      seedInstructions = `Calculate total ${total} for categories ${shuffledDisplay[0].label} and ${shuffledDisplay[1].label}.`;
      break;
    }

    case 'foundation_most_least_category': {
      commonMeta.heuristic = 'Extreme Identification';
      const counts = [1, 2, 4, 6].sort(() => Math.random() - 0.5);
      const isAskingMost = Math.random() > 0.5;
      
      const targetIdx = isAskingMost ? counts.indexOf(Math.max(...counts)) : counts.indexOf(Math.min(...counts));
      const target = shuffledDisplay[targetIdx];

      componentData = {
        title: `Our ${capitalize(selectedTheme.name)}`,
        orientation,
        categories: shuffledDisplay.map((item, i) => ({ ...item, count: counts[i] })),
        key: "Each picture = 1 item"
      };

      promptObject.content = {
        questionText: `Which ${selectedTheme.name.slice(0, -1)} has the ${isAskingMost ? 'most' : 'least'} items?`,
        finalAnswer: target.label,
        options: shuffledDisplay.map(i => i.label),
        hint: `Look for the row that has the ${isAskingMost ? 'longest' : 'shortest'} line of pictures!`,
        solutionSteps: `By looking at the graph, the ${target.label} row has ${counts[targetIdx]} pictures, which is the ${isAskingMost ? 'most' : 'least'} of all.`
      };
      seedInstructions = `Identify category with ${isAskingMost ? 'MOST' : 'LEAST'} items. Correct is ${target.label}.`;
      break;
    }

    case 'foundation_zero_value_category': {
      commonMeta.heuristic = 'Null Set Recognition';
      const zeroIdx = Math.floor(Math.random() * 4);
      const target = shuffledDisplay[zeroIdx];

      componentData = {
        title: `Our ${capitalize(selectedTheme.name)}`,
        orientation,
        categories: shuffledDisplay.map((item, i) => ({ ...item, count: i === zeroIdx ? 0 : (Math.floor(Math.random() * 3) + 2) })),
        key: "Each picture = 1 item"
      };

      promptObject.content = {
        questionText: `Which ${selectedTheme.name.slice(0, -1)} has no items (zero items) in the picture graph?`,
        finalAnswer: target.label,
        options: shuffledDisplay.map(i => i.label),
        hint: `Look for the row that is completely empty with no pictures at all.`,
        solutionSteps: `The row for ${target.label} has no pictures. This means it has exactly 0 items.`
      };
      seedInstructions = `Identify the zero-value category: ${target.label}.`;
      break;
    }

    case 'foundation_category_match_text': {
      commonMeta.heuristic = 'Value Matching';
      const counts = [1, 2, 3, 5].sort(() => Math.random() - 0.5);
      const targetIdx = Math.floor(Math.random() * 4);
      const target = shuffledDisplay[targetIdx];
      const targetCount = counts[targetIdx];

      componentData = {
        title: `Our ${capitalize(selectedTheme.name)}`,
        orientation,
        categories: shuffledDisplay.map((item, i) => ({ ...item, count: counts[i] })),
        key: "Each picture = 1 item"
      };

      promptObject.content = {
        questionText: `Which category has exactly ${targetCount} items?`,
        finalAnswer: target.label,
        options: shuffledDisplay.map(i => i.label),
        hint: `Count the pictures in each row until you find one with exactly ${targetCount}.`,
        solutionSteps: `We count each row: ${shuffledDisplay.map((item, i) => `${item.label} has ${counts[i]}`).join(', ')}. The ${target.label} row matches ${targetCount}.`
      };
      seedInstructions = `Match count ${targetCount} to category ${target.label}.`;
      break;
    }

    default:
      return foundationLogic('foundation_read_single_category', difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic);
  }

  promptObject.visualEngine.componentData = componentData;

  const instructions = `
    TASK: Generate a Primary 1 Picture Graph foundation question.
    VARIANT: ${activeVariant}
    PEDAGOGY: 1-to-1 key strictly. No multipliers. Simple, direct wording for 6-year-olds.
    
    CRITICAL PROMPT SEED CONSTRAINTS:
    - The output JSON object MUST contain 'content.hint' with a child-friendly string.
    - 'content.solutionSteps' must be a text-only explanation (no nested visual data).
    - ${seedInstructions}
    - Component Data Payload: ${JSON.stringify(componentData)}
    
    OUTPUT MANDATE: Return ONLY valid JSON matching the blueprint structure.
    ${JSON.stringify(promptObject)}`;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}