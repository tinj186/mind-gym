/**
 * Advanced Tier: Multi-step Problems & Predictions.
 * PATH: src/lib/syllabus/math/primary-1/data-representation/picture-graphs/advanced.js
 */
export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Picture Graphs', type: zodType, difficulty: zodDiff, strand: 'Data Representation', subject: 'Math', gradeLevel: 'P1' };
  const inputType = isShort || isStructure ? 'SHORT_ANSWER' : 'MCQ_BUTTONS';
  let componentData = null;
  let promptObject = { meta: commonMeta, content: {}, visualEngine: { componentToRender: "PICTURE_GRAPH_DISPLAY" }, inputRequirement: { inputType } };
  let seedInstructions = "";

  // Procedural Pools
  const themes = [
    { name: "fruits", items: ["Apples", "Bananas", "Oranges", "Grapes", "Mangoes"], emojis: ["🍎", "🍌", "🍊", "🍇", "🥭"] },
    { name: "toys", items: ["Cars", "Dolls", "Balls", "Robots", "Trains"], emojis: ["🚗", "🧸", "⚽", "🤖", "🚂"] },
    { name: "pets", items: ["Dogs", "Cats", "Fish", "Birds", "Hamsters"], emojis: ["🐶", "🐱", "🐠", "🐦", "🐹"] },
  ];

  // Generation Helpers
  const getRandom = (arr, count) => [...arr].sort(() => Math.random() - 0.5).slice(0, count);
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const getShuffledOptions = (correct, distractors) => {
    return [correct, ...distractors].sort(() => Math.random() - 0.5);
  };

  // Prepare Randomized Data (Fixed Pairing)
  const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
  const pairedItems = selectedTheme.items.map((name, i) => ({ label: name, emoji: selectedTheme.emojis[i] }));
  const [cat1, cat2, cat3] = getRandom(pairedItems, 3);
  const currentOrientation = Math.random() > 0.5 ? "HORIZONTAL" : "VERTICAL";

  switch (activeVariant) {
    // ==========================================
    // EXISTING WORKING VARIANTS
    // ==========================================
    case 'advanced_multi_step_problem': {
      commonMeta.heuristic = 'Multi-Step Analysis';
      const count1 = Math.floor(Math.random() * 4) + 3; 
      const count2 = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const count3 = Math.floor(Math.random() * 2) + 1; // 1 to 2

      componentData = {
        title: `Our ${capitalize(selectedTheme.name)} Chart`,
        symbol: cat1.emoji,
        orientation: currentOrientation,
        categories: [
          { label: cat1.label, emoji: cat1.emoji, count: count1 },
          { label: cat2.label, emoji: cat2.emoji, count: count2 },
          { label: cat3.label, emoji: cat3.emoji, count: count3 }
        ]
      };

      const finalValue = (count1 + count2) - count3;

      promptObject.content = {
        questionText: `How many ${cat1.label} and ${cat2.label} are there altogether? Take away the number of ${cat3.label}, what is the final count?`,
        finalAnswer: String(finalValue),
        options: isShort || isStructure ? [] : getShuffledOptions(String(finalValue), [String(finalValue + 1), String(finalValue - 1), String(count1 + count2)]),
        hint: `First, add the counts of ${cat1.label} and ${cat2.label}. Then, subtract the count of ${cat3.label} from that total.`,
        solutionSteps: `There are ${count1} ${cat1.label} and ${count2} ${cat2.label}. Combined total = ${count1} + ${count2} = ${count1 + count2}. Take away ${count3} ${cat3.label}s: ${count1 + count2} - ${count3} = ${finalValue}.`
      };
      seedInstructions = `Solve multi-step math expression: (${cat1.label} + ${cat2.label}) - ${cat3.label}.`;
      break;
    }

    case 'advanced_predict_next_category': {
      commonMeta.heuristic = 'Pattern Extrapolation';
      const count1 = Math.floor(Math.random() * 2) + 1; // 1 or 2
      const step = Math.floor(Math.random() * 2) + 1;  // 1 or 2
      const count2 = count1 + step;
      const count3 = count2 + step;
      const nextPatternValue = count3 + step;

      componentData = {
        title: `Weekly Collection Pattern`,
        symbol: cat1.emoji,
        orientation: "HORIZONTAL",
        categories: [
          { label: "Week 1", emoji: cat1.emoji, count: count1 },
          { label: "Week 2", emoji: cat1.emoji, count: count2 },
          { label: "Week 3", emoji: cat1.emoji, count: count3 }
        ]
      };

      promptObject.content = {
        questionText: `Look at the pattern across Week 1, Week 2, and Week 3. If the pattern continues, how many items should be drawn for Week 4?`,
        finalAnswer: String(nextPatternValue),
        options: isShort || isStructure ? [] : getShuffledOptions(String(nextPatternValue), [String(nextPatternValue + 1), String(nextPatternValue - 1), String(count3)]),
        hint: `Find the difference between consecutive weeks. See how much the graph grows each week!`,
        solutionSteps: `The counts are Week 1: ${count1}, Week 2: ${count2}, Week 3: ${count3}. The graph increases by ${step} each week. Following this rule, Week 4 will have ${count3} + ${step} = ${nextPatternValue}.`
      };
      seedInstructions = `Identify the pattern increment (${step}) and predict the next value.`;
      break;
    }

    case 'advanced_create_graph_from_data': {
      commonMeta.heuristic = 'Data-to-Graph Alignment';
      const count1 = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const count2 = Math.floor(Math.random() * 4) + 2;
      const count3 = Math.floor(Math.random() * 4) + 2;

      componentData = {
        title: `Store Inventory`,
        symbol: cat1.emoji,
        orientation: currentOrientation,
        categories: [
          { label: cat1.label, emoji: cat1.emoji, count: count1 },
          { label: cat2.label, emoji: cat2.emoji, count: count2 },
          { label: cat3.label, emoji: cat3.emoji, count: count3 }
        ]
      };

      if (isShort || isStructure) {
        promptObject.content = {
          questionText: `Look at the picture graph. Based on the symbols shown, how many total ${cat1.label} are recorded?`,
          finalAnswer: String(count1),
          options: [],
          hint: `Find the row labeled ${cat1.label} and count how many symbols are drawn next to it.`,
          solutionSteps: `Looking closely at the graph rows, the category line for ${cat1.label} contains exactly ${count1} symbols.`
        };
      } else {
        const correctText = `${cat1.label}: ${count1}, ${cat2.label}: ${count2}, ${cat3.label}: ${count3}`;
        const wrongText1 = `${cat1.label}: ${count1 + 1}, ${cat2.label}: ${count2}, ${cat3.label}: ${count3 - 1}`;

        promptObject.content = {
          questionText: "Look at the picture graph below. Which list shows the correct number of items in the graph?",
          finalAnswer: correctText,
          options: getShuffledOptions(correctText, [wrongText1, `${cat1.label}: ${count2}, ${cat2.label}: ${count1}, ${cat3.label}: ${count3}`]),
          hint: "Count the symbols for each category row carefully, then match the quantities to the choices below.",
          solutionSteps: `Counting the rows one by one shows: ${correctText}. This matches the correct option list.`
        };
      }
      break;
    }

    case 'advanced_missing_data_point': {
      commonMeta.heuristic = 'Data Deduction';
      const count1 = Math.floor(Math.random() * 4) + 2; 
      const count2 = Math.floor(Math.random() * 4) + 2; 
      const missingCount = Math.floor(Math.random() * 3) + 2; 
      const totalGraph = count1 + count2 + missingCount;

      componentData = {
        title: `Total Count: ${totalGraph}`,
        symbol: cat1.emoji,
        orientation: "HORIZONTAL",
        categories: [
          { label: cat1.label, emoji: cat1.emoji, count: count1 },
          { label: cat2.label, emoji: cat2.emoji, count: count2 },
          { label: `${cat3.label} (Hidden)`, emoji: cat3.emoji, count: 0 }
        ]
      };

      const totalKnown = count1 + count2;

      promptObject.content = {
        questionText: `The grand total number of items shown on the graph is ${totalGraph}, but the row for ${cat3.label} is blank. How many items belong in the ${cat3.label} category row?`,
        finalAnswer: String(missingCount),
        options: isShort || isStructure ? [] : getShuffledOptions(String(missingCount), [String(missingCount + 1), String(missingCount - 1), String(totalKnown)]),
        hint: `First, add up the known categories. Then, subtract that from the total to find the missing part.`,
        solutionSteps: `Known items: ${count1} (${cat1.label}) + ${count2} (${cat2.label}) = ${totalKnown}. Total graph items: ${totalGraph}. Missing ${cat3.label} = ${totalGraph} - ${totalKnown} = ${missingCount}.`
      };
      seedInstructions = `Deduce missing data point given total.`;
      break;
    }

    // ==========================================
    // 6 NEWLY ADDED ADVANCED VARIANTS
    // ==========================================
    case 'advanced_clue_deduction_riddle': {
      commonMeta.heuristic = 'Logical Deduction';
      const count1 = Math.floor(Math.random() * 3) + 4; // 4-6
      const diff = Math.floor(Math.random() * 2) + 2; // 2-3
      const count2 = count1 - diff;

      componentData = {
        title: "Deduction Clue Graph",
        symbol: cat1.emoji,
        orientation: currentOrientation,
        categories: [
          { label: cat1.label, emoji: cat1.emoji, count: count1 },
          { label: cat2.label, emoji: cat2.emoji, count: count2 }
        ]
      };

      promptObject.content = {
        questionText: `Riddle Hint: There are ${count1} ${cat1.label}s on our graph. There are exactly ${diff} fewer ${cat2.label}s than ${cat1.label}s. Based on this rule, what is the count for ${cat2.label}?`,
        finalAnswer: String(count2),
        options: isShort || isStructure ? [] : getShuffledOptions(String(count2), [String(count1), String(count2 + 1), String(count1 + diff)]),
        hint: `Fewer means you subtract. Take away ${diff} from the count of ${cat1.label} (${count1}).`,
        solutionSteps: `Starting with ${count1} ${cat1.label}s, subtract ${diff} because there are fewer ${cat2.label}s. This gives: ${count1} - ${diff} = ${count2}.`
      };
      seedInstructions = `Solve deduction riddle using graph values.`;
      break;
    }

    case 'advanced_total_graph_redistribution': {
      commonMeta.heuristic = 'Data Balance';
      const move = Math.floor(Math.random() * 2) + 1; // 1 or 2
      const targetVal = Math.floor(Math.random() * 3) + 3; // 3 to 5
      const c1 = targetVal + move;
      const c2 = targetVal - move;

      componentData = {
        title: "Sharing Balance Graph",
        symbol: cat1.emoji,
        orientation: currentOrientation,
        categories: [
          { label: cat1.label, emoji: cat1.emoji, count: c1 },
          { label: cat2.label, emoji: cat2.emoji, count: c2 }
        ]
      };

      promptObject.content = {
        questionText: `How many items must move from ${cat1.label} to ${cat2.label} so that both rows have the same number?`,
        finalAnswer: String(move),
        options: isShort || isStructure ? [] : getShuffledOptions(String(move), [String(move + 1), String(move + 2), String(c1 - c2)]),
        hint: `Find the total items first, then see what half of that would be.`,
        solutionSteps: `Total = ${c1} + ${c2} = ${c1 + c2}. For rows to be equal, both need ${(c1 + c2) / 2}. Moving ${move} from the ${c1} row leaves ${(c1 + c2) / 2}.`
      };
      break;
    }

    case 'advanced_comparative_sum_groups': {
      commonMeta.heuristic = 'Comparative Balancing';
      const count1 = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const count2 = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const balanceNeeded = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const count3 = count1 + count2 + balanceNeeded;

      componentData = {
        title: "Collection Targets",
        symbol: cat1.emoji,
        orientation: currentOrientation,
        categories: [
          { label: cat1.label, emoji: cat1.emoji, count: count1 },
          { label: cat2.label, emoji: cat2.emoji, count: count2 },
          { label: cat3.label, emoji: cat3.emoji, count: count3 }
        ]
      };

      promptObject.content = {
        questionText: `How many MORE icons must be added to ${cat1.label} and ${cat2.label} rows combined to equal ${cat3.label}?`,
        finalAnswer: String(balanceNeeded),
        options: isShort || isStructure ? [] : getShuffledOptions(String(balanceNeeded), [String(balanceNeeded + 1), String(count3), String(count1 + count2)]),
        hint: `Add up the items in the first two rows, then find the difference to the third row.`,
        solutionSteps: `${cat1.label} + ${cat2.label} = ${count1} + ${count2} = ${count1 + count2}. Target is ${count3}. Difference = ${count3} - ${count1 + count2} = ${balanceNeeded}.`
      };
      break;
    }

    case 'advanced_data_entry_mistake': {
      commonMeta.heuristic = 'Error Verification';
      const targetCat = cat1;
      const otherCat = cat2;
      
      const accurateCount = Math.floor(Math.random() * 4) + 3; // 3 to 6
      const extraCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 extra symbols
      const flawedCount = accurateCount + extraCount;

      componentData = {
        title: "Inventory Checklist",
        symbol: targetCat.emoji,
        orientation: currentOrientation,
        categories: [
          { label: targetCat.label, emoji: targetCat.emoji, count: flawedCount },
          { label: otherCat.label, emoji: otherCat.emoji, count: Math.floor(Math.random() * 3) + 2 }
        ]
      };

      const ans = String(extraCount);
      promptObject.content = {
        questionText: "", // Left blank for AI narrative generation
        finalAnswer: ans,
        options: isShort || isStructure ? [] : getShuffledOptions(ans, [String(extraCount + 1), String(accurateCount), "0"]),
        hint: `Compare the target number in the story to the number of pictures you count in the graph.`,
        solutionSteps: `The story says there should be ${accurateCount} ${targetCat.label.toLowerCase()}. Counting the graph, we see ${flawedCount} symbols. The difference is ${flawedCount} - ${accurateCount} = ${extraCount} extra symbols.`
      };
      seedInstructions = `Write a short, engaging story where someone (e.g., 'Sam' or 'Teacher Lee') is checking their data list for ${targetCat.label.toLowerCase()}. Their list says they should have exactly ${accurateCount}, but they accidentally drew ${flawedCount} in the graph. Ask the student how many EXTRA symbols were drawn in the graph.`;
      break;
    }

    case 'advanced_backwards_tracking_total': {
      commonMeta.heuristic = 'Total Deductive Reduction';
      const c1 = Math.floor(Math.random() * 3) + 2; 
      const c2 = Math.floor(Math.random() * 3) + 1; 
      const hidden = Math.floor(Math.random() * 4) + 2;
      const totalValue = c1 + c2 + hidden;

      componentData = {
        title: "Total Tracking Assessment",
        symbol: cat1.emoji,
        orientation: "HORIZONTAL",
        categories: [
          { label: cat1.label, emoji: cat1.emoji, count: c1 },
          { label: cat2.label, emoji: cat2.emoji, count: c2 },
          { label: `${cat3.label} (Unknown)`, emoji: cat3.emoji, count: 0 }
        ]
      };

      promptObject.content = {
        questionText: `The total items is ${totalValue}. Based on the other rows, what is the count for the unknown ${cat3.label} row?`,
        finalAnswer: String(hidden),
        options: isShort || isStructure ? [] : getShuffledOptions(String(hidden), [String(hidden + 1), String(c1 + c2), "0"]),
        hint: `Subtract all the items you can see from the total of ${totalValue}.`,
        solutionSteps: `Total (${totalValue}) - ${cat1.label} (${c1}) - ${cat2.label} (${c2}) = ${hidden}.`
      };
      break;
    }

    case 'advanced_hypothetical_sharing': {
      commonMeta.heuristic = 'Post-Scenario Deduction';
      const shared = Math.floor(Math.random() * 2) + 2; // 2 or 3
      const c1 = Math.floor(Math.random() * 3) + 4; // 4 to 6
      const c2 = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const total = c1 + c2;

      componentData = {
        title: "Playroom Graph",
        symbol: cat1.emoji,
        orientation: "HORIZONTAL",
        categories: [
          { label: cat1.label, emoji: cat1.emoji, count: c1 },
          { label: cat2.label, emoji: cat2.emoji, count: c2 }
        ]
      };

      promptObject.content = {
        questionText: `If ${shared} items from the ${cat1.label} row are given away, how many items are left in the whole graph?`,
        finalAnswer: String(total - shared),
        options: isShort || isStructure ? [] : getShuffledOptions(String(total - shared), [String(total), String(c1 - shared), String(c2)]),
        hint: `Find the total number of items first, then subtract the ${shared} items that were given away.`,
        solutionSteps: `Total = ${c1} + ${c2} = ${total}. Subtracting the ${shared} given away: ${total} - ${shared} = ${total - shared}.`
      };
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
    PEDAGOGY: 1-to-1 scale ONLY (Primary 1 requirement). Absolutely NO multipliers (e.g., do NOT use "Each icon stands for 5"). Each symbol must represent exactly 1 item.
    
    CRITICAL PHRASING CONSTRAINTS:
    - If INPUT_MODE is 'SHORT_ANSWER': Your phrasing MUST be direct (e.g., 'How many...'). You MUST NOT use MCQ phrasing ('Which of these...', 'Which list shows...'). Set 'content.options' to an empty array [].
    - If INPUT_MODE is 'MCQ': You may use comparative or selection-based phrasing. 'content.options' must contain unique choices.

    CRITICAL PROMPT SEED CONSTRAINTS:
    - The output JSON object MUST contain 'content.hint' with a child-friendly string. Do not alter or omit this parameter name.
    - 'content.solutionSteps' must be a descriptive string explanation (no nested JSON).
    - ${seedInstructions}
    - Component data: ${componentData ? JSON.stringify(componentData) : 'None'}
    
    OUTPUT MANDATE: Return ONLY valid JSON. Follow the provided JSON template strictly.
    ${JSON.stringify(promptObject)}`;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}