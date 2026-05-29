/**
 * Standard Tier: Analyzing & Interpreting Picture Graph Keys.
 * PATH: src/lib/syllabus/math/primary-1/data-representation/picture-graphs/standard.js
 */
export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Picture Graphs', type: zodType, difficulty: zodDiff, strand: 'Data Representation', subject: 'Math', gradeLevel: 'P1' };
  const inputType = 'MCQ_BUTTONS';
  let componentData = null;
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender: "PICTURE_GRAPH_DISPLAY" }, inputRequirement: { inputType } };
  let seedInstructions = "";

  // 1. Procedural Theme Pools
  const themes = [
    { name: "fruits", items: ["Apples", "Bananas", "Oranges", "Grapes"], emojis: ["🍎", "🍌", "🍊", "🍇"] },
    { name: "toys", items: ["Cars", "Dolls", "Balls", "Robots"], emojis: ["🚗", "🧸", "⚽", "🤖"] },
    { name: "pets", items: ["Dogs", "Cats", "Fish", "Birds"], emojis: ["🐶", "🐱", "🐠", "🐦"] },
  ];

  // 2. Generation Helpers
  const getRandom = (arr, count) => [...arr].sort(() => Math.random() - 0.5).slice(0, count);
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const getShuffledOptions = (correct, distractors) => {
    return [correct, ...distractors]
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  };

  const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
  const orientation = Math.random() > 0.5 ? 'HORIZONTAL' : 'VERTICAL';
  const uniqueCounts = [1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
  
  const baseCategories = selectedTheme.items.map((name, i) => ({
    label: name,
    emoji: selectedTheme.emojis[i],
    count: uniqueCounts[i]
  }));

  switch (activeVariant) {
    case 'standard_read_all_categories': {
      commonMeta.heuristic = 'Data Parsing';
      const targetIdx = Math.floor(Math.random() * 4);
      const target = baseCategories[targetIdx];
      componentData = { title: `Our ${capitalize(selectedTheme.name)}`, symbol: target.emoji, orientation, categories: baseCategories };

      promptObject.content = {
        questionText: `Look at the graph. How many ${target.label.toLowerCase()} are there?`,
        finalAnswer: String(target.count),
        options: getShuffledOptions(String(target.count), ["2", "4", "5", "7"]),
        hint: `Find the label for ${target.label} and count how many icons are in its line.`,
        solutionSteps: `Locate the ${target.label} category. We can see there are ${target.count} icons, and each stands for 1 item.`
      };
      seedInstructions = `Identify count for ${target.label} as ${target.count}. 1-to-1 scale.`;
      break;
    }

    case 'standard_most_least_frequent': {
      commonMeta.heuristic = 'Extremes Analysis';
      componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };
      
      const askMost = Math.random() > 0.5;
      const target = askMost 
        ? baseCategories.reduce((prev, curr) => (prev.count > curr.count) ? prev : curr)
        : baseCategories.reduce((prev, curr) => (prev.count < curr.count) ? prev : curr);

      promptObject.content = {
        questionText: `Which category has the ${askMost ? 'most' : 'least'} items?`,
        finalAnswer: target.label,
        options: baseCategories.map(c => c.label),
        hint: `Look for the ${askMost ? 'longest' : 'shortest'} line of pictures in the graph.`,
        solutionSteps: `Compare all lines. The ${target.label} line has ${target.count} pictures, which is the ${askMost ? 'highest' : 'lowest'} number.`
      };
      seedInstructions = `Extreme finding: ${askMost ? 'MOST' : 'LEAST'}. Distinct counts used: ${baseCategories.map(c => c.count).join(',')}.`;
      break;
    }

    case 'standard_difference_two_categories': {
      commonMeta.heuristic = 'Subtractive Comparison';
      const [cat1, cat2] = getRandom(baseCategories, 2);
      const diff = Math.abs(cat1.count - cat2.count);
      componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };

      promptObject.content = {
        questionText: `How many more ${cat1.count > cat2.count ? cat1.label.toLowerCase() : cat2.label.toLowerCase()} are there than ${cat1.count > cat2.count ? cat2.label.toLowerCase() : cat1.label.toLowerCase()}?`,
        finalAnswer: String(diff),
        options: getShuffledOptions(String(diff), ["1", "2", "3", "5"]),
        hint: "Count the items in both groups and subtract the smaller number from the bigger number.",
        solutionSteps: `There are ${cat1.count} ${cat1.label.toLowerCase()} and ${cat2.count} ${cat2.label.toLowerCase()}. To find the difference: ${Math.max(cat1.count, cat2.count)} - ${Math.min(cat1.count, cat2.count)} = ${diff}.`
      };
      seedInstructions = `Calculate difference ${diff} between ${cat1.label} and ${cat2.label}. 1-to-1 scale.`;
      break;
    }

    case 'standard_sum_all_categories': {
      commonMeta.heuristic = 'Composite Summation';
      const total = baseCategories.reduce((sum, c) => sum + c.count, 0);
      componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };

      promptObject.content = {
        questionText: `How many ${selectedTheme.name} are there altogether in the graph?`,
        finalAnswer: String(total),
        options: getShuffledOptions(String(total), [String(total - 2), String(total + 3), String(total + 1), String(total - 1)]),
        hint: "You can count every single picture in the whole graph one by one!",
        solutionSteps: `Add up the numbers for all rows: ${baseCategories.map(c => c.count).join(' + ')} = ${total}.`
      };
      seedInstructions = `Total summation of all 4 categories. Total: ${total}.`;
      break;
    }

    case 'standard_combine_two_groups_vs_third': {
      commonMeta.heuristic = 'Additive Comparison';
      const [c1, c2, c3] = getRandom(baseCategories, 3);
      const combined = c1.count + c2.count;
      const isMore = combined > c3.count;
      componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };

      promptObject.content = {
        questionText: `If we combine the ${c1.label.toLowerCase()} and the ${c2.label.toLowerCase()}, are there more than the ${c3.label.toLowerCase()}?`,
        finalAnswer: isMore ? "Yes" : "No",
        options: ["Yes", "No", "Exactly the same"],
        hint: `Add the count of ${c1.label} and ${c2.label} together first, then compare that sum to ${c3.label}.`,
        solutionSteps: `${c1.label} (${c1.count}) + ${c2.label} (${c2.count}) = ${combined}. Since ${combined} is ${isMore ? 'more' : 'less'} than ${c3.count}, the answer is ${isMore ? 'Yes' : 'No'}.`
      };
      seedInstructions = `Sum ${c1.label}+${c2.label} vs ${c3.label}. Result is ${isMore ? 'YES' : 'NO'}.`;
      break;
    }

    case 'standard_fewer_than_threshold': {
      commonMeta.heuristic = 'Threshold Logic';
      const threshold = 4;
      const countBelow = baseCategories.filter(c => c.count < threshold).length;
      componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };

      promptObject.content = {
        questionText: `How many categories have fewer than ${threshold} pictures?`,
        finalAnswer: String(countBelow),
        options: getShuffledOptions(String(countBelow), ["0", "1", "2", "3", "4"]),
        hint: `Look at each row. Count how many rows have a line of pictures shorter than ${threshold}.`,
        solutionSteps: `The counts are: ${baseCategories.map(c => `${c.label}(${c.count})`).join(', ')}. Rows with fewer than ${threshold} are: ${baseCategories.filter(c => c.count < threshold).map(c => c.label).join(', ') || 'none'}.`
      };
      seedInstructions = `Count categories where count < ${threshold}. Answer is ${countBelow}.`;
      break;
    }

    case 'standard_rank_three_categories': {
      commonMeta.heuristic = 'Ordinal Ranking';
      const selection = getRandom(baseCategories, 3);
      const isMostToLeast = Math.random() > 0.5;
      const sorted = [...selection].sort((a, b) => isMostToLeast ? b.count - a.count : a.count - b.count);
      const finalAnswer = sorted.map(c => c.label).join(", ");
      componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };

      promptObject.content = {
        questionText: `Arrange these 3 categories from ${isMostToLeast ? 'most to least' : 'least to most'}: ${selection.map(c => c.label).join(", ")}.`,
        finalAnswer,
        options: getShuffledOptions(finalAnswer, [
          [...sorted].reverse().map(c => c.label).join(", "),
          [sorted[1], sorted[0], sorted[2]].map(c => c.label).join(", "),
          [sorted[0], sorted[2], sorted[1]].map(c => c.label).join(", ")
        ]),
        hint: `Find the number for each item first, then put them in order based on their counts!`,
        solutionSteps: `The counts are: ${selection.map(c => `${c.label}: ${c.count}`).join(', ')}. Ordering them ${isMostToLeast ? 'most to least' : 'least to most'} gives: ${finalAnswer}.`
      };
      seedInstructions = `Rank 3 items: ${isMostToLeast ? 'DESC' : 'ASC'}. Items: ${selection.map(c => c.label).join(',')}.`;
      break;
    }

    case 'standard_equal_value_groups': {
      commonMeta.heuristic = 'Equality Mapping';
      const [c1, c2] = getRandom(baseCategories, 2);
      const twinCount = 5;
      // Force equality
      const categories = baseCategories.map(c => {
        if (c.label === c1.label || c.label === c2.label) return { ...c, count: twinCount };
        return { ...c, count: c.count === twinCount ? 2 : c.count };
      });
      componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories };

      const ans = `${c1.label} and ${c2.label}`;
      promptObject.content = {
        questionText: `Which two categories have the same number of items?`,
        finalAnswer: ans,
        options: getShuffledOptions(ans, [
          `${categories[0].label} and ${categories[2].label}`,
          `${categories[1].label} and ${categories[3].label}`,
          "None of them"
        ]),
        hint: "Look for two rows where the line of pictures is exactly the same length.",
        solutionSteps: `Count every row. ${c1.label} and ${c2.label} both have exactly ${twinCount} pictures.`
      };
      seedInstructions = `Identify twin categories ${c1.label} and ${c2.label} (both ${twinCount}).`;
      break;
    }

    case 'standard_add_item_prediction': {
      commonMeta.heuristic = 'Incremental Change';
      const target = baseCategories[Math.floor(Math.random() * 4)];
      componentData = { title: `Our ${capitalize(selectedTheme.name)}`, orientation, categories: baseCategories };

      promptObject.content = {
        questionText: `If we add 1 more ${target.emoji} to the ${target.label} row, how many ${target.label.toLowerCase()} will there be in total?`,
        finalAnswer: String(target.count + 1),
        options: getShuffledOptions(String(target.count + 1), [String(target.count), String(target.count - 1), String(target.count + 2)]),
        hint: `Count the ${target.label} currently in the graph and then add 1 more!`,
        solutionSteps: `There are currently ${target.count} ${target.label.toLowerCase()}. Adding one more: ${target.count} + 1 = ${target.count + 1}.`
      };
      seedInstructions = `Predict X+1 for ${target.label} (Current: ${target.count}).`;
      break;
    }
  }

  promptObject.visualEngine.componentData = componentData;

  const instructions = `
    TASK: Generate a Primary 1 Picture Graph standard question.
    VARIANT: ${activeVariant}
    PEDAGOGY: 1-to-1 scale ONLY (Primary 1 requirement). No multipliers (e.g., Each icon = 2). 
    
    CRITICAL PROMPT SEED CONSTRAINTS:
    - Output JSON object MUST contain 'content.hint' (child-friendly).
    - 'content.solutionSteps' must be clear text (no nested JSON/visual components).
    - ${seedInstructions}
    - Component Data: ${JSON.stringify(componentData)}
    
    OUTPUT MANDATE: Return ONLY valid JSON.
    ${JSON.stringify(promptObject)}`;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}